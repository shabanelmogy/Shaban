# Account budget eligibility

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-23 |
| Tier | L: account persistence and budget read/write contract |

## Outcome and authority

Owner approved an account-level budget option, editable for analytical accounts, with revenue/expense defaults and optional activation for other categories. Owner explicitly says this is a development database, no legacy compatibility requirement. Latest clarification: only accounts with the budget property appear in Budget. Implementation is authorized in the same conversation.

## Existing state and impact map

| Area | Classification | Evidence / target |
|---|---|---|
| Account entity / Add / Update / Detail | Extend | Add persisted `AllowBudget`; existing account type and report placement remain independent |
| Account tree details | Extend | Existing canonical hierarchy pane gains checkbox; no new route or tree column |
| Budget collection editor | Keep / Extend | Existing complete monthly flat rows and changed-cell save retained, returned rows restricted by eligibility |
| BudgetVariance report | Extend | Same eligible account set; account selector uses typed lookup |
| AccountSelectionPolicy | Extend | Add `AccountLookupUsage.Budget = 16`; predicate shared by lookup, reads and save |
| Seed/default account creation | Extend | Newly created revenue/expense posting accounts default true; group accounts false; reseeding preserves edited accounts |
| Convert posting account to group | Extend | Budget eligibility moves to new posting child with existing budget references; parent false |
| Historical data | Keep | No database command or automatic deletion/backfill; new column false on existing rows pending owner reset/manual selection |
| Financial statements | Keep | No new statement formula or report-budget integration; existing monetary semantics unchanged |

## Alternatives and decision

Type-only eligibility would prevent per-account control; a per-year flag would duplicate configuration. Selected account-level bool with a creation default from category and explicit per-account override. No additional account type setting is required for this slice. Existing budget is a flat collection editor: latest owner instruction takes precedence over adding noneligible parent rows; screen/export totals sum eligible analytical accounts once. No new grouping rows or independently entered parent amounts.

## Frozen invariants

1. Only live active analytical accounts (`AllowChildren == false`) with `AllowBudget == true`, no actual live children, and no grouping-only type may be selected/read/saved in Budget or BudgetVariance. Account type does not otherwise restrict eligibility.
2. An account with children cannot enable the option. Switching to grouping clears it; server normalizes/rejects contradictory writes. Conversion moves it to the child. Deleting the last child does not automatically enable budgeting.
3. Create may omit nullable `AllowBudget`; server defaults true only for revenue/expense analytical accounts. Explicit false wins. Update and Detail use bool. Frontend sends explicit bool and offers default when creating a leaf; editing does not reapply defaults.
4. Disabled accounts disappear from Budget and variance, and stale/tampered saves fail as a whole before mutation. Disabling does not authorize an unrequested database deletion. Development data can be reset by owner.
5. Existing fiscal-year/month validation, changed-cell save, company ownership and amount signs remain unchanged. No new branch/cost-center/version dimensions are introduced.

## Execution and verification

Recipe drift check: all eight packets OK. Use PLAN-00, Phases 0/1/2/3/5/6; no new risky domain action in Phase4. Source-only boundary: no build/test/lint/browser/database/migration/commit commands. Owner generates migration `AddAccountBudgetEligibility` then applies/rebuilds and verifies new chart defaults, account toggles, budget rows, variance selector, rejected stale save, and conversion. Preserve pre-existing source and migration/snapshot changes.
