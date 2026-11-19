# مطابقة صلاحيات تقرير سجلات الخدمة اليومية

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ٩ نوفمبر ٢٠٢٦ |
| العقد | [العقد المجمد](DAILY_SERVICE_LOGS_ACCESS_CONTRACT_FREEZE.md) |
| النطاق | صلاحيات التقرير الحالي وإخراجه ونطاق مصادره؛ لا تطوير وظائف جديدة |

## المصدر والمنحة

تتبع المسار FleetDailyServiceLogs إلى fleet-daily-service-logs.routes ثم
DailyServiceLogsReportComponent ثم DailyServiceLogsService.getReport إلى
GET DailyServiceLogReport. يطابق GetAsync المنحة DailyServiceLogReport.Get
عبر ReviewedPermissionOperations وPermissionEndpointResolver، ويفرضها
PermissionAuthorizationFilter لكل طلب مع التحقق من المستخدم والشركة والفروع.
أضيفت العملية صراحة إلى WholeDocumentReads حتى يستخدم التقرير الاستعراض،
دون أن تشترط القراءة CanTransact. ليس ReportEffects bypass للمستندات.

لا CRUD أو lookup أو ملفات أو روابط صفوف أو كتابة في هذه الشاشة.
منحة القراءة نفسها تحكم البحث والتبويبات والطباعة وExcel، دون اختراع
Export/Print أو طلب منح Job/Invoice/ServiceLog الداخلية. registry يملك
قائمة العرض والرابط والبديل الأول بعد الدخول؛ الرابط create غير موجود.

## الخادم والفروع

الجذور الخارجية تظل QueryReport العادية: Job/JobDetail لتفاصيل الخدمة
وعدد المركبات، Invoice مع Job للفواتير، PurchaseOrder/Detail للمشتريات،
Bill/Detail للمدفوعات، Receipt للتاريخ/وسيلة الدفع. تحكمها الشركة وIsDeleted
وفروع المصادر، مع حماية المستند متعدد الفروع عند وجوده. لا يُقرأ
WorkshopMovement في هذا التقرير؛ تشابه الاسم لا يثبت مصدرًا واحدًا.

أُصلح حجب أثر التسوية على هدف مقروء عندما يكون المصدر في فرع آخر.
LoadAllocationsAsync يقبل فقط هويات قيود من الفواتير/فواتير المورد
التي قرأها التقرير بالفعل، وليس من request. يقرأ identities سطورها
ضمن tenant/live parent ثم مقدار التسوية/رابط المقبوض الداخلي فقط، مع
SubscriptionId وIsDeleted وcutoff صريحين وإعادة استخدام WhereLedgerEffective
لكلا الجانبين. هوية القيود مادية قبل الاستعلام الثاني؛ لا تركيب bypass
داخل قراءة التفاصيل. لا تُعرض labels أو حسابات أو تواريخ المصدر المخفي.

يبقى ReceiptId رابطًا داخليًا فقط. تُقرأ sections المقبوضات عبر Receipt
العادية فتظل تواريخها ووسائل دفعها محكومة بالفروع. يسمح رصيد الهدف
باستهلاك أثر تسوية صحيحة عليه دون منح فتح السند المقابل. الصيغة والـproxies
الحالية لم تتغير، ولا حدثت كتابة أو ترحيل أو توزيع مالي أو تعديل schema.

## الحقول والعرض

المرشح الوحيد date؛ يُرسل عبر toFilterParams وتستهلكه FilterHelper.GetDate.
الاستجابة وثيقة كاملة وليست صفحة. أقسامها ServiceActivity،
CollectionOutstanding، ReceiptsForMonth، ReceiptsForDay، OpeningJobs،
PurchasesTillDate، PaymentsOutstanding، ServiceRows. قيم الملخصات من الخادم.
تطبع الأقسام كلها؛ يصدّر Excel تفاصيل ServiceRows الكاملة فقط وفق العقد الحالي.

أعمدة التفاصيل مقابل DailyServiceReportRowDto:
SerialNo، JobNo، VehicleNo، Make، Model، Customer، MobileNo، Services،
Mileage، DateAndTime، Amount، AmountCollected، AmountPending.
أعمدة الجداول الملخصة Code/Rac/Outside/Total؛ IsAmount يحدد العرض.
بطاقات المقادير Code/Value. لا ListVM أو DTO إضافة/تعديل أو AutoMapper جديد.
المال والعدد والتاريخ يحتفظون بمعانيهم القائمة؛ لم تُعدل دقة أو عملة.

## مطابقة الواجهة والمالكين

| الاهتمام والكتاب | المالك الفعلي والمطابقة المصدرية |
|---|---|
| الشكل والعرض UI1/3/20 | ReportPage وReportActions وFeatureTitle؛ host من نوع sigma-route-host، وsection--fill ثم panel وframe واحد. تحدد styles.scss قواعد flex/min-width:0/height:100%؛ يملك frame التمرير، وكل grid scrollable=false. CSS المحلي لترتيب الأقسام وإخفاء تبويب الشاشة فقط، دون تعويض عرض أو ارتفاع. |
| الجدول UI6/20 | serviceColumns مقابل DailyServiceReportRowDto أعلاه، splitColumns وSummaryCards للقيم المصدرية. lazy=false/paginator=false لأن الاستجابة كاملة؛ لا paging مخترع. المرجع StatementOfAccount/shared report owners، مع شكل أقسام هذا التقرير المحتفظ به. |
| الوصول UI26/28 | AccessViewPolicyService هو مصدر القرار. visibleReport تربط resultOwner بسياق الجلسة؛ ownsReport تعيد فحص السياق والتاريخ والمنحة داخل handler قبل effects. denial watcher مستقل بعد اكتمال القراءة يمسح النتائج والهوية ويغلق DatePicker. |
| القراءة والاستعادة UI22/26/28 | كل طلب يلتقط sequence/context/date، ويلغى بالمنحة والسياق والتاريخ والتدمير. دورة الاستعادة مستقلة عن إبطال النتائج وتأثيرات busy. تستعيد طلبًا واحدًا عند regrant أو تغيير السياق، وتؤجل الاستعادة حتى ينتهي active browser print. الفشل يستهلك الاستعادة ولا يولد loop. |
| التحميل UI22 | startLoading عند الاشتراك وendLoading في finalize مع loadingReport/aria-busy. لا showPageLoading:false على المسار؛ layout.component.ts يفعّل المالك افتراضيًا، وlayout.component.html:64 يعرضه مع LoadingService.isLoading$. لا loader منافس في الجداول أو البطاقات. القبول المرئي معلق. |
| المصدر والكاش UI2 | GET DailyServiceLogReport مصدر تشغيلي/مالي مباشر دون cache opt-in أو lookup. لا حاجة إلى ReferenceLookupBindings أو cache جديد؛ الهوية من Auth الحالي وليست طلبًا إضافيًا. |
| الإخراج UI21/28 | ReportPrintSession يحتفظ بإخراج الأقسام كلها ويلغي queued frame على denial، ولا يحاول إغلاق طباعة يملكها المتصفح. Excel يستخدم serviceRows من النتيجة الحالية الكاملة فقط. كلا handler محروس بالمنحة والسياق والتاريخ وbusy. |
| الهوية والمنافذ UI26/28 | لا تُعرض subscriptionCode إلا بعد تطابق Login.id وNumber(subscriptionId) مع لقطة الوصول المملوكة للنتيجة. تمسح مع النتيجة؛ DatePicker.hideOverlay عند انتهاء الوصول/التدمير، والتركيز المؤجل له revision/context/destroy guard. |
| الحالات والترجمة UI22/23 | يحتفظ التاريخ بالتحقق الحالي، وقناتا فشل الأعمال والنقل لهما خطأ ومحاولة Refresh صريحة. يستخدم الرفض مفتاح authorization.currentAccess.denied الحالي؛ لا مفاتيح منتج جديدة أو لغة/عرض/CSS مختلف. |

لا حاجة إلى استخراج مشترك جديد: القرار والإلغاء والتحميل والطباعة والمضيف
والجدول والبطاقات لهم مالكون فعليون أعيد استخدامهم. لا مسودة أو كتابة
مرسلة في التقرير تستلزم CanDeactivate جديدًا. فحص العرض والسرعة بالتشغيل
منفصل عن هذه المطابقة المصدرية.

## المراجع والتغطية الوظيفية

| الدليل | ما يثبته والمطابقة |
|---|---|
| سبيد ٢٨ أكتوبر: 08-fleet/screens/11-daily-service-logs | مرشح date وطلب التقرير والتصدير وعارض التقرير؛ مطابق للشكل القرائي |
| الكود C1168--tenant.views.crs.vehicles.dailyServiceLogs.js | طلب واحد getDailyServiceLogs؛ date وservicesList؛ إخراج صفحة وتفاصيل وعارض reportViewer. لا فحص منحة حرفي مثبت؛ لا يستنبط إذن Sigma منه |
| مكتبة الشروح ٢٧ أكتوبر | لا شرح مستقل مطابق مثبت في catalog من البحث المحدود؛ لا ادعاء قراءة شرح مفقود |
| وثيقة Odoo19 Fleet/cost_analysis المحلية | مفهوم المقارنات الزمنية والتكلفة؛ لا تثبت صيغ Sigma أو منحها أو فروعها |
| reviews/DAILY_SERVICE_LOGS_FEATURE_REVIEW.md | سجل الـproxies والفجوات القديمة؛ بقيت دون تغيير ضمن تبني الصلاحيات |

تصدير سبيد لكل الصفحة مقابل Excel تفاصيل Sigma فجوة وظيفة مسجلة خارج
هذا التبني؛ لا يُعلن تكافؤ التقريرين. لم تُضف فلاتر/أقسام/حسابات مرجعية
جديدة أو تعالج فجوات الإقفال التاريخية غير المرتبطة بالمنح.

## أداء القراءة والمخطط

يحافظ التقرير على خمسة استدعاءات materialization أساسية، وتصل إلى أحد عشر
عند وجود كل المصادر: metrics، invoices، target detail identities، allocations،
receipts، jobs، job services، purchases، bills ثم detail identities/allocations
للمدفوعات. مجموعات فارغة تتجاوز قراءاتها التابعة. لا استعلام لكل صف أو خدمة،
ولا EF متوازٍ على السياق نفسه. إصلاح أثر التسوية لا يضيف round trip؛ يوسع
أدلة الأثر اللازمة فقط، محصورة بالهويات التي سبق السماح بأصولها.

الأرصدة تحتاج تاريخًا سابقًا كاملًا حتى cutoff؛ قراءة invoices/bills ليست
محدودة بصفحة اليوم. لا يُدّعى زمن أو عدد أوامر SQL من source call count.
الترجمة والخطة وcold/warm timing وحجم payload/render تبقى مع المالك.

توجد فهارس FK الآلية على روابط السطور والتسويات، ولا فهرس tenant/date مركب
صريح في JournalVoucherAllocationConfig. اقتراح قياس فقط:
(SubscriptionId,JournalVoucherDetailId,AllocationDate) مع
INCLUDE(AllocatedAmount,ReceiptId,JournalVoucherId,AllocatedJournalVoucherId,
AllocatedJournalVoucherDetailId,CreditNoteId,DebitNoteId,IsDeleted)، للمقارنة
مع فهرس FK القائم وكلفة joins والتحقق.
له كلفة تخزين/كتابة وتداخل مع FK، فلا يطبق بلا خطة/قياس. لا إعداد فهرس
أو هجرة أو snapshot تغير. لا هجرة لازمة لهذا التبني.

## استكمال المطابقة

سلم عامل الواجهة الشريحة وفحصها مصدريًا؛ راجع الجذر lifecycle والقالب
والإخراج، واكتشف فقد استعادة القراءة بعد active print. أُصلح باستعادة
معلقة منفصلة وأضيفت حالتان للمواصفات. يوجد الآن ١٣ سيناريو واجهة و١٤ حالة
خلفية ومواصفة endpoint mode ومواصفة route registry، كلها غير منفذة.
يفحص اختبار الخلفية المالك الحقيقي للقراءة ولا يعرض internals في الإنتاج
لمجرد الاختبار. قبول SQL الفعلي معلق. التحليل المشترك للتقرير والربط
والدليل شمل ٢٦ ملفًا وقالبًا بلا مشاكل صياغة أو imports محلية مفقودة؛
ليس type checking أو build أو tests.

انتهى تدقيق الخلفية المستقل دون ملاحظة مؤكدة إضافية بعد فحص حدود
الهويات والتسوية وtenant/soft-delete/source liveness وفضاءات أسماء
المواصفات. راجع الجذر الفروق المحددة في مستودعي الواجهة والخلفية؛
الملفات الجديدة untracked قُرئت مباشرة ولا يثبتها diff فارغ. فحص
المسافات سليم، والحزم الثماني سليمة. لا تغيير لقواعد مشتركة أو حزم
مشتقة أو مرجع معتمد أو تغييرات مستخدم غير مرتبطة.

استخدم الجذر عاملًا لشريحة UI بملكية منفصلة ومدققًا للخلفية بلا كتابة
بعد تجميد العقود؛ ظل الربط والدليل والجرد والمطابقة عند الجذر. قلل
التوازي زمن التنفيذ والمراجعة في مسارين مستقلين، ولم يفوض قرارًا ماليًا
أو صلاحية عامل لإعلان الهدف كاملًا. أُصلحت ملاحظة الجذر الخاصة بالطباعة
قبل الترقية. يظل الهدف العام نشطًا وباقي الوحدات قيد الاستكمال.

الدليل: src/app/modules/UserGuide/content/fleet-guide.ts، موضوع
FleetDailyServiceLogs ضمن قارئ UserGuide وقائمة الأسطول الموجودين.
يغطي القراءة والإخراج ونطاق مصادر الفروع وأثر التسوية ومسح البيانات
والاستعادة. لم توجد صور جديدة لهذه الشاشة في الطلب؛ المرجع النصي
والكود أدلة وظيفية، وليسا إثباتًا للتشغيل أو الأمان المنفذ على قاعدة فعلية.

الملفات الأساسية: report.component.ts/html، daily-service-logs-access.ts،
report-access.spec.ts، route-access-policy.ts/spec، fleet-guide.ts؛
وخلفيًا DailyServiceLogReportService.cs، BranchOperationRules.cs،
BranchOperationRulesTests.cs، DailyServiceLogAllocationScopeTests.cs.
لا service أو DTO أو controller أو schema أو transaction owner جديد.

## قبول المالك المجمع في نهاية الهدف

- جرّب المدير، ثم مستخدمًا له Get واستعراض فرع فقط دون CanTransact؛
  تحقق من القائمة والرابط والبحث وكل التبويبات والطباعة وExcel للتفاصيل.
- اسحب Get وتحقق من رفض الطلب المباشر ومنع الرابط والإخراج؛ ثم أعده
  أثناء طلب جارٍ وبعد نتيجة مكتملة وبشكل revoke/regrant سريع.
- بدّل الحساب والشركة ونطاق الفروع بنفس المنحة؛ يجب ألا يبقى كود اشتراك
  أو نتيجة سابقة، وألا تنشر استجابة قديمة. افتح التاريخ ثم اسحب الوصول
  للتحقق من إغلاق منفذه وإلغاء التركيز المؤجل.
- جرّب queued print وactive browser print، ثم انتهاء الوصول أو تغيير
  السياق؛ تُلغى المعلقة، وتُستعاد قراءة واحدة بعد انتهاء المفتوحة.
  فشل القراءة المستعادة يتطلب Retry صريحًا دون loop.
- جهّز فاتورة مقروءة ١٠٠ وتسوية فعالة ٣٧ من فرع غير مسموح؛ تحقق من
  رصيد الهدف ٦٣، مع غياب تاريخ/وسيلة سند الفرع الآخر من أقسام المقبوضات.
  كرر مع شركة أخرى وسند محذوف/ملغى/غير مرحل وتسوية عند cutoff للتحقق
  من بقاء شروط الصيغة وas-of. لا تُنشأ بيانات التجربة بأدوات الوكيل هنا.
- قارن قائمة يوم خالٍ ويوم كثير الصفوف والإخراج الكامل وRTL/dark/narrow،
  وراقب الصفحة في loading/error/empty/populated. قس خمس عينات cold/warm
  لنفس التاريخ ونطاق الفروع وحجم البيانات وسجل SQL-plan/IO/network/render؛
  لا أرقام أداء مقاسة في هذه الدفعة.

لا Add-Migration مطلوب. رسالتا commit مقترحتان فقط دون تنفيذ:
- للواجهة: feat(auth): guard daily service report navigation and outputs
- للخلفية: fix(auth): retain scoped daily service settlement effects

لا build/tests/lint/browser/DB/migration/snapshot/commit/push/deploy.
