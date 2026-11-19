<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-00-discovery-evidence | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-00-discovery-evidence.template.md -->
# PHASE 0: Discovery and Evidence

Use this packet before a broad Sigma feature review or implementation. It
establishes scope, evidence, UI/backend shapes, references, and the initial
contract map. It does not authorize source edits.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:db2d5dcd4f3dbc77e4f04c332604833d56a556e431fea481bc432e38ce86ee9a
- master.1: ## 1. Governance and review principles | sha256:bba26ab8203f2a55202c9f85cd5fc4e71cd6e5d465358bf805edc8575d797bf0
- master.2: ## 2. Screenshot and visual evidence policy | sha256:2765a62adfb7b5913db822c98348b3a456a6ee504e8ed4d2434881a593cf41f5
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:4c9e7f3e0d93f66644a9b6236b233b76872e849c2c59cbe8d7ba129dfdb2900d
- master.5: ## 5. Continuous quality gates | sha256:22a0c5c673edd341f4814488c4405362453f31fadfdc199c31170d34afb8a67c
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:a775b2d3f2ca0289c0de2f614e25703ed0f000bf7040f88c9ca6b4449f5e0491
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:0997576d7fca4aebda4d975ef928463d4d113ffe3d2794a0b87a15b3826b8463
- ui.1: ## 1. Feature folders and wiring | sha256:ad82de89c39e9e8e67ce9ff67eaed8b0730e9f17c49ca572313ca7eb72016a23
- ui.2: ## 2. Service and response wrappers | sha256:e3eec86cafd87c5a06df1d69bbfe89614a7a833d980b7436691842deb62ecb55
- ui.22: ## 22. Loading, empty, error, toast | sha256:8bd52a46ac4728de8ca33b97b365aac52733903da3c36b085eed20a500d9bd94
- ui.29: ## 29. Verification expectations | sha256:1ff1411e4cbc36bb44b06ef153a062ad0ddc7d8ca7728bdc7a3deae3ea99656e
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:cc32d45b242e8cef0a22868a97b78036141565afe1ca6452d8b02a873c4d0ada
- backend.2: ## 2. Step 2 — EF configuration | sha256:6fc404d5c366c960f1ff9292a0b9ce4b69c6825da3f4416385af0389c0ebc386
- backend.7: ## 7. ListVM scope rule | sha256:b68f8028f7c2042a1f89c5d5dd3cb317d9fa81289474d1722ba708643d462d3f
- backend.18: ## 18. Edge cases | sha256:7e8e92333db610bb32727383aa5d94daba109a21308300d203ab54876f0f25bc

Approved references, when a shape is already known:



The Master Guide and canonical pattern books are authoritative. This packet is
derivative. Stop using a packet that disagrees with canonical sources. Follow
Master block 8: run recipe `-Check` before use; reconcile initial drift or changed
book/template/manifest claims, regenerate affected packets through the generator,
semantically review their source rules and approved-reference roles, then rerun
`-Check` before use or handoff. Record packet IDs and review evidence. Preserve
unrelated changes; source-read-only review still forbids application-source edits.
Use canonical sources and report a precise blocker for unresolved conflicts.

## Purpose

- Define one review boundary.
- Separate evidence from inference.
- Select one approved reference per shape.
- Expose missing or conflicting contracts before implementation.
- Produce inputs that later phase reviewers can trust.

## Included concerns

- User request, screenshots, videos, and written notes.
- Feature routes, components, services, models, endpoints, mappings, entities,
  persistence configuration, translations, and direct shared dependencies.
- List, editor, dialog, report, aggregate, and action shapes.
- Existing working-tree changes in the scoped files.
- Action inventory and known authentication/authorization mechanism.

## Explicit exclusions

- Implementing fixes.
- Choosing a component from screenshot appearance.
- Inventing fields, endpoints, permissions, or state transitions.
- Full-solution scanning or unrelated architectural review.

## Dependencies and input gate

Required inputs:

- Requested feature and outcome.
- Frozen Maintenance / Evolution Plan when the Master Guide requires one.
- All supplied evidence.
- Directly related source.
- Master Guide.

If the scope cannot be identified from those sources, record the exact missing
route, file, contract, or business decision. Do not guess.

## Procedure

1. If a Maintenance / Evolution Plan applies, import its Frozen scope, target
   contracts, impact map, implementation slices, and remaining non-blocking open
   decisions. Do not redesign the target silently in Phase 0.
2. Assign each screenshot or workflow source an Evidence ID.
3. Record known screen, mode, role, locale, direction, viewport, date/version,
   and whether it is current or historical.
4. Extract only functional and content requirements.
5. Classify every item as Explicit, Strong inference, or Uncertain.
6. Inventory direct source producers and consumers.
7. Select the simplest applicable UI shapes and backend pattern.
8. Select one approved reference per shape.
9. Create the initial column, filter, detail/write, action, and route contracts.
10. Mark every row Confirmed, Derived, Missing, Conflicting, or Uncertain.
11. Select the later phases required by the feature.

For every in-scope screen, complete UI2's **Mandatory screen cache gate** during
this discovery. Inventory the actual lookup/settings/operational URLs before
implementation, classify each from its source contract and record its service,
writers, topic, finite bootstrap, watcher and exception evidence. Use the table
below in the current review/contract; do not create a separate artifact for a
small task. No applicable sources requires an explicit reason, not an omitted row.

## Required outputs

### Feature Review Manifest

| Item | Decision or evidence |
|---|---|
| Requested outcome | |
| Source scope | |
| Existing user changes | |
| Maintenance / Evolution Plan | Not required / Frozen artifact / Blocked |
| UI shapes | |
| Backend pattern | |
| Approved references | |
| Routes and modes | |
| Endpoints | |
| Actions | |
| Permission mechanism | |
| Screen cache gate (UI2 / Master5) | Source matrix location, or explicit not-applicable evidence |
| Loading conformance (UI22 / Master5) | Actual route/component, per-operation global/local/silent owner, request lifecycle/visibility evidence |
| Load-speed/query/index gate (Master5; UI29; BE7/2) | Actual request/query/volume inventory, baseline evidence or pending owner plan, candidate index coverage/risks |
| Applicable phases | |
| Explicit exclusions | |
| Unresolved requirements | |

### Functional Evidence Table

| Evidence | Classification | Required feature behavior | Owning phase | Guide-compliant implementation |
|---|---|---|---|---|
| | | | | |

### Grid evidence, when applicable

| Visible label | Proposed field | Source DTO field | Display transformation | Filterable | Sortable | Exported | Confidence |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Load-speed, query and index evidence (Master5; UI29; BE7/2)

| Route/trigger and actual producer/consumer | Requests/query boundaries, volume and suspected bottleneck | Confirmed fix or preserved contract | Comparable baseline/after evidence or pending measurement plan | Existing index coverage and supported proposal/cost or justified none | Status, acceptance target/evidence and owner follow-up |
|---|---|---|---|---|---|
| | | | | | |

Use the current feature artifact. Source inspection is mandatory but does not
establish measured latency or authorize runtime/database commands. Include
initial open, paging/search/detail and relevant action/report/export paths;
preserve feature-specific contracts and classify uncertain evidence explicitly.

### Unresolved Requirements Register

| Requirement | Status | Missing source or decision | Blocked phase | Safe work that may continue |
|---|---|---|---|---|
| | | | | |

### Screen cache adoption evidence (UI2 / Master5)

Also record UI22's loading request/visibility matrix in the same review. Trace
the actual route import (including reused workspaces and legacy aliases), not
the apparent feature folder. Classify page/list/detail/save/action/export versus
auxiliary lookup/dialog and explicit silent reads; no implicit exemption or new
loader. UI22 owns same-path query navigation and path-departure reset semantics.

| Exact URL and envelope | Classification, evidence and exception reason | Source service, writers/dependencies and topic | Finite read, watch and teardown | Failure/Retry, scope, selected labels and draft evidence | Final status and pending verification |
|---|---|---|---|---|---|
| | | | | | |

Keep eligible reference cache, explicit singleton exceptions and direct live
reads distinct. A source service name, BaseService inheritance or cache service
injection alone does not prove adoption. Do not enable new sources or cache
operational quantities, candidates, posting eligibility or currency precision
because their endpoint name resembles GetSelect. UI2 owns exact eligibility.

## Continuous gates

- Screenshots are never design authority.
- Absence from one screenshot is not evidence for removal.
- A visible action is not authorization evidence.
- Static screenshots provide weak state-transition evidence.
- Uncertain items are not implemented automatically.
- A required Maintenance / Evolution Plan is Frozen before implementation phases
  begin; Phase 0 reports any new evidence that would invalidate it.
- Reference modules are read-only unless explicitly scoped.
- The cache source matrix is part of the handoff; unresolved material cache
  contracts block only their affected work. Source-only review records defects
  without editing application source or demanding unauthorized runtime checks.

## Expected handoff

Later phases receive the manifest, relevant evidence rows, frozen upstream
contracts, unresolved requirements, and exact scoped paths. Phase 0 is complete
only when no requirement is represented as an unlabeled inference.
