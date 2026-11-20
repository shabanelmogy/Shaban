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
- master.1: ## 1. Governance and review principles | sha256:2d7b129595e5d4a952130db10961d2b8c81c0851dbc75fae7d83106e13c8daef
- master.2: ## 2. Screenshot and visual evidence policy | sha256:0b1dbab4b3b5c74d8f98f445aa6401c59248a410eb62069b1a0e970aae83a7c2
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:fa4216c7eb26b98af29e24c266026c920dafc7d1e8031d06bbd6d803dfc960a5
- master.5: ## 5. Continuous quality gates | sha256:f33275578ef4b77c78d894dc27e67da870281c9ba228f988c98f055597e026d2
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:583605ea6557f568ab23959ef911184ff0864cbc5ee4ab4ca5e7b424dd6d30d0
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:8ee8fccad52b59f3ee3a04025d65de169c15d3dc986631ebbda114a9f8dc1e95
- ui.1: ## 1. Feature folders and wiring | sha256:46e816ee4d06385cb73a1e22814128b6a54c66bb0eafb81191fbf74640daab8c
- ui.2: ## 2. Service and response wrappers | sha256:981565aac3dc9b7a6e16e1dd855f1e1812514b32b610a3c8547b87814825b838
- ui.3: ## 3. Header | sha256:4db9c662bd1cae41fba43b7834a5fdfa264f734df1b8fae2e570666762020bde
- ui.4: ## 4. Filters | sha256:5e342fe503bfd8f4af9ec1b812ba0adeab360ee458c9477880a10f405938aaa3
- ui.5: ## 5. Columns | sha256:94c69136f60aa67980faee4318970d957142b4d2ac98f2bc2b549fc6fee8bd3f
- ui.6: ## 6. Grid and footer | sha256:02990b810d33b80a588c07dd10b8e94148f9fbf0bff9622752a3f64ce205c2f3
- ui.7: ## 7. Action button cycle | sha256:7c10bdb0f997b7e95bcee31fcb61c4fa25040a81d859708d580cfc7a1921d678
- ui.8: ## 8. Export to Excel | sha256:401fd301b29ea30aaf7b4601df409e3c62a171632ec02d5dd719215a01f9cd1d
- ui.9: ## 9. Confirm: delete | sha256:5a86d1c89cac29713709575f30a616cf4d5cab08916d1dbc76c8808ec20dfd87
- ui.15: ## 15. View mode | sha256:94a4e740f8a7dd9614f7323aff83787b8217b6b96d95ad4dbba06f33cb43c1a5
- ui.16: ## 16. Dropdowns, lookups, enums | sha256:ed9aebc94ab7e89afa268933d956584d7171ccbdf86a6f8647c4d657cc36ffee
- ui.17: ## 17. Dates | sha256:d9ee41fe19ba5c939c555aa49d335b199d7de9e3ad1087acf3c13a7d4810fa39
- ui.19: ## 19. Validation messages | sha256:b3a02dcd1b3838971f2b27ee09064501d73a424d4d4a0e9a6f88a575dc717be2
- ui.20: ## 20. Report page | sha256:c988236d3f2a788a6aeb28d05181c5eed299a0d8a5d4f10f61f8a43ab67ba7f1
- ui.21: ## 21. Report print | sha256:d78bd5de3f6d27459f1068b03dd09da6713b6ae2342641384aa1931474d77d62
- ui.22: ## 22. Loading, empty, error, toast | sha256:895b36e116e8ead97b444e10d6ff9fa7c127a7e6606b18ed80952387b3789974
- ui.23: ## 23. Translations | sha256:86389e84130499283be8d15b8fce15978af3d7d5436ad256e2f6192f3ee903e5
- ui.24: ## 24. Colors, icons, buttons | sha256:3e15f07e224a15d55e17bdb8bcb32251012adebe3aaa39b125b714d89543a20c
- ui.25: ## 25. RTL and dark theme | sha256:e2c1cfb7fc9d0a1b164eda572651154c744b54c155a35d81b71adffad08fddae
- ui.26: ## 26. Permissions and route access | sha256:47b008a60f56f150444a596c25205d1ac35783cad40b4a6abd8c345d176bfeb7
- ui.27: ## 27. Focus and keyboard | sha256:fa8fa60d2e93ddd0753c18b50e11a7bbc4c2bbdb29389641a7965cb6c718b8ed
- ui.28: ## 28. Request cancellation and stale responses | sha256:97c83940b83a1991f363d5acaa7323564458562d67a4f854bf6ac6e83422ff29
- ui.29: ## 29. Verification expectations | sha256:d4d703957f2f11fce5f669412da7e6d216784b7c5430f1a4cac6cfa0f277b326
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:0983535564fda910eb148cbb4a66079548016ce287b95a9409c7cec41974ed0a
- backend.2: ## 2. Step 2 — EF configuration | sha256:cf4f75793ea80c2bd92d2b51a51aa3b0d57240be85e4bd11f928737190874460
- backend.7: ## 7. ListVM scope rule | sha256:f724b67e62f4591522f6ee8a4222e53971feb837b63e3b2a1402028331ac01c1
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:25c8c824e257a558545cb1475aa83b0e02ccb83c6cd980bc163c4d0840cfd344
- backend.9: ## 9. Search model and filters | sha256:6d75813744bf7995c90fce911ad6210fb2fbf14ede13b8950d3f2dc351f24648
- backend.10: ## 10. Select and dropdowns | sha256:61f5fb1f28d7992cf7610dfbe5a9e4fc6d08fd656230d72ab36067a6f1c04925
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:edfeb2f60ddcaaa73b8b31192afaba55bee59f8dde932beb111c6181e2d8daa2
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
