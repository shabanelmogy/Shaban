import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { Subscription, finalize } from 'rxjs';
import { onExportToExcel } from 'src/app/_metronic/layout/core/utilities';
import { AccountService } from 'src/app/modules/Accounts/Account/services/account.service';
import { DataTableColumn, DataTableComponent, DataTablePaginationEvent, dataTableExportRows } from 'src/app/modules/shared/components/data-table/data-table.component';
import { FeatureTitleComponent } from 'src/app/modules/shared/components/feature-title/feature-title.component';
import { FieldErrorComponent } from 'src/app/modules/shared/components/field-error/field-error.component';
import { PrimaryActionButtonComponent } from 'src/app/modules/shared/components/primary-action-button/primary-action-button.component';
import { ReportActionsComponent } from 'src/app/modules/shared/components/report-actions/report-actions.component';
import { ReportPageComponent } from 'src/app/modules/shared/components/report-page/report-page.component';
import { StateMessageComponent } from 'src/app/modules/shared/components/state-message/state-message.component';
import { DatePickerDirective } from 'src/app/modules/shared/directives/date-picker.directive';
import { DropDownSelect } from 'src/app/modules/shared/models/dropdown-select';
import { Results } from 'src/app/modules/shared/models/results';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { apiErrorMessage } from 'src/app/modules/shared/utils/api-error';
import { currentMonthRange, dateRangeValidator, parseDateRange } from 'src/app/modules/shared/utils/date-utils';
import { focusField } from 'src/app/modules/shared/utils/focus-field';
import { DEFAULT_PAGE_SIZE, fetchAllPages, resolveListPaging } from 'src/app/modules/shared/utils/list-query';
import { JournalFilter, JournalLine, VoucherType } from '../../models/journal';
import { JournalService } from '../../services/journal.service';

@Component({
  selector: 'app-journal', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CalendarModule, DropdownModule,
    InputTextModule, DataTableComponent, FeatureTitleComponent, FieldErrorComponent,
    PrimaryActionButtonComponent, ReportActionsComponent, ReportPageComponent, StateMessageComponent, DatePickerDirective],
  templateUrl: './journal.component.html', styleUrl: './journal.component.scss',
  host: { class: 'sigma-route-host sigma-print-flow' },
})
export class JournalComponent extends BaseComponentService implements OnInit {
  private readonly service = inject(JournalService);
  private readonly accountService = inject(AccountService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);
  private request?: Subscription;
  private appliedFilter: JournalFilter | null = null;
  readonly data = signal<JournalLine[]>([]);
  readonly accounts = signal<DropDownSelect[]>([]);
  readonly accountLoading = signal(false);
  readonly accountError = signal('');
  readonly loadingReport = signal(false);
  readonly exporting = signal(false);
  readonly errorMessage = signal('');
  readonly hasSearched = signal(false);
  readonly totalCount = signal(0);
  readonly paging = signal({ pageNo: 1, pageSize: DEFAULT_PAGE_SIZE });
  readonly filterForm = this.fb.group({
    dateRange: this.fb.control<Date[] | string | null>(currentMonthRange(), dateRangeValidator),
    voucherNo: this.fb.nonNullable.control(''),
    type: this.fb.control<VoucherType | null>(null),
    chassisOrPlateNo: this.fb.nonNullable.control(''),
    accountId: this.fb.control<number | null>(null),
  });
  readonly columns: ReadonlyArray<DataTableColumn<JournalLine>> = [
    { field: 'date', header: 'journal.date', type: 'date' },
    { field: 'accountCode', header: 'journal.accountCode' },
    { field: 'accountName', header: 'journal.accountName' },
    { field: 'contact', header: 'journal.contact' },
    { field: 'type', header: 'journal.type', value: row => this.typeLabel(row.type) },
    { field: 'voucherNo', header: 'journal.voucherNo' },
    { field: 'plateNo', header: 'journal.plateNo' },
    { field: 'description', header: 'journal.description' },
    { field: 'debit', header: 'journal.debit', type: 'money', headerClass: 'text-end', cellClass: 'text-end' },
    { field: 'credit', header: 'journal.credit', type: 'money', headerClass: 'text-end', cellClass: 'text-end' },
  ];
  readonly voucherTypes: { label: string; value: VoucherType }[] = [
    { label: 'journal.voucherTypeReceipt', value: 'Receipt' },
    { label: 'journal.voucherTypePayment', value: 'Payment' },
    { label: 'journal.voucherTypeJournalVoucher', value: 'JournalVoucher' },
    { label: 'journal.voucherTypeCreditNote', value: 'CreditNote' },
    { label: 'journal.voucherTypeDebitNote', value: 'DebitNote' },
    { label: 'journal.voucherTypeSalesInvoice', value: 'SalesInvoice' },
  ];
  ngOnInit(): void {
    this.loadAccounts();
    this.filterForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.clear());
  }
  loadAccounts(): void {
    if (this.accountLoading() || this.loadingReport() || this.exporting()) return;
    this.accountLoading.set(true); this.accountError.set('');
    this.accountService.getSelectList<Results<DropDownSelect>>({ skipErrorInterceptor: true })
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.accountLoading.set(false)))
      .subscribe({
        next: result => {
          this.accounts.set(result.isSuccess ? result.entities ?? [] : []);
          if (!result.isSuccess) this.accountError.set(result.message || 'apiErrors.unexpectedMessage');
        },
        error: error => { this.accounts.set([]); this.accountError.set(apiErrorMessage(error, 'apiErrors.unexpectedMessage')); },
      });
  }
  search(): void {
    if (this.loadingReport() || this.exporting() || this.accountLoading() || this.accountError()) return;
    if (this.filterForm.invalid) { this.filterForm.markAllAsTouched(); focusField('journal-range'); return; }
    const value = this.filterForm.getRawValue();
    const [fromDate, toDate] = parseDateRange(value.dateRange);
    this.appliedFilter = {
      fromDate: fromDate ?? undefined, toDate: toDate ?? undefined,
      voucherNo: value.voucherNo.trim() || undefined, type: value.type ?? undefined,
      chassisOrPlateNo: value.chassisOrPlateNo.trim() || undefined, accountId: value.accountId ?? undefined,
    };
    this.paging.update(state => ({ ...state, pageNo: 1 })); this.loadPage();
  }
  reset(): void {
    if (this.exporting() || this.loadingReport()) return;
    this.filterForm.reset({ dateRange: currentMonthRange(), voucherNo: '', type: null, chassisOrPlateNo: '', accountId: null });
  }
  refresh(): void { if (this.appliedFilter && !this.loadingReport() && !this.exporting()) this.loadPage(); }
  pageChanged(event: DataTablePaginationEvent): void {
    if (!this.appliedFilter || this.loadingReport() || this.exporting()) return;
    const next = resolveListPaging({ first: event.first, rows: event.pageSize }, this.paging());
    if (!next.changed) return;
    this.paging.set({ pageNo: next.pageNo, pageSize: next.pageSize }); this.loadPage();
  }
  private loadPage(): void {
    if (!this.appliedFilter) return;
    this.request?.unsubscribe();
    this.data.set([]); this.errorMessage.set(''); this.hasSearched.set(true); this.loadingReport.set(true);
    this.filterForm.disable({ emitEvent: false });
    const { pageNo, pageSize } = this.paging();
    this.request = this.service.getJournal(this.appliedFilter, pageNo, pageSize)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
        this.loadingReport.set(false); this.filterForm.enable({ emitEvent: false });
      }))
      .subscribe({
        next: result => {
          if (!result.isSuccess) { this.fail(result.message || 'apiErrors.unexpectedMessage'); return; }
          this.data.set(result.entities ?? []); this.totalCount.set(result.totalCount ?? 0);
          this.paging.set({ pageNo: result.pageNo ?? pageNo, pageSize: result.pageSize ?? pageSize });
        },
        error: error => this.fail(apiErrorMessage(error, 'apiErrors.unexpectedMessage')),
      });
  }
  export(): void {
    if (!this.appliedFilter || !this.data().length || this.exporting() || this.loadingReport()) return;
    const filters = { ...this.appliedFilter };
    this.exporting.set(true); this.filterForm.disable({ emitEvent: false }); this.errorMessage.set('');
    fetchAllPages(page => this.service.getJournal(filters, page, 100), 'apiErrors.unexpectedMessage')
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
        this.exporting.set(false); this.filterForm.enable({ emitEvent: false });
      })).subscribe({
        next: rows => onExportToExcel(signal(dataTableExportRows(rows, this.columns, key => this.translate.instant(key))), 'Journal'),
        error: error => this.errorMessage.set(error instanceof Error && !(error instanceof HttpErrorResponse)
          ? error.message : apiErrorMessage(error, 'apiErrors.unexpectedMessage')),
      });
  }
  private typeLabel(value: string | null): string {
    const type = this.voucherTypes.find(item => item.value === value);
    return type ? this.translate.instant(type.label) : value || '—';
  }
  private fail(message: string): void { this.data.set([]); this.totalCount.set(0); this.errorMessage.set(message); }
  private clear(): void {
    this.request?.unsubscribe(); this.appliedFilter = null; this.data.set([]); this.totalCount.set(0);
    this.hasSearched.set(false); this.errorMessage.set(''); this.paging.update(state => ({ ...state, pageNo: 1 }));
  }
}
