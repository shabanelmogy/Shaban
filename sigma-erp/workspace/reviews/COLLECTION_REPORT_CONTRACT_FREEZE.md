# عقد تقرير التحصيل

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-11-17 |
| Scope | Tier M — UI07/BE17; review and implement per owner screenshot; root integration |

طلب المالك مراجعة التقرير وضبطه وإمكان تقسيمه إلى تابات. التصميم: عنوان Collection Report؛ الفترة وفرع السند وفرع عقد الإيجار ومندوب مبيعات عقد الإيجار ومنشئ السند؛ Search/Print/Excel. تاب Collections بالأعمدة Voucher Type/Voucher No/Date/Customer/Agreement No/Payment Method/Amount، وتاب Payment Methods بالأعمدة Payment Method/Amount. لا نصوص شرح إضافية داخل الجدول ولا زر Retry منفصل؛ الرسائل compact في الفلاتر، وSearch يعيد القراءة. عند عدة عملات تعرض الأقسام منفصلة بعناوين العملة وإجمالياتها دون جمع عملات مختلفة. الطباعة تعرض التابين كاملين؛ Excel يصدر التاب الحالي كاملًا لكل العملات وإجماليات الخادم.

## دليل المصدر والقرار المالي

الصورة 1.png والمرجع Speed بتاريخ2026-10-28 شاشة Reports08/R0414/C0977 يثبتان الفلاتر والجدولين والإجراءات. راجع شرح فصل11 وفصل16، ثم C0977؛ لا شرح أصلي مطابق بعنوان Collection في فهرس27 أكتوبر. Odoo19 payments.rst مفهوم مكمل: القبض مستقل عن تخصيصه وفاتورته، والشيك المسجل ليس بحد ذاته تحصيلًا بنكيًا.

سألنا المالك عن نطاق القبض والودائع فطلب الرأي الأنسب. بيّن المصدر CustomerDeposit أنه wrapper له ReceiptId أو PDCReceivableId أو OpeningBalanceDepositId. لذلك الاختيار المصدرّي الصحيح هو سندات Receipt الحية المعتمدة وغير الملغاة ذات قيد مولد مملوك من نوع Receipt/JV مرحل وغير ملغى وبنفس الشركة والفرع والتاريخ والعملة. يشمل DepositReceipt مرة واحدة من سنده؛ لا union مع CustomerDeposit ولا تكرار للتخصيصات ولا احتساب PDC أو افتتاحي أو حجز بطاقة من سجل الودائع. لا تعديلات محاسبية/بيانات/مخطط. لا يُدّعى صافي تسوية بنكية أو إيراد أو تحصيل نقدي لشيك لم يتحقق.

تعرض Amount الأصلية قبل عمولة البطاقة أو ضريبتها. العملة ودقتها من CurrencyRateUsage المحفوظ والمطابق للشركة وSourceGuid/SourceType=Receipt؛ لا ترقية بيانات تجريبية أو تخمين عملة حالية. فقدان الدليل/تعارض الدقة يجعل التقرير يفشل برسالة مفهومة بدل إخفاء سطر أو اختراع مبلغ. إجماليات backend exact decimal strings، مجمعة حسب currencyId/code/precision؛ عدد وهويات صحيحة. يجوز جمع المجموعة الكاملة المقبولة مرة واحدة بالخادم بعد الإسقاط المالي لتبقى الصفوف والإجماليات من القراءة نفسها، كمالك VehicleProfitLoss القائم؛ لا جمع صفحات بالواجهة.

## API مجمد

تضاف خدمة ICollectionReportService (غير CRUD) ومتحكم CollectionReports بأفعال GET Read/Options/Print/Export ومنح صريحة مسماة كذلك. Options يحتاج Read فقط عبر prerequisite؛ Print وExport يحتاجان منحة مستقلة وRead. جميعها QueryReport بنطاق تقرير الفروع. لا منح تلقائية أو طلب خدمات Branch/Staff/User CRUD لمجرد مرشحات التقرير. تسجيل الخدمات بالـassembly scan القائم.

Filter: fromDate/toDate required days, branchId?/agreementBranchId?/salesPersonId? positive int, createdBy? stored string<=50. الفترة شاملة ليوم النهاية بحد نصف مفتوح، default الشهر الحالي في UI؛ النهاية أقل من31/12/9999. لا إضافة يوم بالواجهة أو timezone. branchId لReceipt؛ AgreementBranch وSalesPerson لعقد الإيجار المحفوظ فقط؛ لا تخمين salesperson لعقد بيع لا يملكه. AgreementNo يعرض Rental Agreement أو SalesAgreement المحفوظين المسموحين، وإلا فارغ. Contact ثم Customer كما Receipt.Read مع QueryReport ownership، لا نص من علاقة خارج النطاق.

Result<CollectionReportVm>: fromDate:string,toDate:string,sections:CollectionCurrencySectionVm[]. Section: currencyId:int,currencyCode:string,decimalPlaces:int,total:decimal-string,rows:CollectionRowVm[],paymentMethods:CollectionPaymentMethodVm[]. Row: id:int,voucherType:int (ReceiptType),voucherNo:string,date:date,customer:string,agreementNo:string,paymentMethodId:int?,paymentMethod:string,amount:decimal-string. PaymentMethod: key:string,paymentMethod:string,amount:decimal-string. تسمية ReceiptType مترجمة بالواجهة. تشمل summary طرق الدفع الحية المسموحة كلها بما فيها الصفر، وطريقة غير متاحة موحدة للمفقود، مع حفظ receipt.PaymentMethodId للتمييز حتى مع أسماء مكررة.

Result<CollectionReportOptionsVm>: branches:{id:number,name:string}[],agreementBranches:نفسه,salesPersons:نفسه,creators:{id:string,name:string}[]. الخيارات مشتقة من سطور القبض المؤهلة المسموحة عبر QueryReport وليست قراءة عامة للمستخدمين/الشركاء؛ createdBy يطابق القيمة المخزنة حرفيًا. لا cache جديد أو watch أو lookup مرجعي مفترض.

## UI والعمر والمخرجات

توضيح فرع العقد بعد تتبع المالك: لا يملك Agreement تاريخيًا BranchId مستقلًا؛ BranchScopeRegistry:91 وRentalAgreementService filter/projection يعرّفانه بواسطة Vehicle.BranchId الحالي. يعاد استعمال هذا المالك نفسه، ويبين الدليل أن Agreement Branch هو فرع مركبة العقد الحالي، وليس فرع فتح تاريخيًا مخمنًا. لا schema أو backfill.

typed standalone/shared ReportPage, FeatureTitle, EditorTabs, DataTable, ReportActions, FieldError, StateMessage.compact. النتائج كاملة وlazy=false، التمرير الداخلي في pane واحد للتاب عند أقسام العملات المتعددة. كل قسم يملك جدولًا مشتركًا دون scroll داخلي منافس. Print يستعمل ReportPrintSession مع printAllRows وكل الأقسام في DOM وإخفاء التاب غير النشط للشاشة فقط. Excel يقرأ endpoint Export كاملًا ثم يصدّر التاب النشط المحفوظ وقت الطلب بالملاك والأعمدة أنفسها، لا الصفحة/فلاتر الجدول المحلية.

التمهيد المطلوب للخيارات وقراءة التقرير والطباعة/التصدير التي تجلب بيانات تملك تقدم الصفحة المشترك مع defer/finalize. لا طلبين مكررين للفروع أو loading inline. كل عملية تقبل Result/HTTP error وتبقي الفلاتر وتتيح إعادة نفس الإجراء. يمنع التنفيذ المكرر. تغير الجلسة/السياق/إصدار المنح أو الفلاتر يلغي القراءات والنتائج والطباعة المنتظرة والتنزيل القديم؛ destruction يحرر كل اشتراك. لا cache مالي. يحدّث دليل Reports باللغتين.

## التنفيذ والتحقق والتفويض

متابعة ضمن تقرير التحصيل والمرتجعات: يفصل القارئ المشترك سند استعمال الوديعة عن التحصيل الفعلي عبر `CustomerDepositUsage.ReceiptId`. العملية تحرر التزامًا قائمًا وتسوي ذمة العميل، ولذلك تستبعد من القراءة والخيارات قبل التحقق من العملة. سند أصل الوديعة يدخل مرة واحدة.

الجذر يملك الواجهة والترجمات وسياسة المسار والدليل والوثائق والمصالحة. يجوز تفويض الخلفية وملفات مواصفاتها فقط لوكيل مستقل بعد هذا العقد، مع حفظ تغييرات الزملاء. لا tests/lint/browser/migration/commit/push/deploy. scoped backend/test build وAngular compile مسموحان؛ SQL الفعلي والتوقيت والقياس/الثيمين/RTL/Excel/المتصفح قبول معلق. لا schema/index جديد دون خطة SQL؛ راجع index القائم للفترة والفرع والقبض والقيد، وسجل نتائج المصدر وحدودها.
