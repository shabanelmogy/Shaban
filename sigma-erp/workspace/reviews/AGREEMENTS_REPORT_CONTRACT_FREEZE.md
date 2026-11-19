# Agreements Report — frozen implementation contract

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-11-18 |
| Scope | Screenshot review and implementation; report read/options/export, Angular route/menu/guide |

## Evidence and decisions

The supplied Agreements Report screenshot is functional evidence. Speed snapshot
2026-10-28 Reports/22, route R0587, controller C0967 (raw application.js
262821–263142) confirms the twelve filters, optional dates, Rental/Lease/Chauffeur
categories, Open/Closed states and separate full Excel output. The 2026-10-27
guide and library catalog contain rental/lease document explanations but no exact
Agreements Report explanation. The rental/lease cycle explains operational
contracts versus master contracts. Odoo19 pinned comparison matrix does not define
this specialized report's cross-module price or chauffeur mapping; Sigma sources
remain authoritative. Owner response “زى الصورة” confirms chauffeur coverage.

Before this task the sidebar opens `/Agreement`; no dedicated report exists.
Existing dirty shared wiring and authorization files belong to earlier tasks and
must be preserved. UI07/UI20 and BE17 report shapes apply, with shared ReportPage,
ReportActions, FeatureTitle, DataTable and report-read-state as owners. The approved
shape reference is Customers/StatementOfAccount/components/list. Recipe check8/8.

## API

Base `/AgreementsReports`; authenticated, explicit Read and Export catalog actions.
`GET Options` consumes Read; `GET Read`; `GET Export` requires Export + Read.
Responses `Result<AgreementsReportOptionsVm>` / `Result<AgreementsReportVm>`.

Filter: `agreementNo` (nullable string <=100), `plateNo` (<=100), `modelYear`
(nullable integer1..9999), `branchId`, `fleetType` (nullable actual Sigma enum
0 Rental/1 Replacement/2 Staff), `fromDate` / `toDate` (both nullable DateOnly,
paired, inclusive start-date calendar range), `category` (null/Rental/Lease/Chauffeur),
`type` (null/Daily/Weekly/Monthly/Lease/Chauffeur), `status` (null/Open/Closed),
`customerId` (Partner identity), `salesPersonId` (Staff identity), `saleOriginId`.
Positive IDs and authorized lookup membership; invalid input fails, no ignored filters.
Date defaults current month, checkbox can disable it. Open status disables dates
like Speed; user can explicitly enable dates again. Search applies changed filters.

Options `{ branches, customers, salesPersons, saleOrigins }`, each `{id,name}`.
Scoped historical operational references (including inactive, not deleted), no
separate lookup permission needed. Explicit direct read, no cross-request cache.

Report `{ rows, count, currencyCode, decimalPlaces }`. Complete dataset, stable
StartDate then Key ordering; local presentation paging, export refetches all applied
filters. Count is server rows.Count, integer, independent of view paging.

## Grid ↔ response properties (same order)

| Column | Property |
|---|---|
| Agreement No | agreementNo |
| Category | category |
| Type | type |
| Vehicle | vehicle |
| Make And Model | makeAndModel |
| Model Year | modelYear (nullable integer) |
| KMs | kms (saved contract text; no conversion to invented current reading) |
| Permanent Vehicle | permanentVehicle (nullable boolean) |
| Customer | customer |
| Driver | driver |
| Start Date | startDate |
| End Date | endDate |
| Status | status |
| Branch | branch |
| Sale Person | salesPerson |
| Rate | rate (nullable exact decimal string) |
| Total Charges | totalCharges (exact decimal string) |

Only extra row property is `key`, unique across sources. No additional columns,
notes, cards or print action. Subtitle matches screenshot. Paginator outside row
scroll, bounded shared layout, Arabic/English, exact currency precision.

## Source/calculation/state contracts

Rental and Lease are actual operational derived Agreement records, not master
contracts. Exclude voided; complimentary contracts remain visible. Vehicle/branch,
model/year, driver and customer labels use authorized QueryReport sources.
End Date is the saved contract end/expected return, not proof of actual closure.
Status comes from IsClosed, independently of end date. Lease PermanentVehicle is
its saved bool, absent for rental/chauffeur. KMs is Agreement.KMs.

Rate is the one selected, active, nondeleted Rent BookingCharge.Rate, absent if
missing/conflicting; no arbitrary first row or newly invented discount allocation.
TotalCharges is the backend-maintained Agreement.TotalCharges, including the
owner's charges/discount/tax calculation. Do not sum client rows or substitute
invoice revenue. Existing writer contracts and VehicleRentalDetails establish base
currency, resolved as exactly one valid configured base currency.

Chauffeur maps to actual TripBooking service, not TransportationAgreement. Include
New/Assigned/Dispatched/Started/Finished; exclude Cancelled/NoShow. Scheduled pickup
and saved drop-off are Start/End; Finished is Closed, other included states Open.
Rate=Charges; TotalCharges=Charges+Tax-Discount following TripBookingService and
LimousineBillingService. Vehicle and driver use saved internal relations or the
explicit external-vehicle/external-driver fields; unsupported sales person/origin,
permanent flag and saved pickup KMs remain absent. Filter application never
pretends these unsupported fields exist: selected salesperson/origin excludes trips.
No historical current-vehicle odometer substitution. Money is validated/formatted
by shared financial owners; no NaN, guessing currency or silent monetary rounding.

QueryReport retains tenant, deletion, branch and structural ownership filters.
Related Partner labels/options additionally obey the existing VisiblePartners
read-branch rule used by DailyBusiness. No IgnoreQueryFilters. No schema change,
writer change, DB repair or migration is needed for this report reader.

## Lifecycle / performance / verification

One report-read-state page loader for Options, Read and fresh Export, paired
finalize/cancel; no grid spinner duplicate. Clear results on changed filters,
session, branch or permission revision; close body overlays on expiry. No report
or policy cache; direct Options are contextual operational populations. Compact
error with existing Search/Retry. No new event/watch cache policy.

Project scalar rows in SQL, unique grouped Rent join, no Include graphs or per-row
calls. Sequential DbContext commands; stable complete response. Existing FK/branch
indexes retained; evaluate plans before adding an overlapping index. SQL plans,
timings, browser visibility and Excel acceptance remain pending; fewer source
calls do not establish measured speed.

Implement backend and frontend in bounded nonoverlapping streams after this
freeze. Source/diff review and affected local builds are authorized. Tests, lint,
browser automation, commits/push/deploy are not. In-app Reports guide is mandatory.
