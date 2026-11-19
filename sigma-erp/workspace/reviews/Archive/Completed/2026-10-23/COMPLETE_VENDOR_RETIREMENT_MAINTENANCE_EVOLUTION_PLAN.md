# Complete Metronic / Bootstrap retirement

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Authority | Owner 2026-10-22: continue through deletion of all old components, and update every dependent screen |

## Scope and evidence

Frontend-only presentation and import migration. Preserve all existing working-tree changes from interactive vendor and layout-style retirement. No backend, API, persistence, enum values, financial rules, permissions or save payload changes. No commit/push/deployment. Previously authorized builds/tests/browser remain authorized. Browser automation is currently unavailable; visual acceptance stays pending unless recovered.

Recipe drift check on 2026-10-22: all eight packets current. PLAN-00, phases 0/1 (presentation and integration contracts), 2/3 (dependent presentation only), 5 and 6 apply. Phase 4 domain transitions and backend patterns are not applicable: commands and endpoint/state contracts remain owned by current features.

Initial TypeScript import/export/dynamic-import reachability from main.ts finds 361 TypeScript files under _metronic; 84 are reachable (current Sigma shell, theme service, export/form helpers and domain enums). Other incoming imports include tests, obsolete Builder and compatibility feature files. Preserve/move required helpers and current PrimeNG shell before removing old components. Dependency report: frontend .angular/vendor-retirement/graph.json. It is conservative for barrel exports and separate from explicit app compile roots and test roots, which must also be reconciled.

## Frozen target and alternatives

Keep current shared Sigma components backed by PrimeNG and current domain contracts. Move live shell code into app/layout, enums into modules/shared/enums, export/form helpers into modules/shared/utils and ThemeModeService into layout. Update every direct consumer, including compatibility compile roots and retained tests. Remove obsolete demos, KT plugins and their tests once their external dependencies have been eliminated. Delete old vendor trees only after proving no imports remain.

Alternatives: retain old namespace (rejected by owner's full-removal request); delete wholesale immediately (would break live shell/domain imports); dependency-ordered migration (selected). Bootstrap/Metronic Sass components and utilities must be retired, not renamed wholesale. Existing screen-owned fields/actions are preserved while adopting shared native/PrimeNG presentation. Any required small native CSS utility is centrally Sigma-owned; it must have documented consumers and explicit behavior, not import vendor component CSS. Theme, RTL, responsive and print contracts remain.

## Impact map and classification

| Owner | Classification | Producer / consumers | Target |
|---|---|---|---|
| Current authenticated shell/sidebar/appbar/footer | Refactor location; keep behavior | root lazy route, shell header, navigation policy, print IDs, shell tests | app/layout with unchanged route/provider identities |
| Domain enums | Move | feature models/forms/services/vocabularies | shared/enums, values unchanged |
| Excel and required-form helpers | Move | lists/reports/editors | shared/utils, signatures/behavior preserved |
| Theme mode service | Move | root, auth/errors/header | layout/theme-mode.service, stored preference and resolved modes unchanged |
| Old KT plugins/demo widgets/header/aside/builder | Remove after graph verification | obsolete module/spec roots | no replacement when unreachable |
| Bootstrap/Metronic Sass | Replace / remove | all feature/shared styles and templates | native Sigma base/utilities plus PrimeNG shared controls |
| Obsolete npm packages/assets | Remove after usage proof | surviving imports/global styles/config | lockfile in sync, live icon/media assets retained until migrated |
| Shared in-app guide | Extend | existing EN/AR UserGuide reader | presentation/navigation consistency and unchanged business flows |

## Contract and conformance

| Concern | Book | Reference / shared owner | Frozen target |
|---|---|---|---|
| Root route/provider | UI1, phase5 | main.ts/app.config.ts/app.routes.ts | one root HttpClient, hash routing/auth/navigation policy unchanged |
| Frame | UI1 | current LayoutComponent and ShellHeaderComponent | container-fill, fixed chrome and internal scroll; mobile Drawer; preserve print integration |
| Lists | UI4/6/7 | shared FilterPanel/DataTable/ActionButton; Workshop Job list | preserve exact fields/actions/paging/events; remove vendor dependencies at shared owner where possible |
| Editors | UI12/13/14/18 | shared step editor, EditorDialog/EditableCollectionTable/FileField | preserve form/control/collection/upload lifecycles and native focus |
| Tokens/icons/buttons | UI24/25/27 | current Sigma tokens, primary/secondary actions, PrimeNG overlays | central native presentation, both themes/directions and keyboard access |
| Guides | Master7 | modules/UserGuide/content/shared-screen-guidance.ts | update current bilingual topic; no duplicate guide |

## Implementation and verification sequence

1. Root freezes this source-supported presentation-only contract (done). Delegate bounded independent read-only audits after this point; no overlapping file edits.
2. Move live code and update imports/config/spec roots, remove demonstrably unreachable old component trees, run compile/test checks.
3. Inventory actual remaining vendor CSS/control consumers, replace through shared owners and consistent native/PrimeNG templates, remove old Sass/plugin dependencies and unused packages/assets.
4. Rebuild LTR/RTL assets deterministically, run focused/full tests and production build, inspect complete scoped diff and remaining dependency counts.
5. Reconcile contract/conformance and guide against actual final source; report honest residual risks. Do not mark complete while required old components/styles are still active.

Recovery is the existing Git commit plus preserved working-tree source; no history rewrite or automatic rollback. Test failures justify local corrections; no budget inflation or diagnostic suppression. Visual/print acceptance cannot be inferred from compilation or source alone.

## Contract amendment D1 — final active layout dependency

Confirmed during source reconciliation: routed Receipt still uses a fixed viewport host with historical header/sidebar offsets (265px desktop versus the actual280px shell, and no response to sidebar hiding). Under the owner's every-dependent-screen instruction and UI1 container-fill contract, move only its non-embedded host into the existing bounded route box; retain the embedded/dialog sizing and all form/save/allocation contracts. Once this last actual dimension consumer is removed, remove the shell ResizeObserver/legacy dimension bridge and unused dimension tokens. Existing print IDs remain because current print consumers still use them. Canonical UI1 shared container-fill is the approved shape reference, not a new viewport calculation.

## Contract amendment D2 — orphaned demo dependencies

After old demos are removed, the only ApexCharts importer is the unconsumed former shared bridge (no template/component/import or explicit compiler root uses it). SweetAlert2 has no feature/module/template consumer; only root/test provider registration remains. Remove that orphan bridge, both unused root/test registrations and ApexCharts/SweetAlert2/ngx-SweetAlert2 packages. Real dashboards use current PrimeNG/Chart.js owners and confirmations remain the existing shared PrimeNG dialog. Remove obsolete CommonJS allowlist entries for these and already-retired Prism/object-path. No active feedback or chart path changes.

## Contract amendment D3 — canonical primary owner

Final UI24 conformance requires the eleven remaining raw primary actions to compose existing PrimaryActionButton, rather than retain an independent native primary paint rule. Preserve label, click/submit, disabled/loading and ID contracts, and register the actual shared import in every owner. Delete the temporary sigma-native-primary rules after these consumers migrate. Ordinary native secondary/danger controls remain PrimeNG-backed and Sigma-owned. Forgot Password uses its existing loading observable to render the shared busy state and block repeat submission; no new API/workflow is introduced.

## Contract amendment D4 — native error background ownership

Error404/500 still set their theme-specific body background images. The retired body helper classes supplied cover/center/no-repeat; dropping those helpers without a native replacement loses the existing presentation. Preserve those three values through a Sigma error-host marker and a body rule conditioned on that rendered host, with automatic cleanup on departure. No old helper/plugin lifecycle is restored. Test both presence and removal against the actual ErrorsComponent.

## Implementation closure — 2026-10-23

All frozen presentation/integration slices and D1–D4 are implemented. The separate COMPLETE_VENDOR_RETIREMENT_FINAL_RECONCILIATION.md records the root's scoped diff review,529/529 passing final tests, successful production build, native LTR/RTL/guide/dependency evidence and the remaining owner visual/data/print acceptance. This Frozen plan is retained as the historical contract; no source/API decision was silently rewritten.
