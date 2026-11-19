# Invoice Full-Stack Review

| Field | Value |
|---|---|
| Status | Closed |
| Owner verification pending | yes |
| Scope | Angular invoice entry points, lazy routes, invoice services, and their existing .NET API boundaries |
| Review mode | Source-only; no application source was changed |
| Date | 2026-10-12 |

## Result

The current system already has the right long-term boundary for most invoice types: each specialised invoice has its own backend controller/service and, in several cases, its own Angular module. The main `InvoiceService` should remain the owner of the core `InvoiceBase` aggregate (rental, lease, tax advance, and limousine bulk compatibility), while specialised invoice modules own their own list/detail/write contracts.

The current Angular `Invoice` screen is not yet an integrated facade. It advertises routes and types that do not exist under `/Invoice`, and some legacy detail screens send generic CRUD payloads that do not match the backend generation contract. Implementing the frontend without first freezing this ownership would create a second, conflicting invoice API.

## Evidence map

| Concern | Current evidence | Finding |
|---|---|---|
| Core API | `SiGma.ServerAPI/Controller/InvoiceController.cs` exposes `Invoice`, `GenerateInvoices`, dispute, voucher, and tax-advance compatibility routes | Valid core boundary; preserve old paths |
| Core read | `InvoiceService.GetManyAsync` queries `InvoiceBase` and projects `InvoiceListVM` | It cannot list equipment/transportation/miscellaneous rows owned by other aggregates |
| Specialised APIs | `EquipmentRentalInvoiceController`, `TransportationInvoiceController`, `MiscellaneousInvoiceController`, and `LimousineInvoiceController` each have their own service contract | Keep separate feature modules |
| Angular lazy routes | `pages/routing.ts` registers `/Invoice`, `/EquipmentRentalInvoice`, `/LimousineInvoice`, `/TransportationInvoice`, and `/MiscellaneousInvoice` separately | Route ownership is already split at the application boundary |
| Broken generation links | `Invoice/components/list/list.component.ts` links equipment, limousine, transportation, miscellaneous, Salik, Darb, and fines to `/Invoice/...` paths | Several paths are not declared by `Invoice_Routes`; Salik/Darb/fines have no invoice generation route there |
| Type mismatch | Frontend `InvoicesTypeEnum` contains 11 values; backend `InvoiceCreatingType` contains 4 values | Frontend enum is a cross-feature display enum, not a valid core generation contract |
| Legacy editor payload | `Invoice/components/details` and the rental/lease/transportation legacy components use generic `post/put` or stub payloads | They must not be used as the new write path without a frozen DTO adapter |
| Modern reference | `LimousineInvoice` and `EquipmentRentalInvoice` use typed services, route modes, shared data-table/editor patterns, error channels, and dirty-form guards | Use these as the UI shape references for the specialised modules |

## Route ownership contract (proposed)

| Feature | Canonical route | API owner | Compatibility route |
|---|---|---|---|
| Core invoice list | `/Invoice` | `InvoiceController` / `IInvoiceService` | Keep |
| Rental | `/Invoice/rental/create`, `/Invoice/rental/details/:id` | `InvoiceController` generation/read | Keep while the core editor is replaced |
| Lease | `/Invoice/lease/create`, `/Invoice/lease/details/:id` | `InvoiceController` generation/read | Keep while the core editor is replaced |
| Tax advance | `/Invoice/tax-advance/create`, `/Invoice/tax-advance/details/:id` | `InvoiceController` tax-advance routes delegated internally to `ITaxAdvanceService` | Keep exact PascalCase API paths; add typed frontend allocation methods before exposing allocation UI |
| Limousine bulk/single workflow | `/LimousineInvoice/create`, `/LimousineInvoice/view/:id` | `LimousineInvoiceController` / `ILimousineInvoiceService` | Redirect old `/Invoice/limousine-bulk/*` and `/Invoice/limousine-single/*` links only after agreeing that single is the same candidate workflow; the current backend enum does not define `LimousineSingle` |
| Equipment rental | `/EquipmentRentalInvoice/create|view|edit/:id` | `EquipmentRentalInvoiceController` | Redirect old `/Invoice/equipment-rental/*` links |
| Transportation | `/TransportationInvoice/create|view|edit/:id` | `TransportationInvoiceController` | Redirect old `/Invoice/transportation/*` links |
| Miscellaneous | `/MiscellaneousInvoice/create|details/:id` | `MiscellaneousInvoiceController` | Redirect old `/Invoice/misc/*` links |
| Salik / Darb / fines | Their existing fleet/import/traffic-fine routes | Their own controllers/services | Do not expose them as invoice-generation choices until a source-supported invoice command and route exist |

## Recommended build shape

1. Keep a thin `InvoiceFacade` screen at `/Invoice` for the core list and a menu of canonical feature routes. It should not pretend to be an aggregate list for unrelated invoice tables.
2. Keep one typed Angular service per backend boundary. Shared list/query/error helpers may be reused, but endpoint methods and DTOs remain feature-owned.
3. Replace the legacy core rental/lease editor with a typed generation adapter around `GenerateInvoiceRequest[]`. The adapter must collect the fields the backend actually requires (`FromDate`, `ToDate`, `StartDate`, `CustomerId`, `AgreementNo`, `Amount`, `InvoiceType`, and the applicable merge/type values). No client-calculated tax/total should be sent as authority.
4. Keep the existing tax-advance component as a separate stateful workflow. Add typed `allocate` and `allocationDetails` methods only when the allocation UI is in scope.
5. Add compatibility redirects for old Angular paths, but do not add compatibility components that keep sending the obsolete payloads.
6. If the product requires one combined invoice list, add a deliberate backend read contract (for example `InvoiceOverview`) that unions the specialised list projections with a `sourceType` and `sourceId`. Do not assemble it by making the browser call five lists and guessing the detail route.

## Blocking decisions

| Decision | Status | Why it matters |
|---|---|---|
| `/Invoice` is core-only facade versus one combined all-invoice list | Missing | The current API supports only the core `InvoiceBase` list; the two choices require different frontend and backend contracts |
| Meaning of `LimousineSingle` | Conflicting | Angular and TripBooking still emit the value, while backend `InvoiceCreatingType` supports only `LimousineBulk` and the dedicated workflow generates bulk candidates |
| Whether Salik/Darb/fines are invoice commands or upstream processing screens | Uncertain | Existing source shows import/settings/traffic-fine routes, but no matching `/Invoice` generation endpoint |
| Replacement scope for rental/lease legacy editor | Missing | Current form does not collect the full `GenerateInvoiceRequest` required by the backend |

## Conformance decisions

| Concern | Canonical owner | Target |
|---|---|---|
| List/grid | `SIGMA_UI_PATTERNS.md` list/grid blocks; `EquipmentRentalInvoice` and `LimousineInvoice` typed data tables | Specialised modules conform; core `Invoice` list is legacy and should be migrated |
| Detail/write | `SIGMA_UI_PATTERNS.md` editor/form blocks; `LimousineInvoice` details workflow | Tax advance and specialised modules mostly conform; rental/lease legacy editor does not |
| Routes | `PHASE-05-integration-runtime.md`; mode-based route patterns in `LimousineInvoice` | Dedicated modules conform; `/Invoice` type map currently drifts |
| API contracts | `SIGMA_BACKEND_PATTERNS.md` service/controller and DTO blocks | Backend ownership is split correctly; frontend must follow it |
| Error/loading states | shared `StateMessage`, `apiErrorMessage`, inline error channel | Modern specialised modules conform; legacy core screens omit an error callback |

## Verification boundary

Only source inspection and route/service cross-checks were performed. Builds, tests, lint, browser verification, runtime calls, database commands, migrations, commits, and pushes were not run, per project instructions.

## Owner handoff

Before source implementation, choose one of these two paths:

- **Recommended:** `/Invoice` remains the core facade and each specialised type keeps its own module/route. Add redirects and replace the legacy core editor with typed generation forms.
- **Alternative:** approve a new backend aggregated read contract and define the unified list/detail source model before changing Angular routes.

