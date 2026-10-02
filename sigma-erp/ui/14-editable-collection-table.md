## 14. Editable collection table

> **Status: Canonical**

`shared/components/editable-collection-table` is the single owner of compact
editable collection chrome. It renders the optional heading icon, title and
hint, shared primary Add action, collection-level validation alert, translated/required headers, responsive table
shell with an optional minimum width, default Remove or projected row actions,
empty state, and light/dark styling. The feature projects only its typed data
cells/actions and retains all domain behavior. CompanyPartner uses the same
component for contact persons, credit cards, documents, and the driver summary;
do not copy their former `company-editable-table` markup.

Shared partner contracts use `DocumentRow`/`CardRow` and factories/mappers from
`shared/utils/partner-editor-forms.ts`; Company and its Driver editors adopt them.
The containing form owns the arrays. Presentation components take those arrays,
typed seeds and unique control ID prefixes rather than inventing a second form graph
or copying date/identity/validation rules. See block 18 for nested upload ownership.

Import both standalone declarations in the direct consumer:

```ts
import {
  EditableCollectionActionsDirective,
  EditableCollectionRowDirective,
  EditableCollectionTableColumn,
  EditableCollectionTableComponent,
} from 'src/app/modules/shared/components/editable-collection-table/editable-collection-table.component';

@Component({
  imports: [
    EditableCollectionActionsDirective,
    EditableCollectionRowDirective,
    EditableCollectionTableComponent,
  ],
})
export class DetailsComponent {
  readonly partColumns: ReadonlyArray<EditableCollectionTableColumn> = [
    { header: 'services.part' },
    { header: 'services.qty', numeric: true },
  ];
}
```

The column `header` and every text input below are translation keys. Set
`numeric: true` for a compact numeric column and `required: true` when the
projected control is required. The shared component translates the keys and
supplies the accessible table and button labels.

Use column `width` for a fixed CSS width (Individual Document Type uses `240px`).
The shared table switches to fixed layout with a matching `colgroup` only when
at least one column declares `width`. Other columns remain flexible; declared
`minWidth` and numeric/action widths provide the existing sizing hints. Long
dropdown labels stay inside their column. Keep wide-table overflow on the shared
frame; do not add feature-specific cell/dropdown width selectors.

Every dropdown column declares `width` so selected labels cannot resize the
closed control or its siblings (block 16). Company Contact Designation uses
200px and Card Type uses 180px; choose other widths according to field content.

```html
<app-editable-collection-table
  title="services.parts"
  description="services.partsHint"
  addLabel="services.addPart"
  emptyMessage="services.noParts"
  [columns]="partColumns"
  [editable]="isEditableMode()"
  [addDisabled]="partOptions().length === 0"
  (addRequested)="addPart()"
  (removeRequested)="confirmRemovePart($event)"
>
  <ng-template [appEditableCollectionRow]="parts.controls" let-control>
    <ng-container [formGroup]="control">
      <td>
        <p-dropdown
          formControlName="itemId"
          [options]="partOptions()"
          optionLabel="value"
          optionValue="id"
        ></p-dropdown>
      </td>
      <td class="is-number">
        <input
          type="number"
          formControlName="quantity"
          min="1"
          max="2147483647"
          step="1"
        />
      </td>
    </ng-container>
  </ng-template>
</app-editable-collection-table>
```

The shared component renders each `<tr>` and tracks the row object. The
`appEditableCollectionRow` template must therefore emit `<td>` cells only; do
not project another `<tr>`. A reactive row can wrap those cells in
`<ng-container [formGroup]="control">` because the container adds no DOM node.

When a row needs more than the standard Remove request, project the shared
action context. The table still owns the action cell and the feature owns the
typed Edit/Delete behavior:

```html
<ng-template appEditableCollectionActions let-index="index">
  <span class="app-editable-collection-table__row-actions">
    <button type="button" class="app-editable-collection-table__row-action"
            (click)="editDriver(index)" [attr.aria-label]="'general.edit' | translate">
      <i class="bi bi-pencil-square" aria-hidden="true"></i>
    </button>
    <button type="button"
            class="app-editable-collection-table__row-action app-editable-collection-table__row-action--danger"
            (click)="confirmRemoveDriver(index)" [attr.aria-label]="'general.remove' | translate">
      <i class="bi bi-trash3" aria-hidden="true"></i>
    </button>
  </span>
</ng-template>
```

### Contract

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
| `columns` | Required ordered header definitions; optional `width` fixes a column through the shared colgroup/layout; `minWidth` supplies a minimum-width hint; `numeric` applies the compact numeric-column class and `required` renders the required marker |
| `emptyMessage` | Required translated-key empty-state message |
| `emptyIcon` | Optional decorative Bootstrap icon for the empty state |
| `editable` | Shows the Add action, action column, and Remove buttons when true |
| `actionsVisibleInView` | Defaults false; retains the projected action cell/header in View when it also contains row data. The feature hides mutations and keeps data controls read-only; the default Remove button remains editable-only. |
| `addLabel` | Translated-key label for the shared primary Add action |
| `addDisabled` | Disables Add while a prerequisite such as lookup data is unavailable |
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

### Row mechanics — `EditableRows`

`shared/utils/editable-rows.ts` (2026-10-01) owns the repeated mechanics of a child
`FormArray`. The feature keeps its typed array, row factory, cells and payload mapping:

```ts
readonly parts = new EditableRows<FormGroup<PartControls>, PartDTO>({
  array: this.form.controls.parts,
  create: (seed) => this.createPartRow(seed),
  parent: this.form,
  confirmation: this.confirmationDialog,
  destroyRef: this.destroyRef,
  removeTitle: 'services.removeChildTitle',
  removeMessage: 'services.removePartMessage',
  focusId: (index) => `service-part-${index}`,
});

addPart(): void { this.parts.add(); }                         // dirty + focus on the new row
confirmRemovePart(index: number): void { this.parts.requestRemove(index); }
private applyDetail(dto: ServiceDTO): void { this.parts.replace(dto.parts); }   // not dirty
```

- **Confirmation rule.** Adding or removing a row marks the editor dirty.
  - A new row the user has not touched (no saved id, pristine) is removed directly.
  - A saved or edited row is confirmed first (block 9).
  - The helper re-resolves the row's index after the confirmation, so a collection that changed meanwhile removes the right row.
- **Focus.** `add` reveals/focuses the new row's first control when `focusId` is given (the control's `id`), through shared `focusField` with `openOverlay: false`. It waits for rendering, scrolls actual content regions only and prevents browser focus scrolling; Add does not automatically open the picker. See block 27.
- **Per-row errors.** Each validated cell gets `app-field-error` (block 19). The first invalid control is focused on Save.
- **Duplicates.** `duplicateIndexes(row => key)` returns the rows that repeat a business key. Show the table's `validationMessage` and block Save while it is not empty.
- **Maximum rows.** When the business caps the rows, bind `addDisabled` to the cap, and the backend enforces the same cap.
- **Update payload (D4-3, full snapshot).** Send every row. A saved row carries `savedId(row)`; a new row has no id. A removed row is simply absent, and an empty list clears the collection only when the business allows zero rows.

Manual removal, when a feature cannot use the helper yet, follows the same rule:

```ts
confirmRemovePart(index: number): void {
  if (!this.isEditableMode()) return;

  this.confirmationDialog
    .confirm({
      severity: 'warning',
      title: { key: 'services.removeChildTitle' },
      message: { key: 'services.removePartMessage' },
      confirmLabel: { key: 'general.remove' },
      cancelLabel: { key: 'general.cancel' },
      confirmIcon: 'bi bi-trash3',
    })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((confirmed) => {
      if (!confirmed) return;

      this.parts.removeAt(index);
      this.vehicleServiceForm.markAsDirty();
    });
}
```

**Derived cells.** A cell calculated from other inputs (line total, line tax, net, balance) is
read-only: it shows a preview rounded with `roundMoney` where the backend rounds, it is never
part of the row payload, and the backend value replaces the preview after save (AGENTS
"Backend, mapping, and calculation rules"; block 19 *Money and tax in forms*). Show it as text
or a `readonly` input, not as an editable control.

**One height, top-aligned cells (owner request 2026-10-01).** Inputs, dropdowns and calendars in a row are exactly
`--sigma-editor-control-height` (34px, the same as the editor fields and filters), and cells align to
the top, so an error under one cell never moves the controls of the others. A checkbox cell sits on
the control line, using the same 15px box and `accent-color: var(--sigma-primary)` as
editor checkbox fields (block 1). The shared table owns this; features add no row CSS.

**Check:** shared component and row directive are both imported · the actions
directive is imported when custom actions are projected · column order matches
projected cell order · row template emits cells, not a row · translation
keys exist · collection-level blockers use the shared `validationMessage` alert · `editable` is false in View mode · Add prerequisites use
`addDisabled` · rows added/removed through `EditableRows` (untouched new rows removed directly,
others confirmed, block 9) · full-snapshot update payload · feature
marks the parent dirty and maps the collection into the write payload ·
`fillHeight` is used only inside a bounded flex parent · `maxHeight` or `stickyHeader` keep row
scrolling inside the table, with no feature rule on the frame · derived cells read-only and
not in the payload · totals/summaries remain
outside the table frame and do not disappear when the frame scrolls.

### Financial collection editor — canonical routed variant

Use this variant for accounting setup or maintenance screens that edit many
financial rows under one shared business context, especially when the screen is
split into source/type tabs. The approved reference is:

```text
Accounts/openingBalances/components/details/
Accounts/openingBalances/components/{accounts,cost-center,customers,suppliers,staff,stock,prepaid,deposit}/
shared/components/editable-collection-table/
```

The feature owns the typed forms, filters, totals, row mapping and persistence.
`app-editable-collection-table` still owns the table chrome. Routed source/type
navigation uses `app-editor-tabs appearance="workspace"`; Opening Balances and
Link Accounts are the approved routed references for that shared visual shape.
Do not fork or copy the shared editable-table or tab components just to change
height, scrolling or tab presentation.

#### Header and immutable business context

Use `app-feature-title` once. Put server-owned context that the user needs while
editing in its action/metadata area rather than in an editable field. Examples
include fiscal-year start, posting context or an immutable status. A server-owned
value must not be presented with a fake Save/Change action.

#### Bounded height — rows scroll inside the table

The page never scrolls (block 1). The routed financial editor uses the container-fill host
(`sigma-route-host`) and a flex column in which every shrinking ancestor has `min-height: 0`.
The editable table is the single vertical scroll owner, through its own inputs:

```html
<app-editable-collection-table
  title="openingBalances.accounts"
  [headingVisible]="false"
  [columns]="columns"
  [editable]="isEditable()"
  [fillHeight]="true"
  [stickyHeader]="true"
  tableMinWidth="900px"
  …
>
```

`fillHeight` joins the host to the bounded flex chain, and `stickyHeader` makes the frame the
scroll owner with a sticky header row. The feature does **not** style
`.app-editable-collection-table__frame`, its `thead` or the host from feature SCSS. The rule is
the same as for `app-data-table` (block 6): inputs and documented variables only. Header, tabs,
state banner, filters, the financial summary and the Save action stay outside the frame.

> **Legacy — do not copy.** Opening Balances still sizes its route with a
> `max-height: calc(100dvh - …)` "grow until the footer" cap and reaches into the table frame
> and `thead` from its SCSS. Both are removed in its review: the container-fill host replaces
> the calc (block 1), and `[fillHeight]` + `[stickyHeader]` replace the frame rules.

On narrow layouts, stack the panes and reduce filter columns, but keep the chain bounded. The
row frame stays the only vertical scroll owner.

#### Filters inside financial editors

The filter strip is the shared filter panel (`form[appFilterPanel]`, block 4), outside the row
frame. Body-appended dropdown and calendar overlays stay visible despite the bounded overflow
(blocks 16 and 17).

#### Financial summary/action strip

Totals are one compact strip directly below the table, outside the frame, so totals and Save
stay visible while rows scroll. The strip uses the **shared accounting summary classes** from
`src/styles.scss`, the same ones reports use (block 20). A feature writes no summary CSS:

```html
<div class="sigma-report-summary-bar" aria-live="polite">
  <div class="sigma-report-totals">
    <div class="sigma-report-total sigma-report-total--debit">
      <span class="sigma-report-total__label">{{ 'openingBalances.totalDebit' | translate }}</span>
      <strong class="sigma-report-total__value">{{ totalDebit() | money }}</strong>
    </div>
    <div class="sigma-report-total sigma-report-total--credit">
      <span class="sigma-report-total__label">{{ 'openingBalances.totalCredit' | translate }}</span>
      <strong class="sigma-report-total__value">{{ totalCredit() | money }}</strong>
    </div>
    <!-- --balance or --net only when the owning contract returns that value -->
  </div>
  <app-primary-action-button … />
</div>
```

- Debit and Credit are the base totals. Add `--balance` or `--net` only when the backend or the
  workflow owns that value and it is useful on the current tab.
- The Debit/Credit accents (`--sigma-debit-*`, `--sigma-credit-*`) are presentation only, not
  success or error states. Attach no success/error icon, copy or accessibility meaning to them.
- Values use the `money` pipe (`shared/pipes/money.pipe.ts`): 2 decimals, Latin digits, the
  backend's half-away-from-zero rounding, and tabular numerals from the shared class.

**Financial collection check:** one `app-feature-title` · server-owned context is read-only
header metadata · filters are the shared filter panel · `[fillHeight]` + `[stickyHeader]` and
no feature rule on the table frame, `thead` or host · no page-height `calc(100dvh …)` · one row
scroll owner · totals and Save outside the frame, in the shared `sigma-report-summary-bar` with
the `money` pipe · Debit/Credit colours stay non-semantic · RTL logical properties,
narrow-screen stacking and dark theme from the shared tokens.

**One binding style per row (G9, 2026-10-01).** A row template binds the row once, with
`<ng-container [formGroup]="row">` (or `[formGroupName]="i"` under `formArrayName`) around its
cells, and uses `formControlName` in every cell. Mixing `[formGroup]` on one cell with
`[formControl]` on the others is a finding.

---
