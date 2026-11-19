# Lease Cost Setting — Shared Discovery and Contract Freeze

| Item | Decision |
|---|---|
| Review mode | Shared discovery, contract freeze, and shared-phase contract refactor |
| Review date | 2026-08-16 |
| Feature | Lease Cost Setting |
| Requested scope | `SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseCostSetting` and directly related Angular/.NET contracts |
| Phase status | Phases 0-6 complete at source level; contract remains **Frozen with approved reviewer assumptions** |
| Authority | `SIGMA_FEATURE_REVIEW_MASTER.md` v1.4, canonical UI/backend pattern books, current source |

## Governance and packet status

The read-only recipe check was run before using generated packets:

```text
F:\Shaban Documents\Shaban\sigma-erp\recipe-system\Generate-SigmaRecipes.ps1 -Check
```

It reported stale generated packets, including `PHASE-00-discovery-evidence.md`,
`PHASE-01-domain-api.md`, `PHASE-02-read-grid.md`, `PHASE-03-detail-write.md`,
`PHASE-05-integration-runtime.md`, and `PHASE-06-final-reconciliation.md`.
The canonical books were therefore authoritative; generated packets were read
only as derivative procedure references. No packet was regenerated or edited.

## Feature Review Manifest

| Item | Decision or evidence |
|---|---|
| Requested outcome | Establish shared discovery and freeze the frontend/backend contract before any independent layer review. |
| Frontend scope | `SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseCostSetting`; directly related `LeaseCostSettingItem`; route registration; `LayoutModule` providers; lease sidebar entry; English/Arabic vocabularies. |
| Backend scope | Lease Cost Setting and child entity, VM, EF configuration, AutoMapper, service/interface/controller files; generic service/controller/repository behavior consumed by the feature; CarModel and LeaseCostParameter lookup contracts. |
| Existing scoped changes | No pre-existing changes. This phase adds only the listed cross-layer contract refactors; scoped diff review is recorded below. |
| Supplied evidence | `C:\Users\user\Desktop\costsetting\1.PNG` through `4.PNG`; IDs E1–E4 below. Locale appears English/LTR; role, capture date, product version, and acceptance status are Unknown. |
| UI list shape | Canonical shared `app-data-table` with typed feature columns and server paging; approved references: `shared/components/data-table` and `Fleet/VehicleService/components/list`. Current `table-list` is legacy and conflicts with the target shape. |
| UI editor shape | Ordinary list-owned `app-editor-dialog`, one controlled modal for Create/View/Edit, with `app-editable-collection-table` for the cost rows. No tab requirement is evidenced. Approved references: shared editor dialog and `Fleet/VehicleService/components/details`. |
| Child collection shape | Feature-owned typed `FormArray` projected through `app-editable-collection-table`; removal uses the shared confirmation service. |
| Backend pattern | Pattern 2 — master-detail, no financial effect. Although named a setting, this screen creates one persisted header per make/model and edits child rows; it is not Pattern 4 whole-set settings synchronization. Approved backend reference: `SigmaBackend/SiGma.Business/Services/VouchersServices/PurchaseOrderService.cs`, with its documented FK-validation defect not copied. |
| Current routes | Angular exposes `LeaseCostSetting`, `LeaseCostSetting/details/:id`, and `LeaseCostSetting/create`. The screenshot and canonical CRUD-modal rule select one list route with internal `create | view | edit` mode; current route shape is therefore Conflicting. |
| Current API operations | Generic `LeaseCostSetting` CRUD, navigation list/detail, activate, and select routes from `SiGmaControllerBase`; exact handoff below. |
| Action inventory | Create, View, Edit, Delete, Save, Cancel, Add child, Remove child. No separate domain status transition is evidenced. Delete and Remove child remain risky actions and require Phase 4 treatment before implementation. |
| Permission mechanism | Authentication only: `[Authorize]` on the backend base controller and `AuthGuard` on the Angular layout. No permission service/directive exists. Visibility is not authorization. |
| Applicable phases | 0 and 1 applied. 2, 3, 4, 5, and 6 remain pending; downstream work must wait for a non-blocked handoff. |
| Explicit exclusions | No backend validation/paging service work, UI grid/dialog work, migration work, migration/snapshot edits, builds, tests, lint, browser/runtime/database verification, commits, or deployment. The separate child route was inspected as a competing direct contract but is not treated as the screenshot editor. |

## Functional evidence

### E1 — `1.PNG` — list state

| Classification | Required feature behavior | Owner | Guide-compliant representation |
|---|---|---|---|
| Explicit | Show Lease Cost Setting list with a Create New Record action, Actions column first, Make And Model, and Mark Up Percent. The captured state shows 10 rows per page and 13 total items. | Phase 0/2/5 | `app-feature-title` with translated Create action; one shared `app-data-table`; exact typed column order `Actions`, `Make And Model`, `Mark Up Percent`; server paging must return a real total. |

The visible values are sample content, not proof of the complete dataset, sort
contract, export contract, or filter contract.

### E2 — `2.PNG` — row action menu open

| Classification | Required feature behavior | Owner | Guide-compliant representation |
|---|---|---|---|
| Explicit | The row action surface exposes View, Edit, and Delete. | Phase 0/3/4 | Shared table `ActionList[]`; View/Edit open the same controlled editor in the corresponding mode; Delete uses a shared confirmation and a guarded request. Visibility does not establish authorization. |

### E3 — `3.PNG` — Create editor

| Classification | Required feature behavior | Owner | Guide-compliant representation |
|---|---|---|---|
| Explicit | Create state shows Make and Model, MarkUp Percent, Vehicle Cost, a Cost Parameter collection, From Year, To Year, Rate Type, Rate, Add controls, and Save/Cancel. Multiple parameter rows are visible before Save. | Phase 0/1/3 | One `app-editor-dialog` in Create mode; typed parent form; shared editable collection table for rows; translated labels and validation; Save/Cancel owned by the shared editor shell. |

The screenshot does not prove that every row is required, that the complete
parameter catalog is always prepopulated, or that the captured modal width is a
design contract.

### E4 — `4.PNG` — Update editor

| Classification | Required feature behavior | Owner | Guide-compliant representation |
|---|---|---|---|
| Explicit | Update state shows read-only header identity/summary values, editable cost rows, Add and Remove row controls, and Save/Cancel. | Phase 0/3/4 | Same controlled editor shell in Edit mode; editable collection remains feature-owned; Remove confirms before mutation; View mode is read-only and hides Save. |

The visible `From Year`/`To Year` values, including zeroes and apparent reversed
ranges, are sample evidence only. Their business semantics and validation are
Uncertain.

## Grid column and ListVM contract

The target column list is written beside the target ListVM scope, as required by
Master Guide block 4:

| Grid column or action need | Frontend property | Target backend ListVM property | Status and evidence |
|---|---|---|---|
| Actions | Shared table action column; no row property | `Id` only for action target | Derived from the shared table pattern and E2; current `actions: 'Actions'` mapper field must not become a DTO field. |
| Make And Model | `makeAndModelName` | `MakeAndModelName` | Derived from confirmed `MakeAndModelId` plus `CarModel.Name`/`CarModel.Make.Name`; current nested `MakeAndModel` is over-wide and the exact flattened API property is not present. |
| Mark Up Percent | `markUpPercent` | `MarkUpPercent` | Confirmed by screenshot, Angular model, and backend ListVM. |
| Row action target | `id` | `Id` | Confirmed identity requirement. |

`VehicleCost`, `MakeAndModel` detail navigation, and `LeaseCostSettingItems`
must not remain in a grid ListVM unless a displayed row or action consumes them.
The current `LeaseCostSettingListVM` includes those over-scoped values.

| Visible label | Proposed field | Current source field | Display transformation | Filterable | Sortable | Exported | Confidence |
|---|---|---|---|---|---|---|---|
| Actions | Shared action column | None | Shared table renders actions from row id | Not applicable | Not applicable | Uncertain | Confirmed action need |
| Make And Model | `makeAndModelName` | `MakeAndModel.Name` and `MakeAndModel.Make.Name` are available through the current navigation VM | Backend projection/flattening; one owner only | Unconfirmed | Unconfirmed | Unconfirmed | Derived; target field missing |
| Mark Up Percent | `markUpPercent` | `MarkUpPercent` | None | Unconfirmed | Unconfirmed | Unconfirmed | Confirmed field, interaction contract missing |

The screenshots show pagination, but current Angular calls
`GET /LeaseCostSetting/GetAllWithNavigations`, which is unpaged and returns no
`TotalCount`. The legacy table paginates the loaded array. This is a confirmed
read-contract conflict, not an acceptable frozen server-paging contract.

## Frontend/Backend Contract Handoff

### Status

**Frozen with approved reviewer assumptions.** The user approved conservative
reviewer assumptions on 2026-08-16. The assumptions below are explicitly
labelled and are the contract for the next Backend and Frontend phases. They
must be reopened if the owner later supplies a different business rule.

### Current API operation inventory

| Operation | Current method and route | Current request | Current response | Current behavior |
|---|---|---|---|---|
| List | `GET /LeaseCostSetting/GetAllWithNavigations` | None | `Results<LeaseCostSettingListVM>` | Unpaged; navigation graph loaded; no real total metadata. Angular calls this route. |
| Canonical list candidate | `GET /LeaseCostSetting` | `ListSmBase`: `PageNo`, `PageSize`, `Filters[key]` | `Results<LeaseCostSettingListVM>` | Base service can bind the route, but current inherited implementation does not set `TotalCount`/`TotalPages` and does not provide the target flattened row contract. |
| Detail | `GET /LeaseCostSetting/GetByWithNavigationsId/{id}` | `id: int` | `Result<LeaseCostSettingDetailVM>` | Deep, read-only navigation load; current Angular uses this for the routed page. |
| Add | `POST /LeaseCostSetting` | `LeaseCostSettingAddVM` | `Result` | Generic graph add; repository overwrites tenant on parent and children; one save. No feature FK/range/duplicate validation. |
| Update | `PUT /LeaseCostSetting` | `LeaseCostSettingUpdateVM` | `Result` | Generic tracked child reconciliation; one save. Update VM inherits compatibility `SubscriptionId`/`No`, but those are server-owned. Child parent ownership and duplicate/range validation are not explicit. |
| Delete | `DELETE /LeaseCostSetting?id={id}` | `id: int` | `Result` | Generic soft delete. Inbound references and child delete semantics are not feature-audited. UI has no confirmation. |
| Activate | `POST /LeaseCostSetting/handleActivate` | `ActiveVm` | `Result` | Generic inherited operation; not evidenced in the screenshots and not in the target action menu. |
| Select | `GET /LeaseCostSetting/GetSelect` | None | `Results<DropdownDto>` | Generic route exists but is not used by this screen. |
| Make/model lookup currently used | `GET /CarModel` | `ListSmBase` | `Results<CarModelListVM>` | Controller overrides the base list to call navigation list. Angular types it as `Results<CarMakeDTO>`. |
| Make/model lookup available | `GET /CarModel/GetMakeAndModel` | None | Bare `IEnumerable<DropdownDto>` | Backend custom lookup exists but Angular does not call it and its bare-array shape differs from the shared `Results<T>` expectation. |
| Cost parameter lookup currently used | `GET /LeaseCostParameter` | No page/filter values from the form | `Results<LeaseCostParameterListVM>` | Custom service defaults to page size 20; the editor lookup can silently truncate a larger parameter catalog. |
| Cost parameter lookup available | `GET /LeaseCostParameter/GetSelect` | None | `Results<DropdownDto>` | Base endpoint exists; adoption needs a typed Angular contract and label decision. |
| Standalone child CRUD | `/LeaseCostSettingItem` generic CRUD routes | Child VM has no parent setting id | Child CRUD wrappers | Competing direct route; the child entity/VM exposes no parent FK, so this path cannot prove aggregate ownership. It is not a safe substitute for parent graph writes. |

### Request contract

| Contract | Frozen target input | Server-owned/excluded | Status |
|---|---|---|---|
| Add parent | `makeAndModelId: number`; `markUpPercent: decimal`; `vehicleCost: decimal`; `leaseCostSettingItems: LeaseCostSettingItemAdd[]` | `id`, `subscriptionId`, `No`, audit, soft-delete, activity, and validity fields | Frozen; make/model and at least one child row are required. |
| Add child | `costParameterId: number`; `fromYear: number`; `toYear: number`; `rateType: ChargeRateType`; `rate: decimal` | Parent setting id is server-owned through the parent graph; tenant/audit fields excluded | Frozen; year endpoints are non-negative and zero is an open/unspecified boundary. |
| Update parent | `id: number`; same editable parent fields; `leaseCostSettingItems: LeaseCostSettingItemUpdate[]` | `subscriptionId`, `No`, audit, soft-delete, activity, validity, and calculated/server state | Frozen; update child ids are reconciled only within the edited parent. |
| Update child | `id: number` for existing rows plus the child editable fields | Parent id and tenant are server-owned; child id must belong to the edited parent | Frozen; foreign child ids are rejected. |

### Response contract

| Contract | Frozen target output | Status |
|---|---|---|
| Grid row | `id`, `makeAndModelName`, `markUpPercent` | Frozen flattened projection; no child collection, vehicle cost, audit fields, or nested navigation in the grid payload. |
| Detail | `id`, `makeAndModelId`, rendered make/model label, `markUpPercent`, `vehicleCost`, and child rows containing `id`, cost parameter identity/label, `fromYear`, `toYear`, `rateType`, and `rate` | Frozen minimal editor response; labels are typed nullable lookup projections. |
| Child row | `id`, `costParameterId`, optional rendered cost parameter label, `fromYear`, `toYear`, `rateType`, `rate` | Frozen; no `any`, tenant, audit, or parent-navigation fields in the child contract. |
| Lookups | Typed, complete, tenant-scoped make/model and cost-parameter options; enum options use numeric backend enum values and translated display labels | Frozen to source-compatible numeric `ChargeRateType` wire values and typed select responses. |

### Failure behavior

The backend base controller returns HTTP 200 for `isSuccess: true` and HTTP 400
(or the declared status code) with the same `Result`/`Results<T>` body for
`isSuccess: false`. Transport failures arrive through Angular's `error` callback
and must preserve a safe `error.message` before a translated fallback.

The current Lease Cost Setting components do not consistently handle the error
callback or display the returned message. This is a downstream Phase 2/3/5
finding, not permission to change the response contract during this freeze.

### Domain ownership and persistence

| Concern | Frozen decision/evidence |
|---|---|
| Tenant and soft delete | Backend repository applies authenticated `SubscriptionId` and excludes deleted rows; Add/Update overwrite tenant values recursively. Client tenant fields are not authoritative. |
| Child reconciliation | Generic `Service.UpdateAsync` loads the tracked aggregate and reconciles collection rows before one `SaveChangesAsync`. The target remains aggregate Save, not standalone child writes. |
| Transaction | Add and Update each reach one save on one scoped `DbContext`; EF Core implicit transaction is sufficient. No explicit transaction is currently justified. Runtime verification remains owner work. |
| Calculations | No derived total is shown in the evidence. Markup percent, vehicle cost, and row rates remain user inputs unless a business owner confirms a server calculation. The client must not become the calculation owner. |
| Authorization | Backend `[Authorize]` is the only confirmed authorization boundary. No Angular permission API may be invented. |
| Mapping | Current profiles use `ReverseMap()` and map nested navigation/write shapes broadly. Canonical target mapping is four explicit one-way maps per entity; no `Ignore()` chain unless a genuine shape difference is proven. This is a Phase 1 implementation finding. |
| Overrides | `LeaseCostSettingService` and `LeaseCostSettingItemService` have no overrides and inherit generic behavior. `LeaseCostParameterService` overrides list/add/update/delete for paging, name/order validation, and reference blocking; each is feature-specific. |

## Required decisions and unresolved register

| ID | Requirement/decision | Status | Evidence or exact decision needed | Owner/block |
|---|---|---|---|---|
| U1 | One setting per make/model within a tenant | Uncertain | Screenshot suggests one row per make/model, but no current duplicate rule or unique index exists. Confirm whether `(SubscriptionId, MakeAndModelId)` is the business key. | Phase 1; blocks duplicate validation and migration decision |
| U2 | Child row uniqueness and overlap | Uncertain | Multiple rows share a cost parameter in E4. Define whether duplicate/overlapping `(CostParameter, FromYear, ToYear, RateType)` rows are rejected, merged, or allowed. | Phase 1; blocks validation/index design |
| U3 | Year semantics | Uncertain | E4 shows values such as `1 → 0` and `3 → 0`. Confirm whether zero is a sentinel, whether reversed ranges are legal, and whether equal boundaries are legal. | Phase 1/3 |
| U4 | RateType wire representation | Conflicting | Angular local enum uses display strings such as `Per Year` and `Percent Per Year`; backend enum members are `PerYear` and `PercentPerYear`; current dropdown sends the Angular enum value. Freeze numeric or stable string wire values and translated labels. | Phase 1/3; blocks payload compatibility |
| U5 | List paging and total | Conflicting | E1 shows paging; current Angular calls unpaged `GetAllWithNavigations`, and current generic navigation response has no total count. Freeze server-side `PageNo`/`PageSize`, exact total, stable ordering, and any filter key. | Phase 1/2 |
| U6 | Grid display field | Missing/Derived | Current API returns nested `MakeAndModel`; current UI creates `makeAndModelDetailsPath`. Freeze a typed `MakeAndModelName` projection or an explicitly approved nested shape. | Phase 1/2 |
| U7 | Lookup routes and shapes | Conflicting | Current UI calls `GET /CarModel` and paged `GET /LeaseCostParameter`; backend exposes purpose-built lookup routes with different response shapes. Choose complete typed lookup operations. | Phase 1/3/5 |
| U8 | Create-row initialization | Conflicting | E3 visibly starts with many parameter rows; current `initForm()` creates an empty FormArray and only adds rows after an Add click. Confirm prepopulate-all-parameters versus user-added rows. | Phase 0/3 |
| U9 | Minimum detail count and required fields | Missing | Add VMs do not require make/model or at least one child; child VMs have no range/enum validation. Confirm required fields and minimum row count. | Phase 1/3 |
| U10 | Parent delete and child lifecycle | Missing | Parent delete is inherited soft delete; relationship/delete behavior is not explicit in the feature EF configuration. Confirm whether owned rows are soft-deleted/cascaded and whether any external references block deletion. | Phase 1/4 |
| U11 | Standalone child route | Conflicting | `LeaseCostSettingItem` has a registered route/controller but no parent id in its VM/entity. Decide whether it is retired, separately parented, or removed from the supported contract. | Phase 1/5 |
| U12 | Modal versus routed editor | Conflicting | E2–E4 show a modal workflow; canonical CRUD rule selects one list route and internal modes, while current routes are `details/:id` and `create`. | Phase 0/3/5 |
| U13 | Delete/remove confirmation and dirty discard | Missing in current source | E2/E4 expose risky actions. Freeze shared confirmation for parent Delete and child Remove, and dirty discard for editable modal state. | Phase 3/4 |
| U14 | Feature translations | Partial | Field labels exist in both `en.ts` and `ar.ts`; title, subtitle, loading, empty, error, confirmation, discard, and page-report keys for the canonical workflow are not present in the current feature block. | Phase 3/5 |

### Approved reviewer-assumption overrides

The user approved these conservative assumptions on 2026-08-16. They supersede
the initial Missing/Conflicting labels above for downstream implementation:

| ID | Frozen assumption |
|---|---|
| U1 | `(SubscriptionId, MakeAndModelId)` is the tenant-scoped parent business key; backend validation rejects duplicates. No unique index is added in this phase because migrations are out of scope. |
| U2 | Exact duplicate child signatures are rejected within a parent. Overlap is rejected when both ranges are finite; a zero endpoint is an open/unspecified legacy boundary. |
| U3 | Years are non-negative integers; zero is an open/unspecified boundary; equal finite boundaries are valid; a finite `FromYear > ToYear` is invalid. |
| U4 | Preserve the backend default numeric enum wire representation (`0..4`); Angular enum values are numeric identifiers and labels are translated separately. |
| U5 | Use `GET /LeaseCostSetting` with `PageNo`/`PageSize`, stable `Id` ascending order, no filter until evidenced, and exact `TotalCount`/`TotalPages`. |
| U6 | Return a flattened typed `MakeAndModelName` projection beside `Id` and `MarkUpPercent`; no navigation graph is part of the grid row. |
| U7 | Make/model uses `GET /CarModel/GetMakeAndModel`; cost parameters use `GET /LeaseCostParameter/GetSelect`; both are typed and complete for the editor. |
| U8 | Create starts with one empty child row; users add additional rows. Screenshot rows are treated as examples, not proof of prepopulation. |
| U9 | Make/model and parent numeric fields are required; at least one child is required; child parameter, years, rate type, and rate are required. |
| U10 | Parent delete remains soft delete; owned children follow aggregate deletion; only external references block deletion. |
| U11 | Standalone child CRUD is not part of the supported contract; parent graph writes are authoritative. Its route remains untouched until the integration phase removes or deprecates it safely. |
| U12 | Use one list route and one controlled `app-editor-dialog` for create/view/edit; separate create/details navigation is replaced in the Frontend phase. |
| U13 | Parent Delete and child Remove use shared confirmation; dirty editable modal close uses shared discard confirmation. |
| U14 | Preserve existing field keys and add canonical title, subtitle, loading, empty, error, page-report, confirmation, discard, and validation keys in English and Arabic. |

## Phase decisions from Master Guide block 4

| Decision | Frozen decision | Evidence/status |
|---|---|---|
| Canonical reference | Shared data table + Fleet list integration; shared editor dialog + Fleet details; shared editable collection table; shared confirmation service. | Canonical UI reference-per-shape table; screenshots supply functional content only. |
| Editor shape | One controlled ordinary CRUD modal with one parent form and an editable collection; no tabs unless a later business decision confirms peer sections. | E3/E4 show one continuous editor and collection; canonical modal rule. |
| Route count | Target list route only; mode is internal `create/view/edit`. | Canonical modal rule; current three-route source is conflicting. |
| Grid columns | Actions, Make And Model, Mark Up Percent. | E1 and current `initCols`; target must use typed shared columns. |
| ListVM scope | `Id`, derived `MakeAndModelName`, `MarkUpPercent`; no vehicle cost or child collection. | E1 plus block 7 scope rule; current ListVM is over-scoped. |
| Add/Update scope | Client-editable parent and child fields only; exclude tenant/audit/soft-delete/calculated fields. | Add/Update base contracts and repository ownership rules. |
| Detail scope | Only fields rendered by the modal and child collection. | E3/E4; current base audit/navigation surface is over-wide. |
| Style ownership | Feature-prefixed structural styles; shared primary/dialog/table tokens; RTL and dark tokens owned by canonical shared components/feature boundary. | Canonical UI blocks 24–25; current feature SCSS is empty. |
| Confirmation | Parent Delete and child Remove require shared confirmation; Save/Update do not. | E2/E4 plus canonical action/confirmation rules. |
| Dirty discard | Required for editable modal state; clean/view state closes silently. | Canonical modal dirty-close rule. |
| Backend pattern | Pattern 2 master-detail, no financial effect. | Persisted parent + child graph; no journal/allocation behavior. |
| Entity base | `EntityBase` for setting and item; `EntityBaseWithName` for cost parameters. | Current entities and canonical entity-base table. |
| Duplicate key | `(SubscriptionId, MakeAndModelId)` is the logical parent key; child exact signatures are unique within the parent, with finite overlap rejected. | Approved reviewer assumptions; backend validation is a later phase and no migration is created here. |
| FK/delete checks | Required for make/model, cost parameter, child-parent ownership, and external delete dependencies; owned children are not blockers. | Canonical validation rules plus approved U10 assumption. |
| Filter contract | No screenshot-proven filter. Canonical list still requires exact paging keys and total; any search key remains to be decided. | Current `hasCustomSearch=false`; current API navigation list is unpaged. |
| Translations | Existing field labels are present in English and Arabic; canonical workflow keys are missing. | Current vocab blocks inspected. |
| Service registration | Confirmed in `LayoutModule.providers`; preserve interceptor-enabled client scope. | Current provider/import entries. |
| Migration | No migration for this review. Future unique indexes, explicit relationship/delete behavior, or precision changes require owner-run `Add-Migration`. | Migration boundary; no migration command or file edit performed. |
| Reference action coverage | CRUD actions inventoried; no domain transition action is applicable from supplied evidence. Delete/remove remain Phase 4 conditional actions. | E2/E4 and current generic route surface. |
| Override audit | Parent and child services inherit generic methods; cost-parameter service overrides list/add/update/delete for its own rules. | Scoped `override` search and service source. |

## Findings for downstream review

| ID | Finding | Severity/confidence | Evidence | Required owner |
|---|---|---|---|---|
| F1 | Legacy `table-list` is used instead of the mandatory shared `app-data-table`; current list has no typed server paging or real total. | Contract/correctness — Confirmed | Parent list template/TS; E1 | Phase 2/5 |
| F2 | Current ListVM includes navigation, child collection, and vehicle cost not displayed in E1. | Performance/contract — Confirmed | `LeaseCostSettingListVM`; E1 | Phase 1/2 |
| F3 | Current list action menu contains only a no-op Delete callback; E2 requires View/Edit/Delete. | Behavior — Confirmed | Parent list `moreActions`; E2 | Phase 3/4 |
| F4 | Current editor is routed and not the screenshot modal; there is no explicit View route/mode and Update is a page button. | Consistency/behavior — Confirmed | Routes/details component; E2–E4 | Phase 3/5 |
| F5 | Create initializes an empty child array, while E3 shows multiple initial rows. | Behavior — Confirmed | `initForm()` and E3 | Phase 0/3; resolve U8 |
| F6 | Car-model and cost-parameter lookups use list endpoints and incompatible DTO/wrapper assumptions instead of a frozen complete lookup contract. | Contract — Confirmed | Parent service/details; CarModel controller/service; U7 | Phase 1/3 |
| F7 | Rate type uses incompatible display strings between Angular and backend enum identifiers. | Contract/correctness — Confirmed | Angular `ChargeRateTypeEnum`; backend `ChargeRateType`; U4 | Phase 1/3 |
| F8 | Frontend sends subscription/audit-shaped fields in write models; these are server-owned and must be excluded from target payloads. | Security/contract — Confirmed | Parent create model/details; `EntityBase`/VM bases/repository | Phase 1/3 |
| F9 | Parent/item services have no feature validation for FK existence, child ownership, ranges, enum validity, duplicates, or minimum rows. | Correctness — Confirmed | Empty target services and VMs; canonical backend blocks | Phase 1 |
| F10 | No explicit unique index or business key exists for one setting per model or duplicate child ranges. | Data correctness — Uncertain business rule, confirmed absence of source rule | EF config/entities; U1/U2 | Phase 1; owner decision |
| F11 | Standalone `LeaseCostSettingItem` API/route has no parent setting id in its contract, creating a competing orphan-prone write path. | Data integrity — Confirmed | Child entity/VM/controller/route | Phase 1/5; resolve U11 |
| F12 | Error callbacks, actionable failure messages, dirty discard, and confirmations are incomplete in the current parent editor. | Behavior/accessibility — Confirmed | Parent list/details subscriptions and actions; canonical UI lifecycle rules | Phase 3/4/5 |

## Phases and verification boundary

### Shared-phase refactors applied

- Angular `ChargeRateTypeEnum` now uses the backend-compatible numeric enum
  values `0..4`.
- Angular Lease Cost Setting list/detail/write models now expose the frozen
  typed fields and omit client-owned tenant/audit fields from write payloads.
- Backend Lease Cost Setting list/detail and child contracts now expose the
  flattened display names and explicit validation annotations agreed in the
  frozen contract.
- Backend Lease Cost Setting and child AutoMapper profiles now use explicit
  one-way maps; no `ReverseMap()` was added.

Backend validation, aggregate reconciliation, paging/total calculation,
lookup endpoint adoption, dialog/grid migration, confirmations, translations,
and route cleanup remain owned by the later named phases.

- Phase 0 Discovery and Evidence: **Applied and complete**. Evidence IDs,
  classifications, scope, shape selections, action inventory, and unresolved
  requirements are recorded here.
- Phase 1 Domain, Persistence, and API: **Applied and frozen with approved
  reviewer assumptions**. Exact list, detail, write, lookup, enum, paging,
  ownership, and lifecycle contracts are recorded above.
- Phase 2 Read/Grid: **Applied and complete at source level**; the frozen
  server-paged read contract and canonical shared grid are implemented.
- Phase 3 Detail/Write: **Applied and complete at source level**; the aggregate
  write boundary and controlled typed editor are implemented.
- Phase 4 Domain Actions: **Applied for the evidenced actions**; parent Delete,
  child Remove, and dirty-close confirmations are implemented. No additional
  domain transition was evidenced.
- Phase 5 Integration/Runtime: **Applied at source level**; the list route,
  menu/provider/interceptor wiring, translations, and standalone child-route
  removal were reconciled. Runtime execution remains owner verification.
- Phase 6 Final Reconciliation: **Applied and complete at source level**; the
  complete scoped frontend/backend diff and frozen contracts were compared.

Source-only checks completed:

- Scoped frontend and backend Git status was clean before this phase.
- Source-only diff review was performed after the contract refactor; final
  cross-phase reconciliation remains pending.
- Direct route, provider, menu, translation, model, DTO, service, controller,
  mapping, repository, and generic endpoint paths were inspected.

Not performed, by instruction: build, tests, lint, browser/application
verification, runtime/network/header verification, database commands, migration
commands, commits, pushes, and deployment.

## Backend review — applied

The Backend review was run against the frozen contract on 2026-08-16. Backend
findings were refactored in the scoped .NET contracts, mappings, services, and
lookup boundary. The Frontend review is now applied; final reconciliation
remains pending.

### Backend changes

- `LeaseCostSettingService` now owns the Pattern 2 aggregate boundary. Add and
  Update validate the make/model foreign key, tenant-scoped duplicate parent
  key, required child collection, child foreign keys, non-negative numeric
  values, enum validity, exact duplicate ranges, and finite range overlap.
- Update explicitly reconciles children inside the loaded parent: existing
  child ids must belong to that parent, duplicate submitted ids are rejected,
  omitted active children are soft-deleted, and new/updated rows are written
  through the parent aggregate in one `SaveChangesAsync` call.
- Parent Delete soft-deletes active owned children and the parent in the same
  save. No external reference was found in the scoped source, so no additional
  delete blocker was invented.
- The canonical `GET /LeaseCostSetting` list now uses stable `Id` ascending
  order, clamps page inputs, projects only the frozen list fields, and returns
  exact `TotalCount` and `TotalPages`. The legacy navigation-list route remains
  available for compatibility and is not the frozen frontend contract.
- `GET /CarModel/GetMakeAndModel` now returns a complete typed `Results<DropdownDto>`
  response. `GET /LeaseCostParameter/GetSelect` now returns a complete,
  ordered, tenant-scoped typed result, including an empty-success response.
- Parent and child AutoMapper profiles remain explicit one-way maps. Aggregate
  Update assigns child editable fields explicitly so client compatibility fields
  such as `SubscriptionId` and `No` are not copied into tracked children.

### Backend review decisions and deferrals

| Decision | Evidence and result |
|---|---|
| Grid/ListVM | Grid columns are `Actions`, `Make And Model`, and `Mark Up Percent`; `LeaseCostSettingListVM` is exactly `Id`, `MakeAndModelName`, and `MarkUpPercent`. |
| Parent uniqueness | Approved U1 assumption; service validation enforces the tenant-scoped logical key. No database unique index was added because migrations are out of scope. |
| Child ranges | Approved U2/U3 assumptions; service rejects exact duplicates, rejects finite overlaps, allows zero as the open/unspecified boundary, and rejects finite reversed ranges. |
| Aggregate ownership | Approved U10/U11 assumptions; parent graph writes are authoritative, child ownership is checked on Update, and the standalone child route remains untouched until integration safely removes or deprecates it. |
| Transaction | Add, Update, and Delete use one scoped `DbContext` save; EF implicit transaction remains sufficient. |
| Calculations | No server-derived total was evidenced; no client-calculated or new persisted calculation was introduced. |
| Mapping | Explicit one-way maps are retained; no `ReverseMap()` or unnecessary ignore chain was added. |
| Migration | None required for this source-only phase. A future unique index or relationship/schema change requires the owner to run `Add-Migration`. |

### Backend files changed in this phase

- `SiGma.Business/Services/LeaseCostSettingService.cs`
- `SiGma.Business/Services/LeaseCostParameterService.cs`
- `SiGma.Business/Services/CarModelService.cs`
- `SiGma.Business/IServices/ICarModelService.cs`
- The already-frozen Lease Cost Setting and child VM/mapping files listed in
  the shared-phase section were retained and reviewed; no frontend files were
  changed by this Backend phase.

### Backend source verification

`git diff --check` is clean and the scoped source has no merge markers or
`ReverseMap()` usage in the feature mappings. Builds, tests, lint, runtime/API,
browser, and database verification were not run by instruction. Generated
packets remain stale according to the required drift check and were not edited.

## Frontend review — applied

The Frontend review was run against the frozen contract on 2026-08-16. The
Angular feature was refactored to the selected canonical list and editor
shapes. Final reconciliation is recorded below.

### Frontend changes

- Replaced the legacy `table-list` implementation with one shared
  `app-data-table`, typed server paging, guarded View/Edit/Delete actions, real
  total-record handling, stale-request cancellation, loading/failure states,
  empty state, and refresh after successful mutation.
- The grid column list is exactly `Actions`, `Make And Model`, and `Mark Up
  Percent`; the matching ListVM properties are exactly `Id`,
  `MakeAndModelName`, and `MarkUpPercent`.
- Replaced routed Create/Update pages with one list-owned controlled
  `app-editor-dialog` supporting Create, View, and Edit modes. View disables
  the typed form and exposes Edit; editable dirty close uses the shared discard
  confirmation.
- Added a typed parent form and typed `FormArray` child rows projected through
  `app-editable-collection-table`. Add and Remove use the shared action and
  confirmation patterns; Save handles both `isSuccess: false` and transport
  errors.
- Wired the frozen complete lookup routes
  `GET /CarModel/GetMakeAndModel` and `GET /LeaseCostParameter/GetSelect` with
  numeric enum options and translated labels. Child validation covers required
  fields, non-negative numeric values, range order, minimum row count, exact
  duplicate ranges, and finite overlaps under the approved zero-boundary
  semantics.
- Reduced the feature route to the list route; Create/View/Edit are now
  internal editor modes. Final reconciliation also removed the standalone
  child UI route and made its direct backend Add/Update/Delete operations
  return a business failure per U11.
- Added English and Arabic feature keys for titles, actions, paging, states,
  validation, errors, confirmations, and rate-type labels.

### Frontend decisions and verification

| Decision | Evidence and result |
|---|---|
| List shape | Canonical shared data table selected from the UI pattern book; E1/E2 require the three columns and View/Edit/Delete actions. |
| Editor shape | Canonical controlled editor dialog selected from the UI pattern book; E3/E4 require the parent fields and editable child collection. |
| Navigation | One list route with internal `create | view | edit` state; this resolves the frozen U12 route conflict without changing backend endpoints. |
| Confirmation | Shared confirmation service is used for parent delete, child removal, and dirty close; no browser confirmation was introduced. |
| Error/loading | List and editor handle business failure and transport error channels, show translated fallback messages, and finalize loading state. |
| Translation | New feature keys were added to both `en.ts` and `ar.ts`; no other vocabulary stub was changed. |
| Mapping/calculation | No frontend mapping broadening or client-owned calculated total was introduced. Numeric wire values follow the frozen backend enum contract. |
| Migration | None required for the frontend phase. Any future database uniqueness/schema decision remains an owner `Add-Migration` responsibility. |

### Frontend source verification

The scoped frontend diff was reviewed, `git diff --check` is clean, and the
feature has no remaining `table-list`, legacy routed editor, old lookup route,
merge markers, `console.log`, or empty transport error callback. Builds, tests,
lint, browser/application, runtime/API, and database verification were not run
by instruction. Generated packets remain stale according to the required drift
check and were not edited.

## Final reconciliation — complete

Final reconciliation was run on 2026-08-16 against the frozen U1-U14 contract,
the complete scoped Angular and .NET diffs, and current route/provider/repository
behavior. Completion is source-only; owner build and runtime verification remain
pending by instruction.

### Contract comparison

| Boundary | Frozen decision | Final source result |
|---|---|---|
| Screenshot E1 list | Create action; Actions, Make And Model, Mark Up Percent; paging | Implemented with `app-feature-title` and `app-data-table`; screenshot data values remain examples only. |
| Screenshot E2 actions | View, Edit, Delete | Implemented as guarded row actions; Delete uses the shared confirmation service. |
| Screenshots E3/E4 editor | Make/model, markup, vehicle cost, editable cost rows, Save/Cancel, add/remove | Implemented in one controlled `app-editor-dialog` with a typed parent form and typed editable collection. |
| Grid columns beside ListVM | `Actions` (uses `Id`), `MakeAndModelName`, `MarkUpPercent` | Backend ListVM is exactly `Id`, `MakeAndModelName`, `MarkUpPercent`; Angular row model and columns match exactly. |
| Paging | `GET /LeaseCostSetting`; `PageNo`, `PageSize`; stable Id ascending; exact totals | Implemented with server paging, clamped inputs, exact `TotalCount`/`TotalPages`, and stale-request cancellation. No unevidenced filter was added. |
| Detail | Parent rendered fields plus child rendered fields only | Feature service now overrides the inherited deep loader with a tenant-matched, soft-delete-filtered projection ordered by child Id. |
| Create payload | `MakeAndModelId`, `MarkUpPercent`, `VehicleCost`, child editable fields | Angular payload and backend feature VM fields match; server-owned tenant/audit fields are not sent. |
| Update payload | Create fields plus parent Id and child Id | Angular payload and backend aggregate reconciliation match; child ownership and duplicate submitted ids are validated. |
| Enum | Numeric `0..4` | Angular and .NET enum order match; translated labels are separate from wire values. |
| Lookups | Complete typed make/model and cost-parameter results | `CarModel/GetMakeAndModel` and `LeaseCostParameter/GetSelect` return typed complete result wrappers, including empty-success metadata. |
| Validation | U1-U3 and U9 | Backend is authoritative for foreign keys, parent duplicate key, required children, enum, non-negative values, finite range order/overlap, and exact duplicates; Angular mirrors actionable validation. |
| Persistence | Pattern 2 aggregate; one save | Add/Update/Delete use one scoped DbContext save. Update reconciles tracked children without re-marking removed rows as modified; EF implicit transaction is sufficient. |
| Delete and removal | Parent soft-delete with owned children; shared confirmations | Parent and active children are soft-deleted in one save; UI confirms parent Delete and child Remove. |
| Standalone child path | Unsupported; parent graph authoritative | Angular route registration was removed. Direct child Add/Update/Delete return business failure; compatibility read/activate controller surface remains inherited but has no owning UI. |
| Route/mode | One list route; internal create/view/edit | Implemented. Sidebar points to `/LeaseCostSetting`; no separate parent create/detail or child UI route is registered. |
| Auth/providers/interceptors | Preserve current authenticated runtime | Backend base controller retains `[Authorize]`; Angular remains under guarded layout routing; the existing root/layout HttpClient uses token and error interceptors. No permission API was invented. |
| Failures/loading | Business and transport channels | List, detail, lookups, save, and delete expose guarded loading/error states and handle both applicable channels. |
| Translation/style | English/Arabic; accessible responsive RTL/theme-compatible structure | All consumed feature keys exist in both vocabularies. Feature-prefixed structural SCSS uses logical spacing, dark-theme selectors, responsive layout, labels, alerts, focus and invalid states. |

### Final-phase corrections

- Preserved tracked child Deleted state by removing the aggregate-wide
  repository Update call; new children receive the authenticated parent's
  tenant before the single save.
- Replaced inherited deep detail loading with the exact tenant-matched detail
  projection, avoiding a wider recursive graph and cross-tenant child leakage
  if historical data is inconsistent.
- Removed the standalone child Angular route and rejected direct child
  Add/Update/Delete operations at the backend boundary.
- Made the detail enum contract typed, initialized the backend detail child
  collection, retained lookup-name fallbacks, and ensured the initial create
  row does not incorrectly mark a pristine editor dirty.
- Added the missing English and Arabic Create editor title and kept the
  PrimeNG options array mutable to resolve the reported readonly-template
  compile error.

### Override, mapping, and calculation audit

| Area | Final decision |
|---|---|
| Parent list override | Required for minimal projection, stable paging, and exact totals. |
| Parent detail override | Required for exact projection and tenant-matched child reads. |
| Parent Add/Update/Delete overrides | Required for aggregate validation, explicit child reconciliation, ownership, and aggregate soft-delete. |
| Child write overrides | Required to reject the unsupported competing write path. |
| Lookup overrides/methods | Required for complete typed editor options. |
| AutoMapper | Explicit one-way maps only; no `ReverseMap()` or unnecessary ignore chain. Tracked aggregate Update assigns editable fields explicitly. |
| Calculations | No derived total or financial posting is evidenced. No client-owned or new persisted calculation was introduced. |
| Transaction | One `SaveChangesAsync` per complete aggregate operation; no explicit transaction is needed. |

### Remaining exceptions and risks

- The generated Phase 0-6 packets remain stale according to the mandatory
  drift check. Canonical books and the Master Guide were used; generated files
  were not edited and must be regenerated and semantically reviewed by their
  owner.
- U1 is enforced in the service but not by a database unique index. Concurrent
  duplicate creates remain possible until an owner-approved schema change is
  made.
- Shared generic base constraints leave compatibility tenant/audit members on
  backend Add/Update/Detail VM base types. The Angular feature neither sends
  nor consumes them, and feature services do not trust them. Removing them
  requires a broader shared-controller contract change and was not invented in
  this scope.
- The inherited standalone child `handleActivate` and read endpoints remain a
  compatibility surface because the generic action is non-virtual. They have
  no registered Angular route and are not part of the supported feature
  workflow; removing them safely requires broader controller routing work.
- Screenshot locale is English/LTR; role, capture version/date, and formal
  acceptance remain Unknown. No blocking Missing or Conflicting functional
  requirement remains under the approved U1-U14 assumptions.
- Build, test, lint, API/runtime, browser, and database behavior are not
  verified in this source-only workflow.

### Migration and verification boundary

No entity or EF configuration file changed, so no migration is required for
this diff. If the owner later approves the tenant-scoped unique index or an
explicit relationship/schema change, the owner must run `Add-Migration` for
that separate change.

The complete scoped frontend/backend diffs were reviewed. `git diff --check`
is clean; scoped searches found no merge markers, feature `any`, stale legacy
table/editor/lookup routes, empty error callbacks, `ReverseMap()`, explicit
transaction, or migration/snapshot edits. No build, test, lint, browser,
database, migration, commit, push, or deployment command was run.

Subagents were not used. Final reconciliation is root-owned and the remaining
workstreams were tightly coupled cross-layer checks; delegation would add
coordination cost and contract/merge risk without reducing wall-clock time.

## Handoff

**Complete at source level and frozen.** The approved reviewer assumptions and
the final reconciliation above are the current source of truth until the owner
reopens one explicitly. Generated phase packets are stale according to the
required drift check; canonical sources were used and generated files were not
edited.
