# HRM comprehensive source review — 2026-10-12

| Item | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Requested outcome | Comprehensive review of `src/app/modules/HRM` and improvement recommendations |
| Execution | Source-read-only; application source/configuration/instructions unchanged |

## Feature Review Manifest

- Scope: all HRM frontend components, templates, styles, routes, models and services; their directly consumed backend endpoints/DTOs/services; direct shared dependencies and HRM translation/user-guide wiring. This is not a full backend-domain certification.
- Existing user changes: StaffTimesheet list TS/HTML and `UserGuide/content/hrm-guide.ts`; preserved and reviewed in their current state. Backend initially clean.
- Evidence: current source, existing historical HRM frozen contracts/reviews and canonical books. No screenshots/video or runtime evidence supplied in this task.
- UI shapes: normal entity lists/modal editors (screen01); Leave approval workflow (screen02 decision-rule candidate, current modal reviewed as existing behavior); settings/account-mapping workspaces (screen06); payroll/leave salary/final settlement stateful financial workspaces (screen05/08 conventions with frozen custom snapshot contract); PaySlips read-only list/detail; report pages (screen07); attendance/OT monthly processes as feature-owned operational exceptions.
- References selected by catalog: Workshop/Job list; shared EditorDialog/EditorTabs; Accounts/Link Accounts settings; Accounts/openingBalances financial collection; Accounts/TrailBalance report presentation and Customers/StatementOfAccount report semantics. Backend BranchService normal entity, PurchaseOrderService aggregate mechanics, InvoiceService server-money ownership, BE16 settings and BE17 reports. References remain read-only.
- Phases: 00 discovery; 01 existing-contract/API audit; 02 lists/filters/reports; 03 detail/write; 04 domain actions; 05 route/provider/interceptor integration; 06 source reconciliation. No implementation phase is authorized. PLAN00 target design/freeze is not required for a read-only audit; recommendations do not constitute a frozen implementation plan.
- Contract authority: existing HRM Payroll, Settings, Account Linking and Data Integrity frozen records; historical decisions retained, current producer/consumer evidence wins for factual behavior. New business rules are not invented.
- Authentication: layout AuthGuard; authorization gap is known/deferred (UI26/30 item20). Record candidates without claiming button visibility is security.
- Packets: generator `-Check` passed all eight packets before use; no refresh needed.
- Exclusions: application edits, unrelated features, migrations/snapshots, builds/tests/lint/runtime/browser/DB commands, commits/push/deployment, Graphify and Sigma MCP.

## Findings and recommendations

Review completed against the current working tree. Draft means the recommendations and unresolved target policies are not approved/frozen; it does not mean source investigation is still running. No application fix is implemented by this review.

Inventory: **188 HRM files, 35 components/templates, 23 stylesheets, 130 TypeScript files including 12 specs**. Root reviewed Payroll/Reports/integration and integrated two bounded read-only audits for Attendance/Overtime and Leaves/Administration/Holidays/Deductions. Exact source facts below are distinguished from runtime hypotheses and business-policy decisions. Severity P2 means meaningful correctness/recovery issue; P3 means a narrower edge or usability/localization issue. No P0/P1 new finding is asserted from this source-only audit.

### F01 — P2: numeric input validation does not match persistence precision/capacity

**Confirmed source discrepancy; actual deployed schema/conversion owner-pending.** Two current paths accept values the configured storage cannot represent faithfully:

- StaffTimesheet [form](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/HRM/Attendances/StaffTimesheet/components/details/details.component.ts:85>) checks finite/nonnegative hours only. Backend `SiGma.ViewModels/ViewModels/StaffTimesheet/StaffTimesheetAddVm.cs:15` and Update allow decimal.MaxValue. `SiGma.Business/Services/StaffServices/StaffTimesheetService.cs:37–48` checks required dates but has no capacity/scale validation. `SiGma.DataAccess/Configuration/StaffTimesheetConfig.cs:7` supplies no override.
- Deduction editor `Deductions/Deduction/components/details/details.component.ts:72` and HTML:50 accept arbitrary fractional values; workbook parser `components/import/import.component.ts:121` likewise accepts arbitrary decimal scale. Backend `SiGma.ViewModels/ViewModels/Deduction/DeductionAddVm.cs:10`/Update and `DeductionService.ImportAsync:61–75` bound principal but do not validate scale. DeductionConfig supplies no precision override.
- Common source storage is decimal(18,2): `SiGma.DataAccess/SiGmaDbContext.cs:33–38`, `SiGma.Helpers/Helpers/FinancialNumberPolicy.cs:5–6`.

Trigger examples: Timesheet `10000000000000000` passes validation but exceeds storage; Timesheet `0.001` and deduction `100.005` pass their boundaries despite unsupported fractional scale. Under the configured schema, persistence must reject or convert these values. This can turn a valid-looking Save into a persistence failure or a changed numeric round trip.

**Recommendation:** enforce capacity before mutation on every single/bulk/import writer; freeze the hours precision policy and the principal reject-versus-authoritative-rounding policy, then align UI/import feedback. Reuse FinancialNumberPolicy where applicable. Do not invent a 24-hour cap, silently round hours, or change payroll arithmetic as part of a validator fix. Principal money and manually owned hours are distinct domain contracts. This is a newly verified boundary mismatch, not a claim that the current database was inspected.

### F02 — P2: the unchecked Leave filter excludes pending-rejoining records

**Confirmed, high confidence; newly verified.** `Leaves/Leave/components/list/list.component.ts:156–157` always sends `pendingRejoining: false` by default/Reset. `shared/utils/list-query.ts:66` intentionally preserves false. `SigmaBackend/SiGma.Business/Services/LeaveService.cs:39` delegates this property to generic equality (`Services/Bases/Service.cs:667`, applied before the feature hook). Thus default search and its Excel snapshot exclude every `PendingRejoining=true` record; checking the box shows only true records, so neither state displays both.

The positive-restriction intent is evidenced by `UserGuide/content/hrm-leaves-topics.ts:29` (Pending Rejoining further restricts results), checkbox `list.component.html:30–32`, and `LEAVES_FRONTEND_BACKEND_CONTRACT_FREEZE.md:23` selected-status semantics.

**Recommendation:** this feature should serialize unchecked as null/omitted (`raw.pendingRejoining ? true : null`), using the same applied snapshot for list/export/dashboard navigation. Keep shared false serialization intact for genuine negative/tri-state filters. Verify default, checked, Reset and dashboard handoff with a true row.

### F03 — P2: a Shift-only Duty edit can remove Attendance clock precision

**Confirmed cross-writer contract conflict, high confidence.** Direct related dependency outside the requested folder: `src/app/modules/Staff/StaffDutySchedule` reads/writes the same Attendance entity as HRM Attendance.

- Attendance editor preserves the original seconds/fractions when the displayed clock is unchanged: `HRM/Attendances/Attendance/components/details/details.component.ts:183` passes the original API value to `parseTimeValue`.
- Backend Duty output always formats clocks as HH:mm: `SiGma.Business/Services/StaffServices/StaffService.cs:1684` (`FormatDutyTime`).
- Duty Shift change marks the day changed (`Staff/StaffDutySchedule/components/list/list.component.ts:176–178`, changedRows:107–109); Save:199–210 resends all four truncated clocks, even for a Shift-only change.
- Backend Duty Save:1635–1638 assigns every clock from that payload.

Example: Attendance `08:00:45` becomes Duty `08:00`; changing only Shift then saving replaces it with `08:00:00`. This loses saved precision without a clock edit.

**Recommendation:** freeze a common preservation contract and retain original unchanged clock values during metadata-only writes, preferably through the owning backend write semantics or a compatible per-field change contract. Minute entry may remain minute entry; it must not implicitly truncate unrelated saved facts. Overnight interpretation is a separate unresolved policy.

### F04 — P2: Staff Roles route exit bypasses the editor's discard protection

**Confirmed, high confidence; newly verified.** `Administration/Staff Roles/StaffRole/staffrole.routes.ts:5–8` mounts the list without CanDeactivate; `pages/routing.ts:1611–1615` adds no parent exit guard. StaffRolesComponent has no child guard delegation. The child at `components/details/details.component.ts:153–173` protects Close/Cancel/Escape only.

Trigger: edit a role and use browser Back or another application route. The draft disappears without the existing discard decision. Leaving during Save also removes observation while the backend operation may finish.

**Recommendation:** use the existing Department list-to-editor guard delegation (`department.routes.ts:5`, Department list `canDeactivate():196`) and protect in-flight mutations. This is an SPA navigation issue; hard reload/tab-close protection is a separate enhancement. No permission or business API change is required.

### F05 — P2: Final Settlement cannot reveal its first invalid policy field

**Confirmed source wiring issue; visual acceptance pending.** All required policy controls are inside an initially closed native `<details>` (`Payroll/FinalSettlementProcess/components/process/final-settlement-process.component.html:53–67`). Validation at TS:172–183 marks controls touched, sets `activeTab`, and calls focusField. The current template renders no tabs and never consumes activeTab. The shared `focus-field.ts` scrolls/focuses existing elements but does not open a closed details ancestor.

Trigger: select an employee/last day and click Process before filling the policy section, or close that section after entering an invalid value. The operation returns a generic invalid-input error while the actual field remains concealed and cannot receive useful focus.

**Recommendation:** bind policy disclosure state and open it before deferred invalid-field focus, or restore the governed editor composition. Remove obsolete tab-state machinery after the final shape is decided. Keep every policy input explicit/required; do not replace missing inputs with zeros. Relevant UI19/27 and the existing frozen settlement contract apply.

### F06 — P2: Final Settlement screen/export omits parts needed to explain the total

**Confirmed presentation/output discrepancy; no server formula defect asserted.** TS:92–97/167 exports only `code,name,basic,allowances,gross,overtime,deductions,netPay`. It omits **Additional** entirely, including the separated leave/ticket/gratuity payouts carried by that stored line. The screen normal-salary card HTML:77–83 also omits normal non-commission Additional, even though that amount contributes to NormalSalary. The snapshot's monthlyBasic/monthlyGross/leaveDailyRate/gratuityDailyRate/salaryDays/salaryDivisor are not disclosed in this screen; these exist in the model/API and the PaySlip detail does disclose the rates.

Evidence: frozen `PAYROLL_FINAL_SETTLEMENT_PAY_SLIPS_CONTRACT_FREEZE.md`, reproducibility and monetary reconciliation amendments; backend `PayrollRunService.CalculateFinalSettlement` and `FinalSettlementSnapshot`; current TS/HTML above. The contract explicitly retains Additional and separately records payout amounts so the equation remains auditable.

Example: an employee with non-commission additional earnings or ticket/gratuity has a NetPay that the exported visible terms cannot reproduce. Correct stored total alone is insufficient to review the components before saving/approving.

**Recommendation:** show the normal Additional component and authoritative salary/day-rate context; export a typed settlement breakdown from the displayed saved revision with identity, policy, normalSalary, leaveSalary, ticketPayable, gratuity and totalPayable. Retain the gross/basic/allowance subtotal relationship without adding subtotals twice. Avoid recalculation in the UI. The management-list export can remain a concise list; distinguish it from the detailed settlement export.

### F07 — P2: Driver Time Sheet detail and summary can represent different read moments

**Confirmed concurrency window; occurrence is runtime-unverified.** `SiGma.Business/Services/DriverTimeSheetReportService.cs:97–112` materializes rows, then :117–131 runs a separate summary query over the mutable source, with no shared snapshot/read transaction in this method. A save between the two queries can make detail Excel and summary Excel disagree in row counts/hours, although they arrive in one response and are presented as the same applied report.

**Recommendation:** define one consistent backend read snapshot for both queries, or derive the summary from the same already-materialized facts with the required identity grouping. Preserve complete result scope and authoritative backend aggregation. Verify through controlled concurrent write/read checks when authorized. Do not infer that transaction consistency exists merely because both queries reuse the same IQueryable.

### F08 — P2: Department list retains unbounded/invalid server paging

**Known prior finding, still present.** `SiGma.Business/Services/DepartmentService.cs:27–28` accepts PageNo/PageSize directly; :43–44 uses Skip/Take without canonical normalization; :48 divides by supplied pageSize. Request `ListSmBase.cs:7–8` has no corresponding range attributes.

Trigger: direct API PageNo=0/negative, PageSize=0/negative or an excessively large size can fail the read or bypass bounded paging. Current UI controls do not replace backend validation.

**Recommendation:** refactor the existing owner to canonical list filtering/projection hooks and inherited paging normalization/count. Preserve current consumers while adding real totalCount. Department's existing unknown-count UI pager works with totalPages; absence of totalCount alone is **not** claimed as a broken pager. Prior evidence: `DEPARTMENTS_FEATURE_REVIEW.md:128`.

### F09 — P2: monthly Duty writer still accepts a duration where a clock is required

**Known F05, still present.** `SiGma.Business/Services/StaffServices/StaffService.cs:1715–1736` falls back to unrestricted TimeSpan.TryParse and accepts its result without `0 <= time < 24h`; Save:1635–1638 assigns it to Attendance clocks. Ordinary Attendance validation `AttendanceService.cs:238` enforces the clock-day bound.

Trigger: direct Duty API payload such as `1.01:00:00` or a negative duration bypasses the frontend clock grammar and reaches an incompatible persistence/business boundary.

**Recommendation:** reuse one clock-day parser/validator across both writers and return a localized failure before mutation. This does not decide whether overnight Out<In is valid, which remains a separate business contract. Existing frontend prevention does not secure the API.

### F10 — P3: final supported month overflows active monthly APIs

**Confirmed source edge, high confidence.** Shared month controls support 0001–9999. Duty read/save and Staff OT read/save compute AddMonths(1) for `9999-12` at `StaffServices/StaffService.cs:1403,1529,1795,1956`; legacy Attendance duty read does the same (`AttendanceService.cs:39`). These overflow before a normal typed failure. Ordinary Timesheet already handles this edge safely (`StaffTimesheetService.cs:21`).

**Recommendation:** preserve the supported range with safe last-month boundaries. Do not introduce an arbitrary business cutoff; monthly Payroll's explicit max9998 remains its separate frozen contract.

### F11 — P3: Process Overtime lacks its Arabic translation

**Confirmed.** `Overtimes/Overtime/components/list/list.component.html:6` uses `sideMenu.overtimes.processOvertime`; English `vocabs/en.ts:1568` exists and Arabic has no matching key. Static AST leaf-key comparison found **749 used literal translation keys, one missing Arabic match**. Dynamic prefixes/enums are not certified by that count and were reviewed separately.

**Recommendation:** add the equivalent Arabic key in a later authorized fix. This is an instance of known UI backlog30 item10, not a new shared translation-system defect.

## Known risks, conformance debt and business evolution — kept separate from new defects

| Item | Current evidence | Recommendation / decision boundary |
|---|---|---|
| Authorization — high-priority known/deferred risk | AuthGuard and PayrollRunsController use authentication; no action roles/claims policy. UI26/30 item20 and deferred authorization plan are explicit | Extend the existing shared authorization plan; enforce backend permissions for approval, sensitive HR/pay reads, deletion, settings and account mapping. Hiding buttons is insufficient. No permission endpoint invented in this review |
| Leave balance engine | OpeningBalance stores starting facts; existing counters/quota/approval configuration do not form a dated accrual/usage ledger | PLAN00 for entitlement, calendar, accrual, carry, expiry, reservation, cancellation/rejoining and reversal. Extend current Leave/OpeningBalance owners; never build a parallel balance calculator |
| Deduction lifecycle | PaidInstallments and PassOver are explicitly editable baseline inputs; PassOver stays set until changed | Freeze payment allocations/period-specific skipping and locks before coupling them to actual payroll disbursement. Saving a payroll snapshot is not payment |
| Holiday duplicates | SettingsHolidayModelConfig:10 has nonunique Date index; service has no duplicate guard. Already in HRM_AUDIT_LEAVE_ATTENDANCE_NOTES | Confirm calendar key; then tenant/date uniqueness + compatible guard, duplicate preflight and owner-run migration. Multiple calendars need an explicit design decision |
| Shift name races | ShiftService:50/66 check then save; ShiftConfig:7 has no unique index. Frozen Attendance family explicitly accepts application-only uniqueness | Keep this as accepted current risk; future reviewed tenant/live unique key and guarded writer, with owner data preflight/migration |
| Legacy OT duplicates | Staff monthly paths choose greatest Id while process rejects duplicate source days; new uniqueness source and owner verification recorded previously | Inventory and freeze a consistent conflict/read policy; no automatic merge/delete or newest-row assumption introduced |
| Department DTO/validation debt | Backend heavy read bases; Create name250 versus Update50; literal English failures, known prior review/backlog | Lean read projections, one compatible name limit and localized Result failures during its own authorized slice |
| Final Settlement visual conformance | Native policy disclosure/custom FormSection cards and deep local SCSS override shared card internals; summary uses defaults `??0` before a calculated snapshot exists | Current source differs from the historical no-feature-CSS/EditorTabs/SummaryCards claim. Preserve owner-requested functional grouping, migrate generic totals to shared SummaryCards, remove obsolete state and show not-processed/— before authoritative values. Check narrow-height access to expanded policy region; source-only does not prove clipping |
| Domain policy gaps | Overnight pairing, date-vs-timesheet-month relationship, maximum daily hours, manual Timesheet duplication, sequential approver identity and payroll locks are not all frozen | Decide individually with the owning business contract. Do not label signed Shift integer values or independently editable Timesheet hours as defects merely because another policy would be possible |
| Payroll and integrations | Calculation/version/approval exists; unsupported previous-month commissions/business-unit processing blocks calculation; settings and ledger mappings do not implement posting/payment | Extend PayrollRun/Revision/Line/Log for a separately frozen disbursement/settlement lifecycle; preserve immutable snapshots, approval reset and audit. Decide attendance/absence/proration policies before removing their blockers |
| Test coverage debt | All12 HRM specs contain one `should create` case; no behavior cases in those files. Payroll/Reports have no scoped specs | Replace smoke-only coverage with focused tests for filter boolean semantics, numeric bounds, original-time preservation, stale responses, guard decisions, version/replay/approval and complete export failures. Tests were inspected, not executed; backend tests outside the requested scope were not globally audited |
| Report scale/performance | Reports intentionally return complete arrays; PaySlip StaffAsync materializes historical saved lines before grouping staff | Measure large-tenant costs after runtime authorization; keep full output correctness while moving suitable grouping/projection to SQL or defining a separate bounded export contract. Do not turn a complete report into first-page-only output |

## Current column/read contracts and coverage

Each normal list uses the shared first Actions column where row actions exist. The lists below put visible fields beside backend read fields; PascalCase is serialized to the corresponding camelCase frontend property. Generic inherited plumbing is noted rather than treated as consumed content. No ListVM field was removed in this task.

| Owner | Ordered business grid fields / type where material | Backend properties and minimum identity/action state | Current status |
|---|---|---|---|
| Department | name, description | Name, Description, Id; inherited unused plumbing | Display match; paging/lean-model debt F08 |
| StaffRole | name, description | Name, Description, Id; inherited unused plumbing | Display match; exit F04 |
| LeaveOpeningBalance | staffName, leaveTypeName, effectiveDate(date), openingDays(number), notes | StaffName, LeaveTypeName, EffectiveDate, OpeningDays, Notes, Id | Matched; version belongs to Detail/Update |
| Holiday | name, date(date) | Name, Date, Id | Matched; uniqueness risk |
| Leave | no, staffName, leaveTypeName, fromDate(date), toDate(date), noOfLeaves(number), leaveStatus(status) | No, StaffName, LeaveTypeName, FromDate, ToDate, NoOfLeaves, LeaveStatus, Id, RowVersion; PendingRejoining filter context | Display/action match; F02 filter |
| LeaveType | name, category, quotaType, accrualPeriod, quotaRule, leaveStartFrom, noOfLeaves | Name, Category, QuotaType, AccrualPeriod, QuotaRule, LeaveStartFrom, NoOfLeaves, Id | Matched; config/approvers not a quota engine |
| Deduction | no, startDate(date), type, staffName, totalAmount(money), numberOfDeductions(number), paidInstallments(number), status | Same named properties + Id | Matched; numeric write F01 |
| Shift | name, dutyHours(number), createdAt(date), combined startTime/endTime | Name, DutyHours, CreatedAt, StartTime, EndTime, Id | Matched |
| Attendance | staffName, code, designation, shiftName, date(date), checkIn, checkOut, checkIn2, checkOut2 | Same + Id | Matched; IsAbsent is editor-only in current grid, despite historical artifact wording |
| StaffTimesheet | staffName, code, designation, shiftName, date(date), workingHours(number), overtimeHours(number), month(date) | Same + Id | Matched; numeric write F01 |
| OT daily | staff, month(date), code, designation, normalOTHours(number), holidayOTHours(number), totalOTHours(number), overtimeRate(money), overtimeAmount(money) | Same + Id; Staff nested Id/Name | Matched; derived amounts server-owned |
| OT process runs | from(date), to(date), status, approvedBy, recordCount(number), staffCount(number), totalHours(number), totalAmount(money) | Same + Id | Matched; ApprovedBy intentionally empty, no posting |
| Payrolls | date(date), type, staffName combining staffCode, amount(money), isApproved(status) | Date, Type, StaffName, StaffCode, Amount, IsApproved + Id, IsPaid, RevisionNumber, Version | Matched; current-revision flags guard actions |
| Payroll/LeaveSalary calculation | code, name, basic/allowances/gross/overtime/additional/deductions/netPay(money); conditional netPayDifference(money), issues custom notes | PayrollLineVm corresponding values, StaffId, Issues; parent version/period/type/staff/flags/totals/history | Matched; read-only authoritative server amounts |
| FinalSettlement | code, name, basic, allowances, gross, overtime, deductions, netPay | PayrollLineVm also carries Additional; FinalSettlementSnapshot carries payout/policy/rate context | F06 disclosure/output gap |
| PaySlips | no, name, code, date(date), type, totalAmount(money), isApproved(status) | No, Name, Code, Date, Type, TotalAmount, IsApproved + Id, RunId, RevisionNumber, StaffId, IsPaid, IsCurrentRevision | Matched; read-only saved lines |
| PayrollsReport | periodStart(date), periodEnd(date), staffCode, staffName, designation, overtimeSubtotal/earningsSubtotal/deductionsSubtotal(money), normalOTHours/holidayOTHours(number), netPay(money) | PayrollsReportRowDto same + Id | Complete array; designation explicitly current, monetary facts saved |
| DriverTimeSheetReport | workDay(date), agreementNo, customerName, driverName, isHoliday(status), workingHours/driverOvertimeHours(number) | DriverTimeSheetReportRowDto same + Id; separate summary DTO identity labels/counts/hours | Complete arrays, current company association documented; F07 read moment |
| Payroll logs | occurredAt(dateTime), operation, revisionNumber/previousRevisionNumber(number), performedBy, previousAmount/amount(money) | PayrollRunLogVm same + Id | Matched; UTC transport/local display |

Remaining component coverage: controlled Create/View/Edit forms for all listed normal entities; Leave rejection dialog/approval and dashboard; ordered LeaveType approver collection; Deduction workbook import; OT CSV process/import; HrmSetting sections/options; HRM account-linking matrix and directly reused auto-link dialog; Payroll revision/log/note dialogs; PaySlip detail/report. Settings/dashboard shapes are not forced into CRUD ListVMs.

## Filter, payload, route and action contracts

| Family | Query contract | Editable inputs / server ownership | Routes/actions / finding |
|---|---|---|---|
| Department/StaffRole | search + pageNo/pageSize | name/description, Update Id; tenant/audit omitted | Guarded Department modal; StaffRole exit F04 |
| Holiday | name,dateFrom,dateTo | name,date | `/Holiday` calls SettingsHolidayModel; CRUD, no payroll action |
| LeaveOpeningBalance | staffId,leaveTypeId | staff/type/date/days/notes; Update Id,RowVersion | `/LeaveOpeningBalance`; confirmed delete/guard; opening facts only |
| Leave/Leave dashboard | staffId,leaveTypeId,dateFrom,dateTo; list rejected,pendingApproval,pendingRejoining | staff/type/reason/dates; Update Id,RowVersion. No client approval/audit/counts | `/Leave` list/create/view/edit + dashboard; approve/reject versioned; F02 |
| LeaveType | six scalar filters | Config + ordered approverStaffIds full snapshot | Guarded modal/deep URL; no user permission inferred from approver list |
| Deduction | dateFrom/dateTo,staffId,type,status; enum zero preserved | Entered schedule principal/start/type/staff/count/paid/passOver/notes; Update Id | `/Deduction`, guarded details/import; F01 |
| Shift/Attendance | Shift dateFrom/dateTo/search; Attendance dateFrom/dateTo/staffId | Shift entered settings; Attendance staff/shift/date/clocks/absence/code/designation | Guarded modal/compatibility modes; Duty direct-writer F03/F09 |
| StaffTimesheet | UI/URL month → API monthFilter, staffId/code/designation | staff/shift/date/month/entered hours/code/designation | Singular `/StaffTimesheet` and plural alias retained; F01 |
| OT | daily/runs fromDate/toDate; process `{month}`, import `{month,rows}` | daily normal/holiday hours and identity; total/rate/amount backend. CSV positive whole minutes | `/Overtime` routed modes/guards/process/import; saved operational runs, no approval/payment/JV |
| HRM settings | Mine/options | Typed existing policy/formula/flag configuration only | GET/PUT HrmSetting/Mine; guarded whole-set Save |
| HRM account linking | HRM matrix/options | eligible key/role/account tuples; explicit null unlink, replaceTypes=[8] | LinkAccounts/hrm read + upsert; auto-link plan/apply reused; guarded configuration |
| Payrolls | dateFrom/dateTo,type,pendingApproval,sortField/date-or-amount,sortOrder | approve `{expectedVersion}` | `/ProcessedPayrolls`; View/Edit/Approve/Log/Export; current unpaid revision/state check |
| Payroll/LeaveSalary/FinalSettlement | Calculate/Save period,type,optional staffId; settlement explicit policy; Save expectedVersion | No totals/status/payment/tenant in write payload | `/ProcessPayroll`, `/ProcessLeaveSalary`, `/FinalSettlementProcess`; guarded exit, exact context/history; calculate read-only, save revisions, no disbursement |
| PaySlips | dateFrom/dateTo,no,type,staffId,sortField,sortOrder | Read-only; detail Id is immutable PayrollLine identity | `/PaySlips`; list current saved revision, detail historical saved row, all-pages Report/Excel |
| Reports | Payroll dateFrom/dateTo/staffId/designationId; Driver dateFrom/dateTo/agreementId/driverType/driverId | Read-only complete response | `/HRM/Reports`, `/HRM/Reports/DriverTimeSheet`; same applied response for print/Excel; F07 |

Payroll action tuple: changed unpaid Save appends immutable revision and clears current approval; Approve binds current unpaid revision/version; paid Save remains locked apart from exact idempotent replay; successful events/logs share the owning save. No payment/cancel/reopen/journal action is fabricated. Leave source now validates overlaps, joining dates, batch ownership, RowVersion and Approved mutation locks; empty-approver new-request auto-approval is a later explicit owner decision. Leave cancellation, rejoining completion and sequential approver authorization are separate unresolved targets.

Authorization candidates to feed the deferred plan: `POST PayrollRuns`, `POST PayrollRuns/{id}/approve`, salary/PaySlip/report reads, Leave approve/reject and sensitive detail reads, generic entity Delete, `PUT HrmSetting/Mine`, LinkAccounts upsert and `POST LinkAccounts/hrm/auto-link/apply`. Exact role policies are Missing by design; tenant scoping and state/version checks are not equivalent to role authorization.

## Verified strengths and historical reconciliation

- HRM features use typed service/model/form contracts; scoped search found no TypeScript `any` contracts, API toISOString calls, direct legacy p-table/ms-lib/ListCol wrappers, or the banned primary color forks. Literal `step="any"` and an English word in comments are not TypeScript-any defects. Deduction import's viewport calc sizes a dialog, not a route page; it is not misreported as a page-height violation.
- Root HttpClient is registered in AppModule with token/error interceptors. Feature services use environment.baseUrl/root provider; the HRM LinkAccounts useExisting adapter changes service identity without forking HttpClient. Inline reads opt out of global error presentation and handle declared/transport failures. Standard mutations retain the global success owner; the HRM auto-link composite has a documented feature feedback path.
- Lists generally use applied filters, real counts, switchMap cancellation, finalize and shared fetchAllPages export; reports use a complete response and invalidate results on filter changes. Existing Department unknown-count compatibility is explicitly recorded.
- Payroll calculate/save rechecks version/source state; server values and immutable revisions/logs are retained; approval follows the exact current revision. Current saved PaySlips do not pretend to prove payment; historical detail remains readable. No manual IsPaid toggle exists in these screens.
- Attendance complete-month conflict preflight, absence preservation, propagation of failed refresh, occupied-key rejection and OT stored-rate validation are source-resolved. Old audit claims to the contrary are stale and were excluded.
- Leave overlap/approve/reject/Approved-lock omissions in older reviews are source-resolved and excluded. OpeningBalance version/FK/unique-write guards exist. Deduction imports validate the full batch before one save.
- OT amount/rate/total are backend-owned; whole-minute recovery and stored amount snapshots are retained. CSV/workbook imports preserve preview validation and do not import a valid subset of a failed batch.
- Current user Timesheet change correctly moves all four filters to the main row, removes obsolete advanced directive/state and updates bilingual guide wording. It is preserved; no findings were fabricated merely because the working tree was dirty.

## Conformance and documentation evidence

| Concern | Book/reference/shared owner | Actual target comparison | Result |
|---|---|---|---|
| List cancellation/grid/frame | UI1/3/4/6/28; Workshop/Job list bindListQueries/typed columns; FilterPanel/DataTable | HRM list trigger streams use switchMap/defer; table fill/paginator/API count contracts compared | Broad source match; Department backend exception F08 |
| Dialog forms/exit | UI10/13/19/27; shared EditorDialog/freezeFormState/focusField | Controlled normal modal View/Save/Close and guards inspected | StaffRole F04; settlement disclosure F05 |
| Financial workspace | UI1/13/14/24; Job editor frame and openingBalances workspace; SummaryCards | Payroll uses server rows and slim SummaryCards; settlement current custom overview compared to frozen rates/totals | Payroll match; settlement F06 and recorded presentation drift |
| Report complete output | UI20/21; StatementOfAccount applied filters/print session and report shell; BE17 | Both HRM reports unpaged backend arrays, local page presentation only; print removes paginator and Excel exports full arrays | Scope match; Driver read consistency F07 |
| API/state ownership | BE3/5/7/8/9/14/18; Branch normal/PurchaseOrder graph/Invoice money mechanics plus frozen payroll custom owner | Typed client inputs, server calculations, aggregate/version/replay guards | Source evidence above; precision F01 and known generic debt |
| Localization/feedback | UI22/23/25/26; root token/error interceptors, StateMessage/FieldError | 749 literal keys compared; dynamic enums separately inspected; no new permission API | F11; RTL/theme/keyboard visual acceptance pending |
| In-app guide | Master7; existing UserGuide reader/module entry | `UserGuide/content/hrm-guide.ts` plus `hrm-leaves-topics.ts`; `/UserGuide/hrm`; sidebar-menu-data.ts:852–854 | Covers payroll, settlement, slips, attendance, shift, timesheet, OT/import, deductions/import, leave/opening/settings/linking. Existing guide retained; F02 contradicts stated filter behavior. Review does not authorize guide edits |

No screenshots were supplied now. Historical screenshot-backed frozen decisions are evidence of earlier intent, not proof of current visual conformance. No layout was accepted visually in this task. No reusable new canonical rule was established; no book/skill instruction edit is authorized/needed. The sigma-screen-refactor digest was consulted for the relevant shared controls and book ownership; governing conclusions use the owning book/current source, not retired guides.

## Recommended execution order and impact map

1. **Protect facts and search correctness:** resolve F01 numeric contracts, F03 original clock preservation, F02 false-filter semantics and F09 API clock bounds. Main owners are existing Timesheet/Deduction/Attendance/Staff services plus their current UI consumers; no parallel service/calculator.
2. **Protect and explain the user's work:** F04 navigation guard, F05 invalid-field reveal, F06 complete authoritative settlement disclosure/export, then F08 paging normalization. Update affected bilingual guide topics after an authorized fix.
3. **Harden read edges and consistency:** F07 report snapshot, F10 final-month bounds, F11 translation; run targeted owner verification and useful regression coverage after explicit authorization.
4. **Plan business evolution independently:** leave ledger/approver/rejoining/cancellation, period deduction/payment allocations and attendance/proration → payroll/disbursement → ledger posting; the existing deferred shared authorization plan also remains a priority. Each requires a PLAN00 impact/alternative/target freeze before changes. Configuration presence does not prove implementation of these workflows.
5. **Consolidate presentation and maintenance:** keep shared shell/control/table owners; migrate reusable summary/card behavior through shared components, remove stale settlement tab code/local overrides, reduce legacy DTO/service overrides only when their direct consumers agree. Audit large-tenant report/query costs with measurements before changing complete-output contracts.

Keep: immutable PayrollRun/Revision/Line/Log, existing report/print/export utilities, typed UI/shared controls. Extend: the existing domain owners for missing approved lifecycle rules. Refactor: validated write boundaries, guards, paging, settlement disclosure/overview. Create only a missing dated leave/payment allocation concept after a frozen plan. Do not replace a domain with a second owner or remove historical data as a convenience.

## Final source reconciliation and verification

| Path / comparison | Result | Remaining action |
|---|---|---|
| Columns ↔ models ↔ DTOs | Current tables above; no schema/model change in this review | Resolve F06, adopt lean Department/StaffRole models in a later slice |
| Filters ↔ serializer ↔ backend keys | Current contracts traced, enum zero retained | F02; F08 invalid server paging |
| Detail/form ↔ writes ↔ server-owned state | Typed current payloads; authoritative payroll/OT values omitted from writes | F01 precision target; F03/F09 clocks |
| Actions ↔ state/version ↔ refresh/error | Existing guarded payroll/leave mutations and refresh verified in source | Role authorization deferred; StaffRole exit F04 |
| Routes/providers/interceptors | Current lazy routes/root-client path inspected; compatibility aliases preserved | Guard F04; runtime verification pending |
| Reports ↔ complete output | Unpaged response rows printed/exported completely; no first-page report claim | F07 same-moment summary |
| Translations | Static AST comparison of749 literal leaf keys | F11; live EN/AR acceptance pending |
| Guide ↔ behavior | Existing bilingual reader/topics/menu retained | F02 and settlement clarification follow-up after fixes |
| Scoped Git diff | Actual frontend/backend roots confirmed; complete current frontend HRM+guide diff reviewed; backend clean | Existing3 frontend modified files preserved; frontend diff --check passed |
| Merge/source hygiene | Scoped merge-marker search clean; no application edit by root/agents | Angular/.NET compilation and runtime not certified |

**Files changed by this review:** only `F:/My Work/Sigma/reviews/HRM_FRONTEND_COMPREHENSIVE_FEATURE_REVIEW.md`. Application/frontend/backend/contracts/AutoMapper/calculation code and instruction files unchanged. No ListVM removal, mapping change, formula change, schema change or migration is introduced. No new Add-Migration command is required by this review. Future approved precision/schema/unique-key changes must report their own migration and existing-data preflight; no generated migration/snapshot was opened for mutation.

Phases00–06 were used as read-only review boundaries, with applicable existing contract evidence; implementation and runtime portions skipped because not requested. Recipe -Check passed all8; no generated packet refresh required. Suggested review record message, only if the owner later versions these local artifacts: `docs(hrm): record comprehensive source review`. No application commit is proposed for nonexistent application edits.

**Owner verification checklist (not executed):**

- Compile the actual frontend/backend and validate deployed schema precision and existing owner migrations after authorization.
- Exercise true/false/omitted Leave rejoining filters including Reset/dashboard/export.
- Check Timesheet capacity/fractions and Deduction workbook/editor scale, returned values and round trip.
- Save a Duty Shift-only edit against Attendance clocks containing seconds/fractions; ensure every unchanged clock survives.
- Navigate away from a dirty/busy StaffRole modal; confirm correct keep/discard behavior.
- Process an incomplete settlement with the policy region closed; verify automatic reveal/focus. Inspect Additional/rates/days and export reconciliation for nonzero leave/ticket/gratuity/other additions.
- Query invalid Department page/size, final supported month and concurrent Driver report writes with controlled data.
- Verify all-pages export failure behavior, approval/recalculation race and no-op replay, EN/AR, RTL/dark/theme/narrow-height scroll/keyboard/print in the actual application.

Agent utilization: inherited-model read-only explorers, disjoint Attendance/Overtime and Leaves/Administration/Holidays/Deductions investigation; root Payroll/Reports/integration and final reconciliation. No model override, source ownership overlap or agent source edit. Delegation was required by the project AGENTS for independent bounded workstreams and reduced source-investigation wall time.

**Prohibited commands not run:** builds, tests, lint, migrations, database operations, browser/application verification, commits/push/deploy, Graphify, Sigma MCP. Static source/AST inspection and read-only Git/recipe checks are the verification performed. Build/runtime/database/visual acceptance remains owner-pending.
