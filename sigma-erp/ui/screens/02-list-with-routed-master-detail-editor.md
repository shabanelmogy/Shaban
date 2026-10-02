# Screen 02 — List with routed document editor

> Navigation layer: adds no rule and restates no value. The cited blocks win.

| | |
|---|---|
| Use when | The UI block 13 decision rule (D4-2) sends the record to a page: two or more child collections, or totals, or approval/posting. Create, View and Edit are routes of one editor |
| Do not use when | The record has fields only or one small child list without totals (use [01](01-list-with-modal-editor.md)); the document posts a journal (use [08](08-financial-document.md), which builds on this type) |
| Owning blocks | [1 Feature folders and wiring](../01-feature-folders-and-wiring.md), "Shared editor page shell"; [13 Modal with tabs](../13-modal-with-tabs.md), decision rule and "Routed full-page detail form"; [14](../14-editable-collection-table.md) `EditableRows` |
| Approved reference | List as screen 01 (`Workshop/Job/components/list`); editor `Workshop/Job/components/editor` (shell, `EditableRows`, field errors, return with list state); single-collection variant `Rental/RentalQuotation/components/details` |
| Backend pattern | 2 Master-detail, no financial effect; 3 when saving writes a journal voucher, allocations, or accounting state |
| Contracts to freeze first | Route contract (the decision-rule reason, list query parameters kept on return); Grid Column and Filter contract; Detail/Add/Update contract with child reconciliation; Action-state contract (Master block 4) |

## Read in this order

| # | Block | Decides for this screen |
|---|---|---|
| 1 | [1 Feature folders and wiring](../01-feature-folders-and-wiring.md) | `create`, `edit/:id`, `view/:id` routes; the shared editor page shell; the fixed footer outside the form body; one scroll owner per pane |
| 2 | List blocks [2](../02-service-and-response-wrappers.md)–[9](../09-confirm-delete.md) | As screen 01, except that Create, View, and Edit navigate to the editor routes |
| 3 | [13 Modal with tabs](../13-modal-with-tabs.md) — routed variant | One typed parent form, section-header Add action, the child collection filling the remaining height |
| 4 | [14 Editable collection table](../14-editable-collection-table.md) | Child rows, bounded row scrolling, row actions |
| 5 | [15 View mode](../15-view-mode.md) | The `view/:id` route is read-only |
| 6 | [10 Confirm: discard](../10-confirm-discard.md) | Leaving a dirty editor |
| 7 | [16](../16-dropdowns-lookups-enums.md), [17](../17-dates.md), [19](../19-validation-messages.md) | Controls present in the header and child rows |
| 8 | [21 Report print](../21-report-print.md) | Only when the record is printed from the editor |

Then the cross-cutting blocks listed in the [catalog](00-catalog.md). Derived
totals shown in the editor are previews; the backend owns the stored values
(`AGENTS.md`, "Backend, mapping, and calculation rules").

## Close with

Block 29 verification expectations, and the "check" lists of blocks 13 and 14.
