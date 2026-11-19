# Fleet catalogs review — 2026-10-04

## Service General panel visibility — 2026-10-28

| Item | Decision / final source result |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization / size | Owner reports empty General when creating a Service. Tier S corrective presentation, actual /FleetVehicleService editor; distinct ServiceItem/ServiceLog/legacy ServiceChecklistItem1 screens excluded. |
| Route / shape | pages/routing.ts FleetVehicleService -> FleetVehicleService_Routes -> ServiceChecklistDetailsComponent create/view/edit. UI screen02 routed multi-collection editor, backend Pattern2 service definition retained. Sidebar Services points to this route. |
| Cause | General's fields exist in the @case('general') template and typed form: name, dueAtKMs, orMonths and notes. Active section had sigma-editor-pane but no flex growth. Its child sigma-editor-scroll has flex:1 1 0 inside an auto-sized, overflow-hidden pane, collapsing available content instead of inheriting editor height. Other collection panels had the same missing chain link. No missing API field or translation caused this empty panel. |
| Frozen correction | Add existing sigma-u-flex-root (flex:1) to all four mutually exclusive panel sections, and existing sigma-u-flex-shrink-0 to the tab strip. Keep shared editor-scroll for General and shared fillHeight/sticky table scrolling elsewhere; normalize the split General opening markup. No local height/calc/timer/CSS or shared implementation change. |
| Conformance | Master1 proportional tier, Master5 and UI1/13 full remaining-space pane contract, UI14 fill table host. Actual styles.scss sigma-editor-form/body/pane/scroll and _sigma-utilities flex-root, EditableCollectionTable fill host, shared EditorTabs public inputs and shape reference Job editor inspected. Fields/validators/IDs/ARIA/form/row factories/picker/Add/Remove/Save/discard/read-only contracts retained. |
| Analysis-guide gate | Read references/speed-analysis/README.md, relevant guide maintenance/services context, catalog S229 and original library/pages/0b11fdd81cd5c14d.html. Supports entry to service creation; its default/make/model/import discussion does not prescribe this Sigma layout or approve new filters/imports. Compare current Fleet plan and fleet-guide.ts definition topic; accept service-definition context only. No new financial/workflow/API contract. |
| Loading/cache/query scope | No consumed URL/request/lifetime changed. VehicleService/GetByWithNavigationsId/{id}, POST/PUT VehicleService and ServiceItem/Item GetSelect remain existing operations; General scalar fields require no additional read. Existing lookupsLoading and detail/save start/finalize/error/Retry behavior untouched. This fixes a bounded flex chain, not a complete loading/cache retrofit; the pre-existing inline detail/lookup loading source is not represented as global-visibility conformance. Broader screen runtime/network/shared-source adoption remains outside this one-element correction. No index/schema/new query justified, no measured speed claim. |
| Guide | Updated bilingual Vehicle service definitions topic in UserGuide/content/fleet-guide.ts at /UserGuide/fleet, existing sidebar/reader retained: General fields, active-panel space/scroll and remaining child tabs before Save. |
| Phases / verification | Initial recipe Check passes all8 before Phase03; Phase06 scoped diff/source/whitespace/conflict checks complete. No stale imports or type changes; no new runtime file. Existing canonical flex rule is sufficient, no learning/skill/book/packet change needed. Backend/grid/domain/schema phases unnecessary. No migration. |
| Owner acceptance | Open Create Service and verify four General fields, inner scroll at short height, preserved typed values across tab switch and invalid Save focusing correct fields; check all collection tabs, View/Edit, narrow/intermediate/wide layouts, EN/AR/RTL/themes. No build/tests/lint/browser/runtime/database/migrations/snapshot/commit/push/deploy/Graphify/Sigma MCP executed. No agents for this sequential small layout correction. |
| Suggested frontend commit | fix(services): fill active editor tab panels |

## SourceCode wider search — 2026-10-26

Final source status: Implemented — source-only. Template/guide syntax parsing passed with zero errors, incremental one-input/guide diff and whitespace checks passed; no runtime visual pass claimed.

Frozen Tier S owner request: enlarge SourceCode search. Actual `/SourceCode` loads SourceCode_Routes → SourceCodesComponent. UI4 compact inline filter contract and actual shared FilterPanelComponent expose mainColumns; select1 for this single field instead of the default6 empty tracks, letting search fill the available field grid beside Reset/Search. Preserve existing stable/inline caption, 34px height, submit/reset/busy and shared <=720 stacking/RTL/theme. No local CSS/shared implementation/API/model change. Existing `/UserGuide/fleet` Source codes topic gets one EN/AR search step; previous Vehicles/VehicleType notes preserved. All8 recipe checks passed in this continuing turn before Phase05/02 use; no canonical/skill/generated changes. No request/cache source/watch/invalidation/loading/query/page/response scope change and no index or measured speed claim; full runtime/network/SQL/visual acceptance remains pending. Backend/domain/detail/schema phases not applicable; no agents for one field-layout input. Source syntax/diff verification pending. Suggested FE commit: `style(fleet): widen source code search`. No prohibited command or migration run.

## VehicleType wider search — 2026-10-26

Final status: Implemented — source-only. Angular template and TypeScript guide syntax parsing passed with zero errors; complete scoped diff and whitespace checks passed. Previous Vehicles guide spacing work preserved. Owner desktop/narrow/RTL/theme visual acceptance remains pending.

Frozen Tier S owner request: enlarge the FleetVehicleType search box. Actual pages/routing `/FleetVehicleType` imports FleetVehicleTypes_Routes → VehicleTypesComponent. UI4 and shared FilterPanelComponent own columns/field span/inline actions; actual Workshop Job list provides the composition reference. This form previously inherited six tracks for only search and inactive checkbox, leaving the search one-sixth of the field grid. Select mainColumns=3 and the existing sigma-filter-field--wide modifier for search (two tracks), leaving inactive in the third; preserve shared stable/inline caption, control height, checkbox and Search/Reset handlers. Shared <=720px wide-span reset and stacking still apply. No feature CSS/width/palette or shared implementation change. Existing backend/catalog/list shape and all fields/actions remain unchanged.

Existing Fleet in-app guide `/UserGuide/fleet`, content/fleet-guide.ts: add EN/AR Vehicle types search instruction, preserving prior Vehicles spacing notes. Source cache/loading/performance scope: no consumed URL/query, cache source/watch/invalidation, request start/finalize/visible owner or response/page contract change. No new index justified or speed claim from field width; broader runtime/network/SQL/visual acceptance remains separate. Initial all8 recipe checks passed before proportional Phase02/06; no new canonical rule/skill/packet generation needed. Backend/detail/domain/schema phases not applicable, no agents for this single-field adjustment. Source syntax/diff verification pending; desktop/narrow/RTL/theme visual acceptance pending. No build/test/lint/typecheck/browser/DB/migration/commit/prohibited command run. Suggested FE commit only: `style(fleet): widen the vehicle type search field`.

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | ServiceItem, SourceCode, VehicleType, VehicleService, ServiceChecklistItem1 frontend directories |
| Contract | `../FLEET_FRONTEND_CONTRACT_FREEZE.md` — Frozen, source-supported UI fixes only |

## Before implementation conformance

| Concern | Canonical owner | Reference source/symbol | Shared owner | Before |
|---|---|---|---|---|
| Bounded list shell, title/filter/grid edges | UI 1/3/4/6; Master 5 | Workshop/Job list template and `bindListQueries` | `styles.scss`, FeatureTitle, FilterPanel, DataTable | Partial catalog list migration exists; VehicleService still local shell; obsolete list SCSS remains |
| Paging and feedback | UI 2/6/22/28 | Job list and shared `resolveListPaging` | list-query, api-error, mutation interceptor | Catalog partial changes use shared paging; VehicleService copies paging, defaults/options vary, VehicleType still uses unsafe general paginator key |
| Small field-only editors | UI 13/15/19/24/25 | Fleet/VehicleService integration + EditorDialog | EditorDialog, shared fields, FieldError, StateMessage | ServiceItem/SourceCode/VehicleType typed forms present, local styling/errors/state markup and VehicleType duplicate toasts remain |
| Service aggregate editor | UI 1/13 D4-2/14 | Workshop/Job editor shell, collections, Back/Save footer | shared editor shell, EditorTabs, EditableCollectionTable | VehicleService has checklist, parts and profiles but is a modal; lookups load in View; no global detail loading; errors silently become empty lookup arrays |
| Image storage lifecycle | UI 18/22/28 | shared FileField and DocumentUploadTracker | FileField, DocumentUploadTracker | VehicleType has local uploadFile/path sets, closes on failed cleanup, duplicate API feedback |
| Orphan checklist template | UI 1/2; frozen handoff | local routes, pages/routing, layout.module providers; backend catalog inventory | root routing owner | ServiceChecklistItem1 route is reachable but no backend API family found; boilerplate product/loyalty columns and client audit payloads do not establish a valid contract |

## Frozen local contracts

- ServiceItem columns `name`; row model `id,name`. POST name max250, PUT name max50 match the current backend VM asymmetry and stay unchanged.
- SourceCode columns `name,code`; row model `id,name,code`; filter `search`; POST/PUT retain `name,code` and update identity.
- VehicleType columns and actions retain current model and `search,isInactive` filters; form has scalar enum/capacity/booking/image fields only, so tabs do not trigger D4-2. GetGroups/UpdateGroupNo retain their separate typed one-collection dialog.
- VehicleService columns `name,dueAtKMs,orMonths`; row model `id,name,dueAtKMs,orMonths`; sorting uses the same allowlisted fields. Three child collections trigger D4-2. Preserve every checklist/part/profile saved ID in PUT and omit IDs in POST; no derived values/tenant/audit inputs.
- ServiceChecklistItem1 dependent implementation remains Blocked until a supported API contract or routing disposition exists. No invented endpoint or destructive removal.

No screenshots supplied. Backend source is contract evidence only. Builds/tests/lint/browser/database/migrations/commits/push/deployment are prohibited and remain owner verification.

## Source reconciliation — 2026-10-04

The inherited catalog changes and the final focused source audit now use shared bounded list shells, FeatureTitle, DataTable fill mode and 15-row defaults with 10/15/20/50/100 options. ServiceItem, SourceCode, VehicleType and VehicleService query streams use Subject/switchMap/defer with paired global loading in finalize. Their inline service failures carry X-Skip-Error-Interceptor; standard successful mutations retain the global interceptor. VehicleType create/update are the concrete composite exception below. The standard ListQuery serializer preserves the existing backend Filters contract.

| Concern | Actual consumer and compared value | Result |
|---|---|---|
| Modal editors | ServiceItem/SourceCode use EditorDialog and typed fields with FieldError; create/edit ServiceItem name limits remain 250/50, matching their existing VM asymmetry | Source matched |
| Request recovery | ServiceItem/SourceCode/VehicleType retryDetails invokes the same typed read; failed reads disable controls, and modal response callbacks check editor identity/open completion | Source matched; HTTP/runtime pending |
| Aggregate shape | VehicleService routes Create/View/Edit to the existing typed editor, with fixed footer and shared child collection tables; list return keeps paging and sort query parameters | D4-2 source matched |
| Unsaved navigation | VehicleService routes bind CanDeactivateFn to canDeactivate; explicit close uses the existing confirmation and completed navigation bypasses repeat prompts | Source matched; browser navigation pending |
| Child persistence/removal | VehicleService POST omits saved IDs; PUT preserves IDs in checklist/parts/profiles. EditableRows owns row Remove; picker deselection now confirms saved/dirty checklist removals before rebuilding the same controls | Source matched; owner cancel/confirm checks pending |
| Busy form lifecycle | ServiceItem/SourceCode/VehicleType/VehicleService/ManageGroups disable typed controls through the form API during load/save/confirmation and restore editable modes afterward | Source matched |
| Image storage | VehicleType FileField uses the editor-scoped DocumentUploadTracker. Save disables the form synchronously before HTTP subscription, preventing attachment replacement after payload capture. Committed save/discard cleanup retains the editor on failure and retries cleanup alone | Source matched; storage failures pending |
| Composite success feedback | VehicleType create/update alone carry X-Skip-Success-Toast. The editor retains the nonempty successful response message, starts finishSave after saving/global loading end, and emits one final success after cleanup succeeds. Failed cleanup retains pending state; Retry repeats only cleanup. Empty response messages and discard emit no generic success | UI22 source matched; cleanup failure/retry runtime pending |
| Shared presentation | Feature-owned list/filter/pager palettes and editor error markup removed; VehicleType retains only structural diagram presentation. Enum dropdowns use actual numeric enum values and current-language TranslateOptions | Source matched |

Known boundary: ServiceChecklistItem1 has no confirmed backend producer, and its legacy product/loyalty boilerplate remains untouched. This business slice is Blocked pending an owner-supported API or routing decision; do not treat its inherited source as a canonical CRUD implementation. No permissions, accounting, backend schemas or AutoMapper rules were changed; Add-Migration is unnecessary. Root translation/integration reconciliation and compilation, RTL/theme, child deletion, upload/cleanup and navigation verification remain pending. No prohibited commands were run.

## Root integration result — 2026-10-04

The root integrated required en/ar keys and direct dependencies and completed source reconciliation. Final Fleet/vocabulary syntax parsing reports no diagnostics; scoped whitespace review passes, literal translation references are present, and canonical touched Fleet namespace parity is en1218/ar1218 with no missing/case-only keys. This is source evidence only. Original business/API blockers and owner compilation/runtime/visual acceptance remain pending as documented. See [Fleet feature review](<../Archive/Completed/2026-10-23/FLEET_FEATURE_REVIEW.md>) for complete integration, packet drift and file manifest. The initial recipe check passed; the final check reports stale phases01/03/04, with canonical books controlling the work. VehicleType's final composite success integration also restores its required TranslateService injection. No prohibited commands ran.

Documentation conformance follow-up — 2026-10-08: refreshed recipe packets were checked before this pass and all PLAN-00/PHASE-00..06 checks returned OK. Fleet list filters now opt into the shared stable layout; simple catalog/tracker filters use the shared inline action placement; report filters use the stable report strip; all Fleet PrimeNG calendars explicitly preserve invalid typed input with `keepInvalid=true` and editable input with `readonlyInput=false`; VehicleQRLabel list transport now uses `DEFAULT_PAGE_SIZE`. The Sales guide Fleet topic was updated to describe the stable filter/More filters/Search/Reset workflow. No endpoint, DTO, persistence, calculation, permission or blocked-workflow assumption was introduced. Source-only validation and owner visual/build/runtime acceptance remain pending.
