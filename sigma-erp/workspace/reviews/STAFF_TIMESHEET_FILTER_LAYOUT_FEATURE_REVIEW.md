# Staff Timesheet filter layout

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Frozen scoped decision — 2026-10-12

Owner requests all StaffTimesheet filters in the first row and explicitly places actions on a second row. Promote Code and Designation from the advanced template into the main grid after Month and Staff. Select shared mainColumns=4, stableLayout=true and the ordinary separate toolbar (no inlineActions). Remove the now-unused advanced directive/import/state. Preserve four typed controls/validators, route/query/export/reset behavior, projected actions, busy gates and existing shared below1200 collapse.

References: Master4/5/7; UI4/29; sigma-screen-refactor §§3.1/3.2; current PHASE-02/06 packets after all-eight recipe check. UI shape: ordinary paged list, Workshop/Job list actual form and shared FilterPanel TS/SCSS own fields/toolbar/breakpoints. No backend shape change.

| Concern | Book / actual reference | Shared owner / target |
|---|---|---|
| Form and fields | UI4, Job list labelled main fields and projected actions | FilterPanel mainColumns4; same StaffTimesheetsComponent filterForm, all four controls visible |
| Actions and feedback | UI4, FilterPanel direct toolbar and34px controls | Existing Reset/Excel/Search in separate toolbar; reserved month feedback/stable layout unchanged |
| Responsive / collapse | UI4/29, FilterPanel styles | >1250 four fields;721–1250 shared3-track wrap;<=720 one track; below1200 shared disclosure |
| In-app guide | Master7, HRM_GUIDE existing StaffTimesheet topic | Update EN/AR filter instructions; existing /UserGuide/hrm and sidebar Guide entry |

Source-only validation; owner visual/RTL/theme/keyboard checks pending at1251/1250/1249,1201/1200/1199,721/720/719 and intermediate widths/long Staff names. No new shared capability needed: reuse existing mainColumns and toolbar. Small sequential fix; no delegation.

## Final reconciliation

Frozen decision implemented in StaffTimesheet list HTML/TS and `UserGuide/content/hrm-guide.ts`. All four controls now project into the main4-column grid, with the existing separate Reset/Excel/Search toolbar. Removed only the advanced template, directive import/registration and two unused state members. No query, validator, search/export/reset handler or service changes. Labels/translations remain the existing keys; updated the bilingual StaffTimesheet guide topic at `/UserGuide/hrm` using its existing reader/sidebar entry.

Complete scoped frontend diff reviewed; diff --check passes (line-ending warning only). No stale advanced/inline binding remains in the list. Shared filters, stable feedback, below1200 disclosure,1250/720 wrapping and title action behavior retained. No local CSS or new shared rule/capability; no canonical book changes or packet regeneration needed (initial all-eight check current). No screenshots supplied or unresolved business decisions. Discovery/presentation freeze, Phase2 layout and Phase6 source reconciliation applied; backend/editor/domain-action/runtime phases outside this layout scope. No backend/mapping/calculation/schema changes; migration not required. Prohibited builds/tests/lint/browser/database/migrations/commit/push/deployment not run.

Owner checks: all four fields and lower toolbar above1250, readable wrapped fields at intermediate/mobile widths, disclosure retaining values below1200, reserved feedback, long staff names, EN/AR and light/dark. Runtime/visual acceptance pending. Suggested frontend commit only: `refactor(staff-timesheet): show filters together above actions`.
