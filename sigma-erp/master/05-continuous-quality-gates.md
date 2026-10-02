## 5. Continuous quality gates

These gates apply during every phase and are audited again in Phase 6. They are
not a late cosmetic review.

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
- These checks are source-only under the standing execution boundary. Do not
  claim a visual/runtime pass from inspecting code. Keep the evidence proportional:
  reuse the required plan/review instead of creating another checklist artifact.
- A conformance row names the actual target consumer and producer symbols plus
  the compared contract/value. A reference path or shared-component import alone
  cannot earn "Matched". Missing source evidence is Uncertain; known mismatches
  are findings; source conformance and pending visual/runtime acceptance stay separate.
  For report changes, require the response/filter/output evidence in UI block 20
  before and after implementation. Reconcile the final request and backend slicing,
  not an earlier artifact's claim that the response is complete.

### Type and contract safety

- No `any` for feature contracts, forms, dialog results, or payloads.
- Models, services, forms, templates, and endpoints agree on nullability and
  enum representation.
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
The initial evidence is recorded in `reviews/REPOS_PROJECT_FEATURE_REVIEW.md`.
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
