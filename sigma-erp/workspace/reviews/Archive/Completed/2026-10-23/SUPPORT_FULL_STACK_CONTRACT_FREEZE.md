| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Support full-stack contract — 2026-10-14

Consumes SUPPORT_MAINTENANCE_EVOLUTION_PLAN.md. Scope: existing SupportRequest backend, new SupportSlaAgreement backend, modules/Support, directly related menu/routes/translations/UserGuide. Extensive pre-existing Administration and shared-source changes are owner/peer work and must be preserved. No build, test, lint, DB, migration, browser, commit, push or deployment commands.

## Screenshots

All English/LTR; unknown capture date/version/role; historical functional reference, not visual acceptance. S1=SupportRequests.PNG (1720×299), S2=SupportRequests2.PNG (404×364), S3=SupportRequests3.PNG (412×376), S4=SupportRequests4.PNG (404×373).

| Evidence | Classification | Requirement | Phase / representation |
|---|---|---|---|
| S1 | Explicit | Open Requests, Recently Closed Requests, request no/date/by/detail/status, Create/Refresh/Excel | 2: one shared paged grid with Open/Closed tabs (rather than two conflicting scroll regions), Closed ordered latest first |
| S1 | Uncertain | Gear's exact actions; closure time window | Do not copy unidentified action. Reviewer decision: View and confirmed Close workflow; Closed includes all closed records ordered by id descending, no fabricated cutoff |
| S2 | Explicit | Detail, Priority, SLA, Attachments, Save/Cancel | 3: controlled shared create/view/editor dialog and sections |
| S3 | Explicit | Normal and High choices | 1/3: wire enum Normal=0, High=1; existing Urgent=2 preserved in reads/API enum, not offered in create |
| S4 | Explicit | Document chooser opened from Attachments | 3: local selectionOnly FileField rows; no pre-save upload, native chooser supports same content requirement |
| S2/S4 | Strong inference | Checkbox means selection of existing SLA | Reviewer decision: typed multiple ids and eligible tenant agreement lookup; minimal management screen needed because no source exists |

## Shape/reference conformance before edits

| Concern | Book block | Actual source/reference | Shared owner / intended match |
|---|---|---|---|
| List shell/filters/grid | UI1/3/4/5/6 | Workshop/Job/components/list/list.component.html and .ts | sigma-route-host/list-page/panel; FeatureTitle; FilterPanel; DataTable fill/lazy, stable paging and switchMap |
| Modal | UI13/10/15 | shared/components/editor-dialog declarations | controlled visible, explicit create/view/edit; contentPadded, fixed footer, dirty guard, form freeze |
| Upload | UI18 | FileField selectionOnly public API; RentalAgreementController.UploadDocumentAsync; FileStore.Upload | validate signature/type/5MB server, tenant root, local draft until Save, failure rollback |
| Ordinary service | BE1–9/13 | BranchService; generic Service and SiGmaControllerBase | inherit list/count/paging/FK checks; override only validation/server ownership/tracked update/Close |
| Guide | Master7 | UserGuide models/reader/administration guide | same reader, one support section, bilingual final source workflow |

## Frozen API and ownership

SupportRequestAddVM: detail (required nonblank, max 4000), priority (validated existing enum), selectedSlaAgreementIds (int[]; default []). No attachments paths, tenant, number, audit or state client inputs. SupportRequestUpdateVM adds id; same editable scalar/SLA fields; persisted attachments retained. JSON POST stays available without files. POST /SupportRequest/Create multipart: same fields plus files (PDF/JPG/JPEG/PNG, 5MB each, maximum 10, 51MB request limit); accepted paths passed only through internal service method. Atomic upload/storage rollback follows approved existing controller orchestration. PUT updates tracked editable fields only and preserves state/audit/files; no edit file deletion. POST /SupportRequest/{id}/Close: Open→Closed; repeated Closed succeeds; no reopening. One implicit EF save per request operation. No financial calculation.

Request entity retains existing RequestNo, DateTime, By, Detail, ServiceLevelAgreement, Attachments and enum values, and adds primitive selected SLA ids. Status domain Close owns mutation. On create, backend date/actor and numbering own values; read legacy RequestNo first, else No; legacy By first, else CreatedBy. Source-derived date is backend-owned. Read list identity uses request id.

| Grid field/type in order | ListVM member | Reason |
|---|---|---|
| actions | Id, Status | View/Close target and visibility |
| requestNo/text | RequestNo | Existing value or shared numbered No fallback |
| dateTime/date-time | DateTime | Backend date with legacy preservation |
| by/text | By | Actor, legacy or CreatedBy |
| detail/text | Detail | Request content |
| status/text | Status | Open/Closed translated |

ListVM is explicit: Id, RequestNo, DateTime, By, Detail, Status only. Detail adds Priority, ServiceLevelAgreement, SelectedSlaAgreementIds, Attachments; no heavy base fields. Standard GET list with Filters[status]=0/1 and Filters[search], sortField whitelist requestNo/dateTime/by/detail/status, page defaults shared 15 UI/10 backend and clamp 1–100. Generic stored-column sorting retained; stable Id tie. Full export uses fetchAllPages and dataTableExportRows with current translated headers/status. Unknown filter keys ignored. Empty search omitted; status zero retained; UI default Open. No screenshot priority grid column.

SupportSlaAgreement: EntityBaseWithName; Name required max100, ExpiresOn DateOnly required; Id+Name+ExpiresOn list/detail, Add Name/ExpiresOn, Update Id+Name/ExpiresOn. Generic controller /SupportSlaAgreement CRUD maintained; no new destructive UI. GET /SupportSlaAgreement/Available returns Results<SupportSlaAgreementListVM> for live tenant rows expiring >= server local today. Names unique live tenant via UniqueColumns + filtered index; preserve history/snapshot on rename/expiry. Request validates all selected ids, no rental agreement ids. SLA forms date-only via shared date utils. Expired agreements remain manageable. Backend localized failures in both resx.

No incoming request path is trusted. Controller FileStore owns new paths; historical persisted paths stay untouched. Upload rollback only deletes newly uploaded paths; failed rollback is internally logged, original failure preserved. Crash after storage/before persistence remains an operational orphan risk to report; no speculative global cleanup subsystem.

## Routes/actions/authorization

Support immediately follows Administration as root peer. Children /SupportRequest, /SupportSlaAgreement, /UserGuide/support. Feature routes list only, dialog create/view/edit with list guard delegating pending discard. Root HttpClient/interceptor, providedIn root services and environment.baseUrl. Create/update/Close and SLA maintenance are future authorization candidates; no role/permission API added. No new delete UI.

View/Refresh/Search/Paging/Excel supported; Create supported; Edit existing fields supported; Close supported by existing request state and closest current workflow. Generic Delete/activate/select compatibility retained backend only; approval/posting/receipt/invoice/print/reopen and unrelated Job actions not applicable: request has no accounting/vehicle/job aggregates. Concurrency: tracked edit preserves Close; Status configured concurrency token; repeated Close idempotent; stale writes surface existing 409 owner; no blind retry.

## Clarifications during implementation (2026-10-14)

- SLA eligibility also requires inherited `IsActive != false`: the generic activation endpoint already exists, and an explicitly deactivated agreement must not become selectable. This is a reviewer decision under the standing rule; no new activation UI or permission is introduced.
- New RequestNo is copied from the shared generated No after Repository.AddAsync and before the single save, keeping normal stored-column sorting consistent with display.
- Editing an old request that has legacy SLA text and no structured selected ids keeps that historical text when the incoming selection is still empty. Clearing a known structured selection clears its snapshot; no automatic historical text rewrite/backfill.
- No proactive tsconfig compilation-root changes: lazy route imports make new runtime source reachable. An owner-reported missing compilation entry can be added later according to UI1; source-only work does not fabricate a compiler diagnostic.
- Historical SLA snapshot changes only when the request's selected-id set changes. Editing detail/priority with the same selection must not silently replace a saved name/expiry after the agreement master changes. Changing or clearing the selection intentionally rebuilds/clears the snapshot. Eligibility is still validated on each Save.
- Multipart Detail is trimmed in its endpoint because form binding bypasses the JSON-only incoming string converter. Ordinary JSON and SLA writes retain shared request normalization without service Trim/Normalize copies.
- FileStore now removes the current incomplete upload after failed/cancelled copy and accepts an optional copy cancellation token. Support passes the request token; old callers remain source-compatible. The shared repair and remaining crash limitation are recorded in UI18 and the skill.
- Request list materialization projects only the frozen six ListVM properties; attachment paths/SLA ids/detail-only fields are excluded from the list SQL projection. SLA generic delete checks live SupportRequest primitive selected-id collections before the usual EF usage checks, since this relationship has no navigation; no new Delete UI is exposed.

## Schema/compatibility

New SLA table + selected-id primitive column + length/index/status concurrency configuration require Add-Migration AddSupportSlaAgreements. Owner checks existing strings against new bounds, historical status and attachment contents and duplicate numbers before applying; no removal or automatic rewrite. Keep SupportRequestModel and its callers untouched. Identical unused FullListVM may be removed only after scoped consumer search. One-way maps only; genuine legacy fallbacks allowed. Root integration final reconciliation must list actual files and matching public inputs rather than mere imports.
