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
- Do not add a general ledger or journal vouchers. Operational movements are
  the source of truth for stock, partner, and container balances.
- Do not store mutable current-balance fields on `Item`, `Store`,
  `BusinessPartner`, or `Container`.
- Use direct services with `ApplicationDbContext`. Do not add CQRS or repository
  classes.
- Every tenant-owned record receives `CompanyId` from the authenticated
  `company_id` claim, never from a request DTO.
- Posted documents and movements are immutable. Corrections use linked opposite
  movements.

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
- `Status`
- `InvoiceDate`
- `DueDate`, optional
- `InvoiceId`, optional reference to the original invoice for a return
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
- Posting and cancellation audit information
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
- Container movements are written only when the invoice is posted.

The customer container balance is:

```text
Customer container balance = SUM(OutgoingUnits - IncomingUnits)
```

A positive result means the customer still holds containers.

## 8. Movement entities

### ItemMovement

Stores immutable stock effects from invoices, opening balances, adjustments,
and future transfers.

Exactly one of `QuantityIn` or `QuantityOut` must be positive for a normal
movement.

### BusinessPartnerMovement

Stores immutable debit and credit effects from invoices, returns, partner
opening balances, receipts, and payments.

Balances must be calculated separately for each currency.

### ContainerMovement

Stores container units delivered to or returned by a customer. It links the
company, business partner, container store, container, and invoice.

### DriverTrip

Created automatically when a posted invoice uses an internal driver.

It stores:

- Driver
- Invoice
- Invoice number
- Export invoice code
- Business partner
- Trip date
- Nullable trip price

The trip price can be entered later without modifying the posted invoice.

## 9. Invoice lifecycle

### Draft

- May be created, updated, and soft-deleted.
- Stores header, product lines, and container lines.
- Does not create movements or affect balances.

### Posted

- Cannot be edited or deleted.
- Posting writes the invoice and all related movements atomically.
- Posting uses a SQL Server `Serializable` transaction for stock protection.

### Cancelled

- Cannot be edited, deleted, or posted again.
- Cancellation preserves original movements and writes opposite movements.
- Cancellation requires a reason and concurrency check.

## 10. Atomic posting workflow

1. Resolve the selected company from the authenticated claim.
2. Load and validate the draft and its concurrency value.
3. Validate the active partner, product store, country, and driver.
4. Load all requested items in one query and derive their units.
5. Derive currency from the business partner.
6. Recalculate quantities and totals on the server.
7. Group repeated items before stock validation.
8. Load all required stock balances in one query.
9. Reject an outbound operation that would make stock negative.
10. Validate the container store and assigned containers.
11. Add item, partner, and container movements.
12. Add a driver trip for an internal driver.
13. Mark the invoice as posted.
14. Save and commit once. Any failure rolls back the entire operation.

## 11. Return rules

- A sales return references a posted sales invoice.
- A purchase return references a posted purchase invoice.
- The original invoice must belong to the same company, partner, store, and
  currency.
- Returned quantity cannot exceed the remaining unreturned quantity.
- Repeated and concurrent returns must be included in the remaining-quantity
  calculation.
- Unlinked returns are not supported initially.

## 12. Cancellation restrictions

Block cancellation when:

- The invoice is not posted.
- It is already cancelled.
- It has active voucher allocations.
- It has posted return invoices.
- The required outbound reversal would make stock negative.

## 13. Related document entities

These remain separate features and tables:

- `StockOpeningBalance` and `StockOpeningBalanceLine`
- `PartnerOpeningBalance`
- `StockAdjustment` and `StockAdjustmentLine`
- `BusinessPartnerVoucher`
- `BusinessPartnerVoucherAllocation`

Their posted effects use the same item and partner movement tables used by
invoices.

## 14. Frontend contract rules

- Reuse the existing select endpoints for drivers, stores, items, and business
  partners when their data is sufficient.
- Add a specialized selector only when the frontend genuinely needs extra
  fields that the shared `Id` and `Name` response cannot supply.
- Do not include `CompanyId` in tenant request DTOs.
- Do not send calculated totals or item units from invoice forms.
- Swagger is the authoritative API contract delivered to the frontend after
  each implementation step.

