# LEAVE SALARY PAYROLL PROCESS FRONTEND_BACKEND CONTRACT FREEZE

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Date: 2026-10-09. This handoff records the contract state for the requested `leaveSalaryPayrollProcess` screen.

## Frozen source-backed decisions

| Concern | Decision | Evidence |
|---|---|---|
| Existing status flag | Use `Staff.IsInactive` for the coarse current/out-of-work distinction. Keep inherited `EntityBase.IsActive` as a separate availability guard. | `SiGma.Helpers/Models/Partner.cs`, `Staff.cs`, `PartnerEndpointGuide.md`; current payroll filters both flags. |
| UI reuse | Reuse Sigma shared page/title/lookup/action/loading/error components; make a dedicated feature component, model and service. | `PayrollProcessComponent` and UI blocks 1, 2, 7, 16, 22. |
| Backend reuse | Reuse Result/tenant/concurrency/financial infrastructure, but use a dedicated leave-salary service/controller. Do not reuse `PayrollRunService` or generic `SalaryVoucher` CRUD as the calculation API. | `StaffPayroll.md`; `SalaryVoucher.cs`/VMs/controller contain header-only client-writable total. |
| Schema | No new status property is required for coarse active/inactive display. A historical exit/effective date is not source-supported. | `Staff` has no `DateOfLeaving`; `Leave` has no start/end date. |

## Unfrozen material decisions

The API shape, leave-salary calculation, persistence/accounting effect, eligibility scope, and trash-action transition remain Missing. No Angular service call, Backend endpoint, DTO, entity, or migration may be invented until those decisions are supplied or approved.

## Required owner response

Please provide/approve the five decisions listed in `LEAVE_SALARY_PAYROLL_PROCESS_FEATURE_REVIEW.md` under “Blocking contract decisions”.

## Superseding continuation decision — 2026-10-09

The preceding discovery is retained as history. The owner subsequently requested the same salary-calculation lifecycle, states and revisions, deferred journal entries, and delegated the ambiguous business choice (“شوف الانسب ولسه البرنامج هيتراجع تانى”). Master 2 screenshot-backed scope/standing reviewer decision applies. The conservative reviewable implementation below supersedes the dedicated-service proposal; no leave encashment or termination-entitlement formula is introduced.

| Concern | Frozen decision |
|---|---|
| Provisional meaning | One complete payroll month for one currently inactive staff member. IsInactive is a coarse current status, not evidence of an exit date. IsActive != false remains a separate availability guard. No new status/date is invented. |
| Reuse | Extend PayrollRunService, PayrollRun aggregate, PayrollProcessService and PayrollProcessComponent. New route module only under HRM/Payroll/leaveSalaryPayrollProcess. Existing tenant, audit, precision, concurrency and lifecycle owners remain. |
| Identity | Immutable run key (SubscriptionId, PeriodStart, Type, StaffId). Type is Payroll or LeaveSalary; Payroll requires null StaffId, LeaveSalary requires positive StaffId. Type defaults to Payroll for existing roots and old API requests. Unique index must be unfiltered so normal monthly null scope remains unique on SQL Server. |
| Requests | POST PayrollRuns/calculate {period,type='Payroll',staffId?}; POST PayrollRuns same inputs plus expectedVersion. No amounts, status or tenant in client requests. Validate shape and selected employee at both boundaries; query existing root by complete key. Bind LeaveSalary calculation hash to type/staff/eligibility. Preserve monthly hash compatibility where practical. |
| Staff lookup | GET PayrollRuns/leave-salary-staff returns Results<PayrollStaffOptionVm>, entities [{id,no,value}]; tenant/live/available inactive staff only. Existing generic Staff lookup untouched. Saved historical reads do not revalidate current eligibility. |
| Reads | PayrollRunVm adds type,staffId. Existing get/revisions/logs/approve routes unchanged and shared. ListVM adds staffCode/staffName from the saved revision; Type derives from root. Type filter accepts Payroll/LeaveSalary; default UI Payroll. |
| Calculation | Existing monthly salary, overtime, deduction, rounding and blocking issue rules. Inactive scope changes employee selection only. No unused Leave counters or SalaryVoucher.TotalAmount used. No inferred leaving date, leave-days payout, gratuity or automatic proration. |
| Actions | Process is read only. Save rechecks inputs/version under existing tenant lock and isolation. Initial save revision 1; identical retry no-op; changed unpaid save appends revision and resets approval. Approve current unpaid snapshot only. Paid roots remain locked. No delete/cancel/reopen/payment/journal action introduced. Screenshot trash means clear selected Staff with discard protection. |
| UI | Shared routed calculation workspace with read-only DataTable rows, title, FilterPanel, Month, conditional Staff, Save/revision/log/Excel/Back actions. Busy form frozen; required Staff; lookup loading/error/retry; saved selection restored from snapshot. Route mismatch rejected. Process/Save identity checked after confirmation. |
| Navigation | /ProcessLeaveSalary lazily uses LeaveSalaryPayrollProcess_Routes with route data payrollType:LeaveSalary and same deactivate guard. /ProcessPayroll normal context. /ProcessedPayrolls selects both types, displays staff, routes each row by type; return filters/paging retained. |
| Schema boundary | Add entity Type (required max32 default Payroll), nullable StaffId and replace monthly-only index with complete scope key. Owner creates incremental Add-Migration AddPayrollRunTypeAndStaffScope, verifies legacy backfill and duplicates. No migration/snapshot edits here. |
| Financial boundary | Calculation/save/approval only. Journal entries explicitly deferred by owner. Payment and settlement writer remain outside this feature. |
| Guide | Update HRM_GUIDE topic /ProcessLeaveSalary plus list type/staff/navigation guidance at existing /UserGuide/hrm. EN/AR translations required. |

### Evidence, pattern selection and pre-edit conformance

Screenshot proves title, Staff selector, clear action, Process and busy state; month/save/revision/approval reuse is owner-requested, not screenshot-invented. Business meaning is a labelled provisional reviewer decision for the next review.

| Concern | Book | Actual approved source / shared owner | Target comparison |
|---|---|---|---|
| Screen type | UI screens 02, UI1/13 | Workshop/Job/components/editor; existing PayrollProcess calculation specialization | One header owns immutable snapshot rows/totals/approval; screen05 rejected because it edits configuration rows. Preserve existing routed calculation query modes as scope-compatible specialization; no editable monetary rows. |
| List and filter geometry | UI3/4/6 | Workshop/Job/components/list/list.component.html; FeatureTitle, FilterPanel, DataTable | Existing sigma-list-page/panel, filter fields/body overlays, fixed table/pager retained; add type/staff content only. |
| Calculation workspace | UI1/14/24 | Accounts/openingBalances/components/details/details.component.html; shared container/summary owners | Reference inspected for shared workspace/frame ownership only; no tabs or financial row editing copied into a snapshot document. Existing PayrollProcess uses read-only DataTable and SummaryCards. |
| Aggregate ownership | BE14/8 | PurchaseOrderService.AddAsync/UpdateAsync, shared Repository/UOW | Selected staff tenant existence checked, server totals, single owned aggregate save. Explicit transaction retained for source/version check isolation, not graph atomicity alone. Immutable revision special case does not expose generic CRUD. |
| DTO/filter | BE3/7/9/10 | PayrollRun current frozen contract + canonical ListSmBase/FilterHelper | Grid Date,Type,Staff,Amount,Status ↔ ListVM Date,Type,StaffCode,StaffName,Amount,IsApproved; extra Id,IsPaid,RevisionNumber,Version are minimum action state. Filters dateFrom,dateTo,type,pendingApproval,sortField,sortOrder retain exact keys. |
| API and auth | BE5/6,UI2/26/28 | Existing PayrollRunsController and shared interceptor client | Extend same endpoints; no permission API; auth-only routes. No extra service/controller or mapping profile. |

### Implementation streams (frozen ownership)

### Conservative overlap guard amendment — 2026-10-09

The same complete monthly salary must not become two saved current snapshots merely because staff status changed after the first save. For both contexts, calculation checks other-type current saved roots in the same tenant/month for a live current-revision employee line. A matching employee receives blocking issue `payrollProcess.issues.duplicatePayrollScope`; Save repeats the check inside the existing serialized boundary. This does not merge amounts or create a settlement. Historical reads remain available. No conflict means ordinary monthly hash shape remains unchanged. Root and backend worker source review identified this cross-context risk before implementation; it is resolved conservatively rather than permitting duplicate preparation. Future settlement/partial-month policy remains outside scope.

Backend worker: PayrollRun entity/config, PayrollRun DTOs/interface/service/controller and payroll-specific resource keys, StaffPayroll.md; remove only the five unused leave-salary draft DTO/interface files created earlier in this task. Frontend worker: HRM/Payroll subtree only (component/service/models/list/new route). Root: pages/routing.ts, i18n en/ar, HRM in-app guide, review/plan artifacts, integration and scoped diff review. No overlapping edits; preserve all owner/peer changes and prohibit build/test/lint/browser/DB/migration/commit/push commands.

Integration ownership addendum: root also updates only Payroll routes in `toolbar.component.ts::showPageTitle` to suppress the duplicate shared toolbar title as UI3 requires. Its pre-edit baseline is captured before mutation; existing unrelated toolbar conditions remain intact. No new permissions/providers/interceptors are added.

Paid-retry compatibility clarification: preserve the original successful exact `RequestVersion` replay of an already saved paid snapshot as an idempotent no-op (no calculation, write or log). Any other paid Save is rejected 409. Unpaid retries revalidate eligibility and cross-type overlap before returning a no-op; this protects new scope invariants while retaining the existing paid immutable-snapshot lifecycle.

## Owner clarification — 2026-10-12

Leave Salary staff selection is restricted to employees outside work. The authoritative backend predicate is `Staff.IsInactive == true` together with `Staff.IsActive != false`; the same predicate is enforced again during calculation. A final-settled employee is excluded from new Leave Salary selection. When an already-saved historical run is opened, its saved employee may remain visible only to preserve historical snapshot navigation; this does not make the employee eligible for a new calculation.
