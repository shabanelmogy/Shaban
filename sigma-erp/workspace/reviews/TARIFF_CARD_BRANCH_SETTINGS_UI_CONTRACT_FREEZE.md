# TariffCard branch settings — owner amendment, 2026-10-09

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Scope | TariffCard list action and branch-settings modal; directly related EN/AR and Rental guide |

## Evidence and frozen decisions

The owner supplied `C:/Users/user/Desktop/123.PNG`, requested the screen in `Rental/TariffCard`, then explicitly requested restoring the button and exposing Add when there are no saved settings. This supersedes the temporary withdrawal for the new TariffCard entry. The withdrawn RentalTariff/LeaseTariff entries are outside this amendment.

Later owner amendment (2026-10-09): the renewed request explicitly includes
Rental and Lease. `BRANCH_TARIFF_SETTINGS_SHARED_CONTRACT_FREEZE.md` extends the
entry restoration to both lists and promotes this existing settings workflow
to one shared consumer owner. The earlier decision above remains historical;
the new instruction supersedes its Rental/Lease exclusion. Source-only outcome
is recorded in `BRANCH_TARIFF_SETTINGS_FEATURE_REVIEW.md`.

| Screenshot/request item | Source evidence and decision |
|---|---|
| Branch dropdown and adjustment percentage per row | Existing `TariffSettingDTO` and `TariffSettingUpdateDTO`; `BranchService.GetSelect` supplies options. |
| Add and Remove | Editable collection with typed row controls; blank new branch/percentage, no sample branches or 100% defaults. Saved/edited row removal asks for confirmation. |
| Empty saved settings | Successful GET with `entities: []` still displays headers, empty message and enabled Add. Never gate the form/table on row count. |
| Cancel / Save | Controlled shared modal, dirty discard confirmation, enabled invalid Save revealing validation; only pending requests/decisions or read failure disable mutation. |
| Negative decreases, positive increases | Informational EN/AR hint from supplied screenshot; no client price calculation. |
| Percentage bounds | Existing backend accepts required finite decimal in [-100,100]; required positive Int32 branch ID and no repeated branch. |
| Scope of settings | Existing global tenant settings, independently saved; neither DTO contains TariffCardId. Entry belongs in `/TariffCard`, not in a particular card's Add/Update payload. |
| Load failures | Both settings and branch lookup must succeed before editing/saving; inline error and Retry, no partial empty list submitted after failed read. |

Backend shape: existing custom **Pattern 4 settings** owner `SiGma.Business/Services/TariffSettingService.cs`. `GET TariffSetting` reads saved rows only. `PUT TariffSetting/TariffSettingList` receives only `{branchId, adjustment}[]`. Preserve the prior frozen Rental auxiliary contract's full replacement exception (omitted saved rows removed on Save); do not change persistence to generic BE16 upsert, silently seed rows, rename backend keys, or alter schema/formulas. No backend edit is needed. Empty Save is already accepted; removing saved rows is explicitly confirmed by the row workflow before submitting the displayed set.

UI shape: **controlled modal, one small editable collection, no totals** (UI13 D4-2). A feature-owned business component reuses existing shared mechanisms instead of cloning generic row/shell/validation behavior. Parent mounts one instance per opening and blocks simultaneous card editors; closing settings does not reload unrelated card data.

## Conformance frozen before implementation

| Concern | Owning block | Actual reference / symbol inspected | Shared owner | Target |
|---|---|---|---|---|
| List entry | UI3 | `shared/components/feature-title`, existing TariffCard list | FeatureTitle | Project translated secondary action beside Create |
| Modal layout | UI13 | `shared/components/editor-dialog/editor-dialog.component.ts/html`, `height`, `contentPadded` | EditorDialog | Bounded definite height with shared flex chain; no feature CSS |
| Editable table | UI14 | `shared/components/editable-collection-table`, typed row directive, fillHeight/stickyHeader | EditableCollectionTable | Headers/Add/empty visible on zero rows |
| Row behavior | UI14/10 | `shared/utils/editable-rows.ts`, `EditableRows` | EditableRows | Add/focus/dirty, identity-safe removal, pending form freeze |
| Validation | UI19 | `shared/components/field-error`, `shared/utils/scalar-validators.ts` | FieldError/scalar validators | Required branch/percentage, range, duplicate table error and invalid focus |
| Lookups | UI16 | `BranchService`, `shared/utils/select-options.ts`, `mergeSelectOptions` | Existing lookup service/helper | Numeric mutable options; preserve saved labels absent from lookup, server still validates existence |
| Pending Save/discard | UI10 | `shared/utils/form-state.ts`, `freezeFormState`; `ConfirmationDialogService.confirm` | Shared form state/confirmation | Freeze controls, preserve edits on failure or discard cancellation |
| Feedback | UI22 | `StateMessage`, `TariffSettingService` skipErrorInterceptor | Existing inline error/success interceptor | Inline read/save errors and Retry; one standard interceptor success |
| Lifetime | UI28 | `takeUntilDestroyed`, `DestroyRef.onDestroy` installed Angular contract | Angular lifecycle | Per-opening mounted child; no overlapping Retry, balanced loading finalizers |
| Guide | Master7 | `UserGuide/content/rental-guide.ts` and existing reader | UserGuide | EN/AR entry, empty/Add instructions, bounds/global scope/removal note |

Recipe generator `-Check` passed all eight packets before implementation. PHASE03 shared reference roles and generated controlled-modal/collection instructions agree with the canonical blocks. Existing peer/user edits are retained. No reusable pattern change is required; all mechanisms above already have owning book/skill rules.

## Verification boundary

Source-only diff, TypeScript/template parsing and translation/source-reference checks are allowed. Build, tests, app/browser, database, migrations, commits and push remain unperformed under project boundaries. Owner must verify opening the actual route, zero-settings Add, lookup, Save/reopen, validation, failure/Retry, discard/removal, RTL, themes and responsive layout.

## Final source reconciliation

| Concern | Final evidence | Status |
|---|---|---|
| Entry and lifetime | TariffCard list imports the standalone child, projects the settings button beside Create, and mounts it with `branchSettingsVisible`; each opening creates a fresh settings/lookup request batch. Card editor and settings cannot be opened together. | Implemented — source-only |
| Empty saved response | Child `rows.replace(saved)` accepts `[]`. Template conditions use loading/error only; collection renders headers, empty message and Add regardless of row count. | Implemented — source-only |
| Layout | Shared definite `height=min(560px,calc(100dvh - 24px))`, two `sigma-editor-form` links and `fillHeight/stickyHeader`; no copied screenshot palette or feature SCSS. | Implemented — source-only |
| Row collection | Existing EditableRows supplies Add/focus, saved/edited confirmation, dirty state and identity recheck; removal confirmation freezes the form. Numeric branch options are merged with saved labels. | Implemented — source-only |
| Submit | Invalid/pristine/empty conditions do not disable Save. Required positive Int32 branch, finite [-100,100] adjustment, duplicate detection, shared per-field messages and invalid focus precede HTTP. Payload contains only branchId/adjustment. | Implemented — source-only |
| Recovery | Both declared and transport failures shown inline. Read failure disables mutation and offers Retry. Save/discard freeze restores the same draft after failure/cancel. Standard mutation interceptor owns success feedback. Subscriptions tear down and loaders finalize. | Implemented — source-only |
| Translations | New root branchTariffSettings has 20 matching EN/AR leaves; all 17 explicitly referenced leaves exist, plus the three confirmDiscard convention keys. | Implemented — source-only |
| User guide | Rental guide TariffCard topic documents new action, empty/Add workflow, global scope, bounds, Save validation and removal/discard. RentalTariff topic points to TariffCard. Existing `/UserGuide/rental` reader/menu retained. | Implemented — source-only |

Reviewed the complete new component sources and scoped existing-source diffs. TypeScript syntax parses for list/child/EN/AR/guide and Angular17 template parses for list/child passed; source-import existence and translation parity checks passed. `git diff --check` passed for scoped tracked edits. These are syntax/source checks, not compilation or runtime tests. Final recipe `-Check` again passed PLAN00 and PHASE00–06; no canonical, template or manifest changes occurred, so no regeneration was needed. Prior details-component and vocabulary changes are retained; dormant RentalTariff/LeaseTariff code and their withdrawn entries were not edited.

Grid/read contract remains visible: Branch column uses `branchName` lookup labels with `branchId` selection/key; Adjustment % uses `adjustment`. Saved ListVM fields are exactly branchId/branchName/adjustment. No filters, pagination, tariff-card list DTO or route/provider/interceptor changes. No backend, DTO, AutoMapper, price-calculation, access-control or schema change; `Add-Migration` is not required. No unresolved new business decision remains in this amendment; actual prior blank-window cause and live acceptance remain unverified.

Applied scoped discovery/freeze, Phase03 frontend settings editor, integration source wiring and Phase06 reconciliation. Backend/read-grid rewrites and domain actions are skipped because existing contracts are reused. No agents: this was a small sequential change with overlapping component/translation/guide ownership. No build/test/lint/browser/app/database/migration/snapshot/commit/push/deploy/Graphify/Sigma MCP command was run.

Suggested frontend commit: `feat(tariff-cards): add editable branch tariff settings`.

Owner acceptance: open `/TariffCard` and settings with no persisted rows; confirm headers/Add appear; add two distinct branches with positive and negative percentages, Save, reopen; check missing values, repeated branch, range violations, removal/discard cancellation, network failure/Retry, narrow viewport, RTL and dark theme. Verify existing card Create/View/Edit/Delete and guide navigation remain functional.
