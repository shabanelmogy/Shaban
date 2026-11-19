# تسليم تقاعد ProvisionDetail القديم

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| العقد | `PROVISIONS_ACCESS_CONTRACT_FREEZE.md`، قسم «مصير المسارات القديمة» |
| النطاق | إزالة جذري `ProvisionDetail` الميتين وduplicate `Provision` المتأخر وscaffolds الخلفية غير المنفذة فقط |

## النتيجة

أزيل تصريحا root بالمسار `/ProvisionDetail` من `src/app/pages/routing.ts`،
وأزيل تصريح `Provision` المتأخر المكرر. بقي أول root فعلي لـ`Provision`
كما هو ويحمّل:

`src/app/modules/Vouchers/Provisions/Provision/provision.routes.ts`

لا alias من child id إلى parent id، ولا route أو service أو schema بديلة.
الرابط القديم أصبح غير موجود بدل فتح سجل أب مختلف.

أزيل import واحد وموضعا provider لـ`ProvisionDetailService` من
`src/app/layout/layout.module.ts`. حُفظت تعديلات الجذر الموجودة في الملف،
خصوصًا `currentAccessGuard`، كما حُفظت مسارات `access` و`ExchangeRate` و
`CurrencyRevaluation` في `routing.ts`.

أزيل الموضوعان الوهميان ذوا route `/ProvisionDetail` فقط من:

`src/app/modules/UserGuide/content/record-list-topics.ts`

حُفظت موضوعات debit/credit notes الجديدة وتعديلات الزملاء الأخرى. لم تتغير
vocabs أو موضوع `PROVISIONS_TOPIC` أو دليل parent أو registry أو inventory أو
العقود.

## الملفات المحذوفة

أزيلت كل الملفات الـ١٣ تحت الجذر الميت الأول:

`src/app/modules/Agreements Dashboard 2/ProvisionDetail/`

- `provisiondetail.routes.ts`
- `components/details/details.component.{ts,html,scss,spec.ts}`
- `components/list/list.component.{ts,html,scss,spec.ts}`
- `models/{create,details,list}.ts`
- `services/provisiondetail.service.ts`

وأزيلت كل الملفات الـ١٤ تحت الجذر الميت الثاني:

`src/app/modules/Vouchers/Provisions/ProvisionDetail/`

- `provisiondetail.routes.ts`
- `components/details/details.component.{ts,html,scss,spec.ts}`
- `components/list/list.component.{ts,html,scss,spec.ts}`
- `models/{create,details,grid-row,list}.ts`
- `services/provisiondetail.service.ts`

وأزيل scaffold الخلفية غير المنفذ فقط:

- `SigmaBackend/SiGma.ServerAPI/Controller/ProvisionDetailController.cs`
- `SigmaBackend/SiGma.Business/IServices/IProvisionDetailService.cs`

جميع أهداف الحذف حُلّت مسبقًا إلى مسارات مطلقة تحت
`F:\My Work\Sigma` وثبت أنها pristine في مستودعاتها. نُفذ حذف كل ملف صراحة
بـ`apply_patch`؛ لا حذف recursive ولا wildcard. بعد الحذف لا تبقى ملفات داخل
المجلدين الميتين.

## دليل السبب والحدود

المساران كانا duplicate dead CRUD بلا menu، وواجهتهما تعرض أعمدة منتجات
وحقول audit/tenant وتكتب إلى endpoint غير مالك. `ProvisionDetailController`
كان generic controller يعتمد `IProvisionDetailService`، والواجهة نفسها بلا
تنفيذ أو DI registration أو مستهلك آخر. لذلك طُبق Master5 G12 كما جمد العقد.

بقيت entity وDbSet وbranch-access/EF configuration وDTOs/mapping وخدمات
`Provision` الحية وكل مراجع `ProvisionDetail` داخل aggregate الأب. لم تُمس
migrations أو `*ModelSnapshot.cs` أو البيانات أو schema. المالك الأب وحده
يظل مسؤولًا عن add/update/delete والتحقق والتوازن/history للبنود.

## المراجع الخارجية والمراجعة

بعد الحذف لا توجد مراجع frontend إلى المجلدين أو `ProvisionDetail_Routes` أو
`ProvisionDetailService`، ولا مراجع backend إلى `ProvisionDetailController`
أو `IProvisionDetailService`. لا توجد مراجع casing/paths في `tsconfig*.json`
أو `angular.json`.

بقي مرجع خارجي واحد للمسار القديم في:

`src/app/modules/UserGuide/content/invoice-guide.ts:160`

وهو `/ProvisionDetail` داخل مصفوفة routes. لم يُعدل التزامًا بحد الملكية
الصريح «لا guide/topic» خارج موضوعي `record-list-topics.ts`. يحتاج مالك دليل
الجذر تسويته قبل الإقفال النهائي؛ لا يعيد وجوده route أو endpoint.

راجعت scoped diff في مستودعي frontend/backend. `git diff --check` نظيف في
كليهما. فحص syntax source-only للملفات الثلاثة المعدلة في الواجهة أعاد
`problems=[]`. لا merge markers أو imports/providers ميتة في الملكية، وبقي
root `Provision` واحدًا. لم تُنفذ builds/tests/typecheck/lint/browser/DB أو
migrations/snapshots/commit/push/deploy، ولا ادعاء runtime أو قبول دليل.

لا يغيّر هذا التنظيف قرار branch المعلق ولا يقفل أو يرقّي parent `Provision`.

## تكامل الجذر

أزال root مرجع /ProvisionDetail الأخير من routes دليل invoice-guide،
وحذف مفتاحَي موضوعي الدليل المتقاعدين فقط من EN/AR، دون حقول البنود
المشتركة التي يستهلكها aggregate الأب. راجع أيضًا
الفروق المقيدة في routing/layout/record-list-topics وscaffolds المحذوفة.
بقيت تغييرات الزملاء السابقة كما هي. عُلم صفا الجرد التاريخيان بـ
retirementStatus=retired-source-only مع دليل التقاعد؛ لم يُنقص routeCount
أو يُغيّر حالة parent أو يُمنح key جديد. reconciliation عدد التكرارات
ينتظر إقفال شريحة Provision، والحالة التاريخية resource-only لا تعني وجود
المسار في التطبيق الحالي. فحص references المحددة عاد دون match قديم.

رسالة commit مقترحة دون تنفيذ:

`refactor(provisions): retire duplicate provision detail roots`
