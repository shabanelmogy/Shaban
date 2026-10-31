# شاشة: Download/Process Darb Tolls

المسار في القائمة: Fleet ← Download/Process Darb Tolls.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_downloadAndProcessDarbTolls`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0031](../../../readable/routes/R0031--tenant-crs-downloadandprocessdarbtolls.js)، والأصل [raw/application.js:1609](../../../raw/application.js#L1609).
- قالب الشاشة: `~/App/tenant/views/common/tolls/downloadAndProcessDarbToll.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.tms.downloadAndProcessDarbTolls as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.tms.downloadAndProcessDarbTolls](../../../readable/controllers/C0442--tenant.views.tms.downloadAndProcessDarbTolls.js) | 6 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.tms.downloadAndProcessDarbTolls`: `downloadTolls`، `downloadTollsV3`، `callbackOnComplete`، `showError`، `cancelAll`، `processTolls`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.salikAccount.getSalikAccountsForExtension` | POST | api/services/app/salikAccount/GetSalikAccountsForExtension | [المصدر](../../../raw/application.js#L115066) |
| `abp.services.app.toll.processTolls` | POST | api/services/app/toll/ProcessTolls | [المصدر](../../../raw/application.js#L115087) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.selected` | radio | radio1 |  |
| `vm.selected` | radio | radio1 |  |
| `vm.selected` | radio | radio3 |  |
| `vm.filters.fromDate` | input | date |  |
| `vm.filters.toDate` | input | date |  |
| `vm.selectedSalikAccounts` | ui-select |  |  |
| `vm.filters.plateNosWithTag` | ui-select |  |  |
| `vm.filters.downloadFromDate` | input | downloadFromDate |  |
| `vm.filters.downloadToDate` | input | downloadToDate |  |
| `vm.filters.plateNo` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
