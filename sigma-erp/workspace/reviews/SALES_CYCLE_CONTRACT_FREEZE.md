# Sales Cycle — Contract Freeze

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-03 |
| Plan | `SALES_MAINTENANCE_EVOLUTION_PLAN.md` (D1–D7 resolved here) |
| Authority | Owner instruction 2026-10-03: "شوف الاقرب فى system … عايز الدورة كاملة وضيف اى حاجة محتاجها سواء باك ان او فرونت بنفس نظام البرنامج"; delivery-note stage requested by the owner; all Sales screens reviewed per the guide. |

Every decision below is a *Reviewer decision (owner instruction to take the closest option in the system)*, with the existing Sigma element it reuses. The owner reviews the whole cycle afterwards.

## 1. Decisions D1–D7

| # | Decision | Closest existing element reused | Rejected alternative |
|---|---|---|---|
| D1 | VAT rate from Settings › Common through `ITaxPolicyService`, snapshotted on the agreement as `TaxPercent`; tax calculated once on the document net (after discount) with `VatPolicy` | MiscellaneousInvoice / BE 15 rule D4-4 | Hard-coded 15 %; tax before discount |
| D1b | No VAT posted on the down payment receipt itself; a tax-on-advance document stays available through the existing Advance Tax invoice | `InvoiceCreatingType.AdvanceTax` + `CustomerAdvances` allocation | New advance-VAT engine |
| D2 | Down payment and installments are ordinary customer **Receipts** (Dr bank/cash, Cr customer AR). The sales invoice debits the customer with the total, so the receipts net the receivable | `ReceiptService.BuildAndSaveJvAsync`; existing quotation down-payment receipt | Separate advance-liability posting (needs an advance-application engine that does not exist for sales) |
| D3 | Payment structure = down payment + N monthly installments (0 installments = cash). Cheque number and bank per installment row stay as post-dated cheque information | existing `SalesAgreementPayment` columns | Bank-finance documents (no Sigma owner exists; future slice) |
| D4 | No financing profit on installments (the current quotation/agreement has none) | existing quotation terms | Flat/reducing profit engine |
| D5 | Cheques are informational on the schedule; collection is by Receipt | existing columns | Cheque register |
| D6 | The unit sold is `Equipment` ("Sales Fleet"). Equipment gets a server-owned `SaleStatus` and an optional `PurchaseCost`. Revenue posts to `SaleVehicleSiGmaAccount`, cost to `SaleVehicleCostAccount` against `StockAccount` (only when cost > 0) | `LinkAccountsGeneral.SaleVehicleSiGmaAccount`, `SaleVehicleCostAccount`, `StockAccount` (already in the default link catalogue, unused until now) | Asset-disposal posting of rental `Vehicle` |
| D7 | Cancel only before invoicing and only while no receipt is linked to the agreement (receipts must be voided/refunded first). Cancel releases the units and returns the quotation to Customer Approved. After invoicing, corrections use the existing Credit Note (not automated in this slice) | `ReceiptService` void; quotation status | Automatic forfeiture/refund |
| D8 (revised 2026-10-03) | Delivery creates one **Sales Delivery Note** (`SalesDeliveryNote`, own number series `SDN`) per unit: agreement, unit, customer, delivery date, plate, chassis, received by, notes | Sales module; numbering through `CodeCreateService` | Reusing the equipment-rental `DeliveryNote` (first choice, withdrawn after the owner asked "what is correct"): that register is rental-specific (master agreement, return date, invoicing start) and feeds rental timesheets and credit notes; a sale transfers ownership and has none of those. |
| D9 | Sales invoice = `MiscellaneousInvoice` with `Module = Sales`, created by the agreement's Invoice action; edit/delete of that invoice from the miscellaneous invoice screen is blocked | `ModuleType.Sales`, `MiscellaneousInvoice` | New invoice type |
| D10 | Numbering: SalesQuotation uses the existing `SalesQuotation*` settings; SalesAgreement uses prefix `VSA` (the `SalesAgreementCodePrefix` setting already numbers rental `Agreement`); DeliveryNote uses `DeliveryNoPrefix` | `CodeCreateService`, `DocumentType.SalesQuotation/SalesAgreement/Delivery` | Ticks fallback |
| D11 | Paid amount of each schedule row is derived (not stored): all non-voided, non-deleted receipts of the agreement (`SalesAgreementId`) plus the quotation down-payment receipt, allocated oldest-first (down payment, then installments by date, then SrNo) | Receipt as the money record | Allocation table |

## 2. Lifecycle

```
Quotation: Pending → InternallyApproved → CustomerApproved → Converted
           (reject/revise/unapprove unchanged; Converted returns to CustomerApproved
            when its agreement is cancelled or deleted)
Agreement: Open → Invoiced → Delivered → Closed
           Open → Cancelled
Unit:      Available → Reserved (agreement saved) → Sold (invoiced) → Delivered
           Reserved → Available (cancel / delete / unit removed)
```

| Action | Allowed from | Effect |
|---|---|---|
| Save agreement | new / Open | units Reserved; quotation Converted; schedule regenerated |
| Edit | Open | financial fields locked once a receipt exists (only dates, cheques, banks, terms, documents) |
| Delete | Open, no receipt | soft delete; units Available; quotation CustomerApproved |
| Cancel (reason) | Open, no receipt | Cancelled; units Available; quotation CustomerApproved |
| Invoice (invoice date) | Open | MiscellaneousInvoice + posted JV; units Sold |
| Deliver (date, received by, notes) | Invoiced | Sales Delivery Note per unit; units Delivered |
| Close | Delivered and outstanding = 0 | Closed |
| Receipt for agreement | Open, Invoiced, Delivered | amount ≤ outstanding; customer forced |

## 3. Calculation (backend owner: `SalesAgreement` domain)

1. `Sales` = Σ item price (quotation-based: price = quotation unit price of the model).
2. `DiscountAmount` = round(Sales × Discount% / 100); quotation-based discount = 0.
3. `Tax` = `VatPolicy.CalculateTax(Sales − DiscountAmount, TaxPercent, decimals)`.
4. `TotalCharges` = Sales − DiscountAmount + Tax.
5. `RemainingAmount` = TotalCharges − DownPayment (≥ 0); installments required when > 0.
6. `PerInstallment` = round(Remaining / N); the last installment = Remaining − PerInstallment × (N − 1).
7. Schedule: DownPayment row (`SrNo` "0", date = agreement date) when DownPayment > 0; installment k (`SrNo` k) dated `FirstInstallmentDate` + (k − 1) months. Client rows may override date, cheque number and bank by `SrNo`; amounts are server-owned.
8. Money decimals from `GetMoneyDecimalPlacesAsync`.

## 4. API contract

| Endpoint | Request | Response |
|---|---|---|
| `GET SalesAgreement` | `Filters[no|customerId|dateFrom|dateTo|status|search|sortField|sortOrder]` | `Results<SalesAgreementListVM>`: id, no, date, customerName, customerCode, totalCharges, outstandingAmount, status |
| `GET SalesAgreement/GetByWithNavigationsId/{id}` | — | `SalesAgreementDetailVM` (below) |
| `POST/PUT SalesAgreement` | Add/Update VM (below) | `Result` |
| `DELETE SalesAgreement` | id | `Result` |
| `GET SalesAgreement/available-units?agreementId=` | optional agreement id | `Results<SaleUnitOptionVM>`: id, no, plateNo, chassisNo, year, carModelId, carModelName, carMakeName |
| `POST SalesAgreement/{id}/invoice` | `{ invoiceDate }` | `Result` (Id = invoice id) |
| `POST SalesAgreement/{id}/deliver` | `{ deliveryDate, notes }` | `Result` |
| `POST SalesAgreement/{id}/close` | — | `Result` |
| `POST SalesAgreement/{id}/cancel` | `{ reason }` (5–500) | `Result` |
| `GET SalesAgreement/due-installments` | fromDate, toDate (required), customerId?, agreementNo?, includePaid?, pageNo, pageSize, sortField, sortOrder | `Result<DueInstallmentReportResultVM>`: items, totals, paging |

**Add VM**: salesQuotationId?, customerId, date, termsAndConditions (≤2000, optional), documents[], discount (0–100), downPayment (≥0), numberOfInstallments (0–120), firstInstallmentDate?, salesAgreementItems[{ saleFleetId, price }], salesAgreementPayments[{ srNo, date, chequeNo?, bankId? }] (overrides only). **Update VM** adds id and item ids.

**Detail VM**: id, no, date, status, salesQuotationId, salesQuotationNo, customerId, customerName, customerCode, termsAndConditions, documents, sales, discount, discountAmount, taxPercent, tax, totalCharges, downPayment, numberOfInstallments, firstInstallmentDate, remainingAmount, perInstallment, paidAmount, outstandingAmount, invoiceId, invoiceNo, invoiceDate, deliveryDate, cancellationReason; items[id, saleFleetId, saleFleetNo, plateNo, makeAndModelId, makeAndModelName, year, chassisNo, price]; payments[id, srNo, type, date, chequeNo, bankId, bankName, amount, paidAmount, remainingAmount, status, isOverdue]; deliveryNotes[id, no, deliveryDate, plateNo, chassisNo]; receipts[id, no, date, amount, isVoided].

**Due installment row**: paymentId, agreementId, agreementNo, customerName, plateNo, srNo, type, dueDate, amount, paidAmount, remainingAmount, status, overdueDays, chequeNo, bankName. Totals: amount, paidAmount, remainingAmount.

**Quotation**: Add/Update/Detail gain `validUntil` (≥ date, optional); ListVM gains `validUntil`; status `Converted = 6`. Customer approval and agreement creation are refused after `validUntil`.

**Receipt**: Add/Update/Detail gain `salesAgreementId`; cannot be combined with `salesQuotationId` or `agreementId`.

**Equipment (Sales Fleet)**: Add/Update gain `purchaseCost` (≥0, optional); List/Detail gain `saleStatus` and `purchaseCost`; `saleStatus` is server-owned.

**Enums**: `SalesAgreementStatus { Open = 1, Invoiced = 2, Delivered = 3, Closed = 4, Cancelled = 5 }`, `SalesAgreementPaymentType { DownPayment = 1, Installment = 2 }`, `SalesInstallmentStatus { Unpaid = 1, PartiallyPaid = 2, Paid = 3 }`, `EquipmentSaleStatus { Available = 1, Reserved = 2, Sold = 3, Delivered = 4 }`, `QuotationStatus.Converted = 6`. Enums are serialized as numbers (existing API convention).

**Removed surfaces**: `SalesAgreementItemController`, `SalesAgreementPaymentController` (its due-installments route moves to `SalesAgreement/due-installments`), Angular standalone `SalesAgreementItem`, `SalesAgreementPayment`, `SalesQuotationItem` modules.

## 5. Accounting (invoice action)

| Line | Debit | Credit |
|---|---|---|
| Customer (partner control account) | TotalCharges | |
| `SaleVehicleSiGmaAccount` | | Sales − DiscountAmount |
| `TaxCollected` | | Tax |
| `SaleVehicleCostAccount` (per unit with cost) | PurchaseCost | |
| `StockAccount` | | PurchaseCost |

Posted with `SaveAndPostJVAsync` (no approval), voucher type `MiscellaneousInvoice`, open period required; every account resolved before the first save, failure otherwise.

## 6. Migration (owner-run)

`Add-Migration SalesCycleCompletion` — SalesAgreement: Date, Status, TaxPercent, DiscountAmount, FirstInstallmentDate, InvoiceId, DeliveryDate, CancellationReason; drop IsClosed. SalesAgreementItem.ChassisNo int → nvarchar(50). SalesAgreementPayment.Type nvarchar → int. SalesQuotation.ValidUntil. Receipt.SalesAgreementId. New table SalesDeliveryNote. Equipment.SaleStatus, PurchaseCost. Index filters on SalesAgreement.SalesQuotationId and Receipt.SalesQuotationId. Test data only (owner rule): existing rows take defaults (Status Open, Date = CreatedAt, Type by old text).

## 7. Change record (2026-10-03, after the owner's questions on unit conditions and post-sale state)

| Change | Supersedes | Reason |
|---|---|---|
| A unit can be sold only when it is active, `SaleStatus = Available` (or already on this agreement), not out on an equipment-rental `DeliveryNote` without `ReturnDate`, and has a model and a chassis number. Against a quotation the units must match its models and quantities and take its unit prices | — (made explicit) | Owner asked which conditions a sold vehicle must meet; Speed Auto and ERP practice (serialized item must be free stock) |
| Invoice requires `PurchaseCost > 0` on every unit; the cost-of-sales lines are therefore always posted | D6 "only when cost > 0" | A sale without cost overstates profit and leaves the unit in stock; business-correct over easy (owner rule) |
| On Invoice the unit becomes `Sold` and `IsActive = false`; on Deliver it becomes `Delivered`. `EquipmentService` keeps it inactive on update and refuses re-activation | §2 unit lifecycle (adds the active flag) | Owner asked what state takes the vehicle out of service: inactive units leave every rental and selection list |
| Sales delivery notes are numbered by their own `SDN` series (`DocumentType.SalesDeliveryNote`) | D10 "DeliveryNote uses `DeliveryNoPrefix`" | Follows the D8 revision; the rental `DeliveryNote` is untouched |

## 8. Final reconciliation (2026-10-03, source-only)

| Check | Result |
|---|---|
| Backend routes vs Angular services | Match: list/CRUD from `SiGmaControllerBase`, `available-units`, `due-installments`, `{id}/invoice|deliver|close|cancel`; detail through `GetByWithNavigationsId` → `BuildDetailAsync` |
| Removed child modules | `SalesAgreementItem`, `SalesAgreementPayment`, `SalesQuotationItem` removed on both sides; `layout.module.ts` providers removed |
| Equipment | `purchaseCost`, `saleStatus` exposed and edited; Inactive locked for Sold/Delivered; delete blocked server-side when the unit is on an agreement |
| Agreement editor screen type | Built as type 02 (header-owned rows), not 05 — reviewer decision per `ui/screens/00-catalog.md` |
| Diff hygiene | No merge markers or whitespace errors in scoped files |
| Pending (owner) | `Add-Migration SalesCycleCompletion`, backend and Angular build, runtime/print/RTL/dark verification; `tsconfig.app.json` entries if the compiler reports new standalone dialogs missing |
| Follow-ups (out of scope) | Shared reason dialog for Sales/Rental/Lease; Fleet editor and Receipt editor still legacy shapes; 239 `fleet.*` ar keys missing (pre-existing) |
