## 4. Step 4 — AutoMapper profile

> **Status: Canonical**

One profile per entity, four maps, nothing else. Reference: `SiGma.Business/MapperConfig/BranchProfiler.cs`
(four maps, no `ReverseMap`, no `Ignore`).

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
  that is how a client value reaches a server-owned column. 213 of 320 profiles still use it
  (2026-10-01, backlog 21); replace it with explicit one-way maps when the profile's screen is
  reviewed, never in bulk.
- **no defensive `Ignore()` chains.** If a property must not be written, it does
  not belong on the write VM. Removing it from the VM is the final fix; `Ignore()`
  otherwise hides the design problem. `UpdateBaseVm` no longer carries `SubscriptionId` or `No` (2026-09-30), so an Update map
  needs no ignore for them. Existing ignores for those two are harmless and are removed when the
  profile is next touched. Any other ignore requires a documented compatibility reason and a
  removal plan.
- add `ForMember` only for a genuine shape difference, such as flattening a
  navigation for display:

```csharp
CreateMap<Vehicle, VehicleListVM>()
    .ForMember(d => d.BranchName, o => o.MapFrom(s => s.Branch!.Name));
```

Profiles are discovered by assembly scan, so no registration step.

**Check:** four maps · no `ReverseMap` · no
unnecessary `Ignore` · `ForMember` only for a real difference · every property
the list displays is mapped or projected · nothing maps onto tenant, audit,
`No`, delete flags or persisted totals.

---

