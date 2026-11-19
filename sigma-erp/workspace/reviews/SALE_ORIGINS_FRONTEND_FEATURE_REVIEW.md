# Sale Origins frontend review and implementation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Manifest and boundary (2026-10-14)

Owner: review `src/app/modules/Administration/SaleOrigins` and implement confirmed documentation corrections. Frontend scope includes its routes, models, service, list, editor, EN/AR keys, existing guide and directly related wiring. Backend is read-only contract evidence, not implementation scope. No screenshots/videos; written request and current source establish Name/Code, Create/View/Edit/Delete and filtering. Preserve pre-existing details-button icon changes and all other working-tree edits, including earlier shared date fixes. No builds/tests/lint/browser/database/migrations/commit/push/deploy.

UI shape 01: fields-only normal entity uses paged list and controlled shared modal in Create/View/Edit (UI13 D4-2). List reference: Workshop/Job/components/list shell/filter/grid. Editor authority: shared EditorDialog declarations/template plus UI13 controlled composition, UI10 deferred discard/freezeFormState. Branch and ReplacementReason are inspected as current integrations only, not substitutes for these approved owners. Backend evidence: Pattern1, inherited SaleOrigin Service/SiGmaControllerBase, BranchService reference for inherited hooks; no feature-specific SearchColumns or UniqueColumns exists.

Known findings: ms-lib table/columns; separate routed editors contrary to D4-2; untyped forms/search/payload; server-owned fields in contracts; Edit sends POST instead of PUT; no validators/dirty-close/delete confirmation; missing transport recovery/finalize and API paging; oversized list/detail interfaces; mismatched label IDs; missing screen guide. These overlap documented backlog 8/19/39 and are not new architecture findings.

## Frozen frontend handoff

| Concern | Decision and evidence |
|---|---|
| Grid vs consumed ListVM | Actions (shared), Code (`code` text sortable), Name (`name` text sortable/link View). Frontend properties `id:number`, `code:string`, `name:string|null`; API supplies these through existing SaleOriginListVM/ListBaseVmWithName. Backend additional inherited metadata remains an out-of-scope follow-up; do not change response shape. |
| Filters | Two existing property filters: `name`, `code`, trimmed strings serialized as `Filters[name]`, `Filters[code]`. Generic BuildFilterPredicate uses Contains and AND; empty omitted. No generic `search` field because SaleOrigin.SearchColumns is empty. |
| Paging/sort/export | `GET SaleOrigin` existing Results with totalCount/pageNo/pageSize/totalPages, base 1–100 clamp and Id tie-break; default UI15 rows/10,15,20,50,100. Stored Code/Name sort via base reflection. Applied snapshot, switchMap cancellation, route state, current-page refresh and all-page Excel through shared helpers. |
| Detail | `GET SaleOrigin/GetById/{id}`, numeric identity; only `id,name,code` consumed, no tenant/audit/state metadata. Failed/mismatched identity blocks editing with inline Retry. |
| Add | POST `{name:string,code:string}` only; inherited Name [Required]/max250. Code has no explicit business required/max/unique annotation: retain empty string as valid editable input. |
| Update | PUT `{id:number,name:string,code:string}`; inherited Name [Required]/max50. Mode-specific name limits preserve current API rather than invent backend change. Trim inputs; whitespace Name cannot satisfy requiredness. No new duplicate rule/preflight: UniqueColumns is empty. |
| Delete | Existing DELETE `SaleOrigin?id=number`; shared confirmDelete with selected name/code, subtitle and warning. Mutations use global feedback; retain row on failure. Existing base owns inbound reference validation. |
| Dialog | One shared padded content-sized section with Name/Code, explicit create/view/edit. View read-only/Close only; row Edit opens editable mode. FormSection/MockDataFormsModule retained; manual Save, shared icons, FieldError, first invalid focus, ready/save/decision gates. |
| Exit | List-only `/SaleOrigin` child route with CanDeactivate delegating to mounted editor. X/Cancel/Escape/route share deferred dirty confirmation and freezeFormState; cancel retains draft, view/pristine leave directly. Remove legacy create/details route definitions (no external operational source link found). |
| Feedback | Inline suppressed list/detail reads and actionable Retry; export composed failure; global interceptor owns ordinary successful/failed mutations exactly once. finalize balances loader on success/failure/cancel. |
| Auth/wiring | Existing AuthGuard/root interceptor HttpClient; root service, no invented permissions. Preserve sidebar /SaleOrigin entry; scoped legacy Layout service provider duplicates may be removed. |
| Guide | Add bilingual Sale Origins topic to existing Administration guide `/UserGuide/administration`; reuse reader/menu entry. |
| Exclusions | Backend VM/mapping inherited oversupply and ReverseMap, schema/uniqueness/business-key decisions, global base-name length harmonization are not frontend-authorized changes. No financial/domain calculation. |

## Reference conformance table before edits

| Concern | Owning block | Actual reference symbol/file | Shared owner | Target |
|---|---|---|---|---|
| Layout/header | UI1/3 | Job list `.sigma-list-page/panel/header/table` | global shell/FeatureTitle | Replace raw card; route host, title inside panel, fixed regions |
| Filters | UI4 | Job `form[appFilterPanel]` | FilterPanel/FilterActions | typed Name/Code, shared Reset/Search, stableLayout |
| Table | UI5/6/7 | Job `app-data-table`, DataTableColumn/ActionList declarations | DataTable/ActionButton | Code/Name, Actions first, API count/paging and backend sort whitelist |
| Modal | UI13/15 | EditorDialogComponent inputs/outputs; UI13 controlled composition | EditorDialog/FormSection | padded flex-fill body, one scroll owner, view/save modes |
| Exit | UI10/27 | freezeFormState, ConfirmationDialogService | shared confirmation/form-state/focusField | deferred same-session dirty gate and restore |
| Export | UI2/8 | list-query.fetchAllPages; dataTableExportRows | shared serializer/export mapping | full applied result and translated current headers |
| Errors | UI22/28 | BaseService skipErrorInterceptor; switchMap/finalize | root interceptor/StateMessage | no duplicate toast, failed read Retry, mutation draft retained |

## Execution

Phases0/1 discovery and frozen consumer contract; Phase2 list/filter/grid/export; Phase3 modal; Phase4 Delete; Phase5 route/provider/guide integration; Phase6 final reconciliation. All eight initial recipe checks pass. Use applicable Phase00–06 packets with canonical owning blocks. No Maintenance/Evolution Plan: bounded migration to documented screen pattern with current API/fields preserved, no missing business rule to resolve. Small independent list and modal workstreams can run after this freeze with nonoverlapping ownership; root owns models/service/routes/translations/guide and final integration.

## Pending final reconciliation

Update conformance against final source, record files/diffs and remaining backend follow-ups, owner compile/runtime/responsive/RTL/theme/navigation/output acceptance. Suggested frontend commit: `refactor(sale-origins): adopt shared list and modal editor`. No backend changes or Add-Migration required.

## Contract evidence correction before handoff

The initial Delete row above assumed inherited reference validation. Reading the actual `Service.RemoveAsync` (line908) disproves that: it finds, deletes and saves; SaleOriginService does not override it to call InUseAsync/RemoveWithChildrenAsync. Preserve the existing DELETE contract in this frontend-only scope; the warning asks the user to review name/code rather than promising referenced records cannot be removed. Record the missing backend inbound-reference gate as a follow-up; do not invent a client permission/delete rule. No backend fix or migration is authorized by the named frontend path. Current user guide makes no unsupported deletion-lock/uniqueness claim.

Final presentation choice under UI4's public short/unvalidated-strip recipe: inlineActions=true and responsiveColumns=2 retain two usable Name/Code tracks, with actions below at <=1365 and one field track at <=720. This avoids the ordinary shared <=1250 three-track rule leaving an empty track for this two-field screen; no shared CSS/default or other consumer change. Name explicitly includes Validators.required alongside trim validation so the existing shared mock adapter's hasValidator(Validators.required) correctly recognizes it as required. No new shared capability or reusable rule was introduced.

## Final implementation and reconciliation

All confirmed frontend findings in this frozen scope are implemented. Historical findings/contract rows above remain evidence; the Delete correction governs the final result. No missing frontend field or API blocks this handoff. No screenshot inference was made. Backend inherited List/Detail metadata oversupply, mapping directions and missing deletion reference gate remain explicitly outside the frontend path request.

| Comparison | Final source evidence | Status |
|---|---|---|
| Grid ↔ frontend ↔ API | DataTable renders Actions, Code, Name; SaleOriginDTO={id:number,code:string,name:string|null}; SaleOriginListVM supplies Id/Name/Code plus unused inherited metadata | Consumed contract matches; backend narrowing deferred |
| Filters ↔ query ↔ parser | filterForm Name/Code → activeFilters trimmed → toListParams Filters[name]/Filters[code] → base BuildFilterPredicate Contains, AND | Matched; absent/empty omitted, no speculative SearchColumns |
| Paging ↔ count/order ↔ table | inherited GetManyAsync CountAsync/NormalizePaging/ApplyListOrder; Code/Name stored properties; UI whitelist from columns, default15/clamp100/totalRecords/lazy output | Matched; switchMap cancels superseded read, identical query skipped |
| Applied snapshot ↔ refresh/export | draft edits do not change activeFilters; save/delete refresh currentQuery; fetchAllPages uses100-page batches and fails all on any failed page; dataTableExportRows Code/Name click-time header snapshot | Matched; full output runtime comparison pending |
| Detail ↔ form ↔ writes | numeric id, Name/Code hydrated only after successful same-id result; typed Add{Name,Code}/Update{Id,Name,Code}; Update now PUT | Matched; no tenant/audit writes, required/trim-aware250-create50-edit |
| Save/error/close | ready/detailError/mode/busy gates, freezeFormState, finalize loader, mutation global feedback, closed(true) refreshes applied list | Matched; both failure channels retain draft |
| View/dirty exit | shared EditorDialog mode View/Close only; List CanDeactivate delegates to captured editor session; modal defer identity gate + confirmDiscard/freeze + accepted decision ordering; X/Cancel/Escape same gate | Matched; remount per session, return focus/runtime pending |
| Delete | confirmation references selected Name/Code/Id; cancel sends nothing; existing DELETE id; failure retains row, success refreshes applied query and previous-page fallback | Matched existing endpoint; backend inbound-reference enforcement absent/deferred |
| Route/provider/interceptor | pages/routing.ts /SaleOrigin → list-only child; existing sidebar link; removed only scoped SaleOrigin import/two Layout provider entries; providedIn root → root BaseService HttpClient → AppModule token/error interceptors; AuthGuard existing | Matched, no manual token/permission mechanism |
| Header/layout/responsive | sigma-route-host/list-page/panel/header/table chain and FeatureTitle inside; Toolbar isSaleOrigins suppresses duplicate header; no feature styles; filter/main2/inline/responsive2; padded flex-fill modal, internal editor scroll | Matched approved shared owners; visual acceptance pending |
| Standalone registrations | list imports exact DataTable/FeatureTitle/FilterPanel/FilterActions/PrimaryAction/StateMessage/editor/ReactiveForms/Translate exports; modal imports exact EditorDialog/FieldError/FormSection/MockDataForms/StateMessage exports | Source public declarations/inputs checked; no schemas/casts/compiler root changes |
| Languages/guide | saleOrigin EN/AR leaf keys match including totalRecords placeholder; bilingual SALE_ORIGINS_TOPIC registered in Administration guide and overview; /UserGuide/administration existing sidebar/reader | Source conformance; guide reading/print/RTL pending |
| Diff/hygiene | repository F:/My Work/Sigma/SiGmaAngularFrontEnd; reviewed full scoped feature changes and task additions within already-modified shared files; removed obsolete ms-lib/types/routes/form fields/imports/styles | Diff whitespace/merge-marker checks pass; unrelated changes preserved |

### Action coverage and contracts

Job is the approved **list shell**, not a source of SaleOrigin domain actions. Create/View/Edit/Delete/Search/Reset/paging/sort/Excel are Supported using the existing SaleOrigin normal-entity API. Job's Labour Time, Invoice Customer, Close Job, Cancel Job, Quality Check, Log Time, Estimation and Print Gate Pass are Not Applicable: SaleOrigin has no Job record type/status, labor, invoice, estimate, movements or gate-pass relationship; its entity is Name/Code only. Lubrication Create is likewise Not Applicable (no lubrication aggregate). There is no approval/post/void/activation requirement in the current screen; inherited HandleActive endpoint does not independently authorize adding a user workflow.

| Action | Exact route/payload and service | Owning UI/guard | Outcome/recovery |
|---|---|---|---|
| Create | POST SaleOrigin {name,code}; createOrigin | list openCreate → mode=create modal; required Name/max250, freeze while Save | closed(true), current applied list refresh; failure draft retained |
| View | GET SaleOrigin/GetById/{id}; getDetails | Name link or row View → numeric id session, disabled form | Close only; declared/HTTP/mismatched identity inline Retry |
| Edit | same detail read; PUT SaleOrigin {id,name,code}; updateOrigin | row Edit, ready same-id editable modal; Name/max50 | same record update, refresh applied list; draft retained on failure |
| Delete | DELETE SaleOrigin?id={id}; deleteOrigin; inherited RemoveAsync | row action; one shared yes/no confirm, action/confirm/delete busy, route exit blocked pending | success removes via current backend, refresh/applied page fallback; failure row retained/global message |
| Exit | no mutation; confirmDiscard('saleOrigin') when dirty | deferred CanDeactivate/X/Cancel/Escape same session, frozen controls | accepted leave/close; canceled restores same draft/dirty/disabled state |

AuthGuard is authentication only; no frontend action is described as secured. Existing server tenant scope remains the owner; runtime tenant isolation is not established by this source review. No service/controller override was edited. Backend overrides=none in SaleOriginService; controller inherits existing methods. AutoMapper/entity/EF/schema/domain calculations: no changes; **Add-Migration not required**.

### Responsive source matrix

| Width/height range | Expected arrangement from final cascade | Source evidence | Acceptance |
|---|---|---|---|
| >1365px | two filter tracks, Reset/Excel/Search beside; dialog Name/Code two columns | FilterPanel inline main2; default EditorDialog1040/max-width; sigma-editor-columns2 | Owner visual pending |
| 1365→1200, 1250 boundary, 1200→1024 | two full-width filter tracks, actions below; shared <=1365 responsive specificity overrides ordinary <=1250 three-track rule | responsiveColumns2 rules after general breakpoints; disclosure begins<1200 | Owner visual pending |
| 1024→767, 767→720 | editor stays two columns, shared94vw/<767 viewport-bound dialog; filter retains two tracks/actions below | global editor <=1024 two-column; shell breakpoints1099/767 | Owner visual pending |
| <=720 and both sides700 | filter one track/actions wrapping; editor one track<=700 | late FilterPanel responsive <=720; sigma-editor-grid <=700 | Owner visual pending |
| <=650 and <=620 | title/Add wraps naturally with smaller shared primary action; shared subtitle/hint hides<=620; all actions remain text-labelled | FeatureTitle/PrimaryAction shared styles; EditorDialog <=620 | Owner visual pending |
| Short height, long Arabic/name/code, errors/themes | route fills shell; grid rows scroll, modal body scrolls within shell maxHeight; no feature page-height/CSS copy | shared route/form/scroll min-height0 chain and contentPadded/flex-fill/maxHeight | Owner LTR/RTL/light/dark/keyboard/short-height pending |

### Files and guide handoff

Changed feature files: list/list.component.ts and .html; details/details.component.ts and .html; models/list.ts, details.ts, create.ts; services/saleorigin.service.ts; saleorigin.routes.ts. Removed two empty SCSS files and two obsolete scaffolding specs (list spec targeted the unrelated widgets ListsComponent; detail spec targeted retired routed class). Existing Save/Cancel/Edit/Delete icons were preserved in the shared owners/actions rather than reverting the owner's icon intent.

Direct integration changes: layout.module.ts (SaleOrigin root-provider cleanup only), toolbar.component.ts (/SaleOrigin duplicate title exclusion only), en.ts/ar.ts (saleOrigin block only), administration-guide.ts (SaleOrigin import/topic/overview additions only). New bilingual guide: `src/app/modules/UserGuide/content/sale-origins-topic.ts`, covers search/reset/applied filters, paging/sort/all-page export, Create/View/Edit, Name limits/optional Code, dirty exits, Delete, Retry and manual mock Save. Existing `/UserGuide/administration` sidebar entry and reader registrations reused. No new menu/viewer/guide route.

Artifacts: this file under F:/My Work/Sigma/reviews (coordination records remain local/unversioned per AGENTS.md). No canonical book/skill/template/manifest edits were needed: all patterns already exist, no new verified reusable rule to promote. Shared extraction gate reused current DataTable/FilterPanel/EditorDialog/FormSection/FieldError/state/confirmation/form-state/route/serializer/export owners; no feature-local repeated shell/parser/style helper qualified. All eight recipe -Check outputs pass at initial and final verification; no derivative packet regeneration needed for this task.

Agent use: one inherited-model `modal_worker`, editor TS/HTML/empty style/obsolete spec owned exclusively after root contract freeze; then read-only integration audit. Root owned list, models, service, route, translations, guide/wiring and final reconciliation. Independent modal/list work reduced elapsed implementation with no overlapping writes. Root added explicit Validators.required/aria-required during final review to match mock/accessibility consumers. Agent audit found no additional concrete frontend issue; no prohibited commands executed by either agent.

### Remaining risks and owner checks

1. Backend follow-up: SaleOrigin lacks an inbound-reference delete gate; frontend confirmation preserves the actual API, not a guaranteed usage lock. Its read VMs still inherit unused metadata and read mappings retain ReverseMap. Source-level frontend completion does not imply backend pattern completion.
2. Existing backend Name mismatch (Add250/Update50) is intentionally respected; saved longer names must be shortened on Edit. Code has no explicit length or unique business-key constraint. Harmonizing these is separate backend/domain scope, not an invented frontend rule.
3. Removed legacy `/SaleOrigin/create` and `/SaleOrigin/details/:id` in favor of documented list-only modal; no in-app external references found, but old bookmarks need `/SaleOrigin`. Compiler roots remain unchanged because the imported existing component is reachable; owner compilation must verify actual app/spec boundaries.
4. Owner run compilation/runtime acceptance: search Name/Code separately/together, reset, pages15/10/50/100, sort Code/Name, rapid paging and failed reads/Retry, export >100 rows and failure on a later page; compare rows/header language/applied query after unsent draft filter edits. Create/edit/view, required/whitespace/max Name, empty Code, POST vs PUT, failed-save draft, successful refresh. Dirty X/Cancel/Escape/route confirmation accept/cancel, pristine/View close, mock generation/preview cancellation gates, focus trap/return and invalid Name focus. Delete cancel/failure/success/only row of later page using authorized test data. Check above responsive intervals/boundaries, both languages/themes and short height. None of these runtime checks was executed.

Suggested frontend commit: `refactor(sale-origins): adopt shared list and modal editor` (stage only this task's files/hunks; shared files already contain unrelated owner changes). No backend commit/migration. Builds/tests/lint/browser/application/database/migrations/commits/pushes/deployment, Graphify and Sigma MCP were not run.
