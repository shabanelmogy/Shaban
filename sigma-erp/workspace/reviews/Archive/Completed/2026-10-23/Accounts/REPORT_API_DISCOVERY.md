# Accounts Report API Discovery

| Status | Owner verification pending |
|---|---|
| Draft | yes |

## Scope and evidence

This is a source-only discovery of the AccountReports producer. Sources inspected:

- `SigmaBackend/SiGma.ServerAPI/Controller/AccountReportsController.cs`
- `SigmaBackend/SiGma.Business/IServices/IAccountReportsService.cs`
- `SigmaBackend/SiGma.Business/Services/AccountServices/AccountReportsService.cs`
- `SigmaBackend/SiGma.Business/Services/AccountServices/AccountReportHelper.cs`
- `SigmaBackend/SiGma.ViewModels/ViewModels/AccountReports/*.cs`
- directly related Accounts Angular report services and models under `SiGmaAngularFrontEnd/src/app/modules/Accounts`

`AccountReportsController` has `[Route("[controller]")]` and `[Authorize]`; therefore the routes below are `GET /AccountReports/<action>` unless noted. Every request DTO derives from `SpecificationRequestDto`, whose transport is `Filters[<name>]`, `PageNumber` (default 1), and `PageSize` (default 20).

## Existing GET contracts

All rows below return the generic `Result<T>` envelope (`isSuccess`, `message`, `entity`). The report DTOs are complete, unpaged aggregate responses unless marked otherwise.

| GET route | Request/filter keys read by service | Response DTO and complete shape | Paging/count evidence |
|---|---|---|---|
| `/AccountReports/IncomeStatement` | `fromDate`, `toDate`, `branchId`, `costCenterGroupId`, `accountLevel`, `hideZeroActivity` | `IncomeStatementVm`: `TotalRevenue`, `TotalExpenses`, computed `ProfitLoss`, `Lines: IncomeStatementLineVm[]`. Each line: `AccountId`, `Code`, `Name`, `Level`, `ParentId`, `AllowChildren`, `Balance`, `Budget`, computed `Variance`, `Children[]`. | Complete nested tree; no `Skip`/`Take`, no `TotalCount`. |
| `/AccountReports/BalanceSheet` | `asOfDate`, `includeZeros` | `BalanceSheetVm`: `TotalAssets`, `TotalLiabilities`, `TotalEquity`, `Assets[]`, `Liabilities[]`, `Equity[]` of `BalanceSheetLineVm` (`AccountId`, `Code`, `Name`, `Level`, `ParentId`, `Amount`, `Children[]`). | Complete three-root tree; no paging metadata. |
| `/AccountReports/CashFlow` | `fiscalYearId`, `asOfDate` | `CashFlowVm`: `NetIncome`, `OperatingActivities[]`, `InvestingActivities[]`, `FinancingActivities[]`, `NetCashFromOperating`, `NetCashFromInvesting`, `NetCashFromFinancing`, `NetChangeInCash`. Line: `AccountId`, `Code`, `Name`, `Amount`. | Complete section arrays; no paging metadata. |
| `/AccountReports/TrialBalance` | `fromDate`, `toDate`, `branchId`, `costCenterGroupId`, `accountLevel`, `hideZeroActivity`, `hideZeroEndingBalance`, `leafOnly` | `TrialBalanceVm`: `TotalDebit`, `TotalCredit`, `Lines[]`. Each line: `AccountId`, `AccountCode`, `AccountName`, `AccountLevel`, `ParentId`, `AllowChildren`, `BeginningBalance`, `Debit`, `Credit`, computed `NetActivity`, computed `EndingBalance`, `Children[]`. | Complete nested tree; no paging metadata. |
| `/AccountReports/BalanceSheetMonthwise` | `asOfMonth` (required `yyyy-MM`), `periodMonths` (default 12), `branchId`, `costCenterGroupId`, `hideZeroActivity` | `BalanceSheetMonthwiseVm`: `Months[]`, `Lines[]`. Each line: `AccountId`, nullable `AccountCode`/`AccountName`, `AccountLevel`, `ParentId`, `AllowChildren`, `MonthlyBalances: Dictionary<string,decimal>`, `Children[]`. | Complete nested tree/month matrix; no paging metadata. |
| `/AccountReports/VehicleIncomeStatement` | `fromDate`, `toDate`, `branchId`, `costCenterGroupId`, `ownershipType`, `accountLevel`, `hideZeroActivity` | `VehicleIncomeStatementVm`: `TotalRevenue`, `TotalExpenses`, computed `ProfitLoss`, `Lines: IncomeStatementLineVm[]` (same fields as IncomeStatement, including nested `Children`). | Complete nested tree; no paging metadata. |
| `/AccountReports/IncomeComparison` | `fromDate1`, `toDate1`, `fromDate2`, `toDate2`, `branchId`, `costCenterGroupId`, `hideZeroActivity` | `IncomeComparisonVm`: period 1/2 totals and computed values (`TotalRevenue1`, `TotalExpenses1`, `ProfitLoss1`, `TotalRevenue2`, `TotalExpenses2`, `ProfitLoss2`, `ProfitLossVariance`), plus `Lines[]` (`AccountId`, `Code`, `Name`, `Level`, `ParentId`, `AllowChildren`, `Balance1`, `Balance2`, computed `Variance`, `Children[]`). | Complete nested tree; no paging metadata. |
| `/AccountReports/IncomeStatement2` | `fromDate`, `toDate`, `branchId`, `hideZeroActivity` | `IncomeStatement2Vm`: `TotalRevenue`, `TotalExpenses`, computed `ProfitLoss`; four subtotal objects (`GrossProfitLoss`, `ProfitLossBeforeSaleOfAssets`, `ProfitLossOnSaleOfAssets`, `NetProfitLoss`), each `Balance`, `Budget`, computed `Variance`; `Lines[]` with account identity/hierarchy, `SubGroup`, `Balance`, `Budget`, computed `Variance`, `Children[]`. | Complete nested tree; no paging metadata. |
| `/AccountReports/IncomeStatementYtd` | `month` (required `yyyy-MM`), `branchId`, `costCenterGroupId`, `hideZeroActivity`, `summaryReport` | `IncomeStatementYtdVm`: `ProfitLossCurrentMonth`, `ProfitLossCurrentYtd`, `ProfitLossPreviousYearMonth`, `Lines[]` (`AccountId`, `Code`, `Name`, `Level`, `ParentId`, `AllowChildren`, `CurrentMonth`, `CurrentYtd`, `PreviousYearMonth`, `Children[]`). | Complete nested tree; no paging metadata. `summaryReport` changes line filtering/aggregation, not response envelope. |
| `/AccountReports/IncomeStatementYtd2` | `month` (required `yyyy-MM`), `branchId`, `hideZeroActivity`, `summaryReport` | `IncomeStatementYtd2Vm`: three top-level profit/loss values; four subtotal objects (`CurrentMonth`, `CurrentYtd`, `PreviousYearMonth`); `Lines[]` with account identity/hierarchy and the three period values plus `Children[]`. | Complete nested tree; no paging metadata. |
| `/AccountReports/IncomeStatementFy` | `fromMonth`/`fromDate`, `toMonth`/`toDate`, optional `dateRange`, `branchId`, `costCenterGroupId`, `hideZeroActivity` | `IncomeStatementFyVm`: `Months[]`, `TotalRevenue`, `TotalExpenses`, computed `NetProfitLoss`, optional `ParsedFilters`, `Lines[]` (`AccountId`, `Code`, `Name`, `Level`, `ParentId`, `AllowChildren`, `MonthlyBalances`, computed `Total`, `Children[]`). | Complete nested tree/month matrix; no paging metadata. |
| `/AccountReports/IncomeStatementFy2` | `fromMonth`/`fromDate`, `toMonth`/`toDate`, optional `dateRange`, `branchId`, `hideZeroActivity` | `IncomeStatementFy2Vm`: `Months[]`, `TotalRevenue`, `TotalExpenses`, computed `NetProfitLoss`, `Lines[]` (`AccountId`, `Code`, `Name`, `Level`, `ParentId`, `AllowChildren`, `MonthlyBalances`, computed `Total`). | Complete **flat** line array; no `Children` property and no paging metadata. Frontend model documents the same flat shape. |
| `/AccountReports/Ledger` | required `accountId`, `fromDate`, `toDate`, `branchId`, `costCenterGroupId`, `chassisOrPlateNo`, `showOriginalCurrency` | `LedgerVm`: account identity, `CurrencyCode`, `BeginningBalance`, `TotalDebit`, `TotalCredit`, computed `NetActivity`, computed `EndingBalance`, `Lines[]` (`Date`, `Type`, `VoucherNo`, `Contact`, `Vehicle`, `Description`, `Debit`, `Credit`, `Balance`, `CurrencyCode`). | Complete account ledger; no paging metadata. `chassisOrPlateNo` is filtered in memory. |
| `/AccountReports/BudgetVariance` | required `fiscalYearId`, optional `accountType` | `BudgetVarianceVm`: `Lines[]` (`AccountId`, `AccountCode`, `AccountName`, `Month`, `MonthNumber`, `Year`, `Actual`, `Budget`, computed `Variance = Budget - Actual`). | Complete fiscal-year line array; no paging metadata. |

## Adjacent AccountReports endpoints

These are in the same producer and matter when tracing the shared service, although they are outside the named report screens:

- `GET /AccountReports/Journals` returns `Results<JournalsLineVm>`, with `Entities[]` only for the requested page. It reads `voucherNo`, `type`, `chassisOrPlateNo`, `fromDate`, `toDate`, and `accountId`. `totalCount` is computed, but the success response sets `TotalPages` and omits `TotalCount`; the declared-failure response also omits `TotalCount`.
- `GET /AccountReports/BankReconciliation` returns a complete `BankReconciliationSessionVm` with `BankId`, `BankName`, `LedgerBalance`, `LastReconciliationDate`, `LastReconciledBalance`, `ReconciledBalance`, `Difference`, and `UnreconciledLines[]`.
- `GET /AccountReports/ReconciliationReport` returns `Results<ReconciliationReportLineVm>` but materializes all filtered sessions and returns `Entities` without `PageNo`, `PageSize`, `TotalCount`, or `TotalPages`; it is therefore transport-shaped as a paged result but implemented as an unpaged complete array.

## Paging and clamping proof

Only `GetJournalsAsync` uses `PageNumber`/`PageSize` with `Skip` and `Take`. It does not normalize either value, so a caller-supplied `PageSize <= 0` can produce invalid paging/division behavior and a negative `PageNumber` can produce an invalid skip. It also computes `totalCount` but does not return it. All other named report methods ignore the inherited paging fields and return their full aggregate/tree response.

The source does not establish a page-count contract for the named Accounts report screens. Their Angular services/models correctly consume `Result<DTO>` rather than `Results<T>`; `TrailBalanceService` explicitly sends only `Filters[...]` and no paging fields.

## Server hierarchy and calculation ownership

`AccountReportHelper` loads non-deleted account metadata, builds parent/child indexes, rolls leaf values up to ancestors, and builds trees. The report service owns aggregation over posted, non-voided journal voucher details. The backend computes derived totals/variance/net/ending values; clients should treat those values as authoritative. `IncomeStatementFy2` is the intentional flat exception; its `Level`/`ParentId` values support indentation without nested children.

## Frontend model/service comparison

The named Angular service endpoint strings match the controller routes for BalanceSheet, BalanceSheetMonthWise, IncomeStatement, IncomeStatement2, IncomeStatementFy, IncomeStatementFy2, IncomeStatementYtd, IncomeStatementYtd2, IncomeComparison, CashFlow, VehicleIncomeStatement, BudgetVariance, and Ledger. The TrialBalance service also matches and wraps the response as `Result<TrialBalanceDTO>`.

Observed source mismatches or contract risks:

1. `IncomeStatementFilter.hideBudget` exists in the Angular model but the backend reads no `hideBudget` key; it is currently a frontend-only filter with no server effect.
2. `BalanceSheetMonthWiseLine` marks `accountCode`/`accountName` required and omits `accountLevel`, `parentId`, and `allowChildren`, while the backend DTO exposes nullable code/name plus all three hierarchy fields. This is a model narrowing/omission, not a different route shape.
3. `CashFlowVm` declares the three activity arrays nullable while the Angular model requires arrays. The service currently constructs section lists, but nullability is not expressed consistently across the contract.
4. `IncomeStatementFy2` is flat in both backend and frontend, unlike the nested `IncomeStatementFy` shape; this distinction must remain explicit when reconciling shared report components.
5. `BudgetVarianceFilter` and backend both use `fiscalYearId` and `accountType`; the backend defaults the account category to Asset when `accountType` is omitted. That default is an existing server behavior, not a new policy decision.
6. `VehicleIncomeStatement` reuses backend `IncomeStatementLineVm`, while Angular declares a feature-specific equivalent; fields align (`balance`, `budget`, `variance`, and children).

## Open owner checks

- Owner should decide whether the inherited pagination fields on complete aggregate reports remain intentionally ignored or should be removed from the client request models during the Accounts review.
- Owner should verify whether `hideBudget` is obsolete or requires a backend contract; no implementation decision is made here.
- Owner should verify whether `BalanceSheetMonthWise` and `CashFlow` frontend nullability should be aligned with the server DTO declarations.
- Runtime, database, browser, and build verification were not run.

## Frozen handoff resolution and final source

The preceding findings/open checks describe discovery, not outstanding implementation decisions. `ACCOUNTS_REPORTS_CONTRACT_FREEZE.md` resolves complete aggregate requests, local hideBudget, aligned Monthwise nullability/hierarchy metadata, nullable CashFlow arrays and flat FY2. `ACCOUNTS_BUDGET_JOURNAL_CONTRACT_FREEZE.md` resolves adjacent Journal paging/counts and Budget period metadata/validation. All were integrated in final source; `ACCOUNTS_FEATURE_REVIEW.md` contains final reconciliation and owner-only verification. Existing BankReconciliation/ReconciliationReport behavior remains outside this screen scope.
