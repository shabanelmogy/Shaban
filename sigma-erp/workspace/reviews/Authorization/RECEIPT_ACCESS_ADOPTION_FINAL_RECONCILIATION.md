# متابعة تبني وصول الإيصالات

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ٢٠٢٦-١١-٠٧ |
| الهدف العام | تفعيل الصلاحيات في جميع الشاشات والأحداث؛ active، لم يكتمل |
| الدفعة الحالية | قائمة Receipt ومسارها ومحرر Receipt المستقل وأحداثه؛ مصدر فقط |

## ما نُفذ في هذه الدفعة

- أضيفت سياسات المسار الصريحة لـ`Receipt` و`Receipt/create` و`Receipt/view`
  و`Receipt/edit`، وأضيف Receipt إلى مسار البداية المسموح.
- أضيفت متطلبات مستقلة للقائمة والإنشاء والتعديل والحذف والاعتماد واليومية
  والسجل والإبطال، وربطت بكل ActionList وبالحارس داخل handler.
- أوقفت القائمة قراءات Receipt عند غياب `Receipt.View`، وأوقفت التصدير
  والتقرير والطباعة والبحث والصفحات عند سحبها.
- صارت فلاتر الفرع وطريقة الدفع والطرف اختيارية حسب `Branch.Lookup` و
  `PaymentMethod.Lookup` و`Receipt.Parties`، مع تنظيف القيم المخفية من الطلب.
- أُلغيت القراءات والمراقبات والتأكيدات عند تبديل سياق الوصول أو سحب المنحة،
  وأعيد bootstrap الممنوح دون إعادة إرسال كتابة قائمة قديمة.
- بدأ تبني المحرر: `Receipt.View/Create/Update/Delete`، و`Receipt.Parties` و
  `Receipt.Receivables` و`Receipt.QuotationContext` و`Receipt.SalesAgreementContext`
  و`PaymentMethod.View` وقراءات الاختيارات أصبحت حراسة مستقلة، مع منع قراءات
  المحرر في View وإعادة فحص الحفظ والتعديل والحذف والاعتماد والمرفقات.

## المراجع والمطابقة

قُرئ مرجع Speed Receipts بتاريخ ٢٨ أكتوبر، الشاشة `tenant.crs_receipts`،
والمتحكمان C1424 وC1419 وC1431، ثم قورنت القائمة الحالية بـ`ReceiptController`
و`ReceiptService` وكتالوج `PermissionEndpointResolver`. يثبت المرجع وجود
التحصيل والتخصيص والطباعة والاعتماد، ولا يثبت قواعد خادم Sigma أو سياسة مالية.

اكتمل تبني المحرر المستقل مصدرّيًا داخل هذه الدفعة: وضع View يستخدم DTO ولقطة
العملة والقيم المحفوظة دون edit-only lookups؛ Create/Edit يحرس branch/payment/
party/account/bank/agreement/policy/settings/payment-method details والتخصيص
والسياقات المصدرية كلٌّ بمفتاحه. تبقى Receipt المدمج بعقد البيع محكومًا بعقد
`SALES_AGREEMENT_RECEIPT_CONTEXT_READS_CONTRACT_FREEZE`؛ لا يُفتح له نطاق جديد.

## التحقق

نجحت اختبارات قائمة Receipt وسياستها وقراءات سياق الإيصال المدمج مجمعة:
**22/22**. نجح بناء الواجهة
العام بعد بدء حراسة المحرر بخروج 0 في ٢٠٢٦-١١-٠٧ الساعة ٠٣:٢١ UTC، مع تحذيرات
الميزانية وNG8113 خارج النطاق. اختبار هندسة routed editor ما زال لديه فشل واحد
في harness الخاص بالـstyles، بينما اختبار السياق الوظيفي أخضر؛ قبول المتصفح
والمظهر والبيانات والفروع ما زال تحقق مالك منفصلًا. هذه النتائج تاريخية ولا
تقبل الاستكمال الحالي.

## استكمال ٧ نوفمبر — أدلة الاكتشاف الحالية

نتائج٢٢/٢٢ والبناء المذكورة أعلاه تاريخية؛ لا تقبل التغييرات الجديدة من
نتيجة سابقة. جرى استكمال تبني القائمة والمحرر تحت ملحق العقد نفسه بحدود
source-only؛ لا build أو tests أو browser أو DB في هذه الدفعة.

المشكلات المؤكدة قبل التصحيح: متطلب المحرر يعتمد route snapshot ولا يتبع
تفعيل Edit من View؛ editable/حالة enable لا تفحص المنحة كاملة؛ denied initial
يخرج من ngOnInit قبل تركيب الاشتراكات؛ access effect يخلط busy وقراءات
الوصول؛ View يجلب بيانات تحرير؛ delete/approval المرسلة قد تُلغى؛ وdirty
exit يتجاوز المسودة عند denial. hydration المرفقات عبر addDocument محجوب
في View أيضًا. هذه عيوب توصيل وعمر، وليست تغييرًا لسياسة مالية.

المصادر المقروءة في الاستكمال: الشرحان الأصليان S075 وS080 من مكتبة٢٧أكتوبر،
وملف الشاشة `2026-10-28/sidebar/18-vouchers/screens/04-receipts.md`. قُرئ
بصورة منفصلة كود C1419: التهيئة، متطلبات النوع، حفظ سند/تخصيص، المرفقات
والطباعة (الأسطر١٤٥٧و١٥٣٨و١٦٥١). فهرس المتحكمين C1424/C1431 قورن بمصادر
Sigma الحقيقية؛ لا تُحوّل أسماء صلاحيات Speed إلى مفاتيح Sigma.
يوثق S075 حفظ مقدم العقد ثم إيصال التحصيل، ويوثق S080 البحث برقم الاتفاق
وتخصيص الذمم. اعتماد/ترحيل Sigma وحساباتها من عقدها وخادمها القائمين؛ لا
استنتاج من الشرح لتوليد فاتورة أو قيد جديد. مدخل Odoo المحلي قُرئ، ولا
غموض وظيفي متبقٍ في توصيل المنح يحتاج مصدرًا مكملًا تفصيليًا.

الشكل المختار screen08 مستند مالي مع قائمة screen02؛ المراجع Workshop/Job
للتركيب المشترك وUI7/13/14/19/22/26/28، وBackend3 للمعنى المالي الحالي.
المراحل الفعلية هي استكمال العقد، توصيل الواجهة والأفعال، ثم التكامل
والمصالحة؛ لا تعديل entity/DTO/mapping/accounting أو مخطط ضمن هذه الدفعة.

## جرد مصادر البيانات والتحميل والذاكرة

| المصدر الفعلي | التصنيف | المالك ودليل العمر |
|---|---|---|
| `Receipt` مع filters/page/sort/grid | قراءة تشغيلية مباشرة | ReceiptService.getList ثم latest-query في القائمة، start/finalize وdenied/context؛ التقرير/Excel يجمعان صفحات١٠٠ من الطلب نفسه |
| `Receipt/GetByWithNavigationsId/{id}` | قراءة مستند مباشرة | DTO/snapshot/أهلية خادم؛ مستقل عن اختيارات التحرير، دون cache جديد |
| `Branch/GetSelect` و`PaymentMethod/GetSelect` | opted-in reference | BaseService + ReferenceLookupCacheService؛ bootstrap محدود ثم ReferenceLookupBindings منفصلة، writers/imports ناجحة تبطل المصدر وموضوعا lookup-branches/lookup-payment-methods يعيدان التحقق |
| `Receipt/parties?receiptType` | قراءة تشغيلية مباشرة | eligibility حسب نوع السند، بلا opt-in؛ Trigger مستقل محدود يعاد عند نوع/retry/regrant ولا يثبت من cache عميل عام |
| `Receipt/receivables?partnerId&branchId&receiptId` | قراءة سعة مالية مباشرة | لا reference cache؛ قائمة مصادر authoritative قبل الحفظ/الاعتماد، يظل الخادم مالك السعة والتخصيص |
| `RentalAgreement/GetSelect` و`Bank/GetSelect` | reference مباشر بلا source opt-in | يبقى مباشرًا؛ لا cache موازية، ويحتاج lookup grant الفعلي حسب استخدامه |
| `Account/PostingSelect?usage` | اختيار تشغيلي مباشر | AccountService.getPostingSelect، يستهلك AnyPosting للقبض العام؛ لا افتراض Account.Lookup |
| `SettingsCommonModel/GetMySetting` | cache singleton صريح | CommonSettingsService.settingsUrl في ReferenceLookupCacheService؛ writer الناجح يبطل نفس URL؛ تسميات التفقيط اختيارية، بلا watch مخترعة |
| `Currency/GetFinancialNumberPolicy` | policy singleton صريح | FinancialNumberPolicyService؛ إبطال context/تغيير العملة، ليس reference cache؛ View يعتمد snapshot المحفوظ ولا يحتاجه |
| `PaymentMethod/GetById/{id}` | قراءة تشغيلية مباشرة | نوع الطريقة/أهلية وعمولة، تحت PaymentMethod.View، بلا تخزين مرجع للاحتساب |
| `Receipt/quotation-context/{id}` و`sales-agreement-context/{id}` | سياق مصدر مباشر | مفتاح السياق وCreate؛ بيانات الطرف/العملة المصدرية لا تُستبدل باختيار مستقل |
| `LeaseAgreement/GetByWithNavigationsId/{id}` وRentalAgreement المناظر | سياق مصدر مباشر | View للمصدر وCreate للإيصال؛ لا منحة مستنتجة من اسم getDetails |
| `Receipt/{id}/approval`, `/journal`, `/log` | قراءات تاريخ/سياق مباشرة | View أو Journal أو Log بحسب resolver؛ approval panel يملك revision recovery، وتعرض قراءات modal فوق قناعه محليًا |
| `POST/PUT/DELETE Receipt`, `/approval`, `/void` | كتابة مستقلة | منحة العملية قبل الإرسال وحالة الخادم؛ لا denied$ بعد إرسال mutation، late outcome مرتبط بالسياق |
| المرفقات | DocumentUploadTracker/FileField | منح Media مستقلة؛ الرفع والتنظيف المرسلان تحت مالك المحرر، ولا يُعاد Save بسبب Retry تنظيف |

مسار التطبيق من `pages/routing.ts` إلى `Receipt/receipt.routes.ts` ثم القائمة
أو DetailsComponent. loader الصفحة مفعل افتراضيًا من LayoutComponent ما لم
تكن data.showPageLoading=false؛ Receipt لا ينفيه. حوارات القائمة وembedded
modal تحتاج progress محليًا لقراءات محجوبة بقناعها، بينما routed reads
والتقرير/التصدير تستخدم مالك الصفحة. الحماية وbusy/aria/errors/Retry تبقى
مستقلة عن شكل المؤشر؛ رؤية التطبيق الفعلية pending.

## الاستعلامات والحجم والفهارس — مصدر فقط

قائمة Receipt ترسل paging فعليًا. مالك Service يطبع pageSize ضمن١..١٠٠ عند
وجودها، يحسب count ثم projection مرتبة ومعها tie-breaker Id؛ التقرير/إكسل
ينفذان الصفحات الكاملة متسلسلة بحجم١٠٠. ReadActionFlagsAsync يجمع أهليات
الهويات على دفعات١٠٠، مع قراءة provenance للقيود والفترات/الأشهر والعملة
الأساسية مجمعة؛ لا GET أو eligibility query لكل صف أُضيف بهذه الدفعة.

قراءة الذمم تتحقق من الطرف والفرع، وتقرأ حتى٥٠١مصدرًا وحدًا أقصى٥٠٠،
وحتى١٠٠٠١تخصيصًا وحدًا أقصى١٠٠٠٠، مع خطأ صريح عند تجاوز الحد. تحافظ على
provenance والتخصيص المحفوظ والرصيد الفعلي، ولا تغير دفعة المنح الحساب.
query التنفيذ متسلسل على DbContext، بلا parallel EF جديد.

ReceiptConfig يملك FK للحساب والقيد والعملة والعميل ومصادر البيع والاتفاق
والبنك، وفهرسًا فريدًا مفلترًا لـSalesQuotationId لمنع تكرار إيصال المقدم الحي.
ReceiptAllocationDetailConfig يملك FK للReceipt والtarget ledger line.
لا دليل من توصيل الصلاحيات وحده يثبت احتياج index جديد؛ لا DDL أو migration
مقترحة في هذه الدفعة. قياس SQL plans/عدد الطلبات والبارد/المحتفظ به على حجم
وفلاتر ثابتة يبقى قبول مالك، ولا يوجد before/after زمني منفذ.

## مطابقة الأعمدة والعقود المحفوظة

أعمدة القائمة: رقم السند، التاريخ، الطرف، كود الطرف، المنشئ، الاتفاق، عرض
السعر، العملة، المبلغ، النوع، حالة التخصيص، الاعتماد، والإبطال. تقابلها
خصائص ListVM:
`No, Date, Contact, ContactCode, CreatedBy, AgreementNo, QuotationNo,
CurrencyCode, Amount, ReceiptType, AllocationStatus, ApprovalStatus, IsVoided`.
تضاف `Id` للهوية و`MoneyDecimalPlaces` لدقة العرض والتصدير، و`JournalVoucherId`
و`CanEdit/CanDelete/CanApprove/CanUnapprove/CanReject/CanVoid/CanJournal` لحالة
الأفعال. لا خاصية جديدة أو mapping جديد من دفعة المنح.

تبقى الفلاتر query-compatible: رقم السند، الفرع، التاريخ من/إلى، الاتفاق،
النوع، طريقة الدفع، الطرف، حالة التخصيص، الإبطال، وفلاتر الأعمدة/الفرز
والصفحات. يترجم الخادم contactId إلى receiptPartyId ليطبق Contact مع
Customer fallback؛ لا يُغير ذلك في الواجهة. تطبق التقارير والتصدير البحث
المطبق نفسه، ولا تُقصر على الصفحة الظاهرة.

تصنف جميع المبالغ والعمولة والضريبة والتخصيص كنصوص أموال دقيقة طبقًا للعقد
المالي الحالي؛ الهويات وعدد السطور أعداد صحيحة. الحسابات المشتقة في الواجهة
معاينة فقط، ويظل الخادم مالك الحفظ/الاعتماد والسعة والفرع والعزل. لا تغيير
حسابي ولا AutoMapper أو precision أو index أو migration في هذه الدفعة.

## مصالحة التنفيذ النهائي للمحرر والقائمة — مصدر فقط

تتبعت القائمة والمحرر من `pages/routing.ts` إلى routes والمكونات والخدمات
الحقيقية، ثم قارنت كل request/handler بالمفاتيح في `ReceiptController` و
`PermissionEndpointResolver` و`DocumentApprovalEndpointRules` و`BranchScopeRegistry`.
القائمة أصبحت hidden/inert عند غياب View، وتغلق portals وتعيد working-context
الفلاتر والـlookups مع `ReferenceLookupCacheService.contextChanges`. قراءات
الأطراف تحمل View+Parties، وكل forkJoin lookup يحمل View ومفتاحه الفردي؛
revision غير متعلق لا يعيد bootstrap المكتمل. التقارير والتصدير والتسجيل
والقيد disposable، وحوار الموافقة/الإبطال يحتفظ بالمسودة في permission revoke.

المحرر يحسب متطلبه ديناميكيًا: Create أو View أو View+Update، ويضيف متطلب
السياق عند الإنشاء من quotation/sales/rental/lease. early denial يركب النموذج
وvalidators والـouter triggers دون GET غير ممنوح؛ View لا يجلب edit lookups.
السياق العامل يعيد القراءات المفقودة دون محو record/draft/currency، بينما
تغير actor/tenant/branch context ينهي الجلسة ويمسحها. approval read مربوط
بالـView، وapproval write يفحص View+ManageApproval قبل الإرسال ولا يربط
denied$ بالكتابة المرسلة. delete confirmation كسول، ثم delete مستقل، وdirty
exit يصدر false عند انتهاء القرار؛ cleanup المرفقات مستقل عن notifier.

المرفقات المحفوظة تُhydrated عبر FileField/DocumentUploadTracker دون اشتراط
editable؛ اختيار أو حذف جديد يحتاج منحة Media المناسبة. `aria-hidden` وhidden/
inert يغطّيان السطح المحجوب، وEditorDialog يغطي nested approval/void reason.
أضيفت specs مصدرية للتبديل View→Edit، حفظ record عند denial، مصادر سياق
SalesAgreement، ولاختيارات القراءات؛ لم تُشغّل.

| المجال | الحالة المصدرية | قبول المالك |
|---|---|---|
| القائمة، paging، filters، report/export | متوافق مع العقد والمفاتيح؛ working-context وepoch fences موجودة | build/tests/browser pending |
| Create/View/Edit editor | متطلبات ديناميكية، read/write lifetime، lookup readiness، draft/cleanup | build/tests/browser pending |
| approvals/log/journal/void/delete | كل handler وshared owner حارس؛ sent writes مستقلة | API/data/branch runtime pending |
| attachments/currency/allocation | shared owners، snapshot، precision والعزل محفوظة | visual/financial runtime pending |
| Speed/Odoo | Speed screen04/C1419/C1424/C1431 وS075/S080 قورنت؛ Odoo لم يضف قرارًا | لا claim reference equivalence |

فحص `git diff --check` والمحددات النصية/merge markers خرج نظيفًا مع تحذيرات
LF/CRLF فقط. لم تُشغّل build أو tests أو lint أو browser أو DB أو migrations.
اقتراح رسالة الواجهة: `fix: adopt receipt permissions across list and editor`.
لا تغيير Backend أو schema أو migration مطلوب من تبني الوصول؛ لا commit أو push
نُفذ. حالة هذه المصالحة `Implemented — source-only` وOwner verification pending.
