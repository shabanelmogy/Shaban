# Depreciation Report FY — feature review and source reconciliation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-06 |
| Scope | Confirmed guide corrections; annual report contract preserved |

Authority, manifest, screenshot E9/E10 tables, before-edit conformance and Frozen read handoff: [DEPRECIATION_REPORT_FY_CONTRACT_FREEZE.md](<DEPRECIATION_REPORT_FY_CONTRACT_FREEZE.md>). This review delivers the confirmed fixes; it does not claim completion of the screenshot's unsupported monthly/fiscal-period/branch business slices.

## Findings and implementation

| Finding | Outcome |
|---|---|
| Legacy ms-lib table-list, no primary-card title or bounded report layout | Replaced in place by ReportPage/FeatureTitle/DataTable. No parallel route or renderer. Single shared internal row viewport, route/container-fill and print-flow layers |
| No explicit typed Year form; legacy purchase-date search coercion | Calendar Year numeric control, integer1–9999, current calendar-year initial load/reset, reserved FieldError/focusField, one form submit. Backend validates same range |
| PrevDepreciation exists on server but missing from client model/grid; CurrentYearDepreciation hidden | Both retained authoritative amounts now shown beside Cost/BookValue, with shared money/date formatting |
| No server totals | Dedicated complete Result report returns four exact backend totals; shared slim SummaryCards outside rows and complete Excel total row |
| Loading only ends on success; no HTTP failure recovery or stale-read protection | switchMap/defer/takeUntilDestroyed, filter-edit cancellation, finalize, inline error owner + skip header; declared failure handled. Filters freeze in flight/print; changes invalidate output |
| Empty/not-run/failure indistinguishable | Shared grid distinct notRun/empty keys, error-aware empty suppression and shared StateMessage |
| Missing proper complete Print/Excel | Print session switches complete shared grid to unbounded flow; Excel reads original full array plus backend total row, current-language columns |
| Wrong Assets folder case in lazy import and duplicate toolbar title | Corrected only FY lazy import; existing toolbar pattern excludes FY title duplication |
| Empty report service and stale smoke spec ListComponent import | Implemented typed root service; repaired existing smoke spec symbol/providers, without adding behavior tests or running tests |

## Exact grid contract and outputs

No CRUD ListVM applies. Wire row `DepreciationReportFyDTO` contains these ten rendered fields plus `AssetId` identity. No sorting is advertised or invented. No column filtering beyond the actual Year report query. Complete-array proof: `DepreciationReportFyService.GetRowsAsync` queries all matching rows in one ToListAsync; no Skip/Take/page/clamp; response carries complete rows. UI lazy=false/paginator=false, totalRecords=complete rows.length.

| Visible label | Grid/wire property | Display | Filterable | Sortable | Excel | Confidence |
|---|---|---|---|---|---|---|
| Asset Type | typeName / TypeName | text | no | no | yes | Confirmed |
| Asset No | assetNo / AssetNo | text | no | no | yes | Confirmed |
| Asset | assetName / AssetName | text; existing extra retained | no | no | yes | Confirmed |
| Title | assetTitle / AssetTitle | shared wrapped text | no | no | yes | Confirmed |
| Cost | cost / Cost | money | no | no | yes | Confirmed |
| Purchase Date | purchaseDate / PurchaseDate | date | no | no | yes | Confirmed |
| Depreciation Start | depreciationStart / DepreciationStart | date; existing extra retained | no | no | yes | Confirmed |
| Previous Depreciation | prevDepreciation / PrevDepreciation | money | no | no | yes | Confirmed |
| Current Year Depreciation | currentYearDepreciation / CurrentYearDepreciation | money | no | no | yes | Confirmed |
| Book Value | bookValueFy / BookValueFy | money | no | no | yes | Confirmed |

Strings/dates match server nullability, zero money remains zero, missing text remains shared blank/—. Grid fields: `typeName, assetNo, assetName, assetTitle, cost, purchaseDate, depreciationStart, prevDepreciation, currentYearDepreciation, bookValueFy`; wire fields: `TypeName, AssetNo, AssetName, AssetTitle, Cost, PurchaseDate, DepreciationStart, PrevDepreciation, CurrentYearDepreciation, BookValueFy` + `AssetId`.

Year form/control number|null -> valid frozen `{year:number}` -> toFilterParams -> GET DepreciationReportFy `Filters[year]` -> FilterHelper.GetInt -> range check. Invalid/missing year returns HTTP400 failed Result with `depreciationFy.invalidYear`. No branch/year interval/monthly predicate. Changing Year clears response/totals/applied year and gates outputs; successful response captures the request snapshot year, not later form state.

Search/Refresh/Reset/Print/Excel Supported. Initial source behavior of automatic current-year load retained. Reset restores current year and not-run state without fetching. Refresh reruns validated current Year. Customer report tabs, charge-specific outputs and ledger links Not Applicable: no corresponding sections/charges/navigation in FY DTO. No row state, mutation, confirmation, dirty editor, permissions, transaction or posting workflow introduced.

## Backend, accounting and compatibility decisions

Dedicated Pattern5 service/interface/controller owns only report operations. `QueryReport<Asset>()` delegates live/tenant/no-tracking to the actual Repository owner and fails closed without a valid tenant. Projection returns only required annual inputs; deterministic SQL TypeName/Title/Id order. DI registration remains existing ServerAPI DependencyResolver assembly scanning (`FromAssemblyOf<AccountService>`, AsImplementedInterfaces, scoped); service has no extra HttpClient/injector fork.

Existing `Asset/DepreciationReportFY?year` still returns the raw array, now delegates to the same GetRowsAsync calculation and propagates request cancellation. Dedicated route returns Result with rows/totals. Legacy invalid year returns an empty array; dedicated route validates and returns its failure envelope. No external array consumer was migrated or broken. Client AssetService raw method remains available and its row type now correctly contains PrevDepreciation.

Annual formula remains: yearsInService=min(year-startYear+1,AssetLifeYears); annual=(OriginalPrice-ResidualValue)/life; previous=OpeningDepreciation + annual*(yearsInService-1); current=annual bounded by remaining depreciable amount; book=OriginalPrice-(previous+current). Skip life<=0, retain start-year eligibility. No rounding/purchase cutoff/day proration/disposal/depreciation-method rule added. Four server totals sum exact returned decimal values and cover the complete filtered year result. A documented narrow exception to BE17 SQL aggregation avoids duplicating this existing .NET financial algorithm in SQL. UI only formats results, never sums rows.

Existing algorithm limitations are recorded, not silently repaired: initial partial years still receive the current full-year rule; cap-years behavior can repeat the last annual result after useful life; OriginalPrice differs from TotalCost used by other depreciation reports; opening balances may permit negative book figures for invalid historical data. Financial-policy reconciliation requires an explicitly Frozen follow-up contract. Display rounding uses the existing shared two-place formatter, so sums of displayed rounded cells may differ slightly from a total of raw decimal amounts.

No AutoMapper changes: explicit read projection. No generic-service/controller override added; the pre-existing Asset GetList/Add overrides are outside the FY change and untouched. No entity/EF property, length, nullability, relationship/index, column or ModelSnapshot change in the FY diff. **Add-Migration is not required for this task.** Concurrent depreciation-entry entity/config edits belong to another task and are not attributed to FY.

## Final conformance comparison

| Concern | Actual target consumer/producer comparison | Result |
|---|---|---|
| Route bounds/title | Component host sigma-route-host/sigma-print-flow; ReportPage fill section + global report panel; exact /depreciationReportFy toolbar exclusion | Matched in source; runtime pending |
| Filters/actions | Year typed control + real ngSubmit; native NumericFocus/FieldError; stable shared report strip; ReportActions toolbar/public primary/secondary variants | Matched in source; narrow/RTL layout pending |
| Grid/scroll | columns real row keys; DataTable fill=true/scrollable=!printing/lazy=false/paginator=false; parent sigma-list-table report zero inset; public minimum84rem only | Matched in source; no private table renderer/styles |
| Totals | Report totals -> summaryCards descriptors -> SummaryCards slim/row/min140/max80 +12px host separation; backend source same complete rows | Matched; no client sums |
| Responses | Frontend service Result<DepreciationReportFyReport> ↔ backend Result<DepreciationReportFyReportDto>, exact four totals/rows | Matched in source |
| Validation | frontend integer1–9999 ↔ FilterHelper/year bounds; same invalidYear key available EN/AR | Matched in source |
| Dataset | Dedicated rows query has no paging or slicing; raw adapter same owner; complete original arrays go to grid/Excel/print | Matched; owner large-data acceptance pending |
| Lifecycle | query Subject/switchMap/defer; success/declaration/catchError/finalize; form disabled API; valueChanges invalidates/cancels; captured Year | Matched in source |
| Print | createSession(DestroyRef), printing gates actions/form, grid flow+sigma-print-flow; summary and applied Year remain printable | Matched in source; browser print/cancel pending |
| Excel | dataTableExportRows on complete original arrays + server totals with click-time translate; applied Year filename | Matched in source; workbook acceptance pending |
| Lookups | Year numeric (no failed lookup needed), Branch permanently empty disabled with reason; no invented lookup/filter | Explicit source limitation |
| Language/theme |26 matching own-namespace keys each EN/AR; general action keys reused; shared theme/RTL/card/table/overlay owners | Source parity passed; visual pending |

## Screenshot requirements still unsupported

- **Branch:** absent owning relationship; disabled empty field explains it. No Airport Branch value invented.
- **Monthly columns:** FY DTO/calculation has no twelve-month contract. DepreciationEntry already records monthly execution snapshots, but mixing saved execution amounts with this computed annual report needs a decision about actuals versus forecast and prior/book reconciliation. This review does not imply monthly persistence is absent from Sigma. No fabricated zero/month amount or duplicate March column.
- **Fiscal-year interval:** existing FY calculation uses a calendar-year integer and does not consume FiscalYear dates. Year and printed applied scope explicitly say calendar year. No arbitrary fiscal-date coercion.
- Screenshot amount/date causes are Unknown; source policy was preserved. No destructive/access/posting assumptions were made.

## Files changed by this task

Frontend repository `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- `src/app/modules/Assets/depreciationReportFy/components/list/list.component.ts`
- `src/app/modules/Assets/depreciationReportFy/components/list/list.component.html`
- `src/app/modules/Assets/depreciationReportFy/components/list/list.component.scss`
- `src/app/modules/Assets/depreciationReportFy/components/list/list.component.spec.ts`
- `src/app/modules/Assets/depreciationReportFy/models/list.ts`
- `src/app/modules/Assets/depreciationReportFy/services/depreciation-report-fy.service.ts`
- `src/app/modules/Assets/depreciationReportFy/services/depreciation-report-fy.service.spec.ts`
- FY namespace only in `src/app/modules/i18n/vocabs/{en,ar}.ts`
- FY lazy import only in `src/app/pages/routing.ts`
- FY title condition only in `src/app/_metronic/layout/components/toolbar/toolbar.component.ts`

Backend repository `F:/My Work/Sigma/SigmaBackend`:

- new `SiGma.ViewModels/ViewModels/DepreciationReportFy/DepreciationReportFyFilterVM.cs`
- new `SiGma.Helpers/Dtos/DepreciationReportFyReportDto.cs`
- new `SiGma.Business/IServices/IDepreciationReportFyService.cs`
- new `SiGma.Business/Services/AssetsServices/DepreciationReportFyService.cs`
- new `SiGma.ServerAPI/Controller/DepreciationReportFyController.cs`
- FY declaration only in `SiGma.Business/IServices/IAssetService.cs`
- FY constructor dependency and calculation delegation only in `SiGma.Business/Services/AssetsServices/AssetService.cs`
- FY cancellation adapter only in `SiGma.ServerAPI/Controller/AssetController.cs`

Review artifacts under `F:/My Work/Sigma/reviews`: this file and the contract freeze.

## Verification, phases and shared extraction

Phases0/1/2/5/6 applied. Phases3/4 skipped: no editor/write/domain transition. No broad Maintenance/Evolution implementation undertaken; source-confirmed guide corrections only. Recipe drift recorded: generated packets must be regenerated and semantically reviewed by the documentation owner; none edited.

Reviewed complete scoped tracked diffs separately in the two actual repositories, and new backend files as complete additions. Shared-file hunks include earlier owner changes and concurrently added depreciation/detail/summary work: reviewed for integration but preserved, never claimed as FY implementation. No repository-root assumption at the coordination workspace. git diff --check passed (line-ending normalization warnings only). Scoped searches found no ms-lib/ListCol/any/deep table styles/date serialization copies/merge markers. FY symbols, imports, raw adapter, root DI chain and schema boundary source-inspected.

Read-only TypeScript and Angular template parsing: **PASS**,10 scoped/directly related TS files and1 HTML; all feature local imports resolve. Parsing is not compilation/type checking. Existing smoke specs have updated symbol/dependency setup only; no new behavioral test suite and no tests executed. Translation checker depreciationFy:26 EN/26 AR,0 missing and0 case-only differences.

Shared-extraction gate: reused ReportPage, FeatureTitle, DataTable formatting/export, SummaryCards, ReportActions, PrimaryActionButton, StateMessage, FieldError, NumericFocus, toFilterParams, apiErrorMessage, focusField and ReportPrintSession. Removed duplicate FY annual algorithm by making the dedicated report service the sole owner, consumed by both dedicated and raw routes. No new universal reusable UI/financial rule qualified; Year/report summary mapping remain feature-specific. No books/skill/changelog update needed for pure adoption of existing guidance; no pending-promotion rule created.

Agent utilization: one `sol_worker` (`gpt-5.6-sol`, task fy_backend) implemented only the Frozen backend read slice while root implemented frontend; separate repositories, bounded file ownership and unchanged shared contract reduced elapsed time. Root reviewed integration and all final diffs, refined the FilterVM to omit unused pagination, preserved exact book arithmetic grouping and recorded the server-total exception. Other concurrent chats were not spawned or messaged by this task.

Authorization candidates: no mutation or privileged domain action in this report. AuthGuard and [Authorize] retained; read/Print/Excel use the authenticated data contract, with no new permission API or cosmetic security claim.

Owner-only build/tests/lint/browser/application/database/migrations/commit/push/deployment were **not run**. No Graphify or Sigma MCP used.

## Owner acceptance and suggested commits

1. Compile frontend/backend together; new API deployment and Angular consumer must arrive together. Verify DI resolves the new report service and AssetService constructor.
2. Search current/past year, bounds1/9999, empty/decimal/out-of-range input, Enter/Refresh/Reset; verify actual applied Year and no stale totals after edits.
3. Compare representative old/new annual values including opening depreciation, first-year, useful-life and future purchase/start cases; confirm policy preserved.
4. Exercise declared/HTTP failure then Refresh retry, delayed read/filter cancellation and route destruction; loader must clear on every outcome.
5. Use a complete dataset larger than typical page caps; compare full row count and four backend totals with screen, complete Excel plus its total row, and multi-page print/cancel. Print must restore form/scroll state.
6. Switch EN/AR, RTL, dark/light and narrow widths; test keyboard focus and confirm only shared rows scroll, title/filter/summary remain bounded, no page scrollbar.

Suggested only; stage FY-owned paths/hunks separately from unrelated changes:

- Frontend: `refactor(depreciation-fy): adopt shared report and complete outputs`
- Backend: `refactor(depreciation-fy): extract typed annual report and totals`

No migration command is required for FY. Build, runtime, browser, visual/accounting acceptance remain pending; no production-readiness claim.
