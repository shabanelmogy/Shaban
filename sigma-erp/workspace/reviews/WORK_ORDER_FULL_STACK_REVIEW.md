# Work Order Full-Stack Review and Implementation Report

**Feature:** Workshop Work Order (`src\app\modules\Workshop\WorkOrder` & `SiGma.Helpers\Models\Workshops\WorkOrders`)  
**Scope:** Full-Stack (Angular 17+ Frontend & .NET 9 Backend)  
**Status:** Completed & Source Verified  

---

## 1. Feature Review Manifest

| Area | Detail |
|---|---|
| Domain Entity | `WorkOrder` & `WorkOrderItem` (`SiGma.Helpers\Models\Workshops\WorkOrders`) |
| Backend Controller | `WorkOrderController` (`SiGma.ServerAPI\Controller\WorkOrderController.cs`) |
| Backend Service | `WorkOrderService` (`SiGma.Business\Services\WorkShopServices\WorkOrderService.cs`) |
| Backend DTOs | `WorkOrderAddVM`, `WorkOrderUpdateVM`, `WorkOrderDetailVM`, `WorkOrderSearchRequestDto`, `WorkOrderSearchListDto` |
| Frontend Module | `src\app\modules\Workshop\WorkOrder` |
| Frontend Components | `WorkOrdersComponent` (list), `WorkOrderDetailsComponent` (editor dialog) |
| Frontend Service | `WorkOrderService` (`services\workorder.service.ts`) |

---

## 2. Evidence Classification & Visual Mapping

Four user screenshots were analyzed:

1. **Screenshot 1 (`media_1790263596136.png` - Work Orders List):**
   - **Page Title:** `Work Orders` / Subtitle: `Manage Work Orders` / Primary Action: `+ CREATE NEW WORK ORDER`.
   - **Filter Strip (Compact 3-Row):**
     - Row 1: `Work Order No`, `Customer's PO No`, `Status` (default: Open), `Acceptance Status` (All/Accepted/NotAccepted/Rejected).
     - Row 2: `Date Range` (from - to), `Vehicle`, `Customer`.
     - Row 3: `Branch`, `Chassis No`, and right-aligned buttons: `REPORT`, `EXPORT TO EXCEL`, `SEARCH`.
   - **Data Table:**
     - Columns: `Actions`, `No` (with Acceptance badge), `Date`, `Customer`, `Customer No`, `Branch`, `Vehicle`, `Total Amount`, `Discount`, `Net Amount`, `Status`.
     - Pagination at bottom.

2. **Screenshot 2 (`media_1790263596138.png` - Actions for `NOT ACCEPTED` Row):**
   - Row status: `NOT ACCEPTED` (red badge).
   - Menu items: `View`, `Edit`, `Accept`, `Reject`, `Print`, `Delete`.

3. **Screenshot 3 (`media_1790263596143.png` - Actions for `ACCEPTED` Row):**
   - Row status: `ACCEPTED` (green badge).
   - Menu items: `View`, `Create Job` (deferred per user instruction), `Print`, `Delete`.
   - Notice: `Edit`, `Accept`, and `Reject` are suppressed once accepted.

4. **Screenshot 4 (`media_1790263596178.png` - Create New Work Order Dialog):**
   - Dialog Title: `Create New Work Order` / `Edit Work Order` / `Work Order Details`.
   - Header fields: `Date` (default today), `Customer's PO No`, `Notes`, `Customer`, `Branch`.
   - Line items table: `(Delete icon)`, `DESCRIPTION`, `VEHICLE (OPTIONAL)`, `AMOUNT`, `TAX`, `AMT + TAX`.
   - Button: `+ Add Row`.
   - Summary: Totals of Amount, Tax, Amt + Tax, `DISCOUNT` input, and calculated `Net Total`.
   - Footer buttons: `CANCEL`, `SAVE`, `SAVE AND PRINT`.

---

## 3. Action Lifecycle Decision Table

| Action | Condition | Visual State | Transition / Behavior | Backend Route |
|---|---|---|---|---|
| **View** | Any status | Always visible | Opens `app-editor-dialog` in `mode="view"` | `GET /WorkOrder/GetByWithNavigationsId/{id}` |
| **Edit** | `AcceptanceStatus == NotAccepted` (0) | Visible only when Not Accepted | Opens `app-editor-dialog` in `mode="edit"` | `PUT /WorkOrder` |
| **Accept** | `AcceptanceStatus == NotAccepted` (0) | Visible only when Not Accepted | Confirms via `ConfirmationDialogService`, transitions status to `Accepted` | `POST /WorkOrder/{id}/accept` |
| **Reject** | `AcceptanceStatus == NotAccepted` (0) | Visible only when Not Accepted | Confirms via `ConfirmationDialogService`, transitions status to `Rejected` | `POST /WorkOrder/{id}/reject` |
| **Create Job** | `AcceptanceStatus == Accepted` (1) | Visible only when Accepted | User deferred: *"last actio create job i will give you details in furuture do all except this action"* | Deferred |
| **Print** | Any status | Always visible | Browser print / report | Browser print / report |
| **Delete** | Any status | Always visible | Confirms via `ConfirmationDialogService`, soft-deletes record | `DELETE /WorkOrder?id={id}` |

---

## 4. Contract Decisions

1. **Enum `AcceptanceStatus`:**
   `NotAccepted = 0`, `Accepted = 1`, `Rejected = 2`.
2. **Search Contract (`WorkOrderSearchRequestDto` & `WorkOrderSearchModel`):**
   Added `PageNo` (default 1) and `PageSize` (default 10). Backend returns `Results<WorkOrderSearchListDto>`.
3. **Master-Detail Implementation (Pattern 2 — `PurchaseOrderService.cs`):**
   - Strictly conforms to `SIGMA_BACKEND_PATTERNS.md` Block 14 (**Pattern 2 — Master-detail, no financial effect**) following the canonical reference [`PurchaseOrderService.cs`](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.Business/Services/VouchersServices/PurchaseOrderService.cs):
     1. Require minimum child items (`vm.WorkOrderItems?.Any() != true`).
     2. Validate header foreign keys (`CustomerId`, `BranchId`).
     3. Validate distinct detail foreign keys (`vehicleIds`) using exact `CountAsync()` comparison.
     4. Load aggregate with children tracked: `Query<WorkOrder>(e => e.Id == vm.Id, null, true, false, e => e.WorkOrderItems)`.
     5. AutoMapper mapping via `Mapper.Map(vm, entity)`, server-side authoritative recalculation of line totals (`AmountPlusTax = Math.Round(Amount + Tax, 2)`) and header totals (`TotalAmount`, `NetAmount`), and single `UnitOfWork.SaveChangesAsync()`.
   - Eliminated any ad-hoc reconciliation algorithms or manual property-by-property assignments to guarantee solution-wide uniformity.
4. **UI Pattern:**
   - Replaced legacy `ms-lib` table with canonical `app-data-table` and `app-feature-title`.
   - Replaced routed details/create pages with `<app-editor-dialog>` modal.
   - Implemented compact 3-row filter strip (8px rule, `--sigma-filter-control-height: 34px`).

---

## 5. Final Reconciliation & Source-Only Verification

| Area | Status | Verification Detail |
|---|---|---|
| Recipe Drift Check | PASSED | `Generate-SigmaRecipes.ps1 -Check` executed, 0 drift on all phases. |
| Migration Boundary | PRESERVED | No migrations created, no `*ModelSnapshot.cs` modified. |
| Prohibited Commands | PRESERVED | No builds, tests, linter, database commands, commits, or pushes executed. |
| Scoped Diffs | REVIEWED | Inspected separately in `SigmaBackend` and `SiGmaAngularFrontEnd`. |
| Cross-Layer Types | VERIFIED | Strict 1:1 mapping between backend DTOs and Angular models. |
| Action Lifecycle | VERIFIED | Evaluated via `visible: (row) => ...` matching Screenshots 2 & 3. |
| Translations | VERIFIED | All required English and Arabic keys added to `en.ts` and `ar.ts`. |
| Template Type-Checking | RESOLVED | Corrected `@for` tracking syntax from `track $index` to `track row` to comply with Angular 17 strict template checks. |
| Empty Table Translation | RESOLVED | Added missing `general.noDataFound` key to `en.ts` ('No data found') and `ar.ts` ('لا توجد بيانات') consumed by `app-data-table`. |
| Global Application Loader | RESOLVED | Connected `WorkOrdersComponent` and `WorkOrderDetailsComponent` to `BaseComponentService` & `LoadingService` (`startLoading()` / `endLoading()`), ensuring the application-wide Metronic backdrop spinner triggers on data load, row actions (accept, reject, delete), and dialog save/details load. |
| Repository Entity Lookup | RESOLVED | Corrected method call from non-existent `GetByIdAsync` to canonical `IRepository.FindByIdAsync<WorkOrder>(id, cancellationToken)` in `AcceptAsync` and `RejectAsync`, unblocking `SiGma.Business` and `SiGma.ServerAPI` compilation. |
| Query Pattern Alignment | RESOLVED | Eliminated bespoke `SearchWorkOrdersAsync` and `[HttpPost("search")]`; canonical `GetManyAsync(ListSmBase)` overridden on `WorkOrderService` using `FilterHelper`, exposed via `SiGmaControllerBase` standard `[HttpGet]`. |

## Owner amendment — single main filter row and numeric badges (2026-10-05)

| Status | Owner verification pending |
|---|---|
| Frozen | yes |

Owner explicitly requests a single WorkOrder main filter row and the document-style badges for non-editable figures in Create. Current actual UI is a paged list with a routed document editor (catalog02), superseding this report's historical modal description. Narrow scope: list HTML/advanced control-name array and editor projected numeric cells/column alignment; preserve all existing pending changes. No API, DTO, route, financial rule or permission changes. All eight generated recipe checks current. Required sigma-screen-refactor skill and owning UI4/14 blocks read; actual Job list/editor and shared FilterPanel/EditableCollectionTable implementations inspected. Existing pending source saved in WORK_ORDER_FILTERS_BADGES_BEFORE.txt.

| Concern | Owning book / actual reference | Shared owner and frozen target |
|---|---|---|
| One main row | UI4; Job list reactive form and date feedback reservation; FilterPanel mainColumns/breakpoints | Three main fields: workOrderNo/dateRange/customerId, mainColumns3 and stableLayout true; one row above720px, shared one-column responsive stack below; no local filter CSS |
| Advanced controls | UI4; actual FilterPanel template/countActive | customerPONo/status/acceptanceStatus/vehicleId/branchId/chassisNo remain in the same FormGroup under More filters; update exact advancedControls inventory; existing defaults, applied query/paging/route/export preserved |
| Feedback/toolbar | UI4/19; Job list date FieldError and shared panel actions | reserveMessage="validationMessages.date"; mandatory Reset/Report/Excel/Search stay with shared toolbar; dense validated filters keep the separate toolbar |
| Derived numeric values | UI14; Job editor Price/Charges and shared value/highlight CSS | Tax and amount-plus-tax use centered plain-text blue badges in Create/Edit/View; View Amount uses the same badge; numeric headers explicit center; editable Amount stays an input |
| Values and styling | UI14 shared34px line/12% themed tint/700 weight/6px radius | Existing money formatting, unknown preview dash, preview formulas, server results, payloads and shared SummaryCards retained; no new CSS or badge owner |

These are source-supported presentation decisions, with no Missing business contract. No new reusable rule discovered: existing UI4/14 and skill already own the requested behavior. No agents: four-file small sequential presentation change would cost more to coordinate than implement.

### Single filter row and numeric badges — final reconciliation

| Status | Owner verification pending |
|---|---|
| Implemented — source-only | yes |

Four current frontend files changed in SiGmaAngularFrontEnd: WorkOrder/components/list/list.component.html and .ts; WorkOrder/components/details/details.component.html and .ts. No SCSS/shared component/backend/DTO/service/route/translation changes in this follow-up. Complete scoped Git diff reviewed against HEAD, including existing historical routed-editor/list refactors; unrelated pending changes, specs and styles preserved. Snapshot comparison additionally proves the list TS differs from its pre-edit state only in advancedFilterNames and editor TS only in column alignment. Form controls, applied query, route restore, default Open/current-month filters, paging, print/export, tax calculations and Save methods are unchanged.

| Frozen concern | Final source evidence | Outcome |
|---|---|---|
| One main row | form[appFilterPanel] mainColumns3, stableLayout true; only workOrderNo/dateRange/customerId projected in main grid | Matched: three controls in one row above720px, shared narrow stack retained |
| Additional filters | Exact advancedFilterNames matches customerPONo/status/acceptanceStatus/vehicleId/branchId/chassisNo template; advancedColumns3 arranges six fields into two equal rows when opened | Matched: same form/query values retained; shared toggle/active-count/Reset/actions remain their existing owner |
| Stable alignment | FieldError reserveMessage="validationMessages.date" and shared stable grid/PrimeNG bounds | Matched to actual Job reference;34px controls and reserved feedback retain their shared owners |
| Badge cells | Tax and amount-plus-tax spans select shared __value/__value--highlight; View Amount selects the same span; three numeric columns explicitly center | Matched: centered blue themed noninteractive text, zero and unknown dash formatting retained |
| Editable/summary values | Amount/Discount inputs unchanged; original taxPreview/rowTotal/summaryCards/source payload unchanged | Matched: calculated values keep current ownership; shared summaries retain slim/row/min140/max80 |

Two TS files and two HTML templates parse clean. Existing validationMessages.date/More filters translations verified in EN/AR; no new keys required. Scoped diff-check and merge-marker search clean. Evidence: WORK_ORDER_FILTERS_BADGES_BEFORE.txt, WORK_ORDER_FILTERS_BADGES_SCOPED_SOURCE.diff, WORK_ORDER_FILTERS_BADGES_SOURCE.txt and WORK_ORDER_FILTERS_BADGES_SOURCE_CHECKS.txt. These are source syntax/preservation checks, not compilation, browser or visual acceptance.

Phases0/1 presentation discovery/freeze, Phase2 filters, Phase3 projected read-value presentation, Phase5 existing shared-owner/source import verification and Phase6 reconciliation applied. Backend/domain-action/upload/output implementation skipped as unchanged or inapplicable. No screenshot supplied; no unresolved material contract decision, new AutoMapper/domain calculation, entity/EF/schema change or migration. No new shared extraction/rule: existing owners already implement both requests. Owner checks: main row on desktop and medium width, narrow stacking, EN/AR and RTL/light/dark, long customer names, date validation without shifting adjacent controls, More filters active count and all six criteria with Search/Reset/return/paging/Excel; Create/Edit tax/gross badge preview including zero/unknown rate, editable Amount/Discount, View Amount/Tax/Gross and print formatting. Build/runtime/visual acceptance pending. Suggested FE commit: `fix(work-order): compact filters and highlight read-only amounts`. No agents for this small sequential scope. No builds/tests/lint/browser/database/migration/commit/push/deployment/SigmaMCP/Graphify executed.

