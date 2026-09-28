# Screen 04 — Hierarchy tree workspace

> Navigation layer: adds no rule and restates no value. The cited blocks win.

| | |
|---|---|
| Use when | The domain is intrinsically hierarchical and the main operation is navigating parent/child nodes, not paging flat records |
| Do not use when | The data is flat; do not build a tree to avoid the grid, and do not flatten a true tree to reuse grid chrome |
| Owning block | [1 Feature folders and wiring](../01-feature-folders-and-wiring.md), section "Hierarchy tree workspace — canonical composite" |
| Approved reference | `Accounts/Account/components/list` with its embedded `components/details` pane |
| Backend pattern | Not fixed by the UI shape; select from backend "The five patterns" |
| Contracts to freeze first | Node detail/Add/Update contract; which node capabilities (root, fixed, leaf/parent) come from backend state; delete rules (Master block 4) |

## Read in this order

| # | Block | Decides for this screen |
|---|---|---|
| 1 | [1 Feature folders and wiring](../01-feature-folders-and-wiring.md), tree section | Composition: title, compact toolbar, one scrolling tree region, embedded detail pane, narrow-screen stacking, selection versus nested actions, local search limits |
| 2 | [3 Header](../03-header.md) | Title inside the workspace card |
| 3 | [4 Filters](../04-filters.md) | Control height for the toolbar search |
| 4 | [9 Confirm: delete](../09-confirm-delete.md) | Destructive node actions |
| 5 | [15 View mode](../15-view-mode.md), [10 Confirm: discard](../10-confirm-discard.md) | Detail pane modes and dirty exit |
| 6 | [16](../16-dropdowns-lookups-enums.md), [19](../19-validation-messages.md) | Controls in the detail pane |

Then the cross-cutting blocks listed in the [catalog](00-catalog.md).

## Close with

Block 29 verification expectations (the item for hierarchy and tabbed settings
workspaces) and the check list of the block 1 tree section.
