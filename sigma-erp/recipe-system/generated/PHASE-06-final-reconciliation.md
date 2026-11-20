<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-06-final-reconciliation | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-06-final-reconciliation.template.md -->
# PHASE 6: Final Reconciliation

Use this packet after every applicable focused phase. It is mandatory for a
broad feature review or implementation. It is a checklist: each item names the
block that owns the rule. Read that block (or its topic file) for the rule
itself; this packet restates no values.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:223e1233ba9b050b21a1052d8210300a3a7bacb57cf9c2a7c66c63b6adc1ecfe
- master.1: ## 1. Governance and review principles | sha256:4af3c22f52464c9696ac85adb7f000d9c89d1bd76ecabfffa2662030d5fa66b2
- master.2: ## 2. Screenshot and visual evidence policy | sha256:817eed9bcf1b6e55bd4e485e0297ade2bec072fb8360fd8fb8db49d918c10256
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:416b24a6d74c22be5d7f8d37480fab2ef17fa7ddb0d3e4f1632795ed813558d0
- master.5: ## 5. Continuous quality gates | sha256:e332beddb8ee63faeea534279ce185f91f103e03d24514943b975a169f4ee748
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.7: ## 7. End-to-end reconciliation and final report | sha256:2b8f1fba057c9e4a3f8e7a06476c13d2f010addbd786693fda0e418a1519d760
- master.8: ## 8. Packet generation and governance | sha256:d21cd155e9041bfdac3d153a52d6941147d10be5a89e67c19ab748ba1166caa1
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:8ee8fccad52b59f3ee3a04025d65de169c15d3dc986631ebbda114a9f8dc1e95
- ui.1: ## 1. Feature folders and wiring | sha256:c4df20098e8e79cd73612e9fb0128bfcb8c75d4390c745a8bc636906e517aa1f
- ui.2: ## 2. Service and response wrappers | sha256:f3a7b69c4ad6f7f09008f0dac6cb67b18d88fd938e2e64c568380e3b7d116bb7
- ui.13: ## 13. Modal with tabs | sha256:050c316580fb934435b1ccf4d8cf6dc0e9e1619a2dc1de523eee3c8bf1072b53
- ui.20: ## 20. Report page | sha256:256fc4284c259506cf1fc225bfad10dd36d5dee3ecfb11b5a5029340a8edeedb
- ui.21: ## 21. Report print | sha256:11ea0a036c9d332fa9687d37ef1d4efe9843c0a23252c52bd60f398425fd9db6
- ui.22: ## 22. Loading, empty, error, toast | sha256:895b36e116e8ead97b444e10d6ff9fa7c127a7e6606b18ed80952387b3789974
- ui.28: ## 28. Request cancellation and stale responses | sha256:b9ee811088e53d9771459815766c135cee973724042db691a7a4444ab5408325
- ui.29: ## 29. Verification expectations | sha256:6c21866c90433891845de658cac061fb8d3a52a778698f1e9f69686f5846e0cf
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



The Master Guide and canonical books are authoritative; this packet is
derivative. Run recipe `-Check` before use and follow Master8 for drift. Preserve
unrelated changes; source-read-only review still forbids application-source edits.

## Purpose

- Prove that focused phase outputs describe one coherent feature.
- Detect end-to-end failures that no isolated phase owns completely.
- Review the complete scoped diff and report verification honestly (Master7).

## Included concerns

- All applicable phase artifacts.
- Final source contracts and scoped diff.
- Evidence coverage and unresolved requirements.
- Frontend/backend consistency.
- Route, provider, action, refresh, upload, and error paths.
- Continuous quality gates (Master5).
- In-app screen user guide (Master7, "Screen user guide completion gate").
- Migration, compile/runtime risk, and owner verification.

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

Record each as match, finding or Uncertain, with actual symbols.

| # | Comparison | Owner |
|---|---|---|
| 0 | Reference-product functional detail target and coverage rows (matched/partial/missing/blocked/excluded) | Master2, Master4 |
| 1 | Screenshot evidence, analysis guide and dated sidebar/code cycle ↔ implemented behavior | Master2, Master4 |
| 2 | Grid columns/action needs ↔ list model ↔ ListVM | UI5, UI6, BE7 |
| 3 | Filter controls ↔ query keys ↔ backend keys | UI4, BE9 |
| 4 | Page request ↔ total count ↔ response metadata ↔ pager | UI6, BE7 |
| 5 | View fields ↔ Detail DTO | UI15, BE3 |
| 6 | Form controls ↔ Add/Update DTOs ↔ server ownership | UI19, BE3 |
| 7 | Save ↔ validation ↔ persistence/transaction ↔ close and refresh | UI10, BE8, BE14 |
| 8 | Actions ↔ grants and prerequisites ↔ branch capability ↔ recheck ↔ sent-write settlement; authorization regression checks and fixture tracing | UI26, BE6, BE8, BE9, UI21, UI28, Master5 topic `05/01`, Master7 |
| 9 | Service failures ↔ both failure channels | UI22 topic `22/04` |
| 10 | Routes/modes ↔ editor shape and dirty exit | UI13, UI10 |
| 11 | Upload UI ↔ storage and cleanup | UI18 |
| 12 | Translation keys ↔ English and Arabic | UI23 |
| 13 | Styles ↔ ownership, accessibility, RTL, theme, responsive | UI24, UI25, UI27, UI1 topic `01/02` |
| 14 | Providers ↔ interceptor-enabled `HttpClient` and authentication | UI1, UI2 |
| 15 | Successful mutations ↔ exactly one success-feedback owner | UI22 topic `22/04` |
| 16 | Frozen Maintenance / Evolution Plan ↔ final source | Master1, PLAN-00 |
| 17 | Reports: Phase 2 report evidence ↔ final slicing, counts, totals, print/Excel scope | UI20, UI21 |
| 18 | Completed screens ↔ module user-guide topics (EN/AR), registration and menu entry | Master7 |
| 19 | Screen cache source matrix ↔ final source for every row | UI2 topic `02/01`, Master5 topic `05/02` |

## Required outputs

- Loading request matrix against the actual route import and rendered owner,
  including the single-visible-indicator cases (UI22 topic `22/01`, Master5).
- Performance matrix: query budgets, measured or pending timing, index evidence
  (Master5 topic `05/02`, UI29, BE2, BE7).
- Verification: scoped build, affected tests and changed-file lint (Master5 topic
  `05/01`); authorized migrations (Master7). Browser execution needs its own request.

### Reconciliation table

| Contract/path | Producer artifact | Consumer artifact | Final source evidence | Status | Required action |
|---|---|---|---|---|---|
| | | | | | |

### Scoped source review

Confirm, with the owner's check list:

- complete scoped diff reviewed in each repository (companion section 7);
- stale imports, types, .NET namespaces, project references and source inclusion (Master5);
- routes and providers (UI1);
- full-width chain and responsive matrix (UI1 topic `01/02`, UI29);
- interceptor path and single success notification (UI22);
- translations (UI23);
- screen guide created/updated and matched to final source (Master7);
- mappings and server-owned payload fields (BE3, BE4);
- screen cache source matrix or a supported not-applicable reason (UI2);
- merge markers and whitespace;
- unrelated user changes preserved; reference modules unchanged unless scoped.

### Final report

Report per Master7 "Final report" and companion `workflow/artifacts-and-report.md`,
proportional to the tier. Include loading-speed and index findings (Master5),
cache classification (UI2), user-guide evidence (Master7), numeric role
conformance (UI14, UI19, BE18), scenario rows (Master5/7), verification performed
and pending, and owner manual checks. State operation mapping, source
conformance, build, behavioral execution and runtime acceptance separately.

## Completion gate

- A Missing, Conflicting, or Uncertain contract that blocks required behavior
  prevents completion. A clean diff is not proof of build or runtime behavior.
- An omitted applicable performance matrix fails Master5's evidence gate; an
  index proposal is not an applied index, and fewer queries are not measured speed.
- Routed/tabbed editors reconcile UI1 width and UI13 tab lifetime against final
  source; BE7 enrichment keeps tenant, history and writer guards.
- An absent or stale in-app guide fails an authorized screen implementation (Master7).
- An omitted applicable cache matrix or known unapproved gap fails UI2's cache gate.
