## 7. Action button cycle

> **Status: Canonical** — declare `ActionList<Row>` for typed actions (2026-09-30)

One `ActionList[]`. Pass it to `app-data-table` through `[actions]`. The shared
table renders the Actions column first and composes the existing
`ActionButtonComponent`; feature components do not manage `TemplateRef` or
rebuild column definitions after view initialization.

Existing native/PrimeNG table cells that have not yet adopted DataTable may
embed the same app-action-button with its optional row input and typed
moreActions. It renders the same exported template locally; DataTable omits
row and keeps its existing template-export contract without duplicate buttons.
This is a bounded compatibility path, not permission for feature-owned Menu
copies or a second action style. Callbacks receive the actual row, never its
visual index (Settings Fines/ESalik/EDarb runtime retirement,2026-10-22).

### Shared action menu runtime (owner migration, 2026-10-22)

Keep the same shared ActionButton/exported-template contract. Each rendered
row uses a PrimeNG popup Menu appended to body, with translated commands built
from that row's current ActionList. Filter hidden actions, expose disabled
state, and recheck membership/visible/disabled before invoking the callback.
Do not retain Bootstrap data-bs-toggle/events or custom DOM portal positioning.
The publisher owns arrow/Home/End/Enter/Space/Escape behavior, outside dismissal,
scroll/resize cleanup and overlay positioning. Its show(event) reads the actual
currentTarget synchronously; do not reuse a visible menu for another row with
synthetic/delayed event targets. Local row popup instances avoid stale context.
Keep the compact trigger and body-popup geometry under shared Sigma styles,
logical RTL/theme, marked print hiding and UI27 conditional focus return.
No feature switches selectors, action payloads or callback ownership.

**Stable popup model (source correction, 2026-10-23).** Preserve each rendered
popup's MenuItem references and model array across unrelated template checks.
A template method that maps to fresh MenuItems on every check makes the
publisher's identity-tracked item views detach during focus/blur, potentially
between native pointer-down and click. Cache by the actual popup instance
with weak ownership; retain the row and action identity in the comparison.
Re-evaluate visibility, translated labels, icons and disabled predicates on
each check so mutable rows and busy/language changes remain live; replace
only changed entries/model. Keep execution-time membership/visible/disabled
guards and publisher click/keyboard dispatch. Do not execute on mousedown or
freeze a menu snapshot until reopen. Regression coverage retains the pressed
link through focus before its first click, plus row switching, live predicates
and translation/action changes. Synthetic focus/pointer coverage is distinct
from owner verification of actual mouse/touch interaction (UI29).

```ts
private initActions(): void {
  this.moreActions.set([
    { title: 'general.viewDetails', icon: 'bi bi-eye',
      action: (item: CompanyPartnerGridRow) => this.openView(item) },
    { title: 'general.edit', icon: 'bi bi-pencil-square',
      action: (item: CompanyPartnerGridRow) => this.openEdit(item) },
    { title: 'companyPartners.agreementsHistory', icon: 'bi bi-clock-history',
      action: (item: CompanyPartnerGridRow) => this.openAgreementHistory(item) },
    { title: 'general.delete', icon: 'bi bi-trash',
      action: (item: CompanyPartnerGridRow) => this.confirmDelete(item) },
  ]);
}
```

Use the model for conditional rows instead of hiding logic in HTML:

```ts
export interface ActionList<TRow = any> {
  title: string;
  icon?: string;
  action: (row?: TRow) => void;
  visible?: (row?: TRow) => boolean;
  disabled?: (row?: TRow) => boolean;
}

readonly moreActions = signal<ActionList<CompanyPartnerGridRow>[]>([]);
```

New and refactored screens declare the row type (`ActionList<Row>`); the `any` default only
keeps older untyped declarations compiling.

Use `visible` for actions unavailable in the row's business state, such as an
edit or state transition that is not allowed after close or void. Use
`disabled` for transient UI conditions such as an in-flight request. Do not
leave a permanently unavailable row action visible as a disabled or no-op menu
item; the backend `can*` contract remains the source of truth and still
revalidates the action.

Full cycle for every action:

| Step | Do this |
|---|---|
| 1 Define | translation key, `bi` icon, `visible`/`disabled` when row state matters |
| 2 Click | receive the row object; use `row.id`, never an index |
| 3 Confirm | **destructive or risky** → confirmation dialog (block 9); needs input → form modal (block 13); ordinary Save/Next → no dialog |
| 4 Run once | guard with a `saving`/`deleting` signal so double click cannot fire twice |
| 5 Success | one toast from the global mutation interceptor, then refresh keeping the page; the feature must not emit a duplicate |
| 6 Failure | clear the busy flag, keep the row, show a translated message |

After a delete that empties the current page, step back one page before
refreshing:

```ts
if (this.data().length === 1 && this.pageNo() > 1) {
  this.pageNo.update((page) => page - 1);
}
this.getListItems(undefined, true);
```

**What needs a confirmation, and what does not.** Confirmations are for actions
the user cannot easily undo. Putting one on an ordinary Save trains people to
click through them.

| Confirm | Do not confirm |
|---|---|
| Delete, remove, void, cancel a document | Save, Update, Next, Previous |
| Irreversible status transitions: post, approve, unapprove, finalize, close | Opening a dialog, switching tab or step |
| Discarding unsaved edits (block 10) | Search, refresh, export, print |
| Actions with side effects on other records | Adding a blank child row |

### Approval status in the action menu and saved editor

**Source conversion actions (owner2026-10-24; BE18).** Use the existing shared
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

**Independent document progress (owner2026-10-24; BE18).** Show approval,
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
> (owner decision 2026-10-21; Master block 4, UI block 13).

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

#### Common approval vocabulary and guarded corrections (owner decision 2026-10-22)

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
adoption is PR/PO/GRN/Bill/PurchaseReturn; Payment/DebitNote have no frozen
approval lifecycle and acquire none by visual imitation. See the unified
purchasing contract for the exact stock/journal/reservation guards.

### Document action log (owner decision 2026-10-22)

**One label (owner2026-10-24).** Use **Log** in English and **السجل** in Arabic
for the document row action and its dialog title, through `documentLog.title`.
Do not mix Audit Trail and Log across document screens. Decision history
stays inside Approvals and is distinct from this captured write log. A technical
audit administration screen can keep its own descriptive title.

Where a document exposes a Log action, open a read-only dialog using the shared
document-action-log component. Supply its identity and a typed feature loader;
the feature endpoint checks record existence and view access, then reads the
tenant-scoped central audit stream. Show actor/time, translated action, optional
reason, and available field changes; show loading, empty, transport/business
errors and Retry. Keep the log component and field-change formatter shared so
similar documents adopt the presentation without copying feature-specific UI.
For a new consumer, add a saved-row Log action, a typed service method calling
its feature read endpoint, and a dialog host supplying the saved numeric record
ID and `loadEntries` callback to `app-document-action-log`. Use the translated
dialog title with the document number as subtitle. Refresh when record identity
changes; do not offer Log for an unsaved draft. Map both unsuccessful Result and
HTTP failure to visible feedback and Retry. Preserve the shared formatter's
redaction/empty-detail presentation instead of parsing audit JSON per feature.
The audit stream captures successful tracked create/edit/delete and state writes;
older metadata-only records and out-of-band/bulk writes cannot gain fabricated
details. The list action remains separate from Approval Status, which owns
decision controls and eligibility. A reason-required correction uses a typed
form dialog and backend guard, not the log viewer. Refresh the row and any open
log after a successful write or decision; the Log viewer never changes state.
Backend block 18 owns the per-model write/identity/transition checklist and
the detached-update before-value verification caveat. Purchase Order Log is
the first consumer, not a universal permission or approval policy.

### Quotation action-cycle specialization

> **Status: Canonical for quotation lists.** `Sales/SalesQuotation` is the
> complete reference for the action lifecycle. A quotation type may expose a
> smaller action set, but it must use the same lifecycle for every action it
> supports.

Freeze the quotation action-state contract in Phase 1 before implementing the
menu. A single-status quotation may expose its persisted status when the public
enum is already the API contract. A quotation with separate internal and
customer approval axes, or more complex dependencies, should expose the minimum
explicit `can*` flags required by the list. The feature consumes that contract
in `ActionList.visible`; it does not duplicate workflow rules in HTML. The
backend must still revalidate every transition because UI visibility is not a
security or concurrency boundary.

#### Mandatory reference-action preflight

Do not build the menu from memory, one screenshot, or a partial scan of a
reference component. Before editing Angular, enumerate every action in the
approved reference's backend interface/service/controller and Angular
service/list. Reconcile that inventory against the target backend contract.

| Reference action | Target backend route exists? | Target ListVM state exists? | Target UI decision | Evidence |
|---|---|---|---|---|
| | Yes / No | enum or `can*` flag | Supported / Not Applicable / Missing / Conflicting | |

Every reference action must appear once. A target-specific exclusion is valid;
a silent omission is not. If the backend contract is Missing or Conflicting,
stop that row instead of adding a disabled, hidden-by-constant, or no-op menu
item.

Not every quotation type supports every row below. Include an action only when
the entity, service interface, controller route, response model, translation,
and owning UI workflow all exist. Preserve the feature's actual HTTP verb,
route, payload, and target-state rules; do not manufacture a common endpoint
because another quotation type has one.

| Action shape | Usual source state or flag | UI interaction | Contract rule |
|---|---|---|---|
| View | Existing row | Open the owning View editor; no confirmation | Always identify the row by `id` |
| Internally approve | Pending or `canApproveInternally` | Shared confirmation, then one guarded request | Backend validates readiness and the legal source state |
| Internally reject | Pending or `canRejectInternally` | Typed reason dialog when the endpoint requires a reason; otherwise shared confirmation | Send a reason only when it is part of the backend request contract |
| Customer approve | Internally approved or `canApproveByCustomer` | Shared confirmation, then one guarded request | Backend owns the transition to customer-approved |
| Customer reject | Internally approved or `canRejectByCustomer` | Typed reason dialog when required; otherwise shared confirmation | Rejected and revised are distinct unless the domain contract explicitly equates them |
| Revise | Feature-confirmed approved state or `canRevise` | Confirm the transition; open Revise mode only when the contract identifies the revision being edited | Revision number, copy semantics, and target state are feature-specific and must not be inferred |
| Unapprove | Customer-approved or `canUnapprove` | Shared warning confirmation | Backend blocks the transition when a dependent agreement, receipt, or other final record exists |
| Print | States allowed by the feature contract | Print directly; no confirmation | Use block 21 `ReportPrintService`; the owning view supplies printable content |
| Edit | `canEdit` or a documented editable status | Open the same editor in Edit mode; no confirmation | Save revalidates the current state and may reset a rejected quotation to Pending only when documented |
| Open agreement, master agreement, or receipt | Approved state plus an explicit availability rule | Open the owning typed editor; no confirmation merely for opening | Creating the downstream record is a separate validated mutation; do not invent missing fields or routes |
| Delete | `canDelete` or a documented editable status | Shared destructive confirmation | Backend revalidates state and dependencies; use last-page-delete handling |

Keep quotation actions in one predictable order: View; internal transitions;
customer transitions; Unapprove/Revise; Print; Edit; confirmed downstream
workflows; Delete. Omit unavailable entries without leaving disabled or no-op
items. Risky transitions use the shared confirmation dialog. When the workflow
collects a reason, note, or date, it is a typed form dialog, not a confirmation.

The execution path is the same for each supported transition: guard duplicate
clicks with a local busy signal; start the approved loading channel; call the
typed service method; inspect `isSuccess` before using the response; handle the
transport `error` callback; keep the row and show a translated error on failure;
clear the busy state in `finalize`; and refresh the current page after success.
Rely on the global mutation interceptor for the success toast so the feature
does not emit a duplicate.

`ToActionResult` converts `Result.IsSuccess == false` into a non-2xx response. The global
error interceptor already shows the backend `Result.message` for both channels (block 22), so
the action restores its row and busy state in both `next` (`isSuccess: false`) and `error`,
and shows nothing itself. An action whose message belongs inline (for example inside a reason
dialog) sends `X-Skip-Error-Interceptor` and reads the message with
`apiErrorMessage(error, fallbackKey)` from `shared/utils/api-error.ts`; never a private copy.

Before reconciliation, trace every Supported action through all of these links:

```text
ListVM enum/can* -> ActionList.visible -> typed Angular service method
-> exact controller route/payload -> backend transition -> same-page refresh
-> EN/AR labels, confirmation/reason text, and both failure channels
```

One missing link blocks completion. Add source-level or owner-run verification
cases for every legal transition, every illegal source state, required reason
validation, dependency-blocked reversal, duplicate-click guard, and stale-row
recovery. A spec that only asserts that the component is defined does not cover
the action cycle.

**Quotation check:** action-state contract frozen before UI work · one typed
service method per supported route · no unsupported or no-op action · reason
dialog only when the payload requires it · both failure channels handled ·
backend failure message preserved · same-page refresh after success · backend
revalidates every transition · reference inventory has no unclassified row.

**Check:** actions passed once to `app-data-table` · no feature-owned
`TemplateRef` wiring · row identified by `id` · destructive and risky actions
confirm, routine ones do not · busy guard · last-page-delete handled.


#### Failure-prevention register (moved from Master block 4, 2026-10-01)

| Failure seen in review | Root cause | Mandatory prevention |
|---|---|---|
| Customer approve/reject or Revise is absent | Reference inspected partially or only the screenshot menu was copied | Complete the reference-action inventory across backend and Angular before implementation |
| Action exists in one layer only | No vertical-slice reconciliation | Require every Supported action to fill every action-state contract column |
| Redundant `DetailAsync`/`GetManyWithNavigationsAsync` or controller override | Reference methods copied for symmetry | Complete the override-justification table and inherit any row without distinct behavior |
| Action appears in the wrong state | One status field was checked while another approval axis was implicit | Freeze and validate the complete source and target state tuples |
| Backend explains a blocked transition but UI shows a generic error | Non-2xx `Result` body was ignored | Let the error interceptor present the backend `Result.message`; an inline message reads it with `apiErrorMessage` (UI block 22) |
| Unapprove passes a dependency pre-check while a dependent record is created concurrently | Separate dependency query was assumed atomic with the update | Record an isolation/invariant strategy or disclose the residual race |
| Sales-only downstream action is copied into another quotation | Reference parity was confused with domain parity | Classify the action Not Applicable with concrete missing-domain evidence; never add a no-op |

---

