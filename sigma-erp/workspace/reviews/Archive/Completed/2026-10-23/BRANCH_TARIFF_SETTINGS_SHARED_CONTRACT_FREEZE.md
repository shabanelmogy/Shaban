| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Branch tariff settings entry restoration — Rental / Lease

Owner explicitly renews the branch-settings action for both Rental and Lease.
Actual source has a visible button only in TariffCard, while RentalTariff and
LeaseTariff headers still contain the earlier withdrawal comment. The current
instruction supersedes that withdrawal for both lists. Do not claim a TariffCard
runtime visibility cause: its button is already unconditional in source.

Existing three workflows consume the same global tenant TariffSettingService:
GET TariffSetting, PUT TariffSetting/TariffSettingList with {branchId,adjustment}[];
no rental/lease/card discriminator exists. Retain the frozen full-replacement
exception, [-100,100] finite percentage, positive branch IDs and no duplicates.
No new per-module settings, defaults, price calculation, backend or schema change.

Promote the existing TariffCard settings component to the shared business owner
shared/components/branch-tariff-settings, and adopt it in RentalTariff, LeaseTariff
and TariffCard. Remove the two dormant duplicate dialog/form/request implementations
only after their consumers switch. Preserve each list's filters, grid, tariff
editor and routes. Shared form/collection/confirmation mechanics remain owners;
this is one already-common setting workflow, not a generic new settings framework.

Successful empty settings still render the shared table/Add toolbar; never gate
entry or Add on list rows or saved settings. Both reads must succeed before
mutation; inline failure/Retry cannot submit a partial list. Save remains enabled
for incomplete inputs and reveals validation. Mounted per-opening child loads
fresh values; close and row confirmations preserve draft/disabled controls.
Lists delegate only this modal's route-exit decision to its deferred guard.

| Concern | Book / actual source reference | Shared owner | Target |
|---|---|---|---|
| Button | UI3; FeatureTitle unqualified action ng-content and current TariffCard button | FeatureTitle/secondary action | Visible translated settings button in both requested list headers |
| Empty modal | UI13/14; current TariffCard component, EditorDialog.height and EditableCollectionTable toolbar | Existing editor/table | Definite 560px bounded height/flex body; Add independent of row count |
| Controls | UI14/19; current typed rows and scalar validators | EditableRows/FieldError | Same branch/adjustment rules, fixed dropdown width and confirmed saved-row removal |
| Exit | UI10; collectionMovement.canDeactivate, freezeFormState | ConfirmationDialogService/form-state | Deferred one decision, route/X/Cancel/Escape gates, same active draft restoration |
| Reuse | Master5 shared-extraction gate; identical API consumers in all three lists | Shared branch-tariff business component | Single implementation, no stale duplicate callers |
| Guide | Master7; Rental/Lease existing guide topics | Existing UserGuide | EN/AR entry/empty/Add/shared settings instructions |

Applicable source repair/freeze, integration and final reconciliation packets;
initial recipe -Check passes all eight. Read existing owning UI13/14/10/3 blocks,
public source/reference values and skill; synchronize reusable-owner evidence
in UI13, skill and changelog, then regenerate through the generator and recheck.
No agents needed for tightly coupled extraction. Build/tests/lint/browser/app/DB/
migrations/snapshots/commits/push/deployment remain outside this task.
