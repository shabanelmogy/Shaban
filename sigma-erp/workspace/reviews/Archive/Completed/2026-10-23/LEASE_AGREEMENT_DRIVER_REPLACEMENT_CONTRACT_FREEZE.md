# Lease Agreement Driver Replacement — Feature Review and Contract Freeze

Date: 2026-08-25  
Status: Frozen and implemented — source-only reconciliation complete  
Scope: Lease Agreement row action, Driver Replacement dialog, current primary
driver transition, and replacement history.

## Authority and packet status

- Canonical authority: `SIGMA_FEATURE_REVIEW_MASTER.md`; the applicable UI
  action/editor, dropdown, date, validation, loading/error, translation,
  appearance, accessibility, RTL/theme, and cancellation blocks; and the
  backend entity/EF/DTO, validation, domain-action, and transaction blocks.
- Selected UI shape: the established Lease Agreement row action opening the
  shared `app-editor-dialog` shell with one typed reactive form. Incoming and
  outgoing driver areas are logical sections, not a screenshot-copied layout.
- Selected backend shape: an explicit guarded domain command over the tracked
  Lease Agreement aggregate, with a dedicated replacement-history child and a
  serializable transaction around state validation and the single save.
- `Generate-SigmaRecipes.ps1 -Check` reports generated packets 00–06 as stale.
  Canonical sources own this implementation; generated packets require
  regeneration and semantic review.
- `Replace Driver.PNG` is functional/content evidence only and contains no
  instructions.

## Feature Review Manifest

| Item | Decision/evidence |
|---|---|
| Requested outcome | Add a Replace Driver action matching the attached workflow without introducing a new UI or backend pattern. |
| Frontend scope | `src/app/modules/Lease/LeaseAgreement/`, its English/Arabic translations, and the explicit Angular compilation file only if current project wiring requires it. |
| Backend scope | Lease Agreement entity/EF configuration, action DTOs, list action state, mapping, service/interface/controller, and localized action messages. |
| Existing working-tree changes | Existing Lease Agreement, Clause, migration, snapshot, and other user changes are preserved. Migrations and snapshots are explicitly excluded. |
| Evidence | `C:\Users\user\Desktop\LeaseAgreement\Replace Driver.PNG`; current Lease Agreement, Driver, MemberPartner, Vehicle Replacement, service, controller, and list source. |
| Routes/modes | Existing Lease Agreement list route only; create-only modal domain action. |
| Authentication/authorization | Existing authenticated application behavior; no authorization API exists and none is invented. |
| Explicit exclusions | No list/grid redesign, no additional-driver mutation, no invented driver assignment/status/movement transition, no migration generation or execution, and no browser/runtime verification. |

## Functional evidence table

| Evidence | Classification | Required behavior | Owning phase | Guide-compliant representation |
|---|---|---|---|---|
| Driver Replacement title and Agreement No | Explicit | Open from one Lease Agreement and display the server-loaded agreement number read-only. | 3/5 | Parent-context create dialog. |
| Incoming Driver | Explicit | Display the agreement's current primary driver read-only. | 1/3 | Server-owned action context. |
| Incoming Mobile No | Explicit | Display the current driver's mobile number read-only. | 1/3 | Typed context value; never posted as an editable input. |
| Date Time Out | Explicit label; source-derived value | Display when the current driver became responsible for the agreement. | 1/3 | Agreement start for the first replacement; latest prior replacement date for later replacements. |
| Outgoing Driver | Explicit | Select a different active driver. | 1/3/4 | Server-filtered typed options; backend repeats existence, activity, and difference checks. |
| Outgoing Mobile No | Explicit | Display the selected driver's mobile number read-only. | 1/3 | Carried by the server-provided typed option. |
| Replacement Date | Explicit | Capture a required date/time that is not earlier than incoming Date Time Out. | 1/3/4 | Typed date control and backend invariant. |
| Cancel / Save | Explicit | Cancel follows dirty-discard behavior; Save prevents duplicate submission and preserves safe server errors. | 3/4/5 | Canonical editor lifecycle. |

## Confirmed current-source facts

- `LeaseAgreement.DriverId` is the current primary-driver assignment;
  `AdditionalDriverId` is separate state and remains unchanged.
- Driver display name and mobile number come from the existing `Driver` /
  `MemberPartner` model. The generic driver select does not carry mobile number,
  so this action requires a typed context option.
- Current source contains no driver replacement history, driver operational
  status transition, exclusive driver-assignment rule, or driver movement
  aggregate. None is invented.
- A dedicated replacement row is necessary to preserve incoming/outgoing driver
  identities and the action dates after `Agreement.DriverId` changes.
- A serializable transaction is required because concurrent requests could both
  pass the stale-current-driver guard before updating the same agreement.

## Frozen detail/write contract

| UI field | Angular type | Request field | Server ownership/validation | Status |
|---|---|---|---|---|
| Agreement No | read-only string | — | Loaded by agreement id; never trusted from the client. | Confirmed |
| Incoming Driver | read-only string | `incomingDriverId` only as stale guard | Name/mobile are server context; submitted id must still equal tracked `Agreement.DriverId`. | Confirmed |
| Incoming Mobile No | read-only string | — | Loaded from current driver. | Confirmed |
| Date Time Out | read-only date/time | — | First replacement uses `Agreement.DateAndTime`; later replacement uses the latest prior replacement date whose outgoing driver is current. | Derived |
| Outgoing Driver | `FormControl<number|null>` | `outgoingDriverId` | Required active, existing, and different from incoming driver. No unsupported exclusivity rule is applied. | Confirmed |
| Outgoing Mobile No | read-only string | — | Derived from selected server context option. | Confirmed |
| Replacement Date | `FormControl<Date|null>` | `replacementDate` | Required real date/time, not earlier than incoming Date Time Out. | Confirmed |

## Frozen action-state contract

| Action | Source state | Target state | List flag | Endpoints | Failure/refresh | Status |
|---|---|---|---|---|---|---|
| Replace Driver | Open, non-invoiced Lease Agreement with a current primary driver | Append replacement history and set `Agreement.DriverId` to the selected outgoing driver; leave `AdditionalDriverId` unchanged | `CanReplaceDriver = !IsClosed && !Invoiced && DriverId.HasValue` | `GET LeaseAgreement/{id}/driver-replacement-context`; `POST LeaseAgreement/{id}/driver-replacements` | Keep dialog open on failure; close and refresh current page on success | Frozen |

The backend reloads and revalidates every source-state predicate at Save. The
ListVM flag is presentation state only. The request includes the server-loaded
incoming driver id as a stale guard. The history row and agreement mutation are
persisted through one tracked save inside the serializable transaction.

## Phase handoff

| Phase | Result |
|---|---|
| 0 — discovery/evidence | Complete. Screenshot content classified and current driver/agreement source traced. |
| 1 — domain/API freeze | Complete. Context, write DTO, history ownership, validation, and concurrency boundary are frozen. |
| 2 — read/list | Limited to the action-state flag and row action; grid columns and filters are unchanged. |
| 3 — detail/write | Complete. Typed create-only dialog, server context, driver/mobile/date fields, validation, loading/error/empty/dirty states, translations, RTL/theme, and responsive styling are implemented. |
| 4 — domain action | Complete. Backend revalidation, stale guard, history append, current primary-driver update, and serializable atomic save are implemented. |
| 5 — integration/runtime | Source wiring is complete: list action, dialog, service routes, controller routes, existing DI, and explicit Angular compilation entry. Runtime verification remains owner-owned. |
| 6 — final reconciliation | Complete by scoped source and Git-diff review in both repositories. No unresolved Missing, Conflicting, or Uncertain requirement remains. |

The persistence addition requires an owner-generated migration for
`LeaseAgreementDriverReplacement`, its foreign keys, and index. No migration or
model snapshot may be generated or edited by this task.

## Verification boundary

Only source inspection and scoped diff reconciliation are permitted. Build,
tests, lint, browser/runtime verification, database commands, migrations,
commit/push, and deployment are not run.
