# عقد تبني وصول منتقي عملة المستند

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | ٢٠٢٦-١١-٠٧ |
| النطاق | DocumentCurrencyComponent وtests اختيارات الوصول الاختيارية؛ يمهّد إيصال عقد البيع المدمج |
| المستثنى | تغيير تسعير/تقريب/FX/قبول مالي أو API أو schema؛ تبني كل مستهلكي العملة تلقائيًا |

## العقد الاختياري

يُضاف input اختياري `accessRequirement?: PermissionRequirement` إلى المالك
الحالي، دون تغيير سلوك غير المتبنين. المستهلك المتبني يمرر متطلبه الفعلي
الذي يشمل كل endpoint يحتاجه مساره؛ لا يستنتج المكون مفاتيح من roles أو
عناوين. المحرر المدمج بعقد البيع سيضم policy/lookup/preview ومفاتيح الأب؛
المستهلكون الآخرون لا يُجبرون على عقد جديد في هذه الدفعة.

ويظل المالك مسؤولًا عن مفتاح كلendpoint المثبت: عند وجودinput يختبر
access.allows(accessRequirement) ومعهaccess.allows(endpointKey) كقرارين
مستقلين، دون nesting غيرمدعوم فيPermissionRequirement أوAPIعام جديد.
يحافظundefined علىlegacy بلا gating إضافي.

بوابة إتاحة الحقل وصحة الاختيار تجمع متطلب الأب مع المصادر المطلوبة للحالة:
policy دائمًا؛ Lookup وPreview في التحرير؛ وPartner/Supplier default فقط
إذا كان المستند غير محفوظ وغير source-locked. تبقى كل قراءة مستقلة بفحص
مفتاحها، فتستطيع المصادر المسموحة أن تُجهز دون استدعاء مصدر غيرممنوح.
تبديل actor يبطل صلاحية snapshot قديمة فورًا داخل handlers/selectionValid،
حتى قبل دورةAngular؛ لا يكفي مؤشّرcontextChanged يُضبط عبرeffect مؤجل.
يشمل denied$ اشتراكاتfinite read وwatch وقرارpreview المحلي، وoptions
bootstrap لا يعد ناجحًا إلا بعد envelope ناجح قبل تركيبwatch.

عندما يكون input مضبوطًا: كل finite read وwatch والـpreview/Retry/Reset
تفحص المتطلب وتلغى عند denied$/dataContext. source المشترك لا يُعاد تصميمه؛
إلغاء subscription لهذا المستهلك لا يدعي قطع HTTP memo مرسلة عند root.
غياب المنحة يخفي/يعطل الحقل المحمي وحواراته ويغلق Select التابعة للناشر،
دون هدم مالك المسودة. permission-only revoke يحتفظ بـaccepted snapshot
ومسودة target/date تحت نفس actor، لكن selectionValid=false ولا selection
emit أو apply حتى ترجع المنحة وتستعاد قراءاته اللازمة. لا تتعقب invalidation
effect busy/previews فتصفّر الرد بعد finalize. initial denied لا HTTP مطلقًا.

تغير dataContext يبطل الجلسة ويمسح snapshot/options/partner labels ويوقف
القراءات والتأكيدات المحلية؛ لا نشر نتيجة قديمة بعد context جديد. لا يكفي
بقاء المفاتيح. إعادة الاستخدام تتبع مدخلات السياق الحالية الصريحة كما يفعل
المالك، ولا تعيد إحياء سياق قديم من refresh grant فقط. إعادة المنحة بنفس
السياق تعيد bootstrap/watch واحدًا عند الحاجة وتحتفظ بالdraft دون duplicate
طلبات أو تأكيدات. preview قراءة فقط حتى لوPOST، وقراره المحلي يمكن إلغاؤه؛
الكتابة المالية يملكها الأب وتبقى مستقلة، فلا denied$ على Save الأب.

## المصدر المقفول وتبعياته

إذا كان المستند غيرمحفوظ وpreferredCurrencyId عددًا صحيحًا آمنًا موجبًا
وcurrencyLocked=true،
فهو مصدر صريح authoritative؛ لا تُقرأ أو تُراقب عملة العميل الافتراضية ولا
تنتظر supplier/customer default readiness في tryInitialize. تنتهي watches
السابقة إن دخل هذا الوضع، ولا يغير customer default snapshot مقفولة.
لا تُحذف قراءة policy أو currency lookup أو ConversionPreview: هي مصادر
base/precision/options/quote والتاريخ/المبالغ. إذا زال source lock يعود سلوك
default الحالي بقراءاته وتحققاته. لا تغيير سعر محفوظ أو استخدام base preview
بدل snapshot مصدر، ولا تخطي قيود change date/amount/previousUsage.

## جرد المصادر المثبتة

| المصدر الحالي | المفتاح والسلوك |
|---|---|
| FinancialNumberPolicyService.load → GET Currency/GetFinancialNumberPolicy | Currency.GetFinancialNumberPolicy؛ memo سياسة مستقلة عن reference cache، إبطالها الحالي محفوظ |
| CurrencyService.getSelectList/watch → GET Currency/GetSelect | Currency.Lookup؛ opted-in ReferenceLookupCache + ReferenceLookupBindings finite bootstrap ثم watch مع selected label |
| PartnerCurrencyLookupService.getCustomer/watch → GET Partner/GetCurrency/id | Partner.GetCurrency؛ default اختياري المصدر لكنه required حاليًا عندما customerId غير مقفول؛ يُتخطى فقط تحت source lock المعتمد |
| SupplierService.getSupplierDetails | Supplier.View؛ خارج سياق Receipt الحالي، يبقى سلوك غير المتبنين كما هو ولا مفاتيح جديدة |
| CurrencyService.previewConversion → POST Currency/ConversionPreview | Currency.PreviewConversion؛ قراءة authoritative مباشرة مع read-only navigation classification الحالية، confirmation ثم selectionChange |

المفاتيح منController/PermissionEndpointResolver/ReviewedPermissionOperations
ومصادر الخدمات المثبتة، لا من Speed/Odoo. Books:UI2/13/19/22/26/28؛ Master4/5/7.
مرجع دورة البيع جُمع سابقًا منSpeed guide/sidebar ثمC0786 مستقلًا؛ لا غموض
في هذا التبني يستدعي سياسة مالية منOdoo. قاعدة source lock موجودة فيالمكون
والإيصال؛ تغييرها هنا إكمال تبعياتها الحالية لا اختيار عملة جديد للمستخدم.

لا query أو فهرس أو DB/EF/DTO/AutoMapper جديد. لا HTTP صلاحية لكل زر أوصف.
التوقيت/رؤيةloading الفعلية/المظهر منفصل؛ الحقل يبقى داخل shared form region
وEditorDialog المحلي عند استهلاكه. الجذر يملك guide/docs والربط معReceipt،
والعامل يملك shared DocumentCurrency ts/html/spec فقط. يبدأ RED ثم ينتظر
نتيجةالجذر قبل production؛ لا تشغيل/بناء/DB/هجرات عندالعامل.

القبول: denied initial؛ source lock بلاPartner HTTP/watch معpreview صحيح؛
revoke/restore أثناءGET/preview/confirmation يحفظdraft ولاينشرstale؛ تغير
actor بنفسgrants؛ no duplicate bootstrap عندinput changes/grant refresh؛
selectionValid/Reset directhandler؛ غيرالمتبني يظل بسلوكهالقديم؛ teardown.
