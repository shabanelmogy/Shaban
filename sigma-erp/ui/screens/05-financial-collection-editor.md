# Screen 05 — Financial collection editor

> Navigation layer: adds no rule and restates no value. The cited blocks win.

| | |
|---|---|
| Use when | An accounting setup or maintenance screen edits many financial rows under one shared business context, usually split into source/type tabs |
| Do not use when | The rows belong to one document header (use [02](02-list-with-routed-master-detail-editor.md)), or the screen only maps settings (use [06](06-tabbed-settings-workspace.md)) |
| Owning blocks | [14 Editable collection table](../14-editable-collection-table.md), section "Financial collection editor — canonical routed variant" (`[fillHeight]` + `[stickyHeader]`, shared summary bar); [1 Feature folders and wiring](../01-feature-folders-and-wiring.md), container-fill chain |
| Approved reference | `Accounts/openingBalances/components/details` + its tab editors + `shared/components/editable-collection-table/` |
| Backend pattern | Not fixed by the UI shape; select from backend "The five patterns" |
| Contracts to freeze first | Server-owned context fields; row Add/Update contract; backend-owned totals and balance (Master block 4) |

## Read in this order

| # | Block | Decides for this screen |
|---|---|---|
| 1 | [1 Feature folders and wiring](../01-feature-folders-and-wiring.md) | Routed financial-editor exception: grow-until-cap, what stays outside the row-scroll frame |
| 2 | [14 Editable collection table](../14-editable-collection-table.md), financial section | Header and immutable context, workspace tabs, grow-then-scroll rows, totals, Save |
| 3 | [3 Header](../03-header.md) | One title; context in its metadata area |
| 4 | [4 Filters](../04-filters.md) | Compact filters inside the workspace |
| 5 | [16](../16-dropdowns-lookups-enums.md), [17](../17-dates.md), [19](../19-validation-messages.md) | Row controls and validation |
| 6 | [10 Confirm: discard](../10-confirm-discard.md) | Leaving with unsaved rows |

Then the cross-cutting blocks listed in the [catalog](00-catalog.md). Totals
shown while editing are previews; the backend owns the stored values.

## Close with

Block 29 verification expectations (the item for financial editors) and the
"Financial collection check" in block 14.
