# Vouchers and journals — Maintenance / Evolution Plan

| | |
|---|---|
| Status | Frozen — in progress |
| Owner verification pending | yes |
| Date | 2026-10-01 |
| Tier | L (module, several documents, accounting effect) — Master block 1 *Proportional process* |
| Requested as | "نفذ باقى التوصيات" after "موافق نمشي على منطق Speed"; data is test data ("البيانات الحالية تجريبية") |
| Decisions | `JOURNAL_ENTRIES_DECISION_SHEET.md` — *Owner decisions 2026-10-01* (J-1, F2, F4, F8, I1, I2), evidence from the Speed Auto Systems Journal report |
| Findings | `Deferred/JOURNAL_ENTRY_CREATION_AND_ROUNDING_FEATURE_REVIEW.md` (F1–F11, I1–I2) |
| Guides | Master Guide; backend blocks 8, 14, 15 (Pattern 3, *Journal posting policy*), 18; UI screen type 08; packets `-Check` 8×OK (2026-10-01) |

## 1. Impact map

| Area | Owner today | Change |
|---|---|---|
| Debit note posting | `DebitNoteService.BuildJournalVoucherLinesAsync` | Counter Payable: proportional reversal of the allocated bill's lines. On Account: credit side from the partner side (customer → charge revenue + Tax Collected; supplier → the line's chosen account + Tax Paid) |
| Credit note posting | `CreditNoteService.BuildJournalVoucherLinesAsync` | Counter Receivable: proportional reversal of the allocated invoice's lines, VAT included (F8, F3) |
| Payments | `PaymentService` (CRUD stub, no journal) and an Angular stub | Rebuilt as the mirror of Receipt: types, payment method, allocation against bills, journal, approval, void (F1) |
| Receipts | `ReceiptService.BuildAndSaveJvAsync` | Credit account by type: deposit → Customer Deposits Payable, general → chosen line account (F2); cheque method → PDC receivable on receipt (I1) |
| Cash deposit / card settlement | `CashDepositService`, `CardTransactionBankTransferService` | Credit the account the source receipt debited (F5) |
| Allocation, deposit refund, voucher types | `JournalVoucherService.AllocateAsync`, `CustomerDepositService`, PDC payable | F6, F7, F9 |
| Posted-document delete | `InvoiceService.RemoveAsync` and siblings | J-1: void with reversing journal; delete only drafts |
| New documents | — | Asset sale invoice (F2), fiscal-year closing voucher (I2) |

## 2. Classification

| Item | Class |
|---|---|
| Proportional allocation helper (`FinancialNumberPolicy.AllocateProportionally`) | **Create** (shared) |
| Debit note and credit note posting | **Refactor** |
| Payment voucher | **Replace** (stub → full document) |
| Receipt posting by type, cash deposit, allocation, refund | **Extend / Refactor** |
| Invoice/bill delete of posted documents | **Refactor** (J-1) |
| Asset sale invoice, year-end closing | **Create** |

## 3. Slices (in order)

| Slice | Content | Migration |
|---|---|---|
| **V1** | Debit note F4 and credit note F8/F3 posting; shared proportional helper; debit-note line account for the supplier side | Yes — `DebitNoteDetail.AccountId` |
| **V2** | Payment voucher F1 (backend + Angular) | Yes — payment columns |
| **V3** | Receipt F2 (deposit, general) and I1 (cheque in hand); F5 clearing | Possibly — general-receipt account |
| **V4** | F6 allocation, F7 refund date and method, F9 voucher types | No |
| **V5** | J-1 void for invoices, bills and notes | Possibly |
| **V6** | Asset sale invoice | Yes |
| **V7** | Fiscal-year closing voucher (I2) | Possibly |
| **V8** | F10/F11 rounding duplicates and round-off slot | No |

Every slice ends with a source-only diff review and an owner build. The next slice starts after the owner reports the build.

## 4. Implementation log

### V1 — debit note and credit note posting (2026-10-01) — Implemented, source-only (backend)

**Shared pieces:**
- `FinancialNumberPolicy.AllocateProportionally`: proportional shares; the largest weight takes the remainder.
- `JournalVoucherResolver.AddProportionalReversal`: reverses part of a posted source document line by line. It keeps each line's account, cost center, job and branch.

**`DebitNoteService`:**
- **Counter Payable:** credits each allocated bill's own lines in proportion. Before, it credited the supplier account again, so the entry had no effect.
- **On Account:** the side follows the partner.
  - **Supplier:** credits the line's new `AccountId` and Tax Paid. A line account is required and validated.
  - **Customer:** credits the charge revenue and Tax Collected. Before, VAT always went to Tax Paid.
- **VAT:** the document VAT is calculated per rate and rounded once (D4-4).

**`CreditNoteService`:**
- **F3:** a return line with an invoice debits that invoice's revenue lines.
- **F8:** an allocation-only Counter Receivable note reverses the allocated invoice's revenue **and** VAT. It also requires an invoice on every allocation.
- **VAT:** document VAT per rate (D4-4) across both line collections.

**Entities:**
- `ApplyDocumentTax` on `DebitNoteDetail`, `CreditNoteDetail` and `CreditNoteAccountDetail`.
- `DebitNoteDetail.AccountId` with FK `Restrict`; VMs and the detail map carry `AccountId`/`AccountName`.

**Migration (owner):**
```powershell
Add-Migration AddDebitNoteDetailAccount
```

**Found in the Angular screens (next slice V1-UI):**
- The debit note editor is legacy: native date input, hard-coded "Tax 15%", no allocation grid for Counter Payable, and no supplier on On Account.
- The credit note editor is to be checked in the same slice.
- Both move to screen type 08 (financial document).

**Books:** backend 0.47 — block 15 decided-rules table, block 5 helper row. Skill row added.

**Owner verification (2026-10-01):** "الكود اشتغل تمام" — `dotnet build` and `ng build` pass after V1 and the D5-4 fixes (`common.service`, `correctVehicleStatus.service`, `BaseService.delete` → `Result<T>`, the limousine settings read, three empty-list literals, transportation invoice `getById`).
