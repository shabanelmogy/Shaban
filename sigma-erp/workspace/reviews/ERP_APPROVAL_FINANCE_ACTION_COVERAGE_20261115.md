# ربط حالة الموافقات في شاشات المالية والبنوك والفواتير

| البيان | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | 2026-11-15 |
| النطاق | إجراءات الصفوف في ١٦ قائمة فعلية تمثل ١٧ نوعًا، مع اعتماد المالك المشترك الذي يدمجه الجذر |
| العقد | ملحق استكمال الدورة في ERP_APPROVAL_IMPLEMENTATION_CONTRACT_FREEZE.md |

أُضيف إجراء `Approval Status` إلى `ActionList` الحالي أو مرر إلى `app-data-table` عندما كانت القائمة بلا إجراءات. يتلقى `injectApprovalStatusAction` صف المصدر الفعلي مع معرفه، ويعيد فحص إذن العرض وعضوية الصف في البيانات الحالية وانشغال الشاشة قبل الفتح. تعالج واجهة الجذر النافذة وقراءة المراحل وأهلية البداية والقرار. القراءة المركزية مباشرة بلا مخزن مؤقت، ولا ينشأ طلب لكل صف عند عرض القائمة.

المسارات في عمود الملف تبدأ من `SiGmaAngularFrontEnd/src/app/modules/`، وكل ملف ينتهي بـ`components/list/list.component.ts` ما لم يذكر خلاف ذلك. تُكتب أنواع النقل كما يستهلكها المصدر، وتطابق التصحيحات التي ينفذها الجذر في `DocumentApprovalSourceType.PermissionResource`.

| البند | النوع والشاشة الإنجليزية | مدخل الشاشة وملفها | إذن قراءة الموافقة | ما اكتمل من المصدر |
|---|---|---|---|---|
| ٢ | `TaxAdvanceInvoice` — Tax advance invoices | `/Invoice/tax-advance`؛ `Vouchers/Invoices/Invoice` | حزمة `invoiceAccess.taxView` التي تضم `Invoice.GetTaxAdvance` | الإجراء في قائمة الفواتير المشتركة يرسل نوع الدفعة الضريبية عند وضع `taxAdvanceList` |
| ١٤ | `CreditNote` — Credit notes | `/CreditNote`؛ `Vouchers/CreditNote` | `CreditNote.View` | أضيفت مصفوفة إجراء الحالة ومررت إلى الجدول. يقبل المالك المعرف المحفوظ الصحيح من `CreditNoteGridRow.id` |
| ١٥ | `DebitNote` — Debit notes | `/DebitNote`؛ `Vouchers/DebitNotes/DebitNote` | `DebitNote.View` | أضيف الإجراء إلى الإجراءات الحالية، مع بقاء سجل الكتابات ضمن مالكه |
| ١٨ | `Invoice` — Invoices | `/Invoice`؛ `Vouchers/Invoices/Invoice` | `Invoice.View` | الإجراء بجانب أفعال الفاتورة الحالية، ويعيد استخدام `canAction('view', row)` للتحقق من نوع المصدر وعضوية الصف |
| ١٩ | `BillingInvoice` — Billing invoices | `/BillingInvoice`؛ `Billing/BillingInvoice` | `BillingWorkspace.Get` | أضيف الإجراء لكل من قسمي الفواتير القائمة والمسواة، وعضوية الصف تتبع `sections()` الحالية |
| ٢٠ | `MiscellaneousInvoice` — Miscellaneous invoices | `/MiscellaneousInvoice`؛ `Vouchers/Invoices/MiscellaneousInvoice` | `MiscellaneousInvoice.View` | صُحح إذن الإجراء السابق من مورد Invoice إلى مورد الشاشة الحقيقي |
| ٢١ | `TransportationInvoice` — Transportation invoices | `/TransportationInvoice`؛ `Transportation/TransportationInvoice` | `TransportationInvoice.View` | أضيف الإجراء لقائمة الفواتير المحفوظة مع انشغال المالك الحالي |
| ٢٢ | `LimousineInvoice` — Limousine invoices | `/LimousineInvoice`؛ `Limousine/LimousineInvoice` | `LimousineInvoice.View` | أضيف الإجراء للصفوف المرئية التي يملكها سياق القائمة الحالي |
| ٢٣ | `EquipmentRentalInvoice` — Equipment rental invoices | `/EquipmentRentalInvoice`؛ `Equipment Rental/EquipmentRentalInvoice` | `EquipmentRentalInvoice.View` | أضيف الإجراء إلى قائمة أفعال الفاتورة الحالية |
| ٢٨ | `CashDeposit` — Cash deposits | `/CashDeposit`؛ `Banking/Cash Deposits/CashDeposit` | `CashDeposit.View` | أضيفت حالة الموافقة بجانب أفعال الاعتماد الأصلية. التحقق من الصف يستعمل `isCurrentRow` القائم بما يشمل منح المرشحات المطبقة |
| ٢٩ | `CardTransactionBankTransfer` — Card bank transfers | `/CardTransactionBankTransfer`؛ `Banking/Card Transactions Bank Transfers/CardTransactionBankTransfer` | `CardTransactionBankTransfer.View` | أضيفت حالة الموافقة بجانب أفعال الاعتماد الأصلية، مع `isCurrentRow` ونطاق الاستعلام الحالي |
| ٣٠ | `CustomerDeposit` — Customer deposits | `/CustomerDeposit`؛ `Vouchers/CustomerDeposit` | `CustomerDeposit.View` | أضيف الإجراء للصفوف الموجودة في `rows()` والقابلة للعرض حسب `canView()` |
| ٣١ | `PDCReceivable` — Receivable cheques | `/PDCReceivable`؛ `Banking/ChequesReceivables` | `PDCReceivable.View` | أضيف الإجراء مع عضوية الصف ونطاق الاستعلام الجاري من `isCurrentRow` |
| ٣٢ | `PDCPayable` — Payable cheques | `/PDCPayable`؛ `Banking/ChequesPayables` | `PDCPayable.View` | أضيف الإجراء مع عضوية الصف ونطاق الاستعلام الجاري من `isCurrentRow` |
| ٧٠ | `Provision` — Provisions | `/Provision`؛ `Vouchers/Provisions/Provision` | `Provision.View` | أضيف الإجراء في قائمة المخصصات المحفوظة، ويشترط `visibleRows()` الحالية |
| ٧١ | `SalaryVoucher` — Salary vouchers | `/SalaryVoucher/legacy`؛ `Vouchers/SalaryVouchers/SalaryVoucher` | `SalaryVoucher.View` داخل صفحة الأرشيف الإدارية الحالية | أضيف الإجراء للنوع التاريخي فقط. مساحة الرواتب الحالية تعرض `PayrollRuns` وتبقى في نطاق عامل الرواتب |
| ٧٤ | `TrafficFine` — Traffic fines | `/TrafficFine`؛ `Vouchers/TrafficFines/TrafficFine` | `TrafficFine.View` | أضيفت مصفوفة الإجراءات إلى الجدول، ويطبع المالك المشترك المعرف النصي الرقمي الصحيح إلى معرف المستند |

## دليل هوية السجلات والحدود

تقرأ مساحة Billing القائمة من `BillingWorkspaceService.GetAsync`، ويسند إسقاطها `Id = invoice.Id` مباشرة من `Repository.QueryReport<BillingInvoice>()`. لذلك يشير الإجراء إلى فاتورة محفوظة، ويحمل النوع `BillingInvoice` لكل صف. يطابق الجذر قراءة الموافقة لهذا النوع مع منحة الشاشة الفعلية `BillingWorkspace.Get`، وتحتفظ عمليات الإرسال والقرار بمورد `BillingInvoice`.

تعريف `CreditNoteGridRow` و`DebitNoteGridRow` يحتفظ بـ`id:number|null` من DTO، وتعريف `TrafficFineGridRow` يحتفظ بـ`id:string`. دمج الجذر في المالك المشترك يرفض المعرفات الفارغة وغير الرقمية وغير الصحيحة أو غير الموجبة ويطبع المعرف المقبول مرة واحدة. تتلقى دالة `canViewRow` الصف الحقيقي نفسه كي يبقى فحص عضوية البيانات صالحًا.

تملك متحكمات `MiscellaneousInvoiceController` و`LimousineInvoiceController` و`TransportationInvoiceController` مواردها الأصلية. نبه العامل الجذر إلى اختلاف aliases السابقة في مصدر الموافقات، ويعتمد الدمج النهائي على تصحيحها إلى موارد الشاشة. أما فاتورة الدفعة الضريبية فقراءتها الحالية من مسارات Invoice المتخصصة وتُراجع بمنحة `Invoice.GetTaxAdvance`.

لم يظهر حوار `Approval Status` أصلي في القوائم المملوكة بهذه الدفعة. تحتوي قوائم النقد والتحويل والأنواع المالية على إجراءات اعتماد تشغيلية خاصة بها. أضيف إليها إجراء عرض المراحل المركزي بواسطة المالك نفسه، مع استمرار ملكية أفعالها الأصلية في مصدرها الحالي.

## مطابقة المرجع والقواعد

قُرئ مدخل تحليل Speed ثم شروحات الشاشات المؤرخة في `sidebar/18-vouchers/screens/01-invoices.md` و`02-credit-notes.md` و`03-debit-notes.md` و`14-salary-vouchers.md` و`16-provisions-provisions.md` و`21-traffic-fines.md`، وشروحات البنوك `sidebar/19-banking/screens/02-cheques-receivables.md` و`03-cheques-payables.md` و`06-cash-deposits.md` و`07-card-transactions-bank-transfers.md`.

ثم قُرئت مراجع الكود المنفصلة `C1336` و`C1263` و`C1278` و`C1436` و`C1389` و`C0826` و`C0631` و`C0617` و`C0607` و`C0642` لإثبات مداخل العرض والاعتماد والعمليات. المرجع يثبت وجود الإجراءات في الواجهة ويحتاج عقد Sigma الحالي لتحديد المستويات والصلاحيات والأثر. قُرئ مدخل Odoo المكمل، ولم تبق فجوة في هذا الربط تتطلب تبني قاعدة منه. لا يثبت مرجع واجهة توقيت قيد مالي.

اتبعت الإضافة `UI7` في `ActionList` ومالك جدول البيانات، و`UI26` في إذن العملية الحالي وإعادة التحقق عند التنفيذ، و`UI2/22/29` في القراءة المباشرة ومالك النافذة والتحقق المصدري. اختيارات التقارير والتصدير وحقول الشاشة تتبع مصدرها الحالي. لا تضيف هذه الدفعة استعلامًا أو فهرسًا أو مخططًا للبيانات. قياس زمن فتح النافذة وخطة SQL يحتاج القبول التشغيلي المشترك.

## التحقق والتسليم

اجتاز `git diff --check` نطاق الملفات المملوكة بهذه الدفعة. حُفظت تعديلات المستخدم والأعمال المتزامنة الموجودة في الملفات. لم يُشغّل العامل بناءً أو اختبارًا أو متصفحًا أو قاعدة بيانات أو أمر commit. يتولى الجذر تجميع Angular بعد دمج المالك المشترك وسجل المتابعة العام.

حُدّثت أدلة الواجهة المالكة في `invoice-guide.ts` و`billing-guide.ts` و`customer-deposits-topic.ts` و`provisions-topic.ts` و`salary-vouchers-topic.ts` و`note-documents-topics.ts` و`linked-account-guides.ts` و`record-list-topics.ts`. تستهلك النص المشترك `APPROVAL_STATUS_QUESTION` الذي يملك الجذر تعريفه، مع توضيح فرق هوية السند التاريخي ومسير الرواتب الحالي. تحفظ أدلة المعدات والنقل والليموزين أسئلة الموافقة المشتركة التي أضافها العمل المتزامن.

يحتاج القبول حساب عرض فقط لكل مورد، وحسابًا مؤهلًا للمستوى بالمستخدم وبالدور، وسحب المنحة أثناء فتح النافذة، وتبديل الشركة أو الفرع، وبدء محاولة ثم تقدم المراحل ورفضها مع سبب، والتحقق من بقاء هوية الفاتورة الصحيحة في قائمة الدفعات الضريبية ومساحة Billing.
