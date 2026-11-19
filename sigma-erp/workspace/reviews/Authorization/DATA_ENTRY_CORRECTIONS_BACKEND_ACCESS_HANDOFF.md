# تسليم صلاحيات التصحيحين والمرفقات الخاصة — الخلفية

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| العقد | DATA_ENTRY_CORRECTIONS_ACCESS_CONTRACT_FREEZE.md مع خطة ١٤ أكتوبر السابقة |
| الملكية | خلفية الموردين وملفاتهما وMedia والتصنيف/DI والمواصفات؛ لا واجهة أو دليل أو جرد أو وثائق canonical |

## القرارات المنفذة

يظل الموردان تعريفين مشتركين داخل الشركة بلا BranchId جديد أو أثر مالي.
لم تتغير SLA snapshots أو اختيار الاتفاقيات التاريخية غير المعدلة أو
status/metadata/numbering. يتبع الحراس العامون tenant والجلسة ذات الفروع
المسندة، وتصنف Available وقراءة المرفق WholeDocumentRead صريحة.

أضيف RetiredAttachments لكل كيان كـList<string>، مع initializer/default []
وJsonIgnore؛ لا VM أو payload أو أعمدة قائمة جديدة. المصالحة تحفظ المسارات
المزالة في هذا الدليل قبل map، والحذف الناعم يبقي Attachments والتاريخ.
هذه بيانات تفويض domain جديدة؛ لا backfill لمسارات قديمة أو إسناد ملكية
اختبار تخمينية. تبقى DTO shapes الحالية وخرائطها؛ غياب الحقل من المدخلات
يجعل AutoMapper يحافظ على التاريخ الذي يملكه helper دون Ignore زائد.

يتشارك DataEntryCorrectionService وDataEntryCorrectionModelService وMedia
cleanup مالك القفل DataEntryCorrection/tenant عبر ExecuteUniqueWriteAsync
وSerializable. يشمل Add/Update وAddList/UpdateList والحذف وClose للطلب
وHandleActive العام. يبقى كل save داخل مالكه السابق؛ لا إعادة حفظ
لتنظيف ملف ولا معاملات EF متوازية على DbContext. لا اختبار سباق منفذ.

تظل bulk paths الحالية متاحة لكن تتحقق من كامل الدفعة قبل tracking/المصالحة:
رفض null/negative/duplicate root IDs وفشل SLA/path، وعدم مشاركة ملف بين
صفين في الدفعة، ثم حفظ واحد. جرد محدود للموردين في Business/ServerAPI/tests
أثبت الخدمتين وواجهتيهما ومتحكميهما، ولم يثبت منتج ImportData موازٍ أو
مستهلك كتابة آخر؛ لا ادعاء فحص الحل كله. لم يعطل العامل bulk بالتخمين.

يفحص CorrectionInputPolicy الصيغة الخاصة لكل path، بما فيه المحتفظ به؛
لا توافق للـGUID العام القديم. CorrectionAttachmentPolicy يملك فحص الجديد
داخل القفل: tenant/uploader/وجود الملف، وعدم أي مرجع في Attachments أو
RetiredAttachments لأي من الموردين، بما فيه المحذوف نرمًا والمتعقب قبل
الحفظ. الصف Added الذي لم يُختم tenant عليه بعد يُعامل ضمن سياق الشركة
الحالي لهذا الدليل فقط؛ الختم نفسه يبقى في مالكه السابق.

## الملفات الخاصة وMedia

المجلد DataEntryCorrections ثابت. CorrectionAttachmentPath يعيد استعمال
PrivateUploadPath لقبول JPEG/PNG/PDF واسم uploader/GUID/extension الخادمي.
تؤكد IPrivateCorrectionAttachmentStorage.Exists الرفع المكتمل قبل ربطه.
يمد FileStore القائم مالك الملفات الخاص خارج wwwroot، مع تحقق التوقيع
والنوع/الحجم السابقين، دون storage wrapper أو تكامل خارجي جديد.

تُرفض static aliases القديمة قبل UseStaticFiles. يضاف GET:

`Media/correction-attachment?path=…`

مفتاحه الفعلي Media.ReadCorrectionAttachment في ReviewedPermissionOperations،
مع no-store/nosniff وContentType حسب الامتداد المقبول. لا توكن داخل URL.
تسجيل storage وCorrectionAttachmentMediaAccess scoped عبر FileStore نفسه.

تستهلك CorrectionAttachmentMediaAccess أدلة tenant-bounded من الموردين
بـIgnoreQueryFilters منفصل مقصود؛ الإسقاط bool حي/غير حي فقط دون labels
أو تفاصيل. الملف المرتبط حيًا لا يحذفه المدير أو العادي. قراءته تحتاج View
لكل مورد حي؛ التاريخ دون رابط حي لا يصبح draft. cleanup التاريخي يحتاج
Update أو Delete لكل مورد مرجعي، مع بقاء grant Media.DeleteMedia مستقلًا
عند فلتر endpoint. المسودة الحقيقية بلا مرجع لرافعها: القراءة مع Create/
Update لأي من الموردين، والتنظيف دون اشتراط بقاء business grant.

## الملفات والنطاق

المصادر تحت SigmaBackend:

- ملفات Helpers: كيانا DataEntryCorrection وDataEntryCorrectionModel،
  وSecurity/CorrectionAttachmentPath وIPrivateCorrectionAttachmentStorage.
- ملفات DataAccess: Configuration/DataEntryCorrectionConfig و
  DataEntryCorrectionModelConfig؛ لا migrations أو snapshots.
- ملفات Business: الخدمتان وHelperServices/CorrectionInputPolicy و
  CorrectionAttachmentPolicy؛ لم تتغير عقود المدخلات/المخرجات أو mapper.
- ملفات ServerAPI: Authorization/CorrectionAttachmentMediaAccess و
  ReviewedPermissionOperations وBranchOperationRules، وFileStore وProgram
  وMediaController فقط ضمن هذه الشريحة؛ تغييرات المركبات/الحوادث السابقة
  في الملفات المشتركة محفوظة.
- ملفات المواصفات: CorrectionAttachmentAccessTests وCorrectionAttachmentPathTests
  وTestCorrectionAttachmentStorage، مع حالتي قراءة في BranchOperationRulesTests.

قُرئت القواعد الحية والمهارة والعقد والخطة السابقة وكتل BE1/2/3/5/8 ومالكو
الملفات والقفل والمتحكم/الفلتر الحقيقيون. مراجع Speed/Odoo جمدها الجذر؛
لا قرار وظيفي أو مالي جديد هنا. مهارات Superpowers متاحة وقُرئت تعليمات
المواصفات والتحقق بحدود مصدرية؛ لا ادعاء دورة RED/GREEN غير منفذة.

## التحقق والمخطط والقبول المتبقي

أضيفت ٢١ Fact و٨ حالات path و٢ حالات تصنيف = ٣١ حالة مصدرية غير منفذة.
تغطي missing/other-uploader/live/retired/deleted/tracked ownership،
cross-resource grants، no-branch session، batch duplicate paths، retirement،
soft delete، idempotent Close، DTO/JSON history exclusion وstatic aliases.
أسماء المتحكمات/طرق التصنيف موجودة فعلًا. constructors المباشرة للتصحيحين
في tests محصورة بالمواصفة الجديدة وتمددت مع accessor/storage؛ لا fixture
old-GUID قائمة أُهملت؛ حالة old GUID الجديدة مقصودة لرفضها.

تمت مراجعة diff المحدد للمصادر المتتبعة وقراءة الملفات الجديدة/untracked
مباشرة، وفحص whitespace/merge markers المحدد. استُثبتت namespaces في
Helpers/Business/ServerAPI/tests وProjectReferences وSDK default compile
inclusion؛ لا نوع nested جديد أو DTO مسجل عارضًا في DI scan. لا نجاح build
أو اختبارات/SQL يُدعى. لم تُشغل build/tests/lint/browser/DB/migration/reset/
snapshot/commit/push/deploy، ولم يُغير العامل حالة الهدف.

يلزم المالك تجهيز/تطبيق مخطط RetiredAttachments للموردين باسم مقترح:

`AddCorrectionAttachmentOwnershipHistory`

يُراجع default JSON [] والrequired/nullability وترجمة primitive collections
على SQL Server الفعلي. لا هجرة أو snapshot أو مسح أو نقل ملفات فعلي هنا.
تُرفض المسارات العامة القديمة عمدًا وفق baseline البيانات التجريبية.

الأداء: لا تغيير list Count/paging أو direct Available ولا cache جديد.
فحص ربط مجموعة ملفات جديدة يستخدم استعلامي Any على Attachments/Retired
للموردين مع فحص الملفات لكل path؛ bulk يكرر validation لكل صف داخل
قفل الدفعة. قراءة Media تستخدم استعلامي projected bool؛ يلزم المالك فحص
SQL translation لـAny/Contains والـJSON وحجم الأدلة والذاكرة/IO/plans،
خصوصًا bulk والملفات التاريخية. لم يقس زمن أو سرعة. لا index JSON عام
مقترح بلا خطة/حجم؛ PK/FK التقليدي لا يثبت تغطية membership داخل JSON،
وأي فهرس/تفكيك مستقبلًا يحتاج عقدًا ودليلًا منفصلين.

قبول المالك المجمع: schema ثم compilation والمواصفات، ordinary/admin
ومجموعة grants مستقلة، cross-tenant/uploader، draft/live/retired/delete
والقراءة/التنظيف بعد replacement، تزامن attach/delete عبر الموردين وbulk،
Close متزامن، تخزين فعلي وصور/PDF/static rejection. يملك الجذر تكامل الواجهة
وFileLink والدليل والجرد والتدقيق النهائي؛ هذا التسليم لا يرقّي الوحدة.

رسالة commit مقترحة فقط:
`Enforce correction attachment ownership and private media lifecycle`
