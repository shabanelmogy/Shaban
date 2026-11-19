# Sales Partial Invoice Contract Freeze — 2026-10-08

| Field | Decision |
|---|---|
| Status | Implemented in source — migration/build/runtime verification pending |
| Scope | Sales Agreement invoice action, invoice read-back, delivery gate, frontend action dialog and Sales guide |
| User decision | Support both unit-based and amount/phase-based partial invoices; allow delivery of invoiced units |
| Existing migration boundary | No migration or model snapshot is created by this task; owner must run `Add-Migration SalesAgreementPartialInvoices` before deployment |
| Accounting boundary | Every generated invoice remains a posted Miscellaneous Invoice/JV using the existing Sales accounts and tax snapshot |

## Frozen contract

1. Existing full invoice requests remain valid: when no unit IDs and no net amount are sent, the action invoices the full unbilled balance.
2. Unit-based invoice: `SalesAgreementItemIds` identifies one or more live agreement item rows. The server calculates their net value after the agreement discount and applies the agreement tax snapshot.
3. Amount/phase-based invoice: `NetAmount` is the amount before tax. The server applies the agreement tax snapshot. The UI labels the field as before-tax amount.
4. A request cannot contain both unit IDs and a net amount. A `IsFinal` request invoices the complete remaining balance and cannot contain unit IDs or a net amount.
5. The server calculates active invoiced totals from the linked Sales Miscellaneous Invoice records and rejects any request whose total (including tax) exceeds `TotalCharges` after currency rounding.
6. New lifecycle state `PartiallyInvoiced` is additive and does not renumber existing states. It is used while an agreement has at least one active invoice but the total is not fully invoiced. Full invoicing changes the agreement to `Invoiced` and marks units sold/inactive.
7. Unit-based partial invoices can be delivered partially: the posted invoice must cover the selected unit rows, and Deliver accepts only those selected agreement item IDs. Amount/phase invoices without item allocation cannot authorize delivery. Full invoicing plus delivery of all units produces the existing `Delivered` state; partial delivery uses additive `PartiallyDelivered` state without renumbering existing states.
8. Existing single-invoice agreements remain readable through the legacy `InvoiceId`; new invoices are additionally linked through `SalesAgreementInvoice` rows. No existing invoice or receipt is deleted or rewritten by this source change.
9. Receipts remain independent from invoices. The existing agreement receipt cap remains authoritative: active receipts cannot exceed `TotalCharges`, regardless of how many invoices exist.
10. Invoice edit/delete is blocked for all Sales invoices linked to an agreement, including legacy `InvoiceId` and new invoice-link rows. Corrections use the existing accounting credit-note workflow.
11. Purchase-cost validation follows the invoice basis: a unit invoice validates the selected units, a full/final invoice validates only reserved units whose cost will be posted, and an amount/phase partial invoice does not require an unrelated unit's purchase cost because it creates no physical-unit cost movement.

## Reviewer decisions and evidence

| Decision | Evidence | Rejected alternative |
|---|---|---|
| Keep amount before tax as the API amount | Existing `MiscellaneousInvoice` stores `Amount` as net and derives tax through `RecalculateTotals`; the agreement already stores `TaxPercent` | Treating client input as tax-inclusive would silently change existing invoice semantics |
| Allow partial delivery only for unit-linked invoices | A sales-fleet unit is the physical fulfillment boundary; the invoice must identify the same agreement item before its delivery note and `Delivered` sale status can be written | Allowing an amount-only invoice to choose an arbitrary unit |
| Keep receipts separate | `ReceiptService.ResolveSalesAgreementAsync` already enforces the agreement-level outstanding cap and supports multiple receipts | Coupling a receipt to one invoice before invoice-allocation semantics are designed |
| Add a child invoice link for new records | A single `InvoiceId` cannot represent multiple invoice documents; `AgreementNo` alone is not a durable aggregate relation | Replacing the legacy FK or inferring all history from a string only |

## API shape

`SalesAgreementInvoiceRequest` adds optional `NetAmount`, `SalesAgreementItemIds`, and `IsFinal`. `SalesAgreementDeliverRequest` adds optional `SalesAgreementItemIds`; omitted IDs retain the legacy all-units behavior only when all units are fully invoiced. The response remains the existing `Result` with the created invoice id. Detail adds invoiced amount, unbilled amount, delivery state and a list of linked invoice summaries. Existing list columns are unchanged; no new list column is introduced in this slice.

## Required owner follow-up

- Run `Add-Migration SalesAgreementPartialInvoices` after reviewing the entity/configuration changes; do not edit the snapshot by hand.
- Compile both repositories and execute a test matrix: full invoice, two unit invoices, amount invoices, final invoice, over-total request, duplicate item IDs, partial delivery rejection, receipt cap, void/credit-note correction, and legacy single-invoice agreement.
- Confirm accounting and tax treatment for each partial invoice in the target jurisdiction before production use.
