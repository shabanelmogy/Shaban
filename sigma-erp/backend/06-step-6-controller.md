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

**Base routes.** `SiGmaControllerBase` exposes `POST`, `PUT`, `DELETE ?id=`,
`GET` (list), `GET GetById/{id}`, `GET GetByWithNavigationsId/{id}`,
`GET GetAllWithNavigations`, `GET GetSelect`, and `POST handleActivate`. There is
no root `GET /{id}`: Angular detail calls use `GetByWithNavigationsId/{id}`.

**Check:** inherits `SiGmaControllerBase` · no re-declared base endpoints · no
business logic in the controller · custom routes match the Angular service ·
`[Authorize]` not weakened · no raw exception, SQL or path in a response.

---

