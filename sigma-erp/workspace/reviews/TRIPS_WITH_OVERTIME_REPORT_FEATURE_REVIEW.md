# Trips With Overtime Report — feature review and implementation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-11-19 (initial implementation; review fixes the same day) |
| Tier | M (one report) with a shared Driver↔Staff link and a scoped migration |
| Scope | `TripsWithOvertimeReportsController`, `TripsWithOvertimeReportService`, `TripsWithOvertimeCalculator`, `Driver.StaffId`, `Reports/TripsWithOvertime`, user guide topic |

## 1. References

- Speed guide (2026-10-27): no dedicated explanation for this report.
- Speed code (2026-10-28): `sidebar/23-reports/screens/44-trips-with-overtime.md`, controller `C1080--tenant.views.reports.tripsWithOvertime.index.js`, route `R0514`, proxy `tripsWithOvertime.getTripsWithOvertimeReport`. Filters: month and staff; Excel export; the overtime rule is server-side and not in the captured code.
- Odoo 19.0: not applicable. Superpowers: not installed (only the official marketplace).
- Owner screenshot: Month and Staff filters, Search and Export, sixteen columns ending with Amount and Overtime.

## 2. Owner decisions (frozen)

1. **Driver↔Staff link.** Optional `Driver.StaffId`; one driver per staff member, enforced by the filtered unique index `UX_Driver_StaffId` and by `DriverService`/`CompanyService` validation. A removed driver releases its link (`IReleasesLinksOnRemove`, applied in `Service.MarkRemovedAsync`). Driver card field "Linked Staff" behind `Staff.Lookup`.
2. **Overtime rule.**
   - Only `Finished` trips, non-external vehicle, with a driver linked to a visible staff member.
   - Times are the actual `StartedAt`/`FinishedAt`; the month is the month of `StartedAt`.
   - Reference is the scheduled shift: daily `Attendance.ShiftId` override, else `Staff.ShiftId`. Attendance punches are never used; recorded absence does not change the calculation.
   - Fixed shift: trip time outside the shift window (overnight shifts and the previous day's overnight tail handled). Holiday/weekend (`StaffOvertimePolicy.IsHoliday`): whole time. Flexible shift: time beyond `DutyHours` per day, allocated chronologically. Ineligible shift: zero.
   - Each staff member's trips are merged first: a row shows its own overtime; the total and flexible duty allowance count overlapping time once.
   - No shift on a day: no overtime that day; the report returns `TripsWithoutShiftCount` and shows a warning.
   - Only trips with overtime > 0 are listed. Display `HH:mm`; amount = `Charges + Tax − Discount` (LimousineBillingService definition).
3. **Daily shift read is viewer-independent.** Attendance shift IDs and their shifts are read with `IgnoreQueryFilters()` bounded by tenant, soft delete, staff IDs and dates (PayrollRunService pattern), so the same trip gives the same overtime for every authorized viewer.
4. **API and access.** `GET /TripsWithOvertimeReports/Options|Read|Print|Export` with `TripsWithOvertimeReports.Read` (+ `Print`/`Export`); registered in `BranchOperationRules.WholeDocumentReads`, `PermissionPrerequisites` and `route-access-policy.ts`. Options list only staff linked to a driver.

## 3. Conformance

| Concern | Owner block | Shared owner used | Result |
|---|---|---|---|
| Page and frame | UI1 / UI20 | `appReportPage`, `app-feature-title` | Match |
| Filters and loading | UI20 / UI22 / UI17 | `createReportReadState`, `p-datepicker[view=month]`, `parseMonthValue`/`toMonthPickerDate`/`monthValueValidator` (date-utils) | Match |
| Table, totals, sorting | UI6 / UI19 / UI20 | `app-data-table` (18 columns, `footerRows`, `exactMoney`); overtime column numeric minutes with an `HH:mm` cell template | Match |
| Print and export | UI20 / UI21 | `ReportPrintService`, `dataTableExportRows`, `onExportToExcel` (overtime exported as `HH:mm`) | Match |
| Access and branches | UI26 / BE9 | `PermissionCatalogAction`, `BranchOperationRules`, `QueryReport<T>()`; bounded tenant read for shifts | Match |
| Numbers | BE18 / UI19 | `FinancialNumberPolicy`, `CurrencyAmountJsonConverter` | Match |
| Advisory | UI22 / UI1 | `sigma-alert sigma-alert--warning` | Match |
| User guide | Master7 / UI23 | `trips-with-overtime-report-topic.ts` in `REPORTS_GUIDE` | Match |

Columns added beyond the screenshot: **Actual Start** and **Actual Finish**, so the overtime basis is visible next to the planned times.

## 4. Load speed and index evidence

- One trip query (bounded to 10,000 rows), one default-shift batch, one attendance batch, one shift batch, one holiday batch; no per-row reads.
- Index `IX_TripBooking_Subscription_Status_StartedAt (SubscriptionId, Status, StartedAt) INCLUDE (DriverId, FinishedAt, ExternalVehicle, BranchId)` covers the trip predicate. Attendance uses the existing unique `(SubscriptionId, StaffId, AttendanceDay, …)` index.
- SQL timing and plans are pending owner measurement (36 trip rows in the experimental database).

## 5. Migrations

| Migration | Target | Result |
|---|---|---|
| `20261119194113_AddDriverStaffLink` | `SQL5106.site4now.net / db_a82a9c_sigmaoperations1` | Applied earlier: `Driver.StaffId`, FK, index; 70 driver rows retained |
| `20261119200510_EnforceDriverStaffLinkAndTripOvertimeIndex` | same | Pre-checks: 0 duplicate links, 0 deleted drivers with a link, 0 linked drivers. Script generated for this migration only and applied in one transaction. After: history row present; `UX_Driver_StaffId` unique filtered `([StaffId] IS NOT NULL)`; trip index present; unrelated `20261114181258_AddLeaveDeductionHistoricalBranches` still not applied; Driver 70 and TripBooking 36 rows unchanged |

## 6. Verification

| Check | Command / evidence | Result |
|---|---|---|
| Backend build | `dotnet build SiGma.ServerAPI -c Release` | Succeeded |
| Calculator tests | `dotnet test SiGma.BranchAccess.Tests --filter TripsWithOvertimeCalculatorTests` | 9/9 passed (adds overlap total, flexible overlap, no shift, overnight after holiday) |
| Frontend build | `npm run build` | Succeeded |
| Frontend lint | `npx eslint` on the 7 changed files | 0 problems |
| Frontend spec | `ng test --include …trips-with-overtime-report.component.spec.ts` | **Blocked**: the Karma build fails on pre-existing compile errors in unrelated specs (Bills, Purchase Requests/Orders, GRN, Rental, Fleet, Assets); no error in this feature's files |
| Runtime | Browser, print, Excel, live data, SQL timing | Pending owner |

## 7. Open items

- Amount column visibility: the Speed controller exposes `canViewCharges` to its template; Sigma has no equivalent trip-charges permission — owner decision.
- A concurrent duplicate link now fails at the unique index with a generic error instead of the localized 409 message.
- `DetailedVehicleUtilizationReport` keeps its own month helpers; adopt `date-utils` when that feature is next touched.

## 8. Suggested commit messages

- Backend: `feat(reports): trips with overtime on actual finished trips with merged staff totals and enforced driver-staff link`
- Frontend: `feat(reports): trips with overtime actual times, numeric overtime sorting and no-shift notice`
