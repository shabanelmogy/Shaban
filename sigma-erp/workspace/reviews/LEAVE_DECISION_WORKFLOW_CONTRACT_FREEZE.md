# Leave approval and rejection — incremental contract

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-11 |
| Authorization | Owner «تمام نفذ» approves the proposed approval/rejection slice |

## Scope and selection

Extend existing Leave service/controller, list and routed editor. Keep prior request validation and historical records. User requested recording decision actor/date/rejection reason and revalidation at approval. Reviewer decision under delegated implementation: one final approval stage, the smallest source-supported extension. LeaveTypeApprover explicitly remains ordered configuration only; no reliable current-user-to-Staff binding exists. A configured sequential workflow would require that identity contract and new intermediate states; it is excluded. Existing authenticated tenant operators use these actions, as in current operational approval patterns. No invented role/permission API; state visibility is not security.

No cancellation, resubmission, unapproval, automatic entitlement/balance/ledger/payroll effect or legal-country policy. Earlier Leave contract explicitly permits Rejected edits/deletes and keeps rejection state: preserve that exception to generic terminal-rejection guidance. Correcting Rejected is not a new application and does not erase its prior decision metadata.

## Frozen contracts

| Concern | Target |
|---|---|
| States | Pending0 -> Approved1 or Rejected2 only. Repeated/stale/terminal action fails HTTP409. Undefined states fail closed. No reverse transition. |
| Persistence | Add nullable DecisionAt UTC, DecisionBy max250 and RejectionReason max1000 to existing Leave, plus generated SQL Server RowVersion. Legacy decisions remain unknown/null, never fabricated. No audit timestamps from client. |
| Version | byte[] RowVersion serializes as base64 string. Existing list/detail return it; Update requires an 8-byte token and excludes it from AutoMapper assignment. Approval/rejection token must match current tracked row before validation/mutation. SQL rowversion protects nonparticipating scalar races; common Staff tenant lock protects cross-request interval races. |
| Approve | POST Leave/{id:int}/approve, body {rowVersion}; re-read tenant/live record Pending, check dates, staff/type live references, joining date and overlap with live Pending/Approved requests across types excluding self. Recalculate inclusive duration only after validations. Set status/audit and save once. |
| Reject | POST Leave/{id:int}/reject, body {rowVersion,reason}; Pending only, required trimmed nonblank reason <=1000, actor from authenticated Identity.Name, timestamp server UTC. Do not alter request Reason or dates/pay/balances. |
| Actor | Backend derives current authenticated Identity.Name, nonblank <=250. Missing actor fails closed rather than inventing System/choosing an approver from the client. NameIdentifier is tenant identity, never actor identity. |
| Response | Result<LeaveDetailVM> with fresh rowversion and decision metadata after success; standard ToActionResult errors and global mutation feedback. |
| Existing writes | All single/bulk updates check current token before any mapping; keep previous state/date/FK/overlap rules and one save. Approved immutable; Rejected remains correctable without resubmission. Existing DELETE state/dependency boundary stays unchanged. |
| Read model | Add RowVersion to list solely for action concurrency. Detail adds RowVersion/DecisionAt/DecisionBy/RejectionReason because UI shows audit. Add DTO unchanged. Update adds RowVersion only. Audit fields excluded from Add/Update. |
| UI | Pending rows/details expose Approve and Reject. Approve uses shared confirmation; Reject uses typed reason form in shared EditorDialog, retaining reason on failures with controlled dirty close. Details actions available in View; edit users save/close first. UI sends the viewed token, never silently refetches before deciding. |
| Busy / refresh | Prevent duplicate dialog/action, disable navigation/mutation while deciding; recheck row identity/state/token after approval confirmation. List successful action refreshes same filters/page (step back if filter removal empties page). Details reload current result/data, preserve query params. Both failure channels preserve state and clear busy. |
| Guide | Extend existing bilingual /Leave topic in HRM_LEAVES_TOPICS and /UserGuide/hrm; describe one stage, reason/audit, stale-state reload, preserved Rejected corrections and unavailable sequential/financial effects. |

Grid unchanged: No/Staff/Type/From/To/Days/Status. ListVM existing id,no,staffName,leaveTypeName,fromDate,toDate,noOfLeaves,leaveStatus,pendingRejoining plus rowVersion. Filters/paging/export/routes unchanged. RowVersion is not an exported column. Eight existing summary cards retained.

## Shape/reference and conformance before edits

Use sigma-screen-refactor, Master4/5/7; BE2/3/4/5/6/8/12/13/15; UI7/9/10/13/15/19/22/23/26/28; screens02 routed record and09 action dialog. Initial eight recipe checks passed. Phase0/1 freeze precedes implementation; phase2/3/4, integration5 and reconciliation6 follow.

| Concern | Reference / owning block | Shared owner | Target |
|---|---|---|---|
| Domain transition | Existing JobEstimation approval, BE8/12 | BusinessFailure, ToActionResult | Explicit Pending->target, one save, no reverse action |
| Concurrency | Existing rowversion entity/config in LeaveOpeningBalance; existing Leave/Staff common guard, BE8/15 | UnitOfWork/EF | Generated token plus same Staff guard, no nested transaction |
| Actor/time | PayrollRunService Actor/ApproveAsync, BE5 | IHttpContextAccessor/UTC server clock | Derive name, reject missing identity instead of System fallback |
| Confirmation | UI9 shared ConfirmationDialogService.confirm | Shared dialog | Approve yes/no once; name record and preserve token |
| Reason form | UI screens09; WorkShop/Job/components/close-job and shared EditorDialog declarations, UI13/19 | EditorDialog/FormGroup/FieldError/ConfirmationDialogService | Small typed reason dialog, 560px public width, shared shell/fields; no bespoke CSS |
| Actions | UI7 and Job list ActionList/confirmDelete | DataTable/ActionList | State visible, transient busy disabled, global single toast |
| Routed editor | Existing Leave / Job editor shell, UI15 | Shared form/read text/footer | Existing route and summary preserved; audit as read text, no input audit fields |

Reference actions: approval state change supported as explicit Approve/Reject. Job close supported only as action-dialog interaction reference; invoice/charges/vehicle/financial close behavior Not Applicable. No other Job/quotation/Payroll operation copied. Inherited CRUD retained except existing domain overrides and version validation extension. DI adds IHttpContextAccessor through existing registered container; no new auth/client provider.

## Schema and ownership

Owner must generate `Add-Migration AddLeaveDecisionAuditAndRowVersion` after source handoff; new audit columns nullable, rowversion generated for existing rows. Agent must not create/run migrations or change snapshots. Existing decisions cannot be backfilled honestly; keep null. Builds/tests/lint/DB/browser/commits/push/deploy/SigmaMCP/Graphify prohibited under current task; source checks only.

Root owns backend entity/config/VM/profile/interface/controller/service/localization and final report. One bounded frontend worker owns only Leave frontend components/models/service, scoped EN/AR vocabulary, guide and explicit tsconfig.app runtime entries if needed. Preserve all existing user/peer edits; no overlapping files. Model quota prevented prior worker; use inherited model if delegating rather than repeating that failed override.

## Integration amendment — 2026-10-11

Use nullable DateTimeOffset for DecisionAt so stored UTC offset survives API reads. Root adds a visible Reload request control in View details using the existing retryDetails method, allowing an explicit review of changed inputs after a version conflict. It is disabled while busy and absent from editable modes so reload cannot discard unsaved inputs. Guide/EN/AR recovery text names that control.

The inherited handleActivate endpoint is also a scalar writer. Protect Approved/unrecognized states there under the same Staff guard; retain inherited validated flag mutation for Pending/Rejected only. No activation control is added to the UI and changing IsActive never cancels a Leave or bypasses overlap. This closes a direct API edit path rather than adding a workflow.
