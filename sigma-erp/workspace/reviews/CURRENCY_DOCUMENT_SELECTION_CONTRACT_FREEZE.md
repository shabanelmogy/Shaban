# عقد اختيار عملة الحركة المستقلة

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | 2026-11-04 |
| التفويض | إصلاح منع تغيير عملة الحركة بأي شاشة بها طرف وعملة، المثال Bill؛ البيانات القديمة تجريبية ولا حلول توافق مخصصة لها |

## السبب والنطاق

تعريف الشركة والفرد والمورد يسمح بتغيير currencyId؛ لا قفل تاريخ مثبت فيها. السبب بالحركات: DocumentCurrencyComponent عرض فقط، وDTOs ثمانية مالكين لا ترسل CurrencyId؛ الخدمات تفرض default الطرف وبعضها يعيد مقارنته عند التعديل. يستهلك هذا العقد السياسات المالية المعتمدة في خطة العملات وعقود الدقة واللقطات، ولا يفتح ترحيل الأجنبية أو التخصيص أو التقييم. لا تغيير صلاحيات أو هجرة أو snapshot مولد. المقصود عملة الحركة المستقلة، لا إعادة كتابة عملة الطرف.

الهدف الأول Bill بكامل المسار مع مالك مشترك قابل لإعادة الاستخدام، ثم المصالحة مع المستهلكين الآخرين حسب وضع المستند ومصدره الحقيقي. سعر as-of≤يوم الاعتراف، الأولى تحفظ وتستهلك السعر، ordinary save يحتفظ باللقطة، تغيير التاريخ الصريح يبقي الأصل، تغيير العملة يحول المدخلات الحالية. لا Number للسعر أو المال الجديد؛ تستخدم DTOs المال النصي والمساعد المالي الحالي والتقريب AwayFromZero. لا backfill أو استنتاج أصل أجنبي من سعر اليوم. البيانات التجريبية لا تبرر precision خاطئة.

## العقود المشتركة المجمدة

في Currency/models وbackend ViewModels/Currency:

- CurrencyDocumentSnapshotVM/TS CurrencyDocumentSnapshot: usageId:int?، recognitionDate:yyyy-MM-dd، quote:CurrencyRateQuoteVm/DTO القائم.
- CurrencyDocumentPreviewVM/TS CurrencyDocumentPreview: previousUsageId:int?، previousRecognitionDate:string?، target:CurrencyDocumentSnapshot (بلا usageId). يرسل عند معاينة مقبولة فقط؛ السابقة تخص المحفوظ الأصلي حتى مع تحويلات متعددة غير محفوظة.
- CurrencyConversionPreviewRequestVM: source:CurrencyDocumentSnapshot?، targetCurrencyId:int، targetDate:yyyy-MM-dd، amounts:List<string> (حد10000). النصوص مالية strict16+6 وتفحص كسور المصدر. source=null يسمح فقط قائمة فارغة لاختيار أولي بلا تحويل. source ذوusageId يطابق دليل الاستخدام المقروء ضمن الاشتراك؛ غير المحفوظ يطابق السعر المؤرخ كاملًا.
- CurrencyConversionPreviewVM: source:CurrencyDocumentSnapshot?، target:CurrencyDocumentSnapshot، amounts:List<string>. عند تغير العملة يحول amount×sourceRate÷targetRate مرة بكسور الهدف؛ عند نفس العملة يبقي الأصل. ترتيب amounts ثابت، والنتيجة نصوص بكسور الهدف؛ لا إجماليات مشتقة موثوقة أو قيد فرق.
- POST Currency/ConversionPreview قراءة تشغيلية لا تستهلك سعرًا، تفشل برسائل CurrencyAmountInvalid/RateMissing/PreviewStale القائمة. ICurrencyService.PreviewConversionAsync.
- ICurrencyService.GetDocumentSnapshotAsync(EntityBase saved, DateTime recognitionDate, CancellationToken): دليل محفوظ يطابق guid/type/currency/day، أو الأساسية فقط بلا usage إذا لم يوجد دليل. لا يستنتج الأصل الأجنبي بلا دليل.
- ICurrencyService.ResolveDocumentSelectionAsync(int? currencyId, DateTime recognitionDate, CurrencyDocumentPreviewVM? preview, EntityBase? saved, DateTime? savedRecognitionDate, CancellationToken): يرجع CurrencyDocumentSnapshotVM. بلاpreview للمحفوظ: currency/date يجب أن يبقيا كما هما ويستعمل الدليل المحفوظ. معpreview: يطابق previousUsageId/previousRecognitionDate مع المخزن ثم يطابق target كاملًا مع سعر الخادم الحالي. للجديد: resolves CurrencyId الصريح أو الافتراضي الذي يحله المالك، ويتطلبpreview للأجنبية؛ الأساسية يجوز بلاpreview. يتحقق كل ذلك تحت قفل Currency ضمن معاملة المالك عند الكتابة.
- CurrencyService.DocumentUsageExpectation(snapshot) static يحول اللقطة لتوقع CurrencyRateUsage فقط، لا دليل محفوظ. save يظل مالك الاستخدام الحقيقي تحت قفل DB.
- SiGmaDbContext.AuthorizeBillCurrencySnapshotChange(Bill,int? previousUsageId,CurrencyRateUsage expected)، ClearBillCurrencySnapshotChange(Bill): الجذر يضيفها مع تحقق pending/notvoided/nopostedjournal في حد الحفظ؛ تتبنى نفس مقارنة target/sequential revision الحالية. BillService يستعملها في try/finally لحفظ معاينة مقبولة فقط، ويحفظ guardإمكانية التعديل والحالة والمصدر/التخصيص/الإقفال الحالي.

## ربط Bill

تضيف Add/Update CurrencyId nullable وCurrencyPreview optional. Detail يضيف CurrencySnapshot ومقياس moneyDecimalPlaces للعرض. خدمات preview/Add/Update تحترم الاختيار الصريح للحركة المستقلة، وتعزل default المورد لحظة إنشاء جديد أو تهيئة أولى فقط. تغيير المورد لا يغير عملة حركة محفوظة ولا يشترط تطابق default الجديد معها. إن كانت الفاتورة من PO/GRN توحد عملة المصادر ويلزم أن يطابقها أي اختيار؛ تعرض الواجهة سبب القراءة فقط. لا يحول مبلغ مصدر مالي منفردًا إلى عملة أخرى في هذا التصحيح.

يفحص BillService الحالة والفترة/المصدر الحالي قبل السماح بتبديل لقطة. ordinary save يحفظ الأصل/السعر؛ preview يحسب مبالغ السطور/الخصم/تسوية الضريبة من المدخلات الحالية. يحسب الخادم الضرائب والإجماليات بعد التحويل. مفاتيح النسب والكميات والهويات لا تحول. Loan schedule يملكه مالكه ويعاد تعريفه بعد تغيير المال؛ لا ترحيل أجنبي يُفتح. يراجع تنفيذ مقياس22,6 ومستهلكي DTOs المباشرين عند توصيل المال النصي، ويبلغ المالك بالمخطط بلا migration.

## سطح المكوّن المشترك

يوسع DocumentCurrencyComponent القائم؛ يبقى العرض default للمستهلكين غير الموصّلين، ولا يصبح CVA مكررًا. Inputs الجديدة: editable:boolean=false، date:Date|string|null، snapshot:CurrencyDocumentSnapshot|null، previousUsageId:int|null، previousRecognitionDate:string|null، amountTexts:readonly string[]=[]، disabled:boolean=false، lockedReason:string=''. Output selectionChange:{currencyId:number,snapshot:CurrencyDocumentSnapshot,preview:CurrencyDocumentPreview|null,amounts:string[],initial:boolean}; Output pendingChange:boolean.

عرض الاختيار داخل نفس الحقل مع زر «معاينة وتطبيق». يهيئ أول اختيار للمسودة الجديدة من default الطرف/الأساسية فقط قبل أول اختيار مستخدم؛ لا watch يعيد كتابة عملة مقبولة. snapshot المحفوظ هو مصدر العرض والتاريخ والسعر. تغيير التاريخ لا يحدث تلقائيًا؛ يحتاج معاينة، ويعلن selectionValid()/busy()/canDeactivate() للمالك (عبر ViewChild) لحماية المسودة/الحفظ. يأخذ amountTexts الحالية قبل بدء القراءة، ويعيد converted amounts عند القبول بعد confirmation مشترك؛ لا يطبق نتيجة متأخرة تغيرت مدخلاتها/سياقها. يملك lookup bootstrap/page scope، وقراءة المعاينة global عند الحقل (لا حوار قراءة body)، وقفل parent عبر pendingChange؛ تبقى confirm local مرئية. Currency/GetSelect كاش معتمدbootstrap/watch، quote/preview تشغيلية بلاcache. فشل يحفظ اختيار/مدخلات الأصل، cancel لا يغير parent.

الجذر يملك البنية المشتركة/الترجمات/التكامل النهائي والمصالحة. مالك خلفية Bill يملك BillService partials/DTOs وconfig/entity الحساب الضروري وProfiler/interface/controller للفاتورة فقط دون shared Currency/DbContext. مالك واجهة Bill يملك Bill/components/details وmodels/service والدليل الخاص فقط دون DocumentCurrency أو المشتركات/الترجمات/tsconfig. لا تداخل كتابة، ولا تنفيذ build/tests/lint/browser/DB/migrations. تتبع باقي الأنواع بعد تجميد تفاصيل مالكيها؛ لا تُعلن مفعلة لمجرد توسعة المكوّن المشترك.

## استكمال العقد أثناء التكامل — ٢٠٢٦-١١-٠٤

تأكيد المالك أن البيانات القديمة تجريبية: لا backfill أو مسار إصلاح بيانات خاص بها. المنطق الجديد يحتفظ بدليل أول حفظ ويعتمد المدخلات الحالية عند التحويل.

يضاف للمكوّن `currencyLocked=false` لقفل اختيار العملة وحده مع بقاء معاينة تاريخ جديد أو تحديث السعر؛ ويضاف `preferredCurrencyId=null` لتهيئة المستند الجديد من عملة مصدر صريحة قبل افتراضي الطرف. لا يعيد أي منهما كتابة اختيار مقبول. المستند المرتبط بأمر شراء/استلام يستعمل هذا القفل الجزئي.

عند تغيير التاريخ والعملة معًا، يلزم قبول معاينة التاريخ بالعملة الحالية أولًا، ثم تحويل العملة. ترفض واجهة التحويل طلب تغيير عملة بين تاريخي اعتراف مختلفين. هذا يطابق قرار الخطة ٩-أ/D2، ويمنع استعمال سعر تاريخ قديم مع هدف بتاريخ جديد ضمن تحويل ضمني واحد.

الفاتورة ذات قيد يومية مولد قائم تثبت العملة وتاريخ الاعتراف ولا تقبل تجديد اللقطة، ولو كان القيد غير مرحل بعد إلغاء الاعتماد. إعادة إنشاء دليل يومية مولدة سابقًا تحتاج مالكها المحاسبي؛ لا يُفتح حارس اليومية لهذا الغرض في هذا التصحيح. يعرض `currencySelectionLocked` هذا الحد للواجهة، ويحميه الخادم أيضًا. التعديلات الأخرى المسموحة تحتفظ باللقطة. ليست هذه معالجة بيانات قديمة؛ بل حماية أثر محاسبي قائم.

قراءة المعاينة `POST` تستعمل `NAVIGATION_READ_ONLY` مع مالك التحميل العام. تعرض نافذة التأكيد أول عشرة أزواج أصل/هدف وعدد الحقول الكامل، دون جمع أسعار وخصومات وحقول مختلفة في إجمالي مضلل. حقول مبالغ قائمة/تقرير Bill المباشرة تعتمد النقل النصي وكسور العملة مع توصيل المنتج والمستهلك معًا.

عند إدخال مصدر لفاتورة جديدة: إذا لم توجد سطور أو خصم أو تسوية ضريبة أو خطة قرض، يجوز إعادة التهيئة بعملة المصدر الصريحة. إن وجدت مدخلات مالية وكانت عملة المصدر مختلفة، يُرفض تطبيق المصدر وتُحفظ المسودة كما هي مع طلب معاينة التحويل أولًا؛ لا يُصفّر أي مبلغ ضمنيًا. المصادر المتطابقة في العملة تتبع السلوك القائم، وتبقى قيود تغيير مصدر فاتورة محفوظة كما هي.

تستعمل قراءة خطة القرض المحفوظة داخل تفاصيل Bill نوعين محليين `BillSavedLoanPlanVM` و`BillSavedLoanEMIVM` بأموال نصية؛ لا تمر المبالغ عبر JSON number ثم String ولا يتغير عقد القروض المشترك. المخطط القائم للقرض18,2 يظل حدًا مستقلًا، فلا تُقبل عملة ذات كسور أكثر من2 مع خيار القرض إلى أن يتبنى مالك القرض الدقة الموسعة.

## الأدلة والبوابات

الشكل08 المالي، UI1/2/13/14/16/19/22/28/29 وBE3/8/15. قراءة عيب المصدر الفعلي وعقد اليومية كمرجع مالي موجود. سبيد2026-10-28 شاشة18/09 وR0307/C1229 دليل اختيار العملة الوظيفي، مع حساب/قفل سيجما بقرار المالك. قُرئ محتوى Billing Settings S040/S041: يثبت الائتمان وTRN والإعفاء الضريبي ولا يثبت نصه اختيار العملة؛ لا يُنسب إليه هذا القرار. لا صور أو قياس تشغيل مثبت. الفحص الوصفي للحزم الثماني ناجح. الاستعلامات مشتركةتعريف/دليل/quote واحد لكل معاينة لا لكلحقل؛ مصادقةالسعرأثناءsaveتحتقفلالقائم؛ SQL/زمن/RTL/ثيم/متصفح قبولمالك. لا فهرس جديد حتى تغير predicate مثبت.

## السياسة الأحدث للقيد المولد — ٢٠٢٦-١١-٠٤

حلّ [عقد تحديث المسودة وقيدها المولد](CURRENCY_GENERATED_DRAFT_SELECTION_CONTRACT_FREEZE.md) محل قفل أي مستند لمجرد وجود قيد. اعتمد المالك تحديث المصدر وقيده المملوك غير المرحل معًا، بشرط غياب التخصيص والأثر النهائي. يبقى النص السابق سجلًا تاريخيًا للقرار المنسوخ، ولا يُستهلك بوصفه القاعدة الحالية.

## مصالحة مولدات الفواتير ذات المصدر الأساسي — ٢٠٢٦-١١-٠٤

أثبت فحص Invoice/core-editor وInvoiceService وRentalInvoiceSourceService وRentalInvoiceGenerationService أن الإنشاء الحالي مرتبط باتفاقية أو مصدر، ويحسب مال مصدره بالأساسية وينشئ قيدًا مرحلًا. لا توجد فاتورة مستقلة مثبتة في هذا المسار، ولا دورة مسودة نفتحها ضمن إصلاح الاختيار. يظل قفل عملة المصدر والمرحّل مشروعًا، وتوضح الواجهة سببه.

الفجوة المثبتة: كان InvoiceService يستبدل عملة المصدر بافتراضي العميل، بينما يرفض مولد الإيجار العميل أو السائق صاحب الافتراضي الأجنبي رغم حساب المصدر بالأساسية. الأنسب وفق توجيه المالك «طبق أنسب سيناريو»: تثبيت عملة المصدر الأساسية الفعلية وإزالة شرط تطابق افتراضي الطرف معها. لا تُحوّل الأرقام الاسمية ولا تُفتح الأجنبية للترحيل ولا يتغير مستند محفوظ. يظل تبني السلسلة الدقيقة الكاملة لهذه المولدات شرطًا مستقلًا قبل فتح اختيار أجنبي فعلي. هذه مصالحة لعقد المصدر القائم، وليست ترحيل بيانات أو تكوين سياسة سعر جديدة.
