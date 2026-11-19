| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |

# Voucher Reasons feature review

## Manifest

User requests review and implementation according to Sigma documents. Scope: VoucherReasons Angular feature, directly related VoucherReason API/VM/maps, feature translations, exact LayoutModule service entries, existing Administration guide registration and new screen topic. Preserve existing unrelated dirty tree; scoped pre-existing details changes add Save/Cancel/Delete/Edit icons, retained through shared button owners. No screenshots/video/notes. UI type01 controlled list/modal; BE pattern1 normal entity. Contract: `VOUCHER_REASONS_FRONTEND_BACKEND_CONTRACT_FREEZE.md` (Frozen). No maintenance/evolution plan required: bounded canonical adoption with known contracts, no ambiguous cross-cutting behavior.

Authority read: canonical AGENTS, sigma-screen-refactor digest, Master blocks0–8, applicable UI/BE blocks and screen catalog. Recipe -Check passed all8 packets; PHASE00–06 selected, semantic roles checked against catalog01 (Job list, shared controlled EditorDialog, Branch normal entity). No packet regeneration needed.

## Findings before implementation

| Finding | Evidence / owner | Impact / confidence | Resolution |
|---|---|---|---|
| Legacy table-list/ms-lib and any[] | list.ts/html; UI5/6, phase2 | Contract/layout; confirmed | Shared typed DataTable, filters, total, pager, sort, all-pages export |
| Routed single-field editor | routes/details; UI1/13, phase3/5 | Consistency/exit-state; confirmed | List-owned modal modes and dirty guard |
| Missing error callbacks/finalize | list/details; UI22/28 | Stuck loader, lost recovery; confirmed | Cancelable reads, single feedback owner and retained draft |
| Delete without confirmation | details.delete; UI9/phase4 | Destructive action; confirmed | Shared record confirmation from row menu |
| Oversized write/read interfaces, string identity | models/details save; BE3/7 | Contract; confirmed | Numeric ID, client Reason only, lean list/detail |
| Required frontend lacks API validation | form Validators.required / write VMs; BE3 | Correctness; confirmed | Required on both write VMs, whitespace UI validation |
| ReverseMap and unused FullList | VoucherReasonProfiler/VM; BE3/4/backlog7/21 | Structure; confirmed | Four explicit maps, remove unconsumed duplicate |
| Broken boilerplate specs | wrong DetailsComponent/Widgets ListsComponent | Misleading legacy roots; confirmed | Remove unrelated scaffold specs; no test execution authorized |
| Missing bilingual complete feature keys/guide | vocabulary + Administration guide | Translation/documentation; confirmed | Existing guide reader/topic and EN/AR keys |

## Pre-edit reference conformance

| Concern | Book | Actual reference symbol/file | Shared owner | Target resolution |
|---|---|---|---|---|
| Route/fill/title | UI1/3 | Workshop/Job list metadata and HTML sigma-list chain | styles.scss sigma-route-host/list shell + FeatureTitle | Replace legacy card; shared inset, fixed title/filter/pager and row scroll |
| Filters/actions | UI4/7 | Job filter imports/template + ActionList | FilterPanel + FilterActionsDirective + ActionButton | Two exact fields, stableLayout=true, Reset/Search/Excel; View/Edit/Delete |
| Columns/pager/export | UI5/6/8 | Job columns/requestList/exportExcel | DataTable, resolveListPaging, toListParams, fetchAllPages/dataTableExportRows | id/reason whitelist, server count, applied snapshot, no feature CSS |
| Editor/content | UI13/15/19 | Shared EditorDialog declarations/template; UI13 controlled composition | EditorDialog + FormSection + FieldError | Same modal modes, padded body, intrinsic flex-fill chain, required Reason |
| Exit/focus/state | UI10/22/27/28 | confirmation service/form-state/focus-field + Job switchMap/defer flow | confirmDiscard/freezeFormState/focusField/StateMessage | One close decision gate, restore draft on cancel, retry reads, balanced loader |
| Backend | BE3/4/7/13 | BranchService inherited operations, BranchProfiler four maps | Generic Service/Controller, LeanDetailBaseVm | Lean id/reason models, required input metadata; no speculative override |

## Implementation and final reference reconciliation

| Concern | Target producer/consumer and compared source values | Result |
|---|---|---|
| Shell/title | VoucherReasonsComponent host sigma-route-host; HTML sigma-list-page/panel/header/table; FeatureTitle owns 8px margins, shared card geometry; toolbar excludes only /VoucherReason | Matches Job shell/owner; no feature styles remain |
| Filters | filterForm id/reason; appFilterPanel stableLayout=true, mainColumns=2, actual FilterActionsDirective export registered; Reset restores null/empty and searches page1 | Two source-supported filters; shared 34px controls, top alignment and reserved numeric validation |
| Grid | columns id:number/link then reason:text; actions View/Edit/Delete render first; exactly one app-data-table, fill=true, lazy=true, totalRecords from response.totalCount, explicit feature currentPageReport | Grid id/reason ↔ frontend id/reason ↔ backend Id/Reason; no audit/tenant/state extras |
| Paging/cancellation | onLazyLoad resolves against old page/size, derives sort whitelist from columns, permits replacement while reading; bindListQueries uses Subject/switchMap/defer/finalize | Same-page unchanged query skipped; size change requests; newest read owns rows; last unavailable page corrected |
| Applied query/export | activeFilters updated only by valid Search/Reset; currentQuery supplies paging/export/refresh; service uses toListParams + fetchAllPages with100/page; dataTableExportRows resolves current translations | Complete matching-result export or visible error; no partial file or draft-filter leak |
| Editor | VoucherReasonDetailsComponent receives explicit mode/id; same app-editor-dialog for Create/View/Edit, contentPadded=true, shared form/body/scroll flex-fill intrinsic chain | UI13 controlled composition, no tabs/custom dialog shell; ID in subtitle, title remains translated screen action |
| View/Edit | View disables form, shared primary emits Edit; enableEditing changes current mode/sessionMode and enables same form; Save guards View/unhydrated/disabled/pending | Same data/form, Save absent in View; explicit Edit supported |
| Validation | reason control required; Save trims, touches and focuses field on invalid; FieldError under actual labelled input; Add/Update VMs Required nonnullable Reason | UI/backend reject missing/empty/whitespace; historical nullable persisted reads retained; no invented max/unique rule |
| Exit/recovery | canDeactivate deferred identity check; freezeFormState retains values/disabled subtrees; X/Cancel/Escape/route converge; acceptance checks independent save/read gates before finalize | Dirty cancel retains draft, accepted close occurs once; mock-disabled form prevents close/Save |
| Feedback | read headers suppress global errors; StateMessage + Retry and apiErrorMessage/composedReadErrorMessage handle declared/HTTP failures; standard writes use root interceptor | Exactly one feedback owner; failed writes keep draft/row, finalize releases local/global loading |
| Backend | ListVM explicit Id/Reason, Detail LeanDetailBaseVm/Reason; four one-way maps; generic service/controller no overrides | Required payload only, existing tenant/existence/filter/count/save/soft-delete owner retained |
| Guide | VOUCHER_REASONS_TOPIC imported into existing ADMINISTRATION_GUIDE; existing reader includes that guide, module sidebar points /UserGuide/administration | EN/AR purpose, steps, validation, legacy nulls, repeated text, actions, recovery and manual mock Save match final source |

No unresolved Missing/Conflicting/Uncertain requirement blocks the frozen screen contract. No screenshots supplied, therefore screenshot evidence tables are not applicable. Historical source inconsistencies in generic book snippets are resolved using the explicit shared hook rules and actual current source; no new canonical rule was introduced.

## Actions, authorization and overrides

| Action | Source → target / backend | UI/service / failure / refresh |
|---|---|---|
| Create | New draft → live record; IVoucherReasonService inherited AddAsync; POST VoucherReason with Reason | Create modal → createReason; required text; no Save confirmation; failed draft retained; success close + applied refresh |
| View | Live tenant record → readonly form; GET VoucherReason/GetById/{id}, inherited DetailAsync | ID link/View → getDetails; matching response ID and active session required; Retry inline |
| Edit | Live tenant record → saved Reason; inherited UpdateAsync; PUT VoucherReason with Id/Reason | Row Edit or View Edit; typed request, freeze while saving; failure restores draft; success close + applied refresh |
| Delete | Live tenant record → soft-deleted; inherited RemoveAsync; DELETE VoucherReason?id= | Shared confirmDelete with title/subtitle/record/warning; no duplicate confirmation/request; failure keeps row, success applied refresh/remaining-page correction |

Reference Job actions inventoried: View/Edit/Delete/Create supported as CRUD; Cancel, Close Job, Quality Check, Labour Time, Logs, Gate Pass, Invoice on Customer and Open Estimation are Not Applicable because VoucherReason has no Job state, child workflow, customer invoice or estimation relations. No activation control is added merely because the inherited compatibility endpoint exists.

Authorization candidates: Create/Update/Delete could require future permissions at POST/PUT/DELETE VoucherReason; current architecture has AuthGuard and API [Authorize] plus repository tenant scope only. Visibility/busy state is presentation, not authorization. No permission API or access restriction invented.

Override audit: zero VoucherReason service/controller overrides before/after. Inherit list filters/property sort/count/materialization, detail, Add/Update and Delete; entity has no child/navigation/reference needing feature logic in the scoped model/configuration inventory. No duplicate business key established by source, so no UniqueColumns/index added.

## Routes, integration and compatibility

- Existing lazy entry in pages/routing.ts loads VoucherReason_Routes; existing sidebar link remains /VoucherReason. Only list child route remains and delegates canDeactivate to active editor.
- Removed legacy create/details/:id routes intentionally under UI1/13. Narrow direct-consumer search found no caller outside the retired feature list/routes. Existing bookmarked editor URLs retire; use the list's Create/View/Edit actions.
- VoucherReasonService is providedIn root and uses BaseService's injected HttpClient/environment.baseUrl. Removed only its import/two redundant LayoutModule entries; existing unrelated user changes in that file remain. AppModule provides tokenInterceptor/errorInterceptor once; neither feature nor LayoutModule provides another client. Token/language headers follow the existing root owner; actual request replay remains pending.
- Inline list/detail/export requests set X-Skip-Error-Interceptor. Create/Update/Delete retain standard global error/success handling; no manual toast or header-auth fork.
- Child closed(saved) is accepted only for the same parent session; saved=true closes and refreshes applied filters/sort/page. False closes without losing list state.
- No tsconfig roots added: existing route imports the list, which directly imports the dialog; no compiler diagnostic authorizes a new explicit root. No removed feature runtime root was present in tsconfig.app.json.
- Response narrowing removes unused inherited fields from list/detail only; routes/envelopes remain compatible. Server identity is numeric and nullable historical Reason remains readable.

## Files changed

Frontend repository root: F:/My Work/Sigma/SiGmaAngularFrontEnd.

- src/app/modules/Administration/VoucherReasons/components/list/list.component.ts and .html: typed shared list/filter/grid/actions/paging/export/read recovery/modal host.
- src/app/modules/Administration/VoucherReasons/components/details/details.component.ts and .html: controlled modes, required text, typed Save, read Retry, freeze/dirty close/focus.
- src/app/modules/Administration/VoucherReasons/models/create.ts, details.ts, list.ts: lean numeric read identity and client-only writes.
- src/app/modules/Administration/VoucherReasons/services/voucherreason.service.ts: typed existing transport and shared list/export helpers.
- src/app/modules/Administration/VoucherReasons/voucherreason.routes.ts: list-only guarded modal ownership.
- Removed components/list/list.component.scss and components/details/details.component.scss (empty); removed their broken unrelated scaffold .spec.ts files.
- src/app/modules/i18n/vocabs/en.ts and ar.ts: voucherReason keys only in this task; pre-existing other feature translations retained.
- src/app/_metronic/layout/layout.module.ts: VoucherReasonService import/provider cleanup only.
- src/app/_metronic/layout/components/toolbar/toolbar.component.ts: VoucherReason duplicate title suppression only.
- src/app/modules/UserGuide/content/voucher-reasons-topic.ts (new); administration-guide.ts: bilingual topic registration and overview.

Backend repository root: F:/My Work/Sigma/SigmaBackend.

- SiGma.ViewModels/ViewModels/VoucherReason/VoucherReasonAddVM.cs, VoucherReasonUpdateVM.cs: Required Reason.
- SiGma.ViewModels/ViewModels/VoucherReason/VoucherReasonDetailVM.cs: lean identity + nullable Reason.
- SiGma.ViewModels/ViewModels/VoucherReason/VoucherReasonListVM.cs: Id/Reason only.
- Removed SiGma.ViewModels/ViewModels/VoucherReason/VoucherReasonFullListVm.cs: declaration-only duplicate, no C#/project/frontend consumer found.
- SiGma.Business/MapperConfig/VoucherReasonProfiler.cs: four explicit one-way maps.

Local review artifacts: this report and VOUCHER_REASONS_FRONTEND_BACKEND_CONTRACT_FREEZE.md. Existing unrelated repository changes, including backend migration/snapshot work, were left untouched.

## Phases and shared-extraction result

Phases00/01 discovery/freeze,02 read/grid,03 detail/write,04 Delete,05 routes/providers/events and06 reconciliation applied. PLAN00 not needed for this bounded known-contract adoption. Reports, uploads, child reconciliation, posting/approval/activation/calculations and financial transactions skipped: feature has no such requirement/state. No domain formula/AutoMapper Ignore/ReverseMap introduced; no entity/EF/nullability/schema/index/column change. Add-Migration is not required.

Repeated controls/layout/validation/export/confirmation/form freezing/state recovery reuse existing shared owners. No additional extraction qualifies beyond those existing pieces; feature behavior is field/query/session orchestration. No reusable new lesson or new canonical rule established, so no book/skill/changelog update or packet regeneration required.

## Responsive source matrix

| Range / boundary | Expected arrangement from actual shared cascade | Acceptance |
|---|---|---|
| >1250px | Two configured filter tracks, shared lower Reset/Export/Search toolbar; fixed title/pager, row scroll | Source traced; visual pending |
| 1250px and neighbours / intermediate1000–1200px | Shared panel three-track fallback, two fields remain on first row; disclosure appears below1200; logical margins/34px controls retained | Source traced; visual pending |
| 720px and neighbours | Shared one-track filter grid and wrapped/stacked actions; busy/disclosure retains form values | Source traced; visual pending |
| 650px and neighbours / narrow widths | FeatureTitle wrapping title/Add actions through shared owner; no feature offsets or hidden primary labels | Source traced; visual pending |
| Dialog1099/767 boundaries, <=620px | Shared max viewport and width breakpoints; intrinsic one-field body shrinks/scrolls, footer fixed; owner hides secondary subtitle/hint below620 per existing component | Source traced; visual/focus-return pending |
| Desktop/mobile992 boundary, short heights, Arabic/dark | Shared page gap/shell and dialog/theme/logical styles own bounds; no feature page scroll/CSS palette | Source traced; all-size acceptance pending |

## Verification performed and pending

- Recipe -Check passed all8 packets initially and again at final reconciliation; no refreshed packet IDs.
- Complete scoped feature/frontend and backend diffs reviewed in their actual Git repositories; scoped hunks in already-dirty translations/layout/toolbar/guide inspected without adopting unrelated work.
- git diff --check passed both scoped repositories; only Git LF→CRLF informational warnings. No merge markers/stale legacy types, imports, route callers or server-owned payload fields found in final feature.
- Source syntax parsing only:13 touched TypeScript files,0 parse errors;2 Angular templates,0 parse errors. This was AST/template parsing, not compilation, type checking, lint or tests.
- Actual shared exports and standalone registration inspected for EditorDialog, DataTable, FilterPanel/FilterActionsDirective, FeatureTitle, FieldError, StateMessage, FormSection, NumericFocus, MockDataFormsModule and public inputs/events.
- Translation parity: voucherReason20 English/20 Arabic keys,0 missing in either direction,0 case-only differences. PrimeNG page-report placeholders confirmed.
- Independent focused source audit found no actionable issue in applied filters, paging cancellation, export, detail identity, View→Edit, Save/dirty-close/mock gates and shared transport. Source conformance is not runtime acceptance.

Owner verification pending:

1. Compile frontend/backend; exercise Create/View/Edit and View→Edit, required empty/whitespace input, failed-save draft recovery and unchanged Save.
2. Confirm API rejects omitted/null/empty/whitespace Reason; historical null read remains visible and Edit requires text. Repeated text should remain allowed.
3. Search ID/reason (including0/invalid integer), sort, page, change size on page1, rapid page changes, reset and delayed reads; verify total/count and newest-response behavior.
4. Delete cancel/confirm, failure, last row on later page; ensure same applied filters/sort return and exactly one mutation success notification.
5. Dirty X/Cancel/Escape/route/back: cancel retains values, accept closes once; View/pristine close directly; mock pending/preview blocks exit until finished/cancelled; generated values need manual Save.
6. Export more than100 matching records, alter draft filters without Search, switch EN/AR and force a failed later page; verify complete ordered columns/current translated headers or error without partial file.
7. Check token presence (do not record its value), light/dark, LTR/RTL, keyboard labels/trap/return/focus, all responsive boundaries/intermediates and short-height internal scroll.
8. Open /UserGuide/administration → Voucher Reasons; verify bilingual screen topic link, task steps, reading/print/RTL/theme.

No build, test, lint, browser/application verification, database command, migration creation/edit/execution, commit, push or deployment was run. Graphify/Sigma MCP were not used. Owner acceptance remains yes.

Agent utilization: one bounded terra_worker using inherited parent model (mapped terra unavailable), owning only six backend VM/profile files after contract freeze; reused for a read-only focused frontend audit. Root owned frontend/artifacts/guide/integration/final diff. Nonoverlapping backend DTO and frontend UI work reduced wall-clock time without duplicate discovery or merge ownership; no measured time/cost claim.

Suggested scoped commits (suggestions only):

- SiGmaAngularFrontEnd: refactor(voucher-reasons): adopt shared list and modal editor
- SigmaBackend: refactor(voucher-reasons): align DTO validation and mappings

Stage only the task-owned files/hunks listed above; other pending Administration changes are not covered.
