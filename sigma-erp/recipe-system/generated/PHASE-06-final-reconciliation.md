<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-06-final-reconciliation | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-06-final-reconciliation.template.md -->
# PHASE 6: Final Reconciliation

Use this packet after every applicable focused phase. It is mandatory for a
broad feature review or implementation.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:2fe0acf01b412739d2297565dd978100bcac7c8274d55fe743fd7e43926e0041
- master.1: ## 1. Governance and review principles | sha256:be0dfda4d868895a3f21a5a7b453c5c944c0957932c551e82cb658f3846c392a
- master.2: ## 2. Screenshot and visual evidence policy | sha256:fe219e07a3e5573053e9a55da8a7beca5a6046a5ac173060962c52fde6d8f239
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:497fbb72e36ba99eb199d4d7f0c606827d16339c9597eeba867813f9833934bb
- master.5: ## 5. Continuous quality gates | sha256:22a0c5c673edd341f4814488c4405362453f31fadfdc199c31170d34afb8a67c
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.7: ## 7. End-to-end reconciliation and final report | sha256:502bc5e46aeafb61b14bd97878651bb2f46bc57f11f31d164759516a7e480dbb
- master.8: ## 8. Packet generation and governance | sha256:a775b2d3f2ca0289c0de2f614e25703ed0f000bf7040f88c9ca6b4449f5e0491
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:90e19839bb224a518453a2ed0ae60332160f759860e87fc977968bfb5fdd24a2
- ui.1: ## 1. Feature folders and wiring | sha256:a652d320ed28518fdd0fd8f3a3320cc12432cb88b9f2e4d6116ec47fb2acb0e9
- ui.2: ## 2. Service and response wrappers | sha256:b77bf9a3bb3cf04aa561a014e2c24ca816a679b83b29ab7da948d715f79fb260
- ui.13: ## 13. Modal with tabs | sha256:3e16a6bce55a413ca9014e0c9cc30e09026b941b07a8e074aa8e8da37f134476
- ui.20: ## 20. Report page | sha256:60cc1f81bd050093d532aec836e2b776aed48492bfae8ca2a7e4a2c5aaf8379d
- ui.21: ## 21. Report print | sha256:2a59ad13a43e02220d8645104703ef871d319a8f87489b668521306c6d3ee1f5
- ui.22: ## 22. Loading, empty, error, toast | sha256:ca04ec271de4fec9af2acc9937463577a67a5a3956d14db1b31cf966cf1b6d06
- ui.29: ## 29. Verification expectations | sha256:1ff1411e4cbc36bb44b06ef153a062ad0ddc7d8ca7728bdc7a3deae3ea99656e
- ui.30: ## 30. Backlog, by priority | sha256:89af03cfacdc32e87a2b6a93dbb3707f34026a2444cdae31880e108acd30eaab
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:0983535564fda910eb148cbb4a66079548016ce287b95a9409c7cec41974ed0a
- backend.2: ## 2. Step 2 — EF configuration | sha256:6fc404d5c366c960f1ff9292a0b9ce4b69c6825da3f4416385af0389c0ebc386
- backend.7: ## 7. ListVM scope rule | sha256:6ae3e69d94ccc02a60bd005f20020b7cd4b9f105b81afa9baf63c427cfa05caa
- backend.18: ## 18. Edge cases | sha256:8878697ea5e4b00ab272b14d83fd2091eb9cd129c168a238ab98b88bed22d2a0
- backend.19: ## 19. Backlog | sha256:794fe9f23e841587c89d71f848f75a2053cbbb544d99ec358a34e3b5b6fbbcff

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

Reconcile Master2's reference-product functional detail target through Master4's
scoped coverage rows. State matched/partial/missing details, exact decision
blockers, owner exclusions and remaining slices against final Sigma source and
guide. Completing bounded fixes is not reference equivalence; an older minimal
implementation alone cannot erase a target gap. Execution permissions stay intact.

1. Screenshot evidence ↔ implemented functional behavior.
   Reconcile Master2's analysis-guide review and original screen explanations
   with accepted Sigma contracts and the scoped result. Record actual sources,
   exclusions, conflicts, decisions and supported Not applicable outcomes; a
   generic claim that the guide was checked does not establish coverage. This
   discovery gate is separate from updating Sigma's in-app guide after changes.
   Reconcile the applicable dated sidebar/code cycle and document links through
   Master4's comparison rows: actual sources read, Sigma owners/contracts,
   accepted/excluded differences and remaining decisions. Do not count a
   frontend declaration/inferred sequence as verified server or financial behavior.
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
19. UI2's **Mandatory screen cache gate** ↔ final source for every source-matrix
    row: exact URL/envelope/feedback, classification and exception, service and
    all successful writers/dependencies/topics, finite bootstrap before watch,
    selected labels, empty-success/context reset, failure/Retry, silent refresh,
    cancellation/teardown and preserved IDs/drafts/calculations. Mark source
    evidence separately from owner network/runtime verification. Do not accept
    a cache service name or a generic "cache done" claim as reconciliation.

## Required outputs

Reconcile UI22/Master5's loading request matrix against the actual route import,
page/local/silent owner, start/finalize on success/failure/cancel/destroy,
same-path query navigation, effective shell visibility, no duplicate spinner,
and retained busy/error/Retry. Record backend per-page action enrichment query
budgets under BE7 when touched, with source improvements separate from measured
SQL/latency. Missing evidence or known unapproved source gaps prevent completion;
this gate authorizes no build, database or browser commands.

Apply UI22's single-visible-owner correction: reconcile page + lookup,
lookup-only, dialog read + background page work, and dialog save + local lookup
overlap. Shared ring adoption alone does not pass. Trace actual shell-host
suppression of routed StateMessage and modal/save foreground precedence;
preserve busy/error/Retry and keep runtime visual acceptance explicitly pending.
Confirm required initial/filter bootstrap alone still renders the page host,
with no inline filter loader, and that report/lookup completion in either order
keeps only that host until both settle. Verify identity lease destruction and
dialog-scope provider inheritance without changing cache/HTTP/write contracts.

### Reconciliation table

| Contract/path | Producer artifact | Consumer artifact | Final source evidence | Status | Required action |
|---|---|---|---|---|---|
| | | | | | |

### Scoped source review

Confirm:

- complete scoped diff reviewed;
- stale imports and types checked;
- .NET type namespaces, consumer imports/global imports, owning project references
  and source inclusion checked; producer errors distinguished from dependent errors
  using source evidence (Master5), without claiming compilation;
- routes and providers checked;
- full-width source chain reconciled against UI1/Master5: live component,
  actual shared/local geometry winners, no conflicting standard-host override,
  stable card width in empty/loading/error/populated states; UI29's sidebar,
  breakpoint/intermediate-width and direction/theme matrix records source facts
  separately from pending or performed authorized visual measurement;
- authenticated GET/mutation interceptor path checked and duplicate success
  notification ownership checked;
- translations checked;
- required screen guide created/updated and matched to final source, with
  bilingual coverage, topic identities and module guide route/menu entry;
- mappings and server-owned payload fields checked;
- screen cache source matrix reconciled against actual symbols and paths, or
  a source-supported not-applicable reason recorded (UI2 / Master5);
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
- loading-speed request/query/volume findings and scoped fixes; reproducible
  comparable before/after results or explicit pending owner measurement under
  UI29; BE2 index coverage/proposals with exact keys/INCLUDE/filter, overlap,
  read benefit, write/storage costs, disposition and schema boundary, or a
  supported no-new-index outcome (Master5/7; BE7);
- cache source classification, implementation gaps/exceptions, source evidence
  and pending owner TTL/session/notification/Retry verification;
- screen user-guide content file, route/menu entry, covered topics and source
  evidence, with owner runtime/visual/print acceptance distinguished;
- Missing, Conflicting, and Uncertain requirements;
- migration requirement;
- numeric role/precision conformance across shared controls, validators, DTOs,
  storage, calculations and readers (UI14/19; BE18), without experimental-data
  compatibility exceptions or false claims that every numeric field is a quantity;
- possible compile/runtime risks;
- verification performed and pending;
- owner manual checks;
- prohibited or owner-only commands not run.

## Completion gate

Do not report the feature complete while a Missing, Conflicting, or Uncertain
contract blocks required behavior. A clean diff check is not proof of successful
build or runtime behavior.

An omitted applicable performance matrix fails Master5's source evidence gate.
For routed/tabbed editors, reconcile UI1's actual direct-page width and UI13's
first-activation/retained-tab lifetime against final source, including direct
links, reload/identity changes, cancellation and print prerequisites. Reconcile
BE7's conditional detail/approval enrichment and any composed source query
against unchanged tenant/history, multiplicity/ambiguity and writer guards.
Pending runtime measurements under an existing source-only boundary are reported
honestly; they are not silently marked passed or treated as permission to run
forbidden commands. An index proposal is distinct from an implemented/applied
index, and a source query reduction is distinct from measured speed improvement.

For a completed authorized frontend/full-stack screen implementation, an absent
or stale in-app user guide fails the completion gate (Master7). Create or update
it after reconciling the screen and before final handoff; source-read-only and
backend-only reviews record the follow-up without out-of-scope source edits.

An omitted applicable cache source matrix or known unapproved implementation
gap fails the screen cache gate. Direct live reads with a documented source
contract are valid outcomes; this gate does not require caching every request
or permit claims of runtime verification from source inspection alone.
