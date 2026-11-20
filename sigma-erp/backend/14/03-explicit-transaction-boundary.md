<!-- Part of backend block 14: see ../14-pattern-2-master-detail-no-financial-effect.md. Same status and authority as the block. -->

### Explicit transaction boundary — Canonical

Decide from the number of `SaveChangesAsync` calls reachable on **one execution
path**, not from the number of save statements visible in the method. Do not
open an explicit transaction solely for atomicity when a path performs one save through one scoped
`DbContext`, including a tracked parent-and-children graph: EF Core's implicit
transaction makes that save atomic.

Use an explicit transaction only when one reachable business path performs
multiple saves that must succeed or fail together, spans multiple `DbContext`
instances or other independent persistence boundaries in one consistency
boundary, or interleaves other database work that makes partial persistence
invalid. Multiple repositories sharing one scoped `DbContext` and one save do
not by themselves require an explicit transaction. Open it before the first
mutation and include every dependent save. A conditional workflow may therefore
use an explicit transaction on its multi-save branch while its one-save branch
uses the implicit transaction.

**Check/save concurrency is a separate reason for isolation.** One-save atomicity does not
protect earlier duplicate/range reads. For declared `UniqueColumns`, base Add/Update use the
shared UnitOfWork application-lock boundary; Company and Individual import chunks use the
same entity/tenant resource and recheck live keys inside it (block 8). A navigation graph
alone does not require that boundary. Reusable default-group creation precedes it and all
aggregate mutation. Temporal-overlap checks retain their separate range-isolation rule in
block 8. Owner runtime verification covers races, timeout/deadlock outcomes and rollback.

Private helpers that call `SaveChangesAsync` do not start nested transactions
when every owning method already opens the transaction and the helper receives
the same scoped unit of work and `DbContext`. That transaction ownership is part
of the helper contract: a new caller without an owning transaction must add one
around the complete workflow or change the helper contract deliberately.

When a transaction is removed or retained during review, leave the applicable
short source comment at the decision point:

```csharp
// Removed: EF Core implicit transaction is sufficient.
// Kept: Multiple SaveChangesAsync() calls must be committed atomically.
```

Current source reconciliation:

| Source | Decision and evidence |
|---|---|
| `Services/Bases/Service.cs` — `UpdateAsync` | One save makes the graph atomic. When `UniqueColumns` exists, a shared explicit application-lock transaction also protects the earlier duplicate checks; otherwise the save uses EF Core's implicit transaction. Runtime verification remains required for collection add, update and remove cases. The comprehensive customer source review separately records defects in the legacy detached update's one-to-one ownership and saved-child mapping. |
| `Services/SeedDataService.cs` — `SeedSetting` | Insert and update saves are in mutually exclusive branches. One invocation reaches one save, so no explicit transaction is required. |
| `Services/VouchersServices/PurchaseOrderService.cs` — `ToggleBillStatusAsync` | The early not-approved path returns after its optional save; the approved path performs its separate save. No invocation reaches both saves, so no explicit transaction is required. |
| Private journal-voucher helpers | Remain transaction-free when their owning methods open the transaction before the first mutation and pass the same scoped unit of work and `DbContext`; they must not create a nested transaction. |
| `Services/VouchersServices/MiscellaneousInvoiceService.cs` — `AddAsync` | `AddAsync` always runs in one explicit transaction (re-verified 2026-10-01): it saves the invoice, builds the journal and, when the invoice produces journal lines, posts it and links it, then commits; a journal posting failure rolls everything back. The former separate invoice-only path no longer exists. Manually verify a successful save and a failing journal (nothing persisted). |

This reconciliation changes transaction ownership only. It does not by itself
change APIs, DTOs, mappings, calculations, entities, EF configuration or schema,
and therefore does not require a migration. Source-level transaction decisions
are complete when the table still matches current control flow; the named
runtime checks remain owner verification, not unresolved contract decisions.

---
