# Individual / Company — implementation and comprehensive review

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Date | 2026-10-01 |
| Five requested fixes | Implemented — source-only |
| Comprehensive review | Source-read-only; additional findings remain open |

## النتيجة

الملاحظات الخمس اتنفذت في الباك إند، والدليل والـ skill اتحدثوا معها. المراجعة
الشاملة للفرونت والباك كشفت مشاكل أخرى؛ أهمها حماية بيانات Individual عند فشل
التحميل، وملكية العنوان والفوترة عند التعديل، وعقد بيانات البطاقات الحساسة.
Company أقرب للنمط المطلوب من Individual في التحميل والتعديل والملفات، لكن ما زال
فيها ملاحظات تحقق وتنقل واستيراد. هذه مراجعة مصدر، وليست إثبات نجاح التشغيل.

## ما تم تنفيذه

| الملاحظة | التنفيذ |
|---|---|
| حماية التكرار | قفل SQL Server تطبيقي مشترك لكل نوع كيان/اشتراك داخل transaction عادية، تستخدمه Base Add/Update عند وجود UniqueColumns، ويستخدمه استيراد Company وIndividual. Company تحتفظ بتعديلها المتتبع داخل UpdateCoreAsync. مهلة القفل 10 ثوانٍ، والفشل يوقف الكتابة؛ لا توجد إعادة محاولة تلقائية. |
| مجموعة الاتصال | CustomerGroupIdAsync في الخدمة الموجودة: الافتراضية عند عدم الاختيار، والتحقق من Customer/الاشتراك/وجود المجموعة عند الاختيار. تغطي CRUD وتغيير المجموعة والاستيراد. فحص الاشتراك يسبق أي حفظ للبيانات الافتراضية. |
| ترقيم الصفوف الجديدة | UnitOfWork ترقّم صفوف EntityBase بحالة Added ورقم فارغ قبل الحفظ المتزامن وغير المتزامن. المولد يرقّم صفًا واحدًا ويحفظ الأرقام غير الفارغة؛ أزيل استدعاء ترقيم السائقين الخاص بالشركة. الترقيم المبكر للسجل الرئيسي بقي بسبب ثلاثة مستهلكين يقرؤون الرقم قبل الحفظ. |
| التواريخ | NotFutureDate على BirthDate في Individual Add/Update، وفحص مماثل في الاستيراد. أزيل تكرار فحص تواريخ المستندات من الخدمة؛ DateAfter موجود على VMs المشتركة. |
| وضوح التعديل | OwnsEveryRow خاصة بالشركة، وRemoveDroppedAsync وSaveUpdateAsync في Base، مع استمرار فحص الاستخدام والحذف المنطقي وحفظ aggregate مرة واحدة. |

تفاصيل الملفات والقرارات وحدود الترقيم والتحقق:
[خطة التنفيذ والمطابقة](<F:/My Work/Sigma/reviews/CUSTOMER_SHARED_WRITE_FIXES_PLAN.md>).

**حدّ مهم:** إزالة traversal من المولد تمنع المولد نفسه من إعادة ترقيم graph محفوظة.
هذا لا يصحح مسار AutoMapper/ربط الكيانات القديم في Individual Update؛ الملاحظة R4
أدناه ما زالت مفتوحة. كما أن CountAsync + 1 لم يتحول إلى sequence آمنة في هذه المهمة.

## أهم ملاحظات المراجعة بالأولوية

| # | الأولوية | الملاحظة والأثر | مسار الإصلاح المقترح |
|---|---|---|---|
| R1 | P1 | Individual Edit يسمح بالحفظ بعد فشل تحميل التفاصيل. ملء الحقول الأساسية يمكن أن يرسل ID القديم مع documents/cards فارغة وبيانات عنوان/فوترة افتراضية؛ full snapshot قد يحذف تفاصيل محفوظة. | ready/load-error/retry واضحة، ومنع Update قبل تحميل snapshot ناجحة. |
| R2 | P1 | Base Update يتحقق من ملكية collections فقط. Individual يمكنه قبول ID لعنوان أو فوترة يخص عميلًا آخر داخل نفس الاشتراك، ثم تعديل الصف أو ربطه بالعميل الحالي. | التحقق من ملكية المرجعين، وتحميل الصفوف المتتبعة قبل mapping. فحص الوجود والاشتراك وحده لا يثبت ملكية العميل. |
| R3 | P1 — قرار مؤجل | رقم البطاقة الكامل وCVV ما زالا في الكيان وDetailVM ونماذج التعديل. إزالة تصدير البطاقات لم تزل هذا التخزين/الإرجاع. | عقد token/last-four وعدم الاحتفاظ بـ CVV؛ تنظيف البيانات وتغيير schema يحتاجان قرار المالك. لا تستبدل القيم بأقنعة داخل mapper الكتابة. |
| R4 | P2 | generic Individual Update يربط graph منشأة من VM قبل تحميل الصفوف، ثم يستخدم entity-to-entity mapping. الحقول الغائبة عن VM، ومنها No، يمكن أن تُستبدل بقيم افتراضية. | إصلاح ترتيب التحميل والربط وتحديث الصف المتتبع مباشرة من VM. الحل الجزئي داخل اللوب وحده لا يكفي. |
| R5 | P2 | Individual Save يعتمد على حقول summary دون form.invalid؛ بعض surcharges السالبة تصل للباك. التواريخ المكتوبة يدويًا وبعض قواعد المستندات/الحقول المطلوبة غير متوافقة بين الجانبين والدليل. | form.invalid مع specs كاملة؛ validators مشتركة للتواريخ؛ تطبيق عقد المستندات المقرر ومطابقة required/minimum بين الفرونت والباك. |
| R6 | P2 | Individual لا يمنع Save/Close أثناء upload، وحذف صف مستند كامل لا يتتبع الملف القديم في Individual/Driver. Shared tracker يستخدم مؤشر upload واحدًا يمكن أن ينتهي قبل اكتمال رفع متزامن آخر. | busy مشتركة دقيقة، وحفظ original paths وتنظيف المحذوف بعد نجاح الحفظ، مع عرض فشل التنظيف وإعادة المحاولة. |
| R7 | P2 | استيراد الشركة يحول قيمًا غير صحيحة إلى 0/false، ومفتاح inActive القديم لا يطابق IsInactive. استيراد Individual يستخدم parser ملتبسًا لليوم/الشهر. أخطاء الاستيراد العادية قد لا تظهر للمستخدم. | عقد CSV صريح، أخطاء لكل خلية غير صحيحة، أسماء DTO مطابقة، parser التاريخ المشترك، fallback رسالة وfinalize للـ loader. |
| R8 | P2 | ImportDataController لا يحمل Authorize ولا توجد fallback policy. فحص الاشتراك الجديد يمنع حفظ العملاء/إنشاء المجموعة من دون اشتراك صالح، لكن الطلب غير المصدق يدخل preflight وينتهي بفشل بدل 401 مبكر. | حماية تسجيل الدخول على الحد المشترك للاستيراد. هذه مسألة authentication مستقلة عن صلاحيات الأدوار المؤجلة. |
| R9 | P2 | pageSize من URL في Individual يمكن أن يتجاوز حد الباك 100، فتختلف حالة الجدول عن الصفحة المرجعة. | توحيد الحدود وحالة URL/الجدول مع عقد pagination. |
| R10 | P3 | Company step header يتجاوز تحقق Next. ما زالت specs/بعض row bindings والمفاتيح المشتركة والترجمة العربية والـ legacy roots وصفحات CSV مختلفة عن الدليل. Individual View تعتمد على edit lookups رغم وجود أسماء محفوظة في DetailVM. | استخدام أصحاب الأنماط المشتركة الحالية؛ قراءة الأسماء في View؛ إغلاق ديون G7–G12 وفق خطة إصلاح محددة. |
| R11 | P2 | استيراد الشركة يتجاهل عنوانها/بلدها، ويتجاوز قيود billing المشتركة. الاستيراد يقبل enum رقمية غير معرفة وDOB غائبة تتحول إلى 0001. Individual VMs لا تحمل بعض حدود أطوال الأعمدة. | mapping للعنوان وcountry lookup، وتطبيق القيود الحالية في كل writer، ومطابقة حدود VMs مع EF. لا تُخترع قيم افتراضية مكان بيانات ناقصة. |
| R12 | P2 | استيراد العملاء يرسل نص exception الداخلية إلى المتصفح في أخطاء persistence غير المصنفة. | تسجيل التفاصيل على الخادم وإرجاع رسالة آمنة ومترجمة للعميل، مع استمرار أخطاء الصفوف المفهومة. |

الدليل التفصيلي لكل ملاحظة، مع الملفات والأسطر وحدود الاستنتاج:

- [مراجعة الفرونت الكاملة](<F:/My Work/Sigma/reviews/CUSTOMER_COMPREHENSIVE_FRONTEND_REVIEW.md>).
- [مراجعة الباك الكاملة](<F:/My Work/Sigma/reviews/CUSTOMER_COMPREHENSIVE_BACKEND_REVIEW.md>).

الملاحظات الإضافية أعلاه لم تُنفذ ضمن الملاحظات الخمس. الإصلاح الوحيد الذي أضافته
المراجعة إلى التنفيذ الحالي هو فحص الاشتراك قبل حفظ المجموعة الافتراضية، لإغلاق
مسار جانبي في الـ resolver الجديد. خطر البطاقات معروف في backlog؛ حذف بياناته
ليس قرارًا اتخذته هذه المراجعة.

## تغطية المراجعة وما يعمل وفق المصدر

- IndividualPartner وCompanyPartner: قوائم، routed create/view/edit، steps، validation،
  typed payloads، documents/cards/address/billing، lookups وreturn state.
- CompanyDriver وCompanyContactPerson: المسارات المستخدمة وmodal editors؛ draft السائق
  الداخلي ونقل ملفات draft إلى aggregate عند حفظه؛ الفروع القديمة غير الموصولة
  مميزة في تقرير الفرونت ولا تُعامل كأخطاء في الشاشة الحالية.
- Backend: controllers/interfaces، خدمات العملاء وDriver، VMs، profiles، نموذج EF،
  tenant/live filters، ملكية الصفوف، الحذف والمراجع، default-group side effects،
  duplicate guards، أرقام المستندات وCSV imports.
- القوائم الحالية تستخدم shared shell/filter panel/data-table مع fill. حقول الجدول
  وListVMs متطابقة؛ التفاصيل في جدول المطابقة بتقرير الفرونت. inactive-only صحيح الآن.
- عائلات filter keys، paging/sort العادي، Excel عبر كل الصفحات وعودة list state
  سليمة وفق المصدر. DriverListVM أوسع عمدًا لمستهلك agreement driver picker.
- تصدير البطاقات أزيل من القائمتين، وExcel العادي لا يحمل بيانات بطاقات.
- Company تتحقق من ملكية collections والمراجع وdriver grandchildren قبل mapping،
  وتمنع Save عند فشل تحميل التفاصيل، وتتابع original attachment paths.
- لا توجد حالة موافقة أو أثر محاسبي جديد لحفظ العميل. Billing settings مدخلات إعداد؛
  لا تُخترع calculation أو workflow جديدة.

## القرارات والنطاق

| القرار | السبب والدليل |
|---|---|
| Backend Pattern 2؛ UI type 03 للعميل الفردي والشركة | aggregate تفاصيل محفوظة كاملة، وخطوات محرر في route؛ لا يوجد journal posting عند حفظ العميل. Driver/Contact modal type 01 كما في المصدر. |
| قفل تطبيقي مشترك بدل Serializable للشركة | طلب المالك، ونفس قاعدة UniqueColumns في Individual؛ توحيد API/import participating writers دون indexed views أو schema جديدة. |
| default group قبل aggregate mutation/guard | الخدمة تحفظ scoped context؛ فصلها يمنع حفظ تعديل جزئي للعميل. البيانات الافتراضية قابلة لإعادة الاستخدام حتى إذا فشل العميل. |
| لا نلغي root numbering المبكر الآن | CustodyMovement وNRM وWorkshopMovement تنسخ No قبل save؛ الحفاظ على التوافق مثبت بالمستهلكين. |
| لا نصلح sequence أو generic graph update ضمن خمس ملاحظات | الأول له خطة عامة مؤجلة؛ الثاني وجد في المراجعة الشاملة ويتطلب إصلاح تحميل/ربط وملكية متكامل. لا نصف الترقيم الجديد بأنه يصلح الاثنين. |
| Additional findings تظل مراجعة فقط | طلب التنفيذ يخص الملاحظات الخمس ثم المراجعة. إصلاح جديد قد يغير عقود required fields أو ملكية graphs أو الاحتفاظ بالبيانات. |
| لا تعديل فرونت في التنفيذ الحالي | شكل API بقي نفسه، والـ BirthDate picker فيها maximum بالفعل؛ فجوات التحقق الأخرى مسجلة للمراجعة التالية. |
| Authorization candidates دون permission API جديدة | صلاحيات الأدوار مؤجلة حسب قرار المالك؛ تقريرا الطبقتين يسجلان المرشحين. Authentication الاستيراد ملاحظة مستقلة. |

## التحقق والمطابقة

المراجعة الحالية للمصدر فقط. root راجعت scoped backend diff، والـ interfaces
وDI والـ localization والـ number consumers، وراجعت أدلة أهم نتائج المراجعين.
فحص backend/documentation `git diff --check` مرّ. فحص ترجمة الفرونت للمجموعات
المراجعة أظهر parity 299/299؛ هذا ليس build. فحص مراجع الدليل والـ skill
`Check-BookReferences.ps1` مرّ بعد اكتمال التقريرين: كل المراجع المفحوصة موجودة.

تقريرا المراجعة اكتملَا: 18 ملاحظة frontend و9 ملاحظات backend، مع تداخل بعض
العقود في الطبقتين. جدول الأولويات أعلاه يجمع المواضيع، ولا يعتبرها 27 مشكلة مستقلة.

**الدليل والـ skill:** Backend 0.67؛ blocks 3/5/8/11/14/19 محدثة مع changelog
و§8.4/history في skill. الثمانية generated packets ما زالت stale؛ استخدمت الكتب
الأصلية، ولم أعدل generated files. regeneration وsemantic review معلقتان.

**Migration:** الملاحظات الخمس لا تضيف entity/field/index ولا تتطلب migration جديدة.
CompanyConfig تغير فيها تعليق فقط في هذه المهمة. تغييرات EF السابقة الموجودة في
working tree ومهاجراتها المعلقة ليست محسومة بواسطة هذا التقرير. أضيف مرجع
EF Relational 10.0.9 إلى Repos، ويحتاج owner restore/build.

**اختبارات المالك المطلوبة:** concurrency بين CRUD/import لكل نوع/اشتراك؛ lock wait,
failure, rollback وouter transaction؛ wrong-type/default group؛ future birth date؛
Added children/No والأرقام اليدوية والثلاثة المستهلكين المبكرين؛ ثم مسارات failed
detail load/ownership/attachments/CSV/paging بعد تنفيذ نتائج المراجعة. اختبار العربية،
RTL، light/dark، عرض ضيق، scroll داخل المكونات، keyboard/focus والحذف يحتاج تشغيلًا.

**الوكلاء:** root نفذت الخمس وأصحاب الكتب والـ skill والتكامل. مراجعتان مستقلتان
بالنموذج الموروث: customer_backend_review وcustomer_frontend_review؛ لكل منهما ملف
تقرير واحد فقط، بلا تداخل source ownership. التقسيم مناسب لأن طبقتي القراءة
مستقلتان، ولم يُكرر تنفيذ التعديلات أو يفوض قرار العقد.

**القيود:** لا build/test/lint، ولا SQL/database commands، ولا migrations/snapshots،
ولا browser/runtime، ولا commit/push/deploy. تغييرات المستخدم السابقة محفوظة.
اقتراح backend commit: `refactor(customers): centralize write guards and aggregate helpers`.
اقتراح docs commit: `docs(customers): record shared write rules and comprehensive review`.

## Implementation follow-up — 2026-10-01

The owner subsequently authorized every comprehensive finding. This document
retains the original audit and its historical scope. Current implementation
dispositions, shared no-op save diagnosis, owner acceptance evidence and pending
decisions are recorded in
[the final reconciliation](<Archive/Completed/2026-10-23/CUSTOMER_COMPREHENSIVE_FIXES_FINAL_RECONCILIATION.md>).
The reported unchanged Individual save is now confirmed working by the owner.
