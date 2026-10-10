# PHASE 2: Read Path and Grid

Use this packet for the complete path from Angular filters through the backend
query to Grid rendering, paging, and export.

## Canonical provenance

{{SOURCE_FINGERPRINTS}}

Approved references by read-path shape:

{{APPROVED_REFERENCES}}

Reference ownership is explicit:

- reusable table shell and rendering: `shared/components/data-table`;
- list shell, shared filters and typed paging/sort/request integration:
  `Workshop/Job/components/list`;
- shared filter presentation: `shared/components/filter-panel` (UI 4);
- read-only unpaged report strip/totals: `Accounts/TrailBalance/components/list`
  (UI 20; its legacy controls are not authority over the current owning blocks).

Do not treat one of these references as authority for the other shapes.

The Master Guide and canonical pattern books are authoritative. This packet is
derivative. Stop using a packet that disagrees with canonical sources. Follow
Master block 8: run recipe `-Check` before use; reconcile initial drift or changed
book/template/manifest claims, regenerate affected packets through the generator,
semantically review their source rules and approved-reference roles, then rerun
`-Check` before use or handoff. Record packet IDs and review evidence. Preserve
unrelated changes; source-read-only review still forbids application-source edits.
Use canonical sources and report a precise blocker for unresolved conflicts.

## Mandatory in-place list replacement

When the requested feature already has a list component, refactor that component
in place. Do **not** create a parallel “new list” component, duplicate route, or
second grid implementation.

- Replace `ms-lib` `<table-list>` or feature-local PrimeNG table markup with one
  shared `<app-data-table>` in the existing list template.
- Remove `TableListComponent`, `tableList.dt`, `ListCol`, `ColType`, wrapper
  flags, and remote internal-table mutation from the existing list TypeScript.
- Keep the existing feature route and service boundary unless confirmed source
  requires a contract change.
- Preserve Create/View/Edit handoff to the single editor selected by UI block
  13's D4-2 rule and frozen in Phase 1: fields only or one small child list
  without totals use a controlled modal; two or more child collections, totals,
  or approval/posting use a routed editor. Phase 2 does not create another
  editor. Create, View, and Edit use that same selected editor in all modes.

A request to restore or preserve an older filter, title, or action-button
appearance applies only to feature-owned layout and styling. It never permits
restoring a legacy table wrapper, direct feature-owned `p-table`, shared-table
internal mutation, or a sibling feature stylesheet import. If the shared table
lacks a required public capability, improve the shared component in scope and
keep the consumer on `app-data-table`.

This is a replacement requirement, not permission to add a competing list path.

## Purpose

- Keep filter, paging, query, ListVM, and Grid contracts identical.
- Verify async read behavior and stable refresh semantics.
- Prevent screenshot-visible values from becoming invented backend fields.

## Included concerns

- Page title and list-level actions.
- Search and filters through the shared `appFilterPanel` for lists, with
  optional advanced controls, mandatory Reset and shared theme/responsive
  behavior; UI 4 owns the values. Reports follow UI 20, including its explicit
  review evidence for existing paged report responses; transport is inspected.
- Any date filter, per block 17: typeable (`[readonlyInput]="false"` with
  `[keepInvalid]="true"`), no icon and no `[showIcon]`, a single range picker
  opening on two months (`[numberOfMonths]="2"`), defaulting to the current
  month. Use `appDatePicker`; single-date fields use its required
  `dateInputMask` recipe. UI 17 owns validation and scoped owner exceptions.
- No page scroll, per block 1: the grid rows are the screen's single scroll
  owner; title, filters, and paginator stay fixed.
- Four-layer reusable table integration: shared component, feature template,
  typed feature paging/sort TypeScript, and feature placement/token SCSS.
- Optional typed whole-row activation for a confirmed, unambiguous workflow.
- Optional current-page checkbox selection for a confirmed batch workflow.
- Exact serialized filter keys and parsers.
- Remote paging, stable sorting, and `TotalCount`.
- Angular list model, backend ListVM, and displayed columns.
- Row display transformations and action-state fields.
- Loading, empty, declared-failure, and transport-failure states.
- Cancellation and stale-response prevention.
- Delete/action refresh interaction with current paging.
- Exported columns and export query behavior.
- Read-query projection and performance.

## Explicit exclusions

- Add and Update payloads.
- Editor form architecture and validation.
- Child reconciliation.
- Independent approve, post, void, or finalize transitions.

## Dependencies and input gate

Required:

- Phase 0 manifest and Grid evidence rows.
- Phase 1 read contract.
- Exact approved reference for the read-path shape (list or report).

Do not start implementation while required Grid values have Missing or
Conflicting source contracts.

## Procedure

1. Freeze exact visible header/body column order; lists with row actions keep
   Actions first. Reports do not gain CRUD actions merely to reuse a grid.
2. Record separate evidence for the shared table, feature template, feature
   TypeScript, and feature SCSS. Treat `table-list`, `TableListComponent`,
   feature-local `p-table`, `tableList.dt`, `ListCol` and `ColType` as Legacy —
   do not copy or retain in a refactored list.
3. Write displayed/action needs beside frontend and backend properties.
4. Remove non-consumed ListVM fields only after checking direct consumers.
5. Freeze filter property names and exact backend key casing.
6. Verify the list filter form uses the shared `appFilterPanel`, with at most
   six main fields, optional `appFilterAdvanced` and `appFilterActions`,
   mandatory Reset, and explicit wide/full modifiers for spanning groups.
   The shared panel owns uniform columns, 8px title alignment, responsive
   layout, theme and RTL; UI block 4 owns its values. Remove feature filter
   styles during review; do not preserve a legacy compact or flat grid as an
   alternative canonical presentation. Reports use UI block 20's shared strip.
   For checkbox filters, apply UI4's control-box centering check independently
   of heading/validation height and wrapped-row placement. Do not treat a
   feature's pixel offset as a canonical shared recipe.
7. Verify false, zero, empty, enum, date, and multi-value serialization.
8. Verify page-size clamp, `CountAsync`, total pages, and stable ordering.
   Resolve table paging with `resolveListPaging` against the previous feature
   page/size before signal writes (UI 6). A size-only change on page 1 must
   fetch, identical page/size must skip, and a new valid page request must
   cancel a superseded one using UI 28's trigger stream rather than being
   discarded after pager state changes. Sorting is a separate backend-confirmed
   part of the query; the shared helper does not invent sort support.
9. For lists, verify server paging rather than client slicing or load-all behavior.
   For reports, inspect request/backend slicing and prove the chosen UI 20 dataset
   contract: actual server counts or a complete collection before local paging.
   Result<T> can contain a paged collection; page 1/200 is not proof of completeness.
10. Verify read cancellation, loading finalization, and both failure channels.
11. Define refresh behavior after delete and other row actions, and record the
    success-feedback owner. A standard successful mutation uses the global
    mutation interceptor once; the feature must not add a duplicate success toast.
12. If the whole row opens a confirmed workflow, opt in through the shared
    table's typed row-activation API and verify click, `Enter`, `Space`, focus,
    and nested interactive-control suppression.
13. If a confirmed batch workflow acts on selected rows, use the shared table's
    checkbox column, keep selection typed and feature-owned, scope select-all to
    the rendered page, clear selection when the result changes, and verify that
    checkbox interaction does not activate the row.
14. Verify export fields and all matching pages, click-time translations,
    shared grid formatting and failure handling per UI 8; no partial file.

## Required outputs

### Column and ListVM contract

For reports, compare the existing report row/response DTO instead of inventing a
ListVM or row actions. Apply the report evidence below for its actual transport.

| Grid column or action need | Frontend property | Backend ListVM property | Display transformation | Contract status |
|---|---|---|---|---|
| Identity/action target | `id` | `Id` | None | |
| | | | | |

Name every removed ListVM field.

### Reusable `app-data-table` integration evidence (list shape)

| Layer | Required source evidence | Status or finding |
|---|---|---|
| Shared component | Exactly one direct `p-table`; typed `DataTableColumn<T>`; actions, custom cell templates, optional accessible row activation and checkbox selection, table-owned paginator, translated headers, loading/empty states, and table-level theme/RTL-safe styling | |
| Feature template | Exactly one `app-data-table` with typed data/columns/actions, paging and sort inputs, translated report/empty keys, error-aware empty visibility, one lazy-load output, optional typed row activation, and optional current-page typed checkbox selection only for confirmed workflows | |
| Feature TypeScript | Typed columns and lazy event; resolveListPaging compares previous state before writes; API totals; sort whitelist from backend-supported columns; cancellable request stream. No TableModule, table ViewChild or internal mutation | |
| Feature SCSS | Shared list shell, filter panel and app-data-table fill mode own placement/theme; only supported public --sigma-data-table-* variables for real feature variation. No feature filter/grid/paginator copies or Transitional deep fill block | |

The footer remains owned by the direct `p-table` inside `app-data-table`; there
is no second pager. A server-paged grid uses the API count; an explicitly complete
report collection may use its length for local presentation paging (UI 6/20).

### Report review evidence (required when a report is in scope)

Use UI 20's owning table; name actual frontend consumer and backend producer
symbols, the confirmed contract and final match/finding/Uncertain result for:

- request page/size, backend clamp/slicing, row/count metadata, totals scope,
  complete local collection or server paging, and full print/Excel scope;
- every conditional control's FormGroup ancestor, typed member and validity;
- applied-filter lifetime, reactive busy disable/enable, invalidation/retained
  applied-filter display, reset and late-response behavior;
- conditional toggle-off/default meaning, effective validated custom boundaries
  and matching labels across grid/summary/print/Excel;
- shared date mask/placeholder/serialization and current-language values;
- one error owner with its skip header when inline, declared/transport lookup
  recovery and distinct not-run/empty/error output.

UI 21 owns full-print preparation; UI 29 owns runtime acceptance. A shared import
or former review's "Matched" row cannot replace these source comparisons (Master 5).

### Filter contract

| UI control | Angular property | Query key | Backend key | Parser/type | Default/absence behavior |
|---|---|---|---|---|---|
| | | | | | |

### Paging and refresh contract

| Event | Requested page | Retain filters | Retain sort | Empty-last-page behavior | Expected refresh |
|---|---|---|---|---|---|
| Initial load | | | | | |
| Search | | | | | |
| Page change | | | | | |
| Page-size-only change on page 1 | 1 with the new size | yes | yes | API-clamped | Fetch again |
| Identical page and size | unchanged | yes | yes | unchanged | Skip unless another query field changes |
| New valid page during loading | newest requested page | yes | yes | API-clamped | Cancel superseded request, fetch newest |
| Delete success | | | | | |
| Editor success | | | | | |

### Export contract

| Export column | Source field | Transformation | Scope | Missing contract |
|---|---|---|---|---|
| | | | | |

## Continuous gates

- ListVM equals displayed columns plus identity and real row-action state.
- A visible screenshot column is evidence, not a new DTO authority.
- Filter casing matches exactly across Angular and .NET.
- List filters use the shared panel and its main/advanced/action projections,
  mandatory Reset and fixed grid. Theme, responsive behavior and 8px title
  alignment are owned by UI 4, not feature SCSS. Reports use UI 20's strip.
- A filter date is typeable and its calendar carries no separate trigger button;
  a range filter opens on two months and its field still occupies exactly one
  grid column.
- The route host claims the box the shell already sized (`height: 100%`) and does
  not compute a second page height. The card's distance from the TopBar and the
  footer is owned by **outer** spacing — the route's outer padding — while the
  card's internal `padding` stays at its designed value; the card's outer edge,
  border, and shadow move only when outer spacing changes. The shell toolbar band
  is not a screen-scoped lever: it is the shell's own desktop value (`16px` above /
  `8px` below) and a feature must not override it.
- Actions column is first and follows the approved shared cycle.
- Report evidence follows UI 20, with no invented CRUD actions; its actual
  transport/count/totals/print/Excel contract is verified before local paging.
- Loading and errors cover both API failure channels.
- Every list-owned mutation has exactly one success-feedback owner; standard
  mutations rely on the global interceptor and do not add a feature success toast.
- Paging uses resolveListPaging before signal writes; a page-size-only change
  fetches, identical query state skips, and UI 28's switchMap/defer cancels
  superseded page requests instead of losing them behind a loading guard.
- Opt-in whole-row activation is keyboard accessible and does not capture
  nested links, buttons, or form controls.
- Opt-in checkbox selection uses stable row IDs, has translated header/row
  labels, scopes select-all to the rendered page, clears when results change,
  and never triggers whole-row activation.
- Shared table styles own the PrimeNG wrapper, table, cells, action control,
  dropdown, paginator, light/dark defaults, and white solid-button icon.
- Shared shell classes own Grid placement. Feature customization uses only
  public `--sigma-data-table-*` variables for confirmed variation.
- Translation, accessibility, RTL, theme, and responsive checks occur now.

## Expected handoff

Phase 4 receives the row-action inventory and refresh contract. Phase 6 receives
the final column, filter, paging, and export tables.
