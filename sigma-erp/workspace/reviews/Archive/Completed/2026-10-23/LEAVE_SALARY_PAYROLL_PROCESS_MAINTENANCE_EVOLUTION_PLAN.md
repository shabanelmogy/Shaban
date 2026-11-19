# LEAVE SALARY PAYROLL PROCESS MAINTENANCE EVOLUTION PLAN

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Date: 2026-10-09. This plan follows the superseding frozen contract in LEAVE_SALARY_PAYROLL_PROCESS_FRONTEND_BACKEND_CONTRACT_FREEZE.md.

| Impact owner | Classification | Implementation |
|---|---|---|
| PayrollRun lifecycle/root/revisions/logs | Extend / Keep | Add type+staff identity to root; keep immutable revisions, tenant lock, optimistic version, approval and paid guards. |
| PayrollRunService and API | Extend | Scope calculation/save to monthly general or monthly inactive staff; lookup inactive staff; project type/staff in list. |
| PayrollProcess frontend | Extend | Reuse component/service with route data and required Staff; keep rows, actions, dialogs, history and cancellation. |
| Payrolls list | Extend | Type options, snapshot employee label and correct context navigation. |
| ProcessLeaveSalary route | Create | Small lazy route facade using shared component. Existing menu URL is preserved. |
| SalaryVoucher/Leave counters/IsInactive | Keep | No generic voucher writes, counters formula or new employee status. |
| Earlier unused draft LeaveSalary DTO/interface | Remove | Five task-created unconsumed files represented an abandoned encashment approach; no owner source removed. |
| EN/AR and HRM guide | Extend | Explain provisional complete-month scope and the common lifecycle. |
| Schema | Extend (owner migration) | Type default Payroll, nullable StaffId, complete unfiltered tenant/period/type/staff unique key. Legacy rows backfilled; no migration execution by agent. |

Alternatives: copying the payroll lifecycle would duplicate sensitive revision/concurrency logic; generic SalaryVoucher CRUD does not calculate staff amounts or preserve history; leave-days payout cannot be derived reliably from undated counters. Shared monthly payroll is the closest source-backed first-review implementation selected under the owner's direction. No journal/payment effects are added. Phases 0–6 apply to source; runtime/database/build checks remain owner-only. Pre-edit source baselines are retained under LEAVE_SALARY_PAYROLL_PROCESS_BASELINE because current Payroll files already existed untracked in the owner's tree.

Final reconciliation: every planned stream is implemented and reviewed at source level. Subsequent contract amendments add symmetric cross-type overlap protection and preserve exact paid-request no-op replay. Root added payroll toolbar-title suppression and distinct LeaveSalary export filenames during integration. The owning bilingual HRM guide is updated. Details, file inventory, source-check evidence and owner migration/runtime steps are in LEAVE_SALARY_PAYROLL_PROCESS_FEATURE_REVIEW.md. Runtime acceptance and the delegated provisional business meaning remain for the owner's next review; journal entries remain deferred.
