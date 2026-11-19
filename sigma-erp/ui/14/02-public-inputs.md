<!-- Part of UI block 14: see ../14-editable-collection-table.md. Same status and authority as the block. -->

### Public inputs

| Binding | Meaning |
|---|---|
| `title` | Required translated-key heading and table accessible name |
| `description` | Optional translated-key helper text |
| `headingIcon` | Optional decorative Bootstrap icon for the visible heading |
| `headingVisible` | Defaults true; set false when an enclosing `app-form-section` already renders the visible title. `title` remains required for the table accessible name |
| `tableMinWidth` | Optional CSS minimum width such as `900px`; preserve wide editable-row usability while the shared frame supplies horizontal scrolling |
| `fillHeight` | Defaults false; set true only when the feature places the table in a bounded flex area; the shared host and scroll frame then participate in the available height instead of expanding the page |
| `maxHeight` | Optional responsive upper bound for the shared scroll frame; pair with `fillHeight` when totals or other content must remain visible below the table |
| `stickyHeader` | Defaults false; makes the frame the single vertical scroll owner with a sticky header row. Use with `fillHeight` in a bounded flex parent, or with `maxHeight` (2026-10-01) |
| `columns` | Required ordered header definitions; optional `width` fixes a column through the shared colgroup/layout; `minWidth` supplies a minimum-width hint; `numeric` applies the compact numeric-column class; optional `align` (`start`/`center`/`end`) controls header alignment, with existing default preserved; `required` renders the required marker |
| `emptyMessage` | Required translated-key empty-state message |
| `emptyIcon` | Optional decorative Bootstrap icon for the empty state |
| `editable` | Shows the Add action, action column, and Remove buttons when true |
| `actionsVisibleInView` | Defaults false; retains the projected action cell/header in View when it also contains row data. The feature hides mutations and keeps data controls read-only; the default Remove button remains editable-only. |
| `addLabel` | Translated-key label for the shared primary Add action |
| `addDisabled` | Disables Add while a prerequisite such as lookup data is unavailable |
| `removeDisabled` | Defaults false; disables the default Remove action while a feature snapshot is loading/saving |
| `validationMessage` | Optional translated-key collection-level validation alert rendered in the shared toolbar; the feature owns the condition/key (for example duplicate logical rows) |
| `actionsLabel` | Optional action-column translation key; defaults to `general.actions` |
| `removeLabel` | Optional Remove translation key; defaults to `general.remove` |
| `addRequested` | Requests a feature-owned add/default-row/dialog workflow |
| `removeRequested` | Requests removal by current row index; it does not mutate the collection |
| `appEditableCollectionActions` | Optional projected action buttons with typed row and index context; replaces the default Remove button without moving action-cell ownership into the feature |

When the table is inside an enclosing `app-form-section`, project the Add action
into the section heading with the `[form-section-actions]` slot and set
`headingVisible="false"` on the table. This keeps one visible title row and
places Add at its logical end. Do not keep both the section-header Add and the
table toolbar Add.

The ownership boundary is strict:

- Shared component: optional toolbar, Add button, table frame, required headers,
  empty state, action column, default Remove or projected-action presentation,
  row tracking, responsive behavior, focus styles, RTL-safe layout, and
  light/dark colors.
- Feature: typed `FormArray` or row collection, row controls, projected cells,
  lookup options, validation messages, view/edit cell rendering, removal
  confirmation, collection mutation, dirty state, payload mapping, and
  persistence.
- Nested draft dialogs: block 13 still owns draft-form isolation and parent
  commit-on-Save mechanics. Use them when Add/Edit needs a form dialog; present
  the resulting rows through this shared table.

Keep the array typed and feature-owned. Create or attach it in the feature form;
the shared component must never create controls or reconcile the aggregate.

**Pending removal and Save (2026-10-03).** Supply `EditableRows.canMutate` for reviewed
editors whose collection can become locked. It checks before opening the confirmation and
again after it resolves, in addition to re-resolving the row identity. A confirmation opened
before Save cannot remove a row from the submitted snapshot. Feature Add methods keep their
own busy/read-only/load gate; the shared helper's Add return contract stays compatible.

For reviewed editors whose reactive controls remain visible during removal,
set `EditableRows.freezeParentOnConfirmation: true` (2026-10-09). This optional
input defaults false for existing consumers. The helper delegates to UI10's
`freezeFormState`, restores the prior control state before the existing same-row
and `canMutate` recheck, and releases it idempotently on finalization/destruction.
Features retain their parent identity, busy and read-only gates; the complete
snapshot and untouched-new-row shortcut remain unchanged. Lease adopts this
opt-in; compilation/interaction acceptance remains owner-pending.

For child contracts with nonnumeric identity, provide `EditableRows.isSavedRow`
from the actual typed row key. The untouched-new-row shortcut must never bypass
confirmation for a saved GUID/string row. The optional predicate affects only
saved/new classification; numeric `savedId()` and existing callers retain their
public return contract. LeaseClause uses its persisted GUID key (2026-10-09).

When a row checkbox belongs beside its actions, use `appEditableCollectionActions`
and the shared `app-editable-collection-table__row-actions` group. The shared table
owns checkbox size/accent there as well as in ordinary cells. Preserve the field
in View with `actionsVisibleInView`, while the feature hides the delete button;
give the checkbox its translated accessible name and title.

For a wider projected action group, set `--sigma-editable-actions-width` and
`--sigma-editable-row-actions-gap` on the shared table host. Shared defaults are
74px and 5px; the action colgroup/header/cell share the width. Keep these choices local to the
consumer through the variables; do not override shared cell selectors.

When the checkbox needs a visible caption in an action cell, wrap its input and
translated text in `label.app-editable-collection-table__row-check`. Shared styling
owns its control-line alignment, gap and colour; the wrapping label supplies the
accessible name and a clickable caption. Allocate action-column width for the
caption and buttons.

When a flag and its mutation button need separate column headings, keep the flag
in an ordinary projected data cell with its own translated header/accessibility
label; reserve the shared Actions column for buttons. Individual Documents uses
Is International (136px) immediately after Attachment (280px), then the default
74px Actions column for Remove. The flag remains visible in View without an empty
Actions column; `actionsVisibleInView` is unnecessary in this arrangement.
