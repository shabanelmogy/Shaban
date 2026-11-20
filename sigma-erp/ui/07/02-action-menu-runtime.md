<!-- Part of UI block 7: see ../07-action-button-cycle.md. Same status and authority as the block. -->

### Shared action menu runtime
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

**Stable popup model.** Preserve each rendered
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
