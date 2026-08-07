# Location Feature Case Study

## Purpose and authority

This file contains only Location-specific decisions. It is not a second CRUD,
grid, form, backend, color, or accessibility standard.

Read these authoritative guides first:

- [`GENERIC_ANGULAR_GRID_SCREEN_GUIDE_REVIEWED.md`](./GENERIC_ANGULAR_GRID_SCREEN_GUIDE_REVIEWED.md)
  for grid, modal, action-menu, search, paging, refresh, form, and accessibility
  behavior;
- [`GENERIC_DOTNET_BACKEND_SERVICE_REVIEW_GUIDE.md`](./GENERIC_DOTNET_BACKEND_SERVICE_REVIEW_GUIDE.md)
  for API validation, tenant isolation, business rules, queries, ownership, and
  server-owned fields;
- [`color_system.md`](./color_system.md) for colors, validation states, and dark
  mode.

If this case study conflicts with a canonical guide, the canonical guide wins.
Do not copy generic rules into this file. Add a missing reusable rule to its
canonical guide and keep only the Location-specific decision here.

## Feature map

| Concern | Current location |
|---|---|
| Angular feature | `SiGmaAngularFrontEnd/src/app/modules/Limousine/Location` |
| List component | `Location/components/list` |
| Details form | `Location/components/details` |
| Models | `Location/models` |
| Angular service | `Location/services/location.service.ts` |
| Routes | `Location/location.routes.ts` |
| Backend story | `SigmaBackend/UserStories/LocationService_UserStory.md` |

Before changing the feature, confirm these paths against the current project
map and repository. A renamed or moved implementation overrides this case
study.

## Location contract

The compact editor currently uses these user-editable values:

| Field | Meaning | Required validation |
|---|---|---|
| `searchGoogleLocations` | Search and selected-place display text | Required on Create; trim; maximum 300 characters |
| `shortName` | Short display name | Required; trim; maximum 100 characters |
| `detail` | Full human-readable address | Required; trim; maximum 500 characters |
| `latitude` | Geographic latitude when the API supports typed coordinates | Nullable only when the business rule permits; `-90` through `90` |
| `longitude` | Geographic longitude when the API supports typed coordinates | Nullable only when the business rule permits; `-180` through `180` |

Confirm requiredness and maximum lengths against the backend ViewModels and
entity mapping before implementation. The frontend may be equally strict for
usability, but it must not accept a value the backend rejects.

Create and Update requests must contain only mutable fields. `SubscriptionId`,
generated `No`, audit fields, deletion state, and calculated values are
server-owned. A legacy transport adapter may carry `SubscriptionId` only when
an inherited backend contract still requires it; the backend treats it as an
untrusted assertion, checks it against the tenant-scoped record, and never maps
it as a mutable value.

## Place search

The current endpoint is:

```text
GET /Location/SearchPlaces?searchKey={text}&lat={lat}&lng={lng}
```

The result model is:

```typescript
export interface LocationSearchDTO {
  shortName: string;
  longName: string;
  placeId: string;
  longitude: number;
  latitude: number;
}
```

Location search must:

- trim the query and wait until at least two meaningful characters exist;
- debounce typing and cancel the stale request when a newer query arrives;
- URL-encode parameters through `HttpParams`, not string concatenation;
- expose loading, empty, and failure states without making the form unusable;
- ignore a late response that no longer matches the current query;
- clear suggestions when the query is cleared or the editor closes;
- apply a selected result atomically so text and coordinates describe the same
  place;
- stay keyboard accessible with combobox/listbox semantics, active-option
  state, Escape, arrows, Enter, and focus restoration;
- avoid exposing a third-party API key in Angular;
- enforce backend authorization, timeouts, cancellation, rate protection, and
  safe logging for the proxy request.

On selection, map:

| Search result | Form/request value |
|---|---|
| `shortName` | `searchGoogleLocations` |
| suitable display value | `shortName` |
| `longName` | `detail` |
| `latitude` | typed `latitude` when supported |
| `longitude` | typed `longitude` when supported |

Do not silently truncate an address returned by the search provider. Show a
validation message or apply a documented normalization rule when it exceeds
the backend limit.

## Coordinate compatibility

The existing backend may recognize coordinates embedded in `detail`:

```text
Lat/Lng: 25.2048, 55.2708
```

This marker is legacy compatibility transport, not the target contract.

- Preserve reading it only while existing records require it.
- Do not introduce marker parsing in another service.
- Prefer nullable numeric `latitude` and `longitude` properties.
- Require both coordinates together unless the backend explicitly supports a
  partial location.
- Validate finite numeric values and geographic ranges on the backend.
- Keep the human-readable address independent from coordinate serialization.
- Do not use truthy checks because zero is a valid latitude or longitude.

If the API contract is migrated, keep backward compatibility in one mapping
boundary and remove it after stored legacy records are migrated. Do not spread
marker parsing across components, services, and entities.

## Endpoint parity

Verify the actual controller routes and DTOs before changing Angular. The
expected feature shape is:

| Operation | Method | Expected contract |
|---|---|---|
| List | `GET /Location` | Server keyword/filter values plus top-level `pageNo` and `pageSize` |
| Create | `POST /Location` | Mutable Location fields only |
| Details | `GET /Location/GetByWithNavigationsId/{id}` | Tenant-owned Location details |
| Update | `PUT /Location` | `id` plus mutable Location fields only |
| Delete | `DELETE /Location?id={id}` | Tenant-owned id; only when product permissions expose Delete |
| Place search | `GET /Location/SearchPlaces` | `searchKey` and optional typed coordinates |

The list query serializer must not place `pageNo` or `pageSize` inside
`Filters[...]`. Apply the canonical grid guide for exact `totalCount`,
deterministic ordering, server-backed keyword search, page reset, refresh, and
Export parity.

Every response uses the project result wrapper. The UI must check success and
stop its busy state on success, failure, cancellation, and component
destruction.

## Editor decisions

Location is currently a compact three-field editor, so a single reusable
PrimeNG dialog is appropriate for Create, View, and Edit.

| Mode | Record id | Behavior |
|---|---:|---|
| Create | None | Empty form; place search available |
| View | Required | Load tenant-owned record; disable fields; no Save |
| Edit | Required | Load tenant-owned record; enable only backend-mutable fields |

The list owns grid, selection, mode, and dialog state. The details component
owns form, load, place search, validation, and save. It emits a typed
`create`/`update` result after success; it does not mutate the grid directly.

Use an explicit payload builder. `getRawValue()` may feed the builder so
deliberately disabled mutable fields can be read, but it is never the request
object itself.

Standalone routes should remain only when direct links are a real requirement:

```text
Location/
Location/create
Location/details/:id
```

If the product uses only the embedded dialog, remove unused routes and their
navigation code together. Do not maintain two editor flows without a confirmed
consumer.

## Location-specific grid decisions

Apply the canonical grid behavior with these feature decisions:

- The feature is database-backed, so keyword search must reach the backend; a
  page-local `filterGlobal` input is not a Location search.
- After Create, show the page determined by the confirmed stable backend sort;
  never assume the new row is on the last page.
- After Update, preserve the active server filter and valid current page.
- Use the shared action-menu portal for first, middle, last, and one-row table
  cases.
- Do not expose Delete unless the product requirement, permission, and backend
  dependency checks all allow it.

## Current implementation caveats

Review these facts against the current code rather than copying them blindly:

- `SearchGoogleLocation.ts` is a legacy filename even though the endpoint is
  `SearchPlaces`. Rename it only with all imports.
- Existing list/details spec files may still reference unrelated example
  components; do not treat them as evidence for Location behavior.
- Remove an unused `Renderer2` import if it still exists.
- Compatibility properties such as `value` and `name` belong only while a
  confirmed consumer needs them.
- The legacy coordinate marker should remain isolated at the transport/mapping
  boundary.
- Delete may exist in the service without being a permitted UI action.

## Location review checklist

- [ ] Angular fields match Create, Update, Detail, entity, and database
      contracts in both directions.
- [ ] Place search is debounced, cancellable, encoded, keyboard accessible, and
      protected by the backend.
- [ ] Selecting a place updates address and coordinates atomically.
- [ ] Latitude and longitude validate range, zero, nullability, and pairing.
- [ ] Legacy coordinate parsing is isolated and is not copied into new code.
- [ ] Create/Update payloads contain only explicitly mutable fields.
- [ ] Tenant, generated number, audit, deletion, and calculated fields remain
      server-owned.
- [ ] Server search finds values outside the currently loaded page.
- [ ] Create placement follows stable ordering; Update preserves filter/page.
- [ ] View, Edit, direct routes, dialog state, and action permissions match
      confirmed product behavior.
- [ ] One-row/last-row action menus work through the shared portal.
- [ ] Owner-run checks cover Create, View, Edit, invalid Save, place-search
      failure, stale responses, coordinate boundaries, RTL, keyboard, mobile,
      dark mode, and tenant mismatch.

Codex must not build, test, or run Sigma unless the owner explicitly requests
it in the current task. Record only verification evidence supplied by the
owner.
