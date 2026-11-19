# Item Issue (#159 — `/ItemIssue`) Access Adoption Contract Freeze

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-11-13 |
| Inventory Item | #159 — `ItemIssue` (`/ItemIssue`) |
| Discovery Evidence | [ITEM_ISSUE_ACCESS_DISCOVERY.md](<F:/My Work/Sigma/reviews/Authorization/ITEM_ISSUE_ACCESS_DISCOVERY.md>) |
| Prior Frozen Contracts | `reviews/ITEM_ISSUE_DOMAIN_API_CONTRACT_FREEZE.md` · `reviews/GRN_ITEM_ISSUE_APPROVAL_CONTRACT_FREEZE.md` · `reviews/STOCK_BRANCH_BALANCE_CONTRACT_FREEZE.md` |
| Owner Decisions Confirmed | **A1 (`Q1`)**: Separate `ItemIssue.Void` (`[PermissionCatalogAction("Void")]`, prerequisite `ItemIssue.View` + stored writable `BranchId`).<br>**A2 (`Q2`)**: Preserve `STOCK_BRANCH_BALANCE_CONTRACT_FREEZE.md:25` — `BranchId` remains editable on unapproved standalone drafts (`ItemIssue.Update` requires `Branch.Lookup`, `canTransact`, and active check on both stored and target branches). |

## 1. Operation, Prerequisite & Catalog Matrix

| Route / Endpoint | HTTP | Catalog Key | Fixed Prerequisites | Conditional Prerequisite | Branch Scope |
|---|---|---|---|---|---|
| `GET /api/ItemIssue` | `GetList` | `ItemIssue.View` | — | `itemIssueJobFilterSpecified` -> `Job.Lookup` | `ReadBranchIds` (`ItemIssue.BranchId`); masks unreadable/deleted `JobName = null` |
| `GET /api/ItemIssue/GetById/{id}` & `GetByWithNavigationsId/{id}` | `GetById` | `ItemIssue.View` | — | — | `ReadBranchIds` (`ItemIssue.BranchId`); masks unreadable/deleted `JobName = null` |
| `GET /api/ItemIssue/{id}/approval` | `Approval` | `ItemIssue.View` | — | — | Whole-document read (`BranchOperationRules.WholeDocumentReads`) |
| `POST /api/ItemIssue` | `Add` | `ItemIssue.Create` | `Job.Lookup`, `Branch.Lookup`, `Item.Lookup` | — | `ForTransactions` + `DemandBranchWrite(vm.BranchId)` + active `Branch`/`Job`/`Item` |
| `PUT /api/ItemIssue` | `Update` | `ItemIssue.Update` | `ItemIssue.View`, `Job.Lookup`, `Branch.Lookup`, `Item.Lookup` | — | `ForTransactions` + `DemandBranchWrite(entity.BranchId)` & `DemandBranchWrite(vm.BranchId)` + active checks |
| `DELETE /api/ItemIssue?id={id}` | `Remove` | `ItemIssue.Delete` | `ItemIssue.View` | — | `ForTransactions` + `DemandBranchWrite(entity.BranchId)` |
| `POST /api/ItemIssue/{id}/approval` | `DecideApproval` | `ItemIssue.ManageApproval` | `ItemIssue.View` | — | `ForTransactions` + `DemandBranchWrite(entity.BranchId)` |
| `POST /api/ItemIssue/{id}/void` | `Void` | `ItemIssue.Void` | `ItemIssue.View` | — | `ForTransactions` + `DemandBranchWrite(entity.BranchId)` |
| `HandleActivate`, `CheckUnique`, `GetSelect`, `GetAllWithNavigations` (plus bulk service `AddList`/`UpdateList`) | Generic | Not assignable (`PermissionEndpointResolver`) | — | — | Service returns `405 Method Not Allowed` (`ItemIssueOperationNotSupported`) |

- **HTTP inventory clarification (review 159):** `GetManyWithNavigationsAsync` is a
  service-only delegate to the paged list. The public list is `GET /api/ItemIssue`.
  Nonassignable inherited actions return 403 for an ordinary user at the
  authorization filter and 405 for an administrator who reaches the service.
  Bulk methods have service-level 405 results.

- **`itemIssueJobFilterSpecified` trigger (`PermissionPrerequisites.ItemIssue.cs`)**: triggers when `ListSmBase.Filters` supplies a non-whitespace `jobId`, `sortField == "jobName"` (case-insensitive), or `grid` contains columns targeting `jobName`, `jobId`, or `job.*` (or malformed/oversized JSON `> 16384` chars, failing closed).
- **Condition Labels**: register `itemIssueJobFilterSpecified` in `permission-dependencies.ts` and `i18n/vocabs/authorization.ts`:
  - `en`: `'When filtering or sorting item issues by job'`
  - `ar`: `'عند تصفية أو فرز سندات صرف الأصناف حسب أمر الشغل'`

## 2. Backend Read, Filter, Sort, Grid & Write Hardening (`SigmaBackend`)

- **ViewModels & Mapping (`ItemIssueListVm.cs`, `ItemIssueDetailVm.cs`, `ItemIssueProfiler.cs`)**:
  - Add `public int? BranchId { get; set; }` onto `ItemIssueListVM` (inherited cleanly by `ItemIssueDetailVM`) so row action buttons in the UI evaluate `canTransact(row.branchId)`.
  - Add `public int? BranchId { get; set; }` onto `ItemIssueApprovalVM` so `ApprovalCycleComponent` always has authoritative branch scope for `canApprove` / `canReject` / `canVoid`.
- **BE9 List Filter, Sort & Grid Allow-Lists (`ItemIssueService`)**:
  - Allowed `Filters` keys (`StringComparer.OrdinalIgnoreCase`): `"no"`, `"dateFrom"`, `"dateTo"`, `"jobId"`, `"grid"`, `"sortField"`, `"sortOrder"`. Any other key (e.g., nested paths like `Job.VehicleId`, `ItemIssueItems.*`, `Branch.*`) throws `GridFilterException("GridFilterUnsupportedField")`.
  - Allowed `sortField` values (`ToLowerInvariant()`): `"id"`, `"no"`, `"dateandtime"`, `"jobname"`, `"branchname"`, `"approvalstatus"`. Any other sort field throws `GridFilterException("GridFilterUnsupportedField")`.
  - `"sortOrder"`: must parse as `1` or `-1` -> else `GridFilterException("GridFilterInvalidValue")`. Non-empty `jobId` must parse as integer `> 0`; non-empty `dateFrom` / `dateTo` must parse cleanly via `FilterHelper.GetDateTimeUtc` -> else `GridFilterException("GridFilterInvalidValue")`.
  - `GridFilter`: whitelist only list display fields (`no`, `dateAndTime`, `jobName`, `branchName`, `approvalStatus`, `isLegacyUnproven`, `isVoided`) and reject `Id`, `BranchId`, `CanEdit`, `CanDelete`, `CanApprove`, `CanReject`, `CanVoid`, and any nested navigation path (`GridFilterUnsupportedField`) before SQL execution.
  - Project list & detail in explicit SQL `Select` (`ProjectList`, `ProjectDetail`) without full navigation graphs: `JobName` comes from `UnitOfWork.Repository.Query<Job>().AsNoTracking()`, preserving the `ItemIssue` row while returning `JobName = null` whenever the `Job` is out-of-branch or soft-deleted.
- **BE8 Scope, Non-Null Branch & Active Reference Enforcement (`ItemIssueService`)**:
  - Inject `IHttpContextAccessor` + `BranchAccessContext`. Call `DemandRequestScope()` on every public read and write entrypoint.
  - Call `DemandBranchWrite(...)` on `AddAsync` (`addVm.BranchId`), `UpdateCoreAsync` (both `entity.BranchId` and `updateVm.BranchId`), `RemoveAsync` (`entity.BranchId`), `DecideApprovalCoreAsync` (`entity.BranchId`), and `VoidCoreAsync` (`entity.BranchId`) — explicitly rejecting any record with missing/non-positive `BranchId` via `BranchAccessDeniedException`.
  - Verify referenced `Branch` (`IsActive != false`), `Job` (`Query<Job>()`, active if changed/new), and `Item`s (active `IsActive != false` on new additions or changed line `ItemId`, while permitting unchanged existing lines when updating an unapproved draft).
  - Return `405 ItemIssueOperationNotSupported` (`GeneralMessage.resx` & `GeneralMessage.ar-SA.resx`) on `HandleActiveAsync`, `AddListAsync`, `UpdateListAsync`, `CheckUniqueAsync`, `GetAllWithNavigationsAsync`, `SelectAsync`.
- **Master 5 Query & Index Notes**:
  - No EF schema migration required (`ItemIssueConfig` already indexes `(SubscriptionId, BranchId)` and `(SubscriptionId, ApprovalStatus, IsVoided, ApprovedAt)`). All filtering/sorting executes in SQL via indexed `SubscriptionId` + `BranchId` (`ApplyBranchFilter`) and date bounds prior to paging.

## 3. Frontend Access, Route, Overlay, State & Guide Contract (`SiGmaAngularFrontEnd`)

- **Access Definitions (`item-issue-access.ts` + `tsconfig.app.json`)**:
  - `view: 'ItemIssue.View'`, `create: ['ItemIssue.Create', 'Job.Lookup', 'Branch.Lookup', 'Item.Lookup']`, `edit: ['ItemIssue.View', 'ItemIssue.Update', 'Job.Lookup', 'Branch.Lookup', 'Item.Lookup']`, `delete: ['ItemIssue.View', 'ItemIssue.Delete']`, `manageApproval: ['ItemIssue.View', 'ItemIssue.ManageApproval']`, `void: ['ItemIssue.View', 'ItemIssue.Void']`, `lookups: { job: 'Job.Lookup', branch: 'Branch.Lookup', item: 'Item.Lookup' }`.
- **Routing (`route-access-policy.ts`, `itemissue.routes.ts`)**:
  - Register `/itemissue` (`itemIssueAccess.view`), `/itemissue/create` (`itemIssueAccess.create`), `/itemissue/details` (`itemIssueAccess.view`, `match: 'prefix'`) and add `'/ItemIssue'`, `'/ItemIssue/create'` to `firstAllowedRoute`.
  - Mount `/ItemIssue/create` directly with `{ path: 'create', component: ItemIssuesComponent, canDeactivate: [preventUnsavedExit], data: { editorMode: 'create' } }`. On `/ItemIssue/create`, Create-only users must never trigger `GET /api/ItemIssue` or list `Job/GetSelect`.
- **List Screen (`list.component.ts` & `.html`)**:
  - Adopt `AccessViewPolicyService` (`ownerContext`, `ownerSession`, `contextVersion`, `semanticRevisionChanged`, `cancelReads`, `denied$`) + `CurrentBranchService` (`canTransact`).
  - Gate host container cleanly (`!editorVisible() && !reportQuery()`) with `AppStateMessageComponent`, `[hidden]`, and `[attr.inert]`.
  - **Optional `Job.Lookup` in filters/grid**: Only call `JobService.getSelectList` when `canLookupJob()`. If `Job.Lookup` is absent or withdrawn, clear job options, clear `jobId` control and `activeJobId`, strip `jobName`/`jobId` from grid filter/sort if present, disable the `<p-select>`, close overlays (`jobFilterSelect.hide()`, `dateRangePicker.hideOverlay()`), and issue one clean unfiltered list read without blocking Search.
  - Combine row action visibility (`Edit` / `Delete` / decision capabilities) with `currentBranch.canTransact(row.branchId)`; recheck permission + writable branch + context version + row membership after delete confirmation (`defaultIfEmpty(false)` after `takeUntil(...)`) and pass `CAN_PRESENT_API_OUTCOME` on `remove`; keep `reconcileList` working when `View` remains even if `Delete` is revoked mid-request.
- **Details Modal (`details.component.ts` & `.html`)**:
  - Bind `<app-editor-dialog>` with `[accessRequirement]`, `[accessBlocked]`, `[accessBlockedMessage]`, `[primaryActionVisible]`, `[primaryActionDisabled]`.
  - Track `ownerContext`, `ownerSession`, `identityVersion`, `semanticRevisionChanged`, `expireContext`, `expireAccess`, `restoreAccess`, `refreshSemanticRevision` (`UI28` — keep dirty draft safe during transient access/lookup changes).
  - Filter selectable `Branch` options using `CurrentBranchService` writable branches (`canTransact`), applying `CurrentBranchService.applyDefault` in Create mode while keeping a non-writable saved branch label disabled in view/fallback without making it selectable for Save (`canSave` checks writable branch).
  - Fix `loadDetails` (`takeUntil` before any fallback), commit focused controls before dirty check in `canDeactivate`, place `defaultIfEmpty(false)` AFTER `takeUntil(...)` (`UI10`), close all `<p-select>` and `<p-datepicker>` overlays on access/context loss (`UI16`), and apply `CAN_PRESENT_API_OUTCOME` + `saveCommitted` on `save()`.
- **Approval Cycle (`approval-cycle.component.ts` & `.html`)**:
  - Separate read (`ItemIssue.View`), `Approve`/`Reject` (`ItemIssue.ManageApproval` + `CurrentBranchService.canTransact(branchId)`), and `Void` (`ItemIssue.Void` + `CurrentBranchService.canTransact(branchId)`).
  - Adopt `AccessViewPolicyService` lifetime (`cancelReads`, `semanticRevisionChanged`, `denied$`, `ownerContext`, `ownerSession`), preserve cancel-movement reason draft across transient revocation, recheck grant + writable branch after confirmation dialogs, and use `CAN_PRESENT_API_OUTCOME` on mutations.
- **Report (`report.component.ts` & `.html`)**:
  - Adopt `AccessViewPolicyService` (`ownerContext`, `ownerSession`, `contextVersion`, `semanticRevisionChanged`) + `ReportPrintSession` with `canPrint` final-frame check (`UI21`).
- **User Guide (`UserGuide/content/stock-guide.ts`) & Specs**:
  - Update `#159 ItemIssue` entry in `STOCK_TOPICS` (EN + AR).
  - Add backend contract tests (`tests/SiGma.BranchAccess.Tests/ItemIssueAccessContractTests.cs`) and frontend behavioral specs (`item-issue-access.spec.ts`, `list.component.spec.ts`, `details.component.spec.ts`, `approval-cycle.component.spec.ts`, `report.component.spec.ts`, plus `route-access-policy.spec.ts` and `permission-dependencies.spec.ts`).
