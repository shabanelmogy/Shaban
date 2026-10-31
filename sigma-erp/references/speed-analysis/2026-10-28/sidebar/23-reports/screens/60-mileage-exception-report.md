# شاشة: Mileage Exception Report

المسار في القائمة: Reports ← Mileage Exception Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.report_MileageExceptionReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0526](../../../readable/routes/R0526--tenant-report-mileageexceptionreport.js)، والأصل [raw/application.js:5472](../../../raw/application.js#L5472).
- قالب الشاشة: `~/App/tenant/views/crs/reports/mileageExceptionReport/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.mileageExceptionReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.mileageExceptionReport.index](../../../readable/controllers/C1021--tenant.views.crs.mileageExceptionReport.index.js) | 10 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.mileageExceptionReport.index`: `dateRangeModelChanged`، `locationPermission`، `searchVehicles`، `clearVehicle`، `getlocalDateTime`، `getlocalDate`، `getlocalizedString`، `exportToExcel`، `currencyFormate`، `getMileageExceptionReport`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L273752) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L273761) |
| `abp.services.app.mileageExceptionReport.getMileageExceptionReport` | POST | api/services/app/mileageExceptionReport/GetMileageExceptionReport | [المصدر](../../../raw/application.js#L273874) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Bookings`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.AllActionsOnOtherBranchBookings`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.ViewOtherBranchBookings`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.vehicle` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
