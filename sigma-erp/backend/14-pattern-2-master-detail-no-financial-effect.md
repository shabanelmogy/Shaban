## 14. Pattern 2 — Master-detail, no financial effect

> **Status: Transitional** — reference `Services/VouchersServices/PurchaseOrderService.cs`; its FK validation has a defect, see below

A header plus detail rows, saved as one graph. No journal voucher, no
allocation.

**Order of work in Add and Update:**

1. require the business minimum number of details;
2. validate every header FK;
3. validate every **distinct** detail FK;
4. load the header with its details, tracked;
5. map, recalculate, save once.

```csharp
if (vm.PurchaseOrderDetails?.Any() != true)
    return Fail("At least one purchase order detail is required");

if (!await UnitOfWork.Repository.ExistsAsync<Supplier>(x => x.Id == vm.SupplierId))
    return Fail("Invalid Supplier");

if (!await UnitOfWork.Repository.ExistsAsync<Branch>(x => x.Id == vm.BranchId))
    return Fail("Invalid Branch");

if (vm.JobId.HasValue &&
    !await UnitOfWork.Repository.ExistsAsync<Job>(x => x.Id == vm.JobId))
    return Fail("Invalid Job");
```

Load the aggregate with its children **tracked**, so EF can reconcile:

```csharp
var entity = await UnitOfWork.Repository.Query<PurchaseOrder>(
        e => e.Id == vm.Id, null, true, false, e => e.PurchaseOrderDetails)
    .FirstOrDefaultAsync();

if (entity is null) return Fail("PurchaseOrder not found");

Mapper.Map(vm, entity);

foreach (var detail in entity.PurchaseOrderDetails)
    detail.Recalculate();               // totals are the domain's job

UnitOfWork.Repository.Update(entity);
await UnitOfWork.SaveChangesAsync();
```

**Totals are recalculated on the server.** Never persist a total the client sent.

**Defect to avoid — `Any` is not proof that all ids are valid.** The reference
does this:

```csharp
// WRONG: true when *one* of the requested ids exists
var validItemsExist = await UnitOfWork.Repository.ExistsAsync<Item>(x => itemIds.Contains(x.Id));
if (!validItemsExist) return Fail("Invalid Item references");
```

An unknown id passes as long as one sibling is real. Compare counts instead:

```csharp
var foundCount = await UnitOfWork.Repository.Query<Item>()
    .Where(x => itemIds.Contains(x.Id))
    .Select(x => x.Id)
    .Distinct()
    .CountAsync();

if (foundCount != itemIds.Count) return Fail("Invalid Item references");
```

Backlog item 3.

Also decide and document, per feature:

- omitted vs empty detail collection — preserve, clear, or reject;
- whether a detail id from the client is verified to belong to **this** parent
  and tenant before it is updated or removed;
- status transitions as explicit methods with legal source/target checks, as
  `ToggleApprovalStatusAsync` and `ToggleBillStatusAsync` do.

### Quotation domain-action specialization — Canonical

`SiGma.Business/Services/SalesQuotationService.cs` plus its interface and
controller are the complete reference for a quotation action lifecycle. A
quotation type may expose fewer transitions. Do not copy every Sales action;
freeze the feature's own state, payload, dependency, route, and target-state
contract first.

Keep the generic service and controller bases. Override only the CRUD/read
methods that require feature-specific validation, aggregate-child
reconciliation, deletion dependencies, or projection. Do not override a method
merely to call another override or delegate to `base`. Add explicit service
interface and controller methods only for confirmed domain transitions.

#### Mandatory action inventory and override audit

Read the approved reference completely before implementation: interface,
service, controller, request DTOs, ListVM/action state, and owning Angular action
service/menu. Record every public reference action even when the target will not
support it.

| Reference action | Target decision | Exact source -> target state | Payload/dependency evidence |
|---|---|---|---|
| | Supported / Not Applicable / Missing / Conflicting | | |

No row may disappear between discovery and implementation. `Not Applicable`
requires a concrete domain reason. For example, a Sales down-payment receipt is
not applicable to a quotation without down-payment and receipt aggregates.

Audit inherited methods separately:

| Virtual method | Override? | Required feature-specific behavior |
|---|---|---|
| `AddAsync` | Yes / No | Business validation or aggregate construction only |
| `UpdateAsync` | Yes / No | State lock or aggregate-child reconciliation only |
| `RemoveAsync` | Yes / No | Dependency/state-aware deletion only |
| `DetailAsync` / `DetailWithNavigationsAsync` | Yes / No independently | A distinct consumed projection, never delegation for symmetry |
| `GetManyAsync` / `GetManyWithNavigationsAsync` | Yes / No independently | A distinct filter/projection contract, never delegation for symmetry |

If the third column is empty, inherit the base implementation. An override that
only calls `base`, forwards to another override, or exists because the reference
has one must be removed. Run a scoped `override` search again during Phase 6 and
reconcile it with this table.

Every supported quotation transition must:

1. reload the current quotation inside the request boundary;
2. validate the legal source state and every readiness/dependency invariant;
3. validate a reason/note/date payload only when that field is part of the
   confirmed request contract;
4. mutate only server-owned workflow fields;
5. persist once through the scoped `DbContext` (`SaveChangesAsync` for a
   tracked mutation, or one conditional `ExecuteUpdateAsync` when atomic
   source-state matching is required) unless the documented workflow has a real
   multi-save or multi-boundary transaction requirement;
6. return the standard `Result`, with an actionable failure for invalid state,
   stale UI, missing dependency, or blocked reversal.

For state stored on more than one field, every predicate and mutation must name
the full source and target tuples. Example: `Approved/Pending ->
Approved/Approved`, not merely "set CustomerApproval to Approved". The ListVM
flag and the service predicate must describe the same tuple.

Choose and record a concurrency strategy for both the state row and its
dependencies. A conditional update can atomically match the source state, but a
separate `Any`/`Exists` dependency check is not automatically atomic with that
update. Use an applicable transaction/isolation or database invariant when the
dependency may be created concurrently, or report the residual race explicitly;
do not claim the action is concurrency-safe merely because each query is valid.

The common action shapes are internal approve/reject, customer approve/reject,
revise, unapprove, and creation of a downstream agreement or receipt. Their
names do not standardize their implementation: existing quotation families use
different HTTP verbs, routes, reason payloads, revision semantics, and dependent
record checks. Preserve the owning feature's real contract; never manufacture a
shared route or silently map CustomerRejected to Revised.

The complete Sales reference freezes these cases:

| Sales reference action | Legal transition | Extra contract |
|---|---|---|
| Internally approve | Pending to InternallyApproved | Revalidate quotation readiness |
| Internally reject | Pending to InternallyRejected | Required trimmed reason, 5..500 characters |
| Customer approve | InternallyApproved to CustomerApproved | Server-owned state only |
| Customer reject | InternallyApproved to CustomerRejected | Required trimmed reason, 5..500 characters |
| Revise | InternallyApproved to Pending | Clear rejection reason; revision copy/numbering is separate unless explicitly implemented |
| Unapprove | CustomerApproved to InternallyApproved | Block when a dependent agreement or receipt exists |
| Generate down-payment receipt | CustomerApproved remains CustomerApproved | Requires a positive down payment and no existing receipt; this is Sales-specific, not a generic quotation action |

For a quotation with split internal/customer fields, preserve the same logical
cycle by validating both source fields and changing only the fields named by the
frozen contract. For example, internal approval can leave customer approval
Pending, customer approval can leave internal approval Approved, Revise can
return both fields to the editable Pending combination, and Unapprove can revert
only customer approval after dependency checks. Do not add the Sales receipt
action to a quotation that has no down-payment and receipt domain.

When list visibility depends on multiple approval axes or dependency checks,
project the minimum explicit `Can*` booleans required by the Angular action
menu. A single-status quotation may expose its public status enum instead. In
both shapes the backend transition method repeats the complete validation; a
`Can*` flag is presentation state, not authorization or concurrency control.

**Quotation check:** inherited ordinary operations retained · only necessary
overrides · one interface/controller/service method per supported transition ·
exact verb/route/payload frozen · legal source and target states documented ·
reversal dependency checks · server-owned state only · standard Result · ListVM
contains only displayed values plus minimum action state · every reference
action classified · every override justified · dependency concurrency decision
recorded.

**Check:** minimum detail count enforced · header and distinct detail FKs
validated by count, not `Any` · aggregate loaded tracked with children · child
ids proven to belong to this parent and tenant · totals recalculated server-side ·
omitted/empty semantics documented · one save, or a transaction when there are
several.

### Explicit transaction boundary — Canonical

Decide from the number of `SaveChangesAsync` calls reachable on **one execution
path**, not from the number of save statements visible in the method. Do not
open an explicit transaction when a path performs one save through one scoped
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
| `Services/Bases/Service.cs` — `UpdateAsync` | Reconciles the parent and its collections before one `SaveChangesAsync`; the complete graph uses EF Core's implicit transaction. Runtime verification remains required for representative collection add, update and remove cases because this is a generic service. |
| `Services/SeedDataService.cs` — `SeedSetting` | Insert and update saves are in mutually exclusive branches. One invocation reaches one save, so no explicit transaction is required. |
| `Services/VouchersServices/PurchaseOrderService.cs` — `ToggleBillStatusAsync` | The early not-approved path returns after its optional save; the approved path performs its separate save. No invocation reaches both saves, so no explicit transaction is required. |
| Private journal-voucher helpers | Remain transaction-free when their owning methods open the transaction before the first mutation and pass the same scoped unit of work and `DbContext`; they must not create a nested transaction. |
| `Services/VouchersServices/MiscellaneousInvoiceService.cs` — `AddAsync` | The branch that saves the invoice and a journal voucher keeps an explicit transaction; the invoice-only branch performs one save and uses EF Core's implicit transaction. Manually verify successful and failing execution of both branches. |

This reconciliation changes transaction ownership only. It does not by itself
change APIs, DTOs, mappings, calculations, entities, EF configuration or schema,
and therefore does not require a migration. Source-level transaction decisions
are complete when the table still matches current control flow; the named
runtime checks remain owner verification, not unresolved contract decisions.

---

