# Sigma Feature Review and Implementation

Last reviewed and updated: 2026-10-25 (mandatory load-speed/query/index evidence — Master blocks 5/7, UI block 29, backend blocks 7/2; mandatory loading request/visibility evidence and query-only navigation lifetime — UI block 22 / Master block 5; mandatory per-screen cache source evidence and final conformance — UI block 2 / Master block 5; current-state navigation, proportional skill and lifecycle archive — Master block 8; readable Arabic questions and choices — Default behavior; general shared presentation preference — Master block 5; continuous packet maintenance — Master block 8; mandatory screen user-guide handoff — Master block 7; documentation-system unification remains recorded in `reviews\SIGMA_DOCUMENTATION_SYSTEM_MAINTENANCE_EVOLUTION_PLAN.md`).

These instructions apply whenever the user asks to review, refactor, fix, or implement a Sigma feature in this workspace.

Loading ownership clarified by the owner, 2026-10-26: required routed initial
and filter lookup bootstrap uses the one page loader, never an inline filter
loader. Shared ReferenceLookupStatus adopts this by default; EditorDialog
provides local dialog scope. Retained-data cache refresh stays silent. This
supersedes earlier local-auxiliary presentation wording (Master5 / UI22).

This file is the single entry point for every agent tool (Codex, Claude, Gemini/Antigravity, Kiro, WorkBuddy). `GEMINI.md` and the folder-level `AGENTS.md` files only point here. Tool memories and caches are not rule sources: when one disagrees with this file, the canonical books, or the skill, it is wrong.

Current-use navigation (owner clarification, 2026-10-23): the documentation
`README.md` routes **create a new screen**, **review an existing screen**,
**deferred decisions**, and **used execution skills**. The screen skill is a
short router into the current canonical blocks; historical digest text and
completed records belong to the labelled archive and are not read as current
instructions (Master block 8). Choose Master block 1's proportional tier before
copying an artifact template; do not load every book or historical review for a
small task. Existing execution, migration and authorization boundaries still apply.

## Screen refactor skill

- For every Sigma screen refactor or implementation, including its directly related frontend and backend screen/API work, read and apply `.agents/skills/sigma-screen-refactor/SKILL.md` together with the canonical book blocks each skill section cites.
- **The skill is the operational digest of the canonical books.** Every skill rule names the book block that owns it. The book block holds the full rule and rationale; the skill holds the checklist form. A skill rule with no owning book block is a defect: report it.
- **Learning protocol.** When work establishes verified, reusable guidance for future Sigma screens, update the owning book block **and** the skill (the rule plus a revision-history row) in the same task. If the book cannot be updated in that task, add the skill row marked `pending promotion` and report it. Never add a rule to the skill only. Feature-specific decisions and unresolved assumptions stay in the feature contract or report.
- The skill owns screen-specific implementation conventions *as a digest*. This file remains authoritative for task scope, workflow, evidence, contracts, delegation, prohibited actions, and verification. On conflict, follow this file and any frozen feature contract, then the canonical book, then the skill, and record the conflict.

## Default behavior

- **Mandatory load-speed, query and index review (owner instruction, 2026-10-25).**
  Apply Master5's performance gate with UI29, BE7 and BE2 for every new or
  reviewed screen. In its existing artifact, trace actual route/request and
  query boundaries, serial/duplicate/per-row work, data volume and page scope.
  Correct confirmed bottlenecks only within authorized implementation scope,
  preserving tenant/history/financial/state/filter/count/page contracts. Record
  reproducible before/after measurement conditions and results, or explicitly
  pending owner timing/SQL-plan verification under source-only execution.
  Evaluate suitable indexes against real predicates/joins/order and existing
  coverage; propose exact keys/optional INCLUDE/filter with benefits, costs,
  overlap and verification, or justify no new index. Suggestions do not grant
  permission to change schema or run migrations/database/browser/tests/builds.
  Do not claim measured speed from fewer source calls or treat loader/cache
  adoption as performance verification. Reconcile these rows before handoff.

- **Mandatory loading conformance evidence for every screen (clarification, 2026-10-25).**
  Apply UI block 22, "Mandatory loading conformance gate", at discovery and
  handoff. Trace the actual route import to its component before reviewing a
  similarly named or legacy folder. In the existing review, classify each
  request/operation's visible owner: global page, local auxiliary/dialog, or an
  explicitly approved silent path. Trace subscribed start/finalize release,
  cancellation, effective showPageLoading metadata and the rendered progress
  host; imports and a startLoading call alone do not prove visibility. Keep one
  visible progress owner while retaining busy/disabled/aria-busy, errors and
  Retry. Page/list/detail/save/domain/delete and report/export data reads use
  UI22's global owner, including required routed initial/filter lookup bootstrap
  through shared ReferenceLookupStatus; dialog lookups stay local, retained cache
  refresh stays silent and Dashboard's explicit silent policy is scoped to Dashboard.
  A body-appended dialog read uses its shared local StateMessage when the dialog
  overlay hides the shell loader. Query/fragment-only navigation on the same
  parsed route-path tree preserves pending progress; actual path departure
  resets the loading counter, without changing independent write safety.
  Reconcile actual source and fix confirmed in-scope mismatches before reporting
  completion (Master5). Runtime visibility/timing remains separately pending.

- **Mandatory cache adoption evidence for every screen (clarification, 2026-10-25).**
  Apply UI block 2, "Mandatory screen cache gate" and its adoption checklist,
  during discovery and final reconciliation of every new or reviewed screen,
  including editors, lists and report filters. In the existing review/contract,
  inventory every consumed lookup/read by its actual URL and service symbol;
  classify approved reference cache, explicit singleton exception, direct
  reference with no source opt-in, direct operational/policy read, or a source
  with an unresolved eligibility decision. A source that has not opted in keeps
  its documented direct read; it does not require new caching to pass this gate.
  Name the cache owner, successful writers/imports and invalidation, active
  watch/tenant notification coverage, and the source-supported reason for each
  direct-read exception. A BaseService import or ReferenceLookupBindings name
  alone does not establish adoption. Final evidence must trace the actual
  consumers through finite successful bootstrap, separate watch bindings,
  selected-label/draft preservation, context clearing, failure/Retry and teardown
  to the real shared source. Correct confirmed omissions within the authorized
  scope before reporting completion (Master5). Keep financial-number-policy,
  capacity, availability and other excluded reads on their existing contracts;
  this gate does not authorize caching every GET or changing financial policy.
  State source conformance separately from pending runtime/network verification.

- **Unified shared components (standing owner instruction, 2026-10-24).**
  Sigma's shared components built on PrimeNG are the default implementation
  owners for application appearance and interaction. Reuse their real public
  contracts before composing a library control directly or adding feature-local
  markup/styles. Extend a missing capability in the existing shared owner;
  extract a genuinely reusable candidate into the appropriate component,
  directive, pipe, utility or shared service and adopt it in affected consumers
  in the same task. Do not create competing wrappers or palettes. Apply Master5's
  shared-extraction gate, preserving model-specific business rules and the
  current task's scope. Record reusable behavior, inputs/events, states, layout,
  RTL/theme, errors and usage constraints in the owning canonical block and
  execution skill; update generated packets through their generator. Documentation
  is the implementation contract, not a substitute for source conformance.

- **Arabic communication (owner instruction, 2026-10-18).** When responding in
  Arabic, start paragraphs and list items with Arabic text so the reading
  direction is clear. Keep English identifiers, paths and code out of the middle
  of Arabic sentences where practical; place substantial technical snippets in
  separate lines or fenced blocks. Prefer Arabic action names in progress and
  final reports. This is a communication preference, not a request to change
  application language or direction behavior.
- **Readable Arabic questions and choices (owner instruction, 2026-10-21).**
  Write user-facing questions, suggested answers, progress and explanations in
  complete Arabic sentences, using Arabic names for document types and actions.
  Do not insert Latin identifiers or paths within a right-to-left question or
  choice; when an exact technical identifier is essential, place it on its own
  line after the Arabic explanation. Keep each option short and unambiguous.
  Apply this rule to asynchronous input prompts as well as ordinary messages.

- **General shared presentation (standing owner instruction, 2026-10-11).**
  When the owner requests a reusable presentation idea, implement it generally
  in its existing shared component so current consumers inherit it. Do not
  restrict it to the motivating screen or require per-screen opt-in unless the
  owner explicitly scopes it or a source-supported compatibility conflict
  requires a documented exception. Preserve screen-owned fields, actions and
  business contracts; record the decision in the owning book and skill.
- Treat an unqualified request to review, assess, or audit a feature as
  read-only. Report findings and recommendations, but do not edit source unless
  the user also requests a refactor, fix, implementation, or one of the
  implementation-authorizing phase commands below.
- Treat a request to refactor, fix, implement, or run an explicit direct or
  phase command below as authorization to implement the confirmed changes in
  that command's scope. Do not stop after producing an implementation plan.
- For authorized implementation, complete all applicable confirmed findings in
  one pass.
- Do not report implementation completion until every applicable guide
  requirement has been implemented and the scoped source diff has been
  reviewed.
- Treat attached screenshots as functional and content evidence only, using the classification and tables in the Master Guide. Do not copy screenshot design when it conflicts with an approved pattern. When the request explicitly asks to complete the missing business shown in a screenshot, follow Master Guide block 2, "Screenshot-backed scope from the user request": the request approves what the screenshot proves. Under the owner's standing decision (Master block 2, rule 6) the details it cannot prove are resolved by the reviewer with the closest correct source-supported option or a minimal new element, recorded and reported; data destruction, access restrictions and accounting effects still wait for the user.
- Treat attached videos and written notes as workflow and business-rule references.
- Preserve unrelated user changes already present in the working tree.
- After completing an authorized screen implementation or refactor, create or
  update its in-app user guide before the final handoff. Follow Master block 7,
  "Screen user guide completion gate", and reuse the existing UserGuide reader
  and the owning module's guide. This is part of the screen deliverable;
  source-read-only reviews do not authorize guide source edits.

**"Read-only" means source-read-only.** A read-only request must not modify any
application source, configuration, or instruction file. It may create or update
the review artifacts defined under Output artifacts, because those artifacts are
part of the review deliverable and the guides require them. A request that must
produce no file at all is a separate explicit instruction ("report only, write
no files"), and the required artifact content is then delivered in the reply
instead. Every other read-only statement in this file, in the command
vocabulary, and in the command reference carries this same meaning.

### Explicit direct review-and-refactor command

When the user says **"run review and refactor direct"**, **"run make all
review and refactor"**, or an equivalent request, treat it as an
implementation request for the complete applicable workflow:

- Perform Phase 0 discovery and Phase 1 contract freeze, then continue directly
  into every applicable implementation and reconciliation phase in the same
  task.
- Do not stop after discovery, contract freeze, a review report, or an
  implementation plan when the contracts are Frozen.
- Apply confirmed findings directly to the scoped source, preserve unrelated
  changes, and complete the scoped diff review before reporting completion.
- If a required business or API decision remains Missing, Conflicting, or
  Uncertain and cannot be safely resolved from the source and evidence, pause
  only the affected implementation, identify the exact decision, and request
  direction rather than inventing a contract.
- If the user explicitly says **"approve reviewer assumptions"** (or an
  equivalent approval), use conservative reviewer assumptions only for
  explicitly enumerated, source-supported, low-risk implementation choices.
  Record each accepted assumption and its evidence in the contract artifact,
  freeze the affected handoff, and continue without asking for another
  confirmation. Approval of reviewer assumptions does not resolve a genuinely
  Missing API shape, field, permission, business invariant, state transition,
  destructive-action rule, or other material workflow decision; those remain
  Blocked until the user supplies the exact decision.
- Keep the existing migration boundary, prohibited-command rules, and
  source-only verification rules unchanged.

### Step-by-step phase commands

When the user names one specific phase, execute only that phase and stop at its
handoff/report. Do not automatically begin a later phase. The supported
step-by-step workflow is:

- **"Shared discovery and contract freeze review"** — perform discovery,
  freeze the contract, create/update the contract artifact, and apply only the
  refactors owned by the shared discovery/freeze phase.
- **"Backend review"** — review the frozen backend contract and apply the
  scoped backend refactors.
- **"Frontend review"** — review the frozen frontend contract and apply the
  scoped frontend refactors.
- **"Final reconciliation"** — verify the complete scoped diff and report
  remaining risks; do not begin new feature work unless explicitly requested.
- **"Maintenance / Evolution Plan <topic>"** — review existing behaviour
  end-to-end against `PLAN-00-maintenance-evolution.md`, produce the Impact Map
  and the Keep/Extend/Refactor/Replace/Create/Remove classification, present the
  alternatives and every open business decision, and stop at the plan. Do not
  implement before the plan is Frozen. Use this instead of creating a parallel
  implementation when the topic may already have an owner.

If a phase handoff is Blocked, stop that phase and report the exact contract
decision required. Do not start a later phase until the affected handoff is
Frozen or the user explicitly approves conservative reviewer assumptions.

### Command vocabulary and trigger aliases

A request is a command when it matches a row below, in English or Arabic. An
equivalent phrasing counts. An unqualified Sigma feature review request that
matches no row stays read-only under Default behavior. A direct request to
refactor, fix, or implement a named feature is authorization under Default
behavior even when it matches no row in this table. Ordinary questions,
explanations, and questions about this file are not commands and are not
reclassified as reviews.

| Command | Behaviour |
|---|---|
| `Plan <feature>` · `خطط لـ <الميزة>` | Plan before implementation, then stop at the plan. |
| `Review <feature>` · `راجع <الميزة> read-only` | Read-only review. Report findings and drift; do not edit source. |
| `Review <feature> and implement the confirmed fixes` · `راجع <الميزة> ونفذ الإصلاحات المؤكدة` | Implement only the findings supported by the guides and the frozen contracts. |
| `Implement <feature>` · `نفذ <الميزة>` | Implement the frozen plan or contracts in one pass. |
| `Verify <feature>` · `تحقق من <الميزة>` | Source-only verification using the Phase 6 comparisons; report only. Build, test, runtime, database, and browser verification stay pending for the owner unless the user explicitly authorises them for the current task. |
| `Close <feature>` · `اقفل <الميزة>` | Phase 6 Final Reconciliation and closure. |
| `Maintenance / Evolution Plan <topic>` · `اعمل Maintenance / Evolution Plan لـ <الموضوع>` | `PLAN-00`: review existing behaviour end-to-end, produce the Impact Map and the Keep/Extend/Refactor/Replace/Create/Remove classification, surface open business decisions, and stop at the plan. No implementation before the plan is Frozen. |
| `Feature Review end-to-end` · `ابدأ Feature Review لـ <الميزة> end-to-end` | **Read-only.** Phase 0 through Phase 6, as far as the applicable phases require, ending in the Phase 6 report. It does not authorise source edits. Implementation requires the "implement the confirmed fixes" phrasing above, or the direct review-and-refactor command, and a Frozen contract. |
| `Contract-First Split Review` · `اعمل Contract-First Split Review لـ <الميزة>` | Freeze the shared domain and API contract, then review frontend and backend against that same contract. |
| `Existing-State Audit` · `اعمل Existing-State Audit لـ <الموضوع>` | Read-only. Report what already exists, what is missing, and what must be extended instead of duplicated. |
| `Impact Analysis` · `اعمل Impact Analysis للتعديل` | Read-only impact map: domain, writers and readers, EF, API contracts, Angular consumers, reports, permissions, integrations, existing data. |
| `run review and refactor direct` · `run make all review and refactor` | The complete workflow defined above. |
| `approve reviewer assumptions` | Conservative assumptions within the limits defined above. |

The full Arabic command reference is `SIGMA_COMMAND_REFERENCE_AR.md` in the
documentation folder. It is a quick reference only: the canonical rules in this
file and in the guides prevail over it, and it does not authorise work that this
file does not authorise.

## Controlled multi-agent strategy

Use subagents automatically when a Sigma task contains at least two concrete,
bounded, independent workstreams and parallel execution is expected to reduce
wall-clock time without duplicating context or creating merge risk. Do not
spawn subagents for small fixes, tightly sequential work, unresolved shared
contracts, or tasks where the coordination overhead is likely to exceed the
implementation time.

The root agent remains accountable for the complete result. It owns:

- scope, evidence classification, guide and packet selection;
- Phase 0 discovery and the Phase 1 contract freeze;
- cross-layer architecture and business-rule decisions;
- integration of all agent outputs;
- complete scoped-diff review, final reconciliation, and the final report.

### Sequencing and dependency gates

1. The root agent performs initial discovery, runs the recipe drift check, and
   freezes applicable backend and API contracts before delegating implementation.
2. Phase 2 read/grid work and Phase 3 detail/write work may run in parallel only
   after Phase 1 freezes every contract they consume and only when their owned
   files do not overlap.
3. Phase 4 work starts only after its backend and owning-UI contracts are fixed.
4. Phase 5 integration and Phase 6 reconciliation remain root-owned unless a
   bounded read-only audit is delegated.
5. If an agent discovers a contract conflict or a dependency on another
   workstream, it stops that portion and reports the conflict to the root agent;
   it does not invent or independently change the shared contract.

### Agent and model routing

- The role labels in this section are descriptive task names, not model
  identifiers. Never pass a role label as a model override.
- Use a `luna_explorer` role backed by `gpt-5.6-luna`, when selectable, for
  read-only source discovery, request-flow tracing, documentation lookup, and
  log or diff analysis.
- Use a bounded `terra_worker` role backed by `gpt-5.6-terra`, when selectable,
  for routine isolated implementation where lower cost is expected to preserve
  quality.
- Use a `sol_worker` role backed by `gpt-5.6-sol`, when selectable, for complex
  business rules, aggregate persistence, concurrency, difficult debugging, or
  a focused final code audit.
- Use only model identifiers offered by the current orchestration tool. If the
  mapped model is unavailable or the fork must inherit its model, keep the role
  and use the inherited model. Use a different selectable model only when the
  user explicitly requests it.
- Keep the root agent as the final decision maker; no subagent may declare the
  overall Sigma task complete.

### Cost, concurrency, and context controls

- Use the smallest useful team. Start with one or two subagents and use at most
  three concurrently, keeping total active agents including the root within four.
- Delegate a coherent workstream, not individual tiny edits.
- Prefer the lowest-cost capable model for read-only or routine work and reserve
  the strongest model for decisions whose complexity or risk justifies it.
- Pass only the context, guide blocks, contracts, and files required by the
  assigned workstream. Do not make multiple agents repeat the same source scan.
- Reuse an existing agent for related follow-up work instead of spawning a new
  one, and stop assigning work once the bounded result is complete.
- The root agent continues useful non-overlapping work while subagents run.

### Ownership and safety

- Give every implementation agent explicit file or module ownership and a
  concrete deliverable. Two agents must never modify the same file concurrently.
- Tell every implementation agent that it is not alone in the working tree, must
  preserve user and peer changes, must not revert other edits, and must adapt to
  compatible changes already present.
- All subagents inherit the same guide authority, scope boundary, migration
  boundary, source-only verification rules, and prohibited commands in this file.
- Subagents must not directly edit generated packets, migrations, model snapshots, or
  approved reference modules unless those files are explicitly authorized by a
  later user instruction that also changes the applicable boundary.
- If clean ownership cannot be established, the root agent performs the work
  locally instead of delegating it.

## Required guides and packets

### Mandatory guide confirmation before work

For every Sigma request to create, review, refactor, fix, or implement a
feature, confirm to the user in commentary, before source investigation or
editing, that the work will follow:

1. `SIGMA_FEATURE_REVIEW_MASTER.md`;
2. the applicable canonical blocks in `SIGMA_BACKEND_PATTERNS.md` and/or
   `SIGMA_UI_PATTERNS.md`;
3. the applicable generated phase/task packets after the required drift check.

Name the selected backend and UI shapes after source discovery. Do not treat a
similar recently implemented feature as canonical merely because its behavior
looks close; select the pattern from the guides first, then use only the
approved reference named for that shape. Record canonical exceptions such as
operational logs, reports, settings, and stateful aggregates explicitly instead
of forcing every feature through generic CRUD.

The documentation authority consists of one Master Guide and two canonical
implementation books:

```text
F:\My Work\Shaban Documents\Shaban\sigma-erp\SIGMA_FEATURE_REVIEW_MASTER.md
F:\My Work\Shaban Documents\Shaban\sigma-erp\SIGMA_UI_PATTERNS.md
F:\My Work\Shaban Documents\Shaban\sigma-erp\SIGMA_BACKEND_PATTERNS.md
```

Generated phase and task packets live at:

```text
F:\My Work\Shaban Documents\Shaban\sigma-erp\recipe-system\generated\
```

The generated folder holds `PLAN-00-maintenance-evolution.md` together with
`PHASE-00-discovery-evidence.md` through `PHASE-06-final-reconciliation.md`.

The documentation folder also holds the non-canonical quick reference
`SIGMA_COMMAND_REFERENCE_AR.md`. It routes commands to phases and packets and
carries no authority of its own.

Authority order:

1. Master Guide plus applicable canonical pattern-book blocks.
2. Applicable generated phase or task packet.
3. The `sigma-screen-refactor` skill — operational digest of level 1. It may
   not introduce a rule that level 1 lacks; see "Screen refactor skill" above.
4. Approved project reference for the specific shape.
5. Screenshots for functional requirements and visible content only.
6. Labelled reviewer inference supported by evidence.

Before using any generated packet, run this read-only command from any working
directory:

```powershell
& 'F:\My Work\Shaban Documents\Shaban\sigma-erp\recipe-system\Generate-SigmaRecipes.ps1' -Check
```

### Continuous packet maintenance (standing owner instruction, 2026-10-09)

Keep generated packets current throughout the work. After changing canonical
books, packet templates, or manifest dependencies/references, regenerate the
affected packets with `Generate-SigmaRecipes.ps1` in the same task, review the
result semantically against the canonical sources and approved reference roles,
then run `-Check` again before using the packets or handing off the task.
When the initial check finds existing drift, reconcile stale template/manifest
claims against the canonical books, regenerate and review the affected packets
before using them. Do not leave a routine refresh pending for the owner.

This standing authorization covers derivative documentation maintenance in
review and implementation tasks; source-read-only requests still forbid
application-source changes. Generate only through the generator, preserve
unrelated changes, and record refreshed packet IDs and semantic-review evidence
in the review. If a required source is missing or a semantic conflict cannot be
resolved from canonical evidence, keep that packet out of use, continue from
the canonical sources, and report the precise blocker.

Generated packets are derivative. Never edit a generated file directly.

| Work shape | Required entry point |
|---|---|
| Planning new, large, ambiguous, or existing-behaviour work | `PLAN-00-maintenance-evolution.md` before any phase packet |
| Screenshot or requirement extraction | `PHASE-00-discovery-evidence.md` |
| Backend, persistence, DTO, or API boundary | `PHASE-01-domain-api.md` |
| Grid, filters, paging, ListVM, or export | `PHASE-02-read-grid.md` |
| Create/Edit/View, form, child, document, or upload | `PHASE-03-detail-write.md` |
| Delete, activate, approve, post, void, finalize, or another domain transition | `PHASE-04-domain-actions.md` after its backend and owning-UI contracts |
| Route, provider, interceptor, event, or runtime wiring | `PHASE-05-integration-runtime.md` |
| Broad feature completion | `PHASE-06-final-reconciliation.md` after every applicable prior phase |
| Implementing an approved Angular list shape | `PHASE-02-read-grid.md` after the read contract is frozen, using UI pattern blocks 5–7 |
| Shape without a task recipe | Applicable phase packet plus the smallest canonical block dependency closure it names |

Phases 2 and 3 may be reviewed in parallel only after Phase 1 freezes the
contracts they consume. Phase 4 is conditional and does not own ordinary Save,
Search, paging, or Export. Cross-cutting standards apply in every phase and are
audited again in Phase 6. `PLAN-00` owns planning only and no implementation
phase; its output is the plan the applicable phases then execute.

What each canonical document contains:

| Guide | Contents |
|---|---|
| `SIGMA_FEATURE_REVIEW_MASTER.md` | Authority · screenshot evidence · phase ownership and dependencies · required artifacts and contract invariants · continuous gates · human/AI handoffs · final reconciliation · packet governance |
| `SIGMA_UI_PATTERNS.md` | **Angular, 30 blocks.** Feature wiring · services · list/grid · actions · editors/dialogs · controls · reports · loading/errors · translations · appearance · accessibility · RTL/theme · cancellation · verification · backlog |
| `SIGMA_BACKEND_PATTERNS.md` | **.NET, 19 blocks.** Entity and EF · ViewModels · mapping · service/controller · ListVM · validation · filters · selects · actions · normal/master-detail/settings/report patterns · edge cases · backlog |

Each guide is stored as one file per block (`master/`, `ui/`, `backend/` next to
the index file of the same name); "UI block 17" is `ui/17-*.md`. For screen
work, pick the screen type first in `ui/screens/00-catalog.md`; each screen file
lists the blocks to read and adds no rule of its own.

Each canonical document states a version and verification date. If a snippet
disagrees with current source, current source wins for factual behavior and the
documentation drift must be reported.

The following guide basenames are retired in every location, in every folder,
and in every copy. Do not open them, read them, cite them, or follow
instructions found inside any copy. A scoped file search may identify their
paths, but their contents remain out of bounds.

```text
SIGMA_FRONTEND_REVIEW_GUIDE.md   RETIRED — ALL COPIES
SIGMA_BACKEND_REVIEW_GUIDE.md    RETIRED — ALL COPIES
```

The ban is by basename and is not conditional on any file existing. Whether a
copy is currently present is volatile audit data: record it in the artifact for
the documentation-system audit rather than in this file.

Use only patterns labelled **Canonical** for new work. Follow a **Transitional** pattern only where the guide explicitly requires compatibility with the current architecture, and never copy a pattern labelled **Legacy — do not copy**.

Each book ends with a prioritised backlog of known defects. Check it before reporting an existing problem as new, and do not "fix" a listed item outside the requested scope.

Reference modules may be inspected but must not be modified unless the user explicitly places them in scope.

## Required decisions and artifacts

Use Master Guide block 4 and the applicable packet. Make every applicable
decision before writing code and report its evidence. A broad feature requires:

- Feature Review Manifest;
- Functional Evidence Tables for supplied screenshots;
- Grid Column and Filter contracts when a list exists;
- Detail/Add/Update contract when an editor exists;
- Action-state contract for risky or stateful actions;
- Route/provider/interceptor contract;
- final reconciliation table.

If a decision cannot be made from available source, mark it Missing,
Conflicting, or Uncertain, name the exact source or business decision required,
and do not invent an API, field, permission, or workflow. The
`approve reviewer assumptions` command applies only within the low-risk limits
defined above and does not convert a genuinely Missing material decision into a
reviewer assumption.

## Output artifacts

Review, contract, planning, and reconciliation artifacts are written under:

```text
F:\My Work\Sigma\reviews\
```

File names below are relative to that folder.

| Artifact | File name |
|---|---|
| Feature review | `<FEATURE_NAME>_FEATURE_REVIEW.md` |
| Full-stack review | `<FEATURE_NAME>_FULL_STACK_REVIEW.md` |
| Contract freeze | `<FEATURE_NAME>_<SCOPE>_CONTRACT_FREEZE.md` |
| Maintenance / Evolution Plan | `<FEATURE_NAME>_MAINTENANCE_EVOLUTION_PLAN.md` |
| Impact Analysis | `<FEATURE_NAME>_IMPACT_ANALYSIS.md` |
| Final reconciliation | `<FEATURE_NAME>_FINAL_RECONCILIATION.md` |
| Documentation-system audit | `SIGMA_DOCUMENTATION_SYSTEM_AUDIT.md` |
| Multi-part feature | `<FeatureFolder>/<FILE>.md` |

- Use uppercase snake case for the feature name and place the scope qualifier
  after it. One contract-freeze file records one frozen handoff; do not append
  an unrelated handoff to it.
- When a reconciliation belongs to a feature review rather than to a separate
  handoff, record it as a section of that review artifact instead of a separate
  file.
- A frozen artifact is a historical record of the decision and its evidence. If
  a later instruction changes the contract, record the change and the reason
  rather than silently rewriting the earlier decision.
- These artifacts currently sit outside both Git repositories: the workspace
  root is not a repository, so they are local, unversioned records. Owner
  decision D7 (2026-09-28): the documentation repository
  `F:\My Work\Shaban Documents\Shaban` becomes the version-control owner of the
  instruction layer (this file, `GEMINI.md`, `PROJECT_MAP.md`, `.agents/`, and
  `reviews/`). The owner performs that move and its commits; update this section
  in the same change.
- Create only the artifacts the requested scope requires.
- Every new artifact starts with a status table containing at least
  `Status` — one of `Draft`, `Frozen`, `Blocked`, `Implemented — source-only`,
  or `Closed` — and `Owner verification pending` — `yes` or `no`. Free-text
  statuses such as "Completed" are not used. Existing artifacts are historical
  and are not renamed or rewritten.

## Scope

- Review only the requested feature and its directly related Angular and/or .NET
  feature files. Backend-only and frontend-only requests remain valid scopes.
- Do not perform full-solution scanning or unrelated refactoring.
- Preserve the current architecture, API conventions, confirmed permissions and
  business invariants, RTL behavior, responsive behavior, light theme, and dark
  theme unless the user instruction or frozen contract explicitly authorizes a
  change. When a contract change is frozen, update every in-scope producer and
  consumer together and record the change in the contract artifact and final
  report.
- Inspect and update directly related routing, list, details, create/edit/view forms or modals, components, HTML, SCSS, typed forms, models, payloads, services, translations, permissions, loading states, empty states, validation, error handling, confirmations, endpoints, services, entities, EF configurations, DTOs, AutoMapper profiles, transactions, and domain calculations when applicable.

## Frontend and contract rules

- Select the canonical reference for the specific UI shape from `SIGMA_UI_PATTERNS.md`; do not treat one feature as the reference for every screen type.
- Before source edits, read the owning book blocks and actual shape-specific reference files. In the existing plan/review, record a short conformance table: concern, book block, reference file/symbol, shared owner, and target match or justified deviation (Master 5). Shared class names alone do not prove conformance.
- Before handoff, reconcile that table with final source. Correct known unapproved differences in scope; never claim completion while they remain. A documentation update cannot retroactively justify a different implementation: record the user instruction or governing decision first, and review shared extractions against the reference values before documenting them. Keep runtime/visual verification explicitly pending when only source was inspected.
- For Angular application compilation, follow the existing `tsconfig.app.json` pattern. If a runtime feature `.ts` file is reported as missing, add that runtime entry to the explicit `files` list and keep test files under `tsconfig.spec.json`; do not add a broad feature `include` that pulls `.spec.ts` files into the application compile.
- Keep frontend and backend contracts compatible.
- A list VM must contain only properties displayed in the frontend list plus the minimum identity and action-state properties required by that list.
- Add and update DTOs must contain client-editable inputs only.
- Detail DTOs must contain only data required by the details UI.
- Use typed forms, models, service calls, and payloads.
- Use the project's reusable confirmation dialog for every confirmation-only scenario. A workflow that collects a reason, note or date is a typed form dialog, not a confirmation.
- Include applicable translations, loading, empty, validation, and error states. Handle both failure channels: `isSuccess: false` and the `error` callback. `error: () => undefined` is never acceptable.
- The app has authentication (`AuthGuard`) but no authorization mechanism. Do not invent a permission API, and do not describe a hidden control as secured.
- Preserve screenshot-demonstrated fields, labels, logical groups, actions, statuses, and workflows through the approved project pattern. The guides and approved reference own layout, component choice, controls, icons, spacing, validation presentation, accessibility, RTL, theme, and responsive behavior.
- For action/detail dialogs that identify a record, keep the screen name in the translated `title` and render the record number or identifier in the translated `subtitle` on the next line. The subtitle must use the shared smaller muted dialog-header style; do not concatenate a long identifier into the title or create feature-specific header markup when `EditorDialogComponent` already supports this structure.
- **The page never scrolls.** At every breakpoint the route fills the box the shell sizes (`height: 100%`, container-fill) and each region has exactly one internal scroll owner (grid rows, form pane, or dialog body); title, filters, paginator, and action footer stay fixed. `SIGMA_UI_PATTERNS.md` block 1 owns the chain and its values. Do not write a page-height `calc(100dvh - …)`.
- Keep each feature's page title inside its primary card or panel and use `app-feature-title`. `SIGMA_UI_PATTERNS.md` block 3 owns the title placement, the inset and separation values, the icon treatment, and the dark-theme tokens. Do not render a duplicate title in the shared authenticated-shell toolbar above the card, and do not restate the block 3 values in feature code or in this file.

## Backend, mapping, and calculation rules

- Keep every named class or record in its own file in the existing appropriate
  layer and folder. Do not declare helper DTO, projection, or query-shape
  classes inside a service class; use an anonymous type or tuple only when the
  shape is strictly local and does not need a named contract.
- When a feature uses the canonical generic service and controller bases,
  override only methods that require feature-specific business validation,
  projection, aggregate-child reconciliation, deletion behavior, or a domain
  transition. Use the inherited implementation for the remaining generic
  operations.
- Do not add unnecessary AutoMapper `Ignore()` calls or `ReverseMap()` mappings.
- Do not automatically mark calculated domain properties as `[NotMapped]`.
- Persist calculated values when they are required for lists, reports, filtering, performance, or historical stability.
- Keep calculation ownership in the domain or backend and do not trust client-calculated totals.
- When a field is derived from persisted inputs or business rules (for example,
  charge totals, discount/tax amounts, duration, balances, or status), define
  the calculation in the domain/service that owns the rule and return/persist
  the authoritative result there. The frontend may calculate a display preview
  for usability, but must omit derived fields from Add/Update requests and must
  never replace the backend result with its preview.
- Reconcile aggregate children explicitly before persistence.
- Use EF Core's implicit transaction when one scoped `DbContext` saves the
  complete tracked aggregate in one `SaveChangesAsync()` call. Use an explicit
  transaction only for the multi-save or multi-boundary cases defined by the
  canonical backend transaction guidance.
- Validate ownership, existence, state transitions, duplicates, and business invariants at the backend boundary.

## Migration boundary

- Do not create, edit, or run migrations.
- Do not modify any `*ModelSnapshot.cs` file, including `SiGmaDbContextModelSnapshot.cs`.
- If entity or EF configuration changes require a schema migration, tell the owner to run `Add-Migration` with a suggested migration name (Master Guide block 7) and report the reason.

## Prohibited tools and actions

Do not use:

- Graphify automatically. Graphify may be used for Sigma work only when the
  user explicitly requests it for the current task; without that explicit
  request, do not use Graphify. When explicitly requested, keep its use within
  the user's scope and preserve all other restrictions in this file. This
  covers every automatic path: no "query first" habit, no `graphify update`
  after edits, and no tool hook that invokes Graphify. `graphify-out/` may be
  stale; state its build date when you use it.
- Sigma MCP server.
- Uncontrolled subagents, overlapping agent ownership, or delegation before the
  applicable shared contracts are frozen.
- Full-solution scanning.
- Unrelated refactoring.

Do not run:

- Builds.
- Tests.
- Lint.
- Migrations.
- Browser automation or application verification unless the user explicitly
  requests it for the current task. When explicitly requested, keep browser
  use limited to the requested in-scope screen and workflow; do not mutate
  external data unless the user explicitly authorizes that mutation.
- Database commands.
- Commits or pushes.
- Deployment steps.

## Source-only verification

Before reporting the result:

- Identify the Git repository root for every scoped file and review the complete
  scoped diff separately in each affected repository. Do not assume that the
  workspace root is a Git repository. In the current workspace the root
  `F:\My Work\Sigma` is not a repository even though a `.git` directory is
  present there, and the relevant repositories are
  `F:\My Work\Sigma\SiGmaAngularFrontEnd` and
  `F:\My Work\Sigma\SigmaBackend`, as applicable.
- If repository ownership protection blocks a read-only Git command, use a
  non-persistent per-command `git -c safe.directory=<repo> -C <repo> ...`
  override. Do not change global Git configuration solely to perform the
  review. If a required scoped diff still cannot be inspected, mark final
  reconciliation Blocked and report the exact reason instead of claiming
  completion.
- Check directly related source for stale imports and types, frontend/backend contract mismatches, route wiring, missing translations, inappropriate AutoMapper mappings, merge markers, and whitespace errors.
- Check .NET namespace resolution explicitly: compare each new or moved type's
  declared namespace with its consumer imports or actual global imports, then
  verify the owning project reference and source inclusion. Diagnose the
  producer's first error before changing correct dependent consumers. Follow
  Master block 5; source inspection does not prove a successful build.
- Do not change unrelated files to make the diff cleaner.
- Leave build, runtime, database, and browser verification explicitly pending for the owner.

## Final report

Report:

- Files changed.
- Phases applied and skipped, with reasons.
- Screenshot evidence classifications and unresolved Missing, Conflicting, or Uncertain requirements.
- **Decisions taken**, using Master Guide block 4: for each applicable row, the decision and the evidence behind it. State the grid column list beside the ListVM property list so the match is visible.
- Frontend changes.
- Backend changes.
- Contract changes.
- AutoMapper decisions.
- Domain-calculation decisions.
- Whether the owner must run `Add-Migration`, with a suggested migration name.
- A suggested commit message for each affected repository (Master Guide block 7, "Suggested migration name and commit messages"). Suggest only; never commit.
- Possible compile or runtime risks.
- Load-speed/query findings and scoped improvements, reproducible measured
  before/after results or pending owner measurement, and evidence-backed index
  proposals (or justified none), costs and migration/application boundaries.
- Manual owner-verification steps.
- Screen user-guide content file, module guide route/menu entry, covered screen
  topics, and source conformance/pending owner verification (Master block 7).
- Agent utilization: roles/models used, assigned workstreams and owned files,
  integration outcome, and the time/cost reason for delegation; or state that
  subagents were not used because the task did not meet the delegation gate.
- Confirmation that prohibited commands were not run.

Keep the report proportional to the change. A one-element fix records only the decisions it touched; a new feature records the full table.
