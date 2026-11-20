## 14. Editable collection table

**Topic files of this block** (read only the one the task needs; they are part of this block):

- [Bounded row scrolling and complete report print](14/01-bounded-scroll-and-print.md)
- [Public inputs](14/02-public-inputs.md)
- [Row mechanics (EditableRows)](14/03-row-mechanics.md)
- [Financial collection editor](14/04-financial-collection-editor.md)

**Row-specific removal guards (2026-11-07).** The existing EditableRows utility
accepts optional `canRemove(row)` in addition to the editor-wide canMutate. It
checks the actual row before a confirmation and again before removal, after
resolving its current index. `onRemoving(row,index)` runs only for an accepted
actual removal, immediately before removing it. Use it for local attachment
tracking, not an extra DELETE/confirmation implementation. Fleet documents
require the editor grant plus cleanup access only for a row with a file;
pathless rows retain ordinary removal. Keep context cancellation, form freeze,
parent dirty state and existing onRemoved behavior. Omitted hooks preserve the
existing contract. UI18 owns Media request lifetimes and deferred cleanup.
The table's optional `removeAllowed(row,index)` applies that same row rule to
the default Remove button and rechecks it inside remove(index), including
direct calls. It hides an unavailable row action without removing the row or
its data; editable/removeDisabled and projected custom actions retain their
existing ownership. Reuse a feature's one row predicate for this input and
EditableRows.canRemove rather than duplicating rule logic or file action markup.

**Shared Add-action clearance.** The existing collection
toolbar-actions group supplies6px block and8px inline padding with border-box
sizing. This leaves space around Add and its peer actions in every consumer,
including Transportation's schedule, without changing the shared button's
geometry,10px action gap, wrapping, split-toolbar order or print suppression.
Do not add a per-screen margin or opt-in for this shared presentation. Narrow
widths, RTL and both themes still require owner visual acceptance.

**Shared first-cell freeze.** The shared editable
collection table freezes its first rendered cell at the logical start of its
existing native row frame while horizontal scrolling. The existing projected
cell order, Actions column, form row identity and validation layout remain intact;
the table does not reorder cells or replace the native form table with PrimeNG.
The freeze is presentation-only and follows the table's current RTL/theme and
scroll ownership. Editable collection rows are never filtered by the read-table
column menu: every `FormArray` row remains present at its original index so
validation, focus, removal confirmation and payload mapping keep their contracts.

> **Status: Canonical**

**Shared mock heading action:** a table in
the nearest MOCK_DATA_CONTEXT registers its host/heading visibility and composes
MockDataAction in its existing toolbar. Existing supported row controls become
section-scoped; tables without context keep their behavior. Add/Remove, columns,
row templates, validators and payload owners remain. Actions wrap within the
existing narrow-screen toolbar. Owner clarification supersedes automatic empty
Credit Cards preparation: add a row through Add Credit Card/Add Document first,
then show Generate only when supported rendered controls are available. Removing
the final row hides it again. Generate never creates rows; mockDataPrepare and
the empty-row availability bypass are removed. Individual/Company retain their
existing EditableRows.add path and its prerequisites. View/disabled/global
settings/pending gates remain; Cancel/failure retains entered values/row count.
UI13's explicit marked-input exception enables synthetic Card Number/CVV;
unmarked payment inputs and ordinary password exclusions remain. Source-only;
owner interaction/visual/RTL/theme acceptance pending.

`shared/components/editable-collection-table` is the single owner of compact
editable collection chrome. It renders the optional heading icon, title and
hint, shared primary Add action, collection-level validation alert, translated/required headers, responsive table
shell with an optional minimum width, default Remove or projected row actions,
empty state, and light/dark styling. The feature projects only its typed data
cells/actions and retains all domain behavior. CompanyPartner uses the same
component for contact persons, credit cards, documents, and the driver summary;
do not copy their former `company-editable-table` markup.

Projected collection toolbar actions reuse the existing
`appEditableCollectionToolbarAction` slot beside Add (PO source action and GRN
source selector/Load). Preserve feature-owned form bindings and source guards.
Collection validation stays in the toolbar action flex flow, with shrinkable
width and wrapping text; never absolutely center it over projected controls.
Ordinary toolbars retain wrapping. The explicit GRN owner correction adds
`toolbarLayout="split"`: a single shrinkable row, projected source controls at
logical start and the shared Add action at opposite logical end. Collection
validation sits below that row; source-load errors stay in their own region.
Use this existing capability for equivalent source/detail toolbars rather than
copying Add or overriding shared selectors. Default layout remains compatible
with other heading/action compositions. GRN supplies only its bounded selector/
group width; shared controls retain labels, theme tokens and logical direction. Owner2026-10-24;
source-only, rendered responsive/RTL/theme acceptance remains pending.

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

**Credit Cards consumer widths:** Individual/Company
use the existing column width input for compact CVV76px/Is Default80px and wider
Name on Card240px/Bank Name220px. Card Type remains180px; remaining tracks flex.
Both card tables retain1280px minimum frame width so wider name inputs do not
compress remaining card/date controls; Company changes1100→1280. Existing shared
7px/9px cell padding,34px controls and frame horizontal overflow remain owners;
no feature cell CSS/font/order/validation change. Narrow layouts use that frame
scroll with existing767px toolbar behavior. Source-only visual/RTL/theme and
long input/error acceptance remains owner-pending.

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
        <p-select
          formControlName="itemId"
          [options]="partOptions()"
          optionLabel="value"
          optionValue="id"
        ></p-select>
      </td>
      <td class="is-number">
        <p-inputNumber
          appQuantityInput
          formControlName="quantity"
          [min]="1"
          [max]="2147483647"
          [step]="1"
          [maxFractionDigits]="0"
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

Attachment rows retain34px file/View controls (UI18) and matching Remove height.
Every cell centers vertically in the full row, including the file/View/error
group and neighboring text/checkbox/actions. FieldError grows below its control
in normal flow; it is part of the centered group. Keep actual td/table semantics
and the existing removal/confirmation output; never turn the td into a feature
flex container or duplicate row Delete inside the file control. The owner's
2026-10-31 correction below supersedes the old first-track alignment. Attachment tables
retain fixed table layout so a long unbroken file name shrinks/ellipsizes within
the existing column allocation; retain explicit colgroup widths and min-width
scroll contracts. Do not change unrelated text-only table layouts.

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

### Contextual confirmation forms
`EditableRows` may receive `confirmationForms` when `freezeParentOnConfirmation` is enabled. The optional forms are frozen with the parent through the shared plural helper; the default remains unchanged. Use this only where row operations depend on a separate customer/category/context form. Preserve row identity re-resolution, saved-row confirmation and canMutate checks. Source-only evidence: Limousine tariff context and TripBooking documents.

### Context-cancelled row decisions
Pass the editor's context-expiry stream as `confirmationCancelled$` when a
reviewed editor can outlive its session context. EditableRows tears down only
its pending removal confirmation, releases `confirmationPending` through
finalize, and retains its row-identity and `canMutate` checks. Keep the editor
invalid until reopened; do not restore an expired form through the finalizer.
The optional stream defaults to no extra cancellation for existing consumers.
It never owns HTTP writes or cancels a previously sent save. Payment rows and
Bill line/document rows adopt this hook; UI28 owns the surrounding session and
independent-write lifetime.
