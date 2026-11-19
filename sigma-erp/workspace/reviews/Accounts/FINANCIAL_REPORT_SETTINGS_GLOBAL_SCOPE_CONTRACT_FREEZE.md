# General company financial-report settings — scope contract

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-23 |

Owner explicitly replaces fiscal-year settings with one general company
definition, including cash flow, and confirms the project is still in initial
development and the year link can be removed. This freezes the bounded
globalization slice of FINANCIAL_REPORT_SETTINGS_GLOBAL_MAINTENANCE_EVOLUTION_PLAN.
It supersedes the earlier annual-snapshot/copy-forward contract for this feature.
It does not freeze the still-discussed Income/Balance configurable-row/calculation
expansion or authorize executing customer-data cleanup.

## Backend and persistence

Retain existing CashFlowReportSetting entity/table and owned cash/row/type/account
children. Remove FiscalYearId/FiscalYear and InheritedFromFiscalYearId/navigation
from the header, its EF config, detail VM and internal header command/map. One
live setting per authenticated SubscriptionId, enforced by a unique filtered
tenant index. Repository remains the sole tenant owner; no client company field.
Use IServiceHelper.UpsertSingleAsync for the singleton header, then reconcile
owned children and save through the existing unique-write action. The empty
internal header upsert command has no editable scalar properties and only
creates/retrieves identity; it does not map/replace rows.

No year-copy or old-year-selection path remains. Do not delete, merge or choose
among multiple prior annual configurations automatically. Guard duplicate live
headers with a clear localized business failure in Get/Save/Initialize/Delete
before mutating children. The owner must reconcile any such existing duplicate
headers when applying the schema migration; this is not a runtime migration.
New/empty development data uses one default header. No migration/snapshot file
may be created, edited or executed by agents. Suggested owner migration:
MakeFinancialReportSettingsGlobal (drops year FKs/columns and replaces index).

Public service contract (all cancellation-aware):
- GetAsync(CancellationToken=default) -> Result<FinancialReportSettingsDetailVM>.
- SaveAsync(FinancialReportSettingsSaveVM, CancellationToken=default) -> same.
- GetOptionsAsync(CancellationToken=default) unchanged.
- DeleteRowAsync(string key, CancellationToken=default) -> Result.
- InitializeAsync(CancellationToken=default) -> detail result.
- EnsureAsync(CancellationToken=default) -> Result, explicit write initialization.

Controller routes remain authenticated under FinancialReportSettings:
GET root, PUT root, GET Options, POST Initialize, DELETE Rows/{key}.
Remove year-bearing routes rather than creating compatibility aliases in this
development-stage change. Detail fields: IsConfigured,CashAccountIds,Rows,Warnings;
row/options/save fields and all existing validations remain unchanged. Get is
read-only and returns an unsaved default template when missing; Initialize/Ensure
seed defaults explicitly and idempotently, retaining configured values.

SeedDataService ensures this singleton once after classification for both new
and existing chart setup, even without a fiscal year. FiscalYearService neither
injects settings nor creates/copies definitions; preserve its own overlap/period
transaction and financial rules. CashFlowReportService calls general GetAsync;
its fiscal-year/date period filters and response metadata remain for selecting
ledger data and opening-balance treatment. No cash-flow amounts/formulas change.

## Frontend and presentation

Existing screen06 tabbed workspace and shared owners remain. Remove settings
year form/select, fiscal-year lookup/service dependency, selected-year state,
year-change confirmation and inherited-year messages. Load general settings on
entry/retry after required lookups, without waiting for a fiscal year. Existing
cash scope keeps its full-width FilterPanel; preserve compact table/dialog space,
dirty/route guards, refresh/cancellation, unavailable selections, error channels,
one mutation-success owner, translations, RTL/themes and internal scroll owners.
Use the new root routes and no year argument in Angular methods. Update bilingual
help to say configuration applies to all periods, and changes may alter historical
report presentation. Do not claim a period filter has been removed from reports.

## Ownership and conformance

| Concern | Canonical/shared owner | Implementation ownership |
|---|---|---|
| Domain/EF/DTO/service/controller/map | Master4; BE1/2/3/4/8/16 and existing settings service/IServiceHelper | Backend worker owns these settings files plus only its new duplicate-config resource entries |
| Workspace/models/client/vocabulary | UI screen06; UI1/2/13/16/22–29; actual FinancialReportSettings workspace and LinkAccounts settings reference | Frontend worker owns existing FinancialReportSettings folder and financial-report-settings vocabulary |
| Runtime callers/calculation retention | BE17; FiscalYearService, SeedDataService, CashFlowReportService | Root only; no amount logic changes |
| Guide/docs/integration/reconciliation | Master7/8; Accounts guide and current plans | Root only |

Initial eight recipe drift checks pass. Apply PHASE-01/03/04/05/06 proportionally;
no new grid columns/filter or screenshot contract. Existing cash rows keep their
same displayed columns and VM fields. Independent backend/frontend implementation
can proceed only against this frozen handoff, without overlapping files. Agents
preserve current user/peer changes and never edit migrations/snapshots, generated
packets or approved references. No build/test/lint/browser/database/commit.

Owner follow-up: old development data will be deleted. No old-data conversion,
annual-choice screen or automatic merging is part of implementation. The runtime
duplicate guard stays as a minimal invariant failure; it neither migrates nor
deletes historical rows. No deletion command was executed or inferred from this
future cleanup statement.
