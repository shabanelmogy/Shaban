# شاشة: ReconcileTolls

المسار في القائمة: Reports ← ReconcileTolls.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_reconcileTolls`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0408](../../../readable/routes/R0408--tenant-crs-reconciletolls.js)، والأصل [raw/application.js:4497](../../../raw/application.js#L4497).
- قالب الشاشة: `~/App/tenant/views/crs/reports/reconcileTolls/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.reconcileTolls.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.reconcileTolls.index](../../../readable/controllers/C1041--tenant.views.crs.reports.reconcileTolls.index.js) | 10 | 4 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.reconcileTolls.index`: `getlocalDateTime`، `dateRangeModelChanged`، `applyLiveCount`، `downloadTolls`، `search`، `downloadTollsV3`، `callbackOnComplete`، `reponseCallback`، `cancelAll`، `showError`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.toll.getTollsCountBreakupDateWise` | POST | api/services/app/toll/GetTollsCountBreakupDateWise | [المصدر](../../../raw/application.js#L278890) |
| `abp.services.app.salikAccount.getSalikAccountsForExtension` | POST | api/services/app/salikAccount/GetSalikAccountsForExtension | [المصدر](../../../raw/application.js#L279031) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.singleSeletedAccount` | select | singleSeletedAccount |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
