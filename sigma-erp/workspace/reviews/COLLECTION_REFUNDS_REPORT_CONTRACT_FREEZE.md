# عقد تقرير التحصيل والمبالغ المرتجعة

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-11-17 |
| Scope | UI07/BE17؛ تنفيذ التقرير وفق الصورتين وطلب التابات |

## النطاق والمحتوى

المسار القائم /Reports/CollectionAndRefunds والمكون/الخدمة القائمان يستبدلان في موضعهما؛ CollectionAndRefunds2 خارج النطاق. العنوان Collection And Refunds Report، والفلاتر Date Range/Branch/Agreement Branch/Sales Person/Created By كما عقد Collection المعتمد، وتقدم الصفحة والخطأ المختصر وعمر الصلاحيات نفسه. ستة تابات: payment-types/payment-methods/collections/refunds/cheques-receivables/cheques-payables. الملخص ثابت خارج الجدول: Net Amount/Collection Amount/Refunds Amount لكل عملة دون جمع العملات. لا شرح طويل في الجدول.

الأعمدة: Payment Types = Payment Type/Collection Amount/Refunds Amount؛ Payment Methods = Payment Method/Collection Amount/Refunds Amount/Net Amount؛ Collections = Voucher Type/Voucher No/Date/Customer/Agreement No/Payment Method/Amount؛ Refunds = Voucher Type/Voucher No/Date/Customer/Payment Method/Amount؛ كل جدول شيكات = Voucher No/Cheque No/Cheque Date/Bank/Customer/Amount. typed DataTable وEditorTabs/ReportPage/ReportPrintSession القائمة؛ الأقسام كاملة، lazy=false، الطباعة تشمل التابات الستة بجميع الصفوف، وExcel التاب الحالي كاملًا. يدعم المخرج شيكات فقط بلا تحصيلات نقدية.

دليل Speed: فصل11/16 من شرح27 أكتوبر ثم Reports09/R0419/C0976 بتاريخ28 أكتوبر؛ الصورتان دليل الحقول لا صحة الأرقام أو الخادم. لقطة Odoo19 payments.rst توضح أن الشيك المسجل ليس تسوية بنكية وأن الدفع ليس تخصيصًا. يُستعمل المصدر المحاسبي الحقيقي في Sigma. مثال مبالغ طرق الدفع بالصورة لا يتطابق مع إجماليها العام؛ لا تُنسخ الأرقام أو معادلة متناقضة.

## المصدر المالي الصحيح

القبض من ICollectionReportService.ReadAsync نفسه، بلا نسخة قارئ منافسة وبلا منحته HTTP الإضافية: Receipt المعتمد غير الملغى والقيد المولد المرحل/الحسابات/المبلغ ودليل العملة كما العقد المعتمد. DepositReceipt يُحسب مرة واحدة، لا union للوديعة أو التخصيص. لا تعديل معادلته أو شروطه.

الردود من RefundDepositCoreAsync الفعلي فقط. لا يملك Payment العام سببًا يثبت أنه رد عميل؛ لا يسمى صرف المورد/الراتب ردًا لمجرد أنه Payment. يوجد عيب مصدر مؤكد: CustomerDeposit.JournalVoucherId يستبدل آخر قيد، وUsedAmount يجمع استعمال/رد، وPaymentMethodId/Date للرد غير محفوظين كأحداث؛ لذلك لا يمكن تقرير الردود الجزئية السابقة بأمان من القديم ولا بتفكيك وصف القيد. الحل clean-start سجل CustomerDepositRefund مستقل لكل عملية رد ناجحة في المعاملة نفسها، لا reader نصي/تخمين/ترميم بيانات تجريبية.

الحدث الجديد يحفظ CustomerDepositId/JournalVoucherId فريد/Date/BranchId/CustomerId/AgreementId?/PaymentMethodId?/PaymentType? وAmount وعملة الأساس CurrencyId/CurrencyCode/DecimalPlaces المحفوظة وقت الرد. المبلغ هو مبلغ الرد الفعلي في مالك base-only القائم، لا طرح UsedAmount أو إعادة تسعير. يسجل المنشئ بالـaudit القائم. FK restrict والمال(22,6) وتطابق الشركة ونطاق BranchScope وحفظ الحدث مع تحديث الوديعة/القيد داخل ExecuteUniqueWrite الحالي؛ لا API عام لتحرير الحدث أو حذف تاريخه. لا تغيير في حساب القيد أو الموافقات. قارئ التقرير يقبل أحداثًا حية مع قيدها الحي المرحل غير الملغى وملكيته/فرعه، ويطبق فترة تاريخ الرد والمنشئ والفرع والعقد المحفوظ. الروابط غير المسموحة لا تكشف labels. العملات مفصولة وdecimal-string كما FinancialNumberPolicy.SumCurrencyReadAmounts؛ التعارض يفشل ولا يخمن.

هذه زيادة schema لازمة. يجوز تجهيز entity/config/DbSet/كاتب الحدث وقارئه ومواصفاته في المصدر ضمن التنفيذ المصرح؛ لا توليد أو تطبيق migration دون طلب المالك الصريح. الاسم المقترح AddCustomerDepositRefundEvents. لا نشر/تشغيل API المحدث قبل تطبيقها؛ يبقى قبول schema معلقًا، ويُطلب الإنشاء والتطبيق بعد أن يصبح التغيير المصدري قابلًا للمراجعة. لا backfill أو حذف بيانات قديمة.

ملخص Payment Types يتبع PaymentMethod.Type المعروف في Sigma (Cash=0,CreditCard=1,DebitCard=2,Cheque=3,BankTransfer=4,CardRefund=5,Other=6)، لا ترقيم Speed المختلف. تسجل طريقة الرد/نوعها في الحدث. القبض يستخدم نوع الطريقة الحالي من هوية المصدر المسموحة؛ المفقود مجموعة unavailable بلا تخمين. كل الأنواع السبعة والطرق المسموحة تعرض صفرًا حين لا نشاط، وNet=Collection−Refunds. تجميع الهوية لا الاسم، مع بقاء صفوف مالية مقبولة إذا تغير تعريف طريقة بين قراءتين.

الشيكات أقسام مستقلة لا تضاف إلى الإجماليات النقدية، حتى لا يتكرر شيك مقابل Receipt. PDCReceivable حية غير Cancelled/Bounced وبفترة ChequeDate وBranch/CreatedBy، وتطبق فلاتر العقد عند العلاقة المحفوظة. PDCPayable للعميل CustomerId>0 وغير Cancelled، بفترة ChequeDate/Branch/CreatedBy؛ عند AgreementBranch/SalesPerson لا توجد علاقة أصلية لذلك لا تدخل صفوف بلا إثبات رابط، ولا تخمين من العميل. تعرض Pending/Cleared كشيكات مسجلة، ولا يدعى cleared cash. هي base-only في مالك الشيكات القائم بلا CurrencyId؛ root metadata للعملة الأساسية ودقتها من المالك الحالي ولا تخلط بعملات التحصيل الأصلية. لا تغيير مخطط الشيكات أو المبالغ أو حالاتها.

## API والنماذج المجمدة

متحكم CollectionRefundReports، GET Read/Options/Print/Export؛ Read منحة، Options نفس Read، Print وExport منحتان مستقلتان تتطلبان Read؛ جميع descriptors EffectReads ونطاق فروع QueryReport، route policy على /Reports/CollectionAndRefunds. لا grants تلقائية أو طلب CRUD عام.

Filter: نفس CollectionFilter {fromDate,toDate,branchId?,agreementBranchId?,salesPersonId?,createdBy?}. Options: نفس CollectionOptions وتُجمع القيم من المصادر الأربعة المسموحة، لا حصرها بالقبض إن وجدت ردود أو شيكات فقط. الاتفاقية تتبع مالك Agreement→Vehicle.BranchId الحالي لا تاريخ فتح مخمن؛ salesperson=Staff عقد الإيجار.

Result<CollectionRefundReportVm>: fromDate,toDate,sections:CollectionRefundCurrencySectionVm[],chequeCurrencyCode:string,chequeDecimalPlaces:int,chequeReceivableTotal:decimal-string,chequePayableTotal:decimal-string,chequesReceivables:CollectionRefundChequeRowVm[],chequesPayables:نفسه.

Section: currencyId,currencyCode,decimalPlaces,collectionAmount,refundsAmount,netAmount (كل مبلغ decimal-string),collections:CollectionRowVm[] القائمة,refunds:CollectionRefundRowVm[],paymentTypes:CollectionRefundTypeRowVm[],paymentMethods:CollectionRefundMethodRowVm[]. RefundRow: id:int,voucherType:string='DepositRefund',voucherNo,date,customer,paymentMethod,amount. TypeRow: key:string,paymentType:int?,collectionAmount,refundsAmount. MethodRow: key:string,paymentMethod,collectionAmount,refundsAmount,netAmount. ChequeRow: id:int,voucherNo,chequeNo,chequeDate,bank,customer,amount. مفاتيح الهوية خارج الأعمدة فقط. لا any أو شجرة.

## التنفيذ والتحقق

توضيح بعد مراجعة كاتب استعمال الوديعة: `UseDepositCoreAsync` ينشئ سند قبض مرتبطًا بسجل `CustomerDepositUsage.ReceiptId`، ويقيد تحرير التزام الوديعة مقابل ذمة العميل. يستبعد قارئ التحصيل المشترك هذا السند من التقارير الاثنين بواسطة الرابط البنيوي للشركة نفسها، قبل فحص العملة أو حساب الإجماليات. تظل الوديعة الأصلية محتسبة من سند تحصيلها. هذه معالجة لعدّ التخصيص مرتين وفق العقد المالي نفسه. لا تتغير المستندات أو القيود.

الجذر يملك الاكتشاف والعقد والترجمات والدليل والوثائق والمصالحة. عملان مستقلان بعد التجميد: الخلفية/مصدر الحدث ومواصفاته، والواجهة typed tabs ومواصفاتها؛ تحفظ التغييرات السابقة والزملاء. يعاد استعمال شكل Collection الصحيح، ويستخرج مالك lifecycle مشترك للعائلة إن أمكن دون تغيير عقود أول تقرير، بدل نسخ سياق/طباعة/إلغاء متنافس. لا tests/lint/browser/migration/commit/push/deploy. scoped builds مسموحة ومتتابعة لتجنب ضغط الذاكرة. SQL plan/index/timings والواجهة الفعلية والطباعة/Excel وRTL والثيمين قبول معلق. لا schema mutation قبل إذن migration المحدد.

## ملحق اعتماد الهجرة — ١٧ نوفمبر ٢٠٢٦

شمل طلب المالك تنفيذ الهجرة اللازمة على قاعدة Sigma التجريبية بعد التحقق من الهدف ومراجعة SQL. يسري هذا الملحق على قيود الهجرة المذكورة أثناء التجميد الأولي. الهجرة المعتمدة هي `20261117181735_AddCustomerDepositRefundEvents`. يبدأ السجل من عمليات الرد الجديدة. توثّق [مراجعة التقرير](COLLECTION_REFUNDS_REPORT_FEATURE_REVIEW.md) التطبيق والتحقق من المخطط.
