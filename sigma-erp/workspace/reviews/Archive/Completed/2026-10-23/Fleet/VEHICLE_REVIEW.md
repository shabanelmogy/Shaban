# Vehicle and tracker frontend review — 2026-10-04

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Scope | Fleet/Vehicle and Fleet/vehicle-tracker |
| Contract | ../FLEET_FRONTEND_CONTRACT_FREEZE.md |

## Before-edit evidence and decisions

| Concern | Book | Approved source / shared owner | Target finding and selected change |
|---|---|---|---|
| Bounded list | UI1/3/4/6 | Workshop/Job list; styles.scss, FilterPanel, DataTable | Vehicle local page/filter/grid styles and responsive overflow visible; use sigma-route-host/list shell/filter panel/fill; main six filters, remaining advanced |
| Aggregate editor | UI1/13 D4-2 | Workshop/Job editor; shared editor shell/tabs | Vehicle owns Documents and Warranties; convert the same create/view/edit component to a route, preserve details/:id compatibility and filter query state |
| Typed child collections | UI14/18/19 | EditableRows, FileField, DocumentUploadTracker; CustomerDocumentAddVM | Untyped FormGroup arrays and unobserved deleteFile subscriptions; typed rows, full snapshot, confirmed removal, post-save/discard cleanup with retry |
| Document validation | UI18/19; CustomerDocumentAddVM | Shared DocumentRow/createDocumentRow/documentPayload | Backend requires documentType/number/issue/expiry with expiry strictly after issue; use existing shared row factory, explicit PartnerDocumentType wire IDs |
| Dates | UI17 | DatePickerDirective/date-utils | Feature private apiDate/asDate and no masks; shared strict date validators, local API transport, single-date mask and range parser |
| Exports/print | UI8/21 | VehicleSearchVM PageSize=20; VehicleService.SearchAsync isUnpaged=request.PageSize is null | Existing undefined omitted PageSize defaults to20 and truncates; explicit null (empty pageSize query) produces the confirmed unpaged result; shared print session/grid formatting |
| Feedback/cancellation | UI22/28 | Job bindListQueries; apiErrorMessage/interceptor | Duplicate feature toast + interceptor, manual subscription/sequence; one switchMap trigger with defer/finalize, inline errors suppress interceptor |
| Enum transport | UI16 | Backend FleetType Rental=0/Replacement=1/Staff=2, Ownership Own=0/External=1/BuyBack=2; PartnerDocumentType | Legacy string enums numbered by position; explicit local wire enums for Fleet/Ownership, existing numeric enums for other choices |
| Tracker | UI1/16/22/24 | Shared shell/field/state tokens, LeafletMap | No location endpoint exists in current screen; preserve empty location/hint and map center, remove local palette/fixed viewport; no invented coordinates |

The Vehicle IsActive control remains because VehicleAddVM/VehicleUpdateVM explicitly declare it; it is a feature-editable field, unlike inherited server flags. FleetNo is a client-entered reference explicitly declared by both DTOs, so it remains. No migration, backend/mapping or calculation changes. No screenshots supplied.

### Tariff source reconciliation before implementation

TariffController.GetTariffByVehicleTypeIdAsync delegates to TariffService.GetTariffByVehicleTypeIdAsync: it selects Daily/type0, tariffCardId null and returns TariffDetailVM's rentalRates/protections/mileage/extras. TariffUpdateVM requires those same four collections, Type, VehicleTypeId, TariffCardId and IsInactive. The legacy Fleet dialog expects fullDay/cdwInsure/mileageOk and would submit incompatible data. Frozen correction: reuse the owning Rental/RentalTariff models (explicit rateType/tariffRentalType/protectionType), edit the selected existing tariff in a Fleet routed aggregate, preserve every row ID and enum value including Vacation, use no new tariff creation/selection or backend contract. Do not copy the owning Rental editor's modal layout. Exact producer: TariffService.UpdateAsync reconciles child IDs and rejects foreign IDs. Reviewer decision is source-supported transport correction, no formula or state transition change.

## Grid ↔ ListVM

Vehicle columns: plateNo, makeName, modelName, vehicleTypeName, color, status, branchName, kMs, fuel, nextRegistrationDate, nextInsuranceDate, fleetNo, engineCapacity, customField1. Same returned VehicleListVM fields; id, vehicleTypeId and hasTariff are required action metadata. Filters retain VehicleSearchVM top-level casing-insensitive members. Sort fields retain backend allowlist; UI allowlist is derived from sortable columns. Read-only report collection comes from the exact applied query with pageNo1/pageSize null.

## Integration and pending verification

FleetVehicle routes own create/view/edit; legacy details/:id remains a view alias. The list passes applied query parameters; close/save restores them. Services remain root and interceptor-equipped; inline request failures opt out explicitly. Authentication remains AuthGuard, no new permission API. Authorization candidates: Vehicle deletion and Tariff write through their existing endpoints.

Owner must verify compilation, create/edit/view/dirty exit, invalid/partial dates, delayed reads, export above20 rows, upload/failed save/cleanup retry, RTL/light/dark/narrow widths and full print. Source-only review does not establish runtime/visual acceptance.

## Root final reconciliation — 2026-10-04

| Item | Value |
|---|---|
| Implementation status | Implemented — source-only |
| Owner verification pending | yes |

The Frozen decisions above remain historical. Vehicle create/view/edit/details alias and new tariff route are integrated with dirty guards and return-query state. Corrected advancedControls/advancedOpen FilterPanel API, warranty period ID, insurance-date focus, lookup/failed-discard/Tariff-load form locks, and removed unconsumed legacy tariff models. VehicleCreateDTO/DetailDTO now use explicit local numeric wire enums. Vehicle output requests explicitly send null PageSize and export uses shared column formatting; separate output preparation/printing flags lock filters/actions through afterPrint. Vehicle create/update save is a required cleanup composite: skip-success header, response message retained, cleanup starts after saving/loading finalize; one final success after cleanup, no repeated mutation on Retry. Make/model create+lookup refresh preserve created ID for retry and own a single final success. Tracker keeps its honest absent-coordinates state and bounded map remainder. Independent read-only Vehicle audit findings were incorporated, including removing the export utility from Component.imports.

Full integration, source-only evidence, blocked producers and owner checks: [Fleet feature review](<../FLEET_FEATURE_REVIEW.md>). No backend/schema/calculation change or Add-Migration required; no build/test/browser acceptance claimed.

## Compiler diagnostic follow-up — 2026-10-04

User supplied TS2349 at VehicleTariffComponent.save: the selected row is a union of four typed FormGroups whose overloaded get signatures cannot be invoked together. Replaced row.get(key) with Object.entries<AbstractControl>(row.controls), retaining typed controls, first-invalid-field selection and shared focusField IDs. Added the AbstractControl import; no DTO, validator, row data or API change. Source syntax parsing reports no diagnostics; changed source was inspected and scoped whitespace review performed. No build/tests were run under the source-only boundary; owner compilation remains pending. No subagent needed for this single local fix.

Documentation conformance follow-up — 2026-10-08: refreshed recipe packets were checked before this pass and all PLAN-00/PHASE-00..06 checks returned OK. Fleet list filters now opt into the shared stable layout; simple catalog/tracker filters use the shared inline action placement; report filters use the stable report strip; all Fleet PrimeNG calendars explicitly preserve invalid typed input with `keepInvalid=true` and editable input with `readonlyInput=false`; VehicleQRLabel list transport now uses `DEFAULT_PAGE_SIZE`. The Sales guide Fleet topic was updated to describe the stable filter/More filters/Search/Reset workflow. No endpoint, DTO, persistence, calculation, permission or blocked-workflow assumption was introduced. Source-only validation and owner visual/build/runtime acceptance remain pending.
