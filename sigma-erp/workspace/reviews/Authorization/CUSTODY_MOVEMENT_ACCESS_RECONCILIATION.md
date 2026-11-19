# مطابقة صلاحيات حركات العهدة — CustodyMovement

| البند | القيمة |
|---|---|
| Status | Implemented — migration applied; runtime acceptance pending |
| Owner verification pending | yes |
| التاريخ | 2026-11-11 |
| العقد | [عقد حركات العهدة المجمد](CUSTODY_MOVEMENT_ACCESS_CONTRACT_FREEZE.md) |
| الاكتشاف | [أدلة الاكتشاف ومرجع Speed](CUSTODY_MOVEMENT_ACCESS_DISCOVERY.md) |

**تحديث التنفيذ 11 نوفمبر بعد أحدث تصريح المالك:** جرى إنشاء وتطبيق هجرة EF `20261111193031_MovementPermissionsScope20261111`. أضافت `EmployeeId` مرحليًا nullable، ثم أسندت حركات العهدة التجريبية الـ11 إلى موظف حقيقي نشط من الاشتراك نفسه مع تفضيل فرع الحركة، ثم حولته إلى `NOT NULL` وربطته بـ`Staff` وفهرست نطاق القراءة؛ وحوّلت `AgreementId` إلى nullable ونظّفت القيم الصفرية والمراجع الاتفاقية غير الصالحة قبل FK. التحقق المباشر بعد التطبيق: صفر حركة بلا موظف، صفر اشتراك مخالف للموظف، صفر اتفاقية بقيمة صفر؛ المخطط `EmployeeId NOT NULL` و`AgreementId NULL`. لأن `Staff` في Sigma يرث TPT، فالمصدر الحقيقي لحقول الاشتراك والنشاط والفرع هو `Partner` المربوط عبر `Staff` ← `MemberPartner` ← `Partner`، وليس جدول `Staff` نفسه؛ SQL الإرشادي التاريخي أسفل هذا التحديث لم يعد النص المنفّذ. القبول التشغيلي وEF translation وخطط الأداء غير مُثبتة بمجرد الهجرة.

## ملكية العملية والمداخل

| العملية | الواجهة ومصدر الطلب | المنحة/المدخل | سلوك رفض أو تغير سياق |
|---|---|---|---|
| القائمة والبحث والصفحات | `CustodyMovement/components/list/list.component.ts`، `CustodyMovementService.getList` | `CustodyMovement.View` على `/CustodyMovement` | إخفاء البيانات القديمة وإلغاء القراءة، ثم إعادة طلبها عند عودة المنحة |
| مرشح الفرع والموظف | `BranchService.getSelectList` و`StaffService.getSelectList` | `CustodyMovement.View` + `Branch.Lookup` أو `Staff.Lookup` حسب الفلتر | اختياريان؛ عند سحب المنحة يلغى الطلب ويزال الفلتر، دون منع القائمة |
| تفاصيل من الصف أو رابط | `CustodyMovementDetailsComponent`، `getCustodyMovementDetails` | `CustodyMovement.View` على `/CustodyMovement/details/:id` | إلغاء الطلب ومنع عرض/طبع تفاصيل سياق انتهى |
| Excel | `getAllList` يجمع صفحات القائمة | `CustodyMovement.View` | إلغاء تجميع الصفحات عند انتهاء المنحة ومنع نشر الملف القديم |
| الطباعة | نافذة تفاصيل الحركة و`ReportPrintService` | `CustodyMovement.View` | أولًا نجاح قراءة التفاصيل المحفوظة، ثم التحقق من الوصول عند تحضير الطباعة |
| نافذة إنشاء مستقلة | `CustodyMovementDetailsComponent.save` و`addCustodyMovement` | `CustodyMovement.Create` + `Branch.Lookup` + `Vehicle.Lookup` + `Staff.Lookup` على `/CustodyMovement/create` | تظل المسودة؛ تمنع كتابة جديدة عند السحب، وتستقر الكتابة المرسلة وتُحجب نتيجتها عن السياق الآخر |
| اتفاقية اختيارية | `RentalAgreementService.getSelectList` | `RentalAgreement.Lookup` فوق متطلبات الإنشاء عند استخدام الاتفاقية، مع شرط خادم في `PermissionPrerequisites` عندما يكون `AgreementId` غير فارغ | لا تحجب الإنشاء بدون اتفاقية؛ إزالة المنحة تخفي الخيارات وتمنع إرسال اتفاقية مختارة |

تُنشئ الواجهة طلبًا دون رقم حركة أو اشتراك، ويعيّن الخادم `CustodyMovementNo` من الرقم الذي يولّده المستودع. يتطابق حقل الموظف الإلزامي في `CustodyMovementAddPayload` و`CustodyMovementAddVM` مع `CustodyMovement.EmployeeId` وعلاقته إلى `Staff`. مسار الإنشاء المباشر مستقل عن منحة قراءة القائمة، بينما ينتمي مسار التفاصيل إلى `CustodyMovement.View`.

تعتمد أحكام الفروع على `BranchAccessSnapshot`: حفظ فرع تنفيذ مباشر وثابت، وقراءة سجل الشركة الحي في نطاق الفرع التاريخي، ومنع حفظ السجل بفرع غير مصرح بالتسجيل عليه. لا يُستنتج فرع السجل من مركبته الحالية. يضع `IdentityTokenService` رقم الاشتراك عمدًا في `ClaimTypes.NameIdentifier` ويطابقه مرشح JWT مع claim الاشتراك الموقّع؛ تستمر خدمة العهدة و`Repository` و`SiGmaDbContext` باستعمال هذه الآلية الحالية دون تغيير. `SubscriptionId` مملوك للخادم ولا يقبل من طلب Angular. اقتراح تغيير تسمية claim يعالج النظام كله مستقلًا.

## جرد الاستبعادات

لا تستعمل واجهة Sigma الفعلية Update أو Delete أو Close أو Activate أو approval للعهـدة. ينتمي التعديل والإغلاق والحذف المذكور في مرجع Speed إلى فجوة وظيفية تحتاج دورة حالة وحقوق عمل معتمدة، وليس إلى تبني منح شاشة حالية. عموم `CheckUnique` و`GetSelect` الموروث لا يثبت حقل فريدًا أو قائمة مُستهلكة؛ أي وظيفة موروثة تُراجَع على المصدر وحده.

**فارق الطرف المستلم المحسوم:** Speed يذكر عهدة المركبة وفتحها وإغلاقها دون حقل موظف/سائق مستلم إلزامي أو موظفي تسليم واستلام منفصلين؛ الكود `C0753` يسجل فقط المركبة والموقع والتاريخ والعداد والوقود، فيما يعرض `C0755` مدة `DriverMinutes` المحسوبة من وقتي الحركة. فوّض المالك اختيار الأنسب، واعتُمد **موظف مسؤول واحد إلزامي** داخل Sigma باعتباره امتدادًا مقصودًا؛ لا حقول منفصلة للتسليم والاستلام.

**مخطط مقترح بعد حسم العقد:** لقطة `SiGmaDbContextModelSnapshot.cs:12910-12987,38255-38272` لا تحتوي EmployeeId/DriverId، وتعرّف `AgreementId` غير قابل للقيمة الفارغة، وعلاقته بالاتفاقية غير موجودة. آخر هجرة مصدرية `20261111053918_check-update-auth.cs` تعدّل ساعات `DriverTimeSheet` فقط. يحتاج المخطط عمود `EmployeeId` إلزاميًا وFK لـ`Staff`، وجعل `AgreementId` اختياريًا، مع تقييم فهرس `EmployeeId` للفلترة وعلاقة الاتفاقية. الأمر المقترح للمالك بعد إتمام المصدر: `Add-Migration CustodyMovementEmployeeAndOptionalAgreement`، دون تشغيله أو تعديل اللقطة. بيانات الاختبار تُسند إلى موظف فعلي موجود من نفس الاشتراك بمرحلة nullable انتقالية داخل الهجرة كما يلي؛ لا رقم موظف مختلق أو إسقاط بيانات أو تنفيذ SQL حاليًا.

**قرار المالك الأحدث بشأن البيانات التجريبية:** يجوز إسناد أي موظف **موجود فعليًا ونشط ومن الاشتراك نفسه** إلى حركات العهدة التجريبية. يُفضّل موظف من فرع الحركة إن وجد، وإلا يختار أول موظف حي من الشركة نفسها، ولا يُنشأ موظف وهمي أو يُسند سجل إلى شركة أخرى. لأن `EmployeeId` غير موجود في المخطط الحالي، لا يمكن تحديثه قبل إدخال العمود. يجب تجهيز هجرة المالك على ثلاث مراحل داخل تطبيقها: إضافة `EmployeeId` مؤقتًا كعمود nullable، تنفيذ المعالجة الموضحة أدناه، ثم `ALTER COLUMN` إلى `NOT NULL` وإنشاء FK وفهرس مناسب؛ يجب تحويل الاتفاقية إلى nullable قبل تحويل أصفارها. لا تضيف `defaultValue: 0` في الهجرة.

```sql
-- مقطع تجهيز بيانات تجريبية يُدمج داخل هجرة المالك بعد إضافة EmployeeId nullable
-- وبعد AlterColumn AgreementId إلى nullable، وقبل جعل EmployeeId مطلوبًا.
-- لا يُشغَّل الآن، ولا يعمل على بيئة إنتاجية دون عقد بيانات منفصل.
IF EXISTS (
    SELECT 1
    FROM dbo.CustodyMovement AS movement
    WHERE NOT EXISTS (
        SELECT 1 FROM dbo.Staff AS employee
        WHERE employee.SubscriptionId = movement.SubscriptionId
          AND ISNULL(employee.IsDeleted, 0) = 0
          AND employee.IsActive = 1 AND employee.IsInactive = 0
    )
)
    THROW 51001, 'A custody movement tenant has no active employee; prepare real staff before migration.', 1;

UPDATE movement
SET EmployeeId = employee.Id
FROM dbo.CustodyMovement AS movement
CROSS APPLY (
    SELECT TOP (1) staff.Id
    FROM dbo.Staff AS staff
    WHERE staff.SubscriptionId = movement.SubscriptionId
      AND ISNULL(staff.IsDeleted, 0) = 0
      AND staff.IsActive = 1 AND staff.IsInactive = 0
    ORDER BY CASE WHEN staff.BranchId = movement.BranchId THEN 0 ELSE 1 END, staff.Id
) AS employee
WHERE movement.EmployeeId IS NULL;

UPDATE dbo.CustodyMovement
SET AgreementId = NULL
WHERE AgreementId = 0;

IF EXISTS (SELECT 1 FROM dbo.CustodyMovement WHERE EmployeeId IS NULL)
    THROW 51002, 'A custody movement has no assigned real employee.', 1;
```

عند إكمال المخطط يتعين على المالك توليد الهجرة الواحدة `Add-Migration CustodyMovementEmployeeAndOptionalAgreement` وفحص FK/FK-delete behavior والفهرس والـmigration script قبل التطبيق. هذه تعليمات مصدرية فقط؛ **لم تُشغَّل أي أوامر SQL أو تحديث بيانات أو هجرات**.

## أدلة التحقق المصدرية وقبول التشغيل

### بوابة تحميل UI22 — مسارات الفحص اللازمة بعد حسم الطرف

| الطلب والمالك | بداية مؤشر التحميل/نهايته | الخطأ وإعادة المحاولة | الحالة |
|---|---|---|---|
| قائمة `getList` من المسار الرئيسي | مؤشر الصفحة العام: `startLoading` عند الاشتراك و`endLoading` في `finalize` | `switchMap` و`denied$` للطلبات السابقة ومنع صفوف من سياق قديم؛ إعادة البحث عند الاسترداد | منفّذ مصدرّيًا؛ التحقق التشغيلي معلّق |
| فلتر الفرع `Branch/GetSelect` والموظف `Staff/GetSelect` | `ReferenceLookupStatus` مرتبط بمؤشر الصفحة العام وفق UI22؛ كاش الفرع وتحديثه المحتفظ ببياناته صامت | أخطاء اختيارية مع Retry، ولا يوقف فقد المنحة الأساسية | منفّذ مصدرّيًا؛ التحقق التشغيلي معلّق |
| إكسل `getAllList` متعدد الصفحات | مؤشر الصفحة حتى `finalize` وإلغاء عند سحب `View` أو تبدل السياق | يمنع تصدير الملف قبل انتهاء كل الصفحات، ويعرض الخطأ داخل القائمة | منفّذ مصدرّيًا؛ التحقق التشغيلي معلّق |
| تفاصيل `GetByWithNavigationsId` | مؤشر محلي للنافذة (`loadingData`) حتى `finalize`، وليس صفحة عامة مكررة | خطأ محلي وRetry للهوية الحالية، ولا طباعة دون نجاح التفاصيل | منفّذ مصدرّيًا؛ التحقق التشغيلي معلّق |
| الإنشاء: اختيارات `Branch/GetSelect` و`Vehicle/GetSelect` و`Staff/GetSelect` | `lookupsLoading` المحلي للنافذة، وتمنع الفشل جاهزية الإنشاء | خطأ محلي وRetry؛ `Staff` قراءة مباشرة؛ الفرع والمركبة كاش مشترك | منفّذ مصدرّيًا؛ التحقق التشغيلي معلّق |
| خيار الاتفاقية `RentalAgreement/GetSelect` | قراءة اختيارية محلية لا تحجز الإنشاء بلا اتفاقية | خطأ مستقل وRetry عند توفر `RentalAgreement.Lookup` | منفّذ مصدرّيًا؛ التحقق التشغيلي معلّق |
| `POST /CustodyMovement` | مؤشر الحفظ العام حتى `finalize` حتى بعد خروج المكوّن | معترض API العام وحده لنجاح/خطأ الكتابة، بحارس نشر نتيجة السياق | منفّذ مصدرّيًا؛ التحقق التشغيلي معلّق |
| منافذ `GetById` و`GetByWithNavigationsId` | واجهة خدمة واحدة للتفاصيل | `View` مع scope الفرع المحفوظ | منفّذ مصدرّيًا؛ التحقق التشغيلي معلّق |
| المنافذ غير المدعومة `GetAllWithNavigations` و`GetSelect` و`CheckUnique` و`Update` و`Remove` و`HandleActivate` | لا مستهلك UI حاليًا | `405` من الخدمة مع استبعاد المنح القابلة للإسناد في resolver | منفّذ مصدرّيًا؛ التحقق التشغيلي معلّق |

### تصنيف قراءات UI2 والكاش

| المصدر | التصنيف | أثر السحب/التحديث |
|---|---|---|
| `CustodyMovement.getList/getAllList/getDetails` | تشغيلية مباشرة، بلا caching | إلغاء القراءة وإزالة النتيجة عند انتهاء منحة `View` أو تبدل مالك السياق |
| `Branch/GetSelect` | مرجع مشترك `cacheSelect` وفق `BranchService` | إعادة التحقق من صلاحية `Branch.Lookup`؛ إعادة تحديث مع قيمة محفوظة صامتة |
| `Vehicle/GetSelect` | مرجع مشترك `cacheSelect` وفق `VehicleService` | نفس الضوابط مع `Vehicle.Lookup` وحفظ اختيار المستخدم الصريح |
| `RentalAgreement/GetSelect` | قراءة مرجعية مباشرة كما يستخدمها `RentalAgreementService` الحالي | اشتراط `RentalAgreement.Lookup` فقط عند استعمال الخيار، ولا ينسف الإنشاء دون اتفاقية |
| `Staff/GetSelect` من `StaffService` المشترك | قراءة مرجعية مباشرة حاليًا، لأن `StaffService` لا يفعّل `cacheSelect`؛ المصدر هو `StaffService.SelectAsync` في الخلفية | يلزم `Staff.Lookup`، والنموذج يفرغ الخيارات عند انتهاء الجلسة أو السياق، ويعيد قراءتها عند عودة المنحة دون إفساد المسودة |
| `CurrentBranch` | حالة اختيار الفرع التشغيلي المنفصلة عن الكاش | قيمة افتراضية للمحرر فقط؛ ليست إثباتًا لمنحة فرع التسجيل |

### بوابة الأداء والفهارس Master5

استعلام `CustodyMovementService.GetManyWithNavigationsAsync` يفلتر رقم الحركة واللوحة والفرع والموظف والاتفاقية والوقود والتاريخ ويطبّق `GridFilter` و`CountAsync` قبل `Skip/Take`. ترتيب البداية هو `MovementDate DESC` ثم `Id DESC`، والاستعلام يعرض أسماء من استعلامات فرعية مقيّدة بالاشتراك/نطاق فرع المصدر؛ الانتقال اللاحق للمركبة لا يغير نطاق حركة تاريخية. أضيفت في EF فهارس مركبة `(SubscriptionId, BranchId, MovementDate, Id)` و`(SubscriptionId, EmployeeId, MovementDate)` و`(SubscriptionId, VehicleId, MovementDate)` بدل فهرس موظف منفرد؛ كلفتها كتابة ومساحة إضافيتان، وقد لا تخدم ترتيب كل حالات GridFilter. يلزم فحص خطة SQL Server والقياسات قبل/بعد بواسطة المالك؛ **لم تُقَس السرعة** ولا أُنشئت هذه الفهارس في قاعدة البيانات دون هجرة.

### طلبات الوكلاء والحدود

- وكيل الخلفية `worker-1`: عدّل الخدمة والخادم والكيان وEF والـVM والـmapper وresolver، وأضاف مواصفات مصدرية؛ حسم رقم الحركة المولّد من الخادم بدل قبول رقم طلب. لم يغير `Repository` أو `NameIdentifier`، ولم يطلب تشغيلًا محظورًا.
- وكيل القائمة `worker-2`: عدّل القائمة وقالبها والمسارات وسياسة المداخل، وأضاف عقد وصول ومواصفات source-only؛ راجع فلتر الموظف والاسم والتصدير والقراءات والإلغاء. لم يطلب تشغيلًا محظورًا.
- الوكيل الأساسي: عدّل تفاصيل الواجهة والنماذج والخدمة والدليل والترجمات والوثائق، وأضاف اعتماديات إنشاء العهدة إلى `PermissionPrerequisites` مع منحة الاتفاقية المشروطة. مراجعة `git diff --check` المنفصلة لكل مستودع لا تعادل قبول البناء أو التشغيل.

- تمت قراءة القواعد الحية لـSigma ومهارة الشاشة وREADME/INDEX والكتل UI26/UI2/UI22/UI28 وbackend13، ومرجع Speed دليلًا وشرح شاشة ثم كودًا مؤرخًا؛ فحص حزم الوصفات نجح 8/8 قبل اعتماد المرجع.
- تحتاج مراجعة مصدرية نهائية للواجهة والخادم وفروق الملفات ومطابقة مفاتيح المنح والمداخل والـDTO والفرع والإخراج، ثم تحديث جدول الجرد ونقطة الاستكمال بعد اكتمال العمل.
- القبول التشغيلي ما زال مطلوبًا من المالك: قراءة مستخدم بفرع مسموح/محجوب، مستخدم إنشاء فقط، اشتراك مختلف، فرع بلا ترخيص تسجيل، مركبة/اتفاقية غير مسموحتين، سحب وإعادة منح أثناء القائمة والنافذة والتصدير، ونتيجة حفظ بعد تغيير الجلسة، والطباعة المؤجلة، واختبار المخطط عند تنفيذ هجرة المالك.
- لم يُنفّذ بناء أو اختبارات أو typecheck أو lint أو متصفح أو طلب قاعدة بيانات أو هجرة أو commit ضمن الحد الحالي.
