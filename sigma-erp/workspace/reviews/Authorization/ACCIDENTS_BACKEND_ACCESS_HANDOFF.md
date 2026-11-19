# تسليم صلاحيات الحوادث — الخلفية

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ٩ نوفمبر ٢٠٢٦ |
| العقد | [العقد وقرار الفرع والصور](ACCIDENTS_ACCESS_CONTRACT_FREEZE.md) |
| النطاق | الخلفية المسندة فقط؛ لا ترقية للوحدة أو الجرد |

## الفرع والعقد

أضيف Accident.BranchId من نوع int إلزامي، بعلاقة Branch مطلوبة Restrict
وفهرس (SubscriptionId,BranchId,AccidentDateTime). يحتفظ الفهرسان القائمان
tenant/date وtenant/vehicle/date بمسارات بحثهما. لا nullable أو قيمة افتراضية
أو backfill لسجلات التجربة. أضيف BranchId إلى AddVM فقط، وBranchId/BranchName
إلى DetailVM، وBranchName إلى ListVM وفرزه ومرشح grid الخاص به.

UpdateVM لا يحمل الفرع. يقرأ UpdateCore أصل الحادث أولًا ثم يمرر BranchId
الأصلي إلى عقد التحقق Add-shaped؛ لا يصطنع صفرًا أو يطلب إعادة اختيار الفرع.
يتجاهل mapper حقلي BranchId/Branch عند map update، بينما يعرض branchName
في read mappings. لا DTO أو مالية أو قيمة رسوم أو حالات مخترعة.

أضيف الجذر Direct<Accident>(BranchId)، والطفلان Paths عبر Accident.BranchId
إلى BranchScopeRegistry. تولد المنظومة الحالية concurrency token للفرع
وFK الطفل عبر التسجيل نفسه. حراسة DbContext تفحص branchId الموجب والثبات
مقابل القيمة المادية الأصلية، قبل شرط HTTP، فتمنع التغيير للمدير والسياق
الداخلي أيضًا. لا تتغير ملكية الفرع أثناء التعديل أو الحذف أو نقل المركبة.
تظل بيانات schema المطلوبة مع المالك؛ لم تُنشأ هجرة أو يعدل snapshot.

تطبق حراسة المصدر الأصل والطفل إسنادات التسجيل عند الكتابة. تضيف حراسة
Accident reference writes تحققًا دفعيًا للمركبات والعقود المستهلكة في
Added/Modified: الشركة، السجل الحي، المركبة النشطة ونطاق تسجيلها، تطابق
العقد مع المركبة، وفروع روابط العقد الطويل إن وجدت. الحذف لا يستهلك
label المركبة ولا يشترط فرعها الحالي؛ يتبع فرع الحادث المحفوظ.

## القراءة والبدائل والحذف

لا تستخدم قائمة الحوادث required Vehicle navigation في إسقاطها أو فرزها.
تعتمد ListProjection استعلام scalar correlated محكوم للمركبة والفرع والعقد؛
فيبقى root المسموح في نتائج/count/page حتى لو حُجبت المركبة بعد نقلها.
لا IgnoreQueryFilters للـlabels. عند الحجب ترجع vehicle label فارغة ورقم
مرجع العقد محجوبًا، دون اختراع snapshot لغير الفرع. مرشحات السائق/العمر
تبقى مستندة للعقد المسموح أصلًا، وExcessCharges يجمع الأطفال الحية المسموحة.

DetailCore يقرأ الجذر وأطفاله دون Include للمركبة المطلوبة، ثم يقرأ label
المركبة/الفرع والحركة بإسقاطات مستقلة محكومة. GetByIdWithNavigations alias
يستعمل DetailCore نفسه، وGetAllWithNavigations/GetManyWithNavigations يستهلكان
إسقاط القائمة نفسه؛ لا recursive graph بديل يعيد labels أو يهدم الجذر.

الحذف يستعمل RemoveWithChildrenAsync القائم لكلا DamageCharges وImages؛
يحذف التجميع soft في save واحد. لا Cascade SQL مفترض لحذف ناعم.
Options يخضع الآن لنطاق فرع الحادث والأطفال؛ فلا تُجمع اقتراحات whoseFault
أو chargingType من حادث محجوب. إضافة/تعديل الجماعيان الموروثان بلا HTTP
أو مستهلك مثبت يرفضان صراحةً، فلا يتجاوز mapper الخام مالك التحقق الفردي.
المنح الفعلية والـHTTP unchanged؛ BranchOperationRules للقراءات الأربع
وواجهة/مسارات/دليل الوحدة والجرد تحت ملكية الجذر، ولم يلمسها هذا العامل.

## موانع العقود

عدلت فحوص وجود الحوادث الثلاثة فقط:
RentalAgreementService.Void، LeaseAgreementService.Remove/Void.
تستعمل Query<Accident>.IgnoreQueryFilters مقيدًا بـSubscriptionId وIsDeleted
وAgreementId وبـAny فقط. لا بيانات حادث تخرج. فالحادث المحجوب بفروعه يظل
مانعًا صالحًا لحذف/إلغاء عقده. بقية المالية والتغييرات السابقة في الملفين
محفوظة دون تعديل أو دمج ضمن هذه الشريحة.

## ربط الصور والحفظ المتزامن

استهلكت helper الجذر AccidentImagePath فقط دون تعديله. الملفات الجديدة
Id=null يجب أن تطابق الصيغة الجديدة للشركة، ويطابق uploaderId مطالبة
IdentityClaimTypes.ErpUserId الموقعة. لا توافق لمسارات GUID التجريبية القديمة.
الصورة المحفوظة تبقى path وOriginalFileName مساويين تمامًا للصف الأصلي؛
لا تبديل مسار/اسم أو تقمص هوية child آخر. تمنع مسارات مكررة داخل payload.

قبل attach جديد يفحص Any ضيق tenant/live في AccidentImage مع parent حي
من نفس الشركة، بما يشمل الجذور المحجوبة. لا يُعاد استخدام bypass في قراءة
تفاصيل. لا يُقبل مسار مرتبط حيًا حتى بهوية جديدة بلا Id. معرفات child
المحفوظة غير مقبولة على الإنشاء. لا يمس IsValidImage الملفات أو الشبكة.

Add/Update/Remove يشاركون ExecuteUniqueWriteAsync<AccidentImage> بقفل tenant
واحد، وSerializable transaction تحت المالك القائم. يتجاوز fixture غير
العلائقي قفل SQL فقط؛ جميع validators تبقى نفسها. يمنع هذا race ربط
المسار نفسه بحادثين بين writers المشاركين؛ على مالك FileStore cleanup
استخدام نوع AccidentImage/tenant نفسه لفحص الارتباط والحذف. لا قفل جديد
أو SQL محلي أو commit لtransaction مالك خارجي.

أرسل العامل للجذر ثمانية resource keys جديدة للترجمة الثنائية؛ يستهلكها
BusinessFailure/Invalid المعرّف على instance. ملفات resx خارج ملكية العامل؛
الجذر يملك إضافتها والتحقق منها. FileStore/Media/Program/helper والـblob
والواجهة خارج هذه الشريحة؛ لا يُدعى اكتمال حماية الصور من attach validation.

## الملفات والتحقق

ملفات المصدر المسندة: AccidentService، AccidentProfiler، Accident entity،
AccidentConfig، AddVM/DetailVM/ListVM، BranchScopeRegistry،
SiGmaDbContext.BranchAccess، وفحوص الوجود الثلاثة المحددة في Rental/Lease.
أضيف AccidentBranchScopeTests.cs؛ لا تعديل في UpdateVM أو المال أو branch
operation rules أو source خارج التفويض.

أضيفت ٢١ حالة مصدرية (١٦ Fact + خمسة InlineData عبر Theoryين): نطاق
الجذر/الأطفال، المركبة المنقولة وعدم كشف label، count والبدائل والاقتراحات،
الثبات للمدير والعادي والداخلي، detached update، الطفل ذي استعراض فقط،
مرجع مركبة غير قابل للتسجيل، رفض bulk raw، branch missing/unknown/denied،
الحفظ الصريح والإبقاء على الفرع الأصلي بالتعديل، حذف الأطفال، هوية رافع
الصورة والمسار المرتبط المحجوب وثبات الصورة المحفوظة. لم تُشغّل المواصفات
ولم يُدّعَ RED/GREEN أو نجاح بناء.

روجعت فروق المستودع المحددة كاملة، وقُرئت شرائح الملفات untracked مباشرة؛
ليست الفروق الفارغة إثباتًا لها. فحص whitespace/merge markers للمصدر المسند
سليم، وgit diff --check سليم مع تحذير LF/CRLF في ملفي العقود فقط. تحققت
namespaces/using/project references وSDK source inclusion مصدريًا؛ لا type
checking أو C# parser أو compilation. يلزم المالك التحقق من ترجمة الإسقاطات
correlated وTPT والفلاتر المركبة إلى SQL والتزامن والأقفال الفعلية.

قراءات القائمة ما زالت count+page، مع predicates/sort قبل pagination. لا
قراءة لكل صف؛ labels correlated داخل SQL المتوقع. التفاصيل أصل/أطفال ثم
قراءتا label وحركة اختيارية، بدل تحميل graph مركبة/عقد واسع. لا ادعاء
تحسين سرعة؛ SQL/query splitting/latency وحجم payload وإخراج report تبقى
معلقة. الفهرس الجديد يخدم tenant/branch/date ويضيف كلفة كتابة وتخزين؛
يتداخل جزئيًا مع tenant/date ويحتاج تقييم الخطة مع المالك بعد schema.

الهجرة المقترحة للمالك: AddAccidentBranchOwnership، عمود required/FK/index
دون default/backfill. تجهيز clean-start لبيانات التجربة عند المالك فقط.
رسالة commit مقترحة لا تُنفذ:
feat(auth): preserve accident execution-branch ownership and private image links

لم أشغل build/tests/lint/browser/DB/migration/snapshot/commit/push/deploy.
المراجع المصدرية والقواعد/المهارة والعقد المحدث قرئت؛ لا نية لتطوير وظائف
الحوادث خارج تبني الصلاحيات، ولا ترقية للوحدة قبل مراجعة الجذر وبوابة الملفات.
