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
| Feature SCSS | Feature-owned page/panel/error layout plus optional public `--sigma-data-table-*` variable overrides; no copied `.p-datatable-*`, action-menu, or paginator integration rules |

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
  currentPageReport="feature.pageReport"
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

For Fleet Alerts specifically, Insurance owns checkbox selection, whole-row
activation, and batch renewal. Services owns checkbox selection for customer
email reminders and one direct per-row Update Vehicle Service button rendered
through the shared table's typed custom-cell contract. Whole-row activation
remains a single-record shortcut to the same dialog; checkbox interaction must
not open it. Do not add a selected-row toolbar edit action, because service
completion updates exactly one row. Keep the circular action within the shared
compact row height; an oversized control must not make Services the only variant
that expands the route page. The direct button must own its click, prevent row
event propagation, and pass the row's normalized positive `serviceId` to the
dialog. Whole-row activation may call the same helper. A missing or invalid
service ID is a visible response-contract error, never a silent return.
Registration, Mileage, and Warranty are
read-only variants. Fleet Alerts opts into a bounded shared table
`scrollHeight` so row overflow scrolls inside the Grid and the paginator stays
visible:
do not reproduce a screenshot checkbox unless a matching mutation or batch
contract is confirmed. Every variant still owns type-specific columns and
screen/export/print parity. The Services dialog records date/time, fuel level,
current KMs, and the due service; opening the dialog must not auto-open its
calendar, while an intentional click on the calendar field or icon must open it.

Drive paging and sorting directly from the typed lazy-load event:

```ts
onLazyLoad(event: TableLazyLoadEvent): void {
  const rows = Math.max(1, Number(event.rows ?? this.pageSize()));
  const first = Math.max(0, Number(event.first ?? 0));
  const nextPage = Math.floor(first / rows) + 1;
  const nextSort = this.isSortField(event.sortField)
    ? event.sortField
    : this.sortField();

  if (nextPage === this.pageNo() && rows === this.pageSize()
      && nextSort === this.sortField()) return;

  this.pageNo.set(nextPage);
  this.pageSize.set(rows);
  this.sortField.set(nextSort);
  this.requestList();
}
```

### Grid styles — shared table, feature placement

**Canonical:** `shared/components/data-table/data-table.component.scss` owns
PrimeNG wrapper, table, header, cells, action control, paginator, empty state,
and table-level light/dark defaults. A feature must not copy those selectors.
Its list SCSS owns only page/panel/error layout and the placement of the shared
component:

```scss
.feature-table-wrapper {
  --sigma-data-table-min-width: 640px;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  margin: 0 8px;
  overflow: hidden;
}
```

The wrapper takes the same `8px` inline margin as the `app-feature-title` host
and the block 4 filter strip, so all three cards share both edges. It has no
bottom margin, because the paginator is grounded to the card's bottom edge.

**The grid rows are the screen's scroll owner (no page scroll).** The page never
scrolls (block 1, *No page scroll*). A list screen therefore gives the remaining
panel height to the grid, and the rows scroll inside it while the title, filters,
and paginator stay fixed.

> **Transitional — fill workaround, until the shared fill mode exists (backlog 34).**
> `app-data-table` has no fill mode yet. Its wrapper forces
> `max-height: var(--sigma-data-table-scroll-height, 288px) !important`, and
> `scrollHeight="flex"` leaves that variable invalid, so the grid does not fill
> on its own. Until the shared component gains a fill input, pass
> `scrollHeight="flex"` and copy this block **exactly**. It is the only
> permitted feature-level override of table or paginator internals:
>
> ```scss
> ::ng-deep .feature-table-wrapper {
>   .sigma-data-table,
>   .p-datatable {
>     flex: 1 1 auto;
>     min-height: 0;
>     display: flex;
>     flex-direction: column;
>     height: 100%;
>     overflow: hidden;
>   }
>
>   .p-datatable-wrapper {
>     flex: 1 1 0 !important;
>     min-height: 0 !important;
>     height: auto !important;
>     max-height: none !important;
>     overflow-y: auto !important;
>   }
>
>   p-paginator,
>   .p-paginator {
>     margin-top: auto !important;
>     padding: 6px 0 4px !important;
>     flex-shrink: 0 !important;
>   }
> }
> ```
>
> The shared paginator's own spacing is `padding: 10px 0 12px`; the values above
> compact it only inside a filled grid. Add no other `.p-datatable-*` or
> `.p-paginator` rule. When backlog 34 ships, replace this block with the shared
> fill input.

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
`{totalPages}`; `{total}` and `{{total}}` stay on screen as literal text. This
rule covers only `currentPageReport`: a hand-built pager that translates a key
with ngx-translate parameters (`'key' | translate: { from, to, total }`, for
example `alerts.showingEntries`) correctly uses `{{…}}`.

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
`.p-datatable-*`, action-control, dropdown, or paginator rules beyond the
Transitional fill block · grid rows are the single scroll owner and the page does
not scroll · public CSS variables used only for real feature variation · no
cross-feature `@use`.

---

