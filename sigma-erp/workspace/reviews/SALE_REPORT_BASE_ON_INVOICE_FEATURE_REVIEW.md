# مراجعة تقرير المبيعات حسب الفاتورة

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-11-18 |
| Scope | Reports/SaleReportBaseOnInvoice — UI07 / BE17، حجم M |
| Contract | SALE_REPORT_BASE_ON_INVOICE_CONTRACT_FREEZE.md |

طلب المالك مراجعة التقرير وإصلاحه طبقًا لصورة Sale Report Base On Invoice/1.png. تتبع العمل المصدر القائم ولم يغيّر مولد الفواتير أو قواعد كتابة المستندات أو بيانات تجريبية. طبقت مراحل الاكتشاف والعقد والتنفيذ والربط والمصالحة؛ لا محرر أو إجراء مستند مالي جديد أو migration منطبق.

## الأدلة والمصدر

قُرئ مدخل الوثائق وفهرس المراجعات وشكل UI07 وكتل Master1/2/4/5/7 وUI20/21/6/22/26/28 وBE17/15/9 ذات الصلة. المرجع المعتمد StatementOfAccount/list وشركاء ReportPage/ReportActions/DataTable، والمهارة sigma-screen-refactor. مهارات Superpowers متاحة محليًا ومستخدمة للتشخيص والتصميم المتناسب والمراجعة والتحقق؛ لا تمنح تشغيل اختبارات أو متصفح. نجح فحص recipe -Check لجميع الحزم الثماني قبل استخدامها، ولم تعدل الكتب أو حزمها المولدة في هذه المهمة.

قُرئ أولًا الفصل16 من Speed_Analysis_Guide.md بتاريخ27 أكتوبر2026، وفُحص catalog الخاص بالشروح؛ لا شرح أصلي مستقل خاص بهذه الشاشة في الفهرس. ثم قُرئت شاشة sidebar/23-reports/screens/14-sale-report-base-on-invoice.md وC1054 (tenant.views.crs.reports.saleReportBaseOnInvoice.index) ومسارR0443:4793 وraw/application.js:280781–281030 من لقطة28 أكتوبر. بصمة SHA256 للمصدر application.js: 39FD999323FA97551442C5A71DC7E83C975436CACE0FB4EE8C0CDEEA0E1033C4. يثبت المرجع المرشحات الثلاثة وأسماء الأعمدة الخمسة عشر والحالة والإجراءات؛ لا يثبت قاعدة حساب خادمية. بعد Speed قُرئ credit_notes.rst من مجموعة Odoo19 المحلية لتفسير خفض الدائن وزيادة المدين، وطوبق ذلك مع القيود الفعلية في Sigma لا كبديل عنها.

المصدر القديم يطلب Report/SaleReportBaseOnInvoiceReport غير الموجود، ويرسل contactTypeId/ownershipId بينما الخادم يقبل ContactType/Ownership، ويحمل فروعًا غير مستخدمة، ويزيد التاريخ يومًا ويكرر النتائج. قارئ الخادم يعرض رأس Invoice واحدًا بدل البنود، ويعتمد تداخل فترة الخدمة بدل تاريخ المستند، ويعرض TotalAmount شامل الضريبة، ويطابق المركبة باللوحة، ويفتقد الإشعارات والمجموع الخادمي وفصل العملة ودقة النقل.

## مصالحة الحقول والوظائف

أعمدة الجدول مطابقة لخصائص SaleReportBaseOnInvoiceRowVm الخمسة عشر بهذا الترتيب: agreementNo/voucherNo/voucherType/status/startDate/endDate/quantity/vehicle/customer/accountDescription/branch/saleOrigin/type/revenue/salePerson. خاصية key هوية مخفية فقط، لا tree/children أو عمود ملاحظات. StartDate/EndDate اختياريان للإشعارات، Quantity عدد أيام صحيح، Revenue نص decimal exact، VoucherNo رقم المستند المحفوظ وليس Id. كل قسم عملة CurrencyId/Code/DecimalPlaces/Rows/TotalRevenue، والإجمالي في footer خارج الصفوف والتصفية والعد والصفحات.

| الدليل/الجانب | التصنيف والمصالحة |
|---|---|
| الصورة وC1054: المرشحات | مطابق: اليوم المحلي افتراضيًا، From/To شاملان، Individual0/Company1 وOwn0/External1/BuyBack2، null الكل و0 محفوظ. لا فلاتر إضافية |
| الصورة: التقرير/Excel/Refresh | مطابق مصدرًا: Print/ExportData/Read مستقلة بصلاحياتها ومصدر مالي واحد، كامل الصفوف لكل العملات. Report إجراء الطباعة بالمالك المشترك |
| الصورة: تفاصيل Rent/GPS/BabySeat | مطابق لشكل الأعمدة؛ جزئي للمصدر: مولد Sigma يحفظ Rent/Fine/Salik/Darb فقط. لا يعيد هذا التقرير اختراع رسوم GPS/BabySeat من أسعار حالية. توسيع كاتب الفواتير لتلك الرسوم فجوة دورة مستقلة مسجلة، وليس مسار توافق لبيانات تجريبية |
| الصورة: الدائن والمدين | مطابق مصدرًا: إيراد القيد المرحّل الأصلي CurrencyCredit-CurrencyDebit لحساب Category.Revenue؛ تستبعد VAT/AR والمدين المورد. لا إعادة جمع تخصيصات قد تكرر القيد |
| الصورة: الفترات والكمية | مطابق: فترة البند التاريخية وفرق أيامها التقويمية، وفترة رأس Lease المحفوظة. الإشعار بلا فترة خدمة وكمية0 ولا رابط عقد تخميني |
| الواجهة العامة | مطابق UI1/3/20: عنوان داخل panel، shared controls، RTL/theme؛ المرشحات والأزرار في صف عند توفر العرض وتلتف عند ضيقه، لا شرح أسفل المرشحات أو داخل الجدول |
| الصفحات والتمرير | مطابق مصدرًا: host/page/panel/results/currency flex bounded، DataTable.fill وscrollable، paginator خارج تمرير الصفوف بأسفل المساحة. وضع الطباعة flow كامل |
| الهوية والفرع | QueryReport للصفوف والمراجع؛ Partner/Staff scope يدوي عند اللزوم؛ فحص ambiguity للـLease محصور tenant/live/numbers؛ لا plate join. فاتورة Rental لوحة البند المحفوظة وLease لوحة الفاتورة المحفوظة |
| الربط بالاتفاقية | RentalAgreementId التاريخي للبند وLease AgreementNo المحفوظ والمميز الذي يفرضه الكاتب. الإشعار AgreementId المحفوظ إن وجد، والخانات غير المثبتة فارغة |
| مصادر الأسماء | أسماء Partner/Branch/Staff/Vehicle/SaleOrigin المسموحة؛ لا قراءة أسماء من خارج نطاق الفرع. VehicleId المحفوظ للبند أو سطر القيد أساس الملكية؛ لا fallback لمركبة العقد عند وجود VehicleId غير متاح |
| الحساب والخرائط | الخدمة الحالية SalesReportsService بملفات partial صغيرة؛ reuse أهلية الفواتير ومرجع الاتفاقية، لا AutoMapper جديد أو حساب مالي في Angular. تقرير Sale السابق يحتفظ بدلالته ولا يضم هذه الإشعارات |

### أهلية المستند والتحقق المالي

الفواتير Rental/Lease في الفترة حسب InvoiceDate، بقيد RentalInvoice/JV generated/posted/approved/nonvoid مطابق المستأجر/العملة/الفرع/التاريخ. RentalInvoiceItem Amount وTax يطابقان الرأس، ولا يستخدم TotalAmount بديلًا للصافي. Lease رابط عقد مميز وصافي Amount. الإشعارات من CreditNote/DebitNote المعتمدة وغير المبطلة ضمن تاريخ الإشعار وبقيدها الصحيح، دون سندات القبض والمدفوعات والودائع. تتطلب سطور الإشعارات زوج CurrencyCredit/CurrencyDebit الذي يحفظه الكاتب الحالي SaveCurrencyDraftJVAsync؛ لا استبدال بعملة الأساس عند نقص الدليل.

المستخدم ذو نطاق جزئي على فاتورة مجمّعة لا يقارن الجزء المرئي بإجمالي الرأس. يثبت القارئ أولًا معرّفات الفواتير المسموحة، ثم يتحقق من كامل مبالغ بنودها في استعلام أدلة معزول ذي tenant/live/IDs صريحة على جميع جذوره، ولا يركب IgnoreQueryFilters مع الاستعلام المنشور. لا تستعمل تلك المجاميع للعرض أو الإجمالي المرئي؛ تأتي الصفوف فقط من QueryReport. بقي قارئ SaleReport السابق خارج هذا التعديل المالي. لم تُغيّر بيانات أو مخطط أو ملف مولد.

## النقل والوصول ودورة التحميل

المسار القائم Reports/SaleReportBaseOnInvoice ومكونه وخدمته ما زالوا مالكي الشاشة، وDI القائم صالح. استبدل URL الخطأ بالمالك SalesReports الحقيقي. أضيفت مسارات SaleReportBaseOnInvoicePrint وSaleReportBaseOnInvoiceExportData، مع PermissionCatalogAction ومنحتي الطباعة/التصدير واشتراط منحة القراءة القائمة؛ تبنت جميع المسارات ReportEffects. أضيف route policy صريح ومسار التحويل لأول شاشة مسموحة. المنح الجديدة لا تحفظ تلقائيًا في دور المستخدم، ولا توجد كتابة صلاحيات.

| الطلب/المصدر | المالك والـcache/lifetime |
|---|---|
| خيارات المرشحات | enums محلية مترجمة، options() قيمة محلية متناهية عبر shared lifecycle؛ لا GET فروع أو عملاء أو cache مستحدث |
| GET SalesReports/SaleReportBaseOnInvoice | قراءة مالية تشغيلية مباشرة بلا cache؛ مشتركة createReportReadState تبدأ global LoadingService عند الاشتراك وتنهي finalize، host shell layout.component.html؛ تبقى busy/aria-busy وفشل مضغوط مع Refresh |
| GET …Print و…ExportData | نفس مالك القراءة والتحميل العام، تحقق المنحة قبل الإجراء والاستجابة؛ نسخة preparedPrint مرتبطة بالجلسة/المرشحات/الفرع عبر ReportPrintService، Excel كل الصفوف مع نص المال الدقيق |
| تغيير المرشحات/الوصول/الفرع/الجلسة أو teardown | إلغاء القراءة والمنشور والمخرجات القديمة وإغلاق body overlays، منع النشر المتأخر؛ لا spinner مستقل أو data cache watch مطلوب لأن لا مصدر lookup بعيد مستهلك |

## السرعة والاستعلام والفهارس

أزيلت Includes الواسعة وGET الفرع غير المستخدم والـplate join والتكرار المحلي وزيادة التاريخ. كل قراءة تقرير ذات projections محددة وعمليات مجمعة ثابتة العدد (لا طلب أو استعلام لكل صف)، وتحتفظ الاستجابة بكل النتائج لضمان footer والطباعة وExcel. تتم المرشحات المالية/الفترة في SQL، ويطبق معيار نوع العميل والملكية على المساهمات المثبتة قبل التجميع النهائي. قد تكبر البيانات لفترة طويلة؛ لا حد اعتباطي يحذف نتيجة أو يبدل توتال التقرير.

فُحصت InvoiceConfig/JournalVoucherConfig/CreditNoteConfig/DebitNoteConfig/RentalInvoiceItemConfig. فهارس FK التقليدية تربط البنود بالمستند والقيد، والفهرسان الصريحان على RentalAgreementId/InvoiceToDriver/period وRentalBillingChargeId يخدمان الكتابة ولا يغطيان تاريخ التقرير في الرأس. لم يثبت زمن أو SQL plan أو العدد على القاعدة، فلا migration لفهرس غير مقاس. مقترح للمقارنة على نفس tenant/الفترة/النطاق: InvoiceBase(SubscriptionId,InvoiceDate,Id) INCLUDE(BranchId,CurrencyId,JournalVoucherId)، وCreditNote(SubscriptionId,CreditNoteDate,Id)/DebitNote(SubscriptionId,DebitNoteDate,Id) INCLUDE(BranchId,CurrencyId,JournalVoucherId,ApprovalStatus,IsVoided). يتحقق التنفيذ الفعلي من عدم تكرار فهارس EF/القاعدة والتوزيع وخطة TPT قبل تطبيق أي فهرس؛ يزيد تخزين وكلفة كتابة كل رأس، ولا يفهرس القيد بمفتاح موسع ما دام الربط بالـPK كافيًا. القياس المطلوب قبل/بعد: عدد SQL والصفوف والقراءات والمنطقية ومدة الطلب وخطة الفعل، نفس warm/cold وحجم البيانات والفروع، قبول معلق.

## المراجعة والبناء والقبول

عامل مستقل invoice_sale_ui ملك المجلد frontend فقط بعد تجميد العقد، والجذر ملك الخلفية والربط والترجمة والدليل والتكامل. راجع عامل مستقل invoice_sale_review المصدر قراءة فقط لخفض خطر العزل والحساب وترجمة EF. استُخدم النموذج الموروث المتاح لكل منهما، دون model override. عولجت ملاحظتاه: إسقاط SaleOrigin صريح في طرفي Concat، ولوحة Lease من الفاتورة؛ ثم راجع الجذر النتيجة والفروق في كل ريبو مستقلًا وحفظ العمل السابق.

نجح بناء Angular development بworker1 (120.329 ثانية، exit0)، وبناء tests/SiGma.BranchAccess.Tests.csproj مع API ومراجع الأعمال/DTO (بناء نهائي13.86 ثانية، exit0، صفر أخطاء وتحذيران سابقان في JobService وBillService؛ البناء السابق23.42 ثانية أظهر41 تحذيرًا سابقًا عند إعادة تجميع المواصفات). نجح تجميع ngc الموجه لمواصفتي الواجهة الجديدتين (exit0). السجلات: Sigma/.codex/invoice-sale-ui-build.log وSigma/.codex/invoice-sale-spec-build.log وSigmaBackend/.codex/invoice-sale-report-build.log. فشل إعداد التجميع الأول بسبب typeRoots في config مؤقت خارج المشروع، ثم صحح إلى node_modules/@types ونجح؛ لا تغيير تبعيات. نجح git diff --check المحدد في الريبوين؛ ملفات جديدة قُرئت كاملة لأنها لا تظهر في diff الافتراضي.

المواصفات المكتوبة والمجمعة تغطي مسارات HTTP وقيم0 والتواريخ والأعمدة والتصدير الدقيق، والبنود الصافية وتاريخ المستند وإشارات الإشعارات واستبعاد VAT/AR ونقص دليل العملة، وترجمة joins على SQL Server كتوصيف غيرمشغّل. موفر InMemory لا يثبت استعلامات ownership views؛ أبقي قبول branch effects/SQL بالموفر الحقيقي معلقًا، ولا وصفها باختبارات ناجحة. لم تنفذ اختبارات أو lint أو متصفح أو تطبيق أو SQL أو migration أو commit/push/deployment.

الدليل داخل UserGuide/content/invoice-sale-report-topic.ts بالعربية والإنجليزية، مرتبط بقسم التقارير Reports Guide والشاشة القائمة، ويشرح الفلاتر والأعمدة والمصدر والإشعارات والإجمالي والمخرجات والاستعادة وحدود بيانات الرسوم. لا تُعرض هذه الشروح في جدول التقرير.

القبول المتبقي: تشغيل API المحدث والواجهة ثم تجربة الفاتورة المرحّلة المجمّعة بين فروع، إشعار عميل دائن/مدين وVAT، إشعار مورد مستبعد، عملتين وإجمالي دقيق، لوحة Lease مختلفة عن لوحة المركبة الحالية، نوع العميل والملكية بالقيمة0، إلغاء/سحب صلاحية أثناء القراءة، جدول طويل وصفحات ثابتة، الطباعة الكاملة وExcel واللغتين والثيمين. لا قرار أعمال مفقود في الحساب المنفذ؛ فجوة GPS/BabySeat في مولد الفواتير معلومة ومفصولة عن هذا التقرير.

رسائل commit مقترحة فقط: للخلفية `Fix invoice-based sales detail report and posted adjustment revenue`، وللواجهة `Align invoice sales report filters, columns and complete outputs`. لا commit منفذ.

## متابعة خطأ تجميع الدليل — 18 نوفمبر2026

أبلغ المالك عن TS6053 لملف invoice-sale-report-topic.ngtypecheck.ts. إصلاح Tier S للتجميع فقط، بلا تغيير حقول أو حسابات أو دليل المستخدم. فُحص tsconfig.app.json والاستيراد الفعلي للدليل، ومصدر Angular ShimAdapter الذي يضيف shim افتراضيًا لكل جذر، وملف .angular/cache/21.2.27/sigma/.tsbuildinfo. أثبت الكاش أن ملف الدليل وshim الخاص به جذران للتجميع، بينما الدليل بيانات مستوردة من reports-guide ولا يحتاج root مستقلًا. لا ملف ngtypecheck مادي مفقود يتطلب الإنشاء. أضيفت في المهمة الأصلية أربع جذور غير لازمة لبيانات الدليل والترجمة وaccess/presentation؛ أزيلت هذه الإدخالات الأربعة وحدها، مع إبقاء الاستيرادات وقائمة التطبيق الصريحة وحدود الاختبارات كما هي، وفق UI1. لم يُعدل كود Angular أو يُنشأ ملف بديل وهمي. يرجح أن الـwatch القائم قبل إضافة الملف احتفظ بحالة الجذر القديمة؛ لم يفحص سلوكه داخل التطبيق ولا يعامل ذلك كإثبات runtime. لا تفويض لوكيل لأن الإصلاح عنصر إعداد واحد. قبول إعادة تجميع watch المفتوح يظل مستقلًا عن بناء محلي جديد.

التحقق اللاحق للإصلاح: نجح Angular development build بworker1 في85.108 ثانية وexit0 دون TS6053. بعد البناء أصبح كل من invoice-sale-report-topic.ts وshim الافتراضي موجودين في مخطط الاستيرادات لكنهما ليسا جذري تجميع في .tsbuildinfo، مقابل كونهما root=True قبل الإصلاح. نجح فحص الفروق المحدد لـtsconfig.app.json. السجل Sigma/.codex/invoice-sale-ui-shim-fix-build.log. لم يُعَد تشغيل dev server القائم أو يختبر التطبيق؛ قد يلزم إعادة تشغيل watch المفتوح لتفريغ حالته الداخلية السابقة. لم تُشغّل اختبارات أو متصفح أو قاعدة بيانات أو lint أو commit.

### تأكيد إصلاح جلسة التجميع المستمر — 18 نوفمبر2026

أعاد المالك رسائل TS6053 للملفين الأصليين وملفات shim مع TS2307 في استيرادات الدليل والترجمتين. أُعيد فحص الملفين: موجودان منذ10:01:35 بالتوقيت المحلي، بمسارات وأسماء الاستيراد نفسها، ولا إدخالات قديمة لهما في tsconfig الحالي. ثبت أن عملية Angular القائمة PID29712 على المنفذ4200 بدأت06:48:32 قبل إنشاء الملفين، ولم تُعَد بدايتها بعد التصحيح السابق. لم يُفترض أن الملفين محذوفان ولم تُنشأ بدائل shim أو تنقل محتوياتهما لإخفاء المشكلة.

لإتمام إصلاح المترجم الجاري أُثبتت هوية node ووسائط Angular development والمالك الوحيد للمنفذ4200، ثم أوقفت تلك العملية فقط وأعيدت نفس خدمة الواجهة في workspace الصحيح بنفس المنفذ، دون -o أو متصفح، وبنافذة مخفية وسجل مستقل. العملية الجديدة PID4704 أتمت Application bundle generation complete خلال88.593 ثانية، ثم Watch mode enabled وأصبحت تستمع على localhost:4200؛ لم تظهر TS6053/TS2307 وسجل stderr فارغ. السجل Sigma/.codex/invoice-sale-dev-server.out.log و.err.log و.pid. هذا قبول تجميع serve الفعلي، وليس اختبار واجهة أو تحقق حسابات داخل التطبيق. لم يجر تغيير إضافي لمصدر التطبيق أو الـAPI أو قاعدة البيانات أو تشغيل اختبارات. تستمر خدمة الواجهة الجديدة للمالك على المنفذ نفسه.
