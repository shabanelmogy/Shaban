| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Angular 18 tooling maintenance and implementation plan

Date: 2026-10-22. Owner request authorizes upgrading the frontend to Angular 18; owner subsequently explicitly authorized frontend builds and repairs for upgrade errors.

## Manifest and existing-state inventory

Scope: F:/My Work/Sigma/SiGmaAngularFrontEnd tooling, dependency lockfile and required framework migrations/compatibility fixes only. Baseline commit f4382974 (`update`); working tree clean. Root workspace and reviews are outside the application Git repository. Angular core 17.3.10, CLI 17.3.8, TypeScript ~5.2.2; browser-esbuild builder with dist/sigma output, NgModule bootstrap plus standalone feature consumers. Node installed globally is 24.18.1 (outside Angular 18 supported range). No screenshots or business requirements supplied.

UI shape: framework/toolchain maintenance, not a new screen. Backend shape: not applicable. No screen shape/reference, DTO, grid column, action-state, EF, mapping or calculation change is authorized or needed. Existing routes, root HttpClient/interceptors, Zone.js, styles/themes, service worker, explicit tsconfig.app.json file boundary and business contracts remain the compatibility baseline. No in-app user-guide change is needed unless visible workflows change.

## Impact map / gap decision table

| Owner / consumers | Classification | Target and evidence |
|---|---|---|
| package.json + package-lock.json / frontend | Extend | Angular core family 18.2.14; CLI/build tooling 18.2.21; CDK 18.2.14 |
| TypeScript / Angular compiler | Extend | ~5.5.4: official Angular 18.2 range >=5.4 <5.6 |
| Node runtime / npm + CLI | Create | Repository .nvmrc selects Node 22; package engines records compatible Node range; use isolated Node 22 without changing global Node |
| ng-bootstrap, QR code, editor, charts, alert adapter | Extend | ng-bootstrap 17.0.1; angularx-qrcode 18.0.2; ngx-editor 18.0.0; ng-apexcharts 1.11.0; ngx-sweetalert2 12.4.0, from publisher peer metadata |
| Angular ESLint + TypeScript ESLint / existing eslintrc | Extend | Angular ESLint 18.4.3, compatible TypeScript ESLint 7 and ESLint 8.57; keep eslintrc configuration |
| PrimeNG 17.18.0 / all existing controls and themes | Keep | Installed publisher metadata explicitly supports Angular ^17 || ^18; avoids unrelated PrimeNG 18 theme/API migration |
| browser-esbuild / hosting + service worker | Keep | Optional application-builder migration is not required for Angular 18; preserve output layout |
| Backend, API, persisted/historical data | Keep | No backend or schema change; migration not required |

## Options and frozen target contract

Selected: upgrade within Angular 18 using publisher-compatible dependencies and official required schematics. Rejected: package-number-only update (would miss migrations); optional application builder or PrimeNG 18/theme replacement (adds unrelated output/UI change). The user explicitly chose Angular 18; no move to a newer major. Angular 18 is now outside LTS per the official compatibility table; this does not change the requested target.

Confirmed decisions: target major, preservation of workflows/API, clean baseline, explicit build authorization. Derived decisions: latest available patches within major 18, compatible third-party package versions, isolated Node 22. No Missing/Conflicting business decision. Runtime acceptance remains pending. No authorization to run tests, lint, database commands, commits, pushes or deployment.

## Conformance and phase ownership

| Concern | Canonical block | Actual reference / owner | Target |
|---|---|---|---|
| Scope and compatibility | Master 1,4,5 | package.json; angular.json; src/main.ts; src/app/app.module.ts | Preserve architecture and contracts |
| Root providers/route wiring | UI 1; phase 5 | src/app/app.module.ts and existing routing | Framework migrations only; no client/provider fork |
| Verification claims | UI 29; Master 7 | actual build logs + complete scoped Git diff | Distinguish compile from visual/runtime acceptance |
| Known backlog | UI 30 | canonical backlog inspected | No unrelated backlog repair |

Applied sequence: discovery and freeze, dependency installation, official core/CLI/CDK migrations, source compatibility audit, authorized development and production builds, complete diff review and reconciliation. Phases 1-4 business/API/read/write/domain action changes are not applicable; phase 5 compatibility and phase 6 reconciliation apply. PLAN-00 used to structure this frozen maintenance plan; request is implementation, so continue after freeze.

Recipe drift check: all eight packets OK on 2026-10-22. No packet refresh necessary; selected plan-00, phase-05, phase-06 semantically agree with canonical scope/verification rules. No generated packet edits.

## Verification / recovery

Review dependency peer requirements and final npm dependency tree; inspect migration diffs and stale version references; check whitespace/merge markers. Run both development and production builds under compatible Node after explicit owner authorization. Owner manually verifies login, Arabic/English, RTL/light/dark, navigation, grid filters/paging, editor/dialog/save, date/number controls, charts, editor, QR and service-worker refresh.

Rollback is the owner's saved baseline commit; do not reset/checkout/revert or create commits automatically. Restore scoped tracked changes to that baseline and reinstall its lockfile only if the owner requests rollback. No data migration/backfill/rollout changes.

Delegation: one bounded source-read-only compatibility audit may run after this freeze, with root owning package changes, migration integration, build repair and full diff review. No concurrent source edits by agents.

## Sources

- https://angular.dev/reference/versions
- https://v18.angular.dev/tools/cli/build-system-migration/
- https://github.com/ng-bootstrap/ng-bootstrap#dependencies
- npm publisher package/peer metadata queried on 2026-10-22.

## Implementation decision record (2026-10-22)

The frozen target was implemented. Publisher peer constraints confirmed Zone.js ~0.14.10; its declared minimum now matches that requirement. Official core schematics changed HTTP test providers and the CurrentBranchService read-phase hook. AuthModule inherits the existing root client to satisfy UI1 rather than accepting a generic child provider. Build evidence justified explicit localization polyfill registration. CI output verification now targets dist/sigma to match the existing frozen builder output. Development and production builds both passed under isolated Node 22.23.4; full reconciliation, files, warnings and pending runtime acceptance are recorded in ANGULAR_18_FEATURE_REVIEW.md. No business/API contract was reopened.
