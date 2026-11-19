# مطابقة صلاحيات شاشة الحوادث

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ٩ نوفمبر ٢٠٢٦ |
| العقد | [الحوادث والفرع والصور وعمر الحذف](ACCIDENTS_ACCESS_CONTRACT_FREEZE.md) |
| النطاق | صلاحيات وظائف الحوادث الموجودة ومصادرها وملفاتها؛ لا تطوير دورة مالية جديدة |

## المسار والمنح الفعلية

يتتبع المسار FleetAccidents ملف fleet-accidents.routes ثم القائمة ومحرر
create/edit/view. لا details route؛ البديل غير الموجود يظل مغلقًا. تربط
RouteAccessPolicyRegistry القائمة ومدخلها والرابط المباشر ونقطة البداية
بالمتطلبات نفسها. لا يكفي resource candidate لإثبات الإجراء.

| الوظيفة | الواجهة والطلب الفعلي | حراسة الخادم |
|---|---|---|
| القائمة والتفاصيل | Accident.View؛ GET Accident وGetById | PermissionAuthorizationFilter والمنحة والشركة والفروع |
| إنشاء | Accident.Create + Accident.AgreementVehicleOptions؛ POST Accident واختيارات المركبة بتاريخ الحادث | فحص فرع التسجيل والمركبة والعقد، واشتقاق الحركة في الخادم |
| تعديل | Accident.View + Accident.Update؛ PUT Accident | الفرع المحفوظ ثابت، المركبة ثابتة، فحص المراجع المستهلكة والأطفال |
| حذف | Accident.View + Accident.Delete؛ DELETE Accident بعد preflight تفاصيل | حذف ناعم للجذر والرسوم والصور عبر RemoveWithChildrenAsync |
| تقرير كامل وطباعة | Accident.View + Accident.Report؛ GET Accident/Report | نفس فلاتر وprojection القائمة دون paging؛ WholeDocument read |
| مرشح مركبة اختياري | Vehicle.Lookup مع View | المصدر الحالي المحكوم؛ لا فتح محرر مطلوب لمنحة المرشح |
| مرشح سائق اختياري | Driver.Lookup مع View | المصدر الحالي المحكوم؛ إزالة ID المحجوب من raw/applied/URL |
| اقتراحات المسؤولية ونوع الرسم | Accident.Options اختياري | اقتراحات من الحوادث والأطفال المسموحة فقط؛ النص اليدوي متاح |
| معاينة الحركة | Accident.ResolveMovement اختياري | قراءة محكومة؛ فشل المعاينة لا يحول الحفظ إلى تخمين عميل |
| رفع صورة | Media.UploadMedia مع متطلب المحرر | فحص إضافي Create/Update وهوية الرافع والشركة ونوع/حجم الملف |
| قراءة صورة | Media.ReadAccidentImage مع متطلب الشاشة | Accident.View واستعراض كل الأصول الحية؛ أو مسودة لرافعها مع Create/Update |
| تنظيف ملف | Media.DeleteMedia | رفض الملف المرتبط حيًا؛ للمحفوظ المزال يلزم التسجيل على جميع أصوله التاريخية وUpdate/Delete |

القراءات الأربع المخصصة ومنحة الصورة مثبتة في ReviewedPermissionOperations
ومصنفة صراحة في BranchOperationRules، ولا تُحوّل إلى كتابة بسبب اسم مخصص.
العمليات العامة تستهلك PermissionEndpointResolver القائم. مسارات الخدمة
الجماعية بلا منتج HTTP مثبت ترفض الخام حتى لا تتجاوز تحقق التجميع.

## الفرع والشركة وثبات التاريخ

حسم المالك فرعًا ثابتًا للحادث عند التسجيل. يحمل Accident.BranchId قيمة
int إلزامية مع علاقة Restrict وفهرس الشركة والفرع والتاريخ. يحمل Add الفرع
فقط، ولا يرسله Update. تحرس طبقة الحفظ ثباته وصحته قبل شرط HTTP، بما يشمل
المدير والكتابة الداخلية والمنفصلة. يتبع الطفلان الفرع الأب في registry.

يختار الإنشاء من CurrentBranchService.options القابلة للتسجيل مع افتراضي
صالح؛ لا طلب Branch.Lookup جديد. تعرض القائمة والتفاصيل والتقرير الفرع
المحفوظ. لا nullable أو backfill لحفظ سجلات التجربة. تُفحص المركبة والعقد
عند استهلاكهما في الكتابة، بينما حذف الحادث يتبع فرعه ولا يتطلب تسمية
المركبة الحالية. يظل حادث الفرع القديم مقروءًا بعد انتقال المركبة.

تستعمل projection القائمة scalar correlated labels محكومة بدل required
Vehicle navigation التي قد تسقط الجذر. قد ترجع تسمية المركبة فارغة ومرجع
الحركة محجوبًا عندما لا يسمح المصدر الحالي بعرضهما؛ لا bypass لتسمياتهما.
تستعمل detail aliases الإسقاط نفسه، وتبقى مرشحات السائق مرتبطة بعقد مسموح.
فحوص منع حذف/إلغاء Rental/Lease تقرأ Any محدودًا بالشركة والعقد والسجل الحي،
حتى لا يسمح إخفاء حادث بإلغاء عقد له تبعية محفوظة. لا بيانات حادث تخرج منها.

## الحقول والعقود

أعمدة القائمة: BranchName، Vehicle، AccidentDateTime، MovementType، RefNo،
WhoseFault، Notes، ExcessCharges، InvoicedStatus، CreatedBy. يقابلها ListVM
بالحقول نفسها، ومعها Id وBranchId كهوية وأقل حالة إجراء. أُزيل VehicleId
غير المستهلك من صف القائمة فقط؛ يبقى في تفاصيل الحادث والطلبات ومرشح البحث.
يتوافق BranchName nullable في TypeScript و.NET؛ فراغ label لا يغير ملكية الفرع.

مرشحات الصفحة: DateFrom/DateTo، VehicleId، MovementType، InvoicedStatus،
DriverId، DriverAgeFrom/To، grid، paging/sort. تطبق قبل count/page؛ التقرير
يستعمل الفلاتر نفسها ويرجع كل النتيجة. أعمار السائق أعداد صحيحة ٠–١٢٠.
الحالة المالية الحالية N/A؛ لا فواتير/رسوم CDW جديدة أو تغيير في حساب المبالغ.

يحمل Add branchId/vehicleId/date/whoseFault/policeReport/notes والرسوم والصور؛
يحمل Update المدخلات نفسها دون الفرع ومع id. يُشتق AgreementId في الخادم.
يتحقق من هوية الطفل والازدواجية والحدود: ٥٠ رسمًا و٢٠ صورة و٥ ميجابايت
للصورة، وأنواع JPG/PNG. تتجاهل خريطة update الفرع والحقول المملوكة للخادم؛
تملك الخدمة مصالحات الأطفال. لا ReverseMap أو حساب عميل بديل.

## الصور الخاصة والتزامن

تُحفظ الصور الجديدة خارج wwwroot في App_Data/PrivateUploads، ويمنع middleware
المسار الثابت AccidentImages بما فيه aliases ذات separators/dots/encoding
والأسماء التي يقبلها Windows. لا ترحيل أو نقل ملفات تجريبية تلقائيًا.
اسم الصورة من الخادم يحمل هوية رافع ERP وGUID، والمسار صارم داخل الشركة.

يقرأ Media/accident-image عبر مصادقة الطلب ومنحة مستقلة، مع no-store وnosniff
وPNG/JPEG فقط. لا public URL أو token link. يتحقق AccidentMediaAccess من
أدلة الربط وحدود كل أصل دون إرجاع بيانات bypass. المسودة غير المرتبطة
لرافعها؛ تنظيفها لا يحتاج بقاء منحة أعمال المحرر بعد فحص Media.DeleteMedia.

يحفظ Add/Update/Remove وتنظيف FileStore تحت ExecuteUniqueWriteAsync من نوع
AccidentImage وشركة واحدة وSerializable. يفحص الحفظ المسار المرتبط حيًا
حتى لو الحادث مخفي، ثم وجود الملف عبر IAccidentImageStorage داخل القفل نفسه.
لا يقبل مسارًا شكليًا بلا رفع أو child ID من تجميع آخر أو تبديل مسار محفوظ.
التزامن الحقيقي وخطط SQL وصلاحيات filesystem تظل قبولًا تشغيليًا معلقًا.

## مطابقة الواجهة والمالكين

| الاهتمام والكتاب | النتيجة المصدرية |
|---|---|
| الشكل UI1/3/5/13 | القائمة بمالكي FeatureTitle/FilterPanel/DataTable، والمحرر routed بتبويبات EditorTabs/EditableRows. لا تغيير CSS للشاشة أو ارتفاع صفحة مخترع. |
| التحميل UI22 | القائمة/التفاصيل/التقرير/الحفظ/الحذف تستخدم LoadingService للصفحة. required dated-vehicle read يملك الصفحة؛ الأخطاء والمحاولة مستقلة. لا loader بصري منافس. |
| المصادر والكاش UI2 | Vehicle.Lookup opted-in عبر VehicleService: bootstrap محدود ثم watch/invalidation. Driver مباشر بلا opt-in. Accident operational/options/movement/private image مصادر مباشرة؛ لا cache جديد لها. |
| الوصول والسياق UI26/28 | أفعال الصف تتأكد من عضوية الكائن الحالي والمنحة والفرع وbusy. إلغاء القراءات والقرارات والمنافذ فوري عند انتهاء الوصول/السياق؛ لا نتيحة قديمة أو ID محجوب يخرج للبحث التالي. |
| المحرر UI13/28 | سياج actor/mode/id، احتفاظ بالمسودة والكتابة المرسلة، وإغلاق select/date portals. العرض بلا اختيارات تحرير، regrant لا يعيد bootstrap فوق draft، والمغادرة المحلية lazy/cancellable بعد الرفض. |
| الرفع UI14/18 | DocumentUploadTracker يملك grants ونتائج الرفع والتنظيف؛ canRemove/removeAllowed/onRemoving متطابقة، وmarkRemoved بعد قبول القرار فقط. لا إعادة حفظ بعد نجاحه بسبب cleanup. |
| الصورة UI18 | FileLink بامتداد opt-in يحمل authenticated blob مع image-read + owner requirement، page loading/error/Retry، وobject URL يلغى عند path/access/context/destroy. الرابط العادي لباقي المستهلكين يحتفظ بعقده. |
| التركيز UI27 | focusField يحتفظ بعمر frames/timer مع cancelOn/destroyRef/allowed؛ لا إحياء لقرار focus قديم بعد revoke/regrant أو تبديل المستند. |
| الإخراج UI21 | ReportPrintSession يلغي القراءة/الإطار المؤجل ويحتفظ بملكية طباعة المتصفح؛ التقرير الحالي فقط، مع حراسة المنحة والسياق قبل الأثر. |
| الحذف وعمر المسار UI28 | حارس القائمة يحمي القرار/preflight والكتابة المرسلة. queue الجلسة يحتفظ بمهام cleanup والعلامات الناجحة عبر remount؛ لا callbacks للمكون في queue ولا إعادة DELETE. Retry صريح لنفس actor بمنح وفرع حاليين. |

إضافتا FileLink/focus تمتّا في مالكيهما المشتركين، ووُثقتا في UI18/UI27
وصفوف مهارة Sigma. جُددت الحزم الثماني من المولد ونجح فحص drift؛ المراجعة
الدلالية أبقت قواعد العرض والصلاحيات والعمر منفصلة عن قبول التشغيل.

## المراجع والتغطية

قُرئت صفحة سبيد 08-fleet/screens/17-accidents والكود C0468 من لقطة٢٨ أكتوبر،
وأُكملت قراءة C0465/C0466/C0470 بما يشمل الحفظ والرفع والقراءات. لا شرح مستقل
مطابق مثبت في catalog٢٧ أكتوبر؛ S286 يخص مطالبة محمولة ولا يُدعى أنه شرح
لهذه الشاشة. وثيقة Odoo19 Fleet/accidents المحلية مكملة لمفهوم المتابعة،
ولا تثبت قواعد إذن أو مالية لخادم Sigma.

تطابق وظائف العرض/الإنشاء/التعديل/الرسوم والصور والمرشحات بنية Sigma الحالية
في نطاق الصلاحيات. وظائف CDW/fault calculations وإرفاق مستند شرطة مستقل
وفواتير/تكرار الحادث وحركات غير عقود الإيجار أهداف وظيفية جزئية/ناقصة خارج
تبني الصلاحيات الحالي؛ لا endpoints أو منح وهمية ولا ادعاء تكافؤ مرجعي.
لم تُقدّم صور جديدة لهذا النطاق. القرار الثابت للفرع من المالك نفسه.

## الأداء والمخطط والقبول

القائمة count+page مع filters/sort قبل pagination، بلا قراءة لكل صف.
التفاصيل جذر/أطفال ثم labels وحركة اختيارية. لا طلب lookups في View أو
مصدر محجوب؛ التقرير يحمّل النتيجة الكاملة فقط عند طلبه. private preview
طلب مباشر لكل صورة مع حد٢٠؛ لا ادعاء زمن أو حجم/خطة SQL مقاس.

الفهرس الجديد (SubscriptionId,BranchId,AccidentDateTime) يخدم نطاق الفروع
والتاريخ ويتداخل جزئيًا مع tenant/date الحالي؛ يضيف تكلفة كتابة وتخزين.
فهرس tenant/vehicle/date يحتفظ بغرضه. يلزم مقارنة الخطة وcold/warm timing
وpayload/render عند المالك؛ لا تغيير فهرس إضافي بالتخمين.

الهجرة المقترحة للمالك AddAccidentBranchOwnership: عمود required/FK/index،
دون default أو backfill. إعداد البداية النظيفة للبيانات والصور التجريبية
من شأن المالك. لم تُنشأ/تُعدل/تُشغل هجرة أو snapshot ولم تمس قاعدة/ملفات مخزنة.

دليل التطبيق محدث ثنائي اللغة في
SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/fleet-guide.ts، موضوع
/FleetAccidents تحت /UserGuide/fleet ومدخل الدليل القائم للأسطول. يشرح المنح
والفرع الثابت والاختيارات والصور وحدودها والحذف والتنظيف دون وعود غير منفذة.

## التحقق وتسليم المالك

اكتملت مطابقة الدمج وإصلاح عمر القائمة، وتدقيق مستقل للخلفية والواجهة ثم
تدقيق متابعة للإصلاح دون finding مؤكد متبقٍّ في النطاق. روجعت الفروق المحددة
في مستودعي الواجهة والخلفية، والملفات الجديدة مباشرةً. فحص whitespace
سليم؛ تحذيرات LF/CRLF فقط. تحليل TS/HTML ووجود imports المحلية شمل ٣٨ ملفًا
وقالبًا وأعاد problems:[]؛ لا type checking أو نجاح build مستنتج منه.
تطابق XML الموردان ولهما ٩ مفاتيح حوادث لكل لغة دون ازدواجية.

المواصفات المصدرية غير المنفذة: ٢٤ للقائمة، و٢٠ للمحرر، و٤ للصورة المشتركة،
و٣ للتركيز و٣ لطابور الجلسة. للخلفية ٢٣ حالة للفرع والتجميع، و٩ للوسائط،
ومواصفات path/static aliases وتصنيف العمليات والمسار. لا ادعاء RED/GREEN.
رُقي FleetAccidents وحده إلى operation-confirmed؛ الجرد ١١٦ مؤكدًا و٨٣
resource-only و٦٠ unknown وبندا سياق وبندا alias، بإجمالي٢٦٣. بقي مخطط
الحوادث وقبول التشغيل معلقين، ولم يكتمل هدف التطبيق كله.

قبول المالك مجمع للنهاية: مدير شركة ومستخدم عادي، منح مستقلة وفرع عرض فقط،
الرابط المباشر، نقل المركبة بعد الحادث، children/aliases، الصور بين الحسابات
والفروع، فشل التنظيف ثم مغادرة/عودة/Retry، سحب المنحة وتغيير actor أثناء
الطلب، ومنع تكرار كتابة نجحت. تشمل التجربة SQL projection/lock/storage
والتحميل المرئي والطباعة والاتجاه والثيمين والشاشة الصغيرة.

رسالة مقترحة للخلفية، دون تنفيذ:
`feat(auth): preserve accident branch ownership and private image access`

رسالة مقترحة للواجهة، دون تنفيذ:
`feat(auth): enforce accident action access and retain cleanup session tasks`

استخدمت الدفعة ملكيات مستقلة للقائمة والمحرر والخلفية مع تدقيقين محدودين؛
الجذر يملك التجميد والمالكين المشتركين والدمج والتوثيق. لم تُنفذ builds أو
tests أو lint أو browser أو DB أو migrations أو commits أو pushes أو deployment.
