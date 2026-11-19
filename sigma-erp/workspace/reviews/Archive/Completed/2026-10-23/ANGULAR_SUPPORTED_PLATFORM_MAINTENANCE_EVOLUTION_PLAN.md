| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Supported Angular platform and architecture evolution

Date: 2026-10-22. Owner authorizes sequential upgrades until a suitable supported release is selected, followed by architecture modernization on that release. Existing explicit authorization covers frontend builds and upgrade repairs; tests/lint/browser/database/commits/push/deployment remain prohibited unless separately authorized.

## Manifest / inventory

Frontend repo F:/My Work/Sigma/SiGmaAngularFrontEnd, baseline HEAD 0785cc5a (Angular18 checkpoint), initially clean. Backend/API/business contracts are unchanged and Frozen compatibility inputs. No screenshots. Existing dev server PID24380 was running before dependency work; it must not keep stale compiler state during major updates and can be stopped for this upgrade; do not launch browser automation. Prior review artifacts remain historical.

Current framework 18.2.14; CLI18.2.21; CDK18.2.14; TypeScript5.5; Zone0.14; PrimeNG17.18.0; Node22 via .nvmrc; browser-esbuild output dist/sigma; NgModule root plus standalone feature components; existing root functional HTTP interceptors and hash routing. Metadata/inventory evidence: angular-supported-dependency-metadata.json and angular-supported-primeng-consumers.json. Direct PrimeNG readers include 319 Dropdown import files, 248 Calendar files, shared DatePicker/Quantity/MockData directives, tables/dialogs/trees and global/theme styles. PrimeNG17 resource CSS is no longer available in newer majors.

## Target decision and alternatives

Target Angular21.2.25/CLI21.2.27/CDK21.2.14 with PrimeNG21.1.10, through Angular19.2.25/CLI19.2.27/CDK19.2.19/PrimeNG19.1.4, then Angular20.3.34/CLI20.3.40/CDK20.2.14/PrimeNG20.4.0, then21. Latest registry patch values are checked before each install. Node22.23.4 is compatible throughout; TypeScript5.8 for19,5.9 for20/21; Zone0.15; RxJS7.8.2. Final package engines reflects selected runtime. Framework/CLI release patch numbers legitimately differ but majors match.

Evidence: official Angular releases marks21 LTS through2027-06;20 ends2026-11-28;19/18 unsupported. Angular22 is available but PrimeNG22 introduces a new Community/Commercial licensing model, unlike the MIT community terms of21. The owner authorized a compatible supported endpoint, not new commercial-license commitments; choose21 and document22 as a future explicit decision. Do not infer company revenue/license eligibility. No claim that21 is the newest Angular major.

ApexCharts newer5.3.2 LICENSE contains a materially changed dual-license model despite its npm metadata claiming MIT. Preserve MIT ApexCharts4.7.0; remove ng-apexcharts framework-version coupling through one typed shared Angular adapter using the existing chart library. Preserve existing chart option/data APIs and rendered features. No paid licensing acceptance, library patching, --force or legacy-peer-deps bypass. The inspected4.7 LICENSE remains MIT.

## Impact map / gap decisions

| Area and consumers | Decision | Target |
|---|---|---|
| Angular/tooling/runtime | Extend | Sequential19→20→21 official required migrations and build checks |
| PrimeNG/theme and direct consumers | Refactor |19 for first step; replace removed Calendar/Dropdown/Chips/TabView APIs before20; existing shared controls own adapters; preserve validators/data/labels/workflows |
| Theme/style ownership | Extend | Existing shared Sigma tokens + publisher preset/design-token configuration, actual dark selector, logical spacing/RTL; remove obsolete primeng/resources imports and update renamed selectors |
| Charts / Metronic widgets | Replace bridge only | One typed shared Apex4.7 Angular adapter replaces ng-apexcharts while retaining chart option contracts; no chart data or business calculation change |
| Bootstrap/provider/route architecture | Refactor after endpoint | Standalone root/bootstrapApplication, explicit application configuration, one HttpClient and existing interceptors, hash route contract, compatible zone-based change detection; preserve APP_INITIALIZER behavior |
| Build architecture | Refactor after endpoint | Supported application builder; preserve flat dist/sigma hosting path, service worker, web.config/assets, production budgets/optimization and explicit app compiler boundary |
| Signals/control flow and inputs/outputs | Extend where useful | Apply safe supported schematics/targeted shared modernization without changing screen business semantics; no blanket observable-to-signal substitution or experimental production APIs |
| Backend, persistence, permissions, accounting | Keep | No source/schema/mapping/calculation/business change |
| User guides | Extend | Update owning guide only when screen control/workflow description changes; no documentation of invented behavior |

## Frozen contracts / ambiguity register

Confirmed: supported endpoint selection delegated to reviewer; preserve application data/API/permissions/RTL/dark/responsiveness; existing build authorization; current public contracts and value formats remain. Derived: Angular21 endpoint under current license boundary; MIT chart bridge; compatible version matrix; new PrimeNG names/theme API. Missing business decisions: none. PrimeNG22 commercial/community eligibility is deliberately excluded, not assumed. Visual/runtime equivalence remains acceptance pending, not source evidence.

UI shape: platform/shared-control maintenance across existing screen types; no screen redesign. Backend shape: Not Applicable. Canonical references: UI1 root client/wiring; UI13 actual shared EditorDialog; UI16/17 existing lookup/date directives; UI24/25 shared Sigma styling/RTL/theme; UI29 verification. Existing screen fields, DTOs, routes and workflows are the frozen compatibility contracts. No new permissions/API/domain actions or derived financial values.

## Conformance / ownership

| Concern | Book | Producer/reference | Target consumer comparison |
|---|---|---|---|
| Root client | UI1 | AppModule current provideHttpClient/token/error interceptors | New config retains exactly this chain; no feature client forks |
| Dialogs | UI13 | shared editor-dialog and existing forms | Preserve projected body/footer and Create/View/Save guards |
| Date/lookup/quantity | UI16/17/27 | DatePickerDirective, QuantityInputDirective, MockDataFieldDirective | Preserve local Date/number value contracts, input labels, validation and mock-data registration |
| Theme | UI24/25 | styles.scss --sigma-* tokens and data-bs-theme | New publisher theme consumes same visual owners; source review != visual validation |
| Build | UI1/29, Master7 | angular.json explicit roots and current output/assets | New builder retains hosting/output/budgets; build at every stage |

Delegation after this freeze: bounded read-only PrimeNG migration audit, plus isolated shared-chart adapter implementation once exact files are assigned. Root owns destination, dependency/config changes, required Angular migrations, broad mechanical PrimeNG import/selector updates, bootstrap/build modernization, integration, full diff review and reconciliation. No overlapping writable ownership; workers preserve user/peer changes and do not run builds/tests/commits.

## Implementation slices / verification

1. Establish chart bridge and modern PrimeNG19 theme/API compatibility, update related dependencies, install clean compatible graph, run official19 required core/CDK migrations, build development. Preserve optional modernization for endpoint.
2. Update20 dependencies; replace removed PrimeNG APIs together with all in-scope producers/consumers; run official required20 migrations; build development.
3. Update21 dependencies; run official required21 migrations; build development. Destination is stable only after graph and compilation pass; record remaining runtime acceptance.
4. Modernize application bootstrap/config/build on21, apply safe supported architecture migrations, update source guidance for actual reusable contract changes and affected packets through generator; build development and production.
5. Review complete scoped diff in frontend and separately scoped documentation changes; inspect all direct public contracts/migration artifacts, source syntax, whitespace/markers and stale package APIs; report manual checks and suggested commits.

No EF migration/data backfill. Recovery uses owner checkpoint0785cc5a and saved per-stage package/config/source snapshots in ignored .angular only if necessary; never reset or commit automatically. Runtime/manual acceptance: login/auth headers/errors, hash/deep links, working branch/editor detection, controls/date parsing/precision, mock data, grids/paging/export, dialog/confirm/save, reports/print, QR/charts/editor, all themes/directions/sizes and service-worker upgrades. Existing service-worker clients need normal refresh/upgrade acceptance. Test runner/lint/browser execution remain pending without authorization.

Initial recipe -Check: all eight OK. Selected PLAN00/Phase5/Phase6 plus Phase3 for shared editor/control compatibility. Master1/4/5/7 and UI1/13/16/17/24/25/29/30 govern; skill is the operational digest and already read in this conversation. Generated packets remain derivative.

## Primary sources

- https://angular.dev/reference/releases
- https://angular.dev/reference/versions
- https://primeng.dev/migration/v19
- https://primeng.dev/migration/v20
- https://primeng.dev/migration/v22
- https://raw.githubusercontent.com/primefaces/primeng/21.1.10/LICENSE.md
- https://raw.githubusercontent.com/apexcharts/apexcharts.js/v4.7.0/LICENSE
- Publisher npm metadata and actual5.3.2 package LICENSE inspected2026-10-22.

## Implementation clarification — 2026-10-22

The final21 framework and root/build composition are reconciled in the same final stage after the successful20 waypoint. Use the supported @angular/build application/dev-server/extract-i18n/karma builders, preserving deployment and Jasmine contracts. This removes legacy build-angular/webpack coupling from the application build; the separate existing RTL tool retains webpack. Update the spec bootstrap to BrowserTestingModule/platformBrowserTesting and remove obsolete webpack require.context discovery because the application test builder discovers specs. No tests are executed without owner authorization. This is a platform configuration change within the frozen modernization scope, with no business/API change.

## Owner scope extension — 2026-10-22

The owner explicitly requests using Angular21's development architecture now to avoid a disruptive migration before production. This supersedes retaining feature NgModules merely for upgrade compatibility. Frozen implementation handoff: convert remaining application declarations to standalone and prune only redundant modules; migrate eligible constructor injection and component input/output/query APIs with Angular21's official schematics in safe mode; preserve public bindings, DI scope, routes, validators, mutation semantics and all business/API contracts. Snapshot current source before each mechanical slice and review its diff. Do not enable best-effort migration or add experimental APIs. Keep typed Reactive Forms; Angular21 Signal Forms/resource APIs are experimental in this pinned version and are not production prerequisites.

Zoneless is a separate compatibility gate: inspect explicit asynchronous state mutations, legacy forms, Zone-dependent integrations and third-party consumers before changing the bootstrap provider. Compilation alone cannot establish change-detection compatibility. Implement source-supported notification fixes where bounded; retain the current explicit zone provider until that gate can be honestly verified. Runtime/browser/tests still require separate owner authorization under AGENTS.md. No guarantee of zero production defects is implied by successful builds.

Canonical conformance: UI1 governs DI/standalone wiring, each existing screen's form/lifecycle contract stays frozen, and UI29 and Master7 own verification. Actual references are the current app.config/app.routes and each shared component's frozen public API. Screen layout, endpoint shapes and user-guide workflows remain unchanged. Root owns mechanical conversions and integration; a bounded read-only zoneless audit may run in parallel without writable overlap.
