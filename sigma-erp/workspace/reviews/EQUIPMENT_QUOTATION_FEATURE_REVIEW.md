# Equipment Rental Quotation — feature review and contract freeze

Date: 2026-09-02
Scope: `SiGmaAngularFrontEnd/src/app/modules/Equipment Rental/EquipmentQuotation` and the directly related `Quotation` backend contract.

## Evidence classification

The supplied screenshots are functional and content evidence. They establish:

- a paged quotation list with filters for quotation number, branch, date range, customer, and status;
- row actions for view, internal approval, internal rejection, edit, and delete;
- columns for quotation number, type, date, contact/customer code, internal approval, and customer approval;
- a create/edit form with type, date, period in days, customer, contact person, branch, detail rows, hours allowed, mobilization/demobilization charges, and notes;
- detail rows containing equipment type, make and model, units, rent without operator, and rent with operator;
- a default pending workflow with visible pending/approved/revised states.

The screenshots do not own component choice, CSS, or API naming. Those decisions come from the canonical UI and backend pattern books and the approved `RentalQuotation` reference.

## Recipe status

The required read-only recipe drift check was run on 2026-09-02. All generated phase packets reported stale content. Generated packets are derivative and were not edited; this contract uses the current Master Guide and canonical pattern books as authority.

## Source findings

- The frontend currently uses `table-list`, raw buttons, raw controls, untyped forms, and an endpoint named `EquipmentQuotation` that has no matching backend controller.
- The frontend sends audit, tenant, deletion, and calculated/server-owned fields.
- The backend already contains the intended equipment quotation aggregate as `SiGma.DataAccess.Models.Quotation` with `QuotationDetail`, but its DbSets are commented out and its service is an old single-status stub.
- `SettingsDocumentNumberModel` already contains equipment-rental quotation numbering settings. `CodeCreateService` is the existing number-generation service but has no `Quotation` mapping.
- `RentalQuotationService` and its Angular module are the canonical master-detail quotation reference for paging, typed filters, action-state flags, child reconciliation, loading/errors, translations, and route modes.
- There is no existing quotation-to-equipment-master-agreement workflow in the source. That downstream action is therefore not included in this scope.

## Frozen backend contract

### Aggregate

Reuse `Quotation`/`QuotationDetail`; do not create a second equipment quotation entity. Activate the existing DbSets and add sealed EF configuration in the existing `SiGma.DataAccess.Configuration` folder. The aggregate is tenant-owned and its detail rows are reconciled explicitly.

The root remains responsible for:

- server-side quotation number generation using the existing equipment-rental numbering settings;
- defaulting both approvals to Pending;
- validating partner/customer, contact, branch, equipment type, model, units, rates, period, hours, and mobilization values;
- preventing edits/deletes after an approval state that is not editable;
- applying all state transitions on the server;
- recalculating/normalizing any persisted values; the client does not authoritatively calculate domain values.

The existing domain names `PartnerId`, `ContactId`, `BranchId`, `QuotationType`, and `Details` remain the API names. The UI labels `PartnerId` as Customer because that is the existing domain relationship shown by the screenshot.

### Add request

`QuotationAddVM` contains client-editable values only:

- `Date` (`DateOnly`)
- `Period` (positive number of days)
- `PartnerId` (required)
- `ContactId` (optional)
- `BranchId` (required for the screenshot workflow)
- `SalesPersonId` (optional)
- `QuotationType` (required, default Daily)
- `Notes` (optional)
- `HoursAllowed` (optional, non-negative)
- `MobilizationCharges` (optional, non-negative)
- `Details` (at least one row)

Each detail contains `EquipmentTypeId`, `CarModelId`, `Units`, `RentWithoutOperator`, and `RentWithOperator`. The client does not send `SubscriptionId`, `No`, audit fields, delete flags, status fields, or navigation objects.

### Update request

`QuotationUpdateVM` contains `Id` plus the same client-editable values and detail row IDs needed for reconciliation. `SubscriptionId`, `No`, audit fields, delete flags, and approval state are ignored even though the compatibility base type exposes some of them.

### Detail response

The detail response returns the quotation identity/number, editable values, current internal/customer approvals, and the display names/IDs needed by the form and detail rows. Server-owned fields are not bound to editable controls.

### List response and grid contract

The grid columns are, in this order:

1. Actions
2. No
3. Type
4. Date
5. Contact
6. Code
7. Internal Approval
8. Customer Approval

The ListVM includes exactly those display values plus `Id` and action-state flags needed to render the menu:

- `Id`, `No`, `Date`, `QuotationType`;
- `ContactName`, `CustomerCode`;
- `InternalApproval`, `CustomerApproval`;
- `CanApproveInternally`, `CanRejectInternally`, `CanApproveByCustomer`, `CanRejectByCustomer`, `CanRevise`, `CanUnapprove`, `CanCreatePurchaseOrder`, `CanEdit`, `CanDelete`.

Filters are `quotationNo`, `branchId`, `partnerId`, `dateFrom`, `dateTo`, `internalApproval`, and `customerApproval`. Filtering and sorting happen before count/skip/take, with a stable ID tie-breaker. Default page size is 5 to match the current Sigma UI convention requested for recent lists; the backend clamps the maximum to the existing safe limit.

### Actions and state rules

The service exposes:

- internal approve;
- internal reject;
- customer approve;
- customer reject;
- revise;
- unapprove;
- create purchase order after both internal and customer approval;
- inherited view/edit/delete operations.

Action eligibility is returned by the server and enforced again by the service. New quotations start Pending/Pending. Customer approval is available only after internal approval. Revision returns the quotation to the editable pending path. Reject and delete use the existing confirmation workflow; no new permission API or external provider is invented.

### Routes

The backend remains under `[Route("[controller]")]` as `/Quotation`, with the inherited generic routes plus action routes using the established quotation action naming. The frontend keeps `/EquipmentQuotation` as the menu route and uses `create`, `view/:id`, and `edit/:id`; the old `details/:id` path is retained as a compatibility redirect where needed.

### Schema boundary

Activating `Quotation`/`QuotationDetail`, adding approval fields/configuration, or adding indexes changes the EF model. The PO workflow also adds the nullable `PurchaseOrder.EquipmentQuotationId` relationship and lookup index so a quotation can list its created POs. No migration or snapshot is created/edited/run in this task. The owner must run `Add-Migration` and review the generated migration before applying it.

## Frozen frontend contract

- Use `app-data-table`, typed `DataTableColumn<EquipmentQuotationListDTO>[]`, and the shared paginator/loading/empty/error states.
- Use the canonical filter form and typed request stream with stale-response protection.
- Use the shared `FeatureTitle`, `FormSection`, `PrimaryActionButton`, typed reactive forms, and the existing shared controls.
- Use route mode (`create`, `view`, `edit`) rather than separate invented screen patterns.
- Use the existing `EditorDialogComponent` for the approved quotation-to-PO owning-screen handoff; the embedded PO editor must not navigate to the Purchase Orders sidebar route.
- Use `p-calendar` for the date field and do not auto-open it on load.
- Use the existing shared confirmation dialog for transitions and delete.
- Render status badges using the existing Sigma approval palette and the translated action/status keys.
- Handle both `isSuccess: false` and HTTP error callbacks; finish every loading state with `finalize`.
- Send only the frozen Add/Update request fields. The frontend preview is never authoritative for a backend result.

## AutoMapper decisions

Keep only mappings needed for the frozen read/write contract. Add/update mappings ignore server-owned identity/audit/tenant/status fields that are exposed by compatibility base classes, and child IDs/foreign keys are reconciled by the service. No `ReverseMap()` or broad graph mapping is added.

## Missing or uncertain requirements

- The screenshots do not show an equipment type/model lookup payload shape. Existing `Equipment`, `CarModel`, `Partner`, `Contact`, and `Branch` select endpoints are the source-supported lookup choices; their existing `GetSelect` contracts will be reused.
- The screenshots do not specify a custom approval-rejection reason. The current legacy quotation action has no reason payload, so the frozen cycle uses confirmation-only transitions rather than inventing a reason field.
- The screenshots do not show a print/export quotation document or a quotation-to-master-agreement action. Those remain outside this implementation.
- The quotation-to-purchase-order workflow is an owning-screen handoff: after both approvals the `Create PO` row action opens the existing Purchase Order editor as an embedded dialog owned by the quotation list, with `Asset PO` selected (`poType=2`). It does not navigate to `/PurchaseOrder` or add a sidebar item. In create mode, `General PO` and `Stock PO` remain visible but disabled; only the Asset PO editor is available. Item, vehicle, and unit-of-measure selects are not requested for this Asset PO flow. Asset types remain the required lookup for the Asset PO detail row; its optional lookup request skips the global error dialog when the current tenant has no Asset Types, leaving the editor usable with an empty select rather than failing the whole dialog. Existing PO edit mode keeps its type-specific lookups so historical General/Stock POs remain editable. Supplier and PO details remain user-entered because the quotation's equipment/model fields do not map safely to the PO's asset/supplier fields. The created PO stores the originating quotation through `EquipmentQuotationId`; the quotation list exposes `HasPurchaseOrders`, and the `View POs` row action is rendered only when at least one non-deleted linked PO exists. Selecting a PO in the modal opens the existing PO details route. PO creation remains explicit; no automatic PO is created by approval.

## Phase handoff

Phase 0 discovery and Phase 1 contract freeze are complete. Backend and frontend implementation may proceed in disjoint ownership. Phase 4 domain actions is required for approval/revision/unapprove and must be reconciled with the owning UI. Final reconciliation remains root-owned.
