# مطابقة صلاحيات عروض أسعار تأجير المعدات — EquipmentQuotation

| البند | الحالة |
|---|---|
| Status | Source-only operation-confirmed (147/263 before the EquipmentRentalOrder successor); no runtime acceptance claimed |
| عقد الصلاحيات | [EQUIPMENT_QUOTATION_ACCESS_CONTRACT_FREEZE.md](EQUIPMENT_QUOTATION_ACCESS_CONTRACT_FREEZE.md) |
| الاكتشاف | [EQUIPMENT_QUOTATION_ACCESS_DISCOVERY.md](EQUIPMENT_QUOTATION_ACCESS_DISCOVERY.md) |
| حالة الجرد | الصف رُقّي من resource-only إلى operation-confirmed؛ 147/263 عقب إغلاق 147 |

## قرار المورد وعلاقة المصادر

`/EquipmentQuotation` مسار Angular، لكن خدمة الشاشة تستدعي `Quotation` في الخادم؛ الصلاحيات تندرج تحت `Quotation.*`. تُظهر مصادر Speed بتاريخ 2026-10-27 و2026-10-28 (`R0660`, `C1494`, `C1493`, `C1497`) قائمة عروض وتحرير بنود وطباعة واعتماد داخلي واعتماد عميل وربط طلبات شراء واتفاقيات؛ لا تمنح وحدها حالات إضافية أو حقوقًا غير منفذة في Sigma. شاشة Sigma من نوع List with routed document editor، مع تفاصيل معدات وأسعار وتدفق اعتماد على المستند المحفوظ. مرجع Odoo مكمل فقط للغموض بعد Speed، ولا توجد قاعدة مفقودة استُمدت منه لهذه الدفعة.

تصحيح العقد بعد مقارنة المستهلك الفعلي: `EquipmentQuotationService.getEquipmentTypes()` يستدعي `FleetService` الذي يملك `Equipment` و`Equipment/GetSelect`؛ لذا المنحة الفعلية `Equipment.Lookup` لا `Fleet.Lookup` المبدئية، وتم تسجيل هذا التعديل في العقد والاكتشاف. يظل `Customer.Lookup` و`CarModel.Lookup` من الاعتماديات الأساسية للمحرر، بينما `Staff.Lookup` و`Contact.GetSelectByCompany` مشروطتان بإرسال مرجع اختياري؛ فرع التنفيذ من `CurrentBranch/Options` actor-bound.

## جدول إقفال المصدر

| الجزء | العقد المراد مطابقته | قبول المصدر |
|---|---|---|
| Route/list/filter/grid/export | `Quotation.View`؛ `Customer.Lookup` فقط عند مرشحات العميل أو أعمدة grid الخاصة به؛ create مستقل من دون list GET | متطابق مصدرّيًا؛ التنفيذ التشغيلي مؤجل |
| View/Print/Edit/Create | View مستقل، Create+Customer/Equipment/CarModel Lookup، Edit+View+Update مع نفس خيارات الصفوف؛ طباعة نتائج تفاصيل حقيقية فقط | متطابق مصدرّيًا؛ التنفيذ التشغيلي مؤجل |
| Optional references | `Staff.Lookup` عند إرسال `SalesPersonId` و`Contact.GetSelectByCompany` عند إرسال `ContactId`؛ لا مسح تلقائي لمرجع تاريخي عند سحب المنحة | المحرر يحرس إرسال المراجع، ويتيح إزالة صريحة للمرجع المحفوظ عندما لا يتاح Lookup |
| Delete + six transitions | grant مستقل لكل إجراء مع View وحالة الصف الخادمية، وإعادة فحص الهوية والمنحة بعد التأكيد؛ الطلب المرسل لا يُلغى عند teardown | متطابق مصدرّيًا؛ التنفيذ التشغيلي مؤجل |
| Purchase orders / master agreement | منح `PurchaseOrder.Create/View` و`EquipmentMasterAgreement.Create/View` مستقلة؛ لا يُفتح مصدر فرع آخر | متطابق مصدرّيًا؛ التنفيذ التشغيلي مؤجل |
| Backend branch/data | `Quotation.BranchId` التاريخي مالك الحركة؛ التحقق من الكتابة وعدم تغيير الفرع بالتحرير، وإخفاء بيانات المرجع المحجوب، وحماية روابط PO/EMA الحية | متطابق مصدرّيًا؛ EF/SQL قبول مؤجل |
| HTTP/catalogue | 404 للسجل المخفي، 405 للوراثة غير المدعومة، six reviewed actions فعليًا بدل grouped approval | متطابق مصدرّيًا؛ HTTP قبول مؤجل |

## حدود التحقق

يعتمد الإقفال على قراءة المصادر وفروق الملفات فقط؛ المواصفات المصدرية قد تُكتب لكنها لا تُشغّل. التحقق من ترجمة EF وSQL query plans والفهارس وHTTP والرخص الفعلية والواجهة والطباعة واستمرار الطلبات المرسلة عند تبديل الحساب قبول لاحق للمالك. لا تُنفذ build/tests/lint/typecheck/browser/DB/migration/snapshot/commit/push/deploy في هذه الجولة. لا ترقية لصف الجرد قبل اكتمال مراجعة مخرجات العاملين والربط المتبادل.
