# Frontend consumer source reconciliation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-23 |

This bounded handoff covers frontend consumers outside the shared table, shared query utilities, translations and UserGuide owners. It does not declare the complete feature closed.

## Coverage and source checks

- The source inventory maps 129 component/template pairs and 131 lazy/default-lazy shared-table instances to their service method, actual endpoint expression and base endpoint declaration. All 129 consumers expose the applied grid snapshot and use the shared event helper. The JSON inventory includes the declared column sources and explicit exceptions; colocated local/report column arrays are labelled in its notes.
- The existing feature filter snapshot remains immutable when column metadata changes. Absent metadata preserves the previous grid value; changed constraints reset the page and bypass unchanged-paging early returns. Screen Reset clears the column snapshot and route fallback. Existing exports read the same applied snapshot through their existing list/all-pages reader.
- Handwritten GET serializers reserve `Filters[grid]`; the existing Workshop POST reader places the value under `filters.grid`. There is no interceptor or ambient filter state.
- Source parsing of 652 in-scope TypeScript files plus five shared query/table/report/translation sources reports no parse diagnostics. A separate AST inspection found no duplicate object properties and no immediate column-option initialization that reads a property declared later. These checks do not run Angular compilation, a type checker, tests or lint.
- The repository whitespace diff check passes. Existing unrelated source changes remain in place.

## Confirmed corrections

Stable choices reuse the existing enum IDs and translation keys, including nullable/initially empty remote grids. The shared menu's explicit translated No value option distinguishes a real null predicate from Clear, so historical nullable approvals remain searchable. Calendar and numeric factory columns in Fleet Alerts now declare their types before rows arrive. Source-derived scalar aliases match the backend owner: displayed approval/lifecycle precedence, the two independent limousine approval menus, Invoice SourceKind, normalized Purchase Return column names, contacts and staff names. No business field or action order was changed.

The Bill cached-list path now restores its grid snapshot and treats a grid-only URL as route state. Clearing or resetting a menu cannot resurrect the initial route value.

Languages text-editor post-save merging now requires no advanced column constraints. A changed translated value under an active grid filter reloads the authoritative matching count/page instead of retaining a row whose membership may have changed. The existing unfiltered stable-key fast path remains intact.

## Explicit remote exclusions

| Consumer | Fields | Source reason |
|---|---|---|
| Fleet Alerts | serialNo, serviceId | Positional numbering and action-only cell |
| Staff Alerts | srNo | Positional numbering |
| Due Installments | srNo | Positional numbering |
| Purchase Return | displayId | Action-only navigation cell |
| Fleet Service Log | serviceItems, performedItems | Post-page ordered/distinct summaries with no established equivalent SQL predicate |
| Purchase Request / Purchase Order | vehicles | Post-page ordered/distinct comma summary |
| Bill | purchaseOrderNos, vehicles | Post-page ordered/distinct comma summaries |
| Shift | startTime | Combined native TimeSpan interval; no established scalar SQL comparison contract |
| Overtime | approvedBy | Enriched process-run value outside the source projection |

The owning backend rejects unsupported fields instead of returning unfiltered success. Shared editable rows and hierarchical reports retain their separate row-identity/ancestor/subtotal contracts; their presentation owner is outside this consumer handoff.

Owner verification remains pending for compilation, SQL translation, full-result counts/page changes, state restoration, exports and PrimeNG menu behavior in both directions/themes.
