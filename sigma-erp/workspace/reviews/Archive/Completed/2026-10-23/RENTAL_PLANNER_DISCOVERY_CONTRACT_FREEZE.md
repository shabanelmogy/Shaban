# Rental Planner — Discovery and Contract Freeze

Status: Phase 0 complete; Phase 1 read contract frozen. Write/actions are not
applicable to the screenshot-supported read-only planner.

## Requested outcome

Refactor the existing Sigma Rental Planner to match the currently opened Speed
Rental Planner, following the Sigma canonical patterns and adding only the
required frontend/backend behavior.

## Scope

- Frontend: `SiGmaAngularFrontEnd/src/app/modules/Rental/RentalPlanner`
- Frontend route: `/RentalPlanner`
- Existing sidebar and lazy route wiring are in place.
- Backend: no Rental Planner controller, service, ViewModel, entity, or endpoint
  was found in `SigmaBackend`.

## Evidence classification

| Evidence | Classification | What it proves | Decision |
|---|---|---|---|
| Existing `RentalPlannerComponent` source | Explicit current-source evidence | The current page has date-range, make, plate, zoom, search controls and a vehicle/time-slot matrix | Preserve the confirmed local scope only; it is not acceptance evidence for Speed parity |
| Existing component mock data | Explicit current-source evidence | Rows, makes, dates, and statuses are hardcoded in the component | Replace only after the read contract is frozen |
| Existing `RentalPlannerService` source | Explicit current-source evidence | A guessed read service exists but is unused, uses `any`, imports a missing `RentalPlanner` type, and omits date-range/zoom semantics | Treat as incomplete, not as a confirmed API contract |
| User-supplied Speed Rental Planner screenshot (`C:\\Users\\user\\Desktop\\555555555555555555555555.PNG`) | Explicit screenshot evidence for functional/content requirements | The page has Date Range with previous/next navigation, Make, Plate No, Zoom, Search, a centered range caption, vehicle type/vehicle rows, grouped day headers, hourly columns, and row status badges (`WRK`, `NRM`, `IDL`, `HIR`) | Implement these as a read-only planner matrix; screenshot shows no mutation control or cell workflow |
| Ambient in-app browser URL | Not evidence | It only identifies the currently open page and does not capture behavior or content | Do not use for contract decisions |

## Current source findings

1. The component initializes fixed dates (`2025-04-21` to `2025-04-22`) and
   hardcoded vehicle rows instead of loading tenant data.
2. The local status cycle is `null -> IDL -> WRK -> HIR -> null`; the supplied
   screenshot does not show editable cells, so this mutation behavior will be
   removed rather than persisted.
3. `onDateRangeChange()` regenerates the mock data, so the mock implementation
   will be replaced with a read request driven by the current filters.
4. The service is not injected or called by the component. Its `getMakes()` URL
   concatenates `RentalPlannermakes`, and its `getRentalPlanner()` contract
   imports a type that is not declared in the local `models/list.ts`.
5. No backend `RentalPlanner` endpoint exists. Existing `Vehicle`,
   `VehicleStatus`, `Booking`, and `RentalAgreement` data provide the source for
   the derived operational read model. Existing `VehicleReportsService` also
   establishes date-overlap behavior for bookings and rental agreements.

## Contract decision table

| Decision | Status | Evidence / exact missing decision |
|---|---|---|
| Canonical UI shape | Frozen with documented exception | The canonical shared `app-data-table` is for ordinary list grids; it cannot express the screenshot's two-level date/hour header and row-spanned vehicle-type groups. Keep the existing feature-local matrix as a specialized operational schedule exception, while applying shared Sigma controls, tokens, loading, error, translation, RTL, dark-theme, and accessibility rules. |
| Backend pattern | Frozen | Read-only derived operational report over existing tenant-scoped vehicle/status/booking/rental-agreement data. No new persistence or stateful cell action is introduced. |
| API operations | Frozen | `GET /RentalPlanner` for the matrix with query `startDate`, `endDate`, `carMakeId`, and `plateNo`; reuse existing `GET /CarMake/GetSelect` for the Make lookup. Both follow existing controller and dropdown conventions. |
| Request contract | Frozen | `startDate` and `endDate` are inclusive local dates; `carMakeId` and `plateNo` are optional filters. Zoom is a presentation-only slot size and is not sent to the backend. |
| Response contract | Frozen | `Results<RentalPlannerRowVM>` with vehicle id, vehicle type, plate, make/model, compact current status code, and date-overlapping booking/rental intervals. The frontend creates hourly headers from the selected range and zoom. |
| Grid columns / matrix headers | Frozen | Row identity columns are vehicle type and vehicle; timeline columns are one slot per hour at the selected zoom, grouped by inclusive date. The screenshot has no paginator; the matrix uses bounded scrolling. |
| State transitions | Frozen as read-only | `WRK`, `NRM`, `IDL`, and `HIR` are displayed current-status abbreviations. Mapping is a strong reviewer inference from `VehicleStatusType`: Workshop→WRK, NRM→NRM, Available/ReadyToGo→IDL, Hired/Rented→HIR. No cell click mutation is supported. |
| Persistence / migration | Frozen | No new entity, EF configuration, or migration is required; the endpoint derives its data from existing tables. |

## Implementation handoff

Phase 1 is frozen for the screenshot-supported read workflow. The absence of
cell actions is intentional: no mutation or allocation contract is visible in
the supplied evidence. Any later request to allocate, edit, or persist a cell
must open a new Phase 1 contract decision.

## Implementation applied

- Backend: added `GET /RentalPlanner` with tenant-scoped vehicle rows,
  current status codes, and date-overlapping booking/rental intervals.
- Frontend: replaced hardcoded rows with API-backed filters, date-range
  navigation, zoomed timeline headers, grouped vehicle rows, status badges,
  reservation markers, and shared loading/error/empty/translation behavior.
- Existing `GET /CarMake/GetSelect` supplies the Make filter; no duplicate
  lookup endpoint was added.
- The existing feature-local matrix remains the documented specialized UI
  exception because the shared ordinary-grid component cannot render grouped
  date/hour headers and row spans.

## Authentication wiring reconciliation

The planner service is registered in the existing lazy `LayoutModule` provider
list, alongside `CarMakeService`, so both requests resolve the layout's
interceptor-enabled `HttpClient` and receive the stored bearer token. No
feature-level `Authorization` header or alternate API pattern was introduced.

The planner host now consumes the available content height without page
scrolling, while the timeline table owns the vertical and horizontal overflow
inside its bounded `p-table` wrapper.

## Verification boundary

The scoped frontend and backend source diffs were reviewed separately, stale
mock references and the invalid planner service type were checked, and
whitespace checks were clean. Builds, tests, lint, browser/application
verification, database commands, and migrations were not run. The recipe drift
check reported the generated phase packets as stale; canonical guide sources
remain the authority.

## Final reconciliation

| Area | Result |
|---|---|
| Frontend/backend route contract | Matched: `RentalPlanner` GET is consumed by the feature service with `startDate`, `endDate`, optional `carMakeId`, and optional `plateNo`. |
| Lookup contract | Matched: Make uses the existing `CarMake/GetSelect` response shape. |
| Matrix fields | Matched: `vehicleId`, `vehicleType`, `plateNo`, `makeAndModel`, `statusCode`, and `reservations` are rendered by the frontend. |
| Actions and persistence | No write action added; no migration required. |
| Existing feature wiring | Existing lazy route and sidebar item remain unchanged. |
