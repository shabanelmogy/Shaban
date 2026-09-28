<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-02-read-grid | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-02-read-grid.template.md -->
# PHASE 2: Read Path and Grid

Use this packet for the complete path from Angular filters through the backend
query to Grid rendering, paging, and export.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:2a00e0f2004ea5c5cbd27c9a26b08bfe0599846b4a088c1e6e51a13c51123c74
- master.1: ## 1. Governance and review principles | sha256:127af0593047619ee010cc42872c85f6fb17822939fc1eb84ddc0448a1bc38d2
- master.2: ## 2. Screenshot and visual evidence policy | sha256:a34e2c67fb64586a7d135ae183ef2085e698c442fe21f0ea34059360b019c63c
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:3e4693fe20b130ccadbc096ec295c856ca45b65edce618be94f856736f679a28
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:7f9e01355e77a11d7b6ac6c30e6093397e8df8ada6489488ca1027b7d252fa03
- master.5: ## 5. Continuous quality gates | sha256:20f297601f44c6f54a86681f894a655fcd8cf1f78c852288f0654451830a50c9
- master.6: ## 6. Human and AI review protocol | sha256:4ceaecd1ec28eb3a13b14908b167b8b4c632cbdc403f7f7622324076cd3e6399
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:ae7e4bd552342bab531b491b00db80bada826e75489e631b222586f39d176bde
- ui.1: ## 1. Feature folders and wiring | sha256:dd3b3e89fa9d9020882e9a3e21a196cbc3e611c579053691e626bdbb1ca5b9ee
- ui.2: ## 2. Service and response wrappers | sha256:6fa0394abd7f49ea6f19efcbf0f30dca568621f5250ab3b3343b7ba16a7102e9
- ui.3: ## 3. Header | sha256:9662bca9cbe8aea34b8a49b71413c3c20636e691a1da5fa62c15c441f5c75cee
- ui.4: ## 4. Filters | sha256:9c4d8c09def40069ee0fce5e8292f58145bb2dec06873efa0c81ec68f8740228
- ui.5: ## 5. Columns | sha256:b3a1e55a78c393793ca810af0640eb2b4b662ce032fbd7167d31e135751c7734
- ui.6: ## 6. Grid and footer | sha256:1bb539b986d61daf3c102dbe205d643e29b5766c6f582e6f2109a7b4cd6dc14d
- ui.7: ## 7. Action button cycle | sha256:a9541810dbd8de33c49818ca9685d69fc35243278fb8cfcac942757b12a16b83
- ui.8: ## 8. Export to Excel | sha256:02013c0ac0b494bb84f343e5ce55e391956ac9f6cc476cc9491b6ce473fae226
- ui.9: ## 9. Confirm: delete | sha256:2b7c7f35fcf489ae8bf36a257ffaf1fecffa6774bec9cc9eea12463759ee35dc
- ui.15: ## 15. View mode | sha256:fad033e683d31973d4e7fa932bed5e1cc12ae78f83fdbcb2343daa184d696217
- ui.16: ## 16. Dropdowns, lookups, enums | sha256:6932668317fa645c05bb1e26bd3221801b56510a77f5d1898ab758a1102c0874
- ui.19: ## 19. Validation messages | sha256:51ac0deaaea47846133542b4f06349ce4201f373f65ac26cc5cdfce4a0e0816a
- ui.22: ## 22. Loading, empty, error, toast | sha256:ef8ed233b38d520940646072757df48c42f7b3d392e397bc25700b10862ddd9f
- ui.23: ## 23. Translations | sha256:fa61d2af66e51390cafeac43c298964d71c1e815236b1e5e66371b885b253893
- ui.24: ## 24. Colors, icons, buttons | sha256:11d9de8679ce66408aed269fc2e00d16ee9ec1d1cb46a9ed8afeb693847fb377
- ui.25: ## 25. RTL and dark theme | sha256:7a7270726f6b206659888dc898340d482f1d7c082bcb437a2d700ff228a026c5
- ui.26: ## 26. Permissions and route access | sha256:33d769df2c69055e37edfd328738ca874edd65b8c285acb6443e5c3930e0f85a
- ui.27: ## 27. Focus and keyboard | sha256:71009763a5b5c6848cda38eaf2bb0fa7ac83d001ab18c649f53f5c22edcb2b03
- ui.28: ## 28. Request cancellation and stale responses | sha256:45d17c01d2519192de3a092e57c7deb97e2ddaf2731be82c57c11f703a36c31f
- ui.29: ## 29. Verification expectations | sha256:75801ef0acaeae5306fd49ad2672c9791823ea01ada1cf0cbadbb76a4385048f
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:ab611bb68b93c0e7b2fe256a1fbafb30a9a2f9f6f56f397e87f1b6cf3301b3cb
- backend.7: ## 7. ListVM scope rule | sha256:65cc47b13fc8e207693e2ed6d033d491f879d845dc39a07b261670328ecbc1d1
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:c834c66dc17d92ffca8e74a7f32113de7febbf293507205c32287d375e3bb386
- backend.9: ## 9. Search model and filters | sha256:6ab38c4859bfd9d1a29424abfa3e6ea38670329c9c1c3f78db133cf4945523fa
- backend.10: ## 10. Select and dropdowns | sha256:4f52d4a48672f3a86c04856cf6a3b11e93442d6c062c78effbb56017e965a6da
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:c744ef011b1b10511c873fe7afb1d6b6a1992392c81e9c9f6db18ceb05cf733c
- backend.17: ## 17. Pattern 5 — Reports | sha256:309c2a4dec4c1479e70b870ba4452011775fc3d5273bfea78aba1f8647b41ee3
- backend.18: ## 18. Edge cases | sha256:54b16261e2303ca977639276da2aa38b689d83678f06e9ceb7e6b98a307944df

Approved references by read-path shape:

- `SiGmaAngularFrontEnd/src/app/modules/shared/components/data-table`
- `SiGmaAngularFrontEnd/src/app/modules/Fleet/VehicleService/components/list`
- `SiGmaAngularFrontEnd/src/app/modules/Accounts/openingBalances/components/details`
- `SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/list`

Reference ownership is explicit:

- reusable table shell and rendering: `shared/components/data-table`;
- typed paging/sort/list integration: `Fleet/VehicleService/components/list`;
- compact filter strip, the default for a new screen:
  `Accounts/openingBalances/components/details`;
- retained flat 12-column filter grid, only on a screen that already ships it:
  `Customers/Individual/IndividualPartner/components/list`.

Do not treat one of these references as authority for the other shapes.

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
  The only exception is the routed full-page editor variant (UI block 13), used
  when the frozen contract approves an independently addressable route; Create,
  View, and Edit then navigate to that one editor.

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
- Search and filter controls, including the canonical compact filter strip with
  its uniform `repeat(N, 1fr)` field grid, 34px controls, dark theme, and
  900px/700px responsive states.
- Any date filter, per block 17: typeable (`[readonlyInput]="false"` with
  `[keepInvalid]="true"`), no icon and no `[showIcon]`, a single range picker
  opening on two months (`[numberOfMonths]="2"`), defaulting to the current
  month.
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
6. Verify the filter is one compact strip holding a uniform `repeat(N, 1fr)`
   field grid: every control one column wide, no empty cell at the end of a row,
   any spanning group declared with `grid-column: span K`, a boolean filter
   filling the last free column, the strip exactly as wide as the feature-title
   card, no nested filter card, and collapse to two columns at 900px and one at
   700px. A screen that already ships the flat 12-column grid keeps it.
7. Verify false, zero, empty, enum, date, and multi-value serialization.
8. Verify page-size clamp, `CountAsync`, total pages, and stable ordering.
9. Verify server paging rather than client slicing or load-all behavior.
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
| Feature SCSS | Feature-prefixed compact filter strip, uniform `repeat(N, 1fr)` field grid, and Grid placement plus optional public `--sigma-data-table-*` overrides; strip and grid wrapper the same width as the feature-title card (`margin: 0 8px 6px` and `0 8px`); no nested filter card; no copied `.p-datatable-*`, action-menu, or paginator rules other than the block 6 Transitional fill block, copied exactly | |

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
- Filters use the canonical compact strip and its uniform `repeat(N, 1fr)` field
  grid, 34px controls, dark-theme treatment, and the 900px/700px responsive
  states; the strip is exactly as wide as the feature-title card; no nested
  filter card and no empty cell at the end of a field row.
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
- Loading and errors cover both API failure channels.
- Every list-owned mutation has exactly one success-feedback owner; standard
  mutations rely on the global interceptor and do not add a feature success toast.
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
