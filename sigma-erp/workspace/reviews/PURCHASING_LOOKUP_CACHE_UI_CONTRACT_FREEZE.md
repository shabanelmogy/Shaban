# Purchasing lookup cache — source opt-in contract

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Owner authorizes caching current purchasing/supplier dropdowns. Adopt the
reviewed scope/alternatives from PURCHASING_LOOKUP_CACHE_MAINTENANCE_EVOLUTION_PLAN.
Preserve frozen reference cache semantics; no business/API/schema change.

1. Enable protected override readonly cacheSelect=true in SupplierService,
   SupplierSharedService, BranchService, ItemService, AssetTypeService,
   CurrencyService and ContactGroupService. Country/UOM already enabled.
   Generic GetSelect envelope/URL/query/order remains exact. Ordinary live
   Job/Vehicle/Account/document-source choices, rates/details/settings remain fresh.
2. All typed create/update/delete/activation/default writes of newly enabled
   sources pipe existing protected invalidateSelectOnSuccess(); inherited
   BaseService post/put/delete/AddList/UpdateList retain the same operator.
   Currency's separate number-policy invalidation must remain. No feedback,
   success conditions, body, headers, or financial effects change.
3. Root extends ReferenceLookupCacheService with
   invalidateSelectSource(sourceUrl:string):void: remove exact
   sourceUrl+'/GetSelect' plus sourceUrl+'/GetSelectByType/' descendants only.
   This covers default/inline modes and pending/settled entries. Preserve
   invalidate(url) for exact force refresh. Root BaseService operator invokes
   this family invalidator only for opted-in sources after isSuccess===true.
4. Root adds protected readReferenceSelect<T>(url:string,
   load:()=>Observable<T>, options?:{skipErrorInterceptor?:boolean;
   forceRefresh?:boolean}):Observable<T> to BaseService, delegating to existing
   cache owner when cacheSelect=true, otherwise load(). getSelectList reuses it.
   ContactGroupService.getSelectByType adds optional forceRefresh to options,
   builds exact encoded URL and original loader, then calls this helper.
   No new CVA/PrimeNG cache or backend parameter.
5. Root updates typed ImportSupplier/ImportItem services: on savedRows>0
   invalidate the corresponding Supplier/Item source family before subscribers,
   including partial batch isSuccess=false. Failed/no-save/HTTP-error retains
   snapshots. No unrelated import route or transport changes.
6. Snapshots are temporary in memory with existing TTL5min/LRU64, session/
   language/credential fences, focus invalidation, failures uncached, consumer
   clones and pending sharing/cancellation. No realtime/live option rebinding,
   browser-storage cache, provider/interceptor/schema changes or new runtime
   entry. Backend writer validation remains authoritative.
7. Source-only validation and guides required; no builds/tests/lint/runtime/DB.
   New reusable source-family/type/import policy promoted to UI2 and skill,
   packets generated and checked. No migration. Complete scoped diff review.

Worker owns only seven source services in row1 plus typed ContactGroup read.
Root owns BaseService/cache helper, two import services, guides/docs/reviews.
Worker must preserve peer/user changes, not revert or modify root files.
Report conflicts rather than inventing helper shapes or expanding scope.

## Source-supported dependency amendment before final integration

SupplierService Add/Update and ImportDataService.Supplier mapping call
GetOrCreateDefaultGroupIdAsync(ContactType.Supplier). Therefore successful
Supplier writes/imported saved rows must also invalidate ContactGroup selects.
Root adds BaseService protected readonly selectCacheDependencies:readonly string[]
(default empty); success-only source invalidation also invalidates these explicit
controller names at the same base URL. SupplierService and SupplierSharedService
declare ['ContactGroup']; Supplier import invalidates both sources. No general
mutation interceptor or inference from arbitrary URLs. This is a discovered
producer dependency, not a new business rule or endpoint.

## Owner correction — repeated PO GetSelect calls, 2026-10-24

Owner specifically reports all GetSelect calls on reopening PO. Existing code
evicts settled snapshots on every window focus even if document remains visible
(for example DevTools focus changes), and PO Job/Vehicle ordinary GetSelect
sources were excluded. Source tracing now distinguishes their actual ordinary
select from operational searches: neither JobService nor VehicleService overrides
SelectAsync; base SelectAsync→Repository.GetDropdownAsync yields tenant-owned
nondeleted identity/label/No (Vehicle label PlateNo), without capacity/status/
availability data. Supersede their blanket exclusion ONLY for ordinary GetSelect.
Vehicle Search/status/detail and Job options/closing/detail, document sources,
rates/previews, account operational selectors remain fresh.

Confirmed correction: opt in JobService/VehicleService to the same cache; their
typed Create/Update/Delete and Job Close/Cancel invalidate on success; inherited
writes already invalidate. Vehicle CSV savedRows>0 invalidates Vehicle. Job
service is an approved reference, explicitly in scope here only for its select
opt-in and source writer invalidation; do not change Job UI/workflow/API.

Shared cache tracks actual hidden→visible return. Ordinary visible-window focus
and duplicate visible events must preserve unexpired snapshots; still synchronize
auth/context on events. Actual return invalidates settled entries once and keeps
pending reads. TTL, mutation, force refresh and session resets remain. First
load/page reload still requests HTTP because snapshots are memory-only. Update
existing focused spec expectations for visible focus versus hidden return, but
do not run tests/build/runtime under current boundaries. No blanket HTTP cache,
no persistent data or new auto-refresh/rebinding. Update guide/book/skill and
generated packets, then source-only reconcile this amendment.
