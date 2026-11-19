# Limousine backend continuation audit

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | Source-only backend/API audit against the frozen Limousine handoffs |
| Repository | `F:\My Work\Sigma\SigmaBackend` |
| Recipe check | Initial `Generate-SigmaRecipes.ps1 -Check`: all 8 checks passed |
| Build/tests/runtime/database | Not run by instruction |

## Authority and bounded scope

This fragment applies the frozen masters, quotation, trips, partial-invoice,
grid-customization, reports and continuation contracts under
`F:\My Work\Sigma\reviews`, plus the canonical backend blocks BE3–BE9 and
BE14–BE18 and the Sigma screen-refactor skill. The source audit covered the
named Limousine services, controllers, view models, profiles, partial-invoice
balance/pricing owner, and the limousine branch in `InvoiceService`. It did not
scan unrelated subsystems and made no source edits.

## Producer/consumer conformance

| Area | Source evidence | Result |
|---|---|---|
| Location | `LocationController` inherits the generic controller and retains `SearchPlaces` with `searchKey`, optional `lat`/`lng` (`SiGma.ServerAPI/Controller/LocationController.cs:9-21`). `LocationListVM` is `id`, `searchGoogleLocations`, `shortName`, `detail`; `LocationDetailVM` adds server-derived coordinates (`SiGma.ViewModels/ViewModels/Location/LocationListVm.cs:3-9`, `LocationDetailVm.cs:5-11`). | Matches frozen lean list/detail shape. `LocationService` keeps the Google/Photon search boundary and derives coordinates from `Detail` on writes (`SiGma.Business/Services/LimousinesServices/LocationService.cs:23-85,88-148`). |
| TripType and tariff settings | Generic list/controller plus explicit `GET/PUT {tripTypeId}/TariffSettings` (`SiGma.ServerAPI/Controller/TripTypeController.cs:7-28`). Service rejects route/body mismatch and serializes only defined rate types (`SiGma.Business/Services/LimousinesServices/TripTypeService.cs:96-157`). | Matches route/body identity and settings ownership. List/detail VMs are lean id/name (`SiGma.ViewModels/ViewModels/TripType/TripTypeListVm.cs:3-6`, `TripTypeDetailVm.cs:5-8`). |
| LimousineTariff | `GetTariffs` and `EditList` use the complete scoped editor; `SaveEditorAsync` validates category/customer scope, enum/type combinations, nonnegative rate, active references, duplicates, full snapshot reconciliation and one save (`SiGma.ServerAPI/Controller/LimousineTariffController.cs:17-42`; `SiGma.Business/Services/LimousinesServices/LimousineTariffService.cs:125-224,450-545`). | Matches settings/collection contract. Report route is a separate complete response and retains Base/Corporate scope checks. |
| LimoQuotation | `ApplyListFilters` applies quotation number/customer/date and both approval filters before generic materialization (`SiGma.Business/Services/LimousinesServices/LimoQuotationService.cs:21-67`). Add/update resolve tax through `ITaxPolicyService`, preserve pending-only writes, and keep status server-owned (`.../LimoQuotationService.cs:83-167`). | Matches frozen filters, lean ListVM and server calculation/state ownership. |
| TripBooking list/detail/actions | List mapping exposes the frozen grid fields and workflow identity fields (`SiGma.Business/MapperConfig/TripBookingProfiler.cs:23-34`). Detail/list billing is refreshed from the shared billing owner (`TripBookingService.cs:42-75`); update/finish/cancel/delete use the limousine lock and billed-balance guards (`TripBookingService.cs:78-90,124-183,398-450,483-518,668-683`). | Partial-invoice amendment is represented in producer and consumer paths. `Invoiced` is derived from live sums for list, detail and filters (`TripBookingService.cs:46-53,67-75,1121-1129`). |
| LimousineInvoice list/detail/candidates | Generic list filters use trip/customer/pickup calendar bounds (`SiGma.Business/Services/VouchersServices/LimousineInvoiceService.cs:21-42`). Candidate projection returns source charge/tax/discount plus `BilledAmount` and computed `RemainingAmount`, retaining positive remaining rows (`.../LimousineInvoiceService.cs:59-97`). | Matches frozen complete candidate response and lean saved invoice detail. External driver labels are a documented live-trip fallback (`.../LimousineInvoiceService.cs:45-56`). |
| Partial invoice generation and writer | `GenerateAsync` rejects empty/duplicate/nonpositive ids, rereads trips under `ExecuteUniqueWriteAsync<LimousineInvoice>`, sends only trip id and requested gross to `InvoiceService` (`.../LimousineInvoiceService.cs:99-122`). `LimousineBillingService.PriceAsync` enforces positive remaining, currency scale, customer/driver references and source trip tax allocation (`SiGma.Business/Services/LimousinesServices/LimousineBillingService.cs:23-78`). `InvoiceService` prices the limousine branch and calls `SetTaxExplicit`, while its existing journal/transaction path remains in use (`SiGma.Business/Services/VouchersServices/InvoiceService.cs:1579-1600,361-410`). | Matches approved partial-invoice cap/tax/pricing/journal ownership. Generic limousine generation, update and remove are lock-participating (`InvoiceService.cs:36-45,183-205,584-656`; `LimousineInvoiceService.cs:124-186`). |
| TripGridCustomization | Controller/service deliberately use generic CRUD (`SiGma.ServerAPI/Controller/TripGridCustomizationController.cs:6-12`; `SiGma.Business/Services/TripGridCustomizationService.cs:5-12`). The write VMs expose a raw enum and bool (`SiGma.ViewModels/ViewModels/TripGridCustomization/TripGridCustomizationAddVm.cs:6-10`, `TripGridCustomizationUpdateVm.cs:6-10`). | **Confirmed defect LIMO-BE-01** below. |
| Reports | Controllers preserve the three frozen report routes (`TripBookingController.cs:24-40`, `LimousineTariffController.cs:44-53`); report services keep complete result rows and server-side report calculations. | No backend contract drift found in the bounded report producers. |

## Confirmed defect

### LIMO-BE-01 — TripGridCustomization accepts undefined enum values

**Status:** Confirmed source defect; root decision/repair pending.

The frozen grid-customization contract requires required enum and range-boundary
validation for `TripGridColumn` values 0–7. `TripGridCustomizationService` has
no Add/Update overrides and delegates to the generic service
(`SiGma.Business/Services/TripGridCustomizationService.cs:5-12`). The generic
`Service` only runs declared string uniqueness and EF-model foreign-key checks
before mapping (`SiGma.Business/Services/Bases/Service.cs:38-50,95-123,245-260`);
it does not validate enum values. Both Add and Update VMs declare an ordinary
`TripGridColumn` property without `[EnumDataType]`
(`SiGma.ViewModels/ViewModels/TripGridCustomization/TripGridCustomizationAddVm.cs:9`,
`TripGridCustomizationUpdateVm.cs:9`). The enum currently has members 0 through
7 (`SiGma.Helpers/Enum/TripGridColumn.cs:3-13`), and its EF configuration only
maps the table (`SiGma.DataAccess/Configuration/TripGridCustomizationConfig.cs:3-8`).

Because System.Text.Json accepts undefined numeric enum values, a caller can
submit a value outside 0–7 and the generic mapper/service can persist it. This
violates the frozen server-owned validation boundary and leaves the frontend's
translated enum option set without a valid producer guarantee.

**Repair recommendation:** add `[EnumDataType(typeof(TripGridColumn))]` to the
Add/Update enum properties so normal API model validation rejects undefined
numbers, and add a feature-service guard if this endpoint can be called
through a boundary that bypasses model validation. Return the existing
localized business-failure path; do not invent a unique-column rule or a grid
preference consumer. No schema migration is indicated by this validation-only
repair.

## Freeze facts versus uncertainty

The following remain frozen facts supported by current source: limousine
invoice gross is a request; customer, driver, trip amounts and tax are reread
from the live same-tenant trip; `LimousineBillingService` owns cap and tax
allocation; the generic `InvoiceService` owns journal construction and the
multi-save transaction; trip billed state is field-refreshed from live invoice
sums; tariff edits are full-snapshot scoped settings; and the reports return
complete server datasets.

Runtime lock races, journal posting, tenant filtering under the actual database,
model binding, and compilation remain owner verification items because builds,
tests, database commands and runtime execution were prohibited. The source
does not establish a live driver-tracking feed, a grid-preference consumer, a
deposit/advance settlement flow, or a new permission contract; those remain
outside this audit as required by the continuation freeze. Existing trip status
eligibility is preserved as a source contract; this audit does not invent a
Finished-only invoice rule.

## Repository/source evidence

The backend repository contains unrelated in-progress changes (primarily Sales
Agreement and migration files); no Limousine backend file in the bounded scope
was changed by this audit. The frontend repository is also dirty with parallel
Limousine and shared changes; no frontend file was changed here. No build, test,
lint, browser/app verification, database, migration, Graphify, SigmaMCP,
commit, push or deployment command was run.


