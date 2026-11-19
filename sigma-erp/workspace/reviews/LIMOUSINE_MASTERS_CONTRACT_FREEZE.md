# Limousine masters — frozen frontend handoff

| Status | Frozen |
|---|---|
| Owner verification pending | yes |

## Scope and decisions — 2026-10-07

Location and TripTypes select screen01 lists + modal editors. LimousineTariff selects a complete settings/collection workspace (screen06/05 composition), not generic CRUD. Current source/backend contracts own business semantics; no schema change.

| Owner | Read/grid/filter contract | Detail/write contract |
|---|---|---|
| LocationService / LocationController | Generic GET Location, pageNo/pageSize, exact totalCount; Filters[shortName] property contains; shared columns shortName/searchGoogleLocations/detail (preserve actual content) plus actions/id | SearchGoogleLocations max300, ShortName max100, Detail max500; coordinates are read/server-derived from Detail; Update contains id only beyond Add fields; no subscriptionId/no/audit |
| TripTypeService / TripTypeController | Generic GET TripType, pageNo/pageSize, exact totalCount; Filters[name] contains; columns name + actions/id | Name only; Update id+name; trim/blank/duplicate validation server-owned; delete dependencies TripBooking/LimoQuotation |
| TripType tariff settings | GET/PUT TripType/{id}/TariffSettings | route/body tripTypeId equal; base/corporate category objects locationBased/timeBased/distanceBased/rateTypes (enum0–14); display tripTypeName read-only |
| LimousineTariffService / LimousineTariffController | GetTariffs top-level tariffCategory/customerId; complete scope editor rows/sections, no paging | PUT EditList: category/customer plus full snapshot of items (type/location IDs/vehicleTypeId/rateType/integer nonnegative rate); preserve scope deletion semantics and typed blank rows; Base no customer, Corporate active customer required |

API paging supplied to generic list clamps page>=1,size1–100; initial UI size15. Do not simulate server paging by loading all. Export may use shared fetchAllPages. Search/paging/refresh use switchMap and shared resolveListPaging. Serializer owner toListParams / toQueryParams. Keep Google SearchPlaces exact top-level keys searchKey/lat/lng and actual result shape; dependent reads cancel stale responses.

## Conformance before implementation

| Concern | Book | Actual reference / owner | Target / decision |
|---|---|---|---|
| Lists | UI1/3/4/5/6/7 | Workshop/Job list; FilterPanel/DataTable typed public inputs | Location/TripTypes currently ms-lib/DOM paging; replace with shared shell/actions/control paging; remove Location report DOM rewrite |
| Modals / dirty close | UI10/13/15 | shared EditorDialog/EditorTabs and UnsavedChanges owner | Existing raw dialogs/routes/form copies; one controlled modal editor, typed forms/mode, block save until required reads succeed, preserve inputs on failure |
| Editable rows / settings | UI1/14/16/19 | shared EditableCollectionTable/EditableRows, routed settings shared shell | Preserve complete tariff matrix/scope and full snapshot; typed integer rates, shared fields/errors; shared confirmation for removals/discard |
| Feedback / lifetime | UI2/22/28 | interceptor/api-error and takeUntilDestroyed/finalize | No undefined error handlers/hidden failed lookups; one presentation owner, retry, duplicate guards |
| Style | UI24/25/27 | shared global tokens/components | Remove bespoke palette/table/filter/dialog internals; keep domain layout only |

Reference actions: View/Edit/Delete supported for normal entities with server dependency validation; TripType tariff settings supported. Approve/post/void/financial downstream actions Not Applicable: entities have no such state/document. No new permission API. Backend source inspected only; unrelated API consumers keep current contract. Root owns shared files, translations/providers/compilation-root changes; worker owns the three feature folders only.

## Historical response amendment — 2026-10-07

Root integration applies BE3/5 to the verified generic producers and typed editor consumers: LocationListVM is id/searchGoogleLocations/shortName/detail; LocationDetailVM adds latitude/longitude to those fields. TripTypeListVm and TripTypeDetailVm are id/name. Neither response needs inherited audit/tenant/flag fields. One-way conventional maps replace unused ReverseMap declarations; writes and endpoints retain their frozen fields. Scoped symbol searches confirmed generic service/interface/controller support class detail responses and no feature consumer uses removed plumbing. Owner compiler/API compatibility acceptance remains pending; no entity/EF/schema change.
