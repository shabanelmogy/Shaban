# مطابقة صلاحيات EquipmentRentalOrder (التاريخية) — 12 نوفمبر 2026

| المقياس | النتيجة |
|---|---|
| حالة التبني | Source-only `operation-confirmed`، دون تشغيل أو قبول HTTP/SQL |
| العقد | [EQUIPMENT_RENTAL_ORDER_ACCESS_CONTRACT_FREEZE.md](EQUIPMENT_RENTAL_ORDER_ACCESS_CONTRACT_FREEZE.md) |
| تحليل المصدر | [EQUIPMENT_RENTAL_ORDER_ACCESS_DISCOVERY.md](EQUIPMENT_RENTAL_ORDER_ACCESS_DISCOVERY.md) |
| الجرد | صف `EquipmentRentalOrder` وحده ينتقل من resource-only إلى operation-confirmed؛ 148/263؛ يليه `EquipmentMasterAgreement` |

## ربط الأفعال بالمصدر

| المسار المستهلك | endpoint والخادم | grant الحقيقي | دليل التغيير |
|---|---|---|---|
| القائمة والبحث/التحديث وExcel | `GET /SaleOrder/equipment-rental` → `SaleOrderController.EquipmentRentalOrders` → `SaleOrderService.RentalReads.GetEquipmentRentalOrdersAsync` | `SaleOrder.EquipmentRentalOrders` | `components/list/list.component.ts/html`, route policy, `equipment-rental-order-access.ts`، Source spec |
| فتح الصف وdirect View وتاريخ البنود | `GET /SaleOrder/equipment-rental/{id}` → `EquipmentRentalOrder` → `GetEquipmentRentalOrderAsync` | `SaleOrder.EquipmentRentalOrder` مستقل عن القائمة | `components/details/details.component.ts/html`، source specs |
| اتفاقية المصدر وأسعارها | `GET /SaleOrder/equipment-rental/sources` → `EquipmentRentalSources` | `SaleOrder.EquipmentRentalSources` + `EquipmentMasterAgreement.View` | `PermissionPrerequisites`؛ لا يستهلكه قارئ View التاريخي |
| عرض إشعار تسليم ذي علاقة | الربط بـ`/DeliveryNote` بعد استرجاع السطر الصحيح | `SaleOrder.EquipmentRentalOrder` + `DeliveryNote.View` | إخفاء زر السطر إذا غابت الصلاحية، والتأكد قبل الانتقال؛ DeliveryNote يملك التحقق النهائي |
| قائمة الاتفاقيات | `/EquipmentMasterAgreement` | `EquipmentMasterAgreement.View` | إظهار الرابط فقط بالمنحة، وحارس تنفيذ |
| إنشاء/تحديث/تأكيد/إلغاء بقية الطلب | POST/PUT `SaleOrder/equipment-rental...` التاريخية | **متقاعد — لا grants قابلة للإسناد** | `RentalWrites.cs` يرجع `ErrorStatusCode=405`، و`PermissionEndpointResolver` يمنع إعلانها كمنح فعلية، والـcontroller يعيد `ToActionResult` |

## العزل ونشر النتائج

`SaleOrder` يبقى تحت `BranchScopeRegistry.Direct<SaleOrder>("BranchId")`. قائمة القراءة/التفاصيل لا تتجاوز فرع المالك. أسماء العملاء تستخرج من Partner المسموح بفروعه، وتُحجب هوية الاتفاقية/المعدل لو أخفاه نطاقها. `DeliveryNote` المرتبط يُستعلم من Query scoped؛ لا يظهر معرف إشعار مخفي. تُعاد `404` عند عدم العثور على أصل الطلب/المصدر. يعالج تكرار إشعارات التسليم تاريخيًا باختيار آخر رقم مرتبط للسطر، دون كشف صفوف من خارج نطاق query. لا يغير ذلك سندات التسليم أو ماليّات مستندات أخرى.

Angular: مفاتيح القائمة والتفاصيل منفصلة؛ طلب القائمة/Excel يُلغى عند سحب grant أو تغير actor/session/branch context وتُحجب النتائج المسترجعة خارج الجلسة. محرر العرض التاريخي read-only حتى لو استدعي مكونه مباشرة؛ كتابات typed لا تُرسل، والطرق `/create` و`/edit` Redirect إلى DeliveryNote. `AccessViewPolicyService` و`readAuthSessionKey` يرصدان تغيّر المالك، و`CurrentAccess` هو مصدر المنح، مع مخارج مبكرة على الأفعال الممنوعة. مُنع تحويل حالة Speed القديمة إلى كتابة قابلة للاستعمال في Sigma الحالية.

## Source checks / pending runtime acceptance

- Source-only specs: `SiGmaAngularFrontEnd/.../EquipmentRentalOrder/components/list/list-access.spec.ts` و`SigmaBackend/tests/SiGma.BranchAccess.Tests/EquipmentRentalOrderAccessContractTests.cs`؛ **لم تُنفذ**.
- `git diff --check` على ملفات الوحدة المشتركة مقبول؛ تحذيرات LF→CRLF في Git بيئة Windows غير مانعة.
- لم تُشغّل build/tests/lint/typecheck/browser/DB/migration/snapshot/commit/push/deploy. يلزم قبول لاحق لتأكد ترجمة EF projection وSQL plan وحالات الفرع المخفي وHTTP 404/405 وسلوك تغيير الجلسة عند القارئ.
- لا حاجة لهجرة مخطط جديدة من تعديلات العقود؛ لا تبديل بيانات أو snapshot.
