# Overtime filter action placement — 2026-10-10

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

The user requests Overtime buttons on the search-field row. This narrow frontend change places the existing Search, Reset and Excel actions alongside Date Range through the shared filter panel. No business or API decision is required.

## Reference selection and conformance

| Concern | Owning block | Actual reference / shared owner | Target decision |
|---|---|---|---|
| Validated inline actions | UI 4; skill 3.2 | Accounts/Budget/components/budget/budget.component.html; shared/components/filter-panel/FilterPanelComponent | Bind inlineActions=true, stableLayout=true, inlineActionCaption=general.actions. |
| Actual field count | UI 4 | FilterPanelComponent.mainColumns and shared inline grid | Bind mainColumns=1 for the single Date Range field. |
| Feedback and responsive alignment | UI 4 / 19 | filter-panel.component.html/scss, inline-caption rules and 720px media rule | Keep reserved date feedback; shared caption aligns actions to controls; shared narrow layout stacks and wraps. |
| Reset and disabled actions | UI 4 | Shared Reset button/output; existing Overtime resetFilters/actionBusy | Preserve handlers, guards and current-month reset. |

Recipe drift check passed before packet use. Applicable packet: PHASE-02-read-grid, layout slice only. Backend, write, domain-action and runtime phases are outside this request; final reconciliation is scoped source inspection. Historical Overtime implementation records and existing dirty work remain preserved.

## Verification and handoff

Implemented the three public input bindings on HRM/Overtimes/Overtime/components/list/list.component.html. The final source matches each conformance decision above; no feature CSS or duplicate Reset was added. Updated only the Overtime first instruction in UserGuide/content/hrm-guide.ts, English and Arabic, in the existing /UserGuide/hrm reader/menu.

Reviewed the complete scoped tracked template diff separately in the frontend repository and compared both edited files to their pre-edit working-tree snapshots: this request adds one template line and extends one bilingual guide instruction. Other existing changes are preserved. git diff --check passed for the tracked template; both current files have no trailing whitespace or conflict markers. Public shared inputs, template projection, caption/feedback alignment, Reset handler and busy bindings were inspected directly. Build/runtime/browser verification remains pending. No backend, API, mapping, calculation, schema or migration changes are required for this layout request.

Visual acceptance remains owner-pending; check desktop and narrow widths, date feedback, Arabic RTL and both themes. No builds, tests, lint, runtime/browser/database commands, migrations, commits, pushes or deployment were run. No subagents were used because this is a small sequential fix.

Suggested frontend commit: fix(overtime): align filter actions with search fields.
