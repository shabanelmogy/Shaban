# شاشة: Rental Sales For SixtBahrain

المسار في القائمة: Reports ← Rental Sales For SixtBahrain.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_rentalSalesForSixtBahrain`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0399](../../../readable/routes/R0399--tenant-crs-rentalsalesforsixtbahrain.js)، والأصل [raw/application.js:4422](../../../raw/application.js#L4422).
- قالب الشاشة: `~/App/tenant/views/crs/reports/rentalSalesForSixtBahrain/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.rentalSalesForSixtBahrain.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.rentalSalesForSixtBahrain.index](../../../readable/controllers/C1042--tenant.views.crs.reports.rentalSalesForSixtBahrain.index.js) | 12 | 5 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.rentalSalesForSixtBahrain.index`: `getlocalDate`، `localizeArabicUsingKey`، `localize`، `searchVehicles`، `clearVehicle`، `searchModel`، `clearModel`، `roundingforView`، `getlocalDateTime`، `getlocalTime`، `getRentalSalesForSixtBahrain`، `rentalSalesForSixtBahrainExportToExcel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L279105) |
| `abp.services.app.vehicleModel.searchPreUsedVehicleModels` | POST | api/services/app/vehicleModel/SearchPreUsedVehicleModels | [المصدر](../../../raw/application.js#L279121) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L279155) |
| `abp.services.app.commonAgreement.getRentalSalesForSixtBahrain` | POST | api/services/app/commonAgreement/GetRentalSalesForSixtBahrain | [المصدر](../../../raw/application.js#L279171) |
| `abp.services.app.commonAgreement.exportToExcelSixtBahrain` | POST | api/services/app/commonAgreement/ExportToExcelSixtBahrain | [المصدر](../../../raw/application.js#L279191) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Reports.RentalSalesForSixtBahrain.Detail`: غير ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.profitLoss.locationId` | select | locationId |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
