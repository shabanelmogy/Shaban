# Journal Entry Creation and Rounding — Comprehensive Review (read-only)

| | |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Date | 2026-09-29 |
| Request | "عايز مراجعة شاملة على نقطة انشاء القيود والتقريب عايز اساس قوى البيانات كلها تجريبيية" |
| Guides | Master Guide; backend blocks 14, 15 (*Journal posting policy* rules 1–10), 18, 19; packets `-Check` 8 × OK |
| Deferred | Owner 2026-09-29: the document-level findings (F1–F11, I1–I2) wait for the owner's screen-by-screen review of invoices, vouchers and journals; the shared foundation (engine, posting policy, rounding, period lock, lookups, JV numbers) is done. Each screen review starts from this file |
| Related | `TAX_SETTINGS_MAINTENANCE_EVOLUTION_PLAN.md` (tax from settings), `CURRENCY_EXCHANGE_RATE_MAINTENANCE_EVOLUTION_PLAN.md`, `DOCUMENT_NUMBERING_MAINTENANCE_EVOLUTION_PLAN.md` (same folder) |
| Scope | Every voucher source (line accounts, direction, amounts, rounding, edit/delete/void, allocations) after the posting-policy, engine and VAT changes of 2026-09-29. Exchange rate and document numbering are deferred plans. Test data only — data fixes are not a constraint |

## Engine and rounding — status

| Area | State |
|---|---|
| Posting engine (`JournalVoucherResolver`) | One gate: open fiscal year + month, references, **money scale validated (never rounded)**, active leaf accounts, cost centers, branch default, balanced one-sided lines, counter number |
| Rounding owner | `FinancialNumberPolicy` (AwayFromZero, base-currency precision) + `FinancialNumberPolicyResolver` |
| Rounded at source | Invoice (`RecalculateTotals`, `SetTaxExplicit`), Bill/BillDetail (+ discount), credit/debit note lines, Miscellaneous Invoice lines, card settlement (Commission/Tax), Rental/Lease/Booking deposits (private 2-decimal `RoundMoney`), Close Job invoice lines |
| User-entered money (receipt amount, allocation amounts, manual JV) | Not rounded by design; the engine rejects more decimals than the currency allows with a clear message |

## Findings by source

| # | Sev. | Source | Finding | Evidence | Recommendation |
|---|---|---|---|---|---|
| F1 | High | **Payment voucher** | Creates **no journal**: `PaymentService` is plain CRUD although `Payment` has `JournalVoucherId`, partner, payment method and details. Supplier payments never reach the ledger. | `VouchersServices/PaymentService.cs` | Build it like Receipt (approval document): Dr partner control account, Cr payment-method/bank account per payment; allocations against bills like debit notes. |
| F2 | High | **Receipt** | Every `ReceiptType` posts Cr partner control account. GeneralReceipt (no partner) cannot be saved; AdvanceReceipt credits AR instead of *Customer Advances*; AssetSaleReceipt credits AR; **DepositReceipt**: rental/lease/booking deposits post Cr *Customer Deposits Payable*, but editing that receipt through `ReceiptService` rebuilds it as Cr AR. | `ReceiptService.BuildAndSaveJvAsync` | Credit account by type: Contact/Staff → partner; Advance/AdvanceTax → `CustomerAdvances`; Deposit → `CustomerDepositsPayableAccount` (and keep deposits editable only from their source or rebuild with the same rule); General → a chosen account line; AssetSale → decision (asset disposal flow). |
| F3 | High | **Credit note** | Reverses revenue into *Sales › Sales* for every line, while rental/lease/limousine invoices credited their own revenue accounts (RentPerDay, Rent, Rental). The revenue account never nets to zero. | `CreditNoteService.BuildJournalVoucherLinesAsync`, `InvoiceService.ResolveRevenueAccountAsync` | Debit the revenue account of the credited invoice (same resolver as the invoice by `InvoiceType`); keep *Sales* only for lines without an invoice. |
| F4 | High | **Debit note** | (a) *CounterPayable*: Dr supplier control account and Cr the **same** account per allocation → no ledger effect. (b) *OnAccount*: credits **customer charge (revenue) accounts** (`GetChargeAccountIdAsync(module, charge)`) for what is a supplier-side document. (c) VAT is always *Tax Paid*, even when the partner is a customer contact. | `DebitNoteService.BuildAndSaveJournalVoucherAsync`, `BuildJournalVoucherLinesAsync` | Decide the debit-note meaning (supplier return vs customer extra charge). Supplier: Dr AP, Cr the bill's expense accounts (or a *Purchase Returns* slot), Cr Tax Paid. Customer: Dr AR, Cr charge revenue, Cr Tax Collected. CounterPayable must credit the counter-party (e.g. offset AR↔AP), never the same account. |
| F5 | High | **Cash deposit / Card settlement** | Receipts debit the **payment-method** account; the cash deposit credits the General slot *Customer Cash Deposits Account* and the card settlement credits *Customer Credit Card Deposits Account*. Unless each cash/card payment method is linked to exactly those accounts, the clearing balances never clear. | `ReceiptService` (debit = payment-method account), `CashDepositService.BuildAndSaveJvAsync`, `CardTransactionBankTransferService` | Credit, per detail, the account the **source receipt** debited (`SourceReceipt.PaymentMethod` → `GetPaymentMethodAccountIdAsync`), so clearing always nets; drop the General slots or keep them only as fallback. |
| F6 | Medium | **Allocation (JV screen)** | Available amount is `detail.Debit ?? detail.Credit ?? 0`; generated credit lines have `Debit = 0` (not null), so a credit line shows 0 and can never be allocated. No check that the source is on the opposite side / same control account. | `JournalVoucherService.AllocateAsync` | `Math.Max(Debit ?? 0, Credit ?? 0)`; require opposite side and same account/partner. |
| F7 | Medium | **Customer deposit refund** | Posted on `DateTime.Today` (not the refund date) and always to *Default Collection Account* (no payment method/bank choice). | `CustomerDepositService` refund | Take the date and payment method from the request; credit the payment-method account. |
| F8 | Medium | **Credit note (allocation only)** | A CounterReceivable credit note with only allocations posts Dr revenue / Cr AR for the allocated total with **no VAT reversal**. | `BuildJournalVoucherLinesAsync` (last block) | Uncertain intent: if it reduces the invoice value it must reverse VAT (split by 5 %); if it is an AR↔AP offset it must not touch revenue. Owner decision. |
| F9 | Low | Voucher types | PDC payable maturity, deposits and refunds use `VoucherTypeName.Receipt`; `Payment` exists. Reports by voucher type mislabel them. | PDC payable, CustomerDeposit | Use `Payment` for money out. |
| F10 | Low | Rounding duplicates | Private `RoundMoney` with a fixed 2 decimals in Rental, Lease, Booking, Sales Agreement, Rental Quotation; Close Job rounds to 2. Consistent with the default precision, not base-currency aware. | services listed | Replace with `FinancialNumberPolicy.RoundMoney(value, decimals)` (with the currency plan). |
| F11 | Low | Round-off | `LinkAccountsGeneral.CashDepositRoundOffAccount` is configured but no posting uses it. | enum, no consumer | Use it when a counted cash deposit differs from the receipts (or remove the slot). |
| I1 | Info | PDC receivable | A received post-dated cheque has no journal until maturity (memo approach). | PDC services | Keep, or post to a *PDC Receivable* asset on receipt — policy choice. |
| I2 | Info | Year end / periodic | No closing voucher (reports derive retained earnings); no generators for depreciation or salary vouchers although their subtypes exist. | `VoucherSubType`, `AccountReportsService` | Confirm the intended year-end method. |

## Suggested order

F1 (payments missing from the ledger) → F2, F3, F5 (wrong or non-clearing accounts on every receipt/credit note/deposit) → F4 after deciding the debit-note meaning → F6, F7 → F8 decision → F9–F11.

Owner decisions needed: F2 (AssetSale and General receipt accounts), F4 (debit-note meaning), F8 (allocation-only credit note), I1, I2.

No source file was changed. Prohibited commands (build, test, lint, migrations, database, browser, commit) were not run.
