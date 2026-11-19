<!-- Part of UI block 14: see ../14-editable-collection-table.md. Same status and authority as the block. -->

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
