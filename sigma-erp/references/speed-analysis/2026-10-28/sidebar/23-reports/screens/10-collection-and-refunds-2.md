# شاشة: Collection And Refunds 2

المسار في القائمة: Reports ← Collection And Refunds 2.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_collectionAndRefundsReport2`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0420](../../../readable/routes/R0420--tenant-crs-collectionandrefundsreport2.js)، والأصل [raw/application.js:4592](../../../raw/application.js#L4592).
- قالب الشاشة: `~/App/tenant/views/crs/reports/collectionAndRefundsReport/collectionAndRefundsReport2.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.collectionAndRefundsReport.collectionandRefundsReport2 as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.collectionAndRefundsReport.collectionandRefundsReport2](../../../readable/controllers/C0975--tenant.views.crs.reports.collectionAndRefundsReport.collectionandRefundsReport2.js) | 13 | 5 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.collectionAndRefundsReport.collectionandRefundsReport2`: `getVoucherType`، `getlocalDateTime`، `clearSalesPerson`، `searchSalePersons`، `searchUsers`، `clearCreatedBy`، `getLocationName`، `getAgreementLocationName`، `locationPermission`، `getCollectionAndRefundsReport`، `CurrencyFormate`، `roundingforView`، `exportToExcel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L264744) |
| `abp.services.app.user.searchUsersOptimized` | POST | api/services/app/user/SearchUsersOptimized | [المصدر](../../../raw/application.js#L264750) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L264793) |
| `abp.services.app.collectionAndRefundsReport.getCollectionAndRefundsReport2` | POST | api/services/app/collectionAndRefundsReport/GetCollectionAndRefundsReport2 | [المصدر](../../../raw/application.js#L264807) |
| `abp.services.app.collectionAndRefundsReport.exportToExcel2` | POST | api/services/app/collectionAndRefundsReport/ExportToExcel2 | [المصدر](../../../raw/application.js#L264830) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Vouchers.Receipts.ViewOtherBranchReceipts`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.LocationIdForAgreement` | select |  LocationIdForAgreement | ng-options=LocationIdForAgreement.id as LocationIdForAgreement.name for LocationIdForAgreement in vm.LocationsForAgreement |
| `vm.filters.salesPerson` | ui-select |  |  |
| `vm.filters.createdBy` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
