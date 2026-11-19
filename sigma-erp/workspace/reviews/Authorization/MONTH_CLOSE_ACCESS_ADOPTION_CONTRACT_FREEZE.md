# تبني صلاحيات إقفال الشهور

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| النطاق | Accounts/MonthClose القائمة ومعالج الفحص وخدمة الشهر، دون فتح صلاحيات FiscalYear أو تغيير قواعد الإقفال الخلفية |
| التحقق | source-only؛ لا builds/tests/lint/browser/DB/migrations/commits |

## العقد الفعلي

المسار /MonthClose إلى MonthCloseListComponent. الخدمة الفعلية تستخدم:

| الحدث | المفتاح |
|---|---|
| قائمة السنوات | FiscalYear.GetList |
| أشهر السنة | MonthClose.GetByFiscalYear |
| فحص الشهر | MonthClose.VerifyValidMonth |
| فحص اعتماد القيود | MonthClose.VerifyVoucherApprovals |
| فحص الاتساق | MonthClose.VerifyDataInconsistency |
| إقفال الشهر | MonthClose.CloseMonth |
| إعادة فتح الشهر | MonthClose.ReopenMonth |

لا تستخدم الواجهة ToggleStatus، ولا تُخترع صلاحيات View/Update. GetByFiscalYear
اختيار مطلوب قبل ظهور الجدول؛ الإقفال يتطلب القراءات الثلاث ثم CloseMonth،
والإعادة تتطلب GetByFiscalYear + ReopenMonth. لم يُحسم بعد إن كانت فحوص الشهر
تحتاج نفس admin-only الخاص بالسنة؛ هذا القرار لا يُخترع هنا، ويظل backend
business rule مالكًا له. عامل التنفيذ لا يغير backend.

## العمر والحالة

تُحرس القائمة mounted عند غياب FiscalYear.GetList، وقراءة الأشهر عند غياب
MonthClose.GetByFiscalYear، والحوار عند غياب فحوص الشهر/CloseMonth. كل reads
قابلة للإلغاء مع actor/auth/token/dataContext، واستعادة مرة بعد regrant دون
GET مكرر أو صفوف قديمة. الـclose/reopen mutations المرسلة مستقلة ولا replay
تلقائيًا؛ callback السياق القديم لا يغير الجدول أو success toast. confirmation
إعادة الفتح lazy وتعود false عند الإلغاء أو انتهاء السياق، مع local discard
إن وجد. Step checks تستعيد current step لا step ثابتًا، والـportals/loader
الحاليون هم المالك.

## المرجع والملكية

قُرئ المصدر المحلي وخدمة MonthClose وReviewedPermissionOperations، وSpeed شاشة
17-month-closing بتاريخ2026-10-28. المرجع يثبت السنة/الشهر وفحوص الإقفال
وإعادة الفتح؛ لا يثبت صلاحيات الخادم أو نطاق الفرع. الشكل step dialog/list
القائم، بكتل UI01/07/10/22/26/28/29 وBE8. لا Odoo لازم.

العامل يملك Accounts/MonthClose بالكامل ومواصفاته فقط؛ الجذر يملك registry/
guide/inventory/backend. لا يلمس FiscalYears أو Budget أو shared owners.

## اكتشاف خلفي بعد التجميد

GetByFiscalYearAsync ينشئ سجلات الأشهر الناقصة داخل GET. لا يصنف كread خالص
لمجرد HTTP verb؛ إعادة صياغة ذلك تحتاج producer/consumer عقدًا مستقلًا قبل
التغيير. وفحوص approval/integrity تستخدم Query<JournalVoucher> المرشحة بالفروع
ثم تغلق شهر الشركة؛ نفس خطر partial-company checks المثبت للسنة. أُرسل
للمالك سؤال هل Close/Reopen للشركة admin-only أم grants مستقلة مع check شامل.
لا اختراع للقرار ولا توقف لبقية حراس الواجهة المستقلين؛ root يملك الحل الخلفي.

## قرار المالك اللاحق — ٧ نوفمبر

حسم المالك إقفال الشهر وإعادة فتحه: **مدير الشركة فقط**. يلغي هذا القرار
حالة الانتظار أعلاه، ويشمل فحوص الإقفال الثلاثة والإقفال وإعادة الفتح، مع
حراسة مساري ToggleStatus وUpdate الخلفيين لأنهما يستدعيان نفس تغيير الحالة.
قراءة السنوات والشهور تحت مفاتيح القراءة السابقة ولا تصبح إدارية تلقائيًا.
تُفرض البوابة في الفلتر بعد إثبات هوية actor، وفي خدمة تغيير الحالة/الفحص
قبل القراءة أو المعاملة، مع رفض 403 لا نتيجة تحقق مجال ناجحة شكليًا.

فحوص الاعتماد والاتساق شركة كاملة مع تجاوز ضيق لمرشح الفروع فقط عبر
IgnoreQueryFilters، وإبقاء tenant والحذف المنطقي للجذر والتفاصيل صريحين.
لا تتغير قواعد الشهر أو تسلسله أو Serializable أو DTO أو schema.
تجهيز الشهور داخل GET مسألة مستقلة قيد القرار؛ لا يُصنف هذا GET قراءة خالصة
ولا تُخترع منحة أو نقطة تهيئة جديدة قبل تجميد عقد المنتج والمستهلك.

حسم المالك تجهيز الشهور لاحقًا: يبقى تلقائيًا عند دخول مدير الشركة، بينما
المستخدم العادي يقرأ الشهور المحفوظة فقط ولا يبدأ أية إضافة. لا DTO أو endpoint
أو منحة جديدة، ويُفحص snapshot المدير والـtenant في خدمة GET قبل مسار الإنشاء.
يبقى GetByFiscalYear ذو أثر كتابة محتمل للمدير ولا يدخل WholeDocumentReads؛
فحوص Verify الثلاثة فقط قراءات صريحة. إذا لم يفتح المدير سنةً بعد، قد تكون
قائمة الشهور للمستخدم العادي فارغة؛ يوثَّق هذا السلوك في الدليل.

مصالحة العمر: سحب الوصول يبطل شهادات Verify١–٣ كلها، حتى عند إرسال٤ دون إلغاء
الكتابة؛ إعادة المنح تعيد الفحوص من١، وRetry بعد فشل٤ تعيد بناء الشهادات قبل
إرسال جديد. تؤخر confirmation نفسها داخل defer بعد اشتراك notifier، حتى لا
يفوت سحب/إعادة متزامن أثناء فتحها. حارس مغادرة الشهر موصول بالمسار الفعلي؛
فحوص الحوار لها stateMessage محلي، بينما الكتابة٤ والصفحة لهما مالك التحميل
القائم. لا تعد هذه التفاصيل ادعاء قبول تشغيل.
