## 7. Action button cycle

> **Status: Transitional** — `ActionList` is untyped (`any`), backlog 22

One `ActionList[]`. Pass it to `app-data-table` through `[actions]`. The shared
table renders the Actions column first and composes the existing
`ActionButtonComponent`; feature components do not manage `TemplateRef` or
rebuild column definitions after view initialization.

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
export interface ActionList {
  title: string;
  icon?: string;
  action: (action?: any) => void;
  visible?: (row?: any) => boolean;
  disabled?: (row?: any) => boolean;
}
```

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

`ToActionResult` commonly converts `Result.IsSuccess == false` into a non-2xx
response. Therefore the transport `error` callback must recover the backend
`Result.Message` from `HttpErrorResponse.error.message` when present, then fall
back to the translated feature error. Handling only the `next` branch loses
business failures such as an invalid transition or blocked Unapprove; showing
only a generic error also fails the contract.

```ts
import { HttpErrorResponse } from '@angular/common/http';

private mutationError(error: unknown, fallbackKey: string): string {
  if (error instanceof HttpErrorResponse && error.error &&
      typeof error.error === 'object') {
    const message = (error.error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return this.translate.instant(fallbackKey);
}
```

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

---

