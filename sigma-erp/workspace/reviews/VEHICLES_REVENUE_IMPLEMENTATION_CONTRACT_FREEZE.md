# عقد تقرير إيرادات المركبات

## تصحيح العرض وفق الصورة البسيطة — ١٦ نوفمبر ٢٠٢٦

قرار المالك الأخير يحذف كتلة Period/Vehicle branch وفقرتي الشرح بالكامل من قالب التقرير والطباعة، ويحذف تحذير الإجمالي النصي من القالب أيضًا؛ لا إبقاء لها كعناصر مخفية للطباعة. أزيلت فقرة شرح النطاق من تصدير Excel ومفاتيح الشرح غير المستعملة. تبقى صفوف الرأس الثلاثة والجدول والإجماليات والمرشحات فقط. هذا القرار يحل محل كل وصف سابق يحتفظ بالشرح في الطباعة، دون تغيير حسابات أو قيم التقرير.

تأكيد المالك لتفاصيل أعلى الجدول: ثلاثة صفوف فقط، كل صف بعنوان إنجليزي يسارًا ثم القيمة ثم المقابل العربي في العمود الأيمن: Car Details / تفاصيل السيارة، Agreement count / عدد العقود، License Expiry / انتهاء الملكية. يستعمل العرض اللوحة والماركة/الموديل وagreementCount وlicenseExpiry الموجودين فقط؛ لا فرع أو فترة أو شرح أو بطاقات إضافية أعلى الجدول، ولا تغيير لمعنى البيانات أو حسابها. التسميات الثنائية والترتيب ثابتان مثل الصورة في لغتي التطبيق.

توضيح المالك الأخير مع الصورة Capture يحل محل أي ذكر لاحق لملاحظات داخل التفاصيل: عناوين الشاشة Details/Total/Paid/Balance، وتعرض خلية Details رقم الفاتورة فقط دون تاريخ أو ملاحظة مصدر أو قالب إضافي. لا ملاحظات أو تحذيرات إجماليات ظاهرة في جسم التقرير؛ بيانات التشخيص الأصلية محفوظة في Excel، والشرح العام وتحذير الإجمالي المجهول في الطباعة والدليل. تبقى القيم المجهولة null دون صفر تقديري، والمال ودقته والمصدر والفصل بين العملات كما هي. هذا تعديل عرض محدد بطلب المالك وليس حذفًا لبيانات الخدمة.

رفض المالك البطاقات وقسم الملاحظات وأضاف «الصورة بسيطة اعمل زيها». هذا التصحيح يحل محل تعديل البطاقات السابق: شريط البحث الواحد القائم، وثلاثة صفوف بسيطة لتفاصيل السيارة وعدد العقود المفوترة وانتهاء التسجيل الحالي، ثم جدول النتائج مباشرة دون بطاقات أو قسم مساعدة أو إطار نتائج كبير ظاهر. الأعمدة المرئية أربعة مثل الصورة: Details/Total including tax/Paid or settled/Balance؛ يبقى تاريخ الفاتورة وملاحظة المصدر داخل خلية التفاصيل، ويبقى تصدير Excel بالحقول الستة الأصلية. إجماليات الخادم في DataTable.footerRows، مستقلة عن الصفوف والترشيح والصفحات، بلا إعادة حساب. فصل العملات والقيم المجهولة والتنبيهات المالية قائم؛ لا اختلاق عملة أو صف مالي عند الفراغ. بيانات الفرع والفترة والتفسيرات تبقى في الطباعة والدليل وExcel. طلب المالك الصريح يستثني هذا التقرير من استخدام البطاقات لتفاصيل المركبة والإجماليات. لا تغيير طلب أو منح أو تحميل/كاش أو حساب أو خلفية أو schema؛ التجميع المحلي مصرح والقبول البصري الحي معلّق.

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-11-11 |

طلب المالك مراجعة الصورة5 وتنفيذ الإصلاح وفق الوثائق وSpeed وكوده. النطاق M/UI07/BE5: backend VehicleReports.VehiclesRevenue موجود، وSidebar يشير /Reports/VehiclesRevenue دون route/component. يبقى مالك القراءة نفسه ويضاف المستهلك؛ لا تغيير فواتير أو ترحيل أو تسوية أو schema.

## المرجع والحد المالي

الصورة تثبت الفترة والمركبة وتفاصيلها وعدد العقود وانتهاء الترخيص وDetails/Total/Paid/Balance وطباعة/Excel/Refresh. Speed2026-10-28 screen23/03/R0395/C1099 raw290550–290933 يثبت period optional، vehicle search/clear، output/detail declarations؛ grid JS قديم credit/debit/P&L يخالف قالب الصورة. template-bindings SHA9e4888a0f48f463111ea25a455bcef2cbc5778aa74a1c88dac40b18fe0d30324 يحفظ fields/actions فقط وHTML discarded. لا server source أو قاعدة توزيع paid على charges محفوظة. شرح Speed2026-10-27 الفصل16 عام ولا شرح Revenue مستقل؛ Odoo19 payments.rst يفرق settled invoice من unrelated payments ولا يملك قاعدة Sigma.

لذلك نحافظ على مالك الفواتير الحالي ونطابق أعمدة الصورة مع تسمية المصدر صراحة: صف لكل فاتورة مرحلة حية غير ملغاة مرتبطة بالمركبة بهوية RentalInvoiceItem.VehicleId المحفوظة، لا مطابقة نص لوحة أو Agreement.VehicleId الحالي. الإجمالي شامل الضريبة من عناصر المركبة المحفوظة. لا تقسيم سداد رأس فاتورة مشتركة بين مركبات أو بين أنواع رسوم. المدفوع هنا المبلغ المسوى المرتبط بالفاتورة (قد يشمل credit note/JV)، وليس ادعاء قبض نقدي. يحتسب فقط لفاتورة مستقلة كاملة لهذه المركبة ومتطابقة مع رأسها، وعملتها الأساسية، من JournalVoucherAllocation.QueryReport.WhereLedgerEffective ضمن cutoff؛ وإلا paid/balance=null مع issue. لا صفر تقديري أو prorata أو نقل أي سياسة تسعير/محاسبة؛ العجز في attribution واضح في الشاشة والطباعة وExcel.

Currency sections منفصلة؛ عملة مصدر Invoice.CurrencyId أو base عند null، دقة Currency المحفوظة الحالية المثبتة. لا جمع عملات أو conversion. إجماليات القسم total/paid/balance تصبح null إن كان مكونها مجهولًا، ولا عرض مجموع جزئي ككامل. العملات أو المبالغ غير الصالحة تؤدي failure أو diagnostics صريحًا؛ money strings/null عبر converters. مجموع المدفوع لا يتجاوز كامل فاتورته، والسالب/زيادة التسوية issue بدل clamp لإخفاء فرق. لا تشمل draft/voided أو unassigned invoice rows؛ يُشرح ذلك بالدليل.

## النقل

GET VehicleReports/VehiclesRevenue (Result<VehiclesRevenueReportVm>) وGET VehicleReports/VehiclesRevenueExport بنفس العقد؛ GET VehicleReports/VehiclesRevenueOptions Result<VehiclesRevenueOptionsVm>.
Query: vehicleId مطلوب int>0؛ fromDate,toDate nullable كلاهما معًا أو فارغان لكل الوقت، ترتيب يومي صحيح والنهاية غير DateTime.MaxValue.Date. dates only YYYY-MM-DD في الواجهة، invoiceDate ضمن [fromDate,toDate+1day)، والتسويات AllocationDate وكذلك journal/source dates حتى نهاية الفترة؛ all-time بلا cutoff.

Options entity vehicles:[{id:number,name:string}] من QueryReport<Vehicle> allowed/live/tenant، بلا CRUD permissions/cache.
Report entity: fromDate:string|null,toDate:string|null,vehicleId:number,vehiclePlateNo:string,vehicleMakeAndModel:string,vehicleBranch:string,licenseExpiry:string|null,agreementCount:number,sections:VehiclesRevenueSectionVm[]. agreementCount عدد RentalAgreementId المميز ضمن عناصر الفواتير المقبولة في التقرير، أي العقود المفوترة في الفترة وليس كل عقد فتح أو حركة استبدال. licenseExpiry من NextRegistrationDate مالك تاريخ التجديد الحالي مع توضيح المعنى بالدليل.
Section: currencyId:number,currencyCode:string,decimalPlaces:number,rows:VehiclesRevenueRowVm[],total:string|null,paid:string|null,balance:string|null.
Row: invoiceId:number,details:string (رقم الفاتورة الحقيقي No)،invoiceDate:string,total:string|null,paid:string|null,balance:string|null,issue:string|null. issue keys sharedInvoice,foreignSettlement,invalidAmounts,invalidSettlement,invalidSource. أعمدة detail,invoiceDate,total,paid,balance,issue؛ date/issue توضيح لازم لمصدر الأرقام. identity invoiceId فقط. مصدر كامل غير paged، local paging ويطبع ويصدر الجميع. تفاصيل المصدر محمولة في الصف دون opening protected invoice editor أو استعمال إذن عرض مستند آخر.

## الصلاحية والعمر والمخرجات

Read VehicleReports.VehiclesRevenue قائم؛ Options VehicleReports.VehiclesRevenueOptions؛ Export VehicleReports.VehiclesRevenueExport. options/export prerequisite read في الخادم وReportEffects، route read+options، print read، Excel read+export. لا منح تلقائي أو تعديل API access عام. EN/AR action labels+route policy+runtime explicit entries.
Shared ReportPage/FeatureTitle/DataTable/ReportActions/PrimaryActionButton/ReferenceLookupStatus/StateMessage وReportPrintSession؛ selected vehicle required، date-range enable checkbox مطابق المرجع. إبطال النتائج عند edits، bootstrap مستقل، access/session/dataContext publication+cancel+portals+IDs clearing وregrant bootstrap، subscription-scoped loading/finalize، false-envelope/HTTP errors+Retry، no accumulation. Direct operational options/report/export؛ no new cache/watch. Complete applied-filter outputs تتضمن header/period/currency/totals/issues وكل الصفوف، لا صفحة العرض فقط. guide topic EN/AR في Reports guide /UserGuide/reports القائم.

## خطة التنفيذ والملكية

الجذر يملك discovery/freeze/backend/wiring/vocabs/integration/review. عامل واجهة معاد الاستخدام يملك Reports/VehiclesRevenue/** وUserGuide/content/vehicles-revenue-topic.ts فقط؛ يسلّم translation map لا يعدل vocabs/shared/routes/backend. العامل يدرك source-only ويحفظ عمل الزملاء. بعد التنفيذ تدقيق backend قراءة فقط من عامل معاد الاستخدام عند الحاجة. المراحل0/1/2/5/6؛ لا3/4 أو AutoMapper/entity/migration. تكتب specs عند الحاجة دون تشغيل. لا build/test/lint/browser/DB/migration/commit/push/deploy. الفحص المسموح syntax/imports/contracts/XML/scoped diffs/recipe check؛ التشغيل والسرعة وSQL plans وRTL/themes/print acceptance عند المالك.
