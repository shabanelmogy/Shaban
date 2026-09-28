## 2. Service and response wrappers

> **Status: Transitional** — `Result.id` and `Results<T> extends Result<any>` are untyped, backlog 22

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
| `getById<T>(id)` | `GET {control}/GetById/{id}` |
| `getByIdWithNavigation<T>(id)` | `GET {control}/GetByWithNavigationsId/{id}` |
| `getSelectList<T>()` | `GET {control}/GetSelect` — dropdown options |
| `getByType<T>(type)` | `GET {control}/GetByType/{type}` |
| `post<T>` / `put<T>` | `POST` / `PUT {control}` |
| `delete<T>(id)` | `DELETE {control}?id={id}` |

Every response is one of two wrappers. Always check `isSuccess` before reading
data.

**These two contracts are Transitional.** `Result.id` is `any`, and
`Results<T> extends Result<any>` so `entity` is untyped on a list response.
`ActionList.action`, `.visible` and `.disabled` also take `any` (block 7). Use
them as they are — they are shared contracts and changing them is a coordinated
edit — but do not treat `any` here as licence for `any` in your own feature
models. Typed replacements are backlog item 22.

```ts
export interface Result<T> {
  entity: T | null;
  isSuccess: boolean;
  isInfo: boolean;
  message: string;
  id: any | null;
}

export interface Results<T> extends Result<any> {
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

**Check:** extends `BaseService` · empty filters dropped, not sent as `''` ·
`isSuccess` checked · payload types are real interfaces, never `unknown`.

---

