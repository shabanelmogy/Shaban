| Status | Owner verification pending |
|---|---|
| Frozen | yes |

# Revenue by vehicle type

2026-11-20, tier L, UI07 / backend pattern 5, report only. The owner's request “راجع التقرير وظبط المطلوب” and screenshot 1.PNG establish four filters, seven columns, Search, Print, Excel and a total. English LTR desktop, populated state, capture date and role unknown. Actual sidebar target /Vehicle is a placeholder. The per-vehicle invoice report is a separate contract.

## Evidence and decisions

Speed 2026-10-27 analysis guide, reporting chapter and catalog have no dedicated calculation explanation. Speed 2026-10-28 Reports screen 51, route R0518 and controller C0998 (269884–270090) establish a same-day initial range, optional location/type/card, active and inactive locations, explicit search, totals and two quotient formulas rounded to two places. Odoo 19 sales/rental.rst separates rental pricing and invoicing and supplies no equivalent aggregation rule. Speed server input calculations are unavailable. Reference action names do not confer Sigma access.

| Screenshot evidence | Sigma source and frozen decision |
|---|---|
| Date range, branch, vehicle type, tariff card | Inclusive dates default today. Optional ids branchId, vehicleTypeId, tariffCardId. Use assigned vehicle branch and type, falling back to selected agreement type for an untyped vehicle. Customer's current PartnerBillingInfo.TariffCardId is the available card relationship. Do not infer an agreement's historical card from matching prices. |
| Vehicle type, revenue, rental days, billed days, number of rentals | Nonvoid RentalAgreement with authorized vehicle overlapping the range. One agreement counts once, group by type identity (null is unclassified). Rental days are distinct calendar days touched by each agreement, clipped to range with an exclusive end. Estimated rent before tax follows DailyRevenueReportService.ReadForAgreementsAsync in base currency. Invalid revenue inputs yield unavailable revenue/RPD for affected groups and total. Billed days count the union per agreement of saved base rental invoice periods in the filter window, excluding incidental charges and duplicate recipient/overlapping dates. Never equate billed and rental days. RentalInvoiceItem plus readable parent invoice are required. |
| LOR, RPD, total | LOR = rentalDays/rentals. RPD = revenue/billedDays. Round ratios to two places. Blank for zero numerator or denominator per C0998. Compute total ratios from summed measures. Stable type-name then id order. |
| Search, print, Excel | Tenant/branch-scoped report, separate catalog Read/Print/Export, output requires Read, no role grants. Complete output for applied filters, AR/EN shared report page, grid footer and guide. No editing, posting or migration. |

Reviewer decisions under Master2's standing rule: use rental agreements only because saved rental billing periods identify RentalAgreementId; separate lease billing is a different source. Report current vehicle grouping and customer card; describe both in the guide. Use actual invoice periods for billed days and existing estimated daily accrual for revenue. Alphabetical order is a reviewer choice. No old-data backfill.

## Frozen transport and conformance

Owner confirmation on 2026-11-20: “اعتمد أيام الفواتير داخل الفترة”. Count saved invoice dates that fall inside the selected period. The reference's 2,016 billed days for one rental in a 366-day search are not an acceptance value for Sigma.

GET RevenueByVehicleTypeReports/Options returns Result of {branches,vehicleTypes,tariffCards}, each {id,name} array. GET Read/Print/Export accepts fromDate,toDate and three optional ids. Result payload {criteria,currencyCode,decimalPlaces,rows,total}. Row and total {vehicleTypeId:number|null,vehicleTypeName:string,revenue:decimal-string|null,rentalDays:int,billedDays:int,rentals:int,lor:number|null,rpd:decimal-string|null}. Total label localized by client. Null type gets localized unclassified label. No AutoMapper, persisted fields or journal effects.

| Concern | Reference and owner |
|---|---|
| Shell, output, grid, states | UI20/21, StatementOfAccount list, ReportPage/ReportActions, DataTable.footerRows, complete export and ReportPrintSession through createReportReadState |
| Access, loading, options | UI2/22/26, permission prerequisites and route policy, report-context read with page progress, no operational result cache |
| Data | BE9/17, QueryReport, source-bound predicates, batched reads with limits; daily accrual and currency formatting use existing owners |
