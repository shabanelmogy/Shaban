# Staff salary inputs and monthly payroll

Source status: implemented, source-only; owner compilation, schema and runtime acceptance pending (2026-10-09).

This feature document describes the current source. The frozen payroll contract and reconciliation live under `F:/My Work/Sigma/reviews`. The canonical Sigma books remain the implementation authority.

## Input ownership

- Staff salary revision is effective dated. `StaffService` writes a complete salary package revision rather than overwriting the values used in an already saved payroll. A same-effective-date replacement retires the prior package rows; saved payroll snapshots still preserve their original amounts and input JSON.
- A normal salary package contains Basic (`OtherIncentive/BasicSalary`), Transport and Housing allowances, stored Gross (`GrossSalary/BasicSalary`), and normal/holiday OT hourly rates. Gross already includes Basic plus allowances. Adding all OtherIncentive rows to Gross would double-count salary.
- The guarded Staff overtime editor calculates and persists `OvertimeAmount` from its recorded hours and salary rates. Payroll consumes that stored amount; it does not reprice historical overtime using a newer salary.
- `Deduction` provides period-based installment inputs. `Attendance` provides dated absence evidence. Current `Leave` counters have no reliable payroll-period contract, and `Eligibility` does not provide earning amounts.
- Legacy `SalaryVoucher` is a header with a client-writable total. It does not own the new payroll aggregate, approval or employee snapshots. No implicit voucher/ledger/payment integration is introduced.

## Calculation policy `MonthlySalarySnapshot-v1`

`POST /PayrollRuns/calculate` is a read-only server calculation. Input is `{ period: "yyyy-MM", type: "Payroll" | "LeaveSalary", staffId?: number }`; omitted type remains `Payroll` for compatibility. Payroll requires no staff scope. LeaveSalary requires one positive staff id and revalidates that the tenant-owned staff is live, available, currently inactive and joined before the month's exclusive end. Process does not persist a payroll operation.

1. Payroll selects live, available, continuing staff (`IsInactive != true`) who joined before the exclusive end of the calendar month. LeaveSalary selects only the requested live, available, currently inactive staff member who joined before that same boundary. Both modes then use the same latest active salary package revision effective before month end (`ApplicableFrom`, with `CreatedAt` fallback for legacy rows); changing the scope does not change the salary formula, and future revisions cannot change an older month.
2. Basic is component0; allowances are earning components1-11; Additional is components13-21; package deductions are components100-117. OT package rows are hourly rates, not additional earnings. Require a complete unambiguous package and Gross = Basic + Allowances.
3. Sum stored overtime amounts from the payroll month, or the previous month when HRM settings select that policy. Missing amount with any nonzero total/normal/holiday hours, negative values, duplicate staff/day rows or overtime before joining block Save.
4. Use active, noncompleted deductions with valid start, total, installment count and paid-installment count. Exclude passed-over rows and already paid/out-of-schedule installments. Floor equal installments to base currency precision; the final installment receives the remainder. Saving a payroll does not mark installments paid.
5. `NetPay = Gross + Overtime + Additional - Deductions`. Backend monetary policy owns rounding and stored totals. Negative net, invalid identity lengths and missing/ambiguous salary inputs block Save.
6. Mid-month joining/salary changes and recorded absences require approved proration/absence policies and block Save for affected rows. No leave-counter deductions or attendance-to-pay defaults are invented. Unsupported previous-month commissions or business-unit processing settings cause an explicit error.
7. One employee cannot be saved in both run types for the same month. Calculation marks the employee with `payrollProcess.issues.duplicatePayrollScope` when the opposing type's current saved revision contains that employee; Save repeats the same tenant/live check inside its serializable transaction. Historical-only revisions do not block a current calculation.

The version hash includes the policy, period, overtime month, precision, employee identity, relevant salary/overtime/deduction/absence sources, undated invalid salary sources, and blocking row issues. LeaveSalary additionally binds type, selected staff and current eligibility. Existing no-conflict Payroll source hashes retain their previous shape. Every response version also binds to the run identity, current revision, payment state and current approval pointer. Save rechecks those sources under a serializable transaction.

## Stored payroll and revisions

- `PayrollRun`: one immutable tenant/month/type/staff-scope root, current revision, approval pointer and future payment boundary (`IsPaid`/`PaidAt`). `Payroll` has null StaffId; `LeaveSalary` has one StaffId. It has no client amount/status CRUD endpoint.
- `PayrollRunRevision`: immutable financial totals, source/request hashes, policy/precision/OT month and its employee lines. Approval metadata is written once without altering financial values.
- `PayrollLine`: staff code/name, effective salary date, source JSON and financial figures. Historical payroll does not depend on current Staff names or salary amounts.
- `PayrollRunLog`: successful Created/Recalculated/Approved operations, revision references, actor, UTC timestamp and amounts. The event is saved with its owning change; retries/no-ops do not add duplicate operations.

`POST /PayrollRuns` accepts `{period, type, staffId, expectedVersion}` with the same default Payroll scope. First Save creates revision1. Changed unpaid inputs append a revision and clear active approval. Previous revisions stay available; an older revision is Superseded, with its historical approval preserved. Identical calculation/save is a no-op. Stale tokens conflict.

`POST /PayrollRuns/{id}/approve` accepts `{expectedVersion}` and approves only the current saved unpaid revision. It does not recalculate, create a voucher or disburse money. A changed later Save requires new approval. Corrupt approval-pointer/audit states are rejected rather than overwriting history.

## Reads and UI

- `GET /PayrollRuns`: counted, paged current saved revisions; filters date range, Type Payroll or LeaveSalary, Pending Approval; stable Date/Amount ordering. LeaveSalary rows expose the selected staff code/name from the saved snapshot.
- `GET /PayrollRuns/leave-salary-staff`: tenant-owned live, available, currently inactive staff options (`id`, `no`, `value`).
- `GET /PayrollRuns/{id}`: current saved snapshot.
- `GET /PayrollRuns/{id}/revisions` and `GET /PayrollRuns/{id}/revisions/{revisionNumber}`: historical snapshots.
- `GET /PayrollRuns/{id}/logs`: tenant-owned chronological successful-operation log.
- `/ProcessPayroll`: monthly preview/Save/history/log/Excel, View/Edit handoff from the management list.
- `/ProcessLeaveSalary`: the same monthly calculation, revision, approval and history lifecycle scoped to one eligible inactive staff member; it introduces no leave-day payout, gratuity, payment or journal formula.
- `/ProcessedPayrolls`: saved runs, View/Edit/Approve/log, complete matching-list and saved-run Excel.
- `/UserGuide/hrm`: bilingual workflow, calculation issues, revision/approval boundaries and separate payment explanation.

## Payment and settlement boundary

Save and Approve do not mean payment. A separate disbursement owner must consume the current approved revision, record actual payment/ledger effects atomically, update installment payment state where applicable and append its operation log. No manual Paid toggle or actual payment writer exists in this change.

If a root has been paid by that future owner, regular Save is refused. Process exposes employee-level differences against the paid snapshot, including removed employees and offsetting changes. These are settlement previews; no settlement payment/document is created here. A negative adjustment must be handled by the separately approved recovery/settlement policy.

## Owner schema and acceptance

The payroll tables/configurations require an owner-created incremental migration, suggested name `AddPayrollRunTypeAndStaffScope`, for required Type (max 32, default Payroll), nullable StaffId and the unfiltered unique `(SubscriptionId, PeriodStart, Type, StaffId)` key. No migration, model snapshot, database command, build or runtime check was run in this task. Owner acceptance must cover legacy backfill/duplicates, schema registration, effective-date cases, source validation, save/approve races and retries, immutable history, logs, export counts, Arabic/dark/responsive layouts and the future payment/settlement boundary.
