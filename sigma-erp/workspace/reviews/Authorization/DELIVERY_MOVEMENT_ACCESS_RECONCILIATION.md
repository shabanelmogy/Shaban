# مطابقة صلاحيات حركات التسليم — DeliveryMovement

| البند | القيمة |
|---|---|
| Status | Implemented — migration applied; runtime acceptance pending |
| التاريخ | 2026-11-11 |
| العقد | [DELIVERY_MOVEMENT_ACCESS_CONTRACT_FREEZE.md](DELIVERY_MOVEMENT_ACCESS_CONTRACT_FREEZE.md) |
| الاكتشاف | [DELIVERY_MOVEMENT_ACCESS_DISCOVERY.md](DELIVERY_MOVEMENT_ACCESS_DISCOVERY.md) |
| الجرد بعد إقفال المصدر | 141 مؤكدًا من 263؛ DeliveryMovement رُقّي لبند `operation-confirmed` واحد |

**تحديث 11 نوفمبر بعد إذن المالك بالهجرات والبيانات التجريبية:** طُبّقت هجرة `20261111193031_MovementPermissionsScope20261111` وتضمنّت فهارس/علاقات الحركة والتقليص المصدرّي لطول KMs إلى 50 حرفًا (أكد فحص البيانات عدم وجود قيمة أطول قبل التنفيذ). أُسندت 5 حركات تسليم قديمة بلا `BranchOutId` إلى فرع نشط موجود **ضمن الاشتراك نفسه** بناءً على تصريح المالك بإمكان استخدام أي بيانات تجريبية؛ فحص ما بعد الهجرة أظهر صفر فروع تاريخية مفقودة. ظلت الخاصية nullable في المخطط، ولا يدل هذا التعويض على فرع تاريخي حقيقي. القبول التشغيلي والأداء للمالك؛ الفقرات القديمة أدناه تُقرأ كسجل ما قبل هذه الهجرة.

## المنح والمسارات

| العملية | السياسة | التنفيذ المقصود |
|---|---|---|
| عرض القائمة والبحث والصفحات وExcel | `DeliveryMovement.View` | رابط `/DeliveryMovement`، صفوف وصادرات مقيّدة تاريخيًا بـ`BranchOutId` |
| عرض التفاصيل بالرابط | `DeliveryMovement.View` | `/DeliveryMovement/details/:id`، دون اشتراط خيارات الإنشاء |
| إنشاء مباشر | `DeliveryMovement.Create` + `Branch.Lookup` + `RentalAgreement.Lookup` + `RentalAgreement.View` | `/DeliveryMovement/create`، مستقل عن View والقائمة؛ الاستفادة من `RentalAgreement.View` لقراءة سياق الاتفاقية الحالي |
| اختيار سائق | نفس شروط الإنشاء + `Driver.Lookup` | خيار إضافي غير حاجز، لكن الخادم يطلب المنحة عند إرسال `DriverId` |
| إغلاق أو إرجاع أو تعديل/حذف/تفعيل | لا دعم حالي | لا أزرار وهمية ولا منح قابلة للإسناد؛ `405` للخادم الموروث غير المدعوم |

يتحقق الخادم من اعتماديات الإنشاء في `SiGma.ServerAPI/Authorization/PermissionPrerequisites.cs`، بما فيها `Driver.Lookup` المشروطة إذا أُرسل سائق. يعتمد `ClaimTypes.NameIdentifier` على SubscriptionId الموقّع عمدًا كما في Sigma؛ لا تعديل على الـRepository أو آلية الاشتراك.

## تحميل UI22 ومالك كل طلب

| المصدر/الطلب | مالك التحميل | إلغاء/نهاية الطلب | الخطأ وإعادة المحاولة |
|---|---|---|---|
| `DeliveryMovementService.getList` | صفحة القائمة العامة | `switchMap` مع إلغاء عند فقد View وتغير السياق و`finalize` بعد الاستجابة/الفشل/الإلغاء | رسالة قائمة وRetry؛ لا صفوف سابقة |
| `getAllList` — كامل الصفحات | مؤشر الصفحة العام حتى اكتمال جميع الطلبات | إلغاء عند فقد View/تبدل سياق الحساب، لا إصدار ملف جزئي | خطأ تصدير واحد من الصفحة، إعادة تصدير يدويًا |
| نافذة العرض `GetByWithNavigationsId` | نافذة التفاصيل محليًا `loadingData` | إلغاء عند إغلاق النافذة أو فقد View أو تبدل السياق؛ عرض نتيجة الهوية الصحيحة فقط | خطأ محلي وRetry، لا طباعة مستقلة لهذه النافذة |
| `RentalAgreement/GetSelect` و`Branch/GetSelect` | تحميل خيارات المحرر `lookupsLoading` محلي | إلغاء عند فقد Create/المصادر أو تبدل النافذة | خطأ محلي وRetry، منع حفظ قبل الخيارات المطلوبة |
| `RentalAgreement/GetByWithNavigationsId` للسياق | تحميل الاتفاقية `agreementLoading` محلي | إلغاء عند اختيار أخرى أو سحب الوصول أو تبدل الجلسة | خطأ محلي وRetry؛ لا حفظ قبل سياق ناجح |
| `Driver/GetSelect` الاختياري | نافذة المحرر، بلا حجب إنشاء | إلغاء عند فقد Driver.Lookup/تبدل النافذة | خطأ محلي وRetry اختياري؛ يمكن حفظ الحركة دون سائق |
| `POST /DeliveryMovement` | المؤشر العام للحفظ | POST المرسل يستقر دون `takeUntilDestroyed`، مع حارس ناتج `CAN_PRESENT_API_OUTCOME` للسياق والمنحة | معترض API العام يملك نجاح/فشل الكتابة مرة واحدة |

## الكاش وملكية المخرجات

`Branch/GetSelect` يستخدم كاش `BranchService.cacheSelect=true` و`ReferenceLookupBindings` لمراقبة الخيارات وإعادة المحاولة، وتحديث الكاش المحتفظ ببياناته صامت دون تحميل صفحة عام. `RentalAgreement/GetSelect` و`Driver/GetSelect` قراءتان مباشرتان عبر `BaseService`؛ خيارات السائق اختيارية مع خطأ محلي وRetry غير حاجز. لا يعاد استخدام خيارات بين مستخدمين أو اشتراكات؛ تبديل الحساب أو الجلسة يلغي ملكية النافذة القديمة. قائمة create-only لا تطلق قراءات list ولا Excel. تحتفظ المسودة بحقولها عند فقد منحة مؤقتًا، وتمنع الكتابة حتى تعود الاعتماديات. تُستمد `VehicleId` و`CustomerId` للعرض من تفاصيل الاتفاقية؛ **لا ترسلهما الواجهة للحفظ**، وتعيد الخلفية استخلاصهما من الاتفاقية الصالحة.

## المخطط والفروع والأداء

سجلات حركة التسليم مرتبطة بـ`DeliveryMovement.BranchOutId` التاريخي حسب `BranchScopeRegistry`. التطبيق الجديد يرفض إنشاء بلا فرع تنفيذ موجب ومصرح بالكتابة عليه، ولا يختلق فرعًا من اسم الاتفاقية أو موضع المركبة الحالي. الـDB النموذجي لا يزال يسمح بـNULL للحركات التاريخية؛ **لا يجوز اعتبارها معروضة لأي موظف عادي بلا فرع**. التنظيف الصحيح يتطلب مصدرًا حقيقيًا لفرع التنفيذ لكل سجل أو مراجعة مالك، ولا يجوز backfill بالفرع العشوائي. قد تتطلب الحاجة تنظيفًا/قيد `NOT NULL` لاحقًا بهجرة مستقلة يصرح بها المالك؛ لم يحدث تعديل Snapshot أو DB.

يطبّق استعلام المصدر `GetManyWithNavigationsAsync` مرشحات النوع والاتفاقية واللوحة والرقم والتاريخ والفرع والسائق مع `GridFilter` ثم `CountAsync`، ويرتب `DateAndTime DESC, Id DESC` قبل paging. تسمية السجلات المرتبطة من استعلامات منفصلة ذات نطاق؛ انتقال المركبة لاحقًا لا يُسقط الحركة التاريخية، ويخفي بيانات المركبة غير المتاحة. صرحت EF Config بفهرس `(SubscriptionId, BranchOutId, DateAndTime, Id)` وفهرسين آخرين `(SubscriptionId, AgreementId, DateAndTime)` و`(SubscriptionId, VehicleId, DateAndTime)`، وFK `Restrict` للفروع والاتفاقيات والأطراف، و`KMs` حتى 50 حرفًا. هذه **تعريفات مصدرية لم تُطبَّق دون هجرة**، ولها كلفة كتابة ومساحة؛ لا توجد قياسات SQL فعلية أو تأكيد EF translation. الظهور في Speed لبيانات DateIn/Status والعودة لا يثبت lifecycle قائمًا في Sigma؛ لا يدّعي التقرير إغلاقًا أو إرجاعًا حقيقيًا.

## التحقق والمسؤولية

- قراءة المصدر: guide ثم explanation ثم controllers لـSpeed؛ frontend list/editor/service/models/routes؛ Backend service/controller/domain/EF/DTO/branch scope، مع عقد هذه الوحدة.
- سلّم `worker-1` خدمة الخلفية و`DeliveryMovementController` والـVM/Mapper/EF/PermissionEndpointResolver، وأودع مواصفات مصدر غير منفذة `tests/SiGma.BranchAccess.Tests/DeliveryMovementAccessContractTests.cs`. سلّم `worker-2` القائمة والمسارات وسياسة الوصول، وأودع `components/list/list-access.spec.ts` غير منفذة. حافظ الاثنان على تعديلات الملفات الأخرى ولم يطلبا تشغيل أي خطوة محظورة.
- الوكيل الأساسي دمج محرر التفاصيل مع الصلاحيات ودورة خيارات الاتفاقية والفرع والسائق، وتخزين الفرع التاريخي، ومنع الطلب/المخرجات القديمة، وحفظ POST مستقلًا عن destroy، وأضاف اعتماديات الخادم في `PermissionPrerequisites`. النموذج الذي ترسله الواجهة لا يحوي `VehicleId` أو `CustomerId` أو `SubscriptionId` أو رقم حركة.
- لم يُشغَّل build/tests/lint/typecheck/browser/DB/migration/commit/push/deploy؛ صلاحية الكتابة/القراءة الفعلية، وتكلفة الاستعلام والفهارس، وقبول المصدر المترجم نقاط مالك، وليست ادعاءات قبول.
- التحقق المصدرّي: تقريرا العاملين، ومراجعة scoped diff في كل Git repo و`git diff --check`، وسياسة endpoints وشروط Add/View، والجرد لترقية صف واحد. الكود متاح لمراجعة المالك قبل مرحلة التشغيل.
