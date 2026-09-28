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
    // log ex internally; return a safe business message
    return Fail("The invoice could not be saved.");
}
```

Begin the transaction **before the first mutation**, keep every dependent save
inside it, and roll back the document, voucher, allocations and flag changes
together.

Non-negotiables before any write:

- normalize the document number, then check duplicates;
- calculate all totals on the server;
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

Delete follows the approved block/void/reverse policy. Do not remove posted
accounting history.

**Check:** transaction opened before the first mutation and covers every
dependent save · rollback restores document, voucher, allocations and flags ·
debit equals credit · one-sided lines · allocation limits and ownership checked ·
state locks enforced · related flags recomputed from persisted facts · list,
detail, report and export use the same voided/posted/allocation rules · no
per-row query loop.

---

