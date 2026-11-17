<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-00-discovery-evidence | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-00-discovery-evidence.template.md -->
# PHASE 0: Discovery and Evidence

Use this packet before a broad Sigma feature review or implementation. It
establishes scope, evidence, UI/backend shapes, references, and the initial
contract map. It does not authorize source edits.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:a56c86bda3deb92b3f1892bfb6e323ae991d0aa315ba1183a531303dbf88bd06
- master.1: ## 1. Governance and review principles | sha256:a2ea89d19643c80d5d6fedef76e1e562333792eee34cf2eaad1e1ada1a4c47e0
- master.2: ## 2. Screenshot and visual evidence policy | sha256:8e602319017e268b923ed2bb8b7a8d21a1a3252640f23a986d99821842ea0c6f
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:416b24a6d74c22be5d7f8d37480fab2ef17fa7ddb0d3e4f1632795ed813558d0
- master.5: ## 5. Continuous quality gates | sha256:2dc0c50abbb9337e62e6ddea88ae341cfff9ff0da0849dca7f58bf304d9544d1
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:368f82a1a1e9ee0e73c3037cd8098b55137b988524ebfb828a99d6d10aeb0c55
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:8ee8fccad52b59f3ee3a04025d65de169c15d3dc986631ebbda114a9f8dc1e95
- ui.1: ## 1. Feature folders and wiring | sha256:96f5147de3041c0ab098fbd3b6005bb94b38ccde0ac890395818fdf989ca7868
- ui.2: ## 2. Service and response wrappers | sha256:c2e46bdaf00c1fbee66d6ae2c655f335e348e60efad6a972e6ed6755ea520734
- ui.22: ## 22. Loading, empty, error, toast | sha256:8a43d6f6e7adf12e07a82fdb67e8f625158509fc0f88fe8f181f4c8a9c17e4a3
- ui.29: ## 29. Verification expectations | sha256:1ff1411e4cbc36bb44b06ef153a062ad0ddc7d8ca7728bdc7a3deae3ea99656e
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:0983535564fda910eb148cbb4a66079548016ce287b95a9409c7cec41974ed0a
- backend.2: ## 2. Step 2 — EF configuration | sha256:6fc404d5c366c960f1ff9292a0b9ce4b69c6825da3f4416385af0389c0ebc386
- backend.7: ## 7. ListVM scope rule | sha256:6ae3e69d94ccc02a60bd005f20020b7cd4b9f105b81afa9baf63c427cfa05caa
- backend.18: ## 18. Edge cases | sha256:8878697ea5e4b00ab272b14d83fd2091eb9cd129c168a238ab98b88bed22d2a0

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
- Relevant analysis-guide chapters and original screen explanations reviewed
  under Master2, including applicable dated sidebar/code cycle sources, with
  existing Sigma source/contracts/user-guide topics where present.
- Directly related source.
- Master Guide.

If the scope cannot be identified from those sources, record the exact missing
route, file, contract, or business decision. Do not guess.

## Procedure

Apply Master2's reference-product functional detail target and Master4's scoped
coverage rows. Account for the relevant reference fields/groups, filters,
actions/dialogs, states, validations, document links, charges/calculations and
outputs against actual Sigma producers/consumers and guide. Partial/missing
details feed the plan; current minimal behavior alone is no exclusion. Name
exact decision blockers and owner exclusions without inventing server rules or
expanding a bounded/read-only assignment.

1. If a Maintenance / Evolution Plan applies, import its Frozen scope, target
   contracts, impact map, implementation slices, and remaining non-blocking open
   decisions. Do not redesign the target silently in Phase 0.
2. Assign each screenshot or workflow source an Evidence ID.
   Apply Master2's mandatory analysis-guide review before freezing/changing
   contracts for both new and existing screens: start at documentation
   `references/speed-analysis/README.md`, read the relevant guide/source only,
   compare Sigma evidence and record applicability, accepted items, exclusions
   and gaps. A supported Not applicable outcome is valid; tier S needs only the
   affected part. The Speed guide is not Sigma implementation/policy authority.
   Select the relevant sidebar section/screen/state and cycle slice; follow its
   literal controller/dialog/service evidence only as needed. Record snapshot
   date, source file:line/hash and kind (documented, frontend declaration,
   inferred sequence or unknown server rule), compare relevant document links
   and actions with Sigma, and complete Master4's reference-cycle rows. Local
   methods/proxies do not prove runtime/server/accounting behavior. No automatic
   collection scripts, external login or domain API calls follow this gate.
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

Include the analysis-guide source ID/chapter and original explanation in the
existing evidence rows. Separate documented behavior, declared features and
frontend declarations from inferred cycle sequences, reviewer proposals and unknown
server rules; source absence does not authorize inventing a material rule.

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
