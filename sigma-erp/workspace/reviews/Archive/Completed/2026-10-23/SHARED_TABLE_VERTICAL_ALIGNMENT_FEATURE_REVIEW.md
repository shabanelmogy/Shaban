| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Application table vertical centering — 2026-10-15

Owner explicitly requests vertically centered elements in every table, including Purchase Requests and other screens. This supersedes UI14's prior top default/optional-middle policy for table cells. It does not change horizontal text/number alignment or ordinary form-grid top alignment.

## Frozen source scope and conformance

| Concern | Owning block | Actual source evidence | Change |
|---|---|---|---|
| All native/legacy/PrimeNG/report tables | UI6 | styles.scss imports vendor styles; Bootstrap/native table inheritance | Global table th/td vertical-align middle!important so vendor defaults do not undo the owner's universal rule |
| Shared DataTable | UI6 | Existing ordinary body middle; wrap class top; no header override | Headers explicitly middle and wrapped cells inherit middle without changing wrap/overflow |
| Editable collections | UI14 | th/td top and body variable fallback top | Shared headers/body fixed middle; field and error remain one cell group; generated actions included |
| Known feature override | UI6 | RentalPlanner planner-group-column top!important and padding-top8 | Remove only contradictory alignment/top offset; preserve group spans, time-slot geometry, sticky behavior and font |
| Help/governance | Master5/7, UI6/14 | Existing shared-screen-guidance and skill digest | Update EN/AR behavior, owning rules and skill/history; regenerate packets |

Source discovery is limited to table presentation selectors and their direct consumers. Existing SalesQuotation/SalesAgreement middle-token declarations already request the same result and need no unrelated edits. Legacy token styling no longer overrides the universal rule. Shared report cells already use middle. Native date-picker/third-party table cells are covered by the same native table rule; controls/other non-table markup are not given new display types or horizontal alignment.

No DTO/API/schema/calculation/state/permission change; no migration. PHASE2/3 shared presentation and source reconciliation only. One root stream: tightly coupled cascade/contract, no subagents. Initial recipe -Check passed all eight. Preserve existing unrelated edits and prior approval/PO deferrals.

Cascade follow-up: editable standalone checkboxes previously had a one-sided margin computed from34px controls, which biases the15px square below a centered cell. Remove that offset and set checkbox vertical-align middle with existing zero margins. UI14/skill now explicitly record it; checkbox size/accent/state stay unchanged.

## Final source reconciliation

Reviewed the complete scoped diffs in styles.scss, DataTable, EditableCollectionTable, RentalPlanner and shared in-app guidance. Universal rule appears after vendor imports, is table-cell-only and uses important to win vendor inheritance; shared header/body/wrap rules agree and no top/bottom cell alignment remains in application HTML/SCSS. Two old middle-token opt-ins remain harmless without consumer-file edits. Checkbox top bias and RentalPlanner group top bias are removed. Horizontal alignment, table display semantics, sizes, spans, wrapping, sticky/scrolling and payloads are unchanged.

Shared guide TypeScript syntax parsing returned zero diagnostics; scoped application/documentation whitespace checks passed. UI6/14, skill digest/history and bilingual overview guidance agree with the explicit owner decision. All eight packets regenerated through the generator; final -Check passed all eight. Reviewed the derivative role/source ownership against the unchanged recipes; prior packet/template/book changes are preserved. No generated file edited directly.

Guide content: existing UserGuide/content/shared-screen-guidance.ts consumed by module overviews, including invoice guide `/UserGuide/invoice`; no separate guide route added. Actual compilation/runtime/visual verification remains pending: Purchase Request editable rows with descriptions/errors/inputs and buttons, wrapped report text, raw/legacy tables, row/header spans including RentalPlanner groups, standalone checkboxes, file fields, all modes, RTL/themes and print. No builds/tests/lint/browser/database/migrations/commits/pushes/deployment ran. Suggested frontend commit `style(ui): vertically center all table cells`; documentation `docs(ui): make table vertical centering universal`. No backend/migration required; deferrals preserved.
