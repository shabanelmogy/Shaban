| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |

# Browser-native PWA installation

The frontend now contains the installation manifest, branded install icons, Angular 17 service-worker registration/generation and IIS manifest delivery configuration for the existing 7STARSS ERP application. Runtime installation is pending owner verification; no deployment was performed.

## Feature manifest and evidence

- Authorization: owner «تمام ضفها» after the explanation of Angular PWA and browser installation.
- Scope/repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`; no backend repository edits.
- UI shape: global bootstrap/browser integration, an exception to business-screen CRUD/editor/grid patterns. Backend shape: Not Applicable.
- Frozen records: `PWA_MAINTENANCE_EVOLUTION_PLAN.md` and `PWA_FRONTEND_CONTRACT_FREEZE.md`, including their pre-edit IIS and relative-worker amendments.
- Current references: AppModule/root interceptors, main.ts production bootstrap, existing index title/base/favicon, existing GuideReader and typed SHARED_SCREEN_GUIDANCE, installed Angular 17 browser-builder schema and service-worker API/config schema.
- No screenshot/video supplied. Evidence is the explicit owner instruction, directly related source and primary framework/browser/IIS documentation linked in the plan.
- Pre-existing unrelated frontend edits were retained. The existing shared guide already contained date-range, desktop sidebar and sidebar-group guidance changes; this task adds only two EN/AR PWA entries. The complete guide diff includes those prior changes, which are not claimed as PWA work.
- No new app route, endpoint, domain action, permission, API response/payload, persisted data or report contract. AuthGuard, HashLocationStrategy and the one root interceptor-equipped HttpClient remain their current owners.

## Files changed

Paths below are relative to the actual frontend repository:

| File | Change |
|---|---|
| `package.json` | Add exact `@angular/service-worker` 17.3.10 |
| `package-lock.json` | Add its matching lock entry/root dependency only; existing locked packages unchanged |
| `angular.json` | Copy manifest and existing root web.config; production serviceWorker/ngswConfigPath/baseHref `./`; existing budgets/development options retained |
| `src/app/app.module.ts` | Register ServiceWorkerModule once at root, production enabled, registerWhenStable:30000 |
| `src/index.html` | Relative manifest and apple-touch-icon links; Sigma primary theme-color |
| `web.config` | Add `.webmanifest` MIME mapping, retaining existing rewrite rule |
| `ngsw-config.json` — new | Prefetch static shell; lazily cache remaining packaged JS/assets; empty dataGroups; root/nested API navigation exclusions |
| `src/manifest.webmanifest` — new | 7STARSS ERP identity, relative id/start/scope, standalone display, correct icon metadata |
| `src/assets/icons/icon-192x192.png` — new | Existing logo derivative at actual 192×192, white background and inset |
| `src/assets/icons/icon-512x512.png` — new | Existing logo derivative at actual 512×512, white background and inset |
| `src/app/modules/UserGuide/content/shared-screen-guidance.ts` | Two bilingual entries: browser installation; connectivity and safe update use |

Review artifacts are local/unversioned under `F:/My Work/Sigma/reviews`. This task does not move or commit them.

## Decisions and final conformance

| Concern / owning block | Producer and consumer / compared contract | Final result |
|---|---|---|
| Root wiring — UI1, PHASE-05 | main.ts enables production mode before bootstrapping AppModule; AppModule ServiceWorkerModule uses !isDevMode; existing provider/interceptor list retained | Source conformant; one root worker registration, no added client/provider fork |
| Angular version — UI1/29 | Root lock core/common/service-worker and installed package manifests all 17.3.10; declaration confirms register(string, SwRegistrationOptions) | Source peer/API compatibility confirmed; no framework upgrade |
| Build schema — UI29 | Installed browser schema uses boolean serviceWorker and string ngswConfigPath; production configuration supplies both | Source conformant; no newer application-builder syntax copied |
| Relative asset identity — UI1, Master4 | Browser builder passes production baseHref `./` to Generator; joinUrls emits relative assets; worker Adapter normalizes against scope | Source path traced; manifest root/subdirectory resolution checked; runtime acceptance pending |
| Distribution assets / IIS — Master4/5 | Angular normalizeAssetPatterns places manifest and root web.config at output root; existing IIS owner maps .webmanifest to application/manifest+json | Source normalization and XML inspected; hosting section permissions/delivery pending |
| Branding — Master4 | Manifest.name matches index title; icons derive from current favicon mark and match declared PNG dimensions | Confirmed; primary #3498db is the existing Sigma primary; no new screen palette |
| Cache and business data — Master5 | Two assetGroups.resources.files lists refer only to packaged static files; resources.urls absent and dataGroups empty; API navigation excluded | No service-worker cache policy for API/auth/user uploads/reports or writes; server connectivity remains required |
| Updates / drafts — Master5 | Standard Angular service worker only; no activateUpdate, reload subscription or new navigation handler | No new forced reload while editing; owner accepts update after saving/closing/reopening |
| Guide — UI23, Master7 | GuideReaderComponent.sharedScreenGuidance → overview template's guideText language pipe → existing SHARED_SCREEN_GUIDANCE | Paired English/Arabic text added; existing `/UserGuide/:sectionId` and all module guide sidebar links reused |
| Shared-extraction gate — Master5 | Runtime/configuration centralized once in existing AppModule/build owners; guide once in existing shared content owner | No repeated screen code qualifies for extraction. No new screen-pattern lesson or canonical-book change; feature-specific PWA decisions remain in these records |

Grid column order ↔ ListVM, filter/query keys, editor/detail/write DTOs, domain action states, AutoMapper, transactions, calculations and permission candidates are Not Applicable: this feature changes none of those sources or business paths. Backend/data schema unchanged; Add-Migration is not required.

## Phases and verification

- PLAN-00: existing-state inventory, alternatives, impact map and target freeze before edits.
- Phases 0/1: proportional discovery and integration contract freeze; no backend/API contract to change.
- Phases 2/3/4 skipped: no grid/filter/editor/domain action.
- PHASE-05: existing root module, production builder, metadata, static cache and common guide integration.
- PHASE-06: final source reconciliation and complete scoped diff review, including all new JSON files and local icon preview.
- Recipe `-Check`: all eight packets passed before use and at handoff. No canonical/manifest/template changes, so regeneration was unnecessary.
- Dependency setup completed with npm --ignore-scripts --no-audit --no-fund. The initial package-lock-only operation was followed by local npm install. Existing local Angular 17.3.12 drift was aligned to the already locked 17.3.10 graph; semantic comparison confirms no existing locked dependency entry changed. Restoring existing node_modules affected local package installations only; lifecycle scripts were skipped.
- Final ngsw-config JSON passes the installed 17.3.10 JSON schema. The first inspection helper needed the HTTPS draft-07 meta-schema alias registered with AJV; rerun succeeded without any application-source repair for that tooling issue.
- Source checks confirmed production-only worker options, manifest/IIS output paths using installed asset normalization, root/subdirectory manifest URL resolution, actual PNG dimensions, unchanged existing lock graph, installed peer equality and syntax parsing of AppModule/shared guide. XML parses and the MIME entry has the intended value.
- Scoped `git diff --check` passed. Complete scoped tracked diff and new JSON/icon content were reviewed; new JSON has no merge markers/trailing whitespace. Git's LF→CRLF advisory for the pre-existing modified guide is not a whitespace error.
- No builds, tests, lint, browser/application verification, database commands, migrations, commits/pushes, Sigma MCP, Graphify or deployment steps were run. TypeScript syntax/JSON inspection is not compilation or runtime success.
- Subagents were not used: one tightly coupled bootstrap/configuration workstream did not meet the useful parallel-delegation gate.

## Pending owner acceptance and concrete operational limitation

1. Run `npm run build-prod`; no build was run under the standing source-only boundary. Confirm dist/sigma contains manifest.webmanifest, ngsw.json, ngsw-worker.js, web.config and both icons.
2. Serve the generated distribution through HTTPS, or localhost for local acceptance. Verify the manifest is served as application/manifest+json, the worker as JavaScript, and ngsw.json as JSON; IIS URL Rewrite/staticContent availability and configuration permissions remain hosting checks.
3. Existing production baseLoginUrl/baseUrl are HTTP. An HTTPS frontend cannot rely on those insecure fetch endpoints; provide and verify the correct HTTPS endpoints before operational use. Their actual replacement addresses were not supplied, so the source does not guess them. This is a deployment/infrastructure requirement, not an invented API contract.
4. Open the production site in Chrome/Edge, wait for registration/installability, use the browser install option, launch its icon, sign in and exercise an existing authenticated read and save. Installed/native prompt availability depends on browser/device and prior installation; no custom in-app install button was requested.
5. Confirm static requests can use the service-worker cache while authenticated API responses cannot; offline transactional use is unavailable. Save drafts, close/reopen to receive an available update and confirm no forced reload while editing.
6. If hosted in a subdirectory, check relative manifest/worker/static paths and hash navigation there. Exercise existing RTL/LTR, themes, responsive shell and guide navigation. The PWA source adds no screen layout/CSS; actual window/OS rendering remains pending.

Missing application requirements: none. Uncertain operational evidence: deployed HTTPS addresses, build result and live install/cache/hosting behavior. These remain explicitly pending, not represented as passed.

Suggested frontend commit (only the eleven PWA files listed above, excluding prior guide changes): `feat(pwa): enable browser installation and static app caching`

Suggested instruction-layer record commit after the owner places the three review artifacts in their designated documentation repository: `docs(pwa): record installation contracts and source verification`
