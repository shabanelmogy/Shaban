# شاشة: Collection

المسار في القائمة: Reports ← Collection.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_collectionReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0414](../../../readable/routes/R0414--tenant-crs-collectionreport.js)، والأصل [raw/application.js:4541](../../../raw/application.js#L4541).
- قالب الشاشة: `~/App/tenant/views/crs/reports/collectionReport/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.collectionReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.collectionReport.index](../../../readable/controllers/C0977--tenant.views.crs.reports.collectionReport.index.js) | 14 | 6 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.collectionReport.index`: `getLocationName`، `getAgreementLocationName`، `getlocalDateTime`، `clearSalesPerson`، `searchSalePersons`، `searchUsers`، `searchUsersWithDesignation`، `clearCreatedBy`، `locationPermission`، `CurrencyFormate`، `roundingforView`، `getVoucherType`، `getCollectionReport`، `exportToExcel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L265119) |
| `abp.services.app.user.searchUsersOptimized` | POST | api/services/app/user/SearchUsersOptimized | [المصدر](../../../raw/application.js#L265126) |
| `abp.services.app.directory.searchSalesPerson` | POST | api/services/app/directory/SearchSalesPerson | [المصدر](../../../raw/application.js#L265133) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L265155) |
| `abp.services.app.collectionReport.getCollectionReport` | POST | api/services/app/collectionReport/GetCollectionReport | [المصدر](../../../raw/application.js#L265188) |
| `abp.services.app.collectionReport.exportToExcel` | POST | api/services/app/collectionReport/ExportToExcel | [المصدر](../../../raw/application.js#L265201) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Vouchers.Receipts.ViewOtherBranchReceipts`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.LocationIdForAgreement` | select |  LocationIdForAgreement | ng-options=LocationIdForAgreement.id as LocationIdForAgreement.name for LocationIdForAgreement in vm.LocationsForAgreement |
| `vm.filters.salesPerson` | ui-select |  |  |
| `vm.filters.salesPerson` | select | salePerson | ng-options=status as status.name for status in vm.userList |
| `vm.filters.createdBy` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
