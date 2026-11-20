<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-02-read-grid | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-02-read-grid.template.md -->
# PHASE 2: Read Path and Grid

Use this packet for the complete path from Angular filters through the backend
query to Grid rendering, paging, and export. It is a checklist: each item names
the block that owns the rule. Read that block (or its topic file) for the rule
itself; this packet restates no values.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:223e1233ba9b050b21a1052d8210300a3a7bacb57cf9c2a7c66c63b6adc1ecfe
- master.1: ## 1. Governance and review principles | sha256:4af3c22f52464c9696ac85adb7f000d9c89d1bd76ecabfffa2662030d5fa66b2
- master.2: ## 2. Screenshot and visual evidence policy | sha256:817eed9bcf1b6e55bd4e485e0297ade2bec072fb8360fd8fb8db49d918c10256
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:416b24a6d74c22be5d7f8d37480fab2ef17fa7ddb0d3e4f1632795ed813558d0
- master.5: ## 5. Continuous quality gates | sha256:e332beddb8ee63faeea534279ce185f91f103e03d24514943b975a169f4ee748
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:d21cd155e9041bfdac3d153a52d6941147d10be5a89e67c19ab748ba1166caa1
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:8ee8fccad52b59f3ee3a04025d65de169c15d3dc986631ebbda114a9f8dc1e95
- ui.1: ## 1. Feature folders and wiring | sha256:c4df20098e8e79cd73612e9fb0128bfcb8c75d4390c745a8bc636906e517aa1f
- ui.2: ## 2. Service and response wrappers | sha256:f3a7b69c4ad6f7f09008f0dac6cb67b18d88fd938e2e64c568380e3b7d116bb7
- ui.3: ## 3. Header | sha256:1e306ffae7e2e436e6eb354ef3fa7e12c8a131877efb52ff475cea07a3cb2892
- ui.4: ## 4. Filters | sha256:779873485e47d42b85c9dedee5f1280ac772308932b1d77034f70e822417f667
- ui.5: ## 5. Columns | sha256:94c69136f60aa67980faee4318970d957142b4d2ac98f2bc2b549fc6fee8bd3f
- ui.6: ## 6. Grid and footer | sha256:91b9c9804b9d32e952e59230d015305b63e3c8632eea823508b466f724e6837f
- ui.7: ## 7. Action button cycle | sha256:d761c13f061cd62f22c5216391ce26364f1d2cb427973a2adcfbc9cdce4d770e
- ui.8: ## 8. Export to Excel | sha256:72abfe42a49132de80ba3aba5e3b3d4f2768bc68d05bce1ad4531a27d75ed329
- ui.9: ## 9. Confirm: delete | sha256:54b220b80d7129d76c43ee26792787028fb140c1c99b540189776b8ed1c58c20
- ui.15: ## 15. View mode | sha256:d65759cb2f87af8e2c60a44951906befcb022b449bb0fc709f0f8af000ed9911
- ui.16: ## 16. Dropdowns, lookups, enums | sha256:5eb34c7e77a01349c1b686038a34f2ffa32f03f8d570fd884066df37a5a6cfd8
- ui.17: ## 17. Dates | sha256:00b300ae17bfdba44d8725aa56ef62d7ff5aa9e7dde9da893cbaae769fbf4d73
- ui.19: ## 19. Validation messages | sha256:1d09f983bc9bfc10b29408abd84b9ed3933d1d140a1fe20da4ce84b935ecdde6
- ui.20: ## 20. Report page | sha256:256fc4284c259506cf1fc225bfad10dd36d5dee3ecfb11b5a5029340a8edeedb
- ui.21: ## 21. Report print | sha256:11ea0a036c9d332fa9687d37ef1d4efe9843c0a23252c52bd60f398425fd9db6
- ui.22: ## 22. Loading, empty, error, toast | sha256:895b36e116e8ead97b444e10d6ff9fa7c127a7e6606b18ed80952387b3789974
- ui.23: ## 23. Translations | sha256:0cf1190b29df3b524017967f0fba1a4611c683b902cb344278193f5e06de1377
- ui.24: ## 24. Colors, icons, buttons | sha256:fbaf5c46def760c9466d4d4082c393dfb56a950b1cf0b489e05336d7a821c378
- ui.25: ## 25. RTL and dark theme | sha256:43a3a8e0348d40c7dabf045d26827de50445cb6ba22441e1a7b9db9cdc8f8179
- ui.26: ## 26. Permissions and route access | sha256:60e127ae103c07e526bcb264058fcd0f5c4060abfcfb3e63572e998edfbd9c31
- ui.27: ## 27. Focus and keyboard | sha256:8f5713225ff4aecd70093f9ac8e6ba96c91003126335ebad80f925e573fa8586
- ui.28: ## 28. Request cancellation and stale responses | sha256:b9ee811088e53d9771459815766c135cee973724042db691a7a4444ab5408325
- ui.29: ## 29. Verification expectations | sha256:6c21866c90433891845de658cac061fb8d3a52a778698f1e9f69686f5846e0cf
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
