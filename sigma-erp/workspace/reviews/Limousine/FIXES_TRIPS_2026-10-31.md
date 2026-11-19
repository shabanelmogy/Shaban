# تنفيذ إصلاحات واجهة الرحلات — ٣١ أكتوبر ٢٠٢٦

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| النطاق | واجهة TripBooking فقط، سبعة ملفات؛ الخلفية والترجمة والدليل بملكية الجذر/المسار الخلفي |
| التفويض | طلب المالك إصلاح الملاحظات ثم الاستكمال، والخطة المجمدة للشرائح المستقلة؛ الفرع المستقل معتمد صراحة |

## المصادر والقرار

استُكملت تغييرات المسار السابق التي توقفت قبل إتمام الدوال والنماذج. قُرئت تعليمات مساحة العمل والمهارة والخطة المجمدة ومراجعة الرحلات السابقة، والكتل الحالية UI2/13/19/22/28، ومرجع محرر أعمال الورشة والمالكون الفعليون ReferenceLookupBindings/ReferenceLookupStatus/FinancialNumberPolicyService/DocumentUploadTracker. أدلة المرجع الوظيفي والبصمات المقروءة في مراجعة اليوم السابقة باقية؛ لم تُستخدم لترخيص طابور أو تخصيص إجباري أو حساب مالي جديد.

| ما تغير | التنفيذ والمالك الفعلي | النتيجة المصدرية |
|---|---|---|
| فرع الحجز | أضيف branchId:number إلى Create/Update وbranchId nullable/branchName إلى Details. نموذج المحرر يفرض required وInt32 موجب؛ الافتراضي من CurrentBranch في Create وحده. القراءة المحفوظة تملأ الفرع دون اشتقاق من المركبة | العقد متوافق مع VM الخلفية المعدلة؛ التاريخ غير المعروف يظهر «الفرع غير مسجل»؛ لا backfill أو افتراض هوية |
| تهيئة المراجع | قائمة الرحلات والمحرر يستخدمان finite forkJoin مع defaultIfEmpty(null) وفحص نجاح/جاهزية، ثم bindReferenceLookups فقط بعد النجاح | يظل فشل الضريبة أو المال أو الخيارات خطأ مع Retry، ولا يعد إكمال الكاش الفارغ قائمة ناجحة |
| الكاش النشط | القائمة تتابع Branch/Vehicle/Customer؛ المحرر يتابع Branch/Customer/Supplier. كل binding يمرر selectedIds/currentRows، وتحتفظ خيارات المحرر غير المتاحة بالتسمية المعطلة فقط | لا تغيير قيمة/dirty أو إعادة حساب من callback؛ watch منفصل ومرة لكل مفتاح في الجلسة؛ takeUntil للسياق وتدمير المكون |
| تحميل التهيئة | ReferenceLookupStatus في الصفحة بloading flags وخطأ/Retry، بدون StateMessage تحميل إضافي بالمحرر | مالك صفحة واحد؛ busy/تعطيل المرشحات باقٍ أثناء التهيئة؛ تجديد محتوى مخزن يبقى صامتًا |
| قراءة نوافذ التعيين/الإرسال والتاريخ | dialogReading يملك StateMessage محليًا وaria-busy، بلا startLoading عام لهذه القراءة؛ showLoadingIndicator=false لجدول التاريخ | لا يختفي المؤشر خلف overlay ولا يعاد إنتاج mask ثانٍ؛ الكتابة تبقى بالمالك العام وguards الحالية |
| فشل الضريبة | نتيجة taxSettings جزء من lookupError/settingsReady في القائمة | فشل الضريبة وحده يفتح Retry ولا يترك زر الإنهاء معطلًا دون تفسير |
| التعيين الإجباري | بناءً على قرار المالك اللاحق بالاستكمال لأقرب سيناريو صحيح واعتماد التوصية: أضيف forceAssignment وassignmentReason إلى طلبي Assign/Dispatch فقط. السبب غير الفارغ مطلوب عند التفعيل وبحد ٥٠٠، ويخرج null عندما يكون التعيين عاديًا. كلا الحقلين يعادان إلى false/empty لكل جلسة | لا تجاوز للتوافر أو التداخل ولا افتراض وجود طابور؛ جدول التاريخ يعرض الحقيقة والسبب منفصلين عن Notes، والخلفية تحفظ الحدث ولقطة السائق |
| العداد | EndKms في نموذج الإنهاء مصنف meter، مع QUANTITY_DECIMAL_PLACES وdecimalScaleValidator | يرفض مقياسًا زائدًا عند فحص النموذج، لا تعديل قيمة للمدخل خلفيًا؛ الخلفية/EF في المسار الآخر يطابقان الست منازل |
| المال | قراءة FinancialNumberPolicyService.load(true) ضمن bootstrap، نجاح وledger compatibility مطلوبان. financialScaleValidator لكل Charges/Tax/Discount/SupplierCharges ولإنهاء الرحلة. step من decimalStep فقط، دون خفض maxFractionDigits للمال | لا تقريب صامت يسبق الرفض؛ preview يستخدم documentTax المشترك بدقة السياسة، والخادم يظل مالك الضريبة النهائية. لا كاش مرجع جديد لسياسة المال |
| السياق والتأكيدات | contextRevision + Subject لإلغاء القراءات والمخرجات الكاملة/إعداد الطباعة، ومسح النتائج/الأعداد/الخيارات/الجلسة. تأكيدات الحذف/التجاهل ومخرجات الكتابة تفحص الإصدار | الكتابة المرسلة لا تتلقى takeUntil للسياق، وردها القديم لا يغادر/يجدد جلسة جديدة. المحرر المبطل لا يعاد تفعيله بنفس instance حتى لو تبدل param؛ يرجع المستخدم للقائمة ثم يعيد الفتح |
| المستندات | لا cleanup لمسارات سياق سابق؛ runCleanup محروس بالسياق وإصداره، والمحرر المبطل لا يحفظ أو يحذف أو يعيد فتح طلبًا من معرف سابق | pending uploads غير المعتمدة تبقى لآلية انتهاء الملفات اليتيمة القائمة؛ لم تُضف آلية حذف/تخزين جديدة |

## مصادر الطلبات وتصنيفها

جميع المسارات مسبوقة بـenvironment.baseUrl والمظروف Result/Results الحالي محفوظ.

| المصدر | التصنيف | المستهلك/العمر |
|---|---|---|
| Branch/GetSelect، Customer/GetSelect، Vehicle/GetSelect | مرجع مخزن معتمد؛ مصدره/كتابه/topic الحالي بلا تعديل | finite في القائمة ثم watch منفصل؛ حفظ التسمية المختارة؛ إلغاء bindings القديمة قبل إنشاء جلسة سياق جديدة |
| Supplier/GetSelect عبر SupplierService | مرجع معتمد | finite المحرر ثم watch، retain disabled للهوية المحفوظة الغائبة؛ لا إعادة دمج detail من سياق قديم |
| TripType/GetSelect، Location/GetSelect، VehicleType/GetSelect، Driver/GetSelect | مرجع مباشر بلا opt-in من خدمته | finite bootstrap فقط؛ لا يعد غياب watch عيب كاش هنا |
| Vehicle لقائمة مركبات المحرر | قراءة تشغيلية مباشرة بالنوع/اللوحة كما في العقد القائم | لم تستبدل بمرجع Vehicle/GetSelect الأضيق الذي لا يحمل نوع المركبة؛ الإلغاء عند الجلسة/التدمير |
| LimousineSettings، SettingsCommonModel/GetMySetting عبر TaxSettings | تشغيلية/استثناء singleton بحسب مالكها الحالي | finite وفشل مطلوب؛ لا افتراض settings من نفس معرف في سياق جديد |
| Currency/GetFinancialNumberPolicy | سياسة مالية مباشرة بمالكها الحالي | finite force reacquisition عند retry/bootstrap؛ لا opt-in جديد ولا reprice من watch |
| TripBooking، GetByWithNavigationsId/{id}، كل صفحات التصدير/الطباعة | تشغيل مباشر | switchMap للقائمة؛ sessionReads/contextReads للقراءات فقط؛ طباعة التحضير cancelPending |
| TripBooking/History/{id}، AvailableResources/{id} | تاريخ/توافر مباشر | نافذة محلية؛ هوية وإصدار وإلغاء سياق؛ الفشلان مع Retry. موارد التوافر لا تخزن في الكاش |
| POST/PUT/DELETE والإجراءات | كتابة مستقلة | تدمير المكون فقط وفق المالك القائم، لا إلغاء عند السياق، guards للرد/التأكيد القديم |

## العقود المحفوظة والتحقق

أعمدة قائمة الرحلات وListVM ومرشحاتها وحالات الإجراءات والـAPI endpoints والمبالغ والوثائق لم تتغير. التغييران المتفق عليهما هما فرع التفاصيل/الكتابة وحقلا التعيين الإجباري/سببه في الإجراء والتاريخ؛ لم يُضف عمود قائمة غير مستهلك أو ListVM زائد. استُخدم مصدر الفرع المستقل في الخلفية بتكامل الجذر. لا استنتاج لتتبع حي أو تحويل عرض أو رسوم مفصلة أو صلاحيات من المرجع، ولا تغيير حالة/أثر مالي جديد.

قُرئ فرق الملفات السبعة كاملًا، وفحص git diff --check للنطاق خالٍ. بحث المستهلكين المباشرين لأنواع TripBookingCreateDTO/UpdateDTO/DetailsDTO لم يجد مستهلكًا خارج مجلد الرحلات يحتاج تحديثًا. المكونات تستورد المالكين الفعليين، ودوال bindReferenceLookups/clearOptions/options/savedLabel وحقول branch أصبحت متسقة بعد الجزء المتوقف. لا ملف runtime جديد أو تعديل tsconfig مطلوب.

لم تُشغّل builds/tests/lint/browser/database/Graphify/migrations/commits. source-only لا يثبت compilation أو توقيت الظهور أو التزامن الفعلي. للتحقق عند المالك: فشل الضريبة وحدها ثم Retry، إبطال السياق أثناء bootstrap/تأكيد/قراءة حوار/تصدير/تحضير طباعة/كتابة مرسلة، حفظ فرع رحلة خارجية ثم العثور عليها بمرشح الفرع، عرض رحلة قديمة بلا فرع، رفض مقياس زائد للمال والعداد، واختبار جميع الحالات بالاتجاهين والثيمين والأحجام. لا تحسين زمن مقاس؛ قراءات السياسة الإضافية لازمة للعقد المالي وليست ادعاء تسريع.

لا ترحيل أو backend edit في ملكية هذا المسار؛ يدمج الجذر schema migration المقترح من العامل الخلفي. مفاتيح الترجمة المرسلة للجذر: tripBooking.contextChanged وtripBooking.branchUnknown وtripBooking.forceAssignment وtripBooking.assignmentReason، مع إبقاء branch القائم. دليل المستخدم بملكية الجذر. لم تنشأ قدرة مشتركة جديدة: استُخدم المالك المشترك لكل من المراجع والحالة والدقة والطباعة وتجميد النموذج.
