# Depreciation Summary — report contract

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-06 |
| Tier / scope | M; one read-only report and its directly related API |

## Manifest and authority

User authorizes review and implementation at Assets/depreciationSummary. Image 6.PNG supplies content evidence, not design authority. UI shape 07 Report (UI20/21/6), backend pattern 5 (BE17). Master0–7, sigma-screen-refactor, and applicable UI blocks govern. Recipe -Check reports drift in phases 0/2/3/4/5/6 and PLAN00; use canonical blocks; phase1 is current. Generated files require owner regeneration and semantic review.

References: shared ReportPage/ReportActions, Customers/StatementOfAccount list (filters/output/response lifecycle), Accounts/TrailBalance list (typed report columns/authoritative summary); BE17 QueryReport contract and actual AccountReportsService read model. No reference edits. Existing frontend modifications include asset, assetType, translations, toolbar, routing, LayoutModule and LoanEMI; preserve them. Backend discovery working tree is clean.

## Evidence

| ID | Screenshot content | Classification / source resolution |
|---|---|---|
| E1 | Depreciation Summary title | Explicit; assets.depreciationSummary |
| E2 | Date Range, Asset Type, Asset | Explicit; existing startDate/endDate/assetTypeId/assetId API |
| E3 | Branch | Explicit control, Missing data relationship: Asset and its EntityBase have no BranchId. Render disabled with explanation; no predicate, lookup, schema or fabricated branch value. Not an instruction to invent persistence. |
| E4 | Excel and Refresh | Explicit; support complete-array export and rerun applied current filters |
| E5 | Asset, depreciation start, purchase date, cost, residual, previous/current/cumulative depreciation, book value | Explicit; existing DepreciationSummaryItem. Preserve current extra TypeName column. |
| E6 | Footer amount under period depreciation | Explicit figure, calculation Unknown. Use backend sum of returned rounded Depreciation values; retain existing cumulative total as a second clearly labelled shared summary card. |

## Frozen read/API handoff

New dedicated GET DepreciationSummary: flat query startDate/endDate (required local yyyy-MM-dd), optional positive assetTypeId/assetId. No paging. Result<DepreciationSummaryReportDto> with rows: DepreciationSummaryItem[], totalDepreciation (sum of returned cumulative figures), periodDepreciation (sum of returned current figures). Date filter defaults to currentMonthRange. Backend validates real ordered dates and positive optional IDs. QueryReport<Asset>() enforces tenant/live/no-tracking boundaries; deterministic Id order; include AssetType. Complete response proven by absence of Skip/Take; UI lazy=false and optional local paging only.

Preserve raw-array Asset/GetDepreciationSummary route as compatibility adapter to the SAME dedicated report calculation; update IAssetService to async delegation if needed, never retain a second calculation. Dedicated report service/interface/controller/DTO/filter files each own one named type. DI follows existing register owner.

Existing month-difference straight-line formula, two-place decimal Math.Round, caps and name composition are retained. No depreciation method/opening balance/disposal/posting policy is approved by this request. Do not change accounting effects. Totals summed on backend from the already rounded complete rows to preserve exact row reconciliation and existing .NET rounding; this feature-specific deviation from SQL aggregate is justified because moving default Math.Round(decimal,2) to SQL ROUND changes midpoint semantics. No frontend financial resumming.

Grid order / row DTO: assetName:string, typeName:string, depreciationStart:date, purchaseDate:date, assetCostPrice:money, residualValue:money, prevDepreciation:money, depreciation:money, totalDepreciation:money, bookValue:money. Identity assetId only extra property. No ListVM or actions. DTO already matches. No AutoMapper: explicit report projection. No entity/EF change or migration.

## Workflow, integration and conformance before implementation

| Concern | Book | Reference symbol / shared owner | Target decision |
|---|---|---|---|
| Shell and title | UI1/3/20 | StatementOfAccount; ReportPage + FeatureTitle; global sigma-report-panel | sigma-route-host sigma-print-flow; fill report shell, title inside panel; no feature shell CSS |
| Filters | UI16/17/19/20 | StatementOfAccount.filterForm/search; DatePicker/dateRangeValidator/parseDateRange | typed reactive form, current month, dual calendar, native labelled form submission; exact assetTypeId key |
| Options | UI16/22 | BaseService.getSelectList, DropDownSelect | Asset/GetSelect and AssetType/GetSelect; typed IDs normalized; both failure channels, local retry, Search blocked on failed/inflight lookups |
| Grid | UI5/6 | TrailBalance.config.sections / DataTableComponent | typed complete dataset, fill rows, local pager default15; no sortable fields promised |
| Totals | UI24/BE17 | TrailBalance.summaryCards / SummaryCards | backend authoritative period and cumulative figures; slim row/min140/max80 |
| Output | UI8/21 | StatementOfAccount.buildExportRows; dataTableExportRows/onExportToExcel/ReportPrintService.createSession | complete rows; click-time EN/AR headers; full print independent of local paging |
| Lifecycle | UI22/28 | StatementOfAccount.search/loadCustomers; apiErrorMessage | disable filter form during request; finalize loader, takeUntilDestroyed, filter changes clear stale output; print session disables form |
| API | BE17 | AccountReportsService / Repository.QueryReport | dedicated typed report; old raw route compatibility adapter; one calculation owner |

Reference actions: Search/Refresh/Reset/Print/Excel Supported. Specialized charge grouping, report-type tabs, customer links Not Applicable (no allocations/charges/sections). No risky actions or confirmations. AuthGuard and authenticated report controller; authorization candidates: report read/export, deferred central permission system (UI26).

Route remains depreciationSummary with one empty child route; correct folder case Assets in lazy import; suppress duplicate Metronic toolbar title using existing report route list. Service providedIn root uses inherited interceptor-enabled HttpClient and environment.baseUrl. Inline requests use X-Skip-Error-Interceptor; lookup/report errors have one owner. No writes, DTO payloads, transactions, schema or mapping changes.

Phases 0/1/2/5/6 apply. 3/4 skipped: no editor/write/domain transition. Maintenance plan not required: one report extraction with unchanged calculation policy and preserved legacy response, no cross-module business/schema/shared-owner change. Branch remains an explicitly reported unsupported slice, not a fabricated frozen API.

Owner verification: compile both repositories; run valid/manual invalid dates, each asset/type filter, empty/failure/retry paths, local paging, full Excel/print, EN/AR, RTL/dark/narrow layout. Source-only review cannot establish runtime acceptance.
