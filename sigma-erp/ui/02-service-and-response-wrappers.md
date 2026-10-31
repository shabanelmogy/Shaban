## 2. Service and response wrappers

> **Status: Canonical** — `Result`/`Results` typed (decision D5-4, 2026-10-01)

### Mandatory screen cache gate (clarification2026-10-25)

**Apply this block's cache adoption checklist to every new or reviewed screen.**
It is a discovery and handoff requirement, including editor lookups and
list/report filters; it is not an optional performance improvement deferred until
after screen delivery. This makes the existing requirements explicit without
adding eligible sources or changing their contracts. Use the source
classification table below before editing and reconcile it with actual source
at handoff under Master5. BaseService inheritance, shared symbol names, or a
statement that "lookups use the cache" cannot substitute for that evidence.

Keep read types distinct: approved reference choices use their existing shared
cache; the explicitly opted-in settings singleton retains its separate contract;
operational/capacity/rate/posting-account and financial-number-policy reads keep
their direct contracts, apart from the explicitly approved display-only Dashboard
snapshot exception below. Do not cache all GET requests or infer eligibility from
an endpoint's name.

Extend `BaseService` and pass the controller name once.

```ts
@Injectable({ providedIn: 'root' })
export class CompanyPartnerService extends BaseService {
  constructor() {
    super('Company', environment.baseUrl);
  }
}
```

Inherited helpers, so you do not rewrite them:

| Method | Calls |
|---|---|
| `get<T>(obj?)` | `GET {control}?Filters[key]=value&...` |
| `getById<T>(id, options?)` | `GET {control}/GetById/{id}` — optional `{ skipErrorInterceptor: true }` when the consumer owns inline detail feedback (block 22); omitted options preserve global feedback |
| `getByIdWithNavigation<T>(id)` | `GET {control}/GetByWithNavigationsId/{id}` |
| `getSelectList<T>(options?)` | `GET {control}/GetSelect` — dropdown options; pass `{ skipErrorInterceptor: true }` only when the feature owns an inline lookup error/retry state (block 22) |
| `getByType<T>(type)` | `GET {control}/GetByType/{type}` |
| `post<T>` / `put<T>` | `POST` / `PUT {control}` |
| `delete<T>(id)` | `DELETE {control}?id={id}` |
| `getMine<T>()` / `saveMine<T>(data)` | `GET` / `PUT {control}/Mine` — single-row settings (BE block 16): read the one row, save it (update or create). Never list rows and take the last one |

Shared list helpers (`shared/utils/list-query.ts`, 2026-10-01), for any service:

| Helper | Use |
|---|---|
| `ListQuery<TFilters>` | `{ pageNo, pageSize, filters, sortField?, sortOrder? }` — the typed list request |
| `toListParams(query)` | `HttpParams` with `Filters[key]` for non-empty values, `pageNo`, `pageSize`, `Filters[sortField]`, `Filters[sortOrder]` |
| `toFilterParams(filters)` | Unpaged read/report `HttpParams` with non-empty `Filters[key]` only; `toListParams` reuses this serializer before adding page/sort |
| `fetchAllPages(getPage, errorKey)` | every page for export or print; fails the whole result when one page fails (block 8) |

```ts
getList(query: ListQuery<JobFilters>): Observable<Results<JobListRow>> {
  return this.http.get<Results<JobListRow>>(`${this.baseUrl}Job/workshop-grid`, { params: toListParams(query) });
}

getAllList(query: ListQuery<JobFilters>): Observable<JobListRow[]> {
  return fetchAllPages((pageNo) => this.getList({ ...query, pageNo, pageSize: 100 }), 'job.errors.export');
}
```

Do not hand-build `HttpParams` or copy the all-pages loop into a feature service.

Every response is one of two wrappers. Always check `isSuccess` before reading
data.

**Typed since 2026-10-01 (D5-4).** `Result.id` is `number | string | null` (convert with
`Number(result.id)` where a number is needed), and `Results<T>` no longer carries an untyped
`entity`: a list has `entities`. `ActionList<Row>` is generic (block 7).

```ts
export interface Result<T> {
  entity: T | null;
  isSuccess: boolean;
  isInfo: boolean;
  message: string;
  id: number | string | null;
}

export interface Results<T> extends Omit<Result<never>, 'entity'> {
  entities: T[];
  pageNo: number;
  pageSize: number;
  totalPages: number | null;
  totalCount?: number | null;
}
```

Paged list with filters — note the `Filters[key]` convention:

```ts
getList(query: CompanyPartnerListQuery = {}): Observable<Results<CompanyPartnerDTO>> {
  let params = new HttpParams();
  Object.entries(query.filters ?? {}).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      params = params.set(`Filters[${key}]`, String(value));
    }
  });
  if (query.pageNo !== undefined) params = params.set('pageNo', String(query.pageNo));
  if (query.pageSize !== undefined) params = params.set('pageSize', String(query.pageSize));
  return this.http.get<Results<CompanyPartnerDTO>>(`${environment.baseUrl}Company`, { params });
}
```

### Write payloads carry client inputs only

> **Status: Canonical** (owner decision 2026-10-01)

An Add or Update payload contains only the fields the user edits plus `id` on Update. It never
contains:

- `subscriptionId`: the tenant comes from the token;
- the server-owned document `no`;
- audit values (`createdBy`, `createdAt`), `isDeleted`/`isActive` flags;
- approval or posting status;
- calculated totals.

The backend ignores all of them: `UpdateBaseVm` carries `Id` only and no write VM declares a
tenant (backend blocks 3 and 4, 2026-09-30). Sending them breaks nothing, but it keeps dead code
and implies the client owns them.

**Cleanup is part of every screen review, not a bulk change.** When a screen is reviewed,
remove from that screen, in the same change:

1. the `subscriptionId` form control and every `subscriptionId: …` in its payloads, child rows
   and dialogs, including `localStorage.getItem('subscriptionId')` and
   `BaseComponentService.subscriptionId` reads;
2. the server-owned `no` from Add/Update payloads. Keep `no` only where the user types a
   reference number that the backend declares explicitly on the Add and Update VMs (Cash
   Deposit, Card Transaction Bank Transfer and Purchase Return detail rows);
3. those members from the screen's **write** interfaces (Add/Update models). List and Detail
   models keep `subscriptionId`/`no` only when the screen displays them.

Then the owner compiles (`ng build`): the typed forms and write interfaces change together, and a
leftover reference shows up there. Do not bulk-edit other screens or strip the fields centrally
in an interceptor. Tracked as backlog 8 and 19.

**Check:** extends `BaseService` · empty filters dropped, not sent as `''` ·
`isSuccess` checked · payload types are real interfaces, never `unknown` · no `subscriptionId`,
server-owned `no`, audit, delete/active flag, status or calculated total in a write payload or
write interface of the reviewed screen.

---

### Common settings used by an inline lookup batch (2026-10-09)

`CommonSettingsService.getMySetting<T>(options?)` retains the current
`SettingsCommonModel/GetMySetting` endpoint and typed `Result<T>`. A consumer
that owns inline error/Retry feedback may pass `{ skipErrorInterceptor: true }`;
the service sends the existing `X-Skip-Error-Interceptor` header. Omitted options
retain global feedback. Rental Agreement Deposit reads `CommonDTO` alongside its
options and supplies the configured currency labels/decimals to shared
`amountInWords` (block 19), keeping entered amounts on failure. This option
changes feedback ownership only; it adds no settings API, currency default or
financial calculation. Source-only; owner compiler/failure/Retry acceptance pending.

**Explicit common-settings cache opt-in (owner2026-10-24).**
`CommonSettingsService.getMySetting<T>` now uses the existing scoped in-memory
ReferenceLookupCacheService for this exact endpoint, preserving Result<T>,
finite reads, feedback modes and optional forceRefresh. Only success with a
nonnull object entity is retained; missing settings, failure and malformed
responses remain retryable. This explicit singleton exception does not widen
list-envelope validation or enable other settings/operational endpoints.
Inherited successful common-settings mutations invalidate its exact read URL
before callbacks; failed writes retain valid data. Its settings-common tenant
topic reuses existing post-commit realtime publication/invalidation. No config
values are pushed or written to browser storage. Idle reads refresh on next
demand; no persistent settings watch rewrites an open settings form/document.
Direct adapters such as Job invoice-customer settings delegate to this source.
Derived tax reads must not put a permanent replay cache over this scoped cache:
reacquire on explicit load, retaining required-read failure and preview fallback
contracts. No financial-calculation rule or saved draft changes. UI22 owns silent
background refresh presentation. Evidence: COMMON_SETTINGS_CACHE_FEATURE_REVIEW.


### Required settings reads (2026-10-09)
A settings lookup that gates a dependent workflow may expose an opt-in strict read mode. Strict mode throws or returns the declared failure so the caller can block Save/Finish and offer Retry; the legacy optional fallback remains for non-gating previews. Cache successful strict reads separately and do not cache failures. Source-only evidence: Limousine quotation and TripBooking tax settings.

### Currency policy cache invalidation (2026-10-14)

Successful typed currency Create/Update/Delete operations invalidate the existing
`FinancialNumberPolicyService` cache through its `invalidate()` member. The next
`load()` obtains the authoritative backend policy; existing `load(force)` callers
retain their semantics. Keep invalidation in the owning typed currency service,
after `isSuccess`, rather than copying it into editors or a global interceptor.
Do not issue an extra policy request or change backend precision/rounding rules
as part of invalidation. Failed writes retain the cached policy and editor draft.

**Feedback ownership for explicit policy reads (2026-10-25).**
`FinancialNumberPolicyService.load(force = false, options?: { skipErrorInterceptor?: boolean })`
keeps the same `Currency/GetFinancialNumberPolicy` endpoint and typed Result.
Omitting options retains the existing global error owner; a caller with inline
failure/Retry passes `{ skipErrorInterceptor: true }`. Changing that feedback
mode reacquires the request so an inline consumer does not inherit a global
error request, or conversely. A workflow that explicitly needs a new authoritative
read on load/Retry uses `load(true, { skipErrorInterceptor: true })`, checks both
failure channels, and fences stale responses through its own read lifetime
(UI28). JVs is that consumer; this is not a requirement to force every existing
policy caller or a background watch that changes an open document's precision.
The policy retains its own direct service/cache contract, `invalidate()` and
server-owned precision/rounding; it is not opted into ReferenceLookupCacheService.
Failed reads preserve draft values and remain actionable through Retry.

Source evidence: `Administration/Currency/services/currency.service.ts` and
`shared/service/financial-number-policy.service.ts`; owner compilation and
before/after policy-read acceptance remain pending.

### Selective reference lookup cache (owner2026-10-23)

**Explicit customer-currency display opt-in (owner2026-10-28).** Reuse
`ReferenceLookupCacheService` for the exact positive-ID URL family
`Partner/GetCurrency/{id}` through `PartnerCurrencyLookupService`. This narrow
tenant/live DTO contains only `currencyCode: string|null` from the partner's
current billing currency. Cache only a successful nonnull entity with that
explicit string/null member; null is a known absence and preserves the base
fallback. Missing/deleted partners and malformed/failing responses are retryable,
never cached. Full Partner details, financial values, rates/availability and
write validation remain on their direct contracts. This source-level opt-in is
inherited by every shared DocumentCurrency customer consumer, not a per-screen
cache or a browser-storage copy.

Keep the existing scoped five-minute TTL/64-entry owner, finite read before
separate watch, ID/version cancellation, successful-value preservation and silent
retained refresh with errors/Retry. Context resets cancel the old customer read
and watch and clear displayed codes without automatically reacquiring an old ID
in a new tenant/session; ask through shared field feedback to reselect/reopen.
No form amount or saved supplied currency is rewritten by refresh. Supplier
details retain their existing direct source. Cache hits need no HTTP or visible
loading; an actual first/expired/invalidated read may need progress.

The source's `lookup-partner-currencies` tenant topic covers Partner and derived
Company/Individual entities, PartnerBillingInfo and Currency through the existing
postcommit owner. Successful Company/Individual writes already invalidate the
Customer source dependency; that explicit dependency and Currency source
invalidation now also evict only this customer-currency URL family. Successful
customer imports use CustomerService.refreshSelectList, which invalidates the
same family. Failed writes retain valid snapshots. This is a declared source
dependency, not arbitrary prefix matching or a global GET cache. Preserve
existing tenant/auth/branch/language scope resets and independent writers.

`FinancialNumberPolicyService` retains its own coalesced policy read, not this
reference cache. Shared context changes invalidate that memo and cancel its old
scope request; an interrupted finite read returns a failure envelope rather than
completing empty. Existing currency-write invalidation, precision ownership and
feedback modes stay. Source-only evidence: shared-customer-currency cache review;
owner network/SQL/realtime/runtime verification remains separate.

Ordinary dropdown reads remain fresh unless their data service explicitly opts
in through `BaseService.cacheSelect`. Country and UnitsOfMeasures are the first
reviewed sources. `ReferenceLookupCacheService` is the single in-memory owner;
CompanyDriver delegates country choices to CountryService. Never enable a
blanket GET/GetSelect interceptor or reuse the legacy browser-storage CacheService.
Eligibility belongs to the data source, not a visual Select/CVA or an individual
screen. Preserve endpoint, typed envelope, ids, ordering, labels, empty-success,
server validation and each consumer's failure/loading owner.

Cache acquisition is deferred until subscription. Bound retained successful
`entities` snapshots by absolute expiry and entry count (initial pilot5minutes,
64 LRU entries); deep-copy responses per consumer before saved-option merges or
translation. Failure envelopes, HTTP errors, malformed/empty-completion and
cancelled reads are not retained. Coalesce identical pending reads, separating
default and inline-error feedback modes; partial consumer teardown must not abort
another subscriber, while final teardown and existing UI28 navigation cancellation
release unfinished entries. Force-refresh is an optional getSelectList flag.

Scope to API URL, subscription/user, session generation, language and conservative
branch context. Compare credentials only in memory through existing auth-token
observation; never put them in keys/logs/storage. Reset/cancel on context changes,
and guard old responses/old observable references against repopulation. A successful
source mutation invalidates before downstream callbacks; failed writes retain
valid snapshots. Include typed and inherited writers and indirect transports.
An observed hidden→visible tab return drops settled snapshots once for the next
lookup while keeping pending page bootstrap alive. Plain window focus while the
document stays visible (including DevTools focus changes), duplicate visible
events and route changes alone do not evict unexpired snapshots. Synchronize
session context on these events regardless. Do not rewrite open form values or add hidden branch
filters. Remote edits are not immediately broadcast: TTL/next load/reload determine
visibility unless a separate source-owned notification contract exists. Broader
sources, settings and availability-sensitive document choices need their own review.

Evidence: `reviews/LOOKUP_CACHING_REFERENCE_DATA_CONTRACT_FREEZE.md`; implementation
and automated/runtime verification are reconciled in the owning feature review.

**Purchasing reference expansion (owner2026-10-24).** Supplier (including the
existing SupplierShared adapter), Branch, Item, AssetType, Currency and
ContactGroup now opt in through their source services. Country/UOM retain the
same policy. Eligibility applies to every consumer of the reviewed source URL,
not just the motivating purchasing screen. Account operational
selectors, document candidates and remaining/returnable quantities, financial
rates/details/settings stay fresh; caching a reference label never proves
availability, approval, stock or posting eligibility.

The owner's repeated-GetSelect correction includes ordinary Job and Vehicle
GetSelect too: source tracing confirms neither overrides base SelectAsync, whose
GetDropdownAsync returns tenant-owned nondeleted identities/labels/No only
(Vehicle uses PlateNo). Do not equate this ordinary label source with a vehicle
availability/status search or Job options/closing/details, which remain fresh.
Typed Job Add/Update/Close/Cancel and Vehicle Create/Update/Delete invalidate;
Vehicle import invalidates on positive savedRows. This supersedes their earlier
blanket exclusion in the initial purchasing slice without caching live operations.

`BaseService.readReferenceSelect<T>(url, load, options)` is the protected shared
seam for custom eligible selectors. It uses the existing cache only when the
source opts in; preserve the original loader and feedback headers. ContactGroup
uses its exact encoded `/GetSelectByType/{type}` path, so types never share
snapshots. `invalidateSelectSource(sourceUrl)` removes that source's exact
`/GetSelect` and `/GetSelectByType/` family in every feedback mode, including
unfinished reads; exact `invalidate(url)` retains force-refresh semantics.
Do not evict other controller families by prefix coincidence. Source success
invalidates before caller callbacks, through the same typed/inherited operator.
Explicit `selectCacheDependencies` controller names default empty and cover
verified indirect producers only: Supplier may provision its default ContactGroup,
so both Supplier adapters invalidate ContactGroup too. No global mutation watcher.

**Dependent sources are independent of the writer's own opt-in (2026-10-25).**
`invalidateSelectOnSuccess` invalidates explicitly declared dependencies even
when the writer's `cacheSelect` is false; its own GetSelect is invalidated only
when it opts in. This does not enable the writer's cache. Keep dependency names
empty unless the actual producer proves that its writes affect that source.
For the existing aggregate `Customer/GetSelect`, CustomerService.SelectAsync
projects tenant-owned nondeleted Company/IndividualPartner identities and labels.
CompanyPartnerService and IndividualPartnerService declare `Customer` and pipe
their typed writers through the shared operator; inherited writes use it too.
Their supported Companies/IndividualPartner imports refresh Customer through
the source service when `savedRows > 0`, including partial failure. Zero saved
rows, failed writes and HTTP errors do not invalidate. The existing
`lookup-customers` tenant topic tracks those two entity families; no new socket
or source opt-in is introduced. Evidence: JVS_DOMAIN_API_CONTRACT_FREEZE cache
amendment and JVS_IMPLEMENTATION_FINAL_RECONCILIATION source matrix.

**Customer default-group dependency (2026-10-26).** Company/IndividualPartner
Add/Update/contact-group writes call `CustomerGroupIdAsync`, which can provision
the Customer default ContactGroup. Their declared dependencies therefore include
both `Customer` and `ContactGroup`. Companies/IndividualPartner import producers
also call that default-group owner: positive persisted `savedRows` refresh Customer
and invalidate the entire ContactGroup select family, including typed Customer
selectors, even after partial batch failure. Zero-row/HTTP-failed imports keep
the existing sources. This is an evidenced dependency under the same success hook,
not cache opt-in for the writer or a new invalidation framework. Evidence:
`ContactGroupAccountService` and `ImportDataService` customer import branches;
`CUSTOMERS_MODULE_DOMAIN_API_CONTRACT_FREEZE` and its source reconciliation.

Typed imports must invalidate when their committed-row count is positive, even
if the batch-level success flag is false after partial persistence. Supplier
import invalidates Supplier plus its default ContactGroup dependency; Item
import invalidates Item. Preserve transport and persistent partial/error result
ownership; HTTP errors or zero saved rows do not invalidate. This is source-owned
coherence, not another import/cache wrapper. Remote edits retain the existing
expiry/focus/next-read limitation, and open form values/options are not silently
rebound. No real-time adoption implied by this expansion.
Evidence: `reviews/PURCHASING_LOOKUP_CACHE_UI_CONTRACT_FREEZE.md` and its owning
review; source-only checks, compiler/network/concurrency acceptance pending.

### Active reference revalidation (owner2026-10-24)

This approved extension supersedes the preceding next-read-only limitation for
the reviewed reference sources. Keep `getSelectList`/`read` finite for initial
HTTP/forkJoin bootstraps. Mount a separate `watchSelectList`/`watch` stream only
for consumers that need live options. Custom eligible selectors use
`watchReferenceSelect` with the identical full URL/feedback identity; typed
ContactGroup watches preserve their type path. Excluded operational sources
return an inert watch and keep their normal direct reads.

The shared cache owns `ReferenceLookupState<T>`: retained value, loading, stale,
error key, updatedAt and expiresAt. Coalesce source invalidations for150ms,
cancel/fence obsolete responses and transparently restart pending finite readers;
never complete a waiting bootstrap empty on ordinary invalidation. Absolute
five-minute expiry refreshes active visible watches. Idle or hidden entries send
no automatic HTTP; explicit finite demand still loads. Keep at most64 idle/LRU
entries, pinning mounted consumers instead of breaking their streams. Release
timers/unfinished reads when the final consumer leaves. Reset old-context arrays
and topic memberships on session/context changes; safely reacquire persistent
watches without publishing old data.

Reuse the root `RealtimeService` connection. Known source URLs map to registered
tenant-scoped topics; notifications invalidate and reload through authoritative
HTTP rather than pushing option arrays. Rejoin revalidates to cover missed
changes. Subscribe once per cached topic, releasing on eviction/reset. Existing
server commit tracking publishes only after successful save/explicit commit;
rollback/failure cannot invalidate other clients. Delivery is bounded and
nondurable; raw SQL/ambient-transaction bypass and missing multi-node backplane
require TTL fallback. No extra socket, global GET interceptor, state library or
custom developer inspector is needed for this behavior.

`ReferenceLookupBindings` binds each source key once per DestroyRef and aggregates
initial loading/error/Retry. Under UI22's latest owner rule, required routed bootstrap presents through the
page host via ReferenceLookupStatus, not inside filter controls; dialog bootstrap
uses inherited dialog scope. This changes no cache source eligibility or watch.
Revalidation with a retained snapshot remains silent
under UI22; the underlying state still reports actual HTTP loading. Apply only fresh successful snapshots, preserving
selected IDs, draft/dirty state and saved labels absent from current choices.
Optional selected-ID/current-option getters let the shared binding retain only
the selected labels, even on an empty success. Distinguish that from an explicit
null context reset: clear old rows and never remerge prior-context detail labels
from a watch callback. Initial detail/bootstrap merges keep their existing role.
Do not set defaults, emit control changes, cascade supplier changes or recalculate
source quantities/tax/finance from a cache emission. Retain options after refresh
failure and offer per-failed-source retry without an automatic retry loop.

**Retained editor choices (source correction2026-10-26).** The final optional
`ReferenceLookupBindings.bind` argument `disableRetainedOptions` defaults false,
preserving existing historical list-filter behavior. An editor whose source
choices exclude unavailable identities passes true and binds its existing Select
`optionDisabled="disabled"`. On each fresh successful response, only selected
rows absent from the incoming source acquire `DropDownSelect.disabled=true`;
fresh source rows win unchanged. This preserves the saved label and selected
value without offering a removed choice for a new selection. Returning source
rows regain their source eligibility. Failed refreshes retain the previous
snapshot, and explicit null-context reset still clears every row without
remerging historical detail labels. Do not disable retained filter choices by
default or infer availability from a label; write-time validation remains with
the server. Reuse this existing binding metadata seam instead of duplicating
source-membership tracking per editor. Evidence: Rentals R06/R09 corrective
reconciliation, Agreement/Quotation editors, Agreement Deposit and shared branch
settings. Source-only; owner selection/refresh/context acceptance pending.
`ReferenceLookupStatusComponent` reuses StateMessage and the shared secondary
button for translated loading/error/retry, inherits theme/RTL, and owns no
business calculation or form value. Initial bootstrap keeps its existing error
owner; watch requests use inline feedback mode where the component owns it.
Source-only evidence: `reviews/PURCHASING_REACTIVE_LOOKUP_CACHE_DOMAIN_API_CONTRACT_FREEZE.md`;
compiler/network/tenant/reconnect acceptance remains pending.

### Cache adoption checklist for every reviewed or new screen (owner2026-10-24)

Apply this checklist during discovery and implementation, including lists,
editors, settings and report filters. Existing consumers inherit source caching;
an open screen needs the separate watch binding below for live option updates.
Do not create another cache, storage layer, socket, inspector or visual wrapper.

**Required source classification evidence (clarification2026-10-25).** In the
existing review/contract, add one row for each actual consumed URL, including
custom encoded paths/query parameters. Use these columns; write actual symbols
and values rather than copying the placeholder row:

| Exact URL and typed envelope | Classification and evidence | Source service, writers/dependencies and topic | Finite read, watch and teardown | Failure/Retry, scope, selected-label and draft evidence | Final source status and pending verification |
|---|---|---|---|---|---|
| Actual encoded API URL; Result/Results shape | Approved reference / explicit singleton / direct operational or policy / unresolved; source-supported exception reason | Real service/shared seam, typed/inherited successful writers and positive persisted import outcomes, indirect producer proof, exact registered topic or evidenced none | Actual consumer symbols for bootstrap, response check, options assignment, separate once-bound watch and cleanup; justified no-watch source contract | Both failure channels, initial/refresh Retry, context clear, selected-ID/current-option getters and unchanged form values/dirty state | Matched / finding / unresolved with source evidence; runtime/network acceptance stays separate |

The table is an inventory, not an instruction to cache every row. Select from
the already-approved sources below. A reference source without source opt-in
keeps its existing direct read: record that evidence and no-watch reason rather
than treating uncached as an unresolved requirement to add caching. For example,
an ordinary Job label selector
and live Job/capacity search are different sources; operational posting-account
choices and FinancialNumberPolicyService do not become ReferenceLookupCacheService
sources because they appear beside a cached Branch selector. Constants/enums
can be recorded as local, with no HTTP/cache/writer/watch requirement. An
unresolved source remains explicit; neither this table nor a shared import
grants new cache eligibility. Update final rows with actual source-conformance
evidence and pending runtime verification; do not mark an uninspected path matched.

1. **Inventory and classify sources.** Record exact URLs, envelope shape,
   writers, indirect producers and screen consumers. Approved reference sources
   are Country, UOM, Supplier (including its shared adapter), Branch, Item,
   AssetType, Currency, ContactGroup (including typed selectors), ordinary Job
   and Vehicle labels. The existing aggregate Customer labels retain the
   source/producer evidence and dependent-writer contract above. Common
   GetMySetting and the owner-approved display-only Dashboard/Snapshot below are
   explicit singleton exceptions, with their own expiry/read contracts.
   Keep remaining quantities, candidates, stock/availability searches, exchange
   rates, posting-account operational choices and financial-number-policy reads
   on their owning direct contracts. Another source requires evidence/approval
   in its feature contract; endpoint naming alone does not establish eligibility.
2. **Reuse the source service.** For an approved ordinary GetSelect source,
   opt in through `protected override readonly cacheSelect = true`. All readers
   call that service; remove direct-HTTP adapters for the same approved source.
   Custom selectors use `readReferenceSelect` and `watchReferenceSelect` with
   the exact full encoded URL and unchanged loader. Keep typed Result/Results;
   do not wrap a singleton in a fake list or relax other response validation.
3. **Retain cache ownership.** The shared cache owns subscription-time acquisition,
   scope/session/branch/language isolation, five-minute expiry, pending-request
   sharing, clones per consumer, cancellation/revision fences and idle LRU.
   Keep credentials/data out of storage/logging/keys. No feature shareReplay
   may permanently replay a response above this cache and bypass reacquisition.
4. **Wire every successful writer.** Inherited Base post/put/delete and collection
   writers use `invalidateSelectOnSuccess`; custom typed writers pipe that same
   operator. Failed writes do not invalidate. Imports invalidate on positive
   committed savedRows even after a partial batch failure. Declare indirect
   `selectCacheDependencies` only with producer evidence. Singleton sources
   invalidate their exact read URL through their owning source success hook.
5. **Wire source notifications.** Map only the exact eligible URL to an existing
   registered tenant topic and register its real entity/dependencies in
   AddSigmaRealtime. Reuse RealtimeService/commit tracking; never publish before
   successful save/commit or broadcast row/config data. Join/rejoin invalidates
   for missed changes. Retain TTL fallback for disconnected/bypass/multi-node
   limitations; do not duplicate the socket in a screen.
6. **Keep initial reads finite.** Preserve getSelectList/getMySetting and forkJoin
   bootstraps. Use the same skipErrorInterceptor mode for the initial read and
   matching watch when the screen owns inline error/Retry; changing feedback
   mode intentionally creates a separate cache key. Handle both unsuccessful
   envelopes and transport errors. Bind only after the source bootstrap succeeds.
   An explicit context reset can complete a pending finite read without a value.
   A required forkJoin member must normalize that empty completion into its
   existing failed-bootstrap path (for example RxJS defaultIfEmpty(null)), or
   use its established cancellable context reacquisition owner. Otherwise the
   join skips next and finalize can incorrectly enable an uninitialized form.
   Keep required readiness false, show Retry, and bind only after a later
   successful finite result; never interpret empty completion as empty success.
   Source evidence: TransportationAgreements list/editor context-reset audit,
   2026-10-27; runtime scope-switch acceptance remains pending.
7. **Bind open choices once.** Construct ReferenceLookupBindings with the screen's
   DestroyRef; bind each key once to watchSelectList or typed ContactGroup watch.
   Update only option arrays. Supply current selected IDs and current options
   so even a fresh empty list retains selected labels. Keep initial detail-label
   merges in initial bootstrap/detail flows; never restore old-context details
   from a later watch callback. Context reset applies an empty array without
   changing the form's selected IDs/dirty state.
8. **Keep draft and financial ownership.** Cache emissions never set defaults,
   patch form values, emit supplier-change cascades or recalculate quantities,
   tax, amounts or posting eligibility. The server still validates selectable
   IDs and financial/business rules; a retained historical label proves none.
9. **Reuse refresh presentation.** Render ReferenceLookupStatusComponent for
   initial loading/error/Retry. A retained-data refresh is silent in the screen;
   the shell badge automatically observes cache.backgroundRefreshing (UI22).
   No per-screen badge, global loader, busy gate, timer or spinner is added.
   refreshSelectList/refreshSelectByType invalidates active options; explicit
   getSelectList/getMySetting forceRefresh is finite demand. Idle/hidden sources
   make no automatic HTTP; visible mounted watches revalidate with coalescing.
10. **Reconcile and document.** Review exact URL/feedback identity, all writers,
    concurrency/cancellation, old-context fencing, empty/false/error responses,
    selected-label retention, teardown, TTL/hidden return/rejoin and Retry. Update
    the owning bilingual guide. Record source evidence separately from owner
    compilation/network/visual acceptance; follow current execution boundaries.

**Completion evidence is behavioral.** Trace the final consumer's actual finite
read and successful response check, option assignment, watch binding and its
selected-ID/current-option getters to the owning service. Show that bootstrap
failure leaves Retry available and does not bind a failed source; after Retry
succeeds, bind that key once. Where a finite batch is atomic, retain its existing
all-success bootstrap contract. Show that a retained-data refresh failure leaves
usable prior options and the draft untouched, while an explicit context reset
clears old options and never reintroduces prior-context detail labels. Verify
both unsuccessful envelopes and HTTP errors, cleanup, and writer/topic coverage
from source. Correct confirmed omissions within authorized scope before declaring
the screen implemented (Master5); merely mentioning shared owners or updating
documentation cannot establish conformance. Under source-only execution, leave
network coalescing, expiry, tab return/rejoin, session isolation and visible
Retry/refresh behavior pending for the owner. This gate authorizes no runtime
commands by itself.

Typical already-approved reference binding (feature supplies its own typed form
and arrays; preserve the existing finite initial bootstrap):

```ts
readonly referenceLookups = new ReferenceLookupBindings(this.destroyRef);

// Run once after the matching finite source read succeeds.
this.referenceLookups.bind(
  'suppliers',
  this.supplierService.watchSelectList<Results<DropDownSelect>>({ skipErrorInterceptor: true }),
  rows => this.suppliers.set(rows),
  () => this.supplierService.refreshSelectList(),
  () => [this.form.controls.supplierId.value],
  () => this.suppliers(),
);
```

```html
<app-reference-lookup-status
  [loading]="referenceLookups.loading()" [error]="referenceLookups.error()"
  (retry)="referenceLookups.retry()" />
```

Use current BaseService, CommonSettingsService, ReferenceLookupCacheService,
ReferenceLookupBindings/Status and RealtimeService public contracts as the shared
implementation references. Screen-specific data eligibility remains in its own
contract; this checklist does not authorize bulk edits or cache every request.

### Dashboard display snapshot cache (owner2026-10-26)

The owner explicitly opts `Dashboard/Snapshot` into the existing
ReferenceLookupCacheService as a display-only singleton. DashboardSnapshotService
uses the full encoded ownership/fleetType query URL for both finite `read` and
separate `watch`, with identical inline-error feedback mode. Only a successful
non-null object `Result.entity` is cached; other sources retain their existing
envelope checks. This exception never supplies write-time capacity, availability,
approval eligibility, financial policy or accounting decisions.

Reuse shared scope/session/branch/language reset, clones, pending-read sharing,
revision/cancellation fencing, idle/LRU limits and the header refresh activity.
Dashboard entries have an absolute 60-second TTL matching their pre-existing
reconciliation cadence; reference/settings entries retain five minutes. The
existing tenant `dashboard` topic invalidates every filter variant on commit
notifications/rejoin; only mounted visible watches auto-refresh. Idle/hidden
snapshots remain stale until explicit demand or visible return. Keep existing
best-effort topic/TTL delivery limits; no new socket or mutation interceptor.

The component applies a successful finite bootstrap before mounting its watch,
releases the old watch on filter replacement/destroy and clears displayed values
on a null context reset. The shared cache exposes a data-free `contextChanges`
observable from its existing scope-reset owner. Dashboard cancels and clears the
display immediately, then reacquires on a cancellable deferred RxJS turn, even
when a finite bootstrap/forced read completed empty before its watch mounted.
This prevents same-token branch/language changes from retaining old-context
figures or stranding bootstrap; do not log/publish identity or credentials.
Retain same-filter data after revalidation failure and
offer the existing inline Retry. Manual Refresh/Retry forces authoritative HTTP.
Shared watch expiry owns successful periodic reconciliation, avoiding a second
feature refresh loop; a bounded visible failure retry retains recovery when the
bootstrap failed and no watch exists. Preserve local busy/aria-busy, silent page
loading and filter controls; snapshot emissions never patch the filter form.
Evidence: `reviews/DASHBOARD_CACHE_MAINTENANCE_EVOLUTION_PLAN.md` and
`reviews/DASHBOARD_CACHE_FEATURE_REVIEW.md`. Source-only; owner network, compiler,
scope, reconnect and timing acceptance remain pending.

### Shared batch-import transport (2026-10-14)

The root `CsvImportService.post<T>(route, request)` owns repeated CSV batch POST transport: `environment.baseUrl`, the root interceptor-enabled `HttpClient`, typed `CsvImportResult<T>` and `X-Skip-Error-Interceptor` / `X-Skip-Success-Toast`. Use this owner only for a confirmed batch contract whose shared import workspace owns persistent error/partial/success feedback. Screen services remain typed and supply the existing exact route and body key; they do not invent endpoints or alter the import envelope. Ordinary mutation and unrelated CSV consumers retain their existing feedback owner. Evidence: the eleven supported Administration/DataImport services. Source-only; owner compile/authentication/API acceptance pending.

### Shared real-time read invalidation (2026-10-19)

Use root `RealtimeService.watch(topic)` for a confirmed server read-model topic.
One ref-counted SignalR connection owns token/session changes, topic membership,
initial-start retry, automatic reconnect, rejoining and final-consumer teardown.
The shared `readAuthToken` owner supplies the same stored credential used by
the HTTP token interceptor; socket authentication uses `accessTokenFactory`.
Shared `observeAuthToken` owns distinct current/auth/storage observation,
including a guarded microtask after login's user-before-token-storage emission.
Use it for the socket and session-bound HTTP consumers; teardown removes the
storage listener and ignores deferred emissions after unsubscription.
Never put a tenant or bearer token in a feature payload or log. The service emits
`connected` after joining/rejoining and `changed` for invalidation messages.

The feature keeps a typed HTTP snapshot service on the single root HttpClient.
Coalesce notification bursts, cancel stale/filter/session reads through UI28,
and refresh after rejoin to recover missed events. Show connection state and
retained-data failure clearly; offer manual Retry and a bounded periodic
reconciliation for missed events and date-based values. A socket notification
does not contain authoritative counts, replace the response wrapper, establish
permissions or certify delivery. Missing derived values stay unavailable rather
than becoming zero. Dashboard is the first consumer; source-only evidence,
owner compilation, reconnect, isolation and runtime acceptance remain pending.
