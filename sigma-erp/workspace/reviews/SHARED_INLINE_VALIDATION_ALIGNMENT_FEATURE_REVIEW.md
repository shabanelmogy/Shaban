# Shared editable row feedback alignment

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-24 |

## Manifest / decisions / evidence

Owner explicitly requests general shared behavior after a Prepaid Expense screenshot shows one dropdown above its neighboring control when a multiline account-type message appears. [Frozen plan](SHARED_INLINE_VALIDATION_ALIGNMENT_MAINTENANCE_EVOLUTION_PLAN.md) and [presentation contract](SHARED_INLINE_VALIDATION_ALIGNMENT_UI_CONTRACT_FREEZE.md) govern this bounded cross-cutting amendment. Screenshot is functional evidence only. Source proves the shared native editable table uses middle-aligned cells except rows with app-field-error/app-file-field; Prepaid Expense already projects a `.sigma-field-error` below one dropdown. That feedback marker was absent from the exception. No runtime geometry measured.

Selected frontend shape is shared UI14 editable collection presentation (used by UI06 settings and financial/detail editors); backend not applicable. Actual approved/shared owner EditableCollectionTable component/template/SCSS inspected, with FieldError public component/UI19, global styles.scss middle!important cascade, PrepaidExpense projected template and shared UserGuide behavior. No new markup/control/state/route/provider/permission/payload or domain rule. Reference-module source unchanged. Existing sidebar UserGuide paragraph and all unrelated working-tree edits preserved.

## Implementation / conformance

| Concern | Owning rule / actual target | Final source |
|---|---|---|
| General presentation | Master5/owner scope; EditableCollectionTable SCSS | All existing consumers inherit predicate expansion, no screen opt-in |
| First control line | UI14; tbody tr:has predicate | Canonical field error, existing sigma-field-error and FileField rows top-align every td via the existing important override |
| Remove | UI14; same row predicate | Existing control-height/min-height uses34px token fallback for compatibility feedback too |
| Standalone flag | UI14; direct checkbox selector | Existing logical block offset centers15px square on first34px control line, independent of wrapped error height |
| Ordinary tables | UI6/global styles.scss | Middle defaults unchanged for headers/empty/body rows outside exception |
| Feedback | UI19; existing class compatibility | Full content-sized message remains below control; no clipping, absolute placement, duplicate alert or forced error height |
| Layout | UI14 shared template/frame | Table/td display,7px/9px padding, widths/frozen first cell, scroll owner, theme and RTL unchanged |
| User guide | Master7; shared-screen-guidance.ts | EN/AR behavior explains first control line versus ordinary middle rows; existing module overview reader consumes it |
| Learning | UI14 + screen skill | Same-task compatibility rule/checklist/revision added; UI19 canonical FieldError requirement retained |

Only application edits: three selectors and their shared comment in `src/app/modules/shared/components/editable-collection-table/editable-collection-table.component.scss`; EN/AR paragraph in `src/app/modules/UserGuide/content/shared-screen-guidance.ts`. No feature-level CSS or migration. No screen translations needed: text remains in bilingual guide records, existing inline error keys and role=alert untouched. No type/import change or AutoMapper/backend work.

## Source-only reconciliation / owner verification

Phases0/1(presentation only)/3/6 applied after PLAN-00; Phase2 new data/grid contract, Phase4 domain action and Phase5 wiring not applicable. Read applicable canonical UI14/19 and Master scope/shared/guide gates. Initial all8 recipe checks current. Manifest dependency scan identified PHASE-03 as the sole UI14 consumer; regenerated only that packet via generator, reviewed its UI14 provenance and unchanged shared reference roles semantically, then all8 checks passed. No generated hand edits. Existing documentation repository diff predates task; this task adds only UI14 compatibility wording/provenance refresh.

Scoped frontend source diff and whitespace reviewed separately from documentation repository diff/check. All three predicates match the same three feedback markers; geometry values were not changed. CSS :has was already required by the shared rule, so no new selector/browser requirement. Existing global important rule is overridden by the already more-specific scoped important rule. No tests written for this reversible CSS amendment. Build/tests/lint/browser/database/migrations/commits/deploy/Graphify/Sigma MCP were not run. One coherent CSS/canonical/guide dependency chain; no subagents because delegation overhead exceeds this small fix.

Owner should rebuild frontend and verify the same Prepaid Expense case: selectors and Remove stay on one first-control line, long message expands below, actions remain reachable. Also exercise canonical field error valid/invalid state, one/two multiline messages, upload row, standalone/captioned checks, no-feedback and empty/read rows, narrow width/horizontal scroll, English/Arabic, both themes and print. Source-only conformance does not certify visual/browser acceptance. No migration or backend rebuild required for this presentation amendment. Suggested frontend commit: `fix(shared-table): align controls with existing inline feedback`. Suggested documentation commit: `docs(ui): clarify shared validation row alignment`.
