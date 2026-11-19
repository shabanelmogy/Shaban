# تسليم محرر إعدادات الفواتير

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| العقد | `BILLING_ACCESS_CONTRACT_FREEZE.md` المجمد في ١٠ نوفمبر |
| النطاق | محرر `BillSettings` وخدمته ومسارا `create/details` فقط؛ التكامل والترقية النهائية عند الجذر |

## التنفيذ ومطابقة العقد

استهلك المحرر `billSettingsAccess` و`AdministrativeDefinitionSession`؛ يفتح
الإنشاء بمنحة `BillSettings.Create` وحدها بلا قراءة تفاصيل، ويتطلب السجل
المحفوظ `BillSettings.View`. يبقى العرض immutable، ويتطلب التعديل
`View+Update` والحذف `View+Delete`. لا تُعامل `BillingWorkspace.Get` كمنحة
للمورد. يدعم قصد `Edit` القادم من القائمة بعد نجاح تحميل الهوية المطابقة
فقط، ولا ينشئ مسار تعديل أو يعيد hydration فوق المسودة.

النموذج والنقل لا يحتويان إلا:

- `costCenterRequired`
- `customFieldOneIsMandatoryInBill`
- `id` في detail/update فقط

أزيلت حقول audit/tenant/state الوهمية من المحرر والـpayload. يستخدم القالب
`sigma-editor-page` و`sigma-editor-panel` و`app-feature-title`، ويعرض وضع
Create/View/Edit عنوانًا مترجمًا ومعرف السجل المحمل subtitle. كل boolean داخل
`sigma-field sigma-field--check`. عند انتهاء الوصول يبقى draft mounted لكنه
`hidden` و`inert`، مع رسالة رفض وزر تخلص محلي خارج المضيف المحجوب.

## العمر والقرارات والكتابة

يربط المحرر actor/tenant/branch-access الأصلي مع `routeKey/mountedKey` وهوية
السجل. تُلغى قراءة التفاصيل عند route/access/destroy، وتفحص الاستجابة المالك
والمسار وsequence والمعرف قبل النشر. يعيد regrant لنفس المالك قراءةً انقطعت
قبل اكتمالها مرة، لكنه لا يستبدل draft أو detail ناجحة. تبديل actor أو إعادة
استخدام route به draft/sent/committed work يحجب النسخة القديمة بدل خلطها.

قرار الحذف lazy داخل `defer` ويلغى نهائيًا عند انتهاء منحة الحذف أو تغير
المسار، ثم يعيد فحص grant/owner/key/loaded-object قبل إرسال DELETE. قرار
المغادرة lazy/cancellable؛ يمكن بدء قرار التخلص المحلي بعد denial، ويُلغى
عند expiry لاحق. `committed` و`discarded` حالتان terminal تمنعان replay.

POST/PUT/DELETE المرسلة مستقلة عن `takeUntil` وdestroy. تحمل كل كتابة
`CAN_PRESENT_API_OUTCOME` من `trackWrite`، وتُثبت `committed=true` قبل فحص
`mayPublish`. لذلك لا يعاد نجاح محجوب عند regrant. تملك الخدمة أخطاء mutations
محليًا عبر `X-Skip-Error-Interceptor: true`، وDELETE يذهب مباشرة إلى endpoint
`BillSettings` مع query param `id` والسياق نفسه.

## الملفات والتحقق

عُدلت داخل مستودع الواجهة:

`src/app/modules/Billing/BillSettings/components/details/details.component.ts`

`src/app/modules/Billing/BillSettings/components/details/details.component.html`

`src/app/modules/Billing/BillSettings/components/details/details.component.spec.ts`

`src/app/modules/Billing/BillSettings/billsettings.routes.ts`

`src/app/modules/Billing/BillSettings/services/billsettings.service.ts`

وأضيفت:

`src/app/modules/Billing/BillSettings/components/details/details-access.spec.ts`

`src/app/modules/Billing/BillSettings/services/billsettings.service.spec.ts`

بقي SCSS والقائمة والـmodels والـregistry والترجمات والدليل والـbackend خارج
هذه الملكية. حُفظت تغييرات الجذر والزملاء.

أضيفت ١٦ مواصفة سلوكية للمحرر، و٣ مواصفات لنقل mutations، وحُوّلت المواصفة
القديمة إلى smoke لـCreate-only؛ **المجموع ٢٠ مواصفة مصدرية غير منفذة**.
تغطي grants المستقلة، payload النحيف، قصد Edit، revoke/regrant، تبديل actor،
route reuse، failed envelope/Retry، sent-write latch، إلغاء delete، lazy local
discard، create fallback وmutation headers/context.

فحص `git diff --check` للملفات المقيدة نظيف، ولا merge markers أو رموز تنفيذ
قديمة، وكل local imports موجودة. قُرئت مفاتيح EN/AR المستهلكة وتأكد وجودها.
هذه أدلة مصدرية فقط؛ لم تُنفذ builds/tests/typecheck/lint/browser/DB أو
migrations/snapshots/commit/push/deploy. قبول المالك المعلق يشمل compile/specs
والمنح المستقلة وroute reuse والقرارات السريعة وsent outcomes وRTL/themes/mobile.

لا cache أو lookup أو N+1 جديد: السجل المحفوظ يقرأ detail واحدة مباشرة،
والإنشاء لا يقرأها. لا قياس زمن/SQL منفذ ولا ادعاء سرعة تشغيلية.

رسالة commit مقترحة دون تنفيذ:

`fix(billing): secure bill settings editor lifecycle and writes`
