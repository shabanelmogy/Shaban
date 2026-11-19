# Leave list load failure

| Field | Value |
|---|---|
| Status | Blocked |
| Owner verification pending | yes |
| Date | 2026-10-11 |
| Scope | Diagnose GET /Leave returning HTTP 500; preserve existing layout and decision contracts |

## Evidence and decision

The owner supplied GET https://localhost:7178/Leave with dateFrom=2026-10-01, dateTo=2026-10-31, rejected=false, pendingApproval=false, pendingRejoining=false, pageNo=1, pageSize=15 and sortOrder=1. The response status is 500. No response body or backend exception has been supplied yet. The actual runtime cause is therefore Uncertain.

Source-confirmed schema gap: LeaveListVM.RowVersion is selected by LeaveService.MaterializeListAsync through ProjectTo. Leave.RowVersion is configured as a SQL Server rowversion in LeaveConfig. The current Leave entity additionally persists DecisionAt, DecisionBy, RejectionReason and IsAutomaticallyApproved. None of these five properties appears in the current snapshot's Leave entity block; no migration operation adding these properties to Leave was found. AddLeaveOpeningBalances creates a different table and its RowVersion does not cover Leave.

If the running database follows these migration sources, the projected list will request a missing Leave.RowVersion column. This is the leading source-supported hypothesis, not a confirmed runtime exception. Obtain the request Response or backend exception before declaring it the cause. An Invalid column name 'RowVersion' exception confirms that hypothesis.

No source workaround is authorized by this evidence: retain the row version required by Edit/Approve/Reject, retain concurrency checks, and retain real error handling. Do not remove the field or turn a failed list into a successful empty result.

## Contract and conformance

Selected backend shape: normal entity read using inherited GetManyAsync and ApplyListFilters/ApplyListOrder/MaterializeListAsync hooks (BE5/7/9/13). Existing workflow transitions remain unchanged. Selected frontend shape: existing typed paged list using shared DataTable and the standard GET Results wrapper (UI2/5/6/22).

| Concern | Owner / reference | Target evidence |
|---|---|---|
| List filtering and paging | BE9/13; BranchService.ApplyListFilters; Service.GetManyAsync | Existing Leave hooks retain inherited filtering/count/paging; supplied query uses the documented bracket keys |
| Navigation names | BE13; shared MaterializeListAsync projection extension point | LeaveService.ProjectTo selects StaffName and LeaveTypeName |
| Mapping | BE4; BranchProfiler four one-way maps | LeaveProfiler explicitly flattens names; conventional RowVersion mapping is required by actions |
| Read failure | UI2/22; shared apiErrorMessage and toListParams | Leave service uses standard query transport; list catchError exposes leaveReview.errors.list when response lacks a usable message |
| Schema handoff | AGENTS migration boundary; prior LEAVE_DECISION_WORKFLOW_FULL_STACK_REVIEW | Existing contract requires owner-generated schema migration before running new code |

Grid columns: no, staffName, leaveTypeName, fromDate, toDate, noOfLeaves, leaveStatus. ListVM: Id plus these seven fields, PendingRejoining and RowVersion for the existing row/filter/action contract. No contract, AutoMapper or duration/payment/balance calculation changes in this task.

## Owner repair and verification

If the response confirms the missing column, generate and review Add-Migration AddLeaveDecisionAuditAndAutoApproval against the current application model. Expected Leave additions: RowVersion (SQL-generated rowversion), DecisionAt (nullable datetimeoffset), DecisionBy (nullable nvarchar(250)), RejectionReason (nullable nvarchar(1000)), IsAutomaticallyApproved (bit, default false for legacy records). Inspect any other generated operations against their owning reviews before applying; the working tree includes unrelated schema work. Existing statuses and historical decision values must not be invented or rewritten.

Apply the reviewed migration to the database used by the running API, restart the API if needed, and replay the exact supplied GET. Confirm successful paging and fresh rowVersion values, then confirm existing concurrency behavior through owner verification. Suggested backend commit subject, only after an owner-reviewed migration: fix(hrm): add missing leave decision schema. No frontend commit is needed for this diagnosis.

## Reconciliation and execution boundary

- Read-path discovery and source reconciliation performed; schema implementation is owner-pending. No broad feature redesign or action implementation was started.
- Reviewed scoped diffs separately in SigmaBackend and SiGmaAngularFrontEnd; repeated the initially truncated backend service diff in full. Scoped git diff --check passed in both repositories.
- Recipe drift check returned OK for all eight packets; PHASE-02 read packet remains consistent with the canonical read-hook/query conventions. No documentation rule or packet changed.
- Only this review artifact was created. No application source, migration, snapshot or user guide changed. Existing HRM Leave guide content remains applicable because user-visible behavior has not changed.
- Backend response/exception and actual applied database schema remain unknown. No build, test, lint, browser/application verification, database command, migration, commit, push, deployment, Graphify or Sigma MCP was run.
- No subagents: this is a small sequential diagnosis with unresolved runtime evidence.
