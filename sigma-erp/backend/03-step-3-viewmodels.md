## 3. Step 3 — ViewModels

> **Status: Canonical**

Six files per entity in `SiGma.ViewModels/ViewModels/<Entity>/`:

| File | Base | Direction |
|---|---|---|
| `<Entity>AddVM.cs` | `AddBaseVm` / `AddBaseVmWithName` | client → server, create |
| `<Entity>UpdateVM.cs` | `UpdateBaseVm` / `UpdateBaseVmWithName` | client → server, update |
| `<Entity>ListVM.cs` | `ListBaseVm` / `ListBaseVmWithName` | server → grid |
| `<Entity>DetailVM.cs` | `DetailBaseVm` / `DetailBaseVmWithName` | server → editor |
| `<Entity>FullListVm.cs` | `ListBaseVm…` | only for a **named** second consumer (export or picker) whose shape differs from the ListVM, recorded in the contract; otherwise not created (backlog 7) |
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
UpdateBaseVm   // Id only
ListBaseVm     // SubscriptionId, Id, IsActive, IsValid, IsChanged, No, GUID, CreatedAt, CreatedBy
DetailBaseVm   // as ListBaseVm plus IsDeleted
SelectListBaseVm // Value, Text, LocalizedText — dropdowns
```

**Add and Update carry client-editable inputs only.** Tenant, record number,
audit values, delete flags, approval status and calculated totals are
server-owned. `UpdateBaseVm` carries only `Id` (2026-09-30): `SubscriptionId` and `No` were
removed from the Update contract. Older clients may still send them; unknown JSON members are
ignored, and the repository stamps the tenant from the authenticated principal. Keep both on
Detail/List DTOs when the UI displays them. A user-entered reference number that happens to be
called `No` (Cash Deposit, Card Transaction Bank Transfer and Purchase Return detail rows) is a
client input and is declared explicitly on that feature's Add **and** Update VM.

Validation lives on the write VMs using DataAnnotations, and must agree with
step 2:

```csharp
[Required][MaxLength(100)] public string Name { get; set; } = null!;
[Range(0, double.MaxValue)] public decimal Amount { get; set; }
```

An Angular minimum must have the matching server boundary. Shared partner billing Add/Update
VMs require nonnegative credit period, credit limit, surcharges and customer discount;
nullable surcharges remain optional. For a decimal bound use a decimal-typed `Range` with
invariant string limits, rather than a floating-point maximum or an invented business cap.

Date rules belong on the write VMs too: shared customer document issue/expiry uses
`DateAfter`, and Individual birth date uses `NotFutureDate`. Do not repeat those checks in
Add/Update services reached through API model validation. A custom import boundary that
bypasses these VMs must apply the equivalent validation explicitly.
Request attributes are enforced at the API boundary; callers bypassing model validation need
their own equivalent boundary validation.

**Customer import boundary (2026-10-01).** Reuse the ordinary write VM's validation metadata
for matching CSV fields, including billing minima and persisted length limits. Check enum
text with both TryParse and IsDefined before mapping. A required import date must distinguish
an omitted/default value from a real calendar day; future-date validation alone is insufficient.
Shared customer document VMs require type, number, issue date and expiry date; the nullable
enum input lets Required reject a missing type. Issuer and path remain optional (UI block 18).
Company address columns map to the owned address and supplied country names resolve against
the tenant's live lookup. Do not accept input columns that the writer silently discards.

**Check:** six files present · correct base per direction · feature write VMs
declare no server-owned fields · inherited transitional `SubscriptionId` and
`No` are ignored by every Update map · `[MaxLength]` matches `HasMaxLength` ·
required/nullable matches the entity and the Angular model · Detail carries only
what the editor needs · List follows block 7.

### Server-owned values and enum inputs (G4, G13, 2026-10-01)

A value the user does not edit is not chosen by the client: category, type, status, numbering,
tenant, audit. Either the Add/Update VM leaves it out, or the profile sets it
(`ForMember(d => d.Type, o => o.MapFrom(_ => ContactType.Customer))`, reference `ContactProfiler`). Write an enum default by name (`ContactType.Customer`), never as a bare `0`:
`ContactType` 0 is `Staff`.

System.Text.Json accepts an undefined number for an enum, so every enum property of an
Add/Update VM carries `[EnumDataType(typeof(T))]`; model validation rejects the value before
the service runs. Required, length and format rules live on the VM (`[Required]`,
`[MaxLength]`, `[EmailAddress]`), and the service does not repeat them by hand. The service
keeps the business rules only: duplicates, references, ownership, dates and state.

**Request text is trimmed on read (2026-10-01).** `TrimIncomingStrings` (`SiGma.ServerAPI/Extensions`,
registered in `Program`) trims every string of a request body as it is deserialized:

- **Empty text:** it becomes null on a nullable property (`string?`) and stays "" on a non-nullable one.
- **Passwords:** a property whose name contains "Password" is left as sent.
- **Responses:** not touched.

Services therefore write no `Trim()`, `Normalize` or `Optional` helpers. It is not done in
AutoMapper, because the duplicate checks run before the map and must compare trimmed values.

---
