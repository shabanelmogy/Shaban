## 6. Grid and footer

**Topic files of this block** (read only the one the task needs; they are part of this block):

- [Percentage columns, first-column freeze, advanced filtering, exact money, scroll owner](06/01-columns-filters-money.md)
- [Post-save text rows and row centering](06/02-row-presentation.md)
- [Report row width, report hierarchy, tree bulk controls, statement rows](06/03-report-rows-and-trees.md)
- [Report tables on the shared grid and report variants](06/04-report-tables-and-variants.md)
- [CSV import workspace and incremental flat datasets](06/05-csv-and-incremental.md)

> **Status: Canonical** — reusable `app-data-table` with feature-owned data and
> query state

### Authoritative report footer rows
`DataTableComponent.footerRows: ReadonlyArray<T>` defaults to an empty array.
A report may supply backend-owned complete-result totals using the same typed
column shape. The shared table renders them in its own `tfoot` under the same
column widths and horizontal scroll frame, rather than in a second grid.
`displayValue` retains the existing column value/money/date/status formatting;
footer rows do not render interactive cell templates, links, hierarchy toggles,
selection controls or row actions. Empty selection/action cells retain alignment.
The first physical column follows the existing logical sticky owner and print
reset. The shared cell and total tokens own presentation in both themes/RTL.

Footer rows are separate from `value`: they never enter local filtering,
sorting, pagination, row counts, selection or incremental transport. The report
must label their complete applied-filter scope; a local column filter does not
recompute authoritative totals. No frontend summation or inferred grand total.
Print preparation includes the same footer with every prepared source row,
using the existing `printAllRows`, inverse scrollable and `sigma-print-flow`
contracts. Default-empty consumers render no footer rows and retain their data
and interaction contracts. Vehicle Rental Details is the first adoption;
source-written alignment/count/format/default specifications were not executed.
Owner acceptance of scrolling, RTL/themes, pagination and print remains pending.

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

**Shared default page size — owner decision 2026-10-03.** Tables open with
15 rows through `DEFAULT_PAGE_SIZE` in `shared/utils/list-query.ts`, superseding
the earlier 20-row default. Standard choices are 10/15/20/50/100. The shared
DataTable applies them for omitted/empty/legacy options, including the former
10/20/50/100 standard. New or reviewed controlled grids use the shared default;
explicit custom sizes/choices and user-selected sizes retain their owners.
The minimum stays 10; presentation paging never changes report completeness,
totals, export or full-print scope. All four Suppliers screens consume this
shared default.


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
