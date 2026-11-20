# Screen 08 — Financial document

> Navigation layer: adds no rule and restates no value. The cited blocks win.

| | |
|---|---|
| Use when | An accounting document: a header, lines, server-calculated totals and a journal — invoice, bill, credit or debit note, receipt, payment, journal voucher, deposit |
| Do not use when | The record has no accounting effect (use [02](02-list-with-routed-master-detail-editor.md)); the screen edits many financial rows without a document header (use [05](05-financial-collection-editor.md)) |
| Owning blocks | [1](../01-feature-folders-and-wiring.md) editor shell; [13](../13-modal-with-tabs.md) routed variant; [14](../14-editable-collection-table.md) `EditableRows`, derived cells, shared summary; [19](../19-validation-messages.md) *Money and tax in forms*; [7](../07-action-button-cycle.md) approve/post/void; backend [15](../../backend/15-pattern-3-master-detail-with-financial-effect.md) |
| Approved reference | Editor shell `Workshop/Job/components/editor`; backend `Services/VouchersServices/InvoiceService.cs`. The first voucher reviewed becomes the full document reference |
| Backend pattern | 3 Master-detail with financial effect, plus the open journal decisions in `reviews/JOURNAL_ENTRIES_DECISION_SHEET.md` |
| Contracts to freeze first | Document Add/Update with the full-snapshot lines (D4-3); totals and VAT ownership (per tax rate, rounded once — D4-4); the posting policy (posts on save, or on approval); the action-state contract for approve, post, void and credit (Master block 4); the account of every journal line |

## Read in this order

| # | Block | Decides for this screen |
|---|---|---|
| 1 | List blocks as [02](02-list-with-routed-master-detail-editor.md) | The list, filters, grid, export and return to the list |
| 2 | [1](../01-feature-folders-and-wiring.md), [13](../13-modal-with-tabs.md) | Routed editor on the shared shell — topics: [`01/02-viewport-and-scroll.md`](../01/02-viewport-and-scroll.md), [`13/06-routed-editors.md`](../13/06-routed-editors.md), [`13/07-dirty-close.md`](../13/07-dirty-close.md) |
| 3 | [14](../14-editable-collection-table.md) | Lines through `EditableRows`; derived line cells read-only; totals in `sigma-editor-totals` (or `sigma-report-summary-bar` for Debit/Credit) — main file and topics: [`14/02-public-inputs.md`](../14/02-public-inputs.md), [`14/03-row-mechanics.md`](../14/03-row-mechanics.md) |
| 4 | [19](../19-validation-messages.md) | Tax rate read-only from settings; preview `documentTax`; no literal rate |
| 5 | [7](../07-action-button-cycle.md), [9](../09-confirm-delete.md) | Approve/post/void as domain actions; posted cancellation marks the retained source/JV voided without a reversing entry (BE15 owner2026-10-20); no posted deletion — topics: [`07/01-approval-status.md`](../07/01-approval-status.md), [`07/02-action-menu-runtime.md`](../07/02-action-menu-runtime.md), [`07/03-action-log.md`](../07/03-action-log.md) |
| 6 | [18](../18-documents-and-upload.md) | Attachments through `DocumentUploadTracker` |
| 7 | Backend [15](../../backend/15-pattern-3-master-detail-with-financial-effect.md), [8](../../backend/08-validation-duplicates-keys-delete.md) | Transaction, posting, VAT, allocations, `AllExistAsync` |

Then the cross-cutting blocks listed in the [catalog](00-catalog.md).

## Close with

Block 29, the checks of backend block 15 and UI block 14, and the journal of one saved document
compared line by line with the expected accounting.
