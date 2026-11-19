import { CommonModule, Location } from '@angular/common';
import {
  Component,
  DestroyRef,
  Input,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormRecord,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { catchError, defer, finalize, forkJoin, map, of, Subject, switchMap } from 'rxjs';

import { onExportToExcel } from 'src/app/_metronic/layout/core/utilities';
import {
  DataTableComponent,
  dataTableExportRows,
} from 'src/app/modules/shared/components/data-table/data-table.component';
import { FeatureTitleComponent } from 'src/app/modules/shared/components/feature-title/feature-title.component';
import { FieldErrorComponent } from 'src/app/modules/shared/components/field-error/field-error.component';
import { PrimaryActionButtonComponent } from 'src/app/modules/shared/components/primary-action-button/primary-action-button.component';
import { ReportActionsComponent } from 'src/app/modules/shared/components/report-actions/report-actions.component';
import { ReportPageComponent } from 'src/app/modules/shared/components/report-page/report-page.component';
import { StateMessageComponent } from 'src/app/modules/shared/components/state-message/state-message.component';
import { SummaryCardsComponent } from 'src/app/modules/shared/components/summary-cards/summary-cards.component';
import { DatePickerDirective } from 'src/app/modules/shared/directives/date-picker.directive';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { ReportPrintService } from 'src/app/modules/shared/service/report-print.service';
import { apiErrorMessage } from 'src/app/modules/shared/utils/api-error';
import {
  dateRangeValidator,
  dateValueValidator,
  formatDisplayDate,
  parseDateRange,
  parseDateValue,
  parseMonthValue,
} from 'src/app/modules/shared/utils/date-utils';
import { focusField } from 'src/app/modules/shared/utils/focus-field';
import {
  AccountReportConfig,
  AccountReportFilterDefinition,
  AccountReportFilterOption,
  AccountReportFilterRaw,
  AccountReportFilterValue,
  AccountReportSection,
} from './account-report.models';

interface ReportRequest<TFilter extends object> {
  filter: TFilter;
  raw: AccountReportFilterRaw;
}

interface ReportOutcome<TResponse extends object, TFilter extends object> {
  request: ReportRequest<TFilter>;
  response?: TResponse;
  declaredMessage?: string;
  error?: unknown;
}

@Component({
  selector: 'app-account-report-page',
  standalone: true,
  imports: [
    CalendarModule,
    CheckboxModule,
    CommonModule,
    DataTableComponent,
    DatePickerDirective,
    DropdownModule,
    FeatureTitleComponent,
    FieldErrorComponent,
    InputTextModule,
    InputNumberModule,
    PrimaryActionButtonComponent,
    ReactiveFormsModule,
    ReportActionsComponent,
    ReportPageComponent,
    StateMessageComponent,
    SummaryCardsComponent,
    TranslateModule,
  ],
  templateUrl: './account-report-page.component.html',
  styleUrl: './account-report-page.component.scss',
  host: { class: 'sigma-route-host sigma-print-flow' },
})
export class AccountReportPageComponent<
  TResponse extends object,
  TFilter extends object,
  TRow extends object,
> extends BaseComponentService implements OnInit {
  @Input({ required: true }) config!: AccountReportConfig<TResponse, TFilter, TRow>;

  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);
  private readonly reportPrint = inject(ReportPrintService);
  private readonly location = inject(Location);
  private readonly requests = new Subject<ReportRequest<TFilter>>();
  private readonly printSession = this.reportPrint.createSession(this.destroyRef);
  private readonly sectionRowCache = new WeakMap<AccountReportSection<TRow>, TRow[]>();

  readonly printing = this.printSession.printing;
  readonly filterForm = new FormRecord<FormControl<AccountReportFilterValue>>({});
  readonly response = signal<TResponse | null>(null);
  readonly appliedFilters = signal<AccountReportFilterRaw>({});
  readonly loadingReport = signal(false);
  readonly loadingLookups = signal(false);
  readonly lookupErrors = signal<ReadonlySet<string>>(new Set());
  readonly lookupOptions = signal<Readonly<Record<string, ReadonlyArray<AccountReportFilterOption>>>>({});
  readonly errorMessage = signal('');
  readonly hasSearched = signal(false);

  readonly sections = computed<ReadonlyArray<AccountReportSection<TRow>>>(() => {
    const response = this.response();
    return response ? this.config.sections(response, this.appliedFilters()) : [];
  });
  readonly summaryCards = computed(() => {
    const response = this.response();
    return response && this.config.summaryCards ? this.config.summaryCards(response) : [];
  });
  readonly responseContext = computed(() => {
    const response = this.response();
    return response && this.config.responseContext ? this.config.responseContext(response) : '';
  });
  readonly rowCount = computed(() =>
    this.sections().reduce((count, section) => count + this.flattenRows(section).length, 0),
  );
  readonly hasRequiredLookupError = computed(() =>
    this.config.filters.some(
      (filter) => filter.requiredLookup && this.lookupErrors().has(filter.key),
    ),
  );

  ngOnInit(): void {
    this.initializeForm();
    this.bindRequests();
    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.invalidateOutput());
    this.loadLookups(this.config.autoSearch ?? false);
  }

  controlId(filter: AccountReportFilterDefinition): string {
    return `${this.config.id}-${filter.key}`;
  }

  optionsFor(filter: AccountReportFilterDefinition): AccountReportFilterOption[] {
    const options = filter.options ?? this.lookupOptions()[filter.key] ?? [];
    return options.map((option) => ({
      ...option,
      label: option.labelKey ? this.translate.instant(option.labelKey) : option.label,
    }));
  }

  search(): void {
    if (this.printing() || this.loadingReport() || this.loadingLookups() || this.hasRequiredLookupError()) return;
    const raw = this.rawFilters();
    const result = this.config.buildFilter(raw);
    if (this.filterForm.invalid || !result.filter) {
      this.filterForm.markAllAsTouched();
      this.errorMessage.set(result.errorKey || 'accountReports.invalidFilters');
      const focusKey = result.focusKey || Object.keys(this.filterForm.controls).find(key => this.filterForm.controls[key].invalid);
      if (focusKey) focusField(`${this.config.id}-${focusKey}`);
      return;
    }

    this.errorMessage.set('');
    this.response.set(null);
    this.hasSearched.set(true);
    this.loadingReport.set(true);
    this.filterForm.disable({ emitEvent: false });
    this.loading.startLoading();
    this.requests.next({ filter: result.filter, raw });
  }

  refresh(): void {
    this.search();
  }

  reset(): void {
    if (this.printing() || this.loadingReport() || this.loadingLookups()) return;
    const values: Record<string, AccountReportFilterValue> = {};
    this.config.filters.forEach((filter) => {
      values[filter.key] = this.cloneValue(filter.initialValue);
    });
    this.filterForm.reset(values);
    this.invalidateOutput();
  }

  retryLookups(): void {
    if (this.printing() || this.loadingReport() || this.loadingLookups()) return;
    this.loadLookups(false);
  }

  print(): void {
    if (this.response() && this.rowCount() && !this.printing() && !this.loadingReport() && !this.loadingLookups()) this.printSession.print();
  }

  export(): void {
    if (this.printing() || this.loadingReport() || this.loadingLookups()) return;
    const response = this.response();
    if (!response || !this.rowCount()) return;
    const translate = (key: string): string => this.translate.instant(key);
    const sections = this.sections();
    const rows = this.config.exportRows
      ? this.config.exportRows(response, sections, translate)
      : this.defaultExportRows(sections, translate);
    if (rows.length) onExportToExcel(signal(rows), this.config.exportFileName);
  }

  back(): void {
    if (this.printing() || this.loadingReport() || this.loadingLookups()) return;
    this.location.back();
  }

  appliedFilterItems(): ReadonlyArray<{ labelKey: string; value: string }> {
    const raw = this.appliedFilters();
    return this.config.filters
      .map((filter) => ({ labelKey: filter.labelKey, value: this.filterDisplay(filter, raw[filter.key]) }))
      .filter((item) => !!item.value);
  }

  private initializeForm(): void {
    this.config.filters.forEach((filter) => {
      this.filterForm.addControl(
        filter.key,
        new FormControl<AccountReportFilterValue>(
          this.cloneValue(filter.initialValue),
          { validators: this.validatorsFor(filter) },
        ),
      );
    });
  }
  sectionRows(section: AccountReportSection<TRow>): TRow[] {
    let rows = this.sectionRowCache.get(section);
    if (!rows) {
      rows = [...section.rows];
      this.sectionRowCache.set(section, rows);
    }
    return rows;
  }

  private validatorsFor(filter: AccountReportFilterDefinition): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (filter.required) validators.push(Validators.required);
    if (filter.kind === 'date-range') validators.push(dateRangeValidator);
    if (filter.kind === 'date') validators.push(dateValueValidator);
    if (filter.kind === 'month') {
      validators.push((control) => {
        if (control.value === null || control.value === '') return filter.required ? { required: true } : null;
        return parseMonthValue(control.value as Date | string | null) ? null : { date: true };
      });
    }
    if (filter.min !== undefined) validators.push(Validators.min(filter.min));
    if (filter.max !== undefined) validators.push(Validators.max(filter.max));
    if (filter.kind === 'number') {
      validators.push(control => control.value == null ||
        (typeof control.value === 'number' && Number.isFinite(control.value) && Number.isInteger(control.value))
        ? null : { number: true });
    }
    if (filter.kind === 'select') {
      validators.push(control => control.value == null ||
        this.optionsFor(filter).some(option => option.value === control.value)
        ? null : { invalidSelection: true });
    }
    return validators;
  }

  private bindRequests(): void {
    this.requests
      .pipe(
        switchMap((request) =>
          defer(() => this.config.load(request.filter)).pipe(
            map((result): ReportOutcome<TResponse, TFilter> => {
              if (result.isSuccess && result.entity) {
                return {
                  request,
                  response: this.config.normalizeResponse
                    ? this.config.normalizeResponse(result.entity)
                    : result.entity,
                };
              }
              return { request, declaredMessage: result.message };
            }),
            catchError((error) => of({ request, error } as ReportOutcome<TResponse, TFilter>)),
            finalize(() => {
              this.loadingReport.set(false);
              this.filterForm.enable({ emitEvent: false });
              this.loading.endLoading();
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((outcome) => {
        if (outcome.response) {
          this.response.set(outcome.response);
          this.appliedFilters.set(outcome.request.raw);
          this.errorMessage.set('');
          return;
        }
        this.response.set(null);
        this.appliedFilters.set({});
        this.errorMessage.set(
          outcome.error
            ? apiErrorMessage(outcome.error, this.config.loadErrorKey || 'accountReports.loadError')
            : outcome.declaredMessage || this.config.loadErrorKey || 'accountReports.loadError',
        );
      });
  }

  private loadLookups(autoSearch: boolean): void {
    const definitions = this.config.filters.filter((filter) => !!filter.loadOptions);
    if (!definitions.length) {
      if (autoSearch) queueMicrotask(() => this.search());
      return;
    }

    this.loadingLookups.set(true);
    forkJoin(
      definitions.map((filter) =>
        filter.loadOptions!().pipe(
          map((result) => ({ filter, result })),
          catchError((error) => of({ filter, error })),
        ),
      ),
    )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingLookups.set(false)),
      )
      .subscribe((outcomes) => {
        const options = { ...this.lookupOptions() };
        const errors = new Set<string>();
        outcomes.forEach((outcome) => {
          if ('result' in outcome && outcome.result.isSuccess) {
            options[outcome.filter.key] = (outcome.result.entities ?? []).map((item) => ({
              value: item.id,
              label: item.value,
            }));
          } else {
            errors.add(outcome.filter.key);
            options[outcome.filter.key] = [];
          }
        });
        this.lookupOptions.set(options);
        this.lookupErrors.set(errors);
        definitions.forEach(filter => this.filterForm.controls[filter.key].updateValueAndValidity({ emitEvent: false }));
        if (autoSearch && !errors.size) queueMicrotask(() => this.search());
      });
  }

  private invalidateOutput(): void {
    this.response.set(null);
    this.appliedFilters.set({});
    this.hasSearched.set(false);
    this.errorMessage.set('');
  }

  private rawFilters(): AccountReportFilterRaw {
    const raw = this.filterForm.getRawValue();
    const result: Record<string, AccountReportFilterValue> = {};
    Object.keys(raw).forEach((key) => {
      result[key] = this.cloneValue(raw[key]);
    });
    return result;
  }

  private cloneValue(value: AccountReportFilterValue): AccountReportFilterValue {
    if (Array.isArray(value)) return value.map((item) => new Date(item)) as Date[];
    return value instanceof Date ? new Date(value) : value;
  }

  private flattenRows(section: AccountReportSection<TRow>): TRow[] {
    const rows: TRow[] = [];
    const visit = (source: ReadonlyArray<TRow>): void => {
      source.forEach((row) => {
        rows.push(row);
        const children = section.hierarchy?.children(row) ?? [];
        if (children.length) visit(children);
      });
    };
    visit(section.rows);
    return rows;
  }

  private defaultExportRows(
    sections: ReadonlyArray<AccountReportSection<TRow>>,
    translate: (key: string) => string,
  ): Array<Record<string, string | number>> {
    const sectionHeader = translate('accountReports.section');
    const includeSection = sections.length > 1;
    const rows: Array<Record<string, string | number>> = [];
    sections.forEach((section) => {
      const title = section.titleKey ? translate(section.titleKey) : translate(this.config.titleKey);
      dataTableExportRows(this.flattenRows(section), section.columns, translate).forEach((row) => {
        rows.push(includeSection ? { [sectionHeader]: title, ...row } : row);
      });
    });
    return rows;
  }

  private filterDisplay(filter: AccountReportFilterDefinition, value: AccountReportFilterValue): string {
    if (value === undefined || value === null || value === '' || value === false) return '';
    if (filter.kind === 'date-range') {
      const [from, to] = parseDateRange(value);
      return from && to ? `${formatDisplayDate(from)} – ${formatDisplayDate(to)}` : '';
    }
    if (filter.kind === 'date') {
      const date = parseDateValue(value);
      return date ? formatDisplayDate(date) : '';
    }
    if (filter.kind === 'month') return parseMonthValue(value as Date | string | null) ?? '';
    if (filter.kind === 'select') {
      return this.optionsFor(filter).find((option) => option.value === value)?.label ?? String(value);
    }
    if (filter.kind === 'checkbox') return this.translate.instant('general.yes');
    return String(value);
  }
}
