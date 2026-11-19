<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-06-final-reconciliation | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-06-final-reconciliation.template.md -->
# PHASE 6: Final Reconciliation

Use this packet after every applicable focused phase. It is mandatory for a
broad feature review or implementation.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:a56c86bda3deb92b3f1892bfb6e323ae991d0aa315ba1183a531303dbf88bd06
- master.1: ## 1. Governance and review principles | sha256:4af3c22f52464c9696ac85adb7f000d9c89d1bd76ecabfffa2662030d5fa66b2
- master.2: ## 2. Screenshot and visual evidence policy | sha256:8e602319017e268b923ed2bb8b7a8d21a1a3252640f23a986d99821842ea0c6f
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:416b24a6d74c22be5d7f8d37480fab2ef17fa7ddb0d3e4f1632795ed813558d0
- master.5: ## 5. Continuous quality gates | sha256:db683d8cd9d81f554a0a9711335795c930c8e0846d9bc73fcf40f1da6084171f
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.7: ## 7. End-to-end reconciliation and final report | sha256:2b8f1fba057c9e4a3f8e7a06476c13d2f010addbd786693fda0e418a1519d760
- master.8: ## 8. Packet generation and governance | sha256:ad1ffed7bdf0b87f1c739ec1c7146a76c8a7d516f4d50e666cdeef3a7fb98b1c
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:8ee8fccad52b59f3ee3a04025d65de169c15d3dc986631ebbda114a9f8dc1e95
- ui.1: ## 1. Feature folders and wiring | sha256:c4df20098e8e79cd73612e9fb0128bfcb8c75d4390c745a8bc636906e517aa1f
- ui.2: ## 2. Service and response wrappers | sha256:f3a7b69c4ad6f7f09008f0dac6cb67b18d88fd938e2e64c568380e3b7d116bb7
- ui.13: ## 13. Modal with tabs | sha256:050c316580fb934435b1ccf4d8cf6dc0e9e1619a2dc1de523eee3c8bf1072b53
- ui.20: ## 20. Report page | sha256:e7291b279606a646d8a91194dcc297e9308ca853453b009663a89e83d0a60c5b
- ui.21: ## 21. Report print | sha256:11ea0a036c9d332fa9687d37ef1d4efe9843c0a23252c52bd60f398425fd9db6
- ui.22: ## 22. Loading, empty, error, toast | sha256:895b36e116e8ead97b444e10d6ff9fa7c127a7e6606b18ed80952387b3789974
- ui.28: ## 28. Request cancellation and stale responses | sha256:b9ee811088e53d9771459815766c135cee973724042db691a7a4444ab5408325
- ui.29: ## 29. Verification expectations | sha256:857fd2de21235042c2d3c3d8af841d8bed3580a97bed2ff1680f6a3c2c291f04
- ui.30: ## 30. Backlog, by priority | sha256:154cf976b06e9031b4063231c1f0893ff034c7b7e3c89f1bbee564712d37cf7e
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:0983535564fda910eb148cbb4a66079548016ce287b95a9409c7cec41974ed0a
- backend.2: ## 2. Step 2 — EF configuration | sha256:6fc404d5c366c960f1ff9292a0b9ce4b69c6825da3f4416385af0389c0ebc386
- backend.6: ## 6. Step 6 — Controller | sha256:f0f56867e3997a688067c5e5ec7f19070f1f4d621a0d5617e4e9639fdf74eba6
- backend.7: ## 7. ListVM scope rule | sha256:6ae3e69d94ccc02a60bd005f20020b7cd4b9f105b81afa9baf63c427cfa05caa
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:9ffa9db969ffca5f271d1d047180ffd0fa5e7416eab045c9d3688b79c88c2e12
- backend.9: ## 9. Search model and filters | sha256:4ef414b8a321331568d54b24460ed22775a51164f055f89cb217841f815639dd
- backend.18: ## 18. Edge cases | sha256:13d0548154a54a05fda8d1276d7d19529ee31b2b79d7945ab1363e7f18abb6f0
- backend.19: ## 19. Backlog | sha256:82bdfe247692ed298743d856e1dd6ac186a81e264d6197fdae04427f3a5de14b

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
8. Actions ↔ actual grants and prerequisites ↔ persisted branch capability and
   backend state ↔ post-confirmation recheck ↔ sent-write settlement and current
   read-scope refresh. Link latest findings, schema readiness and runtime
   acceptance from the authorization coverage record (UI26, Master7).
   For applicable cases, check a view-only branch on a shared definition, a
   conditional field changed by another writer, and a live reference in an
   inaccessible branch (BE8). Cover failure of an optional lookup, Escape
   before blur, success after a permission revision, and queued print at access
   expiry (UI10/16/21/28). Record what the fixture actually exercises (Master5).
   Apply Master7's authorization regression checks to the actual HTTP routes,
   denial layers, write invariants, bounded queries, nested exits and
   report/print lifetimes. Trace the fixture to the intended guard and outcome
   (BE6/8/9, UI21/28, Master5).
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
SQL/latency. Resolve known in-scope source gaps and record missing evidence.
Use Master5 for scoped local builds, affected tests and changed-file lint, and
Master7 for authorized migration creation, application and verification.
Browser execution requires its own authorization.

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

Before handoff, reconcile the applicable scenario rows under Master5/7.
Check generated-document continuation, dirty revoke/regrant and sent outcomes
against final source. Trace each regression fixture to its intended assertion.
State operation mapping, source conformance, build, behavioral execution and
runtime acceptance separately, with the exact pending step or open finding.

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
Report pending runtime measurements as pending. Use the applicable execution
authorization for each check. An index proposal is distinct from an implemented/applied
index, and a source query reduction is distinct from measured speed improvement.

For a completed authorized frontend/full-stack screen implementation, an absent
or stale in-app user guide fails the completion gate (Master7). Create or update
it after reconciling the screen and before final handoff; source-read-only and
backend-only reviews record the follow-up without out-of-scope source edits.

An omitted applicable cache source matrix or known unapproved implementation
gap fails the screen cache gate. Direct live reads with a documented source
contract are valid outcomes; this gate does not require caching every request
or permit claims of runtime verification from source inspection alone.
