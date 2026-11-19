# عقد تبني صلاحيات الأسطول وتجهيز البيع

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | ٢٠٢٦-١١-٠٧ |
| التفويض | استمرار هدف تفعيل الصلاحيات في كل الشاشات والأحداث؛ بناء واختبار النطاق مصرحان في مسار الوصول الجاري |
| النطاق | Sales/Fleet القائمة والمحرر والكتالوج والمرفقات وتجهيز البيع، المالكون المشتركون للمرفقات وسياسة المسار والدليل |
| المستثنى | قرار التحصيل عبر الفروع والمخطط غير المطبق؛ لا migration/snapshot/DB/deploy/commit، ولا اعتماد بقية الشاشات تلقائيًا |

## المرجع والمالكون

هذا تبنٍّ لعقد CURRENT_ACCESS_IMPLEMENTATION_CONTRACT_FREEZE، وليس نموذج منح
جديدًا. يطبق Master1/4/5/7، وUI2/7/13/18/22/26/28/29، ومالكي الأسطول
الحاليين: قائمة ومحرر موجه UI02، وحوار تجهيز بيع UI09. قُرئ جرد Fleet من
Speed بتاريخ٢٨أكتوبر (Sales/screens/01-fleet) وSalesAgreement وC0784 منفصلًا؛
المفاتيح من مصدر Sigma لا من المرجع. تتبع الجرد الفعلي في خطة وصول الواجهة
ملفات list/details/preparation/services وPermissionEndpointResolver والكتالوج.
لا فجوة وظيفية تحتاج Odoo في تبني هذه المفاتيح؛ قرار التحصيل ليس من المرجع.
الحزم الثماني Check سليمة قبل تجميد هذه الشريحة.

## المسارات والقراءات

- مسار القائمة `Fleet` وview/details alias يحتاج Equipment.View فقط. اختيارات
  الفلاتر اختيارية: Branch.Lookup وCarModel.GetMakeAndModelDropdown
  وVehicleType.Lookup. المصدر يحمّلها كلها حاليًا؛ التبني يتخطى المصدر ويخفي
  فلتره عند غياب منحه ولا يحول lookup اختيارية إلى إذن ضمني أو شرط لرؤية
  قائمة الوحدات. الاختيارات/المعرفات غير المسموحة لا تدخل query. الفرع
  التشغيلي الذاتي المتاح يظل خاضعًا لعقد CurrentBranch ونطاق الخادم.
- الإنشاء يحتاج Equipment.Create مع Branch.Lookup وCarMake.Lookup
  وCarModel.View وVehicleType.Lookup. التعديل يحتاج Equipment.View وUpdate
  مع الاختيارات نفسها؛ لا Create ضمن edit. العرض يحتاج View ولا يحمّل
  اختيارات التحرير. تبقى حالة السجل وصلاحيات الفرع مستقلة.
- البحث والصفحات والفرز والطباعة/قراءة التصدير الكاملة تحتاج Equipment.View.
  تُلغى القراءات القديمة عبر denied$ وdataContext، مع بقاء query trigger
  صالحًا لإعادة المنح. تتبع branch cache/watch وclear/rebootstrap القائمين؛
  لا cache للمصادر المباشرة، ولا HTTP لكل زر. فصل output invalidation عن
  busy effects إلزامي، واستعادة lookups بعد إعادة المنح لا تهدم draft.
- حذف وحدة يحتاج Equipment.View وEquipment.Delete، وحالة Available،
  وإعادة فحص الصلاحية والسياق بعد التأكيد قبل DELETE.

## المحرر والكتالوج والمرفقات

- تحفظ كل أفعال المحرر والمسودات شروطها الحالية، وتفحص write requirement
  داخل handlers أيضًا. تختفي body-appended حوارات الكتالوج عبر accessRequirement
  للمالك EditorDialog دون هدم المسودة أو طلب كتابة مرسل.
- إنشاء الماركة يحتاج متطلب المحرر وCarMake.Create وCarMake.Lookup؛ وإنشاء
  الموديل يحتاج متطلب المحرر وCarModel.Create وCarModel.View. مصادر اختيارات
  الماركة من bootstrap المحرر. callback POST المرسل يحتفظ بنتيجته؛ reload
  التالي يحتاج منحة القراءة الحالية وحدها، ولا يعيد POST عند Retry.
- الإضافة العامة في DocumentUploadTracker هي اختيارية:
  `setAccessRequirements(uploadPermission?, cleanupPermission?)` وقراءة
  `canUpload()`/`canCleanup()` تفاعلية من evaluator الحالي. عدم الضبط يحافظ
  عقد المستهلكين غير المتبنين. يضبط Fleet upload على Media.UploadMedia
  وMedia.DeleteMedia معًا (لا بدء upload بلا قدرة تنظيفه)، وcleanup على
  Media.DeleteMedia وحدها، حتى يستمر callback حفظ مرسل بعد سحب إذن تعديل
  الوحدة دون اختراع سماح لحذف جديد.
- يضيف FileField مدخل `permission` اختياريًا لمتطلب تعديل المستند؛ يعرض
  upload/remove حسب مدخل التحرير وقدرة tracker المناسبة ويعيد الفحص في
  onSelected/remove. `selectionOnly` يبقى محليًا ولا يحتاج Media؛ لا تغيير
  نوع FormControl أو path/folder أو FileLink.
- markRemoved محلي بلا DELETE فوري، ويظل متاحًا للـcallback الخاص برفع مرسل.
  كل DELETE جديد في finishSave/discard يفحص منحة cleanup الحالية؛ المسار
  المرفوض يبقى في failed/pending للـRetry دون HTTP، ولا يُدّعى نجاح تنظيفه.
  نجاح طلب upload/delete أُرسل بالفعل يحتفظ بنتيجته، ولا تلغيه denied$.
- إزالة صف مستند له path تحتاج متطلب المحرر وMedia.DeleteMedia، بما في ذلك
  فحص ما بعد confirmation. إزالة صف بلا ملف لا تتطلب منحة Media إضافية.
  لا تخمين لمسارات أو سياسة وصول ملف خادم جديدة.
- MockData.GetSettings وGenerate اختياريان بمستهلكهما المشترك؛ غيابهما
  لا يمنع CRUD أو الكتالوج. لا طلب بلا منحة ولا apply بعد سحب المتطلب.

## تجهيز البيع

- فتح المحفوظ يحتاج EquipmentSalePreparation.Get، ويظهر عبر EditorDialog
  accessRequirement نفسه؛ deep query لا يتجاوزه. إن لم يوجد محفوظ، قراءة
  الأصل تحتاج Get وAssets. غيابها حالة denied مفهومة، لا إذن View عام.
- Calculate يحتاج Get وAssets وPreview؛ Confirm يحتاج الأربعة مع Confirm.
  تُفحص الإتاحة في control وhandler، وpreview/read لها denied$، أما confirm
  المرسل فيحتفظ بنتيجته. إعادة تحميل المحفوظ بعد نجاح confirm مستقلة
  وتحتاج Get الحالية، ولا تعيد confirm إن فقدت.
- روابط القيود لا تظهر إلا إن سمحت سياسة route الفعلية بوجهتها؛ لا نفتح
  مسار JournalVoucher غير المتبنى للعادي لمجرد وجود رابط من هذا الحوار.
- تغيير actor/branch dataContext يبطل جلسة المصدر الحالية؛ permission-only
  revoke يخفي الحوار ويمنع الجديد مع حفظ draft/نتيجة كتابة مرسلة. لا نقل
  بيانات واجهة من جلسة قديمة إلى أخرى.

## التنفيذ والتحقق والملكية

إضافة مالك مشترك مثبتة في الاستئناف: EditableRowsConfig.canRemove(row)
وonRemoving(row,index) اختياريان. الأول يفحص صف الملف قبل وبعد التأكيد،
والثاني يسجل markRemoved فقط عند الإزالة الفعلية؛ لا تغيير لعقد المستهلكين
الذين لم يضبطوهما. أثبت اختبارا RED رفض السحب بعد التأكيد وعدم تنفيذ callback
قبل الإزالة، ثم نجحا ضمن مجموعة shared/route/layout٢٨. اختبار layout القديم
كان يطابق first-control-track المحذوف بقرار المالك٣١أكتوبر؛ صُحح التوقع إلى
توسط مجموعة file/error الكاملة حسب UI14 مع بقاء file/View على نفس المسار،
دون أي تعديل CSS أو قيم شكل لإرضاء الاختبار.

توسعة الإتاحة للصف: `EditableCollectionTable.removeAllowed(row,index)` يعرض
Remove الافتراضي للصف المسموح فقط ويعيد الفحص في handler؛ يمرر Fleet نفس
predicate الذي يستعمله EditableRows.canRemove. لا حذف UI مكرر أو قواعد مختلفة
للزر والتنفيذ. ثبت RED قبل تفعيل input في القالب/handler ثم نجح ضمن Fleet٦٢.
واختبار هدم FileField كشف قطع HTTP قبل حفظ pending؛ أصبحت عملية upload
مشتركة واحدة بعمر tracker المحرر عبر shareReplay refCount=false بعد defer،
مع destroyRef الخاص بالمحرر upstream. يستمر رفع مرسل إذا هُدم الحقل، دون
نشر مساره في نموذج جلسة أخرى أو تكرار POST، ويظل مساره محفوظًا لدى المالك
للتنظيف. هدم المحرر الفعلي يحرر المصدر/busy. ثبت RED ثم٧/٧ GREEN للمالك.

قُرئت أكواد Fleet المرجعية بصورة مستقلة عن الدليل: C0800 permissions
والaction menu (194–204 و314–325) وC0799 create make/model (369–377).
تثبت فصل أفعال العرض/الإنشاء/التعديل/الحذف وتصريح export في المرجع؛ Sigma
يستخدم Equipment.View لقراءة تصدير الصفحات ولا يُختلق Export key غائب عن
كتالوجه الحالي. سياسة فروع Sigma المحسومة لا تُستبدل بـviewOtherBranch
المرجعية. قُرئ مدخل Odoo، ولم تبق فجوة وظيفية تحتاج استنتاج سياسة منه.

- الجذر يملك FileField وDocumentUploadTracker وسياسة المسارات والوثائق
  والدليل والتكامل وتشغيل الاختبارات والبناء النهائي.
- عامل المحرر يملك Sales/Fleet/components/details فقط واختباراته؛ لا ملفات
  shared أو list/preparation أو guide/routing/services خارج الملكية.
- عامل القائمة/الإجراء يملك components/list وcomponents/sale-preparation
  واختباراتهما فقط. لا مشاركة ملفات أو تغيير مبالغ/صلاحيات خادم.
- يبدأ كل مسار بحالات regression ثم التنفيذ، source-only للعاملين؛ الجذر
  يشغل suites متسلسلة للمخرجات نفسها. تشمل denied initial، view-only،
  create≠edit، revoke بعد confirmation، تغير dataContext أثناء read،
  callbacks create→reload، uploaded→denied cleanup→Retry، draft/sent result،
  وroute/editor/direct handler. القبول المرئي الحقيقي منفصل عن headless.
- يراجع الجذر scoped diff والملفات الجديدة مع حفظ كل تعديلات المستخدم
  والزملاء. تحدّث عدادات الجرد بعد اكتمال تبني كل أحداث Fleet فقط. لا تُعلن
  كل شاشات التطبيق مكتملة من هذه الشريحة.

## استكمال التدقيق النهائي — ٧ نوفمبر

أثبت التدقيق المستقل ثلاثة مسارات تحتاج regression وإصلاحًا في مالك التفاصيل:
إلغاء اشتراك تأكيد الحذف عند denied$/dataContext لإغلاق portal نفسه؛ منع
بدء GET تفصيل ثانٍ في regrant branch إذا كان الأول ما زال pending؛ ومحاولة
cleanup فقط عند انتقال Media.DeleteMedia من ممنوحة مسحوبة إلى ممنوحة مجددًا
داخل نفس dataContext مع cleanupKind معلقة. الأخيرة تُنفذ untracked مرة عند
الانتقال؛ لا تتعقب busy/cleaning ولا تعيد Save ولا تعيد محاولات network failure
على كل revision. لا يُفتح المحرر المحمي لتوفير Retry داخله.

أما الرفع الذي يكمل بعد تبديل actor/link أو branch-access context، فملفه يبقى
ضمن عمر tracker حتى هدمه؛ لا ضمان تنظيف عبر مستخدمين ولا discard تلقائي من
السياق الجديد. قد يكون Save قد حفظ الملف بالفعل قبل وصول callback قديم،
فيؤدي الحذف إلى إتلاف مرجع محفوظ. تبقى قاعدة انتهاء orphan على الخادم/التنظيف
best-effort في UI18 حدًا قائمًا، لا طابورًا دائمًا أو سياسة حذف جديدة في هذه
الدفعة. تبديل الفرع التشغيلي وحده ليس dataContext لهذا المالك.

استكملت المراجعة إعادة فحص id/Available بعد تأكيد الحذف وداخل handler،
وإلغاء delete confirmation في القائمة أيضًا، وإلغاء lookup bootstrap قبل
إعادة تكوينه عند grant-only revision حتى لا تُترك فلاتر ممنوحة حديثًا بلا
خيارات إذا كانت قراءة قديمة ما زالت pending. لا يزيد ذلك grant required
للصفحة ولا يفتح مصدرًا غير ممنوح.

قرار الخروج المحلي ليس كتابة محمية على الوحدة. قرار discard المفتوح وقت
السحب/تغير السياق يُلغى ويصدر false للـroute guard؛ محاولة خروج جديدة بدأت
في denial القائم تظل تتيح التأكيد المحلي. يلتقط المالك allowed/context
داخل defer ويجعل فتح التأكيد lazy؛ notifier الخاص بالقرار يتخطى initial
denial مرة في هذه الحالة فقط، ثم يُلغي أي expiry لاحق. ينتهي notifier قبل
switchMap للتنظيف؛ لا يقطع cleanup مرسلًا ولا يمنح DELETE بلا Media grant.
