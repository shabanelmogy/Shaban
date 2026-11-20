## 5. Continuous quality gates

**Topic files of this block** (read only the one the task needs; they are part of this block):

- [Scoped build, test and lint checks and authorization scenario evidence](05/01-build-test-and-scenario-evidence.md)
- [Load-speed, query and index, loading conformance and cache adoption evidence](05/02-performance-loading-cache-evidence.md)
- [Shared list components, shared pieces and the shared-extraction gate](05/03-shared-owners-and-extraction.md)
- [Production notes](05/04-production-notes.md)

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
