# شاشة: Profit/Loss

المسار في القائمة: Reports ← Profit/Loss.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_profitAndLoss`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0411](../../../readable/routes/R0411--tenant-crs-profitandloss.js)، والأصل [raw/application.js:4520](../../../raw/application.js#L4520).
- قالب الشاشة: `~/App/tenant/views/crs/reports/profitAndLoss/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.profitAndLoss.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.profitAndLoss.index](../../../readable/controllers/C1036--tenant.views.crs.reports.profitAndLoss.index.js) | 15 | 7 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.crs.reports.profitAndLoss.chargesBreakUpModal](../../../readable/controllers/C1035--tenant.views.crs.reports.profitAndLoss.chargesBreakUpModal.js) | 8 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.profitAndLoss.index`: `getlocalDate`، `localize`، `searchVehicles`، `searchVehiclePopup`، `CurrencyFormate`، `roundingforView`، `round`، `getExpenseTypeAmountSummary`، `getChargesTypeAmountSummary`، `getBranchWiseProfitAndLoss`، `getProfitLossBreakUp`، `showDetailLines`، `exportToExcel`، `viewDetail`، `getProfitAndLoss`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.crs.reports.profitAndLoss.chargesBreakUpModal`: `cancel`، `rounding`، `getlocalDateTime`، `getVoucherType`، `CurrencyFormate`، `round`، `exportToExcel`، `calculateTotalAmount`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L312838) |
| `abp.services.app.profitAndLoss.expenseTypeAmountSummary` | POST | api/services/app/profitAndLoss/ExpenseTypeAmountSummary | [المصدر](../../../raw/application.js#L277114) |
| `abp.services.app.profitAndLoss.chargesTypeAmountSummary` | POST | api/services/app/profitAndLoss/ChargesTypeAmountSummary | [المصدر](../../../raw/application.js#L277123) |
| `abp.services.app.profitAndLoss.getBranchWiseProfitAndLoss` | POST | api/services/app/profitAndLoss/GetBranchWiseProfitAndLoss | [المصدر](../../../raw/application.js#L277134) |
| `abp.services.app.profitAndLoss.getProfitLossBreakUp` | POST | api/services/app/profitAndLoss/GetProfitLossBreakUp | [المصدر](../../../raw/application.js#L277212) |
| `abp.services.app.profitAndLoss.exportToExcel` | POST | api/services/app/profitAndLoss/ExportToExcel | [المصدر](../../../raw/application.js#L277247) |
| `abp.services.app.profitAndLoss.getProfitAndLoss` | POST | api/services/app/profitAndLoss/GetProfitAndLoss | [المصدر](../../../raw/application.js#L277261) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L312735) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L313017) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L313062) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Reports.VehiclesProfitAndLoss.Detail`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
