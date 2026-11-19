# مصالحة صلاحيات الأستاذ وميزان المراجعة

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ٢٠٢٦-١١-٠٧ |
| العقد | LEDGER_TRIAL_BALANCE_ACCESS_ADOPTION_CONTRACT_FREEZE.md |
| النتيجة | تبنٍّ مصدري للتقريرين والمالك الحالي؛ الهدف العام active |
| حدود التنفيذ | لا build/test/lint/browser/DB/migration/snapshot/commit/push/deploy |

## مطابقة العقود والأحداث

| المستهلك/الحدث | الدليل النهائي |
|---|---|
| الأستاذ | /Ledger exact؛ AccountReports.GetLedger+Account.Lookup في config/registry؛ Account/GetSelect إلزامي |
| ميزان المراجعة | /Reports/TrialBalance exact؛ AccountReports.GetTrialBalance في config/registry؛ لا فتح /Reports أو siblings |
| الاختيارات | Branch.Lookup وCostCenterGroup.Lookup اختياريان في التقريرين؛ لا طلب/حقل/قيمة form/raw/applied/recovery عند غياب المنحة |
| البحث والتحديث وإعادة الضبط | canRead مباشرة قبل الحدث؛ buildFilter بعد تعقيم الحقول؛ Reset لا يعيد default branch أو route IDs محجوبة/منتهية السياق |
| الطباعة وإكسل | نفس منحة التقرير، مع تحقق applied filter grants وhasOutput؛ إلغاء print frame مباشرة حتى بعد اكتمال القراءة؛ لا تصدير جزئي أو مالية جديدة |
| توسيع/طي الشجرة | مالك DataTable/ReportTreeActions المحلي الحالي، داخل host المحجوب/inert عند رفض التقرير؛ لا permission أو API جديد |
| رابط الأستاذ من الميزان | leaf حالي فقط، source grant+destination registry+Account.Lookup، canRead/busy/context؛ object membership في response الحالية، لا parent/clone/stale response |
| الجلسة | الحارس المباشر يقارن mounted dataContext وopening auth/token قبل الأحداث؛ تبديل المستخدم/توكنه ينهي الجلسة المعتمدة حتى إعادة الفتح |
| السياق المرجعي/الفروع | reset قائم يمسح output/IDs ويستعيد خيارات السياق الجديد دون replay للبحث؛ لا عودة لinitial route IDs في Reset |

الحسابات والمال والدقة والـopening والـtotals وأقسام العملات والتفرع
لم تتغير. أعمدة الأستاذ date/type/voucherNo/contact/vehicle/description/
currencyCode/debit/credit/balance تقابل LedgerLine بنفسها، مع معرّفات القيد
والتفصيل وprecision عند القارئ الحالي. أعمدة الميزان accountCode+accountName،
beginningBalance/debit/credit/netActivity/endingBalance تقابل TrialBalanceLine؛
accountId/parentId/allowChildren/children تخدم hierarchy والرابط. TotalDebit/
TotalCredit وافتتاح/أقسام عملات الأستاذ من الخادم. لا ListVM أو Add/Update
أو AutoMapper أو namespace/type/backend جديد، ولا migration مطلوب.

## المالك المشترك والأعمار

امتد AccountReportConfig وAccountReportFilterDefinition بمدخل
accessRequirement الاختياري من PermissionRequirement القائم. يستهلك
AccountReportPageComponent المقيّم الحالي؛ لا خدمة منح أو HTTP إضافي.
غياب المدخل يحفظ سلوك المستهلك السابق، ولا يعني تبني بقية التقارير.

كل finite report/lookup/watch تحت denied$ وسياقه، وouter requests باقية.
Search snapshot مستقل ومعقم؛ تعيد المنحة قراءة التقرير الذي بُحث بالفعل
مرة بعد bootstrap، ولا تعيد revision غير مرتبطة التقرير. تتبع الأعلام
المحلية reportInterrupted/lookupInterrupted الانقطاع حتى لو سُحبت المنحة
وعادت قبل effect، فتُستعاد القراءة أو watch مرة دون إعادة تقرير غير مطلوب.
auto/recovery المؤجل Observable من Promise، وnotifier يلغي المهمة نهائيًا
حتى لو كانت المنحة النهائية مساوية؛ لا إحياء للتأخير القديم.

حُجبت/inert الواجهة المرفوضة، وأغلقت Select/DatePicker portals. الحقول
المحجوبة معطلة ومعقمة؛ لا يعتمد الضبط على enabled controls أو getRawValue.
حق الحساب الإلزامي مسحوب؟ يظل الأستاذ مرفوضًا، ويُختار الحساب مجددًا بعد
عودة مصدره؛ لا تخمين أو إعادة ID قديم. لا أسرار في المفاتيح/الـlogs؛
مقارنة التوكن في الذاكرة فقط. لا كتابة مالية أو cleanup في هذين التقريرين.

أظهر فحص stylesheet المالك تعارضًا مصدريًا مثبتًا: display:block في
ReportPage وdisplay:flex في layout قد يتغلبان على native hidden. صُححت
الأولوية في ReportPage.scss للـhost، وفي styles.scss لمالكي list/editor/form
القياسيين عند hidden+inert معًا فقط. لا هدم للمسودة ولا تغيير إظهار
panel غير محجوب بالوصول؛ لا تغيير لprint الخاص بالتبويب العادي. توجد
computed-style specs للقالب الحقيقي وللمالك القياسي تحت نفس styles.scss
المثبت في test builder. هذه مراجعة الجذر المصدرية، وليست قبول CSS بصريًا.

المراجعة المستقلة وجدت نافذتي queued autoSearch وتبديل actor قبل effect؛
أصلحهما الجذر ثم أصلح rapid read/watch recovery المترتبة عليهما. أعيد
تدقيق flags والمواصفات دون عائق مؤكد متبقٍ. ملاحظة legacy language reset
لم تُعامل كعيب جديد: subscription والسلوك موجودان في المصدر قبل هذه الدفعة
وتوثقهما UI20 ودفعة العملة؛ لم يُحذف هذا العقد السابق.

## المطابقة والتحميل والكاش

| الاهتمام | الكتاب/المالك | النتيجة |
|---|---|---|
| التقرير07 | UI20/21؛ AccountReportPage فوق ReportPage/ReportActions/DataTable/SummaryCards | نفس الشكل والتمرير والطباعة؛ لا markup/style منافس |
| الوصول | UI7/26/28؛ AccessViewPolicyService وRouteAccessPolicyRegistry | مفاتيح مصادر وأحداث فعلية؛ guard والـhandler ووجهة الرابط متطابقة |
| التهيئة | UI2/22؛ finite forkJoin ثم ReferenceLookupBindings | cancellation/defaultIfEmpty وclear/rebind وreadiness/error/Retry، مع حفظ تسمية المختار غير المؤهل كخيار disabled |
| التحميل | UI22؛ LoadingService للقراءة وReferenceLookupStatus page lease للخيارات | start/finalize/release بالمسارات الموجودة؛ refresh محتفظ بالبيانات صامت، لا مؤشر فلتر محلي |
| التاريخ والمال | UI17/19 وBE15 | لا تغيير عدد الكسور أو أحداث العملات أو تواريخ التقرير؛ الأعداد والهويات تبقى صحيحة |

المصادر: AccountReports/Ledger وAccountReports/TrialBalance operational
direct complete Result<T> بلا cache. Account/GetSelect وCostCenterGroup/
GetSelect direct reference بلا opt-in؛ لا watch مخترع. Branch/GetSelect
opted-in لدى BranchService/BaseService/ReferenceLookupCache، مع watch/
refresh منفصلين في التقريرين؛ أضيف الناقص في الميزان. writers/topics/
TTL/revision invalidation تبقى لدى المصدر المشترك، مع selected label
والفشل/Retry/context clearing. مصدر الصلاحيات هو جلسة واحدة، لا إدارة
snapshot لمستخدم آخر. توافق المصدر لا يثبت network/TTL/loader runtime.

مسار loading الفعلي: صفحات Ledger/Reports/TrialBalance تستورد config ثم
AccountReportPage، وshowPageLoading يرث المضيف الحالي؛ التقرير يبدأ
LoadingService ويحرره finalize على النجاح والفشل والإلغاء، والخيارات تملك
loadingLookups → ReferenceLookupStatus → page lookup lease. لا modal جديد
أو قراءة حوار. الطباعة تستخدم ReportPrintSession والمجموعات الكاملة، وتُحفظ
hierarchy/الأرصدة الافتتاحية حتى بلا حركة وفق hasOutput الحالي للأستاذ.

## الأداء والاستعلام والفهارس

لا request مالي جديد. الحسابات/الفروع/مجموعات التكلفة bootstrap متوازية
بمصادرها المستقلة؛ لم تُوازَ استعلامات EF على DbContext واحد. البحث طلب
تقرير كامل واحد، والطباعة وإكسل يستهلكان نفس النتيجة المعتمدة دون GET جديد.
لا تشغيل report GET بسبب revision غير متعلق؛ cache reference revalidation
القائم مستقل ومسموح تحت UI2.

الأستاذ يقرأ account/base currency وcost center scope، ثم grouped opening
وقائمة حركة الفترة مرتبّة Date/JvId/DetailId، ويفصل العملة الأصلية من
اللقطات الموجودة. الافتتاح لا يُحمّل كتاريخ كامل. الميزان يقرأ account
metadata ثم grouped opening/period totals، ويبني hierarchy/rollup من النتيجة
الكاملة بلا per-row API. لا server paging جديد أو تغيير count/totals.

حارس الرابط كان قد يمشي الشجرة لكل سطر؛ يستخدم الآن WeakMap للـresponse
الحالية ومجموعة object identities تُبنى مرة، بدل إعادة walk لكل eligibility
check. هذه ملاحظة تعقيد مصدرية وليست قياس سرعة. لا schema/query predicates
أو joins/order تغيرت، لذا لا index جديد مقترح لهذه الدفعة؛ لم تُقرأ actual
SQL plans أو فهارس القاعدة. القياس المعلق: نفس tenant/branch scope والفترة
وحجم البيانات، cold/warm requests وpayload/وقت bootstrap/report/render/
print/export وخطط opening/grouping؛ تقارن correctness/count/totals مع latency
والذاكرة قبل أي فهرس وتكلفة كتابته/تخزينه. لا before/after مقاس هنا.

## المراجع والدليل والمصالحة

المراجع الفعلية: Speed entry، section21/screen18-ledger و05-trial-balance
من snapshot٢٨أكتوبر، ثم C0500 وC0518 منفصلتين. الـcatalog٢٧أكتوبر لم يعط
عنوان شرح أصلي مطابقًا بالبحث المحدد. الأحداث والفلاتر والإخراج ورابط
الأستاذ مطابقة كفكرة وظيفية؛ المصدر لا يثبت authorization Sigma أو حساباتها.
divisions/costCenter2/debitwise/multicurrency trial وفتح مستند من الأستاذ
فجوات مرجعية خارج ربط الأحداث الموجودة، وتبقى لعقد مستقل. لا صورة جديدة
ولا ادعاء تطابق وظيفي شامل؛ Odoo متاح لكن لا مفهوم مفقود يحتاجه هذا الربط.

دليل التطبيق EN/AR محدث في accounts-guide.ts بموضوعي /Ledger و
/Reports/TrialBalance، والقارئ /UserGuide/accounts وعنصر دليل الحسابات قائمان.
يغطي المنح والفلاتر الاختيارية وleaf destination وعمر الإلغاء وإعادة المنح
والسياق. ترقّت القدرة العامة إلى UI20/26 ومهارة sigma-screen-refactor في نفس
الدفعة؛ أعيد توليد الحزم الثماني بالمولد وفُحصت، لا تعديل generated يدوي.
الدلالات الجديدة مدخلات اختيارية للمالك الموجود، لا سلطة مالية أو تنفيذية.

المواصفات source-only بالقوالب الحقيقية في account-report-access.spec.ts
وLedger/ledger.component.spec.ts وTrailBalance/list.component.spec.ts، مع
route registry specs. تغطي partial grants وread/lookup omission، form/
raw/applied/Reset، revoke/regrant العادي والسريع، watch recovery، queued
auto cancellation، actor-before-effect، deferred print، context reset،
واختيار leaf من النتيجة الحالية ورفض parent/clone/stale rows. لم تُشغّل،
ولا يُدعى RED/GREEN أو compile أو DOM/browser acceptance.
تضاف protected-surface-visibility.spec.ts وspec للحفاظ على سلوك config
غير المتبنية، دون اختراع bypass للإعدادات المعتمدة.

الملكية: العامل الحالي branch_access_admin للتقريرين ومواصفاتهما فقط،
والجذر للمالك المشترك والمسارات والدليل والجرد والوثائق والتكامل، ثم
sales_details_adoption لتدقيق مستقل للجزء المحدد قراءة فقط. نماذج موروثة
بلا override أو عامل جديد؛ الاستقلال قلل زمن العمل دون ملفات مشتركة.

الجرد يصبح22operation-confirmed من262بندًا و259اسمًا، مع136resource-only
و100unknown و2context-only و2alias. يضاف دليل child adoption منفصل إلى صف
Reports للميزان فقط، ويبقى الصف unknown لبقية أطفاله. العدد ليس نسبة
اكتمال كل الشاشات أو الأحداث، والهدف الشامل active.

قبل قبول التشغيل: يبني المالك الواجهة ويشغّل المواصفات المركزة، ثم يجرب
ordinary read/grant withdrawal/regrant سريع وبطيء، role refresh/تبديل actor/
توكن/branch context، partial lookup grants، التقارير الكاملة والطباعة وإكسل
ورابط الحساب الحالي، ويفحص loaders/portals والاتجاهين والثيمين والموبايل
وHTTP branch effects. لا migration مطلوب، والمالية السابقة محفوظة.

اقتراح الواجهة: `feat(auth): adopt ledger and trial balance report access`

اقتراح الوثائق: `docs(ui): document adopted account report access lifetimes`

## نتيجة التحقق المصدرّي الأخيرة

راجع الجذر scoped diff للواجهة وللوثائق كلٌ في مستودعه، والملفات الجديدة
مباشرة، وأبقى تعديلات العملة السابقة في Ledger/models ومالكه المشترك.
نجح diff --check في المستودعين exit0، وعلامات الدمج في النطاق0؛ تحذيرات
EOL فقط. الوصفات8/8OK بعد التوليد الأخير، وJSON262/259 وعداداته
22/136/100/2/2 مطابقة metadata؛ parent Reports ما زال unknown وله child واحد
مؤكد. أُكد source inclusion للمواصفات عبر tsconfig.spec، ولـstyles.scss عبر
test/build manifest، ولم تضف ملفات runtime جديدة خارج imports الحالية.
تستعمل guards والترجمات الحالية، وcontent دليل الحسابات ثنائي اللغة.
لا أسماء .NET أو namespace/project references جديدة، ولا migrations أو
snapshots مطلوبة لهذه الدفعة. لم يُشغّل بناء أو اختبار أو lint أو متصفح أو
أمر قاعدة بيانات أو commit/push/deploy، ويظل قبول المالك التشغيلي/البصري معلقًا.
