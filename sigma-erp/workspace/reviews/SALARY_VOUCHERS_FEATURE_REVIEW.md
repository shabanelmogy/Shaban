| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Salary vouchers and HRM relationship review — 2026-10-25

## Outcome and manifest

The primary Salary Vouchers entry now reuses the actual HRM PayrollsComponent and saved PayrollRun revisions. Its row actions reach the existing calculation, approval, log, full export and dedicated payment/history owners. Manual SalaryVoucher records remain separately reachable with repaired list/editor/API contracts; they are not promoted into employee payroll, payment or accounting records.

| Item | Decision / evidence |
|---|---|
| Authorization | Owner requested review and changes, explicitly included existing HRM, delegated the suitable choice, then said continue. No financial-policy invention. |
| Tier and plan | Tier L integration; SALARY_VOUCHERS_MAINTENANCE_EVOLUTION_PLAN.md Frozen before implementation. |
| Contract | SALARY_VOUCHERS_DOMAIN_API_CONTRACT_FREEZE.md Frozen; implementation refinements append rather than erase history. |
| Shapes | Primary existing stateful HRM calculation/revision workspace (BE14 specialization) with BE15 disbursement owner. Legacy BE13 normal entity with routed UI13 voucher-total/editor compatibility; no fake detail rows or journal. |
| Approved references | Workshop/Job/components/list and editor for composition; BranchService for normal service hooks; shared DataTable, FilterPanel, FormSection, FieldError, EditorDialog, EditableCollectionTable, ConfirmationDialogService and date/form-state helpers. |
| Existing changes | Both repositories had unrelated changes (Payments/JVs/purchasing/resources/guides/i18n/tsconfig and owner migration/snapshot). Preserved. Shared file patches add only this feature's content. Other chats' concurrent additions remain. |
| Providers / access | Existing parent authenticated route, root HttpClient/interceptors and root services. No authorization mechanism is invented; visibility is not security. |
| Packets | Initial and final Generate-SigmaRecipes.ps1 -Check: all eight packets OK. PLAN-00 and phases00–06 used conditionally. No packet drift; no generator/book/template changes needed. |
| Exclusions | No automatic linkage/backfill of manual references; no new payroll calculation, journal writer, approval/rejection policy, permission service, payment schema or report-print workflow. |

## Screenshot evidence

Evidence S1: C:/Users/user/Desktop/123321.png. Existing external Salary Vouchers list, English, LTR; capture shows an empty result, so no row-specific transition is proved. Its date range is sample filter content, not a required permanent default. No embedded document instructions were treated as user authorization.

| Evidence | Classification | Contract / implementation |
|---|---|---|
| Salary Vouchers title | Explicit | Shared feature title in primary panel. |
| Date Range, Salary Voucher No, Voucher Type | Explicit | Server-supported number/range/type filters; same content available in primary HRM and distinct legacy contexts. |
| Payroll, Leave Salary, Final Settlement options | Explicit | Existing HRM string types; old records retain their numeric 0/1/2 enum. No cross-casting identities. |
| Actions column, No, Date, Type and pager | Explicit | Shared table, server count/page, typed actions. Screenshot does not prove names of empty-row actions. |
| View/Edit/Delete | Strong inference, source-confirmed | Existing manual CRUD; now shared actions, explicit editor mode and confirmation-only deletion. |
| Amount, saved revisions, approval, payment history and accounting | Source-confirmed | Current SalaryVoucher fields and current HRM/disbursement contracts. Not invented from the screenshot. |
| Screenshot appearance | Not implementation authority | Shared canonical shell/filters/table/controls/themes retained. |

## Decisions and final contract comparisons

| Concern | Final contract and evidence |
|---|---|
| Ownership | PayrollRunService owns staff calculation and revisions; PayrollDisbursementService owns pay/void/ledger effects. Generic SalaryVoucher is only a manual reference owner. Existing HRM disbursement freeze supersedes historical journal deferral. |
| Primary grid ↔ ListVM | Columns No, Date, Type, Staff, Amount, Status ↔ No,Date,Type,StaffCode+StaffName,Amount,IsApproved+IsPaid. Additional Id,RevisionNumber,Version,HasAccounting support identity, concurrency and action locks only. |
| Legacy grid ↔ ListVM | Columns SalaryVoucherNo, Date, VoucherType, TotalAmount ↔ exactly those four properties; Id:int is identity only. Removed unused inherited tenant/audit/active plumbing and presentation aliases. |
| Primary filters | no (trimmed partial No), dateFrom/dateTo, type, pendingApproval, grid plus sortField/date or amount and sortOrder. SQL predicates/grid precede count/page. No is deliberately not marked sortable. |
| Legacy filters | salaryVoucherNo partial match, dateFrom/dateTo inclusive calendar days, voucherType numeric (zero preserved), grid and generic stored-column sorting. Current month default/reset; clear means all. Invalid nonempty ranges/type fail rather than becoming an unfiltered query. |
| Applied state | Draft filters apply only on Search. Page/grid/action/export keep the applied snapshot; editor returns preserve query state. Export follows every page through fetchAllPages and uses translated DataTable columns. |
| Legacy detail / write | Detail Id+four displayed fields; Add four editable fields; Update adds Id. Optional reference max100; required real nondefault date, enum0/1/2 and nonnegative decimal(18,2) amount. Manual amount is an explicit reference input, not an authoritative HRM total. |
| Enum/date validation | Required nullable API inputs prevent omitted values silently becoming defaults. Date picker and shared parser use local date-only transport. Invalid types/dates/amount scale surface via FieldError. |
| AutoMapper | Four one-way SalaryVoucher maps; no ReverseMap/defensive Ignore. Generic update loads/clones the persisted entity before mapping; omitted audit/tenant fields remain server-owned. |
| Calculations / transactions | No HRM formula, account mapping, accrual timing, partial-payment allocation, serialization, idempotency, fiscal period or void policy changed. Existing payout backend remains authoritative. |
| Schema | No entity or EF configuration changed. No Add-Migration required for this task. Previously pending HRM schema requirements remain owner deployment prerequisites. Owner's unrelated migrations/snapshot were not edited. |
| Cache adoption | Operational payroll/payment/reference reads stay direct; type choices are static. No cache source, invalidation, permanent replay, extra loader or watcher introduced. Existing source services own payment options. |

## Action inventory and complete slices

| Action | Source → result / server owner | API and payload | UI / failure / refresh |
|---|---|---|---|
| View / Edit payroll | Current revision; edit requires unpaid and no AccountingJournalVoucherId | Existing PayrollRuns/{id} and owning process APIs | Same type-selected process; returnTo allowlists SalaryVoucher/ProcessedPayrolls; applied query retained. Server rechecks writes. |
| Approve | Current unpaid/unaccounted revision → approved current revision | POST PayrollRuns/{id}/approve {expectedVersion}; PayrollRunService.ApproveAsync | Shared record confirmation; HasAccounting/IsPaid/IsApproved guards; inline failure; existing success feedback; applied list refresh. |
| Payment / history | Current saved context → authoritative net/paid/outstanding/history | GET PayrollRuns/{runId}/payments | Reused PayrollDisbursementComponent; unapproved rows can inspect context, but cannot pay; failed reads Retry and block writes. |
| Pay | Approved current revision + eligible positive balances → partial/full payment, accrual once and employee Payment/JV | POST same payments route; revisionNumber,version,requestId,date,branchId,paymentMethodId,reference,note,lines[{payrollLineId,amount}] | Typed form and shared collection; date/scale/outstanding validation; one frozen confirm→write lifetime; unknown response blocks editing/writes until successful refresh. No automatic retry. Existing transaction/tenant/revision/account/period guards unchanged. |
| Void payment | Eligible retained payment → retained voided payment JV, reopened balance; accrual and revision lock remain | POST PayrollRuns/{runId}/payments/{paymentId}/void {version,requestId,date,reason}; existing VoidAsync | Required trimmed reason≤500 and shared confirmation. Status/date/reason retained in history. Same failure/retry protections; server owns eligibility. No reversal journal. |
| Log | Read recorded Created/Recalculated/Approved/Pay/VoidPayment | Existing PayrollRuns/{id}/logs | Existing reader; extended operation labels prevent undefined translation for pay/void. No reconstruction of uncaptured history. |
| Export | Applied list / selected saved staff snapshot | Existing paged APIs and getRun | All pages for list; same saved revision/version checked for row export; translated columns; no partial output. |
| Manual create/edit/view | Manual reference fields only | SalaryVoucher POST/PUT/GetById/{id} | One routed editor, explicit modes, View has Close/Edit and no Save, shared form/errors and deferred dirty guard. Failed writes preserve draft. |
| Manual delete | Live unused reference → soft deleted | DELETE SalaryVoucher?id; RemoveAsync→RemoveWithChildrenAsync | Shared danger confirmation identifies record; reference guard; refresh same applied search, step back for last row. |

Approved Job reference actions are all classified: View/Edit/Delete are Supported for legacy records; Log is Supported through HRM's existing owner (manual references have no separate captured-log contract). Create Job Order, Labour Time, Invoice Customer, Close Job, Cancel Job, Quality Check, Estimation, Gate Pass and Print Gate Pass are Not Applicable: the salary/manual models have no Job/vehicle/invoice/gate/QC/estimation aggregate or state. HRM Approve/Pay/Void are source-confirmed domain-specific actions and not copies of those Job actions. Manual activate/deactivate, approval, pay, void and print are Not Applicable without their own lifecycle or output contract. Rejected/UnApprove are not transplanted from purchasing: this task preserves the existing HRM frozen policy.

## Overrides and namespace/source checks

SalaryVoucherService overrides only SearchColumns (number search), ApplyListFilters (validated date range/type) and RemoveAsync (reference-aware deletion). GetMany, order, grid projection, materialization, Add/Update/Detail and controller operations stay inherited; no redundant overrides. SalaryVoucherListVM uses int Id so the generic grid identity projection remains supported. New SalaryVoucherDateAttribute is public in the VM namespace, consumed from same namespace, included by SDK default compile; VM project references Helpers and Business references ViewModels. Business GlobalUsing supplies enum, filters, EF, results and existing service types. PayrollRun list types remain in their existing namespace. JSON source uses default numeric enum behavior for legacy API. These are source checks, not successful compilation evidence.

## Final conformance reconciliation

| Gate | Final source result |
|---|---|
| Shape/reference table | Matches list/editor/shared owners named in frozen handoff. Legacy routed choice remains documented; no competing wrappers/styles introduced. |
| Routes/provider/auth | Primary SalaryVoucher→PayrollsComponent data flag; legacy/create/view/edit/details compatibility retained. List/modal and editor CanDeactivate protect active work. No feature HttpClient/interceptor/provider duplication. |
| Grid/filter/count/export | Scalar projection and typed request keys aligned; server page counts and complete export; numeric zero retained. |
| Detail/payload/validation | Minimal compatible contracts; no tenant/audit/status input. Same requiredness/length/enum/date/nonnegative/scale rules at API and form. |
| Save/close/read races | switchMap cancellation and matching identity on detail reads; form freeze on write; deferred route discard, Cancel/Back same record consent; View never saves. |
| Payout context/request identity | Context epoch and run identity checks; destroy/visibility replacement cancellation; one freeze snapshot through confirmation/write; stable request id for exact payload; no stale writes after failed reads. |
| Draft recovery | Retry keeps header/amount draft by line ID; excessive retained amounts stay invalid and visible; new lines start zero on draft refresh. Canceling discard after uncertain outcome retains frozen state. |
| Accounting lock | List flag derives current revision accrual FK. First partial pay locks edits; void does not clear accrual. Process UI guards mirror backend and process snapshot reloads after payment dialog closes. |
| Feedback/accessibility/themes | Existing success interceptor; inline declared/HTTP failure once via skipped error interceptor, shared state/field errors, local-date parsing and accessible amount labels. Shared controls own RTL/theme/keyboard; visual acceptance pending. |
| Shared extraction / learning | All reusable behavior already has shared owners; adopted those owners. Feature-specific validation and HRM adapter stay scoped. No new reusable rule established, so no book/skill revision or packet regeneration needed. |
| Scope safety | Complete scoped diffs reviewed separately in both actual repositories, plus new files read. No application-source change outside directly related feature/HRM/guide/i18n/config slices. |

## Changed files

Frontend paths relative to SiGmaAngularFrontEnd:

* src/app/modules/Vouchers/SalaryVouchers/SalaryVoucher/components/list/list.component.ts and list.component.html; components/details/details.component.ts and details.component.html; models/create.ts, details.ts, list.ts; services/salaryvoucher.service.ts; salaryvoucher.routes.ts; removed unused models/grid-row.ts. Empty SCSS retained.
* src/app/modules/HRM/Payroll/Payrolls/components/list/list.component.{ts,html}, models/list.ts, payrolls.routes.ts.
* src/app/modules/HRM/Payroll/PayrollProcess/components/disbursement/payroll-disbursement.component.{ts,html}, components/process/payroll-process.component.ts, components/logs/payroll-run-logs.component.ts, models/payroll-run.ts.
* src/app/modules/HRM/Payroll/FinalSettlementProcess/components/process/final-settlement-process.component.{ts,html}.
* src/app/modules/UserGuide/content/salary-vouchers-topic.ts (new), record-list-topics.ts (salary topic only), hrm-guide.ts; src/app/modules/i18n/vocabs/{en,ar}.ts (salary/payout keys only); tsconfig.app.json (new guide runtime entry only).

Backend paths relative to SigmaBackend:

* SiGma.Business/Services/SalaryVoucherService.cs; Services/Payrolls/PayrollRunService.cs (list fields/filter only); MapperConfig/SalaryVoucherProfiler.cs.
* SiGma.ViewModels/ViewModels/SalaryVoucher/SalaryVoucher{AddVm,UpdateVm,DetailVm,ListVm}.cs and new SalaryVoucherDateAttribute.cs; removed unused SalaryVoucherFullListVm.cs and SalaryVoucherDeleteVm.cs after named-consumer search.
* SiGma.ViewModels/ViewModels/PayrollRun/PayrollRunListVm.cs.

## In-app guide handoff

Content: src/app/modules/UserGuide/content/salary-vouchers-topic.ts, registered through record-list-topics.ts. Existing module reader/menu: /UserGuide/vouchers-journals under Vouchers → Journals and Adjustments; existing /UserGuide/hrm topic also explains the shared ownership. Covered topic /SalaryVoucher includes all three payroll types, setup, filters/pages/export, approval, saved views, partial/full pay/history/void, accounting locks, uncertainty recovery and separate manual records. Bilingual authored content reconciled with final routes and server policy. No new guide viewer/sidebar duplication. Owner still verifies reader navigation, Arabic/RTL, themes, narrow screens and print.

## Verification and owner handoff

Phases PLAN-00,0,1,2,3,4,5,6 applied; schema/attachment/print/new approval-policy implementation skipped because not in the frozen target. Source review and scoped git diff --check passed; recipe drift check all eight OK. No build, test, lint, browser, database, migration, commit, push or deployment was run. No runtime success is claimed.

Owner checks: open SalaryVoucher and ProcessedPayrolls and confirm same runs; search a number/current month/all dates/all three types; use column filters, paging and complete Excel; verify return state from each process. On owner test data, approve current revision, make a partial payment, inspect generated Payment/JV and balances, then full payment; verify accounted edit lock and reasoned void keeping accrual/history. Exercise connection failure/refresh, duplicate clicks, Cancel/discard, failed detail load and legacy CRUD/validation/delete of last-page row. Verify EN/AR, RTL, dark/light, narrow layouts, keyboard and guide navigation. Existing schema deployment must already support the earlier HRM disbursement contract. JavaScript numbers cannot represent every decimal(18,2) value at the extreme storage maximum exactly; backend validation remains authoritative, and no numeric-transport redesign was introduced.

No required material decision blocks this implemented slice. Automatic association of old manual references with staff/period/revisions is deliberately unavailable because no reliable source keys exist; any future migration needs its own owner decision. No Add-Migration is required for these changes.

Agent utilization: three bounded sol_worker assignments used gpt-5.6-sol, after root discovery/freeze: legacy backend (service/maps/VMs), legacy frontend (feature components/models/service only), payout safety (existing disbursement TS/HTML only). Backend worker additionally audited root list projection read-only. Independent ownership reduced parallel implementation time without overlapping files; root owned all integration, further corrections, docs/i18n/routes, complete diff review and final decisions. One legacy worker continuation hit its usage limit after partial corrections; root completed and reviewed the remainder. No overall completion was delegated.

Suggested commits (scope only the files above; preserve other pending work):

```text
SiGmaAngularFrontEnd:
feat(salary-vouchers): reuse HRM payroll and payment workflows

SigmaBackend:
fix(salary-vouchers): align legacy validation and payroll list state
```

## Cache and freshness audit — 2026-10-25, subsequent owner request

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Authorization | Source-read-only cache review. Owner explicitly clarified Salary Vouchers and the related HRM payroll workflows, rather than Journal Vouchers. No application, configuration, guide, instruction or canonical-book source was changed in this audit. |
| Scope | Primary SalaryVoucher/ProcessedPayrolls shared list, manual SalaryVoucher list/editor, payroll and leave-salary process, final-settlement process, disbursement, logs, revisions and payslips; directly consumed shared cache/session owners only. This is not an audit of every HRM screen. |
| Authority and packets | Current skill mandatory cache gate; Master1/4/5/7, UI2/22/28 and relevant backend read/action owners. Generate-SigmaRecipes.ps1 -Check: all eight packets OK before packet use, no refresh required. UI30 and BE19 backlogs checked; findings below are not the listed global-storage/Company enum defects. |
| Shapes | Existing stateful payroll/revision workspace and disbursement aggregate, manual normal-entity list/routed editor and payslip report. Cache eligibility follows the exact source contract, not the component's visual shape. |

This section refines the earlier broad cache-adoption row with a per-source inventory. The earlier implementation and frozen-contract sections remain historical records. Their general refresh/accounting-lock statements do not close the failure cases identified below. This audit does not declare implementation closure.

### Source classification and adoption evidence

URLs below are relative to the configured API base. Query parameters remain part of each list request; placeholders identify the actual encoded identity paths, not additional endpoints. All scoped feature services issue typed HttpClient requests directly. None invokes cacheSelect/readReferenceSelect/watchSelectList, a feature-local replay cache, browser storage, or ReferenceLookupBindings. Direct operational sources therefore have no reference-cache invalidation or watch obligation. The absence of such a watch is not itself a defect.

| Actual URL / method; consumer service and shape | Classification and source owner / writers / topic | Bootstrap, watch, recovery and result |
|---|---|---|
| GET SalaryVoucher; SalaryVoucherService.getList/getAllList; Results<SalaryVoucherDTO> | Direct document list; backend SalaryVoucherService and inherited persistence; POST/PUT/DELETE SalaryVoucher are its writers. No registered shared reference topic for this URL. | Finite list switchMap; page export makes separate direct requests. Explicit applied-query refresh and last-page correction after delete; route back after save. Failure/Retry owned by list. Appropriate direct contract. |
| GET SalaryVoucher/GetById/{id}; SalaryVoucherService.getDetails; Result<SalaryVoucherDetailsDTO> | Direct document detail; same writer/owner, no reference topic. | Routed editor identity/read cancellation, initial errors and Retry; failed saves preserve form draft. No watch required. |
| GET PayrollRuns; PayrollsService.getList/getAllList; Results<PayrollRunListRow> | Direct operational list; PayrollRunService. Save/approve and PayrollDisbursementService pay/void affect its state. No reference topic. | PayrollsComponent binds one switchMap list stream; refreshAppliedList after approval and closePayments. Export reads all pages. Failure clears rows/count and exposes Retry. |
| GET PayrollRuns/{id}; PayrollsService.getRun, PayrollProcessService.getRun, FinalSettlementService.getRun; Result<PayrollRun> | Direct saved aggregate with approval/payment/accounting state; PayrollRunService; save/approve/pay/void writers. No reference topic. | Finite detail/export/process reads; component destruction cancels reads. Process reloads after closing payment. **Findings C1/C2 below** concern retained local state and Retry identity, not a shared cache entry. |
| POST PayrollRuns/calculate; PayrollProcessService.calculate, FinalSettlementService.calculate; Result<PayrollRun> | Direct calculation using current staff, attendance, leave and policy inputs; PayrollRunService calculation owner. Read semantics despite POST. | Finite action read; matches period/type/staff, both failure channels and calculation Retry. No permanent replay or reference watch. |
| GET PayrollRuns/{id}/revisions; PayrollProcessService.getRevisions, FinalSettlementService.revisions; Result<PayrollRevisionSummary[]> | Direct aggregate revision history; PayrollRunService, written by save. No reference topic. | Identity-bound history reads, explicit errors/Retry and teardown. No cache adoption required. |
| GET PayrollRuns/{id}/revisions/{revisionNumber}; PayrollProcessService.getRevision, FinalSettlementService.revision; Result<PayrollRun> | Direct revision snapshot; PayrollRunService. Saved figures are historical, but current aggregate status is a separate concern; no approved reference-cache contract. | Finite selected-revision read with matching context; errors/Retry and teardown. History remains view-only. |
| GET PayrollRuns/{id}/logs; PayrollProcessService.getLogs, FinalSettlementService.logs; Result<PayrollRunLog[]> | Direct operational history; PayrollRunService; save/approve/payment lifecycle writes. No reference topic. | Existing log dialog owns loading, failure/Retry and context cancellation. No watch required. |
| GET PayrollRuns/leave-salary-staff; PayrollProcessService.getLeaveSalaryStaff; Results<PayrollStaffOption> | Direct eligibility, not a general Staff/GetSelect. PayrollRunService.LeaveSalaryStaffAsync queries current staff and excludes staff with final settlements. Staff lifecycle and saved settlements are underlying writers. No approved source/topic for this exact URL. | Finite loadStaffOptions, separate errors/Retry, takeUntilDestroyed. Selection and draft remain screen owned. Eligibility must still be validated by backend calculation/save. |
| GET PayrollRuns/settlement-staff; FinalSettlementService.staff; Results<FinalSettlementStaffOption> | Direct current staff/settlement input options; PayrollRunService.SettlementStaffAsync projects active status, designation and joining date. Staff is the writer. This custom source is not an opted-in shared lookup. | Finite staff bootstrap with failure/Retry and destruction teardown. No reference watch required; saved staff context is preserved by the existing screen owner. |
| GET PayrollRuns/{id}/payments; PayrollDisbursementService.getPayments; Result<PayrollDisbursement> | Direct authoritative payment snapshot: outstanding amounts, payment/void history, approval/version, branches, eligible payment methods and decimal policy. PayrollDisbursementService.ReadAsync queries live records; pay/void, approval, branch/payment-method changes are inputs. **Not** Branch/GetSelect or PaymentMethod/GetSelect; their lookup-branches/lookup-payment-methods topics do not establish a contract for this aggregate URL. | Fresh open/retry via switchMap, run/epoch checks and teardown. Pay/void applies returned state then refreshes. Unknown outcomes/failed refresh freeze mutations until Retry succeeds. Draft amounts retained by payrollLineId, still validated against fresh limits. Appropriate direct contract; do not cache the entire response to reuse its embedded options. |
| GET PaySlips; PaySlipsService.list/all; Results<PaySlipListRow> | Direct report list; PaySlipService projects saved payroll revisions. Payroll save/current-revision changes are producers. No reference topic. | Finite list switchMap and fresh paged export; report errors/Retry and destruction teardown. |
| GET PaySlips/{id}; PaySlipsService.detail; Result<PaySlipDetail> | Direct report detail; PaySlipService, saved run/revision/line producer. No approved reference-cache contract. | Finite selected report read; saved identity/revision checked; transient print state cleared on close. |
| GET PaySlips/staff; PaySlipsService.staff; Results<PaySlipStaffOption> | Direct report-derived options. PaySlipService.StaffAsync:162–177 joins PayrollLine/PayrollRunRevision/PayrollRun, takes latest saved staff code/name; it does not query the general Staff lookup. Payroll save is its producer. No reference topic. | Finite loadStaff with error/Retry; options belong to saved report scope. No source cache/watch adoption required. |
| GET CurrentBranch/Options; CurrentBranchService.load; Results<CurrentBranchOption> (indirect default owner) | Separate session-context options. Root CurrentBranchService owns session state, not the payroll eligibility options; source is CurrentBranchService backend/Branch records. Not Branch/GetSelect. | load coalesces only an in-flight request, finalize clears pendingLoad. Auth/session key change increments sessionVersion, clears state and ignores old responses. Both failure channels recorded; load can be retried. Payout only applies a pristine/empty default, then validates against its own fresh branches. |
| GET CurrentBranch/Mine; CurrentBranchService.load; Result<CurrentBranch> (indirect default owner) | User working-branch preference; PUT CurrentBranch/Mine commits shared session state. Not an implicitly opted-in singleton settings cache. | Same finite forkJoin/session-version recovery as Options. shareReplay is only in-flight deduplication: future load creates a new HTTP request after finalize. No source adoption finding in this scoped use. |
| Local payroll type/status choices; legacy voucher type enum | Static UI choices, no API URL or server writer/topic. | In-memory translated values, no browser-storage lifetime or invalidation needed. |

Shared-owner checks: modules/shared/service/base-service.service.ts defaults cacheSelect to false and only sends explicit reference reads through readReferenceSelect/watchReferenceSelect. Its presence in an inheritance chain does not cache explicit feature HttpClient calls. ReferenceLookupCacheService.topicFor only maps exact approved lookup/settings URLs; none of the payroll/document/report URLs above is mapped. Branch and PaymentMethod have their own reference topics for their own URLs; that is not evidence to cache PayrollRuns/{id}/payments. The root interceptors configured in app.config.ts are token, error and navigation-activity owners, with no general GET-cache interceptor. ngsw-config.json has dataGroups: [], so no API-data service-worker cache is configured. Runtime browser/proxy behavior was not inspected.

Backend confirmation: PayrollRunService, PayrollDisbursementService, PaySlipService and SalaryVoucherService read the owning repository/query sources; no scoped server cache was found. Payroll policy uses HrmSettingService.GetMineAsync → SingleRowSettingsService.GetMineAsync → ServiceHelper.GetSingleAsync → FindSingleAsync repository query, not a browser lookup snapshot. Existing persisted payroll/revision source snapshots are business history/version evidence, not a shared lookup cache to invalidate.

### Confirmed findings and recommended changes (not implemented)

**C1 — P2: failed parent refresh retains an apparently usable pre-payment state.**

Source: PayrollProcess/components/process/payroll-process.component.ts:294–297,455–488,112–129. Open an approved, unpaid run, pay partially or fully, close the payment dialog, then fail GET PayrollRuns/{id} (HTTP error or isSuccess:false). closePayment starts the expected fresh read, but both failure branches only set actionError/retryAction. The previous preview remains and loadingRun is cleared in finalize. canProcess/canPay continue using its old hasAccounting/isPaid flags; displayed totals/status can therefore remain stale and actions can be offered after the payment changed the authoritative state. Backend payment/version/accounting validation still applies; this finding does not establish double payment or bypass of financial controls. Recommendation: retain the visible snapshot as stale, block operations that depend on its freshness until a successful retry, and preserve draft/selection rather than silently treating the previous snapshot as current. This is a local freshness/recovery issue, not reference-cache invalidation.

**C2 — P2: load Retry uses the original route ID rather than the ID that failed.**

Source: the same component:110,172–177,273–280,294–297,455–487. initialRunId is assigned only from the initial route query. A user may process a period with an unchanged already-saved and approved run without opening a runId route: calculate returns its id/isSaved/isApproved (backend PayrollRunService:810–829), so payment is available while initialRunId remains null. If the close-payment refresh then fails, canRetry returns true and the button is shown, but retry's load branch does nothing because it requires initialRunId. A route-started screen that later changes the calculated context can similarly target the old ID. Recommendation: record the attempted load ID as the retry context and clear/replace it with screen context changes; replay that exact read. Do not silently fall back to a different run. Reproduction acceptance must exercise the no-runId calculation route and both failure channels.

### Reconciliation and owner acceptance

No required approved shared-cache source was found missing adoption in this feature scope. Adding cache to payroll balances, eligibility, calculation or composite payment snapshots would contradict the current direct-read contracts. The two confirmed findings require a bounded recovery fix in PayrollProcessComponent; they remain open because this request authorizes review only. No guide edits, application edits, schema work or packet changes were made. The earlier blanket cache-adoption statement is supported by the exact-source inventory above, with C1/C2 explicitly qualifying local refresh recovery.

Source tracing covered service requests, consumers, shared cache/session seams, relevant backend producers, root interceptors/service-worker configuration, and the current PayrollProcess scoped diff. No build, test, lint, browser/network, database, migration or runtime action was performed. Owner verification remains pending: approve/pay/void and reopen through both entries; fail each required read using HTTP and declared failures; verify Retry actually requests the same run, stale actions remain disabled, drafts/labels survive and account/session changes do not replay prior-context results. This section records a completed source review with open recommended fixes, not an implemented-fixes handoff.

## C1/C2 recovery fix — owner authorization and scoped handoff, 2026-10-25

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Authorization | Subsequent owner instruction: fix the reported observations. C1/C2 only; the preceding source-read-only audit remains historical. |
| Tier / shape | Tier S, one payroll-process read/recovery rule. Existing stateful HRM workspace reused by Payroll and Leave Salary; no backend shape, API, DTO, accounting, cache eligibility or permission change. |
| Frozen behavior | Store the attempted load ID for Retry, independently of route entry. Mark the retained snapshot as requiring refresh until a valid load succeeds; block processing/save/payment/export and history selection while freshness is unresolved. Retain displayed rows and form values on both failure channels. A deliberate reset/context clear drops the old snapshot and retry context before starting any fresh calculation. |
| Scope | PayrollProcessComponent TS/template, directly required bilingual label and existing Salary Vouchers/HRM guide text, this review. No shared API extension or parallel cache owner. |
| Packets | Initial -Check all eight OK. Focused PHASE-03 recovery and PHASE-06 reconciliation; phases0/1 evidence/contracts reused, no grid/domain-action/backend/runtime implementation. |

| Concern | Canonical block | Actual reference/shared contract | Target decision before edits |
|---|---|---|---|
| Exact fresh read / Retry | UI2/22/28; Master5 | PayrollProcessService.getRun(id), Result<PayrollRun>; same workflow's PayrollDisbursementComponent.failLoad/refreshRequired gates, no new shared abstraction | Store exact failed load identity; finite direct read, takeUntilDestroyed/finalize retained. No cache adoption change; preceding exact-URL inventory applies. |
| Retained stale snapshot | UI22/28 | Existing disbursement preserves its snapshot/draft and blocks mutations through refreshRequired; existing PayrollProcess canProcess/saveDisabled/canPay/canExport own local action states | Add one local freshness gate and explicit translated status; guard handlers as well as button conditions; prevent revision selection from erasing the load error/Retry. |
| Presentation / guide | UI23; Master7 | Existing FeatureTitle status badge, StateMessage error and Retry button; registered salary-vouchers-topic and HRM guide reader | Reuse owners/styles, bilingual text only; no new wrapper, palette, loading owner or guide route. |

The shared-extraction gate found no missing reusable capability: request identity and payroll snapshot validity are screen-owned business context, while HTTP, error/status presentation, form freeze and component lifetime already have shared owners. No new book/skill rule is established. This tightly coupled fix does not meet the independent-workstream delegation gate; no subagents are used.

### C1/C2 implementation reconciliation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

| Finding / gate | Final source evidence |
|---|---|
| C1 retained state freshness | PayrollProcessComponent.refreshRequired becomes true before getRun subscribes. Declared/HTTP failures preserve preview and form values and keep that gate true. canProcess/saveDisabled/canPay/canExport and process/calculate handlers reject stale operations. viewRevision rejects stale selection without clearing the load error/Retry. The existing form-restore owner disables revision while stale and enables it after successful recovery, retaining the existing View/staff locks. The header uses the shared warning badge and translated refreshRequired label. |
| C2 exact Retry identity | Replaced route-only initialRunId with retryRunId, assigned from every attempted loadRun(id). Retry requests that captured ID. A successful response must match both requested ID and payroll/staff route context before applyPreview clears the gate/ID and replaces the snapshot. No dependency on a runId query remains in retry. |
| Successful recovery | loadingRun remains part of busy while applyPreview replaces data, clears freshness state and refreshes revisions. finalize releases loading/form state; revision is explicitly enabled even if the previous failed attempt left it disabled. Read-only month and saved Leave Salary staff locks remain. |
| Context replacement | reset and clearRunState clear retry identity and freshness together with the prior snapshot/error. Reset of general payroll starts a fresh calculation; Leave Salary starts a new staff/month selection. No stale payload or automatic payment retry is introduced. |
| Error ownership / lifetime | getRun keeps inlineOptions/X-Skip-Error-Interceptor, existing apiErrorMessage and StateMessage/Retry. Both failure channels retained. takeUntilDestroyed, finalize and busy guards unchanged. Logs/notes remain read-only accessible without discarding the failed-load context. |
| Cache source inventory | All URLs, producers, writers, topics and direct-read exceptions in the preceding audit still apply. Only the PayrollProcess consumer recovery for GET PayrollRuns/{id} changed; no reference watch, local replay, root cache or invalidation change. |
| Contracts / calculations | No service signature, endpoint, payload, DTO, permission, financial calculation, mapping, backend source, entity or EF configuration changed. No migration is required. |
| User guide | Updated the existing SALARY_VOUCHERS_TOPIC notes at /UserGuide/vouchers-journals and Payroll/Leave Salary notes in HRM_GUIDE at /UserGuide/hrm. Existing registered reader/menu/routes retained. Bilingual text explains retained figures, blocked operations, Retry for the same run and Reset; no new guide component or registration. |
| Conformance / scope | Reconciled the pre-edit table with the final consumers, state checks, shared badge/error/form owners and guide text. Existing unrelated working-tree changes were preserved; no new shared capability or canonical-book/skill change was necessary. |

Files changed in this bounded continuation (relative to SiGmaAngularFrontEnd):

- src/app/modules/HRM/Payroll/PayrollProcess/components/process/payroll-process.component.ts
- src/app/modules/HRM/Payroll/PayrollProcess/components/process/payroll-process.component.html
- src/app/modules/i18n/vocabs/en.ts and ar.ts — one payrollProcess.refreshRequired label each only.
- src/app/modules/UserGuide/content/hrm-guide.ts — one recovery note per affected process topic.
- src/app/modules/UserGuide/content/salary-vouchers-topic.ts — one recovery note.

The existing unversioned feature review is also updated. The application's complete scoped process TS/template diff was reviewed in its actual frontend repository, including earlier feature changes, along with the guide diff/content and exact bilingual label additions; no backend repository edit belongs to this continuation. New content stays included by the existing explicit application files list. Scoped git diff --check returned 0, no conflict markers were found in touched feature/guide files, and the final recipe -Check again returned all eight OK. Static path reconciliation covered initial failure, post-payment HTTP/declared failures, no-runId processing followed by Retry, repeated retry failure, successful retry including history-control re-enable, View locks and reset/context replacement. These are source checks, not executed regression tests.

Owner acceptance: for Payroll and Leave Salary, reach an unchanged saved approved run by processing a month without runId, open/close its payment dialog and fail its follow-up read once by HTTP error and once by isSuccess:false. Confirm old values remain visibly stale, mutations/export/revision selection stay blocked, Retry requests that same run, and success restores controls while respecting paid/accounted locks. Repeat from a saved-run View route; check failure/retry after partial and full payment, Reset/new staff/month, both languages, RTL/themes and guide navigation. Builds, tests, lint, browser/runtime/network and database verification remain pending; none was executed. No migration, database command, commit, push, deployment, Graphify or Sigma MCP was used.

Suggested frontend commit: `fix(payroll): recover failed run refreshes with exact retry context`.
