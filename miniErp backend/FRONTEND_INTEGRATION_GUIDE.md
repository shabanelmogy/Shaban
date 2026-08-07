# MiniErp Frontend Integration Guide

This is the living handoff document between the MiniErp backend and frontend.
Update it after every backend implementation step that changes a route, request,
response, validation rule, authorization rule, enum, error, or user workflow.

Swagger remains the machine-readable API contract. This document explains how
the frontend should use that contract and records behavior that a schema alone
cannot describe.

**Last updated:** 2026-07-25

**API version:** v1

**Canonical file:** `miniErp backend/FRONTEND_INTEGRATION_GUIDE.md`

**Current delivery scope:** Reference/container data and Stock Opening
Balances are implemented. Later document tasks follow
`INVOICE_SIDEBAR_TASKS.md` sequentially.

## 1. How to use this document

Status meanings:

- **Ready:** implemented, built, and checked against generated Swagger.
- **Backend ready / frontend pending:** the API is usable, but client work is
  still required.
- **Migration pending:** backend source is ready, but its database migration was
  not applied by this task.
- **Deployed:** the code and required migration are available in the named
  environment.
- **Planned:** design direction only. Do not build against guessed routes or
  payloads.
- **Deferred:** intentionally outside the current simple application scope.

Frontend engineers should integrate only entries marked **Ready** or
**Backend ready / frontend pending**. If this document and generated Swagger
disagree, stop integration and report the mismatch instead of guessing.

## 2. Phase tracker

| Phase | Backend | Database | Swagger | Frontend | Environment/contract summary |
|---|---|---|---|---|---|
| 0 - Reference/container data | Ready | Migrations present | Verified locally | Implemented/verify environment | Countries, Containers, atomic StoreContainer upsert, and partner/container workspace |
| 1 - Stock Opening Balances | Ready | Migrations present | Verified locally | Contract delivered | Editable aggregate CRUD; no movements |
| 2 - Partner Opening Balances | Waiting | N/A | N/A | Not started | Wait for explicit Step 1 completion confirmation |
| 3 - Invoices | Backend ready | Migration pending | Added/reviewed locally | Integrated/verify environment | Editable aggregate CRUD with PaymentTerm and no posting side effects |
| 4 - Stock Adjustments and Inventory Count | Ready | Applied in configured development DB | Verified locally | Integrated/build passed | Movement-backed adjustment CRUD plus stale-safe physical count reconciliation |
| 5 - Receipt/payment vouchers | Waiting | N/A | N/A | Not started | Editable aggregate CRUD after Step 4 |
| 6 - Balance Reports | Deferred | N/A | N/A | Not started | Requires approved source of truth |
| 7 - Driver Trips | Deferred | N/A | N/A | Not started | Requires separate approval |

Do not infer endpoint names, enum numeric values, or JSON fields for planned
phases. They become usable only after their exact generated Swagger contract is
recorded in this file.

## 3. API-wide frontend conventions

### Base URL and Swagger

- API prefix: `/api/v1`
- Local default used by the React client: `https://localhost:7067/api/v1`
- Local HTTP launch URL: `http://localhost:5236/api/v1`
- Swagger UI: `/swagger`
- OpenAPI JSON: `/swagger/v1/swagger.json`
- JSON property names use camel case.

The frontend base URL must remain configurable through `VITE_API_BASE_URL`.

### Authentication flow

Use these public endpoints:

| Operation | Route | Success response |
|---|---|---|
| Login | `POST /api/v1/Auth/login` | `LoginResponse` |
| Select company | `POST /api/v1/Auth/select-company` | `TokenResponse` |
| Refresh tokens | `POST /api/v1/Auth/refresh` | `TokenResponse` |
| Logout | `POST /api/v1/Auth/logout` | `204 No Content` |

Login request:

```json
{
  "userName": "<user-name>",
  "password": "<password>"
}
```

If the user can access multiple companies, login returns
`requiresCompanySelection: true`, a `selectionToken`, user display information,
roles, and the available companies. Send that selection token only to
`Auth/select-company`:

```json
{
  "selectionToken": "selection-token-from-login",
  "companyId": 2
}
```

The selection token is not an API access token. Never send it in the
`Authorization` header.

If login returns `requiresCompanySelection: false`, use the `accessToken` and
`refreshToken` in that same `LoginResponse` immediately. If it returns `true`,
those two fields are null until company selection succeeds.

The final token response is:

```json
{
  "accessToken": "company-scoped-jwt",
  "refreshToken": "rotating-refresh-token"
}
```

For normal frontend requests, send:

```http
Authorization: Bearer company-scoped-jwt
```

In Swagger's **Authorize** dialog, paste only the access-token value because
Swagger adds `Bearer` automatically. In frontend HTTP code, the application
must add the `Bearer ` prefix itself.

Important response rule:

- `fullName`, `email`, `roles`, and `companies` are returned by login.
- Company selection and refresh return only `accessToken` and `refreshToken`.
- Preserve the login profile in frontend session state; do not expect refresh
  to return it again.

Refresh request:

```json
{
  "refreshToken": "current-refresh-token"
}
```

Every successful refresh rotates the refresh token. Replace both stored tokens
together, retry the failed API request at most once, and clear the session if
refresh returns `401`. Coordinate simultaneous `401` responses through one
shared refresh operation so the frontend does not submit the same rotating
refresh token more than once. Avoid an infinite refresh loop.

Token responses do not contain expiry fields. Decode the JWT `exp` claim or
react to `401`; do not hardcode a token lifetime. Logout revokes the refresh
token, but an already-issued access token remains valid until its JWT expiry.
Send the refresh token in the logout JSON body and clear frontend session state
immediately. Logout is idempotent and returns `204` even when that refresh token
was already revoked or unknown. There is currently no `/me` endpoint.

### Authorization and company isolation

- Reads are authenticated by default.
- Master-data create, update, and delete operations require the `Admin` role.
- Company and User endpoints are Admin-only. Store, BusinessPartner, Driver,
  Item, and ItemUnit reads are available to any authenticated role.
- Current role strings are `Admin` and `User`. Use an exact role check such as
  `roles.includes("Admin")` for write-action visibility, while treating the
  server's `403` response as authoritative.
- A missing or invalid token returns `401`.
- A valid token without the required role returns `403`.
- API-generated `401` and `403` responses use the unified JSON error contract
  documented below. A reverse proxy or failed network request can still
  produce no application JSON, so retain a transport-level fallback.
- Each access token selects exactly one company through its `company_id` claim.
- Never send `companyId` in a tenant-owned create or update request.
- When the user changes company, obtain a new company-scoped access token and
  reload all tenant-owned lists and selectors.
- Treat another company's ID like a missing record; the API normally returns
  `404` without revealing cross-company data.

### Enum serialization

API enums are serialized as JSON strings, and integer enum values are rejected.
Use only the exact string names published by generated Swagger. Do not guess
values for planned features.

### Pagination

Growing list endpoints accept:

```http
?pageNumber=1&pageSize=20
```

- `pageNumber` defaults to `1` and must be greater than zero.
- `pageSize` defaults to `20` and must be from `1` through `100`.
- An out-of-range page returns a successful response with an empty `items`
  array.

Response shape:

```json
{
  "items": [],
  "pageNumber": 1,
  "pageSize": 20,
  "totalCount": 0,
  "totalPages": 0
}
```

The frontend should use server pagination metadata rather than calculating the
total number of pages locally.

### Error responses

Every JSON error generated by the API uses `application/problem+json` and the
same nine-field contract. A business error looks like:

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.10",
  "title": "يوجد تعارض في البيانات.",
  "status": 409,
  "detail": "كود العبوة 'Con-001' مستخدم بالفعل في عبوة نشطة.",
  "instance": "/api/v1/Containers",
  "errorCode": "Containers.CodeExists",
  "errorType": "Conflict",
  "errors": {
    "Code": [
      "كود العبوة 'Con-001' مستخدم بالفعل في عبوة نشطة."
    ]
  },
  "traceId": "request-trace-id"
}
```

Request validation uses the identical outer contract with field-name keys:

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "فشل التحقق من صحة البيانات.",
  "status": 400,
  "detail": "يرجى مراجعة الحقول غير الصحيحة والمحاولة مرة أخرى.",
  "instance": "/api/v1/Stores",
  "errorCode": "Validation.Failed",
  "errorType": "Validation",
  "errors": {
    "Code": ["حقل الكود مطلوب."]
  },
  "traceId": "request-trace-id"
}
```

Use this frontend type:

```ts
type ApiErrorResponse = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errorCode: string;
  errorType: string;
  errors: Record<string, string[]>;
  traceId: string;
};
```

Frontend handling:

1. For each `errors` entry matching a form field, attach its messages to that
   field. This includes field-targeted business conflicts such as
   `Containers.CodeExists`, which returns `errors.Code`.
2. Display `errors.General` in the page banner or toast. Malformed JSON uses
   the special `$` key. As a defensive fallback, display `detail` if no
   renderable `errors` value exists.
3. Use `errorCode` for stable conditional behavior; do not compare localized
   message text.
4. Handle `401` by attempting one refresh, `403` as insufficient permission,
   `404` as missing/unavailable data, and `409` as a business conflict.
5. Every API error contains a `traceId`. Preserve it for support; for `500`,
   show only the generic server message supplied by the API.
6. If a proxy/network failure does not contain this JSON shape, use the
   frontend's generic transport-error fallback.

## 4. Phase 0 handoff: Store preparation

**Backend status:** Ready on 2026-07-22

**Database status:** Migration `20260722193932_EnforceUniqueActiveContainerStore` pending; not applied by this task

**Swagger status:** Verified locally

**Frontend status:** Integration/update pending

**Breaking API schema change:** No

**Behavior change:** Yes

Phase 0 did not add a new route or change the `StoreRequest` or `StoreResponse`
JSON shape. It added one business invariant:

> Within one company, a business partner can have at most one active,
> non-deleted container store.

The API checks the rule before saving, and SQL Server has a filtered unique
index as final concurrency protection.

### Store routes

| Method | Route | Access | Success | Purpose |
|---|---|---|---|---|
| `GET` | `/api/v1/Stores?pageNumber=1&pageSize=20` | Authenticated | `200` | Paginated product and container stores |
| `GET` | `/api/v1/Stores/select` | Authenticated | `200` | Active product stores only, as `{ id, name }` |
| `GET` | `/api/v1/Stores/container-select` | Authenticated | `200` | Active usable container stores only, as `{ id, name }` |
| `GET` | `/api/v1/Stores/{id}` | Authenticated | `200` | Store details |
| `POST` | `/api/v1/Stores` | Admin | `201` | Create a store |
| `PUT` | `/api/v1/Stores/{id}` | Admin | `200` | Replace all editable store fields |
| `DELETE` | `/api/v1/Stores/{id}` | Admin | `204` | Deactivate and soft-delete a store |

`PUT` expects the complete request object. It is not a partial update.

### Store request

| Field | Type | Required | Frontend rule |
|---|---|---|---|
| `code` | string | Yes | Non-whitespace, maximum 50 characters |
| `name` | string | Yes | Non-whitespace, maximum 200 characters |
| `address` | string or null | No | Maximum 500 characters; blank becomes null |
| `isContainerStore` | boolean | Yes | Controls the business-partner field |
| `businessPartnerId` | integer or null | Conditional | Positive ID when container store; null for product store |
| `isActive` | boolean | No | Defaults to `true`; send explicitly from edit forms |

The server trims `code`, `name`, and nonblank `address` values before saving.

Product-store example:

```json
{
  "code": "MAIN-01",
  "name": "Main Product Store",
  "address": null,
  "isContainerStore": false,
  "businessPartnerId": null,
  "isActive": true
}
```

Active container-store example:

```json
{
  "code": "CONT-ACME",
  "name": "Acme Container Store",
  "address": "Warehouse district",
  "isContainerStore": true,
  "businessPartnerId": 42,
  "isActive": true
}
```

### Store response

```json
{
  "id": 15,
  "companyId": 2,
  "code": "CONT-ACME",
  "name": "Acme Container Store",
  "address": "Warehouse district",
  "isContainerStore": true,
  "businessPartnerId": 42,
  "businessPartnerName": "Acme Trading",
  "isActive": true
}
```

`companyId` is response-only. `businessPartnerName` is null for product stores.

### Store list and selector behavior

- The paginated Store list includes active and inactive product and container
  stores from the selected company.
- Soft-deleted and other-company stores are excluded.
- Results are ordered by `name`, then `id`, for stable pagination.
- No server-side search or store-type filter currently exists.
- `GET /api/v1/Stores/select` is unpaginated and returns only active product
  stores as `{ id, name }`. It intentionally excludes container stores.
- `GET /api/v1/Stores/container-select` is unpaginated and returns only active,
  non-deleted container stores linked to active business partners in the
  selected company. Use it for StoreContainer assignment forms.
- A successful create returns `201`, the created `StoreResponse`, and a
  `Location` header for the Store details route.
- Repeating a delete after soft deletion returns `404`; it is not an idempotent
  `204` operation.

### Validation and uniqueness rules

- Store code is unique among non-deleted stores in the selected company.
  Active and inactive records both participate until soft-deleted.
- Duplicate store names are allowed.
- A product store must send `businessPartnerId: null`.
- A container store must send a positive `businessPartnerId`.
- The business partner must exist, be active, and belong to the selected
  company.
- Only active container stores participate in the one-store-per-partner rule.
- Multiple inactive container stores may reference the same partner, but only
  one can be activated.
- Updating a store with its own unchanged values succeeds because the duplicate
  check excludes the current store ID.
- Deactivating a container store releases the one-active-store-per-partner
  slot. Soft deletion also releases it only when the store has no current or
  historical StoreContainer assignment; assignment history blocks deletion.
- Once a StoreContainer assignment exists, changing that Store's
  `isContainerStore` value or `businessPartnerId` is blocked even when the
  assignment was later deactivated or soft-deleted. This preserves history.

Use `GET /api/v1/BusinessPartners/select` for the container-store partner
picker. It returns active business partners from the selected company as
`{ id, name }` values.

### Store error contract

| Status | Stable error code or shape | Frontend behavior |
|---|---|---|
| `400` | Validation `errors` dictionary | Attach messages to fields and keep the form open |
| `400` | `Stores.InvalidId` | Treat the route ID as invalid |
| `401` | Authentication failure | Refresh once or return to login |
| `403` | Authorization failure | Hide write actions for non-Admin users and show permission feedback if called |
| `404` | `Stores.NotFound` | Remove stale row or return to the list |
| `404` | `Stores.BusinessPartnerNotFound` | Reload the partner selector and show `detail` |
| `409` | `Stores.CodeExists` | Mark `code` as conflicting |
| `409` | `Stores.BusinessPartnerInactive` | Reload the partner selector and show `detail` |
| `409` | `Stores.ActiveContainerStoreExists` | Explain that this partner already has an active container store |
| `409` | `Stores.HasContainerAssignments` | Keep the Store unchanged; explain that assignment history protects its type, partner, and deletion |

Business-partner deletion is also affected. A partner linked to any current or
historical container store cannot be deleted and returns `409` with
`BusinessPartners.HasContainerStores`.

### Concurrency behavior

Normal duplicate submissions are detected before saving and return `409`.
Two simultaneous duplicate requests can both pass the pre-check; the database
accepts one and rejects the other through its unique index. The rejected race
currently reaches the global `500` handler.

After an unexpected error during container-store creation or activation, reload
the store list before offering Retry because the competing request may already
have created or activated the store. Do not automatically repeat the write.

### Required Store UI behavior

1. Show Product Store and Container Store as mutually exclusive choices.
2. Hide and clear `businessPartnerId` when Product Store is selected.
3. Show and require the active business-partner selector when Container Store
   is selected.
4. Disable write controls for users without the `Admin` role.
5. Send the full Store request for both create and update.
6. Display validation and field-targeted business messages from
   `errors.<Field>`; display non-field business messages from
   `errors.General`, with `detail` only as a defensive fallback.
7. Handle `Stores.ActiveContainerStoreExists` explicitly.
8. Refresh the current page after create, update, or delete.
9. Reload all Store and BusinessPartner data after company selection changes.

### Frontend acceptance scenarios

- [ ] Product Store clears and submits `businessPartnerId: null`.
- [ ] Container Store requires an active business-partner selection.
- [ ] One active container store can be created for a partner.
- [ ] A second active container store displays
      `Stores.ActiveContainerStoreExists` without losing form data.
- [ ] An inactive container store for the same partner is accepted.
- [ ] Activating a duplicate is blocked, while updating the current active
      store without changing its partner succeeds.
- [ ] Authenticated User can read but cannot create, update, or delete.
- [ ] Pagination, empty pages, loading states, and soft-deleted rows behave as
      documented.
- [ ] Company switching reloads the list and both Store-related selectors.

### Phase 0 verification record

- Release build: passed with zero warnings and zero errors.
- EF pending-model check: no pending model changes.
- Forward and rollback migration SQL: reviewed.
- Generated Swagger JSON: Store create and update descriptions and responses
  verified at runtime.
- Configured application database: not modified during verification.
- Automated tests: no test project currently exists; this remains technical
  debt.

Relevant backend contracts:

- [`StoreRequest`](E:/MiniErp/src/MiniErp.Application/Features/Stores/StoreRequest.cs)
- [`StoreResponse`](E:/MiniErp/src/MiniErp.Application/Features/Stores/StoreResponse.cs)
- [`StoresController`](E:/MiniErp/src/MiniErp.Api/Controllers/StoresController.cs)
- [`Stores Swagger documentation`](E:/MiniErp/src/MiniErp.Api/Swagger/StoresSwaggerDocumentation.cs)

## 5. Phase 1 handoff: reference and container data

**Backend status:** Backend ready / frontend pending on 2026-07-22

**Database status:** Migration
`20260722202332_AddReferenceAndContainerData` pending; not applied by this task

**Swagger status:** Verified locally after the final API change

**Frontend status:** Integration pending

**Breaking API schema change:** No; all Phase 1 routes are additive

**Existing behavior change:** Yes; Store assignment history now protects Store
type, linked partner, and deletion

**Seed status:** No Phase 1 Country, Container, or StoreContainer rows were
added. Existing identity/catalog seed behavior is unchanged.

### User-visible purpose

Phase 1 lets an Admin maintain:

- a global Country reference list;
- reusable Container types owned by the selected company; and
- the Container types that are allowed for each customer/supplier container
  store.

Authenticated `User` and `Admin` roles can read these records. Only `Admin`
can create, update, or delete them. There is no Phase 1 transactional posting,
stock-balance, invoice, or container-movement behavior.

Because no Phase 1 data is seeded, all three lists can initially be empty.
Create records in this order: Country as needed, Container, container Store,
then StoreContainer assignment.

### Ownership and company isolation

- Country is global. Every authenticated company sees the same non-deleted
  Country records, and Country requests do not contain `companyId`.
- Container and StoreContainer are company-owned. Their `companyId` always
  comes from the access token's `company_id` claim and is response-only.
- A Store or Container ID from another company is treated as unavailable and
  returns `404`; the API does not reveal cross-company data.
- Company switching must reload Containers, StoreContainer assignments, and
  all related selectors. Reload Countries too if the page is open so the UI
  reflects changes made by another Admin.

### Routes and authorization

Country routes:

| Method | Route | Access | Success | Purpose |
|---|---|---|---|---|
| `GET` | `/api/v1/Countries?pageNumber=1&pageSize=20` | Authenticated | `200` | Paginated global list |
| `GET` | `/api/v1/Countries/select` | Authenticated | `200` | Active global Countries as `{ id, name }` |
| `GET` | `/api/v1/Countries/{id}` | Authenticated | `200` | Country details |
| `POST` | `/api/v1/Countries` | Admin | `201` | Create a Country |
| `PUT` | `/api/v1/Countries/{id}` | Admin | `200` | Replace editable Country fields |
| `DELETE` | `/api/v1/Countries/{id}` | Admin | `204` | Deactivate and soft-delete |

Container routes:

| Method | Route | Access | Success | Purpose |
|---|---|---|---|---|
| `GET` | `/api/v1/Containers?pageNumber=1&pageSize=20` | Authenticated | `200` | Paginated selected-company list |
| `GET` | `/api/v1/Containers/select` | Authenticated | `200` | Active selected-company Containers as `{ id, name }` |
| `GET` | `/api/v1/Containers/{id}` | Authenticated | `200` | Container details |
| `POST` | `/api/v1/Containers` | Admin | `201` | Create a Container in the selected company |
| `PUT` | `/api/v1/Containers/{id}` | Admin | `200` | Replace editable Container fields |
| `DELETE` | `/api/v1/Containers/{id}` | Admin | `204` | Soft-delete an unused Container |

StoreContainer routes and related selectors:

| Method | Route | Access | Success | Purpose |
|---|---|---|---|---|
| `GET` | `/api/v1/StoreContainers?pageNumber=1&pageSize=20` | Authenticated | `200` | Paginated assignment list |
| `GET` | `/api/v1/StoreContainers/select?storeId=15` | Authenticated | `200` | Active Containers assigned to one usable container Store |
| `GET` | `/api/v1/StoreContainers/{id}` | Authenticated | `200` | Assignment details |
| `PUT` | `/api/v1/StoreContainers/upsert` | Admin | `200` | Atomically replace one Store's complete active Container set |
| `GET` | `/api/v1/Stores/container-select` | Authenticated | `200` | Active usable container Stores for assignment forms |

Every `PUT` is a full replacement of editable fields, not a partial update.
For StoreContainers, the replacement applies to the entire assignment set for
one Store. The old StoreContainer `POST`, `PUT /{id}`, and `DELETE /{id}`
write routes are removed; do not call them.

### Country contract

Country request fields:

| Field | Type | Required | Frontend/server rule |
|---|---|---|---|
| `code` | string | Yes | Trimmed, non-whitespace, maximum 50 |
| `name` | string | Yes | Trimmed, non-whitespace, maximum 200 |
| `arabicName` | string | Yes | Trimmed, non-whitespace, maximum 200 |
| `isActive` | boolean | No | Defaults to `true`; send explicitly from edit forms |

Country create/update example:

```json
{
  "code": "EG",
  "name": "Egypt",
  "arabicName": "مصر",
  "isActive": true
}
```

Country response:

```json
{
  "id": 1,
  "code": "EG",
  "name": "Egypt",
  "arabicName": "مصر",
  "isActive": true
}
```

An active Country code is globally unique. Inactive duplicates are allowed,
but activating an inactive duplicate is blocked while another active record
uses the same code.

### Container contract

Container request fields:

| Field | Type | Required | Frontend/server rule |
|---|---|---|---|
| `code` | string | Yes | Trimmed, non-whitespace, maximum 50 |
| `name` | string | Yes | Trimmed, non-whitespace, maximum 200 |
| `description` | string or null | No | Maximum 1000; blank becomes null |
| `isActive` | boolean | No | Defaults to `true`; send explicitly from edit forms |

Container create/update example:

```json
{
  "code": "PALLET-EUR",
  "name": "Euro Pallet",
  "description": "Reusable 1200 x 800 pallet",
  "isActive": true
}
```

Container response:

```json
{
  "id": 7,
  "companyId": 2,
  "code": "PALLET-EUR",
  "name": "Euro Pallet",
  "description": "Reusable 1200 x 800 pallet",
  "isActive": true
}
```

An active Container code is unique only inside the selected company. Another
company can use the same code. Inactive duplicates are allowed inside a
company, but only one same-code row can be active.

### StoreContainer assignment contract

Upsert request fields:

| Field | Type | Required | Frontend/server rule |
|---|---|---|---|
| `storeId` | integer | Yes | Positive ID from `/Stores/container-select` |
| `containerIds` | integer array | Yes | Complete final set; 0-100 unique positive IDs from `/Containers/select` |

Do not send assignment `id`, `companyId`, `containerId`, `isActive`, Store
display fields, partner fields, or Container display fields in the request.
The list is not a delta: every active assignment that should remain must be
included.

Upsert example:

```json
{
  "storeId": 15,
  "containerIds": [7, 9]
}
```

The response is the complete final active assignment array, ordered by
Container name and then Container ID:

```json
[
  {
    "id": 31,
    "companyId": 2,
    "storeId": 15,
    "storeCode": "CONT-ACME",
    "storeName": "Acme Container Store",
    "businessPartnerId": 42,
    "businessPartnerName": "Acme Trading",
    "containerId": 7,
    "containerCode": "PALLET-EUR",
    "containerName": "Euro Pallet",
    "isActive": true
  }
]
```

Upsert behavior:

- Existing active selections remain unchanged.
- Selected inactive, non-deleted assignments are reactivated.
- New selections create new assignments.
- Current assignments omitted from `containerIds` are deactivated and
  soft-deleted.
- `containerIds: []` removes every current assignment for the Store and
  returns `[]`.
- Deleted historical rows are never restored; re-adding their Container
  creates a new row.
- Repeating the same request is idempotent and does not change audit fields.
- Any validation or database failure rolls back the complete operation.

For a non-empty list, the Store and every Container must exist in the selected
company and be active. The Store must be a container Store linked to an active
BusinessPartner. An empty list may clear assignments even when the container
Store or its partner is inactive, but the Store must still exist in the
selected company and remain classified as a container Store.

Soft-deleted assignment history remains significant: clearing a list does not
release the existing Store/Container historical deletion protections.

### Selector semantics

All selectors return this unpaginated shape:

```json
[
  {
    "id": 7,
    "name": "Euro Pallet"
  }
]
```

The meaning of `id` depends on the selector:

| Selector | `id` means | Included rows |
|---|---|---|
| `/Countries/select` | Country ID | Active, non-deleted global Countries |
| `/Containers/select` | Container ID | Active, non-deleted Containers in the selected company |
| `/Stores/select` | Store ID | Active product Stores only |
| `/Stores/container-select` | Store ID | Active container Stores with active partners |
| `/StoreContainers/select?storeId={id}` | **Container ID, not assignment ID** | Active assignments whose Container is also active |

Use `/Stores/container-select` and `/Containers/select` to populate the two
fields on the assignment form. Use `/StoreContainers/select?storeId={id}` when
a later workflow needs only Container types already allowed for a selected
Store. That endpoint first validates that the Store is an active usable
container Store; it does not silently return data for a product or inactive
Store.

An Admin may create missing Container master data without leaving this setup
flow. Show `+ Add Container` beside the Container selector and open an inline
modal using the normal `POST /api/v1/Containers` contract. After a successful
`201`, reload `/Containers/select`, automatically select the returned Container
ID, and preserve the current Store and other selected Containers. Do not create
a Container automatically from free text, and do not show this write action to
non-Admin users. If creation returns `Containers.CodeExists`, keep the modal
open, reload the selector, and let the Admin choose the existing Container.

### Pagination, list content, and sorting

- All three main list endpoints use the API-wide pagination contract.
- Lists include active and inactive non-deleted records. Selectors are
  active-only.
- Country list order: `name`, then `id`.
- Container list order: `name`, then `id` inside the selected company.
- StoreContainer list order: `storeName`, then `containerName`, then assignment
  `id`.
- Soft-deleted and other-company rows are excluded.
- Store, partner, and Container display fields are projected by SQL; the
  frontend does not need one request per row.
- There is no server-side search or custom filtering in Phase 1.

### Dependency and deletion behavior

- Country has no registered database dependency in Phase 1, so it can be
  soft-deleted. Invoice dependency protection must be added when Invoice
  persistence is introduced.
- A Container with any current or historical StoreContainer assignment cannot
  be deleted, even if that assignment is inactive or soft-deleted.
- A Store with any current or historical StoreContainer assignment cannot be
  deleted. Its `isContainerStore` and `businessPartnerId` also cannot change.
- Deactivating a Store, Container, or BusinessPartner is currently allowed.
  Selectors exclude combinations that are no longer usable.
- A StoreContainer assignment has no incoming Phase 1 foreign key and can be
  soft-deleted. Store and Container records remain.
- Company deletion is blocked by current or historical company-owned data,
  including Containers and StoreContainer assignments.

### Phase 1 error contract

API-wide `401`, `403`, validation, and unexpected-error behavior remains as
described in section 3. Important stable business errors are:

| Status | Stable error code or shape | Returned when | Frontend action |
|---|---|---|---|
| `400` | `Validation.Failed` with field-keyed `errors` | A request field is missing, blank, too long, or a body foreign-key ID is not positive | Attach messages to fields |
| `400` | `Countries.InvalidId` | Country route ID is zero or negative | Reject the route ID |
| `404` | `Countries.NotFound` | Country is missing or soft-deleted | Remove stale data or return to list |
| `409` | `Countries.CodeExists` | Another active global Country has the code | Mark `code` as conflicting |
| `400` | `Containers.InvalidId` | Container route ID is zero or negative | Reject the route ID |
| `404` | `Containers.NotFound` | Container is missing, deleted, or belongs to another company | Remove stale data or return to list |
| `409` | `Containers.CodeExists` | Another active Container in the company has the code | Mark `code` as conflicting |
| `409` | `Containers.HasStoreAssignments` | Current or historical assignment protects the Container | Keep the record and show `errors.General` |
| `400` | `StoreContainers.InvalidId` | Assignment route ID is zero or negative | Reject the route ID |
| `400` | `StoreContainers.InvalidStoreId` | Selector `storeId` is zero or negative | Clear the Store selection |
| `400` | `Validation.Failed` with `errors.ContainerIds` | `containerIds` is missing, has more than 100 values, contains duplicates, or contains a non-positive ID | Keep the multi-select open and show its field errors |
| `400` | `StoreContainers.ContainerIdsRequired`, `StoreContainers.TooManyContainers`, `StoreContainers.DuplicateContainerIds`, or `StoreContainers.InvalidContainerId` | Defensive service-level equivalent of invalid upsert input; HTTP requests normally return `Validation.Failed` first | Treat as a `containerIds` field error |
| `404` | `StoreContainers.NotFound` | Assignment is missing, deleted, or belongs to another company | Remove stale data or return to list |
| `404` | `StoreContainers.StoreNotFound` | Store is missing, deleted, or belongs to another company | Reload Store selector |
| `404` | `StoreContainers.ContainerNotFound` with `errors.ContainerIds` | One or more requested Containers are missing, deleted, or belong to another company | Reload Container selector and keep still-valid selections |
| `409` | `StoreContainers.StoreNotContainerStore` | Selected Store is a product Store | Reload and use container-Store selector |
| `409` | `StoreContainers.StoreInactive` | Selected container Store is inactive | Reload Store selector |
| `409` | `StoreContainers.StoreBusinessPartnerInactive` | Linked partner is missing/inactive | Reload Store/partner data |
| `409` | `StoreContainers.ContainerInactive` with `errors.ContainerIds` | One or more selected Containers are inactive | Reload Container selector and keep still-valid selections |
| `409` | `Stores.HasContainerAssignments` | Store deletion or protected type/partner change conflicts with assignment history | Keep Store unchanged and show `errors.General` |

### Transaction and concurrency behavior

Country, Container, and Store writes save atomically. Duplicate pre-checks
provide friendly `409` errors, and filtered unique indexes are the final
data-integrity protection.

Two simultaneous same-value writes can both pass the friendly pre-check. SQL
Server accepts one and rejects the other; the rejected request currently
reaches the global `500` handler. After such an error, reload the relevant list
before offering Retry and never auto-repeat the write.

StoreContainer upsert is different: it validates all IDs in bulk and applies
the complete diff in one SQL Server `Serializable` transaction. Concurrent
upserts for the same Store cannot merge into an unintended union. Under
contention, SQL Server can roll one request back as a deadlock; that request
uses the unified `500` response and the frontend must reload before deciding
whether to retry. Do not automatically retry a complete-set write.

The implementation does not add one shared locking protocol across
StoreContainer upsert and simultaneous Store/Container deactivation or parent
soft-delete services. Avoid issuing those Admin actions concurrently. If an
unexpected error or uncertain concurrent result occurs, reload Store,
Container, and assignment data before continuing. This is recorded technical
debt, not a frontend auto-retry case.

### Required frontend work

- [ ] Add Country, Container, and Store-Container Assignment sidebar routes.
- [ ] Add paginated Country and Container CRUD pages plus a StoreContainer
      Store selector, Container multi-select, and one Save action.
- [ ] Show `code`, `name`, `arabicName`, and active state in Country UI.
- [ ] Show `code`, `name`, `description`, and active state in Container UI.
- [ ] Show one container Store and its BusinessPartner context with the complete
      selected Container list; do not expose assignment-row edit/delete actions.
- [ ] Populate assignment Store from `/Stores/container-select` and Container
      from `/Containers/select`.
- [ ] Provide an Admin-only `+ Add Container` modal inside the setup step; on
      success refresh the selector and automatically select the created row.
- [ ] Make all pages readable by authenticated users and hide/disable write
      actions for non-Admin users.
- [ ] Preserve form data for `409` responses and display field or `detail`
      feedback using the API-wide error rules.
- [ ] Reload affected lists and selectors after successful writes.
- [ ] Reload tenant-owned pages after company selection changes.
- [ ] Handle initial empty lists because no Phase 1 business data is seeded.
- [ ] Pass the production frontend build.

### Frontend acceptance scenarios

- [ ] Country data is visible across company changes; Container and assignment
      data stays isolated to the selected company.
- [ ] Authenticated User can read every Phase 1 page but cannot mutate data.
- [ ] Admin can create one active Country/Container code in its uniqueness
      scope; an active duplicate shows the documented `409`.
- [ ] Inactive duplicates can be saved, while duplicate reactivation is blocked.
- [ ] Whitespace is normalized and length/required errors stay attached to the
      correct form fields.
- [ ] Cross-company, deleted, and missing parents are handled as `404`.
- [ ] Product Stores and inactive Store, partner, or Container choices display
      the documented `409` and refresh their selector.
- [ ] Admin can create a missing Container inline, remains in the setup flow,
      and sees the new Container selected without losing earlier form state.
- [ ] Non-Admin users cannot see or invoke inline Container creation.
- [ ] The assignment selector treats its returned `id` as Container ID rather
      than assignment ID.
- [ ] Upsert adds new selections, retains existing selections, reactivates
      inactive current rows, removes omitted rows, and accepts `[]` to clear
      the complete current set.
- [ ] Repeating the same upsert leaves the same final list without duplicate
      rows.
- [ ] Historical assignments block Container/Store deletion and protected Store
      changes.
- [ ] Pagination metadata, maximum page size, later/empty pages, deterministic
      ordering, and loading/empty/error states work.
- [ ] Company switching reloads every tenant-owned list and selector.

### Phase 1 verification record

- Release build: passed with zero warnings and zero errors.
- EF pending-model check: no changes after the migration.
- Migration scope: reviewed; only Countries, Containers, StoreContainers, and
  the tenant-safe Store alternate key are added.
- Tenant-safe foreign keys: StoreContainer references Store and Container by
  `(CompanyId, Id)` and all new delete behaviors are `Restrict`/`NO ACTION`.
- Forward and rollback SQL: generated and reviewed.
- Generated Swagger JSON: rechecked after the upsert change. The upsert request
  requires `storeId` and `containerIds`, limits the array to 100, returns an
  assignment array, and documents unified `application/problem+json` errors.
  The old StoreContainer POST, PUT-by-ID, and DELETE-by-ID operations are absent.
- Configured application database: not modified; migration remains pending.
- Seed: no Phase 1 rows added and no existing seed behavior changed.
- Automated tests: no test project currently exists. Duplicate, inactive,
  cross-company, historical dependency, SQL projection, migration-on-database,
  and concurrency scenarios remain manual/integration-test debt.
- Frontend application: not changed or built by this backend task.
- StoreContainer upsert runtime checks: unified `400`, `401`, `403`, and `404`
  responses passed; duplicate, non-positive, missing, and over-limit list
  validation uses the documented fields. No current container Store exists in
  the configured development data, so add/reactivate/remove mutation scenarios
  were not executed against the shared database. No Store, Container, or
  StoreContainer business row was changed by verification.
- Upsert implementation review: tenant-safe foreign keys, bulk validation,
  no-N+1 query shape, deterministic projection, serializable transaction,
  idempotent no-change behavior, audit interception, and preservation of
  soft-deleted history were reviewed. Same-Store contention can roll one
  request back; cross-service parent-state races remain documented integration
  debt.

Relevant backend contracts:

- [`CountriesController`](E:/MiniErp/src/MiniErp.Api/Controllers/CountriesController.cs)
- [`CountryRequest`](E:/MiniErp/src/MiniErp.Application/Features/Countries/CountryRequest.cs)
- [`ContainersController`](E:/MiniErp/src/MiniErp.Api/Controllers/ContainersController.cs)
- [`ContainerRequest`](E:/MiniErp/src/MiniErp.Application/Features/Containers/ContainerRequest.cs)
- [`StoreContainersController`](E:/MiniErp/src/MiniErp.Api/Controllers/StoreContainersController.cs)
- [`StoreContainerUpsertRequest`](E:/MiniErp/src/MiniErp.Application/Features/StoreContainers/StoreContainerUpsertRequest.cs)
- [`Phase 1 migration`](E:/MiniErp/src/MiniErp.Infrastructure/Persistence/Migrations/20260722202332_AddReferenceAndContainerData.cs)

## 6. Remaining planned frontend handoffs

`INVOICE_SIDEBAR_TASKS.md` is authoritative for task order and approved scope.
Do not implement exact routes, fields, or enums until generated Swagger and the
step-specific frontend contract are delivered.

### Step 2 - Partner Opening Balances

Planned as editable receivable/payable CRUD with atomic writes, header
row-version concurrency, and complete paginated detail fields. No status,
posting, cancellation, reversal, or partner movements.

### Step 3 - Invoices

Implemented as editable aggregate CRUD for Invoice, product lines, and container
lines. The frontend submits the complete aggregate and retains the original
base64 `RowVersion`. A stale conflict requires reloading the invoice. Do not
show Post or Cancel actions. Create, update, and delete synchronize the current
item, container, outstanding partner, and internal-driver-trip side
effects in the same transaction.

### Step 4 - Stock Adjustments

Implemented as editable increase/decrease aggregate CRUD with header-only
row-version concurrency, complete line collections, and synchronized
`AdjustmentIncrease`/`AdjustmentDecrease` item movements. Inventory Count
freezes every active item's system quantity for one product store, accepts
physical quantities, and atomically generates only the required immutable
Stock Adjustment In/Out documents. There is no status, posting, cancellation,
reversal, or separate movement workflow.

#### Routes and authorization

| Method | Route | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/v1/StockAdjustments` | Authenticated | Paginated complete adjustment aggregates |
| `GET` | `/api/v1/StockAdjustments/{id}` | Authenticated | One adjustment |
| `POST` | `/api/v1/StockAdjustments` | Admin | Create adjustment and movements |
| `PUT` | `/api/v1/StockAdjustments/{id}` | Admin | Replace aggregate and movements |
| `DELETE` | `/api/v1/StockAdjustments/{id}` | Admin | Soft-delete aggregate and movements |
| `GET` | `/api/v1/InventoryCounts` | Authenticated | Paginated count headers |
| `GET` | `/api/v1/InventoryCounts/{id}` | Authenticated | Complete frozen count |
| `POST` | `/api/v1/InventoryCounts` | Admin | Create snapshot and load all eligible items |
| `PUT` | `/api/v1/InventoryCounts/{id}` | Admin | Replace physical quantities and notes |
| `POST` | `/api/v1/InventoryCounts/{id}/reconcile` | Admin | Generate non-zero adjustment differences |
| `DELETE` | `/api/v1/InventoryCounts/{id}` | Admin | Delete an unreconciled count |

Stock Adjustment list filters are optional `documentNumber`, `storeId`,
`direction`, `fromDate`, and `toDate`. Inventory Count filters are optional
`documentNumber`, `storeId`, `isReconciled`, `fromDate`, and `toDate`. Both
also use the standard pagination query fields.

#### Stock Adjustment request

`direction` is the JSON enum name `Increase` or `Decrease`. The API rejects
numeric enum values. `quantity` is positive `decimal(18,6)`, `itemUnitId` is
server-derived, item IDs cannot repeat, and there are at most 100 lines.

```json
{
  "storeId": 12,
  "documentNumber": "SA-2026-001",
  "documentDate": "2026-07-28",
  "direction": "Decrease",
  "reason": "Damaged stock",
  "lines": [
    {
      "itemId": 35,
      "quantity": 2.5,
      "reason": "Count correction"
    }
  ]
}
```

Update sends the complete replacement aggregate plus the original base64
`rowVersion`. Responses add IDs, company/store/item/unit display fields,
`sourceInventoryCountId`, `lastModifiedAt`, `rowVersion`, and the complete
deterministically ordered line collection. When `sourceInventoryCountId` is
not null, the frontend must hide edit/delete because generated adjustments are
immutable.

#### Inventory Count requests

Create sends header fields only:

```json
{
  "storeId": 12,
  "documentNumber": "COUNT-2026-001",
  "countDate": "2026-07-28",
  "notes": "Monthly physical count"
}
```

The create/detail response contains every active item with an active unit,
including zero-stock items. Each line returns frozen `systemQuantity`,
nullable `physicalQuantity`, nullable calculated `difference`, and display
names. The client must not add, remove, or change item/unit/system fields.

Update sends the complete frozen item set:

```json
{
  "notes": "Count completed",
  "lines": [
    {
      "itemId": 35,
      "physicalQuantity": 17.5,
      "notes": null
    }
  ],
  "rowVersion": "AAAAAAAAB9E="
}
```

`physicalQuantity` may be null while counting and may be zero, but must be
present for every line before reconcile. Reconcile sends only:

```json
{
  "rowVersion": "AAAAAAAAB9E="
}
```

The response exposes `increaseAdjustmentId` and `decreaseAdjustmentId`; either
is null when that direction has no differences. A reconciled count is
read-only and cannot be deleted.

#### Conflicts and frontend behavior

- `StockAdjustments.Concurrency` and `InventoryCounts.Concurrency`: reload the
  aggregate and require the user to reapply changes.
- `Inventory.InsufficientStock` or `Inventory.HistoricalStockConflict`: keep
  the form open and show the stock timeline conflict.
- `InventoryCounts.SnapshotStale`: stock changed after the snapshot; do not
  reconcile or silently reload quantities. Ask the user to create a new count.
- `InventoryCounts.PhysicalQuantitiesRequired`: focus missing physical-count
  inputs.
- `InventoryCounts.LinesDoNotMatchSnapshot`: reload details; the client sent
  an incomplete or altered frozen set.
- `InventoryCounts.ReconciledImmutable`,
  `InventoryCounts.AlreadyReconciled`, and
  `StockAdjustments.GeneratedAdjustmentImmutable`: refresh and keep the
  document read-only.
- Missing, inactive, cross-company, container-store, duplicate-number, and
  validation errors use the standard ProblemDetails contract.

The integrated React pages use `/Stores/select` and `/Items/select`, send
complete replacements, retain the latest row version, hide Admin actions from
non-Admins, and passed the production Vite build on 2026-07-28.

### Step 5 - Receipt and Payment Vouchers

Planned as editable voucher/allocation aggregate CRUD with header-only
row-version concurrency and complete allocation collections. No posting,
cancellation, reversal, or partner movements.

### Step 6 - Balance Reports

Deferred until the user approves a source of truth. No balance-report workflow
is currently available, and mutable balance columns must not be inferred.

### Step 7 - Driver Trips

Standalone DriverTrip screens remain deferred pending separate approval.
Invoice CRUD does create, replaces, and soft-deletes the current
`DriverTrip` side effect when an internal driver is supplied.

### UI actions that must not be added

- Post or Cancel buttons.
- Document-status controls.
- Reversal actions.
- Manual movement editing.
- Independent line, container-line, or allocation mutation screens.
- Manual DriverTrip creation or deletion.

## 7. Documentation workflow for every backend step

1. Before implementation, add the feature or step to the phase tracker as
   **Planned** without inventing routes or fields.
2. After backend contracts are implemented, copy the template below and record
   every route, field, enum, status, error code, authorization rule, selector,
   and state transition.
3. Generate Swagger after the final code change and compare its operations and
   schemas with this document.
4. Record backend, migration, deployment, Swagger, and frontend status
   separately.
5. Give the frontend copy-ready JSON examples and acceptance scenarios.
6. After client integration, record the frontend production-build and
   end-to-end test results and update the phase tracker.
7. Add a change-log row. If a contract is breaking, document the client rollout
   or compatibility plan before deployment.

### Required handoff entry template

Copy this template for every completed step or phase. Replace every placeholder;
use `N/A` with a reason instead of leaving a field blank.

```markdown
## Phase/step: <name>

**Backend status:** <Ready | Backend ready / frontend pending>

**Database status:** <N/A | Migration pending | Deployed in environment>

**Swagger status:** <Not ready | Verified locally | Verified in environment>

**Verified date:** <YYYY-MM-DD>

**Breaking change:** <Yes/No and migration path>

**Frontend owner/status:** <owner and state>

### User-visible purpose

<What the user can now do and why it matters.>

### Routes and authorization

| Method | Route | Access | Request | Success | Errors |
|---|---|---|---|---|---|

### Request contract

<Exact JSON field table, required/optional rules, limits, and example.>

### Response contract

<Exact JSON field table and success example.>

### Enums and state transitions

<Exact JSON values. State whether strings or numbers are sent.>

### Validation and errors

| Status | errorCode/shape | When returned | Frontend action |
|---|---|---|---|

### Pagination, filtering, and sorting

<Query parameters, defaults, limits, deterministic order, and empty behavior.>

### Transaction and concurrency behavior

<Atomic effects, idempotency, retry safety, and uncertain-result handling.>

### Related selectors and dependencies

<Which select endpoints populate each field and when data must be reloaded.>

### Frontend work

- [ ] Route/sidebar entry added or recorded as N/A.
- [ ] List, details, and form states implemented as applicable.
- [ ] Role-based actions hidden or disabled correctly.
- [ ] Loading, empty, validation, conflict, unauthorized, forbidden, missing,
      and unexpected-error states handled.
- [ ] Company switch reloads all tenant-owned data.
- [ ] Production frontend build passes.

### Verification evidence

- Swagger UI and `/swagger/v1/swagger.json` reviewed after the final change.
- Success and declared error responses exercised.
- Backend build/tests and frontend build results recorded.
- Known gaps and technical debt recorded.
```

## Phase 3 handoff: Invoices

**Backend status:** Backend ready / frontend integrated on 2026-07-25

**Database status:** Migration `20260725170034_AddInvoiceWorkflow` generated
and reviewed; apply only through the normal deployment migration process.

**Swagger status:** Operation descriptions and enum schemas added; verify the
generated OpenAPI document after deployment.

**Frontend status:** Invoice sidebar page and aggregate form integrated.

**Payment term:** `PaymentTerm` is serialized as the enum names `Cash` and
`Credit` (`Cash = 1`, `Credit = 2`). The create/edit select is required and
defaults to `Cash`. For both terms, the user enters `paidAmount` from zero
through the net total. Any positive remaining amount is outstanding against
the partner account. Invoice CRUD synchronizes item movements, container
movements, outstanding partner movements, and
internal driver trips; it does not create journal entries, vouchers, posting,
or reversal rows.

**Invoice aggregate:** `Invoice`, `InvoiceLine`, and `InvoiceContainerLine`
are created and updated atomically. The API returns complete ordered child
collections, server-derived currency and item units, calculated totals, and a
header-only base64 row version. A stale token returns
`Invoices.Concurrency` and requires a reload.

**Invoice list filters:** The list supports optional invoice number, invoice
type, partner, country, store, responsible driver, payment term, line-price
status, and inclusive date range. Filters combine with `AND`. The frontend
keeps draft filters separate from applied filters, resets pagination to page
one when applying or clearing, and uses the shared `buildQueryString` helper
to omit and safely encode empty query parameters. Filter field models remain
feature-specific. The frontend should continue sending ISO `yyyy-MM-dd`;
external query clients may send other recognizable date formats, with
ambiguous numeric values interpreted day-first.

The exact request/response contract, selectors, validation, errors, and
examples are in
`docs/INVOICE_FRONTEND_CONTRACT.md`.

## 8. Contract change log

Add one row whenever an implemented contract or behavior changes.

| Date | Phase/feature | Change | Breaking | Frontend action | Swagger checked |
|---|---|---|---|---|---|
| 2026-07-22 | Phase 0 / Stores | Enforced one active container store per company and business partner; added `Stores.ActiveContainerStoreExists` behavior | No schema break | Handle the conflict and conditionally require the partner field | Yes |
| 2026-07-22 | Phase 1 / Country and container data | Added Country, Container, and StoreContainer CRUD/list/select contracts plus `/Stores/container-select` | Additive | Add three feature pages and use the documented selectors, errors, and company-reload rules | Yes |
| 2026-07-22 | Phase 1 / Store dependency protection | StoreContainer history now blocks Store deletion and changes to Store type or linked partner through `Stores.HasContainerAssignments` | Behavior only | Preserve Store form state on `409` and explain the historical dependency | Yes |
| 2026-07-22 | Phase 1 / Customer container setup UX | Added an Admin-only inline `+ Add Container` interaction that reuses `POST /Containers`, refreshes the selector, and selects the created Container | No API change | Implement the modal without navigating away or losing setup state | Existing Swagger contract reused |
| 2026-07-23 | API-wide error contract | Unified business, validation, authentication, authorization, routing, method, media-type, and unexpected errors into the nine-field `ApiErrorResponse`; non-field messages use `errors.General` | Additive response fields; replace any exact legacy error DTO | Use the shared type above, render field keys and `General`, preserve `traceId`, and regenerate clients from Swagger if applicable | Yes |
| 2026-07-23 | Phase 1 / StoreContainer upsert | Replaced single-row StoreContainer POST/PUT/DELETE writes with atomic `PUT /StoreContainers/upsert` using the complete `containerIds` set | Breaking write-contract change | Replace assignment-row CRUD with a Store + Container multi-select Save flow; send `[]` to clear | Yes |
