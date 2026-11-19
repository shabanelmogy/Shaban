# Labour Activities Report Feature Review

| | |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-09-29 |
| Request | "create new item under WorkShop" with screenshot `10.png`; answers: estimated time from Labour Tariff at save; actual time "the most suitable"; scope "report with the available columns first"; standing rules "bring missing business to the closest correct existing thing or create new" and "answer any question with what you judge best" |
| Screen type | UI `ui/screens/07-report.md` (dense flat report, reference `Reports/TrailBalance`) |
| Backend pattern | 5 Report (reference `DailyServiceLogReportService`) |
| Packets | `-Check` 8 × OK |

## Evidence

| ID | File | State | Metadata |
|---|---|---|---|
| E1 | `10.png` | Report after Search, one row | Locale en, LTR, desktop; role, version Unknown; date range 30/08/2026–28/09/2026 |

### Functional Evidence Table

| Evidence | Classification | Required behaviour | Implementation |
|---|---|---|---|
| Title "Labour Activities Report / Labour Activities Report and Performance" | Explicit | Title and subtitle | `app-feature-title` |
| Job No, Date Range, Staff | Explicit | Three filters | Text, range calendar (current month default, UI 17 / skill §3.3), staff dropdown |
| "Actual Time is Greater than Estimated" | Explicit | Filter | **Deferred** (D5) |
| Search, Print, Export to Excel | Explicit | Report actions | `appReportActions` + `app-buttons`; `ReportPrintService`; export built at click time (UI 8, 20) |
| Columns Job Date … Difference | Explicit | Ten columns | Native table; the table frame is the only row-scroll owner (UI 20 dense variant) |
| Staff blank while Profile "Designer" | Explicit | A line can have a profile without staff | Recorded for the follow-up (D2) |
| Estimated 1, Difference 1, Actual blank | Explicit | Difference is estimated − actual when actual is blank | Recorded for the follow-up (D4) |

## Decisions

| # | Decision | Evidence / kind |
|---|---|---|
| D1 | Row grain: one row per `JobLabour` of a job dated in the range; order `Job.DateAndTime`, `JobId`, labour Id; date boundary `[dateFrom, dateTo + 1 day)` on `Job.DateAndTime`; Job No filter = contains; Staff filter = `JobLabour.StaffId` | Reviewer decision (owner standing rule); source `Job`/`JobDetail`/`JobLabour` |
| D2 | **Profile**: no source today (`JobLabour` has only `StaffId`; `Staff` has no profile). Closest correct target: `JobLabour.StaffProfileId` (matches E1: profile without staff; same key Labour Tariff uses). Column shown empty now | Owner scope "available columns first"; follow-up task |
| D3 | **Estimated time**: owner answer — from Labour Tariff at save, stored on the line (vehicle-type set first, then Default; key staff profile + job line activity). Column shown empty now | Owner answer; follow-up |
| D4 | **Actual time**: closest correct option — `JobLabour.ActualTimeInMinutes` entered in the Job editor; Difference = estimated − actual, computed by the backend | Reviewer decision (owner standing rule); follow-up |
| D5 | The "Actual greater than estimated" checkbox is **not rendered** yet: with no actual time it could only return an empty report. It ships with D4 | Reviewer decision; avoids a filter that always returns nothing |
| D6 | Detail = the job line's workshop activity name, falling back to its free-text `Detail` (E1 "Nissan Service (Petrol)" is a service name) | Reviewer decision |
| D7 | Staff name = `FirstName MiddleName LastName` (same as the `Staff` select list); Staff Code = `Staff.No` | Source: `Repository.GetDropdownAsync`, `EntityBase.No` |
| D8 | Times are shown in minutes (headers say "(mins)"), the unit of Labour Tariff | Reviewer decision |
| D9 | No totals: E1 has none | E1 |

## Contract

```text
GET LabourActivitiesReport?Filters[dateFrom]=yyyy-MM-dd&Filters[dateTo]=yyyy-MM-dd[&Filters[jobNo]=][&Filters[staffId]=]
→ Result<LabourActivitiesReportDto { dateFrom, dateTo, rows[] }>; 400 with the localized message when the range is invalid
row { jobLabourId, jobId, jobDate, jobNo, vehiclePlateNo, staffName, staffCode, profileName*, detail, estimatedMinutes*, actualMinutes*, differenceMinutes* }   (* null until the follow-up)
```

## Files

Backend (new): `ILabourActivitiesReportService.cs`, `LabourActivitiesReportService.cs`, `LabourActivitiesReportController.cs`, `Dtos/LabourActivitiesReport/{LabourActivitiesReportDto,LabourActivitiesReportRowDto}.cs`, `ViewModels/LabourActivitiesReport/LabourActivitiesReportFilterVM.cs`; `GeneralMessage(.ar-SA).resx` (+1 message).

Frontend: new `Workshop/LabourActivitiesReport/` (model, service, `report` component, routes); `pages/routing.ts` (`LabourActivitiesReport`, the menu link already existed); `layout.module.ts` provider; `en.ts`/`ar.ts` `labourActivitiesReport` block.

Documentation: Master block 2 rule 6 (owner standing decision), Master 1.10, `CHANGELOG.md`, root `AGENTS.md` clause, skill §1.1 rule 7 and history row.

## Migration

None for this change. The follow-up (D2–D4) adds three nullable columns to `JobLabour`; suggested name `AddProfileAndTimesToJobLabours`.

## Suggested commits

```text
SigmaBackend:
feat(labour-activities-report): add workshop labour activities report

- GET LabourActivitiesReport: one row per job labour line, inclusive date range, job no and staff filters
- profile and time columns returned empty until job labour lines record them

SiGmaAngularFrontEnd:
feat(labour-activities-report): add report screen under Workshop

- report page with job no, date range and staff filters, print and Excel export
- route for the existing menu entry; en/ar translations
```

## Risks and owner verification

- Not compiled. Check `labour.JobDetail.Service.Name` (WorkshopActivity) and navigation null-handling in the EF projection.
- `QueryReport` fails open without a tenant claim (backend backlog 10); the controller keeps `[Authorize]`.
- Manual checks: menu Workshop → Labour Activities Report opens; the range defaults to the current month and can be typed; Search with and without Job No / Staff; an invalid range shows the message; Print shows only the table; Excel headers follow the language; Arabic/RTL, dark theme; the page does not scroll, only the table frame.
