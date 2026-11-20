## 7. ListVM scope rule

> **Status: Canonical**

### Page action-state query budget
Apply Master5's general performance gate to the whole consumed request path,
not only action flags. Record a bounded query inventory: request/trigger,
source symbols, materialization/round-trip count, rows/columns/page scope,
serial dependencies and existing/candidate index evidence (BE2). Compare actual
SQL and timing only when authorized; source call counts alone cannot establish
the number of commands after EF query splitting, plan quality or elapsed time.

Project only needed data, apply server filters and count before bounded paging,
use deterministic ordering and no-tracking for pure reads, and inspect aggregate
correlated queries and avoidable Includes/materialization. Do not replace a
valid server query with a full in-memory load merely to reduce source call count.
Batch only semantically compatible work and preserve the transaction and data
contract. UI29 owns reproducible cold/warm before/after timing and owner checks;
Master5 owns handoff evidence. Full reports/exports need their own bounded work
and complete-output contract, rather than comparing their duration to one page.

**Screen detail and allocation reuse.** When a screen consumes a
small owned detail contract, replace a confirmed recursive graph read in that
screen's service with an explicit no-tracking DTO projection and finite owned
collection reads. Keep every consumed identity, address flag and historical
reference label, and enforce tenant/live scope on children; do not change the
generic repository for unrelated consumers. For repeated in-memory matching,
reuse keyed lookups while retaining original ordering, explicit-source authority
and first-match behavior where uniqueness is not guaranteed.

**Composed filtered Includes.** When extending a query helper that
already filters a collection Include, keep any repeated filter expression
identical across its ThenInclude branches, including lambda parameter names.
EF Core 10's ExpressionEqualityComparer compares those names; semantically equal
predicates with different parameter names can trigger
MultipleFilteredIncludesOnSameNavigation during query compilation. Preserve the
existing live-row predicate and graph; do not remove filtering to bypass it.
Evidence: Company detail GET500, owner stack in ProcessInclude, the conflicting
TrackedCompany/detail filters and upstream EF Core10 comparer/include source;
source correction only, owner runtime verification pending.

A feature allocation facade may delegate its partner/account constraints into
the existing shared writer's transaction before the writer acquires fresh open
sources. This removes redundant preflight materialization without passing a
preflight/cached capacity snapshot across the transaction boundary. Preserve
the writer's lifecycle, precision, partner/account, branch/currency, effective
reservation and capacity rechecks, existing unconstrained callers and failure
contracts. Evidence: Staff F5/F6/F8 frozen corrective handoff and source diff;
finite source query boundaries are not measured SQL/latency results.

**Child numbering settings reads.** `CodeCreateService` resolves the
existing entity-to-document-type mapping before reading document-number settings.
An unsupported child keeps its existing uppercase-name/ticks fallback without an
unused settings query. The same single resolver owns the counter mapping, avoiding
a second eligibility whitelist. Supported document types still read fresh settings
and retain manual mode, counter reservation, seeds and concurrency; JournalVoucher
retains its independent generator. This is query elimination for an unused policy,
not policy caching, changing internal child identities or replacing a real document
sequence. Evidence: Customers aggregate save-path audit and the scoped shared-owner
fix in `CUSTOMERS_MODULE_DOMAIN_API_CONTRACT_FREEZE`; actual SQL/timing pending.

Review round trips as well as projection size. Computing a menu flag must not
issue the same detail/reservation queries once per row when the rule can be
evaluated for the bounded page identities. Query page-scoped details once and
effective reservations once, then preserve the exact per-line rule in memory;
count an allocation once when both endpoints equal the same detail. Keep tenant,
soft-delete, historical-reference and ledger-effect guards and the authoritative
write-time recheck. Do not cache action eligibility to avoid the query.

Compatible scalar source-reference branches may compose Concat/Distinct into
one server query before materialization, preserving every producer and its
includeDeleted policy. A bounded empty page needs no enrichment. Do not replace
this with parallel EF operations on one DbContext or assume performance solely
from fewer source calls: SQL translation, plan and measured latency remain owner
verification under the current source-only boundary. Evidence: JVs source-only
performance slice in JVS_MAINTENANCE_EVOLUTION_PLAN and its reconciliation.

**A ListVM contains only the columns the frontend grid displays, plus the
identity and action-state fields the row needs.** Nothing added for exports,
dropdowns, or another screen.

Worked example. The Angular Branch grid displays:

```
id · name · branchCode · branchCode2 · trn · state · createdBy · createdAt
```

`BranchListVM` currently declares, on top of `ListBaseVmWithName`:

```csharp
BranchCode  ✅ displayed
BranchCode2 ✅ displayed
TRN         ✅ displayed
State       ✅ displayed
CCEmails    ❌ not displayed  → remove
Address     ❌ not displayed  → remove
```

So `CCEmails` and `Address` are over-scope: shipped on every row of every page
for no consumer. They belong to `BranchDetailVM` only.

Procedure when you build or review a list:

1. Open the Angular list component and write down every `field` of its
   `DataTableColumn<Row>[]` (block 5 of the UI book), plus fields used only by `status(row)`
   or `value(row)`. Older screens name them `colName` in `initColumns()`.
2. Add the row identity (`Id`) and anything a row action needs — a status flag a
   menu item tests, a foreign key an inline edit sends.
3. That is the ListVM. Everything else is removed.
4. Keep the query and mapper aligned: do not `Include` a navigation whose only
   purpose was a field you just removed.
5. A different consumer that genuinely needs a different shape gets its own
   contract — that is what `<Entity>FullListVm` is for.

If the frontend is not in scope, do **not** delete properties on assumption.
Record the decision as `FRONTEND_UNVERIFIED` and name the template you need.

**Also return a real total.** `Results<T>` carries `TotalPages` **and**
`TotalCount`. The base `GetManyAsync`/`GetManyWithNavigationsAsync` set both from
`CountAsync` over the same filter (2026-09-30). An override that builds its own query
must set both too — a total rebuilt from `TotalPages × PageSize` overstates the count on a
partial last page:

```csharp
var total = await baseQuery.CountAsync();
…
return new Results<BranchListVM>
{
    IsSuccess  = true,
    Entities   = items,
    PageNo     = pageNo,
    PageSize   = pageSize,
    TotalCount = total,                                        // required
    TotalPages = (int)Math.Ceiling(total / (double)pageSize),
};
```

**Check:** every ListVM property maps to a displayed column or a row action ·
`TotalCount` set from `CountAsync` · filters applied before `CountAsync` ·
deterministic `OrderBy` · `ProjectTo` after filtering · no navigation loaded for
a removed field.

### Action-candidate gate before expensive reads
For a pure list, detail or approval-context read, derive the action-candidate
gate from header facts already available for the record/bounded page before issuing expensive detail,
reservation or source queries. Reuse the authoritative helper for those facts;
do not recompute a header predicate through a second load. Rows that cannot
possibly expose the action must not trigger its enrichment query, while rows
that pass still receive the exact existing eligibility calculation and the
writer's authoritative recheck.

Compatible source-reference branches may use a server-side `Concat` union
only when every producer, include-deleted policy, tenant/history scope and
ambiguity survives. Preserve duplicate candidate multiplicity when uniqueness
determines source navigation; do not apply `Distinct` in that case. Unsupported
or null source kinds still count toward ambiguity, and a unique unsupported
candidate remains non-navigable; never infer a source from a number or type alone. Do not run parallel
EF operations on one `DbContext`. Fewer source calls are evidence of query shape
only, not measured SQL translation, plan quality or latency.

### Hidden per-row work in aggregate saves
Master5's performance gate also follows a batch write through its actual shared
save pipeline: number preparation, reference validation, audit and persistence.
A single service Save call can still issue one settings/reference query per
owned child. Inspect those owners before declaring a batched implementation
free of per-row reads; record the source call growth separately from measured
SQL commands and elapsed time. Preserve the existing number authority and
transaction/rollback contract. Internal child identifiers may inherit or derive
from their owning record only when their frozen contract gives them no separate
document sequence; never bypass a real document-number allocator to save queries.
Fix the scoped producer or existing shared owner, with no parallel EF operations
on one context and no new settings cache implied. Amortization's run and journal
children provide source evidence; runtime and SQL-plan acceptance remain pending.

---

