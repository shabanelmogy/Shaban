# شاشة: Invoices

المسار في القائمة: Vouchers ← Invoices.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_invoices`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0330](../../../readable/routes/R0330--tenant-crs-invoices.js)، والأصل [raw/application.js:3896](../../../raw/application.js#L3896).
- قالب الشاشة: `~/App/tenant/views/crs/vouchers/invoices/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.vouchers.invoices.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.vouchers.invoices.index](../../../readable/controllers/C1336--tenant.views.crs.vouchers.invoices.index.js) | 107 | 28 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.vouchers.invoices.viewModalSalesAgreementInvoice](../../../readable/controllers/C1356--tenant.views.crs.vouchers.invoices.viewModalSalesAgreementInvoice.js) | 13 | 5 |
| [tenant.views.crs.vouchers.invoices.generateSalesAgreementModal](../../../readable/controllers/C1332--tenant.views.crs.vouchers.invoices.generateSalesAgreementModal.js) | 46 | 17 |
| [tenant.views.crs.vouchers.invoices.createOrEditLimoModal](../../../readable/controllers/C1314--tenant.views.crs.vouchers.invoices.createOrEditLimoModal.js) | 33 | 8 |
| [tenant.views.crs.vouchers.invoices.generateStockSaleInvoice](../../../readable/controllers/C1334--tenant.views.crs.vouchers.invoices.generateStockSaleInvoice.js) | 45 | 15 |
| [tenant.views.crs.vouchers.invoices.generateModal](../../../readable/controllers/C1329--tenant.views.crs.vouchers.invoices.generateModal.js) | 26 | 12 |
| [tenant.views.crs.vouchers.invoices.generateAccessoriesModal](../../../readable/controllers/C1317--tenant.views.crs.vouchers.invoices.generateAccessoriesModal.js) | 18 | 6 |
| [tenant.views.crs.vouchers.invoices.generateEquipmentRentalModal](../../../readable/controllers/C1322--tenant.views.crs.vouchers.invoices.generateEquipmentRentalModal.js) | 18 | 8 |
| [tenant.views.crs.vouchers.invoices.generateFmsInvoiceModal](../../../readable/controllers/C1325--tenant.views.crs.vouchers.invoices.generateFmsInvoiceModal.js) | 13 | 4 |
| [tenant.views.crs.vouchers.invoices.generateParkingModal](../../../readable/controllers/C1331--tenant.views.crs.vouchers.invoices.generateParkingModal.js) | 17 | 7 |
| [tenant.views.crs.vouchers.invoices.generateSalikModal](../../../readable/controllers/C1333--tenant.views.crs.vouchers.invoices.generateSalikModal.js) | 21 | 6 |
| [tenant.views.crs.vouchers.invoices.generateDarbSalikModal](../../../readable/controllers/C1320--tenant.views.crs.vouchers.invoices.generateDarbSalikModal.js) | 20 | 6 |
| [tenant.views.crs.vouchers.invoices.generateFineModal](../../../readable/controllers/C1324--tenant.views.crs.vouchers.invoices.generateFineModal.js) | 20 | 8 |
| [tenant.views.crs.vouchers.invoices.generateLimoModal](../../../readable/controllers/C1328--tenant.views.crs.vouchers.invoices.generateLimoModal.js) | 15 | 4 |
| [tenant.views.crs.vouchers.invoices.generateLeaseModal](../../../readable/controllers/C1327--tenant.views.crs.vouchers.invoices.generateLeaseModal.js) | 19 | 9 |
| [tenant.views.crs.vouchers.invoices.generateExcessKMsModal](../../../readable/controllers/C1323--tenant.views.crs.vouchers.invoices.generateExcessKMsModal.js) | 15 | 3 |
| [tenant.views.crs.vouchers.invoices.generateEquipmentLeaseModal](../../../readable/controllers/C1321--tenant.views.crs.vouchers.invoices.generateEquipmentLeaseModal.js) | 14 | 4 |
| [tenant.views.crs.vouchers.invoices.generateTransportationModal](../../../readable/controllers/C1335--tenant.views.crs.vouchers.invoices.generateTransportationModal.js) | 7 | 2 |
| [tenant.views.crs.vouchers.invoices.generateChauffeurModal](../../../readable/controllers/C1319--tenant.views.crs.vouchers.invoices.generateChauffeurModal.js) | 11 | 3 |
| [tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal](../../../readable/controllers/C1318--tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal.js) | 31 | 12 |
| [tenant.views.crs.vouchers.invoices.createOrEditModal](../../../readable/controllers/C1315--tenant.views.crs.vouchers.invoices.createOrEditModal.js) | 46 | 16 |
| [tenant.views.crs.vouchers.invoices.generateOutOfScopeInvoiceModal](../../../readable/controllers/C1330--tenant.views.crs.vouchers.invoices.generateOutOfScopeInvoiceModal.js) | 46 | 16 |
| [tenant.views.crs.vouchers.invoices.generateFuelInvoiceModal](../../../readable/controllers/C1326--tenant.views.crs.vouchers.invoices.generateFuelInvoiceModal.js) | 45 | 15 |
| [tenant.views.crs.vouchers.invoices.createOrEditModalRentalClub](../../../readable/controllers/C1316--tenant.views.crs.vouchers.invoices.createOrEditModalRentalClub.js) | 29 | 10 |
| [tenant.views.crs.vouchers.receipts.createOrEditModal](../../../readable/controllers/C1419--tenant.views.crs.vouchers.receipts.createOrEditModal.js) | 49 | 25 |
| [tenant.views.crs.vouchers.invoices.printTemplates.printPreview](../../../readable/controllers/C1359--tenant.views.crs.vouchers.invoices.printTemplates.printPreview.js) | 6 | 0 |
| [tenant.views.crs.vouchers.invoices.attachReceiptModal](../../../readable/controllers/C1312--tenant.views.crs.vouchers.invoices.attachReceiptModal.js) | 3 | 3 |
| [tenant.views.common.payments.emailLinkToCharge](../../../readable/controllers/C0410--tenant.views.common.payments.emailLinkToCharge.js) | 4 | 2 |
| [tenant.views.crs.accounting.journal.viewModal](../../../readable/controllers/C0499--tenant.views.crs.accounting.journal.viewModal.js) | 7 | 2 |
| [tenant.views.common.payments.silentPayment](../../../readable/controllers/C0412--tenant.views.common.payments.silentPayment.js) | 2 | 3 |
| [tenant.views.crs.vouchers.invoices.advanceTaxAllocationModal](../../../readable/controllers/C1310--tenant.views.crs.vouchers.invoices.advanceTaxAllocationModal.js) | 8 | 4 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.vouchers.common.rejectReason](../../../readable/controllers/C1256--tenant.views.crs.vouchers.common.rejectReason.js) | 2 | 0 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.vouchers.invoices.uploadDocumentsModal](../../../readable/controllers/C1355--tenant.views.crs.vouchers.invoices.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.invoices.allocationsViewModel](../../../readable/controllers/C1311--tenant.views.crs.vouchers.invoices.allocationsViewModel.js) | 4 | 1 |
| [tenant.views.crs.vouchers.invoices.changeChargesModal](../../../readable/controllers/C1313--tenant.views.crs.vouchers.invoices.changeChargesModal.js) | 6 | 0 |
| [tenant.views.crs.vouchers.invoices.searchTripModal](../../../readable/controllers/C1352--tenant.views.crs.vouchers.invoices.searchTripModal.js) | 3 | 1 |
| [tenant.views.crs.vouchers.invoices.searchandAddMultipleTripsModal](../../../readable/controllers/C1351--tenant.views.crs.vouchers.invoices.searchandAddMultipleTripsModal.js) | 5 | 3 |
| [tenant.views.crs.vouchers.invoices.previewMergeInvoiceModal](../../../readable/controllers/C1339--tenant.views.crs.vouchers.invoices.previewMergeInvoiceModal.js) | 11 | 1 |
| [tenant.views.crs.vouchers.invoices.previewSingleInvoiceModal](../../../readable/controllers/C1340--tenant.views.crs.vouchers.invoices.previewSingleInvoiceModal.js) | 9 | 1 |
| [tenant.views.crs.vouchers.invoices.addMissingFineModal](../../../readable/controllers/C1309--tenant.views.crs.vouchers.invoices.addMissingFineModal.js) | 8 | 5 |
| [tenant.views.crs.limousine.trips.viewTripModal](../../../readable/controllers/C0937--tenant.views.crs.limousine.trips.viewTripModal.js) | 15 | 4 |
| [tenant.views.crs.limousine.trips.logTripModal](../../../readable/controllers/C0927--tenant.views.crs.limousine.trips.logTripModal.js) | 3 | 1 |
| [tenant.views.crs.vouchers.receipts.uploadDocumentsModal](../../../readable/controllers/C1430--tenant.views.crs.vouchers.receipts.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.receipts.printTemplates.printPreview](../../../readable/controllers/C1433--tenant.views.crs.vouchers.receipts.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |
| [tenant.views.crs.limousine.trips.dispatchTripModal](../../../readable/controllers/C0921--tenant.views.crs.limousine.trips.dispatchTripModal.js) | 7 | 6 |
| [tenant.views.crs.limousine.trips.changeChargesModal](../../../readable/controllers/C0917--tenant.views.crs.limousine.trips.changeChargesModal.js) | 17 | 1 |
| [tenant.views.crs.limousine.trips.createLogModal](../../../readable/controllers/C0919--tenant.views.crs.limousine.trips.createLogModal.js) | 3 | 1 |
| [tenant.views.crs.limousine.trips.selectChauffeurModal](../../../readable/controllers/C0931--tenant.views.crs.limousine.trips.selectChauffeurModal.js) | 6 | 1 |
| [tenant.views.crs.limousine.trips.chargesTypeCalcDetailModal](../../../readable/controllers/C0918--tenant.views.crs.limousine.trips.chargesTypeCalcDetailModal.js) | 6 | 0 |
| [tenant.views.crs.limousine.trips.driverForcedSelectionReasonModal](../../../readable/controllers/C0922--tenant.views.crs.limousine.trips.driverForcedSelectionReasonModal.js) | 2 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.vouchers.invoices.index`: `getInvoiceTypeById`، `changePrintingWithoutLogo`، `changePrintingWithoutTollsDarb`، `dateRangeCheck`، `clearVehicle`، `searchVehicles`، `getAssetSearch`، `clearAsset`، `CurrencyFormate`، `isEnabled`، `locationPermission`، `allBranchPermission`، `getCustomerContactGroups`، `searchSaleOrigin`، `searchAgreementGroup`، `searchCustomers`، `searchSupplierContact`، `searchProjects`، `clearInsuranceCompany`، `clearSaleOrigin`، `clearProject`، `clearAgreementGroups`، `searchCustomerPopoup`، `searchUsers`، `searchUsersWithDesignation`، `clearSalesPerson`، `searchSalesPersonPopoup`، `getlocalDateTime`، `searchvehicleOwners`، `searchvehicleOwnersPopoup`، `clearVehicleOwner`، `openViewInvoiceModalSalesAgreement`، `createInvoice`، `editInvoice`، `editStockSaleInvoice`، `editLimoInvoice`، `editAdvanceTaxInvoice`، `viewInvoice`، `viewLimoInvoice`، `generateInvoices`، `generateAccessoriesInvoices`، `generateEquipmentRentalInvoices`، `generateFmsInvoices`، `generateParkingInvoices`، `generateSalikInvoices`، `generateDarbSalikInvoices`، `generateFineInvoices`، `generateLimoInvoices`، `generateLeaseInvoices`، `generateExcessKMsInvoices`، `generateEquipmentLeaseInvoices`، `generateTransportationInvoices`، `generateChauffeurInvoices`، `generateAdvanceTaxInvoices`، `generateMiscInvoices`، `generateOutOfScopeInvoices`، `generateQuatityAndPriceMiscInvoices`، `generateFuelInvoices`، `generateRecoveryInvoices`، `generateChaufferInvoices`، `generateStockSaleInvoice`، `generateRentalClubInvoices`، `generateLimoInvoice`، `dueDateFilter`، `exportToExcel`، `invoiceReceiptExportToExcel`، `chargesWiseExportToExcel`، `deleteInvoice`، `voidInvoice`، `changeInvoiceRange`، `dateRangeModelChange`، `getInvoices`، `clearCustomer`، `enterKeyPress`، `isPrintEnabled`، `printAll`، `createRecieptFromInvoice`، `openprintModal`، `openArabicPrintModal`، `openExportWordModal`، `openExportPrintToWordModal`، `attachReceiptModal`، `emailInvoice`، `emailForOtherInvoice`، `approveAllMethod`، `emailLinkToCharge`، `openJournalViewModal`، `openSilentPaymentModal`، `SendFineSMS`، `whatsAppSMSInvoiceManual`، `approveInvoices`، `unapproveInvoices`، `rounding`، `roundingforView`، `getStatus`، `allocateAdvanceTaxInvoice`، `report`، `taxReport2`، `taxReport`، `report2`، `report3`، `report4`، `getReportUrl`، `getReportUrlTwo`، `getReportUrlThree`، `openDisputed`، `markUnmarkDisputedWithReson`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.vouchers.invoices.viewModalSalesAgreementInvoice`: `localize`، `rounding`، `cancel`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `currencyAndRounding`، `uploadDocument`، `getOriginalName`، `sumPerTrip`، `moduleChanged`، `sumTaxPerTrip`، `openViewAllocationsModal`.
- وحدة `tenant.views.crs.vouchers.invoices.generateSalesAgreementModal`: `rounding`، `oneTimeCheckBoxChanged1`، `calculateCharges`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `sumPerTrip`، `sumTaxPerTrip`، `rounding`، `editTripChargesModal`، `uploadDocument`، `getOriginalName`، `searchRentalOrLeaseAgreement`، `branchTaxCode`، `getSalesAgreementById`، `setTaxPercentOnTaxCode`، `moduleChanged`، `localize`، `agreementChanged`، `cancel`، `sumAmount`، `rounding`، `totalAmount`، `changeChargesType`، `calculateTaxPerRow`، `rounding`، `sumAmountTax`، `taxAcceptedChanged`، `addRow`، `calculateCreditAndTax`، `addRowlimo`، `getlocalDateTime`، `addLimoRow`، `removeRow`، `removeLimoRow`، `onCustomerSelect`، `onClosedAgreementChange`، `searchCustomers`، `searchItems`، `searchAccounts`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `searchVehicles`، `searchCustomerPopoup`، `save`، `removeDocument`.
- وحدة `tenant.views.crs.vouchers.invoices.createOrEditLimoModal`: `rounding`، `getColspan`، `chargesTypeVoucherLineRepeat`، `sumPerTrip`، `sumTaxPerTrip`، `localize`، `rounding`، `editTripChargesModal`، `branchTaxCode`، `moduleChanged`، `localize`، `agreementChanged`، `cancel`، `calculateTaxPerRow`، `sumAmountTax`، `taxAcceptedChanged`، `addRow`، `getlocalDateTime`، `addLimoRow`، `searchAndAddMultipleTrips`، `uploadDocument`، `getOriginalName`، `searchTrips`، `tripSelected`، `removeLimoRow`، `searchCustomers`، `searchVehicles`، `searchCustomerPopoup`، `setTaxPercentOnTaxCode`، `onCustomerSelect`، `save`، `removeDocument`، `normalizeTripCharges`.
- وحدة `tenant.views.crs.vouchers.invoices.generateStockSaleInvoice`: `jobSelected`، `rounding`، `oneTimeCheckBoxChanged1`، `chargesTypeVoucherLine`، `productSelected`، `getColspan`، `chargesTypeVoucherLineRepeat`، `sumPerTrip`، `sumTaxPerTrip`، `rounding`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `editTripChargesModal`، `uploadDocument`، `getOriginalName`، `removeDocument`، `rounding`، `searchRentalOrLeaseAgreement`، `moduleChanged`، `localize`، `agreementChanged`، `cancel`، `sumAmount`، `rounding`، `totalAmount`، `calculateTaxPerRow`، `sumAmountTax`، `rounding`، `taxAcceptedChanged`، `addRow`، `addRowlimo`، `getlocalDateTime`، `addLimoRow`، `removeRow`، `removeLimoRow`، `onCustomerSelect`، `onClosedAgreementChange`، `searchCustomers`، `searchItems`، `searchAccounts`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `searchVehicles`، `searchCustomerPopoup`، `save`.
- وحدة `tenant.views.crs.vouchers.invoices.generateModal`: `searchProjects`، `projectSelected`، `emptyRentalInoiveData`، `checkSelectedInvoices`، `getlocalDateTime`، `searchCustomers`، `searchCustomerPopoup`، `clearCustomer`، `getlocalDate`، `changeMergedCheck`، `boxTicked`، `allBoxTicked`، `getInvoicingRule`، `getInvoicingType`، `cancel`، `generate`، `mergeInvoice`، `skipClosedInvoiceDue`، `getInvoicesDueToGenerate`، `showError`، `sendCaptcha`، `focusWindow`، `closeAllTabs`، `callbackOnComplete`، `clearSalesPerson`، `searchUsers`.
- وحدة `tenant.views.crs.vouchers.invoices.generateAccessoriesModal`: `getlocalDateTime`، `searchCustomers`، `searchCustomerPopoup`، `clearCustomer`، `getlocalDate`، `changeMergedCheck`، `boxTicked`، `allBoxTicked`، `getInvoicingRule`، `getInvoicingType`، `cancel`، `generate`، `mergeInvoice`، `getInvoicesDueToGenerate`، `showError`، `sendCaptcha`، `focusWindow`، `closeAllTabs`.
- وحدة `tenant.views.crs.vouchers.invoices.generateEquipmentRentalModal`: `getlocalDateTime`، `searchCustomers`، `searchCustomerPopoup`، `clearCustomer`، `customerSelected`، `getlocalDate`، `boxTicked`، `allBoxTicked`، `getInvoicingRule`، `getInvoicingType`، `cancel`، `generate`، `previewMergeInvoice`، `openViewSingleInvoiceModal`، `changeInvoiceDate`، `generateMergeInvoice`، `mergeInvoice`، `getEquipmentRentalInvoicesDueToGenerate`.
- وحدة `tenant.views.crs.vouchers.invoices.generateFmsInvoiceModal`: `getlocalDateTime`، `searchCustomers`، `searchCustomerPopoup`، `clearCustomer`، `getlocalDate`، `boxTicked`، `allBoxTicked`، `getInvoicingRule`، `getInvoicingType`، `cancel`، `generate`، `mergeInvoice`، `getInvoicesDueToGenerate`.
- وحدة `tenant.views.crs.vouchers.invoices.generateParkingModal`: `searchCustomers`، `updateContactId`، `searchCustomerPopoup`، `clearCustomer`، `searchTagNo`، `nextSearch`، `previousAgreement`، `nextAgreement`، `previousInvoice`، `finishInvoice`، `cancel`، `searchParkings`، `enterKeyPress`، `downloadTollsV3`، `callbackOnComplete`، `showError`، `closeAllTabs`.
- وحدة `tenant.views.crs.vouchers.invoices.generateSalikModal`: `searchCustomers`، `searchCustomerPopoup`، `clearCustomer`، `nextSearch`، `previousAgreement`، `nextAgreement`، `previousInvoice`، `finishInvoice`، `cancel`، `searchTolls`، `toggleAllAgreements`، `agreementTicked`، `getlocalDateTime`، `boxTicked`، `allBoxTicked`، `getInvoicingRule`، `getInvoicingType`، `enterKeyPress`، `hasSelectedAgreements`، `showError`، `closeAllTabs`.
- وحدة `tenant.views.crs.vouchers.invoices.generateDarbSalikModal`: `searchCustomers`، `getlocalDateTime`، `boxTicked`، `allBoxTicked`، `getInvoicingRule`، `getInvoicingType`، `searchCustomerPopoup`، `clearCustomer`، `nextSearch`، `previousAgreement`، `nextAgreement`، `previousInvoice`، `finishInvoice`، `cancel`، `searchTolls`، `toggleAllAgreements`، `agreementTicked`، `hasSelectedAgreements`، `showError`، `closeAllTabs`.
- وحدة `tenant.views.crs.vouchers.invoices.generateFineModal`: `getlocalDateTime`، `allBoxTicked`، `nextSearch`، `previousAgreement`، `nextAgreement`، `previousInvoice`، `finishInvoice`، `cancel`، `searchFines`، `getlocalDate`، `showFinesOnVehicleReplacement`، `ignoreFine`، `generateInvoice`، `addMissingFine`، `callbackOnComplete`، `showError`، `sendCaptcha`، `focusWindow`، `closeAllTabs`، `ok`.
- وحدة `tenant.views.crs.vouchers.invoices.generateLimoModal`: `rounding`، `getlocalDateTime`، `localize`، `getlocalDate`، `chargesChanged`، `selectUnselect`، `allBoxTicked`، `cancel`، `generate`، `searchCustomers`، `searchCustomerPopoup`، `clearCustomer`، `viewTrip`، `logTrip`، `getTripsToInvoice`.
- وحدة `tenant.views.crs.vouchers.invoices.generateLeaseModal`: `getlocalDateTime`، `getlocalDate`، `searchCustomers`، `searchCustomerPopoup`، `clearCustomer`، `boxTicked`، `allBoxTicked`، `getInvoicingRule`، `getInvoicingType`، `cancel`، `generate`، `showError`، `getLeaseInvoicesDueToGenerate`، `mergeInvoice`، `sendCaptcha`، `focusWindow`، `closeAllTabs`، `clearSalesPerson`، `searchUsers`.
- وحدة `tenant.views.crs.vouchers.invoices.generateExcessKMsModal`: `getlocalDateTime`، `getlocalDate`، `searchCustomers`، `searchCustomerPopoup`، `clearCustomer`، `getlocalDate`، `boxTicked`، `allBoxTicked`، `getInvoicingRule`، `getInvoicingType`، `startKMsChanged`، `endKMsChanged`، `cancel`، `generate`، `getInvoicesDueToGenerate`.
- وحدة `tenant.views.crs.vouchers.invoices.generateEquipmentLeaseModal`: `getlocalDateTime`، `getlocalDate`، `searchCustomers`، `searchCustomerPopoup`، `clearCustomer`، `boxTicked`، `allBoxTicked`، `getInvoicingRule`، `getInvoicingType`، `cancel`، `generate`، `getLeaseInvoicesDueToGenerate`، `mergeInvoice`، `sendCaptcha`.
- وحدة `tenant.views.crs.vouchers.invoices.generateTransportationModal`: `getlocalDateTime`، `getlocalDate`، `allBoxTicked`، `getInvoicingRule`، `getInvoicingType`، `cancel`، `generate`.
- وحدة `tenant.views.crs.vouchers.invoices.generateChauffeurModal`: `getlocalDateTime`، `searchCustomers`، `searchCustomerPopoup`، `clearCustomer`، `getlocalDate`، `allBoxTicked`، `getInvoicingRule`، `getInvoicingType`، `cancel`، `generate`، `getInvoicesDueToGenerate`.
- وحدة `tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal`: `rounding`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `searchRentalOrLeaseAgreement`، `localize`، `cancel`، `depositSelected`، `amountChanged`، `getlocalDateTime`، `branchTaxCode`، `onCustomerSelect`، `searchCustomers`، `searchAdvanceReceipts`، `searchAccounts`، `searchCustomerPopoup`، `uploadDocument`، `getOriginalName`، `save`، `calculateCreditAndTax`، `sumAmount`، `rounding`، `rounding`، `setTaxPercentOnTaxCode`، `calculateTaxPerRow`، `rounding`، `sumAmountTax`، `rounding`، `addRow`، `removeDocument`، `getVehicleMakeName`.
- وحدة `tenant.views.crs.vouchers.invoices.createOrEditModal`: `rounding`، `toggleChargesAccountMode`، `oneTimeCheckBoxChanged1`، `calculateCharges`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `sumPerTrip`، `sumTaxPerTrip`، `rounding`، `editTripChargesModal`، `uploadDocument`، `getOriginalName`، `searchRentalOrLeaseAgreement`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `moduleChanged`، `localize`، `agreementChanged`، `cancel`، `sumAmount`، `rounding`، `totalAmount`، `changeChargesType`، `calculateTaxPerRow`، `rounding`، `sumAmountTax`، `taxAcceptedChanged`، `addRow`، `calculateCreditAndTax`، `addRowlimo`، `getlocalDateTime`، `addLimoRow`، `removeRow`، `removeLimoRow`، `onCustomerSelect`، `onClosedAgreementChange`، `searchCustomers`، `searchItems`، `searchAccounts`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `searchVehicles`، `searchCustomerPopoup`، `save`، `removeDocument`.
- وحدة `tenant.views.crs.vouchers.invoices.generateOutOfScopeInvoiceModal`: `rounding`، `toggleChargesAccountMode`، `oneTimeCheckBoxChanged1`، `calculateCharges`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `sumPerTrip`، `sumTaxPerTrip`، `rounding`، `editTripChargesModal`، `uploadDocument`، `getOriginalName`، `searchRentalOrLeaseAgreement`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `moduleChanged`، `localize`، `agreementChanged`، `cancel`، `sumAmount`، `rounding`، `totalAmount`، `changeChargesType`، `calculateTaxPerRow`، `rounding`، `sumAmountTax`، `taxAcceptedChanged`، `addRow`، `calculateCreditAndTax`، `addRowlimo`، `getlocalDateTime`، `addLimoRow`، `removeRow`، `removeLimoRow`، `onCustomerSelect`، `onClosedAgreementChange`، `searchCustomers`، `searchItems`، `searchAccounts`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `searchVehicles`، `searchCustomerPopoup`، `save`، `removeDocument`.
- وحدة `tenant.views.crs.vouchers.invoices.generateFuelInvoiceModal`: `rounding`، `oneTimeCheckBoxChanged1`، `calculateCharges`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `sumPerTrip`، `sumTaxPerTrip`، `rounding`، `editTripChargesModal`، `uploadDocument`، `getOriginalName`، `searchRentalOrLeaseAgreement`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `moduleChanged`، `localize`، `agreementChanged`، `cancel`، `sumAmount`، `rounding`، `totalAmount`، `changeChargesType`، `calculateTaxPerRow`، `rounding`، `sumAmountTax`، `taxAcceptedChanged`، `addRow`، `calculateCreditAndTax`، `addRowlimo`، `getlocalDateTime`، `addLimoRow`، `removeRow`، `removeLimoRow`، `onCustomerSelect`، `onClosedAgreementChange`، `searchCustomers`، `searchItems`، `searchAccounts`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `searchVehicles`، `searchCustomerPopoup`، `save`، `removeDocument`.
- وحدة `tenant.views.crs.vouchers.invoices.createOrEditModalRentalClub`: `rounding`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `sumPerTrip`، `sumTaxPerTrip`، `rounding`، `editTripChargesModal`، `searchRentalOrLeaseAgreement`، `moduleChanged`، `localize`، `agreementChanged`، `cancel`، `sumAmount`، `calculateTaxPerRow`، `sumAmountTax`، `taxAcceptedChanged`، `addRow`، `addRowlimo`، `getlocalDateTime`، `addLimoRow`، `removeRow`، `removeLimoRow`، `onCustomerSelect`، `onClosedAgreementChange`، `searchCustomers`، `searchVehicles`، `searchCustomerPopoup`، `save`.
- وحدة `tenant.views.crs.vouchers.receipts.createOrEditModal`: `localize`، `isEnabled`، `uploadDocument`، `getOriginalName`، `billingMethodSelected`، `receiptTypeChanged`، `dateNullOrNot`، `searchAccounts`، `addRow`، `removeRow`، `searchJobs`، `getReceiptTypeName`، `contactCardSelected`، `localize`، `rounding`، `amountChanged`، `amountWithoutCommissionChanged`، `sumAmountAllocationCharges`، `insertDueAmountOnClick`، `sumAmountAllocationChargesAgreement`، `sumTotalWithAllocation`، `calculateGeneralReceiptAmount`، `getlocalDateTime`، `getlocalDate`، `cancel`، `searchCustomers`، `searchContactGeneralPayment`، `onBillingMethodChange`، `calculateCreditCardCommission`، `calculateBankTransferCommission`، `searchVehicles`، `rounding`، `onCustomerSelect`، `onCustomerSelectForAgreement`، `conversionRateChanged`، `customerCurrencyChanged`، `customerCurrencyChangedForEdit`، `sumReceiptAmount`، `autoAllocation`، `sumAmount`، `searchCustomerPopoup`، `accountChangedGeneralPayment`، `moduleChanged`، `onAgreementSelect`، `openAdvanceTaxInvoiceModal`، `save`، `removeDocument`، `saveGeneralReceipt`، `checkCurrentDate`.
- وحدة `tenant.views.crs.vouchers.invoices.printTemplates.printPreview`: `exportToPDF`، `exportToWord`، `exportPrintToWord`، `cancel`، `ok`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.invoices.attachReceiptModal`: `searchAdvanceReceipts`، `save`، `cancel`.
- وحدة `tenant.views.common.payments.emailLinkToCharge`: `isOneTimePaymentOnChange`، `send`، `cancel`، `getlocalDateTime`.
- وحدة `tenant.views.crs.accounting.journal.viewModal`: `getlocalDateTime`، `rounding`، `formatNumber`، `roundingforView`، `currencyAndRoundingWithThree`، `getVoucherType`، `cancel`.
- وحدة `tenant.views.common.payments.silentPayment`: `cancel`، `pay`.
- وحدة `tenant.views.crs.vouchers.invoices.advanceTaxAllocationModal`: `cancel`، `rounding`، `customRound`، `localize`، `getInvoiceTypeById`، `sumAmount`، `save`، `deleteReversal`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.vouchers.common.rejectReason`: `cancel`، `save`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.vouchers.invoices.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.allocationsViewModel`: `cancel`، `sumAmount`، `localize`، `getlocalDate`.
- وحدة `tenant.views.crs.vouchers.invoices.changeChargesModal`: `cancel`، `rounding`، `sumChargesTax`، `calculateTaxPerRow`، `getlocalDateTime`، `save`.
- وحدة `tenant.views.crs.vouchers.invoices.searchTripModal`: `searchTrips`، `save`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.searchandAddMultipleTripsModal`: `cancel`، `getlocalDateTime`، `applyChange`، `save`، `getTrips`.
- وحدة `tenant.views.crs.vouchers.invoices.previewMergeInvoiceModal`: `localize`، `rounding`، `cancel`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `currencyAndRounding`، `calculateRentWithOperator`، `calculateTaxWithOperator`، `openViewAllocationsModal`، `generateMergeInvoice`.
- وحدة `tenant.views.crs.vouchers.invoices.previewSingleInvoiceModal`: `localize`، `rounding`، `cancel`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `currencyAndRounding`، `openViewAllocationsModal`، `ok`.
- وحدة `tenant.views.crs.vouchers.invoices.addMissingFineModal`: `clearCustomer`، `searchVehicles`، `vehicleChanged`، `localize`، `searchCustomers`، `searchCustomerPopoup`، `save`، `cancel`.
- وحدة `tenant.views.crs.limousine.trips.viewTripModal`: `locationPermission`، `showDispatchButton`، `dispatchTrip`، `getTripStatus`، `getTaxCategory`، `trustSrc`، `getlocalDateTime`، `getlocalTime`، `cancel`، `getOriginalName`، `openMapUrl`، `viewCharges`، `viewLimoInvoice`، `getChecklist`، `loadContactPersonForEdit`.
- وحدة `tenant.views.crs.limousine.trips.logTripModal`: `cancel`، `getlocalDateTime`، `createLog`.
- وحدة `tenant.views.crs.vouchers.receipts.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.receipts.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.
- وحدة `tenant.views.crs.limousine.trips.dispatchTripModal`: `searchVehicles`، `searchDrivers`، `cancel`، `vehicleSelected`، `driverSelected`، `selectChauffeurPopup`، `save`.
- وحدة `tenant.views.crs.limousine.trips.changeChargesModal`: `cancel`، `rounding`، `taxCategoryChanged`، `onChangeTaxCategory`، `sumCharges`، `sumChargesTax`، `calculateCharges`، `calculateDiscountCharges`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `calculateTaxPerRow`، `calculationDetail`، `getlocalDateTime`، `markManualCharges`، `localize`، `save`، `showCalculationDetail`.
- وحدة `tenant.views.crs.limousine.trips.createLogModal`: `cancel`، `getlocalDateTime`، `save`.
- وحدة `tenant.views.crs.limousine.trips.selectChauffeurModal`: `getChauffeurQueue`، `changeBranchDriver`، `redButtonClicked`، `openViewTripModal`، `cancel`، `contactSelected`.
- وحدة `tenant.views.crs.limousine.trips.chargesTypeCalcDetailModal`: `rounding`، `calculateTotalFare`، `calculateChargesPerRow`، `localize`، `cancel`، `save`.
- وحدة `tenant.views.crs.limousine.trips.driverForcedSelectionReasonModal`: `ok`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L250199) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L357746) |
| `abp.services.app.depreciationSummary.getAssetSearch` | POST | api/services/app/depreciationSummary/GetAssetSearch | [المصدر](../../../raw/application.js#L357755) |
| `abp.services.app.contactGroup.getContactGroupsOnContactType` | POST | api/services/app/contactGroup/GetContactGroupsOnContactType | [المصدر](../../../raw/application.js#L183448) |
| `abp.services.app.saleOrigin.getSaleOrigins` | POST | api/services/app/saleOrigin/GetSaleOrigins | [المصدر](../../../raw/application.js#L357847) |
| `abp.services.app.agreementGroup.getAgreementGroups` | POST | api/services/app/agreementGroup/GetAgreementGroups | [المصدر](../../../raw/application.js#L357854) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L342377) |
| `abp.services.app.directory.searchByContactGroup` | POST | api/services/app/directory/SearchByContactGroup | [المصدر](../../../raw/application.js#L387360) |
| `abp.services.app.customerProject.getCustomerProject` | POST | api/services/app/customerProject/GetCustomerProject | [المصدر](../../../raw/application.js#L351697) |
| `abp.services.app.directory.searchSalesPerson` | POST | api/services/app/directory/SearchSalesPerson | [المصدر](../../../raw/application.js#L357936) |
| `abp.services.app.invoiceSearch.exportToExcel` | POST | api/services/app/invoiceSearch/ExportToExcel | [المصدر](../../../raw/application.js#L358685) |
| `abp.services.app.invoiceSearch.invoiceReceiptExportToExcel` | POST | api/services/app/invoiceSearch/InvoiceReceiptExportToExcel | [المصدر](../../../raw/application.js#L358723) |
| `abp.services.app.invoiceSearch.chargesWiseExportToExcel` | POST | api/services/app/invoiceSearch/ChargesWiseExportToExcel | [المصدر](../../../raw/application.js#L358762) |
| `abp.services.app.invoice.deleteInvoice` | POST | api/services/app/invoice/DeleteInvoice | [المصدر](../../../raw/application.js#L358775) |
| `abp.services.app.invoice.voidInvoice` | POST | api/services/app/invoice/VoidInvoice | [المصدر](../../../raw/application.js#L358792) |
| `abp.services.app.invoiceSearch.getInvoices` | POST | api/services/app/invoiceSearch/GetInvoices | [المصدر](../../../raw/application.js#L358890) |
| `abp.services.app.invoiceEmail.emailTrafficFineNotice` | POST | api/services/app/invoiceEmail/EmailTrafficFineNotice | [المصدر](../../../raw/application.js#L359292) |
| `abp.services.app.invoiceEmail.emailInvoice` | POST | api/services/app/invoiceEmail/EmailInvoice | [المصدر](../../../raw/application.js#L359307) |
| `abp.services.app.invoice.approveInvoices` | POST | api/services/app/invoice/ApproveInvoices | [المصدر](../../../raw/application.js#L359325) |
| `abp.services.app.invoiceSMS.sMSTrafficFineNotice` | POST | api/services/app/invoiceSMS/SMSTrafficFineNotice | [المصدر](../../../raw/application.js#L359410) |
| `abp.services.app.invoiceSMS.sMSWhatsAppManualNotice` | POST | api/services/app/invoiceSMS/SMSWhatsAppManualNotice | [المصدر](../../../raw/application.js#L359425) |
| `abp.services.app.invoice.approveInvoice` | POST | api/services/app/invoice/ApproveInvoice | [المصدر](../../../raw/application.js#L359442) |
| `abp.services.app.invoice.unApproveInvoice` | POST | api/services/app/invoice/UnApproveInvoice | [المصدر](../../../raw/application.js#L359458) |
| `abp.services.app.invoice.markUnmarkDisputed` | POST | api/services/app/invoice/MarkUnmarkDisputed | [المصدر](../../../raw/application.js#L359697) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L182597) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L350534) |
| `abp.services.app.asset.getAssetForEdit` | POST | api/services/app/asset/GetAssetForEdit | [المصدر](../../../raw/application.js#L365537) |
| `abp.services.app.limoTrip.getInvoiceTrips` | POST | api/services/app/limoTrip/GetInvoiceTrips | [المصدر](../../../raw/application.js#L345484) |
| `abp.services.app.invoiceSearch.getSalesAgreementInvoiceForView` | POST | api/services/app/invoiceSearch/GetSalesAgreementInvoiceForView | [المصدر](../../../raw/application.js#L365597) |
| `abp.services.app.commonLookup.searchAgreementByNoForInvoice` | POST | api/services/app/commonLookup/SearchAgreementByNoForInvoice | [المصدر](../../../raw/application.js#L349574) |
| `abp.services.app.commonLookup.getLocationById` | POST | api/services/app/commonLookup/GetLocationById | [المصدر](../../../raw/application.js#L248205) |
| `abp.services.app.salesAgreement.getSalesAgreementForEdit` | POST | api/services/app/salesAgreement/GetSalesAgreementForEdit | [المصدر](../../../raw/application.js#L346763) |
| `abp.services.app.commonAgreement.getOpenAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetOpenAgreementsOnCustomer | [المصدر](../../../raw/application.js#L345342) |
| `abp.services.app.commonAgreement.getClosedAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetClosedAgreementsOnCustomer | [المصدر](../../../raw/application.js#L345345) |
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L350242) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L387046) |
| `abp.services.app.invoice.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L350291) |
| `abp.services.app.invoice.createOrUpdateInvoice` | POST | api/services/app/invoice/CreateOrUpdateInvoice | [المصدر](../../../raw/application.js#L345457) |
| `abp.services.app.salesAgreement.attachInvoiceIdWithInstallment` | POST | [object Object] | [المصدر](../../../raw/application.js#L355500) |
| `abp.services.app.chargesSetting.getConfiguredChargesTypes` | POST | api/services/app/chargesSetting/GetConfiguredChargesTypes | [المصدر](../../../raw/application.js#L387052) |
| `abp.services.app.invoice.getInvoiceForEdit` | POST | api/services/app/invoice/GetInvoiceForEdit | [المصدر](../../../raw/application.js#L345517) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L364723) |
| `abp.services.app.commonLookup.searchTripsForInvoice` | POST | api/services/app/commonLookup/SearchTripsForInvoice | [المصدر](../../../raw/application.js#L364764) |
| `abp.services.app.invoice.getLimoInvoiceForEdit` | POST | api/services/app/invoice/GetLimoInvoiceForEdit | [المصدر](../../../raw/application.js#L343500) |
| `abp.services.app.commonLookup.searchRentalOrLeaseAgreement` | POST | api/services/app/commonLookup/SearchRentalOrLeaseAgreement | [المصدر](../../../raw/application.js#L344998) |
| `abp.services.app.invoice.createOrUpdateStockSaleInvoice` | POST | api/services/app/invoice/CreateOrUpdateStockSaleInvoice | [المصدر](../../../raw/application.js#L357116) |
| `abp.services.app.invoice.generateInvoices` | POST | api/services/app/invoice/GenerateInvoices | [المصدر](../../../raw/application.js#L347098) |
| `abp.services.app.invoiceDue.ignoreInvoiceDueToGenerate` | POST | [object Object] | [المصدر](../../../raw/application.js#L352067) |
| `abp.services.app.invoiceDue.getInvoicesDueToGenerate` | POST | api/services/app/invoiceDue/GetInvoicesDueToGenerate | [المصدر](../../../raw/application.js#L347138) |
| `abp.services.app.toll.prepareDataForExtension` | POST | api/services/app/toll/PrepareDataForExtension | [المصدر](../../../raw/application.js#L350910) |
| `abp.services.app.trafficFile.getTrafficFiles` | POST | api/services/app/trafficFile/GetTrafficFiles | [المصدر](../../../raw/application.js#L351011) |
| `abp.services.app.masterAgreement.getMasterAgreementsByCustomer` | POST | api/services/app/masterAgreement/GetMasterAgreementsByCustomer | [المصدر](../../../raw/application.js#L347986) |
| `abp.services.app.invoice.generateEquipmentInvoices` | POST | api/services/app/invoice/GenerateEquipmentInvoices | [المصدر](../../../raw/application.js#L347865) |
| `abp.services.app.invoice.previewEquipmentMergeInvoice` | POST | api/services/app/invoice/PreviewEquipmentMergeInvoice | [المصدر](../../../raw/application.js#L360304) |
| `abp.services.app.invoice.previewEquipmentSingleInvoice` | POST | api/services/app/invoice/PreviewEquipmentSingleInvoice | [المصدر](../../../raw/application.js#L360435) |
| `abp.services.app.invoice.createEquipmentMergedInvoice` | POST | api/services/app/invoice/CreateEquipmentMergedInvoice | [المصدر](../../../raw/application.js#L348300) |
| `abp.services.app.invoiceDue.getEquipmentInvoicesDueToGenerate` | POST | api/services/app/invoiceDue/GetEquipmentInvoicesDueToGenerate | [المصدر](../../../raw/application.js#L348355) |
| `abp.services.app.invoice.getFmsInvoicesDueToGenerate` | POST | api/services/app/invoice/GetFmsInvoicesDueToGenerate | [المصدر](../../../raw/application.js#L349367) |
| `abp.services.app.parkingTicket.getSearchTagNo` | POST | api/services/app/parkingTicket/GetSearchTagNo | [المصدر](../../../raw/application.js#L353943) |
| `abp.services.app.parkingTicket.getCRSParkingTicketsforInvoice` | POST | api/services/app/parkingTicket/GetCRSParkingTicketsforInvoice | [المصدر](../../../raw/application.js#L354038) |
| `abp.services.app.parkingTicket.processParkingTickets` | POST | api/services/app/parkingTicket/ProcessParkingTickets | [المصدر](../../../raw/application.js#L354057) |
| `abp.services.app.invoice.generateParkingInvoices` | POST | api/services/app/invoice/GenerateParkingInvoices | [المصدر](../../../raw/application.js#L354096) |
| `abp.services.app.invoice.generateMergeParkingInvoice` | POST | api/services/app/invoice/GenerateMergeParkingInvoice | [المصدر](../../../raw/application.js#L354121) |
| `abp.services.app.toll.getPendingTollsToInvoice` | POST | api/services/app/toll/GetPendingTollsToInvoice | [المصدر](../../../raw/application.js#L347402) |
| `abp.services.app.toll.processTolls` | POST | api/services/app/toll/ProcessTolls | [المصدر](../../../raw/application.js#L347417) |
| `abp.services.app.invoice.generateTollInvoices` | POST | api/services/app/invoice/GenerateTollInvoices | [المصدر](../../../raw/application.js#L347493) |
| `abp.services.app.invoice.generateMergeTollInvoice` | POST | api/services/app/invoice/GenerateMergeTollInvoice | [المصدر](../../../raw/application.js#L347529) |
| `abp.services.app.uaeFine.processFines` | POST | api/services/app/uaeFine/ProcessFines | [المصدر](../../../raw/application.js#L348778) |
| `abp.services.app.uaeFine.getPendingFines` | POST | api/services/app/uaeFine/GetPendingFines | [المصدر](../../../raw/application.js#L348860) |
| `abp.services.app.uaeFine.ignoreFine` | POST | api/services/app/uaeFine/IgnoreFine | [المصدر](../../../raw/application.js#L348885) |
| `abp.services.app.invoice.generateFineInvoices` | POST | api/services/app/invoice/GenerateFineInvoices | [المصدر](../../../raw/application.js#L348911) |
| `abp.services.app.invoice.generateLimoInvoices` | POST | api/services/app/invoice/GenerateLimoInvoices | [المصدر](../../../raw/application.js#L351440) |
| `abp.services.app.limoTrip.getTripsDueToInvoice` | POST | api/services/app/limoTrip/GetTripsDueToInvoice | [المصدر](../../../raw/application.js#L351528) |
| `abp.services.app.invoice.generateExcessKMsInvoices` | POST | api/services/app/invoice/GenerateExcessKMsInvoices | [المصدر](../../../raw/application.js#L348566) |
| `abp.services.app.invoiceDue.getExcessKMInvoicesDueToGenerate` | POST | api/services/app/invoiceDue/GetExcessKMInvoicesDueToGenerate | [المصدر](../../../raw/application.js#L348608) |
| `abp.services.app.invoice.generateTransportationInvoices` | POST | api/services/app/invoice/GenerateTransportationInvoices | [المصدر](../../../raw/application.js#L357350) |
| `abp.services.app.invoice.getTransportationInvoicesDueToGenerate` | POST | api/services/app/invoice/GetTransportationInvoicesDueToGenerate | [المصدر](../../../raw/application.js#L357376) |
| `abp.services.app.receipt.getAdvanceReceipts` | POST | api/services/app/receipt/GetAdvanceReceipts | [المصدر](../../../raw/application.js#L342638) |
| `abp.services.app.receipt.getAdvanceTaxReceipt` | POST | [object Object] | [المصدر](../../../raw/application.js#L346361) |
| `abp.services.app.invoice.createOrUpdateAdvanceTaxInvoice` | POST | api/services/app/invoice/CreateOrUpdateAdvanceTaxInvoice | [المصدر](../../../raw/application.js#L346448) |
| `abp.services.app.vehicleModel.getVehicleModels` | POST | api/services/app/vehicleModel/GetVehicleModels | [المصدر](../../../raw/application.js#L346739) |
| `abp.services.app.salesQuotation.getQuotationForEdit` | POST | api/services/app/salesQuotation/GetQuotationForEdit | [المصدر](../../../raw/application.js#L346820) |
| `abp.services.app.account.getAccount` | POST | api/services/app/account/GetAccount | [المصدر](../../../raw/application.js#L346904) |
| `abp.services.app.commonAgreement.getAllAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetAllAgreementsOnCustomer | [المصدر](../../../raw/application.js#L388011) |
| `abp.services.app.billingMethod.getDefaultCreditCard` | POST | api/services/app/billingMethod/GetDefaultCreditCard | [المصدر](../../../raw/application.js#L386977) |
| `abp.services.app.commonLookup.getContactCards` | POST | api/services/app/commonLookup/GetContactCards | [المصدر](../../../raw/application.js#L386984) |
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L387128) |
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L387454) |
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L183468) |
| `abp.services.app.allocation.getAllocationsForEdit` | POST | api/services/app/allocation/GetAllocationsForEdit | [المصدر](../../../raw/application.js#L342553) |
| `abp.services.app.allocation.getAllocationsForReceiptBaseOnAgreement` | POST | api/services/app/allocation/GetAllocationsForReceiptBaseOnAgreement | [المصدر](../../../raw/application.js#L387554) |
| `abp.services.app.commonLookup.getBankAccountsForSelection` | POST | api/services/app/commonLookup/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L387571) |
| `abp.services.app.commonLookup.getCurrencies` | POST | api/services/app/commonLookup/GetCurrencies | [المصدر](../../../raw/application.js#L388216) |
| `abp.services.app.receiptChargesAllocation.getReceiptChargesAllocationsForAgreementEdit` | POST | api/services/app/receiptChargesAllocation/GetReceiptChargesAllocationsForAgreementEdit | [المصدر](../../../raw/application.js#L387987) |
| `abp.services.app.receiptSearch.getReceiptForEdit` | POST | api/services/app/receiptSearch/GetReceiptForEdit | [المصدر](../../../raw/application.js#L388043) |
| `abp.services.app.commonAgreement.getAgreement` | POST | api/services/app/commonAgreement/GetAgreement | [المصدر](../../../raw/application.js#L388176) |
| `abp.services.app.receipt.createOrUpdateReceipt` | POST | api/services/app/receipt/CreateOrUpdateReceipt | [المصدر](../../../raw/application.js#L388363) |
| `abp.services.app.receipt.createOrUpdateReceiptWithCharge` | POST | api/services/app/receipt/CreateOrUpdateReceiptWithCharge | [المصدر](../../../raw/application.js#L388423) |
| `abp.services.app.receipt.createOrUpdateReceiptPayment` | POST | api/services/app/receipt/CreateOrUpdateReceiptPayment | [المصدر](../../../raw/application.js#L388555) |
| `abp.services.app.invoice.addReceiptToAdvanceTaxInvoice` | POST | api/services/app/invoice/AddReceiptToAdvanceTaxInvoice | [المصدر](../../../raw/application.js#L342650) |
| `abp.services.app.invoiceSearch.getInvoiceForView` | POST | api/services/app/invoiceSearch/GetInvoiceForView | [المصدر](../../../raw/application.js#L342664) |
| `abp.services.app.booking.sendEmailForBookingPayment` | POST | api/services/app/booking/SendEmailForBookingPayment | [المصدر](../../../raw/application.js#L102751) |
| `abp.services.app.invoice.sendEmailForInvoicePayment` | POST | api/services/app/invoice/SendEmailForInvoicePayment | [المصدر](../../../raw/application.js#L102761) |
| `abp.services.app.journal.getJournalViewForMulticurrency` | POST | api/services/app/journal/GetJournalViewForMulticurrency | [المصدر](../../../raw/application.js#L126727) |
| `abp.services.app.journal.getJournalView` | POST | api/services/app/journal/GetJournalView | [المصدر](../../../raw/application.js#L126740) |
| `abp.services.app.booking.silentPayment` | POST | api/services/app/booking/SilentPayment | [المصدر](../../../raw/application.js#L102934) |
| `abp.services.app.invoice.silentPayment` | POST | api/services/app/invoice/SilentPayment | [المصدر](../../../raw/application.js#L102942) |
| `abp.services.app.rentalQuotation.silentPayment` | POST | api/services/app/rentalQuotation/SilentPayment | [المصدر](../../../raw/application.js#L102957) |
| `abp.services.app.invoice.allocateInvoicesToAdvanceTaxInvoice` | POST | api/services/app/invoice/AllocateInvoicesToAdvanceTaxInvoice | [المصدر](../../../raw/application.js#L342505) |
| `abp.services.app.invoice.deleteAdvanceTaxInvoiceAllocation` | POST | api/services/app/invoice/DeleteAdvanceTaxInvoiceAllocation | [المصدر](../../../raw/application.js#L342522) |
| `abp.services.app.invoice.getAlreadyAllocatedDetails` | POST | api/services/app/invoice/GetAlreadyAllocatedDetails | [المصدر](../../../raw/application.js#L342539) |
| `abp.services.app.chargesSetting.getChargesTypes` | POST | api/services/app/chargesSetting/GetChargesTypes | [المصدر](../../../raw/application.js#L182581) |
| `abp.services.app.directory.searchSalesPersonOne` | POST | api/services/app/directory/SearchSalesPersonOne | [المصدر](../../../raw/application.js#L182778) |
| `abp.services.app.commonLookup.searchCustomLookups` | POST | api/services/app/commonLookup/SearchCustomLookups | [المصدر](../../../raw/application.js#L182861) |
| `abp.services.app.commonLookup.getCustomLookups` | POST | api/services/app/commonLookup/GetCustomLookups | [المصدر](../../../raw/application.js#L182869) |
| `abp.services.app.country.searchCountries` | POST | api/services/app/country/SearchCountries | [المصدر](../../../raw/application.js#L183560) |
| `abp.services.app.person.createOrUpdatePerson` | POST | api/services/app/person/CreateOrUpdatePerson | [المصدر](../../../raw/application.js#L183236) |
| `abp.services.app.taxCode.getTaxCodes` | POST | api/services/app/taxCode/GetTaxCodes | [المصدر](../../../raw/application.js#L183456) |
| `abp.services.app.tariffCard.getActiveTariffCards` | POST | api/services/app/tariffCard/GetActiveTariffCards | [المصدر](../../../raw/application.js#L183703) |
| `abp.services.app.tariffCard.getTariffCardById` | POST | api/services/app/tariffCard/GetTariffCardById | [المصدر](../../../raw/application.js#L183716) |
| `abp.services.app.person.getAdvanceSettings` | POST | api/services/app/person/GetAdvanceSettings | [المصدر](../../../raw/application.js#L183744) |
| `abp.services.app.person.getHighLightBlackListCountry` | POST | [object Object] | [المصدر](../../../raw/application.js#L183768) |
| `abp.services.app.person.getNationalIdFormate` | POST | [object Object] | [المصدر](../../../raw/application.js#L183774) |
| `abp.services.app.person.getPersonForEdit` | POST | api/services/app/person/GetPersonForEdit | [المصدر](../../../raw/application.js#L183903) |
| `abp.services.app.person.getContactCards` | POST | api/services/app/person/GetContactCards | [المصدر](../../../raw/application.js#L184004) |
| `abp.services.app.commonLookup.validateCreditLimit` | POST | api/services/app/commonLookup/ValidateCreditLimit | [المصدر](../../../raw/application.js#L184099) |
| `abp.services.app.allocation.getAllocations` | POST | api/services/app/allocation/GetAllocations | [المصدر](../../../raw/application.js#L342588) |
| `abp.services.app.commonLookup.getTripTypes` | POST | api/services/app/commonLookup/GetTripTypes | [المصدر](../../../raw/application.js#L364730) |
| `abp.services.app.limoTripSearch.searchTripsToInvoice` | POST | api/services/app/limoTripSearch/SearchTripsToInvoice | [المصدر](../../../raw/application.js#L364738) |
| `abp.services.app.trafficFine.getMovementOnVehicle` | POST | api/services/app/trafficFine/GetMovementOnVehicle | [المصدر](../../../raw/application.js#L342313) |
| `abp.services.app.customer.getSurcharge` | POST | [object Object] | [المصدر](../../../raw/application.js#L342333) |
| `abp.services.app.trafficFine.createOrUpdateTrafficFine` | POST | api/services/app/trafficFine/CreateOrUpdateTrafficFine | [المصدر](../../../raw/application.js#L342413) |
| `abp.services.app.limoTripSearch.getCheckList` | POST | api/services/app/limoTripSearch/GetCheckList | [المصدر](../../../raw/application.js#L254901) |
| `abp.services.app.limoTrip.getContactPersonsByCustomer` | POST | [object Object] | [المصدر](../../../raw/application.js#L254908) |
| `abp.services.app.directory.getContactInfo` | POST | api/services/app/directory/GetContactInfo | [المصدر](../../../raw/application.js#L254924) |
| `abp.services.app.limoTripSearch.getTripForView` | POST | api/services/app/limoTripSearch/GetTripForView | [المصدر](../../../raw/application.js#L254937) |
| `abp.services.app.limoTrip.getTripLogs` | POST | api/services/app/limoTrip/GetTripLogs | [المصدر](../../../raw/application.js#L252999) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |
| `abp.services.app.directory.searchStaff` | POST | api/services/app/directory/SearchStaff | [المصدر](../../../raw/application.js#L250208) |
| `abp.services.app.limoTrip.getStaffShiftByVehicleOrDriver` | POST | api/services/app/limoTrip/GetStaffShiftByVehicleOrDriver | [المصدر](../../../raw/application.js#L250237) |
| `abp.services.app.limoTrip.dispatchTrip` | POST | api/services/app/limoTrip/DispatchTrip | [المصدر](../../../raw/application.js#L250311) |
| `abp.services.app.limoTrip.getTripForEdit` | POST | api/services/app/limoTrip/GetTripForEdit | [المصدر](../../../raw/application.js#L250326) |
| `abp.services.app.limoTrip.addTripLog` | POST | api/services/app/limoTrip/AddTripLog | [المصدر](../../../raw/application.js#L248566) |
| `abp.services.app.limoTrip.getChauffeurQueue` | POST | api/services/app/limoTrip/GetChauffeurQueue | [المصدر](../../../raw/application.js#L253836) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.AgreementGroups`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.AgreementAdditionalCharges`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AgreementAdditionalChargesAfterClosing`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.EmailLinkToCharge`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.ChargeCard`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Accounts.Journal`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.Approve`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.CanApproveOtherBranchInvoices`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.UnApprove`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.Void`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.ExportToExcel`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.ExportToWord`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.ExportPrintToWord`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.ChargesWiseExportToExcel`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.ExportToExcelInvoiceReceipt`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.AllActionsOnOtherBranchInvoices`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.ViewOtherBranchInvoices`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.CreateReceiptFromInvoice`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.MarkDisputed`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.UnmarkDisputed`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Assets.Assets`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.Addnew.CanBulkGenerateForAnyAsOfDate`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.Addnew.CanBulkGenerateForIndividuals`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.Addnew.CanBulkGenerateForCompanies`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.Addnew.CanBulkGenerateBySalesPersonFilter`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.ChangeCharges`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.ViewOtherBranchTrips`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.AllActionsOnOtherBranchTrips`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesAgreement.GenerateDownPaymentReceipt`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesQuotation.GenerateDownPaymentReceipt`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.MultiModalMiscInvoices`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.AllActionsOnOtherBranchReceipts`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Allocations`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.CanChangeDate`: ممنوحة في السياق الملتقط.
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
- صلاحية `Pages.Tenant.Limousine.Trips.Dispatch`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.CanViewCharges`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.CustomerWebApp`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.CanSelectOtherGroupsVehicleOnDispatchment`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.invoiceRange` | checkbox | invoiceRange |  |
| `vm.filters.voucherNo` | text |  |  |
| `vm.filters.invoiceFrom` | number |  |  |
| `vm.filters.invoiceRange` | checkbox | invoiceRange |  |
| `vm.filters.invoiceTo` | number |  |  |
| `vm.filters.agreementNo` | text |  |  |
| `vm.filters.invoiceType` | ui-select |  |  |
| `vm.filters.invoiceType` | ui-select |  |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.dueDateRange` | checkbox | showOnlyDueInvoices |  |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.status` | select |  | ng-options=status.id as status.name for status in vm.statuses |
| `vm.filters.status` | select |  | ng-options=status.id as status.name for status in vm.statuses |
| `vm.filters.vehicle` | ui-select |  |  |
| `vm.filters.vehicleOwnership` | select | ownership | ng-options=ownership.value as ownership.key for ownership in vm.rentalAgreementOwnerships |
| `vm.filters.vehicleOwner` | ui-select |  |  |
| `vm.filters.salesPerson` | ui-select |  |  |
| `vm.filters.salesPerson` | select | salePerson | ng-options=status as status.name for status in vm.userList |
| `vm.filters.contactCategory` | select | account | ng-options=item.id as item.name for item in vm.contactCategories |
| `vm.filters.jobNo` | text |  |  |
| `vm.filters.invoiceDueDate` | select |  | ng-options=dueDate.id as dueDate.name for dueDate in vm.invoiceDueDate |
| `vm.filters.masterAgreementNo` | text |  |  |
| `vm.filters.manualAgreementNo` | text |  |  |
| `vm.filters.agreementType` | select | agreementType | ng-options=item.id as item.type for item in vm.agreementTypes |
| `vm.filters.agreementStatus` | select |  | ng-options=agreementStatus.id as agreementStatus.name for agreementStatus in vm.agreementStatus |
| `vm.filters.agreementGroupId` | select |  | ng-options=ag.id as ag.name for ag in vm.agreementGroups |
| `vm.filters.module` | text | module | ng-options=module.id as module.name for module in vm.modules |
| `vm.filters.customerContact` | ui-select |  |  |
| `vm.filters.insuranceCompany` | ui-select |  |  |
| `vm.filters.insuranceClaimNo` | text |  |  |
| `vm.filters.approvedType` | text | invoiceType | ng-options=approvedType.id as approvedType.name for approvedType in vm.approvedTypes |
| `vm.filters.asset` | ui-select |  |  |
| `vm.filters.vip` | select | vip | ng-options=vip.value as vip.key for vip in vm.vipCustomer |
| `vm.filters.saleOrigin` | ui-select |  |  |
| `vm.filters.projectName` | ui-select |  |  |
| `vm.filters.customProject` | text |  |  |
| `vm.filters.limoCustomField1` | text |  |  |
| `vm.filters.creditInvoice` | checkbox | creditInvoice |  |
| `vm.filters.isDisputed` | checkbox | disputedOnly |  |
| `vm.filters.printingWithoutLogo` | checkbox | printingWithoutLogo |  |
| `vm.filters.printingWithoutTollsDarb` | checkbox | printingWithoutTollsDarb |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
