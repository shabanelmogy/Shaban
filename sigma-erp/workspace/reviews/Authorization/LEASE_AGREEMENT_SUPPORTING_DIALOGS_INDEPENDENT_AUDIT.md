# التدقيق المستقل لحوارات اتفاقية الإيجار الداعمة

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | Additional Charges وDiscounts وPayment Instructions وVoid وDelivery Date وDriver Replacement وBilling History وLogs |

## الحدود

أُعيدت قراءة المصدر الحالي للحوارات الثمانية و`lease-agreement-dialog-session.ts`
بعد تحديث تسليم العامل. لم يُعدل كود التطبيق، ولم تُشغل build أو tests أو
typecheck أو lint أو browser أو قاعدة بيانات.

## النتيجة

أغلقت النسخة الحالية ضمن النطاق المراجع: success latch قبل publication، استقلال
الكتابات المرسلة عن destroy مع تحرير global loading في `finalize`، حراسة نتائج
القراءة بهوية المستند والنسخة و`canPresent(true)`، استعادة initial-denied ودورات
revoke/regrant المتكررة بعد busy tail، حفظ المسودة عند refresh، تعطيل Reactive
Form الفعلي عند read-only، إغلاق Select/DatePicker portals، و`agreementId`
setter الذي يمرر تغير الهوية إلى session. حوارا Billing History وLogs للقراءة
فقط يطبقان نفس fence والاستعادة دون تمكين كتابة.

## Finding مغلق — فقد write والمسودات dirty

أعيدت قراءة الإصلاح الفعلي في الحوارات الثلاثة. صار `requestClose()` يغلق مباشرة
للنموذج النظيف فقط، وتدخل المسودة dirty التأكيد المؤجل حتى إذا بدأ القرار بعد
سحب منحة الكتابة:

- `additional-charges.component.ts` يفحص `additionalChargesForm.dirty` مستقلًا.
- `discounts.component.ts` يفحص `discountForm.dirty` مستقلًا.
- `payment-instructions.component.ts` يفحص `form.dirty` مستقلًا.

يبقى `defer` و`confirmationCancelled$()` مالكي عمر القرار. لا يعيد `finalize`
تمكين النموذج المجمد إلا إذا كانت `session.canWrite()` عادت؛ وإلا يعيد effect
تقييم النموذج عند regrant دون فتح الكتابة أثناء denial. المواصفة المصدرية الجديدة
تثبت أن initial write denial لا يلغي local discard، وأن revoke لاحقًا يلغي
التأكيد. لم تُشغل المواصفة وفق حد المصدر فقط.

## القرار

لا توجد findings مؤكدة متبقية في هذا التدقيق الموجّه. قبول build/tests/runtime
والتوقيت المرئي المجمع يبقى معلقًا لدى المالك.
