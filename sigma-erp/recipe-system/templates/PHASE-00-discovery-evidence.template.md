# PHASE 0: Discovery and Evidence

Use this packet before a broad Sigma feature review or implementation. It
establishes scope, evidence, UI/backend shapes, references, and the initial
contract map. It does not authorize source edits.

## Canonical provenance

{{SOURCE_FINGERPRINTS}}

Approved references, when a shape is already known:

{{APPROVED_REFERENCES}}

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
