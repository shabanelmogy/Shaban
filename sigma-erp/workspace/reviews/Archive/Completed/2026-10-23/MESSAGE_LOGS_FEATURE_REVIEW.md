| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Message Logs review and implementation — 2026-10-14

User request: «راجع : src\app\modules\Administration\messageLogs وطبق التعديلات طبقا للوثائق». Follow-up: «فى قاعدة فى الوثائق انك تضيف اى فرونت او باك ناقص». The user then requested continuation. Missing parts were completed under the explicit clarification and Master2 standing reviewer decision, without asking for another approval.

## Manifest and boundaries

Frontend repository: F:/My Work/Sigma/SiGmaAngularFrontEnd. Backend repository: F:/My Work/Sigma/SigmaBackend. Documentation repository: F:/My Work/Shaban Documents/Shaban. Review/skill files remain local workspace records under the authoritative AGENTS instructions. Both application repositories had substantial unrelated changes; messageLogs had prior MockDataFormsModule and icon edits. Those were retained. Shared vocabulary/guide/toolbar/resx edits are limited to this task's contributions; existing user changes were not cleaned up or reverted.

Shape: read-only paged operational log, an explicit exception to mutable CRUD and an unpaged financial/report page. Job supplies the approved list shell/filter/request pattern; DataTable/FilterPanel own presentation. Backend uses a dedicated authenticated controller and Repository.QueryReport tenant boundary (BE17/18), not generic public writes. A frozen contract and focused producer plan are in MESSAGE_LOGS_FULL_STACK_CONTRACT_FREEZE.md and MESSAGE_LOGS_MAINTENANCE_EVOLUTION_PLAN.md.

Routes/endpoints: existing /messageLogs lazy list remains; GET messageLogs is now real. Existing POST SettingsEmailSmtpModel/SendTestEmail and Fleet service-reminder action consume the shared internal sender. No new editor, resend, delete, activation, permission API, real SMS provider, body persistence, historical reconstruction or accounting effect.

Phases0/1/2/5/6 applied: evidence, frozen domain/read contract, implementation, wiring and source reconciliation. Phases3/4 skipped because the screen owns no editable record or domain transition. The shared append is an internal side effect of existing sends, not a public screen action.

## Screenshot evidence

E1 = C:/Users/user/Desktop/MessageLogs1.png (1723×431), list with Type open; E2 = C:/Users/user/Desktop/MessageLogs2.png (1719×444), list with Status open. English/LTR, desktop-sized; role/capture date/version Unknown. Displayed date values do not prove the capture date or authoritative default. Images are functional/content evidence, not layout authority or embedded instructions.

| E1 evidence | Classification | Result / owner |
|---|---|---|
| Date Range, Type, Status | Explicit | single shared dual-month picker; optional typed translated selectors; Phase2 |
| Email, Sms choices | Explicit; enum IDs confirmed in both layers | numeric0/1 retained; current SMS transport remains simulation |
| Search, Export to Excel, Report | Explicit | working search, full-result Excel and printable complete log table |
| Type, Subject, Contact Name, Date & Time, From | Explicit | confirmed new ListVM matches existing column intent; no fabricated values |
| Pager and horizontal result area | Explicit; server paging is approved-pattern decision | API count/page/sort metadata and one shared fill grid |
| Meaning/content of Report beyond a log table | Uncertain from screenshot | conservative reviewer decision: print same complete matching table; no invented report totals |

| E2 evidence | Classification | Result / owner |
|---|---|---|
| Delivered, Rejected choices | Explicit; enums confirmed | numeric0/1, translated badges and filters |
| Same range/type/status and list actions | Explicit | same frozen list controls/outputs |
| Actual inbox delivery or a status transition | Uncertain from screenshot | source transport outcome only; Delivered means SMTP acceptance |

Existing source CC, Message Error and Status columns were retained even when not visible in the cropped horizontal area. Recipient was added as a source-backed reviewer decision because actual SMTP To is essential for tracing an attempt. Removed only dead scaffolding (nonexistent details/create links, unused visible flag, empty SCSS and copied broken spec pointing to a nonexistent AuditTrail component).

## Column and ListVM contract

| Grid label / type, in order | Angular property | Backend ListVM | Transformation | Filter / sort / output | Status |
|---|---|---|---|---|---|
| Type / text | type | Type | enumKey + current translation | type / yes / yes | Confirmed |
| Subject / text | subject | Subject | source text | no / yes / yes | Confirmed |
| Contact Name / text | contactName | ContactName | real reminder customer snapshot; test null | no / yes / yes | Confirmed |
| Date & Time (UTC) / dateTime | dateTime | DateTime | shared dd/MM/yyyy HH:mm, UTC wall clock | fromDate+toDate / yes / yes | Confirmed |
| From / text | from | From | actual normalized SMTP address | no / yes / yes | Confirmed |
| Recipient / text | to | To | actual normalized SMTP address | no / yes / yes | Confirmed |
| CC / text | cc | Cc | null for current senders | no / yes / yes | Confirmed read field; no CC sending claim |
| Message Error / text | messageError | MessageError | safe stored translation key, current language | no / yes / yes | Confirmed |
| Status / status | status | Status | translated success/danger badge | status / yes / yes | Confirmed |
| Minimum identity | id | Id | row key only | none | Confirmed |

Grid: type, subject, contactName, dateTime, from, to, cc, messageError, status. ListVM: Id plus Type, Subject, ContactName, DateTime, From, To, Cc, MessageError, Status. No tenant/audit/plumbing, body, password or editor-only data. No Actions column because no row actions exist. Sort uses this exact whitelist and Id ties. Excel uses dataTableExportRows with the same columns; Report uses the same full rows. MessageError sorts by its stored key, as frozen, not a translated client label.

## Filter, pagination and snapshot contract

| Control | Form value | Serialized key / backend lookup | Parser / default |
|---|---|---|---|
| Date range | Date[] or complete typed string or null | Filters[fromDate], Filters[toDate] | shared parseDateRange → ISO yyyy-MM-dd; currentMonthRange default; empty unbounded |
| Type | MessageTypeEnum or null | Filters[type] | strict defined numeric enum; null all; Email0 survives |
| Status | MessageStatusEnum or null | Filters[status] | strict defined numeric enum; null all; Delivered0 survives |
| Sort | confirmed column and1/-1 | Filters[sortField], Filters[sortOrder] | exact nine-field whitelist; default dateTime descending |
| Pager | positive page/size | pageNo, pageSize | default15, clamp10–100; overflow guarded; count before slicing |
| Result cutoff | number or null | snapshotId | first query gets tenant maxId; later page/sort/output reuse it; Search/Reset/Refresh renew |

Backend normalizes dictionary casing after MVC binding without replacing the bound dictionary in its setter. Strict supplied malformed dates/enums/sort/paging return localized failed result/HTTP400 rather than silently broadening the query. Equal dates allowed; inclusive upper day uses next-day-exclusive bound with December9999 guard. Server independently supports missing lower/upper dates; the UI offers a complete range or no range. Empty strings/null are omitted by shared serializer; zero is retained. False/multiselect are not feature inputs. `totalCount` is CountAsync over the same filtered cutoff; frontend never substitutes page length. Cutoff is not database snapshot isolation for concurrent transactions.

Applied filter snapshot is separate from the draft form. Lazy events resolve against previous page/size; size-only changes fetch; unchanged events do not. switchMap/defer/finalize prevents older request responses from winning. Full output fetches every100-row page, aborts on any failure, and never outputs a partial file/table. Print session owns one render frame, no pager/scroll bounds while printing, restoration and destroy cleanup. Source-only audit found no stale types/imports/route users.

## Writer and persistence decisions

MessageLog is an append-only plain event (not EntityBase with public CRUD/audit/active flags); SubscriptionId comes only from Repository's authenticated server context. Shared sender validates the fresh isolated scope's tenant. Config scans sealed MessageLogConfig and creates table/index without modifying DbContext/Program. Nonunique tenant/time/Id index supports real repeated attempts. Required From/To max320 and Subject998; optional ContactName256, Cc2000 and MessageError512. Required subject and actual addresses are validated before SMTP; optional contact-name display snapshot alone may be truncated to256. Cc remains null because EmailHelper has no CC input.

Both live producers use IMessageDeliveryService/MessageDeliveryService with typed internal request/outcome. SMTP test supplies its real configured sender and test recipient, no contact name. Fleet reminder selection/deduplication/subject/body and first-failed-attempt stop remain intact; it supplies the actual CustomerName. Security email code is commented; LeaseCustomerSms is simulation. No simulated Delivered or guessed contact/CC/history.

Each actual transport attempt produces Email/Delivered for SMTP acceptance or Email/Rejected for failed acceptance. Persist UTC attempt time, stable safe `messageLogs.errors.deliveryRejected` key and actual normalized addresses/subject; never message body, password or provider exception text. Check cancellation before a new attempt; after starting the irreversible send, complete outcome append independently of request cancellation. A fresh scoped UnitOfWork/DbContext saves just the event, not the caller's pending aggregate. No explicit transaction around SMTP or the single EF save; external SMTP and SQL cannot be atomically committed.

MessageDeliveryOutcome separates Attempted, Accepted and LogSaved. Invalid inputs/settings do not create an attempt event. Accepted+log failure stays accepted and returns clear safe feedback; never resend/reclassify. Rejected+log failure is also disclosed. Fleet partial failures report earlier accepted count and any prior log gaps. Append errors are internally logged. No user-visible raw infrastructure diagnostics. Standard send-response success/failure feedback stays interceptor-owned; list/output use one inline owner with X-Skip-Error-Interceptor. No extra toast/dialog duplicates.

AutoMapper: direct lean projection, no new mappings/Ignore/ReverseMap. Domain calculations: none; result status derived by authoritative transport. Override audit: no new service/controller overrides; Settings generic CRUD remains inherited. Detail/Add/Update/Select/delete/dirty-discard contracts: Not Applicable to the log screen. AuthGuard plus backend [Authorize]/tenant query remain; no invented permission or new access restriction. Authorization candidates for future policy: message read/export and existing send endpoints; no policy introduced.

Reference action classification: Job Search/paging/sort/Excel supported; Refresh/Reset supported via shared list owners; Job Create/View/Edit/Delete/Cancel/Close/LabourTime/InvoiceCustomer/QualityCheck/Log/Estimation/GatePass/LubricationJob are Not Applicable because there is no editable Job/document/movement aggregate. Screenshot Report supported via existing shared print session.

## Final conformance and reconciliation

| Concern | Book/reference / shared producer | Actual target consumer and compared behavior | Final source result |
|---|---|---|---|
| Bounded shell/title | UI1/3; Job host; src/styles.scss sigma-list-*; FeatureTitle | MessageLogsComponent host sigma-route-host; shared page/panel/header; title/filter/table8px logical inset; toolbar showPageTitle excludes /messageLogs | Matched in source; visual pending |
| Filters | UI4; Job FilterPanel/FilterActions | form uses mainColumns3, stableLayout=true, busy/resetRequested; three sigma-filter-field labels; shared34px/theme/collapse/wrap owners | Matched; no feature CSS |
| Dates/options | UI16/17/19; Job DatePicker/FieldError/TranslateOptions | single range/numberOfMonths2; DatePicker defaults typeable keepInvalid; dateRangeValidator/reserved date message; options id0/1 from actual enums | Matched; input/keyboard acceptance pending |
| Grid | UI5/6; DataTableComponent | fill=true, server total, DEFAULT_PAGE_SIZE15, translated page report, typed nine columns; no row activation/selection/dead link | Matched; scroll/visual pending |
| Requests | UI2/28; Job bindListQueries; list-query helpers | MessageLogsService toListParams/fetchAllPages; switchMap/defer/catchError/finalize/takeUntilDestroyed; appliedFilters/snapshotId | Matched; delayed-request acceptance pending |
| Outputs | UI8/21; dataTableExportRows/ReportPrintService | prepareOutput full snapshot rows; createSession; !printing pager/scrollable; sigma-print-flow on bounds; no-print filters/errors | Matched; browser/Excel acceptance pending |
| Backend read | BE7/9/17/18; QueryReport/ListSmBase | MessageLogService lean projection, tenant cutoff/filter/count/page/sort, strict values, explicit wrapper; MessageLogsController authenticated GET | Matched; migration/API/tenant acceptance pending |
| Real writers | BE18; shared delivery/EmailHelper boundary | SMTP test and Fleet use typed shared sender; stable error key, isolated append, no resend/reclassification; actual From/To | Matched; SMTP/failure/cancellation acceptance pending |
| Error/theme/RTL/accessibility | UI22–28; StateMessage/PrimaryActionButton/global owners | both failure channels handled; inline one owner; standalone imports/input types inspected; labels/inputId/body overlays/decorative icons | Matched in source; visual/keyboard pending |
| User guide | Master7; existing UserGuide reader | MESSAGE_LOGS_TOPIC imported into ADMINISTRATION_GUIDE; /messageLogs topics follow actual actions/outcomes; existing /UserGuide/administration menu | Matched EN/AR source; reader/print acceptance pending |

Responsive source matrix: desktop≥1250;1250±1 shared filter3-column boundary;1200±1 initially expanded collapse;720±1 one-field-column/action wrapping;650±1 shared title wrapping; intermediate1024/900/768 and narrow375/320 with long values/EN/AR and both themes. Target introduces no geometry/palette/PrimeNG override; shared bounds and labels traced. Short-height fit, overlays, actual control alignment and no-page-scroll remain owner visual checks, not certified by source.

Shared-extraction result: reused all existing frontend owners; new shared MessageDeliveryService removes duplicated SMTP/log logic in two real producers. Exact contract and verified reusable guidance recorded in BE18, skill§8/revision and CHANGELOG; backend book0.80. No new unrelated abstraction. Generator refreshed PLAN00 and PHASE00–06; semantic review found only backend0/18 fingerprint updates, existing reference roles/templates unchanged. Final -Check passed all8. Prior Audit Trail book/skill/changelog contributions were retained.

## Files changed by this task

Frontend:
- src/app/modules/Administration/messageLogs/list/list.component.ts and .html; removed empty .scss and broken copied .spec.ts.
- src/app/modules/Administration/messageLogs/models/list.ts (new).
- src/app/modules/Administration/messageLogs/service/messageLogs.service.ts and messageLogs.routes.ts.
- src/app/_metronic/layout/components/toolbar/toolbar.component.ts (/messageLogs title suppression only).
- src/app/modules/i18n/vocabs/en.ts and ar.ts (messageLogs block only).
- src/app/modules/UserGuide/content/message-logs-topic.ts (new) and administration-guide.ts (import/topic insertion only).

Backend:
- SiGma.Helpers/Models/Administrations/MessageLog.cs and SiGma.DataAccess/Configuration/MessageLogConfig.cs (new).
- SiGma.ViewModels/ViewModels/MessageLog/{MessageLogListVM,MessageLogFilterVM,MessageLogResults}.cs (new).
- SiGma.Helpers/Dtos/MessageDelivery/{MessageDeliveryRequest,MessageDeliveryOutcome}.cs (new).
- SiGma.Business/IServices/{IMessageLogService,IMessageDeliveryService}.cs and Services/{MessageLogService,MessageDeliveryService}.cs (new).
- SiGma.ServerAPI/Controller/MessageLogsController.cs (new).
- SiGma.Business/Services/AdministrationsServices/SettingsEmailSmtpModelService.cs, IServices/ISettingsEmailSmtpModelService.cs, SiGma.ServerAPI/Controller/SettingsEmailSmtpModelController.cs (send-only integration/cancellation).
- SiGma.Business/Services/FleetAlertsService.cs (constructor + existing SendServiceRemindersAsync only).
- SiGma.Helpers/Localization/Shared/GeneralMessage.resx and GeneralMessage.ar-SA.resx (24 scoped message-log/SMTP/reminder keys; unrelated entries preserved).

Documentation: sigma-erp/backend/00-preamble.md, backend/18-edge-cases.md, CHANGELOG.md, generator-owned affected packets; workspace .agents/skills/sigma-screen-refactor/SKILL.md and this review/contract/plan.

## Verification and handoff

Source-only evidence: complete feature diff and backend producer diffs reviewed separately in the actual repositories; new untracked files inspected as complete source. Task-contributed vocabulary/guide/toolbar/resource hunks reviewed alongside existing dirty changes. git diff --check clean for scoped tracked files; no merge markers/stale legacy table/native date/untyped feature payload. TS source/local import paths and Angular17 template parser returned0 findings for7 scoped TS files plus template; this is not type checking or compilation. Standalone used exports/metadata and input contracts were inspected separately. MessageLogs translations:22 EN/22 AR leaves,0 missing/case-only keys. Backend XML parsed and24 scoped keys match EN/AR without duplicates. Symbol-targeted consumer checks confirm renamed frontend classes only in own route/service/list; SMTP interface/controller remain compatible; both live send calls flow through shared sender. Root AppModule provides the one token/error-interceptor client; no feature/ LayoutModule client or service provider was introduced. No known unresolved required contract blocks source handoff; real SMS delivery/CC receipt are outside present source capability and explicitly unpromised.

Schema: **owner must run Add-Migration AddMessageLogs** and review/apply it before using the log screen. Suggested name is unused in existing migration classes. New MessageLog table with required fields, lengths and tenant/time/id index; no existing table/column/data rewritten or removed. Old history remains absent. No migrations/snapshots were created, edited or run. If append is used before the table exists, caller reports logging unavailable and must not repeat accepted email merely to populate history.

Owner checks:
1. Build both repositories and start backend; verify scanned service/config resolution after applying the reviewed migration.
2. Under two tenant accounts confirm list/export isolation; query empty and multiple pages; exercise Email0/Delivered0, Sms1/Rejected1, invalid/reversed/equal dates, sort/page/size bounds and last-day inclusion.
3. Send an SMTP test to a controlled recipient; exercise actual acceptance/rejection and unavailable log storage. Verify single feedback, real UTC/time/From/To/status and no resend on log failure.
4. Exercise a controlled Fleet multi-recipient reminder batch with failure after one accepted attempt; verify per-attempt log/contact and accepted-count feedback. Cancel before a subsequent attempt; already attempted results should remain recorded.
5. With>100 results verify Excel and Report include every applied-snapshot row; late-page failure produces no partial output. Change unsent filters, page rapidly, add new attempts, Refresh, cancel print and verify old pager/form restoration.
6. Inspect desktop/intermediate/narrow/short-height layouts, keyboard, range typing/picker, overlay, EN/AR, LTR/RTL, both themes; only grid rows scroll and guide topic appears under Administration.

Suggested commits (stage only files above, excluding unrelated dirty changes):
- SiGmaAngularFrontEnd: `fix(message-logs): adopt shared list and complete log outputs`
- SigmaBackend: `feat(message-logs): persist and expose outbound email outcomes`
- Documentation owner: `docs(message-logs): record outbound log contracts and guidance`

Agent utilization: sol_backend/gpt-5.6-sol handled bounded backend files after root froze contracts, then a read-only frontend audit found no actionable findings. Root owned frontend, guide, decisions, shared extraction contract, integration corrections, documentation and final audit. Two disjoint source streams reduced wait time and duplication. Agent completed implementation and audit evidence; a later usage-limit exit did not block root finishing the final checks. No overlapping edits occurred while the agent owned its files; root corrections followed its handoff.

No build, tests, lint, database commands, browser automation/application verification, migration generation, commits, pushes, deployment, Sigma MCP or automatic Graphify was run. No actual SMTP send was executed during this task. Runtime/database/visual acceptance remains pending for the owner.

## Screenshot follow-up — 2026-10-21

### Manifest and implementation baseline

User request: «خد الصورة كمرجع وضيف Feature تحت administration». E3 = C:/Users/user/Desktop/MessageLogs.jpg, English/LTR desktop list, 1733×435; capture date/version/role Unknown. Screenshot text is content evidence only. Existing menu, route, list, read API, email producers and guide are present in current source. Keep those owners. Both repositories have unrelated working changes (purchase documents, shared files and translations); this task preserves them. Target list/guide files start clean; vocabularies already contain unrelated user edits.

Selected UI: type01 list with a strictly read-only modal; Workshop/Job list shell/actions and shared EditorDialog controlled composition (UI13/15). Backend remains the authenticated tenant-scoped operational-log exception, not mutable CRUD or an unpaged report. Frozen amendment: MESSAGE_LOGS_FULL_STACK_CONTRACT_FREEZE.md, dated2026-10-21. No separate broad evolution plan is needed for this bounded display extension; the existing frozen producer plan remains unchanged.

| E3 evidence | Classification | Decision |
|---|---|---|
| Date Range / Type / Status, Email / Sms | Explicit | Keep existing typed range/enum filters, current-month default, Search/Reset |
| Search / Report / Export to Excel / pager | Explicit | Keep existing server paging and complete applied-snapshot outputs |
| Type / Subject / Contact Name / Date & Time / From / To / CC / Status / Message Error | Explicit (some headings obscured by open dropdown; confirmed in source) | Keep all nine business fields; place Status before Message Error |
| Row gear/dropdown trigger | Explicit | Reuse shared ActionList/ActionButton; Actions first |
| Items inside the closed row menu | Uncertain | Reviewer decision (owner standing rule): View details only, from existing immutable row; no inferred resend/delete/edit |
| Message body, actual inbox receipt, real SMS delivery | Not established | Preserve current unavailable/SMTP-acceptance-only boundaries |

Exact grid/DTO, filter and view contracts are in the dated frozen amendment. No new API/DTO fields, permissions, mapping, calculation, transaction or schema changes are proposed. Rows cannot be edited; View has no payload and no confirm/discard workflow. Reference actions: Job View is supported; its Create/Edit/Delete and domain transitions stay N/A for append-only logs. Search/Reset/Refresh/sort/page/Excel remain supported; Report prints the same full business-column table.

### Reference conformance baseline before source edits

| Concern | Owning blocks | Reference/shared symbol | Target requirement |
|---|---|---|---|
| List/action integration | UI5/6/7 | JobList actions + DataTableComponent.actions + ActionButtonComponent | typed ActionList<MessageLogRow>; automatic first Actions column; busy guard |
| Viewer shell | UI13/15/27 | EditorDialogComponent TS/HTML/SCSS | mode=view, primaryActionVisible=false, controlled close/X/Escape, padded body, separate ID subtitle |
| View fields/long content | UI1/13/15 | styles.scss sigma-editor-scroll/grid/field; data-table.format dataTableCellText | read-only controls, two-column shared grid, one internal scroll owner, same nine formatted fields |
| Outputs | UI5/8/21 | dataTableExportRows + ReportPrintService + current MessageLogsComponent.prepareOutput | revised columns shared by grid/Excel/print; no action in file or printed table |
| Integration/help | UI23; Master7 | root MessageLogsService, existing routing/sidebar, MESSAGE_LOGS_TOPIC | same route/menu/provider/HTTP contract; bilingual View/ID/read-only guidance |

Recipe drift check passed all8 packets. Applied packets: Phase00/01/02/03/05/06; PLAN00 consulted for extension scope. No generated/template/book/skill changes are needed: this consumes existing canonical owners, introduces no reusable rule or shared component. No subagents: one small sequential list/view/guide workstream; delegation overhead would exceed benefit.

### Implemented — source-only; owner verification pending: yes

| Contract/path | Final producer → consumer evidence | Result |
|---|---|---|
| Columns/ListVM | MessageLogsComponent.columns = type, subject, contactName, dateTime, from, to, cc, status, messageError; MessageLogListVM = Id + Type, Subject, ContactName, DateTime, From, To, Cc, MessageError, Status | All nine fields still match, only display order changes. Shared Actions column precedes them; identity id remains the target |
| Row action | typed actions[0] general.viewDetails → openDetails(row) → copied detailRow; busy/existing-view guards | Read-only view of append-only snapshot; no new endpoint or request; no missing backend field |
| Viewer | app-editor-dialog mode=view, primaryActionVisible=false, contentPadded=true, width800px, default viewport bounds; translated title and recordSubtitle(id); detailText → existing dataTableCellText | Same nine values/UTC/translated enums/error as grid and export; no Save/Edit or writable control; long fields use readonly textareas |
| Closing/focus | Close/X/Escape → closeDetails; native opener captured before opening; destruction-bound timer(0) restores connected visible trigger after DropdownPortal restores its menu | No query/form/page changes, no refresh request. PrimeNG owns trap/initial focus; feature owns close focus edge. Actual keyboard/focus behavior remains owner acceptance |
| Outputs | prepareOutput still fetches every applied-snapshot page; Excel uses same columns; printing supplies actions=[]; viewer dialogClass includes no-print | No Actions column or viewer in output; Status precedes Message Error everywhere |
| Filters/API/paging/errors | Existing filterForm → toListParams → MessageLogService strict keys/count/cutoff/sort; switchMap/finalize; inline declared/HTTP failure owners | Unchanged source contract. No regression-oriented backend rewrite or send execution |
| Routing/providers | pages/routing.ts → messageLogs_Routes → MessageLogsComponent; existing sidebar Administration link /messageLogs; root MessageLogsService | Existing route/menu reused, no duplicate or additional provider/client/runtime entry |
| Translation | general.viewDetails/close already exist; two new messageLogs leaves per vocabulary: recordSubtitle/readOnlyHint | Matching EN/AR keys/casing; source parser checked27 literal references and32 matching feature paths including object groups |
| Guide | MESSAGE_LOGS_TOPIC in content/message-logs-topic.ts remains registered in administration-guide.ts; module route/menu /UserGuide/administration | EN/AR steps now cover all nine fields, Actions→View Details, long-value copying, read-only scope, Close/X/Escape and retained paging/filter state; existing purpose/prerequisites/search/output/SMTP and SMS limits preserved |

Responsive source matrix: viewer uses shared800px width and shell breakpoints1099px/767px with default viewport max bounds; shared grid uses2 tracks and becomes1 at700px. Reviewed narrow320/375,700±1,767±1, intermediate900/1024,1099±1 and desktop intervals through source rules. Existing list/filter boundaries1250/1200/720 and title650 remain shared-owned. Native readonly inputs/textarea use global theme tokens and dir=auto; no feature CSS/viewport arithmetic/deep override added. Auto-height body uses sigma-editor-scroll + flex-fill as its single scroll region; title/footer stay shell-owned. Long values, short height, real overlays, focus restoration, themes and RTL still require owner visual/runtime checks.

Source verification: reviewed the complete list TS/HTML and guide diffs, and both vocabulary Message Logs hunks; unrelated purchase/bill/import/error-log edits in those vocabularies were retained. Separately inspected the scoped backend diff (empty) in its actual repository and reconciled the unchanged ListVM/read service/controller. TypeScript AST parsing of7 directly related sources and Angular17 template parsing reported0 syntax findings. Local import paths, exact column order, backend field coverage and translation-key parity also reported0 findings. Scoped git diff --check passed; no scoped merge markers/any/silent-error callbacks found. These are source checks, not type checking, builds, tests or runtime verification.

Task-contributed files (application paths relative to SiGmaAngularFrontEnd):
- src/app/modules/Administration/messageLogs/list/list.component.ts
- src/app/modules/Administration/messageLogs/list/list.component.html
- src/app/modules/i18n/vocabs/en.ts and ar.ts (two Message Logs keys each only)
- src/app/modules/UserGuide/content/message-logs-topic.ts

Local review records updated: this follow-up and the dated amendment in MESSAGE_LOGS_FULL_STACK_CONTRACT_FREEZE.md. No backend/EF/entity/mapping/calculation/payload changes. No new migration is required by this follow-up. The original log storage rollout is still an owner prerequisite: no AddMessageLogs migration filename exists in current source; if its table has not been deployed, the owner must create/review/apply Add-Migration AddMessageLogs before list/append use. Database state was not inspected. No historical data/backfill or send test was attempted.

Applied phases0/1 (new evidence/frozen amendment),2 (actions/order),3 (read-only viewer),5 (imports/translations/existing routing/guide),6 (reconciliation). Skipped Phase4: no state transition. Existing producer evolution/persistence remain outside this bounded follow-up. Shared-extraction gate: reuse ActionList/ActionButton, DataTable, EditorDialog, dataTableCellText, global editor-field/scroll styles and current UserGuide; no repeated new presentation/formatting owner qualifies for extraction, no new reusable rule established. Approved reference modules and generated packets were not edited; initial recipe check found no drift. Subagents not used: the change is one small, dependent workstream.

Owner acceptance:
1. Build the frontend; open Administration→Message Logs and verify existing range/type/status search, sorting/paging and inline Retry.
2. Open View Details by mouse and keyboard for a row with long subject/addresses/error and nullable contact/CC. Check all nine values, separate record-ID subtitle, no Edit/Save, copy text, trap/Tab, Close/X/Escape and return focus to that row's trigger without changing the page/filter/sort.
3. Verify EN/AR, both themes, breakpoint boundaries/intermediate/narrow/short-height layouts and the Administration guide topic.
4. Verify full-result Excel/Report use the new business-column order and exclude Actions/viewer; no additional API request occurs on View/Close.

Suggested frontend commit: feat(message-logs): add read-only row details and align screenshot columns. No backend commit for this task. Build, tests, lint, browser/application verification, database commands, migrations, commits/pushes/deployment, Sigma MCP and Graphify were not run. Source implementation is complete; owner build/runtime/database/visual acceptance remains pending.
