# مطابقة صلاحيات طلبات ونماذج تصحيح الإدخال

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| العقد | [العقد المجمد](DATA_ENTRY_CORRECTIONS_ACCESS_CONTRACT_FREEZE.md) |
| النطاق | القائمتان ومحررهما المشترك ومنح الإغلاق والمرفقات الخاصة |
| الحالة | اكتملت صلاحيات الشاشتين في المصدر وأُغلقت findings التدقيق؛ المخطط والتشغيل عند المالك |

## الأدلة والقرارات والمطابقة

قُرئ عقد الصيانة المجمد١٤أكتوبر ثم شرح Speed الأصلي S148 من
library/pages/08290416292651b0.html وsidebar لقطة٢٨أكتوبر لقسم تصحيح الإدخال،
ثم C0338 كاملًا وشرائح C0336 للحفظ/SLA/المرفقات/init. يدعم المرجع طلب دعم
بوصف واتفاقية ومرفقات ومفتوح/مغلق وإخراج؛ لا يثبت تصحيحًا ماليًا أو executor
أو قواعد خادم أو تفويض. سجل الردود والأولوية/customer-care coordination
فجوات منتج، ولا ادعاء اكتمالها أو اختراع grants. نموذج التصحيح مستقل محلي
وليس قالبًا ينشئ طلبًا تلقائيًا. مدخل Odoo قرئ بعد Speed؛ لا مفهوم مفقود
يحسم منح هذا المنتج المحلي. لا جمع خارجي أو مراسلات أو screenshot جديدة.

تطبق Master1/2/4/5/7، UI01 القائمة والمحرر dialog، UI2/7/9/10/13/14/18/22/26/27/28/29،
ونمط BE1 وقواعد BE2/3/4/8. ظل القالب والحقول والتنسيق وSLA/status/metadata
والحسابات على عقدها السابق؛ تغيرت المنح والعمر وخصوصية المرفق فقط.

| السطح | المتطلب الفعلي والنتيجة المصدرية |
|---|---|
| قائمة الطلبات/البحث/reset/refresh/فرز/ترقيم/Excel | DataEntryCorrection.View؛ Excel يجمع كل الصفحات بنفس المرشح، لا Export وهمي |
| قائمة النماذج | DataEntryCorrectionModel.View مستقل عن الطلبات |
| عرض محرر | View للمورد دون قراءة Available |
| إنشاء | Create للمورد + SupportSlaAgreement.Available |
| تعديل/الانتقال من View إلى Edit | View+Update للمورد + Available |
| حذف صف | View+Delete وعضوية كائن الصف الحالي والسياق، ثم إعادة الفحص بعد القرار |
| إغلاق طلب | View+DataEntryCorrection.Close وحالة Open؛ لا Update ضمني أو Reopen أو Close للنموذج |
| الانتقال للقائمة المقابلة | View لوجهة الرابط؛ لا يفتح عرض الطلبات النماذج |
| aliases create وdetails/:id | التحويل السابق للقائمة باقٍ ومحكوم بـView، ولا فتح محرر تلقائي أو سجل جديد |
| مصادر المرفق | Media.UploadMedia/ReadCorrectionAttachment/DeleteMedia مستقلة مع مالك السجل والرافع عند الخادم |

يستهلك registry والبداية وworkspace/editor نفس correction-access.ts؛
يحرس PermissionEndpointResolver/PermissionAuthorizationFilter generic
View/Create/Update/Delete، وClose/Available/Media keys المراجعة فعليًا.
صنفت Available وقراءة المرفق WholeDocumentReads. الموردان مشتركان داخل
tenant بلا BranchId أو أثر حركة جديد؛ تستمر شروط الجلسة والفروع العامة
ومنع الوصول عند انعدام فرع مسند. لا استنتاج فرع من اتفاقية خدمة.

## الحقول والمرشحات والـDTO

أعمدة الطلب EntryNo، DateTime، By، Detail، Status؛ نموذج القائمة المقابل
DataEntryCorrectionListVM يحمل هذه الخمسة وId للهوية فقط. أعمدة النموذج
Detail؛ DataEntryCorrectionModelListVM يحمل Detail وId. لا audit زائد.
المرشحات search/status وgrid/الترقيم/الفرز تطابق ListQuery ومالك الخدمة
العام؛ حالة Open=0 لا تضيع، وrecent closed/All كما العقد السابق.
Count/PageNo/PageSize/TotalPages من الخادم؛ تُرد الصفحة الخارجة لنطاقها.

مدخلات الحفظ Detail وSelectedSlaAgreementIds وAttachments ومعرف التحديث
فقط. الـmetadata/الحالة/SLA snapshot يملكها الخادم. RetiredAttachments
داخلي غير موجود في أي VM/payload، وموسوم JsonIgnore بالكيان. mapper
القائم يتركه دون Ignore زائد؛ helper يضيف الملفات المزالة قبل mapping.
لا حساب مالي أو دقة كمية أو ربط موظف/فرع جديد في هذا النطاق.

## المرفق والملكية والتزامن

أضيف RetiredAttachments للموردين كقائمة مسارات داخلية؛ هذا دليل تفويض
لملف أزيل رابطه، وليس واجهة تاريخ ملفات أو توافقًا لحفظ سجلات تجربة قديمة.
يمنع تحويل الملف السابق إلى draft أو إعادة ربطه من مورد آخر. الحذف الناعم
يبقي Attachments/history. لا backfill أو نقل/مسح ملفات أو reset.

كل Add/Update/AddList/UpdateList/Remove/Close/HandleActive من المنتجين
المثبتين وMedia cleanup يأخذ DataEntryCorrection/tenant lock عبر المالك
القائم وSerializable. تتحقق دفعة كاملة قبل tracking/save، وترفض path
مشتركًا داخل الدفعة أو في مستند حي/محذوف/متقاعد أو tracker غير محفوظ.
لا منتج import موازٍ مثبت في الجرد المحدود. لا EF parallel queries على
DbContext أو raw bulk معطل بالتخمين أو save يعاد لفشل cleanup.

يتحقق الجديد داخل القفل من صيغة uploader/GUID/ext والشركة والرافع ووجود
الملف الفعلي. CorrectionAttachmentPath يعيد استعمال PrivateUploadPath،
وIPrivateCorrectionAttachmentStorage ينفذه FileStore نفسه. تخزين جديد
خارج wwwroot ورفض static aliases، دون توافق للـGUID العام التجريبي.

GET Media/correction-attachment محكوم بـReadCorrectionAttachment وأدلة
bool فقط من Attachments/RetiredAttachments في الموردين، مقيدة بالـtenant.
قراءة live تحتاج View لكل مورد حي؛ التاريخ بلا رابط حي لا يصبح draft.
cleanup تمنع أي live link حتى للمدير، وتحتاج Update أو Delete لكل مورد
تاريخي. المسودة غير المرتبطة لرافعها، وقراءتها مع Create/Update؛ تنظيفها
لا يحتاج بقاء business grant، مع شرط DeleteMedia العام والجلسة الفعالة.

يمتد FileLink المورد المغلق correction-attachment عبر HTTP المصادق، مع
JPEG/PNG/PDF وno-store/nosniff، دون URL token أو static fallback. PDF ليس
img. تنتهي القراءة/URL على path/resource/grant/actor؛ localReadProgress
داخل body dialog يملك StateMessage المحلي ويلتقط النطاق وقت الاشتراك
حتى لا يحرر finalize عداد صفحة لا يملكه. UI18 والمهارة محدثان مع المصدر.

FileField يستعمل permission المحرر وuploadPermission للصف المحفوظ مع
Cleanup. التفريغ والإزالة لا يشترطان Upload، وpathless row لا يتطلب Cleanup.
تعاد شروط إزالة الصف قبل القرار وبعده؛ markRemoved في onRemoving فقط.
يلغي سحب شرط replacement نشر الرفع نهائيًا ولو عادت المنحة، ويبقى الرفع
pending. التنظيف بعد نجاح الحفظ أو discard فقط، وRetry له وحده.

## عمر الوصول والتحميل والكاش

تظل القائمة والمحرر mounted؛ hidden/inert يمنع نشر/تفاعل البيانات المرفوضة
والـdialog يوصل accessRequirement/accessBlocked. parent لا يدمر مسودة
لمجرد فقد View للقائمة. هوية محرر ثابتة للـactor/isModel/mode/id، وتغييرها
يلغي القراءات ويحفظ القديم محجوبًا بدل bootstrap فوقه.

القائمة switchMap مع subscribed owner/sequence وwatch بعد النجاح لالتقاط
rapid revoke/regrant. تمسح بيانات الحساب السابق وraw/applied/grid/URL عند
تغير سياقه، وتغلق Select portal. recovery ينتظر busy ولا يعيد HTTP فاشلة
في loop. كل handler يراجع grant/حالة العملية وعضوية كائن الصف الفعلي،
لا مساواة Id فقط. الإخراج composed read ملغى عند expiry.

الحفظ والحذف والإغلاق المستقل يمر HttpContext+trackWrite؛ لا denied أو
takeUntilDestroyed بعد إرسال mutation. يسجل success latch/tombstone قبل
mayPublish، فلا يعود صف محذوف أو إجراء Close من مصدر قديم قابلًا للإرسال.
لا feedback أو reload لحساب بديل، وcache invalidation الناجح مستقل عن
نشر الواجهة. قناتا failure envelope/HTTP لهما feedback واحد صريح.

قرار الخروج lazy ويعيد فحص busy وقت الاشتراك؛ expiry يلغي القرار ويصدر
false. قرار local discard جديد بعد denial متاح، ولا يقطع cleanup مرسلة.
تغيير actor/working/branch-access context لا يبدأ cleanup باسم بديل؛ هذا
حد أمان وليس توافق بيانات قديمة. discard المقبول terminal حتى لو منع
guard آخر الملاحة. لا sweeper دائم أو تعافي process crash مدعى.

| المصدر/العملية | الكاش والتقدم والعمر |
|---|---|
| GET قائمة المورد | operational direct؛ page LoadingService start/finalize؛ لا table/search spinner منافس |
| Excel كل الصفحات | operational direct؛ page progress، fetchAllPages تسلسلي١٠٠صف/طلب وإلغاء composed read |
| detail داخل الحوار | direct؛ StateMessage محلي واحد وRetry دون page lease محجوب |
| SupportSlaAgreement/Available | direct بلا opt-in/cache؛ required local progress وerror/Retry، لا GET في View |
| POST/PUT/DELETE/Close | page progress start/finalize، sent outcome fenced مستقل |
| upload/cleanup/private read | FileField/tracker/FileLink؛ progress مشترك قائم، private read داخل الحوار محلي |

لا lookup للمرشحات بالقائمة ولا cache/watch/invalidation source جديد.
تُثبت استعادة required Available بعد انقطاع القراءة أو رفع مرسل بالـrecovery
المستقل، دون busy-derived إعادة bootstrap فوق draft أو loops بعد error.
رؤية loader/portals والثيمين والمقاسات قبول تشغيل منفصل عن مطابقة المصدر.

## الأداء والمخطط المطلوب

لا تغيير Count/paging أو القائمة/sort predicates الحالية؛ لا per-row reads.
Available مباشر بactive/expiry/order. فحص ربط الملفات الجديدة يستعمل
Any على مجموعتي JSON لكل مورد وفحص وجود كل ملف، وMedia يسقط bool.
bulk يكرر validation لكل صف تحت قفل الدفعة. يلزم المالك SQL translation
لـAny/Contains وprojected bool وprimitive collections والحجم/IO/plan والزمن
وعدد الطلبات/TTFB، بنفس بيانات/حساب/مرشحات cold/warm قبل/بعد؛ لا قياس
سرعة منفذ. لا فهرس JSON عام مقترح بلا plan أو cardinality؛ PK أو FK لا
يثبت تغطية membership JSON، وتطبيع مستقبلي يتطلب عقدًا آخر.

يلزم المالك إضافة عمودي RetiredAttachments للموردين وتهيئة JSON [] وفق
المصدر، بالاسم المقترح الفريد الذي لم يظهر في مجلد الهجرات:

`Add-Migration AddCorrectionAttachmentOwnershipHistory`

لا migration/snapshot أُنشئ أو عُدل أو شُغل، ولا DB/reset. جميع البيانات
الحالية تجريبية؛ يبدأ المالك بملفات private صالحة بدل نقل paths عامة قديمة
أو إسناد ملكية تاريخية تخميني. لا تشغيل دورة المرفقات قبل المخطط.

## التحقق والدليل والتسليم

أُضيفت مواصفات مصدرية للقائمة والمحرر والمالك FileLink والـbackend/path،
وبقي تشغيلها **غير منفذ**؛ parsing ليس type checking ولا نجاح build/tests.
بلغت الإضافة١٢حالة للقائمة و٣٠للمحرر وحالة FileLink إضافية و٣١لخلفية
المرفقات والمسارات والتصنيفات، كلها غير منفذة. التحليل النهائي لـ٥٦ملفًا
وقالبًا أعاد problems:[]، وفحص scoped diff --check في الواجهة والخلفية
والوثائق نظيف مع تحذير EOL فقط. الحزم الثماني Check=OK وXML المشاريع
الثلاثة المرتبطة يُحلل دون خطأ. لا compilation أو typecheck من هذه الفحوص.
Namespaces/projectrefs/SDK inclusion للأنواع الجديدة روجعت، وقُرئت
untracked types/specs مباشرة. لا تشغيل UI/SQL/تخزين فعلي مدعى.

الدليل الثنائي اللغة في
`src/app/modules/UserGuide/content/data-entry-corrections-guide.ts`، وقارئ
`/UserGuide/data-entry-corrections` ومدخل القائمة القائمان. يشرح فصل منح
الموردين وClose وAvailable والمرفقات الخاصة والمسودة والـaliases والتنظيف
دون حفظ جديد. لا reader أو تصميم إضافي.

مساهمة الوكلاء: عامل backend مع ملكية ملفات غير متداخلة، وعامل editor،
والجذر workspace/shared/registry/translations/guide والتكامل والمطابقة.
أعاد كل عامل scoped diff/source handoff؛ راجع عامل المحرر workspace قراءة
فقط، وراجع عامل الخلفية المحرر ثم تعذر استئنافه بحد الاستخدام؛ finding
الاستعادة المؤكد أُصلح قبل الإقفال: recovery flag مستقلة تنتظر انتهاء
الانشغال ثم تطلب Available مرة واحدة، بما يشمل detail غير متزامنة وupload
مرسلًا وrapid regrant. أُضيفت ثلاث مواصفات دون تنفيذ، وراجع الجذر source
closure. أصلحت fixture القائمة بإضافة By/DateTime المطلوبين. التدقيق
المستقل للخلفية لم يجد finding مؤكدة؛ SQL/locking/storage pending.
التقسيم خفّض تكرار قراءة المصدر مع
بقاء العقود والمشتركات والجرد بمالك جذر واحد.

قبول المالك المجمع: schema ثم build/specs، grants الموردين مستقلة وView
دون edit/Available وClose دون Update، aliases والـsidebar، سحب/استعادة/تبديل
الحساب أثناء read/decision/save/delete/close/upload/export، فشل HTTP/business
بلا loop/replay، رفع واستبدال/تفريغ وقراءة private draft/live/retired عبر
الشركتين والرافعين، race/bulk/close وstorage/SQL، ثم RTL/themes/mobile.

رسائل مقترحة فقط بحسب النطاق:

- الواجهة: `fix(corrections): enforce operation and attachment access`
- الخلفية: `fix(corrections): protect attachment ownership and cleanup history`
- الوثائق: `docs(authorization): reconcile correction access and private files`

لم تُشغل builds/tests/lint/browser/DB/migrations/commit/push/deploy ولم
تُعدّل snapshots؛ لا Sigma MCP أو Graphify أو مسح الحل كله. الهدف العام
active، ولا تسليم نهائي لكل الصلاحيات من انتهاء هذه الشريحة وحدها.
