<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-06-final-reconciliation | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-06-final-reconciliation.template.md -->
# PHASE 6: Final Reconciliation

Use this packet after every applicable focused phase. It is mandatory for a
broad feature review or implementation. It is a checklist: each item names the
block that owns the rule. Read that block (or its topic file) for the rule
itself; this packet restates no values.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:3d74ae71fa7ca4d78e3061da8b59c62bf979108fe9529ec4052336a6da002034
- master.1: ## 1. Governance and review principles | sha256:ee76565b87a3e1818f4ae0b77f0d10041f5dcbb4141a72e5bae32d07adedb420
- master.2: ## 2. Screenshot and visual evidence policy | sha256:721d81476614305b2a1e7e426b54c3b64048b8efb8462f3573760af392758fda
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:fa4216c7eb26b98af29e24c266026c920dafc7d1e8031d06bbd6d803dfc960a5
- master.5: ## 5. Continuous quality gates | sha256:f33275578ef4b77c78d894dc27e67da870281c9ba228f988c98f055597e026d2
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.7: ## 7. End-to-end reconciliation and final report | sha256:b6729b22bb633b011bd9115edd1468d600b6fc95c85725b939bd93644d7f35ae
- master.8: ## 8. Packet generation and governance | sha256:90dac99897883d0a9d4e973f60b38f549c45b3511dfd83bd5fe3e389da1eeb04
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:8ee8fccad52b59f3ee3a04025d65de169c15d3dc986631ebbda114a9f8dc1e95
- ui.1: ## 1. Feature folders and wiring | sha256:46e816ee4d06385cb73a1e22814128b6a54c66bb0eafb81191fbf74640daab8c
- ui.2: ## 2. Service and response wrappers | sha256:3b648464835e13b2c1e982dd87e8d21a51eb8e0a0bb2ddf9b0aa26f79d56de97
- ui.13: ## 13. Modal with tabs | sha256:7c0dd035e63ae11aef46b513e3bdc67fd7d79d3bd955f974136f7e39c32c1e78
- ui.20: ## 20. Report page | sha256:5f8588b86a7c8453f73cbfeb45ac47ddf1bc27f411bd5775ec2cccf1b456eae8
- ui.21: ## 21. Report print | sha256:f9013f0d3c2398bcc4233daf759fafbeeb38c293335be13444ffeaf988698053
- ui.22: ## 22. Loading, empty, error, toast | sha256:895b36e116e8ead97b444e10d6ff9fa7c127a7e6606b18ed80952387b3789974
- ui.28: ## 28. Request cancellation and stale responses | sha256:74ae9fdcdf9daa83fd23f5f6d2c92c906cd9ef0ed7a78f75c01fdf9243fcfa2e
- ui.29: ## 29. Verification expectations | sha256:52e0b1f24fb7514abf8c9b14cf83b0b6099b24db1ea46c90614f92705f8d67e0
- ui.30: ## 30. Backlog, by priority | sha256:bfc641abe1c745e5d23aea44b61f83175c9b476a9c47ecabe5d41a51dcdcf6ef
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:0983535564fda910eb148cbb4a66079548016ce287b95a9409c7cec41974ed0a
- backend.2: ## 2. Step 2 — EF configuration | sha256:cf4f75793ea80c2bd92d2b51a51aa3b0d57240be85e4bd11f928737190874460
- backend.6: ## 6. Step 6 — Controller | sha256:f0f56867e3997a688067c5e5ec7f19070f1f4d621a0d5617e4e9639fdf74eba6
- backend.7: ## 7. ListVM scope rule | sha256:a32c3c557eec2057ea19e2c4233176c5c701135a7c02173f650fa242b9a69091
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:25c8c824e257a558545cb1475aa83b0e02ccb83c6cd980bc163c4d0840cfd344
- backend.9: ## 9. Search model and filters | sha256:1064b113a9c3badecae45e5ea387980d383a30fa398be6353802ced34de04d27
- backend.18: ## 18. Edge cases | sha256:ca231703f8f3eecb2ba71fb505d7d6960d9c84ae8c2a9f3e3a73847bc553c3b8
- backend.19: ## 19. Backlog | sha256:18d15f0bff56e89133a305cda566487d6fcf90c96f67656f59976fd7ed112bac

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
- shared extraction: repeated patterns extracted or adopted, remaining copies
  counted in UI30 item 39, or why nothing qualified (Master5 topic `05/03` §Shared-extraction gate);
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
