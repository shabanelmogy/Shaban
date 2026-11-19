# مراجعة وتنفيذ تقرير التحصيل

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-11-17 |
| Scope | Tier M; UI07 report / BE17; [العقد](COLLECTION_REPORT_CONTRACT_FREEZE.md) |

## نتيجة المراجعة والمطابقة

كان المسار الفعلي Reports/Collection يفتح CollectionComponent القديم: قارئ HTTP لReport/CollectionReport غير الموجود، يفترض شجرة accounts لا يملكها الخادم، يراكم النتائج، يغير أيام التقويم بإضافة يوم، ويمرر agreementBranchId/salesPersonId من مفاتيح نموذج مختلفة. يطلب Branch مرتين وIndividualPartner بدل موظف المبيعات، ولا يعرض Created By أو تفاصيل السندات أو خطأ/إنهاء تحميل مضبوط. لا يوجد قارئ تحصيل مقابل بالخادم. أصبحت الشاشة تقريرًا مباشرًا بمتحكم وخدمة مخصصين وفلاتر typed وتابين مشتركين.

| الجانب | المرجع/المالك | المطابقة النهائية |
|---|---|---|
| الصورة 1.png | محتوى وظيفي فقط؛ ليست إثبات SQL أو معادلة | خمسة مرشحات، الإجمالي، Search/Print/Excel، ٧ أعمدة للتفاصيل وعمودان للملخص؛ تابات بطلب المالك |
| مرجع Speed | فصل11 وفصل16 من دليل27 أكتوبر، وشاشة Reports08/R0414/C0977 من28 أكتوبر | قُرئ الشرح أولًا ثم كود الفلاتر والخدمات والإجراءات؛ لا مقال أصلي مطابق بعنوان Collection في catalog؛ لا نسخ قيود خادم مجهولة أو timezone المرجع |
| مرجع Odoo | اللقطة الرسمية19 بتاريخ2 نوفمبر، payments.rst أول100 سطر | مكمل لفصل الدفع عن تخصيصه وعدم اعتبار تسجيل الشيك تسوية بنكية؛ لا يقرر حسابات Sigma أو سلطته |
| شكل التقرير | UI20/21/6/17/22/26/28؛ ReportPage وReportActions وFeatureTitle وEditorTabs وDataTable، والمرجع StatementOfAccount | كلا الجدولين typed ومسطحان، الأقسام منفصلة حسب عملة أصلية، viewport داخلي واحد لكل تاب، دون جدول HTML خاص أو شجرة وهمية أو شرح داخل الجدول |
| المصدر المالي | BE17/15/9؛ ReceiptService.Read/Approval وCurrencyRateUsage وCustomerDeposit | سند Receipt معتمد حي غير ملغى وقيده المولد المعتمد المرحل مطابق النوع/الفرع/اليوم/العملة، وله سطرا مدين/دائن بالمبلغ الأصلي والحساب والفرع الفعال كما مالك السند؛ DepositReceipt مرة واحدة، لا union للودائع أو التخصيصات |
| الفلاتر | تاريخ السند، BranchId، Agreement branch owner، SalesPersonId، CreatedBy | فرع العقد هو Vehicle.BranchId الحالي وفق BranchScopeRegistry:91 وRentalAgreementService؛ مندوب المبيعات Staff على عقد الإيجار؛ هوية الإنشاء المحفوظة حرفيًا؛ لا تخمين فرع فتح تاريخي أو مندوب لعقد بيع |
| الحقول والنقد | CollectionRowVm وCollectionPaymentMethodVm والأعمدة | التفاصيل VoucherType/VoucherNo/Date/Customer/AgreementNo/PaymentMethod/Amount مع Id وPaymentMethodId فقط للهوية؛ الملخص PaymentMethod/Amount مع Key؛ Total في القسم من الخادم، decimal-string ودقة snapshot، لا جمع عملات أو صفحات بالواجهة |
| الوصول | CollectionReports.Read/Print/Export وPermissionCatalogAction وPermissionPrerequisites وEffectReads | Options يستخدم Read نفسه؛ Print/Export مستقلان مع Read؛ route policy وfirstAllowedRoute وشجرة ترجمة الإجراءات موصولة. لا منح تلقائية أو متطلبات Branch/Staff/User CRUD |
| المخرجات | UI20/21؛ ReportPrintSession وdataTableExportRows وexact formatMoney | Print يعيد القراءة ويجهز كل صفوف التابين، Excel يعيد القراءة ويصدر التاب الملتقط كاملًا بجميع العملات والإجماليات؛ لا صفحة أو مرشح محلي أو تغيير نتيجة الشاشة بالطباعة |
| الدليل | UserGuide/content/collection-report-topic.ts ثم reports-guide.ts | موضوع عربي/إنجليزي في /UserGuide/reports يغطي المصدر والمرشحات والتبويبات والعملات والمخرجات والأخطاء والصلاحيات وحدود فرع العقد |

إجمالي Amount هو المبلغ الأصلي قبل عمولة البطاقة وضريبتها؛ لا تسوية بنكية ولا إيراد مستنتج. فقدان أو تعارض دليل العملة يفشل القراءة برسالة واضحة. ملخص طرق الدفع يجمع حسب الهوية لا الاسم، ويضيف الطرق الحية صفرية النشاط، ويحفظ الهوية والتسمية الملتقطتين مع الصف المالي إن تغير تعريف الطريقة بين القراءتين، ويجمع غير المتاح مرة واحدة. لا بيانات تجريبية قديمة مُرقّعة أو fallback للعملة.

## المصدر والتحميل والعمر

| العملية | تصنيف المصدر/التقدم | العمر والإبطال |
|---|---|---|
| Options | قراءة تشغيلية مباشرة مخصصة للتقرير؛ طلب HTTP واحد وأربع قراءات SQL خيارات محدودة بالقبض المؤهل والفروع؛ ليست مصدر cache مرجعي معتمد | bootstrap عند فتح التقرير/تغير السياق، global LoadingService داخل defer/finalize؛ تحفظ الخيارات بعد فشل تقرير مستقل وتتاح Retry عند فشل التمهيد |
| Read | قراءة مالية مباشرة كاملة بلا cache | Search فقط بعد تحقق typed؛ استبدال النتيجة، أيام محلية دون إزاحة؛ تحميل الصفحة مرة واحدة، وإلغاء عند الفلاتر أو الجلسة أو السياق/الإصدار أو destroy |
| Print/Export | قراءة مالية كاملة جديدة بنفس الفلاتر المطبقة، ومنحة مستقلة | التقاط التاب/السياق والإصدار والتحقق قبل المخرج؛ إلغاء تنزيل/إطار طباعة قديم. الطباعة المفتوحة يملكها المتصفح، وبعد نهايتها يعاد تمهيد الخيارات إن تغير السياق وأصبح بحاجة إليها |
| اللغة/الوصول | TranslateService وAuthService وAccessViewPolicyService | مراقبات محلية مرتبطة بـDestroyRef، إغلاق overlays عند تغيير السياق، لا watch/cache جديد أو SignalR مالي |

المسار pages/routing.ts:Reports ثم reports.routes.ts:Collection لا يعطل showPageLoading؛ LayoutComponent يختار showPageLoading إلا إذا false ويرسم sigma-shell__loading في layout.component.html:64 من LoadingService.isLoading$. الجدول يعطل مؤشره المستقل. الأخطاء Result/HTTP لها مالك inline واحد بواسطة X-Skip-Error-Interceptor وStateMessage.compact داخل الفلاتر، وإعادة نفس العملية تستعيد العمل، ولا كتلة72px أو Retry منفصل للتقرير. هذه مطابقة مصدرية؛ ظهور الحمل فعليًا في المتصفح غير مثبت.

## الأداء والـSQL والفهارس

القارئ يعيد مجموعة كاملة مرتبة بتاريخ السند ثم هويته؛ إسقاط مالي واحد يجلب دليل العملة والتسميات المسموحة ثم قراءة طرق الدفع. المصدر نفسه يزود الصفوف والإجماليات الدقيقة عبر FinancialNumberPolicy.SumCurrencyReadAmounts بعد قراءة المجموعة الكاملة، كمالك ProfitLoss القائم، لتجنب اختلاف إجمالي قراءة ثانية مع الصفوف. لا حساب واجهة أو N+1. جُمّعت مبالغ الطرق مرة واحدة في قاموس بدل مسح الصفوف لكل طريقة. توجد استعلامات مترابطة لإثبات القيد وسطرَيه ضمن SQL نفسه؛ ترجمتها وخطتها وحملها على أحجام فعلية تحتاج القبول.

القارئ القديم لم يملك endpoint صالحًا، لذلك لا يوجد توقيت ناجح سابق للمقارنة. أزيل طلب Branch المكرر وطلب IndividualPartner العام؛ أضيف طلب خيارات واحد بأربع إسقاطات مباشرة. خيارات المندوب/المنشئ مأخوذة من السندات المؤهلة؛ ليست بحثًا عامًا في بيانات المستخدمين. لا إعادة بحث عند الانتقال بين التابين.

ReceiptConfig يعلن علاقات FK وفهرس SalesQuotation الفريد المشروط، وتظهر فهارس FK في snapshot. لا composite خاص بالتاريخ/الفرع معلن في config؛ تغطية قاعدة البيانات الفعلية غير مقاسة. لا فهرس أو schema جديد: يلزم خطة SQL وقياس انتقائية الاشتراك/الفرع/اليوم والسند/تفاصيل القيد أولًا، مع تقييم تكلفة الكتابة والتداخل قبل اقتراح مفاتيح/INCLUDE. زمن SQL/الشبكة/render وأحجام النتائج وخطة التنفيذ والقراءات قبل/بعد كلها معلقة، ولا ادعاء سرعة مقاسة.

## التحقق المنفذ وحدوده

نجح البناء النهائي للخادم واعتمادياته ومواصفاته بالأمر dotnet build tests/SiGma.BranchAccess.Tests/SiGma.BranchAccess.Tests.csproj --no-restore --verbosity minimal مع OutDir تحت F:/My Work/Sigma/.codex-build/collection-report/ وUseAppHost=false: exit0، صفر أخطاء و٤١ تحذيرًا، زمن٣٦٫٠٢ ثانية. يتضمن العدد أربعة تنبيهات xUnit2031 أسلوبية من المواصفات الجديدة و٣٧ تحذيرًا قائمة؛ ليست كلها قديمة. قرأ الجذر نهاية السجل .codex-build/collection-report-build.log الذي يثبت النتيجة. سبق أن كشفت محاولة أولى نداء resolver داخليًا غير متاح في مواصفة، فصُحح لاستخدام metadata العامة قبل البناء النهائي. لم تُشغّل الاختبارات. ملفات المواصفات تحمل١٤ حالة للخادم و١٤ للواجهة، وهي أدلة مصدر وتجميع وليست نتائج نجاح تشغيل.

ملفات التغيير: واجهة Reports/Collection (المكون وقالب/SCSS والنموذج والخدمة ومالكا العرض والوصول والمواصفات)، ومسار الوصول وPermissionTree وترجمات collection-report/en/ar/authorization ودليل collection-report-topic وربطه بدليل Reports. الخلفية ICollectionReportService وCollectionReportService وCollectionReportsController وثمانية DTOs تحت ViewModels/CollectionReport، مع سطري إعداد قراءة الفروع ومتطلبات المنح وملفي المواصفات. لم يُغيّر API أي تقرير آخر أو مالك إنشاء/اعتماد سند القبض.

نجح Angular compiler الموجه --noEmit بالهدف المؤقت tsconfig.collection-check.json: مكون التقرير والقالب وخدمته، مواصفات المكون والخدمة، route policy، PermissionTree، دليل Reports، والترجمتان وترجمة الصلاحيات. شُغل متتابعًا بعد بناء الخادم لتجنب ضغط الذاكرة، بحد heap1024MB. حُذف config المؤقت بعد النجاح. نجح تجميع SCSS عبر sass.compile، وفحص26 مفتاح ترجمة ثابت وتساوي مفاتيح اللغتين، وgit diff --check في النطاق. لم يعد مسار HTTP القديم أو mapper الشجرة/خطأ paymentMehod أو إضافة اليوم موجودًا في ميزة Collection.

جرت مطابقة واجهات DTO/TS ونطاق الملفات ومراجعة الفرق في كل مستودع، مع الحفاظ على التغييرات الأخرى. راجع الجذر القالب والمكون والخدمة والعرض والمواصفات ومالك الطباعة والأعمدة، والخادم والفلاتر وملكية القيد والفروع والـmetadata وprerequisites ومواصفاته. لا AutoMapper مطلوب لإسقاط read-only، ولا تعديل للكيانات أو schema أو migration.

تحقق PrimeNG MCP الرسمي من Select (reactiveforms) وDatePicker (range). اجتازت bindings المدعومة validate_usage؛ أبلغ الفحص الأول عن appDatePicker لكونه directive مشروع خارج metadata المكتبة، فأعيد فحص خصائص PrimeNG وحدها بنجاح، وأثبت Angular compile ربط directive المحلي. المصادر: https://primeng.dev/select وhttps://primeng.dev/datepicker. هذا لا يثبت أبعاد الواجهة أو السلوك الحي.

حُدثت الحزم المولدة بواسطة generator وحده بعد كشف drift في phase00/02/03/04/05/06، وبقيت المراجع وأدوارها للأنماط الصحيحة، ثم نجح -Check للحزم الثماني. لم تُعدّل يدويًا. العقد وخطوات المطابقة استهلكا phase01/02/06 بعد التحقق.

استُخدم وكيلان وارثان لنموذج الجذر وفق بوابة التفويض بعد تجميد العقد: collection_backend يملك الخلفية ومواصفاتها، وcollection_frontend_specs يملك ملفي مواصفات الواجهة الجديدين فقط؛ الجذر يملك الاكتشاف والقرارات والواجهة والترجمات والدليل والوثائق والمصالحة. استُخدم التوازي لتقليل زمن التنفيذ مع عدم تداخل الملفات؛ عمليات البناء متتابعة للذاكرة. لم تُشغّل tests أو lint أو متصفح أو قاعدة بيانات أو migration أو commit أو push أو نشر.

## التسليم والقبول المتبقي

يلزم تشغيل API بأحدث بناء؛ مخرجات البناء المعزولة لا تستبدل خادم المستخدم الجاري. على المدير منح CollectionReports.Read وللطباعة/Excel المنحتين المقابلتين عند الحاجة؛ لا تغيير بيانات منح في هذه المهمة. يراجع المالك الفلاتر الخمسة والتبويبين والصفر/النتيجة الفارغة والأخطاء، الحساب والعملات والدقة وعدم تكرار وديعة، والسياق والفرع الممنوع والسحب/إعادة المنح، والمخرجات الكاملة بعد تصفية/تغيير صفحة، ثم المقاسات وRTL والثيمين والتحميل والتوقيت على SQL الفعلي. لا هجرة معلقة لهذه الميزة.

اقتراح commit للواجهة: Rebuild Collection Report with shared tabs and protected complete outputs. اقتراح الخلفية: Add scoped posted receipt collection reporting with currency sections. اقتراح الوثائق: Record Collection Report contracts and source reconciliation. هذه اقتراحات فقط.


## متابعة مالك القراءة المشترك — ١٨ نوفمبر ٢٠٢٦

فُصل فحص معرّفات سندات استعمال الوديعة في استعلام مستقل قبل قراءة النتائج، لحفظ مرشحات الفروع عند بناء التقرير والخيارات. تستهلك شاشة التحصيل والتقرير الأول نفس مالك المصدر. تبقى عقود العرض والحسابات العامة محفوظة، والتغيير الأمني وتكلفة الاستعلام الإضافي ونتيجة البناء والقبول المتبقي موثقة في [مراجعة التقرير الثاني](COLLECTION_REFUNDS_2_REPORT_FEATURE_REVIEW.md).
