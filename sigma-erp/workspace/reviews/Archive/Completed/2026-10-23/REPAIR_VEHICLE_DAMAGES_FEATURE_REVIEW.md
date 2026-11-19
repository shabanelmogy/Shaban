# Repair Vehicle Damages — feature review

| Status | Owner verification pending |
|---|---|
| Implemented — source-only | yes |

## Scope

Improve the placement and formatting of the `Damage Details` heading on the
`RepairVehicleDamages` Angular report screen. Vehicle search, summary values,
damage zones, and repair workflow behavior remain unchanged.

## Applied guidance

| Concern | Canonical guidance | Implementation |
|---|---|---|
| Report title and section hierarchy | UI 3, UI 20 | Keep the report title in `app-feature-title`; render the damage content after the vehicle summary in a distinct section. |
| Shared section presentation | UI 1 / shared `FormSectionComponent` | Replace the bare `h2` with `app-form-section` using compact density and the shared wrench icon treatment. |
| Standalone registration | UI 1 | Register `FormSectionComponent` in the screen component imports. |
| User guide | Master block 7 | Add the screen's Damage Details review step to the Fleet guide in English and Arabic. |

## Verification

- Confirmed `FormSectionComponent` export, selector, title input, compact
  density, icon input, dark-theme tokens, and print behavior from the shared
  source.
- Confirmed the target template registers and uses the shared component.
- `git diff --check` passed for the scoped component files.
- Build, tests, runtime, browser, and visual acceptance remain pending for the
  owner; prohibited commands were not run.

## Final reconciliation

| Area | Result |
|---|---|
| Heading placement | Matched: the heading remains directly below the vehicle summary and now owns the damage content section. |
| Heading presentation | Matched: shared compact section header, translated title, and wrench icon. |
| Workflow/data contract | Unchanged. |
| Translations | Existing `repairVehicleDamages.damageDetails` key reused in both vocabularies. |
| Backend/API/schema | Out of scope; no migration required. |
