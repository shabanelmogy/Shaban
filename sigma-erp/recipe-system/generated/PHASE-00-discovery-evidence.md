<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-00-discovery-evidence | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-00-discovery-evidence.template.md -->
# PHASE 0: Discovery and Evidence

Use this packet before a broad Sigma feature review or implementation. It
establishes scope, evidence, UI/backend shapes, references, and the initial
contract map. It does not authorize source edits.

## Canonical provenance

- master.1: ## 1. Governance and review principles | sha256:defaefeff17c467afb2b3e953ac2eaf53d67fdc9b35b8eee12451c586bf41f33
- master.2: ## 2. Screenshot and visual evidence policy | sha256:518b4536a222d1c0c8cdd6265af603ede18ef9742a98d423ad525dfcf9f486ec
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:cb0e817775ee1e443e9e191621b36169934a1b9efd398086fe06a3c3943d91f4
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:ad0c7c462af621944990cb16fd7bc8047ad6d4916af64faa0db5a191d8d15546
- master.5: ## 5. Continuous quality gates | sha256:7670c6f18eccb6140087efbd98986043b801baad7d2b31c0f8f739392f2228f5
- master.6: ## 6. Human and AI review protocol | sha256:e320d98cc6bfafa91e975d9a71eb6e932983db68f7ad93d378f99f6ddece800f
- ui.1: ## 1. Feature folders and wiring | sha256:892d2ac3ae19a8b65346bc151efcfd78b5a8f0c9b611e55206b92656e37b8aa6
- ui.29: ## 29. Verification expectations | sha256:b99e32e1615baff70816067504b9b429ef018cbbd3b01ba210dad38d7502903e
- backend.18: ## 18. Edge cases | sha256:b78409883a1ffe3d4016644ed8b5afc92b3d48b47395c8f3c75a8117c49e69ef

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
- All supplied evidence.
- Directly related source.
- Master Guide.

If the scope cannot be identified from those sources, record the exact missing
route, file, contract, or business decision. Do not guess.

## Procedure

1. Assign each screenshot or workflow source an Evidence ID.
2. Record known screen, mode, role, locale, direction, viewport, date/version,
   and whether it is current or historical.
3. Extract only functional and content requirements.
4. Classify every item as Explicit, Strong inference, or Uncertain.
5. Inventory direct source producers and consumers.
6. Select the simplest applicable UI shapes and backend pattern.
7. Select one approved reference per shape.
8. Create the initial column, filter, detail/write, action, and route contracts.
9. Mark every row Confirmed, Derived, Missing, Conflicting, or Uncertain.
10. Select the later phases required by the feature.

## Required outputs

### Feature Review Manifest

| Item | Decision or evidence |
|---|---|
| Requested outcome | |
| Source scope | |
| Existing user changes | |
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
- Reference modules are read-only unless explicitly scoped.

## Expected handoff

Later phases receive the manifest, relevant evidence rows, frozen upstream
contracts, unresolved requirements, and exact scoped paths. Phase 0 is complete
only when no requirement is represented as an unlabeled inference.
