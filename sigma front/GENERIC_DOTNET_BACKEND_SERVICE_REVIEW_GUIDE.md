# Generic .NET Backend Service Review Guide

This guide is a reusable review plan for any CRUD-style .NET backend service.
It is intended for the existing Sigma backend pattern:

- controller derived from `SiGmaControllerBase`;
- `IService<...>` and a feature service derived from `Service<...>`;
- `AddVM`, `UpdateVM`, `DetailVM`, and `ListVM` contracts;
- repository and `UnitOfWork`;
- `Result<T>` / `Results<T>` response wrappers;
- AutoMapper profiles;
- EF Core entity configuration.

The goal is correctness, data safety, and useful query performance without
introducing a new architecture, a new validation framework, or unnecessary
abstractions.

Use the real service name in place of `Entity` in the examples.

### Security precedence

Tenant isolation, authorization, server-owned fields, and data-integrity rules
override every frontend sample and feature-specific guide. A UI contract may
reflect a legacy transport field, but it can never make that field trusted.

For legacy Update ViewModels that still inherit `SubscriptionId` or `No`:

- treat the supplied value only as an untrusted assertion;
- compare `SubscriptionId` with the tenant-owned existing record;
- never use it to select the tenant or move ownership;
- never map it over the persisted `SubscriptionId`, generated `No`, audit
  fields, deletion fields, calculated totals, or immutable status;
- prefer removing it from a future purpose-built Update contract, but do not
  redesign all base ViewModels during one service fix.

## 1. Review rules

### Preserve the current application pattern

Keep the existing:

```text
Controller -> IService -> Service -> Repository/UnitOfWork -> EF Core
                         |
                         -> AutoMapper
```

Do not introduce CQRS, MediatR, a repository replacement, a generic
validation framework, a new result type, or a new exception pipeline for one
service. Add a small private helper or one focused override when that is
enough.

### Fix in this order

1. Tenant isolation, authorization, and data corruption.
2. Required-field and foreign-key correctness.
3. Create/update/delete business rules.
4. Response and pagination correctness.
5. Query performance that is supported by the actual screen and data shape.
6. Naming and cosmetic cleanup.

Do not make a broad rename or database migration while reviewing one service
unless the change is explicitly approved.

### Review-only versus implementation

The default review deliverable is:

- evidence-backed findings;
- severity and affected file;
- the smallest safe fix;
- acceptance scenarios for the owner to run.

Apply backend changes only when implementation is requested. The caller who
owns the repository runs the build, tests, and database verification after the
review.

## 2. Files to inspect

Start with the smallest complete slice of the service:

```text
SiGma.ServerAPI/Controller/EntityController.cs
SiGma.Business/IServices/IEntityService.cs
SiGma.Business/Services/.../EntityService.cs
SiGma.ViewModels/ViewModels/Entity/EntityAddVm.cs
SiGma.ViewModels/ViewModels/Entity/EntityUpdateVm.cs
SiGma.ViewModels/ViewModels/Entity/EntityDetailVm.cs
SiGma.ViewModels/ViewModels/Entity/EntityListVm.cs
SiGma.Business/MapperConfig/EntityProfiler.cs
SiGma.DataAccess/Configuration/EntityConfig.cs
SiGma.Helpers/Models/.../Entity.cs
```

Then inspect only the directly referenced models and services:

- child collection ViewModels and entities;
- foreign-key lookup entities;
- report or export DTOs;
- file-upload endpoint/service, if the feature uploads documents;
- existing frontend service/models, if the API is being consumed by a screen;
- existing documentation or Swagger comments.

Search for the actual base implementations before assuming their behavior:

- `SiGmaControllerBase`;
- `Service<...>`;
- `Repository.Query`;
- `FindByIdAsync`, `GetByIdDeepAsync`, and dropdown helpers;
- the `Result` and `Results<T>` classes;
- tenant and soft-delete handling in the repository and `DbContext`.

## 3. Contract inventory

Record the service contract before changing it.

| Operation | Route | Request | Response | Current behavior |
|---|---|---|---|---|
| List | `GET /Entity` | `ListSmBase` | `Results<EntityListVm>` |  |
| Detail | `GET /Entity/GetByWithNavigationsId/{id}` | `id` | `Result<EntityDetailVm>` |  |
| Select | `GET /Entity/GetSelect` | none | `Results<DropdownDto>` |  |
| Add | `POST /Entity` | `EntityAddVm` | `Result` |  |
| Update | `PUT /Entity` | `EntityUpdateVm` | `Result` |  |
| Delete | `DELETE /Entity?id={id}` | `id` | `Result` |  |

Confirm all of the following:

- route names and HTTP verbs match the existing controller base;
- the frontend sends the same property names and casing;
- request and response wrappers are consistent;
- `id`, `no`, `subscriptionId`, and audit fields are not trusted from the
  client when the backend owns them;
- nested objects and collections have the same names in Add, Update, and
  Detail contracts;
- enum values are serialized consistently. If the project uses numeric
  enums, document their numeric values; do not silently change to strings.

## 4. Required fields and nullability

Make the nullable contract express the real business rule.

### Basic rules

- Use `string?` for an optional value and `string` plus `[Required]` for a
  required value.
- Prefer `DateTime?` plus `[Required]` for a required date. `[Required]` on a
  non-nullable `DateTime` does not reject `DateTime.MinValue`.
- Use `int?` plus `[Required]` for a required foreign key so a missing value
  is distinguishable from a real ID.
- Do not mark a field required only because the database column is non-nullable;
  verify whether the application supplies a default.
- Keep Add and Update rules aligned unless the difference is deliberate
  (for example, an immutable number required only on Add).
- Keep database nullability, ViewModel nullability, AutoMapper behavior, and
  UI validation aligned.

### Required-field matrix

Create this table for every service:

| Field | Add | Update | Detail/List | Type | Max length | Rule source | Error |
|---|---:|---:|---:|---|---:|---|---|
| `Name` | yes | yes | yes | `string` | 100 | VM + service | `Name is required.` |
| `BranchId` | yes | yes | yes | `int?` | — | VM + FK check | `Branch not found.` |
| `Code` | yes | no/yes | yes | `string?` | 50 | VM + duplicate check | `Code already exists.` |

Do not leave a blank required rule as “handled by the UI”. The API must
remain safe when called from Swagger, imports, scripts, or another client.

## 5. Field validation

Use the simplest validation that correctly expresses the rule.

### Recommended attributes

```csharp
public sealed class EntityAddVm : AddBaseVm
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string? Name { get; set; }

    [Required]
    public int? BranchId { get; set; }

    [EmailAddress]
    [StringLength(150)]
    public string? Email { get; set; }
}
```

Use service validation for rules that need a database or more than one field:

```csharp
private async Task<string?> ValidateBusinessRulesAsync(
    EntityAddVm vm,
    CancellationToken cancellationToken = default)
{
    if (string.IsNullOrWhiteSpace(vm.Name))
        return "Name is required.";

    if (vm.BranchId is { } branchId &&
        !await UnitOfWork.Repository.ExistsAsync<Branch>(
            x => x.Id == branchId,
            cancellationToken: cancellationToken))
    {
        return "Branch not found.";
    }

    return null;
}
```

Keep the existing service result style:

```csharp
private static Result Fail(string message) => new()
{
    IsSuccess = false,
    Message = message
};
```

### Regex policy

Use regex only for a stable syntactic format. Do not use a regex to implement
business logic or to reject valid local-language text.

| Field type | Preferred rule |
|---|---|
| Name, address, description | `Required`/`StringLength`; do not use an ASCII-only regex |
| Email | `[EmailAddress]` plus a length limit |
| Internal code/number | `^[A-Za-z0-9][A-Za-z0-9._/-]{0,49}$` when this is the actual format |
| Phone | `^\+?[0-9][0-9 ()-]{6,19}$` only when the business accepts those formats |
| `yyyy-MM` text | `^\d{4}-(0[1-9]|1[0-2])$` |
| IBAN | Normalize spaces first, then validate country-specific length/checksum |
| Decimal amount | Numeric type, range, and precision; never regex |
| Date | `DateTime`/`DateOnly` parsing and range rules; never regex |
| Document/license number | Use a documented format per document type; otherwise length only |

Important regex details:

- `[Required]` is still needed; a regular expression may allow an empty
  value.
- Trim before checking length and duplicates.
- Use an explicit ASCII range only when the field is intentionally ASCII.
- Avoid `\w` when the accepted character set matters.
- Avoid a universal phone or document-number regex across countries.
- Normalize the value once and use the normalized value for duplicate checks.

## 6. Enum and date validation

Validate enum values explicitly. An integer can bind to an undefined enum
value unless the ViewModel or service rejects it.

```csharp
if (!Enum.IsDefined(typeof(EntityStatus), vm.Status))
    return "Status is invalid.";
```

For dates, define the rule and its boundary:

- date of birth cannot be in the future;
- start date cannot be after end date;
- confirmation date cannot be before joining date;
- issue date cannot be after expiry date;
- a month string must represent a real month;
- date-only fields should not be shifted by local timezone conversion.

Use UTC for timestamps and explicit date-only handling for business dates.
Do not add timezone infrastructure for a feature that only stores a local
calendar date; use the project’s existing convention.

## 7. Business logic review

For each operation, write the rule before writing code.

### Add

- required fields are present and meaningful, not only non-null;
- all foreign keys exist in the current subscription and are not deleted;
- duplicate values are checked using the service’s real uniqueness scope;
- immutable/audit/tenant values are assigned by the server;
- nested rows belong to the new parent and are validated;
- empty child rows are ignored or rejected consistently;
- defaults are assigned once, in one place.

### Update

- the target exists in the current subscription and is not deleted;
- immutable values (`SubscriptionId`, generated number, created fields) stay
  unchanged;
- duplicate checks exclude the current ID;
- all changed foreign keys are revalidated;
- child collections use a clear policy: replace, merge, or append;
- removed child rows are soft-deleted if that is the project convention;
- an update cannot create a self-reference or invalid hierarchy;
- the operation does not partially save the parent before a child failure.

### Delete

- the target is tenant-scoped;
- references that make deletion unsafe are checked;
- soft-delete behavior is intentional and consistent;
- the response explains why deletion was refused;
- deleting a parent does not silently orphan children.

### Cross-record rules

Check rules such as:

- only one active/default row per parent;
- no overlapping date ranges;
- no duplicate child type for the same parent;
- totals equal the sum of detail rows;
- a reporting/parent ID cannot equal the current ID;
- inactive records cannot be selected for new transactions unless allowed.

Do not rely on a UI dropdown to enforce these rules.

## 8. Foreign keys, tenant isolation, and security

Every lookup ID from a request is untrusted input.

Review that:

- `Repository.Query`, `ExistsAsync`, and `FindByIdAsync` apply the current
  subscription and soft-delete rules;
- direct `DbContext.Set<T>()` queries do not bypass those rules;
- a child ID cannot be attached to a different parent;
- a foreign key cannot point to another subscription;
- authorization is present on the controller or inherited base;
- error messages do not expose another tenant’s data or internal SQL;
- server-owned values are not accepted from `subscriptionId`, `createdBy`,
  `isDeleted`, or similar request properties.

When a custom query must use `DbContext.Set<T>()`, add the same tenant and
soft-delete predicates explicitly and document why the repository helper
cannot be used.

### Custom override parity

Overriding a base CRUD method also overrides its security behavior. Before
accepting any custom `AddAsync`, `UpdateAsync`, `UpdateListAsync`,
`RemoveAsync`, detail, list, report, or export implementation, compare it with
the current base method and preserve every applicable invariant.

For a custom Update:

1. load the target through `Repository.Query<TEntity>` or add explicit current
   tenant and soft-delete predicates;
2. reject a legacy client `SubscriptionId` that does not match the loaded
   record;
3. map only mutable business fields;
4. restore `SubscriptionId`, generated `No`, created/audit values, deletion
   state, and other server-owned fields after mapping;
5. validate nested IDs against the current parent and tenant;
6. validate every child before the first save and keep the operation atomic
   when partial persistence is unsafe.

Never use this shape:

```csharp
var entity = await Context.Set<TEntity>()
    .FirstOrDefaultAsync(x => x.Id == vm.Id);
Mapper.Map(vm, entity);
```

An ID-only `DbContext.Set<T>()` lookup bypasses the repository tenant and
soft-delete contract, and unrestricted mapping can change ownership. A custom
override is not approved merely because the generic base service is secure.

Review checklist:

- [ ] Every overridden CRUD method was compared with its current base method.
- [ ] Target lookup is tenant- and soft-delete-scoped.
- [ ] Client tenant/number/audit values are rejected or ignored, never trusted.
- [ ] Server-owned values are restored after AutoMapper.
- [ ] Bulk and nested updates apply the same rules to every item.

## 9. Query and pagination improvements

Improve queries only after identifying the screen’s actual fields.

### Safe list-query shape

```csharp
public override async Task<Results<EntityListVm>> GetManyAsync(
    ListSmBase searchModel)
{
    const int defaultPageSize = 20;
    const int maxPageSize = 200;

    var pageNo = Math.Max(1, searchModel.PageNo ?? 1);
    var pageSize = Math.Clamp(
        searchModel.PageSize ?? defaultPageSize,
        1,
        maxPageSize);
    var filters = searchModel.Filters ?? [];

    var query = UnitOfWork.Repository
        .Query<Entity>()
        .AsNoTracking();

    if (FilterHelper.GetString(filters, "search") is { } rawSearch)
    {
        var search = rawSearch.Trim();
        if (search.Length > 0)
        {
            query = query.Where(x =>
                x.Name.Contains(search) ||
                (x.No != null && x.No.Contains(search)));
        }
    }

    if (FilterHelper.GetBool(filters, "isInactive") is { } isInactive)
        query = query.Where(x => x.IsInactive == isInactive);

    var totalCount = await query.CountAsync();

    var entities = await query
        .OrderByDescending(x => x.Id)
        .Skip((pageNo - 1) * pageSize)
        .Take(pageSize)
        .Select(x => new EntityListVm
        {
            Id = x.Id,
            No = x.No,
            Name = x.Name,
            IsInactive = x.IsInactive
        })
        .ToListAsync();

    return new Results<EntityListVm>
    {
        IsSuccess = true,
        Entities = entities,
        PageNo = pageNo,
        PageSize = pageSize,
        TotalCount = totalCount,
        TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
    };
}
```

Adapt the example to the actual base method signature. If the current
interface does not accept a cancellation token, do not redesign the entire
base service for one feature; add that improvement consistently when the
shared base is next changed.

### Query checklist

- start from a tenant- and soft-delete-scoped repository query;
- apply filters before `Count` and pagination;
- trim blank strings and ignore empty filters;
- use a stable deterministic order, normally `Id` as a tie-breaker;
- enforce a safe page-size maximum;
- return both `TotalCount` and `TotalPages`;
- project only list fields;
- avoid loading documents, salary collections, or deep navigations for a
  grid unless the grid displays them;
- use the detail endpoint for deep navigations;
- avoid N+1 lookups inside a row loop;
- use `AsNoTracking` for read-only list/detail queries;
- use date ranges that can use an index (`>= from && < toExclusive`);
- do not call `.ToList()` before filtering, sorting, or paging;
- do not use `.ToLower()`/`.ToUpper()` on a database column unless the
  project deliberately accepts the index cost;
- add an index only when the filter/order is common and the query plan or
  production evidence supports it.

### Search behavior

Document what `search` searches:

- code/number;
- name;
- email;
- phone;
- related lookup name.

If related fields are included, use a translated query or a deliberate join.
Do not load the entire table into memory to perform a search.

## 10. Child collections and nested objects

For every nested object/collection, document:

| Question | Required answer |
|---|---|
| Is the child optional? |  |
| Is an empty collection different from omitted? |  |
| Does Update replace, merge, or append? |  |
| Can a child be removed? |  |
| Are duplicate child types allowed? |  |
| Which fields are required? |  |
| Is the child tenant-scoped? |  |

Validate child IDs and parent ownership before mapping.

Do not silently accept a child row with an ID that belongs to another parent.
Do not save the parent and then discover a child error. When the existing
base service saves parent and collections separately, either validate every
child before the first save or add a small transaction around the existing
operations. Keep the transaction local to the service; do not introduce a
new unit-of-work abstraction.

### File, export, and payment-data security

For uploads, validate server-side authorization, current tenant and parent
ownership, maximum size, allowed extension, MIME type, and file signature. Use
a server-generated storage name and define replacement, failed-parent-save,
orphan cleanup, removal, and permanent deletion behavior. An Angular
`accept` attribute or extension check is only early feedback.

For reports/exports, reapply permission, tenant/soft-delete scope, approved
filters, sensitive-column rules, result-size limits, and cancellation. Any
failed page/request fails the whole export; never return a successful partial
file.

Collect CVV only when an approved payment flow needs it for immediate
authorization. Never persist CVV after authorization, even encrypted; never
return it in Detail/ViewModels or place it in logs, routes, query strings,
exports, analytics, or debug output. Prefer an approved payment-provider token
over storing card data.

## 11. Error and response contract

Use the project’s existing `Result` wrappers and HTTP status conventions.
In Sigma, set `Result.StatusCode` only when a specific status is intentional
and let `SiGmaControllerBase.ToActionResult` translate it. Do not return a new
controller response shape for one service.

Return:

- `400` for invalid input or a failed business rule under the current
  convention;
- `404` when the current endpoint convention intentionally distinguishes a
  tenant-scoped missing target without disclosing another tenant;
- `409` for a genuine uniqueness/conflict rule only when the project already
  distinguishes it;
- `500` only for unexpected failures handled by the existing pipeline.

Messages should identify the field or rule:

```text
Name is required.
Branch not found.
Code already exists.
ExpiryDate must be on or after IssueDate.
Cannot delete Entity because it is referenced by Invoice.
```

Do not return raw exception text, SQL, stack traces, or another tenant’s IDs.
Keep messages localizable if the existing service uses localization.

## 12. Edge-case matrix

Review at least these cases for every service:

### Input edges

- request is `null` or the body is empty;
- required string is `null`, empty, or whitespace;
- minimum and maximum lengths;
- one character beyond every maximum;
- invalid enum number and invalid enum string;
- missing optional object;
- omitted collection versus empty collection;
- child collection containing a `null`/malformed row;
- negative, zero, maximum, and excessive decimal values;
- `DateTime.MinValue`, future date, and invalid date order;
- duplicate values with leading/trailing spaces and different casing;
- malformed query filters and invalid page number/page size.

### Relationship edges

- missing foreign key;
- foreign key does not exist;
- foreign key exists in another subscription;
- soft-deleted foreign key;
- child ID belongs to another parent;
- self-referencing hierarchy;
- duplicate default/primary child;
- delete while referenced;
- update that removes all child rows.

### Operational edges

- empty result set;
- last page after deleting its final row;
- concurrent edit of the same record;
- timeout/cancellation during a list or save;
- duplicate save request;
- file path that is missing or points outside the allowed storage area.

Only add concurrency tokens, idempotency keys, or background processing when
the service has a demonstrated need. Record them as a follow-up otherwise.

## 13. Minimal implementation checklist

Before declaring a service ready:

- [ ] Add and Update ViewModels express required versus optional fields.
- [ ] Required strings reject whitespace.
- [ ] Length and numeric precision/range rules are defined.
- [ ] Regex is used only for a documented stable format.
- [ ] Enums reject undefined values.
- [ ] Date rules have explicit boundaries.
- [ ] Every request foreign key is checked in the current subscription.
- [ ] Duplicate checks use the correct scope and exclude the current ID.
- [ ] Immutable and server-owned fields cannot be changed by the client.
- [ ] Nested children have a documented replace/merge/delete policy.
- [ ] Self-reference and overlapping/default rules are handled.
- [ ] Delete checks business references and preserves soft-delete behavior.
- [ ] List query filters before count and paging.
- [ ] List query has stable ordering and a bounded page size.
- [ ] List response includes `TotalCount` and `TotalPages`.
- [ ] Grid query projects only fields required by the grid.
- [ ] Detail query loads only the navigations needed by the detail screen.
- [ ] No N+1 query or in-memory full-table filtering exists.
- [ ] Error messages identify the failed rule and use the existing result type.
- [ ] No tenant, audit, or soft-delete values are trusted from the request.
- [ ] Existing controller/service/repository patterns remain intact.

## 14. Review output template

Use this format in the review report:

```markdown
# <Entity> Backend Review

## Scope
- Controller:
- Service:
- ViewModels:
- Entity/configuration:
- Mapper:

## Findings

| Severity | File | Area | Finding | Minimal fix |
|---|---|---|---|---|
| High | `...` | Validation | ... | ... |

## Contract decisions needed
- ...

## Acceptance scenarios
- [ ] ...

## Deferred improvements
- ...
```

### Severity definitions

- **Critical** — tenant/security breach, data loss, or a save that can corrupt
  records.
- **High** — required field, FK, duplicate, delete, or business rule is
  incorrect.
- **Medium** — incorrect pagination/response, avoidable N+1, expensive list
  query, or incomplete edge-case handling.
- **Low** — naming, documentation, or cleanup that does not change behavior.

## 15. Senior review standard

A service is ready when its contract is explicit, invalid requests fail
predictably, cross-record rules are enforced server-side, queries return the
correct page and count for the current tenant, and the implementation still
looks like the surrounding codebase.

Prefer one clear validation helper and one clear query over many layers of
indirection. Make the smallest change that closes the finding, document any
deliberate limitation, and leave larger architectural improvements as
separate follow-up work.
