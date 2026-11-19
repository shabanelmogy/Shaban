| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Angular 18 feature review and reconciliation

Date: 2026-10-22. Frozen target and discovery manifest: `ANGULAR_18_MAINTENANCE_EVOLUTION_PLAN.md`. User explicitly authorized builds and fixing upgrade errors. Scope is frontend tooling maintenance, not a screen/business refactor.

## Applied changes and decisions

- Angular framework, compiler, service worker and CDK: 18.2.14. CLI/build tooling: 18.2.21. TypeScript: 5.5.4. Angular ESLint: 18.4.3; TypeScript ESLint: 7.18.0; ESLint: 8.57.1. Zone.js minimum raised to ~0.14.10 to match Angular's peer contract.
- Related libraries upgraded to publisher-supported versions: ng-bootstrap 17.0.1, ngx-editor 18.0.0, angularx-qrcode 18.0.2, ng-apexcharts 1.11.0, ngx-sweetalert2 12.4.0. PrimeNG remains 17.18.0: its published peer range supports Angular 18 and the existing theme files remain valid.
- Node 22 selected in .nvmrc and CI; package engines records Angular-supported ranges. Verification uses isolated Node 22.23.4; global Node 24.18.1 was not replaced. Existing npm scripts remain intact.
- Existing browser-esbuild builder, output `dist/sigma`, production budgets, service-worker registration and tsconfig.app.json explicit entry boundary retained. CI's pre-existing `dist/sigmfront` path corrected to match the frozen/actual `dist/sigma` output; workflow was not executed.
- Official Angular core migrations run from 17.3.10 through 18.2.14: invalid two-way binding migration found no changes; HTTP migration updates test providers and AuthModule; after-render migration changes CurrentBranchService's read-phase callback to Angular 18's callback object; server BootstrapContext migration found no SSR entry requiring change.
- Official CDK 18 migration passed without source changes. Angular ESLint 18.2 migration passed without source changes. CLI 18's only update schematic is the optional application-builder conversion, deliberately skipped under the frozen compatibility choice. No ng-bootstrap update migration is declared by the installed package.
- HTTP migration integration: AuthModule consumes AppModule's existing root interceptor-equipped HttpClient rather than creating the additional client proposed by the generic migration. AppModule's token/error interceptor registrations remain unchanged. Existing HTTP tests use provideHttpClient followed by provideHttpClientTesting; assertions and test journeys are unchanged. Formatting-only migration changes were removed.
- Explicit @angular/localize/init added to build and test polyfills after the development build reported implicit injection. No translation keys or visible workflows changed.

## Verification evidence

| Check | Result / evidence |
|---|---|
| Initial Git state | Clean frontend repository at f4382974; no unrelated user edits present |
| Required recipe drift check | All eight packets OK initially and after implementation; no generated packet refresh needed |
| Publisher compatibility | npm peer metadata checked for Angular, compiler, ESLint and all upgraded UI libraries |
| Full dependency tree | npm ls --all --json exit 0 after deduplication; `angular18-dependency-tree.json` |
| Lockfile source review | Lockfile v3 retained; complete object comparison to saved baseline; root dependency ranges match locked versions; registry URLs/integrity syntax checked; dependency graph has no invalid/missing peer or dependency nodes |
| Development build | Passed, exit 0; bundle generation 143.385 s; `angular18-build-development.log` |
| Production build | Passed, exit 0; bundle generation 116.239 s; initial total 5.67 MB, below retained 6 MB error limit; `angular18-build-production.log` |
| Scoped diff / whitespace / merge markers | Complete scoped source diff reviewed; lockfile reviewed semantically; git diff --check passed; no conflict markers; syntax parsing passed for all 11 changed TypeScript files (does not claim tests were run) |
| Runtime, visual, database, browser, tests and lint | Not run; owner runtime acceptance pending |

Installation notes: initial npm attempts could not reconcile the old Angular/ESLint graph. Original installed modules and lockfile retained in ignored `.angular/angular17-upgrade-backup/`; affected stale lock entries were re-resolved through npm. A subsequent full graph check exposed inherited nested package version conflicts; npm dedupe repaired them. No force or legacy-peer-deps override was used. npm installation emitted dependency deprecation notices and its install-script policy notices; the successful builds establish that the required native build tools work in this environment.

## Reconciliation and conformance

| Contract/path | Owning evidence | Final comparison | Status |
|---|---|---|---|
| Framework and third-party versions | Frozen tooling plan + package.json | All targeted majors/patches installed; PrimeNG theme compatibility retained | Confirmed |
| Route/bootstrap shape | UI1; src/main.ts, app.module.ts, existing routing | NgModule bootstrap/lazy routing and hash strategy unchanged | Confirmed from source |
| Authenticated client path | UI1; AppModule and AuthModule | AuthModule inherits root client; root functional interceptors unchanged | Confirmed from source; runtime pending |
| After-render phase | Official core migration + CurrentBranchService | Read phase, pending/destroy guards, microtask and NgZone publication retained | Confirmed from source |
| Build/output compatibility | angular.json + deploy.yml | browser-esbuild and dist/sigma retained; CI consumes matching output and Node selection | Confirmed from source; CI not executed |
| Polyfills | angular.json | Zone remains in src/polyfills.ts; localization initialized explicitly | Confirmed from source |
| DTO/grid/filter/write/action contracts | Not changed | No backend source, API contracts, calculations or business transitions changed | Not Applicable |
| Styling/RTL/accessibility/translation | Existing shared owners | No stylesheet, screen layout or vocabulary edit | Source unchanged; runtime pending |
| In-app user guide | Master7 screen completion boundary | No screen behavior was implemented/refactored; tooling setup documented in README | Not Applicable |

Phases applied: discovery/freeze, phase 5 framework compatibility, phase 6 reconciliation. Business/API/grid/write/domain phases 1-4 are not applicable. No screenshot evidence or unresolved material business decision exists. Shared extraction gate: no new shared UI behavior was introduced. Learning protocol: existing canonical rules were applied; no new general screen rule needs promotion into books/skill.

## Known observations outside upgrade scope

The Angular 18 development compiler reports NG8011 for the existing Fleet ServiceLog editor hint nested in a multi-root @else block (`src/app/modules/Fleet/ServiceLog/components/details/details.component.html:230`). The build succeeds. No warning suppression or unrelated screen refactor was added; runtime projection/placement should be checked in that screen's own review.

Bounded read-only audit also identified pre-existing mixed ngModel/reactive-form registration patterns in CreditNote details and unnamed template controls in the demo builder. These were not reported by the build as upgrade errors and were not changed. No runtime success is claimed for those existing flows.

Production warnings: initial bundle 5.67 MB exceeds the 2 MB warning threshold but passes the 6 MB failure threshold; six existing component stylesheets exceed 10 KB warning thresholds but remain below 20 KB failure limits. Critters reports six skipped critical-inlining selectors, consistent with UI29's existing documented limitation. No budget, optimizer or diagnostic suppression was changed. The implicit localization warning is absent from the final production build. Generated index, web.config, webmanifest, ngsw.json and ngsw-worker.js exist in dist/sigma. Browser/service-worker execution remains unverified.

## Handoff

Owner checks: select Node 22, run npm ci when reproducing on another checkout, start the frontend and check login, root request headers/error handling, branch selection with open/closed editors, Arabic/English, RTL, dark/light, grid filters/paging, save/dialog/confirm, dates/numbers, QR label, charts, rich text and service-worker refresh. Tests/lint remain pending because only builds were authorized. Do not run deployment as part of this handoff.

Backend / AutoMapper / domain calculations / migrations: no changes; Add-Migration is not required. No database/EF migrations, tests, lint, browser automation, commits, pushes, deployment, Graphify or Sigma MCP were run. Angular source-update schematics are tooling migrations, not database migrations.

Agent utilization: one bounded luna_explorer using gpt-5.6-luna audited upgrade-sensitive API/library consumers read-only after the shared freeze; it owned no writable files. Root owned package/config edits, migration integration, builds and full diff reconciliation. Delegation overlapped independent compatibility discovery with package installation, reducing wait time without merge risk.

Suggested frontend commit (do not execute):

```text
chore(angular): upgrade frontend to angular 18
```

## Final changed files

- `F:/My Work/Sigma/SiGmaAngularFrontEnd/.github/workflows/deploy.yml`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/README.md`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/angular.json`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/package-lock.json`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/package.json`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Accounts/BalanceSheet/components/list/list.component.spec.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Assets/depreciationReportFy/components/list/list.component.spec.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Assets/depreciationReportFy/services/depreciation-report-fy.service.spec.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Sales/Fleet/components/details/details.component.spec.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Sales/Fleet/components/list/list.component.spec.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/Staff/components/details/details.component.spec.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/Staff/components/list/list.component.spec.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Suppliers/Supplier/components/details/details.component.spec.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Suppliers/Supplier/components/list/list.component.spec.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/auth/auth.module.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/service/current-branch.service.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/.nvmrc`

Final count: 16 tracked modifications and one new .nvmrc. No backend/instruction/canonical-book/generated-packet source edits. Final report and build logs are local review artifacts outside the frontend repository. Build output and the previous dependency backup are ignored by Git.
## Follow-up: stale development/compiler state (2026-10-22)

Owner reported missing Jasmine globals and TS2345 for the migrated afterRender read callback. Investigation confirmed Angular core 18.2.14 is installed, and its actual index.d.ts declares the callback-object overload including `read`. The existing development server process (PID 17100) was created at 11:19:36, before the Angular upgrade; the reported diagnostics showed both intermediate source versions produced by the official migration and final formatting. This is evidence of the pre-upgrade watch process retaining its previous compiler/module state.

Stopped only that identified server on localhost:4200 and restarted the same frontend development configuration using isolated Node 22.23.4. New server PID 24500 compiled successfully in 95.429 seconds, entered watch mode and listens at http://localhost:4200/. The existing non-blocking NG8011 warning remains as documented above. No browser, test runner, database or deployment operation was performed.

Jasmine configuration was checked rather than installing unrelated test frameworks. @types/jasmine 5.1.4 and its index declarations exist. Configuration parsing finds 360 spec files in tsconfig.spec.json with types [jasmine], and zero spec roots in tsconfig.app.json with types []. A fresh TypeScript 5.5 language-service session opened the BalanceSheet spec through the actual editor-selected root configuration and resolved describe, beforeEach, afterEach, it and expect to their Jasmine signatures. The semantic source check reports no missing test globals in that representative file; this was not execution of the tests. No tsconfig or application-source edit was necessary. If the existing editor still shows old diagnostics, reload its window/language service so it reads the installed declarations again.

Follow-up scope: Phase 5 environment recovery and Phase 6 evidence update only. Existing upgrade source changes were preserved and the scoped afterRender/config diff rechecked. No new API, UI, schema, guide or commit change; no subagent was needed for this bounded sequential diagnosis. Recipe -Check passed for all eight packets again.

## Approved follow-up: ServiceLog footer projection (2026-10-22)

The owner supplied NG8011 and requested correction in the ongoing Angular upgrade. Tier S: only the ServiceLog create-only footer hint projection and its existing bilingual guide note are in scope. UI shape 01 modal, backend not affected. UI13's controlled-composition example keeps editorDialogHint in a dedicated single-root @if; shared EditorDialog's footer ng-content selector is the actual owner. Target: move the existing paragraph into its own @if (!isViewMode), outside the multi-root form @else, retaining text, class, icon and condition. This matches the canonical composition, requires no shared-component/API/style change and does not change View/Create/Save/dirty rules. Existing upgrades and documentation working-tree changes are preserved. Phase 3 scoped composition fix and phase 6 reconciliation apply; no separate freeze artifact is needed for Tier S. The initial eight-packet drift check passed. Screen-guide handoff reuses fleet-guide.ts, service log topic, /UserGuide/fleet and the existing Fleet sidebar guide entry. The reusable projection lesson will be recorded in UI13 and its skill digest/history, then affected packets regenerated through the generator. Existing explicit authorization for upgrade builds remains in effect; no test runner, lint or browser automation is authorized.

### ServiceLog projection reconciliation

Result: the authorized Angular18 development build passed (exit 0; 119.246 seconds), with no NG8011 or error diagnostic. Evidence: `angular18-servicelog-projection-build.log`. This supersedes the earlier record of NG8011 as deferred/outside scope; the owner's subsequent warning report placed its repair in scope.

Conformance: UI13's actual controlled-composition sample uses a dedicated single-root conditional paragraph; ServiceLog now matches it at details.component.html:230. Shared EditorDialog's footer selector remains unchanged; the original `!isViewMode` condition, paragraph class/icon/key and form are retained. The shared owner is reused, with no duplicate shell/styles or general behavior change. Bilingual fleet-guide.ts service-log topic now documents create-only footer guidance; existing GuideReader registration, /UserGuide/fleet route and Fleet sidebar menu entry remain valid. Source comparison and whitespace checks passed. Visual/RTL/theme and interaction acceptance remain owner-pending; no browser or test runner was used.

Files for this follow-up: ServiceLog details.component.html, UserGuide/content/fleet-guide.ts; documentation UI13, CHANGELOG and local screen-refactor skill section7/history. Generated PHASE-03-detail-write and PHASE-04-domain-actions consume UI13 and were refreshed via the generator; all eight packets were regenerated deterministically and final -Check passed. Semantic review: the added rule makes the existing composition sample explicit, preserves shared footer ownership and original feature visibility, and changes no business rule or approved reference role. Existing documentation modifications were preserved. No backend/DTO/mapping/calculation/schema change or Add-Migration requirement.

The frontend HEAD advanced externally during the work to 0785cc5a (`update to angular 18`) and already contains both scoped fixes; no commit was created by the assistant. Reviewed their exact two-file diff against the previously recorded f4382974 baseline and confirmed current source matches HEAD. No reset/staging/push was performed. The owner's currently running development server was left alone; the verification command was a one-shot build, not a restarted server.

No subagent: this was one small sequential template correction. Suggested commit messages for unstaged equivalents or remaining documentation only: `fix(service-log): project create hint into dialog footer`; `docs(ui-book): clarify conditional footer projection`. Never recommit files already included in the owner's checkpoint merely to use these suggestions.
