<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-06-final-reconciliation | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-06-final-reconciliation.template.md -->
# PHASE 6: Final Reconciliation

Use this packet after every applicable focused phase. It is mandatory for a
broad feature review or implementation.

## Canonical provenance

- master.1: ## 1. Governance and review principles | sha256:defaefeff17c467afb2b3e953ac2eaf53d67fdc9b35b8eee12451c586bf41f33
- master.2: ## 2. Screenshot and visual evidence policy | sha256:82edca7271355f11049971f73e80f31d1f54e108c5a00906e5c0e4f9124f04ab
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:714c5d1c919cb6f602abb0c15cb8c3689a83f34ec41b041b63957dd765ec8934
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:60b490244a3ad6a1ae6870eb0e8fcd0c6ea2b984f5f7af86a667ef05ac4305f2
- master.5: ## 5. Continuous quality gates | sha256:9e86071c1e6bbb5b2d7dba6270ea2a8a57b71c4750d11ac8ce4da4bfb373befb
- master.6: ## 6. Human and AI review protocol | sha256:d08192101c921bc5679d61b77c428a570961e73cbf82ef3f8807b12b036b4cd3
- master.7: ## 7. End-to-end reconciliation and final report | sha256:39f99be29bfd0892e5c78fc64960b02c7e77c9b2f80788e8aeb9401de2c24b11
- master.8: ## 8. Packet generation and governance | sha256:7736123a9df1cfd5757234fd7011b2eea7ac56e91f3c63903cf2090ce09c06fa
- ui.29: ## 29. Verification expectations | sha256:b99e32e1615baff70816067504b9b429ef018cbbd3b01ba210dad38d7502903e
- ui.30: ## 30. Backlog, by priority | sha256:aca3bfd32544d27bbb0309c0476250b2b2d80b5eca4b41f20d43d9717aac7ea1
- backend.18: ## 18. Edge cases | sha256:b78409883a1ffe3d4016644ed8b5afc92b3d48b47395c8f3c75a8117c49e69ef
- backend.19: ## 19. Backlog | sha256:59fba706fd5f9c9a04f1796ea6b0fcf03727428c95a3eba5f712326ffda0fd55

Approved references used by prior phases:



The Master Guide and canonical pattern books are authoritative. This packet is
derivative. Stop and report drift when they disagree.

## Purpose

- Prove that focused phase outputs describe one coherent feature.
- Detect end-to-end failures that no isolated phase owns completely.
- Review the complete scoped diff and report verification honestly.

## Included concerns

- All applicable phase artifacts.
- Final source contracts and scoped diff.
- Evidence coverage and unresolved requirements.
- Frontend/backend consistency.
- Route, provider, action, refresh, upload, and error paths.
- Continuous quality gates.
- Migration, compatibility, compile/runtime risk, and owner verification.

## Explicit exclusions

- New unrelated refactors.
- Implementing Uncertain requirements.
- Accepting a phase-local result without cross-phase comparison.
- Claiming build, browser, runtime, or database verification that did not occur.

## Dependencies and input gate

Required:

- Phase 0 manifest and evidence register.
- Every applicable phase output.
- Final scoped source state.
- Known pre-existing user changes.

A changed upstream contract marks affected downstream artifacts stale. Reconcile
or rerun them before completion.

## Mandatory comparisons

1. Screenshot evidence ↔ implemented functional behavior.
2. Grid columns/action needs ↔ frontend list model ↔ backend ListVM.
3. Filter controls ↔ query keys ↔ backend exact lookup keys.
4. Page request ↔ total count ↔ response metadata ↔ pager state.
5. View fields ↔ Detail DTO.
6. Form controls ↔ Add/Update DTOs ↔ server ownership.
7. Save ↔ validation ↔ persistence/transaction ↔ close and refresh.
8. Actions ↔ backend authorization/state ↔ confirmation/input ↔ recovery.
9. Service failures ↔ component handling for both failure channels.
10. Routes/modes ↔ editor shape and dirty exit.
11. Upload UI ↔ storage and cleanup contract.
12. Translation keys ↔ English and Arabic.
13. Styles ↔ local ownership, accessibility, RTL, theme, and responsive rules.
14. Providers ↔ interceptor-enabled `HttpClient` and authentication path.

## Required outputs

### Reconciliation table

| Contract/path | Producer artifact | Consumer artifact | Final source evidence | Status | Required action |
|---|---|---|---|---|---|
| | | | | | |

### Scoped source review

Confirm:

- complete scoped diff reviewed;
- stale imports and types checked;
- routes and providers checked;
- translations checked;
- mappings and server-owned payload fields checked;
- merge markers and whitespace checked;
- unrelated user changes preserved;
- reference modules unchanged unless explicitly scoped.

### Final report

Report:

- files changed;
- phases applied and skipped with reasons;
- decisions and evidence;
- frontend, backend, contract, mapping, and calculation changes;
- action and refresh behavior;
- Missing, Conflicting, and Uncertain requirements;
- migration requirement;
- possible compile/runtime risks;
- verification performed and pending;
- owner manual checks;
- prohibited or owner-only commands not run.

## Completion gate

Do not report the feature complete while a Missing, Conflicting, or Uncertain
contract blocks required behavior. A clean diff check is not proof of successful
build or runtime behavior.
