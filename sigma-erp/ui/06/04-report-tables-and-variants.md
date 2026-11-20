<!-- Part of UI block 6: see ../06-grid-and-footer.md. Same status and authority as the block. -->

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

For local pagination, bind each section's complete array with `lazy=false` and
`paginator` = not printing. The shared table hides the pager while a local table
has no rows, so the pager shows exactly when rows exist. Use the shared default page size and 10/15/20/50/100 options: do not
bind a fixed `rows` number. The shared table owns an unbound offset: a new result
(a different first row) opens on page 1 and keeps the chosen size, while appended
rows keep the page; tab panels stay mounted so each keeps its page. Bind
controlled `first`/`rows`, `totalRecords` and `paginationChange` through
`resolveListPaging` only when the feature must own the page, for example per-key
paging state; such a consumer resets its own offset on a new result. This is
presentation paging, not server paging.
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
