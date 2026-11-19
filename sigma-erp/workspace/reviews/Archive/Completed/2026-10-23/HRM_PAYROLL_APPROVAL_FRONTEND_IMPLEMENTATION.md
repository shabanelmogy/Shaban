# HRM Payrolls management and approval frontend

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Date: 2026-10-09. Bounded implementation owner: Payrolls Angular subtree. Shared routes, menu, translations, compilation entries and user guide are integrated by the root agent. Frozen authority: `HRM_PAYROLL_CONTRACT_FREEZE.md`, including Approval and Operation log continuation sections. Recipe `-Check` passed all eight packets in this task before PHASE-02 and PHASE-04 were read.

## Shape and conformance before implementation

UI screen 02: paged list with routed financial collection editor because payroll has aggregate totals and approval. Workshop Job list owns the list shell, filter panel, table and request integration. Payroll Process owns the payroll workspace and shared operation-log dialog. Backend is a stateful payroll snapshot/revision aggregate; ordinary generic CRUD would violate its calculation and immutable-history contract.

| Concern | Book block | Exact approved reference | Shared owner | Target match or governing exception |
|---|---|---|---|---|
| Host/title/grid bounds | UI1/3/6 | `Workshop/Job/components/list/list.component.{ts,html}` `JobsComponent` | `sigma-route-host`, `sigma-list-page/panel/header/table`, FeatureTitle, DataTable | Same container-fill classes and `fill=true`; no feature SCSS |
| Filters | UI4/17/19 | Job `filterForm`, `dateRange`, `search/resetFilters` and template | FilterPanel, DatePickerDirective, dateRangeValidator, FieldError | Three fields; stableLayout; one dual-month range defaults current month; mandatory Reset |
| Paging/read cancellation | UI2/6/22/28 | Job `bindListQueries/requestList/onLazyLoad` | ListQuery, toListParams, resolveListPaging, LoadingService | switchMap/defer, counted server pages, finalize; use API-clamped page and size |
| Grid/model | UI5/6; BE7 | Job `initColumns` and shared `DataTableColumn/DataTableStatus` | DataTable | Date/Type/Amount/Status; id/version/revision/paid retained solely for identity and actions |
| Approval | UI7/9/22/28 | ConfirmationDialogService.confirm; Job action refresh mechanics | shared confirmation and ActionList | Approval state defined by frozen payroll contract; confirmation pending and identity/version recheck before POST |
| Excel | UI8 | Job `exportExcel`; `dataTableExportRows` | fetchAllPages and shared exporter | All matching list pages; saved run GET supplies complete snapshot rows for per-run export |
| Routed handoff | UI10/13/15 | Job `openEditor/returnQueryParams` | readListRoute/writeListRoute | Existing `/ProcessPayroll?runId&mode` contract; preserve applied query and returnTo |
| Log | UI13/22/28 | shared EditorDialog/DataTable (owned by PayrollProcess agent) | PayrollRunLogsComponent | Read-only chronological persisted event dialog; list passes run id and month identity |

## Frozen decisions

Grid business columns: Date, Type, Amount, Status. `PayrollRunListRow` properties: `id,date,type,amount,isApproved,isPaid,revisionNumber,version`. Date is server period-end minus one day; amount is stored current revision totalNet. Status presentation: Paid, otherwise Approved, otherwise Pending Approval; no local financial calculation. Type supports only Payroll. Date and Amount are sortable backend-supported fields; the mixed approval/payment status is not misleadingly sorted by one flag.

Filters: `dateRange` normalizes through shared parseDateRange to `Filters[dateFrom/dateTo]`; `type` sends Payroll; unchecked pendingApproval sends no filter, checked sends true. Search resets page 1; Reset restores current month/Payroll/unchecked. Paging and export use the applied filter snapshot, not unsaved field edits.

View uses runId plus mode=view. Unpaid Edit uses mode=edit and the same Process workspace. Approve is visible for unpaid, unapproved current rows and posts only expectedVersion; the backend validates tenant/root/current revision and exact version. Paid rows expose no Edit or Approve. Log and Excel have no state mutation. Cancellation, unapproval, disbursement, ledger effects and future payroll types remain outside this contract.

## Implemented files and runtime handoff

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

| Owned file below `src/app/modules/HRM/Payroll/Payrolls/` | Result |
|---|---|
| `models/list.ts` | Typed minimal ListVM, Payroll literal type, filters/query and expectedVersion-only approval request |
| `services/payrolls.service.ts` | Typed list, complete-pages export, saved-run read, approve; existing BaseService/HTTP chain and inline error owner |
| `components/list/list.component.ts` | Canonical list, applied route state, sort whitelist, latest-query cancellation, counted paging, identity/version gates, confirmation, exports and shared log |
| `components/list/list.component.html` | Shared shell/title/filter/grid, dual Calendar, translated Dropdown, pending checkbox, error/Retry, typed menu, no local styling |
| `payrolls.routes.ts` | Exported `Payrolls_Routes` with single list entry; existing Process route supplies View/Edit |

Root integration: lazy `/ProcessedPayrolls` route imports `Payrolls_Routes`; menu belongs under the existing Payroll group; the existing Payroll Process workspace and root-owned user guide serve the new list. The component imports its model/service and shared operation-log component, so those dependency files do not require a new broad `include`. Any actual missing-component compilation diagnostic uses the existing explicit `tsconfig.app.json.files` boundary under UI1/29; compilation itself was not run.

Payroll Process peer supplied `PayrollRunLogsComponent` at `HRM/Payroll/PayrollProcess/components/logs/payroll-run-logs.component.ts`, selector `app-payroll-run-logs`, inputs visible/runId/period, output closed. Process Back strips runId/mode/returnTo and retains the applied date/type/pending/page/sort state passed by this list.

## Final conformance evidence

The target matches the pre-implementation table: metadata registers every used shared control/pipe/directive; shared FilterActionsDirective is imported from its actual directives owner; PrimaryActionButton uses public disabled/loading inputs; FieldError reserves date feedback; typed translated options use a mutable array. The row region has one `app-data-table` with fill/lazy/paginator enabled, API totalCount, controlled first/rows, translated currentPageReport and emptyMessage. There is no feature SCSS, viewport arithmetic, legacy wrapper, direct p-table or duplicate paginator.

`bindListQueries` uses switchMap/defer/takeUntilDestroyed/finalize, handles both unsuccessful Results and HTTP failures, clears failed rows/count, and keeps the trigger stream alive for Retry. `onLazyLoad` resolves paging against the prior state before writing signals, permits a newer read to cancel an older read, skips identical state, and permits only date/amount sort values. Successful response page/pageSize reflect backend clamping and are written to the route. Search, action refresh and export retain the applied snapshot independently of draft fields.

`freezeFormState` freezes actual reactive controls during approval confirmation/mutation, export and operation-log dialog. One restoration callback survives confirmation-to-mutation handoff, retains originally disabled state, and is released only when no action is pending on the still-live list. Invalid Search marks fields and calls shared focusField for the range input without opening its overlay. No frontend permission mechanism is invented.

| Action | Presentation and server contract | Pending/concurrency and recovery |
|---|---|---|
| View | Every saved row → `/ProcessPayroll?runId=<id>&mode=view` | Re-resolves id/version/revision; busy navigation blocked; applied route state retained |
| Edit/Recalculate | Unpaid row → same Process route, mode=edit | Current paid flag rechecked; backend Save owns calculation/revision and payment lock |
| Approve | Unpaid/unapproved current row → shared confirmation → `POST PayrollRuns/{id}/approve {expectedVersion}` | Freeze controls; duplicate decision/request guards; re-resolve exact id/version/revision/unpaid/unapproved before dispatch; backend version guards external races. Release mutation state in finalize, then refresh applied page. Declared/HTTP failure stays inline with Retry reload before a new attempt |
| Log | Every saved row → shared read-only log dialog | Freeze filters while open; dialog owns cancellation/loading/error/Retry; close restores list controls |
| Row Excel | `GET PayrollRuns/{id}` saved current snapshot | Requires same id/version/revision as clicked row; exports all snapshot staff rows; stale state creates no file and prompts reload |
| List Excel | `fetchAllPages` over applied ListQuery with pageSize100 | All pages required; a failed page creates no partial file; translated grid headers/statuses and shared formatting resolved at click time |

The Job reference action inventory is reconciled: View and Edit have payroll counterparts; Labour Time, Invoice Customer, Close Job, Gate Pass and Delete are Not Applicable because the frozen payroll aggregate exposes no job labour/invoice/gate-pass/close/delete workflow. Payroll-specific Approve and persisted operation log come from the frozen domain contract. No unavailable placeholder actions are added.

Approval uses the list's inline failure owner (`X-Skip-Error-Interceptor`); the standard global mutation interceptor remains the single success-toast owner. No manual success/error toast is added. A stale action error or export error preserves the rendered list and applied filters; Retry safely reloads the list rather than replaying a mutation.

## Screenshot evidence and decisions

| Evidence class | Implemented scope |
|---|---|
| Explicit, as recorded by the root contract | Date Range, Payroll Type, Pending Approval, Search, Date/Type/Amount/Status, View/Edit/Approve/Excel and server paging |
| Reviewer decision under frozen contract | Status combines paid/approved/pending flags; only supported Payroll type appears; no unsupported future types; list Date is period-end-minus-one-day; current stored revision amount is authoritative |
| Source-supported navigation addition | Header Process Payroll opens the existing owning workspace with returnTo and the applied query; no new editor or payroll writer |
| Explicit owner continuation | New changed Save supersedes historical revision and requires fresh approval; immutable saved-event log is available from list and workspace |
| Outside current scope | Cancel/unapprove/post/pay/manual Paid toggle, ledger and disbursement, settlement persistence, leave/final-settlement types |

## EN/AR keys and verification

Root owns `src/app/modules/i18n/vocabs/{en,ar}.ts`. Both direct `locale.data.payrolls` namespaces now contain the same 29 leaf keys, and every new Payrolls consumer key resolves in both languages:

| Namespace | Keys |
|---|---|
| payrolls | title, subtitle, showingEntries, empty |
| payrolls.filters | dateRange, type, pendingApproval |
| payrolls.types | payroll |
| payrolls.columns | date, type, amount, status |
| payrolls.statuses | pendingApproval, approved, paid |
| payrolls.actions | view, edit, approve, log, exportRun, processPayroll |
| payrolls.approval | title, message, record |
| payrolls.errors | load, export, exportRun, approve, staleRow |

The saved-run export deliberately uses the owning Payroll Process column keys (`code,name,basic,allowances,gross,overtime,additional,deductions,netPay`) so it retains the same financial labels and grid formatting. The approval record uses `payrollProcess.revision` with `revision` parameter. Shared Search/Excel/Retry/Cancel/date-error keys remain existing owners. CurrentPageReport uses only PrimeNG `{first}/{last}/{totalRecords}` placeholders.

`Check-Translations.ps1 -Block payrolls` reports no missing/case-only keys, but reports four keys because the existing nested sideMenu payrolls block shares the basename. A direct TypeScript AST comparison of **locale.data.payrolls** independently confirms all 29 leaf keys in each vocabulary and zero unresolved Payrolls consumer keys; the narrow script count is not used as full-namespace coverage evidence.

Verification performed: complete scoped new-file diff reviewed in the actual frontend repository using read-only no-index Git diffs; Git whitespace checks produced no whitespace findings (only informational LF/CRLF warnings); merge-marker/legacy-wrapper/newer-lib/unsafe-date/silent-handler scan clean; TypeScript source and Angular template parsing have no syntax diagnostics; exact shared exports/registration/input names and sibling log interface inspected. Project lib remains ES2018/dom and no incompatible application APIs are introduced. These checks do not certify compilation or runtime.

Phases applied: root-frozen Phase1 consumed; Phase2 list/filter/paging/export; Phase4 guarded approval; Phase5 route/log dependencies handed to root; bounded Phase6 source review. Root owns shared integration, screen user guide and final reconciliation. No backend/entity/AutoMapper/domain calculation changes or migrations are made by this workstream. Authorization candidate: Approve (`POST PayrollRuns/{id}/approve`); UI state visibility is not security, and the existing authentication-only/deferred authorization boundary remains recorded.

Owner verification: compile the Angular app; filter/reset including malformed and reversed ranges; page-size-only change and delayed overlapping pages; verify Pending Approval count/page clamping after approve; cancel/double-click/stale-version approval; verify one success toast and both failure channels; export more than100 matching runs and a saved snapshot; open current View/Edit and return with filters/page/sort; confirm paid edit/approval locks and Superseded historical approval display; inspect Created/Recalculated/Approved log history; switch EN/AR, light/dark, narrow layout and keyboard focus; verify no page scroll. Root user-guide handoff must cover these workflows.

Suggested frontend commit message: `feat(hrm): add saved payroll list and guarded revision approval` (suggestion only). Agent role: bounded Payrolls implementation worker, inherited model, isolated files parallel to Process workspace and root backend/integration to reduce wall-clock time without overlapping edits. No further agents spawned by this worker. User/peer edits preserved. No build, tests, lint, runtime/application/browser verification, database commands, migrations, commits, pushes or deployment were run.
