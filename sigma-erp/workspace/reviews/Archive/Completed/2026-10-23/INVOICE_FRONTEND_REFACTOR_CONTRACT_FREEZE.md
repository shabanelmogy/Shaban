# Invoice Frontend Refactor Contract Freeze

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Scope | Complete Angular invoice feature structure, route ownership, typed API boundaries, and legacy-link compatibility |
| Date | 2026-10-12 |

## Objective

Replace the legacy mixed invoice UI with a maintainable feature structure while preserving existing backend endpoints, existing specialised modules, and old deep links during the migration.

## Frozen architecture

### 1. Invoice hub

`/Invoice` becomes the invoice hub. It owns:

- the invoice navigation shell;
- the core `InvoiceBase` list exposed by `InvoiceController`;
- the canonical route registry used by menus, list links, and compatibility redirects;
- shared invoice display contracts only.

The hub does not query or merge specialised invoice tables in the browser.

### 2. Feature ownership

| Feature | Angular owner | API owner |
|---|---|---|
| Rental and Lease core invoices | `modules/Vouchers/Invoices/Invoice` | `InvoiceController` / `IInvoiceService` |
| Tax advance | `modules/Vouchers/Invoices/Invoice` tax-advance workflow | `InvoiceController` compatibility routes backed by `ITaxAdvanceService` |
| Limousine invoices | `modules/Limousine/LimousineInvoice` | `LimousineInvoiceController` |
| Equipment rental invoices | `modules/Equipment Rental/EquipmentRentalInvoice` | `EquipmentRentalInvoiceController` |
| Transportation invoices | `modules/Transportation/TransportationInvoice` | `TransportationInvoiceController` |
| Miscellaneous invoices | `modules/Vouchers/Invoices/MiscellaneousInvoice` | `MiscellaneousInvoiceController` |

Each owner keeps its own DTOs, typed service methods, list/detail/write workflow, translations, and state handling. Shared components and query utilities are reused without sharing business DTOs.

### 3. Canonical routes

- `/Invoice`
- `/Invoice/rental/create`
- `/Invoice/rental/details/:id`
- `/Invoice/lease/create`
- `/Invoice/lease/details/:id`
- `/Invoice/tax-advance/create`
- `/Invoice/tax-advance/details/:id`
- `/LimousineInvoice/create`
- `/LimousineInvoice/view/:id`
- `/EquipmentRentalInvoice/create|view|edit/:id`
- `/TransportationInvoice/create|view|edit/:id`
- `/MiscellaneousInvoice/create|details/:id`

Old `/Invoice/...` specialised paths are compatibility aliases only. New code must use canonical routes from the registry.

### 4. Contract rules

- Core generation uses `GenerateInvoiceRequest[]`; generic CRUD `post/put` is not an invoice-generation adapter.
- Client sends editable inputs only. Tax, total, balances, and accounting values remain backend-owned.
- `InvoicesTypeEnum` is treated as a UI/catalog enum. It is not sent as a core API enum unless the backend contract supports that value.
- `LimousineSingle`, Salik, Darb, and Fines are not added to the core generation payload without a source-backed backend command. They may remain as legacy catalog values only where an existing workflow requires them.
- Every feature follows the shared typed list/editor patterns for loading, empty, validation, and both API failure channels.

### 5. Migration strategy

1. Introduce the route registry and typed core API contracts.
2. Replace the hub list/menu path construction and remove nonexistent `/Invoice` links.
3. Add compatibility redirects for old specialised links.
4. Replace core rental/lease legacy forms with typed generation editors.
5. Bring the remaining legacy specialised UI (especially Miscellaneous) onto the shared list/editor pattern without changing its backend contract.
6. Reconcile all direct `/Invoice/...` navigation and route strings.

## Explicit assumption

The refactor uses the recommended core-only hub boundary. A single all-invoice grid would require a new backend aggregate read contract and is outside this frontend-only refactor until separately approved.

