# Limousine reports — frozen frontend handoff

| Status | Frozen |
|---|---|
| Owner verification pending | yes |

Frozen 2026-10-07 from current producers and consumers, without a new business requirement.

| Screen | Producer / exact request | Complete response / grid | Decision |
|---|---|---|---|
| UtilizationReport | TripBookingController.UtilizationReport; TripBookingService.GetUtilizationReportAsync; Filters[fromDate,toDate,utilizationBreakup,branchId,customerId,vehicleTypeId] | Result entity rows: date, hour, tripsCount, kmsCount, chargesSum; server summary | Complete generated daily/hourly dataset; local shared DataTable presentation only; preserve authoritative summary and entire print/export |
| ChauffeurForcedAllocationsReport | TripBookingController.ChauffeurForcedAllocationsReport; Filters[fromDate,toDate] | Result entity rows: tripNo,pickUpDateTime,dropOffDateTime,pickUpLocation,dropOffLocation,chauffeurName,reason | Complete filtered dataset; keep existing inclusion semantics and Notes-as-reason |
| limousineTariffReport | LimousineTariffController.GenerateReport; Filters[tariffCategory,customerId] | Result entity ordered sections/items: location1,location2,vehicleType,rateType,rate | Complete sections; Base has no customer, Corporate requires active customer; preserve section order/identity and full output |

Calendar filters are inclusive local days serialized yyyy-MM-dd through shared date-utils and toFilterParams. Reviewed date ranges use currentMonthRange, typeable appDatePicker, manual range validation. API defaults are not altered. Report output is tied to the applied filter snapshot and invalidated after edits; no stale output can be printed/exported under different filters. Lookup failure blocks dependent requests and provides retry; do not mask failure as an empty successful option list.

## Conformance before implementation

| Concern | Book | Reference / shared owner | Target evidence and correction |
|---|---|---|---|
| Shell / scrolling | UI1/3/20 | shared ReportPage, global sigma-report-panel; StatementOfAccount list | Existing report host wrappers and bespoke SCSS: adopt bounded shared chain; each result region has one scroll owner |
| Tables | UI5/6/20 | DataTable public column/printAllRows contracts | Existing native tables: replace using typed columns and complete response arrays, lazy=false |
| Summary | UI24 | SummaryCards public typed inputs | Utilization server summary stays server-owned; use shared cards |
| Dates / validation | UI17/19 | date-utils, DatePickerDirective, FieldError | Existing Date[]-only range/private serialization: support typed text with shared parsers and validators |
| Errors | UI2/22 | apiErrorMessage, interceptor skip header | Inline failure has exactly one presentation owner; preserve safe server message, finalize loading |
| Export / print | UI8/21/23 | ReportPrintService, shared Excel utilities | Build translated headers at action time; export original complete arrays, printAllRows; language changes cannot keep cached old headings |

No Add/Update, actions, accounting changes, mappings or migration belong to this handoff. Backend is evidence-only. No source edits outside the three owned report folders. Shared changes or translation requirements are proposed to root to prevent overlap.
