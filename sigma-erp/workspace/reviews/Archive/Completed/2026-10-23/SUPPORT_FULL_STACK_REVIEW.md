| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Support implementation and final reconciliation — 2026-10-14

Implemented the user's Support menu as a root peer immediately after Administration, with Support Requests, Support SLA Agreements and the existing UserGuide reader. The frozen plan and contract are `SUPPORT_MAINTENANCE_EVOLUTION_PLAN.md` and `SUPPORT_FULL_STACK_CONTRACT_FREEZE.md`; later clarifications are retained in the freeze rather than silently replacing the original decisions.

## Feature manifest and phases

| Item | Result |
|---|---|
| Outcome | Create/view/edit and close Support requests; local attachment selection with Save-time storage; selectable real SLA masters; open/closed lists, refresh, search, full Excel and bilingual guide |
| Scope | Existing backend SupportRequest; new SupportSlaAgreement; new Angular modules/Support; related menu/routes/vocabs/UserGuide; shared FileStore upload failure repair |
| Prior user changes | Both repositories already had extensive modifications, including Administration, resx/DbContext and frontend dictionaries/menu. Preserved. Temporary frontend baseline comparisons isolate this task's wiring/vocabulary changes. Existing modified migration/snapshot files belong to other work and were not touched |
| UI/backend shape | Type01 paged list with controlled modal. Backend Pattern1 extended by request server-owned creation, SLA selection validation, tracked edit and Close; primitive file/id collections are not child entity CRUD |
| References | Job list source, shared EditorDialog/UI13, FileField selectionOnly/UI18, BranchService/base Service/controller, RentalAgreementController atomic upload/FileStore |
| Plan and packets | Frozen PLAN-00 + phases 0–6 applied. Phase4 owns Close and local draft attachment removal confirmation. Financial/approval/posting/reopen/delete UI not applicable: no such request aggregates or approved workflow |
| Permissions | Existing AuthGuard/Authorize and repository tenant scope; no new permission API or role claims |
| Unknown evidence | Screenshot role/date/version and gear menu meaning unknown. No invented cutoff for “Recently closed”; all closed ordered by newest identity. No missing requirement blocks the implemented contract |

## Screenshot reconciliation

### S1 — SupportRequests.PNG

| Evidence | Classification | Final representation |
|---|---|---|
| Open/Recently Closed and count | Explicit | Shared EditorTabs and one DataTable scroll region; active filtered section has API count |
| Request no, Date & Time, By, Detail, Status | Explicit | Matching lean six-property ListVM including action Id |
| Create, Refresh, Export to Excel | Explicit | FeatureTitle Create/Refresh and FilterPanel Excel; full applied-result export |
| Gear meaning / closure date cutoff | Uncertain | Not copied. View/Edit/Close are labelled reviewer decisions supported by existing request state and current CustomerRequest Close workflow |

### S2 — SupportRequests2.PNG

| Evidence | Classification | Final representation |
|---|---|---|
| Detail and priority | Explicit | Typed required detail max4000 and Normal/High dropdown |
| SLA description and checkbox | Explicit content / inferred selection semantics | Actual SLA name plus expiry; optional multi-selection validated active/unexpired by server; snapshot retained historically |
| Attachments, Save/Cancel | Explicit | Shared editable collection, selectionOnly FileField and controlled EditorDialog Save/dirty cancel |

### S3 — SupportRequests3.PNG

| Evidence | Classification | Final representation |
|---|---|---|
| Normal/High options | Explicit | Existing wire values0/1; historical Urgent2 supported only on saved urgent record; no changed persisted enum values |

### S4 — SupportRequests4.PNG

| Evidence | Classification | Final representation |
|---|---|---|
| Document file chooser from attachments | Explicit | Shared local file selector on each attachment row instead of screenshot styling/nested legacy modal; files submitted atomically on Create Save |

All screenshot sample text, request numbers and future SLA date were evidence only and were not inserted as application data.

## Decisions taken

| Master4 decision | Final decision and evidence |
|---|---|
| 1 canonical reference | Job owns list integration, EditorDialog owns modal, Branch/base owns ordinary service; real declarations inspected |
| 2 editor shape | Modal: fields and one small attachment list, no totals/posting |
| 3 route count | List-only /SupportRequest and /SupportSlaAgreement lazy routes; canDeactivate delegates to editor |
| 4/5 grid/ListVM | Requests Actions, requestNo/text, dateTime/dateTime, by/text, detail/text, status/status ↔ Id, RequestNo, DateTime, By, Detail, Status. SLA Actions, name/text, expiresOn/date ↔ Id, Name, ExpiresOn. No oversized base inheritance |
| 6 writes | Request detail/priority/selected ids only, Update adds Id. SLA name/expiry only, Update adds Id. File parts only on multipart Create; no client path/number/date/actor/state/tenant |
| 7 detail | Request list context is rendered in header/metadata; editor adds priority/saved SLA/ids/files. SLA Id/Name/ExpiresOn. Existing LeanDetailBaseVm reused |
| 8 styles | Existing shell/filter/grid/editor/file/collection owners; no feature stylesheets or palette |
| 9 confirmation | Shared confirmed Close and draft file-row removal; Save/Search/Excel need no confirmation |
| 10 discard | Shared confirmDiscard/freezeFormState on dirty X/Cancel/Escape/navigation; View/pristine exit directly; inflight writes/actions block navigation |
| 11/12 backend/base | Pattern1 over existing EntityBase request and EntityBaseWithName SLA, tenant/audit from existing repository and context |
| 13 duplicate key | SLA Name live tenant unique via UniqueColumns and filtered index; request generated RequestNo unique filtered tenant index |
| 14 FK/delete | Selected primitive SLA ids checked positive/distinct/all tenant-live-active-nonexpired; generic SLA Remove checks request selected ids then EF dependency owner. No destructive UI |
| 15 filters/paging | Request status0/1 and search; SLA search; serializers omit empty and preserve zero, generic backend hooks/count/clamp1–100/Id ties; shared15 UI default and page-size options |
| 16 translations | Matching supportRequest/supportSlaAgreement keys and sideMenu.support in en/ar |
| 17 registration | Root-provided feature services, environment.baseUrl and root token/error HttpClient; backend assembly scan discovers service/profile; FileStore scoped ILogger resolves DI |
| 18 migration | Owner-run AddSupportSlaAgreements required; no migration/snapshot edits |
| 19 actions | View/Create/Edit/refresh/search/paging/export supported. Close supported Open→Closed. Generic Delete/activation/select stay API compatibility only, no UI. Job vehicle/gatepass/labour/log/quality/invoice/approval/posting workflows not applicable to this domain |
| 20 overrides | See table below; all require target-specific behavior, inherited ordinary methods retained |
| 21 plan | Frozen evolution plan extends existing request owner and creates the minimal missing SLA principal |
| 22 child snapshot | No entity child collections. Files are local create-only selections, saved paths immutable in Edit. Selected SLA ids represent complete current selection; same set preserves historical description |
| 23 money/VAT | Not applicable, no financial effect or formula |
| 24 authorization candidates | Request POST/Create, PUT, POST{id}/Close; SLA POST/PUT/DELETE/handleActivate are future permission candidates, existing app does not have that authorization mechanism |
| 25 correctness | Server-owned identity/state/audit, actual eligible agreements and historic snapshots, full exports, original files retained on failed update and rollback of newly uploaded files |

## Backend override and transaction audit

| Symbol | Reason |
|---|---|
| SupportRequestService.AddAsync → AddWithAttachmentsAsync | Server actor/date/generated number, domain default Open, selected-id validation and saved file paths only from trusted controller |
| MaterializeListAsync | SQL projection excludes attachment/id collections and detail-only payloads |
| ApplyListOrder | Displayed number/actor legacy fallback expressions need matching sort; stored fields use shared SortBy, base stable Id tie retained |
| SearchColumns | Search visible number/actor/content including historical fallback fields |
| UpdateCoreAsync | Tracked editable-only update preserves number, audit, attachments and Close; changed selected-id set alone updates SLA snapshot |
| CloseAsync | Exact Open→Closed and repeat Closed success; rejects invalid state; entity.Close owns mutation, status concurrency token |
| SupportSlaAgreementService.SearchColumns/UniqueColumns | Name search/real unique business key; inherited Add/Update/CheckUnique |
| RemoveAsync | Primitive selection has no FK/navigation for base usage discovery, so explicit live request check precedes RemoveWithChildrenAsync |
| AvailableAsync | Additional eligible lookup, active and expiry >= server local today, real persisted name/date/id |
| Controllers | Only multipart Create/Close/Available added. No redeclared generic routes/business loops |

One scoped EF save is reached by request Create, tracked Edit and Close; EF's implicit transaction owns each save. No explicit transaction was introduced. SLA normal writes retain inherited UniqueColumns serialized-write guard. Physical file storage is outside EF: controller rolls back newly uploaded files after any later upload/validation/persistence failure. FileStore removes a current incomplete file after failed/cancelled copy, after stream disposal. Cleanup logs never replace the original failure. A process crash between disk storage and request persistence can still leave an orphan; no background cleanup guarantee is claimed.

AutoMapper uses explicit one-way maps, no ReverseMap/defensive Ignore. Only RequestNo and By flatten legacy fallbacks. RequestFullListVM was unused and removed; ListVM shed tenant/audit/GUID/flags/priority/SLA/attachment members, retaining displayed DateTime/By. No domain money calculation. SLA snapshot is derived from real names and expiry dates, bounded1000 before mutation, never truncated.

## Final source conformance and integration

| Path/concern | Producer/consumer evidence | Result |
|---|---|---|
| Menu/route | SIDEBAR_MENU_ITEMS peer after Administration; Routing imports exact SupportRequest_Routes/SupportSlaAgreement_Routes; lists import dialogs | Matched |
| Public owner APIs | Standalone imports match exported FilterActionsDirective, EditableCollectionRowDirective, FileField/FileLink, FieldError, FormSection, EditorTabs/Dialog, StateMessage and MockDataFormsModule; bound input names checked | Matched source; owner template types pending |
| List shell | sigma-route-host → sigma-list-page → sigma-list-panel/header/table, app-feature-title, appFilterPanel stable/reset and one fill DataTable per list, no local SCSS | Matched UI1/3/4/6 |
| List transport | services.toListParams → generic GET/ListSmBase search/status/sort → CountAsync/paging/ProjectTo → totalRecords/first/rows | Matched fields/count; runtime SQL pending |
| Superseded query | Subject/switchMap/defer/finalize, resolveListPaging before signals, query-key skip, action/editor preserve applied filters | Matched UI28; runtime requests pending |
| Export | fetchAllPages page100 follows metadata; dataTableExportRows mirrors grid/translates headers/status at click; failed page yields no file | Matched UI8 |
| Detail/write | exact camelCase contracts, loaded id checked, read failure blocks Save/retry, typed payload no server values; metadata consumes date/by/status | Matched |
| Multipart | repeated selectedSlaAgreementIds/files; /SupportRequest/Create FromForm; no JSON content-type override;10×5MB, signature validation; current/previous failed uploads cleaned | Matched source; disk/failure HTTP journey pending |
| Close | action Open only, shared confirmation, controller/service exact Open/Closed, status token; success refreshes applied state and backs up from emptied later page | Matched |
| Error/toast | inline skip-error headers + both declared/HTTP handling; shared mutation interceptor still owns one success toast; loader start/end finalized | Matched |
| Dialog/exit | controlled visibility, create/view/edit, contentPadded, request definite height and single body scroll; dirty freeze, guard navigation, session/destroy cancellation | Matched |
| SLA date/focus | shared appDatePicker dateInputMask/dd/mm/yy/dd/mm/yyyy, typeable/keepInvalid, overlay on click and automatic focus disabled; shared close focus after shown | Matched source; keyboard/visual pending |
| Translation/guide |72 feature keys in each language, zero missing/case-only; sideMenu.support literal matched. SUPPORT_GUIDE reader registration /UserGuide/support and menu present | Matched |

Responsive owner acceptance: ordinary route scroll stays on table rows, editor scroll stays inside body; title/actions/pager fixed. >1200 desktop filter; both sides1200 collapse disclosure;650 title action wrapping; shared editor-grid around760/480 and dialog1099/767 boundaries; intermediate widths and short heights; both EN/AR and light/dark. Existing shared owners and later root styles were inspected; no runtime/visual fit is claimed.

## Changed files and staging boundary

Backend (`F:/My Work/Sigma/SigmaBackend`):

- `SiGma.Helpers/Models/SupportRequest.cs`, new `SupportSlaAgreement.cs`.
- `SiGma.DataAccess/Configuration/SupportRequestConfig.cs`, new `SupportSlaAgreementConfig.cs`; only one SupportSlaAgreements DbSet addition in already-modified `SiGmaDbContext.cs`.
- `SiGma.Business/IServices/ISupportRequestService.cs`, new `ISupportSlaAgreementService.cs`; `Services/SupportRequestService.cs`, new `SupportSlaAgreementService.cs`; `MapperConfig/SupportRequestProfiler.cs`, new `SupportSlaAgreementProfiler.cs`.
- `SiGma.ServerAPI/Controller/SupportRequestController.cs`, new `SupportSlaAgreementController.cs`; shared `Extensions/FileStore.cs`.
- `SiGma.ViewModels/ViewModels/SupportRequest/{SupportRequestAddVM,SupportRequestUpdateVM,SupportRequestListVM,SupportRequestDetailVM}.cs`; unused SupportRequestFullListVm.cs removed.
- New `SiGma.ViewModels/ViewModels/SupportSlaAgreement/{SupportSlaAgreementAddVM,SupportSlaAgreementUpdateVM,SupportSlaAgreementListVM,SupportSlaAgreementDetailVM}.cs`.
- Only Support-specific keys added to existing `SiGma.Helpers/Localization/Shared/GeneralMessage.resx` and `.ar-SA.resx`.

Frontend (`F:/My Work/Sigma/SiGmaAngularFrontEnd`):

- New `src/app/modules/Support/SupportRequest`: supportrequest.routes.ts; components/list and details TS/HTML; models/list.ts,create.ts,details.ts; services/supportrequest.service.ts.
- New `src/app/modules/Support/SupportSlaAgreement`: support-sla-agreement.routes.ts; components/list and details TS/HTML; models/list.ts,create.ts,details.ts; services/support-sla-agreement.service.ts.
- `src/app/pages/routing.ts`; `src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts`; feature blocks + sideMenu.support only in existing en.ts/ar.ts.
- New `src/app/modules/UserGuide/content/support-guide.ts`, existing reader import/registry.

Documentation: this review, frozen plan/contract; canonical UI18 shared-storage paragraph, CHANGELOG and sigma-screen-refactor digest/revision row; generator-only refreshed packets. No tsconfig widening/additions, reference source modification or unrelated feature refactor.

## Verification and owner handoff

Source-only verification: scoped backend diffs and new files reviewed; frontend complete feature sources plus baseline diffs for previously modified shared files reviewed. Git whitespace checks, merge/stale-pattern scans, local TS import-path inspection and TypeScript/Angular template syntax parsing show no scoped findings. Syntax/import inspection is not TS/Angular type compilation. Both RESX files parse as XML and support keys match. Feature translation checker:72 en/72 ar, zero missing/case-only. Final recipe -Check all OK. Refreshed through generator after UI18 update: all8 packets; semantic review confirms same authority/references/phases with new storage paragraph inherited by phase2/3 (no invented new reference owner).

Required owner migration: `Add-Migration AddSupportSlaAgreements` (name absent from existing migrations). New SLA table/Name100 live-tenant unique index; new request primitive selected ids empty-array default/backfill; RequestNo100, By100, Detail4000, SLA description1000 bounds; unique live tenant RequestNo index; status concurrency model. Before applying, inspect existing lengths, duplicates, enum states and primitive attachment values; retain all historical SLA text and files. No data is rewritten here. The repositories already contain other owner's migration/snapshot changes; coordinate the migration with those changes instead of attributing them to this task.

Owner checks: build both repositories/startup after the migration; create/duplicate/expire SLA; create Normal/High request with/without agreements and valid/invalid files; verify date/actor/number from server; view/edit/dirty Cancel/X/Escape/navigation; close/repeated Close/concurrent Edit; lookup failure and retry; sort/page-size/rapid pages/applied search/full Excel; light/dark/Arabic/keyboard/dialog focus/short-height responsive matrix; simulate late upload/storage/save failure and verify new file rollback without deleting saved attachments. Check production multipart request-size settings permit51MB if using10 files.

Remaining risks: owner compilation/runtime/EF primitive-collection SQL translation/migration/type-check and visual acceptance pending; global generic D5-2 list/update cancellation remains project backlog. Disk/database distributed atomicity on process crash is not promised. No external email/helpdesk provider integration is implemented. All required screenshot content is represented; unidentified gear action and a temporal recent cutoff remain unimplemented uncertainty, not blockers for frozen scope.

Guide handoff: `src/app/modules/UserGuide/content/support-guide.ts`, route/menu `/UserGuide/support`, topics `supportRequest.title` and `supportSlaAgreement.title`; bilingual prerequisites/tasks/statuses/validation/attachment limits/local Save/closed behavior/historical SLA explanation matched final source. Reader/navigation/RTL/theme/print acceptance owner-pending.

Shared-extraction result: reused existing list/editor/filter/table/file/date/error/confirmation/validation/export owners. The incomplete-copy cleanup defect belonged to shared FileStore, so repaired there with optional token and documented UI18/skill/changelog. Request/SLA business validation and snapshots stay with their feature owner; the two small ordinary list integrations add no new public shared capability.

Agent utilization: backend sol_worker on selectable gpt-5.6-sol owned Support backend only; frontend worker used inherited model and owned new modules/Support only. Root froze contracts first, owned wiring/guide/translations/shared storage and integrated/audited both. Separate file ownership reduced wall time for two independent implementation workstreams; no uncontrolled/overlapping edits. Agent follow-up source findings were corrected before root handoff.

Suggested commits, stage only the scoped changes above:

- SigmaBackend: `feat(support): add request workflow and service level agreements`
- SiGmaAngularFrontEnd: `feat(support): add support menus, requests and user guide`
- Documentation: `docs(support): record contracts and atomic upload cleanup`

No builds, tests, lint, database commands, migrations, browser/application verification, commits, pushes or deployment were run. Source changes are implemented; owner verification remains pending.
