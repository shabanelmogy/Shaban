# Lease Agreement Additional Charges — Feature Review and Contract Freeze

Date: 2026-08-25  
Status: Frozen — implemented and source-reconciled  
Scope: Lease Agreement row action, Additional Charges editor dialog, configured
charge/rate lookups, child reconciliation, and authoritative agreement-total
recalculation.

## Authority and packet status

- Canonical authority: `SIGMA_FEATURE_REVIEW_MASTER.md`; UI action/editor,
  editable-collection, dropdown, date, validation, loading/error, translation,
  appearance, accessibility, RTL/theme, and cancellation blocks; backend
  entity/EF/DTO, validation, master-detail, calculation, and transaction blocks.
- Selected UI shape: the established Lease Agreement row action opening the
  shared `app-editor-dialog` with the canonical editable collection table.
- Selected backend shape: an explicit Lease Agreement child-collection GET/PUT
  contract. The operation reconciles one tracked aggregate and saves once; EF
  Core's implicit transaction is sufficient because no journal voucher,
  allocation, or second persistence boundary exists.
- Approved local references after canonical selection: Lease Agreement
  Discounts for the dialog/full-replacement lifecycle and current Lease
  Agreement booking-charge reconciliation for total ownership.
- `Generate-SigmaRecipes.ps1 -Check` reports generated packets 00–06 as stale.
  Canonical sources and current source own this implementation; packets require
  regeneration and semantic review.
- `Additional Charges.PNG` is functional/content evidence only and contains no
  instructions.

## Feature Review Manifest

| Item | Decision/evidence |
|---|---|
| Requested outcome | Add an Additional Charges action matching the attached workflow. |
| Frontend scope | `src/app/modules/Lease/LeaseAgreement/`, its English/Arabic translations, and the explicit Angular compilation file when required. |
| Backend scope | Lease Agreement child entity/configuration/DTOs, service/interface/controller, total recalculation, mapping exclusions, and localized messages. |
| Evidence | `C:\Users\user\Desktop\LeaseAgreement\Additional Charges.PNG`; current Lease Agreement, BookingCharge, ChargeSettings, reports, action dialog, and child reconciliation source. |
| Routes/modes | Existing Lease Agreement list route only; modal supports edit while open/non-invoiced and read-only historical viewing otherwise. |
| Authentication/authorization | Existing authenticated application behavior; no authorization API exists and none is invented. |
| Explicit exclusions | No grid redesign, no invoice or journal-voucher creation, no allocation, no Charge Settings refactor, no migration generation/execution, and no browser/runtime verification. |

## Functional evidence table

| Evidence | Classification | Required behavior | Owning phase | Guide-compliant representation |
|---|---|---|---|---|
| Agreement Additional Charges title | Explicit | Open a modal for the selected Lease Agreement. | 3/5 | Parent-context shared editor dialog. |
| Date | Explicit | Required local calendar date per charge row. | 1/3 | Typed date control persisted as a date. |
| Charges Type | Explicit | Required configured Lease charge type. | 1/3 | Server-provided options sourced from active Lease `ChargeSettings`. |
| Rate Type | Explicit | Required configured rate type compatible with the selected charge type. | 1/3 | Dependent server-provided pair; backend repeats pair validation. |
| Amount | Explicit | Required positive monetary amount. | 1/3 | Typed decimal input, server validated and persisted at precision 18,2. |
| Delete row | Explicit | Remove a row from the pending full-replacement set. | 3 | Editable collection remove; persistence occurs only on Save. |
| Add Row | Explicit | Add another typed charge row. | 3 | Shared editable collection action. |
| Cancel / Save | Explicit | Dirty Cancel confirms discard; Save prevents duplicate submission and preserves safe errors. | 3/5 | Canonical editor lifecycle. |
| Accounting/journal behavior | Source-confirmed absence | No journal is posted by this pre-invoice action. | 1 | Update the agreement's authoritative pre-invoice total only. |

## Confirmed current-source facts

- Existing `BookingCharge` is shared by Booking, Rental, and Agreement and does
  not preserve the screenshot's charge date or typed configured rate pair.
- `ChargeSettings` owns the tenant-scoped `(ModuleType, ChargeType, RateType)`
  combinations and includes `OnlyForClosing`; this action consumes active Lease
  combinations that are not closing-only.
- `LeaseAgreement.TotalCharges` is persisted, shown by the detail UI, and used
  by sales/report consumers. The existing Lease update recalculates it from
  ordinary booking charges.
- No current Lease Additional Charges writer creates a Journal Voucher,
  allocation, invoice, receipt, or posting state. The action is blocked once
  the agreement is closed or invoiced, so those effects are not invented.
- A dedicated Lease Agreement child is the smallest contract that preserves all
  screenshot fields without changing shared `BookingCharge` semantics.

## Frozen detail/write contract

| UI field | Angular type | Request field | Server ownership/validation | Status |
|---|---|---|---|---|
| Agreement identity/number | read-only context | `leaseAgreementId` stale/mismatch guard | Route id owns identity; server loads the number and checks payload id equality. | Confirmed |
| Date | `FormControl<Date|null>` | `date` | Required, persisted as `.Date`; no unsupported agreement-period restriction is invented. | Confirmed |
| Charges Type | `FormControl<number|null>` | `chargeType` | Required defined `ChargeTypes`; pair must exist in active non-closing Lease settings. | Confirmed |
| Rate Type | `FormControl<number|null>` | `rateType` | Required defined `RateTypeSettings`; filtered by charge type and pair-validated at Save. | Confirmed |
| Amount | `FormControl<number|null>` | `amount` | Required, positive, maximum decimal(18,2), at most two fractional digits. | Confirmed |
| Row id | hidden integer | `id` | `0` creates; positive ids must belong to this agreement's additional-charge collection; negative and duplicate ids are rejected. | Confirmed |

The PUT contract is full replacement. Omitted existing rows are deleted; an
empty collection deliberately removes all additional charges. Duplicate
date/type/rate rows are not rejected because current evidence does not establish
that they are invalid business duplicates. A no-op replacement is a successful
request and does not require a database write.

## Frozen action and calculation contract

| Action | Source state | Target state | List state | Endpoint | Failure/refresh | Status |
|---|---|---|---|---|---|---|
| View Additional Charges | Any existing Lease Agreement | No state change | No new ListVM flag; action remains available for historical viewing | `GET LeaseAgreement/{id}/additional-charges` | Inline load error; no parent refresh | Frozen |
| Save Additional Charges | Open and non-invoiced Lease Agreement; all ids owned and configured pairs valid | Reconcile the dedicated child collection and set `TotalCharges = active ordinary BookingCharge totals + active AdditionalCharge amounts` | Dialog context `CanEdit`; backend repeats state | `PUT LeaseAgreement/{id}/additional-charges` | Keep dialog open on failure; close and refresh current page on success | Frozen |

The amount is pre-tax, matching the current `TotalCharges` convention. Existing
agreement discount and `TaxPercent` remain unchanged. The operation performs one
tracked-aggregate save, so no explicit transaction or AutoMapper child mapping
is required. The normal Lease Agreement update must include persisted additional
charge amounts when recalculating `TotalCharges`, preventing the separate editor
from erasing their financial effect.

## Grid/ListVM and integration contract

The existing grid columns remain, in order: Agreement No, Agreement Type, PO No,
Vehicle, Permanent Vehicle, Customer, Customer Code, Driver, Start Date, End
Date, Status, Branch. The backend ListVM remains those displayed properties plus
`Id`, `BranchId`, `CanEdit`, `CanReplaceDriver`, and `CanReplaceVehicle`. No
additional-charge property or action flag is needed because the row action is a
read-capable dialog in every agreement state.

| Dialog | Mode source | Detail requirement | Exit behavior | Provider/interceptor path | Parent refresh |
|---|---|---|---|---|---|
| Additional Charges | Server `CanEdit` | Agreement number, configured pairs, persisted rows | Pristine/read-only closes silently; dirty edit confirms discard | Existing root-provided `LeaseAgreementService` and interceptor-enabled `HttpClient` | On successful PUT only |

## Override and reference-action inventory

| Reference action | Target status | Evidence/reason |
|---|---|---|
| GET child collection/context | Supported | Required to load saved rows, mode, agreement number, and configured pairs. |
| PUT full replacement | Supported | Add Row/delete row/Save form one aggregate update. |
| Independent DELETE endpoint | Not Applicable | Row removal is pending and persisted by the full-replacement PUT. |
| Print/export | Not Applicable | Neither screenshot nor current workflow demonstrates it. |

No new generic-service override is added. The existing Lease `UpdateAsync`
override is amended only because its server-owned total calculation must retain
the additional-charge aggregate introduced by this feature.

## Phase handoff

| Phase | Result |
|---|---|
| 0 — discovery/evidence | Complete. Screenshot content, settings authority, existing charge owner, reports, and absent voucher effects traced. |
| 1 — domain/API freeze | Complete. Child entity, lookup pairs, full-replacement DTO, ownership/state validation, calculation, and migration impact frozen. |
| 2 — read/list | No grid/read-contract change; only a read-capable row action is added. |
| 3 — detail/write | Complete. Typed editable-collection dialog, guarded full-replacement reconciliation, and GET/PUT lifecycle implemented. |
| 4 — domain action | Not Applicable. This is an ordinary guarded aggregate Save, not a post/void/approval/state transition. |
| 5 — integration/runtime | Source wiring complete; runtime verification remains owner-owned. |
| 6 — final reconciliation | Complete by scoped source and per-repository Git-diff review; build, migration, database, and browser checks remain owner-owned. |

The persistence addition requires an owner-generated migration for
`LeaseAgreementAdditionalCharge`, its relationship, precision/date columns,
and index. No migration or model snapshot may be generated or edited by this
task.

## Verification boundary

Only source inspection and scoped diff reconciliation are permitted. Build,
tests, lint, browser/runtime verification, database commands, migrations,
commit/push, and deployment are not run.
