import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormRecord, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { Observable, Subscription, finalize, of, switchMap, throwError } from 'rxjs';
import { onExportToExcel } from 'src/app/_metronic/layout/core/utilities';
import { FiscalYearService } from 'src/app/modules/Accounts/FiscalYears/services/fiscalYear.service';
import { EditableCollectionRowDirective, EditableCollectionTableColumn, EditableCollectionTableComponent } from 'src/app/modules/shared/components/editable-collection-table/editable-collection-table.component';
import { FeatureTitleComponent } from 'src/app/modules/shared/components/feature-title/feature-title.component';
import { FieldErrorComponent } from 'src/app/modules/shared/components/field-error/field-error.component';
import { PrimaryActionButtonComponent } from 'src/app/modules/shared/components/primary-action-button/primary-action-button.component';
import { StateMessageComponent } from 'src/app/modules/shared/components/state-message/state-message.component';
import { SummaryCardsComponent } from 'src/app/modules/shared/components/summary-cards/summary-cards.component';
import { SummaryCard } from 'src/app/modules/shared/components/summary-cards/summary-card.model';
import { FilterPanelComponent } from 'src/app/modules/shared/components/filter-panel/filter-panel.component';
import { FilterActionsDirective } from 'src/app/modules/shared/components/filter-panel/filter-panel.directives';
import { DropDownSelect } from 'src/app/modules/shared/models/dropdown-select';
import { Results } from 'src/app/modules/shared/models/results';
import { MoneyPipe } from 'src/app/modules/shared/pipes/money.pipe';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { ConfirmationDialogService } from 'src/app/modules/shared/service/confirmation-dialog.service';
import { apiErrorMessage } from 'src/app/modules/shared/utils/api-error';
import { focusField } from 'src/app/modules/shared/utils/focus-field';
import { ACCOUNT_TYPES, BudgetDTO, BudgetEntry, BudgetFilter, BudgetPeriod, BudgetRow } from '../../models/budget';
import { BudgetService } from '../../services/budget.service';

interface BudgetEditorRow {
  source: BudgetRow;
  amounts: FormRecord<FormControl<number | null>>;
}
const finiteAmount: ValidatorFn = control => control.value == null || Number.isFinite(control.value) ? null : { number: true };

@Component({
  selector: 'app-budget', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, DropdownModule, InputNumberModule,
    EditableCollectionTableComponent, EditableCollectionRowDirective, FeatureTitleComponent, FieldErrorComponent,
    PrimaryActionButtonComponent, StateMessageComponent, SummaryCardsComponent, FilterPanelComponent, FilterActionsDirective, MoneyPipe],
  templateUrl: './budget.component.html', styleUrl: './budget.component.scss',
  host: { class: 'sigma-route-host' },
})
export class BudgetComponent extends BaseComponentService implements OnInit {
  private readonly service = inject(BudgetService);
  private readonly fiscalYearService = inject(FiscalYearService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);
  private readonly confirmation = inject(ConfirmationDialogService);
  private readonly messageService = inject(MessageService);
  private request?: Subscription;
  private rowChanges = new Subscription();
  private applied: BudgetFilter | null = null;
  private readonly revision = signal(0);
  readonly fiscalYears = signal<DropDownSelect[]>([]);
  readonly loadingOptions = signal(false);
  readonly optionsError = signal('');
  readonly loadingBudget = signal(false);
  readonly saving = signal(false);
  readonly refreshPending = signal(false);
  readonly confirming = signal(false);
  readonly errorMessage = signal('');
  readonly hasLoaded = signal(false);
  readonly months = signal<string[]>([]);
  readonly periods = signal<BudgetPeriod[]>([]);
  readonly rows = signal<BudgetEditorRow[]>([]);
  readonly accountTypes = ACCOUNT_TYPES;
  readonly filterForm = this.fb.group({
    fiscalYearId: this.fb.control<number | null>(null, Validators.required),
    accountType: this.fb.nonNullable.control(1),
  });
  readonly busy = computed(() => this.loadingBudget() || this.loadingOptions() || this.saving() || this.confirming());
  readonly dirty = computed(() => {
    this.revision();
    return this.rows().some(row => this.months().some(month =>
      (row.amounts.controls[month].value ?? 0) !== (row.source.monthlyAmounts[month] ?? 0)));
  });
  readonly columns = computed<ReadonlyArray<EditableCollectionTableColumn>>(() => [
    { header: 'budget.account', minWidth: '240px' },
    ...this.months().map(month => ({ header: month, minWidth: '130px', numeric: true })),
    { header: 'budget.total', minWidth: '130px', numeric: true },
  ]);
  readonly summaryCards = computed<ReadonlyArray<SummaryCard>>(() => {
    this.revision();
    const months = this.months();
    if (!months.length) return [];
    return [
      { id: 'period', labelKey: 'budget.fiscalPeriod', value: `${months[0]} — ${months[months.length - 1]}`, format: 'text', icon: 'bi bi-calendar3', accent: 'primary' },
      { id: 'total', labelKey: this.dirty() ? 'budget.totalPreview' : 'budget.totalBudget', value: this.rows().reduce((sum, row) => sum + this.rowTotal(row), 0), format: 'money', icon: 'bi bi-wallet2', accent: 'success' },
      ...months.map(month => ({ id: month, labelKey: month, value: this.rows().reduce((sum, row) => sum + (row.amounts.controls[month].value ?? 0), 0), format: 'money' as const, icon: 'bi bi-calendar-month', accent: 'primary' as const })),
    ];
  });

  constructor() {
    super();
    effect(() => {
      const disabled = this.busy() || this.refreshPending();
      for (const row of this.rows()) {
        if (disabled) row.amounts.disable({ emitEvent: false });
        else row.amounts.enable({ emitEvent: false });
      }
    });
    this.destroyRef.onDestroy(() => this.rowChanges.unsubscribe());
  }

  ngOnInit(): void { this.loadOptions(); }
  loadOptions(): void {
    if (this.loadingOptions()) return;
    this.loadingOptions.set(true); this.optionsError.set('');
    this.loading.startLoading();
    this.fiscalYearService.getSelectList<Results<DropDownSelect>>({ skipErrorInterceptor: true })
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
        this.loadingOptions.set(false);
        this.loading.endLoading();
      }))
      .subscribe({
        next: result => {
          this.fiscalYears.set(result.isSuccess ? result.entities ?? [] : []);
          if (!result.isSuccess) this.optionsError.set(result.message || 'apiErrors.unexpectedMessage');
        },
        error: error => { this.fiscalYears.set([]); this.optionsError.set(apiErrorMessage(error, 'apiErrors.unexpectedMessage')); },
      });
  }
  search(): void {
    if (this.busy() || this.optionsError()) return;
    if (this.filterForm.invalid) { this.filterForm.markAllAsTouched(); focusField('budget-year'); return; }
    const values = this.filterForm.getRawValue();
    const filter: BudgetFilter = { fiscalYearId: values.fiscalYearId!, accountType: values.accountType };
    this.discard().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(confirmed => {
      if (!confirmed || this.loadingBudget() || this.saving()) return;
      this.load(filter);
    });
  }
  reset(): void {
    if (this.busy()) return;
    this.discard().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(confirmed => {
      if (!confirmed || this.loadingBudget() || this.saving()) return;
      this.filterForm.reset({ fiscalYearId: null, accountType: 1 });
      this.applied = null; this.rows.set([]); this.months.set([]); this.periods.set([]); this.hasLoaded.set(false); this.refreshPending.set(false); this.errorMessage.set('');
    });
  }
  canDeactivate(): Observable<boolean> {
    if (this.busy()) return of(false);
    return this.discard();
  }
  private discard(): Observable<boolean> {
    if (!this.dirty()) return of(true);
    if (this.confirming()) return of(false);
    this.confirming.set(true);
    this.filterForm.disable({ emitEvent: false });
    return this.confirmation.confirmDiscard('budget').pipe(finalize(() => {
      this.confirming.set(false);
      if (!this.loadingBudget() && !this.saving()) this.filterForm.enable({ emitEvent: false });
    }));
  }
  private load(filter: BudgetFilter): void {
    this.request?.unsubscribe(); this.loadingBudget.set(true); this.errorMessage.set('');
    this.rows.set([]); this.months.set([]); this.periods.set([]); this.applied = null; this.hasLoaded.set(false);
    this.refreshPending.set(false);
    this.rowChanges.unsubscribe(); this.rowChanges = new Subscription();
    this.filterForm.disable({ emitEvent: false });
    this.loading.startLoading();
    this.request = this.service.loadBudget(filter)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
        this.loadingBudget.set(false); this.filterForm.enable({ emitEvent: false });
        this.loading.endLoading();
      })).subscribe({
        next: result => {
          if (!result.isSuccess || !result.entity) { this.errorMessage.set(result.message || 'apiErrors.unexpectedMessage'); return; }
          this.accept(result.entity, filter);
        },
        error: error => this.errorMessage.set(apiErrorMessage(error, 'apiErrors.unexpectedMessage')),
      });
  }
  private accept(dto: BudgetDTO, filter: BudgetFilter): void {
    this.rowChanges.unsubscribe(); this.rowChanges = new Subscription();
    this.applied = { ...filter }; this.months.set(dto.months ?? []); this.periods.set(dto.periods ?? []);
    this.rows.set((dto.rows ?? []).map(source => {
      const amounts = new FormRecord<FormControl<number | null>>({});
      for (const month of this.months()) {
        amounts.addControl(month, this.fb.control<number | null>(source.monthlyAmounts[month] ?? 0, finiteAmount));
      }
      return { source, amounts };
    }));
    for (const row of this.rows()) this.rowChanges.add(row.amounts.valueChanges.subscribe(() => this.amountChanged()));
    this.hasLoaded.set(true); this.refreshPending.set(false); this.revision.update(value => value + 1);
  }
  amountChanged(): void { this.revision.update(value => value + 1); }
  rowTotal(row: BudgetEditorRow): number {
    if (this.months().every(month => (row.amounts.controls[month].value ?? 0) === (row.source.monthlyAmounts[month] ?? 0))) return row.source.total;
    return Object.values(row.amounts.controls).reduce((sum, control) => sum + (control.value ?? 0), 0);
  }
  private entries(): BudgetEntry[] {
    const entries: BudgetEntry[] = [];
    for (const row of this.rows()) for (const month of this.months()) {
      const value = row.amounts.controls[month].value ?? 0;
      if (value === (row.source.monthlyAmounts[month] ?? 0)) continue;
      const parsed = this.parseMonth(month);
      if (parsed) entries.push({ accountId: row.source.accountId, year: parsed.year, month: parsed.month, amount: value });
    }
    return entries;
  }
  private parseMonth(label: string): { year: number; month: number } | null {
    const period = this.periods().find(value => value.label === label);
    return period ? { year: period.year, month: period.month } : null;
  }
  save(): void {
    if (this.busy() || this.refreshPending() || !this.applied?.fiscalYearId || !this.dirty()) return;
    for (const row of this.rows()) {
      if (row.amounts.invalid) {
        row.amounts.markAllAsTouched();
        const month = this.months().find(value => row.amounts.controls[value].invalid);
        if (month) focusField(`budget-${row.source.accountId}-${month}`);
        return;
      }
    }
    if (this.months().some(month => !this.parseMonth(month))) { this.errorMessage.set('budget.monthContractError'); return; }
    const filter = { ...this.applied };
    const request = { fiscalYearId: filter.fiscalYearId!, entries: this.entries() };
    let refreshed = false;
    this.saving.set(true); this.errorMessage.set(''); this.filterForm.disable({ emitEvent: false });
    this.loading.startLoading();
    this.service.saveBudget(request).pipe(
      switchMap(result => {
        if (!result.isSuccess) return throwError(() => new Error(result.message || 'apiErrors.unexpectedMessage'));
        this.refreshPending.set(true);
        return this.service.loadBudget(filter);
      }),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.saving.set(false); this.filterForm.enable({ emitEvent: false });
        this.loading.endLoading();
        if (refreshed) this.messageService.add({ key: 'global', severity: 'success', summary: this.translate.instant('general.success'), detail: this.translate.instant('budget.savedSuccess') });
      }),
    ).subscribe({
      next: result => {
        if (!result.isSuccess || !result.entity) { this.errorMessage.set('budget.refreshAfterSaveError'); return; }
        this.accept(result.entity, filter);
        refreshed = true;
      },
      error: error => this.errorMessage.set(this.refreshPending() ? 'budget.refreshAfterSaveError'
        : error instanceof Error && !(error instanceof HttpErrorResponse) ? error.message : apiErrorMessage(error, 'apiErrors.unexpectedMessage')),
    });
  }
  retrySavedRefresh(): void {
    if (this.busy() || !this.refreshPending() || !this.applied) return;
    const filter = { ...this.applied };
    let refreshed = false;
    this.saving.set(true); this.errorMessage.set(''); this.filterForm.disable({ emitEvent: false });
    this.loading.startLoading();
    this.service.loadBudget(filter).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
      this.saving.set(false); this.filterForm.enable({ emitEvent: false });
      this.loading.endLoading();
      if (refreshed) this.messageService.add({ key: 'global', severity: 'success', summary: this.translate.instant('general.success'), detail: this.translate.instant('budget.savedSuccess') });
    })).subscribe({
      next: result => {
        if (!result.isSuccess || !result.entity) { this.errorMessage.set('budget.refreshAfterSaveError'); return; }
        this.accept(result.entity, filter);
        refreshed = true;
      },
      error: () => this.errorMessage.set('budget.refreshAfterSaveError'),
    });
  }
  export(): void {
    if (this.busy() || !this.rows().length) return;
    const rows: Array<Record<string, string | number>> = this.rows().map(row => {
      const output: Record<string, string | number> = {
        [this.translate.instant('journal.accountCode')]: row.source.accountCode ?? '—',
        [this.translate.instant('journal.accountName')]: row.source.accountName ?? '—',
      };
      for (const month of this.months()) output[month] = row.amounts.controls[month].value ?? 0;
      output[this.translate.instant('budget.total')] = this.rowTotal(row);
      return output;
    });
    onExportToExcel(signal(rows), 'Budget');
  }
}
