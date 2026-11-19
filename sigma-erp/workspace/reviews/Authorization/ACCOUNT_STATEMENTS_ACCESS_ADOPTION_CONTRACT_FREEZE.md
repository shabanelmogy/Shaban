# تبني صلاحيات تقارير القوائم المالية — ٧ نوفمبر ٢٠٢٦

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| الهدف | دفعة ضمن تفعيل صلاحيات كل الشاشات والأحداث؛ الهدف العام active |
| النطاق | تقارير الحسابات الاثنا عشر أدناه ومالكها الحالي، سجل المسارات، دليل الحسابات والجرد |
| التحقق | مصدري فقط؛ لا بناء أو اختبارات أو متصفح أو قاعدة أو migrations |

## العقد المستهلك

| المسار الحقيقي | طلب GET تحت AccountReports | متطلب الصفحة والمسار |
|---|---|---|
| /IncomeStatement | IncomeStatement | AccountReports.GetIncomeStatement |
| /IncomeStatement2 | IncomeStatement2 | AccountReports.GetIncomeStatement2 |
| /IncomeStatementYtd | IncomeStatementYtd | AccountReports.GetIncomeStatementYtd |
| /IncomeStatementYtd2 | IncomeStatementYtd2 | AccountReports.GetIncomeStatementYtd2 |
| /IncomeStatementFy | IncomeStatementFy | AccountReports.GetIncomeStatementFy |
| /IncomeStatementFy2 | IncomeStatementFy2 | AccountReports.GetIncomeStatementFy2 |
| /BalanceSheet | BalanceSheet | AccountReports.GetBalanceSheet |
| /BalanceSheetMonthWise | BalanceSheetMonthwise | AccountReports.GetBalanceSheetMonthwise |
| /CashFlowStatement | CashFlow | AccountReports.GetCashFlow |
| /BudgetVariance | BudgetVariance | allOf: AccountReports.GetBudgetVariance, FiscalYear.GetSelect |
| /VehicleIncomeStatement | VehicleIncomeStatement | AccountReports.GetVehicleIncomeStatement |
| /IncomeComparison | IncomeComparison | AccountReports.GetIncomeComparison |

الواجهة والخدمة الفرعية الفعلية لكل مسار قرئتا، والمفاتيح من
ReviewedPermissionOperations وPermissionEndpointResolver وAccountReportsController.
متحكم السنة المالية مستقل عن المتحكم العام؛ مفتاحه FiscalYear.GetSelect وليس
FiscalYear.Lookup. السنة إلزامية في مقارنة الموازنة فقط.

## مصادر الفلاتر

| الفلتر | الطلب/رمز الخدمة | المفتاح | التصنيف |
|---|---|---|---|
| الفرع في التقارير التي تعرضه | Branch/GetSelect؛ BranchService.getSelectList | Branch.Lookup | مرجع opted-in؛ finite bootstrap ثم watchSelectList وrefreshSelectList |
| مجموعة مركز التكلفة حيث توجد | CostCenterGroup/GetSelect؛ CostCenterGroupService | CostCenterGroup.Lookup | قراءة مرجعية مباشرة بلا opt-in؛ لا watch جديد |
| السنة في التدفق النقدي | FiscalYear/GetSelect؛ FiscalYearService | FiscalYear.GetSelect | اختياري؛ مباشر بلا opt-in |
| السنة في مقارنة الموازنة | المصدر نفسه | FiscalYear.GetSelect | إلزامي في الصفحة والمسار والفلتر؛ مباشر |
| نوع الحساب في مقارنة الموازنة | AccountGroupDefinition/ReportOptions؛ getReportOptions | AccountGroupDefinition.GetReportOptions | فلتر اختياري مباشر؛ يظل default الخلفي الحالي عند غيابه |
| الحساب في مقارنة الموازنة | Account/GetPostingSelect؛ getPostingSelect(Budget) | Account.GetPostingSelect | فلتر اختياري مباشر |

مكوّن AccountReportPage هو المالك الوحيد للقراءات: report/filter accessRequirement
الحالي، تنقية form/raw/applied/recovery/reset، إلغاء القراءة وwatch والطباعة المؤجلة،
حجب host/portals، فشل envelope/transport وRetry، وعودة القراءة بعد المنح. لا مفاتيح
طباعة أو تصدير مخترعة؛ تستخدم صلاحية التقرير الحالي ونتيجته الحالية وحالته.
لا قراءات lookup للفلاتر المرفوضة ولا تمرير لقيمها. الحجب لا يغير عزل الفرع الخلفي.

## الروابط والأحداث

روابط الأستاذ موجودة في الدخل الأساسي، المركز المالي، المركز المالي الشهري،
التدفق النقدي ودخل المركبات فقط. يلزم منحة التقرير الحالي ومنح
AccountReports.GetLedger وAccount.Lookup وسياسة /Ledger الحالية.
يلزم كذلك صلاحية الصفحة الفعلية وسياقها ونتيجتها الحالية وعدم تحميل التقرير
أو مصادره أو الطباعة، وعضوية **كائن السطر** في أقسام النتيجة الحالية، مع شرط
الحساب الموجب وشروط النوع الحالية. لا يكفي تطابق accountId مع سطر قديم/مصطنع.

يُضاف canActivateRow(row) في مالك AccountReportPage الحالي لفحص حالة المخرجات
والعضوية في الأقسام الهرمية الحالية مرة لكل تغيير؛ يظل شرط الوجهة والعمل
في المستهلك. يغطي الصفوف المصدرية والصفوف المحولة في المركز المالي والتدفق
النقدي دون مالك تنقل أو evaluator منافس. لا يُضاف رابط غير موجود سابقًا.
البحث والتحديث وإعادة الضبط والطباعة والتصدير وتبديل العرض تخضع للمالك الحالي؛
الطي والفتح يغيران العرض المحلي داخل host المحجوب. لا توجد writes في هذه الدفعة.

## الأدلة المرجعية والمطابقة

الحجم M لعائلة متجانسة، بالشكل UI07 Report وBE17، مع UI20/21/26/28
وUI2/22/29 وMaster1/4/5/7؛ المالك الحقيقي Accounts/shared/report-family
فوق ReportPage/ReportActions/DataTable/SummaryCards الحاليين. آخر recipe check:8/8OK.

قرئ مدخل Speed ثم شاشات قسم21 المؤرخة2026-10-28:06–16 و21؛ وبشكل منفصل
تصريحات إجراءات/طلبات متحكماتها C0479/C0474/C0475/C0487/C0519/C0486/C0488/
C0494/C0495/C0491/C0492/C0477 في readable/controllers. تثبت فلاتر وإخراج
وروابط عميل فقط، ولا تثبت قواعد صلاحيات خادم. البحث المحدد عن عناوين التقارير
في دليل2026-10-27 وcatalog لم يجد شرحًا أصليًا مطابقًا؛ لا ادعاء قراءته.
لا غموض مفاهيمي يحتاج Odoo لهذه الشريحة: العقود المحلية تجيب عن المفاتيح والأعمار.

| التفصيل المرجعي | الوضع في Sigma | القرار |
|---|---|---|
| فترات، أشهر، فرع، مراكز تكلفة، إخفاء الصفري | موجود بحسب كل تقرير | حفظ الحقول والعقود وربط مصادرها بالصلاحية |
| مقارنة الموازنة وسنة مالية ونوع الحساب | موجود؛ حساب Budget إضافي | حفظ الشكل، فصل المصدر الإلزامي عن الاختياري |
| شجر الحسابات والإجماليات والتصدير | موجود في المالك الحالي | حفظ كامل الصفوف والإجماليات المحسوبة خلفيًا |
| روابط الأستاذ في التقارير الخمسة | موجودة دون حراسة مكتملة | تبني شرط المصدر/الوجهة/كائن السطر الحالي |
| إعدادات التدفق النقدي والفلاتر الإضافية للمركز المالي/عميل المركبة/مركزي تكلفة وFY selector | partial/missing مقارنة بالمرجع | فجوات وظيفية منفصلة، لا عقود مالية أو فلاتر جديدة في دفعة الصلاحيات |

## الأداء والحدود

طلبات التقارير تشغيلية مباشرة بلا cache؛ queries تحت AccountReportsService
وCashFlowReportService يحتفظ بها مالك الحسابات. Branch lookup يستخدم الكاش الحالي
ومراقبته، وبقية المصادر مباشرة. لا per-row HTTP جديد؛ مجموعة عضوية محسوبة من
الأقسام بدل مسح الشجرة في كل زر. لا تغيير query أو index أو مالي أو schema؛
قياس network/SQL plans والحجم والتوقيت ومراجعة index فعلية تظل قبول المالك.
فروع أثر التقرير مصنفة EffectReads في BranchOperationRules؛ لا نقل لتصنيف المستند.

## الملكية والتسليم

الجذر يملك المكوّن المشترك وملفاته واختباراته، والتقارير الستة غير عائلة الدخل،
والسجل والدليل والجرد والتكامل. عامل محدود يملك مجلدات IncomeStatement الستة
فقط بعد هذا التجميد؛ المراجع مستقل للقراءة فقط. لا ملفات مشتركة للكتابة.
يشمل التسليم مواصفات مصدرية غير منفذة، diff review لكل مستودع متأثر، مصالحة
وجرد مضبوط ودليل ثنائي اللغة على المسار القائم /UserGuide/accounts.

قرار الفوترة السابق محفوظ: فاتورة بيع واحدة وتوزيع الصافي والضريبة على فروع
البيع التاريخية بنسب صافي الوحدات وضبط التقريب، بما في ذلك الفاتورة الجزئية.
لا تغيير لتلك الحسابات ضمن هذه الدفعة.
