# Payrolls Report — implementation and final reconciliation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-10 |

**Current frontend ownership (owner follow-up, 2026-10-10):** the report now lives directly in `src/app/modules/HRM/Reports`, is listed under HRM → HRM Reports → Report, and opens at `/HRM/Reports`. Its topic is in `/UserGuide/hrm`. The follow-up reconciliations at the end supersede the initial frontend placement/guide references below; the original backend/data decisions are unchanged.

Implemented the user's «ضيف بند جديد تحت Reports» request and E1 (`C:/Users/user/Desktop/Reports/1.PNG`) through a working read-only Payrolls Report. Frozen scope/evidence/decisions: `PAYROLLS_REPORT_CONTRACT_FREEZE.md`. New route `/Reports/PayrollsReport`, menu label Payrolls Report / تقرير الرواتب, and authenticated `GET PayrollsReport`.

## Files changed by this task

All paths below are relative to the verified repository roots.

Frontend root: `F:/My Work/Sigma/SiGmaAngularFrontEnd`

- `src/app/modules/Reports/PayrollsReport/models/payrolls-report.ts`
- `src/app/modules/Reports/PayrollsReport/services/payrolls-report.service.ts`
- `src/app/modules/Reports/PayrollsReport/components/payrolls-report.component.ts`
- `src/app/modules/Reports/PayrollsReport/components/payrolls-report.component.html`
- `src/app/modules/Reports/reports.routes.ts` — one import and report child route.
- `src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts` — report entry and Reports guide entry; guide placed at the end of the Reports group, matching current module convention.
- `src/app/modules/i18n/vocabs/en.ts`, `ar.ts` — 24 matching `payrollsReport` keys and `userGuide.reportsMenuEntry`.
- `src/app/modules/UserGuide/content/reports-guide.ts` — one bilingual Payrolls Report topic and journey/questions.
- `src/app/modules/UserGuide/components/reader/guide-reader.component.ts` — Reports guide registration.

Backend root: `F:/My Work/Sigma/SigmaBackend`

- `SiGma.ViewModels/ViewModels/PayrollsReport/PayrollsReportFilterVM.cs`
- `SiGma.Helpers/Dtos/PayrollsReport/PayrollsReportDto.cs`
- `SiGma.Helpers/Dtos/PayrollsReport/PayrollsReportRowDto.cs`
- `SiGma.Business/IServices/IPayrollsReportService.cs`
- `SiGma.Business/Services/PayrollsReportService.cs`
- `SiGma.ServerAPI/Controller/PayrollsReportController.cs`
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx`, `GeneralMessage.ar-SA.resx` — two report validation keys each.

Menu, vocabularies, guide reader and resource files already had unrelated changes. This task extends their current content; the existing HRM/leave/overtime/payroll/workshop changes are not part of this report's suggested commits. Existing payroll writer/models/configurations/migrations remain untouched by this task.

## Decisions and evidence reconciled

UI shape 07 Report; backend Pattern 5, with separate read service/controller, not CRUD. E1 explicitly supplies the title, three filters, Search, eleven business columns and six logical groups. Colors/header rendering are governed by UI20/5/6, not E1: translated group-prefixed headers preserve the groups in the shared flat DataTable. No unsupported screenshot value, permission, accounting effect, editor or action was invented. No unresolved contract blocks implementation.

| Decision | Final source/evidence |
|---|---|
| Population | `PayrollsReportService.GetReportAsync`: Payroll type, current saved revision only, including unapproved/paid current revisions. No prior revision duplication, LeaveSalary or FinalSettlement rows |
| Range | Required strict yyyy-MM-dd server dates; inclusive overlap `PeriodStart < dateTo+1 day && PeriodEnd >= dateFrom`; whole saved period amounts, no prorating. Current month default on frontend |
| Identity/designation | Saved `PayrollLine.Code/Name`; left `QueryReport<Staff/StaffDesignation>` joins for current designation. Missing/deleted current staff preserves saved rows and gives a blank current designation; designation filter narrows explicitly |
| Earnings/calculation | `Overtime`, `Gross+Additional` excluding OT, `Deductions`, persisted `NetPay`; source writer `PayrollRunService.CalculateCoreAsync` owns salary calculation. UI does no monetary sums |
| Hours | Stored PascalCase SourceSnapshot.Overtime → NormalOTHours/HolidayOTHours. Valid [] gives 0; missing/malformed values or decimal overflow give null for the affected total. Frozen JSON aggregation exception executes after filtering, one DB query, no live OT fallback |
| Response scope | One complete unpaged `ToListAsync`, no Take/Skip/page-size clamp/count metadata. DTO has DateFrom/DateTo/Rows; no overall summary totals are required by E1 |
| Output | Local shared pagination only. Excel takes complete `rows()` through `dataTableExportRows`; print session disables paginator/scrollable and retains page/size |
| API security | [Authorize]; all five source tables scoped/live through `QueryReport`; run/revision ownership equality additionally checked. Existing AuthGuard and root interceptor client retained, no new permission mechanism |
| Mapping/DI | No AutoMapper or generic overrides. Dedicated service is registered by existing `SiGma.ServerAPI/Extensions/DependencyResolver.cs` assembly scan with scoped lifetime |
| Schema | No entity/configuration/nullability/index/relationship changes. No new Add-Migration required for this report; existing payroll schema is an owner deployment prerequisite |

Grid and row DTO match exactly, in order:

| Grid field/type | Row DTO property |
|---|---|
| periodStart/date | PeriodStart |
| periodEnd/date | PeriodEnd |
| staffCode/text | StaffCode |
| staffName/text | StaffName |
| designation/text | Designation |
| overtimeSubtotal/money | OvertimeSubtotal |
| earningsSubtotal/money | EarningsSubtotal |
| deductionsSubtotal/money | DeductionsSubtotal |
| normalOTHours/number nullable | NormalOTHours |
| holidayOTHours/number nullable | HolidayOTHours |
| netPay/money | NetPay |
| hidden stable identity: id | Id |

No ListVM or write/detail payload exists. Grid has no row actions, selection or server sort. All eleven business columns export, with click-time EN/AR headings and shared date/money formatting; no optional export-only transport fields.

The final source audit found that shared DataTable renders nulls as empty text, rather than the UI20 report dash. The target's permitted small column `value` transformations provide `—` for unavailable text/hours, preserving numeric zero with `??`; the shared export consumes the same transformations. No shared formatter or feature table copy was introduced.

| UI filter | Transport/backend key | Type and absence |
|---|---|---|
| dateRange | Filters[dateFrom], Filters[dateTo] | required ordered complete dates; upper bound 9999-12-31 rejected |
| staffId | Filters[staffId] | nullable number, null omitted, supplied nonpositive/malformed values rejected |
| designationId | Filters[designationId] | nullable number, null omitted, supplied nonpositive/malformed values rejected |

Filter DTO normalizes key comparison case-insensitively. UI select options are normalized to positive numeric IDs, dropdown defaults null. Both selects are independent and combine with AND. Changing filters invalidates previous rows/applied context; Reset restores month/clears selects, preserving chosen page size. Report request and print disable reactive controls without emitting value changes. Search guards busy and lookup readiness, so no overlapping search/paging requests; paging is local and does not request the API.

## Final reference conformance and report evidence

| Concern/book | Producer/reference and target comparison | Source result |
|---|---|---|
| Panel/title UI1/3/20 | StatementOfAccount and TrialBalance→account-report-page use shared report fill/panel. PayrollsReport host has sigma-route-host/sigma-print-flow; outer appReportPage fill; direct FeatureTitle; no local stylesheet or viewport calculation | Conforms; visual pending |
| Strip/controls UI16/17/20 | Shared global sigma-report-filter-panel/stable and action-group; target uses canonical Calendar appDatePicker range/two months/typeable keepInvalid/body overlay plus dateRangeValidator+required, existing Staff/Designation GetSelect choices | Conforms; manual typing/RTL pending |
| Actions UI20/24/27 | PrimaryActionButton's public type/loading/disabled match submit Search; reset and print/Excel use shared btn/variants inside appReportActions, translated labels/decorative icons; Enter has one form submit | Conforms |
| Table UI5/6/20 | Shared DataTable public fields, type, value, first/rows/count, lazy=false, fill=true. Every target column is in the typed row/DTO; `resolveListPaging` adapts pageSize to rows before state writes. Complete response proven from backend; no private row renderer/table CSS | Conforms |
| Output UI8/21 | `dataTableExportRows` uses complete rows and current translated keys. `ReportPrintService.createSession(DestroyRef)` → target printing signal; `paginator/scrollable=!printing`, print-flow on all bounds; no private body/afterprint/window.print lifecycle | Conforms; print/cancel pending |
| Errors/lifetime UI22/28 | Both report and lookup reads send existing skip-error header; target handles false Result and HTTP errors with apiErrorMessage, required lookup batch local loading/retry/readiness, report global loader finalized and all subscriptions takeUntilDestroyed | Conforms |
| Report states UI20/22 | Initial structure with searchPrompt, successful empty noData, false/HTTP failure error with empty suppressed, rows cleared before request/on filter edit. Busy guards all actions and no fake preview values | Conforms |
| Route/provider UI1/26 | Existing pages/routing Reports lazy owner → Reports_Routes child → standalone PayrollsReport. Service root/environment.baseUrl → AppModule one HttpClient with tokenInterceptor/errorInterceptor; [Authorize] endpoint and QueryReport tenant scope | Conforms; runtime navigation pending |
| Guide Master7 | REPORTS_GUIDE registered in existing GuideReader; /UserGuide/reports via Reports sidebar; topic payrollsReport.title links actual /Reports/PayrollsReport | Conforms; reader/print acceptance pending |

Canonical action inventory: Search, Reset, Print, Excel Supported. Separate Refresh is represented by repeating Search after successful output; edits clear output, so there is no retained stale-filter Refresh state. Statement account/ledger links, typewise accounting export and section tabs N/A: this flat payroll dataset has no ledger identifiers, charge grouping or secondary sections. CRUD, dirty discard, confirmation, domain transitions, documents/uploads N/A.

No shared extraction was needed: all title/filter/calendar/grid/state/action/print/export/focus owners already exist. No new reusable rule established, so no canonical book/skill edits or packet regeneration required. The initial recipe check reported all eight packets current; phases 00/01/02/05/06 applied, 03/04 skipped for the read-only feature. No PLAN-00 required because the bounded report does not change payroll writers or workflow.

## Guide handoff

Content: `src/app/modules/UserGuide/content/reports-guide.ts`. Guide `/UserGuide/reports`; entry `userGuide.reportsMenuEntry` under Reports. One screen topic `payrollsReport.title`, three journey steps, three questions, bilingual purpose/steps/notes. Source-matched topics cover saved payroll prerequisites, current revision/approval scope, whole-period date overlap, independent current-designation filter, persisted earnings/deductions/net, stored OT hours and unavailable-vs-zero distinction, validation, lookup Retry, error recovery, Reset, complete print/Excel and preserved pagination. Guide does not promise calculation/approval/posting/payment.

## Verification and pending acceptance

- Verified each scoped file's actual Git root separately.
- Root reviewed new frontend sources in full and tracked task-owned route/menu/reader/vocabulary hunks, preserving pre-existing changes. Backend worker reviewed six added-file diffs and complete resource diffs; root independently reconciled final service/query/DTO/controller/interface and added resource keys with Angular consumers. Scoped whitespace/merge-marker checks clean.
- Source AST audit: nine frontend TS files parse without diagnostics; all direct relative/src import paths resolve. This does not establish type checking, Angular compilation or runtime behavior. Named shared exports/standalone registration/input contracts inspected directly (DataTable, FeatureTitle, FieldError, PrimaryActionButton, report hosts, DatePicker, StateMessage, PrimeNG Dropdown loading).
- Required Check-Translations ran: new report 24 EN/AR keys, no missing/case differences. AST additionally verifies 24 report keys and 34 userGuide keys per language, no mismatches/duplicates, including reportsMenuEntry. No wider dictionary changes made by this task.
- Resource XML parses, both new keys present exactly once in each language. No new service/controller overrides or mappings.

Owner checks: compile both affected applications; ensure the existing payroll schema is available; open Reports→Payrolls Report and direct route; search default/wide/boundary/empty ranges, each selector and both together; compare saved amounts/hours with the latest payroll revision, verify previous revision/other types excluded and approval not required; check missing snapshot vs empty OT, historical staff and current designation changes; exercise lookup/report failure and retry; change filters after search; page/size then print/cancel and Excel all rows in both languages; verify no page scroll, narrow layout, RTL, light/dark, guide navigation and print. EF translation of the five-source query and memory/output cost for very broad ranges remain runtime risks requiring owner acceptance. No new contract blocker remains.

No builds, tests, lint, database commands, migrations/snapshots, browser automation, Graphify, Sigma MCP, commits/pushes or deployment ran.

## Agent utilization

One bounded inherited-model backend worker (`payroll_report_backend`), after root discovery and contract freeze, owned only six backend files plus report resource keys. Root owned Angular/report wiring/guide/artifacts and final integration. Routine terra routing was unavailable, so the existing model was inherited as permitted. The non-overlapping backend and frontend slices ran concurrently to reduce wall-clock time; no duplicate implementation or merge overlap.

Suggested commits (stage only files listed above):

- SiGmaAngularFrontEnd: `feat(reports): add payrolls report screen and user guide`
- SigmaBackend: `feat(reports): add saved payrolls report endpoint`

## Owner follow-up — move fully under HRM (2026-10-10)

Authorization: `src\app\modules\Reports\PayrollsReport خليها src\app\modules\HRM\Reports`, then «انا مش عايزه خارج HRM منطقى يكون تحت HRM». Contract amendment recorded in `PAYROLLS_REPORT_CONTRACT_FREEZE.md` before source relocation.

- Moved the existing component TS/HTML, model and service directly into `src/app/modules/HRM/Reports/{components,models,services}`. Resolved source/destination were verified within the frontend repository; target did not exist. SHA256 checks confirmed all four files retained identical content. Relative Staff/shared imports remain correct because folder depth is unchanged.
- Added `src/app/modules/HRM/Reports/reports.routes.ts` (`HRM_REPORTS_ROUTES`) and a lazy `HRM/Reports` route in `src/app/pages/routing.ts`; final URL `/HRM/Reports/PayrollsReport`.
- Moved the sidebar entry into the existing `sideMenu.hrms.hrmreports` subgroup. Removed its old top-level Reports entry and the temporary Reports guide entry. Existing other menu items preserved.
- Removed the report import/child from `modules/Reports/reports.routes.ts`; that file is now identical to its pre-feature Git version. Removed the temporary `REPORTS_GUIDE` reader registration and `userGuide.reportsMenuEntry` EN/AR keys; other pre-existing HRM reader/translation changes preserved.
- Preserved the complete bilingual report topic and three questions in `src/app/modules/UserGuide/content/hrm-reports-topics.ts`, authored as typed `GuideTopic`/`GuideQuestion` arrays. Existing `hrm-guide.ts` composes them and adds the actual HRM menu path/prerequisite step; its existing topic/journey/questions are preserved. Guide route/menu now uses existing `/UserGuide/hrm` and `userGuide.hrmMenuEntry`. Removed the superseded `content/reports-guide.ts`.

| Concern | Final reconciliation |
|---|---|
| Folder/route UI1 and Phase5 | New reports route imports actual moved standalone component; existing root lazy route imports HRM_REPORTS_ROUTES; sidebar and guide use the same new URL |
| UI/report shape UI20 | Same component/model/service/template/controls/actions/print/output and API. No new screen pattern or business contract |
| Guide Master7 | Report topic once in existing HRM guide; bilingual explanation retained and navigation corrected; no standalone Reports guide remains |
| Source-only gate Phase6 | Ten directly scoped TS files parse without diagnostics; static and dynamic import paths resolve. Old folder absent, obsolete report/guide references absent from the audited consumers. Scoped tracked diff/whitespace checks clean; moved file content hashes preserved |

Only integration/reconciliation phases 05/06 needed for this follow-up; evidence/API/grid/write/action phases are unchanged. No backend, AutoMapper, calculation or schema changes; no migration. No subagent: one small sequential frontend relocation did not meet the delegation gate. No prohibited commands run. Compilation, new direct-route/menu navigation, report/guide runtime and previous owner acceptance remain pending; suggested owner check: open HRM → Reports → Payrolls Report and `/UserGuide/hrm` → Payrolls Report. The former root Reports route is intentionally removed following the owner's explicit HRM ownership instruction.

Suggested frontend follow-up commit: `refactor(hrm): move payroll report under hrm reports`.

### Owner menu-name follow-up (2026-10-10)

Owner requested the HRM Reports item be named Report only and the extra duplicate removed. The two adjacent payroll/report-placeholder entries were consolidated into one `general.report` entry (existing EN Report / AR تقرير) opening `/HRM/Reports/PayrollsReport`. Driver Timesheet remains separately listed. Updated the bilingual menu-navigation step in `hrm-reports-topics.ts`; the screen title/API/data and route are unchanged. Scoped source/whitespace/label checks passed; no build, test or other prohibited command, no backend/schema change or subagent. UI1/23, Master7 and Phase5/6 source conventions retained. Suggested commit: `fix(hrm): consolidate payroll report menu entry`.

### Owner route simplification (2026-10-10)

Removed the redundant PayrollsReport segment at the owner's request. Final source: `HRM/Reports/reports.routes.ts` maps child `path: ''` to PayrollsReportComponent; the existing parent in `pages/routing.ts` remains `HRM/Reports`. Sidebar Report and the bilingual HRM guide topic both link `/HRM/Reports`. Source-only route/import/syntax and scoped whitespace checks passed; no longer URL remains in active consumers. No backend, schema, translations, calculation or screen behavior changes. No subagent or prohibited command. Owner verification pending: navigate Report or `http://localhost:4200/#/HRM/Reports` and open the report from `/UserGuide/hrm`. Suggested frontend commit: `refactor(hrm): simplify report route`.

### Owner filter-action alignment (2026-10-10)

Owner requested report buttons at the same level as search controls. The HRM report template adopts UI20's canonical `sigma-report-filter-panel--inline`, public three-filter column count, and actions-field wrapper with translated invisible aria-hidden caption. Existing shared 34px button/input height, top label geometry, 1250px/640px responsive fallbacks, RTL/theme and wrapping remain owned by `src/styles.scss`. Compared directly against `Accounts/shared/report-family/account-report-page.component.html` inline actions and the shared CSS; no feature stylesheet/offset or control duplication. Search remains the same form submit; all four actions and busy/print gates are preserved. Existing HRM guide still accurately describes the same workflow/actions, so no guide content change needed. Recipe Check: all eight packets current. Scoped template source/diff/whitespace reviewed; owner desktop/narrow/RTL/visual acceptance pending. No backend/API/schema/translation change, migration, subagent, build/test/lint/browser/database/commit. Suggested frontend commit: `fix(hrm): align report actions with filter controls`.
