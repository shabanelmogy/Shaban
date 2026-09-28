## 1. Step 1 — Entity

> **Status: Canonical**

Pick a base, then add only the feature columns. The base supplies identity,
tenant, audit and soft-delete, so never redeclare them.

```csharp
namespace SiGma.Helpers.Models;

public class Branch : EntityBaseWithName
{
    public string? BranchCode { get; set; }
    public string? BranchCode2 { get; set; }
    public string? TRN { get; set; }
    public string? State { get; set; }
    public string? CCEmails { get; set; }
    public string? Address { get; set; }
}
```

`EntityBase` already gives you:

```csharp
[Key] public int Id { get; set; }
public int SubscriptionId { get; set; }
public string? No { get; set; }
public bool? IsDeleted { get; set; } = false;
public Guid GUID { get; set; } = Guid.NewGuid();
public bool? IsActive { get; set; } = true;
public bool? IsValid { get; set; } = true;
public bool? IsChanged { get; set; } = true;
public DateTime? DeletedAt { get; set; }
[MaxLength(50)] public string? DeletedBy { get; set; }
public DateTime? CreatedAt { get; set; } = DateTime.Now;
[Required][MaxLength(50)] public string? CreatedBy { get; set; } = default!;
```

Available bases in `SiGma.Helpers/EntityBases/`:

| Base | Adds | Use for |
|---|---|---|
| `EntityBase` | — | An entity with no natural name |
| `EntityBaseWithName` | `Name` | Most lookups and masters |
| `EntityBaseWithDescription` | `Description` | Entities described rather than named |
| `EntityBaseWithNameWithNameLocalize` | `Name` + localized name | Names shown in both languages |
| `EntityBaseWithoutSubscription` | no `SubscriptionId` | Global reference data shared by all tenants |
| `EntityBaseWithNameWithoutSubscription` | `Name`, no tenant | Named global reference data |
| `InvoiceBase` | invoice header fields | Pattern 3 documents |

**Check:** correct base chosen · no redeclared `Id`/`SubscriptionId`/audit
columns · nullable reference types match what the business allows · child
collection declared as `ICollection<TChild>` for patterns 2 and 3 · calculated
values are real properties when a list, report or filter needs them, not
`[NotMapped]`.

### Derived aggregate totals

When an aggregate persists a total derived from its child rows, the aggregate
owns the calculation. Keep the persisted property non-client-settable (normally
`private set`) and expose a named domain method such as `RecalculateTotals()`.
The service calls that method only after mapping and reconciling the authoritative
children; it must not duplicate the formula with a VM `Sum(...)` expression.

When a feature needs a deliberately explicit total from a documented feature
calculation, expose a named aggregate method for that boundary (for example,
`SetTotalChargesExplicit(...)`) instead of reopening the setter. Likewise,
state flags such as closed or invoiced are changed through named domain methods
(`Close()`, `MarkInvoiced()`, and their documented inverse where required), not
through public setters. These methods preserve existing service-owned workflow
ordering and do not replace feature validation.

The client does not own a derived total. Remove it from Add/Update VMs when
consumers have migrated. If a legacy client still sends the field temporarily,
document the compatibility window and explicitly ignore it in the write map.
Preserve the established formula unless a separate business decision changes
discount, tax, rounding, selection, or rate rules.

For the current `Agreement` aggregate, the temporary tax decision is explicit:
`subtotal` is the sum of active booking and additional charges, `taxableAmount`
is `max(subtotal - Discount, 0)`, and `TotalCharges` is
`taxableAmount + (taxableAmount * effectiveTaxPercent / 100)`. Until the common
settings value is wired into the aggregate workflow, a missing tax percentage
uses `Agreement.DefaultTaxPercent` (`5%`). The domain validates tax percentages
between `0` and `100` and rejects negative discounts. When the settings source
is introduced, the service should pass that value into the same domain boundary;
the formula and client-owned-total rule must remain unchanged.

---

