# مصالحة صلاحيات تقارير القوائم المالية — ٧ نوفمبر ٢٠٢٦

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| العقد | ACCOUNT_STATEMENTS_ACCESS_ADOPTION_CONTRACT_FREEZE.md |
| الهدف العام | active؛ لم يكتمل تبني كل الشاشات والأحداث |
| التنفيذ | ١٢ تقريرًا، مالك التقرير الحالي، مسارات دقيقة، دليل وجرد |

## النتيجة ومطابقة العقد

| العقد/المالك | الدليل النهائي | النتيجة |
|---|---|---|
| مفاتيح التقارير الاثني عشر | configs في المجلدات المسماة بالعقد؛ AccountReportsController + ReviewedPermissionOperations | مطابق؛ لم تخترع مفاتيح View/Export/Print |
| السنة الإلزامية | BudgetVariance config/registry: GetBudgetVariance + FiscalYear.GetSelect | مطابق؛ متحكم FiscalYear مستقل، لا Lookup بديل |
| المصادر الاختيارية | Branch.Lookup مع bootstrap/watch/refresh في٩تقارير؛ CostCenterGroup.Lookup مباشر في٦؛ FiscalYear.GetSelect اختياري في CashFlow؛ ReportOptions/PostingSelect اختياريان في BudgetVariance | مطابق؛ يزيل المالك قيم الرفض من form/raw/applied/recovery/reset |
| عمر الصفحة والمخرجات | AccountReportPage accessRequirement الحالي؛ sanitization/cancellation/recovery/portals/output guards | إعادة استخدام؛ لا evaluator أو cache أو loader منافس |
| روابط الأستاذ الخمسة | IncomeStatement/BalanceSheet/BalanceSheetMonthWise/CashFlowStatement/VehicleIncomeStatement؛ canOpenLedger في enable وhandler | مطابق؛ منحة المصدر + Ledger + Account.Lookup + سياسة الوجهة + حالة/عضوية السطر |
| كائن السطر الحالي | AccountReportPage.canActivateRow + computed activationRows من الأقسام الهرمية الحالية | مطابق؛ يدعم transformed rows ويرفض clone/old rows والتحميل/الطباعة وعرض القائمة البديل وانتهاء السياق |
| باقي الأحداث | البحث والتحديث وإعادة الضبط والمحاولة والطباعة وإكسل وتبديل العرض تحت المالك الحالي؛ tree expand/collapse محلي داخل host المحجوب، والرجوع يبقى مخرجًا متاحًا | مطابق للنطاق؛ لا writes أو مفاتيح مستقلة مخترعة |
| المسارات والقائمة/landing | RouteAccessPolicyRegistry:١٢exact policies وlanding candidates؛ sidebar يستهلك السجل الحالي | لا prefix عام، ولا فتح Reports الأب أو شقيق غير متبنٍ |
| الواجهة والمال | الأقسام والأعمدة والإجماليات والحسابات وstatement/export الحاليون محفوظون | لا تغيير مالي أو API/DTO أو AutoMapper أو schema أو namespace خلفي |
| دليل المستخدم | modules/UserGuide/content/accounts-guide.ts ثنائي اللغة؛ /UserGuide/accounts | القوائم والميزانيات والدخل والمقارنة والمركبات والتدفق وتباين الموازنة وروابط الأستاذ |
| قاعدة عامة موثقة | UI20 وSigma skill router/revision؛ generator ثم Check | لا تعديل يدوي للحزم؛٨/٨OK |

الجرد بعد الدمج:٣٤operation-confirmed،١٣٦resource-only،٨٨unknown،٢context-only،٢alias
من٢٦٢بندًا و٢٥٩اسمًا مميزًا، معchild واحد مستقل للميزان تحت Reports. بقيت
تكرارات BillDetail/Provision/ProvisionDetail السابقة. هذه إحصاءات تبني مصدرية،
وليست نسبة قبول أحداث التطبيق أو نجاح تشغيل.

## الملفات والملكية

مستودع الواجهة:

- ملفات config الاثني عشر تحت Accounts/IncomeStatement* وBalanceSheet و
  BalanceSheetMonthWise وCashFlowStatement وVehicleIncomeStatement وIncomeComparison
  وBudgetVariance، في component المسار الفعلي المحدد بالعقد.
- ملف المالك Accounts/shared/report-family/account-report-page.component.ts؛
  الإضافة الحالية canActivateRow وactivationRows فقط، مع حفظ تغييرات الدفعات السابقة.
- ملفا shared/authorization/route-access-policy.ts وroute-access-policy.spec.ts؛
  كلاهما untracked من تأسيس الصلاحيات السابق، قرئا مباشرة وفُحصا دون staging.
- مواصفات account-report-access.spec.ts وCashFlowStatement/list.component.spec.ts
  وIncomeStatement/list.component.spec.ts وincome-statement-family-access.spec.ts.
  طُورت مواصفات الإنشاء البسيطة السابقة للتقريرين إلى تغطية للقالب الحقيقي؛
  لم توجد تعديلات سابقة غير محفوظة عليهما في جرد بداية هذه الدفعة.
- ملف دليل الحسابات الحالي المذكور أعلاه؛ حُفظت إضافات الدفعات الأخرى.

مستودع الوثائق: sigma-erp/ui/20-report-page.md والحزم الثماني المشتقة عبر
Generate-SigmaRecipes.ps1. المهارة وreviews خارج Git حاليًا؛ لم يُدَّع حفظهما
في المستودع أو إصدار commit. لا تعديل خلفي جديد في هذه الدفعة، ولا migration مطلوب.

العامل branch_access_admin امتلك مجلدات الدخل الستة فقط، وسلّمها للجذر.
المراجع branch_ui_final_review قرأ تلك الشريحة، والمراجع sales_details_adoption
قرأ الستة الأخرى والمالك والسجل. كلاهما بلا finding مؤكد؛ الجذر راجع التكامل
والفروق وصحح nullability children في مواصفة CashFlow. النماذج موروثة من الجلسة
القائمة؛ إعادة استخدام العاملين خفّض تكرار اكتشاف المالك ووفّر مراجعة مستقلة
بملكية كتابة منفصلة. لا عامل أو ملكية كتابة معلقة عند التسليم.

## الأدلة المرجعية والحدود

طبق الاكتشاف UI07 Report وBE17 وUI20/21/26/28 مع بوابات UI2/22/29 وMaster1/4/5/7.
قرئت شرائح Speed06–16 و21 من قسم21 بتاريخ2026-10-28، ثم بشكل منفصل تصريحات
الطلبات/الأحداث من متحكماتها المسماة بالعقد. قرئت أسماء/فلاتر FY/FY2 صراحة.
لم يجد البحث المحدد شرحًا مطابقًا في guide/catalog بتاريخ2026-10-27؛ لا يُدعى
قراءة شرح غير موجود. لا غموض مفاهيمي بعد المصدر المحلي يحتاج Odoo لهذه الدفعة.
لا screenshot جديد؛ المراجع تصريحات واجهة، وليست إثبات تنفيذ خادم أو محاسبة.

الفجوات المرجعية التي بقيت خارج شريحة تبني الصلاحيات: فلاتر المركز المالي
الإضافية، عميل المركبة، مركزي تكلفة مستقلين، اختيار FY بدل فترة الأشهر، ونوافذ
إعداد التدفق المرجعية. تبقى partial/missing بحسب العقد؛ لا تدعي هذه المصالحة
مطابقة وظيفية كاملة أو تفويض إضافة سياسة مالية.

## التحميل والكاش والاستعلام والفهارس

الطلبات التشغيلية AccountReports/{action} مباشرة بلا cache، عبر
AccountReportEndpointService. الصفحة تملك البحث/التحديث، required bootstrap
والطباعة عبر المالك العالمي؛ retain refresh لمصدر Branch صامت في
ReferenceLookupBindings، مع selected-label/failure/Retry/teardown الحالي.
Branch وحده opted-in في هذه المصادر؛ FiscalYear/CostCenterGroup/Account و
AccountGroupDefinition.ReportOptions تبقى مباشرة. لم يضف التنفيذ per-row HTTP.
تُحسب مجموعة عضوية الروابط عند تغير sections بدل إعادة المشي على الشجرة لكل رابط.

مصدر الاستعلامات قرئ: AccountReportsService وAccountReportHelper.BuildJournalQuery
والتجميعات والحسابات، وCashFlowReportService.LedgerQuery/LoadLedgerLinesAsync.
التقارير الاثنا عشر EffectReads في BranchOperationRules؛ تحافظ على أثر الفروع
المسموحة، ولا يعوض إخفاء فلتر الفرع إنفاذ الخادم. المقارنات تستخدم تجميعات SQL
في مواضعها الحالية، لكن BudgetVariance يحمّل journalTotals ثم يجمعها بالذاكرة
عند الأسطر٢٦٨٨–٢٧١٧تقريبًا؛ متابعة أداء قائمة، دون تغيير صيغة الأرقام في هذه الدفعة.
CashFlow يقرأ سطور الفترة اللازمة لتحليل القيد؛ لا يجوز قص بعض أطرافه لتحسين
سرعة شكلية. لم تُنفَّذ أوامر قاعدة أو SQL plans، ولم تثبت سرعة مقاسة.

قرئت configurations للقيد وسطره وAccountBudget. الموازنة تصرح بفهرس فريد
(SubscriptionId,FiscalYearId,AccountId,Year,Month) يدعم بداية predicate الفعلية؛
لا فهرس إضافي مطلوب لتبني الصلاحيات. ملفا القيد لا يصرحان بتغطية تاريخ/حالة
مركبة محلية، لكن ذلك لا يثبت غياب فهرس فعلي في قاعدة البيانات أو طبقة إعداد أخرى.
مرشح مراجعة لاحقة عند إثبات plan bottleneck: القيد
(SubscriptionId,Date,Id) INCLUDE(IsPosted,IsVoided,BranchId,IsDeleted)، والسطر
(SubscriptionId,JournalVoucherId,AccountId) INCLUDE(BranchId,CostCenterId,Debit,Credit,IsDeleted).
قد يتداخلان مع فهارس FK/tenant الحالية؛ يلزم فحص التغطية والخطة وعدد الصفوف
وتكلفة الكتابة/التخزين أولًا. لا filtered IsDeleted=0 لأن NULL حي، ولا تخمين
تحسين لشرط coalesce الخاص بالفرع. المقترح تشخيصي فقط، لا schema أو migration هنا.

قياس المالك القابل للمقارنة: نفس tenant/grants/working branch/filter وحجم البيانات،
تحميل بارد ثم دافئ،١٠محاولات لكل حالة، عدد الطلبات وزمن bootstrap/report وpayload
وrender وSQL reads/plan. قارن revoke/regrant وتغير اختيارات الفرع دون إعادة تشغيل
report GET غير مطلوب. قبل/بعد غير مقاس في هذه الدفعة.

## التحقق المنفذ والقبول المتبقي

فحص scoped git diff --check للواجهة:exit0؛ merge markers:0؛ فحص whitespace
للملفات غير المتتبعة ذات الصلة:0. فحص مستودع الوثائق:exit0. recipe Check بعد
التوليد:٨/٨OK. JSON parse وعداداته:مطابقة34/136/88/2/2 وchild1 و٢٥٩اسمًا.
تنبيهات EOL فقط؛ ليست نتيجة build. راجع الجذر الفروق المنفصلة للمستودعين
والملفات الجديدة مباشرة، وحُفظت تغييرات العمل السابقة.

المواصفات مكتوبة ومراجعة مصدرًا **ولم تُشغّل**؛ لا RED/GREEN أو build passing.
المراحل٠/١/٢/٥/٦ مطبقة بالنطاق المصدري؛٣/٤ غير منطبقتين لعدم وجود writes.
لم يُشغّل build أو test أو lint أو browser أو DB أو migration أو commit/push/deploy،
ولم يستخدم Sigma MCP أو Graphify. العقود والمخرجات المالية وAutoMapper لم تتغير.

قبول المالك: تشغيل المواصفات والبناء، ثم حساب عادي بمنحة كل تقرير منفردة؛
تجربة الفلاتر المسموحة/المرفوضة وdefault branch والتاريخ وحده في CashFlow،
ومنع BudgetVariance دون اختيارات السنة. سحب المنحة أثناء lookup/report/print
ثم إعادة منحها؛ لا نتائج متأخرة أو GET متكرر بسبب revision غير متعلق. افتح
الأستاذ من صف حالي، ثم جرّب النتيجة القديمة/سحب الوجهة والتبديل إلى statement.
تحقق من كامل الطباعة/Excel، RTL/English والثيمين والشاشة الضيقة وقياسات الأداء.

رسالة commit مقترحة للواجهة فقط:
`feat(accounts): adopt statement report permissions and current-row navigation`

رسالة commit مقترحة للوثائق فقط:
`docs(reports): document current section row activation checks`

هذه اقتراحات؛ لم يُنشأ commit. بقية الشاشات تحتاج دفعات اكتشاف وعقود وتبني،
ولا تُفتح resource-only/unknown تلقائيًا لإكمال الأرقام.
