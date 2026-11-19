# عقد تقرير أنواع مصروفات المركبات

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-11-18 |
| Scope | Reports/VehicleExpenseType · UI07 · BE17 · Tier M |

طلب المالك مراجعة الصورة وتنفيذ التقرير. تأكد في الرد الحالي أن المصروفات المرتبطة بمركبة فقط تدخل التقرير حتى دون اختيار فلتر المركبة. يستمر أساس الحساب المعتمد في تقرير Vehicle Expense: قيود مرحّلة غير ملغاة، حساب Expense، Debit−Credit بعملة الأساس. لا أرصدة دائنين أو دفعات تسوية تُعاد كمصروف، ولا ارتباط تخميني بتعريف ExpenseType. مصدر القيود والتحقق المالي مشترك مع تقرير الملخص داخل VehicleExpenseReportService، ولا يتغير سلوك الملخص.

المرشحات: Date Range إلزامي يبدأ بالشهر الحالي، وVehicle اختياري numeric vehicleId، وExpense Type اختياري numeric accountId من حسابات المصروف، وSupplier اختياري numeric supplierId من Supplier، وDescription نص اختياري trimmed بحد500. تتبع خيارات المركبات والموردين والمصروفات نطاق QueryReport الحالي. اختيار مبلغ أو هوية غير موجودة ضمن الخيارات المسموحة يرفض كمرشح غير صالح. البحث بالنص Contains في وصف سطر القيد نفسه، وليس ملاحظة غير مرتبطة.

أعمدة الصورة الاثنا عشر بالترتيب: Date، Voucher No، Agreement No/Notes، Supplier Bill No، Type، Plate No، Contact، Branch، Expense Type، Payment Method، Description، Expense. لا عمود Revenue من نسخة Speed الأقدم، ولا كروت أو شروحات أو أعمدة مالية إضافية. لكل صف journalLineId للهوية فقط. اسم النوع هو اسم حساب المصروف وكوده، وType نوع القيد الحقيقي عبر المترجم المشترك. الفرع هو الفرع الفعلي للسطر ثم رأس القيد عندما يكون فارغًا. رقم اللوحة من المركبة المرتبطة المحفوظة الحالية ضمن النطاق.

لا يُستنتج مصدر من تشابه الرقم أو آخر مستند للمورد. بيانات المستند تُقرأ فقط من JournalVoucherId ونوع القيد المطابقين ومن علاقات المصدر المحفوظة: Bill.SupplierBillNo، وPayment.Note/PaymentMethodId، وأرقام عقود الفاتورة أو الإشعار/ملاحظاتها عند وجود علاقة، وملاحظات مردود المشتريات. Contact من PartnerId الصريح للسطر، ثم جهة مصدره الفريد. مرشح Supplier يستخدم الهوية نفسها بعد هذا الترجيح. مصادر المستند المتعارضة لا تُختار عشوائيًا ولا تُضاعف صف القيد؛ تظل البيانات الإضافية فارغة عند غياب مصدر فريد. لا يستخرج التقرير طريقة الدفع لفاتورة من تخصيصات سداد متعددة.

توضيح العرض بعد تتبع المالك: NewJV/SaveJV يولد رقم قيد مستقلًا عن رقم مستند المصدر. لذلك Voucher No يعرض source.No عند وجود مصدر وحيد مطابق؛ إذا لم يوجد مصدر وحيد فهو رقم القيد ذاته. لا يعوض رقم مصدر مفقود برقم آخر داخل مصدر موجود. هذا قرار عرض مدعوم بمصدر Sigma؛ Speed C1084 لا يثبت مالك الرقم وحده. مطابقة أنواع الفواتير تتبع InvoiceAccountingService.ResolveMetadata وتعزل نوعَي الفاتورة المتنوعة والنقل، فلا يكفي وجود نوع قيد من عائلة الفواتير لقبول أي فاتورة مرتبطة.

الاستجابة كاملة دون ترقيم خادم: `{ rows: [{ journalLineId, date, voucherNo, agreementOrNotes, supplierBillNo, type, plateNo, contact, branch, expenseType, paymentMethod, description, expense: decimal-string }], currencyCode, decimalPlaces }`. ترتيب date ثم journalId ثم journalLineId. DataTable يملك الفرز/الترقيم المحلي من المجموعة الكاملة، والصفحات مثبتة في قاع الجدول. المرشحات وأزرار Refresh وExport to Excel في مساحة ثابتة متجاوبة. لا زر طباعة مضاف للصورة؛ قناة Print الداخلية لمالك التقرير غير مستعملة ولا تُرسل إلى الخادم.

المسارات GET هي `VehicleExpenseTypeReports/Read` و`Options` و`Export`. Read وOptions لهما منحة `VehicleExpenseTypeReports.Read`، وExport له منحة مستقلة مع اشتراط Read. كلها ReportEffects لملكية فرع السطر مع بقاء نطاق المركبة الحالي. ترجع Options `{ vehicles: [{id,name}], expenseTypes: [{id,name}], suppliers: [{id,name}] }`. يملك createReportReadState طلب الخيارات والقراءة والتصدير، التحميل العام والإلغاء وتغير الجلسة والمنح والفلاتر. الخيارات قراءة مباشرة خاصة بالتقرير، بلا تسجيل مصدر ذاكرة مرجعية أو Cache مالي.

الصفحة `/Reports/VehicleExpenseType` تستبدل رابط Vehicle Expense Type الخاطئ إلى `/Vehicle` ضمن المجموعة الحالية. التصدير يعيد قراءة كل الفترة المطبقة بأعمدة الصورة فقط وبنفس الدقة. لا كيان تقرير أو تعديل بيانات أو مخطط أو هجرة. تُحدّث الترجمتان ودليل Reports في التطبيق ومداخل tsconfig.app الصريحة قبل البناء.
