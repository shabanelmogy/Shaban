<!-- Part of UI block 4: see ../04-filters.md. Same status and authority as the block. -->

**Shared title/filter card paint.** The list filter,
report filter and `app-feature-title` reuse `--sigma-filter-panel-background`:
135deg primary5% wash fading to transparent at42%, over the themed filter surface.
Declare this derived token at both `:root` and `[data-bs-theme='dark']` so it
resolves the surface in the active theme scope before descendants inherit it.
All three consumers use the existing themed border/shadow and logical-start
3px primary accent, with8px radius. Filter geometry/controls remain their owning
shape's responsibility; title placement is block3/20. Do not copy the paint or
declare a separate feature/title palette.

**Check and choice fields.** A boolean filter is `div.sigma-filter-field.sigma-filter-field--check`
with the checkbox **before** its label, aligned on the control line. A radio group is
`fieldset.sigma-filter-field.sigma-filter-field--choice` with a `legend` and a
`.sigma-filter-choice-options` row; add `--wide` when the options need two columns:

```html
<div class="sigma-filter-field sigma-filter-field--check">
  <input id="lease-inactive" type="checkbox" formControlName="isInactive" />
  <label for="lease-inactive">{{ 'lease.filters.inactive' | translate }}</label>
</div>

<fieldset class="sigma-filter-field sigma-filter-field--choice sigma-filter-field--wide">
  <legend>{{ 'lease.filters.period' | translate }}</legend>
  <div class="sigma-filter-choice-options">
    <label><input type="radio" formControlName="period" value="open" /> {{ 'lease.filters.open' | translate }}</label>
    <label><input type="radio" formControlName="period" value="closed" /> {{ 'lease.filters.closed' | translate }}</label>
  </div>
</fieldset>
```

**Checkbox vertical centering.** In a filter row
with text inputs, dropdowns or a date range, the checkbox square's vertical
centre must match the centre of the neighbouring **control boxes**. Centre its
adjacent label with the square. Do not align it to the labels above those boxes,
the bottom of a grid cell, or the whole field height including validation
feedback. Keep the native 15px checkbox; do not stretch it to the 34px input
height. Reserved FieldError feedback must not move the checkbox when shown.

The shared filter-panel owner must account for label space and control height;
do not copy feature offsets, arbitrary padding, transforms or `!important`
overrides into new screens. Check alignment with and without date feedback,
in LTR/RTL, light/dark and wrapped layouts; a checkbox on its own wrapped row
must not retain space intended for an absent neighbouring label. The owner's
ProcessedPayrolls screenshot and repeated centering request establish the
desired visual behaviour. Its current local `.payrolls-filter-pending` override
(`padding-block-start: 24px`) is implementation debt, not a reusable sizing
rule or proof of shared conformance. Leave now adopts stable inline actions
with `inlineActionCaption="general.actions"`. For that combination the shared
`--check` layout reserves the same 0.72rem/1.5 heading track and 4px gap as
the adjoining labels, then centres the 15px square and its text in a
`--sigma-filter-control-height` track. FieldError stays outside this track.
At 720px and below the heading reservation is removed for standalone checkbox
rows. The owner's RentalAgreement request (2026-10-27) extends the same
heading/control tracks to direct checkbox fields in mixed stable main or
advanced grids, independently of inline actions. The shared owner detects
adjoining labelled fields; consumers need no new opt-in or feature offsets.
Checkbox-only grids and nested grouped checks keep their existing layout.
At720px and below, remove the heading reservation for these direct checkbox
fields as well. Keep the finite control track independent of reserved date
feedback, native size, associated labels, RTL and theme. This is a source-only
implementation; owner visual/RTL/theme acceptance remains pending.

For a derived source-use dropdown, include every frozen server status, including
No Quantity, Open, Partially Used and Closed; clear means all. Preserve the value
in route state and reset it with other filters. The backend applies it before
count/page/export (BE9); Purchase Request is the first example.
