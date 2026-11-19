# HRM payroll backend implementation boundary

Status: **Implemented source-only foundation** — owner verification pending: **yes**.

Added the source foundation `PayrollRun`/`PayrollLine` entities and `PayrollRuns`/`PayrollLines` DbSets.  API/service/controller work remains pending because this bounded pass did not create or run the required migration and no safe persistence-backed calculation seam exists until the model is migrated.  No migration or snapshot was touched.

## Existing supported inputs

- Staff salary revisions are effective dated and component based. `StaffService` writes six `SalaryPackage` rows and guards revision writes with `ExecuteUniqueWriteAsync` (`SiGma.Business/Services/StaffServices/StaffService.cs:136-217,325-418`).
- Staff overtime has a guarded GET/POST editor. The client submits minutes; the service resolves normal/holiday rates, calculates rounded amounts, writes Overtime rows, and rereads them (`StaffService.cs:1710-1850,1851-2012,2043-2093`).
- Attendance, StaffTimesheet, Leave, and Deduction currently expose generic CRUD services/controllers. Their current models must be mapped into a payroll-period policy before calculation.
- SalaryVoucher is a four-field header (`SalaryVoucherNo`, `VoucherType`, `Date`, `TotalAmount`) and has no employee or line relation (`SiGma.Helpers/Models/SalaryVoucher.cs:3-9`).

## Proposed frozen schema (migration required later)

Suggested migration name: `AddPayrollRunsAndLines`.

`PayrollRun` (tenant/subscription and normal `EntityBase` audit fields): `Id`, `PeriodStart` (date), `PeriodEnd` (date), `Status` (Draft/Calculated/Posted/Cancelled), `RunNumber` (server generated), `CalculatedAt`, `PostedAt`, `TotalGross`, `TotalOvertime`, `TotalDeductions`, `TotalNet`, and a concurrency token.  Add a unique index on `(SubscriptionId, PeriodStart, PeriodEnd)` while status is active, or an equivalent owner-approved idempotency key.

`PayrollLine`: `Id`, `PayrollRunId`, `StaffId`, effective salary-package identifier/date, `GrossSalary`, `OvertimeAmount`, `LeaveAmount`/policy result, `DeductionAmount`, `NetPay`, and auditable source snapshots (or immutable source references) for the salary and overtime inputs used.  Add a unique `(PayrollRunId, StaffId)` index.  Foreign keys must use the repository's existing delete policy; payroll history must not cascade-delete from Staff.

The existing SalaryVoucher should gain an optional `PayrollRunId` only after the owner decides whether a voucher is the posted accounting header.  Do not overload `TotalAmount` as a calculation request.

## Proposed API contract

- `POST PayrollRuns/Calculate`: period plus explicit options; validates period and staff scope, reads effective salary packages and approved source rows, computes all lines server-side, and is idempotent on the period key.  It must run in one transaction and reject a conflicting active run.
- `GET PayrollRuns/{id}`: run totals and paged lines with source/effective-date fields.
- `POST PayrollRuns/{id}/Post`: transition only from Calculated, re-check totals/version, write the approved SalaryVoucher relation if approved, and commit atomically.
- `POST PayrollRuns/{id}/Cancel`: transition guard only; posted runs require the owner-approved reversal policy.

Write VMs should contain period, scope, and an idempotency/concurrency token only.  Gross, overtime, deductions, net, run number, status, and timestamps are server-owned.  Enum writes need `EnumDataType`; period must require `PeriodStart <= PeriodEnd`; staff must be active and belong to the subscription; duplicate active periods and duplicate staff lines must be rejected.

## Transaction and calculation risks

The calculation policy is still a product decision: whether gross uses the Basic/GrossSalary package rows, how attendance and leave reduce pay, whether overtime uses stored amounts or is recalculated, which deductions/eligibilities qualify, and whether a run snapshots source values.  These must be frozen before implementation.  The source notes explicitly state that current code has no general net-pay calculation or salary-line model (`SiGma.Helpers/Models/Staffs/StaffPayroll.md:51-60,232-248`).

Until the schema and policies are approved, retain the current guarded Staff salary/overtime APIs and do not expose a fake PayrollRun endpoint backed by SalaryVoucher.TotalAmount.  The existing salary-voucher reverse maps and client-writable total remain the earlier audit defects (`HRM_PAYROLL_BACKEND_AUDIT.md`, HRM-PAY-01/02) and should be repaired as part of the approved payroll contract work.

## 2026-10-09 implementation continuation — supersedes the foundation-only proposal above

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

The owner approved the calculation/API foundation, effective-dated salary handling, Save separate from disbursement, unpaid historical revisions, paid settlement differences, current-revision approval with Superseded history, and a viewable operation log. The authoritative continuation is recorded in `HRM_PAYROLL_CONTRACT_FREEZE.md`. Earlier proposed Status/Post/Cancel fields and endpoints above were never implemented and are not the current contract.

Implemented entities/configurations are `PayrollRun`, `PayrollRunRevision`, `PayrollLine` and `PayrollRunLog`, registered through four DbSets and configuration discovery. The root owns the unique tenant/month and concurrency tokens; revisions own immutable figures/input snapshots; restricted FKs preserve history; employee lines are unique by revision/staff. Approval and audit events are written with the change in one aggregate save. No AutoMapper or generic writable amount/status surface is used.

`IPayrollRunService`, `PayrollRunService`, eight typed VMs and `PayrollRunsController` implement preview, guarded revision Save, current/historical reads, counted list, guarded approval and chronological logs. Backend owns salary/OT/installment classification, rounding and Net Pay. Source hashes include issue-bearing inputs; saves revalidate under serializable source-read protection and the existing tenant PayrollRun application lock. Replays/no-ops preserve idempotency and history. Base-currency precision and shared decimal storage bounds are checked.

Focused review corrections: inactive deduction exclusion, required paid-installment count, undated salary validation and hashing, missing OT amount across all hour counters, full Staff display name, canonical default paging10, and corrupt approval audit-pointer rejection. See final reconciliation for exact contracts/decisions and file manifest.

Owner must create/review/apply `Add-Migration AddPayrollRunsAndLines` for the four new payroll tables/indexes/FKs. This task did not create/edit/run migrations or model snapshots. Compilation, EF model/schema, transaction/concurrency and runtime checks remain pending. Actual disbursement, ledger posting, cancellation and settlement writing are separate workflow contracts, not silently implemented through Save/Approve.
