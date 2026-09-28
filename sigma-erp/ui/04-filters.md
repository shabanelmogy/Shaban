## 4. Filters

> **Status: Canonical**

Presentation references: `Accounts/openingBalances/components/details` for the
compact strip, and `Customers/Individual/IndividualPartner/components/list` for
the retained flat grid; primary action implementation remains owned by block 24.

One `<form>`, `[formGroup]`, `(ngSubmit)`. Every control labelled.

This block owns filter **semantics** for every filter shape, and two approved
**presentations**:

- **Compact filter strip — default for a new screen.** One compact wrapping strip
  with an inline-start primary accent, a soft tinted surface and a restrained
  shadow, holding a uniform field grid. Full spec under
  `#### Compact filter strip — default presentation`.
- **Flat 12-column grid — retained, do not spread.** The presentation already
  shipped by the ordinary typed list features. Keep it on the screens that
  already use it; a new screen does not adopt it.

The strip is bordered, rounded and tinted by design. The prohibition on wrapping
a filter set in "a second bordered, rounded, padded, or tinted filter card"
belongs to the flat-grid presentation, where it forbids stacking an extra card
*around* the flat grid. It is not a prohibition on the strip, and it is not a
licence to add a decorative card anywhere else.

All single-line filter controls use the application token
`--sigma-filter-control-height: 34px` from `src/styles.scss`. This is a shared
invariant, not a feature-level design choice. It applies to native single-line
inputs and selects plus PrimeNG dropdown, select, multiselect, calendar, and
input-number controls. The outer wrapper, internal input, and calendar trigger
must resolve to the same 34px height in light and dark themes. Checkbox, radio,
file, button, multi-select-list, and textarea controls keep their intrinsic or
component-owned dimensions.

New or refactored feature-owned filter forms must use a class ending in
`-filters` or `-filter-form`. Reusable or dynamic filter forms, plus existing
legacy filter forms that have not yet been renamed, use `sigma-filter-form`.
These are the canonical filter boundaries consumed by the shared height rule.
Do not hard-code or substitute another single-line filter height in feature
SCSS. The shared token remains authoritative. A PrimeNG wrapper or its direct
internal input/trigger may bind `height`, `min-height`, or `max-height` to
`var(--sigma-filter-control-height)` when required to make the complete control
resolve to the shared 34px contract. A feature continues to own layout, colors,
borders, focus treatment, and responsive behavior.

#### Compact filter strip — default presentation

Use this for a new screen's filters. It is one compact wrapping strip, not a
second large card, and not one field per line on ordinary desktop widths.

Surface contract:

- `display: flex; flex-direction: column` with an `8px` gap (field grid above,
  actions row below) and `flex-shrink: 0`, because the strip is fixed and never
  scrolls;
- `padding: 8px 12px`, `box-sizing: border-box`, and `margin: 0 8px 6px`;
- **the strip is exactly as wide as the feature-title card above it.** Give it
  the same inline margin as the `app-feature-title` host (`8px`), and keep
  `box-sizing: border-box` so the `border-inline-start` accent does not widen it.
  Two cards stacked in the same panel must share both edges;
- `border: 1px solid <themed filter border>`;
- `border-inline-start: 3px solid var(--sigma-primary, #3498db)`;
- `border-radius: 8px`;
- surface = a `135deg` gradient of
  `color-mix(in srgb, var(--sigma-primary) 5%, transparent)` over the feature's
  filter-surface token;
- `box-shadow: 0 3px 10px rgb(29 54 73 / 5%)`.

Use logical properties so the inline-start accent mirrors in RTL, and provide
dark-theme values for the strip surface, border and label tokens.

##### Field distribution — the arrangement rule

Inside the strip, lay the fields out as a **uniform `N`-column grid**, not as
free-wrapping boxes:

- `display: grid; grid-template-columns: repeat(N, minmax(0, 1fr));
  align-items: end; gap: 5px 8px` — every column is the same width, so every
  control lines up with the controls above and below it;
- one control occupies exactly one column. A control that needs more room — a
  radio group belonging to the field beside it, for example — spans the extra
  columns explicitly with `grid-column: span K` and never relies on wrapping;
- **choose `N` so the fields fill complete rows.** Count the fields, add the
  columns consumed by any spanning group, and pick the divisor that leaves no
  empty cell at the end of a row. A trailing gap is a layout defect, not a
  neutral outcome;
- a boolean filter is a field: it takes the next free column and bottom-aligns
  with its neighbours (`align-self: end`, plus the shared control height) so it
  fills the row instead of starting a lonely one;
- the field label sits above its control: `11px`, weight `700`,
  `letter-spacing: 0.01em`, `margin: 0 0 2px`;
- controls keep `var(--sigma-control-radius)` (`6px`) and the shared
  `--sigma-filter-control-height` (`34px`), with `var(--sigma-control-focus-ring)`
  on focus and a primary-tinted border on hover;
- actions keep their own full-width row below the field grid (right-aligned,
  `gap: 8px`), so they never consume a field column.

Responsive:

- at `900px`, drop `N` to `2` and give any spanning group `grid-column: 1 / -1`;
- at `700px`, drop to a single column and give every child `grid-column: 1 / -1`;
- the strip stays outside any row-scroll frame and must not become a second
  vertical scroll owner.

Copy this:

```scss
.feature-page {
  --feature-filter-surface: #f8fbfd;
  --feature-filter-border: #d7e3eb;
  --feature-filter-label: #4a6174;
  --feature-filter-control-border: #98a7b7;
}

.feature-filters {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 8px;
  margin: 0 8px 6px;
  padding: 8px 12px;
  box-sizing: border-box;
  border: 1px solid var(--feature-filter-border);
  border-inline-start: 3px solid var(--sigma-primary, #3498db);
  border-radius: 8px;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--sigma-primary) 5%, transparent),
      transparent 42%
    ),
    var(--feature-filter-surface);
  box-shadow: 0 3px 10px rgb(29 54 73 / 5%);
}

.feature-filter-controls {
  display: block;
  flex: 0 0 auto;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

/*
 * Four columns because this filter set fills three complete rows: one column
 * plus a three-column group, then four single-column fields, then four more.
 * Count the fields before you pick N.
 */
.feature-filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: end;
  gap: 5px 8px;
}

.feature-filter-field {
  min-width: 0;

  label {
    display: block;
    margin: 0 0 2px;
    color: var(--feature-filter-label);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.01em;
  }

  > input {
    box-sizing: border-box;
    width: 100%;
    padding-inline: 10px;
    border: 1px solid var(--feature-filter-control-border);
    border-radius: var(--sigma-control-radius, 6px);
    color: var(--sigma-text, #3f4850);
    background: var(--sigma-surface, #fff);
    box-shadow: none;
    font-size: 11px;
  }
}

/* A radio group belonging to the field beside it spans the spare columns. */
.feature-filter-mode {
  display: flex;
  grid-column: span 3;
  min-height: var(--sigma-filter-control-height, 34px);
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 14px;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

/* A boolean filter fills the last free column instead of starting a new row. */
.feature-filter-boolean {
  display: inline-flex;
  min-width: 0;
  min-height: var(--sigma-filter-control-height, 34px);
  align-items: center;
  align-self: end;
  gap: 8px;
  color: var(--sigma-text, #3f4850);
  font-size: 11px;
  cursor: pointer;

  input {
    width: 15px;
    height: 15px;
    margin: 0;
    flex: 0 0 auto;
    accent-color: var(--sigma-primary);
  }
}

.feature-filter-actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
}

:host ::ng-deep .feature-filter-field .p-dropdown,
:host ::ng-deep .feature-filter-field .p-calendar .p-inputtext {
  width: 100%;
  border: 1px solid var(--feature-filter-control-border);
  border-radius: var(--sigma-control-radius, 6px);
  color: var(--sigma-text, #3f4850);
  background: var(--sigma-surface, #fff);
  box-shadow: none;
  font-size: 11px;
}

:host-context([data-bs-theme='dark']) {
  .feature-page {
    --feature-filter-surface: #172630;
    --feature-filter-border: #3d5262;
    --feature-filter-label: #b3c4d0;
    --feature-filter-control-border: #526879;
  }
}

@media (max-width: 900px) {
  .feature-filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .feature-filter-mode {
    grid-column: 1 / -1;
  }
}

@media (max-width: 700px) {
  .feature-filter-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .feature-filter-field,
  .feature-filter-mode,
  .feature-filter-boolean {
    grid-column: 1 / -1;
  }
}
```

This is a presentation contract only. Semantics still come from the rest of this
block and keyboard/accessibility rules from block 27: one real `<form>` with
`(ngSubmit)`, every control labelled, `label for` matched by `inputId`/`id`, and
Search as the `type="submit"` action so Enter inside a filter field searches
rather than triggering an unrelated outer form. If the reference source misses
one of those semantics, treat it as source drift to fix in the feature review —
not as permission to copy the gap. Do not compress filters by removing labels,
shrinking practical hit targets, or reducing contrast.

#### Flat 12-column grid — retained presentation

Use this only on the ordinary typed list features that already ship it. A new
screen uses the compact strip above.

On a wide screen, Branch and Search occupy the first row (`3 + 9` columns).
Agreement Status, the inactive toggle, and actions occupy the second row
(`3 + 3 + 6`). Snippets use the neutral `feature-*` prefix; replace it with the
owning feature prefix.

```html
    <form class="feature-filters" [formGroup]="filterForm" (ngSubmit)="search()">
      <div class="feature-filter-field feature-branch-filter">
        <label for="individual-branch">{{ 'individualPartners.branch' | translate }}</label>
        <p-dropdown
          inputId="individual-branch"
          formControlName="branchId"
          [options]="branchOptions()"
          optionLabel="value"
          optionValue="id"
          [showClear]="true"
          [filter]="true"
          filterBy="value"
          appendTo="body"
          [placeholder]="'individualPartners.allBranches' | translate"
        ></p-dropdown>
      </div>

      <div class="feature-filter-field feature-search-filter">
        <label for="individual-search">{{ 'general.search' | translate }}</label>
        <input
          id="individual-search"
          type="search"
          formControlName="search"
          autocomplete="off"
          [placeholder]="'individualPartners.searchPlaceholder' | translate"
        />
      </div>

      <div class="feature-filter-field feature-status-filter">
        <label for="individual-agreement-status">
          {{ 'mangeDetails.agreementstatus' | translate }}
        </label>
        <p-dropdown
          inputId="individual-agreement-status"
          formControlName="agreementStatus"
          [options]="agreementStatusOptions"
          optionLabel="label"
          optionValue="id"
          [showClear]="true"
          appendTo="body"
          [placeholder]="'individualPartners.allAgreementStatuses' | translate"
        ></p-dropdown>
      </div>

      <label class="feature-inactive-filter" for="individual-is-inactive">
        <input
          id="individual-is-inactive"
          type="checkbox"
          formControlName="isInactive"
        />
        <span>{{ 'mangeDetails.inactiveCustomersOnly' | translate }}</span>
      </label>

      <div class="feature-filter-actions">
        <app-primary-action-button
          type="submit"
          [label]="'general.search' | translate"
          icon="bi bi-search"
          [loading]="loadingList()"
        />
      </div>
    </form>
```

Use this compact presentation. The filter owns layout and control placement;
the shared primary action continues to own Search button markup and styling.

```scss
.feature-page {
  --feature-filter-border: #c9d2dc;
}

.feature-filters {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 12px 20px;
  margin-bottom: 18px;
}

.feature-filter-field {
  min-width: 0;

  label {
    display: block;
    margin-bottom: 5px;
    color: #222;
    font-size: 12px;
    font-weight: 400;
  }

  > input {
    box-sizing: border-box;
    width: 100%;
    height: var(--sigma-filter-control-height);
    padding: 0 10px;
    border: 1px solid var(--feature-filter-border);
    border-radius: 2px;
    color: #3f4850;
    background: #fff;
    outline: none;
    font-size: 12px;

    &:focus {
      border-color: #69b7df;
      box-shadow: 0 0 0 2px rgb(105 183 223 / 18%);
    }
  }
}

.feature-branch-filter,
.feature-status-filter {
  grid-column: span 3;
}

.feature-search-filter {
  grid-column: span 9;
}

.feature-inactive-filter {
  display: inline-flex;
  grid-column: 4 / span 3;
  align-items: center;
  align-self: end;
  gap: 8px;
  min-height: 35px;
  color: #333;
  cursor: pointer;
  font-size: 12px;

  input {
    width: 15px;
    height: 15px;
    margin: 0;
    accent-color: var(--sigma-primary);
  }
}

.feature-filter-actions {
  display: flex;
  grid-column: 7 / -1;
  justify-content: flex-end;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 7px;
}

:host ::ng-deep .feature-filter-field .p-dropdown {
  width: 100%;
  height: var(--sigma-filter-control-height);
  min-height: var(--sigma-filter-control-height);
  max-height: var(--sigma-filter-control-height);
  border-color: var(--feature-filter-border);
  border-radius: 2px;
  color: #3f4850;
  background: #fff;
  font-size: 12px;
}

:host ::ng-deep .feature-filter-field .p-dropdown-label {
  padding: 8px 10px;
}

:host-context([data-bs-theme='dark']) {
  .feature-page {
    --feature-filter-border: #405364;
  }

  .feature-filter-field {
    label {
      color: #bdcbd7;
    }

    > input {
      border-color: #405364;
      color: #e5edf4;
      background: #182631;

      &::placeholder {
        color: #8194a5;
      }

      &:focus {
        border-color: #69b7df;
        background: #1b2b38;
      }
    }
  }

  .feature-inactive-filter {
    color: #cad6df;
  }
}

:host-context([data-bs-theme='dark']) ::ng-deep .feature-filter-field .p-dropdown {
  border-color: #405364;
  color: #e5edf4;
  background: #182631;
}

:host-context([data-bs-theme='dark'])
  ::ng-deep
  .feature-filter-field
  .p-dropdown-label {
  color: #e5edf4;
}

:host-context([data-bs-theme='dark'])
  ::ng-deep
  .feature-filter-field
  .p-dropdown-label.p-placeholder {
  color: #8194a5;
}

:host-context([data-bs-theme='dark'])
  ::ng-deep
  .feature-filter-field
  .p-dropdown-trigger,
:host-context([data-bs-theme='dark'])
  ::ng-deep
  .feature-filter-field
  .p-dropdown-clear-icon {
  color: #9dafbf;
}

@media (max-width: 900px) {
  .feature-search-filter {
    grid-column: span 8;
  }

  .feature-branch-filter,
  .feature-status-filter,
  .feature-inactive-filter {
    grid-column: span 4;
  }

  .feature-filter-actions {
    grid-column: span 8;
  }
}

@media (max-width: 700px) {
  .feature-branch-filter,
  .feature-search-filter,
  .feature-status-filter,
  .feature-inactive-filter,
  .feature-filter-actions {
    grid-column: 1 / -1;
  }

  .feature-filter-actions {
    justify-content: stretch;
  }

  .feature-filter-actions > * {
    flex: 1 1 calc(50% - 7px);
  }
}
```

Secondary actions such as Export use the approved compact secondary role from
block 24. The feature must not reach into shared button internals.

Typed form, and build the request by hand so empty values are dropped:

```ts
readonly filterForm = this.fb.nonNullable.group({
  branchId: this.fb.control<number | null>(null),
  search: '',
  agreementStatus: this.fb.control<number | null>(null),
  isInactive: false,
});

private buildFilters(): IndividualPartnerListFilters {
  const value = this.filterForm.getRawValue();
  const filters: IndividualPartnerListFilters = {};
  const search = value.search.trim();
  if (value.branchId !== null) filters.branchId = value.branchId;
  if (search) filters.search = search;
  if (value.agreementStatus !== null) filters.agreementStatus = value.agreementStatus;
  if (value.isInactive) filters.isInactive = true;
  return filters;
}
```

**Check:** the strip surface is one wrapping band with an inline-start primary
accent, an `8px` radius, a tinted surface and a restrained shadow, and it stays
outside any row-scroll frame · the strip is exactly as wide as the
feature-title card above it — same inline margin, `box-sizing: border-box`, both
edges shared · the field grid uses a uniform `repeat(N, 1fr)`
layout in which every control is one column wide and every row is completely
filled, with no empty cell at the end of a row · any spanning group declares
`grid-column: span K` explicitly · a boolean filter occupies a field column and
bottom-aligns with its neighbours · actions keep their own full-width
right-aligned row and never consume a field column · a flat 12-column grid
appears only on a screen that already ships it, with no nested filter card ·
all controls collapse to one column by `700px` · every single-line native and
PrimeNG filter control consumes `--sigma-filter-control-height` and remains
exactly 34px high in light and dark themes · no hard-coded or alternate feature
height · any PrimeNG dimension binding uses the shared token · `label for`
matches `inputId` · Search is `type="submit"` and disabled while running ·
changing filters resets to page 1 · search value trimmed · no extra search/clear
button beside a dropdown that already has `[showClear]` and `[filter]`.

---

