# Journal entries — owner decision sheet

| | |
|---|---|
| Status | Draft — awaiting owner decisions |
| Owner verification pending | yes |
| Date | 2026-10-01 |
| Origin | Completion plan R2 (`Archive/SIGMA_BOOKS_COMPLETION_MAINTENANCE_EVOLUTION_PLAN.md`). Open questions of `Deferred/JOURNAL_ENTRY_CREATION_AND_ROUNDING_FEATURE_REVIEW.md`, plus J-1 found while refreshing backend block 15 |
| Rule applied | *Business correctness first* (Master block 1): each recommendation is the accounting-correct treatment, not the current code. Items that depend on UAE VAT law are marked **confirm with the accountant** |

## J-1 — Deleting a posted financial document (new)

| | |
|---|---|
| Today | `InvoiceService.RemoveAsync` unposts a posted invoice in an open period, then soft-deletes the invoice and its journal. The document disappears from the ledger and its number from the sequence |
| Correct treatment | A posted (issued) tax invoice is never deleted. A full cancellation is a **void**: the document keeps its number and status *Voided*, and a reversing journal is posted on the void date. A partial correction is a **credit note**. Delete is allowed only for an unposted draft. The same applies to bills, receipts, payments and notes once posted |
| Why | The tax invoice has been given to the customer and the VAT is declared from it. Deleting it breaks the audit trail and the numbering, and silently changes a closed VAT figure if the period was already filed |
| Recommendation | Adopt void/credit-note only for posted documents (block 15). Implement per document in the voucher reviews |
| Confirm with the accountant | The UAE tax-invoice correction rules (tax credit note) and whether voids must keep the original date or use the void date |

## F2 — Receipt accounts by receipt type

| Type | Today | Correct (recommended) |
|---|---|---|
| Contact / Staff receipt | Cr partner control account | Keep |
| Advance receipt | Cr Accounts Receivable | Cr **Customer Advances** (liability) until it is applied to an invoice. VAT on an advance follows the AdvanceTax type (VAT is due when the advance is received — confirm with the accountant) |
| Deposit receipt | Rental/lease/booking deposits: Cr *Customer Deposits Payable*, but an edit through `ReceiptService` rebuilds it as Cr AR | Always Cr **Customer Deposits Payable**; edit only from the source document, or rebuild with the same rule |
| General receipt (no partner) | Cannot be saved | The user chooses the credit account per line (for example other income), with VAT when taxable |
| Asset-sale receipt | Cr AR | An asset sale is a taxable supply: it needs an **asset disposal invoice** (Dr AR, Cr disposal/proceeds, Cr output VAT, and the asset cost and depreciation removed with a gain or loss). The receipt then credits AR, which is correct once that invoice exists |

## F4 — Meaning of a debit note

| | |
|---|---|
| Today | (a) *CounterPayable*: Dr and Cr the **same** supplier account (no effect). (b) *OnAccount*: credits customer revenue accounts for a supplier document. (c) VAT is always Tax Paid |
| Correct (recommended) | **A debit note is a supplier-side document**: a purchase return or a claim on a supplier. Dr Accounts Payable, Cr the bill's expense accounts (or a *Purchase Returns* slot), Cr Tax Paid (input VAT reversed). An extra charge to a **customer** is not a debit note: it is a normal tax invoice (miscellaneous invoice). An AR↔AP offset for a party that is both customer and supplier is a settlement voucher (Dr AP, Cr AR), not a debit note |
| Confirm with the accountant | Supplier debit note vs supplier credit note naming in the UAE practice the business follows |
| **Owner decision (2026-10-01)** | **The customer debit note stays.** An extra charge to a customer often has no service to pick, so a normal invoice does not fit. The debit note therefore serves both sides, and the partner decides the entry: **customer** — Dr the customer control account, Cr the chosen charge/revenue account, Cr **Tax Collected** (output VAT); **supplier** — Dr the supplier control account, Cr the expense or *Purchase Returns* account, Cr **Tax Paid** (input VAT reversed). What still changes: (c) VAT follows the partner side (today it is always Tax Paid, which understates the output VAT of a customer debit note on the VAT return), and (a) *CounterPayable* credits the counter-party, never the same account. The customer debit note carries the tax-invoice particulars and references the original invoice when it adjusts one — **confirm the format with the accountant** |
| **By type (`DebitNoteType`, verified in `DebitNoteService` 2026-10-01)** | **OnAccount + customer:** lines by charge type; Dr customer, Cr charge revenue, Cr Tax Collected; the only kind that needs the tax-invoice particulars. **OnAccount + supplier:** Dr supplier, Cr the expense or *Purchase Returns* account (today it credits the module's charge **revenue** account), Cr Tax Paid; the supplier's own credit note is the tax document, so ours needs no tax-invoice particulars. **CounterPayable:** no lines and no VAT, only allocations against the supplier's bills; today Dr and Cr hit the same supplier account, so it has no ledger effect. Its business meaning is **open — owner question**: an AR↔AP offset (the supplier is also a customer → Cr the customer account), or something else |
| **CounterPayable — recommended meaning (reviewer research, 2026-10-01; awaiting owner approval)** | It is the mirror of the credit note's *CounterReceivable* (same screen family, same "allocate against documents" shape), so it means **a debit note against specific supplier bills**: a return, discount or claim that reduces what we owe on those bills — as in Odoo (*Debit Note* created from the vendor bill) and Zoho Books (vendor credit applied to a bill). Entry: Dr the supplier control account (allocated amount), Cr the bill's expense/purchase accounts or *Purchase Returns*, Cr Tax Paid for the VAT share (per tax rate, rounded once — D4-4); the allocation then clears the bill. An AR↔AP **contra** for a party that is both customer and supplier is a different business event (Dr AP, Cr AR, no VAT) and becomes its own settlement document if the owner needs it. The Arabic label "مستحقات" is renamed to "على فواتير المورد" in the screen review |
| **Reference behaviour — Speed Auto Systems (read-only inspection of its Journal report, 2026-10-01; the owner simulates this system)** | **Counter Payable:** Dr *Suppliers Payables* with the allocated amount; Cr **the allocated document's own lines in proportion** — the bill's expense/asset/GRN-clearing accounts and its VAT account (bill 80: 500 → Vehicles Cost 476.19 + Tax 23.81; a multi-line bill splits across every line). No reason field: the debit note is a proportional partial reversal of the bill. Allocated against a supplier **receipt**, it credits that receipt's cash account (a partial reversal of the receipt). **On Account:** the partner decides the side — customer: Dr *Customers Receivables*, Cr the line's revenue account, Cr *VAT OUTPUT*; supplier: Dr *Suppliers Payables*, Cr the account chosen on the line (expense or asset), Cr *VAT receivable*; staff: the staff account. **Asset Sale** is a third type (asset disposal). The report also lists *Voided Invoice/Bill/Debit Note…*, *Purchase Return*, *Mature Cheque Receivable* and *FiscalYearClosing* vouchers — reference evidence for J-1, I1 and I2 |
| **Owner decision F4 (2026-10-01): "موافق نمشي على منطق Speed" — Decided** | Follow the reference: CounterPayable = proportional reversal of the allocated document's lines (net accounts and VAT), VAT share rounded once per rate (D4-4); On Account credits the line's chosen account and takes the VAT account from the partner side. This supersedes the "reason field" proposal below. Receipts stay allocatable, as in the reference. Gap kept for F2: the reference has a third type, **Asset Sale** debit note (asset disposal), which Sigma lacks |
| **Screenshot evidence (owner, 2026-10-01)** | The CounterPayable create screen has date, branch, supplier, currency, detail, supplier ref no, and a grid of the supplier's open **bills and receipts** (amount, already allocated, *allocated now*, due). It has **no reason, no net amount and no tax**, which is why the entry has no credit side. To be correct it needs: (1) a **reason** (return / discount / price difference) that picks the credit account (*Purchase Returns*, *Discount Received*, or the bill's expense account); (2) the allocated amount is VAT-inclusive and is split into net and Tax Paid by the bill's tax rate (per rate, rounded once); (3) only **bills** are allocatable — a receipt carries no purchase or VAT to reverse, so it is matched through allocation, not through a debit note (recommended; owner to confirm) |

## F8 — Credit note that only allocates

| | |
|---|---|
| Today | A CounterReceivable credit note with only allocations posts Dr revenue / Cr AR with **no VAT reversal** |
| Correct (recommended) | If it reduces the value of an invoice, it is a **tax credit note**: reverse revenue **and** VAT (per tax rate, rounded once — D4-4). If it only offsets balances, it is not a credit note but a settlement/allocation, and it must not touch revenue |

## I1 — Post-dated cheques received

| | |
|---|---|
| Today | Memo only: no journal until maturity |
| Correct (recommended) | Post on receipt to a **PDC Receivable** asset (Dr PDC Receivable, Cr AR). At maturity: Dr Bank, Cr PDC Receivable. If the cheque bounces, reverse it (Dr AR, Cr PDC Receivable). The customer balance and the cheques in hand are then both visible in the ledger |
| Confirm with the accountant | The method the business reports with (both are accepted; the PDC account gives the better control) |

## I2 — Year end

| | |
|---|---|
| Today | No closing voucher; reports derive retained earnings. No generators for depreciation or salary vouchers, although their subtypes exist |
| Correct (recommended) | On fiscal-year close, post a **closing voucher**: income and expense accounts to retained earnings (reversed if the year is reopened), so the opening balances of the next year come from the ledger. Depreciation and payroll vouchers are separate features (their own plans) |

## How the answers are used

- Each answer is written once into backend block 15 (Pattern 3) and the skill.
- The voucher module of the screen review implements it, in this order: F1, F2/F3/F5, F4, F6/F7, F8–F11, then J-1 per document.

## Owner decisions — 2026-10-01

**Owner instruction:** "نفذ باقى التوصيات". Standing rule: follow the logic of Speed Auto Systems unless it breaks business correctness. **Data:** "البيانات الحالية تجريبية", so no historical backfill is required.

**Reference evidence:** Speed Journal report, read-only inspection, 2026-10-01.

| # | Speed Auto Systems (reference) | Decision |
|---|---|---|
| **J-1** | *Voided Invoice / Bill / Credit Note / Debit Note / Payment / Receipt / JV* voucher types post the reversal (negative amounts on the original sides); the document stays | **Decided:** a posted document is voided (status *Voided*, number kept, reversing journal), partial corrections through credit/debit notes; delete only for unposted drafts |
| **F2 Advance** | *Advance Receipt*: Dr cash, Cr **Customers Receivables** | **Decided — follow Speed (changes the earlier recommendation):** an advance is a prepayment of future invoices and is applied to them through allocation, so it stays on the customer account as a credit balance. Balance-sheet presentation of customer credit balances is a report concern |
| **F2 Deposit** | *Deposit Refund*: Dr Customers Receivables — deposits sit in AR | **Decided — Sigma keeps *Customer Deposits Payable* (deviation from Speed, business correctness):** a refundable security deposit is not consideration for a supply and must not be netted against invoices. The edit path through `ReceiptService` must keep the same account |
| **F2 General** | *General Receipt*: Cr the account chosen on the line (revenue, payable, petty cash…) | **Decided:** as Speed |
| **F2 Asset sale** | *Asset Sale Invoice*: Dr customer, Cr *Asset Sale Revenue*, Cr VAT output, Dr *Asset Sale Expense* (book value), Dr accumulated depreciation, Cr asset cost; *Asset Sale Receipt* then Cr AR | **Decided:** as Speed — an asset-sale invoice (new document) before the receipt; a separate slice |
| **F4** | See the rows above | **Decided:** as Speed |
| **F8** | *Counter Receivable Credit Note*: Dr the invoice's own revenue lines **and** VAT output in proportion, Cr Customers Receivables | **Decided:** as Speed — a proportional reversal of the allocated invoice, VAT included (mirror of Counter Payable) |
| **I1** | A cheque receipt debits *cheque In hand*; *Mature Cheque Receivable*: Dr bank, Cr cheque in hand; *Return Cheques Receivable*: Dr customer, Cr cheque in hand/bank | **Decided:** as Speed — post on receipt to the PDC (cheque in hand) account |
| **I2** | *FiscalYearClosing* voucher to *Retained Earnings* | **Decided:** a closing voucher on fiscal-year close; a separate slice |

## Superseding owner clarification — financial Void (2026-10-20)

Owner explicitly confirms the application convention: Void marks the retained source document and its existing journal canceled; it does NOT generate a reversing journal. This supersedes the reversing-entry part of the historical J-1 decision. Apply to new financial screens and existing-screen reviews. The current canonical rule/checklist is backend block15, Financial cancellation rule: original posting period open, source/tenant/state guards, active settlements protected, atomic flags/audit, effective readers exclude canceled journals, historical rows/number/original journal retained. No unrelated application screen was refactored under this clarification; document observed mismatches in its own scoped review. See current BILLS_ACTIONS_CONTRACT_FREEZE latest governing handoff and BILLS_ACTIONS_FEATURE_REVIEW correction for source evidence and pending runtime checks.
