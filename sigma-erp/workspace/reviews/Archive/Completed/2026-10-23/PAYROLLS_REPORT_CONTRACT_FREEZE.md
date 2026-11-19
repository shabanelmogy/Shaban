# Payrolls Report — frozen read contract

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-10 |

User request: «ضيف بند جديد تحت Reports», with `C:/Users/user/Desktop/Reports/1.PNG` (E1). Implements the displayed Payrolls Report as a working read-only Reports entry, not just a link.

## Manifest and evidence

UI screen 07 Report (UI20/21); backend Pattern 5 (BE17). Approved references: shared ReportPage/ReportActions, Customers/StatementOfAccount list (workflow, print, complete output), Accounts/TrailBalance list via Accounts shared report-family (strip, panel, title), shared DataTable (typed rows). No CRUD/editor/domain actions. Scope: new Reports/PayrollsReport Angular feature, Reports routes/menu, EN/AR keys, Reports module guide in existing reader, dedicated backend filter/DTO/interface/service/controller/DI/resources. Existing unrelated dirty changes, including menu, translations, guide reader and payroll aggregate files, must remain. Existing payroll models/writer are read-only evidence, not edit scope.

Recipe `-Check`: all eight packets OK on 2026-10-10; use phases 00, 01, 02, 05, 06. Phases 03/04 N/A (no editor, mutation or state transition). New bounded report does not alter the owning payroll workflow, so PLAN-00 is not required.

E1 metadata: English/LTR desktop report, 1719×410; user role, capture date/version unknown. Colors, legacy table and page layout are not implementation authority.

| Evidence | Classification | Behavior | Phase | Representation |
|---|---|---|---|---|
| Payrolls Report heading | Explicit | Report entry under Reports | 05 | /Reports/PayrollsReport, app-feature-title |
| Date Range, Staff, Designation; Search | Explicit | Required inclusive range, optional independent staff/designation filters | 01/02 | Typed form, range calendar, existing selects |
| Date From/To, Staff Code/Name/Designation | Explicit | One saved employee payroll line per current monthly payroll revision | 01/02 | Typed shared grid |
| Earnings OT Sub Total/Sub Total; Deductions Sub Total; normal/holiday OT hours; Net Pay | Explicit | Persisted amounts and source snapshot hours | 01/02 | Money/number columns; group names in translated headers |
| Export/Print/Reset | Canonical reference behavior | Full filtered rows, successful nonempty response only | 02/05 | Shared actions, export formatter, print session |

## Reviewer decisions (owner standing rule, Master2 rule6)

1. Use existing PayrollRun → current PayrollRunRevision → PayrollLine; Type == "Payroll" only. Include saved current revisions regardless of approval/payment, as the existing Payrolls list does; older revisions, LeaveSalary and FinalSettlement are distinct workflows and would duplicate/contaminate monthly results. No recalculation or writer changes.
2. Range selects payroll periods overlapping the inclusive date window: PeriodStart < dateTo+1 day and PeriodEnd >= dateFrom. PeriodStart/PeriodEnd are the displayed dates. Reject missing/malformed/reversed dates and upper boundary 9999-12-31. Default current month, not screenshot's incidental six-year range.
3. Earnings OT subtotal = PayrollLine.Overtime; Earnings subtotal = Gross + Additional (excluding separately displayed OT); deduction subtotal = Deductions; Net Pay = persisted NetPay. This is a read projection of the writer's NetPay = Gross + Overtime + Additional − Deductions; reject recomputing salary from mutable current sources or including OT twice.
4. Staff code/name from saved line snapshot. Designation/optional designation filter use the current tenant-owned Staff.StaffDesignationId/Name because ordinary monthly snapshots do not store designation. State this explicitly in guide; do not change writer/hash or imply historical designation.
5. Hours sum NormalOTHours/HolidayOTHours from the saved line SourceSnapshot.Overtime JSON array, not live Overtime or Timesheet. Valid empty array means zero; missing/malformed snapshot/value means null (display —), not invented zero. Parsing/aggregation of already-filtered stored JSON in memory is necessary because the existing snapshot is a JSON string; no N+1 or mutable-source fallback. No overall totals required by E1; response contains rows and applied date range only.
6. Complete unpaged endpoint; shared local paging default/options, authoritative scope is all filtered rows. Print turns paginator/scrollable off through shared session; Excel reads complete rows. No server sort or row actions. Group-prefixed translated flat columns preserve the logical groups without copying colored legacy header markup.

## API/filter contract

GET PayrollsReport, [Authorize], Result<PayrollsReportDto>. Filters[dateFrom], Filters[dateTo] required yyyy-MM-dd; Filters[staffId], Filters[designationId] optional positive integer, absent means all. Empty optional values omitted by toFilterParams; malformed/nonpositive supplied IDs rejected, never silently broadened. QueryReport for rows, explicit live/tenant parent and related-record predicates; fail-closed subscription behavior retained. No client subscription field, manual token, feature HttpClient or permission API.

| Grid field/order | Type | Row DTO property | Source |
|---|---|---|---|
| periodStart | date | PeriodStart | run |
| periodEnd | date | PeriodEnd | run |
| staffCode | text | StaffCode | line.Code |
| staffName | text | StaffName | line.Name |
| designation | text | Designation | current StaffDesignation |
| overtimeSubtotal | money | OvertimeSubtotal | line.Overtime |
| earningsSubtotal | money | EarningsSubtotal | line.Gross + line.Additional |
| deductionsSubtotal | money | DeductionsSubtotal | line.Deductions |
| normalOTHours | number/null | NormalOTHours | saved JSON |
| holidayOTHours | number/null | HolidayOTHours | saved JSON |
| netPay | money | NetPay | line.NetPay |
| row identity (hidden) | number | Id | line.Id |

Report DTO: DateFrom, DateTo, Rows only; no ListVM, write DTO, report entity or AutoMapper. One named type/file. Backend DI extends existing registration only; localized failures in both GeneralMessage resources. No schema change/migration/accounting effect/access change.

## Reference conformance before implementation

| Concern | Book | Actual reference/shared owner | Target commitment |
|---|---|---|---|
| Container/title | UI1/3/20 | StatementOfAccount + report-page + styles.scss | sigma-route-host sigma-print-flow; filling shared report panel; no local SCSS |
| Filters/actions | UI16/17/20/24 | TrialBalance → account-report-page; report-actions; PrimaryActionButton | canonical strip/calendar/selects; Search submit; other actions button; form disable |
| Rows/format/paging | UI5/6/8/20 | data-table.component/DataTableColumn + dataTableExportRows | exact ordered typed columns, no private table/sort; complete source |
| Failure/lifetime | UI22/28 | StatementOfAccount + apiErrorMessage, takeUntilDestroyed | inline suppressed-interceptor owner; both channels; lookup Retry/gate; invalidation on edit |
| Print | UI21 | ReportPrintService.createSession | complete rows; sigma-print-flow; preserve page/size; disable filters/actions |
| Guide | Master7 | UserGuide reader/GuideSection | bilingual Reports guide, /UserGuide/reports + menu entry |

Search/Reset/Print/Excel supported. Reference account navigation and section-specific accounting exports N/A: payroll has no ledger/account sections. No confirmations/dirty discard/transitions/upload. Authorization candidate: payroll data/print/export may warrant future permission rules, but current authenticated+tenant boundary remains as instructed. Shared owners already cover all presentation; no new extraction necessary.

## Owner amendment — HRM ownership (2026-10-10)

The owner subsequently requested `src/app/modules/Reports/PayrollsReport` → `src/app/modules/HRM/Reports` and clarified «انا مش عايزه خارج HRM منطقى يكون تحت HRM». This supersedes the frontend placement/navigation portions above: files belong directly in HRM/Reports; the menu belongs in the existing HRM Reports subgroup; the operational route is `/HRM/Reports/PayrollsReport` through an HRM report route file. The topic belongs to the existing `/UserGuide/hrm` guide rather than a separate Reports guide. Data/API/filter/column/calculation contracts remain Frozen as previously recorded. Remove the former root Reports report/guide registrations; no separate implementation, permission or backend change.

### Owner route simplification (2026-10-10)

Owner requested removal of the redundant PayrollsReport URL segment. The final operational URL is `/HRM/Reports`: the existing `HRM/Reports` lazy parent loads the report at child `path: ''`. Sidebar and HRM guide use this URL. This supersedes the preceding longer URL only; source location, data/API contracts and single Report menu name remain unchanged.
