# Idle Vehicle Report

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Shape | UI 07 read-only report, backend pattern 5 |

## Functional evidence and decisions

Screenshot 1 shows an optional branch, a seven-day minimum, three actions, and a branch summary of six statuses plus total. Screenshot 2 shows the vehicle detail columns and row count. The Speed analysis index and dated screen 45, route R0515 and controller C1016 confirm automatic initial read, inclusive threshold labeling, active and inactive location choices, and a combined export. No local report existed behind the menu. The Speed client does not expose the server's idle calculation.

Use the six exact idle statuses from Sigma's dashboard and latest recorded vehicle status as of the read, breaking timestamp ties by ID. Use the later of status time and latest visible operational movement date, with vehicle creation as the fallback when neither has a timestamp. Age is calendar days on the server's operational clock. Movement dates come from agreement opens, NRM, workshop, delivery and collection records. The movement column stays blank without a recorded movement. This is a Sigma-derived interpretation, pending comparison with an actual fleet sample.

| Concern | Owner and reference | Contract |
|---|---|---|
| Branch and day filters | UI20, DailyReport branch lookup | Optional visible branch including inactive options. Nonnegative integer days; default seven. |
| Detail and summary | BE17, dashboard idle statuses | Complete authorized detail rows. Group exactly those rows by branch for the summary. Counts are integers and mileage retains source quantity precision. |
| Tabs and action spacing | UI20/21, shared report panel and workspace tabs | Summary and Details selected locally. Leave the shared filter strip around the buttons. Print and Excel cover both sections. |
| Authorization | BE9/UI26, existing read-only fleet report boundaries | Options and read use Read. Print and Export also require their own grants. All operations keep tenant, deletion and whole-document branch scoping. |

## Reconciliation

The route `/Reports/IdleVehicleReport` and the fleet report menu point to the lazy Angular report. The bilingual in-app topic lives in `idle-vehicle-report-topic.ts` in the Reports guide. The backend controller and service supply a direct branch lookup and operational reads. The shared report state owns access changes, cancellation, the page loader, error feedback and re-reading the applied criteria for Print and Export. Tab changes perform no request. The report uses no persisted write, mapping profile, migration, or report cache.

| Section | Screenshot columns | Response fields in order |
|---|---|---|
| Summary | Branch, Pending Customer Delivery, Pending Workshop Delivery, Not Ready, Available, Ready to Go, Custody, Total | branchName, pendingCustomerDelivery, pendingWorkshopDelivery, notReady, available, readyToGo, custody, total |
| Vehicles | Branch, Vehicle Type, Make, Model, Colour, Mileage, Status, Plate No, Days Idle, Last Movement | branchName, vehicleType, make, model, colour, mileage, status, plateNo, daysIdle, lastMovement |

The detail query projects each candidate once and retrieves scalar movement dates in the same query. Summary counts derive from the filtered detail rows. Explicit selected-branch validation is one additional read. A 50,000-candidate limit returns an error rather than silently truncating the report. Existing status, NRM and delivery indexes cover their vehicle/timestamp columns. SQL Server plan, timing, visual print and comparison to a known fleet sample remain pending. No additional index is proposed without this evidence.

Discovery, filter and report contract, API/read grid, routing and reconciliation apply. Write and state-transition phases are inapplicable. Speed's server formula was unavailable; Odoo could not establish that product-specific behavior. The Sigma-derived calendar-day rule is the interpretation recorded above. No subagents were used.

Suggested commits are `feat(reports): add tabbed idle vehicle report` for Angular, `feat(reports): add branch-scoped idle fleet snapshot` for .NET and `docs(reports): record idle vehicle report contract` for documentation.

## Verification

- The Angular development build for project `sigma` passed with the new lazy route.
- Release build and focused `dotnet test` for `IdleVehicleReportTests` passed. The test verifies the inclusive seven-day boundary, newer movement, absence of a movement date, hired exclusion, branch access and summary-to-detail reconciliation.
- Focused `ng test sigma` ran the Idle Vehicle and Vehicle Ageing component specs in Chrome Headless. All four passed. The new spec measures the shared lower spacing, switches sections without a request, rejects export while filters are unapplied, and reads both Excel sheets back with numeric values.
- ESLint passed for the 13 changed TypeScript and HTML files. Arabic/English parity passed for all 26 new report keys. The eight generated packets were current and the book reference check returned no findings.
