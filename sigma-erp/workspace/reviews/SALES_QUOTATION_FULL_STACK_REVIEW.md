# Sigma Full Review - Sales Quotation

Review date: 2026-08-02

## Scope and sources

- Frontend feature: `SiGmaAngularFrontEnd/src/app/modules/Sales/SalesQuotation`
- Direct frontend integration: Sales Quotation route/service/models, EN/AR translations, `LayoutModule` provider scope, Sales Agreement hand-off, and Receipt hand-off
- Backend feature: Sales Quotation entity/configuration, item aggregate, request/response VMs, mapper profiles, service/interface, and controllers
- Frontend guide: `F:/Shaban Documents/Shaban/sigma front/SIGMA_FRONTEND_REVIEW_GUIDE.md`
- Backend guide: `F:/Shaban Documents/Shaban/sigma front/SIGMA_BACKEND_REVIEW_GUIDE.md`
- Approved references inspected: Companies/CompanyPartner editor and driver collection; `PurchaseOrderService` master-detail flow
- Visual references: attached `1.PNG` through `10.PNG` and the later Sales Quotation captures

Only directly related source was reviewed. Graphify, Sigma MCP, skills, subagents, full-solution scanning, unrelated refactoring, builds, tests, lint, migrations, browser automation, database commands, commits, and pushes were not used.

## Result

All confirmed source findings in the reviewed scope are implemented. Runtime and visual acceptance remain Owner pending because application execution was explicitly excluded.

## Files changed in the reviewed diff

### Frontend

- `src/app/modules/Sales/SalesQuotation/components/details/details.component.{ts,html,scss}`
- `src/app/modules/Sales/SalesQuotation/components/list/list.component.{ts,html,scss}`
- `src/app/modules/Sales/SalesQuotation/components/line-items-table/*`
- `src/app/modules/Sales/SalesQuotation/components/rejection-dialog/*`
- `src/app/modules/Sales/SalesQuotation/components/status-badge/*`
- `src/app/modules/Sales/SalesQuotation/models/*`
- `src/app/modules/Sales/SalesQuotation/services/salesquotation.service.ts`
- `src/app/modules/Sales/SalesQuotation/salesquotation.routes.ts`
- `src/app/modules/Sales/SalesQuotation/README.md`
- `src/app/_metronic/layout/layout.module.ts`
- Directly related EN/AR Sales Quotation translation blocks

The previously public standalone `SalesQuotationItem` frontend route/service registration is removed in the existing reviewed diff so item writes cannot bypass the quotation aggregate.

### Backend

- `SiGma.Business/IServices/ISalesQuotationService.cs`
- `SiGma.Business/Services/SalesQuotationService.cs`
- `SiGma.Business/MapperConfig/SalesQuotationProfiler.cs`
- `SiGma.Business/MapperConfig/SalesQuotationItemProfiler.cs`
- `SiGma.Helpers/Models/Sales/SalesQuotation.cs`
- `SiGma.Helpers/Models/Sales/SalesQuotationItem.cs`
- `SiGma.DataAccess/Configuration/SalesQuotationConfig.cs`
- `SiGma.DataAccess/Configuration/SalesQuotationItemConfig.cs`
- `SiGma.ServerAPI/Controller/SalesQuotationController.cs`
- `SiGma.ServerAPI/Controller/SalesQuotationItemController.cs`
- `SiGma.ViewModels/ViewModels/SalesQuotation/*`
- `SiGma.ViewModels/ViewModels/SalesQuotationItem/*`

Unused broad `SalesQuotationFullListVM` and `SalesQuotationItemFullListVM` files were removed. No migration file was created, changed, or executed in this pass.

## Frontend changes

- Replaced the legacy list implementation with the approved Sigma feature title, shared action menu, shared remote `table-list`, server paging/sorting, current-filter export, retry/empty/error states, and stale-request protection.
- Matched the screenshot field order, filters, action menus, approval badges, full-width form, line-item editor, rejection dialog, payment summary, and action colors without redesigning the workflow.
- Added typed create/view/edit modes, reusable line-item CVA, duplicate-save protection, invalid-control focus, unsaved-change confirmation, translated validation, and data preservation after API failure.
- Added visible save failure messages for both unsuccessful result bodies and HTTP errors.
- Added guarded loading for delete and workflow mutations so repeated confirmation cannot submit the same action twice.
- Added receipt eligibility preflight before navigation. The existing backend remains the authority for customer approval, positive down payment, and duplicate receipt checks.
- Made the Create form customer search button functional by refreshing the allowed customer lookup and showing lookup failures.
- Replaced rejection-dialog legacy button classes with scoped semantic neutral/destructive styles, including focus, disabled, RTL, dark-theme, and reduced-motion behavior.
- Kept the Sales Quotation service in the interceptor-owning `LayoutModule` provider scope and removed duplicate registrations from that provider array.

## Backend changes

- Enforced server-side create/update validation, tenant-scoped customer/model references, line ownership, minimum line count, date limits, payment limits, and editable-status rules.
- Kept quotation items behind the Sales Quotation aggregate; the generic item controller is excluded from controller discovery.
- Update loads the tracked aggregate, rejects foreign/duplicate child IDs, removes omitted children, updates/adds owned children, recalculates all money, and saves atomically.
- Added explicit internal/customer approve/reject, revise, unapprove, and receipt-eligibility operations with server transition validation.
- List filtering remains queryable and precedes count, whitelisted deterministic sorting, projection, skip, and take.
- Corrected the item add request property to `TaxPercentage`, matching Angular, the entity, AutoMapper, validation, and `SalesQuotationService.ToInput()`.

## Contract changes

### List response

`SalesQuotationListVM` and `SalesQuotationListModel` now contain only:

- `id` - operational row/action identity
- `no` - displayed quotation number
- `date` - displayed date
- `customerName` - displayed customer
- `customerCode` - displayed customer code
- `amount` - displayed total with tax
- `status` - both displayed approval badges and action visibility

The list projection no longer serializes tenant, audit, validity, GUID, navigation, child, or payment-detail fields. The aggregate item list placeholder is empty because there is no standalone frontend item list or public item controller.

### Create/update requests

- Accepted header inputs: `date`, `customerId`, `termsAndConditions`, `downPayment`, `numberOfInstallments`, and `items`.
- Accepted item inputs: `makeAndModelId`, `notes`, `unit`, `unitPrice`, `taxPercentage`; update items additionally accept their aggregate-owned `id`.
- Removed client authority over `remainingAmount`, `perInstallment`, item `amount`, item `amountWithTax`, quotation number, status, rejection reason, tenant, audit, validity, and deletion fields.
- Angular update payload no longer sends `no`.

## AutoMapper decisions

- `SalesQuotationAddVM -> SalesQuotation` uses convention mapping; status and calculated values are assigned/recalculated explicitly by the service/domain.
- `SalesQuotationUpdateVM -> SalesQuotation` ignores only `Items`, `SubscriptionId`, and `No`. These are necessary because the service reconciles the loaded child collection and the authenticated server owns tenant/document number.
- `SalesQuotationItemAddVM -> SalesQuotationItem` uses convention mapping.
- `SalesQuotationItemUpdateVM -> SalesQuotationItem` ignores only inherited `SubscriptionId` and `No`.
- Response maps retain only navigation/aggregate expressions that cannot be mapped by name.
- No audit, soft-delete, navigation, or calculated-member `Ignore()` calls were added merely because those properties are absent from a request DTO.

## Domain-calculation decisions

- Item `Amount` and `AmountWithTax` remain persisted. They are server-owned historical financial values used by list/report projections and are recalculated whenever item inputs change.
- Header `RemainingAmount` and `PerInstallment` remain persisted and domain-owned; `RecalculatePaymentTerms()` runs after item recalculation on create/update.
- Header `TotalAmount`, `TotalTax`, and `TotalAmountWithTax` remain non-persisted aggregate accessors. Their source values are the persisted item amounts, and the list/detail projections calculate them in SQL. Duplicating them on the header would require schema/backfill synchronization without a demonstrated filtering, performance, or historical-stability need.
- No calculated property was newly marked `[NotMapped]`, and no domain calculation was moved into a controller or mapper.

## Source-only verification

- Both supplied guides were read completely.
- The approved Companies/driver and PurchaseOrder reference patterns were inspected.
- Frontend/backend field parity, route/action wiring, provider/interceptor scope, state transitions, item ownership, downstream links, mapper ignores, and calculation call sites were inspected from source.
- The prior FormBuilder initialization errors are resolved by `inject(FormBuilder)` before form/array field initialization.
- Scoped `git diff --check` reports no whitespace errors after the final cleanup; only repository line-ending conversion notices remain.

## Possible compile or runtime risks

- No build or test was run, so compiler, DI, template, AutoMapper startup, and EF runtime confirmation remain pending.
- The list contract intentionally removes previously serialized unused base metadata; any undocumented external consumer of this feature-specific response must be checked by the Owner.
- The empty item list DTO is safe for the current non-controller aggregate boundary; re-exposing standalone item listing later would require a deliberately designed list contract.
- Operation-specific permission policies were not discoverable in the feature controller beyond the authenticated base-controller boundary; deployed permission middleware/configuration requires Owner confirmation.
- The global loading service is boolean rather than reference-counted; unrelated concurrent requests elsewhere in the application can still affect the shared overlay.

## Manual verification steps

1. Open the list in English and Arabic; check LTR/RTL, light/dark themes, narrow width, horizontal grid scrolling, menus, paging, sorting, and all five workflow status/action combinations against screenshots `1.PNG`-`6.PNG`.
2. Apply each filter, clear filters, rapidly change filters, paginate, change page size, refresh, and export more than 100 filtered rows.
3. Create and edit a quotation; verify customer lookup refresh, line add/remove/edit, tax/amount calculations, validation, down-payment limit, installment calculation, duplicate-click guard, cancel confirmation, and API-error data preservation against `7.PNG`.
4. View and print a quotation; confirm editable states are Pending and Internally Rejected only.
5. Exercise internal approve/reject, customer approve/reject, revise, unapprove, delete, invalid transitions, blank/short rejection reasons, and repeated action clicks.
6. Verify receipt preflight blocks ineligible/duplicate cases and opens Receipt Create only for a customer-approved quotation with a positive down payment; verify the downstream form against `10.PNG`.
7. Verify customer-approved quotation hand-off creates at most one Sales Agreement and matches `8.PNG`/`9.PNG`.
8. Confirm deployed permission policies and run the Owner's normal Angular/.NET build, tests, migration review, and browser acceptance outside this source-only task.
