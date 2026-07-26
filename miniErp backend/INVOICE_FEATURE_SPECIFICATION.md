# MiniErp Invoice Feature Specification

This document collects the approved invoice design and its related business
rules in one place. Use `FEATURE_DEVELOPMENT_GUIDE.md` for the implementation
standards that apply to every feature.

## 1. Confirmed architecture decisions

- Use one `Invoice` header and one `InvoiceLine` table for sales, sales returns,
  purchases, and purchase returns.
- Stock opening balances, partner opening balances, stock adjustments, receipt
  vouchers, and payment vouchers are separate document features. They are not
  invoice types.
- `BusinessPartner` represents both customers and suppliers. The document type
  determines the partner's role.
- Do not add a general ledger or journal vouchers.
- Do not store mutable current-balance fields on `Item`, `Store`,
  `BusinessPartner`, or `Container`.
- Use direct services with `ApplicationDbContext`. Do not add CQRS or repository
  classes.
- Every tenant-owned record receives `CompanyId` from the authenticated
  `company_id` claim, never from a request DTO.
- Documents use simple aggregate CRUD. They do not have status, posting,
  cancellation, reversal, or movement side effects.
- Aggregate create, update, and soft delete operations are atomic. Updates use
  a header row-version token, including line-only updates.
- `AuditableEntityInterceptor` owns audit field population.

## 2. Existing master-data impact

Only the existing `Store` entity requires a frontend-visible contract change:

- `IsContainerStore`
- `BusinessPartnerId`
- `BusinessPartner` navigation
- `BusinessPartnerName` in the response

Rules:

- A product store has `IsContainerStore = false` and no business partner.
- A container store has `IsContainerStore = true` and one business partner.
- A business partner has at most one active dedicated container store in a
  company.
- A container store can contain many container types through `StoreContainer`.

No frontend-visible entity changes are required for `Driver`, `Item`,
`ItemUnit`, `BusinessPartner`, or `Company`.

The `Driver` table contains internal company drivers only. External driver
information is saved on the invoice and is never inserted into the `Driver`
table.

Existing EF configurations may receive alternate keys or indexes to enforce
company-scoped invoice relationships. Those persistence-only changes do not
change existing API contracts.

## 3. Reference and container entities

### Country

`Country` is global reference data used only by invoices. It does not contain
`CompanyId`.

Fields:

- `Id`
- `Code`
- `Name`
- `ArabicName`
- `IsActive`
- Audit fields

### Container

`Container` represents a reusable container type and is not an item.

Fields:

- `Id`
- `CompanyId`
- `Code`
- `Name`
- `Description`
- `IsActive`
- Audit fields

### StoreContainer

`StoreContainer` assigns a reusable container type to a container store.

Fields:

- `Id`
- `CompanyId`
- `StoreId`
- `ContainerId`
- `IsActive`
- Audit fields

The combination `(CompanyId, StoreId, ContainerId)` must be unique for active
records.

Relationship:

```text
BusinessPartner
    -> one active container Store
        -> many StoreContainer rows
            -> one Container per row
```

## 4. Invoice entities

### Invoice

The invoice header stores common data for all four invoice types.

Main fields:

- `Id`
- `CompanyId`
- `InvoiceNumber`, generated on the server
- `ExportInvoiceCode`, optional
- `InvoiceType`
- `PaymentTerm` (`Cash = 1`, `Credit = 2`; defaults to `Cash`)
- `InvoiceDate`
- `DueDate`, optional
- `BusinessPartnerId`
- `StoreId`, the product store
- `ContainerStoreId`, optional
- `CountryId`, optional
- `Currency`, derived from the business partner
- `DriverId`, optional internal driver
- `UsesExternalDriver`
- `ExternalDriverName`, optional
- `VehicleNumber`, optional
- `Total`, calculated on the server
- `Notes`, optional
- `LastModifiedAt`, updated for every aggregate update
- Row-version concurrency value
- Audit fields
- Invoice lines and container lines

### InvoiceLine

Fields:

- `Id`
- `CompanyId`
- `InvoiceId`
- `ItemId`
- `ItemUnitId`, derived from the item
- `Count`
- `Weight`
- `Quantity`, calculated on the server
- `Price`
- `Total`, calculated on the server
- `Notes`, optional
- Audit fields

Calculations:

```text
Quantity = Count * Weight
Line Total = Quantity * Price
Invoice Total = SUM(Line Total)
```

The request does not send `ItemUnitId`, `Quantity`, line total, or invoice
total.

### InvoiceContainerLine

Fields:

- `Id`
- `CompanyId`
- `InvoiceId`
- `ContainerId`
- `OutgoingUnits`
- `IncomingUnits`
- Audit fields

Incoming and outgoing can both be positive because a customer may receive full
containers and return empty containers during the same transaction. They
cannot both be zero.

## 5. Invoice types and directions

| Invoice type | Partner role | Stock effect | Partner effect |
|---|---|---|---|
| Sales | Customer | Quantity out | Debit |
| Sales return | Customer | Quantity in | Credit |
| Purchase | Supplier | Quantity in | Credit |
| Purchase return | Supplier | Quantity out | Debit |

The partner balance is calculated as:

```text
Partner balance = SUM(Debit - Credit)
```

The stock balance is calculated as:

```text
Stock balance = SUM(QuantityIn - QuantityOut)
```

Stock calculations always filter by `CompanyId`, `StoreId`, and `ItemId`.

## 6. Invoice driver rules

The invoice property is named `UsesExternalDriver`.

| Case | UsesExternalDriver | DriverId | ExternalDriverName |
|---|---:|---:|---|
| No driver | false | null | null |
| Internal company driver | false | required | null |
| External driver | true | null | required |

- Internal drivers are selected through the existing driver select endpoint.
- External driver names are stored only on the invoice.
- External drivers are not added to the `Driver` table.
- A `DriverTrip` is created only when an internal `DriverId` is supplied.

## 7. Container rules

- Container lines are supported on sales-related documents.
- When container lines exist, `ContainerStoreId` is required.
- The container store must belong to the selected business partner and company.
- Every selected container must be active and assigned to that store through
  `StoreContainer`.
- Container lines are saved only as part of the invoice aggregate. The current
  scope does not generate container movements.

The customer container balance is:

```text
Customer container balance = SUM(OutgoingUnits - IncomingUnits)
```

A positive result means the customer still holds containers.

## 8. Invoice side-effect entities

Invoice create, update, and soft delete synchronize the current operational
side-effect rows in the same transaction. There is no status, posting,
cancellation, reversal, voucher, or allocation workflow.

### ItemMovement

Product invoice lines create `ItemMovement` rows. `ItemUnitId` and `ItemUnit`
remain nullable on generic movement records.

### BusinessPartnerMovement

Credit invoices create one `BusinessPartnerMovement` with the invoice
direction. Cash invoices are immediately paid and do not create an
outstanding partner movement.

### ContainerMovement

Invoice container lines create `ContainerMovement` rows.

### DriverTrip

An internal `DriverId` creates one `DriverTrip`; external drivers remain only
on the invoice.

## 9. Simplified invoice behavior

- Invoices may be created, updated, queried, and soft-deleted.
- Header, product lines, and container lines are one aggregate.
- Create, update, and soft delete use explicit atomic transactions.
- Update requires the current row-version token. A line-only update must also
  call `Invoice.Touch(...)` to update `LastModifiedAt` so the header token
  advances.
- The update service assigns the row-version received from the client as EF
  Core's original value. It must not replace that value with the latest token
  loaded from the database before saving.
- A stale token returns `Invoices.Concurrency` and tells the user that another
  user modified the invoice and that the invoice must be reloaded.
- `InvoiceLine` and `InvoiceContainerLine` do not have row-version properties
  because they are not updated independently.
- The audit interceptor records create, update, and delete information.
- There is no document status, post, cancel, reversal, voucher, or allocation
  operation.
- `Cash` is represented as immediately paid and `Credit` remains outstanding
  against the partner account. The API derives payment status and
  paid/outstanding amounts from `PaymentTerm`.
- Invoice CRUD synchronizes current item, container, partner, and internal
  driver-trip side effects. Updates replace active side-effect rows and
  deletes soft-delete them with the invoice.

## 10. Atomic aggregate-save workflow

1. Resolve the selected company from the authenticated claim.
2. For update, load the invoice aggregate and retain the row-version originally
   supplied by the client as EF Core's original concurrency value.
3. Validate the active partner, active product store, country, and driver.
4. Load all requested items in one query and derive their units.
5. Derive currency from the business partner.
6. Recalculate quantities and totals on the server.
7. Reject repeated item IDs.
8. Validate the container store and assigned containers when container lines
   are present.
9. Replace the aggregate line sets in the change tracker.
10. Call `Invoice.Touch(DateTime.UtcNow)` and explicitly mark
    `LastModifiedAt` modified so line-only changes always update the header.
11. Save the invoice aggregate and synchronize item, container, partner, and
    driver-trip side effects in the same transaction. Commit only on success;
    any failure rolls back the entire operation.

## 11. Return rules

- Sales returns and purchase returns are independent invoice documents.
- A return uses the selected business partner, store, items, quantities,
  prices, payment term, and other normal invoice data.
- A return does not reference or allocate against an earlier invoice.
- Purchase returns require sufficient stock.
- Repeated item IDs are rejected.

## 12. Lifecycle operations

Status, posting, cancellation, and reversal operations are not part of the
current application scope and must not be introduced implicitly.

## 13. Related document entities

These remain separate features and tables:

- `StockOpeningBalance` and `StockOpeningBalanceLine`
- `PartnerOpeningBalance`
- `StockAdjustment` and `StockAdjustmentLine`
- `BusinessPartnerVoucher`
- `BusinessPartnerVoucherAllocation`

`StockOpeningBalanceLine` uses the same quantity and value fields as an invoice
line: `ItemId`, nullable server-derived `ItemUnitId`/`ItemUnit`, `Count`,
`Weight`, calculated `Quantity`, `Price`, calculated `Total`, and optional
`Notes`. Clients send `Count`, `Weight`, and `Price`; they do not send
`Quantity` or `Total`.

They follow the same simplified aggregate CRUD, transaction, row-version, and
audit-interceptor rules. They do not generate movement or reversal records.

## 14. Frontend contract rules

- Reuse the existing select endpoints for drivers, stores, items, and business
  partners when their data is sufficient.
- Paginated document list items return their complete ordered child details:
  invoices return product and container lines, stock adjustments return their
  lines, and vouchers return allocations. A `lineCount` or allocation count
  may be included but does not replace the child collection.
- Paginated Partner Opening Balance items return the complete detail fields,
  including partner information, balance type, currency, amount, notes, and
  row version; they must not use a reduced header-only response.
- Add a specialized selector only when the frontend genuinely needs extra
  fields that the shared `Id` and `Name` response cannot supply.
- Do not include `CompanyId` in tenant request DTOs.
- Do not send calculated totals or item units from invoice forms.
- Swagger is the authoritative API contract delivered to the frontend after
  each implementation step.
