import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/modules/shared/components/buttons/buttons.component';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { SettingsDocumentNumberModelService } from '../../services/document-number.service';
import { DialogService } from 'primeng/dynamicdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InvoiceTypeCodeEnum } from 'src/app/_metronic/shared/enums/invoiceTypeCode';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Results } from 'src/app/modules/shared/models/results';
import { DocumentNumberDTO } from '../../models/document-number';
import { EditProfileDialogComponent } from 'src/app/modules/shared/interceptores/error.interceptor';

@Component({
  selector: 'app-document-number',
  standalone: true,
  imports: [MockDataFormsModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonsComponent,
    CheckboxModule,
    InputNumberModule,
    InputTextModule
  ],
  templateUrl: './document-number.component.html',
  styleUrl: './document-number.component.scss'
})
export class DocumentNumberComponent extends BaseComponentService {
  //#region properties
  form: FormGroup;

  readonly buttons: ButtonModel[] = [
    { id: 'btn-save', text: 'general.save', type: 'primary', class: 'me-2', icon: 'bi bi-save' },
  ];
  private isNew = true;
  //#endregion
  //#region injectors
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly destroyRef = inject(DestroyRef);
  private readonly basicService = inject(SettingsDocumentNumberModelService);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);
  //#endregion

  //#region methods
  ngOnInit(): void {
    this.initForm();
    this.initInvoiceTypes();
    this.getDocumentNumberSettings();
  }

  initForm() {
    this.form = this.fb.group({
      id: [0],
      agreementNoIsManual: [true],
      agreementNoIncludeSaleOriginCode: [true],
      agreementNoIncludeBranchCode: [true],
      agreementNoIncludeBranchCode2: [true],
      agreementNoIncludeAgreementTypeCode: [true],
      agreementNoIncludeYearMonth: [true],
      agreementNoNumericPartLength: [0, [Validators.required]],
      agreementNoExcludeBranchPrefixForLease: [true],
      agreementTypeHourlyCode: [''],
      agreementTypeDailyCode: [''],
      agreementTypeWeeklyCode: [''],
      agreementTypeMonthlyCode: [''],
      agreementTypeLeaseCode: [''],
      salesAgreementIncludeBranchCode: [true],
      salesAgreementIncludeBranchCode2: [true],
      salesAgreementCodePrefix: [''],
      salesAgreementIncludeYear: [true],
      salesAgreementIncludeMonth: [true],
      salesAgreementNumericPartLength: [0, [Validators.required]],
      salesQuotationIncludeBranchCode: [true],
      salesQuotationIncludeBranchCode2: [true],
      salesQuotationCodePrefix: [''],
      salesQuotationIncludeYear: [true],
      salesQuotationIncludeMonth: [true],
      salesQuotationNumericPartLength: [0, [Validators.required]],
      rentalQuotationIncludeBranchCode: [true],
      rentalQuotationCodePrefix: [''],
      rentalQuotationIncludeYear: [true],
      rentalQuotationIncludeMonth: [true],
      rentalQuotationNumericPartLength: [0, [Validators.required]],
      equipmentRentalQuotationIncludeBranchCode: [true],
      equipmentRentalQuotationIncludeBranchCode2: [true],
      equipmentRentalQuotationCodePrefix: [''],
      equipmentRentalQuotationIncludeYear: [true],
      equipmentRentalQuotationIncludeMonth: [true],
      equipmentRentalQuotationNumericPartLength: [0, [Validators.required]],
      leaseQuotationIncludeBranchCode: [true],
      leaseQuotationIncludeBranchCode2: [true],
      leaseQuotationCodePrefix: [''],
      leaseQuotationIncludeYear: [true],
      leaseQuotationIncludeMonth: [true],
      leaseQuotationNumericPartLength: [0, [Validators.required]],
      equipmentRentalMasterAgreementPrefix: [''],
      equipmentRentalMasterAgreementUseYearMonth: [true],
      equipmentRentalMasterAgreementNumericPartLength: [0, [Validators.required]],
      leaseMasterAgreementPrefix: [''],
      leaseMasterAgreementIncludeYearMonth: [true],
      leaseMasterAgreementNumericPartLength: [0, [Validators.required]],
      rentalMasterAgreementPrefix: [''],
      rentalMasterAgreementIncludeYear: [true],
      rentalMasterAgreementIncludeMonth: [true],
      rentalMasterAgreementNumericPartLength: [0, [Validators.required]],
      deliveryNoPrefix: [''],
      deliveryNoIncludeMasterAgreementNo: [true],
      deliveryNoNumericPartLength: [0, [Validators.required]],
      bookingNoIncludeSaleOriginCode: [true],
      bookingNoIncludeBranchCode: [true],
      bookingNoIncludeBookingTypeCode: [true],
      bookingNoIncludeYearMonth: [true],
      bookingNoNumericPartLength: [0, [Validators.required]],
      bookingTypeDailyCode: [''],
      bookingTypeWeeklyCode: [''],
      bookingTypeMonthlyCode: [''],
      invoiceNoIncludeBranchCode: [true],
      invoiceNoIncludeInvoiceTypeCode: [true],
      invoiceNoIncludeYearMonth: [true],
      invoiceNoNumericPartLength: [0, [Validators.required]],
      settingsDocumentNumberInvoiceTypes: this.fb.array([]),
      creditNoteNoIsManual: [true],
      creditNoteNoIncludeBranchCode: [true],
      creditNoteNoIncludeBranchCode2: [true],
      creditNoteNoVoucherTypePrefix: [''],
      creditNoteNoIncludeYearMonth: [true],
      creditNoteNoNumericPartLength: [0, [Validators.required]],
      debitNoteNoIncludeBranchCode: [true],
      debitNoteNoVoucherTypePrefix: [''],
      debitNoteNoIncludeYearMonth: [true],
      debitNoteNoNumericPartLength: [0, [Validators.required]],
      receiptNoIsManual: [true],
      receiptNoIncludeBranchCode: [true],
      receiptNoVoucherTypePrefix: [''],
      receiptNoIncludeYearMonth: [true],
      receiptNoNumericPartLength: [0, [Validators.required]],
      billNoIsManual: [true],
      billNoIncludeBranchCode: [true],
      billNoVoucherTypePrefix: [''],
      billNoIncludeYearMonth: [true],
      billNoNumericPartLength: [0, [Validators.required]],
      purchaseOrderNoIncludeBranchCode: [true],
      purchaseOrderNoVoucherTypePrefix: [''],
      purchaseOrderNoIncludeYearMonth: [true],
      purchaseOrderNoNumericPartLength: [0, [Validators.required]],
      purchaseRequestNoIncludeBranchCode: [true],
      purchaseRequestNoVoucherTypePrefix: [''],
      purchaseRequestNoIncludeYearMonth: [true],
      purchaseRequestNoNumericPartLength: [0, [Validators.required]],
      provisionNoIncludeBranchCode: [true],
      provisionNoVoucherTypePrefix: [''],
      provisionNoIncludeYearMonth: [true],
      provisionNoNumericPartLength: [0, [Validators.required]],
      paymentNoIncludeBranchCode: [true],
      paymentNoNumericPartLength: [0, [Validators.required]],
      paymentNoIncludeTypeCode: [true],
      paymentNoIncludeYearMonth: [true],
      paymentNoIncludeMethodCode: [true],
      paymentTypeCustomerCode: [''],
      paymentTypeSupplierCode: [''],
      paymentTypeStaffCode: [''],
      paymentTypePettyCashExpenseCode: [''],
      paymentTypeDepositRefundCode: [''],
      paymentTypeGeneralCode: [''],
      jvNoIncludeBranchCode: [true],
      jvNoVoucherTypePrefix: [''],
      jvNoIncludeYearMonth: [true],
      jvNoNumericPartLength: [0, [Validators.required]],
      amortizationNoVoucherTypePrefix: [''],
      amortizationNoNumericPartLength: [0, [Validators.required]],
      customerDepositNoIncludeBranchCode: [true],
      customerDepositNoVoucherTypePrefix: [''],
      customerDepositNoIncludeYearMonth: [true],
      customerDepositNoNumericPartLength: [0, [Validators.required]],
      depreciationNoVoucherTypePrefix: [''],
      depreciationNoNumericPartLength: [0, [Validators.required]],
      matureChequePayableNoVoucherTypePrefix: [''],
      matureChequePayableNoIncludeYearMonth: [true],
      matureChequePayableNoNumericPartLength: [0, [Validators.required]],
      cancelChequePayableNoVoucherTypePrefix: [''],
      cancelChequePayableNoIncludeYearMonth: [true],
      cancelChequePayableNoNumericPartLength: [0, [Validators.required]],
      matureChequeReceivableNoVoucherTypePrefix: [''],
      matureChequeReceivableNoIncludeYearMonth: [true],
      matureChequeReceivableNoNumericPartLength: [0, [Validators.required]],
      returnChequeReceivableNoVoucherTypePrefix: [''],
      returnChequeReceivableNoIncludeYearMonth: [true],
      returnChequeReceivableNoNumericPartLength: [0, [Validators.required]],
      cardTransactionsBankTransferNoVoucherTypePrefix: [''],
      cardTransactionsBankTransferNoIncludeYearMonth: [true],
      cardTransactionsBankTransferNoNumericPartLength: [0, [Validators.required]],
      chartOfAccountsSubAccountLength: [0, [Validators.required]],
      customersIsManual: [true],
      customersIncludeBranchCode: [true],
      customersIncludeBranchCode2: [true],
      customersIndividualCodePrefix: [''],
      customersCompanyCodePrefix: [''],
      customersNumericPartLength: [0, [Validators.required]],
      suppliersIsManual: [true],
      suppliersCodePrefix: [''],
      suppliersNumericPartLength: [0, [Validators.required]],
      staffIsManual: [true],
      staffCodePrefix: [''],
      staffNumericPartLength: [0, [Validators.required]],
      itemIsManual: [true],
      leaseInquiryCodePrefix: [''],
      leaseInquiryNumericPartLength: [0, [Validators.required]],
      jobsPrefix: [''],
      jobsNumericPartLength: [0, [Validators.required]],
      jobsIncludeYearMonth: [true],
      jobEstimationsPrefix: [''],
      jobEstimationsIncludeYearMonth: [true],
      jobEstimationsNumericPartLength: [0, [Validators.required]],
      depositUsedPrefix: [''],
      depositUsedNumericPartLength: [0, [Validators.required]],
      limoQuotationIncludeBranchCode: [true],
      limoQuotationCodePrefix: [''],
      limoQuotationNumericPartLength: [0, [Validators.required]],
    });
  }

  getDocumentNumberSettings() {
    this.loading.startLoading();
    this.basicService.get()
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res: Results<DocumentNumberDTO>) => {
          if (res.isSuccess && res.entities?.[0]) {
            const data = res.entities[0];
            this.form.patchValue(data);
            this.isNew = false;
          } else {
            this.isNew = true;
          }
        },
      });
  }

  get settingsDocumentNumberInvoiceTypes() {
    return this.form.get('settingsDocumentNumberInvoiceTypes') as FormArray;
  }

  createInvoiceTypeForm(type: InvoiceTypeCodeEnum) {
    return this.fb.group({
      subscriptionId: this.subscriptionId,
      id: [0],
      invoiceType: [type],
      code: [''],
    });
  }

  initInvoiceTypes() {
    Object.values(InvoiceTypeCodeEnum)
      .filter(value => typeof value === 'number')
      .forEach((type: number) => {
        this.settingsDocumentNumberInvoiceTypes
          .push(this.createInvoiceTypeForm(type as InvoiceTypeCodeEnum));
      });
  }

  getInvoiceTypeLabel(type: InvoiceTypeCodeEnum): string {
    return InvoiceTypeCodeEnum[type];
  }

  onButtonClick(buttonId: string) {
    const actions: Record<string, () => void> = {
      'btn-save': () => this.save(),
    };
    actions[buttonId]?.();
  }
  save() {
    if (this.form.invalid) {
      const message = this.translateService.instant('settings.documentNumberModel.errorControlDocumentNumber');
      const header = this.translateService.instant('settings.documentNumberModel.errorHeader');
      this.dialogService.open(EditProfileDialogComponent, {
        header: header,
        width: '600px',
        data: {
          message: message,
        },
      });
      return;
    }
    this.loading.startLoading();
    const payload = this.form.getRawValue() as DocumentNumberDTO;
    payload.subscriptionId = this.subscriptionId;
    const request$ = this.isNew
      ? this.basicService.post(payload)
      : this.basicService.put(payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.getDocumentNumberSettings();
          }
        },
      });
  }

}
