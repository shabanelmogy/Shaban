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

