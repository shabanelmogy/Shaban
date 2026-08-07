<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-02-read-grid | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-02-read-grid.template.md -->
# PHASE 2: Read Path and Grid

Use this packet for the complete path from Angular filters through the backend
query to Grid rendering, paging, and export.

## Canonical provenance

- master.1: ## 1. Governance and review principles | sha256:defaefeff17c467afb2b3e953ac2eaf53d67fdc9b35b8eee12451c586bf41f33
- master.2: ## 2. Screenshot and visual evidence policy | sha256:82edca7271355f11049971f73e80f31d1f54e108c5a00906e5c0e4f9124f04ab
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:714c5d1c919cb6f602abb0c15cb8c3689a83f34ec41b041b63957dd765ec8934
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:60b490244a3ad6a1ae6870eb0e8fcd0c6ea2b984f5f7af86a667ef05ac4305f2
- master.5: ## 5. Continuous quality gates | sha256:9e86071c1e6bbb5b2d7dba6270ea2a8a57b71c4750d11ac8ce4da4bfb373befb
- master.6: ## 6. Human and AI review protocol | sha256:d08192101c921bc5679d61b77c428a570961e73cbf82ef3f8807b12b036b4cd3
- ui.1: ## 1. Feature folders and wiring | sha256:16219dc5f603162eb05ef14a5e4a36d99adf9af0b8530d73108c6c8a6c92979a
- ui.2: ## 2. Service and response wrappers | sha256:6fa0394abd7f49ea6f19efcbf0f30dca568621f5250ab3b3343b7ba16a7102e9
- ui.3: ## 3. Header | sha256:25da32976903065abe26ae96414af307ac58fc8a7db027e860ab7b7344593088
- ui.4: ## 4. Filters | sha256:642cef86d9d0c7d64f672c434b0de9a7207fb1242a513eadeb46aa797160b7a3
- ui.5: ## 5. Columns | sha256:672243eb1526109a24d3fc77c271fbd6b8bba510a404858599706177696f6293
- ui.6: ## 6. Grid and footer | sha256:e4b9926a3a1797a90e1b80e83126b4f924ecb8ef5c980fc572d8cf4c88c43240
- ui.7: ## 7. Action button cycle | sha256:32128e41e13fdd7165ee34ab7aebdd4376d490e08fb721153e8e0bde44d7fafb
- ui.8: ## 8. Export to Excel | sha256:f3a2efbdaea3eda8aaae277ec9724b759daf7eca4474c30802e2e01ec3d090b0
- ui.9: ## 9. Confirm: delete | sha256:2b7c7f35fcf489ae8bf36a257ffaf1fecffa6774bec9cc9eea12463759ee35dc
- ui.15: ## 15. View mode | sha256:62c1f5e1f1d2dae4c234f216682ceb1c8b5bb7cef86494cc816afea457a42f3e
- ui.16: ## 16. Dropdowns, lookups, enums | sha256:533436af43344a59cae4d26e9d3fb20c3c9b4503cdeb601fa55a5dad74cd2a0a
- ui.19: ## 19. Validation messages | sha256:42c78f95c1977fd63970cf9ce76e3f81b1cb416d8c4cbe7cd23ef0ca74f066dc
- ui.22: ## 22. Loading, empty, error, toast | sha256:aaf83a5b0cad482ec27a4f32ed1eb874ef2b92a05dd5071080077e4db731a1e5
- ui.23: ## 23. Translations | sha256:1d159b39ed046537db86c6edffcdcd8ca30809f35761b5f19845d57e51896101
- ui.24: ## 24. Colors, icons, buttons | sha256:e659faf7e9598e13c637837dbce1e1a2809d60e055f786804e3edcd3c43b8f0d
- ui.25: ## 25. RTL and dark theme | sha256:f92ca138a5baa0869aadf56be29ba537125b90cd162ed7b96848b2d53d5e9ffc
- ui.26: ## 26. Permissions and route access | sha256:33d769df2c69055e37edfd328738ca874edd65b8c285acb6443e5c3930e0f85a
- ui.27: ## 27. Focus and keyboard | sha256:c277d98ba2241885c3f0daa8c301208b9dda7d3cb6b78a0f87505cededd5abb9
- ui.28: ## 28. Request cancellation and stale responses | sha256:45d17c01d2519192de3a092e57c7deb97e2ddaf2731be82c57c11f703a36c31f
- ui.29: ## 29. Verification expectations | sha256:b99e32e1615baff70816067504b9b429ef018cbbd3b01ba210dad38d7502903e
- backend.7: ## 7. ListVM scope rule | sha256:65cc47b13fc8e207693e2ed6d033d491f879d845dc39a07b261670328ecbc1d1
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:1867a46fe28a599591510a456bdccfecbd6fd81240756eac7d5133caee428632
- backend.9: ## 9. Search model and filters | sha256:7d2ca975a0db84d36a1d3a2f1efd588f197f7f11e188ab64f85e84578a17a72b
- backend.10: ## 10. Select and dropdowns | sha256:bd8ecba0fc462392ca6d51bc3f8666a122b3f4590f149e75abaf5992bba77089
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:a6d2fb7af604c71307dc1e5a74eba407f6eb6d0921b9cb6b917a7d93bd8606c1
- backend.17: ## 17. Pattern 5 — Reports | sha256:3476f210a7f5455e3d71d73742b6a7ff9be801f34ebc3af4298bceaf088290ca
- backend.18: ## 18. Edge cases | sha256:b78409883a1ffe3d4016644ed8b5afc92b3d48b47395c8f3c75a8117c49e69ef

Approved list/grid reference:

- `SiGmaAngularFrontEnd/src/app/modules/Sales/Fleet/components/list`

The Master Guide and canonical pattern books are authoritative. This packet is
derivative. Stop and report drift when they disagree.

## Purpose

- Keep filter, paging, query, ListVM, and Grid contracts identical.
- Verify async read behavior and stable refresh semantics.
- Prevent screenshot-visible values from becoming invented backend fields.

## Included concerns

- Page title and list-level actions.
- Search and filter controls.
- Three-layer `table-list` integration: template, remote-table TypeScript, and
  feature-owned package-boundary SCSS.
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

1. Freeze exact `colName` order with Actions first.
2. Record separate `table-list` evidence for template, TypeScript, and SCSS;
   the component tag alone is not a complete implementation.
3. Write displayed/action needs beside frontend and backend properties.
4. Remove non-consumed ListVM fields only after checking direct consumers.
5. Freeze filter property names and exact backend key casing.
6. Verify false, zero, empty, enum, date, and multi-value serialization.
7. Verify page-size clamp, `CountAsync`, total pages, and stable ordering.
8. Verify server paging rather than client slicing or load-all behavior.
9. Verify read cancellation, loading finalization, and both failure channels.
10. Define refresh behavior after delete and other row actions.
11. Verify export fields and whether export uses all matching rows or current page.

## Required outputs

### Column and ListVM contract

| Grid column or action need | Frontend property | Backend ListVM property | Display transformation | Contract status |
|---|---|---|---|---|
| Identity/action target | `id` | `Id` | None | |
| | | | | |

Name every removed ListVM field.

### `table-list` integration evidence

| Layer | Required source evidence | Status or finding |
|---|---|---|
| Template | Feature-prefixed wrapper, `app-action-button`, exactly one `table-list`, package controls disabled where feature controls replace them | |
| TypeScript | `@ViewChild`, guarded lazy-load subscription, page conversion, API `totalRecords` synchronization | |
| SCSS | Feature-prefixed coverage of package card/header, wrapper/table/cells, actions/dropdown and paginator | |

When the feature supplies its own search or filters, verify that the package
`Keyboard Search` caption is hidden. Never leave two search interfaces. The
footer remains owned by `table-list`; there is no second pager.

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
- Actions column is first and follows the approved shared cycle.
- Loading and errors cover both API failure channels.
- List requests cancel or ignore stale responses.
- Feature Grid styles use local tokens and a feature prefix.
- Package wrapper, table, cells, action control, dropdown and paginator are
  integrated under that prefix; a solid action button keeps its icon white.
- Translation, accessibility, RTL, theme, and responsive checks occur now.

## Expected handoff

Phase 4 receives the row-action inventory and refresh contract. Phase 6 receives
the final column, filter, paging, and export tables.
