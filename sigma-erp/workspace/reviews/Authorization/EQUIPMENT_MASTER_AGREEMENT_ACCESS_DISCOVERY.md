# EquipmentMasterAgreement — اكتشاف البند 149 (12 نوفمبر 2026)

الحالة: discovery قبل الإقفال، البند 149 بعد 148/263. صفحة القائمة و`create/view/:id/edit/:id` في `EquipmentMasterAgreement/equipmentmasteragreement.routes.ts`؛ مورد API المباشر `EquipmentMasterAgreement`، وليس `Quotation` أو `SaleOrder` العام.

المرجع المعتمد: `references/speed-analysis/2026-10-28/sidebar/11-equipment-rental/screens/02-master-agreements.md`، المسار R0661 والوحدات C1486 (list)، C1487 (editor)، C1483 (linked sale orders)، C1491 (print). تظل حالات Sigma الراهنة وتحقيق خادمها هي الأصل؛ لا تُنقل أفعال أخرى من Speed.

| الاستهلاك | Angular | endpoint | قرارات الاكتشاف |
|---|---|---|---|
| قائمة/فلترة/Excel | `components/list/list.component.ts` و`service.getList/getAllList` | `GET /EquipmentMasterAgreement`→ `GetList` | `EquipmentMasterAgreement.View`؛ عميل filter يحتاج `Customer.Lookup`، الفرع يمكنه استخدام `CurrentBranch/Options` دون فرض `Branch.Lookup` |
| Create | `components/details/details.component.ts`, `service.create` | `POST /EquipmentMasterAgreement` | `EquipmentMasterAgreement.Create` مع `Customer.Lookup` و`Equipment.Lookup`، دون View؛ `Quotation.View` فقط عند الإشارة لعرض فعلي أو معاينته |
| View/edit | `service.getDetail/update` | `GET /{id}`→ `GetDetailById`, `PUT /`→ `Update` | `EquipmentMasterAgreement.View` للتفاصيل، وView+Update+مراجع المحرر للتعديل؛ المرجع التاريخي يخضع لنطاق الفرع |
| اعتماد/حذف | القائمة والإجراءات | `POST /{id}/approve`, `DELETE /` | `EquipmentMasterAgreement.Approve` مع View، `EquipmentMasterAgreement.Delete` مع View؛ حالة الخادم هي المصدر |
| Finance | `components/finance/finance.component.ts`, `service.getFinancialStatus/closeFinancially/reopenFinancially` | `GET /{id}/financial-status`, `POST /{id}/close,reopen` | `EquipmentMasterAgreement.FinancialStatus`+View ثم `Close`/`Reopen`+View+FinancialStatus؛ عدم تشغيل write إذا سُحب الحق |
| ربط أوامر بيع تاريخية | `components/sales-orders/sales-orders.component.ts` | `GET/PUT /{id}/sale-orders` | `GetSaleOrders`+View للعرض، `UpdateSaleOrders`+View+GetSaleOrders للإرسال؛ لا `SaleOrder.CreateEquipmentRentalOrder` المتقاعد |
| Delivery links | قائمة اتفاقيات Approved→`/DeliveryNote` | تابع لوحدة DeliveryNote | `DeliveryNote.View` و`DeliveryNote.Create` مستقلة؛ لا تُنسخ grants للمورد الآخر |

مشكلة عابرة مثبتة: `EquipmentMasterAgreementService.getQuotations()` يستدعي `Quotation/GetSelect` الذي أصبح 405 nonassignable بالبند 147؛ يجب استخدام `Quotation.View` للقائمة المقيدة بصفحات approved، وبلا طلبها لمن ينشئ اتفاقية بلا عرض سعر. الفلاتر على `quotationRefNo` ومراجع العملاء وplate/grid تحتاج أذوناً شرطية عند الاستهلاك، لا إعادة تفعيل endpoint قديم.

Backend: `EquipmentMasterAgreementService.cs` يحوي Create/Update/Delete/Approve/List/Detail/SaveSaleOrders، و`.Finance.cs` يحوي status/Close/Reopen. `EquipmentMasterAgreement` يتبع ownership edges للمعدات/التسليمات في `BranchScopeRegistry`، وليس `BranchId` مستقلاً؛ يجب حفظ source branch scopes عبر كل قائمة بنود، وحجب مراجع Partner/Quotation/Equipment المحجوبة. اتفاقيات Approve تثبت Currency/Tax/Rates. الاختبارات قبول source-only فقط؛ لا build/tests/lint/typecheck/browser/DB/migration/snapshot/commit/push/deploy.
