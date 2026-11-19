# تسليم شريحة صلاحيات قائمة الحوادث

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ٩ نوفمبر ٢٠٢٦ |
| النطاق | components/list فقط؛ لا ترقية للجرد أو إعلان اكتمال الوحدة |
| العقد | [عقد الحوادث](ACCIDENTS_ACCESS_CONTRACT_FREEZE.md) وقرار الفرع الثابت الإلزامي |

## المنفذ والمفاتيح

تستخدم القائمة AccessViewPolicyService وAdministrativeDefinitionSession
المشتركين ومفاتيح accidentsAccess التي يملكها الجذر. تحكم Accident.View
القراءة والمضيف المحمي؛ وتفصل المنح الفعلية الإنشاء والتعديل والحذف والتقرير.
تختبر visible/disabled والـhandlers المنحة وbusy والسياق وعضوية كائن الصف
الحالي، لا مجرد مساواة Id. أضيف عمود branchName للقائمة وتقريرها، مع
الفرز branchName المضاف لعقد النموذج عند الجذر. لا تعديل مبلغ أو حالة
أو معادلة أو عدد أعمدة غير ذلك ولا CSS أو API جديد.

أعمدة القائمة والتقرير هي BranchName، Vehicle، AccidentDateTime،
MovementType، RefNo، WhoseFault، Notes، ExcessCharges، InvoicedStatus،
CreatedBy، ومعرف Id وBranchId لحراسة العملية وVehicleId بعقد النموذج. تظل الصفحة مرقمة
بـResults/TotalCount؛ يستهلك التقرير نفس المرشح المطبق كاملًا دون ترقيم.
لا Excel قائم في الشاشة؛ لم تُضف منحة أو إجراء Export/Print مخترع.

## المصادر والمرشحات

مصدر المركبة Vehicle.Lookup اختياري وopted-in cache موجود في VehicleService:
finite getVehicleOptions ثم ReferenceLookupBindings.watchVehicleOptions،
مع refreshVehicleOptions وإبقاء label المختار عند refresh في السياق نفسه.
تُفك binding وتُمسح الخيارات وraw/applied/route vehicleId عند الرفض أو
تغير actor/tenant/branch-access context. لا مصدر مركبة عند غياب المنحة.

مصدر السائق Driver.Lookup اختياري مباشر، لا cache opt-in قائم. له
bootstrap/loading/error/Retry وdenied watcher مستقل عن المركبات؛ لا
forkJoin يطلب مصدرًا محجوبًا ولا فشل مصدر يمسح نجاح المصدر الآخر. كل
Retry يعيد مصدره فقط. يطبق الإلغاء بعد القراءة أيضًا كي تمسح labels
وIDs عند سحب المنحة، مع استعادة bootstrap واحد عند regrant سريع.

تنقح الطلبات وrouteState المعرفات غير المسموحة حتى قبل تفريغ effects؛
وكل قراءة قائمة أو تقرير تحمل grants للمصادر التي استهلك مرشحها. فقدان
منحة مرشح مطبق يلغي القراءة/الإخراج القديم ويبدأ قراءة منقحة، دون
إعادة تشغيل إخراج قديم. التاريخ والعمر والحالة لا تحتاج هذين المصدرين.

## العمر والتحميل والطباعة

الطلب الخارجي لقائمة الحوادث يحافظ على Subject/switchMap؛ لكل طلب
sequence وسياق شركة/مستخدم/فروع وdenied notifier مستقل، مع بقاء trigger
حيًا. visibleData ترفض أي resultOwner غير الحالي، وwatcher مستمر يمسح
المخرجات والهوية والاختيارات عند denial ولو بعد اكتمال الطلب. لا تكرار
قراءة بسبب finalize أو خطأ النقل/الأعمال؛ التعافي إشارة مستقلة تستهلك
مرة واحدة عند تغيّر الوصول/السياق وتنتظر زوال الانشغال.

يحافظ search/filter/paging على التحقق السابق ومعرفات URL، ويغلق Select
وDatePicker portals عند انتهاء السياق والتدمير. لا بيانات حساب سابق
تُعرض مؤقتًا بانتظار effects. اختيار فرع الحادث نفسه في المحرر عند العامل
الآخر، وليس lookup جديدًا من القائمة.

يستخدم التقرير ReportPrintSession بدل nested requestAnimationFrame.
قراءة التقرير تستهلك Accident.View + Accident.Report ومنح المرشحات
المطبقة، مع watcher يحتفظ بحراسة printData بعد الاستجابة. سحب Report
وحده يمسح المخرجات ويمنع queued frame حتى لو بقي View. الطباعة المفتوحة
بالفعل يملكها المتصفح؛ دورة استعادة القائمة تنتظر انتهاء printing، ولا
تستدعي طباعة قديمة بعد إعادة المنحة. لا تغيير لاختيار الصفحات أو scope.

startLoading/endLoading في finalize يملكان طلبات القائمة والتقرير
وpreflight والكتابة والتنظيف كلًا بعداده. ReferenceLookupStatus لكل
bootstrap يملك lease الصفحة لمصدره، والـcache refresh المحتفظ ببياناته
صامت. أزيلت مؤشرات Select/table/button المنافسة مع بقاء busy/error/Retry
وaria-busy. الجذر يراجع effective route/shell ضمن المطابقة المجمعة؛
لا يثبت هذا الفحص ظهور overlay أو سرعة تحميل بالتشغيل.

## الحذف وتنظيف الصور

قرار الحذف قابل للإلغاء بالمنحة والسياق؛ يُعاد الفحص بعد الموافقة.
preflight التفاصيل قراءة finite قابلة للإلغاء، تتحقق من هوية المستند
وقناتي الخطأ وعضوية الصف، ثم يرسل DELETE مستقلًا مع trackWrite.context.
لا takeUntilDestroyed أو denied$ يلغي طلبًا أُرسل. preflight له busy
منفصل عن عداد الكتابات حتى لا يحرره finalize أثناء DELETE جارٍ.

يثبت نجاح الحذف في سجل actor/Id لدى AccidentCleanupQueue قبل سياج النشر؛ الصف المحذوف
لا يقبل فعلًا ثانيًا حتى لو أعاد مصدر قديم هويته بعد regrant. تبقى
مسارات الصور المحتاجة للتنظيف في workflow بذاكرة الجلسة يملكه الحساب
بهوية ثابتة من identityUserId/subscriptionId/erpUserId. يبقى owner الكامل
للنشر الأصلي فقط، بينما تعرض العودة بالقائمة Retry للحساب نفسه حتى
بعد تغير branchAccessRevision. لا يعيد Retry طلب DELETE الناجح. غياب
Media.DeleteMedia يبقي العمل معلقًا بدل الادعاء بتنظيفه أو نسيان مساراته.
تطابق أهلية Retry للصور المحفوظة حراسة الخادم التي أكدها الجذر:
Media.DeleteMedia ومعها Accident.Update أو Accident.Delete والتسجيل على
فرع الحادث المحفوظ من BranchId وCurrentBranch.options().canTransact.
تُعاد حراسة التسجيل بعد قرار الحذف وpreflight وقبل cleanup؛ ويعيد
الخادم إثباتها. لا تستنتج القائمة فرعًا من تسمية BranchName. تبقى
الحوادث المسموحة بالعرض ظاهرة إذا كان الفرع للقراءة فقط، وتتعطل كتابتها.
لا تتعامل هذه القائمة مع صور مسودة غير مرتبطة.

لا يبدأ cleanup أو Retry لملفات سياق قديم بهوية حساب جديد. كل حذف ملف
يفحص هوية الحساب الثابتة والمنح والتسجيل على الفرع فور الإرسال؛ الكتابات التي أُرسلت تبقى مستقلة،
وتسجل المسارات الفاشلة قبل حجب النشر. لا تُحدّث callback قديمة قائمة
السياق الجديد أو تنشر نجاحه. التجميع يستخدم تحديثات immutable لتظهر
المحاولات الفاشلة الجزئية بدقة. لا حذف فعلي أو SMTP في أدوات العامل.

مدّ الجذر FileUploadService.remove بمعامل HttpContext ثالث اختياري،
وتبنته القائمة لكتابات التنظيف المرسلة مع trackWrite(Media.DeleteMedia)
وfinish في finalize. أصبح local/global publication وراء سياج المالك
نفسه، دون إلغاء طلب ملف أُرسل. لم يعدل العامل خدمة الملفات المشتركة.
تمنع canDeactivate المغادرة أثناء decision/preflight أو كتابة DELETE/cleanup
مرسلة فقط، وربط الجذر guard بمسار القائمة. لا تحبس مهمة فاشلة خاملة
المستخدم؛ تحفظ queue مساراتها بعد مغادرة المكوّن وتعيد إظهارها لصاحبها
عند العودة. لا تحفظ queue callbacks أو publication closures؛ Map النشر
محلي للمكوّن وغياب guard سابق بعد remount لا ينشر نجاحًا قديمًا. كل
Retry يبدأ trackWrite جديدًا ويعيد فحص المنح وCanTransact للفرع المحفوظ.
تُسجل نتيجة تنظيف قديمة في queue حتى عند حجب النشر عن السياق الجديد.

الطابور ذاكرة جلسة فقط: لا تخزين دائم ولا autoRetry أو server job. إعادة
تحميل الصفحة بالكامل أو إغلاق الجلسة يفقد هذه المهام؛ التنظيف المستديم
للملفات اليتيمة يظل احتياجًا منفصلًا عند مالك الملفات بالخادم. لا تدعي
هذه الشريحة أنها حمت static-file URL.

## التحقق والحدود

قُرئت تعليمات العمل والمهارة وعقد الحوادث ومنحة/جلسة الوصول ومالكو
الكاش والطباعة والتحميل والجدول. مراجع سبيد وقرار الفرع جمدهما الجذر؛
لم يُغير العامل contract أو قرارًا ماليًا/تاريخيًا. اكتشاف بوابة ملفات
الخادم ملك الجذر؛ حراسة القائمة ليست دليلًا على سرية الصورة خارجها.

أضيفت ٢٤ مواصفة سلوكية مصدرية غير منفذة: غياب العرض؛ reader بلا
lookups؛ الصف المنفصل والمنح المستقلة؛ تنقيح المرشحات؛ تبديل الحساب
بنفس المنح؛ revoke/regrant سريع؛ قرار الحذف؛ preflight منتهي؛ DELETE
مرسل مع actor جديد؛ Retry تنظيف بلا إعادة DELETE؛ queued print؛ سحب
Report وحده؛ busy بعد preflight؛ وRetry مستقل للمصدر الاختياري؛
وفرع للقراءة فقط؛ وفقد التسجيل أثناء قرار حذف معلق؛ منع المغادرة أثناء
decision/preflight وDELETE وcleanup المرسلة؛ تحرير المغادرة عند السكون
دون حبس actor جديد؛ بقاء فشل cleanup بعد remount وإخفاء المسارات عن حساب
آخر؛ عودة صاحبها وتغير branch revision مع المنح الجديدة؛ وتسجيل فشل
callback قديمة دون نشره لحساب جديد. لا إعادة DELETE في مسارات Retry.

فحص TypeScript/Angular parsing ووجود local imports شمل ٣ ملفات
بالمجلد وأعاد problems:[]، وgit diff --check نظيف. روجعت الفروق
المحددة لملفي TS/HTML المتتبعين، وقُرئ ملف المواصفات الجديد مباشرة.
فحص الحزم الثماني سليم. ليست هذه type checking أو build أو tests
أو قبولًا مرئيًا/تشغيليًا. لا build/tests/lint/browser/DB/migration/
snapshot/commit/push/deploy نُفذت. لم يتغير SCSS أو backend أو shared
owner أو models/services/registry/guide من هذا العامل.

يلزم الجذر دمج بقية الحوادث والملفات والدليل والجرد ومراجعة الوحدة
المتكاملة، وإبقاءها غير مكتملة حتى حراسة جذر الحادث وأطفاله والصور.
تُجمع تجربة المالك في النهاية: مستخدم View فقط، مستخدم العمليات،
مدير الشركة، انتهاء الوصول خلال كل request/decision/print/delete،
التبديل بنفس grants، cleanup بلا منحة ثم إعادتها، والفشل الجزئي للصور.

رسالة commit مقترحة فقط:
feat(auth): guard accident list actions, filters and report lifetime
