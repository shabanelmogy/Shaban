# تسليم صلاحيات خلفية عقود التأجير العامة

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | خلفية `LeaseAgreement` وتدقيق قراءة فقط لقائمة الواجهة |

## الحدود والمراجع المقروءة

- نُفذت شريحة الخلفية فقط وفق عقد
  `LEASE_AGREEMENT_ACCESS_CONTRACT_FREEZE.md`، دون تعديل الواجهة.
- قُرئت قواعد مساحة العمل الحية، ومهارة Sigma، وكتل الخلفية
  `BE3/4/7/8/14/15`، وكتلة الصلاحيات `UI26`.
- قُرئ مدخل Speed، ودورة `01-rental-and-lease`، وشاشة
  `10-lease/screens/07-agreements` والكود المرتبط بـ`C0849`؛ استُخدم
  كمرجع وظيفي لا كإثبات لصلاحيات خادم Sigma. لم تبق فجوة مفهومية تحتاج
  الرجوع إلى Odoo في هذه الشريحة.
- كان فحص الحزم الثماني سليمًا عند تسليم الجذر. لم تُعدل الكتب أو الحزم.
- لم تُشغل builds أو tests أو lint أو قاعدة بيانات أو migrations أو متصفح أو commits.

## النتيجة المصدرية

| المجال | القرار/النتيجة | الدليل |
|---|---|---|
| منح الإجراءات | كل عملية مخصصة تحت `LeaseAgreement` تحتاج `View` مع منحتها الفعلية؛ تبقى `Create/Lookup/Validate` مستقلة | `PermissionAuthorizationFilter` وعقد التجميد |
| التفعيل | `Activate` الموروث غير قابل للإسناد، والخدمة تعيد 405 بدل تغيير `IsActive` | `PermissionEndpointResolver` و`LeaseAgreementService.HandleActiveAsync` |
| الفروع | لم تتغير السياسة؛ المالك الحالي يقرأ فرع المركبة وكل فروع الاستبدال: المصدر، دخول المركبة العائدة، خروج المركبة البديلة | `BranchScopeRegistry.ConfigureOwnershipEdges` و`LeaseAgreementBranchOwnershipEdge` |
| القراءة | القائمة إسقاط محدود ومجزأ؛ عقد التفاصيل صار lean ويرث الهوية والرقم فقط، والتفاصيل وكل سياقات التمديد/الإغلاق واستبدال السائق والمركبة تسقط تسميات المراجع المحذوفة أو العابرة للمستأجر | `LeaseAgreementDetailVM` و`LeaseAgreementProfiler` و`DetailCoreAsync` وعمليات `Get*ContextAsync` |
| سجل الفوترة | لا يجمع إيصالات الفرع المرئية جزئيًا؛ يجرد إيصالات المستأجر الحية غير المبطلة، يرفض whole-document reader إذا لم يملك الممثل كل فروعها، ثم يحسب الإجمالي الكامل فقط | `GetBillingHistoryAsync` و`BranchAccessSnapshot.AllowsRead` |
| تعليمات الدفع | التعليمة والشيكات وخيارات طرق الدفع مقيدة صراحة بمستأجر العقد والحالة الحية؛ الخيارات جزء من context ولا تحتاج منحة lookup عامة جديدة | `GetPaymentInstructionsAsync` |
| قراءات الأبناء التشغيلية | الخصومات والرسوم الإضافية والسجل وسياق تاريخ التسليم تبدأ من عقد الأب المحروس بفلتر المستأجر/الفرع؛ قراءات الأبناء تستخدم مستودع المستأجر وتستبعد المحذوف، ولا يوجد تجميع فرعي يعرض نتيجة جزئية | `GetDiscountsAsync` و`GetAdditionalChargesAsync` و`GetLogsAsync` و`GetDeliveryDateContextAsync` |
| ملكية الأبناء | التحديث يتحقق من معرفات الأبناء المرسلة مقابل أبناء العقد، ويحجب إنشاء Provision جديد عبر المحرر، والحذف يجمع أبناء tenant الحيين فقط | `ValidateChildOwnership` و`ValidateProvisionRemoval` ومسار `RemoveAsync` |
| الوثائق | الرفع الجديد يُكتب تحت `App_Data/PrivateUploads/<tenant>/LeaseAgreementDocuments` باسم مربوط بالرافع؛ المسار القديم والجديد لا يُخدمان static؛ مالك وصول خاص يطلب `View + UploadDocument` ويمنع Media من حذف ملف ما زال مرتبطًا بسجل؛ ربط الملف بالعقد وحذف رفع غير مرتبط يشتركان في قفل `LeaseAgreement` تسلسلي واحد لإغلاق سباق claim/delete؛ لا API قراءة جديد لأن العقد يعرض `HasDocument` فقط | `LeaseAgreementDocumentPath` و`LeaseAgreementDocumentMediaAccess` و`LeaseAgreementService.SetDocumentAsync` و`FileStore` و`Program` و`LeaseAgreementController` |
| مسار الحفظ | `FileStore.Upload` يعيد صيغة المسار الخاص نفسها التي يقبلها `IsValidDocumentPath` قبل أي تعديل أو `SaveChanges`; لا يوجد فرع حفظ لاحق يعيد تفسير المسار أو يرفضه | `LeaseAgreementDocumentPath.TryParse` و`SetDocumentAsync` |
| المخطط | لا تغيير entity/EF/schema مطلوب | مراجعة المصدر المنفذة |

## ملحق تجميد داخلي — تحقق الملف وتنظيف الاستبدال

بعد التدقيق المستقل جُمّد مالك التخزين الخاص التالي دون API خارجي جديد:

- لا يقبل `SetDocumentAsync` مسارًا صحيح الشكل فقط؛ يجب أن يثبت
  `IPrivateLeaseAgreementDocumentStorage.Exists` وجود الملف داخل جذر المستأجر،
  وأن اسم الملف مربوط بالرافع الحالي، وغياب المالك من DI يفشل مغلقًا.
- تنظيف الرفع الجديد الفاشل يبقى عبر Media العام ومقيدًا بالمستأجر والرافع
  والمنح.
- تنظيف المسار القديم بعد استبدال ناجح يستخدم عملية داخلية للمتحكم لا تشترط
  أن يكون الرافع القديم هو المستخدم الحالي. تعمل تحت قفل
  `LeaseAgreement` التسلسلي نفسه، وتعيد فحص كل سجلات الربط مع
  `IgnoreQueryFilters`; إذا بقي المسار مرتبطًا بأي سجل فلا يُحذف. لذلك لا يمكن
  لمس الوثيقة الجديدة المحفوظة أو مسار قديم أعيد استخدامه.
- التبعيات: `LeaseAgreementService` يستهلك مالك التخزين اختياريًا للمحافظة
  على توافق fixtures/constructors، لكنه fail-closed عند الحفظ؛ الإنتاج يسجله
  صراحة إلى `FileStore`.

## مواصفات مصدرية غير منفذة

- `LeaseAgreementEndpointAccessTests`: شرط `View` مع المنحة المخصصة، استقلال
  `Create/Lookup`، تصنيف القراءة/الكتابة للفروع، وعدم قابلية إسناد `Activate`.
- `LeaseAgreementPrivateDocumentPathTests`: tenant/uploader binding، رفض المسارات
  القديمة/المصطنعة، وحجب طلبات static بما فيها الترميز المتكرر.
- `LeaseAgreementDocumentMediaAccessTests`: منع حذف ملف محفوظ عبر Media، والسماح
  بتنظيف رفع خاص غير مرتبط بواسطة رافعه بعد تحقق منح العقد، ورفض مستأجر أو
  رافع آخر أو غياب منحة الرفع، مع إبقاء المسار محجوزًا حتى إذا كان سجل الربط
  soft-deleted. تستخدم المواصفة سياق seed محايدًا حتى لا تحجبها حراسة حفظ
  الفرع قبل الوصول إلى سياسة Media.
- `LeaseAgreementReadContractTests`: يثبت أن عقد التفاصيل لا يرث حقول tenant/audit،
  وأن mapping القائمة يحجب تسميات المراجع المحذوفة أو التابعة لمستأجر آخر.
- `LeaseAgreementPrivateDocumentStorageContractTests`: مواصفة structural
  reflection-only تثبت أن `FileStore` يطبق واجهة مالك الوجود ويعرض مسار
  التنظيف الداخلي. لا تثبت دلالات tenant/uploader/file-existence أو إعادة فحص
  claim والحذف؛ قبول هذه الدلالات يظل مصدرّيًا هنا والتنفيذ الفعلي معلقًا.
- الاختبارات الموجودة الخاصة بنطاق الفروع تظل مالك إثبات المركبة وحواف
  الاستبدال. لم تُشغل أي مواصفة في هذه المهمة.

## تدقيق الواجهة للقراءة فقط

قُرئت النسخة الحالية من القائمة وقالبها و`lease-agreement-access.ts` وخدمة
HTTP ومواصفات `list-access` و`mutation-context` و`route-access` دون تعديل.

| الحالة المطلوبة | النتيجة المصدرية |
|---|---|
| سحب/إعادة منح سريعين | `policyWatch` يراقب `View` والمنح الاختيارية الممنوحة، ويلغي القراءة ثم يعيد bootstrap مرة بعد الاستقرار؛ لا إعادة bootstrap لمجرد revision غير متعلق |
| انتقال الممثل A→B→A | `denied$` متزامن مع تغير السياق؛ ينهي مالك A عند B، ثم يجعل العودة إلى A تغير ممثل فعليًا وتصفّر الفلاتر والنتيجة القديمة |
| ذيل حذف مرسل | الطلب المرسل لا يُلغى عند denial/destroy؛ `CAN_PRESENT_API_OUTCOME` يمنع النشر القديم، ويبقى busy حتى finalize ثم يسمح باستعادة القائمة دون إعادة إرسال الحذف |
| لوكات المرشحات الاختيارية | لا تُطلب دون منحها، وتُمسح قيمها عند السحب؛ سحب أي منحة كانت مفعلة يلغي bootstrap الجاري ويعيده بالعقد الجديد |
| التصدير | مربوط بـ`readCancelled` و`denied$(View)` وبهوية/نسخة القائمة؛ لا ينشر ملفًا بعد تغير السياق |
| مواصفات المصدر | الحالات المذكورة موجودة في المواصفات الثلاث، لكنها غير منفذة وفق حد المصدر فقط |

لم يظهر finding مؤكد جديد في تدقيق القائمة بعد تعديل الجذر الأخير لإضافة
مراقبات المنح الاختيارية. يبقى إثبات التوقيت المرئي والتنفيذ الفعلي وقبول
السباقات عند المالك.

## الأداء والمخاطر المتبقية

- القائمة تنفذ count ثم page projection بترتيب حتمي و`AsNoTracking`؛ لا
  materialization كامل أو enrichment per-row. لم يُقاس SQL أو الزمن.
- لم تُثبت حاجة index جديدة من هذه الشريحة وحدها. يلزم SQL plan وقياس ببيانات
  تمثيلية قبل اقتراح schema؛ لا migration مطلوبة الآن.
- يبقى build/compile/runtime/database/browser acceptance معلقًا. الملف القديم
  الموجود تحت `wwwroot` أصبح محجوبًا بطبقة static، لكنه لم يُنقل أو يُحذف لأن
  المهمة لا تفوض ترحيل بيانات/ملفات قائمة.

## ملفات التنفيذ

- `SigmaBackend/SiGma.Business/Services/AgreementServices/LeaseAgreementService.cs`
- `SigmaBackend/SiGma.ServerAPI/Controller/LeaseAgreementController.cs`
- `SigmaBackend/SiGma.ServerAPI/Authorization/PermissionEndpointResolver.cs`
- `SigmaBackend/SiGma.ServerAPI/Authorization/PermissionAuthorizationFilter.cs`
- `SigmaBackend/SiGma.ServerAPI/Authorization/LeaseAgreementDocumentMediaAccess.cs`
- `SigmaBackend/SiGma.ServerAPI/Extensions/FileStore.cs`
- `SigmaBackend/SiGma.ServerAPI/Program.cs`
- `SigmaBackend/SiGma.Helpers/Security/LeaseAgreementDocumentPath.cs`
- `SigmaBackend/tests/SiGma.BranchAccess.Tests/LeaseAgreementEndpointAccessTests.cs`
- `SigmaBackend/tests/SiGma.BranchAccess.Tests/LeaseAgreementPrivateDocumentPathTests.cs`
- `SigmaBackend/tests/SiGma.BranchAccess.Tests/LeaseAgreementDocumentMediaAccessTests.cs`
- `SigmaBackend/tests/SiGma.BranchAccess.Tests/LeaseAgreementReadContractTests.cs`
- `SigmaBackend/tests/SiGma.BranchAccess.Tests/LeaseAgreementPrivateDocumentStorageContractTests.cs`

رسالة commit مقترحة للمستودع الخلفي:

`feat(lease-agreement): enforce access prerequisites and private document storage`
