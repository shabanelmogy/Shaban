# متابعة تبني صلاحيات محاكاة رسائل عملاء التأجير

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| العقد | LEASE_CUSTOMER_SMS_ACCESS_CONTRACT_FREEZE.md |
| النطاق | صلاحيات الوظائف الموجودة فقط؛ إرسال فعلي غير منفذ بالعقد السابق |
| الحدود | Source-only؛ لا tests/build/typecheck/lint/browser/DB/migration/snapshot/commit/push/deploy |

## الخادم

Search وSimulate موجودتان أصلًا في ReviewedPermissionOperations؛ لا أضيفت
نسخ منح مكررة. أضيف التصنيف WholeDocumentReads لكليهما حتى لا يغير POST
محاكاة بلا آثار نطاق الفرع إلى تسجيل حركات. الفلتر القائم يتطلب Search
إضافية عند Simulate للعادي؛ المنحة الأساسية Simulate تظل بمالك resolver
وPermissionGrantQueries، وadmin verified يمر عبر قواعده الحالية. لا read
من/إلى شركة أخرى أو IgnoreQueryFilters في خدمة المحاكاة.

BuildRecipientQuery يقرأ tenant/live Partners مع Individual/Company كهوية
واحدة للعميل، ويشترط Any لاتفاقية غير مبطلة من Repository تحت scope كامل
للمستند. Search يطبق search وGridFilter قبل Count ثم Order/ThenBy(Id)/
Skip/Take، والحقول الستة في VM هي المعروضة مع Id. Simulate تطلب كل IDs
مميزة، وترفض عدم أهلية أي واحدة، وتحصي وجود الجوال فقط؛ لا إرسال/رصيد/
log أو SaveChanges. سياسة customer inactive الموجودة لم تتغير.

المواصفات المصدرية غير المنفذة: حالتان لكتالوج المفاتيح الفعلية، حالتان
لتصنيف الفروع، وسبع حالات endpoint لقراءة فقط، غياب كل من المنحتين، منحهما
معًا والمدير. تستخدم الفلتر الحالي بممثل مربوط وفرع View-only؛ لا إثبات
نجاح تنفيذ أو SQL من كتابة الحالات.

## الواجهة والتكامل

الـregistry ومسار البداية يستهلكان read الفعلية من helper واحد بملكية
الشاشة. sidebar يستخدم registry القائم دون override محلي. لا route
إنشاء/تعديل مخترع. استُلمت الشريحة والقوالب والمواصفات من العامل وقُرئت
مباشرة، مع helper واحد للمنحتين. انتهى التدقيق المستقل للواجهة والخلفية
بلا findings مؤكدة؛ أُغلقت قبل التسليم فجوة إعادة تسليح simulation watcher
بعد rapid revoke/regrant، وإظهار toast مكرر للـPOST القراءة. يتتبع watcher
interrupted مستقلة، ويبقى النموذج mounted hidden/inert حتى عند فقد Search؛
والجدول disposable لغلق portals. لا إعادة POST تلقائية عند استرداد المنحة.

أُحدّث موضوع /LeaseCustomerSms في lease-guide.ts داخل /UserGuide/lease
بفصل المنحتين، نطاق المستلمين، طبيعة المحاكاة وإلغاء المخرجات/المسودة
عند السياق؛ طابقت النسخة النهائية. لا موضوع جديد مكرر. موديلات الأعداد
والأخطاء والـDTOs لم تتغير، والقوالب تستعمل مفاتيح EN/AR الموجودة. خدمة
root-provided تحل عبر app.config HttpClient الوحيد بinterceptors؛ لا حاجة
لإضافة تسجيل قديم في LayoutModule رغم الوصف التاريخي في العقد السابق.

## التحميل والكاش والأداء

لا lookup أو كاش مستهلك؛ القراءتان operational مباشرتان. تتبع page
start/finalize وإلغاء grant/context/navigation طابقت بتسليم الواجهة:
GET وPOST simulation كلاهما page global مع local busy/error/Retry،
showPageLoading=true، وNAVIGATION_READ_ONLY=true لPOST بالاسم المحدد.
X-Skip-Error-Interceptor وX-Skip-Success-Toast يبقيان النتيجة والخطأ
محليين بمالك واحد. لا تطبيق لذلك على إرسال مستقبلي أو mutation عامة.
لم تُضف realtime topics أو مزود أو جدول أو فهرس. البحث Count ثم page
بـDbContext واحد؛ المحاكاة تحقق recipients في query واحدة دون per-row
HTTP. لا EF parallel أو aggregate مخترع. الربط Any يفضل predicate
LeaseAgreement(SubscriptionId,CustomerId,IsVoided,IsDeleted) نظريًا؛ لا
اقتراح schema مطبق، ويلزم مقارنة فهارس FK/tenant الحالية والخطة والأحجام
قبل ترشيح composite إضافي. لا ادعاء تحسن مقاس من منع الطلبات المحجوبة.

التجربة النهائية عند المالك: حساب Search فقط، الحساب ذو المنحتين،
Simulate فقط يرفض المسار والطلب المباشر، مدير الشركة، tenant/branch
مختلف، revoke/regrant/actor وتوازن التحميل/الاختيار/الرسالة. البناء
والمواصفات وSQL والواجهة وRTL والثيمان والموبايل لم تُنفذ.

## المصالحة والتحقق

استُهلكت [ملكية الواجهة](LEASE_CUSTOMER_SMS_ACCESS_HANDOFF.md):٢٢مواصفة
غير منفذة. كتب root١١حالة خلفية غير منفذة ومواصفة registry لاستقلال
Search/Simulate ورفض View الوهمية، والمصدر الحالي يطابقها. parsing/import
existence لـ١٢ملفًا وقالبًا problems=[]؛ scoped diff --check سليم مع
تحذيرات EOL فقط. XML المشاريع الخمسة المرتبطة سليم، وnamespaces/imports
والإدراج default SDK للخلفية قُرئت مباشرة بما فيها الملفات untracked.
Check للحزم الثماني OK؛ لا تعديل canonical أو توليد جديد في الشريحة.

قُرئ scoped diff بالمستودعين، وملفات Authorization الخلفية غير المتتبعة
قُرئت مباشرة لأنها لا تظهر في git diff؛ حُفظت تغييرات الوحدات السابقة.
جذرا BillDetail تقاعدا في شريحة مستقلة ولا يثبتان إقفال Bill المالي.
رُقي صف LeaseCustomerSms وحده: الجرد١٢٢مؤكدًا و٧٨محدد المورد و٥٩unknown
و٢context-only و٢alias من٢٦٣baseline، منها أربعة صفوف تاريخية متقاعدة.

القرارات المتبقية في عقد الإرسال الفعلي ليست أفعالًا موجودة أُهملت؛ لا
يدّعي هذا الإقفال إرسالًا/مزودًا/قالبًا/رصيدًا. لا migration مطلوبة، ولا
AutoMapper/financial calculations جديدة. رسالة مقترحة للواجهة:
`fix(lease): enforce SMS simulation read and action lifetimes`، وللخلفية:
`fix(auth): require recipient access and read branch scope for SMS simulation`.
التفويض استخدم عامل تنفيذ واجهة، ومدققًا مستقلاً للواجهة وآخر للخلفية
بعد تجميد العقد وملكية غير متداخلة؛ الجذر دمج وراجع المصدر والجرد والدليل.
لم تُنفذ الأوامر المحظورة، ويظل هدف صلاحيات التطبيق active.
