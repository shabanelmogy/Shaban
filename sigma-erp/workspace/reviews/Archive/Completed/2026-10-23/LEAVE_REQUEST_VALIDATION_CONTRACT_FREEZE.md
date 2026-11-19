# Leave request validation — small evolution slice

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-11 |
| Authorization | Owner «تمام» accepting the proposed next small Leave improvement slice |

## Scope and authority

Extend current LeaveService and existing /Leave list/routed editor. This amends LEAVES_FRONTEND_BACKEND_CONTRACT_FREEZE.md only for overlap, employment-date validation, state locks and clearer stored summary semantics. No new approval/rejection/cancellation endpoint, leave ledger, entitlement, proration, legal-country rule, payroll/accounting effect or bulk cleanup. Owner already confirmed experimental data and correctness priority. Historical contracts remain preserved.

Apply sigma-screen-refactor, Master4/5/7, BE5/8/12/13 and UI02 routed-record catalog + UI7/10/15/19/22/23. References: BranchService validation/localized failures; current Staff/Overtime common write guard; Job list/editor shell; existing Leave persisted summary. All eight generated recipes checked current before source changes. Scoped frontend/backend work uses PLAN00 discovery, phase01/03/04/05/06 and read/action alignment; no redesign of grid.

## Target invariants

| Concern | Frozen decision and evidence |
|---|---|
| Active request | A live (repository not-deleted) Pending or Approved Leave. LeaveStatus existing values: Pending0, Approved1, Rejected2. IsActive flag does not bypass overlap. No Cancelled enum invented. |
| Overlap | One employee cannot have overlapping dated active leave across any types. Inclusive intervals overlap iff existing.From<=new.To AND existing.To>=new.From. Exclude self and evaluate complete bulk final state; rejected requests do not reserve time. Adjacent nonshared days allowed; same endpoint day conflicts. |
| Dates | New requests require both ordered dates; dated updates retain both. Start cannot precede selected employee.DateOfJoining.Date. End>=Start, same-day allowed. Backend revalidates for staff/date changes. No end-of-employment inference because no episode source exists. |
| Legacy undated | Existing both-null dates may remain null under prior frozen contract; they cannot participate in dated overlap. New requests cannot be undated; one missing date is invalid; dated history cannot be cleared. |
| State write lock | Approved requests are read-only, including Reason, and cannot be deleted via generic CRUD. Existing Pending/Rejected writes remain supported; rejected stays rejected when corrected (no resubmission inferred). Undefined/unhandled stored statuses fail closed under same editable-state rule. No client status input added. |
| Bulk safety | AddList/UpdateList must enforce the same scalar/FK/date/state/overlap invariants, validate all before mutation and save once. Current public APIs unchanged; no bulk endpoint added. |
| Concurrency | All Leave add/update/bulk/remove use existing ExecuteUniqueWriteAsync<Staff>, also used by Staff date writers. Re-read state/intervals inside lock. LeaveStatus EF concurrency token protects stale state on update/delete without a new column. No approval writer exists today; future transitions must join same guard. |
| Calculations | Existing inclusive calendar duration and CurrentlyBooked retained. New MaxLeaves/PendingRejoining initialized from type; updates preserve counters/quota/pay/state snapshots. No accrued annual entitlement inferred from MaxLeaves or current balance calculated from stored RemainingBalance. |
| UI | Pending/Rejected edits and delete supported. Approved/unrecognized rows allow View and disable Edit/Delete. Direct edit URL loads approved data read-only with explanation and no Save. Backend is authoritative if UI state is stale. List/editor failures keep values and preserve existing feedback owner. |
| Summary language | Distinguish request duration, saved type limit/booked/pay/balance fields, and unavailable current annual entitlement/available balance. Preserve all eight saved summary values; no fake balance zero or summed type quota. |
| API / mapping | DTO fields/enums/routes remain unchanged; use current LeaveStatus returned in list/details for presentation. Existing one-way maps retained; status/counters/audit excluded from writable inputs. Localized EN/AR Result failures. |
| Transaction | One tracked graph save; common write guard owns existing transaction for overlap race serialization. No nested transaction or independent save loop. Failed refresh/action cannot masquerade as success. |
| Guide | Existing bilingual HRM_LEAVES_TOPICS (/UserGuide/hrm) updated for overlap, joining, state locks and saved summaries; no new reader/menu. |

## Endpoint/action/column contracts

POST Leave Add, PUT Leave Update, DELETE Leave?id and inherited detail/list reads retained. Supported actions: Create, View, Edit Pending/Rejected, confirmed Delete Pending/Rejected, Search/Reset/paging/export/dashboard navigation. Approved only View; no approve/cancel action exposed. This state lock is domain integrity, not a role authorization mechanism (project remains authentication-only).

Grid columns: No / Staff / Leave Type / From / To / Days / Status; ListVM properties id,no,staffName,leaveTypeName,fromDate,toDate,noOfLeaves,leaveStatus,pendingRejoining unchanged. Detail summary noOfLeaves,maxLeaves,currentlyBooked,previouslyBooked,remainingBalance,paidDays,halfPaidDays,unpaidDays unchanged. Filters, sorting, export and applied route parameters unchanged.

Failures: LeaveDatesRequired, LeaveDateOrderInvalid existing keys; new LeaveBeforeJoining, LeaveRequestOverlap, LeaveApprovedLocked, LeaveInvalidBatch/LeaveInvalidInput as required by writers. Live staff/type/update identity required within tenant. No database preflight/run allowed in this task.

## Impact/options and gates

Keep current tables/DTOs/routes/summary/calculations. Extend LeaveService invariants and shared state presentations; reuse existing lock, translations, guide. Reject alternative of adding separate requests/approval/ledger architecture during this slice. Keep legal calendar/half-day/accrual/cancellation business decisions for later owner freeze.

No schema column/index/entity-property change is planned; EF concurrency token changes predicate metadata only (BE15 precedent), so no new migration for this slice. Previous Attendance migration remains a separate owner action. No builds/tests/lint/DB/browser/migrations/snapshot/commits/push/deploy/SigmaMCP/Graphify. Final source-only scoped diffs and bilingual guide checks required.

## Implementation ownership

Root owns backend LeaveService/LeaveConfig/resources and final report/integration. Bounded frontend worker owns only Leave list/editor/model presentation, scoped vocabulary additions and hrm-leaves-topics; no overlapping app ownership. Canonical AGENTS delegation gate applies after this contract freeze. Worker must preserve prior user/peer changes and stop only a conflicting contract portion.

## Reconciliation amendment — 2026-10-11

UI7 requires permanently unavailable actions to be omitted through ActionList.visible, reserving disabled for transient busy state. Approved/unrecognized rows therefore show View only; the View header omits Edit in locked states. This refines the earlier disabled presentation without changing the frozen backend lock. UI15 also requires lookup requests only for rendered controls: direct edit routes wait for details and skip dropdown lookups when locked. The bounded worker could not start due to its model usage limit; root completes frontend and guide locally, with no worker edits integrated.
