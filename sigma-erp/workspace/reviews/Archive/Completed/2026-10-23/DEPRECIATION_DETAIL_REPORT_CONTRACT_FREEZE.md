# Depreciation Detail — report contract freeze

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-06 |

## Scope and authority

User: `راجع : src\app\modules\Assets\depreciationDetail وطبق التعديلات وفقا للوثائق`.
Review and implement confirmed guide defects in the existing report and its directly related read API. UI screen 07 / UI20,21,6; backend Pattern 5 / BE17. No asset write, schema, posting or depreciation-policy change.
Recipes checked: Phase01 current; PLAN00 and Phase00/02/03/04/05/06 stale. Canonical Master2–5,7 and applicable UI/BE blocks govern instead; regeneration and semantic review pending for documentation owner.

Existing user changes: Asset/AssetType screens/services/models, toolbar, layout module, routing, EN/AR and LoanEMI files are already modified. Preserve them; add only report-specific wiring/translations to shared changed files. Backend working tree initially clean.

## Evidence and decisions

Screenshots E7 `C:/Users/user/Desktop/Assets/7.PNG` and E8 `.../8.PNG`: English/LTR desktop report; role/date/version unknown.

| Evidence | Classification | Contract / implementation |
|---|---|---|
| E7 date range, Asset Type, Asset | Explicit | Typed current-month range + nullable owning GetSelect lookups; exact startDate/endDate/assetTypeId/assetId keys |
| E7 Branch | Explicit label; Missing source | Asset and CostCenter have no Branch relationship; detail endpoint accepts no branch. Show an empty disabled Branch field with translated unavailable explanation. Do not substitute CostCenter or invent filtering/schema |
| E7 asset, cost, residual, chassis, start, purchase, depreciation | Explicit | Actual DepreciationDetailItem contract, not AssetDTO; individual depreciation remains its own value |
| E7 month row | Explicit | Existing backend Month is a period label (one month or range), not a monthly ledger. Retain that label in a Month / period column; do not invent per-month values |
| E7 Motor Vehicle; E8 Attachment, Water Dispenser and subtotals | Explicit | Backend groups retained as typed shared hierarchy roots; each root displays its backend TotalDepreciation |
| E7 Export/Refresh; E8 Grand Total | Explicit | Complete filtered response Excel independent of expansion; backend-owned grand total |
| Print, Search, Reset, tree expand/collapse | Canonical reference | Supported read-only report actions via shared owners; no confirmations |

Reviewer decision (owner standing rule): unavailable Branch remains empty and disabled; rejected arbitrary branch joins and new persisted ownership. Month uses the source period label rather than a fabricated monthly breakdown. Legacy ChassisNo currently projects Asset.Detail: preserve this historical source alias and record that a dedicated chassis source is absent.

## Frozen API and data contract

Keep existing `GET Asset/detail` raw group-array API and its financial algorithm for compatibility. Add `GET Asset/detail-report` with identical four query keys, returning `Result<DepreciationDetailReport>`: `groups: DepreciationDetailGroup[]`, `totalDepreciation: decimal`. Server total is the sum of returned authoritative group totals, once per group, never once per asset. No paging/clamp/Skip/Take; complete filtered report. No frontend grand-total arithmetic. Implement report reads through QueryReport (tenant/live fail-closed) with deterministic group/asset order; preserve formula, rounding and eligibility.

Grid fields beside wire fields:
`label, cost, residualValue, chassisNo, depreciationStart, purchaseDate, month, depreciation`
↔ `AssetName, Cost, ResidualValue, ChassisNo, DepreciationStart, PurchaseDate, Month, Depreciation`.
Group roots use `AssetType`/`TotalDepreciation`, local stable identity and children only; no ListVM/CRUD/action-state fields. Dates use shared display helper; money columns use shared money formatter. Nulls blank/—, zero retained. Sorting disabled to retain report grouping/source order; no paginator.

| Control | Form type | Query key | Source / default |
|---|---|---|---|
| Date range | Date[] / string / null | startDate, endDate | parseDateRange, required real ordered dates; currentMonthRange |
| Asset Type | number / string / null | assetTypeId | AssetType/GetSelect; omitted when null |
| Asset | number / string / null | assetId | Asset/GetSelect; omitted when null |
| Branch | disabled null | none | unavailable; never sent |

Retain existing date semantics: range depreciation is month-offset difference; same-calendar-month range currently yields zero. No financial correction or proration introduced. The API returns an aggregate period label rather than a per-month collection. These are limitations requiring owner accounting specification if a later task changes them.

## Reference conformance evidence before edits

| Concern | Owning block | Actual reference | Shared owner | Target correction |
|---|---|---|---|---|
| Bounded report/title | UI1/3/20 | CustomerStatement template outer section/panel; TrialBalance AccountReportPage | ReportPage / FeatureTitle / global styles | Replace legacy card with route-fill print-flow report; title inside primary panel, suppress toolbar duplicate |
| Filters/actions | UI16/17/20/24 | CustomerStatement dateRange/customer actions; TrialBalance dateRange/branch config | DatePicker / shared date-utils / report strip / ReportActions / PrimaryActionButton | 34px stable strip, one dual-month range, owning selects, Search/Refresh/Reset/Print/Excel |
| Grid/groups | UI6/20 | TrialBalance config sections/hierarchy | DataTableHierarchy / DataTable rowTone | typed complete groups, default-expanded roots, shared row viewport and tree actions |
| Summary | UI24 | TrialBalance config summaryCards | SummaryCards / formatMoney | descriptor of server grand total; no local total-card styling |
| Error/async | UI22/28 | CustomerStatement load/retry; Workshop Job bindListQueries | StateMessage / apiErrorMessage / global LoadingService | inline skip-interceptor errors, both channels, finalize, one switchMap stream, form frozen in flight |
| Outputs | UI8/21 | CustomerStatement exportToExcel; ReportPrintService.createSession | dataTableExportRows / onExportToExcel / print session | all original groups/assets/current translations, printAllRows independent of collapse |

Route remains `/depreciationDetail` with existing lazy route export. New thin report service providedIn root uses environment.baseUrl and the AppModule client; no feature HttpClient provider. AuthGuard/API authorization unchanged. Read-only access candidates: detail report/Excel/Print, no invented permission mechanism.

## Handoff

Frozen implementation: frontend shared report conversion plus minimal backend read envelope; backend-owned existing calculations retained. Phases0/1/2/5/6 apply;3/4 not applicable. AutoMapper not needed (explicit read projections). No entity/EF/migration. No new generic override. Final source diff, translations and cross-layer comparison required; build/tests/lint/browser/database/commit/push/deployment prohibited by root instructions.

## Implementation clarification — 2026-10-06

No change to the frozen financial/date contract. The existing AssetService/IAssetService/AssetController remain the owners of this report for compatibility, rather than creating a parallel backend report service. BE17's dedicated-service shape is a justified scoped deviation; the existing calculation loop/group rounding stays in memory to avoid silently changing financial policy. QueryReport is the shared read owner (`SiGma.Repos/Repository/Repository.cs:59`), with fail-closed tenant/live predicates and AsNoTracking. The query now projects only Id, Name, AssetTypeName, TotalCost, ResidualValue, Detail, PurchaseDate, DepreciationStartDate and AssetLifeYears; no whole entity graph or N+1. BE5 BusinessFailure<T> and BE6 ToActionResult own localized 400 Result failures (InvalidDateRange/InvalidId), with nullable dates detecting omitted inputs.

Delegation gate met after freeze: one isolated backend worker while root implemented the frontend. Subsequent external FY/depreciation/summary work appeared in shared files; those non-detail changes were preserved. They are outside this contract and its commit suggestions.
