# متابعة تبني وصول عقود البيع

| البند | القيمة |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| التاريخ | ٢٠٢٦-١١-٠٧ |
| الهدف العام | تفعيل الصلاحيات في جميع الشاشات والأحداث؛ active، لم يكتمل |
| النطاق الجاري | قائمة ومحرر عقد البيع، أفعال الحوارين، قراءات الإيصال المدمج، ومنتقي العملة المشترك الاختياري |

## العقود والحدود

الحواران يستهلكان
[عقد الإجراء](SALES_AGREEMENT_ACTION_ACCESS_CONTRACT_FREEZE.md).
تنظيف تبعيات الإيصال يستهلك
[عقد قراءات السياق](SALES_AGREEMENT_RECEIPT_CONTEXT_READS_CONTRACT_FREEZE.md).
العملة تستهلك
[عقد تبني المالك المشترك](DOCUMENT_CURRENCY_ACCESS_ADOPTION_CONTRACT_FREEZE.md).
كلها تحت CURRENT_ACCESS_IMPLEMENTATION_CONTRACT_FREEZE، دون سياسة منح جديدة.
سُجلت سياسات المسار الصريحة للقائمة وcreate/edit/view، وربطت القائمة والمحرر
كل حدث بمفتاحه الفعلي. يظل Receipt standalone وبقية أحداث التطبيق خارج هذه
الدفعة؛ لا يصلح View وحده دليلًا لتبني شاشة أخرى.

القرارات المالية المحسومة ثابتة: فاتورة واحدة بتوزيع على فروع البيع
المحفوظة، والجزئي بالمبلغ لا يبيع الوحدة تشغيليًا ولا يعترف بكلفتها.
لا migration/snapshot/DB في هذه الشريحة. سؤالا المخطط والتحصيل عبر الفروع
قائمان بلا جواب، ولا تجربة posting على مخطط غير مطبق.

## الأدلة الحالية

- بدأ اختبار action-dialog بمشكلة fixture في LoadingService جزئي لم يحمل
  setPageLookupLoading؛ لا يُحسب ذلك RED وظيفيًا. أُصلح fixture ليستخدم
  المالك الحقيقي ودورة Angular بعد setAccess.
- ثبت RED سلوكي للمجموعة١١:٩فشل/٢نجاح، منها٧فشل/١نجاح للحوارين و٢فشل/١نجاح
  لقراءات الإيصال. السجل `%TEMP%/sigma-sales-context-actions-red.log`.
- انتهى حذف قراءات RentalAgreement.Lookup وAccount.GetPostingSelect
  وReceipt.Parties وReceipt.Receivables غير المستخدمة من سياق embedded sales
  فقط. العميل المقفول وlabel يأتيان من Context؛ اختيارات
  الفرع/طريقة الدفع والسياسة ظلت كما هي، وstandalone احتفظ بالقراءات القديمة.
  نجحت٣/٣ في `%TEMP%/sigma-sales-receipt-context-green.log`.
- نجحت المجموعة الأولية١١/١١ بعد تنفيذ الحوارين، في
  `%TEMP%/sigma-sales-context-actions-green.log`. مراجعة root كشفت حالات
  target/context إضافية، فثبت RED٤فشل/٨نجاح في
  `%TEMP%/sigma-sales-actions-review-red.log`: حجب context على EditorDialog،
  finalize تحميل target ملغى، استعادة GET بعد write فاشلة مع regrant، وإنهاء
  dirty decision عند استبدال target. أُصلحت؛ الحالة الأولى التي توقعت dirty
  بعد actor reset صُححت لتختبر عدم تغير النموذج الجديد من callback قديم.
  أضيف نجاح write بعد permission-only revoke، ومنع submit أثناءGET معلقة،
  وbusiness failure بعدregrant. نجحت١٥حالة الحوار في الجولة المجمعة.
- أثبتت تجربة parent route مصدرّيًا/اختباريًا أن Receipt embedded create كان
  يلتقط id العقد الأب فيظهر تبويبapproval لسند بذلكالرقم. ثبتRED١فشل/١٩نجاح
  في `%TEMP%/sigma-sales-receipt-parent-identity-red.log`؛ شملت الجولة١٥حوارًا
  و٥سياقات إيصال. عُدل init ليسجل id=null لكل embedded create، مع إبقاء
  مصدرالبيع وهوية standalone مستقلين؛ ينتظر GREEN النهائي.
- ثبت RED الخاص بالعملة٨فشل/٢نجاح من١٠ في
  `%TEMP%/sigma-document-currency-access-red.log` بعد تصحيح mocks إلى مالك
  AccessViewPolicy الحقيقي وfixturestyped. كان اختبارactor القديم يعتمد
  cache context event أيضًا؛ أُزيل الحدث ليختبر actor وحده قبل الاعتماد.
  أُصلحت نوافذ التزامن، denied$ للقراءات والمراقبات، source lock، Supplier.View،
  الحقل endpoint-only وإغلاق Select، وتكرار bootstrap. نجحت٢٠/٢٠ حالة العملة
  في `%TEMP%/sigma-document-currency-green-final.log`.
- نجحت الجولة الأولية بعد التنفيذ٣٠/٣٠ في
  `%TEMP%/sigma-sales-currency-access-green.log` (١٥حوارًا،٥سياقات إيصال،١٠عملة).
  لم تُعتمد نهايةً: أثبت التدقيق window قبلCD على actor/revoke، وbootstrap
  خيارات مُلغى يتحولwatch قبلنجاحGET، وتكرارcustomerGET عندمايظلpending،
  ونقصSupplier.View وendpoint-only block. ثبت RED النهائي٨فشل/١٠نجاح من١٨
  في `%TEMP%/sigma-document-currency-final-red.log`؛ يشمل snapshot idle قديمًا
  قبلrender وقراره المحلي. نجحت المجموعة المجمعة٤٠/٤٠ في
  `%TEMP%/sigma-sales-currency-combined-final.log` بعد الإصلاحات.
- أُكملت حراسة قائمة عقد البيع ومتطلبات أفعالها وفلتر العميل؛ نجحت اختبارات
  القائمة ٢/٢. أُكمل تبني المحرر ومتطلبات create/edit/view وSalesQuotation.View
  المشروط والإيصال المدمج؛ نجحت اختبارات التفاصيل ٦/٦. أضيفت حراسة الإيصال
  بشرط `SalesAgreement.View` مع `Receipt.Create` و`Receipt.SalesAgreementContext`.
- شغّلت المجموعة الحالية للقائمة والتفاصيل والحوار والإيصال والعملة وسياسة
  المسار ونجحت ٦٠/٦٠. نجح بناء الواجهة العام عبر `npm run build` بخروج 0 في
  ٢٠٢٦-١١-٠٧ الساعة ٠٢:١٨ UTC؛ بقيت تحذيرات الميزانية وNG8113 خارج النطاق.

## المطابقة والمالكون

دليل الكود المرجعي المؤرخ٢٨أكتوبر هو C0786، موضع٦٥–٩٠ لمنح الأفعال، ببصمة
SHA256: `1930D9B026436A4E5E89CA2B1BEE138FDA6E2FA2BD3CCC0C55309DB394092095`.
لا يثبت تصريح الواجهة المرجعية قواعد خادم أو مالية غير ملاحظة فيSigma.

هذه شريحة UI09 ومالك حقل سند UI08؛ لا تغيير grid columns/ListVM أوDTO أو
AutoMapper أو entity/EF/query/index. كل payload/حساب/تنسيق مالي سابق محفوظ.
قراءة تفصيل الحوار تشغيلية مباشرة بمالك تحميله المحلي؛ write لها lifetime
منفصل وglobal progress الحالي. الإيصال يحتفظ بBranch/PaymentMethod reference
cache/watch بعد finite bootstrap؛ Context والسياسة مباشران بمالكيهما.
لا cache مالي جديد أو طلب صلاحيات لكل زر/صف. إلغاء قراءات غير مستخدمة يقلل
المصادر، ولا يثبت سرعة مقاسة؛ توقيتNetwork ورؤيةloader/RTL/themes/mobile
وتجربة الخدمات تظل pending owner acceptance. لا فهرس جديد لعدم تغييرquery.

المراجع المقروءة: قواعد Sigma/المهارة وMaster4/5/7 وUI2/7/13/19/22/26/28؛
Speed entry وشاشة SalesAgreement المؤرخة٢٨أكتوبر، ثم C0786 منفصلًا،
وWorkshop/Job/close-job كمرجع الشكل. شرح٢٧أكتوبر/فهرس المصادر لا يثبت تفاصيل
إيصال بيع المعدات؛ لا استنتاج مالي منه. مدخل Odoo19 المحلي متاح ولا غموض
وظيفي جديد في هذه الشريحة يحتاج سياسة منه. Check الحزم الثماني كلهاOK.

استخدم تدقيق PrimeNG مسار audit، لكن validate_usage/get_component لم يرجعا
دليلًا صالحًا للـMultiSelect method (selector mismatch ثم section/component
not found). لا يدعى MCP validation؛ مصدر API المثبت محليًا PrimeNG21.1.10
في `types/primeng-multiselect.d.ts` يصرح `hide(isFocus?: any): void`؛ قبول
التجميع والاختبار منفصل، والمعاينة الفعلية ما زالت معلقة.

الجذر يملك العقود وReceipt context reads والدليل والتكامل وتشغيل suites
متسلسلة. branch_ui_final_review يملك action-dialog فقط؛ branch_access_admin
يملك DocumentCurrency فقط؛ branch_access_review يراجع تبعيات العملة/الإيصال
قراءة فقط. لا ملف يكتبه عاملان. إعادة استخدام الفريق تقلل تكرار سياق الوصول
وتترك القرار والتكامل عندالجذر. الدليل `UserGuide/content/sales-guide.ts`
في قارئ UserGuide الحالي يتحدث بالعربية والإنجليزية؛ استكمال صلاحيات الحوار
والعملة يوثّق بعد المطابقة النهائية. لا screenshots جديدة في هذه الدفعة.

## التحقق النهائي لهذه الشريحة

نجح بناء Angular development بعد آخر source edit (exit0) في
٢٠٢٦-١١-٠٧ الساعة ٠٢:١٨ UTC؛ التحذير NG8113 عن QuantityInputDirective غير
المستخدم في PurchaseOrders خارج النطاق، مع تحذيرات ميزانية الحزم الحالية.
حُذفت ملفات tsconfig المؤقتة بعد الاختبارات، ونجح diff --check للنطاق.
قبول المتصفح والمظهر والبيانات المالية ما زال owner verification منفصلًا.

## إصلاح بدء تشغيل الـAPI في ٢٠٢٦-١١-٠٨

أثبت سجل التشغيل أن `DependencyResolver.RegisterServices` سجّل ستة أنواع من
بيانات توزيع فاتورة البيع تحت `IEquatable<T>`، فتوقف `builder.Build()` أثناء
التحقق من الخدمات. طبّق الإصلاح نمط `InvoiceAccountingMetadata` في الفصل
الخامس من كتاب الخلفية. أصبحت الأنواع الستة أصناف بيانات للقراءة فقط، مع
الحفاظ على ترتيب وأنواع قيم المُنشئ وأسماء الخصائص. راجعنا ذلك من المصدر
وأضفنا حالة تحقق تستدعي تسجيل الخدمات الفعلي وتفحص وجود `ISalesAgreementService`
وغياب تسجيل أنواع البيانات. إعادة البناء والتشغيل وتنفيذ الاختبار تنتظر المالك.

## متابعة الوصول من المصدر في ٢٠٢٦-١١-٠٨

أصبح مسار القائمة معروفًا بالضبط ضمن مسارات بداية الجلسة لمن يملك العرض،
وأصبح رابط الإنشاء نقطة بداية لمن يملك منح الإنشاء وتبعياته. يتطلب فلتر
العميل منحة القائمة و`Customer.Lookup`. يظل حوار سند القبض مركبًا إذا سُحب
وصول عقد البيع أو أُعيد تحميل بيانات الأب، ويشترط `SalesAgreement.View`
مع منح الإيصال المضمن. يحجب حوار الإيصال بياناته ورقم عقده عند فقد المنحة
وتظل نتيجة الكتابة المرسلة في دورة المحرر. أضيفت حالة مصدرية لوصول الإيصال
المضمن من دون منحة عرض العقد. لم يُعد تشغيل التحقق التشغيلي لهذا التحديث.

## الباقي

تبني Receipt standalone موثق في [مطابقته](RECEIPT_ACCESS_ADOPTION_FINAL_RECONCILIATION.md).
**تحديث 12 نوفمبر 2026:** أُغلق العائق الأخير مصدرّيًا دون تعديل عقد
الصلاحيات المجمد أو الحسابات. قراءتا
`Currency.GetFinancialNumberPolicy` و`SettingsCommonModel.GetMySetting`
اختياريتان لمعاينة الجدول؛ أصبح محرر العقد يختبر grant المستهلك الحقيقي
قبل GET ولا يطلبه في Create-only/View-only بلا منحة إضافية، ويلغي ردودهما عند
سحب أي منحة/سحب وصول العقد/تغير سياق actor. لا يغيّر رد سابق معاينة عقد في
جلسة جديدة. عند عدم توفر الحق تبقى دقة 2 الافتراضية ومعدل الضريبة 5% لمعاينة
الواجهة، بينما الخادم يملك القيم/الحسابات الحقيقية. إعادة grant تعيد محاولة
القراءة مرة واحدة، ولا تحوّل preview الاختياري إلى prerequisite يمنع الإنشاء.
أُضيفت source-only cases في `components/details/details.component.spec.ts`
لعدم بدء القراءتين دون grants، واستقلال الإنشاء واستعادة/سحب grant أثناء GET.
لم تُشغّل اختبارات أو بناء جديد لهذا التصحيح.

بناءً على مطابقة الشاشات/المسارات/API/العقود المصدرية السابقة وهذا الإصلاح،
رُقي **صف `SalesAgreement` وحده** إلى operation-confirmed. تبقى اختبارات
الخادم الحية والتوزيع المالي عبر الفروع والمعاينة المرئية قبولًا مستقلاً
للمالك؛ ليس هذا إعلان قبول تشغيلي.
رسالة commit المقترحة بعد اختيار المالك:
`feat(authz): adopt sales action dialogs and source-owned receipt reads`.
لا commit/push/deploy أو DB أو browser application verification في هذه
الشريحة؛ اختبارات headless المفوضة لا تثبت القبول المرئي أو المالي.
