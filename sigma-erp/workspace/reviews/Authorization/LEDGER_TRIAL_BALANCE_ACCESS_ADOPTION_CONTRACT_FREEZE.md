# عقد تبني صلاحيات الأستاذ وميزان المراجعة

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | ٢٠٢٦-١١-٠٧ |
| التفويض | الهدف النشط تفعيل الصلاحيات في كل الشاشات والأحداث، تحت CURRENT_ACCESS_IMPLEMENTATION_CONTRACT_FREEZE |
| النطاق | Accounts/Ledger وAccounts/TrailBalance، وAccounts/shared/report-family كمالك موجود، والمساران الصريحان والدليل والجرد والمواصفات |
| الحدود | مصدر فقط؛ لا build/tests/lint/browser/DB/migration/snapshot/commit/push/deploy |

## المفاتيح والمستهلكون

الأستاذ route /Ledger → LedgerComponent → LedgerService → GET
AccountReports/Ledger → GetLedger؛ المفتاح AccountReports.GetLedger.
مرشح الحساب إلزامي ومصدره Account/GetSelect، لذلك يلزم Account.Lookup
في متطلب التقرير والمسار. اختيارات Branch.Lookup وCostCenterGroup.Lookup
اختيارية في الصلاحيات: تُخفى وتُعقم قيمها عند الغياب، دون تعطيل التقرير.
ليس Ledger.View مفتاحًا مثبتًا من اسم BaseService؛ لا يُخترع هذا المفتاح.

ميزان المراجعة route /Reports/TrialBalance → TrialBalanceListComponent →
TrialBalanceService → GET AccountReports/TrialBalance → GetTrialBalance؛
المفتاح AccountReports.GetTrialBalance. Branch.Lookup وCostCenterGroup.Lookup
اختياريان، والفرع الافتراضي لا يعود إلى الطلب عند غياب منحته. لا فتح prefix
/Reports؛ يظل parent في الجرد غير مكتمل لبقية أطفاله.

الحساب والدقة والـhierarchy وopening/totals والأقسام والعملات لا تتغير.
Search/Refresh/Reset/Print/Excel وتوسيع الشجرة/طيها تستخدم منحة التقرير نفسه.
التوسيع والطي محليان بلا مفتاح جديد. رابط حساب leaf من الميزان إلى الأستاذ
يحتاج منح التقرير المصدر وسياسة الوجهة AccountReports.GetLedger+Account.Lookup،
وعضوية السطر في النتيجة الحالية، وحراس busy/context. الحسابات الأب لا تفتح.
لا رابط مستند جديد للأستاذ؛ عمود voucherNo الحالي نص، والفجوة المرجعية تسجل.

## المالك المشترك والعمر المجمد

يضاف accessRequirement اختياري إلى AccountReportConfig وإلى
AccountReportFilterDefinition، من نوع PermissionRequirement الموجود. غيابه
يحفظ سلوك المستهلكين غير المتبنين؛ لا ترقية تلقائية لبقية التقارير. يستخدم
المالك AccessViewPolicyService نفسه، لا API أو cache منح أو wrapper جديد.

كل finite report/lookup/watch/autoSearch وprint preparation تحت المنحة
والسياق؛ الإلغاء لا ينهي outer requests. grant signature ذات صلة تمنع GET
تشغيليًا بسبب revision غير متعلق. إعادة منحة التقرير تستعيد last searched
snapshot بعد تعقيم الفلاتر. تغيير المستخدم/token ينهي جلسة التقرير القديمة؛
working/reference/branch-access context يمسح النتائج والاختيارات ويدعو لبحث
جديد بعد bootstrap. لا يعاد إدخال IDs من route snapshot بعد context reset.

الفلاتر غير الممنوحة مخفية ومعطلة؛ getRawValue وحده لا يكفي: تعقم form/raw/
applied/last search قبل buildFilter/Reset/print/export. سحب فلتر مستخدم يلغي
قراءة تقريره ويستبعد قيمته عند إعادة القراءة. لا طلب اختيار دون grant، ولا
requiredLookupError لفلتر محجوب بصلاحية؛ فشل مصدر مسموح يستمر في Retry الحالي.
تُغلق Select/DatePicker portals، ويُحجب/inert host المرفوض مع بقاء component.

finite bootstrap ثم watch منفصل عند مصادر opted-in فقط؛ clear للربط بين
contexts/منح مختلفة. المصدر المباشر يبقى مباشرًا. مؤشر الصفحة الحالي
ReferenceLookupStatus/LoadingService يظل مالك التحميل، ولا تُضاف مؤشرات
فلاتر محلية. retained reference refresh صامت ويحفظ التسمية/ID المختار.

## المراجع والأدلة

الشكل07 Report، والمالك الفعلي AccountReportPageComponent فوق ReportPage/
DataTable/ReportActions/SummaryCards؛ dense tree reference هو TrialBalance
نفسه. قرئت UI20/21 وUI26/28 ومالك الحالة والكاش من الدفعة الحالية/السابقة.

قُرئت Speed entry وsection21/screens18-ledger و05-trial-balance من لقطة
٢٨أكتوبر، ثم منفصلًا C0500 وC0518 ومفاتيح الإجراءات. لم يظهر شرح أصلي بعنوان
مباشر مطابق في catalog٢٧أكتوبر بالبحث المحدد. Speed يثبت الفلاتر والمخرج
ورابط الأستاذ، ولا يقرر قواعد/صلاحيات Sigma الخلفية. اختلافات divisions/
costCenter2 وتصدير debitwise/multicurrency trial وروابط ledger الأصلية
فجوات وظيفية خارج ربط الأحداث القائمة، تحتاج عقودًا منفصلة؛ لا تُنفذ ضمنيًا.
Odoo متاح تكميليًا، ولا مفهوم غير محسوم يلزم للربط الحالي.

ثبت GetLedger/GetTrialBalance من controller وReviewedPermissionOperations؛
BranchOperationRules يضعهما ReportEffects. CostCenterGroupController يرث
GetSelect→Lookup. لا backend/schema/mapping جديد مطلوب. الأداء وquery/index
والـEN/AR والدليل تُصالح بعد المصدر؛ لا قياس runtime أو SQL plan مصرح.

## الملكية والتنفيذ

الجذر يملك shared report-family وspecs الخاصة به، registry/routes/docs/guide/
inventory والتكامل. العامل الحالي branch_access_admin يملك Ledger/** و
TrailBalance/** وspecs داخل هذين المجلدين فقط: config ومتطلبات lookups ورابط
leaf وقراءة عضوية النتيجة الحالية. لا تعديل shared أو routes/docs من العامل.
العقد العام الجديد shared.config.accessRequirement وfilter.accessRequirement
مجمّد هنا قبل العمل المستقل. أية مراجعة مستقلة تكون قراءة فقط بعد التكامل.

المواصفات تُكتب وتُراجع مصدرًا دون تشغيل؛ لا حذف لتنفيذ مصرح به لإرضاء شرط
RED/GREEN في مهارة. لا ادعاء اكتمال تطبيق كل الشاشات من إتمام هذه الشريحة.

## توضيح مالك الإخفاء عند المصالحة — ٧ نوفمبر

أثبت مصدر ReportPageComponent.scss أن :host display:block، وأن shell
display:flex قد يتغلبان على native hidden. امتدت ملكية الجذر إلى قاعدة
:host([hidden][inert]) display:none!important في مالك صفحة التقرير القائم،
ليظل السطح المحمي المرفوض مخفيًا على الشاشة والطباعة مع بقاء حالته. لا
يُغير هذا active-tab print contract لأن القاعدة تتطلب hidden وinert معًا.
تستفيد منه كل صفحات التقرير التي تصرح بهذين المدخلين، بما فيها اليومية.

أثبتت مراجعة style owner نفسه التعارض في sigma-list-page وsigma-editor-page
وsigma-editor-form. أضيفت القاعدة المقابلة في src/styles.scss لمالكي
layout الحاليين تحت الهدف العام المعتمد. لا تنطبق إلا مع hidden+inert
معًا، ولا تعيد ترتيب أو إظهار أي شاشة أو panel أو تغيير عمر مسودتها.
