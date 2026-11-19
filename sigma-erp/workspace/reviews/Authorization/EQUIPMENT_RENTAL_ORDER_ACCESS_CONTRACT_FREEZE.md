# عقد صلاحيات EquipmentRentalOrder — Freeze 2026-11-12

## حدود المورد

**الطريق العام** `/EquipmentRentalOrder` يحمل المورد **`SaleOrder`**. الواجهة الحالية للقراءة التاريخية فقط؛ `create` و`edit` Redirect إلى DeliveryNote، ولا تُفتح أفعال كتابة بسبب وجود endpoints typed تاريخية. لا تستنتج grants من `SaleOrder.View` العام. مفاتيح القائمة/التفاصيل الفعلية `SaleOrder.EquipmentRentalOrders` و`SaleOrder.EquipmentRentalOrder` على الترتيب؛ لكل منهما صلاحية مستقلة. لا يتطلب direct View حق قراءة قائمة. الرمز `SaleOrder.EquipmentRentalSources` يبقى مملوكًا لنهاية المصادر المقيدة ولا يُطلب على View المحفوظ.

## جدول الوصول

| السطح | المطلوب | سلوك الحارس |
|---|---|---|
| قائمة/بحث/تصفية/تحديث/Excel | `SaleOrder.EquipmentRentalOrders` | لا GET ولا Excel بدون منحة، وإلغاء reads وتصفير الصفوف فور فقد الوصول أو تغيير actor/session/branch context؛ لا نشر رد قديم |
| فتح صف/تاريخ مستند محفوظ | `SaleOrder.EquipmentRentalOrder` | صف في القائمة يحتاج هذا المفتاح للانتقال؛ direct view لا يشترط List؛ cancel read on revoke وcontext switch |
| معدات/بنود/تواريخ وتاريخ إجراءات | نفس منحة التفاصيل ضمن `SaleOrder` والفرع التاريخي لمالك المستند | لا نشر مراجع فرع/tenant آخر، ولا عرض أكواد مخفية ولا delivery IDs أجنبية |
| رابط إشعار التسليم | `SaleOrder.EquipmentRentalOrder` مع `DeliveryNote.View` وعضوية الصف الفعلية | لا انتقال إلى مكون DeliveryNote ببيانات لا يسمح بها مستهلكه |
| الانتقال لقائمة اتفاقيات المعدات | `EquipmentMasterAgreement.View` | إخفاء الزر ومنع التنفيذ إذا لم تتوافر المنحة؛ لا تكفي منحة الطلب |
| typed writes الأربعة | لا منحة قابلة للإسناد في هذه الوحدة | HTTP `405 MethodNotAllowed` حتى لو امتلك المستخدم grant موروث/قديم؛ لا تستهلكها الواجهة |

### أمن الخدمة والـHTTP

`SaleOrder.BranchId` المحفوظ هو مالك المستند، و`BranchScopeRegistry` يضع `SaleOrder` على `BranchId` مباشرة. لا تسحب شجرة `EquipmentMasterAgreement`/`Partner` عبر الملاحة إذا كانت مخفية في فرع آخر؛ أسقط أسمائها من queries محددة القراءة فقط بعد تحديد tenant والسجلات غير المحذوفة. `DeliveryNote` المرتبط يلتزم بفرعه المرئي عند نشر `DeliveryId`/No/Date؛ لا تعرض أرقامًا أو تفاصيل تابعة محجوبة. `404` للسجل التاريخي غير المرئي أو المفقود؛ `405` فقط للكتابات typed المتقاعدة، مع `ToActionResult` بدل `BadRequest` ثابت.

### المزامنة والقبول

`CAN_PRESENT_API_OUTCOME` للكتابة إن ظهرت مستقبلًا ليس ترخيصًا لإحياء الكتابة المتقاعدة. UI22 loader مرة واحدة لكل طلب، وتحديث الاستحقاق عبر `AccessViewPolicyService` و`AuthService` و`ReferenceLookupCacheService`. كل اختبار يكتب source-only ولا ينفذ في هذه الجولة؛ لا build/tests/lint/typecheck/browser/DB/migration/snapshot/commit/push/deploy.
