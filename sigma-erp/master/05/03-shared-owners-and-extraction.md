<!-- Part of Master block 5: see ../05-continuous-quality-gates.md. Same status and authority as the block. -->

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
