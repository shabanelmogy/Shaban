# عقد صلاحيات عروض الإيجار وتوابعها

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | 2026-11-10 |
| النطاق | RentalQuotation: القائمة والمحرر والرفض وإنشاء الاتفاقية من العرض |

## التفويض والحدود

استكمال هدف الصلاحيات المعتمد، وتوجيه المالك «كمل بدون أسئلة واختار الأنسب».
البيانات تجريبية؛ لا توافق لحفظ أخطاء بيانات قديمة. التنفيذ مصدري فقط؛ لا
build/tests/typecheck/lint/browser/DB/migrations/snapshots/commit/push/deploy.
لا إعادة للوحدات المقفلة ولا اعتماد عام لوحدة RentalMasterAgreement.

## المراجع والأنماط

الشكل02 قائمة ومحرر موجّه مع مجموع وإجراءات اعتماد؛ الخلفية pattern2 دون أثر
مالي جديد. المرجع المعتمد Workshop/Job list/editor والمكونات المشتركة، مع
المحرر الحالي كمتغير المجموعة الواحدة المشار إليه في كتالوج02. تتبع مهارة
Sigma وMaster1/2/4/5/7 وUI2/7/13/14/15/18/21/22/26/27/28/29، وBE3–9/14.
فحص الحزم الثماني سليم قبل التجميد. قواعد الصلاحيات الحالية من عقد self-access
ومالكي CurrentAccess/AccessViewPolicy/route registry، لا API أو مخزن منح جديد.

قُرئ شرح Speed27 فصل6 (عرض تأجير، لا شرح خاص جديد للإيجار)، ثم كخطوة منفصلة
Speed28 workflow01 وجزء Rental/screens/03-quotations وC0958 (القائمة وشروط
إنشاء الماستر)، C0957 (الحساب والحفظ)، C0949 (إنشاء الماستر). مصادر UI ساكنة
وليست إثبات حماية الخادم أو حساباته. قُرئ مدخل Odoo19 المحلي بعد Speed؛ لا
فجوة مفاهيمية تستلزم توثيقًا إضافيًا لحسم grants الحالية. لا صور جديدة بالنطاق.

| التفصيل المرجعي | سيجما الحالية | القرار |
|---|---|---|
| قائمة وعرض/تعديل/طباعة وتصدير | موجودة، حماية العميل ناقصة | تبني كل مسار وcallback وتصدير كامل بالمرشحات المطبقة |
| اعتماد داخلي واعتماد عميل منفصلان ورفض بسبب | ستة endpoints وحالات صريحة | الحفاظ على انتقالات الخادم ومجموعتي منح الاعتماد القائمتين |
| إنشاء الماستر بعد الموافقتين ودون سابقة | حوار وخدمة موجودان | ربط القراءة بالعرض والكتابة بإنشاء الماستر وفحص branch/tenant بالخادم |
| التعريفة/تفصيل الرسوم/أمر البيع/الدفع الإلكتروني المرجعية | ليست دورة مثبتة في شاشة سيجما الحالية | فجوات وظيفية مستقلة؛ لا endpoints أو مالية مخترعة ضمن تبني الصلاحيات |

## عقد المنح والطلبات

مالك ثابت جديد rental-quotation-access.ts يستهلكه registry والقائمة والمحرر
والحوارات. المتطلبات مجموعات allOf؛ لا استنتاج من عنوان أو role display name.

| المسار أو الفعل | المتطلب |
|---|---|
| القائمة/العرض/الطباعة/التصدير | RentalQuotation.View |
| الإنشاء | RentalQuotation.Create + CarModel.Lookup + VehicleType.Lookup + Branch.Lookup + Staff.Lookup + Customer.Lookup + SettingsCommonModel.GetMySetting |
| التعديل | RentalQuotation.View + RentalQuotation.Update + مصادر الإنشاء عدا Create |
| الحذف | RentalQuotation.View + RentalQuotation.Delete |
| الاعتماد/الرفض الداخلي والمراجعة وإلغاء الاعتماد | RentalQuotation.View + RentalQuotation.ManageApproval (DocumentApprovalEndpointRules الحالي) |
| موافقة/رفض العميل | RentalQuotation.View + RentalQuotation.ManageCustomerApproval |
| إنشاء الماستر | RentalQuotation.View + RentalMasterAgreement.Create |
| جهات اتصال العميل | Contact.GetSelectByCompany، اختياري؛ غيابه لا يمنع الحفظ دون contact |
| مرشحات العميل/الفرع | Customer.Lookup وBranch.Lookup اختيارية |

الإنشاء مستقل عن View. View يقرأ DTO labels ولا يطلب مصادر الكتابة أو tax
settings. TaxSettings.load({requireSuccess:true}) للكتابة وتحت مالك page loader؛
لا default fallback لطلب محظور. Customer/Branch cache مالكاهما الحاليان مع finite
bootstrap ثم watch وselected-label preservation وإلغاء السياق. بقية GetSelect
والتفاصيل/contact قراءات مباشرة وفق المصدر دون cache مخترع.

القائمة: أعمدة no/date/customerName/customerCode/amount/internalApproval/
customerApproval تظل مطابقة ListVM، وحقول أهلية الأفعال وid فقط معها. لا
subscription/audit JSON. DTO التفاصيل والبنود يقتصر على الاستهلاك؛ أي تقليص
يُصلح إسقاط GetView الحالي للماستر أيضًا دون توسيع الشاشة. يملك الخادم الحسابات
ولا تغيير لصيغ الخصم/الضريبة/التسعير في هذه الشريحة.

## عمر السياق والمستند

سحب الوصول يحجب/inerts المحتوى ويحتفظ بالمحرر والمسودة والكتابة المرسلة.
تغيير actor/dataContext أو id ينهي جلسة المستند حتى A→B→A؛ لا نشر قديم.
إعادة نفس المنح تعيد القراءات/اللوكات اللازمة مرة بعد busy tail دون مسح dirty.
كل read له denied$/destroy/version guard؛ watch مستقل. كل callback يعيد فحص
المنحة وحالة المستند وعضوية exact row object، والتأكيد lazy/cancellable ويُعاد
الفحص بعده. EditableRows/MockData/print/focus والبوابات مرتبطة بالسياق.
القرار المتقادم يُلغى ويظل local discard ممكنًا. لا takeUntilDestroyed أو denied
على sent mutations؛ outcome fencing عبر CAN_PRESENT_API_OUTCOME وlocal guard.
نجاح save يثبت committed/pristine قبل publication guard لمنع التكرار.

حوار الرفض: مسودة السبب تبقى عند denial، مع quotationId/type/session inputs
ثابتة، ومنع إرسال أي حدث متقادم. حوار الماستر يقرأ العرض فقط، لا lookups غير
مستهلكة، ويحفظ مرة واحدة؛ read محلي، save عند مالك التحميل القائم.

## الخادم والفروع

الـresolver الحالي يحول الأفعال الستة فعليًا إلى ManageApproval أو
ManageCustomerApproval؛ لا ست منح بديلة. الخادم يضيف View prerequisite
لـUpdate/Delete/approval، ويضيف View للعرض عند إنشاء ماستر منه. Activate غير
مستخدم في الدورة المعتمدة؛ يعاد405 ويُستبعد من الإسناد. child mutations لا
تتجاوز aggregate؛ حراسة tenant/live للمراجع والأطفال في القراءة/الحفظ، وعدم
كشف أسماء/وجود بيانات من شركة أخرى عبر projection/filter/sort. يبقى قفل
الحالة/duplicate serializable القائم ولا تغيير accounting. BranchScopeRegistry
يحدد RentalQuotation.BranchId والأطفال عبر الأصل؛ لا مصدر نطاق ثانٍ.

## التحميل والأداء والقبول

initial/filter required lookups/list/detail/export تحت مالك الصفحة، dialog read
محلي، reference retained refresh صامت. retain busy/error/Retry؛ لا ادعاء ظهور
الـloader فعليًا. Count+page projection موجود؛ لا per-row enrichment جديد.
تُراجع filter/sort/live predicates وindex coverage المحدد، ولا index أو schema
يضاف دون دليل خطة. القياسات cold/warm ونفس tenant/filter/volume وSQL plan
وقبول A→B→A/regrant/late success/upload/keyboard/RTL عند المالك بالنهاية.

## الملكية وخطة التنفيذ

| المالك | الملفات |
|---|---|
| الجذر | access constants، القائمة، rentalquotation.service.ts، masteragreement.service.ts context فقط، registry ومواصفاته، guide والجرد والمطابقة |
| عامل المحرر | RentalQuotation/components/details فقط ومواصفاته |
| عامل الحوارات | RentalQuotation/components/{rejection-dialog,master-agreement-dialog} فقط ومواصفاتها |
| عامل الخلفية | RentalQuotation service/controller/DTO/profiles وchild endpoints، master service المستهلك مباشرة، authorization prerequisites/resolver، مواصفات الخلفية وتسليمها |

تقرأ كل ملكية shared owners والكتل الخاصة بها؛ لا تعديل متداخل أو حذف تغيير
زميل، وتُبلغ conflicts للجذر. يلزم source specifications ثم parsing/import/XML
ومراجعة scoped diff والتدقيق المستقل وإغلاق findings والدليل الثنائي قبل ترقية
الجرد. لا تشغيل runner ولا ادعاء RED/GREEN. تتبع handoffs بهذا المجلد.
