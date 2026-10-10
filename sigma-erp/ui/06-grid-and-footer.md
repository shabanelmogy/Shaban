## 6. Grid and footer

> **Status: Canonical** — reusable `app-data-table` with feature-owned data and
> query state

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
