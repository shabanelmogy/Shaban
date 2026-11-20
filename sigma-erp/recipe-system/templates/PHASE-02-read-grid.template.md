# PHASE 2: Read Path and Grid

Use this packet for the complete path from Angular filters through the backend
query to Grid rendering, paging, and export. It is a checklist: each item names
the block that owns the rule. Read that block (or its topic file) for the rule
itself; this packet restates no values.

## Canonical provenance

{{SOURCE_FINGERPRINTS}}

Approved references by read-path shape:

{{APPROVED_REFERENCES}}

Reference ownership is explicit:

- reusable table shell and rendering: `shared/components/data-table` (UI6);
- list shell, shared filters and typed paging/sort/request integration:
  `Workshop/Job/components/list`;
- shared filter presentation: `shared/components/filter-panel` (UI4);
- read-only unpaged report strip/totals: `Accounts/TrailBalance/components/list`
  (UI20; its legacy controls are not authority over the current owning blocks).

Do not treat one of these references as authority for the other shapes.

The Master Guide and canonical books are authoritative; this packet is
derivative. Run recipe `-Check` before use and follow Master8 for drift. Preserve
unrelated changes; source-read-only review still forbids application-source edits.

## Mandatory in-place list replacement

Refactor an existing list component in place: one shared `<app-data-table>` in
the existing template, no parallel list, duplicate route or second grid, and no
retained legacy table wrapper (UI6 "Mandatory replacement rule", Legacy list).
Keep the feature route and service boundary unless a frozen contract changes it.
Create/View/Edit hand off to the single editor chosen by UI13's decision rule and
frozen in Phase 1. A missing shared-table capability is added to the shared
component in scope (Master5 shared-extraction gate), never worked around locally.

## Purpose

- Keep filter, paging, query, ListVM, and Grid contracts identical.
- Verify async read behavior and stable refresh semantics.
- Prevent screenshot-visible values from becoming invented backend fields (Master2).

## Included concerns and owners

| Concern | Owner |
|---|---|
| Page title and list-level actions | UI3, UI7 |
| List filters: shared filter panel, advanced/action projections, Reset | UI4 |
| Report filters, strip, totals and review evidence | UI20 (topic `20/02`) |
| Date filters | UI17 |
| No page scroll; grid rows as the single scroll owner | UI1 topic `01/02` |
| Four-layer table integration, row activation, checkbox selection | UI6 |
| Money, percentage, frozen and advanced-filter columns | UI6 topic `06/01` |
| Filter keys, parsers and protected-list allow-lists (filters, grid, sort, count, export) | BE9 |
| Paging (`resolveListPaging`), `TotalCount`, stable sort | UI6, BE7 |
| ListVM equals displayed columns plus identity and action state | UI5, BE7 |
| Lookup/filter sources and cache adoption | UI2 topics `02/01`, `02/02` |
| Loading owner, empty, error and success feedback | UI22 topics `22/01`, `22/04` |
| Cancellation and stale responses; revoked optional lookup grants | UI28, UI26 |
| Delete/action refresh with current paging | UI7, UI9 |
| Export columns and complete export scope | UI8 |
| Print of published rows | UI21 |
| Read-query projection, performance and indexes | Master5 topic `05/02`, BE2, BE7, UI29 |

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

1. Freeze the visible column order; row actions first for lists; reports gain no
   CRUD actions (UI5, UI6, UI20).
2. Record evidence for each table layer — shared component, feature template,
   feature TypeScript, feature SCSS — and remove legacy table artifacts (UI6).
3. Write displayed and action needs beside frontend and backend properties; remove
   non-consumed ListVM fields only after checking consumers (UI5, BE7).
4. Freeze filter property names and exact backend key casing; verify false, zero,
   empty, enum, date and multi-value serialization (UI4, BE9).
5. Verify the filter panel against UI4 (lists) or UI20's strip (reports).
6. Verify paging against UI6 and UI28: clamp, count, stable order, size-only
   change, identical-state skip and superseded-request cancellation.
7. Lists: server paging, not client slicing. Reports: prove the UI20 dataset
   contract (server counts or a complete collection) before local paging.
8. Verify read cancellation, loading finalization and both failure channels
   (UI22, UI28).
9. Define refresh after delete and row actions and the single success-feedback
   owner (UI7, UI22 topic `22/04`).
10. Optional whole-row activation and checkbox selection follow UI6.
11. Verify export fields, all matching pages, translations and failure handling (UI8).

## Required outputs

Carry Master5's performance matrix (topic `05/02`) with UI29 measurements or
explicit pending owner checks and BE2 index evidence. Reconcile UI22's
per-operation loading owner and UI2's cache source matrix for this screen; record
source-only verification explicitly.

### Column and ListVM contract

For reports, compare the existing report row/response DTO instead of inventing a
ListVM or row actions.

| Grid column or action need | Frontend property | Backend ListVM property | Display transformation | Contract status |
|---|---|---|---|---|
| Identity/action target | `id` | `Id` | None | |
| | | | | |

Name every removed ListVM field.

### Reusable `app-data-table` integration evidence (list shape)

| Layer | Required source evidence (UI6) | Status or finding |
|---|---|---|
| Shared component | | |
| Feature template | | |
| Feature TypeScript | | |
| Feature SCSS | | |

### Report review evidence (required when a report is in scope)

Record UI20's "Required report review evidence" with actual frontend consumer
and backend producer symbols and a match/finding/Uncertain result for each item.
UI21 owns full-print preparation; UI29 owns runtime acceptance. A shared import
or an earlier "Matched" row does not replace these comparisons (Master5).

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
| Page-size-only change on page 1 | | | | | |
| Identical page and size | | | | | |
| New valid page during loading | | | | | |
| Delete success | | | | | |
| Editor success | | | | | |

### Export contract

| Export column | Source field | Transformation | Scope | Missing contract |
|---|---|---|---|---|
| | | | | |

## Continuous gates

Check each against its owner; record match or finding.

- ListVM = displayed columns + identity + real action state (UI5, BE7).
- A visible screenshot column is evidence, not a DTO authority (Master2).
- Filter casing matches across Angular and .NET (BE9).
- Filters use the shared panel (UI4) or report strip (UI20); dates follow UI17.
- Route host and spacing follow UI1 topic `01/02` and UI3; no feature override.
- Actions column and action cycle follow UI7.
- Loading, both failure channels and one success-feedback owner (UI22).
- Paging and cancellation follow UI6 and UI28.
- Row activation and checkbox selection follow UI6.
- Table styling and placement belong to the shared table and shell (UI6, UI24).
- Translation, accessibility, RTL, theme and responsive checks (UI23, UI27, UI25).

## Expected handoff

Phase 4 receives the row-action inventory and refresh contract. Phase 6 receives
the final column, filter, paging, and export tables.
