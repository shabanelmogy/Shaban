## 17. Pattern 5 — Reports

> **Status: Canonical**

A report is not CRUD. It has no Add, Update or Delete, no `ListVM`, and often no
entity of its own — it reads across several tables and returns one shaped
response. The Angular side is blocks 20 and 21 of the UI pattern book
(`Customers/StatementOfAccount` and friends).

Shape:

| Piece | Where |
|---|---|
| Filter DTO | `SiGma.ViewModels/ViewModels/<Report>/<Report>FilterVM.cs` |
| Response DTO | `SiGma.Helpers/Dtos/<Report>Dto.cs` — sections plus totals |
| Service | own interface, **not** `IService` |
| Controller | own controller with explicit `[HttpGet]` routes |

The service declares only the operations it has:

```csharp
public interface ICustomerStatementService
{
    Task<Result<CustomerStatementDto>> GetStatementAsync(
        CustomerStatementFilterVM filter, CancellationToken cancellationToken);
}
```

**Read-only queries use `QueryReport<T>()`**, which is `AsNoTracking` and accepts
`where T : class` so keyless projections and views work.

```csharp
var lines = await UnitOfWork.Repository.QueryReport<JournalVoucherLine>()
    .Where(x => x.PartnerId == filter.CustomerId)
    .Where(x => x.Date >= filter.FromDate && x.Date <= filter.ToDate)
    .OrderBy(x => x.Date).ThenBy(x => x.Id)
    .Select(x => new StatementLineDto { … })
    .ToListAsync(cancellationToken);
```

**`QueryReport` fails closed.** A tenant-scoped type returns nothing when the subscription
claim cannot be resolved; soft-deleted rows are excluded; a global reference type
(`EntityBaseWithoutSubscription`) is not tenant-filtered (re-verified 2026-09-30). Still:

- never use `QueryReport` for a validation or ownership check;
- keep `[Authorize]` on every report controller;
- when the projected type is keyless or a view, add the tenant predicate yourself.

Rules for the query itself:

- **aggregate in the database.** `SumAsync`, `CountAsync`, `GroupBy` translated to SQL
  — not `ToListAsync()` followed by LINQ-to-objects;
- **filter before aggregating, counting, sorting and paging**, in that order;
- **deterministic ordering** with a tie-breaker, or paged results repeat rows;
- **totals are computed and returned by the backend.** The UI displays them and
  must never re-sum a page;
- **state whether a total covers the page, the filtered set, or the whole
  report**, and use the same rule in the screen, the print view and the export;
- **no N+1.** One query per section, not one per row;
- **date boundaries are explicit** — is `toDate` inclusive? Decide, document it,
  and apply it identically everywhere.

**Paged report responses are explicit.** State the page-size clamp, deterministic
ordering and rows/count/page metadata even when wrapped inside Result<T>. Document
whether totals cover the page or all matching rows; frontend paging, print and export
must honor that scope (UI 6/8/20/21). A first page cannot be presented as a full report.
This rule does not introduce paging into an existing unpaged endpoint.

When a screen needs the complete filtered dataset, prefer an explicitly confirmed
complete-response route or opt-in request flag over repeatedly recomputing the
same report for every page. Freeze that option and its rows/count/page metadata
with the consumer; preserve the existing paged default for other callers. When
only a paged contract exists, the consumer must collect every page before local
paging, print or export.

**Conditional aging filters have one effective contract.** When a report supports
custom bucket end-days, the off state uses its confirmed defaults and the on state
requires positive, strictly increasing integer boundaries. Validate at the API even
when the form validates; do not silently accept an invalid sequence. Either return
effective boundaries or expose a confirmed contract the consumer can use to label
the same applied buckets in screen, summary, print and Excel. Exact values and
accounting formulas remain in the feature contract, not this reusable rule (UI 20).

### Allocation-based financial aging

Trace the ledger writer and allocation consumer before freezing financial
formulas. A posted receipt or credit may already reduce the debit-credit ledger
net; deducting its matched amount again produces a false balance. For outstanding
aging, reconcile the actual target and source lines before bucketing: reduce
opposite-signed remaining amounts by the same matched magnitude, bounded by each
line's capacity, so matching preserves the ledger net. Keep informational matched
amounts distinct from net balance; exact column meanings remain feature-owned.

Apply the same explicit as-of cutoff to allocation dates and both actual journal
sides, with tenant, live-parent, posted/non-voided and account/partner eligibility.
Resolve explicit source details or the actual allocating document's journal from
the persisted links. A header-level link can cover several eligible lines;
document deterministic distribution and capacity guards rather than selecting an
arbitrary first credit. Never use unrelated receipt totals as a matching proxy.

Require confirmed receivable-account membership. Missing control-account mapping
must produce the feature's documented configuration failure or empty-result
contract; it must never widen the query to every customer-associated account.
Review partial settlement, full settlement, unapplied credit, future allocation
and future source cases by source arithmetic, and distinguish that evidence from
owner runtime/accounting acceptance.

### Derived operational summary reports

A dashboard-like report with several summaries and one detail table remains a
read-only report. Do not add a report entity, CRUD service, mutation endpoints,
or persisted calculated columns merely to reproduce screenshot sections. Use a
typed filter DTO, one typed response DTO containing all ordered sections and
rows, a dedicated service interface/controller, `[Authorize]`, and
`QueryReport<T>()`. Aggregate and calculate on the backend; the Angular screen,
print view, and export consume the same response.

Screenshot labels do not establish formulas. Before implementation, name each
derived proxy and its failure mode in the feature handoff. Outstanding and
collected values must use the authoritative allocation records rather than
subtracting unrelated receipt totals. Age buckets must be disjoint, cover the
documented population exactly once, and use one documented as-of boundary.

A feature's derivation table (sections, proxies, boundaries, buckets) belongs to its review
artifact, not to this block. Example: Daily Service Logs —
`reviews/DAILY_SERVICE_LOGS_FEATURE_REVIEW.md`. Changing a proxy is a business-contract change:
the backend calculation, the typed response, the UI labels and that artifact change together.

### Derived operational alerts

An alert endpoint is a read model, not an invitation to add a new entity. Derive
it from tenant-scoped persisted facts and existing settings when those facts are
sufficient. Keep one explicit `GET` route per alert type, use a shared typed
filter/paging DTO only where the filters truly match, and return a minimal
type-specific row DTO. Screen, export, and print must consume the same filtered
contract.

Every inferred threshold or proxy must be named beside the implementation and
recorded in the feature handoff. Prefer tenant settings over constants. When a
constant is necessary, isolate it rather than scattering it through query code.
If the domain lacks a direct relationship, state the proxy and its failure mode;
do not present the inference as stored fact.

Current Fleet Alerts baseline:

| Variant | Derived rule |
|---|---|
| Registration | `NextRegistrationDate` is overdue or due today (`< tomorrow`). The reviewed screenshot establishes historical/overdue inclusion but does not establish a future look-ahead window |
| Mileage | Latest dated mileage-bearing Agreement, Collection, Custody, Workshop, or Job record is older than `MileageUpdateAlertAfterMonths`; fall back to vehicle creation date when no reading exists. Include latest vehicle status and customer contact from the latest open Agreement |
| Warranty | Produce one row per non-deleted `Warranty` child record. Derive time expiry from `RegistrationDate + Period/PeriodUnit`, and alert within 30 days or within 1,000 km of the warranty KMs limit. Preserve Warranty Type, KMs, Notes, Period Unit, and Period in the row contract |
| Services | Apply `ServiceAlertsPriorDays` / `ServiceAlertsPriorKms` to every active service definition. Use the latest Workshop Movement for the same vehicle and service as the baseline; use the latest legacy vehicle Workshop Movement only as a compatibility fallback, then purchase/creation date and zero km. Return only the most urgent due service per vehicle and include latest status/open-Agreement contact |

Service completion is a confirmed write workflow. `POST services/complete`
records date/time, fuel level, KMs, vehicle, and service definition in one
Workshop Movement and updates the vehicle KMs in the same save. Therefore
`WorkshopMovement.VehicleServiceId` is a nullable foreign key and requires a
schema migration before deployment; nullable preserves legacy movement rows.
`POST services/reminders` accepts selected vehicle IDs and emails the customer
from the latest open Agreement when an address and SMTP settings exist. Do not
send reminders to closed agreements or silently treat a missing address as a
successful delivery.

### Operational logs over an existing aggregate

A screen or route named `Log` is not evidence that the domain needs another
entity or table. Before creating one, trace the persisted movement/history
aggregate, its settings, and every current writer. When those facts already own
the history, implement a feature-specific read model and explicit controller on
top of that aggregate; do not duplicate the same history in a parallel `*Log`
table.

If the screenshot-confirmed Create form contains inputs the owning aggregate
cannot persist, add only those missing persisted properties to the owner, with
matching EF length/precision/relationship configuration, and report the required
migration handoff. Derived list values such as next-due values, checklist names,
or linked purchase-order items stay backend-owned projections when current
relations can calculate them. The write endpoint validates every foreign key,
writes the owning aggregate, and uses one `SaveChangesAsync()` when the complete
operation shares one scoped context.

**Check:** own interface and controller, not `IService` · filter DTO is typed ·
totals computed in the database and returned · ordering deterministic · aggregation
before paging · one query per section · `[Authorize]` present · tenant predicate
explicit where `QueryReport` cannot apply it · same rules across screen, print and
export.

#### Derived filters whose predicate lives in another aggregate

An aggregated log may need a filter whose condition is owned by a different
aggregate. Freeze the join key from the source before writing the predicate, and
prefer the tightest key available: match on the owning agreement when the row has
one, and fall back to the vehicle only for rows that carry no agreement, because
not every movement source has an agreement column. State the fallback in the
code, not only in the review.

Record the timestamp the filter actually means, not the one that looks closest.
"Recorded after the movement went out" is `Accident.CreatedAt > movement.DateTimeOut`;
`Accident.AccidentDateTime` falling inside the movement window is a different rule
and returns different rows. Both are defensible; only one is what the business
asked for, so name it explicitly and do not let a later reader swap it silently.

When the predicate needs a second table, load the matching keys once with a
bounded query and evaluate the flag in memory over the already aggregated rows.
Do not add a correlated subquery to each source projection: the aggregation is
unbounded and runs before paging, so the cost lands on every row of every source.
Bound the scan by the earliest row you must decide for.

A flag you add to the read DTO must be truthful on every request that returns the
DTO, so compute it unconditionally rather than only when the caller filters on it.
A field that is only populated on one code path is a trap for the next reader.

Verify the tenant predicate against the write path that stamps ownership. Before
filtering a table by `SubscriptionId`, confirm the writer actually sets it — if
ownership is stamped at the persistence boundary rather than in the service, say
so, because a predicate on an unstamped column silently returns nothing.

**Check:** join key chosen from the source and stated · agreement-first with a
vehicle fallback wherever a source has no agreement · the timestamp means what
the label says, and the alternative was rejected on purpose · one bounded query,
not one per source projection · scan bounded by the earliest decided row · null
timestamps excluded explicitly rather than matching silently · DTO flag computed
on every request · tenant predicate verified against the stamping write path ·
the filter absent returns the same rows as before it existed.

---
