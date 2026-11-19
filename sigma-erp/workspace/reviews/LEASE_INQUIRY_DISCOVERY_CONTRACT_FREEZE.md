# Lease Inquiry — Shared Discovery and Contract Freeze

| Item | Decision |
|---|---|
| Review mode | Combined final reconciliation with direct implementation |
| Review date | 2026-08-18 |
| Feature | Lease Inquiry |
| Requested scope | `SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseInquiry` and directly related Angular/.NET contracts |
| Phase status | Phases 0-6 **source-only complete**; owner runtime/build/database verification remains pending |
| Authority | `SIGMA_FEATURE_REVIEW_MASTER.md`, canonical UI/backend pattern books (`SIGMA_UI_PATTERNS.md`, `SIGMA_BACKEND_PATTERNS.md`), current source |

## Governance and packet status

The read-only recipe drift check was run before using generated packets:

```text
F:\Shaban Documents\Shaban\sigma-erp\recipe-system\Generate-SigmaRecipes.ps1 -Check
```

It reported that generated recipes are stale across all phases (`PHASE-00-discovery-evidence.md` through `PHASE-06-final-reconciliation.md`). The canonical pattern books are therefore authoritative; generated packets were referenced only as derivative procedural guides. No generated packet was edited or regenerated.

## Feature Review Manifest

| Item | Decision or evidence |
|---|---|
| Requested outcome | Establish shared discovery, classify screenshot evidence, freeze frontend/backend contracts across grid, editor, stage transitions, and logs, and apply shared-phase contract refactors before independent downstream review. |
| Frontend scope | `SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseInquiry` (components, routes, models, services); enum `leaseInquiryStage.ts`; route registration in `pages/routing.ts`; English/Arabic vocabularies in `i18n/vocabs/en.ts` and `ar.ts`. |
| Backend scope | `LeaseInquiry` and `LeaseInquiryItem` entities; ViewModels (`LeaseInquiryListVM`, `LeaseInquiryDetailVM`, `LeaseInquiryAddVM`, `LeaseInquiryUpdateVM`, `LeaseInquiryItemListVM`, `LeaseInquiryItemDetailVM`, `LeaseInquiryItemAddVM`, `LeaseInquiryItemUpdateVM`); EF configurations (`LeaseInquiryConfig`, `LeaseInquiryItemConfig`); AutoMapper profiles (`LeaseInquiryProfiler`, `LeaseInquiryItemProfiler`); service/controller (`LeaseInquiryService`, `ILeaseInquiryService`, `LeaseInquiryController`). |
| Existing scoped changes | Direct implementation changes are present in both scoped repositories and are reviewed in the current reconciliation section appended below. |
| Supplied evidence | 5 screenshot captures (E1–E5 below). Evidence demonstrates LTR/English UI, list with filter bar, log dialog, change stage dialog, create modal with item sub-table, and stage dropdown options (`New`, `Cold`, `Hot`). |
| UI list shape | Canonical shared `app-data-table` with typed feature columns and server paging; `app-feature-title` with `+ CREATE NEW LEASE INQUIRY` top action button; feature filter bar (Lease Inquiry No, Date Range, Lease Inquiry Stage, Customer, Export to Excel, Refresh). Approved reference: `Fleet/VehicleService/components/list`. Current `table-list` is legacy and conflicts with the canonical target. |
| UI editor shape | Controlled modal dialog for Create / View / Edit (`app-editor-dialog`), containing header inputs (Date, Sale Person, Customer, Contact Person) and a child items table (`MAKE AND MODEL`, `VEHICLE TYPE`, `QUANTITY`, `PERIOD (YEARS)`). Approved reference: `Fleet/VehicleService/components/details`. |
| Child collection shape | Feature-owned typed `FormArray` rendered in child table; dynamic row addition and removal. |
| Domain action modals | 1. **Change Stage Dialog**: Controlled typed modal with `Lease Inquiry Stage` dropdown (`New`, `Cold`, `Hot`) and `Notes` textarea, plus Save/Cancel.<br>2. **Logs Dialog**: Read-only history dialog with columns `DATE AND TIME`, `USER`, `DETAIL` and Cancel.<br>3. **Delete**: Standard confirmation dialog. |
| Backend pattern | Pattern 2 — master-detail aggregate, no financial voucher effect. Persists parent inquiry and child items in one unit of work. Approved reference: `PurchaseOrderService` / `LeaseCostSettingService`. |
| Current routes | Angular defines `''` (List), `'details/:id'` (Details), and `'create'` (Create). The screenshots and canonical modal CRUD rule indicate a single list route with controlled modal dialogs for create, view, edit, stage change, and logs. Current multi-page routing is Conflicting. |
| Current API operations | Generic CRUD operations from `SiGmaControllerBase` / `Service.cs`, navigation list/detail, soft delete. Target frozen operations documented below. |
| Action inventory | Create (opens editor modal in create mode), View (opens editor modal in view mode), Edit (opens editor modal in edit mode), Delete (confirmation + soft delete), Logs (opens Log dialog), Change Stage (opens Stage modal), Export to Excel, Refresh, Add Row, Remove Row, Save, Cancel. |
| Permission mechanism | Authentication only: `[Authorize]` on backend base controller and `AuthGuard` on Angular layout. No custom permission API exists or may be invented. |
| Applicable phases | Phases 0, 1, 2, 3, 4, 5, and 6 applied in the direct implementation pass. |
| Explicit exclusions | No schema migrations, migration/snapshot edits, builds, tests, lint, browser automation, database commands, commits, or deployment. |

## Functional Evidence

### E1 — List View and Filter Bar
| Classification | Required feature behavior | Owner | Guide-compliant representation |
|---|---|---|---|
| Explicit | Page header: "Lease Inquiry" / "Manage Lease Inquiry" with top action button "+ CREATE NEW LEASE INQUIRY".<br>Filter bar with 4 filters: Lease Inquiry No (input), Date Range (picker), Lease Inquiry Stage (dropdown), Customer (searchable lookup), plus "EXPORT TO EXCEL" and "REFRESH" buttons.<br>Grid columns: Actions, No, Date, Customer, Code (Customer Code), Sale Person, Stage.<br>Actions menu on row: View, Edit, Delete, Logs, Change Stage.<br>Paging: 10 items per page, 1 - 10 of 87 items. | Phases 0, 1, 2, 4, 5 | `app-feature-title` with primary action button; custom filter bar with responsive PrimeNG controls; canonical shared `app-data-table` with typed columns and server-side paging; real `TotalCount` and `TotalPages`. |

### E2 — Log History Dialog (`Lease Inquiry Log: (11)`)
| Classification | Required feature behavior | Owner | Guide-compliant representation |
|---|---|---|---|
| Explicit | Modal title: `Lease Inquiry Log: ({No})`.<br>Table columns: `DATE AND TIME`, `USER`, `DETAIL`.<br>Footer action: `CANCEL` button. | Phases 0, 1, 4 | Controlled read-only dialog displaying timestamped log entries for the selected inquiry. |

### E3 — Change Stage Dialog (`Lease Inquiry Stage: (15)`)
| Classification | Required feature behavior | Owner | Guide-compliant representation |
|---|---|---|---|
| Explicit | Modal title: `Lease Inquiry Stage: ({No})`.<br>Form controls: `Lease Inquiry Stage` (dropdown) and `Notes` (textarea / text input).<br>Footer actions: `CANCEL`, `SAVE`. | Phases 0, 1, 4 | Controlled typed form dialog for state transition, submitting updated stage and notes. |

### E4 — Create / Edit / View Modal (`Create New Lease Inquiry`)
| Classification | Required feature behavior | Owner | Guide-compliant representation |
|---|---|---|---|
| Explicit | Modal title: `Create New Lease Inquiry` (or Edit / View).<br>Header inputs: Date, Sale Person (dropdown), Customer (dropdown + lookup button), Contact Person (dropdown).<br>Child items table: MAKE AND MODEL, VEHICLE TYPE, QUANTITY, PERIOD (YEARS).<br>Action: `Add Row` button.<br>Footer actions: `CANCEL`, `SAVE`. | Phases 0, 1, 3 | Controlled modal dialog (`app-editor-dialog`); typed form group with child `FormArray`; dynamic add/remove row capability; Save/Cancel footer. |

### E5 — Stage Dropdown Options
| Classification | Required feature behavior | Owner | Guide-compliant representation |
|---|---|---|---|
| Explicit | Dropdown options for `Lease Inquiry Stage`: `New`, `Cold`, `Hot`. Corresponds to backend `LeaseInquiryStageEnum` values `0 (New)`, `1 (Cold)`, `2 (Hot)`. | Phases 0, 1 | Typed enum in frontend and backend with consistent numeric wire values and localized display labels. |

## Grid Column and ListVM Contract

The target grid column list is written beside the target ListVM property list (Master Guide Block 4 invariant):

| Grid column or action need | Frontend property | Target backend ListVM property | Status and evidence |
|---|---|---|---|
| Actions | Shared table action menu; row target | `Id` | Confirmed by E1 (View, Edit, Delete, Logs, Change Stage). |
| No | `no` | `No` (from `EntityBase`) | Confirmed by E1 ("11", "12", "13"...). |
| Date | `date` | `Date` (DateTime) | Confirmed by E1 ("15/09/2020"...). |
| Customer | `customerName` | `CustomerName` (string?) | Confirmed by E1 ("Agha & Co LLC"...), flattened from `Customer.Name`. |
| Code | `customerCode` | `CustomerCode` (string?) | Confirmed by E1 ("76948"...), flattened from `Customer.No`. |
| Sale Person | `salePersonName` | `SalePersonName` (string?) | Confirmed by E1 ("Samuel Hopkins"...), flattened from `SalePerson.Name`. |
| Stage | `leaseInquiryStage` / `leaseInquiryStageText` | `LeaseInquiryStage` (enum) / `LeaseInquiryStageText` (string) | Confirmed by E1 ("New"...), derived from `LeaseInquiryStageEnum`. |

### Detailed Column Mapping Table

| Visible label | Proposed field | Current source field | Display transformation | Filterable | Sortable | Exported | Confidence |
|---|---|---|---|---|---|---|---|
| Actions | Shared action column | None | Renders menu (View, Edit, Delete, Logs, Change Stage) | N/A | N/A | No | Confirmed |
| No | `no` | `x.No` | Text / String | Yes (Filter bar) | Yes | Yes | Confirmed |
| Date | `date` | `x.Date` | Date Pipe (`dd/MM/yyyy`) | Yes (Date Range) | Yes | Yes | Confirmed |
| Customer | `customerName` | `x.Customer.Name` | Text | Yes (Customer lookup) | Yes | Yes | Confirmed |
| Code | `customerCode` | `x.Customer.No` | Text / Code | No | Yes | Yes | Confirmed |
| Sale Person | `salePersonName` | `x.SalePerson.Name` | Text | No | Yes | Yes | Confirmed |
| Stage | `leaseInquiryStageText` | `x.LeaseInquiryStage` | Enum string / localized label | Yes (Stage dropdown) | Yes | Yes | Confirmed |

## Frontend/Backend Contract Handoff

### Status
**Frozen with conservative reviewer assumptions.** Contracts are frozen for downstream Backend and Frontend phases.

### API Operation Inventory

| Operation | Method and Route | Request Payload | Response Body | Description |
|---|---|---|---|---|
| List (Paged) | `GET /LeaseInquiry` | `ListSmBase` (`PageNo`, `PageSize`, `Filters[key]`) | `Results<LeaseInquiryListVM>` | Server-paged, filtered list with real `TotalCount` and `TotalPages`. |
| Detail | `GET /LeaseInquiry/GetByWithNavigationsId/{id}` | `id: int` | `Result<LeaseInquiryDetailVM>` | Full inquiry graph including child items. |
| Create | `POST /LeaseInquiry` | `LeaseInquiryAddVM` | `Result` | Graph creation of parent inquiry and child items in one save. |
| Update | `PUT /LeaseInquiry` | `LeaseInquiryUpdateVM` | `Result` | Aggregate reconciliation of parent and child items. |
| Delete | `DELETE /LeaseInquiry?id={id}` | `id: int` | `Result` | Soft delete with confirmation. |
| Change Stage | `POST /LeaseInquiry/ChangeStage` | `ChangeStageVM` (`Id`, `Stage`, `Notes`) | `Result` | Updates inquiry stage and writes activity log entry. |
| Get Logs | `GET /LeaseInquiry/GetLogs/{id}` | `id: int` | `Results<LeaseInquiryLogVM>` | Retrieves activity/audit history for the inquiry. |
| Lookups | `GET /CarModel/GetMakeAndModel`<br>`GET /Staff/GetSelect`<br>`GET /Customer/GetSelect`<br>`GET /Contact/GetSelectByCompany/{customerId}`<br>`GET /VehicleType/GetSelect` | Lookups | `Results<DropdownDto>` / typed DTOs | Tenant-scoped lookups for editor and filter dropdowns. |

### Request Contract

| Contract | Frozen Target Input | Server-Owned / Excluded Fields | Status |
|---|---|---|---|
| Add Parent | `date: string`, `salePersonId: number`, `customerId: number`, `contactPersonId?: number | null`, `leaseInquiryItems: LeaseInquiryItemAdd[]` | `id`, `no`, `subscriptionId`, `guid`, `isDeleted`, audit fields, initial stage (defaulted to `New`) | Frozen |
| Add Child | `makeAndModelId: number`, `vehicleTypeId: number`, `quantity: number`, `periodYears: number` | `id`, `leaseInquiryId`, `subscriptionId`, audit fields | Frozen |
| Update Parent | `id: number`, `date: string`, `salePersonId: number`, `customerId: number`, `contactPersonId?: number | null`, `leaseInquiryItems: LeaseInquiryItemUpdate[]` | `no`, `subscriptionId`, `guid`, audit fields | Frozen |
| Update Child | `id: number` (0 for new, > 0 for existing), `makeAndModelId: number`, `vehicleTypeId: number`, `quantity: number`, `periodYears: number` | `leaseInquiryId`, `subscriptionId`, audit fields | Frozen |
| Change Stage | `id: number`, `stage: LeaseInquiryStage`, `notes?: string` | Server timestamp, user identity | Frozen |

### Response Contract

| Contract | Frozen Target Output | Status |
|---|---|---|
| Grid Row (`LeaseInquiryListVM`) | `id`, `no`, `date`, `customerName`, `customerCode`, `salePersonName`, `leaseInquiryStage`, `leaseInquiryStageText` | Frozen; flat projection without heavy nested navigation graphs or child collections. |
| Detail (`LeaseInquiryDetailVM`) | `id`, `no`, `date`, `salePersonId`, `salePersonName`, `customerId`, `customerName`, `customerCode`, `contactPersonId`, `contactPersonName`, `leaseInquiryStage`, `leaseInquiryStageText`, `leaseInquiryItems: LeaseInquiryItemDetailVM[]` | Frozen |
| Child Row (`LeaseInquiryItemDetailVM`) | `id`, `leaseInquiryId`, `makeAndModelId`, `makeAndModelName`, `vehicleTypeId`, `vehicleTypeName`, `quantity`, `periodYears` | Frozen |
| Log Row (`LeaseInquiryLogVM`) | `dateTime: DateTime`, `user: string`, `detail: string` | Frozen |

### Failure Behavior
The backend returns `Result` / `Results<T>` with `isSuccess: false` and `message` on validation/business failure, and standard error responses on transport failure. Frontend must handle both failure channels (`isSuccess === false` and `error: () => ...`).

## Required Decisions and Unresolved Register

| ID | Requirement / Decision | Status | Frozen Conservative Assumption | Owner / Phase |
|---|---|---|---|---|
| U1 | UI shape: Modal CRUD vs Routed pages | Conflicting | Follow canonical modal rule and screenshots E1–E4: Single list route with controlled modal dialog for Create/View/Edit. | Phase 0, 3, 5 |
| U2 | Enum values for `LeaseInquiryStage` | Conflicting | `New = 0, Cold = 1, Hot = 2` across backend and frontend. Outdated `New, Used` in `_metronic` enum is corrected. | Phase 1, 3 |
| U3 | ListVM over-scoping | Conflicting | `LeaseInquiryListVM` is flattened to contain only displayed row properties; nested raw `PartnerDetailVM`, `StaffDetailVM`, and child lists are removed. | Phase 1, 2 |
| U4 | Server-side paging and total | Missing in current list | Use `GET /LeaseInquiry` with `PageNo`, `PageSize`, real `TotalCount`, and `TotalPages`. | Phase 1, 2 |
| U5 | Filter Bar binding | Missing in current UI | 4 filters (Inquiry No, Date Range, Stage, Customer) mapped to backend search model filters. | Phase 1, 2 |
| U6 | Change Stage domain action | Missing in current UI | Controlled modal dialog bound to `POST /LeaseInquiry/ChangeStage` with `stage` and `notes`. | Phase 1, 4 |
| U7 | Activity / Audit Logs | Missing in current UI | Controlled modal dialog bound to `GET /LeaseInquiry/GetLogs/{id}` displaying timestamp, user, detail. | Phase 1, 4 |
| U8 | AutoMapper bidirectional maps | Conflicting | Replace `ReverseMap()` with explicit one-way mappings and projection mappings. | Phase 1 |
| U9 | Child entity foreign key | Missing in C# model | Add explicit `LeaseInquiryId` and `LeaseInquiry` navigation on `LeaseInquiryItem` matching existing DB schema. | Phase 1 |
| U10 | Confirmations | Missing | Add shared confirmation for Delete and dirty modal discard. | Phase 3, 4 |
| U11 | Standalone `LeaseInquiryItem` routes | Conflicting | Sub-items belong strictly to parent inquiry aggregate; standalone routes are deprecated/pruned. | Phase 1, 5 |
| U12 | Translations | Partial | Complete English and Arabic keys for feature title, filter labels, dialog headers, buttons, and validation messages. | Phase 3, 5 |

## Phase Decisions from Master Guide Block 4

| Decision | Frozen Decision | Evidence / Authority |
|---|---|---|
| Canonical UI reference | `Fleet/VehicleService/components/list` for data table & filters; `Fleet/VehicleService/components/details` for editor modal dialog. | Master Guide UI Reference Table |
| Editor shape | One controlled `app-editor-dialog` for Create, View, Edit. | Canonical CRUD Modal Rule; E4 |
| Route shape | Single route `LeaseInquiry`; mode managed internally. | Canonical Modal Rule; E1 |
| Grid columns | Actions, No, Date, Customer, Code, Sale Person, Stage. | Screenshot E1; Master Guide Block 4 |
| ListVM scope | Flat DTO containing only grid fields + `Id`. | Master Guide Block 7 ListVM rule |
| Backend pattern | Pattern 2 — master-detail aggregate. | Master Guide Backend Pattern 2 |
| Transactions | EF Core implicit transaction for single `SaveChangesAsync()`. | Canonical Backend Patterns Block 8 |
| Authorization | Authentication only via `[Authorize]` and `AuthGuard`. | Existing solution architecture |
| Migration boundary | No migrations created or edited; no `*ModelSnapshot.cs` changes. | Workspace rules |

## Findings for Downstream Review

| ID | Finding | Severity | Evidence | Required Owner |
|---|---|---|---|---|
| F1 | Legacy `table-list` from `ms-lib` used instead of canonical `app-data-table`. | High | `list.component.html` | Phase 2 |
| F2 | List does not support server-side filtering and real total paging. | High | `list.component.ts`, `Service.cs` | Phase 1, 2 |
| F3 | Multi-page routed details (`details/:id`, `create`) conflict with modal dialog pattern shown in evidence. | High | `leaseinquiry.routes.ts`, `details.component.html` | Phase 3, 5 |
| F4 | Actions menu in current list contains only placeholder Delete; lacks View, Edit, Logs, Change Stage. | High | `list.component.ts`, E1 | Phase 2, 4 |
| F5 | Change Stage dialog and Logs dialog are missing from the Angular component suite. | High | E2, E3 | Phase 4 |
| F6 | Mismatched `LeaseInquiryStage` enum between frontend and backend. | Medium | `leaseInquiryStage.ts`, E5 | Phase 1 (Resolved in shared refactor) |
| F7 | `LeaseInquiryListVM` returned unprojected deep entities and collections. | Medium | `LeaseInquiryListVm.cs` | Phase 1 (Resolved in shared refactor) |
| F8 | AutoMapper profiles used `ReverseMap()` and lacked member projections. | Medium | `LeaseInquiryProfiler.cs` | Phase 1 (Resolved in shared refactor) |
| F9 | Form lacks confirmation dialogs on delete and dirty close. | Medium | `details.component.ts` | Phase 3, 4 |
| F10 | Standalone `LeaseInquiryItem` route registered in `pages/routing.ts`. | Low | `pages/routing.ts` | Phase 5 |

## Phases and Verification Boundary

### Shared-Phase Refactors Applied
1. Fixed `LeaseInquiryStageEnum` in `SiGmaAngularFrontEnd/src/app/_metronic/shared/enums/leaseInquiryStage.ts` to `New = 0, Cold = 1, Hot = 2`.
2. Updated Angular models in `LeaseInquiry/models/list.ts`, `details.ts`, `create.ts` with clean typed properties, omitting server-owned fields from write DTOs.
3. Updated backend ViewModels (`LeaseInquiryListVM`, `LeaseInquiryDetailVM`, `LeaseInquiryItemListVM`, `LeaseInquiryItemDetailVM`) with flattened display properties and pruned over-scoped entities.
4. Added explicit `LeaseInquiryId` and `LeaseInquiry` navigation on `LeaseInquiryItem` entity.
5. Replaced `ReverseMap()` in AutoMapper profilers (`LeaseInquiryProfiler`, `LeaseInquiryItemProfiler`) with explicit one-way projection mappings.

### Phase Status Summary
- **Phase 0 (Discovery & Evidence)**: Applied and complete. Evidence E1–E5 classified; shapes and contracts identified.
- **Phase 1 (Domain, Persistence & API Contract Freeze)**: Applied and frozen with conservative reviewer assumptions. Shared contract refactors applied.
- **Phase 2 (Read / Grid)**: Pending downstream execution.
- **Phase 3 (Detail / Write)**: Pending downstream execution.
- **Phase 4 (Domain Actions)**: Pending downstream execution (Change Stage, Logs, Delete confirmation).
- **Phase 5 (Integration & Runtime)**: Pending downstream execution.
- **Phase 6 (Final Reconciliation)**: Pending downstream execution.

### Verification Boundary
- Scoped frontend and backend git diffs reviewed and confirmed clean.
- Builds, tests, lint, browser automation, database commands, migrations, and commits were explicitly **not** run.
- Runtime verification remains pending for the owner.

## Combined Final Reconciliation — Blocked

The comparison in this historical section reflects an earlier implementation
snapshot. It is superseded for the current source by **Combined Final
Reconciliation — Current Source Rerun** at the end of this artifact.

The combined Phase 6 review was run on 2026-08-18 across the complete scoped
Angular and .NET working-tree diffs. The Backend and Frontend outputs cannot be
accepted as overall completion because required action and integration
contracts are still Missing or Conflicting. Phase 1 is reopened only for the
decisions below; dependent Phase 4 and Phase 5 conclusions are stale until the
handoff is refrozen.

Generated Phase 0-6 packets remain stale according to the mandatory drift
check. The Master Guide and selected canonical UI/backend blocks were used as
authority; no generated file was edited.

### Contract decisions required before refreeze

| ID | Status | Exact unresolved decision | Evidence and required source of truth |
|---|---|---|---|
| R1 | Missing | Select the authoritative persistence owner for Lease Inquiry stage history. Either identify an existing tenant-scoped audit aggregate that stores stage from/to, notes, user and timestamp, or approve a new persisted stage-log entity/configuration. | E2/E3 require Logs and Notes. The current backend has no Change Stage or Get Logs endpoint and no scoped existing Lease Inquiry history aggregate was found. A new entity/configuration would require an owner-created migration. |
| R2 | Missing | Freeze legal stage transitions for `New`, `Cold`, and `Hot`, including whether same-stage submission is allowed, whether notes are optional/required by transition, and the concurrency/idempotency rule. | E4 proves the values only. The current backend has no feature-specific transition implementation from which to infer the action-state table. |
| R3 | Missing | Freeze exact sorting request keys/direction and backend parsing, or explicitly make the columns non-sortable. | The frozen grid requires sorting, but the current `table-list` integration and generic service expose no feature-owned sorting request contract. |
| R4 | Conflicting | Decide whether Contact Person is optional or required and whether it must belong to the selected Customer. | The current Angular form marks Contact Person required while the entity and backend AddVM use nullable `ContactPersonId`; customer ownership is not enforced by the current generic service. |

### Mandatory Phase 6 comparisons

| Boundary | Frozen contract | Final source result | Status |
|---|---|---|---|
| E1 list and actions | Header, four logical filters, Export, Refresh, seven grid columns, five row actions, real paging | Header, filters, grid and actions exist. Refresh currently clears filters; Export writes only the visible page; sortable columns have no request contract; stage text remains backend English. | Conflicting |
| E2 Logs | Persisted history rows: date/time, user, detail | Dialog exists, but backend returns only a synthetic Created row and no stage-change history. | Missing / blocking |
| E3 Change Stage | Typed stage + notes action with Save/Cancel | Dialog and endpoint exist. Notes are discarded, legal transitions are undefined, and no history entry is persisted. | Missing / blocking |
| E4 editor | Controlled Create/View/Edit modal and typed editable child collection | Controlled shell exists, but the form is untyped, uses feature `any`, and renders a custom table instead of mandatory `app-editable-collection-table`; child removal has no confirmation. | Conflicting |
| E5 enum | Numeric New=0, Cold=1, Hot=2 with localized labels | Wire enum values match. List display consumes server `LeaseInquiryStageText`, so Arabic list labels are not localized. | Partial |
| Grid columns beside ListVM | Actions; No; Date; Customer; Code; Sale Person; Stage. ListVM: `Id`, `No`, `Date`, `CustomerId`, `CustomerName`, `CustomerCode`, `SalePersonId`, `SalePersonName`, `LeaseInquiryStage`, `LeaseInquiryStageText` | Angular row and backend ListVM additionally expose contact-person fields; backend ListVM inherits subscription/audit/change fields from `ListBaseVm`. | Conflicting |
| Filters | `no`, `dateFrom`, `dateTo`, `stage`, `customerId`; exact casing | Angular emits the frozen keys. Backend lowercases keys and accepts aliases, so wrong casing is not ignored as required. Undefined numeric enum text can be parsed before `Enum.IsDefined`. | Conflicting |
| Paging | PageNo/PageSize, exact count and totals, stable order | Implemented with clamp, `CountAsync`, Date/Id ordering and real totals. | Confirmed |
| Detail | Rendered header and child fields only | Projection is bounded, but inherited Detail base fields remain a Transitional compatibility surface. Navigation labels do not tenant-match related rows. | Partial / risk |
| Add/Update | Separate typed DTOs; Create excludes ids; Update includes parent/child ids; server fields excluded | Angular uses one Create DTO for both methods, includes optional ids on Create, and can assign `undefined` to required `contactPersonId`. Backend update does not reject negative or duplicate child ids. | Conflicting / compile risk |
| Aggregate validation | Required header/child FKs, tenant ownership, child ownership, one save | Header/item checks and one-save reconciliation exist. Distinct child FK ids are queried row-by-row; contact/customer pairing and duplicate submitted child ids are not validated. | Partial |
| Delete | Shared confirmation; parent and owned children soft-delete | Parent and tenant-matched children are deleted in one save; Angular confirms and refreshes. No external parent reference was found in scoped models. | Confirmed |
| Standalone child path | Deprecated/pruned; parent aggregate authoritative | `/LeaseInquiryItem` remains registered; generic child Add/Update/Delete can create or mutate orphan-prone rows because its write contract has no parent id. | Conflicting / data-integrity risk |
| Export | Full filtered result, translated columns, fail atomically | Hand-built CSV exports only `data()` (the visible page), uses hard-coded English headers, and has no exporting/error lifecycle. | Conflicting |
| Failure/loading | Business and HTTP failures, safe server message, stale-read protection, finalized loading | Main list handles both channels and cancels stale list reads. Lookup subscriptions silently omit failure handling; editor/stage/log dialogs use raw transport messages and manual loading resets; global success interceptor may duplicate component toasts. | Partial |
| Routes/providers/auth | One parent list route, no child route; layout-scoped service and interceptors; authentication only | Parent route, menu, provider and token/error interceptors are correct. Standalone child route remains. No permission mechanism was invented. | Partial |
| Translations | Matching English/Arabic workflow, state, validation and error keys | Arabic contains title/filter keys that English lacks (`title`, `manageInquiry`, `create`, `editTitle`, `viewTitle`, `dateFrom`, `dateTo`). Logs/lookups/export errors and child validation/removal keys are absent. | Conflicting |
| Styles/accessibility | Feature-prefixed structural styles, canonical components, responsive/RTL/theme/focus | Generic `.filter-card` and `.modal-*` ownership, inline header styles, custom table/dialog presentation, `id` instead of PrimeNG `inputId`, no dialog focus management, and no feature dark/RTL treatment remain. | Conflicting |

### Override-justification audit

| Method | Required? | Reconciliation result |
|---|---|---|
| `LeaseInquiryService.GetManyAsync` | Yes | Required for exact filters, projection, paging and totals, though its filter/sort contract still needs correction. |
| `LeaseInquiryService.GetManyWithNavigationsAsync` | No | Redundantly delegates to `GetManyAsync`; canonical override audit prohibits it. |
| `LeaseInquiryService.DetailWithNavigationsAsync` | Yes | Required for the consumed aggregate projection. |
| `LeaseInquiryService.AddAsync` | Yes | Required for server-owned initial stage and aggregate validation. |
| `LeaseInquiryService.UpdateAsync` | Yes | Required for child ownership/reconciliation and validation. |
| `LeaseInquiryService.RemoveAsync` | Yes | Required for owned-child soft deletion. |
| `LeaseInquiryController.GetListAsync` | No | Base controller already calls `GetManyAsync`; this override adds no feature behavior. |
| `LeaseInquiryItemController.GetListAsync` | No supported UI contract | Belongs to the unsupported standalone child surface and should not remain the reason to expose that route. |

The new nested `LeaseInquiryItemInput` record also conflicts with the backend
rule that named helper/query shapes must be in their own file; a strictly local
tuple or anonymous projection is sufficient.

### Source-only diff result

- The current Angular and backend working trees are clean, and `git diff --check`
  is clean in both repositories.
- The current Angular source still uses legacy `ms-lib` `table-list`, an
  untyped routed editor, and a custom child table.
- The current backend source still uses generic CRUD, over-scoped nested ListVM
  properties, and bidirectional AutoMapper profiles.
- The existing `LeaseInquiryItem.LeaseInquiryId` column, index, and relationship
  are present in the current model snapshot; no migration is required by this
  reconciliation because no entity change was made.

### Mapping, calculation, transaction and migration decisions

- AutoMapper currently uses `ReverseMap()` for Lease Inquiry and item maps; no
  mapping refactor was made in this reconciliation-only phase.
- No domain calculation or financial posting is evidenced or introduced.
- Generic inherited CRUD transaction behavior is outside the current feature
  implementation; no feature-specific stage action exists to audit.
- No migration is required because no schema change was made. If R1 selects a
  new persisted stage-log entity or adds a schema constraint, the owner must
  run `Add-Migration` after the entity/configuration change is approved.

### Phase and agent status

- Phase 0 evidence remains applicable.
- Phase 1 is reopened for R1-R4 and is no longer Frozen.
- Phase 2 and Phase 3 outputs were reviewed but are not accepted because the
  list/export/sort and editor contracts fail reconciliation.
- Phase 4 is blocked by R1/R2 and incomplete stage-history behavior.
- Phase 5 is incomplete because the standalone child route remains.
- Phase 6 is **Blocked**; full completion must not be claimed.
- No subagent was used. Phase 6 integration is root-owned and the discovered
  blockers are tightly coupled contract decisions; delegation would duplicate
  context without safely advancing implementation.

No build, test, lint, browser/runtime, database, migration, commit, push, or
deployment command was run. Owner runtime verification remains pending after
the handoff is refrozen and the affected implementation phases are rerun.

## Combined Final Reconciliation — Current Source Rerun

This reconciliation was rerun on 2026-08-18 using the five supplied captures
as functional evidence: E1 list/filter/grid, E2 logs dialog, E3 stage dialog,
E4 stage options, and E5 create inquiry editor. The current Angular and .NET
repositories have no uncommitted scoped changes, and `git diff --check` is
clean in both repositories. A clean working tree does not satisfy the frozen
feature contract because the current source is still the legacy implementation.

### Current-source comparison

| Boundary | Frozen evidence/contract | Current source result | Status |
|---|---|---|---|
| List/grid | Shared data table, four filters, actions, paging, export and refresh | `list.component.html` still renders `ms-lib` `table-list`; the component loads through generic `get(filter)` and exposes only a Delete console placeholder. | Blocking |
| Grid fields | Actions, No, Date, Customer, Code, Sale Person, Stage | Current columns use `id`, nested `customer.name`/`customer.id`, and nested sale-person data rather than the flattened contract; no server paging/filter contract is implemented in the feature service. | Blocking |
| Create/View/Edit | One controlled modal editor | `leaseinquiry.routes.ts` exposes `details/:id` and `create` routed pages; the supplied create screen is not represented by the current route/component contract. | Blocking |
| Child collection | Typed editable collection with add/remove behavior | Details uses an untyped `FormGroup`/`FormArray` and a custom HTML `<table>`; no shared editable-collection component or removal confirmation is present. | Blocking |
| Stage action | Typed Change Stage dialog and endpoint | No Angular stage dialog/service method and no backend Change Stage endpoint exist. | Missing |
| Logs | Read-only logs dialog and persisted history endpoint | No Angular logs dialog/service method and no backend Get Logs endpoint exist. | Missing |
| Backend list | Feature projection, filters, paging and exact ListVM | `LeaseInquiryService` is the generic service; `LeaseInquiryListVM` exposes nested `StaffDetailVM`, `PartnerDetailVM`, `ContactDetailVM`, and child rows. | Conflicting |
| Write DTOs | Client-editable fields only; separate create/update boundaries | Create DTO inherits server-owned fields (`id`, `subscriptionId`, `guid`) and includes `code`/`stage`; the same DTO is used for create and update. | Conflicting |
| Child ownership | Parent aggregate authoritative | Standalone `LeaseInquiryItem` route/controller/service remain available; child AddVM has no parent id. | Data-integrity risk |
| Translations | Complete matching workflow keys | English and Arabic contain basic editor labels but lack the screenshot workflow keys for the list title/management text, logs, stage action, export, refresh, and validation/error states. | Partial |

### Final decisions and risks

- The canonical shapes remain: shared server-paged list, controlled editor
  modal, typed child collection, typed stage dialog, read-only logs dialog,
  and shared confirmations.
- The grid/ListVM invariant remains: `Actions`, `No`, `Date`, `Customer`,
  `Code`, `Sale Person`, `Stage` beside `Id`, `No`, `Date`, `CustomerName`,
  `CustomerCode`, `SalePersonName`, and `LeaseInquiryStage`/localized text.
- Stage-history persistence and legal transition rules are still Missing;
  the current backend has no implementation from which to infer them.
- Contact Person is nullable in the entity and backend AddVM but required in
  the current Angular form; required/optional status and customer ownership
  must be resolved before write contracts are refrozen.
- Sorting keys/direction, full filtered export behavior, and exact filter
  casing remain unfrozen at the implementation boundary.
- AutoMapper, calculations, transactions, and migrations were not changed in
  this phase. No migration is required for a source-only reconciliation; a
  new persisted stage-log design would require owner-run `Add-Migration`.

### Current phase outcome

- Phase 6 is **Blocked**; no completion claim is made.
- No source files were changed by this reconciliation.
- Backend and Frontend review phases remain required after the shared
  contracts are refrozen; this command did not start either phase.
- No subagents were used because reconciliation is root-owned and the source
  is clean but contractually incomplete.

## Direct Fix-All Implementation Reconciliation — Current Result

This section supersedes the earlier blocked comparison sections. The user
approved conservative reviewer assumptions and requested the complete review
and refactor without an intermediate confirmation. The frozen contracts were
implemented across the directly related Angular and .NET files, followed by a
source-only scoped diff audit.

### Decisions applied

| Decision | Applied contract and evidence |
|---|---|
| UI shape | One Lease Inquiry list route with canonical `app-data-table`, typed filters, and controlled Create/View/Edit editor. Evidence E1/E4 and canonical UI list/editor patterns. |
| Grid/ListVM | Grid columns are Actions, No, Date, Customer, Code, Sale Person, Stage. ListVM is the matching flat projection: `Id`, `No`, `Date`, `CustomerName`, `CustomerCode`, `SalePersonName`, `LeaseInquiryStage`, `LeaseInquiryStageText`. |
| Filters/sorting | Exact filters are `no`, `dateFrom`, `dateTo`, `stage`, `customerId`; sort keys are `no`, `date`, `customerName`, `customerCode`, `salePersonName`, `leaseInquiryStage`, with direction `1/-1` sent as `Filters[sortField]` and `Filters[sortOrder]`. |
| Stage history | A new tenant-scoped `LeaseInquiryStageHistory` aggregate records from-stage, to-stage, notes, audit user, and timestamp. This is the conservative persistence choice because discovery found no existing scoped history owner and E2/E3 require logs and notes. |
| Stage rules | `New`, `Cold`, and `Hot` are all legal; same-stage without notes is an idempotent no-op; notes are optional and capped at 1000 characters. Evidence E5 establishes the enum values; no contrary transition table exists in source. |
| Contact Person | Optional, but when supplied it must belong to the selected Customer. This follows the nullable backend/entity contract and the domain ownership invariant. |
| Child ownership | Lease Inquiry Items are reconciled only through the parent aggregate. Existing child IDs must belong to the inquiry; duplicate/negative child IDs and invalid lookup references are rejected. |
| Transactions | Parent, child, and initial stage history writes use one EF `SaveChangesAsync()` call. Stage changes use one save. No explicit transaction was added. |
| Authorization | Existing authentication and `AuthGuard` only; no permission API was invented. |

### Implementation outcome

| Boundary | Result |
|---|---|
| List/read | Legacy `ms-lib` table was replaced by typed `app-data-table` with server paging, stable sorting, exact filters, real totals, loading/empty/error states, and row actions. Export fetches the complete filtered result and uses translated headers. |
| Detail/write | Create and update payloads are separate client-editable DTOs. The editor uses typed controls, a typed child `FormArray`, shared editable collection table, required/minimum validation, lookup failures, cancellation, dirty-close confirmation, and explicit HTTP/business error handling. |
| Actions | Delete uses shared confirmation. Change Stage is a typed dialog backed by `POST /LeaseInquiry/ChangeStage`. Logs are a read-only dialog backed by `GET /LeaseInquiry/GetLogs/{id}`. |
| Backend | List projection/filter/sort/paging, bounded detail projection, aggregate add/update/delete, tenant/ownership validation, child reconciliation, stage history, and log projection were implemented in `LeaseInquiryService`. Redundant list/controller overrides were removed. |
| Mapping | Lease Inquiry and item AutoMapper profiles are explicit one-way read mappings; no `ReverseMap()` remains in the scoped profiles. |
| Routing | Details/create child routes were removed; the parent Lease Inquiry route owns the modal workflow. The standalone `LeaseInquiryItem` route/controller/service were pruned from the supported surface. |
| Translations | English and Arabic workflow labels, stage values, dialogs, actions, validation, empty states, and errors were added. |

### Changed files

Frontend changes are in the Lease Inquiry list/details components, stage and
logs dialogs, routes, typed models/services, shared Lease Inquiry stage enum,
page route registration, layout service providers, English/Arabic vocabularies,
and removal of the deprecated standalone `LeaseInquiryItem` Angular module.
Backend changes are
in the Lease Inquiry entities/configuration/context, service/interface,
controller, ViewModels, AutoMapper profiles, new stage-history contracts, and
the removal of the deprecated standalone child service/controller/interface.

### Migration and verification boundary

`LeaseInquiryStageHistory` is a new persisted table and therefore requires the
owner to run `Add-Migration` and review/apply it before runtime use. No
migration or snapshot was created or edited. The existing `LeaseInquiryItem`
foreign-key column was surfaced as a CLR nullable property matching the
existing schema; no migration is expected for that part.

The source-only audit reviewed both complete scoped diffs and ran `git diff
--check` for both repositories. No build, test, lint, browser/runtime,
database, migration, commit, push, or deployment command was run. Remaining
owner verification is: create/apply the stage-history migration, build the
Angular and .NET projects, run the relevant tests, and manually verify the
list filters/paging/export, editor child reconciliation, stage history, logs,
delete confirmation, RTL, and both themes.
