<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-05-integration-runtime | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-05-integration-runtime.template.md -->
# PHASE 5: Integration and Runtime Wiring

Use this packet to verify that correct components, services, and backend
contracts are connected through the actual application injector and route tree.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:db2d5dcd4f3dbc77e4f04c332604833d56a556e431fea481bc432e38ce86ee9a
- master.1: ## 1. Governance and review principles | sha256:bba26ab8203f2a55202c9f85cd5fc4e71cd6e5d465358bf805edc8575d797bf0
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:4c9e7f3e0d93f66644a9b6236b233b76872e849c2c59cbe8d7ba129dfdb2900d
- master.5: ## 5. Continuous quality gates | sha256:22a0c5c673edd341f4814488c4405362453f31fadfdc199c31170d34afb8a67c
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:a775b2d3f2ca0289c0de2f614e25703ed0f000bf7040f88c9ca6b4449f5e0491
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:0997576d7fca4aebda4d975ef928463d4d113ffe3d2794a0b87a15b3826b8463
- ui.1: ## 1. Feature folders and wiring | sha256:ad82de89c39e9e8e67ce9ff67eaed8b0730e9f17c49ca572313ca7eb72016a23
- ui.2: ## 2. Service and response wrappers | sha256:e3eec86cafd87c5a06df1d69bbfe89614a7a833d980b7436691842deb62ecb55
- ui.22: ## 22. Loading, empty, error, toast | sha256:8bd52a46ac4728de8ca33b97b365aac52733903da3c36b085eed20a500d9bd94
- ui.23: ## 23. Translations | sha256:0cf1190b29df3b524017967f0fba1a4611c683b902cb344278193f5e06de1377
- ui.26: ## 26. Permissions and route access | sha256:6bc5e9101f1e4f066a22f10cc55f3a882b536a27e269bd217a93419f6f81a917
- ui.27: ## 27. Focus and keyboard | sha256:d461c40ce8c3343aebe16a6d2c478e2d030bef4fdaf7ccbeab24a1ed72191d5e
- ui.28: ## 28. Request cancellation and stale responses | sha256:f40d0dd5c8a9270e4041e5c9d0fd4bff9c4d080d4dc2ac96351117293da702f0
- ui.29: ## 29. Verification expectations | sha256:1ff1411e4cbc36bb44b06ef153a062ad0ddc7d8ca7728bdc7a3deae3ea99656e
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:cc32d45b242e8cef0a22868a97b78036141565afe1ca6452d8b02a873c4d0ada
- backend.3: ## 3. Step 3 — ViewModels | sha256:dc4664043b36410250d60f060dbdde1f6eedec94b5f6ee7a0d034410ba8d1ec8
- backend.4: ## 4. Step 4 — AutoMapper profile | sha256:f44d1e86220f2d11780e9d94370219270c183c004aef0ba39f7f9cb9e1550f11
- backend.5: ## 5. Step 5 — Interface and service | sha256:848b38b971e23945d10cb02d95cd2f94c2f3a176fe126e1a2169dca039be816d
- backend.6: ## 6. Step 6 — Controller | sha256:ef99a6dec8e52b278bc36495c5415bd445b65183e12189e02ecd9e88cee3d75e
- backend.18: ## 18. Edge cases | sha256:7e8e92333db610bb32727383aa5d94daba109a21308300d203ab54876f0f25bc

Approved wiring references:

- `SiGmaAngularFrontEnd/src/main.ts`
- `SiGmaAngularFrontEnd/src/app/app.config.ts`
- `SiGmaAngularFrontEnd/src/app/app.routes.ts`

Reference roles: `main.ts` owns the `bootstrapApplication` entry for the
standalone `AppComponent`; `app.config.ts` owns the root providers, including
the single interceptor-equipped `HttpClient` and hash-based router; and
`app.routes.ts` owns the root route tree and the transitional `AuthGuard`
access boundary from UI block 26. Existing lazy feature NgModules, including
LayoutModule, are inspected as interoperability consumers when relevant, not
copied as root composition or feature-level `HttpClient` providers.

The Master Guide and canonical pattern books are authoritative. This packet is
derivative. Stop using a packet that disagrees with canonical sources. Follow
Master block 8: run recipe `-Check` before use; reconcile initial drift or changed
book/template/manifest claims, regenerate affected packets through the generator,
semantically review their source rules and approved-reference roles, then rerun
`-Check` before use or handoff. Record packet IDs and review evidence. Preserve
unrelated changes; source-read-only review still forbids application-source edits.
Use canonical sources and report a precise blocker for unresolved conflicts.

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

Trace Master5/UI29's actual loading-speed path through route, HTTP, backend and
rendering. Record duplicate subscriptions/requests, blocking auxiliary reads,
serial dependencies, payload scope and cancellation; correct only authorized
confirmed source issues. Report comparable measured results or a pending owner
plan separately from loader visibility and cache conformance. No runtime or
database execution is authorized by this gate.

Reconcile UI22's active-route loading matrix against LoadingService, the single
shell host and effective showPageLoading. Distinguish query/fragment-only updates
from path departure and trace route reuse/legacy destinations. Preserve local
busy and write-navigation safety; do not copy Dashboard's explicit silent-page
metadata into unrelated screens or add a competing loader to mask a mismatch.
Apply UI22's general single-visible-owner precedence to actual rendered page,
auxiliary StateMessage and body-appended dialog/save hosts; one shared ring is
not evidence that two indicators cannot overlap. No per-screen opt-in or early
busy/count release is allowed as a substitute for shared visibility ownership.
Required routed initial/filter bootstrap must use the same page host, never an
inline filter loader. Trace ReferenceLookupStatus identity-lease lifecycle and
EditorDialog's projected dialog scope separately from request start/end counts;
retained-cache refresh remains silent (UI22 latest owner clarification).

Reconcile UI2 / Master5's source matrix against the final cache/topic/feedback
wiring and teardown. Record per-source exceptions and pending owner network or
runtime checks; neither a registered topic nor an imported cache owner alone
proves that the consuming screen is connected correctly.

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
