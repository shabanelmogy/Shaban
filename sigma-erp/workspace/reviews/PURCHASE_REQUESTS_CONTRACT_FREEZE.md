| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Purchase Requests — screen/API handoff, 2026-10-15

## Authority and scope

Owner request: «راجع : src\app\modules\Vouchers\PurchaseRequests وطبق التعديلات طبقا للوثائق واجل action انشاء po الوقتى». Implement confirmed screen defects using the canonical books. Create PO is explicitly deferred. No build, test, lint, database, migration, commit, push or browser operation is authorized.

UI shape 02: paged list and routed document editor (totals plus lines/documents). Backend pattern 2, no journal or accounting effect. Approved references: Workshop Job list/editor, RentalQuotation single-collection editor variant, PurchaseOrderService FK/delete reference, IndividualPartnerService tracked owned-row reconciliation. Shared components own appearance.

Recipe check passed for plan-00 and phases 00–06 before use. Phases 00–06 apply; no separate evolution plan is needed for the confirmed contract repairs. No new workflow, approval engine or accounting effect is authorized by a static screenshot. No entity/EF/schema changes are planned.

Frontend contains unrelated pre-existing changes (angular/package files, AppModule, toolbar saas, Settings/fines, Provision details, role/user pages, SASS plugins and typings). None is part of this task. Backend initially clean. Preserve all existing changes.

## Frozen read contract

GET PurchaseRequest with ListSmBase: PageNo, PageSize, Filters[key]. Inherit generic count/page pipeline; override filter/order/materialization hooks only where needed. Results<PurchaseRequestListVM> has entities,totalCount,totalPages,pageNo,pageSize.

Grid keeps current source columns and adds screenshot financial columns: Actions first, id (number), no, purchaseRequestType (translated enum), date (date), vehicles (joined labels), supplierQuotationNo, supplierName, supplierCode, totalAmount (money), discount (money), netAmount (money). Lean ListVM properties: Id, No, PurchaseRequestType, Date, Vehicles, SupplierQuotationNo, SupplierName, SupplierCode, TotalAmount, Discount, NetAmount, CanEdit. CanEdit=false only for the already-enforced ItemRequisitionId-linked edit lock. SupplierCode comes from Supplier.No, never Id. Vehicles is projected from live detail vehicle labels, not a navigation collection sent to the list.

Financial interpretation preserves the existing Search DTO semantics: totalAmount=sum(live detail.Amount), netAmount=totalAmount-discount (before tax). Editor separately displays tax and gross. No undocumented discount/tax allocation is introduced.

Filters (same Angular property and Filters key): search (shared keyboard search), id (integer), no (contains), purchaseRequestType (enum integer including zero), dateFrom/dateTo (yyyy-MM-dd inclusive; UI one current-month range), vehicleId (integer/detail Any), chassisNo (contains/detail vehicle), supplierQuotationNo (contains), supplierId (integer), supplierCode (Supplier.No contains), branchId (integer), totalAmount/discount (decimal exact). Retain source filter capabilities using real backend mappings, replacing misleading supplierName-id binding and amountPlusTax filter with explicit authoritative totalAmount. State/status filter is unavailable: PurchaseRequest has no state field; do not repurpose IsActive/deleted as approval/open status.

All sorting through Filters[sortField]/Filters[sortOrder]; support exposed columns or mark unsupported columns unsortable. Full Excel uses shared fetchAllPages and dataTableExportRows on the applied snapshot. Paging/actions/editor return retain applied query via shared list-route state. Errors inline with skip-error header and apiErrorMessage; both envelope and HTTP failures release busy state. Delete refreshes current applied page, falling back one page when empty.

## Frozen detail/write contract

Existing GET PurchaseRequest/GetByWithNavigationsId/{id} remains detail endpoint. Return only editor fields: id,no,purchaseRequestType,date,supplierQuotationNo,supplierId,supplierName,branchId,branchName,notes,discount,documents,purchaseRequestDetails,canEdit. Detail rows: id,description,vehicleId,makeAndModel,itemId,itemName,assetTypeId,assetTypeName,unitsOfMeasuresId,uoM,jobId,jobNo,quantity,unitPrice,amount,tax,amountPlusTax. Do not remove members used by other direct contracts without tracing them.

POST/PUT inputs: purchaseRequestType numeric 0/1/2, date date-only string, optional supplierQuotationNo max100, supplierId required positive int, optional positive branchId, notes max1000, nonnegative decimal discount, documents string[], complete purchaseRequestDetails snapshot. PUT additionally id; existing children keep id, new children id=0 (no audit/tenant/number fields). Each child sends description, optional vehicleId/itemId/assetTypeId/jobId, unitsOfMeasuresId, quantity integer >=0, unitPrice decimal >=0. All types use the currently required persisted UOM, including Asset (extra field retained although screenshot omits it). No new enum-based destructive field-clearing or change-type confirmation. Switching types changes visible relevant selectors but retains hidden source values; keep UOM and Job available to preserve existing inputs.

Source's nonnullable UnitsOfMeasuresId requires a selected valid UOM for every line; VM conditional/optional annotations are corrected, with no schema change. Require at least one line; validate every supplied FK through AllExistAsync; validate all saved child IDs/duplicates against the loaded aggregate before mapping. Keep optional branch optional on both Add/Update. Existing supplier service validation makes supplier required.

Use protected tracked UpdateCoreAsync and existing ownership/reconciliation helpers. Preserve ItemRequisition-linked edit lock and its shared ItemRequisition concurrency guard across existing update/batch/delete entry points. Do not weaken the current lock. Reject newly supplied IDs on Add and foreign/duplicate child IDs on Update. Omitted saved rows are dependency-checked and soft-deleted. Ignore manually reconciled collection in Update profile; remove ReverseMap from scoped profiles. Single graph save, no new explicit transaction except the existing cross-writer ItemRequisition guard.

Calculations: backend owns amount, tax and amountPlusTax. Use settings ITaxPolicyService.ResolveRateAsync(null), matching the existing requisition-created PR writer; current editor has no tax choice and no client rate/tax amount is sent. Round amounts using GetMoneyDecimalPlacesAsync and allocate document VAT per rate with VatPolicy.AllocateDocumentTax. No literal tax rate. Existing persisted tax amounts remain display-only in View; an editable preview uses TaxSettingsService plus shared documentTax/allocateDocumentTax. Do not change the unrelated ItemRequisition writer. Discount remains absolute and nonnegative with the existing net definition; no new maximum or posting behavior.

## Actions and route contracts

List/create/view/:id/edit/:id with explicit route data; retain details/:id as compatibility redirect to view/:id. Existing list route '/PurchaseRequest' remains. One CanDeactivate gate uses shared confirmDiscard and freezeFormState; successful save bypasses discard. Save blocked until successful details/lookups/settings load and while save/upload/cleanup/removal confirmation runs. Freeze submitted snapshot, restore on failure. View always immutable; linked records viewable, edit denied by backend and UI.

View/Edit/Print/Delete supported. Print renders complete persisted detail via shared ReportPrintService; Save and Print persists once then prints saved response/reloaded detail. Delete uses shared confirmDelete and existing RemoveWithChildrenAsync dependency checks. Reference PO approval/billing actions are Not Applicable (no PR approval/bill state). Create PO deferred explicitly. Approval Details screenshot proves a read-only empty history surface only: no source approval rows/entity/API exists. Show record context with translated no-history/unavailable explanation and empty columns, never fabricated approvals or state transitions. Status is shown as unavailable rather than invented Open/Closed values. Import Rows screenshot proves an affordance, not its file/payload contract: implement local CSV preview/import into draft only using existing shared parser if compatible; no server import, automatic save or fabricated references.

Currency is read-only Common settings currencyCode; no hardcoded AED or new persisted currency. Lookups use existing Supplier/Branch/Vehicle/Job/UOM/AssetType/Item selects with search/clear/body overlays. Supplier dropdown search satisfies search affordance without creating a second supplier picker workflow.

Documents use component-scoped DocumentUploadTracker and app-file-field; saved files use app-file-link. Full documents snapshot is hydrated. Removed originals deleted only after successful save; cancel deletes only pending uploads. Cleanup failures retain Retry without repeating Save. Do not destroy active upload controls prematurely.

The nested standalone PurchaseRequestDetail scaffold shows product/modifier fields and calls an API without a corresponding controller. It has no menu entry. Its route will redirect to the parent aggregate list; no independent child mutations are added. Preserve its unused files for now unless direct consumer tracing proves safe retirement; not a canonical reference.

## Conformance evidence before edits

| Concern | Book | Actual reference/shared owner | Target decision |
|---|---|---|---|
| List shell/filter/rows | UI1/3/4/6 | JobsComponent + list template; FilterPanel/DataTable | sigma-route-host and list shell, stableLayout, lazy=true and server count; no feature SCSS |
| Editor | UI1/13/14/15 | Job editor shell; RentalQuotation DetailsComponent/lineRows | one parent typed form, FormSection + EditableRows/table, fixed footer, internal scroll |
| FK/save | BE8/14 | PurchaseOrderService.InvalidDetailReferenceAsync; shared AllExistAsync | validate every distinct reference, tracked full snapshot |
| Owned updates | BE14 | IndividualPartnerService.UpdateCoreAsync; OwnsAll/ReconcileOwned | check ownership before mapping retained rows |
| Uploads | UI18 | DocumentUploadTracker + FileFieldComponent | deferred deletion, finishSave/discard, retry cleanup |
| Output | UI8/21 | dataTableExportRows/fetchAllPages; ReportPrintService | all applied list rows / complete saved document |
| States/feedback | UI19/22/28 | FieldError/StateMessage, apiErrorMessage | declared and HTTP error handling, local/global loading |

## Handoff boundaries

Backend worker owns only directly related PurchaseRequest service/controller/profiles/VMs and localized message entries; no entities, EF, migrations, other domain writers. Frontend list worker owns PurchaseRequest list component/models/list.ts, service, grid-row adapter, route file, and child route alias. Root owns editor/create/details models, translations, guide, review, integration and final diff review. Shared contract changes are reported before implementation.

## Dated reconciliation amendments — 2026-10-15

These amend the preceding frozen decisions without erasing their history.

Owner follow-up requires screenshot type choices to change both displayed and required fields. Presentation/validation amendment (supersedes earlier optional Item/Asset/Description on manual Save): use one numeric type via circular choices above the three tabs; General requires a non-whitespace line Description and shows optional Vehicle/Branch; Stock requires each line ItemId; Asset requires each line AssetTypeId. Reviewer decision under the owner's standing missing-detail rule: these are the minimum type-defining inputs for the screenshot categories; do not make Vehicle or Branch mandatory, do not clear hidden values, do not impose conditional tax/accounting or permissions. Date/Supplier/UOM/Quantity/Price and other existing validators remain. UOM stays required even for Asset because its persisted FK is nonnullable. Frontend revalidates existing/new/imported rows immediately when type changes and required markers/errors match. Backend rejects missing type-defining values before mutation in Add/Update/batch via their shared preparation paths. Existing saved rows are not rewritten; View remains available, and old incomplete manual edits must be completed before Save. ItemRequisition's separate writer/linked locks remain unchanged. No DTO/schema/mapping changes or migration.

1. Source inspection of `ItemRequisitionService.CreatePurchaseRequestAsync` proves it reads `ITaxPolicyService.GetAsync` and resolves `settings.IsTaxOptional ? 0m : null`. Use that exact existing PR rule, replacing the initial inaccurate claim that the writer always resolved null. The editor uses TaxSettingsService's same optional-zero/mandatory-standard preview. No user-supplied tax values.
2. Add DTOs never expose child identity; unknown JSON identity values are ignored by the existing API convention and cannot be mapped. Do not add validation-only Id fields. PUT rows retain their existing numeric Id or use zero for new rows.
3. Preserve the complete plain `GetById` projection, separately from the inherited deep endpoint; filter soft-deleted children in its map. This avoids changing an existing API's detail cardinality for potential external callers.
4. Match stored precision: backend rounds unit price and absolute discount with the configured compatible currency precision before amount/VAT. Editor previews follow the same order. Reject decimal(18,2) storage overflow, without changing entity/EF/schema or historical records.
5. Final source comparison found the old nested AmountPlusTax column/filter had been replaced rather than preserved. Keep an additional `amountPlusTax` money grid column and ListVM `AmountPlusTax`, defined as the sum of live line gross amounts **before discount**. Add `lineAmountPlusTax` decimal filter, matching any live detail's gross, preserving the original detail-based filter's scope. It is independent of aggregate `totalAmount`, `discount`, and before-tax `netAmount`. New final grid/ListVM property count is twelve displayed properties plus `CanEdit`.
6. Shared preview bug discovered during focused audit: all-positive tiny allocations can produce negative line VAT because Angular lacked VatPolicy's exceptional floor/remainder branch. Correct the existing shared `allocateDocumentTax`, with no change to document VAT, rates, ordinary/signed/zero-net allocation or payloads; synchronize UI19 + skill revision and regenerate/check derivative packets. Existing shared consumers inherit this numerical correction.
7. Print uses the complete persisted Detail array in shared DataTable's unpaged flow mode, rather than printing a bounded editable frame. Wait for the View currency read to settle before automatic/manual print; if unavailable, show a retryable error and leave its value empty. No historical currency is invented.

## Owner continuation — 2026-10-18

The owner has superseded the historical Create PO deferral: implement a preliminary Approval Cycle tab/context now, create real purchase orders from requests, allow multiple partial orders within line remaining quantities, and automatically distribute the request discount proportionally. The frozen continuation contract and source reconciliation are [PURCHASE_REQUEST_PO_EVOLUTION_2026-10-18.md](<Archive/Completed/2026-10-23/PURCHASE_REQUEST_PO_EVOLUTION_2026-10-18.md>). Approval rules/settings and authorization integration remain deferred. Schema links require owner migration; no migration was generated or run. Earlier decisions above remain the historical record except where this dated continuation explicitly supersedes them.

## Later continuation — live manual approval, 2026-10-18

The owner now explicitly authorizes Approve/Reject from Pending, terminal request edit/delete locks and Create PO only after approval. The earlier approval placeholder/ungated conversion is superseded by [PURCHASE_REQUEST_MANUAL_APPROVAL_2026-10-18.md](<Archive/Completed/2026-10-23/PURCHASE_REQUEST_MANUAL_APPROVAL_2026-10-18.md>). Permission/role checks and configurable cycle levels remain deferred. Existing ApprovalStatus enum and current-session audit owner are reused; default Pending1, approval log table and owner migration are required. No migration was generated or run.
