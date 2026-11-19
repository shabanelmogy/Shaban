# Leave approval and rejection workflow

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-11 |
| Authorization | Owner «تمام نفذ» |
| Contract | LEAVE_DECISION_WORKFLOW_CONTRACT_FREEZE.md, including dated integration amendments |

## Result and business decisions

Pending Leave requests now support one-stage Approve or Reject from the list and View details. Approval revalidates complete ordered dates, live tenant staff/type, joining date and inclusive overlap across leave types. Rejection requires a trimmed nonblank reason up to 1000 characters, separate from the employee's request Reason. The backend records the authenticated username and UTC DateTimeOffset; it never accepts actor or time from the client. A generated rowversion rejects decisions and updates against an older viewed request. Successful decisions return current detail data and a fresh token.

One stage is the smallest source-supported extension under the owner's delegated implementation. Existing LeaveTypeApprover says it is ordered configuration only, not approval authorization; the app has no confirmed current-user-to-Staff approval identity contract. Sequential approval, role-specific restrictions, cancellation, resubmission, reversal and financial/leave-ledger effects were not created. API access retains inherited authentication and tenant scoping. Approve/reject are authorization candidates for a future real permission system; hiding a control is not authorization.

Prior frozen Leave policy permits correcting/deleting Rejected requests and explicitly retains Rejected state. That exception to the generic terminal-rejection reference is preserved. Corrections keep the previous decision metadata; they do not resubmit, reapprove or overwrite the rejection reason. Approved and unknown states reject all supported scalar mutations, including inherited handleActivate. IsActive does not cancel a Leave or bypass overlap.

Old decision actor/time/reason stay null rather than being fabricated. Details label the fields Last recorded decision and explain the historical meaning for corrected rejected requests. The original Leave Opening Balance screenshot proves no approval sequence or actor binding; this slice follows the later explicit owner request and current source instead.

## Files changed

Backend repository: `F:/My Work/Sigma/SigmaBackend` (13 files).

- `SiGma.Helpers/Models/Staffs/Leave.cs` — nullable DecisionAt, DecisionBy, RejectionReason and generated RowVersion.
- `SiGma.DataAccess/Configuration/LeaveConfig.cs` — new field limits and rowversion configuration; prior status concurrency protection retained.
- `SiGma.ViewModels/ViewModels/Leave/LeaveListVm.cs`, `LeaveDetailVm.cs`, `LeaveUpdateVm.cs` — read token/audit fields and mandatory expected update token.
- New `SiGma.ViewModels/ViewModels/Leave/LeaveApproveVM.cs`, `LeaveRejectVM.cs` — typed decision inputs.
- `SiGma.Business/MapperConfig/LeaveProfiler.cs` — ignore generated RowVersion on update mapping only.
- `SiGma.Business/IServices/ILeaveService.cs`, `SiGma.Business/Services/LeaveService.cs` — actions, actor dependency, common guard and version/state validation.
- `SiGma.ServerAPI/Controller/LeaveController.cs` — exact typed POST endpoints using ToActionResult.
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx`, `GeneralMessage.ar-SA.resx` — seven decision/version messages.

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd` (16 files).

- `src/app/modules/HRM/Leaves/Leave/models/list.ts`, `details.ts`, `create.ts`; new `models/decision.ts`.
- `src/app/modules/HRM/Leaves/Leave/services/leave.service.ts`.
- `src/app/modules/HRM/Leaves/Leave/components/list/list.component.ts`, `.html`; `components/details/details.component.ts`, `.html`.
- New `src/app/modules/HRM/Leaves/Leave/components/rejection-dialog/rejection-dialog.component.ts`, `.html`.
- `src/app/modules/HRM/Leaves/Leave/leave.routes.ts` — list pending-action exit guard.
- `src/app/modules/i18n/vocabs/en.ts`, `ar.ts` — scoped decision/reload texts.
- `src/app/modules/UserGuide/content/hrm-leaves-topics.ts` — owning bilingual topic.
- `tsconfig.app.json` — two explicit new runtime entries, retaining the existing files-list pattern.

LeaveService/config/list/details/model/guide already contained the prior validation slice. Shared resources and vocabularies also contain other pending HRM work. Those changes were preserved; this task adds only the decision/token changes described here. Complete scoped diffs were reviewed separately in each repository. New untracked files were read directly because git diff does not include them.

## End-to-end action contract

| Action | Source -> target | Endpoint / input | UI / refresh | Backend boundary |
|---|---|---|---|---|
| Approve | Pending0 -> Approved1 | POST Leave/{id:int}/approve, {rowVersion} | Shared named-record confirmation; captured state/version recheck; same applied list/page or details reload | Tenant/live row, 8-byte expected token, actor, FK/date/joining/overlap, common Staff guard, one save |
| Reject | Pending0 -> Rejected2 | POST Leave/{id:int}/reject, {rowVersion,reason} | Shared EditorDialog typed form, required trimmed reason, controlled dirty discard; successful close refreshes owning surface | Same state/version/actor guard; required reason <=1000; separate rejection metadata, one save |
| Update | Pending/Rejected unchanged | Existing PUT plus rowVersion | Existing typed form sends viewed token; failed input is preserved | All batch tokens checked before mapping; prior FK/date/state/overlap checks retained |
| Delete | Pending/Rejected -> existing removal | Existing DELETE | Existing confirmation, same-page/last-page recovery | Existing dependency-safe removal under Staff guard; Approved/unknown blocked |
| handleActivate | Pending/Rejected flag only | Existing inherited POST/ActiveVm | No new UI control | Entire ID/state batch validated before inherited scalar mutation; Approved/unknown blocked, tracked original token retained |

Repeated decisions, terminal/unknown states and stale versions fail; no blind retry, silent token refresh or double decision. Global mutation interceptors own success/error feedback once; feature callbacks handle both isSuccess:false and transport errors, retain recoverable state and release busy/loading in finalize. Navigation is blocked during decisions/dialogs; rejection draft close uses the existing shared discard confirmation. View details exposes Reload request for deliberate stale-input recovery, while editable modes keep their dirty-input protection.

## Producer/consumer reconciliation

| Concern | Final evidence / outcome |
|---|---|
| Grid / list VM | Columns remain No, Staff, Type, From(date), To(date), Days(number), Status. Frontend LeaveDTO/backend LeaveListVM fields: id,no,staffName,leaveTypeName,fromDate,toDate,noOfLeaves,leaveStatus,pendingRejoining,rowVersion. Token is required for row actions and is not a grid/export column. |
| Detail / forms | Existing details and eight summary values retained. New rowVersion plus decisionAt,decisionBy,rejectionReason match the readonly audit. Add inputs unchanged; Update adds expected rowVersion only. Neither ordinary writes nor actions accept actor/time/status/pay/balance inputs. |
| Serialization | byte[] rowVersion -> base64 string. DecisionAt DateTimeOffset keeps UTC offset on reads. Numeric LeaveStatus matches the existing frontend enum and default API serialization. |
| Reads | Existing generic detail and list projections map new ordinary properties; dashboard recent/upcoming also use LeaveListVM and receive rowVersion automatically. No redundant read/controller overrides. |
| Mapping | Existing one-way maps retained. The one Ignore protects generated RowVersion because Update now carries an expected token. Version is checked and assigned to EF OriginalValue before save, never written into CurrentValue by the mapper. |
| Calculations | Inclusive calendar duration remains backend-owned; Approve recalculates only after all validation. Stored type limit, payment allocation/balances remain unchanged. Approval does not compute or consume annual entitlement. |
| Persistence | Existing Staff tenant application lock is shared by add/update/bulk/delete/decision/activation. One save per write/action; no nested transaction. Existing middleware handles rowversion/status conflicts as localized HTTP409. |
| Actor / DI | LeaveService adds IHttpContextAccessor; existing DependencyResolver registers it. Security token source emits ClaimTypes.Name. Missing/oversized/non-authenticated actor fails401; no System fallback or client-supplied approver. |
| Routes / providers | Existing list/create/edit/view/dashboard routes remain. Added list canDeactivate guard prevents dialog/action abandonment. Services keep root injection and the existing interceptor-equipped HttpClient. |
| Lookup / audit UI | Locked View/Edit records use names from details and skip edit-only lookups. New audit is read text using existing FormSection/shared field geometry; CommonModule supplies DatePipe. |

## Reference, override and phase reconciliation

The frozen contract records selected shapes and reference concerns. Backend remains canonical normal entity with explicit domain transitions (BE5/8/12/13/15). UI is the existing routed record plus screen09 action dialog; no replacement CRUD/page architecture.

- JobEstimation ChangeApprovalStatusAsync provides the pending-to-target reference. Its AddLog/GetLogs/CreateJob and workshop options/search operations are Not Applicable: Leave has no workshop job/invoice/log-input aggregate. New Leave actions have a complete interface/controller/service/client/state/UI/recovery slice.
- Job close-job's shared EditorDialog/action lifecycle is reused for shell, translated title and smaller record subtitle, dirty close and busy handling. Vehicle/charges/invoice/financial close fields are Not Applicable. New rejection selects public width560/contentPadded, shared sigma-editor-scroll/fields, FieldError, FormGroup and freezeFormState; no bespoke CSS.
- Shared ConfirmationDialogService/UI9 owns approval confirmation. ActionList.visible owns domain availability; disabled owns busy state. Existing DataTable/shell and summary dense/row/min140 configuration are retained.
- Existing LeaveOpeningBalance rowversion entity/config and Staff/Leave guard are concurrency evidence; Payroll actor/time source confirms server ownership. The stricter missing-name failure is recorded in the frozen contract.

Override audit: existing ApplyListFilters/ApplyListOrder/MaterializeListAsync remain for domain filters/navigation ordering/trimmed projection. AddAsync/UpdateAsync/AddListAsync/UpdateListAsync remain justified by domain validation, now with expected-version checks on updates. RemoveAsync preserves state/dependency protection. New HandleActiveAsync adds the required approved-state lock, then inherits the flag mutation. ApproveAsync/RejectAsync are explicit domain methods, not redundant generic overrides.

Phase0 scoped existing-state/identity/reference discovery and alternatives; Phase1 freeze; Phase2 action/read-model alignment; Phase3 update/audit/reason form; Phase4 decisions and inherited activation protection; Phase5 route/DI/interceptor integration; Phase6 complete scoped source/guide reconciliation. Financial posting, uploads, sequential approval, ledger and payroll phases are excluded by contract. No shared extraction qualifies beyond reusing the rejection component in both owning surfaces: all shared presentation/feedback/confirmation owners are already consumed.

## Verification performed and pending

Performed source-only:

- Reviewed complete scoped diffs in both Git roots and directly read new DTO/model/dialog files; corrected the VM path casing in Git pathspecs to include tracked *Vm.cs files.
- Final scoped git diff --check passed; merge-marker scans found no matches.
- Both resource files parse as XML without duplicate names; all 19 directly required Leave message keys are present (seven keys added this slice).
- EN/AR Leave vocabulary blocks each have 72 leaf keys with no path differences after the root Reload addition. The generic translation script did not understand this existing quoted-key block, so explicit JSON-block comparison provided the evidence.
- Public EditorDialog/ConfirmationDialog/FieldError inputs, standalone imports, optional ActionList row callbacks, DTO fields and exact endpoint payloads checked against source. Explicit runtime file entries exist without widening application compilation to specs.
- Initial and final recipe -Check passed all eight packets. No canonical books/templates changed, so no regeneration required.
- Focused independent backend audit found no actionable defect in state/version/identity/result/persistence paths. Follow-up confirmed inherited activation reuses already tracked instances and original concurrency values.

No builds, tests, lint, migrations, snapshots, database commands, browser/application verification, commits, pushes, deployment, Graphify or Sigma MCP ran. Source conformance does not certify compilation, SQL translation, UI appearance or runtime races; those remain owner acceptance.

## Required migration and compatibility

Owner command: `Add-Migration AddLeaveDecisionAuditAndRowVersion` (suggested class name checked unused).

New Leave schema fields are nullable datetimeoffset DecisionAt, nullable nvarchar250 DecisionBy, nullable nvarchar1000 RejectionReason and generated SQL Server rowversion RowVersion. No existing audit values can be inferred reliably; leave them null. Generate/populate rowversion for existing rows and verify 8-byte tokens in list/details. No migration or model snapshot was created or changed by the agent.

Apply the reviewed migration before running the new code: the new projection/writer expects these columns. Update clients must now return the viewed token; older tokenless clients intentionally fail rather than overwriting newer data. Because the workspace already has pending schema work from earlier slices, inspect the generated migration and reconcile that existing work with the owner's migration plan rather than assuming the generated diff contains only this feature.

Country policy, available balances and sequential staff authorization remain explicitly unavailable. No in-scope Missing/Conflicting contract remains; these are future-work exclusions. Application-lock protection covers participating writers; direct external inserts can still bypass interval invariants, while SQL rowversion protects stale updates of the same row.

## User guide and manual owner checks

Updated `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/hrm-leaves-topics.ts`, /Leave topic keyed leaveReview.title. HRM_GUIDE imports/spreads HRM_LEAVES_TOPICS; existing reader section hrm resolves /UserGuide/hrm and sidebar-menu-data.ts retains userGuide.hrmMenuEntry. EN/AR steps describe Approve/Reject, reason, prior decision fields, Search/Reload request recovery, one stage, corrected rejected semantics and unavailable financial/sequential workflows. No duplicate reader/menu was introduced. Navigation/RTL/theme/narrow layout/print acceptance pending.

After owner migration/build:

1. Create a Pending request, open View and list actions, approve once: confirm status, current username, UTC timestamp and fresh rowversion; Approved permits View/Reload/Close and denies PUT/DELETE/handleActivate.
2. Reject with whitespace/missing/over1000 reason: fail without mutation. Valid rejection stores a separate trimmed reason and actor/time; employee Reason is unchanged.
3. Correct a Rejected request using its current token: it stays Rejected and retains prior decision metadata. Another decision is unavailable/rejected; no resubmission implied.
4. Change a Pending request in another session after loading it, then approve/reject/update with the old token: conflict, no overwrite. Use Search or View Reload request and review before retrying.
5. Send concurrent approve/reject/edit/delete and confirm only a legal current-state write succeeds. Attempt generic activation on a mixed Pending/Approved batch: the whole operation fails before mutation.
6. Approval rejects missing/partial/reversed dates, before-joining dates, invalid/deleted/other-tenant references and legacy overlap with another type. Same-day duration is one; self is excluded; rejected periods do not reserve dates.
7. Bulk update with one stale token fails the entire batch. Existing inclusive dates, preserved stored summary/pay/balance values and undated legacy edit rules remain intact.
8. Verify repeated clicks/confirmation/dialog/sidebar navigation cannot duplicate or abandon a pending decision. Both failure channels release loaders and retain row/form/rejection reason; cancel sends no mutation and dirty close requires discard confirmation.
9. Approve the final Pending-only filtered row on a later page: refresh retains applied filters/sort and recovers the previous valid page. Dashboard recent/upcoming still display correctly; Excel excludes tokens.
10. Legacy approved/rejected rows show unknown audit as empty, without invented names/times. Missing authenticated username fails safely. Audit labels/guide/reload control read correctly in EN/AR, RTL and both themes.

Suggested commits, not executed:

- SigmaBackend: `feat(leave): add audited approval and rejection with version checks`
- SiGmaAngularFrontEnd: `feat(leave): add decision actions and rejection dialog`

Stage only listed scoped files/hunks; resources/vocabularies contain other pending changes. Review artifacts are local unversioned files under reviews.

Agent utilization: root owned backend/contract/integration/report. One frontend worker leave_decision_ui and one focused read-only backend auditor leave_decision_backend_audit used inherited models without overrides. Independent frontend/backend work reduced waiting without overlapping file ownership; the auditor reused its context for the activation follow-up. All worker changes were integrated and reviewed; root added explicit Reload recovery and activation protection. No model usage/cost totals were supplied, so none are estimated.
