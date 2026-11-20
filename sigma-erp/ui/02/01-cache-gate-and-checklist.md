<!-- Part of UI block 2: see ../02-service-and-response-wrappers.md. Same status and authority as the block. -->

### Mandatory screen cache gate
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

**Authorization revision and opted-in lookup freshness (verified2026-11-06).**
An actor's permission/branch revision can change while identity, tenant and
working branch stay the same. `ReferenceLookupCacheService` observes the shared
`AccessViewPolicyService.revision`, and checks it synchronously before a cached
read. A changed revision marks existing opted-in entries stale, cancels their
older read generation and uses the same retained-data refresh/watch owner. It
does not reset editor drafts, cancel sent writes, or opt additional financial or
operational reads into caching. Cache values are display data, never proof of a
branch grant. The branch selector still uses its operational current-branch
owner, and the server evaluates the current scope on each request. Evidence:
reference-lookup-cache.service.spec.ts regression fails on an unchanged cached
result before the change, then the focused suite passes after revalidation.

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


### Cache adoption checklist for every reviewed or new screen
Apply this checklist during discovery and implementation, including lists,
editors, settings and report filters. Existing consumers inherit source caching;
an open screen needs the separate watch binding below for live option updates.
Do not create another cache, storage layer, socket, inspector or visual wrapper.

**Required source classification evidence.** In the
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
