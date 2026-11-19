# مراجعة بيزنس HRM كاملة — Sigma

| Item | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Review date | 2026-10-11 |
| Scope | Source-read-only business audit; Egypt and Arab countries |

## Manifest

طلب المالك مراجعة منطق الأعمال في `src/app/modules/HRM` وفهم الأجزاء الغامضة للوصول لأفضل تطبيق. أكد أن الأسواق مصر والدول العربية. التوصيات تصميم مقترح، وليست سياسات قانونية مجمدة أو إذن تنفيذ.

Actual repositories: `F:/My Work/Sigma/SiGmaAngularFrontEnd` and `F:/My Work/Sigma/SigmaBackend`. Frontend scope: HRM Administration/Attendances/Leaves/Holidays/Overtimes/Deductions/Payroll/Reports, directly connected Staff master and finance consumers. Backend scope: corresponding services/controllers/entities/configurations/DTOs/maps and direct shared persistence/auth/accounting consumers only. No full-solution scan.

Current working trees contain user-owned and earlier task changes, including settings, account mappings, staff roles/departments, payroll reads and opening leave balances. Existing migration files are owner-created; this review will neither modify them nor infer they were applied to a database. Source evidence describes the current working tree, not a deployed release. No new screenshots supplied for the broad audit; the earlier leave opening screenshot proves only a title and leave-type selector.

Shapes selected from canonical catalog: ordinary master lists/modal editors (UI01/BE13), staff multi-group record (UI03/BE14 where collections), settings/account mappings (UI06/BE16), payroll stateful financial process (UI08/09, BE15), read-only reports (UI07/BE17); calendar/process workspaces require domain-specific comparison. Approved reference roles are BranchService for normal entities, PurchaseOrderService for tracked children, InvoiceService for financial boundaries, shared settings service/helpers, Job list/shared modal shell, Individual step record and report owners named in the catalog. Business audit does not certify visual parity or full per-screen UI implementation compliance.

PLAN00 current-state/impact/options review, Phase00 evidence, Phase01 domain/API audit, Phase02 reads/report contract sampling, Phase03 writers, Phase04 transitions, Phase05 wiring, Phase06 reconciliation apply read-only. Recipe check passed for all eight packets. Required screen skill and canonical Master/backend/UI blocks govern evidence. Contracts remain current-source facts; new policy decisions stay Draft/Missing until the business owner decides.

Known authentication-only limitation and generic-engine debt are separated from feature-specific new findings using backend backlog19/UI30. No source/configuration/guide/instruction edits, builds, tests, lint, migrations, database commands, browser verification, commits, pushes, Sigma MCP or Graphify are authorized or run.

Audit workstreams: root owns staff/admin/account linking/localization/external primary-source comparison/final reconciliation; bounded `hrm_payroll_audit` and `hrm_leave_attendance_audit` workers inspect independent sources read-only. Detailed findings and target decisions follow after evidence reconciliation.

## نتيجة المراجعة

الموديول يحتوي على شاشات وصيانة بيانات ومحرك رواتب محفوظ بنسخ جيدة، لكنه لا يمثل حتى الآن دورة HR متكاملة قابلة للتطبيق في مصر وكل الدول العربية. أهم العمل المطلوب هو توحيد مصادر الحضور والإجازات والسياسات وربطها بالحساب، ثم إكمال الاعتماد والصرف والمحاسبة. التوصية: تطوير المالك الحالي لكل عملية، خصوصًا PayrollRunService، بدل إنشاء محرك موازٍ.

التصنيف المستخدم: **خلل مؤكد** يعني مسار كود يسمح ببيانات متعارضة أو يمحو حقيقة قائمة؛ **فجوة نطاق** تعني وظيفة غير موجودة أو مؤجلة بعقد سابق؛ **قرار سياسة** يعني اختيارًا لا تحسمه صورة أو أسماء الحقول. الأولوية P1 عاجلة للأثر أو لإكمال التشغيل، وP2 تحسين اتساق/صيانة. لا يوجد دليل على حادث إنتاج أو صرف مزدوج أو فساد قيود محاسبية؛ نتائج التنفيذ الفعلي لم تُختبر.

### قائمة الأولويات

| ID | الأولوية والتصنيف | النتيجة | الإجراء المقترح |
|---|---|---|---|
| F01 | P1 — خلل مؤكد | تعديل يوم في DutySchedule يمسح IsAbsent ولو التعديل في الوردية فقط | حفظ حالة الغياب ما لم تحدث إعادة تصنيف صريحة ومراجعة |
| F02 | P1 — خلل مؤكد | Attendance يسمح بتكرار الموظف/اليوم؛ شاشة الدوام تختار آخر Id وتخفي الباقي | مصدر يوم حضور واحد، كشف التعارض، وقيد فريد بعد مراجعة البيانات |
| F03 | P1 — خلل حدود مالية | salary revision يقبل magnitude/scale أوسع من decimal(18,2) ومجموع Gross خام | توحيد تحقق الأرقام والتقريب قبل إنشاء صفوف الراتب |
| F04 | P1 — خلل اتساق APIs | مسار StaffOverTime لا يطبق نفس حدود خدمة Overtime | مالك واحد للتحقق والحساب والتحويل |
| F05 | P2 — عقد زمني ناقص | Duty clocks تقبل TimeSpan بأيام، دون قواعد overnight أو اكتمال الفترات | تحديد يوم العمل وفترات زمنية صريحة والتحقق منها |
| G01 | P1 — فجوة نطاق | الرصيد الافتتاحي والإجازات لا يتصلان بمحرك استحقاق أو حركة رصيد | Leave ledger + allocation + approval/cancellation |
| G02 | P1 — فجوة نطاق | الصرف والترحيل والعكس خارج PayrollRuns؛ SalaryVoucher غير مرتبط بالنسخة المعتمدة | Payroll payment/posting owner مرتبط بالنسخة المحددة |
| G03 | P1 — قرار سياسة | قواعد الدولة والضرائب والتأمينات والجزء النسبي غير مكتملة | سياسة حسب دولة العمل وتاريخ السريان؛ مصر أولًا |
| G04 | P1 — فجوة نطاق مقصودة | Pay Structure/formulas وHRM account links إعدادات دون المستهلك المالي الكامل | وصلها تدريجيًا بعقد حساب ومحاسبة مجمد |
| G05 | P2 — قرار سياسة | أيام الجمعة/السبت مصنفة عطلة بشكل عام | تقويم عمل مؤرخ خاص بالشركة/الفرع/الموظف |
| G06 | P2 — غموض دلالي | StaffRole مستقل، بينما Staff.RoleId يستخدم Administration Role | حسم وظيفة كل تصنيف قبل أي ترحيل IDs |
| F06 | P2 — سلامة إدارية | Holiday وDepartment لا يملكان نفس ضمان uniqueness بين القراءة والكتابة | تحديد مفتاح العمل ثم constraint/preflight؛ لا حذف تلقائي |

## خريطة التغطية الحالية

| المجال والشاشات | المالك/المصدر الحالي | ما يعمل اليوم | ما يحتاج اكتمالًا |
|---|---|---|---|
| Staff، salary revision، bank accounts | StaffService، Staff/SalaryPackage/children | سجل متعدد المجموعات، تحقق مراجع وملكية أبناء، راتب مؤرخ منفصل | عقود وفترات توظيف، دولة العمل، منع تعديل مصادر فترات مغلقة، اختيار وسيلة الصرف |
| Administration: Departments، StaffRoles | DepartmentService، StaffRoleService | صيانة قوائم | وضوح الدور الوظيفي مقابل المسمى والصلاحيات؛ Department uniqueness |
| LeaveOpeningBalance | LeaveOpeningBalanceService | رصيد افتتاحي مستقل لكل بياناته؛ منع حذف الموظف المشار إليه | إدخاله مرة واحدة في ledger وعدم جمع الرصيد مرتين |
| HrmSetting | HrmSettingService | تحقق وقراءة/حفظ إعدادات typed؛ pay structure وformula strings | محرك سياسة/version/evaluator؛ الحقول الجديدة configuration-only |
| HRM AccountLinking | LinkAccountsService، HrmAccountLinkCatalog | mapping مضبوط للمكونات والأدوار وحسابات ترحيل صالحة؛ إنشاء حسابات عبر preview/apply | مالك accrual/payment/reversal يستهلك نفس mapping |
| Attendance، StaffDutySchedule | AttendanceService + StaffService | سجلات يومية وجدول شهر؛ writes للصفوف المعدلة فقط | مصدر موحد، حماية absence، uniqueness، حالات واعتماد وتصحيح |
| Shift | ShiftService | clocks داخل 24 ساعة وبيانات DutyHours/Weekdays | assignment مؤرخ، overnight/breaks، overtime eligibility |
| StaffTimesheet | StaffTimesheetService | سجل يدوي مستقل | تحديد هل هو مستند ساعات مدخل أم نتيجة مشتقة؛ منع ازدواج الحساب |
| Holidays | SettingsHolidayModelService | تواريخ عطلات؛ قراءتها كـ HashSet | calendars متعددة وتواريخ فعالة، uniqueness |
| LeaveType، Leave | LeaveService + LeaveType config | CRUD ومدة تقويمية inclusive؛ counters محفوظة | allocations، accrual، overlaps، half days، approvals، paid/unpaid allocation |
| Overtime، StaffOverTime | StaffOvertimePolicy + خدمتا الكتابة | مبلغ يومي محفوظ حسب rate مؤرخ؛ قيد يومي فريد لـ Overtime؛ CSV جديد فقط | توحيد bounds، calendar/eligibility، approval، corrections بعد إغلاق الفترة |
| Overtime process history | OvertimeProcessRun | summaries ثابتة append-only؛ تكرار تشغيل مقصود | إذا أريد مستند مالي لاحقًا فهو تغيير عقد مستقل |
| Deductions | DeductionService + PayrollRunService reader | schedules وأقساط مستحقة في الحساب | allocations مدفوعة/معكوسة، مصدر PaidInstallments، cap/priority/skip policy |
| PayrollProcess، ProcessedPayrolls | PayrollRunService | calculate/save/revisions/approve/logs؛ نتائج snapshots | proration والسياسات القانونية، payment/posting/reversal/adjustments |
| LeaveSalaryPayrollProcess | نفس payroll aggregate وعقده | حساب ومراجعة سياق leave salary محفوظ | حسم هل المبلغ advance أم encashment ومنع تكرار الاستحقاق |
| FinalSettlementProcess | نفس payroll aggregate وعقد settlement | مدخلات مراجعة ومبالغ محسوبة محفوظة | employment episode، termination/rehire، obligations، payment/accounting |
| PaySlips | saved payroll lines/revisions | عرض النسخة الحالية/السابقة وحالة الاعتماد/الدفع | بيانات policy/statutory breakdown وpayment references عند توفر مصدرها |
| Payroll report | PayrollsReportService | Payroll type/current revision/persisted figures | فصل calculated/approved/posted/paid في الفلاتر والمجاميع إذا تغير العقد |
| DriverTimeSheet report | DriverTimeSheetReportService | تقرير عمليات سائقين وتفاصيل محفوظة | يبقى تقرير تشغيل؛ لا تحويله إلى حضور موظفين بلا Driver→Staff عقد واضح |
| StaffStatement/StaffBalancesSummary | StaffAccountLookup/ledger readers | دفتر حساب موظف حسب Contacts links القديم | reconciliation مع HRM posting الجديد عند إضافته |
| SalaryVoucher | generic CRUD legacy | header رقم/نوع/تاريخ/مبلغ يدوي | ليس إثبات صرف payroll؛ inventoried replacement قبل إيقاف الكتابة |

Loans/LoanEMI/LoanPaymentPlan الحالية تتبع تمويل Bill/vehicle/vendor بحسب [العقد الموجود](<F:/My Work/Sigma/reviews/LOAN_READ_CONTRACT_FREEZE.md>). لا تُربط تلقائيًا برواتب الموظفين. Employee advance/loan يكون obligation مستقلًا أو تطورًا مضبوطًا لـ DeductionType.Loan.

## الأدلة على العيوب المؤكدة

### F01 — تحرير الدوام يلغي غيابًا قائمًا

في [StaffService](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs:1616>) تُضبط `attendance.IsAbsent=false` لكل صف مرسل، سواء كان جديدًا أو موجودًا. [Angular Duty Save](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffDutySchedule/components/list/list.component.ts:196>) يرسل shift/clocks فقط للصفوف المعدلة ولا يرسل قرار إعادة تصنيف الغياب. [Payroll reader](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Payrolls/PayrollRunService.cs:482>) يعتمد على `IsAbsent` ويضيف `absencePolicyRequired` عند وجوده، عند line528.

سيناريو: يوم غياب محفوظ → تعديل Shift لذلك اليوم → Save → علامة الغياب تزول → إعادة حساب الراتب لا ترى هذا الغياب. المشكلة تخص اليوم المعدل؛ حفظ الشهر لا يرسل كل الأيام. السيناريو مثبت من المسارات، ولم يُنفذ على قاعدة بيانات. السلوك موروث، لكنه تعارض حقيقي بين كاتبين يجب إصلاحه ضمن عقد تصحيح الحضور.

### F02 — حقائق متعددة لليوم نفسه

[AttendanceService](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/AttendanceService.cs:117>) يتحقق من التاريخ ثم يفوض الكتابة، و[AttendanceConfig](<F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/AttendanceConfig.cs:3>) لا يملك key فريدًا للموظف/اليوم. [StaffService](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs:1585>) يجمع التكرار ويختار أعلى Id. قد يعرض الدوام صف حضور بينما Payroll يرى صف الغياب الآخر. الاختيار الصامت ليس قاعدة مصالحة.

المفتاح المقترح يكون tenant/staff/service date/calendar حسب السياسة المعتمدة. قبل قيد فريد يلزم تقرير بيانات متعارضة وقرار مصالحة يحفظ أصل كل حقيقة؛ لا تنظيف أو حذف جماعي في هذه المراجعة.

### F03 — حدود مدخل الراتب لا تطابق التخزين

[StaffSalaryRevisionVm](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Staff/StaffSalaryPackageVm.cs:8>) يسمح حتى Decimal.MaxValue ولا يقيد scale. [إنشاء المكونات](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs:338>) يخزن المبالغ الخام ويجمع Gross في line351؛ [EF](<F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/SalaryPackageConfig.cs:8>) يحصر Amount في decimal(18,2). [Payroll](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Payrolls/PayrollRunService.cs:766>) يشترط مساواة Gross للمكونات.

مدخل كبير قد يفشل في الجمع أو التخزين؛ ومدخل بأجزاء أكثر من خانتين يترك تحويل SQL وتقريب المكونات والمجموع دون عقد واحد. نتيجة تقريب SQL الدقيقة لم تُختبر، فلا يُدّعى وقوع `invalidSalary` فعليًا؛ اختلاف الحدود مثبت. التوصية تطبيق سياسة المال المشتركة، والتحقق من السعة والدقة، وحساب Gross من المكونات بعد توحيدها.

### F04/F05/F06 — اتساق الكتابة والزمن والصيانة

- [Staff overtime writer](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs:1925>) يرفض السالب فقط؛ توجد حدود وحماية overflow في [OvertimeService](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/OvertimeService.cs:85>) لا يستهلكها هذا المسار. التحويل المباشر لساعات محفوظة إلى Int32 minutes عند StaffService1796 يحتاج تحققًا مطابقًا. لا يلزم اختراع cap تجاري؛ أول خطوة هي حدود التخزين والتحويل المشتركة.
- [TryParseDutyTime](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs:1684>) يقبل TimeSpan.TryParse غير مقيد، بما فيه يوم إضافي، دون تخزين explicit day offset. لا يجوز رفض Out<In عمومًا لأن الوردية قد تعبر منتصف الليل. يلزم عقد overnight وpair completeness وعدم تداخل الفترات.
- [Holiday configuration](<F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/SettingsHolidayModelConfig.cs:8>) index غير فريد؛ HashSet يمنع مضاعفة مبلغ overtime حاليًا، لذا الأولوية إدارية P2. Department duplicate check بلا ضمان DB/concurrent writer مماثل؛ لا تُذكر مشكلة pagination وهمية: الشاشة تستخدم metadata لعدد الصفحات دون exact count عمدًا.

## فجوات الدورة والسياسات

### الإجازات والرصيد الافتتاحي

[LeaveService](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/LeaveService.cs:55>) يأخذ LeaveType.MaxLeaves ويحسب `(ToDate-FromDate)+1` أيامًا تقويمية. لا يقرأ opening balances أو accrual/rollover/approved debits أو تقويم العمل. RemainingBalance/PreviouslyBooked/PaidDays/HalfPaidDays/UnpaidDays حقول محفوظة وليست ناتج engine في هذا المسار. OpeningDays كسرية بينما بعض counters الحالية integers؛ إضافة نصف يوم تحتاج عقد دقة موحدًا، وليس تحويلًا ضمنيًا.

لا توجد overlap validation أو approve/reject/cancel/rejoin transitions. DTOs الحالية لا تقبل Status؛ لا يمكن استنتاج أن العميل يستطيع اعتماد إجازة بمجرد تغيير payload. الخطر المستقبلي/للبيانات المستوردة: update/delete عام دون state lock على صف Approved. Approvers في LeaveType إعدادات فقط. هذه قيود baseline مصرح بها في العقود السابقة، وليست regressions للصفحة الجديدة.

الهدف المقترح: كل رصيد له credit/debit/reversal مع staff/type/period/effective date/source unique key؛ الرصيد الافتتاحي credit واحد موثق في تاريخ انتقال النظام. Available = posted credits − posted debits − active reservations وفق قرار الحجز. الطلب Draft→Submitted→Approved/Rejected، ثم cancel/rejoin وفق أثر سبق اعتماده. نصف اليوم أو الساعات، العمل مقابل التقويم، عبور السنة، انتهاء الرصيد والترحيل والرصيد السالب والصرف النقدي كلها policy معلنة.

### الحضور والإضافي

الجدول المخطط، البصمة الفعلية، وحالة اليوم حقائق مختلفة. المقترح schedule + punches + reviewed AttendanceDay؛ مشتقات الساعات والإضافي تُحسب في الباك إند ثم تعتمد. تصحيح يوم بعد إغلاق فترة ينشئ adjustment بسبب ومراجعة، ولا يعيد كتابة نسخة payroll مدفوعة.

حاليًا [StaffOvertimePolicy](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffOvertimePolicy.cs:55>) يصنف الجمعة والسبت كعطلة، ويتكرر التصنيف في القراء. هذه قاعدة frozen v1 تحتاج تطورًا للأسواق المطلوبة، لا ادعاء مخالفة قانونية عامة. IsEligibleForOvertime في Shift ليس gate حساب؛ نحتاج قرار hard block أو warning/approval أو معلومة فقط. StaffTimesheet مستقل؛ لا يُجمع مع attendance/daily overtime مرة ثانية دون تحديد المالك.

Overtime اليومي يملك key فريدًا ويستخدم مبلغًا محفوظًا: `round(hours×effective rate,2,AwayFromZero)`. rate من آخر salary package ساري، ثم designation fallback. **Monthly Process ليس approval أو payroll posting**. [عقد Overtime](<F:/My Work/Sigma/reviews/Archive/Completed/2026-10-23/OVERTIME_FRONTEND_CONTRACT_FREEZE.md:37>) يسمح صراحة بتشغيلات متكررة append-only summaries. لا توجد نتيجة مؤكدة لصرف مضاعف بسبب هذه summaries. إذا تغير الهدف إلى input مالي، نحتاج source IDs/version/idempotency/approval/reversal في عقد جديد.

### الموظف والراتب وفترات التوظيف

Staff لا يملك سلسلة employment episodes أو دولة عمل/legal entity في السلسلة المدروسة؛ الجنسية لا تعني الدولة القانونية للعمل. استخدام current IsActive/IsInactive في [Payroll employee selection](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Payrolls/PayrollRunService.cs:447>) يمكن أن يغير قائمة الموظفين عند إعادة حساب شهر قديم؛ saved revisions تبقى snapshots سليمة.

salary revision بنفس التاريخ تستبدل المجموعة القديمة soft-delete حسب العقد الموجود. تغيير الماضي بعد احتساب فترة غير مدفوعة يحتاج recalculate/reapprove صريحًا؛ بعد الصرف يحتاج arrears/adjustment. عودة الموظف بعد إنهاء الخدمة تحتاج episode جديدة أو قاعدة continuity واضحة. JoiningOrRejoiningDate لا يغير normal salary start في v1؛ العقد يخصصه لسياق LeaveSalary، لذلك لا يُسجل ذلك كعيب مؤكد. One final settlement per staff لا يغطي episodes متعددة مستقبلًا دون تغير العقد.

Staff.RoleId يشير إلى Administration Role، بينما HRM StaffRole مستقل بلا FK من Staff. لا تُنقل IDs بينهما تلقائيًا؛ يجب حسم وظيفة التصنيف. Bank accounts الحالية optional children بخمس قيم، وليست تعليمات دفع معتمدة/default account أو تحقق مصرفي لكل دولة. تلك الإضافات ترتبط بالصرف ومراجعة تغيير الحساب، مع إظهار مقنع للحقول الحساسة.

### إعدادات الحساب والمحاسبة

Pay Structure يحفظ rows/formula strings ويتحقق من العضوية/duplicates/الطول، لكنه لا ينفذ expressions. الحقول الجديدة للـ divisor/gratuity/leave items/attendance هي configuration-only بعقد [HRM Settings](<F:/My Work/Sigma/reviews/Archive/Completed/2026-10-23/HRM_SETTINGS_SCREEN_CONTRACT_FREEZE.md>). Payroll يستهلك previous-month overtime، ويمنع flags sales commission/business-unit التي لم تُنفذ. لا يجب تفعيل الحقول على المال بصمت.

أي formula evaluator لاحق يحتاج grammar محدودًا ومكونات مسماة وdependency validation ومنع cycles وversion/date وpreview trace. لا تستخدم arbitrary code execution. gross/allowances/OT/deductions لها mapping دلالي؛ لا يعتمد الربط بين SalaryPackage وHrmSalaryItemType على مساواة أرقام enums.

HRM links ضمن LinkAccountsType.Hrm مستقلة عن Contacts links التي يستخدمها StaffAccountLookup حاليًا. [LinkAccountsService](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/AccountServices/LinkAccountsService.cs:932>) يتحقق من live active leaf posting accounts؛ هذا جيد ويُحافظ عليه. لا يوجد مستهلك payroll posting في السلسلة المدروسة، وبالتالي حفظ mapping لا ينشئ قيدًا محاسبيًا.

التوصية accrual واضح: expense/payable/statutory liabilities/employee obligations، ثم payment يسدد payable مقابل bank/cash. employer contributions تكلفة شركة مستقلة عن خصم الموظف. provision ليس دفعًا، ولا تسجل expense/provision ثم expense مرة أخرى عند التسوية بلا release rule. مكان وتوقيت posting، currencies/cost centers، وفترة reversal قرارات محاسبية قبل التنفيذ.

### الرواتب والخصومات والصرف والتسوية

الموجود الجدير بالحفاظ: backend calculations، saved source snapshots/version hashes، revalidation داخل serializable write boundary، current-revision approval، repeated exact approval no-op، revision جديدة للتغيير غير المدفوع مع إلغاء اعتماد النسخة الحالية فقط وحفظ تاريخ السابق، paid mutation lock. PaySlips تعتمد على هذه النتائج المحفوظة.

mid-month join/salary change وabsence توقف الحساب بـ prorationRequired/absencePolicyRequired بدل اختراع قيمة. هذا قرار حماية جيد؛ إكماله يحتاج قواعد divisor وpayroll cutoff وتوزيع paid/unpaid leave وتأخير وretroactive adjustment. لا نستبدل هذه blockers بثلاثين يومًا افتراضيًا لكل دولة.

[PayrollRunsController](<F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Controller/PayrollRunsController.cs:16>) وinterface يقدمان calculate/save/read/approve/logs، دون Pay/Void/Reversal. IsPaid/PaidAt مخصصان لمالك صرف لاحق. الاعتماد لا يعني الصرف. [SalaryVoucher](<F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/SalaryVoucher.cs:3>) header يدوي بلا staff/run/revision/journal reference، فلا يصح استعماله وحده لإكمال هذه الحلقة. لا يوجد دليل من هذا المسار أنه ينشئ قيودًا خاطئة.

الخصومات المجدولة تدخل الحساب، وآخر قسط يحتفظ بالباقي؛ Save/Approve لا يقدمان PaidInstallments وهذا deliberate separation. لكن PaidInstallments/PassOver ما زالا client inputs في CRUD. الهدف schedule + posted allocations، وskip مرتبط بفترة محددة لا boolean دائم غير مؤرخ. يحدد المالك هل تخصيص القسط يحدث عند posting أو payment وكيف يتعامل مع partial payment والقيود القانونية والرصيد السالب. لا خصم نفس obligation مرتين في normal payroll وfinal settlement.

FinalSettlement v1 يحفظ مدخلات مراجعة leave salary/gratuity/tickets بدل statutory automation؛ لا ينهي Staff أو يدفعه تلقائيًا. الهدف episode/last work day/exit reason/leave balance snapshot/obligations/statutory adjustments ثم payment/reversal. اختلاف gratuity بين الدول أو بين eligibility وأنواع العقود يمنع صيغة عالمية. يجب تفسير LeaveSalary: salary advance خلال إجازة، أم encashment عن رصيد، أم salary replacement؛ تعريفه يحدد منع double payment والحركات على ledger.

### التقارير والمفاهيم

[PayrollsReportService](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/PayrollsReportService.cs:95>) يعرض current Payroll revisions، بما فيها غير المعتمدة حسب العقد. EarningsSubtotal=Gross+Additional والإضافي منفصل؛ ليس Net ولا مبلغًا مدفوعًا. لا يُغير الجمع دون تعديل producer/columns/print/export معًا. Driver report RecordedDays عدد rows، وليس unique attendance days؛ drivers موزعون بحسب ارتباط تشغيلي وليس عقد موظف. يُحافظ على complete-source print/export للفلاتر المطبقة.

| المصطلح | المعنى الذي يجب تثبيته قبل التوسع |
|---|---|
| Basic | عنصر أجر محدد؛ ليس افتراضيًا كل الوعاء الضريبي/التأميني |
| Gross | subtotal واضح للمكونات الداخلة؛ توثيق مكان OT/Additional |
| Net | المستحق للموظف بعد employee deductions/taxes؛ غير تكلفة الشركة |
| Approved | النسخة أجازها صاحب سلطة؛ لا تثبت bank transfer |
| Posted | الأثر المحاسبي مسجل وله مرجع؛ لا يثبت الصرف |
| Paid | تخصيصات دفع مؤكدة تغطي المستحق؛ PartialPaid منفصلة إن دعمت |
| LeaveSalary | تعريف workflow محدد قبل الأثر على راتب الشهر ورصيد الإجازة |
| Gratuity | استحقاق حسب jurisdiction/contract؛ لا كلمة عامة تعني صيغة موحدة |
| StaffRole/Designation/Role | وظيفة عمل ومسمى وصلاحية نظام مفاهيم تُربط صراحة |

## مقارنة بالممارسات الموثقة وتوطين مصر والدول العربية

Frappe HR يستخدم LeaveLedger يجمع allocations/applications/encashments؛ يدعم الاستنتاج بأن ledger واحد مناسب لربط الصفحة الافتتاحية بباقي الدورة. التفاصيل المقترحة أعلاه توصية خاصة بـ Sigma وليست نسخًا لعقد المنتج. [Frappe Leave Ledger](https://docs.frappe.io/hr/leave-ledger-entry).

تعيينات salary structure في Frappe مؤرخة ويمكن أن تتعدد للموظف لفترات مختلفة؛ هذا يدعم بقاء الرواتب مؤرخة وربط السياسة السارية بالنسخة المحسوبة. [Salary Structure Assignment](https://docs.frappe.io/hr/salary-structure-assignment). كذلك يفرق بين salary accrual وsalary payment، ما يدعم إضافة مالك صرف ومحاسبة بعد الحساب. [Payroll Entry](https://docs.frappe.io/hr/payroll-entry).

لمصر: المرجع القانوني الأساسي المتحقق منه هو [قانون العمل رقم 14 لسنة 2025 — المصدر الرسمي](https://portal.eta.gov.eg/sites/default/files/2026-03/law.no_.14.of_.2025.pdf)، مع حسم نطاق تطبيقه واللوائح والسياسة لكل منشأة؛ لم يُجرَ استخراج شامل لكل قواعد الإجازة والإضافي من القانون في هذه المراجعة. ضريبة المرتبات تحتاج integration/reporting policy مستقلًا؛ [أدلة مصلحة الضرائب للمرتبات](https://www.eta.gov.eg/ar/content/payroll-services) هي مصدر المتطلبات قبل تجميد كل صيغة وتصدير، وليست VAT policy الموجودة في معاملات المبيعات.

حدود أجر الاشتراك التأميني تغيرت اعتبارًا من يناير2026 بحسب [الهيئة القومية للتأمين الاجتماعي](https://www.nosi.gov.eg/ar/News/Pages/2025-11-30.aspx). هذا دليل مباشر على ضرورة effective-dated ceilings وقواعد worker categories، ولا يكفي حفظ نسبة واحدة دائمة. لا تُنسخ حدود العام الحالي إلى payroll تاريخي.

السعودية أيضًا لها تعديلات قانون عمل منشورة في [المصدر الرسمي](https://www.hrsd.gov.sa/sites/default/files/2025-03/Amendments%20to%20Labor%20Law%20Articles_0.pdf)، بما فيها قواعد إضافي وإجازات تخص هذا الاختصاص. هذا يثبت اختلاف ملف السياسة والحاجة لتواريخ السريان؛ لا يقرر تطبيق قواعد السعودية على مصر أو باقي الدول. لم تُراجع جميع قوانين الدول العربية. كل دولة جديدة تحتاج packet قانوني ومحاسبي معتمَد قبل تسويق الامتثال لها.

## التصميم المستهدف المقترح — Draft

### ثلاث طبقات سياسة

1. **Core مشترك:** employees/contracts/episodes، calendars، attendance facts، leave ledger/workflow، earnings/obligations، payroll revisions، payment allocations، audit.
2. **Country profile مؤرخ:** دولة العمل/legal entity، نوع العامل والعقد، tax/insurance/leave/OT/end of service/reporting rules، مرجع القاعدة وإصدارها وتاريخها. يمكن بدء مصر ثم إضافة الدول المطلوبة تباعًا.
3. **Company policy مؤرخة:** المزايا والحدود والاعتمادات والتقويم والـ cutoff وrounding، ضمن الحدود القانونية التي يعتمدها المالك. employee exceptions تحتاج سببًا واعتمادًا، لا تكسر حدًا قانونيًا تلقائيًا.

كل payroll revision تحفظ policy version + salary/calendar/leave/attendance/obligation versions + amounts + rounding trace. أي إعادة حساب نتيجة تغيير المصادر تظهر diff واضحًا وتحتاج اعتماد النسخة الجديدة. راتب الموظف لا يغير تاريخًا مدفوعًا. common currency policy تحدد precision، ولا تفرض خانتين على كل العملات الجديدة بصمت.

### الدورة المقترحة

`Employment episode + effective salary/policy → Schedule/Punches/Leave requests → Reviewed attendance + Approved overtime/leave → Payroll preview with issues and trace → Saved revision → Approved revision → Accrual posting → Payment allocations → Paid/PartiallyPaid → Reconciliation`

مسار التصحيح: unpaid revision يعاد حسابه ويعتمد؛ posted/paid history ينتج linked adjustment/reversal. تبقى version keys وtenant scope والـ guard والتحقق من المراجع في كل writer. فصل maker/reviewer/payment authority قرار مطلوب من الباك إند؛ AuthGuard أو إخفاء زر لا يمنح authorization. نقص منظومة الصلاحيات مسجل في backlog المشروع، لا يُحل بـ API مخترع داخل HRM.

معادلة Net المقترحة على المستوى المفاهيمي: authoritative earnings (مع OT/Additional وفق تعريف Gross) − employee tax − employee insurance − approved deductions/advances. تكلفة الشركة = earnings + employer contributions + benefits/provisions وفق السياسة. قواعد YTD/retroactivity وحساب الوعاء والشرائح مستقلة، ولا تنفذ من صيغة نصية غير مقيدة.

## Impact Map وتصنيف التطوير

| التصنيف | العنصر | أثر المنتج والمستهلك والبيانات |
|---|---|---|
| Keep | payroll aggregate/revisions/snapshots/approval/logs؛ daily OT saved rates؛ shared UI/report owners | تمديد نفس producer/consumer؛ عدم rewrite مالي تاريخي |
| Extend | Staff + salary policy/episodes؛ HrmSetting؛ AccountLinking؛ payroll calculation/report/payslip | schema/DTO/API/Angular/exports تتغير معًا بعقد معتمد؛ لا enum renumbering |
| Refactor | Attendance writers، money/bounds، work calendar resolution، salary item mapping | مالك واحد لكل invariant؛ تصحيح cross-writer conflicts؛ concurrency لجميع writers |
| Create | leave ledger/transitions؛ policy versions؛ statutory adapters؛ payment/posting/allocations | artifacts وschema جديدة بعد discovery/freeze؛ linkage واضح إلى المصدر |
| Replace | SalaryVoucher mutations كمصدر راتب/صرف؛ timesheet writer إذا تقرر أنه مشتق | inventory خارجي وخطة compatibility؛ historical rows retained |
| Remove | duplicate calculation paths/unused forms فقط بعد إثبات عدم وجود مستهلك | لا حذف business data ولا إزالة endpoint بمجرد عدم ظهوره بالواجهة |

| البديل | التقييم |
|---|---|
| إضافة حقول وصيغ مباشرة لكل شاشة | سريع ظاهريًا؛ يزيد تعدد مصادر الرصيد والساعات والمبالغ، غير موصى به |
| استبدال HRM بالكامل | تكلفة ومخاطر تاريخ وmapping عالية دون مبرر؛ غير موصى به الآن |
| تطوير current owners مع policy/ledger/payment contracts | **الموصى به**؛ يحافظ على نقاط القوة ويغلق الدورة تدريجيًا |
| الاعتماد على payroll خارجي مع import immutable results | بديل مشروع إذا كانت أولوية الامتثال والتشغيل أسرع؛ يحتاج مصدرًا واتفاق reconciliation ولم يُختَر |

## القرارات المفتوحة قبل التنفيذ

| ID | Status | القرار الدقيق والمالك |
|---|---|---|
| D01 | Uncertain | الدول الأولى بعد مصر، legal entities وأنواع العقود/العاملين؛ HR/legal owner |
| D02 | Missing | official country policy/effective dates/tax/insurance applicability ومخرجات الجهات؛ HR/legal/finance |
| D03 | Missing | payroll frequency/cutoff/divisor، proration salary changes/unpaid leave، high-precision rounding؛ payroll owner |
| D04 | Missing | calendars/weekly rest/overnight attribution/breaks/lateness/attendance correction authority؛ operations+HR |
| D05 | Missing | leave allocation/accrual/period/carry/expiry/reservation/negative balance/half-day/encashment؛ HR |
| D06 | Missing | leave submission/approval/cancel/rejoin states، delegation وlocking؛ HR/security |
| D07 | Uncertain | StaffTimesheet derived أم manual approved input؛ Overtime eligibility وأساس rate/approval/caps؛ operations |
| D08 | Uncertain | تعريف LeaveSalary وأثره على monthly salary/ledger؛ معنى joining/rejoining وservice continuity؛ HR/payroll |
| D09 | Missing | termination/settlement episodes/eligibility/bases/manual-review authority؛ HR/legal |
| D10 | Missing | moment of posting/payment، accounts/cost centers/currencies/partial payment/void/reversal period؛ finance |
| D11 | Missing | employee advance obligations وقواعد تخصيص الأقساط وحدود deduction priorities/skip/settlement؛ finance/legal |
| D12 | Uncertain | Role/StaffRole/Designation mapping، حماية الرواتب وصلاحيات makers/reviewers؛ HR/security |
| D13 | Missing | سياسة مصالحة duplicate Attendance/Holidays، وبداية leave ledger وتاريخ الرصيد الافتتاحي؛ data owner |

تحديد «مصر والدول العربية» يحسم اتجاه التصميم، لكنه لا يحسم كل صف أعلاه. هذه قائمة قرارات عملية وليست طلب موافقة على تنفيذ سياسة قانونية مفترضة. لا يوجد handoff جديد Frozen ولا API مقترح يُعامل كحقيقة موجودة.

## خطة التنفيذ الموصى بها وترتيبها

| المرحلة | نطاق ملموس | شرط القبول |
|---|---|---|
| 1 — سلامة الحقائق | F01 preservation/explicit reclassification، F03 money boundary، F04 bounds؛ preflight Attendance duplicates ثم key | تعديلات shift لا تمحو absence؛ مدخلات invalid تعود business errors؛ writers متفقة |
| 2 — أساس مصر | effective employment/salary/policy/calendar، وتوثيق D01–D04/D12 | كل تاريخ يرجع قاعدة محددة ومراجعة؛ نقل/rehire لا يغير payroll history |
| 3 — إجازات وحضور | ledger يستهلك opening مرة واحدة، workflow/overlap/half days/cancel، overnight ومصدر hours واحد | balance يمكن إعادة بنائه؛ reversal يعيد الرصيد؛ لا ازدواج أيام أو ساعات |
| 4 — payroll المصري | proration/paid-unpaid leave/OT/employee tax+insurance/YTD/statutory exports حسب contract؛ formula grammar إن لزم | trace ورقم policy، حالات boundaries، مقارنة مع payroll samples معتمدة |
| 5 — إغلاق الدورة | accounting mappings consumer، posting/payment/partial/reversal/obligation allocations؛ settlement episodes | كل مبلغ approved→posted→paid قابل للتتبع والمصالحة ومنع replay |
| 6 — الدول والتقارير | country packs تباعًا + reports/reconciliation/guide | country acceptance مستقل؛ labels لا تساوي approved مع paid |

لا تجمع كل ذلك في commit واحد. تجمد domain/API/action-state لكل شريحة قبل التنفيذ. migration مستقبلية يقترحها implementer بحسب schema النهائي، وينفذها المالك وفق حدود المشروع؛ لا migration مطلوبة بسبب ملفات هذه المراجعة وحدها.

## سيناريوهات تحقق المالك

1. سجل absence ثم عدل shift فقط في DutySchedule؛ أثبت العيب الحالي، وبعد إصلاحه يجب بقاء الغياب حتى correction صريح.
2. يومان live Attendance لنفس الموظف/اليوم مع حالات مختلفة؛ شاشات الدوام والرواتب يجب أن تعرض conflict بدل اختيار صامت؛ لا تنظف البيانات تلقائيًا.
3. salary magnitude خارج decimal(18,2)، precision أكثر من خانتين، ومكونات عند rounding boundary؛ controlled rejection/consistent Gross. جرب مساري OT بقيم التخزين والتحويل الحدية.
4. overnight22:00→06:00، pair ناقص، فترة ثانية متداخلة، يوم timezone/cutoff؛ قارن schedule مع actual دون تفسير clocks كأيام إضافية.
5. opening10.5 + allocation + half-day + approved overlap + year-crossing + cancellation + expiry؛ كل رصيد يعاد بناؤه من ledger ولا يتكرر opening عند replay.
6. join وسط الشهر، salary revision وسط الشهر، inactive/rehire بعد انتهاء فترة؛ الحالية blocks عند غياب policy. الهدف ينتج proration trace ويحتفظ بالنسخة المدفوعة.
7. Save/replay/change/reapprove/stale version؛ approval مرتبط بالcurrent revision؛ التاريخ محفوظ. repeated monthly OT summaries لا تُضاف مرة أخرى كمال payroll.
8. deduction قسط أخير مع remainder، skip لفترة محددة، partial payment، reversal؛ لا advance count عند calculation ولا double consumption بين payroll/settlement.
9. حساب payroll قبل/بعد تغيير إعدادات configuration-only؛ المتوقع الحالي لا أثر مالي جديد. بعد وصل السياسة يجب ظهور policy version وexplicit changed result.
10. approved→posted→paid ثم reversal في فترة تالية؛ قيود موزونة ومراجع immutable ومصالحة employee payable/bank/tax/insurance؛ هذا مسار جديد غير متاح حاليًا.
11. final settlement ثم rehire ثم settlement جديد؛ لا double leave encashment ولا obligations ضائعة؛ مراجعة accrual release عند payout.
12. report/current/superseded/approved/unapproved/paid، complete print/export والعربية؛ Driver RecordedDays لا يتحول إلى attendance days.
13. الأذونات وخصوصية salary/bank وmaker/reviewer separation عبر API مباشرة؛ authentication وحده لا يفي بهذا الشرط.

## المصالحة النهائية وحدود التسليم

| البند | النتيجة |
|---|---|
| Source evidence | reviewed current scoped producers/consumers and frozen contracts؛ claims أعلاه لها أدلة قابلة للوصول |
| Frontend/backend contract | لا mismatch مؤكد في payslips/report/settings/opening DTOs؛ النزاع الأهم بين Attendance وDuty business writers |
| Grid/ListVM | قوائم/report حالية محفوظة؛ Payroll report columns وGross+Additional/OT separate متوافقة مع frozen contract؛ لا column/ListVM تغيير في هذه المراجعة |
| Routes/wiring | HRM administration، attendance/leaves/OT/deductions، payroll process/history/leave salary/settlement/payslips، reports وStaff direct routes موجودة؛ alias StaffTimesheets محفوظ |
| Screenshot | صورة Opening Balance: title وLeave Type selector أدلة مباشرة؛ الموظفون/التاريخ/الرصيد/workflow في تنفيذ سابق استنتاجات موثقة؛ ليست دليلًا على statutory engine |
| Phases | PLAN00 + phases00–06 review للمجالات المناسبة؛ phases التنفيذ skipped لأن الطلب review؛ new freeze skipped للقرارات المادية المفتوحة |
| Source changes | **None in this audit**: لا تعديل frontend/backend/configuration/AutoMapper/domain calculations/instructions |
| Artifacts changed | هذا التقرير + HRM_AUDIT_LEAVE_ATTENDANCE_NOTES.md + HRM_AUDIT_PAYROLL_NOTES.md فقط |
| Repositories/diff | repo roots تحققت منفصلًا؛ current prior/user diffs فُحصت بالمقارنة مع المصدر والعقود، ولا app diff ولده هذا audit. لا ادعاء certify كامل refactor UI سابق أو كل uncommitted hunk |
| Recipe maintenance | all eight packets current في initial وfinal checks؛ canonical books/templates لم تتغير في المهمة؛ لا regenerated packet |
| Guide | existing HRM_GUIDE في /UserGuide/hrm يصف configuration-only/الحالات الحالية؛ source-read-only لا يسمح تحديثه لوعود التصميم المقترح. تحديثه جزء إلزامي من كل شريحة تنفيذ لاحقة |
| Migration/commits | لا Add-Migration بسبب هذا audit؛ suggested commits N/A لأن التطبيق لم يتغير؛ لا migration/snapshot edit |
| Verification pending | compilation/runtime/database precision/schema state/concurrency/UI RTL/theme/print/payment/legal-policy acceptance جميعها pending |
| Prohibited commands | لا builds/tests/lint/database/migrations/browser/commits/push/deploy/SigmaMCP/Graphify |

Delegation: two bounded `sol_worker` agents using gpt-5.6-sol examined leave/attendance and payroll in parallel under canonical AGENTS authorization؛ review artifact ownership منفصل، لا app ownership/edit. root reconciled cross-writer absence loss، repeated OT snapshots، joining/rejoining semantics، vehicle loans boundary، country references والتوصيات. هذا قلل زمن تتبع المسارات المستقلة ولم يفوض قرارات السياسة للعمال.

Supporting source notes: [Leave/Attendance audit](<F:/My Work/Sigma/reviews/HRM_AUDIT_LEAVE_ATTENDANCE_NOTES.md>)، [Payroll audit](<F:/My Work/Sigma/reviews/HRM_AUDIT_PAYROLL_NOTES.md>). هذا الملف هو نتيجة المراجعة الموحدة؛ ملاحظات العمال أدلة مساندة ولا تتجاوز المصالحة هنا.
