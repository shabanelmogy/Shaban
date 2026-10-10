## 4. Filters

> **Status: Canonical** — one presentation: the shared filter panel (owner decision 2026-09-30,
> shared-first rewrite 2026-10-01). Reference: `Workshop/Job/components/list`.

One `<form>`, `[formGroup]`, `(ngSubmit)`. Every control labelled.

This block owns filter **semantics** for every filter shape and the one **presentation** of a
list filter strip: the shared filter panel below. A feature owns its fields, their order and
width, its form and its search logic, and nothing else. Colours, borders, surface, focus, dark
theme, RTL, responsive layout and motion belong to the panel and the `--sigma-filter-*` tokens
in `src/styles.scss`.

Two other shapes are shared as well:

- **Reports** use the global report strip `sigma-report-filter-panel` / `sigma-report-filter-field`
  / `sigma-report-filter-actions` (block 20). Its actions are Search, Refresh, Reset and Export.
- **Routed financial editors** (block 14) use the shared filter panel like a list.

All single-line filter controls use `--sigma-filter-control-height` (34px) from `src/styles.scss`,
in light and dark themes. This covers native inputs and selects, and PrimeNG dropdown, select,
multiselect, calendar and input-number. Keep a class ending in `-filters` or `-filter-form` on
the form, so the shared height rule applies. Checkbox, radio, file, button and textarea keep
their intrinsic size.

> **Legacy — do not copy.** Before 2026-09-30, screens drew their own filter strip in feature
> SCSS. There were two shapes: the "compact strip" (8px radius, inline-start accent, uniform
> `repeat(N, 1fr)` grid, Opening Balances) and the "flat 12-column grid" (Individual Partner). Both
> survive only on screens not yet reviewed. When a screen is reviewed, its strip becomes
> `form[appFilterPanel]` and its filter SCSS is deleted (Master block 5 gate). Their arrangement
> rule — every field one column, spanning groups explicit, no trailing gap — is what the panel's
> fixed grid and the `--wide`/`--full` modifiers now provide.

### Shared filter panel — main row, *More filters*, mandatory Reset

> **Status: Canonical** — component `shared/components/filter-panel` (`FilterPanelComponent`,
> `FilterAdvancedDirective`, `FilterActionsDirective`); reference screen
> `Workshop/Job/components/list` (owner decisions 2026-09-30). Plan:
> `reviews/SHARED_FILTER_PANEL_MAINTENANCE_EVOLUTION_PLAN.md`. Screens that still carry a
> feature-owned strip move to the panel in their own review.

Every list filter strip is the feature's reactive form with the panel attribute:

Import the actual owners separately; the component file is not a barrel:

```ts
import { FilterPanelComponent } from 'src/app/modules/shared/components/filter-panel/filter-panel.component';
import { FilterActionsDirective, FilterAdvancedDirective } from 'src/app/modules/shared/components/filter-panel/filter-panel.directives';
```

Register `FilterPanelComponent` and each used directive in the standalone
consumer's `@Component.imports`. `FilterAdvancedDirective` is needed only for
an advanced template. `FilterActionsDirective` is a real exported directive
in `filter-panel.directives.ts`; importing it from `filter-panel.component.ts`
produces TS2305 and cascading NG1010 errors. Fix that export path first, rather
than changing `tsconfig.app.json` or adding a shared re-export solely for a
miswired consumer. `Workshop/Job/components/list` supplies the actual reference
imports. Source inspection of exports/metadata is required in addition to the
markup comparison (block1).

```html
<form class="job-filters" appFilterPanel
      [formGroup]="filterForm" (ngSubmit)="search()"
      [advancedControls]="advancedFilterNames"
      [(advancedOpen)]="advancedFiltersVisible"
      moreFiltersLabel="job.filters.moreFilters"
      [busy]="loadingList()"
      (resetRequested)="resetFilters()">
  <div class="sigma-filter-field">
    <label for="job-no">…</label>
    <input id="job-no" type="text" formControlName="no" />
  </div>
  …                                   <!-- main row: at most six fields -->
  <ng-template appFilterAdvanced>     <!-- optional: shows the More filters toggle -->
    <div class="sigma-filter-field">…</div>
  </ng-template>
  <ng-container appFilterActions>     <!-- Export (sigma-secondary-button) + Search -->
    <button type="button" class="sigma-secondary-button">…Export…</button>
    <app-primary-action-button type="submit" … />
  </ng-container>
</form>
```

Rules:

1. **Fields.** Each field is `div.sigma-filter-field` (label + one control); `--wide` spans two
   columns, `--full` the whole row, `--check` a checkbox, `--choice` a radio group (below). The main row defaults to six columns for the most-used filters (number,
   date range, main lookup, status, branch); a reviewed inline strip may use seven when a
   wide date range and three status checks must remain on one row. The rest go in `ng-template[appFilterAdvanced]`,
   which keeps the feature form as parent and renders only when opened.
2. **One form.** Hidden filters stay in the same `FormGroup`: search, paging, route restore
   and export are unchanged; closing the panel resets nothing.
3. **Reset is mandatory.** The panel always shows Reset (inline-end, before the projected
   actions) and emits `resetRequested`; the feature restores **its** default values (for
   example current month and status Open), then searches page 1.
4. **More filters.** Shown only when an advanced template exists: an outlined pill with an icon
   chip, the label (`moreFiltersLabel`, default `general.moreFilters`), an active-count badge
   and a chevron rotating 180° when open; `aria-expanded`/`aria-controls`. The panel counts
   the `advancedControls` names with a non-empty value (after the feature restored its state
   and on every change) — the feature passes names only.
5. **Look and theme.** Owned by the panel and the `--sigma-filter-*` tokens in `src/styles.scss`
   (light in `:root`, dark in `[data-bs-theme='dark']`): strip surface/border/shadow, control
   border/surface/text/placeholder/focus, muted text, secondary text, toggle-icon colour/bg/
   active bg/ring (light: deep-blue icon on a soft tint; dark: white icon on primary). No filter
   colour, border or dark rule in feature SCSS; a `var(--x, fallback)` must never point at an
   undefined token.
6. **Layout and motion.** Main grid `mainColumns` (6), advanced grid `advancedColumns` (5, dashed
   primary-tinted panel, 160ms slide-in, none under `prefers-reduced-motion`); both 3 columns
   under `1250px` and one under `720px`, where the toolbar stacks. Logical properties only.
7. **Height.** The shared panel owns it: every single-line control inside `form[appFilterPanel]` (host
   class `sigma-filter-panel`) is 34px, with no feature class needed (owner request 2026-10-01: all filter
   boxes the same height). The `*-filters` / `*-filter-form` class rule remains only for legacy strips.

The shared primary button in `.sigma-filter-panel__actions` also consumes
`--sigma-filter-control-height` for its height/min-height, with border-box sizing
and zero block padding, matching the existing 34px Reset/Export buttons. The
PrimaryActionButton owns this context rule; features add no button-height CSS.
Its default outside filter actions remains unchanged. Budget Search adopts it
under the owner's 2026-10-05 height correction; visual acceptance is pending.

**Action spacing.** FilterPanelComponent owns the action flex-row gap through
its numeric `actionGap` input (pixels, default8), exposed internally as
`--sigma-filter-action-gap`. An explicit owner spacing request may select a
different value on the form; retain the shared default for other consumers.
The gap covers Reset and directly projected actions in both LTR/RTL and wrapped
rows. Keep `ng-container[appFilterActions]` so the buttons participate directly;
do not copy margins or action-toolbar CSS into a feature. Source inspection does
not certify visual spacing; desktop/narrow/RTL acceptance remains owner-pending.

**Field spacing.** `columnGap` optionally controls the horizontal gap shared by
the main and advanced filter grids (default `16px`). Use it for an explicit
screen density request such as a denser checkbox group; keep the shared
vertical gap and responsive stacking unchanged. Feature code selects the public
input, not a local filter margin or grid override.

**Stable editing layout.** New or subsequently reviewed filter forms must use `[stableLayout]="true"`
on `FilterPanelComponent`. The shared stable modifier top-aligns the main and
advanced grid fields, bounds PrimeNG dropdown/calendar hosts and roots to their
field width and lets dropdown labels shrink within it. Text or selected labels
must not define a field's width. It also reserves an invisible active-count badge
slot when the count is zero, retaining toggle/chevron geometry while editing.
The owner's 2026-10-04 instruction requires controls in the same row to retain
the same vertical alignment, including when feedback appears. Adoption begins
with Item Issue; screens before it were adjusted by the owner and are not
bulk-edited again. The shared default remains compatibility-only for untouched
consumers. Compare the actual label/control start lines for native input,
dropdown and date range, rather than accepting equal control heights alone.
Keep label markup/font/spacing consistent and do not push neighboring fields
down with a validation message. Columns,
breakpoints, gaps, 34px control height, theme and RTL remain shared. Validated
filters reserve their inline feedback through `app-field-error reserveMessage`
(block19), rather than local minimum heights, clipped messages or feature CSS.
Customers, Suppliers and Staff Balance Summary opt in under the owner's
2026-10-03 filter-stability request; source-only, visual acceptance pending.
Item Issue adopts the same shared reference as Workshop Job list: three main
fields, stableLayout=true and date feedback reserved with
`reserveMessage="validationMessages.date"`. Existing earlier screens, widths,
queries, toolbar placement and responsive breakpoints remain unchanged.

**Compact inline actions (owner request, 2026-10-05).** A simple search strip
may bind `[inlineActions]="true"` on the shared FilterPanelComponent to place
its existing Reset/actions beside the main grid, aligned with the input line.
This is default-off and is applied only without an advanced template; advanced
filters retain their separate toolbar. The shared layout owns a flexible main
grid and auto-sized actions, removes the empty toolbar-start placeholder and
uses configured mainColumns above 720px and stacks fields below it, keeping
actions beside the last input line without compressing several fields into
unusable narrow columns. Use it for short, simple unvalidated strips: LinkAccounts
uses one search field or two with its active-tab selector; OpeningBalances uses
1/2/3 columns for Suppliers, Customers/Deposit and Prepaid. Dense or validated
filters retain the normal responsive layout. Mandatory
Reset, busy state, resetRequested, labels, 34px control heights, theme and RTL
remain unchanged. Never duplicate Reset or restyle the shared toolbar locally.
**Validated inline actions — explicit owner placement, 2026-10-05.** A reviewed
short validated strip may combine inlineActions/stableLayout with the optional
`inlineActionCaption="general.actions"`. The shared toolbar reserves an invisible,
aria-hidden translated caption with the same single-line label font/line height
and4px gap, and top-aligns the grid/actions so feedback below a field does not
move the buttons. Field labels retain full accessible text with visual ellipsis;
validators and FieldError reserved feedback remain unchanged. Budget uses its
two configured field columns with Reset/Search/Export beside the input line.
Below720px this caption mode stacks actions below one-column fields and hides
the caption, retaining shared wrapping34px buttons/theme/RTL. Empty caption
retains the original unvalidated inline layout; advanced filters retain their
separate toolbar. No feature offset/padding or duplicated Reset. Source-only;
owner desktop/narrow/validation/visual acceptance pending.

Full-width workspace filter cards consume the UI3 workspace modifier so their
inline edges align with title, tabs and content cards.

**Shared title/filter card paint (owner request, 2026-10-03).** The list filter,
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

**Checkbox vertical centering (owner instruction, 2026-10-10).** In a filter row
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
rows. Other filter layouts retain their current presentation. This is a
source-only implementation; owner visual/RTL/theme acceptance remains pending.

**Request building.** Use a typed form, and send only non-empty values. `toListParams(query)` from
`shared/utils/list-query.ts` drops `''`/`null`/`undefined` and adds paging and sort (block 2).
Trim search text before building the query:

```ts
readonly filterForm = this.fb.nonNullable.group({
  branchId: this.fb.control<number | null>(null),
  search: '',
  isInactive: false,
});

private buildFilters(): FeatureListFilters {
  const value = this.filterForm.getRawValue();
  return {
    branchId: value.branchId,
    search: value.search.trim(),
    isInactive: value.isInactive || null,   // false is "no filter"
  };
}
```

Changing a filter always searches page 1. Date ranges follow block 17: one range picker, and the
default is the current month from the 1st to its last day (`currentMonthRange()`).

**Check:** the list filter strip is `form[appFilterPanel]` with `stableLayout=true` in new/reviewed screens · actual controls in a row share their start line, with feedback reserved beneath validated fields · checkbox square and adjacent label are centred against neighbouring control boxes, independently of heading/error height · every filter box the same 34px height ·
fields are `sigma-filter-field` (`--wide`, `--full`, `--check`, `--choice`), at most six in the main
row, the rest in `ng-template[appFilterAdvanced]` · Reset is handled by `resetRequested` and
restores the feature defaults · the feature SCSS has no filter colour, border, surface, focus
or dark rule and no undefined `var()` token · every single-line control stays at
`--sigma-filter-control-height` · `label for` matches `inputId` · Search is
`type="submit"` and disabled while running · changing filters resets to page 1 · search text
trimmed and empty values not sent · no extra clear button beside a dropdown with `[showClear]` ·
a report uses the `sigma-report-filter-*` strip instead (block 20).

### Inactive status check box (G6, 2026-10-01)

Every list with an *inactive only* check box uses the same meaning:

- **Unchecked** sends no filter and shows all rows.
- **Checked** sends `isInactive=true` and shows only inactive rows (`value.isInactive || null` in
  the snippet above).

A list that must hide inactive rows by default says so in its frozen filter contract and uses a
different control, a status dropdown with *Active* preselected. It never reuses the same check box
with the opposite meaning. Sibling lists such as Individuals and Companies behave the same.

---
