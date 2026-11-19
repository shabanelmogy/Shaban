# Customers report guide content evidence — 2026-10-08

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope owner | `src/app/modules/UserGuide/content/customer-report-topics.ts` |
| Frozen handoff | `USER_GUIDE_CUSTOMERS_CONTRACT_FREEZE.md` |
| Coverage | six report topics in the frozen Customers sidebar order |
| Recipe drift | `Generate-SigmaRecipes.ps1 -Check`: Phase06 current; PLAN00 and Phase00–05 stale; canonical books and current source used |
| Verification boundary | Source inspection and scoped content checks only; no build, tests, lint, runtime, browser, database, migration, commit or push |

## Topic and source mapping

| Topic identity / route | Frontend source symbols inspected | Backend/API evidence | Content decisions and limitations |
|---|---|---|---|
| `sideMenu.customerstatementOfAccount` / `/StatementOfAccount` | `Customers/StatementOfAccount/components/list/list.component.ts`: `filterForm`, `search`, `tabs`, `buildExportRows`, `buildChargesTypewiseExportRows`, `print`, `exportToExcel`; `list.component.html`; `models/list.ts`; `CustomerStatementOfAccountService.getStatement` | `SigmaBackend/SiGma.Business/Services/Customers/CustomerService.cs:GetCustomerStatementAsync` (line 816); `CustomerController.GetCustomerStatement`; `CustomerStatementResponseDto` and related report DTOs | Date range and customer are required; ledger/outstanding and inactive filter are actual controls. Ledger/supporting tabs and outstanding ageing are described. Export is active tab only; print uses loaded report sections. Report presentation is read-only, so no payment/refund/posting promise is made. |
| `sideMenu.balancesSummary` / `/BalancesSummary` | `Customers/BalancesSummary/components/list/list.component.ts`: `filterForm`, `getListItems`, `exportToExcel`, `openStatementReport`, `loadStatement`; `list.component.html`; `models/list.ts`; `BalancesSummaryService.getBalancesSummary` and `getAllBalancesSummary` | `CustomerService.GetCustomerBalancesSummaryAsync` (line 1276); `CustomerController.GetCustomerBalancesSummary`; `CustomerBalancesSummaryResponseDto` | Current-month default, lookup filters, balance type/range validation, paged metadata and all-page export are source-supported. Row action opens a ledger statement dialog with inactive entries. No mutation is implied. |
| `sideMenu.receivableAgeAnalysis` / `/ReceivableAgeAnalysis` | `Customers/ReceivableAgeAnalysis/components/list/list.component.ts`: `form`, `search`, `freezeAppliedPeriods`, `summaryCards`, `print`, `exportToExcel`; `list.component.html`; `models/list.ts`; `ReceivableAgeAnalysisService.getReceivableAgeAnalysis` | `CustomerService.GetReceivableAgeAnalysisAsync` (line 1567), response construction at lines 1824–1835; `CustomerController.GetReceivableAgeAnalysis`; `ReceivableAgeAnalysisResponseDto` | Today default, as-of validation, optional lookup filters, standard/custom strictly increasing buckets and report totals are mapped. Frontend sends `IncludeAllRows=true`, `PageSize=200`; backend response construction returns the complete ordered matching row set, and grid paging is local. No settlement/posting claim. |
| `sideMenu.alerts` / `/Alerts` | `Customers/Alerts/components/list/list.component.ts`: `filterForm`, `filteredAlerts`, `normalizeAlert`, `statusDetail`, `exportToExcel`; `list.component.html`; `models/list.ts`; `AlertsService.getAlerts` | `CustomerController.GetAlerts`; `AlertsService` endpoint `Customer/Alerts` | Customer lookup is optional; search/status filters are client-side after the endpoint response. Status is computed from expiry: expired before today, expiring soon through 30 days, valid after. No print action and no document lifecycle mutation are documented. |
| `sideMenu.debtCollection` / `/DebtCollection` | `Customers/debtCollection/components/report/report.component.ts`: `form`, `getListItems`, `statusChips`, `openFollowUp`, `openBlackList`, `saveBlackList`, `print`, `exportToExcel`; `report.component.html`; `models/debtCollection.ts`; `DebtCollectionReportService.getReport` | `CustomerService.GetDebtCollectionAsync` (line 298); `CustomerController.GetDebtCollection`; `DebtCollectionRequestDto` / `DebtCollectionResultDto` | Required today as-of date and all visible filters are captured. Service requests `PageSize=100`; component documentation and service confirm one capped response page without total, so counters, browser pages, print and Excel are explicitly limited to returned rows. Nested FollowUpReport dialog is kept inside this topic. Promised is a follow-up state, not proof of payment. Blacklist reason is required/max 500; no accounting action is claimed. |
| `sideMenu.followUpReport` / `/followUpReport` | `Customers/followUpReport/components/list/list.component.ts`: `form`, `search`, `selectTab`, `viewUserDetails`, `summaryCards`, `print`, `exportToExcel`; `list.component.html`; `models/list.ts`; `FollowUpReportService.getReport` | `CustomerService.GetFollowUpReportAsync` (line 656); `CustomerController.GetFollowUpReport`; `FollowUpReportResponseDto`, `FollowUpReportSummaryDto`, `FollowUpReportResultDto`, `FollowUpReportTotalsDto` | Current-month required range, user/customer filters, two result tabs, reference-date totals, details, user drill-down and active-tab export/print are source-supported. Payment-promised and upcoming counts are report indicators; no actual payment or balance mutation is promised. This route is distinct from Debt Collection's nested follow-up history dialog. |

## Content checks

- `CUSTOMER_REPORT_TOPICS` is exported as `ReadonlyArray<GuideTopic>` and imports the existing `GuideTopic` type.
- Topic order exactly follows the freeze: statement, balances summary, receivable age analysis, alerts, debt collection, standalone follow-up report.
- Every topic has a nonempty English and Arabic title, purpose, step and note string.
- Routes are the operational routes in the frozen handoff.
- Report scope language distinguishes the debt-collection one-page/100-row response from the complete `IncludeAllRows` aging response and from balances-summary all-page Excel fetching.
- No content promises permissions, payment/refund/posting, or an action absent from the inspected screen.

## Root integration corrections and additional evidence

Root reconciled the delivered prose before handoff. Date-range Arabic now states start <= end correctly. `includeInactive` concerns customer availability, not inactive journal entries: `CustomerService.GetCustomerStatementAsync` filters the Partner using `!p.IsInactive || includeInactive`; balances dialog sends true. The earlier table phrase "inactive entries" is superseded by this explicit source distinction.

Debt Collection now includes the complete Add follow-up user task: `FollowUpReportComponent.openAddFollowup`, `followUpForm`, `saveFollowUp` (notes max500, optional next date, promise flag; timestamp from current time; successful save reloads history). Notes are optional, and no required reason rule is copied from the separate blacklist form. `FollowUpService.AddAsync` saves a FollowUp record and does not create a receipt/journal.

Upcoming counters mean `NextFollowup >= DateTime.Today` at the server reference date; distinct customer counts use Distinct rather than the sum of per-user totals (`CustomerService.GetFollowUpReportAsync`). This is now explained in the standalone topic. API parameter names, backend implementation and browser pagination terminology were removed from user-facing explanation; they remain here as evidence. Root confirmed debt response slicing with `Math.Clamp(PageSize,1,100)` and Skip/Take; aging uses `IncludeAllRows` to bypass its slice.

## Owner verification pending

The owner should compile the frontend, open Customers guide links and direct routes, switch English/Arabic, and exercise representative report filters, empty/error states, narrow/RTL/dark theme, keyboard, print and Excel workflows. Runtime response shape, visual behavior and backend data correctness remain owner checks; this artifact does not certify them.
