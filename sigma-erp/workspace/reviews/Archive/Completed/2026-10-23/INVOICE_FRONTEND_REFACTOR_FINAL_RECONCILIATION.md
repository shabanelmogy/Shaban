# Invoice Frontend Refactor Final Reconciliation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | Angular invoice hub, core list/editor, route ownership, typed generation contract, compatibility links, and user guide |
| Date | 2026-10-12 |
| Contract | `INVOICE_FRONTEND_REFACTOR_CONTRACT_FREEZE.md` |

## Delivered

| Area | Implementation | Evidence |
|---|---|---|
| Route ownership | Added one registry for canonical invoice routes and type-to-detail resolution. | `Invoice/models/invoice-route-registry.ts`, `Invoice/invoice.routes.ts` |
| Core list | Replaced the legacy hub table with shared `DataTable`, `FilterPanel`, typed paging/query state, loading/error/empty handling, and canonical row navigation. | `Invoice/components/list/*` |
| Core generation | Added typed `InvoiceGenerationRequest` and a dedicated `InvoiceService.generate()` adapter for `POST Invoice/GenerateInvoices`. | `Invoice/models/generation.ts`, `Invoice/services/invoice.service.ts` |
| Rental/Lease editor | Added one typed editor with numeric backend `AgreementType`, customer/staff lookups, validation, dirty-form guard, and read-only detail mode. | `Invoice/components/core-editor/*` |
| Compatibility | Preserved inherited generic `InvoiceService` methods for existing CreditNote and legacy consumers; old specialised `/Invoice/...` links redirect to feature-owned modules. | `Invoice/services/invoice.service.ts`, `Invoice/invoice.routes.ts` |
| Guidance | Added invoice user-guide content and registered it in the shared reader. | `UserGuide/content/invoice-guide.ts`, `guide-reader.component.ts` |

## Contract reconciliation

- `/Invoice` remains a core `InvoiceBase` hub; it does not merge specialised invoice tables in the browser.
- Rental and Lease generation sends editable inputs only. Tax, totals, balances, and journal values remain backend-owned.
- The backend `InvoiceCreatingType` boundary is respected. `LimousineSingle`, Salik, Darb, and Fines remain catalog/legacy values and are not sent by the new core editor.
- Tax Advance keeps its existing dedicated workflow and routes.
- Existing generic service methods and backend routes remain available for old consumers.

## Remaining bounded work

The architecture and hub migration are in place. The specialised modules remain independently owned; the older Miscellaneous editor and any other feature-specific visual cleanup should be migrated in a separate bounded pass using their own API contracts. No new aggregate invoice-list endpoint was invented.

## Initial screenshot evidence received

The two supplied screenshots are functional evidence for the next UI slice, not independent implementation instructions. They show the intended invoice hub with:

- a `Generate Invoices` entry point;
- basic filters for invoice number, agreement number, invoice type, date range, customer, branch and status;
- an expandable advanced filter area including vehicle/asset, ownership, salesperson, customer type, job number, due date, master/manual agreement, agreement type/status, contact group, VIP, sale origin and project;
- report, tax report, Excel, invoice-receipt export, charges-wise export and Search actions;
- print toggles and a grid containing invoice number, PO number, invoice type, date, customer, customer code, agreement/master agreement, job number, amount, due amount and status;
- a row action menu containing View, Edit, Print, Mark Disputed, Allocate, UnApprove, Delete and Journal.

The screenshots do not define the authorization/state rules, payloads, confirmation/reason dialogs, or destination routes for those actions. Those remain `Missing` until the user supplies the promised button/action details. The current implementation therefore does not invent or wire these behaviors.

## Invoice-type decision received

The user explicitly deferred `Fines`, `Darb`, and `Salik`. They are excluded from the current Generate Invoices menu, route registry, and core generation payload. The currently supported visible candidates remain Rental, Lease, Advance Tax, Equipment, Limousine, Transportation, and Miscellaneous, each through its owning module or the frozen core contract. `Excess KMs` appears in the legacy screenshot but has no confirmed backend creation command or frontend owner in the current source, so it remains `Missing` until its contract is supplied.

## Verification boundary

Source-only checks completed: recipe drift check, scoped source inspection, route/service/DTO cross-check, stale import search, and `git diff --check`. Builds, tests, lint, browser/runtime calls, database commands, migrations, commits, and pushes were not run under the project instructions.

## Owner verification

1. Open `/Invoice`, apply filters, paginate, and open a row with each returned invoice type.
2. Use each create menu item and confirm it lands on the owning feature route.
3. Open old `/Invoice/equipment-rental/...`, `/transportation/...`, `/misc/...`, and `/limousine-...` links and confirm redirects.
4. Create Rental and Lease invoices and confirm the request reaches `POST Invoice/GenerateInvoices` with numeric `AgreementType` and `InvoiceType` values.
5. Confirm Tax Advance and existing CreditNote consumers still use their old routes and generic service methods.
6. Review the Invoice entry in User Guide in English and Arabic.

