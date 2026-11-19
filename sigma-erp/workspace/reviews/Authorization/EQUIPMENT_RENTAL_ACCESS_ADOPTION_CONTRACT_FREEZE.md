# عقد تبني الوصول لسندات التسليم وفواتير الإيجار وكشوف التشغيل

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | ٢٠٢٦-١١-٠٧ |
| التفويض | هدف المالك تفعيل الصلاحيات في كل الشاشات والأحداث؛ استكمال العقد الذاتي الحالي |
| الحدود | مصدر فقط؛ لا build/tests/lint/browser/DB/migrations/snapshots/commit/push/deploy |

## المفاتيح المثبتة من المصدر

| المستهلك | الطلب والمفتاح الفعلي |
|---|---|
| قائمة التسليم وتصدير كل الصفحات | GET DeliveryNote → DeliveryNote.View |
| محرر التسليم | GET DeliveryNote/{id} → DeliveryNote.GetDetailById؛ القراءة المختصرة ليست generic View في resolver الحالي |
| إنشاء التسليم | DeliveryNote.Create + DeliveryNote.OperationalSources + Branch.Lookup |
| تعديل التسليم | DeliveryNote.GetDetailById + DeliveryNote.Update + DeliveryNote.OperationalSources + Branch.Lookup؛ عرض القائمة مستقل DeliveryNote.View |
| حذف المسودة | DeliveryNote.View + DeliveryNote.Delete مع canDelete والتأكيد |
| فلاتر التسليم | Customer.Lookup وBranch.Lookup اختياريان؛ ينظف الطلب والقيم عند السحب |
| فوترة التسليم | EquipmentRentalInvoice.Preview للمعاينة؛ Generate للإرسال؛ View للتاريخ والتفاصيل؛ Finance للمالية |
| اعتماد فاتورة الإيجار | EquipmentRentalInvoice.Finance + EquipmentRentalInvoice.ManageApproval؛ DocumentApprovalEndpointRules يسبق reviewed list |
| الإبطال والحذف | Finance + EquipmentRentalInvoice.Void أو Finance + EquipmentRentalInvoice.Delete، مع حراس الحالة |
| إنشاء إيصال من الفاتورة | EquipmentRentalInvoice.Finance + Receipt.Create؛ محرر Receipt يحرس تبعياته الفعلية؛ لا تدمير للمحرر عند السحب |
| روابط المالية | Receipt.View ومسارها المتبنى؛ اليومية تحتاج RouteAccessPolicyRegistry للوجهة أيضًا وتبقى مغلقة إن لم تتبن |
| كشف التشغيل | قائمة/تفصيل TimeSheet.View؛ إنشاء TimeSheet.Create؛ تعديل View+Update؛ حذف View+Delete |
| مصدر كشف التشغيل | DeliveryNote.Lookup وDeliveryNote.GetDetailById لتحرير الفردي والدفعي؛ View يعتمد DTO بلا قراءات تحرير |
| الحفظ الدفعي | TimeSheet.SaveBatch مع تبعيات المصدر فقط؛ ليس Create/Update ضمنيين |
| اعتماد كشف التشغيل | قراءة approval: TimeSheet.View؛ إرسال decision: View+ManageApproval من DocumentApprovalEndpointRules |
| المرفقات | مالك DocumentUploadTracker وFileField القائم؛ Upload+Delete للرفع وDelete للتنظيف، مع حفظ الكتابات المرسلة |

## عقد العمر والأحداث

المسارات والزر والـhandler متوافقة مع المتطلب الفعلي. كل finite read/watch/export
يُلغى فور السحب أو انتهاء السياق، مع بقاء outer triggers واستعادة القراءات
المفقودة مرة واحدة بعد regrant. revision غير متعلق لا يكرر operational GET.
تحديث reference cache يبقى عند مالكه الحالي. يحتفظ same-context revoke
بالسجل/المسودة/سبب الإبطال/لقطة المعاينة ويخفي السطح وbody portals؛ تغير
actor/token/tenant/working branch ينهي الجلسة نهائيًا ويمسح outputs القديمة.
كل تأكيد كسول ويلغى بالرفض أو السياق مع false؛ يعاد فحص المنحة والحالة والهوية
قبل الإرسال. الكتابات والتنظيف المرسلة مستقلة ولا تُلغى عند سحب الصلاحية، ولا
ينشر رد سياق قديم في السياق الجديد. discard محلي جديد بعد denial يظل متاحًا.

## الحدود الوظيفية والمراجع

الشكل قائمة مع محرر modal ومركبات مالية قائمة؛ لا تغيير حساب أو VAT أو مخطط
أو حالة مجال أو إضافة عملية غير موجودة. مصدر السياسة هو resolver وcontrollers
والخدمات الحقيقية. Speed screen03/04 من قسم11 بتاريخ٢٨أكتوبر دليل وظيفي؛
كوده C1468/C1467 وC1510/C1509 منفصل عن كتاب الشرح. Odoo مكمل عند غموض فقط.

## ملكية التنفيذ

الجذر: DeliveryNote list/details وroutes/shared route policy، backend metadata
والعقود والجرد والمصالحة والدليل. عامل الفواتير: DeliveryNote billing/invoices
وEquipmentRentalInvoice details/finance/entry وspecs الخاصة بها فقط. عامل
كشف التشغيل: TimeSheet list/details/batch وtemplates/specs فقط. لا overlap؛
لا عامل يعدل docs أو shared أو backend أو generated/migrations/snapshots.
المصالحة التنفيذية الحالية والجرد اللذان سبقا هذه المراجعة مسودة حتى يطابق
التنفيذ هذا العقد؛ لا ترقية operation-confirmed بالدليل الجزئي.

## توضيح التبعيات من تتبع المصدر — ٧ نوفمبر

لا يغيّر هذا التوضيح قرارات المجال أو كتالوج المنح. متطلب إنشاء/تعديل كشف
التشغيل الكامل يجمع مفتاح الكتابة أعلاه مع `DeliveryNote.Lookup` و
`DeliveryNote.GetDetailById`؛ ينطبق على route والزر والمحرر وقراءة المصدر.
المسار القديم `TimeSheet/details/:id` يدخل mode edit فعلًا، لذلك يحتاج متطلب
التعديل الكامل؛ `view/:id` يظل View فقط. الإدخال الدفعي يجمع SaveBatch مع
المصدرين، دون منح Create/Update ضمنية.

توليد فاتورة الإيجار يستهلك لقطة معاينة؛ يلزم بقاء Preview مع Generate
وقت الإرسال، ولا يرسل من لقطة حجبت بعد سحب قراءتها. لوحة سبب الإبطال تتبع
Finance+Void مع حفظ المسودة عند سحب المنحة. روابط المالية تحتاج Finance
ومنحة الوجهة وسياسة مسارها.

ثبت من الخدمات أن GetDetailById/OperationalSources وPreview/Finance قراءات
كاملة للمستند، لا تغيّر بياناته؛ تصنف في BranchOperationRules كعرض فروع
كل المستند، دون فتح أثر فروع جزئي. تظل Generate وManageApproval وVoid
تحت تسجيل الحركات. الرفع يستلزم Upload+Delete، وإزالة مرفق محفوظ تحتاج
متطلب المحرر وDelete فقط عبر المالكين الموجودين.

انتهاء سياق محرر متداخل لا يهدمه أثناء كتابة مرسلة؛ يحجب وينتهي حتى يغلقه
المستخدم. إلغاء قرار discard المفتوح يصدر false، وقرار محلي جديد بعد انتهاء
السياق متاح دون تنظيف ملفات السياق القديم. سحب View يلغي الطباعة المؤجلة
حتى إذا اكتمل طلب التقرير قبلها. حظر السياق لمالك الاعتماد منفصل عن سحب
المنحة، حفاظًا على سبب القرار وإعادة المنح في السياق نفسه.
