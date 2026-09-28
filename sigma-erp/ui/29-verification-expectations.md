## 29. Verification expectations

> **Status: Canonical**

What a source change can and cannot claim.

| Check | Who runs it | Claimable from source review |
|---|---|---|
| Pattern conformance to this book | author | yes |
| Contract match against the service and model | author | yes |
| Translation keys exist in `en.ts` **and** `ar.ts`, correct block and casing | author | yes, see block 23 |
| Stale imports, dead types, merge markers | author | yes |
| TypeScript compiles | owner | **no** |
| Unit tests pass | owner | **no** |
| Runtime behaviour, network headers, `401` cause | owner | **no** |
| Visual match, light and dark, LTR and RTL | owner | **no** |
| Responsive behaviour at each breakpoint | owner | **no** |
| Backend persistence and authorization | owner | **no** |

State honestly which of these were not performed. Source inspection is not proof
of runtime behaviour, and "it looks right in the diff" is not verification — the
`mangeDetails.cVV` fix in this repository was placed in the wrong translation
block on the first attempt and read correctly in the diff.

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
11. For at least one protected GET and one protected mutation from the reviewed
    feature, confirm the request carries `Authorization: Bearer …` without
    recording the token value. If it does not, verify the service resolves from
    the current interceptor-equipped `LayoutModule` injector before changing
    feature code.
12. For every successful mutation exercised during acceptance, confirm exactly
    one success notification appears. A standard mutation should be reported by
    the global interceptor once; a feature-owned composite workflow must suppress
    that interceptor toast and emit only its final success after all required
    refreshes complete.
13. On every screen, at desktop and the narrowest supported width, with and
    without a resolved page title, confirm `.app-content` shows no scrollbar and
    that only the documented component (grid rows, form pane, or dialog body)
    scrolls.

**Check:** report lists what was and was not verified · no runtime claim from
source alone · owner acceptance steps included in the handoff.

---

