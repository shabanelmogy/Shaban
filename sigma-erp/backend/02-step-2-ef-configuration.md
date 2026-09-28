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
- a uniqueness rule always includes `SubscriptionId`, so tenants cannot collide;
- child relationships declare delete behaviour explicitly:

```csharp
builder.HasMany(x => x.PurchaseOrderDetails)
       .WithOne(d => d.PurchaseOrder)
       .HasForeignKey(d => d.PurchaseOrderId)
       .OnDelete(DeleteBehavior.Cascade);
```

- add an index for a column the list actually filters or sorts on, not
  speculatively.

**Check:** `ToTable(nameof(X))` · max lengths match the VM annotations · decimal
precision set · unique index includes `SubscriptionId` · child delete behaviour
explicit · migration required is **reported to the owner**, never generated.

---

