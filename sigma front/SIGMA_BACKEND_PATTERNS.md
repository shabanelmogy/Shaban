# Sigma Backend Pattern Book — Draft Canonical

| | |
|---|---|
| Status | **Draft canonical.** Binding for new work; open items in block 19 |
| Version | 0.3 |
| Last verified against source | 2026-08-06 |
| Verified by | source inspection only — no build, test, migration, or database run |

Build order for one entity, six steps, four patterns. Open the reference file,
copy the shape, change the names.

Paths are relative to `SigmaBackend/`. This book is the single authority for
.NET work. Its companion is `SIGMA_UI_PATTERNS.md`, the Angular side of the same
contract — the ListVM, filter-key and payload rules are shared, so a change to
either side is a change to both.

Review orchestration, screenshot evidence, phase ownership, contract artifacts,
and final reconciliation are defined by `SIGMA_FEATURE_REVIEW_MASTER.md`. This
book remains the backend implementation authority incorporated by that master.
Screenshot-visible values never authorize a new entity, DTO field, endpoint, or
persistence contract without confirmed source or an explicit business decision.

### Generation packets

Coding models should not load this entire book when a reviewed phase or task
packet exists. Use the generated packet under `recipe-system/generated/` and
the approved reference named by that packet. Generated packets are derivative:
this book remains authoritative when they disagree.

`recipe-system/Generate-SigmaRecipes.ps1 -Check` verifies that each generated
packet still carries the current fingerprints of its canonical source blocks.
Tasks without a matching recipe use the smallest applicable block dependency
closure from this book.

## The six steps

Always in this order. Each step depends on the one before it.

| Step | Artefact | Project and folder |
|---|---|---|
| 1 | Entity | `SiGma.Helpers/Models/<Entity>.cs` |
| 2 | EF configuration | `SiGma.DataAccess/Configuration/<Entity>Config.cs` |
| 3 | ViewModels | `SiGma.ViewModels/ViewModels/<Entity>/` |
| 4 | AutoMapper profile | `SiGma.Business/MapperConfig/<Entity>Profiler.cs` |
| 5 | Interface + service | `SiGma.Business/IServices/I<Entity>Service.cs`, `SiGma.Business/Services/<Entity>Service.cs` |
| 6 | Controller | `SiGma.ServerAPI/Controller/<Entity>Controller.cs` |

Then tell the owner to run `Add-Migration`. Never create, edit, or run a
migration yourself, and never touch `SiGmaDbContextModelSnapshot.cs`.

## The four patterns

| # | Pattern | Reference service | Choose when |
|---|---|---|---|
| 1 | Normal entity | `Services/BranchService.cs` | One entity, ordinary Add/Update/Detail/List/Select/Delete |
| 2 | Master-detail, no financial effect | `Services/VouchersServices/PurchaseOrderService.cs` | A header owns detail rows; no journal voucher, no allocation |
| 3 | Master-detail with financial effect | `Services/VouchersServices/InvoiceService.cs` | Saving also writes a journal voucher, allocations, or accounting state |
| 4 | Settings | `Services/AdministrationsServices/ChargeSettingsService.cs` | A screen loads and saves a whole configuration set keyed by a logical key |
| 5 | Report | `QueryReport<T>()` plus a feature service, block 17 | Read-only, reads across tables, returns sections and totals. No CRUD, no `ListVM` |

Pick the **simplest** pattern that fits. Do not add detail reconciliation to a
normal entity, and do not add voucher or allocation logic to a non-accounting
document.

## Contents

| # | Block | Status |
|---|---|---|
| 1 | [Step 1 — Entity](#1-step-1--entity) | Canonical |
| 2 | [Step 2 — EF configuration](#2-step-2--ef-configuration) | Canonical |
| 3 | [Step 3 — ViewModels](#3-step-3--viewmodels) | Canonical |
| 4 | [Step 4 — AutoMapper profile](#4-step-4--automapper-profile) | Canonical |
| 5 | [Step 5 — Interface and service](#5-step-5--interface-and-service) | Canonical |
| 6 | [Step 6 — Controller](#6-step-6--controller) | Canonical |
| 7 | [ListVM scope rule](#7-listvm-scope-rule) | Canonical |
| 8 | [Validation: duplicates, keys, delete](#8-validation-duplicates-keys-delete) | Canonical |
| 9 | [Search model and filters](#9-search-model-and-filters) | Canonical |
| 10 | [Select and dropdowns](#10-select-and-dropdowns) | Transitional |
| 11 | [Document numbers (No)](#11-document-numbers-no) | Legacy |
| 12 | [Activate and deactivate](#12-activate-and-deactivate) | Transitional |
| 13 | [Pattern 1 — Normal entity](#13-pattern-1--normal-entity) | Canonical |
| 14 | [Pattern 2 — Master-detail, no financial effect](#14-pattern-2--master-detail-no-financial-effect) | Transitional |
| 15 | [Pattern 3 — Master-detail with financial effect](#15-pattern-3--master-detail-with-financial-effect) | Canonical |
| 16 | [Pattern 4 — Settings](#16-pattern-4--settings) | Canonical |
| 17 | [Pattern 5 — Reports](#17-pattern-5--reports) | Transitional |
| 18 | [Edge cases](#18-edge-cases) | Canonical |
| 19 | [Backlog](#19-backlog) | — |

---

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

---

## 2. Step 2 — EF configuration

> **Status: Canonical**

One `IEntityTypeConfiguration<T>` per entity. Table name from `nameof`, explicit
max lengths, and a tenant-scoped unique index wherever duplicates would break a
business rule.

```csharp
namespace SiGma.DataAccess.Configuration;

public sealed class BranchConfig : IEntityTypeConfiguration<Branch>
{
    public void Configure(EntityTypeBuilder<Branch> builder)
    {
        builder.ToTable(nameof(Branch));

        builder.Property(x => x.BranchCode).HasMaxLength(50);
        builder.Property(x => x.BranchCode2).HasMaxLength(50);
        builder.Property(x => x.TRN).HasMaxLength(50);
        builder.Property(x => x.State).HasMaxLength(100);
        builder.Property(x => x.Address).HasMaxLength(500);
        builder.Property(x => x.CCEmails).HasMaxLength(500);

        // Name lives on EntityBaseWithName — configured here for max length
        builder.Property(x => x.Name).HasMaxLength(100);

        builder.HasIndex(x => new { x.SubscriptionId, x.Name }).IsUnique();
    }
}
```

Rules:

- every string gets `HasMaxLength`, and it must match the ViewModel's
  `[MaxLength]`;
- every decimal gets `HasPrecision(18, 2)` or the scale the business needs;
- a uniqueness rule always includes `SubscriptionId`, so tenants cannot collide;
- child relationships declare delete behaviour explicitly:

```csharp
builder.HasMany(x => x.PurchaseOrderDetails)
       .WithOne(d => d.PurchaseOrder)
       .HasForeignKey(d => d.PurchaseOrderId)
       .OnDelete(DeleteBehavior.Cascade);
```

- add an index for a column the list actually filters or sorts on, not
  speculatively.

**Check:** `ToTable(nameof(X))` · max lengths match the VM annotations · decimal
precision set · unique index includes `SubscriptionId` · child delete behaviour
explicit · migration required is **reported to the owner**, never generated.

---

## 3. Step 3 — ViewModels

> **Status: Canonical**

Six files per entity in `SiGma.ViewModels/ViewModels/<Entity>/`:

| File | Base | Direction |
|---|---|---|
| `<Entity>AddVM.cs` | `AddBaseVm` / `AddBaseVmWithName` | client → server, create |
| `<Entity>UpdateVM.cs` | `UpdateBaseVm` / `UpdateBaseVmWithName` | client → server, update |
| `<Entity>ListVM.cs` | `ListBaseVm` / `ListBaseVmWithName` | server → grid |
| `<Entity>DetailVM.cs` | `DetailBaseVm` / `DetailBaseVmWithName` | server → editor |
| `<Entity>FullListVm.cs` | `ListBaseVm…` | server → export / unpaged consumer |
| `<Entity>DeleteVm.cs` | — | `Id` only |

```csharp
using SiGma.Helpers.ViewModelsBases.Add;

namespace SiGma.ViewModels.ViewModels.Branch
{
    public class BranchAddVM : AddBaseVmWithName
    {
        public string? BranchCode { get; set; }
        public string? BranchCode2 { get; set; }
        public string? TRN { get; set; }
        public string? State { get; set; }
        public string? CCEmails { get; set; }
        public string? Address { get; set; }
    }
}
```

What each base supplies:

```csharp
AddBaseVm      // nothing — the client supplies no identity or tenant
UpdateBaseVm   // SubscriptionId (not trusted), No, Id
ListBaseVm     // SubscriptionId, Id, IsActive, IsValid, IsChanged, No, GUID, CreatedAt, CreatedBy
DetailBaseVm   // as ListBaseVm plus IsDeleted
SelectListBaseVm // Value, Text, LocalizedText — dropdowns
```

**Add and Update carry client-editable inputs only.** Tenant, record number,
audit values, delete flags, approval status and calculated totals are
server-owned. `UpdateBaseVm.SubscriptionId` exists for backward compatibility
and its own comment says the API does not trust it — the repository replaces it
with the authenticated subscription. Do not read it as permission to accept a
tenant from the client.

Validation lives on the write VMs using DataAnnotations, and must agree with
step 2:

```csharp
[Required][MaxLength(100)] public string Name { get; set; } = null!;
[Range(0, double.MaxValue)] public decimal Amount { get; set; }
```

**Check:** six files present · correct base per direction · write VMs contain no
server-owned fields · `[MaxLength]` matches `HasMaxLength` · required/nullable
matches the entity and the Angular model · Detail carries only what the editor
needs · List follows block 7.

---

## 4. Step 4 — AutoMapper profile

> **Status: Canonical**

One profile per entity, four maps, nothing else.

```csharp
using SiGma.ViewModels.ViewModels.Branch;

namespace SiGma.Business.MapperConfig
{
    public class BranchProfiler : Profile
    {
        public BranchProfiler()
        {
            // Write maps
            CreateMap<BranchAddVM, Branch>();
            CreateMap<BranchUpdateVM, Branch>();

            // Read maps
            CreateMap<Branch, BranchDetailVM>();
            CreateMap<Branch, BranchListVM>();
        }
    }
}
```

Direction is explicit and one-way in each direction. Therefore:

- **no `ReverseMap()`.** It silently creates a write map you did not review, and
  that is how a client value reaches a server-owned column.
- **no defensive `Ignore()` chains.** If a property must not be written, it does
  not belong on the write VM. Removing it from the VM is the fix; `Ignore()` only
  hides the design problem.
- add `ForMember` only for a genuine shape difference, such as flattening a
  navigation for display:

```csharp
CreateMap<Vehicle, VehicleListVM>()
    .ForMember(d => d.BranchName, o => o.MapFrom(s => s.Branch!.Name));
```

Profiles are discovered by assembly scan, so no registration step.

**Check:** four maps · no `ReverseMap` · no unnecessary `Ignore` · `ForMember`
only for a real difference · every property the list displays is mapped or
projected · nothing maps onto tenant, audit, `No`, delete flags or persisted
totals.

---

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

**Check:** interface closes the generic and adds only real extras · service
inherits `Service<…>` · only justified overrides · overrides preserve base
invariants · a `Fail` helper for consistent messages · `CancellationToken`
forwarded where the base declares one.

---

## 6. Step 6 — Controller

> **Status: Canonical**

Usually five lines. All endpoints come from the base.

```csharp
using SiGma.Business.IServices;
using SiGma.ViewModels.ViewModels.Branch;

namespace SiGma.ServerAPI.Controller
{
    public class BranchController
        : SiGmaControllerBase<BranchAddVM, BranchUpdateVM, BranchDetailVM, BranchListVM, IBranchService>
    {
        public BranchController(IBranchService service) : base(service) { }
    }
}
```

`SiGmaControllerBase` is `[ApiController]`, `[Authorize]`, `[Route("[controller]")]`
and supplies:

| Verb and route | Service call |
|---|---|
| `POST /<Entity>` | `AddAsync` |
| `PUT /<Entity>` | `UpdateAsync` |
| `DELETE /<Entity>?id=` | `RemoveAsync` |
| `GET /<Entity>/GetById/{id}` | `DetailAsync` |
| `GET /<Entity>` `[FromQuery] ListSmBase` | `GetManyAsync` |
| `POST /<Entity>/handleActivate` | `HandleActiveAsync` |
| `GET /<Entity>/GetAllWithNavigations` | `GetAllWithNavigationsAsync` |
| `GET /<Entity>/GetByWithNavigationsId/{id}` | `DetailWithNavigationsAsync` |
| `GET /<Entity>/GetSelect` | `SelectAsync` |

`ToActionResult` maps `Result.IsSuccess` to 200 and a failure to
`Result.StatusCode` or 400, so services return `Result`/`Results<T>` and never
touch HTTP.

This is exactly what the Angular `BaseService` expects — `GetSelect` feeds
`getSelectList()`, `GetByWithNavigationsId/{id}` feeds `getByIdWithNavigation()`,
and the query string is `Filters[key]=value`. Adding a custom route means adding
a matching Angular method, so keep both sides in one change.

Add an explicit action only for a genuinely custom operation:

```csharp
[HttpPut("{id}/SalaryPackage")]
public async Task<IActionResult> ReviseSalaryAsync(int id, StaffSalaryRevisionVM vm)
    => ToActionResult(await Service.ReviseSalaryAsync(id, vm));
```

**Check:** inherits `SiGmaControllerBase` · no re-declared base endpoints · no
business logic in the controller · custom routes match the Angular service ·
`[Authorize]` not weakened · no raw exception, SQL or path in a response.

---

## 7. ListVM scope rule

> **Status: Canonical**

**A ListVM contains only the columns the frontend grid displays, plus the
identity and action-state fields the row needs.** Nothing added for exports,
dropdowns, or another screen.

Worked example. The Angular Branch grid displays:

```
id · name · branchCode · branchCode2 · trn · state · createdBy · createdAt
```

`BranchListVM` currently declares, on top of `ListBaseVmWithName`:

```csharp
BranchCode  ✅ displayed
BranchCode2 ✅ displayed
TRN         ✅ displayed
State       ✅ displayed
CCEmails    ❌ not displayed  → remove
Address     ❌ not displayed  → remove
```

So `CCEmails` and `Address` are over-scope: shipped on every row of every page
for no consumer. They belong to `BranchDetailVM` only.

Procedure when you build or review a list:

1. Open the Angular `initColumns()` and write down every `colName`.
2. Add the row identity (`Id`) and anything a row action needs — a status flag a
   menu item tests, a foreign key an inline edit sends.
3. That is the ListVM. Everything else is removed.
4. Keep the query and mapper aligned: do not `Include` a navigation whose only
   purpose was a field you just removed.
5. A different consumer that genuinely needs a different shape gets its own
   contract — that is what `<Entity>FullListVm` is for.

If the frontend is not in scope, do **not** delete properties on assumption.
Record the decision as `FRONTEND_UNVERIFIED` and name the template you need.

**Also return a real total.** `Results<T>` carries `TotalPages` **and**
`TotalCount`. `BranchService.GetManyAsync` sets `TotalPages` but leaves
`TotalCount` unset, which is why Angular list components carry a fallback that
reconstructs a total from page count — and that fallback overstates the count on
a partial last page. Always set both:

```csharp
var total = await baseQuery.CountAsync();
…
return new Results<BranchListVM>
{
    IsSuccess  = true,
    Entities   = items,
    PageNo     = pageNo,
    PageSize   = pageSize,
    TotalCount = total,                                        // required
    TotalPages = (int)Math.Ceiling(total / (double)pageSize),
};
```

**Check:** every ListVM property maps to a displayed column or a row action ·
`TotalCount` set from `CountAsync` · filters applied before `CountAsync` ·
deterministic `OrderBy` · `ProjectTo` after filtering · no navigation loaded for
a removed field.

---

## 8. Validation: duplicates, keys, delete

> **Status: Canonical**

Three checks apply to **every** entity, in all four patterns. They run before the
first save, and they are the difference between a service and a data dump.

### What the repository already does for you

Read this first, because it decides how the checks are written.
`Repository<TContext>` resolves the tenant from the authenticated principal:

```csharp
var userClaimsPrincipal = contextAccessor.HttpContext?.User;
var userSubscriptionId  = userClaimsPrincipal?.FindFirst(ClaimTypes.NameIdentifier);
if (userSubscriptionId != null) _ = int.TryParse(userSubscriptionId.Value, out _subscriptionId);
```

and then applies tenant plus soft-delete filtering automatically to
`Query`, `ExistsAsync`, `FindByIdAsync`, `FindByAsync` and the rest:

```csharp
var query = _context.Set<T>().Where(a => a.SubscriptionId == _subscriptionId);
if (!includeDeleted)
    query = query.Where(a => a.IsDeleted != true);
```

Both default to `includeDeleted = false`. On write, `Add`/`Update` call
`SetSubscriptionIdForEntityAndChildren`, which overwrites any client-supplied
`SubscriptionId` on the entity **and its children**.

Consequences for your checks:

- **Do not add `&& x.SubscriptionId == …` yourself.** It is already applied, and
  the only value you could add is the untrusted one from the request.
- **Do not add `&& x.IsDeleted != true` yourself.** Also already applied.
- A soft-deleted record therefore does **not** block a duplicate check. If the
  business needs the name reserved even after deletion, pass
  `includeDeleted: true` deliberately and say why.
- One fail-open path exists: `QueryReport<T>()` returns the **unfiltered** set when
  the subscription claim is missing, or when `T` has no `SubscriptionId`/
  `IsDeleted` property. Never use it for a validation check. Backlog item 10.

### 1. Duplicate check

**Add** — reject before mapping or saving:

```csharp
if (await UnitOfWork.Repository.ExistsAsync<Branch>(
        x => x.Name == vm.Name, cancellationToken: cancellationToken))
    return Fail("A branch with this name already exists.");
```

**Update** — the same rule, excluding the record being edited:

```csharp
if (await UnitOfWork.Repository.ExistsAsync<Branch>(
        x => x.Name == vm.Name && x.Id != vm.Id))
    return Fail("A branch with this name already exists.");
```

Forgetting `x.Id != vm.Id` is the classic bug: saving a record without changing
its name reports a duplicate against itself.

Rules:

- the duplicate scope is the **real business key**, not whatever is convenient —
  a code, or a composite such as `(BranchId, Code)`;
- normalize before comparing. Trim first, and decide case behaviour explicitly;
  `Contains` and `==` follow the database collation, so state the intent
  rather than relying on it;
- back the rule with a unique index from step 2, or two concurrent requests can
  both pass the check and both insert;
- for a child collection, uniqueness is usually **within the parent**, so include
  the parent key in the predicate.

### 2. Foreign key existence check

Every incoming id must be proven to exist before the save. Because the
repository scopes by tenant, `ExistsAsync` also proves the row belongs to the
caller's tenant — that is the ownership check, so do not re-implement it with a
raw `DbContext.Set<T>()` or a bare `FindById`.

**Required single FK:**

```csharp
if (!await UnitOfWork.Repository.ExistsAsync<Supplier>(x => x.Id == vm.SupplierId))
    return Fail("Invalid Supplier");
```

**Optional single FK** — only check when supplied:

```csharp
if (vm.JobId.HasValue &&
    !await UnitOfWork.Repository.ExistsAsync<Job>(x => x.Id == vm.JobId))
    return Fail("Invalid Job");
```

**Many ids from a detail collection** — compare counts. This is the one that is
easy to get wrong:

```csharp
var itemIds = vm.PurchaseOrderDetails
    .Where(d => d.ItemId.HasValue)
    .Select(d => d.ItemId!.Value)
    .Distinct()
    .ToList();

if (itemIds.Count > 0)
{
    var foundCount = await UnitOfWork.Repository.Query<Item>()
        .Where(x => itemIds.Contains(x.Id))
        .Select(x => x.Id)
        .Distinct()
        .CountAsync();

    if (foundCount != itemIds.Count) return Fail("Invalid Item references");
}
```

`ExistsAsync<Item>(x => itemIds.Contains(x.Id))` is **not** equivalent — it returns
true when a single requested id exists, so an unknown id passes alongside a real
sibling. `PurchaseOrderService` currently has that defect; backlog item 3.

Also validate:

- **dependent combinations**, not just each id alone — a Role must belong to the
  supplied Department, a CarModel to the supplied CarMake;
- **self-reference and cycles** for any hierarchy: reject
  `vm.ParentId == vm.Id`, then walk the chain to reject a longer loop;
- **selectability**, when inactive rows exist but must not be chosen — add
  `&& x.IsActive == true` to the predicate.

A client-supplied navigation object is never proof of anything. Read the id and
verify it.

### 3. Reference check before delete

Before removing a row, inventory everything that points at it, from the current
EF model rather than memory, and block with a message naming the blocker.

```csharp
public override async Task<Result> RemoveAsync(int id)
{
    if (await UnitOfWork.Repository.ExistsAsync<Partner>(x => x.BranchId == id))
        return Fail("Cannot delete — branch is referenced by Partners.");

    // InvoiceBase is abstract — EF maps concrete subtypes, so check each one
    if (await UnitOfWork.Repository.ExistsAsync<Invoice>(x => x.BranchId == id))
        return Fail("Cannot delete — branch is referenced by Invoices.");
    if (await UnitOfWork.Repository.ExistsAsync<LimousineInvoice>(x => x.BranchId == id))
        return Fail("Cannot delete — branch is referenced by Limousine Invoices.");
    if (await UnitOfWork.Repository.ExistsAsync<MiscellaneousInvoice>(x => x.BranchId == id))
        return Fail("Cannot delete — branch is referenced by Miscellaneous Invoices.");
    // … EquipmentRentalInvoice, TransportationInvoice, RentalQuotation, PurchaseOrder

    return await base.RemoveAsync(id);
}
```

How to build that list — do not guess:

1. search the model for the FK property name, e.g. `BranchId`;
2. add the semantic references that do **not** carry the obvious name —
   attendance, history, log and report tables that reference the row another way;
3. for an abstract base such as `InvoiceBase`, list every concrete subtype
   separately; a check against the base does not compile to one table;
4. give each blocker its own message so the user knows what to clear first;
5. finish with `base.RemoveAsync(id)` when the base behaviour — soft delete,
   `DeletedAt`, `DeletedBy` — is what you want.

Two more rules:

- **owned children are not blockers.** Detail rows the aggregate owns should
  cascade or be soft-deleted with the parent, per the step 2 configuration. Only
  *foreign* references block.
- **bulk delete validates every target before mutating any target**, so a
  partially applied delete is impossible.

### Where each check belongs, by pattern

| Check | Normal | Master-detail | Master-detail + financial | Settings |
|---|---|---|---|---|
| Duplicate on Add | Business key | Document number, normalized first | Document number, normalized first | Logical key, in payload and in store |
| Duplicate on Update | Exclude self | Exclude self | Exclude self | Not applicable — sync by key |
| Header FK exists | Each FK | Each FK | Each FK plus accounts and fiscal period | Enum keys via `Enum.IsDefined` |
| Detail FK exists | Not applicable | Distinct ids, count compare | Distinct ids, count compare | Not applicable |
| Child belongs to parent | Not applicable | Required | Required | Not applicable |
| Reference check on Delete | Required | Required, plus document state | Blocked when posted, approved, or allocated | Usually delete-by-omission |

**Check:** duplicate checked on Add and on Update excluding self · duplicate scope
is the business key and is backed by a unique index · strings normalized before
comparison · every required FK verified, optional FKs only when supplied ·
collections verified by distinct count, never `Any` · dependent combinations and
hierarchy cycles rejected · no manual tenant or soft-delete predicate added ·
`QueryReport` never used for validation · all references inventoried before
delete with specific messages · abstract bases expanded to concrete subtypes ·
owned children not treated as blockers · bulk delete validates all before
mutating any.

---

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
var pageSize = searchModel.PageSize ?? 20;
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
`pageSize=100000` will attempt it:

```csharp
var pageSize = Math.Clamp(searchModel.PageSize ?? 20, 1, 200);
var pageNo   = Math.Max(searchModel.PageNo ?? 1, 1);
```

**Check:** filter keys match the Angular casing exactly · every value read via
`FilterHelper`, never `filters["x"]` directly · strings trimmed · page number and
size clamped · filters applied before `CountAsync` · unknown filter keys ignored
rather than throwing.

---

## 10. Select and dropdowns

> **Status: Transitional** — the base returns a failure for an empty list, see below

Every entity gets `GET /<Entity>/GetSelect` from the base controller, backed by
`SelectAsync`, which returns `DropdownDto`:

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

## 11. Document numbers (No)

> **Status: Legacy — do not copy the generator**

`EntityBase.No` is the human-readable document number and it is **server-owned**.
The client never sends it and never sees it echoed back from its own request.
`Repository` calls `ICodeCreateService.SetDocumentNumbersAsync` on write, which
walks the entity and its navigations and sets `No` on anything exposing a
writable `No` property.

Numbering is driven by the `SettingsDocumentNumberModel` row: prefix, whether the
branch code is included, whether a year/month segment is included, and the
numeric part length. Per-entity rules live in a `switch` in
`Services/HelperServices/CodeCreateService.cs`. When an entity is not in that
switch it falls back to `{ENTITYNAME}-{Ticks}`.

**What you do for a new entity:** nothing, unless it needs a business-visible
number. If it does, add a case to the switch and the matching settings columns —
and read the four defects below first, because you are extending known-bad code.

**Known defects in the generator.** Do not replicate this approach elsewhere:

```csharp
private async Task<int> GetNextSequenceAsync(string entityName)
{
    …
    int total = await countTask;   // CountAsync() over the whole table
    return total + 1;
}
```

1. **Row count is not a sequence.** Delete any row and the next generated number
   collides with an existing one. There is no uniqueness check afterwards.
2. **Not tenant-scoped.** The count runs over every tenant's rows, so a tenant's
   visible numbering jumps according to other tenants' data.
3. **Race-prone.** Two concurrent inserts read the same count and produce the
   same number.
4. **Branch code hardcoded.** `if (branch) code += "-BR1";` appends the literal
   `BR1` regardless of the record's actual branch.

A correct implementation needs a per-tenant, per-document-type counter row
updated inside the same transaction, or a database sequence, plus a unique index
on `(SubscriptionId, No)`. Backlog item 14.

Also note `SetDocumentNumbersAsync` recurses into **single navigation properties**,
not only child collections. If an aggregate carries a loaded reference to an
existing entity that has a writable `No`, that entity's number can be overwritten
on save. Keep write graphs to owned children only; never attach a fully loaded
navigation object to something you are saving. Backlog item 15.

**Check:** `No` absent from Add and Update VMs · never trusted from the client ·
new numbering rule added to the switch **and** the settings model · unique index
on `(SubscriptionId, No)` where the number is business-visible · write graph
contains owned children only.

---

## 12. Activate and deactivate

> **Status: Transitional** — the base does not validate its targets, see below

`POST /<Entity>/handleActivate` maps to `HandleActiveAsync` and takes:

```csharp
public class ActiveVm
{
    public List<int> Ids { get; set; } = null!;
    public bool IsActive { get; set; }
}
```

The base implementation:

```csharp
public async Task<Result> HandleActiveAsync(ActiveVm activeVm)
{
    var entities = (await UnitOfWork.Repository
        .FindByAsync<TEntity>(a => activeVm.Ids.Contains(a.Id))).ToList();

    entities.ForEach(a => a.IsActive = activeVm.IsActive);
    UnitOfWork.Repository.UpdateRange(entities);
    var result = await UnitOfWork.SaveChangesAsync();
    …
}
```

Tenant and soft-delete scoping come from the repository, so cross-tenant ids
cannot be flipped — they are simply not returned.

**Two defects.** This is a bulk mutation, and the rule for any bulk operation is
that it validates every target before mutating any target:

1. **Partial success reported as success.** Send five ids where three exist and
   the call activates three and returns success. The caller cannot tell.
2. **No null guard.** `Ids` is declared `null!`, so an omitted `Ids` throws inside
   `Contains` rather than returning a validation failure.

Override when the entity's active state matters:

```csharp
public override async Task<Result> HandleActiveAsync(ActiveVm activeVm)
{
    if (activeVm?.Ids is not { Count: > 0 })
        return Fail("No records were supplied.");

    var ids = activeVm.Ids.Distinct().ToList();

    var entities = (await UnitOfWork.Repository
        .FindByAsync<Branch>(a => ids.Contains(a.Id))).ToList();

    if (entities.Count != ids.Count)
        return Fail("One or more records were not found.");

    // Deactivating? Check the same references Delete checks.
    if (!activeVm.IsActive)
        foreach (var id in ids)
            if (await UnitOfWork.Repository.ExistsAsync<Partner>(x => x.BranchId == id))
                return Fail("Cannot deactivate a branch that is referenced by Partners.");

    entities.ForEach(a => a.IsActive = activeVm.IsActive);
    UnitOfWork.Repository.UpdateRange(entities);
    …
}
```

Deactivation is a soft form of removal, so if a row cannot be deleted while
referenced, decide explicitly whether it can be deactivated while referenced.

Backlog item 16.

**Check:** `Ids` null and empty handled · duplicates collapsed · found count equals
requested count before mutating · deactivation rules stated relative to Delete ·
partial success never reported as success.

---

## 13. Pattern 1 — Normal entity

> **Status: Canonical** — reference `Services/BranchService.cs`

Inherit the base and override four things at most: the list query, duplicate
rules on Add and Update, and reference checks on Delete.

**List** — scoped query, filters, count, order, project, page:

```csharp
public override async Task<Results<BranchListVM>> GetManyAsync(ListSmBase searchModel)
{
    var pageNo   = searchModel.PageNo ?? 1;
    var pageSize = searchModel.PageSize ?? 20;
    var filters  = searchModel.Filters ?? [];

    var baseQuery = UnitOfWork.Repository.Query<Branch>().AsNoTracking();

    if (FilterHelper.GetInt(filters, "id") is { } id)
        baseQuery = baseQuery.Where(x => x.Id == id);

    if (FilterHelper.GetString(filters, "search") is { } search)
        baseQuery = baseQuery.Where(x =>
            x.Name.Contains(search) ||
            (x.BranchCode != null && x.BranchCode.Contains(search)));

    var total = await baseQuery.CountAsync();

    var items = await baseQuery
        .OrderByDescending(x => x.Id)
        .ProjectTo<BranchListVM>(Mapper.ConfigurationProvider)
        .Skip((pageNo - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    return new Results<BranchListVM> { /* see block 7 for TotalCount */ };
}
```

`FilterHelper.GetInt` / `GetString` read the `Filters[key]` dictionary the
Angular service sends, so a malformed value is simply absent rather than
silently changing the filter.

**Add** — validate duplicates before the first save:

```csharp
public override async Task<Result> AddAsync(BranchAddVM vm, CancellationToken cancellationToken)
{
    if (await UnitOfWork.Repository.ExistsAsync<Branch>(x => x.Name == vm.Name,
            cancellationToken: cancellationToken))
        return Fail("A branch with this name already exists.");

    var entity = Mapper.Map<Branch>(vm);
    await UnitOfWork.Repository.AddAsync(entity, cancellationToken);
    var result = await UnitOfWork.SaveChangesAsync(cancellationToken);

    return new Result
    {
        IsSuccess = result,
        Id = entity.Id,
        Message = result
            ? Localization.GetString(GeneralMessage.SuccessedToAdd)
            : Localization.GetString(GeneralMessage.FailedToAdd)
    };
}
```

**Update** — load first, exclude self from the duplicate check, map onto the
tracked entity:

```csharp
var entity = await UnitOfWork.Repository.FindByIdAsync<Branch>(vm.Id);
if (entity is null) return Fail("Branch not found.");

if (await UnitOfWork.Repository.ExistsAsync<Branch>(x => x.Name == vm.Name && x.Id != vm.Id))
    return Fail("A branch with this name already exists.");

Mapper.Map(vm, entity);
UnitOfWork.Repository.Update(entity);
```

**Delete** — inventory every reference from the real model, then defer to base:

```csharp
public override async Task<Result> RemoveAsync(int id)
{
    if (await UnitOfWork.Repository.ExistsAsync<Partner>(x => x.BranchId == id))
        return Fail("Cannot delete — branch is referenced by Partners.");

    // InvoiceBase is abstract — check each concrete subtype individually
    if (await UnitOfWork.Repository.ExistsAsync<Invoice>(x => x.BranchId == id))
        return Fail("Cannot delete — branch is referenced by Invoices.");
    …

    return await base.RemoveAsync(id);
}
```

Two things that example teaches: an abstract base such as `InvoiceBase` must be
checked per concrete subtype, and each blocked delete gets its own specific
message so the user knows what to clear.

**Check:** filters before count · `AsNoTracking` on read · deterministic order ·
duplicate scope matches the business key and is tenant-scoped · Update excludes
self · every reference checked before Delete · base called when its remaining
behaviour is right · localized messages.

---

## 14. Pattern 2 — Master-detail, no financial effect

> **Status: Transitional** — reference `Services/VouchersServices/PurchaseOrderService.cs`; its FK validation has a defect, see below

A header plus detail rows, saved as one graph. No journal voucher, no
allocation.

**Order of work in Add and Update:**

1. require the business minimum number of details;
2. validate every header FK;
3. validate every **distinct** detail FK;
4. load the header with its details, tracked;
5. map, recalculate, save once.

```csharp
if (vm.PurchaseOrderDetails?.Any() != true)
    return Fail("At least one purchase order detail is required");

if (!await UnitOfWork.Repository.ExistsAsync<Supplier>(x => x.Id == vm.SupplierId))
    return Fail("Invalid Supplier");

if (!await UnitOfWork.Repository.ExistsAsync<Branch>(x => x.Id == vm.BranchId))
    return Fail("Invalid Branch");

if (vm.JobId.HasValue &&
    !await UnitOfWork.Repository.ExistsAsync<Job>(x => x.Id == vm.JobId))
    return Fail("Invalid Job");
```

Load the aggregate with its children **tracked**, so EF can reconcile:

```csharp
var entity = await UnitOfWork.Repository.Query<PurchaseOrder>(
        e => e.Id == vm.Id, null, true, false, e => e.PurchaseOrderDetails)
    .FirstOrDefaultAsync();

if (entity is null) return Fail("PurchaseOrder not found");

Mapper.Map(vm, entity);

foreach (var detail in entity.PurchaseOrderDetails)
    detail.Recalculate();               // totals are the domain's job

UnitOfWork.Repository.Update(entity);
await UnitOfWork.SaveChangesAsync();
```

**Totals are recalculated on the server.** Never persist a total the client sent.

**Defect to avoid — `Any` is not proof that all ids are valid.** The reference
does this:

```csharp
// WRONG: true when *one* of the requested ids exists
var validItemsExist = await UnitOfWork.Repository.ExistsAsync<Item>(x => itemIds.Contains(x.Id));
if (!validItemsExist) return Fail("Invalid Item references");
```

An unknown id passes as long as one sibling is real. Compare counts instead:

```csharp
var foundCount = await UnitOfWork.Repository.Query<Item>()
    .Where(x => itemIds.Contains(x.Id))
    .Select(x => x.Id)
    .Distinct()
    .CountAsync();

if (foundCount != itemIds.Count) return Fail("Invalid Item references");
```

Backlog item 3.

Also decide and document, per feature:

- omitted vs empty detail collection — preserve, clear, or reject;
- whether a detail id from the client is verified to belong to **this** parent
  and tenant before it is updated or removed;
- status transitions as explicit methods with legal source/target checks, as
  `ToggleApprovalStatusAsync` and `ToggleBillStatusAsync` do.

**Check:** minimum detail count enforced · header and distinct detail FKs
validated by count, not `Any` · aggregate loaded tracked with children · child
ids proven to belong to this parent and tenant · totals recalculated server-side ·
omitted/empty semantics documented · one save, or a transaction when there are
several.

---

## 15. Pattern 3 — Master-detail with financial effect

> **Status: Canonical** — reference `Services/VouchersServices/InvoiceService.cs`

Everything in pattern 2, plus the journal voucher, allocations and related flags
inside **one transaction**. The document, its accounting entries and its
allocations are a single consistency boundary.

```csharp
using var transaction = await UnitOfWork.Context.Database.BeginTransactionAsync();
try
{
    // 1. validate everything first — document types, all FKs, state locks
    // 2. write the document
    await UnitOfWork.SaveChangesAsync();

    // 3. build and write the journal voucher
    await UnitOfWork.SaveChangesAsync();

    // 4. write allocations and recompute related flags
    await UnitOfWork.SaveChangesAsync();

    await transaction.CommitAsync();
    return new Result { IsSuccess = true, Id = entity.Id };
}
catch (Exception ex)
{
    await transaction.RollbackAsync();
    // log ex internally; return a safe business message
    return Fail("The invoice could not be saved.");
}
```

Begin the transaction **before the first mutation**, keep every dependent save
inside it, and roll back the document, voucher, allocations and flag changes
together.

Non-negotiables before any write:

- normalize the document number, then check duplicates;
- calculate all totals on the server;
- resolve linked accounts and the fiscal period;
- enforce document state locks — block Update and Delete when the voucher is
  posted or approved, or when allocations are active, per policy;
- validate **every** allocation target before creating any of them.

Journal voucher rules: debit equals credit; each line has a positive debit or a
positive credit, never both; account, partner, branch, fiscal year, date,
description and document link follow the existing resolver.

Allocation rules: every amount positive and within its target's outstanding
amount; the total within the source's available balance; customer, currency,
branch, document type and open status all match; already-allocated amounts
computed from persisted allocations. Never `continue` past an invalid target —
fail the operation.

Delete follows the approved block/void/reverse policy. Do not remove posted
accounting history.

**Check:** transaction opened before the first mutation and covers every
dependent save · rollback restores document, voucher, allocations and flags ·
debit equals credit · one-sided lines · allocation limits and ownership checked ·
state locks enforced · related flags recomputed from persisted facts · list,
detail, report and export use the same voided/posted/allocation rules · no
per-row query loop.

---

## 16. Pattern 4 — Settings

> **Status: Canonical** — reference `Services/AdministrationsServices/ChargeSettingsService.cs`

A settings screen loads and saves a whole set. Do not force it into record CRUD.

The interface does **not** extend `IService`; it declares just the two real
operations:

```csharp
public class ChargeSettingsService : IChargeSettingsService
{
    private readonly IUnitOfWork<SiGmaDbContext> UnitOfWork;
    private readonly IStringLocalizer<GeneralMessage> Localization;
    private readonly IServiceHelper ServiceHelper;
    …
}
```

Define the **logical key** that identifies one setting. For Charge Settings it is
`(ModuleType, ChargeType, RateType)`. Collapse duplicates in the incoming
payload deliberately, then sync by that key:

```csharp
public async Task<Result> UpdateSettingsAsync(ChargeSettingsAddVM addVm, CancellationToken cancellationToken)
{
    if (addVm == null)
        return new Result { IsSuccess = false, Message = Localization["InvalidRequest"] };

    // Duplicate policy: deterministic last-wins on the logical key
    var distinct = addVm.ChargeSettings
        .GroupBy(x => (x.ModuleType, x.ChargeType, x.RateType))
        .Select(g => g.Last())
        .ToList();

    await ServiceHelper.SyncByKeyAsync<ChargeSettingsListVM, ChargeSettings,
            (ModuleType, ChargeTypes, RateTypeSettings)>(
        distinct,
        vm => (vm.ModuleType, vm.ChargeType, vm.RateType),
        e  => (e.ModuleType,  e.ChargeType,  e.RateType),
        cancellationToken);

    await UnitOfWork.SaveChangesAsync(cancellationToken);

    return new Result { IsSuccess = true, Message = Localization["SavedSuccessfully"] };
}
```

`ServiceHelper.SyncByKeyAsync` lives in
`Services/HelperServices/ServiceHelper.cs`. Read it before relying on it, and
confirm its query scope, delete-by-omission behaviour and save semantics match
the contract you intend.

Decide explicitly and write it down:

| Decision | Options |
|---|---|
| Replacement or patch | Full replacement: an omitted key means delete. Patch: absence means leave alone. Never guess. |
| Empty list | Delete all, only when the API contract says so; otherwise reject. |
| Duplicate keys in payload | Reject as user error, or deterministic last-wins as above. |
| Missing settings on read | Empty response, seeded defaults, or calculated defaults. |

Return settings in a deterministic order so the UI is stable, and add a
tenant-scoped unique index on the logical key so duplicate rows cannot make
behaviour ambiguous. Make the sync atomic: a validation or save failure must
leave the previous set untouched.

Do not add caching for a settings review, and do not use client ids as ownership
or logical-key proof.

**Check:** logical key defined and validated · every key enum checked with
`Enum.IsDefined` · replacement vs patch documented · duplicate policy explicit ·
sync is tenant-scoped and atomic · one `SaveChangesAsync` · deterministic read
order · unique index on the key.

---

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

**Check:** own interface and controller, not `IService` · filter DTO is typed ·
totals computed in the database and returned · ordering deterministic · aggregation
before paging · one query per section · `[Authorize]` present · tenant predicate
explicit where `QueryReport` cannot apply it · same rules across screen, print and
export.

---

## 18. Edge cases

> **Status: Canonical**

Walk this list before calling an entity finished. Mark a row not applicable
rather than skipping it silently.

### Input

| Case | Expected |
|---|---|
| Required string `null`, `""`, or `"   "` | Rejected. `[Required]` alone does not reject whitespace — trim in the service |
| String at and over max length | Accepted at the limit, rejected above it, and the limit matches `HasMaxLength` |
| Number at min, at max, out of range | Boundaries accepted, outside rejected |
| Decimal with more scale than the column | Rounded deliberately, not truncated by chance |
| Negative amount or quantity | Rejected unless the business allows it |
| Enum sent as an undefined number | Rejected via `Enum.IsDefined`; never silently mapped to the default member |
| Nullable enum omitted | Distinct from an invalid value |
| Date `0001-01-01` or `DateTime.MinValue` | Rejected when a real date is required |
| Reversed range, `from > to` | Rejected |
| Equal boundaries, `from == to` | Explicitly allowed or rejected, documented |
| Date-only value near midnight | Calendar date preserved; no UTC conversion. See UI block 17 |
| Leap day, month end | Accepted |
| Duplicate value differing only by case or spacing | Matches the documented normalization rule |

### Records and relationships

| Case | Expected |
|---|---|
| Valid create, valid update | Succeeds |
| Update a missing id | Business failure, no disclosure |
| Update a soft-deleted row | Not found — the repository filters it |
| Update a row from another tenant | Not found, and the response does not reveal that it exists |
| Duplicate on create | Rejected |
| Duplicate on update, unchanged row | **Accepted** — the self-exclusion works |
| FK that does not exist | Rejected |
| FK that exists in another tenant | Rejected, and treated identically to not existing |
| FK that is inactive | Rejected where inactive rows are not selectable |
| Optional FK omitted vs sent as `0` | Omitted is fine; `0` is invalid, not "none" |
| Dependent pair mismatched, e.g. Role not in the given Department | Rejected |
| Self-reference, `ParentId == Id` | Rejected |
| Longer hierarchy cycle A→B→C→A | Rejected |
| Child collection omitted vs empty | Documented and different only if intended |
| Child id belonging to another parent | Rejected |
| Duplicate rows inside one child collection | Rejected or merged, per the documented rule |
| Delete with no references | Succeeds, soft delete applied |
| Delete with each blocking reference | Blocked with a message naming that blocker |
| Delete a row already soft-deleted | Idempotent or a clear failure, not an exception |

### Operational

| Case | Expected |
|---|---|
| Page 1, last page, page past the end | Empty list, not an error |
| `pageSize=0` or a huge `pageSize` | Clamped, per block 9 |
| Zero results | `IsSuccess = true` with an empty list — an empty result is not a failure |
| `TotalCount` on a partial last page | Exact, never derived from `TotalPages × PageSize` |
| Filter key with the wrong casing | Currently ignored — see block 9 trap |
| Malformed filter value | Treated as absent, never as a different filter |
| Duplicate submit of the same create | Blocked by the duplicate rule and by a unique index |
| Two concurrent updates to one row | Behaviour known and documented; last-write-wins is a decision, not an accident |
| Failure between parent save and child save | Transaction rolls both back |
| Failure after the document saves but before the voucher | Transaction rolls back the document too — pattern 15 |
| Bulk activate where some ids are missing | Whole call fails; nothing is flipped — block 12 |
| Unauthenticated request | 401 before any service code runs |
| Report reached with no subscription claim | Must not return other tenants' rows — `QueryReport` caveat, block 17 |
| Export whose second page fails | Whole export fails; no partial file |
| Upload with a wrong extension, oversized, or a spoofed MIME | Rejected server-side, not only in the client |
| Empty lookup for a dropdown | Success with an empty list — block 10 |

### The response contract

| Case | Expected |
|---|---|
| Business failure | `IsSuccess = false` with an actionable localized message |
| Not found, or another tenant's row | Same response shape; no existence disclosure |
| Unexpected exception | Logged internally; a safe message returned |
| Any failure | No stack trace, SQL, connection string, token or file path in the response |
| Partial write | Never reported as success |

**Check:** every applicable row exercised or explicitly marked not applicable ·
boundary values tested at the boundary, not near it · cross-tenant cases behave
identically to not-found · every "documented" decision is actually written down
in the feature's notes or this book.

---

## 19. Backlog

Ordered by risk. Item numbers are stable.

### P1 — correctness and security

| # | Problem | Evidence |
|---|---|---|
| 1 | `TotalCount` not returned | `BranchService.GetManyAsync` sets `TotalPages` only. Angular list components therefore reconstruct a total from page count, which overstates it on a partial last page. Set `TotalCount = total` in every list override |
| 2 | Write VM base carries a tenant | `UpdateBaseVm.SubscriptionId` is client-settable. Its comment says the value is not trusted; remove it from the contract so it cannot be misread |
| 3 | `Any`-style FK validation | `PurchaseOrderService` uses `ExistsAsync<Item>(x => itemIds.Contains(x.Id))`, which passes when only one requested id exists. Compare distinct counts instead |
| 10 | `QueryReport<T>()` fails open | It returns the **unfiltered** set when the subscription claim is missing, and also when `T` lacks `SubscriptionId`/`IsDeleted`. Every other repository method fails closed. Any report path reached without a resolved claim can read across tenants. Make it fail closed, or require an explicit tenant argument |
| 11 | Tenant read from `ClaimTypes.NameIdentifier` | `Repository` parses the subscription id out of the name-identifier claim. It is server-owned so it is not a hole, but overloading that claim is fragile — a future auth change that puts a user id there would silently repoint every tenant filter. Use a dedicated claim |
| 14 | `No` generator is a row count | `CodeCreateService.GetNextSequenceAsync` returns `CountAsync() + 1` over the whole table: collides after any delete, counts across tenants, races under concurrency, and `if (branch) code += "-BR1"` hardcodes the branch segment. Needs a per-tenant counter row inside the transaction, or a sequence, plus a unique index on `(SubscriptionId, No)` |
| 15 | `SetDocumentNumbersAsync` recurses into single navigations | It sets `No` on any reachable object with a writable `No`, so a loaded reference to an existing entity can have its number overwritten on save |
| 16 | `HandleActiveAsync` does not validate targets | Sends five ids, three exist, three are flipped and success is returned. `ActiveVm.Ids` is `null!` so an omitted list throws instead of failing validation |

### P2 — contract consistency

| # | Problem | Evidence |
|---|---|---|
| 12 | Filter dictionaries disagree on casing | `ListSmBase.Filters` uses the default case-sensitive comparer; `SpecificationRequestDto.Filters` uses `StringComparer.OrdinalIgnoreCase`. A wrong-cased key on a list endpoint is silently ignored and the list comes back unfiltered |
| 13 | `SelectAsync` fails on an empty lookup | The base returns `IsSuccess = false` when there are no rows, so Angular cannot distinguish "nothing configured yet" from a real error |

### P2 — contract consistency

| # | Problem | Evidence |
|---|---|---|
| 4 | `Name` max length disagrees across bases | `AddBaseVmWithName` is `[MaxLength(250)]`, `UpdateBaseVmWithName` is `[MaxLength(50)]`, and `BranchConfig` sets `HasMaxLength(100)`. A 120-character name is accepted on create and rejected on update |
| 5 | ListVM over-scope | `BranchListVM` ships `CCEmails` and `Address`, which the grid never displays. Apply block 7 across modules |
| 6 | `ListBaseVm` ships plumbing to every grid | `SubscriptionId`, `GUID`, `IsValid`, `IsChanged`, `No` go out on every row of every list whether displayed or not. Decide which belong in a list contract at all |
| 7 | `FullListVm` duplicates `ListVM` | `BranchFullListVM` and `BranchListVM` are field-identical, so the separate contract buys nothing yet. Either differentiate it or drop it |

### P3 — structure

| # | Problem | Evidence |
|---|---|---|
| 8 | `Result`/`Results` typing | `Results<T>` also exposes the untyped `Result` members; the Angular side mirrors this with `Results<T> extends Result<any>`. Tighten both together |
| 9 | Service base is very large | `Services/Bases/Service.cs` is ~39 KB. Overriding safely requires reading it; document its contract so overrides stop re-implementing invariants by guesswork |
