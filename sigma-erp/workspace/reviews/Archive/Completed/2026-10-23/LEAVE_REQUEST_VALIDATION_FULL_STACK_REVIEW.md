# Leave request validation and state integrity

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-11 |
| Authorization | Owner approved the proposed small Leave slice with «تمام», followed by «كمل» |
| Frozen contract | LEAVE_REQUEST_VALIDATION_CONTRACT_FREEZE.md, including its dated UI reconciliation amendment |

## Outcome and scope

Leave writes now reject overlap with another live Pending/Approved request for the employee across all leave types, and reject start dates before the selected employee joining date. Approved and unrecognized stored states reject edit/delete. UI exposes View only for these states; a direct Edit URL renders read-only data and hides Save. Rejected requests remain editable/deletable, do not reserve dates and stay Rejected after correction.

This implements the approved incremental slice, not the complete HRM policy engine. Country rules, accrual, employee annual entitlement/current balance, leave ledger, approval/rejection/cancellation workflows and payroll effects remain outside this contract. The original screenshot concerns Leave Opening Balance, not a Leave approval workflow; no additional workflow was inferred from it here. Existing stage1 integrity changes and unrelated working-tree changes were preserved.

## Changed files

Backend repository: `F:/My Work/Sigma/SigmaBackend`.

- `SiGma.Business/Services/LeaveService.cs`: common single/bulk write validation and serialized persistence; state-safe delete.
- `SiGma.DataAccess/Configuration/LeaveConfig.cs`: existing LeaveStatus property becomes an EF concurrency token.
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx` and `GeneralMessage.ar-SA.resx`: five new localized messages only: LeaveBeforeJoining, LeaveRequestOverlap, LeaveApprovedLocked, LeaveInvalidBatch, LeaveInvalidInput.

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

- `src/app/modules/HRM/Leaves/Leave/models/list.ts`: strict shared editable-state predicate.
- `src/app/modules/HRM/Leaves/Leave/components/list/list.component.ts`: ActionList visibility/state guards and row re-resolution after delete confirmation.
- `src/app/modules/HRM/Leaves/Leave/components/details/details.component.ts` and `.html`: read-only state, skipped edit lookups for locked records, Save/Edit guards and saved-summary semantics.
- `src/app/modules/i18n/vocabs/en.ts` and `ar.ts`: seven new leaveReview labels/hints and the updated provisionalPolicy explanation.
- `src/app/modules/UserGuide/content/hrm-leaves-topics.ts`: bilingual Leave request topic aligned with these rules.

Resources and vocabularies already contained pending changes for other HRM screens. Their full scoped diffs were read; only the named Leave additions above belong to this slice. Stage these hunks selectively when committing.

## Decisions and contract reconciliation

| Concern | Decision / evidence | Final source |
|---|---|---|
| Active interval | Existing enum Pending=0, Approved=1; rejected does not reserve. Repository.Query applies authenticated tenant and live-row filters; IsActive cannot bypass the check. | SaveRequestsAsync activeRows and otherRequests |
| Overlap | Inclusive comparison From<=other.To and To>=other.From, independent of type. Exclude self/all updated IDs; compare complete batch final state. Adjacent nonshared days allowed. | Persisted query plus employee-group batch comparison |
| Joining | Start>=selected Staff.DateOfJoining calendar date, including staff/date edits. No employment-episode/end-date source inferred. | Staff query and LeaveBeforeJoining |
| Dates | Both dates required for new requests, ordered pair, same day allowed. Existing undated records may remain undated; partial dates and clearing dated history fail. | Scalar and existing-row checks before mapping |
| Edit/delete | Pending/Rejected only; all Approved fields, including Reason, locked. Undefined states fail closed. No resubmission inferred. | CanMutate / leaveCanMutate, backend and UI |
| Bulk | 1–1000 rows, positive references/identities, unique saved IDs; every row validated before mutation; one SaveChanges. Generic bulk writers must not bypass domain rules or overwrite stored values. | AddListAsync/UpdateListAsync share SaveRequestsAsync |
| Concurrency | Existing Staff tenant application lock coordinates participating Leave and Staff writers; tracked reads preserve original LeaveStatus for EF concurrency checks. | ExecuteUniqueWriteAsync<Staff>, AsTracking, LeaveConfig |
| Input contract | StaffId, LeaveTypeId, Reason, FromDate, ToDate; Update adds Id. Status, counters, quota/pay/balance, tenant and number remain server-owned. | Existing Add/Update VMs, frontend payload and one-way maps unchanged |
| Calculations | Backend inclusive calendar-day duration and CurrentlyBooked retained. New MaxLeaves/PendingRejoining use type. Other saved values and update state remain historical. | Existing Leave.InitializeRequest/RecalculateDuration |
| Summary | Preserve eight fields; label duration and saved type/booked/balance values explicitly. Type limit is not annual entitlement; saved balance is not current available balance. | SummaryCard configuration and EN/AR text |
| Error/success owner | Global mutation interceptors present failures/success once. Components restore state and keep row/form on both business and transport failures; reads remain inline. | Existing LeaveService client, save/delete subscriptions and finalize |
| Transaction | Shared write guard owns its transaction. No nested transaction or per-row save. Central middleware maps concurrency/deadlock conflicts to localized HTTP409. | UnitOfWork and registered AccountingConfigurationExceptionMiddleware |

Grid columns remain No, Staff, Leave Type, From, To, Days, Status. Frontend LeaveDTO/backend LeaveListVM remain id, no, staffName, leaveTypeName, fromDate, toDate, noOfLeaves, leaveStatus, pendingRejoining: id identifies actions; pendingRejoining supports the existing state/filter contract. No grid, filter, paging, sort, export or dashboard response change.

Details retain all existing DTO fields and eight summary values. Routes remain /Leave, /Leave/create, /Leave/view/:id, /Leave/edit/:id and /Leave/dashboard. POST/PUT/DELETE and inherited detail/list reads are unchanged. API JSON uses existing numeric enum serialization, matching the strict frontend predicate. No permission API was introduced: state locks protect the domain and do not establish role authorization.

## Shape and reference conformance

Backend shape: canonical normal entity with feature-owned interval/state rules (BE5/8/13). UI: existing ordinary list and routed record editor, not an aggregate/financial-document redesign.

| Concern | Book / approved reference | Shared owner | Final comparison |
|---|---|---|---|
| Validation / localized failures | BE8/13, BranchService.AddAsync/UpdateAsync/RemoveAsync | Repository.Query and Service.InvalidInputAsync/BusinessFailure | Existing reference checks retained, plus scoped date/state/interval rules before mutation |
| Delete | BE8, existing RemoveWithChildrenAsync | Service.MarkRemovedAsync and repository tenant protection | Leave state checked first; inherited dependency-safe removal reused |
| Serialized writes | BE8, current StaffService writers | UnitOfWork.ExecuteUniqueWriteAsync | Same Staff tenant resource, no new lock helper or local SQL |
| List action cycle | UI7, WorkShop/Job/components/list/list.component.ts confirmDelete/actions | ActionList, DataTable, ConfirmationDialogService, mutation interceptors | visible for permanent domain availability; busy disabled and callback guards; latest row checked after confirmation |
| Routed read-only editor | UI15 and existing Leave routed editor | FormGroup.disable, sigma-field__read, shared footer/control owners | Whole form disabled, read text, Save absent, no edit-only lookup warnings for locked records |
| Shell / summary | UI1/3/24, Job list/editor shell and existing Leave editor | styles.scss, FeatureTitle, FormSection, SummaryCards | Existing scroll/footer/shell kept; dense/row/min140 and eight cards retained; no new styles/components |
| Feedback | UI22 | Global mutation success/error interceptor; apiErrorMessage for reads | No duplicate feature toast, no swallowed transport error, input values restored |
| Guide | Master7 | Existing UserGuide reader and HRM_GUIDE | Existing bilingual /Leave topic extended; no second reader or sidebar entry |

No shared extraction qualifies: this is Leave-specific state/interval logic and all presentation uses existing shared owners. References were inspected but not changed. The contract amendment records UI7's required visible-state semantics before the final visibility change, preserving the earlier frozen record.

## Override justification and action inventory

| LeaveService override | Ownership / reason |
|---|---|
| ApplyListFilters | Existing Leave interval and status filters, retained |
| ApplyListOrder | Existing navigation-name sorting, retained |
| MaterializeListAsync | Existing trimmed list projection, retained |
| AddAsync / UpdateAsync | New date/state/overlap validation and common Staff guard before a single save |
| AddListAsync / UpdateListAsync | Apply identical rules to bulk entry points; preserve tracked saved snapshots; avoid generic mapper/range bypass |
| RemoveAsync | Re-read allowed state inside common guard, then reuse dependency-safe deletion |

Controller remains generic with the existing dashboard action; no redundant controller/read overrides. Existing AutoMapper profiles remain one-way, with no added Ignore/ReverseMap. Common writer dispatches the runtime input VM into a tracked existing entity or a fresh Leave.

Supported actions: Create, View, Edit Pending/Rejected, confirmed Delete Pending/Rejected, Search, Reset, paging, sort, Excel, dashboard navigation. View/locked Edit routes allow Close; mutable editors retain dirty-discard confirmation. Delete rechecks backend state, preserves row on failure, steps back after last-row deletion and refreshes applied results. Approve/reject/cancel/resubmit/financial posting/activation/print or Job-specific actions are not part of this Leave screen contract and were not added.

## Phases and verification

Phase0/PLAN00 scoped existing-state discovery and alternatives; Phase1 frozen amendment; Phase2 model/action alignment only; Phase3 editor/write; Phase4 state-safe deletion; Phase5 unchanged-route/provider/interceptor reconciliation; Phase6 complete source diff review and guide gate. Grid redesign, uploads, new financial/state transitions and database cleanup were skipped because the contract excludes them.

Performed source-only checks:

- Identified both Git roots and read complete scoped diffs separately, including pre-existing resource/vocabulary hunks without altering them.
- Final git diff --check passed for all changed application files; merge-marker searches returned no matches (rg exit1 here means no matches).
- Both resource files parse as XML with no duplicate names and all ten LeaveService failure keys present.
- All eight touched scoped presentation keys exist in EN/AR; existing imported helper, ActionList optional-row callbacks, SummaryCard inputs, form controls and route/mode names reconciled with their source declarations.
- Initial and final recipe checks passed all eight packets; no canonical book/template edits or regeneration required.
- Source traces reviewed same-day, shared-boundary, adjacent-day, across-type, rejected, self-update, bulk final-state, unknown-status and legacy-undated behavior. These are source traces, not executed tests.

Runtime/build/database/browser/visual checks remain owner-pending. No builds, tests, lint, migrations, snapshots, DB commands, browser automation, commits, pushes, deployments, Sigma MCP or Graphify were run.

## User guide handoff

Content: `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/hrm-leaves-topics.ts`, topic route /Leave (leaveReview.title). HRM_GUIDE imports and spreads HRM_LEAVES_TOPICS. Existing guide reader route /UserGuide/hrm resolves section hrm, and sidebar-menu-data.ts retains the userGuide.hrmMenuEntry link. The topic covers creation/view/edit/delete, direct edit locks, joining-date and overlap validation, rejected semantics, saved-summary limits, dates, paging/export and dirty navigation in both languages. Source conformance checked; reading/navigation/RTL/theme/print acceptance pending.

## Migration, limitations and owner acceptance

No Add-Migration is required for this slice: only existing LeaveStatus concurrency metadata changed; no property/nullability/type/max-length/index/relationship/column schema change. No migration or model snapshot was touched. Previously reported Attendance schema work remains a separate owner action.

Concurrency protection covers writers participating in the shared guard. Future approval/cancellation/import writers must use it and validate the resulting intervals; arbitrary SQL is not covered. No retrospective repair of legacy overlaps or employment-date inconsistencies was performed. Joining-date validation runs on Leave writes; this slice does not redesign Staff history or country-specific absence calendars. Compiler and SQL translation are unverified until owner build/runtime acceptance. Bulk safety currently retains per-row canonical InvalidInputAsync reference checks as well as batched domain queries.

Owner verification scenarios:

1. Build both repositories under the owner's normal workflow, then open /Leave in EN/AR.
2. Same-day request on/after joining succeeds as one day; before joining, reversed dates, partial dates and invalid/deleted/other-tenant references fail.
3. Pending request 10–12 blocks 12–14 and enclosed/crossing periods, including another type. 13–14 is allowed; another employee is independent.
4. An Approved interval blocks overlap. A Rejected interval does not; editing it keeps Rejected.
5. Saving an unchanged Pending interval excludes itself. Moving staff/dates checks the selected employee's current joining date and other requests.
6. Approved/unknown rows expose View only; direct Edit URL shows read-only fields, lock note and Close, without Save or dropdown requests. Direct PUT/DELETE rejects the state.
7. Change a request state concurrently with an edit/delete and verify a conflict instead of overwriting the state. Send concurrent overlapping adds and confirm only one is saved.
8. Through existing service-level bulk consumers, verify duplicate IDs, internal overlap, overlap with existing rows and one invalid row reject the whole batch; swapping nonoverlapping final intervals succeeds. No new public bulk route was created.
9. Existing both-null dates remain preservable; new undated requests and clearing previously dated requests fail. Old summary/pay/balance fields stay intact.
10. Verify failed mutation preserves input/row and clears busy state; confirmation cancellation sends no delete; successful last-row deletion refreshes the previous page; filters/sort survive navigation.
11. Verify saved labels, missing current entitlement/balance explanation, /UserGuide/hrm links, narrow layouts, RTL, themes and guide print.

Suggested commits (not executed):

- SigmaBackend: `fix(leave): enforce dates overlaps and approved request locks`
- SiGmaAngularFrontEnd: `fix(leave): align request actions and clarify saved summaries`

Apply these messages only to the file/hunk scope listed above. Review records live outside the application repositories under reviews and were not committed.

Agent utilization: bounded frontend worker leave_ui_validation (gpt-5.6-sol) was assigned after freeze to reduce independent frontend/backend wall time; model usage limits prevented it from starting. No worker edits were integrated. Root implemented and reviewed both workstreams locally; no further delegation was needed.
