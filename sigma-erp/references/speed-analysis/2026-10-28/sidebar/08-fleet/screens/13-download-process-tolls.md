# شاشة: Download/Process Tolls

المسار في القائمة: Fleet ← Download/Process Tolls.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_downloadAndProcessTolls`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0030](../../../readable/routes/R0030--tenant-crs-downloadandprocesstolls.js)، والأصل [raw/application.js:1603](../../../raw/application.js#L1603).
- قالب الشاشة: `~/App/tenant/views/common/tolls/downloadAndProcessTolls.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.tms.downloadAndProcessTolls as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.tms.downloadAndProcessTolls](../../../readable/controllers/C0443--tenant.views.tms.downloadAndProcessTolls.js) | 9 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.tms.downloadAndProcessTolls`: `getDate`، `downloadTolls`، `downloadTollsV3`، `callbackOnComplete`، `showError`، `searchPlateNo`، `resetProcessingDate`، `processTolls`، `cancelAll`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.toll.searchTollPlateAndTags` | POST | api/services/app/toll/SearchTollPlateAndTags | [المصدر](../../../raw/application.js#L115299) |
| `abp.services.app.toll.processTolls` | POST | api/services/app/toll/ProcessTolls | [المصدر](../../../raw/application.js#L115329) |
| `abp.services.app.salikAccount.getSalikAccountsForExtension` | POST | api/services/app/salikAccount/GetSalikAccountsForExtension | [المصدر](../../../raw/application.js#L115374) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.selected` | radio | radio1 |  |
| `vm.selected` | radio | radio1 |  |
| `vm.selected` | radio | radio3 |  |
| `vm.filters.fromDate` | input | fromDate |  |
| `vm.filters.toDate` | input | toDate |  |
| `vm.selectedSalikAccounts` | ui-select |  | ng-if=!vm.isDownloadOrReconcileTollsSingleAccount |
| `vm.singleSeletedAccount` | select | singleSeletedAccount | ng-if=vm.isDownloadOrReconcileTollsSingleAccount |
| `vm.filters.plateNosWithTag` | ui-select |  |  |
| `vm.filters.downloadFromDate` | input | downloadFromDate |  |
| `vm.filters.downloadToDate` | input | downloadToDate |  |
| `vm.filters.plateNo` | text |  |  |
| `vm.filters.tagNo` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
