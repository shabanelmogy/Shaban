<!-- Part of UI block 20: see ../20-report-page.md. Same status and authority as the block. -->


### Shared shell — mandatory replacement

Every report route imports `ReportPageComponent` and places `appReportPage` on
its outer `section`. Every report action group imports `ReportActionsComponent`
and uses `appReportActions`; this supplies the toolbar role, translated accessible
name, wrapping, spacing and print hiding. Do not recreate those host rules in a
feature and do not restore a legacy bare wrapper during review or refactor:

```html
<section appReportPage class="customer-statement-page">
  …feature-owned filters and report sections…
  <div
    appReportActions
    class="statement-actions"
    [ariaLabel]="'general.actions' | translate"
  >
    …Search, Print and Export buttons…
  </div>
</section>
```

```ts
imports: [
  ReportPageComponent,
  ReportActionsComponent,
  …
]
```

`shared/components/reports/` already applies both hosts, so its consumers must
not add another report page or action wrapper around `app-reports`. These shared
hosts own page/action presentation. API contracts, calculations, report sections,
data mapping, loading/error state and export mapping remain feature-owned. The
visual language for repeated report filters and accounting totals is shared and
must not be recreated feature-by-feature.

### Report filter + totals visual invariant

The shared bounded variant uses `host: { class: 'sigma-route-host sigma-print-flow' }`,
`section[appReportPage].sigma-report-page--fill.sigma-print-flow`, and
`.sigma-report-panel.sigma-print-flow`. These opt-in global classes reuse the
application's existing page/panel values; features do not copy page/panel SCSS or
subtract shell heights. Other report consumers retain their existing layout until reviewed.

For a sectioned read-only document, every section table is a typed
`app-data-table`. For a proven complete response in full-document flow and
print, one outer `.sigma-report-table-frame.sigma-print-flow` may own the report
flow; bind each grid `scrollable=false` so the complete arrays remain in that
outer document. An existing paged response keeps `lazy=true`, server paging and
its authoritative counts; importing the shared grid does not turn it into a
complete flow document.
Keep title, filters, inline warnings/contact metadata and existing backend totals
outside the frame. In a bounded screen layout with independently visible
sections, do not force one global row scroller: each section's layout boundary
uses `overflow: hidden` and passes its remaining size to its shared grid
(`fill=true`, `scrollable=true`), whose row wrapper owns that section's vertical
and horizontal scrolling. This applies to complete all-row sections with
`paginator=false` as well as complete sections using a local paginator; a frozen
paged transport keeps its server paginator/count contract. Summary and detail
panes may therefore scroll independently.

The former native report classes `.sigma-report-table`, `.sigma-report-number`
and `.sigma-report-empty` remain compatibility styles for out-of-scope existing
consumers until each report is reviewed; new or reviewed work uses the shared
grid and its documented inputs/tokens. The shared grid and global styles own
compact rows, sticky themed headers, logical alignment, row surfaces/hover and
white print surfaces. Trial Balance remains the reference for panel/title
spacing, header density and accounting values; do not add a feature palette or
override the shared grid's row treatment to imitate a legacy body surface. The
shared report panel retains that reference's insets, radius and subtle shadow.
Feature SCSS owns section placement only; do not add feature-owned table markup
or PrimeNG wrapper scroll rules. Statement of Account now adopts this shared
variant; its earlier `statement-*` filter/palette/height styles remain legacy
examples only.

#### Title, filter, summary and table width

**General owner choice, 2026-10-03:** canonical `.sigma-report-panel` title cards
match the filter card's appearance and inline edges by default. The shared rule
sets its direct `app-feature-title` child's margin to `-8px 0 16px`, retaining
block spacing and matching the report filter strip's zero inline margins.
Both cards stretch to the same panel content width in LTR/RTL and through
responsive panel-padding changes. Title/list-filter/report-filter backgrounds
share `--sigma-filter-panel-background` and the themed border/shadow; block3/4
own the card rule. Existing filter padding/control geometry and scroll owners
remain.

**Owner clarification, 2026-10-05:** the report result/table frame shares those
same logical edges and available width with the title, filters and summary
region. A direct `.sigma-list-table` inside `.sigma-report-panel` has zero
inline margins through the global report context rule; its ordinary-list8px
inset does not apply to reports. Journal adopts this through its existing
wrapper, while the fourteen Accounts family reports already stretch their
result regions to the panel content width. Intentional section columns align
within their own container; individual summary tiles retain their shared grid.
Keep wide-table scrolling inside the existing grid/document frame and retain
column minima, responsive layout, RTL, paging, totals, print and export scope.
Do not add fixed feature widths, duplicate wrapper padding or deep table CSS.
Compare both frame edges with the cards at desktop and narrow sizes; source-only
verification leaves visual acceptance pending for the owner.

The owner's final-column correction on the same date also applies inside the
frame: `.sigma-report-panel` supplies public
`--sigma-data-table-scrollbar-gutter: auto`, consumed by UI6's shared row wrapper,
and the report document frame uses `scrollbar-gutter: auto`. Do not permanently
reserve an empty scrollbar strip after the final column. A native classic
scrollbar still consumes its required space when rows actually overflow;
compare the full table frame with the cards and distinguish that scrollbar
from an erroneous margin. Keep native scrolling accessible, existing column
minima and print flow; never hide scrollbars or add fixed width compensation.

This supersedes the 2026-10-02 alignment choice previously scoped to Customer
Statement, Receivable Age Analysis and Follow Up. The existing
`sigma-report-panel--aligned-title` modifier remains an idempotent compatibility
alias; new canonical report panels do not need it. Do not add fixed widths,
feature-local margin overrides or compensating filter padding. Legacy feature
layout overrides are not bulk rewritten by this shared change.

Every report filter strip uses the shared global classes in `src/styles.scss`
(reference: `Accounts/TrailBalance`, `Accounts/BalanceSheet`). A filterless
report with a top row of actions keeps the same strip around `appReportActions`.
Applied settings that define the report go in the title subtitle (UI3). A short
`app-summary-cards` total that would otherwise take its own row goes in the
strip's shared `.sigma-report-filter-context` before the actions; the strip then
drops `no-print`, which moves to the actions and feedback, so the total prints.
The strip separates the buttons from the following tabs or results; the toolbar
spaces the buttons within the row. New or reviewed
summary/KPI cards use `app-summary-cards`; the former compact accounting bar is
compatibility-only for out-of-scope consumers. A report writes no filter or
summary-card CSS of its own:

```html
<form class="sigma-filter-form sigma-report-filter-panel no-print" ...>
  <div class="sigma-report-filter-field">...</div>
  <label class="sigma-report-filter-check">...</label>
  <div appReportActions class="sigma-report-filter-actions">...</div>
</form>

<app-summary-cards
  [ariaLabel]="translatedSummaryLabel"
  [cards]="summaryCards()"
  [minCardWidth]="190"
/>
```

The feature supplies a typed `ReadonlyArray<SummaryCard>` descriptor, for
example `{ id, labelKey, value, icon, accent, format: 'number' }`; use
`format: 'money'` and a translated `suffixKey` for authoritative financial
values. Labels, hints, secondary values and selection remain descriptor inputs;
the shared component owns card markup, geometry, palette, formatting and print.

The StockReportPage family exposes optional `inlineFilterActions` (default false)
for an owner-scoped compact flex strip: retain its existing field/action groups,
remove their full-width utility and let the fields grow into remaining space
beside ReportActions. Reuse global report-strip control/field/action sizing and
narrow-screen stacking without feature CSS. PartsMovingReport adopts this under
the owner's2026-11-01 same-row and wider-Items requests; other stock reports keep
their current layout. Retain the same form, actions, busy gates and print hiding.

Reports whose owner requests actions on the filter control line may opt into
`sigma-report-filter-panel--inline` alongside the stable modifier. The shared
Accounts composition exposes this through optional `inlineFilterActions`, false
by default. It counts its non-checkbox fields for the shared grid, reserves a
translated invisible aria-hidden action caption and renders one existing action
template; non-adopters retain the direct toolbar. Budget Variance opts in with
three fields. Validation feedback remains below controls and action heights use
the existing 34px token.
The shared
grid uses the feature's `--sigma-report-filter-columns` plus an auto action
column, three columns below1250px and one below640px. All field wrappers shrink
within their cells; native inputs retain full width and single-line labels
ellipsis visually while keeping their full accessible text. The action field
uses `sigma-report-filter-field--actions` and an aria-hidden invisible
`sigma-report-filter-caption` to reserve the same label geometry, followed by
the existing ReportActions/action-group. Validated fields reserve feedback with
FieldError (UI19); actions align with inputs rather than feedback. Native and
primary action buttons use the same exact control-height token, retaining
shared theme/RTL/busy/wrapping. Journal adopts five fields/four actions on the
owner's2026-10-05 instruction; other strips keep defaults. No feature CSS.

Wide fields in inline report strips opt into the shared
`sigma-report-filter-field--wide` modifier, spanning two grid tracks. Include
that extra track in `--sigma-report-filter-columns`; the auto action track is
unchanged. The shared owner resets the span to auto at640px so the single-column
layout creates no implicit second column. This extends the existing FilterPanel wide-field mechanics to the
report strip while preserving report1250/640 breakpoints, stable validation,
RTL/theme and all non-adopter defaults. No feature width or calendar override;
source conformance only, owner visual/input acceptance pending.

**Ledger field proportions and action-row checkbox.**
The Accounts descriptor's existing `wide` flag also applies to ordinary flex
report strips above640px through the same shared modifier: grow2/basis340px/
max600px compared with ordinary grow1/basis170px/max300px. At640px and below,
retain the shared full-width stacking. Inline grids keep their existing span2
and mobile span reset; `AccountReportPageComponent.filterColumns` counts wide
fields as two tracks. The optional checkbox descriptor `withActions` renders
that control once in the existing shared action template rather than among main
fields. The normal flex strip's `sigma-report-filter-actions--with-checks` takes
a full row, aligns the checkbox at logical start and lets buttons wrap at narrow
widths; existing inline strips retain their action field. FormControlName stays
under the same form and no value resets. Omission preserves current checkbox
placement. Ledger selects wide for Account and withActions for Original Currency,
as explicitly clarified by the owner; other consumers retain defaults. Use the shared
owner rather than screen CSS or ID selectors.

Inline strips may supply `--sigma-report-filter-template` as a complete grid
template, including a dedicated action track when actions stay inline, when equal filter tracks waste space or
clip choice labels. Its default is the existing column-count template; shared
1250px three-column and640px single-column fallbacks still apply. Use
max-content for short choice/checkbox groups and minmax(0, weighted-fr) for
editable fields and wrapping actions. StaffStatement adopts weighted
Date2.5/Staff1.5/SubLedger1.5 tracks and content-sized Report Type/inactive
tracks on the owner's2026-10-08 clipping report. Its later owner instruction
moves all six actions to a separate row: keep five filter tracks and span the
action wrapper with existing `sigma-field--full` (grid-column1/-1), removing the
inline-only caption. Shared narrow wrapping remains. This supersedes its earlier
date-span2 adoption: remove that modifier when the explicit template already
owns date width. Existing shared choice labels stay nowrap, date/calendar
bounds and action wrap remain; no feature CSS or changes to non-adopters.

The strip owns its layout, the 34px control height (`--sigma-filter-control-height`), focus,
dark theme, RTL and narrow-screen stacking. The actions use the shared variants
`sigma-report-action--search` (primary), `--refresh` (quiet primary), `--reset` (neutral) and
`--export` (light-blue secondary). Export and print use one shared output style: 34px height, centered inline-flex content, 6px icon gap, 10px horizontal padding, a 1px solid 4px-radius border, 0.75rem/700 text and no shadow. Its light-blue primary/surface wash, primary/strong-border mix and balance text have theme-aware hover/focus states. Both themes resolve the same rules through their tokens. Icons inherit the action text. This shared style follows the owner's 2026-10-10 decision and applies to ordinary and specialized output actions. Features never add an output palette or geometry of their own.
Search may use `app-primary-action-button type="submit"`; its shared
report-strip context uses those same compact dimensions. Direct secondary buttons
use `btn btn-secondary` with the corresponding report variant, as in Trial Balance.
`sigma-report-action-group` supplies the same wrapping and narrow-screen two-column
layout as the existing `app-buttons` group. Report semantics still follow block 4: labels are associated with their controls,
Search submits the real filter form, and the strip is never a second vertical scroll owner.
A list screen uses the filter panel of block 4 instead; the two shared strips are not mixed.

An explicit frozen owner decision can select block4's FilterPanel for a report's
main search form, keeping the block20 shell, data/totals/print contracts and
statement-dialog strips. Staff and Suppliers Balance Summary use five main
columns plus Balance Type in More Filters; Customers retains its existing paged
summary/list exception. The owner's 2026-10-03 stability follow-up opts all three
into shared stableLayout. Use the existing mx-0 utility to retain report card
edges, and project report actions with appFilterActions/appReportActions plus
one shared Reset. This is a recorded presentation exception, not a blanket
report migration or a change to Range/business semantics.

Report radio groups can opt into the shared `sigma-report-filter-choice` class
on their labelled radiogroup. `src/styles.scss` then owns PrimeNG radio selected,
hover and focus states through `--sigma-primary`, `--sigma-primary-hover` and
`--sigma-control-focus-ring`, overriding the installed Lara theme's separate blue.
Keep existing `p-radioButton` controls, associated labels, disabled states and
reactive-form values; no feature radio palette or deep selectors. The class is
opt-in and does not recolour out-of-scope existing groups. Customer Statement's
Report Type consumes it. Row grouping and spacing remain feature decisions
recorded in the feature contract, using existing layout utilities.

The existing compact `sigma-report-summary-bar`/`sigma-report-totals`/
`sigma-report-total` accounting bar remains the compatibility owner for
out-of-scope consumers: shared surface/border/radius, tabular numerals and
semantic Debit/Credit/Balance-or-Net accents. The **numbers still come from the
backend response**; shared styling never authorizes client-side recomputation of
accounting totals. Keep the summary as small as the report needs: Trial Balance
uses only **Total Debit** and **Total Credit**. Do not add Beginning/Ending/Net
cards merely because the line model exposes those values. Add Balance or Net
summary cards only when they are a deliberate report KPI owned by the backend
contract and useful to the user.
If a report has a non-accounting KPI need, keep its cards in
`app-summary-cards` and document only the feature content/placement in review
evidence; do not fork the shared visual shape or filter/summary pattern.
