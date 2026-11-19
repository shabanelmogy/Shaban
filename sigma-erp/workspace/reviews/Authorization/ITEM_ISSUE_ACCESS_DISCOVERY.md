# Item Issue (#159 — `/ItemIssue`) Authorization & Access Discovery

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-11-13 |
| Inventory Item | #159 — `ItemIssue` (`/ItemIssue`) |
| Screen Shapes | UI Type `01` (`ui/screens/01-list-with-modal-editor.md`, list + controlled `app-editor-dialog` modal + `app-item-issue-report` modal + embedded/modal `app-item-issue-approval-cycle`, retaining existing `STOCK_BRANCH_BALANCE_CONTRACT_FREEZE.md` single-list editor exception) · Backend Pattern `2` (`backend/00-preamble.md` Master-detail, no financial effect, with operational approval and void lifecycle) |
| Prior Frozen Feature Contracts | `reviews/ITEM_ISSUE_DOMAIN_API_CONTRACT_FREEZE.md` (2026-10-04) · `reviews/GRN_ITEM_ISSUE_APPROVAL_CONTRACT_FREEZE.md` (2026-10-21) · `reviews/STOCK_BRANCH_BALANCE_CONTRACT_FREEZE.md` (2026-10-21) |
| Canonical References | `SIGMA_FEATURE_REVIEW_MASTER.md` (Master 1/2/4/5/7) · `SIGMA_BACKEND_PATTERNS.md` (BE1–3, BE5, BE7–10, BE14, BE18) · `SIGMA_UI_PATTERNS.md` (UI1–2, UI4–8, UI10, UI13, UI16–17, UI19–29) · `Generate-SigmaRecipes.ps1 -Check` passed (8/8 `OK`) |
| Route Inventory Reference | `reviews/Authorization/ROUTE_PERMISSION_ADOPTION_INVENTORY.json:4533-4560` (`ItemIssue`, currently `resource-only`; current confirmed baseline `158/263`). Note: unrelated legacy redirect route `ItemIssueItem` at `:4623` (`unknown`) and already-confirmed `ItemIssueReport` at `:5003` (`StockReports.GetItemsIssueReport`) are out of `#159` modification scope. |

## 1. Opening Reference & Verification Boundary (Master 1 / Master 2)

| Source / Check | Evidence & Location | Applicability & Mapping to `#159 ItemIssue` |
|---|---|---|
| Speed Guide & Original Explanations (`2026-10-27`) | `references/speed-analysis/2026-10-27/library/catalog.csv` + `2026-10-27/Speed_Analysis_Guide.md:281` | Chapter 13 mentions workshop spare parts & stock generally; no standalone `Item Issues` user-guide article exists in the `2026-10-27` archive. |
| Speed Sidebar & Code (`2026-10-28`) | `references/speed-analysis/2026-10-28/data/sidebar-screen-map.csv:111` (`Stock > Item Issues`, route `tenant.CRS_Issues`, `sidebar/15-stock/screens/05-item-issues.md`, `R0568--tenant-crs-issues.js`), `workflows/02-workshop-stock-and-finance.md`, `readable/controllers/C1679--tenant.views.stock.itemIssues.index.js` (`raw/application.js:464754-465034`), `C1678--tenant.views.stock.itemIssues.createOrEditModal.js` (`raw/application.js:464559-464750`). | Speed list has `voucherNo`, `dateRange`, `jobId` filters, `Actions/voucherNo/date/job` columns, report & Excel, and Edit/Delete gated on open Job status (`job.status == 1`). Speed lacked Sigma's `BranchId`, `ApprovalStatus`, `Void`, and `ItemIssue` ERP permission catalog keys; Sigma's prior frozen contracts (`ITEM_ISSUE_DOMAIN_API`, `GRN_ITEM_ISSUE_APPROVAL`, `STOCK_BRANCH_BALANCE`) + Master/BE/UI authorization books govern those additions. |
| Odoo 19.0 Complement (`2026-11-02`) | `references/odoo-rental/README.md` | Covers Rental (`11` pages) and Fleet (`7` pages) only — not applicable to Stock Issue authorization rules. |
| Skills & Superpowers | `.agents/skills/sigma-screen-refactor/SKILL.md` read & applied. Checked `C:\Users\user\.gemini` and `F:\My Work\Sigma\.agents` — Superpowers is not installed. | Domain routing uses Sigma's canonical docs + live `.agents/SIGMA_WORKFLOW_RULES.md`. |
| Verification Boundary | Source-only inspection so far; scoped builds (`dotnet build --no-restore`, `npm run build`, `npx tsc --noEmit -p tsconfig.spec.json`), `git diff --check`, and `Generate-SigmaRecipes.ps1 -Check` authorized upon implementation; `dotnet test`, `ng test`, `ng lint`, DB/SQL/EF migration commands, browser checks, `commit`, and `push` remain unauthorized unless separately requested. | Runtime, SQL translation, lock concurrency, and UI visual acceptance remain owner-pending. |

## 2. Backend Discovery (`SigmaBackend`)

### 2.1 Existing Controller, Endpoints, Scope & Callers
- **Controller (`SiGma.ServerAPI/Controller/ItemIssueController.cs:1-28`)**:
  - Inherits `SiGmaControllerBase<ItemIssueAddVM, ItemIssueUpdateVM, ItemIssueDetailVM, ItemIssueListVM, IItemIssueService>`.
  - Standard inherited routes (resolved via `PermissionEndpointResolver.cs`):
    - `GET /api/ItemIssue` (`GetAllAsync` -> `ItemIssue.View`)
    - `GetManyWithNavigationsAsync` is service-only. The public list route above owns the `ItemIssue.View` grant.
    - `GET /api/ItemIssue/GetById/{id}` & `GET /api/ItemIssue/GetByWithNavigationsId/{id}` (`ItemIssue.View`)
    - `POST /api/ItemIssue` (`AddAsync` -> `ItemIssue.Create`)
    - `PUT /api/ItemIssue` (`UpdateAsync` -> `ItemIssue.Update`)
    - `DELETE /api/ItemIssue?id={id}` (`DeleteAsync` -> `ItemIssue.Delete`)
    - Currently assignable generic endpoints with NO in-scope consumers: `HandleActivate`, `CheckUnique`, `GetSelect`, `GetAllWithNavigations` (plus bulk service overrides `AddListAsync`, `UpdateListAsync`).
  - Explicit custom routes:
    - `GET /api/ItemIssue/{id:int}/approval` -> `ApprovalAsync` (`[PermissionCatalogAction("View")]` -> `ItemIssue.View`, registered in `BranchOperationRules.WholeDocumentReads` as `"ItemIssue.Approval"` at line `99`).
    - `POST /api/ItemIssue/{id:int}/approval` -> `DecideApprovalAsync` (`[PermissionCatalogAction("ManageApproval")]` -> `ItemIssue.ManageApproval`).
    - `POST /api/ItemIssue/{id:int}/void` -> `VoidAsync` (currently annotated `[PermissionCatalogAction("Update")]` — **Blocking Question Q1**).
- **Entity & EF Configuration**:
  - `SiGma.Helpers/Models/Stocks/ItemIssue.cs:3-56`: `DateAndTime`, nullable `int? BranchId`, nullable `int? JobId`, `ApprovalStatus? ApprovalStatus` (default `NotApproved`), `ApprovedAt`, `IsVoided`, `VoidReason`, `VoidedAt`, `ItemIssueItems`, `ApprovalLogs`. Domain methods enforce transitions (`RecordApprovalDecision`, `Void`, `VoidLinkedDraft`).
  - `SiGma.DataAccess/Configuration/ItemIssueConfig.cs:1-17`: `HasOne(x => x.Branch).WithMany().HasForeignKey(x => x.BranchId).OnDelete(DeleteBehavior.Restrict)` and indexes `(SubscriptionId, BranchId)` and `(SubscriptionId, ApprovalStatus, IsVoided, ApprovedAt)`. **No EF schema migration is needed** for `#159` authorization adoption.
- **Branch Scope (`SiGma.DataAccess/Authorization/BranchScopeRegistry.cs`)**:
  - Line `52`: `BranchScopeDefinition.Direct<ItemIssue>("BranchId")`.
  - Lines `562-565`: `ItemIssueItem` scoped to parent `ItemIssue` (`BranchId`); `SiGmaDbContext.BranchAccess.cs` enforces direct branch write scope on `ItemIssue` & `ValidateItemIssueTargetsAsync`.
  - Line `74`: `BranchScopeDefinition.Direct<Job>("BranchId")`. `Job` is branch-scoped (`ReadBranchIds`).
  - `Branch` has `ApplyBranchFilter` (`ReadBranchIds`); `Item` is tenant-shared (`IsDeleted != true`).
- **Downstream / Cross-feature Consumers (`git grep` verified)**:
  - `GoodsReceivedNoteService.cs` & `ItemRequisitionService.cs` create/read `ItemIssue` directly through `UnitOfWork` (those controllers/screens belong to separate inventory items).
  - `ItemIssueItemService.cs:1-62` already blocks standalone child creation/activation and protects header-owned rows (`ItemIssueUseAggregateEditor`).
  - `StockReportsService.cs` & `StockBranchBalanceReader.cs` read `ItemIssue` via `QueryReport<ItemIssue>()`.

### 2.2 Confirmed Backend Authorization & Hardening Gaps
1. **Unprotected List Query / Filter / Sort (`BE9`) in `ItemIssueService.cs:14-61`**:
   - `ItemIssueService` currently inherits `Service.GetManyAsync` and `ApplyGridFilters` without a filter-key or sort-field allow-list. An actor with `ItemIssue.View` can submit filters or sorts targeting non-list/nested entity properties (or internal `Job`/`Item` sub-fields, e.g. via `Filters[jobId]` even when lacking `Job.Lookup`, or arbitrary `sortField` / `Filters[grid]` keys).
   - `GetManyWithNavigationsAsync` duplicates paging/sorting/projection manually instead of delegating to a hardened `GetManyAsync`, and `MaterializeListAsync` projects `ItemIssueListVM` without explicit pre-materialized allow-list guards.
2. **Missing `BranchId` on `ItemIssueListVM` (`SiGma.ViewModels/ViewModels/ItemIssue/ItemIssueListVm.cs:3-18`)**:
   - `ItemIssueListVM` exposes `BranchName` but omits `BranchId` (`ItemIssueDetailVM` currently declares `int? BranchId`). Without `BranchId` on list rows, the UI cannot combine `canEdit`/`canDelete`/`canApprove`/`canReject`/`canVoid` with `CurrentBranchService.canTransact` (`UI26` row branch capability check).
3. **Missing `PermissionEndpointResolver` Exclusions & `405` Method-Not-Allowed Enforcement**:
   - `PermissionEndpointResolver.cs` has no exclusion rule for `ItemIssue`'s unused generic endpoints (`HandleActivate`, `CheckUnique`, `GetSelect`, `GetAllWithNavigations`).
   - `ItemIssueService` should explicitly return `405 Method Not Allowed` (`ItemIssueOperationNotSupported`) for `HandleActiveAsync`, `CheckUniqueAsync`, `SelectAsync`, `GetAllWithNavigationsAsync`, `AddListAsync`, and `UpdateListAsync`, and delegate `GetManyWithNavigationsAsync` to `GetManyAsync`.
4. **Missing `PermissionPrerequisites.cs` Entries**:
   - `ItemIssue.View`: requires conditional `Job.Lookup` (`itemIssueJobFilterSpecified`) when list requests use `jobId`, `sortField == "jobname"`, or `grid` targeting `jobName` / `jobId`.
   - `ItemIssue.Create`: fixed `[Job.Lookup, Branch.Lookup, Item.Lookup]`.
   - `ItemIssue.Update`: fixed `[ItemIssue.View, Job.Lookup, Item.Lookup]` (+ `Branch.Lookup` conditional or fixed depending on **Blocking Question Q2**, plus any conditional impact of **Blocking Question Q1** if `Void` stayed on `Update`).
   - `ItemIssue.Delete`: fixed `[ItemIssue.View]`.
   - `ItemIssue.ManageApproval`: fixed `[ItemIssue.View]`.
   - `ItemIssue.Void` (if split in **Q1**): fixed `[ItemIssue.View]`.
5. **Service-boundary Write / Scope / Active-Reference Checks (`BE8`)**:
   - Inject `IHttpContextAccessor` + `BranchAccessContext` (`DemandRequestScope()` & `DemandBranchWrite(...)`) cleanly across `AddAsync`, `UpdateCoreAsync`, `RemoveAsync`, `DecideApprovalCoreAsync`, and `VoidCoreAsync` (including rejecting any row with missing/non-positive `BranchId`, active check `!branch.IsDeleted && branch.IsActive` for target branches, active `Item` check on new/changed selections if applicable, and keeping `Query<Job>()` / `Query<Branch>()` scoped cleanly).
   - Ensure `DetailAsync` / `DetailWithNavigationsAsync` (`ReadDetailAsync`) filter `Branch` and `Item` references cleanly (`SubscriptionId == tenantId && IsDeleted != true`) and preserve the readable `ItemIssue` row while masking an unreadable/deleted `Job` (`JobName = null`).
6. **Master 5 Query & Index Notes**:
   - `ItemIssueConfig` already indexes `(SubscriptionId, BranchId)` and `(SubscriptionId, ApprovalStatus, IsVoided, ApprovedAt)`. List queries filter by `SubscriptionId`, `BranchId` (`ApplyBranchFilter`), optional `DateAndTime` range, `No`, `JobId`, and `GridFilter.Apply` in SQL before `CountAsync`, ordering, and paging. Detail reads project scalars + owned items in one `AsNoTracking()` query without full navigation graphs. **No new EF migration proposed.** (Wait for owner runtime SQL-plan verification under heavy tenant data: a future optional covering index `(SubscriptionId, BranchId, DateAndTime, Id) WHERE IsDeleted = 0` may be considered later if needed.)

## 3. Frontend Discovery (`SiGmaAngularFrontEnd`)

### 3.1 Existing Components, Routes & Services
- `src/app/modules/Stock/ItemIssue/itemissue.routes.ts:1-17`: `create` and `details/:id` currently redirect via `CanActivateFn` (`legacyCreate` / `legacyDetails`) to `/ItemIssue?editor=...`.
- `src/app/modules/Stock/ItemIssue/services/itemissue.service.ts:1-58`: `getList`, `getAllList`, `getDetails`, `create`, `update`, `remove`, `getApproval`, `changeApproval`, `voidIssue`; mutation methods lack optional `HttpContext`.
- `src/app/modules/Stock/ItemIssue/components/list/list.component.ts` & `.html`: loads `JobService.getSelectList`, binds `filterForm` (`no`, `jobId`, `dateRange`), `DataTableComponent`, row actions (`viewDetails`, `edit`, `approval.statusAction`, `delete`), `openReport`, `exportExcel`, and nested `<app-item-issue-details>`, `<app-item-issue-approval-cycle>`, `<app-item-issue-report>`.
- `src/app/modules/Stock/ItemIssue/components/details/details.component.ts` & `.html`: modal editor with `basic` (`dateAndTime`, `branchId`, `jobId`, `itemRequisitionNo`), `items` (`itemId`, `quantity`), and `approval` (`<app-item-issue-approval-cycle>`) tabs; consumes `JobService`, `BranchService`, `ItemService`, and `CurrentBranchService`.
- `src/app/modules/Stock/ItemIssue/components/approval-cycle/approval-cycle.component.ts` & `.html`: manages Approve/Reject confirmations and nested Cancel Movement (`Void`) reason modal.
- `src/app/modules/Stock/ItemIssue/components/report/report.component.ts` & `.html`: prints full list via `ReportPrintService`.

### 3.2 Confirmed Frontend Authorization & Lifecycle Gaps (`UI26 / UI28 / UI16 / UI10 / UI21 / UI22`)
1. **No `item-issue-access.ts` & Fail-Closed Routing (`route-access-policy.ts`)**:
   - `/itemissue`, `/itemissue/create`, `/itemissue/details` are unmapped in `RouteAccessPolicyRegistry` and `firstAllowedRoute`, blocking ordinary users.
   - `legacyCreate` redirect fails for Create-only users (`ItemIssue.Create` + lookups without `ItemIssue.View`); `/ItemIssue/create` must mount directly under `itemIssueAccess.create` (matching `#154`, `#158`) without firing `GET /ItemIssue` or `Job/GetSelect` list reads when `ItemIssue.View` is absent.
2. **Unadopted `AccessViewPolicyService` & Context/Session Expiry across List, Details, Approval, and Report**:
   - None of the 4 components check `AccessViewPolicyService` grants, `dataContext()`, `readAuthSessionKey()`, `revision()`, or `denied$`.
   - `ItemIssueListDTO` lacks `branchId`, so List row actions (`Edit`, `Delete`, `Approval` decision buttons) do not check `CurrentBranchService` writable branch (`canTransact`).
   - Open body-appended `<p-select>` and `<p-datepicker>` overlays stay visible if list/editor access or session context expires (`UI16`/`UI26`).
   - Optional List `jobId` filter selector (`Job.Lookup`): currently `loadJobs()` runs unconditionally even without `Job.Lookup`; when `Job.Lookup` is absent or withdrawn, List must NOT call `Job/GetSelect`, must clear any `jobId` filter / `jobName` column grid filter, and trigger one clean unfiltered read without blocking search (`UI16`/`#157`/`#158`).
   - `DetailsComponent`: `<app-editor-dialog>` lacks `[accessRequirement]`/`[accessBlocked]`, `loadDetails` places `defaultIfEmpty(null)` BEFORE `takeUntil`, `loadLookups` merges branch options without filtering writable `canTransact` branches for selection, blur input on focused controls is not committed before `canDeactivate` dirty check, `defaultIfEmpty(false)` on dirty-exit confirmation needs to follow `takeUntil`, and sent-save settlement / refresh must follow `UI28` + `CAN_PRESENT_API_OUTCOME`.
   - `ApprovalCycleComponent`: needs separate read (`ItemIssue.View`) and decision (`ItemIssue.ManageApproval` / Void grant) + writable branch checks, `denied$` cancellation, reason draft preservation, regrant reload, `CAN_PRESENT_API_OUTCOME`, and post-confirmation recheck.
   - `ItemIssueReportComponent`: needs `ItemIssue.View` access/context expiry cancellation and `ReportPrintSession.canPrint` final-frame check (`UI21`/`#158`).
3. **Condition Labels, Tests & User Guide**:
   - Register condition keys in `permission-dependencies.ts` and `i18n/vocabs/authorization.ts` (`en` & `ar`), add `#159 ItemIssue` route/branch/permission guidance to `UserGuide/content/stock-guide.ts`, and replace placeholder `.spec.ts` files with full authorization & lifecycle specs (also adding `item-issue-access.ts` to `tsconfig.app.json`).

## 4. Open Decisions Blocking Contract Freeze (`SIGMA_WORKFLOW_RULES.md`)

1. **Q1 — `POST /ItemIssue/{id}/void` Permission Key (`ItemIssue.Void` vs `ItemIssue.Update`)**:
   - Existing `ItemIssueController.cs:24` annotates `VoidAsync` with `[PermissionCatalogAction("Update")]`, merging approved stock-movement cancellation into draft editing (`ItemIssue.Update`).
   - Every adopted voidable document in `ReviewedPermissionOperations.cs` uses `<Resource>.Void` (`Bill.Void`, `Invoice.Void`, `JournalVoucher.Void`, `Payment.Void`, `Receipt.Void`, `LeaseAgreement.Void`, `RentalAgreement.Void`, `EquipmentRentalInvoice.Void`, `Accruals.Void`, `Amortization.Void`, `CurrencyRevaluation.Void`, `PayrollDisbursement.Void`), and `GRN_ITEM_ISSUE_APPROVAL_CONTRACT_FREEZE.md:15` defines Void as a *"separately guarded and audited operational action"*.
   - **Recommended**: Change `VoidAsync` to `[PermissionCatalogAction("Void")]` (`ItemIssue.Void`, with prerequisite `ItemIssue.View` + stored branch `canTransact`). **Alternative**: Keep `[PermissionCatalogAction("Update")]` (requires clarifying lookup prerequisites when `Update` calls `Void`).
2. **Q2 — `BranchId` Mutability on Unapproved Draft `Update` (`PUT /ItemIssue`)**:
   - Existing `STOCK_BRANCH_BALANCE_CONTRACT_FREEZE.md:25` (2026-10-21) and `ItemIssueUpdateVM.cs:6` / `details.component.html:70` allow changing `BranchId` on an unlinked, unapproved standalone draft (`NotApproved && !IsVoided`, before stock deduction), which requires `Branch.Lookup` on `Update` and `canTransact` on both current saved `entity.BranchId` and new active `vm.BranchId`.
   - Recent execution/document branch adoptions (`#154–155 StaffTimesheet`, `#157 StaffDutySchedule`, `EquipmentQuotation`, `CustodyMovement`, `DeliveryMovement`, `WorkshopMovement`) lock `BranchId` at creation (`Create`-only) so a document never migrates across branches on `Update` (removing `BranchId` from `Update` and dropping `Branch.Lookup` from `ItemIssue.Update`).
   - Needs explicit owner confirmation before freezing `ItemIssueUpdateVM`, `ItemIssueUpdateDTO`, `PermissionPrerequisites`, and `details.component.*`.
