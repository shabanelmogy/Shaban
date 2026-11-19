# PR selection to the owning purchase-order editor

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Owner correction: selecting request lines stages them in the main purchase-order
screen; only that screen's Save persists. This supersedes the earlier embedded
conversion/Create handoff, while direct PR conversion may still review populated
rows before its own final Create. The picker itself never persists.

Keep one source PR per order, supplier scope, locked source identities/prices,
whole positive quantities, fresh server capacity and current Pending reservation
and discount rules. Use the existing POST PurchaseRequest/{id}/purchase-orders
only from the main Save for selected-source drafts. Ordinary/manual PO create
and saved PO update contracts remain unchanged. No entity/schema changes.

Frozen API extension (backward compatible): GET purchase-order-draft lines add
nullable itemId/assetTypeId/vehicleId/jobId and integer unitsOfMeasuresId for
rendering the real main form. POST existing conversion command adds optional
`header` object with editable supplierQuotationNo (max100), notes (max1000),
documents (same PO file list). Missing header preserves legacy source defaults;
present header uses its values, including explicit null clearing. Validate the
nested header before writing. Do not copy source attachments. Server resolves
source lines, supplier/type/currency/prices/tax and allocated discount as before.

The PO adapter uses selection-only mode on the current PR chooser. Apply emits
typed draft + line quantities locally, closes the dialog, fills the main form
and activates Details. Preserve entered date/branch/header/files. Lock supplier,
type, imported line identity/description/price/tax and allocated discount while
retaining editable quantities and main header fields/files. Reopening allows
reselection; Back returns to eligible requests under shared discard protection.
Main Save uses source line IDs and quantities plus main header/date/branch. It
must not silently use manual POST, lose documents, or accept stale capacity.

Root owns Angular adapter/shared picker/docs. Backend worker owns only the
three PR draft/create VMs and the bounded GetPurchaseRequestDraftAsync /
CreateFromPurchaseRequestAsync portions of PurchaseOrderService (explicitly
in scope despite being a canonical reference). No other source owners overlap.
No builds/tests/lint/runtime/browser/database/migrations/commits are authorized.
