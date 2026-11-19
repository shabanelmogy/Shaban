# اكتشاف صلاحيات سجل الحركات الموحّد — logsMovement

| البند | النتيجة |
|---|---|
| الحالة | Discovery — source-only, contract frozen after audit |
| التاريخ | 2026-11-11 |
| جرد البداية | 145/263؛ `logsMovement` resource-only، مورد الخدمة الاسمي `CollectionMovement` لكن endpoint مستقل |

## دليل Speed وفصل Sigma

دليل Speed بتاريخ `2026-10-27/Speed_Analysis_Guide.md` يشرح دورة حركة المركبة، ثم شاشة `2026-10-28/sidebar/13-movements/screens/06-movements-log.md` تربط المسار R0240 وcontroller **C1631** للقائمة، C1630 لتحرير الحركة، C1632 لسجل الحركات وC1636 للعرض وC1638 للطباعة. تُظهر إجراءات Speed Edit/Delete وDamage Invoice وWhatsApp/SMS وMovementLogs وExport/CheckCard. **لا يوجد أي من تلك الكتابات في سجل Sigma الحالي**؛ لا تفتح منح Delete/Edit/Message/Invoice وهمية. الواجهة الحية تعرض List/Search/Excel/Report/View/Check Card مع رفع مستند دعم اتفاقية إيجار فقط إذا كان endpoint المالك يؤيده.

## الأدلة الحيّة ومستهلكات API

| الوظيفة | المصدر | الطلب الفعلي |
|---|---|---|
| مسار الشاشة | `SiGmaAngularFrontEnd/src/app/modules/Movements/logsMovement/logs-movement-routes.ts` و`pages/routing.ts` | `/logsMovement` شاشة واحدة بلا Create/Details مستقلة |
| القائمة وExcel/Report | `components/list/list.component.ts/html:45-360`, `services/logs-movement.service.ts:9-23` | `GET /CollectionMovement/GetMovements` مع dateMode, movementNo/refNo/plateNo, type, status, km threshold, damage flag, contactId/grid وإجمالي الصفحات |
| فلتر العميل الاختياري | `components/list/list.component.ts:199-221` | `Customer/GetSelect` يستخدم BaseService cached (`shared/service/customer.service.ts:10-15`)، لا يجب طلب Customer.Lookup لمجرد عرض سجل الحركات؛ شرط عند اختيار contactId أو grid على Contact/ContactCode |
| عرض مصدر الصف | `components/view/view.component.ts:515-537` | `Agreement`→`RentalAgreement.GetByWithNavigationsId` (RentalAgreement.View)، Collection→`CollectionMovement.GetByWithNavigationsId` (CollectionMovement.View)، Delivery→`DeliveryMovement.GetByWithNavigationsId` (DeliveryMovement.View)، NRM→`NRM.GetMovementLogDetails` (مفتاح مستقل)، Workshop→`WorkshopMovement.GetByWithNavigationsId` (WorkshopMovement.View). تُخفى View/CheckCard للمصدر غير الممنوح |
| المستندات والرفع | `components/view/view.component.ts:303-408,573-614`, `RentalAgreementController` | Agreement-only `RentalAgreement.GetDocuments`، ثم `RentalAgreement.UploadDocument` ضمن `RentalAgreement.View`+`RentalAgreement.GetDocuments` الخادميتين؛ الفشل لا يمنح upload اعتباطًا. ملف أُرسل يجب أن يكمل دون إظهار نتيجة جلسة أخرى |
| Checklist | `components/view/view.component.ts:873-908`, `Administration/ChecklistItem/services/checklistitem.service.ts:51-55` | `GET /ChecklistItem` يحتاج `ChecklistItem.View`؛ إن غابت المنحة، استخدم fallback static items دون محاولة قراءة محظوبة، ولا يُعرض ذلك كإجابات محفوظة |
| الخادم | `SigmaBackend/SiGma.ServerAPI/Controller/CollectionMovementController.cs:17-22`, `SiGma.Business/Services/CollectionMovementService.cs:GetMovements` | `CollectionMovement.GetMovements` Reviewed مستقل عن `CollectionMovement.View`، يجمع Agreement/Delivery/Collection/Workshop/NRM تحت فروع المصدر التاريخية ويفلتر ويحسب الصفحات؛ no pending state changes |

## الفجوات المثبتة

- قائمة Sigma تدخل `GetMovements` و`Customer/GetSelect` دون فحص grant/actor. GET/Excel/Report `switchMap` للقائمة فقط، لكن الصادرات/الطباعة قد تُنشر بعد revoke/session switch، والأزرار View/Check Card لا تتحقق من منح المصدر ولا صحة ملكية الصف الحالي.
- `MovementFiltersDto` الحالي **لا يحتوي `grid`**، بينما Angular يرسل مرشحات PrimeNG grid مع GET. فلاتر الأعمدة لا تطبق في endpoint. يجب قبول grid bounded من `GridFilter.Apply` على إسقاط `MovementDto` المسموح فقط، **بعد** التجميع وقبل Count/Page؛ أعمدة Contact/ContactCode تحتاج Customer.Lookup عند filter. لا يكشف grid معرّفات المراجع المحجوبة أو الخصائص الخادمية الداخلية.
- عارض بطاقة الفحص يتابع تغير ReferenceLookupCache لكنه لا يراقب token/session/كل grant. بعض المصادر تعيد بيانات detail من API حتى بعد سحب المنحة إن لم تُلغ requests؛ لا يجوز الاعتماد على route guard وحده. Document/Checklist تبويبات اختيارية مستقلة، والطباعة لا تنطلق من تفاصيل قديمة.
- `GetMovements` يجمع بيانات من خمسة مصادر واحدًا بعد الآخر ثم يطبق بعض المرشحات/علامات الحوادث قبل paging؛ الفهرسة على الجذر والحجب المرجعي في الـAPI مهمان، لكن تحويله إلى SQL UNION أو pagination موزعة تغيير أكبر يجب اختباره لعدم إسقاط أحداث وحوادث. لا ادعاء قياس SQL دون تشغيل خطط فعلية. Cache `Customer.GetSelect` مشترك scoped actor، وبيانات الحركات نفسها live operational.
