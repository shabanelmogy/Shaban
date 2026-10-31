## 14. Editable collection table

**Shared first-cell freeze (owner slice, 2026-10-23).** The shared editable
collection table freezes its first rendered cell at the logical start of its
existing native row frame while horizontal scrolling. The existing projected
cell order, Actions column, form row identity and validation layout remain intact;
the table does not reorder cells or replace the native form table with PrimeNG.
The freeze is presentation-only and follows the table's current RTL/theme and
scroll ownership. Editable collection rows are never filtered by the read-table
column menu: every `FormArray` row remains present at its original index so
validation, focus, removal confirmation and payload mapping keep their contracts.

> **Status: Canonical**

**Shared mock heading action (owner follow-up, 2026-10-13; UI13):** a table in
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

**Credit Cards consumer widths (owner request, 2026-10-13):** Individual/Company
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

Attachment rows retain one34px control track (UI18): file box and projected
View align horizontally, and the shared table's Remove uses that same height
at the top of its action cell. FieldError grows below the track without moving
Remove down to the middle of the larger row. Keep actual td/table semantics
and the existing removal/confirmation output; never turn the td into a feature
flex container or duplicate row Delete inside the file control.
The2026-10-23 validation-row refinement below extends this first-track behavior
to all cells in FieldError/FileField rows; the global middle rule requires the
shared scoped important override. Attachment tables
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

### Bounded row scrolling in routed editors (owner clarification, 2026-10-15)

For every new or reviewed similar master-detail editor, verify the complete
height chain, not just the table inputs. Use the bounded route/form/body from
UI1 and a remaining-space FormSection host with `[fill]="true"`. Its content
is already a bounded flex column. Every intervening table-area wrapper must
also be a bounded flex column: use existing `sigma-editor-pane` from UI1,
plus only the feature's workspace allocation. A wrapper with `flex:1` and
`overflow:hidden` but `display:block` does not pass allocated height to its
fillHeight child: extra rows can grow inside it and be clipped without a
vertical scrollbar. Do not solve that by increasing a pixel height or enabling
page scrolling.

Reserve header space independently of row count. In a stacked editor with a
bounded header share, that header must not shrink to feed the collection's
intrinsic height; keep its workspace allocation non-shrinking. Give the
remaining-space details host a zero flex basis (`flex:1 1 0; min-height:0`),
not an auto basis derived from all rows. Carry the zero basis through the
intervening table-area wrapper. Otherwise large row counts can consume the
header allocation and make Basic Information disappear even after the inner
wrapper becomes a flex column. The feature owns the header share (Purchase
Requests retains40%); do not impose a universal pixel height or ratio on other
screen shapes. Verify header visibility and row scrolling together. This rule
describes the stacked variant: Purchase Requests subsequently moved to the
owner-selected full-height tabs in UI13 and no longer uses a40% header basis.

```text
bounded editor body
  → remaining-space app-form-section [fill]=true
    → shared section content (flex column, min-height:0)
      → optional table-area.sigma-editor-pane (flex column, min-height:0)
        → app-editable-collection-table [fillHeight]=true [stickyHeader]=true
          → shared fill root → shared frame (overflow-x/y:auto)
```

The frame owns both horizontal and vertical scrolling, with sticky column
headers. Keep section title/Add actions above it, and document totals/footer
outside its scrolling rows. Do not wrap the same collection in
`sigma-editor-scroll` or add feature selectors for the shared frame. Preserve
the print lifecycle that releases bounds and prints the complete saved rows.
Other scrolling sections (such as header fields/documents) have their own
separately bounded region; they do not scroll these rows.

Source verification traces every rendered wrapper, including conditional
wrappers, through host and component styles. Owner runtime acceptance must add
enough rows to exceed the available height, reach the last row with the table's
vertical scrollbar, reach the last column horizontally, and confirm fixed
section actions/totals/footer and sticky headings. Cover Create/Edit/View,
empty/error rows, short heights, responsive boundaries/intermediate widths,
RTL/themes and complete printing. Source-only checks cannot certify a visible
scrollbar. Purchase Requests supplies the missing-wrapper evidence; existing
out-of-scope consumers adopt this rule when implemented or reviewed.

### Complete report print flow (2026-10-27; UI21)

Mark a printed EditableCollectionTable host with the existing `sigma-print-flow`
class. Its shared print rules release the host, inner fill wrapper and scroll
frame, override max-height/table/column minimum widths, unstick cells, wrap long
text and use white paper with dark text in either theme. Toolbar actions,
validation, required markers and row Actions columns do not print; headings and
all projected rows remain. Projected business cells/data still belong to the
consumer. No new input, local shell rule or separate print lifecycle is needed.

The consumer prepares all mode-applicable rows/panels through UI21's existing
ReportPrintService session, marks every outer bounded wrapper for print flow and
keeps the on-screen fill/scroll contracts. This class does not fetch, unslice or
restore rows omitted from the DOM. The component uses ViewEncapsulation.None, so
its rules are scoped through `app-editable-collection-table.sigma-print-flow`,
not an ineffective `:host` selector. Lease Agreement adopts this for all four
saved sections; full multi-page/RTL/theme output remains owner acceptance.

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

**One control height and stable validation rows (owner correction,2026-10-23).**
Inputs, dropdowns and calendars retain exactly --sigma-editor-control-height
(34px). UI6's middle default still owns headers, empty rows and body rows
without inline feedback/FileField. For every shared editable body row containing
`app-field-error`, existing `.sigma-field-error` feedback, or `app-file-field`, the shared stylesheet top-aligns every
cell with a scoped important override of the global middle rule. A wrapped
error expands below the first control line without lowering neighboring
controls, read badges, files or generated actions. Preserve table/td display,
7px/9px cell padding, full inline errors, horizontal alignment and payloads.

The shared Remove uses the34px control height on these rows. A direct standalone
15px checkbox is block-level with logical top margin equal to half the
control-height/checkbox-height difference; its square stays centered on the
first control line. Captioned checks keep the existing34px __row-check wrapper.
Outside these rows, standalone checkboxes retain zero margins and middle
alignment. This generalizes the2026-10-22 file/action-only exception and
supersedes whole-field/error centering for these validation-capable rows only.
No consumer opt-in, feature row CSS, detached error, fixed error height or
legacy --sigma-editable-cell-vertical-align extension point. Verify required,
date-order and upload errors, multiline feedback, flags/actions, View, narrow
widths, RTL/themes and print; source conformance is not runtime acceptance.

**Existing inline feedback compatibility (owner correction,2026-10-24).** The
same three row predicates cover the existing `.sigma-field-error` marker:
cell alignment, shared Remove height and standalone checkbox offset. This
prevents conditional handwritten feedback from centering a taller control/error
group beside another field. All shared consumers inherit it without opt-in;
ordinary rows retain middle alignment. New or reviewed feedback still uses
UI19's `app-field-error`; compatibility is not a new markup pattern. Evidence:
Link Accounts Prepaid Expense and the shared stylesheet; source-only visual
acceptance pending.

**Numeric cells (owner request 2026-10-04).** Numeric inputs select their value
on entry through the shared global selection owner (block 27); native
`appNumericFocus` supplies appearance only. Use shared
`app-editable-collection-table__value` for numeric read/derived text: the same
34px control line, 9px inline inset, 12px tabular figures and LTR numeric text.
Read/derived figures are centered under their centered numeric headings;
editable input text retains the right alignment from block27. It remains text without an editable field
border or focus target. Preserve `money`/number formatting and calculation
ownership; feature styles must not recreate the treatment. Job and
JobEstimation item price/labour charges and numeric View cells adopt it.

**Optional numeric units (Rental Booking owner correction, 2026-10-07).**
For a composite cell with a selection/title and several labelled controls,
use shared `app-editable-collection-table__cell-heading` (34px control track,
8px gap), `__details` (8px grid gap and logical top separation) and
`__detail-row` (shrinking label,156px control rail,8px gap). The first child label
centres beside the control; the remaining child owns its input-unit group and
FieldError below it. Use existing `__input-unit--fixed` for the96px number and54px
neutral unit rail. Do not leave full-width InputNumbers and empty spacer spans
inside a wrapping feature flex row. In the default scroll mode allocate enough
type-column/table minimum width for the labels and controls; preserve horizontal
frame scroll and row identity. The explicit fitWidth variant below replaces those
minima with responsive labelled cells. Selection labels use unique inputId/for; editable/read-only/disabled
and validation stay feature-owned. Keep Rate and Charges in their own standard
columns even when an auxiliary overtime/mileage field is present. A details
cell can use a one-column sigma-editor-grid for longer delivery/address fields.
The shared owner provides geometry/RTL/token inheritance only; no mileage,
pricing or write rule is introduced. RentalAgreement adopts this in routed and
embedded entry. Existing consumers without these classes keep their presentation.
Owner2026-10-28; source-only, narrow/RTL/theme/input/validation acceptance pending.

**Optional fit-width rows (owner2026-10-28).** When the owner explicitly requires
no horizontal scroll for a bounded editable collection, reuse the existing table's
`fitWidth=true`. Default false preserves other financial tables' scrolling
contract. Fit mode ignores `tableMinWidth` and column `minWidth`, uses a fixed
available-width table with proportional `column.width` values and wrapping
headers, and removes the shared numeric header's180px preference. Consumers
provide shrinkable controls and translated `data-column-label` on each projected
td; the shared actions cell supplies its own translated label. Do not hide form
overflow, omit fields or write a feature-local table skin.

The shared table owns the named inline container: at640px or below each native
row becomes a stack of full-width labelled cells, retaining header scope and
table role for assistive reading, stable row/control identity and one vertical
frame scroll. Reset logical first-cell stickiness only in that narrow fit mode.
At400px or below, shared composite detail label/control rows stack too. Keep
number/unit groups, errors, busy/disabled and feature events unchanged; long
content wraps. Screen-only container reflow leaves native print presentation.
Fit styles follow default table rules so width, header and sticky overrides
actually win. Percent columns are required for the fluid wide variant; do not
carry a pixel width/minimum that defeats the approved fit contract.

RentalAgreement's shared page/opening form opts in with50/30/20percent type/rate/
charge columns, superseding only its earlier725px table minimum. Other consumers
keep their existing opt-in/default contract. No new rows, pricing, API, cache or
permission rule. Source-only; owner container-width/keyboard/screen-reader/RTL/
theme/input/validation/print acceptance remains pending.

Pair a shrinking numeric input and `span.app-editable-collection-table__unit`
inside `app-editable-collection-table__input-unit`. Shared styling retains the
existing34px control line,6px gap and a non-shrinking10px muted unit with isolated
LTR unit text. For a read/derived badge, add `__value--with-unit` and the same
unit span. Units are neutral captions, never the generic red `small` validation
style. Keep FieldError below the input group. These classes are opt-in; existing
consumers and all parsing, precision, calculations and payloads are unchanged.
Rental Booking adopts this for Rate and protection excess; native reactive
checkboxes reuse the existing15px primary accent and34px `__row-check` label.
Source-only; owner input/RTL/theme/visual acceptance pending.

**Optional equal numeric widths (Rental Booking owner correction, 2026-10-07).**
Use `__number` on a numeric input/InputNumber host inside `__input-unit` or on a shared numeric
value badge, with a consumer-local `--sigma-editable-number-width` on the table
host. Shared width/max-width/flex bounds apply the same chosen width to input
and read text; `__input-unit--fixed` centers the number/unit group and keeps
units outside the numeric box in a fixed54px unit rail, so varying unit labels
never move neighboring numeric boxes. Default consumers are unchanged. Choose a width
that fits the table's narrowest numeric column after shared cell padding, and
retain the internal table scroll and all formatting/controls/calculations.
Booking selects96px within its existing620px table minimum; consumer detail-row
geometry leaves room for units, not feature-owned input/badge CSS. Source-only;
owner visual/RTL/theme/input acceptance pending.

**Editable numbers (application-wide owner expansion,2026-10-23).** The former
quantity-only rule now applies to every editable numeric role. Use
`p-inputnumber appQuantityInput` with direct `InputNumberModule` and
`QuantityInputDirective` imports (block 27). The shared directive/styles own
compact stacked increase/decrease buttons, the 34px control line and numeric
alignment; feature columns retain their current widths. Keep existing integer
or decimal precision, min/max/step, typed row controls and validators. Native
row recalculation moves to `onInput`, which follows the widget's CVA update for
typing and stepping. Do not replace Remaining Quantity/derived/View text with
editable widgets or recreate the widget/rail in feature SCSS.

**Shared quantity/hour/meter precision (owner foundation decision,2026-10-30).**
The product is being established and its current data is experimental: prefer
one shared contract over preserving accidental per-screen precision. Classify
each reviewed numeric field by its real domain. Quantities, fractional hours
and meters use `QUANTITY_DECIMAL_PLACES` (6) from
`shared/utils/quantity-number-policy`, `quantityKind="quantity|hours|meter"`
on the existing `appQuantityInput`, and the same constant for the widget's
`maxFractionDigits` and typed-form scale validation. A genuine whole count uses
`quantityKind="integer"` and zero fraction digits; identities keep their actual
transport validator. A domain-specific lower precision requires a recorded
domain reason, not compatibility with experimental values.

The directive validates scale together with existing min/max and revalidates
when the role, bounds or widget precision change. `decimalScaleValidator`
(block19) also covers headless/dynamic typed forms. Neither changes submitted
values. Sign, range, step and hour-to-charge calculations remain domain-owned;
fractional hours are decimal hours (1.5 means one and a half hours), not HH.MM.
Money, tax, exchange rates and percentages retain their distinct policies:
the appearance directive's generic20-digit fallback is not their domain policy.
Unclassified controls must be classified when their screen is reviewed; changing
every numeric widget to a quantity would change financial and identity contracts
without evidence. This is an inventory gap, not an experimental-data exception.

Backend ownership is BE18's `QuantityNumberPolicy` (18,6 storage/scale and
explicit derived rounding). General preview rounding is extracted into
`decimal-number.util`; financial previews retain the same `roundMoney` API and
results. Reuse these owners instead of feature-local `Math.round` or literal6
validators. Equipment work sheets and agreement preparation adopt this contract;
other domain models require their paired API/storage reconciliation before
accepting fractions. Source conformance is separate from compiler/runtime and
owner migration verification.

**Read-only numeric blue badge (owner generalization, 2026-10-04).** In new or
reviewed editable collection rows, every non-editable numeric value uses
`app-editable-collection-table__value app-editable-collection-table__value--highlight`
and its column declares `numeric:true` (shared default center; an explicit
`align:'center'` is also valid). This includes server-owned
Remaining Quantity, derived Amount/Tax/Gross and numeric cells rendered as text
in View. The shared owner keeps the figure centered under its heading with
themed title text, a 12% primary/surface blue tint, 700 weight and 6px radius on
the same 34px control line. Reuse the existing Job/JobEstimation Price/Charges
appearance; do not add local badges, colors or cell CSS. Editable Quantity/Unit
Price remain numeric controls. The badge is plain text, without button semantics
or a focus target; preserve zero, null/blank handling, number/money formatting,
backend authority and payload/calculation ownership. This is an editor-row
presentation rule; DataTable/report formatting and SummaryCards keep their own
owners. Existing unrelated consumers migrate on review. The requisition-owned
Create Purchase Request adopts it for Remaining Quantity/Amount/Tax/Gross.
Source-only; owner visual/RTL/theme/print acceptance pending.

**Heading/value alignment (owner application-wide instruction, 2026-10-04).**
Numeric shared table headers and plain `td.is-number` default to center; the
shared value class also centers by default. Existing explicit column alignment
remains supported, but any justified deviation must keep heading and read value
aligned together. Do not show View Quantity at the inline edge under a centered
or start-aligned heading. Every numeric read/derived cell uses the existing blue
highlight; current plain shared value spans in ItemRequisition, its Issue dialog,
ItemIssue and Workshop Job/Estimate adopt it. Reuse this owner across screens,
without per-feature offsets, padding tricks or cell CSS. Other DataTable/report
and summary owners retain their contracts; input digits remain right-aligned.

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

Totals are one summary-card region directly below the table, outside the frame,
so totals and Save stay visible while rows scroll. New or reviewed financial
summary cards use the shared `app-summary-cards` owner from UI 20/24; the feature
passes typed authoritative values, translated labels/suffixes and placement only
and writes no card CSS:

For a master-detail workspace where totals compete with row visibility, select
the shared `density="slim"` (UI24), `layout="row"`, `[minCardWidth]="140"`
and `[maxHeight]="80"`. This keeps horizontal icon/copy, smaller figures and
padding in the shared owner, with wrapped totals accessible through its own
keyboard-focusable scroll. Workshop Job/Estimate/WorkOrder adopt this on the
owner's 2026-10-04 instruction; source-only, visual acceptance pending.

```html
<app-summary-cards
  [ariaLabel]="translatedSummaryLabel"
  [cards]="summaryCards()"
  density="compact"
  [minCardWidth]="190"
/>
<app-primary-action-button … />
```

`summaryCards()` uses `format: 'money'` for Debit/Credit/Balance-or-Net values;
the shared `formatMoney`/MoneyPipe owner keeps two Latin decimal digits and the
backend's half-away-from-zero display rounding. For a signed balance whose
contract uses Dr/Cr, the feature supplies absolute magnitude plus the matching
translated suffix key; do not change the sign convention of other totals.
The component never derives or replaces accounting totals; the
shared formatter applies only the approved display rounding.
Debit and Credit are the base totals; add Balance or Net only when the backend or
workflow owns that value and it is useful on the current tab. The Debit/Credit
accents (`--sigma-debit-*`, `--sigma-credit-*`) remain presentation only, never
success/error states, and receive no success or error icon, copy or accessibility
meaning.

The former `sigma-report-summary-bar` markup remains compatibility guidance for
out-of-scope legacy consumers only. New/reviewed editors use `app-summary-cards`
even when the screen is editable; shared cards preserve the existing formulas,
authoritative values, money formatting and token palette.

**Financial collection check:** one `app-feature-title` · server-owned context is read-only
header metadata · filters are the shared filter panel · `[fillHeight]` + `[stickyHeader]` and
no feature rule on the table frame, `thead` or host · no page-height `calc(100dvh …)` · one row
scroll owner · totals and Save outside the frame, with totals in `app-summary-cards` and
the shared money formatter · Debit/Credit colours stay non-semantic · RTL logical properties,
narrow-screen stacking and dark theme from the shared tokens.

**Pending row confirmations (Accounts review, 2026-10-05).** Shared
`EditableRows.confirmationPending` exposes the pending removal decision so an
aggregate can block Save, tab switching and navigation. `canMutate` is rechecked
before opening confirmation and after acceptance; acceptance re-resolves the
same row object's current index. An obsolete confirmation cannot remove another
row or mutate a submitted snapshot. Untouched new rows retain direct removal.
The feature still guards Add and owns its typed form, payload and domain locks.
These optional hooks preserve other consumers' behavior. Source-only; owner
runtime acceptance pending.

**One binding style per row (G9, 2026-10-01).** A row template binds the row once, with
`<ng-container [formGroup]="row">` (or `[formGroupName]="i"` under `formArrayName`) around its
cells, and uses `formControlName` in every cell. Mixing `[formGroup]` on one cell with
`[formControl]` on the others is a finding.

---


### Contextual confirmation forms (2026-10-09)
`EditableRows` may receive `confirmationForms` when `freezeParentOnConfirmation` is enabled. The optional forms are frozen with the parent through the shared plural helper; the default remains unchanged. Use this only where row operations depend on a separate customer/category/context form. Preserve row identity re-resolution, saved-row confirmation and canMutate checks. Source-only evidence: Limousine tariff context and TripBooking documents.
