# HRM Payroll Process — frozen first foundation

Status: **Frozen**. Owner verification pending: **yes**. Source-only implementation, 2026-10-09.

## Scope/evidence

User approved a complete Payroll Process screen with server Net Pay and a new API, and requested a strong foundation. Screenshot proves Month, Process, Save and Code/Name/Basic/Allowances/Gross/Overtime/Additional/Deductions/Net Pay columns. HRM already has Payroll navigation. Posting, payment, approval, reversal, payslips and leave/absence/proration rules are not proved; no accounting entry or payment is introduced.

## Producer/consumer contract

- `POST /PayrollRuns/calculate` `{ period: "yyyy-MM" }` is a **read-only preview**. It returns a stored snapshot if the period was saved, otherwise calculates current eligible staff. Process does not create a database record.
- `POST /PayrollRuns` `{ period: "yyyy-MM", expectedVersion: string }` recomputes server inputs, requires the exact displayed SHA256 fingerprint, and persists the header and staff snapshots in one save under the tenant payroll write guard. Retry with the same token returns the existing saved run; a different token for a saved period returns 409. This replaces the incomplete initial PUT-by-id proposal: a read-only preview has no persisted id to update.
- `GET /PayrollRuns/{id}` reads only the authenticated tenant's saved run.
- Response: `id: number|null`, `period`, `version`, `isSaved`, `canSave`, `policyVersion`, `overtimePeriod`, `decimalPlaces`, `rows`, totals `totalBasic/totalAllowances/totalGross/totalOvertime/totalAdditional/totalDeductions/totalNet`.
- Row: `staffId`, `code`, `name`, `basic`, `allowances`, `gross`, `overtime`, `additional`, `deductions`, `netPay`, `issues: string[]`. Issue values are stable translation keys. Rows are server-owned and read-only. No client payroll amounts, tenant, status or audit fields are accepted.

## Calculation policy v1 (source-supported reviewer decisions)

1. Local calendar month `yyyy-MM`, years 0001–9998, exclusive next-month end. Active (`IsInactive != true`, `IsActive != false`) staff joined before that end. No automatic mid-month proration; a joining date or salary revision inside the month produces a blocking row issue until the day-rate policy is approved.
2. Latest salary revision effective at period end, using `ApplicableFrom ?? CreatedAt` (legacy fallback), all rows from that same revision. StaffService writes `OtherIncentive/BasicSalary` as Basic, Transport/Housing as allowances, and `GrossSalary/BasicSalary` as **Basic + Transport + Housing**, so Gross must not be added to these components again. Validate Gross = Basic + Allowances; missing/ambiguous/negative packages block Save. Other addition component types contribute Additional; package deductions contribute Deductions; OT packages are hourly rates and are not added as earnings.
3. Stored `Overtime.OvertimeAmount` is authoritative. Respect `HrmSetting.IsPreviousMonthOvertimeForPayrollProcess`; use previous month only when configured. Missing amount on a nonzero-hours row, negative values or duplicate staff/day rows block Save. Do not recalculate saved OT against a later salary revision.
4. Active noncompleted deductions require valid start date/total/installment count/paid count. One scheduled installment for the period, excluding already paid installments and pass-over flag. Floor equal installments to base precision, final installment takes the remainder. Save does not increase PaidInstallments because it saves a payroll snapshot, not a payment.
5. `NetPay = Gross + Overtime + Additional - Deductions`, using FinancialNumberPolicyResolver base-currency precision and FinancialNumberPolicy. Negative net blocks Save. No unperiodized Leave counters or Attendance automatic deductions are invented. Attendance absences in the period produce a blocking issue until policy is approved. A permanent visible policy notice explains this boundary.
6. Previous-month commissions and business-unit-wise processing settings lack an implemented producer/scope. When enabled they produce a blocking calculation error rather than silently ignoring the configuration.
7. Snapshot staff code/name, effective salary date, figures, source inputs JSON, policy version, OT period and precision. Saved rows remain stable after Staff or settings change. One payroll per tenant/month and one line per run/staff enforced by unique indexes. No update/delete/post route for saved snapshots.

## Reference/conformance

| Concern | Owning block/reference | Shared owner/target |
|---|---|---|
| Month workspace + financial collection | UI screen 05; UI14; OpeningBalances financial workspace | Sigma route host/title/filter + read-only DataTable; no editable rows because all figures are server-owned |
| Bounded rows/title/actions | UI1/3/4/6; OpeningBalances layout | shared shell/filter/data-table/footer, no feature CSS |
| Month/feedback | UI17/19/22 | DatePickerDirective, monthValueValidator, FieldError, StateMessage |
| Async form/dirty navigation | UI10 | freezeFormState, ConfirmationDialogService, pending gate |
| Aggregate snapshot | BE14 PurchaseOrderService mechanics; BE15 money ownership | source-calculated header/children, one save; no ledger effect, justified stateful custom service/controller |
| API errors | BE5 GeneralMessage resources | localized safe responses, both failure channels |

Suggested migration: `AddPayrollRunsAndLines`. Model/config changes only; no migration/snapshot/DB command is authorized. Build/runtime/database/browser acceptance remains owner-pending.

## Owner continuation decision — historical recalculation

Owner explicitly chose Save = save monthly payroll, disbursement is separate. Owner then confirmed historical salary rules: latest salary effective for the payroll month, unpaid recalculation updates payroll, paid recalculation becomes a settlement. Root confirmed this with the effective-date qualification.

This supersedes the initial single immutable run contract above for **unpaid** runs:

- PayrollRun is the tenant/month root: `CurrentRevision` (concurrency token), `IsPaid` (concurrency token, future disbursement writer only), `PaidAt`. No frontend action or generic endpoint can set payment state.
- PayrollRunRevision owns immutable calculated values and PayrollLines, policy/input snapshots and request/source hashes. Save of changed unpaid inputs appends a revision and advances root.CurrentRevision in the same save; old revisions are retained. Identical Save/Process is a no-op. Period uniqueness belongs to the root; `(RunId, RevisionNumber)` and `(RevisionId, StaffId)` are unique.
- `POST /PayrollRuns/calculate` always calculates a candidate and compares it to the saved current revision. Response adds `revisionNumber`, `isPaid`, `requiresSettlement`, `settlementTotal` (candidate Net minus saved Net); rows add `netPayDifference`. `isSaved` means inputs match current saved revision. `version` fingerprints candidate source + current root revision + payment state; stale Save returns 409. Paid root remains immutable: regular Save refuses; differences are exposed for a later dedicated settlement workflow, not automatically paid or posted.
- `POST /PayrollRuns` still accepts only `{period, expectedVersion}`. Repeating the same accepted request token returns the stored current revision. If a newer revision exists, the old token conflicts. New save recomputes and validates the displayed inputs, appends PayrollRunRevision + Lines once, and increments CurrentRevision.
- `GET /PayrollRuns/{id}` returns current saved revision; `GET /PayrollRuns/{id}/revisions` returns saved revision summaries; `GET /PayrollRuns/{id}/revisions/{revisionNumber}` returns that historical snapshot. Response `version` is for the displayed server state, not a client-writable status.

Actual disbursement and settlement persistence/payment are outside this screen's save operation and remain a later separate API/workflow. The `IsPaid` boundary is ready for that owner; this feature does not invent a payment record or expose a manual Paid toggle.

## Approval screenshot and replacement policy — 2026-10-09

The second screenshot proves a Payrolls management list with Date Range, Type (Payroll), Pending Approval, Search; columns Date/Type/Amount/Status; View/Edit/Approve/Export to Excel actions and server paging. User asked whether recalculation cancels previous approval. Root recommended financial values stay immutable, old unpaid revision is Superseded while its historical ApprovedAt/By remain, newest revision requires a fresh approval; Cancelled is reserved for cancellation of the whole period, not normal recalculation. Paid history remains paid with differences settled separately.

- PayrollRun gains `ApprovedRevisionNumber` (nullable concurrency token). Only current revision approved => eligible for future disbursement. Changed Save appends revision and clears current approval pointer. Historical revision's ApprovedAt/By remain. No cancellation/unapproval/payment endpoint is introduced from the screenshot.
- PayrollRunRevision gains `ApprovedAt`, `ApprovedBy`, written once by Approve; financial/source fields remain immutable.
- Run/detail response adds `isApproved` for the displayed revision, `isCurrentRevision`, `approvedAt`, `approvedBy`; frontend marks a historical older revision Superseded (without falsifying historical approval). Paid root can only be disbursed once by a future separate payment owner.
- `GET /PayrollRuns` accepts canonical `ListSmBase`: pageNo/pageSize, Filters[dateFrom/dateTo/type/pendingApproval/sortField/sortOrder]. Date is period end minus one day; type is only supported Payroll. Return Results<PayrollRunListVm>: `id,date,type,amount,isApproved,isPaid,revisionNumber,version` plus paging/count. Grid Date/Type/Amount/Status; identity/version/revision/paid minimum action gates.
- `POST /PayrollRuns/{id}/approve` accepts `{expectedVersion}`. Validate tenant/current revision/unpaid, require exact saved version, approve current revision under the same PayrollRun tenant write guard, save root pointer + revision audit once. It does not recalculate or post/pay. Race with a newer Save returns 409. Repeat Approve with current state is a successful no-op.
- Process workspace `GET id` loads current saved snapshot for View/Edit deep link; Edit means Process (recalculate) then Save new revision. List View uses read-only mode; paid rows have no Edit/Approve. Excel exports complete matching list and per-run rows from saved snapshot, not the current page only.
- Management route `/ProcessedPayrolls` under the existing Payroll group. Process `/ProcessPayroll`; approved/reference amounts are stored revision totals, never legacy SalaryVoucher.TotalAmount. LeaveSalary and FinalSettlement are future types and not displayed as supported options.

## Operation log — explicit owner request

Owner approved Superseded and asked for a viewable operation log. Add immutable PayrollRunLog events in the same save as each successful change: Created (initial save), Recalculated (new revision, previous revision reference), Approved. Snapshot actor and UTC time; do not log an unsuccessful/unpersisted Process preview as a saved payroll change. Future disbursement/settlement owner must use the same log consistency boundary.

`GET /PayrollRuns/{id}/logs` returns Result<PayrollRunLogVm[]> in chronological order: `id`, `operation` ('Created'|'Recalculated'|'Approved'), `revisionNumber`, `previousRevisionNumber: number|null`, `occurredAt`, `performedBy`, `previousAmount: number|null`, `amount`. Tenant/root ownership required, no mutation endpoint. Show shared read-only dialog/table and translated operation labels from Process workspace and management row action.

## Final source clarification — audit time transport

Approval/log timestamps remain stored in UTC. Reads explicitly restore UTC DateTime kind after SQL materialization so initial mutation responses and later reads serialize consistently. The shared UI date formatter converts those timestamps to the user's local time; labels identify local time. This presentation clarification adds no accounting or workflow change. The preview revision badge identifies the saved/base revision number without describing changed candidate figures as saved.
