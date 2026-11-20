# Due for Sale / De-fleeting Vehicles Report

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Shape | UI 07, BE17, filterless read |

Screenshot 1 establishes the OR threshold, the 300,000 km boundary, total count, seven columns and two outputs. Lower-mileage older vehicles and high-mileage vehicles with missing purchase dates are visible. Speed screen 48, route R0593, controller C0995 and settings controller C0431 establish initial read, configured thresholds and full-table output. The exact Speed server predicate is unavailable. The Sigma sidebar opens the generic vehicle route today.

Use tenant common settings for kilometres, whole years and Buy Back inclusion. Defaults come from the existing singleton model (300,000 km and five years). Zero disables an individual criterion. Both disabled or a negative threshold produces explicit configuration feedback. Include currently active roster vehicles if either threshold is met. Age is measured on the operational calendar from the saved purchase date with an inclusive anniversary. Include available, hired, workshop and other non-terminal states, including For Sale. Exclude Sold, Defleeted and Total Loss. Preserve a missing status as unknown. The visible count is the complete scoped result. Apply current branch and tenant boundaries to all output operations. No domain status changes are involved.

| Concern | Source owner and decision |
|---|---|
| Vehicle and current status | Vehicle roster and latest status by audit time and ID, with live report tenant, soft-delete and branch filters |
| Presentation | UI20/21 shared action strip, summary card, data table, local paging and complete print/export |
| Numerical fields | UI19 and BE18, mileage stays numeric in Excel and uses shared quantity precision on screen |
| Access | BE9 and UI26, separate Read, Print and Export with output prerequisites |

## Reconciliation

| Source field | Displayed column |
|---|---|
| plateNo | Plate no. |
| vehicleType | Vehicle type |
| makeAndModel | Make and model |
| mileage | Mileage (km) |
| branch | Branch |
| status | Status |
| purchaseDate | Purchase date |

The Fleet and Vehicles menu, protected lazy route and bilingual Reports guide topic point to `/Reports/DueForSaleVehicleReport`. The service returns the complete scoped population, current settings and row count. UI20's shared action strip supplies the spacing below the toolbar. The threshold text and shared count card participate in print. Local paging limits display rows while Print and Excel use their entire freshly authorized response. Plate identifiers stay text, date-only values keep their calendar meaning, and mileage is exported as a number.

The query reads the common settings once, then uses one projected scoped snapshot query. The existing vehicle-status index starts with tenant and vehicle and covers the time and ID ordering. Results above 50,000 rows return an explicit error. SQL Server execution plans, timing, fleet data comparison and visual print acceptance remain pending. No index addition is supported without measurement. This report uses direct reads with no cache, mutation, mapping profile or migration.

Shared extraction: the latest-status anti-join, repeated in four services, moved to `VehicleStatusQueries.Latest` (BE17), now used by Dashboard, Vehicle Status Report 2, Idle Vehicle and this report. The local empty options result moved to `noReportOptions` (UI20), adopted here and by Vehicle Ageing and Rental Service Replacement; five older copies are counted in UI30 item 39. The threshold text now places numbers after a label (UI23) so it reads correctly for every value.

Owner requests: the threshold text is the title subtitle (UI3), and the count card sits in the action strip through the shared `.sigma-report-filter-context` (UI20); both print. The table uses UI6 local paging (controlled first/rows, total records, shared 10/15/20/50/100 options) and shows the pager whenever rows exist.

Open decision: rows are ordered by ascending mileage, missing mileage last, then plate. The evidence does not establish the order (Master2); the owner confirms or chooses another order.

Discovery, contract, read grid, route wiring and reconciliation apply. Write and state-transition phases are inapplicable. Speed's captured client exposes the thresholds and outputs, with no server filter predicate. The inclusion decisions above are Sigma-derived. No subagents were used.

Suggested commits are `feat(reports): add due-for-sale vehicle report` for Angular, `feat(reports): apply fleet disposal thresholds to report reads` for the API and `docs(reports): record due-for-sale report evidence` for documentation.

## Verification

- Angular development build for `sigma` passed. The focused Karma test passed with measured toolbar spacing, configured thresholds and count, and an Excel round-trip preserving every page, numeric mileage, the plate's leading zeros and the calendar date.
- Release .NET build and `dotnet test` filtered to `DueForSaleVehicleReportTests` passed. It exercised both inclusive thresholds, date-only boundary, missing values, branch access, superseding terminal status, Buy Back inclusion and disabling one or both criteria.
- ESLint passed for 12 changed TypeScript and template files. Translation parity passed for 19 keys. The book reference check and all eight packet checks passed.
