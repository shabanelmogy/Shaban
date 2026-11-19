| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Supported Angular platform — implementation and reconciliation

Scope: frontend platform upgrade from owner checkpoint `0785cc5a`, followed by root/build modernization. Frozen decisions: `ANGULAR_SUPPORTED_PLATFORM_MAINTENANCE_EVOLUTION_PLAN.md`. Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`. Documentation repository: `F:/My Work/Shaban Documents/Shaban`; root instruction/review files remain local under the current ownership arrangement.

## Decisions and contracts

- Angular21 endpoint, rather than unsupported18/19 or PrimeNG22's changed license boundary. Node22.23.4 isolated runtime; compatible major-aligned CLI/CDK/tooling and TypeScript5.9. No license commitments added. MIT Apex4.7 retained behind one typed shared adapter; ng-apexcharts version coupling removed.
- UI shape is shared platform/control maintenance, not a screen redesign. Frozen business/API/DTO/filter/grid/action/permission/date/financial contracts remain unchanged. Backend, EF, AutoMapper and domain-calculation changes: none. No schema migration required. Screenshots: none. Business decisions Missing/Conflicting/Uncertain: none.
- Root composition moves to standalone bootstrap/config/routes, with current lazy feature NgModules interoperating. Hash routing, one root HTTP interceptor chain, auth completion, Zone compatibility and service worker remain acceptance invariants. No claim that every feature was converted to standalone/signals/zoneless.
- PrimeNG public Select/DatePicker APIs, PrimeUIX theme, matching native checkbox/radio labels and shared publisher-state hooks replace removed APIs. AutoComplete free tokens retain separator and explicit original duplicate behavior. PrimeNG19 was a compilation waypoint: separator support exists in the final21 publisher, not19; no intermediate runtime acceptance is claimed.
- Angular test files retain Jasmine typing in the spec config. The explicit application file boundary remains; no new broad include or diagnostic suppression.

## Evidence / stages

| Stage | Evidence | Result |
|---|---|---|
| Angular19 required core/CDK migrations | `.angular/supported-upgrade/19-migration.log`, `19-cdk.log` | Completed; standalone defaults made explicit |
| Angular19 graph/development build | `19-tree.json`, `19-build-final.log` | Passed |
| Angular20 required core migrations | `20-migration-root.log` | Completed;44 DOCUMENT import migrations, other required migrations no changes |
| Angular20 migration path repair | Original error log + temporary rootDir workspace setting | Restored original source root after official schematic; no publisher patch |
| Angular20 graph/build | `20-tree.json`, `20-build-final.log` | Passed |
| Angular21 required core/CDK/CLI migrations | `21-migration.log`, `21-cdk.log`, `21-cli.log` | Completed;413 control-flow files migrated, ES2022 default lib |
| Angular21 architecture/development build | `21-build-development.log` | Passed in76.693s; no Angular template warnings/errors |
| Angular21 dependency graph | `21-tree-final.json` | Passed; lock direct dependencies semantically match package.json |
| Angular21 production build | `21-build-production.log` | Passed in152.699s; exit0 |

Stage package/lock/config snapshots and the18/19 dependency directories remain ignored under `.angular/supported-upgrade`. No automatic reset/commit. A clean-install retry was needed after an interrupted19 installation; missing vendor files were repaired by installation, not source shims. npm graph checks are strict; no force/legacy-peer-deps bypass.

## Source reconciliation

- A TypeScript AST/printer comparison of734 changed TS files before20's DOCUMENT migration found only10 candidates beyond import/decorator-only transformations. Reviewed candidates are root config, renamed control CSS selectors/import-array exports, shared date/quantity directives and toast type. No business-method change was found. Official19 decorator reformatting explains the wide diff.
- Bounded independent review examined350 HTML files (about5455 changed lines), confirming field names, option expressions, event handlers and translation keys were preserved through the mechanical migration. It identified duplicate loop IDs and the opposite default duplicate semantics of Chips/AutoComplete; both corrected. Final TypeScript AST comparison checked743 tracked TS changes, with14 candidates beyond imports/decorators (including two removed root modules); root reviewed the changed control selectors, shared compatibility owners and guide text. No business calculation/request method change was found.
- Native label group spacing remains on the whole control+label wrapper (310 prior mb-4/mx-3 consumers). Dynamic report checkbox id includes field name/index. Common settings explicitly allow duplicates; fine-import plate list explicitly disallows them as before.
- Shared styles were checked against extracted publisher21 DOM/state hooks, including body overlays, selected calendar dates/ranges, Select/MultiSelect, paginator, Toast close and checkbox/radio keyboard focus. Source proof is not visual acceptance.

## Canonical conformance / guide handoff

| Concern | Owner | Actual implementation/reference | Reconciliation |
|---|---|---|---|
| Root HTTP/routing/change detection | UI1 | Existing interceptors, auth service, root routes | Matched token→error interceptors, exact routes + hash strategy, auth completion, Zone change detection and SW options; development build passed |
| Dialog projection | UI13 | Shared EditorDialog + owner18 checkpoint repair | Preserved; no suppression |
| Lookups/date/quantity | UI16/17/27 | Shared directives, actual Select/DatePicker/InputNumber publisher declarations | Typed values/validators/parsing retained; development compile passed. Read min/max and disabled signals; native picker disabled state preserves CVA handling. |
| Theme/RTL/overlays | UI24/25 | Sigma tokens, actual data-bs-theme selector, shared global CSS | Publisher hook review done; visual acceptance pending |
| Guide | Master7 | `UserGuide/content/shared-screen-guidance.ts` in existing overview of every module guide | EN/AR label-click/token-entry guidance; existing guide route/menu reused |
| Verification | UI29/Master7 | Explicit authorized build checks, source diff | Tests/lint/browser/database remain unrun |

Books UI1/8/14/16/17/20/24/27/29 and skill digest synchronized with current public control names and reusable upgrade lessons. Generated packets00/02/03/04/05/06 regenerated through the generator; all8 Check results OK. Semantics: shared root/client/hosting, lookup/date/label contracts and actual theme hooks flow from their owning book blocks, without new business rules. Final check will run again at handoff.

## Delegation and verification boundary

Root owns dependency stages, official migrations, architecture, integration, complete diff and final decision. Earlier isolated chart adapter work was integrated, then a reused `luna_style_audit` reader (gpt-5.6-luna) audited publisher styles, labels/token semantics and HTML binding preservation. Read-only reuse reduced repeated discovery and let sequential installs/migrations continue; no overlapping writable ownership. No agent declared the task complete.

Only authorized frontend builds/installations/framework schematics and source/document inspection were used. No tests, lint, browser automation, database/EF migrations, commits, pushes or deployment. Angular schematics are framework source migrations, not database migrations.

## Owner acceptance after compilation

Verify login/session/API headers/error handling; hash/deep links; working-branch editor guard; local dates/range caret/precision and invalid values; labels/keyboard; Select/MultiSelect/dropdown overlays; dialogs/confirm/save; tables/paging/export/report print; token inputs comma/Enter/duplicates; QR/charts/editor; all RTL/LTR, light/dark, desktop/narrow layouts; and production service-worker update behavior.

Suggested frontend commit: `chore: upgrade Angular to 21 and modernize application bootstrap`.
Suggested documentation commit (scoped files only): `docs: align Sigma patterns with Angular 21 and PrimeNG controls`.

## Final architecture audit additions

The focused sol audit (gpt-5.6-sol) confirmed root provider/route/hosting/schema and chart adapter coverage, and found a real custom Karma bootstrap default-mode gap. Corrected src/test.ts with an explicit NgModule providing Zone change detection, matching the publisher builder pattern. The audit agent subsequently hit a usage limit; root retained reconciliation ownership and completed its independent source review. ESLint flat configuration loads (3sections), preserving Angular/template recommended rules, inline HTML processor and prior local rules; lint itself is not run.

Official cleanup removed29 unused imports in22files. Current syntax parsing:2776TS and723HTML files, zero errors before final whitespace-only corrections; application roots147 with0spec files, spec roots362 with360specs and Jasmine types. git diff --check passes after removing migration-generated whitespace. No suppression of extended diagnostics was introduced.

The separate RTL webpack tool remains and is not executed. Native ES2022 library selection follows the official CLI migration, not a feature-local workaround. Application Karma config no longer references the old webpack test plugin; it retains existing reporters/assets/styles/Jasmine mode.

## Final verification and limits — 2026-10-22

Production build passed with the existing budgets/optimization unchanged. Initial output5.76MB (estimated transfer684.37kB) exceeds the2MB warning threshold but is below6MB error threshold. Six component styles exceed the10kB warning threshold: FilterPanel11.76kB, Navbar11.94kB, Auth15.89kB, DataTable16.95kB, EditableCollectionTable10.60kB and Receipt16.03kB; all remain below20kB error threshold. Sass reports17 displayed deprecation warnings with242 repetitions omitted, from legacy shared/vendor imports/functions. These warnings are recorded rather than suppressed. Reducing bundle/style size and vendor Sass modernization remain follow-up work; do not claim zero warnings. There are no Angular template/compiler errors or NG8011 projection warnings in the final build.

Output inspection confirms flat dist/sigma/index.html, web.config, ngsw.json and ngsw-worker.js, with base href ./; source service-worker configuration and assets remain present. Build output is ignored and not deployed. Strict dependency graph exit0, no force/legacy-peer-deps/overrides remain; package-lock direct dependency values match package.json. Final diff whitespace check exit0, no stale removed PrimeNG/ng-apexcharts imports or merge markers. ESLint config import is a configuration inspection, not lint. New test Zone module was source-reviewed, not executed.

Applied phases: frozen PLAN00/platform contract, shared detail-control compatibility (Phase3), integration/runtime wiring (Phase5), complete source reconciliation (Phase6). Backend/domain/read-grid business/action phases not applicable: APIs/fields/actions/calculations unchanged. Broad screen business guides/DTO tables not invented; existing shared user-guide content covers the actual changed input presentation. Canonical exceptions are mixed existing screen shapes and interoperable feature NgModules; no redesign or blanket signal/zoneless rewrite.

Final packet generation/check: all8 OK after UI1/8/14/16/17/20/24/27/29 and skill updates. Scoped docs diff was reviewed separately from unrelated existing changes; generated files were written only by the generator. All prior user changes preserved; no backend edits. Owner verification remains yes because runtime/visual/test/lint acceptance is pending. No prohibited test/lint/browser/database/commit/push/deploy action was run.

Shared-first architecture reconciliation extension, 2026-10-22: current framework
21.2.25/PrimeNG21.1.10 platform now has460/460 passing default ChromeHeadless tests
with strict unknown-template validation, no NG0303/NG0955/obsolete effect warning,
and a final production build exit0 (production-handoff.log;148.421s). Shared
Select/DatePicker, FilterPanel/paginator/table, SVG publisher and root/lazy metadata
repairs and exact limits are recorded in ANGULAR_21_ARCHITECTURE_FEATURE_REVIEW.md.
Existing budget/dependency debt and owner-session visual acceptance remain
explicit; no blanket production-readiness or completed zoneless/signal conversion
claim is made. Backend/schema/permissions/financial contracts remain untouched.
