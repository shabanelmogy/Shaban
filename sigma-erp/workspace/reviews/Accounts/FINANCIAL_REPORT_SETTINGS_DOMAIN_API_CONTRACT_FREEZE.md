# Financial Report Settings / dynamic cash flow

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Date2026-10-23. Implements the owner-approved editable defaults, actual accounts
filtered by configured types, independent per-fiscal-year settings, automatic
next-year copy and the indirect-method/cash-reconciliation decision. See the
owning maintenance plan and CF-01 evidence. This is a constrained reporting
configuration, not a general expression engine or a journal writer change.

## Domain and persistence

Use five normalized tenant-owned EntityBase types, each in its own file:
CashFlowReportSetting(FiscalYearId, cash accounts, rows),
CashFlowReportRow(SettingId, Key<=50, Name<=50, NameLocalized<=50,
Activity, Method, SortOrder0..10000, IsEnabled),
CashFlowReportRowType(RowId,AccountTypeId),
CashFlowReportRowAccount(RowId,AccountId),
CashFlowReportCashAccount(SettingId,AccountId).
Restrict references; unique live tenant/FiscalYear header, header/key row,
row/type, row/account and header/cash account. Inherited rows copy scalars and
mapping collections into new identities; no shared mutable rows. Scalar settings
upsert uses IServiceHelper by fiscal-year key, once-save aggregate reconciliation;
only owned mapping-child collections use full replacement. Omitted definition
rows are retained. Removing a persisted definition is a dedicated confirmed DELETE
operation, not omission. Cash accounts form one explicit set per year.

Enums in Helpers/Enum/Accounts, numeric API values:
CashFlowActivity Operating=1, Investing=2, Financing=3;
CashFlowCalculationMethod NonCashAdjustment=1, WorkingCapitalChange=2,
CashMovement=3. No editable formula strings or arbitrary sign expressions.
System template Key is a stable code; custom keys may be GUID strings. Names
are trim/nonblank/<=50; localized name optional; keys distinct and immutable.

## Validation and calculation roles

All selected accounts must be tenant-owned active posting leaves with an active
valid Type→SubGroup→Group and snapshots agreeing with that placement. Allowed
types are actual AccountTypeDefinition IDs, not translated names. Save validates
every selected ID by distinct count and exact membership. Cash accounts require
BankAndCash Kind; actual chosen IDs define cash scope. Do not automatically assume
every clearing/PDC/bank-like account is cash. A cash account cannot be a row target.
An account can occur in at most one definition, including disabled definitions;
duplicate IDs inside a row or payload fail explicitly. An enabled row needs an
allowed type; it may have no accounts while configuration is being completed.
Lookups and Save share eligibility. Stale saved references remain visible as
warnings requiring correction; they are never offered as valid choices. Historical
report computation must not silently discard an inactive referenced account.

| Method | Permitted target / activity | Exact amount |
|---|---|---|
| NonCashAdjustment | Expense or Revenue; Operating only | Period raw Debit-Credit, reversing the selected P&L contribution already contained in net profit |
| WorkingCapitalChange | CurrentAssets or CurrentLiabilities report keys; Operating only | Negative change in raw net-debit balance, after removing period opening/closing JV effects; no tree subtotal summation |
| CashMovement | Any noncash valid financial target; chosen activity | Actual net cash side attributable to selected counterpart accounts; never use target balance delta as cash paid |

For a CashMovement row whose selected targets include P&L accounts, return a
separate named Operating adjustment for those accounts' period Debit-Credit,
then the actual cash movement in the row's chosen activity. Include any dedicated
settlement accounts in the same row when payments settle an earlier accrual;
the exclusive-account rule prevents those accounts also entering working capital.
This avoids counting an expense already in net profit again as a cash payment.
Mixed-purpose common settlement accounts cannot be guessed into several rows.

Net profit remains all posted period Revenue(Credit-Debit) minus
Expense(Debit-Credit). Automatic net-profit and adjustment lines are not editable
mapping rows and do not participate in ordinary duplicate-account rejection.
No classification is inferred from account-code prefixes or literal identities.

## Cash attribution, baseline and diagnostics

Use tenant-owned live, posted, nonvoided journal details and accounting Date.
Period is [FiscalYear.StartDate.Date, day-after-effective-end), where effective
end is the optional asOfDate within that fiscal year, otherwise its EndDate.
If only asOfDate is supplied, resolve its unique containing tenant fiscal year;
failure/overlap or a date outside an explicitly chosen year fails actionably.
Cash report remains consolidated tenant-wide; no invented branch filter.

OpeningCash includes posted balances before period start plus that year's
OpeningBalanceJV at the start date; OpeningBalanceJV is not a period movement.
ClosingCash is raw selected-cash balance through effective end. Exclude ClosingJV
from profit/row movements. Unexpected dated opening entries or cash-bearing
closing entries are diagnostics, not hidden adjustments. Use half-open day ranges
so the last day's timestamps are included.

For each period journal, net selected cash debit-credit. Pure internal cash
transfers have net0 and no external targets and contribute0. Deterministic cash
attribution requires balanced journal detail totals and noncash counterpart lines
all opposite to the nonzero net cash side (ignore zero values). Each such raw
counterpart amount can then be assigned without a proportion to its unique row;
unmapped P&L/current-working-capital counterparts belong to the ordinary operating
basis only when that basis is explicitly covered. Mixed-sign noncash legs,
unmapped noncurrent/equity targets, invalid/stale mappings or ambiguous mixed
transactions produce typed diagnostics with journal identity/date, amount and
reason. Do not invent a distribution or balancing row. Do not claim that a
Payment record without a posted JV is a cash movement.

Return BeginningCash, EndingCash, ReconciliationDifference =
EndingCash-BeginningCash-NetChangeInCash, IsReconciled (zero difference at ledger
precision AND no unresolved issues), UnresolvedAmount (sum of absolute diagnostic
cash amounts, not a signed total), Diagnostics. Never label the report reconciled
solely because unresolved debit/credit issues cancel. Amounts remain decimals;
shared ledger precision applies, no frontend re-sum. Report is a provisional
complete result when diagnostics exist, with explicit status on screen/print/Excel.

## Settings service / API / DTO freeze

IFinancialReportSettingsService under Business.IServices; concrete service in
Business.Services (normal DI scan); internal helper records own files.

GET FinancialReportSettings/{fiscalYearId} -> Result<FinancialReportSettingsDetailVM>
PUT FinancialReportSettings/{fiscalYearId} -> same wrapper after successful save.
GET FinancialReportSettings/Options -> Result<FinancialReportSettingsOptionsVM>.
DELETE FinancialReportSettings/{fiscalYearId}/Rows/{key} -> Result.
POST FinancialReportSettings/{fiscalYearId}/Initialize -> Result<DetailVM>
(explicit idempotent setup for pre-existing fiscal years, preserves an existing header).

SaveVM: cashAccountIds:int[], rows:CashFlowReportRowInputVM[].
RowInput: key:string,name:string,nameLocalized:string?,activity:int,method:int,
sortOrder:int,isEnabled:bool,allowedTypeIds:int[],accountIds:int[].
Detail: fiscalYearId:int,isConfigured:bool,inheritedFromFiscalYearId:int?,
cashAccountIds:int[],rows:RowDetail[],warnings:string[].
RowDetail has all input properties plus warnings:string[]. Options:
types:{id:int,value:string,nameLocalized:string?,kind:int,category:int,reportSubGroup:int}[];
accounts:{id:int,value:string,nameLocalized:string?,accountTypeId:int,kind:int,
category:int,reportSubGroup:int}[]; value includes code/name. No client tenant,
audit, IsSystem, calculated amounts or entity Id as ownership proof.
Public VMs each own a file. New explicit maps ignore server-owned members and
reconcile owned children only. Both failures return actionable localized messages.

EnsureForFiscalYearAsync(int,ct)->Result owns idempotent persisted initialization,
copying the most recent earlier tenant fiscal year's stored configuration, else
the default template. It may save and must reuse an existing caller transaction.
Root integrates it into FiscalYearService.AddAsync before transaction commit,
and into unified account setup for existing fiscal years after type initialization.
No read inserts. Get without configuration returns the fresh template for editing
with isConfigured=false (no inheritance-by-reference); report fails with setup
instruction until explicitly initialized/saved. Existing-year Initialize captures
the prior snapshot once; it never overwrites a configured year.
Settings Save uses one guarded transaction/one save; concurrent initialization
must not duplicate a year. Inheritance preserves stale IDs with warnings rather
than silently changing the previous year's configuration or aborting year creation.
Settings edits restate reports of that selected year only, including historical
years; no new close/reopen permission or state restriction is invented.

## Default template

Bootstrap clarification: explicit Ensure/Initialize/setup may populate missing
allowed types on a known template row only when both its type and account mapping
sets are empty. Filter candidate seed kinds against that row's actual current
method/activity; preserve all metadata, nonempty choices, cash scope and custom
rows. This repairs fiscal-year-before-chart initialization without read writes
or overwriting any selected account/type. Configured snapshots otherwise stay
unchanged, and no historical row is shared across years.

Thirteen named bilingual rows, order increments10; accounts initially empty and
allowed types selected from matching current definitions' Kind, never by name.
User selects actual accounts; no literal old cashflow IDs are copied.

| Key | Label | Activity/method | Initial allowed kinds |
|---|---|---|---|
| depreciation | Depreciation / الإهلاك | 1/1 | Depreciation |
| amortization | Amortization / إطفاء الأصول غير الملموسة | 1/1 | Expenses,OtherExpenses |
| receivables | Receivables change / التغير في الذمم المدينة | 1/2 | Receivable |
| payables | Payables change / التغير في الذمم الدائنة | 1/2 | Payable,CreditCard,CurrentLiabilities |
| inventories | Inventory change / التغير في المخزون | 1/2 | CurrentAssets |
| provisions | Provisions change / التغير في المخصصات | 1/2 | CurrentLiabilities |
| interest-paid | Interest paid / الفوائد المدفوعة | 1/3 | Expenses,OtherExpenses,CurrentLiabilities,NonCurrentLiabilities |
| tax-paid | Tax paid / الضرائب المدفوعة | 1/3 | Expenses,OtherExpenses,CurrentLiabilities |
| assets | Asset acquisitions and disposals / اقتناء الأصول والتصرف فيها | 2/3 | FixedAssets,NonCurrentAssets |
| investments | Investments and withdrawals / الاستثمارات والسحوبات | 2/3 | CurrentAssets,NonCurrentAssets |
| dividends-received | Dividends received / توزيعات الأرباح المقبوضة | 2/3 | Income,OtherIncome,CurrentAssets |
| long-term-debt | Long-term debt change / التغير في الديون طويلة الأجل | 3/3 | NonCurrentLiabilities |
| dividends-paid | Dividends paid / توزيعات الأرباح المدفوعة | 3/3 | Equity,CurrentLiabilities |

These are editable template choices, not a claim of standard compliance for all
periods/entities. Existing19 semantic roles are sufficient for these filters;
users may add detailed named types under their appropriate role/subgroup. No
new role enum is required merely to name a cash-flow row. Interest/dividend
activity can be configured; framework-specific starting-profit changes are not
part of this current net-profit-based owner decision.

## Frontend, presentation and guide

Route /FinancialReportSettings; Accounts sidebar label Financial Report Settings /
إعدادات التقارير المالية. One tabbed settings workspace: three activity tabs,
selected fiscal year, cash-scope multiselect, one shared save; row Add/Edit/View
dialog through EditorDialog. Allowed types and accounts are typed multiselect
fields, not separate CRUD child editors. Method/activity conditional validators
match backend. Definition row Delete is explicit, confirmed, persisted separately;
unsaved new-row removal affects the draft only. No deletion by Save omission.
Dirty dialog/workspace/year-switch/navigation guards; failed load/save keeps
draft and retry, cancellation/stale protections; failed required options block Save.
Reference current LinkAccounts workspace and shared components, logical CSS,
one internal content scroll owner, EN/AR/RTL/theme/mobile. Reuse existing
AccountSetting editor to create detailed types; no duplicate classification owner.

Grid: actions, row name, method, allowed type names, selected account names,
order, enabled. RowDetail input fields + warnings are exact UI needs; no generic
ListVM/pager required for a complete small settings set. Report screen retains
existing complete statement and ledger links, adds authoritative cash proof and
diagnostic table/status; export/print include the same reconciliation and issues.
CashFlowLineVm adds RowKey:string?,NameLocalized:string?; aggregate row has
AccountId0; genuine single-account lines can link only to the true account.
CashFlowVm adds FiscalYearId:int, BeginningCash,EndingCash,
ReconciliationDifference,IsReconciled,UnresolvedAmount,Diagnostics:CashFlowDiagnosticVm[].
Diagnostic: journalVoucherId:int?,date:DateTime?,amount:decimal,reason:string.
New engine owns read/calculation; existing AccountReportsService delegates its
CashFlow action only, all other prior report fixes preserved. Retire literal-ID
CashFlowAccountCodes after caller search proves no remaining consumers.

## Work ownership / verification

Root: contract, integration in FiscalYearService/SeedDataService, guide, resources,
final review. Settings worker: new settings entities/configs/VMs/profile/service/
controller and only its DbSet additions in SiGmaDbContext. Engine worker: new
cash-flow report engine/interface/diagnostic VM and CashFlowVm/LineVm plus existing
AccountReportsService cash-flow delegation; no other report logic. UI worker:
new FinancialReportSettings folder, CashFlowStatement models/component, its own
financial-report-settings.ts EN/AR dictionary imported at root, route/sidebar and
explicit app compile roots. Root owns accounts-guide.ts and existing resource files.
All workers preserve peer/user changes; no overlapping file edits or migration/
snapshot/build/test/lint/database/browser/commit/push/deploy commands. Source-only
checks and manual owner verification; owner migration AddFinancialReportCashFlowSettings.
