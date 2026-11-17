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

**Existing-account-only partner resolution (2026-10-29).** When a frozen financial
contract forbids account creation, reuse `ILinkAccountLookup.GetPartnerAccountAsync`
through `JournalVoucherResolver`, with the optional `allowCreate: false` argument.
The default remains `true` for existing callers. The false path reads current
tenant-owned group/link/posting-account configuration and returns null when no
valid account exists; it never provisions a default group, account or link.
The scoped memo key includes both partner ID and creation policy, so an allowed
creation result cannot silently replace an existing-only decision. Resolve each
distinct recipient once inside the writer's current transaction and fail before
document mutation on a missing account. Pass the resolved ID through the existing
`customerAccountOverride` into both accounting readiness and posting, retaining
the accounting service's current eligibility checks. Do not create a second
resolver or cache this policy read in a frontend reference cache. The rental driver
split generator is the first explicit consumer; this does not change other
partners' account creation policy, period schedule, tax, allocations or receipts.
Source conformance is verified separately from owner runtime/accounting acceptance.

Allocation rules: every amount positive and within its target's outstanding
amount; the total within the source's available balance; customer, currency,
branch, document type and open status all match; already-allocated amounts
computed from persisted allocations. Never `continue` past an invalid target —
fail the operation.

**Delete, void and correction (owner correction, 2026-10-20).** An unposted
draft may be deleted with its lines (`RemoveWithChildrenAsync`, block 8). A
posted document is canceled through Void while retaining its number, rows and
audit history. **Void does not create a reversing journal.** This explicit
application-wide owner instruction supersedes the reversing-journal part of
decision J-1 (2026-10-01); older plans/decision sheets are historical on that
point. A separate credit/debit-note workflow keeps its own approved accounting
contract. `InvoiceService.RemoveAsync` still unposts/deletes posted invoices;
that remains a known backlog defect, not a reference for new work.

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
| **No approval step** — invoices (incl. Miscellaneous / Close Job and the tax-advance allocation), cheque events (PDC clear, bounce, mature), customer-deposit use/refund | `SaveAndPostJVAsync`: posted in the same save as the document |
| **Approval step** — receipts (incl. rental/lease/booking deposit receipts), credit and debit notes, cash deposits, card transaction bank transfers, manual JVs | `SaveJVAsync` saves a draft; the document's approval calls `PostAsync`, its un-approval `UnpostAsync` |
| **Bill approval (owner decision 2026-10-20, conditional UnApprove and terminal Void)** | Save retains a validated Bill draft without a journal; explicit Approve revalidates the saved snapshot then builds/posts through `SaveAndPostJVAsync` in the source transaction. The latest owner decision permits guarded UnApprove to an editable draft through source-owned unposting. Independent terminal Void marks the source and existing journal voided without a reversing entry. |

**Bills manual approval and settlement (2026-10-20).** The owner explicitly moves
posting from Save to Approve; this supersedes the earlier no-approval Bill row.
Bill owns a nullable manual approval status and append-only audited decisions,
separate from JV approval. New Bills start NotApproved; historical missing states
remain unknown, with no fabricated approval/backfill. Approved/posted Bills are
not edited directly. The latest owner decision restores conditional UnApprove:
only explicit Approved, nonvoided Bills with no allocations, payments, paid EMI
history or retained positive debit-note target history and an open original posting
year/month may return to NotApproved. Retain the source journal/FK/number/lines,
unpost through the resolver and append an audited NotApproved decision atomically
under the allocation-then-PurchaseRequest locks. Compute the canUnapprove flag
from the same eligibility contract, batching original period checks for lists;
revalidate on POST, including stored fiscal-year identity. Reapproval validates
and rebuilds/posts the retained unposted source journal. Unknown legacy approval
does not imply eligibility. An approved zero-total Bill without a JV uses its
Bill-date period; linked zero-total journal histories require review rather than
silently retaining obsolete journal amounts on reapproval. This explicitly
supersedes the earlier Bills-only ban on UnApprove; it changes no Void policy.
Retain the debit-note guard even when the note/detail is voided or soft-deleted:
its CounterPayable journal retains proportional credits derived from the old
Bill source, so allowing correction and later restoring that note could reuse
obsolete expense/tax lines. Do not silently rebuild or fingerprint that history.

Independent terminal Void records reason, cancellation date, UTC event time and
the authenticated actor, and retains approval history. It requires no active
allocations or paid installments, source-journal ownership and the original
posting period open. Mark Bill and existing JV voided together in one save;
retain IsPosted, number, lines and saved tax. No new JV, reversed lines,
cancellation allocation or source reset is created. This latest owner decision
supersedes the temporary reversal design recorded historically in the feature
contract. A zero-total approved Bill without a JV can cancel with an open
Bill-date period; linked zero-total JVs require review. An audited or canceled
Bill cannot be deleted; a canceled Bill cannot be edited, reapproved, unapproved
or newly allocated. A canceled Bill releases its GRN billing claim,
but does not void the GRN or move stock. Direct Bill target consumers must check
Bill.IsVoided as well as the linked JV state. The original canceled journal
remains available through the read-only source-owned Journal action.
Lifecycle and payable allocation share the allocation-then-PurchaseRequest tenant
lock order so allocation cannot race cancellation or receipt reservation changes. The
future Settings approval engine remains deferred; no Bill configuration tab.
Every offered source writer must share the allocation lock through its final
save, including unpost/void/replace and bulk paths; locking the new allocation
alone cannot protect against an unlocked source transition. DebitNoteService
closes this direct supplier-source gap while retaining its Serializable
multi-save boundary; bulk delegates to the same guarded domain cores.

Allocation eligibility follows posted supplier ledger capacity, not BillType or
the IsLoan flag: same tenant/supplier/account/effective branch and currency,
opposite posted nonvoided debit lines, unique positive precision-valid amounts
within source and target capacities, rechecked under the write lock. Null currency
on generated vouchers and an explicit base currency refer to the same unit.
Reuse effective paired ledger allocations; never route payable Bills through a
customer-credit chooser or invent a cash/interest entry. Legacy source-JV-only
reservations must not be offered twice; unsupported ambiguous Bill-as-source
headers fail closed for new allocations pending review. Open/Closed follows the
remaining effective payable balance; draft/missing ledger evidence stays unknown,
and approved zero-total Bills are Closed. Canceled Bills instead show Voided,
zero due and no settlement status; Open/Closed filters exclude them. Saved-tax
listings retain the historical values with a visible cancellation flag rather
than silently treating canceled rows as active. Installment scheduling alone proves no
payment, and allocation does not automatically set LoanEMI.Paid. Actual source:
BillService lifecycle/allocation partial, BillApprovalLog and existing allocation
query owner; contracts/evidence in reviews/BILLS_ACTIONS_CONTRACT_FREEZE.md. Source
conformance only; owner migration and transactional/runtime acceptance pending.

**Two allocation directions (owner screenshots/acceptance2026-10-20).** A
normal Bill payable credit consumes eligible supplier debit balances. A General
Bill can also contain a separately identified supplier debit: its Allocation
selects that actual posted line, then distributes its available balance across
the same supplier/account/branch/currency's open Bill credits. General type
alone proves no supplier debit; a free-text SubLookUp proves no partner identity.
Store the optional BillDetail.SupplierId explicitly, validate it against the
existing supplier control-account link without creating configuration on draft
Save, and stamp the net posted debit's PartnerId at approval. Preserve legacy
text/posted history; no guessed identities or backfill. The header supplier and
line supplier have independent ledger roles. Source availability uses the
posted net debit after discount, excluding separately posted tax; a source8000
cannot allocate8400 even if the target total is8400. Each source/target endpoint
uses the same effective-capacity owner and allocation lock as the opposite
direction. Legacy header-only reservations are distributed once per matching
supplier/account debit pool. Selection auto-skips only when one source has
available capacity; changing source/refreshing discards edited rows only after
confirmation. Persist paired allocations only, not a new journal/payment/EMI
change; zero target balance closes it, independent of source Bill settlement.

### Source-owned installment payments (2026-10-20)

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

### Source-owned loan down payments (owner2026-10-21)

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

### Audited loan schedule revisions (owner2026-10-21)

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

### Nonnegative allocation of positive VAT sources (2026-10-12)

`VatPolicy.AllocateDocumentTax` retains its existing rounded proportional shares
when their remainder is nonnegative. Many tiny positive lines can round those
shares above the entire rate tax: 100 lines of0.10 at5% give document tax0.50,
while99 individual0.005 shares round to0.99. The exceptional positive-source
case floors non-remainder shares with `FinancialNumberPolicy.FloorMoney` and
gives the exact remainder to the largest line. Every source tax stays
nonnegative and their sum remains the document's once-rounded tax. Negative or
mixed-sign inputs keep their existing behavior; document tax and normal
allocations are unchanged. Rental generation identified the defect; source
arithmetic review only, owner compilation/runtime verification pending.

Valid stored amounts may overflow the intermediate `rateTax * lineAmount`
even when the final proportional tax fits. The shared allocator preserves its
ordinary multiplication-first path and, only on decimal overflow, multiplies
the tax by `lineAmount / rateAmount` instead. The largest-line balance still
owns the exact document total. Consumers validate aggregate storage bounds
before allocating tax; they do not turn an oversized group into an exception.

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
its token is checked. A cancellation that reopens a balance (void or delete of a receipt of a
closed document) moves the document back to its previous open state in the same transaction;
un-voiding re-runs the add eligibility. Equal installments are rounded down to the money
decimals and the last takes the remainder, so no row is negative. Reference:
`SalesAgreementService`, `ReceiptService` (`LockSalesCollectionAsync`,
`ReopenClosedAgreementAsync`). Owner runtime verification of races pending.

### Quantity returns and independent financial credit (2026-10-25)

Keep physical source quantities and financial settlement as separate effects
when the frozen model requires both. Preserve exact receipt/bill/source-return
line FKs; a master source summary or label cannot prove capacity. Pending
documents reserve the capacity named by their contract; only approved nonvoid
documents contribute stock or posted financial effect. Use one proven query for
available stock, summary/detail reports, receiving gates and progress readers.
When approved returns reopen the same order, receiving and reversal guards must
agree: a replacement receipt can prevent undoing its enabling return.
Unbilled returned quantities reduce billable receipt capacity without creating a
supplier debt. Crediting billed quantities must not make their original receipt
billable again or deduct stock twice.

For exact original-line credits, snapshot the net amount actually posted after
document-discount allocation and the actual tax posting account in the original
posting builder. A detached validation model is not persisted: copy its resulting
snapshots onto the tracked owned lines in the same approval transaction. Do not
rederive an old discount allocation from another line order or current settings.
Old lines without posting proof stay unavailable for automatic credit; do not
invent a backfill. Partial credit slices reserve quantity and value together,
never exceed either original component, and the final quantity takes the rounded
net/tax remainder. Zero-value sources retain quantity proof without a fake journal.

Ordinary Payment follows its explicit source lifecycle: Save is Pending without
a journal; approval posts Dr the resolved partner control and Cr the configured
payment-method account for validated owned amount rows. Bill allocation remains
independent. Dedicated loan/payroll/down-payment writers remain source-owned;
their legacy nullable lifecycle is not inferred from generic status. Deferred
cheques keep their PDC maturity owner. Reject is terminal; reasoned UnApprove and
Void require valid owned unshared journals, no live allocation and the original
period open. Shared approval context and detail/list action flags use these
actual guards, with batched list eligibility instead of per-row queries. Block
unsupported bulk/activation paths from bypassing aggregate invariants; retain
approval history instead of deleting previously approved rows.

Evidence: `PURCHASE_RETURN_GOODS_CONTRACT_FREEZE.md`,
`PURCHASING_PAYMENT_LIFECYCLE_CONTRACT_FREEZE.md`, `PurchaseReturnService.Goods*`,
`BillService.ApproveCoreAsync`, `PaymentService.Approval/Read` and
`SupplierGoodsReturnQueryExtensions`. These model-specific effects are not a
universal financial writer. Source-only; owner migration/build/runtime and
race/rounding/period acceptance remain required.

**Check:** transaction opened before the first mutation and covers every
dependent save · rollback restores document, voucher, allocations and flags ·
debit equals credit · one-sided lines · allocation limits and ownership checked ·
state locks enforced · line references via `AllExistAsync` · VAT per rate rounded once ·
posted documents voided through retained source/JV flags without a reversing entry, never deleted (owner2026-10-20) · related flags recomputed from persisted facts · list,
detail, report and export use the same voided/posted/allocation rules · no
per-row query loop.

---

