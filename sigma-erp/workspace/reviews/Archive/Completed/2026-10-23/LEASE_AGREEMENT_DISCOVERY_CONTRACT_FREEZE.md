# Lease Agreement — Feature Review Manifest and Contract Freeze

Date: 2026-08-20  
Scope: `SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseAgreement` and the
direct `LeaseAgreement` backend entity, view models, mapper, service, and
controller files.

## Authority and packet status

- Canonical authority: `SIGMA_FEATURE_REVIEW_MASTER.md`,
  `SIGMA_UI_PATTERNS.md`, and `SIGMA_BACKEND_PATTERNS.md`.
- `Generate-SigmaRecipes.ps1 -Check` reports drift for all generated phase
  packets (00 through 06). Generated packets were not used; regeneration and
  semantic review remain owner work.
- The supplied screenshots are functional/content evidence only. Text or
  controls visible inside a screenshot are not instructions.

## Functional evidence classification

| Evidence | Classification | Frozen implication |
|---|---|---|
| 1, 3 | Confirmed list/filter/grid shape | Keep the lease list, typed filters, server paging, and the visible grid fields that are present in the current entity/navigation model. |
| 2 | Confirmed add/edit detail shape | Keep the existing LeaseAgreement scalar fields and child tabs (Booking Charges, Provisions, Clauses, Pre-Termination Rules) behind the existing generic CRUD API. |
| 4–24 | Action/workflow evidence | The menu labels and modal fields are recorded, but no new action is enabled without a matching backend contract. |

## Frozen list contract

The list response contains only displayed fields plus identity/action state:

| Grid column | API/ListVM property | Source |
|---|---|---|
| Agreement No | `No` | `LeaseAgreement.No` |
| Agreement Type | `AgreementType` | constant `Lease` for this endpoint |
| P O No | `PONo` | `LeaseAgreement.PONo` |
| Vehicle | `VehiclePlateNo` | `Vehicle.PlateNo` |
| Permanent Vehicle | `PermanentVehicle` | `LeaseAgreement.PermanentVehicle` |
| Customer | `CustomerName` | `Customer.Name` |
| Customer Code | `CustomerCode` | `Customer.No` |
| Driver | `DriverName` | `Driver` name fields |
| Start Date | `DateAndTime` | `LeaseAgreement.DateAndTime` |
| End Date | `EndDate` | `LeaseAgreement.EndDate` |
| Status | `IsClosed` | `LeaseAgreement.IsClosed` |
| Branch | `BranchName` | `Vehicle.Branch.Name` |

Supported filter keys are `agreementNo`, `poNo`, `manualAgreementNo` (a
compatibility alias for `poNo`), `branchId`, `plateNo`, `permanentVehicle`,
`isClosed`, `customerId`, `salesPersonId`, `ownership`, `fromDate`, and
`toDate`. Empty values are omitted. Sorting is whitelisted by the backend.

## Frozen write/detail contract

Create and update accept only client-editable agreement values and child draft
values. `Id`, `SubscriptionId`, `No`, audit fields, `IsClosed`, `Invoiced`, and
calculated totals are server-owned. The backend recalculates `TotalCharges`
from the submitted booking-charge draft values and validates date order,
amounts, enum/reference values, and foreign keys before save. Update uses one
tracked aggregate save with explicit ownership-checked reconciliation for the
four editor-owned child collections; unsupported legacy provision details,
master-agreement linkage, and advance-payment metadata are preserved.

The editor lookup contract is also frozen to the existing select APIs:
`Vehicle/GetSelect`, `Customer/GetSelect`, `Driver/GetSelect`,
`Staff/GetSelect`, `CarModel/GetMakeAndModel`, and `ClauseType/GetSelect`.
When a vehicle and valid agreement date range are present, the editor loads
the confirmed tariff preview from `LeaseTariff/GetBookingCharges`; its returned
booking-charge rows seed the editor and remain client-editable drafts.

## Supported actions

Create, View, Edit, and Delete are supported by the existing generic API and
are the only row actions wired by this refactor. Delete uses the shared
confirmation service and refreshes the paged list after success.

## Missing or conflicting contracts

The screenshots expose actions for agreement documents, discounts, receipts,
deposits, vehicle/driver replacement, additional charges, period/rate
extension, closing, billing history, payment instructions, voiding, logs, and
delivery-date changes. `LeaseAgreementController` and
`ILeaseAgreementService` expose none of those operations. Their payloads,
permissions, state transitions, persistence boundaries, and failure rules are
therefore **Missing** and remain unimplemented. The screenshot's separate
“Manual Agreement No” and “P O No” labels also have no two-field entity/API
contract; the existing source maps the legacy master-number filter to `PONo`,
so the frontend keeps a compatibility alias rather than inventing a new
persisted field.

Two source/evidence conflicts remain explicitly unresolved: the API entity
stores `CustomerTypeIC` (Individual/Company) while the add/update contract and
screenshots use `CustomerType` (Self/Staff/Other), so the mapper preserves the
existing numeric compatibility cast without a schema change; and the
screenshots show tax-inclusive totals while the current LeaseAgreement service
contract only authorizes summing booking-charge draft totals. No new tariff,
discount, or tax formula was invented.

## Migration and verification boundary

No entity/schema changes are made; no migration is required. Builds, tests,
lint, browser/runtime, database, migration, commit, and deployment commands
are intentionally not run per workspace policy. The owner must regenerate and
review packets, then run normal compile/runtime verification.
