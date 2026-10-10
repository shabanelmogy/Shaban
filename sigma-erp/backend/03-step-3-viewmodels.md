## 3. Step 3 — ViewModels

> **Status: Canonical**

Six files per entity in `SiGma.ViewModels/ViewModels/<Entity>/`:

| File | Base | Direction |
|---|---|---|
| `<Entity>AddVM.cs` | `AddBaseVm` / `AddBaseVmWithName` | client → server, create |
| `<Entity>UpdateVM.cs` | `UpdateBaseVm` / `UpdateBaseVmWithName` | client → server, update |
| `<Entity>ListVM.cs` | `ListBaseVm` / `ListBaseVmWithName` | server → grid |
| `<Entity>DetailVM.cs` | `LeanDetailBaseVm` (Id) / `NumberedDetailBaseVm` (Id + nullable No); explicit class for incompatible identity shapes; legacy heavy base only when every inherited field is consumed | server → editor |
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
LeanDetailBaseVm // Id only — canonical lean detail identity
NumberedDetailBaseVm // inherits LeanDetailBaseVm, adds string? No only
DetailBaseVm   // legacy: as ListBaseVm plus IsDeleted; unchanged for compatibility
SelectListBaseVm // Value, Text, LocalizedText — dropdowns
```

**Lean detail contracts (2026-10-03).** Declare only identity, displayed/action
state and editor fields. Do not inherit unused tenant/audit/flags merely to satisfy
a generic constraint. `IService`, `Service` and `SiGmaControllerBase` accept
`TDetailVm : class`: their detail paths map/return that type without using base
members. Staff, Designation and Timesheet use lean detail contracts; existing
derived detail DTOs and invoice/settings-specific constraints remain compatible.
Preserve required No/display labels/owned children when removing inheritance.
No endpoint, result envelope, entity or write-validation change follows from this
read-shape correction; adopt during the owning feature review, not a bulk rewrite.

**Shared lightweight identity (owner-approved, 2026-10-08).** Repeated detail
identity now belongs to the existing `SiGma.Helpers.ViewModelsBases.Detail`
namespace: abstract `LeanDetailBaseVm` exposes `int Id`; abstract
`NumberedDetailBaseVm : LeanDetailBaseVm` adds `string? No`. Both are public
get/set auto-properties with the original defaults. Each base has its own file.
Use the Id-only base for root/child detail responses with matching identity;
use the numbered base only when the consumed No contract matches its nullable
type/default/attributes. A nonnullable initialized No remains declared on the
feature VM over the Id-only base (reference: `TaxAdvanceDetailVm`). Avoid
shadowing inherited Id/No or adding Name/tenant/audit/GUID/flags to either base.

References: `SalesQuotationDetailVM` and `SupplierDetailVM` inherit the numbered
base; `SalesQuotationItemDetailVM` and `SupplierAddressDetailVM` inherit the
identity base. Flattened response properties, concrete DTO types, initializers,
owned children, formulas and convention mapping remain unchanged. No
polymorphic JSON discriminator, base map, serializer option or tighter generic
constraint is required. The heavy `DetailBaseVm` hierarchy remains unchanged
for compatible existing consumers. Owner approved creating and reusing these
bases; this pass adopts them across the 48 standalone detail VMs that repeat int Id;
this is not authorization to remove fields from other legacy detail contracts.
Future adoption occurs within the owning scope and compares the entire
flattened contract before/after. This supersedes the earlier explicit-only
recommendation for repeated identity while retaining the lean response rule.

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

`DateAfter` accepts both `DateTime` calendar days and `DateOnly` with the same comparison semantics, so date-only write VMs reuse the shared validator rather than duplicating comparison logic. `DateAfter` rejects equality by default. A frozen business rule
that permits the same day opts in with `AllowEqual = true` on the affected VM property;
use an explicit localized `ErrorMessage` key saying on-or-after. Null remains governed by
requiredness. Existing strict consumers, including document expiry, keep the default.
The Angular group comparison and picker minimum must match that inclusive or strict rule.

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
