# Account budget eligibility contract

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-23 |

Governed by the approved [plan](ACCOUNT_BUDGET_ELIGIBILITY_MAINTENANCE_EVOLUTION_PLAN.md). Owner: root agent. Frontend/backend share this contract before delegation.

| Surface | Contract |
|---|---|
| Entity | `Account.AllowBudget: bool`, persisted false by default |
| Account Add | `AllowBudget: bool?`; omitted defaults from revenue/expense category for analytical account, explicit false preserved |
| Account Update / Detail | `AllowBudget: bool`; client editable except group, view consumes persisted value |
| Account List / tree | Unchanged; no unused new list properties |
| Lookup | Existing GET `Account/PostingSelect?usage=16`, `Results<DropdownDto>`; enum `Budget = 16` in C# and TS |
| Budget GET | Existing `AccountReports/Budget`, same fiscalYearId/accountType and wrapper; only eligible rows |
| Budget save | Existing endpoint and changed-cell request; every distinct account must satisfy the same eligible predicate before tracking changes |
| Variance GET | Existing `AccountReports/BudgetVariance`; same eligible accounts and account/category filters |
| Output / columns | Budget AccountCode + AccountName, monthly amounts, total; DTO AccountId/AccountCode/AccountName/MonthlyAmounts. Variance AccountCode/AccountName/Month/Actual/Budget/Variance; DTO identity/month/year retained. No column or amount contract changed |
| Failure | Existing Result envelope; actionable localized validation for ineligible budget account; both UI failure channels retained |
| Transactions | Existing single save budget batch retained; account conversion keeps existing atomic owner, no new independent transaction |
| Maps | Convention maps carry bool; no new reverse maps or ignores |
| Auth | Existing authenticated tenant scope; no permission API invented |

## Canonical conformance before edits

| Concern | Book | Reference/shared owner | Decision |
|---|---|---|---|
| Account editor | UI1 hierarchy / UI15/19/23 | `Accounts/Account/components/{list,details}`, existing native checkbox field | Extend scoped reference itself; keep existing mode/dirty/loading locks |
| Budget collection | UI14 | `shared/components/editable-collection-table`, `Accounts/openingBalances/components/details` | Retain existing shared collection and changed-cell handling; improve empty guidance only |
| Variance report | UI20 / BE17 | `Accounts/TrailBalance/components/list`, `Accounts/shared/report-family` | Keep shared report shell/complete rows, replace lookup source only |
| Select/write parity | BE8/10 | `AccountSelectionPolicy.Apply`, `AccountService.GetPostingSelectAsync` | Shared authoritative Budget usage |
| Entity and mapping | BE1–4 | Existing AccountConfig / AccountProfiler; BranchProfiler convention-map reference | One new persisted bool and minimal VM changes |

No screenshot supplied. No required Missing/Conflicting/Uncertain decision remains. Source and owner runtime verification are separate.
