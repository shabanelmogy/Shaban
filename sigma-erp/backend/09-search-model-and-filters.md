## 9. Search model and filters

> **Status: Canonical**

Every list endpoint receives `ListSmBase` from the query string:

```csharp
public class ListSmBase
{
    public int? PageNo { get; set; }
    public int? PageSize { get; set; }
    public Dictionary<string, string>? Filters { get; set; }
}
```

That is the other half of the Angular `Filters[key]=value` convention. Read values
through `FilterHelper` (`SiGma.Helpers/Filters/FilterHelper.cs`) so a malformed value
becomes "absent" instead of silently changing the query:

| Helper | Behaviour |
|---|---|
| `GetInt(filters, key)` | `null` unless it parses as `int` |
| `GetDecimal(filters, key)` | invariant culture, `NumberStyles.Any` |
| `GetBool(filters, key)` | `null` unless it parses as `bool` |
| `GetString(filters, key)` | `null` when missing or whitespace |
| `GetDate(filters, key)` | exact formats only: `yyyy-MM-dd`, `dd/MM/yyyy`, `MM/dd/yyyy`, `yyyy/MM/dd` |
| `GetMonthStart(filters, key)` | parses `yyyy-MM` and friends, returns the first of that month |

```csharp
var pageNo   = searchModel.PageNo ?? 1;
var pageSize = Math.Clamp(searchModel.PageSize ?? 10, 1, 100);
var filters  = searchModel.Filters ?? [];

if (FilterHelper.GetInt(filters, "branchId") is { } branchId)
    query = query.Where(x => x.BranchId == branchId);

if (FilterHelper.GetString(filters, "search") is { } search)
    query = query.Where(x => x.Name.Contains(search));

if (FilterHelper.GetBool(filters, "isInactive") is { } isInactive)
    query = query.Where(x => x.IsActive != isInactive);
```

**Filter keys are case-insensitive** (2026-09-30): `Filters[Search]` and
`Filters[search]` are one key. Keep the documented casing anyway; a key repeated
with different casing keeps the last value.

**Preserve query-bound dictionary identity (2026-10-10).** A `Filters[key]`
request property must retain the dictionary instance MVC binds and validates.
Prefer the initialized auto-property already used by `SpecificationRequestDto`:

```csharp
public Dictionary<string, string> Filters { get; set; } = new(StringComparer.OrdinalIgnoreCase);
```

Do not replace that instance with a defensive copy inside its setter.
ASP.NET Core's [DictionaryModelBinder](https://github.com/dotnet/aspnetcore/blob/v10.0.0/src/Mvc/Mvc.Core/src/ModelBinding/Binders/DictionaryModelBinder.cs)
registers the bracket-key validation strategy against that object;
[ValidationVisitor](https://github.com/dotnet/aspnetcore/blob/v10.0.0/src/Mvc/Mvc.Core/src/ModelBinding/Validation/ValidationVisitor.cs)
retrieves the strategy by object identity. Replacing it can leave the original
query entries unvalidated and trigger automatic400 with an empty errors object.
Normalize a private service snapshot **after** model binding/validation when the
consumer needs guaranteed case-insensitive reads, using an OrdinalIgnoreCase
dictionary and assignment per pair so duplicate-casing keys retain last-value
semantics. Do not suppress model validation or mark raw query dictionaries
ValidateNever to hide this failure.

Source evidence: DriverTimeSheetReportFilterVM preserves the bound instance;
DriverTimeSheetReportService.GetReportAsync creates the normalized snapshot.
The owner supplied a valid date query rejected before the action with400 and
empty errors. This is a source-supported correction; owner request replay/build
acceptance remains pending. ListSmBase now retains the initialized bound instance
after the2026-10-13 Invoice load review; nullable filter and paging signatures
remain unchanged, and InvoiceService normalizes its private snapshot after binding.
The owner's active failure still needs its HTTP status/response; the source fix
does not establish request replay acceptance. PayrollsReportFilterVM's copying
setter remains historical behavior for its own scoped follow-up. This replaces the earlier
claim that SpecificationRequestDto used the same copying setter: it already
uses the initialized auto-property above.

**Two traps.**

**`GetString` does not trim.** It rejects whitespace-only values but returns
` " abc " ` unchanged, so trim before comparing or searching:

```csharp
var search = FilterHelper.GetString(filters, "search")?.Trim();
if (!string.IsNullOrEmpty(search))
    query = query.Where(x => x.Name.Contains(search));
```

**Bound the page size.** `PageSize` is client-supplied and unbounded. A request for
`pageSize=100000` will attempt it. The Sigma default is **10**, clamped to
**1–100** (owner decision, 2026-09-28):

```csharp
var pageSize = Math.Clamp(searchModel.PageSize ?? 10, 1, 100);
var pageNo   = Math.Max(searchModel.PageNo ?? 1, 1);
```

The base list methods apply this through `NormalizePaging(searchModel)` whenever the
request carries paging. A request with neither `PageNo` nor `PageSize` stays unpaged,
because existing "load all" callers rely on it; a new caller that needs every row pages
through `TotalPages` instead (UI block 8). An override calls `NormalizePaging` too.

**Check:** filter keys use the documented casing (binding is case-insensitive) · every value read via
`FilterHelper`, never `filters["x"]` directly · strings trimmed · page number and
size clamped · filters applied before `CountAsync` · unknown filter keys ignored
rather than throwing.

---

