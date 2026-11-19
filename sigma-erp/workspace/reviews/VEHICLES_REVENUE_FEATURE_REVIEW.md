# مراجعة وتنفيذ تقرير إيرادات المركبات

## حذف الشرح نهائيًا من التقرير والطباعة — ١٦ نوفمبر ٢٠٢٦

بطلب المالك حذف النص المعروض، أزيلت من HTML كتلة سطور الفترة والفرع وفقرتي تفسير العقود/الترخيص والنطاق، وأزيل تحذير الإجماليات المخصص للطباعة؛ حُذفت العناصر نفسها بدل إخفائها بفئات عرض. أزيل عمود شرح النطاق من Excel ونصوص الشرح غير المستعملة من الترجمتين. صفوف الرأس الثلاثة والجدول والمال والحسابات والفلاتر والتحميل والكاش والمنح والخادم لم تتغير، وحُدث الدليل لعدم الادعاء بوجود الشرح في الطباعة. لا مصدر/قرار مالي جديد أو SQL/index/schema أو تفويض عوامل.

نجح ngc --noEmit المحدود للمكون والقالب والدليل والترجمتين، exit0، وفحص الفراغات والمصدر. ثبت غياب الكتلة ومراجع الشرح ووجود صفوف الرأس الثلاثة، وحُذف إعداد التجميع المؤقت. لم تُنفّذ اختبارات/lint أو متصفح أو بيانات أو نشر؛ المعاينة الحية معلقة. اقتراح commit للواجهة: `fix(reports): remove vehicle revenue explanatory text`.

## مطابقة تفاصيل أعلى الجدول للصورة — ١٦ نوفمبر ٢٠٢٦

بطلب المالك الالتزام بنفس تفاصيل الصورة، عُدلت مسميات الرأس إلى Car Details / تفاصيل السيارة، Agreement count / عدد العقود، License Expiry / انتهاء الملكية. الصفوف الثلاثة بالترتيب نفسه: إنجليزي يسارًا، قيمة بالمنتصف، وعربي في العمود الأيمن، دون إضافات. لم تتغير قيم API أو معنى العدد وتاريخ الانتهاء أو حساباتهما؛ تغيرت التسميات والمحاذاة فقط. حُدث الدليل والترجمتان، وأزيل مفتاح carDetails غير المستعمل. لا تعديل للجدول أو ملاحظاته أو تحميل/كاش/طلبات/SQL أو منح، ولا قاعدة عامة جديدة أو تفويض عوامل لهذا العنصر المحدود.

نجح ngc --noEmit المحدود للمكون والقالب والدليل والترجمتين، exit0، وفحص الفراغات ومراجعة الفروق. أزيل إعداد التجميع المؤقت. لا اختبارات/lint أو متصفح أو بيانات أو نشر؛ المعاينة البصرية الحية معلقة. اقتراح commit للواجهة: `fix(reports): match vehicle revenue header to the reference`.

## التوضيح النهائي للصورة: بلا ملاحظات في الجدول — ١٦ نوفمبر ٢٠٢٦

طلب المالك الالتزام بعناوين الصورة وعدم عرض ملاحظات في الجدول. أزيل قالب invoiceDetails والتاريخ والتشخيص من خلية التفاصيل، وأزيلت وارداته واستعلام viewChild غير اللازمة. عناوين الشاشة Details/Total/Paid/Balance، وDetails هو رقم الفاتورة وحده؛ تبقى تواريخ الفواتير وتشخيصاتها في تصدير Excel الأصلي. تحذير الإجماليات غير المتاحة للطباعة فقط؛ لا تقدير للصفر أو تغيير للحساب أو الدقة. تحديث الدليل يطابق الفصل بين جدول الشاشة والمخرجات. هذه الحالة تحل محل وصف التاريخ والتشخيص داخل الخلية في السجل السابق.

النطاق Tier S بلا backend أو تغيير نقل/تحميل/كاش/SQL/index/schema أو تفويض عوامل. استُخدمت الصورة والتوضيح الصريح والعقد ومالكو DataTable والأرقام المشتركين، دون مفهوم جديد يستدعي بحث Speed/Odoo إضافيًا. نجح تجميع Angular المحدود للمكون والقالب والدليل والترجمتين، وفحص الفراغات والفروق المحدودة؛ قبول المظهر الحي لم يُنفّذ. لا اختبارات/lint أو متصفح أو بيانات أو نشر. اقتراح commit للواجهة: `fix(reports): remove notes from vehicle revenue table`.

## التصحيح المعتمد: اتباع الصورة البسيطة — ١٦ نوفمبر ٢٠٢٦

رفض المالك تصميم البطاقات وقسم الملاحظات وطلب تنفيذ الصورة البسيطة نفسها؛ هذا القسم هو الحالة الحالية ويحل محل تنفيذ البطاقات المسجل بعده. أزيلت SummaryCards/FormSection ووصفاتهما ومفاتيحهما غير المستعملة. أصبحت تفاصيل السيارة وعدد العقود المفوترة وانتهاء التسجيل ثلاثة صفوف في dl ذي تسميات وقيم ومحاذاة بسيطة، ثم النتائج مباشرة، وأزيل الحد الكبير المحيط بالنتائج. الأعمدة المرئية Details/Total including tax/Paid or settled/Balance، وتاريخ الفاتورة وتشخيص المصدر داخل التفاصيل. يظل columnsFor الأصلي ذو الحقول الستة مسؤولًا عن Excel. لا بيانات أو حسابات حُذفت من النقل، ولا جمع عملات أو تحويل مال إلى number. هذا الاستثناء من البطاقات بطلب المالك صراحة، لا قاعدة شكل عامة جديدة.

إجماليات كل قسم صارت DataTable.footerRows من نفس قيم الخادم؛ لا تدخل في صفوف البيانات أو عددها أو فرزها وترشيحها وصفحاتها. تبقى moneyAggregate/dقة العملة والقيم null والتحذير عند إجمالي مجهول، ولا تخترع قيمة صفر. المساعدة والفرع والفترة في الطباعة والدليل وExcel، دون قسم مساعدة في الشاشة. حُفظ شريط البحث السابق ومالكو الصلاحية والتحقق والتحميل والإلغاء وطلب/كاش/مصادر التقرير. لا backend أو SQL أو index/schema أو قياس سرعة جديد. مصدر الصورة وSpeed ودليل التحليل والكود المؤرخ والعقد المالي القائم أعيد استخدامها؛ لا غموض أعمال جديد يستدعي مرجع Odoo إضافيًا أو تفويض عامل.

نجح ngc --noEmit المحدود للمكون والقالب والدليل والترجمتين بعد آخر تعديل، exit0؛ روجعت الفروق المحدودة كاملة واجتاز فحص الفراغات. أزيل ملف التجميع المؤقت، وحُدث دليل /UserGuide/reports بالعربية والإنجليزية. لم تُنفّذ اختبارات أو lint أو متصفح أو بيانات أو نشر. القبول البصري الحي واللغتان والثيمان والطباعة ما زالت معلقة. اقتراح commit للواجهة: `fix(reports): follow the simple vehicle revenue report layout`.

## تنفيذ إصلاح التنسيق بعد الصورة444 — ١٦ نوفمبر ٢٠٢٦

طلب المالك «الشكل مش مظبوط خالص» يصرح بإصلاح العرض بعد المراجعة المصدرية السابقة. استُهلك عقد التقرير الحالي وUI20 ومالكو SummaryCards/FormSection/DataTable؛ أعيد استخدام أدلة Speed ووثائق Odoo المسجلة أدناه للمعاني المعتمدة، بلا قرار أعمال أو مالية جديد أو جمع مرجع خارجي. النطاق Tier S عرض هذه الشاشة فقط، بلا تفويض عوامل. المراجعة القديمة التالية سجل سابق لهذا التفويض وليست حالة العمل الحالية.

أصبحت بيانات المركبة الست في خمس بطاقات مشتركة مختصرة، مع الموديل أسفل اللوحة، وبطاقات منفصلة لإجماليات كل عملة من قيم الخادم. تستخدم الإجماليات totalText/formatMoney بوضع aggregate ثم format:text في SummaryCards للحفاظ على المبالغ الدقيقة الكبيرة ودقة العملة وUnavailable، بلا تحويل إلى number أو حساب جديد. نُقلت فقرتا التفسير إلى FormSection قابل للفتح بعد النتائج، مطوي افتراضيًا ومفتوح عند الطباعة. بقيت ملاحظات الصف والمبالغ غير المتاحة واضحة في موضعها. عند غياب الأقسام يظهر DataTable فارغ بالأعمدة الستة ورسالة واحدة، دون اختلاق عملة أو صف مالي؛ إعداد الدقة فيه خاص بهيكل خالٍ من المبالغ. استُخدمت مسافات المرافق القائمة فقط، بلا SCSS لبطاقات أو فلاتر أو تعديل مكون مشترك.

بقي شريط البحث الواحد وحقوله الثلاثة وأزراره الخمسة والتحقق والمنح والعمر والطباعة وExcel كما هي. لا طلب/URL أو مصدر كاش أو trigger/invalidation/watch جديد؛ options/report/export قراءات تشغيلية مباشرة بمالكي التحميل والإلغاء القائمين. لا تغيير backend/query/data volume/index/schema، فلا مؤشر جديد لهذا العرض، ولا ادعاء تحسن سرعة مقاسة. حُدث دليل المستخدم داخل التطبيق بالعربية والإنجليزية.

نجح تجميع Angular المحدود ngc --noEmit لمكون التقرير وقالبِه ودليله والترجمتين بعد آخر تعديل، exit0. أكد فحص المصدر وجود كل formControlName مرة واحدة والأزرار الخمسة وعدم بقاء شريط الملخص القديم أو رسالة فراغ مكررة. روجعت الفروق المحدودة مع حفظ التعديلات السابقة في ملفات الترجمة والفلاتر، واجتاز فحص الفراغات. أزيل إعداد التجميع المؤقت. لم تُنفّذ اختبارات أو lint أو متصفح أو بيانات أو نشر؛ قبول المظهر الحي واللغتين والثيمين والمقاسات والطباعة ما زال عند المالك. اقتراح commit للواجهة: `fix(reports): organize vehicle revenue summary and empty results`.

## مراجعة التنسيق مقارنة بالصورة — ١٦ نوفمبر ٢٠٢٦

طلب «راجع تنسيق التقرير» مراجعة مصدرية فقط، وفق قواعد النطاق الحالية؛ لم يُعدّل مصدر التطبيق أو العقود أو الدليل في هذه المراجعة. الصورة المرفقة دليل ترتيب ومحتوى: فلاتر، بيانات المركبة/العقود/الترخيص، ثم Details/Total/Paid/Balance ومخرجات. لا تثبت حجم الخط أو اللون كقاعدة Sigma، ولا تحسم دلالة السداد أو اختلاف العملات. قرئت قوالب التقرير وSCSS والأعمدة ومالك شريط البحث المشترك وUI20/22 والعقد القائم، ومرجع Speed فصل16 وشاشة23/03 ومقاطع C1099؛ لا قرار أعمال جديد يستدعي Odoo. لا أدوات متصفح أو SQL أو اختبارات أو بناء مطلوبة لهذه القراءة.

| الملاحظة | الدليل | التوصية وحدودها |
|---|---|---|
| بيانات المركبة موزعة في شريط أفقي قابل للالتفاف، فيضعف تمييز الاسم/القيمة عند ضيق المساحة | HTML47–54 تقريبًا؛ sigma-report-summary-bar flex/space-between، و6 قيم تشمل المركبة والموديل والفرع والعقود والترخيص والفترة | تجميع البيانات في كتلة ملخص واضحة بمسميات وقيم مصطفة، مع الاحتفاظ بالقيم الست والعقود المفوترة والترخيص الحالي بمعناهما؛ إعادة استخدام مالك مشترك، لا تقليد جدول الصورة أو ابتكار مكونات |
| فقرتا تفسير كاملتان تفصلان بيانات المركبة عن بداية النتائج | HTML headerExplanation/scopeExplanation | عرض مساعدة مختصرة لتفسير العدد والفترة ومعنى السداد، مع إبقاء تنبيهات المصدر المؤثرة على تفسير الأرقام ومخرجات الطباعة/Excel؛ ليست توصية بإخفاء القيم غير المعلومة أو تحويلها إلى صفر |
| عند انعدام الأقسام لا يوجد جدول أو رؤوس أعمدة؛ يظهر Empty فقط | @for(section of sections()) يحيط بكل DataTable، ثم StateMessage منفصل عند !hasRows | مراجعة عرض هيكل الجدول الفارغ مع رسالة موحدة، مع الاحتفاظ بفصل العملات وعدم اختلاق عملة أو صفوف مالية؛ فرق مرجعي، وليس تغييرًا محاسبيًا معتمدًا |

أعمدة Sigma الحالية الستة هي رقم الفاتورة، التاريخ، الإجمالي، المدفوع/المسوى، الرصيد، وملاحظة المصدر. العقد المالي يبرر التاريخ والملاحظة وفصل العملات؛ لا تُحذف لمجرد أن الصورة تُظهر أربعة عناوين. المحاذاة الرقمية موجودة بالفعل عبر money/headerClass/cellClass المشتركة. البحث على صف عريض يستخدم المالك inline بعد الطلب السابق؛ التفاف1250/640 مقصود للتجاوب ولم يُرصد كعطل حي. لا دليل على عيب RTL/theme أو عرض مبلغ من الصورة وحدها.

الناتج مراجعة توصيات فقط. المعاينة الحية والمقاسات/الطباعة ما زالت غير منفذة؛ التنفيذ يحتاج طلب تعديل وفق قاعدة المراجعة غير المشروطة الحالية. لا تغيير load/cache/query/index/schema أو UI financial contract، ولا تفويض عملاء لصغر النطاق. أرقام الأسطر تقريبية مرتبطة بالمصدر المقروء وليست قبولًا بصريًا.

## محاذاة شريط البحث — ١٦ نوفمبر ٢٠٢٦

طلب المالك جعل جميع عناصر مربع البحث في صف واحد. استُخدم modifier المالك المشترك sigma-report-filter-panel--inline مع stable، وقالب المسارات الموثق في UI20: حقل المركبة، حقل الفترة، ومسار للأفعال. نُقل checkbox الفترة مرة واحدة إلى sigma-report-filter-actions--with-checks داخل حقل الأفعال ذي caption مخفي بصريًا، مطابقًا لمالك Accounts ReportPage. تبقى الحقول والأزرار الخمسة على خط التحكم نفسه في العرض الواسع وتستمر حدود1250/640 والتفاف الأفعال المشتركة عند الضيق. لا SCSS محلي أو تعديل مالك عام أو PrimeNG API.

حُفظ formControlName والقيم والتحقق وreserveMessage وتعطيل الفترة والطلبات والمنح والتحميل/الإلغاء؛ التعديل يغير العرض فقط. لا مصدر/حساب/DTO/SQL/cache/index أو migration. حُدث دليل /UserGuide/reports لشرح الصف. نجح ngc --noEmit لمكوّن التقرير والقالب والدليل؛ أكد فحص المصدر وجود vehicleId/dateRange/usePeriod مرة واحدة والأزرار الخمسة، ونجح فحص الفراغات. حُذف إعداد التجميع المؤقت. لا tests/lint أو متصفح/SQL أو commit/push/deploy؛ المعاينة الحية على المقاسات واللغتين والثيمين معلقة. شريحة Tier S عرض/مطابقة بلا تفويض مستقل. اقتراح commit للواجهة: `fix(reports): align vehicle revenue filters and actions in one row`.

## تعديل الاسم — ١٦ نوفمبر ٢٠٢٦

بطلب المالك، أصبح الاسم الإنجليزي `Vehicles Revenue Report` في مفتاح vehiclesRevenue.title وعنوان الدليل، مطابقًا لبند القائمة الموجود بالفعل. العنوان في FeatureTitle ووصف منطقة التقرير يستخدمان المفتاح نفسه. شريحة نصية Tier S بلا تعديل مسار أو بيانات أو أذونات أو حساب أو تحميل/cache/SQL؛ مرجع UI23 وعقد التقرير الحالي. نجح تحليل TypeScript للملفين وفحص الفراغات ومطابقة الاسم في مواضعه الثلاثة؛ لا حاجة لبناء أو اختبارات لهذه النصوص وحدها. لم تُنفذ أوامر runtime أو بيانات أو نشر. اقتراح commit للواجهة: `fix(reports): name Vehicles Revenue Report consistently`.

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-11-11 |
| Tier / shape | M / UI07 / BE5 |
| Scope | الصورة5؛ تنفيذ إصلاحات التقرير ومالكه المباشر، مصدر فقط |

## الاكتشاف قبل تعديل المصدر

المستودعان SiGmaAngularFrontEnd وSigmaBackend، والجذر ليس مستودع التطبيق. صفحة التقارير تحوي Sidebar إلى /Reports/VehiclesRevenue لكن Reports_Routes لا يملك المسار أو مكونه/خدمته. تعليق Vehicle Revenue فوق VehicleRentalDetails ليس route التقرير. الخادم يملك VehicleReports.VehiclesRevenue وخدمة/VMs منفصلة بالفعل. تعديلات الربحية والتعرفة والصلاحيات/الحركات السابقة/الموازية موجودة ومحفوظة ولا تنسب لهذه الشريحة.

أدلة العيوب: VehicleReportsService.CreateVehiclesRevenueReport يستعمل NormalizePlate داخل Where EF (method خاص غير قابل للترجمة)، يربط هوية المركبة بالنص ويختار أول لوحة متكررة، ويقرأ رؤوس invoice غير مرحلة/ملغاة دون شرطها. لا paid/balance/العقود/الترخيص، ويعود totalNet/tax/gross بدل أعمدة الصورة. HeaderIncludes زائدة مع projection، child attribution غير مستعمل، والرسائل hardcoded. عملة واحدة ضمنية وJSON numeric رغم contract المالية الدقيقة. المسار الأمامي غير موجود ومن ثم لا states/loading/output/guide/adoption.

المراجع المقروءة: AGENTS والدليل الحي ومهارة Sigma، README وINDEX، Master1/4/5 وUI07/20/21 وBE17 والمقاطع المباشرة المالية/shared owners من العمل الحالي. حزم0/1/2/5/6 بعد recipe Check8 OK. Superpowers متاحة فعليًا بملفات using-superpowers/systematic-debugging/brainstorming/verification؛ تستعمل للتتبع والتصميم المصدرّي دون بوابات موافقة زائدة على التفويض المعطى أو تشغيل محظور.

## جدول المرجع والدورة

| المصدر / نوع الدليل | ما يثبته | واقع Sigma / القرار |
|---|---|---|
| الصورة5 | فترة، مركبة بحث/مسح، تفاصيل المركبة/العقود/الترخيص، Details/Total/Paid/Balance، طباعة وExcel وتحديث | الهدف الوظيفي، لا نمط الشكل ولا معادلة مالية مكتملة |
| Speed2026-10-27 فصل16 | العقود والفلاتر والمخرجات ينبغي تحديدها، لا مواصفة Revenue خاصة في catalog | لا rule server من وصف عام |
| Speed2026-10-28 screen23/03، R0395، C1099 raw290550–290933 | enableDateRange، vehicle search/clear، getRevenue وoutputs/detail declarations | matched targets؛ grid P&L القديم متعارض مع الصورة ولا يستورد كعقد |
| template-bindings للقالب SHA9e4888a0f48f463111ea25a455bcef2cbc5778aa74a1c88dac40b18fe0d30324 | fields/actions مع HTML discarded | لا أعمدة/حسابات مالية إضافية مستنتجة |
| نافذة C1186 وC1096 معلنتان | vehicle picker وP&L detail declaration | intent البحث ضمن select Sigma، لا فتح P&L detail لكل invoice مع منح غير مرتبطة |
| Odoo19 payments.rst pinned2026-11-02 | الدفع المرتبط/التسوية يختلف عن قبض غير مربوط بفاتورة | مكمل مفهومي فقط؛ مالك Sigma WhereLedgerEffective/InvoiceAccounting هو مصدر الربط |
| InvoiceAccountingService/RentalInvoiceItem/ReceiptService.Allocations | attribution محفوظ للمركبة في invoice items، receivable رأس واحد، allocation قد تغطي فاتورة مشتركة | إجمالي عناصر المركبة؛ لا تقسيم paid من رأس مشترك. null+diagnostic عند غياب ربط حتمي |

لا نعامل عدم كشف معادلة خادم Speed كترخيص لتخمين السداد. يبين العقد المجمد قاعدة المصدر المختارة وحدود المجهول؛ البنود غير المحسومة لا تظهر أصفارًا أو حصة مفترضة. تبقى أي مساواة مطابقة server Speed غير مثبتة.

## جدول المالك/المطابقة المستهدفة قبل التنفيذ

| الجانب | الكتاب | المرجع والمالك الفعلي | الهدف |
|---|---|---|---|
| الصفحة والعنوان/العرض | UI1/3/20 | StatementOfAccount/list + ReportPage/FeatureTitle | sigma-route-host → panel fill، title داخل اللوحة، بلا pageheight calc |
| الفلاتر والإجراءات | UI16/17/20/22/26 | appDatePicker/Select + ReportActions/PrimaryActionButton | required vehicle، dates optionalpair، Search/Refresh/Print/Excel، منح حقيقية |
| الصفوف/الأرقام | UI6/19/20 وBE15/17 | DataTable exactMoney + currency converters/FinancialNumberPolicy | أربعة أعمدة الصورة مع date/issue مصدرية، currency sections، totals backend |
| التقدم/العمر | UI2/22/26/28 | ReferenceLookupStatus/LoadingService/AccessViewPolicy/auth session | direct sources، bootstrap page مستقل، finalize/cancel/publicationfence/Retry |
| الطباعة/الدليل | UI21/Master7 | ReportPrintService.createSession وReports guide | جميع sections/rows/headers/totals/issues في المخرج، topic EN/AR |

القرارات/النقل/الصلاحيات والملكية وخطة التنفيذ في VEHICLES_REVENUE_IMPLEMENTATION_CONTRACT_FREEZE.md. لا entity أو AutoMapper أو migration أو Add/Update، ولا توسيع لتعديل كتابة الفواتير أو التسوية. المصالحة تضاف بعد تنفيذ المصدر وفحص فروق كل مستودع.


## مصالحة التنفيذ — ١١ نوفمبر ٢٠٢٦

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

### النتيجة وحدود المطابقة

أضيفت شاشة إلى رابط القائمة الموجود /Reports/VehiclesRevenue وأصلح مالك الخدمة القائم بدل إنشاء API/تقرير منافس. الفلاتر مركبة مطلوبة وفترة قابلة للتعطيل كما يثبت Speed، والبيانات الظاهرة تفاصيل المركبة/العقود المفوترة/انتهاء التسجيل وأعمدة التفاصيل/الإجمالي/المدفوع-المسوى/الرصيد، مع تاريخ الفاتورة وملاحظة مصدر لازمين لتفسير الأرقام. الطباعة والتصدير كاملان لجميع أقسام العملات والصفوف/الإجماليات والمرشحات.

القرار المالي محدود بوقائع Sigma المتاحة، وليس ادعاء معرفة خادم Speed: الصف هو فاتورة لها عناصر محفوظة منسوبة للمركبة، والإجمالي هو مبالغ وضريبة تلك العناصر. اسم Paid مبين في اللغتين بمعنى التسوية وقد يشمل credit/JV؛ لا ادعاء قبض نقدي. لا توزع تسوية رأس فاتورة مشتركة بين المركبات أو أنواع الرسوم. paid/balance غير معلومتين عند الاشتراك أو العملة الأجنبية أو فساد المصدر/التسوية، مع ملاحظة صريحة. لا تجمع عملات، ولا تظهر إجماليات جزئية على أنها كاملة عند وجود مجهول. تفاصيل رقم الفاتورة محمولة في الصف، لا رابط محرر مستند بإذن مختلف. لا دليل محفوظ يثبت تجميع Speed لكل نوع رسم أو كيفية توزيع المدفوع؛ المساواة الدقيقة مع خادمه تبقى غير مثبتة، ولا جرى اختراعها لإخفاء الفجوة.

| العنصر | المنتج/المستهلك الفعلي | النتيجة |
|---|---|---|
| المرشحات | VehiclesRevenueSearchVm ↔ VehiclesRevenueFilter/readFilter/toQueryParams | vehicleId موجب؛ fromDate/toDate زوج nullable، نصف مفتوح بالخادم، لا Filters[] |
| الرأس | Vehicle QueryReport / ReportVm / summary-bar | لوحة/موديل/فرع حالي، NextRegistrationDate مؤشر انتهاء حالي، distinct invoiced RentalAgreementIds في الفترة؛ مع شرح حدودها |
| الأعمدة مقابل RowVm | details,invoiceDate,total,paid,balance,issue؛ invoiceId هوية فقط | جميع الحقول معروضة؛ لا audit/tenant/children/accounts أو مبلغ تحرير زائد |
| المال | NullableCurrencyAmountJsonConverter / FinancialNumberPolicy / DataTable exactMoney + moneyAggregate | exact strings/null، دقة عملة كل قسم، totals backend، لا تحويل إلى number أو مجموع عملات |
| attribution | RentalInvoiceItem.VehicleId المحفوظ؛ InvoiceAccountingService مصدر الإسناد | لا NormalizePlate في SQL ولا اختيار لوحة مكررة أو المركبة الحالية لعقد تاريخي |
| الحالة | invoice.QueryReport + posted/nonvoid journals.QueryReport؛ child.QueryReport | tenant/live/branch مالكوها الفعليون؛ InvoiceBase branch ownership يتطلب كل الحواف، لا كشف رأس مخفي |
| التسوية | QueryReport<JournalVoucherAllocation>.WhereLedgerEffective + receivable identity | target واحد مطابق لرأس الفاتورة/العميل؛ المصدر والهدف حيان مرحلان؛ المبلغ لا يتجاوز الإجمالي ولا يختفي بالـclamp |
| cutoff | InvoiceDate فترة؛ AllocationDate/source-document.Date/source-journal.Date قبل endExclusive | أصلح تدقيق المصدر نسيان تاريخ مستند المصدر نفسه؛ لا سداد لاحق ضمن فترة أقدم |
| فساد المصدر | reconciled flag مستقل عن wholeInvoice في VehiclesRevenueReadPolicy | أصلح تدقيق المصدر تشخيص mismatch كفاتورة مشتركة؛ invalidSource مختلف عن sharedInvoice |
| الأوامر | ReportActions/PrimaryActionButton/ReportPrintSession | Search/Refresh/Reset/Print/Excel، كل الصفوف وقت الطباعة والتصدير، no page-only output |
| المنح | VehiclesRevenue قائم؛ Options/Export مستقلان ولهما prerequisite read | route read+options، Excel read+export، printread، labels EN/AR، لا grants تلقائية |
| المظهر | sigma-route-host → ReportPage → sigma-report-panel → sigma-report-table-frame | panel fullheight/flex/min0/overflowhidden وframe overflowauto من styles.scss، إطار واحد يمرر الأقسام، لا page calc أو نسخ vendor print |
| دليل المستخدم | vehicles-revenue-topic.ts مسجل في reports-guide.ts | نفس /UserGuide/reports وقائمة الدليل الموجودة، EN/AR للنطاق/الخطوات/الأخطاء/المخرجات والحدود المالية |

### التحميل والكاش والعمر

الخيارات GET VehicleReports/VehiclesRevenueOptions عبر getOptions قراءة مباشرة مملوكة للتقرير، لا source cache opt-in أو reference watch. تبدأ عبر defer وتحرر loadingOptions عبر finalize، ويتولى ReferenceLookupStatus التقدم على مستوى الصفحة عبر LoadingService.setPageLookupLoading. Bootstrap مستقل عن reportCancelled وإبطال المرشحات؛ revision يمنع نشر استجابة قديمة.

التقرير GET VehicleReports/VehiclesRevenue والتصدير GET VehicleReports/VehiclesRevenueExport direct operational reads بلا cache مالي. defer يبدأ LoadingService lease عند الاشتراك فقط وfinalize داخل source يحرره عند success/false-envelope/error/cancel/destroy؛ لا انتهاء عداد لم يبدأ عند deny فوري. المسار لا يضبط showPageLoading=false، وLayout يربط showPageLoading مع loading في host الصفحة الحالي. مؤشر الجدول الثاني معطل، مع busy/formdisabled/aria-busy وStateMessage+Retry وskip-error-interceptor لمنع ازدواج المالك. فحص المصدر يثبت wiring ولا يثبت ظهور spinner أو توقيته فعليًا.

يستخدم المكون mounted auth-session مع AccessViewPolicy.denied$/dataContext وownedDataContext. يختفي المحتوى/الأقسام فور اختلاف السياق، ثم تمسح IDs/options/report ويغلق Select/DatePicker portals وتلغى القراءة والطباعة المؤجلة؛ تجدد credentials بنفس sessionkey لا يعيد إنشاء session. عودة المنح تعيد الخيارات فقط دون تكرار التقرير. تغير المرشح يبطل applied output ويمنع stale callbacks؛ export يفحص منحه عند البداية والنهاية. لا كتابة مستقلة للتقرير.

### الملفات والمراحل

تحت مستودع الواجهة SiGmaAngularFrontEnd:

- مجلد Reports/VehiclesRevenue: المكون والقالب وSCSS، الموديل والخدمة وثوابت الوصول الجديدة، ومواصفة HTTP بالخدمة.
- ملفا Reports/reports.routes.ts وshared/authorization/route-access-policy.ts لتفعيل الرابط الحالي ومتطلباته ومسار الرجوع المسموح.
- ملفات i18n/vocabs/en.ts وar.ts وauthorization.ts، وثلاثة action labels في shared/components/permission-tree/permission-tree.component.ts.
- ملفا UserGuide/content/vehicles-revenue-topic.ts وreports-guide.ts، وخمسة runtime entries صريحة في tsconfig.app.json دون إدراج spec ضمن app files.

تحت مستودع الخلفية SigmaBackend:

- ملف VehicleReportsService.cs لإزالة تنفيذ الإيراد القديم فقط مع إبقاء NormalizePlate الخاص بتقرير الشاسيه منفصلًا؛ وIVehicleReportsService.cs لإضافة options signature.
- ملفا VehicleReportsService.Revenue.cs وVehiclesRevenueReadPolicy.cs الجديدان في Services.
- ملفات VehiclesRevenueReportVm.cs وVehiclesRevenueRowVm.cs وVehiclesRevenueSearchVm.cs الحالية؛ وVehiclesRevenueSectionVm.cs وVehiclesRevenueOptionsVm.cs وVehiclesRevenueOptionVm.cs الجديدة في ViewModels/VehicleReports/VehiclesRevenue.
- ملف VehicleReportsController.cs لنقطتي options/export، وBranchOperationRules.cs وPermissionPrerequisites.cs لحماية الفعل الفعلي وتصنيف ReportEffects.
- ملفا GeneralMessage.resx وGeneralMessage.ar-SA.resx لمفتاحي خطأ المركبة/العملة فقط ضمن هذه الشريحة.
- ملفا VehiclesRevenueReadPolicyTests.cs وVehiclesRevenuePermissionTests.cs: مواصفات غير منفذة للتسوية/المجهول/المنح.

مراحل0/1/2/5/6 مطبقة. مراحل3 editor و4 actions المالية غير منطبقة؛ لا Entity/EF/AutoMapper/writes/schema أو migration. لا Add-Migration مطلوب. تعديلات الربحية/التعرفة والأعمال الموازية محفوظة؛ فرق shared عن HEAD يضم أعمالًا لا تنسب لهذه الشريحة. لا تعديل كتب عامة أو generated packets؛ القرار feature-specific والحزم الثماني سليمة.

### الأداء والفهارس

المصدر الجديد يقرأ خيارات minimal في استعلام واحد. البحث/التصدير ست قراءات serial على DbContext واحد: vehicle، currencies، invoices، saveditems، receivables، allocations. projection فقط، شرط invoice period/vehicle/posted قبل التحميل، lookups/grouping محلية دون SQL لكل صف. القائمة الأمامية كاملة بpaging محلي؛ كثافة فترة all-time تبقى مرتبطة بحجم فواتير المركبة، ولا cache أو transport paging مخترع. لم تقَس سرعة فعلية أو SQL translation/plan.

قُرئت RentalInvoiceItemConfig وJournalVoucherAllocationConfig: توجد FK indexes وعلاقات ومنع حذف، وفهارس مصادر rentalinterval/charge. مرشح VehicleId+InvoiceId قد يستفيد لاحقًا من index غير فريد (SubscriptionId,VehicleId,InvoiceId) INCLUDE (Amount,Tax,RentalAgreementId,BranchId,IsDeleted) إذا أثبتت خطة المالك scans مؤثرة؛ لا filtered IsDeleted=0 لأنه يستبعد live NULL. المقترح يحتاج مقارنة FK VehicleId وتغطيتها وكلفة كتابة/تخزين وإسقاط projection قبل تبنيه. ليس ضرورة مثبتة ولا تعديل EF/migration. فهرس allocation JournalVoucherId القائم حسب FK نقطة البداية، ولا index إضافي مؤكد له قبل القياس.

على المالك قياس نفس tenant/branch/dataset/vehicle/defaultperiod/alltime بخمس عينات باردة ودافئة وفصل الخيارات/البحث/Excel/render وSQL IO/plan/payload؛ لا claim تحسن زمني من source وحده.

### التحقق المنفذ والباقي

فُحصت syntax ملفات runtime/المواصفات وAngular template بالمحللين المحليين دون Angular compiler/build: لا diagnostics. فحص imports المحلية وإدراج runtime ومطابقة37 مفتاحًا بين العربية والإنجليزية واستهلاكها بلا فجوات. RESX صالح XML والمفتاحان مرة واحدة بكل ملف. مراجع .NET/namespace/globalusing وSDK default source inclusion فُحصت؛ extension namespace مستورد، VM DataAnnotations وconverter من المالك القائم، ومشروع الاختبار يراجع Business/ServerAPI/Helpers. لا compile proof.

مواصفات مكتوبة فقط: ثلاث حالات HTTP frontend؛ إحدى عشرة حالة مالية عبر Fact/Theory و٨ حالات منح backend. لم تُنفذ ولم يدّع RED/GREEN. تدقيق backend القراءة فقط اكتشف ملاحظتي diagnostic/sourcecutoff؛ أصلحهما الجذر وتحقق من المصدر النهائي. راجع الجذر ملف السياسة والاستعلامات والموديلات والقوالب والخدمة والمفاتيح والربط والفروق scoped لكل مستودع، مع فحص whitespace/merge markers للملفات الجديدة أيضًا. لا نتائج مصدرية مؤكدة مفتوحة؛ قبول المحاسبة/المستخدم للعرض وحدود attribution وSQL/runtime منفصل.

استُخدم عامل الواجهة المعاد من مهمة التعرفة بعد تثبيت العقد بملكية مجلد التقرير/موضوع الدليل فقط، وعامل تدقيق backend قراءة فقط؛ كلاهما ورث نموذج الجذر دون override. الجذر امتلك العقد والخلفية والربط والترجمات والقبول المصدرّي، وأكمل مواصفات HTTP والمصالحة بعد تسلم مصدر الواجهة. السبب استقلال الشريحتين بعد تثبيت النقل وعدم تعارض الملفات؛ لا كلفة/زمن موفر مقاس.

لم تُشغّل builds/tests/lint/browser/database/migrations/snapshots/commits/push/deploy، ولا Sigma MCP أو Graphify. الاقتراح الخلفي فقط: fix(reports): read attributed vehicle invoices and effective settlements. اقتراح الواجهة فقط: feat(reports): implement vehicle revenue report with protected complete outputs. لا commit منفذ.

يبقى عند المالك تشغيل البناء/المواصفات والتحقق من SQL وبيانات عدة فروع/مستأجرين؛ فاتورة مفردة/مشتركة/صفر/سداد جزئي وكامل/credit/JV/foreign/futureallocation/void/currentstate؛ cutoff للمصدر والقيد؛ الترقيم الحقيقي؛ countالعقود/التسجيل الحالي؛ إعادة المنح وتغيير الفرع/الدخول وتجديد الاعتماد؛ complete print/Excel across sections/pages؛ RTL/themes/keyboard/responsive/loading ومقاييس الأداء أعلاه. التقرير الحالي يقرأ حالة live/posted الحالية مع cutoff وليس إعادة إنشاء حالة محاسبية تاريخية لمستند أُلغي لاحقًا؛ لا snapshots تاريخية مخترعة.
