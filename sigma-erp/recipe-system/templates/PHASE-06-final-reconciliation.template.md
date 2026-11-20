# PHASE 6: Final Reconciliation

Use this packet after every applicable focused phase. It is mandatory for a
broad feature review or implementation. It is a checklist: each item names the
block that owns the rule. Read that block (or its topic file) for the rule
itself; this packet restates no values.

## Canonical provenance

{{SOURCE_FINGERPRINTS}}

Approved references used by prior phases:

{{APPROVED_REFERENCES}}

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
