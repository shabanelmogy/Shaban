# تسليم صلاحيات محرر الحوادث

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ٩ نوفمبر ٢٠٢٦ |
| النطاق | components/editor فقط، مع استهلاك عقود الجذر الجاهزة؛ لا ترقية للوحدة أو الجرد |
| العقد | [عقد الحوادث وملحق قرار الفرع](ACCIDENTS_ACCESS_CONTRACT_FREEZE.md) |

## المنفذ

يستهلك المحرر accidentsAccess والسياسة المشتركة؛ Create مستقل عن View،
وEdit يتطلب View+Update، وView يقرأ التفاصيل وحدها دون مصدر اختيارات
المركبات أو الاقتراحات أو معاينة الحركة. يربط canOpen عمر المحرر بسياق
actor/tenant/branch-access الأصلي، وبالهوية والوضع الفعليين للمسار.
يُخفى/inert المضيف عند الانتهاء وتُغلق منافذ Select/DatePicker، مع زر
تخلص محلي ظاهر خارج المضيف المحجوب. المسودة والتفاصيل والكتابة المرسلة
تبقى لدى المحرر، ولا يعيد regrant تحميل التفاصيل فوقها.

يتابع المحرر data/paramMap عند route reuse. تُلغى قراءات الهوية السابقة؛
تُهيأ الهوية الجديدة عند حالة clean/idle أو بعد مغادرة مقبولة، وتُحجب
نسخة ذات draft/sent work بدل خلط الوثيقتين. لا يعاد التقاط actor جديد
فوق المسودة القديمة. عند إعادة المنحة لنفس المالك تعود المصادر التي
انقطعت، دون overwrite للمدخلات أو إعادة حفظ ناجح. تتفصل effects الوصول
واستعادة المصادر عن busy/form effects، فلا يمسح finalize التفاصيل الناجحة.

الفرع حقل required في الإنشاء فقط، من CurrentBranchService.options
القابلة للتسجيل وبقيمة default إذا كانت صالحة. يظهر BranchName المحفوظ
read-only في التعديل والعرض. payload المشترك يستثني branchId ثم يضيفه
Create وحده؛ لا يرسله Update، والمركبة تظل ثابتة بعد الإنشاء. لا
Branch.Lookup جديد ولا افتراض فرع للسجلات القديمة.

دخول Edit وSave والرفع وتعديل الأطفال تحتاج CanTransact على BranchId
المحفوظ أيضًا، حتى مع Accident.Update؛ View يبقى متاحًا بصلاحية العرض.
عند الإنشاء يستطيع المستخدم اختيار الفرع إن لم يوجد default صالح،
ويظل الحفظ مشروطًا بفرع قابل للتسجيل. تتبع قيمة الفرع عبر toSignal
لأن قيمة FormControl وحدها ليست تبعية signal، فلا تتجمد أهلية اختيار جديد.

## المصادر والتحميل

استُبدل forkJoin bootstrap المركب بمالكين مستقلين: detail، المركبات
المؤرخة المطلوبة للإنشاء، Options الاختياري، وResolveMovement الاختياري.
كل قراءة تستهلك page LoadingService مع finalize وإلغاء route/access/
context/destroy؛ لا StateMessage loading أو p-select loading مكرر مع
مالك الصفحة. لكل مصدر خطأ ومحاولة مستقلة، ولا تجلب view أي lookup.

لا يغيّر رفض Options نص whoseFault أو chargingType ولا يمنع كتابتهما
يدويًا. تبقى معاينة الحركة غير مطلوبة للحفظ؛ تغيير التاريخ/المركبة يمسح
المعاينة السابقة ويلغي قراءتها، وفشلها له error/Retry مستقل. الحركة
المحفوظة من detail تبقى جزءًا من قراءة المستند. لا reference-cache opt-in
لهذه الطلبات التشغيلية المؤرخة، ولا أضيفت Vehicle.Lookup للمحرر.

## الحفظ والمرفقات والمغادرة

الكتابة المرسلة مستقلة بلا takeUntilDestroyed/denied$؛ تثبت saveCommitted
قبل سياج النشر. يحمل HttpContext callback يجمع ملكية الكتابة مع هوية
ووضع المسار. لا يعيد نجاح محجوب POST/PUT عند إعادة المنحة، وتنظيف الصور
مرحلة مستقلة قابلة للمحاولة. رد رفع صورة وصل بعد انتهاء الوصول يبقى في
tracker ولا يُضاف إلى المسودة؛ لا يُرفض رد صالح لمجرد أن مصدر الرفع نفسه
ما زال ينهي busy marker قبل finalize.

يتلقى DocumentUploadTracker متطلب الرفع (المحرر+Media.UploadMedia)
والتنظيف Media.DeleteMedia. إزالة الصورة المحفوظة تحتاج التحرير ومنحة
الحذف، والمحلية غير المحفوظة تُزال محليًا. يجمع EditableRows canRemove
وremoveAllowed مع نفس predicate، ويلغي القرار القديم عند انتهاء الوصول
أو المسار؛ markRemoved موجود داخل onRemoving بعد القبول فقط. حالات
الرفض أو إلغاء القرار لا تسجل الملف للحذف. تبقى حدود ٥٠ رسمًا و٢٠ صورة
ونوع/حجم الصورة والحسابات كما هي.

قرار المغادرة lazy/cancellable ويعيد false عند إلغائه؛ يبدأ التخلص
المحلي بعد denial دون طلب grant المحرر. إلغاء القرار قبل switchMap
ولا يُطبّق على cleanup سبق إرساله. يعيد التنظيف فحص منحة Media؛ فشله
لا ينسى المسار أو يسمح بإعادة الحفظ الناجح. بعد تغيير actor لا يبدأ
المحرر القديم حذفًا باسم actor الجديد؛ يسمح بالمغادرة المحلية فقط،
ويظل انتهاء orphan الخاص بملفات مسودة المالك السابق من مسؤولية مالك
تخزين الخادم، لا ادعاء بتنظيفه عبر حساب مختلف.

## قراءة الصور المحمية

استهلكت شريحة الجذر الجديدة: FileLink واحد protectedImage+preview في
خلية الصورة بدل IMG/static URL والرابط العادي المكرر. المتطلب يجمع
منحة المحرر مع Media.ReadAccidentImage، والمكون موجود فقط أثناء canOpen.
غياب منحة قراءة الصور لا يمنع فتح المستند أو حفظه؛ لا static fallback.
مالك FileLink والخادم والملفات الخاصة ومنحة Media الجديدة عند الجذر؛
لا يدّعي هذا التسليم وحده اكتمال سرية الملفات أو حراسة الجذر والأطفال.

## الملفات والتحقق

تغير editor.component.ts وeditor.component.html، وأضيف editor-access.spec.ts.
لم يتغير SCSS أو models أو services أو accidents-access أو registry أو
guide أو backend أو Media/shared. قُرئت العقود المجمدة وملحق الفرع ومالكو
السياسة وEditableRows وDocumentUploadTracker وFileLink وCurrentBranch
الفعليون، مع مهارتي Sigma وAngular والقواعد الجارية. دليل Speed/Odoo
وقرار الفرع مسجلان في عقد الجذر؛ لم تُخترع منهما منح أو حسابات.

أضيفت ٢٠ مواصفة سلوكية مصدرية غير منفذة: view بلا lookups؛ رفض editor؛
draft revoke/regrant؛ رفض إزالة صورة قبل القرار؛ قبول الإزالة؛ إلغاء
قرار الصورة عند revoke؛ عدم إرسال branch في Update؛ latch الحفظ المرسل؛
route-id reuse مع draft؛ الحفاظ على النص عند سحب Options؛ lazy local
discard؛ رد الرفع أثناء finalize؛ رد رفع بعد denial؛ Create بفرع صالح
دون View؛ وبقاء التحرير عند سحب قراءة الصور؛ وقبول إزالة صورة محلية
dirty دون منحة حذف ملف محفوظ. لا ادعاء RED/GREEN.
وتشمل رفض دخول Edit ورفض Save من رابط Edit عند امتلاك عرض الفرع فقط.
وأضيفت حالتا إلغاء focus مؤجل نهائيًا بعد revoke/regrant سريع وبعد
تغيير هوية المسار قبل frame. تبنّى focusInvalid عقد focusField المشترك
الموسع من الجذر (cancelOn/destroyRef/allowed)، مع سياق actor/route/mode/id؛
تُلغى frames وoverlay timer بدل الاكتفاء بإخفاء المنافذ وقت revoke.

فحص TS/HTML parsing ووجود local imports شمل ملفات editor الثلاثة وأعاد
problems:[]، وgit diff --check نظيف. راجعت الديف المقيد والمصدر المنتج
والاستهلاك العام الجديد للصور. هذه أدلة مصدرية لا type checking أو build
أو قبول UI/DB؛ يلزم الجذر مراجعة الدمج مع القائمة وAPI/Media وحراس المسار.

بقي عدد طلبات التفاصيل واحدًا لكل bootstrap ناجح، وقراءات الاقتراحات
والمعاينة لا تعمل عند رفضها؛ لا قياس زمن/SQL أو ادعاء سرعة. لا migration
في هذه الملكية؛ AddAccidentBranchOwnership وتسوية بداية البيانات عند المالك
حسب العقد. لا build/tests/lint/browser/DB/migration/snapshot/commit/push
أو deployment نُفذت.

رسالة commit مقترحة لشريحة الواجهة، دون تنفيذ:
`feat(auth): bind accident editor drafts and attachments to current access`
