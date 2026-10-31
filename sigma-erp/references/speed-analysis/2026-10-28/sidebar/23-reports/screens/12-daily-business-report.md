# شاشة: Daily Business Report

المسار في القائمة: Reports ← Daily Business Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_dailyBusinessReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0423](../../../readable/routes/R0423--tenant-crs-dailybusinessreport.js)، والأصل [raw/application.js:4616](../../../raw/application.js#L4616).
- قالب الشاشة: `~/App/tenant/views/crs/reports/dailyBusinessReport/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.dailyBusinessReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.dailyBusinessReport.index](../../../readable/controllers/C0979--tenant.views.crs.reports.dailyBusinessReport.index.js) | 15 | 7 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.dailyBusinessReport.index`: `CurrencyFormate`، `roundingforView`، `getlocalDateTime`، `getLocationName`، `getFuelLevel`، `getVoucherType`، `locationPermission`، `getDailyBusinessReport`، `getOpenedAgreements`، `getLength`، `getClosedAgreements`، `getStaffMovements`، `getVehicleReplacementStatus`، `exportToExcel`، `getReplacedVehicles`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L265466) |
| `abp.services.app.dailyBusinessReport.getDailyBusinessReport` | POST | api/services/app/dailyBusinessReport/GetDailyBusinessReport | [المصدر](../../../raw/application.js#L265477) |
| `abp.services.app.dailyBusinessReport.getOpenedAgreements` | POST | api/services/app/dailyBusinessReport/GetOpenedAgreements | [المصدر](../../../raw/application.js#L265493) |
| `abp.services.app.dailyBusinessReport.getClosedAgreements` | POST | api/services/app/dailyBusinessReport/GetClosedAgreements | [المصدر](../../../raw/application.js#L265515) |
| `abp.services.app.dailyBusinessReport.getStaffMovements` | POST | api/services/app/dailyBusinessReport/GetStaffMovements | [المصدر](../../../raw/application.js#L265532) |
| `abp.services.app.dailyBusinessReport.getVehicleReplacementStatus` | POST | api/services/app/dailyBusinessReport/GetVehicleReplacementStatus | [المصدر](../../../raw/application.js#L265549) |
| `abp.services.app.dailyBusinessReport.getReplacedVehicles` | POST | api/services/app/dailyBusinessReport/GetReplacedVehicles | [المصدر](../../../raw/application.js#L265691) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Vouchers.Receipts.ViewOtherBranchReceipts`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.locationId` | select | locationId |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
