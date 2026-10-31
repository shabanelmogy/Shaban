## 6. Grid and footer

> **Status: Canonical** — reusable `app-data-table` with feature-owned data and
> query state

### Shared percentage columns (owner request, 2026-10-24)

Use `DataTableColumn.type: 'percentage'` for authoritative numeric percentage
points, e.g.50 means50%, with null/undefined indicating unavailable. Existing
DataTable owns the presentation using the installed PrimeNG ProgressBar: a
two-decimal percentage label beside a52px wide,4px high decorative track,
8px gap, Sigma primary fill and border-token track. The bar can shrink to20px;
do not add feature templates/paint or a second progress component. Current
adopters are PR consumptionPercent and PO receiptPercent, including the PO
report's reused column descriptors.

Zero is a valid empty bar. Missing/non-finite values show an em dash without a
bar. Only visual fill clamps to0..100: negative/over100 text stays visible,
never rewrite source numbers or infer business status/threshold colors. No
animation; fill starts at logical start for RTL. Visible text carries the
value for accessibility; decorative progress is aria-hidden. Print hides the
bar, and existing export writes the same two-decimal percent text. Numeric
filter/sort values remain the raw finite number, not the decorated text or
clamped fill. Existing value callbacks, templates, hierarchy/link composition
keep precedence. Columns must deliberately declare their semantic type;
do not reinterpret tax rates, variances or arbitrary numeric fields as progress.
Source formatting/filter/export contracts are shared with data-table.format;
no backend fields, calculations or API changes. Verify owner visual/print
acceptance separately from source conformance.

**Shared first-column freeze and advanced filtering (owner, 2026-10-23).**
The shared read table freezes the first **rendered** column at the logical start of
the scroll frame. The rendered order remains selection (when present), Actions
(when present), then the declared data columns; the freeze must not reorder those
columns or add a second frozen business column. Flow/non-scrollable and print
tables clear the sticky positioning. Header and body cells use the same frozen
ownership and existing opaque row/header surfaces, so the sticky cell stays above
the scrolling cells without changing the row scroll owner, widths, themes or RTL
direction.

The shared PrimeNG column menu applies to flat read tables. Text, numeric, boolean
and calendar constraints combine through its AND/OR rules, Apply and Clear. A
complete local `value` is filtered before local paging, using private view values
and retaining original row objects for actions/selection. Display callbacks remain
the visible-value owner; money filters are numeric and dates are calendar dates.
Local report filtering does not recalculate authoritative totals or redefine its
complete print/export contract. Hierarchies retain their existing ancestor/subtotal
and expansion contract; do not silently filter a flattened visible branch.

For server/lazy reads, `withGridFilters` preserves the applied feature filter
snapshot and serializes the same rules under `Filters[grid]` (BE9), before count,
page and all-pages export. `gridFilters` restores the applied menu state; Reset
clears it, a changed rule returns to page one, and absent event metadata preserves
the snapshot. Existing screen filters remain ANDed. Shared count-only paging emits
the same metadata. Never locally filter a server page, fetch all server pages just
for filtering, or use an interceptor/ambient global state to hide endpoint ownership.
The common `ListQuery.filters` type owns optional `grid` alongside its typed screen
fields, including inline filter shapes; do not require a different API for those
consumers or weaken typed serialization with an any cast.
The shared serializer must preserve that generic filter shape at its function
boundary: `toListParams<TFilters extends object>(query: ListQuery<TFilters>)`.
Fixing it to `ListQuery<object>` erases the screen keys and causes excess-property
errors for inline filter literals once the shared optional grid field is present.

The owning typed response/query projection is the server field whitelist. Public
`filterField`, `filterType` and `filterOptions` cover source-supported scalar
aliases, stable nullable types and translated enum choices; sorting retains its
original whitelist. Explicit server expression maps own composite display aliases.
Action-only/positional or genuinely non-filterable enriched columns use documented
`filterable:false`; the server rejects unsupported fields/operators with a localized
400 instead of silently dropping them. Column menus do not create a business field.
Read projection/filter expression conformance must be checked for custom materializers;
an AutoMapper map is not evidence that a post-page calculation is filterable.

PrimeNG21 empty constraints must remain inactive, including `notEquals`; the
shared table scopes its FilterService correction to its own provider. Clear/reset
restores an empty default constraint for every menu, including after a remote
snapshot restore. The dynamic report owner's complete flat branch reuses this
same DataTable; its tree branch retains its own ancestor/expansion contract.
Stable-choice menus include a translated No value choice for historical nulls.
Keep its internal marker distinct from Clear, serialize it as a real JSON null,
restore it on return, and compare missing local values through the scoped filter
provider. A source-derived badge resolves its translated option before its raw
field when a complete local report reuses remote column metadata.
An in-place post-save merge is safe only when it cannot alter membership/order
or counts under the applied snapshot. Active advanced rules require an
authoritative refresh when an edited value can enter or leave the result; the
Language texts fast path therefore also requires no applied grid rules.

Source evidence: shared DataTable/list-query, generic Service.GridFilterProjection,
typed custom list projections and the 2026-10-23 owner-approved unified contract in
`reviews/SHARED_TABLE_REMOTE_FILTER_CONTRACT_FREEZE.md`. Runtime/SQL/visual acceptance
remains owner verification; the source-only review must name compatibility exclusions.

**PrimeNG21 scroll owner (2026-10-22).** The actual row viewport is
`.p-datatable-table-container`, a direct child of `.p-datatable`; the old
`.p-datatable-wrapper` no longer exists. Shared DataTable owns this hook in
fixed-height, scrollable, fill and flow modes. Preserve the existing height/flex,
overflow, sticky header and fixed paginator contracts when upgrading it; never
copy viewport selectors into features. The publisher row-count Select uses
`.p-paginator-rpp-dropdown`. Do not revive an obsolete selector by re-enabling
pointer events on a disabled control. Root shared styles give this paginator-role
Select intrinsic width and no flex growth, overriding full-width form-control
sizing. Keep it beside the report/page actions whenever their combined width
fits; retain responsive wrapping and no horizontal overflow at narrow widths.
Do not change form/filter Select widths or copy a per-screen footer override.
Rendered shared-control tests complement,
but do not replace, actual screen/print acceptance (UI29).

**Stable post-save text rows (2026-10-17).** A text editor may return typed
canonical committed row snapshots to its existing parent. When the active
query is All, has no Search, and orders by immutable key, overriding text
cannot change row membership, ordering or count: merge visible matching keys
without refetching count/page. Require the same query/session/page and complete
snapshots for every changed key, including Save-and-Next. Reset must reload
its authoritative direct value before it is complete. Search, Empty filtering,
value ordering or any incomplete/mismatched result uses the normal server
refresh. Never infer filtered membership from JavaScript collation or change
counts locally. Existing explicit Refresh remains authoritative; no backend
or paginator contract changes. Evidence: Languages text editor/list follow-up.

**All-table vertical centering (explicit owner rule, 2026-10-15).** Every table
cell, header/body/footer and grouped/rowspan cell is vertically centered,
including native/legacy tables, shared DataTable, editable collections and
report output. `src/styles.scss` owns the universal `table th, table td`
`vertical-align:middle!important` rule to override vendor cell inheritance;
shared DataTable explicitly centers headers/body, including multiline wrap
cells. EditableCollectionTable follows UI14's same default except for the
validation-capable control rows described below. No per-screen opt-in
is required. Remove contradictory table-cell top/bottom rules or offset padding
when found in scope; RentalPlanner's group-cell top rule/8px top offset is the
verified conflict removed with this general change. Keep horizontal alignment,
column sizes, row spans, sticky/scroll/paging and text wrapping unchanged.

Inputs, text, checkboxes, badges, file controls and row actions are centered as
their cell content; a field and its validation message form one centered group
outside the shared editable-row exception below.
Do not give cells flex/block display or detach validation text just to center
one control. Ordinary form-grid top alignment outside tables remains. This rule
supersedes the prior table top-default/optional-middle guidance, including UI14's
legacy vertical-align token. Verify rows with mixed content heights, multiline
text/errors, row spans, empty states, Create/Edit/View, RTL/themes and print;
source review does not prove runtime/visual acceptance.

**Stable validation-row control track (owner correction,2026-10-23).** The
Company Documents screenshot and request show that centering a field/error
group lowers neighboring controls as an error wraps. Generalize the earlier
attachment-only refinement (2026-10-22) in the existing shared
EditableCollectionTable: every body row containing `app-field-error` or
`app-file-field` top-aligns all its cells through one scoped important rule.
Controls, file/View and row actions retain the first34px track; the complete
error stays below in normal flow. Standalone15px checkboxes center within that
track through shared logical margin, while captioned checks retain their
existing34px wrapper. Headers, empty rows and ordinary non-form table rows
remain middle-aligned. UI14 owns the implementation, with no per-screen opt-in,
cell display changes, detached errors, feature offsets or business changes.
Source-only; mixed errors, actions, RTL/theme/narrow/print acceptance is pending.

**Mandatory replacement rule.** New and refactored list pages must use one
shared `<app-data-table>`. The `ms-lib` `<table-list>` wrapper,
`TableListComponent`, and feature-local copies of PrimeNG table markup are
**Legacy — do not copy**. When a list feature is placed in refactor scope,
replace its existing table in place; do not add a parallel component or route.
Restoring an older filter, header, or action-button appearance changes only the
feature-owned shell around the grid. It must not restore `<table-list>`, direct
feature-owned `<p-table>` markup, or any internal-table mutation.

The reusable component contains the one direct PrimeNG `<p-table>` and owns its
paginator, action-column rendering, translated headers, default cells, custom
cell-template outlet, optional accessible row activation, optional checkbox
selection, loading state, empty state, responsive scrolling, and table-level
light/dark styling. Never
hand-build a second pager on the main grid. The feature retains all data and
business ownership.

**Report row viewport width (owner correction, 2026-10-05).** The shared row
wrapper reads public `--sigma-data-table-scrollbar-gutter` in both ordinary and
scrollable modes, defaulting to `stable` for existing consumers. Canonical report
panels set it to `auto` (UI20), so a report does not reserve an empty strip after
its final column when no vertical scrollbar is needed. Keep native scrolling,
column minima and the complete frame width. Classic scrollbars still occupy
their required space on actual overflow; do not hide them or compensate with
negative margins or fixed pixel additions. Fill/flow, paginator and print
owners remain. Source-only; desktop/narrow, RTL and overflow acceptance pending.

**Shared default page size — owner decision 2026-10-03.** Tables open with
15 rows through `DEFAULT_PAGE_SIZE` in `shared/utils/list-query.ts`, superseding
the earlier 20-row default. Standard choices are 10/15/20/50/100. The shared
DataTable applies them for omitted/empty/legacy options, including the former
10/20/50/100 standard. New or reviewed controlled grids use the shared default;
explicit custom sizes/choices and user-selected sizes retain their owners.
The minimum stays 10; presentation paging never changes report completeness,
totals, export or full-print scope. All four Suppliers screens consume this
shared default. Source-only; owner runtime acceptance pending.

**Optional complete-report hierarchy (Accounts review, 2026-10-05).**
`DataTableHierarchy<T>` retains the backend's nested rows. The feature supplies
stable `rowKey`, `children`, optional code/label and existing inline navigation;
the shared grid owns expansion, accessible native toggle buttons, logical 14px
depth indentation and stable visible-row materialization. `defaultExpanded`
initializes each identity once. `printAllRows` traverses every descendant without
changing screen expansion, and the report exporter traverses the same complete
source independently of expansion. A deliberately flat report may use the public
column `indent` callback; it must not invent children. No hierarchy input means
the ordinary grid retains its previous behavior. Column `link` represents an
existing cell navigation action, without changing row selection/action semantics.
Optional hierarchy `activateEnabled` keeps structural headings/subtotals as
plain text while retaining their expansion toggle; omitted guards keep existing
navigation. The owner-requested CashFlow tree groups each complete response
activity array under its matching display root, without inventing account-parent
relationships. Its local stable IDs, default-expanded children and closing
subtotals retain the existing accounting row tones. The root repeats the server
net amount so a collapsed activity still shows its net; no UI sum is added.
Print traverses all children and explicit Excel reads original complete arrays
independently of expansion.
This is a presentation capability, not new paging or accounting aggregation.
The public column `cellClass: 'sigma-data-table__cell--wrap'` also wraps its
shared inline navigation label; the shared stylesheet owns this opt-in rule.
Ordinary links retain ellipsis/nowrap. CashFlowStatement adopts wrapping for
long account names without changing link activation or exported values.
Source conformance is reviewed; owner compilation/visual/print acceptance remains
pending.

**Report tree bulk controls — mandatory owner rule, 2026-10-05.** Every report
with a real hierarchy provides Expand All / Collapse All through the one shared
`ReportTreeActionsComponent`. DataTable renders it automatically when its
`hierarchy` input is present; ordinary flat/indent-only tables do not render it.
The toolbar uses the existing ReportActions owner and native secondary buttons,
translated labels and accessible toolbar name, wrapping, theme/RTL and no-print.
Disable it while loading or when no branch exists; omit it during print preparation.
Bulk actions visit the complete supplied hierarchy, including hidden descendants,
initialize all visited identities and then rebuild visible rows once. Collapse
must not let defaultExpanded reopen previously hidden branches when a parent is
opened again. Return the row viewport to the start; preserve per-row toggles and
screen expansion state through printAllRows. No fetching, hierarchy flattening,
new child relationships, UI totals or mutation of backend rows. Canonical complete
print and export remain independent of screen collapse. The existing shared dynamic
Reports TreeNode adapter consumes the same controls with a recursive local clone
of its existing nodes; a new source array drops that bulk override, and repeated
commands work after individual toggles. Its existing output behavior and tree body/paginator remain
compatibility-only for this bounded action addition, not a canonical table
reference; full report-body reviews still follow the mandatory shared-table rule.
Source-only; owner keyboard/visual/print/runtime acceptance pending.

**Optional accounting statement rows (CashFlow owner request, 2026-10-05).**

DataTable `rowTone` returns section/subtotal/total/null. The shared stylesheet
owns themed heading surfaces, bold net subtotals with a single rule and a
double-rule final total. Feature display rows retain complete source values;
totals come from backend fields, never a UI sum. Public column `width` applies
to matching header/body cells; optional `link.enabled` renders plain text for
non-navigable headings/totals and guards activation. Omitted inputs preserve
ordinary grid behavior. CashFlow uses78%/22% Account/Amount columns and the
existing32rem minimum, with tabular LTR amounts via shared numeric cell class.
Full print retains every statement row and the shared white print surface.

The selected paginator page is a primary action state: use
`var(--sigma-primary)` for its border and background, with white text retained
through hover and keyboard focus. Keep this in the shared table stylesheet so
light theme, dark theme, and every consuming list use the same state.

The canonical list shape has four independently reviewable layers:

| Layer | Required evidence |
|---|---|
| Shared component | `shared/components/data-table` contains exactly one direct `p-table`, typed `DataTableColumn<T>`, optional actions/custom cell templates/row activation/checkbox selection, table-owned paginator, empty/loading states, and table-level theme/RTL-safe styling |
| Feature template | Exactly one `app-data-table` with feature data, columns, actions, paging/sort inputs, translated report/empty keys, error-aware empty visibility, one typed lazy-load output, optional typed row-activation output only when the whole row has one clear workflow, and optional typed checkbox selection only for a confirmed batch workflow |
| Feature TypeScript | `DataTableComponent`, typed `DataTableColumn<Row>`, typed `TableLazyLoadEvent`, page conversion in one handler, API `totalRecords`, sort whitelist and stale-request protection; no `TableModule`, table `@ViewChild`, or internal mutation |
| Feature SCSS | None for a list: page, panel, header, alert and grid placement are the shared shell classes (block 1). Only the public `--sigma-data-table-*` variables may be set; no `.p-datatable-*`, action-menu or paginator rule |

A reviewer must report evidence for each layer. Finding `app-data-table` in the
feature template does not prove that API paging, sort whitelisting, refresh, or
failure handling is correct.

```html
<app-data-table
  class="feature-grid"
  [value]="data()"
  [columns]="columns"
  [actions]="moreActions()"
  dataKey="id"
  [first]="firstRecord()"
  [rows]="pageSize()"
  [totalRecords]="totalRecords()"
  [rowsPerPageOptions]="rowsPerPageOptions"
  [loading]="loading()"
  [sortField]="sortField()"
  [sortOrder]="sortOrder()"
  [showEmpty]="!errorMessage()"
  currentPageReport="feature.showingEntries"
  emptyMessage="feature.empty"
  (lazyLoad)="onLazyLoad($event)"
></app-data-table>
```

When a confirmed workflow opens from the whole row, opt in explicitly and keep
the feature responsible for the resulting business action:

```html
<app-data-table
  [value]="data()"
  [columns]="columns"
  [rowInteractive]="true"
  (rowActivated)="openWorkflow($event)"
></app-data-table>
```

The shared table owns pointer, `Enter`, `Space`, focus-visible styling, and
suppression when the event originated from a nested link, button, form control,
or other interactive element. Do not enable whole-row activation when it would
be ambiguous beside conflicting row controls. The emitted row remains typed;
the feature decides whether to open a modal, navigate, or run another confirmed
workflow.

When a confirmed batch workflow acts on rows, opt in through the shared table's
checkbox column. The shared table owns the header checkbox, row checkboxes,
accessible labels, and suppression of row activation from checkbox events. The
feature owns the typed selected rows, action availability, batch payload, and
clearing selection when a search, page, sort, refresh, or mutation replaces the
rendered result:

```html
<app-data-table
  [value]="data()"
  [columns]="columns"
  dataKey="id"
  [selectable]="true"
  [selection]="selectedRows()"
  [selectionPageOnly]="true"
  [selectAllAriaLabel]="'feature.selectAllVisible' | translate"
  [rowSelectionAriaLabel]="rowSelectionAriaLabel"
  (selectionChange)="selectedRows.set($event)"
></app-data-table>
```

The canonical select-all scope is the current rendered page. Never label or
treat it as "all matching records" unless a separate confirmed server contract
loads or identifies the complete filtered result. A batch action must be
disabled when selection is empty and must send stable identifiers, not row
indexes. If whole-row activation is also enabled as a single-item shortcut,
selecting a checkbox must not open that workflow.

### Report tables use the shared grid

Every report table in new or reviewed report work uses the shared
`app-data-table` with typed columns. Existing reports migrate when their report
is in scope; this rule does not authorize a bulk rewrite of reports outside the
current review. First preserve the frozen transport contract: for a proven
complete response, set `[lazy]="false"` and keep the complete arrays and
backend totals; for an existing paged response, keep `[lazy]="true"`, its
server paging and authoritative counts. Never present a partial page as a
complete report merely to use the shared grid, and do not add list requests,
sort controls, actions or selection merely to use it.

Select the scroll layout from the report contract. A proven complete response
shown as an externally scrolling full document uses `scrollable=false`; the
outer report frame owns both axes. A
report with independently visible bounded sections uses `fill=true` and
`scrollable=true` for each section on screen when the shared grid owns its row
viewport. This applies to a complete response with an unpaginated section (the
Follow Up Summary) and to a complete response with a bottom-pinned local
paginator (the Follow Up Details and Customer Statement): each section's layout
boundary becomes a shrinking flex boundary with overflow hidden, passes its
remaining height to the grid, and leaves that section's shared row wrapper as
its active scroll owner. A frozen paged response keeps
`lazy=true` and its server paginator/count contract. Keep section headings
outside the wrapper. Customer Statement uses this fill variant like
BalancesSummary; no feature PrimeNG/pager rules or viewport arithmetic are
needed.

For a proven complete response, `paginator=false` shows every row. A local
paginator is allowed only when the complete collection has been proved and the
report contract calls for presentation paging; it slices the already loaded
array without a request.
Customer Statement and Follow Up Details use local pagination. Follow Up Summary
remains unpaginated. A report with hierarchical rows
retains that hierarchy through typed shared-grid support; if the shared
component lacks a required hierarchy capability, add it in that report's
scoped implementation. Do not flatten the hierarchy or introduce a feature
owned table as a workaround.

For local pagination, bind each section's complete array, its length as
`totalRecords`, and independent controlled `first`/`rows` inputs. Use the shared
default page size and 10/15/20/50/100 options. Reconcile `paginationChange` through
`resolveListPaging` before updating the section's state. Switching tabs retains
their pages/sizes; filter changes and valid Search/Refresh reset offsets to zero
while preserving chosen sizes. This is presentation paging, not server paging.
Print must temporarily disable all section paginators, wait for rendering and
restore the controlled state through `ReportPrintService.afterPrint` (block 21).
Export and totals continue to use complete response arrays.

For local sorting, the shared table also consumes PrimeNG `firstChange` and forwards
the changed offset through the same typed pagination event. PrimeNG resets local
sorts to the first page without `onPage`; ignoring that output leaves a consumer's
controlled page stale. This synchronization is disabled for lazy/server grids and
while the paginator is off for print preparation, preserving their existing owners.
Features use `resolveListPaging` on that shared event rather than reaching into the
PrimeNG table. Source evidence: `DataTableComponent.onTableFirstChange` and the
installed PrimeNG table's local-sort reset; runtime acceptance remains pending.

**Prove completeness before local paging.** Inspect the actual request and backend
page-size clamp/slicing/counts (block 20). A first-page array is not the complete
report even when its wrapper is Result<T>. If the API is paged, retain server paging
with its actual count, or freeze an explicit all-pages collection contract before
using local paging. Never set rows.length as the full count of a partial response,
and never claim full print/export merely because the local paginator is disabled.

`scrollable` defaults to true, preserving existing lists and dialog grids.
When false, shared flow styling removes the internal wrapper height/overflow
bounds, retains shared sticky headers and ignores fill mode. Section widths
use the public `--sigma-data-table-min-width` variable; features never style
PrimeNG internals or copy the table palette. This variant also owns full-row
print flow, wrapping and light print surfaces. Keep report tabs/panels and
mode-specific section conditions governed by blocks 13/20/21.

### One screen, multiple report variants

When radio buttons, tabs, or another selector switch one report page between
different alert types, every selectable type must have a confirmed endpoint and
must replace the complete report contract together: request route, default sort,
sort whitelist, columns, count label, empty state, export columns, and print
columns. Do not leave a control enabled while continuing to call the previous
type's endpoint, and do not duplicate a separate screen for each variant when
the filters and page shell are shared.

Selection and row activation belong to a **workflow**, not automatically to the
shared screen. Enable them only for the variants that have a confirmed action
contract. Clear selection when the variant changes. A read-only alert variant
must not show checkboxes, a primary mutation button, or pointer/keyboard row
activation merely because another variant on the page supports them.

Feature-specific variant decisions belong to the feature review, not to this block (Fleet
Alerts: `reviews/FLEET_ALERTS_FEATURE_REVIEW.md`). A variant that owns its bounded row
scroll uses the shared `scrollHeight` input, never a feature override. A full document
scrolled by the outer report frame uses `scrollable=false` as described above.

Drive paging and sorting directly from the typed lazy-load event. Resolve paging
with `resolveListPaging` from `shared/utils/list-query.ts` against the **previous**
feature query state before writing any signals. The pure helper owns the
zero-based offset to one-based page conversion, minimum 10 rows, and the
page/size change comparison. A size-only change on page 1 must fetch again;
an unchanged page and size must not. Do not compare a new size after assigning
it to `pageSize`, and do not copy this calculation into new or reviewed screens.
Existing consumers adopt it in their own screen review; changing the shared
table alone cannot repair a feature's incorrect comparison.

The feature still owns API filters, supported sorting and requests. Compare
sort state separately and use block 28's `Subject` / `switchMap` / `defer` flow:
never mutate page state and then silently drop its request because a previous
page is loading. `BalancesSummary/components/list` consumes the helper; Job
remains the approved list reference for the complete shell and request flow.

For a backend-confirmed sortable list:

```ts
onLazyLoad(event: TableLazyLoadEvent): void {
  const paging = resolveListPaging(event, {
    pageNo: this.pageNo(),
    pageSize: this.pageSize(),
  });
  const nextSort = this.isSortField(event.sortField)
    ? event.sortField
    : this.sortField();
  const nextOrder = event.sortOrder === -1 ? -1 : 1;

  if (!paging.changed && nextSort === this.sortField()
      && nextOrder === this.sortOrder()) return;

  this.pageNo.set(paging.pageNo);
  this.pageSize.set(paging.pageSize);
  this.sortField.set(nextSort);
  this.sortOrder.set(nextOrder);
  this.requestList();
}
```

### Grid styles — shared table, feature placement

**Canonical:** `shared/components/data-table/data-table.component.scss` owns the PrimeNG
wrapper, table, header, cells, action control, paginator, empty state and table-level
light/dark defaults. The placement is the shared `div.sigma-list-table` (block 1): the same
`8px` inline margin as `app-feature-title` and the filter panel, so the three cards share both
edges, and no bottom margin, because the paginator is grounded to the card's bottom edge. A
list screen writes no wrapper rule; a minimum table width is the
`--sigma-data-table-min-width` variable on the grid.

**The grid rows are the screen's scroll owner (no page scroll).** The page never
scrolls (block 1, *No page scroll*). A list screen therefore gives the remaining
panel height to the grid, and the rows scroll inside it while the title, filters,
and paginator stay fixed.

**Fill mode (backlog 34 resolved 2026-09-30).** Put the grid in
`div.sigma-list-table` (block 1 *Shared list page shell*) and pass `[fill]="true"` to
`app-data-table`: the component then fills the remaining panel height, the rows are the
scroll owner, the paginator is grounded at the bottom with compact spacing (`6px 0 4px`), and
`scrollHeight` is ignored. A feature adds **no** `.p-datatable-*`, `.sigma-data-table` or
`.p-paginator` rule. Screens that still carry the former Transitional `::ng-deep` fill block
replace it with `[fill]="true"` in their review.

`DataTableComponent.scrollToStart()` is the public adapter for resetting the
row viewport to top/inline origin. The shared component delegates to PrimeNG's
public `Table.scrollTo`; features may query their DataTableComponent instances
and call this adapter after rendering a tab. Do not query PrimeNG DOM or mutate
the underlying Table in a feature. It does not alter page, page size or data.

For a filling sectioned report, bind `scrollable=!printing()` alongside fill=true.
During full-print preparation this selects the existing flow variant and removes
the fill class; every bounded report layout carries `sigma-print-flow` and print
panel layout becomes normal document flow (blocks 20/21). The same rows, paging
state and shared palette are retained.

**Customizing the grid — inputs and tokens only.** A feature never reaches into the table with
`::ng-deep` (`.sigma-data-table`, `.p-datatable-*`, `.p-paginator`). It uses the inputs (`fill`,
`scrollHeight` for a grid nested in another scroll owner, `rows`, `paginator`, …) and these CSS
variables on the table host class: `--sigma-data-table-min-width`, `-border`,
`-header-background`, `-header-color`, `-row-background`, `-row-alt-background`,
`-row-hover-background`, `-text`, `-muted`, `-scrollbar-gutter`. A variable not in this list does nothing (for
example `--sigma-data-table-empty-height`). Migration 2026-09-30: 12 fill copies → `[fill]`
(Movements ×5, Trips, Workshop Vehicles, Work Order, Job Category, Labour Activities, Job
Estimation list and logs dialog); TripSheet and Transportation Agreement keep their
`scrollHeight` input and lost the duplicate `::ng-deep`. Remaining exceptions: Fleet Accidents,
Alerts, Service Bookings, Service Log (content-height page, needs the block 1 shell first) and
screens not built on `app-data-table` (Limousine `table-list` ×4, Rental Planner, Opening
Balance accounts, Workshop Vehicle details) — each moves in its own review.

An explicit `scrollHeight` value (for example
`clamp(200px, calc(100dvh - 500px), 460px)`) is only for a grid **nested inside**
another scroll owner, such as a report section or a tab. There the shared
component owns the row viewport and its paginator stays outside it. Do not add a
feature-local `.p-datatable-wrapper` override in that case.

The empty state defaults to `emptyMessage = 'general.noDataFound'`. Keep that key
in both `en.ts` and `ar.ts`, and add both entries when overriding it with a
feature key.

### Current page report format (`currentPageReport`)

Every new or refactored list screen that pages through `app-data-table` binds
`currentPageReport` to a feature translation key. Name a new key
`<feature>.showingEntries`. An existing `<feature>.pageReport` key that already
uses the placeholders below is compliant; do not rename it.

The shared component passes the value through the `translate` pipe and hands the
result to PrimeNG's `currentPageReportTemplate`. Define the key in both `en.ts`
and `ar.ts` with PrimeNG's placeholders only:

- `en.ts`: `'Showing {first} to {last} of {totalRecords} entries'`
- `ar.ts`: `'عرض {first} إلى {last} من {totalRecords} إدخال'`

**Do not omit `currentPageReport`.** When it is unbound, `app-data-table` falls
back to `'{first} - {last} / {totalRecords}'` and shows only numbers
(`1 - 10 / 16`).

**Inside `currentPageReport`, use no other placeholder.** PrimeNG replaces only
`{first}`, `{last}`, `{rows}`, `{totalRecords}`, `{currentPage}`, and
`{totalPages}`, each at its first occurrence only; `{total}` and `{{total}}`
stay on screen as literal text. This rule covers only `currentPageReport`: a
hand-built pager that translates a key with ngx-translate parameters
(`'key' | translate: { from, to, total }`, for example
`alerts.showingEntries`) correctly uses `{{…}}`.

Do not bind `general.showingEntries` until backlog 37 is resolved: it still uses
`{total}`.

Public CSS variables allow an exceptional feature-specific width or semantic
color without copying component internals: `--sigma-data-table-min-width`,
`--sigma-data-table-empty-height`, `--sigma-data-table-border`,
`--sigma-data-table-header-background`, `--sigma-data-table-header-color`,
`--sigma-data-table-row-background`, `--sigma-data-table-row-alt-background`,
`--sigma-data-table-row-hover-background`, `--sigma-data-table-text`, and
`--sigma-data-table-muted`. Prefer defaults. If a feature overrides a color, it
must supply the corresponding dark-theme value under `:host-context`.

**Feature-owned presentation boundary.** The Company and Individual lists both
use the compact filter geometry from block 4, but each feature keeps locally
prefixed page and filter selectors (`companies-*` and `individuals-*`). Neither
feature imports the other's stylesheet. Use approved shared components for the
data table, primary action, and editor shell; retain only feature-specific
placement and secondary-action styling locally. Never add a cross-feature
`@use` or paste a sibling feature stylesheet.

**Check:** no `table-list`, `TableListComponent`, feature-local `p-table`,
`tableList.dt` or remote-table mutation remains · shared component plus feature
template, TypeScript and SCSS evidence reported separately · exactly one
`app-data-table` and no second pager · typed translated columns and empty state ·
`totalRecords` from the API total, never `rows.length` · page conversion
`first / rows + 1` once in the typed event handler · no copied
`.p-datatable-*`, action-control, dropdown, or paginator rules · grid rows are
the single scroll owner and the page does
not scroll · public CSS variables used only for real feature variation · no
cross-feature `@use` · no `::ng-deep` into `app-data-table`; only inputs and the listed `--sigma-data-table-*` variables.

---

### CSV import workspace extraction (2026-10-14)

A reviewed standalone import route with the confirmed ImportResult envelope, no context editor, and a complete locally read or returned failed-record collection uses the shared `app-csv-import-workspace`. The shared owner composes `app-feature-title`, `app-button-import-csv`, `app-primary-action-button`, `app-summary-cards`, `app-state-message` and `app-data-table`; it owns local preview paging, explicit Import execution, busy/finalize state, declared and transport failures, partial result counters and retained diagnostics. Each consumer owns its ordered CSV columns, header aliases, typed row builder, body key and endpoint. Selecting a file never mutates the server; after a mutation attempt the same preview cannot be submitted again, because chunked imports may have partially persisted. The consumer must preserve the backend import envelope and must not invent a list filter, server pager, CRUD action or retry policy. Source-only adoption evidence: Administration/DataImport; owner compile, runtime, API and responsive acceptance remain pending.

The owner's presentation amendment (2026-10-14) extends the existing shared
`ImportCsvComponent` for all current consumers. Template and local-file controls
use two equal token-based cards with 14px inset, 12px gaps, 44px icon tiles and
12px card radius; at a component container width of 580px or less they stack in
one column. The template card exposes its exact ordered headers in a native
`details` disclosure beside the existing Download Template action. The file card
opens its hidden native CSV input through a keyboard-operable shared
PrimaryActionButton Choose/Change action, shows parsing state, and displays a
filename only after valid parsing. Replacement selection, parse failure and
Reset clear that filename. Cards have no whole-card action or drag-and-drop
contract; file selection remains local reading, never a server upload or save.
The Administration workspace places these cards and feedback in one bounded
setup/feedback scroll region capped at 45% of the panel height. Title/subtitle,
Import/Reset toolbar, preview heading/count and table pager remain fixed; table
rows keep their own scroll owner. Preview count describes the displayed table
collection, never saved rows. Existing SummaryCards counters, diagnostics and
partial-save guards retain their owners and values. Shared logical spacing,
theme tokens, focus and long-text wrapping own the presentation; consumers add
no card or table-internal styling. The existing bilingual import guide covers
the template disclosure, Choose/Change, valid filename, local preview and Reset.
Source conformance does not certify visual or runtime behavior: owner acceptance
remains pending for both sides of 580px, intermediate/short-height layouts,
long filenames/Arabic, LTR/RTL, both themes and direct-dialog consumers.

**Compact import options in a dense editor (owner scoped request, 2026-10-20).**
The same ImportCsvComponent exposes optional compact=true; false retains the
existing card presentation. Select the compact mode for an explicitly scoped
dense editor, such as Bill Loan Payment Plan. The shared owner renders one
secondary Import dropdown with Download Template, Choose/Change CSV and exact
ordered columns. Reuse DropdownPortalDirective and the existing Bootstrap menu
for body placement, clipping recovery, RTL/theme and outside close. Compact
ImportCsv handles menu Arrow Up/Down and Escape locally: a body-portaled menu
no longer has the trigger sibling Bootstrap's delegated key handler expects.
Escape stops propagation, closes through the native trigger and returns focus,
so it does not also close the parent loan dialog. Tab/Enter retain native flow.
Keep one native file input and the existing parser, events, disabled/parsing
gates, reset, error and valid-filename semantics across both modes. Compact
host bounds and filename ellipsis belong to ImportCsv, never feature deep CSS;
retain the full filename for assistive text/title. Features may project this
control beside Prepare/Add through FormSection header actions; hide the nested
collection heading/Add when the parent already owns them. Opening options does
not parse, save or change draft rows. Existing card consumers do not opt into
compact mode automatically because this owner request is screen-scoped. Source
checks do not certify popup/focus/RTL/short-height runtime acceptance.
