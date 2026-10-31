## 10. Select and dropdowns

> **Status: Canonical**

Every entity gets `GET /<Entity>/GetSelect` from the base controller, backed by
`SelectAsync`, which returns `DropdownDto`:

The base lookup is only a default. When the business meaning of "selectable" is
stricter than "row exists", override `SelectAsync` (or expose an explicit typed
lookup) and apply the same predicate used by the consuming write validator. A
posting-account picker, for example, must not return parent accounts when Save
requires `AllowChildren == false`. Do not fix this mismatch in Angular by
filtering labels client-side; the backend lookup is the source of selectable ids.

**Classification is not posting eligibility (2026-10-23).** A grouping record can
carry classification metadata without becoming selectable for operational writes.
Keep display-only grouping roles out of posting lookups, including generic lookup
wrappers, and mirror the predicate in consuming write validation. A deliberate
read-only lookup opt-in may expose those roles for existing-record display; it
must not widen child creation or Save eligibility. Removing the last child does
not itself authorize a posting transition or erase the parent's classification.
Evidence: AccountSelectionPolicy Apply/IsAllowed, AccountService SelectAsync and
fixed-root Account type display; source-only, owner execution pending.

```csharp
public class DropdownDto
{
    public int Id { get; set; }
    public string? Value { get; set; }
    public string? No { get; set; }
}
```

This matches the Angular `DropDownSelect { id, value, no? }` exactly, which is why
templates bind `optionLabel="value"` and `optionValue="id"`. Do not invent a
different lookup shape.

**Persisted bilingual labels (2026-10-23).** When a consumed lookup needs both
stored names for live language switching, keep the `Id`/`Value`/`No` contract
and use a minimal typed `DropdownDto` extension with `NameLocalized`. `Value`
is the stored base name, not a translation key or a name localized into a
single request language. The Angular shared dropdown model accepts this optional
metadata; UI20 owns report-option selection. Numeric semantic filter keys can
remain stable while names are loaded from tenant settings. Do not cast a
string-converted EF enum to an integer in SQL projection: materialize the small
lookup's key/name fields first, then map its numeric identity in memory.
Evidence: `AccountReportGroupOptionVM`, GroupDefinition `GetReportOptionsAsync`,
Budget/BudgetVariance; source-only, owner runtime verification pending.

The base implementation is usually enough:

```csharp
public virtual async Task<Results<DropdownDto>> SelectAsync()
{
    var items = await UnitOfWork.Repository.GetDropdownAsync<TEntity>();
    …
}
```

Override when the label is not the default, or when only some rows are
selectable:

```csharp
public override async Task<Results<DropdownDto>> SelectAsync()
{
    var items = await UnitOfWork.Repository.GetDropdownAsync<Vehicle>(
        predicate:    x => x.IsActive == true,
        nameSelector: x => x.PlateNo!,
        noSelector:   x => x.No!,
        orderBy:      x => x.PlateNo!,
        isAscendingOrder: true);

    return new Results<DropdownDto> { IsSuccess = true, Entities = items.ToList() };
}
```

**An empty lookup is a success.** The base returns `IsSuccess = true` with an empty
`Entities` (re-verified 2026-09-30): a tenant with no branches yet is not an error, and a real
failure stays distinguishable. An override must keep that behaviour.

**Check:** returns `DropdownDto`, not a custom shape · inactive rows excluded when
they must not be selectable · deterministic order · empty result is a success ·
no navigation graph loaded to build a label.

---

