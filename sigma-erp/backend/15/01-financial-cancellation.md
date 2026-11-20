<!-- Part of backend block 15: see ../15-pattern-3-master-detail-with-financial-effect.md. Same status and authority as the block. -->

### Financial cancellation rule — mandatory on implementation and review

Apply this rule both when building a similar financial screen and when reviewing
an existing one, not only to Bills:

1. The owning source action marks the document and its existing source-owned
   journal `IsVoided = true` atomically. Retain the number, lines, amounts and
   posting history; do not delete the posted rows, unpost/reset the document,
   generate an opposite journal, or add cancellation allocations.
2. Before mutation validate tenant/source ownership, the permitted source-state
   transition, **the original journal's open fiscal year and month**, active
   allocations and any domain-specific settlement locks (such as paid Bill
   installments). A later cancellation audit date does not bypass a closed
   original period. Use the same allocation lock as competing source writers.
3. Persist reason/date/actor through the owning audit convention, deriving the
   actor on the server. Keep successful flags and audit together; failure leaves
   both source and journal unchanged. Do not invent an UnVoid transition during
   review; retain only a source workflow that has its own confirmed contract.
4. Effective-ledger balances, settlement calculations and allocation capacity
   exclude voided journals on both endpoints. Historical views keep canceled
   records clearly marked and the original journal remains readable. Do not
   label cancellation as paid/Closed or rewrite saved historical tax amounts.
5. Reconcile action visibility, authoritative mutation guards, journal linkage,
   balance/filter/report readers and race protection as one review. A hidden
   button alone is insufficient. Report out-of-scope nonconforming paths instead
   of silently changing unrelated screens or trusting an old reversal rule.

Verified source anchors: `JournalVoucherService.VoidCoreAsync`,
`CreditNoteService.ToggleVoidStatusAsync`, `DebitNoteService.ToggleVoidCoreAsync`
and `BillService.VoidBillCoreAsync` mark the retained journal voided; ledger
readers and `WhereLedgerEffective` exclude it. This evidence establishes the
shared convention, not completed runtime or whole-application conformance.

**Decided journal rules.**

| Document | Entry |
|---|---|
| Debit note — *Counter Payable* | Dr supplier with the allocated amount; Cr **the allocated bill's own debit lines in proportion** (expense, asset, GRN clearing, input VAT) — `JournalVoucherResolver.AddProportionalReversal` |
| Debit note — *On Account* | The partner decides the side: supplier → Dr supplier, Cr the account chosen on the line, Cr Tax Paid; customer → Dr customer, Cr the charge-type revenue account, Cr Tax Collected |
| Credit note — *Counter Receivable*, allocations only | Dr **the allocated invoice's own credit lines in proportion** (revenue and output VAT), Cr customer |
| Credit note — return line with an invoice | Dr the invoice's revenue lines in proportion (VAT excluded), Dr Tax Collected with the line tax, Cr customer; *Sales* only for a line without an invoice |
| Advance receipt | Cr the customer account (a credit balance applied to later invoices by allocation) |
| Deposit receipt | Cr *Customer Deposits Payable* — a refundable deposit is not netted against invoices (deviation from the reference, business correctness) |
| General receipt | Cr the account chosen on the line |
| Asset sale | An asset-sale invoice first (revenue, output VAT, cost and accumulated depreciation removed); the receipt then credits the customer |
| Cheque received | Dr the PDC (*cheque in hand*) account on receipt; maturity Dr bank, Cr PDC; bounce Dr customer, Cr PDC/bank |
| Fiscal-year close | A closing voucher moves income and expense to retained earnings |

A proportional reversal rounds each share to the money precision and gives the remainder to the
largest line (`FinancialNumberPolicy.AllocateProportionally`), so it equals the allocated amount.
Implementation order and status: `reviews/VOUCHERS_JOURNALS_MAINTENANCE_EVOLUTION_PLAN.md`.

**Exact currency arithmetic (2026-11-04).** The approved currency plan extends
`FinancialNumberPolicy` through its Currency partial: decimal money text is
validated before parsing can discard excess scale; amounts have at most16 whole
digits and currency scale0–6, dated rates have16 whole digits and12 places.
Signs, empty values and requiredness remain domain contracts. Use
`TryParseCurrencyAmount`, `FormatCurrencyAmount` and `SumCurrencyAmounts` for
adopting exact-money boundaries. They do not change legacy18,2 storage or
convert existing numeric DTOs automatically. `ConvertCurrencyAmount` uses
BigInteger coefficient/scale arithmetic and one half-away-from-zero rounding at
the result boundary, with an explicit money range check. No static-rate fallback.

The existing `AllocateProportionally` now aligns decimal weight coefficients and
uses BigInteger for sum/product/division, then checks the resulting money shares.
It keeps the first largest absolute weight as remainder owner. For a nonnegative
total and nonnegative weights, if rounded non-remainder shares exceed the total,
truncate those shares toward zero and give the exact remainder to that owner;
this matches the VAT allocator's existing positive-remainder safeguard. Signed
weight behavior otherwise retains the same algebra and zero-sum behavior. Do not
add a second allocation engine or repair an unbalanced journal inside posting.
Source checks and algebraic review do not prove runtime numeric acceptance.

**Read aggregates and currency-position arithmetic (2026-11-05).**
`SumCurrencyReadAmounts` uses aligned BigInteger coefficients to sum reporting
balances without the16-whole-digit limit of a single writable amount. It rejects
an unrepresentable decimal result instead of allowing implicit decimal rounding.
Use it only at read aggregation boundaries; `SumCurrencyAmounts` and input money
limits remain unchanged. Ledger adopts it for opening, movement and closing in
the base domain and each original-currency domain separately; no mixed-currency
total and no reconstruction of originals from a current/static rate.

The `FinancialNumberPolicy.Settlement` partial owns pure quantity/carrying-value
consumption, settlement, incremental revaluation and moving weighted bank-value
arithmetic under the approved currency feature contract. The last consumption
takes the exact stored remainder. Results distinguish historical value,
carrying value, additional gain/loss and reclassified unrealized amounts. They
do not select a rate, classify a source, store a contribution, authorize posting
or create a journal. A writer still needs dated effective events, currency and
account identities, individual revaluation contributions, common locking,
idempotence and atomic journal/source persistence. A net unrealized amount does
not replace contributions with opposite gains/losses or their actual accounts.
Keep foreign posting/allocation closed until those writer/reader contracts are
adopted together. Source review is separate from owner numeric/runtime acceptance.

`AllocateCurrencyDocumentTax` is the exact-money document VAT owner for adopted
currency contracts. It groups validated rounded amounts by the percentage rate,
taxes each group once with BigInteger sum/product/ratio and one rounding, then
delegates allocation to `AllocateProportionally`. Its result has the same line
order, first-largest remainder and positive-source safeguard. The rate remains a
settings-owned percentage (0–100, at most six effective fractional places), not
an amount or a client-authoritative rate. It rejects out-of-range money instead
of relying on decimal multiplication or ratio-first overflow fallbacks. Keep
legacy `VatPolicy` callers on their frozen adoption boundary; do not change their
storage or DTOs implicitly. UI19's exact text preview mirrors this owner.

**Owned generated draft currency (2026-11-04).** An adopted source writer uses
`SiGmaDbContext.EnsureEditableSourceJournalAsync` before changing a
tracked source when its saved unposted journal must change with it. Resolve
save-capable account lookups against a detached candidate first. Persist the
source's accepted dated snapshot under the currency lock, rebuild the original
document-currency lines, and use `SaveCurrencyDraftJVAsync` in the same outer
transaction. That helper rechecks ownership, state and allocation, inherits the
saved source evidence, and converts the base amounts exactly once. Never select
a newer quote for the generated journal, edit it through the manual journal
screen, or add a balancing amount. This route does not authorize foreign
posting/settlement; those remain separate financial adoption gates.
