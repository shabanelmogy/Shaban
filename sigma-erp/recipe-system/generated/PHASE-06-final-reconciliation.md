<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-06-final-reconciliation | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-06-final-reconciliation.template.md -->
# PHASE 6: Final Reconciliation

Use this packet after every applicable focused phase. It is mandatory for a
broad feature review or implementation.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:38d22849a6d25f64baa38c14562b4c85f08b29199ca287825471c3cfdacaf0e7
- master.1: ## 1. Governance and review principles | sha256:3e69ec4d48c952286dea7792d9e442d37585c15446b7ef02531c8a54053558cf
- master.2: ## 2. Screenshot and visual evidence policy | sha256:2765a62adfb7b5913db822c98348b3a456a6ee504e8ed4d2434881a593cf41f5
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:2d02535a738d0a1e03f44f22ff5ac7028554bc00cf9e8517245d3cf9e4c5811e
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:542c18b6aebf46ed0eef2c290f184e04de0eea49bea5d148c7e423b05f7259c7
- master.5: ## 5. Continuous quality gates | sha256:f58faeabf6c2409c74fefb2ab8bffe86ad0dfc6f4042220c4425e07697d4e22f
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.7: ## 7. End-to-end reconciliation and final report | sha256:19e4710cabe88f26cc45a10219fc9e19830eae0d722ca8c6e4bdbbf4ac28524a
- master.8: ## 8. Packet generation and governance | sha256:685e9463fc13be9a9d9d7ed261ee88f5aee17f3ded08472af4daf0587aa945b1
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:1ee143e6e852683c791622ef3af32d881d057bf39cd40e075837d578707c646b
- ui.20: ## 20. Report page | sha256:e68baa186207f64540980a66dad922d5a8d0fdb79e16710e79ea4b53c4008558
- ui.21: ## 21. Report print | sha256:2e6cc0be29f3d57b6207c5519aee74fa6b30576e92a4b79312fee0f6deafe171
- ui.29: ## 29. Verification expectations | sha256:e167960f8e5261f686e1f814e7b72c810aa26533fe5b419607c8f709429be865
- ui.30: ## 30. Backlog, by priority | sha256:40f660b87620c32c9dc93dad29af8974f968dc210f6957179c41d6a4023d0fca
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:8a1b6fc2fa0bedff7a3245f9b349945a955c10cfa4a4fc4c76896841aab53cdc
- backend.18: ## 18. Edge cases | sha256:ac57e18f32891be679ab03e00c127257a4f54d2fbae1fa05863723837b0edc77
- backend.19: ## 19. Backlog | sha256:b7b2b40c39735d0f149c7df2b3280c32f8c2cb0fdc04b425cd0bafa3a8c1af30

Approved references used by prior phases:



The Master Guide and canonical pattern books are authoritative. This packet is
derivative. Stop using a packet that disagrees with canonical sources. Follow
Master block 8: run recipe `-Check` before use; reconcile initial drift or changed
book/template/manifest claims, regenerate affected packets through the generator,
semantically review their source rules and approved-reference roles, then rerun
`-Check` before use or handoff. Record packet IDs and review evidence. Preserve
unrelated changes; source-read-only review still forbids application-source edits.
Use canonical sources and report a precise blocker for unresolved conflicts.

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
- Required in-app screen user-guide creation/update and final-source content
  reconciliation (Master7, Screen user guide completion gate).
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
15. Successful mutations ↔ exactly one success-feedback owner; composite
    workflows suppress the interceptor before emitting a feature-owned final toast.
16. When a Maintenance / Evolution Plan was required, final source ↔ Frozen plan
    target contracts, implementation slices, migration/compatibility decisions,
    and verification matrix.
17. For reports, Phase 2's UI 20 evidence ↔ final request/backend slicing/counts,
    totals and complete print/Excel scope, conditional FormGroup/busy/validation,
    applied filters, effective bucket labels and single error owner. UI 21 owns
    print preparation. Name actual symbols; report findings/Uncertain evidence
    separately from pending runtime acceptance instead of repeating "Matched".
18. Completed screens ↔ owning module user-guide topics, EN/AR task steps,
    actions/states and actual business/financial constraints; content file,
    reader registration and module sidebar guide entry are present as needed.
    Follow Master7's scope boundaries for read-only/backend-only and partial
    phase handoffs; update an existing topic instead of duplicating it.

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
- authenticated GET/mutation interceptor path checked and duplicate success
  notification ownership checked;
- translations checked;
- required screen guide created/updated and matched to final source, with
  bilingual coverage, topic identities and module guide route/menu entry;
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
- screen user-guide content file, route/menu entry, covered topics and source
  evidence, with owner runtime/visual/print acceptance distinguished;
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

For a completed authorized frontend/full-stack screen implementation, an absent
or stale in-app user guide fails the completion gate (Master7). Create or update
it after reconciling the screen and before final handoff; source-read-only and
backend-only reviews record the follow-up without out-of-scope source edits.
