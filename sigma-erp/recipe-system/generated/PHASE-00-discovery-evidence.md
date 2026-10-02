<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-00-discovery-evidence | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-00-discovery-evidence.template.md -->
# PHASE 0: Discovery and Evidence

Use this packet before a broad Sigma feature review or implementation. It
establishes scope, evidence, UI/backend shapes, references, and the initial
contract map. It does not authorize source edits.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:e091f8715bd45438f4c58030c4b56015b25567c6a0541c233340321b522d916a
- master.1: ## 1. Governance and review principles | sha256:3e69ec4d48c952286dea7792d9e442d37585c15446b7ef02531c8a54053558cf
- master.2: ## 2. Screenshot and visual evidence policy | sha256:2765a62adfb7b5913db822c98348b3a456a6ee504e8ed4d2434881a593cf41f5
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:2d02535a738d0a1e03f44f22ff5ac7028554bc00cf9e8517245d3cf9e4c5811e
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:542c18b6aebf46ed0eef2c290f184e04de0eea49bea5d148c7e423b05f7259c7
- master.5: ## 5. Continuous quality gates | sha256:f58faeabf6c2409c74fefb2ab8bffe86ad0dfc6f4042220c4425e07697d4e22f
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:681863fa27d60be8922ee563bd76488b459947d5d0497e478de2ef748bb2abed
- ui.1: ## 1. Feature folders and wiring | sha256:0199f7c682b9dcfd8c3db876787322c06e105cd81f70b6d4ea17f06dcb46e408
- ui.29: ## 29. Verification expectations | sha256:e167960f8e5261f686e1f814e7b72c810aa26533fe5b419607c8f709429be865
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:73c6e842f2a188bb1fc2ca3391756683ac7fca9cd64c805e229c02ae7ce03bb5
- backend.18: ## 18. Edge cases | sha256:a485f6c78402f9f0717d03164ce3fcccd4a7ea449c0352b381fd6aa77e88c108

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
