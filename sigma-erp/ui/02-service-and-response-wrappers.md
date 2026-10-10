## 2. Service and response wrappers

> **Status: Canonical** — `Result`/`Results` typed (decision D5-4, 2026-10-01)

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


### Required settings reads (2026-10-09)
A settings lookup that gates a dependent workflow may expose an opt-in strict read mode. Strict mode throws or returns the declared failure so the caller can block Save/Finish and offer Retry; the legacy optional fallback remains for non-gating previews. Cache successful strict reads separately and do not cache failures. Source-only evidence: Limousine quotation and TripBooking tax settings.
