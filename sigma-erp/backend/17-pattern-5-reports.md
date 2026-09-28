## 17. Pattern 5 — Reports

> **Status: Transitional** — `QueryReport` fails open, see the warning

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

**Warning — `QueryReport` fails open.** Every other repository method fails closed:
an unresolved subscription claim yields `SubscriptionId == 0` and returns nothing.
`QueryReport` instead returns the **unfiltered** set when the claim is missing, and
also when `T` has no `SubscriptionId`/`IsDeleted` property:

```csharp
// If no subscription was resolved from the current request, don't filter by subscription.
if (_subscriptionId <= 0)
    return query;
…
if (subscriptionProp == null || isDeletedProp == null)
    return query;
```

So any report reached without a resolved claim — a background job, a scheduled
task, an endpoint whose `[Authorize]` was relaxed — can read across tenants. Until
that is fixed (backlog item 10):

- never use `QueryReport` for a validation or ownership check;
- keep `[Authorize]` on every report controller;
- when the projected type is keyless or a view, add the tenant predicate
  yourself rather than assuming it was applied.

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

Current Daily Service Logs baseline (`DailyServiceLogReportService`):

| Section | Backend derivation |
|---|---|
| Date boundary | The selected local calendar date uses a half-open interval `[date, date + 1 day)`. Month/year/PY comparisons end at the equivalent exclusive boundary |
| RAC / Outside | Named compatibility proxy: a Job without `CustomerId` is RAC/internal; a Job with `CustomerId` is Outside. This is inferred from current persisted relationships and must be replaced if the domain adds an explicit ownership classification |
| Vehicle service counts | Distinct `Job.VehicleId` values in each documented period, split by the RAC/Outside proxy |
| Invoicing | `Invoice.JobNo == Job.No`; sum invoice `TotalAmount` for the period and split by the owning Job proxy |
| Collection outstanding | Invoice total minus all authoritative journal-voucher allocations as of the selected day; never below zero. Age from `DueDate`, falling back to `InvoiceDate`, in disjoint 0–30, 31–90, 91–180, 181–270, 271–365, and >365 day buckets |
| Receipts | Approved, non-voided receipts linked through invoice journal-voucher allocations. Group only the amount allocated to service invoices by payment type; day and month sections use the same as-of boundary |
| Opening / closing | `ApprovalStatus.NotApproved` is the current open-job proxy; any other approval status is the current closed-job proxy because the aggregate has no separate close timestamp |
| Pending closing | Open Jobs grouped by age: 0, 1–2, 3–7, 8–90, and >90 days. The last two labels are “More than 7 Days” and “More than 3 Months” |
| Purchases | Approved `PurchaseOrderDetail.AmountPlusTax` rows linked to a Job; compare current-year-to-date with the equivalent previous-year period |
| Payment outstanding | Job-linked Bill total minus authoritative allocations, never below zero, grouped into 0–90, 91–270, and >270 day buckets |
| Detail rows | Jobs within the selected day, ordered by `DateAndTime` then `Id`. Invoice amount is preferred; receipt-only allocations supply Amount Collected; Amount Pending is the non-negative difference |

These are named source-backed proxies, not new stored facts. Changing one is a
business-contract change and requires updating the backend calculation, typed
response expectations, UI labels where applicable, and this baseline together.

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

