# Vehicle Ageing Report

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | Report route, branch-scoped aggregate, tabbed presentation, print, Excel and bilingual guide |

## Discovery and contract

The existing fleet-report menu pointed to the general vehicle screen. No dedicated Sigma report or frozen feature contract was found. The source path is Fleet and Vehicles in Reports. UI shape 07 and backend pattern 5 apply. The detailed utilization screen demonstrates the shared tab panels, the status report 2 demonstrates a filterless report, and the shared report page, table, tabs and print session own presentation.

Screenshots 1–4 show named categories with model and make, ten descending model years, Others, row totals and category footers. Screenshot 5 also shows an unnamed category. Actual fleet categories and counts come from the scoped roster. The Speed analysis entry, reports screen 46, route R0524 and dated controller C1081 confirm automatic initial read, category groups and a complete Excel export. The five images supply column and output evidence. No Odoo rule is needed.

Use VehicleType.VehicleCategory, Vehicle.Year and the registered make/model. Count each visible, non-deleted vehicle once. The ten years start at the server's current UTC calendar year. Other years and missing years go to Others; a missing category gets its own localized tab. Missing model/make does not drop a vehicle. Show only populated categories; print and export all independently of selection. The dedicated Read, Print and Export actions follow whole-document fleet report authorization and normal read prerequisites. The report has no write action or schema change.

## Implementation and reconciliation

| Requirement | Delivered |
|---|---|
| Normal entry | Fleet and Vehicles menu → `/Reports/VehicleAgeingReport`. The lazy route, access policy, Arabic and English labels and Reports user guide point to the same screen. |
| Scoped result | `VehicleAgeingReportsController` uses Read, Print and Export permissions. The service aggregates the scoped vehicle query with optional type, make and model joins. SQL-side counts are pivoted into integer buckets and footers after materialization. The API supplies the year axis; the UI and workbook use that axis unchanged. |
| Navigation and display | The filterless report reads on entry. Shared workspace tabs use stable category identifiers, labeled panels and a fallback category. Switching is local. Refresh retains an available category. Each table displays model and make, ten years, Others, and Total. Footers use the backend totals. |
| Output | The shared print session prepares every category; the tab strip is screen-only and each category has a print heading. The named all-category Excel action rechecks export access and emits complete rows and category subtotals with numeric counts. |
| Request lifetime | The shared report state owns initial and refreshed reads, error/retry, progress and cancellation. Session, access or branch changes invalidate the result. Category selection starts no request. There is no report cache, server paging, EF migration, write action or mapping profile. |

## Verification

- The Angular development build for project `sigma` passed. The Release build of the API and affected test project completed through `dotnet test`. A first Debug attempt encountered DLLs held by a running local API. The Release output was used without stopping it.
- `dotnet test tests/SiGma.BranchAccess.Tests/SiGma.BranchAccess.Tests.csproj -c Release --filter FullyQualifiedName~VehicleAgeingReportTests`: 9 passed. Coverage includes tenant, deleted and excluded branch rows, model grouping, boundary years, future/missing years, uncategorized vehicles, permission dependencies and the actual MVC authorization filter. The test fixture binds the request in the caller's execution context.
- Focused Karma component spec: 2 passed. It verifies tab selection and refresh, both printable panels, loss of access, and reads the generated XLSX back to check both categories and numeric subtotals. Changed-file ESLint covered 12 TypeScript/template files.
- Updated UI20's tab conversion guidance to reference UI8 when an existing complete export is preserved. Regenerated the PHASE-02 and PHASE-06 fingerprints through the generator. All eight packets and the documentation reference check passed.
- Live fleet data, the SQL query plan and physical print appearance remain pending. Runtime acceptance should compare one populated category and the uncategorized group with a known fleet sample, then use print preview from a non-primary tab. No index change is justified from source alone.
- Suggested commits: frontend `feat(reports): add tabbed vehicle ageing report`, backend `feat(reports): aggregate scoped vehicle model years by category`, documentation `docs(reports): clarify all-category output when converting to tabs`.

## Spacing below the action row

The initial template put the toolbar directly beside the category tab strip in
the report panel. The layout test measured zero vertical separation. Wrapped
the toolbar and its feedback in the shared report filter panel used by Vehicle
Status Report 2. Its shared padding and lower margin now supply the spacing.
The focused Karma spec passed all three cases, including the measured gap,
switching tabs and exporting all categories. UI20 now calls out this wrapper
for reports with an action row and no filter fields.
