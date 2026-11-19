# تبني صلاحيات دورة السنوات المالية

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| النطاق | Accounts/FiscalYears: القائمة ومحرر التاريخ ومعالج الإقفال وخدمتها؛ سجل المسارات والدليل والجرد |
| التحقق | source-only؛ لا build/test/lint/browser/DB/migration/commit |

## الأدلة والمفاتيح

قرئ المسار /FiscalYear من pages/routing.ts:1660 إلى fiscalYear.routes.ts ثم
FiscalYearsComponent؛ الشاشتان الفرعيتان dialogs فعليتان، لا routed create/edit
جديد. قرئت TS/HTML والخدمة والنماذج ومتحكم FiscalYear المستقل وFiscalYearService.
ReviewedPermissionOperations يعرض أسماء أفعال هذا المتحكم حرفيًا؛ GenericAction
لا يحولها إلى View/Create/Update/Lookup. لا تُنسخ مفاتيح المورد العام.

| الحدث | المفاتيح الفعلية المطلوبة |
|---|---|
| القائمة/صفحاتها/فرزها/فلاترها/Retry | FiscalYear.GetList |
| إنشاء/اقتراح التواريخ | FiscalYear.GetList + FiscalYear.Add |
| قراءة تفاصيل | FiscalYear.GetList + FiscalYear.GetById |
| تعديل/الحفظ بعد القراءة أو فتح وضع edit | السابق + FiscalYear.Update |
| فتح معالج الإقفال وإجراء فحوصه وإقفاله | FiscalYear.GetList + FiscalYear.VerifyValidFiscalYear + FiscalYear.VerifyVoucherApprovals + FiscalYear.VerifyDataInconsistency + FiscalYear.CloseFiscalYear |

مسارات طلبات فحوص الإقفال تحمل التهجئة الحالية Verfiy... بينما أسماء المفاتيح
هي Verify... كما في method المعلنة؛ لا تصحيح URL أو كسر API ضمن هذه الدفعة.
تظل حالة Open/row.canClose وأصغر سنة مكتملة والتحقق الخلفي قيودًا إضافية؛
المنحة لا تتجاوزها. لا GetById مخترع لمعالج لا يستهلكه، ولا حذف أو تصدير جديد.

## عقد الحالة والعمر

القائمة: host mounted hidden+inert+aria-hidden عند غياب GetList، رسالة رفض،
قراءة داخلية cancellable بdenied$/dataContext/auth/token وتحرير finalize. تظل
requests الخارجية حية؛ إعادة المنح تستعيد القائمة مرة، لا GET بسبب revision
غير متعلق. صَفّر بيانات الصفحة والفلاتر والأرقام في سياق جديد؛ لا row قديم
يطلق view/edit/close. يلزم كائن السطر الموجود في data الحالية وحالة صحيحة
وعدم تحميل/حوارات. الفحص في visibility وhandler. last-page queued recovery
قابل للإلغاء ولا يعيد قراءة بعد السحب أو انتهاء السياق.

محرر التواريخ: dynamic current-mode requirement أعلاه، مع accessRequirement
وaccessBlocked في EditorDialog الحالي؛ لا حوار منافس أو تدمير structural لمجرد
سحب المنحة. حجب body/DatePicker/MockData portals وحفظ المسودة ضمن نفس السياق.
قراءة التفاصيل واقتراح التاريخ cancellable وقابلة للاستعادة عند إعادة المنح،
دون overwrite لمسودة dirty. يحفظ readiness بعد cancel بحيث لا يفتح Save قبل
قراءة مطلوبة ناجحة. لا auto-switch mode بسبب revocation؛ view-to-edit يحتاج
مفتاح Update والحالة المفتوحة. mode downgrade لحالة مغلقة من المصدر يبقى.
اقتراح التواريخ وطريقة حدود العام/التحقق وDTO لا تتغير.

معالج الإقفال: EditorDialog بالمتطلب الكامل، current step state ونتائجه مملوكة
لسياق الفتح والهوية/token/dataContext. الفحوص١–٣ read-only رغم POST، كل منها
قابل للإلغاء مع timeout الحالي، والمحاولة وNext/Previous تحت المتطلب والحالة.
إعادة المنح تستعيد الفحص المنقطع المناسب مرة، وتبطل شهادة checks القديمة عند
انتهاء السياق/المنحة؛ لا تُعاد خطوة الإقفال٤ تلقائيًا. لا confirmation متأخر
يؤدي للإقفال؛ lazily open مع captured id/context/grants وإعادة الفحص قبل إرسال.
الخطوة٤ sent mutation مستقلة: لا takeUntil(access/context)، لا auto retry.
تبقى retry اليدوية الحالية ممكنة لفشل مثبت وبحارسها؛ لا تكرار عند regrant.

حفظ التاريخ والإقفال المرسلان يحتفظان بfinalize وoutcome عند سحب grant ضمن
السياق نفسه؛ لا callbacks/message/results تخص السياق القديم في مستخدم/سياق
جديد. close editor/refresh parent بعد success يعيدان حراسة قراءة القائمة؛
نجاح إرسال لا يبرر GET محظورًا. إفلات صريح/إغلاق محلي يبقى متاحًا بعد الرفض
عندما لا توجد كتابة معلقة؛ dirty decision يبدأ كسولًا ويُلغى عند انتهاء
الوصول/السياق، مع UI28 exception لتجاهل محلي جديد بدأ أثناء الرفض.

جميع الأحداث الفورية تتحقق من actor/auth/token/dataContext قبل انتظار effect.
جلسة محرر أو معالج انتهى سياقها تحتاج إعادة فتح؛ لا تعود لمجرد regrant.

## التحميل والكاش والخلفية

قراءات list من مالك الصفحة. قراءات التفاصيل/suggestions/checks داخل dialog
تستخدم stateMessage المحلي الموجود عندما يغطي overlay مؤشر الصفحة؛ لا loading
host مكرر. الكتابات تحت busy/exit safety ومالكها الحالي. كل فشل envelope أو
transport واضح مع Retry. يجوز وسم POST فحوص١–٣ فقط في FiscalYearService
بNAVIGATION_READ_ONLY لأن المصدر لا يحفظ، دون إلحاقه بCloseFiscalYear POST.

المصادر مباشرة بلا opt-in cache ولا watch جديد. القائمة server-paged بcount
وترتيب ثابت Id؛ ثلاث queries/Count+oldest open+page في المصدر، لا per-row HTTP.
الخادم يعيد كل فحوص السنة داخل transaction الإقفال Serializable؛ لا تغييرات
مالية أو EF أو AutoMapper أو migration. الجذر يراجع branch/backend metadata
المرتبطة منفصلًا؛ لا يغير العامل backend أو يختلق نطاق إقفال من UI.

## المرجع والمطابقة والتسليم

الشكل UI01 modal editor مع معالج StepForm موجود؛ Master4/5/7 وUI7/10/13/22/26/28/29
وBE8، مع حفظ FinancialYear financial owner. قرئت شاشة Speed21/03 بتاريخ
2026-10-28، ثم بشكل منفصل controllers C0485 وC0484 وC0483، وcontroller/service
الفعليين. المرجع يثبت قائمة وتواريخ وفحوص وإقفالًا وإجراءات delete؛ في Sigma
لا endpoint حذف معرض ولا زر حذف. يبقى الحذف missing في المقارنة وخارج تنفيذ
التفويض؛ لا تضاف عملية إتلاف من تشابه مرجعي. لا غموض مفاهيمي يحتاج Odoo.
الجرد/الدليل الحاليان قرئا؛ recipe٨/٨OK. Superpowers verified؛ التنفيذ/المراجعة
وفق source-only، واختبارات فعلية معلقة عند المالك.

عامل التنفيذ يملك Accounts/FiscalYears فقط (TS/HTML/service/specs)، ولا يغيّر
shared/registry/docs/inventory/backend. الجذر يملك التكامل والخلفية عند الحاجة
والدليل /UserGuide/accounts والمصالحة والجرد. مواصفات behavior جديدة بأسماء
access.spec.ts أو تطوير الحالي دون إسقاط اختبارات سابقة. لا تشغيل، ولا ملكية
متداخلة مع عامل Budget. الهدف الشامل active.

## اكتشاف لاحق أثناء تتبع الخلفية — قرار الإقفال محسوم

قرئ FiscalYearService.CheckVoucherApprovalsAsync وCheckDataConsistencyAsync:
كلاهما Query<JournalVoucher>، ثم CloseFiscalYearAsync يغلق FiscalYear للشركة.
قرئ BranchScopeRegistry.ApplyJournalVoucherFilters: القيود غير المسموحة تُستبعد
من query للمستخدم غير المدير. بذلك قد تصبح checks كاملة في الواجهة لكنها
جزئية في الخلفية. لا تُقبل شريحة الإقفال قبل حسم شرط scope إضافي ومعالجته.

حسم المالك القرار: **مدير الشركة فقط**. لا يوقف ذلك قائمة السنوات أو
إنشاءها/تعديلها أو Budget المستقل. يفرض الخادم gate على فحوص الإقفال وإجراء
CloseFiscalYear عبر BranchAccessSnapshot.IsTenantAdmin، فوق صلاحيات Verify/Close.
وتستخدم فحوص الاعتماد والاتساق Query<JournalVoucher> مع IgnoreQueryFilters
محدودًا بعد إبقاء SubscriptionId/IsDeleted الصريحين، وقيود JournalVoucherDetail
نفسها؛ بذلك تشمل الشركة كل فروعها ولا تتجاوز tenant أو الحذف المنطقي. لا يُستخدم
ReportEffects لشهادة الاتساق، ولا IgnoreQueryFilters عام أو lease دائم.

التصنيف التقني المستقل والمؤكد للفعل غير المتغير لا ينتظر قرار الإقفال:
FiscalYear.GetList/GetById/GetSelect وVerifyValidFiscalYear/VerifyVoucherApprovals/
VerifyDataInconsistency قراءات WholeDocumentReads، لا report-effects. أضيفت
هذه التصريحات في BranchOperationRules مع مواصفات غير منفذة؛ Add/Update/
CloseFiscalYear تبقى transactions. التصنيف لا يمنح الإقفال لمنحته العادية؛
بوابة مدير الشركة الخلفية هي الشرط التجاري المنفصل.

## تصحيح مستقل مثبت — حدود التواريخ عامة للشركة

تأكد أيضًا أن ValidateDateChangeAgainstReferencesAsync يستعمل ExistsAsync
للقيود، فيفقد القيود المخفية بفروع actor. هذا قيد سلامة موجود بالفعل: تغيير
تواريخ السنة لا يجوز أن يستبعد أي قيد حي من الشركة، وليس قرار صلاحية جديدًا.
اتُّفق مصدرًا مع المراجع على Query<JournalVoucher>(نفس predicate)
.IgnoreQueryFilters().AsNoTracking().AnyAsync داخل هذا الفحص scalar فقط؛
Query يفرض RequireSubscription ثم tenant وIsDeleted!=true كـWhere صريحين،
ولا يمس IgnoreQueryFilters شروط LINQ هذه. لا Include ولا projection للمستخدم
ولا تجاوز عام للمستودع. OpeningBalanceBatch/MonthClose/AccountBudget غير
branch-owned في السجل، فلا تحتاج bypass. لا تغير نص الرفض أو DTO أو سياسة
التواريخ أو transaction. يلزم spec لسجل فرع غير متاح وforeign tenant وsoft-delete.
هذا التصحيح يخص شرط الإقفال المحسوم، ويملكه الجذر خلفيًا. التحقق المصدري
والـspecs أضيفت، أما التشغيل والخطة الفعلية وقبول الشركة فمعلّقة عند المالك.

## ضبط عقد شهادات الفحوص أثناء التنفيذ

لأن Verify١–٣ شهادات متسلسلة، يسحب revoke صلاحيتها كلها ولو عاد الوصول قبل
effect. يبدأ regrant من الفحص١، ولا يُكتفى باستعادة الخطوة٣ وحدها. إذا كانت
كتابة٤ مرسلة تظل مستقلة؛ وبعد فشلها وغياب الشهادات تبدأ Retry اليدوية من١.
هذا يضبط عبارة استعادة الخطوة السابقة أعلاه ويحافظ على عدم إعادة الكتابة.
حارس مغادرة feature يُوصل في fiscalYear.routes ويستهلك canDeactivate للحوار
القائم حتى عند حجب النموذج؛ المسودة المحجوبة لا تعتمد على فحص ظهور عام.
