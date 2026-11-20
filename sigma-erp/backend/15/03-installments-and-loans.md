<!-- Part of backend block 15: see ../15-pattern-3-master-detail-with-financial-effect.md. Same status and authority as the block. -->

### Source-owned installment payments
A saved installment schedule is not a payment. Its source action changes a row
to Paid only after a real Payment/PV, its posted source-owned journal, the
durable installment link and any required principal allocation commit together.
Freeze the accounting roles first; never infer a loan liability transfer,
interest amendment, partial payment, settlement or restructuring from a screen.
For the owner-approved Bills full-payment slice, principal debits the original
Bill supplier payable account, positive interest debits linked InterestExpense,
and gross credits the saved RecoveryBank account; allocate only principal.

Retain immutable bank/interest account-role snapshots on the new source link so
historical payment validation does not depend on a later LinkAccounts mapping.
Prove one Payment owns its generated journal; verify real saved PV references,
not descriptions. Keep a tenant-scoped unique installment/request link,
idempotent replay and the same source/allocation lock order as competing writes.
Validate capacity from both allocation headers and their actual linked detail
owners; a mismatched header/detail pair fails closed before an effective-ledger
filter can hide the reservation. Generic Payment and generated-journal mutation
paths, including bulk/active and any exposed child writes, cannot bypass source
ownership. Historical Paid rows without a valid link remain readable without a
fabricated PV and block fresh cash until reviewed. Preparing a plan or allocating
a balance alone never marks an installment Paid.

Source evidence: BillService.InstallmentPayments, BillInstallmentPayment,
PaymentService and the source-payment JournalVoucherService active guard.
This is source-only conformance; owner migration and financial/concurrency
runtime acceptance remain pending. Exact first-slice limits stay in the Bills
payment contract rather than becoming assumed workflows for other documents.


### Source-owned loan down payments
A financing DownPayment is a term, not a cash movement. The owner-approved Bills
action pays the full saved positive down payment separately from the EMI table:
debit the original Bill supplier payable and credit its saved RecoveryBank,
without interest or a synthetic installment. Its real Payment, posted source
journal, durable Bill/plan/payment/request ownership link and paired allocation
commit atomically under the same allocation/source locks as installment cash.
No client-supplied amount, account, paid status or inferred prior payment.

Offer new cash only when reliable current Bill capacity minus remaining schedule
principal equals the whole saved down payment exactly. Existing allocations may
already cover that amount; show the authoritative outstanding value without
inventing a dedicated PV or paying twice. Partial/unexplained gaps require
reconciliation, not an automatic difference payment. Validate actual dates,
open period, precision/storage, source identity and zero-interest bank roles;
missing next-EMI InterestExpense configuration does not itself invalidate this
zero-interest payment. Retained link/PV/line/allocation proof, request collision
checks across loan operations, history dates/version and generic Payment/JV/Bill
correction guards must include the down payment. Reuse the cash construction
owner; no generic mutable link API or silent backfill. Account conversions that
move posted lines must move retained bank/interest role references consistently.
Owner migration and source/runtime acceptance remain feature-report concerns.


### Audited loan schedule revisions
Separate installment payment, rescheduling and early settlement; a misleading
reference label or example does not define accounting. When the owner approves
a replacement schedule, preserve Paid rows and their source-owned PVs, archive
only the unpaid generation through explicit revision ownership, and keep the
before/after terms and actor/time history. Do not delete old rows or include
archived rows in active due, payment eligibility, summaries or reports.
Prove revision/row same-tenant source ownership and reject broken chains.

Freeze principal conservation, interest treatment and any posting roles before
implementation. The approved Bills slice redistributes existing remaining
principal and interest without a new rate or fees. Early settlement pays the
whole remaining principal plus an explicit agreed interest bounded by the
remaining scheduled interest, reusing the approved source payment engine.
No inferred principal writeoff, capitalization, lender transfer or asset split.
If effective payable capacity differs from scheduled remaining principal, fail
closed rather than silently taking the smaller amount or inventing a payment.

Preview is read-only and server-calculated; commit revalidates the source and
expected version under the same allocation/source locks as competing payments.
Retain idempotent request/fingerprint identity, and commit archival, revision,
replacement rows and any source-owned cash/posting/allocation/status together.
Floor shares and exact final remainders must preserve totals with positive
principal/EMI, nonnegative interest and valid precision/storage/date bounds.
Generic correction cannot overwrite retained revision or Paid history.
Loan Settled is a separate proven state from the Bill's payable balance:
a schedule, allocation or Bill Closed alone does not prove all loan cash paid.
Source/runtime acceptance is recorded in the owning feature review.

Rules:

1. **Generated vouchers are source-owned.** `NewJV` sets `IsGenerated`; the Journal
   Voucher screen refuses edit, delete, approve, unapprove and void for them (and the
   UI shows them read-only). Only manual JVs are managed there.
2. **Existing posted edits** follow their confirmed source transaction contract;
   a supported rebuild uses `UnpostAsync` then re-posts through the resolver.
   Delete applies to unposted drafts only; legacy posted-delete paths remain
   backlog findings. Posted cancellation follows the flag-only Void rule above.
   Find the journal by the source FK, never by a line-description match.
3. **Period lock.** `EnsurePeriodOpenAsync` requires an open fiscal year covering the
   date **and** an open month (`MonthClose`). Save, post, unpost and void all call it,
   so nothing changes the ledger of a closed period.
4. **Post re-validates** active leaf accounts, balance and cost centers, because the
   draft may be older than an account change.
5. **Cost centers.** A line without a cost center takes the account's
   `DefaultCostCenterId`; an account with `CostCenterRequired` rejects a line
   without one.
6. **Errors.** Posting rules throw `JournalPostingException` (400 `Result` through
   `AccountingConfigurationExceptionMiddleware`); services that own a transaction
   catch it and return `Fail(message)`.
7. **Unlinked account = `null`.** Every resolver lookup returns `int?`; callers test
   `HasValue` (or `?? 0` then `<= 0`), never `== 0` on a nullable.
8. **Money.** Amounts a generator computes are rounded with the base-currency precision
   (`JournalVoucherResolver.GetMoneyDecimalPlacesAsync` + `FinancialNumberPolicy.RoundMoney`,
   away from zero), and the balancing line is derived from the rounded parts (for
   example card settlement: Net = Amount − Commission − Tax). The engine **never rounds**:
   `FinancialNumberPolicyResolver.ValidateMoneyScaleAsync` rejects any line (generated or
   manual) with more decimals than the base currency, so a journal always equals its
   document and an unrounded generator is fixed at its source (owner design, confirmed
   2026-09-29).
   **VAT and document totals (owner decision D4-4, 2026-10-01 — supersedes the per-line rule
   of 2026-09-29):** the domain rounds when it computes — line amount = round(qty × price).
   VAT is calculated **per tax rate on the document**: the rounded line amounts of each rate
   are summed, taxed once and rounded once — `VatPolicy.CalculateDocumentTax(lines, decimals)`
   (rate is a **percentage** from **Settings › Common** through `ITaxPolicyService`). When a
   line needs its own tax (display, a partial credit note, line reports, per-line journal
   detail), `VatPolicy.AllocateDocumentTax` distributes each rate's rounded tax over its lines
   in proportion to their amounts, the largest line taking the remainder, so the line taxes add
   up exactly to the document tax. Total = amount + tax, never re-rounded and never taken from
   the client. Reason (owner: "الصح دايما كبيزنس مش الاسهل"): rounding once gives the correct
   tax — per-line rounding drifts up to half a fils per line — and it is the tax-category model of
   e-invoicing standards. Job and Close Job already round once; invoices, bills, credit/debit
   notes and quotations still round per line and move in their review (backlog 24). A header discount on a supplier bill reduces cost: it is
   spread over the expense lines by amount (last line takes the remainder), VAT stays as
   billed. Found: `InvoiceService` passed `0.05m` and `BillDetail` defaulted to
   `0.05m` into percentage formulas, charging 0.05 % VAT; bill discounts were missing
   from the journal.
   **Tax rate source:** `ITaxPolicyService` (scoped, per
   request) reads `SettingsCommonModel.TaxPercentage` (default 5, validated 0–100),
   `IsTaxOptional`, and inclusion (`TaxInclusion` unless `AllPricesWithoutTax`). A
   document never takes the rate from the client: `ResolveRateAsync(requested)` accepts
   only the settings rate, or 0 when tax is optional, and refuses anything else;
   `ResolveTaxAmountAsync` serves amount-based documents (Limousine: the entered amount
   only when `AllowTaxEditingInLimoTrip`). The rate is **snapshotted** on the document or
   line (`TaxPercent`/`TaxRate`) and kept on edit, so a settings change never re-prices
   saved documents or journals. `VatPolicy.SplitInclusive` supports tax-inclusive
   prices; each screen enables it in its own review. Historical data import keeps the
   file rate. The frontend reads the same setting through `TaxSettingsService` for
   defaults and previews only.
   **Sales vs purchase tax:** sales tax is ours to calculate;
   purchase tax follows the supplier's tax invoice; a document that is not a tax invoice
   only estimates. `GetSupplierRatePercentAsync` / `ResolveSupplierRateAsync` give the
   settings rate for a tax-registered supplier (TRN or VAT number, not `TaxExempted`) and 0
   otherwise — used by purchase orders, goods received notes (no tax input; supplier-rate
   estimate) and bills. A bill may carry `TaxAdjustment` (±0.05, validated in the domain):
   the supplier invoice's rounding difference, added to the last taxed line so input VAT in
   the journal equals the supplier invoice. Trip bookings (sales) calculate the tax on add,
   update and finish (`ResolveTaxAmountAsync`); an entered amount is kept only when
   `AllowTaxEditingInLimoTrip`, and an entered 0 means no tax (optional tax only).
9. **Branch.** A line without a branch takes the voucher's; reports filter
   `(line.BranchId ?? voucher.BranchId)`.
10. **Numbers.** A new voucher gets its number from the per-tenant
    `DocumentNumberCounter` (`DocumentType.JV`, JV numbering settings, date's yyMM) in
    the same unit of work, not from the row-count generator.
