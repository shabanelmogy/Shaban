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
| `columns` | Required ordered header definitions; `numeric` applies the compact numeric-column class and `required` renders the required marker |
| `emptyMessage` | Required translated-key empty-state message |
| `emptyIcon` | Optional decorative Bootstrap icon for the empty state |
| `editable` | Shows the Add action, action column, and Remove buttons when true |
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
Handle removal as a request and confirm before mutating:

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

**Check:** shared component and row directive are both imported · the actions
directive is imported when custom actions are projected · column order matches
projected cell order · row template emits cells, not a row · translation
keys exist · collection-level blockers use the shared `validationMessage` alert · `editable` is false in View mode · Add prerequisites use
`addDisabled` · feature confirms Remove (block 11) before mutation · feature
marks the parent dirty and maps the collection into the write payload ·
`fillHeight` is used only inside a bounded flex parent · `maxHeight` and
`overflow-y: auto` keep row scrolling inside the table · totals/summaries remain
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

#### Grow until the footer, then scroll rows internally

The desktop card grows naturally while the row count is small. It must not force
an empty full-height workspace when only a few rows exist. As rows are added, the
workspace may grow until the available authenticated-shell height is reached.
After that point, the browser page must not keep growing for those rows: the
editable table frame becomes the vertical scroll owner.

Keep header, tabs, state banner, compact filters, financial summary and primary
Save action outside the row-scroll frame. Keep table headers sticky inside that
frame. The required flex-shrink chain uses `min-height: 0` on every shrinking
ancestor between the route/card and the table frame; missing one link usually
causes the page itself to grow despite `overflow: auto` lower in the DOM.

Prefer inheriting the bounded authenticated shell established in block 1. When a
route truly needs a local grow-until-cap boundary, apply one route-level
`max-height` using the existing Metronic shell variables; do not repeat viewport
calculations in tab components or child forms:

```scss
.financial-editor-page {
  box-sizing: border-box;
  display: flex;
  min-width: 0;
  min-height: 0;
  max-height: calc(
    100dvh - var(--bs-app-header-height, 74px) -
      var(--bs-app-toolbar-height, 55px) -
      var(--bs-app-footer-height, 60px) - 60px
  );
  flex-direction: column;
  overflow: hidden;
}

.financial-editor-card,
.financial-editor-content,
.financial-editor-tab,
.financial-editor-tab > form {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
  overflow: hidden;
}

.financial-editor-content app-editable-collection-table,
.financial-editor-content .app-editable-collection-table {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
}

.financial-editor-content .app-editable-collection-table__frame {
  min-height: 0;
  flex: 1 1 auto;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable both-edges;
}

.financial-editor-content .app-editable-collection-table__frame thead th {
  position: sticky;
  z-index: 1;
  top: 0;
}
```

The final `60px` above is breathing room for the current shell, not another
footer. Use the actual existing layout variables and the closest approved screen
when the shell changes. The `55px` in `var(--bs-app-toolbar-height, 55px)` is a
CSS fallback only — the shell sets that variable on `:root` (`31px` on desktop,
kept in step with the toolbar band in block 1), so a bounded editor picks up the
current band without being edited. Never treat the fallback as a measurement of
the toolbar. Never create page scroll plus table scroll for the same
row set. On narrow/mobile layouts, rearrange the editor (stack panes, reduce
filter columns) but keep it bounded: the page never scrolls (block 1, *No page
scroll*), and the row frame stays the single vertical scroll owner.

#### Compact filters inside financial editors

The filter strip in a routed financial editor is the block 4 compact filter
strip — same surface, same uniform field grid, same semantics. Block 4 is the
single authority for that pattern; do not keep a second copy of the spec here.

Two points are specific to this bounded shape:

- body-appended dropdown and calendar overlays must remain visible despite the
  bounded editor overflow, and still follow blocks 16 and 17;
- on narrow screens the Search/Reset actions may use an equal-width two-column
  row when both are present.

The strip stays outside the row-scroll frame and must not become another
vertical scroll owner.

#### Financial summary/action strip

Do not render financial totals as one unstructured sentence. Place a compact
summary strip immediately below the scrollable table and keep it outside the
table frame so totals and Save remain visible while rows scroll. Debit and Credit
are the base accounting totals for this shape. Add Balance or Net only when that
value is deliberately owned by the backend/workflow and useful on the current
tab; do not invent a third card merely to fill the strip.

```html
<div class="financial-summary-bar">
  <div class="financial-summary-items">
    <div class="financial-summary-item financial-summary-item--debit">
      <span class="financial-summary-label">{{ '...' | translate }}</span>
      <strong class="financial-summary-value">{{ totalDebit() | number:digitsInfo() }}</strong>
    </div>
    <div class="financial-summary-item financial-summary-item--credit">
      <span class="financial-summary-label">{{ '...' | translate }}</span>
      <strong class="financial-summary-value">{{ totalCredit() | number:digitsInfo() }}</strong>
    </div>
    <!-- Optional: add --balance/--net only when the owning contract needs it. -->
  </div>
  <app-primary-action-button ... />
</div>
```

Current Sigma financial-summary geometry is compact: `8-10px` strip padding,
`8px` radius, normal border and soft surface. Individual totals use about `132px`
minimum width, `6px 10px` padding and `7px` radius. Labels are muted and about
`9px`; values are about `14px`, weight `800`, and use
`font-variant-numeric: tabular-nums` so monetary columns do not visually jump.

Accounting accents are presentation only:

- Debit: green accent (`#2f9d72` border / `#237b59` light value /
  `#7fd6b2` dark value);
- Credit: warm accent (`#c46a52` border / `#9e503d` light value /
  `#f0a28d` dark value);
- Optional Balance/Net: Sigma primary family (`#176f9d` light / `#8fd7f5` dark).

Debit green and Credit warm/red are **not** Success/Error semantic states. Do not
attach success/error copy, icons or accessibility meaning to them based only on
color. Totals use the same backend-driven monetary precision policy as row
inputs; never introduce a separate frontend rounding rule.

**Financial collection check:** one `app-feature-title` · server-owned context is
read-only header metadata · Opening-Balances accounting filter surface retained
without copying its semantic/accessibility gaps · labels correctly associated
with controls · approved overlays remain unclipped · shared editable collection
component retained · complete `min-height: 0` flex chain · one internal row
scroll after the workspace cap · sticky table header · Debit/Credit plus only
contract-owned optional Balance/Net · totals and Save outside the scroll frame ·
tabular monetary values · backend monetary precision · Debit/Credit colors remain
non-semantic · RTL logical properties, narrow-screen behavior and dark equivalents.
---

