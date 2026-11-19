# Account Reconcile configuration

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-24 |

## Manifest and scope

Owner requests Reconcile on Account details, and asks whether it already exists only in banks. [Frozen plan](ACCOUNT_RECONCILE_OPTION_MAINTENANCE_EVOLUTION_PLAN.md) and [API/form contract](ACCOUNT_RECONCILE_OPTION_DOMAIN_API_CONTRACT_FREEZE.md) govern implementation. No screenshot; user discussion confirms independent per-account configuration. Existing bank/source allocations stay unchanged; no general matching engine is claimed.

Selected shape: UI04 canonical Account hierarchy pane; backend existing Account normal entity service/validator with specialized conversion. Extend its own approved reference, retaining shared field styles, controlled view/edit/busy/dirty states and existing tenant-authenticated endpoints. No new list/grid/lookup/routes/providers or permissions. Recipe drift check all8 OK. PLAN-00 and Phases0/1/3/5/6 applied; Phase2 no new list; Phase4 no new state action. Existing conversion receives only flag transfer.

## Existing reconciliation evidence

- `BankReconciliation` and `BankReconciliationLine` store bank statement sessions, actual account and balance snapshots, selected journal lines and active reservations. `AccountReportsService` has session loading, save, history and void logic. This is bank statement matching, independent of the new option.
- `ReceiptAllocationDetail` and `JournalVoucherAllocation` already store document allocations; they do not constitute a general per-account journal-line reconciliation engine. Existing account model has no generic reconciliation flag before this change.
- The new option is configuration for later general item matching. Neither turning it on nor off creates/deletes matches, changes allocation amounts or gates current bank reconciliation.

## Frontend implementation

Changed Account `models/{list,details}.ts`, `components/details/details.component.{ts,html}`, EN/AR vocabularies and Accounts guide. Nonnullable form bool, reset/detail/payload round-trip, native checkbox with associated label/help. New pristine Receivable/Payable choices default true; explicit manual changes and stored values do not re-default. Group/actual-child/grouping-role states clear and disable. Existing global form locks and failure/dirty handling retained. No private styles or library API added.

## Verification and handoff

Owner must generate/apply migration `AddAccountReconcileOption`, rebuild and restart. Check create receivable/payable default, explicit false persistence, other analytical type opt-in, group lock, view/reload/dirty cancel, conversion flag transfer, seed preservation and unchanged bank allocation flows. Existing accounts start false unless explicitly edited; no database backfill/deletion performed.

Guide: `src/app/modules/UserGuide/content/accounts-guide.ts`, existing reader/menu `/UserGuide/accounts`, bilingual Chart of Accounts topic. Explains defaults and configuration-versus-operation boundary. Visual/RTL/theme/runtime acceptance remains pending.

Suggested backend commit: `feat(accounts): persist account reconciliation option`.

Suggested frontend commit: `feat(accounts): add reconcile option to account details`.

No build/test/lint/browser/database/migration/commit commands allowed or run.

## Backend implementation

Changed Account entity and AccountConfig; Add/Update/Detail VMs; AccountSelectionPolicy, AccountService, AccountValidator; SeedDataService and SeedDataService.Readiness; SubLedgerAccountService and shared GeneralMessage EN/AR resources. Existing namespaces/imports/project inclusion verified; no new .NET type or registration. Convention maps carry normalized bool without a new map/ignore/reverse direction. No ListVM changes or unused tree field.

Add normalizes once in AccountValidator: grouping false; explicit false wins; omitted derives from selected type. Update sends bool and never reapplies a creation default; grouping-only role rejects true. Existing actual-child guard prevents analytical state with live children. Converting to group moves flag to new child and clears parent inside existing transaction. Subledger creation defaults from loaded type and clears parent in its current save.

New chart applies defaults after classification/supplement, inside `newChart` only, excluding actual parents. Existing setup reruns skip that loop entirely; new provision groups explicitly false. New false-default column leaves existing development rows false; no backfill/deletion. Bank and allocation model/service behavior unchanged.

## Final reconciliation

| Concern | Final evidence | Result |
|---|---|---|
| Entity / EF / DTO | Required bool false default; Add nullable, Update/Detail bool | Matched; owner migration required |
| Editor read/write | typed reset/fill/raw payload + account checkbox/label; creation type watcher and loaded options default only pristine new control | Matched |
| Modes / locks | existing whole-form lifecycle; new field disabled for groups, actual children/group roles, view and busy | Matched; runtime pending |
| Defaults / conversion | shared backend default kind helper; new-chart gate after type assignment; conversion child receives persisted value | Matched |
| Mapping / namespace | existing AccountProfiler convention mappings; same source inclusion/imports | Matched; build pending |
| Presentation | existing canonical hierarchy pane and shared check field, no CSS/component forks; EN/AR key pair and associated label/help | Matched; theme/RTL/visual pending |
| Scope boundary | no bank/allocations engine consumer switched to new flag, no new general matches/statuses | Matched |
| Guide | bilingual existing Accounts topic, existing reader/menu `/UserGuide/accounts` | Matched; owner acceptance pending |

Root reviewed complete scoped diffs separately in frontend/backend repositories, whitespace and stale contracts. Backend worker reviewed both resource XMLs and new key uniqueness; root inspected resource changes. All8 recipe checks OK, no canonical/skill changes or derivative drift. Suggested migration name absent from existing migration filenames. No prohibited commands run. Source-only verification does not prove compilation or runtime behavior.

One reused inherited-model backend worker (`budget_backend`) owned backend only after contract freeze; root owned frontend/docs and integration. Parallel independent ownership reduced elapsed time and preserved compatible edits. No new agents or overlapping files.

Owner schema command:

```powershell
Add-Migration AddAccountReconcileOption
```

Apply the generated migration using the owner's normal process, rebuild/restart, then run the manual checks above. No historical migration/snapshot was edited by this task. No required missing/conflicting/uncertain contract remains within this account-configuration scope; general reconciliation implementation is a separate future scope.

## Owner amendment — bank defaults, 2026-10-24

Tier S addition: enable the default for the existing combined BankAndCash account kind as well as Receivable/Payable. Updated `AccountSelectionPolicy.DefaultAllowReconcile`, the new/pristine form default in Account details and its bilingual Accounts guide topic. Shared helper automatically supplies the new-chart and subledger creation paths; explicit false, existing rows, group restrictions and current bank reconciliation remain unchanged. Contract amendment records the new instruction without rewriting the original freeze. No extra schema migration beyond the still-required initial `AddAccountReconcileOption`.

Same canonical hierarchy shape and backend validation pattern; source-only scoped frontend/backend diffs and whitespace reviewed. All8 recipe checks OK; no packet changes. No subagents for this small tightly bounded default change. No build/test/lint/browser/database/migration/commit commands run. Owner check: create analytical BankAndCash account and fresh chart, verify true default; explicitly clear/save/reload and repeat setup, verify false retained. Suggested backend/frontend commit: `fix(accounts): default bank and cash accounts to reconcile`.

## Owner layout correction — compact account checks, 2026-10-24

Tier S, frontend-only. Owner scopes reduced vertical spacing to the checks in Account details. Current shared checkbox field reserves label-line padding for alignment next to labelled inputs; these stacked standalone checks do not need it. UI1 hierarchy/field composition and UI16 accessible label association remain owners. Before-edit conformance: existing Account details is approved shape04 reference; `sigma-field` owns 4px internal gap, `sigma-editor-grid` owns 7px row gap, `_sigma-utilities.scss` owns logical zero padding/margin. Reuse those existing public classes, no feature CSS or shared default change.

Changed `Account/components/details/details.component.html`: each of four check/help pairs is one `sigma-field`; its check row uses existing `sigma-u-p-0`, help uses `sigma-u-m-0`. The 34px check row and input dimensions, labels, controls, conditions, warning placement, form locks and internal scroll owner remain unchanged. Added described-by links for children/cost-center hints alongside existing budget/reconcile links. Updated bilingual Accounts guide topic at existing `/UserGuide/accounts` menu/reader. No API/schema/mapping/financial calculation change and no migration.

Source reconciliation: scoped frontend diff/whitespace reviewed, utility definitions and native check markup confirmed, no new translation key/import/type. Recipe check all8 OK, canonical/packets unchanged. Owner visual check pending for compact spacing, long Arabic hint wrapping, narrow pane, view/edit and both themes. No subagents: one bounded presentation change. No build/test/lint/browser/database/migration/commit commands run. Suggested frontend commit: `fix(accounts): compact account option spacing`.
