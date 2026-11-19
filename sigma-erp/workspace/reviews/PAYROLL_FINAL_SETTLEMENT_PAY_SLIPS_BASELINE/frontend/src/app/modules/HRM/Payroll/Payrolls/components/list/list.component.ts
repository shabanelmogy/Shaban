import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableLazyLoadEvent } from 'primeng/table';
import { EMPTY, Subject, catchError, defer, finalize, switchMap } from 'rxjs';

import { onExportToExcel } from 'src/app/_metronic/layout/core/utilities';
import {
  DataTableColumn, DataTableComponent, DataTableStatus, dataTableExportRows,
} from 'src/app/modules/shared/components/data-table/data-table.component';
import { FeatureTitleComponent } from 'src/app/modules/shared/components/feature-title/feature-title.component';
import { FieldErrorComponent } from 'src/app/modules/shared/components/field-error/field-error.component';
import { FilterPanelComponent } from 'src/app/modules/shared/components/filter-panel/filter-panel.component';
import { FilterActionsDirective } from 'src/app/modules/shared/components/filter-panel/filter-panel.directives';
import { PrimaryActionButtonComponent } from 'src/app/modules/shared/components/primary-action-button/primary-action-button.component';
import { StateMessageComponent } from 'src/app/modules/shared/components/state-message/state-message.component';
import { DatePickerDirective } from 'src/app/modules/shared/directives/date-picker.directive';
import { ActionList } from 'src/app/modules/shared/models/action-list';
import { TranslateOptionsPipe } from 'src/app/modules/shared/pipes/translate-options.pipe';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { ConfirmationDialogService } from 'src/app/modules/shared/service/confirmation-dialog.service';
import { apiErrorMessage, composedReadErrorMessage } from 'src/app/modules/shared/utils/api-error';
import {
  currentMonthRange, dateRangeValidator, formatDisplayDate, parseDateRange, toPickerDate,
} from 'src/app/modules/shared/utils/date-utils';
import { DEFAULT_PAGE_SIZE, resolveListPaging } from 'src/app/modules/shared/utils/list-query';
import { readListRoute, writeListRoute } from 'src/app/modules/shared/utils/list-route-state';
import { focusField } from 'src/app/modules/shared/utils/focus-field';
import { freezeFormState } from 'src/app/modules/shared/utils/form-state';

import { PayrollRunLogsComponent } from '../../../PayrollProcess/components/logs/payroll-run-logs.component';
import { PayrollRunRow } from '../../../PayrollProcess/models/payroll-run';
import { PayrollListFilters, PayrollListQuery, PayrollListSortField, PayrollRunListRow } from '../../models/list';
import { PayrollsService } from '../../services/payrolls.service';

@Component({
  selector: 'app-payrolls',
  standalone: true,
  imports: [
    CalendarModule, CommonModule, DataTableComponent, DatePickerDirective, DropdownModule,
    FeatureTitleComponent, FieldErrorComponent, FilterActionsDirective, FilterPanelComponent,
    PayrollRunLogsComponent, PrimaryActionButtonComponent, ReactiveFormsModule,
    StateMessageComponent, TranslateModule, TranslateOptionsPipe,
  ],
  templateUrl: './list.component.html',
  host: { class: 'sigma-route-host' },
})
export class PayrollsComponent extends BaseComponentService implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly service = inject(PayrollsService);
  private readonly confirmation = inject(ConfirmationDialogService);
  private readonly translate = inject(TranslateService);
  private readonly listQuery$ = new Subject<PayrollListQuery>();
  private activeFilters: PayrollListFilters = { type: 'Payroll' };
  private lastQueryKey = '';
  private restoreFilters: (() => void) | null = null;
  private disposed = false;

  readonly data = signal<PayrollRunListRow[]>([]);
  readonly loadingList = signal(false);
  readonly exporting = signal(false);
  readonly approving = signal(false);
  readonly confirmationPending = signal(false);
  readonly logRun = signal<PayrollRunListRow | null>(null);
  readonly listError = signal('');
  readonly operationError = signal('');
  readonly totalRecords = signal(0);
  readonly pageNo = signal(1);
  readonly pageSize = signal(DEFAULT_PAGE_SIZE);
  readonly sortField = signal<PayrollListSortField>('date');
  readonly sortOrder = signal<1 | -1>(-1);
  readonly rowsPerPageOptions = [10, 15, 20, 50, 100];
  readonly actionPending = computed(() => this.exporting() || this.approving()
    || this.confirmationPending() || this.logRun() !== null);
  readonly busy = computed(() => this.loadingList() || this.actionPending());
  readonly errorMessage = computed(() => this.listError() || this.operationError());

  readonly dateRange = this.fb.control<Date[] | string | null>(currentMonthRange(), dateRangeValidator);
  readonly filterForm = this.fb.group({
    dateRange: this.dateRange,
    type: this.fb.nonNullable.control<PayrollListFilters['type']>('Payroll'),
    pendingApproval: this.fb.nonNullable.control(false),
  });
  readonly typeOptions: Array<{ id: PayrollListFilters['type']; key: string }> = [
    { id: 'Payroll', key: 'payrolls.types.payroll' },
    { id: 'LeaveSalary', key: 'payrolls.types.leaveSalary' },
  ];

  readonly columns: ReadonlyArray<DataTableColumn<PayrollRunListRow>> = [
    { field: 'date', header: 'payrolls.columns.date', type: 'date', sortable: true },
    { field: 'type', header: 'payrolls.columns.type', value: row => this.translate.instant(
      row.type === 'LeaveSalary' ? 'payrolls.types.leaveSalary' : 'payrolls.types.payroll',
    ) },
    { field: 'staffName', header: 'payrolls.columns.staff', value: row => this.staffText(row), cellClass: 'sigma-data-table__cell--wrap' },
    { field: 'amount', header: 'payrolls.columns.amount', type: 'money', sortable: true },
    { field: 'isApproved', header: 'payrolls.columns.status', type: 'status', status: row => this.status(row) },
  ];
  private readonly savedRunColumns: ReadonlyArray<DataTableColumn<PayrollRunRow>> = [
    { field: 'code', header: 'payrollProcess.code' },
    { field: 'name', header: 'payrollProcess.name' },
    { field: 'basic', header: 'payrollProcess.basic', type: 'money' },
    { field: 'allowances', header: 'payrollProcess.allowances', type: 'money' },
    { field: 'gross', header: 'payrollProcess.gross', type: 'money' },
    { field: 'overtime', header: 'payrollProcess.overtime', type: 'money' },
    { field: 'additional', header: 'payrollProcess.additional', type: 'money' },
    { field: 'deductions', header: 'payrollProcess.deductions', type: 'money' },
    { field: 'netPay', header: 'payrollProcess.netPay', type: 'money' },
  ];
  readonly actions: ActionList<PayrollRunListRow>[] = [
    {
      title: 'payrolls.actions.view', icon: 'bi bi-eye', disabled: () => this.busy(),
      action: row => { if (row) this.openProcess('view', row); },
    },
    {
      title: 'payrolls.actions.edit', icon: 'bi bi-pencil-square',
      visible: row => !!row && !row.isPaid, disabled: () => this.busy(),
      action: row => { if (row) this.openProcess('edit', row); },
    },
    {
      title: 'payrolls.actions.approve', icon: 'bi bi-check2-circle',
      visible: row => !!row && !row.isPaid && !row.isApproved, disabled: () => this.busy(),
      action: row => { if (row) this.confirmApprove(row); },
    },
    {
      title: 'payrolls.actions.log', icon: 'bi bi-clock-history', disabled: () => this.busy(),
      action: row => { if (row) this.openLog(row); },
    },
    {
      title: 'payrolls.actions.exportRun', icon: 'bi bi-file-earmark-excel', disabled: () => this.busy(),
      action: row => { if (row) this.exportSavedRun(row); },
    },
  ];

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => { this.disposed = true; });
    this.bindListQueries();
    this.restoreStateFromRoute();
    this.search(false);
  }

  search(resetPage = true): void {
    if (this.actionPending()) return;
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      focusField('payrolls-date-range', { openOverlay: false });
      return;
    }
    const raw = this.filterForm.getRawValue();
    const [dateFrom, dateTo] = parseDateRange(raw.dateRange);
    this.activeFilters = {
      type: raw.type,
      dateFrom: dateFrom ?? undefined,
      dateTo: dateTo ?? undefined,
      pendingApproval: raw.pendingApproval ? true : null,
    };
    if (resetPage) this.pageNo.set(1);
    this.refreshAppliedList();
  }

  resetFilters(): void {
    if (this.busy()) return;
    this.filterForm.reset({ dateRange: currentMonthRange(), type: 'Payroll', pendingApproval: false });
    this.search();
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    // New reads may cancel earlier reads; only a domain/dialog/export operation blocks them.
    if (this.actionPending()) return;
    const paging = resolveListPaging(event, { pageNo: this.pageNo(), pageSize: this.pageSize() });
    const nextSort = this.isSortField(event.sortField) ? event.sortField : this.sortField();
    const nextOrder = event.sortOrder === 1 || event.sortOrder === -1 ? event.sortOrder : this.sortOrder();
    if (!paging.changed && nextSort === this.sortField() && nextOrder === this.sortOrder()) return;
    this.pageNo.set(paging.pageNo);
    this.pageSize.set(paging.pageSize);
    this.sortField.set(nextSort);
    this.sortOrder.set(nextOrder);
    this.writeStateToRoute();
    this.requestList(this.appliedQuery());
  }

  retry(): void {
    if (!this.busy()) this.refreshAppliedList();
  }

  openNewProcess(): void {
    if (this.busy()) return;
    void this.router.navigate([this.activeFilters.type === 'LeaveSalary' ? '/ProcessLeaveSalary' : '/ProcessPayroll'], {
      queryParams: { ...this.returnQueryParams(), returnTo: '/ProcessedPayrolls' },
    });
  }

  private openProcess(mode: 'view' | 'edit', row: PayrollRunListRow): void {
    if (this.busy()) return;
    const current = this.currentRow(row);
    if (!current || (mode === 'edit' && current.isPaid)) return;
    void this.router.navigate([current.type === 'LeaveSalary' ? '/ProcessLeaveSalary' : '/ProcessPayroll'], {
      queryParams: { ...this.returnQueryParams(), runId: current.id, mode, returnTo: '/ProcessedPayrolls' },
    });
  }

  private openLog(row: PayrollRunListRow): void {
    if (this.busy()) return;
    const current = this.currentRow(row);
    if (current) {
      this.freezeFilters();
      this.logRun.set(current);
    }
  }

  closeLog(): void {
    this.logRun.set(null);
    this.restoreFiltersIfIdle();
  }

  logPeriod(): string {
    return this.logRun()?.date.slice(0, 7) ?? '';
  }

  private confirmApprove(row: PayrollRunListRow): void {
    if (this.busy()) return;
    const current = this.currentRow(row);
    if (!current || current.isPaid || current.isApproved) return;
    const selected = { ...current };
    this.freezeFilters();
    this.confirmationPending.set(true);
    this.confirmation.confirm({
      title: { key: 'payrolls.approval.title' },
      message: { key: 'payrolls.approval.message' },
      severity: 'warning',
      confirmLabel: { key: 'payrolls.actions.approve' },
      cancelLabel: { key: 'general.cancel' },
      record: {
        label: { key: 'payrolls.approval.record' },
        title: formatDisplayDate(selected.date),
        meta: this.translate.instant('payrollProcess.revision', { revision: selected.revisionNumber }),
        icon: 'bi bi-wallet2',
      },
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.confirmationPending.set(false);
        this.restoreFiltersIfIdle();
      }),
    ).subscribe(confirmed => {
      if (confirmed) this.approveCurrentRow(selected);
    });
  }

  private approveCurrentRow(selected: PayrollRunListRow): void {
    if (this.disposed || this.approving() || this.loadingList() || this.exporting() || this.logRun()) return;
    // A confirmation must not approve a different revision that replaced the selected row.
    const current = this.currentRow(selected);
    if (!current || current.isPaid || current.isApproved) {
      this.operationError.set('payrolls.errors.staleRow');
      return;
    }
    this.approving.set(true);
    this.freezeFilters();
    this.operationError.set('');
    this.loading.startLoading();
    let refreshAfterApproval = false;
    this.service.approve(current.id, { expectedVersion: current.version }).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.approving.set(false);
        this.loading.endLoading();
        this.restoreFiltersIfIdle();
        if (refreshAfterApproval && !this.disposed) this.refreshAppliedList();
      }),
    ).subscribe({
      next: response => {
        if (!response.isSuccess) {
          this.operationError.set(response.message || 'payrolls.errors.approve');
          return;
        }
        refreshAfterApproval = true;
      },
      error: error => this.operationError.set(apiErrorMessage(error, 'payrolls.errors.approve')),
    });
  }

  exportExcel(): void {
    if (this.busy()) return;
    this.beginExport();
    this.service.getAllList(this.appliedQuery()).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.endExport()),
    ).subscribe({
      next: rows => {
        if (!rows.length) {
          this.operationError.set(this.totalRecords() > 0 ? 'payrolls.errors.export' : 'payrolls.empty');
          return;
        }
        const exportRows = dataTableExportRows(rows, this.columns, key => this.translate.instant(key));
        onExportToExcel(signal(exportRows), 'Payrolls');
      },
      error: error => this.operationError.set(composedReadErrorMessage(error, 'payrolls.errors.export')),
    });
  }

  private exportSavedRun(row: PayrollRunListRow): void {
    if (this.busy()) return;
    const selected = this.currentRow(row);
    if (!selected) return;
    this.beginExport();
    this.service.getRun(selected.id).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.endExport()),
    ).subscribe({
      next: response => {
        if (!response.isSuccess || !response.entity) {
          this.operationError.set(response.message || 'payrolls.errors.exportRun');
          return;
        }
        const run = response.entity;
        if (run.id !== selected.id || run.revisionNumber !== selected.revisionNumber || run.version !== selected.version) {
          this.operationError.set('payrolls.errors.staleRow');
          return;
        }
        if (!run.rows.length) {
          this.operationError.set('payrolls.errors.exportRun');
          return;
        }
        const exportRows = dataTableExportRows(run.rows, this.savedRunColumns, key => this.translate.instant(key));
        const filename = run.type === 'LeaveSalary'
          ? `LeaveSalary-${run.staffId}-${run.period}-R${run.revisionNumber}`
          : `Payroll-${run.period}-R${run.revisionNumber}`;
        onExportToExcel(signal(exportRows), filename);
      },
      error: error => this.operationError.set(apiErrorMessage(error, 'payrolls.errors.exportRun')),
    });
  }

  private beginExport(): void {
    this.freezeFilters();
    this.exporting.set(true);
    this.operationError.set('');
    this.loading.startLoading();
  }

  private endExport(): void {
    this.exporting.set(false);
    this.loading.endLoading();
    this.restoreFiltersIfIdle();
  }

  private freezeFilters(): void {
    if (!this.restoreFilters) this.restoreFilters = freezeFormState(this.filterForm, this.destroyRef);
  }

  private restoreFiltersIfIdle(): void {
    if (this.actionPending() || this.disposed) return;
    const restore = this.restoreFilters;
    this.restoreFilters = null;
    restore?.();
  }

  private status(row: PayrollRunListRow): DataTableStatus {
    if (row.isPaid) return { label: 'payrolls.statuses.paid', tone: 'info' };
    return row.isApproved
      ? { label: 'payrolls.statuses.approved', tone: 'success' }
      : { label: 'payrolls.statuses.pendingApproval', tone: 'warning' };
  }

  private currentRow(row: PayrollRunListRow): PayrollRunListRow | undefined {
    return this.data().find(current => current.id === row.id
      && current.version === row.version && current.revisionNumber === row.revisionNumber);
  }

  private bindListQueries(): void {
    this.listQuery$.pipe(
      switchMap(query => defer(() => {
        this.loadingList.set(true);
        this.listError.set('');
        this.operationError.set('');
        this.loading.startLoading();
        return this.service.getList(query).pipe(
          catchError(error => {
            this.listFailed(apiErrorMessage(error, 'payrolls.errors.load'));
            return EMPTY;
          }),
          finalize(() => {
            this.loadingList.set(false);
            this.loading.endLoading();
          }),
        );
      })),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(response => {
      if (!response.isSuccess) {
        this.listFailed(response.message || 'payrolls.errors.load');
        return;
      }
      this.data.set(response.entities ?? []);
      this.totalRecords.set(Number(response.totalCount ?? 0));
      this.pageNo.set(Math.max(1, Number(response.pageNo || 1)));
      this.pageSize.set(Math.max(10, Number(response.pageSize || this.pageSize())));
      this.lastQueryKey = JSON.stringify(this.appliedQuery());
      this.writeStateToRoute();
    });
  }

  private listFailed(message: string): void {
    this.listError.set(message);
    this.data.set([]);
    this.totalRecords.set(0);
  }

  private refreshAppliedList(): void {
    this.writeStateToRoute();
    this.requestList(this.appliedQuery(), true);
  }

  private appliedQuery(): PayrollListQuery {
    return {
      pageNo: this.pageNo(), pageSize: this.pageSize(), filters: { ...this.activeFilters },
      sortField: this.sortField(), sortOrder: this.sortOrder(),
    };
  }

  private requestList(query: PayrollListQuery, force = false): void {
    const key = JSON.stringify(query);
    if (!force && key === this.lastQueryKey) return;
    this.lastQueryKey = key;
    this.listQuery$.next(query);
  }

  private isSortField(value: unknown): value is PayrollListSortField {
    return value === 'date' || value === 'amount';
  }

  private restoreStateFromRoute(): void {
    const state = readListRoute(this.route);
    const fromText = state.text('dateFrom');
    const toText = state.text('dateTo');
    const from = toPickerDate(fromText);
    const to = toPickerDate(toText);
    const dateRange = fromText || toText
      ? (from && to ? [from, to] : `${fromText} - ${toText}`)
      : state.text('dateRange') === 'all' ? null : currentMonthRange();
    const type = state.text('type') === 'LeaveSalary' ? 'LeaveSalary' : 'Payroll';
    this.filterForm.patchValue({ dateRange, type, pendingApproval: state.flag('pendingApproval') }, { emitEvent: false });
    this.activeFilters = {
      type,
      dateFrom: fromText || undefined,
      dateTo: toText || undefined,
      pendingApproval: state.flag('pendingApproval') ? true : null,
    };
    const paging = state.paging();
    this.pageNo.set(Math.floor(paging.pageNo));
    this.pageSize.set(Math.min(100, Math.floor(paging.pageSize)));
    if (this.isSortField(paging.sortField)) this.sortField.set(paging.sortField);
    if (paging.sortOrder) this.sortOrder.set(paging.sortOrder);
  }

  private writeStateToRoute(): void {
    writeListRoute(this.router, this.route, this.returnQueryParams());
  }

  private returnQueryParams(): Record<string, string | number | boolean | null> {
    return {
      dateFrom: this.activeFilters.dateFrom ?? null,
      dateTo: this.activeFilters.dateTo ?? null,
      dateRange: this.activeFilters.dateFrom || this.activeFilters.dateTo ? null : 'all',
      type: this.activeFilters.type,
      pendingApproval: this.activeFilters.pendingApproval ?? null,
      pageNo: this.pageNo(), pageSize: this.pageSize(),
      sortField: this.sortField(), sortOrder: this.sortOrder(),
    };
  }

  processActionLabel(): string {
    return this.activeFilters.type === 'LeaveSalary'
      ? 'payrolls.actions.processLeaveSalary'
      : 'payrolls.actions.processPayroll';
  }

  private staffText(row: PayrollRunListRow): string {
    if (!row.staffName && !row.staffCode) return '';
    return row.staffCode ? `${row.staffCode} — ${row.staffName ?? ''}` : row.staffName ?? '';
  }
}
