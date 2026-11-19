# EquipmentMasterAgreement — مصدر اعتماد الصلاحيات (البند 149)

| الحالة | Source-only operation-confirmed، **وليس قبولًا تشغيليًا** |
|---|---|
| التاريخ | 12 نوفمبر 2026 |
| العقد | [EQUIPMENT_MASTER_AGREEMENT_ACCESS_CONTRACT_FREEZE.md](EQUIPMENT_MASTER_AGREEMENT_ACCESS_CONTRACT_FREEZE.md) |
| الاكتشاف | [EQUIPMENT_MASTER_AGREEMENT_ACCESS_DISCOVERY.md](EQUIPMENT_MASTER_AGREEMENT_ACCESS_DISCOVERY.md) |
| المورد | `EquipmentMasterAgreement` (لا `Quotation` ولا `SaleOrder` الموروث) |

## مطابقة الاستهلاك بالفعل

| العملية | Angular | Backend والمفتاح |
|---|---|---|
| list/search/filter/sort/paging/refresh/Excel | `components/list/list.component.ts/html`، route policy | GET list → `EquipmentMasterAgreement.View`؛ `Customer.Lookup` و`Quotation.View` فقط لمرشحات/أعمدة grid الخاصة بكل منهما؛ فرع actor-bound من CurrentBranch.Options |
| direct create | `components/details/details.component.ts/html`, route create | `EquipmentMasterAgreement.Create` + `Customer.Lookup` + `Equipment.Lookup`، دون View؛ `Quotation.View` مشروط بمرجع عرض السعر المرسل |
| direct view/edit | direct `view/:id`, `edit/:id` | GET `/{id}` صنّف `View` صراحةً؛ Update يحتاج View+Update+مراجع المحرر؛ منع تعديل اتفاقية معتمدة |
| approve/delete | row action + confirm guards | `EquipmentMasterAgreement.Approve` (metadata override لتغليب المفتاح على `ManageApproval` العام) و`EquipmentMasterAgreement.Delete` كلاهما يحتاج View، مع إعادة فحص حالة الصف |
| finance | `components/finance/finance.component.ts/html` | `FinancialStatus`+View للقراءة؛ Close/Reopen مع View+FinancialStatus ونوع الحالة/سبب التغيير؛ كتابة مرسلة لا تُلغى بتدمير المكوّن |
| linked historic sale orders | `components/sales-orders/sales-orders.component.ts/html` | `GetSaleOrders`+View للقراءة، `UpdateSaleOrders`+View+GetSaleOrders للكتابة؛ لا إحياء typed SaleOrder writers الأربعة المتقاعدة |
| delivery navigation | list action to DeliveryNote | `DeliveryNote.View` للعرض و`DeliveryNote.Create` للإنشاء، مستقلتان عن حقوق agreement |
| source quotation | `EquipmentMasterAgreementService.getQuotations` | استبدال `Quotation/GetSelect` المغلق 405 بـ`Quotation.View` paginated approved list؛ عدم بدء القراءة بدون grant، والمرجع المستقل محمي View |

## عزلة الفروع/البيانات

`EquipmentMasterAgreement` يخضع لمنطق ownership edges لكل معدة/سند مرتبط في `BranchScopeRegistry` وليس BranchId ثابتًا واحدًا. Backend يطلب `AllowsWrite` على **كل فروع معدات** rates القديمة والجديدة عند إنشاء/تحديث/حذف/اعتماد، ويمنع غير المدير من إنشاء اتفاقية بلا فرع معدات محدد. Link/Unlink لأوامر البيع يتطلب قابلية الكتابة لفرع كل أمر ويُرفض إذا كان اتفاقية موجودة تملك أمرًا حيًا مخفيًا من نطاق الفاعل، بدل ترك الربط جزئيًا. إسقاط القائمة وgrid/details يستخدم قائمة العملاء المقيدة بالفروع وQuery<Quotation> المقيد وتحقق المعدات، فلا يُظهر المراجع المحجوبة. لا يُعيد فتح `/Quotation/GetSelect` أو endpoint generic غير مدعوم؛ generic Select/CheckUnique/Activate/GetAllWithNavigations ترجع 405 وغير assignable.

## السلامة الزمنية

حراس مسارات list/create/view/edit والعزل بين session/actor/revision يمنعون إرسال request غير مخوّل أو نشر رد قديم؛ يتم فصل sent mutations في approve/delete/finance/sale-order-links/save editor عن `DestroyRef`، وربط عرض النتيجة بـ`CAN_PRESENT_API_OUTCOME` وهوية الجلسة والمنحة. مستخدم Create-only يغادر بعد الحفظ إلى أول مسار مسموح بدل فتح قائمة غير مسموحة. الخيارات المشروطة وقيم العرض القديمة لا تمسح آليًا عند فقد المنحة؛ لا ترسل QuoteId إلا مع Quotation.View.

## مصدر التحقق — غير منفّذ تشغيليًا

- source specs: `SiGmaAngularFrontEnd/.../EquipmentMasterAgreement/components/list/list-access.spec.ts` و`SigmaBackend/tests/SiGma.BranchAccess.Tests/EquipmentMasterAgreementAccessContractTests.cs`؛ لم تُشغّل.
- scoped `git diff --check` للملفات المعدلة نظيف، باستثناء تحذير تحويل LF→CRLF التقليدي عند لمس Git للملف.
- لا build/tests/lint/typecheck/browser/HTTP/SQL/DB/migration/snapshot/commit/push/deploy. ما يزال SQL projection translation/plan وعزل الأمثلة الحية وسلوك العملاء والنافذة والكتابة عبر الشبكة بحاجة قبول مستقل. لم يُعدّل مخطط DB ولا تتطلب تعديلات الصلاحيات هذه هجرة مخطط جديدة.
