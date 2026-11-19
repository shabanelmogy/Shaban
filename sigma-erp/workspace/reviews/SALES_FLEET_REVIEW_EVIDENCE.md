# Sales Fleet — current review and confirmed fixes, 2026-10-26

## Follow-up — duplicate tab Add actions and Equipment POST500, 2026-10-27

| Item | Evidence and disposition |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope / authorization | Owner reports duplicate Add Document/Add Warranty in Fleet, then supplies Equipment Add500 diagnostics. Tier S template correction and save-failure source diagnosis; existing contracts unchanged. |
| Actual route / shapes | pages/routing.ts /Fleet -> Sales/Fleet/fleet.routes.ts -> EquipmentDetailsComponent, create/edit/view; distinct /FleetVehicle is excluded. UI screen02 routed peer tabs, UI13 routed section/header Add contract and UI14 shared collection; existing Equipment aggregate backend contract retained. |
| Confirmed duplicate and fix | Each tab rendered a FormSection projected primary Add button plus EditableCollectionTable addLabel. headingVisible=false hides the table title only; its toolbar still renders when editable and addLabel are set. Removed the two table addLabel attributes. Shared addLabel defaults to empty; one section-header Add remains per editable tab, zero in View. Existing busy gates, row handlers, remove actions, typed rows, upload/draft/save behavior and scroll frame retained. No shared component change needed. |
| Conformance reference | UI13 section-header Add example explicitly omits child addLabel; UI14 real EditableCollectionTable input/template and FormSection projection verified. Existing Job editor header projection inspected. No new reusable rule: UI13 already prohibits the duplicate toolbar. |
| Analysis evidence | Analysis-guide entry README and chapter8 read; catalog S096 and original library/pages/89809ead04c55c7c.html describe Vehicle document attachment, not Sales equipment/warranty rules. Accepted supporting-document workflow only; no external design/business rule imported. Existing Sales Fleet contract and bilingual sales-guide.ts topic remain authoritative. |
| User guide | Updated Sales Fleet topic in src/app/modules/UserGuide/content/sales-guide.ts: add documents/warranties through their section-header actions and Save. Existing /UserGuide/sales reader/menu retained; both languages updated. |
| Cache/loading/performance scope | No request, service, lifecycle, lookup, cache, filter, row count or query change in the two-attribute correction. Existing Fleet request/cache/loading evidence remains applicable; source reviewed actual route and local Add handlers. Add calls existing EditableRows only, with no new backend/read/per-row work. No index proposal justified for duplicate UI controls. Runtime/RTL/themes/intermediate widths remain pending owner acceptance. |
| Save failure evidence | Owner supplies POST Equipment500, DbUpdateException, SQL207 during SaveChanges. SQL207 is invalid column name; [Microsoft reference](https://learn.microsoft.com/en-us/sql/relational-databases/errors-events/mssqlserver-207-database-engine-error). Diagnostics omit the provider message, so the exact offending column remains unknown. This is independent of the duplicate buttons. |
| Schema finding | Current Equipment entity/config map AssetId, SalePreparationId, SaleStockCost and SaleStockCurrencyId. Scoped migration-source search found none of these sale-provenance columns and snapshot search found no new sale-preparation types/columns. Existing financial-completion review already hands off CompleteSalesAndEquipmentRentalFinance as not generated. Source evidence strongly supports unapplied/uncreated schema work; actual deployed schema/history not inspected. Do not remove mapped financial fields or mark them NotMapped to mask this. |
| Owner schema handoff | Follow SALES_EQUIPMENT_FINANCIAL_COMPLETION_FEATURE_REVIEW.md schema section: owner generates/reviews/applies CompleteSalesAndEquipmentRentalFinance with DataAccess migration project and ServerAPI startup, preserving existing prerequisites. No migrations/snapshot/database changed or commands run here. Confirm raw Invalid column name diagnostic if failure remains or the owner already applied that schema. |
| Verification and bounds | Reviewed complete scoped frontend diffs, retained pre-existing user edits and checked whitespace/conflict markers. No new imports/types/translations needed. No build/tests/lint/browser/runtime/database/migration/commit/push executed. No agents: small sequential fixes. Owner checks Create/Edit each tab has one Add and adds one row; View has none; Save after schema alignment. Suggested frontend commit: fix(fleet): remove duplicate collection add buttons. |

| Field | Current result |
|---|---|
| Status | Implemented — source-only; owner verification pending |
| Authorization | Later owner request authorizes FL26-01/02/03 application fixes; FD26-01/02 remain decisions |
| Scope | Sales `/Fleet` list/create/view/edit and legacy details redirect; Equipment boundary, consumed lookups, files, guide |
| Tier / contract | M; `SALES_FLEET_CURRENT_REVIEW_CONTRACT_FREEZE.md` Frozen for review, no new business rule |
| Evidence | Current source, current books and shared owners; no new screenshots/video supplied |
| Preserved changes | Four Fleet component files, Sales guide and prior Equipment grid correction; earlier report below is historical |
| Runtime / owner verification | Pending; no build/test/lint/typecheck/browser/runtime/DB/migration/commit/push/deploy/Graphify/Sigma MCP |

This current section supersedes stale source claims in the historical 2026-10-04 review below. Historical findings are not repeated merely because an old report lists them. Selected UI shape is type02 routed editor because Documents and Warranties are independent collections; backend is BE14 master-detail without an accounting effect at Fleet Save. Root owns contract, list/integration and final reconciliation; two bounded read-only agents audited editor and backend with gpt-6-luna. All8 generated recipe checks passed before the initial read-only review. The owner's later fix request authorizes the execution section immediately below; the original findings retain their discovery evidence. No backend/schema/migration implementation follows these frontend fixes.

## Confirmed-fix implementation — 2026-10-26

Later owner request: fix the review findings. Frozen execution amendment is recorded in `SALES_FLEET_CURRENT_REVIEW_CONTRACT_FREEZE.md`; it supersedes the initial review-only statements for FL26-01/02/03. Existing type02/BE14 and API/payload/lifecycle/cache business contracts remain. Root implemented these coupled lifecycle changes without delegating overlapping code; a bounded read-only peer source audit reuses the editor reviewer while root reconciles guide/artifacts. FD26-01/02 are not silently decided.

| Finding | Implemented source / contract evidence |
|---|---|
| FL26-01 | Detail ngOnInit subscribes to paramMap with distinct mode/ID, destroyed with the component. initializeRecord emits recordChanged before new reads; detail/finite lookup subscriptions takeUntil that signal. Reset old equipment/form/child arrays/options/errors/current tab/exit URL/editorFinished and initial saved-label merge state; reapply mode and load the new matching saved record. Existing dirty/discard/upload/write guard runs before the route activates. Query-only changes do not initialize again, so draft state is retained. NavigationCancel/NavigationError after a completed discard rehydrates the saved/new record instead of retaining a finished-guard bypass and deleted temporary paths; cancelled discard consent itself preserves draft. The explicit discardedForExit flag excludes successful Save/Delete terminal exits from this recovery, avoiding blank Create/reloading a deleted ID on a cancelled terminal exit. Branch source/watch eligibility and selected getters remain; fresh finite bootstrap uses the existing cache, bind remains once per component |
| FL26-02 | Fleet list routeParams serializes the applied isActive into string true/false or null. Shared writeListRoute now retains nonempty false string; restoreRoute already distinguishes it. HTTP currentFilters remains boolean and every page/sort/delete refresh/editor handoff/output still uses the applied snapshot. Shared serializer and unrelated consumers unchanged |
| FL26-03 | Confirmed discard and cleanup-only Retry wrap work in defer → existing LoadingService.startLoading, with finalize endLoading and DestroyRef cancellation. Cleanup subscribes while Save still owns its count, so async Media deletion remains covered after Equipment request ends; no new spinner/host. Empty cleanup completes synchronously and shared render-safe publication coalesces it. Busy, failed-path retention, cleanup-only retry and original exit destination retained; successful Equipment save is never repeated |

Changed application files: `Sales/Fleet/components/details/details.component.ts`, `Sales/Fleet/components/list/list.component.ts`, and `UserGuide/content/sales-guide.ts` in the frontend repository. Existing guide `/UserGuide/sales` Fleet notes now explain tri-state filter restoration, changed-record hydration/dirty consent, and page-owned cleanup/cleanup-only Retry in EN/AR. No template/shared owner/backend/entity/map/schema/index/migration modification in this fix slice, and all preexisting dirty changes preserved. Existing canonical UI10/13/18/22/28 and shared APIs already specify this behavior; no reusable capability/rule was added, hence no canonical/skill/generated change required. All8 packet checks passed again before use.

Source verification: final TypeScript parser for editor/list/guide and Angular template parser for the current editor passed with zero syntax errors after all source changes; scoped whitespace checks passed. Complete editor/list/guide source diffs reviewed, including preexisting work. The reused bounded editor peer audited route hydration, branch watch, typed reset, cleanup finalizers and the final discard-only cancellation distinction; no remaining actionable issue in this fix slice. Installed typed FormGroup.reset declaration accepts the optional reset value/options used here. No typecheck/build/test/runtime claim. Existing cache/loading/query/index evidence below remains applicable, amended by this execution table: old record reads are cancelled before new bootstrap, normal Branch refresh stays silent, and cleanup now uses the sole page host with paired release. Backend query volume/index candidates are unchanged; no measured latency improvement claimed. Runtime route reuse/discard/failure/Media overlap/TTL/network/visual acceptance and the existing measurement plan remain owner checks.

Suggested frontend commit (suggestion only): `fix(sales): correct fleet record lifetime filters and cleanup progress`. No new migration required by these frontend changes; prior deferred schema decisions remain separate. Phases0/1 contract amendment,2 route/filter,3 editor/cleanup,5 integration and6 reconciliation apply; new backend/domain/schema work skipped. No prohibited command run.

## Original confirmed findings, in priority order — implemented above

### FL26-01 — P2: reused editor route keeps the previous unit

Source: `SiGmaAngularFrontEnd/src/app/modules/Sales/Fleet/components/details/details.component.ts:303-314,339-374,680-686,761-790`; routes `fleet.routes.ts:24-39`; UI13 same-route ID lifetime and UI28.

For a navigation such as `/Fleet/edit/1` → `/Fleet/edit/2`, or view-to-view with a changed ID, Angular's default strategy reuses the component because its routeConfig is unchanged. Installed Router source confirms both reuse and the changed-parameter guard path. Fleet reads mode/ID only in ngOnInit/applyRouteState; there is no paramMap/data subscription, replacement detail load or form reset. The URL can therefore identify unit2 while id/equipment/form still contain unit1. A subsequent Save targets the old id. When a dirty exit is accepted, canDeactivate additionally cleans uploads and sets editorFinished=true, but the reused instance is not recreated, so the old draft and completed-exit flag remain. Ordinary list→editor navigation is unaffected; the defect is the supported same-config parameter transition.

Recommendation: drive initialization/hydration from distinct route mode/ID, cancel the old read, reset record-owned state and completed-exit/upload lifetime safely, then load the matching record; preserve dirty decision and query state. Do not overwrite a retained dirty matching draft on read Retry. Verify clean/View and accepted/cancelled dirty transitions with delayed/error detail responses. No source change made.

### FL26-02 — P2: inactive-only filter disappears from the saved URL

Source: Fleet list `list.component.ts:195-199,315,374-380`; shared `utils/list-route-state.ts:49`; UI10 applied list-state return contract and UI2 false-value filter semantics.

Choose Inactive and Search: Fleet's applied snapshot correctly sends isActive=false to the API. Its routeParams spreads that boolean into writeListRoute, whose generic reducer drops every false value. The resulting URL has pageNo but no isActive. Reloading/opening that URL makes restoreRoute choose null (all activity states), rather than Inactive. The live query remains correct until restoration, which can hide this problem during ordinary searching. The editor itself returns snapshot.queryParams verbatim; it is not the source of the lost value.

Recommendation: preserve an explicit false representation for this tri-state filter in the route contract (or correct the shared serializer after auditing compatible consumers). Keep null/absent distinct from false and retain the real applied snapshot through page/sort/output. Verify active/inactive/all across refresh, shared URL and editor return. No implementation or broad shared change authorized here.

### FL26-03 — P2: asynchronous attachment cleanup has no visible progress owner

Source: detail `details.component.ts:353-366,378-400,473-494`; template `details.component.html:6-12,31-42,481`; shared `service/document-upload-tracker.service.ts:93-131` and `file-upload.service.ts:52-59`; UI18 cleanup lifetime and UI22 page save/delete owner.

After replacing/removing a saved attachment, a successful Equipment save starts finishSave Media DELETE requests through retryCleanup. The Equipment HTTP subscription finalizes immediately after its response and releases its global loading count; cleanup is a separate subscription with only uploads.cleaning/cleanupKind busy flags. Discard cleanup has the same gap. ReferenceLookupStatus receives only lookup flags and the Save button receives only saving; the cleanup alert/Retry appears after failure. During pending deletes the editor is disabled with no owned progress indicator (other unrelated operations may temporarily mask it). The tracker and FileUploadService do not acquire a page lease/count. Empty cleanup without network work is not the problem.

Recommendation: cover actual subscribed cleanup/discard/retry work with the existing page progress owner and exactly paired finalize/cancellation release, keeping one visible indicator, busy state, retained files on failed save, cleanup-only Retry and original exit destination. Never repeat a successful Equipment Save merely to retry Media deletion. No new feature spinner or source edit.

## Business/contract decisions — not assumed functional defects

| ID | Actual source evidence | Decision required / boundary |
|---|---|---|
| FD26-01 Reserved inactivity | Equipment Update permits a Reserved unit to become inactive (`EquipmentService.cs:144-151`); activation path blocks reactivating Sold/Delivered only (`:169-180`). Agreement validation requires active units (`SalesAgreementService.cs:1111-1117`) and invoice rejects inactive Reserved (`:222-224`). The frontend checkbox locks only Sold/Delivered (`details.component.ts:197-200,409-414`) | This can block editing/invoicing the existing agreement until reactivation. Existing Frozen F8 expressly governs Sold/Delivered cost, not Reserved inactivity. Clarify whether temporary inactivity is permitted with that stop, or must be refused while reserved; do not silently remove the downstream availability check or impose a new lifecycle restriction. Not counted as a confirmed implementation defect without this rule |
| FD26-02 Root text lengths | Add/Update VMs and EquipmentConfig do not declare maximums for plate/chassis/engine/capacity/interior/fuel strings; current snapshot stores unbounded text. Child document/warranty caps already exist | Agree exact per-field maximums and historical-data handling before annotation/EF/form changes. No fabricated numeric caps or migration; future EF length changes need owner migration. Separately frozen plate normalization/unique-index decision remains deferred |

## Contract/source conformance

| Concern / owner | Current source comparison and disposition |
|---|---|
| Route/shape, UI1/13 | pages/routing.ts `/Fleet` → Fleet_Routes → FleetComponent; create/view/edit → EquipmentDetailsComponent; details/:id redirects to view/:id. Guards call canDeactivate. UI type02/BE14 retained. FL26-01 is the lifetime exception |
| List geometry, UI1/3/4/6 | Actual Workshop Job list uses shared shell, title, stable FilterPanel, fill DataTable. Fleet uses the same owners. Prior owner alignment fix stableLayout=true is present; five main fields plus More filters retained. No local list stylesheet or host display/width override |
| Width/scroll, UI1/29 | Actual host class sigma-route-host inherits display:block/min-width0/height100%/overflow:hidden (`styles.scss:3629+`); page/panel use flex-column/stretch/border-box/height100% with shared inset, table/body min-height0. Editor SCSS is comment-only, header/footer fixed, detail body sigma-editor-scroll, child tables shared fill. No feature viewport calc/max-width or competing outer scrollbar. Source chain conforms; measured bounds not checked |
| Grid/ListVM, UI5/6/BE3/7 | Actions first; plateNo, make, model, vehicleType, interiorColor, isActive(status), saleStatus(status), branch, chassisNo, engineNo, purchaseDate(date), purchaseCost(money). EquipmentListVM properties are precisely Id plus PascalCase equivalents; no audit/tenant/editor-only columns. Enum/boolean/status/date/money/export owners retained |
| Filters/read, UI2/4/8/10, BE7/9 | plateNo/chassisNo/interiorColor strings, branchId/carModelId/vehicleTypeId integers, isActive boolean, saleStatus enum; encoded grid and whitelisted sort. Search applies draft snapshot; page/sort/delete refresh/output reuse it. False works in HTTP serializer/backend but not route serialization (FL26-02). Count then projection/page, max100, server page clamp reflected in paginator |
| Detail/write, BE3/4/8/14 | Detail is lean identity + displayed refs/scalars + documents/warranties. Add/Update contain editable inputs, Update root/retained-child IDs only; SaleStatus/tenant/audit excluded. One-way profiler, explicit collection reconciliation, ownership/existence/usage checks. No calculated Fleet financial total/AutoMapper change recommended |
| Form/View, UI13/14/15/16/17/19 | Typed forms, shared scalar/date validators, FieldError, EditorTabs/EditableRows/EditableCollectionTable and FileField/FileLink; View disables form and uses persisted labels, skips edit-only lookups. Numeric/year/cost validations from prior work retained; text caps need FD26-02 |
| Save/discard/delete, UI7/9/10/18, BE8/12 | Shared confirmation, busy/dirty/failed-cleanup recovery; delete only shown for Available and backend checks real inbound references. Equipment update/active/delete share SalesAgreement write lock, add/update duplicate check Equipment lock, concurrency fields prevent stale sale overwrite; children saved/reconciled together. FL26-01/03 remain |
| Print/Excel, UI8/21 | fetchAllPages size100 uses applied filters/sort/grid and fails whole output if one page fails. Shared column export translates headers/status at click time; print renders complete printData through shared DataTable, paginator/scroll disabled, ReportPrintSession owns frame/afterprint cleanup |
| Registration/permission | FleetService providedIn root and absent from LayoutModule provider list. Existing Branch/CarMake/CarModel/VehicleType compatibility registry is known shared architecture, not newly introduced. Existing one HttpClient/auth/interceptors; no permission system invented. Equipment POST/PUT/DELETE/activation are permission candidates, not secured by UI visibility |

## Per-source cache evidence

URLs below are relative to the existing environment.baseUrl, not new endpoints.

| Exact URL/envelope | Classification / producer and writers | Actual consumer lifecycle / final status |
|---|---|---|
| Branch/GetSelect, Results<DropDownSelect> | Approved reference, BranchService.cacheSelect=true → BaseService.readReferenceSelect/watchReferenceSelect → root ReferenceLookupCacheService. Branch createBranch/updateBranch pipe invalidateSelectOnSuccess; delete/inherited writes same owner. Front cache topic lookup-branches maps server RealtimeTopicDefinition(Branch); no separate Branch import writer found in scoped owner | List loadDropdowns/editor loadLookups finite successful branch bootstrap sets branchBootstrapped then binds once; matching inline-feedback mode; selected-ID/current-options getters preserve selected labels/draft. Shared binding clears options on context reset, retained refresh silent, errors/Retry and DestroyRef teardown. Source matched; tenant/TTL/rejoin/network acceptance pending |
| CarModel/GetMakeAndModel, Results<DropDownSelect> | Direct reference, CarModelService has no cacheSelect opt-in; combined make/model producer. POST CarModel/CarMake writers exist but no eligible cache/invalidation requirement added | List finite forkJoin options + both failure channels and retryDropdowns; direct by source contract, no watch |
| CarMake/GetSelect, Results<DropDownSelect> | Direct reference, CarMakeService has no opt-in; FleetService.createMake POST CarMake | Editor finite forkJoin, saved labels merged, errors/retryLookups; catalog reload after successful write; no cache/watch presumed |
| CarModel, Results<CarModelDTO> | Direct reference/full model catalog through FleetService.getCarModels; no source opt-in. Missing pagination is intentional full make→model choice set, not inferred truncation | Editor finite bootstrap, local make filter, saved-model labels; catalog create/reload retry retains draft; no reference watch |
| VehicleType/GetSelect, Results<DropDownSelect> | Direct reference, VehicleTypeService no opt-in | List/editor finite bootstrap and Retry; no cache/watch required by this source |
| Equipment, Equipment/GetByWithNavigationsId/{id}, Results/Result | Direct operational list/detail/state, FleetService; Add/Update/Delete writers retain financial/history/lifecycle authority | List switchMap/destroy, editor detail/read guard and writes; no reference cache. FL26-01 route lifetime still open |
| POST Media, DELETE Media?path={encoded path} | Direct file operations, FileUploadService and editor-scoped DocumentUploadTracker; not reference data | FileField upload validation/tracking, post-save/discard deletion and cleanup-only retry. FL26-03 progress gap |
| Active/Sale/Warranty/Document/Period enums | Local constants/enums | No HTTP/cache/writer/topic applicable |

Root ReferenceLookupBindings actually retains selected-only current options, clears an explicit reset and never patches forms; this is source evidence, not merely a shared import. No new source opt-in, financial/availability cache, socket or permanent replay is proposed.

## Loading request/visibility evidence

Effective Fleet list/create/view/edit route data does not suppress progress: LayoutComponent.showPageLoading defaults true and layout template38-39 renders the sole shell StateMessage. LoadingService retains query-only navigation progress, resets actual parsed path departure and maintains identity-owned lookup leases; template imports alone were not used as proof.

| Operation | Subscribed start/release and visible owner | Recovery / disposition |
|---|---|---|
| List initial/search/page/sort | listRequests switchMap → defer starts loadingList/global count; finalize releases on success/false/error/cancel/destroy. Table mask false | Inline list error, Search retries; stale responses cancelled. Page owner matched |
| Required list/editor lookups | finite lookupsLoading + ReferenceLookupBindings.loading feed mounted ReferenceLookupStatus; ngOnChanges owns page identity lease, destroy releases; forkJoin finalize clears finite flag | Shared error/Retry; retained branch refresh no loading with a snapshot. Matched, no inline filter spinner |
| Editor saved detail/Retry | getItemById starts global count/loadingDetails; finalize releases, DestroyRef cancels, matching id guard | Error + Retry, View no edit lookup bootstrap; FL26-01 replacement navigation issue |
| Equipment save/delete and list delete | Existing global start/finalize plus local guards, interceptor owns mutation feedback; delete refresh uses applied query | Save failure keeps input; real write tracking separately protects navigation. Matched for Equipment request |
| Full print/Excel data reads | loadAll acquires global count, getAllList finite all-pages operation finalizes/cancels on destroy | Inline output error; same output button can repeat applied query; no partial export. Matched |
| Nested Make/Model create and reload | Body-appended EditorDialog.saving/catalogSaving owns foreground shared StateMessage, covers POST and subsequent lookup reads; inherited dialog scope | Inline catalog errors/Retry, close/form guards retained. Matched |
| File upload / asynchronous cleanup | FileField upload uses actual tracker flag; cleanup/retry/discard only cleaning/cleanupKind; no cleanup count/lease, shell save count can end first | Busy/errors/cleanup-only Retry exist; cleanup visible-owner mismatch FL26-03 |

## Load speed, queries and indexes

List open subscribes lookup forkJoin (Branch/GetSelect, CarModel/GetMakeAndModel, VehicleType/GetSelect) independently of initial Equipment list. Warm approved Branch snapshots may avoid transport; direct model/type reads remain. Create boots four lookup sources; Edit overlaps them with a detail read; View skips lookup bootstrap and projects saved labels. Catalog creation must precede reload of the newly saved option. These are source dependency counts, not measured network/SQL timings.

Equipment list applies tenant/live predicates and fixed filters plus validated encoded grid before Count and ordered ProjectTo/Skip/Take; it materializes only the page and needed reference names, with Id tie-break ordering. Count/page are two awaited materializations, no per-row list request/query found. Top-level text keys follow the generic scalar equality path; grid operators determine equals/startsWith/contains etc. Detail uses AsNoTracking projection; editor updates Include two child collections and reconcile one save. FK/existence/duplicate validations are sequential; full reference catalogs and all-pages output scale with data, and the two-child update join may grow with Documents×Warranties. No measured bottleneck or speed improvement claimed; preserve tenant/history/count/financial/lifecycle if later optimizing.

Equipment config/snapshot already have FK indexes for BranchId/CarMakeId/CarModelId/VehicleTypeId and SaleStatus. No source recommendation to add a plate/chassis text index now: normalized business uniqueness remains a separately deferred owner decision; Contains/endsWith grid searches would not gain ordinary B-tree seeks. Default active-list workload could investigate **(SubscriptionId, IsDeleted, IsActive, Id DESC)**, no INCLUDE/filter initially, as a *conditional plan-review candidate*, not an approved schema change. It aligns tenant/live/activity equality and default Id-desc page access, unlike the existing single-column FK/SaleStatus indexes; nullable live predicate/provider SQL and active selectivity may limit it, and wide projections still need lookups. It adds storage/maintenance on insert/delete/activity change and can overlap any deployed index absent from source. Compare existing coverage, count/page actual plans/reads and update cost before selecting it; do not replace existing FK indexes or change nullable-delete semantics. No index/EF/migration file touched.

Owner measurement plan: same build/API/database/device/network, same representative tenant and data distribution, identical active/inactive/all filters/grid/sort/page15 and100. Capture cold and warm approved-cache opens, search/page, View/Edit with large child collections, failed lookup Retry, file cleanup and complete export/print; five repeated samples per scenario initially, report observed durations/distribution only as supported. Separate usable content/settled required data, request payload/count, SQL commands/reads/plans and render bounds. Compare equal output/TotalCount/state guards. No timing target invented; no benchmark/build/browser/SQL commands run here.

## Handoff and final reconciliation

| Gate | Final result |
|---|---|
| Current source audit | FL26-01/02/03 implemented and source-reconciled; FD26-01/02 remain business/data-contract decisions, not invented changes |
| Diff/ownership | Current full scoped frontend component/model/service/route/guide diff and Equipment backend diff inspected independently; earlier dirty changes preserved. Execution modifies only editor/list TS and guide, no new compile success claimed |
| User guide | Existing `UserGuide/content/sales-guide.ts`, `/UserGuide/sales` reader/menu; EN/AR Fleet notes now cover tri-state restoration, new record hydration/dirty consent and page-owned cleanup with cleanup-only Retry |
| Backlog/reference | UI30 known shared compatibility/debt and prior Sales frozen fixes checked; current defects separated from old/resolved records. No approved reference module modified |
| Rules/packets | Existing canonical rules sufficient; no rule/skill/generator change. Initial all8 -Check passed; no derivative changes |
| Visual acceptance | All empty/loading/error/populated, sidebar open/collapsed, >1250/intermediate/720/narrow, short height, RTL/LTR/light/dark and print geometry pending; source shared chain is not a measured visual pass |
| Owner scenarios | Inactive Search→reload/share; edit1→edit2 and view1→view2 (clean/dirty accept/cancel, delayed/error response); query-only navigation keeps draft; replace/delete file→successful Save→slow/failed cleanup→cleanup-only Retry/discard; rejected/errored target navigation after completed discard restores usable current record; verify page count releases without duplicates |
| Database/migration | None introduced by this review. Prior concurrency-model snapshot/unique-plate normalization decisions remain separate; any future text-length/index change requires explicit contract and owner-run migration |
| Suggested commit | Frontend: `fix(sales): correct fleet record lifetime filters and cleanup progress` (suggestion only; no commit run) |

---

# Historical Sales Fleet bounded read-only evidence — 2026-10-04

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Date | 2026-10-04 |
| Scope | Sales/Fleet Angular source and directly related Equipment backend boundary |
| Contract | SALES_CYCLE_CONTRACT_FREEZE.md, Frozen, sections 4 and 7 |
| Execution | Source-only; no application/configuration/documentation-rule changes |

## Authority and scope

Read `F:/My Work/Sigma/AGENTS.md`, its required screen-refactor skill, Master required-decisions/reconciliation blocks, owning UI screen catalog/list/modal/view/upload/cancellation blocks, and backend VM/mapping/list/service/validation/master-detail/backlog blocks. Root reported the current eight generated recipe drift checks passed. Phase 2, 3 and 4 packets route this bounded audit. No screenshots supplied for this Sales review.

Frontend scope: all current source in `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Sales/Fleet` (specs inventoried, not executed). Backend scope: Equipment entity/enum/configuration/VMs/profile/interface/service/controller; relevant shared controller/repository/VM/base service and directly related sales-state writers, document attributes, rental DeliveryNote references. Routes/translations and full Sales cycle reconciliation remain root-owned.

Existing frontend changes were preserved: nine tracked files changed/deleted plus untracked `models/sale-status.ts`. No current Equipment-scoped backend diff was present. This artifact is the only file created by this audit. Review findings include current-source defects, not merely changes introduced in the pending diff.

## Priority findings

### FLEET-01 — P1: concurrent ordinary update can undo a completed sale

Primary source: `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/EquipmentService.cs:171`.

The service reads a tracked unit at lines 136–141, checks its current SaleStatus at 161 and conditionally retains inactive/posted-cost values, then calls `Repository.Update(entity)`. That helper calls `_context.Update(entity)` at `SiGma.Repos/Repository/Repository.cs:157`, marking the whole root row modified. EquipmentConfig declares no sale-state concurrency value; shared DbContext protects SubscriptionId only. If the equipment update reads Reserved/active before a simultaneous invoice commits Sold/inactive, the update can subsequently write its old Reserved/active state and its old or client-provided cost back. A concurrent Deliver can similarly be reverted. SaleStatus is absent from the request but still written from the stale loaded entity. This breaks the frozen server-owned sale lifecycle and can put a sold unit back into rental selection.

Related state-check race: `EquipmentService.cs:187` checks Sold/Delivered in a separate query before calling the base activation method. A unit can become Sold between that query and the tracked activation load, then be reactivated.

Recommendation: preserve field-level tracked updates and make the sale lock/state check atomic against invoice/delivery/activation writers, using the existing permitted concurrency/isolation conventions. A change that only removes the full-row Update prevents stale SaleStatus writes but does not alone protect IsActive/PurchaseCost or the separate activation check. Runtime race verification remains pending.

### FLEET-02 — P1: delete bypasses live rental usage and child deletion

Primary source: `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/EquipmentService.cs:195`.

RemoveAsync checks only SalesAgreementItem, then delegates to base.RemoveAsync at line 200. The base soft-deletes only the parent, without EF usage discovery or owned children (`Services/Bases/Service.cs:908`). A unit with no sales item but with a live rental DeliveryNote (`Helpers/Models/DeliveryNote.cs:32`, EquipmentId; ReturnDate at 54) can therefore be deleted while still held by a customer. QuotationDetail.EquipmentTypeId is another directly evidenced inbound reference. Documents and warranties of an otherwise unused deleted unit stay live.

Recommendation: use the canonical `RemoveWithChildrenAsync` with Documents/Warranties and its EF-model `InUseAsync` boundary, retaining the sales-specific message only if needed. This is the scoped manifestation of existing BE backlog 31 (generic delete lacks usage check) and 23 (owned children remain live), not a newly discovered generic engine issue.

### FLEET-03 — P2: document form permits payloads the backend rejects

Primary source: `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Sales/Fleet/components/details/details.component.ts:961`.

DocumentNumber has only maxLength; IssueDate/ExpiryDate have no required validator (lines 961, 964, 965). The API's shared CustomerDocumentAddVM and CustomerDocumentUpdateVM require all three (`SiGma.ViewModels/ViewModels/CustomerDocument/CustomerDocumentAddVm.cs:10`, 17, 20; same attributes in Update). Selecting a document type and uploading a file leaves the form valid, so Save submits null values and receives API model-validation failure. Moreover the local date-order validator allows equal dates, while backend DateAfter defaults to strict greater-than. The editor lacks matching required cues and error messages for these fields.

Recommendation: align the form/headers/messages with the existing VM contract and strict date order, reusing shared factories/validation/presentation. Do not weaken the backend shared document contract to accommodate this legacy form.

### FLEET-04 — P2: attachment cleanup failures close the editor and lose retry state

Primary source: `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Sales/Fleet/components/details/details.component.ts:1196`.

finishSuccessfulSave shows an error when removed/orphaned deletion fails but unconditionally calls finish(true); discardAndClose does the same with finish(false) at line 1210. The sets retain failed paths, but closing/destroying this editor loses them. A transient file-delete failure leaves orphan files and provides no retry. These routines also implement their own tracking instead of DocumentUploadTracker; main Save/Close/tab/collection gates do not include uploadSaving, unlike the shared complete busy boundary.

Recommendation: adopt the existing tracker/file-field owners, keep the editor open and preserve failed paths for cleanup-only retry after an already successful aggregate save or discard. Do not repeat the aggregate save on cleanup retry. UI18 owns this rule; the frozen review already identifies Fleet editor as legacy, so this is a concrete scoped follow-up.

### FLEET-05 — P2: sold carrying cost looks editable but changes are silently ignored

Primary source: `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Sales/Fleet/components/details/details.component.html:259`.

The Sold/Delivered inactive checkbox is explicitly locked, but PurchaseCost remains an editable control. The backend replaces the submitted cost with the persisted cost for these states (`EquipmentService.cs:164`) and returns success. A user can change cost, save and close believing the correction was applied, though it was discarded. The frozen contract requires retaining the already posted carrying cost.

Recommendation: expose posted cost read-only and apply its disabled state through the typed form/mode owner. Preserve the backend lock.

### FLEET-06 — P2: duplicate-plate protection is only an unprotected pre-save query

Primary source: `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/EquipmentService.cs:265`.

Both Add/Update run ExistsAsync on PlateNo, then persist outside the generic UniqueColumns write guard. EquipmentConfig has a SaleStatus index but no matching tenant/live unique plate key. Two simultaneous requests for the same new plate can both pass and save duplicate units. Equipment's own validation establishes plate uniqueness as the current intended invariant.

Recommendation: declare the real normalized plate key and reuse the shared guarded Add/UpdateCore path, with a matching database invariant. The owner would run a migration if a unique index is approved; this read-only audit creates none.

## Grid, filter and DTO contract

Current grid order, after Actions: plateNo, make, model, vehicleType, interiorColor, isActive (status), saleStatus (status), branch, chassisNo, engineNo, purchaseDate (date), purchaseCost (money). Identity/action target: id. Status presentation and action visibility use saleStatus/isActive already displayed.

Backend ListVM: Id, IsActive, PlateNo, Make, Model, VehicleType, InteriorColor, Branch, ChassisNo, EngineCapacity, EngineNo, FuelTankCapacity, PurchaseDate, PurchaseCost, SaleStatus. **Extra relative to current grid/actions:** EngineCapacity, FuelTankCapacity. Frontend interface has the same extras. The pending list diff removed both former visible columns/export entries; print additionally omits InteriorColor. No corresponding requirement/removal decision was present in the frozen cycle contract. Root should classify restoring approved content vs an explicitly documented column contract; do not silently remove DTO properties before deciding the intended visible columns. This is BE7 scope drift and a visible-output reconciliation issue.

Filters match exact serialized/backend keys: plateNo/string, chassisNo/string, interiorColor/string, branchId/int, carModelId/int, vehicleTypeId/int, isActive/bool, saleStatus/int enum, sortField/string, sortOrder/int. Only applied form values are used for paging/refresh/export. Clear isActive omits it; inactive sends false. Default is active=true, all sale statuses; Sold/Delivered are inactive so the owner must clear status or select Inactive to view them. The list uses DEFAULT_PAGE_SIZE=15, server paging with count metadata and switchMap cancellation. EquipmentService defaults an omitted pageSize to 5 rather than canonical supplied-paging default 10 (structural consistency follow-up). Sort keys have deterministic Id tie breakers.

getAllList fetches every declared page at size100 and throws on any failed page; it does not return a partial file. It is still a feature-owned all-pages loop rather than shared fetchAllPages. Print/Excel reuse the applied filters and sort, but their columns differ as described above. Native print table remains a legacy UI20 presentation rather than shared grid/report ownership.

Detail fields: id; header/reference ids and names for branch/make/model/vehicleType; plate/year/chassis/engine/capacity/interior/fuel; isActive/purchaseDate/purchaseCost/saleStatus; documents and warranties. DetailVM still inherits unused tenant/audit/plumbing fields, a BE3 lean-read follow-up. Explicit reference DTOs have correct singular cardinality. Add/Update contain editable equipment values plus full snapshot documents/warranties; Update adds id. No tenant/no/audit/SaleStatus is sent. IsActive is a confirmed user input except the frozen sale lock; PurchaseCost is optional/nonnegative and API bounded. No frontend financial totals exist here.

## Backend and state writers

Equipment CRUD uses generic service/controller types but custom Add, Update, list, detail, active and delete paths. Controller authentication is inherited; there is no actual permission mechanism. DELETE Equipment and POST Equipment/handleActivate are authorization candidates, not secured by UI visibility.

The write service validates active same-tenant make/model pairing and optional branch/type, trims strings, validates child enums/dates/nonnegative warranty values, and proves positive saved child IDs belong to the current parent and are distinct. Children are reconciled as complete snapshots onto retained tracked instances; missing rows removed/new rows added. One aggregate save needs no explicit transaction. Handwritten loops and public Update override bypass the canonical reusable reconciliation/guarded UpdateCore owner and should migrate only on authorized implementation.

Mapping uses explicit one-way maps; the child navigations are correctly ignored in Update because they are manually reconciled. SubscriptionId/No ignores are unnecessary compatibility residue since write base contains neither. Detail projection filters deleted children; list projection flattens reference labels. No ReverseMap in EquipmentProfiler. Generic CarModel has older ReverseMap conventions, but that lookup owner is outside this bounded refactor scope.

Confirmed sale state writers: SalesAgreementService reserves units on Add/Update (lines56/130), releases Reserved on cancel/delete/removal (957–958), invoices them Sold/inactive (267–268), and delivers them Delivered (316). Ordinary Equipment request DTOs exclude SaleStatus, and serial Equipment updates preserve Sold/Delivered inactive/cost. Unit availability/current-agreement ownership/open rental/model/chassis requirements are owned by the agreement service. Invoice requires PurchaseCost>0 and posts rounded cost via existing money policy; full invoice agreement accounting audit belongs to the agreement workstream.

CarModel lookup investigation: **no truncated-model finding**. The editor uses GET CarModel with absent paging; base NormalizePaging deliberately returns null/null, and GetManyWithNavigations is unpaged. Its local make filter therefore receives all models. A preliminary concern was explicitly withdrawn after tracing the actual producer. Do not infer a page clamp from the Results wrapper alone.

## Conformance and deferred observations

| Concern | Owner | Source result |
|---|---|---|
| List shell/filter/grid | UI1/3/4/6, Workshop Job list; shared shell/filter/grid | Current Fleet list has container-fill host, shared panel/title, FilterPanel reset, fill grid and applied filters; stale list request cancellation uses switchMap |
| Editor shape | UI13 D4-2, routed editor owner | Current Fleet modal owns two child collections; canonical target is routed shape02. Frozen cycle reconciliation explicitly records Fleet editor as legacy; conversion is a known follow-up, not an implicit action of this read-only review |
| Modal tabs | UI13, shared EditorDialog/EditorTabs | Reuses shared shell/tabs and typed modes; no contentPadded; feature owns palette/padding/controls; record identifier is not used as header subtitle |
| Child rows | UI14, shared editable table/EditableRows | Shared table chrome reused; bespoke row factories/remove flows/columns without widths remain; mutation/busy handling needs shared owner |
| Files | UI18, shared DocumentUploadTracker/FileField/FileLink | Bespoke allowed-type/size/upload/tracking/cleanup; cleanup closes on failure; View exposes raw path without saved-file link |
| Dates/errors | UI17/19/22 | Legacy icon/picker-only calendars and local parser/error/state markup remain; detail/lookup failure has no retry; lookups are fetched in View; interceptor plus inline errors share feedback for editor calls |
| Domain concurrency/deletion | BE8/12/14, frozen Sales contract | Findings FLEET-01/02/06; ordinary state preservation works serially but does not protect concurrent writers |

No shared extraction or documentation rule changes were made because this request is source-read-only. No change is recommended outside current source owners to cosmetically clean the dirty tree.

## Verification and handoff

Reviewed current FE Fleet source, scoped tracked diffs including deleted list stylesheet, and complete untracked sale-status source. Backend scoped diff is empty; current producer source was read. Scoped git diff --check found no whitespace errors; merge-marker checks found none. Existing changes remain preserved.

No build, test, lint, runtime/browser/print, database/migration, commit/push, deployment, Graphify or Sigma MCP command was run. Migration/snapshot files were not edited. Schema already added by the earlier frozen Sales cycle still has its previously recorded owner verification boundary; this audit adds no schema change. No commit message applies to application repos for this read-only audit.

Owner verification pending: simultaneous Equipment update/activation versus invoice/delivery; delete with live rental/reference and owned rows; Fleet document required and strict-date feedback; upload removal/discard cleanup failure and retry; sold-cost display; complete Print/Excel column parity; RTL/dark/narrow dialog/editor layout. Root integrates this evidence into the broad Sales review; this artifact does not declare the Sales task complete.
