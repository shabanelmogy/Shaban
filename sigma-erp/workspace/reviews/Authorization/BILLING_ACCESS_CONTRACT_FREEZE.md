# عقد صلاحيات الفوترة وإعدادات الفواتير

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | BillingInvoice workspace وروابط create/details القديمة وخدمتها، وBillSettings القائمة والمحرر والخدمة |
| الحدود | Source-only؛ لا build/tests/lint/browser/DB/migration/snapshot/commit/push/deploy |

## الأدلة والقرارات

قُرئ عقد Billing workspace المجمد١٤أكتوبر من أرشيف٢٣أكتوبر، بما فيه
تعديلا المالك للـaccordion والـtabs؛ لا تغيير لمجرد وضعه في الأرشيف.
الشكل الرئيسي UI07 read-only report وBE5، وروابط BillingInvoice القديمة
generic compatibility بمدخلات مستند منفرد؛ لا تحويلها لتقرير أو تعطيلها
لإخفاء gap صلاحيات. BillSettings حالية generic record collection، بلا
مالك singleton مثبت؛ تبقى CRUD بمحرر بسيط UI01 لا إعداد singleton مخترع.

قُرئ شرح S159 الأصلي بصفحة811e27125ce449ac، ثم sidebar Billing لقطة٢٨أكتوبر
وC0651 كاملًا: أنواع Subscription/ChangeRequest/Project، open/closed lists،
print/payment detail. يثبت المرجع أيضًا payment/Stripe/renewal، لكن Sigma
لا يملك API/حساب تخصيص لهذه الأعمال. تبقى gaps مالية محددة دون تنفيذها
أو منح phantom. مدخل Odoo المكمل مقروء سابقًا؛ لا مفهوم مفقود يحسم
تفويض billing التجاري الخاص. لا شرح مثبت لـBillSettings باسمها الحالي؛
الدليل المحلي والكيان يثبتان حقلي checkbox فقط، لا أعمدة المنتجات المنسوخة.

كل البيانات الحالية تجريبية؛ لا fallbacks أو backfill جديد. الخانات الاختيارية
التجارية القديمة تظل optional كما العقد السابق، لا إسناد تصنيف بالتخمين.

## المنح والعمليات

| السطح | الشرط |
|---|---|
| BillingInvoice route الرئيسي/التقرير/refresh/category/tabs/local paging | BillingWorkspace.Get؛ مستقل عن BillingInvoice.View |
| BillingInvoice/details/:id | BillingInvoice.View، وعرض سجل بعينه؛ View لا يفتح تحريرًا |
| BillingInvoice/create | BillingInvoice.Create؛ لا View لازم للإنشاء نفسه |
| تعديل السجل القديم | View+Update؛ تفعيل تحرير مسودته وحفظ PUT بنفس المتطلب |
| حذف السجل من محرره القديم | View+Delete، وهوية current loaded record، تأكيد مشترك قبل DELETE |
| BillSettings قائمة/detail | BillSettings.View |
| إعداد جديد/تعديل | Create / View+Update للمورد نفسه |
| حذف إعداد | View+Delete؛ حالة الطفل/الهوية والمغادرة محفوظة |
| Activation العامة في API | المنح الحالية Activate؛ لا تحويل IsActive إلى input عارض بدل Grant، ولا واجهة activation جديدة |

يصنف BillingWorkspace.Get WholeDocumentRead صريحًا. BillingInvoice وBillSettings
كيانان مشتقان من EntityBase بلا BranchId، وليسا InvoiceBase. تظل بياناتهما
مشتركة داخل الشركة مع tenant filters والجلسة الفعالة، لا branch schema أو
حساب شركة آخر. لا علاقة مع فاتورة المورد أو الفروع بالتخمين.

لا زر طباعة/Excel/Pay/Clear/receipt جديد في تقرير Billing؛ هذه gaps من
المرجع خارج العقد الحالي. أزرار saved legacy editor الموجودة تُحرس؛ لا
تحويل create/details إلى aliases يعطل عملًا موجودًا. registry/Bداية/القائمة
تعتمد grant الشاشة الفعلي، unknown descendants تبقى مغلقة للعادي.

## الحقول والمال

توضيح ظهور المسارات الموجودة: يضاف إلى مجموعة Billing القائمة مدخل
BillSettings بمنحة View ومدخل إنشاء BillingInvoice بمنحة Create، لأن
الهدف يغطي ظهور الشاشات والأفعال الموجودة بحسب منحها، ومنها حساب Create
دون قراءة التقرير. هذه روابط للمنتجين الحاليين؛ لا Add داخل التقرير ولا
دورة إصدار/ترحيل جديدة، وdetails الخاصة بالسجل تبقى رابطًا بهوية لا بند قائمة.

التقرير يحتفظ بكامل dataset/counts/totals/status grouping والتصنيف
null كما العقد السابق. الأعمدة التسعة InvoiceNo/Category/Date/Period/
Description/Amount/Vat/TotalAmount/Status وId identity فقط.
لا بيانات audit أو DTO CRUD في transport التقرير.

محرر BillingInvoice الحالي يحرر InvoiceNo/Date/Period/Description/Amount/Vat/
TotalAmount كما generic contract. لا معادلة مالية جديدة: تبقى أرقامًا
مخزنة مستقلة دون اشتقاق جديد أو posting/settlement. يمنع إرسال audit/tenant
fields ويُحفظ InvoiceType/Status/BillingCategory الأصلي غير المعروض عند
التحديث؛ إنشاء generic الأول يبقي InvoiceType/Status الافتراضيين السابقين.
لا تعديل category/status/InvoiceType UI جديد. لا إضعاف backend grant أو
قرار مالي لتوسيع وحدة الصلاحيات. الدقة المالية من مالكها الحالي؛ لا استخدام
appQuantityInput للأموال، ولا تغيير financial-number policy ضمن هذه الشريحة.

إعدادات BillSettings: CostCenterRequired وCustomFieldOneIsMandatoryInBill
فقط مع Id identity. تُستبدل أعمدة وروابط المنتجات الوهمية بهذين الحقلين
المثبتين، ويُزال audit/tenant من المدخلات؛ لا تحكّم جديد بفروع/محاسبة.
يبقى multi-row CRUD الفعلي ولا يُستنتج singleton من اسم Settings.
تصحيح missing Add map وReverseMap/duplicate map غير المطلوبة ضمن mapper
المورد نفسه. لا entity/schema/migration جديد.

## العمر والتحميل والكاش

كل handler يراجع grant/busy/actor/mode/id/record identity. يظل المحرر mounted
ودرافته محجوبة عند denial/actor change، ولا bootstrap فوق draft أو sent
mutation عند route reuse. read cancellation+owner+sequence تمنع النتائج
القديمة والـportals/focus المؤجل. regrant recovery لا يعتمد busy output
وينتظر انتهاء الانشغال مرة واحدة دون loop على HTTP failure.

كل save/delete independent sent write مع HttpContext/trackWrite، دون
takeUntilDestroyed/denied بعد الإرسال؛ latch نجاح قبل mayPublish وCAN_PRESENT
لمنع global feedback القديم. لا إعادة POST/PUT/DELETE ناجح عبر Retry.
التأكيدات cancel+recheck، والمغادرة lazy/cancellable؛ local discard بعد
denial وفق UI28 ولا يُحبس المستخدم دائمًا بمحرر منتهٍ.

قراءات التقرير/list/detail وsave/delete تتبع page LoadingService من
start/finalize؛ تحذف loading inline/table المنافسة مع بقاء busy/errors/Retry.
BillSettings modal detail read إذا أصبح dialog يتحول local StateMessage
المثبت فقط، لا global hidden spinner. كل failure envelope/HTTP feedback واحد.
مصادر الكل operational/direct؛ لا cache opt-in أو lookup sources للتقرير/
الإعدادات. لا cache جديد أو refresh watch مخترع.

## خطة وملكيات التنفيذ

١. الجذر ينفذ billing-access.ts وroot workspace TS/HTML/spec/backend read
classification واختبار source تصنيف، وregistry/guide/translations/docs/inventory.
٢. عامل محرر BillingInvoice يملك تفاصيله TS/HTML/spec+models create/details
وخدمته billinginvoice.service.ts فقط، والمسارات billinginvoice.routes.ts
بعد إبلاغ root بشكل API؛ لا workspace أو backend أو shared/guide.
٣. عامل BillSettings يملك folder BillSettings كاملًا وbackend service/mapper/
ListVM/DetailVM الخاصين فقط ومواصفاته وhandoff؛ لا generic base/entity/
shared/registry/translations/guide. لا مصادر متداخلة مع العامل الآخر.
٤. الجذر يدمج العقود والخلفية، يدقق source diff وكل العمليات ثم يكتب guide
والمطابقة ويُرقي الصفوف عند غياب finding مؤكدة. كل مواصفات source-written
غير منفذة؛ compilation/runtime/SQL/RTL/themes/mobile قبول المالك بالنهاية.

التفويض الحالي يغطي تنفيذ المنح وما يلزمها من عقد مدخلات صحيح؛ لا إعادة
تصميم دورة مالية أو تقييد أعمال مستحدث. يحفظ كل عامل تعديلات المستخدم
والزملاء ولا يستخدم Sigma MCP/Graphify/full-solution scan أو migrations.

## الأداء والقبول

BillingWorkspace يقرأ totals ثم complete rows بالترتيب Date/Id؛ response
كامل/local paging كما الأصل، ولا unannounced server cap. لا N+1؛ حجم كامل
قابل للنمو وSQL/timing pending. إزالة قراءات محجوبة لا تثبت قياس سرعة.
فهارس مقترحة فقط من predicates/date/order/tenant/status/category والتغطية
الفعلية، ولا migration/schema تلقائي. BillSettings generic paging/list
لا يتغير إلى singleton أو hidden cap. يوثق المصدر الحقول/filters/counts
وqueries ويترك comparable cold/warm numbers وSQL plan/IO عند المالك.

التجربة المجملة: workspace-only/view-only/create-only/update/delete grants،
روابط مباشرة وحساب مدير/عادي/شركتين والجلسة بلا فروع، grant revocation
وactor/route change أثناء read/focus/decision/write، no replay ومغادرة
المسودة، حفظ كل input دون metadata/status reset، ثم build/specs/SQL/UI.

## توضيح التكامل والملكية — ١٠ نوفمبر

يظهر إنشاء إعدادات الفواتير أيضًا برابط مستقل في مجموعة الفوترة بمنحة
BillSettings.Create؛ يمنع ذلك حجب الوظيفة القائمة عن حساب Create-only
بسبب عدم امتلاكه قراءة القائمة. لا يلزم View لإنشاء سجل، ولا يضيف الرابط
إجراء أو API جديدًا. يُحدّث دليل التطبيق بنفس المسار.

توقف عامل BillSettings الأول قبل تسليم قابل للإقفال. انتقلت قائمة
الإعدادات وmodels/list.ts والخلفية إلى الجذر؛ ويملك
billsettings_editor_completion التفاصيل/routes/models create+details/service
فقط. سيُراجع الجذر التكامل، وتظل ترقية الجرد معلقة حتى التسليم والتدقيق.
تُحفظ تغييرات العامل الأول الصحيحة ولا تُعد الملفات الناقصة منتهية.
التقرير ومحرر الفاتورة خضعا لمراجعة منفصلة؛ لا يثبت تدقيق المصدر تشغيلًا.
