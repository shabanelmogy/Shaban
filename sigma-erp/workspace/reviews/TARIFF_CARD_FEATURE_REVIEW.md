# Tariff Card Feature Review Manifest

## Manifest

| Item | Decision or evidence |
|---|---|
| Requested outcome | Refactor `SiGmaAngularFrontEnd/src/app/modules/Rental/TariffCard` from the supplied functional screenshots into the approved Sigma list and dialog-editor shapes, including directly related API contracts. |
| Source scope | Angular TariffCard routes, list/editor components, models, service, specs, translations and direct provider wiring; .NET TariffCard entity, EF configuration, ViewModels, mapper, service/interface and controller. |
| Existing user changes | Frontend was clean at discovery. Backend contains pre-existing RentalTariff/TariffSetting changes from earlier scoped work; they are preserved and excluded from this TariffCard diff. |
| Evidence | `TC-E1` through `TC-E4`: `C:/Users/user/Desktop/TarrifCard/1.PNG` through `4.PNG`. |
| UI shapes | Canonical shared list/grid and a single-section controlled ordinary CRUD modal. |
| Backend pattern | Pattern 1 normal tenant-scoped, soft-deleted entity. No aggregate children and no financial posting. |
| Approved references | `shared/components/data-table` + `Fleet/VehicleService/components/list`; `shared/components/editor-dialog` + `Fleet/VehicleService/components/details`; shared primary action and confirmation service. |
| Routes and modes | `/TariffCard` list route only. The list owns `create | view | edit` dialog state and the selected id. |
| Endpoints | `GET /TariffCard?pageNo&pageSize`, `GET /TariffCard/GetById/{id}`, `POST /TariffCard`, `PUT /TariffCard`, `DELETE /TariffCard?id={id}`, inherited `GET /TariffCard/GetSelect` for existing lookup consumers. |
| Actions | Create; View (canonical CRUD modal action); Edit; confirmed Delete. |
| Permission mechanism | Authenticated layout through `AuthGuard`; no frontend authorization mechanism exists. Backend remains the security boundary. |
| Applicable phases | 00, 01, 02, 03, 05 and 06. Phase 04 is not applicable because Save/Delete are ordinary CRUD operations, not a special domain transition. |
| Packet status | Phase 00/01/05/06 packets are current. Generated Phase 02/03 packets are stale and must not be used; canonical source blocks are authoritative. |
| Explicit exclusions | Tariff calculation rules, rental tariffs, branch tariff settings, reports, exports, permissions not present in the application, and unrelated modules. |
| Unresolved requirements | Grid sorting is visually suggested by the historical table chrome but has no confirmed backend sort contract, so sortable columns are not enabled. |

## Functional Evidence Table

| Evidence | Classification | Required behavior | Owner | Implementation decision |
|---|---|---|---|---|
| TC-E1 | Explicit | Title/subtitle, enabled Create action, grid with Actions/Name/Discount/From Date/To Date and paging | Phase 02 | Shared feature title, primary action and data table with server total/paging. |
| TC-E2 | Explicit | Create editor with name, period checkbox and conditional dates, default-period discount checkbox and conditional percentage, Cancel/Save | Phase 03 | Controlled single-section editor dialog and typed form. |
| TC-E3 | Explicit | Edit uses the same fields and preloads current values | Phase 03 | Same dialog in edit mode; detail request is identity-guarded. |
| TC-E4 | Explicit | Row actions include Edit and Delete | Phase 02/03 | Shared action menu; Delete uses shared confirmation. |
| TC-E1/TC-E4 | Strong inference | Blank period cells represent cards not limited to a period | Phase 01/02 | Nullable date fields; blank display for null. |
| TC-E1 | Explicit | Equal date/time boundaries exist for at least one row | Phase 01/03 | `from == to` is valid; only reversed ranges fail. |
| Canonical CRUD modal rule | Derived | Same shell supports View in addition to Create/Edit | Phase 03 | Add View action using the existing detail contract; no new domain field or endpoint. |
| Existing TariffCard source | Confirmed | Turning off period/discount clears the dependent values | Phase 01/03 | UI clears controls and backend normalizes dependent fields to null. |

## Grid and ListVM Contract

| Order | Grid label | Angular property | Backend ListVM property | Transformation | Sortable | Status |
|---:|---|---|---|---|---|---|
| 1 | Actions | `id` | `Id` | Shared action menu | No | Confirmed |
| 2 | Tariff Card Name | `name` | `Name` | None | No | Confirmed |
| 3 | Discount | `discountPercentage` | `DiscountPercentage` | Two-decimal display; blank becomes `0.00` only when the discount flag is false/null | No | Confirmed |
| 4 | From Date | `fromDateTime` | `FromDateTime` | `dd/MM/yyyy HH:mm`, blank when null | No | Confirmed |
| 5 | To Date | `toDateTime` | `ToDateTime` | `dd/MM/yyyy HH:mm`, blank when null | No | Confirmed |

The list contract excludes tenant, audit, soft-delete, GUID, validity and editor-only booleans. `ApplicableForPeriodOnly` and `PaymentDiscountOnDefaultPeriod` are editor/detail fields; the grid derives no state from them.

## Filter Contract

No filter control is demonstrated or required. Paging is the only list query state:

| UI state | Query property | API parameter | Backend parser | Default |
|---|---|---|---|---|
| Page | `pageNo` | `pageNo` | positive integer, clamped to at least 1 | 1 |
| Page size | `pageSize` | `pageSize` | integer clamped to 1..200 | 10 in this screen |

## Detail and Write Contract

| UI control | Angular control | Detail | Add | Update | Server-owned | Validation owner |
|---|---|---|---|---|---|---|
| Identity | dialog input | `id` | — | `id` | Yes on create | Route/dialog context + backend lookup |
| Name | `FormControl<string>` | `name` | `name` | `name` | No | Required, trimmed, maximum 50 in UI/service/EF |
| Applicable for period only | `FormControl<boolean>` | yes | yes | yes | No | UI + backend |
| From date/time | `FormControl<Date|null>` | nullable | nullable | nullable | No | Required only when period flag is true; real date; ordered |
| To date/time | `FormControl<Date|null>` | nullable | nullable | nullable | No | Required only when period flag is true; `from <= to` |
| Payment discount on default period | `FormControl<boolean>` | yes | yes | yes | No | UI + backend |
| Discount percentage | `FormControl<number|null>` | nullable | nullable | nullable | No | Required only when discount flag is true; 0..100; precision two |

Client payloads exclude subscription, No, audit, delete, active, validity, GUID and change-tracking fields.

## Invariants and Persistence

| Invariant | Add | Update | Delete | Persistence support | Failure behavior |
|---|---|---|---|---|---|
| Nonblank normalized name | Required | Required | — | Required `nvarchar(50)` | Typed business failure |
| Unique active name within tenant | Exclude existing active row | Exclude self | — | Required/default-false `IsDeleted` plus filtered unique `(SubscriptionId, Name)` | Duplicate-safe failure |
| Period dates | Both required when flag true; cleared otherwise | Same | — | Nullable columns | Business failure for missing/reversed range |
| Discount | Required 0..100 when flag true; cleared otherwise | Same | — | `decimal(5,2)` | Business failure for missing/out-of-range value |
| Referenced by PartnerBillingInfo | — | — | Block ordinary soft delete | Existing FK relationship | Actionable business failure |

Add, Update and Delete each reach one `SaveChangesAsync` on one scoped `DbContext`; EF Core implicit transaction is sufficient.

## Action-State Contract

| Action | Visible | Confirmation | Busy guard | Success | Failure |
|---|---|---|---|---|---|
| Create | Always outside delete/list load | None | dialog saving | Close + refresh current page | Keep entered data and show error |
| View | Every valid row | None | list/delete guard | No mutation | Keep list and show load error in dialog |
| Edit | Every valid row | Dirty discard only | dialog saving | Close + refresh current page | Keep entered data and show error |
| Delete | Every valid row | Shared danger confirmation naming the card | deleting id | Step back if last row, then refresh | Preserve row and show error |

## Route, Provider and Event Contract

| Surface | Mode/id source | Exit | Provider/interceptor | Refresh |
|---|---|---|---|---|
| `/TariffCard` | Route | Remains list | `TariffCardsService` in LayoutModule; token/error interceptors | Initial and lazy-load requests |
| Editor dialog | List signals: mode + selected id | Controlled close/discard | Same service instance | Child emits `closed(true)` after successful write |

The duplicate `TariffCardsService` provider entry is reduced to one entry without changing its injector. Existing Company/Individual lookup consumers continue to use inherited `GetSelect`.

## Unresolved Requirements Register

| Requirement | Status | Missing source | Blocked work | Safe decision |
|---|---|---|---|---|
| Server sorting for screenshot column arrows | Uncertain | No sort request or backend whitelist exists | Sortable grid headers | Keep deterministic newest-first backend order and do not advertise sorting. |
| Deleting a card currently referenced by billing info | Conflicting legacy mechanics | EF relationship says SetNull, while soft delete does not execute physical FK SetNull | Automatic detach behavior | Block delete with a named business failure rather than silently retaining a hidden referenced card. |

## Final Reconciliation

| Contract/path | Producer | Consumer | Final evidence | Status |
|---|---|---|---|---|
| Grid columns/actions | `TariffCardListVM` | typed Angular columns and shared action menu | `Id, Name, DiscountPercentage, FromDateTime, ToDateTime` align with Actions/Name/Discount/From/To | Confirmed |
| Paging | `TariffCardService.GetManyAsync` | list lazy-load state | clamped page/page size, deterministic newest-first query, `CountAsync`, `TotalCount` and `TotalPages` | Confirmed |
| Detail | `TariffCardDetailVM` and mapper | dialog patch | all six rendered business fields plus identity are returned | Confirmed |
| Add/Update | Add/Update VMs and service normalization | typed form payload | no tenant/audit/delete fields sent; name, conditional dates and conditional discount validated in both layers | Confirmed |
| Create/Edit/View | shared editor shell | parent list signals and child `closed` event | one list route, controlled modes, dirty close, successful mutation refresh | Confirmed |
| Delete | tenant-scoped service and shared confirmation | list row action | named confirmation, busy guard, billing-reference blocker, page correction and refresh | Confirmed |
| Failure handling | HTTP/business result contracts | list/editor alerts | `isSuccess: false` and transport error paths handled; all loading released in `finalize` | Confirmed |
| Date behavior | nullable `DateTime` API fields | calendars and grid formatter | conditional dates, `from <= to`, ISO date-time write and `dd/MM/yyyy HH:mm` display | Confirmed |
| Translations | matching `tariffCards` blocks | templates and confirmation options | English and Arabic keys present | Confirmed |
| Runtime wiring | route/menu/Layout provider | authenticated feature | list-only lazy route; one Layout provider entry; lookup consumers retain inherited `GetSelect` | Confirmed |
| Lookup cache | Company billing session cache | write/delete success paths | `tariffCards` session cache invalidated after successful mutation | Confirmed |
| Sorting | no backend sort contract | shared grid | no sortable column is advertised | Uncertain but non-blocking |
| Schema | EF configuration | owner migration | required `Name(50)`, `decimal(5,2)`, required/default-false `IsDeleted`, filtered unique tenant/name index | Owner action required |

No Tariff calculation or financial logic is owned by this feature, so no calculation change was made. Phase 04 remains skipped because no special state transition was introduced.
