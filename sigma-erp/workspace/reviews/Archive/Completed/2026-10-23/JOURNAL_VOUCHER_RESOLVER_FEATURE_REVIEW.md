# Journal Voucher Resolver — Feature Review (read-only)

| | |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-09-29 |
| Request | Review `SiGma.Business/Resolver/` — how journal entries are created. Exchange rate excluded until the owner decides its mechanism |
| Guides | Master Guide; backend blocks 14, 15 (*Journal posting policy*), 18, 19; packets `-Check` 8 × OK |
| Scope | `JournalVoucherResolver.cs` (808 lines, after the posting-policy change), `FinancialNumberPolicyResolver.cs`, `AccountResolver.cs`, `FiscalYearInfo.cs`, the three exception types; their registration in `Program.cs` and the report filters that read the lines |

## How a journal is created

1. **Accounts** — `GetPartnerAccountAsync` (partner → contact group → Link Accounts *Contacts*; Contact/Driver through their company, Driver/Staff fall back to the single group of that type), `GetGeneralAccountIdAsync`, `GetChargeAccountIdAsync(module, chargeType)`, `GetPaymentMethodAccountIdAsync` (method + branch + category), `GetBankAccountIdAsync`. All return `int?`; an exact mapping to an active posting account is required; two matches throw `LinkAccountConfigurationException` (409).
2. **Header and lines** — `NewJV` (draft, `IsGenerated`), `AddLine(jv, account, debit, credit, memo, partner)`.
3. **Save** — `SaveJVAsync` (draft) / `SaveAndPostJVAsync` (posted): opening-balance and locked-voucher guards → header references → **open fiscal year and month** → lines present → money scale (base-currency decimals) → line references and lengths → active leaf accounts, no children → cost-center default/required → debit = credit → one positive side per line → fiscal year id → save.
4. **Post / unpost** — `PostAsync` (period, re-validation) / `UnpostAsync` (not voided, not opening balance, no allocations, period).
5. Errors are `JournalPostingException` (400 through the middleware).

The design is sound: one gate, strict line rules, fail-closed account lookup, ambiguity detection, period lock.

## Findings

| # | Severity | Finding | Evidence | Recommendation |
|---|---|---|---|---|
| R1 | High | **No money rounding in the engine.** Every service rounds by itself (2 decimals hard-coded in Lease, Job, Work Order; **4** in Card Transaction Bank Transfer), while `SaveCoreAsync` rejects any value with more decimals than the base currency (default 2). A card commission such as 1.2345 therefore fails the whole transfer; a total computed from unrounded parts can also miss debit = credit by 0.01. | `CardTransactionBankTransferService.cs:637-638`, `FinancialNumberPolicyResolver.ValidateMoneyScaleAsync`, `FinancialNumberPolicy.DefaultCurrencyDecimalPlaces = 2` | Add `RoundMoneyAsync`/`GetMoneyDecimalsAsync` to the resolver (base-currency precision, `AwayFromZero`), round in `AddLine` callers, and derive the balancing line (customer/supplier total) from the rounded lines. The currency mechanism can later swap the precision source. |
| R2 | Medium | **Line branch is optional and reports disagree.** Most generators leave `JournalVoucherDetail.BranchId` empty (only Rental/Lease/Booking deposits and Opening Balances set it). `AccountReportHelper` filters `(d.BranchId ?? header.BranchId)`, but `AccountReportsService.cs:2256` filters `d.BranchId` only, so invoice/bill/receipt lines disappear from that branch-filtered report. | `AccountReportHelper.cs:219`, `AccountReportsService.cs:2256` | In `SaveCoreAsync`, default each line's `BranchId` from the header; keep the report fallback for old rows. |
| R3 | Medium | **`AccountResolver` is dead and wrong.** AutoMapper value resolver registered in `Program.cs` but used by no profile; `AccountService` generates codes itself. Its logic compares codes as strings (`"9" > "10"`) and `int.Parse`s the last segment. | `Program.cs:54`, no `MapFrom<AccountResolver>` | Delete the class and its registration. |
| R4 | Low | `GetFiscalForDateAsync` counts all vouchers of the year (`JournalVoucher.Count()`) on every save/post only to fill `FiscalYearInfo.JournalVoucherCount`, which the posting path does not use. | resolver `GetFiscalForDateAsync` | Project the count only where it is needed (fiscal-year screens). |
| R5 | Low | `HasActiveAllocationsAsync` loads all detail ids (including deleted) then sends them back in `Contains`; one `Exists` with a join on `JournalVoucherDetail.JournalVoucherId` is enough. | resolver `HasActiveAllocationsAsync` | Single query. |
| R6 | Low | `GetPartnerAccountAsync` does up to four round trips (partner → type table → company → group type). | resolver `:48-166` | One projection per partner type, or a partner→group view. |
| R7 | Low | The resolver holds three responsibilities (Link-Accounts lookup, posting engine, fiscal period) and has no interface, so it cannot be substituted in tests. | 808 lines | Later split: `LinkAccountLookup`, `JournalPostingEngine`, `AccountingPeriodService` behind interfaces; not urgent. |
| R8 | Info | Journal numbers come from the central generator, which is backend backlog 14 (row count, can collide after deletes / under concurrency). Posting depends on it. | backlog 14 | Fix under backlog 14. |
| R9 | Deferred | Currency: `CurrencyId` is carried on the header and money scale uses the base currency; no exchange rate or foreign amount. | owner decision pending | Revisit with the exchange-rate mechanism (R1's precision source plugs in there). |

## Suggested order

R1 (blocks card transfers today), R2, R3 — small and local to the resolver/registration; R4–R6 performance; R7 when the resolver is next extended; R9 with the currency decision.

No source file was changed by the review itself. Prohibited commands (build, test, lint, migrations, database, browser, commit) were not run.

## Implementation (2026-09-29)

Owner: "عدل كل الملاحظات ما عدا سعر الصرف انا عايز ابنى اساس قوى". Book: backend block 15 rules 8–10 and engine structure (0.26).

| # | Outcome |
|---|---|
| R1 | `GetMoneyDecimalPlacesAsync` (base-currency precision). `CardTransactionBankTransferDetail.Recalculate(vatRate, moneyDecimalPlaces)` rounds Commission/Tax with it (was 4 decimals), Net stays Amount − Commission − Tax; the service validation uses the same rounding. The engine rounds generated lines as a safety net; manual JV lines keep the strict scale check. |
| R2 | `SaveCoreAsync` and `PostAsync` default each line's `BranchId` to the voucher's; `AccountReportsService` branch filter falls back to the voucher branch for older lines. |
| R3 | `AccountResolver.cs` deleted and its `Program.cs` registration removed (no profile used it). |
| R4 | The posting path no longer counts vouchers; `FiscalYearInfo.JournalVoucherCount` removed (no consumer). |
| R5 | `HasActiveAllocationsAsync` is one `Exists` query through the allocation navigations. |
| R6 | `LinkAccountLookup.GetPartnerAccountAsync`: one projection reads type, group and company (TPT `is`/cast), then company group, group type and mapping; results cached per request (scoped). |
| R7 | New `ILinkAccountLookup`/`LinkAccountLookup`, `IAccountingPeriodService`/`AccountingPeriodService`, `IJournalNumberGenerator`/`JournalNumberGenerator` (scoped, assembly scan). `JournalVoucherResolver` is the posting engine and delegates the old members, so its 30 callers are unchanged. |
| R8 | New vouchers take their number from the per-tenant `DocumentNumberCounter` (`DocumentType.JV`; prefix, optional branch code and yyMM of the voucher date, numeric length from the JV settings), seeded from the highest issued trailing number and checked for uniqueness; opening-balance vouchers use it too. Backlog 14 marked resolved for journal vouchers. |
| R9 | Deferred (exchange rate). |

No new migration (`DocumentNumberCounter` already exists); `AddIsGeneratedToJournalVouchers` from the posting-policy change is still pending.

Compile/runtime risks: the TPT `is`/cast projection in `ResolvePartnerAccountAsync` (EF translation); `GenerateJournalVoucherNumberAsync` now takes `(date, branchId, ct)` — its only callers (opening balances) were updated. Owner verification: build; create two invoices in parallel → distinct JV numbers in the configured format; card transfer with 2.15 % commission → saves and balances; branch-filtered account report shows invoice lines.

## Follow-up 2026-09-29 — rounding and VAT policy

Owner asked for the rounding policy that best fits the business. Decision (backend block 15 rule 8, 0.28): round in the domain when a value is computed; line amount = round(qty × price); VAT per line with `VatPolicy.CalculateTax` (rate is a **percentage**, `StandardRatePercent = 5`), document tax = sum of rounded line taxes; total = amount + tax; away from zero at base-currency precision; the engine rounding stays a safety net only.

Bugs found and fixed:
- `InvoiceService.RecalculateTotals(0.05m)` into a percentage formula → rental/lease/limousine invoices charged **0.05 %** VAT. Now `VatPolicy.StandardRatePercent` (5 %).
- `BillDetail.CalculateTotals` defaulted `TaxRate` to `0.05m` (the add/update VMs never send it) → bills posted 0.05 % Tax Paid. Now 5 %.
- Bill header `Discount` reduced the total but was missing from the journal (unbalanced → save failed). Now validated (0…subtotal) and spread over the expense lines by amount; VAT unchanged.
- Credit/debit note lines, invoice `SetTaxExplicit` and Miscellaneous Invoice lines now round amount and tax; Miscellaneous Invoice line total is derived (was taken from the client).

Files: `SiGma.Helpers/Helpers/VatPolicy.cs` (new), `InvoiceBase`, `CreditNoteDetail`, `CreditNoteAccountDetail`, `DebitNoteDetail`, `BillDetail`, `Bill`, `MiscInvoiceItem`; services `InvoiceService`, `BillService`, `CreditNoteService`, `DebitNoteService`, `MiscellaneousInvoiceService`, `CardTransactionBankTransferService`. No migration.

Data note (test system): invoices and bills created before this change carry 0.05 % VAT; re-save or recreate them.

Owner verification: invoice of 1,234.57 → tax 61.73, total 1,296.30; bill line 3 × 33.335 → amount 100.01 (100.005 rounded), tax 5.00; bill with discount 10 on two lines 60/40 → expense debits 54/36, Tax Paid unchanged, supplier credit = total.

## Correction 2026-09-29 — engine never rounds

The owner pointed to the existing `FinancialNumberPolicy` / `FinancialNumberPolicyResolver` mechanism (one rounding mode, base-currency precision, `ValidateMoneyScaleAsync` rejects unrounded amounts, `IsLedgerCompatible`), designed so a journal can never differ from its document. The R1 "safety net" that rounded generated lines inside `SaveCoreAsync` contradicted it and is removed: every voucher, generated or manual, is validated with `ValidateMoneyScaleAsync` again. Rounding stays at the source (documents and generators use `FinancialNumberPolicy.RoundMoney` / `VatPolicy`). Book: block 15 rule 8 (0.29).

Noted, not changed: several services keep a private `RoundMoney` with a fixed 2 decimals (Rental, Lease, Booking, Sales Agreement, Rental Quotation); consistent with the default precision but not base-currency aware — candidates for `FinancialNumberPolicy` when the currency plan is done. `LinkAccountsGeneral.CashDepositRoundOffAccount` exists but no posting uses it.
