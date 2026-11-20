<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-00-discovery-evidence | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-00-discovery-evidence.template.md -->
# PHASE 0: Discovery and Evidence

Use this packet before a broad Sigma feature review or implementation. It
establishes scope, evidence, UI/backend shapes, references, and the initial
contract map. It does not authorize source edits.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:223e1233ba9b050b21a1052d8210300a3a7bacb57cf9c2a7c66c63b6adc1ecfe
- master.1: ## 1. Governance and review principles | sha256:4af3c22f52464c9696ac85adb7f000d9c89d1bd76ecabfffa2662030d5fa66b2
- master.2: ## 2. Screenshot and visual evidence policy | sha256:817eed9bcf1b6e55bd4e485e0297ade2bec072fb8360fd8fb8db49d918c10256
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:416b24a6d74c22be5d7f8d37480fab2ef17fa7ddb0d3e4f1632795ed813558d0
- master.5: ## 5. Continuous quality gates | sha256:e332beddb8ee63faeea534279ce185f91f103e03d24514943b975a169f4ee748
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:23f6c66d0152b21977b8ec2695c4977ceb4855a56eb4b6c54ab68ee43ee46741
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:8ee8fccad52b59f3ee3a04025d65de169c15d3dc986631ebbda114a9f8dc1e95
- ui.1: ## 1. Feature folders and wiring | sha256:c4df20098e8e79cd73612e9fb0128bfcb8c75d4390c745a8bc636906e517aa1f
- ui.2: ## 2. Service and response wrappers | sha256:f3a7b69c4ad6f7f09008f0dac6cb67b18d88fd938e2e64c568380e3b7d116bb7
- ui.22: ## 22. Loading, empty, error, toast | sha256:895b36e116e8ead97b444e10d6ff9fa7c127a7e6606b18ed80952387b3789974
- ui.29: ## 29. Verification expectations | sha256:6c21866c90433891845de658cac061fb8d3a52a778698f1e9f69686f5846e0cf
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:0983535564fda910eb148cbb4a66079548016ce287b95a9409c7cec41974ed0a
- backend.2: ## 2. Step 2 — EF configuration | sha256:6fc404d5c366c960f1ff9292a0b9ce4b69c6825da3f4416385af0389c0ebc386
- backend.7: ## 7. ListVM scope rule | sha256:6ae3e69d94ccc02a60bd005f20020b7cd4b9f105b81afa9baf63c427cfa05caa
- backend.18: ## 18. Edge cases | sha256:13d0548154a54a05fda8d1276d7d19529ee31b2b79d7945ab1363e7f18abb6f0

Approved references, when a shape is already known:



The Master Guide and canonical books are authoritative; this packet is
derivative. Run recipe `-Check` before use and follow Master8 for drift. Preserve
unrelated changes; source-read-only review still forbids application-source edits.
Each step names the block that owns its rule; this packet restates no values.

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
- Analysis-guide sources under Master2 (Speed guide/explanation, dated
  sidebar/code cycle, then pinned Odoo for gaps).
- Directly related source.
- Master Guide.

If the scope cannot be identified from those sources, record the exact missing
route, file, contract, or business decision. Do not guess.

## Procedure

Apply Master2's reference-product functional detail target and Master4's
coverage rows; current minimal behavior is not an exclusion, and no server rule
is invented.

1. If a Maintenance / Evolution Plan applies, import its Frozen scope, target
   contracts, impact map, implementation slices, and remaining non-blocking open
   decisions. Do not redesign the target silently in Phase 0.
2. Assign each screenshot or workflow source an Evidence ID.
   Apply Master2's analysis-guide gate and Master4's reference-cycle rows before
   freezing or changing contracts (tier S: the affected part only). Frontend
   declarations do not prove server, accounting or permission rules; this gate
   authorizes no collection script or external call.
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

For every in-scope screen, complete UI2's mandatory screen cache gate (topic
`02/01`) and UI22's loading gate (topic `22/01`) in the current review; an
empty matrix needs an explicit reason.

## Required outputs

### Feature Review Manifest

| Item | Decision or evidence |
|---|---|
| Requested outcome | |
| Source scope | |
| Existing user changes | |
| Maintenance / Evolution Plan | Not required / Frozen artifact / Blocked |
| Analysis-guide review (Master2/4) | Chapter and original source IDs/links actually read, Sigma comparison, applicability, accepted items and gaps, or supported Not applicable |
| Sidebar/code cycle comparison (Master2/4) | Relevant snapshot/section/state/controller/service and file:line evidence, document links/actions, actual Sigma comparison and disposition; supported Not applicable when appropriate |
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

Include analysis-guide source IDs and keep documented behavior, frontend
declarations, inferred sequence and unknown server rules distinct (Master2).

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

Owner: Master5 topic `05/02`. Source inspection does not establish measured
latency or authorize runtime/database commands.

### Unresolved Requirements Register

| Requirement | Status | Missing source or decision | Blocked phase | Safe work that may continue |
|---|---|---|---|---|
| | | | | |

### Screen cache adoption evidence (UI2 / Master5)

Record UI22's loading request/visibility matrix in the same review (topic
`22/01`), tracing the actual route import.

| Exact URL and envelope | Classification, evidence and exception reason | Source service, writers/dependencies and topic | Finite read, watch and teardown | Failure/Retry, scope, selected labels and draft evidence | Final status and pending verification |
|---|---|---|---|---|---|
| | | | | | |

UI2 owns cache eligibility and the classification values (topic `02/01`).

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
