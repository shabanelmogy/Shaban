# Item (#158 — `/Item`) Authorization & Access Discovery

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Inventory Item | #158 — `Item` (`/Item`) |
| Screen Shapes | UI Type `01` (List with modal editor, `ui/screens/01-list-with-modal-editor.md`, plus `app-report-page` report modal) · Backend Pattern `1` (`Normal entity` catalog definition) |
| Canonical References | `SIGMA_FEATURE_REVIEW_MASTER.md` · `SIGMA_BACKEND_PATTERNS.md` (BE1–3, BE5, BE7, BE9, BE13, BE15) · `SIGMA_UI_PATTERNS.md` (UI1–2, UI4–6, UI10, UI13, UI16, UI20–23, UI26–29) · `Generate-SigmaRecipes.ps1 -Check` passed (8/8 OK) |

## 1. Speed Functional Reference & Odoo Evidence Gate

| Source | Evidence & Location | Mapping to Sigma `#158 Item` |
|---|---|---|
| Speed Guide (`2026-10-27`) | `references/speed-analysis/2026-10-27/library/catalog.csv:178` (`S179 Create and manage Service Items` under `vehicle-leasing-software`); no separate general Stock Items guide page in the 2026-10-27 package. | Noted gap in 2026-10-27 Speed guide; general Stock Items functional surface is covered by the 2026-10-28 dated sidebar/code snapshot below. |
| Speed Sidebar & Code (`2026-10-28`) | `references/speed-analysis/2026-10-28/data/sidebar-screen-map.csv:109` (`Stock > Items`, route `tenant.CRS_Items`, permission `CRS.Items.Tenant`, `sidebar/15-stock/screens/03-items.md`); controllers `C1685--tenant.views.stock.items.index.js` & `C1684--tenant.views.stock.items.createOrEditModal.js`. | Confirms `View`, `Create`, `Edit`, `Delete` actions, filter bar (`itemNo`, `itemName`, `itemTypeId`, `supplierItemCode`, `barCode`), modal editor with UoM (`getUnitOfMeasures`) and Branch/Location (`getLocations`), report viewer & export. Speed's `Edit.EditPrice` permission & `VehicleMake/Model` lookup do not exist in Sigma `Item` schema/catalog and remain excluded unless requested in a separate feature scope. |
| Odoo 19.0 Complement (`references/odoo-rental/README.md`) | Covers Rental (`11` pages) and Fleet (`7` pages) (`COMPREHENSIVE/COMPARISON_MATRIX.md`); no stock-definition item catalog rules apply beyond Speed. | Not applicable for Stock Item permissions; Sigma catalog/branch rules govern `Item` authorization. |

## 2. Backend Discovery (`SigmaBackend`)

### 2.1 Existing Controller, Service & Scope
- **Controller**: `SiGma.ServerAPI/Controller/ItemController.cs` inherits `SiGmaControllerBase<ItemAddVM, ItemUpdateVM, ItemDetailVM, ItemListVM, Item, IItemService>`.
- **Exposed Routes & Current Actions**:
  - `GET /api/Item` (`GetAllAsync`) -> `Item.View`
  - `GET /api/Item/GetManyWithNavigations` (inherited virtual/base if routed) -> `Item.View`
  - `GET /api/Item/GetById/{id}` (`GetByIdAsync`) & `GET /api/Item/GetByWithNavigationsId/{id}` (`GetByWithNavigationsIdAsync`) -> `Item.View`
  - `GET /api/Item/GetSelect` (`GetSelectAsync`) -> `Item.Lookup` (used by `StockReports`, `WorkOrder`, `OpeningBalanceStock`, `PurchaseRequest`, `VehicleService`, etc.)
  - `POST /api/Item/CheckUnique` (`CheckUniqueAsync`) -> `Item.Validate`
  - `POST /api/Item` (`AddAsync`) -> `Item.Create`
  - `PUT /api/Item` (`UpdateAsync`) -> `Item.Update`
  - `DELETE /api/Item?id={id}` (`DeleteAsync`) -> `Item.Delete`
  - **Unused inherited endpoints**: `HandleActivate`, `GetAllWithNavigations`, `AddList`, `UpdateList` have zero FE/BE consumers across both repos (verified by repo-wide search; bulk import uses separate `POST /api/ImportData/Items` -> `ImportData.ItemsImportData`).
- **Branch / Tenant Scope (`BranchScopeRegistry.cs`)**:
  - `Item` is a tenant-shared catalog definition excluded from `BranchScopeRegistry.Definitions`. `Repository.Query<Item>()` filters `SubscriptionId` and `IsDeleted != true`.
  - `StockBranchId` (required on create & update) targets `Branch`, which enforces `ApplyBranchFilter` (`SubscriptionId`, `IsDeleted != true`, and `BranchReadIds`). Since `Item` is a catalog definition rather than a transactional branch movement, `StockBranchId` uses readable-branch lookup (`Branch.Lookup`) and does NOT impose `DemandBranchWrite`.
  - `UnitsOfMeasuresId` is optional (`int?`) and tenant-scoped (`UnitsOfMeasures`, excluded from branch scoping).

### 2.2 Confirmed Backend Gaps
1. **BE9 Filter / Sort Leak**: `ItemService` currently inherits `Service.GetManyAsync` and `ApplyGridFilters` without key/sort allow-lists. A user with `Item.View` can submit `Filters[Price]`, `Filters[StockBranch.Name]`, `Filters[UoM.Name]`, or `sortField=price|barCode|stockBranch` to infer non-list fields.
2. **Inconsistent Detail Projection**: `ItemService.DetailAsync` (`GET /Item/GetById/{id}`) relies on base `Service.DetailAsync`, whereas UI uses `GetByWithNavigationsId/{id}`. Both should share a lean `AsNoTracking()` projection filtering cross-tenant/soft-deleted/unreadable `StockBranch` and cross-tenant/soft-deleted `UoM`, returning `404 ItemNotFound` when missing.
3. **Missing Permission Prerequisites (`PermissionPrerequisites.cs`)**:
   - `Item.Create` lacks fixed `Branch.Lookup` and conditional `UnitsOfMeasures.Lookup` (`itemUnitSpecified`).
   - `Item.Update` lacks fixed `Item.View` + `Branch.Lookup` and conditional `UnitsOfMeasures.Lookup` (`itemUnitChanged`).
   - `Item.Delete` lacks fixed `Item.View`.
4. **Exposed Unused Generic Endpoints**: `HandleActivate` and `GetAllWithNavigations` remain assignable in `PermissionEndpointResolver.cs`, and `HandleActiveAsync`, `AddListAsync`, `UpdateListAsync`, `GetAllWithNavigationsAsync` remain active on `ItemService` instead of returning `405 Method Not Allowed`.
5. **Direct Service Input & Price Scale Validation**: `ItemAddVM`/`ItemUpdateVM` `[Range]` on `Price` does not reject scale > 2 (`decimal(18,2)`), and direct service callers bypass ASP.NET Core `TrimIncomingStrings`. Whitespace-only `BarCode` must normalize to `null` to align with the unique filtered index `IX_Item_SubscriptionId_BarCode` (`[IsDeleted] = 0 AND [BarCode] IS NOT NULL AND [BarCode] <> N''`).

### 2.3 Query, Performance & Index Check (`Master5 / BE2 / BE7 / UI29`)
- **Existing Indexes (`SiGmaDbContextModelSnapshot.cs:26436-26476`)**:
  - PK on `Id`
  - `IX_Item_StockBranchId` (`StockBranchId`)
  - `IX_Item_UnitsOfMeasuresId` (`UnitsOfMeasuresId`)
  - Unique filtered index on `(SubscriptionId, BarCode)` where `[IsDeleted] = 0 AND [BarCode] IS NOT NULL AND [BarCode] <> N''`
  - Unique filtered index on `(SubscriptionId, Name)` where `[IsDeleted] = 0`
- **Query Bounds & Bottlenecks**: `GetManyAsync` applies `SubscriptionId`, `IsDeleted != true`, typed filter predicates, and `GridFilter.Apply` in SQL before `CountAsync` and `NormalizePaging`. Detail read uses one `AsNoTracking()` `.Select(...)` SQL query without `Include(...)` collection inflation.
- **Index Proposal (no schema edits in this task)**: Existing FK and `(SubscriptionId, Name)` / `(SubscriptionId, BarCode)` indexes already serve lookups, FK checks, and uniqueness validation. If large-tenant `Item` lists experience slow paged scans filtered/ordered by `Type`/`Id`, consider a future covering index on `(SubscriptionId, IsDeleted, Type, Id) INCLUDE (No, Name, SupplierItemCode)` (note `No` is currently `nvarchar(max)` in snapshot and cannot be an index key without changing column length). No EF migration is authorized or needed here.

## 3. Frontend Discovery (`SiGmaAngularFrontEnd`)

### 3.1 Existing Surface & Consumers
- **Routes (`Stock/Item/item.routes.ts`)**: `/Item`, `/Item/create` (currently redirects via `legacyCreate` to `/Item?editor=create`), `/Item/details/:id` (redirects to `/Item?editor=view&itemId=:id`). Sidebar links `/Item` (`sidebar-menu-data.ts:604`). `ItemService` (`Stock/Item/services/item.service.ts`) already sets `cacheSelect = true` (`Item/GetSelect`).
- **Lookups Consumed**:
  - List filters: `ItemType` options come from local enum helper (no lookup API); search fields are `no`, `name`, `type`, `supplierItemCode`, `barCode`.
  - Editor modal (`DetailsComponent` / `app-item-editor`): loads `Branch/GetSelect` (`Branch.Lookup`) and `UnitsOfMeasures/GetSelect` (`UnitsOfMeasures.Lookup`), plus `Item/CheckUnique` (`Item.Validate`) for `name` and `barCode`.
  - Report modal (`ItemReportComponent`): fetches all pages via `ItemService.getList`.

### 3.2 Confirmed Frontend Gaps (`UI26 / UI22 / UI2 / UI10 / UI13 / UI16 / UI28`)
1. **No `item-access.ts` / Fail-Closed Route Policy**: `/item`, `/item/create`, `/item/details` are absent from `RouteAccessPolicyRegistry` and `firstAllowedRoute`. Currently ordinary users are blocked from `/Item`, while `legacyCreate` redirects `/Item/create` to `/Item`, which would block Create-only actors without `Item.View`.
2. **Unadopted `AccessViewPolicyService` & Context Expiry (`UI26/28`)**:
   - `ItemsComponent`, `DetailsComponent`, and `ItemReportComponent` lack `canView`, `canCreate`, `canEdit`, `canDelete`, `ownerContext`, `ownerSession`, `lastRevision`, `takeUntil(denied$)`, and `CAN_PRESENT_API_OUTCOME`.
   - `DetailsComponent.canDeactivate` lacks `defaultIfEmpty(false)` after `takeUntil` when access/context expires during dirty-exit confirmation.
   - `DetailsComponent.loadDetails` places `defaultIfEmpty(null)` before `takeUntil`.
   - Body-appended `<p-select>` overlays (`item-filter-category`, `item-type`, `item-branch`, `item-unit`) remain open if read/editor access or context expires while open.
3. **Optional `UnitsOfMeasures.Lookup` & Advisory `Item.Validate` Gating**:
   - Currently `DetailsComponent` unconditionally fetches `UnitsOfMeasures/GetSelect` whenever the editor opens and treats any failure as blocking `lookupError`, preventing save even when `unitsOfMeasuresId` is null or unchanged.
   - `uniqueFieldValidator` currently fires `Item/CheckUnique` even without `Item.Validate`.
4. **Condition Label Registry & User Guide**:
   - `permission-dependencies.ts` and `i18n/vocabs/authorization.ts` need `itemUnitSpecified` and `itemUnitChanged`.
   - `UserGuide/content/stock-guide.ts` needs item #158 permission/lookup documentation.
