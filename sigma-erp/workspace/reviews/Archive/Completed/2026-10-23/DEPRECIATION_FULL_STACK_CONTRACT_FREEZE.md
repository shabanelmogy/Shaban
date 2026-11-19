| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Depreciation contract — 2026-10-06

Request: review Assets/depreciation and implement guide conformance. Screenshot 5.PNG explicitly shows Month, disposed checkbox, Prepare, Excel, five grouped columns, Sum and Save. Owner explicitly requires saved depreciation plus accounting journal and delegates suitable source-supported decisions ("شوف المناسب وفقا للمعطيات"). Screenshot styling is not authoritative.

## Manifest and maintenance decision

Frontend route /depreciation remains one routed report with a confirmed posting action, UI20/21/6 plus UI7/24 confirmation. Backend reads follow BE17, posting BE15. Existing Asset/DepreciationReport array endpoint stays compatible for other consumers. A dedicated Depreciation service/controller owns prepared read and batch posting; do not duplicate generic Asset CRUD. Existing DepreciationEntry owns persisted monthly values; add nullable JournalVoucherId ownership link. Reuse AssetType persisted expense/accumulated accounts (Asset account properties are NotMapped), existing DepreciationJV subtype, journal number/period/precision engine and tenant write lock.

Impact/classification: Keep asset entity, asset type account mapping, other asset reports and legacy read API; Extend DepreciationEntry link/index/precision; Create dedicated batch API; Replace scoped legacy table/form; Refactor current report lifecycle; Remove scoped obsolete SCSS. No alternative parallel owner exists: generic DepreciationEntry CRUD has no batch or journal logic. This is the frozen narrow maintenance decision for this implementation, not a new asset lifecycle system.

## Frozen handoff

GET /Depreciation/prepare?month=yyyy-MM-01&rerunDisposed=false returns Result<DepreciationPreparedReport>. Report: month:string, rows:DepreciationRow[], totalDepreciation:number, preparationToken:string, canSave:boolean. Each row retains displayed assetId, assetName, formula, life, cost, residual, purchaseDate, chassisNo, depreciationStart, bookValueFy, bookValuePrev, prevDepreciation, currentDepreciation; adds isSaved:boolean, supported:boolean. Remove unused typeName/friendly formatted strings from new shape. Backend returns total for complete rows; no paging. Existing saved rows show their stored snapshot, and save posts only positive unsaved supported rows. Report cannot save when any unsaved positive row has unsupported method. Empty/zero batches cannot post.

POST /Depreciation/save: { month:string (yyyy-MM-01), rerunDisposed:boolean, preparationToken:string }. No client totals, row amounts, tenant or account IDs. Returns Result<DepreciationPreparedReport> with refreshed report in the same operation; interceptor owns one success toast. Recompute facts inside tenant ExecuteUniqueWriteAsync<DepreciationEntry>, compare deterministic preparationToken and reject stale snapshot. Duplicate asset/month never gets another journal; concurrent saves serialize and second stale/duplicate request fails. No automatic retry, reversal or overwrite.

Calculations: only StraightLine is supported for posting because source has no declining-balance implementation or production quantities. Full first month; lifeYears*12 months; depreciable base=max(cost-residual-openingDepreciation,0). Cumulative rounded scheduled amounts give prior/current snapshots; cap residual, include opening depreciation in previous accumulated total. Last month takes rounding remainder. No VAT. Current period is normalized month start and journal date last day of month. Zero/negative life or invalid source values block posting rather than divide by zero. Unsupported rows remain visible with translated indication and no false straight-line posting.

Journal: one generated posted JournalVoucher/DepreciationJV batch, branch null because Asset has no branch; expense debit and accumulated credit per positive row; preserve Asset CostCenter on both lines and resolver defaults/validation. All account ownership/active-leaf checks, open fiscal year/month, precision checks through existing shared engine. Transaction encloses all saves/link updates; failures roll everything back. Stored entry has nullable journal FK, unique live (SubscriptionId,AssetId,Period), money precision matched project policy. Existing entries without journal link remain legacy snapshots; do not invent historical journals. Generic entry CRUD cannot mutate generated posted source snapshots or accept client-derived batch writes.

Disposed checkbox: current source means including assets whose life has elapsed, not real disposal (Asset has no disposal state/date). Preserve compatible inclusion, explicitly explain limitation in UI/report; never label it as proven disposal selection.

## Grid/filter/integration contract

Five columns in order: assetName (assetId/name, cost/residual/purchaseDate/chassisNo); formula (method/life); bookValueFy (FY/current and previous book values); prevDepreciation (depreciationStart DATE, accumulated previous amount); currentDepreciation (money and saved state). No row actions. New row DTO list above is report shape, not CRUD ListVM. Complete unpaged array, lazy=false, paginator=false, fill=true; Excel includes all detail subfields rather than only template's primary field. Sum uses response, no frontend financial derivation.

Month FormControl<Date|string|null>, currentMonthRange()[0], appDatePicker dateInputMask view=month mm/yy, parseMonthValue then '-01'; required real month. Rerun FormControl<boolean> false; query sends false explicitly. Prepare is explicit, no initial request. Filters invalidate rows/token/sum; form disabled during requests and posting confirmation. Save only from valid prepared snapshot and shared confirmation; Prepare/Reset available for recovery. Error-inline requests suppress interceptor error; all Result/HTTP failure paths restore state. Standard save returns refreshed snapshot, so no composite toast duplication.

Authentication: root AuthGuard and interceptor HttpClient; controller Authorize, QueryReport tenant/live scope. Posting is authorization candidate; no invented role API. Migration owner runs suggested Add-Migration LinkDepreciationEntriesToJournalVouchers after checking duplicate live asset/month rows and decimal values; no migrations/model snapshots edited here.

## Reference conformance before edits

| Concern | Book | Actual reference / shared owner | Target |
|---|---|---|---|
| Report fill/title/filter | UI1/3/20 | Accounts/TrailBalance config → Accounts/shared/report-family + ReportPage/FeatureTitle/global sigma-report-* | Same shared owners and fill chain; bespoke financial save action only |
| Grid | UI5/6 | TrialBalance sections → shared DataTable columns/fill | Five typed columns, custom multiline templates, complete rows |
| Dates/validation | UI17/19 | date-utils parseMonthValue/currentMonthRange, DatePickerDirective, FieldError | No UTC/native date parser |
| Excel/print | UI8/21 | CustomerStatement export + dataTableExportRows + ReportPrintService | Full detail columns/current-language headers, full print |
| Busy/error | UI22/28 | shared LoadingService/finalize, apiErrorMessage | Inline errors/teardown, disabled stable snapshot |
| Totals/buttons | UI24 | SummaryCards and PrimaryActionButton | Public slim row cards/fixed shared footer |
| Posting | BE15 | MiscellaneousInvoiceService.AddAsync, JournalVoucherResolver.SaveAndPostJVAsync | Same atomic multi-save boundary, shared validation/numbering |
| Read scope | BE17 | Repository.QueryReport<T> | Tenant/live/no tracking, deterministic complete array |

Applicable phases 0,1,2,4,5,6; phase3 generic editor/upload not applicable. Recipe -Check reports stale 00/02/03/04/05/06/PLAN; use canonical books, do not edit generated packets. Existing frontend changes in Asset/AssetType/toolbar/LoanEMI/vocabularies are preserved. Backend starts clean. No build/test/lint/browser/DB/commit/push authorized.

## Integration clarification — 2026-10-06

`supported` means calculation inputs/method are valid and the asset type has both posting account IDs. Valid straight-line previews are calculated even if account mapping is missing; account readiness never substitutes zero for calculated depreciation. Any unsaved invalid/unsupported row blocks the batch so it cannot be silently skipped; saved legacy snapshots are retained and do not block other rows because of subsequently changed mappings. This makes the frozen invalid-source blocking rule explicit without changing the response shape. Exact active/leaf/tenant/account and period eligibility remain authoritative in the shared posting resolver. Read DTOs live in Helpers/Dtos; only the editable save request lives in ViewModels.
