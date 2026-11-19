# Leave and Deduction — frozen historical branch and access contract

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Authorization | Owner accepted fixed branch at creation and delegated the best implementation, 2026-11-14 |
| Scope | Items 192 Deduction and 194 Leave, including Leave Dashboard, approval/rejection and Deduction Import |

## Decisions

- Both entities gain required `int BranchId` and `Branch Branch`; branch is captured server-side from the selected Staff's current BranchId at CREATE/each IMPORT row. No Add/Update DTO accepts BranchId. Capture requires a valid live active branch in the same tenant and actor transaction access. Missing staff branch fails; no runtime fallback to current-working/default branch.
- Update never changes saved branch. An unchanged employee can have moved elsewhere without changing the document owner. If the employee reference changes, validate transaction access to the new employee current branch too while preserving the document original branch. All writes/delete/approval/rejection require transaction access on the saved branch. Lists/details/dashboard requests/exports use readable saved branches.
- Output DTOs add readonly `branchId:number` and `branchName:string|null` to lists and details. Frontend row actions use BranchId and existing CurrentBranch options.canTransact (actor context, no extra Branch.Lookup call). Creation is permitted with required operation+lookups and some transactional branch; the server enforces actual selected staff branch. Shared Staff master/lookups remain tenant definitions per existing contract.
- Deduction list/details/Excel: Deduction.View. Create independent: Deduction.Create+Staff.Lookup. Edit: Deduction.View+Deduction.Update+Staff.Lookup. Delete: Deduction.View+Deduction.Delete. Import: Deduction.Import+Staff.Lookup; atomic batch, branch resolved per employee. Optional staffId filter requires Staff.Lookup. Filter/grid/sort fields are strictly screen-owned.
- Leave list/details/Excel: Leave.View. Create independent: Leave.Create+Staff.Lookup+LeaveType.Lookup. Edit: Leave.View+Leave.Update+Staff.Lookup+LeaveType.Lookup. Delete: Leave.View+Leave.Delete. Approve and Reject both keep existing Leave.ManageApproval+Leave.View; add saved-branch write eligibility and existing Pending+RowVersion checks. The grant establishes decision authority; the existing type-approver list continues to determine whether a NEW request needs manual approval, not a new multi-stage or named-user authority system. Preserve existing automatic approval behavior.
- Leave.Dashboard is independent from Leave.View; optional staffId/leaveTypeId filters require Staff.Lookup/LeaveType.Lookup. Dashboard request counts/recent/upcoming are scoped to saved branches. Global opening balances cannot be subtracted from branch-partial usage: return `balancesAvailable:boolean` and empty Balances for branch-partial readers. Administrators or complete company readers get complete existing balances. UI explains unavailable balance and links to request details only with Leave.View. Dashboard data is not employee self-service and introduces no inferred actor/staff relation.
- Tenant admin retains the existing cross-company-branch exception. No new role-name or signed token inference. Remove temporary all-company guard for Deduction/Leave ONLY after persisted branch filters and all write paths are integrated. Keep payroll guard unchanged.
- Unsupported activation, generic graph/GetAll and uniqueness endpoints are nonassignable/405 if unconsumed; bulk writes must enforce the same per-row rules atomically. No financial computation/state or installment/leave entitlement policy change.
- Concurrency: use existing Staff transaction write lock for employee-related writes; company-wide overlap/duplicate/cutoff checks must not be truncated by branch filters. Read narrow tenant/live company facts under lock for validation; do not return hidden document details. Dashboard balances only when complete scope. Preserve existing response money/count precision and rowversion.

## Frontend lifecycle

One captured auth session and actor context; policy/revision cancel reads and output. Regrant reloads required lookups from shared owners without resetting drafts. Stateful imports/rejection dialogs stay mounted, protected content hidden/inert, parent Close/back can explicitly discard denied local drafts. Cancel open decisions on expiry with false; retain already-sent POST/PUT/DELETE lifetime. Same owner/session successful writes consume the original draft once and reconcile permitted reads even when old-revision feedback is hidden. Replacement actors/drafts receive no old result. Pass shared CAN_PRESENT_API_OUTCOME for every mutation.

## Ownership and verification plan

Backend worker owns entities/config/DTO/map and the two service implementations plus service tests and GeneralMessage resources, excluding shared BranchScopeRegistry/endpoint/prerequisite/filter owners. Separate workers own Deduction frontend and Leave frontend ONLY. Root owns shared authorization/routing, schema/migration integration, guides, inventory, tests of HTTP metadata, final diff/build/test evidence and handoff. No worker changes migrations or snapshots.

Use relevant Speed S132 HRM explanation, 2026-10-28 HRM screens 07/14 and C1589/C1588/C1590, deduction index/import controllers, then current Sigma source. Reference code does not establish backend permission rules. No unresolved business decision is inherited from the former 192/194 block after this owner selection. Runtime/database acceptance is recorded separately. Suggested isolated migration: `AddLeaveDeductionHistoricalBranches`; existing experimental rows need explicit preparation, not historical ownership claims or a runtime compatibility fallback.
