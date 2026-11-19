# Custom Lookups — confirmed fixes and final reconciliation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |
| Frozen handoff | `CUSTOM_LOOKUPS_SCREEN_CONTRACT_FREEZE.md`, including appended source corrections |

## Result and scope

Implemented the requested review and confirmed documentation fixes in the existing CustomLookups feature. The old ms-lib list and routed editor are replaced in place with the approved shared list and controlled single-section modal for Create/View/Edit. Existing No and Name fields, their View links and CRUD intent remain. Name is the only editable input. The existing source tree contained many unrelated owner changes, including icon edits in the scoped old details component; those action/icon semantics are retained through the shared owners. Unrelated changes in common files remain untouched.

Phase0 evidence/discovery, Phase1 contract freeze, Phase2 list, Phase3 editor, Phase4 Delete, Phase5 integration and Phase6 source reconciliation applied. No report, upload, child collection, financial calculation or state transition applies. A Maintenance/Evolution Plan was not required for this bounded conformance change. The screenshot is functional evidence, never layout authority.

## Evidence and decisions

S1 (`C:/Users/user/Desktop/custom lookup.png`) shows title, Name, Add, Actions, paging and a Custom Field selector. The frozen artifact records their classifications. Add/Name/paging are Explicit and supported by current source. Exact action-menu contents and state transitions are not proved by the static image; existing source supplies View/Edit/Delete. No sample names were seeded.

The Custom Field selector is visible but has **Missing** option/source/relationship contracts. The user asked to implement documented fixes, without explicitly asking to complete missing screenshot business. It is recorded and deferred: the existing CustomLookup has only Name, and CustomFieldType.Input is a settings input-kind enum, not a category master. Do not repurpose it or promise the selector in the user guide. This unresolved extension does not block the frozen confirmed-fixes scope; full screenshot parity is not claimed.

| Decision | Evidence / final source |
|---|---|
| UI type01/modal | fields only; UI13 D4-2; shared EditorDialog controlled composition |
| Backend Pattern1 | EntityBaseWithName; BranchService base hooks; no children/totals |
| Exact grid vs ListVM | Actions(shared), No(text/link), Name(text/link) ↔ Angular `{id:number,no:string\|null,name:string\|null}` ↔ backend `{Id:int,No:string?,Name:string?}` |
| Lean detail | Detail `{Id,No,Name}`; No/Id identifies subtitle, Name renders View text |
| Editable payload | POST `{name}`, PUT `{id,name}`; no tenant, audit, flags, No or derived inputs |
| Name validation | trimmed/required/max250 in Angular and both server writes; existing Add limit selected; Update's old50 raised locally to250 |
| Business key | tenant/live Name uniqueness via base UniqueColumns and filtered EF unique index; no lower-case conversion or invented comparison |
| Delete | shared confirmDelete, existing ID, shared RemoveWithChildrenAsync inbound-reference/existence gate |
| Discard | deferred confirmDiscard + freezeFormState, same session checks, Cancel/X/Escape/navigation; pending generation/preview prevents exit |
| Style ownership | shared shell/title/filter/grid/editor/form-section/error owners, no feature stylesheet |
| API/injector | existing generic routes and root BaseService/HttpClient; redundant LayoutModule CustomLookup providers removed |
| Feedback | reads suppress global error UI and render inline Retry; writes use global mutation success/error owner, restore draft/row |
| Translation | matching customLookup block,22 keys in EN and AR; correct PrimeNG `{totalRecords}` report placeholder |
| No calculations | no money/tax/totals or client-derived write fields |

List filters are No and Name text → trimmed `Filters[no]`, `Filters[name]`, omitted when empty. Both use inherited property Contains filtering; AND across nonempty filters. Flags, dates, enums and multiselect parsing do not apply. PageNo/PageSize remain top-level. `Filters[sortField]`/`Filters[sortOrder]` use No/Name from the column whitelist; initial Id descending is the confirmed generic default. Shared base `GetManyAsync` filters before CountAsync, orders with Id descending tie-breaker, then Skip/Take. NormalizePaging clamps supplied sizes1–100; reviewed UI offers10/15/20/50/100, defaults15, and its shared interceptor enforces the existing10-row UI minimum. Response carries real TotalCount and TotalPages; no manufactured count.

Applied query snapshots survive unsent filter edits, paging, editor close, mutation refresh and explicit Excel output. `resolveListPaging` executes before signal writes; size-only changes fetch. `switchMap` cancels superseded list reads. Failed list reads clear stale rows and suppress the empty state. Successful Delete recounts and clamps a now-empty final page. Explicit Excel uses shared fetchAllPages at100/page and shared dataTableExportRows for the displayed No/Name columns; any page failure rejects the output. Ordinary list paging never loads all pages.

### Actions and endpoint coverage

| Action | Backend → UI path | State / recovery |
|---|---|---|
| Create | inherited IService.AddAsync/Service; POST CustomLookup `{name}` → createLookup → modal Save | editable ready draft; successful response closes then refreshes applied list; failure retains draft |
| View | inherited DetailWithNavigationsAsync; GET CustomLookup/GetByWithNavigationsId/{id} → getDetails | existing tenant record; Name read text, No/Id subtitle; failure blocks Save and offers Retry |
| Edit | same GET; inherited UpdateAsync; PUT CustomLookup `{id,name}` → updateLookup | loaded ready record; same modal; View footer Edit supported; failure keeps values |
| Delete | ICustomLookupService inherited RemoveAsync → target override → RemoveWithChildrenAsync; DELETE CustomLookup?id={id} → deleteLookup → confirmDelete | no special state flag; live owned record/no EF inbound reference; confirmed only, repeated execution blocked, failure retains row, success refreshes current query |
| Discard | UI only → confirmDiscard | dirty editable draft only; frozen pending decision; decline preserves values/dirty state; view/pristine closes directly |
| Search/Reset/Refresh/Paging/Export | confirmed list GET | UI operations, not domain transitions; retained applied snapshot |

Approved Job reference action inventory: View/Edit/Delete and Create Supported as generic counterparts; labour time, invoice customer, Close, Cancel, quality check, log, estimation, print gate pass and lubrication job are each Not Applicable because CustomLookup has no Job aggregate, work state, labour, estimate, quality/history, document or invoice relationship. No activate/deactivate UI is inferred from generic inherited endpoint availability. No permission API invented. Authorization candidate inventory: Create POST CustomLookup, Edit PUT CustomLookup and Delete DELETE CustomLookup for future authorization design; current application remains authentication plus backend tenant/validation, with no new restrictions claimed.

### Overrides, mapping and persistence

Only target service overrides are `UniqueColumns` (real Name business key) and `RemoveAsync` (reference-aware shared delete). Generic reads, Add/Update, mapping/save and controller methods remain inherited. No SearchColumns needed for the exact No/Name property filters. Target controller has no override. Four one-way maps only: Entity→List/Detail and Add/Update→Entity; removed all four ReverseMap calls, no speculative Ignore.

Add/Update reach one SaveChanges on success and zero on invalid/missing input. The base UniqueColumns write guard retains its existing transaction/application lock for serialized uniqueness (no feature transaction added). Delete reaches one save on success, zero on missing/in-use; shared helper uses EF implicit transaction. No aggregate-child reconciliation applies. Tenant/live scope and ownership are repository-owned; centralized TrimIncomingStrings owns server trimming. Same-record concurrent edits retain existing last-write-wins semantics; no row version was invented.

## Files changed by this task

Paths relative to `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- `src/app/modules/Administration/CustomLookups/components/list/list.component.ts` and `.html`.
- `src/app/modules/Administration/CustomLookups/components/details/details.component.ts` and `.html`.
- `src/app/modules/Administration/CustomLookups/models/create.ts`, `details.ts`, `list.ts`.
- `src/app/modules/Administration/CustomLookups/services/customlookup.service.ts`.
- `src/app/modules/Administration/CustomLookups/customlookup.routes.ts`.
- Removed the two empty feature SCSS files and two invalid scaffold spec files (wrong/missing component symbols; no meaningful feature coverage).
- `src/app/_metronic/layout/layout.module.ts`: only remove CustomLookup import/two duplicate providers; existing unrelated removals preserved.
- `src/app/_metronic/layout/components/toolbar/toolbar.component.ts`: only CustomLookup duplicate-title predicate; other pending predicates preserved.
- `src/app/modules/i18n/vocabs/en.ts`, `ar.ts`: only22-key customLookup block; other pending feature translations preserved.
- `src/app/modules/UserGuide/content/administration-guide.ts`: one bilingual Custom Lookups topic; all existing topics preserved.

Paths relative to `F:/My Work/Sigma/SigmaBackend`:

- `SiGma.Business/Services/CustomLookupService.cs`.
- `SiGma.Business/MapperConfig/CustomLookupProfiler.cs`.
- `SiGma.DataAccess/Configuration/CustomLookupConfig.cs`.
- `SiGma.ViewModels/ViewModels/CustomLookup/CustomLookupAddVM.cs`, `CustomLookupUpdateVM.cs`, `CustomLookupListVM.cs`, `CustomLookupDetailVM.cs`.
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx`, `GeneralMessage.ar-SA.resx`: only CustomLookupNameExists added; prior entries preserved.

Local review records: this file and `CUSTOM_LOOKUPS_SCREEN_CONTRACT_FREEZE.md`. No canonical book/skill change or new shared extraction was needed: every repeated presentation, paging, all-pages output, error, confirmation and form-freeze concern reused its existing shared owner. Business-specific request orchestration remains feature-owned. No generated packet was edited or refreshed; recipe -Check passed all eight packets initially and at reconciliation.

## Source conformance and final reconciliation

| Concern / book | Target consumer and actual producer | Compared result |
|---|---|---|
| Bounds/title UI1/3 | CustomLookups host/list template → styles.scss sigma-route-host/sigma-list-page/panel/header/table and FeatureTitle | container fill/min-height0/overflow hidden; one grid row scroll owner; shared8px title/filter/table inset, title8px bottom; no page calc or local CSS; toolbar duplicate suppressed |
| Filters/actions UI4 | filterForm/template → FilterPanel/FilterActionsDirective | two real controls, stableLayout=true, mainColumns2,34px shared controls, shared Reset, Search submit, own actions; no private strip palette/spacing |
| Table UI5/6 | columns/onLazyLoad/service → DataTable/resolveListPaging/generic Service.GetManyAsync | one lazy fill=true table; No+Name View links retained, action column first; totalCount and sort/size snapshot matched; translated report/empty |
| Editor UI13/15/19 | DetailsComponent/template → EditorDialog/FormSection/FieldError | same Create/View/Edit, controlled visibility, default1040px shared shell width/max bounds, contentPadded=true; form/body/scroll flex-fill; one Name section/one column; View read text, no Save |
| State UI22/28 | bindListQueries/loadDetails/save/deleteRecord → StateMessage/api-error/root interceptors | both failure channels handled; read error header present; one feedback owner; every local start has finalize end; old reads cancelled or session-checked |
| Confirm UI9/10 | canDeactivate/requestClose/confirmDelete → ConfirmationDialogService/freezeFormState | identity shown for Delete, deferred one-shot discard, frozen controls while pending, declined decision restores same draft, generation/preview public pending gate |
| DTOs/mapping BE3/4/7 | Angular models/service/form → CustomLookup VMs/Profile | Id/No/Name reads exactly, Name and Id+Name writes, numeric identity, no inherited audit/tenant/flags or reverse maps |
| Validation/delete BE8/13 | Name input/UniqueColumns/config/RemoveAsync → base checks/repository/shared delete | required250 parity, live tenant duplicate/exclude-self/index, shared existence/reference-aware delete; no invented FK/category |
| Route/providers UI1/26 | pages/routing.ts CustomLookup lazy route → list-only customlookup.routes/guard; root service → AppModule HttpClient | legacy create/details routes removed with no external operational consumer found; closed(bool) refreshes once; root token/error interceptors and environment URL retained |
| Guide Master7 | ADMINISTRATION_GUIDE topic → existing GuideReader and Administration menu | EN/AR purpose, prerequisites, search/output, CRUD, limits, dirty exit, mock pending, Retry and missing category availability agree with final source |

All rows establish source conformance only. Angular/C# compilation, actual database behavior, keyboard/focus, responsive/visual acceptance are pending, not certified by this table.

### Responsive acceptance matrix

Inspected actual shared styles, including later selectors: styles.scss route/editor chain; FilterPanel stable/responsive/collapse selectors; FeatureTitle and EditorDialog public defaults. The target has no stylesheet or private breakpoint rule.

| Range/boundary | Expected arrangement from shared source | Owner acceptance |
|---|---|---|
| >1250, e.g.1440/1672 | two filter tracks; title/actions normal row; grid fills remaining bounded card | pending |
|1250/1249 to1200 | shared three filter tracks with two occupied fields; fixed action toolbar, no feature override | pending |
|1199.98 and intermediate1024/900 | same shared tracks; Filters disclosure available, expanded by default, collapse preserves mounted state | pending |
|767/766 | dialog uses shared narrow width calc100vw−16px instead of94vw; bounded body and fixed footer | pending |
|721/720/719 | filters transition to one field column and shared toolbar stacking; shared page padding reduces | pending |
|651/650/649 and narrow390/320 | title/actions wrap coherently, shared compact primary action sizing, filter actions retained, grid scroll internal | pending |
|short height, EN/AR and both themes | shared max-height and flex-fill allow body/rows to scroll with title/filters/pager/footer fixed; logical edges and themed controls | pending |

No private CSS inconsistency found in scope. Source cannot prove long-label fit, no page overflow or focus restoration; exercise every interval in owner acceptance, including error and validation states.

## Verification and remaining owner work

- Both Git repository roots resolved with rev-parse; complete scoped feature/backend diffs reviewed separately, including shared-file task hunks and preserved unrelated changes.
- Source syntax parsing:12 TypeScript files and2 Angular templates, zero parser errors. This used createSourceFile/parseTemplate only; **not** a compiler, build, test or type-check pass.
- Current shared imports/exports and standalone registrations/inputs were read directly; no stale ms-lib/ListCol/ColType/any/server-owned payload fields, merge markers or private styles remain in the feature.
- Check-Translations `-Block customLookup`:22 EN/22 AR; zero missing or case-only differences. Both backend resources parse as XML with exactly one CustomLookupNameExists entry per language.
- Scoped git diff --check passed in both repositories (line-ending conversion notices only).
- Recipe -Check: all eight packets current. No canonical edits, generator writes or pending packet refresh.
- Independent bounded source audit found no actionable mismatch in frontend contracts, async Save/discard/Delete flow or retained View links.

### Migration required

Owner command: `Add-Migration AddCustomLookupNameConstraints` (no existing migration filename collision found).

Schema impact is EF Name max250 and unique filtered `(SubscriptionId,Name)` where IsDeleted=0. Entity property/nullability is unchanged, no column removed, no relationship retargeted. Before applying, inspect Names longer than250 and duplicate live Names under the real DB collation, including multiple live null Names per tenant affected by this exact index. Decide any cleanup separately; this task did not rewrite/delete/backfill rows. Existing constraints/data may prevent applying the migration until resolved. The50→250 Update validation correction is an API change, independent of the EF storage constraint.

Owner verification:

1. Build frontend/backend; verify matching lean responses and authenticated GET/POST/PUT/DELETE without recording tokens. Confirm header/culture/error/success single-owner behavior.
2. After schema/data review and owner migration, Create/Edit a valid name, blank/whitespace,250/251 characters and duplicate name; verify tenant separation and duplicate edits excluding self.
3. Search No/Name, sort both directions, page/change size15→20 on page1, edit filters without Search then Refresh/Save/Delete/Export; verify applied scope and last-page clamp. Compare Excel full count/columns/EN-AR headers to all matching rows.
4. View/Create/Edit, Retry failed reads, fail declared and HTTP writes, confirm draft/row retention. Exercise Cancel/X/Escape/route with clean/dirty forms; decline discard, verify original values and enabled state. Finish/cancel mock generation/preview before Save/leave.
5. Delete confirm/decline, missing/already-deleted row and actual referenced record if such a relationship exists; no duplicate execution. No speculative test data was created by the reviewer.
6. Validate focus entry/trap/first invalid/return, RTL/themes, every responsive interval above and short height. Verify the module guide topic/navigation/print using the existing reader.

User guide: `src/app/modules/UserGuide/content/administration-guide.ts`, topic titleKey `customLookup.title`, operational route `/CustomLookup`; module guide `/UserGuide/administration`, existing Administration sidebar guide link in sidebar-menu-data.ts and GuideReader ADMINISTRATION_GUIDE import. No new reader/menu entry. Screen topics and instructions are bilingual and source-matched; reading/navigation/RTL/theme/print acceptance pending.

Suggested commits (stage only this task's listed files/hunks; do not include unrelated pending work):

- SiGmaAngularFrontEnd: `refactor(custom-lookups): adopt shared list and modal editor`
- SigmaBackend: `refactor(custom-lookups): align DTOs and enforce tenant name uniqueness`

Agent utilization: one inherited-model sol_worker role implemented only the backend CustomLookup/config/VM/profile and one resource key per language after the root froze contracts. It then performed a bounded read-only frontend audit. Root owned all frontend, evidence/contracts, integration and complete scoped-diff/final reconciliation. Two independent nonoverlapping workstreams reduced elapsed time without duplicating broad discovery; model inheritance honored current orchestration support. No second implementation agent or overlapping ownership.

No builds, tests, lint, migrations, snapshots, database commands, browser/application automation, Sigma MCP, Graphify, commits, pushes or deployment were run. No external data was changed. Existing pending migrations/snapshot edits belong to earlier workspace work and were preserved.
