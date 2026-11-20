## 9. Search model and filters

> **Status: Canonical**

### Authorization boundary for list inputs

For a protected list, reconcile three server-side allow-lists: direct filter
keys, advanced grid fields and sort fields. Use typed values and explicit
server-owned aliases. Reject unsupported inputs before applying them to a query.
A lookup grant authorizes the documented selector and its approved fields. A
client-supplied entity member or navigation path needs its own reviewed field
mapping before it can influence results.

Apply the same authorized field and record scope before row selection, count,
aggregates, ordering and paging. Export uses that scoped query contract and the
applied filter snapshot. Review the endpoint for a user with the minimum list
and selector grants, including requests carrying an unsupported field or alias.
The response projection controls which values are returned. Filters and sort
also control what a caller can infer from result membership, totals and order.

For a filter on a reference ID, use the same live, authorized related records
as the label and sort, where the contract limits the reference to visible
records. A raw foreign-key predicate can still affect membership or totals for
a hidden or deleted reference. Verify the filter, count and sort with that
reference unavailable. For a paged endpoint, check omitted and partial
paging inputs against the documented defaults and maximum, including inherited
service behavior. All-page report or export reads still use the scoped and
bounded page contract.

When adopting a custom endpoint, inventory the inherited reads on its
controller and other controllers that expose the same records. Record each
actual grant and projection, including generic list, detail, navigation and
export paths. The custom endpoint's allow-list covers only that endpoint.
Assign each approved direct key to one predicate owner. When reusing the generic
predicate, pass the normalized value. When a typed feature predicate owns the
key, keep it out of generic property reflection. Check the composed query for
duplicate conditions and align the live-row predicate with the detail and
lookup contracts. Cover padded text and nullable live-state flags where the
schema permits them. Verify projected grid keys and sort fields independently
before count, paging and export.

### Company-wide exclusion reads and branch filters
EF Core's `IgnoreQueryFilters` in a composed subquery can suppress the global
filters of its outer query and joined selectors. `QueryReport` retains explicit
tenant and live-row predicates, while branch authorization relies on its global
filters. Trace the complete published query, including count, totals and options.
For a company-wide structural exclusion, execute its bounded tenant-owned ID read
separately, then apply the materialized exclusion IDs to the normally filtered
report query. An existing explicit scope-preservation owner can also retain its
documented boundary. Check related labels and selector results as well as parents.
Use the existing branch owner and record the extra query/data-volume cost.
Evidence is the purchase-request preservation contract in
`SiGmaDbContext.BranchAccess` and the collection report source reconciliation.
Behavioral and SQL Server acceptance remain separate from source review.

For report fields requiring the latest actual agreement return, reuse
`AgreementReturnReportQueries.LatestIdsAsync` with already authorized bounded
agreement candidates. It completes the explicit tenant/live identity probe before
the caller reads `CollectionMovement` through normal `QueryReport` scope. Order
by `DateAndTime`, then `Id`; do not select the latest visible/in-period return
as though it were the latest actual event. The feature decides whether an
unreadable latest event excludes a row or leaves its returned-date field blank.
Daily Business retains its final-return membership rule; Sale Report retains
invoice revenue and redacts an unavailable return date. Neither invents an end
date from the expected return. Source/build verification remains distinct from
SQL Server and browser acceptance. (Source 2026-11-18.)

### Shared advanced column rules
Reserve `Filters[grid]` for the shared JSON `{ columns: [{ field, operator,
rules: [{ matchMode, value }] }] }`. Existing feature keys and predicates remain.
Columns combine with AND; a column combines at most five rules with `and`/`or`.
The shared `GridFilter` rejects malformed JSON, unknown fields/operators, invalid
typed values, more than64 columns, over16KiB text or over4096 characters per value
with localized validation400. Zero/false are real values; null is distinct. Text
supports contains/notContains/startsWith/endsWith/equals/notEquals; numbers support
equals/notEquals/lt/lte/gt/gte; dates use calendar `yyyy-MM-dd` with
dateIs/dateIsNot/dateBefore/dateAfter. Enum/bool equality uses stable typed values,
never SQL comparisons to translated labels. Database collation retains string
comparison ownership; do not promise JavaScript collation as SQL behavior.

**Exact monetary filter opt-in.** `GridFilter.Apply` accepts the
optional named `exactMoneyFields` dictionary of server field names and maximum
scales0–6. Only matching decimal projections adopt strict JSON string values
through `FinancialNumberPolicy.TryParseCurrencyAmount`; the same six numeric
operators remain parameterized decimal comparisons before count/page. Reject
JSON numbers, exponent/grouping/whitespace/plus/excess scale for opted-in fields;
do not silently omit a malformed rule. Null keeps its existing explicit equality
semantics. Other scalar/decimal fields retain their existing numeric contract.
The client must retain raw monetary text in UI6's serializer, including invalid
nonempty whitespace, so the server actually validates it. The first remote
adopter is JournalVoucherListVM.Amount with scale6 comparison thresholds;
its separate nonnegative minAmount screen filter uses ledger scale2. Neither
comparison field changes stored precision or recalculates document money.

Filter the existing tenant/soft-delete-scoped query before count/order/page and
reuse the same applied snapshot for export. The compiled response projection's
flat scalar properties are the default whitelist; client member paths, entity
types and SQL are never accepted. Explicit server-owned expression maps cover
source-supported aliases/composite values. Generic `Service.ApplyGridFilters`
constrains identities through `GridFilterProjection`, retaining existing order and
materialization. Override the projection when the actual read materializer uses
different calculations; do not filter default/null placeholders for values filled
after a page read. A complete existing in-memory aggregation may filter its final
rows before its existing count/page; do not introduce full materialization solely
to avoid SQL translation. No grid rules means no added membership query.

**Custom filter reconstruction.** A list
override that builds a whitelist/normalized dictionary from the bound filters
must retain the reserved encoded `grid` value before calling `ListQuery` or the
shared filter owner. Do not silently drop it while forwarding ordinary screen
keys. Verify its effect on count, rows, corrected page and full export together;
the existing shared parser/DTO scalar whitelist remains authoritative. Evidence:
Sales Fleet's EquipmentService filter reconstruction and current corrective
contract; SQL/runtime acceptance remains separate from source conformance.

Custom search DTOs retain an initialized query-bound `Filters` auto-property;
GET uses the bracket key and POST search bodies nest the same `filters.grid`.
Do not create a second top-level `Grid` alias or global interceptor state. Private
normalization retains last-value semantics and never replaces MVC's bound instance.
Unsupported display-only fields are explicit exclusions on both UI and server,
not a successful unfiltered response. No schema/migration or write DTO change is
implied by read filtering.

**Nullable response identity.** The shared membership hook accepts
both `int` and `int?` response identities: current `ListBaseVm.Id` is nullable
although the source entity key is not. Lift both sides to `int?` in the SQL
membership expression; a null projected identity matches no entity. Do not
reject an otherwise valid column filter or copy a feature override solely to
work around this shared type boundary. Keep genuine computed display aliases
and feature-specific scalar projections in their owning feature. Equipment
Rental's list audit found this boundary before its missing quotation projection;
source conformance does not establish EF SQL translation or runtime acceptance.

The GET host limits must accommodate the bounded JSON after URL encoding, rather
than silently rejecting valid multi-rule searches before model binding. The current
192 KiB request-line/query ceiling leaves room for the worst-case encoding of
16 KiB JSON and existing screen keys; the parser still enforces its16KiB limit.
Kestrel's HTTP/2 field and total-header ceilings and IIS request filtering are
configured together. An external proxy needs equivalent owner verification; these
are finite transport bounds, not a larger accepted filter contract. See
[IIS request limits](https://learn.microsoft.com/en-us/iis/configuration/system.webserver/security/requestfiltering/requestlimits/)
and [Kestrel limits source](https://github.com/dotnet/aspnetcore/blob/main/src/Servers/Kestrel/Core/src/KestrelServerLimits.cs).
IIS HTTP.sys machine-level limits are independent and can remain smaller than
web.config; deployment acceptance must verify them and any proxy. Do not change
registry or host policy implicitly as part of a source-only screen task.

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

**Preserve query-bound dictionary identity.** A `Filters[key]`
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

**Derived consumption filters.** When a list exposes a
server-derived source-use status, filter against the same live source/downstream
capacity rules in SQL before `CountAsync`, ordering and paging. Do not filter a
materialized page. A null/absent filter returns all statuses; a recognized
NoQuantity value is a real filter, not an absent value. The all-pages export
uses that same filtered list query. Purchase Request is the first example.
For that example, Pending and Approved POs consume source capacity; Rejected
POs do not. The SQL status filter and the batched percentage/read projection
must exclude the same rejected orders as the conversion reservation query.

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
**1–100**:

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

