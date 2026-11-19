# تسليم محرر فاتورة الفوترة القديم

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| العقد | BILLING_ACCESS_CONTRACT_FREEZE.md، Frozen بتاريخ ١٠ نوفمبر |
| النطاق | محرر BillingInvoice القديم وDTOs الإنشاء/التفاصيل وخدمته ومساري create/details فقط |
| التكامل | عند الجذر؛ لا يثبت هذا التسليم اكتمال وحدة Billing أو الهدف العام |

## الملفات والملكية

عُدّلت الملفات الآتية تحت مستودع الواجهة:

`src/app/modules/Billing/BillingInvoice/components/details/details.component.ts`

`src/app/modules/Billing/BillingInvoice/components/details/details.component.html`

`src/app/modules/Billing/BillingInvoice/components/details/details.component.spec.ts`

`src/app/modules/Billing/BillingInvoice/models/create.ts`

`src/app/modules/Billing/BillingInvoice/models/details.ts`

`src/app/modules/Billing/BillingInvoice/services/billinginvoice.service.ts`

`src/app/modules/Billing/BillingInvoice/billinginvoice.routes.ts`

وأضيفت `components/details/details-access.spec.ts`. ملف SCSS القديم فارغ وبقي
كما هو. لم يُعدّل العامل workspace أو التقرير أو خلفيته أو shared أو registry
أو translations/guide أو BillSettings. حُفظت تغييرات الجذر والزملاء.

## قرارات التنفيذ ومطابقة العقد

| الجانب | النتيجة المصدرية |
|---|---|
| العرض | BillingInvoice.View، مستقل عن BillingWorkspace.Get؛ form disabled دون Update |
| الإنشاء | BillingInvoice.Create وحدها؛ لا GET تفاصيل ولا grant View إضافي |
| التعديل | View+Update، وزر View→Edit يفحص الهوية المحملة وbusy؛ لا حقول تحرير أخرى مخترعة |
| الحذف | View+Delete على loaded record الحالي؛ قرار مشترك lazy مع إلغاء وإعادة فحص grant/owner/key/object identity قبل DELETE |
| الحقول | form typed: invoiceNo/date/period/description/amount/vat/totalAmount فقط؛ أزيلت حقول audit/tenant/isActive الوهمية من UI والـpayload |
| البيانات غير المعروضة | PUT يحافظ invoiceType/status/billingCategory الأصلية كما detail؛ لا selector أو اشتقاق تصنيف/حالة. الإنشاء يرسل defaults السابقة 0/0/null |
| المال | Amount/Vat/TotalAmount قيم number مستقلة كما generic backend، وnative number step=any بلا Quantity أو تقريب أو formula أو financial policy GET/grant جديد. لم يُضف منع قيم سالبة لم يثبته العقد |
| التاريخ | DatePickerDirective وdate-utils المشتركان، بلا UTC Z؛ يحفظ التاريخ فقط كما محرر DatePipe السابق، ولا وقت جديد في UI |
| العمر | owner+mode+id وrouteKey/mountedKey؛ يبقى المحرر mounted hidden/inert عند denial أو تبدل الممثل، ويحفظ المسودة والكتابات المرسلة دون bootstrap فوقها |
| route reuse | clean route جديد يقرأ هويته مرة؛ dirty/sent/committed route جديد يحجب المستند القديم بدل مسحه. الاستجابات تفحص owner/key/sequence ومعرف DTO |
| الاستعادة | watcher يشمل الوصول بعد اكتمال detail، وrecoveryPending مستقلة تنتظر busy ثم تستهلك محاولة واحدة؛ لا تكرار detail مكتملة أو HTTP failure loop |
| الكتابات | create/update/delete تستقبل HttpContext وtrackWrite/CAN_PRESENT_API_OUTCOME؛ independent sent lifetime بلا denied/destroy cancellation؛ committed قبل mayPublish ولا إعادة كتابة ناجحة |
| الأخطاء | envelope وHTTP مع feedback محلي وRetry لقراءة فاشلة أو محاولة فعل صريحة؛ تبقى مسودة rejected save قابلة للتحرير عند استمرار الوصول |
| الخروج | canDeactivate يحرس القرار/الكتابة ويعيد فحص busy داخل defer. local discard عند الرفض يتجاوز أول denial فقط ويلغى بأي انتهاء لاحق، مع defaultIfEmpty(false) |
| discard المقبول | terminal/pristine إن منع guard آخر الملاحة؛ لا إحياء مسودة سبق قبول تركها |
| التركيز والـportal | focusField محكوم grant/owner/key وrouteChanged وDestroyRef؛ DatePicker overlays تُغلق عند expiry/route change |
| العودة | workspace فقط إن registry تسمح؛ وإلا أول route مسموح. إذا أعاد firstAllowedRoute صفحة create/details نفسها تستخدم /access حتى لا يُحبس Create-only في صفحة terminal. query القديمة لا تُنقل لممثل جديد أو وجهة أخرى |
| أداة البيانات | mockDataAccessRequirement تتبع grant المحرر الحالي، فلا تتحول View إلى كتابة |

الشكل من shared editor page/card/title/form/footer، بلا CSS محلي جديد أو audit
layout موازٍ. لا activation/status/category/InvoiceType UI ولا طباعة/تسوية
جديدة؛ المالي والخلفي يحفظان العقد المجمد. أكد الجذر إزالة audit/tenant من
BillingInvoiceDetailVM الفعلي وتحويله إلى LeanDetailBaseVm، وأضاف ترجمات
billingInvoiceEditor للغتين. هذا العامل استهلكهما ولم يعدلهما.

## النقل والمسارات

الخدمة تملك getDetail GET GetByWithNavigationsId/{id} وcreateInvoice POST
وupdateInvoice PUT وdeleteInvoice DELETE مع params.id. الاستجابات Result
مكتوبة الأنواع، ومعرف DTO صار number مطابقًا للخادم. يقتصر CreateDTO على
المدخلات التجارية وdefault/retained classifications، ويضيف UpdateDTO معرفه.
لا audit/tenant أو تاريخ مصطنع في النقل، ولا cacheSelect opt-in.

المساران القائمان create وdetails/:id يحتفظان بالوظيفة، مع data.mode ثابت
وcanDeactivate مربوط بـcomponent.canDeactivate. لم يُنشأ route تعديل جديد،
ولم يُحوّل المساران إلى aliases. registry وreport/root wiring عند الجذر.

## التحميل والكاش والأداء

قراءة واحدة مباشرة للمستند، بلا lookup أو قراءة لكل حقل/صف أو كاش جديد.
قراءة التفاصيل وPOST/PUT/DELETE تبدأ عداد الصفحة وتحرره مرة في finalize؛
لا loading inline منافسة، مع busy/error/Retry محفوظة. actual global host
والظهور/التوقيت قبول تشغيلي معلق؛ مصادر الـreport ليست ضمن هذه الشريحة.

لا قياس سرعة أو SQL/IO منفذ. لا اقتراح فهرس جديد من محرر identity-read وحده؛
فحص PK/tenant coverage والـreport date/category/status predicates عند الجذر
والمالك. إزالة audit requests/القراءات المحجوبة لا تعني أداءً مقاسًا.

## الأدلة والتحقق

قُرئ العقد المجمد كاملًا، والمحرر القديم ونقله وmodels/routes، وBillingInvoice
Add/Update/Detail VM والكيان/mapper والخدمة generic، والملاك المشتركون
للتحقق والتاريخ والقرارات/التركيز/الوصول والـregistry. تعليمات Sigma ومهارته
وAngular والكتل UI10/UI14/UI17/UI19/UI22/UI28 ذات الصلة استُهلكت؛ لم يغيّر
العامل عقدًا مرجعيًا أو ماليًا. أدلة سبيد/العقد الأقدم ومكمل Odoo مثبتة في
عقد الجذر، ولا يُدعى أنه أعاد قراءة كل المرجع أو اختبر الخادم.

أضيفت ٢٥ مواصفة وصول مصدرية وأصلحت مواصفة الإنشاء القديمة لتصبح smoke
محددة الصلاحيات والمدخلات؛ **المجموع ٢٦ مواصفة غير منفذة**. تغطي grants
مستقلة/Create-only، شكل payload وحفظ التصنيفات والقيم المستقلة، read expiry
والاستعادة والمسودة والممثل/route reuse، failed envelope/Retry، sent PUT/
DELETE latch، cancel/regrant لقرار الحذف، local discard/focus، والعودة من
صفحة Create-only بعد حفظ/ترك مقبول دون replay.

فُحص parsing للـTypeScript وAngular HTML ووجود local imports لثمانية ملفات؛
النتيجة problems=[]. روجع scoped diff كاملًا داخل مستودع الواجهة وملف
المواصفات الجديد مباشرة لأنه untracked؛ diff --check نظيف. لا namespace C#
جديد في هذه الشريحة؛ أسماء symbols وpaths للـTS producer/consumers فُحصت.
هذا ليس type checking أو build أو tests أو RED/GREEN.

لم تُنفذ builds/tests/lint/browser/DB/migrations/snapshots/commit/push/deploy،
ولم تُنشأ وكلاء إضافية. لا schema/migration/AutoMapper/حساب مالي داخل ملكية
هذه الشريحة. دليل التطبيق وترقية الجرد والمطابقة النهائية ملكية الجذر.

قبول المالك المعلق: compile/specs، وكل منح view/create/update/delete/report
المستقلة، الممثل والtenant/session، routes/قرارات سريعة وsent outcomes، حفظ
كل قيمة وتصنيف دون reset، وloader/RTL/themes/mobile. native number يبقى
حد legacy number المعروف؛ لم يدّع تحويلًا إلى exact decimal transport.

رسالة commit مقترحة للواجهة عند دمج المالك:

`fix(billing): enforce legacy invoice editor permissions and safe writes`
