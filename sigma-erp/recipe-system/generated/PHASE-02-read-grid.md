<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-02-read-grid | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-02-read-grid.template.md -->
# PHASE 2: Read Path and Grid

Use this packet for the complete path from Angular filters through the backend
query to Grid rendering, paging, and export.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:38d22849a6d25f64baa38c14562b4c85f08b29199ca287825471c3cfdacaf0e7
- master.1: ## 1. Governance and review principles | sha256:3e69ec4d48c952286dea7792d9e442d37585c15446b7ef02531c8a54053558cf
- master.2: ## 2. Screenshot and visual evidence policy | sha256:2765a62adfb7b5913db822c98348b3a456a6ee504e8ed4d2434881a593cf41f5
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:2d02535a738d0a1e03f44f22ff5ac7028554bc00cf9e8517245d3cf9e4c5811e
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:542c18b6aebf46ed0eef2c290f184e04de0eea49bea5d148c7e423b05f7259c7
- master.5: ## 5. Continuous quality gates | sha256:8d4f483fc5c4e3c0f84bb76153f0b2c5c70972699a9fa69e4fc7ed6e0667831b
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:685e9463fc13be9a9d9d7ed261ee88f5aee17f3ded08472af4daf0587aa945b1
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:40836082dd49994bd2e8b88b6f888b21d1c4eeabf5e09e95eefa9f4fc2725ca5
- ui.1: ## 1. Feature folders and wiring | sha256:79e212088175339714601266bbae05767576de0a7a6340330b513a9eb252463d
- ui.2: ## 2. Service and response wrappers | sha256:9794e35d4273c605ac98288b23095738d03eacfc9af4f7b2fba2f69838e36bc4
- ui.3: ## 3. Header | sha256:7114dd05b36427d8bdc11579e6eccfc67aebb5612fd1688eb41aeec720243ed2
- ui.4: ## 4. Filters | sha256:11483ad20ce841276543544f0190c82e588e7bcefefc73df5bcd5d08045c18ed
- ui.5: ## 5. Columns | sha256:987bc8f2b9e07fcde2040866c7d5e1bdf4ece16f47ff76fc34eca975583dce33
- ui.6: ## 6. Grid and footer | sha256:eba7e8c13b82b4e274155477d160d3d8eba445b885da81609391d7bee4839063
- ui.7: ## 7. Action button cycle | sha256:62ab02ec6d136911130f189df3b805427a8b4d952cea916799a6a7640badc197
- ui.8: ## 8. Export to Excel | sha256:3886776baa1bc912f3a525cc742564fbb9edc8302f8d4036699af624001839d3
- ui.9: ## 9. Confirm: delete | sha256:b446c09fa7fe12e63f8aa03e99f184ebb14f957fa585576931ddd8f15cb6fd75
- ui.15: ## 15. View mode | sha256:022f00069635b29f668f8ca24b27ef784df55a57a05ae66594c166e74263184c
- ui.16: ## 16. Dropdowns, lookups, enums | sha256:32f7a23d394be847f7274000569266f733bcdf3f85aa5e2bc267734680b9846c
- ui.17: ## 17. Dates | sha256:c3c2dcb258d006774350cdda4bcbc0edf2ac31281f34ea2162ed973c0cc55287
- ui.19: ## 19. Validation messages | sha256:94a516e370c206deb5d4d80c34a2daa9d1898bb15bb0e8a58ec8c687e63e9a14
- ui.20: ## 20. Report page | sha256:93a21b17708466271359264af74994baa845426567c84aed868219064006571b
- ui.21: ## 21. Report print | sha256:2e6cc0be29f3d57b6207c5519aee74fa6b30576e92a4b79312fee0f6deafe171
- ui.22: ## 22. Loading, empty, error, toast | sha256:244bc2d6f185f10764d640c98de0e0ff53650e96bede01d5a1dffdf96f5303ca
- ui.23: ## 23. Translations | sha256:2410720acfe260652c5d9c6e0f801aa3881a21f18a1b1a3de4acc7478bcf1c6e
- ui.24: ## 24. Colors, icons, buttons | sha256:6729bb2594a33b250ebe2be5fd74ea31ff0680c020d4922da72d2009fd58aba1
- ui.25: ## 25. RTL and dark theme | sha256:7239bd7a1b0de149e09f0cf704ddc404e46af34f60e3f1548c293b00fbbf3061
- ui.26: ## 26. Permissions and route access | sha256:468e5ceba58128db01cd338059c6119761123144af55950bfaaf1a2d4866f0ff
- ui.27: ## 27. Focus and keyboard | sha256:73ccaf72760b8799fc815e44b6e1d3c21696dd91f837bfa7a468f9bc8b0e359f
- ui.28: ## 28. Request cancellation and stale responses | sha256:6c7c3c8a71a8681f46e2cef26d7efd5872fdbbaffa991f5e7c9adc592f4b385d
- ui.29: ## 29. Verification expectations | sha256:a8d4e22e935094a158791ace96c9effb34032888fd03fa6eb1c9151b5751a0d5
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:52c019490aab53c0d1d9e73a2e36446e9e66c35d999166bf890219be9cde49cf
- backend.7: ## 7. ListVM scope rule | sha256:24fbfbcf92b61da465eb4b8b4d9aa50f2c48c1f43e8711402843db1ff1a7771e
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:23f348643a40f97c07438d987af182efc5500e5e20c425c8574dffeb5b58d98a
- backend.9: ## 9. Search model and filters | sha256:ed70dc50b04cd8d3504475724d2cd14c41290701d83d78aba58eba06dffb1d25
- backend.10: ## 10. Select and dropdowns | sha256:700a3fc93df824f337cf2bf5c2fe12f866d8aee46c8be35976a2fccf7fa533cb
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:edfeb2f60ddcaaa73b8b31192afaba55bee59f8dde932beb111c6181e2d8daa2
- backend.17: ## 17. Pattern 5 — Reports | sha256:57ec4fd3d996915f15d15c7baad51a573b258d24cd19680dc1c2f10ef437aa73
- backend.18: ## 18. Edge cases | sha256:f7abc5b7753f5dadd9c00017864c17e86a1c71666715799ba4d9f1e21f359daa

Approved references by read-path shape:

- `SiGmaAngularFrontEnd/src/app/modules/shared/components/data-table`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/filter-panel`
- `SiGmaAngularFrontEnd/src/app/modules/Workshop/Job/components/list`
- `SiGmaAngularFrontEnd/src/app/modules/Accounts/TrailBalance/components/list`

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
