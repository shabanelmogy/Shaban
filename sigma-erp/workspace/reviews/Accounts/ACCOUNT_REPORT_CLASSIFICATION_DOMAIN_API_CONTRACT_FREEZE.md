# Account report classification names from persisted settings

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Date2026-10-23. Owner explicitly reiterates retaining former main/subgroups, seeding existing/new charts and sourcing groups from the database instead of enums. This amendment changes visible classification sources together across producer/consumer; original keys and financial histories remain intact. No database/build/test/migration/browser execution authorized or needed for implementation.

## Frozen report boundary

- Existing five Category and fourteen reporting-subgroup keys remain internal accounting semantics, not hardcoded display-name sources. Seed those definition records from the existing scheme and preserve current Account.Category/SubGroup/ParentId.
- Preserve real ledger account names, including distinct level2 containers sharing a report key and level2 posting accounts. Do not rename every level2 account to a common subgroup name.
- The unique category-root display name may use its persisted canonical system Group name, choosing NameLocalized for Arabic and Name otherwise, with existing Account.Name fallback if no definition exists. Non-root account names remain unchanged. All current report account IDs, tree topology, scope/date/branch logic and paging contracts stay unchanged.
- Where IncomeStatement2 explicitly displays a classification subgroup, its line response adds ReportSubGroup:int?, SubGroupName:string?, SubGroupNameLocalized:string?. The exact matching typed placement supplies names, preserving custom subgroup identities; untyped legacy accounts fall back to the canonical system subgroup for their stored key. Preserve legacy SubGroup:string? for old consumers, but the current UI reads the new name fields. Never compare translated/name strings for subtotal calculations; compare preserved numeric report keys.
- Resolve classification names from tenant-scoped tables in a bounded shared helper, with no definition active-state filter that could remove financial account rows. Names must not determine formula inclusion. Screen/print/export read the same report response names.
- Budget and BudgetVariance currently label the five financial categories as account types. Replace those hardcoded name options with GET AccountGroupDefinition/ReportOptions -> Results<AccountReportGroupOptionVM>, a DropdownDto extension with NameLocalized:string?: Id is the existing Category numeric filter value; Value is the persisted canonical system Group base name and NameLocalized is its saved Arabic name. This endpoint selects stored canonical groups, not Enum.GetValues. The existing shared report option owner selects a supplied localized label when the language changes, preserving selected IDs/drafts and requiring no extra request. Add optional nameLocalized to the shared dropdown read model and optional labelLocalized to report options; existing options without them keep their behavior. Budget uses the same bilingual persisted values. Preserve numeric filter meanings and current defaults; lookup failure must block dependent Search/Save using existing owners. No new permission API.
- The compatibility GET Account/SubGroups route also reads canonical persisted system subgroup definitions rather than Enum.GetValues. Retain its Result<List<DropdownDto>> wrapper and numeric ReportSubGroup IDs; return localized persisted names. Seed new canonical subgroup names from the original14 reporting meanings, not the first structural level2 Account.Name (several different account containers share one reporting meaning). Preserve previously configured definition names; never rename real ledger account containers.

## Confirmed report consistency fix

Source review found IncomeStatement2 and Ytd2 detailed NetProfitLoss omit OtherRevenue/OtherExpense and can count configured asset-sale accounts again. Authoritative header totals already cover all Revenue/Expense accounts. Set detailed NetProfitLoss to the same complete revenue-minus-expense result in each column. Set ProfitLossBeforeSaleOfAssets to that result minus the separately resolved ProfitLossOnSaleOfAssets, so the sale component occurs exactly once. Retain the existing GrossProfit subtotal contract and source financial queries; do not redesign cash-flow treatment or posting rules in this slice.

## Audit finding outside this amendment

### Confirmed hierarchy aggregation correction — 2026-10-23

Final source audit established a deterministic double-count in IncomeStatement,
VehicleIncomeStatement, IncomeComparison, IncomeStatement2, IncomeStatementYtd,
IncomeStatementYtd2, IncomeStatementFy and IncomeStatementFy2: each line in
leaf-first order sends its mutable already-aggregated balance to every ancestor.
For a three-node chain with one100 leaf, root becomes200 rather than100.
The owner's financial-report verification/continuation authorizes correcting
this existing arithmetic defect. Use the existing report helper as shared owner
for one bottom-up direct-parent accumulation, retaining each node's raw own
amount plus descendants exactly once. Keep trial balance's existing immutable
raw-snapshot logic and balance sheet's recursive single-count aggregation.
No ledger writes, journal timing, recognition policy or custom new financial
formula is introduced. Update the report guide and numeric owner checks.

The same source-confirmed defect also exists in GetBalanceSheetMonthwiseAsync:
it initializes only leaf amounts and forwards mutable totals to every ancestor.
Apply the same shared direct-parent accumulation there, initializing each node
from its own raw monthly amount so legitimate parent postings are retained.
This is the same arithmetic correction within the owner's report scope; retain
the existing month selection, response structure and balance formula.

CashFlowAccountCodes uses literal database identities and can silently select wrong/missing accounts after a fresh seed. Arbitrary IDs cannot be safely inferred into a new operating/investing/financing accounting policy from only19 account roles. The audit must report this concrete limitation rather than claim all financial reports numerically verified. No replacement cash-flow policy or literal-ID rewrite is invented in the label/seeding amendment.

## Ownership / source references

- Root: shared freeze, unified SeedDataService/interface/controller, integration, guide and final scoped reconciliation.
- backend_taxonomy: bounded report classification helper/AccountReportHelper, AccountReportsService label and two detailed net-profit fixes, IncomeStatement2 line DTO, GroupDefinition ReportOptions service/interface/controller. Read BE17/UI20 and actual current report/shared producer. Preserve all other peer/user changes and the user's new migration/snapshot.
- frontend_taxonomy: IncomeStatement2 models/component DB labels for screen/export, AccountClassificationService ReportOptions, Budget/BudgetVariance typed DB lookups and required/error/loading behavior. Root owns guide content. No other screen redesign.
- Existing normal master shape (BE13), report read shape (BE17/UI20) and shared report-family component remain owners. No generated packets, reference module, migrations or snapshots may be edited; source-only verification applies.
