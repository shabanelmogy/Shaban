## 2. Step 2 — EF configuration

> **Status: Canonical**

One `IEntityTypeConfiguration<T>` per entity. Table name from `nameof`, explicit
max lengths, and a tenant-scoped unique index wherever duplicates would break a
business rule.

```csharp
namespace SiGma.DataAccess.Configuration;

public sealed class BranchConfig : IEntityTypeConfiguration<Branch>
{
    public void Configure(EntityTypeBuilder<Branch> builder)
    {
        builder.ToTable(nameof(Branch));

        builder.Property(x => x.BranchCode).HasMaxLength(50);
        builder.Property(x => x.BranchCode2).HasMaxLength(50);
        builder.Property(x => x.TRN).HasMaxLength(50);
        builder.Property(x => x.State).HasMaxLength(100);
        builder.Property(x => x.Address).HasMaxLength(500);
        builder.Property(x => x.CCEmails).HasMaxLength(500);

        // Name lives on EntityBaseWithName — configured here for max length
        builder.Property(x => x.Name).HasMaxLength(100);

        builder.HasIndex(x => new { x.SubscriptionId, x.Name }).IsUnique();
    }
}
```

Rules:

- every string gets `HasMaxLength`, and it must match the ViewModel's
  `[MaxLength]`;
- every decimal gets `HasPrecision(18, 2)` or the scale the business needs;
- a uniqueness rule always includes `SubscriptionId`, so tenants cannot collide, and on a
  soft-deletable entity it is filtered to active rows — `HasFilter("[IsDeleted] = 0")` — so a
  deleted name can be used again (the repository ignores deleted rows in the duplicate check,
  and an unfiltered index would reject the insert). Existing unfiltered indexes change when
  their entity is reviewed, with a migration the owner runs (decision D4-8);
- child relationships declare delete behaviour explicitly:

```csharp
builder.HasMany(x => x.PurchaseOrderDetails)
       .WithOne(d => d.PurchaseOrder)
       .HasForeignKey(d => d.PurchaseOrderId)
       .OnDelete(DeleteBehavior.Cascade);
```

- **delete behaviour does not delete children under soft delete.** Every delete is a soft
  delete (`SiGmaDbContext.HandleAudit` turns it into an update), so `OnDelete(Cascade)` never
  reaches the children. An aggregate that owns child rows removes them explicitly with the
  base `RemoveWithChildrenAsync` (block 8);
- evaluate indexes against the real query and existing indexes using the
  evidence gate below; an actual filter/sort alone does not require one index
  per column or authorize schema changes.

### Evidence-backed performance index proposals (owner2026-10-25)

For an expensive in-scope request, trace the physical EF table/mapping and
generated query shape before proposing an index. Inspect existing EF indexes,
keys/FKs and available schema/migration declarations read-only; deployed indexes,
statistics and actual plan are unknown unless authorized evidence supplies them.
Do not infer that no index exists from one configuration file.

Record proposals in the current review:

| Query/table and source evidence | Existing index coverage/overlap | Candidate key order, INCLUDE and filter | Expected read benefit and preserved semantics | Write/storage/maintenance cost | Verification and disposition |
|---|---|---|---|---|---|
| Actual predicates/joins/order/projected columns and mapped table | Verified declaration or deployed evidence; unknowns explicit | Exact ordered keys, sort direction, optional included columns and predicate; omit unused options | Seek/join/range/order/coverage hypothesis, tenant/live/history and uniqueness preserved | Insert/update/delete overhead, width/size and redundant-index risk | Proposed / source-declared / owner-applied evidence / not justified; SQL-plan and timing acceptance separate |

Choose composite key order from equality/join predicates, selectivity, range and
ordering needs of that query. SubscriptionId is relevant to tenant-scoped access;
do not add it or a low-cardinality IsDeleted flag in a fixed position by rote.
INCLUDE is for genuinely needed nonkey projection columns with an evidenced
coverage benefit, not the entire DTO or large text/blob payloads. Compare an
existing composite index's usable prefix before suggesting a duplicate.

A filtered index must cover the query's actual null/live/history semantics;
IsDeleted != true and IsDeleted = 0 are not interchangeable if nulls exist, and
includeDeleted reads cannot rely solely on an active-only filtered index. Honor
provider/mapping limits. A uniqueness change enforces a business invariant and
requires its own frozen contract; never add IsUnique as a performance shortcut.

Without actual plan/cardinality/IO evidence, label the benefit as a hypothesis
and give the owner's verification steps. An index proposal does not authorize
EF source changes, DROP/CREATE INDEX, migration creation/application or database
profiling. If explicitly authorized EF changes are implemented, report the schema
impact and suggested Add-Migration name under Master7; the workspace migration
boundary still applies. When queries are already adequately covered or data
does not justify an index, record that reason instead of inventing a proposal.

**Check:** `ToTable(nameof(X))` · max lengths match the VM annotations · decimal
precision set · unique index includes `SubscriptionId` and is filtered to `[IsDeleted] = 0` on a soft-deletable
entity · child delete behaviour
explicit · migration required is **reported to the owner**, never generated.

**Schema impact (G2).** Every implemented EF-configuration change in this step
is a schema change: report it under Master block 7 *Schema impact check*. An
unimplemented index recommendation remains a proposal and is labelled as such;
it is not an applied schema change.

---
