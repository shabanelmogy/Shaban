# شاشة: Quotations

المسار في القائمة: Rental ←  Quotations.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_rentalQuotation`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0372](../../../readable/routes/R0372--tenant-crs-rentalquotation.js)، والأصل [raw/application.js:4212](../../../raw/application.js#L4212).
- قالب الشاشة: `~/App/tenant/views/crs/rental/quotations/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.rental.quotations.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.rental.quotations.index](../../../readable/controllers/C0958--tenant.views.crs.rental.quotations.index.js) | 34 | 10 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.crs.lease.leaseQuotations.printtemplates.printPreview](../../../readable/controllers/C0883--tenant.views.crs.lease.leaseQuotations.printtemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.rental.masterAgreements.createOrEditModal](../../../readable/controllers/C0949--tenant.views.crs.rental.masterAgreements.createOrEditModal.js) | 6 | 2 |
| [tenant.views.common.payments.quotationalPayment](../../../readable/controllers/C0411--tenant.views.common.payments.quotationalPayment.js) | 4 | 1 |
| [tenant.views.common.payments.silentPayment](../../../readable/controllers/C0412--tenant.views.common.payments.silentPayment.js) | 2 | 3 |
| [tenant.views.crs.lease.leaseQuotations.createOrEditModal](../../../readable/controllers/C0876--tenant.views.crs.lease.leaseQuotations.createOrEditModal.js) | 16 | 10 |
| [tenant.views.crs.rental.quotations.createOrEditQuotationModal](../../../readable/controllers/C0957--tenant.views.crs.rental.quotations.createOrEditQuotationModal.js) | 33 | 13 |
| [tenant.views.crs.rental.quotations.printtemplates.printPreview](../../../readable/controllers/C0962--tenant.views.crs.rental.quotations.printtemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.saleOrders.createOrEditModal](../../../readable/controllers/C1440--tenant.views.crs.vouchers.saleOrders.createOrEditModal.js) | 22 | 9 |
| [tenant.views.crs.rental.quotations.viewModal](../../../readable/controllers/C0961--tenant.views.crs.rental.quotations.viewModal.js) | 11 | 3 |
| [tenant.views.crs.lease.leaseQuotations.processQuotationModal](../../../readable/controllers/C0881--tenant.views.crs.lease.leaseQuotations.processQuotationModal.js) | 2 | 0 |
| [tenant.views.crs.lease.leaseQuotations.logLeaseQuotationModal](../../../readable/controllers/C0879--tenant.views.crs.lease.leaseQuotations.logLeaseQuotationModal.js) | 2 | 0 |
| [tenant.views.crs.vouchers.common.rejectReason](../../../readable/controllers/C1256--tenant.views.crs.vouchers.common.rejectReason.js) | 2 | 0 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.lease.leaseQuotations.calculationDetail](../../../readable/controllers/C0874--tenant.views.crs.lease.leaseQuotations.calculationDetail.js) | 4 | 0 |
| [tenant.views.crs.rental.quotations.calculationDetail](../../../readable/controllers/C0956--tenant.views.crs.rental.quotations.calculationDetail.js) | 9 | 0 |
| [tenant.views.crs.rental.quotations.viewCalculationDetail](../../../readable/controllers/C0960--tenant.views.crs.rental.quotations.viewCalculationDetail.js) | 2 | 0 |
| [tenant.views.crs.vouchers.saleOrders.printTemplates.printPreview](../../../readable/controllers/C1446--tenant.views.crs.vouchers.saleOrders.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.saleOrders.uploadDocumentsModal](../../../readable/controllers/C1444--tenant.views.crs.vouchers.saleOrders.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.rental.quotations.index`: `CurrencyFormate`، `getStatus`، `searchVehicles`، `canCreateMasterAgreement`، `searchContact`، `searchContactPopoup`، `searchVehiclePopup`، `getRentalQuotations`، `currencyAndRoundingWithThree`، `roundingforView`، `getlocalDate`، `exportToExcel`، `canCreateLPO`، `canRevise`، `leaseQuotationPrintModal`، `createMasterAgreement`، `paymentAndAddCardInQuotation`، `openSilentPaymentModal`، `quotationPrintModal`، `createLPOonQuotation`، `createNewQuotation`، `editNewLeaseQuotation`، `createLeaseQuotation`، `editLeaseQuotation`، `viewRentalQuotation`، `processLeaseQuotation`، `logLeaseQuotation`، `deleteLeaseQuotation`، `approveQuotation`، `rejectQuotation`، `rejectQuotationByCustomer`، `approveQuotationByCustomer`، `enterKeyPress`، `clearCustomer`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.crs.lease.leaseQuotations.printtemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.rental.masterAgreements.createOrEditModal`: `rounding`، `localize`، `cancel`، `onSaleOrderSelection`، `getSaleOrders`، `save`.
- وحدة `tenant.views.common.payments.quotationalPayment`: `isOneTimePaymentOnChange`، `send`، `cancel`، `getlocalDateTime`.
- وحدة `tenant.views.common.payments.silentPayment`: `cancel`، `pay`.
- وحدة `tenant.views.crs.lease.leaseQuotations.createOrEditModal`: `rounding`، `searchContact`، `searchContactPopoup`، `searchModel`، `getStatus`، `modelSelected`، `periodChanged`، `addRow`، `removeRow`، `calculationDetail`، `calculationDetailView`، `cancel`، `calculate`، `sum`، `getcostingParameters`، `save`.
- وحدة `tenant.views.crs.rental.quotations.createOrEditQuotationModal`: `rounding`، `searchSalesPersons`، `taxAcceptedChanged`، `searchSalesPersonPopoup`، `salesPersonSelected`، `localize`، `isdateNull`، `getPeriodType`، `getRateType`، `vehicleTypeChanged`، `loadandApplyTariffToAllLines`، `loadandApplyTariff`، `calculateTax`، `calculateTaxForShow`، `applyTariff`، `quotationTypeChanged`، `lineCalc`، `calculationDetail`، `calculationDetailView`، `searchContact`، `branchTaxCode`، `customerChanged`، `searchContactPopoup`، `modelSelected`، `vehicleTypeChanged`، `searchModel`، `getTariffGroups`، `getStatus`، `addRow`، `removeRow`، `cancel`، `calculateCharges`، `save`.
- وحدة `tenant.views.crs.rental.quotations.printtemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.saleOrders.createOrEditModal`: `rounding`، `roundingforView`، `searchVehicles`، `searchQuotations`، `searchContacts`، `getOriginalName`، `searchContactsPopoup`، `onCustomerSelect`، `addRow`، `removeRow`، `branchTaxCode`، `onCustomerSelect`، `setTaxPercentOnTaxCode`، `calculateTaxPerRow`، `sumAmount`، `sumAmountTax`، `save`، `cancel`، `uploadDocument`، `removeDocument`، `quotationChanged`، `getQuotation`.
- وحدة `tenant.views.crs.rental.quotations.viewModal`: `rounding`، `localize`، `currencyAndRoundingWithThree`، `roundingforView`، `getPeriodType`، `getRateType`، `getTariffGroups`، `getStatus`، `cancel`، `calculateTaxForShow`، `lineCalc`.
- وحدة `tenant.views.crs.lease.leaseQuotations.processQuotationModal`: `cancel`، `getlocalDateTime`.
- وحدة `tenant.views.crs.lease.leaseQuotations.logLeaseQuotationModal`: `cancel`، `getlocalDateTime`.
- وحدة `tenant.views.crs.vouchers.common.rejectReason`: `cancel`، `save`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.lease.leaseQuotations.calculationDetail`: `includedChanged`، `localize`، `calculate`، `cancel`.
- وحدة `tenant.views.crs.rental.quotations.calculationDetail`: `disableRate`، `tariffOptionSelected`، `includedChanged`، `includedChanged`، `localize`، `calculate`، `calculateTax`، `taxAcceptedChanged`، `cancel`.
- وحدة `tenant.views.crs.rental.quotations.viewCalculationDetail`: `localize`، `cancel`.
- وحدة `tenant.views.crs.vouchers.saleOrders.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.saleOrders.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L395301) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L182771) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L259651) |
| `abp.services.app.rentalQuotation.getQuotations` | POST | api/services/app/rentalQuotation/GetQuotations | [المصدر](../../../raw/application.js#L258668) |
| `abp.services.app.rentalQuotation.exportToExcel` | POST | api/services/app/rentalQuotation/ExportToExcel | [المصدر](../../../raw/application.js#L258711) |
| `abp.services.app.rentalQuotation.deleteQuotation` | POST | api/services/app/rentalQuotation/DeleteQuotation | [المصدر](../../../raw/application.js#L259170) |
| `abp.services.app.rentalQuotation.approveQuotation` | POST | api/services/app/rentalQuotation/ApproveQuotation | [المصدر](../../../raw/application.js#L259187) |
| `abp.services.app.rentalQuotation.rejectQuotation` | POST | api/services/app/rentalQuotation/RejectQuotation | [المصدر](../../../raw/application.js#L259229) |
| `abp.services.app.rentalQuotation.rejectQuotationByCustomer` | POST | api/services/app/rentalQuotation/RejectQuotationByCustomer | [المصدر](../../../raw/application.js#L259267) |
| `abp.services.app.rentalQuotation.approveQuotationByCustomer` | POST | api/services/app/rentalQuotation/ApproveQuotationByCustomer | [المصدر](../../../raw/application.js#L259282) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L258347) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L182597) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L259669) |
| `abp.services.app.agreementSaleOrder.getAgreementSaleOrdersByContactId` | POST | api/services/app/agreementSaleOrder/GetAgreementSaleOrdersByContactId | [المصدر](../../../raw/application.js#L256600) |
| `abp.services.app.rentalMasterAgreement.createOrUpdateMasterRentalAgreement` | POST | api/services/app/rentalMasterAgreement/CreateOrUpdateMasterRentalAgreement | [المصدر](../../../raw/application.js#L256619) |
| `abp.services.app.invoice.sendEmailForInvoicePayment` | POST | api/services/app/invoice/SendEmailForInvoicePayment | [المصدر](../../../raw/application.js#L102854) |
| `abp.services.app.booking.silentPayment` | POST | api/services/app/booking/SilentPayment | [المصدر](../../../raw/application.js#L102934) |
| `abp.services.app.invoice.silentPayment` | POST | api/services/app/invoice/SilentPayment | [المصدر](../../../raw/application.js#L102942) |
| `abp.services.app.rentalQuotation.silentPayment` | POST | api/services/app/rentalQuotation/SilentPayment | [المصدر](../../../raw/application.js#L102957) |
| `abp.services.app.costSetting.getCostSettingByModel` | POST | api/services/app/costSetting/GetCostSettingByModel | [المصدر](../../../raw/application.js#L239268) |
| `abp.services.app.chargesSetting.getChargesSettings` | POST | api/services/app/chargesSetting/GetChargesSettings | [المصدر](../../../raw/application.js#L258077) |
| `abp.services.app.costParameter.getcostingParameters` | POST | api/services/app/costParameter/GetcostingParameters | [المصدر](../../../raw/application.js#L239245) |
| `abp.services.app.leaseQuotation.getLeaseQuotationForRevision` | POST | api/services/app/leaseQuotation/GetLeaseQuotationForRevision | [المصدر](../../../raw/application.js#L239257) |
| `abp.services.app.leaseQuotation.getLeaseQuotationForEdit` | POST | api/services/app/leaseQuotation/GetLeaseQuotationForEdit | [المصدر](../../../raw/application.js#L395702) |
| `abp.services.app.leaseQuotation.reviseLeaseQuotation` | POST | api/services/app/leaseQuotation/ReviseLeaseQuotation | [المصدر](../../../raw/application.js#L239301) |
| `abp.services.app.leaseQuotation.createOrUpdateLeaseQuotation` | POST | api/services/app/leaseQuotation/CreateOrUpdateLeaseQuotation | [المصدر](../../../raw/application.js#L239303) |
| `abp.services.app.directory.getContactsByCompanyId` | POST | api/services/app/directory/GetContactsByCompanyId | [المصدر](../../../raw/application.js#L258241) |
| `abp.services.app.commonLookup.getLocationById` | POST | api/services/app/commonLookup/GetLocationById | [المصدر](../../../raw/application.js#L395381) |
| `abp.services.app.rentalQuotation.getQuotationForRevision` | POST | api/services/app/rentalQuotation/GetQuotationForRevision | [المصدر](../../../raw/application.js#L258410) |
| `abp.services.app.rentalQuotation.getQuotationForEdit` | POST | api/services/app/rentalQuotation/GetQuotationForEdit | [المصدر](../../../raw/application.js#L259759) |
| `abp.services.app.rentalQuotation.reviseQuotation` | POST | api/services/app/rentalQuotation/ReviseQuotation | [المصدر](../../../raw/application.js#L258504) |
| `abp.services.app.rentalQuotation.createOrUpdateQuotation` | POST | api/services/app/rentalQuotation/CreateOrUpdateQuotation | [المصدر](../../../raw/application.js#L258506) |
| `abp.services.app.rentalQuotation.searchQuotations` | POST | api/services/app/rentalQuotation/SearchQuotations | [المصدر](../../../raw/application.js#L395308) |
| `abp.services.app.saleOrder.createOrUpdateSaleOrder` | POST | api/services/app/saleOrder/CreateOrUpdateSaleOrder | [المصدر](../../../raw/application.js#L395557) |
| `abp.services.app.saleOrder.getSaleOrderForEdit` | POST | api/services/app/saleOrder/GetSaleOrderForEdit | [المصدر](../../../raw/application.js#L395609) |
| `abp.services.app.chargesSetting.getChargesTypes` | POST | api/services/app/chargesSetting/GetChargesTypes | [المصدر](../../../raw/application.js#L182581) |
| `abp.services.app.directory.searchSalesPersonOne` | POST | api/services/app/directory/SearchSalesPersonOne | [المصدر](../../../raw/application.js#L182778) |
| `abp.services.app.commonLookup.searchCustomLookups` | POST | api/services/app/commonLookup/SearchCustomLookups | [المصدر](../../../raw/application.js#L182861) |
| `abp.services.app.commonLookup.getCustomLookups` | POST | api/services/app/commonLookup/GetCustomLookups | [المصدر](../../../raw/application.js#L182869) |
| `abp.services.app.country.searchCountries` | POST | api/services/app/country/SearchCountries | [المصدر](../../../raw/application.js#L183560) |
| `abp.services.app.person.createOrUpdatePerson` | POST | api/services/app/person/CreateOrUpdatePerson | [المصدر](../../../raw/application.js#L183236) |
| `abp.services.app.contactGroup.getContactGroupsOnContactType` | POST | api/services/app/contactGroup/GetContactGroupsOnContactType | [المصدر](../../../raw/application.js#L183448) |
| `abp.services.app.taxCode.getTaxCodes` | POST | api/services/app/taxCode/GetTaxCodes | [المصدر](../../../raw/application.js#L183456) |
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L183468) |
| `abp.services.app.tariffCard.getActiveTariffCards` | POST | api/services/app/tariffCard/GetActiveTariffCards | [المصدر](../../../raw/application.js#L183703) |
| `abp.services.app.tariffCard.getTariffCardById` | POST | api/services/app/tariffCard/GetTariffCardById | [المصدر](../../../raw/application.js#L183716) |
| `abp.services.app.person.getAdvanceSettings` | POST | api/services/app/person/GetAdvanceSettings | [المصدر](../../../raw/application.js#L183744) |
| `abp.services.app.person.getHighLightBlackListCountry` | POST | [object Object] | [المصدر](../../../raw/application.js#L183768) |
| `abp.services.app.person.getNationalIdFormate` | POST | [object Object] | [المصدر](../../../raw/application.js#L183774) |
| `abp.services.app.person.getPersonForEdit` | POST | api/services/app/person/GetPersonForEdit | [المصدر](../../../raw/application.js#L183903) |
| `abp.services.app.person.getContactCards` | POST | api/services/app/person/GetContactCards | [المصدر](../../../raw/application.js#L184004) |
| `abp.services.app.commonLookup.validateCreditLimit` | POST | api/services/app/commonLookup/ValidateCreditLimit | [المصدر](../../../raw/application.js#L184099) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Rental.Quotations`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Rental.Quotations.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Rental.Quotations.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Rental.Quotations.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Rental.Quotations.Revise`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Rental.Quotations.CreateSaleOrder`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Rental.Quotations.Approval`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Rental.Quotations.CreateMasterAgreement`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Rental.Quotations.CustomerApproval`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Rental.Quotations.PaymentAndAddCardInQuotation`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.AllActionsOnOtherBranchPurchaseOrders`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ExpensePayments.Addnew`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ExpensePayments.Edit`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ExpensePayments.Delete`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TariffCards`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.EnableCreditPeriod`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.EnableCreditLimit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.Tenant.Integration.Fusion.Mappings`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.Add`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.ViewCreditCardWithLastFourDigit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.ViewFullCreditCardDetails`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.CustomerApproval`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.LimitedEdit`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.quotationNo` | text |  |  |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.locationId` | select | locationId |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.internalStatus` | select |  | ng-options=status.id as status.name for status in vm.statuses |
| `vm.filters.externalStatus` | select |  | ng-options=status.id as status.name for status in vm.customerApprovalStatuses |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
