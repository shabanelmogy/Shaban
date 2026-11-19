# Depreciation Report FY — read contract freeze

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-06 |

## Manifest

User authorizes review and implementation: `راجع : src\app\modules\Assets\depreciationReportFy وطبق التعديلات وفقا للوثائق`, followed by `كمل`.
Scope: named Angular report, directly related read API and wiring. UI screen07 Report, BE Pattern5 Report. Master2–5,7; UI1/2/3/5/6/8/16/19/20/21/22/23/24/25/26/27/28/29; BE17. Required sigma-screen-refactor skill applies. Recipe Check: Phase01 current, PLAN00 and phases00/02/03/04/05/06 stale; canonical books govern instead. Documentation owner must regenerate and semantically review packets. No generated edits.
Existing frontend changes in Asset/AssetType, toolbar/layout/routes/EN/AR and LoanEMI are owner work; preserve. Backend initial status clean. No reference edits, migrations, writes or financial-policy changes.

## Evidence E9 — 9.PNG

English/LTR desktop report; role/capture date/product version Unknown. Current functional reference only, no design authority.

| Evidence | Classification | Resolution |
|---|---|---|
| Title, Export Excel, Refresh | Explicit | Shared FeatureTitle, ReportActions and complete-response outputs |
| Year range | Explicit label; Conflicting interval semantics | Existing endpoint accepts calendar year integer only. Use validated Year1–9999, current calendar year default/reset; label calendar-year limitation. Do not map FiscalYear dates to a year and pretend a fiscal interval was applied |
| Branch Airport Branch | Explicit; Missing relationship | Asset/EntityBase and related CostCenter do not expose branch ownership. Show disabled empty field and translated reason; never send a branch filter or substitute cost center |
| Type, No, Title, Cost, Purchase Date, Previous Depreciation, Book Value | Explicit | Real DepreciationReportFyDTO fields; retain extra existing AssetName/DepreciationStart |
| JAN–DEC and apparent duplicate MAR columns | Explicit visible headings; Missing calculation/source | No monthly amounts or posted depreciation ledger in FY contract. Display translated limitation rather than invented zeros or annual/12 values. Do not duplicate March from screenshot artifact |

## Evidence E10 — 10.PNG

Continuation of E9; same metadata Unknown.

| Evidence | Classification | Resolution |
|---|---|---|
| More asset rows | Explicit | Preserve complete unpaged collection, deterministic type/title/id ordering |
| Final total figures | Explicit figures; formula Unknown | Backend totals of returned authoritative Cost, PrevDepreciation, CurrentYearDepreciation, BookValueFy. Same values on screen/print/Excel; no frontend sums |
| Future purchase date in past-year rows | Explicit captured value, business cause Uncertain | Existing eligibility uses DepreciationStartDate.Year, not purchase cutoff. Preserve and report limitation; no inferred eligibility correction |

Reviewer decision (owner standing rule): resolve missing Branch/monthly/fiscal-detail contracts through current supported calendar-year read; explain unavailable slices, do not invent financial values or persistence. Rejected alternatives: arbitrary branch join, changing accounting method/day proration, annual/12 monthly distribution, using FiscalYear start/end as a calendar year. These require a later confirmed business contract.

## Frozen API handoff

Dedicated GET `DepreciationReportFy` with `Filters[year]` integer1–9999; missing/invalid returns failed Result with translation key `depreciationFy.invalidYear`. Uses report FilterVM dictionary convention and QueryReport<Asset>() fail-closed tenant/live/no-tracking. CancellationToken propagated on dedicated read.
`Result<DepreciationReportFyReportDto>`: rows: DepreciationReportFyDTO[], totalCost:decimal, totalPreviousDepreciation:decimal, totalCurrentYearDepreciation:decimal, totalBookValue:decimal. Totals cover every returned row. No paging/clamp/Skip/Take. Shared canonical aggregation rule deviates narrowly: financial row algorithm already runs per asset in decimal/.NET; sum those exact returned values on backend so totals reconcile without a second SQL financial formula.
Raw `GET Asset/DepreciationReportFY?year` remains array-compatible and uses the SAME calculation owner. Dedicated report interface/service/controller; existing AssetService may delegate to it. Keep current straight-line annual formula, OriginalPrice basis, opening balance, eligibility, zero/negative-life skip and decimal precision. Do not introduce rounding, monthly/daily allocation, purchase-date/disposal/method rules. No posting effect.

Grid beside wire fields:
`typeName:text, assetNo:text, assetName:text, assetTitle:text, cost:money, purchaseDate:date, depreciationStart:date, prevDepreciation:money, currentYearDepreciation:money, bookValueFy:money`
↔ `TypeName, AssetNo, AssetName, AssetTitle, Cost, PurchaseDate, DepreciationStart, PrevDepreciation, CurrentYearDepreciation, BookValueFy` plus AssetId identity. Strings/dates nullable as server declares. No actions/ListVM/editor/write DTOs. Sorting disabled, complete no-paginator report with one shared fill grid. Print releases scroll, Excel all rows plus explicitly mapped server total row. All formatted values use shared data-table owner.

## Reference conformance before edits

| Concern | Block | Actual reference symbol/file | Shared owner | Correction |
|---|---|---|---|---|
| Shell/title | UI1/3/20 | CustomerStatementComponent host/template; TrailBalance config | ReportPage, FeatureTitle, global sigma-report-panel | route fills shell, single title, internal row scroll |
| Filters/actions | UI20/24/27 | CustomerStatement filterForm/search/reset; TrialBalance strip | report strip, ReportActions, PrimaryActionButton, NumericFocus, FieldError | typed Year, disabled Branch; Search/Refresh/Reset/Print/Excel; real form submit |
| Table | UI5/6/20 | TrailBalance typed section columns; DataTableColumn.type | DataTable | complete lazy=false/paginator=false/fill=true; shared money/date formatting |
| Totals | UI24/BE17 | TrailBalance summaryCards; SummaryCards public inputs | SummaryCards | four server totals, slim/row/min140/max80, twelve-pixel separation before grid |
| Request states | UI22/28 | CustomerStatement search/finalize; Job bindListQueries | StateMessage, apiErrorMessage, LoadingService | both failures, skip header, switchMap/defer, disable form, invalidated stale results |
| Output | UI8/21 | CustomerStatement buildExportRows; ReportPrintService.createSession | dataTableExportRows/onExportToExcel/print session | complete rows/current translations/server total; print restores form |
| Backend | BE17 | AccountReportsService QueryReport/controller | Repository.QueryReport, existing Result | dedicated typed authenticated report with one shared annual owner |

Route `/depreciationReportFy`, one child route; case-correct `Assets` lazy import. Remove duplicate Metronic title and unused legacy LayoutModule provider/import for formerly empty report service. Service providedIn root and environment.baseUrl; AppModule interceptor HttpClient only. Read/Print/Excel authentication unchanged; no permission API. No confirmation/mutation/transactions/AutoMapper/entity/EF changes. Add-Migration not required.
Reference Search/Refresh/Reset/Print/Excel Supported; customer tabs/charge exports/row ledger links Not Applicable (no corresponding sections or transactions).
Phases0/1/2/5/6 apply;3/4 skipped (read-only). No PLAN00 needed for this bounded confirmed-fix scope with financial algorithm unchanged; monthly/fiscal/branch business expansion deferred explicitly. Final source/diff review required; owner compilation/runtime/visual acceptance pending.

## Reconciliation clarification (2026-10-06; original freeze retained)

Direct source follow-up found existing `DepreciationEntry.Period/CurrentDepreciation/PreviousDepreciation/BookValue` records. They are a separate monthly execution snapshot, and the current FY endpoint never reads them. The E9 Missing statement means there is no confirmed monthly distribution in the FY response, not that monthly persistence is absent from Sigma. Mixing saved monthly executions into this calculated annual report would redefine its amount and prior/book-value semantics and completeness for unsaved months. This task does not authorize that accounting-report policy change. Future monthly/FY expansion must freeze whether to show posted/saved actuals, calculated forecasts or both, and how they reconcile to prior/year/book values. Preserve concurrent monthly-entry/detail/summary work.

Implementation refinement: dedicated FilterVM declares only the case-insensitive Filters dictionary; do not inherit unused pagination inputs. Existing DI assembly scanning registers the report service automatically; no explicit DI edit required. No FY service/provider/import was present in LayoutModule, so the conditional removal described above is Not Applicable. Existing report route export remains unchanged.
