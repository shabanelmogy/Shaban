## 5. Continuous quality gates

These gates apply during every phase and are audited again in Phase 6. They are
not a late cosmetic review.

### Scoped build and specification checks

The owner authorizes local builds of affected projects (2026-11-13). Select
an application target for changed application code and the test project when
its specifications change. Compare test calls to the actual signatures and
member visibility, and check project references and source inclusion. Seed
fixtures independently of the restricted actor, then assert against that actor's
observable result. Report build and executed test results independently.

**Scoped tests and lint (owner instruction, 2026-11-19).** An authorized
implementation, fix or refactor includes running the specifications that cover
the changed code and linting the changed files, without a separate request:

- Angular: `ng test --watch=false --include=<affected spec paths>` and
  `ng lint --lint-file-patterns=<changed files>` (or `npx eslint <changed files>`).
- .NET: `dotnet test <affected test project> --filter <affected classes>`.

Fix failures caused by the change; report pre-existing failures as findings
without widening scope. This does not authorize full-suite runs, end-to-end or
browser/application execution, review-only or plan-only tasks, or fixes for
unrelated lint debt. Report the exact command, count and outcome; a test that
was not executed stays explicitly pending.

Match the fixture to the behavior it claims to verify. EF InMemory is useful
for suitable isolated queries. Use SQL Server for behavior that depends on its
transactions, application locks or query translation. A test double can verify
code on its side of the boundary and should identify the boundary it replaces.
A filter test with a stub continuation checks the filter decision. Cover the
actual filter and service together when the filter changes the service's query
scope. Compare table-driven cases with the named grants and expected outcome.
For deferred UI behavior, control response and access-change order and assert
at the point where the decision is consumed.

For authorization regressions, assert the exact rejection and its layer.
Use independent requests for an invalid direct filter and an invalid grid
field so an early rejection cannot mask the second case. Construct the actual
actor, tenant, branch snapshot and transaction/read mode that the invoked path
uses. A changed principal after service construction may leave cached scope
unchanged. To exercise an activity guard, use a fixture that passes the
preceding grant and branch checks. In catalogue tests, a linked copy of an
internal type belongs to the test assembly. Use the actual type or verify
reflected properties from the owner assembly without casting to the copy.

### Scenario evidence for an authorization change

Choose applicable cases from the frozen feature contract in the existing review.
Trace a generated document into its next affected action, including the actual
filter, service and persistence scope of that action. For example, after a
conversion from a readable source into a writable destination, verify whether
the resulting document can be read, approved and reversed by the actors the
contract allows. Include each touched producer and consumer in the source
comparison.

For a mounted editor, vary View and the operation grant independently. Cover
withdrawal and restoration with a dirty draft, and a sent request resolving
before and after restoration. Assert the entered values and row identities,
the number of writes and the resulting Close/Back destination. For output,
include the separate grant for a generated document and its deferred print.
Choose relevant cases for administrator, minimum operation grants and branch
capabilities from the contract.

Trace each required regression fixture from setup through the intended
assertion. Establish all valid inputs, current currency state, effective
document statuses, actor context and the provider needed to reach that guard.
Then vary the condition under test and assert its exact outcome. A test that
never reaches its named operation leaves that case unverified. When execution
is unavailable, record the source defect or pending execution explicitly.

### Documentation and reference conformance evidence

- Before source edits, read the owning blocks and the actual shape-specific reference
  source. Record a short table in the existing plan/review: concern, book block,
  reference file/symbol, shared owner, and target match or justified deviation.
  Cover layout, filters/actions, tables, states and print when applicable. Naming
  shared classes alone is not evidence that their appearance or behavior matches.
- Before handoff, reconcile that table with the final source and record unresolved
  mismatches. Correct a known unapproved mismatch within scope; do not claim completion.
- A book update cannot retroactively authorize a deviation. Record the user's
  instruction or existing governing decision before changing the approved pattern.
  Document reusable extraction only after source conformance review; preserve the
  reference's values and behavior unless that recorded authority approves a change.
- These checks establish source conformance. Record local compilation separately.
  Visual and runtime passes require their own evidence. Keep the evidence proportional:
  reuse the required plan/review instead of creating another checklist artifact.
- A conformance row names the actual target consumer and producer symbols plus
  the compared contract/value. A reference path or shared-component import alone
  cannot earn "Matched". Missing source evidence is Uncertain; known mismatches
  are findings; source conformance and pending visual/runtime acceptance stay separate.
  For report changes, require the response/filter/output evidence in UI block 20
  before and after implementation. Reconcile the final request and backend slicing,
  not an earlier artifact's claim that the response is complete.
- For every routed screen, apply UI1's full-available-width gate before edits
  and at handoff: active route → component host → shared page/panel → bounded
  body/table. Record the actual shared declarations and local overrides that
  determine width/stretch; check empty/loading/error/populated states and UI29's
  responsive matrix. A shared class/import or passing syntax check alone cannot
  earn a layout Matched result. Remove confirmed conflicting feature geometry;
  do not document it as compliant or add compensating widths. Report source
  conformance separately from pending authorized visual acceptance.

### Loading performance, query and index evidence (owner2026-10-25)

- Every new or reviewed screen includes a proportional performance review in
  its existing artifact: actual route/trigger, HTTP and database boundaries,
  required versus auxiliary reads, serial dependencies, duplicate requests,
  round trips, page/response size and rendered rows. Include initial open,
  search/paging, detail, relevant actions and complete report/export paths.
  A correct visible loader is UI22 evidence; actual loading speed is separate
  evidence owned here and in UI29/BE7/BE2.
- Inspect source first and correct confirmed bottlenecks within authorized
  implementation scope: repeated per-row queries, unnecessary full entities or
  Includes, unbounded premature materialization, duplicate calls and avoidable
  serial waits. Preserve count/filter/order/page, tenant/history/soft-delete,
  ledger/financial/state guards and authoritative write-time checks. Do not
  parallelize EF operations on one DbContext or add a cache for excluded reads.
- Record a reproducible before/after measurement plan under UI29: environment,
  data volume, filters/page size, cache state, sample count and timing/SQL/network
  evidence available. Establish a feature-specific target with its evidence;
  do not invent a universal duration, timeout or acceptable regression. Without
  authorized runtime evidence, mark timing and SQL-plan acceptance pending for
  the owner, even when a source query count improves. A source-only task still
  performs the source audit and supplies measurement steps; this gate does not
  authorize builds/tests/browser/database commands or production profiling.
- For each materially expensive query, evaluate existing and candidate indexes
  under BE2. Name the actual predicate/join/order/projection and table/mapping,
  key order, optional included columns/filter, overlap with existing indexes,
  expected benefit, write/storage cost and required verification. Record a
  supported proposal or why no extra index is justified; do not propose an
  index for every filter by habit or treat a missing production plan as proof.
  Proposals are separate from authorized EF configuration implementation and
  owner migration/application. Unique/filter semantics never change for speed.
- Reconcile each path at handoff: source findings and fixes, measured results or
  explicit pending owner measurement, index proposals/rejections and remaining
  risks. Reuse the current feature artifact; no separate benchmark framework,
  full-solution scan or mandatory artifact proliferation. Do not describe the
  screen as fast or performance-tested without actual supporting measurements.

### Loading conformance evidence (UI22; clarification2026-10-25)

- Apply UI22's mandatory loading conformance gate during discovery and final
  reconciliation. Trace the actual route import and component; a matching
  feature folder or separate legacy route does not prove active-path adoption.
- In the existing review, classify each request/operation's visible owner and
  trace real producer/consumer symbols: subscribed start/finalize release,
  success/business failure/HTTP error/cancel/destroy, effective showPageLoading
  and actual host, retained busy/disabled/aria-busy and error/Retry. A shared
  import or startLoading call alone cannot earn Matched.
- Keep UI22's ownership boundaries: global page/list/detail/save/domain/delete
  and report/export data reads, plus required routed initial/filter lookup
  bootstrap through the shared page owner (owner clarification2026-10-26),
  local dialog lookups/reads hidden by a body-appended overlay, silent retained cache refresh and explicitly scoped
  Dashboard policy. One visible progress owner means no duplicate StateMessage/
  table/button indicator for that request; it never means removing busy guards.
- Reconcile query/fragment-only list URL updates with pending request lifetime:
  they do not reset the loader when the parsed route-path tree is unchanged.
  Actual path departure retains reset; independent write safety remains intact.
  Do not add per-feature delay/timer workarounds for a shared lifecycle mismatch.
- Correct confirmed authorized mismatches before claiming completion, and keep
  missing visibility evidence explicit. Source comparison does not establish
  runtime visibility, response duration or overlapping/cancelled-request behavior;
  record owner verification separately and preserve execution boundaries.

### Screen cache adoption evidence (UI2; clarification2026-10-25)

- Apply UI2's mandatory screen cache gate during discovery and again before
  handoff for every new or reviewed screen, including editor lookups and
  list/report filters. Reuse the existing review/contract; do not create another
  artifact solely for this gate.
- Inventory each actual consumed URL/envelope and consumer symbol; classify
  approved reference cache, explicit singleton, direct reference with no source
  opt-in or direct operational/policy read,
  or unresolved eligibility. Name the owning source service, successful
  writers/import outcomes and invalidation, watch/tenant-topic coverage, and
  the source-supported reason for a direct-read exception. Do not widen source
  eligibility, financial precision, availability or other business rules.
- Reconcile the final source path, rather than shared imports or earlier report
  claims: finite successful bootstrap before a separate once-bound watch;
  selected-ID/current-option label retention; unchanged draft/dirty state;
  context clearing without old-label restoration; both failure channels and
  Retry; teardown; actual writer/notification coverage. A known unapproved
  mismatch is a finding to correct within authorized scope, not a completed
  implementation. A missing source classification is missing review evidence.
- Record source conformance separately from owner network/runtime acceptance
  for expiry, coalescing, tab return/rejoin, context isolation and visible
  recovery. Existing execution boundaries still apply. UI2 owns the complete
  cache contract; this gate makes its application and evidence unavoidable.

### Space for task content (owner instruction, 2026-10-23)

- Give the main fields, account choices and working data the useful space. Keep
  secondary explanations concise; do not repeat selected labels below a control
  that already displays them. Optional title subtitles must add useful context.
- Preserve the full available width of search/filter strips. Shorter help text
  does not authorize narrowing the strip or placing formerly full-width strips
  side by side (owner clarification, 2026-10-23); retain UI3's sibling-card edges.
- Use the existing shared components' public layout and selection-summary inputs.
  Related compact controls may share a row when their available width permits;
  stack them at the appropriate breakpoint. Do not compress shared control heights,
  touch targets or typography, or add private component skins to save space.
- Reserve table width for the important data. A concise summary may replace a
  long secondary value only when the full value remains reachable through the
  existing selector or View/Edit workflow. An empty optional warning column need
  not take permanent space; render it whenever real warnings exist.
- Keep actionable errors, unavailable selections and financial/reconciliation
  warnings visible when relevant. Never hide them in a tooltip or omit them for
  density. Longer usage explanations belong in the owning in-app guide (Master7).
- Apply this general presentation preference in new work and scoped screen
  reviews. Content and field proportions remain feature-owned; repeated widget
  presentation remains with its existing shared owner (UI3/4/6/13/16).

### Type and contract safety

- No `any` for feature contracts, forms, dialog results, or payloads.
- Models, services, forms, templates, and endpoints agree on nullability and
  enum representation.
- For every new or moved .NET type, verify its declared namespace against each
  consuming file's `using` directives or the actual project `GlobalUsing.cs`.
  A folder name or an import in another file is not evidence of scope. Confirm
  the owning project reference and source-file inclusion; do not duplicate the
  type or add a broad global import to mask a missing local import.
- When an unresolved type is reported in a dependent project, inspect the owning
  project's first source error before changing already-correct consumers.
  Source inspection records declaration/import/reference evidence; it does not
  establish compiler success or authorize a build outside the execution boundary.
- Server-owned values are not trusted from the client.
- Response wrappers are typed and both failure channels are handled.
- A non-2xx response carrying the standard `Result` preserves its safe business
  message instead of being reduced to a generic transport error.

### Error and async behavior

- Handle `isSuccess: false` and the HTTP `error` callback.
- Give every failure exactly one presentation owner: the global error interceptor. A
  feature restores its state and shows its own message only when the request sends
  `X-Skip-Error-Interceptor` (UI block 22).
- Preserve actionable server messages when safe.
- Do not use silent error handlers.
- Prevent double execution.
- Cancel or ignore stale reads.
- End loading state on success, declared failure, transport failure, and cancel.
- Define recovery and retained user state.
- Give every mutation exactly one success-feedback owner. Standard successful
  mutations use the global mutation interceptor; a composite workflow may own the
  final success only when the request explicitly suppresses the interceptor toast.

### Security and authorization

- Authentication headers come from the correct interceptor-enabled client.
- Trace each authenticated feature service to its real injector and `HttpClient`
  chain. Do not repair a missing token by adding a manual Bearer header or another
  feature-level `provideHttpClient` fork.
- Backend boundaries validate tenant ownership, existence, authorization,
  state transitions, and business invariants.
- UI visibility is presentation only.
- Validate upload type, size, path handling, replacement, and abandoned files.

### Translation and terminology

- Add every new key to English and Arabic in the matching feature block.
- Use exact template casing.
- Preserve business terminology from evidence while implementing it with the
  approved component pattern.
- Localize user-facing validation, loading, empty, and error content.

### Accessibility and focus

- Use labels, semantic controls, and meaningful accessible names.
- Support keyboard operation and visible focus.
- Manage initial focus and return focus for dialogs.
- Use correct tab, dialog, table, and validation semantics.
- Do not encode meaning using color alone.

### RTL, theme, and responsive behavior

- Prefer logical CSS properties unless a physical placement is an explicit
  product requirement.
- Verify both directions and supported themes in source.
- Feature styles own their prefix and structural/semantic tokens; the global
  Sigma primary action tokens are consumed rather than redeclared.
- Body-appended overlays receive appropriately scoped global styling.
- Responsive behavior is defined by the guide/reference, not copied from a
  fixed screenshot viewport.
- Apply UI29's responsive consistency gate across all supported size ranges,
  not only desktop/mobile endpoints: trace the CSS cascade at breakpoint
  boundaries and intermediate widths, record expected arrangements and open
  findings, and keep visual acceptance pending until authorized verification.
  Element alignment, usable widths, spacing, coherent action/check groups and
  absence of clipping/page overflow must remain consistent in every interval.

### Performance and data behavior

- Project only required read fields.
- Avoid N+1 queries and unnecessary detail payloads.
- Use stable ordering with paging.
- Define large child-collection behavior.
- Do not load all pages merely to simulate server paging.

### Shared list components

- A list filter strip is the shared filter panel (`form[appFilterPanel]`, UI block 4); the
  feature owns fields, order, width and search logic only. Reset is always present.
- A list route uses the shared page shell (UI block 1: `sigma-route-host`, `sigma-list-page`,
  `sigma-list-panel`, `sigma-list-header`, `sigma-list-table`, `sigma-alert`,
  `sigma-secondary-button`) and `app-data-table [fill]="true"` (UI block 6).
- Phase 6 search before handoff: the changed feature SCSS contains no filter colour, border or
  `data-bs-theme` filter rule, no page/panel/alert/secondary-button copy, no `.p-datatable-*`,
  `.sigma-data-table` or `.p-paginator` override (the grid is customized only through its inputs
  and the `--sigma-data-table-*` variables, UI block 6), and no `var(--…)` whose token is defined
  nowhere. A list screen that needs none of them has no stylesheet.

### Shared pieces, not feature copies

- **Standing owner unification rule, 2026-10-24:** Sigma's existing shared
  components built on PrimeNG own the common look and interaction across the
  application. Find and inspect the actual shared owner/public API first.
  Use it instead of a feature-specific copy or a direct library composition
  that bypasses an equivalent project owner. Extend an existing owner before
  creating another. A missing genuinely reusable capability is implemented in
  the appropriate shared component/directive/pipe/utility/service and adopted
  by affected consumers under the shared-extraction gate below. Do not extract
  model-specific accounting or workflow rules merely because screens look alike.
- A reusable contract covers supported inputs/events, composition/imports,
  appearance/spacing, action and loading/empty/error/disabled states, validation,
  focus/keyboard, RTL/themes/responsiveness and recovery as applicable. Record
  it in its owning canonical block and skill in the same task, then regenerate
  dependent packets. The reference and final source must implement that contract;
  copying shared class names or writing documentation alone does not establish
  uniformity. Record compatibility exceptions with source evidence and authority.
- **Standing owner presentation preference, 2026-10-11:** reusable presentation
  ideas apply generally through the existing shared owner and are inherited by
  current consumers. A motivating screen is not an implicit scope restriction.
  Avoid per-screen opt-in for a general request; an explicitly scoped request or
  source-supported compatibility conflict may justify a recorded exception.
  Preserve feature fields/actions and business contracts. Freeze the general
  decision before edits, then synchronize the owning UI block and skill.
- Changed feature code uses the shared piece named by its UI block and contains no private
  copy of it. Phase 6 searches the changed files for: `toISOString(` on an API date,
  private `parseDateValue`/`parseRangeString`/`formatApiDate`/`toDateInput`,
  `validationMessageKey` or feature error CSS, `EnumToArrayPipe`, an `expand(` all-pages loop,
  hand-built `HttpParams` for `Filters[…]`, `number: '1.2-2'` on totals, a feature colour
  palette (`--<feature>-text/-surface/-border`), and `::ng-deep` into a shared component
  (UI blocks 2, 8, 14, 16, 17, 19, 20, 22, 24).
- Legacy copies in files the change does not touch are left for their own screen review
  (UI backlog 39).

### Shared-extraction gate (owner rule, 2026-10-01)

**After every phase or task, before it is reported complete,** the reviewer asks what in the code
it touched could be shared, and does it in the same task:

1. List the patterns the change repeats — markup, a control configuration, a dialog preset, a
   helper, a validation or reference chain — inside the scope or already elsewhere in the app.
2. A pattern that repeats (twice in the scope, or in the scope and in another screen) becomes a
   shared piece — a component, directive, pipe, util, base-service member or global style — or
   reuses the one that exists. A missing capability of a shared piece is added to that piece.
3. The scope adopts it at once; the remaining copies elsewhere are counted in the UI or backend
   backlog (UI block 30, item 39) and move when their screen is reviewed.
4. The owning book block, the skill and the changelog record it (learning protocol).
5. The report lists what was extracted, or states that nothing qualified and why.

Business-specific code (one screen's rule, one report's query) is not extracted.

### Money and tax

- Tax rates come only from `ITaxPolicyService` (backend) and `TaxSettingsService`
  (frontend); a client rate is resolved, never trusted; no literal rate (`5`,
  `0.05`, `15`) in new or changed code (backend block 5, UI block 19).
- Document VAT is calculated per tax rate and rounded once (`VatPolicy.CalculateDocumentTax`;
  preview `documentTax`), never as a sum of rounded line taxes (D4-4).
- Money is rounded at its source with `FinancialNumberPolicy` / `VatPolicy`; the
  posting engine validates scale and never rounds (backend block 15 rule 8).
- Phase 6 search before handoff: the changed files contain no
  `0.05m`, `15m`, `\* 5 / 100`, `\* 0.05` or a numeric tax default.

### Production notes (owner request, 2026-10-02)

This section records deferred preparation for production. A configuration concern
is not a demonstrated runtime defect: state the evidence, affected scope and
remaining verification. Do not turn a recommendation into a release blocker
without a confirmed failure or an explicit owner decision. Adding a note does
not authorize source changes, builds, tests, restore, database commands or deployment.
Existing execution permissions still apply.

| ID | Note | Proposed preparation before production | Current status and evidence |
|---|---|---|---|
| PROD-01 | Broad compiler warning suppression | Review project-wide `NoWarn`, especially CS8618, CS8602, CS8603, CS8629 and CS4014. When this work is authorized, expose diagnostics and fix actual cases according to their required/optional contract, null checks and awaited operations. Keep justified exceptions local; do not make every property nullable, add `!` or invent defaults just to silence a warning. Treating all warnings as errors is a separate choice. | Deferred recommendation. Confirmed in `SiGma.Repos/SiGma.Repos.csproj:10`. No concrete unprotected null failure was established in the inspected Repos examples; the paging `.Value` use already has a null guard. The initial high-priority assessment was reduced after source follow-up. |
| PROD-02 | Analyzers disabled during build and live editing | Consider enabling `RunAnalyzersDuringBuild` for the production build path. Live analysis may stay disabled if editor performance requires it. Review actual diagnostics and measure build cost before choosing the final configuration. | Deferred recommendation. Both properties are false in `SiGma.Repos/SiGma.Repos.csproj:8–9`; no analyzer violation or performance measurement has been established. Compiler error detection remains active. |
| PROD-03 | HTTP reference alignment with the target framework | Consider replacing `Microsoft.AspNetCore.Http.Abstractions 2.3.11` with a `FrameworkReference` to `Microsoft.AspNetCore.App` for the net10.0 library. Coordinate Repos and Helpers, since Helpers carries the same package transitively. Verify consuming applications and shared-framework deployment requirements before accepting the change; do not remove required HTTP APIs without a replacement. | Deferred recommendation. Package references confirmed in `SiGma.Repos/SiGma.Repos.csproj:14` and `SiGma.Helpers/SiGma.Helpers.csproj:14`. Repos uses IHttpContextAccessor and StatusCodes. No current compatibility failure or vulnerability was established; the package version number alone proves neither. |
| PROD-04 | Duplicate warning ID in NoWarn | Remove one duplicate CS8669 entry when the Repos project file is next edited. Retain the other entry until the separate suppression-policy review decides whether it is needed. | Deferred low-priority cleanup. CS8669 appears twice in `SiGma.Repos/SiGma.Repos.csproj:10`. Duplication does not change suppression behavior or establish a runtime/build failure; no urgent change or release blocker. |

For PROD-03, the framework-reference option follows Microsoft's
[ASP.NET Core APIs in a class library guidance](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/target-aspnetcore?view=aspnetcore-10.0).
The initial evidence is recorded in `reviews/Archive/Completed/2026-10-23/REPOS_PROJECT_FEATURE_REVIEW.md`.
These notes concern the inspected Repos configuration; other projects need their
own source evidence before applying the same finding. Record later notes here
with a stable ID, source location, proposed action and status. After authorized
work, update its status and link the verification evidence; source inspection
alone never establishes production readiness. Backend API validation remains
necessary even when the frontend already checks required fields.

### Compatibility and change discipline

- Check all direct consumers before narrowing a shared contract.
- Keep Transitional behavior only where the pattern book requires current
  architecture compatibility.
- Never copy Legacy patterns.
- Report schema migration and API compatibility effects.

### Code layout (G10, 2026-10-01)

One statement per line, one `switch` arm per line, and braces and line breaks as in the
surrounding code and the reference. A multi-statement line, a compressed `switch` or an
inline `if { … }` block is a review finding even when it compiles: brevity never beats the
reference's readability.

### Dead roots are removed, not rebuilt (G12, 2026-10-01)

A feature root the backlog lists as dead (no menu entry, or a duplicate of a canonical owner)
is removed in the review that reaches it: routes, `LayoutModule` imports and providers, its
translations and spec files. Its live consumers move first to the canonical owner (for example,
the Rental Agreement driver lookup moves to the shared `DriverService`). It is not refactored,
aliased or given a new screen unless the owner asks for it.

### Proportional implementation (G19, 2026-10-01)

Build only what the frozen contract and the screen use. No speculative filter keys, guard
chains, retries, wider loading graphs, or reference checks for relationships that cannot exist.
Each extra mechanism names the defect it prevents, in the contract or in a source comment; one
that cannot is removed in review. Examples and their simpler forms: `reviews/COMPANIES_PARALLEL_IMPLEMENTATION_FEATURE_REVIEW.md` §4a.

---
