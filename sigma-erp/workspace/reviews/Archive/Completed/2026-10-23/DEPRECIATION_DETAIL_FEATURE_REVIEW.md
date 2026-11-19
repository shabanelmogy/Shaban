# Depreciation Detail — implemented review

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-06 |

## Outcome and scope

Implemented the confirmed fixes authorized by `راجع ... depreciationDetail وطبق التعديلات وفقا للوثائق`, followed by `كمل`. Frozen handoff: [DEPRECIATION_DETAIL_REPORT_CONTRACT_FREEZE.md](<DEPRECIATION_DETAIL_REPORT_CONTRACT_FREEZE.md>). One screen, tier M. UI screen07 Report; BE Pattern5 read query adapted inside the existing Asset service/controller for compatibility.

Legacy ms-lib table, untyped AssetDTO binding, date-to-UTC transport and repeated group-total arithmetic were replaced. One shared report grid displays each type's authoritative subtotal with its original asset children; Search/Refresh/Reset, complete Excel, Print and shared tree controls are available. The grand total is returned by the backend and never recalculated on the client. Existing financial formula and eligibility remain unchanged.

Root instructions, required sigma-screen-refactor skill and owning Master/UI/BE blocks were read. Recipe Check: Phase01 current; PLAN00, Phase00/02/03/04/05/06 stale. Canonical books used for stale packet phases; documentation owner must regenerate and semantically review derivatives. No generated/instruction/reference files edited. No new reusable rule was established, so no learning promotion is required.

## Screenshot evidence

Both screenshots: read-only report, English/LTR, desktop; role, capture date/version unknown. Images supply content evidence, not styling authority.

### E7 — 7.PNG

| Visible evidence | Classification | Final behavior / phase |
|---|---|---|
| Date Range, Asset Type, Asset | Explicit | Typed shared date/lookup controls, exact API filter keys; P1/2 |
| Branch | Explicit label, Missing relationship | Empty disabled field and explanation. Asset/CostCenter have no Branch relationship; no fabricated query; P1/2 |
| Motor Vehicle and subtotal | Explicit | Shared default-expanded hierarchy group with response TotalDepreciation; P2 |
| Asset, Cost, Residual Value, Chassis No, Depr Start, Purchase Date, Depreciation | Explicit | Typed response-to-grid bindings preserve individual values; P2 |
| Month and nested depreciation | Explicit content; monthly calculation Uncertain | Source's Month/period label displayed in its own column with original period amount. No invented monthly schedule; P1/2 |
| Refresh / Export to Excel | Explicit | Same applied report response, complete output independent of expansion; P2 |

### E8 — 8.PNG

| Visible evidence | Classification | Final behavior / phase |
|---|---|---|
| Attachment, Water Dispenser and subtotals | Explicit | Source group labels retained; no invented type categorization; P2 |
| Additional assets with period amounts | Explicit | Complete array, not a first page; P2 |
| Grand Total | Explicit | New backend envelope totals each group exactly once; shared SummaryCards and full Excel; P1/2 |

### E7/E8 column contract

| Visible label | Grid field | Actual DTO field | Display | Filter / sort | Export | Confidence |
|---|---|---|---|---|---|---|
| Asset | label | AssetName / AssetId | original name or —; group roots AssetType | assetId selector / no sort | yes | Confirmed |
| Cost | cost | Cost | shared money | no / no | yes | Confirmed |
| Residual Value | residualValue | ResidualValue | shared money, zero retained | no / no | yes | Confirmed |
| Chassis No (E7) | chassisNo | ChassisNo | original value or blank; legacy Asset.Detail alias | no / no | yes | Confirmed alias; dedicated source Missing |
| Depr Start | depreciationStart | DepreciationStart | shared dd/MM/yyyy | range query affects eligibility, no standalone filter / no sort | yes | Confirmed |
| Purchase Date | purchaseDate | PurchaseDate | shared dd/MM/yyyy | no standalone filter / no sort | yes | Confirmed |
| Month | month | Month | original period label | no / no | yes | Confirmed period; separate monthly values Missing |
| Depreciation | depreciation | Depreciation | shared money; roots use TotalDepreciation | no / no | yes | Confirmed |

Export scope is confirmed by UI8 and the user-supplied Export action; server/client column sorting is deliberately disabled to retain group order. E8 omits Chassis No in its captured non-vehicle sections; the existing source column remains, because screenshot absence does not authorize removing it.

## Final decisions and contract comparison

| Concern | Decision and evidence |
|---|---|
| Shape / route | Existing `/depreciationDetail` report route retained; lazy import now uses actual `Assets` casing; no editor modes |
| Grid / wire | `label, cost, residualValue, chassisNo, depreciationStart, purchaseDate, month, depreciation` ↔ `AssetName, Cost, ResidualValue, ChassisNo, DepreciationStart, PurchaseDate, Month, Depreciation`. Group roots use AssetType/TotalDepreciation. AssetId supplies identity. No CRUD ListVM |
| Filters | `dateRange` → top-level startDate/endDate through parseDateRange; currentMonthRange default/reset. assetTypeId/assetId are owning nullable selects and omitted when null. Branch never sent |
| Date validation | Validators.required + shared dateRangeValidator + DatePicker guards; FieldError reserveMessage and invalid-field focus. Backend rejects omitted/default/reversed dates and nonpositive supplied IDs |
| API | New `GET Asset/detail-report` → Result with entity.groups/entity.totalDepreciation. Original `GET Asset/detail` raw array preserved |
| Paging / count | GenerateDepreciationDetail has no PageNo/PageSize/Skip/Take/clamp. Entire filtered set returned. Grid lazy=false/paginator=false, no manufactured metadata |
| Financial ownership | Existing straight-line monthly-offset formula/rounding stays backend-owned. New overall amount sums authoritative returned group subtotals once; no template/client financial sums |
| Mapping / persistence | Anonymous scalar read projection; no AutoMapper change, entity/EF change, write or transaction. No Add-Migration for this task |
| Actions | Search/Refresh load current validated filters; Reset restores month/null selects. Print, Excel and Expand/Collapse are read-only. Reference charge-type export/account-ledger links are Not Applicable: these DTOs contain no voucher-type/account relationship |
| Error / async | One query Subject/switchMap, teardown and finalize for success/error/cancel, global loader for report only. Both declared Result and transport errors use local skip-interceptor feedback; lookups local busy/retry. Form frozen while report/print runs; edits clear old output |
| Integration | Root-provided thin service on environment.baseUrl; AppModule interceptor-enabled client, no HttpClient fork. AuthGuard layout and inherited API Authorize preserved; no permission API. Read/export/print are authorization candidates only |
| Styles / accessibility | Canonical bounded report/title/filter/table/summary/action/state owners. No feature stylesheet, palette or internal table override. Label/inputId, translated toolbar names, native buttons/shared tree keyboard semantics, logical theme/RTL owners |

## Final conformance and report-output evidence

| Target consumer → producer | Reference / book | Compared contract | Result |
|---|---|---|---|
| DepreciationDetailComponent host/template → ReportPage/global styles | CustomerStatement outer shell, TrialBalance composition; UI1/3/20 | route-fill, panel16/14 insets, title -8/0/16 margin, direct table zero inline inset; fixed filter/title with one filling grid row viewport | Source matched; visual pending |
| filterForm/template → DatePicker/date-utils/report strip | CustomerStatement date control/actions; UI16/17/19/20 | one typeable two-month range, real ordered dates, current-month default, 34px stable filter fields, body overlays, required error reservation | Source matched |
| columns/rows/hierarchy → DataTable | TrialBalance sections/hierarchy; UI5/6/20 | typed eight columns, stable type-label/asset-id keys, default-expanded children,14px shared indentation, rowTone section, no paging/actions/local sort | Source matched |
| summaryCards → SummaryCards | TrialBalance summaryCards; UI24 | money descriptor of server total, public slim/row/min140/max80,12px host separation, no private card markup | Source matched |
| queries/loadLookups → shared loader/errors | Workshop Job bindListQueries / CustomerStatement retry; UI22/28 | finalize every loading cycle, safe Result/HTTP message, visible retry, no duplicate error feedback or stale results | Source matched |
| DepreciationDetailService.getReport → AssetController.GetDepreciationDetailReport → AssetService.GenerateDepreciationDetailReport | BE5/6/17; UI20 required output evidence | exact four top-level query keys, Result envelope, complete filtered groups and server total,400 localized failures | Source matched |
| GenerateDepreciationDetail → Repository.QueryReport | BE17 | AsNoTracking/tenant-live fail-closed, nine scalar fields, deterministic type/name/id, no N+1/paging | Source matched; existing in-memory financial loop explicitly retained |
| exportToExcel → dataTableExportRows/onExportToExcel | CustomerStatement exporter; UI8 | original complete groups+assets+grand-total, same eight columns/formats/current language, no collapse/page truncation | Source matched |
| printSession → ReportPrintService/DataTable.printAllRows | UI21 | all descendants while printing, paginator=false/scrollable=false, print-flow bounds release, summary printed, form and expansion restored | Source matched; printer/browser pending |

Shared-extraction gate: reused existing ReportPage, ReportActions, DataTableHierarchy/tree actions, SummaryCards, StateMessage, FieldError, DatePicker, date-utils, money/export formatters, API errors and print session. No new generic presentation/helper capability qualified for extraction; query/envelope/group adapter are feature-specific. Existing legacy untyped AssetService.getDepreciationDietails and AssetDTO compatibility declarations were not edited because their shared files already contain unrelated owner changes; the reviewed screen no longer consumes either.

Override audit: no override added/changed for this report. Existing AssetController.GetListAsync is Asset CRUD navigation-list behavior, outside the report operation; not removed. No detail write or domain action, so Phases3/4 skipped. Phases0/1/2/5/6 applied; no PLAN00 financial-policy change pursued.

## Limits requiring a separate business decision

- Branch filtering has no supported ownership relation. The disabled field makes that limitation visible; a future real filter requires its business source.
- The legacy report returns one period label/amount per asset, not monthly detail rows. Date arithmetic uses month offsets: a start/end inside the same calendar month currently yields zero. The requested source refactor preserves that algorithm; **financial correctness and exact monthly/proration semantics are unresolved**, and this is not full screenshot-equivalent monthly behavior.
- Legacy ChassisNo is Asset.Detail; there is no dedicated chassis property on this entity. Historical mapping was retained.
- Group rounding occurs after raw group accumulation, while asset rows are rounded individually; a displayed group may differ slightly from the sum of displayed asset cents. No rounding-policy change introduced.

Do not treat this source-only status as full business/visual acceptance. Owner must choose the accounting source/month-boundary policy before a later calculation change, with a Frozen evolution plan if it changes financial behavior.

## Files changed by this task

Frontend repository `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- `src/app/modules/Assets/depreciationDetail/components/list/list.component.ts`, `.html`, `.spec.ts` (correct existing stale class import only); deleted obsolete `.scss`.
- `src/app/modules/Assets/depreciationDetail/models/list.ts`; new `services/depreciation-detail.service.ts`.
- `src/app/pages/routing.ts` only detail import casing; toolbar only detail title suppression; EN/AR only `assets.depreciationDetailReport` additions.

Backend repository `F:/My Work/Sigma/SigmaBackend`:

- `SiGma.Business/IServices/IAssetService.cs`, `Services/AssetsServices/AssetService.cs` only detail read sections.
- `SiGma.ServerAPI/Controller/AssetController.cs` only new detail-report action.
- `SiGma.Helpers/Dtos/DepreciationDetailGroup.cs`; new `DepreciationDetailItem.cs` and `DepreciationDetailReport.cs` (one named class per file).

Review artifacts are local/unversioned under `F:/My Work/Sigma/reviews`. Concurrent unrelated Asset/AssetType/Loan/FY/depreciation/summary changes and backend FY constructor/delegation edits were observed and preserved; do not include them in this task's staging or migration claim.

## Verification and handoff

Complete scoped diffs reviewed separately in both actual repositories, including new files read directly and concurrent unrelated hunks identified. Scoped git diff --check clean. TypeScript source syntax parser:8 changed files; Angular template syntax parser:one template; zero diagnostics (syntax only, no type/compile claim). Translation parity for assets:123 EN/123 AR keys, zero missing/case-only differences. No stale legacy table/import, any, UTC-date conversion, new post-ES2018 API, feature table CSS, merge marker or manual print call in the reviewed feature.

Owner verification pending: build/type/template checking in both repositories; exercise valid/reversed/partial dates, all/type/asset filters and empty result after success; declared/transport/lookup failures and retry; delayed Search/Refresh and navigation; collapsed groups/full Excel/full print; Arabic/light/dark/narrow/keyboard/one internal scrollbar; missing tenant/no cross-tenant reads; actual safe messages. Compare multi-month financial results and explicitly confirm the same-month zero/period-only limitations before financial acceptance.

No builds, tests, lint, database commands, browser/application verification, migrations, commits, pushes or deployments were run.

Agent utilization: one `backend_report` worker with inherited model implemented/audited the bounded six backend files after contract freeze. Root retained contracts/frontend/integration/final diff/report. Parallel frontend/backend ownership shortened execution without duplicating source discovery; externally concurrent FY edits were preserved.

Suggested commits (only this task's listed hunks; never committed):

- Frontend: `refactor(depreciation-detail): adopt shared report controls`
- Backend: `refactor(depreciation-detail): return authoritative report totals`
