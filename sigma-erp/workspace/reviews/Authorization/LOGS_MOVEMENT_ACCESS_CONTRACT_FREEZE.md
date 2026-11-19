# عقد الصلاحيات المجمد — سجل الحركات logsMovement

| البند | القيمة |
|---|---|
| الحالة | Frozen — source-only implementation authorized |
| التاريخ | 2026-11-11 |
| دليل الاكتشاف | [LOGS_MOVEMENT_ACCESS_DISCOVERY.md](LOGS_MOVEMENT_ACCESS_DISCOVERY.md) |
| الجرد قبل الإقفال | 145/263، وlogsMovement مورد فقط |

## المنح والمصادر

`/logsMovement` **يتطلب `CollectionMovement.GetMovements` فقط للدخول إلى القائمة والبحث وExcel وReport**. هو endpoint متخصص مستقل يقرأ عدة أنواع من الحركات، وليس `CollectionMovement.View` ولا `CollectionMovement.Create`. لا تمنح GetMovements حق قراءة تفاصيل المصدر تلقائيًا، ولا حق تعديل/حذف/إرسال رسائل أو إنشاء فواتير كما في Speed.

| العمل | المتطلب | المصدر |
|---|---|---|
| القائمة/بحث/Excel/تقرير طباعة جميع النتائج | `CollectionMovement.GetMovements` | `GET /CollectionMovement/GetMovements` مع مجموعات مصدرية scoped، Count/Page وgrid |
| فلتر العميل/أعمدة Contact/ContactCode grid | السابق + `Customer.Lookup` عند استخدام الفلتر فقط | `Customer/GetSelect` اختياري ومخزّن cache؛ لا GET أو filter محظوب بدونه، ويمسح مرشح العميل عند revoke مع الاحتفاظ ببقية الفلاتر |
| عرض/Check Card لصف Agreement | السابق + `RentalAgreement.View` | GET تفاصيل اتفاقية scoped |
| عرض/Check Card لصف Collection | السابق + `CollectionMovement.View` | GET تفاصيل استلام scoped |
| عرض/Check Card لصف Delivery | السابق + `DeliveryMovement.View` | GET تفاصيل تسليم scoped |
| عرض/Check Card لصف NRM | السابق + `NRM.GetMovementLogDetails` | GET الحركة المتخصصة، وليس NRM.View القائم |
| عرض/Check Card لصف Workshop | السابق + `WorkshopMovement.View` | GET تفاصيل حركة الورشة scoped |
| مستندات اتفاقية داخل نافذة العرض | `RentalAgreement.GetDocuments` إضافة إلى المنح السابقة للصف | GET مستندات حقيقية؛ لا يمنع عرض الأساسي عند غيابها |
| رفع/تبديل مستند دعم اتفاقية | `RentalAgreement.UploadDocument` + `RentalAgreement.GetDocuments` + `RentalAgreement.View` إضافة إلى GetMovements | POST multipart endpoint المالك؛ يحافظ على lifecycle للكتابة المرسلة وCAN_PRESENT_API_OUTCOME، ولا يسمح بالرفع لصف غير Agreement |
| أسماء Checklist اختيارية | `ChecklistItem.View` عند تحميل API | GET ChecklistItem بشرط المنحة، أو fallback static مقروء محليًا؛ لا تحويلها إلى إجابات فحص محفوظة |

أي source غير معروف أو بلا إذن تفاصيل يُعرض في القائمة إذا أجاز GetMovements root، لكن لا يسمح بفتح View/CheckCard أو طباعة تفاصيل كاملة بالاعتماد على صف القائمة وحده. دخول `/logsMovement` حارس route policy صريح؛ كل إجراء وصادر/طباعة يعيد التحقق من `dataContext` والجلسة و`access.revision` وصف الهوية الحالي. تحجب قوائم الصفوف فور revoke وتلغي الطلبات القديمة، وتعود القراءة عند استعادة المنحة لنفس المالك دون إحياء بيانات cache قديمة.

## عقد المرشحات والخادم

`CollectionMovement.GetMovements` يبقى Reviewed مستقلاً. يقرأ جذور Agreement/NRM/Delivery/Collection/Workshop تحت نطاق فرعها الحقيقي من DB، ولا تتجاوز علاقات الشخص/المركبة/الحوادث الحدود. فلتر `contactId` الموجب في `MovementFiltersDto` و`grid` على Contact/ContactCode يتطلبان `Customer.Lookup` **شرطيًا في `PermissionPrerequisites`**، لا على GetMovements البسيط. اجعل grid JSON bounded عبر `GridFilter.Apply` على scalar DTO whitelist المعروض فقط بعد تجميع النتائج وقبل Count/Skip؛ لا تسمح بفلترة hidden AgreementId/VehicleId/MovementKey. `pageSize <=100`, pageNo overflow-safe, تاريخ Min/Max آمن، الفلتر/Count موحدان لكل الصفحات والتصدير. `ToActionResult` لم يعد يخفي الفشل بـ200. لا توجد mutations لهذا endpoint.

## الواجهة، عمر الطلبات والمستندات

- قائمة UI22: مؤشر الصفحة عند GetMovements/Excel/Report، وخيارات Customer.Lookup الاختيارية محلية. `switchMap` و`takeUntil(denied$)` عند قائمة/صادرات/تقرير، مع فحص الملكية بعد النتيجة وقبل تنزيل ملف أو `ReportPrintSession.print`. `ReportPrintSession.cancelPending` عند revoke/actor/context/فرع جديد. فلتر العميل وgrid الحقول المحمية يُزالان عند سحب Lookup؛ إن لم توجد منحة لا يبدأ `Customer.GetSelect`.
- نافذة التفاصيل تحت `CollectionMovement.GetMovements` + grant المصدر. كل GET تفاصيل/مستندات/Checklist يملك شرطه الخاص، `takeUntil` عند سحب المنحة، وتغير الحساب يبطل جميع المخرجات/print والدraft. فقد Lookup الفرعي لا يلغي تفاصيل أساسية؛ تفاصيل Agreement قد تظل قابلة للعرض دون GetDocuments أو Checklist.
- POST UploadDocument الذي أُرسل لا يُلغى عند تدمير النافذة، ويُمنع إرسال جديد بعد فقد grant؛ `CAN_PRESENT_API_OUTCOME` يحجب إشعار الحساب القديم، بينما يظل server response نافذًا. لا تحمل مستندًا من اتفاقية خارج الفرع؛ endpoint الخادم يعيد validate، و`file-link` له إذن media منفصل.
- Check Card لا يعرض رسومات/أسماء fallback كإجابات أو مواضع أضرار حقيقية؛ الطباعة تنتظر GET تفاصيل ناجحًا وChecklist إن كان مفعّلًا، وتفشل بأمان عند فقد المصدر. لا Edit/Delete/Close/Return/WhatsApp/CreateInvoice في Sigma هنا.

## قبول المصدر

حدّث Angular list/view/routes/service + مصدر صلاحيات مستقل، وBackend `MovementFiltersDto` و`PermissionPrerequisites` و`GetMovements` فقط، source specs سلبية للمنح وسحبها وفلتر العميل/المصدر/المستندات وGrid/Excel/Print. حافظ على دليل عربي/إنجليزي وروابط Speed، واكتب مطابقة source قبل ترقية **صف logsMovement وحده**. لا حاجة إلى Migration جديدة إلا لو ظهر فرق مخطط/فهرس مثبت؛ لا يقاس أداء SQL إلا في قبول المالك. لا build/tests/lint/browser/commit/push قبل التفويض، باستثناء الهجرات الضرورية المصرح بها.
