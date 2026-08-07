<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-05-integration-runtime | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-05-integration-runtime.template.md -->
# PHASE 5: Integration and Runtime Wiring

Use this packet to verify that correct components, services, and backend
contracts are connected through the actual application injector and route tree.

## Canonical provenance

- master.1: ## 1. Governance and review principles | sha256:defaefeff17c467afb2b3e953ac2eaf53d67fdc9b35b8eee12451c586bf41f33
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:714c5d1c919cb6f602abb0c15cb8c3689a83f34ec41b041b63957dd765ec8934
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:60b490244a3ad6a1ae6870eb0e8fcd0c6ea2b984f5f7af86a667ef05ac4305f2
- master.5: ## 5. Continuous quality gates | sha256:9e86071c1e6bbb5b2d7dba6270ea2a8a57b71c4750d11ac8ce4da4bfb373befb
- master.6: ## 6. Human and AI review protocol | sha256:d08192101c921bc5679d61b77c428a570961e73cbf82ef3f8807b12b036b4cd3
- ui.1: ## 1. Feature folders and wiring | sha256:16219dc5f603162eb05ef14a5e4a36d99adf9af0b8530d73108c6c8a6c92979a
- ui.2: ## 2. Service and response wrappers | sha256:6fa0394abd7f49ea6f19efcbf0f30dca568621f5250ab3b3343b7ba16a7102e9
- ui.22: ## 22. Loading, empty, error, toast | sha256:aaf83a5b0cad482ec27a4f32ed1eb874ef2b92a05dd5071080077e4db731a1e5
- ui.23: ## 23. Translations | sha256:1d159b39ed046537db86c6edffcdcd8ca30809f35761b5f19845d57e51896101
- ui.26: ## 26. Permissions and route access | sha256:33d769df2c69055e37edfd328738ca874edd65b8c285acb6443e5c3930e0f85a
- ui.27: ## 27. Focus and keyboard | sha256:c277d98ba2241885c3f0daa8c301208b9dda7d3cb6b78a0f87505cededd5abb9
- ui.28: ## 28. Request cancellation and stale responses | sha256:45d17c01d2519192de3a092e57c7deb97e2ddaf2731be82c57c11f703a36c31f
- ui.29: ## 29. Verification expectations | sha256:b99e32e1615baff70816067504b9b429ef018cbbd3b01ba210dad38d7502903e
- backend.3: ## 3. Step 3 — ViewModels | sha256:79f9d8c5c33521014de44f46fc92f499dd5dc55a5a6285457c645ec9f05c48fa
- backend.4: ## 4. Step 4 — AutoMapper profile | sha256:6c391e0baff28f36ee71120ade8c4b4fac56071722b3e2affbd6a40d71ebd941
- backend.5: ## 5. Step 5 — Interface and service | sha256:46effe8a80e3a97586b936e66b90b193a0dae4b4ec6a926e9968eb4381bc001e
- backend.6: ## 6. Step 6 — Controller | sha256:8921eeb99b61fc8c994fac1338bcddc91be4a1dc21d4e39e29282ae0c07166a9
- backend.18: ## 18. Edge cases | sha256:b78409883a1ffe3d4016644ed8b5afc92b3d48b47395c8f3c75a8117c49e69ef

Approved wiring references:

- `SiGmaAngularFrontEnd/src/app/_metronic/layout/layout.module.ts`
- `SiGmaAngularFrontEnd/src/app/app-routing.module.ts`

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
- No runtime claim is made from source inspection alone.

## Expected handoff

Phase 6 receives the route, provider, interceptor, event, compatibility, and
runtime-risk artifacts.
