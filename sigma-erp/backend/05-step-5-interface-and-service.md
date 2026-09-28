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

**Standard list = `GetManyAsync` override.** A screen's list overrides
`GetManyAsync(ListSmBase searchModel)`, which the base controller exposes as
`GET /<Controller>` (block 9). Do not add a new `Search…Async` method or
`[HttpPost("search")]` endpoint for a standard list. An **additional** read
endpoint is allowed only when the feature contract records why, for example a
mixed-source grid that unions two aggregates (`GET Job/workshop-grid`) or an
existing endpoint kept for external compatibility (`POST JobEstimation/search`).
A new one still takes `[FromQuery] ListSmBase` on `GET` and returns `Results<T>`
with the block 9 paging contract.

**Check:** interface closes the generic and adds only real extras · service
inherits `Service<…>` · only justified overrides · overrides preserve base
invariants · a `Fail` helper for consistent messages · `CancellationToken`
forwarded where the base declares one · `FindByIdAsync`, never `GetByIdAsync` ·
no new search endpoint without a recorded reason.

---

