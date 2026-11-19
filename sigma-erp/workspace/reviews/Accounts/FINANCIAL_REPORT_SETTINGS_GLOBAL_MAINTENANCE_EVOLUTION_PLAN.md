# General financial statement settings — owner amendment

| Item | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Date | 2026-10-23 |

Extends the existing FinancialReportSettings capability; it does not create a
parallel settings/report owner. Owner requests professional editable defaults
for Income Statement, Balance Sheet and other financial statements, linked to
current groups/subgroups/account types. After reviewing cross-year comparisons,
owner explicitly replaces annual definitions with ONE GENERAL COMPANY DEFINITION,
including cash flow. This supersedes earlier year-snapshot/copy-forward decisions
for the new implementation; their Frozen records remain historical evidence.
Dates/years select ledger data, not configuration versions. A definition change
therefore changes presentation of historical periods as well.

This document is the required PLAN-00 discovery/target proposal. It is not an
implementation freeze: conversion of existing divergent annual settings and the
Balance Sheet calculation discrepancy below require decisions. No settings,
report calculations, annual data or migration was modified for this amendment.

## Existing-state inventory and impact map

| Owner | Current behavior | Required classification / impact |
|---|---|---|
| FinancialReportSettingsService and CashFlowReportSetting aggregate/config | FiscalYear-keyed cash scope, editable cash rows, type/account mappings; explicit ensure and detached prior-year copy | Refactor to one tenant-owned general definition; keep current cash-flow semantics and owned-child validation. Decide old annual-data conversion before changing persistence. |
| FiscalYearService.AddAsync and SeedDataService.EnsureFinancialReportSettingsAsync | Ensure per-year graph in owning multi-save transaction | Refactor so year creation no longer copies/creates definitions. New-company/chart setup ensures the general definition once; subsequent seed reruns preserve custom settings. |
| FinancialReportSettingsController, VMs, Angular service/models/workspace/dialog/vocabulary | Year routes/selector plus operating/investing/financing cash-flow tabs | Extend existing owner to list-level Income Statement / Balance Sheet / Cash Flow tabs, one general configuration and shared typed row editing. Remove settings-year selection; preserve full-width filters, concise content and shared scroll owners. |
| CashFlowReportService and ResolvePeriod | Period resolution obtains the annual configuration and cash-row mapping | Refactor configuration lookup only after contract freeze. Preserve indirect method, actual cash legs, opening-entry baseline, excluded internal cash transfers, ambiguity diagnostics and reconciliation difference. Dates may still require fiscal periods for accounting data, but no longer choose settings. |
| AccountReportsService Income Statement family | Eight account-tree/flat variants; posted nonvoided ledger; category signs; IS2/YTD2 add four fixed profit subtotals | Extend common row projection without re-summing rolled hierarchy. Decide family display and filtering contract; screen/print/Excel must consume one authoritative result. |
| AccountReportsService BalanceSheet | Cumulative as-of amounts, category-natural signs and residual prior/current P&L overlay into retained/current earnings | Keep as-of history and explicit accounting totals. Rows use settings without truncating history to a year/date-range movement. |
| AccountReportsService BalanceSheetMonthwise | Current implementation uses debit-minus-credit for all categories, no residual earnings overlay and last-second cutoffs | Refactor candidate: share ordinary BS calculation per cutoff; owner question pending. This is a calculation decision independent of layout-year simplification. |
| AccountSetting Group/SubGroup/Type definitions | Existing database-owned classification and preserved financial snapshot keys | Keep single classification owner. Report selectors reference these definitions; never create another account-type catalog or alter Account.Category/SubGroup from report settings. |
| AccountReportHelper and shared report-family Angular page | Posted/branch/cost-centre/vehicle eligibility; own raw + direct-parent rollup; shared table/print/export | Keep financial inclusion and shared presentation. New synthetic rows need stable row keys, not fake AccountIds. Preserve real-account drilldown separately. |

## Proposed target and guardrails

The general settings workspace contains Income Statement, Balance Sheet and
Cash Flow. Each begins with recognizable default rows, bilingual labels, order,
enabled state and classification references. Add/edit works through the existing
shared editor; no expression language or arbitrary formula execution. Structure
and calculated totals remain server-owned. Cash-flow methods remain separate
from Income/Balance semantic roles.

Resolve selected group/subgroup/type references to distinct account identities
before summing raw own-account amounts. A group and its type may overlap within
a selector union without counting an amount twice. Across separate data rows,
overlap and unmapped values must be diagnosed/guarded. Never calculate financial
grand totals by adding visible configured rows; hiding or disabling a display
row cannot silently remove history from totals.

Existing financial accounts may be inactive, legacy untyped or have direct
postings on a parent. Settings' active posting-account choice lookup is not the
ledger-inclusion predicate. Preserve those amounts or expose their unmatched
classification explicitly. Common sums remain independent for every comparison,
monthly, YTD and budget column. Existing Budget=0 placeholders are not a new
budget implementation contract.

| Option | Decision and rationale |
|---|---|
| Independent per-year layout snapshots | Superseded by explicit owner decision: unnecessary comparison complexity. |
| One general tenant definition | Approved high-level target, including cash flow. All periods use the same definition. |
| Arbitrary expression/formula designer | Excluded from current proposal. Reuse closed semantic methods and existing calculation ownership. |
| Raw account classification only | Insufficient for approved editable statement rows; keep as the referenced accounting taxonomy rather than duplicate it. |

## Logic ambiguity and decision register

| Decision | Status / evidence | Exact remaining condition |
|---|---|---|
| General company scope | Confirmed owner: “التعريف على المستوى العام مش السنة ... وبرضه ... التدفقات النقدية” | Implement one tenant-owned definition, no annual copy on future year creation. |
| Editable defaults and current classification | Confirmed owner approval | Freeze exact row input/detail/lookup fields and section constraints using existing report math. |
| Existing annual definitions | Missing migration/initialization choice; question sent | Latest saved definition with retained old evidence, or one-time user selection. Do not silently pick among divergent records. |
| Monthwise BS sign/earnings overlay | Confirmed source discrepancy, owner question pending | Apply shared ordinary BS basis or retain/report discrepancy until accounting review. |
| Income family display and account-level filters | Uncertain source contract | Freeze configurable-row identity/breakdown/drilldown and existing eight variants; do not keep an ignored settings tab. |
| Fixed profit rows | Existing formulas known; editability needs explicit contract | Gross=OperatingRevenue−CostOfSales; asset-sale=current linked revenue−expense; net=all revenue−expenses; before-sale=net−asset-sale. Keep formulas authoritative; define permitted label/order/visibility edits. |
| Disabled/unmapped/overlapping values | Proposed guardrails above | Freeze effective-membership validation and visible reconciliation diagnostics before persistence/report consumer implementation. |
| Global conversion compatibility | Existing schema annual, new general scope needs change | Preserve existing data and consumers until conversion policy and exact EF/API changes are frozen. No migration files edited/run. |
| Cleanup module | Separate Draft company-reset plan | Reset only the signed-in company's explicitly chosen scope; coordinate protected settings/default reinitialization, never call whole-table developer reset from customer UI. |

## Dependency-ordered implementation and acceptance

1. Freeze the conversion, statement row/formula/presentation and monthwise
   accounting decisions; derive exact API/entity/selector contract (PHASE-00/01).
2. Refactor general settings persistence and caller lifecycle, then update all
   cash-flow configuration readers/UI together. Keep old annual records according
   to the selected conversion policy. Any needed migration is owner-run only.
3. Extend typed Income/Balance configuration and one common amount projection;
   reconcile every affected report variant and totals/print/Excel (PHASE-02/03/04).
4. Integrate settings navigation, report wiring, new-chart initialization and
   bilingual UserGuide (PHASE-05), then complete scoped source reconciliation.
5. Owner-run compilation and acceptance: two tenants, no settings-year selector,
   repeated initialization, old-record conversion, same configuration across
   comparison columns, no ancestor/descendant double counting, unmatched amounts,
   every income formula, monthly/as-of BS agreement and unchanged cash ambiguity/
   reconciliation behavior. Source inspection does not establish numeric/runtime
   correctness (PHASE-06).

Discovery used Master1/4, BE8/10/16/17 and screen06/current settings/report owners.
PLAN-00 and PHASE-01/04/06 used after all eight recipe checks passed. No generated
packet was edited. Two inherited-model read-only agents traced Income and Balance
families without source ownership overlap; root retains decisions/integration.
No builds/tests/lint/browser/database/migrations/commits or delete action run.

## Owner simplification and implemented slice — 2026-10-23

Owner confirms initial development, removes the fiscal-year linkage and says old
data will be deleted. Consequently no annual-selection/conversion wizard or
copy-forward path is needed. This authorizes the clean general-company schema/
API source change recorded in FINANCIAL_REPORT_SETTINGS_GLOBAL_SCOPE_CONTRACT_FREEZE,
not any data-deletion tool execution. That bounded slice is implemented source-only;
the broader Income/Balance row/calculation expansion remains Draft. The former
conversion-choice condition above is superseded. The monthwise BS calculation
decision remains separate and is not silently resolved by global settings.

## Approved statement expansion — 2026-10-23

Owner now approves fixed accounting formulas with editable statement data rows,
requires component-based aggregation and a control screen like cash flow, and
explicitly approves unifying monthly BS with the as-of calculation. The former
Draft/Uncertain conditions for this scoped expansion are superseded by
`FINANCIAL_STATEMENT_COMPONENTS_DOMAIN_API_CONTRACT_FREEZE.md` (Frozen). General
tenant scope remains unchanged. Root freezes exact selector union/overlap,
disabled/unmapped handling, ten response consumers, primary statement/account
details views, same-view output and first-header default lifecycle there.
The company cleanup module remains a separate scope; no data deletion authorized
or executed by this expansion. Source-only implementation and reconciliation are
recorded in the owning Financial Report Settings feature review.
