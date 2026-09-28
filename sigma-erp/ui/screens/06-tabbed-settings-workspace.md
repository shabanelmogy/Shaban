# Screen 06 — Tabbed settings workspace

> Navigation layer: adds no rule and restates no value. The cited blocks win.

| | |
|---|---|
| Use when | One routed screen loads and saves a whole configuration or account-mapping set, usually split into tabs |
| Do not use when | The screen edits many independent financial rows (use [05](05-financial-collection-editor.md)) or a list of records (use [01](01-list-with-modal-editor.md)) |
| Owning blocks | [1 Feature folders and wiring](../01-feature-folders-and-wiring.md), "Routed settings-workspace exception"; [16 Dropdowns, lookups, enums](../16-dropdowns-lookups-enums.md) for the typed options source |
| Approved reference | `Accounts/Link Accounts/LinkAccounts/components/details` + `shared/components/editor-tabs/` |
| Backend pattern | 4 Settings |
| Contracts to freeze first | Settings read/save contract keyed by its logical key; typed options contract (Master block 4) |

## Read in this order

| # | Block | Decides for this screen |
|---|---|---|
| 1 | [1 Feature folders and wiring](../01-feature-folders-and-wiring.md) | Settings-workspace exception: header, Save, tabs, and filters outside the one content scroll viewport |
| 2 | [13 Modal with tabs](../13-modal-with-tabs.md) | `app-editor-tabs` usage; the workspace appearance is owned by the component |
| 3 | [16 Dropdowns, lookups, enums](../16-dropdowns-lookups-enums.md) | Typed options endpoint shape (Link Accounts example) |
| 4 | [3 Header](../03-header.md), [4 Filters](../04-filters.md) | Title and compact search |
| 5 | [14 Editable collection table](../14-editable-collection-table.md) | Only when a tab holds editable rows; no second vertical scroll owner |
| 6 | [19 Validation messages](../19-validation-messages.md), [10 Confirm: discard](../10-confirm-discard.md) | Validation and unsaved changes |

Then the cross-cutting blocks listed in the [catalog](00-catalog.md).

## Close with

Block 29 verification expectations (the item for hierarchy and tabbed settings
workspaces).
