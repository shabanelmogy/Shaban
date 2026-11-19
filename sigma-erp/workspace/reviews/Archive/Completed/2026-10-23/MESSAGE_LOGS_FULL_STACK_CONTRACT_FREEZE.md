| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Message Logs contract — 2026-10-14

User authorizes reviewing Administration/messageLogs and implementing according to the books; subsequent clarification explicitly authorizes missing frontend/backend parts. Master2 standing reviewer rule supplies conservative missing details. No destructive operation, access-policy change or accounting effect.

## Shapes and scope

Read-only operational log, paged list using Workshop/Job list shell/filter/request references (UI1–8). Backend operational-event exception: dedicated authenticated GET, lean ListVM, tenant-scoped Repository.QueryReport (BE17/18); no public CRUD, activation or fake details routes. Source evidence: existing frontend enums, columns and SMTP test sender; LeaseCustomerSms is simulation only, so simulation never produces a Delivered SMS log.

Pending implementation files: MessageLog entity/configuration, MessageLogListVM, MessageLogResults (snapshotId), IMessageLogService/MessageLogService, MessageLogsController; directly related SMTP test service integration. Frontend existing list/service/routes, typed model, bilingual vocab and Administration guide. Existing unrelated dirty changes remain owned by user; existing messageLogs MockDataFormsModule change is retained.

## Frozen read API and columns

GET /messageLogs: ListSmBase plus optional snapshotId; Results<MessageLogListVM> plus snapshotId. Filters: fromDate/toDate optional ISO yyyy-MM-dd, type/status optional numeric enums (Email/Delivered=0, Sms/Rejected=1); sortField whitelist is the nine column fields; sortOrder 1/-1. Invalid supplied dates/enums/sort/page produce a localized failed result/HTTP400. Missing dates are unbounded. Inclusive toDate uses next-day exclusive bound, with max-day handling. Default date range on client: current month. PageNo positive; PageSize default15, clamp10–100; overflow guard. Stable sort tie-break Id. First search freezes maximum tenant Id; subsequent paging/Excel/Report share snapshotId. New search/reset gets a fresh snapshot. No guessed existing-row values/backfill.

Grid fields ↔ ListVM properties, in order: type:number↔Type, subject:text↔Subject, contactName:text↔ContactName, dateTime:dateTime↔DateTime, from:text↔From, to:text↔To, cc:text↔Cc, messageError:text↔MessageError, status:status↔Status. Minimum identity id↔Id. Recipient To is a reviewer decision: real SMTP recipient is essential to trace the sending result; it is not presented as a fabricated contact name. ContactName/Cc remain nullable when sender has none. Canonical casing replaces dead legacy Type/date&time bindings together. No tenant/audit/body/password in ListVM/export.

Search/Reset, paging/sorting, Export to Excel and Report (print the same complete matching table) are supported. Full print/export uses shared fetchAllPages and dataTableExportRows on the frozen applied query/snapshot, never edits to unsent form values. Report means a printable log table, not a new reporting API or invented totals. Error owns inline feedback with X-Skip-Error-Interceptor; global loading always released by finalize; switchMap handles stale queries.

## Event persistence and writer

Append-only plain event entity with Id/SubscriptionId (operational log exception, not mutable EntityBase). Store UTC DateTime; transport/display explicitly UTC wall clock. Type/Status are existing enums. From/To max320; Subject max998; ContactName max256; Cc max2000; MessageError max512. Tenant/time/id nonunique index. No unique business key: repeated real attempts are separate events. No public write DTO, delete/update endpoint or client-owned state. Direct projection requires no AutoMapper profile.

Wire actual SettingsEmailSmtpModelService.SendTestEmailAsync: successful SMTP acceptance produces Email/Delivered; failure produces Email/Rejected, with safe localized diagnostic key, never raw provider exception, body or password. Delivered here means SMTP accepted, not proof of final inbox receipt; guide states this. Preserve SMTP settings lookup and credentials. Capture From/To/Subject from actual attempt; ContactName/Cc null. Invalid/missing settings do not count as send attempts. Tenant from existing authenticated server context, never client. Isolate event append so it cannot save another caller's tracked aggregate. If append fails after SMTP acceptance, report sent-but-log-unavailable without repeating send or changing Delivered to Rejected. No invented real SMS transport; current simulation remains simulation and empty SMS history is legitimate.

## Decisions / exclusions

Single list route /messageLogs; no editor or domain transition (Phases3/4 N/A). AuthGuard+[Authorize] only; no new permission mechanism. Feature content has no local shell/filter/table CSS. Reuse existing shared owners, no new shared abstraction expected. Schema requires owner Add-Migration AddMessageLogs (check name before handoff); do not create migrations/snapshots or execute build/tests/lint/DB/browser/commit/push. Phases0,1,2,5,6 applicable. Initial recipe -Check passed all packets; no derivative drift.

## Reference conformance baseline (before edits)

| Concern | Block | Reference / shared owner | Target decision |
|---|---|---|---|
| Shell/title/grid bounds | UI1/3/6 | JobsComponent host sigma-route-host; sigma-list-*; FeatureTitle/DataTable fill | same host/inset/one row scroll owner; no local stylesheet |
| Three filters | UI4/16/17/19 | Job filter panel stableLayout; DatePickerDirective/dateRangeValidator; TranslateOptionsPipe | mainColumns3; single dual-month range/reserved error; null means all enums |
| Requests | UI2/28 | Job bindListQueries; list-query serializers | switchMap/defer/finalize; typed query; snapshotId consistency |
| Export/print | UI8/21 | fetchAllPages/dataTableExportRows/ReportPrintService/DataTable printAllRows | complete applied snapshot; same formatted translated nine columns |
| Read security | BE17/18 | Repository.QueryReport tenant filter | preserve tenant boundary; event store without CRUD |
| UI states | UI22/23/24/25/27 | StateMessage, PrimaryActionButton, shared owners | both failure channels, translated EN/AR, associated labels; RTL/theme through shared styles |

## Frozen extension — real reminder producer (same task, 2026-10-14)

Focused producer tracing additionally found FleetAlertsService.SendServiceRemindersAsync as a live tenant email sender (SecurityService email code is commented). It is a directly related producer for Message Logs, not new Fleet feature work. Extend the existing transport boundary through one shared MessageDeliveryService/IMessageDeliveryService, consumed by SMTP test and Fleet reminder loop. This replaces duplicated persistence/send handling under Master5's extraction gate. A typed Helpers DTO supplies real sender/recipient/subject/body/SMTP inputs internally only; a typed outcome distinguishes Accepted and LogSaved. No web payload or persisted body/password. Store current-language-independent messageLogs.errors.deliveryRejected key. Validate actual addresses fit320 and Subject998 before sending, do not truncate the address that was actually used. Optional ContactName/Cc limits apply; Fleet supplies actual recipient.CustomerName (truncate optional display snapshot if necessary), not a guessed relation.

Keep reminder selection, per-vehicle deduplication, message/body and first-failed-send stop behavior; never retry an accepted send on log failure. If any accepted send lacks a log, return sent-but-log-unavailable feedback. If a rejected attempt also lacks a log, return a distinct rejection-plus-log-unavailable feedback. Caller cancellation checked before a new attempt; once an irreversible transport attempt completes, record outcome independently of request cancellation. Failed partial Fleet batches disclose previous accepted count and offer no automatic resend. SMTP test uses same shared send owner. The shared transport is the only new reusable guidance; synchronize BE18, skill revision and changelog, then regenerate affected packets and -Check.

Final source reconciliation amendment: current EmailHelper has no CC transport. Retain Cc as nullable event/read/grid data but omit CC from the shared internal request and persist null for both current producers; no invented CC delivery. Normalize From/To through MailAddress.Address and pass exactly that address to both SMTP and the event, rejecting overlength first. Subject is required on the internal send request/event/ListVM. Read parsers obtain optional raw values through FilterHelper.GetString then enforce the frozen exact grammar. Shared append failures have one internal ILogger owner; callers report the safe outcome only. These corrections follow the original actual-send-only/no-fabricated-data decision.

## Frozen amendment — new screenshot request, 2026-10-21

Decision source: «خد الصورة كمرجع وضيف Feature تحت administration», E3 = C:/Users/user/Desktop/MessageLogs.jpg. Source discovery confirms the feature already has its Administration menu entry, /messageLogs route, authenticated GET, producers and guide. Extend that owner; do not duplicate the feature. This amendment supersedes only the earlier no-row-actions decision and the relative order of Status/Message Error; all persistence, filters, transport and output boundaries above remain frozen.

Reviewer decision (owner standing rule, Master2 rule6): the screenshot explicitly shows a row-action trigger but its menu is closed. The minimal useful action is View details of the existing immutable log snapshot. This is a reviewer-selected action, not a claim that the screenshot proves a View label. Resend/delete/edit were rejected: they require unsupported mutation contracts and could repeat delivery or destroy history. Message body remains unavailable and is not invented.

Grid order: Actions (shared ActionList column), type, subject, contactName, dateTime, from, to, cc, status, messageError. Business ListVM remains Id + Type, Subject, ContactName, DateTime, From, To, Cc, MessageError, Status. No transport field or API property changes; JSON property order is irrelevant. Sort/filter keys stay compatible. Excel and Report inherit the revised nine business columns and omit Actions.

View contract: list-owned controlled app-editor-dialog, mode=view, primaryActionVisible=false, contentPadded=true; translated screen title and separate translated record-ID subtitle; Close/X/Escape close silently. All nine existing fields are read-only and use the same shared dataTableCellText formatter as the grid/export. Snapshot is copied from the clicked row (append-only source); no new request, DTO, lookups, write form, dirty state, save, permissions or domain transition. Long subject/address/error values use shared readonly textarea controls inside one bounded sigma-editor-scroll; shell owns header/footer/focus trap/viewport limits. Keep the existing list route; closing retains filters/page/sort and does not reload.

Implementation slices: Phase2 order/actions, Phase3 read-only view, Phase5 standalone imports/route confirmation/EN-AR text/guide, Phase6 scoped source reconciliation. Phase4 remains N/A. No schema change or new migration. Existing AddMessageLogs rollout prerequisite remains owner-owned; no matching migration filename was found during this source check. Runtime database state is unknown.

