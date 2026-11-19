# Account budget eligibility implementation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-23 |

## Manifest

Authorized implementation of the approved account eligibility option and latest owner clarification: Budget displays only enabled accounts. Governing [frozen plan](ACCOUNT_BUDGET_ELIGIBILITY_MAINTENANCE_EVOLUTION_PLAN.md) and [frozen contract](ACCOUNT_BUDGET_ELIGIBILITY_DOMAIN_API_CONTRACT_FREEZE.md). No screenshot supplied; conversation is confirmed business evidence. Existing pending account/report/journal/seeding/translation changes and owner migrations/snapshot are preserved.

Shapes: existing canonical Account hierarchy editor (UI04), Budget financial collection editor (UI05), BudgetVariance report (UI07); backend existing specialized Account service plus Report pattern5. No new screen, route, permission, or posting action. Typed lookup is the existing Account PostingSelect endpoint.

## Source changes

Frontend repository: Account `models/{list,details,account-type}.ts`, `components/details/details.component.{ts,html}`; Budget `components/budget/budget.component.html`; BudgetVariance `components/budget-variance/budget-variance.component.ts`; EN/AR vocabularies and `UserGuide/content/accounts-guide.ts`.

The checkbox participates in the existing typed form reset/detail/create/update paths, disabled/view/busy state, and dirty/discard lifecycle. Switching to grouping clears/disables it. Creation defaults only on a pristine new analytical-account control; manual choices and saved settings are retained. Budget empty state directs the user to enable the option. Variance uses the server's Budget lookup; no label-based/client-only filtering.

Backend repository: `SiGma.Helpers/Models/Accounts/Account.cs`, `Enum/Accounts/AccountLookupUsage.cs`; Account Add/Update/Detail VMs; `SiGma.DataAccess/Configuration/AccountConfig.cs`; `SiGma.Business/Services/AccountServices/{AccountSelectionPolicy,AccountService,AccountReportsService}.cs`; `Validators/Accounts/AccountValidator.cs`; `Services/SeedDataService{,.DefaultChart,.Readiness}.cs`; `Services/HelperServices/SubLedgerAccountService.cs`; shared GeneralMessage EN/AR resources. No migration or snapshot edited in this task.

One inherited-model backend worker (`budget_backend`) and root frontend workstream were independent after contract freeze, reducing elapsed time without overlapping file ownership. Root integrated and reviewed the result; no additional subagents.

## Decisions and phase coverage

Applied PLAN-00 and Phases0/1/2/3/5/6; Phase4 adds no action because existing conversion is only updated to preserve the new field. Recipe drift check all8 OK, canonical sources/packets unchanged. New persisted bool requires owner migration; no backfill/legacy preservation workflow or data deletion introduced. Existing account types default through their financial category; there is no second type-level editable flag.

Account Add bool is nullable for a server creation default; Update/Detail and Angular form use bool. Convention maps carry it; no new reverse map/ignore. List/tree output remains unchanged because the flag is editor-only. Budget monthly rows and variance columns/DTOs remain exactly as frozen in the contract; complete responses and save failure channels retain their existing behavior. Existing single-save budget atomicity and conversion transaction are retained.

## In-app guide

Updated English and Arabic Chart of Accounts, Budget and BudgetVariance topics in `src/app/modules/UserGuide/content/accounts-guide.ts`. Existing reader registration and menu link `/UserGuide/accounts` confirmed; no parallel guide. Coverage includes eligibility, defaults, disabled accounts, refresh after stale save and conversion inheritance. Source-conformant; visual/runtime acceptance pending.

## Owner verification

1. Generate/apply the new migration, rebuild both applications, restart backend. No agent migration or database execution.
2. Create a new chart: revenue/expense analytical accounts enabled, grouping accounts disabled; reseeding preserves edited choices.
3. Enable an asset analytical account and disable an expense one. Search each category in Budget and confirm only enabled active analytical accounts appear. Check empty guidance and Excel set.
4. Load a budget, disable one displayed account elsewhere, then attempt save: entire changed batch must fail without partial writes; reload before retry.
5. Verify variance account choices/results follow the same eligibility; enabled accounts with no amounts appear with zero budget.
6. Convert an enabled analytical account into a group: flag and existing budget references move to child, parent remains ineligible. Verify view/edit/dirty/discard, narrow layout, RTL and both themes.

Suggested commits (only scoped files): backend `feat(accounts): enforce account budget eligibility`; frontend `feat(accounts): control budget eligibility from account editor`.

Build, tests, lint, browser/runtime, database and migration verification remain owner-only. No prohibited commands executed.

## Final reconciliation

| Concern | Final source evidence | Result |
|---|---|---|
| Typed account form and DTO | Add nullable bool/default normalized by existing validator; Update/Detail bool; frontend reset/fill/raw payload match | Conformant |
| Read/select/write eligibility | SQL `AccountSelectionPolicy.Apply(..., Budget)` used by Budget GET, save, variance; existing PostingSelect delegates same policy | Conformant |
| Actual children and grouping types | SQL rejects live children and grouping-only kinds; update's existing has-children guard prevents contradictory analytical writes | Conformant |
| Creation defaults / reseed | Only newly constructed accounts receive category default; explicit false and existing choices survive | Conformant |
| Conversion / subledger creation | Conversion moves flag with budget references to analytical child; new subledger defaults flag and clears parent in same save | Conformant |
| Shared presentation | Existing hierarchy native checkbox/label and form locks; shared editable collection empty input; existing report-family typed lookup | Conformant; runtime/RTL/theme pending |
| Totals / export | No parent amount input or duplicate parent row added; current eligible leaf rows feed totals and Excel | Conformant; owner numeric acceptance pending |
| Failure handling | Ineligible batch rejected before tracked edits; bilingual backend messages; existing declared/transport feedback paths retained | Conformant |
| Wiring / types | C# and TS Budget enum value16; existing authenticated route/provider/client; namespaces/imports/project inclusion checked, no new type or runtime entry | Conformant; build pending |
| Guide | Existing Accounts reader/menu with bilingual Account/Budget/Variance topics matches final source | Conformant; owner acceptance pending |

Scoped frontend/backend diffs and whitespace checked separately in their actual repositories. Both resource XMLs parsed and new localization key uniqueness checked. New migration name verified absent from existing migration filenames. No canonical book/skill change required: this is feature-specific behavior, so checked packets remain current without regeneration. In-memory `IsAllowed(Budget)` documents its fully loaded graph precondition; all authoritative paths use SQL `Apply`. No unresolved required contract decision remains.

Owner schema action (new nonnullable account bool with false database default):

```powershell
Add-Migration AddAccountBudgetEligibility
```

Existing development accounts are not automatically enabled or deleted; recreate the development chart or explicitly enable desired analytical accounts after applying the migration. New chart defaults do not rewrite existing tenant choices. Source-only status does not establish successful compilation or runtime behavior.
