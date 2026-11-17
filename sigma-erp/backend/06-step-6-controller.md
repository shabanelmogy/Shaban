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
| `POST /<Entity>/CheckUnique` | `CheckUniqueAsync` |
| `PUT /<Entity>` | `UpdateAsync` |
| `DELETE /<Entity>?id=` | `RemoveAsync` |
| `GET /<Entity>/GetById/{id}` | `DetailAsync` |
| `GET /<Entity>` `[FromQuery] ListSmBase` | `GetManyAsync` |
| `POST /<Entity>/handleActivate` | `HandleActiveAsync` |
| `GET /<Entity>/GetAllWithNavigations` | `GetAllWithNavigationsAsync` |
| `GET /<Entity>/GetByWithNavigationsId/{id}` | `DetailWithNavigationsAsync` |
| `GET /<Entity>/GetSelect` | `SelectAsync` |

A single-row settings controller derives from `SingleRowSettingsControllerBase` instead, which
adds `GET /<Entity>/Mine` and `PUT /<Entity>/Mine` (block 16).

Only `POST` passes the request's `CancellationToken` to the service (D5-2 deferred, block 5).

`ToActionResult` maps `Result.IsSuccess` to 200 and a failure to
`Result.StatusCode` or 400, so services return `Result`/`Results<T>` and never
touch HTTP.

This is exactly what the Angular `BaseService` expects — `GetSelect` feeds
`getSelectList()`, `GetByWithNavigationsId/{id}` feeds `getByIdWithNavigation()`,
and the query string is `Filters[key]=value`. Adding a custom route means adding
a matching Angular method, so keep both sides in one change.

**Custom route parameter names.** In MVC attribute routes, do not use reserved
route values such as `action`, `controller`, `area`, `page` or `handler` for a
business discriminator. For example, use `[HttpPost("{identityAction}")]` and
bind an existing parameter explicitly with
`[FromRoute(Name = "identityAction")] string action`. This preserves a public
URL such as `/User/18/identity/impersonate` while avoiding a collision with the
MVC method name. A route listed in Swagger does not establish that the requested
literal path matches it. Diagnose routing separately from authorization and
service validation; any live probes remain subject to workspace execution rules.
See [ASP.NET Core reserved routing names](https://learn.microsoft.com/en-us/aspnet/core/mvc/controllers/routing?view=aspnetcore-10.0#reserved-routing-names).

**Static-file guards and API roots.** A legacy upload folder may share a
controller name. Match its storage-path position rather than denying every
occurrence of that name. Customer profile photos use a nested tenant folder
`/tenant/individualPartner/…`; `CustomerProfileMediaPath` uses
`PrivateUploadPath.IsNestedStaticRequest` for that legacy folder, preserving the
`/IndividualPartner` API root and its actions. Canonical private folders keep
their existing guards. Reuse shared decoding, separator and case normalization;
cover both permitted API paths and denied encoded/nested file paths. This
distinction does not grant anonymous API access or relax file ownership checks.

Add an explicit action only for a genuinely custom operation:

```csharp
[HttpPut("{id}/SalaryPackage")]
public async Task<IActionResult> ReviseSalaryAsync(int id, StaffSalaryRevisionVM vm)
    => ToActionResult(await Service.ReviseSalaryAsync(id, vm));
```

**Endpoint inventory.** Trace the controller's actual HTTP attributes and
inherited actions. Record each route, its catalogue grant and the response
from the complete filter/action path. Service-only methods such as
`GetManyWithNavigationsAsync`, `AddListAsync` and `UpdateListAsync` have no HTTP
route through this base. If an exposed action is excluded from the grant
catalogue, record the ordinary-user authorization response separately from
any unsupported-operation response returned when an administrator reaches
the service.

**Check:** inherits `SiGmaControllerBase` · no re-declared base endpoints · no
business logic in the controller · custom routes match the Angular service ·
`[Authorize]` not weakened · no raw exception, SQL or path in a response.

---

