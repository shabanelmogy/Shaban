# تسليم محرر طلبات ونماذج تصحيح الإدخال

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| العقد المستهلك | DATA_ENTRY_CORRECTIONS_ACCESS_CONTRACT_FREEZE.md، Frozen بتاريخ ٩ نوفمبر |
| النطاق | محرر dialog المشترك للموردين وملف مواصفاته فقط |
| التكامل والترقية | عند الجذر؛ لا يعلن هذا التسليم اكتمال الموردين أو هدف الصلاحيات |

## الملكية والملفات

عُدّل الملفان التاليان في مستودع الواجهة، وأضيفت مواصفة المحرر:

`src/app/modules/Data Entry Corrections/shared/correction-editor.component.ts`

`src/app/modules/Data Entry Corrections/shared/correction-editor.component.html`

`src/app/modules/Data Entry Corrections/shared/correction-editor-access.spec.ts`

لم يُعدّل العامل workspace أو API أو keys أو routes أو FileLink/FileField أو
الخلفية أو guide أو الكتب. حُفظت تعديلات الجذر والزملاء الموجودة. استُهلكت
امتدادات الجذر الفعلية correctionAccess وHttpContext للكتابة وFileLink resource
والتحميل المحلي. يملك الجذر ترجمتَي dataCorrections.saveError، وأكد إضافتهما.

## مطابقة العقد والمالكين

| الجانب | التنفيذ المصدرّي |
|---|---|
| منح الموردين | correctionAccess(sessionModel) يحدد View/Create/Edit مستقلًا؛ لا امتياز مستنتج من المورد الآخر أو من اسم role |
| وضع العرض | View وحدها، بلا Available، وجميع المدخلات والأطفال disabled؛ View→Edit يحتاج Edit الفعلية التي تشمل Available |
| الإنشاء والتعديل | تفاصيل وSLA ومرفقات scalar كما العقد؛ لا metadata/status/تاريخ مرفقات في payload، ولا workflow أو قاعدة SLA جديدة |
| اختيار SLA | Available مصدر مباشر مطلوب للحفظ، ومنحة منفصلة ضمن Create/Edit. handler يتحقق عضوية الاختيار في البيانات الحالية، ويحفظ التاريخي غير المتاح كما العقد السابق |
| جلسة المحرر | تثبيت isModel/mode/recordId عند الفتح مع owner=access.dataContext؛ تغيير inputs على مثيل قائم يحجبه ويلغي قراءاته، دون تحميل سجل آخر فوق المسودة |
| انتهاء الوصول | المحرر mounted hidden/inert، وEditorDialog.accessRequirement/accessBlocked. يختفي subtitle القديم عند الرفض، وتبقى قيم المسودة ونتائج الكتابة المرسلة تحت سياج مالكها |
| استعادة الوصول | watcher يشمل الوصول بعد اكتمال القراءة؛ يلغي pending detail/Available ويحفظ draft. recoveryPending مستقلة تنتظر blocked=false ثم تستهلك فرصة القراءة مرة واحدة؛ تحفظ regrant أثناء upload وتهيئة Available بعد finalize التفاصيل المؤجلة. لا إعادة detail مكتملة، ولا retry loop بعد فشل المصدر أو تغيّر busy لاحقًا |
| الحفظ المرسل | trackWrite + HttpContext/CAN_PRESENT_API_OUTCOME، بلا denied$/destroy cancellation. saveCommitted وsavedPaths وcleanupIntent تُثبت قبل mayPublish؛ الرد القديم لا يعيد POST/PUT ولا يكتب في جلسة جديدة |
| فشل الحفظ | envelope وHTTP feedback محلي واحد، مع بقاء المسودة قابلة للتعديل عند استمرار الإذن؛ context يمنع global outcome القديم |
| إسناد المرفقات | FileField.permission=requirement وuploadPermission لكل row: Upload+المحرر، وCleanup كذلك عند استبدال path محفوظ. لا يضاف ReadCorrectionAttachment لفتح المحرر أو حفظه |
| نشر الرفع | publicationCancelled$/Allowed يصونان عمر الجلسة؛ callback لا يرفض لمجرد upload busy. يملك FileField/DocumentUploadTracker الرفع المرسل والـpending cleanup، بلا ناقل ملفات محلي |
| التفريغ والإزالة | التنظيف مستقل عن Upload. canRemove/onRemoving/removeAllowed من مالك EditableRows؛ فحص قبل القرار وبعده، وmarkRemoved بعد القبول فقط. pathless/new rows لا تشترط Cleanup |
| القراءة الخاصة | FileLink protectedResource='correction-attachment' وaccessRequirement المحرر وlocalReadProgress=true؛ لا رابط ثابت عام أو توكن، ولا wrapper جديد |
| التنظيف | finishSave/discard فقط عبر tracker، مع إعادة فحص Media.DeleteMedia عند كل طلب جديد في المالك. Retry تنظف الملفات فقط ولا تعيد الحفظ. نتيجة cleanup مقيدة بمالك الجلسة وinputs |
| تبدل الممثل | لا إرسال cleanup لملفات الممثل السابق باسم الجديد. يمكن إغلاق المحرر القديم محليًا، وتبقى معالجة orphan خارج هذه الشريحة |
| القرارات والخروج | defer lazy، وbusy يعاد فحصه عند الاشتراك؛ قرار الرفض المحلي يتجاوز denial الأول فقط، ويلغى بأي انتهاء وصول لاحق. notifier قبل cleanup switchMap، فلا يقطع تنظيفًا مرسلًا |
| الخروج المكتمل | discard المقبول يصبح terminal ويترك المدخلات مجمدة إذا منع guard آخر الملاحة؛ لا إعادة استخدام draft بمرفقات سبق تنظيفها. close idempotent |
| التركيز وأداة البيانات | focusField محكوم owner/session/denied$ وDestroyRef؛ appMockData يستهلك requirement المحرر |

## التحميل والكاش والأداء

التفاصيل من getDetail للمورد الحالي قراءة مباشرة مع StateMessage محلي واحد
داخل الحوار؛ لا LoadingService عالمي لها. Available أيضًا قراءة مباشرة محلية
بخطأ وRetry، ولا opt-in للكاش أو watch مرجعي مخترع. الإلغاء عبر denied$ والجلسة
وDestroyRef، مع guards للكتابة والقرارات والرفع/التنظيف. العرض لا يطلب Available.

الحفظ يملك startLoading/finalize للصفحة مع saving والحراسة الحالية للحوار؛
الرفع يتبع FileField، والتنظيف يعرض StateMessage محليًا واحدًا. FileLink يستعمل
مالك القراءة المحلي الذي جهزه الجذر، مع التقاط نوع التقدم داخل shared عند
بدء الطلب. الظهور والتداخل الفعلي للأحمال قبول تشغيلي معلّق.

لا lookups لكل صف ولا كاش جديد. النطاق محرر فقط؛ لا SQL أو فهرس مقترح من
مصدره وحده. قياس cold/warm والـnetwork/SQL والجوانب التخزينية عند الجذر/المالك؛
لا سرعة مقاسة أو تنفيذ خلفي مثبت بهذا التسليم.

## واجهة التكامل مع workspace

تبقى inputs الثلاثة وclosed(saved) وcanDeactivate():Observable<boolean> كما هي.
يحتفظ parent بالمثيل mounted ولا يغير inputs إلا بعد closed أو مغادرة مصرح بها.
يتولى الجذر حماية امتياز القائمة دون تدمير editor. تتوفر canOpen() وmayEdit()
وrequirement وsaveCommitted() للفحص؛ لا public API إضافية مطلوبة من parent.
دليل التطبيق والمسارات والregistry وترقية الجرد ملكية الجذر.

## أدلة التحقق وحدودها

قُرئ العقد المجمد كاملًا والمحرر وAPI وخدمات الموردين وAvailable، وقواعد Sigma
ومهارته وAngular والملاك EditableRows/FileField/FileLink/DocumentUploadTracker
والـview policy وtrackWrite، وUI10/UI14 وكتل التحميل/الانتهاء/المرفقات المستخدمة
في هذه المهمة. قُرئت مهارات التشخيص والتحقق، واستُهلك التصميم المجمد دون طلب
اعتماد متكرر. أدلة سبيد وOdoo مكتوبة في عقد الجذر؛ لا ادعاء قراءة مرجع جديد
بواسطة هذا العامل أو استنباط قرار مالي/تفويضي منه.

أضيفت **٣٠ مواصفة مصدرية غير منفذة**: استقلال الموردين ومنح العرض/الإنشاء/
التعديل وAvailable، انقطاع وإعادة القراءات والمسودة، تبدل الممثل/inputs،
الكتابة المرسلة وHTTP outcome، failed save وcleanup retry، عضوية SLA وتاريخها،
المرفقات وقراراتها، local discard/إلغاؤه، العمر المؤجل للتركيز، وبقاء cleanup
المرسل بعد انتهاء الوصول/تدمير العرض مع منع نشر نتيجته القديمة.
تغطي المواصفات الإضافية تتابع detail مؤجلة ثم Available بعد finalize، وregrant
سريعة أثناء upload ثم استئناف Available مرة واحدة عند انتهائه، وفشل استعادة
Available دون loop عند تغيّر busy مع بقاء Retry صريحة.

فُحص TypeScript/Angular HTML parsing ووجود imports المحلية للملفات الثلاثة
دون مشكلات تحليل، وgit diff --check للملفين المعدلين نظيف. روجع scoped diff
بالكامل في مستودع الواجهة، وقرئ ملف المواصفات الجديد مباشرة لأنه untracked.
هذا لا يثبت type checking أو build أو tests أو RED/GREEN.

لم تُنفذ builds/tests/lint/browser/DB/migrations/snapshots/commit/push أو نشر،
ولم تُنشأ وكلاء إضافية. لا schema/AutoMapper/حساب مالي/CSS في هذه الشريحة.
مخطط RetiredAttachments الخلفي وتشغيله وتفويض Media وتخزينه عند الجذر/المالك.

القبول المعلّق: compile/specs، وتجربة منح الموردين وSLA التاريخي، وتبدل
الممثل/المنح أثناء read/decision/write/upload/cleanup، والمرفقات الخاصة
draft/live/retired وحذفها، وRTL/themes/mobile/ظهور progress. لا يدعى تنظيف
orphan دائم أو تعافي من crash أو محو بيانات اختبار في هذا التنفيذ.

رسالة commit مقترحة للواجهة عند دمج الجذر بواسطة المالك:

`fix(corrections): enforce editor access and private attachment lifecycle`
