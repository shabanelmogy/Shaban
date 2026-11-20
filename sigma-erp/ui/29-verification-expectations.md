## 29. Verification expectations

PrimeUIX CSS overlay motion can finish outside Angular's pending-task tracking.
Rendered tests wait for real animation completion and final overlay detachment,
not only whenStable/whenRenderingDone. Verify focus after removal and next-view
hit testing; never remove arbitrary overlays in test teardown to hide a lifecycle
defect. The shared command cleanup exposed Popover focus-before-detach and
Drawer mask-on-destroy cases (UI1/27,2026-10-22). Keep waits bounded and do not
disable publisher motion or suppress console errors to make tests green.

> **Status: Canonical**

What a source change can and cannot claim.

### Full-width layout acceptance
Before handoff, complete UI1's actual route/host/page/panel/body source chain in
the existing feature review. Name the selectors that win, including encapsulated
feature styles and relevant breakpoints; verify display, width constraints and
flex/grid stretch. For the standard shared shell, the host must inherit the
shared block layout without a feature geometry override. Keep inner workspace
exceptions explicit. A parser pass or presence of `sigma-route-host` proves
neither width nor visual conformance.

Record the following acceptance matrix, proportionally to the screen. Under
source-only execution, fill source evidence and mark visual measurement pending;
do not run a browser/build/test merely because this matrix exists.

| Dimension | Required cases | Acceptance evidence |
|---|---|---|
| State | Empty before any read, required loading, error with Retry, populated/empty result | The same outer card reaches both available route edges with only the shared inset; width never depends on row/content length |
| Available width | Sidebar open/collapsed, wide desktop, both sides of relevant viewport/container breakpoints and intermediate/narrow widths | Compare against the route container, not viewport width; preserve fixed title/filter/actions and internal table/body scrolling |
| Direction/theme | LTR/RTL and light/dark | Both logical edges align; no extra page scrollbar, clipping or unexplained side gap |

When visual execution is authorized, record route/container and card bounds
after layout settles for those cases, with screenshots or equivalent geometry
evidence; identify any intentional shared inset. Do not claim a measured pass
from a source-only matrix. A confirmed source mismatch still requires repair
before handoff, even when runtime acceptance remains pending.

### Loading-speed verification
Every screen review records a proportional load-speed audit and reproducible
verification plan, separately from UI22's visible-progress conformance. Trace
the active route to actual requests, query boundaries, response size and render
work; do not start from a similarly named legacy folder. Inspect duplicate calls,
unnecessary request waterfalls, blocking auxiliary reads, oversized options/rows
and cancelled/repeated searches. Source-only work documents findings and pending
owner measurements; it does not run browser/tests/build/database commands without
their required explicit authorization.

When runtime verification is authorized, compare before/after under equivalent
conditions: build/environment and API/database location, representative tenant
data volume and distribution, filters and page size, cold versus warm approved
cache, device/network conditions and repeated sample count. Measure initial
usable content and settled required data separately, then search/paging/detail
and relevant action/export paths. Separate network/response transfer, backend/SQL
and rendering where instrumentation permits; record unavailable breakdowns as
unknown. Report sample counts and observed timings/median and tail percentiles
only when the sample supports them; do not fabricate precision or a universal
time threshold. The feature contract records any agreed acceptance target.

Use the owner's authorized tooling/evidence to inspect request counts/payloads,
SQL command counts, execution plans, reads and duration; a source ToList count
is not measured SQL traffic. Compare the same output, total counts and action
guards, including empty/large pages and cancellation/failure/Retry. A performance
improvement must preserve financial, tenant, history, paging and complete-export
contracts. Record query fixes and BE2's index proposals/costs with their measured
support or explicitly pending plan/IO/timing acceptance. Existing sensitive-data,
production, execution and migration boundaries remain unchanged.

Authorized Angular test runs must inspect console diagnostics as well as the test
count. TestBed defaults only log unknown template elements/properties; configure
errorOnUnknownElements/errorOnUnknownProperties=true in the shared test environment
so unsupported publisher bindings cannot leave a green smoke suite. Trace duplicate
track warnings to the actual component/spec before editing keys; no schema or console
suppression. A temporary diagnostic reporter must retain the original warning and
remain outside normal bootstrap. CSS color tests wait for the declared transition
to settle before comparing states; an initial frame is not disabled/theme evidence.

**Production stylesheet size budgets:**
`anyComponentStyle` measures emitted CSS for one component, not source SCSS file
size. The owner supplied4KB failures with a largest16.44KB stylesheet. Sigma's
production angular.json now warns at10KB and errors at20KB for this budget;
the owner then supplied an initial-bundle failure at5.22MB against5MB. Initial
now warns at2MB and errors at6MB; optimizations stay unchanged. Use actual owner build
sizes when reviewing a bounded budget adjustment; retain warning/error limits
rather than removing the gate or disabling optimization. Parsing/configuration
review proves only the policy change, not bundle/CSS reduction or successful compilation.

**Critical-CSS warnings:** Angular 17's
`browser-esbuild` runs Critters against the generated index. Critters tests
selectors after stripping pseudo-classes; this can turn valid emitted selectors
such as floating-label and table rules into invalid selectors and report them as
skipped for critical inlining. The complete emitted stylesheet still contains
the original rules. Confirm that distinction from the source/output before
changing valid application CSS or disabling critical-CSS optimization. On the
Windows in-memory build path, a copied asset linked directly as a stylesheet
from `index.html` can also produce an `Unable to locate stylesheet` warning
even when the asset is copied. Small startup-only splash CSS may live in an
inline index style so its first-paint behavior does not depend on that lookup.

| Check | Who runs it | Claimable from source review |
|---|---|---|
| Pattern conformance to this book | author | yes |
| Contract match against the service and model | author | yes |
| Translation keys exist in `en.ts` **and** `ar.ts`, correct block and casing | author | yes, see block 23 |
| Stale imports, dead types, merge markers | author | yes |
| TypeScript compiles | author, scoped build (Master5) | only when the build was executed |
| Affected unit tests pass; changed files lint clean | author, scoped run (Master5) | only when executed |
| Full test suite | owner | **no** |
| Runtime behaviour, network headers, `401` cause | owner | **no** |
| Visual match, light and dark, LTR and RTL | owner | **no** |
| Responsive consistency across supported widths, breakpoint boundaries and intermediate sizes | owner | **no** |
| Backend persistence and authorization | owner | **no** |

State honestly which of these were not performed. Source inspection is not proof
of runtime behaviour, and "it looks right in the diff" is not verification — the
`mangeDetails.cVV` fix in this repository was placed in the wrong translation
block on the first attempt and read correctly in the diff.

### Responsive consistency gate
Every new or reviewed screen must preserve coherent element sizes, spacing and
alignment across the entire supported screen-size range. Desktop and mobile
endpoints alone do not establish responsive conformance. Review each layout
interval, both sides of every viewport/container breakpoint and representative
sizes between them, including widths supplied by the owner. Resize through the
intervals during authorized visual acceptance to expose gaps between rules.

Record a responsive matrix in the screen review: size/range, expected field and
action arrangement, evidence inspected, findings and visual acceptance status.
For each arrangement verify:

- Field widths remain usable; labels, selected names, dates and numbers do not
  overlap controls, get unintentionally clipped or force page overflow.
- Related controls retain consistent heights, logical edges and spacing;
  checkboxes align with their adjacent labels and the intended control line.
- Actions wrap or move as one coherent toolbar and remain reachable. Preserve
  an explicitly required group arrangement, such as checks on one mobile row,
  instead of independently stacking its items.
- Validation feedback, long values, empty/loading/error states and translated
  Arabic labels do not break the arrangement. Check both directions and themes.
- Height changes preserve the documented internal scroll owner and fixed
  header/actions/paginator; no page scrollbar appears (UI1).

Source review must trace the complete CSS cascade, including later shared
selectors that can override breakpoint rules. A remaining known inconsistency
is an open finding, not a passed check. Source-only work records visual
acceptance as pending; it must not claim all-size visual verification. Run
browser/application acceptance only within the authorization in the live
companion's permissions (section 4), otherwise hand the matrix to the owner. The Leave/Holiday1365-to720
failure demonstrates why checking only the desktop/mobile rules is insufficient.

Owner acceptance pass for a screen built from this book:

1. Exercise every workflow that the screen actually owns: Create/View/Edit/Delete
   for CRUD, confirmed domain actions for stateful screens, and no invented CRUD
   acceptance step for read-only reports or settings-only workspaces.
2. For editable surfaces, cancel a dirty form, cancel a clean form, and close View
   mode; verify X/Cancel/Escape share the same dirty-close rule where applicable.
3. For paged lists, filter, page, sort where supported, change rows-per-page, and
   delete the last row on a page. Confirm stale/overlapping requests do not replace
   newer results.
4. Export with filters applied; confirm row count, column order and translated
   headers. Print the full report when print exists, not only the visible viewport.
5. Switch to Arabic: check direction, directional arrows, tab keyboard direction,
   logical-start/end alignment, and that no raw key appears.
6. Switch to dark theme, including every dialog, dropdown/calendar overlay,
   filter surface, table header and totals/summary surface.
7. Check the narrowest supported viewport and keyboard-only operation: visible
   focus, associated labels, first-invalid-field focus, dialog focus trap/return,
   editor-tab Home/End/arrows and accessible icon-only actions.
8. For financial editors and dense accounting reports, verify exactly one row/table
   vertical scroll owner after the approved cap, sticky headers, unclipped body-
   appended overlays, totals/actions remaining visible outside the row scroll, and
   no page scroll at the narrowest supported width (panes rearrange; the page never
   scrolls).
9. For hierarchy and tabbed settings workspaces, verify the documented single
   content-scroll owner, responsive stacking/overflow, selection/tab restoration,
   and that fixed Save/header/tab controls remain reachable.
10. For reports, verify backend-owned totals/KPIs, empty/not-run/error states, and
    print mode releasing fixed heights/overflow so all rows can flow across pages.
    Include more matching rows than the API's page-size cap: compare the actual
    count with reachable grid rows, print/Excel scope and totals scope. Exercise
    every conditional filter, custom toggle on/off and invalid/reversed boundaries,
    change filters after success and during a delayed request, and confirm that
    partial dates and load failures follow the documented validation/feedback owner.
    These remain owner acceptance steps; source review alone cannot certify them.
11. For at least one protected GET and one protected mutation from the reviewed
    feature, confirm the request carries `Authorization: Bearer …` without
    recording the token value. If it does not, check that the request URL starts
    with `environment.baseUrl` (the interceptors act only on Sigma API requests,
    block 1) before changing feature code.
12. For every successful mutation exercised during acceptance, confirm exactly
    one success notification appears. A standard mutation should be reported by
    the global interceptor once; a feature-owned composite workflow must suppress
    that interceptor toast and emit only its final success after all required
    refreshes complete.
13. On every screen, at desktop and the narrowest supported width, with and
    without a resolved page title, confirm `.app-content` shows no scrollbar and
    that only the documented component (grid rows, form pane, or dialog body)
    scrolls.
14. Complete the responsive consistency matrix above, including intermediate
    sizes and breakpoint boundaries; correct observed inconsistencies before
    accepting the visual result.

**Source-only compile guard — TypeScript library level.** Builds require explicit
owner authorization. Check effective libraries independently of emitted syntax.
Angular21's CLI migration removes the old ES2018 override, so the ES2022 target
now selects default ES2022 browser libraries; older blanket API prohibitions no
longer describe the application. An explicit lib in another config still wins.
Do not introduce newer declarations/polyfills for a local feature fix; compare
the installed TypeScript declarations and supported browser contract. Source
parsing proves syntax, not types or runtime compatibility.

**Angular21 test configuration compatibility.** The application
Karma builder discovers spec entries, so the test bootstrap no longer uses
webpack `require.context`. A custom `src/test.ts` initializes BrowserTestingModule
with an explicit test NgModule providing `provideZoneChangeDetection()` to
preserve existing async/fakeAsync assumptions. Importing zone.js/testing alone
does not select Zone change detection in Angular21. Keep Jasmine types in the
spec config and specs out of the application roots. Configuration inspection
and application compilation do not constitute a test run; tests still require
owner authorization.

**Generic helpers over typed forms.** Inside a generic class, `FormArray<TRow>.controls` and
`.at()` resolve to Angular's `ɵTypedOrUntyped` union (`TRow[] | AbstractControl[]`), not to
`TRow`, and fail with `TS2322`/`TS2345`. Read the rows through one getter that casts
(`this.array.controls as TRow[]`), as `EditableRows` does.

**Check:** report lists what was and was not verified · no runtime claim from
source alone · owner acceptance steps included in the handoff · no API newer
than the `tsconfig.json` `lib` level.

**`tsconfig.app.json` `files` (G17, 2026-10-01).** Add a runtime entry only after the compiler
reports that file missing. Never add feature files pre-emptively, and never add a broad
`include` (root AGENTS, *Frontend and contract rules*).
When retiring or moving a runtime root, reconcile its existing explicit entries as well
as route/import references. An obsolete `files` entry still compiles a removed screen;
remove it, keep test files in the test config, and check that the remaining roots exist.

---
