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
            CreateMap<BranchUpdateVM, Branch>()
                // Transitional compatibility: these server-owned properties
                // still exist on UpdateBaseVm but must never reach the entity.
                .ForMember(d => d.SubscriptionId, o => o.Ignore())
                .ForMember(d => d.No, o => o.Ignore());

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
  not belong on the write VM. Removing it from the VM is the final fix; `Ignore()`
  otherwise hides the design problem. The only canonical transitional exception
  is `UpdateBaseVm.SubscriptionId` and `UpdateBaseVm.No`: every Update map must
  ignore both until they are removed from the shared contract. Extra ignores
  require a documented compatibility reason and a removal plan.
- add `ForMember` only for a genuine shape difference, such as flattening a
  navigation for display:

```csharp
CreateMap<Vehicle, VehicleListVM>()
    .ForMember(d => d.BranchName, o => o.MapFrom(s => s.Branch!.Name));
```

Profiles are discovered by assembly scan, so no registration step.

**Check:** four maps · no `ReverseMap` · Update ignores inherited
`SubscriptionId` and `No` while they remain on `UpdateBaseVm` · no other
unnecessary `Ignore` · `ForMember` only for a real difference · every property
the list displays is mapped or projected · nothing maps onto tenant, audit,
`No`, delete flags or persisted totals.

---

