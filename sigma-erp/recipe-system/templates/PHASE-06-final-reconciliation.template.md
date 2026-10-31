# PHASE 6: Final Reconciliation

Use this packet after every applicable focused phase. It is mandatory for a
broad feature review or implementation.

## Canonical provenance

{{SOURCE_FINGERPRINTS}}

Approved references used by prior phases:

{{APPROVED_REFERENCES}}

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
