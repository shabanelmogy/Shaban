## 19. Backlog

Ordered by risk. Item numbers are stable.

### P1 — correctness and security

| # | Problem | Evidence |
|---|---|---|
| 1 | `TotalCount` not returned | `BranchService.GetManyAsync` sets `TotalPages` only. Angular list components therefore reconstruct a total from page count, which overstates it on a partial last page. Set `TotalCount = total` in every list override |
| 2 | Write VM base carries server-owned fields | `UpdateBaseVm.SubscriptionId` and `UpdateBaseVm.No` are client-settable for backward compatibility. Every Update AutoMapper map must ignore both during migration; remove them from the Update contract after consumers stop sending them |
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
| 4 | `Name` max length disagrees across bases | `AddBaseVmWithName` is `[MaxLength(250)]`, `UpdateBaseVmWithName` is `[MaxLength(50)]`, and `BranchConfig` sets `HasMaxLength(100)`. A 120-character name is accepted on create and rejected on update |
| 5 | ListVM over-scope | `BranchListVM` ships `CCEmails` and `Address`, which the grid never displays. Apply block 7 across modules |
| 6 | `ListBaseVm` ships plumbing to every grid | `SubscriptionId`, `GUID`, `IsValid`, `IsChanged`, `No` go out on every row of every list whether displayed or not. Decide which belong in a list contract at all |
| 7 | `FullListVm` duplicates `ListVM` | `BranchFullListVM` and `BranchListVM` are field-identical, so the separate contract buys nothing yet. Either differentiate it or drop it |

### P3 — structure

| # | Problem | Evidence |
|---|---|---|
| 8 | `Result`/`Results` typing | `Results<T>` also exposes the untyped `Result` members; the Angular side mirrors this with `Results<T> extends Result<any>`. Tighten both together |
| 9 | Service base is very large | `Services/Bases/Service.cs` is ~39 KB. Overriding safely requires reading it; document its contract so overrides stop re-implementing invariants by guesswork |
