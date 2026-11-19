# عقد صلاحيات البنود 181–190 — 14 نوفمبر 2026

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| النطاق | المسارات 181–190 في ROUTE_PERMISSION_ADOPTION_INVENTORY.json بالترتيب |
| أصل القواعد | AGENTS.md والرفيق الحي، sigma-screen-refactor، العقود المجمدة القائمة، وأفعال Sigma HTTP الفعلية |
| التحقق عند التجميد | مطابقة مصدرية أولية؛ وصفات التوليد 8/8 سليمة؛ التحقق بالبناء والتشغيل لاحق |

## المنح والمسارات الثابتة من التنفيذ

| رقم | المسار | واجهة HTTP ومنحها القائمة | حالة العقد |
|---|---|---|---|
| 181 | /followUpReport | GET Customer/FollowUpReport = Customer.GetFollowUpReport | قراءة التقرير مستقلة عن تقرير تحصيل الديون؛ اختيار العميل يتطلب Customer.Lookup عند استعمال الفلتر؛ `User/GetSelect` تابع لسياسة TenantAdmin وحدها، وفلاتر المستخدم المستخرجة من النتائج لا توسّع نطاق الصفوف |
| 182 | /BalancesSummary | GET Customer/BalancesSummary = Customer.GetCustomerBalancesSummary؛ كشف الصف GET Customer/Statement = Customer.GetCustomerStatement؛ الاختيارات Branch.Lookup وCustomer.Lookup وStaff.Lookup | يسري PARTNER_BALANCES_ACCESS_ADOPTION_CONTRACT_FREEZE.md |
| 183 | /ReceivableAgeAnalysis | GET Customer/ReceivableAgeAnalysis = Customer.GetReceivableAgeAnalysis؛ اختيارات Customer.Lookup وContactGroup.GetSelectByType وStaff.Lookup وBranch.Lookup وCurrency.Lookup | يسري AGE_ANALYSIS_ACCESS_ADOPTION_CONTRACT_FREEZE.md |
| 184 | /StatementOfAccount | GET Customer/Statement = Customer.GetCustomerStatement؛ اختيار العميل Customer.Lookup | كشف مستقل؛ مرشحات الشاشة من مصدرها |
| 185 | /ProcessPayroll | PayrollRuns.Calculate وSave وGet وRevisions وRevision وLogs؛ PayrollDisbursement.Get/Pay/Void للنوافذ التابعة | إجراءات مميزة؛ POST calculate معاينة read-only، وPOST save كتابة؛ لا يُساوى الاعتماد بالصرف |
| 186 | /HRM/Reports | GET PayrollsReport = PayrollsReport.Get؛ /HRM/Reports/DriverTimeSheet يستخدم DriverTimeSheetReport.Get/GetOptions | مساران فرعيان مستقلان بحسب endpoint الحقيقي؛ مرشحات موظف ومسمى تحتاج grants مصدرها الفعلي |
| 187 | /ProcessedPayrolls | GET PayrollRuns = PayrollRuns.List؛ GET run=PayrollRuns.Get؛ POST approve = PayrollRuns.ManageApproval بموجب PermissionCatalogAction على PayrollRunsController.Approve | الاعتماد يتطلب أيضًا PayrollRuns.Get في PermissionPrerequisites؛ لا يكتسبه مستخدم بمجرد List |
| 188 | /ProcessLeaveSalary | نفس PayrollProcessComponent مع type=LeaveSalary؛ PayrollRuns.LeaveSalaryStaff/Calculate/Save/Get/Revision(s)/Logs | نوع التشغيل محدد في route data ويثبت في body؛ مراجعة فصل النوع عند HTTP |
| 189 | /FinalSettlementProcess | PayrollRuns.SettlementStaff/Calculate/Save/Get/Revision(s)/Logs بنوع FinalSettlement | الحساب والحفظ عقدهما الحالي؛ لا تقدير قواعد استحقاق جديدة من Speed |
| 190 | /PaySlips | PaySlips.List/Staff/Get | تفاصيل قسيمة مستقلة؛ الاستعلام والطباعة وExcel تُربط بمنحة المخرجات |

## القواعد الحاكمة للتنفيذ والمراجعة

1. يربط مسار الصفحة بإجراء القراءة الفعلي، ثم تُفحص منح الأفعال التابعة ومنح مصادر الاختيار كل على حدة. الخادم يفصلها في PermissionEndpointResolver ثم PermissionAuthorizationFilter ثم PermissionPrerequisites؛ وجود زر مشروط وحده لا يؤمن HTTP.
2. تُطبق فروع قراءة الصفوف والآثار وفق BranchAccessContext وBranchOperationRules، وتُحفظ مجاميع الشركة الصحيحة عند وجود حركات مخفية مع منع كشف مستندات وفروع غير قابلة للعرض. كل طلب يحكمه المستخدم/المستأجر الحالي، وتبقى المخرجات القديمة غير صالحة بعد تغير المنحة أو السياق.
3. يتوقف التقرير أو الطباعة أو التصدير عند فقد منحة القراءة أو تغير السياق، ويُسقط الفلتر الذي فقد منحة اختياره وقيمة نتيجته. تبقى مسودة المحرر محلية إلى أن يؤكد المستخدم تجاهلها، ويُسوّى الطلب المرسل دون تكرار نشره بعد استعادة المنحة.
4. يظل حساب الرواتب واعتمادها والصرف وتسوية المستحقات مملوكًا لخدمات الحساب والحفظ الخلفية الحالية. لا تقترح شاشة أرقامًا مالية جديدة ولا تغير الترقيم أو تاريخ المراجعات.
5. **قرار نطاق الرواتب التاريخي المؤجل:** PayrollRun وPayrollLine لا يحتويان BranchId محفوظًا (PayrollRun.cs:5–20 وPayrollLine.cs:5–22). لا يجوز اعتبار فرع الموظف الحالي دليلًا على الفرع التاريخي للقيود بعد النقل. أي إضافة فرع محفوظ أو إعادة تصميم نطاق التشغيل بين الفروع أو هجرة قاعدة تحتاج عقدًا ماديًا واضحًا وطلب هجرة صريحًا؛ يُعالج فقط المسار الذي يمكن إثبات نطاقه حاليًا ويُوثّق الباقي كـ Blocked. لا توسع صلاحيات الموظفين أو الرواتب لمجرد أن المنحة موجودة. العقود المالية الوظيفية المجمدة سابقًا هي المرجع لأي حساب أو صرف، وتحتفظ بكل قرارات المالك السابقة.

## مرجع الوظائف وحدود الاستدلال

- Speed 2026-10-28: customers/screens/03–05 و08؛ controllers C0700/C1025/C1039/C1066. HRM/screens/01–05 و15؛ controllers C0379/C0377/C0375/C0383. الصيغ توثق الأفعال والمرشحات وظيفيًا، ولا تثبت HTTP أو فرع أو قاعدة حساب مالي.
- دليل Speed 2026-10-27 يتناول الرواتب والتسوية على مستوى عام (الموارد البشرية، قرابة السطر 279)، ولا يثبت معادلة إنهاء خدمة لدولة بعينها. لا يستنتج من هذا الدليل تعديل FinancialNumberPolicy.
- العقود القائمة بالترتيب الوظيفي: `reviews/HRM_PAYROLL_CONTRACT_FREEZE.md` و`reviews/HRM_PAYROLL_CALCULATION_CONTRACT_FREEZE.md` و`reviews/HRM_PAYROLL_DISBURSEMENT_CONTRACT_FREEZE.md` و`reviews/LEAVE_SALARY_PAYROLL_PROCESS_FRONTEND_BACKEND_CONTRACT_FREEZE.md` و`reviews/PAYROLL_FINAL_SETTLEMENT_PAY_SLIPS_CONTRACT_FREEZE.md`. أي تعديل للصرف أو الفترات أو اللقطات يلتزم بالقرارات الأصلية وبالامتدادات المصادق عليها فيها.
- العوائق المصدرية الموثقة تُغلق بالمعالجة المسموحة ومطابقة المصدر والدليل، ويظل قبول HTTP الحقيقي والمتصفح وSQL ومعاملات الحفظ والصفحات الكبيرة منفصلًا عن البناء.
