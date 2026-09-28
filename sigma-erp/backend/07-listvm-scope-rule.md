## 7. ListVM scope rule

> **Status: Canonical**

**A ListVM contains only the columns the frontend grid displays, plus the
identity and action-state fields the row needs.** Nothing added for exports,
dropdowns, or another screen.

Worked example. The Angular Branch grid displays:

```
id · name · branchCode · branchCode2 · trn · state · createdBy · createdAt
```

`BranchListVM` currently declares, on top of `ListBaseVmWithName`:

```csharp
BranchCode  ✅ displayed
BranchCode2 ✅ displayed
TRN         ✅ displayed
State       ✅ displayed
CCEmails    ❌ not displayed  → remove
Address     ❌ not displayed  → remove
```

So `CCEmails` and `Address` are over-scope: shipped on every row of every page
for no consumer. They belong to `BranchDetailVM` only.

Procedure when you build or review a list:

1. Open the Angular `initColumns()` and write down every `colName`.
2. Add the row identity (`Id`) and anything a row action needs — a status flag a
   menu item tests, a foreign key an inline edit sends.
3. That is the ListVM. Everything else is removed.
4. Keep the query and mapper aligned: do not `Include` a navigation whose only
   purpose was a field you just removed.
5. A different consumer that genuinely needs a different shape gets its own
   contract — that is what `<Entity>FullListVm` is for.

If the frontend is not in scope, do **not** delete properties on assumption.
Record the decision as `FRONTEND_UNVERIFIED` and name the template you need.

**Also return a real total.** `Results<T>` carries `TotalPages` **and**
`TotalCount`. `BranchService.GetManyAsync` sets `TotalPages` but leaves
`TotalCount` unset, which is why Angular list components carry a fallback that
reconstructs a total from page count — and that fallback overstates the count on
a partial last page. Always set both:

```csharp
var total = await baseQuery.CountAsync();
…
return new Results<BranchListVM>
{
    IsSuccess  = true,
    Entities   = items,
    PageNo     = pageNo,
    PageSize   = pageSize,
    TotalCount = total,                                        // required
    TotalPages = (int)Math.Ceiling(total / (double)pageSize),
};
```

**Check:** every ListVM property maps to a displayed column or a row action ·
`TotalCount` set from `CountAsync` · filters applied before `CountAsync` ·
deterministic `OrderBy` · `ProjectTo` after filtering · no navigation loaded for
a removed field.

---

