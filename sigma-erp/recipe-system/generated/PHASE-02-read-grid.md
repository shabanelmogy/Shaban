<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-02-read-grid | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-02-read-grid.template.md -->
# PHASE 2: Read Path and Grid

Use this packet for the complete path from Angular filters through the backend
query to Grid rendering, paging, and export.

## Canonical provenance

- master.1: ## 1. Governance and review principles | sha256:defaefeff17c467afb2b3e953ac2eaf53d67fdc9b35b8eee12451c586bf41f33
- master.2: ## 2. Screenshot and visual evidence policy | sha256:518b4536a222d1c0c8cdd6265af603ede18ef9742a98d423ad525dfcf9f486ec
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:cb0e817775ee1e443e9e191621b36169934a1b9efd398086fe06a3c3943d91f4
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:ad0c7c462af621944990cb16fd7bc8047ad6d4916af64faa0db5a191d8d15546
- master.5: ## 5. Continuous quality gates | sha256:7670c6f18eccb6140087efbd98986043b801baad7d2b31c0f8f739392f2228f5
- master.6: ## 6. Human and AI review protocol | sha256:e320d98cc6bfafa91e975d9a71eb6e932983db68f7ad93d378f99f6ddece800f
- ui.1: ## 1. Feature folders and wiring | sha256:892d2ac3ae19a8b65346bc151efcfd78b5a8f0c9b611e55206b92656e37b8aa6
- ui.2: ## 2. Service and response wrappers | sha256:6fa0394abd7f49ea6f19efcbf0f30dca568621f5250ab3b3343b7ba16a7102e9
- ui.3: ## 3. Header | sha256:427dd91fd157405ae3c0227573b5a0fe5eefce0aedac97bcebae4e78b4cc8c58
- ui.4: ## 4. Filters | sha256:8c5bb5351cb8045be52bbbe22b2080104505972ce94ed71ef23487dc63d3a033
- ui.5: ## 5. Columns | sha256:ad3424836e7e8e0cb99f11dd07eee4a0924858b5847fc5d8939a780bc8ac0c23
- ui.6: ## 6. Grid and footer | sha256:3ffb76e34804def46c8ba181c2a5046865dd28f14560183cb69fbb697800aa12
- ui.7: ## 7. Action button cycle | sha256:a9541810dbd8de33c49818ca9685d69fc35243278fb8cfcac942757b12a16b83
- ui.8: ## 8. Export to Excel | sha256:02013c0ac0b494bb84f343e5ce55e391956ac9f6cc476cc9491b6ce473fae226
- ui.9: ## 9. Confirm: delete | sha256:2b7c7f35fcf489ae8bf36a257ffaf1fecffa6774bec9cc9eea12463759ee35dc
- ui.15: ## 15. View mode | sha256:47aeb820938ae96bd7305ba9aed8d92077c3f769fd746c73a366782e4435e2dd
- ui.16: ## 16. Dropdowns, lookups, enums | sha256:d79561f8978b204d55d3a35082ec821292b5c35c163b528f9f34356170f4d8b6
- ui.19: ## 19. Validation messages | sha256:51ac0deaaea47846133542b4f06349ce4201f373f65ac26cc5cdfce4a0e0816a
- ui.22: ## 22. Loading, empty, error, toast | sha256:1e4012005b264f2c0efaf929b30f03ae84b7587138379ebf6c142fa12e43e9e2
- ui.23: ## 23. Translations | sha256:1d159b39ed046537db86c6edffcdcd8ca30809f35761b5f19845d57e51896101
- ui.24: ## 24. Colors, icons, buttons | sha256:4e343afab530c8c08638a07919595ff1169f60f6d0aebe43f1ada3414a535d49
- ui.25: ## 25. RTL and dark theme | sha256:7a7270726f6b206659888dc898340d482f1d7c082bcb437a2d700ff228a026c5
- ui.26: ## 26. Permissions and route access | sha256:33d769df2c69055e37edfd328738ca874edd65b8c285acb6443e5c3930e0f85a
- ui.27: ## 27. Focus and keyboard | sha256:71009763a5b5c6848cda38eaf2bb0fa7ac83d001ab18c649f53f5c22edcb2b03
- ui.28: ## 28. Request cancellation and stale responses | sha256:45d17c01d2519192de3a092e57c7deb97e2ddaf2731be82c57c11f703a36c31f
- ui.29: ## 29. Verification expectations | sha256:b99e32e1615baff70816067504b9b429ef018cbbd3b01ba210dad38d7502903e
- backend.7: ## 7. ListVM scope rule | sha256:65cc47b13fc8e207693e2ed6d033d491f879d845dc39a07b261670328ecbc1d1
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:c834c66dc17d92ffca8e74a7f32113de7febbf293507205c32287d375e3bb386
- backend.9: ## 9. Search model and filters | sha256:7d2ca975a0db84d36a1d3a2f1efd588f197f7f11e188ab64f85e84578a17a72b
- backend.10: ## 10. Select and dropdowns | sha256:4f52d4a48672f3a86c04856cf6a3b11e93442d6c062c78effbb56017e965a6da
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:a6d2fb7af604c71307dc1e5a74eba407f6eb6d0921b9cb6b917a7d93bd8606c1
- backend.17: ## 17. Pattern 5 — Reports | sha256:f55e5607db105954640085df48f6fdf0771b33ca10b78dc5561b5f015e485073
- backend.18: ## 18. Edge cases | sha256:b78409883a1ffe3d4016644ed8b5afc92b3d48b47395c8f3c75a8117c49e69ef

Approved list/grid reference:

- `SiGmaAngularFrontEnd/src/app/modules/shared/components/data-table`
- `SiGmaAngularFrontEnd/src/app/modules/Fleet/VehicleService/components/list`
- `SiGmaAngularFrontEnd/src/app/modules/Sales/Fleet/components/list`

The Master Guide and canonical pattern books are authoritative. This packet is
derivative. Stop and report drift when they disagree.

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
- Preserve row Create/View/Edit handoff to the single controlled modal owned by
  Phase 3; Phase 2 does not create a second editor component or editor route.

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
- Search and filter controls, including the canonical compact flat 12-column
  layout, 34px controls, dark theme, and 900px/700px responsive states.
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
- Exact approved list reference.

Do not start implementation while required Grid values have Missing or
Conflicting source contracts.

## Procedure

1. Freeze exact visible header/body column order with Actions first.
2. Record separate evidence for the shared table, feature template, feature
   TypeScript, and feature SCSS. Treat `table-list`, `TableListComponent`,
   feature-local `p-table`, `tableList.dt`, `ListCol` and `ColType` as Legacy —
   do not copy or retain in a refactored list.
3. Write displayed/action needs beside frontend and backend properties.
4. Remove non-consumed ListVM fields only after checking direct consumers.
5. Freeze filter property names and exact backend key casing.
6. Verify the filter is one flat 12-column grid without a nested filter card,
   uses the canonical desktop spans, and collapses at 900px and 700px.
7. Verify false, zero, empty, enum, date, and multi-value serialization.
8. Verify page-size clamp, `CountAsync`, total pages, and stable ordering.
9. Verify server paging rather than client slicing or load-all behavior.
10. Verify read cancellation, loading finalization, and both failure channels.
11. Define refresh behavior after delete and other row actions.
12. If the whole row opens a confirmed workflow, opt in through the shared
    table's typed row-activation API and verify click, `Enter`, `Space`, focus,
    and nested interactive-control suppression.
13. If a confirmed batch workflow acts on selected rows, use the shared table's
    checkbox column, keep selection typed and feature-owned, scope select-all to
    the rendered page, clear selection when the result changes, and verify that
    checkbox interaction does not activate the row.
14. Verify export fields and whether export uses all matching rows or current page.

## Required outputs

### Column and ListVM contract

| Grid column or action need | Frontend property | Backend ListVM property | Display transformation | Contract status |
|---|---|---|---|---|
| Identity/action target | `id` | `Id` | None | |
| | | | | |

Name every removed ListVM field.

### Reusable `app-data-table` integration evidence

| Layer | Required source evidence | Status or finding |
|---|---|---|
| Shared component | Exactly one direct `p-table`; typed `DataTableColumn<T>`; actions, custom cell templates, optional accessible row activation and checkbox selection, table-owned paginator, translated headers, loading/empty states, and table-level theme/RTL-safe styling | |
| Feature template | Exactly one `app-data-table` with typed data/columns/actions, paging and sort inputs, translated report/empty keys, error-aware empty visibility, one lazy-load output, optional typed row activation, and optional current-page typed checkbox selection only for confirmed workflows | |
| Feature TypeScript | `DataTableComponent`, typed `DataTableColumn<Row>`, typed `TableLazyLoadEvent`, one page/sort conversion handler, API `totalRecords`, sort whitelist and stale-request protection; no `TableModule`, table `@ViewChild`, or internal mutation | |
| Feature SCSS | Feature-prefixed compact flat filter layout plus Grid placement and optional public `--sigma-data-table-*` overrides; no nested filter card and no copied `.p-datatable-*`, action-menu, or paginator rules | |

The footer remains owned by the direct `p-table` inside `app-data-table`; there
is no second pager and its total always comes from the API rather than
`rows.length`.

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
- Filters use the canonical flat 12-column geometry, 34px controls, dark-theme
  treatment, and the 900px/700px responsive states; no nested filter card.
- Actions column is first and follows the approved shared cycle.
- Loading and errors cover both API failure channels.
- List requests cancel or ignore stale responses.
- Opt-in whole-row activation is keyboard accessible and does not capture
  nested links, buttons, or form controls.
- Opt-in checkbox selection uses stable row IDs, has translated header/row
  labels, scopes select-all to the rendered page, clears when results change,
  and never triggers whole-row activation.
- Shared table styles own the PrimeNG wrapper, table, cells, action control,
  dropdown, paginator, light/dark defaults, and white solid-button icon.
- Feature Grid styles own placement and use public `--sigma-data-table-*`
  variables only for confirmed feature-specific variation.
- Translation, accessibility, RTL, theme, and responsive checks occur now.

## Expected handoff

Phase 4 receives the row-action inventory and refresh contract. Phase 6 receives
the final column, filter, paging, and export tables.
