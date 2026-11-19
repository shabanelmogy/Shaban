# اكتشاف صلاحيات EquipmentRentalOrder — المصدر أولاً

| المفتاح | التثبيت |
|---|---|
| ترتيب الجرد | 148 بعد `EquipmentQuotation`؛ صف مستقل `resource-only` قبل تنفيذ العقد |
| مسار Angular | `/EquipmentRentalOrder` للقائمة، `/view/:id` فقط للتفاصيل التاريخية؛ `create` و`edit/:id` يعيدان التوجيه إلى `/DeliveryNote` |
| API resource | `SaleOrder` لا `EquipmentRentalOrder` ولا `DeliveryNote` |
| حالة التشغيل الحالية | **قائمة وتفاصيل تاريخية قابلة للقراءة فقط**. كتابة typed equipment-rental (Create/Update/Confirm/CancelRemainder) متقاعدة بالفعل: `SaleOrderService.RentalWrites.cs:35-46` ترجع `EquipmentRentalOrderRetired` ولا توجد UI لإنشائها/تعديلها |
| مصدر Speed | `references/speed-analysis/2026-10-28/sidebar/11-equipment-rental/screens/02-master-agreements.md` وأداة `C1483--tenant.views.ers.masterAgreements.addOrViewSaleOrder.js` لإظهار طلبات/أوامر بيع من الاتفاقيات. لا توجد شاشة قائمة معاصرة مستقلة في فهرس Speed تطابق Sigma's historical `/EquipmentRentalOrder`؛ لا نقل workflow كتابة من Speed إلى المسار المتقاعد |
| نمط العرض | List + routed read-only document (direct View)، مع جدول بنود وتسليمات وسجل إجراءات وExcel؛ الرابط إلى DeliveryNote يتطلب منحة المورد المالك |

## خريطة المستهلك/النهاية

| الاستهلاك | Angular | الخادم | القرار |
|---|---|---|---|
| list/filter/sort/paging/Excel | `components/list/list.component.ts:63-80,99-105` | `GET SaleOrder/equipment-rental` → `EquipmentRentalOrders` → `SaleOrderService.RentalReads.cs:35-64` | `SaleOrder.EquipmentRentalOrders` |
| direct document View | `components/details/details.component.ts:119-132` | `GET SaleOrder/equipment-rental/{id}` → `EquipmentRentalOrder` → `RentalReads.cs:84-122` | `SaleOrder.EquipmentRentalOrder`؛ مستقل عن القائمة |
| read source agreement/rates | service `getSources()`، محرر الكتابة المتقاعد لا يستهلكه على طريق View | `GET SaleOrder/equipment-rental/sources` → `EquipmentRentalSources` → `RentalReads.cs:124-144` | مصدر عقد مخصص بلا grant قائمة؛ يظل محميًا ويمكن إسناده مستقلاً فقط إذا لزم قارئ فعلي آخر |
| View delivery | `details.component.ts:202-205` → `/DeliveryNote?deliveryId=N` | DeliveryNote API/routes الخاصة | يقتضي `DeliveryNote.View`، لا تكفي منحة SaleOrder |
| typed write routes | `services/equipment-rental-order.service.ts:27-30` غير مستهلكة على View والقائمة؛ Redirects في route | `SaleOrderController.cs:36-62` و`RentalWrites.cs:35-46` | ترد `405` ولا تضاف للمفاتيح القابلة للإسناد |
| child read labels | `RentalReads.cs:9-32,87-121` | `SaleOrder`, `SaleOrderItem`, `DeliveryNote`, `EquipmentMasterAgreement`, `Partner` | حرمة الفرع التاريخي للطلب، وحجب أسماء/معرّفات المراجع غير المرئية وعدم كشف إشعارات فرع آخر |

## حدود لا يجوز تجاوزها

لا تعديل APIs أو إعادة تفعيل Create/Update/Confirm/Cancel التي أُحيلت إلى DeliveryNote، ولا تعديل صلاحيات `SaleOrder` العامة أو `EquipmentMasterAgreement` و`DeliveryNote` الآخرين. الإقفال source-only مع مواصفات غير منفذة؛ SQL translation وHTTP والحالات التاريخية المؤرشفة قبول لاحق.
