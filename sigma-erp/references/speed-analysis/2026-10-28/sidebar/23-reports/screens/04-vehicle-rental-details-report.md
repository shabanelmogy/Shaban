# شاشة: Vehicle Rental Details Report

المسار في القائمة: Reports ← Vehicle Rental Details Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_vehicleRentalDetailsReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0398](../../../readable/routes/R0398--tenant-crs-vehiclerentaldetailsreport.js)، والأصل [raw/application.js:4415](../../../raw/application.js#L4415).
- قالب الشاشة: `~/App/tenant/views/crs/reports/vehicleRentalDetailsReport/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.vehicleRentalDetailsReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.vehicleRentalDetailsReport.index](../../../readable/controllers/C1087--tenant.views.crs.reports.vehicleRentalDetailsReport.index.js) | 21 | 6 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.reports.vehicleRentalDetailsReport.sendReportByEmail](../../../readable/controllers/C1089--tenant.views.crs.reports.vehicleRentalDetailsReport.sendReportByEmail.js) | 2 | 1 |
| [tenant.views.crs.reports.vehiclesProfitAndLoss.profitLossDetail](../../../readable/controllers/C1096--tenant.views.crs.reports.vehiclesProfitAndLoss.profitLossDetail.js) | 8 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.vehicleRentalDetailsReport.index`: `localizeArabicUsingKey`، `localize`، `searchVehicles`، `clearVehicle`، `searchModel`، `clearModel`، `getAgreementsByCategory`، `rounding`، `getlocalDateTime`، `getMakeAndModel`، `searchVehiclePopup`، `CurrencyFormate`، `roundingforView`، `reportModal`، `getVehicleRentalDetailsReport`، `exportToExcelOnSreen`، `rounding`، `vehicleRentalDetailsReportExportToExcel`، `exportToExcelWithSellingDetail`، `sendReportByEmail`، `viewDetail`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.reports.vehicleRentalDetailsReport.sendReportByEmail`: `cancel`، `send`.
- وحدة `tenant.views.crs.reports.vehiclesProfitAndLoss.profitLossDetail`: `getlocalDate`، `CurrencyFormate`، `roundingforView`، `getVoucherType`، `getVehiclesProfitAndLossDetail`، `exportToExcelDetails`، `getExpenseType`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L287684) |
| `abp.services.app.vehicleModel.searchPreUsedVehicleModels` | POST | api/services/app/vehicleModel/SearchPreUsedVehicleModels | [المصدر](../../../raw/application.js#L287700) |
| `abp.services.app.vehicle.getVehiclesSummary` | POST | api/services/app/vehicle/GetVehiclesSummary | [المصدر](../../../raw/application.js#L287812) |
| `abp.services.app.profitAndLoss.getVehicleRentalDetailsReport` | POST | api/services/app/profitAndLoss/GetVehicleRentalDetailsReport | [المصدر](../../../raw/application.js#L287822) |
| `abp.services.app.profitAndLoss.vehicleRentalDetailsReportExportToExcel` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L288051) |
| `abp.services.app.profitAndLoss.exportToExcelWithSellingDetail` | POST | api/services/app/profitAndLoss/ExportToExcelWithSellingDetail | [المصدر](../../../raw/application.js#L288067) |
| `abp.services.app.documentsEmail.sendVehicleRentalDetailsReportEmail` | POST | api/services/app/documentsEmail/SendVehicleRentalDetailsReportEmail | [المصدر](../../../raw/application.js#L288264) |
| `abp.services.app.profitAndLoss.getVehiclesProfitAndLossDetail` | POST | api/services/app/profitAndLoss/GetVehiclesProfitAndLossDetail | [المصدر](../../../raw/application.js#L290010) |
| `abp.services.app.profitAndLoss.detailsExportToExcel` | POST | api/services/app/profitAndLoss/DetailsExportToExcel | [المصدر](../../../raw/application.js#L290040) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Reports.VehicleRentalDetailsReport.Detail`: غير ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.monthYear` | input | date |  |
| `vm.filters.vehicleType` | select | AgreementCategories | ng-options=item.id as item.type for item in vm.agreementCategories |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
