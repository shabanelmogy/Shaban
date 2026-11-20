| Status | Owner verification pending |
|---|---|
| Frozen | yes |

# Revenue by tariff card report contract

## Manifest and reference evidence

The supplied `1.PNG` shows an English LTR desktop report with populated results. Capture version, date and user role are unknown. Shape 07 uses UI20/21 and backend pattern 5. Owners are Statement of Account's shared report shell and action strip, DataTable's report footer, the report print session, and QueryReport. Actual feature entry point before the change is the sidebar link to tariff-card definitions. No prior report source or guide exists for this entry. The worktree contains concurrent edits to neighboring reports and shared registries. They are outside this report's implementation ownership.

| Evidence | Reference and finding | Decision and disposition |
|---|---|---|
| Reporting guide | Speed 2026-10-27 chapter 16 and explanation catalogue document report conventions. No dedicated report explanation matched. | Date, filters, totals and scope established from the dated code and screenshot. |
| Sidebar and code | Speed 2026-10-28 Reports screen 53, R0520, C0997 (application.js 269680–269880). Options read locations and cards. Today is initially selected, branch and card are optional, Search reads results. The controller computes LOR and RPD and emits the whole rendered table for Excel. | Accepted, currently missing in Sigma. Deliver Search, Print and Excel on the dedicated route. Existing Sigma options include available inactive visible records. |
| Screenshot, explicit | Date range, Branch, Tariff Card, seven ordered columns, total, Search, Print and Excel. | Accepted. Print and Excel contain the filtered rows and authoritative total. |
| Provider-side inclusion and money, undemonstrated | Speed backend unavailable. Pinned Odoo 19.0 `applications/sales/rental.rst` distinguishes rental pricing and invoicing but does not establish this report's aggregation. | Sigma's frozen Revenue by Vehicle Type meanings govern. No claim of Speed backend equivalence or historic card attribution. |
| Row order, inferred | Screenshot examples do not establish a sort rule. | Base order is card name and ID, unassigned last. The user may sort the complete local data. |

## Filters and authorization

| Control | Angular and query property | API type and rule |
|---|---|---|
| Date range | `fromDate`, `toDate` | Required ISO calendar dates, inclusive both endpoints. Today initially. Reject incomplete/reversed ranges or maximum end date that cannot advance. |
| Branch | `branchId` | Optional positive visible branch ID. Absent selects all readable assigned vehicle branches. |
| Tariff Card | `tariffCardId` | Optional positive visible card ID. Absent includes unassigned rentals. |

GET `RevenueByTariffCardReports/Options` returns `Result<{branches,tariffCards}>` with id/name pairs. GET `Read`, `Print`, `Export` receive the same keys and return `Result<{criteria,currencyCode,decimalPlaces,rows,total}>`. All use the tenant-owned `QueryReport` path and whole-document branch scope. Options use Read. Print and Export require their independent catalogue grants plus Read. No defaults are granted. Route is `/Reports/RevenueByTariffCard` through the permission tree and current-session route policy. Outputs recheck access and applied criteria.

## Rows and totals

| Column | Angular field | Backend field and calculation |
|---|---|---|
| Tariff Card | `tariffCardName` | `TariffCardName`, with nullable `TariffCardId` as identity. Current readable customer billing-profile card, or Unassigned. |
| Revenue | `revenue` | `Revenue`, exact nullable base-currency amount. DailyRevenueReportService estimated rent after applicable rent discount and before tax. Missing source leaves the affected group's amount and total blank. |
| Rental Days | `rentalDays` | `RentalDays`, integer distinct calendar days per rental overlapping the dates, excluding a midnight end. |
| Billed Days | `billedDays` | `BilledDays`, integer union of saved base rental invoice calendar days per rental, clipped to the searched period. Additional charges and overlapping duplicate periods do not add days. |
| No. of Rentals | `rentals` | `Rentals`, integer distinct nonvoid rental agreements with a readable assigned vehicle overlapping the window. Lease agreements are outside the source. |
| LOR | `lor` | `Lor`, rental days divided by rentals, rounded to two places, blank for zero divisor or numerator. |
| RPD | `rpd` | `Rpd`, exact nullable revenue divided by billed days, rounded to two places, blank for zero divisor, zero or missing revenue. |

Total measures cover all matching rows. Ratios use combined numerators and denominators. Monetary values cross JSON as decimal strings. Read limits fail explicitly and never return partial output. Hidden invoice periods for a visible rental trigger the same whole-document refusal used in the sibling contract. No CRUD ListVM, AutoMapper overrides, write actions or migration.

| Concern | Canonical reference and owner | Target conformance |
|---|---|---|
| Report shell, filters, footer | UI20/06, StatementOfAccount and TrialBalance; ReportPage, ReportActions, FeatureTitle, DatePicker directive and typed DataTable.footerRows | Dedicated read-only screen and one submit, no feature styles. |
| Loading, stale data and output | UI21/22/28, ReportPrintService and createReportReadState | Page load owner and current-session invalidation, direct filter options, no operational cache, full rows and applied criteria in both outputs. |
| Read source and scope | BE9/17, QueryReport and DailyRevenueReportService | Filter before batching. Bounded contract and invoice sources, in-memory interval union, no per-row database work. SQL plan/timing pending. |
