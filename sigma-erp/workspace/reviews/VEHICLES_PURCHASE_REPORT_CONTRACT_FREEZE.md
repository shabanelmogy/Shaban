# عقد تقرير مشتريات المركبات

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-11-18 |
| Scope | Reports/VehiclesPurchase · UI07 · BE17 |

طلب المالك تنفيذ المراجعة والتصحيح وفق Vehicles Purchase Report/1.png. اعتمد الجدول المسطح بخمسة أعمدة بالترتيب plateNo/date/paymentVoucherNo/billVoucherNo/paymentMethod، وkey هوية مخفية. Date هو يوم فاتورة الشراء Bill.Date كما تدل تكرارات التاريخ مع سندات مختلفة. لا حقول مال أو ملاحظات أو تذييل إجماليات. الصفحات ثابتة بقاع الجدول والصفوف تمر داخليًا، وتعود الطباعة إلى التدفق الكامل.

أربع مجموعات مرشحات في صف متجاوب: Date Range مع اختيار تفعيل مستقل داخل الحقل كما في الصورة وC1098، معطّل افتراضيًا، القيمة المرئية اليوم المحلي. من دون التفعيل ترسل fromDate/toDate=null وتعني جميع التواريخ. عند التفعيل مطلوب تاريخان صالحان ويشملان يوم النهاية. Plate No وPayment Voucher No وBill Voucher No اختيارية كنص جزئي trim بطول أقصى 100. Refresh وExport to Excel وPrint عبر المكونات المشتركة. يبدأ العرض بالبحث الصريح. الطباعة وExcel كاملان بنفس المرشحات المطبقة. الخيارات محلية دون GET تمهيدي.

GET VehicleReports/VehiclesPurchase وVehiclesPurchasePrint وVehiclesPurchaseExport. النتيجة Result<VehiclePurchaseResponse> من {rows:VehiclePurchase[]}، الصف key وplateNo/date/billVoucherNo نصوص وpaymentVoucherNo/paymentMethod نصوص تقبل null؛ date يوم ISO yyyy-MM-dd. الطريقة من اسم PaymentMethod المحفوظ، أو رمز PaymentType المترجم إذا لا مرجع مختار، والتمويل رمز Loan. في الواجهة namespace vehiclePurchaseReport ومالك grants vehiclePurchaseAccess: VehicleReports.VehiclesPurchase، VehicleReports.VehiclesPurchasePrint وVehicleReports.VehiclesPurchaseExport والقراءة شرط للمخرجات. المسار القائم ومكون VehiclePurchaseComponent وخدمة VehiclePurchaseReportService محفوظون. تبنّي createReportReadState ودليل التقارير. ملفات المساعدة والدليل والترجمة تدخل بالاستيراد دون جذور إضافية.

السجل يعرض فاتورة أصل ذات BillDetail.VehicleId لمسار AssetBill/AssetGRNBill، ويأخذ اللوحة من المركبة الحية المسموحة. فاتورة معتمدة وقيد Bill مولّد مرحّل معتمد غير مبطل مطابق للمستأجر والفرع والتاريخ والعملة. لكل مركبة/فاتورة صف لكل Payment مثبت في تخصيصات القيد الفعّالة على طرف المورد، أو رابط قسط/دفعة مقدمة من المالكين BillInstallmentPayment/BillLoanDownPayment مع قيد دفع صالح. يجمع التطابق حسب BillId/VehicleId/PaymentId مرة واحدة. البنك الممول يظهر كطريقة Loan إذا الفاتورة تمويلية وخطة القرض مثبتة ومبلغ التمويل موجب، ورقم سند الدفع فارغ لسطر القرض. الفاتورة بلا دفع أو تمويل ظاهر تبقى في السجل ببيانات الدفع فارغة. عند فلتر سند دفع يعرض صفوف الدفع المطابقة وحدها. لا تخمين حسب رقم مرجع أو لوحة أو طرف مورد مشترك، ولا احتساب لقيمة مخصصة لكل مركبة. السند المسموح نطاقه محفوظ في QueryReport؛ قارئ مفعول الفروع لا يمرر قيود بنود خارج النطاق. تعتمد علاقات التسوية الحالية ولا تُقيّد بتاريخ الدفع.

Speed فصل16 والكود المؤرخ C1098 raw/application.js:290385–290546 وR0344:4014. لا شرح مستقل في فهرس المصدر. دليل Odoo المحلي vendor_bills وpayments يكمل تمييز المستند عن عملية الدفع؛ لا يثبت معادلة خاصة في Sigma. مصدر حسم الاقتران BillDetail وBillService.Allocation وInstallmentPayments وDownPayments. لا migration أو تعديل بيانات مطلوب. الجذر يملك الخلفية والربط والترجمة والدليل والمراجعة. وكيل الواجهة يملك مجلد VehiclePurchase فقط. البناء مسموح؛ لا اختبارات تشغيل أو متصفح أو serve أو قاعدة بيانات أو commits.
