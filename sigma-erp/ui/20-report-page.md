## 20. Report page

> **Status: Canonical composite** — shared page/actions plus shared report filter/summary visual language; feature-owned contracts, data and calculations

A report is **not** a CRUD list. The canonical document shape has no row actions
or server paging. The user picks filters, presses Search, and gets one document with
sections and totals. Reference:
`Customers/StatementOfAccount/components/list/`.

Sibling reports that follow the same shape: `Customers/BalancesSummary`,
`Customers/ReceivableAgeAnalysis`, `Suppliers/SupplierStatementOfAccount`,
`Staff/StaffStatementOfAccount`.

An existing report API can paginate its response; inspect it before adopting the
unpaged document presentation. That transport contract is not changed by importing
a shared grid. Preserve/freeze the existing request, counts and totals scope, then
choose server paging or an explicitly complete collection for local presentation
paging. Do not introduce server paging into an already complete report merely to
reuse a grid, or infer completeness from Result<T> rather than Results<T>.

**Owner-requested incremental transport (2026-10-31).** An explicit request to
load a report while scrolling may introduce an additive paged read alongside its
complete read after freezing the filter, slot/order/count/summary/output contract.
It remains a read-only report. Limousine Utilization is the scoped adoption:
first120 chronological calendar rows, then append on scroll using UI6's shared
incremental capability. Retain zero-activity calendar slots and the366-day bound.
The first response returns authoritative totals for the whole filter period;
later windows do not recompute or replace that summary. A partial collection
never supplies whole-report local column filtering/sorting. Changing filters or
tenant clears rows/summary/errors, cancels reads and rejects stale/duplicate or
out-of-order windows. Failure of a later page retains accepted rows with Retry.
Every data read owns UI22's page loader; references retain their current owners.

Print/Excel explicitly read and validate the complete report for the applied
filter, even if only the first window has loaded. Never export the partial view
or derive the total by summing loaded rows. Print uses a separate full-output
array under ReportPrintSession, preserves the screen collection and releases
print state on afterPrint/cancel/context. A live multi-request operational report
is not a transactionally frozen database snapshot; a new Search refreshes its
summary/windows, and complete output uses its own fresh complete response. Do not
introduce a report/financial cache or invented snapshot token to conceal this.
Record payload/render/query tradeoffs and pending timings under UI29.

Every report table in new or reviewed report work uses typed `app-data-table`
columns. Existing reports migrate when their report is in scope; this rule does
not authorize a bulk rewrite of reports outside the current review. The shared
grid does not change the report's semantics: for a proven complete response use
`lazy=false`; for an existing paged response preserve `lazy=true`, server
paging and authoritative counts. Keep the complete dataset proof where the
report promises full output, backend-owned totals, section hierarchy, print
flow and applied-filter scope.
When a report needs a capability the shared grid does not yet provide, extend
the shared component in that report's scoped implementation. Do not flatten a
hierarchy or silently authorize a feature-owned table.

### Accounts family composition — reviewed source

**All tree reports: Expand All / Collapse All (owner rule, 2026-10-05).** Every
report that displays a real tree uses UI6's shared ReportTreeActions controls.
Both actions apply to every supplied level, including descendants currently
hidden by collapsed parents. DataTable hierarchy consumers receive them
automatically; the existing shared dynamic Reports TreeNode adapter uses the
same toolbar for its legacy consumers without changing their request/paging
contract. This additive compatibility support does not make that legacy tree
body a canonical reference or authorize new private report tables. Flat and
indent-only reports retain no tree toolbar. Keep translated native buttons and
toolbar name, loading/empty gating, wrapping/RTL/themes and print hiding. These
are view actions: no confirmation, API call, recalculation or source-row writes.
Canonical print includes all descendants and preserves screen expansion; Excel reads the
complete original source regardless of collapse. UI6 owns recursive expansion
state and shared toolbar details; features must not copy controls or reach into
PrimeNG expansion internals. Source-only; owner acceptance pending.

Stable report editing uses the optional global
`sigma-report-filter-panel--stable` modifier: field wrappers align at the top,
dropdown/calendar hosts and roots stay within the field width, and selected
dropdown labels shrink. Keep the existing report field flex basis/bounds,
wrapping, narrow breakpoint, checkbox/action alignment and body overlay owner.
Accounts configurations opt in through `stableFilterLayout`; Ledger adopts it
after the owner's account-field movement report (2026-10-05). The family binds
FieldError's existing string reserveMessage for date and required feedback in
this mode (UI19), retaining validators and message visibility. Other reports
keep their defaults until reviewed. No feature alignment CSS or business change;
source-only, owner visual/runtime acceptance pending.

The fourteen complete Accounts reports use an Accounts-local typed
`AccountReportConfig`/`AccountReportPageComponent` over the existing shared hosts,
controls, grid and cards. Configurations retain feature-owned filter names,
request/response types, sections, backend totals and existing navigation.
`FormRecord` owns controls; lookup failures block Search and have local retry.
Explicitly adopted Accounts configurations may provide `accessRequirement` on
the existing `AccountReportConfig` and on individual filter definitions
(source adoption,2026-11-07). The shared page consumes the current-session
evaluator; absence of the optional inputs retains prior caller behavior. Keep
the real report key and indispensable lookup dependencies in its route and
configuration. Optional denied sources hide/disable their controls and remove
their form/raw/applied/recovery values before request construction, Reset and
output; a hidden field is not made eligible by `getRawValue`. Its lookup is not
requested and cannot create a required-lookup error. An allowed failed source
retains the existing Retry contract.

Cancel individual report/lookup/watch and deferred auto-search/print work on
its captured grant/context, retaining the outer search trigger. A queued action
must stay cancelled after revoke/regrant; comparing only the final signature
inside a microtask is insufficient. Check the mounted identity/context at the
event before an effect can flush. Relevant grant transitions restore missing
bootstrap and the sanitized searched snapshot; unrelated revisions do not repeat
operational report reads. Reference/working-context reset clears prior choices,
outputs and route-derived IDs, while a changed sign-in expires an adopted mounted
session. Existing data-free cache-context reset remains the owner for legacy
callers. For links from account-detail sections, the existing page exposes
`canActivateRow(row)` (source adoption,2026-11-07): it checks current output access,
mounted context, no report/lookup/print work, the active details view and membership
of the exact row object in current hierarchical sections. Its computed set is
rebuilt when sections change, including transformed display rows; a matching
account ID in an old/copied row does not qualify. Consumers keep their real
source/destination grants, route policy and business row rules, and recheck in
both activation visibility and the handler. This adds no link to reports without
one and does not authorize a write. Source specs exist; build/runtime/visual acceptance is
separate and pending under the current source-only boundary (UI26/28).
The existing ReportPage host owns `:host([hidden][inert]) { display:none
!important; }` so a protected mounted report stays visually hidden despite
the shell's flex/block display declarations, including print. Both attributes
identify access-hidden content; ordinary screen-only inactive-tab print
visibility keeps its existing contract. Reuse this owner, not a per-report
CSS copy. The actual-template computed-style specification remains unexecuted
under the source-only boundary.
For persisted bilingual lookup names, the shared dropdown's optional
`nameLocalized` becomes `AccountReportFilterOption.labelLocalized`. The existing
language-keyed `optionsFor` selects that nonblank label for Arabic, falling back
to the base label; a supplied `labelKey` keeps its prior translation behavior.
This capability applies to every consumer supplying bilingual metadata and
requires no per-screen opt-in, new request, selection reset or draft mutation.
Budget uses its own existing editor with the same stored bilingual values.
Evidence: GroupDefinition ReportOptions and Budget/BudgetVariance2026-10-23;
source conformance verified, owner language/print/export acceptance pending.
Changing filters invalidates output; requests capture the applied snapshot and
disable the form until completion. Export reads complete source rows and builds
translated headers at click time. Hierarchies use UI6's optional shared adapter;
FY2 remains flat. Server-owned context such as Ledger account identity/currency
is retained outside the grid through `responseContext`, not invented as a new
transport column. Sections default to independent bounded shared row viewports.
Accounts reports may supply `hasOutput(response)` when a valid report has
meaningful opening balances, authoritative totals or a warning without movement
rows. The shared page uses that same eligibility for both the visible Print /
Export controls and their handlers; omitted predicates keep the existing
row-count behavior. Do not invent a transaction row to enable output. Ledger
opts in and exports each currency's opening/totals even with no activity. Keep
the base summary separate from original-currency sections and preserve the
complete response in print/Excel. Source conformance2026-11-05; runtime pending.
`AccountReportSection.summaryCards` optionally places server-owned totals beside
their own section using the existing SummaryCards owner. Ledger uses it for each
original currency, while the base summary stays at the report head. Preserve
the section's unit, exact amount text, precision and complete output; do not
combine separate sections' financial totals or recreate summary markup.

The shared Accounts report owner cancels report and lookup reads on tenant /
session context expiry, clears the prior result and reference selections, and
restarts finite option bootstrap without replaying IDs from an old route
snapshot. Required bootstrap uses UI22's page progress owner. Optional
`watchOptions` on a filter adopts only a source already opted into UI2's shared
reference cache; Ledger's Branch is the current adoption. Direct operational
and non-opted-in lookup sources keep their direct reads. Retained reference
refresh preserves selected labels and uses failure/Retry; it does not rerun or
reprice the report. Clear its bindings between contexts and on destruction.
Optional `sectionLayout: 'document'` selects the existing complete-document
alternative: full-width sections in source order, one keyboard-accessible outer
`sigma-report-table-frame`, and grids with `fill=false`/`scrollable=false`.
The owner's later explicit accounting-format decision supersedes CashFlow's
document and tab experiments (2026-10-05). It uses one full-width filling shared
table, one Account/Amount header and two common78%/22% columns. Section rows
identify operating/investing/financing activities; each complete array precedes
its authoritative server net subtotal, followed by server NetChangeInCash with
a shared double rule. NetIncome uses its existing producer-defined operating
line (translated label), or the response field when that line is absent.
The five figures remain within the statement instead of KPI tiles. There are
no activity tabs or independently scrolling activity panes. The owner's later
explicit Tree View request groups those same three activities through shared
DataTableHierarchy: each default-expanded root shows its authoritative net and
contains the complete account lines plus closing subtotal. Final net change
stays at root level. Local children represent the response's existing section
groups, not account-parent relationships. UI6's optional activateEnabled exposes
ledger links only on actual accounts; expansion keeps the shared keyboard/RTL
owner. All descendants remain in print/Excel regardless of collapse.
UI6's optional shared rowTone/column width/link.enabled own the presentation;
synthetic headings/totals have stable local identities and no ledger link.
No frontend financial calculation is introduced. CashFlow's explicit exportRows
retains the previous complete three-section Excel shape from original arrays,
without injecting structural display rows; print includes the whole statement.
The full-width route modifier and public32rem minimum/wrapping remain. The
unconsumed Accounts-specific tab adapter is retired; other report layouts are
unchanged. Optional summaryDensity/summaryMaxHeight still pass through public
SummaryCards inputs for card consumers. Document mode remains an optional
complete-response presentation with shared empty states. Print releases bounds.
This composition does not convert
Journal's existing paged API or introduce new financial calculations. The shared
page shell/appearance is unchanged; source-only, owner acceptance pending.

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
layout overrides are not bulk rewritten by this shared change. Actual visual
acceptance remains owner verification when source-only reviewed.

Every report filter strip uses the shared global classes in `src/styles.scss`
(reference: `Accounts/TrailBalance`, `Accounts/BalanceSheet`). New or reviewed
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
Source-only; owner responsive/RTL/visual acceptance pending.

Reports whose owner requests actions on the filter control line may opt into
`sigma-report-filter-panel--inline` alongside the stable modifier. The shared
Accounts composition exposes this through optional `inlineFilterActions`, false
by default. It counts its non-checkbox fields for the shared grid, reserves a
translated invisible aria-hidden action caption and renders one existing action
template; non-adopters retain the direct toolbar. Budget Variance opts in with
three fields. Validation feedback remains below controls and action heights use
the existing 34px token. Source-only; responsive/RTL/visual acceptance pending.
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
Source-only; narrow layout and visual acceptance remain pending.

Wide fields in inline report strips opt into the shared
`sigma-report-filter-field--wide` modifier, spanning two grid tracks. Include
that extra track in `--sigma-report-filter-columns`; the auto action track is
unchanged. The shared owner resets the span to auto at640px so the single-column
layout creates no implicit second column. This extends the existing FilterPanel wide-field mechanics to the
report strip while preserving report1250/640 breakpoints, stable validation,
RTL/theme and all non-adopter defaults. No feature width or calendar override;
source conformance only, owner visual/input acceptance pending.

**Ledger field proportions and action-row checkbox (owner instruction, 2026-10-23).**
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
owner rather than screen CSS or ID selectors. Source-only conformance; owner
desktop/intermediate/mobile, RTL/theme and focus acceptance remains pending.

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
Source-only visual/RTL/input acceptance remains pending.

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

### Shared summary/KPI cards across screen types

Any new or reviewed summary, KPI or total-card region on a list, report,
dashboard, routed editor or dialog uses the one shared `app-summary-cards`
component from `shared/components/summary-cards/`. It accepts a readonly typed
`SummaryCard[]` with stable `id`, translated `labelKey`, authoritative display
`value`, Bootstrap `icon`, approved `accent`, optional `format` (`number`,
`money` or `text`), translated `suffixKey`, `hintKey`/`hintParams` and an
optional secondary value. The component fetches nothing, derives no totals,
changes no business state and owns the card geometry, palette, typography,
surface, icon tile, focus and print treatment.

Width is container-responsive through auto-fit columns and the public
`minCardWidth` input (190px default); height follows content with equal row
stretching. The optional numeric `maxHeight` input defaults to null. When it is
supplied, the shared internal card list owns its vertical scroll and receives
keyboard focus/tabindex with visible focus; when absent, cards remain natural
height. Features may place or bound the host and choose public `density`
(`comfortable`, `compact` or `dense`), `layout`, `minCardWidth`, `maxHeight`, `selectable`,
`selectedId` and `disabled`; they never override card internals, colors, padding,
radius or fonts. Selectable cards use native buttons, `aria-pressed`, visible
focus and a stable-id `cardSelected` output; static cards have no card-level
click affordance or tab stop. Number formatting uses Angular `formatNumber`,
monetary values use the shared `formatMoney` owner, and BalancesSummary
preserves absolute magnitude with a translated Dr/Cr suffix. Print removes any
card-list bound (`maxHeight: none; overflow: visible`) while retaining every
card and hint.
**Projected value controls (owner request, 2026-10-28).** When a summary card
contains an existing editor control, import `SummaryCardValueDirective` in the
consumer and project `<ng-template appSummaryCardValue="stable-card-id">` inside
SummaryCards. The matching nonselectable card replaces only its formatted primary
value with that template; `$implicit` is the typed SummaryCard. Label, icon,
accent, hint, secondary value, responsive geometry and print skin stay shared.
The feature binds its existing typed FormControl, translated accessible input
name, validators, error and disabled/View lifecycle; the shared card never owns
discount rules, mutations or form state. Bind the control explicitly when the
strip is outside the form element. Do not cap an editable strip so validation
is clipped. Unmatched/absent templates retain normal values; selectable cards
ignore value templates to avoid controls inside their button. Keep stable unique
template IDs, natural validation height, RTL/theme and native input focus. The
strip may sit directly before the fixed editor footer outside the growing form,
with the table/body owning the remaining space; never imitate card internals or
remove a gap through guessed negative margins. RentalQuotation's discount card
uses this additive slot; existing consumers retain their defaults. Source-only;
responsive spacing, validation, print and keyboard acceptance remain pending.

The row option fits all cards into equal columns on a container wider than
1100px, wrapping through the shared auto-fit/minimum-width rule below that
threshold; it does not leave a last card outside the screen. Dense density
provides smaller figures through the same shared owner (UI 24). Print wraps
all cards independently of screen layout. No new accounting/status formulas
are introduced by the visual component.

The shared component is the approved adoption target for Dashboard,
FollowUpReport, DebtCollection, Customers/Alerts, BalancesSummary and
ReceivableAgeAnalysis. Their public sizing contracts are Follow Up
`minCardWidth=220`/`maxHeight=180`, Debt compact `170`/`180`, Alerts compact
`180`/`160`, Receivable Age dense/row `140`/`180` with 12px bottom separation on
the host, Balances main compact `180`
with a host bound of `320` plus three dialog compact cards at `180` without a
card bound, and Dashboard default `190` at natural height. Existing consumers
migrate when explicitly in scope, so this rule does not claim that every legacy
screen has already migrated. Follow Up keeps its report-specific metrics,
paging, tabs, drill-down and complete output contracts below; those formulas
remain in the feature contract/review.

DebtCollection and ReceivableAgeAnalysis keep 12px bottom separation from the
following grid on the shared component host (UI 24); keep card internals owned
by the shared component and do not duplicate an existing parent gap.

For an explicitly approved dense accounting report that keeps its controls
visible, the routed report may be bounded to the available shell height. Each
visible section chooses its own layout boundary and shared-grid row viewport;
keep the feature title, filter strip, lookup/error messages and accounting
summary outside those scrolling regions. The active grid owns vertical rows and
any required horizontal overflow, and its header remains sticky inside that
grid. Do not put vertical scroll on the surrounding card/results container or
introduce a nested hierarchy scrollbar. Printing releases each section's bounds
so the full report can flow across pages.

### Tabbed report sections

**One on-screen section title (owner confirmation, 2026-10-03).** In every new
or reviewed tabbed report, when the Tab caption identifies the table's section,
do not repeat that caption as a heading above the table on screen. Keep the main
feature title and column headers. Retain a print-only section heading because
tabs are hidden in print; use the existing `d-none d-print-block` utilities on
the heading, without a feature heading style. Keep each panel's
aria-labelledby pointing to its Tab, its existing mode-specific caption and
all applicable sections in the DOM. Supplier Statement adopts this for its
Ledger/Outstanding and Advance Tax headings; other consumers adopt in scope.
This makes the existing Customer Statement print-only-heading rule below
explicit for all reviewed tabbed reports; it changes no data or print scope.

**Frozen owner refinement, 2026-10-03:** Follow Up keeps two shared workspace
tabs, Details and Summary, and both sections stretch to the report panel's full
content width through the existing public `sigma-route-host--full-width`
placement. This supersedes the earlier 520px and 960px Summary limits; the panel
remains responsive and the public shared-grid minimum width owns any internal
horizontal overflow without page scroll. Summary remains unpaginated;
Details binds the complete array to the existing controlled local paginator with
the shared default 15 rows and 10/15/20/50/100 choices (the later owner decision
in UI6 supersedes the earlier 20-row default), using the feature
`reports.followUpShowingEntries` page-report key with `{first}`, `{last}` and
`{totalRecords}` placeholders. Details retains its page and
chosen size when switching tabs; valid Search, filter edits, Reset and the
raw-username drill-down reset its offset while preserving size. Existing shared
`app-summary-cards` presents the four server-owned additive operational KPI cards
in equal auto-fit columns with `[minCardWidth]="220"` and `[maxHeight]="180"`:
four columns when the
container permits, then three, two or one as it narrows. Use its
comfortable Dashboard KPI shape: 14px vertical/16px horizontal padding, 44px
semantic icon with a 14% accent wash, 10px radius, 12px gap, 1.6rem value, 9%
accent wash and 3px
logical-start accent through the shared sigma/Bootstrap tokens. Compact density
uses the shared 10px/12px padding, 32px icon, 8px gap and 1.35rem value when the
screen's content requires it; no feature card geometry or palette is copied.
The overall follow-up count uses the approved primary accent through its
descriptor; no feature-only emphasis variant is introduced. The user
cell uses the quiet shared `sigma-report-user-action` secondary action, including
inherited hover/focus/busy behavior; null/blank groups remain label-only.
Comparison bars remain custom cells in the shared grid renderer, with feature
placement limited to the public 88px/7px semantic bar dimensions and Summary's
175px count column through public column classes. A compact translated
scope/reference-date row and balanced caption row sit above the grid. Ordinary
Excel follows the active complete section and its current columns, exporting all
filtered Details rows regardless of the visible page; full print keeps KPI values,
captions, reference text and all Summary/Details arrays regardless of selection,
hides decorative icon tiles, temporarily releases pagination/scrolling, then
restores the controlled page, size, selected tab and form state. Follow Up's
existing `.sigma-report-panel` also opts into the public
`sigma-report-panel--aligned-title` modifier. Keep busy, printing,
filter-invalidation, metrics, formulas and reference-date semantics unchanged;
feature formulas remain in the frozen contract/review.
Metric formulas, scopes and reference-date semantics remain in the frozen Follow
Up contract/review and are not universal report defaults. No new shared
disclosure capability or feature-owned tab/card palette is required.

**Explicit presentation choice, 2026-10-02:** the owner requests every Customer
Statement section table to match BalancesSummary's shared grid. That report
uses typed `app-data-table` columns with lazy=false and owner-approved local
pagination (block 6), retaining full response arrays and backend totals. To keep
the paginator at the card bottom, it uses fill=true and scrollable=!printing():
the external report frame is a flex layout boundary with overflow hidden and the
active shared grid row wrapper owns both scroll axes. Pass shrinking flex height
through the visible panel. The tab label identifies the section on screen; the
owner removes its duplicate table heading, which remains visible only in print.
Panel aria-labelledby still points to the tab. Every section
keeps independent controlled paging; print preparation turns pagination and
scrolling off and restores them after print/cancel/failure (block 21). Print
panel layout returns to block flow. Every report section follows this shared-grid
baseline when the report is reviewed. Existing out-of-scope consumers migrate at
their own review; no feature table palette is added.

When the owner approves tabs for an existing sectioned report, reuse
`app-editor-tabs` with `appearance="workspace"` (block 13), typed keys, existing
translation labels and optional response-row counts. Keep this `no-print`
navigation outside the bounded results area, below the filters and
backend totals. Each feature panel follows the shared ID/aria-labelledby
contract and remains keyboard focusable. The shared component owns tab styling
and keyboard navigation; feature CSS owns only section layout and visibility.

Preserve the report's mode-specific section conditions and existing radio/select
mode controls. Switching sections changes presentation without another API call,
server paging or changed accounting. Ordinary Excel follows the selected section's
complete array and current columns (block 8); print still covers every applicable
section (block 21). Empty
sections remain inspectable without a fabricated response. Resetting filters
selects the primary section; a Refresh of the same filters retains selection.
Reset the actual row viewport when selecting a section without moving keyboard
focus off the selected tab. Flow reports reset the outer frame; filling
shared grids use `DataTableComponent.scrollToStart()` (block 6), never a feature
query of PrimeNG internals.

Keep all sections applicable to the chosen report mode in the DOM and hide
inactive panels with screen-media CSS only. Do not use `@switch`, conditional
rendering or `[hidden]` for the active-section selection: full-report printing
requires all applicable panels, independently of the selected tab (block 21).
Existing mode conditions still govern which sections belong to the report.

### Dense accounting tree/report table visual invariant

`Accounts/TrailBalance/components/list/` is the canonical visual reference for a
dense accounting report that renders hierarchical rows (its existing source uses
`p-treeTable`) or for a flat accounting report whose table serves the same
read-only role. New and reviewed reports with this UI role still use
`app-data-table`; add any missing hierarchy capability to that shared component
within the scoped report task. Preserve the same compact visual grammar rather
than inventing a feature-specific table treatment:

- keep each bounded section inside its layout boundary; the shared grid's row
  viewport is that section's scroll owner, never the surrounding report card;
- keep the table header sticky inside that grid and visually distinct with a
  soft themed surface, strong text, subtle vertical separators and a slightly
  stronger bottom rule; do not use an oversized or card-like header;
- target a compact header around `34px` high and compact data rows around `30px`
  high, with roughly `5-6px` header block padding and `3px` row block padding;
- numeric headers and cells align to logical end and use tabular numerals;
- the first account/description column aligns to logical start and receives the
  width needed to prevent hierarchy controls from crushing the label;
- hierarchy togglers stay compact (about `22px`) and must not inflate row height;
- when account code and account name are both shown, render them as separate
  visual parts: code is quieter/smaller, name is the primary readable label;
- hierarchy indentation must stay tight enough for dense accounting data. Do not
  add decorative nested cards, large left padding, or oversized tree icons;
- top-level hierarchy rows may receive a **subtle** weight/surface emphasis only;
  deeper levels rely on indentation and the tree control, not progressively
  louder backgrounds;
- preserve horizontal overflow when required by financial columns, but avoid a
  second nested vertical scrollbar inside the shared grid's hierarchy viewport;
- sticky-header, row-density and hierarchy styling must use logical properties
  (`inline-start`/`inline-end`) so Arabic RTL and English LTR remain equivalent;
- print mode removes height/overflow bounds and lets the complete table flow.

Use these rules for Trial Balance-like accounting reports and for any other
report with the same dense read-only tree/table role. The interaction model may
change shared-grid inputs or require a shared capability, but it does not permit
a feature-owned table or flattening the hierarchy; record the required shared
extension in review evidence.

`Accounts/TrailBalance/components/list/` is the reference consumer. A report review fails
final reconciliation if it reintroduces feature-local filter-strip or accounting
total-card styling when these shared classes fit the same UI role.

### Required report review evidence

For a reviewed family of reports with the same read-only lifecycle, a typed
feature-family composition may share the form/request/print/export code and
template while each consumer owns its columns, filters, lookups and returned
totals. It still composes the canonical ReportPage, FeatureTitle, DataTable and
SummaryCards owners; it does not create a second visual pattern or infer data
completeness. StockReports uses `stockReports/shared/StockReportPage` and its
typed `StockReportConfig` for eight consumers (2026-10-04). Every reader requests
the frozen complete-response opt-in, and the composition checks both the flag
and matching row count before enabling output. Adapt DataTable's typed
`pageSize` event to the `rows` input expected by `resolveListPaging` before
writing local paging state. Backend formulas and source limitations remain in
the feature contract. This adoption is source-only; owner runtime and visual
acceptance remain pending.

Record these rows in the existing feature review, with actual frontend/backend
file symbols, the confirmed contract and a match/finding/Uncertain result. Phase 2
produces them and Phase 6 compares them against final source; imports/class names
and a previous review's "Matched" claim do not supply the evidence (Master 5).

| Concern | Required source comparison |
|---|---|
| Dataset and totals scope | Actual request page/size and backend clamp/Skip/Take (or absence), response rows/count/page metadata and scope of each total. For local paging prove the collection complete; for server paging use actual counts. Trace print/Excel to all matching rows with the same applied filter, including failure of any later page (6/8/21, BE 17). |
| Conditional filter controls | Trace every formControlName, including @if/tab/expanded filters, to its actual FormGroup ancestor and typed control. Do not close the form before projected conditional controls without explicitly binding that same group. Keep one Search submit contract. |
| Applied filter lifetime | Freeze valid filters on Search. Disable/enable the reactive form through its API around requests, with emitEvent=false; template disabled bindings alone are not the reactive busy contract. On user filter changes invalidate rows/totals and disable print/Excel until the next successful Search, unless an explicit applied-filter display identifies retained results. Reset not-run/error/paging state and prevent late responses restoring invalidated output (28). |
| Conditional business filters | Record toggle-off/default behavior, types and validation. Custom aging boundaries are positive increasing integers checked at both boundaries (BE 17); their effective applied values label grid, summary, print and Excel. Do not label custom values with fixed default ranges or send hidden custom values as effective defaults. The feature owns its exact boundaries/formula. |
| Dates and language | Confirm appDatePicker plus the required single-date dateInputMask/placeholder recipe (17), valid control state and shared serialization before Search. Resolve dropdown enum labels, display statuses and export headers in the active language rather than storing translated labels only at initialization (16/23). |
| Busy, failure and empty states | Trace declared and transport failures for report and lookups, one feedback owner and the matching skip header for inline errors (22), visible recovery, and distinct not-run/empty/error output. Mark narrow-layout and print/runtime acceptance pending unless actually authorized and performed (29). |

These are focused read-path checks, not permission to run builds/tests/browser/DB
commands or to modify unrelated consumers. A known mismatch remains a finding;
updating this book does not repair the application.

### Unpaged document contract example

One typed filter, one typed response holding every section:

```ts
export interface CustomerStatementFilter {
  customerId: number | string;
  fromDate: string;
  toDate: string;
  reportType: CustomerStatementReportType;   // 'ledger' | 'outstanding'
  includeInactive: boolean;
}

export interface CustomerStatement {
  contact: CustomerStatementContact;
  beginningBalance: number;
  totalDebit: number;
  totalCredit: number;
  endingBalanceTill: number;
  currentBalance: number;
  outstandingTotal: number;
  ageingSummary: StatementAgeingSummary | null;
  ledgerLines: StatementLedgerLine[];
  deposits: StatementDeposit[];
  pendingPDCs: StatementPendingPDC[];
  advanceTaxInvoiceLines: StatementLedgerLine[];
}
```

**All totals come from the response**, never summed in the template. A report
service is thin — one `GET`, same `Filters[key]` convention. This unpaged example
uses `Result<T>`; inspect existing endpoints rather than treating that type as proof
that their rows are complete:

```ts
@Injectable({ providedIn: 'root' })
export class CustomerStatementOfAccountService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.baseUrl}Customer/Statement`;

  getStatement(filter: CustomerStatementFilter): Observable<Result<CustomerStatement>> {
    return this.http.get<Result<CustomerStatement>>(this.endpoint, {
      params: toFilterParams(filter),
      headers: { 'X-Skip-Error-Interceptor': 'true' }, // inline report error owner (block 22)
    });
  }
}
```

### Derived operational summary reports

A report that combines KPI-style summary sections with a detail table still
uses this report pattern. It is not a paged list, and its detail table uses
typed `app-data-table` columns with the complete response rows. Use one typed
response containing every ordered summary section and the detail rows. The
template only formats values returned by the backend.

When the supplied evidence shows summary labels but not their calculations,
freeze a named backend derivation before implementing the screen. Record every
proxy (for example, how internal versus outside work or open versus closed jobs
is identified), the date boundary, the source entity, and the age buckets in
the feature handoff. Never fill an unconfirmed section with zeroes or derive a
different total for screen, print, and export.

Use the shared report shell and the current filter/action style:

- keep `app-feature-title` inside the report panel;
- place the complete typed filter form in one `no-print` row;
- for a single-day report, use one `p-datepicker`, default it to today, require
  the value, and serialize it from local year/month/day parts;
- place Print, Export and Refresh/Search in one `appReportActions` toolbar;
- use typed `app-data-table` columns for report rows and the shared responsive
  scroll/print inputs, not list paging or row actions;
- show loading, inline error, empty-summary, and empty-detail states; and
- make solid action and title icons explicitly white in light and dark themes.

`Fleet/DailyServiceLogs/` is the baseline for the single-date operational
summary shape. Its ordered response arrays carry stable metric codes so labels
remain translated while calculation ownership stays on the backend.

### Filter bar

Date range as one control, `no-print` on the whole form, and the form disabled while the report
runs. Disable it with `filterForm.disable({ emitEvent: false })` and re-enable it in `finalize`,
not with `[disabled]` on a reactive control. The snippet shows the semantics of the Statement of
Account; its `statement-*` presentation classes are legacy, and a reviewed report uses the shared
strip above:

```html
<form class="statement-filters no-print" [formGroup]="filterForm" (ngSubmit)="search()">
  <div class="statement-filter-grid">
    <div class="statement-field statement-date-field">
      <label for="statementDateRange">{{ 'customerStatement.dateRange' | translate }}</label>
      <p-datepicker
        inputId="statementDateRange"
        formControlName="dateRange"
        selectionMode="range"
        [numberOfMonths]="2"
        dateFormat="dd/mm/yy"
        [readonlyInput]="false"
        [keepInvalid]="true"
        [showClear]="true"
        [showButtonBar]="true"
        [hideOnDateTimeSelect]="false"
        panelStyleClass="sigma-datepicker-panel statement-range-picker"
        [disabled]="loadingReport()"
        appendTo="body"
      ></p-datepicker>
    </div>
    …customer dropdown, include-inactive checkbox…
  </div>

  <div class="statement-filter-footer">
    <div class="statement-report-types">
      <label>
        <p-radioButton formControlName="reportType" value="ledger"
                       [disabled]="loadingReport()"></p-radioButton>
        <span>{{ 'customerStatement.ledgerReport' | translate }}</span>
      </label>
      …outstanding…
    </div>

    <div
      appReportActions
      class="statement-actions"
      [ariaLabel]="'general.actions' | translate"
    >
      <button type="button" (click)="print()" [disabled]="!report() || loadingReport()">…</button>
      <button type="button" (click)="exportToExcel()"
              [disabled]="!ledgerLines().length || loadingReport()">…</button>
      <button type="button" (click)="refresh()" [disabled]="loadingReport()">…</button>
    </div>
  </div>
</form>
```

For a range calendar, keep the popup open after the first date is selected so
the user can select the end date from the same control:

```html
<p-datepicker selectionMode="range" [hideOnDateTimeSelect]="false"></p-datepicker>
```

Keep the range value date-based and make both dates easy to choose when the
range spans more than one month:

```html
<p-datepicker
  selectionMode="range"
  dataType="date"
  [numberOfMonths]="2"
  rangeSeparator=" - "
></p-datepicker>
```

Default the range to the **current month**, from the 1st to its last day, the same as lists
(owner rule 2026-09-24, block 17): `dateRange: this.fb.control<Date[] | string | null>(currentMonthRange())`.

**Explicit owner exception, 2026-10-02:** Customer Statement starts and resets with
null date range/customer, so the user can inspect its empty table layout. The
existing selected-mode table headers and empty messages render before Search;
response/contact/KPIs remain absent and print/export stay disabled. An empty
ageing section must not manufacture zero balances. Search still requires valid
dates and a customer. Keep this documented exception scoped to that report;
other report defaults remain current month unless explicitly overridden.

Serialize with the shared helpers, never `toISOString()` and never a private copy (block 17):
`const [fromDate, toDate] = parseDateRange(values.dateRange);` gives `yyyy-MM-dd` strings
(null when invalid).

### Search: validate, then run

Report filters are validated inline into `errorMessage`, not as a toast, because
the message belongs beside the filters:

```ts
search(): void {
  if (this.loadingReport()) return;

  const values = this.filterForm.getRawValue();
  const [fromDate, toDate] = parseDateRange(values.dateRange);   // yyyy-MM-dd or null

  if (!fromDate || !toDate || fromDate > toDate) {
    this.errorMessage.set(this.translate.instant('customerStatement.invalidDateRange'));
    return;
  }
  if (values.customerId === null || values.customerId === '') {
    this.errorMessage.set(this.translate.instant('customerStatement.customerRequired'));
    return;
  }

  const filter: CustomerStatementFilter = {
    customerId: values.customerId,
    fromDate,
    toDate,
    reportType: values.reportType,
    includeInactive: values.includeInactive,
  };

  this.errorMessage.set('');
  this.hasSearched.set(true);
  this.loadingReport.set(true);
  this.loading.startLoading();

  this.statementService.getStatement(filter)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.loadingReport.set(false); this.loading.endLoading(); }),
    )
    .subscribe({
      next: (response) => {
        if (response.isSuccess && response.entity) { this.report.set(response.entity); return; }
        this.report.set(null);
        this.errorMessage.set(response.message
          || this.translate.instant('customerStatement.loadError'));
      },
      error: () => {
        this.report.set(null);
        this.errorMessage.set(this.translate.instant('customerStatement.loadError'));
      },
    });
}
```

Changing the report type clears the previous result rather than showing stale
numbers under a new heading:

```ts
this.filterForm.controls.reportType.valueChanges
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe((reportType) => {
    this.selectedReportType.set(reportType);
    this.report.set(null);
    this.hasSearched.set(false);
    this.errorMessage.set('');
  });
```

### Sections from computed slices

Each section reads one `computed` off the single response, so the template never
touches `report()?.x?.y` chains:

```ts
readonly ledgerLines        = computed(() => this.report()?.ledgerLines ?? []);
readonly deposits           = computed(() => this.report()?.deposits ?? []);
readonly pendingPDCs        = computed(() => this.report()?.pendingPDCs ?? []);
readonly advanceTaxInvoices = computed(() => this.report()?.advanceTaxInvoiceLines ?? []);
readonly isOutstanding      = computed(() => this.selectedReportType() === 'outstanding');
```

### Rows, numbers, empty state

Amounts always use `| money` (`shared/pipes/money.pipe.ts`: 2 decimals, Latin
digits, the backend rounding, and the same text as a grid money column). Blanks
always render as `—`. Truncated text carries a `[title]`. Define typed
`app-data-table` columns so conditional fields remain aligned in the column
definition, body and any shared summary presentation. The shared grid owns the
loading and empty states; bind its empty visibility to the report's
`hasSearched`/error state so "no result", "not run yet" and "error" remain
distinct. Do not add a feature-owned `<table>` or a second row renderer.

### Totals footer

Keep report totals in the response and the shared report summary bar, outside the
grid rows. If a future section requires a grid-integrated total row, add that
capability to the shared component within the scoped report task before using
it; do not document or invent feature-owned summary inputs, add a feature-owned
table footer, or recompute totals in the template.

Signed balances render as magnitude plus a Dr/Cr marker, not a minus sign:

```ts
balanceDirection(value: number | null | undefined): string {
  return (value ?? 0) >= 0
    ? this.translate.instant('customerStatement.debitShort')
    : this.translate.instant('customerStatement.creditShort');
}
absoluteAmount(value: number | null | undefined): number {
  return Math.abs(value ?? 0);
}
```

### Export

Build export objects when Export is clicked so translated property names use the
current language (block 8). For a tabbed report, dispatch from the active typed
key to that section's complete array and existing grid columns. Use the shared
formatter; never slice the local page or require ledger rows to export a populated
secondary section. Customer Statement's source uses:

```ts
private buildExportRows(): Array<Record<string, string | number>> {
  const translate = (key: string) => this.translate.instant(key);
  switch (this.activeTab()) {
    case 'ledger':
      return dataTableExportRows(this.ledgerLines(), this.ledgerColumns(), translate);
    case 'deposits':
      return dataTableExportRows(this.deposits(), this.depositColumns, translate);
    case 'pending-pdcs':
      return dataTableExportRows(this.pendingPDCs(), this.pendingPDCColumns, translate);
    case 'advance-tax':
      return dataTableExportRows(this.advanceTaxInvoices(), this.advanceTaxColumns(), translate);
    case 'ageing':
      return dataTableExportRows(this.ageingRows(), this.ageingColumns, translate);
  }
}

exportToExcel(): void {
  const rows = this.buildExportRows();
  if (rows.length) {
    onExportToExcel(signal(rows),
      `CustomerStatementOfAccount_${this.selectedReportType()}_${this.activeTab()}`);
  }
}
```

Memoising translated object keys in a
`computed()` is **Legacy — do not copy**: `translate.instant()` reads no
signal, so a language switch does not invalidate those cached headers.

A second export may aggregate the selected applicable lines — group in a Map,
never a second request. Customer Statement uses its active ledger/outstanding or
advance invoice lines through chargeLines; the action is unavailable on deposits,
PDCs and ageing because those models have no voucher-type debit/credit fields.
Keep the existing confirmed grouping formula; this changes data selection only:

```ts
readonly chargesTypewiseTotals = computed(() => {
  const totals = new Map<string, { voucherType: string; debit: number; credit: number; balance: number }>();
  this.chargeLines().forEach((line) => { … });
  return Array.from(totals.values()); // neutral data; translate headers on click
});
```

**Check:** typed filter and one typed response · totals from the response, never
summed in the template · required filters validated into `errorMessage` before
the request · `hasSearched` distinguishes empty from not-run · every action
disabled while loading · export and print disabled with no data · amounts
with `| money` · `—` for blanks · conditional columns added to header, body and footer
together · default range the current month · dates serialized with `parseDateRange`/`toApiDate` · form
disabled with `disable()`, not `[disabled]` · one outer `appReportPage` · each
report action group uses `appReportActions` with a translated accessible name.

---
