## 7. Action button cycle

**Topic files of this block** (read only the one the task needs; they are part of this block):

- [Shared document approval status, action menu and saved editor](07/01-approval-status.md)
- [Shared action menu runtime](07/02-action-menu-runtime.md)
- [Document action log](07/03-action-log.md)
- [Quotation action-cycle specialization](07/04-quotation-specialization.md)

> **Status: Canonical** — declare `ActionList<Row>` for typed actions (2026-09-30)

### Explicit current-session permissions — 2026-11-06

For an adopted action, declare its actual backend `permission` requirement in
`ActionList<Row>`/`ButtonModel` or the existing shared button input. The shared
owner combines this with the row's visible/disabled/busy policy and rechecks
permission at execution. Use the shared `appAuthorize` view directive where an
existing action owner does not render the section. All use UI26's current
session decision; do not fetch an administrative snapshot or issue HTTP per
row/control. Permission names come from the frozen endpoint catalogue, not
titles, icons or a generic assumption that POST means Create.

Missing an explicit requirement preserves a non-permission control's ordinary
contract (for example Cancel/Search); it does not establish authorization
adoption. Reconcile every business action in the screen inventory, including
editor Save/switch-to-edit and native buttons, before opening that screen to
ordinary users. A route view key alone does not adopt its write actions.
Existing domain-state guards and backend checks remain necessary even for the
tenant administrator. Source conformance and runtime/visual acceptance are
separate evidence; see the current-access contract and acceptance report.

One `ActionList[]`. Pass it to `app-data-table` through `[actions]`. The shared
table renders the Actions column first and composes the existing
`ActionButtonComponent`; feature components do not manage `TemplateRef` or
rebuild column definitions after view initialization.
