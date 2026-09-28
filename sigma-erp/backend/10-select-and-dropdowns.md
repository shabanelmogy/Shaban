## 10. Select and dropdowns

> **Status: Transitional** — the base returns a failure for an empty list, see below

Every entity gets `GET /<Entity>/GetSelect` from the base controller, backed by
`SelectAsync`, which returns `DropdownDto`:

The base lookup is only a default. When the business meaning of "selectable" is
stricter than "row exists", override `SelectAsync` (or expose an explicit typed
lookup) and apply the same predicate used by the consuming write validator. A
posting-account picker, for example, must not return parent accounts when Save
requires `AllowChildren == false`. Do not fix this mismatch in Angular by
filtering labels client-side; the backend lookup is the source of selectable ids.

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

**Defect to know about.** The base treats an empty lookup as a failure:

```csharp
if (items == null || !items.Any())
    return new Results<DropdownDto>
    {
        IsSuccess = false,                                  // wrong
        Message = Localization.GetString(GeneralMessage.FailedToFound)
    };
```

An empty dropdown is a valid state — a tenant with no branches yet is not an
error. Because Angular guards on `if (response.isSuccess)`, the caller both fails
and shows an empty list, and a real failure becomes indistinguishable from
"nothing configured yet". For a new lookup, override and return
`IsSuccess = true` with an empty `Entities`. Backlog item 13.

**Check:** returns `DropdownDto`, not a custom shape · inactive rows excluded when
they must not be selectable · deterministic order · empty result is a success ·
no navigation graph loaded to build a label.

---

