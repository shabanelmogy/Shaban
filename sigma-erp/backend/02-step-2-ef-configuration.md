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
- add an index for a column the list actually filters or sorts on, not
  speculatively.

**Check:** `ToTable(nameof(X))` · max lengths match the VM annotations · decimal
precision set · unique index includes `SubscriptionId` and is filtered to `[IsDeleted] = 0` on a soft-deletable
entity · child delete behaviour
explicit · migration required is **reported to the owner**, never generated.

**Schema impact (G2).** Every change in this step is a schema change: report it under Master
block 7 *Schema impact check*.

---
