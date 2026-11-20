| Status | Owner verification pending |
|---|---|
| Implemented — source-only | yes |

# Revenue by vehicle type

The original Reports menu entry opened /Vehicle. No report endpoint, report page or dedicated guide existed. The implemented flow is Reports → Revenue by Vehicle Type → Search → optional Print or Excel. See [the frozen decisions and screenshot evidence](REVENUE_BY_VEHICLE_TYPE_CONTRACT_FREEZE.md).

## Reconciliation

| Item | Implementation and evidence |
|---|---|
| Reference filters and actions | Date range (today initially), branch, vehicle type and tariff card. Search applies the draft. Print and Excel separately re-read the full authorized result. Print includes the applied criteria, Excel preserves criteria and currency on a separate sheet. |
| Grid and API | Vehicle type, revenue, rental days, billed days, number of rentals, LOR and RPD map to vehicleTypeName, revenue, rentalDays, billedDays, rentals, lor and rpd. vehicleTypeId is the grouping identity. No ListVM or write DTO. |
| Total and nulls | Complete server totals, with weighted ratios. The example total gives 43,931 / 158 = 278.04 and 9,568,994.26 / 47,395 = 201.90. Missing income keeps the affected amounts blank. A valid zero is distinct from a missing amount. |
| Source limits of comparison | Speed does not expose its server-side billed-day basis. The screenshot's “abc test” has one rental and 2,016 billed days within a 366-day search. On 2026-11-20 the owner explicitly chose invoice days inside the selected period for Sigma. This explains the intentional difference from that sample. |
| Access, loading and cache | Dedicated catalog actions, Read prerequisite for outputs, no grant assignments. QueryReport applies tenant and soft-delete filters; standard whole-document branch mode and invoice completeness check. Shared page loader and request lifetime, no grid spinner duplication. Scoped options are direct reads tied to access context; operational reads are fresh. |
| Integration and guide | Sidebar, lazy Reports child route, route policy, compiler entry, AR/EN vocab and Reports guide. The bilingual topic covers source dates, tariff, scope, ratio definitions and export. |
| Performance and persistence | Filtered contract query, batched invoice periods, bounded daily-revenue composition. No per-row query. Limits of 10,000 agreements, 100,000 periods and the daily owner's 100,000 rows. SQL Server timing and plan inspection pending. No evidenced need for a new index. No mapping profile, migration or writes. |

Discovery, contract freeze, read grid, integration and reconciliation apply. There are no detail, write or domain-action phases. Two independent implementation agents owned the report service/VM tests and feature UI/tests after freeze; the root owned integration and verification. Reused the existing daily revenue service, financial policy, report state, DataTable, print and workbook helpers.

## Owner acceptance

Compare an agreement and its invoice periods with the report using a branch and type filter. Check the current customer tariff and clipped invoice dates against their source records. Compare on-screen rows, totals, print preview and workbook in both languages. SQL Server timing and production-like data acceptance require a representative dataset.

Suggested commits: Angular `feat(reports): add revenue by vehicle type`, backend `feat(reports): aggregate rental revenue and billed days by vehicle type`, documentation `docs(reports): record vehicle type revenue contract and verification`.
