# Item (#158 — `/Item`) Access Adoption Contract Freeze

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Inventory Item | #158 — `Item` (`/Item`) |
| Discovery Evidence | [ITEM_ACCESS_DISCOVERY.md](<F:/My Work/Sigma/reviews/Authorization/ITEM_ACCESS_DISCOVERY.md>) |

## 1. Frozen Permission & Prerequisite Matrix (`Backend`)

| Permission / Endpoint | HTTP & Action | Fixed Prerequisites | Conditional Prerequisites | Record / Branch Scope |
|---|---|---|---|---|
| `Item.View` (`GET /api/Item`, `GET /api/Item/GetManyWithNavigations`) | `200 OK` paged `Results<ItemListVM>` (`400` on unsupported filter/sort/grid key) | None | None | Tenant (`SubscriptionId`) + `IsDeleted != true` (catalog definition, no branch filter) |
| `Item.View` (`GET /api/Item/GetById/{id}`, `GET /api/Item/GetByWithNavigationsId/{id}`) | `200 OK` `Result<ItemDetailVM>` (`404 ItemNotFound` when missing/other tenant/deleted) | None | None | Tenant + `IsDeleted != true`; `StockBranchName` & `UnitsOfMeasuresName` filtered to same active tenant (+ branch read filter on `StockBranch`) |
| `Item.Lookup` (`GET /api/Item/GetSelect`) | `200 OK` `Results<DropdownDto>` | None | None | Active tenant items (retained for downstream consumers) |
| `Item.Validate` (`POST /api/Item/CheckUnique`) | `200 OK` `Result<UniqueValueCheckDto>` (`Name`, `BarCode`) | None | None | Tenant + `IsDeleted != true` |
| `Item.Create` (`POST /api/Item`) | `200 OK` `Result` / `400` / `403` | `Branch.Lookup` | `itemUnitSpecified`: `UnitsOfMeasures.Lookup` when `ItemAddVM.UnitsOfMeasuresId > 0` | Valid active readable `Branch` (`StockBranchId`); valid active tenant `UnitsOfMeasures` when `UnitsOfMeasuresId != null`; `DemandBranchWrite` NOT applied |
| `Item.Update` (`PUT /api/Item`) | `200 OK` `Result` / `400` / `403` / `404` | `Item.View`, `Branch.Lookup` | `itemUnitChanged`: `UnitsOfMeasures.Lookup` when `ItemUpdateVM.UnitsOfMeasuresId != saved.UnitsOfMeasuresId` (skipped -> `404` when `id` missing/other tenant) | Same active tenant item + valid active readable `Branch` + valid active tenant `UnitsOfMeasures` when non-null |
| `Item.Delete` (`DELETE /api/Item?id={id}`) | `200 OK` `Result` / `404` / `400` | `Item.View` | None | Tenant + `RemoveWithChildrenAsync` |
| `HandleActivate`, `GetAllWithNavigations` | `405 Method Not Allowed` (`ItemOperationNotSupported`) | Excluded from assignable catalog (`assignableAction = null` in `PermissionEndpointResolver.cs`) | — | — |
| `AddList`, `UpdateList` | `405 Method Not Allowed` (`ItemOperationNotSupported`) | Mapped to `Create`/`Update` in resolver; service rejects bulk endpoints with `405` | — | — |

## 2. Frozen Backend Read & Validation Contract (`BE9 / BE3 / BE15`)

1. **List Allow-Lists (`ItemService.GetManyAsync` & `GetManyWithNavigationsAsync`)**:
   - Allowed query filter keys (case-insensitive): `no`, `name`, `type`, `supplierItemCode`, `barCode`, `grid`, `sortField`, `sortOrder`.
   - Any unknown filter key throws `GridFilterException("GridFilterUnsupportedField")` (`400`).
   - Allowed `sortField` values (case-insensitive): `id`, `no`, `name`, `type`, `supplierItemCode`; any other value throws `GridFilterException("GridFilterUnsupportedField")`.
   - `sortOrder` must be `1` or `-1` when present; `type` must parse as an `int` defined in `ItemTypeEnum` when present (invalid values throw `GridFilterException("GridFilterInvalidValue")`).
   - Direct predicates trim string filters (`no`, `name`, `supplierItemCode`, `barCode`) and match via `.Contains(...)` on active tenant items before `ApplyGridFilters`, `CountAsync`, ordering, and `NormalizePaging`.
   - `GridFilter` (`Filters[grid]`) operates on `GridFilterProjection(query)` -> scalar `ItemListVM` (`Id, No, Name, Type, SupplierItemCode`), inherently blocking non-list columns (`Price`, `BarCode`, `StockBranch`, `UoM`, `MaximumQuantity`, `Note`).
2. **Detail Projection (`ReadDetailAsync`)**:
   - Both `DetailAsync(id)` and `DetailWithNavigationsAsync(id)` run `UnitOfWork.Repository.Query<Item>(x => x.Id == id).AsNoTracking()` projecting `ItemDetailVM`.
   - `StockBranchName` and `UnitsOfMeasuresName` project explicitly with `SubscriptionId == subscriptionId && IsDeleted != true` checks (`Branch` global read filter naturally respected on navigation). Missing/cross-tenant/deleted rows return `BusinessFailure<ItemDetailVM>("ItemNotFound", StatusCodes.Status404NotFound)`.
3. **Create & Update Validation**:
   - Normalize `Name`, `BarCode`, `SupplierItemCode`, `Note` by trimming (`BarCode`/`SupplierItemCode`/`Note` whitespace-only becomes `null`).
   - Require non-empty `Name` (<= 250 chars), defined `ItemTypeEnum` `Type`, `BarCode` <= 250 chars, `Price` null or `NonnegativeStoredDecimalAttribute.IsRepresentable(price)` (nonnegative, scale <= 2), `MaximumQuantity` null or >= 0, `StockBranchId > 0`, `UnitsOfMeasuresId` null or > 0.
   - Verify `StockBranchId` exists in active readable `Branch` query (`ItemBranchUnavailable` when invalid) and non-null `UnitsOfMeasuresId` exists in active tenant `UnitsOfMeasures` query (`ItemUnitUnavailable` when invalid).
   - Retain `UniqueColumns` (`Name`, `BarCode`) uniqueness enforcement inside `base.AddAsync` / `base.UpdateCoreAsync` (`ExecuteUniqueWriteAsync`).
   - Add localized EN/AR messages in `GeneralMessage.resx` & `GeneralMessage.ar-SA.resx` for `ItemNotFound`, `ItemOperationNotSupported`, `ItemInvalidInput`, `ItemBranchUnavailable`, `ItemUnitUnavailable`.

## 3. Frozen Frontend Contract (`SiGmaAngularFrontEnd`)

1. **`itemAccess` (`src/app/modules/Stock/Item/item-access.ts`, registered in `tsconfig.app.json`)**:
   - `view: 'Item.View'`
   - `create: ['Item.Create', 'Branch.Lookup']`
   - `edit: ['Item.View', 'Item.Update', 'Branch.Lookup']`
   - `delete: ['Item.View', 'Item.Delete']`
   - `validate: 'Item.Validate'`
   - `lookups: { item: 'Item.Lookup', branches: 'Branch.Lookup', units: 'UnitsOfMeasures.Lookup' }`
   - `saveRequirements(mode, unitsChanged, hasUnitsValue)` returns `{ allOf: [...] }` adding `'UnitsOfMeasures.Lookup'` iff `(mode === 'create' && hasUnitsValue) || (mode === 'edit' && unitsChanged)`.
2. **Routing (`route-access-policy.ts` & `item.routes.ts`)**:
   - Add `/item` (`itemAccess.view`), `/item/create` (`itemAccess.create`), `/item/details` (`itemAccess.view`, prefix match) to `RouteAccessPolicyRegistry`, and add `'/Item'`, `'/Item/create'` in `firstAllowedRoute` right after `'/ItemTypes'`.
   - In `item.routes.ts`, route `create` with `component: ItemsComponent, canDeactivate: [preventUnsavedExit], data: { editorMode: 'create' }` (preserving `/Item/details/:id` redirect under `Item.View`) so Create-only users can load the editor without requesting `GET /api/Item`.
3. **List & Report Host Lifecycle (`ItemsComponent`, `ItemReportComponent`)**:
   - List data surface and Filter/Report/Create actions follow `access.allows`: list reads require `itemAccess.view` (`denied$(itemAccess.view)`), Create-only `/Item/create` opens the editor host directly without `GET /api/Item`.
   - Track `ownerContext` (`access.dataContext()`), `ownerSession` (`access.readAuthSessionKey()`), and `lastRevision` (`access.revision()`). Context change clears stale rows/selection/totals/errors, hides `#typeFilterSelect` overlay, closes report/editor read state safely (keeping dirty editor drafts & sent writes intact).
   - Cancel `list`, `report`, and `confirmDelete` streams cleanly (`takeUntil(...)`); place `defaultIfEmpty(false)` AFTER `takeUntil` in `confirmDelete`.
   - Gate `Item/details` Edit & Delete buttons strictly by `canEdit()` and `canDelete()`; recheck permission & `ownerContext` after Delete confirmation before dispatching `DELETE`; fence Delete request outcome via `CAN_PRESENT_API_OUTCOME` and reload list only when `canReconcileList()`.
4. **Editor Lifecycle (`DetailsComponent`, `ItemService`)**:
   - Wrap modal host in `[accessBlocked]` + `[accessRequirement]` on `app-editor-dialog`, hide all body-appended `<p-select>` overlays (`@ViewChildren(Select)`) on context/access loss, and separate access-output invalidation from busy signals (`UI26`).
   - Gate `GET Item/GetByWithNavigationsId/{id}` by `itemAccess.view`, with `takeUntil` BEFORE `defaultIfEmpty(null)`.
   - Gate `Branch/GetSelect` by `itemAccess.lookups.branches` (`Branch.Lookup`); recover automatically on regrant when mounted.
   - Gate `UnitsOfMeasures/GetSelect` by `itemAccess.lookups.units` (`UnitsOfMeasures.Lookup`):
     - When `UnitsOfMeasures.Lookup` is absent (or revoked), retain any already-loaded saved `{ value: unitsOfMeasuresId, label: unitsOfMeasuresName }` option on the dropdown without firing `UnitsOfMeasures/GetSelect` or setting `lookupError`. Keep the unit selector disabled/locked when `UnitsOfMeasures.Lookup` is absent (or allow retaining unchanged saved value so non-unit edits still save cleanly; changing or clearing UoM requires `UnitsOfMeasures.Lookup`).
     - Recover `UnitsOfMeasures/GetSelect` on regrant.
   - Run `checkUnique` advisory duplicate validation only when `access.allows(itemAccess.validate)` AND pipe it with `takeUntil(cancel)`; if `Item.Validate` is absent, skip `CheckUnique` without blocking Create/Save.
   - `canDeactivate()` places `defaultIfEmpty(false)` AFTER `takeUntil` on dirty-exit confirmation.
   - `ItemService.create`, `update`, and `remove` accept optional `context?: HttpContext` carrying `CAN_PRESENT_API_OUTCOME`.
   - Save reconciles draft consumption for original session independently of permission revocation during flight; list reloads when `canReconcileList()`.
5. **Condition Labels & User Guide**:
   - Register `itemUnitSpecified` and `itemUnitChanged` in `permission-dependencies.ts` and `i18n/vocabs/authorization.ts` (EN & AR).
   - Update `UserGuide/content/stock-guide.ts` for item #158 permissions, optional UoM lookup behavior, Create-only `/Item/create` routing, and advisory duplicate check.

## 4. Planned Verification Scope
- Backend: `SiGma.BranchAccess.Tests\ItemAccessContractTests.cs` compiled with `dotnet build --no-restore` on `SiGma.ServerAPI.csproj` and `SiGma.BranchAccess.Tests.csproj` (tests not executed).
- Frontend: `list.component.spec.ts`, `details.component.spec.ts`, `route-access-policy.spec.ts`, `permission-dependencies.spec.ts` compiled with `npm run build` (`ng build`) (tests and lint not executed).
- Scoped `git diff --check` across all touched repositories. Runtime/DB/browser checks remain explicitly pending owner authorization.
