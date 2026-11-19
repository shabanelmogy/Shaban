| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Staff Statement filter rows — 2026-10-03

Owner explicitly requests Report Type filters on one row and buttons on the second. Scope: StaffStatementOfAccount list template only. No screenshot; written request is explicit presentation evidence. Existing Staff reports contract remains authoritative for queries, financial data, allocation, paging, print and export. This amendment freezes a layout-only change: one full-width wrapping filter row containing the existing Date Range/Staff/Report Type/Sub Ledger/Include Inactive controls, with both Report Type options horizontally grouped; the existing action toolbar occupies a separate full-width row. Narrow screens retain shared responsive wrapping/stacking. All handlers, values, busy/disabled gates, labels and print hiding remain.

| Concern | Owning book / approved reference | Shared owner / target |
|---|---|---|
| Report shape | UI20, screen07; Customer Statement / TrialBalance | Existing appReportPage and report filter/action classes retained |
| Full-width filter row | UI20; Customer Statement list's d-flex/flex-wrap/align-items-end/gap-2/w-100 wrapper | Existing layout utilities; same wrapper for all Staff filter controls |
| Horizontal Report Type | UI20; Customer Statement labelled radio group | Existing flex utilities; flex-fill gives the field intrinsic option width; nowrap preserves the two options on one row |
| Action row | UI20; ReportActionsComponent and sigma-report-action-group | Existing toolbar moved by w-100 only; no action logic/style fork |

Recipe drift check passed. Phase02 layout and Phase06 scoped reconciliation apply; no backend/domain/editor/integration phase needed. No schema/API/DTO/AutoMapper/calculation/translation changes; no migration. No repeated pattern needs extraction: this reuses existing utilities and shared components. This is a feature-specific row decision, so no new canonical rule or skill change is required. No subagents: one template edit is below the delegation gate. Pre-edit scoped Git status is clean; unrelated working changes remain outside scope.

## Final source reconciliation

Changed only `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffStatementOfAccount/components/list/list.component.html`. All five filter controls are inside the full-width row; Report Type keeps its labelled radiogroup and both existing radio IDs/ledger/outstanding values, using horizontal nowrap with an intrinsic-width flex-fill field. The action toolbar is a separate full-width sibling. Existing shared row-gap utilities supply spacing. No custom SCSS or shared style edit; no new translations, imports, types, routes or providers.

Verified repository ownership as `F:/My Work/Sigma/SiGmaAngularFrontEnd`, reviewed the complete scoped diff and passed diff --check. The source comparison retains every form binding, handler, loading/disabled expression, report/grid/print block and allocation consumer. Existing RTL/theme/report-action rules own presentation. No unresolved business or API decision. Applied Phase02 and proportional Phase06; backend/editor/domain/integration phases remain out of scope. No migration, AutoMapper or calculation changes.

Owner should visually check both Report Type options beside each other, all report buttons on the next row, Arabic/English and a narrow viewport; existing shared filter/action wrapping remains available. Browser/runtime verification is pending. Builds, tests, lint, browser/application verification, database/migration, Sigma MCP/Graphify, commits/pushes and deployment commands were not run.

Suggested frontend commit, limited to this template: `fix(staff-statement): separate filter and action rows`.
