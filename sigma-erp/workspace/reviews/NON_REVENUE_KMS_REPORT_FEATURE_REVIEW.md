# Non Revenue KMs Report

## Evidence and contract

The Sigma menu item previously routed to the general vehicle page. The supplied screenshot establishes Date Range, Vehicle, a minimum variance of 30, Search, Print, Excel, and the eleven displayed columns. The Speed workflow guide and dated screen 50, route R0525 and controller C1023 confirm a today-to-today default, automatic initial read, optional date restriction, plate lookup and complete export. The Speed client does not supply the server's mileage pairing rule. No unrelated reference can establish the missing Speed calculation.

Sigma uses recorded collection and delivery movements by exact vehicle ID. For each selected-period delivery, take the most recent strictly earlier collection after the immediately previous delivery, if any. The previous same-timestamp delivery also blocks a duplicate pairing. The receiving event can precede the selected period. Agreement-linked returns and deliveries can belong to the same agreement, including replacements. Use the movement's own branch and odometer on each side. Subtract KM In from KM Out and include values at or above the nonnegative threshold. Incomplete, invalid and decreasing readings cannot establish a positive movement. Treat a recorded zero as a reading. Do not infer a historical movement or branch from an agreement date, a vehicle's current odometer or its current branch.

Both movements, their non-void rental or lease agreements, and the vehicle must be visible in the current tenant and branch scope. Company-wide sequence lookup reads movement identities for authorized departure candidates only. A hidden or invalid intermediate handover blocks pairing to an older event. Report dates use the departure date with inclusive calendar endpoints; clearing the date restriction reads all history. Above 50,000 candidate departures, the report returns an explicit error so a partial result cannot become a complete printout or export.

| Concern | Owner | Result |
|---|---|---|
| Read-only report and filters | UI07, UI20, Vehicle Charged vs Driven and shared ReportPage/ReportActions | One table, optional date range and searchable vehicle selector, shared meter input with six-digit precision, and usual report states. |
| Data and access | BE9, BE17, BE18, AgreementReturnReportQueries identity-probe pattern | Scoped movement and agreement publication. The sequence and variance are server-owned. Separate Read, Print and Export grants. |
| Table and output | UI6, UI8, UI21, shared DataTable and ReportPrintSession | Shared local pagination. Print and Excel include the full filtered result. Agreement and plate numbers remain strings; measured kilometres remain numbers. |

Read-only report. No schema change, accounting action or data repair is required.

## Verification

- API Release built successfully. The nine focused xUnit cases passed, covering the inclusive threshold, earlier collection outside the displayed date window, hidden handovers, invalid readings and the endpoint grants.
- Both focused Karma cases passed. They cover the 30 km default, clearing the date restriction, local paging, numeric distances and leading zeroes in the exported workbook, and all-row print preparation. Changed-file ESLint passed. PrimeNG API metadata accepted the publisher bindings, with Sigma directives validated through Angular.
- A read-only smoke check of the compiled service on the verified experimental SQL Server returned 52 vehicle options and no qualifying rows. The checked tenant has one agreement-linked delivery and five agreement-linked collections, with no collection preceding that delivery for the same vehicle. The cold options and report check took about 28 seconds including model initialization. A warm query plan and live app and print preview remain pending.
