| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Correct Vehicle Status frozen handoff — 2026-10-14

Plan: `CORRECT_VEHICLE_STATUS_MAINTENANCE_EVOLUTION_PLAN.md`. Scope: correction frontend folder, directly related backend service/interface/controller/VMs, scoped EN/AR keys/resources, toolbar title exclusion and Administration user-guide topic. Preserve pre-existing changes in shared translations, resources, toolbar and guide. No correction-folder changes existed at discovery. Recheck status/timestamps before editing.

## API and state

| Route | Shape / frozen contract |
|---|---|
| GET VehicleStatusCorrection/GetVehiclesPlatNo | Results<DropdownDto>; tenant/live Vehicle ids, PlateNo labels; auxiliary local loading, recoverable inline failure |
| GET VehicleStatusCorrection/CurrentStatus/{vehicleId:int} | Result<VehicleStatusCorrectionDetailVM>; positive existing tenant/live id; nullable currentStatus, lastMovementType, string lastMovementNo, nullable lastMovementDate and plateNo; add nullable suggestedStatus and bool canCorrect |
| POST VehicleStatusCorrection/Update | Positive required vehicleId + expectedSuggestedStatus enum assertion; retain optional legacy status as an assertion for old consumers. Neither value controls persistence. Recompute suggestion; reject absent/undefined/disagreeing/stale assertions and unavailable suggestion; append authoritative status only when different. Return Result<VehicleStatusCorrectionDetailVM> with post-save snapshot and CanCorrect=false, so no mandatory second UI request. |

CurrentStatus = last live history by CreatedAt DESC / Id DESC, null if none. Suggestion follows the frozen plan; the `CollectionMovement.Type=null` row written by the canonical Lease close is explicitly treated as ordinary Available evidence. CanCorrect = authoritative nonnull suggestion differing from currentStatus. Missing history may be corrected only with real movement evidence. Same-state repeat = success without another history row. No financial effect, ordinary entity change, numbering change or schema change. Shared Repository owns tenancy/soft deletion; never assign SubscriptionId. Existing authentication boundary remains; no roles/permission API is introduced. Correction endpoint is an authorization candidate.

Re-evaluate immediately before write, validate expected target and keep source/target identity. Serialize correction replays using the existing UOW write boundary when appropriate; other movement writers do not share it, so do not claim atomic fleet-wide correctness. Equal-source ordering/tie semantics are in the plan. Cancellation is forwarded throughout custom methods. One save; explicit transaction only if the shared write boundary owns one. No AutoMapper required for explicit projection.

## Screen and action contracts

One `/CorrectVehicleStatus` route retained: selector is context only, not an unsaved persisted draft; no mock generation or discard prompt for selecting a vehicle. Screen09 domain-action lifecycle; preserve existing dedicated routed entry using UI1 shared editor page shell; confirmation-only uses shared confirmation, no input dialog needed. No list, columns/ListVM/filters/paging/export/Add/Delete/financial fields apply.

| Action | State / interaction | Result / recovery |
|---|---|---|
| Select / clear | typed FormControl<number|null>, required positive integer, actual inputId/label; Subject + switchMap read; immediately clear old snapshot | Both failure channels inline with suppression header, Retry same current id; null shows selection state |
| Refresh | selected valid id, not confirming/saving | Same read trigger; invalidates old snapshot |
| Convert | loaded same-id snapshot with CanCorrect=true, not busy/failed | Shared confirmation identifies PlateNo and translated target; freeze selector through confirmation + save; recheck captured identity; POST guarded; replace response snapshot; one global mutation success toast |
| Reset | not confirming/saving | Clear selected id and snapshot; cancel pending read |

Approved-reference inventory: Job close primary action => Supported as Convert; Close/Cancel confirmation => Supported; invoice Next/Previous/line Add/Remove and job close financial payload => Not Applicable (no job/invoice aggregate). Job retry/readonly summary/loading => Supported through existing owners. No new workflow copied from reference.

## Reference conformance before edits

| Concern | Owning block | Actual reference / shared owner | Target decision |
|---|---|---|---|
| Routed bounds, internal scroll, fixed footer | UI1 | Workshop/Job/components/editor; src/styles.scss sigma-editor-* | Same shell, one sigma-editor-scroll; no local SCSS |
| Action flow / readonly fields / retry | UI7/19/22/28 | Workshop/Job/components/close-job; shared StateMessage/FieldError | Same load/ready/busy/result gates; correction-only fields |
| Title, sections, summary, action | UI3/24 | FeatureTitle/FormSection/SummaryCards/PrimaryActionButton declarations | Inside panel, typed readonly cards, public inputs only |
| Confirmation | UI9 | shared/service/confirmation-dialog.service.ts confirm | Identify plate and target; no bespoke dialog |
| DTO / service / tenant / single save | BE3/5/6/8/10/18 | Repository.Query/GetDropdown/FindById; LeaseAgreementService close+replacement semantics | Explicit feature action, no generic CRUD/mapper/schema |
| Route / feedback | UI1/2/22/26 | pages/routing; root AppModule interceptors; AuthGuard | Existing route/client, inline read/action failures with header; one global success owner |

Backend custom service/controller have no overrides; generic CRUD base would expose operations this action does not own. Backend failures localized in both GeneralMessage resources, safe HTTP statuses. New enum presentation stays numeric/wire-aligned locally; existing string enums are not expanded or renumbered globally.
