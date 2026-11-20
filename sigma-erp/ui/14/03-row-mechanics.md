<!-- Part of UI block 14: see ../14-editable-collection-table.md. Same status and authority as the block. -->

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

**One control height and uniform vertical centering.**
Inputs, dropdowns and calendars retain exactly --sigma-editor-control-height
(34px). Every header/body/footer cell follows UI6's universal middle alignment,
including rows with `app-field-error`, existing `.sigma-field-error` or
`app-file-field`. This supersedes the2026-10-23/24 first-control-line exception:
remove its shared top!important override and checkbox top offset. Text, badges,
checkboxes, file controls and actions center in their row; a control and all its
inline feedback form one centered unit. Full wrapped feedback stays below the
control in normal flow. The shared toolbar centers its items vertically too.

Preserve table/td display,7px/9px cell padding,34px Remove on validation/file
rows,15px standalone checkboxes with zero margin, and existing captioned-check
wrappers. No consumer opt-in, feature cell CSS, detached error, fixed error
height or vertical offset. Existing `.sigma-field-error` compatibility remains;
new feedback still uses UI19's `app-field-error`. Horizontal alignment, widths,
identity, payload, theme, RTL and print remain owned by their existing contracts.
Evidence: owner LimousineTariff centering request and the shared source;
source-only, mixed heights/multiline errors/flags/actions/narrow/RTL/theme/print
visual acceptance remains pending.

**Numeric cells.** Numeric inputs select their value
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

**Optional fit-width rows.** When the owner explicitly requires
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

**Shared quantity/hour/meter precision.**
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

**Read-only numeric blue badge.** In new or
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

**Heading/value alignment.**
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
