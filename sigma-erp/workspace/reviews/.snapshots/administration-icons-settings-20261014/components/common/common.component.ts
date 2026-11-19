import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AbstractControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { CommonDTO } from '../../models/common';
import { EnumToArrayPipe } from 'src/app/modules/shared/enums/enum-to-array.pipe';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SelectedItem } from 'src/app/modules/shared/models/selected-item';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { DropdownModule } from 'primeng/dropdown';
import { DateFormatsEnum } from 'src/app/_metronic/shared/enums/dateFormats';
import { TimeZonesEnum } from 'src/app/_metronic/shared/enums/timeZones';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonsComponent } from 'src/app/modules/shared/components/buttons/buttons.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Result } from 'src/app/modules/shared/models/result';
import { finalize, forkJoin } from 'rxjs';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { InvoicingRuleEnum } from 'src/app/_metronic/shared/enums/invoicingRule';
import { CalendarModule } from 'primeng/calendar';
import { ApiKeyService } from 'src/app/modules/shared/service/api-key.service';
import { RateCardTypeEnum } from 'src/app/_metronic/shared/enums/rateCardType';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AssetDisposalPostingOptionEnum } from 'src/app/_metronic/shared/enums/assetDisposalPostingOption';
import { TimeEnum } from 'src/app/_metronic/shared/enums/time';
import { WeekEndsEnum } from 'src/app/_metronic/shared/enums/weekEnds';
import { InvoiceTypeEnum } from 'src/app/_metronic/shared/enums/invoiceType';
import { PaymentMethodService } from '../../../PaymentMethods/services/paymentmethod.service';
import { Results } from 'src/app/modules/shared/models/results';
import { DropDownSelect } from 'src/app/modules/shared/models/dropdown-select';
import { MultiSelectModule } from 'primeng/multiselect';
import { SalesPersonDesignationEnum } from 'src/app/_metronic/shared/enums/salesPersonDesignation';
import { EditProfileDialogComponent } from 'src/app/modules/shared/interceptores/error.interceptor';
import { DialogService } from 'primeng/dynamicdialog';
import { PaymentMethodDTO } from '../../../PaymentMethods/models/list';
import { CommonSettingsService } from '../../services/common.service';

@Component({
  selector: 'app-common',
  standalone: true,
  imports: [MockDataFormsModule,
    CommonModule, ReactiveFormsModule, TranslateModule,
    DropdownModule, InputNumberModule, InputTextModule,
    ButtonsComponent, CheckboxModule, ChipsModule,
    CalendarModule, RadioButtonModule, MultiSelectModule],
  templateUrl: './common.component.html',
  styleUrl: './common.component.scss',
  providers: [EnumToArrayPipe],
})
export class CommonComponent extends BaseComponentService {
  //#region properties
  commonForm: FormGroup;
  timeZoneList = signal<SelectedItem[]>([]);
  dateFormatList = signal<SelectedItem[]>([]);
  invoicingRuleList = signal<SelectedItem[]>([]);
  rateCardList = signal<SelectedItem[]>([]);
  assetDisposalPostingOptionList = signal<SelectedItem[]>([]);
  halfDaySlabList = signal<SelectedItem[]>([]);
  weekEndList = signal<SelectedItem[]>([]);
  invoicingTypeList = signal<SelectedItem[]>([]);
  ddaReceiptsPaymentMethodsList = signal<PaymentMethodDTO[]>([]);
  salesPersonDesignationList = signal<SelectedItem[]>([]);
  readonly buttons: ButtonModel[] = [
    { id: 'btn-save', text: 'general.save', type: 'primary', class: 'me-2', icon: 'bi bi-save' },
  ];
  readonly keyButtons: ButtonModel[] = [
    { id: 'btn-generate-key', text: 'settings.commonModel.generateKey', type: 'primary', icon: 'bi bi-save' },
  ];
  private isNew = true;

  //#endregion

  //#region injectors
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly destroyRef = inject(DestroyRef);
  private readonly enumToArrayPipe = inject(EnumToArrayPipe);
  private readonly commonService = inject(CommonSettingsService);
  private readonly apiKeyService = inject(ApiKeyService);
  private readonly paymentMethodService = inject(PaymentMethodService);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);
  //#endregion

  //#region methods
  ngOnInit(): void {
    this.loadDropdowns();
    this.initForm();
    this.getCommonSettings();
  }

  initForm() {
    this.commonForm = this.fb.group({
      id: [0],
      timeZone: [null, Validators.required],
      dateFormat: [null, Validators.required],
      tenantLoginTimeout: [0, Validators.required],
      currencyCode: ['', [Validators.required]],
      currencyName: ['', [Validators.required]],
      decimalCurrencyName: ['', [Validators.required]],
      autoCalculateAmountInWords: [false],
      currencyDecimals: [null, [Validators.required]],
      taxPercentage: [null, [Validators.required]],
      allPricesWithoutTax: [false],
      taxInclusion: [false],
      isTaxOptional: [false],
      autoSplitChargesForBroker: [[], this.arrayRequiredValidator],
      enableWeeklyMonthlyRental: [false],
      rentalGracePeriodIndividualMinutes: [0, [Validators.required]],
      rentalGracePeriodCompanyMinutes: [0, [Validators.required]],
      enableHourlyRental: [false],
      generateDailyInvoiceForDailyAgreement: [false],
      applyTaxOnTollFineParkingSurchargeForTaxExemptedCustomers: [false],
      allowInvoiceMergingOnToDate: [false],
      dailyRateFromDays: [0, [Validators.required]],
      dailyRateToDays: [0, [Validators.required]],
      weeklyRateFromDays: [0, [Validators.required]],
      weeklyRateToDays: [0, [Validators.required]],
      youngDriverExperienceYears: [0, [Validators.required]],
      ageLessThanYears: [0, [Validators.required]],
      generateWeeklyInvoicesForWeeklyAgreementsIndividuals: [false],
      generateWeeklyInvoicesForWeeklyAgreementsCompanies: [false],
      defaultInvoicingRuleForWeeklyInvoicesIndividuals: [null, [Validators.required]],
      defaultInvoicingRuleForWeeklyInvoicesCompanies: [null, [Validators.required]],
      enableCustomerWiseSettingForMonthlyInvoicing: [false],
      receiptOnScreenAllocationWithTypesOfCharges: [false],
      invoicingCutoffDate: [null, [Validators.required]],
      ddaReceiptsPaymentMethods: [[]],
      salesPersonMandatoryInCustomerWhileOpeningRentalAgreement: [false],
      enableFutureAgreementCheckOut: [false],
      enableAdditionalNotesField: [false],
      doNotAllowReceiptCreationWithoutAgreement: [false],
      allowReceiptOnScreenAllocationPartially: [false],
      allowSupplierPaymentOnScreenAllocationPartially: [false],
      useCustomerBranchForVouchers: [false],
      showBlackListedCustomerInAgreement: [false],
      doNotShowAgreementNoInSOAEmail: [false],
      vehicleProfitLossExcludedAccounts: [[]],
      custodyMovementDueAmountLimit: [0, [Validators.required]],
      isLeftHandDriving: [false],
      showDamagesPicturesOnCheckCard: [false],
      selectCustomerFromList: [false],
      serviceAlertsPriorKms: [0, [Validators.required]],
      serviceAlertsPriorDays: [0, [Validators.required]],
      webBookingApiKey: ['', Validators.required],
      rateCardForWebBookingPlugin: [null, [Validators.required]],
      showGroupWithAvailableVehicle: [false],
      googleApiKey: ['', Validators.required],
      mileageUpdateAlertAfterMonths: [0, [Validators.required]],
      invoiceDateAsGenerationDate: [false],
      invoiceDateAsGenerationDateForAllInvoices: [false],
      dontCheckDepreciationAndAmortizationInFiscalMonthClosing: [false],
      tariffCardExplicitSelectionInBookingAgreement: [false],
      createNewBookingAlwaysAsConfirmed: [false],
      assetDisposalPostingOption: [null],
      estimateOrSetAssetSalePrice: [false],
      decliningDepreciationOnAssetLifeBookValue: [false],
      profitMarginPercentageOnAssetCostPrice: [0, [Validators.required]],
      dueForSaleKMsThreshold: [0, [Validators.required]],
      dueForSalePeriodYears: [0, [Validators.required]],
      includeBuyBack: [false],
      detailedUtilizationReportTime: [null],
      makeCreditCardInfoRequiredInReceipt: [false],
      getCloseAgreementsForDriverTimeSheet: [false],
      fuelSurchargeInvoiceClubWithFuelInvoice: [false],
      fuelAverageUsingPettyCashPayment: [false],
      percentageFuelSurchargeInvoice: [0, [Validators.required]],
      currentFuelPrice: [0, [Validators.required]],
      halfDaySlab1Fom: [null, [Validators.required]],
      halfDaySlab1To: [null, [Validators.required]],
      halfDaySlab2Fom: [null, [Validators.required]],
      halfDaySlab2To: [null, [Validators.required]],
      weekEndDay1: [null, [Validators.required]],
      weekEndDay2: [null, [Validators.required]],
      mixWeekEnds: [false],
      weekEndKMsLimit: [0, [Validators.required]],
      monthlyInvoicesIndividualsRule: [null, [Validators.required]],
      monthlyInvoicesCompaniesRule: [null, [Validators.required]],
      monthlyInvoicesIndividualsType: [null, [Validators.required]],
      monthlyInvoicesCompaniesType: [null, [Validators.required]],
      leaseInvoicesIndividualsRule: [null, [Validators.required]],
      leaseInvoicesCompaniesRule: [null, [Validators.required]],
      leaseInvoicesIndividualsType: [null, [Validators.required]],
      leaseInvoicesCompaniesType: [null, [Validators.required]],
      useRentalInvoicingRuleForWeeklyInvoicesIndividuals: [false],
      useRentalInvoicingRuleForWeeklyInvoicesCompanies: [false],
      receiptOnScreenAllocationWithReceivables: [false],
      renalQuotationsValidityDays: [0, [Validators.required]],
      linkCrsVehicleWithWorkshopVehicleOnChassisNo: [false],
      mergeEnglishAndArabicDescriptionAndLocationInDownloadingTamm: [false],
      enableManualAgreementNoField: [false],
      vehicleTypeOptionalInBooking: [false],
      setVehicleOptionalInBookingConfirmation: [false],
      allowDepositInBookingWithoutReceivingAmount: [false],
      warningOnChangingBranch: [false],
      hideSpecificColumnsInTripReportGlobalWings: [false],
      enableTotalLossInAssets: [false],
      makeReceiptDepositOptionalInAdvanceTaxInvoice: [false],
      showDescriptionForAtiAllocationInInvoice: [false],
      addDamageChargesAndInvoiceableCheckboxOnAccidentModule: [false],
      generateAdvanceTaxInvoiceFromAdvanceTaxReceipt: [false],
      generateAdvanceAsAtrAndGenerateAtiBookingAgreement: [false],
      claimChargesInTotalLoss: [false],
      salesPersonSelectionInsteadOfSearching: [false],
      doNotShowUnapprovedPdc: [false],
      allowAssetSaleInvoiceCreationDateAsAssetDisposalDate: [false],
      allowResubmitOnChequeReceivables: [false],
      createMultipleBillsOnPurchaseOrder: [false],
      doNotGenerateInvoiceOnAgreementClosing: [false],
      doNotAddDashInVoucherNo: [false],
      generateDailyInvoiceForAnyPeriod: [false],
      agreementReceiptAllocateOnlyWithAgreementInvoices: [false],
      autoApproveAllBillsExceptFineBills: [false],
      showAllTypeOfPaymentsInCashDeposits: [false],
      autoFetchUnitPriceInPoFromLastSupplierPurchaseBasedOnGrn: [false],
      purchaseAndSalesHistoryInPurchaseOrder: [false],
      autoIssueOfItemsInJcFromGrn: [false],
      allowPartialRefund: [false],
      addPaymentInCreditCardBankTransfer: [false],
      enableManualBookingNoField: [false],
      enablePickAndDropLocationInAgreement: [false],
      takeSignatureOnAgreementOpeningInMobileApp: [false],
      takeSignatureOnAgreementOpenedWebCreated: [false],
      poMandatoryForWorkshopMovement: [false],
      notesMandatoryForWorkshopMovement: [false],
      enableFutureInvoicing: [false],
      enableLocationDetailsInMovements: [false],
      invoiceFuelChargesOnReplacement: [false],
      allowPrintingOfVoidedVouchers: [false],
      estimatedRevenueReportsGenerateBasedOnActualClosingCharges: [false],
      enableCurrentPreviousDatedChequeDirectlyToBank: [false],
      taxPercentageInBillAndJvImport: [false],
      importVoucherLinesWithTax: [false],
      enableCurrentPreviousDatedChequePayableDirectlyToBank: [false],
      setBillDateAsCurrentDate: [false],
      manuallyDateChangeInFineBillGeneration: [false],
      dontAllowToSaveCustomerWithExpiryDocument: [false],
      vehicleRegistrationExpiryAndServiceDuePopupOnAgreementMovementsSaving: [false],
      depreciationTillOfSaleDateInsteadOfDisposalDate: [false],
      doNotRentMultipleVehiclesOnSameDriverCheck: [false],
      weeklyAgreementChargedMinimumOneWeek: [false],
      doNotAllowAgreementCreationIfDocumentsAreExpired: [false],
      doNotAllowRentalAgreementCreationIfNoDocumentsAttached: [false],
      includeFuelChargesInRevenueAnalysisReport: [false],
      calculateAndShowAgreementChargesTillNow: [false],
      customizeRevenueLinkingForContactGroups: [false],
      alertsForExternalVehicle: [false],
      alertsForMortgageVehicle: [false],
      creditCardLast4Digits: [false],
      manuallyConfirmBooking: [false],
      enableTermsAndConditionsOnAgreementCheckOut: [false],
      doNotIncludeReplacementVehicles: [false],
      isPoNoMandatoryForComapnyIn: [false],
      vehicleSearchByChassisNoBesidesPlateNo: [false],
      showBookedVehiclesInDashboard: [false],
      showLimoVehiclesInDashboard: [false],
      showReplacementTodayVehiclesInDashboard: [false],
      showLimitedFieldsForAgreementViewInAgreementDashboard: [false],
      enableCostCenterGroup2: [false],
      enableVoucherPrintingAfterApproval: [false],
      kmsConfirmationPopupOnCheckIn: [false],
      createLeaseAgreementByWizard: [false],
      dontAllowCheckInWithZeroKms: [false],
      allowOverAllocationForCreditNotesReceipts: [false],
      selectChargesTypeInMiscInvoice: [false],
      deleteFineBills: [false],
      allowWorkshopMovementForExternalVehicleInCrs: [false],
      dontAllowWorkshopMovementWhenAlreadyVehicleStatusIsWorkshop: [false],
      disableTollsAndFinesDownloading: [false],
      disableKmInOutAndDriversInAgreement: [false],
      showAllDueVouchersStatementOfAccounts: [false],
      showAllocationsInStatementOfAccount: [false],
      showAllocationsInCreditNote: [false],
      doNotAllowAssetCreationIfVehicleDoesNotExist: [false],
      showLastJobDetailOnJobPrint: [false],
      importAndAttachPoInBill: [false],
      dontAllowPrintForUnApprovedJobEstimation: [false],
      showLogoInAppReportPrint: [false],
      allowGatePassPrintWithoutReceipt: [false],
      allowZeroChargesInMisc: [false],
      grnAsFinancialVoucher: [false],
      getSoaOfCurrentBranchCustomersOnly: [false],
      quotationIsMandatoryForAllIndividualCustomersForWeeklyAndMonthly: [false],
      agreementAutoEndDate: [false],
      branchWiseInvoicing: [false],
      showFuelPercentageInsteadOfFraction: [false],
      calculateAmortizationForLastPeriodInsteadOfPassingPendingAmount: [false],
      doNotGenerateJobClosingInvoiceForInternalCustomer: [false],
      showBookingReferenceNoInStatementOfAccountAndReceiptAllocation: [false],
      showVoucherDetailedDescriptionInSoa: [false],
      showVoucherDescriptionInSupplierOutstandingSoa: [false],
      showPlateNoForWorkshopInvoiceInSoa: [false],
      showDescriptionForLimousineInvoiceInSoa: [false],
      allowComplimentaryAgreement: [false],
      considerExtraFuelInWhileFuelChargesCalculation: [false],
      showFirstVehicleInBillSoa: [false],
      showUnallocatedAmountInReceivableAgeAnalysis: [false],
      showOnlyStaffForUserContact: [false],
      showAdvancePhoneNumberInputInContacts: [false],
      allowOnlyNumericNumberInMobilePhoneOnCustomer: [false],
      separateMakeAndModelInFleet: [false],
      agreementStartDateAsAdvanceReceiptAndDepositDate: [false],
      onBookingConfirmationVehicleSubstatusToBeChangedToPendingCustomerDelivery: [false],
      editEmiInterest: [false],
      doNotAllowDuplicateChequeNumberInReceiptsAndPayments: [false],
      doNotAllowDiscountInPo: [false],
      allowGeneralBillOnCustomer: [false],
      allowPdcPrintingBeforeClearance: [false],
      replacementOfMakeAndModelInGridForVehicles: [false],
      showCustomFieldForCheckOutAndCheckInMovement: [false],
      showCustomField3InMovement: [false],
      autoFixedDecimalRounding: [false],
      allowDuplicateCustomerNameWhileCreatingNewCustomer: [false],
      allowQuantityAndRateColumnInMiscInvoice: [false],
      selectToBranchInNrtMovement: [false],
      showAllWorkshopMovementsInServiceLog: [false],
      showFineInvoiceDetailInCustomerSoa: [false],
      showAgreementInReceipt: [false],
      showYearFilterInDateRange: [false],
      showOnlyDueVouchersBasedOnCreditPeriod: [false],
      generalBillQuantityPriceBasedOnPo: [false],
      agreementAndCustomerBalanceInRentalAgreement: [false],
      showExpiryDetailsForWarrantyOfVehicles: [false],
      allowMovementsForSaleVehicle: [false],
      displayExtendedAgreementDetailsInLogAndExportRentalLease: [false],
      salesPersonDesignation: [null, [Validators.required]],
      rentalQuotationsValidityDays: [null, [Validators.required]],
    });
  }
  arrayRequiredValidator(control: AbstractControl) {
    return control.value && control.value.length > 0 ? null : { required: true };
  }
  getCommonSettings() {
    this.loading.startLoading();
    this.commonService.getMySetting<CommonDTO>().pipe(takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.endLoading())).subscribe({
        next: (res) => {
          if (res.isSuccess && res.entity) {
            this.commonForm.patchValue(res.entity);
            this.isNew = false;
          } else {
            this.isNew = true;
          }
        },
      });
  }

  loadDropdowns() {
    this.timeZoneList.set(this.enumToArrayPipe.transform(TimeZonesEnum));
    this.dateFormatList.set(this.enumToArrayPipe.transform(DateFormatsEnum));
    this.invoicingRuleList.set(this.enumToArrayPipe.transform(InvoicingRuleEnum));
    this.rateCardList.set(this.enumToArrayPipe.transform(RateCardTypeEnum));
    this.assetDisposalPostingOptionList.set(this.enumToArrayPipe.transform(AssetDisposalPostingOptionEnum));
    this.halfDaySlabList.set(this.enumToArrayPipe.transform(TimeEnum));
    this.weekEndList.set(this.enumToArrayPipe.transform(WeekEndsEnum));
    this.invoicingTypeList.set(this.enumToArrayPipe.transform(InvoiceTypeEnum));
    this.salesPersonDesignationList.set(this.enumToArrayPipe.transform(SalesPersonDesignationEnum));

    this.loading.startLoading();

    forkJoin({
      paymentMethods: this.paymentMethodService.get<Results<DropDownSelect>>(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          if (res.paymentMethods.isSuccess && res.paymentMethods.entities.length > 0) {
            this.ddaReceiptsPaymentMethodsList.set(res.paymentMethods.entities.map((paymentMethod: any) => ({
              id: paymentMethod.id,
              value: paymentMethod.name,
              active: paymentMethod.active,
              branchId: paymentMethod.branchId,
              userId: paymentMethod.userId,
              category: paymentMethod.category,
              name: paymentMethod.name,
            })))
          }
          this.loading.endLoading();
        },
      });
  }

  onButtonClick(buttonId: string) {
    const actions: Record<string, () => void> = {
      'btn-save': () => this.save(),
      'btn-generate-key': () => this.generateKey(),
    };
    actions[buttonId]?.();
  }

  generateKey() {
    const payload = {
      apiKey: this.commonForm.value.webBookingApiKey,
    };
    this.apiKeyService.post(payload).pipe(takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.endLoading())).subscribe();
  }

  save() {
    if (this.commonForm.invalid) {
      const message = this.translateService.instant('settings.commonModel.errorControlCommon');
      const header = this.translateService.instant('settings.profileModel.errorHeader');
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

    const payload = {
      ...this.commonForm.value,
      taxInclusion: this.commonForm.value.taxInclusion ? 1 : 0,
    };

    const ddaReceiptsPaymentMethodsIds: number[] = this.commonForm.value.ddaReceiptsPaymentMethods || [];
    payload.ddaReceiptsPaymentMethods = ddaReceiptsPaymentMethodsIds.map(id => {
      const method = this.ddaReceiptsPaymentMethodsList().find(m => m.id === String(id));
      return {
        name: method?.name ?? '',
        category: method?.category ?? 0,
        type: method?.type ?? 0,
        code: method?.code ?? '',
        branchId: method?.branchId ?? 0,
        userId: method?.userId ?? 0,
        active: method?.active ?? true,
        subscriptionId: this.subscriptionId,
      };
    });

    payload.subscriptionId = this.subscriptionId;

    const request$ = this.isNew
      ? this.commonService.post<Result<CommonDTO>>(payload)
      : this.commonService.put<Result<CommonDTO>>(payload);
    request$.pipe(takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.getCommonSettings();
          }
        },
      });
  }
  //#endregion
}
