| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Restored Rental and Lease branch tariff settings

The owner renewed the settings action and explicitly included both Rental and
Lease. RentalTariff and LeaseTariff headers had the withdrawal comment and no
settings button. TariffCard already had its action in the current source; this
task does not claim to have established a runtime visibility or blank-dialog
cause. The frozen handoff is `BRANCH_TARIFF_SETTINGS_SHARED_CONTRACT_FREEZE.md`.

## Decisions and implementation

| Concern | Evidence / decision | Final source |
|---|---|---|
| Entry | Current owner instruction supersedes the earlier withdrawal for Rental and Lease | Translated gear/button projected into FeatureTitle in both lists; no row-count condition |
| Screenshot | Explicit branch selector, percentage, Add/Remove and Save/Cancel; negative decreases/positive increases. Example branch names/100 values are sample content, not defaults | Real BranchService options, blank new row and existing shared controls |
| Shape | UI13 one small child collection without totals selects a controlled modal; Master5 requires reuse across identical consumers | Shared BranchTariffSettingsComponent adopted by RentalTariff, LeaseTariff and TariffCard; dormant duplicate forms/requests retired |
| Empty settings | Backend GetSettingsAsync returns IsSuccess=true and Entities=[] when no rows exist | forkJoin reads settings/options; success renders an editable collection with independent Add toolbar, not an empty modal |
| API ownership | Existing GET TariffSetting / PUT TariffSetting/TariffSettingList; no module/card discriminator | Same tenant-wide full replacement payload {branchId,adjustment}[]; no new contract or per-module setting |
| Validation | Existing backend positive branch ID, uniqueness and [-100,100] percentage | Typed controls use required/Int32/finite/bounds; Save stays enabled for invalid inputs and shows field/duplicate feedback |
| Failure | UI2/22 both failure channels | Read failure blocks partial replacement, offers inline Retry; declared/HTTP Save failure retains draft and restores prior editable controls |
| Removal | UI14 shared EditableRows | Saved or dirty rows use shared confirmation; freezeParentOnConfirmation preserves the aggregate state; removals apply on Save |
| Exit | UI10 deferred discard and form-state snapshot | Route guards and X/Cancel/Escape share canDeactivate; repeat subscription/pending operations reject, cancelled decisions restore the same active draft |
| Lists | Current lists and producer unchanged | Rental/Lease displayed columns name/detail/notes match VehicleTypeListDTO fields plus id for actions; TariffCard name/discountPercentage/fromDateTime/toDateTime plus id retained; queries/paging/tariff editors untouched |

## Reference conformance reconciliation

| Frozen concern | Compared actual owner/reference | Final match |
|---|---|---|
| Header | FeatureTitle unqualified ng-content; existing TariffCard action | All three use the same translated secondary gear action through the public slot |
| Modal | UI13 composition; EditorDialog public sizing/content inputs | width720px, bounded definite560px height, padded flex content, shared footer/RTL/theme; no feature CSS |
| Collection | UI14/EditableCollectionTable toolbar and fill/sticky inputs | Add rendered independently of saved rows; fillHeight/stickyHeader; fixed360px branch and200px percentage columns,620px shared table minimum |
| Typed row lifecycle | EditableRows and scalar-validators/form-state public owners | Existing helpers retained; snapshot freezes before asynchronous Save/discard/removal; shared component mounted afresh for each opening |
| Integration | pages/routing.ts actual RentalTariff/LeaseTariff/TariffCard lazy entries | Existing route exports retained; each list adds a settings-only CanDeactivateFn; Lease routed editor guards preserved |
| Standalone registration | Actual named exports and @Component.imports | Shared child and its required controls registered; explicit tsconfig.app.json runtime file entry added |
| User guide | Existing GuideReader/UserGuide routing and sidebar-menu-data links | EN/AR RentalTariff and LeaseTariff topics explain own action, empty Add, validation and shared settings; TariffCard topic retained. /UserGuide/rental and /UserGuide/lease reused |

## Scoped files and phases

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

- New `src/app/modules/shared/components/branch-tariff-settings/branch-tariff-settings.component.ts` and `.html`, promoted from the two previously untracked TariffCard branch-settings files. The old location and selector have no remaining consumers.
- List `.ts`/`.html` pairs for Rental/RentalTariff, Lease/LeaseTariff and Rental/TariffCard.
- `Rental/RentalTariff/tariff.routes.ts`, `Lease/LeaseTariff/leasetariff.routes.ts`, `Rental/TariffCard/tariffcard.routes.ts`.
- `UserGuide/content/rental-guide.ts`, `UserGuide/content/lease-guide.ts` and the single new runtime entry in `tsconfig.app.json`. Other pre-existing dirty entries/files preserved.

Phase0 source/evidence and Phase1 existing settings-contract freeze; Phase3
shared controlled editor, Phase5 route/standalone integration, Phase6 source
reconciliation applied. Phase2 grid/query implementation skipped because those
contracts did not change; Phase4 server domain actions skipped because row edits
remain a draft within the existing Save workflow. No backend, AutoMapper,
calculation, entity or schema change; no Add-Migration needed.

## Documentation and packet maintenance

UI13 owns the reusable-consumer evidence; the sigma-screen-refactor skill §7
and revision table plus CHANGELOG record the extraction. Documentation Git root
is `F:/My Work/Shaban Documents/Shaban`; skill/review artifacts remain under the
Sigma coordination root per the existing instructions.

The generator refreshed PLAN00 and PHASE00–06, preserving existing canonical
changes. Semantic review confirms Phase3 still selects UI13 controlled small
collection composition, attributes modal mechanics to EditorDialog/EditorTabs
rather than routed Fleet editors, and records the current UI13 fingerprint;
Phase5 retains lazy route/provider ownership and Phase6 retains source-only and
mandatory guide gates. The consumer evidence does not create a new generic
settings API/control default. Final recipe -Check passes all eight packets.

## Source-only evidence and owner verification

- Parsed nine scoped TypeScript files and four Angular templates: no syntax errors.
- Checked 89 local named imports against actual exported symbols and 40 shared workflow EN/AR strings including discard keys: no missing entries.
- Reviewed list/component bindings, control registration, concrete public inputs, deferred pending/identity gates, exact payload and backend empty-response behavior.
- Reviewed complete scoped source diff separately in the frontend repository, including untracked shared files/guide sections; scoped git diff --check passes. Earlier unrelated source/doc diffs retained.
- These checks do not certify application compilation or runtime/visual acceptance. No builds, tests, lint, browser/app checks, DB commands, migrations/snapshots, Graphify/Sigma MCP, commits/pushes or deployment were run.

Owner checks: open /RentalTariff and /LeaseTariff, locate the header settings
action even with an empty main grid; with no saved settings verify Add Branch,
choose branches and percentages, Save and reopen from either module/TariffCard;
verify missing/duplicate/out-of-range validation, negative/positive/zero values,
row removal, cancelled discard and route exit while pending. Exercise failed
read/Retry and failed Save without losing draft, then narrow viewport/RTL/themes.
Runtime causality for the previously blank window remains unverified.

No subagents used: this is one tightly coupled shared extraction with overlapping
consumer/owner files, so delegation would add merge and coordination cost.

Suggested frontend commit: `fix(tariffs): restore shared branch settings in rental and lease`.
Suggested documentation commit: `docs(sigma): record shared branch settings consumers and refresh recipes`.
Suggestions only; neither repository was committed.
