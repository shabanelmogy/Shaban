# شاشة: Accidents

المسار في القائمة: Fleet ← Accidents.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_accident`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0676](../../../readable/routes/R0676--tenant-crs-accident.js)، والأصل [raw/application.js:6695](../../../raw/application.js#L6695).
- قالب الشاشة: `~/App/tenant/views/crs/accidents/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.accidents.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.accidents.index](../../../readable/controllers/C0468--tenant.views.crs.accidents.index.js) | 18 | 4 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.accidents.viewModal](../../../readable/controllers/C0470--tenant.views.crs.accidents.viewModal.js) | 7 | 1 |
| [tenant.views.crs.accidents.createModal](../../../readable/controllers/C0465--tenant.views.crs.accidents.createModal.js) | 14 | 5 |
| [tenant.views.crs.accidents.editModal](../../../readable/controllers/C0466--tenant.views.crs.accidents.editModal.js) | 10 | 3 |
| [tenant.views.crs.accidents.createCDWInvoiceModal](../../../readable/controllers/C0464--tenant.views.crs.accidents.createCDWInvoiceModal.js) | 23 | 8 |
| [tenant.views.crs.accidents.excessChargesInfoModal](../../../readable/controllers/C0467--tenant.views.crs.accidents.excessChargesInfoModal.js) | 1 | 0 |
| [tenant.views.crs.vouchers.invoices.viewModal](../../../readable/controllers/C1357--tenant.views.crs.vouchers.invoices.viewModal.js) | 14 | 5 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.crs.vouchers.invoices.uploadDocumentsModal](../../../readable/controllers/C1355--tenant.views.crs.vouchers.invoices.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.invoices.allocationsViewModel](../../../readable/controllers/C1311--tenant.views.crs.vouchers.invoices.allocationsViewModel.js) | 4 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.accidents.index`: `dateRangeModelChanged`، `getlocalDate`، `getFaultValue`، `getMovementType`، `localize`، `searchVehicles`، `clearVehicle`، `searchDrivers`، `clearDriver`، `getInvoiceStatus`، `report`، `getAccidents`، `viewAccidentRecord`، `createCDWInvoice`، `driverAgeRangeChanged`، `addAccidentRecord`، `editAccidentRecord`، `deleteAccidentRecord`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.accidents.viewModal`: `cancel`، `getlocalDate`، `getMovementType`، `getChargingType`، `openExcessChargesInfoModal`، `openViewInvoiceModal`، `isDocument`.
- وحدة `tenant.views.crs.accidents.createModal`: `cancel`، `getlocalDate`، `getMovementType`، `searchVehicles`، `searchVehiclePopup`، `openExcessChargesInfoModal`، `isDocument`، `openUploadImage`، `openUploadDocument`، `getChargingType`، `isPoliceReportChanged`، `getExcessCharges`، `getAccidentMovement`، `save`.
- وحدة `tenant.views.crs.accidents.editModal`: `cancel`، `getlocalDate`، `getMovementType`، `openExcessChargesInfoModal`، `isDocument`، `openUploadImage`، `openUploadDocument`، `getChargingType`، `getExcessCharges`، `save`.
- وحدة `tenant.views.crs.accidents.createCDWInvoiceModal`: `rounding`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `sumPerTrip`، `sumTaxPerTrip`، `rounding`، `searchRentalOrLeaseAgreement`، `moduleChanged`، `localize`، `agreementChanged`، `cancel`، `sumAmount`، `calculateTaxPerRow`، `sumAmountTax`، `calculateCreditAndTax`، `taxAcceptedChanged`، `addRow`، `getlocalDateTime`، `removeRow`، `searchVehicles`، `save`، `agreementCategory`.
- وحدة `tenant.views.crs.accidents.excessChargesInfoModal`: `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.viewModal`: `localize`، `rounding`، `cancel`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `currencyAndRounding`، `roundingforView`، `uploadDocument`، `getOriginalName`، `sumPerTrip`، `moduleChanged`، `sumTaxPerTrip`، `openViewAllocationsModal`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.allocationsViewModel`: `cancel`، `sumAmount`، `localize`، `getlocalDate`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L312838) |
| `abp.services.app.directory.searchPersonStaffCustomer` | POST | api/services/app/directory/SearchPersonStaffCustomer | [المصدر](../../../raw/application.js#L119971) |
| `abp.services.app.accident.getAccidents` | POST | api/services/app/accident/GetAccidents | [المصدر](../../../raw/application.js#L120161) |
| `abp.services.app.accident.deleteAccident` | POST | api/services/app/accident/DeleteAccident | [المصدر](../../../raw/application.js#L120289) |
| `abp.services.app.accident.getAccidentForView` | POST | api/services/app/accident/GetAccidentForView | [المصدر](../../../raw/application.js#L120593) |
| `abp.services.app.accident.getExcessCharges` | POST | api/services/app/accident/GetExcessCharges | [المصدر](../../../raw/application.js#L119741) |
| `abp.services.app.accident.getAccidentMovement` | POST | api/services/app/accident/GetAccidentMovement | [المصدر](../../../raw/application.js#L119497) |
| `abp.services.app.accident.createOrUpdateAccident` | POST | api/services/app/accident/CreateOrUpdateAccident | [المصدر](../../../raw/application.js#L119760) |
| `abp.services.app.accident.getAccidentForEdit` | POST | api/services/app/accident/GetAccidentForEdit | [المصدر](../../../raw/application.js#L119772) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L313017) |
| `abp.services.app.commonLookup.searchRentalOrLeaseAgreement` | POST | api/services/app/commonLookup/SearchRentalOrLeaseAgreement | [المصدر](../../../raw/application.js#L118860) |
| `abp.services.app.invoice.createOrUpdateInvoice` | POST | api/services/app/invoice/CreateOrUpdateInvoice | [المصدر](../../../raw/application.js#L119170) |
| `abp.services.app.accident.saveAccidentAfterCreateDamageInvoice` | POST | api/services/app/accident/SaveAccidentAfterCreateDamageInvoice | [المصدر](../../../raw/application.js#L119187) |
| `abp.services.app.chargesSetting.getConfiguredChargesTypes` | POST | api/services/app/chargesSetting/GetConfiguredChargesTypes | [المصدر](../../../raw/application.js#L119199) |
| `abp.services.app.movement.getMovement` | POST | api/services/app/movement/GetMovement | [المصدر](../../../raw/application.js#L119222) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L365805) |
| `abp.services.app.asset.getAssetForEdit` | POST | api/services/app/asset/GetAssetForEdit | [المصدر](../../../raw/application.js#L365812) |
| `abp.services.app.limoTrip.getInvoiceTrips` | POST | api/services/app/limoTrip/GetInvoiceTrips | [المصدر](../../../raw/application.js#L365821) |
| `abp.services.app.invoiceSearch.getInvoiceForView` | POST | api/services/app/invoiceSearch/GetInvoiceForView | [المصدر](../../../raw/application.js#L365905) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L312735) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L313062) |
| `abp.services.app.allocation.getAllocations` | POST | api/services/app/allocation/GetAllocations | [المصدر](../../../raw/application.js#L342588) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Accident.AddNew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Accident.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Accident.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Accident.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.MultiModalMiscInvoices`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.MarkDisputed`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.UnmarkDisputed`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Assets.Assets`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.vehicle` | ui-select |  |  |
| `vm.filters.movementType` | text | invoiceType | ng-options=type.id as type.name for type in vm.filterMovementTypes |
| `vm.filters.refNo` | text |  |  |
| `vm.filters.excessChargesInvoiceStatus` | text | invoiceType | ng-options=type.id as type.name for type in vm.insuranceInvoicesOptions |
| `vm.filters.driver` | ui-select |  |  |
| `vm.filters.driverAgeRange` | checkbox | driverAgeRange |  |
| `vm.filters.fromAgeRange` | number |  | ng-disabled=!vm.filters.driverAgeRange |
| `vm.filters.toAgeRange` | number |  | ng-disabled=!vm.filters.driverAgeRange |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
