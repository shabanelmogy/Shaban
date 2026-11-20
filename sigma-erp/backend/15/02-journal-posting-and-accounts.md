<!-- Part of backend block 15: see ../15-pattern-3-master-detail-with-financial-effect.md. Same status and authority as the block. -->

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
`POST LinkAccounts/auto-link/apply`) fills every empty slot with one rule:

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

**Every customer and supplier has its own sub-account.** Each
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
**Splitting a posting account**: Chart of Accounts > *Convert to
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
| **Bill approval** | Save retains a validated Bill draft without a journal; explicit Approve revalidates the saved snapshot then builds/posts through `SaveAndPostJVAsync` in the source transaction. The latest owner decision permits guarded UnApprove to an editable draft through source-owned unposting. Independent terminal Void marks the source and existing journal voided without a reversing entry. |

**Bills manual approval and settlement.** The owner explicitly moves
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

**Two allocation directions.** A
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
