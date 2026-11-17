# PHASE 5: Integration and Runtime Wiring

Use this packet to verify that correct components, services, and backend
contracts are connected through the actual application injector and route tree.

## Canonical provenance

{{SOURCE_FINGERPRINTS}}

Approved wiring references:

{{APPROVED_REFERENCES}}

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
from path departure and trace route reuse/legacy destinations. Request finalizers
release departing reads; do not reset anonymous counts at NavigationStart or
NavigationEnd, which can erase retained/target requests (UI22). Preserve local
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
