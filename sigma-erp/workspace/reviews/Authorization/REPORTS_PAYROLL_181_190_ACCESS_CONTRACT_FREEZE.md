# عقد تبني الصلاحيات — البنود 181–190

| البند | القيمة |
|---|---|
| Status | Frozen for HTTP grants and read/write operation classification; branch-history decisions pending |
| Owner verification pending | yes |
| التاريخ | 2026-11-14 |
| النطاق | تقارير العملاء 181–184 ومسارات الرواتب والتقارير 185–190 |

## الأدلة وصلاحيات المسارات

تعتمد هذه الدفعة على `AGENTS.md` والرفيق الحي ومهارة `sigma-screen-refactor` وشكل التقرير UI07 والعقود المالية الخاصة بالرواتب. فُحصت وصفات البناء المرجعي بنجاح. مرجع Speed بتاريخ 2026-10-28 يثبت واجهات متابعة العملاء وقائمة Payrolls وPay Slips والتقارير، وتثبت ملفات كوده المرتبطة المرشحات وإجراءات الواجهة فقط. أحكام منح Sigma وفروعها مأخوذة من التنفيذ المحلي والعقود المجمدة؛ لا يحدد Speed صلاحيات HTTP أو مالك الفرع التاريخي. لا حاجة إلى استخلاص قاعدة مالية بديلة من Odoo.

| رقم | المسار | منحة فتح البيانات | الأعمال المنفصلة وHTTP |
|---|---|---|---|
| 181 | `/followUpReport` | `Customer.GetFollowUpReport` | `GET Customer/FollowUpReport`، والاختيار `User/GetSelect` الحالي خاص بمدير الاشتراك |
| 182 | `/BalancesSummary` | `Customer.GetCustomerBalancesSummary` | `GET Customer/BalancesSummary`؛ اختيار الشريك/الفرع/المندوب حسب المنح؛ كشف الصف `Customer.GetCustomerStatement` |
| 183 | `/ReceivableAgeAnalysis` | `Customer.GetReceivableAgeAnalysis` | `GET Customer/ReceivableAgeAnalysis`، ومرشحات المراجع بمنحها المستقلة |
| 184 | `/StatementOfAccount` | `Customer.GetCustomerStatement` + `Customer.Lookup` | `GET Customer/Statement` وخيارات العميل |
| 185 | `/ProcessPayroll` | `PayrollRuns.Calculate` | `POST PayrollRuns/calculate` معاينة؛ `PayrollRuns.Save` للحفظ؛ `PayrollRuns.Get` و`Revision/Revisions/Logs` للقراءات المحفوظة |
| 186 | `/HRM/Reports` | `PayrollsReport.Get` | `GET PayrollsReport`؛ مرشح الموظف يحتاج `Staff.Lookup`، والمسمى الوظيفي `StaffDesignation.Lookup` عند استخدامه |
| 186a | `/HRM/Reports/DriverTimeSheet` | `DriverTimeSheetReport.Get` + `DriverTimeSheetReport.GetOptions` | تقرير ومصادر الخيارات عبر GET منفصلين |
| 187 | `/ProcessedPayrolls` | `PayrollRuns.List` | `PayrollRuns.Get` للصف و`PayrollRuns.Logs` للسجل، و`PayrollRuns.ManageApproval` + `PayrollRuns.Get` للاعتماد؛ `PayrollDisbursement.Get/Pay/Void` لقراءة الدفعات وإنشائها وإبطالها، كل منحته مستقلة |
| 188 | `/ProcessLeaveSalary` | `PayrollRuns.Calculate` + `PayrollRuns.LeaveSalaryStaff` | نوع LeaveSalary لنفس المعاينة والحفظ والقراءات المحفوظة |
| 189 | `/FinalSettlementProcess` | `PayrollRuns.Calculate` + `PayrollRuns.SettlementStaff` | التسوية النهائية لنفس المعاينة والحفظ والقراءات المحفوظة |
| 190 | `/PaySlips` | `PaySlips.List` | `GET PaySlips`؛ `PaySlips.Get` للتفاصيل والطباعة، و`PaySlips.Staff` لاختيار الموظف حين يستخدم المرشح |

لا يُدخل `PayrollRuns.Approve` بوصفه مفتاح منحة إضافيًا: يتطابق `POST PayrollRuns/{id}/approve` مع `PayrollRuns.ManageApproval` الموجود مسبقًا في كتالوج الموافقات، ويحتاج `PayrollRuns.Get` وفق اعتماد HTTP المعلن. تبقى `PayrollRuns.SubmitApproval` لمنطق تقديم الموافقة المستقل ولا تمنح تنفيذ الاعتماد مباشرة.

**الاعتماديات الشرطية للطلبات المباشرة:** `POST PayrollRuns/calculate` و`POST PayrollRuns` يفحصان قيمة `Type` نفسها في `PermissionPrerequisites.Payroll.cs`؛ يتطلب `LeaveSalary` منحة `PayrollRuns.LeaveSalaryStaff` و`FinalSettlement` منحة `PayrollRuns.SettlementStaff` إلى جانب منحة الإجراء المطلوبة. `GET PayrollsReport` يتطلب `Staff.Lookup` عند استخدام `staffId`، و`StaffDesignation.Lookup` عند استخدام `designationId`، ولا يفرض الاعتماديتين على التقرير غير المرشح. `GET PaySlips` يتطلب `PaySlips.Staff` فقط عند وجود مرشح `staffId`؛ القراءة غير المرشحة مستقلة. تُنشر هذه الاعتماديات الشرطية في كتالوج المنح وترجمات الإدارة، وتُختبر عند مرشح HTTP نفسه.

**توضيح تطبيقي بتاريخ 2026-11-14 دون تغيير المنح المجمدة:** يشمل مرشح `staffId` لقسائم الرواتب كلًا من `Filters[staffId]` و`grid.columns[].field=StaffId`. يفرض مرشح HTTP منحة `PaySlips.Staff` على الحالتين، ولا يحتاج البحث العادي بالاسم إلى هذه المنحة. يطابق هذا التوضيح اختبار تجاوز `grid.StaffId` الموثق في تقرير المعالجة.

**توضيح مستهلك شاشة إجازة الراتب:** المسار `/ProcessLeaveSalary` يعيد استعمال `PayrollProcessComponent` بكامل أحداثه، ومنها نافذة `PayrollDisbursement.Get` وإجراءات `PayrollDisbursement.Pay/Void` المستقلة حين تصبح النسخة قابلة للصرف. سجل جرد 188 هذه الأحداث بعد مطابقة مصدر القالب؛ لا يضيف ذلك شرطًا إلى مجرد فتح المسار أو منحتي الحساب واختيار الموظف.

## حماية البيانات ومسار القراءة

تقارير أرصدة العملاء وكشوف الحساب وأعمار الذمم مطبقة سابقًا بعقود `PARTNER_BALANCES_ACCESS_ADOPTION_CONTRACT_FREEZE.md` و`PARTNER_STATEMENTS_ACCESS_ADOPTION_CONTRACT_FREEZE.md` و`AGE_ANALYSIS_ACCESS_ADOPTION_CONTRACT_FREEZE.md`. يستخدم `CustomerService.VisibleCustomers` جذر Partner في مساري كشف الحساب وملخص الأرصدة الحاليين، وتستخدم قراءات القيود `QueryReport` أو أثر الفروع. لا يعاد فتح قرارات تلك العقود ضمن هذه الدفعة دون ثبوت تجاوز جديد.

قراءات `PayrollRuns.List/Get/Revisions/Revision/Logs/LeaveSalaryStaff/SettlementStaff` و`PayrollDisbursement.Get` و`PaySlips.List/Get/Staff` و`PayrollsReport.Get` و`DriverTimeSheetReport.Get/GetOptions` مصنفة عمليات عرض لتمكين فروع القراءة فقط. أما `PayrollRuns.Save/ManageApproval` و`PayrollDisbursement.Pay/Void` فتبقى عمليات كتابة. لا تصنف المبالغ المحفوظة أثر قيود (ReportEffects) من دون صاحب تقرير محاسبي صريح.

يوجد نقص قرار أعمال محدد في هذه الدفعة: `PayrollRun` و`PayrollLine` يختزنان الاشتراك والموظف والنسخة بلا `BranchId` تاريخي، و`Staff` مرجع مشترك، بينما حفظ الراتب قد يجمع آثارًا من أكثر من فرع. لا يُفترض أن فرع الموظف الحالي هو مالك نسخة الرواتب أو قيدها المحاسبي. **الحماية المؤقتة المطبقة:** `PermissionAuthorizationFilter` يفرض على المستخدم غير المدير امتلاك صلاحية جميع فروع الاشتراك غير المحذوفة، قراءة لكل عمليات العرض وحركة لكل عمليات الكتابة؛ وإلا يعيد `403 AuthorizationPayrollCompleteBranchAccessRequired` قبل الخدمة. تعتمد هذه القاعدة الحجب الكامل للمسير عند نقص فرع ولا تصنع رواتب جزئية. تبقى **ملكية القيد المالي والفرع التاريخي للسطر** وقرار إتاحة رواتب جزئية ضمن **Pending owner permission/branch decision**؛ لا تنفذ هجرة أو توزيع حسابي قبل حسمه.

وبالمثل، `FollowUp` لا يختزن فرع إنشاء ثابتًا، وتربطه `BranchScopeRegistry` بفرع `Customer` الحالي. يُحافظ على سلوك المصدر الحالي فقط، وتحتاج ملكية المتابعة التاريخية بعد نقل العميل إلى قرار مستقل قبل اعتماد سياسة فرع جديد أو هجرة.

## دورة الواجهة والتحقق

تنفصل منحة التقرير عن منح خيارات المرشحات، ومنحة رؤية السجل عن الموافقة والصرف. تُبطل الصفوف ونسخ الطباعة والقراءات المعلقة عند سحب العرض أو تغيير هوية الجلسة، وتفصل الكتابة المرسلة عن عمر النافذة، مع مسار محلي لتجاهل المسودة. كل رفض يُختبر في طبقة مرشح HTTP أو خدمة المجال أو حارس Angular الخاصة به. بناء المصدر والمواصفات المحددة لا يعوضان قبول المستخدم التشغيلي أو اختبارات قاعدة البيانات، ولا يُنشأ مخطط أو هجرة من هذه الدفعة.

في `ProcessedPayrolls` يظل مكون نافذة صرف الرواتب مركبًا بعد سحب `PayrollDisbursement.Get` وتختفي بياناته تلقائيًا؛ يظهر زر إغلاق مستقل يطلب تأكيدًا محليًا عند وجود مسودة قبل التخلص منها. ويبقى الزر معطلًا خلال كتابة Pay/Void مرسلة إلى أن تنتهي تسويتها. بذلك لا يُفقد سياق المسودة بسبب إزالة المكون تلقائيًا عند سحب المنحة، ولا يعلق إغلاق صفحة القائمة على طلب غير محسوم دون مسار مراجعة.

## توضيح بعد إعادة المراجعة — 2026-11-14

- مرشح حالة الاتفاقية المحددة في أعمار الذمم يتطلب منحتي عرض عقود الإيجار والتأجير؛ النتيجة تتحقق من نطاق عرض المستند. اختيار «الكل» لا يطلب المنحتين.
- تُعاد قاعدة اكتمال فروع الشركة داخل معاملات الحفظ والاعتماد والصرف والإلغاء. تتطلب عمليتا الصرف والإلغاء أيضًا `PayrollDisbursement.Get` لأن نتيجتهما تحمل تفاصيل الصرف.
- نتائج القراءة والطباعة تُربط بجلسة ومراجعة منح المنتج. نتيجة أي كتابة أُرسلت تُسوّى مستقلًا، وتعرضها الواجهة فقط للجلسة الأصلية المخولة. [أدلة التنفيذ والقبول](AUTHORIZATION_181_190_REREVIEW_REMEDIATION_20261114.md).
