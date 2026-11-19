## 15. Pattern 3 — Master-detail with financial effect

**Topic files of this block** (read only the one the task needs; they are part of this block):

- [Financial cancellation rule](15/01-financial-cancellation.md)
- [Sales journal direction, Link Accounts, journal posting policy](15/02-journal-posting-and-accounts.md)
- [Installment payments, loan down payments, loan schedule revisions](15/03-installments-and-loans.md)
- [VAT allocation, collection concurrency, quantity returns](15/04-vat-concurrency-returns.md)

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
