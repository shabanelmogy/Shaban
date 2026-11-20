<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-02-read-grid | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-02-read-grid.template.md -->
# PHASE 2: Read Path and Grid

Use this packet for the complete path from Angular filters through the backend
query to Grid rendering, paging, and export. It is a checklist: each item names
the block that owns the rule. Read that block (or its topic file) for the rule
itself; this packet restates no values.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:3d74ae71fa7ca4d78e3061da8b59c62bf979108fe9529ec4052336a6da002034
- master.1: ## 1. Governance and review principles | sha256:ee76565b87a3e1818f4ae0b77f0d10041f5dcbb4141a72e5bae32d07adedb420
- master.2: ## 2. Screenshot and visual evidence policy | sha256:0b1dbab4b3b5c74d8f98f445aa6401c59248a410eb62069b1a0e970aae83a7c2
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:fa4216c7eb26b98af29e24c266026c920dafc7d1e8031d06bbd6d803dfc960a5
- master.5: ## 5. Continuous quality gates | sha256:f33275578ef4b77c78d894dc27e67da870281c9ba228f988c98f055597e026d2
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:90dac99897883d0a9d4e973f60b38f549c45b3511dfd83bd5fe3e389da1eeb04
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:8ee8fccad52b59f3ee3a04025d65de169c15d3dc986631ebbda114a9f8dc1e95
- ui.1: ## 1. Feature folders and wiring | sha256:46e816ee4d06385cb73a1e22814128b6a54c66bb0eafb81191fbf74640daab8c
- ui.2: ## 2. Service and response wrappers | sha256:3b648464835e13b2c1e982dd87e8d21a51eb8e0a0bb2ddf9b0aa26f79d56de97
- ui.3: ## 3. Header | sha256:4db9c662bd1cae41fba43b7834a5fdfa264f734df1b8fae2e570666762020bde
- ui.4: ## 4. Filters | sha256:5e342fe503bfd8f4af9ec1b812ba0adeab360ee458c9477880a10f405938aaa3
- ui.5: ## 5. Columns | sha256:c5f934c401c1c24c3faa4ebb0cd9a43175df02a6f225ac69057589a2d3c358b5
- ui.6: ## 6. Grid and footer | sha256:2d71077d6ca84065423923c8e4e0536a1920e47a12ca0ec77c1e0a29708a8c33
- ui.7: ## 7. Action button cycle | sha256:7c10bdb0f997b7e95bcee31fcb61c4fa25040a81d859708d580cfc7a1921d678
- ui.8: ## 8. Export to Excel | sha256:401fd301b29ea30aaf7b4601df409e3c62a171632ec02d5dd719215a01f9cd1d
- ui.9: ## 9. Confirm: delete | sha256:5a86d1c89cac29713709575f30a616cf4d5cab08916d1dbc76c8808ec20dfd87
- ui.15: ## 15. View mode | sha256:94a4e740f8a7dd9614f7323aff83787b8217b6b96d95ad4dbba06f33cb43c1a5
- ui.16: ## 16. Dropdowns, lookups, enums | sha256:467408e883c55ec485dd0e6998cf8481cf5c9e660b067ff6eb24acc057a7a102
- ui.17: ## 17. Dates | sha256:091b41901b811471ba30e616f1bde917b92b48ea65bd4c74de67e351f40a0401
- ui.19: ## 19. Validation messages | sha256:6479ef1233a6517ec265a9f102b313abc8f626a15e89dca5f5265ffff267c8ac
- ui.20: ## 20. Report page | sha256:89c4bd4800ac32aa62f277d1d548916e7ecf5ca61583b64c3aa8a8fbac557c33
- ui.21: ## 21. Report print | sha256:f9013f0d3c2398bcc4233daf759fafbeeb38c293335be13444ffeaf988698053
- ui.22: ## 22. Loading, empty, error, toast | sha256:895b36e116e8ead97b444e10d6ff9fa7c127a7e6606b18ed80952387b3789974
- ui.23: ## 23. Translations | sha256:86389e84130499283be8d15b8fce15978af3d7d5436ad256e2f6192f3ee903e5
- ui.24: ## 24. Colors, icons, buttons | sha256:3e15f07e224a15d55e17bdb8bcb32251012adebe3aaa39b125b714d89543a20c
- ui.25: ## 25. RTL and dark theme | sha256:e2c1cfb7fc9d0a1b164eda572651154c744b54c155a35d81b71adffad08fddae
- ui.26: ## 26. Permissions and route access | sha256:c596611d06131eccb93219ef991100aea97a6e054678b78e350983d0c5be627f
- ui.27: ## 27. Focus and keyboard | sha256:05fab3e975ee897d37f63406d7d61e39ff6b161ae174429a7834ff9a8ab387e6
- ui.28: ## 28. Request cancellation and stale responses | sha256:74ae9fdcdf9daa83fd23f5f6d2c92c906cd9ef0ed7a78f75c01fdf9243fcfa2e
- ui.29: ## 29. Verification expectations | sha256:52e0b1f24fb7514abf8c9b14cf83b0b6099b24db1ea46c90614f92705f8d67e0
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:0983535564fda910eb148cbb4a66079548016ce287b95a9409c7cec41974ed0a
- backend.2: ## 2. Step 2 — EF configuration | sha256:cf4f75793ea80c2bd92d2b51a51aa3b0d57240be85e4bd11f928737190874460
- backend.7: ## 7. ListVM scope rule | sha256:a32c3c557eec2057ea19e2c4233176c5c701135a7c02173f650fa242b9a69091
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:25c8c824e257a558545cb1475aa83b0e02ccb83c6cd980bc163c4d0840cfd344
- backend.9: ## 9. Search model and filters | sha256:1064b113a9c3badecae45e5ea387980d383a30fa398be6353802ced34de04d27
- backend.10: ## 10. Select and dropdowns | sha256:5492c310ca8d128504e1e223600fba3d8bdfaaacd7ef8907446d57a536edcc06
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:b3b6cf30cbd6bfab549f516d75cc31f5abaa64e43d53ae0f1ba906d57b80dc33
- backend.17: ## 17. Pattern 5 — Reports | sha256:ccf8fd38580e92bc5da25e555e0b09e0e30dfcef4ab797ebb8842c5d932d84eb
- backend.18: ## 18. Edge cases | sha256:ca231703f8f3eecb2ba71fb505d7d6960d9c84ae8c2a9f3e3a73847bc553c3b8

Approved references by read-path shape:

- `SiGmaAngularFrontEnd/src/app/modules/shared/components/data-table`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/filter-panel`
- `SiGmaAngularFrontEnd/src/app/modules/Workshop/Job/components/list`
- `SiGmaAngularFrontEnd/src/app/modules/Accounts/TrailBalance/components/list`

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
