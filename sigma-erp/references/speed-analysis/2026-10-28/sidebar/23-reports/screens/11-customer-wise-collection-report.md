# شاشة: Customer Wise Collection Report

المسار في القائمة: Reports ← Customer Wise Collection Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_customerWiseCollectionReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0421](../../../readable/routes/R0421--tenant-crs-customerwisecollectionreport.js)، والأصل [raw/application.js:4600](../../../raw/application.js#L4600).
- قالب الشاشة: `~/App/tenant/views/crs/reports/customerWiseCollectionReport/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.customerWiseCollectionReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.customerWiseCollectionReport.index](../../../readable/controllers/C0978--tenant.views.crs.reports.customerWiseCollectionReport.index.js) | 9 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.customerWiseCollectionReport.index`: `getCustomerType`، `getVoucherType`، `getlocalDateTime`، `getLocationName`، `locationPermission`، `getCustomerWiseCollectionReport`، `CurrencyFormate`، `roundingforView`، `exportToExcel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L265308) |
| `abp.services.app.customerWiseCollectionReport.getCustomerWiseCollectionReport` | POST | api/services/app/customerWiseCollectionReport/GetCustomerWiseCollectionReport | [المصدر](../../../raw/application.js#L265321) |
| `abp.services.app.customerWiseCollectionReport.exportToExcel` | POST | api/services/app/customerWiseCollectionReport/ExportToExcel | [المصدر](../../../raw/application.js#L265343) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Vouchers.Receipts.ViewOtherBranchReceipts`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.customerType` | select |  CustomerType | ng-options=customerType.id as customerType.name for customerType in vm.customerTypes |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
