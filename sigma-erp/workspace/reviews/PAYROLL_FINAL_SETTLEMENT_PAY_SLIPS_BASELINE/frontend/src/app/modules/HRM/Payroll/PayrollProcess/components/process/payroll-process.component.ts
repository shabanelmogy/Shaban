import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, TemplateRef, ViewChild, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { EMPTY, Observable, Subject, catchError, defer, finalize, map, of, switchMap } from 'rxjs';

import { onExportToExcel } from 'src/app/_metronic/layout/core/utilities';
import {
  DataTableCellContext,
  DataTableColumn,
  DataTableComponent,
  dataTableExportRows,
  formatMoney,
} from 'src/app/modules/shared/components/data-table/data-table.component';
import { FeatureTitleComponent } from 'src/app/modules/shared/components/feature-title/feature-title.component';
import { EditorDialogComponent } from 'src/app/modules/shared/components/editor-dialog/editor-dialog.component';
import { FieldErrorComponent } from 'src/app/modules/shared/components/field-error/field-error.component';
import { FilterPanelComponent } from 'src/app/modules/shared/components/filter-panel/filter-panel.component';
import { FilterActionsDirective } from 'src/app/modules/shared/components/filter-panel/filter-panel.directives';
import { PrimaryActionButtonComponent } from 'src/app/modules/shared/components/primary-action-button/primary-action-button.component';
import { StateMessageComponent } from 'src/app/modules/shared/components/state-message/state-message.component';
import { SummaryCard } from 'src/app/modules/shared/components/summary-cards/summary-card.model';
import { SummaryCardsComponent } from 'src/app/modules/shared/components/summary-cards/summary-cards.component';
import { DatePickerDirective } from 'src/app/modules/shared/directives/date-picker.directive';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { ConfirmationDialogService } from 'src/app/modules/shared/service/confirmation-dialog.service';
import { apiErrorMessage } from 'src/app/modules/shared/utils/api-error';
import { currentMonthRange, formatDisplayDate, monthValueValidator, parseMonthValue, toPickerDate } from 'src/app/modules/shared/utils/date-utils';
import { focusField } from 'src/app/modules/shared/utils/focus-field';
import { freezeFormState } from 'src/app/modules/shared/utils/form-state';

import {
  PayrollRevisionOption, PayrollRevisionSummary, PayrollRun, PayrollRunRow, PayrollStaffOption, PayrollType,
} from '../../models/payroll-run';
import { PayrollProcessService } from '../../services/payroll-process.service';
import { PayrollRunLogsComponent } from '../logs/payroll-run-logs.component';

const payrollPeriodValidator: ValidatorFn = control => {
  const period = parseMonthValue(control.value);
  return period && Number(period.slice(0, 4)) > 9998 ? { payrollPeriod: true } : null;
};

@Component({
  selector: 'app-payroll-process',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, TranslateModule, CalendarModule, DropdownModule,
    DatePickerDirective, DataTableComponent, FeatureTitleComponent, FieldErrorComponent,
    FilterPanelComponent, FilterActionsDirective, PrimaryActionButtonComponent,
    StateMessageComponent, SummaryCardsComponent, EditorDialogComponent,
    PayrollRunLogsComponent,
  ],
  templateUrl: './payroll-process.component.html',
  host: { class: 'sigma-route-host' },
})
export class PayrollProcessComponent extends BaseComponentService implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);
  private readonly service = inject(PayrollProcessService);
  private readonly confirmation = inject(ConfirmationDialogService);
  private readonly revisionsRequest = new Subject<PayrollRun | null>();
  private disposed = false;
  private restoreLogForm: (() => void) | null = null;
  private logPreview: PayrollRun | null = null;
  private restoreNotesForm: (() => void) | null = null;
  private notesRun: PayrollRun | null = null;
  private acceptedStaffId: number | null = null;
  private contextRejected = false;

  @ViewChild('staffTemplate', { static: true })
  protected staffTemplate!: TemplateRef<DataTableCellContext<PayrollRunRow>>;
  @ViewChild('notesTemplate', { static: true })
  protected notesTemplate!: TemplateRef<DataTableCellContext<PayrollRunRow>>;

  readonly filterForm = this.fb.group({
    month: this.fb.control<Date | string | null>(currentMonthRange()[0], [
      Validators.required, monthValueValidator, payrollPeriodValidator,
    ]),
    revision: this.fb.control<number | null>(null),
    staffId: this.fb.control<number | null>(null),
  });
  readonly payrollType: PayrollType = this.activatedRoute.snapshot.data['payrollType'] === 'LeaveSalary'
    ? 'LeaveSalary' : 'Payroll';
  readonly isLeaveSalary = this.payrollType === 'LeaveSalary';
  readonly preview = signal<PayrollRun | null>(null);
  readonly historicalRun = signal<PayrollRun | null>(null);
  readonly viewedRevision = signal<number | null>(null);
  readonly processing = signal(false);
  readonly loadingRun = signal(false);
  readonly readOnly = signal(false);
  readonly openedFromList = signal(false);
  readonly logsVisible = signal(false);
  readonly notesContext = signal<{ staff: PayrollRunRow | null; period: string; messages: ReadonlyArray<string> } | null>(null);
  readonly saving = signal(false);
  readonly historyLoading = signal(false);
  readonly revisionsLoading = signal(false);
  readonly discardPending = signal(false);
  readonly actionError = signal('');
  readonly revisionsError = signal('');
  readonly staffLoading = signal(false);
  readonly staffError = signal('');
  readonly staffOptions = signal<PayrollStaffOption[]>([]);
  readonly revisionSummaries = signal<PayrollRevisionSummary[]>([]);
  readonly revisionOptions = signal<PayrollRevisionOption[]>([]);
  readonly baseColumns = signal<ReadonlyArray<DataTableColumn<PayrollRunRow>>>([]);
  readonly notesColumn = signal<DataTableColumn<PayrollRunRow> | null>(null);
  readonly formatDisplayDate = formatDisplayDate;
  private retryAction: 'process' | 'save' | 'history' | 'load' | null = null;
  private retryRevision: number | null = null;
  private initialRunId: number | null = null;

  readonly busy = computed(() => this.processing() || this.loadingRun() || this.saving() || this.historyLoading() || this.discardPending() || this.logsVisible() || !!this.notesContext());
  readonly canProcess = computed(() => !this.busy() && !this.readOnly() && this.contextReady());
  readonly displayedRun = computed(() => this.historicalRun() ?? this.preview());
  readonly rows = computed(() => this.displayedRun()?.rows ?? []);
  readonly columns = computed<ReadonlyArray<DataTableColumn<PayrollRunRow>>>(() => {
    const run = this.displayedRun();
    const columns = [...this.baseColumns()];
    if (run?.id && !run.isSaved && !this.historicalRun()) {
      columns.push({ field: 'netPayDifference', header: 'payrollProcess.netPayDifference', type: 'money', width: '130px', cellClass: 'align-middle' });
    }
    const notes = this.notesColumn();
    if (notes) columns.push(notes);
    return columns;
  });
  readonly saveDisabled = computed(() => this.busy() || this.readOnly() || !this.contextReady()
    || !!this.historicalRun() || !!this.preview()?.isSaved || !!this.preview()?.isPaid);
  readonly canExport = computed(() => !this.busy() && !!this.displayedRun()?.isSaved && this.rows().length > 0);
  readonly hasRowIssues = computed(() => this.rows().some(row => row.issues.length > 0));
  readonly screenNotes = computed<ReadonlyArray<string>>(() => {
    const messages = [this.isLeaveSalary ? 'leaveSalaryPayrollProcess.policyNotice' : 'payrollProcess.policyNotice'];
    if (this.historicalRun()) messages.push('payrollProcess.historicalNotice');
    else if (this.preview()?.requiresSettlement) messages.push('payrollProcess.settlementNotice');
    else if (this.preview()?.isPaid) messages.push('payrollProcess.paidNotice');
    if (this.hasRowIssues()) messages.push('payrollProcess.fixIssues');
    return messages;
  });
  readonly summaryCards = computed<ReadonlyArray<SummaryCard>>(() => {
    const run = this.displayedRun();
    if (!run) return [];
    const cards: SummaryCard[] = [
      { id: 'basic', labelKey: 'payrollProcess.basic', value: run.totalBasic, format: 'money', icon: 'bi bi-cash', accent: 'neutral' },
      { id: 'allowances', labelKey: 'payrollProcess.allowances', value: run.totalAllowances, format: 'money', icon: 'bi bi-wallet2', accent: 'neutral' },
      { id: 'gross', labelKey: 'payrollProcess.gross', value: run.totalGross, format: 'money', icon: 'bi bi-cash-stack', accent: 'neutral' },
      { id: 'overtime', labelKey: 'payrollProcess.overtime', value: run.totalOvertime, format: 'money', icon: 'bi bi-clock', accent: 'neutral' },
      { id: 'additional', labelKey: 'payrollProcess.additional', value: run.totalAdditional, format: 'money', icon: 'bi bi-plus-circle', accent: 'neutral' },
      { id: 'deductions', labelKey: 'payrollProcess.deductions', value: run.totalDeductions, format: 'money', icon: 'bi bi-dash-circle', accent: 'neutral' },
      { id: 'net', labelKey: 'payrollProcess.netPay', value: run.totalNet, format: 'money', icon: 'bi bi-wallet-fill', accent: 'primary' },
    ];
    if (run.requiresSettlement) cards.push({ id: 'settlement', labelKey: 'payrollProcess.settlementDifference', value: run.settlementTotal, format: 'money', icon: 'bi bi-arrow-left-right', accent: 'neutral' });
    return cards;
  });

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => { this.disposed = true; });
    this.initColumns();
    this.bindRevisionReads();
    if (this.isLeaveSalary) {
      this.filterForm.controls.staffId.addValidators(Validators.required);
      this.filterForm.controls.staffId.updateValueAndValidity({ emitEvent: false });
      this.loadStaffOptions();
    }
    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateRevisionOptions());
    const params = this.activatedRoute.snapshot.queryParamMap;
    const rawRunId = params.get('runId');
    this.readOnly.set(params.get('mode') === 'view');
    if (this.readOnly()) {
      this.filterForm.controls.month.disable({ emitEvent: false });
      if (this.isLeaveSalary) this.filterForm.controls.staffId.disable({ emitEvent: false });
    }
    if (rawRunId !== null) {
      this.openedFromList.set(true);
      const id = Number(rawRunId);
      if (Number.isInteger(id) && id > 0 && id <= 2147483647) {
        this.initialRunId = id;
        this.loadRun(id);
      } else {
        this.contextRejected = true;
        this.readOnly.set(true);
        this.filterForm.disable({ emitEvent: false });
        this.actionError.set('payrollProcess.invalidRun');
      }
    } else if (this.readOnly()) {
      this.contextRejected = true;
      this.filterForm.disable({ emitEvent: false });
      this.actionError.set('payrollProcess.invalidRun');
    }
  }

  process(): void {
    if (this.busy() || this.readOnly()) return;
    const period = this.validPeriod();
    const staffId = this.validStaffId();
    if (!period || (this.isLeaveSalary && !staffId)) return;
    this.confirmDiscardIfNeeded()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(confirmed => {
        if (confirmed && !this.busy()
          && parseMonthValue(this.filterForm.controls.month.value) === period
          && this.selectedStaffId() === staffId) this.calculate(period, staffId);
      });
  }

  save(): void {
    if (this.saveDisabled()) return;
    const period = this.validPeriod();
    const staffId = this.validStaffId();
    if (!period || (this.isLeaveSalary && !staffId)) return;
    const run = this.preview();
    if (!run || run.period !== period || run.type !== this.payrollType || run.staffId !== staffId) {
      this.actionError.set('payrollProcess.processFirst');
      this.retryAction = null;
      return;
    }
    if (!run.canSave) {
      this.actionError.set(run.rows.length === 0 ? 'payrollProcess.empty' : 'payrollProcess.fixIssues');
      this.retryAction = 'process';
      return;
    }
    this.actionError.set('');
    this.retryAction = null;
    this.saving.set(true);
    const restore = freezeFormState(this.filterForm, this.destroyRef);
    this.loading.startLoading();
    this.service.save({ period, type: this.payrollType, staffId: staffId ?? undefined, expectedVersion: run.version })
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
        this.saving.set(false);
        this.loading.endLoading();
        this.restoreFormWithLocks(restore);
      }))
      .subscribe({
        next: result => {
          if (!result.isSuccess || !result.entity) {
            this.failAction(result.message?.trim() || 'payrollProcess.saveError', 'save');
            return;
          }
          if (!this.matchesContext(result.entity, period, staffId)) {
            this.failAction('leaveSalaryPayrollProcess.routeMismatch', 'process');
            return;
          }
          this.applyPreview(result.entity);
        },
        error: error => this.failAction(apiErrorMessage(error, 'payrollProcess.saveError'), error?.status === 409 ? 'process' : 'save'),
      });
  }

  reset(): void {
    if (this.busy() || this.readOnly()) return;
    this.confirmDiscardIfNeeded().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(confirmed => {
      if (!confirmed || this.busy()) return;
      this.filterForm.controls.staffId.enable({ emitEvent: false });
      this.filterForm.reset({ month: currentMonthRange()[0], revision: null, staffId: null });
      this.acceptedStaffId = null;
      this.preview.set(null);
      this.historicalRun.set(null);
      this.viewedRevision.set(null);
      this.actionError.set('');
      this.retryAction = null;
      this.revisionsRequest.next(null);
      this.revisionSummaries.set([]);
      this.updateRevisionOptions();
      const period = this.validPeriod();
      if (period && !this.isLeaveSalary) this.calculate(period, null);
    });
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.busy()) return false;
    return this.hasUnsavedPreview() ? this.confirmDiscardIfNeeded() : true;
  }

  retry(): void {
    if (this.retryAction === 'process') this.process();
    else if (this.retryAction === 'save') this.save();
    else if (this.retryAction === 'history' && this.retryRevision !== null) this.viewRevision(this.retryRevision);
    else if (this.retryAction === 'load' && this.initialRunId !== null) this.loadRun(this.initialRunId);
  }

  canRetry(): boolean { return this.retryAction !== null; }

  openLogs(): void {
    if (this.busy() || !this.preview()?.id) return;
    this.logPreview = this.preview();
    this.restoreLogForm = freezeFormState(this.filterForm, this.destroyRef);
    this.logsVisible.set(true);
  }

  closeLogs(): void {
    if (!this.logsVisible()) return;
    this.logsVisible.set(false);
    if (!this.disposed && !this.busy() && this.preview() === this.logPreview && this.restoreLogForm) {
      this.restoreFormWithLocks(this.restoreLogForm);
    }
    this.restoreLogForm = null;
    this.logPreview = null;
  }

  openNotes(staff?: PayrollRunRow): void {
    if (this.busy()) return;
    if (staff && (!this.rows().includes(staff) || staff.issues.length === 0)) return;
    this.notesRun = this.displayedRun();
    this.restoreNotesForm = freezeFormState(this.filterForm, this.destroyRef);
    this.notesContext.set({
      staff: staff ?? null,
      period: this.notesRun?.period ?? parseMonthValue(this.filterForm.controls.month.value) ?? '',
      messages: [...(staff ? staff.issues : this.screenNotes())],
    });
  }

  closeNotes(): void {
    if (!this.notesContext()) return;
    this.notesContext.set(null);
    if (!this.disposed && !this.busy() && this.displayedRun() === this.notesRun && this.restoreNotesForm) {
      this.restoreFormWithLocks(this.restoreNotesForm);
    }
    this.restoreNotesForm = null;
    this.notesRun = null;
  }

  exportExcel(): void {
    if (!this.canExport()) return;
    const run = this.displayedRun();
    if (!run) return;
    const rows = dataTableExportRows(run.rows, this.baseColumns(), key => this.translate.instant(key));
    const filename = run.type === 'LeaveSalary'
      ? `LeaveSalary_${run.staffId}_${run.period}_Revision_${run.revisionNumber}`
      : `Payroll_${run.period}_Revision_${run.revisionNumber}`;
    onExportToExcel(signal(rows), filename);
  }

  backToPayrolls(): void {
    if (this.busy()) return;
    const returnParams: Record<string, unknown> = {};
    for (const key of Object.keys(this.activatedRoute.snapshot.queryParams)) {
      if (key !== 'runId' && key !== 'mode' && key !== 'returnTo') returnParams[key] = this.activatedRoute.snapshot.queryParams[key];
    }
    void this.router.navigate(['/ProcessedPayrolls'], { queryParams: returnParams });
  }

  retryRevisions(): void {
    if (!this.busy() && this.preview()) this.revisionsRequest.next(this.preview());
  }

  retryStaff(): void {
    if (!this.busy() && !this.staffLoading()) this.loadStaffOptions();
  }

  staffChanged(staffId: number | null): void {
    this.requestStaffSelection(staffId);
  }

  clearStaff(): void {
    if (!this.busy() && !this.filterForm.controls.staffId.disabled) this.requestStaffSelection(null);
  }

  viewRevision(revisionNumber: number | null): void {
    if (this.busy()) {
      this.filterForm.controls.revision.setValue(this.viewedRevision(), { emitEvent: false });
      return;
    }
    if (revisionNumber === null) {
      this.historicalRun.set(null);
      this.viewedRevision.set(null);
      this.filterForm.controls.revision.setValue(null, { emitEvent: false });
      this.actionError.set('');
      this.retryAction = null;
      return;
    }
    const candidate = this.preview();
    if (!candidate?.id || !this.revisionSummaries().some(revision => revision.revisionNumber === revisionNumber)) return;
    this.actionError.set('');
    this.retryAction = null;
    this.historyLoading.set(true);
    const restore = freezeFormState(this.filterForm, this.destroyRef);
    this.loading.startLoading();
    this.service.getRevision(candidate.id, revisionNumber)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
        this.historyLoading.set(false);
        this.loading.endLoading();
        this.restoreFormWithLocks(restore);
      }))
      .subscribe({
        next: result => {
          if (this.preview() !== candidate) return;
          if (!result.isSuccess || !result.entity) {
            this.failHistory(result.message?.trim() || 'payrollProcess.historyError', revisionNumber);
            return;
          }
          if (result.entity.id !== candidate.id || result.entity.revisionNumber !== revisionNumber
            || result.entity.period !== candidate.period || result.entity.type !== candidate.type
            || result.entity.staffId !== candidate.staffId) {
            this.failHistory('leaveSalaryPayrollProcess.routeMismatch', revisionNumber);
            return;
          }
          this.historicalRun.set(result.entity);
          this.viewedRevision.set(revisionNumber);
          this.filterForm.controls.revision.setValue(revisionNumber, { emitEvent: false });
        },
        error: error => this.failHistory(apiErrorMessage(error, 'payrollProcess.historyError'), revisionNumber),
      });
  }

  private validPeriod(): string | null {
    if (this.filterForm.controls.month.invalid) {
      this.filterForm.controls.month.markAsTouched();
      focusField('payroll-month', { openOverlay: false });
      return null;
    }
    return parseMonthValue(this.filterForm.controls.month.value);
  }

  private calculate(period: string, staffId: number | null): void {
    if (this.busy() || this.readOnly() || !this.contextReady()) return;
    this.actionError.set('');
    this.retryAction = null;
    this.processing.set(true);
    const restore = freezeFormState(this.filterForm, this.destroyRef);
    this.loading.startLoading();
    this.service.calculate({ period, type: this.payrollType, staffId: staffId ?? undefined })
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
        this.processing.set(false);
        this.loading.endLoading();
        this.restoreFormWithLocks(restore);
      }))
      .subscribe({
        next: result => {
          if (!result.isSuccess || !result.entity) {
            this.failAction(result.message?.trim() || 'payrollProcess.processError', 'process');
            return;
          }
          if (!this.matchesContext(result.entity, period, staffId)) {
            this.failAction('leaveSalaryPayrollProcess.routeMismatch', 'process');
            return;
          }
          this.applyPreview(result.entity);
        },
        error: error => this.failAction(apiErrorMessage(error, 'payrollProcess.processError'), 'process'),
      });
  }

  private loadRun(id: number): void {
    if (this.busy()) return;
    this.actionError.set('');
    this.retryAction = null;
    this.loadingRun.set(true);
    const restore = freezeFormState(this.filterForm, this.destroyRef);
    this.loading.startLoading();
    this.service.getRun(id)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
        this.loadingRun.set(false);
        this.loading.endLoading();
        this.restoreFormWithLocks(restore);
      }))
      .subscribe({
        next: result => {
          if (!result.isSuccess || !result.entity) {
            this.actionError.set(result.message?.trim() || 'payrollProcess.loadError');
            this.retryAction = 'load';
            return;
          }
          if (!this.matchesRouteContext(result.entity)) {
            this.contextRejected = true;
            this.readOnly.set(true);
            this.filterForm.disable({ emitEvent: false });
            this.actionError.set('leaveSalaryPayrollProcess.routeMismatch');
            return;
          }
          this.filterForm.controls.month.setValue(toPickerDate(`${result.entity.period}-01`), { emitEvent: false });
          this.applyPreview(result.entity);
        },
        error: error => {
          this.actionError.set(apiErrorMessage(error, 'payrollProcess.loadError'));
          this.retryAction = 'load';
        },
      });
  }

  private applyPreview(run: PayrollRun): void {
    if (this.isLeaveSalary) {
      this.acceptedStaffId = run.staffId;
      this.ensureSavedStaffOption(run);
      this.filterForm.controls.staffId.setValue(run.staffId, { emitEvent: false });
      if (run.id) this.filterForm.controls.staffId.disable({ emitEvent: false });
    }
    this.preview.set(run);
    this.historicalRun.set(null);
    this.viewedRevision.set(null);
    this.filterForm.controls.revision.setValue(null, { emitEvent: false });
    this.filterForm.markAsPristine();
    this.revisionSummaries.set([]);
    this.updateRevisionOptions();
    this.revisionsRequest.next(run);
  }

  private hasUnsavedPreview(): boolean {
    const run = this.preview();
    return !this.readOnly() && !!run && !run.isSaved && !run.isPaid && run.rows.length > 0;
  }

  private confirmDiscardIfNeeded(): Observable<boolean> {
    const candidate = this.preview();
    return defer(() => {
      if (this.disposed || this.busy() || this.preview() !== candidate) return of(false);
      if (!this.hasUnsavedPreview()) return of(true);
      this.discardPending.set(true);
      const restore = freezeFormState(this.filterForm, this.destroyRef);
      return this.confirmation.confirmDiscard('payrollProcess').pipe(
        map(confirmed => {
          const samePreview = !this.disposed && this.preview() === candidate && !this.processing() && !this.saving() && !this.historyLoading();
          // Release the decision before its accepted continuation starts a request.
          this.discardPending.set(false);
          if (samePreview) this.restoreFormWithLocks(restore);
          return confirmed && samePreview;
        }),
        finalize(() => {
          this.discardPending.set(false);
          if (!this.disposed && this.preview() === candidate && !this.processing() && !this.saving() && !this.historyLoading()) {
            this.restoreFormWithLocks(restore);
          }
        }),
      );
    });
  }

  private bindRevisionReads(): void {
    this.revisionsRequest.pipe(
      switchMap(candidate => defer(() => {
        this.revisionsError.set('');
        if (!candidate?.id) return EMPTY;
        this.revisionsLoading.set(true);
        return this.service.getRevisions(candidate.id).pipe(
          map(result => ({ candidate, result })),
          catchError(error => {
            if (this.preview() === candidate) this.revisionsError.set(apiErrorMessage(error, 'payrollProcess.historyError'));
            return EMPTY;
          }),
          finalize(() => this.revisionsLoading.set(false)),
        );
      })),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(({ candidate, result }) => {
      if (this.preview() !== candidate) return;
      if (!result.isSuccess || !result.entity) {
        this.revisionsError.set(result.message?.trim() || 'payrollProcess.historyError');
        return;
      }
      this.revisionSummaries.set(result.entity);
      this.updateRevisionOptions();
    });
  }

  private updateRevisionOptions(): void {
    this.revisionOptions.set([
      { id: null, value: this.translate.instant('payrollProcess.currentPreview') },
      ...this.revisionSummaries().map(revision => ({
        id: revision.revisionNumber,
        value: this.translate.instant('payrollProcess.revisionOption', {
          revision: revision.revisionNumber,
          date: revision.savedAt ? formatDisplayDate(revision.savedAt, true) : '',
          net: formatMoney(revision.totalNet),
        }),
      })),
    ]);
  }

  private failAction(message: string, retry: 'process' | 'save'): void {
    this.actionError.set(message);
    this.retryAction = retry;
  }

  private failHistory(message: string, revisionNumber: number): void {
    this.filterForm.controls.revision.setValue(this.viewedRevision(), { emitEvent: false });
    this.actionError.set(message);
    this.retryAction = 'history';
    this.retryRevision = revisionNumber;
  }

  private selectedStaffId(): number | null {
    return this.isLeaveSalary ? this.filterForm.controls.staffId.getRawValue() : null;
  }

  private validStaffId(): number | null {
    if (!this.isLeaveSalary) return null;
    const control = this.filterForm.controls.staffId;
    if (control.invalid || !Number.isInteger(control.getRawValue()) || Number(control.getRawValue()) <= 0) {
      control.markAsTouched();
      focusField('leave-salary-staff');
      return null;
    }
    return control.getRawValue();
  }

  private contextReady(): boolean {
    return !this.isLeaveSalary || (!this.staffLoading() && !this.staffError());
  }

  private matchesContext(run: PayrollRun, period: string, staffId: number | null): boolean {
    return run.period === period && this.matchesRouteContext(run) && run.staffId === staffId;
  }

  private matchesRouteContext(run: PayrollRun): boolean {
    return run.type === this.payrollType
      && (this.isLeaveSalary ? !!run.staffId && run.staffId > 0 : run.staffId === null);
  }

  private requestStaffSelection(staffId: number | null): void {
    if (!this.isLeaveSalary || this.busy() || this.filterForm.controls.staffId.disabled) return;
    if (staffId === this.acceptedStaffId) return;
    const previous = this.acceptedStaffId;
    this.filterForm.controls.staffId.setValue(previous, { emitEvent: false });
    this.confirmDiscardIfNeeded().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(confirmed => {
      if (!confirmed || this.busy() || this.filterForm.controls.staffId.disabled) return;
      this.acceptedStaffId = staffId;
      this.filterForm.controls.staffId.setValue(staffId, { emitEvent: false });
      this.clearRunState();
    });
  }

  private clearRunState(): void {
    this.preview.set(null);
    this.historicalRun.set(null);
    this.viewedRevision.set(null);
    this.filterForm.controls.revision.setValue(null, { emitEvent: false });
    this.revisionsRequest.next(null);
    this.revisionSummaries.set([]);
    this.updateRevisionOptions();
    this.actionError.set('');
    this.retryAction = null;
  }

  private loadStaffOptions(): void {
    if (!this.isLeaveSalary || this.staffLoading()) return;
    this.staffLoading.set(true);
    this.staffError.set('');
    this.service.getLeaveSalaryStaff().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.staffLoading.set(false)),
    ).subscribe({
      next: result => {
        if (!result.isSuccess) {
          this.staffError.set(result.message?.trim() || 'leaveSalaryPayrollProcess.staffLoadError');
          return;
        }
        const saved = this.staffOptions().find(option => option.id === this.preview()?.staffId);
        const options = result.entities ?? [];
        this.staffOptions.set(saved && !options.some(option => option.id === saved.id) ? [saved, ...options] : options);
      },
      error: error => this.staffError.set(apiErrorMessage(error, 'leaveSalaryPayrollProcess.staffLoadError')),
    });
  }

  private ensureSavedStaffOption(run: PayrollRun): void {
    if (!run.staffId || this.staffOptions().some(option => option.id === run.staffId)) return;
    const row = run.rows[0];
    this.staffOptions.update(options => [{ id: run.staffId!, no: row?.code ?? null, value: row?.name ?? '' }, ...options]);
  }

  private restoreFormWithLocks(restore: () => void): void {
    if (this.disposed) return;
    restore();
    if (this.contextRejected) {
      this.filterForm.disable({ emitEvent: false });
      return;
    }
    if (this.readOnly()) this.filterForm.controls.month.disable({ emitEvent: false });
    if (this.isLeaveSalary && (this.readOnly() || !!this.preview()?.id)) {
      this.filterForm.controls.staffId.disable({ emitEvent: false });
    }
  }

  private initColumns(): void {
    this.notesColumn.set({ field: 'issues', header: 'payrollProcess.rowNotes', width: '64px',
      headerClass: 'text-center', cellClass: 'text-center align-middle', cellTemplate: this.notesTemplate });
    this.baseColumns.set([
      { field: 'code', header: 'payrollProcess.code', width: '100px', cellClass: 'align-middle' },
      { field: 'name', header: 'payrollProcess.name', width: '240px', cellClass: 'sigma-data-table__cell--wrap align-middle', cellTemplate: this.staffTemplate,
        value: row => [row.name, ...row.issues.map(issue => this.translate.instant(issue))].join(' — ') },
      { field: 'basic', header: 'payrollProcess.basic', type: 'money', width: '120px', cellClass: 'align-middle' },
      { field: 'allowances', header: 'payrollProcess.allowances', type: 'money', width: '120px', cellClass: 'align-middle' },
      { field: 'gross', header: 'payrollProcess.gross', type: 'money', width: '120px', cellClass: 'align-middle' },
      { field: 'overtime', header: 'payrollProcess.overtime', type: 'money', width: '120px', cellClass: 'align-middle' },
      { field: 'additional', header: 'payrollProcess.additional', type: 'money', width: '120px', cellClass: 'align-middle' },
      { field: 'deductions', header: 'payrollProcess.deductions', type: 'money', width: '120px', cellClass: 'align-middle' },
      { field: 'netPay', header: 'payrollProcess.netPay', type: 'money', width: '130px', cellClass: 'align-middle' },
    ]);
  }
}
