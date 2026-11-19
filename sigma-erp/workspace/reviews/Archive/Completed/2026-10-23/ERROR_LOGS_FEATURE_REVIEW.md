| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Error Logs feature review — 2026-10-14

## Owner follow-up — copy details and Bill error visibility, 2026-10-20

Implemented the Frozen clipboard addendum in ERROR_LOGS_FULL_STACK_CONTRACT_FREEZE.md. Existing shared read-only EditorDialog owns one Copy Details footer action; installed CDK17.3.10 Clipboard is root provided, with verified copy(text):boolean. The feature copies only the complete currently loaded read DTO as formatted JSON on explicit user action. Loading/missing/mismatched record guards prevent stale copies; exceptions/false return announce translated failure, success is announced through the existing hint slot with role=status/aria-live, and feedback resets for a new load/record. Shared widths/scroll/Close/X/Escape/RTL/theme remain. No feature stylesheet, dialog alias, new API or server writer is introduced.

Changed frontend files: Administration/ErrorLogs/details/details.component.ts/html; i18n/vocabs/en.ts/ar.ts (three errorLogs keys); UserGuide/content/error-logs-topic.ts under the existing Administration guide/reader/menu. Guide covers Copy JSON and the boundary between browser/compiler errors and server log capture. Scoped source diff reviewed; four TypeScript files and one Angular template parse without syntax errors, all three EN/AR keys resolve, Git diff whitespace checks pass. Source inspection confirms public EditorDialog.footerActions/footerActionRequested and CDK API/root provider. Builds/tests/browser/database/commits remain unrun. Owner acceptance: open a saved log, copy/paste full JSON, retry a denied clipboard action, change record/reload to clear feedback, keyboard/RTL/narrow footer behavior. Suggested commit: feat(error-logs): copy loaded log details from the viewer.

Diagnosis from actual sources: ErrorLogsMiddleware captures authenticated unexpected server exceptions/5xx; expected accounting/concurrency failures are excluded. ErrorLogsController is read-only and has no client-error ingestion endpoint. Angular NG8002 compilation and browser rendering errors do not reach this server capture. Bill API calls use X-Skip-Error-Interceptor for their inline error owners, which does not suppress backend middleware capture. The blank Bill screen's exact runtime cause remains Uncertain without its first browser Console exception; it is not reported fixed by this clipboard addition. No schema/migration/backend/map/accounting changes. No agents used: this is one small local viewer action with sequential source diagnosis. Existing books already own the applicable UI13/24/27 contracts, so no new canonical rule or packet refresh was needed; the eight-packet drift check passed this turn.

The existing screen now consumes an implemented native read-only ErrorLogs API and automatically recorded tenant HTTP failures. Legacy local filtering of an unloaded array is replaced with server filtering/count/paging/sorting; the list loads initially, preserves applied search state, recovers from failures and exports all matching pages. The owner explicitly selected creating automatic logging in SigmaBackend after the missing producer was reported. Compilation/runtime/database/visual acceptance is pending, and the new table must be migrated before activation.

## Manifest / scope

| Concern | Evidence/decision |
|---|---|
| Request | Review src/app/modules/Administration/ErrorLogs and apply documentation; owner follow-up: create automatic SigmaBackend error logging; continuation: complete work |
| Scope | Existing ErrorLogs feature, new backend ErrorLogEntry/config/DTO/read service/controller/capture middleware/writer, Program/context integration, directly touched translations, Administration guide |
| Plan and freeze | ERROR_LOGS_MAINTENANCE_EVOLUTION_PLAN.md and ERROR_LOGS_FULL_STACK_CONTRACT_FREEZE.md, Frozen before implementation |
| Initial tree | Many unrelated Administration changes; scoped initial ErrorLogs list HTML and detail HTML/SCSS icon changes; shared guide/vocab/Program/localization already changed. In-place replacement retains semantic icons/RTL through shared controls; unrelated changes preserved |
| UI / references | Operational read-only list exception; Workshop/Job list shell/request/export owners; shared DataTable, FilterPanel, FeatureTitle, EditorDialog read-only composition |
| Backend shape | Standalone operational append-only event (BE18/AuditTrail precedent), explicit authenticated read service/controller with BE17 QueryReport, no generic CRUD |
| Routes | /errorLogs; historical /errorLogs/details/:id opens the same list-owned viewer; obsolete /errorLogs/create redirects to root; existing lazy route/menu retained |
| API | GET errorLogs with ListSmBase-derived filters/paging/snapshot; GET errorLogs/GetById/{id:int}; typed Results/Result |
| Authentication | Existing root HttpClient/auth interceptor and AuthGuard; backend Authorize + tenant QueryReport; no fabricated authorization API |
| Phases | PLAN00 and PHASE00/01/02/03(view read only)/05/06 applied; PHASE04 skipped: no business transition; detail write/delete/numbering/upload/accounting not applicable |
| Exclusions | No historical backfill, retention/deletion, mutable logs, background/global capture, request bodies/values, role policy, migrations/snapshot edits, builds/tests/lint/browser/database/commit/push/deploy |

## Screenshot evidence E1 — ErrorLogs.png

File: C:/Users/user/Desktop/ErrorLogs.png, 1720×455, English/LTR desktop list; empty captured rows. Role, capture date and product version Unknown. Screenshot is content evidence; approved books/shared owners govern presentation.

| Evidence | Classification | Final behavior / phase |
|---|---|---|
| Error logs title | Explicit | FeatureTitle inside list panel, translated; Phase2 |
| Date Range and displayed historical range | Explicit field/value, unknown default rule | Shared typeable two-month picker; current-month default per UI17, inclusive UTC days; Phase1/2 |
| User Name text box | Explicit | Optional text substring filter, removes unrelated ID-based dropdown lookup; Phase1/2 |
| Show advanced filters disclosure | Explicit action; contents Uncertain | Shared More filters; reviewer minimal decision uses persisted Service/Action fields. No claim of unseen screenshot contents; Phase1/2 |
| Time, User Name, Service, Action, Duration, IP Address, Client, Browser | Explicit8 columns | Same order and typed bindings in DataTable and ListVM; UTC/ms units clarified; Phase1/2 |
| Export to Excel / Refresh | Explicit | Complete applied result export with shared cutoff; Refresh uses applied filters and new cutoff; Phase2 |
| Pager/page-size control | Explicit | Real server totals; default15 per shared owner, choices10/15/20/50/100; Phase2 |
| Blank icon/selection strips and small sort markers | Uncertain intent | No invented selection/status/business actions; confirmed backend whitelist enables sorting; Phase1/2 |
| Details | Existing frontend source evidence, screenshot silent | Read-only View first in Actions, shared modal, no Edit/Save; Phase3 |

No unresolved material Missing/Conflicting contract remains. Unknown screenshot metadata and undisclosed original advanced contents are nonblocking and explicitly not inferred as requirements. Missing producer was resolved by the owner's new-logging instruction; client-name and impersonation sources remain unavailable: Client is retained empty, unsupported impersonation annotation/model removed rather than fabricated.

## Decisions / final contracts

| Master4 concern | Decision and evidence |
|---|---|
| Shape/reference/editor/routes | Operational read-only exception, shared Job list + EditorDialog; single controlled viewer, deep-link alias retained, no editable aggregate |
| Grid/ListVM | Grid field list beside VM below; Id only extra property; removed unused statusIcon, unsupported isImpersonated; Parameters/ExceptionMessage detail-only |
| Filter/paging | Required valid ordered date pair; optional trimmed text. UTC upper bound next day exclusive. Case-insensitive private dictionary; count before page; size15/clamp10..100; deterministic field + Id ties; snapshot ID cutoff. Reject invalid sort/dates/negative snapshot/overflow; clamp a valid later page after result shrinks |
| Shared styling | sigma-route-host/list shell, FeatureTitle inset8px, FilterPanel stable layout/34px controls, DataTable fill, padded EditorDialog/scroll/FormSection. No feature stylesheets, local colors or repeated filter/pager CSS |
| Failure / refresh | GET inline owner via X-Skip-Error-Interceptor, apiErrorMessage/composedReadErrorMessage; clear stale list, retain applied query, Retry; every loader finalized on failure/cancel/destroy; no duplicate toasts |
| Service/provider | Root ErrorLogsService extends BaseService, environment.baseUrl and existing root client; service renamed consistently in its only consumers |
| Entity / duplicate / FK / delete | Standalone ErrorLogEntry, append-only; no EntityBase audit/flags or source FK; no duplicate business key or delete API. Sealed EF config assembly-discovered + explicit DbSet |
| Persistence/capture | Middleware after existing accounting owner and before auth: downstream authentication supplies principal. Capture unexpected exceptions/explicit5xx once for positive tenant; skip known domain/conflict exceptions, aborted requests and own reader. Writer singleton uses fresh async DI scope/context, ambient transaction suppression,3s cancellation and one implicit EF save; failures log safe type only |
| Diagnostics | Store bounded actor/controller/action/IP/User-Agent, UTC start time and elapsed HTTP milliseconds. Method/route-template/status/trace only; exception type and up to30 method frames, bounded8000, without raw Message/ToString/path/SQL/body/query/credentials. Unexpected unstarted response becomes localized500 Result; started response propagates original failure |
| Mapping / calculation | Explicit projections; no AutoMapper profile/ReverseMap/Ignore. Stopwatch authoritative duration; no frontend/domain/accounting formula or calculated write payload |
| Confirm/discard/write/upload | Not applicable: view/search/export only, no mutation or editable draft |
| Authorization candidates | Diagnostic list/detail/export may be included in future administration policies; current authenticated + tenant boundary retained. No new policy/access restriction invented |
| Migration | New table/properties/lengths/index require owner Add-Migration AddAutomaticErrorLogs; no existing business schema changed and no migration/snapshot touched |

### Columns ↔ row ↔ ListVM (Actions first; all eight sortable/exported)

| Visible data column | Angular field/type | Backend property |
|---|---|---|
| Time (UTC) | executionTime / dateTime | ExecutionTime |
| User Name | userName / text | UserName |
| Service | serviceName / text | ServiceName |
| Action | methodName / text | MethodName |
| Duration (ms) | executionDuration / number | ExecutionDuration |
| IP Address | clientIpAddress / text | ClientIpAddress |
| Client | clientName / text | ClientName |
| Browser | browserInfo / text | BrowserInfo |
| View identity | id (not a data column) | Id |

ListVM property list: Id, ExecutionTime, UserName, ServiceName, MethodName, ExecutionDuration, ClientIpAddress, ClientName, BrowserInfo. Detail adds only Parameters, ExceptionMessage. Row→VM match is exact; capture-only SubscriptionId is never returned. Client stays null because no trusted producer exists. Service/Action are controller/action metadata; duration is whole HTTP elapsed time, not internal business-service timing.

### Filters

| UI/control | Angular property → serialized key | Backend key/parser | Default / absence |
|---|---|---|---|
| Date Range | dateRange → Filters[fromDate], Filters[toDate] | fromDate,toDate / exact yyyy-MM-dd ordered pair | current month; missing/malformed rejected |
| User Name | userName → Filters[userName] | userName / trimmed substring | empty omitted, all actors |
| Advanced Service | serviceName → Filters[serviceName] | serviceName / trimmed substring | empty omitted |
| Advanced Action | methodName → Filters[methodName] | methodName / trimmed substring | empty omitted |
| Sort | columns-derived sortField/sortOrder → Filters[...] | whitelist8 fields;1/-1 | executionTime descending, Id tie |
| Paging/cutoff | pageNo,pageSize,snapshotId top-level | numeric; nonnegative cutoff |1/15; new tenant max ID when cutoff absent;0 preserved |

No Boolean/enum/multiselect filter exists, so false semantics are not applicable. Serializer preserves zero; empty/null/undefined text is omitted. Draft filters apply only on Search/Reset; paging/export use activeFilters, and Refresh repeats active filters with a new cutoff. The cutoff excludes ordinary later inserts; it is not a claim of database snapshot isolation.

### Reference action inventory and override audit

Job reference View is Supported; target Search/Reset/Refresh/Excel Supported. Create, Edit, Delete, Labour Time, Invoice Customer, Close, Cancel, Quality Check, Gate Pass, Job Logs, Estimation, Lubrication Job and Print Gate Pass are Not Applicable: error history has no mutable job aggregate, document/child collections, inventory/financial effect or transition states. Only View targets a row. No scoped service/controller overrides or AutoMapper mappings exist to justify/remove. No mutation feedback/dirty-close cycle exists.

## Final source conformance / reconciliation

| Concern | Producer/consumer symbols and compared values | Result |
|---|---|---|
| Capture/read/store | ErrorLogsMiddleware→ErrorLogWriter→ErrorLogEntryConfig: field bounds256/256/256/64/256/1024/2048/8000; UTC/time/duration;1 fresh-context save | Source match; runtime persistence pending |
| Tenant | Positive NameIdentifier guard + captured SubscriptionId; QueryReport filtering/AsNoTracking on list/detail; Authorize | Source match; cross-tenant owner check pending |
| Entity/query/grid | ErrorLogEntry→ErrorLogsService projections→ErrorLogListVM→ErrorLog/columns8+Id | Exact source match |
| Filters/count/sort | ErrorLogsFilterVM/private dictionary→QueryReport/CountAsync/Order+Id→ErrorLogResults page/count/cutoff→signals | Exact documented keys/types/defaults; API replay pending |
| Async/pager | ErrorLogsComponent.bindQueries/request/onLazyLoad; switchMap+defer+finalize; resolveListPaging before signal writes | New pages cancel old reads; size-only fetches; same query skips. Source match |
| Excel | ErrorLogsService.getAllList/fetchAllPages(100) + captured cutoff/sort/filters; dataTableExportRows→onExportToExcel | Same8 columns/current language, no partial file on failure; output owner acceptance pending |
| Details | GetById projection→ErrorLogDetails→DetailsComponent; typed id, cancellation/identity, shared View shell/Close/Retry | Exact fields, no edit-only lookups; loading closure cancels on destruction |
| Integration | existing pages/routing.ts and sidebar /errorLogs; local routes aliases; Program registration; DependencyResolver Business interface scan; root BaseService/client | Source match, no HttpClient/provider/token fork; runtime activation pending |
| Shell/filter/table | Job reference sigma-route-host/list classes + FeatureTitle margin8px; FilterPanel stable/public2 columns, field/date shared controls; DataTable fill/paginator | No feature CSS. Exactly1 table/pager, grid rows own scrolling |
| Viewer layout | EditorDialog(contentPadded/view/primaryActionVisible=false); FormSection, sigma-editor-form/scroll with keyboard focus; shared grid2; method lines wrap | Shared header/footer/bounds; body1 scroll owner. Visual/RTL/theme pending |
| Feedback/translations | API skip-error header; both failure channels;27 errorLogs keys EN/AR;7 ErrorLogs backend keys per resx,0 duplicates | Source parity passed; no raw keys/duplicate feedback observed in source |
| User guide | error-logs-topic.ts ERROR_LOGS_TOPIC registered in administration-guide.ts; existing reader /UserGuide/administration and sidebar guide entry | Bilingual purpose/prerequisites/search/advanced/reset/page/sort/view/retry/export/capture/privacy/limits matched to source |
| Scoped diff | Actual frontend/backend roots independently reviewed, including new untracked files; no obsolete ms-lib/any/users lookup/styles; spec import fixed | Source review complete; syntax/whitespace checks described below |

### Responsive / scroll matrix (source evidence, all visual acceptance pending)

| Range | Expected shared arrangement | Inspected owner |
|---|---|---|
| >1250px |2 main/2 advanced tracks; actions wrap; shared title8px inset, fill rows and fixed paginator | FilterPanel public tracks; list shell/FeatureTitle/DataTable |
|1250→721px | shared3-track intermediate grid, two populated fields; narrow disclosure below1200 preserves mounted controls/values | FilterPanel325ff and collapse rules; no feature overrides |
|720px and below |1-track fields, vertically stacked/wrapping toolbar, fixed filters/pager; internal row scroll | Shared FilterPanel/list/DataTable |
|Viewer1099/767/700 boundaries | Shared responsive dialog widths/viewport cap; grid2 then1; fixed header/footer, one keyboard-scrollable body | EditorDialog public breakpoints, sigma-editor-grid and scroll |
|Short heights / long EN-AR values / RTL / themes | Shared bounded list and modal; reserved date feedback; long browser/context/method lines wrap; no local colors/pixel offsets | Shared CSS cascade and final template; owner acceptance remains pending |

## Files changed by this task

Frontend repository:

- Administration/ErrorLogs: list/list.component.ts/html, corrected existing list.component.spec.ts import; details/details.component.ts/html; errorLogs.routes.ts; models/list.ts/details.ts; service/errorLogs.service.ts; retired unused list/details SCSS.
- UserGuide/content/error-logs-topic.ts (new), administration-guide.ts (import/topic only).
- i18n/vocabs/en.ts and ar.ts (errorLogs block only).

Backend repository:

- Helpers/Models/Administrations/ErrorLogEntry.cs (new); DataAccess/Configuration/ErrorLogEntryConfig.cs (new); DataAccess/SiGmaDbContext.cs (DbSet only).
- ViewModels/ViewModels/ErrorLogs/{ErrorLogListVM,ErrorLogDetailVM,ErrorLogResults,ErrorLogsFilterVM}.cs (new).
- Business/IServices/IErrorLogsService.cs and Services/ErrorLogsService.cs (new).
- ServerAPI/Controller/ErrorLogsController.cs, Middleware/ErrorLogsMiddleware.cs, Services/ErrorLogWriter.cs (new); Program.cs (writer registration + middleware only).
- Helpers/Localization/Shared/GeneralMessage.resx and GeneralMessage.ar-SA.resx (seven new keys only).

Authority/artifacts: this review, Frozen plan/freeze; BE18 automatic-HTTP-history section, BE0 version0.81/history row; sigma-screen-refactor §8 and §11 row. Regenerated all8 packets through generator after canonical changes; no generated file edited directly. Existing unrelated changes in shared files/books were retained.

## Source verification and owner handoff

Source checks: both actual Git roots identified; complete scoped feature diff and own shared-file hunks reviewed separately, new backend/frontend files read; stale symbols/imports/routes/standalone shared exports and public inputs inspected; merge/whitespace scan; EN/AR parity27/27, no missing/case-drift keys; backend XML parses,7/7 keys with0 duplicates. Installed ASP.NET ref declarations confirm WriteAsJsonAsync cancellation overload, PathString comparison and UserAgent. Parser-only check covers10 TypeScript files and2 Angular templates with0 final diagnostics (one missing class closing brace was repaired before final review). These are syntax/source checks, **not** type checking, application compilation or runtime success.

Shared-extraction result: existing presentation/date/query/paging/error/export owners reused; no new duplicate UI helpers. New cross-cutting HTTP capture belongs to its single middleware/writer owner. Verified reusable independent-save/diagnostic guidance promoted together to BE18 and skill with revision row; packet fingerprints refreshed and semantic reference roles reviewed. All8 recipe checks passed after refresh. Full background logging/retention/access policy remains outside this request.

Agent utilization: one bounded sol_backend_worker using gpt-5.6-sol was attempted after freeze for independent backend files while root implemented frontend, to reduce wall time under Sigma's delegation gate. It failed immediately with a model usage-limit response and produced no files. Root performed and integrated the complete backend/source audit; no overlapping edits or further agents.

Owner actions:

1. Generate/review/apply **Add-Migration AddAutomaticErrorLogs** for the new ErrorLogEntry table, its property bounds and tenant/time/Id index **before activating the new pipeline**. Suggested name search found no existing migration with that name. Review migration composition alongside other uncommitted schema work; this task generated none.
2. Build frontend/backend and run appropriate owner tests. Exercise protected list/detail, unauthorized and cross-tenant IDs; inclusive same-day dates, invalid ranges/sort/cutoff/paging, clear user/service/action text and page-size change.
3. Exercise an unexpected exception and an explicit5xx in an authenticated tenant request: one safe record, no secrets, safe500 before response start; known accounting/duplicate/concurrency failures and canceled requests produce no record. Verify started-response propagation, independent rollback/ambient suppression and3s store-failure recovery. ErrorLogs reads must not recursively create logs.
4. Search/Refresh with unapplied text changes, rapid page/sort changes, more than100 matching rows and new errors during paging/export. Compare exported count/order/UTC date/ms values with applied result; fail a later export page and verify no file.
5. Open row and legacy detail link, retry failures, close during loading, Escape/focus return. Check EN/AR, RTL, light/dark, narrow/intermediate/short-height matrices, calendar overlay and keyboard scrolling with fixed paginator/dialog footer.
6. Read/print the Error Logs topic in /UserGuide/administration and confirm its operational limits match deployment.

Suggested commits (suggestions only): frontend `refactor(error-logs): adopt shared list and read-only diagnostics viewer`; backend `feat(error-logs): capture tenant HTTP failures and expose paged reads`. No builds, tests, lint, database commands, migrations/snapshots, browser automation, commits/pushes or deployment were performed.

Residual risks: owner compilation is required for framework/DI/EF translation and Angular template types; configured DbContext connection target and SQL migration must be verified by owner using existing project configuration. Capture is bounded/best effort and may omit events if the database is unavailable. No historical events or background failures are promised. These are pending acceptance/coverage limits, not unresolved implemented contracts.
