# PHASE 2: Read Path and Grid

Use this packet for the complete path from Angular filters through the backend
query to Grid rendering, paging, and export.

## Canonical provenance

{{SOURCE_FINGERPRINTS}}

Approved list/grid reference:

{{APPROVED_REFERENCES}}

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
