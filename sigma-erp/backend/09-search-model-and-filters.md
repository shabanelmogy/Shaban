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

**Three traps.**

**Filter keys are case-sensitive.** `ListSmBase.Filters` is a plain
`Dictionary<string, string>` with the default comparer, so `Filters[Search]` and
`Filters[search]` are different keys and the wrong casing is silently ignored —
no error, just an unfiltered list. Note `SpecificationRequestDto` *does* use
`StringComparer.OrdinalIgnoreCase`, so the two request types disagree. Match the
exact casing the Angular service sends. Backlog item 12.

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

**Check:** filter keys match the Angular casing exactly · every value read via
`FilterHelper`, never `filters["x"]` directly · strings trimmed · page number and
size clamped · filters applied before `CountAsync` · unknown filter keys ignored
rather than throwing.

---

