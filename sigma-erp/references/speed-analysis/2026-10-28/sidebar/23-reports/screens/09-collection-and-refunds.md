# شاشة: Collection And Refunds

المسار في القائمة: Reports ← Collection And Refunds.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_collectionAndRefundsReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0419](../../../readable/routes/R0419--tenant-crs-collectionandrefundsreport.js)، والأصل [raw/application.js:4585](../../../raw/application.js#L4585).
- قالب الشاشة: `~/App/tenant/views/crs/reports/collectionAndRefundsReport/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.collectionAndRefundsReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.collectionAndRefundsReport.index](../../../readable/controllers/C0976--tenant.views.crs.reports.collectionAndRefundsReport.index.js) | 15 | 6 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.collectionAndRefundsReport.index`: `getVoucherType`، `getlocalDateTime`، `roundingforView`، `clearSalesPerson`، `searchSalePersons`، `searchUsers`، `searchUsersWithDesignation`، `clearCreatedBy`، `getLocationName`، `getAgreementLocationName`، `locationPermission`، `getCollectionAndRefundsReport`، `CurrencyFormate`، `exportToExcel`، `getBillingMethodTypes`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L264909) |
| `abp.services.app.user.searchUsersOptimized` | POST | api/services/app/user/SearchUsersOptimized | [المصدر](../../../raw/application.js#L264915) |
| `abp.services.app.directory.searchSalesPerson` | POST | api/services/app/directory/SearchSalesPerson | [المصدر](../../../raw/application.js#L264922) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L264966) |
| `abp.services.app.collectionAndRefundsReport.getCollectionAndRefundsReport` | POST | api/services/app/collectionAndRefundsReport/GetCollectionAndRefundsReport | [المصدر](../../../raw/application.js#L264983) |
| `abp.services.app.collectionAndRefundsReport.exportToExcel` | POST | api/services/app/collectionAndRefundsReport/ExportToExcel | [المصدر](../../../raw/application.js#L265000) |

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
