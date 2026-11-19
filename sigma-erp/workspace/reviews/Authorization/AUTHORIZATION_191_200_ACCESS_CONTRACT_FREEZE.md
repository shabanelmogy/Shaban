# Authorization 191–200 — consumed operation contract (2026-11-14)

Status: frozen for the confirmed routes below; explicitly blocked where the owner has not decided the data scope. This is an authorization delta over the existing feature contracts, not a new financial or workflow contract.

Authority: `AGENTS.md`, `.agents/SIGMA_WORKFLOW_RULES.md`, UI26/UI28 and BE8/BE9; `STAFF_TIMESHEET_ACCESS_CONTRACT_FREEZE.md`, `STAFF_DEFINITIONS_CUSTOMER_REQUESTS_ACCESS_CONTRACT_FREEZE.md`, `FLEET_WORKSHOP_HRM_DEFINITIONS_ACCESS_CONTRACT_FREEZE.md`, `reviews/LOAN_READ_CONTRACT_FREEZE.md`, and the Speed HRM/Loan dated sidebar references. No new database schema, payments, migration, or retrospective workflow is authorized here.

| Item / route | Confirmed HTTP/resource | Adopted route read | Local operation requirements and boundary |
|---|---|---|---|
| 191 `/Attendance` | inherited `Attendance` list/detail/add/update/remove, `Staff`/`Shift` selects | `Attendance.View` | Create requires `Attendance.View`, `Attendance.Create`, `Staff.Lookup`, `Shift.Lookup`; edit requires `Attendance.View`, `Attendance.Update`, and those selects; delete requires View+Delete. Stored `BranchId` is a transaction branch. |
| 192 `/Deduction` | `Deduction` CRUD/import | **Blocked** | Actual entity has no branch owner. Do not make tenant-wide rows accessible to ordinary users by routing grants until the owner freezes staff/branch/tenant data scope and imports. |
| 193 `/Holiday` | `SettingsHolidayModel` CRUD | `SettingsHolidayModel.View` | Preserve previously frozen definition actions/Excel and shared `/Settings` exception. |
| 194 `/Leave` | `Leave` CRUD/dashboard/approval | **Blocked** | Actual entity has no branch owner. `Leave.Approve` and `Leave.Reject` both map to `Leave.ManageApproval` through the approval resolver; approver/branch authority and View dependency require a separate owner decision before ordinary-user adoption. |
| 195 `/LeaveType` | `LeaveType` CRUD and Staff select | `LeaveType.View` | Preserve existing Staff.Lookup editor prerequisite, drafts and Excel. |
| 196 `/Overtime` | daily CRUD, `GetProcessRuns`, Process, Import | `anyOf(Overtime.View, Overtime.GetProcessRuns)` | The initial tab must select an available read. The two tabs have separate grants. Create requires `Overtime.Create` + `Staff.Lookup`; edit requires `Overtime.View` + `Overtime.Update` + `Staff.Lookup`; delete requires `Overtime.View` + `Overtime.Delete`. Process and Import are distinct operations, including at submit-time. Stored `BranchId` is a transaction branch; a run reader requires complete read scope. |
| 197 `/Shift` | `Shift` CRUD | `Shift.View` | Preserve existing definition editor/write and Excel contract. |
| 198 `/StaffTimesheets` | `StaffTimesheet` list/detail/CRUD | `StaffTimesheet.View` | Reuse the plural/singular route alias and previously frozen Staff/Shift prerequisites and saved-branch rules. |
| 199 `/LoanEMI` | `GET LoanReport/emis` | `LoanReport.GetEMIs` | Read-only complete-array report; tenant/live and Bill/Plan branch scope; `Bill.View` and an independently adopted `/Bill/details/:id` route are both necessary to navigate to a linked bill. EMI Pay stays disabled. |
| 200 `/Loans` | `GET LoanReport/loans`, `GET LoanReport/finance-banks` | `LoanReport.GetLoans` + `LoanReport.GetFinanceBanks` | Bank filter is required for the existing search form; both endpoints are whole-document reads governed by ReadBranchIds. No write grant. |

LoanReport's four actual GET endpoints (`GetEMIs`, `GetLoans`, `GetDetails`, `GetFinanceBanks`) are read-only, not movement writers: classify as whole-document reads in `BranchOperationRules`. This does not authorize adopting `/LoanDetails` (separate inventory item), changing the Loan payment workflow, or exposing any hidden-branch document details. Report result, totals, print and Excel must be expired on query changes or access/context withdrawal; print is tied to the successful query generation. Backend `QueryReport` and joins remain the authority for row visibility.

The `/Bill` family is still `resource-only` in the separate route inventory. The report must not present a clickable Bill link to an ordinary user who would be rejected by the destination route guard merely because `Bill.View` is assigned; display the bill number without navigation until Bill details have their own frozen, adopted access policy. Print must use every row of the successful report search, not just the displayed local page or a column-filtered subset. Revoking `Overtime.Import` while a CSV file is being parsed must release the import dialog's busy lock while fencing any obsolete parser callback.

Temporary HTTP containment for 192 and 194: while both routes remain unadopted for ordinary users, their existing assignable HTTP grants must not disclose tenant-wide records to holders of a partial branch grant. The server requires complete company read scope for their read actions and complete transaction scope for writes, using the existing company-branch predicate. This is a restrictive fail-closed guard, not owner approval of tenant-wide Leave/Deduction operations or an authorization to adopt the routes. Leave.Dashboard is a read action. A later explicit data-owner contract must replace this temporary scope rule.

Verification levels: source review establishes the above API and branch joins, but does not establish HTTP runtime acceptance, SQL concurrency acceptance, or visual acceptance. Implementation must report builds/tests actually executed and any owner decisions left open. Existing legacy/retired frontend/backend review guides must not be read.

## توضيح تنفيذ الملاحظات — 2026-11-14

تستبعد قراءة تشغيلات الإضافي الفرع المحذوف من شرط اكتمال الفروع، دون إعفاء الفرع الحي. يخرج الإنشاء المستقل إلى وجهة مسموحة بدل فرض عرض القائمة. تنتهي قرارات تجاهل المسودة عند انتهاء سياقها، ويظل تجاهل محلي جديد متاحًا أثناء المنع. تُسوّى الكتابة الناجحة بهوية المسودة والجلسة الأصلية، مع فصل حجب الإشعار بإصدار المنح عن إكمال الانتقال المسموح. لا تغيير لمفاتيح المنح أو API أو قراري 192/194 المؤجلين. [الإصلاح والتحقق](AUTHORIZATION_191_200_FIXES_20261114.md).

## قرار لاحق للبندين ١٩٢ و١٩٤ — ١٤ نوفمبر ٢٠٢٦

حُسم نطاق الخصومات والإجازات في [عقد الفرع المحفوظ](LEAVE_DEDUCTION_BRANCH_ACCESS_CONTRACT_FREEZE.md). يستبدل الفرع الذي يلتقطه الخادم عند الإنشاء منع HTTP المؤقت الذي كان يشترط اكتمال نطاق الشركة. تعتمد الإجازة على منحة القرار والتسجيل في الفرع المحفوظ، وتظل لوحة المتابعة مستقلة. يوضح [سجل المطابقة](LEAVE_DEDUCTION_BRANCH_ACCESS_RECONCILIATION.md) حالة الهجرة والقبول.
