# MiniErp Invoice Implementation Plan

Apply `FEATURE_DEVELOPMENT_GUIDE.md` to every phase. Finish and verify one
phase before starting the next phase, and hand the exact Swagger contract to
the frontend after each phase.

## 1. Current scope and simple workflow

The current version intentionally uses a simple final-create workflow:

- Do not add a separate invoice `post` endpoint or Post button.
- Creating a stock-affecting document validates and applies its movements
  immediately in one transaction.
- The server may store `Status = Posted` internally, but status is not supplied
  by the client and there is no separate posting workflow.
- Final documents and movements cannot be updated or deleted.
- Corrections use a new opposite document. Direct cancellation, editable
  drafts, and movement editing are deferred.
- Do not add current-balance columns to `Item`, `Store`, `BusinessPartner`, or
  `Container`. Movements remain the source of truth.

Only stock-changing writes perform a balance calculation. List, details,
select, and other read operations do not need a stock transaction.

## 2. Mandatory atomic stock workflow

Every command that changes item stock follows the same workflow:

1. Resolve `CompanyId` from `ICurrentCompanyContext`.
2. Begin a SQL Server `Serializable` transaction before reading balances.
3. Validate the document and all active company-owned foreign keys.
4. Derive `ItemUnitId` from each item; never accept it from the request.
5. Calculate quantities on the server and group repeated items by
   `(StoreId, ItemId)`.
6. Load the current balances for all grouped items in one query:

   ```text
   Balance = SUM(QuantityIn - QuantityOut)
   ```

   The query must filter by `CompanyId`, `StoreId`, and the bounded item-ID
   collection.
7. Calculate every projected balance:

   ```text
   ProjectedBalance = CurrentBalance + QuantityIn - QuantityOut
   ```

8. If any projected balance is negative, roll back and return
   `409 Inventory.InsufficientStock`.
9. Add the document, lines, and movements through the same
   `ApplicationDbContext` and transaction.
10. Save and commit only after every validation and write succeeds. If identity
    keys require an intermediate `SaveChangesAsync`, it remains inside the same
    transaction and there is still only one final commit.

Do not query once per line. A reusable stock-balance service may perform the
grouped balance query, but the document service owns the transaction and final
commit so no nested transaction is created.

### Stock directions

| Action | Quantity in | Quantity out | Negative-balance check |
|---|---:|---:|---|
| Stock opening | Quantity | 0 | Projected balance is calculated but cannot decrease |
| Purchase | Quantity | 0 | Projected balance is calculated but cannot decrease |
| Sales return | Quantity | 0 | Projected balance is calculated but cannot decrease |
| Sales | 0 | Quantity | Required |
| Purchase return | 0 | Quantity | Required |
| Adjustment increase | Quantity | 0 | Projected balance is calculated but cannot decrease |
| Adjustment decrease | 0 | Quantity | Required |

## 3. Phase 0 - impact and existing-feature preparation

- Complete the guide's mandatory impact table for each phase.
- Confirm product-store and container-store behavior.
- Enforce at most one active, non-deleted container store for each business
  partner and company with both a service check and filtered unique index.
- Record all incoming and outgoing foreign keys and use
  `DeleteBehavior.Restrict` for ERP master data.
- Update Item, ItemUnit, Store, BusinessPartner, Driver, Container, and Country
  deletion checks whenever a new historical document or movement references
  them.
- Confirm the authorization matrix before adding controllers:
  authenticated reads and Admin writes unless a different rule is approved.
- Confirm exact request, response, enum, pagination, and error contracts before
  implementation.

## 4. Phase 1 - reference and container data

Implement in this order:

1. Countries as global reference data.
2. Containers as company-owned master data.
3. Store-to-container assignments as company-owned data.

Requirements:

- Add Domain review, EF configuration, `DbSet`, migration, Application models,
  validator, Mapster mapping, service, controller, and Swagger documentation.
- Country codes are globally unique among active records.
- Container codes are unique per company among active records.
- Active `(CompanyId, StoreId, ContainerId)` assignments are unique.
- Store assignments accept only active container stores belonging to the
  selected company.
- List endpoints use shared pagination, deterministic ordering, projection,
  and `AsNoTracking`.
- Small select endpoints remain unpaginated and return only active records.
- Verify duplicate, inactive, missing, cross-company, and delete-dependency
  cases.

Frontend handoff: Country, Container, StoreContainer, and changed Store
contracts with requests, responses, validation, enums, and examples.

## 5. Phase 2 - item movements and reusable stock balance

- Add `ItemMovement` to `ApplicationDbContext` with its EF configuration.
- Configure decimal precision explicitly.
- Add a check constraint requiring non-negative quantities and exactly one
  positive direction per movement.
- Add an index beginning with `(CompanyId, StoreId, ItemId)`.
- Define `ReferenceId` consistently as the source document ID and
  `ReferenceNumber` as its immutable display number.
- Add source-specific unique indexes that prevent the same document from
  generating duplicate movements for the same store and item.
- Keep ItemMovement read-only; do not add movement create, update, or delete
  endpoints.
- Implement one reusable service that receives the selected company, store,
  grouped item deltas, and current transaction context, then loads balances in
  one query and rejects negative projected balances.
- Do not let the reusable service call `SaveChangesAsync` or commit a
  transaction.

Verify empty stock, exact stock, insufficient stock, repeated items, multiple
items, cross-company IDs, and two concurrent outbound operations using SQL
Server rather than the EF in-memory provider.

## 6. Phase 3 - opening balances

### Stock opening balance

- Add StockOpeningBalance and StockOpeningBalanceLine configurations, DbSets,
  relationships, constraints, indexes, and migration.
- Implement paginated list, details, and final create.
- Do not implement update, delete, post, or cancel in the current version.
- Validate the active product store and all active items in the selected
  company.
- Enforce at most one opening entry per
  `(CompanyId, StoreId, ItemId)`.
- Create inbound ItemMovement rows in the atomic stock transaction.

### Partner opening balance

- Add PartnerOpeningBalance and BusinessPartnerMovement configurations, DbSets,
  relationships, constraints, indexes, and migration.
- Implement paginated list, details, and final create.
- Do not implement update, delete, post, or cancel in the current version.
- Support receivable and payable types.
- Derive currency from the active business partner.
- Create one BusinessPartnerMovement atomically with the opening document.
- Calculate partner balances separately per company, partner, and currency.

Frontend handoff: final-create requests, list/details responses, movement
effects, validation errors, and the no-edit/no-delete rule.

## 7. Phase 4 - invoices

### Read and request contracts

- Add Invoice, InvoiceLine, InvoiceContainerLine, BusinessPartnerMovement,
  ContainerMovement, and DriverTrip configurations and DbSets before creating
  the invoice migration.
- Configure `Invoice.RowVersion` with `.IsRowVersion()` and configure all
  company-owned relationships with tenant-safe composite foreign keys.
- Implement a projected paginated list with deterministic ordering and useful
  filters: invoice number, type, date range, business partner, and store.
- Implement projected invoice details including lines, container lines, driver
  information, currency, totals, and status.
- Request DTOs must not contain `CompanyId`, `ItemUnitId`, quantity, line total,
  invoice total, currency, status, or audit values.
- Generate the invoice number on the server with concurrency protection; never
  use unprotected `MAX + 1`.
- Define decimal precision and rounding for weight, quantity, price, and total.

### Atomic final create

- Support Sales, Purchase, SalesReturn, and PurchaseReturn using the same
  endpoint and `InvoiceType` enum.
- Validate the active partner, product store, items, optional country, and
  internal driver in the selected company.
- Enforce the `UsesExternalDriver`, `DriverId`, and `ExternalDriverName`
  combinations.
- Derive item units and currency on the server.
- Recalculate every quantity and total on the server.
- Execute the mandatory atomic stock workflow.
- Create grouped ItemMovement rows for stock effects.
- Create one BusinessPartnerMovement using these directions:

  | Invoice type | Partner debit | Partner credit |
  |---|---:|---:|
  | Sales | Invoice total | 0 |
  | Sales return | 0 | Invoice total |
  | Purchase | 0 | Invoice total |
  | Purchase return | Invoice total | 0 |

- When container lines exist, validate the partner's active container store
  and assigned active containers, then create ContainerMovement rows.
- Create one DriverTrip only when an active internal driver is supplied.
- Set the internal status server-side and return the final invoice details.
- Do not implement invoice update, delete, separate post, or cancellation in
  the current version.

### Return validation

- SalesReturn references a completed Sales invoice.
- PurchaseReturn references a completed Purchase invoice.
- Original and return must have the same company, partner, store, and currency.
- Every return line supplies `OriginalInvoiceLineId`.
- Existing returns and the current request cannot exceed the original line's
  quantity.
- Run the return-limit and stock checks inside the same serializable
  transaction so concurrent returns cannot exceed the remaining quantity.

Frontend handoff: list filters, details, final-create request, invoice type and
direction table, calculated response fields, and all expected ProblemDetails
errors. The frontend must not show Edit, Delete, or Post actions.

## 8. Phase 5 - stock adjustments

- Implement paginated list, details, and atomic final create.
- Support Increase and Decrease directions.
- Execute the shared atomic stock workflow.
- Reject a decrease that would make any item negative.
- Create ItemMovement rows in the same transaction.
- Do not implement update, delete, separate post, or cancellation in the
  current version.

## 9. Phase 6 - balance reports

- Implement stock balances grouped by company, store, and item.
- Implement partner balances grouped by company, partner, and currency after
  partner movements are available.
- Implement customer container balances after container movements are
  available.
- Use projection, `AsNoTracking`, deterministic ordering, and shared
  pagination for growing results.
- Support only bounded filters that execute in SQL; do not materialize all
  movements before grouping or filtering.
- Keep every movement table read-only.

## 10. Deferred features

The following are not part of the current simple implementation:

- Editable invoice or financial-document drafts.
- Separate post endpoints or frontend Post buttons.
- Direct editing or deletion of final documents.
- Invoice cancellation and linked reversal movements.
- Receipt/payment vouchers and invoice allocations.
- Unallocated voucher balances and payment-status filtering.
- Manual DriverTrip creation or deletion.

Implement a deferred feature only after its business rules, relationships,
delete behavior, concurrency behavior, and frontend contract are separately
approved.

## 11. Mandatory gate for every phase

Do not mark a phase complete until all applicable items are recorded and
verified:

- Mandatory impact table completed with affected services and contracts.
- Entity and EF design reviewed before migration creation.
- Every tenant query and foreign key includes the selected CompanyId.
- Referenced records are checked for existence and active state.
- Incoming foreign keys, historical dependency checks, and delete behavior are
  documented and tested.
- Duplicate checks use normalized values and a matching database unique index.
- Request validation, Arabic display names, and business errors are complete.
- Growing lists use `PaginationRequest`, `PagedResponse<T>`, deterministic
  ordering, and server-side projection.
- No query executes inside a loop over lines or records.
- Controllers, authorization, status codes, ProblemDetails, and separate
  Swagger operation documentation match the delivered contract.
- Migration contains only intended changes and works with empty and existing
  databases; rollback is understood.
- Seed execution is idempotent and does not create transactional documents
  unless explicitly required for development testing.
- Validator, mapping, service, API, persistence, tenant-isolation, and SQL
  Server concurrency tests pass, or missing tests are recorded with repeatable
  manual evidence.
- `dotnet format`, Release build, tests, and pending-model checks pass.
- Frontend contract and sidebar/page impact are delivered, and the frontend
  production build passes or is recorded as a separate pending repository task.

## 12. Completion report

Every phase handoff must state:

1. Routes and authorization.
2. Entities, tables, and foreign keys.
3. Delete behavior and historical-data decision.
4. Validation, uniqueness, and duplicate handling.
5. Transaction, balance, and concurrency behavior.
6. Pagination, filtering, projection, and query count.
7. Migration, seed, tests, formatting, and build results.
8. Changed shared contracts and affected services.
9. Frontend contract delivered.
10. Known risks, deferred cases, and technical debt.
