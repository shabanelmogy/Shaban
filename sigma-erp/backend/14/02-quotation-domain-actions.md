<!-- Part of backend block 14: see ../14-pattern-2-master-detail-no-financial-effect.md. Same status and authority as the block. -->

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
full-snapshot collections (D4-3) · one save, or a transaction when there are
several.
