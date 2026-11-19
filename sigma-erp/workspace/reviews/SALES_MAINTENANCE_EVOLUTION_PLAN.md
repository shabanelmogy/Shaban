# Sales Cycle — Maintenance / Evolution Plan

## Current authorized corrective continuation — 2026-10-26

The owner requests current Sales menu review and implementation of confirmed
findings. Tier L continuation follows SALES_CURRENT_REVIEW_CONTRACT_FREEZE.md,
which freezes the presentation/cache/lifetime slice after actual route discovery.
Older D1–D7 blockers below were resolved by SALES_CYCLE_CONTRACT_FREEZE and later
fix/partial-invoice decisions; they are historical, not blockers to this slice.
Keep current business/API/financial/partial-invoice/collection contracts and shared
owners. Extend actual reference consumers, refactor read lifetimes, remove
duplicate loading visuals/raw bypasses. Reuse current owners instead of parallel
loaders/caches/screens. Backend discovery may add bounded confirmed fixes only
after root freezes their exact contract. Runtime/SQL/schema boundaries unchanged.

Current continuation complete in source: S26-01–09 implemented and reconciled
in SALES_FEATURE_REVIEW, including Fleet grid forwarding and split aggregate
query amendments. User guide/UI22/BE9/skill and packets updated, source parsers
and all8 packet checks pass. No new migration; runtime/SQL/visual checks and a
future narrow Partner-currency API contract remain explicitly separate.

| Field | Value |
|---|---|
| Status | Blocked |
| Owner verification pending | yes |
| Date | 2026-10-03 |
| Scope | `SiGmaAngularFrontEnd/src/app/modules/Sales/*` and the backend behind it (SalesQuotation, SalesAgreement, SalesAgreementItem, SalesAgreementPayment, DueInstallments, Equipment "Sales Fleet"), plus the vouchers they touch (Receipt, Invoice, Credit Note) |
| Packet | `PLAN-00-maintenance-evolution.md` (drift check: OK for all packets, 2026-10-03) |
| Blocking reason | Business decisions D1–D7 below. Slice S0 (defect fixes) needs no decision and can be frozen on its own. |

Sources: frontend source read directly; backend mapped by a read-only explorer and spot-verified (quotation loaded without items in `SalesAgreementService.cs:297-300`; no writer sets `SalesAgreement.IsClosed`); ERP practice from public SAP, NetSuite, Business Central, D365, Odoo, CDK and Speed Auto Systems pages (URLs in "Research evidence"). No build, test, database, browser, Graphify or MCP was used. No source file was changed.

## 1. Requested outcome

Understand the existing Sales module, make its ambiguous business explicit, and define the complete sales cycle (quotation → agreement → collection → invoice → delivery → closing, with cancellation and installment paths) by comparison with mature ERPs and the owner's Speed reference.

## 2. Existing-State Inventory

| Concern | Current owner/source | Current behavior | Consumers | Known debt/constraint | Evidence |
|---|---|---|---|---|---|
| Quotation | `SalesQuotation` aggregate + `SalesQuotationService` | Lines by car **model** (not a unit), qty × price, per-line tax from settings; down payment, N installments, per-installment computed on backend. Statuses Pending → InternallyApproved/Rejected → CustomerApproved/Rejected; Revise, Unapprove. | Agreement create, Receipt | No validity date, no "Converted", no expiry | `SalesQuotationService.cs` 37-455 |
| Down-payment receipt | `ReceiptService` (`Receipt.SalesQuotationId`) | User creates a Receipt from a customer-approved quotation; amount must equal down payment; JV Dr Bank / **Cr Customer AR** | Quotation unapprove guard | Customer ends with an unmatched credit; no VAT on advance; not linked to the agreement | `ReceiptService.cs` 447-488, 676-744 |
| Agreement | `SalesAgreement` aggregate + `SalesAgreementService` | Header: customer, terms, discount **%**, persisted Sales/Tax/TotalCharges/DownPayment/Remaining/PerInstallment; items = Equipment unit + model + year + chassis + price; payments = free-text type rows (Down Payment/Installment), cheque no, bank, amount | Due Installments, Equipment delete guard | No date, no status besides `IsClosed` (never set), no invoice, no posting, no vehicle reservation | `SalesAgreement.cs`, `SalesAgreementService.cs` |
| Payment schedule | Angular `SalesAgreement/details.component.ts` 650-675 | Generated **in the browser**: one down-payment row + N monthly rows from today at `perInstallment` | Due Installments | Backend never checks Σrows = total, row count, or down-payment row | `SalesAgreementService.cs` 382-393 |
| Due installments | `SalesAgreementPaymentService.GetDueInstallmentsAsync` | Lists rows with `Type == "Installment"` of open agreements in a date range; customer required; "payment method" = bank name | Due Installments screen | Ignores whether paid; no overdue/aging; no all-customers view | lines 14-94 |
| Sales fleet | `Equipment` (Angular `Sales/Fleet`) | Unit master: plate, make, model, year, chassis, engine, warranties, documents | Agreement items | No status, cost, price, sold flag; not linked to rental `Vehicle` | `Equipment.cs`, `EquipmentService.cs:174` |
| Invoice | `Invoice` / `InvoiceBase` | Detail variants for rental, lease, equipment rental, limousine, transportation | — | **No sales-agreement invoice**: no revenue, VAT output, COGS or AR for a vehicle sale | Angular `Vouchers/Invoices/Invoice/components/*` |
| Reports | `SalesReportsService`, `BusinessReportsService`, Angular `SaleReport` | Typed on SalesAgreement generics but report rental/lease/invoice data | — | Naming misleading | backend map |
| Reusable pattern | `LoanPaymentPlan` / `LoanEMI` (`LoanEMIStatus` Paid/Unpaid) | Backend-generated flat EMI schedule with last-row remainder adjustment (purchase/financing side) | Bills | Good reference for a persisted sales schedule | backend map |

## 3. Confirmed defects (independent of business decisions)

| # | Defect | Evidence | Effect |
|---|---|---|---|
| F1 | Quotation is loaded **without items**, so `TotalAmount`/`TotalTax` (`[NotMapped]` over items) are 0 | `SalesAgreementService.cs:297-300`, `518`; verified | Every agreement created from a quotation saves zero financials, or fails when a down payment exists |
| F2 | Agreement item prices ignored when a quotation exists; no check that items match quotation models/units | `SalesAgreementService.cs:515-518` | Agreement can sell different units than quoted |
| F3 | Discount applied **after VAT** (TotalCharges = (Sales+Tax) − %); Tax stays on the undiscounted base | `SalesAgreement.cs:31-33`; Angular 798-808 | Wrong VAT; business-incorrect |
| F4 | Same Equipment unit can be sold in several agreements | duplicate check only inside one agreement (`:366-368`); no index; no unit status | Double sale |
| F5 | `ChassisNo` is `int?` on the item but `string` on Equipment; Year string vs int; chassis re-typed instead of taken from the unit | `SalesAgreementItem`, `Equipment` | VINs are alphanumeric; data mismatch |
| F6 | Schedule integrity not validated on the backend; schedule built by the client | see §2 | Σinstallments ≠ total possible |
| F7 | Payment `Type` is free text; report depends on the literal `"Installment"` | `SalesAgreementPaymentService.cs:46` | Fragile |
| F8 | Per-installment rounding without last-row adjustment (quotation and agreement); Angular agreement hard-codes VAT 15 % | `SalesQuotation.cs:37-40`, `SalesAgreement.cs:35-37`, Angular 710 | Totals drift; wrong VAT outside 15 % |
| F9 | Numbering not configured: no `CodeCreateService` case; falls back to `NAME-<ticks>`; `SalesAgreementCodePrefix` is used by the **rental** Agreement | `CodeCreateService.cs` 57, 79 | Unusable document numbers |
| F10 | Unique filtered indexes on `SalesAgreement.SalesQuotationId` and `Receipt.SalesQuotationId` ignore `IsDeleted`; voided receipts still block | `SalesAgreementConfig.cs`, `ReceiptConfig.cs:42-44`, `SalesQuotationService.cs:366-370, 395-397` | Re-create after delete fails with a generic error |
| F11 | `SalesAgreementItem`/`SalesAgreementPayment` controllers still expose generic CRUD (orphans, bypass of IsClosed and recalculation); Angular still ships standalone Item/Payment modules with scaffold models | controllers; `SalesAgreementItem/models/create.ts` | Aggregate bypass |
| F12 | Soft-deleted children resurface (update Include, detail ProjectTo, due-report plate subquery) | backend map | Removed rows visible |
| F13 | A supplier can be selected as customer (`ExistsAsync<Partner>`) | `SalesAgreementService.cs:348`, `SalesQuotationService.cs:471` | Wrong party |
| F14 | Agreement has no transaction date; lists/filters use `CreatedAt` | `SalesAgreementService.cs:200-203, 247` | Back-dating impossible; reports by audit date |

## 4. Logic Ambiguity Register

| Rule/question | Current evidence | Status | Why it matters | Required decision/source | Owner |
|---|---|---|---|---|---|
| Tax jurisdiction and rate (KSA 15 %, UAE 5 %, Egypt 14 %) | Settings rate on quotation; Angular agreement hard-codes 15 %; Bank model has `TRN` | Conflicting | VAT rate, VAT on advances, e-invoice format | D1 | Owner + accountant |
| VAT on the down payment at receipt | Receipt posts no VAT | Missing | In KSA/UAE/Egypt the tax point includes advance payment | D1 | Accountant |
| Down payment accounting (customer advance liability vs AR credit) | Cr AR today | Conflicting with ERP practice | Balance sheet presentation, application to invoice | D2 (check Speed journal) | Owner |
| Payment structures sold: cash, bank-financed, in-house installments | Only in-house style rows with cheque/bank columns | Missing | Determines receivable split and documents | D3 | Owner |
| In-house installment profit (none / flat / reducing; murabaha) | No rate exists | Missing | Revenue = cash price; profit recognised over time (IFRS 15 / EAS 48, AAOIFI FAS 28) | D4 | Owner + accountant |
| Meaning of `bankId` + `chequeNo` on a payment row | Free fields | Uncertain | Post-dated cheques (customer bank) vs bank-finance disbursement | D3 / D5 | Owner |
| What is sold: `Equipment` (sale stock) or rental `Vehicle` (de-fleet) | Items reference Equipment; rental Vehicle has statuses; Speed has "For Sale" and "Sold – ownership not transferred" | Uncertain | Inventory (IAS 2) vs PP&E disposal / transfer to inventory (IAS 16.68A); COGS source | D6 | Owner |
| Unit cost for COGS | Equipment has no cost | Missing | Gross margin, inventory relief | D6 | Owner |
| Cancellation: refund or forfeit the down payment | Delete only | Missing | Customer balance and income | D7 | Owner |
| Quotation validity / expiry | None | Missing | Stale prices | Recommend default validity (decide days) | Owner |
| When an agreement is "closed" | `IsClosed` never set | Missing | Locks and reports | Recommend: closed when invoiced, delivered and fully collected | Owner |
| Speed behaviour for vehicle sale journals | Not inspected | Missing | Owner's reference system | Owner logs in; inspect `#/tenant/crs/journal` for a sold vehicle | Owner |

## 5. Research summary (target practice)

The common chain across SAP VMS, NetSuite, Business Central, D365, Odoo and CDK:

1. **Quotation** with validity and approval; becomes **Converted**.
2. **Sales agreement / order** — the unit (VIN) is mandatory on confirmation; confirmation **reserves** the unit.
3. **Down payment receipt** — a customer **advance (liability)**, not revenue; VAT due at receipt where the law sets the tax point at payment; applied automatically to the invoice.
4. **Bank finance approval** (when financed) — dealer receives the financed amount; the receivable moves to "Due from bank".
5. **Sales invoice** — revenue at **cash price**, VAT, COGS / inventory relief per unit, advance applied, receivable split (customer / bank / installment); immutable after posting, corrected by credit note.
6. **Installment schedule** — persisted backend snapshot (principal, profit, total, due date), last row absorbs rounding, per-row status (Not due, Due, Partially paid, Paid, Overdue, Rescheduled, Settled early); receipts allocated oldest-first; aging; late fees; early-settlement rebate; reschedule as a new version.
7. **Delivery note** — PDI, plates/registration, insurance; unit becomes Delivered.
8. **Cancellation** (before invoice: release unit, refund/forfeit advance) and **credit note / return** (after invoice).
9. **Unit status**: Available → Reserved → Sold (invoiced) → Delivered; side paths Returned, Total loss; fleet units **For Sale** after transfer from fleet.

Speed Auto Systems publicly documents lease/rental and fleet de-fleeting (For Sale, Sold – ownership not transferred), not retail installment sales.

## 6. Impact Map

| Area | Producer/owner | Consumers | Data/calculation impact | Compatibility risk | Required phase |
|---|---|---|---|---|---|
| Quotation | SalesQuotationService | Agreement, Receipt | Add validity date, Converted status | Low | 1, 2, 3, 4 |
| Agreement header | SalesAgreementService | Due report, invoice (new) | Add Date, Status enum, payment structure; fix discount base; replace `IsClosed` by status | Medium (existing rows) | 1, 3, 4 |
| Agreement items | same | Equipment, invoice | ChassisNo → string from unit; unit uniqueness | Medium (type change) | 1, 3 |
| Schedule | new backend generator | Due report, receipts | Persisted rows with status; payment type enum | Medium | 1, 3, 4 |
| Equipment (unit) | EquipmentService | Agreement, invoice, delivery | Sale status, cost, usage class | Medium | 1, 2, 3 |
| Receipt | ReceiptService | Quotation, agreement, schedule | Link to agreement; advance account; VAT on advance; allocation to schedule rows | High (accounting) | 1, 4 |
| Sales invoice | new invoice variant | GL, AR, VAT, reports | Revenue, VAT, COGS, AR split, advance application | High | 1, 3, 4 |
| Delivery note | existing `DeliveryNote` or new | Unit status | Status transition | Low | 3, 4 |
| Cancellation / credit note | CreditNote | Agreement, unit, receipt | Reversal entries | High | 4 |
| Reports | Due installments, aging, sales | — | Paid status, overdue buckets | Low | 2 |

## 7. Gap Decision Table

| Area | Current state | Decision | Target responsibility | Reason/evidence |
|---|---|---|---|---|
| Quotation aggregate | Works; no validity/conversion | Extend | SalesQuotationService | Add `ValidUntil`, `Converted` status set when an agreement is created |
| Agreement financial calculation | Client-built, discount after VAT, rounding drift | Refactor | `SalesAgreement` domain | F1–F3, F6, F8 |
| Agreement lifecycle | `IsClosed` only | Replace | Status enum + transition endpoints | F14, §5 step 2 |
| Payment rows | Free text, client-generated | Replace | Backend schedule generator (reuse `LoanEMI` pattern) | F6, F7, §5 step 6 |
| Unit reservation | None | Create | Equipment sale status + unique active link | F4, SAP VMS |
| Down-payment receipt | Cr AR, linked to quotation only | Refactor | ReceiptService (advance account, agreement link) | D2 |
| Sales invoice | Absent | Create | New invoice type for sales agreements | §5 step 5 |
| Installment collection | Absent | Create | Receipt allocation to schedule rows | §5 step 6 |
| Due installments report | Ignores payment | Extend | Paid/overdue status, aging | F8 report gap |
| Bank finance | Absent | Create (if D3 includes it) | Agreement child | D3 |
| Delivery | Absent for sales | Extend `DeliveryNote` or Create | Delivery note → unit Delivered | §5 step 7 |
| Cancellation / return | Delete only | Create | Cancel transition + credit note | D7 |
| Standalone Item/Payment controllers and Angular modules | Generic CRUD | Remove | Parent aggregate only | F11 |
| Numbering | Fallback ticks | Extend | `CodeCreateService` cases + own settings prefixes | F9 |

## 8. Option / Decision Matrix

| Option | Business correctness | Maintainability | Compatibility/migration | Future extension | Complexity/risk | Decision |
|---|---|---|---|---|---|---|
| A. Patch defects only (S0) | Partial: no revenue, VAT or COGS for sales | High | Low | Low | Low | Do first, not sufficient |
| B. Agreement + **Sales Invoice** + persisted schedule + receipt allocation (ERP chain §5) | Correct (IFRS 15 / EAS 48, VAT tax point, advance liability) | High: one owner per document | Medium: new tables, status backfill | High (bank finance, delivery, credit note slot in) | Medium-high | **Recommended** |
| C. Post revenue directly from the agreement (no invoice) | Weak: no tax invoice, no immutable posted document | Low | Low | Low | Medium | Rejected |

## 9. Decision Review (owner input required)

| Decision requiring owner input | Options presented | Recommended (business-correct) | Owner decision | Evidence/date | Remaining condition |
|---|---|---|---|---|---|
| D1 Tax jurisdiction; VAT on down payment | KSA 15 % / UAE 5 % / Egypt 14 %; VAT at receipt or at invoice | Settings-driven rate; VAT on the advance at receipt where the law sets that tax point | Pending | — | Accountant confirmation |
| D2 Down-payment accounting | Cr AR (today) / Cr Customer Advances (liability), applied on invoice | Customer advance liability, applied automatically on the invoice | Pending | — | Check Speed journal |
| D3 Payment structures | Cash / bank-financed / in-house installments / mixed | Support all three via a payment-structure field; bank portion becomes "Due from bank" | Pending | — | — |
| D4 In-house installment profit | None / flat / reducing; recognition method | Revenue at cash price; profit to unearned finance income, released over the term (effective rate) | Pending | — | Accountant |
| D5 Cheques on schedule rows | Post-dated cheque register / informational only | Cheque register with Received → Deposited → Cleared / Bounced | Pending | — | — |
| D6 What is sold and its cost | Equipment as sale stock / rental Vehicle de-fleet / both | One unit master with usage class; fleet units transferred to sale stock at carrying amount before sale | Pending | — | Speed check |
| D7 Cancellation of a deposited agreement | Full refund / forfeit / partial per terms | Per contract terms with approval; refund via payment voucher, forfeit to other income | Pending | — | — |

## 10. Target Contract (draft; freezes after D1–D7)

| Contract | Target owner | Exact rule/shape | Existing consumers affected | Status/evidence |
|---|---|---|---|---|
| Domain/invariant | SalesAgreement | Status: Draft → Confirmed → Invoiced → Delivered → Closed; Cancelled only before Invoiced. One active agreement per unit. Discount reduces the taxable base. Σschedule = total. | Agreement screens, due report | Draft |
| Persistence/data | SalesAgreement, schedule, Equipment | Agreement `Date`, `Status`, `PaymentStructure`; item `ChassisNo` string from unit; schedule rows with status; Equipment sale status and cost | Existing rows need backfill | Draft |
| Calculation/precision | SalesAgreement domain | Net = Σ(price) − discount; VAT on net at settings rate; installments rounded to 2 dp, last row absorbs remainder | Quotation same rule | Draft |
| API/request/response | SalesAgreementController | Add/Update carry inputs only (no client schedule); actions `confirm`, `cancel`, `invoice`, `deliver`, `close` | Angular agreement | Draft |
| Failure behavior | Services | Result failures for invalid transitions, unit already reserved, schedule mismatch | Angular | Draft |
| Authorization/tenancy | existing | Authentication only (no permission API) | — | Confirmed |
| UI/workflow | Angular Sales | Agreement actions by status; schedule read-only from backend; receipts allocate to rows | Sales screens | Draft |
| Reports/export | Due installments, aging | Paid/overdue status, all-customers view, aging buckets | Reports | Draft |
| Integration/runtime | Receipt, Invoice, CreditNote, DeliveryNote | Link fields `SalesAgreementId`; posting via existing JV builders | Vouchers | Draft |

## 11. Migration and Compatibility Plan

| Change | Existing data/consumer behavior | Migration/backfill/default | Rollout order | Recovery/rollback | Owner action |
|---|---|---|---|---|---|
| Agreement `Date`, `Status` | `IsClosed` only | Date ← CreatedAt; Status ← Confirmed (Closed if `IsClosed`) | S1 | Reversible columns | `Add-Migration AddSalesAgreementLifecycle` |
| Item `ChassisNo` string | int values | Convert; prefer the unit's chassis | S0 | Type change | `Add-Migration FixSalesAgreementItemChassis` |
| Unique indexes with `IsDeleted = 0` | Filter ignores deleted | Recreate filters | S0 | — | same migration as above |
| Schedule table | Free-text payment rows | Map Down Payment/Installment rows; status Not due | S3 | Keep old rows until verified | `Add-Migration AddSalesInstallmentSchedule` |
| Equipment sale status/cost | None | Available; Sold for units on existing agreements | S1 | — | included in S1 migration |

Test data only (owner note): no data-preservation scripts are required beyond simple defaults.

## 12. Dependency-Ordered Implementation Plan

| Slice | Outcome | Depends on | Applicable phases/packets | Main areas | Completion evidence |
|---|---|---|---|---|---|
| S0 | Fix F1–F14 within the current model | none | 1, 2, 3 | SalesAgreementService, SalesQuotationService, configs, numbering, Angular agreement, remove standalone Item/Payment surfaces | Agreement from quotation saves correct totals; unit cannot be sold twice |
| S1 | Agreement lifecycle + unit reservation + quotation Converted/validity | S0 | 1, 3, 4 | Status enum, transitions, Equipment status | Transition tests |
| S2 | Down payment as customer advance linked to agreement | D1, D2 | 1, 4 | ReceiptService, JV builder | Journal matches Speed / accountant |
| S3 | Persisted installment schedule + receipt allocation + due/aging report | S1, D3, D4, D5 | 1, 2, 3, 4 | Schedule entity (LoanEMI pattern), Receipt allocation, report | Σrows = total; paid rows drop from due report |
| S4 | Sales invoice (revenue, VAT, COGS, AR split, advance application) | S1–S3, D1, D3, D4, D6 | 1, 3, 4 | Invoice type, posting | Trial balance check |
| S5 | Bank finance approval and disbursement | S4, D3 | 1, 3, 4 | Agreement child, Due-from-bank | — |
| S6 | Delivery note → unit Delivered; Close agreement | S4 | 3, 4 | DeliveryNote | — |
| S7 | Cancellation and credit note / return | S1, S4, D7 | 4 | CreditNote, refund | Reversal entries |
| S8 | Fleet → sale stock transfer (if D6) | D6 | 1, 4 | Vehicle/Equipment | — |

## 13. Verification Matrix

| Risk/behavior | Source check | Automated check | Runtime/browser/data check | Owner | Completion gate |
|---|---|---|---|---|---|
| Agreement totals from quotation (F1) | Include items | Service test | Create agreement from quotation | Owner | Totals equal quotation |
| VAT after discount (F3) | Domain method | Unit test | — | Owner | Tax = rate × net |
| Double sale (F4) | Unique active index + check | Concurrency test | Two agreements, same unit | Owner | Second rejected |
| Schedule integrity | Backend generator | Unit test Σrows | — | Owner | Σ = total, last row adjusted |
| Sales posting | JV builder | Posting tests | Trial balance | Owner + accountant | Entries match D1–D4 |

## Research evidence

- Speed Auto Systems: https://speedautosystems.com/vehicle-leasing-software/features/ , https://speedautosystems.com/car-rental-software/features/
- SAP VMS vehicle status and actions: https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/f340785101c548c9beeda9284efd18a0/60dcc353b677b44ce10000000a174cb4.html
- SAP down payment request/clearing: https://learning.sap.com/learning-journeys/operating-the-receivables-management-process-in-sap-s-4hana/exploring-the-integration-of-sd-and-fi-for-down-payment-processing
- NetSuite customer deposits: https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_N1299826.html
- Business Central prepayments: https://learn.microsoft.com/en-us/dynamics365/business-central/finance-how-to-create-prepayment-invoices
- D365 credit holds: https://learn.microsoft.com/en-us/dynamics365/finance/accounts-receivable/cm-sales-order-credit-holds
- Odoo quotation validity: https://www.odoo.com/documentation/19.0/applications/sales/crm/acquire_leads/send_quotes.html
- CDK inventory statuses: https://lithia.vehicle.connectcdk.com/pid1033/help/client/scr-vehhome/fields/veh_pp_inventory_status.htm
- IFRS 15 financing component example: https://www.bdo.com.au/en-au/content/accounting-news/accounting-news-march-2019/contract-with-a-customer
- IAS 16.68A transfer to inventory: https://www.ifrs.org/content/dam/ifrs/publications/html-standards/english/2025/issued/ias16.html
- Contracts in transit (due from bank): https://www.accountingtools.com/articles/contracts-in-transit
- Rule of 78 / early settlement: https://en.wikipedia.org/wiki/Rule_of_78s

Unverified: Egyptian/KSA/UAE VAT articles were read from secondary translations; Speed's installment and cheque handling is not public.
