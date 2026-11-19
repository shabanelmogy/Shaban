# تسليم تبني صلاحيات المركبات — الخلفية

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ٩ نوفمبر ٢٠٢٦ |
| العقد | VEHICLE_ACCESS_CONTRACT_FREEZE.md مع ملحق الاستبدال والاستيراد |
| الملكية | خلفية المركبة والطفلين وتصنيف القراءة/النشاط ومنتج استيراد المركبات فقط؛ Media/Program/FileStore/helpers والواجهة والتوثيق في ملكية الجذر |

## القرارات والتكامل

أصبح VehicleService مالك كتابة التجميع الصريح. الحفظ يراجع الشركة والمراجع
والفرع والتكرارات وملكية معرفات الأطفال ووجود الرفع الخاص ورافعه وعدم
استخدام مسار حي قبل التغيير. يحتفظ child المحفوظ بمسار ملفه؛ عند استبداله
ينسخ الخادم بيانات المستند إلى صف جديد ويحذف القديم نرمًا، ويبقى مساره
وshadow VehicleId تاريخيًا للتنظيف. حذف المركبة يحذف الوثائق والضمانات نرمًا
عبر RemoveWithChildrenAsync. تبقى إزالة/استبدال بيانات المستند تحت Update؛
Media.DeleteMedia تخص الحذف الفعلي للملف وفق توضيح الجذر، ولا شرط مخترع لحفظ
بيانات التجميع. لم تُعدل طبقة Media.

جميع كتابات خدمة Vehicle المشاركة (Add/Update/Remove/HandleActive) تأخذ قفل
CustomerDocument/tenant ثم Vehicle/tenant داخل Serializable عبر المالك القائم.
استيراد المركبات يستخدم الترتيب نفسه لكل chunk، ويعيد فحص هويات الشركة
والفرع والموديل داخل القفل قبل الحفظ. إضافة دفعات/تحديث دفعات Vehicle الخام
مرفوضان صراحةً؛ الاستيراد المنتج المثبت له مساره المحكوم.

خدمات CustomerDocument وWarranty الحالية تبنت CustomerDocument lock عندما
يثبت Vehicle owner أو private VehicleDocuments path، دون خدمة موازية.
تحديث metadata لطفل المركبة يحمل الصف tracked فيحفظ shadow owner. استبدال
المسار عبر endpoint الطفل يوجّه إلى محرر المركبة؛ generic Delete يبقي الرابط
التاريخي. raw bulk للطفلين بلا منتج مثبت رُفض صراحة؛ جرد الخدمات/المتحكمات
المحدود لم يثبت مستهلك خدمة داخليًا إضافيًا لهذين bulk paths. بقية عمليات
الآباء المشتركة تبقى تحت المالك السابق.

## نطاق الطفل وملكية الفرع

أضيفت فلاتر CustomerDocument وWarranty عند وجود shadow VehicleId فقط؛ يقرأ
الطفل من مركبة حية مسموحة في الشركة. لا يمنع null على VehicleId مستندات
Partner/Equipment وبقية الآباء؛ تلك ليست ملكية مركبة. لا عمود جديد.

يحمل shadow VehicleId شرط concurrency. يفحص SaveChanges الأصل المادي
والقيمة الحالية، ويمنع فك/إعادة إسناد Vehicle owner وتغيير المسار التاريخي.
يرفض private VehicleDocuments path بلا Vehicle owner أو مع أي FK لأب آخر.
يحرس الأصل والجديد والشركة/فرع التسجيل تحت HTTP، ويحافظ على invariant
الارتباط والمسار لغير HTTP أيضًا قبل خروج !BranchScopeEnforced.

تبقى Vehicle.BranchId اختيارية حسب العقد. ينفذ الحارس الحالي انتقال الفرع
بالتسجيل على الأصل والوجهة والتحويل من المصدر؛ لم تتغير قاعدة النقل أو
ملكية العقود المرتبطة ولا حقول مالية أو منحة غير موجودة.

## القراءات والمنح

- أصبحت Vehicle.Search/GetAgreementHistory/GetStatusDetail و
  Tariff.GetTariffByVehicleTypeId وMedia.ReadVehicleDocument قراءات
  WholeDocument صريحة؛ لا تتطلب تسجيلًا لقراءة فرع الاستعراض ولا ReportEffects.
- أُضيف BranchId nullable إلى VehicleListVM كحالة إجراء دون أعمدة تدقيق.
- GetMany/GetManyWithNavigations/GetAllWithNavigations تستهلك Search نفسه،
  وتستهلك Detail/DetailWithNavigations إسقاط تجميع محدودًا بدل deep traversal
  العام؛ المراجع والأطفال عبر queries ذات الفلاتر الفعلية.
- تاريخ العقود ما زال يستهلك AgreementHistory بعد إثبات جذر المركبة المسموح؛
  يمنحه المفتاح المستقل ولا يمنح فتح العقد. لم يُغير المالك المشترك أو
  قواعد Rental/Lease أو مخرجاتها.
- تقرأ الحالة هوية أحدث WorkshopMovement فقط بدليل ضيق الشركة/المركبة/live
  ثم تحمل payload بالفلتر؛ إذا حُجب الأحدث تبقى التفاصيل غير متاحة، ولا
  تستبدله بحركة أقدم.
- الوقود يتبع هوية أحدث مصدر بين WorkshopMovement وCollectionMovement و
  DeliveryMovement. قراءات الهوية/التاريخ unfiltered منفصلة ماديًا قبل
  تركيب payload المحكوم، فلا تنتشر IgnoreQueryFilters إلى إخراج القائمة.
  عدم إتاحة الأحدث يُظهر null للوقود؛ لا عودة إلى الأقدم. ربط ترتيب متساوي
  التاريخ حتمي حسب المصدر ثم Id دون تغيير قيم حركة أو حساب مالي.
- PermissionAuthorizationFilter يطلب Vehicle.Activate عند تغيير القيمة
  الموجودة لـIsActive، إضافة إلى Vehicle.Update. إرسال القيمة نفسها لا
  يطلب منحة إضافية؛ omission لا يحولها إلى null، وتتعقب VM حضور المدخل.

## الملفات المعدلة

كل المصادر التطبيقية تحت `F:/My Work/Sigma/SigmaBackend`:

- SiGma.Business/Services/VehicleService.cs.
- SiGma.Business/MapperConfig/VehicleProfiler.cs: خرائط write تستثني Documents
  وWarranties لأن reconciliation المصرح يملكهما؛ بقية الخرائط دون تغيير.
- SiGma.ViewModels/ViewModels/Vehicle/VehicleListVM.cs وVehicleUpdateVM.cs.
- SiGma.Business/Model/VehicleFuelEvidence.cs وVehicleFuelSnapshot.cs: كل نوع
  في ملف مستقل بدل helper class داخل الخدمة.
- SiGma.DataAccess/Authorization/BranchScopeRegistry.cs و
  SiGma.DataAccess/SiGmaDbContext.BranchAccess.cs.
- SiGma.ServerAPI/Authorization/BranchOperationRules.cs و
  PermissionAuthorizationFilter.cs.
- SiGma.Business/Services/CustomerDocumentService.cs وWarrantyService.cs.
- SiGma.Business/Services/AdministrationsServices/ImportDataService.cs:
  ImportVehiclesDataAsync وحده؛ لم تتغير بقية المستوردين أو core import.
- tests/SiGma.BranchAccess.Tests/VehicleAccessTests.cs وTestVehicleDocumentStorage.cs
  وBranchOperationRulesTests.cs.

## دليل المصدر والمواصفات

العقد المجمد يملك مراجع Speed S038/S055/S091/S096 وC1173/C1163 وسياق Odoo
المكمل. تنفيذ الخلفية يستهلك تلك القرارات، ولم يجمع بيانات مرجعية أو يفتح
تصفحًا جديدًا. قُرئت قواعد Sigma والمهارة وكتل BE1/2/3/4 والمالكون الحقيقيون
والعقد وملحقاته. استُخدمت قواعد المواصفات والتحقق من Superpowers بحدود
source-only؛ لا ادعاء دورة RED/GREEN غير منفذة.

أضيفت ١٩ Fact و٦ InlineData (٢٥ حالة) في VehicleAccessTests، وخمس حالات
تصنيف قراءة في BranchOperationRulesTests. إجمالي هذه الإضافة ٣٠ حالة مصدرية
غير منفذة، تغطي:

- عدم قراءة أطفال المركبة المخفية عبر مصدر عام.
- منع unlink/detached takeover وتغيير مسار child التاريخي وprivate orphan.
- duplicate hidden-company في الإضافة والاستيراد؛ ومنع raw bulk.
- فرع الاستيراد بلا تسجيل، مع تأكيد أن فشله persistence لا mapping.
- missing upload/other uploader/live reattach ورفع صحيح.
- replacement يحفظ metadata في صف جديد وsoftdelete التاريخي بمالكه.
- generic metadata/delete يحافظان على shadow VehicleId.
- إزالة المركبة وأطفالها نرمًا، وTransfer مع/بلا منحة المصدر.
- عدم عرض وقود/حركة قديمين عند حجب latest evidence.
- فصل Activate عن Update عند تغير القيمة فقط.
- WholeDocument classification لقراءات المركبة/التعريفة/الملف.

تمت مراجعة scoped diff في المستودع الحقيقي، والـnamespaces/references
ووجود storage interface/helper عند الجذر، وأسماء shadow FK من المصدر
والـsnapshot قراءة فقط. diff --check نظيف؛ تحذير نهايات أسطر في ImportDataService
فقط. فحص الملفات الجديدة لا يجد merge markers أو trailing whitespace.
لم تُنفذ build/tests/lint/DB/browser أو schema/migration/snapshot أو commit.

## المخطط والأداء والقبول المتبقي

لا schema جديد لshadow VehicleId؛ إضافة concurrency metadata تستخدم العمود
الموجود. لم تتغير EF configurations أو snapshots. تقترح قواعد الهوية الحالية
فقط فهارس فريدة على (SubscriptionId,PlateNo) و(SubscriptionId,FleetNo) و
(SubscriptionId,ChassisNo)، بتغطية live semantics التي تطابق IsDeleted!=true
والسلاسل المطلوبة. يلزم تحقق المالك من كفاية أطوال النصوص/index width
والترتيب والتكرارات وحالة deployed indexes قبل أي هجرة؛ لا فهرس مطبق أو
تخمين default/backfill في هذه الشريحة. اسم هجرة اقتراحي عند تقرير المخطط:
EnforceVehicleTenantIdentityUniqueness.

أضيفت قراءة هوية المركبات المرشحة وثلاث قراءات evidence latest دفعية للوقود؛
هذا يمنع stale payload ولا يثبت تحسن السرعة. يراجع المالك SQL translation/
plan/IO/candidate volume ومقارنة الزمن لنفس مرشحات/بيانات/حساب الاختبار،
خصوصًا unpaged/grid fuel؛ لا قياس سرعة أو سلوك SQL runtime مثبت هنا.

يملك الجذر دمج أنواع الواجهة ودليل التطبيق وMedia/الملف والتصنيف والجرد.
يبقى عند المالك قبول compilation/SQL/InMemory specs وسباقات attach/delete/
duplicate/import وقراءة/تنظيف الملف بعد replacement، وسيناريوهات ordinary/
admin/فروع العرض والتسجيل/التحويل. لا يدعي هذا التسليم انتهاء وحدة الواجهة
أو خصوصية سائر Media folders أو اكتمال gaps المنتج المسجلة في العقد.

رسالة commit مقترحة للخلفية فقط:
`Enforce vehicle aggregate and private document access ownership`.

لم يُستخدم عامل إضافي؛ المصدر مترابط والجذر يملك الفصل والتكامل والتدقيق المستقل.
