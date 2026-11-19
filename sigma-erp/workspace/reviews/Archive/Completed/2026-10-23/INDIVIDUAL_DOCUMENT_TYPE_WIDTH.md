# Individual Document Type — fixed width

| Field | Value |
|---|---|
| Date | 2026-10-01 |
| Contract | Frozen: fixed Document Type column width in Individual Documents |
| Implementation | Complete; source-only |
| Owner verification pending | yes |

Reviewer sizing choice: 240px after the owner's request to widen the initial 200px.
The shared table previously exposed minWidth only,
which cannot guarantee a fixed column. Extend its existing column definition with
optional width and render a matching colgroup/fixed layout only when requested.
Individual uses width 240px for Document Type; attachment keeps its 220px sizing
hint and unspecified columns share the remaining width. Long dropdown labels
stay inside the cell. Narrow horizontal overflow remains on the shared frame.

Files: shared editable-collection-table TypeScript/template/styles and Individual
details TypeScript (one column option). Other shared consumers retain automatic
layout because they do not declare width. No feature width CSS, replacement
table, backend/API, persisted field, validation, calculation or migration change.

Existing routed-step shape remains. Applied source discovery/contract, detail
presentation, shared integration and source reconciliation; grid/domain/backend
phases inapplicable. UI 1.16/block 14, changelog and skill updated together.
Generated packets remain stale; canonical sources used, regeneration/semantic
review pending. Prior user edits preserved; no subagents for this small change.

Owner checks: long/short selected types, empty and populated table, View/Edit,
Arabic/RTL and narrow screens. No build, test, lint, browser/runtime, SQL,
migration, commit or deployment run.

Suggested frontend commit: `style(individual): fix document type column width`.
Suggested documentation commit: `docs(ui): document editable column width option`.

Source checks passed: scoped frontend/documentation diff whitespace review (only
frontend LF/CRLF notices), column/template binding review and book/skill references.
