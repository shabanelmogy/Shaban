| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Customer report summary density — 2026-10-08

Owner requests slim Total Balance in `/BalancesSummary` and adds `/ReceivableAgeAnalysis`. Current `pages/routing.ts` proves both routes belong to Customers; StaffBalancesSummary is a different route and is not modified by this follow-up. Initial scoped customer files are clean; preserve existing Staff changes.

Authority: Sigma AGENTS, screen-refactor skill, Master7 guide handoff and UI24 summary sizing. Root's preceding task already ran recipe drift Check (PLAN00/Phase00–06 stale); canonical book governs, generated files untouched. This small presentation follow-up uses no subagents because it has one bounded shared-input change, no independent implementation streams.

Frozen decision before implementation: reuse SummaryCardsComponent public density/layout/width/height inputs; keep values, labels, suffixes, totals, output and filters. Current source owner `summary-cards.component.ts` permits slim and clamps maxHeight to80 minimum. UI24/actual WorkOrder details reference uses slim/row/max80; target matches these inputs and retains its own approved widths (Balances180; Aging140). No feature card internals, CSS or accounting formula copied.

Changed frontend files:

- `src/app/modules/Customers/BalancesSummary/components/list/list.component.html`: Total Balance only compact→slim, row layout/max80; existing statement-dialog cards unchanged.
- `src/app/modules/Customers/ReceivableAgeAnalysis/components/list/list.component.html`: existing summary dense→slim/max180→80; row/min140 and12px host separation retained. Shared internal scroll/print release governs wrapped cards.
- `src/app/modules/UserGuide/content/customer-report-topics.ts`: existing bilingual Customers guide notes clarify the total card's full-result Dr/Cr meaning and Aging cards' applied-period labels. Existing `/UserGuide/customers` registration/menu reused.

No backend/API/VM/AutoMapper/entity/schema/domain-calculation changes. No new migration required. Phases00/01 scope/input decision,02 presentation,05 existing guide and06 source reconciliation apply; detail/write and domain-action implementation are not applicable.

Scoped complete diff, both Angular template parser checks and guide TypeScript parser check passed. This is syntax/source evidence only. Builds/tests/lint/typechecks/runtime/browser/database/migrations/snapshots/commits/push/deploy/Graphify/Sigma MCP were not run. Owner checks both pages in LTR/RTL, light/dark and narrow layouts, wrapped-card internal scroll, complete print and unchanged balances/Dr/Cr totals. Suggested frontend commit: `style(customers): use slim balance and aging summaries` (suggestion only).
