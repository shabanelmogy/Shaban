# PHASE 5: Integration and Runtime Wiring

Use this packet to verify that correct components, services, and backend
contracts are connected through the actual application injector and route tree.

## Canonical provenance

{{SOURCE_FINGERPRINTS}}

Approved wiring references:

{{APPROVED_REFERENCES}}

The Master Guide and canonical pattern books are authoritative. This packet is
derivative. Stop and report drift when they disagree.

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

1. Trace the feature from application route to lazy child route.
2. Verify mode data and component shape agree.
3. Verify every standalone import used by the template.
4. Trace each feature service to its actual injector and `HttpClient` provider.
5. Verify token and error interceptors are applied.
6. Check service-name collisions and unintended root fallbacks.
7. Trace parent/child close, changed, save, and refresh events.
8. Verify cancellation and destruction for every subscription.
9. Check translations and overlay services are registered.
10. Inspect only direct consumers of changed models, endpoints, or shared services.
11. Verify the authenticated document is viewport-bound, every flex ancestor
    can shrink with `min-height: 0`, and `.app-content` is the only vertical
    fallback for content that cannot fit.

## Required outputs

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

- A service registered only in the root injector must not accidentally bypass
  Layout interceptors.
- Routed editors and dialog editors use the route counts defined by their shape.
- All subscriptions have destruction or cancellation behavior.
- Body-appended overlays retain feature-scoped styling and correct focus.
- Direct consumers are checked before narrowing a model or renaming a service.
- The authenticated browser document does not scroll, while tall routed content
  remains keyboard- and touch-scrollable inside `.app-content`.
- No runtime claim is made from source inspection alone.

## Expected handoff

Phase 6 receives the route, provider, interceptor, event, compatibility, and
runtime-risk artifacts.
