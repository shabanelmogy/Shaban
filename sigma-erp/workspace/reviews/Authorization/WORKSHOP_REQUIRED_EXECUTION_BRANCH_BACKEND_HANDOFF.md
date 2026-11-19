# تسليم خلفية إلزام فرع تنفيذ الورشة

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ٩ نوفمبر ٢٠٢٦ |
| العقد | WORKSHOP_REQUIRED_EXECUTION_BRANCH_CONTRACT_FREEZE.md |
| النطاق | الأنواع WorkshopMovement وJob وLubricationJob ومنتجوها ومخرجات فرع التنفيذ وحراسة SaveChanges |

## النتيجة المصدرية

أصبحت ملكية الفرع على الكيانات الثلاثة عددًا صحيحًا مطلوبًا. علاقات EF مطلوبة
مع Restrict، وتبقى فهارس الشركة/فرع التنفيذ/تاريخ العملية الحالية. لا fallback
ولا default أو backfill لحفظ سجلات التجربة. بقيت خصائص التسمية قابلة للفراغ؛
لم تُبدل إسقاطات المراجع أو تتغير علاقة المركبة أو قواعد المال.

تستدعي PrepareBranchAccessWritesAsync الحارس الجديد لكل نوع قبل الخروج عند
تعطيل فرض نطاق الفروع. يرفض الفرع غير الموجب في الإضافة/التعديل/الحذف،
ويقرأ الأصل المادي دفعة واحدة لكل نوع متغير، ويرفض اختلاف الفرع عن الأصل،
ثم يثبت OriginalValue على القيمة المادية لحفظ شرط concurrency الموجود.
ينطبق ذلك على المدير والعادي وغير HTTP والتحديث detached. حراسة الشركة
والمنح والفروع والمراجع الحالية تستمر في مسارها بعد هذا invariant.

## ملفات التطبيق المعدلة

تتبع الملفات المستودع:
`F:/My Work/Sigma/SigmaBackend`.

- الكيانات: SiGma.Helpers/Models/Movements/WorkshopMovement.cs؛
  SiGma.Helpers/Models/Workshops/Jobs/Job.cs؛
  SiGma.Helpers/Models/Workshops/Jobs/LubricationJob.cs.
- الإعدادات: SiGma.DataAccess/Configuration/WorkshopMovementConfig.cs؛
  JobConfig.cs؛ LubricationJobConfig.cs.
- الحراسة: SiGma.DataAccess/SiGmaDbContext.BranchAccess.cs؛ إضافة invariant
  مستقل للورشة وإزالة تكرار قيد الثبات القديم الذي كان يخص WorkshopMovement
  داخل نطاق HTTP فقط. بقي حارس الحوادث كما هو.
- المخرجات: SiGma.ViewModels/ViewModels/WorkshopMovement/WorkshopMovementDetailVM.cs؛
  WorkshopMovementListVM.cs؛ WorkshopMovementFullListVm.cs؛
  SiGma.ViewModels/ViewModels/Job/JobDetailVm.cs؛ Job/Dtos/JobGridRowDto.cs؛
  SiGma.ViewModels/ViewModels/LubricationJob/LubricationJobDetailVm.cs؛
  SiGma.ViewModels/ViewModels/ServiceLog/ServiceLogListVM.cs؛
  SiGma.Business/Model/ServiceLog/ServiceLogProjection.cs.
- المنتجون: SiGma.Business/Services/JobService.cs؛ JobEstimationService.cs؛
  LubricationJobService.cs. أُسندت القيمة المثبتة بعد التحقق بدل nullable.
- المواصفات: tests/SiGma.BranchAccess.Tests/BranchDataScopeTests.cs.

## مطابقة المنتجين والمستهلكين

| المسار | الدليل والمطابقة |
|---|---|
| إضافة حركة الورشة المباشرة | WorkshopMovementAddVM يحمل int مع Range، والخدمة تتحقق من فرع نشط قبل الخريطة؛ لا تعديل لازم للمنتج |
| إضافة سجل الخدمة | ServiceLogService.AddAsync يتحقق من request.BranchId الموجب والفرع النشط؛ يسند int إلى WorkshopMovement |
| إتمام خدمة من التنبيهات | FleetAlertsService.CompleteVehicleServiceAsync يتحقق من الفرع النشط قبل إنشاء WorkshopMovement |
| إضافة شغل | JobAddVM.BranchId يبقى nullable عند الحد لأن WorkOrderId يمكن أن يعطي فرع الأمر؛ JobService يتحقق من القيمة قبل إسناد branchId.Value |
| تحويل التقدير | معامل CreateJobAsync يبقى nullable عند الحد؛ إعادة نتيجة التحويل القائمة تحت العقد السابق، والإنشاء يتحقق من الفرع النشط ثم يسند branchId.Value |
| إضافة التشحيم | LubricationJobAddVM يبقى حقل طلب nullable مع Required وRange للكشف عن الإدخال المفقود؛ الخدمة تتحقق منه ومن الفرع النشط ثم تسند Value إلى الكيان المطلوب |
| التعديل | نماذج Update الثلاثة لا تعرض BranchId؛ خرائطها/التحديث الصريح يحافظان عليه، والحارس يغطي writers المباشرين أيضًا |
| الشبكة المختلطة | JobService يسقط فرع Job أو LubricationJob إلى JobGridRowDto.BranchId المطلوب؛ الفلاتر الاختيارية تبقى «كل الفروع المسموحة» |
| سجل الخدمة | الإسقاط الداخلي والقائمة أصبحا int، وجميع تعييناتهما من فرع WorkshopMovement المثبت |
| تقرير العمالة | LabourActivitiesReportService يتبع visibleJobIds من الشغل المحكوم بفرع التنفيذ؛ لا تغيير للمعادلات أو مخرجات التقرير |
| تقرير الخدمة اليومية | DailyServiceLogReportService يقرأ Job تحت QueryReport الحالي؛ لا nullable branch member أو تحويل يحتاج تعديلًا |
| الخرائط | WorkshopMovementProfiler وJobProfiler وLubricationJobProfiler مفحوصة؛ مطابقة BranchId بالاسم تكفي، ولا يحتاج تحويل النوع Ignore أو خريطة منافسة. لم تعدل الخرائط |
| فلتر الفرع/concurrency | BranchScopeRegistry يدعم int وint? بالفعل، ويثبت concurrency على branch property للأنواع الثلاثة؛ لا تغيير فيه |

## مواصفات المصدر

أضيفت ثماني نظريات تمثل ٣٩ حالة غير منفذة، وتغطي:

- رفض الفرع الافتراضي المفقود/الصفر والسالب لغير HTTP.
- رفض الصفر للعادي والمدير.
- ثبات الفرع بين فرعين مسموحين للعادي والمدير.
- منع detached updates من تقديم فرع أصلي جديد للعادي والمدير وغير HTTP.
- قبول فرع موجب صريح لغير HTTP دون تخمين default.
- تثبيت OriginalValue من الأصل المادي حتى عند تقديم أصل عميل مختلف.
- قبول فرع التسجيل ورفض فرع الاستعراض فقط عند الإنشاء.

أُزيلت مواصفة المدير الذي يرى حركة بلا فرع والصف التجريبي ذي BranchId=null
من fixture الورشة فقط. بقيت fixtures المركبة ذات الفرع الاختياري دون تعديل؛
تلك علاقة أخرى. فُحصت instances الأنواع الثلاثة ذات الصلة في
BranchDataScopeTests وFleetAlertsHistoryScopeTests؛ كل سجل عادي يملك فرعًا
صحيحًا، والصفر/السالب محصوران في حالات الرفض المقصودة.

## المطابقة والتحقق

قُرئ العقد الحالي ومراجع العقود السابقة، ومهارة Sigma وكتل BE1/2/3/4
والمالكون الفعليون. هذه صيانة Tier S لقرار سابق؛ لا مفهوم أعمال جديد أو
دليل Speed/Odoo جديد أو تعديل screen shape. الواجهة ودليل التطبيق
والمطابقة النهائية في ملكية الجذر.

تمت مراجعة الفروق المحددة في المستودع الفعلي، وفحص الأنواع والإسنادات
والـnamespaces وإدراج المصدر في المشاريع SDK الحالية. فحص diff --check
نظيف؛ تحذير LF/CRLF في JobEstimationService فقط لا يثبت مشكلة مصدرية.
لم تُشغل المواصفات ولا build/tests/lint/browser/DB؛ لا ادعاء RED/GREEN
ولا نجاح runtime. لم تتغير migrations أو snapshots أو ملفات الحوادث أو
العلاقات والآثار المالية أو أي بيانات.

لا فهرس جديد مبرر لهذه الشريحة؛ الفهارس الحالية تغطي الشركة والفرع والتاريخ.
الحراسة تضيف قراءة أصل دفعية للأنواع المعدلة فقط، بلا استعلام لكل صف.
فحص SQL-plan/IO/الزمن وحدود concurrency الفعلية يظل عند المالك؛ لا أرقام
أداء مقاسة في هذا workflow.

## المتبقي عند الدمج والمالك

- يطابق الجذر مخرجات number المطلوبة في الواجهة ويحدث الدليل والعقود.
- يحتاج المخطط هجرة المالك المعزولة المقترحة RequireWorkshopExecutionBranches،
  أو دمج الإلزام في هجرات إضافة الفرع إن لم تُجهز بعد. لا default أو backfill
  مخمن؛ البداية النظيفة وترتيب بيانات التجربة عند المالك.
- بعد تجهيز المخطط يختبر المالك إنشاء الأنواع الثلاثة بفرع تسجيل، ورفض
  missing/zero والتغيير بعد الحفظ والمدير وnonHTTP وdetached، وقراءة
  المستند/الشبكة/التقارير بعد انتقال المركبة.
- رسالة commit مقترحة لمستودع الخلفية فقط:
  `Require immutable workshop execution branches for all writers`.

لم تُستخدم عوامل إضافية؛ عمل الخلفية محدود ومترابط، والجذر يملك التكامل.
