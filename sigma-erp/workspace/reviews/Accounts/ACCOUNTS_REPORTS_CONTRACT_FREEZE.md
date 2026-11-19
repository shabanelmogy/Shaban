# Accounts reports contract freeze

| Status | Owner verification pending |
|---|---|
| Frozen | yes |

## Owner navigation amendment — Trial Balance (2026-11-16)

Owner requests removing the duplicated Trial Balance item from the top-level Reports menu because it already exists under Accounts reports. Tier S, implemented source-only: remove that item from `sidebar-menu-data.ts`; retain Accounts → Reports → General Reports and its existing `/Reports/TrialBalance` route. The report component, permission and API are unchanged. `reports-guide.ts` now directs users to the Accounts location in Arabic and English; the existing Accounts guide already matches.

Shared owner is the existing sidebar data catalogue (UI1/UI26); this explicit duplicate-navigation removal changes no functional report contract and needs no Speed guide/code or Odoo comparison. Loading/cache/query/index/numeric gates are unaffected because no request or report owner changes. No schema/migration, tests, browser or database execution. No delegation for a one-item edit. The scoped Angular `ngc --noEmit` compilation of the menu and guide passed; its temporary config was deleted. Scoped diff/whitespace checks passed and prior unrelated changes were preserved. Runtime menu acceptance remains pending. Suggested frontend commit only: `fix(navigation): remove duplicate Trial Balance from Reports`.

## Evidence and scope

The user authorizes review and all guide fixes in Accounts. The recipe refresh prerequisite is implemented and all eight generated packets pass `-Check`. `REPORT_API_DISCOVERY.md` records each producer, filter, response, completeness and calculation. This handoff owns all report roots except Journal and Budget: BalanceSheet, BalanceSheetMonthWise, BudgetVariance, CashFlowStatement, IncomeComparison, IncomeStatement, IncomeStatement2, IncomeStatementFy, IncomeStatementFy2, IncomeStatementYtd, IncomeStatementYtd2, Ledger, TrailBalance and VehicleIncomeStatement. Backend business calculations remain unchanged.

## Frozen read and presentation contract

- Existing `AccountReports/<action>` routes, `Filters[...]` names, enums, result envelopes and backend-owned figures remain. All fourteen responses are proven complete aggregates; local presentation uses `lazy=false`. Do not introduce server pagination.
- Keep every existing visible data column, section, subtotal, applied-filter scope, and complete export/print content. No new accounting KPI or formula.
- Nested `children` remain nested source data. Add an optional typed hierarchy capability to shared DataTable instead of feature-owned tables or business flattening. Stable row identity owns expansion; accessible expand/collapse and logical RTL indentation belong to the shared grid. Screen expansion must not omit descendants from export or print. Ordinary DataTable consumers retain their behavior when hierarchy is absent. Read-only hierarchy has no row action/selection semantics.
- IncomeStatementFy2 intentionally remains flat, with existing level-based presentation; do not invent children or change aggregation.
- `hideBudget` is a local applied display option: omit from wire request, retain column visibility. BalanceSheetMonthWise frontend identity/nullability aligns with backend fields. Normalize nullable CashFlow section arrays to empty arrays at the consumer boundary.
- Typed filters/models/columns, current-month date ranges, shared date parsing/serialization, cancellable/latest-request ownership, destroyed-request teardown, lookup readiness/retry, both declared and transport errors, and one feedback owner are mandatory. Inline-owned failures use explicit skip-error headers and `apiErrorMessage`.
- Shared bounded report hosts, FeatureTitle, ReportActions, PrimaryActionButton, StateMessage, SummaryCards and DataTable own appearance. No viewport calculations, raw feature table/tree-table, ms-lib, deep grid overrides, or local palette. Each section has one scroll owner; print releases bounds and emits all complete data.
- Existing exports build translated headers at click time from applied report data and typed columns, never an incomplete visible subset or stale filter form.

## Reference conformance before implementation

| Concern | Book | Actual reference/symbol and compared value | Shared owner | Target |
|---|---|---|---|---|
| Host/panel | UI1/20 | CustomerStatementComponent host `sigma-route-host sigma-print-flow`; report fill panel | ReportPage/global styles | Adopt for all reviewed routes |
| Grid/sections | UI6/20 | CustomerStatement typed DataTableColumn and complete per-section arrays | DataTable | Extend public hierarchy; no feature renderer |
| Filters/dates | UI4/20/26 | CustomerStatement typed form, parseDateRange, request teardown | date-utils/report filter strip | Preserve filter keys and current-month range |
| Title/density/accounting | UI3/20 | TrailBalance title/panel; shared grid money formatter | FeatureTitle/DataTable | Match shared values, no legacy row palette |
| Summary | UI20/24 | readonly SummaryCard with server values | SummaryCards | Only existing report totals/subtotals |
| Errors/output | UI8/20/22 | CustomerStatement request state, shared apiErrorMessage/export mapping | interceptor/print/export | One owner; complete applied dataset |

## Integration and boundaries

The implementation worker owns the fourteen roots above and `src/app/modules/shared/components/data-table/*` only. A small Accounts-local typed report family is permitted for repeated lifecycle, not a new global framework. Root owns route/tsconfig/translations integration and book/skill promotion. Any needed translation keys must be reported to root. Root owns Journal/Budget and backend metadata corrections. No builds/tests/lint/browser/database/migrations/commits. Source-only reconciliation remains pending.

### Producer file organization amendment

Direct DTO inspection confirms report requests, lines and subtotals share source files. Root moves each named type for the fourteen reports into its own existing-layer file as required by AGENTS/BE3. Names, namespaces, property types, nullability and formulas remain byte-equivalent declaration bodies. BankReconciliation contracts remain outside this Accounts screen scope. No API/model/mapping or schema change is authorized by this organization amendment.

## Owner row-inclusion amendment — CashFlow zero items (2026-10-05)

Owner explicitly requires CashFlow items to remain visible at zero. GetCashFlowIndirectAsync must emit existing configured group accounts with0 Amount, including no-movement/net-zero cases. Retain account metadata/existence and live/tenant/cutoff/posted predicates; missing account IDs are not fabricated. Six producer zero-skips are removed only for CashFlow; fixed groups/signs/formulas/response fields stay. All five totals remain backend-owned and zero rows flow to tree/print/complete Excel. This supersedes historical row omission without changing other reports' include-zero semantics.

## Owner single-tree amendment — BalanceSheet (2026-10-05)

Owner rejects the split non-accounting layout and requires one tree. Frozen presentation scope: replace three independent section grids and three KPI cards with one full-width shared DataTable hierarchy in Assets/Liabilities/Equity source order. Preserve every original account root and descendant, its code/name/amount and ledger navigation. Distinguish original roots with shared section tone; place the existing authoritative totalAssets/totalLiabilities/totalEquity as noninteractive closing total rows after each complete category tree. Keep Account/Amount columns at78%/22%, wrapped labels and shared numeric alignment. Stable prefixed account identities cannot collide with synthetic total identities. Default-expanded hierarchy, complete print irrespective of collapse, and original three-section complete Excel shape remain. No combined financial total, frontend formula, mapping/configuration fallback, producer/API/schema change or source-row omission is authorized. Existing Retained Earnings validation remains.

## Owner layout amendment — IncomeStatement2 (2026-10-05)

Owner requests better organization. Frozen display-only scope: one full-width shared hierarchy grid instead of the current independent subtotal/details grids. Retain Account/Sub Group/Balance/Budget/Variance fields, every original root/child in source order and default expansion. Show four existing response subtotals after complete account trees in producer order: grossProfitLoss, profitLossBeforeSaleOfAssets, profitLossOnSaleOfAssets, netProfitLoss. Shared subtotal/total tones distinguish the last double-rule result; no client re-sum, inferred subgroup grouping or invented journal-link action. Three header summary figures remain exactly totalRevenue/totalExpenses/profitLoss, through compact shared slim cards; ProfitLoss is distinct from NetProfitLoss and must not be substituted. Local display identities separate accounts and subtotal rows. Translate recognized source SubGroup enum names in screen text; unknown values retain original text. Preserve original complete two-section Excel shape/order/headers and raw subgroup source values; full print includes every tree descendant and final results independent of expansion. Filter/API/producer/model payload/schema/zero-row rules remain unchanged.

## Owner layout amendment — IncomeStatementYtd2 (2026-10-05)

Owner explicitly requests the same organization as IncomeStatement2. Frozen display-only scope: one full-width filling shared tree grid containing every original root/descendant in source order, then four existing grossProfitLoss/profitLossBeforeSaleOfAssets/profitLossOnSaleOfAssets/netProfitLoss entries. Four columns remain Account/CurrentMonth/CurrentYtd/PreviousYearMonth at46/18/18/18%,52rem minimum, shared wrapping/numeric alignment/section/subtotal/final double-rule tones. Preserve backend-produced summaryReport and hideZeroActivity slicing, month/branch filters and all three comparison-period meanings. Retain the original three header ProfitLoss figures exactly, slim/max80 cards and existing12px separation; do not substitute NetProfitLoss. Prefixed local identities separate structural result rows from actual accounts. No invented subgroup column, regrouping, arithmetic or ledger action. Preserve the prior shared-family two-section Excel shape/order/headers from original nested data and full print independent of collapse. API/producer/request/response/schema and source inclusion rules unchanged.
