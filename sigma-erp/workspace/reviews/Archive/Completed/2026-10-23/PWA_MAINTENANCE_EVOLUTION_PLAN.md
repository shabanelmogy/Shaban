| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

# PWA installation — maintenance / evolution plan

## Authorization and scope

The owner accepted the explanation of browser installation using Angular PWA and instructed: «تمام ضفها». Implement browser-native installation of the existing frontend. This authorizes the dependency and application configuration changes below. No business-policy choice is introduced.

UI shape: application-level runtime integration, a deliberate exception to screen CRUD/grid/editor patterns. Backend shape: Not Applicable. Apply Master 1/4/5/7, UI 1/23/29, the applicable sigma-screen-refactor digest sections, and PLAN-00 / PHASE-05 / PHASE-06. Recipe `-Check` passed all eight packets before use. No packet drift was found. Phases 0/1 are represented by discovery and the frozen integration contract; phases 2–4 have no list/editor/domain action.

## Existing-state inventory and impact map

| Owner/source | Current behavior | Decision | Consumers / impact |
|---|---|---|---|
| `SiGmaAngularFrontEnd/package.json`, `package-lock.json` | Angular 17; locked core/common 17.3.10; local core 17.3.12; no service-worker dependency | Extend with service-worker 17.3.10 matching the committed dependency graph | Root Angular runtime and builder; avoid an unrelated framework upgrade |
| `angular.json` | Browser builder; production/development configurations; favicon and assets copied | Extend production with service-worker generation and copy webmanifest | Production distribution; existing budgets and development behavior retained |
| `src/main.ts`, `src/app/app.module.ts` | NgModule bootstrap, production mode, one interceptor-equipped root client; HashLocationStrategy | Extend the existing root imports with ServiceWorkerModule | Whole app; auth/route/client contracts retained |
| `src/index.html` | Relative base `./`; title 7STARSS ERP; seven-stars-mark favicon | Extend head with relative manifest, theme and touch icon | Browser install identity; root and subdirectory hosting |
| `src/assets/media/logos/seven-stars-mark.png` | Existing 768×768 branded mark | Keep source; create derivative 192/512 installation icons | Browser/OS icon; no redesign |
| Service-worker cache | None | Create explicit static app-shell and lazy packaged asset groups; no dataGroups or runtime URL caches | Cache only frontend distribution files; API/auth/uploads/reports remain network requests |
| `UserGuide/content/shared-screen-guidance.ts`, existing GuideReader | Common bilingual guidance already shown in every module guide | Extend with browser installation and connectivity/update guidance | Existing `/UserGuide/:sectionId` routes and module sidebar guide links |
| `environment.prod.ts` | Login and business API URLs use HTTP | Keep endpoints; record operational requirement | An HTTPS frontend needs reachable HTTPS APIs; correct production addresses are not supplied |

There are extensive pre-existing frontend changes. Within the edit scope, only shared-screen-guidance.ts is already modified; preserve its current entries. Source files outside this inventory, backend/database/financial behavior and hosting/deployment are excluded.

## Alternatives and frozen decisions

| Option | Trade-off | Decision |
|---|---|---|
| Manifest only | Minimal install metadata, but omits the Angular service worker described to the owner | Not selected |
| Angular service worker + manifest | Official Angular integration; static asset versioning/caching; preserves server-owned operations | Selected; use the existing NgModule root rather than changing bootstrap architecture |
| Offline data synchronization / custom install popup | New storage, concurrency and UX contracts beyond browser installation | Out of scope |

| Rule/question | Status | Evidence / exact decision |
|---|---|---|
| Install name and logo | Confirmed | Reuse current index title `7STARSS ERP` and current seven-stars-mark, rather than inventing new branding |
| Start URL and scope | Derived | Both `./`, manifest id `./`, resolving against the manifest in the application deployment directory; existing hash router selects login/authenticated home |
| Display | Confirmed | `standalone`, matching the owner-approved independent app window |
| Cache business responses? | Confirmed | No API/auth response caching or offline writes; accepted explanation says server operations require connection |
| Worker lifecycle | Derived | Production only; register after stability or 30 seconds; standard Angular updates, no forced reload or custom activation that would discard drafts |
| Dependency version | Confirmed | Lock graph uses Angular core/common 17.3.10; pin service-worker to 17.3.10, retain existing Angular declarations |
| Deployment addresses | Uncertain, operational only | HTTPS hosting and HTTPS API addresses must be verified by owner; do not guess URLs or claim deployed installation |

No Missing/Conflicting/Uncertain application contract blocks these bounded source changes. Hosting validation remains pending; this plan does not authorize deployment.

## Conformance before edits

| Concern | Owning block / reference | Existing shared owner | Target / approved exception |
|---|---|---|---|
| Provider/bootstrap | UI 1; PHASE-05 reference `src/app/app.module.ts`, `src/main.ts` | AppModule, root HttpClient and interceptors | Add one root ServiceWorkerModule import; do not add a feature client/provider or change auth |
| Browser install identity | UI 1, Master 4; index title/base and current logo | index.html and deployment root | Browser-native shell metadata; no new screen/layout/CSS/route |
| Translated usage explanation | UI 23, Master 7; GuideReaderComponent.sharedScreenGuidance | Existing typed EN/AR shared guide content | Add paired authored text; no app translation keys or alternate viewer required |
| Verification boundary | UI 29, Master 7; installed browser-builder schema | angular.json production configuration | Use Angular 17 boolean serviceWorker/ngswConfigPath schema; source-only verification |

Technical references: [Angular PWA setup](https://angular.dev/ecosystem/service-workers/getting-started), [Angular cache configuration](https://angular.dev/ecosystem/service-workers/config), [MDN install requirements](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable). Current public docs are checked against the installed Angular 17 builder/API, rather than copying newer builder configuration.

## Dependency-ordered slices and verification

1. Freeze root/runtime contract in `PWA_FRONTEND_CONTRACT_FREEZE.md` before source changes.
2. Extend dependency graph, production builder and root worker registration; create pending `ngsw-config.json`, `src/manifest.webmanifest`, and two pending PNG icons under `src/assets/icons/` (PHASE-05).
3. Extend index metadata; update the existing bilingual common guide after source reconciliation (PHASE-05).
4. Review complete scoped diff, dependency peer alignment, JSON/schema/source wiring, icon dimensions, relative URLs, static-only cache and EN/AR guide. Reconcile against the frozen contract (PHASE-06). No builds/tests/lint/browser/database commands, migrations, commits, pushes or deployment.

Owner acceptance: dependency restore and production build; serve the generated distribution on HTTPS (localhost for local acceptance), confirm manifest/worker delivery and MIME handling, install in Chrome/Edge, open standalone and sign in, exercise an existing authenticated read and save, verify subdirectory/hash navigation and existing LTR/RTL/themes/responsive behavior, save drafts before closing/reopening to accept updates. Confirm API requests are not served from the service-worker cache. Offline transactional use is not supported. No schema migration, data backfill or backend rollout is required.

Recovery: revert only the PWA changes, rebuild and serve Angular's safety-worker at the previous worker URL if retiring an already deployed worker; source reversion alone does not unregister installed browser workers. This task performs no deployment/recovery command.

Subagents are not used: this is one tightly coupled bootstrap/configuration workstream, and delegation would add context/merge overhead.

## Frozen amendment — IIS manifest delivery (before hosting-config edits)

Scoped discovery found an existing root `SiGmaAngularFrontEnd/web.config` with the established Angular rewrite rule, but no `.webmanifest` MIME mapping, and no build asset entry copying this configuration. Extend this existing hosting owner with remove + mimeMap for `.webmanifest` → `application/manifest+json`; copy only this file through an explicit Angular asset object (`glob: web.config`, `input: .`, `output: .`). This makes the production artifact concrete without running deployment steps. Preserve the existing rewrite rule; no URL/certificate/API change is authorized or inferred. Installed Angular 17 normalizeAssetPatterns permits this object and bounds its output inside the distribution directory. [Microsoft IIS MIME mapping](https://learn.microsoft.com/en-us/iis/configuration/system.webServer/staticContent/mimeMap) explains why an unmapped extension may not be served. Owner IIS delivery/permissions acceptance remains pending.

## Frozen amendment — relative worker assets (before baseHref edit)

The installed Angular 17 browser builder passes `options.baseHref ?? '/'` to augmentAppWithServiceWorker; it does not read `index.html`'s existing `./` base. Set production `baseHref: './'` explicitly, preserving the current document base while allowing Generator.joinUrls to produce `./index.html` and relative cached asset URLs. The installed worker Adapter resolves these against its registration scope. This avoids root-only worker asset URLs when the application is hosted in a subdirectory. Also exclude `/**/api/**` from navigation fallback, covering subdirectory API paths. This is a source-supported compatibility correction within the original frozen relative-launch contract; runtime root/subdirectory acceptance remains pending.
