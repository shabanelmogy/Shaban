# Screen 01 — List with modal editor (default)

> Navigation layer: adds no rule and restates no value. The cited blocks win.

| | |
|---|---|
| Use when | A paged list of records whose Create, View, and Edit belong to the list |
| Do not use when | The record needs an independently addressable page approved by source or a documented workflow (use [02](02-list-with-routed-master-detail-editor.md)), or the output is a report, tree, settings set, or financial collection (see the [catalog](00-catalog.md)) |
| Owning blocks | [6 Grid and footer](../06-grid-and-footer.md), [13 Modal with tabs](../13-modal-with-tabs.md) |
| Approved reference | `shared/components/data-table/` + `Fleet/VehicleService/components/list`; editor `shared/components/editor-dialog/` (+ `editor-tabs/`) + `Fleet/VehicleService/components/details` |
| Backend pattern | 1 Normal entity; 2 when a header owns detail rows |
| Contracts to freeze first | Grid Column and Filter contract; Detail/Add/Update contract; Action-state contract for risky or stateful actions (Master block 4) |

## Read in this order

| # | Block | Decides for this screen |
|---|---|---|
| 1 | [1 Feature folders and wiring](../01-feature-folders-and-wiring.md) | `list/` + `details/` folders, route table, container-fill host, the grid rows as the list's scroll owner |
| 2 | [2 Service and response wrappers](../02-service-and-response-wrappers.md) | Typed service calls and `Result` / `Results<T>` handling |
| 3 | [3 Header](../03-header.md) | Title inside the list card |
| 4 | [4 Filters](../04-filters.md) | Compact filter strip (default for a new screen) |
| 5 | [5 Columns](../05-columns.md) | Typed columns; ListVM carries only displayed and action-state fields |
| 6 | [6 Grid and footer](../06-grid-and-footer.md) | `app-data-table`, server paging, sort, footer and paginator |
| 7 | [7 Action button cycle](../07-action-button-cycle.md) | Row actions and state-based visibility |
| 8 | [8 Export to Excel](../08-export-to-excel.md) | Export with translated headers |
| 9 | [9 Confirm: delete](../09-confirm-delete.md) | Shared confirmation for delete |
| 10 | [13 Modal with tabs](../13-modal-with-tabs.md) | One controlled `app-editor-dialog` for Create, View, and Edit with an explicit mode; tabs only for real peer sections |
| 11 | [15 View mode](../15-view-mode.md) | Read-only controls, no Save, Close only |
| 12 | [10 Confirm: discard](../10-confirm-discard.md) | Dirty-close behaviour |
| 13 | [11 Small modal on top](../11-small-modal-on-top.md) | Only when the editor opens a nested dialog |
| 14 | [14 Editable collection table](../14-editable-collection-table.md) | Only when the editor owns child rows |
| 15 | [16](../16-dropdowns-lookups-enums.md), [17](../17-dates.md), [18](../18-documents-and-upload.md), [19](../19-validation-messages.md) | Controls actually present in the editor |

Then the cross-cutting blocks listed in the [catalog](00-catalog.md).

## Close with

Block 29 verification expectations, and the "check" list at the end of blocks 6 and 13.
