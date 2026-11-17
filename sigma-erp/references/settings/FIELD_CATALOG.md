# فهرس حقول الإعدادات وأقسامها

تاريخ اللقطة المصدرية: ١ نوفمبر ٢٠٢٦. يُقرأ مع [شرح الاستخدام](README.md).
هذا جرد للحقول المعلنة ومجموعات العرض، وليس إثباتًا لتفعيلها في شاشات الأعمال.
الأسماء المعروضة من مفردات التطبيق الحالية؛ مفاتيح الأنواع والحقول ثابتة كما في المصدر.
تراجع المجالات الرقمية والمالية من أصحابها، ولا يصنف هذا الجرد كل رقم ككمية.

## صفحة الإعدادات العامة

المسار:

`/Settings/common`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/common/common.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| general | timeZone | المنطقة الزمنية | اختيار |
| general | dateFormat | تنسيق التاريخ | اختيار |
| general | tenantLoginTimeout | وقت انتهاء الجلسة | رقمي — يصنف حسب المجال |
| general | currencyCode | رمز العملة | نص/قيمة بحسب العقد |
| general | currencyName | العملة | نص/قيمة بحسب العقد |
| general | decimalCurrencyName | العملة العشرية | نص/قيمة بحسب العقد |
| general | autoCalculateAmountInWords | تحويل الرقم إلى كلمات | منطقي |
| general | currencyDecimals | عدد ارقام العملة | رقمي — يصنف حسب المجال |
| general | mergeEnglishAndArabicDescriptionAndLocationInDownloadingTamm | دمج الوصف والموقع باللغتين العربية والإنجليزية عند تنزيل ملف تم | منطقي |
| general | warningOnChangingBranch | إظهار تنبيه عند تغيير الفرع | منطقي |
| general | doNotAddDashInVoucherNo | عدم إضافة شرطة في رقم السند | منطقي |
| general | enableAdditionalNotesField | تفعيل حقل ملاحظات إضافية | منطقي |
| general | importVoucherLinesWithTax | استيراد بنود السندات مع الضريبة | منطقي |
| general | creditCardLast4Digits | آخر 4 أرقام من بطاقة الائتمان | منطقي |
| general | isPoNoMandatoryForComapnyIn | رقم أمر الشراء إلزامي لشركة | منطقي |
| general | enableCostCenterGroup2 | تفعيل مجموعة مركز التكلفة 2 | منطقي |
| general | disableTollsAndFinesDownloading | إيقاف تنزيل رسوم الطرق والغرامات | منطقي |
| general | allowZeroChargesInMisc | السماح برسوم صفرية في الفواتير المتنوعة | منطقي |
| general | showUnallocatedAmountInReceivableAgeAnalysis | إظهار المبالغ غير المخصصة في تقرير أعمار الذمم المدينة | منطقي |
| general | editEmiInterest | تعديل فائدة الأقساط (EMI) | منطقي |
| general | doNotAllowDiscountInPo | عدم السماح بالخصم في أمر الشراء | منطقي |
| general | autoFixedDecimalRounding | تقريب تلقائي للكسور العشرية الثابتة | منطقي |
| general | showYearFilterInDateRange | إظهار فلتر السنة في نطاق التاريخ | منطقي |
| general | showOnlyDueVouchersBasedOnCreditPeriod | إظهار السندات المستحقة فقط بناءً على فترة الائتمان | منطقي |
| tax | taxPercentage | نسبة الضريبة | رقمي — يصنف حسب المجال |
| tax | allPricesWithoutTax | إضافة الضريبة | منطقي |
| tax | taxInclusion | تضمين الضريبة | منطقي |
| tax | isTaxOptional | ضريبة اختيارية | منطقي |
| rental | dailyRateFromDays | من الأيام | رقمي — يصنف حسب المجال |
| rental | dailyRateToDays | إلى الأيام | رقمي — يصنف حسب المجال |
| rental | weeklyRateFromDays | من الأيام | رقمي — يصنف حسب المجال |
| rental | weeklyRateToDays | إلى الأيام | رقمي — يصنف حسب المجال |
| rental | youngDriverExperienceYears | سنوات الخبرة | رقمي — يصنف حسب المجال |
| rental | ageLessThanYears | العمر أقل من عدد سنوات محدد | رقمي — يصنف حسب المجال |
| rental | halfDaySlab1Fom | النصف اليوم 1 من | اختيار |
| rental | halfDaySlab1To | النصف اليوم 1 إلى | اختيار |
| rental | halfDaySlab2Fom | النصف اليوم 2 من | اختيار |
| rental | halfDaySlab2To | النصف اليوم 2 إلى | اختيار |
| rental | weekEndDay1 | النهايات الأسبوعية 1 | اختيار |
| rental | weekEndDay2 | النهايات الأسبوعية 2 | اختيار |
| rental | mixWeekEnds | مزيج نهايات الأسبوع | منطقي |
| rental | weekEndKMsLimit | حد مسافة نهاية الأسبوع | رقمي — يصنف حسب المجال |
| rental | isLeftHandDriving | القيادة من اليمين | منطقي |
| rental | showDamagesPicturesOnCheckCard | عرض صورة الأضرار على البطاقة | منطقي |
| rental | enableManualAgreementNoField | تمكين إدخال رقم العقد يدويًا | منطقي |
| rental | enablePickAndDropLocationInAgreement | تفعيل موقع الاستلام والتسليم في العقد | منطقي |
| rental | takeSignatureOnAgreementOpenedWebCreated | أخذ التوقيع عند فتح العقد المُنشأ من الويب | منطقي |
| rental | enableLocationDetailsInMovements | تفعيل تفاصيل الموقع في الحركات | منطقي |
| rental | enableFutureAgreementCheckOut | تفعيل خاصية إتمام عملية الشراء بموجب الاتفاقية المستقبلية | منطقي |
| rental | weeklyAgreementChargedMinimumOneWeek | العقد الأسبوعي يُحتسب بحد أدنى أسبوع واحد | منطقي |
| rental | doNotAllowAgreementCreationIfDocumentsAreExpired | عدم السماح بإنشاء عقد إذا كانت المستندات منتهية | منطقي |
| rental | doNotAllowRentalAgreementCreationIfNoDocumentsAttached | عدم السماح بإنشاء عقد إيجار إذا لم تُرفق المستندات | منطقي |
| rental | calculateAndShowAgreementChargesTillNow | حساب وعرض رسوم العقد حتى الآن | منطقي |
| rental | enableTermsAndConditionsOnAgreementCheckOut | تفعيل الشروط والأحكام عند إنهاء العقد | منطقي |
| rental | kmsConfirmationPopupOnCheckIn | نافذة تأكيد الكيلومترات عند تسجيل الدخول | منطقي |
| rental | createLeaseAgreementByWizard | إنشاء عقد تأجير عن طريق المعالج | منطقي |
| rental | dontAllowCheckInWithZeroKms | عدم السماح بتسجيل الدخول بكيلومترات صفر | منطقي |
| rental | disableKmInOutAndDriversInAgreement | إيقاف إدخال/إخراج الكيلومترات والسائقين في العقد | منطقي |
| rental | agreementAutoEndDate | تعيين تاريخ انتهاء العقد تلقائيًا | منطقي |
| rental | allowComplimentaryAgreement | السماح بعقد مجاني/مجاملة | منطقي |
| rental | showCustomFieldForCheckOutAndCheckInMovement | إظهار الحقل المخصص في حركة الخروج والدخول | منطقي |
| rental | showCustomField3InMovement | إظهار الحقل المخصص 3 في الحركة | منطقي |
| rental | selectToBranchInNrtMovement | اختيار الفرع في حركة NRT | منطقي |
| rental | displayExtendedAgreementDetailsInLogAndExportRentalLease | عرض تفاصيل العقد الموسعة في السجل والتصدير (إيجار/تأجير تمويلي) | منطقي |
| rental | custodyMovementDueAmountLimit | قيمة الحد الادنى للحركة | نص/قيمة بحسب العقد |
| rental | enableWeeklyMonthlyRental | إضافة الإيجار الأسبوعي/الشهري | منطقي |
| rental | rentalGracePeriodIndividualMinutes | فترة إجازة الإيجار الفردي | رقمي — يصنف حسب المجال |
| rental | rentalGracePeriodCompanyMinutes | فترة إجازة الإيجار الشركة | رقمي — يصنف حسب المجال |
| rental | enableHourlyRental | إضافة الإيجار الساعة | منطقي |
| rental | generateDailyInvoiceForDailyAgreement | إضافة إنشاء الفاتورة اليومية للإيجار اليومي | منطقي |
| rental | applyTaxOnTollFineParkingSurchargeForTaxExemptedCustomers | تطبيق الضريبة على رسوم التحصيلات والغرامة والشاحنات | منطقي |
| rental | allowInvoiceMergingOnToDate | إضافة إمكانية تطبيق الضريبة على رسوم التحصيلات والغرامة والشاحنات | منطقي |
| invoicing | monthlyInvoicesIndividualsRule | قاعدة الفواتير الشهرية للأفراد | اختيار |
| invoicing | monthlyInvoicesCompaniesRule | قاعدة الفواتير الشهرية للشركات | اختيار |
| invoicing | monthlyInvoicesIndividualsType | نوع الفواتير الشهرية للأفراد | اختيار |
| invoicing | monthlyInvoicesCompaniesType | نوع الفواتير الشهرية للشركات | اختيار |
| invoicing | leaseInvoicesIndividualsRule | قاعدة فواتير عقود الإيجار للأفراد | اختيار |
| invoicing | leaseInvoicesCompaniesRule | قاعدة فواتير عقود الإيجار للشركات | اختيار |
| invoicing | leaseInvoicesIndividualsType | نوع فواتير عقود الإيجار للأفراد | اختيار |
| invoicing | leaseInvoicesCompaniesType | نوع فواتير عقود الإيجار للشركات | اختيار |
| invoicing | generateWeeklyInvoicesForWeeklyAgreementsIndividuals | إضافة إنشاء الفاتورة الأسبوعية للإيجار الأسبوعي الفردي | منطقي |
| invoicing | generateWeeklyInvoicesForWeeklyAgreementsCompanies | إضافة إنشاء الفاتورة الأسبوعية للإيجار الأسبوعي الشركة | منطقي |
| invoicing | defaultInvoicingRuleForWeeklyInvoicesIndividuals | قاعدة الفوترة الافتراضية للفرد | اختيار |
| invoicing | defaultInvoicingRuleForWeeklyInvoicesCompanies | قاعدة الفوترة الافتراضية للشركات التي تصدر فواتير أسبوعية | اختيار |
| invoicing | enableCustomerWiseSettingForMonthlyInvoicing | تفعيل إعدادات العميل للفواتير الشهرية | منطقي |
| invoicing | receiptOnScreenAllocationWithTypesOfCharges | إيصال على الشاشة تخصيص مع أنواع الرسوم | منطقي |
| invoicing | receiptOnScreenAllocationWithReceivables | تخصيص الإيصالات على الشاشة مع التحصيلات | منطقي |
| invoicing | useRentalInvoicingRuleForWeeklyInvoicesIndividuals | استخدام قاعدة فواتير عقود الإيجار للأفراد | منطقي |
| invoicing | useRentalInvoicingRuleForWeeklyInvoicesCompanies | استخدام قاعدة فواتير عقود الإيجار للشركات | منطقي |
| invoicing | invoicingCutoffDate | تاريخ إغلاق الفاتورة | تاريخ/وقت |
| invoicing | ddaReceiptsPaymentMethods | راجع التسمية في القالب | نص/قيمة بحسب العقد |
| invoicing | makeReceiptDepositOptionalInAdvanceTaxInvoice | جعل عربون الإيصال اختياريًا في فاتورة الضريبة المقدمة | منطقي |
| invoicing | showDescriptionForAtiAllocationInInvoice | عرض الوصف لتوزيع ATI في الفاتورة | منطقي |
| invoicing | addDamageChargesAndInvoiceableCheckboxOnAccidentModule | إضافة رسوم الأضرار وخيار قابل للفوترة في وحدة الحوادث | منطقي |
| invoicing | generateAdvanceTaxInvoiceFromAdvanceTaxReceipt | إنشاء فاتورة ضريبية مقدمة من إيصال الضريبة المقدمة | منطقي |
| invoicing | allowAssetSaleInvoiceCreationDateAsAssetDisposalDate | اعتبار تاريخ إنشاء فاتورة بيع الأصل هو تاريخ التخلص من الأصل | منطقي |
| invoicing | createMultipleBillsOnPurchaseOrder | إنشاء عدة فواتير على أمر الشراء | منطقي |
| invoicing | doNotGenerateInvoiceOnAgreementClosing | عدم إنشاء فاتورة عند إغلاق العقد | منطقي |
| invoicing | generateDailyInvoiceForAnyPeriod | إنشاء فاتورة يومية لأي فترة | منطقي |
| invoicing | agreementReceiptAllocateOnlyWithAgreementInvoices | تخصيص إيصال العقد مع فواتير العقد فقط | منطقي |
| invoicing | autoApproveAllBillsExceptFineBills | اعتماد جميع الفواتير تلقائيًا ما عدا فواتير الغرامات | منطقي |
| invoicing | autoFetchUnitPriceInPoFromLastSupplierPurchaseBasedOnGrn | جلب سعر الوحدة في أمر الشراء تلقائيًا من آخر شراء للمورد بناءً على إشعار الاستلام | منطقي |
| invoicing | purchaseAndSalesHistoryInPurchaseOrder | عرض سجل المشتريات والمبيعات في أمر الشراء | منطقي |
| invoicing | enableFutureInvoicing | تفعيل الفوترة المستقبلية | منطقي |
| invoicing | taxPercentageInBillAndJvImport | نسبة الضريبة في الفاتورة واستيراد قيود اليومية | منطقي |
| invoicing | setBillDateAsCurrentDate | تعيين تاريخ الفاتورة كتاريخ اليوم | منطقي |
| invoicing | manuallyDateChangeInFineBillGeneration | تغيير التاريخ يدويًا عند إنشاء فاتورة الغرامة | منطقي |
| invoicing | selectChargesTypeInMiscInvoice | اختيار نوع الرسوم في الفاتورة المتنوعة | منطقي |
| invoicing | deleteFineBills | حذف فواتير الغرامات | منطقي |
| invoicing | importAndAttachPoInBill | استيراد وإرفاق أمر الشراء في الفاتورة | منطقي |
| invoicing | grnAsFinancialVoucher | اعتبار إشعار استلام البضاعة سندًا ماليًا | منطقي |
| invoicing | branchWiseInvoicing | إصدار الفواتير على مستوى الفروع | منطقي |
| invoicing | allowQuantityAndRateColumnInMiscInvoice | السماح بعمود الكمية والسعر في الفاتورة المتنوعة | منطقي |
| invoicing | generalBillQuantityPriceBasedOnPo | كمية/سعر الفاتورة العامة بناءً على أمر الشراء | منطقي |
| payments | doNotShowUnapprovedPdc | عدم إظهار شيكات مؤجلة غير معتمدة | منطقي |
| payments | allowResubmitOnChequeReceivables | السماح بإعادة التقديم في شيكات العملاء | منطقي |
| payments | showAllTypeOfPaymentsInCashDeposits | إظهار جميع أنواع المدفوعات في الإيداعات النقدية | منطقي |
| payments | allowPartialRefund | السماح باسترداد جزئي | منطقي |
| payments | addPaymentInCreditCardBankTransfer | إضافة دفعة في تحويل بطاقة الائتمان/البنك | منطقي |
| payments | enableCurrentPreviousDatedChequeDirectlyToBank | تمكين تحويل الشيكات المؤرخة الحالية/السابقة مباشرة إلى البنك | منطقي |
| payments | enableCurrentPreviousDatedChequePayableDirectlyToBank | تمكين الشيكات الحالية/السابقة المستحقة مباشرة للبنك | منطقي |
| payments | doNotAllowReceiptCreationWithoutAgreement | لا يُسمح بإنشاء إيصال بدون اتفاقية | منطقي |
| payments | allowReceiptOnScreenAllocationPartially | الإيصالات على الشاشة تخصيصًا جزئيًا | منطقي |
| payments | allowSupplierPaymentOnScreenAllocationPartially | الدفعات على الشاشة تخصيصًا جزئيًا | منطقي |
| payments | allowOverAllocationForCreditNotesReceipts | السماح بتخصيص زائد لإشعارات وأذون الخصم | منطقي |
| payments | showAllocationsInCreditNote | عرض التخصيصات في إشعار الخصم | منطقي |
| payments | agreementStartDateAsAdvanceReceiptAndDepositDate | اعتبار تاريخ بداية العقد كتاريخ استلام وإيداع مقدّم | منطقي |
| payments | doNotAllowDuplicateChequeNumberInReceiptsAndPayments | عدم السماح بتكرار رقم الشيك في الإيصالات والمدفوعات | منطقي |
| payments | showAgreementInReceipt | إظهار رقم/بيانات العقد في الإيصال | منطقي |
| payments | autoSplitChargesForBroker | تقسيم الرسوم تلقائيًا للوسيط | قائمة |
| customers | selectCustomerFromList | اختيار العميل من القائمة | منطقي |
| customers | salesPersonMandatoryInCustomerWhileOpeningRentalAgreement | الموظف مطلوب في العميل أثناء فتح الاتفاقية | منطقي |
| customers | salesPersonSelectionInsteadOfSearching | اختيار مسؤول المبيعات بدلًا من البحث | منطقي |
| customers | takeSignatureOnAgreementOpeningInMobileApp | أخذ التوقيع عند فتح العقد في تطبيق الجوال | منطقي |
| customers | dontAllowToSaveCustomerWithExpiryDocument | عدم السماح بحفظ العميل إذا كانت المستندات منتهية | منطقي |
| customers | customizeRevenueLinkingForContactGroups | تخصيص ربط الإيراد لمجموعات جهات الاتصال | منطقي |
| customers | useCustomerBranchForVouchers | استخدام فرع العميل لفواتير الورق | منطقي |
| customers | showOnlyStaffForUserContact | إظهار الموظفين فقط في جهات اتصال المستخدم | منطقي |
| customers | showAdvancePhoneNumberInputInContacts | إظهار حقل رقم هاتف متقدّم في جهات الاتصال | منطقي |
| customers | allowOnlyNumericNumberInMobilePhoneOnCustomer | السماح بالأرقام فقط في رقم جوال العميل | منطقي |
| customers | allowGeneralBillOnCustomer | السماح بفاتورة عامة على العميل | منطقي |
| customers | showBlackListedCustomerInAgreement | عرض العملاء المحظورين في الاتفاقية | منطقي |
| customers | allowDuplicateCustomerNameWhileCreatingNewCustomer | السماح بتكرار اسم العميل عند إنشاء عميل جديد | منطقي |
| customers | agreementAndCustomerBalanceInRentalAgreement | رصيد العقد والعميل في عقد الإيجار | منطقي |
| customers | salesPersonDesignation | تعيين مسؤول المبيعات | اختيار |
| fleet | mileageUpdateAlertAfterMonths | الاشعارات بعد أشهر | رقمي — يصنف حسب المجال |
| fleet | invoiceDateAsGenerationDate | تاريخ الفاتورة كتاريخ الإصدار | منطقي |
| fleet | invoiceDateAsGenerationDateForAllInvoices | تاريخ الفاتورة كتاريخ الإصدار لجميع الفواتير | منطقي |
| fleet | dontCheckDepreciationAndAmortizationInFiscalMonthClosing | لا يُتحقق من التكاليف والتكاليف في نهاية الشهر | منطقي |
| fleet | tariffCardExplicitSelectionInBookingAgreement | اختيار البطاقة التسعيرية في الاتفاقية | منطقي |
| fleet | createNewBookingAlwaysAsConfirmed | إنشاء حجز جديد دائمًا كمؤكد | منطقي |
| fleet | assetDisposalPostingOption | راجع التسمية في القالب | نص/قيمة بحسب العقد |
| fleet | estimateOrSetAssetSalePrice | تقدير أو تحديد سعر بيع الأصول | منطقي |
| fleet | decliningDepreciationOnAssetLifeBookValue | تقليل التكاليف على قيمة حساب الأصول | منطقي |
| fleet | profitMarginPercentageOnAssetCostPrice | الربح المئوي على سعر حساب الأصول | رقمي — يصنف حسب المجال |
| fleet | dueForSaleKMsThreshold | الحد الادنى للمسافة | رقمي — يصنف حسب المجال |
| fleet | dueForSalePeriodYears | الحد الادنى للمسافة | رقمي — يصنف حسب المجال |
| fleet | includeBuyBack | تضمين إعادة الشراء | منطقي |
| fleet | enableTotalLossInAssets | تمكين حالة الخسارة الكلية للأصول | منطقي |
| fleet | claimChargesInTotalLoss | احتساب الرسوم ضمن حالة الخسارة الكلية | منطقي |
| fleet | vehicleRegistrationExpiryAndServiceDuePopupOnAgreementMovementsSaving | إظهار رسالة عند حفظ العقد/الحركة عند قرب انتهاء تسجيل المركبة أو موعد الصيانة | منطقي |
| fleet | depreciationTillOfSaleDateInsteadOfDisposalDate | احتساب الإهلاك حتى تاريخ البيع بدلًا من تاريخ التخلص من الأصل | منطقي |
| fleet | doNotRentMultipleVehiclesOnSameDriverCheck | عدم تأجير عدة مركبات على نفس السائق | منطقي |
| fleet | alertsForExternalVehicle | تنبيهات للمركبات الخارجية | منطقي |
| fleet | alertsForMortgageVehicle | تنبيهات للمركبات المرهونة | منطقي |
| fleet | doNotIncludeReplacementVehicles | عدم تضمين مركبات الاستبدال | منطقي |
| fleet | vehicleSearchByChassisNoBesidesPlateNo | البحث عن المركبة برقم الشاسيه بالإضافة إلى رقم اللوحة | منطقي |
| fleet | doNotAllowAssetCreationIfVehicleDoesNotExist | عدم السماح بإنشاء أصل إذا كانت المركبة غير موجودة | منطقي |
| fleet | calculateAmortizationForLastPeriodInsteadOfPassingPendingAmount | احتساب الإهلاك للفترة الأخيرة بدلًا من تمرير الرصيد المعلّق | منطقي |
| fleet | separateMakeAndModelInFleet | فصل الماركة والموديل في الأسطول | منطقي |
| fleet | replacementOfMakeAndModelInGridForVehicles | استبدال الماركة والموديل في شبكة المركبات | منطقي |
| fleet | showExpiryDetailsForWarrantyOfVehicles | إظهار تفاصيل انتهاء ضمان المركبات | منطقي |
| fleet | allowMovementsForSaleVehicle | السماح بالحركات للمركبة المعروضة للبيع | منطقي |
| fleet | vehicleProfitLossExcludedAccounts | حسابات الخسائر والربح للمركبة | قائمة |
| workshop | serviceAlertsPriorKms | الاشعارات قبل الكيلومترات | نص/قيمة بحسب العقد |
| workshop | serviceAlertsPriorDays | الاشعارات قبل الأيام | نص/قيمة بحسب العقد |
| workshop | linkCrsVehicleWithWorkshopVehicleOnChassisNo | ربط مركبة نظام CRS بمركبة الورشة باستخدام رقم الشاسيه | منطقي |
| workshop | autoIssueOfItemsInJcFromGrn | إصدار الأصناف في أمر العمل تلقائيًا من إشعار الاستلام | منطقي |
| workshop | poMandatoryForWorkshopMovement | أمر الشراء إلزامي لحركة الورشة | منطقي |
| workshop | notesMandatoryForWorkshopMovement | الملاحظات إلزامية لحركة الورشة | منطقي |
| workshop | allowWorkshopMovementForExternalVehicleInCrs | السماح بحركة الورشة للمركبة الخارجية في النظام | منطقي |
| workshop | dontAllowWorkshopMovementWhenAlreadyVehicleStatusIsWorkshop | عدم السماح بحركة الورشة إذا كانت حالة المركبة بالفعل ورشة | منطقي |
| workshop | doNotGenerateJobClosingInvoiceForInternalCustomer | عدم إنشاء فاتورة إقفال مهمة للعميل الداخلي | منطقي |
| workshop | showAllWorkshopMovementsInServiceLog | إظهار جميع حركات الورشة في سجل الخدمة | منطقي |
| reports | detailedUtilizationReportTime | وقت اليوم لإنشاء تقرير الاستغلال التفصيلي | نص/قيمة بحسب العقد |
| reports | makeCreditCardInfoRequiredInReceipt | جعل معلومات بطاقة الائتمان مطلوبة في إيصال | منطقي |
| reports | getCloseAgreementsForDriverTimeSheet | الإتفاقيات المغلقة لجدول زمني السائق | منطقي |
| reports | hideSpecificColumnsInTripReportGlobalWings | إخفاء أعمدة محددة في تقرير الرحلات (Global Wings) | منطقي |
| reports | allowPrintingOfVoidedVouchers | السماح بطباعة السندات الملغاة | منطقي |
| reports | estimatedRevenueReportsGenerateBasedOnActualClosingCharges | تقارير الإيراد التقديرية (تُولد بناءً على رسوم الإغلاق الفعلية) | منطقي |
| reports | includeFuelChargesInRevenueAnalysisReport | تضمين رسوم الوقود في تقرير تحليل الإيرادات | منطقي |
| reports | showBookedVehiclesInDashboard | عرض المركبات المحجوزة في لوحة المتابعة | منطقي |
| reports | showLimoVehiclesInDashboard | عرض مركبات الليموزين في لوحة المتابعة | منطقي |
| reports | showReplacementTodayVehiclesInDashboard | عرض مركبات الاستبدال الخاصة باليوم في لوحة المتابعة | منطقي |
| reports | showLimitedFieldsForAgreementViewInAgreementDashboard | عرض حقول محدودة لعرض العقد في لوحة العقود | منطقي |
| reports | enableVoucherPrintingAfterApproval | تفعيل طباعة السند بعد الاعتماد | منطقي |
| reports | showAllDueVouchersStatementOfAccounts | عرض جميع السندات المستحقة في كشف الحساب | منطقي |
| reports | showAllocationsInStatementOfAccount | عرض التخصيصات في كشف الحساب | منطقي |
| reports | showLastJobDetailOnJobPrint | عرض آخر تفاصيل العمل في طباعة المهمة | منطقي |
| reports | dontAllowPrintForUnApprovedJobEstimation | عدم السماح بالطباعة لتقديرات الأعمال غير المعتمدة | منطقي |
| reports | showLogoInAppReportPrint | عرض الشعار في طباعة تقارير التطبيق | منطقي |
| reports | allowGatePassPrintWithoutReceipt | السماح بطباعة تصريح البوابة بدون إيصال | منطقي |
| reports | getSoaOfCurrentBranchCustomersOnly | إظهار كشف الحساب لعملاء الفرع الحالي فقط | منطقي |
| reports | showBookingReferenceNoInStatementOfAccountAndReceiptAllocation | إظهار رقم مرجع الحجز في كشف الحساب وتخصيص الإيصالات | منطقي |
| reports | showVoucherDetailedDescriptionInSoa | إظهار وصف السند التفصيلي في كشف الحساب | منطقي |
| reports | showVoucherDescriptionInSupplierOutstandingSoa | إظهار وصف السند في كشف حساب الموردين غير المسدّد | منطقي |
| reports | showPlateNoForWorkshopInvoiceInSoa | إظهار رقم اللوحة في فاتورة الورشة داخل كشف الحساب | منطقي |
| reports | showDescriptionForLimousineInvoiceInSoa | إظهار الوصف في فاتورة الليموزين داخل كشف الحساب | منطقي |
| reports | showFirstVehicleInBillSoa | إظهار أول مركبة في كشف حساب الفاتورة | منطقي |
| reports | allowPdcPrintingBeforeClearance | السماح بطباعة شيكات مؤجلة قبل التحصيل | منطقي |
| reports | showFineInvoiceDetailInCustomerSoa | إظهار تفاصيل فاتورة الغرامات في كشف حساب العميل | منطقي |
| reports | doNotShowAgreementNoInSOAEmail | إخفاء رقم الاتفاقية في بريد الإلكتروني | منطقي |
| booking | webBookingApiKey | مفتاح واجهة برمجة تطبيقات الحجز عبر الويب | نص/قيمة بحسب العقد |
| booking | rateCardForWebBookingPlugin | قائمة نوع الرسوم | اختيار |
| booking | showGroupWithAvailableVehicle | عرض المجموعات مع المركبات المتاحة | منطقي |
| booking | googleApiKey | مفتاح API Google | نص/قيمة بحسب العقد |
| booking | rentalQuotationsValidityDays | مدة صلاحية عروض الإيجار | رقمي — يصنف حسب المجال |
| booking | vehicleTypeOptionalInBooking | جعل نوع المركبة اختياريًا عند الحجز | منطقي |
| booking | setVehicleOptionalInBookingConfirmation | جعل اختيار المركبة اختياريًا عند تأكيد الحجز | منطقي |
| booking | allowDepositInBookingWithoutReceivingAmount | السماح بإضافة عربون في الحجز دون استلام المبلغ | منطقي |
| booking | generateAdvanceAsAtrAndGenerateAtiBookingAgreement | إنشاء الدفعة المقدمة كـ ATR وإنشاء ATI عند عقد الحجز | منطقي |
| booking | enableManualBookingNoField | تفعيل حقل رقم الحجز اليدوي | منطقي |
| booking | manuallyConfirmBooking | تأكيد الحجز يدويًا | منطقي |
| booking | quotationIsMandatoryForAllIndividualCustomersForWeeklyAndMonthly | العرض السعري إلزامي لجميع العملاء الأفراد للعقود الأسبوعية والشهرية | منطقي |
| booking | onBookingConfirmationVehicleSubstatusToBeChangedToPendingCustomerDelivery | عند تأكيد الحجز يتم تغيير حالة المركبة إلى في انتظار تسليم العميل | منطقي |
| fuel | fuelSurchargeInvoiceClubWithFuelInvoice | تجميع فاتورة رسوم الوقود الإضافية مع فاتورة الوقود | منطقي |
| fuel | fuelAverageUsingPettyCashPayment | متوسط تكلفة الوقود باستخدام دفعات صندوق النثرية | منطقي |
| fuel | percentageFuelSurchargeInvoice | فاتورة نسبة رسوم الوقود الإضافية | رقمي — يصنف حسب المجال |
| fuel | currentFuelPrice | سعر الوقود الحالي | رقمي — يصنف حسب المجال |
| fuel | invoiceFuelChargesOnReplacement | فوتر رسوم الوقود على سيارة الاستبدال | منطقي |
| fuel | showFuelPercentageInsteadOfFraction | إظهار نسبة الوقود بدلًا من الكسر | منطقي |
| fuel | considerExtraFuelInWhileFuelChargesCalculation | أخذ الوقود الإضافي في الاعتبار عند احتساب رسوم الوقود | منطقي |

## صفحة الملف الشخصي

المسار:

`/Settings/profile`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/profile/profile.component.html>).

## صفحة رقم المستند

المسار:

`/Settings/documentNumber`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/document-number/document-number.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| agreements | agreementNoIsManual | ؟رقم العقد يُدخل يدويًا | منطقي |
| agreements | agreementNoIncludeSaleOriginCode | إضافة رمز المبيعات في رقم العقد | منطقي |
| agreements | agreementNoIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| agreements | agreementNoIncludeBranchCode2 | إضافة رمز الفرع الثاني في رقم العقد | منطقي |
| agreements | agreementNoIncludeAgreementTypeCode | إضافة رمز نوع العقد في رقم العقد | منطقي |
| agreements | agreementNoIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| agreements | agreementNoNumericPartLength | طول الجزء الرقمي في رقم العقد | رقمي — يصنف حسب المجال |
| agreements | agreementNoExcludeBranchPrefixForLease | إزالة رمز الفرع في رقم العقد | منطقي |
| agreements | agreementTypeHourlyCode | كود الساعة | نص/قيمة بحسب العقد |
| agreements | agreementTypeDailyCode | كود اليومي | نص/قيمة بحسب العقد |
| agreements | agreementTypeWeeklyCode | كود الأسبوعي | نص/قيمة بحسب العقد |
| agreements | agreementTypeMonthlyCode | كود الشهري | نص/قيمة بحسب العقد |
| agreements | agreementTypeLeaseCode | كود الإيجار | نص/قيمة بحسب العقد |
| agreements | salesAgreementIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| agreements | salesAgreementIncludeBranchCode2 | إضافة رمز الفرع الثاني في رقم العقد | منطقي |
| agreements | salesAgreementIncludeYear | السنة (YY) | منطقي |
| agreements | salesAgreementIncludeMonth | الشهر (MM) | منطقي |
| agreements | salesAgreementCodePrefix | رقم الاتفاقية | نص/قيمة بحسب العقد |
| agreements | salesAgreementNumericPartLength | طول الجزء الرقمي في رقم الاتفاقية | رقمي — يصنف حسب المجال |
| agreements | equipmentRentalMasterAgreementPrefix | رمز الاتفاقية | نص/قيمة بحسب العقد |
| agreements | equipmentRentalMasterAgreementNumericPartLength | طول الجزء الرقمي في رقم الاتفاقية | رقمي — يصنف حسب المجال |
| agreements | equipmentRentalMasterAgreementUseYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| agreements | leaseMasterAgreementPrefix | رمز الاتفاقية | نص/قيمة بحسب العقد |
| agreements | leaseMasterAgreementNumericPartLength | طول الجزء الرقمي في رقم الاتفاقية | رقمي — يصنف حسب المجال |
| agreements | leaseMasterAgreementIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| agreements | rentalMasterAgreementPrefix | رمز الاتفاقية | نص/قيمة بحسب العقد |
| agreements | rentalMasterAgreementNumericPartLength | طول الجزء الرقمي في رقم الاتفاقية | رقمي — يصنف حسب المجال |
| agreements | rentalMasterAgreementIncludeYear | السنة (YY) | منطقي |
| agreements | rentalMasterAgreementIncludeMonth | الشهر (MM) | منطقي |
| agreements | deliveryNoPrefix | رمز الشحن | نص/قيمة بحسب العقد |
| agreements | deliveryNoNumericPartLength | طول الجزء الرقمي في رقم الشحن | رقمي — يصنف حسب المجال |
| agreements | deliveryNoIncludeMasterAgreementNo | إضافة رقم الاتفاقية في رقم الشحن | منطقي |
| quotations | salesQuotationIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| quotations | salesQuotationIncludeBranchCode2 | إضافة رمز الفرع الثاني في رقم العقد | منطقي |
| quotations | salesQuotationIncludeYear | السنة (YY) | منطقي |
| quotations | salesQuotationIncludeMonth | الشهر (MM) | منطقي |
| quotations | salesQuotationCodePrefix | رمز العرض | نص/قيمة بحسب العقد |
| quotations | salesQuotationNumericPartLength | طول الجزء الرقمي في رقم العرض | رقمي — يصنف حسب المجال |
| quotations | rentalQuotationIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| quotations | rentalQuotationIncludeYear | السنة (YY) | منطقي |
| quotations | rentalQuotationIncludeMonth | الشهر (MM) | منطقي |
| quotations | rentalQuotationCodePrefix | رمز العرض | نص/قيمة بحسب العقد |
| quotations | rentalQuotationNumericPartLength | طول الجزء الرقمي في رمز العرض | رقمي — يصنف حسب المجال |
| quotations | equipmentRentalQuotationIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| quotations | equipmentRentalQuotationIncludeBranchCode2 | إضافة رمز الفرع الثاني في رقم العقد | منطقي |
| quotations | equipmentRentalQuotationIncludeYear | السنة (YY) | منطقي |
| quotations | equipmentRentalQuotationIncludeMonth | الشهر (MM) | منطقي |
| quotations | equipmentRentalQuotationCodePrefix | رمز عرض أسعار تأجير المعدات | نص/قيمة بحسب العقد |
| quotations | equipmentRentalQuotationNumericPartLength | طول الجزء الرقمي في رمز عرض أسعار تأجير المعدات | رقمي — يصنف حسب المجال |
| quotations | leaseQuotationIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| quotations | leaseQuotationIncludeBranchCode2 | إضافة رمز الفرع الثاني في رقم العقد | منطقي |
| quotations | leaseQuotationIncludeYear | السنة (YY) | منطقي |
| quotations | leaseQuotationIncludeMonth | الشهر (MM) | منطقي |
| quotations | leaseQuotationCodePrefix | رمز العرض | نص/قيمة بحسب العقد |
| quotations | leaseQuotationNumericPartLength | طول الجزء الرقمي في رقم العرض | رقمي — يصنف حسب المجال |
| quotations | leaseInquiryCodePrefix | بادئة الكود | نص/قيمة بحسب العقد |
| quotations | leaseInquiryNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| quotations | limoQuotationIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| quotations | limoQuotationCodePrefix | بادئة الكود | نص/قيمة بحسب العقد |
| quotations | limoQuotationNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| bookings | bookingNoIncludeSaleOriginCode | إضافة رمز المبيعات في رقم العقد | منطقي |
| bookings | bookingNoIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| bookings | bookingNoIncludeBookingTypeCode | تضمين رمز نوع الحجز | منطقي |
| bookings | bookingNoIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| bookings | bookingNoNumericPartLength | طول الجزء الرقمي في رقم الحجز | رقمي — يصنف حسب المجال |
| bookings | bookingTypeDailyCode | كود اليومي | نص/قيمة بحسب العقد |
| bookings | bookingTypeWeeklyCode | كود الأسبوعي | نص/قيمة بحسب العقد |
| bookings | bookingTypeMonthlyCode | كود الشهري | نص/قيمة بحسب العقد |
| invoices | invoiceNoIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| invoices | invoiceNoIncludeInvoiceTypeCode | إضافة رمز نوع الفاتورة في رقم الفاتورة | منطقي |
| invoices | invoiceNoIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| invoices | invoiceNoNumericPartLength | طول الجزء الرقمي في رقم الفاتورة | رقمي — يصنف حسب المجال |
| invoices | code | راجع التسمية في القالب | نص/قيمة بحسب العقد |
| invoices | creditNoteNoIsManual | رقم ملاحظة الائتمان | منطقي |
| invoices | creditNoteNoIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| invoices | creditNoteNoIncludeBranchCode2 | إضافة رمز الفرع الثاني في رقم العقد | منطقي |
| invoices | creditNoteNoIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| invoices | creditNoteNoVoucherTypePrefix | رمز ملاحظة الائتمان | نص/قيمة بحسب العقد |
| invoices | creditNoteNoNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| invoices | debitNoteNoIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| invoices | debitNoteNoIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| invoices | debitNoteNoVoucherTypePrefix | رمز ملاحظة الائتمان | نص/قيمة بحسب العقد |
| invoices | debitNoteNoNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| cheques | matureChequePayableNoIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| cheques | matureChequePayableNoVoucherTypePrefix | بادئة نوع القسيمة | نص/قيمة بحسب العقد |
| cheques | matureChequePayableNoNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| cheques | cancelChequePayableNoIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| cheques | cancelChequePayableNoVoucherTypePrefix | بادئة نوع القسيمة | نص/قيمة بحسب العقد |
| cheques | cancelChequePayableNoNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| cheques | matureChequeReceivableNoIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| cheques | matureChequeReceivableNoVoucherTypePrefix | بادئة نوع القسيمة لرقم الشيك المستحق عند الاستحقاق | نص/قيمة بحسب العقد |
| cheques | matureChequeReceivableNoNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| cheques | returnChequeReceivableNoIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| cheques | returnChequeReceivableNoVoucherTypePrefix | بادئة نوع القسيمة لرقم الشيك المرتجع | نص/قيمة بحسب العقد |
| cheques | returnChequeReceivableNoNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| cheques | cardTransactionsBankTransferNoIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| cheques | cardTransactionsBankTransferNoVoucherTypePrefix | بادئة نوع القسيمة | نص/قيمة بحسب العقد |
| cheques | cardTransactionsBankTransferNoNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| vouchers | receiptNoIsManual | رقم الإيصال يدوي؟ | منطقي |
| vouchers | receiptNoIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| vouchers | receiptNoIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| vouchers | receiptNoVoucherTypePrefix | رمز الإيصال | نص/قيمة بحسب العقد |
| vouchers | receiptNoNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| vouchers | billNoIsManual | رقم الفاتورة يدوي؟ | منطقي |
| vouchers | billNoIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| vouchers | billNoIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| vouchers | billNoVoucherTypePrefix | رمز الفاتورة | نص/قيمة بحسب العقد |
| vouchers | billNoNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| vouchers | purchaseOrderNoIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| vouchers | purchaseOrderNoIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| vouchers | purchaseOrderNoVoucherTypePrefix | رمز طلب الشراء | نص/قيمة بحسب العقد |
| vouchers | purchaseOrderNoNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| vouchers | purchaseRequestNoIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| vouchers | purchaseRequestNoIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| vouchers | purchaseRequestNoVoucherTypePrefix | رمز طلب الشراء | نص/قيمة بحسب العقد |
| vouchers | purchaseRequestNoNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| vouchers | provisionNoIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| vouchers | provisionNoIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| vouchers | provisionNoVoucherTypePrefix | رمز طلب الشراء | نص/قيمة بحسب العقد |
| vouchers | provisionNoNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| vouchers | paymentNoIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| vouchers | paymentNoIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| vouchers | paymentNoIncludeTypeCode | إضافة رمز نوع الدفع في رقم الدفع | منطقي |
| vouchers | paymentNoIncludeMethodCode | رمز طريقة الدفع غير المضمن | منطقي |
| vouchers | paymentNoNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| vouchers | paymentTypeCustomerCode | عميل | نص/قيمة بحسب العقد |
| vouchers | paymentTypeSupplierCode | مورد | نص/قيمة بحسب العقد |
| vouchers | paymentTypeStaffCode | موظف | نص/قيمة بحسب العقد |
| vouchers | paymentTypePettyCashExpenseCode | مصروفات العهدة | نص/قيمة بحسب العقد |
| vouchers | paymentTypeDepositRefundCode | استرداد التأمين | نص/قيمة بحسب العقد |
| vouchers | paymentTypeGeneralCode | عام | نص/قيمة بحسب العقد |
| vouchers | jvNoIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| vouchers | jvNoIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| vouchers | jvNoVoucherTypePrefix | رمز JV | نص/قيمة بحسب العقد |
| vouchers | jvNoNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| vouchers | amortizationNoVoucherTypePrefix | رمز الاستهلاك | نص/قيمة بحسب العقد |
| vouchers | amortizationNoNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| vouchers | customerDepositNoIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| vouchers | customerDepositNoIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| vouchers | customerDepositNoVoucherTypePrefix | رمز ايداع العميل | نص/قيمة بحسب العقد |
| vouchers | customerDepositNoNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| vouchers | depreciationNoVoucherTypePrefix | Voucher Type Prefix | نص/قيمة بحسب العقد |
| vouchers | depreciationNoNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| vouchers | depositUsedPrefix | بادئة الكود | نص/قيمة بحسب العقد |
| vouchers | depositUsedNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| workshop | jobsIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| workshop | jobsPrefix | بادئة الكود | نص/قيمة بحسب العقد |
| workshop | jobsNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| workshop | jobEstimationsIncludeYearMonth | إضافة السنة والشهر في رقم العقد | منطقي |
| workshop | jobEstimationsPrefix | بادئة الكود | نص/قيمة بحسب العقد |
| workshop | jobEstimationsNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| catalogs | chartOfAccountsSubAccountLength | عدد خانات الحساب الفرعي | رقمي — يصنف حسب المجال |
| catalogs | customersIncludeBranchCode | إضافة رمز الفرع في رقم العقد | منطقي |
| catalogs | customersIncludeBranchCode2 | إضافة رمز الفرع الثاني في رقم العقد | منطقي |
| catalogs | customersIndividualCodePrefix | بادئة كود الفرد | نص/قيمة بحسب العقد |
| catalogs | customersCompanyCodePrefix | بادئة كود الشركة | نص/قيمة بحسب العقد |
| catalogs | customersNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| catalogs | suppliersIsManual | ؟رقم العقد يُدخل يدويًا | منطقي |
| catalogs | suppliersCodePrefix | بادئة الكود | نص/قيمة بحسب العقد |
| catalogs | suppliersNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| catalogs | staffIsManual | ؟رقم العقد يُدخل يدويًا | منطقي |
| catalogs | staffCodePrefix | بادئة الكود | نص/قيمة بحسب العقد |
| catalogs | staffNumericPartLength | طول الجزء الرقمي | رقمي — يصنف حسب المجال |
| catalogs | itemIsManual | إدخال يدوي؟ | منطقي |

## صفحة إدارة المستخدم

المسار:

`/Settings/userManagement`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/user-management/user-management.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | allowUserRegistration | السماح للمستخدمين بالتسجيل في النظام. | منطقي |
| الصفحة | newUsersActiveByDefault | المستخدمون المسجلون حديثًا يكونون نشطين افتراضيًا. | منطقي |
| الصفحة | useSecurityImageQuestion | استخدام سؤال صورة أمان (كابتشا) عند التسجيل. | منطقي |
| الصفحة | emailConfirmationRequiredForLogin | يتطلب تأكيد البريد الإلكتروني قبل تسجيل الدخول. | منطقي |

## صفحة E-Salik

المسار:

`/Settings/eSalik`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/e-salik/e-salik.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | surchargeType | نوع التكاليف | اختيار |
| الصفحة | surchargeValue | قيمة التكاليف | رقمي — يصنف حسب المجال |
| الصفحة | invoice | نوع الفاتورة | اختيار |
| الصفحة | cutOffDate | تاريخ إغلاق الفاتورة | تاريخ/وقت |
| الصفحة | enableCompanyCodeInSalikAccount | تفعيل كود الشركة في حساب سالك | منطقي |
| الصفحة | dontCreateReceivableOnWorkshop | عدم إنشاء ذمم مدينة على الورشة | منطقي |
| الصفحة | dateAsPostingDate | التاريخ كتاريخ الترحيل | منطقي |
| الصفحة | makeAllPostingGroupsOptional | جعل جميع مجموعات الترحيل اختيارية | منطقي |
| الصفحة | downloadSingleAccountAtATime | تحميل/تسوية الرسوم لحساب واحد في كل مرة | منطقي |
| الصفحة | processSalikTollsInSpeedDataSharing | معالجة رسوم سالك في مكون مشاركة البيانات السريع | منطقي |
| الصفحة | downloadUnchargedSalikTolls | تحميل رسوم سالك غير المحملة | منطقي |
| الصفحة | autoProcessAfterDownloading | المعالجة التلقائية بعد التحميل | منطقي |
| الصفحة | authority | الجهة | اختيار |
| الصفحة | userName | اسم المستخدم | نص/قيمة بحسب العقد |
| الصفحة | password | كلمة المرور | نص/قيمة بحسب العقد |
| الصفحة | lastDownloadDate | تاريخ آخر تحميل | تاريخ/وقت |
| الصفحة | parkingLastDownloadDate | تاريخ آخر تحميل لل موقف | تاريخ/وقت |
| الصفحة | isRTA | RTA | منطقي |
| الصفحة | active | نشط | منطقي |

## صفحة E-Darb

المسار:

`/Settings/eDarb`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/e-darb/e-darb.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | surcharge | قيمة التكاليف | رقمي — يصنف حسب المجال |
| الصفحة | invoice | نوع الفاتورة | اختيار |
| الصفحة | cutOffDate | تاريخ إغلاق الفاتورة | تاريخ/وقت |
| الصفحة | dontCreateReceivableOnWorkshop | عدم إنشاء ذمم مدينة على الورشة | منطقي |
| الصفحة | dateAsPostingDate | التاريخ كتاريخ الترحيل | منطقي |
| الصفحة | makeAllPostingGroupsOptional | جعل جميع مجموعات الترحيل اختيارية | منطقي |
| الصفحة | enableVehicleMappedApplicableDate | مشاركة التعيينات: تفعيل تاريخ التطبيق عند ربط المركبة | منطقي |
| الصفحة | processDarbTollsInSpeedDataSharing | معالجة رسوم درب ضمن مكون مشاركة البيانات السريعة | منطقي |
| الصفحة | autoProcessAfterDownloading | المعالجة التلقائية بعد التحميل | منطقي |
| الصفحة | enableCompanyCodeInDarbAccount | تفعيل كود الشركة في حساب دارب | منطقي |
| الصفحة | authority | الجهة | اختيار |
| الصفحة | userName | اسم المستخدم | نص/قيمة بحسب العقد |
| الصفحة | password | كلمة المرور | نص/قيمة بحسب العقد |
| الصفحة | lastDownloadDate | تاريخ آخر تحميل | تاريخ/وقت |
| الصفحة | active | نشط | منطقي |

## صفحة DDA

المسار:

`/Settings/directDebitAuthorizationSetting`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/dda/dda.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | ddaNo | راجع التسمية في القالب | نص/قيمة بحسب العقد |
| الصفحة | ddaNoRequired | راجع التسمية في القالب | منطقي |
| الصفحة | credit | راجع التسمية في القالب | نص/قيمة بحسب العقد |
| الصفحة | creditRequired | راجع التسمية في القالب | منطقي |
| الصفحة | date | راجع التسمية في القالب | نص/قيمة بحسب العقد |
| الصفحة | date | راجع التسمية في القالب | منطقي |
| الصفحة | description | راجع التسمية في القالب | نص/قيمة بحسب العقد |
| الصفحة | descriptionRequired | راجع التسمية في القالب | منطقي |

## صفحة الليموزين

المسار:

`/Settings/limousineSettings`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/limousine/limousine.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | userDefinedLocations | مواقع معرفة من قبل المستخدم | منطقي |
| الصفحة | restrictLocationsToTariffLocations | تقييد المواقع بمواقع التعريفة | منطقي |
| الصفحة | customerSignatureOnFinish | توقيع العميل عند إنهاء الرحلة | منطقي |
| الصفحة | cancelTripInvoicingCorporateCustomers | إلغاء فوترة الرحلات لعملاء الشركات | منطقي |
| الصفحة | makeDropOffLocationOptionalIf | جعل موقع النزول اختيارياً | منطقي |
| الصفحة | limoDiscount | خصم الليموزين | منطقي |
| الصفحة | limoCustomField1 | حقل مخصص لليموزين 1 | منطقي |
| الصفحة | selectOnlyAvailableVehicleInLimoTrip | اختيار المركبات المتاحة فقط في رحلة الليموزين | منطقي |
| الصفحة | createMultipleTripsFromLimoQuotation | إنشاء عدة رحلات من عرض سعر الليموزين | منطقي |
| الصفحة | assigningStepForLimoTripBeforeDispatching | خطوة التعيين لرحلة الليموزين قبل الإرسال | منطقي |
| الصفحة | bypassTimeOverlappingValidationDuringDispatching | تجاوز التحقق من تداخل الأوقات أثناء الإرسال | منطقي |
| الصفحة | showOpenStaffCarNRMVehicleInTrips | عرض مركبات الموظفين/السيارات المفتوحة في الرحلات | منطقي |
| الصفحة | separateDateAndTimeIncludingTentativeProvision | فصل التاريخ والوقت مع تضمين الحالة المبدئية | منطقي |
| الصفحة | stopAutoInvoicingForIndividualCustomer | إيقاف الفوترة التلقائية للعملاء الأفراد | منطقي |
| الصفحة | customerExperienceInTripReport | تجربة العميل في تقرير الرحلة | منطقي |

## صفحة الإشعارات

المسار:

`/Settings/notificationsSettingsModel`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/notifications/notifications.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | emailOnAgreementOpening | إرسال بريد إلكتروني عند فتح العقد | منطقي |
| الصفحة | emailOnAgreementClosing | إرسال بريد إلكتروني عند إغلاق العقد | منطقي |
| الصفحة | emailCheckCard | بريد إلكتروني لفحص البطاقة | منطقي |
| الصفحة | emailAlerts | تنبيهات البريد الإلكتروني | منطقي |
| الصفحة | whatsAppUtilityTemplates | قوالب واتساب الخدمية | منطقي |
| الصفحة | emailNotification | راجع التسمية في القالب | منطقي |
| الصفحة | sendToCustomer | راجع التسمية في القالب | منطقي |
| الصفحة | sendToAdmin | راجع التسمية في القالب | منطقي |

## صفحة بوابة الدفع

المسار:

`/Settings/paymentGatewaySetting`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/payment-gateway-setting/payment-gateway-setting.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | bookingPluginPaymentMethod | طريقة الدفع لإضافة الحجز | اختيار |
| الصفحة | publicKey | المفتاح العام | نص/قيمة بحسب العقد |
| الصفحة | secretKey | المفتاح السري | نص/قيمة بحسب العقد |
| الصفحة | paymentLink | رابط الدفع | نص/قيمة بحسب العقد |

## صفحة الاعتمادات

المسار:

`/Settings/approvalLevel`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/approvals/approvals.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | voucherType | نوع القيد | اختيار |
| الصفحة | levelName | اسم المستوى | نص/قيمة بحسب العقد |
| الصفحة | user | المستخدم | نص/قيمة بحسب العقد |

## صفحة الورشة

المسار:

`/Settings/workshopSetting`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/workshop/workshop.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | selectedJobTypes | تنسيق التاريخ | نص/قيمة بحسب العقد |
| الصفحة | insteadOfItemsSelectionAllowAnyItemName | السماح بأي اسم صنف بدلاً من اختيار الأصناف | منطقي |
| الصفحة | externalWorkshopChargesInJC | رسوم الورشة الخارجية في بطاقة العمل | منطقي |
| الصفحة | allowClosedJobsInBillings | السماح بالمهام المغلقة في الفوترة | منطقي |
| الصفحة | generateJobInvoiceInRoundedDecimal | إنشاء فاتورة المهمة مع تقريب القيم العشرية | منطقي |
| الصفحة | allowEditJobType | السماح بتعديل نوع المهمة | منطقي |
| الصفحة | forwardVehicleDetailsFromStockIRToPR | تمرير تفاصيل المركبة من مستند المخزون IR إلى PR | منطقي |

## صفحة المخالفات

المسار:

`/Settings/finesSettings`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/fines/fines.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | fileID | معرف الملف | نص/قيمة بحسب العقد |
| الصفحة | state | الحالة | نص/قيمة بحسب العقد |

## صفحة إعدادات الرسوم

المسار:

`/Settings/chargeSettings`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/charges/charges.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | moduleType | نوع الوحدة | اختيار |
| الصفحة | chargeType | راجع التسمية في القالب | اختيار |
| الصفحة | rateType | راجع التسمية في القالب | اختيار |
| الصفحة | onlyForClosing | للإغلاق فقط | منطقي |
| الصفحة | mandatory | إلزامي | منطقي |
| الصفحة | taxable | خاضع للضريبة | منطقي |
| الصفحة | isActive | نشط | منطقي |

## صفحة وسيط

المسار:

`/Settings/brokerSetting`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/broker/broker.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | brokerContactGroup | مجموعة جهات اتصال الوسيط | اختيار |
| الصفحة | showDriverNameAndDetailInsteadOfCustomer | عرض اسم السائق وتفاصيله بدلاً من العميل | منطقي |
| الصفحة | hideRatesIfCustomerIsBroker | إخفاء الأسعار إذا كان العميل وسيطاً | منطقي |

## صفحة تنسيق رقم الهوية الوطنية

المسار:

`/Settings/nationIDFormat`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/nation-id-format/nation-idformat.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | country | راجع التسمية في القالب | نص/قيمة بحسب العقد |
| الصفحة | format | راجع التسمية في القالب | نص/قيمة بحسب العقد |

## صفحة الموارد البشرية

المسار:

`/Settings/hrmSetting`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/hrm/hrm.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | isPreviousMonthOvertimeForPayrollProcess | إدراج العمل الإضافي للشهر السابق في عملية الرواتب | منطقي |
| الصفحة | isPreviousMonthSalesCommissionForPayrollProcess | إدراج عمولات المبيعات للشهر السابق في عملية الرواتب | منطقي |
| الصفحة | isBusinessUnitsWisePayrollProcess | معالجة الرواتب حسب وحدات الأعمال | منطقي |

## صفحة API مفتاح 

المسار:

`/Settings/apiKeySetting`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/api-key/api-key.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | googleMapApiKey | مفتاح واجهة برمجة تطبيقات خرائط جوجل | نص/قيمة بحسب العقد |

## صفحة مستندات العقود

المسار:

`/Settings/agreementDocument`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/agreement-document/agreement-document.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | name | راجع التسمية في القالب | نص/قيمة بحسب العقد |
| الصفحة | isRequired | راجع التسمية في القالب | منطقي |
| الصفحة | printWithInvoice | راجع التسمية في القالب | منطقي |

## صفحة النماذج والحقول

المسار:

`/Settings/formsAndFields`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/forms-and-fields/forms-and-fields.component.html>).

تتولد قائمتا الحقول الإلزامية والإضافية من نوع النموذج المختار؛ القيم والمستندات ديناميكية، ولا ينشئ هذا الجرد قائمة ثابتة بديلة عنها.

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | form | راجع التسمية في القالب | اختيار |

## صفحة الحقول

المسار:

`/Settings/fields`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/fields/fields.component.html>).

تتولد الحقول من قوائم الكيانات الموجودة في رد الإعدادات؛ يبين القسم التالي خصائص عقودها.

### مجموعة إعدادات العملاء الأفراد

المفتاح:

`individualCustomerSettings`

| الخاصية | الشرح المعروض | المجال المعلن |
|---|---|---|
| `firstNameMandatory` | الاسم الأول — إلزام الحقل | اختيار منطقي |
| `middleNameMandatory` | الاسم الأوسط — إلزام الحقل | اختيار منطقي |
| `lastNameMandatory` | الاسم الأخير — إلزام الحقل | اختيار منطقي |
| `genderMandatory` | الجنس — إلزام الحقل | اختيار منطقي |
| `emailMandatory` | البريد الإلكتروني — إلزام الحقل | اختيار منطقي |
| `nationalityMandatory` | الجنسية — إلزام الحقل | اختيار منطقي |
| `companyMandatory` | الشركة — إلزام الحقل | اختيار منطقي |
| `nextOfKinNameMandatory` | اسم القريب — إلزام الحقل | اختيار منطقي |
| `nextOfKinContactNoMandatory` | رقم اتصال القريب — إلزام الحقل | اختيار منطقي |
| `mobileNoMandatory` | رقم الجوال — إلزام الحقل | اختيار منطقي |
| `phoneHomeMandatory` | هاتف المنزل — إلزام الحقل | اختيار منطقي |
| `phoneWorkMandatory` | هاتف العمل — إلزام الحقل | اختيار منطقي |
| `addressMandatory` | العنوان — إلزام الحقل | اختيار منطقي |
| `cityMandatory` | المدينة — إلزام الحقل | اختيار منطقي |
| `stateMandatory` | المنطقة — إلزام الحقل | اختيار منطقي |
| `zipCodeMandatory` | الرمز البريدي — إلزام الحقل | اختيار منطقي |
| `countryMandatory` | الدولة — إلزام الحقل | اختيار منطقي |
| `drivingExperienceMandatory` | خبرة القيادة — إلزام الحقل | اختيار منطقي |
| `salesPersonMandatory` | موظف المبيعات — إلزام الحقل | اختيار منطقي |
| `nationalIdMandatory` | رقم الهوية — إلزام الحقل | اختيار منطقي |
| `codeMandatory` | الكود — إلزام الحقل | اختيار منطقي |
| `driverLicenseMandatory` | رخصة القيادة — إلزام الحقل | اختيار منطقي |
| `referralMandatory` | اسم المرجع — إلزام الحقل | اختيار منطقي |
| `referralContactNoMandatory` | رقم اتصال المرجع — إلزام الحقل | اختيار منطقي |
| `doNotAllowDuplicateNationalId` | عدم السماح بتكرار رقم الهوية | اختيار منطقي |
| `residenceStatusRequiredForCustomers` | حالة الإقامة مطلوبة للعملاء | اختيار منطقي |
| `dateOfBirthMandatory` | تاريخ الميلاد — إلزام الحقل | اختيار منطقي |
| `minimumAge` | الحد الأدنى للعمر | رقمي — يحتاج تصنيف مجال |
| `dateOfBirth` | تاريخ الميلاد | اختيار منطقي |
| `age` | العمر | اختيار منطقي |
| `vipCustomer` | عميل VIP | اختيار منطقي |
| `loyaltyNumber` | رقم الولاء | اختيار منطقي |
| `referral` | اسم المرجع | اختيار منطقي |
| `individualCustomerCustomField4` | حقل مخصص للعميل الفردي 4 | اختيار منطقي |
| `businessSourceBroker` | وسيط مصدر الأعمال | رقمي — يحتاج تصنيف مجال |
| `creditCardLast4DigitsOnly` | آخر 4 أرقام من بطاقة الائتمان فقط | اختيار منطقي |
| `creditCardCvv` | رمز التحقق للبطاقة (CVV) | اختيار منطقي |
| `residenceStatus` | حالة الإقامة | اختيار منطقي |

### مجموعة إعدادات العملاء الشركات

المفتاح:

`companyCustomerSettings`

| الخاصية | الشرح المعروض | المجال المعلن |
|---|---|---|
| `salesPerson` | موظف المبيعات | اختيار منطقي |
| `tradeLicense` | الرخصة التجارية | اختيار منطقي |
| `trn` | الرقم الضريبي | اختيار منطقي |
| `companyCustomerCustomField4` | حقل مخصص لعميل الشركة 4 | اختيار منطقي |

### مجموعة إعدادات المركبات

المفتاح:

`vehicleSettings`

| الخاصية | الشرح المعروض | المجال المعلن |
|---|---|---|
| `branchMandatory` | الفرع — إلزام الحقل | اختيار منطقي |
| `yearMandatory` | السنة — إلزام الحقل | اختيار منطقي |
| `chassisNoMandatory` | رقم الشاسيه — إلزام الحقل | اختيار منطقي |
| `engineNoMandatory` | رقم المحرك — إلزام الحقل | اختيار منطقي |
| `engineCapacityMandatory` | سعة المحرك — إلزام الحقل | اختيار منطقي |
| `kMsMandatory` | الكيلومترات — إلزام الحقل | اختيار منطقي |
| `interiorColorMandatory` | اللون الداخلي — إلزام الحقل | اختيار منطقي |
| `exteriorColorMandatory` | اللون الخارجي — إلزام الحقل | اختيار منطقي |
| `fuelTankCapacityMandatory` | سعة خزان الوقود — إلزام الحقل | اختيار منطقي |
| `eTagMandatory` | ETag — إلزام الحقل | اختيار منطقي |
| `acrissCodeMandatory` | كود ACRISS — إلزام الحقل | اختيار منطقي |
| `vehicleTypeMandatory` | نوع المركبة — إلزام الحقل | اختيار منطقي |
| `fleetTypeMandatory` | نوع الأسطول — إلزام الحقل | اختيار منطقي |
| `ownershipMandatory` | المالكية — إلزام الحقل | اختيار منطقي |
| `returnDateMandatory` | تاريخ الإرجاع — إلزام الحقل | اختيار منطقي |
| `purchaseDateMandatory` | تاريخ الشراء — إلزام الحقل | اختيار منطقي |
| `registrationDateMandatory` | تاريخ التسجيل — إلزام الحقل | اختيار منطقي |
| `nextRegistrationDateMandatory` | تاريخ التسجيل القادم — إلزام الحقل | اختيار منطقي |
| `insurancePolicyNoMandatory` | رقم بوليصة التأمين — إلزام الحقل | اختيار منطقي |
| `warrantyInKmsMandatory` | الضمان بالكيلومترات — إلزام الحقل | اختيار منطقي |
| `warrantyInMonthsMandatory` | الضمان بالأشهر — إلزام الحقل | اختيار منطقي |
| `customField1Mandatory` | حقل مخصص 1 — إلزام الحقل | اختيار منطقي |
| `customField2Mandatory` | حقل مخصص 2 — إلزام الحقل | اختيار منطقي |
| `customField3Mandatory` | حقل مخصص 3 — إلزام الحقل | اختيار منطقي |
| `nextVehicleCustomAlert1Mandatory` | تنبيه مخصص للمركبة القادمة 1 — إلزام الحقل | اختيار منطقي |
| `nextVehicleCustomAlert2Mandatory` | تنبيه مخصص للمركبة القادمة 2 — إلزام الحقل | اختيار منطقي |
| `notesMandatory` | ملاحظات — إلزام الحقل | اختيار منطقي |
| `insuranceDatesMandatory` | تواريخ التأمين — إلزام الحقل | اختيار منطقي |
| `externalVehicleOwnerMandatory` | مالك المركبة الخارجي — إلزام الحقل | اختيار منطقي |
| `trafficFileIdForOwnVehicleMandatory` | رقم ملف المرور للمركبة الخاصة — إلزام الحقل | اختيار منطقي |
| `customField1` | حقل مخصص 1 | اختيار منطقي |
| `vehicleCustomAlert2` | تنبيه مخصص للمركبة 2 | اختيار منطقي |
| `customField2` | حقل مخصص 2 | اختيار منطقي |
| `externalVehicleOwner` | مالك المركبة الخارجي | اختيار منطقي |
| `customField3` | حقل مخصص 3 | اختيار منطقي |
| `showOnlyFewerDetailForTheVehicleType` | عرض تفاصيل أقل لنوع المركبة | اختيار منطقي |
| `vehicleCustomAlert1` | تنبيه مخصص للمركبة 1 | اختيار منطقي |
| `showCustomField1AfterPlateNoGrid` | عرض الحقل المخصص 1 بعد شبكة رقم اللوحة | اختيار منطقي |
| `investor` | مستثمر | اختيار منطقي |
| `mortgage` | رهن | اختيار منطقي |
| `leaseToOwn` | إيجار منتهي بالتمليك | اختيار منطقي |

### مجموعة إعدادات الاتفاقيات

المفتاح:

`agreementSettings`

| الخاصية | الشرح المعروض | المجال المعلن |
|---|---|---|
| `advancePaymentIndividualCustomerMandatory` | الدفع المقدم للعميل الفردي — إلزام الحقل | اختيار منطقي |
| `returnDateMandatory` | تاريخ الإرجاع — إلزام الحقل | اختيار منطقي |
| `depositIndividualCustomer` | التأمين (عميل فردي) | اختيار منطقي |
| `insuranceCompanyAndClaimNo` | شركة التأمين ورقم المطالبة | اختيار منطقي |
| `expectedEndDate` | تاريخ الانتهاء المتوقع | اختيار منطقي |
| `securityDepositDefaultExpiryDays` | الأيام الافتراضية لانتهاء صلاحية التأمين | رقمي — يحتاج تصنيف مجال |
| `isClosed` | مغلق | اختيار منطقي |

### مجموعة إعدادات الإشعار الدائن

المفتاح:

`creditNoteSettings`

| الخاصية | الشرح المعروض | المجال المعلن |
|---|---|---|
| `reason` | السبب | اختيار منطقي |
| `reasonNotes` | ملاحظات السبب | اختيار منطقي |

### مجموعة إعدادات قيود اليومية

المفتاح:

`jvSettings`

| الخاصية | الشرح المعروض | المجال المعلن |
|---|---|---|
| `employeeSelectionIsOptionalForControlAccounts` | اختيار الموظف اختياري لحسابات المراقبة | اختيار منطقي |
| `costCenterRequired` | مركز التكلفة مطلوب | اختيار منطقي |

### مجموعة إعدادات الفواتير

المفتاح:

`billSettings`

| الخاصية | الشرح المعروض | المجال المعلن |
|---|---|---|
| `costCenterRequired` | مركز التكلفة مطلوب | اختيار منطقي |
| `customFieldOneIsMandatoryInBill` | الحقل المخصص الأول إلزامي في الفاتورة | اختيار منطقي |

### مجموعة إعدادات الدفع

المفتاح:

`paymentSettings`

| الخاصية | الشرح المعروض | المجال المعلن |
|---|---|---|
| `costCenterRequired` | مركز التكلفة مطلوب | اختيار منطقي |

### مجموعة إعدادات الموردين

المفتاح:

`supplierSettings`

| الخاصية | الشرح المعروض | المجال المعلن |
|---|---|---|
| `showSupplierBank` | عرض تفاصيل بنك المورد | اختيار منطقي |
| `contactPerson` | الشخص المسؤول | اختيار منطقي |
| `creditPeriod` | فترة الائتمان | اختيار منطقي |

### مجموعة إعدادات الموظفين

المفتاح:

`staffSettings`

| الخاصية | الشرح المعروض | المجال المعلن |
|---|---|---|
| `showExpiryDateOfDocumentsInStaffTable` | عرض تاريخ انتهاء المستندات في جدول الموظفين | اختيار منطقي |

### مجموعة إعدادات الفواتير

المفتاح:

`invoiceSettings`

| الخاصية | الشرح المعروض | المجال المعلن |
|---|---|---|
| `commission` | العمولة | اختيار منطقي |
| `invoiceTermsAndConditionNotes` | ملاحظات الشروط والأحكام للفاتورة | اختيار منطقي |

### مجموعة إعدادات الأصناف

المفتاح:

`itemSettings`

| الخاصية | الشرح المعروض | المجال المعلن |
|---|---|---|
| `makeModelForParts` | الطراز/الموديل لقطع الغيار | اختيار منطقي |

### مجموعة إعدادات الحسابات

المفتاح:

`accountSettings`

| الخاصية | الشرح المعروض | المجال المعلن |
|---|---|---|
| `externalAccountCode` | كود الحساب الخارجي | اختيار منطقي |

### مجموعة إعدادات الوظائف

المفتاح:

`jobSettings`

| الخاصية | الشرح المعروض | المجال المعلن |
|---|---|---|
| `vehicleQualityCheckReportMandatoryForJobClosing` | تقرير فحص جودة المركبة إلزامي لإغلاق الوظيفة | اختيار منطقي |
| `addCategoriesInJob` | إضافة فئات في الوظيفة | اختيار منطقي |

### مجموعة إعدادات إرجاع الأصناف

المفتاح:

`itemReturnSettings`

| الخاصية | الشرح المعروض | المجال المعلن |
|---|---|---|
| `notesReturnReasonMandatoryForItemReturn` | الملاحظات/سبب الإرجاع إلزامي لإرجاع الصنف | اختيار منطقي |

### مجموعة إعدادات طلب الشراء

المفتاح:

`purchaseRequestSettings`

| الخاصية | الشرح المعروض | المجال المعلن |
|---|---|---|
| `simplePurchaseRequest` | [طلب شراء بسيط] | اختيار منطقي |

### مجموعة إعدادات عروض أسعار التأجير

المفتاح:

`rentalQuotationSettings`

| الخاصية | الشرح المعروض | المجال المعلن |
|---|---|---|
| `rentalQuotationsValidityDays` | أيام صلاحية عروض أسعار التأجير | اختيار منطقي |
| `linkCrsVehicleWithWorkshopVehicleOnChassisNo` | ربط مركبة CRS بمركبة الورشة برقم الشاسيه | اختيار منطقي |
| `mergeEnglishAndArabicDescriptionAndLocationInDownloadingTamm` | دمج الوصف الإنجليزي والعربي والموقع في تحميل Tamm | اختيار منطقي |
| `enableManualAgreementNo` | تمكين رقم الاتفاقية اليدوي | اختيار منطقي |
| `vehicleTypeOptionalInBooking` | نوع المركبة اختياري في الحجز | اختيار منطقي |
| `setVehicleOptionalInBookingConfirmation` | تعيين المركبة اختياري في تأكيد الحجز | اختيار منطقي |
| `allowDepositInBookingWithoutReceivingAmount` | السماح بالتأمين في الحجز دون استلام المبلغ | اختيار منطقي |
| `warningOnChangingBranch` | تحذير عند تغيير الفرع | اختيار منطقي |
| `hideSpecificColumnsInTripReport` | إخفاء أعمدة محددة في تقرير الرحلة | اختيار منطقي |
| `enableTotalLossInAssets` | تمكين الخسارة الكلية في الأصول | اختيار منطقي |
| `makeReceiptOrDepositOptionalInAdvanceTaxInvoice` | جعل الإيصال أو الإيداع اختياريًا في الفاتورة الضريبية المقدمة | اختيار منطقي |
| `showDescriptionForAtiAllocationInInvoice` | عرض الوصف لتخصيص ATI في الفاتورة | اختيار منطقي |
| `addDamageChargesAndInvoiceOnCheckboxOnAccidentModule` | إضافة رسوم الأضرار والفاتورة عند تحديد مربع الاختيار في وحدة الحوادث | اختيار منطقي |
| `generateAdvanceTaxInvoiceFromAdvanceTaxReceipt` | إنشاء فاتورة ضريبية مقدمة من إيصال ضريبي مقدم | اختيار منطقي |
| `addAdvanceAsAtrAndGenerateAti` | إضافة المقدم كـ ATR وإنشاء ATI | اختيار منطقي |
| `claimChargesInTotalLoss` | مطالبة بالرسوم في الخسارة الكلية | اختيار منطقي |

### مجموعة إعدادات استفسار التأجير

المفتاح:

`leaseInquirySettings`

| الخاصية | الشرح المعروض | المجال المعلن |
|---|---|---|
| `leaseInquiryCustomField1` | حقل مخصص لاستفسار التأجير 1 | اختيار منطقي |

### مجموعة إعدادات عروض أسعار الليموزين

المفتاح:

`limoQuotationSettings`

| الخاصية | الشرح المعروض | المجال المعلن |
|---|---|---|
| `contactPersonName` | اسم الشخص المسؤول | اختيار منطقي |
| `paymentMethod` | طريقة الدفع | اختيار منطقي |
| `paymentTerms` | شروط الدفع | اختيار منطقي |
| `pickUpDateTime` | تاريخ ووقت الاستلام | اختيار منطقي |
| `dropOffDateTime` | تاريخ ووقت التسليم | اختيار منطقي |

## صفحة مراكز التكلفة

المسار:

`/Settings/costCenters`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/cost-centers/cost-centers.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | isMandatory | مطلوب للحسابات المالية (P&L/Prepaid) | منطقي |
| الصفحة | costCenterId | مركز التكلفة الافتراضي (مجموعة 1) | اختيار |

## صفحة المعدات

المسار:

`/Settings/equipment`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/equipment/equipment.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | isTimeSheetMandatoryForRentalInvoicing | هل سجل الوقت إلزامي لفوترة الإيجار | منطقي |

## صفحة العطلات

المسار:

`/Settings/holidaysSetting`

المصدر: [قالب الصفحة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/components/holidays-setting/holidays-setting.component.html>).

| القسم | مفتاح التحكم | الوصف المعروض | نوع الواجهة |
|---|---|---|---|
| الصفحة | keyword | راجع التسمية في القالب | نص/قيمة بحسب العقد |
| الصفحة | name | اسم  | نص/قيمة بحسب العقد |
| الصفحة | date | تاريخ  | نص/قيمة بحسب العقد |

