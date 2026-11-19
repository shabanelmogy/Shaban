| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

# PWA frontend integration contract

Frozen before source edits under `PWA_MAINTENANCE_EVOLUTION_PLAN.md` and the owner's «تمام ضفها» instruction.

| Contract | Exact rule | Owner / consumers |
|---|---|---|
| Dependency | `@angular/service-worker` 17.3.10, matching locked core/common; maintain existing Angular/framework declarations | package.json/package-lock.json → AppModule/browser builder |
| Build | Existing Angular 17 browser builder: production `serviceWorker: true`, `ngswConfigPath: ngsw-config.json`; development remains without worker generation; copy `src/manifest.webmanifest` | angular.json → dist/sigma |
| Bootstrap | ServiceWorkerModule.register('ngsw-worker.js'), enabled in production, registerWhenStable:30000 | Existing AppModule root; existing bootstrap/interceptors untouched |
| Identity | Name 7STARSS ERP; short name 7STARSS; existing mark rendered into actual 192×192 and 512×512 PNG icons with `purpose: any` | Manifest → browser/OS installation |
| Launch | id/start_url/scope `./`; display standalone; theme #3498db and background white | Root/subdirectory hosting; existing hash routes/auth guard |
| Cache | Static packaged shell files only prefetched, remaining packaged JS/assets lazily cached; no API/auth URL patterns, no data groups; `/api/**` excluded from navigation fallback | Angular worker → static distribution assets |
| Updates | Standard Angular version handling; no automatic reload/activateUpdate while users edit | Existing app window and drafts |
| Guide | Common EN/AR explanation in existing SHARED_SCREEN_GUIDANCE shown by existing GuideReader; existing module guide routes/menu | All users |
| Authentication/API/data | Current auth, interceptors, fields, DTOs, calculations and mutations retained; requires server connectivity | Frontend/backend; no backend change or migration |
| Owner acceptance | Production build and browser install/standalone/cache behavior pending; HTTPS frontend/API hosting and static worker/manifest MIME delivery must be configured/verified | Hosting/browser owner |

No custom install prompt, toolbar button, offline business-data store, background synchronization, new route or new authorization rule is part of this handoff. Browser-provided installation UI supplies platform localization and accessibility. Grid/ListVM/editor/action tables are Not Applicable because no business screen/endpoint changes.

## Frozen amendment — existing IIS owner

Before editing web.config or its asset entry, extend the hosting contract: keep the existing rewrite rule, add a remove + mimeMap for `.webmanifest` with `application/manifest+json`, and copy the root web.config into the build output using one explicit asset object. Evidence and reason are recorded in the plan's IIS amendment. This authorizes source configuration only; production deployment and HTTPS endpoints remain owner acceptance.

## Frozen amendment — build-time relative asset identity

Production explicitly supplies `baseHref: './'` to the Angular 17 builder, matching the existing index base and generating worker asset URLs relative to its scope rather than `/`. API navigation exclusions cover root and nested deployment paths. See the plan's relative-worker amendment for installed source evidence; no existing application route or document base change is introduced.
