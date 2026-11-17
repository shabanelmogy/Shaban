# شاشة: Vehicles Profit/Loss

المسار في القائمة: Reports ← Vehicles Profit/Loss.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_vehiclesProfitAndLoss`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0390](../../../readable/routes/R0390--tenant-crs-vehiclesprofitandloss.js)، والأصل [raw/application.js:4358](../../../raw/application.js#L4358).
- قالب الشاشة: `~/App/tenant/views/crs/reports/vehiclesProfitAndLoss/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.vehiclesProfitAndLoss.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.vehiclesProfitAndLoss.index](../../../readable/controllers/C1095--tenant.views.crs.reports.vehiclesProfitAndLoss.index.js) | 16 | 9 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.crs.reports.vehiclesProfitAndLoss.profitLossDetail](../../../readable/controllers/C1096--tenant.views.crs.reports.vehiclesProfitAndLoss.profitLossDetail.js) | 8 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.vehiclesProfitAndLoss.index`: `dateRangeCheck`، `searchVehicles`، `clearVehicle`، `searchModel`، `clearModel`، `clearSupplier`، `searchSupplier`، `searchVehiclePopup`، `CurrencyFormate`، `roundingforView`، `getVehiclesProfitAndLoss`، `exportToExcel`، `dateRangeModelChanged`، `exportToExcelDetailed`، `exportToExcelWithSellingDetail`، `viewDetail`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.crs.reports.vehiclesProfitAndLoss.profitLossDetail`: `getlocalDate`، `CurrencyFormate`، `roundingforView`، `getVoucherType`، `getVehiclesProfitAndLossDetail`، `exportToExcelDetails`، `getExpenseType`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L312838) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L313062) |
| `abp.services.app.vehicleModel.searchPreUsedVehicleModels` | POST | api/services/app/vehicleModel/SearchPreUsedVehicleModels | [المصدر](../../../raw/application.js#L289668) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L289686) |
| `abp.services.app.profitAndLoss.getVehiclesProfitAndLoss` | POST | api/services/app/profitAndLoss/GetVehiclesProfitAndLoss | [المصدر](../../../raw/application.js#L289765) |
| `abp.services.app.uaeFine.getFiltersData` | POST | api/services/app/uaeFine/GetFiltersData | [المصدر](../../../raw/application.js#L289789) |
| `abp.services.app.profitAndLoss.exportToExcel` | POST | api/services/app/profitAndLoss/ExportToExcel | [المصدر](../../../raw/application.js#L289880) |
| `abp.services.app.profitAndLoss.exportToExcelDetail` | POST | api/services/app/profitAndLoss/ExportToExcelDetail | [المصدر](../../../raw/application.js#L289895) |
| `abp.services.app.profitAndLoss.exportToExcelWithSellingDetail` | POST | api/services/app/profitAndLoss/ExportToExcelWithSellingDetail | [المصدر](../../../raw/application.js#L289909) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L312735) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L313017) |
| `abp.services.app.profitAndLoss.getVehiclesProfitAndLossDetail` | POST | api/services/app/profitAndLoss/GetVehiclesProfitAndLossDetail | [المصدر](../../../raw/application.js#L290010) |
| `abp.services.app.profitAndLoss.detailsExportToExcel` | POST | api/services/app/profitAndLoss/DetailsExportToExcel | [المصدر](../../../raw/application.js#L290040) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Reports.ViewVehicleProfitLossWithDisposalDetailReport`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Reports.VehiclesProfitAndLoss.Detail`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.profitLoss.enableDateRange |
| `vm.profitLoss.enableDateRange` | checkbox | disableDateRange |  |
| `vm.profitLoss.ownership` | select |  ownership | ng-options=ownership.id as ownership.name for ownership in vm.vehicleOwnerships |
| `vm.profitLoss.vehicle` | ui-select |  |  |
| `vm.profitLoss.model` | ui-select |  |  |
| `vm.profitLoss.chassisNo` | text |  |  |
| `vm.profitLoss.tariffGroupId` | select | vehicleType | ng-options=group.id as group.title for group in vm.tariffGroups |
| `vm.profitLoss.vehicleType` | select | vehicleType | ng-options=vehicleType.value as vehicleType.key for vehicleType in vm.vehicleTypes |
| `vm.profitLoss.supplier` | ui-select |  |  |
| `vm.profitLoss.trafficFileId` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
