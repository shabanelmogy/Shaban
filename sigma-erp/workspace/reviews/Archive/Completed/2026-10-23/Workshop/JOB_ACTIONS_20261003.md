# Workshop Job action dialogs

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | Job/components/close-job, labour-time, time-logs |

Frozen action contracts remain: Close summary plus optional invoice is persisted atomically by one Close request; time-log mutations save immediately and backend owns actual-time total; locked log lines are read-only. Existing financial precision/tax allocation remains authoritative.

| Concern | Book | Reference/shared owner | Before finding |
|---|---|---|---|
| Action shell/lifecycle | UI7/13/19/22/28 | Job close action and EditorDialog; BaseComponentService loading counter; StateMessage | Primary reads/writes lack global loading lifecycle, no Retry, stale data retained on ID null/change |
| Dates/rows/step | UI12/14/17/19 | Job editor DatePickerDirective/date validators; EditableRows; StepFormComponent | Close calendar Date-only types can hold invalid strings; local row add/remove bypass locks; bespoke step/validation markup |
| Read tables/totals | UI6/14/24 | DataTableComponent; SummaryCardsComponent; approved report/shared table | Close, labour-time and logs own native tables and palettes; backend totals formatted with literal precision |
| Mutation errors | UI22 | apiErrorMessage; JobService targeted skip header root-owned | Existing inline mutation errors otherwise duplicate global error owner; root requested exact header integration |

Phase 4 consumes frozen Job action state; owning UI13/19/22/28 and current shared source are read. No domain, endpoint, state, permission or accounting-policy change is authorized. Source-only verification; all runtime acceptance pending.

## Root integration acceptance — 2026-10-04

Status: Implemented — source-only; owner verification pending: yes. Root reviewed all three action TS/templates and shared adapters, integrated exact mutation skip-error headers and Close/discard labels, corrected invalid @else-if alias syntax, and added shared discard confirmation for entered unsaved minutes. Close keeps authoritative summary and optional invoice flow; date transport is local and financial previews use backend-provided precision with shared allocation. Late confirmations check identity/busy/readiness; forms freeze during persistence and failed primary reads expose Retry. Parser checks pass for all21 Workshop templates and85 TypeScript sources. Source-only status does not imply Angular/C# compilation or runtime acceptance. Manual owner cases are listed in ../WORKSHOP_FEATURE_REVIEW.md.