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
   columns, `--full` the whole row, `--check` a checkbox, `--choice` a radio group (below). The main row holds at most six most-used filters (number,
   date range, main lookup, status, branch); the rest go in `ng-template[appFilterAdvanced]`,
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

**Check:** the list filter strip is `form[appFilterPanel]` · every filter box the same 34px height ·
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
