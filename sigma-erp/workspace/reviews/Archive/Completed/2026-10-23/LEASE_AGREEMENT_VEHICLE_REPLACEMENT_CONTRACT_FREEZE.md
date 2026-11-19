# Lease Agreement Vehicle Replacement — Feature Review and Contract Freeze

Date: 2026-08-23  
Status: Frozen and implemented — source-only reconciliation complete  
Scope: Lease Agreement row action, Vehicle Replacement dialog, replacement
history, Delivery/Collection movements, agreement vehicle ownership, and vehicle
status side effects.

## Authority and packet status

- Canonical authority: `SIGMA_FEATURE_REVIEW_MASTER.md`; UI action/editor,
  dropdown, date, validation, loading/error, translation, appearance,
  accessibility, RTL/theme, and cancellation blocks; backend entity/EF/DTO,
  validation, master-detail, domain-action, and transaction blocks.
- Selected UI shape: a Lease Agreement row action opening the canonical shared
  `app-editor-dialog` shell. The incoming and outgoing vehicle areas are logical
  sections in one typed form, not screenshot-copied layout and not separate
  routes.
- Selected backend shape: an explicit serializable domain command over the
  tracked Lease Agreement aggregate, creating operational movement/status
  history and saving once through the scoped `DbContext`. A dedicated
  replacement-history child preserves the screenshot-demonstrated inputs and
  historical vehicle identity.
- `Generate-SigmaRecipes.ps1 -Check` reports generated packets 00–06 as stale.
  Canonical sources own the review; generated packets require regeneration and
  semantic review.
- `Replace Vehicle.PNG` is functional/content evidence only.

## Feature Review Manifest

| Item | Decision/evidence |
|---|---|
| Requested outcome | Add a Replace Vehicle action and the attached workflow to Lease Agreement. |
| Frontend scope | `src/app/modules/Lease/LeaseAgreement/` plus English/Arabic feature translations and the existing explicit Angular compilation file only if a new standalone component requires it. |
| Backend scope | Lease Agreement service/interface/controller; replacement DTO/entity/configuration if approved; Delivery/Collection Movement and Vehicle Status consumers directly affected by the transition. |
| Existing working-tree changes | Deposit, Receipt, Documents, Discounts, and related Lease Agreement changes are already present and are preserved as user/previous-task work. |
| Evidence | `C:\Users\user\Desktop\Replace Vehicle.PNG`; current Lease Agreement, Vehicle, Delivery Movement, Collection Movement, Replacement Reason, and Vehicle Status source. |
| Routes/modes | Existing Lease Agreement list route only; create-only modal action. |
| Authentication/authorization | Existing authenticated application behavior; no authorization API exists and none will be invented. |
| Explicit exclusions | No list/grid redesign, no migration generation or execution, no browser/runtime verification, and no unrelated movement refactor. |

## Functional evidence table

| Evidence | Classification | Required behavior | Owning phase | Guide-compliant representation |
|---|---|---|---|---|
| Vehicle Replacement title and Agreement No | Explicit | Open from one Lease Agreement and display its server-loaded number read-only. | 3/5 | Parent-context create dialog. |
| Is Replacement for Service | Explicit field; owner-approved transition | Typed boolean control. A returned service vehicle moves to `PendingWorkshopDelivery`. | 1/4 | Persist the flag and append the approved status. |
| Incoming Vehicle section | Explicit | Display current vehicle and its outgoing snapshot; collect return date/time, fuel, mileage, and branch. | 1/3 | Server context plus typed editable return controls. |
| Outgoing Vehicle section | Explicit | Select another vehicle and capture delivery date/time, fuel, mileage, branch, and Permanent Vehicle. | 1/3/4 | Server-filtered lookup and typed controls. |
| Is Replacement For Collection | Explicit field; owner-approved transition | Typed boolean control identifying collection of an earlier temporary replacement; when selected, reveal the screenshot-demonstrated Country and Address fields. The return is still recorded as a Collection Movement. | 1/3/4 | Persist the flag and optional collection location on replacement history. |
| Reason | Explicit | Select an existing active Replacement Reason. | 1/3 | ReplacementReason lookup; server validates the FK. |
| Notes | Explicit | Optional bounded text. | 1/3 | Typed optional control and normalized server value. |
| Cancel / Save | Explicit | Cancel follows dirty-discard behavior; Save is guarded against duplicate submission and preserves safe server errors. | 3/4/5 | Canonical editor lifecycle. |
| Vehicle eligibility and status transitions | Derived and owner-approved | Only active, unassigned vehicles with latest status Available, ReadyToGo, or legacy-unset are selectable. | 1/4 | Backend repeats eligibility and appends both status rows. |

## Confirmed current-source facts

- `LeaseAgreement.VehicleId` is the only current vehicle assignment and
  `LeaseAgreement.PermanentVehicle` is current agreement state.
- `CollectionMovement` can preserve the returned vehicle, return date/time,
  fuel, mileage, branch-in, and notes.
- `DeliveryMovement` can preserve delivery date/time, fuel, mileage, branch-out,
  agreement, customer, and `ReplacementDelivery` type, but it currently derives
  vehicle identity through the agreement. Updating `Agreement.VehicleId` would
  therefore rewrite the apparent vehicle for older delivery history unless a
  historical vehicle link is added.
- `VehicleStatus` is append-only history. The source exposes statuses including
  `Available`, `ReadyToGo`, `PendingWorkshopDelivery`, `Hired`, `Rented`, and
  `Replacement`, but no source rule maps this replacement workflow to them.
- `ReplacementReason` exists as an independent lookup only. No current entity
  persists a replacement reason or either screenshot checkbox.
- One tracked graph/save persists the replacement record, collection movement,
  delivery movement, agreement and vehicle mutations, and status rows. A
  serializable explicit transaction is required around the validation reads and
  the one save because two concurrent requests could otherwise select the same
  outgoing vehicle or both pass the stale-current-vehicle guard.

## Frozen detail/write contract

| UI field | Angular type | Request field | Server ownership/validation | Status |
|---|---|---|---|---|
| Agreement No | read-only string | — | Loaded by route id; never trusted from client. | Confirmed |
| Incoming Vehicle | read-only option | — | Loaded from current tracked agreement. | Confirmed |
| Incoming Date/Fuel/Mileage/Branch Out | read-only snapshot | — | Latest replacement outgoing snapshot for the current vehicle, otherwise the agreement/vehicle opening snapshot. | Derived |
| Date Time In | `FormControl<Date|null>` | `incomingDateTimeIn` | Required real date, not earlier than the incoming vehicle's prior Date Time Out. | Confirmed |
| Fuel Level In | `FormControl<number|null>` | `incomingFuelLevelIn` | Required defined `FuelLevel`. | Confirmed |
| Mileage In | `FormControl<number|null>` | `incomingMileageIn` | Required non-negative and not below Mileage Out. | Confirmed |
| Branch In | `FormControl<number|null>` | `incomingBranchInId` | Required active Branch. | Confirmed |
| Outgoing Vehicle | `FormControl<number|null>` | `outgoingVehicleId` | Required active, different, not assigned to another open agreement; latest status Available, ReadyToGo, or absent. Its option includes current branch, mileage, and latest fuel snapshot from Workshop, Collection, or Delivery movement history. | Confirmed |
| Outgoing Date/Fuel/Mileage/Branch | typed controls | `outgoingDateTimeOut`, `outgoingFuelLevelOut`, `outgoingMileageOut`, `outgoingBranchOutId` | Required; selecting the outgoing vehicle pre-fills branch, mileage, and latest known fuel level. Date is not earlier than incoming Date Time In, mileage is non-negative and not below the vehicle's recorded mileage, Branch is active. Missing fuel history remains a required manual selection. | Confirmed |
| Permanent Vehicle | `FormControl<boolean>` | `permanentVehicle` | Outgoing vehicle always becomes `LeaseAgreement.VehicleId`; flag becomes agreement current state. | Confirmed |
| Replacement for Service | `FormControl<boolean>` | `isReplacementForService` | Persisted; incoming status is `PendingWorkshopDelivery`, otherwise `Available`. | Confirmed |
| Replacement for Collection | `FormControl<boolean>` | `isReplacementForCollection` | Persisted as replacement history classification; collection movement is always created. Controls conditional collection location visibility and clears hidden values when false. | Confirmed |
| Collection Country | `FormControl<number|null>` | `collectionCountryId` | Visible only for collection replacement; optional because the screenshot does not prove required state. When supplied, backend requires an existing active Country. | Confirmed reviewer inference |
| Collection Address | `FormControl<string>` | `collectionAddress` | Visible only for collection replacement; optional, trimmed, maximum 250 characters, and cleared when the controlling flag is false. | Confirmed reviewer inference |
| Reason | `FormControl<number|null>` | `replacementReasonId` | Required active Replacement Reason. | Confirmed |
| Notes | `FormControl<string>` | `notes` | Trimmed, optional, maximum 1000. | Derived |

## Frozen action-state contract

| Action | Source state | Target state | List flag | Endpoint | Failure/refresh | Status |
|---|---|---|---|---|---|---|
| Replace Vehicle | Open, non-invoiced Lease Agreement with a current vehicle; eligible outgoing vehicle as above | Agreement points to outgoing vehicle and synchronizes model, fuel, mileage, branch and permanent state; incoming vehicle synchronizes return branch/mileage and status (`PendingWorkshopDelivery` for service, otherwise `Available`); outgoing vehicle synchronizes departure branch/mileage and status (`Hired` when permanent, otherwise `Replacement`); Collection and Replacement Delivery movements plus audit history are added | `CanReplaceVehicle = !IsClosed && !Invoiced && VehicleId.HasValue` | `POST LeaseAgreement/{id}/vehicle-replacements` with client-editable replacement inputs only; `GET LeaseAgreement/{id}/vehicle-replacement-context` | Preserve modal on failure; close and refresh current page on success | Frozen |

The backend reloads and revalidates every source-state predicate at Save. A
ListVM flag is presentation state only. Duplicate/stale Save is rejected by
including the server-loaded incoming vehicle id in the request and requiring it
to still equal the agreement's tracked current vehicle. All new entities and
status/movement rows are added to one tracked graph and persisted with one
`SaveChangesAsync` inside a serializable transaction that covers all source-state
reads. The latest applicable legacy Delivery Movement is assigned the incoming
vehicle before the mutable agreement vehicle changes; every new replacement
delivery stores its own vehicle id.

The owner approved conservative senior rental-domain decisions and requested
simulation of the supplied Speed Auto workflow. The external application is
functional evidence only; workspace policy prohibits automated login/runtime
verification. Credentials are not persisted in source or artifacts.

## Final reconciliation

| Phase | Result |
|---|---|
| 0 — discovery/evidence | Complete. Screenshot content classified; current frontend/backend source and direct movement/status consumers traced. |
| 1 — domain/API freeze | Complete. Context/read contract, write DTO, transition rules, historical identity, and concurrency boundary frozen. |
| 2 — read/list | Complete only for the action-state addition. Existing grid columns are unchanged; ListVM adds only `CanReplaceVehicle` for the row action. |
| 3 — detail/write | Complete. Typed create-only editor, server context, lookups, validation, loading/error/empty/dirty states, translations, RTL/theme/responsive styling implemented. |
| 4 — domain action | Complete. Backend revalidation, replacement history, movements, vehicle/agreement synchronization, status transitions, stale guard, and serializable atomic save implemented. |
| 5 — integration/runtime | Source wiring complete: list action, modal, service routes, controller routes, DI through existing services, and explicit Angular compilation entry. Runtime verification remains owner-owned. |
| 6 — final reconciliation | Complete by scoped source and Git diff review in both repositories. No unresolved Missing, Conflicting, or Uncertain requirement remains. |

The persistence changes require an owner-generated migration for
`LeaseAgreementVehicleReplacement` and nullable `DeliveryMovement.VehicleId`
plus its foreign key/index. Generated recipe packets 00–06 remain stale and
must be regenerated and semantically reviewed by their owner.

## Verification boundary

Implementation and source-only reconciliation were performed. Build, tests,
lint, browser/runtime verification, database commands, migrations, commit/push,
and deployment were not run. The supplied external credentials were not used,
stored, or written to source or artifacts.
