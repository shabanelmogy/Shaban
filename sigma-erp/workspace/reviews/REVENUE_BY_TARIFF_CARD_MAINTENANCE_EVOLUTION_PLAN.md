| Status | Owner verification pending |
|---|---|
| Frozen | yes |

# Revenue by tariff card

2026-11-20 · Tier L · Report 07, backend pattern 5. Review and implement the confirmed screenshot scope. The existing sidebar item opens the tariff-card definitions at `/TariffCard`. No report route, API, guide topic, or prior feature artifact was found. Retain the existing definitions screen and its contracts.

| Area | Decision and impact |
|---|---|
| Sidebar, route, report guide | Replace the report link target and create its own lazy route and bilingual topic. Preserve peer edits in shared registries. |
| Report shell, date range, options, table, print, workbook | Keep the shared owners. Create a typed report with complete rows and footer totals. |
| Data and currency | Keep the rental agreement, customer billing, card, vehicle and saved invoice models. Compose the existing daily-revenue read with bounded billing period reads. No schema or data change. |
| Authorization | Add a report resource through the current catalogue and whole-document read policy. Read is required for output operations. No role assignments. |

The sibling Revenue by Vehicle Type contract establishes the current customer billing card, estimated rent and billed-day sources. Reuse those meanings for this view. A historical contract card cannot be recovered from the agreement fields. Grouping by today's tariff rules or inferring an old card from prices would change attribution without a persisted relationship. The current-profile basis is disclosed in the guide. See the feature freeze for source evidence, coverage, gaps, and full transport.

| Slice | Completion evidence |
|---|---|
| Discovery and freeze, phases 0–1 | Scope, screenshot, source, reference cycle and report rules recorded before implementation. |
| Backend and UI report, phases 1–2 | Focused aggregate/filter/access specs, scoped API build, Angular build and changed TypeScript lint. |
| Route, guide and reconciliation, phases 5–6 | Source route and permission map, bilingual help topic, three-repository diff, runtime acceptance pending. |

Phases 3 and 4 are inapplicable to this read-only document. Owner verification covers screenshot fields, restricted branches, totals, complete print/workbook, Arabic RTL, narrow layout, themes and SQL Server timing. Rollback is a source revert of the additions and report link change.
