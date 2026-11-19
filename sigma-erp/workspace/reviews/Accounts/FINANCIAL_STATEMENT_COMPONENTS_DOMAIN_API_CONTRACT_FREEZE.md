# Financial statement components and control workspace

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-23 |

Continuation of the global FinancialReportSettings plan. Owner explicitly approves
fixed accounting totals/formulas with editable definition rows; independent
Income/Balance components; no duplicate account between a statement's rows; and
unifying monthwise Balance Sheet signs/earnings overlay with the as-of balance
sheet at every month end. Owner further clarifies amounts sum from each statement's
components and requests a control screen like cash flow. These approvals freeze
this scoped implementation, retaining company-global scope and shared settings
owner. No annual configuration, expression engine or financial journal rewrite.

## Components, persistence and selectors

New stable enum FinancialStatementKind: IncomeStatement=1, BalanceSheet=2.
Retain CashFlowReportSetting singleton as current aggregate header and add its
StatementRows collection. New separate named tenant entities/files:
FinancialStatementRow (SettingId,Kind,Key<=50,Name<=50,NameLocalized<=50,
Category:AccountCategory,SortOrder0..10000,IsEnabled),
FinancialStatementRowGroup(RowId,AccountGroupId),
FinancialStatementRowSubGroup(RowId,AccountSubGroupId),
FinancialStatementRowType(RowId,AccountTypeId).
Restrict definition FKs, cascade disabled per project conventions; unique live
tenant/header/kind/key and row/selector indexes. No migrations/snapshots edited/run.
Owner migration suggestion AddFinancialStatementComponents.

Each data row has exactly one compatible Category: income4/5, balance1/2/3.
Its three selector lists are a UNION of group/subgroup/type matches within that
category, resolved to distinct account IDs, never summing a parent subtotal.
At least one selector required for enabled rows. No editable formula/sign/mixed
category. A system group selector includes category; subgroup system fallback
matches an account's preserved Category/SubGroup when no valid exact type chain
is available. Custom group/subgroup membership uses the actual matching type
chain. All live account metadata is considered, including inactive accounts and
direct parent posting; lookup selectability does not govern ledger inclusion.

Save validates known live tenant definitions, category compatibility, distinct
keys/selectors, lengths/order/enums and effective incoming+retained omitted rows.
Reject cross-row account overlap within the SAME Kind, including disabled rows.
Statement layouts are independent of each other and cash-flow account allocation.
Future accounts dynamically match selectors; resolver repeats overlap checks on
report read and returns an actionable failure rather than double counting.
Disabled rows contribute no displayed data row; their amounts, and any unassigned
amounts, appear in an explicit Unmapped row per category. Totals never disappear.

Default templates: one editable data row for each existing system reporting
subgroup (income9, balance5), using persisted bilingual subgroup names/IDs and
fixed semantic Category. No synthetic account creation. Explicit EnsureAsync
initializes missing Kind templates once (including preexisting general headers),
preserves configured rows/choices; read returns unsaved defaults when none exist.
An intentionally emptied configured Kind must not be silently reseeded: persist
header flags IncomeStatementConfigured/BalanceSheetConfigured (server-owned).
First explicit Save/Delete sets/preserves that Kind flag; singleton header mapper
must ignore these flags/children. GET never saves.

## Settings API and exact shapes

Extend IFinancialReportSettingsService/current controller with:
GET Statements/Options -> Result<FinancialStatementOptionsVM> {Groups,SubGroups,Types};
each option {Id,Value,NameLocalized,Category}, SubGroups adds AccountGroupId,
Types adds AccountGroupId?,AccountSubGroupId?. Active detailed type options exclude
unplaced/root-only roles. Group/subgroup choices use actual tenant definitions.
GET Statements/{kind:int} -> Result<FinancialStatementSettingsVM>
{Kind,IsConfigured,Rows,Warnings};
PUT Statements/{kind:int} with FinancialStatementSettingsSaveVM {Rows};
DELETE Statements/{kind:int}/Rows/{key}. No new frontend route.
Row input/detail {Key,Name,NameLocalized,Category,SortOrder,IsEnabled,
GroupIds,SubGroupIds,TypeIds}; detail adds AccountCount (resolved count), no entity
or server tenant/state inputs. Rows omitted by Save retained; Delete explicit.
Reuse IServiceHelper for header once, existing unique-write/save ownership and
child set-difference reconciliation. Both failure channels remain typed Result.

Business report resolver method on same service:
ResolveStatementLayoutAsync(kind,ct) -> Result<FinancialStatementLayout>
(Business DTOs each own file in Services/FinancialReportSettings;
Layout has Rows,UnmappedAccountIds,Warnings; row has Key,Name,NameLocalized,
Category,SortOrder,IsEnabled,AccountIds). It considers only enabled rows for
coverage, rechecks all row overlap, returns unsaved defaults if not configured.
Use shared membership resolver logic for Save preview, counts and report layout.
No public permission API or client-supplied tenant.

## Report projection and accounting

All8 Income variants and both BalanceSheet variants get additive
Statement:FinancialStatementReportVM {Columns:string[],Rows,Warnings}.
Row {Key,Name,NameLocalized,Category,Role:string,Values:Dictionary<string,decimal>}.
Roles data/unmapped/total; stable keys not fabricated AccountIds. Columns fixed
camelCase keys: Income balance,budget,variance; Comparison balance1,balance2,variance;
YTD currentMonth,currentYtd,previousYearMonth; FY/monthwise existing month labels
(plus total where applicable); Balance amount. Fixed totals computed backend:
income totalRevenue,totalExpenses,netProfit for all variants; grossProfit,
beforeAssetSale,assetSaleProfit retained where already supported (IS2/YTD2).
Balance totalAssets,totalLiabilities,totalEquity,balanceDifference.
Return bilingual default total/unmapped names (localized at display); formulas
and source account-link roles remain closed/server-owned.

Projection sums immutable raw OWN account amount vectors (including legitimate
parent postings) by resolved member IDs once. Do not derive raw values from
filtered/pruned rolled trees. Keep existing ledger/status/branch/costcentre/
vehicle/date filters, financial amount coverage and summary contracts. Existing
Lines/Assets/Liabilities/Equity responses retained for account details; settings
Statement is primary, details available separately. Account-level/parent-only/
hide-zero options retain their account-detail effect; hide-zero may suppress zero
data statement rows but must not suppress unmatched diagnostics or fixed totals.

Unify BS through one shared cutoff-calculation owner used by ordinary and monthly
paths: cumulative posted nonvoided history before next-day/month exclusive bound;
assets D-C, liabilities/equity C-D; residual prior/current P&L overlay into current
configured retained/current earnings accounts, as existing scalar BS. Per-month
fiscal-year boundary from covering year; missing required year/equity mapping
fails clearly. Keep branch/cost-centre monthly filters. Aggregate by account and
period in SQL; no materialization of the entire ledger for monthly calculations.
No journal/balance-carry-forward writes. Root total and configured totals must
reconcile; unmapped amounts explicitly retained. Cash-flow calculations unchanged.

## UI contracts and shared owners

Same screen06 FinancialReportSettings workspace gains top report tabs Income,
Balance,CashFlow; existing operating/investing/financing tabs inside cash view.
Each statement data table: Name,Category,Components summary,AccountCount,Order,
Enabled plus shared view/edit/delete actions. Typed shared EditorDialog has name,
optional Arabic name,category,order,enabled and group/subgroup/type multiselects
filtered by category with inline validation. Disjoint list selections union,
server guards authoritative. Save/error/dirty/cancel/delete semantics preserve
drafts when switching report tab; ask shared discard before losing edits. Keep
full-width filters, concise explanations, shared sizes/theme/RTL/no page scroll.

Report-family page gets optional typed config accessor statement(response),
FinancialStatementReport model/table via existing shared DataTable. Participating
reports show Statement (default) / Account details view using shared EditorTabs.
Statement row columns from response.Columns with bilingual key label map/month
labels, name current-language fallback, warning diagnostics. Display/print/Excel
use SAME active view; detail adapters keep existing behavior; statement does not
append the old frontend IS2/YTD2 fixed totals again. No fake ledger drilldown on
configured rows. Shared report owner applies to all10 consumers, others unchanged.

## Ownership

Backend settings worker: new enum/entities/EF configs/VMs/internal layout types,
partial settings service (new partial statement file + necessary existing service
hooks), interface/controller/map, DbContext DbSets only as needed, and scoped
new resource messages. No AccountReportsService/report response edits.
Frontend settings worker: FinancialReportSettings folder/new dialog and models,
financial-report-settings vocabulary only; root controls common result model if
needed via report-family import. No report page/report consumer edits.
Backend report worker: AccountReportsService, new shared report/calculation
helpers, report Statement response DTOs + additive fields on ten response VMs.
Root: frontend report-family/model/table integration and all10 report consumers,
runtime entry list, guide/docs/final reconciliation. No file overlap permitted.
Preserve all current user/peer changes. No migrations/snapshots/generated-packet
editing, builds/tests/lint/browser/database/commits. Namespace/import/SDK inclusion
must be checked. Applicable Master4/7; BE1–4/8/16/17; UI screen06/07/09+shared
references. Initial recipe Check all8 OK; refresh derivatives on book changes.

## Integration clarification — 2026-10-23

Source review found that creating the shared header from a statement Save/Delete
would make cash flow appear configured without its defaults. When that explicit
mutation creates the FIRST header only, add the existing cash-flow default rows
within its same save boundary. Leave cash-account selection empty for the owner.
Never reseed existing or intentionally emptied cash rows. GET remains read-only.
This follows the owner's ready-default setup requirement; no new accounting
policy or year-specific definition is introduced.

Header summaries and closed income formulas use the same category/raw vectors as
configured rows, including category accounts outside the first selected root.
Natural revenue signs follow category, not membership in that first root. The
existing account-details tree adapter remains available separately.

Statement/detail tabs are alternative representations of the same complete data,
not omitted report sections. Print/export use the active representation with a
print-only representation heading; they do not print duplicate financial values
from both representations. This is the frozen output contract for this feature,
distinct from UI21's ordinary section-tab print-all rule. All underlying rows in
the selected representation remain complete in print/export.

## Owner presentation refinement — 2026-10-23

Owner requests the BASIC Income Statement in the usual accounting presentation
and explicitly keeps the other reports' design. Supersedes earlier primary
configured-view UI adoption on all ten: only IncomeStatement opts into that
presentation now. Other nine keep their existing UI/print/export layouts; their
additive Statement API projections and shared calculation fixes remain.

Basic statement uses server-owned stages derived from each account's existing
persisted reporting subgroup, never row labels: Operating Revenue, Cost of Sales,
Gross Profit, Operating Expenses (Selling/Administrative/Maintenance/Depreciation),
Operating Profit, Other Revenue, Financial Expense, Other Expense, Net Profit.
Unknown revenue/expense classification stays explicit in respective other stage.
Within each stage editable component order/names/membership apply. A component
covering multiple stages is split into distinct stage-qualified keys for display,
with each own account amount counted once; no new setting or expression editor.
Disabled/unassigned own amounts appear explicitly as Unmapped in their stage
when nonzero, so subtotals include them correctly without silent disappearance.
Unmapped account warning stays. Gross = operating revenue - cost of sales;
Operating Profit = gross - operating expenses; Net = all revenue - all expenses.
No invented separate tax stage/account classification. Print/export same rows.

Basic statement displays item and amount columns, headings and inline subtotals,
final net with shared double rule; omits duplicate category column/KPI cards in
statement view. Optional budget columns remain available through existing filter,
hidden initially because budget values remain the existing zero placeholders.
Its account-details view retains original fields/navigation. New row roles section
and subtotal are additive strings/typed frontend literals; other builders remain
unchanged. No accounting rule or rendering change to the remaining reports.

## Owner correction — all statement consumers, 2026-10-23

The owner now explicitly requests that all financial reports read Financial
Report Settings and authorizes all re-audit corrections. This supersedes the
nine-consumer presentation opt-out above: all eight Income variants and both
Balance Sheets use the existing configured Statement view as primary, with their
existing account layouts retained in Account Details. Basic Income alone uses
the staged standard-income layout. Existing period columns, filters, complete
amount coverage, server totals and active-view print/Excel contract remain.
Cash Flow continues through its separate saved cash-scope/activity definitions.
Correction contract and source reconciliation are recorded in
FINANCIAL_STATEMENTS_SETTINGS_REAUDIT_FEATURE_REVIEW.md. No new schema/API.
