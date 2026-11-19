# Leave — empty approver list and automatic acceptance

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-11 |
| Contract | LEAVE_AUTO_APPROVAL_CONTRACT_FREEZE.md |
| Authorization | Owner continuation and explicit «اعتبر قائمة الموافقين الفارغة قبولًا مباشرًا» |

## Result and owner decision

New requests for a type with no live configured approver rows are accepted directly as Approved after the existing full request validation. Types with at least one live configured approver row start Pending and use the existing one-stage manual Approve/Reject actions. The owner chose the collection itself as policy; no RequiresApproval setting was added.

This supersedes the creation-only assumption in the earlier Leave decision contract, which started all new requests Pending. That historical artifact and the broad audit remain historical records. Existing requests are not reclassified when a type's configuration changes: updates keep their existing status and recorded decision. No retrospective automatic acceptance or data cleanup was performed.

The new persisted IsAutomaticallyApproved marker distinguishes automatic acceptance from a human decision or an unknown legacy decision. Automatic requests record server UTC DecisionAt and leave DecisionBy and RejectionReason empty. No fictitious System username is stored. The marker is server-owned, exposed only to the read-only details audit, and false by default for legacy rows without rewriting their status/audit.

Configured approvers now determine whether new requests need a manual decision. Their order still does not create sequential stages or bind authenticated users to Staff. Those capabilities require their own identity/workflow contract. Existing authenticated tenant access remains; no role or permission API, balance debit, entitlement, payroll or accounting effect was added.

The design supports a commonly available no-approval option; [Odoo's official time-off documentation](https://www.odoo.com/documentation/18.0/applications/hr/time_off.html) describes a No Validation mode. The exact empty-collection rule here is the owner's decision, not an inferred Odoo contract.

## Scope and changed files

Backend root: `F:/My Work/Sigma/SigmaBackend`:

1. `SiGma.Helpers/Models/Staffs/Leave.cs`: private-set marker and InitializeRequest(type, requiresApproval) creation state/audit.
2. `SiGma.DataAccess/Configuration/LeaveConfig.cs`: marker default false.
3. `SiGma.ViewModels/ViewModels/Leave/LeaveDetailVm.cs`: read-only marker contract.
4. `SiGma.Business/Services/LeaveService.cs`: one batched tenant/live approver-type query for new requests and domain initialization after validation.
5. `SiGma.Helpers/Models/Staffs/LeaveTypeApprover.cs`: comment reflects the new policy without claiming user authorization/stages.

Frontend root: `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

1. `src/app/modules/HRM/Leaves/Leave/models/details.ts`: typed read marker only.
2. `src/app/modules/HRM/Leaves/Leave/components/details/details.component.html`: existing FormSection description explains creation policy; existing audit displays automatic method instead of a missing human actor, preserving decision timestamp.
3. `src/app/modules/i18n/vocabs/en.ts`: three new Leave keys and updated existing LeaveType approversHint.
4. `src/app/modules/i18n/vocabs/ar.ts`: matching Arabic keys/help.
5. `src/app/modules/UserGuide/content/hrm-leaves-topics.ts`: bilingual Leave/LeaveType explanation.

No Department/Holiday implementation began. Initial discovery identified the pending administrative uniqueness recommendation, then the owner's active leave-policy clarification set this continuation's scope. All unrelated dirty source, migrations and snapshots were preserved.

## Contract and source reconciliation

| Concern | Final behavior and evidence |
|---|---|
| Single/bulk creation | AddAsync and AddListAsync both call SaveRequestsAsync; new type IDs selected once. Tenant/live LeaveTypeApprover rows select distinct LeaveTypeId using Repository.Query, which filters SubscriptionId and IsDeleted != true. Unloaded type navigation cannot accidentally imply an empty list. |
| Validation | Existing batch size/IDs/input/date-completeness/order/staff/type/joining/FK/occupied interval/batch interval checks finish before InitializeRequest. Invalid new requests do not become approved or reach save. Automatic and pending new requests both reserve their date range through the existing Pending/Approved rule. |
| Policy snapshot | Only new rows call InitializeRequest. Updates call RecalculateDuration only, retaining state/marker/audit. Later approver addition/removal affects new creations; it does not reclassify pending, rejected or approved existing records. Inactive configured rows still count; deletion removes them under existing live configuration semantics. |
| State locks | Automatic Approved is subject to existing CanMutate, Pending-only decision, delete and handleActivate protections. No extra approval cycle or reversal action is created. |
| Persistence | Same Staff tenant write guard, same scoped context, one SaveChangesAsync after the prepared graph; no new transaction/save/counter/client-authoritative state. Policy uses the configuration read for that operation; there is no versioned sequential workflow. |
| Mapping | Existing one-way LeaveProfiler convention maps marker to details. No new Ignore/ReverseMap; Add/Update DTOs omit marker/audit/status and therefore cannot write them. Existing update RowVersion Ignore remains justified. |
| Grid / list | Columns remain No, Staff, Type, From, To, Days, Status. ListVM remains id,no,staffName,leaveTypeName,fromDate,toDate,noOfLeaves,leaveStatus,pendingRejoining,rowVersion; no marker added because list actions already read Approved/Pending. Existing dashboard counts Approved correctly. |
| API / integration | Endpoints, result envelopes, route/provider/interceptor and success/error ownership unchanged. Add returns saved Id, existing UI returns to list and reads authoritative status. Manual actions still use viewed rowversion and existing response/audit contracts. |
| Calculation | Inclusive duration, quota/rejoining snapshot and saved balances/payment counters unchanged. Automatic acceptance uses the same backend duration; no balance or legal formula inferred. |
| Schema | Nonnullable bit IsAutomaticallyApproved default false is new. Prior nullable audit fields and rowversion remain required by the previous slice. No migration or snapshot modification performed. |

Selected shapes: existing normal entity with explicit domain creation/state logic (BE1/2/3/4/5/8/13) and existing routed Leave editor/modal LeaveType child editor (UI13/15/19/23). Frozen conformance table compares BranchService validation-before-save, existing Leave domain/audit/guard, Repository.Query tenant/live semantics and existing FormSection/EditorDialog presentation. Approved reference modules are read-only. No new override: prior domain-specific writers and read hooks remain; initialization is the only new transition. No shared extraction qualifies: existing owners already provide every UI/read/write facility this small slice needs.

Phase0 focused scope/policy discovery and Phase1 freeze; Phase3 domain creation/detail/help; Phase4 action-state reconciliation; Phase5 direct contract/refresh wiring; Phase6 scoped diff/guide/source verification. Phase2 verifies unchanged list consumers only; no list redesign. Financial and sequential approval phases are excluded. No new screenshot supplied; existing screenshot is not evidence for this policy. No unresolved in-scope business decision remains after the owner's explicit choice.

## Migration and owner checks

Owner command: `Add-Migration AddLeaveAutomaticApprovalMarker` (name checked unused in current migration classes).

Generate/review/apply the schema before running the changed application. The new marker defaults false for existing rows without pretending to know their historic decision method. Coordinate with the earlier `AddLeaveDecisionAuditAndRowVersion` work: if not generated yet, the owner can include both coherent Leave additions in one reviewed migration; if already applied, generate this incremental marker migration. Inspect pending unrelated schema changes rather than assuming generated scope.

Manual acceptance after schema/build:

1. Type with no live approvers: create a valid dated request; list shows Approved, details explicitly show automatic acceptance and decision time, no human name/rejection reason and no approval/rejection/edit/delete actions. PUT/DELETE/decision/handleActivate must fail for this Approved row.
2. Type with one/multiple live approvers: new request stays Pending with marker false and no decision audit; existing one-stage manual Approve/Reject still works. Multiple rows do not imply stages or identity enforcement.
3. Deleted approver rows alone do not require approval; inactive-but-not-deleted rows still count. Foreign-tenant rows do not affect another tenant's policy.
4. Invalid/partial/reversed/before-joining/overlapping request or invalid reference: controlled failure, no approved row. Mixed automatic/manual bulk creation obeys the same all-before-mutation validation.
5. Add/remove type approvers after requests exist: their state/marker/audit remain; only new requests use the changed configuration. Pending/rejected edits do not autoaccept when changing to a type with empty configuration.
6. Legacy Approved rows keep marker false and unknown old audit; no invented automatic/human classification. Extra client status/marker/audit JSON must not change the typed Add/Update inputs.
7. Verify EN/AR create/type help and audit, both themes, RTL/narrow layouts, guide navigation and API read mapping. Runtime/appearance/compiler/EF migration/SQL concurrency acceptance remains pending.

Suggested commits, not executed:

- SigmaBackend: `feat(leave): accept new requests without configured approvers`
- SiGmaAngularFrontEnd: `feat(leave): explain and display automatic acceptance`

## Final source verification and user guide

Performed source-only:

- Reviewed complete scoped diffs separately in both actual Git roots, including tracked *Vm.cs casing; earlier validation/decision changes and other dirty vocabulary hunks were preserved and distinguished from this increment.
- Final scoped git diff --check passed in both repositories; no merge markers in the 10 changed application files.
- Read signature/caller reconciliation: exactly one InitializeRequest caller, updated to the explicit requiresApproval input. Marker is present in entity/config/details producer and consumer and absent all write/list DTOs. Existing mapper requires no additional rule.
- Verified public FormSection.description input and its use for creation help; current FormSection/audit shell and shared read text retain layout/scroll/footer ownership. CommonModule already supplies DatePipe. No new framework API, standalone import, runtime file or tsconfig entry needed.
- Verified current Pending-only list/details actions and CanMutate backend/UI exclude automatically Approved rows. Creation returns to the list and authoritative reads show status; endpoints/providers/interceptors unchanged.
- EN/AR Leave block extraction finds 75 leaf keys per language, no path differences. Three new keys approvalPolicyHint, decisionMethod, automaticAcceptance occur once in each block. Existing Check-Translations.ps1 recognizes 23 matching keys and zero missing/case differences across requested leaveReview/leavetype blocks; quoted Leave keys require the separate JSON-block comparison rather than relying on the generic scanner's limited coverage.
- Focused independent backend audit found no concrete defect in single/bulk validation, tenant/live configuration, domain initialization, historical updates, mapping, one-save and approved-state protections.
- Initial and final recipe -Check passed all eight packets. No canonical book/template changes; no packet regeneration required.

The owning in-app guide file is hrm-leaves-topics.ts, covering /Leave and /LeaveType. HRM_GUIDE still imports/spreads HRM_LEAVES_TOPICS; existing sidebar userGuide.hrmMenuEntry links /UserGuide/hrm. Both languages explain no-approver acceptance, explicit automatic audit, one manual stage for configured types and new-request-only configuration effects. No new guide reader or navigation entry.

No builds/tests/lint/database/migrations/snapshots/browser/commits/push/deploy/Graphify/SigmaMCP ran. Compilation, EF materialization/mapping/SQL default behavior, schema deployment, runtime races, guide navigation/RTL/theme/visual/print acceptance remain owner-pending; source checks do not certify a running application.

Agent utilization: root owns backend/domain/contract/report and final reconciliation. leave_auto_approval_ui implemented exactly the five frontend files above; leave_auto_approval_audit inspected backend/direct dependencies read-only and reported no concrete findings. Both used inherited models under the canonical AGENTS delegation gate. Frozen independent file ownership reduced waiting without overlapping edits. All output integrated and reviewed; no cost/usage totals are estimated.
