<!-- Part of UI block 7: see ../07-action-button-cycle.md. Same status and authority as the block. -->

### Shared document approval status
For an adopted business-document row, reuse `injectApprovalStatusAction<Row>`
from `shared/authorization/approval-status-action.ts`. It accepts the catalog
document type, the actual source read requirement, a current-row predicate and
the screen's busy predicate. It validates a positive saved identifier and
rechecks access, row ownership and busy state when invoked. Nullable or string
identifiers are accepted only when they resolve to a safe positive integer.
Pass the persisted document identifier for an aggregate or prepared operation.

The helper opens `DocumentApprovalStatusDialogService` in the current screen,
using the shared `EditorDialog` and `DocumentApprovalWorkflowPanelComponent`.
The panel consumes the existing central workflow endpoints and delegates stage
presentation, confirmation, reason validation, write state and refresh to
`DocumentApprovalCycleComponent`. Reading stages requires the source read grant.
The server controls current-stage decisions. Direct
policy/workflow reads keep dialog-local progress and no additional cache.

An existing native status dialog embeds the same workflow panel and retains
its native action owner. Combine native and workflow pending state. A successful
workflow write emits `changed`; an ordinary read emits only `pendingChange`.
The panel's `refreshKey` can follow the loaded native record to refresh stages
after a native action. Do not trigger a native reload from every read completion.
The host owns display lifetime and destruction, while the central endpoints
continue enforcing source, assignment, branch and expected-attempt versions.

**Inline stage decisions.** Display configured/current stages
as shared DataTable rows with order, name, status, actor, decision date and reason.
Use ActionList on the eligible row, checking both the response-wide capability
and that row's `canDecide`, current row identity, access and busy state. Keep later
stages visible without actions. The status viewer has no separate Start step or
required workspace navigation; the first decision uses the server's preview
version and expected stage order under the approval feature contract. Reading
never creates an attempt. Retain one approval confirmation and the rejection
reason form; collapse nonempty decision history separately.

For feature-authorized stage reversal, use the same row ActionList and server
`canUnapprove` capability. Bind the required reason draft to both its selected
row and workflow version, recheck access before submission, and expire stale
row capability. Reuse the decision response and clear native action capabilities
that no longer hold after reopening a level. Source effects, sequence guards and
who may reverse remain in the feature's frozen contract, enforced by the server.

Apply the authoritative workflow mutation response to the stage rows. A workflow-only
viewer does not reload the same workflow after success. Native document owners
may refresh once when completion changes their available native action; do not
re-read stages solely because a refreshed native DTO has a new object identity.
Use a semantic native status/void refresh key. Context/access changes and explicit
Retry still invalidate reads; sent-write lifetime and accounting effects remain
with their existing owners.

**Single direct action.** DataTable exposes
`singleActionAsIcon:boolean` (default false) and forwards it to the existing
ActionButton input of the same name. When enabled and exactly one action is
visible for a row, render its icon as one native Sigma secondary icon button,
with a translated title/aria-label and the current disabled predicate. Zero
visible actions render nothing; multiple actions keep the existing menu.
Direct clicks and menu commands call the same execution method, which rechecks
action membership, visibility and disabled state before invoking its callback.
Native Enter/Space behavior applies to the direct button; it declares no popup
semantics. Actions remain outside exported data and hidden in print.

The owner explicitly requested the sole View eye button in Workshop Vehicles'
Recent Movements table. That consumer enables the shared input; default menu
consumers keep their existing interaction. Do not add a feature action template,
rebuild columns or duplicate action guards to obtain this presentation. Check
zero/one/multiple visible actions, changing busy state, both languages/themes
and keyboard/focus behavior; source-only checks are not visual acceptance.

Existing native/PrimeNG table cells that have not yet adopted DataTable may
embed the same app-action-button with its optional row input and typed
moreActions. It renders the same exported template locally; DataTable omits
row and keeps its existing template-export contract without duplicate buttons.
This is a bounded compatibility path, not permission for feature-owned Menu
copies or a second action style. Callbacks receive the actual row, never its
visual index (Settings Fines/ESalik/EDarb runtime retirement,2026-10-22).


### Approval status in the action menu and saved editor

**Source conversion actions.** Use the existing shared
row action owner and PrimaryActionButton in saved View for Create Receipt or
Create Invoice. Consume the server's target-specific eligibility flags in both
surfaces and pass only the source identity through the destination's typed
entry; a frontend type test alone is not availability or capacity authority.
Reuse the destination's editor, controls, source preview, errors/retry and
save lifecycle. Lock source-owned fields, keep requested quantities/accounts
editable according to its contract, and preserve drafts on refresh/cancel.
Never create a second editor or locally synthesize source completion.
PO uses canCreateGrn for Stock/Asset and canCreateBill for General/Job under
the frozen downstream-creation contract; no action appears when capacity is
exhausted or needs review. Domain/type decisions and stock/financial effects
remain backend/model owned.

**Independent document progress.** Show approval,
source quantity use, invoice coverage, draft reservation and payment settlement
under their own labels. Open/Closed/Partially Used do not imply Approved or
Paid; a pending invoice reservation is not Invoiced. Consume authoritative
source-line progress in both displayed badges and server filters/count/export,
never derive the meaning from row names or a page-local sum. Use the shared
read-only document-log viewer for a model after its source/child identity and
capture/read contract are frozen. Existing model actions and their financial
guards remain authoritative; missing progress must be unavailable/Needs Review
rather than fabricated. Exact per-model statuses stay in the feature handoff.

> **Canonical presentation for models with a confirmed approval lifecycle**
>.

Expose an **Approval Status** row action that opens a dedicated modal showing
the saved record identifier, current step, completed/incomplete/rejected state,
and actual persisted decision history. Keep an Approval tab in the saved
editor for the same information. Both surfaces read the same server-owned
approval status/history and `can*` eligibility; where the model's frozen
contract permits decisions, show eligible Approve/UnApprove/Reject in both and invoke the same
typed transition endpoint. Confirm risky decisions through the shared
confirmation control, guard repeat clicks, handle business and transport
failures, then refresh both the row and whichever approval surface remains
open. Do not duplicate status calculation or invent history from the current
badge. New/unsaved records have no approval action.

This is a presentation pattern, not a universal transition graph. A model
without persisted approval and endpoints does not gain an approval tab/action
by imitation. Freeze each model's steps, transition guards, financial effects,
legacy provenance and decision payload before adoption. The planned
configurable approval policy is owned by Settings **separately for each
model**; until it exists, identify the current manual step honestly and do not
display a fabricated multi-step policy or settings controls in the form.

The owner intends this approval pattern for every ERP document eventually.
Treat the rollout as per-model domain work, including nonfinancial documents:
an approval there may only change a validated state or release a defined
operational action, and must never create a placeholder journal. Financial
documents post their real source-owned journal on Approve; Void marks that
journal and document canceled without a reversing entry, after domain guards.
For a nonfinancial document with no material effect to undo, use its ordinary
Reject/Cancel lifecycle and omit Void. Add an operational Void only where a
real released effect must be canceled and the model preserves that audit.
Do not turn on the shared action for a model until its state, effect timing,
backend endpoint and historical-row handling are frozen and implemented.

#### Common approval vocabulary and guarded corrections
Use the same user-facing vocabulary across ERP documents, invoices and
operational procedures: **Pending** (saved and awaiting decision), **Approved**
(accepted and its model-owned effect released), and **Rejected** (decision
declined with a reason). Expose **Approve** for an eligible Pending record;
**UnApprove** returns an eligible Approved record to Pending; **Reject** moves
an eligible Pending record to Rejected. **Owner clarification 2026-10-24:** the
canonical adoption graph is Pending→Approved, Pending→Rejected and guarded
Approved→Pending. Rejected is terminal; no Rejected→Pending/Approved or direct
Approved→Rejected shortcut. This supersedes the earlier Purchase Order
correction example and the suggested rejected-reopen option. Require a trimmed
nonblank reason of at most500 characters for Reject and UnApprove, using the
shared typed input panel; Approve uses the shared confirmation-only service.
The backend persists previous/new status, actor, time and reason; older missing
history remains null. Both approval surfaces display the same result.
This is presentation and action terminology, not an instruction to rename
existing persisted enums: map each model's real draft/not-approved value to
Pending only after its legacy and effect contract is reviewed.

These labels and graph are common, but eligibility is model-owned. UnApprove
must be hidden and rejected by the backend if an effective
journal, stock movement, payment, allocation, issue, receiving, or dependent
document cannot safely be undone or has already been consumed. A financial
model may unpost only under its frozen period/downstream guard; a nonfinancial
model may have no effect to undo. If an irreversible effect needs cancellation,
use that model's guarded Void/Cancel contract instead of pretending that
UnApprove restored the prior world. Never delete decision or action-log history.
Until Settings owns approval policy per model, this is a manual single-step
vocabulary, not a claim that every ERP model already implements these actions.

Use the existing shared document approval panel for both the saved View's
Approvals tab and the list's Approval Status dialog; model adapters normalize
their actual typed contexts/endpoints and do not recreate action/history markup.
The server `canApprove/canUnapprove/canReject` fields govern buttons. The panel
owns read/retry, typed reason state, confirmation, stale/cancel/error/busy handling
and history presentation; owning surfaces reload actual details/row eligibility
after success. No mutation is enabled in unsaved or dirty edit mode. Current
adoption includes PR/PO/GRN/Bill/PurchaseReturn and the later owner-authorized
Payment lifecycle (its current contract and server remain authoritative).
DebitNote does not acquire approval by visual imitation. See the unified
purchasing contract for the exact stock/journal/reservation guards.

**Mounted approval access.** Adopt current-session
access through `DocumentApprovalCycleComponent.accessRequirement` for reading
and `decisionRequirement` for decisions; `accessBlocked` expires the mounted
owner when its parent data context ends. These optional inputs retain legacy
consumers' defaults and never infer a resource or operation. A decision also
requires reading its current context, even when the decision requirement is a
separate key. The panel owns finite-read cancellation and revision/regrant
recovery, instead of adapters cancelling a read while leaving unchanged inputs
that cannot restart it. A pending decision defers revalidation until its own
finalizer; busy changes must not clear successful output or cause a GET loop.

Keep the reason editor mounted and hide/inert its body portal when either
requirement is denied; preserve the reason draft for same-context regrant.
Expire the old context permanently and ignore its late callbacks. Confirmations
are lazy and access/context-cancelled with a false decision; one new local
discard remains possible after existing denial (UI28), including when both
requirements are absent. Recheck permission and server eligibility before a
new decision. Do not put read cancellation on a sent mutation; a same-context
success still finishes once after permission withdrawal. Gate workspace links
through the existing route policy for adopted consumers. A list modal sets
`localReadProgress` because its overlay covers the page host (UI22); the saved
routed tab keeps the page owner. Payment is the scoped adopter and source
regression specs are present; compile, test execution and application visual
acceptance remain pending. This does not establish adoption of other consumers.
