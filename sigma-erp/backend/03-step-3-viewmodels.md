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
server-owned. `UpdateBaseVm.SubscriptionId` and `UpdateBaseVm.No` currently
exist for backward compatibility only. The frontend may continue sending them
while legacy contracts are being migrated, but the backend must ignore both in
every AutoMapper Update map. The repository still replaces the tenant with the
authenticated subscription as defence in depth. Do not read either property as
permission to accept a tenant or record number from the client. Remove both
properties from the Update contract after all consumers have migrated; keep
them on Detail/List DTOs when the UI needs to display them.

Validation lives on the write VMs using DataAnnotations, and must agree with
step 2:

```csharp
[Required][MaxLength(100)] public string Name { get; set; } = null!;
[Range(0, double.MaxValue)] public decimal Amount { get; set; }
```

**Check:** six files present · correct base per direction · feature write VMs
declare no server-owned fields · inherited transitional `SubscriptionId` and
`No` are ignored by every Update map · `[MaxLength]` matches `HasMaxLength` ·
required/nullable matches the entity and the Angular model · Detail carries only
what the editor needs · List follows block 7.

---

