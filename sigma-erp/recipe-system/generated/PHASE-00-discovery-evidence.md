<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-00-discovery-evidence | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-00-discovery-evidence.template.md -->
# PHASE 0: Discovery and Evidence

Use this packet before a broad Sigma feature review or implementation. It
establishes scope, evidence, UI/backend shapes, references, and the initial
contract map. It does not authorize source edits.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:2a00e0f2004ea5c5cbd27c9a26b08bfe0599846b4a088c1e6e51a13c51123c74
- master.1: ## 1. Governance and review principles | sha256:127af0593047619ee010cc42872c85f6fb17822939fc1eb84ddc0448a1bc38d2
- master.2: ## 2. Screenshot and visual evidence policy | sha256:a34e2c67fb64586a7d135ae183ef2085e698c442fe21f0ea34059360b019c63c
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:3e4693fe20b130ccadbc096ec295c856ca45b65edce618be94f856736f679a28
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:7f9e01355e77a11d7b6ac6c30e6093397e8df8ada6489488ca1027b7d252fa03
- master.5: ## 5. Continuous quality gates | sha256:20f297601f44c6f54a86681f894a655fcd8cf1f78c852288f0654451830a50c9
- master.6: ## 6. Human and AI review protocol | sha256:4ceaecd1ec28eb3a13b14908b167b8b4c632cbdc403f7f7622324076cd3e6399
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:63f665b9264fc646a9f94d3df75f0cd421a92fd9f5e30fc68f2c119750a35972
- ui.1: ## 1. Feature folders and wiring | sha256:dd3b3e89fa9d9020882e9a3e21a196cbc3e611c579053691e626bdbb1ca5b9ee
- ui.29: ## 29. Verification expectations | sha256:75801ef0acaeae5306fd49ad2672c9791823ea01ada1cf0cbadbb76a4385048f
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:ab611bb68b93c0e7b2fe256a1fbafb30a9a2f9f6f56f397e87f1b6cf3301b3cb
- backend.18: ## 18. Edge cases | sha256:54b16261e2303ca977639276da2aa38b689d83678f06e9ceb7e6b98a307944df

Approved references, when a shape is already known:



The Master Guide and canonical pattern books are authoritative. This packet is
derivative. Stop and report drift when they disagree.

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

### Unresolved Requirements Register

| Requirement | Status | Missing source or decision | Blocked phase | Safe work that may continue |
|---|---|---|---|---|
| | | | | |

## Continuous gates

- Screenshots are never design authority.
- Absence from one screenshot is not evidence for removal.
- A visible action is not authorization evidence.
- Static screenshots provide weak state-transition evidence.
- Uncertain items are not implemented automatically.
- A required Maintenance / Evolution Plan is Frozen before implementation phases
  begin; Phase 0 reports any new evidence that would invalidate it.
- Reference modules are read-only unless explicitly scoped.

## Expected handoff

Later phases receive the manifest, relevant evidence rows, frozen upstream
contracts, unresolved requirements, and exact scoped paths. Phase 0 is complete
only when no requirement is represented as an unlabeled inference.
