# Invoice Frontend and Route Contract Freeze

| Field | Value |
|---|---|
| Status | Blocked |
| Owner verification pending | yes |
| Scope | Angular invoice entry points and route ownership |
| Date | 2026-10-12 |

## Frozen facts

- `/Invoice` is backed by `InvoiceController` and its `InvoiceBase` query. It is not an aggregate endpoint for the specialised invoice tables.
- `/EquipmentRentalInvoice`, `/LimousineInvoice`, `/TransportationInvoice`, and `/MiscellaneousInvoice` are independently lazy-loaded feature modules with independently typed services.
- The existing `/Invoice/...` links for specialised types are compatibility candidates, not canonical routes.
- Existing backend API route spelling and old controller entry points remain frozen for compatibility.

## Proposed route ownership

| Type | Canonical owner | Canonical create/view routes |
|---|---|---|
| Rental | Core Invoice | `/Invoice/rental/create`, `/Invoice/rental/details/:id` |
| Lease | Core Invoice | `/Invoice/lease/create`, `/Invoice/lease/details/:id` |
| Tax advance | Core Invoice tax-advance workflow | `/Invoice/tax-advance/create`, `/Invoice/tax-advance/details/:id` |
| Limousine | LimousineInvoice | `/LimousineInvoice/create`, `/LimousineInvoice/view/:id` |
| Equipment rental | EquipmentRentalInvoice | `/EquipmentRentalInvoice/create`, `/EquipmentRentalInvoice/view/:id` |
| Transportation | TransportationInvoice | `/TransportationInvoice/create`, `/TransportationInvoice/view/:id` |
| Miscellaneous | MiscellaneousInvoice | `/MiscellaneousInvoice/create`, `/MiscellaneousInvoice/details/:id` |

## Decisions still required

1. **List boundary:** keep `/Invoice` as a core-only facade (recommended), or approve a new backend `InvoiceOverview` read contract that aggregates all specialised invoice tables.
2. **LimousineSingle:** confirm whether it is only a UI workflow alias for the current `LimousineInvoice` candidate flow. The backend `InvoiceCreatingType` does not contain `LimousineSingle`.
3. **Salik/Darb/fines:** confirm whether they should appear as invoice creation choices. Existing source provides upstream processing/settings/traffic-fine routes but no matching `/Invoice` command contract.
4. **Core editor:** approve replacing the legacy rental/lease form with a typed `GenerateInvoiceRequest` form. The current form lacks required generation inputs and must not be adapted by guessing amount/date semantics.

## Implementation gate

No Angular source was changed while these decisions are open. Once the owner selects the route boundary and confirms the three type questions, implementation can proceed in one coordinated pass with compatibility redirects, typed services/models, and the route matrix above.

