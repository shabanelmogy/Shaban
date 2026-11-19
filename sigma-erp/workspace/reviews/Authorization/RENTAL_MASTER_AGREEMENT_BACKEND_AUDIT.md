# تدقيق مستقل لخلفية الاتفاقية الرئيسية للإيجار

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| الحالة | لا توجد ملاحظة مؤكدة متبقية بعد إغلاق التصحيحات المصدرية |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | مراجعة قراءة فقط لخدمة/خرائط/DTO/متحكم/تصنيف الصلاحيات وحد ربط `RentalAgreement` |

## النتيجة

راجعت آخر مصدر مقابل العقد المجمّد، ولا توجد ملاحظة مؤكدة متبقية في هذا
النطاق بعد إغلاق مالك الخلفية لملاحظة هوية العرض المحجوب.

- تصنيف `ApproveAsync` صحيح دون metadata محلية إضافية: يحتوي
  `DocumentApprovalEndpointRules.NativeSources` على `RentalMasterAgreement`
  وتحول `Action()` العملية `Approve` إلى `ManageApproval`. يستهلك resolver
  هذا التصنيف قبل generic/reviewed، ثم يفرض الفلتر `RentalMasterAgreement.View`
  بجانب `ManageApproval`.
- يبقى رأس الماستر التجاري مشتركًا على مستوى الشركة وفق القرار المجمّد
  والنظير Lease: الرقم والتواريخ والحالة والملاحظات والعميل لا تتحول إلى
  مالك فرع جديد. لا تسجيل جديد في `BranchScopeRegistry`؛ العرض المحفوظ هو
  مالك الفرع، وبنوده تتبعه، ومركبة عقد الإيجار تحرس العقد التنفيذي.
- أُغلق تسريب FK الدقيق الذي وجدته أثناء التدقيق: كانت قراءات الماستر قد
  تنشر `QuotationId` الخام رغم حجب `Quotation`/`QuotationNo`. أصبحت قراءة
  `GetView` تصفر `QuotationId` عند فشل قراءة العرض المقيدة، وأصبح إسقاط
  التفاصيل العامة يأخذ المعرف من navigation المقيدة لا من FK الخام. أضيفت
  مواصفات للمصدر الأجنبي والمحذوف وفرع العرض غير المقروء.
- فحص حذف الماستر يستخدم `IgnoreQueryFilters` لوجود بنيوي boolean فقط، ثم
  يقيد صراحةً بـ`SubscriptionId` الحالي و`IsDeleted != true` و
  `RentalMasterAgreementId`. لذلك يرى كل تابع حي داخل الشركة ولو كان عقده
  محجوبًا بفرع المركبة، ولا ينشر بيانات ذلك التابع.
- شرط ربط `RentalAgreement` يمر في الإنشاء والتحديث الفردي، كما تمر عليه
  حلقات `AddListAsync` و`UpdateListAsync`: الاستعلام tenant/live من repository،
  ويشترط `IsActive` و`ApprovalStatus.Approved` وتطابق العميل. فلتر HTTP يطلب
  `RentalMasterAgreement.View` عندما يحمل payload الفردي أو enumerable
  المطبوع أي `RentalMasterAgreementId`، ويترك الكتابات غير المرتبطة كما هي.
- إنشاء/تعديل/اعتماد الماستر يقرأ العرض من `RentalQuotation` المقيد بالفرع؛
  وضع القراءة/التسجيل يأتي من `BranchAccessContext` وتصنيف العملية. الأسماء
  والبنود تستخدم استعلامات repository المقيدة، ولا يوجد `IgnoreQueryFilters`
  يعيد عرض المصدر أو حركة فرع محجوبة.
- DTOs للقائمة والتفاصيل lean، والخرائط أحادية الاتجاه، والـnamespaces
  والمراجع المطلوبة موجودة. `GetView` يخرج aggregate محدودًا ولا يعيد
  tenant/audit metadata أو graph العقود التابعة.

## حدود التحقق

راجعت الفروق المحددة والمصدر الفعلي لقواعد الموافقات ونطاق الفرع، وفحص
`git diff --check` للملفات المحددة بلا أخطاء whitespace (مع تحذير line-ending
لملف `RentalAgreementService.cs`). لم أشغّل build أو tests أو قاعدة بيانات
أو HTTP أو migrations. لذلك تبقى ترجمة AutoMapper/EF للاستعلامات، سلوك
InMemory مقابل relational، الأقفال serializable، وكتالوج الصلاحيات الفعلي
قبولًا تشغيليًا للمالك.

