# عقد واجهة تقرير فواتير مندوب المبيعات

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-11-18 |
| Scope | Reports/SalesPersonInvoices — UI07 / BE17؛ واجهة ونقل ومصادر الفواتير، قرار CNAMT/status منفصل معلق |

طلب المالك تنفيذ مراجعة وإصلاح وفق Sales Person Invoices Report/1.png. الأعمدة بالترتيب الدقيق: invoiceNo/salesPerson/date/agreementType/contractNo/invoiceType/customer/startDate/vehicle/category/amount/vat/total/cnamt/status. النوع الأول نوع العقد والثاني نوع الفاتورة؛ key هوية خارج العرض فقط، لا tree أو عمود فرع أو ملاحظات. كل عملة CurrencyId/Code/DecimalPlaces/Rows وتوتال الخادم totalAmount/totalVat/grandTotal/totalCreditNotes خارج الصفوف. المال string exact، التواريخ ISO string أوnull، النصوص string. المخرجات نفس الأعمدة15 كاملة، لا جمع عملات أو تضاعف فاتورة بسبب تفاصيل متعددة.

المرشحات الثلاثة DateRange اليوم المحلي افتراضيًا + SalesPersonId nullable مع موظفين حقيقيين من المصدر المسموح + InvoiceTypes multi-select nullable/[] الكل؛ الاحتفاظ بالقيمة0. خيارات الأنواع الحالية: Rental RNT0، Lease LES5، Limousine LMO1، Transportation TRA6، Miscellaneous MIS7، Workshop WKS15، AdvanceTax ATI16، Equipment EII11. هذا mapping صريح لأنواع CLR الحقيقية، لا قائمة Standard/CreditNote/DebitNote غير المتعلقة بهذه الفواتير. لا فلاتر أو أنواع تجارية غير مخزنة. الإجراءات Report(طباعة)/Excel/Refresh. صف مرشحات وأزرار واحد عند السعة، يلتف عند ضيق العرض، والجدول يملأ المساحة بصفحات ثابتة أسفلها وتمرير صفوف داخلي، وطباعة flow كامل.

النقل Result<SalesPersonInvoicesReportVm> fromDate/toDate/sections. GET SalesReports/SalesPersonInvoicesReport وSalesPersonInvoicesReportOptions بمنحة SalesReports.SalesPersonInvoicesReport، GET SalesPersonInvoicesReportPrint بمنحة قراءة+SalesPersonInvoicesReportPrint، GET SalesPersonInvoicesReportExportData بمنحة قراءة+SalesPersonInvoicesReportExport. البحث fromDate/toDate/salesPersonId/invoiceTypes بأسماء backend القائمة بلا Id للأنواع، تتكرر invoiceTypes في query. Options يعيد salesPersons كـid/name فقط. المكون والخدمة والأسماء القائمة محفوظة وربط DI والمسار القائم Reports/SalesPersonInvoices محفوظ وفق route الفعلي؛ يتحقق الجذر من التهجئة قبل الإضافة. createReportReadState يملك التحميل العام والإلغاء والجلسة والمخرجات، الخيارات التشغيلية مباشرة بلا cache مستحدث. مصدر enum محلي مترجم. namespace salespersonInvoices، access salespersonInvoicesAccess.

المصدر سجل الفواتير المحفوظة الحالية من InvoiceBase الحقيقي بأنواعه السبعة والفصل الفرعي Workshop، وليس تقرير اعتراف الإيراد ولا نسخة SaleReport. يبقى نطاق الفواتير المحفوظة الموجود في المصدر الحالي، مع استبعاد القيد المبطل/المحذوف؛ لا نفرض posted-only على هذا السجل لأنه يمنع Transportation التي لا يكتب مسارها الحالي قيدًا. Amount/Tax/Total محفوظة ومطابقة وبدقة العملة قبل/ضريبة/شامل، لا أسعار العقود الحالية ولا تغيير مالي في المصدر. Rental رأس واحد حتى للفواتير المجمعة؛ تفاصيل العقد/المركبة من رابط وحيد مثبت فقط، ولا تخمين سجل كامل لمستخدم يرى جزءًا من فروعه. المصدر QueryReport مع فرع whole-document لهذا التقرير رأس-الفاتورة (ليس مبلغ رأس كامل ضمن report-effects جزئي)، وscope يدوي Partner/Staff عند الحاجة. invoiceNo هوNo لاId. العلاقة/الفترة غير المثبتة تبقى فارغة بدل open/closed أو vehicle تخمينية.

الدليل Speed chapter16 ثم C1057/application.js281330–281707، routeR0444:4800، القالب structural-only hash18dcaf5a795f65b93731e3ca0e02ac6532c5a755e98362bc3c0590b383208851. يثبت multi-select والمرشحات والأفعال لا قاعدة CNAMT. مرجع Odoo19 customer_invoices/credit_notes ثم payments مكمل فقط. قرار مبلغ الإشعار الدائن والحالة معلق بسؤال المالك؛ يمكن تنفيذ الواجهة والنقل وقراءة رؤوس الفواتير دون تجميد حسابهما. لا تأويل صامت أو تجاهل للسؤال عند التأخير.

ملكية العمل: عامل الواجهة مجلد SalesPersonInvoices فقط، الجذر كل الخلفية والترجمة والدليل والربط والآثار. بناء scoped مسموح، لا tests/lint/browser/serve/DB/commits. لا دخول port4200؛ أوقفه المالك. لا إضافة ملفات بيانات الدليل/الترجمة/models/access/presentation إلى tsconfig roots؛ imports هي المالك، ويضاف component root فقط إن شخّص compiler حاجة فعلية. الحفاظ على كل العمل السابق في الريبوين.


حُسم قرار CNAMT والحالة لاحقًا باعتماد المالك، وفق [العقد المالي](SALESPERSON_INVOICES_FINANCIAL_CONTRACT_FREEZE.md). يظل CNAMT وإجماليه قابلين للفراغ فقط عند تعذر إثبات التسوية. رمز LES يعرض Lease Invoice مقابل Lease لنوع العقد. حقلا التاريخ يعرضان الساعة والدقيقة.
