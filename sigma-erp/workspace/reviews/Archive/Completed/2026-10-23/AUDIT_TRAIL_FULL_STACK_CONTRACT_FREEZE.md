| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

# Audit Trail full-stack contract

This supersedes the earlier frontend-only handoff in AUDIT_TRAIL_FEATURE_REVIEW.md. Owner direction: «انشئ كل المطلوب سواء باك او فرونت», «ولو امكن service عامة تكون generic تخدم كل entities», and «ممكن من Interceptor». New persistence and its necessary API/UI are in scope. No migration/build/test/database/browser/commit execution is authorized. Master2 standing rule resolves missing technical details conservatively.

## Capture and persistence

- Extend the existing ServerAPI EF registration with a scoped `SaveChangesInterceptor`; do not replace DbContext.HandleAudit or its subscription/soft-delete rules. A generic capture service method consumes tracked `EntityEntry<TEntity>` where TEntity derives from EntityBase.
- Log Added as Created; effective scalar Modified as Modified; physical Deleted or IsDeleted false/null→true as Deleted. Ignore unchanged/no-op entries. All EntityBase-derived tenant-owned entities in the configured DbContext are eligible, including tracked children. Global EntityBaseWithoutSubscription, raw SQL/ExecuteUpdate/ExecuteDelete, authentication outside this context and writes through an unconfigured context are outside this capture boundary and must be disclosed.
- Store only event metadata: own int Id, SubscriptionId, UTC DateTime, Username from the existing ClaimTypes.Name (System fallback), RecordType from EF CLR name, RecordGuid from source GUID, nullable RecordNo from source No and nullable RecordDate from mapped Date/DateOf/DateAndTime/JobDate properties (ordered explicit whitelist). No date uses the event timestamp as a substitute. If no documented date/number property exists the column stays empty. No primary-key-before-save fallback, fabricated identity, old/new field values, secrets, navigation serialization or relationship/FK to the source.
- `AuditTrailEntry` is a standalone tenant-scoped operational event, not generic CRUD EntityBase. Audit insertion shares the same base SaveChanges batch/implicit EF transaction as the business write; no nested or second SaveChanges. Failure/cancellation removes only staged audit entries so retry cannot duplicate them. Successful cleanup detaches only audit entries. Preserve EF acceptAllChangesOnSuccess and any caller-owned transaction.
- Audits have no write/delete UI/API, retention deletion or invented historical backfill. New table starts empty and records future successful tracked saves after deployment. Schema needs owner-run `Add-Migration AddAuditTrailEntries` after checking the name.

## Read API

- Authenticated `[Route("audittrail")]`, GET only; use existing root authentication and Repository.QueryReport<T>() subscription filter, including its missing-subscription failure. Audit history survives source soft-deletion and renaming.
- GET `/audittrail`: request `pageNo` default1, `pageSize` default15 clamped10..100, `Filters[fromDate]`, `Filters[toDate]`, `Filters[recordNo]`, `Filters[recordType]`, `Filters[user]`, optional `Filters[sortField]`, `Filters[sortOrder]`, and optional top-level nonnegative `snapshotId`.
- Mandatory date endpoints are strict yyyy-MM-dd calendar days, ordered, end before9999-12-31; query inclusive UTC event days using next-day exclusive bound. Optional recordNo/recordType are trimmed substring matches; user is exact captured Username, not a guessed user ID. Normalize Filters with StringComparer.OrdinalIgnoreCase after binding. Reject malformed date/paging/snapshot/sort inputs safely; do not change other API contracts.
- Return `AuditTrailResults : Results<AuditTrailRowDto>` plus int SnapshotId. Rows: Id, DateTime (UTC wall-clock transport/display), Username, RecordType, nullable RecordNo, RecordAction (Created/Modified/Deleted), nullable RecordDate. Projection only; no AutoMapper/write/detail DTO. Count filtered rows before Skip/Take; stable ordering with Id tie-break. Default DateTime desc, Id desc. SnapshotId captures tenant maximum audit Id initially; subsequent paging/export reuses the cutoff to exclude later events.
- GET `/audittrail/GetUsers`: Results<AuditTrailUserDto> with string Id and string Value, both captured username. Tenant scoped, distinct, ordered; retained actors remain selectable without depending on the unrelated local User table.
- Named classes/interfaces are in separate appropriate files. Register Business service through the existing interface scan; capture/interceptor registration explicitly in ServerAPI. Localized failures in existing GeneralMessage EN/AR resource keys. No authorization API or permission change.

## Frontend

- Read-only report exception with existing lazy `/auditTrail` entry; shared report shell/title, standard shared report filter strip, typed grid, no local CSS. Retain original fields/action labels through canonical control composition.
- UI17 requires one two-month date-range calendar defaulting to currentMonthRange; it represents screenshot From/To through the two endpoints and serializes exact fromDate/toDate keys. Optional recordNo/recordType/user; no required lookup selection.
- Display exactly dateTime(dateTime), username(text), recordType(text), recordNo(text), recordAction(translated status), recordDate(date). No unsupported dummy editor/create route. Historical frontend link pointed to only `details works!`; this is not a functional details contract.
- Root typed service uses Results envelope and new confirmed fields only. Server lazy paging with resolveListPaging and switchMap/defer cancellation; applied filters and snapshot are retained for paging/retry/export. Search/reset starts page1 and a new snapshot; draft edits do not silently change output, which has an explicit complete applied-filter description including User.
- Reactive disable/enable around requests; both failure channels handled by one inline owner using X-Skip-Error-Interceptor. Empty/loading/Retry; lookup failure blocks selecting unknown user and offers retry while allowing an unfiltered search. Shared primary submit Search, Reset and Excel output buttons; handler busy guards. Export fetches every server page with fixed cutoff/applied filters; any page failure aborts export rather than producing a partial file.
- UI/guide explains UTC event dates, nullable record number/date and future-events-only capture. No mock generation for search/report. Update existing bilingual Administration guide and route/menu registration evidence.

## Conformance and decisions

Master4/5/7/8; UI1/2/3/5/6/8/16/17/19/20/22–29; BE1/2/3/5/6/7/9/17/18/19. Report appearance reference: Customers/StatementOfAccount plus shared ReportPage/ReportActions and Accounts/TrailBalance. Generic capture compatibility reference: actual SiGmaDbContext.HandleAudit and EntityBase. Query scope reference: Repository.QueryReport. Approved references stay read-only.

Alternatives rejected: HTTP interceptor (misses actual entity changes/rollback), per-entity service copies (incomplete/duplicated), second save for generated IDs (unneeded transactional complexity), CRUD audit base (permits mutating history), current User IDs (auth NameIdentifier is the subscription), complete-array assumption (paging unproven). Source No/GUID avoids needing generated entity IDs inside one save.

Root owns frontend, translations, guide and review integration. Persistence worker owns new audit entity/config, generic capture/interceptor and narrow Program registration. Read API worker owns new DTO/filter/interface/service/controller and only new localization keys. No files overlap; pre-existing user/peer edits, migrations and model snapshots stay untouched.

## Source reconciliation clarifications (2026-10-14)

- Actual Repository.QueryReport returns an empty query for a missing/invalid subscription claim; it does not throw. The read service preserves that fail-closed behavior. Ordinary EntityBase writes still use the existing HandleAudit/Repository exception boundary.
- AuditTrailFilterVM inherits ListSmBase and sets1/15 defaults in its constructor; after-binding NormalizeFilters preserves the existing bracket-key binding boundary.
- Generic source No has no universal length bound and actor claims are auth-owned. Final EF explicitly uses nvarchar(max) for RecordNo/Username without a username max-column index; stable CLR type/action lengths are256/16. No source value is truncated.
- Final UI uses UI17 one two-month/current-month range instead of the initial screenshot-layout From/To controls. The same two endpoints remain in the serialized contract. No event date is substituted for missing RecordDate.

## Owner correction: Update/Delete write capture (2026-10-14)

The owner reports only Created events across multiple screens and explicitly
requests Update/Delete capture through the shared interceptor. This correction
supersedes the initial original/current comparison definition of an effective
modification above; response action names and all other frozen contracts remain.

- Modified means an eligible EF Modified entry with at least one scalar property
  marked IsModified for the save. Detached Repository.Update/UpdateRange snapshots
  must be captured even when EF OriginalValue equals CurrentValue: those original
  values are not a database baseline. Explicit forced UPDATE writes count even
  when their persisted value equals the old value; Unchanged entries and ordinary
  tracked no-change saves remain excluded. No extra database read is introduced.
- Deleted means a physical Deleted entry or a Modified entry whose IsDeleted
  property is marked for writing true. This preserves classification after
  HandleAudit converts Remove to a field-only soft delete and does not depend on
  an unavailable original deletion flag. A repeated explicit write of the true
  deletion marker is also a Deleted write. Updating another field on an already
  deleted tracked record without writing the marker stays Modified.
- Stage/callback/tenant/transaction/retry/cancellation owners remain unchanged;
  records appear only if the same business save succeeds. This is a metadata
  capture correction, not a change to business UPDATE/DELETE or EF originals.

## Owner presentation instruction: inline filter actions (2026-10-14)

Owner: «وخلى الازرار مع مربعات البحث فى صف واحد». Adopt the existing UI20
sigma-report-filter-panel--inline modifier with four filter tracks and one
action track. Reuse the shared action-field/caption/ReportActions/group
composition so buttons align with controls above date validation feedback.
Use the public full-template token to give the date range extra weight; retain
the shared1250px three-column and640px single-column fallbacks. No feature CSS,
new shared API, action/filter/paging/export contract or backend change. This is
a scoped adoption of the already-existing shared layout capability.
