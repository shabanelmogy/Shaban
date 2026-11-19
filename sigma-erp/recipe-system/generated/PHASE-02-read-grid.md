<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-02-read-grid | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-02-read-grid.template.md -->
# PHASE 2: Read Path and Grid

Use this packet for the complete path from Angular filters through the backend
query to Grid rendering, paging, and export.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:a56c86bda3deb92b3f1892bfb6e323ae991d0aa315ba1183a531303dbf88bd06
- master.1: ## 1. Governance and review principles | sha256:4af3c22f52464c9696ac85adb7f000d9c89d1bd76ecabfffa2662030d5fa66b2
- master.2: ## 2. Screenshot and visual evidence policy | sha256:8e602319017e268b923ed2bb8b7a8d21a1a3252640f23a986d99821842ea0c6f
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:416b24a6d74c22be5d7f8d37480fab2ef17fa7ddb0d3e4f1632795ed813558d0
- master.5: ## 5. Continuous quality gates | sha256:db683d8cd9d81f554a0a9711335795c930c8e0846d9bc73fcf40f1da6084171f
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:ad1ffed7bdf0b87f1c739ec1c7146a76c8a7d516f4d50e666cdeef3a7fb98b1c
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:8ee8fccad52b59f3ee3a04025d65de169c15d3dc986631ebbda114a9f8dc1e95
- ui.1: ## 1. Feature folders and wiring | sha256:c4df20098e8e79cd73612e9fb0128bfcb8c75d4390c745a8bc636906e517aa1f
- ui.2: ## 2. Service and response wrappers | sha256:f3a7b69c4ad6f7f09008f0dac6cb67b18d88fd938e2e64c568380e3b7d116bb7
- ui.3: ## 3. Header | sha256:1e306ffae7e2e436e6eb354ef3fa7e12c8a131877efb52ff475cea07a3cb2892
- ui.4: ## 4. Filters | sha256:c1987a0baf932b729b6e40e300fe831cc41ef7217dfbc51ddca8fac474dbc293
- ui.5: ## 5. Columns | sha256:94c69136f60aa67980faee4318970d957142b4d2ac98f2bc2b549fc6fee8bd3f
- ui.6: ## 6. Grid and footer | sha256:91b9c9804b9d32e952e59230d015305b63e3c8632eea823508b466f724e6837f
- ui.7: ## 7. Action button cycle | sha256:d761c13f061cd62f22c5216391ce26364f1d2cb427973a2adcfbc9cdce4d770e
- ui.8: ## 8. Export to Excel | sha256:72abfe42a49132de80ba3aba5e3b3d4f2768bc68d05bce1ad4531a27d75ed329
- ui.9: ## 9. Confirm: delete | sha256:54b220b80d7129d76c43ee26792787028fb140c1c99b540189776b8ed1c58c20
- ui.15: ## 15. View mode | sha256:d65759cb2f87af8e2c60a44951906befcb022b449bb0fc709f0f8af000ed9911
- ui.16: ## 16. Dropdowns, lookups, enums | sha256:a3da0497ac2b3a9f7ec3f25a6f3c0693ab65ddf5e7f4fb0834ca9dcbcb0efd1a
- ui.17: ## 17. Dates | sha256:69a4324f1a97950349ab5ba6b3b9274bfe8e0f9db2f15b5eca62b186cbb442d5
- ui.19: ## 19. Validation messages | sha256:6e7f00d5fed6d68fe924aa9d2bf6b64bba9368624df97317680d14ad6f5870d9
- ui.20: ## 20. Report page | sha256:ef1ef058604b6a78bb26e08e2a0d27528623482c353bb6e0f3f2ae1aa35a3754
- ui.21: ## 21. Report print | sha256:11ea0a036c9d332fa9687d37ef1d4efe9843c0a23252c52bd60f398425fd9db6
- ui.22: ## 22. Loading, empty, error, toast | sha256:895b36e116e8ead97b444e10d6ff9fa7c127a7e6606b18ed80952387b3789974
- ui.23: ## 23. Translations | sha256:0cf1190b29df3b524017967f0fba1a4611c683b902cb344278193f5e06de1377
- ui.24: ## 24. Colors, icons, buttons | sha256:fbaf5c46def760c9466d4d4082c393dfb56a950b1cf0b489e05336d7a821c378
- ui.25: ## 25. RTL and dark theme | sha256:43a3a8e0348d40c7dabf045d26827de50445cb6ba22441e1a7b9db9cdc8f8179
- ui.26: ## 26. Permissions and route access | sha256:ce3f2c451a72880ac11e264517cb14795d8539ef326b281ce297f75ae5d59223
- ui.27: ## 27. Focus and keyboard | sha256:8f5713225ff4aecd70093f9ac8e6ba96c91003126335ebad80f925e573fa8586
- ui.28: ## 28. Request cancellation and stale responses | sha256:b9ee811088e53d9771459815766c135cee973724042db691a7a4444ab5408325
- ui.29: ## 29. Verification expectations | sha256:857fd2de21235042c2d3c3d8af841d8bed3580a97bed2ff1680f6a3c2c291f04
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:0983535564fda910eb148cbb4a66079548016ce287b95a9409c7cec41974ed0a
- backend.2: ## 2. Step 2 — EF configuration | sha256:6fc404d5c366c960f1ff9292a0b9ce4b69c6825da3f4416385af0389c0ebc386
- backend.7: ## 7. ListVM scope rule | sha256:6ae3e69d94ccc02a60bd005f20020b7cd4b9f105b81afa9baf63c427cfa05caa
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:9ffa9db969ffca5f271d1d047180ffd0fa5e7416eab045c9d3688b79c88c2e12
- backend.9: ## 9. Search model and filters | sha256:4ef414b8a321331568d54b24460ed22775a51164f055f89cb217841f815639dd
- backend.10: ## 10. Select and dropdowns | sha256:61f5fb1f28d7992cf7610dfbe5a9e4fc6d08fd656230d72ab36067a6f1c04925
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:edfeb2f60ddcaaa73b8b31192afaba55bee59f8dde932beb111c6181e2d8daa2
- backend.17: ## 17. Pattern 5 — Reports | sha256:44e453b0f1099ea1885b08213580864c71447e9e93b0b1cf24f5fb81d7362742
- backend.18: ## 18. Edge cases | sha256:13d0548154a54a05fda8d1276d7d19529ee31b2b79d7945ab1363e7f18abb6f0

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
- Exact serialized filter keys and parsers. For protected endpoints, reconcile
  server allow-lists for direct filters, grid fields and sort fields under the
  minimum grants, including count, aggregates and export (BE9).
- Match reference-ID filters to the same live authorized relation as the
  projection and sort. Verify omitted and partial paging inputs (BE9).
- With the report already open, revoke an optional lookup grant and verify
  list/report/export/Retry omit its filters and sort while retaining unaffected
  inputs. Bind print to the published rows' query and revision (UI21/28).
- Remote paging, stable sorting, and `TotalCount`.
- Angular list model, backend ListVM, and displayed columns.
- Row display transformations and action-state fields.
- Loading, empty, declared-failure, and transport-failure states.
- Apply UI2's cache adoption checklist to lookup/filter sources: eligibility,
  source-owned invalidation/topics, finite bootstrap and one live binding with
  selected-label retention. Reuse UI22's shared background badge; no local cache
  or refresh loader. Operational candidates remain direct.
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

Carry Master5's performance matrix: real query/round-trip and page/response
volume evidence, confirmed safe query optimizations, UI29's reproducible
before/after measurements or explicit pending owner checks, and BE2's index
coverage/proposals/costs or a justified no-new-index result. Do not infer measured
speed from source query counts or automatically index every filter/sort column.

Reconcile UI22's per-operation loading owner and actual routed consumer, including
query-only filter/paging navigation, global start/finalize and single rendered
indicator. Preserve busy/error/Retry and silent retained-cache refresh. Under
BE7, record enrichment round trips and correct in-scope per-row query duplication
without weakening action-state guards or caching eligibility; SQL/latency remain
owner verification when only source is inspected.

Carry the UI2 / Master5 screen cache source matrix into this handoff. Reconcile
filter/lookup rows against their actual services, writers and mounted bindings;
record direct-read exclusions and source-only verification explicitly. Do not
leave the matrix implicit because the list already inherits BaseService.

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
