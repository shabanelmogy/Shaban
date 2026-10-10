## 15. Pattern 3 — Master-detail with financial effect

> **Status: Canonical** — reference `Services/VouchersServices/InvoiceService.cs`

Everything in pattern 2, plus any journal voucher, allocations and related flags
actually written by the execution path, goes inside **one explicit
transaction** when the path requires multiple saves. The document, its
accounting entries and its allocations are a single consistency boundary. If a
branch writes only the document in one save, use EF Core's implicit transaction
as defined in block 14.

```csharp
using var transaction = await UnitOfWork.Context.Database.BeginTransactionAsync();
try
{
    // 1. validate everything first — document types, all FKs, state locks
    // 2. write the document
    await UnitOfWork.SaveChangesAsync();

    // 3. build and write the journal voucher
    await UnitOfWork.SaveChangesAsync();

    // 4. write allocations and recompute related flags
    await UnitOfWork.SaveChangesAsync();

    await transaction.CommitAsync();
    return new Result { IsSuccess = true, Id = entity.Id };
}
catch (Exception ex)
{
    await transaction.RollbackAsync();
    // log ex internally; return a safe, localized business message (block 5)
    return BusinessFailure("InvoiceSaveFailed");
}
```

Begin the transaction **before the first mutation**, keep every dependent save
inside it, and roll back the document, voucher, allocations and flag changes
together.

Non-negotiables before any write:

- normalize the document number, then check duplicates;
- validate every header FK (`ExistsAsync`) and every line reference with `AllExistAsync` (block 8);
- calculate all totals on the server — VAT per tax rate on the document, rounded once (rule 8 below, D4-4);
- resolve linked accounts and the fiscal period;
- enforce document state locks — block Update and Delete when the voucher is
  posted or approved, or when allocations are active, per policy;
- validate **every** allocation target before creating any of them.

Journal voucher rules: debit equals credit; each line has a positive debit or a
positive credit, never both; account, partner, branch, fiscal year, date,
description and document link follow the existing resolver.

Allocation rules: every amount positive and within its target's outstanding
amount; the total within the source's available balance; customer, currency,
branch, document type and open status all match; already-allocated amounts
computed from persisted allocations. Never `continue` past an invalid target —
fail the operation.

**Delete, void and correction (owner decision J-1, 2026-10-01,
`reviews/JOURNAL_ENTRIES_DECISION_SHEET.md`).** An unposted draft may be deleted (with its
lines, `RemoveWithChildrenAsync`, block 8). A **posted** document is not deleted: a full
cancellation is a *void* that keeps the number and posts a reversing journal; a partial correction
is a credit note. Today `InvoiceService.RemoveAsync` still unposts and deletes a posted invoice in
an open period; the voucher plan (`reviews/VOUCHERS_JOURNALS_MAINTENANCE_EVOLUTION_PLAN.md`, slice V5) replaces it.
Never remove posted accounting history silently.

**Decided journal rules (owner, 2026-10-01; reference behaviour Speed Auto Systems).**

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

### Sales invoice journal direction

A customer invoice debits the customer (receivable) account with the total, credits
each revenue or charge account with its line amount, and credits the VAT
(`LinkAccountsGeneral.TaxCollected`) account with the tax, as `InvoiceService`
does. A credit note is the mirror. Resolve every account (customer, each charge
type, VAT) before the first save, and return a failure `Result` when one is
missing; never throw after the document is saved. Owner decision 2026-09-29:
`MiscellaneousInvoiceService` posted the reverse (debit charge accounts, credit
customer, tax folded into the charge line) and was corrected to this shape.
Existing vouchers were not rewritten. Workshop invoices raised by Close Job use it
with the charge types `WorkshopItems`, `WorkshopLabour`, `WorkshopMisc` and
`WorkshopExternalWork`, which must be linked under Link Accounts > Charges Type
(Miscellaneous) before use.

### Link Accounts completeness and account placement

A journal can be built only when every account it resolves is linked to a
**posting** account (`AllowChildren = false`, active). Link Accounts > *Complete
missing links* (`LinkAccountsAutoLinkService`, `GET LinkAccounts/auto-link/plan`,
`POST LinkAccounts/auto-link/apply`) fills every empty slot with one rule
(owner approval 2026-09-29):

1. **Seed default first.** `LinkAccountsDefaultCatalog` (shared with the seed)
   names the default code. When that code exists as a posting account of the
   category given by its first digit, link it — even when the seed maps a charge
   to an expense account.
2. **Otherwise create a posting account named after the slot**, under the seed
   default's parent code, or else under the group that fits the slot type, found
   by **name, then category and sub-group** — never by code, because codes differ
   between tenants: charges → *Operating Revenues* (Revenue); customers →
   *Customer Receivable* / *Accounts Receivable*; suppliers → *Accounts Payable
   (Current)*; staff and drivers → *Staff Payables (Current)*; payment methods →
   *Cash & Bank*; banks → *Banks* / *Bank Accounts* / *Cash & Bank*; workshop item
   types → *Inventory*. A same-name posting child under that parent is reused;
   otherwise a single same-name posting account anywhere in the same category is
   reused, and two or more such accounts make the slot Manual (ambiguous).
   The parent must allow children, be active, sit on level 2–4 and have no
   journal lines.
3. **Otherwise leave the slot Manual** with the reason.

Existing links and accounts are never changed. Accounts are created only through
`AccountService.AddAsync` (codes, levels, sub-group inheritance, validation), and
Apply rebuilds the plan on the server and runs in one explicit transaction
(several saves). PrepaidExpense rows are user-added lists, not slots.

**Every customer and supplier has its own sub-account (owner decision 2026-09-29).** Each
contact type has one default group (`ContactGroup.IsDefault`, unique per type): *General
Customer* / *General Supplier*. A customer or supplier saved without a group gets the
default one, and removing a default group is refused. *Complete missing links* first
makes sure both defaults exist (`IDefaultContactGroupProvider`: a group of the type already named
*General Customer* / *General Supplier* is adopted, otherwise it is created), then links them like any slot; *Set as default*
(`POST ContactGroup/{id}/SetDefault`) moves the default and the list shows it first with a
badge. When a journal resolves a partner,
`LinkAccountLookup` falls back to the default group, and a group whose slot is empty is
filled on the spot by `IContactGroupAccountService.EnsureGroupAccountAsync` →
`ILinkAccountsAutoLinkService.ApplySlotAsync` (the rule above, inside the document's
transaction): a posting account named after the group under *Customer Receivable* (or
*Accounts Payable*). Nothing posts to the main receivable/payable account, so the chart
can later be split by group without moving history. Found: Close Job invoice failed with
"No customer control account" for a customer without a group.
**Splitting a posting account** (owner decision 2026-09-29): Chart of Accounts > *Convert to
group account* (`POST Account/{id}/ConvertToGroup`, `AccountService.ConvertToGroupAsync`)
turns a posting account (level < 5) into a group and creates a named posting sub-account
that takes over every reference — journal lines, Link Accounts, opening balances, budgets,
provisions, bill and credit-note account lines, asset-type and loan accounts (asset account ids are unmapped) — in one
transaction, closed months included (the group total is unchanged); the move is logged.
Use it when a receivable/payable account that groups posted to must become their parent.

### Journal posting policy

The source document owns its journal; the journal never lives apart from it (owner
approval 2026-09-29). Every write goes through `JournalVoucherResolver`:

| Source | Journal |
|---|---|
| **No approval step** — invoices (incl. Miscellaneous / Close Job and the tax-advance allocation), bills, cheque events (PDC clear, bounce, mature), customer-deposit use/refund | `SaveAndPostJVAsync`: posted in the same save as the document |
| **Approval step** — receipts (incl. rental/lease/booking deposit receipts), credit and debit notes, cash deposits, card transaction bank transfers, manual JVs | `SaveJVAsync` saves a draft; the document's approval calls `PostAsync`, its un-approval `UnpostAsync` |

Rules:

1. **Generated vouchers are source-owned.** `NewJV` sets `IsGenerated`; the Journal
   Voucher screen refuses edit, delete, approve, unapprove and void for them (and the
   UI shows them read-only). Only manual JVs are managed there.
2. **Edit or delete of a posted no-approval document** calls `UnpostAsync` on its
   journal, then rebuilds and re-posts it (edit) or deletes it with the document
   (delete), in the document's transaction. A zero total removes the journal. Find
   the journal by the document's FK only, never by a line-description match.
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
   **Tax rate source (owner decisions 2026-09-29):** `ITaxPolicyService` (scoped, per
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
   **Sales vs purchase tax (owner decision 2026-09-29):** sales tax is ours to calculate;
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

Engine structure (`SiGma.Business/Resolver`): `JournalVoucherResolver` is the posting
engine (build, save, post, unpost, allocations) and keeps delegating members for
existing callers; lookups are `ILinkAccountLookup` (per-request partner cache, one
projection per partner), periods `IAccountingPeriodService`, numbers
`IJournalNumberGenerator` — all scoped and registered by the assembly scan. New code
injects the narrow interface it needs.

### Collection and lifecycle concurrency across services (Sales, 2026-10-04)

A document whose eligibility depends on rows written by other services (a sales agreement:
its units' sale state, its quotation's state, and the receipts collected against it) is
protected by **one** tenant lock, `UnitOfWork.ExecuteUniqueWriteAsync<TOwner>`, taken by
every participating writer: the owner's add/update/remove and lifecycle actions, and the
other service's writes whose rows (before or after the change) link to the owner. Every
eligibility check (state, outstanding balance, duplicate) is re-read inside the lock; a
writer that already owns a transaction opens it first and takes the lock inside it (the lock
then lives until that transaction ends, and never commits it). A multi-save action inside the
lock relies on the lock's transaction instead of opening its own. The state columns are also
EF concurrency tokens (no schema change), and a child-only edit marks the root modified so
its token is checked. A reversal that reopens a balance (void or delete of a receipt of a
closed document) moves the document back to its previous open state in the same transaction;
un-voiding re-runs the add eligibility. Equal installments are rounded down to the money
decimals and the last takes the remainder, so no row is negative. Reference:
`SalesAgreementService`, `ReceiptService` (`LockSalesCollectionAsync`,
`ReopenClosedAgreementAsync`). Owner runtime verification of races pending.

**Check:** transaction opened before the first mutation and covers every
dependent save · rollback restores document, voucher, allocations and flags ·
debit equals credit · one-sided lines · allocation limits and ownership checked ·
state locks enforced · line references via `AllExistAsync` · VAT per rate rounded once ·
posted documents voided or credited, never deleted (J-1) · related flags recomputed from persisted facts · list,
detail, report and export use the same voided/posted/allocation rules · no
per-row query loop.

---

