# Branch operation endpoint matrix — bounded source inventory

| Status | Owner verification pending |
|---|---|
| Draft | yes |

## Scope and classification rule

This source-only matrix covers only `AccountReportsController`,
`BusinessReportsController`, `VehicleReportsController`,
`StockReportsController`, `SalesReportsController`, and `DashboardController`.
Each row follows the controller call to its concrete service method. `READ` means
the path does not persist application data; `WRITE` means the service adds,
updates, voids, or saves database state. The HTTP verb and `Get` prefix were not
used as classification rules: `DashboardController.Agreements2` is `POST` but
its service only projects rows, so it is `READ`.

`REPORT_EFFECT_ROWS_OR_AGGREGATES` means a flat report row, line, export, or
aggregate/summary whose branch predicate must be applied before the effect is
counted or summed. `WHOLE_DOCUMENT` also applies when a read counts a document
workflow state or exposes an agreement's complete saved amounts: output shape
alone does not authorize dropping the parent's all-edges policy. Final review
corrected both Dashboard reads to whole-document mode; a projected row is not
automatically a journal-effect read.

## AccountReportsController → AccountReportsService

Source: `SigmaBackend/SiGma.ServerAPI/Controller/AccountReportsController.cs`;
service: `SigmaBackend/SiGma.Business/Services/AccountServices/AccountReportsService.cs`.

| Endpoint (controller method) | Owner service method | Operation | Output/use shape | Evidence |
|---|---|---|---|---|
| `GET /AccountReports/IncomeStatement` (`GetIncomeStatement`) | `GetIncomeStatementAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES | Controller `:14-21`; service `:45+`, ledger report calculations. |
| `GET /AccountReports/BalanceSheet` (`GetBalanceSheet`) | `GetBalanceSheetAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES | Controller `:24-31`; service `:183+`. |
| `GET /AccountReports/CashFlow` (`GetCashFlow`) | `GetCashFlowIndirectAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES | Controller `:34-41`; service `:260+`. |
| `GET /AccountReports/TrialBalance` (`GetTrialBalance`) | `GetTrialBalanceAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES | Controller `:44-51`; service `:333+`. |
| `GET /AccountReports/BalanceSheetMonthwise` (`GetBalanceSheetMonthwise`) | `GetBalanceSheetMonthwiseAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES | Controller `:54-61`; service `:528+`. |
| `GET /AccountReports/VehicleIncomeStatement` (`GetVehicleIncomeStatement`) | `GetVehicleIncomeStatementAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES | Controller `:64-71`; service `:673+`. |
| `GET /AccountReports/IncomeComparison` (`GetIncomeComparison`) | `GetIncomeComparisonAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES | Controller `:74-81`; service `:846+`. |
| `GET /AccountReports/IncomeStatement2` (`GetIncomeStatement2`) | `GetIncomeStatement2Async` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES | Controller `:84-91`; service `:1003+`. |
| `GET /AccountReports/IncomeStatementYtd` (`GetIncomeStatementYtd`) | `GetIncomeStatementYtdAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES | Controller `:94-101`; service `:1209+`. |
| `GET /AccountReports/IncomeStatementYtd2` (`GetIncomeStatementYtd2`) | `GetIncomeStatementYtd2Async` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES | Controller `:104-111`; service `:1385+`. |
| `GET /AccountReports/IncomeStatementFy` (`GetIncomeStatementFy`) | `GetIncomeStatementFyAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES | Controller `:114-121`; service `:1631+`. |
| `GET /AccountReports/IncomeStatementFy2` (`GetIncomeStatementFy2`) | `GetIncomeStatementFy2Async` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES | Controller `:124-131`; service `:1883+`. |
| `GET /AccountReports/Ledger` (`GetLedger`) | `GetLedgerAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES | Controller `:134-141`; service `:2067+`, journal-detail ledger rows. |
| `GET /AccountReports/Journals` (`GetJournals`) | `GetJournalsAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES | Controller `:144-151`; service `:2280-2433`, flat `JournalVoucherDetail` rows and paging. |
| `GET /AccountReports/Budget` (`GetBudget`) | `GetBudgetAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES | Controller `:154-161`; service `:2439-2523`, budget grid rows. |
| `POST /AccountReports/Budget` (`SaveBudget`) | `SaveBudgetAsync` | **WRITE** | REPORT_EFFECT_ROWS_OR_AGGREGATES (budget cells) | Controller `:164-171`; service validates cells, `AddRangeAsync`/`UpdateRange`, then `SaveChangesAsync` at `:2525-2617`. |
| `GET /AccountReports/BudgetVariance` (`GetBudgetVariance`) | `GetBudgetVarianceAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES | Controller `:174-181`; service `:2624+`. |
| `GET /AccountReports/BankReconciliation` (`GetBankReconciliationSession`) | `GetReconciliationSessionAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (ledger aggregate + unreconciled lines) | Controller `:184-191`; service `:2756-2860` reads ledger lines and computes balances; no save. |
| `POST /AccountReports/BankReconciliation` (`CompleteReconciliation`) | `CompleteReconciliationAsync` | **WRITE** | REPORT_EFFECT_ROWS_OR_AGGREGATES (selected ledger lines; creates session) | Controller `:194-201`; service `:2872+`, creates `BankReconciliation`/lines and saves at `:3009`. |
| `POST /AccountReports/BankReconciliation/{id}/Void` (`VoidReconciliation`) | `VoidReconciliationAsync` | **WRITE** | REPORT_EFFECT_ROWS_OR_AGGREGATES (reconciliation session state) | Controller `:211-218`; service `:3050-3103`, calls `entity.Void` and `SaveChangesAsync`. |
| `GET /AccountReports/ReconciliationReport` (`GetReconciliationReport`) | `GetReconciliationReportAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (session report rows) | Controller `:220-227`; service `:3118+`, projects historical session rows. |

The account report service has no other persistence calls in the inspected
read methods. Its only write sites are budget save (`:2602-2611`),
reconciliation completion (`:3009`), and reconciliation void (`:3101`).

## BusinessReportsController → BusinessReportsService

| Endpoint (controller method) | Owner service method | Operation | Output/use shape | Evidence |
|---|---|---|---|---|
| `GET /BusinessReports/ProfitLossBranchesReport` (`ProfitLossBranchesReport`) | `CreateProfitLossBranchesReport` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (branch rows + summary) | Controller `BusinessReportsController.cs:20-36`; service `BusinessReportsService.cs:24-100` groups invoice revenue and payment expense by branch and sums rows. |

## VehicleReportsController → VehicleReportsService

| Endpoint (controller method) | Owner service method | Operation | Output/use shape | Evidence |
|---|---|---|---|---|
| `GET /VehicleReports/VehicleRentalDetails` (`CreateVehicleRentalDetailsReport`) | `CreateVehicleRentalDetailsReport` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (vehicle/day status rows) | Controller `VehicleReportsController.cs:24-31`; service `VehicleReportsService.cs:37+` projects vehicle rows and booking/rental intervals. |
| `GET /VehicleReports/VehicleProfitAndLoss` (`VehicleProfitAndLoss`) | `CreateVehicleProfitAndLossReport` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (vehicle P&L rows/totals) | Controller `:34-41`; service `VehicleReportsService.cs:432+` aggregates invoice revenue and bill-detail expense by vehicle. |
| `GET /VehicleReports/VehicleProfitAndLossDetail` (`VehicleProfitAndLossDetail`) | `CreateVehicleProfitAndLossDetailReport` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (invoice/bill effect rows) | Controller `:44-51`; service `VehicleReportsService.cs:536+` builds flat detail rows. |
| `GET /VehicleReports/VehicleProfitAndLossWithSellingDetail` (`VehicleProfitAndLossWithSellingDetail`) | `CreateVehicleProfitAndLossWithSellingDetailReport` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (effect rows + selling metadata) | Controller `:54-60`; service `VehicleReportsService.cs:682+` builds flat invoice/bill rows. |
| `GET /VehicleReports/VehiclePriceBasedOnTariffGroup` (`VehiclePriceBasedOnTariffGroup`) | `GetVehiclePriceBasedOnTariffGroupAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (vehicle/tariff price rows) | Controller `:63-69`; service `VehicleReportsService.cs:918+` projects one price row per vehicle. |
| `GET /VehicleReports/VehiclesRevenue` (`VehiclesRevenue`) | `CreateVehiclesRevenueReport` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (vehicle revenue rows/totals) | Controller `:72-78`; service `VehicleReportsService.cs:253+` builds revenue rows and totals. |
| `GET /VehicleReports/VehiclesProfitAndLoseByChassisNo` (`VehiclesProfitAndLoseByChassisNo`) | `CreateVehiclesProfitAndLoseByChassisNoReport` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (chassis-scoped effect rows) | Controller `:81-104`; service `VehicleReportsService.cs:1069+` builds invoice/expense rows for matched vehicles. |

## StockReportsController → StockReportsService

All eight methods below query report lines, join headers/lookups, and return
paged/complete rows with totals or metrics. They do not return a full document
editor/detail graph.

| Endpoint (controller method) | Owner service method | Operation | Output/use shape | Evidence |
|---|---|---|---|---|
| `GET /StockReports/GetStockSummary` (`GetStockSummary`) | `GetStockSummaryAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (stock quantities/value) | Controller `StockReportsController.cs:19-26`; service `StockReportsService.cs:21-113`, sums opening/GRN/returns/issues/transfers. |
| `GET /StockReports/GetPurchaseOrdersDetail` (`GetPurchaseOrdersDetail`) | `GetPurchaseOrdersDetailAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (PO detail lines) | Controller `:29-36`; service `StockReportsService.cs:245-286`, projects `PurchaseOrderDetail` rows and totals. |
| `GET /StockReports/GetPurchasesDetailReport` (`GetPurchasesDetailReport`) | `GetPurchasesDetailReportAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (GRN detail lines) | Controller `:39-46`; service `StockReportsService.cs:288-341`, projects `GoodsReceivedNoteDetail` rows and totals. |
| `GET /StockReports/GetDetailedStockReport` (`GetDetailedStockReport`) | `GetDetailedStockReportAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (stock movement quantities) | Controller `:49-56`; service `StockReportsService.cs:115-243`, computes beginning/in/out/ending quantities and totals. |
| `GET /StockReports/GetItemsIssueReport` (`GetItemsIssueReport`) | `GetItemsIssueReportAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (issue lines + amount metrics) | Controller `:59-66`; service `StockReportsService.cs:343+`, projects `ItemIssueItem` rows. |
| `GET /StockReports/GetItemsReturnReport` (`GetItemsReturnReport`) | `GetItemsReturnReportAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (return lines + amount metrics) | Controller `:69-76`; service `StockReportsService.cs:402+`, projects `ItemReturnItem` rows. |
| `GET /StockReports/GetGrnPendingReport` (`GetGrnPendingReport`) | `GetGrnPendingReportAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (pending PO/GRN lines) | Controller `:79-86`; service `StockReportsService.cs:466-574`, groups PO lines and computes pending quantities. |
| `GET /StockReports/GetPartsMovingReport` (`GetPartsMovingReport`) | `GetPartsMovingReportAsync` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (item issue aggregates) | Controller `:89-96`; service `StockReportsService.cs:576-618`, computes as-of/week/month issue metrics. |

## SalesReportsController → SalesReportsService

| Endpoint (controller method) | Owner service method | Operation | Output/use shape | Evidence |
|---|---|---|---|---|
| `GET /SalesReports/SalesReport` (`SalesReport`) | `CreateSalesReport` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (agreement revenue rows) | Controller `SalesReportsController.cs:24-42`; service `SalesReportsService.cs:31-181` projects rental/lease rows with revenue. |
| `GET /SalesReports/SaleReportBaseOnInvoice` (`SaleReportBaseOnInvoice`) | `CreateSaleReportBaseOnInvoice` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (invoice effect rows) | Controller `:46-65`; service `SalesReportsService.cs:207-297` projects invoice rows. |
| `GET /SalesReports/SalesPersonInvoicesReport` (`SalesPersonInvoicesReport`) | `CreateSalesPersonInvoicesReport` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (invoice rows + totals) | Controller `:68-87`; service `SalesReportsService.cs:299-449` concatenates invoice-family rows and sums totals. |
| `GET /SalesReports/SalespersonDiscountReport` (`SalespersonDiscountReport`) | `CreateSalespersonDiscountReport` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (salesperson discount buckets) | Controller `:90-109`; service `SalesReportsService.cs:451-545` groups agreement effects by salesperson. |
| `GET /SalesReports/SalesReportExport` (`SalesReportExport`) | `ExportSalesReportExcel` → `CreateSalesReport` | READ | REPORT_EFFECT_ROWS_OR_AGGREGATES (export of sales rows) | Controller `:112-142`; service `SalesReportsService.cs:183-205` calls the read report then formats bytes; no persistence. |

## DashboardController → DashboardService

| Endpoint (controller method) | Owner service method | Operation | Output/use shape | Evidence |
|---|---|---|---|---|
| `GET /Dashboard/Snapshot` (`Snapshot`) | `GetSnapshotAsync` | READ | WHOLE_DOCUMENT (workflow counts and branch groups) | Service `DashboardService.cs:412-417` counts pending JV headers; report-effect mode would count forbidden headers. Final classification regression is covered in BranchOperationRulesTests. |
| `POST /Dashboard/Agreements2` (`Agreements2`) | `SearchAgreementAnalysisAsync` | READ | WHOLE_DOCUMENT (projected agreement amounts) | Service `DashboardService.cs:464-560` projects saved agreement rows and ChargesSum; no journal-line effect is consumed. Read-only despite POST; no partial-parent permission. |

## Explicit names for `BranchOperationRules`

**READ / `ForTransactions = false` candidate set:** every endpoint listed above except the three AccountReports
write endpoints. In compact owner.method form:

- `AccountReportsService.GetIncomeStatementAsync`
  `GetBalanceSheetAsync` `GetCashFlowIndirectAsync` `GetTrialBalanceAsync`
  `GetBalanceSheetMonthwiseAsync` `GetVehicleIncomeStatementAsync`
  `GetIncomeComparisonAsync` `GetIncomeStatement2Async`
  `GetIncomeStatementYtdAsync` `GetIncomeStatementYtd2Async`
  `GetIncomeStatementFyAsync` `GetIncomeStatementFy2Async` `GetLedgerAsync`
  `GetJournalsAsync` `GetBudgetAsync` `GetBudgetVarianceAsync`
  `GetReconciliationSessionAsync` `GetReconciliationReportAsync`.
- `BusinessReportsService.CreateProfitLossBranchesReport`.
- `VehicleReportsService.CreateVehicleRentalDetailsReport`
  `CreateVehicleProfitAndLossReport` `CreateVehicleProfitAndLossDetailReport`
  `CreateVehicleProfitAndLossWithSellingDetailReport`
  `GetVehiclePriceBasedOnTariffGroupAsync` `CreateVehiclesRevenueReport`
  `CreateVehiclesProfitAndLoseByChassisNoReport`.
- `StockReportsService.GetStockSummaryAsync`
  `GetPurchaseOrdersDetailAsync` `GetPurchasesDetailReportAsync`
  `GetDetailedStockReportAsync` `GetItemsIssueReportAsync`
  `GetItemsReturnReportAsync` `GetGrnPendingReportAsync`
  `GetPartsMovingReportAsync`.
- `SalesReportsService.CreateSalesReport` `CreateSaleReportBaseOnInvoice`
  `CreateSalesPersonInvoicesReport` `CreateSalespersonDiscountReport`
  `ExportSalesReportExcel`.
- `DashboardService.GetSnapshotAsync` `SearchAgreementAnalysisAsync`.

**WRITE / `ForTransactions = true` candidate set:**

- `AccountReportsService.SaveBudgetAsync` — creates/updates `AccountBudget`.
- `AccountReportsService.CompleteReconciliationAsync` — creates a
  `BankReconciliation` and its lines.
- `AccountReportsService.VoidReconciliationAsync` — mutates reconciliation
  state and saves it.

Both Dashboard reads use `WHOLE_DOCUMENT`; effect mode remains limited to the
explicit financial effect-report owners. This does not decide unrelated
document controllers. The final classification correction had two RED tests
and then passed within the 46-test root suite.

## Verification boundary

The original inventory was source-only. Root integration subsequently changed
BranchOperationRules under the authorized workflow and executed its regression
tests; full evidence and remaining coverage are in
USER_BRANCH_ACCESS_FINAL_RECONCILIATION.md. The inventory worker ran no commands.
