# Leave — automatic acceptance when no approvers are configured

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-11 |
| Authorization | Owner continuation «كمل» and explicit decision «اعتبر قائمة الموافقين الفارغة قبولًا مباشرًا» |

## Scope and amendment

This changes the creation decision in LEAVE_DECISION_WORKFLOW_CONTRACT_FREEZE.md. It does not rewrite that historical contract. The owner rejects a separate RequiresApproval setting: the live configured approver collection determines whether a NEW request needs the existing single manual decision. No other HRM slice is implemented in this continuation.

Existing LeaveTypeApprover is ordered staff configuration; it does not provide authenticated user-to-Staff authorization. A nonempty collection still enters the existing single-stage Pending workflow. Configured-user restrictions, sequential stages, identity binding and financial/ledger effects remain excluded. No type setting, endpoint or permission mechanism is invented.

## Frozen invariants and contracts

| Concern | Contract |
|---|---|
| New request, zero live approver rows | Validate staff/type, complete ordered dates, joining date, existing and batch overlap first. Create directly as Approved, IsAutomaticallyApproved=true, DecisionAt=server UTC, DecisionBy=null, RejectionReason=null. There is no manual approval/rejection cycle. |
| New request, at least one live approver row | Create Pending, IsAutomaticallyApproved=false; use existing audited one-stage manual Approve/Reject. |
| Approver lookup | Repository.Query<LeaveTypeApprover> supplies tenant/live scope; query only types used by new rows, select distinct LeaveTypeId once per batch. Deleted rows do not count; inactive rows still count because existing configuration does not define activation as approval-policy removal. Invalid/deleted staff configuration is not silently treated as an empty list. |
| Snapshot | Decision is recorded at creation using the configured rows read for that operation. Later type edits do not silently approve/reject existing Pending requests or change Approved requests. Pending/Rejection updates retain status/audit/automatic marker, including changing type. Existing manual endpoints remain the explicit way to resolve old Pending requests. |
| Read ownership | Persist bool IsAutomaticallyApproved with default false for legacy rows; return only in LeaveDetailVM/details.ts because the details audit displays it. ListVM/columns unchanged: No, Staff, Type, From, To, Days, Status plus identity/action token. Add/Update/action DTOs never accept the flag or decision metadata. |
| Audit | Explicit marker distinguishes automatic acceptance from unknown historical/manual decisions. Never fabricate a username. Details show automatic acceptance instead of a missing human actor when flag=true and keep the decision timestamp. Legacy false marker does not claim historical manual approval. |
| State locks | Automatically Approved rows reuse all existing Approved update/delete/activation/decision locks and overlap protection. No reversal/cancellation/resubmission added. |
| Save / failures | Same SaveRequestsAsync for single/bulk Add, same Staff tenant guard and one save after all validation; no early save, added transaction, client status or duplicate success toast. Failures preserve existing no-mutation behavior. |
| UI / guide | Explain the empty-list behavior in LeaveType Approvers and Leave creation; show automatic audit in existing routed details, retain state-driven action visibility and busy/recovery lifecycle. Update owning bilingual /Leave and /LeaveType guide topics. No new component/CSS or runtime TS file. |

## Evidence and conformance before edits

Initial recipe -Check: all eight packets current. Selected shapes remain normal Leave entity with domain initialization/transitions (BE1/2/3/4/5/8/13), routed Leave record and modal LeaveType child configuration (existing frozen Leave shape, UI13/15/19/23). Master4/5/7 own freeze, reference reconciliation and guide handoff. Applicable Phase1/3/4/5/6; Phase2 only verifies unchanged list projection/state consumers. Existing screenshot proves no approval rule; the explicit owner decision owns this amendment.

| Concern | Book/reference symbol | Shared owner | Target comparison |
|---|---|---|---|
| Input validation before save | BE8/13, BranchService AddAsync; existing LeaveService.SaveRequestsAsync | Repository/InvalidInputAsync | Preserve all validation before domain initialization and one save |
| Server-owned calculation/state | BE1/3/4, Leave.InitializeRequest/RecalculateDuration; LeaveProfiler | Domain/AutoMapper | New bool is read-only and generated at creation, ordinary inputs unchanged |
| Audit/state decisions | Existing LeaveService.DecideCoreAsync and rowversion/Approved guard; prior frozen decision slice | Leave/UnitOfWork | Automatic creation uses existing state without calling a manual actor endpoint |
| Related-row scope | Repository.Query<LeaveTypeApprover>; existing LeaveTypeService live child reconciliation | Repository | Tenant/live approver rows, one batched selection rather than unscoped navigation inference |
| UI | Existing Leave routed FormSection/audit and LeaveType EditorDialog approver help; UI13/15 | FormSection/EditorDialog/translation | Read text/help only, preserve current shells, sizes, internal scroll and footer |

Migration required: owner creates/reviews/applies Add-Migration AddLeaveAutomaticApprovalMarker. Suggested name must be checked unused. Nonnullable bit default false, preserving all legacy status/audit. No backfill of decisions. Coordinate with prior pending AddLeaveDecisionAuditAndRowVersion migration; do not run unchanged new code before schema is present.

Root owns backend Leave.cs, LeaveConfig.cs, LeaveDetailVm.cs, LeaveService.cs, LeaveTypeApprover.cs documentation comment and review artifacts. Bounded frontend worker owns Leave details/create help, LeaveType approver help, scoped EN/AR vocabulary and hrm-leaves-topics.ts only. Preserve all pending user/peer edits. No application-source ownership overlap. No builds/tests/lint/migrations/snapshots/database/browser/commits/push/deploy/SigmaMCP/Graphify.
