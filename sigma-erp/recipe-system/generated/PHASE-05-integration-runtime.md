<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-05-integration-runtime | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-05-integration-runtime.template.md -->
# PHASE 5: Integration and Runtime Wiring

Use this packet to verify that correct components, services, and backend
contracts are connected through the actual application injector and route tree.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:3d74ae71fa7ca4d78e3061da8b59c62bf979108fe9529ec4052336a6da002034
- master.1: ## 1. Governance and review principles | sha256:ee76565b87a3e1818f4ae0b77f0d10041f5dcbb4141a72e5bae32d07adedb420
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:fa4216c7eb26b98af29e24c266026c920dafc7d1e8031d06bbd6d803dfc960a5
- master.5: ## 5. Continuous quality gates | sha256:f33275578ef4b77c78d894dc27e67da870281c9ba228f988c98f055597e026d2
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:90dac99897883d0a9d4e973f60b38f549c45b3511dfd83bd5fe3e389da1eeb04
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:8ee8fccad52b59f3ee3a04025d65de169c15d3dc986631ebbda114a9f8dc1e95
- ui.1: ## 1. Feature folders and wiring | sha256:46e816ee4d06385cb73a1e22814128b6a54c66bb0eafb81191fbf74640daab8c
- ui.2: ## 2. Service and response wrappers | sha256:3b648464835e13b2c1e982dd87e8d21a51eb8e0a0bb2ddf9b0aa26f79d56de97
- ui.22: ## 22. Loading, empty, error, toast | sha256:895b36e116e8ead97b444e10d6ff9fa7c127a7e6606b18ed80952387b3789974
- ui.23: ## 23. Translations | sha256:7460a1db2589334955d4a482c50409c1d406038456aeed8a5c8a172a3e3cc771
- ui.26: ## 26. Permissions and route access | sha256:c596611d06131eccb93219ef991100aea97a6e054678b78e350983d0c5be627f
- ui.27: ## 27. Focus and keyboard | sha256:05fab3e975ee897d37f63406d7d61e39ff6b161ae174429a7834ff9a8ab387e6
- ui.28: ## 28. Request cancellation and stale responses | sha256:74ae9fdcdf9daa83fd23f5f6d2c92c906cd9ef0ed7a78f75c01fdf9243fcfa2e
- ui.29: ## 29. Verification expectations | sha256:52e0b1f24fb7514abf8c9b14cf83b0b6099b24db1ea46c90614f92705f8d67e0
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:0983535564fda910eb148cbb4a66079548016ce287b95a9409c7cec41974ed0a
- backend.3: ## 3. Step 3 — ViewModels | sha256:933970f27dabf7974427031b8da025a0bda06fa7c341134c8f666665299bc4a6
- backend.4: ## 4. Step 4 — AutoMapper profile | sha256:f44d1e86220f2d11780e9d94370219270c183c004aef0ba39f7f9cb9e1550f11
- backend.5: ## 5. Step 5 — Interface and service | sha256:2756fc24a8a3aff7b061c8bd51716403d7c353bdfc79bd1573223eac9d5381ba
- backend.6: ## 6. Step 6 — Controller | sha256:f0f56867e3997a688067c5e5ec7f19070f1f4d621a0d5617e4e9639fdf74eba6
- backend.18: ## 18. Edge cases | sha256:ca231703f8f3eecb2ba71fb505d7d6960d9c84ae8c2a9f3e3a73847bc553c3b8

Approved wiring references:

- `SiGmaAngularFrontEnd/src/main.ts`
- `SiGmaAngularFrontEnd/src/app/app.config.ts`
- `SiGmaAngularFrontEnd/src/app/app.routes.ts`

Reference roles: `main.ts` owns the `bootstrapApplication` entry for the
standalone `AppComponent`; `app.config.ts` owns the root providers, including
the single interceptor-equipped `HttpClient` and hash-based router; and
`app.routes.ts` owns the root route tree and authentication `AuthGuard`;
the current-session child guard and explicit route/action adoption use the
shared owners and frozen contract from UI block26. Do not assume authentication
alone grants feature access or that all existing actions are already adopted.
Existing lazy feature NgModules, including
LayoutModule, are inspected as interoperability consumers when relevant, not
copied as root composition or feature-level `HttpClient` providers.

The Master Guide and canonical books are authoritative; this packet is
derivative. Run recipe `-Check` before use and follow Master8 for drift. Preserve
unrelated changes; source-read-only review still forbids application-source edits.
Each item names the block that owns its rule; this packet restates no values.

## Purpose

- Catch route, provider, interceptor, event, and async-lifecycle failures that
  local component review cannot see.
- Protect existing consumers when contracts or service identities change.

## Included concerns

- Lazy routes and route-mode data.
- Routed versus dialog editor integration.
- Standalone imports and shared module dependencies.
- Feature service registration and injector scope.
- Interceptor-enabled `HttpClient` and authentication headers.
- Shared versus feature service naming and identity.
- Dialog and toast registration.
- Translation registration.
- Parent/child events and refresh signals.
- Subscription cleanup, cancellation, and stale responses.
- Deep links, back behavior, and direct consumers of changed contracts.
- Authenticated-shell viewport sizing and single vertical-scroll ownership.

## Explicit exclusions

- Redesigning Grid or editor markup.
- Reopening frozen domain contracts without a reported conflict.
- Full-solution scans unrelated to direct consumers.

## Dependencies and input gate

Required:

- Feature Review Manifest.
- Frozen service/endpoints from Phase 1.
- Route, refresh, and event requirements from Phases 2 through 4.
- Direct consumer list for changed shared contracts.

## Procedure

For cache consumers, reconcile UI2's full adoption checklist and UI22's shared
refresh badge: one source cache/socket, exact topic/feedback/context identity,
finite bootstrap, live binding teardown and no per-screen activity indicator.

1. Trace the feature from application route to lazy child route.
2. Verify mode data and component shape agree.
3. Verify every standalone import used by the template.
4. Trace each feature service to its actual injector and `HttpClient` provider.
5. Verify token and error interceptors are applied.
6. Follow UI block 1's one-root-client contract: authenticated feature services
   use `providedIn: 'root'` and the interceptor-equipped client configured once
   in `app.config.ts`. LayoutModule and feature injectors do not provide another client.
   Reject manual Bearer headers or feature-level `provideHttpClient` forks.
7. Verify each request has one active interceptor path and each mutation has one
   success-feedback owner; a feature success after a standard mutation must not
   duplicate the global interceptor toast.
8. Check service-name collisions and unintended root fallbacks.
9. Trace parent/child close, changed, save, and refresh events.
10. Verify cancellation and destruction for every subscription.
11. Check translations and overlay services are registered.
12. Inspect only direct consumers of changed models, endpoints, or shared services.
13. Verify the authenticated document is viewport-bound, every flex ancestor
    can shrink with `min-height: 0`, the route uses the container-fill host,
    and the browser document stays fixed: the current native Sigma shell/route
    hierarchy gives each region one internal scroll owner, per block 1.

## Required outputs

- Loading-speed path: duplicate or serial requests, payload scope, measured or
  pending results (Master5 topic `05/02`, UI29).
- Loading matrix against the single shell host, route reuse and query-only
  navigation; single visible indicator; page-host bootstrap (UI22 topic `22/01`).
- Cache source matrix against final wiring and teardown (UI2 topic `02/01`).

No runtime or database execution is authorized by these outputs.

### Route and mode map

| Route/dialog | Component | Mode source | Detail ID source | Exit target | Dirty protection |
|---|---|---|---|---|---|
| | | | | | |

### Provider and interceptor map

| Service | Declared provider | Resolved injector | HttpClient configuration | Authorization header path | Risk |
|---|---|---|---|---|---|
| | | | | | |

### Event and refresh map

| Producer | Event/result | Consumer | State changed | Refresh behavior | Cleanup |
|---|---|---|---|---|---|
| | | | | | |

## Continuous gates

- Feature services resolve the one interceptor-equipped root HttpClient; there
  is no LayoutModule client, manual Authorization header or feature client fork.
- One request traverses one interceptor chain, and one successful mutation emits
  one success notification.
- Routed editors and dialog editors use the route counts defined by their shape.
- All subscriptions have destruction or cancellation behavior.
- Operational context reset clears previous rows/counts/labels and cancels
  composed export/report reads without ending the query trigger. Deferred
  confirmations capture a context revision; matching an ID alone is insufficient
  after reset. Already sent writes retain independent safety/finalization (UI28).
- Use the shared print session's cancelPending for a scheduled preparation frame
  after context invalidation; do not claim to dismiss active browser printing or
  create a feature scheduler (UI21).
- Body-appended overlays retain feature-scoped styling and correct focus.
- Direct consumers are checked before narrowing a model or renaming a service.
- Trace the live route/component → shared host/page/panel → bounded body/table
  under UI1's full-width gate. Name the winning shared/local display, flex/grid,
  alignment and width selectors; standard hosts have no feature geometry
  override. Reconcile empty/loading/error/populated states and UI29's
  sidebar/width/direction matrix; class names alone are not layout evidence.
- The browser document stays fixed; tall content remains keyboard- and
  touch-scrollable inside its owning bounded region in the current Sigma
  shell/route hierarchy (UI1), without a second outer page scroll.
- No runtime claim is made from source inspection alone.

## Expected handoff

Phase 6 receives the route, provider, interceptor, event, compatibility, and
runtime-risk artifacts.
