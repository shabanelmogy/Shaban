| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Error Logs full-stack freeze — 2026-10-14

Authority: Sigma AGENTS; Master2/4/5/7; UI1–8,13/15/17/19/22–30; BE1–3/6–9/17/18. Owner explicitly authorized automatic SigmaBackend logging. Operational read-only exception to ordinary CRUD: shared Job list shell and EditorDialog view composition; backend standalone event + explicit read service/controller (BE18 AuditTrail operational owner and BE17 query ownership). No generic CRUD inheritance/AutoMapper; explicit database projection.

## Entity/capture ownership

ErrorLogEntry: Id int; SubscriptionId int; ExecutionTime DateTime UTC; UserName string(max256); ServiceName string(max256); MethodName string(max256); ExecutionDuration long milliseconds; ClientIpAddress nullable string(max64); ClientName nullable string(max256, currently null); BrowserInfo nullable string(max1024); Parameters string(max2048, safe HTTP route-template/status/trace metadata only); ExceptionMessage string(max8000, exception type/method-only frames or safe returned5xx description).

Standalone immutable operational entity, no EntityBase flags, No, source FK or write/delete API. Index SubscriptionId/ExecutionTime/Id. User actor bounded capture metadata, not a new auth limit. Capture only an authenticated principal with positive existing subscription claim. Measure elapsed monotonic Stopwatch; preserve UTC as labeled wall clock. RequestAborted cancellation, known SubscriptionRequired/LinkAccount/FiscalYear/JournalPosting and database duplicate/concurrency/deadlock conflicts are not unexpected failures. ErrorLogs endpoints excluded to avoid recursion. Authless/global/background work outside this HTTP tenant boundary. For unexpected exceptions capture once, safe localized500 if response not started, otherwise rethrow; explicit5xx capture once. Writer fresh DI scope/context, timeout, one implicit SaveChanges transaction, swallow capture failures with safe type-only warning; never reuse failed tracked business graph. No raw exception Message/ToString/source paths, body, query, Authorization/cookies/keys/card values. Remote IP is connection IP without inventing proxy trust. Browser is bounded User-Agent metadata. Client unavailable remains null; unsupported impersonation member removed.

## API/read contracts

| Operation | Request | Response / exact semantics |
|---|---|---|
| GET errorLogs | ListSmBase-derived ErrorLogsFilterVM: pageNo(default1), pageSize(default15/clamp10..100), snapshotId optional nonnegative top-level; Filters[fromDate,toDate,userName,serviceName,methodName,sortField,sortOrder] | ErrorLogResults : Results<ErrorLogListVM>, adds SnapshotId. Required inclusive UTC calendar-day from/to yyyy-MM-dd; reject incomplete/malformed/reversed range and to9999-12-31; private case-insensitive dictionary snapshot; optional trimmed substring text. Count before paging, stable Id tie; reject invalid sort/order/paging overflow. Tenant cutoff from maximum Id when absent, <=cutoff on later pages; not snapshot-isolation guarantee |
| GET errorLogs/GetById/{id:int} | positive id | Result<ErrorLogDetailVM>; tenant scoped, same localized not-found for invalid/absent/other tenant |

Sort whitelist: executionTime,userName,serviceName,methodName,executionDuration,clientIpAddress,clientName,browserInfo. Default executionTime descending, ties Id descending; allowed sortOrder1/-1. All requests use CancellationToken. Both declared failure and HTTP failure handled inline with skip-error header in Angular.

Grid ordered columns ↔ frontend row ↔ ListVM (exact): Time ↔ executionTime ↔ ExecutionTime(dateTime); User Name ↔ userName ↔ UserName(text); Service ↔ serviceName ↔ ServiceName(text); Action ↔ methodName ↔ MethodName(text); Duration(ms) ↔ executionDuration ↔ ExecutionDuration(number); IP Address ↔ clientIpAddress ↔ ClientIpAddress(text); Client ↔ clientName ↔ ClientName(text); Browser ↔ browserInfo ↔ BrowserInfo(text). Id identity only. View action first, no statusIcon. Detail adds Parameters and ExceptionMessage only. No Add/Update/Select/export-specific DTO. Export same8 columns, all pages, same applied filters/sort/cutoff, click-time translated headers; failure aborts file. No diagnostic export.

## UI and route contract

List root /errorLogs, shared sigma-route-host/list shell/FeatureTitle/FilterPanel(stableLayout)/DataTable(fill). Main filters single two-month typeable range(default current month, required/dateRangeValidator) + optional username **text**, matching screenshot and eliminating unrelated user list fetch. Advanced filters Service and Action supported by persisted columns (reviewer minimal source-backed decision). Reset restores current month, clears text, returns page1. Search applies draft to a separate frozen filter snapshot and resets cutoff/page; Refresh repeats applied filter/sort and starts new cutoff. Paging uses resolveListPaging before writes and switchMap/defer cancellation; same query skips, size-only changes fetch; sorting from sortable column whitelist. List failures clear stale rows/count and offer Retry; no false empty message while failed. Export blocks overlapping UI writes and follows the last applied successful result. Read-only detail controlled by parent, typed id, stale cancellation, loading/error/Retry and Close/X/Escape; no edit/save/mock data/dirty discard.

Compatibility: /errorLogs/details/:id uses list-owned viewer alias (same component); /errorLogs/create redirects to root because no create business exists. Normal row View stays at list URL and preserves paging. Alias close returns root. Existing list URL and root client/environment remain. Guide /UserGuide/administration uses existing menu/reader; add errorLogs topic EN/AR.

## Reference conformance evidence (before implementation)

| Concern | Book | Actual reference/shared symbol | Target decision |
|---|---|---|---|
| Shell/title | UI1/3 | Workshop/Job/list metadata + sigma-list-page/panel/header; shared FeatureTitle | Exact shared shell, no local CSS |
| Filters/date | UI4/17/19 | Job list filterForm/appFilterPanel; FilterPanel/FilterActions/Advanced directives, DatePicker/dateRangeValidator/FieldError | Same public owners; two main fields, two advanced text fields |
| Grid/read/export | UI5/6/8/28 | Job bindListQueries/onLazyLoad/export; DataTableColumn/type, resolveListPaging, fetchAllPages/dataTableExportRows | Same request pattern; operational8-column contract |
| View | UI13/15/22 | EditorDialog public visible/mode/contentPadded/primaryActionVisible; StateMessage | Controlled view-only body with same content fields |
| Tenant/read | BE17/18 | Repository.QueryReport<T>, AuditTrailService count/tie/cutoff, AuditTrailEntry/config | Standalone new error event; no changes to AuditTrail reference |
| Pipeline | BE18 | Program, AccountingConfigurationExceptionMiddleware | Add scoped owner without changing known conflict semantics |

Reference actions classified: View Supported; Search/Reset/Refresh/Excel Supported; Job Create/Edit/Delete/labour/invoice/close/cancel/quality/gate/log/estimate actions Not Applicable (no mutable Job aggregate/domain state in error history). Authorization candidates: diagnostic list/detail/export could later receive administration access policies; current authenticated+tenant boundaries retained, no invented permission system. Migration AddAutomaticErrorLogs required; no schema changes to existing business entities. No domain/accounting calculations or AutoMapper changes.

Implementation clarifications (2026-10-14, same contract): independent writer suppresses ambient TransactionScope enlistment without creating a business transaction. Valid later pages are clamped to the last available filtered page on refresh; overflow/negative input is still rejected. Both preserve the frozen ownership/recovery boundary. Stored duration measures the whole HTTP request; Service/Action are controller/action metadata from the matched endpoint. They do not claim internal business-service timing.

## Owner follow-up freeze — detail clipboard action, 2026-10-20

Owner requests a Copy button in Error Log Details and asks why Bill errors do not appear in the log. Add one explicit local-only footer action through EditorDialog.footerActions/footerActionRequested. It copies the currently loaded ErrorLogDetails read DTO as formatted JSON (including id, saved request context and diagnostics), using installed Angular CDK Clipboard.copy. No request, persistence, log mutation, extra diagnostics or raw hidden data is collected. Disable before details load; announce translated success/failure within the existing dialog hint; reset feedback on identity/load changes. Catch clipboard rejection/failure and keep the viewer open. Existing Close/X/Escape and styles remain shared. English/Arabic keys and existing Error Logs in-app topic are updated.

Source diagnosis: ErrorLogsMiddleware captures authenticated tenant unexpected server exceptions/5xx, excluding ordinary accounting/concurrency conflicts. There is no frontend ErrorHandler-to-ErrorLogs producer or client-log endpoint. Angular compilation/client rendering exceptions therefore do not reach this server logger. Bill requests intentionally suppress the global API dialog and retain inline error owners; this does not disable server middleware capture. No new client logging contract, request endpoint, schema or middleware policy is authorized by the Copy action/question. Blank Bill screen cause remains unproven until its browser runtime error is available; earlier NG8002 was a compiler input-binding error, already corrected.
