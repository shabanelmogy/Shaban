# مطابقة صلاحيات عروض الإيجار وتوابعها

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | 2026-11-10 |
| العقد | RENTAL_QUOTATION_ACCESS_CONTRACT_FREEZE.md |
| الحالة الحالية | إقفال مصدري للنطاق بعد مراجعة التصحيحات؛ قبول التشغيل معلق |

## النطاق والقرار

شريحة RentalQuotation تشمل القائمة والمحرر والرفض وإنشاء الماستر من العرض.
توجيه المالك باختيار الأنسب والاستمرار دون أسئلة قائم؛ لا إعادة لتصميم المنح
المجمدة ولا إقفال عام للتطبيق. بيانات التجربة لا تستدعي backfill أو الحفاظ
على سلوك عَرَضي. كل التحقق الحالي مصدري، وتجربة المالك مجمعة للنهاية.

طبقت مراحل discovery/freeze/read/write/actions/integration، والمطابقة جارية.
لا صور جديدة في النطاق، ولا طلب جمع خارجي. تثبت مصادر Speed27 فصل6 وSpeed28
workflow01 وRental03/C0958/C0957/C0949 الوظائف والأفعال، ولا تثبت قواعد الخادم.
بعد قراءة مدخل Odoo19 المحلي لم تبقَ فجوة مفاهيمية تحتاج صفحة مكملة لحسم هذه
المنح. التعريفة التفصيلية وأمر البيع والدفع الإلكتروني المرجعي فجوات وظيفية
مستقلة خارج تبني الإجراءات القائمة؛ لم يُخترع لها API أو أثر مالي.

## المنح والحقول

مالك rental-quotation-access.ts وroute registry يثبتان القائمة والعرض
والطباعة والتصدير بمنحة View. Create مستقل ويطلب مصادر الكتابة الفعلية،
وEdit يضيف View+Update. Staff/CarModel/VehicleType/Branch/Customer وCommon
settings مصادر الكتابة المطلوبة. Contact ومرشحات القائمة الاختيارية مستقلة.
ManageApproval يمثل الاعتماد والرفض الداخليين والمراجعة وإلغاء الموافقة؛
ManageCustomerApproval لقرار العميل وفق resolver القائم. إنشاء الماستر يحتاج
View للعرض وCreate للماستر؛ لا اعتماد شامل لشاشة الماستر من هذه التبعية.

أعمدة القائمة: no/date/customerName/customerCode/amount/internalApproval/
customerApproval. ListVM: Id/No/Date/CustomerName/CustomerCode/Amount/
InternalApproval/CustomerApproval وCanEdit/CanDelete/CanApproveInternally/
CanRejectInternally/CanApproveByCustomer/CanRejectByCustomer/CanRevise/
CanUnapprove/CanCreateMasterAgreement. حقول الأهلية لازمة للأفعال فقط؛ لا
tenant/audit بالـDTO. تفاصيل العرض والبنود تستخدم numbered/lean base، والحساب
عند الخادم كما كان؛ لا تغيير لصيغ التسعير أو توزيع مالي جديد.

## مالكو التحميل والتخزين المؤقت

| المستهلك والطلب | المالك/العمر | التصنيف |
|---|---|---|
| list/search/paging/sort/refresh وExcel pages عبر getList | LoadingService subscribed start/finalize، switchMap للقراءة وتصدير مركب cancellable | operational مباشر، لا cache |
| customer/branch filters | ReferenceLookupStatus page lease، finite read ثم ReferenceLookupBindings watch مع selected label | cache opt-in من CustomerService وBranchService؛ لا مخزن جديد |
| editor create/edit bootstrap والتفاصيل | page lease وread version/session؛ failure/Retry دون reset dirty | getDetail operational، خيارات model/type/staff direct reference بلا source opt-in |
| Common settings عبر TaxSettings.load requireSuccess | page bootstrap؛ لا fallback لطلب فاشل أو ممنوع | CommonSettings shared source الحالي، لا cache policy جديد |
| contact by customer | page auxiliary ضمن owner الصفحة؛ إلغاء/تفريغ/إعادة تحميل مستقل للمنحة | operational scoped direct GET |
| master dialog getDetail | local StateMessage، session/read sequence، Retry | operational مباشر |
| CRUD/native/reject/master writes | sent owner مستقل، finalize دائم وoutcome publication محروس | mutations، invalidation عند shared interceptor/source، لا replay |

Watch يعاد ربطه بعد bootstrap الناجح فقط، ويُفك عند السياق/سحب الوصول والهدم.
retained refresh صامت، وبقاء selected draft داخل الجلسة لا يتيح نقل أسماء
حساب آخر. loader visibility الفعلية وسرعة القراءة لم تُقاسا.

## الخلفية والأداء

PermissionAuthorizationFilter يفرض View للكتابات القائمة والاعتمادات، وView
للعرض عند إنشاء ماستر منه. Activate مرفوض405 وغير قابل للإسناد. children
تتبع aggregate؛ controller الأطفال NonController القائم لا يُفتح من جديد.
كل مساري التفاصيل والإسقاط/الترتيب/الفلترة/labels محروس tenant/live، ومعها
AutoMapper fallback. DTO المستهلك داخل RentalMasterAgreement جرى توفيقه.
BranchScopeRegistry يربط العرض بفرعه والأطفال بالأصل؛ POST Create للماستر
يدخل وضع التسجيل، فلا تكفي صلاحية عرض الفرع للإنشاء.

القائمة Count+page projection (حد200) ولا per-row reads جديدة. تفاصيل واحدة
تقرأ header ثم children؛ القائمة الموروثة GetAllWithNavigations ما زالت كاملة
وفق عقدها القديم لكنها الآن list projection محروس دون navigation graph؛ لا
تستهلكها الشاشة الحالية ولا ندعي أنها paged. لا تغيير للحساب/انتقال الحالة/
compare-and-swap/serializable duplicate invariant.

الفهارس الحالية في RentalQuotationConfig: Date وInternalApproval+
CustomerApproval؛ علاقات البنود/الماستر تخضع لفهارسFK المولدة من EF. لا index
إضافي مثبت الحاجة من مصدر فقط. افحص SQL plan الفعلي للـtenant/branch/date+
Id ordering وmaster QuotationId existence قبل اقتراح مركب وتقييم التداخل
وكلفة الكتابة/التخزين. القياس المعلق: نفس tenant والبيانات/المرشحات/حجم
الصفحة، cold/warm cache، initial usable/settled، paging/detail/export ومقارنة
SQL/network؛ لا سرعة أو قفل SQL مختبر مُدعى. لا schema أو migration مطلوبة.

## المراجعة والقبول

| الجزء | المرجع | الحالة |
|---|---|---|
| القائمة والخدمة/routes | RENTAL_QUOTATION_LIST_INDEPENDENT_AUDIT | أُغلق شرط ظهور الإنشاء بإدخال permission إلى المالك المشترك؛ لا finding مؤكدة متبقية |
| المحرر/session | RENTAL_QUOTATION_EDITOR_ACCESS_HANDOFF وINDEPENDENT_AUDIT | أُغلقت mode/Contact/initial denial/rapid recovery والقرارات والطباعة والنجاح المحجوب؛ بلا finding مؤكدة متبقية |
| الرفض والماستر | RENTAL_QUOTATION_DIALOGS_ACCESS_HANDOFF وINDEPENDENT_AUDIT | أُقفل symbol/read-write/input lifetime والطلب المستقل والمسودة؛ بلا finding مؤكدة متبقية |
| الخادم | RENTAL_QUOTATION_BACKEND_ACCESS_HANDOFF ومراجعة الجذر | عزل المنح والقراءات والـDTO والـfallback والموارد؛ لا finding مؤكدة متبقية في النطاق |

الدليل الثنائي في UserGuide/content/rental-guide.ts عبر RENTAL_GUIDE/reader
القائم وموضوع RentalQuotation يشرح المنح والفروع والأفعال والتصدير والمسودة
والمنع والتعافي. لا route/menu جديد للدليل. رُقي صف RentalQuotation وحده بعد
إغلاق الملاحظات:١٣٠مؤكدًا/٧٢محدد المورد/٥٧قيد التحقق/٢سياق/٢بديل=٢٦٣؛ والمتقاعد٧.
بقي MasterAgreement محدد المورد؛ هو نقطة الاستكمال التالية مع محرره التابع.
لا اكتمال عام للتطبيق. قبول التشغيل يشمل admin/ordinary والمنح
فرادى والفرع وinitial denial/repeated revoke/regrant وA→B→A وroute reuse،
التأكيدات والبوابات وdirty fresh status والكتابة المحجوبة والهدم والطباعة
والتحميل وRTL/theme/keyboard؛ اختبارات/بناء/متصفح/DB كلها معلقة.

## المطابقة المصدرية والتحقق المنفذ

قُرئت قوالب Workshop/Job/components/list وeditor فعليًا، وطُوبقت shell و
FeatureTitle وFilterPanel وEditableRows مع الاستهلاك الحالي. سلسلة العرض
من routing.ts:463 إلى rentalquotation.routes.ts ثم host sigma-route-host و
sigma-list-page/panel أو sigma-editor-page/panel/form، دون override عرض أو
ارتفاع محلي. المالك المشترك styles.scss:3641 وما بعده يحدد flex/height100%/
min-width/min-height0 وoverflow hidden، وقاعدة hidden+inert عند3675 تتغلب على
display. stylesheet المحرر لا يتدخل إلا بإخفاء التبويب غير النشط على الشاشة.
هذه مطابقة مصدرية؛ computed geometry والتحميل/RTL/theme لم تُقبل بالمتصفح.

الفحص الأخير: parsing/import-existence لنحو٢٧ملفًا/قالبًا بلا مشاكل، و٧٧مفتاحًا
ضمن rentalQuotation في اللغتين بلا مفقود. روجعت مفاتيح masterAgreement/general
ومدخل authorization.currentAccess.denied في مالكها المستورد؛ لا fallback إلى
رسالة إدارة الأدوار. فحص حضور أسماء٢٠٤استيرادات محلية ضمن٢٣ملفًا للوحدة بلا
مفقود، وهو ليس تحليل أنواع. XML لخمسة مشاريع وملفي موارد سليم، وفحص الحزم
الثماني سليم. scoped diff/whitespace في المستودعين بلا خطأ، مع تحذيرات
LF/CRLF المعتادة فقط. قُرئت الملفات غير المتتبعة مباشرة؛ لا إثبات لها من
git diff وحده، ولا نسبة كل محتوى ملفات التفويض/الموارد المشتركة لهذه الشريحة.

المواصفات مصدرية غير منفذة:٢٨للقائمة،١١للمحرر،٥للجلسة،٢٢للماستر،١٨للرفض،
٥للمسارات، ومواصفة transport واحدة تفحص الطلبات التسعة، إضافة مواصفة class
القديمة التي لا نعدها إثبات سلوك. ملفا خلفية يحويان نظرية وأمثلة للمنح
والقراءات والفروع. InMemory لا يثبت SQL locks ولا قفل السباق الحقيقي.
صُحح وصول مواصفة activation إلى resolver الداخلي باستخدام reflection من
assembly المالك، وطُبق التصحيح المصدري نفسه على مواصفة LeaseAgreement السابقة؛
لا تغيير لواجهته أو لسلوك التطبيق المقفل. لم تُشغّل اختبارات أو build أو
typecheck/lint/DB/browser ولا يُدعى نجاحها.

العمل موزع بعد تجميد العقود بملكيات غير متداخلة: عامل خلفية، عامل محرر، عامل
حوارات؛ تولى الجذر القائمة/الخدمات/registry/الدليل والدمج واستكمال الحوارات.
أُعيد استخدام عاملين للتدقيق المستقل لتقليل زمن الانتظار دون توسيع الفريق.
لم تُشغّل أوامر محظورة ولا Sigma MCP أو Graphify أو full-solution scan.

رسالة commit مقترحة للواجهة:
`feat(rental-quotation): adopt operation access and scoped editor lifetimes`

رسالة commit مقترحة للخلفية:
`feat(rental-quotation): enforce view prerequisites and tenant-safe reads`

متابعة بناء المالك: أظهر Angular أن kind=info في رسالة المنع ليس من عقد
StateMessageKind. صُحح إلى error وأعيد parsing للقالب ومراجعة تعريف المالك.
نجاح parsing السابق لم يكن template typecheck، ولا يثبت نجاح البناء. تبقى
إعادة بناء المالك وقبول التشغيل معلقة؛ لا تغيير للمنح أو الجرد بسبب هذا التصحيح.

متابعة بناء الخلفية: أُضيف الاستيراد الصريح لمساحة اسم RentalQuotationItemDetailVM
في RentalQuotationService بعد CS0246. النوع موجود، ومرجع ViewModels قائم؛
الإصلاح namespace resolution فقط، ولا تغيير للـDTO أو مفاتيح الصلاحية.
