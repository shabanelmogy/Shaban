# Asset Type Feature Review and Contract Freeze

Date: 2026-09-02  
Scope: `SiGmaAngularFrontEnd/src/app/modules/Assets/assetType` and the directly related Asset Type backend contract.

## Authority and drift

- Authority: `SIGMA_FEATURE_REVIEW_MASTER.md`, canonical Normal Entity blocks in `SIGMA_BACKEND_PATTERNS.md`, and canonical list/editor blocks in `SIGMA_UI_PATTERNS.md`.
- The generated-recipe drift check reported every generated packet as stale. Canonical source guides therefore governed this implementation; generated packets were not edited or treated as authority.
- UI shape: shared `FeatureTitle` + `PrimaryActionButton` + `DataTable`, with one list-owned ordinary `EditorDialog` for Create/View/Edit.
- Backend shape: Normal Entity using the generic controller surface with feature-specific list, validation, update, and delete rules in the service.

## Functional evidence

| Evidence | Classification | Frozen requirement |
|---|---|---|
| `AssetType/1.PNG` | Direct screenshot evidence | List columns are Asset Type, Depreciation Method, Asset Account, Accumulated Depreciation Account, Depreciation Expense Account, Category, and Residual Value. Row actions are View, Edit, and Delete. A Create New Asset Type action is present. |
| `AssetType/2.PNG` | Direct screenshot evidence | Editor fields are Category, Asset Type Name, three account selections, Depreciation Method, Annual Depreciation Rate, Residual Value, and Asset Life. Create has Cancel and Save. |
| Existing Angular enums and backend enums | Source evidence | Categories remain Other, Vehicle, and Fittings. Depreciation methods remain Straight Line, Declining Balance, and Units of Production. |
| Existing generic API/controller | Source evidence | Public routes remain `GET/POST/PUT/DELETE AssetType`, `GetById/{id}`, and `GetSelect`; no custom endpoint is introduced. |

## Frozen contracts

### List and grid

Grid columns and `AssetTypeListVM` properties match as follows:

| Grid column | ListVM property |
|---|---|
| Asset Type | `Name` |
| Depreciation Method | `DepreciationMethod` |
| Asset Account | `AssetAccountName` |
| Accumulated Depreciation Account | `AccumulatedDepreciationAccountName` |
| Depreciation Expense Account | `DepreciationExpenseAccountName` |
| Category | `Category` |
| Residual Value | `ResidualValue` |

The list uses server paging with a default page size of 5, deterministic sorting, API `TotalCount`, and no screenshot-unsupported filters.

### Add and update

Client-editable request fields only:

- `Name`
- `Category`
- `AssetAccountId`
- `AccumulatedDepreciationAccountId`
- `DepreciationExpenseAccountId`
- `DepreciationMethod`
- `ResidualValue`
- `AssetLifeYears`
- `AnnualDepreciationRate`

Update adds `Id`. Tenant, audit, activity, deletion, document-number, and calculated fields are not accepted from the Angular payload. AutoMapper ignores inherited server-owned `SubscriptionId`, `No`, and entity `Id` on update.

### Validation and actions

- Name is trimmed and required, with 2–50 characters enforced in both the UI and backend; duplicate active names are rejected per tenant.
- Enum values must be defined.
- Residual value and asset life are non-negative integers.
- Annual depreciation rate is optional and must be from 0 through 100 when supplied.
- Optional account IDs must belong to the current tenant and exist.
- Delete is confirmation-only and is blocked when the type is referenced by an Asset, Purchase Request Detail, Purchase Order Detail, Goods Received Note Detail, or Bill Detail.
- Standard mutation success notifications have one owner: the global mutation interceptor. Feature code refreshes/closes only.

## Route and integration contract

- `assetType` retains one list route.
- Create/View/Edit are list-owned dialogs, not routed editor pages.
- `AssetTypeService` remains in `LayoutModule.providers`, preserving the interceptor-equipped child `HttpClient` and authenticated requests.
- Direct dropdown consumers use `AssetType/GetSelect`, so list pagination cannot truncate selectable Asset Types.
- Empty `GetSelect` results remain successful with `entities: []`.

## Decisions and exceptions

| Decision | Evidence/status |
|---|---|
| Do not add list filters, export, activation, or extra actions | Frozen: absent from screenshots and current confirmed contract. |
| Keep all three account selectors optional | Frozen: current entity and screenshots show optional selections. |
| Keep numeric values as inputs; no domain calculation added | Frozen: no derived Asset Type field is evidenced. |
| Do not introduce a `None` depreciation enum value | Conflict recorded: one screenshot row displays legacy `None`, but current frontend/backend enums have no such state. Unknown persisted values render as an em dash until an explicit enum/business migration decision is supplied. |
| Add a tenant/name unique index and explicit account delete restrictions | Canonical Normal Entity persistence rule; requires an owner-created migration. Existing data must be checked for duplicate or over-50-character names before applying it. |

## Verification boundary

Source-only reconciliation is required. Builds, tests, lint, browser automation, database commands, and migrations are owner-run and remain pending.
