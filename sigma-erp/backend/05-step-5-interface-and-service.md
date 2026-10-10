## 5. Step 5 — Interface and service

> **Status: Canonical**

The interface is usually empty — it exists to name the closed generic and to be
injected.

```csharp
using SiGma.Business.IServices.Bases;
using SiGma.ViewModels.ViewModels.Branch;

namespace SiGma.Business.IServices
{
    public interface IBranchService
        : IService<BranchAddVM, BranchUpdateVM, BranchDetailVM, BranchListVM>
    {
    }
}
```

`IService` already declares the whole surface:

```csharp
Task<Result>            AddAsync(TAddVm addVm, CancellationToken cancellationToken);
Task<Result>            AddListAsync(IEnumerable<TAddVm> addVms);
Task<Result>            UpdateAsync(TUpdateVm updateVm);
Task<Result>            UpdateListAsync(IEnumerable<TUpdateVm> updateVms);
Task<Result<TDetailVm>> DetailAsync(int id);
Task<Results<TListVm>>  GetManyAsync(ListSmBase searchModel);
Task<Results<TListVm>>  GetManyWithNavigationsAsync(ListSmBase searchModel);
Task<Result>            RemoveAsync(int id);
Task<Result>            HandleActiveAsync(ActiveVm activeVm);
Task<Results<TListVm>>  GetAllWithNavigationsAsync();
Task<Result<TDetailVm>> DetailWithNavigationsAsync(int id);
Task<Results<DropdownDto>> SelectAsync();
```

The service inherits the generic base and overrides **only** what needs
feature-specific rules:

The shared interface/service/controller constrain the detail response only to
`class`, since their read paths do not use `DetailBaseVm` members. Use a lean
explicit detail VM when inherited fields are unused (block 3); legacy derived
detail VMs remain accepted. Do not duplicate generic read methods to work around
a read-shape constraint.

```csharp
public class BranchService :
    Service<BranchAddVM, BranchUpdateVM, BranchDetailVM,
            BranchListVM, SiGmaDbContext, Branch>, IBranchService
{
    public BranchService(IUnitOfWork<SiGmaDbContext> unitOfWork, IMapper mapper,
        IStringLocalizer<GeneralMessage> localization)
        : base(unitOfWork, mapper, localization) { }
}
```

Add a custom operation only when the base cannot express it, and declare it on
the feature interface first. When you override, reproduce every invariant the
base method provided — tenant scope, soft-delete filter, server-owned fields,
response shape. A secure base does not protect an override that replaces it.

**Repository calls.** Load by id with `UnitOfWork.Repository.FindByIdAsync<T>(id, ct)`.
There is no `GetByIdAsync` on `IRepository`. For relations use
`GetByIdWithNavigationsAsync<T>(id, ct)`, or `GetByIdDeepAsync<T>(id, ct)` for a
read-only tree (`SiGma.Repos/IRepository/IRepository.cs`).

**Detail read (2026-10-01).** The base `DetailWithNavigationsAsync` reads the record through
`GetByIdDeepAsync`: every navigation level, deleted rows skipped, no circular loops. A service does
not override it, and a profile adds no `.Where(x => x.IsDeleted != true)` to a detail map. Override
it only for a projection the editor really needs that the deep load cannot give, and record why
(Company and Driver overrides removed).

**Read-only context isolation (2026-10-02).** Detail loading must not attach read copies,
detach entries or clear the tracker of the write unit of work. The generic
`GetByIdDeepAsync` resolves a separate scoped `TContext` through the existing DI registration,
loads its graph there, and disposes that read scope on success, missing root, cancellation or
exception. It does not save or share the write context's local transaction or pending changes;
its result represents persisted data. Keep tracked aggregate updates on the write context
(block 14). Source-only implementation; owner runtime verification pending. Existing graph
filtering and traversal findings remain in `reviews/REPOS_UNIT_OF_WORK_LOGIC_FEATURE_REVIEW.md`.

**Standard list = `GetManyAsync` override.** A screen's list overrides
`GetManyAsync(ListSmBase searchModel)`, which the base controller exposes as
`GET /<Controller>` (block 9). Do not add a new `Search…Async` method or
`[HttpPost("search")]` endpoint for a standard list. An **additional** read
endpoint is allowed only when the feature contract records why, for example a
mixed-source grid that unions two aggregates (`GET Job/workshop-grid`) or an
existing endpoint kept for external compatibility (`POST JobEstimation/search`).
A new one still takes `[FromQuery] ListSmBase` on `GET` and returns `Results<T>`
with the block 9 paging contract.

### What the base service gives you

Use these before writing a line of your own (`Services/Bases/Service.cs`, 2026-10-01):

| Need | Base member | Block |
|---|---|---|
| List with filters, total, clamped paging, stable order | `GetManyAsync` + override `ApplyListFilters` / `ApplyListOrder` | 9, 13 |
| List rows that show navigation names | override `MaterializeListAsync` with `ProjectTo` | 13 |
| Clamp supplied paging in a custom list | `NormalizePaging(searchModel)` | 9 |
| Localized failure / message | `BusinessFailure(key, statusCode?)`, `BusinessFailure<T>`, `LocalizeMessage(key)` | 5 (below) |
| Every id of a detail collection exists | `AllExistAsync<T>(ids)` | 8 |
| Unique values and every chosen reference exist | automatic in the base Add/Update (`InvalidInputAsync`); declare `UniqueColumns` | 8 |
| Serialize participating duplicate-check writes | automatic for `UniqueColumns` in base Add/Update; custom writers use `UnitOfWork.ExecuteUniqueWriteAsync<TEntity>` | 8 |
| Usages that block a delete | automatic in `RemoveWithChildrenAsync`; `InUseAsync<T>(id, owned…)` for a child dropped from a snapshot | 8 |
| The list rows for an export | `ListQuery(filters)` | 13 |
| The list's search box | `SearchColumns => [x => x.Name, …]` | 13 |
| Sort by a computed value | `SortField(filters)`, `SortBy(query, key, filters)`; stored columns and navigation names sort in the base | 13 |
| Saved child ids belong to the aggregate | `OwnsAll`, `OwnsReference` | 14 |
| Full snapshot of owned rows on a tracked aggregate | `ReconcileOwned`, `ReconcileReference` | 14 |
| Custom aggregate update inside the base write guard | override protected `UpdateCoreAsync`; public `UpdateAsync` delegates to the base after business preparation | 14 |
| Remove omitted tracked children with usage checks | `RemoveDroppedAsync(current, incoming, owned…)` | 14 |
| Save a tracked update and return the standard result | `SaveUpdateAsync(entity, ct)` | 14 |
| Reverse part of a posted document line by line | `JournalVoucherResolver.AddProportionalReversal` (+ `FinancialNumberPolicy.AllocateProportionally`) | 15 |
| Delete an aggregate with its owned rows | `RemoveWithChildrenAsync(id, ct, x => x.Lines, x => x.PartnerAddress)` — collections and one-to-one rows, 404 when missing | 8 |
| Validated bulk activate | `HandleActiveAsync` (virtual) | 12 |
| Single-row settings | derive from `SingleRowSettingsService` | 16 |
| Settings rows by key | `IServiceHelper.UpsertByKeyAsync` | 16 |

**Save completion, not row count.** `IUnitOfWork.SaveChanges` and `SaveChangesAsync`
return true when EF completes successfully, including zero affected rows. An unchanged
validated update succeeds. Keep ownership-conflict failure and exception propagation;
`SaveUpdateAsync` uses this shared result rather than forcing writes or adding a local
no-change shortcut (block 14).

**Valid tenant at persistence (2026-10-03, owner-approved R2).** Before numbering,
UOW rejects Added/Modified/Deleted EntityBase entries when its resolved
subscription is not positive. DbContext independently applies the same rule
before audit/SQL, covering direct saves and all sync/async overloads. The typed
`SubscriptionRequiredException` becomes localized `FailToAuth`/HTTP401 through
the existing middleware. No-change and global-only saves do not require a
tenant. Repository ordinary tenant operations guard earlier; the report/global
exception follows blocks 17–18. Do not add per-service tenant fallbacks.

**Known gap (owner decision D5-2, deferred):** only `AddAsync` takes a `CancellationToken`;
`UpdateAsync`, `RemoveAsync`, `DetailAsync` and `GetManyAsync` do not, so a cancelled request
cannot stop their queries. Do not add per-service workarounds; the interface changes once.

### Tax in any service

Every service that stores, calculates or previews a tax — whatever its pattern
(quotation, request, agreement, invoice, note, report) — takes the rate from
`ITaxPolicyService` (`SiGma.Business/Resolver`): `GetStandardRatePercentAsync` for
the rate, `ResolveRateAsync(requested)` for any client-sent rate (settings rate, or 0
when tax is optional; anything else fails), `ResolveTaxAmountAsync` for amount-based
documents. Calculate the document tax per tax rate, rounded once, with `VatPolicy.CalculateDocumentTax`
(and `AllocateDocumentTax` when a line needs its share; owner decision D4-4),
snapshot the rate on the document or line, and never write a literal rate (`5`,
`5m`, `0.05m`, `15m`, `/ 100 * 5`). The full rule and its reasons are backend
block 15 rule 8.

### Failure messages

A business failure is returned through the base helper, not a new private `Fail` copy:

```csharp
if (await UnitOfWork.Repository.ExistsAsync<Branch>(x => x.Name == vm.Name))
    return BusinessFailure("BranchNameExists");          // Result
return BusinessFailure<BranchDetailVM>("BranchNotFound");  // Result<T>
```

`BusinessFailure(key, statusCode?)` looks the key up in `GeneralMessage` (`.resx` and
`.ar-SA.resx`, both in the same change) and returns the text for the request culture. The
Angular token interceptor sends `Accept-Language` from the UI language (`ar` → `ar-SA`,
otherwise `en-US`), so an Arabic user gets Arabic messages. A literal string is returned
unchanged: that is only for legacy callers. `LocalizeMessage(key)` gives the same lookup for a
success message. The ≈90 existing private `Fail` helpers and their English literals move to keys
when their service is next touched; do not add new ones.

**Check:** interface closes the generic and adds only real extras · service
inherits `Service<…>` · only justified overrides · overrides preserve base
invariants · failures through `BusinessFailure(key)` with the key in both `.resx` files (no new private `Fail`) · `CancellationToken`
forwarded where the base declares one · `FindByIdAsync`, never `GetByIdAsync` ·
no new search endpoint without a recorded reason · any tax comes from
`ITaxPolicyService` with no literal rate.

**Shared rules, shared keys and DTOs (G11, 2026-10-01).** A rule shared by several partner
screens has one neutral message key (`Partner…`, `Customer…`, `Driver…`) and one DTO
(`AgreementHistoryVM`, `CustomerContactGroupUpdateVM`). A feature-prefixed copy of the
same message, such as `CompanyBranchNotFound` beside `IndividualPartnerBranchNotFound`, or of the
same DTO is a shared-extraction finding (Master 5). Move the copies when their screen is reviewed
(backlog 30).

---
