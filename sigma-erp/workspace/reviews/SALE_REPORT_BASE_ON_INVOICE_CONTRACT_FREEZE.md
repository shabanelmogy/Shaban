# عقد تقرير المبيعات حسب الفاتورة

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-11-18 |
| Scope | SaleReportBaseOnInvoice — UI07 / BE17 |

طلب المالك مراجعة وإصلاح التقرير طبقًا لصورة Sale Report Base On Invoice/1.png. الكتابان UI7/UI20/UI22/UI26 وBE17/BE15/BE9، ومرجع StatementOfAccount وشركاء ReportPage/ReportActions/DataTable هم مالكو التنفيذ. تم فحص Speed chapter16/controller C1054 (application.js280781–281030، routeR0443)، ثم مرجع Odoo19 credit_notes لتفسير الدائن/المدين؛ واجهة Speed تثبت الحقول لا الحساب الخادمي.

العرض مسطح بالأعمدة الخمسة عشر وبنفس الترتيب: agreementNo, voucherNo, voucherType, status, startDate, endDate, quantity, vehicle, customer, accountDescription, branch, saleOrigin, type, revenue, salePerson. الهوية key فقط خارج العرض. الإجمالي من الخادم تحت revenue؛ لا ملاحظات أو أعمدة أو tree إضافية. العملة عنوان قسم مستقل؛ لا جمع عملات. لا ترقيم الصفوف ضمن البيانات. شريط الصفحات ثابت بأسفل منطقة التقرير مع تمرير الصفوف داخليًا. الطباعة والتصدير لكل النتائج بالأعمدة نفسها.

الفلاتر: fromDate/toDate اليوم المحلي افتراضيًا، contactType nullable=Individual0/Company1، ownership nullable=Own0/External1/BuyBack2. null الكل وصفر قيمة حقيقية. لا فلاتر مخترعة ولا طلب فروع أو شركاء عند الدخول. إجراء Report هو الطباعة، ثم Excel وRefresh. البيانات لا تحمل تلقائيًا قبل البحث. دورة createReportReadState للصلاحيات/الإلغاء/تحميل الصفحة/الإخراج؛ الخيارات enums محلية مترجمة لا cache أو HTTP إضافي.

النقل GET SalesReports/SaleReportBaseOnInvoice، SaleReportBaseOnInvoicePrint، SaleReportBaseOnInvoiceExportData. منحة القراءة القائمة SalesReports.SaleReportBaseOnInvoice، منحتي الطباعة والتصدير SaleReportBaseOnInvoicePrint / SaleReportBaseOnInvoiceExport مع شرط القراءة. كلها Result<SaleReportBaseOnInvoiceVm> ومصدر خدمة واحد. الاستجابة fromDate/toDate/sections؛ كل section currencyId/currencyCode/decimalPlaces/rows/totalRevenue. الصف key/voucherNo وسائر النصوص strings، startDate/endDate nullable، quantity int يوم تقويمي، revenue نص مالي exact، المجاميع exact. تبقى أسماء المكون والخدمة الحالية لكيلا يكسر provider/route. لا migration أو writes.

المصدر المالي صافي المستندات المرحّلة ضمن تاريخ المستند قبل VAT، بفصل العملة والتحقق من الحالة والمراجع: الفاتورة Invoice Rental/Lease المرتبطة بقيد generated/posted/approved/nonvoid المناسب لتاريخها وفرعها وعملتها؛ RentalInvoiceItem التاريخي لكل بند (Amount قبلTax) مع مطابقة مجموع البنود لرأس الفاتورة ورفض evidence غيرسليم، وLease مبلغ الرأس الصافي وربط العقد المحفوظ المميز الذي يفرضه كاتبه. لا اختيار TotalAmount كبديل ولا إعادة احتساب من أسعار العقد الحالية. مستند الدائن/المدين العميل فقط nonvoid/approved وبقيده الصحيح؛ تفاصيل الإيراد الفعلية Account.Category.Revenue من JournalVoucherDetail الأصلية CurrencyCredit-CurrencyDebit، لا VAT/AR ولا إعادة حساب من تخصيصات قد تكرر القيد. المتحصلات/سندات القبض/رد الوديعة خارج التقرير. لا تغيير دلالة SaleReport السابق الذي يستبعد الإشعارات المنفصلة. لا توافق مع بيانات تجريبية ناقصة currency أو قيد.

المعلومات من الروابط المسموحة QueryReport، مع scope يدوي لـPartner/Staff إن لم يطبقه المرشح، لا أسماء فروع أو عملاء خارج النطاق. مركبة الفاتورة من VehicleId المحفوظ، لا plate join؛ رقم لوحتها المحفوظ. ربط إشعار الاتفاقية من AgreementId المحفوظ إن وجد فقط، لا توزيع تخميني لإشعار عام على عقود العميل. دون رابط يظل العقد/الفترة/النوع فارغًا والكمية صفرًا؛ فلتر ملكية المركبة يختار ما ثبتت مركبته فقط. وصف الحساب للإشعارات من حساب الإيراد المرحّل، وللفواتير Rent/Fine/Salik/Darb بحسب نوع البند المحفوظ؛ لا اختراع GPS/BabySeat غير المحفوظة في مولد Sigma الحالي. سجل هذه الفجوة في المراجعة/الدليل، دون شرح داخل الجدول.

ملكية التنفيذ: الجذر الخلفية والصلاحيات والترجمة والدليل والربط والآثار، عامل واجهة مستقل مجلد SaleReportBaseOnInvoice فقط بعد تجميد هذا العقد. البناء مسموح، الاختبارات والتطبيق والمتصفح غيرمشغلة. لا فصل عمل جديد أو تغيير بيانات تجريبية مطلوبة. المصدر في الريبوين يحوي عملًا سابقًا يجب حفظه.

إيضاح المصالحة18 نوفمبر: الفاتورة المجمّعة تتطلب تحقق مبالغ كامل المصدر في probe معزول bounded tenant/live/authorized invoice IDs، بينما تظل الصفوف والإجمالي المرئي من QueryReport فقط. يحقق هذا العقد المالي دون إسقاط البنود المسموحة لكون المستخدم لا يرى فرعًا آخر. لوحة Lease هي invoice.PlateNo المحفوظة، ومصدر بيع Lease غير المحفوظ فارغ صراحةً في طرف Concat.
