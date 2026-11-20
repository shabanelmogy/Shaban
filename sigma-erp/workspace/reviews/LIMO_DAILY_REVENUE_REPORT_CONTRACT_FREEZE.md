# Limo Daily Revenue Report

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

## Scope and evidence

2026-11-20. The request “راجع التقرير وظبط المطلوب” and evidence 1.PNG cover one report. New screen implementation is tier L, UI shape 07 and backend pattern 5. The reference is a populated English LTR desktop report showing 20/11/2026 as its filter. Capture date, role and version are unknown. In Sigma, the translated sidebar entry goes to /Location. There is no report route, API or guide topic for it.

| Explicit evidence in 1.PNG | Speed evidence and decision |
|---|---|
| Date and Customer | R0519 and C0971 declare asOfDate and optional customer selected from active customers. Sigma uses a required local calendar date defaulting to today and an optional active, readable partner ID. Clearing the filter includes all eligible rows. |
| Customer, Limo Daily, Limo Month-to-Date, Rental/Lease Daily, Rental/Lease Month-to-Date | C0971 confirms the four returned amount fields. One row per saved customer ID, ordered by name and ID. Unassigned finished trips have their own localized group. Use base-currency precision and exact decimal strings. |
| Total and Grand Total | C0971 and C0972 sum the four measures and define Grand Total as Limo MTD plus Rental/Lease MTD. Sigma computes both on the server for the complete filter result. |
| Refresh, Report, Export to Excel | Refresh applies the current filters. Report uses the shared print session. Excel and print reread the complete dataset under the applied filter and their respective access checks. |

The local Speed guide dated 2026-10-27, chapter 13 and original explanation S123 describe the trip lifecycle and corporate invoicing. The 2026-10-28 Reports screen 52, route R0519 and controllers C0971/C0972 (raw/application.js 263748–264178) give the filter and totals evidence. The SaleReport read and export proxies (raw/service-proxies-angular.js 39824 and 39832) do not expose server calculations. The pinned Odoo 19 sales/rental.rst explains rental pricing and invoicing but has no reconciliation formula for these four daily/MTD columns.

## Frozen decisions

- Reviewer decision (owner standing rule): use the saved finished date and net trip charges before tax (Charges minus Discount). TripBookingService.FinishCoreAsync writes FinishedAt and final Charges, while Tax is stored separately. Exclude cancelled, no-show and unfinished bookings. Invoice date and posted journals would measure a different lifecycle event. Trip booking amounts are validated with the base money policy. The report is an operational estimate with no accounting writes.
- Reviewer decision (owner standing rule): use DailyRevenueReportService for rental and lease attribution before tax, including its stored rates, calendar overlap, discount allocation and exclusions. Apply the optional customer to the underlying query before it is bounded. Carry partial-data counts into screen, print and Excel. Today is the initial date and the user explicitly refreshes. MTD includes the first day through the selected day. Daily is the subset for the selected day.
- Existing permission-catalog pattern from DailyRevenueReports: independent report Read, Print and Export operations. Print/Export require Read. No role grants or changes to branch membership. Use QueryReport and current read branches, including customer names and filtering.
- GET LimoDailyRevenueReports/Options returns Result of an array of {id,name}. GET Read/Print/Export accepts asOfDate and optional customerId. Result entity contains criteria, currencyCode, decimalPlaces, rows, totals, grandTotal and excludedSourceCount. Rows are customerId, customerName, limoDaily, limoMonthToDate, rentalLeaseDaily and rentalLeaseMonthToDate. The totals object contains the four amount fields. Money is serialized as decimal strings.
- UI20/21: use ReportPage, ReportActions, DataTable with backend footer rows, StatementOfAccount report conventions and createReportReadState. Scope options and results to the current access context. Use shared date parsing, table money formatting and Excel output. There are no editors, state transitions, AutoMapper mappings, schema changes or reference module edits.

## Implementation and verification plan

1. Cover month boundaries, completed trip eligibility and customer isolation in the scoped backend test.
2. Compose the existing agreement calculation with one SQL-grouped trip read, then add the report controller, access metadata and the Angular route, outputs, translations and in-app guide.
3. Verify scoped tests, builds, changed-file lint and per-repository diff. Leave interactive and SQL plan acceptance to the owner.
