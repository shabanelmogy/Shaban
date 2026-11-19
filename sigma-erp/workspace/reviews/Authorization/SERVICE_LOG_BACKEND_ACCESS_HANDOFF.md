# تسليم حماية فرع التنفيذ — Service Log / WorkshopMovement

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## النطاق والقرار

- العقد: `reviews/Authorization/SERVICE_LOG_ACCESS_CONTRACT_FREEZE.md` وملحق قرار المالك بتاريخ ٩ نوفمبر ٢٠٢٦.
- القرار المنفذ مصدرّيًا: `WorkshopMovement.BranchId` هو لقطة فرع التنفيذ وقت التسجيل، ولا يعاد اشتقاقه من فرع المركبة الحالي.
- التوافق مع البيانات القديمة: الحقل nullable؛ الصف القديم بلا فرع لا يظهر للمستخدم العادي، ويبقى مرئيًا لمدير الشركة فقط.
- التعديل العادي لا يقبل `BranchId` في `WorkshopMovementUpdateVM`؛ الـmapping يبدأ من الصف القائم فيحفظ اللقطة، بينما حارس الحفظ يفحص فرع الأصل والحالي.

## المنتجون المباشرون

| المنتج | مسار المصدر | المعالجة المصدرية |
|---|---|---|
| إنشاء سجل الخدمة | `SiGma.Business/Services/ServiceLogService.cs`، `AddAsync` | يتطلب `ServiceLogAddVM.BranchId` موجبًا، يثبت فرعًا نشطًا من نطاق الشركة/التسجيل، ثم يحفظه في `WorkshopMovement`. قراءة المركبة القائمة تبقي حراسة فرع المركبة الحالي أيضًا. |
| CRUD حركة الورشة | `SiGma.Business/Services/WorkShopServices/WorkshopMovementService.cs` | يتطلب `WorkshopMovementAddVM.BranchId`، يشغّل تحقق المراجع المؤجرة، يثبت الفرع النشط، ويحفظه. مسار update لا يقبل تغيير الفرع. الحذف والتفعيل والتحديث ترث حارس root. |
| إكمال تنبيه خدمة مركبة | `SiGma.Business/Services/FleetAlertsService.cs`، `CompleteVehicleServiceAsync` | يتطلب `CompleteVehicleServiceVM.BranchId`، يثبت الفرع النشط ويحفظه. تبقى قراءة المركبة المؤجرة وتحديث عدادها كما كانا، فتظل حراسة فرع المركبة الحالي إلى جانب فرع التنفيذ. |

لا يوجد إنشاء مباشر آخر لـ`WorkshopMovement` في نطاق البحث المحدود بعد هذه الثلاثة.

## القراءات والمستهلكون المباشرون

كل القراءات الآتية تبدأ من root `WorkshopMovement` بواسطة `Repository.Query` أو `QueryReport` أو `DbSet`. بعد تسجيل النوع في `BranchScopeRegistry.Direct` ترث فلتر فرع التنفيذ المحفوظ؛ لم يوجد `IgnoreQueryFilters` مرتبط بالنوع في البحث المحدود.

| المستهلك | الموضع/الغرض |
|---|---|
| `ServiceLogService` | قائمة `/ServiceLog` و`GetAllWithNavigations`، مع `BranchId/BranchName` في الإسقاط و`ServiceLogListVM`. |
| `WorkshopMovementService` | قائمة وتفاصيل CRUD، مع `BranchId/BranchName` وضم `Branch`. |
| `WorkshopService` | قائمة مركبات الورشة. root محمي، لكن قيمة العرض `Branch` ما زالت تأتي من `Vehicle.Branch` لا لقطة التنفيذ؛ خارج ملكية هذه الشريحة ويجب تصنيفها قبل ادعاء أن العمود يعرض فرع التنفيذ. |
| `CollectionMovementService` | تجميع الحركات؛ root محمي، ويسقط `MovementDto.BranchOut` من `WorkshopMovement.Branch.Name` المحفوظ. |
| `DashboardService` | عدادات آخر حركة ورشة عبر `QueryReport`; ترث global root filter. |
| `FleetAlertsService` | قراءات الكيلومترات وآخر تنفيذ؛ ترث root filter. الوحدة وصلاحياتها الأوسع ليست مكتملة بهذه الشريحة. |
| `LeaseAgreementService` | لقطة وقود آخر حركة؛ ترث root filter. |
| `TrafficFineService` | فحص وجود حركة ورشة؛ يبدأ من root ويحترم الفلتر. |
| `VehicleService` | لقطات الوقود وتفاصيل آخر حركة. أصلح الجذر BranchOut لآخر حركة ليأتي من فرع التنفيذ المحفوظ دون fallback لفرع المركبة الحالي؛ باقي حالة المركبة تبقى تحت نطاق المركبة الحالي. |
| `VehicleStatusCorrectionService` | يستنتج آخر حالة ورشة؛ يرث root filter. |

`DailyServiceLogReportService` ليس مستهلكًا لـ`WorkshopMovement` رغم تشابه الاسم؛ مصدره `Job` و`JobDetail`، لذلك استُبعد.

ملاحظة خارج هذا السطح المحدد: `CollectionMovementService` ما زال يشتق `_subscriptionId` من `ClaimTypes.NameIdentifier` ويستخدمه في كل مصادر التجميع. global query filter يبقى حاجز الشركة/الفرع لـ`WorkshopMovement`، لذلك لم يثبت تسريب شركة هنا، لكن mismatch المعرّف قد ينتج قائمة فارغة. لم يُصلح parsing العام لأن التفويض الإضافي اقتصر على إسقاط `BranchOut` في `GetWorkshopMovementsAsync`.

العلاقة بالمركبة اختيارية (`VehicleId` nullable). لذلك يبقى root مقروءًا بفرع التنفيذ بعد انتقال المركبة، بينما قد تصبح navigation المركبة الحالية `null` بفعل فلتر فرع المركبة إذا لم يعد المستخدم يقرأ فرعها الحالي. هذا يمنع تسريب اللوحة/بيانات المركبة من الفرع الآخر، لكنه يعني أن labels الحالية والبحث باللوحة قد لا يطابقان السجل التاريخي بعد الانتقال. لم يُستخدم `IgnoreQueryFilters` لتجاوز هذا الحد، ولم يُخترع snapshot لوحة غير موجود في المخطط.

## الحماية والـDTO

- أضيف `WorkshopMovement` كـ`Direct("BranchId")` في `BranchScopeRegistry`؛ فينتج فلتر tenant+saved branch، ويصبح `BranchId` concurrency token، ويفحص الحارس فرع الأصل والحالي في update/delete/activation.
- أضيف FK اختياري إلى `Branch` بسياسة `Restrict` وفهرس `{ SubscriptionId, BranchId, DateOf }`.
- أضيف `BranchId/BranchName` إلى DTOs قائمة/تفاصيل `WorkshopMovement` وإلى `ServiceLogListVM` وإسقاطه الداخلي.
- بقي `WorkshopMovementUpdateVM` بلا `BranchId` عمدًا لمنع تغيير snapshot في التعديل الطبيعي.
- تحقق `WorkshopMovementService.AddAsync` يشغّل `InvalidInputAsync` قبل mapping؛ وبذلك لا يقبل مراجع `Vehicle/Workshop/Driver` من شركة أخرى أو محذوفة عبر المفاتيح الأجنبية أحادية العمود.
- أزيل تفسير `ClaimTypes.NameIdentifier` القديم من `WorkshopMovementService`؛ القائمة والتفاصيل والإنشاء تستخدم `UnitOfWork.Repository.SubscriptionId` بوصفه مالك tenant الموثق.
- يرفض حارس `SiGmaDbContext` تغيير `WorkshopMovement.BranchId` لصف قائم حتى لمدير الشركة؛ أي إصلاح legacy هو عمل مالك بيانات صريح خارج update العادي.

## المواصفات المصدرية

أضيفت إلى:

`tests/SiGma.BranchAccess.Tests/BranchDataScopeTests.cs`

وتغطي:

1. القراءة حسب فرع التنفيذ المحفوظ حتى إذا كان فرع المركبة الحالي مختلفًا.
2. إغلاق legacy null عن المستخدم العادي مع إتاحته لمدير الشركة.
3. فحص فرع الأصل عند محاولة إعادة إسناد detached update.
4. منع صاحب فرع عرض فقط من كتابة حركة الورشة.
5. إبقاء `BranchId` عند mapping تحديث عادي، ورفض تغيير الفرع المحفوظ حتى للمدير عند حراسة persistence.

لم تُشغّل المواصفات بسبب حد Sigma المصدرّي الصريح؛ لا توجد نتيجة runtime أو SQL مدعاة.

## متطلب مالك قاعدة البيانات

تحتاج النتيجة هجرة يملكها Master7 بالاسم المقترح:

`AddWorkshopMovementExecutionBranch`

ويجب أن تضيف عمود `BranchId` nullable، FK إلى `Branch(Id)` بسياسة Restrict، وفهرس `{ SubscriptionId, BranchId, DateOf }`، من دون backfill تخميني للصفوف القديمة. لم تُنشأ هجرة، ولم يُعدل `SiGmaDbContextModelSnapshot.cs`، ولم تُشغّل أوامر قاعدة بيانات.

## حدود التسليم

- لا تغيير مالي أو حسابي أو عداد؛ تحديث `Vehicle.KMs` القائم بقي كما هو.
- لم تُنفذ build/tests/lint/browser/DB/migration/snapshot/commit/push/deploy.
- إصلاح تصنيف `ServiceLog.Search/GetAllWithNavigations` في `BranchOperationRules` ومواصفاته ملك الجذر وليس ضمن هذا الفرق.
- لم تُعدّل شاشات frontend أو صلاحيات FleetAlerts الأوسع، ولا يدّعي هذا التسليم اكتمال وحدة FleetAlerts أو نشر المخطط.

تكامل الجذر: نُقل هذا التسليم إلى مجلد reviews المعتمد. يفضل محول عرض
logsMovement فرع تنفيذ الحركة نفسه دون fallback لفرع صف آخر. يبقى عمود
WorkshopService شاشة مركبات الورشة وصفًا لفرع المركبة الحالي كما عقده؛
ليس اسمًا بديلًا لفرع تنفيذ سجل الخدمة ولا يُعرض على أنه لقطة تاريخية.
