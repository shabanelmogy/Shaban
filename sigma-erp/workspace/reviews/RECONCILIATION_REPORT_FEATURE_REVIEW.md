# Reconciliation Report — review and implementation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-06 |

Scope/manifest and frozen decisions: RECONCILIATION_REPORT_FRONTEND_BACKEND_CONTRACT_FREEZE.md. Recipe check passed; Master1–7, UI1–8/16/17/19–29 and BE17/19 selected as applicable. No editor/detail/write/action API added. Canonical report exception: Print is a read-only row action, not CRUD. Local presentation paging is justified by E1/current table and proven complete endpoint.

## E1 functional evidence

| Evidence | Classification | Requirement | Phase | Representation |
|---|---|---|---|---|
| Date Range and Bank | Explicit | Filter historical sessions; empty bank can show all banks (API confirms) | 1/2 | typed form, dual-month date range and scalar select |
| Date, Bank, Reconciled Balance, Pending Entries Balance, Ledger Balance | Explicit | Five financial data columns | 1/2 | typed DataTable date/text/money columns |
| Search/Export to Excel | Explicit | Search then complete output | 2 | shared translated controls/export helper |
| Row Actions: Print | Explicit | print selected historical row | 2 | shared ActionList and print session; loaded values only |
| Row Actions: Delete Reconciliation | Explicit existence, Uncertain transition | destructive reversal semantics missing | 4 blocked | no fabricated endpoint/button; separate owner decision required |
| Paginator/10 rows | Explicit historical presentation | local paging supported, exact default governed by UI6 | 2 | shared default15/10,15,20,50,100; complete array |
| Nonzero negative pending balances | Explicit content; Conflicting current producer | backend currently returns statement-minus-reconciled proxy | 1 | preserved and reported; no accounting formula invented |
| Exact appearance/spacing | Not implementation authority | screenshot supplies business evidence | all | canonical shared report/layout owners |

## Reference conformance before implementation

| Concern | Book | Actual reference/symbol | Shared owner | Initial finding / target |
|---|---|---|---|---|
| Shell/title/edges | UI1/3/20 | TrialBalanceListComponent.config → AccountReportPage template: sigma-route-host, fill report page/panel, direct FeatureTitle | styles.scss, ReportPage, FeatureTitle | existing legacy cards/no title; target same bounded chain, no local CSS |
| Filters | UI16/17/19/20 | AccountReportPage date-range branch: 2 months, keepInvalid, appDatePicker, reserved FieldError | DatePicker, FieldError, global stable report strip | existing null range/raw date transport/wrong bank name source; target current month + required real range + optional typed GetSelect bank |
| Data | UI5/6 | JobsComponent typed date/money columns; CustomerStatementComponent complete-array controlled paging | DataTable, resolveListPaging | existing ms-lib/any; target five columns, id, default15, fill viewport |
| Requests/states | UI22/28 | JobsComponent.bindListQueries switchMap/defer and AccountReportPage.bindRequests form/finalize | BaseComponent, apiErrorMessage, StateMessage | no HTTP callback/declared-failure state; target one stream, loader cleanup and retry |
| Print/Excel | UI8/21 | CustomerStatementComponent.print/export and shared ReportPrintService.createSession, dataTableExportRows | print session, formatted export | missing concrete outputs; target all applied rows / selected row Print, preserve page/size after print |
| Backend read | BE17 | AccountReportsService existing report methods + Repository.QueryReport | repository tenant/live/untracked report boundary | target SQL-only row projection, inclusive upper day and Id tie-breaker, preserve wire/arithmetic |

## Initial confirmed findings

Wrong root endpoint ReconciliationReport (actual AccountReports/ReconciliationReport); raw dateRange never reaches fromDate/toDate; untyped forms/results/models; legacy ms-lib grid; full Bank read instead of GetSelect; missing failure/finalize/cancellation/retry/empty states; missing feature title/working print/export; no applied-filter output lifetime; unsafe null reset request. Backend full tracked-scope entity materialization followed by local projection and unstable equal-date ordering; report reads should use QueryReport and direct projection.

## Unresolved and excluded

Delete has no confirmed API/state/reopening rule. Balance derivation is a confirmed approximation, not ledger evidence; completed reconciliation Difference=0 implies proxy pending0. Both are recorded in the frozen handoff and are not silently declared complete. Authentication is existing AuthGuard/[Authorize]; authorization candidate: future delete/reverse reconciliation (endpoint Missing). No fabricated permissions.

## Final reconciliation

Confirmed read/UI repairs are implemented and source-reviewed. The complete screenshot workflow is **not Closed**: Delete Reconciliation and a real historical ledger/pending calculation remain unresolved business contracts. Runtime/visual acceptance remains pending independently of those findings.

### Decisions and final reference conformance

| Concern | Decision and evidence | Final source / shared owner |
|---|---|---|
| Shape | UI20/21 report; backend pattern5. Historical completed sessions, no create/edit/detail surface. Read-only row Print/local pager are recorded exceptions supported by E1 and the existing complete endpoint. | ReconciliationReportComponent; GetReconciliationReportAsync |
| Shell/title | Match actual TrailBalance configuration and Accounts/shared/report-family/account-report-page.component.html shell: host sigma-route-host, ReportPage fill, report panel, direct FeatureTitle. Existing global report values own 7px page padding, 16px/14px panel inset, title separation; direct list-table owner removes the ordinary-list inset. | target HTML; styles.scss; shared ReportPage/FeatureTitle; toolbar exact /reconciliationReport exclusion |
| Filter geometry | Actual AccountReportPage date-range control matched: 2 months, manual entry, keepInvalid, shared date picker, body overlay; stable report field basis170px/max300px and shared feedback reservation. Optional bank is scalar GetSelect id/value, empty means all banks. Shared flex/wrap responsive behavior, not screenshot column widths. | typed filterForm; DatePickerDirective/FieldError; sigma-report-filter-panel--stable; no feature SCSS |
| Grid model | Columns: Date, Bank, Reconciled Balance, Pending Entries Balance, Ledger Balance; Actions=Print. Frontend list properties: id/date/bankName/reconciledBalance/pendingEntriesBalance/ledgerBalance. Backend same six properties plus existing IsReconciled retained for API compatibility; no new audit/state fields. Signed money retained. | typed columns and ReconciliationReport; ReconciliationReportLineVm; shared date/money formatters |
| Paging | UI6 default15 and 10/15/20/50/100 options, controlled first/rows through resolveListPaging (same owner used by CustomerStatementComponent). No paging request, because producer has no Skip/Take/clamp. Total is complete loaded array length. No invented server sorting/column filters. | onPage/firstRecord/pageSize; DataTable lazy=false/fill=true |
| Request lifecycle | Match JobsComponent.bindListQueries and AccountReportPage.bindRequests using Subject/switchMap/defer, teardown, finalize, one inline failure owner and real typed form submission. Date range required in UI, bank optional and validated against lookup. Search only on explicit submit; no initial/unfiltered reset request. | bindRequests/onSearch/onReset/loadBanks; apiErrorMessage; root LoadingService |
| Applied output | User edits invalidate data/snapshot, errors and page offset. Search failure leaves entered filters for recovery. Print/Excel enabled only for a successful nonempty applied response and idle state. | invalidateOutput/appliedFilters/canOutput |
| Print/Excel | CustomerStatementComponent + ReportPrintService/dataTableExportRows are reused. All-report print and Excel include every loaded row; selected-row Print includes just that historical row and the same five columns. Print removes action/pager/scroll bounds and retains page/size/form on completion/cancel. No detail endpoint implied by E1 was invented. | print/displayedRows/printSession; exportToExcel click-time headers/date/money formatting |
| Composition exception | Accounts-local AccountReportPage config is not reused as a Banking business container: it has no selected-row actions/controlled local pager contract. Target reuses the approved report shell and shared controls directly; no new parallel report infrastructure or stylesheet. | actual shared owners above, feature owns bank lookup/report state only |
| Backend read | Use Repository.QueryReport (tenant/live/untracked), direct SQL DTO projection, date descending then Id descending. Include whole upper calendar day with an overflow guard for 9999-12-31. Optional dates/bank preserved at API boundary. | GetReconciliationReportAsync, no full entity Include/materialization |
| Validation amendment | Frozen handoff amendment dated2026-10-06: malformed supplied nonblank dates/bank, nonpositive bank and reversed dates fail before query; malformed values must not silently widen results. Reuse existing HasInvalidFilter/localizer; existing controller returns BadRequest. | ReconciliationReportInvalidFilters EN/AR; existing InvalidDateRange; UI error callback |
| Mapping/calculations | Direct projection; AutoMapper N/A. Preserve StatementBalance-ReconciledBalance pending and StatementBalance ledger proxy. These are not accepted as a verified ledger calculation. No completion/persistence/write rule changed. | existing arithmetic explicitly documented in method summary and frozen handoff |
| Security/integration | Existing AuthGuard/[Authorize], root interceptor HttpClient and environment base URL. Skip error interceptor only for report/lookup inline ownership. No new providers or permission API. Future delete/reverse is an authorization candidate, currently Missing. | pages/routing.ts, ReconciliationReport.routes.ts, root service, AppModule and existing controller |
| Shared extraction gate | Existing owners already cover shell/title/date transport/paging/export/print/errors/feedback/actions. No qualifying repeated behavior needs a new shared abstraction in this bounded feature. Reference files and shared owners were read, not changed by this task. No reusable new instruction rule established; no guide/skill amendment needed. | no new shared component/helper/provider |

### End-to-end comparison

| Contract/path | Producer artifact | Consumer artifact | Final source evidence | Status | Required action |
|---|---|---|---|---|---|
| Screenshot business | E1 + frozen handoff | five-column grid/actions | HTML/columns/print/export | read/UI covered; delete/balances open | separate business decisions below |
| Row identity/fields | ReconciliationReportLineVm | ReconciliationReport/columns | id+five displayed fields; BankName nullable | source-compatible | owner verify serialized casing/date/money |
| Date/bank filters | filterForm + toFilterParams | RequestDto.Filters/GetDate/GetInt | fromDate/toDate yyyy-MM-dd, bankId omitted for all banks | source-compatible | verify requests and upper-day inclusion |
| Complete paging/output | QueryReport projected complete array | DataTable/onPage/print/Excel | no Skip/Take; no paging request; total=data.length | source-compatible | compare >15-row output with response |
| Failure ownership | Results failure + controller BadRequest/HTTP errors | loadBanks/bindRequests | inline messages/retry/repeat Search, skip header/finalize/teardown | both channels source-covered | owner force declared failure/400/500 and navigate away |
| Print restoration | ReportPrintService session | printing/displayedRows/form effect | paginator=false, actions=[], flow; page/size retained, selected row cleared; untracked validator dependencies | source-covered | owner print and cancel from later page |
| Route/provider/title | /reconciliationReport empty child + root HttpClient | route component/service/toolbar | one panel title, matching URL and endpoint | source-compatible | owner check navigation/auth/interceptors |
| EN/AR | feature vocabs + backend GeneralMessage resources | grid/actions/feedback | 17 exact feature keys each, shared used keys exist; backend failure keys each once in valid XML | source-verified | visual RTL/language check pending |
| Layout/theme/accessibility | UI20 globals and shared owners | target template | labels/inputIds, keyboard submit/focus first invalid, reserved feedback; no custom CSS | source-conformant | runtime narrow viewport/light/dark/RTL acceptance pending |
| Detail/write/save/upload/refresh | none | none | no editor, mutation or upload added | N/A | none |
| Delete/reopen | Missing action contract | intentionally no destructive row command | completion reserves journal lines; no report delete API | Blocked slice | freeze exact removal/reopening/concurrency/audit rule |
| Ledger/pending accounting | current stored-value proxy | three numeric columns | preserved; completed Difference0 commonly yields pending0 | Conflicting slice | freeze ledger-as-of-date/account mapping/pending population |

### Files changed by this task

Paths below are relative to their real repository root. Other dirty hunks in the shared vocabularies, toolbar, AccountReportsService and resource files predate this task and were preserved.

Frontend root: `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- `src/app/modules/Banking/ReconciliationReport/components/reconciliation-report/list.component.ts` — typed report form, request/error/lookup/output/print/paging lifecycle and shared controls.
- `src/app/modules/Banking/ReconciliationReport/components/reconciliation-report/list.component.html` — approved fill shell/title/filters/actions/states/shared grid.
- `src/app/modules/Banking/ReconciliationReport/components/reconciliation-report/list.component.scss` — empty file removed; metadata styleUrl removed.
- `src/app/modules/Banking/ReconciliationReport/models/list.ts` — required row identity, wire date/nullable name, typed filter.
- `src/app/modules/Banking/ReconciliationReport/service/reconciliReport.service.ts` — correct AccountReports endpoint/typed Filters/inline-error header.
- `src/app/modules/i18n/vocabs/en.ts` and `ar.ts` — five matching feature keys added; existing keys retained.
- `src/app/_metronic/layout/components/toolbar/toolbar.component.ts` — two target-only lines suppress duplicate title.

Backend root: `F:/My Work/Sigma/SigmaBackend`:

- `SiGma.Business/Services/AccountServices/AccountReportsService.cs` — only historical GetReconciliationReportAsync and its summary changed by this task; projection/date/order/validation.
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx` and `GeneralMessage.ar-SA.resx` — one matching report filter-error key each.

Route/controller/DTO/entities/EF configuration/AutoMapper/shared implementations/reference modules/spec files were inspected where applicable and not edited by this task. Review artifacts are local/unversioned under `F:/My Work/Sigma/reviews`.

### Phases and verification

Phases0/1/2/5/6 applied: evidence/shape/source selection, frozen contract, read/grid implementation, integration, final source reconciliation. Phase3 N/A (no editor/write). Phase4 destructive slice Blocked (no frozen deletion contract). PLAN-00 not needed for the confirmed bounded repairs; accounting/deletion expansion requires its own frozen scope. Recipe drift Check passed all eight generated packets.

Real repository roots verified separately. Complete target module diff, target toolbar lines, complete feature vocabulary blocks, report method/summary and added localization entries reviewed; unrelated dirty file hunks distinguished from this task. Stale ms-lib imports/any models/raw dateRange transport/styleUrl removed. Route, menu, provider/interceptor, DTO projection and action/output paths checked. No target merge markers found. Scoped git diff --check passed in both repositories (only existing LF/CRLF normalization notices). Check-Translations.ps1 -Block ReconciliationReport passed: EN17/AR17, missing0/case0. Shared action keys checked in their actual general blocks; relevant RESX XML parsed and both failure keys found once per language.

No build, tests, lint, browser/runtime verification, database commands, migration creation/run, ModelSnapshot changes, commits/pushes/deployment, Sigma MCP or Graphify were performed. No Add-Migration is required: no schema/entity/EF change. Source checks do not prove compile/runtime/accounting correctness.

Possible remaining runtime risks: EF SQL translation of the direct projection/date boundaries; PrimeNG calendar manual range parsing; print preparation/browser afterprint restoration; local paging with full output; shared report sizing on narrow viewports. The report deliberately keeps an unpaged response, so large historical ranges can be expensive. No claim of measured performance, visual acceptance or successful compilation.

Owner manual verification (pending):

1. Compile both scoped applications under the owner's normal workflow. Open `/reconciliationReport` in English and Arabic, light/dark and narrow viewport; verify one title, fixed filters/pager and internal row scrolling.
2. Confirm bank choices load id/value through GetSelect; lookup failure blocks Search, Retry recovers. Null bank shows all banks; selected bank limits sessions.
3. Enter empty/incomplete/invalid/reversed ranges; verify inline feedback and first-invalid focus. Search valid ranges and confirm exact Filters keys, inclusive upper day and stable same-date order. Direct malformed API filters must fail without widening results; valid omitted API filters stay optional.
4. Check not-run, empty, declared failure and HTTP failure separately; controls/loading restore, entered filters remain, repeated Search succeeds, navigation tears down the read.
5. With >15 results, change local page/size; no GET should occur. Compare Excel and all-report print row count with the complete response. Confirm five translated/formatted columns and signed balances.
6. Print one row from a later page, cancel and complete print; compare selected identity and restore prior page/size, actions and enabled form. Change a filter afterwards; old print/Excel results must become unavailable.
7. Do not accept ledger/pending correctness from this refactor. Resolve the accounting/deletion decisions below and verify the revised contracts in a separate authorized slice.

### Required outstanding business decisions

Delete: specify whether the action cancels/soft-deletes or permanently removes a reconciliation, whether its journal lines become eligible again, how later reconciliations and closed fiscal periods affect eligibility, and the required history/concurrency behavior. Current unfiltered uniqueness reservation includes deleted reconciliation lines; a UI-only delete or naive soft-delete is incorrect. Exact action API is Missing, and no destructive change was inferred from E1.

Balances: specify whether each report row is a stable historical snapshot or recomputed as of StatementDate, which payment-method/GL-account mapping applies to old records (including null/changed mappings), and whether pending includes unreconciled lines at that date or current unreconciled lines. E1 proves nonzero pending content but cannot settle these accounting rules. Existing proxy arithmetic stays visible and unchanged until that contract is frozen.

### Suggested commits and agent utilization

Frontend suggestion: `refactor(banking): align reconciliation report with shared report patterns`

Backend suggestion: `fix(banking): project and validate reconciliation report reads`

Suggestions only; no commit was made. A bounded sol_worker (`report_backend`, `gpt-5.6-sol`) owned only the report read method after the contract freeze, projecting the query and guarding the upper-date overflow boundary. Root owned frontend/resources/validation amendment/artifacts/integration/final review, including the print-source audit. Independent frontend and backend files allowed concurrency without merge ownership overlap; one worker limited duplicate context/cost. Backend output was source-reviewed and integrated; root added final boundary validation using existing owners. No subagent declared feature closure.

## Owner-approved Void and snapshot slice — 2026-10-06

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Frozen handoff | BANK_RECONCILIATION_VOID_SNAPSHOTS_MAINTENANCE_EVOLUTION_PLAN.md |
| Authorization | Owner chose Void without reversing entries, accepted latest-active-account-first and saved historical balances, then “تمام طبق” |

This amendment supersedes the earlier Missing deletion transition and conflicting proxy balances for this authorized slice. Earlier decisions/exclusions above remain historical records. E1's Delete Reconciliation action is represented by the explicitly approved Void; no hard deletion or reversing journal is introduced. Its five original columns remain, supplemented with completion/Void status and snapshot availability. Accounting/state behavior is governed by the frozen maintenance plan, not inferred from the screenshot. No remaining Missing/Conflicting/Uncertain business decision in the implemented scope. Owner runtime/schema acceptance remains pending.

### Decisions and final conformance

| Concern | Owning block/reference/shared owner | Final implementation/evidence |
|---|---|---|
| Shape and phases | Master4/5; BE14/17; UI20/21 | Existing matching aggregate pattern2, read report pattern5; PLAN00 and phases0–6 applied. Phase3 is a typed reason form rather than CRUD; Phase4 one-way Void. Unvoid/upload/edit/delete/reverse not applicable under owner decision. |
| Calculation | BE1/8/14/17; AccountReportHelper opening-JV behavior | Backend owns cumulative prior active saved-line net + selected net. Complete requires statement=matched and ledger=matched+pending. All posted live nonvoid GL lines through inclusive day supply ledger; pending excludes active reservations/selected IDs. Opening JVs already included. Valid signed decimal18,2 values, including zero. Empty selection accepted only when already balanced. UI preview adds previousMatchedBalance without sending derived totals. |
| Persistence | BE1/2/8; BankReconciliation/Line aggregate | Server freezes account/name/ledger/pending/UTC completion. Nullable snapshots preserve legacy uncertainty. Void saves reason max500, server ClaimTypes.Name actor max256 and UTC time; keeps master/lines and releases IsReserved. No JournalVoucher writer called. |
| Account and chronology | BE8/15; existing AccountService.ConvertToGroupAsync FK move owner | Stored GL identity governs new sessions across bank/payment labels; old sessions resolve only from a nonempty original-line set with exactly one nonnull account, including deleted historical lines. All date order uses calendar day then Id. Only latest active may Void. New FK participates in existing account-to-group posting-child transfer. |
| Period/concurrency/replay | BE8; CashDeposit.ToggleVoidCoreAsync shared UOW, AccountingPeriodService | Complete and Void use existing per-tenant BankReconciliation ExecuteUniqueWriteAsync before validations, one graph SaveChanges. Expected closed/missing/overlapping period failures are localized Results. Repeat Void returns success without replacing audit or touching replacement reservations. Filtered tenant/detail unique index protects live reserved lines after required owner normalization. No claim of locking unrelated journal writers. |
| Read projection/legacy | BE17; Repository.QueryReport | SQL-only DTO projection and correlated state predicates, complete local paging response. Includes Void history and saved balances; all three figures null if no complete snapshot. BankNameSnapshot used when present; legacy current label fallback is explicitly not a financial snapshot. Minimal Query(includeDeleted:true).AsNoTracking exception supplies original-line identity because QueryReport excludes deleted history. No full tracked report materialization or per-row ledger queries. |
| Grid/VM contract | UI5/6/20, BE2 | Columns: date, bankName, reconciledBalance, pendingEntriesBalance, ledgerBalance, isVoided (translated status), hasBalanceSnapshot (availability). ListVM: Id/Date/BankName + three nullable balances + IsVoided/HasBalanceSnapshot; CanVoid is minimum action state, existing IsReconciled retained compatibility. Frontend matches. |
| Action/dialog | UI7/10/13/19/22/26/28; JobCloseComponent, RentalAgreementVoidComponent, EditorDialog/FieldError/StateMessage | Typed reason-only POST; trimmed required/max500 with focus/error feedback. Screen title and bank/date/id subtitle. Busy guards block duplicate submit/close/Escape/navigation. Shared discard handles dirty close and route exit; typed route CanDeactivateFn delegates parent→active dialog. Both failure channels retain reason. Inline error interceptor skip, existing global success toast retained. |
| Refresh/output | UI20/21/22/28; CustomerStatementComponent + ReportPrintService/dataTableExportRows | Success closes modal, clears stale rows, refreshes captured applied filters preserving page/size. Filters/output/page handlers locked while modal active. Print/Excel include translated status/availability with saved figures; no recalculation of historic financial values. |
| Wiring/security/mapping | BE5/6/UI2/27; existing AccountReports routes, root HttpClient/IHttpContextAccessor | POST AccountReports/BankReconciliation/{id}/Void→interface→service, cancellation preserved; providedIn root frontend service/standalone imports, no new providers. AuthGuard/[Authorize] and server tenant ownership retained, no invented authorization API. Direct projections; AutoMapper N/A. Dialog reachable through static route/component imports, no tsconfig broad include. |
| Shared/reference gate | Master5; existing shared owners | Reference/shared implementations inspected, not edited. No reusable new shared mechanism or guide/skill rule established. Navigation amendment frozen before route implementation. |

### Files changed in this slice

Frontend root `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- `src/app/modules/Banking/ReconciliationReport/components/reconciliation-report/list.component.ts` and `.html`: action/state columns, modal lock, captured-filter refresh, page preservation and route exit delegation.
- `src/app/modules/Banking/ReconciliationReport/components/void/void.component.ts` and `.html`: new typed reason dialog, guarded save/discard/route lifecycle.
- `src/app/modules/Banking/ReconciliationReport/ReconciliationReport.routes.ts`: typed dirty/locked exit guard.
- `src/app/modules/Banking/ReconciliationReport/models/list.ts` and `service/reconciliReport.service.ts`: nullable snapshots/action flags, typed reason payload/POST.
- `src/app/modules/Banking/Bank Reconciliation/models/list.ts` and `components/list/list.component.ts`: previousMatchedBalance contract and cumulative preview/valid empty selection.
- `src/app/modules/i18n/vocabs/en.ts` and `ar.ts`: only target report/working reconciliation blocks touched by this slice.

Backend root `F:/My Work/Sigma/SigmaBackend`:

- `SiGma.Helpers/Models/Banking/BankReconciliation.cs`, `BankReconciliationLine.cs`: snapshot/domain Void/audit/reservation state.
- `SiGma.DataAccess/Configuration/BankReconciliationConfig.cs`, `BankReconciliationLineConfig.cs`: precision, max lengths, nullable account FK/defaults and filtered tenant/detail index.
- `SiGma.ViewModels/ViewModels/AccountReports/BankReconciliationSessionVm.cs`, `ReconciliationReportLineVm.cs`, `CompleteReconciliationRequestDto.cs`, new `VoidReconciliationRequestDto.cs`: updated minimal contracts; some split DTO files already untracked before this slice.
- `SiGma.Business/Services/AccountServices/AccountReportsService.cs`: constructor dependencies + bank region only in this slice, cumulative reads/complete/snapshots/Void/report state. Unrelated existing report hunks preserved.
- `SiGma.Business/IServices/IAccountReportsService.cs`; `SiGma.ServerAPI/Controller/AccountReportsController.cs`: Void contract/route and related method comments.
- `SiGma.Business/Services/AccountServices/AccountService.cs`: only two lines add the new FK to existing ConvertToGroupAsync move list.
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx`, `GeneralMessage.ar-SA.resx`: two revised validation keys plus nine paired new transition messages.
- `SiGma.ServerAPI/Documentation/AccountReportsController.xml`: three bank method descriptions aligned with cumulative/snapshot/action contracts.

Review artifacts: frozen handoff amendment, new maintenance plan, this appended final reconciliation. Existing unrelated dirty hunks and prior read/UI repair changes preserved. No migration, ModelSnapshot or approved shared/reference implementation changed.

### Verification, remaining risks and owner steps

Recipe Check passed all eight packets. Separate real-repository scoped diffs reviewed, including bank region/constructor versus unrelated existing hunks, entity/config/interface/controller/docs and all new DTO/dialog files. Root source review integrated worker changes and corrected audit findings: exact-one legacy account, calendar-day/Id order and expected overlapping-year failure. Both scoped git diff --check passed apart from LF/CRLF notices. Target merge-marker search found none. Check-Translations `-Block ReconciliationReport,BankReconciliation`: EN75/AR75, missing0/case0. Both RESX files and API XML parsed; each of the eleven touched backend keys exists once/nonempty in each language. Source-only verification does not prove compilation or runtime correctness.

**Owner must run `Add-Migration BankReconciliationVoidAndBalanceSnapshots`.** Adds nullable account/name/ledger/pending, Void audit/defaultfalse and reservation defaulttrue; replaces unfiltered JV detail uniqueness with tenant+detail uniqueness WHERE IsReserved=1 AND IsDeleted=0. EntityBase.IsDeleted is nullable: review/normalize live legacy NULL line flags to false so all live reservations enter the index. Inspect deleted-parent/live-reserved anomalies before rollout. Keep legacy snapshots NULL; do not backfill invented financial figures. Deploy reviewed schema before this application version. Migration/normalization creation/execution was not performed by agents.

Owner acceptance checks:

1. Compile both apps and verify actual EF SQL execution/projection, DI, private-setter mapping and nullable JSON/formatting; external consumers must handle nullable balances/new flags.
2. Complete first and second same-account sessions: prior active net + new selected net equals closing; ledger=matched+pending with signed outstanding amounts and posted opening JVs. Check zero/no-new-row balanced sessions, invalid IDs/precision/header and older date rejection.
3. Void latest session, verify original journals unchanged, reason/actor/time retained, rows selectable again, historic balances/status preserved. Repeat Void after replacement matching; first audit and replacement reservations must remain untouched. Older/equal-day Id order enforced even for legacy timestamps.
4. Verify cross-bank/payment labels sharing one GL account; existing ConvertToGroup transfer preserves scope. Legacy missing/ambiguous account cannot Void or contaminate prior-account sums. Legacy report displays unavailable snapshots, not proxy money.
5. Verify closed month, missing/overlapping open fiscal year and concurrent complete/Void attempts. Shared lock covers participating reconciliation writers only; concurrent unrelated journal edits remain wider coordination risk. Snapshot net consistency is not proof of per-line journal immutability.
6. Force declared/HTTP Void failure, double submit, X/Cancel/Escape and route navigation during dirty/save/discard states. Reason retained on failure; successful refresh preserves page/size and disables stale output. Print/Excel all rows and selected row with status/availability in EN/AR, RTL, light/dark/narrow viewports.

Other risks: complete report arrays may be expensive for wide historical ranges; complex correlated EF CanVoid projection and browser print restoration need runtime acceptance. No build, test, lint, browser/app verification, database command, migration, snapshot edit, commit/push/deploy, Sigma MCP or Graphify was run.

Final UI1/13 source check also supplied a definite 420px EditorDialog height (shared maxHeight clamps to the viewport) and the existing sigma-editor-scroll class on its projected form. This establishes one body scroll owner for error feedback/textarea resizing; header/actions remain fixed. No custom stylesheet/reference change. Root confirmed existing sigma-field textarea theme/focus tokens and shared EditorDialog flex chain; visual sizing remains owner verification.

Suggested frontend commit: `feat(banking): add audited reconciliation void and snapshot report states`.

Suggested backend commit: `feat(banking): persist reconciliation balances and release matches on void`.

Suggestions only. Root owned backend/domain/API/EF/resources/docs/contracts/integration/final review. Bounded sol_worker `void_frontend` (`gpt-5.6-sol`) owned the isolated frontend files above after freeze; `void_backend_audit` (same model) performed read-only bank-region audit/recheck. Parallel frontend/backend work reduced elapsed time without overlapping edits; focused audit avoided repeated full discovery. Root integrated and reviewed every output, including all three audit fixes and the pre-frozen navigation amendment. Prior `report_backend` contribution remains credited in the historical section.
