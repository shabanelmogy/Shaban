| Status | Implemented — source-only |
|---|---|
| Owner verification pending | yes |
| Feature | AUDIT_TRAIL |
| Date | 2026-10-14 |

# Audit Trail feature review and implementation


> Historical frontend-only record below. The later owner authorization and the full-stack continuation at the end supersede its Missing API, today-only date defaults, response-array compatibility and local complete-response assumptions. Final contracts are in AUDIT_TRAIL_FULL_STACK_CONTRACT_FREEZE.md.

## Request and evidence

The owner requested a review and documentation-conformant implementation of `src/app/modules/Administration/auditTrail`. `AuditTrail.PNG` is functional/content evidence only. It directly shows the Audit Trail title, From Date and To Date filters, optional Record No, Record Type and User filters, Search and Export to Excel actions, and a read-only table with Date & Time, Username, Record Type, Record No, Record Action and Record Date. It does not establish API shape, persistence, authorization, paging, retention, or create/edit/detail behavior.

## Feature Review Manifest

| Item | Decision |
|---|---|
| Requested outcome | Review and refactor Audit Trail to the shared Sigma screen patterns |
| Frontend scope | `SiGmaAngularFrontEnd/src/app/modules/Administration/auditTrail`, direct route, guide topic and Audit Trail translations |
| Backend scope | Reviewed `SigmaBackend`; no AuditTrail controller, entity, DTO or service exists |
| Evidence | `AuditTrail.PNG`; existing AuditTrail Angular source; existing `audittrail` BaseService endpoint |
| UI shape | Screen type 07 Report |
| UI references | `ui/20-report-page.md`, `ui/05-columns.md`, `ui/06-grid-and-footer.md`, `ui/08-export-to-excel.md`; `Workshop/LabourActivitiesReport/components/report` and `Accounts/TrailBalance` |
| Backend pattern | Report pattern 5 reviewed; no backend edits because the contract is Missing |
| Routes | `/auditTrail` only |
| API | Existing root `BaseService` GET on `audittrail`; response may be `Results<AuditTrailSource>` or a complete row array to preserve the current source assumption |
| Actions | Search, Reset, Export Excel; no row actions |
| Authorization | Existing authentication/route access only; no permission API invented |
| Exclusions | No migration, backend API invention, retention policy, row mutation, browser/runtime verification, build or tests |

## Screenshot functional evidence

| Screenshot item | Classification | Implementation |
|---|---|---|
| Audit Trail title | Explicit visible evidence | Shared `app-feature-title` inside the report panel |
| From Date / To Date | Explicit visible evidence | Required typed date controls, defaulted to today |
| Record No / Record Type | Explicit visible evidence | Optional text filters |
| User | Explicit visible evidence | Optional user lookup using the existing User `GetSelect` endpoint |
| Search | Explicit visible evidence | Shared report action with translated label/icon |
| Export to Excel | Explicit visible evidence | Shared export helper over the displayed rows |
| Six table columns | Explicit visible evidence | Typed `app-data-table` columns in the same order |
| Read-only behavior | Derived from absence of row actions and screenshot | Create/details routes and dummy editor removed |
| Date values and example rows | Screenshot data only | No data, endpoint behavior or retention rule inferred from them |

## Frozen frontend contract

| Concern | Decision | Status/evidence |
|---|---|---|
| Route | `/auditTrail` only | Confirmed by report shape and existing lazy entry |
| Editor/details | None | Confirmed read-only report; the old create/details routes were unsupported dummy behavior |
| Filters | From/To dates plus optional Record No, Record Type and User | Confirmed by screenshot and existing source intent |
| Date defaults | Today for both fields | Reviewer decision under Master block 2 rule 7; matches supplied screenshot and avoids empty required search |
| Grid columns | `dateTime` (`dateTime`), `username`, `recordType`, `recordNo`, `recordAction`, `recordDate` (`date`) | Confirmed by screenshot and existing column intent |
| Actions | Search, Reset and Export Excel; no row actions | Confirmed by screenshot and report pattern |
| Transport | Preserve `audittrail` root GET; normalize known source aliases and filter the complete response locally | Reviewer decision under Master block 2 rule 7; current source already loaded all rows and attempted local filtering |
| Backend API contract | Missing | No matching source in SigmaBackend; runtime acceptance requires owner-provided/restored API contract |
| Persistence/schema | None | Read-only frontend change |

## Grid and ListVM contract

This is a report, so no backend ListVM was introduced. The displayed grid and frontend row shape are:

| Grid column | Frontend property/type | Backend ListVM property | Status |
|---|---|---|---|
| Date & Time | `dateTime: string \| null`, type `dateTime` | Missing | Frontend confirmed; backend contract missing |
| Username | `username: string` | Missing | Frontend confirmed; backend contract missing |
| Record Type | `recordType: string` | Missing | Frontend confirmed; backend contract missing |
| Record No | `recordNo: string` | Missing | Frontend confirmed; backend contract missing |
| Record Action | `recordAction: string` | Missing | Frontend confirmed; backend contract missing |
| Record Date | `recordDate: string \| null`, type `date` | Missing | Frontend confirmed; backend contract missing |

The internal `id` is only a stable data-table identity and is not displayed. No action-state, audit, tenant, editor or calculated-write fields were added to the displayed contract.

## Filter contract

| UI control | Angular property | Serialized query key | Backend lookup key | Parser/type | Default |
|---|---|---|---|---|---|
| From Date | `fromDate` | Not sent; local complete-response filter | Missing | `parseDateValue`, required | Today |
| To Date | `toDate` | Not sent; local complete-response filter | Missing | `parseDateValue`, required | Today |
| Record No | `recordNo` | Not sent; local complete-response filter | Missing | trimmed text | Empty |
| Record Type | `recordType` | Not sent; local complete-response filter | Missing | trimmed text | Empty |
| User | `user` | Not sent; local complete-response filter | Missing | lookup id | Empty |

The current code has no verified server filter contract, so no new query keys were invented. If the owner supplies a backend filter contract, the transport and this table must be revisited together.

## Conformance and implementation

| Concern | Book block | Reference symbol/file | Final source result |
|---|---|---|---|
| Route host/no page scroll | UI1 | `LabourActivitiesReportComponent` | `sigma-route-host sigma-print-flow`; no viewport calculation |
| Report shell | UI20 | `ReportPageComponent`, `ReportActionsComponent` | Shared report panel and action owner |
| Title | UI3 | `FeatureTitleComponent` | Title/subtitle/icon inside panel |
| Filter controls | UI17/UI19/UI20 | Labour Activities report filter | Typed controls, shared date picker, field errors, translated labels |
| Grid | UI5/UI6 | `DataTableComponent` | Typed `app-data-table`, no `ms-lib`/`table-list` |
| Export | UI8 | `dataTableExportRows`, `onExportToExcel` | Translated headers and currently displayed rows |
| Loading/errors | UI22 | `StateMessageComponent`, `apiErrorMessage` | Handles `isSuccess:false` and `error` for entries and users |
| Translation | UI23 | EN/AR vocabularies | Audit Trail labels and states added in both vocabularies |
| Guide | Master7 | Administration guide | `audit-trail-topic.ts` registered in `administration-guide.ts` |

## Files changed

- `SiGmaAngularFrontEnd/src/app/modules/Administration/auditTrail/list/list.component.ts`
- `SiGmaAngularFrontEnd/src/app/modules/Administration/auditTrail/list/list.component.html`
- `SiGmaAngularFrontEnd/src/app/modules/Administration/auditTrail/models/list.ts`
- `SiGmaAngularFrontEnd/src/app/modules/Administration/auditTrail/service/audit-trail.service.ts`
- `SiGmaAngularFrontEnd/src/app/modules/Administration/auditTrail/audittrail.routes.ts`
- Removed the unused dummy details component and broken legacy specs/styles under `auditTrail/details` and `auditTrail/list`.
- `SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/audit-trail-topic.ts`
- `SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/administration-guide.ts`
- Audit Trail entries in `src/app/modules/i18n/vocabs/en.ts` and `ar.ts` (these vocabulary files also contain unrelated pre-existing working-tree edits, which were preserved).

## Phases

- Phase 0 discovery/evidence: applied; screenshot and source evidence recorded.
- Phase 1 contract freeze: applied for the frontend; the backend handoff remains Missing.
- Phase 2 read/grid: applied; typed report grid, filters, local complete-response filtering and export implemented.
- Phase 3 detail/write: skipped; the screen is read-only and has no editor.
- Phase 4 domain actions: skipped; there are no domain mutations.
- Phase 5 integration/runtime: applied to the lazy route, root services, user lookup and guide registration; runtime acceptance remains pending.
- Phase 6 final reconciliation: applied source-only; backend contract and runtime verification remain pending.

## Final reconciliation

| Contract/path | Producer | Consumer | Source evidence | Status |
|---|---|---|---|---|
| Route | `pages/routing.ts` lazy `auditTrail` entry | `auditTrail_Routes` | Root route remains `/auditTrail`; child route is empty path only | Confirmed |
| Service/provider | `AuditTrailService` | `AuditTrailComponent` | `providedIn: 'root'`, root `HttpClient` through `BaseService` | Confirmed source-only |
| User lookup | `UserzService.getSelectList` | User dropdown | Shared lookup endpoint and error suppression option | Confirmed source-only |
| Report response | `AuditTrailService.getEntries` | row normalization/filter/table | Existing frontend expected `entities`; array compatibility retained | Derived/reviewer decision |
| API contract | None in SigmaBackend | frontend service | No matching backend source found | Missing |
| Grid | typed `columns` + `AuditTrailRow` | `app-data-table` + export | Same six fields and order | Confirmed frontend |
| Failure channels | service response/error | inline state/retry | Both `isSuccess:false` and `error` handled | Confirmed source-only |
| Guide | `AUDIT_TRAIL_TOPIC` | Administration guide reader | Topic imported and registered | Confirmed source-only |

## Verification

- Recipe drift check: `Generate-SigmaRecipes.ps1 -Check` passed for PLAN-00 and PHASE-00 through PHASE-06 before packet use.
- TypeScript syntax parsing passed for the changed Audit Trail and guide topic files using the installed TypeScript parser.
- Angular template parsing passed for `list.component.html` using `@angular/compiler`.
- Scoped `git diff --check` passed for the changed Audit Trail and new guide topic files.
- Checked for merge markers and stale Audit Trail `ms-lib`, `table-list`, details/create route and old spec imports; none remain.
- No build, test, lint, database, migration, browser or runtime command was run, per project instructions.

## Risks and owner verification

- Runtime is blocked until the owner confirms the `audittrail` endpoint and response fields. The normalizer supports the aliases already present in the old source (`dateAndTime`, `dateTime`, `userName`, `username`) but does not claim a backend contract.
- Run the frontend build/type-check outside this task boundary, then open `/auditTrail` in EN/AR and light/dark themes at desktop and narrow widths. Verify date typing/calendar interaction, optional filters, user lookup, retry states, complete-row filtering, export headings and report/table scrolling.
- Verify the backend returns the six displayed fields and a stable row identity/date format. If it instead owns filtering or paging, freeze that contract and update the service/filter table before changing the UI.

## Schema, migration and commits

- No entity, EF configuration, migration or database change was made. `Add-Migration` is not required.
- Suggested frontend commit: `refactor(audit-trail): align audit report with shared screen patterns`.
- Suggested documentation-layer commit: `docs(audit-trail): document report behavior and API handoff`.
- No commit or push was performed.

## Agent utilization and prohibited actions

- Subagents were not used because this was one tightly coupled frontend/report workstream with an unresolved shared API contract; delegation would add coordination risk without reducing implementation time.
- No Graphify, Sigma MCP, uncontrolled delegation, full-solution scan, build, test, lint, migration, database command, browser automation, commit, push or deployment command was run.

## Full-stack continuation — 2026-10-14

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Governing decision | Owner: «انشئ كل المطلوب سواء باك او فرونت»; generic all-entity service; interceptor |
| Frozen contract | AUDIT_TRAIL_FULL_STACK_CONTRACT_FREEZE.md |
| Frozen evolution plan | AUDIT_TRAIL_MAINTENANCE_EVOLUTION_PLAN.md |

The initial frontend-only boundary above is historical. The owner explicitly placed the missing backend in scope and requested reusable generic capture through an interceptor. Final source now has a real persisted event producer, tenant read API and server paging/full export. The old raw-array aliases, local filtering, fabricated fallback RecordDate and today default are gone. UI17's one two-month current-month range represents the screenshot's two endpoints. No unresolved Missing/Conflicting/Uncertain required business contract remains; migration and owner compilation/runtime acceptance remain pending.

### Final decisions and source evidence

| Concern | Final decision | Evidence/owner |
|---|---|---|
| Capture location | ServerAPI-configured EF SaveChangesInterceptor calling Capture<TEntity> for every eligible tracked EntityBase | User interceptor/generic request; actual SiGmaDbContext.HandleAudit and existing EF registration |
| Persistence atomicity | Audit events share one business SaveChanges batch; no second save or private transaction | AuditTrailSaveChangesInterceptor.StageAuditEntries; existing EF transaction owner |
| Existing metadata/ownership | HandleAudit remains untouched; matching claim-owned tenant events | EntityBase, Repository and HandleAudit existing contracts |
| Event data | Actor/type/action/time plus source GUID/No/nullable mapped record date; no entity field snapshots | Frozen minimal screen contract; generic Capture<TEntity> |
| Number/date | No and Date/DateOf/DateAndTime/JobDate only; absent stays empty | EntityBase.No and mapped scalar metadata; no generated-ID or event-time substitute |
| Actor | Captured ClaimTypes.Name; choices from retained captured actors | NameIdentifier already means subscription; unrelated User table is not the auth identity |
| Audit model shape | Standalone operational event, no EntityBase/CRUD/FK | Append history without soft-delete or deleting it with its source |
| API/query | Authenticated GET audittrail and GetUsers; QueryReport tenant scope | Existing report/service/controller pattern; captured actor lookup |
| Paging | Exact count before Skip/Take; 1/15 defaults, size10..100; stable Id tie | AuditTrailService.GetAsync/ThenById |
| Applied output | Server max-event cutoff on Search, same cutoff/filter/sort for page requests and full Excel | SnapshotId response/query; fetchAllPages rejects any failed page |
| UTC | Stored UTC event time, no-offset wall-clock display/filters explicitly labeled UTC; source RecordDate remains its calendar date | Capture UtcNow; DTO kind Unspecified; shared formatDisplayDate |
| UI/report | Shared hosts/title/filter/grid, no local CSS, primary form submit | ReportPage/ReportActions/FeatureTitle/DataTable, UI17 range |
| API failures | One inline error owner, suppressed interceptor presentation, retries and reactive restoration | Both service failure channels; getEntries/getUsers X-Skip-Error-Interceptor |
| Readonly/history | No create/edit/delete endpoint or screen; existing scaffold routes removed | Old details was only `details works!`, create handler had no visible button |
| Schema bounds | Exact unbounded source No/claim preserved via nvarchar(max); stable type/action bounded256/16 | Generic source contract; explicit BE18 compatibility decision, no silent truncation |
| Mapping/calculations | Direct SQL read projection; no AutoMapper, financial calculation or write DTO | Only displayed DTO properties plus Id; backend owns event data |

### Final grid beside DTO

| Column/type | Angular field | AuditTrailRowDto field |
|---|---|---|
| Date & Time (UTC) / dateTime | dateTime | DateTime |
| Username / text | username | Username |
| Record Type / text | recordType | RecordType |
| Record No / text | recordNo | RecordNo (nullable) |
| Record Action / translated status | recordAction | RecordAction: Created/Modified/Deleted |
| Record Date / date | recordDate | RecordDate (nullable) |
| Internal grid identity only | id | Id |

SubscriptionId and source RecordGuid remain storage-only. No backend generic ListVM or oversized details/writes were created.

### Final filters, paging and actions

| Control/need | Request key | Backend owner/type/default |
|---|---|---|
| Combined From/To calendar | Filters[fromDate], Filters[toDate] | Strict yyyy-MM-dd ordered UTC event days; upper-exclusive next day; end<9999-12-31; current month UI default |
| Record number substring | Filters[recordNo] | Optional trimmed text; omitted null/empty |
| Record type substring | Filters[recordType] | Optional trimmed text; omitted null/empty |
| Captured user | Filters[user] | Optional exact Username string; omitted means all actors |
| Page/size | pageNo, pageSize | Defaults1/15, size clamped10..100, invalid page/overflow rejected |
| Sort | Filters[sortField], Filters[sortOrder] | Six column allowlist, direction1/-1, same-direction Id tie |
| Event cutoff | snapshotId | Initial tenant maximum Id,0 when empty; retained for paging/retry/export; Search resets |

Form-bound typed date/user/text controls serialize through toListParams. Bound dictionary identity remains an auto-property until MVC validation; NormalizeFilters runs afterwards. New valid paging supersedes an in-flight request through switchMap/defer; a size-only change loads again, identical query state skips. Search/Reset cannot race export. Applied-filter description includes both dates, optional text and the actual actor; draft filters do not silently change retained output. URL persistence uses existing readListRoute/writeListRoute and restores a new server cutoff on revisiting.

| Reference action | Classification | Reason/target |
|---|---|---|
| Search | Supported | New server query plus new cutoff |
| Reset | Supported | Current month/all actors, page1 |
| Refresh/retry | Supported through Search and inline Retry | Search includes newer events; Retry repeats applied state |
| Excel | Supported | Every matching server page, same cutoff/sort, translated displayed columns; failure aborts output |
| Print | Not Applicable in this scope | Screenshot and original component expose Search/Excel, no operational print workflow was requested |
| CRUD/mutation | Not Applicable | Read-only operational history; dummy editor had no implemented record workflow |

### Files added/changed in this continuation

SigmaBackend:

- SiGma.Helpers/Models/Administrations/AuditTrailEntry.cs
- SiGma.DataAccess/Configuration/AuditTrailEntryConfig.cs
- SiGma.DataAccess/Auditing/IAuditTrailCaptureService.cs
- SiGma.DataAccess/Auditing/AuditTrailCaptureService.cs
- SiGma.DataAccess/Auditing/AuditTrailSaveChangesInterceptor.cs
- SiGma.Helpers/Dtos/AuditTrail/AuditTrailRowDto.cs
- SiGma.Helpers/Dtos/AuditTrail/AuditTrailUserDto.cs
- SiGma.Helpers/Dtos/AuditTrail/AuditTrailResults.cs
- SiGma.ViewModels/ViewModels/AuditTrail/AuditTrailFilterVM.cs
- SiGma.Business/IServices/IAuditTrailService.cs
- SiGma.Business/Services/AuditTrailService.cs
- SiGma.ServerAPI/Controller/AuditTrailController.cs
- SiGma.ServerAPI/Program.cs: only explicit scoped capture/interceptor registration and AddInterceptors; retained peer StartupWarmupService work.
- SiGma.Helpers/Localization/Shared/GeneralMessage.resx and GeneralMessage.ar-SA.resx: five AuditTrail keys only; preserved other dirty content.

Frontend:

- auditTrail/list/list.component.ts/.html, auditTrail/models/list.ts, auditTrail/service/audit-trail.service.ts, auditTrail/audittrail.routes.ts.
- Previously removed dummy auditTrail/details component/spec and empty styles/broken list boilerplate spec remain removed; no functional test or detail feature was removed.
- Toolbar component: Audit Trail alone added to existing title suppression so only the in-card FeatureTitle renders; existing other feature suppressions preserved.
- audit-trail-topic.ts; Administration guide topic registration; Audit Trail EN/AR vocab block. Existing unrelated guide/vocabulary/icon changes preserved.

Documentation:

- Canonical backend18 generic audit section, backend preamble0.79 and CHANGELOG; required screen-refactor skill digest+history.
- Frozen full-stack contract, evolution plan, this reconciliation and bounded capture/API worker notes.
- PLAN-00 and PHASE-00 through PHASE-06 regenerated only by Generate-SigmaRecipes.ps1; -Check green. Semantic diff is backend0/backend18 fingerprints only (two lines per packet), with reference roles and task instructions unchanged. No generated file edited directly.

### Final source conformance and responsive matrix

| Concern | Actual reference/owner | Final source comparison | Result |
|---|---|---|---|
| Shell/title | Customers Statement + shared ReportPage; TrialBalance + family shell | Exact shared report fill/panel classes, FeatureTitle direct child; AuditTrail toolbar suppression | Source conformant |
| Filters | UI17 date-utils/DatePickerDirective; UI20 shared styles | One two-month calendar, currentMonthRange, no extra calendar trigger or wrapper CSS; stable shared controls and label ids | Source conformant |
| Table | DataTable typed public inputs, global sigma-list-table/report context | Server lazy=true, fill=true, authoritative total, standard pager; six same DTO/export fields | Source conformant |
| Submit/errors | PrimaryActionButton type submit + ReactiveFormsModule; shared API helpers | Single ngSubmit, busy guards, no error/toast duplication, drafts retained and retries | Source conformant |
| Interceptor | Installed EF10.0.9 XML signatures; HandleAudit order before base save | Entries<TEntity> detects changes, success/failure/cancel cleanup only staged events, no nestedSave or business field rewrites | Source conformant; runtime pending |
| Tenant reads | Repository.QueryReport<T>() | Standalone event has SubscriptionId; invalid tenant query stays empty; no source-delete filtering of audit history | Source conformant |
| Registration | Existing Business AsImplementedInterfaces scan; Program AddDbContext | New read interface registered by scan; explicit scoped capture/interceptor, no service record data carriers | Source conformant |
| Translations | Canonical parity checker + scoped TS AST |26 leaf audit keys match EN/AR including three action labels; five backend RESX keys paired and XML-valid | Source conformant |
| Guide | Existing reader Administration registry and sidebar route | AUDIT_TRAIL_TOPIC registered once; /UserGuide/administration and /auditTrail operational link | Source conformant; reading/visual acceptance pending |

| Width/state | Shared source behavior reviewed | Owner acceptance pending |
|---|---|---|
| >640px wide/intermediate | Report flex fields170px minimum/300px max, wrapping; shared fixed title/actions/pager and rows-only scroll | Desktop/intermediate/long actor and record text |
|640px and below | Shared single-column filter stack, full-width controls and wrapped/two-column actions; route fills shell | Both sides640px, phone/two-month overlay placement |
| All intervals | Shared stable dropdown/calendar roots, reserved date feedback, logical insets/themes and internal table horizontal/vertical scroll | Short-height devices, EN/AR, RTL, light/dark, validation/failure content |

No visual or runtime pass is inferred from these source rules. No feature CSS, viewport calc, shared palette fork, ad hoc date parser or local all-page export loop remains.

### Verification, risks and owner handoff

- Complete scoped frontend/Backend source and diffs reviewed separately from their real repositories; new files reviewed as full sources. Preserved dirty toolbar/guide/vocabs, Program/resource keys and unrelated migration/model-snapshot work. Syntax parsing of target TS and template passed; exact shared exports/standalone registration/public inputs/base members inspected. No application type-check/build claim.
- Scoped git diff --check, scoped markers/whitespace/import/type/route/provider scans, bilingual checks and RESX XML passed. Installed EF declarations confirm callback signatures and Entries<TEntity> change detection. Query/DTO/filter/sort/count/snapshot and export pipeline compared end to end; no unsupported response aliases or date fallback.
- Required skill digest/book learning synchronized. Recipe -Check passed initially and after generator refresh; derivative diff reviewed semantically.
- Schema: one new table only, identity int Id, required SubscriptionId/dateTime/actor/type/action/sourceGUID, nullable RecordNo and RecordDate; RecordType256/RecordAction16, actor/No nvarchar(max), tenant/date/Id index, no source FK. No existing column is dropped or changed. Suggested unused migration name checked: `Add-Migration AddAuditTrailEntries`. Owner applies migration **before running saves with the interceptor**, otherwise saves fail atomically because the table is absent. No historical backfill is fabricated.
- Capture covers tracked subscription-owned EntityBase saves through the ServerAPI-configured DbContext, including tracked children. Global references, unconfigured contexts, SQL/bulk operations and other auth systems are explicit limits. Existing auth claim convention and raw DbContext/connection configuration remain outside this feature refactor.
- Event-ID cutoff is an append boundary, not database snapshot isolation; concurrent in-flight transaction commits still need owner acceptance. Caller transaction rollback, failure/retry, cancellation, no-op, SaveChanges(false) and sync/async affected counts require owner runtime verification.
- Owner steps: generate/apply the migration; build both repos; verify API/startup/new empty history, create/update/soft-delete at least two existing entity types, child rows, failed save/rollback/retry, tenant separation and no duplicate events. On /auditTrail verify month range/manual dates, optional actors, sorting/size-only/new paging, pending read cancellation, complete Excel (>100 rows) and failed later page. Check no field-value secrets are persisted. Read the bilingual module guide. Exercise desktop/intermediate/mobile boundaries, long values, RTL and both themes.
- Phases: PLAN-00 plus0/1/2/5/6 applied;3/4 skipped because audit UI exposes no record writes/domain actions. Capture is shared persistence integration under the frozen contract, not a new business mutation UI.
- Suggested SigmaBackend commit: `feat(audit-trail): capture and query tenant audit events`.
- Suggested SiGmaAngularFrontEnd commit: `refactor(audit-trail): use server paging and complete audit exports`.
- Suggested documentation commit: `docs(audit-trail): document generic capture and screen contracts`.
- Team after freeze: two bounded sol_worker agents, selectable gpt-5.6-sol, one persistence/interceptor and one read API/localization; root owned frontend/guide/books/integration/scoped diff. No overlapping file writes. Parallel backend and frontend work reduced waiting while root retained contracts/reconciliation. Root found/corrected backend namespace/sort parsing, inherited query model and narrowing capture string bounds before accepting integration.
- No build, test, lint, database command, migration creation/run, browser automation, application verification, Graphify, Sigma MCP, commit, push or deployment ran. No migrations/model snapshots were edited by this task.

Final source check refresh: after inline date-feedback deduplication and four-digit calendar-boundary checks, the frontend syntax/template/import/translation and complete scoped whitespace review was refreshed. Last frontend verification:9 TS files,1 HTML template,26 AST leaf keys EN/AR, no syntax/template/missing-key findings. Twelve new backend sources have zero trailing whitespace/marker findings; five paired backend resource keys are XML-valid. No additional build/runtime command was authorized or run.

### Owner continuation: focused recovery reconciliation (2026-10-14)

Status remains **Implemented — source-only**; owner verification pending **yes**.

- Re-read the canonical entry point and the screen skill; recipe `-Check` passes for PLAN-00 and PHASE-00 through PHASE-06. This continuation uses the existing frozen report/interceptor contract and UI8/22 recovery owners. It introduces no API/schema/business-contract change or new reusable rule requiring book/skill promotion.
- `AuditTrailService.GetAsync` now compares the supplied captured User without trimming it. GetUsers returns the preserved actor claim verbatim; trimming that exact identity could make a selected historical actor with surrounding spaces return no rows. RecordNo/RecordType retain their documented trimmed substring behavior; blank User still means all actors. SQL equality/case behavior remains the configured database collation.
- `AuditTrailComponent.exportExcel` now catches synchronous grid-row formatting/workbook/file-creation exceptions inside its next callback, shows the existing translated `auditTrail.exportError`, and keeps applied filters/results available for Retry. HTTP/declared page failures retain composedReadErrorMessage; arbitrary file-library diagnostic messages are not displayed. The same finalize still restores form, busy state and global loading on completion. No partial-page export is introduced.
- Updated the existing EN/AR audit-trail-topic export step to explain file-creation error and Retry. Registration remains the existing Administration guide; no new guide or route.
- Source-reviewed all capture callbacks (sync/async, success/failure/cancellation), the existing HandleAudit ordering, UOW numbering before SaveChanges, affected-count subtraction, tenant report predicate, filter/sort/cutoff projection and full-page output. No additional confirmed interceptor defect was found in these inspected paths. Failure/retry/rollback and SaveChanges(false) still require actual owner runtime acceptance.
- Refreshed syntax-only parsing: five Audit Trail TS sources and one HTML template, zero diagnostics. Scoped git diff --check is clean; warnings concern existing LF/CRLF normalization only. Full tracked auditTrail diff and all new backend audit sources were inspected; peer changes in Program/resources/guide remain preserved. Backend actor correction is source-reviewed, not compiled.
- Only root performed this small, tightly coupled follow-up; existing bounded backend workers were not restarted. No build/test/lint/browser/database/migration/commit/push/deployment was run and no migration/model snapshot was touched. Owner schema/build/runtime steps and suggested migration/commit names above remain applicable.

### Owner defect: only Created recorded (2026-10-14)

Status **Implemented — source-only**; owner verification pending **yes**. The
owner reports missing Update/Delete across several screens and asks for the
shared interceptor correction. No exact entity/request trace was supplied;
runtime reproduction is not claimed. The frozen contract now records the
explicit write-classification correction without rewriting the original freeze.

Confirmed source defect: base Service.UpdateCoreAsync reads AsNoTracking, maps
the edited snapshot and calls Repository.Update; UpdateListAsync similarly uses
UpdateRange. EF OriginalValues for those newly attached snapshots are the
current values, not the database baseline. The capture service incorrectly
required original/current inequality in addition to IsModified, so valid
pending UPDATE writes could be discarded. Official source evidence:
[Accessing tracked entities](https://learn.microsoft.com/en-us/ef/core/change-tracking/entity-entries)
and [EF10.0.9 write-state flags](https://github.com/dotnet/efcore/blob/v10.0.9/src/EFCore/ChangeTracking/Internal/InternalEntryBase.cs).

AuditTrailCaptureService now follows the pending scalar write flags and
classifies a marked true IsDeleted write as Deleted after HandleAudit's
soft-delete conversion, without requiring a reliable original deletion flag.
No database read, EF original-value mutation, new business write or schema
change was introduced. Interceptor sync/async staging, successful-save atomicity,
failure/cancellation cleanup and affected-count compatibility are retained.

| Inspected save state | Final metadata action | Source evidence |
|---|---|---|
| Added tenant entity | Created | GetAction first branch |
| Tracked scalar update | Modified | Modified state + scalar IsModified |
| Detached Update/UpdateRange, original equals current | Modified | Original/current comparison removed |
| Physical Deleted | Deleted | Deleted branch precedes Modified |
| Remove converted to soft delete | Deleted | HandleAudit marks IsDeleted true; IsSoftDeleteWrite |
| Explicit true deletion-marker write, even if original is true | Deleted | Pending true marker owns classification |
| Already-deleted tracked row updating another scalar only | Modified | IsDeleted not marked; other pending scalar |
| Unchanged tracked save | No event | Interceptor eligibility/GetAction state guards |
| Failed/canceled save | No committed event | Same save transaction and staged-event cleanup |

Forced UPDATE writes count even when the old persisted value is the same;
the earlier broad no-op exclusion is superseded only for explicit writes.
All other capture coverage and future-only history limits remain. The UI action
contract stays Created/Modified/Deleted, not new Update/Delete enum aliases.

Changed source: DataAccess/Auditing/AuditTrailCaptureService.cs and the existing
EN/AR UserGuide/content/audit-trail-topic.ts action explanation. BE18, backend
version0.82/CHANGELOG and the skill rule/history are synchronized. PLAN-00 and
PHASE-00..06 regenerated via the generator; semantic diff changes backend0/18
fingerprints only, preserving all task/reference content. Recipe -Check passes.
Scoped source/whitespace/marker review passes; guide syntax parser has zero
diagnostics. Existing peer HTTP/message-log book/source changes are preserved.

No new migration is needed for this correction. Owner: rebuild/restart the API,
create then update and delete records in two eligible screens, and perform a
new Audit Trail Search (paging retains the old cutoff). Confirm Modified and
Deleted events, soft-delete history retention, no ordinary unchanged-save event,
and failed-save/retry atomicity. Build/runtime remains pending; no prohibited
commands ran. No subagents were used for this one-file coupled fix. Suggested
backend commit: `fix(audit-trail): capture modified and soft-deleted writes`.

### Owner presentation: actions beside filters (2026-10-14)

Status **Implemented — source-only**; owner verification pending **yes**.
Owner requests buttons and search controls on one row. Reused UI20's existing
inline report strip: four filter tracks plus auto actions, with the public full
template weighting date1.6 and the other three fields1 each. The canonical
Journal action-field/caption/ReportActions/inner-group composition reserves the
label height and aligns buttons with the controls rather than date feedback.
Reset/Excel/Search order, handlers, form submission and busy gates remain.

Responsive source matrix: above1250px five grid cells share one row;641..1250px
uses shared three-column wrapping;<=640px single-column fields and shared
two-column action group. Shared min-width0, stable calendar/dropdown roots,
logical alignment, theme tokens and date validation reserve are retained.
Owner visual/Arabic/RTL/theme/short-height acceptance remains pending.

Changed list.component.html and the existing bilingual audit-trail-topic guide
step; recorded the owner direction in the frozen contract. This is adoption of
an existing public layout capability, so no new book/skill rule or generated
packet mutation is needed. Recipe -Check passed before packet use. Template and
guide syntax parsers return zero diagnostics; full scoped HTML diff and guide
source reviewed; diff --check clean. No build/test/lint/browser/database/
migration/commit/push/deployment ran. Root-only small presentation change.
Suggested frontend commit: `style(audit-trail): align filter actions inline`.
