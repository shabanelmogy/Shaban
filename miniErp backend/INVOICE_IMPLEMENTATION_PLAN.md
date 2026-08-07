# MiniErp Invoice Implementation Plan

Apply `FEATURE_DEVELOPMENT_GUIDE.md` completely to every step below. Complete
and hand off one step to the frontend before starting the next step.

## Simplified document policy

The current application uses editable CRUD documents. Apply these rules to
stock opening balances and every later document task:

- Do not add `DocumentStatus`, draft/posted/cancelled states, post endpoints,
  cancellation endpoints, reversal workflows, or posting/cancellation audit
  fields.
- Create, update, and soft-delete the complete aggregate atomically in an
  explicit transaction.
- Add a row-version token only to the document header and require the token
  originally returned to the client for aggregate updates. Assign that token
  as EF Core's original value; never replace it with a freshly loaded database
  value before saving. Update the header's `LastModifiedAt` for every update,
  including line-only changes, and translate `DbUpdateConcurrencyException`
  into a clear reload-and-retry conflict. Do not add row-version tokens to
  child rows.
- Let `AuditableEntityInterceptor` populate create, update, and delete audit
  fields; do not duplicate audit handling in a feature service.
- A document `StoreId` used for item quantities must reference an active
  product store (`IsContainerStore = false`) in the selected company.
- Invoice CRUD synchronizes current item, partner, container, and internal
  driver-trip side effects in the same transaction. Updates replace active
  side-effect rows and deletes soft-delete them with the invoice.
- If item movements are introduced later, their `ItemUnitId` and `ItemUnit`
  navigation are nullable.

## 0. Reference data and existing-feature preparation

- Confirm the existing Store changes for product and container stores.
- Implement Countries.
- Implement Containers.
- Implement Store-to-container assignments.
- Reuse existing Item, Store, BusinessPartner, and Driver select endpoints.
- Send all changed fields and new endpoint contracts to the frontend.

## 1. Stock opening balances

- Implement simple aggregate CRUD with atomic transactions and row-version
  concurrency.
- Require an active product store; reject container stores.
- Model each line like an invoice line: the request supplies `ItemId`, `Count`,
  `Weight`, and `Price`; use nullable `ItemUnitId`/`ItemUnit`, and derive
  `Quantity = Count * Weight` and `Total = Quantity * Price` on the server.
- Do not add status, post, cancel, reversal, or item-movement logic.
- Hand off the opening-stock page contract to the frontend.

## 2. Partner opening balances

- Implement simple CRUD with atomic writes and row-version concurrency.
- Implement receivable and payable types.
- Return the complete Partner Opening Balance detail fields in every paginated
  list item; do not use a reduced header-only list response.
- Do not add status, post, cancel, reversal, or partner-movement logic.
- Hand off the partner-opening page contract to the frontend.

## 3. Invoices

- Finalize invoice, line, container-line, and driver fields.
- Implement paginated list, details, create, update, and soft delete.
- Add optional strongly typed list filters for invoice number, invoice type,
  partner, country, store, responsible driver, payment term, line-price
  status, and inclusive invoice-date range.
- Include complete ordered product and container line details in every
  paginated invoice item.
- Implement sales, sales return, purchase, and purchase return.
- Add required `PaymentTerm` (`Cash = 1`, `Credit = 2`) with a default of
  `Cash`. Both terms accept a paid amount from zero through the invoice total;
  create one partner movement for any positive remaining amount.
- Save item movements for product lines, container movements for container
  lines, and one `DriverTrip` for an internal driver.
- Save an external driver name only on the invoice.
- Save the complete invoice aggregate atomically and require row-version
  concurrency for updates.
- Configure `Invoice.RowVersion` with `.IsRowVersion()`. On every header,
  product-line, or container-line update, call `Invoice.Touch(...)`, set the
  client token as the tracked original row version, and return
  `Invoices.Concurrency` when the token is stale.
- Implement return limits and original-invoice validation.
- Do not add status, posting, cancellation, reversal, voucher, or allocation
  logic.
- Hand off the CRUD and return contracts to the frontend.

## 4. Stock adjustments

- Implement increase and decrease documents with one positive `Quantity` per
  line.
- Reuse the shared derived-stock and historical-timeline logic already used by
  invoices. Create, replace, and soft-delete only the typed adjustment
  `ItemMovement` rows owned by the document.
- Implement simple aggregate CRUD with atomic writes, header-only row-version
  concurrency, `LastModifiedAt`, and header touch for line-only changes.
- Include complete ordered adjustment-line details in every paginated item.
- Add Inventory Count as a separate aggregate without duplicating movement or
  current-balance tables. Create freezes all active-item system balances,
  including zeros; update accepts the complete physical-count set.
- Reconciliation rejects stock changes since the snapshot and atomically
  creates only the required generated Stock Adjustment In/Out documents and
  their normal item movements. Generated adjustments are immutable.
- Do not add status, posting, cancellation, reversal, posting endpoints, or
  mutable balance columns.

## 5. Receipt and payment vouchers

- Implement simple aggregate CRUD with atomic writes and row-version
  concurrency.
- Return unpaid and partially paid invoices.
- Validate invoice allocations.
- Preserve voucher amounts that remain unallocated.
- Include complete ordered allocation details in every paginated voucher item.
- Do not add status, posting, cancellation, reversal, or partner movements.

## 6. Balance reports

- Defer balance reports until their source-of-truth calculation is separately
  approved.
- Do not introduce movement writes implicitly while implementing CRUD tasks.

## 7. Driver trips

- Create one trip during invoice save when an internal driver is supplied.
- Synchronize or soft-delete the trip with invoice update and delete.

## Completion requirements for every step

- Apply company isolation and foreign-key validation.
- Add request records, response records, validators, and Mapster mappings.
- Use direct services without repositories or CQRS.
- Keep controllers small.
- Add separate Swagger operation documentation.
- Add Arabic validation and business messages.
- Review the entity and EF design before creating a migration.
- Add idempotent seed data for multiple companies when applicable.
- Verify tenant isolation, expected failures, atomic transactions, and stale
  row-version conflicts.
- Confirm that no status, posting, cancellation, reversal, or movement logic
  was introduced.
- Run tests, the Release build, the pending-model check, and formatting checks.
- Give the frontend exact requests, responses, enums, validation, and examples.
