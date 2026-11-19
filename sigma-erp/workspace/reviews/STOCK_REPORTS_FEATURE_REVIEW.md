| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Stock reports review manifest

Scope and request: review and apply guide-backed changes to StockSummary, DetailedStockReport, PurchaseOrdersDetailReport, PurchaseDetailsReport, ItemIssueReport, ItemsReturnReport, GrnPendingReport, PartsMovingReport. UI shape 07 Report; backend Pattern 5 (BE17). Approved composite: shared report-page/actions, StatementOfAccount report semantics, TrailBalance report strip/title spacing, shared DataTable/SummaryCards. No CRUD/editor/action-state workflow exists. AuthGuard at application layout and Authorize on StockReportsController; no permission API. All eight GET routes are retained. Evidence: Desktop/Stock/Reports/1.PNG–8.PNG, English LTR desktop report state; capture date, role and version Unknown.

Unrelated changes: both actual Git repositories contain extensive owner edits to Stock, Workshop, Sales, shared UI and vocabulary. StockReports folder starts clean. Preserve every unrelated change and preexisting migrations/snapshot. Review artifacts are local/unversioned under reviews. Recipe drift found before packet use; use canonical Master2–5/7, UI1/3/5/6/8/16/17/20–29 and BE17/19; generated packets need owner regeneration.

## Functional evidence

| Evidence | Classification | Requirement | Phase / representation |
|---|---|---|---|
| S1: 1.PNG | Explicit | Summary item/type/hide-zero filters; code/name/supplier code/price/minimum/max/branch/group/quantity/cost/value; total; Excel/Print/Refresh | 1/2: typed metadata, shared filters/grid/summary/actions; minimum null without source |
| S2: 2.PNG | Explicit | Date/item/type/hide-zero; beginning/in/out/net/ending/cost/value/minimum/max/branch/type and totals | 1/2: shared current-month range, backend quantities and totals |
| S3: 3.PNG | Explicit | PO date/supplier filter; item/code/PO/supplier code/UOM/supplier/quantity/price/amount/total | 1/2: persisted PO No and UOM Name |
| S4: 4.PNG | Explicit | Purchase date/item/supplier filters and received item lines with voucher/UOM/quantity/price/amount/total | 1/2: add confirmed itemId predicate, preserve GRN source |
| S5: 5.PNG | Explicit | Issue date/job; item/code/supplier code/description/issue/quantity/price/amount/user; output actions | 1/2: one stock line per row, deterministic matching job/item price |
| S6: 6.PNG | Explicit | Return date/job; linked issue identifier, quantities, prices, amounts and total | 1/2: no stored issue FK; existing same-job/item fallback remains documented |
| S7: 7.PNG | Explicit | Pending PO/date/supplier grouping, item/code/description/pending quantity; date/LPO filters | 1/2: typed complete report retains PO context in shared columns, description; exact source-backed receipt proxy frozen before implementation |
| S8: 8.PNG | Explicit | Item/name/code/supplier code and time-window movement quantities, including zero-movement items | 1/2: master Items outer join, backend measures |
| All | Strong inference | Search/Refresh apply valid filters; full output matches applied results | 2: guide explicitly requires complete-response proof and output lifetime |
| Screenshot numeric values/formulas | Uncertain | Captured numbers do not define valuation, historic cost, issue price or receipt linkage | Do not copy values, repeated header amounts or invent transactions |

## Before-edit reference conformance

| Concern | Book | Actual reference / owner | Current finding / target |
|---|---|---|---|
| Route/panel/title | UI1/3/20 | Statement list HTML; ReportPage + global sigma-report-panel + FeatureTitle | Bare report sections lack title/container-fill; adopt bounded shell and direct title |
| Filters/actions | UI17/20/22 | Statement list search/form disable; TrailBalance global strip; DatePicker/FieldError/ReportActions | Null date + toISOString + untyped form; shared current-month validate/serialize, top-aligned strip and reserved feedback |
| Grid/paging | UI5/6 | DataTable inputs/format; list-query DEFAULT_PAGE_SIZE=15/resolveListPaging | Legacy ListCol/table-list and first-page arrays; complete flag/count checked before local pager |
| Totals | UI20/24, BE17 | SummaryCards public descriptor/density/layout/min/max inputs | No authoritative total response; backend filtered totals, no UI summing |
| Errors/options | UI16/22/28 | getSelectList skipErrorInterceptor; apiErrorMessage; Subject/switchMap/defer | any, missing callbacks and leaked lookup loader; typed local recovery, cancellation and finalize |
| Print/export | UI8/21 | ReportPrintService.createSession; dataTableExportRows | Print missing; untranslated partial export; full rows/current-language headers with restored paging |

## Findings and integration

Initial confirmed findings: first-page truncation, no totalCount, no normalized report paging, stale output after filter edits, missing Print, missing report title, UTC date shift, wrong enum ID order from legacy ItemTypeEnum, untyped contracts/options, absent failure handling, auxiliary global loaders, issue/return Cartesian multiplication by unrelated job items, PO ID shown instead of No, UOM.ToString instead of Name, missing item filter/metadata/nonmoving items. Detailed valuation denominator uses changing beginning quantity instead of opening quantity; opening-cost policy itself requires no new accounting policy. Known UI backlog 22/32/35/39 and BE19 count/read issues overlap these scoped defects.

## Final reconciliation — 2026-10-04

Phases applied: PLAN-00 existing-state/impact classification and alternatives; 0 screenshot/source evidence; 1 shared freeze; 2 read/grid/API implementation; 5 transport/router/interceptor integration; 6 scoped source comparison. Phases 3/4 skipped: these reports have no editor, write payload or domain transition. No migration, snapshot, entity, EF configuration, posting/backfill, authentication or authorization change. Add-Migration is not required.

### Producer/consumer comparisons

| Concern | Actual source compared | Final source result |
|---|---|---|
| Complete transport/count | All eight getReport readers use toFilterParams({…filters,completeReport:true}); StockReportsService.Page and StockReportResults; StockReportPage.bindRequests | Matching explicit IsComplete + TotalCount==Entities.length proof; incomplete/failure responses cannot enable output. API keeps default paged requests, size1..100, positive page, stable row tie-breakers, safe offset and accurate metadata. SQL totals/count precede Skip/Take. |
| Backend totals | Eight service projections/SumAsync before Page; config.totals + summaryCards/exportToExcel | Complete filtered scope. Detailed only sums quantities and stockValue, never rates. Null prices excluded from amount sum, with visible/exported caveat. No browser re-sum. |
| Forms/filter ancestry | StockReportPage.ngOnInit typed optional controls; one shared form containing all @if/@for fields; search | Only configured controls exist. Six ranges required and ordered; currentMonthRange reset; parseDateRange serializes local dates. Every lookup passes actual select Id. Enum0 and false survive toFilterParams. |
| Filter lifetime | bindRequests switchMap/defer/finalize + form.disable/enable; valueChanges null cancellation + clearOutput; reset | Edits invalidate rows/totals, Reset clears not-run/error/offset and restores dates, Search/Refresh retain selected page size. HTTP readers support subscription cancellation. No automatic report request. |
| Paging/format | DataTablePaginationEvent.pageSize; resolveListPaging rows; all eight typed config.columns; mapRows | Seven reports use local default15, controlled first/rows and complete arrays. Pending has one outer frame and paginator=false section grids. Money/date/number formatting uses shared renderer; persisted ItemType numeric order replaces old metronic enum. |
| Titles/bounds | shared template ReportPage/ReportPanel/FeatureTitle; toolbar isStockReport | One in-panel title on all8. Filter strip uses existing align-items-start and date FieldError reserved feedback. Filling grid is the sole row scroller; grouped pending uses one outer frame. No feature filter palette, page-height calc or native table. |
| Summary placement | summaryCards typed descriptors, compact/row/min140/max80; host margin-block-end12 | Uses shared public SummaryCards inputs, no duplicate card markup/geometry/theme. |
| Busy/failure/options | reactive form API + loading/printing signals; apiErrorMessage; getSelectList skipErrorInterceptor and local finalize/retry | Both isSuccess:false and transport failure handled; report and lookup errors own inline feedback. Filters/output blocked while request/print active. Not-run, empty and error states remain distinct. |
| Full output | printSession.createSession, shared template !printing paginator/scrollable, dataTableExportRows(data,columns,instant) | Full validated array prints after render preparation, page/size retained. Excel current-language headers/types/values includes returned totals and issue/return caveat; no first-page/raw JSON export. Shared print lifecycle unchanged. |
| Tenant/live source | Repository.QueryReport root filter; explicit document-parent and optional reference projections | Parent scope is enforced at source; missing optional metadata stays blank. One stock detail row regardless of job-line count. Pending orders with no GRN retained. |
| Runtime wiring | pages/routing.ts eight lazy route paths, local route exports, existing AuthGuard/root HttpClient; controller Authorize/ProducesResponseType; services env baseUrl | Producer/consumer response subtype agrees and endpoints retained. Unique component selectors, no new client/provider/permission API. Menu-freeze artifacts untouched. |
| Translations | canonical Check-Translations.ps1 -Block stockReportViews and consumed keys | 71 en/71 ar leaf keys, zero missing or case-only differences. Legacy root stockReports string preserved; types and Excel resolve at display/click time. |

### Decisions taken and source limits

The contract freeze contains the exact filters, column order and formula decisions; its implementation amendment records the authoritative opening dates, absent-date compatibility and legacy translation-key collision. Screenshot fields and workflows were retained through guide-owned components; numeric capture values and styling were not treated as formula/design authority.

Keep: routes, read-only authorization boundary, existing result fields and optional paged callers, quantity source tables and opening costing basis. Extend: complete-report opt-in/totals/stable IDs, missing item/branch/type/max metadata, pending PO/item grouping and nonmoving items. Refactor: repeated FE lifecycle, filters/date handling/errors/formatting/export/print and backend read queries. Remove: runtime legacy table/ListCol/BaseService/manual XLSX paths. Create: only report-family transport/composition, translated labels and local review artifacts. Replace no writer/domain model.

Reviewer decisions under the owner standing rule: Item.Type supplies Item Group because no group entity exists; MinimumStockValue has no source and is null. Opening value/qty remains the historic-cost proxy; no weighted average/FIFO introduced. Issue/return UnitPrice uses latest scoped JobItem by matching Job+Item, Amount=price*stock quantity, unpriced rows remain null. Description has no stored stock-line source and stays blank. Returns' ItemsIssue is the existing earliest same-job/item inference, not a historical FK. Pending receipts use PO.No + Supplier + Item because no receipt-to-order FK exists; duplicate numbers/incorrect text can misattribute receipts and require owner data inspection. Duplicate same-item PO details aggregate once, earliest description. Moving measures gross issues, includes never-issued items and uses UTC rolling7d/1/3/6/12-month windows through captured now, not current on-hand or net returns. No calculation is accepted from the client.

AutoMapper: none required; explicit report DTO projections, no new ReverseMap/Ignore. DTOs preserve old compatibility members; grid keys exactly match the projected fields and minimum identity, as listed below. No Add/Update/Detail/ListVM contract applies.

### Changed file groups

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`. All eight stockReports modules changed their component.ts, models/*.ts and service/*.ts; their old component.html/.scss files are retained as inert compatibility markers (40 files). New shared files: stock-report-contract.ts, stock-report-page.ts/.html/.scss (4). Direct integration edits: i18n/vocabs/en.ts, ar.ts and toolbar.component.ts (3). Root edits only add the new translation block and stock-report title suppression to already-dirty shared files; owner changes are preserved. Routes/menu/providers/tsconfig unchanged.

Backend repository: `F:/My Work/Sigma/SigmaBackend`. Changed StockReportsService.cs, IStockReportsService.cs, StockReportsController.cs; eight *ResultDto.cs in Helpers/Reports/StockReports; new StockReportResults.cs; two GeneralMessage resources (14 files). Root reconciled parent scopes, dates, ordering and optional references. No generated/entity/EF/migration files changed by this task.

Documentation: canonical UI20 report-family composition/evidence note, UI preamble1.73, CHANGELOG1.73, required skill §6.1 + revision row. Generated packets were already stale and were not edited/regenerated; owner regeneration plus semantic review remains pending. Three local review/plan/freeze artifacts under reviews.

### Source verification and owner acceptance

Scoped diffs reviewed separately in both actual repositories, including new files; report route/selector/API/model/translation links reconciled. Diff whitespace check clean; scoped merge-marker/legacy/any/environment.prod/toISOString searches clean. Canonical translation parity check passed. No builds, tests, lint, browser, database commands, migrations, commits, pushes, deployment, Graphify or Sigma MCP used.

Owner verification remains required: Angular/.NET compilation; actual EF10 SQL Server translation of correlated quantities/prices and especially grouped pending receipts; API old paged requests plus complete-report requests with >100 matching rows; count/totals/order consistency under concurrent writes; six malformed/partial/reversed date paths and no-date API compatibility; posted/void/deleted/other-tenant parent cases; two same-item PO lines, no receipts, partial/full receipts and inaccurate textual links; multiple unrelated/matching job items; zero/missing/negative stock and unpriced rows; local size-only page change on page1; full print/Excel after moving to a later page; failed request/lookup retry and rapid filter edits; Arabic/English/RTL, light/dark, narrow layouts and fixed title/filter/pager with one row scroller. Shared print requires its existing browser afterprint lifecycle; cancellation/failure restoration should be included in manual acceptance. Runtime/visual checks were not authorized/performed.

Unresolved business/source limitations are disclosed above, not fabricated: absent minimum stock value, historical prices/valuation, return-to-issue link and textual pending receipts. No known unapproved in-scope source mismatch is intentionally deferred. Build/SQL/visual acceptance stays pending; status is source-only, not Closed.

Suggested commits (do not execute): FE `refactor(stock-reports): use shared complete report views`; BE `fix(stock-reports): return complete rows and filtered totals`.

### Agent utilization

Root owned authority/evidence/contract freeze, shared FE composition/translations/title integration, documentation and final integration. Luna explorer gpt-5.6-luna (`backend_discovery`) performed bounded read-only report/domain discovery and shared FE source audit; no edits. Sol worker gpt-5.6-sol (`backend_reports`) owned report backend service/interface/controller/DTO/resource files, then corrected root-reported parent/date/order issues. Sol worker gpt-5.6-sol (`frontend_consumers`, routine terra unavailable) owned eight FE consumers/models/services and retired runtime legacy templates. Delegation followed frozen handoff with disjoint file ownership, reduced wall time for8 independent consumers versus backend projections, and avoided duplicate domain discovery. Root caught and corrected pagination adapter, translation collision, selector/formatting and backend optional/reference scope issues; worker reports did not substitute for root reconciliation.

### Exact final columns beside response properties

| Consumer module | Ordered grid fields | Backend response DTO / properties | Match |
|---|---|---|---|
| DetailedStockReport | itemCode, itemName, supplierItemCode, beginningQuantity, inQuantity, outQuantity, netQuantity, endingQuantity, unitCost, stockValue, minimumStockValue, maximumQuantity, branchName, itemType | DetailedStockReportResultDto : ItemId, ItemCode, ItemName, SupplierItemCode, BeginningQuantity, InQuantity, OutQuantity, NetQuantity, EndingQuantity, UnitCost, StockValue, ItemType, MinimumStockValue, MaximumQuantity, BranchName | Matched |
| GetGrnPendingReport | date, itemCode, itemName, supplierItemCode, lpoNo, supplierName, description, quantityOrdered, quantityReceived, pendingQuantity | GrnPendingReportResultDto : RowId, Date, SupplierId, SupplierName, PurchaseOrderId, LpoNo, ItemId, ItemCode, ItemName, SupplierItemCode, Description, QuantityOrdered, QuantityReceived, PendingQuantity | Matched |
| GetPartsMovingReport | rowNo, itemId, itemName, itemCode, supplierItemCode, asOfNow, byThisWeek, byThisMonth, byThreeMonth, bySixMonth, byOneYear | PartsMovingReportResultDto : ItemId, ItemName, ItemCode, SupplierItemCode, AsOfNow, ByThisWeek, ByThisMonth, ByThreeMonth, BySixMonth, ByOneYear | Matched; rowNo UI index |
| itemsIssueReport | date, jobId, jobNo, itemName, itemCode, supplierItemCode, description, issueNo, quantity, unitPrice, amount, user | ItemsIssueReportResultDto : RowId, Date, JobId, JobNo, ItemId, ItemName, ItemCode, SupplierItemCode, Description, IssueNo, Quantity, UnitPrice, Amount, User | Matched |
| itemsReturnReport | date, jobNo, itemName, itemCode, supplierItemCode, description, itemsIssue, quantity, unitPrice, amount | ItemReturnsReportResultDto : RowId, Date, JobId, JobNo, ItemId, ItemName, ItemCode, SupplierItemCode, Description, ItemsIssue, Quantity, UnitPrice, Amount, User | Matched |
| purchaseDetailsReport | date, itemName, itemCode, supplierItemCode, voucherNo, supplierName, uom, quantity, unitPrice, amount | PurchasesDetailReportResultDto : RowId, Date, ItemId, ItemName, ItemCode, SupplierItemCode, VoucherNo, UOM, SupplierId, SupplierName, Quantity, UnitPrice, Amount | Matched |
| purchaseOrdersDetailReport | date, itemName, itemCode, poNo, supplierItemCode, uom, supplierName, quantity, unitPrice, amount | PurchaseOrdersDetailResultDto : RowId, Date, ItemId, ItemName, ItemCode, SupplierItemCode, PONo, UOM, SupplierId, SupplierName, Quantity, UnitPrice, Amount | Matched |
| StockSummary | itemCode, itemName, supplierItemCode, unitPrice, minimumStockValue, maximumQuantity, branchName, itemType, quantity, unitCost, stockValue | StockSummaryResultDto : ItemId, ItemCode, ItemName, SupplierItemCode, UnitPrice, Quantity, UnitCost, StockValue, ItemType, MinimumStockValue, MaximumQuantity, BranchName | Matched |

### Exact application file inventory

Paths below are relative to their actual repository roots given above. Shared files include preexisting owner edits; only Stock Reports additions belong to this task.

Frontend:

- src/app/_metronic/layout/components/toolbar/toolbar.component.ts
- src/app/modules/i18n/vocabs/ar.ts
- src/app/modules/i18n/vocabs/en.ts
- src/app/modules/stockReports/DetailedStockReport/component/detailed-stock-report/detailed-stock-report.component.html
- src/app/modules/stockReports/DetailedStockReport/component/detailed-stock-report/detailed-stock-report.component.scss
- src/app/modules/stockReports/DetailedStockReport/component/detailed-stock-report/detailed-stock-report.component.ts
- src/app/modules/stockReports/DetailedStockReport/models/DetailedStockReport.ts
- src/app/modules/stockReports/DetailedStockReport/service/DetailedStockReport.service.ts
- src/app/modules/stockReports/GetGrnPendingReport/component/get-grn-pending-report/get-grn-pending-report.component.html
- src/app/modules/stockReports/GetGrnPendingReport/component/get-grn-pending-report/get-grn-pending-report.component.scss
- src/app/modules/stockReports/GetGrnPendingReport/component/get-grn-pending-report/get-grn-pending-report.component.ts
- src/app/modules/stockReports/GetGrnPendingReport/models/GetGrnPendingReport.ts
- src/app/modules/stockReports/GetGrnPendingReport/service/GetGrnPendingReport.service.ts
- src/app/modules/stockReports/GetPartsMovingReport/component/get-parts-moving-report/get-parts-moving-report.component.html
- src/app/modules/stockReports/GetPartsMovingReport/component/get-parts-moving-report/get-parts-moving-report.component.scss
- src/app/modules/stockReports/GetPartsMovingReport/component/get-parts-moving-report/get-parts-moving-report.component.ts
- src/app/modules/stockReports/GetPartsMovingReport/models/GetPartsMovingReport.ts
- src/app/modules/stockReports/GetPartsMovingReport/service/GetPartsMovingReport.service.ts
- src/app/modules/stockReports/itemsIssueReport/component/items-issue-report/items-issue-report.component.html
- src/app/modules/stockReports/itemsIssueReport/component/items-issue-report/items-issue-report.component.scss
- src/app/modules/stockReports/itemsIssueReport/component/items-issue-report/items-issue-report.component.ts
- src/app/modules/stockReports/itemsIssueReport/models/ItemsIssueReport.ts
- src/app/modules/stockReports/itemsIssueReport/service/items-issue-report.service.ts
- src/app/modules/stockReports/itemsReturnReport/component/items-return-report/items-return-report.component.html
- src/app/modules/stockReports/itemsReturnReport/component/items-return-report/items-return-report.component.scss
- src/app/modules/stockReports/itemsReturnReport/component/items-return-report/items-return-report.component.ts
- src/app/modules/stockReports/itemsReturnReport/models/itemsReturnReport.ts
- src/app/modules/stockReports/itemsReturnReport/service/itemsReturnReport.service.ts
- src/app/modules/stockReports/purchaseDetailsReport/component/purchase-details-report/purchase-details-report.component.html
- src/app/modules/stockReports/purchaseDetailsReport/component/purchase-details-report/purchase-details-report.component.scss
- src/app/modules/stockReports/purchaseDetailsReport/component/purchase-details-report/purchase-details-report.component.ts
- src/app/modules/stockReports/purchaseDetailsReport/models/PurchaseDetailsReport.ts
- src/app/modules/stockReports/purchaseDetailsReport/service/purchase-details-report.service.ts
- src/app/modules/stockReports/purchaseOrdersDetailReport/component/purchase-orders-detail-report/purchase-orders-detail-report.component.html
- src/app/modules/stockReports/purchaseOrdersDetailReport/component/purchase-orders-detail-report/purchase-orders-detail-report.component.scss
- src/app/modules/stockReports/purchaseOrdersDetailReport/component/purchase-orders-detail-report/purchase-orders-detail-report.component.ts
- src/app/modules/stockReports/purchaseOrdersDetailReport/models/PurchaseOrdersDetailReport.ts
- src/app/modules/stockReports/purchaseOrdersDetailReport/service/purchase-orders-detail-report.service.ts
- src/app/modules/stockReports/shared/stock-report-contract.ts
- src/app/modules/stockReports/shared/stock-report-page.html
- src/app/modules/stockReports/shared/stock-report-page.scss
- src/app/modules/stockReports/shared/stock-report-page.ts
- src/app/modules/stockReports/StockSummary/component/stock-summary/stock-summary.component.html
- src/app/modules/stockReports/StockSummary/component/stock-summary/stock-summary.component.scss
- src/app/modules/stockReports/StockSummary/component/stock-summary/stock-summary.component.ts
- src/app/modules/stockReports/StockSummary/models/StockSummary.ts
- src/app/modules/stockReports/StockSummary/service/StockSummary.service.ts

Backend:

- SiGma.Business/IServices/IStockReportsService.cs
- SiGma.Business/Services/StocksServices/StockReportsService.cs
- SiGma.Helpers/Localization/Shared/GeneralMessage.ar-SA.resx
- SiGma.Helpers/Localization/Shared/GeneralMessage.resx
- SiGma.Helpers/Reports/StockReports/DetailedStockReportResultDto.cs
- SiGma.Helpers/Reports/StockReports/GrnPendingReportResultDto.cs
- SiGma.Helpers/Reports/StockReports/ItemReturnsReportResultDto.cs
- SiGma.Helpers/Reports/StockReports/ItemsIssueReportResultDto.cs
- SiGma.Helpers/Reports/StockReports/PartsMovingReportResultDto.cs
- SiGma.Helpers/Reports/StockReports/PurchaseOrdersDetailResultDto.cs
- SiGma.Helpers/Reports/StockReports/PurchasesDetailReportResultDto.cs
- SiGma.Helpers/Reports/StockReports/StockReportResults.cs
- SiGma.Helpers/Reports/StockReports/StockSummaryResultDto.cs
- SiGma.ServerAPI/Controller/StockReportsController.cs

## Filter presentation follow-up — 2026-10-05

Authority: the owner requests readjusting filter formatting, then identifies the exact middle region to remove as `Select filters and press Search to run report`. This narrows removal to the initial instruction message. Status: Implemented — source-only after the reconciliation below; owner visual verification remains pending. Existing frozen API, calculation, report columns, output and total contracts remain in force.

### Before-edit reference evidence

| Concern | Owning block | Actual reference / shared owner | Target and authority |
|---|---|---|---|
| Field/action placement | UI4/20; Master5 | Accounts/TrailBalance/components/list/list.component.html form and global styles.scss `.sigma-report-filter-panel`, `.sigma-report-filter-field`, `.sigma-report-filter-actions` | Keep the report strip. Owner-requested formatting groups equal-flex fields in a full-width wrapping row and puts actions in a separate full-width row, using existing Bootstrap layout utilities. No feature filter CSS or list FilterPanel mixture. |
| Control alignment | UI17/19/20 | DatePickerDirective, FieldErrorComponent reserveMessage, styles.scss report field/check selectors | Keep 34px shared controls, top alignment and reserved date feedback. Bound widget hosts using existing d-block/w-100 utilities. Move the checkbox row class to a div so the stronger direct-field-label display rule cannot turn it into a block label. Keep an explicit label for the checkbox input. |
| Initial state | UI20/22; owner's precise removal instruction | StockReportPage shared template `@else if (!hasSearched())`; DataTable `[showEmpty]` gate | Remove only the instruction region. Preserve initial structural grid headers and showEmpty=false before Search, and keep error/retry and post-search empty states distinct. This supersedes the earlier visible not-run-message decision. |
| Print/results | UI20/21/24 | StockReportPage search/print/export and shared no-print form | Template placement only: full responses, totals, valuation caveat, reactive busy/print locking, paging and output contracts remain unchanged. |

Generated recipe packets remain stale according to the read-only check in this follow-up; canonical sources govern. Regeneration and semantic review remain pending for the owner. No build, test, lint, browser, database, migration or commit is authorized by this formatting request.

### Follow-up reconciliation

- Application file changed: `SiGmaAngularFrontEnd/src/app/modules/stockReports/shared/stock-report-page.html`. All eight component `templateUrl` values point to this exact template. Review artifacts amended: this file and `STOCK_REPORTS_DOMAIN_API_CONTRACT_FREEZE.md`; no application SCSS, TypeScript, service, DTO, controller or calculation change in this follow-up.
- Matched source: the fields' parent is `d-flex flex-wrap align-items-start gap-2 w-100`; each field keeps the shared equal `flex:1 1 170px` and `mw-100` bound. Shared report fields become full-width at <=640px, and the unchanged action group becomes a two-column grid there. Widget hosts now use d-block/w-100. The action toolbar is a sibling full-width row with shared logical-end justification, keeping the actual submit and four secondary handlers/busy gates intact.
- Matched source: the hide-zero row is now a `div.sigma-report-filter-check.w-100`, so `.sigma-report-filter-field > label` no longer overrides its inline-flex display. Checkbox host cannot shrink; its explicitly associated label may wrap inside the field. The date range retains its shared control and reserved feedback beneath the input, so top alignment remains independent of feedback height.
- Matched source: the `stockReportViews.notRun` rendering branch is absent. Error StateMessage remains; DataTable `showEmpty=hasSearched() && !errorMessage()` still distinguishes initial state from a completed empty response. SummaryCards and issue/return valuation caveat remain as authorized by the clarified scope. Initial output remains unavailable through canOutput, and no automatic initial report request was introduced.
- Reviewed complete scoped template via Git's no-index diff because the shared family folder is untracked from the earlier authorized implementation. Whitespace and merge-marker inspection passed. Existing eight consumer routes/imports/configurations and request/output lifecycle were source-read; no new translation/import/type is needed. The existing unused initial-message EN/AR key pair is retained for compatibility rather than rewriting unrelated vocabulary.
- Owner question evidence: backend `StockReportsService` contains the eight source-reviewed report methods and the frozen filtered SQL aggregates/counts/Page complete flag; the earlier service/interface/controller/DTO changes remain in the scoped backend diff. UI20 **Required report review evidence** explicitly demands actual frontend/backend file symbols and request-to-backend paging/totals comparisons. BE17 **Pattern 5 — Reports** owns the service/controller/query/aggregate/date contracts and points to UI20/21 for Angular. Thus a full report review includes both layers; an explicitly narrower formatting follow-up does not reopen backend implementation.
- Phases: scoped presentation discovery/frozen amendment, frontend implementation and final source reconciliation. Backend/write/domain-action implementation skipped because this follow-up changes presentation only. No migration or AutoMapper change. No subagents used: one shared template is a small sequential scope. Prohibited commands were not run.
- Owner acceptance pending: inspect all eight reports in EN/AR, light/dark, wide/narrow layouts; confirm control alignment, wrapping, action placement and the absence of the initial instruction message. Confirm valid/invalid Search, Reset, report/lookup failure recovery, empty results and full print/Excel retain prior behavior. Build/runtime/visual acceptance has not been claimed.
- Suggested frontend commit: `fix(stock-reports): align filter fields and remove initial report prompt`. No backend commit is required for this follow-up.

## Optional report badges / KPI proposals — 2026-10-05 (Draft, not implemented)

Owner asks for suggestions only. Application source is unchanged for this request. The term badge may mean summary cards above the table or per-row status badges, so the proposals distinguish both. Existing shared owners are SummaryCards (UI20/24) and DataTable `type:'status'` with `status(row)` (UI5); reuse them if later authorized.

| Report | Proposed compact KPI cards | Optional row badge / source contract |
|---|---|---|
| Summary / Detailed | Counts of items with positive, zero and negative Quantity / EndingQuantity | Available (>0), zero stock (=0), negative stock (<0), describing reported quantity rather than a new inventory policy. |
| Pending GRN | Distinct pending PO count; count of pending PO/item rows without any received quantity; count with positive received quantity | Not received (QuantityReceived=0) / partially received (QuantityReceived>0) on already-positive PendingQuantity rows. These describe the PO/item row, not the whole PO. |
| Parts moving | Never-issued item count (AsOfNow=0); historical issued items with no issues in the rolling six-month window (AsOfNow>0 and BySixMonth=0); recently issued item count (ByThisMonth>0) | Never issued / no issues for six months / issued within last month. These are gross issue activity, not sales, net movement or stock availability; categories are not assumed exhaustive. |
| Issue / Return | Count of rows with missing UnitPrice / Amount, emphasizing incomplete valuation beside the known-amount total | Price unavailable when UnitPrice is null. A stored/matched zero price remains zero, not missing. Existing matched prices remain source proxies; a non-null price is not labelled verified historical valuation. |
| Purchases / PO Detail | Distinct item count and distinct supplier count; useful alongside the existing amount total | No new financial state inferred from purchase rows. |

All KPI counts must be computed by the backend over the same final filtered report scope before paging, with exact response fields frozen before implementation; the frontend must not count its displayed page. Hide-zero and other filters apply to the same scope, so a zero-stock card may legitimately be zero when zero rows are excluded. Pending document counts use actual PO identity; PO/item classifications cannot be presented as whole-document receipt status. Existing totals, columns and source limitations remain frozen until an authorized amendment.

Priority recommendation: Summary/Detailed negative-stock count, Pending not-received/partial row indicators, and Moving no-issue indicators. Keep two or three additional cards per screen; Detailed already has six total cards. Low-stock/reorder badges need an authoritative minimum/reorder quantity, which this frozen report currently lacks (MinimumStockValue remains null); fast/slow movement needs approved quantitative thresholds. Do not infer either from MaximumQuantity or arbitrary colours. Text accompanies semantic tone and shared light/dark/RTL styles.

These are proposals, not a frozen business change or implementation authorization. No service/API/model/UI source changes, migration, build, test, browser or database command was performed for this suggestions-only request. Owner acceptance and a later exact KPI/filter/output contract remain pending.

## Approved badges / KPI implementation — 2026-10-05

Owner subsequently authorizes the proposals with `تمام نفذهم`. The preceding Draft section remains historical; the exact new handoff is Frozen in STOCK_REPORTS_DOMAIN_API_CONTRACT_FREEZE.md, badges/indicators amendment. Phase0/PLAN impact: Extend existing backend response/service and typed family config/lifecycle; Extend six report status-column sets and all eight KPI descriptors; Keep existing totals/filter/paging/output owners; no new standalone implementation. Backend and frontend file ownership is separable after this freeze. Generated packets remain stale (read-only check performed); canonical sources govern.

### Before-edit reference conformance

| Concern | Book | Actual reference / shared owner | Target |
|---|---|---|---|
| Report aggregates | BE17, Master4/5 | Current StockReportsService filtered query.CountAsync/SumAsync before Page; StockReportResults<T> | Add per-report SQL counts in additive Metrics, same complete/paged response scopes; preserve existing totals and tenant joins. |
| KPI cards | UI20/24 | SummaryCard interface and SummaryCards public compact/row/minCardWidth/maxHeight inputs; current StockReportPage.summaryCards | Typed backend-count descriptors, semantic accents/icons, no UI sums or feature card CSS. |
| Status cells | UI5 | DataTableColumn<T> type/status, DataTable.statusOf/statusClass and shared export formatter; Workshop/Job list type:'status' reference | Six appended translated status columns, preserving numeric fields; use approved success/info/warning/danger/neutral tones and accessible text. |
| Complete outputs | UI8/20/21 | StockReportPage.bindRequests, clearOutput, exportToExcel and ReportPrintService session | Validate metrics before enabling output, clear on edits/failure; print/export whole report with KPI scope unchanged by local page. |

Root owns frontend family/configs/EN/AR and local review artifacts; bounded backend worker owns only StockReportsService.cs and StockReportResults.cs. Extensive unrelated preexisting edits remain protected. Source-only execution boundary continues; no build/test/lint/browser/database/migration/commit.

Before shared edit: source review found DataTable's two @for column loops keyed only by field, which collides for the explicitly approved numeric plus status views of one field. The frozen prerequisite selects field+stable header-key identity under UI20's shared-capability rule. Root additionally owns the two-line shared DataTable template repair; existing numeric/sort/row/export/visual contracts are preserved. This is a concrete integration defect, not permission to redesign out-of-scope grids.

### Badges / KPI final reconciliation — Implemented — source-only

Owner verification pending: yes. Phase0 impact/source evidence, Phase1 frozen additive response/presentation contract, Phase2 backend/frontend implementation, Phase5 output/error integration and Phase6 scoped source reconciliation complete. Phases3/4 omitted: read-only report changes have no writes or domain transitions. User instruction supersedes the historical proposals-only status. No screenshot-derived numeric value or new minimum/fast/slow threshold was inferred.

| Consumer → backend producer | Final metric keys | Appended grid field / semantic header beside existing row DTO | Result |
|---|---|---|---|
| StockSummaryComponent → GetStockSummaryAsync | positiveStockItems, zeroStockItems, negativeStockItems | quantity / stockReportViews.stockStatus; StockSummaryResultDto.Quantity retained, all original eleven columns unchanged before this twelfth column | Matched |
| DetailedStockReportComponent → GetDetailedStockReportAsync | positiveStockItems, zeroStockItems, negativeStockItems | endingQuantity / stockReportViews.stockStatus; DetailedStockReportResultDto.EndingQuantity retained, original fourteen columns unchanged before this fifteenth column | Matched |
| PurchaseOrdersDetailReportComponent → GetPurchaseOrdersDetailAsync | distinctItems, distinctSuppliers | Original ten columns / PurchaseOrdersDetailResultDto members unchanged; no added badge column | Matched |
| PurchaseDetailsReportComponent → GetPurchasesDetailReportAsync | distinctItems, distinctSuppliers | Original ten columns / PurchasesDetailReportResultDto members unchanged; no added badge column | Matched |
| ItemsIssueReportComponent → GetItemsIssueReportAsync | unpricedLines | unitPrice / stockReportViews.priceStatus; ItemsIssueReportResultDto.UnitPrice retained, original twelve columns unchanged before this thirteenth column | Matched |
| ItemsReturnReportComponent → GetItemsReturnReportAsync | unpricedLines | unitPrice / stockReportViews.priceStatus; ItemReturnsReportResultDto.UnitPrice retained, original ten columns unchanged before this eleventh column | Matched |
| GetGrnPendingReportComponent → GetGrnPendingReportAsync | pendingOrders, notReceivedLines, partiallyReceivedLines | quantityReceived / stockReportViews.receiptStatus; GrnPendingReportResultDto.QuantityReceived retained, original ten columns unchanged before this eleventh column | Matched |
| GetPartsMovingReportComponent → GetPartsMovingReportAsync | neverIssuedItems, dormantSixMonthItems, issuedLastMonthItems | asOfNow / stockReportViews.movementStatus; PartsMovingReportResultDto.AsOfNow retained, original eleven columns and display rowNo unchanged before this twelfth column | Matched |

The original exact ordered column/DTO inventory above remains the base; only the six explicit appended status presentations extend it. No new ListVM, API row property, mapping or row identity was introduced. Shared DataTable uses unique field/header keys for all header/body cells; all eight sets were source-inspected for unique pairs. Status callbacks return translation keys, as required by DataTableStatus; the shared cell and export formatter translate at render/click time.

| Final source comparison | Evidence and result |
|---|---|
| Metrics producer/consumer | All eight final filtered query dictionaries match config descriptor key sets exactly (18 descriptors / 12 distinct keys). Summary uses Quantity; Detailed uses EndingQuantity. All predicates and distinct non-null IDs match the frozen handoff, including hide-zero and positive-pending filters. CountAsync/Distinct CountAsync precede all Page calls; no page/materialized UI count. |
| Complete/paged metadata | Existing eight readers still send completeReport=true through toFilterParams; Page retains default size1..100, count/order/Skip/Take and complete metadata. Metrics accompany both modes over the full filtered set; Fail includes an empty dictionary. Original totals are unchanged. |
| Validation/invalidation | StockReportPage.bindRequests checks configured response metrics are numbers, safe integers and nonnegative along with existing complete/count/totals proof. Missing/invalid metrics keep output disabled and show the existing incomplete response error. clearOutput clears metrics with rows/totals on edits, invalid Search, Reset or a new request; declared/transport failures retain one existing recovery owner. |
| UI cards/statuses | summaryCards combines existing server total cards and configured metric cards, with number format 1.0-0, approved icon/accent, unchanged compact/row/min140/max80 inputs. Six translated row status callbacks preserve original numeric columns and zero/null semantics. Moving statuses describe issued quantity, not current on-hand balance; Pending describes grouped PO/item status, not whole-document status. |
| Print/Excel | Existing full print session retains all columns/status text and all metric cards; shared SummaryCards print CSS releases max height/scroll. Excel uses dataTableExportRows for the complete array, original authoritative totals, a translated indicator/count subsection using backend metrics, and the source-price caveat. No selected-page slicing or client aggregate. |
| Appearance/identity | DataTable header/body track only changed from field to field+stable header key. Row dataKey, field sorting, numeric formatting, status palette/template fallback and local paging inputs unchanged. Shared status rules cover light/dark and text accompanies tone; no new feature CSS. UI5/skill/history and UI1.74 metadata document this source-verified reusable capability; runtime acceptance is separate. |
| Translation/source checks | EN/AR StockReportViews property keys match (104 including three grouping keys; 101 leaf keys). All new metrics/status/header/output labels have paired translations. Relevant tracked/untracked diffs and whitespace/merge-marker/type/import source inspections passed. This is source inspection, not compilation or runtime testing. |

#### Exact application files changed for this amendment

Frontend repository `F:/My Work/Sigma/SiGmaAngularFrontEnd` (13 files):

- src/app/modules/stockReports/StockSummary/component/stock-summary/stock-summary.component.ts
- src/app/modules/stockReports/DetailedStockReport/component/detailed-stock-report/detailed-stock-report.component.ts
- src/app/modules/stockReports/purchaseOrdersDetailReport/component/purchase-orders-detail-report/purchase-orders-detail-report.component.ts
- src/app/modules/stockReports/purchaseDetailsReport/component/purchase-details-report/purchase-details-report.component.ts
- src/app/modules/stockReports/itemsIssueReport/component/items-issue-report/items-issue-report.component.ts
- src/app/modules/stockReports/itemsReturnReport/component/items-return-report/items-return-report.component.ts
- src/app/modules/stockReports/GetGrnPendingReport/component/get-grn-pending-report/get-grn-pending-report.component.ts
- src/app/modules/stockReports/GetPartsMovingReport/component/get-parts-moving-report/get-parts-moving-report.component.ts
- src/app/modules/stockReports/shared/stock-report-contract.ts
- src/app/modules/stockReports/shared/stock-report-page.ts
- src/app/modules/shared/components/data-table/data-table.component.html
- src/app/modules/i18n/vocabs/en.ts
- src/app/modules/i18n/vocabs/ar.ts

Backend repository `F:/My Work/Sigma/SigmaBackend` (2 files):

- SiGma.Business/Services/StocksServices/StockReportsService.cs
- SiGma.Helpers/Reports/StockReports/StockReportResults.cs

Instruction/review layer: existing feature review and contract amendments; canonical ui/05-columns.md, ui/00-preamble.md and CHANGELOG.md; required sigma-screen-refactor skill rule plus revision history. Generated packets were not edited and remain pending regeneration/semantic review. Shared/library files already had unrelated owner edits; only the described scoped additions belong to this task.

Decisions: additive metrics dictionary and typed descriptors; backend filtered counts rather than page counts; six badge columns retaining original numeric data; no minimum/reorder/fast/slow policies; historical source-price proxy remains explicitly disclosed. No schema/entity/EF configuration or AutoMapper change; Add-Migration is not required. No build, test, lint, database, browser, migration, commit, push or deployment command was run.

Agent utilization: reused backend_reports for the two backend files and frontend_consumers for the eight config files, each inheriting the existing model. Root froze the contract before dispatch and owned family lifecycle/translations/shared identity/docs plus integration/diff review. Their independent non-overlapping work reduced implementation time; no third worker or overlapping edits. Both workers completed source-only checks; root reconciled their exact keys and added the shared identity prerequisite uncovered during integration.

Owner verification: build both applications together; inspect SQL Server/EF Core translation and performance of CountAsync predicates over existing correlated quantity/price/receipt projections. Check empty datasets and both complete/paged contracts; for one filter set verify every KPI across local pages and all print/Excel rows. Check hide-zero, negative stock, partial/no receipts, missing versus zero job prices, and the six-month/one-month issue windows. Verify EN/AR, themes, keyboard and narrow layouts, including all nine Detailed cards within shared bounds and their full print release. These runtime/visual/SQL checks remain pending; source conformance is not acceptance evidence.

Suggested commits (not executed):

- Frontend: `feat(stock-reports): add filtered KPI cards and row status badges`
- Backend: `feat(stock-reports): return authoritative filtered report metrics`
- Documentation: `docs(ui): define shared column presentation identity`

### Continued source integration inspection — 2026-10-05

On the owner's `كمل` follow-up, completed additional source inspection rather than assuming authorization for prohibited build/runtime steps. Eight route targets resolve to existing component source; eight report readers retain completeReport=true and the actual X-Skip-Error-Interceptor header. Controller/interface methods still agree on StockReportResults<T> and all eight action/filter/result types. Additive Metrics requires no separate controller serializer or DTO adapter change. Application entry routes statically reference the lazy route modules; no compilation failure evidence exists to justify expanding tsconfig.app.json.

Reviewed the actual Excel utility: onExportToExcel passes complete objects directly to XLSX.utils.json_to_sheet, preserving the first report row's header order; the appended indicator/count rows use those same headers, and status text comes from the shared click-time formatter. Reviewed ReportPrintService preparation and shared SummaryCards print release; original form/page state is retained and metric cards are not omitted by the template. Reviewed success, incomplete metrics, declared/transport failure, empty result, filter invalidation and reset paths in the source. Scoped whitespace inspection passed. No new confirmed in-scope source defect was found; no additional application changes were made in this continuation.

Source inspection cannot establish EF SQL translation, compilation or actual print/Excel/visual behavior. These checks remain pending for explicit owner authorization under AGENTS.md Prohibited tools and actions. Status remains Implemented — source-only; owner verification pending yes. No build/test/lint/browser/database/migration/commit was performed. No subagents needed for this bounded sequential final inspection.

## نطاق مراجعة تقارير المخزون المرجعية — ١ نوفمبر ٢٠٢٦

هذه شريحة مراجعة source-read-only بطلب المالك مقارنةً بدليل وشرح Speed والكتب المعتمدة؛ لا تفويض جديد لتعديل التطبيق. النطاق ثمانية مسارات القائمة الفعلية: StockSummary، DetailedStockReport، PurchaseOrdersDetailReport، PurchaseDetailsReport، ItemIssueReport، ItemsReturnReport، GrnPendingReport، PartsMovingReport. الشكل UI20/21 report family والخلفية BE17 report/read model، وليس CRUD. تقارير قوائم مستندات Stock الداخلية الأربعة ليست مسارات التقارير الثمانية وتذكر كحدود مخرجات ذات صلة دون توسيع إلى مراجعة CRUD كاملة.

جمد الجذر نطاق التدقيق وحدود العقود القائمة قبل التفويض: StockReportsController [Authorize] وثماني GET actions، StockReportResults<T> مع IsComplete/Totals/Metrics، وcompleteReport=true في مستهلكي التقارير الحالية؛ لا تغيير في مرشحات/نتائج/حسابات/صلاحيات/فروع أو مخزون. يشمل baseline عقد STOCK_REPORTS_DOMAIN_API_CONTRACT_FREEZE وعقد STOCK_BRANCH_BALANCE_CONTRACT_FREEZE اللاحق، ولا تعتبر السجلات التاريخية إثبات مطابقة للمصدر الحالي أو موافقة على قيم المرجع المجهولة. Check للحزم الثماني ناجح؛ تستخدم PLAN00 للاكتشاف المتناسب ثم PHASE01/02/05/06 كمقارنة دون تنفيذ، مع Master2/4/5/7 وUI2/20/21/22/29 وBE2/7/17.

توزيع القراءة بعد تجميد حدود التدقيق: وكيل المرجع يملك استخراج أدلة شاشات Speed الثماني والأصول المحلية فقط؛ وكيل الخلفية يملك تدقيق StockReportsService وDTO/API والمحاسبات/نطاقات المخزون والفهارس قراءةً؛ وكيل الواجهة يملك stockReports الثماني والمالك العائلي والمخرجات/اللودر/الكاش والدليل قراءةً. لا وكيل يعدل ملفًا، والجذر يملك التوثيق والمصالحة وتحقق الدليل والتعارضات. تحفظ جميع التغييرات الأخرى في مساحة العمل، ولا builds/tests/lint/browser/DB/migrations أو مصدر تعليمات أو تطبيق يُعدل في هذه المراجعة.

## نتيجة المراجعة المرجعية الشاملة لتقارير المخزون — ١ نوفمبر ٢٠٢٦

**الحالة: المراجعة مكتملة من المصدر، والمطابقة غير مكتملة؛ لا تنفيذ أو قبول تشغيلي.** الطلب source-read-only، لذلك لم يتغير تطبيق أو إعدادات أو تعليمات أو مخطط. العائلة الفعلية ثمانية تقارير تحت stockReports، وقد ظلت فروق مجلدها والخدمة/DTO/controller فارغة. الصفحات الداخلية لتقارير قوائم المستندات ليست بديلًا عن هذه المسارات ولا تدخل في هذا النطاق.

### ملخص النتائج حسب الأولوية

| المعرف | الأولوية/النوع | السيناريو والنتيجة | المصدر الفعلي والتوصية |
|---|---|---|---|
| F01 | مرتفعة P1 — مخرج غير متسق | شغّل التقرير الكامل، ثم ضع مرشحًا محليًا على عمود واضغط طباعة: مرشح الجدول يظل فعالًا، بينما الإجماليات والمؤشرات تخص التقرير الكامل. Excel يقرأ المصفوفة الكاملة، فيختلف عن المطبوع. | shared/stock-report-page.html:93–94 و100–104 لا تربطان printAllRows؛ DataTable.component.ts:396–404 يبقي tableFilters إلا إذا printAllRows. المطلوب ربط الإدخال المشترك بحالة الطباعة للمجموعات والجدول المسطح، مع حفظ مرشحات الشاشة وإعادتها؛ لا إعادة تعريف التقرير الكامل بمرشح العرض المحلي (UI6/21). |
| F02 | مرتفعة P1 — حماية سياق المخرجات | إذا تغير حساب/اشتراك/فرع بيانات المستخدم/لغة أو credential وبقيت نفس الصفحة مركبة، لا يمسح المالك النتائج أو خيارات السياق السابق، ويمكن طباعة/تصدير البيانات السابقة، أو تعبئتها من استجابة معلقة. هذه مخاطرة مصدرية مشروطة ببقاء المكوّن، وليست إثبات تجاوز صلاحيات خادم. | stock-report-page.ts:118–136 و279–319 بلا contextChanges/version/cancel fencing؛ canOutput:236 لا يفحص السياق. ReferenceLookupCacheService:354–363 يملك سياق المصدر الفعلي. يلزم إلغاء القراءات وتحضير الطباعة وتصفير بياناتها/المخرجات/الخيارات والهويات قبل إعادة تجهيز السياق؛ لا كاش جديد للنتيجة (UI2/21/28). |
| F03 | متوسطة P2 — حد تجميع كميات | صفان صحيحان كل منهما1.5 مليار يمكن أن يتجاوز مجموعهما32 بت قبل وصوله إلى DTO عشري؛ الملخص نفسه يملك Quantity:int. قارئ رصيد الفرع التشغيلي يجمع64 بت، فيختلف حد القارئين. | StockReportsService.cs:77–87،191–207،540؛ StockSummaryResultDto.cs:10. المقابل StockBranchBalanceReader.cs:51/63/93/104. يلزم توسيع العامل قبل SUM والجمع، ثم عقد نقل/تنسيق متوافق، وليس cast بعد الجمع. لم تُشغل SQL أو يُدّعَ عطل مقاس. |
| F04 | متوسطة P2 — انجراف تاريخ تعاقدي | فاتورة مورد بتاريخ31 أكتوبر واستلامها معتمد1 نوفمبر تنتقل إلى تقرير مشتريات نوفمبر وتختفي من أكتوبر؛ المصدر يستخدم ApprovedAt للمعتمد بينما العقد المجمد يحدد SupplierBillDate. | StockReportsService.cs:312–322 مقابل STOCK_REPORTS_DOMAIN_API_CONTRACT_FREEZE:23/43/62. يلزم مصالحة صريحة لتاريخ تقرير المشتريات، دون إعادة تاريخ أثر حركة المخزون تلقائيًا إلى الماضي. تواريخ الصرف/الإرجاع والتفصيلي المعتمد عند140/158–170/366–367/427–428 تحتاج تسمية/توثيق تاريخ المستند مقابل الأثر أيضًا. |
| F05 | متوسطة P2 — تبنّي مرجع غير مكتمل | مصادر الصنف/الفرع/المورد/العمل منضمة للكاش فعليًا، لكن الشاشة تكتفي بقراءة أولى؛ لا watch مستقل أو حفظ تسمية الاختيار عند التحديث/مسحها عند السياق، ولا defaultIfEmpty لمسار bootstrap. فشل إعادة القراءة يمسح الخيارات. | stock-report-page.ts:170–186. يلزم successful finite bootstrap ثم ReferenceLookupBindings/watch وفشل/Retry مع إبقاء الاختيار والمسودة والتسميات في السياق نفسه، وتصفيرها عند انتقال السياق. PurchaseOrder/GetSelect مباشر بلا opt-in؛ لا تُضاف له ذاكرة لمجرد أنه GET (UI2). |
| F06 | متوسطة P2 — مؤشر تجهيز المرشحات | تجهيز الخيارات المطلوب عند فتح تقرير يُظهر مؤشرًا داخل p-select ولا يملك lease لمؤشر الصفحة، خلاف قاعدة26 أكتوبر الحالية. | stock-report-page.html:23؛ لا ReferenceLookupStatus صفحة في المالك العائلي. يلزم ربط التجهيز الأولي بالمؤشر العام الواحد، مع إبقاء busy/error/Retry وتحديث الكاش المتاح صامتًا (UI22). |
| F07 | متوسطة P2 — دليل استخدام ناقص | الدليل الحالي يشرح بيانات ومستندات المخزون فقط؛ لا موضوعات للتقارير الثمانية وفلاترها ومعاني المؤشرات وحدود التكلفة والمخرجات. | UserGuide/content/stock-guide.ts:3–81؛ يوجد سؤال رصيد الفرع:95 يذكر الملخص والتفصيلي فقط. يُستكمل عند التنفيذ داخل /UserGuide/stock؛ هذه المراجعة لا تمنح تعديل مصدر الدليل (Master7). |
| F08 | فجوة سياسة/عقد | كميات مرتبطة بوحدات قياس تُنقل وتُحفظ كأعداد صحيحة عبر المنتجين والقراء، دون تصنيف يثبت أنها true counts. العقد التاريخي/البيانات التجريبية ليسا استثناءً من سياسة30 أكتوبر. | PurchaseOrderDetail.Quantity،GRN.QuantityReceived،Issue/Return/Transfer/Opening.Quantity وDTO أوامر الشراء/المشتريات. يلزم قرار مجال الكمية وسلسلة تنفيذ تشمل الكيان والكتابة والمخزون والتقارير وفق السياسة المشتركة؛ الهويات وعدد السجلات والمؤشرات تبقى أعدادًا صحيحة. لا تحويل تقرير وحده أو migration في هذه المراجعة. |

مسارات ملفات الواجهة في هذا القسم تحت SiGmaAngularFrontEnd/src/app/modules، واسم DataTable الكامل shared/components/data-table/data-table.component.ts. الخدمة الخلفية تحت SigmaBackend/SiGma.Business/Services/StocksServices/StockReportsService.cs، وDTOs تحت SiGma.Helpers/Reports/StockReports.

### مصفوفة التقارير الفعلية ومقارنتها بالهدف المرجعي

| التقرير/المسار/الخدمة | مرشحات Sigma الفعلية والمخرجات | مرجع28 أكتوبر | المطابقة والفجوات |
|---|---|---|---|
| ملخص /StockSummary → GetStockSummary | صنف، فرع، نوع، إخفاء الصفر؛12 عمودًا، إجمالي قيمة وثلاثة مؤشرات رصيد | R0571/C1704؛ القالب26556 | مطابق للصنف/النوع/إخفاء الصفر والكمية/القيمة؛ جزئي للموقع مقابل Branch إذ لم يثبت تطابق الهويتين. المرجع يعلن reorder/cost ووصف make/model/year/UOM؛ بعضها له مقابل مختلف أو لا مصدر له. لا إثبات معادلة تقييم خادم Speed. |
| تفصيلي /DetailedStockReport → GetDetailedStockReport | السابق وفترة إلزامية بشهر حالي؛15 عمودًا، ستة إجماليات وثلاثة مؤشرات | R0586/C1697؛26860 | مجموعات كميات البداية/داخل/خارج/صافي/آخر موجودة؛ موقع المرجع يحتاج mapping. لا ننسخ جمع تكلفة الوحدة أو تقريبها المحلي كقاعدة مالية. تكلفة Sigma الافتتاحية قرينة عقد قائمة وليست إثبات تقييم تاريخي مرجعي. |
| أوامر شراء /PurchaseOrdersDetailReport → GetPurchaseOrdersDetail | فترة ومورد؛10 أعمدة، مبلغ وعدد أصناف/موردين | R0573/C1702؛27092 | مطابق البحث والمورد والمبلغ؛ المرجع يتيح تعطيل الفترة ونوافذ بحث مورد، ولا يوجد هذا التبديل في Sigma. الأعمدة المرجعية المنسوخة من ملخص المخزون ليست دليلًا كافيًا على أعمدة هذا التقرير. |
| مشتريات /PurchaseDetailsReport → GetPurchasesDetailReport | فترة وصنف ومورد؛10 أعمدة، مبلغ وعددان | R0582/C1705؛27183 | مرشحات مطابقة إجمالًا، لكن المرجع يستدعي bill.GetPurchaseDetailBillReport بينما Sigma يسحب GRN فعالًا. هذا اختلاف مصدر أعمال يحتاج قرارًا: مشتريات مفوترة أم استلام بضاعة؛ لا نعتبر نفس الاسم إثبات تكافؤ. انجراف التاريخ F04 قائم أيضًا. |
| صرف /ItemIssueReport → GetItemsIssueReport | فترة وعمل؛13 عمودًا، مبلغ وعدد غير المقيم | R0579/C1699؛26735 | البحث بالعمل والمبلغ موجودان؛ تعطيل الفترة المرجعي غير موجود. سعر JobItem الأخير لنفس العمل/الصنف قرينة معلنة بالعقد؛ لا يثبتها خادم Speed أو تاريخ سعر الصرف. |
| مرتجع /ItemsReturnReport → GetItemsReturnReport | فترة وعمل؛11 عمودًا، مبلغ وعدد غير المقيم | R0574/C1700؛26620 | نفس جزئية الفترة والتقييم؛ ربط صرف أقدم بالاستدلال ليس FK تاريخيًا ولم تثبته شاشة المرجع. لا نصنع ربطًا أو سياسة مردود تلقائيًا. |
| استلام معلق /GrnPendingReport → GetGrnPendingReport | فترة ومورد وأمر شراء؛11 عمودًا في أقسام حسب الأمر، pending وثلاثة مؤشرات | R0580/C1698؛26665 | اختيار أمر الشراء مثبت؛ المرجع يقيد البحث بنوع مستند39 ويتيح تعطيل الفترة. تعريف «معلق» وقواعد احتساب المستلم/المرتجع لا يكشفها المرجع؛ Sigma يطبق عقد ordered−effective receipts بعد مرتجع المورد. لا يثبت التكافؤ دون تعريف المجال. |
| حركة /PartsMovingReport → GetPartsMovingReport | صنف فقط؛12 عمودًا وثلاثة مؤشرات، بلا مبلغ | R0581/C1701؛26710 | اختيار الصنف بلا فترة مستخدم مطابق. المرجع يرسل asOfDate لنهاية اليوم، وSigma يلتقط وقت UTC واحد حتى الآن؛ لا إثبات تعريف نوافذ/عتبات سريع/قليل/غير متحرك. مسميات Sigma الحالية تصف الصرف والنوافذ صراحةً، ولا نسمّيها رصيدًا جاريًا. |

المطابقة أعلاه جزئية عن قصد: غياب HTML النتائج/الخادم في المرجع لا يسمح بادعاء تطابق كامل أو باختراع حقول/حسابات. لا توجد أفعال حفظ/اعتماد مثبتة داخل التقارير الثمانية. لا drill-down إلى مستند مالي أو عمل مثبت من القوالب المقروءة؛ لذلك لا تُقترح روابط أعمال غير مدعومة. الطباعة المعتمدة تأتي من UI21 حتى لو لم يثبت زرها في قائمة أفعال المرجع؛ تصدير DOM المرجعي لا يثبت اكتمال الصفحات، ولا ينسخ عيبًا في مخرج Sigma.

### الأعمدة بجوار عقد النقل الحالي

الأسماء التالية هي camelCase الفعلية، ومقابلها PascalCase في DTOs التي قرأها التدقيق الخلفي؛ ليس لهذه التقارير ListVM CRUD. كل الأعمدة موجودة في نماذج الواجهة وDTO، عدا rowNo المشتق للعرض وشارات حالات العرض التي تعيد استعمال الحقل نفسه بعنوان آخر. الهوية itemId أو rowId مستعملة حتى إن لم تعرض، ولا نقص مصدر مصطنع لشارة الحالة.

| التقرير | الأعمدة بالترتيب (وهوية المصدر) |
|---|---|
| الملخص | itemCode,itemName,supplierItemCode,unitPrice,minimumStockValue,maximumQuantity,branchName,itemType,quantity,unitCost,stockValue,quantity→stockStatus؛ الهوية itemId |
| التفصيلي | itemCode,itemName,supplierItemCode,beginningQuantity,inQuantity,outQuantity,netQuantity,endingQuantity,unitCost,stockValue,minimumStockValue,maximumQuantity,branchName,itemType,endingQuantity→stockStatus؛ الهوية itemId |
| أوامر الشراء | date,itemName,itemCode,poNo,supplierItemCode,uom,supplierName,quantity,unitPrice,amount؛ الهوية rowId |
| المشتريات | date,itemName,itemCode,supplierItemCode,voucherNo,supplierName,uom,quantity,unitPrice,amount؛ الهوية rowId |
| الصرف | date,jobId,jobNo,itemName,itemCode,supplierItemCode,description,issueNo,quantity,unitPrice,amount,user,unitPrice→priceStatus؛ الهوية rowId |
| المرتجع | date,jobNo,itemName,itemCode,supplierItemCode,description,itemsIssue,quantity,unitPrice,amount,unitPrice→priceStatus؛ الهوية rowId |
| المعلق | date,itemCode,itemName,supplierItemCode,lpoNo,supplierName,description,quantityOrdered,quantityReceived,pendingQuantity,quantityReceived→receiptStatus؛ الهوية rowId، وpurchaseOrderId/supplierId/itemId لخريطة الأقسام |
| الحركة | rowNo,itemId,itemName,itemCode,supplierItemCode,asOfNow,byThisWeek,byThisMonth,byThreeMonth,bySixMonth,byOneYear,asOfNow→movementStatus؛ الهوية itemId |

التكلفة/السعر والمبالغ حقول مالية لا تُجمع كتعداد. قيم MinimumStockValue بلا مصدر ثابت تبقى null بدل ادعاء صفر. الأصناف والمراجع الاختيارية tenant/live، والأسماء المفقودة لا تُسقط سطر الحركة. شارات الرصيد والاستلام والحركة والتقييم لا تغير القيم الأصلية أو query، وأزواج field/header مستقرة في كل جدول. مفاتيح stockReportViews العربية والإنجليزية متطابقة:104 properties منها101 leaf، دون نقص مثبت في الاستعمالات.

### جرد الطلبات وملكية الكاش/التحميل

| المصدر/المستهلك | التصنيف والمالك والكتاب والإشعار | الحكم الحالي |
|---|---|---|
| Item/GetSelect؛ الملخص/التفصيلي/المشتريات/الحركة | ItemService cacheSelect=true عبر BaseService→ReferenceLookupCacheService؛ create/update/remove والاستيراد الناجح يبطلان المصدر؛ lookup-items | finite read فقط من العائلة؛ نقص المراقبة ومسح السياق/حفظ التسمية ومعالجة empty ضمن F05 |
| Branch/GetSelect؛ الملخص/التفصيلي | BranchService opt-in، create/update/delete يبطِلون المصدر؛ lookup-branches | نفس النقص؛ لا افتراض أن تغيير Working Branch يساوي المرشح المحدد، بل يحرس سياق Cache نفسه |
| Supplier/GetSelect؛ أوامر الشراء/المشتريات/المعلق | SupplierService opt-in، الكتابات والاستيراد تبطل المصدر/ContactGroup حسب المصدر؛ lookup-suppliers | نفس النقص؛ metadata التسمية والأهلية لا تُستبدل بقيمة اختيار قديمة عند إعادة القراءة |
| Job/GetSelect؛ الصرف/الإرجاع | JobService opt-in مع invalidation للكتاب الحاليين؛ lookup-jobs | نفس النقص، ولا تغيير أهلية أو سعر/سعة أثناء إصلاح الكاش |
| PurchaseOrder/GetSelect؛ المعلق | مصدر مباشر لا cacheSelect opt-in في خدمة أمر الشراء | قراءة مباشرة صحيحة حسب حدود المصدر؛ ليست كل GET مؤهلة للكاش. يبقى فشلها/الإعادة/السياق مطلوبًا |
| StockReports/الثماني GET | تشغيلية/سياسة تقرير مباشرة، لا كاش مراجع. لكل خدمة completeReport=true ومعالج خطأ محلي X-Skip-Error-Interceptor | عقد snapshot كامل مقبول بنيويًا؛ start/finalize عالميان صحيحان أثناء البحث، ونقص context fence في F02 |

تهيئة المرشحات تحدث عند فتح التقرير دون بحث تلقائي؛ تبدأ خيارات مستقلة (واحد أو اثنان) وتتلقى finite read. المؤشر المرئي الحالي داخل Select يخالف UI22، حتى إذا كانت بعض الردود من كاش دافئ. Read bootstrap يحتاج صفحة عامة واحدة عبر ReferenceLookupStatus ولا يحتاج spinner جديدًا أو مصدرًا موازيًا. ReportPage داخل route/shell العادي، ولا metadata showPageLoading=false للتقارير الثمانية. بحث التقرير يستعمل switchMap/defer وstartLoading ثم finalize/endLoading وDestroyRef؛ الجدول والزر يحجبان مؤشرًا مكررًا تحت العام. تغيير مرشح النموذج يبطل البيانات ويُلغي البحث السابق، لكن لا يساوي تبديل السياق الكامل.

المسارات المتطابقة: صفحات routing:670–723 إلى الوحدات routes الفعلية والمكونات المشتقة من StockReportPage، وجميعها تستهلك shared/stock-report-page.html لا HTML محليًا قديمًا. shell/sidebar catalog يملك الروابط الثمانية. حاويات route-host/ReportPage وpanel/table-frame موجودة، وجدول fill للسبعة أو تدفق أقسام المعلق يملك التمرير. UI20/21 العامان يملكان المظهر والطباعة؛ لا feature palette بديل مثبت.

القبول الحالي الصحيح للاستجابة: isSuccess ثم IsComplete ثم totalCount===entities.length، وكل total finite وكل metric عدد صحيح آمن غير سالب. الرد الناقص لا يمكّن المخرجات. الفلاتر المصورة وcurrentMonthRange/dateRangeValidator/parseDateRange محفوظة، وenum0/false لا يحذفهما serializer. Excel من كامل المصفوفة المقبولة مع ترجمة وقت التنفيذ والإجماليات والمؤشرات وتحذير السعر؛ لا مجموع browser جزئي. هذا لا يضمن معاملة DB ذرية أو اكتمال طباعة الجدول بعد مرشح محلي.

### جرد الأداء والاستعلام والفهارس

| القارئ/مرساة StockReportsService | العمليات النهائية الظاهرة بالمصدر | نقاط الفحص والاقتراح |
|---|---:|---|
| Summary:21–111 |6؛ وتحقق فرع اختياري | count وsum وثلاثةcounts ثمrows؛ الرصيد/تكلفة الافتتاح يعادان في الإسقاط. تأثير الفروع/المرتجع/النقل يطابق عائلات الرصيد الحالية؛ F03 أولًا |
| Detailed:114–241 |11؛ وتحقق فرع اختياري | ستة مجاميع وثلاثة مؤشرات وcount/rows؛ تكرار SQL correlated كبير محتمل. حافظ على البداية والفترة والحد الحصري وتاريخ الأثر عند أي تجميع إحصاءات |
| PO:244–284 |5 | amount/count/distinct-item/distinct-supplier/rows؛ تقرير مستندات الطلب لا يساوي أثر مخزون ولا يلزم قصره على المعتمد بلا عقد |
| Purchases:287–339 |5 | صف لكلGRN detail فعال؛ السعر/القيمة مخزنان. F04 ومصدر bill/GRN يحتاجان القرار قبل تبديل مصدر أو تاريخ |
| Issue:342–398 |4 | latest JobItem بنفس Job+Item؛ subquery في SQL وليس HTTP/N+1 لكل صف؛ يبقى تقييمًا قرينيًا مع تحذير |
| Return:401–462 |4 | نفس السعر وأقدم صرف مستدل؛ لا FK تاريخي مخترع |
| Pending:465–572 |6 | PO+Item grouping؛ الربط المنظم أولًا ثم fallback نصي محدود عند غيابه؛ مرتجع المورد الفعال مطروح. لا تحميل كامل إلى الذاكرة قبل التجميع؛ F03 وخطط المجاميع المترابطة |
| Moving:575–616 |5 | ستة مجاميع صرف مترابطة، ثم استعمالها في ثلاثةcounts/الصفوف؛ وقت UTC ملتقط مرة ونوافذ7days/1/3/6/12months، لا رصيد صافي أو عتبة سرعة مخترعة |

الأرقام عمليات LINQ نهائية في المصدر، لا نتيجة قياس round trips/ترجمة EF/SQL أو زمن. تقليل الأعمدة أو استعمال loader/cache لا يثبت تحسين سرعة. اقتراح التنفيذ المتناسب: جمع الإحصاءات المتوافقة في إسقاط واحد مع صفر صريح للمجموعة الفارغة، ثم صفوف التقرير بنفس المرشح؛ لا توازٍ على DbContext واحد ولا تحويل لمادية كل الصفوف لمجرد تقليل call. يحتاج التفصيلي والمعلق خصوصًا فحص SQL Server translation وخطة التنفيذ وIO والذاكرة. النقل العالمي يتعادل، وأثر branch والمراجع والحالات يجب أن يبقى كما في العقد اللاحق، لا مقارنة بمعادلة4 أكتوبر المتقادمة وحدها.

خطر مستقل R01: count/totals/metrics/rows تُقرأ في عمليات متتابعة بلا معاملة لقطة ثابتة؛ حركة متزامنة قد تجعلها من لحظات مختلفة حتى إذا بقي العدد ثابتًا. هذا خطر اتساق قابل للتفسير، لا فشل مُشاهد ولا تفويض إضافة isolation/transaction. يلزم قبول حداثة لحظية موثق أو عقد لقطة واتساق قبل التنفيذ.

| مرشح فهرس — اقتراح فقط | الموجود والتداخل | الفائدة والكلفة والتحقق |
|---|---|---|
| ItemIssueItem (SubscriptionId,ItemId,ItemIssueId) INCLUDE(Quantity,IsDeleted)، غير فريد بلاfilter | snapshot:25149 مفردا ItemId/ItemIssueId ومراجع المصدر؛ رأس الصرف مركبات فرع واعتماد/إبطال/ApprovedAt | يدعم tenant+item ومجموع الكمية؛ يتداخل جزئيًا ولا يكرر composite قائمًا. يزيد الكتابة والمساحة؛ خطة قبل/بعد مطلوبة |
| GoodsReceivedNoteDetail (SubscriptionId,ItemId,GoodsReceivedNoteId) INCLUDE(QuantityReceived,IsDeleted,PurchaseOrderId,PurchaseOrderDetailId)، بلاfilter | snapshot:13298 مفردات item/header وPurchaseOrderDetailId و(SubscriptionId,PurchaseOrderId) | يغطي ربط ومجاميع الاستلام الثقيلة؛ لا يحل كل branch/date predicate وحده. INCLUDE واسع وكلفة حفظ أكبر؛ يقارن استعمال الفهارس الموجودة أولًا |
| JobItem (SubscriptionId,ItemId,JobDetailId,Id DESC) INCLUDE(UnitPrice,IsDeleted)، بلاfilter | snapshot:32517 مفردا ItemId/JobDetailId، وJobDetail.JobId مفرد | يضيّق مرشحي أحدث سعر ويغطيه؛ تعددJobDetails قد يبقي Sort. كلفة تعديل السعر والكتابة؛ لا وعد بإزالة الفرز |
| PurchaseOrder (SubscriptionId,Date,Id) INCLUDE(IsDeleted,SupplierId,ApprovedStatus)، بلاfilter | snapshot:13413 مفرد المورد ومراجع المصادر، دون tenant/date مماثل مثبت | مرشح تاريخ أوامر الشراء؛ لا يضاف فهرس لكل مرشح. تحقق الانتقائية/حجمNo قبل توسيع INCLUDE؛ No الكبير مستبعد مبدئيًا |

لم توضع filters من IsDeleted=0 على هذه المقترحات لأن نطاق IsDeleted!=true الحالي يقبل null؛ لا تُغيَّر دلالة الحياة لتحسين فهرس. بقية الفتح/الإرجاع/النقل والمراجع لها PK/FK ومركبات رؤوس، ولا فهرس إضافي مبرر من المصدر وحده الآن. التصريحات والـsnapshot ليست إثبات ما نُشر في DB أو إحصاءاته. لا migration من هذه المراجعة؛ إذا اعتُمدت مفاتيح محددة لاحقًا يمكن أن يكون اسمها المقترح AddStockReportQueryIndexes، ولا تُولد/تشغل تلقائيًا.

شرط القياس المعلق: نفس إصدار FE/API والاشتراك/الفرع/اللغة والمتصفح والجهاز والشبكة وأعداد الأصناف/المستندات. اختر empty، عينة معتادة، حجمًا كبيرًا، وفرعًا ذا تاريخ غير مثبت؛ سجّل خمس عيناتcold وخمسwarm وmedian للتهيئة/البحث/الطباعة/Excel منفصلة، payload وعددrows/أوامرSQL/CPU/IO/خطة ووقتDOM، مع الفشل والإلغاء وRetry. التقرير الكامل هو baseline الحالي، والصفحة المحلية15 لا تقلل payload؛ المعلق يركب كل الأقسام. طلب incremental جديد يحتاج تجميد totals/snapshot/order/output وليس إضافة scroll تجميليًا. لم تُشغّل هذه المقاييس.

### القرارات الدقيقة والفجوات المستهدفة قبل التنفيذ

| القرار/الفجوة | المطلوب ومسوغه | حالة التنفيذ |
|---|---|---|
| D01 تاريخ المشتريات/الأثر | حدّد هل تقرير المشتريات بفترة فاتورة المورد أم أثر الاستلام. التوصية المحافظة إبقاء SupplierBillDate لمعنى العقد الحالي، وإظهار تاريخ الأثر منفصلًا إن لزم؛ لا تُرجع أثر المخزون المعتمد للماضي تلقائيًا | يحتاج مصالحة عقد صريحة، لا تخمين من المرجع |
| D02 مصدر تفاصيل المشتريات | المرجع يعلن خدمة bill بينما SigmaGRN؛ تعريف المفوترة مقابل المستلمة، وما إذا كان المطلوب تقريرين، وما يدخل من عملة/ضريبة/خصم | فجوة مجال/مالية لا تصلح بحقل عرض فقط |
| D03 اختيار فترة غير مقيدة | القالب المرجعي يملك enableDateRange في أوامر الشراء/الصرف/المرتجع/المعلق؛ Sigma يفرض فترة في الستة ذات التاريخ. حدّد اعتماد البحث بكل التاريخ مع حدود حجم/مخرج | فجوة وظيفية مثبتة في أربعة؛ backend يقبل عدم التاريخ، لكن تغيير الواجهة يغيّر العقد المجمد |
| D04 الموقع مقابل الفرع | تعيين locationId المرجعي إلى كيان Sigma الصحيح، لا افتراض تطابق IDs. شرط branchAccess المرجعي تصريح واجهة لا حماية خادم مثبتة | يحتفظ تنفيذ Sigma بBranch المقبول حتى قرار mapping/آلية وصول؛ UI26 الحالية authentication فقط |
| D05 قيمة حد أدنى/إعادةطلب/وصف | المصدر لا يملك MinimumStockValue أو make/model/year/UOM description كاملاً؛ لا تسمِّ MaximumQuantity كمية إعادة الطلب بلا معنى مجال | فجوة تخطيط معلومة؛ لا صفر مصطنع أو قفزة علاقة من لقطة |
| D06 التكلفة والتقييم | أساس openingValue/openingQty وسعر Job الأخير والاستدلال على إذن الصرف قرائن Sigma المقبولة سابقًا؛ ليست تكاليف تاريخية أو FIFO/متوسط مرجح مثبتة بالمرجع | تحفظ القرائن والتحذير حتى عقد مالي ومصدر بيانات؛ لا مجموع لمعدلات تكلفة الوحدة |
| D07 تعريف المعلق/الحركة | «معلق» هل غير مستلم/مفوتر/معتمد؟ و«قليل الحركة» ماهو الحدثوالنافذة والعتبة؟ وكيل الخدمة لا يكشف قواعد الخادم | تحفظ دلالات Sigma الصريحة؛ لا اختراع30/60/90 أو عداد مخزون من إجمالي صرف |
| D08 سياسة الكميات | صنّف true count/ID مقابل كميةUOM وفق سياسة ٣٠ أكتوبر؛ وسّعقبل التجميع وأتم السلسلة عبر المنتجين | F03 قابل لشريحة إصلاح حدود، وF08 يحتاج تجميد مجال ومخطط/هجرة عند اللزوم؛ لا تفويض هجرة حالي |

ليست هذه الفجوات موافقات جديدة أو owner exclusions تلقائية. قِدم تنفيذ Sigma أو العقد المحدود لا يلغي هدف التفاصيل المرجعية. في المقابل تعبير متحكم أو عناوين grid منسوخة أو مصدر شرح عام لا يثبت API/ماليات/صلاحيات مفقودة. الإصلاحات F01/F02/F05/F06/F07 قابلة لخطة مشتركة بعد طلب تنفيذ واضح؛ F03 يحتاج عقد رقم متسق؛ F04/D01–08 تُحسم بالحد المحدد قبل الجزء التابع لها. لا أسئلة لازمة لإكمال المراجعة نفسها.

### إحالات المرجع وأنواع الأدلة والنسخة المدققة

المصادر الأصلية للدليل: references/speed-analysis/README.md ثم دليل ٢٧ أكتوبر الفصل ١٣ (الورش) والفصل ١٦ (البحث والتقارير)، وفهرس الشرح وS113 داخل library/manifest.json. S113 وصف عام للمخزون وطلب القطع والتقارير، وليس شرحًا تفصيليًا للثمانية؛ لا شرح مطابق مثبت في catalog/manifest. S226 يخص ترقيم أمرشراء وغير منطبق. بصمة S113 هي887d63de8c51570bbbca461e8427d6e2ef3f4e01bdd6b5d64fb134d2896d5729. حُفظ غياب الشرح التفصيلي كفجوة، لا ادعاء أن مصدرًا غير مقروء يثبت المطابقة.

في لقطة28أكتوبر قُرئت شاشة كل تقرير08–15، route المقابل، controller المشار إليه، سجل template-bindings بعينه، وكيل الخدمة المحلي ودورةworkshop-stock-finance. binding يثبت controls/actions، والتصريح البرمجي يثبت fields consumed/calcs frontend فقط، والوكيل يثبت POST route/JSON ولا يكشف server DTO أو validation أو security. لا HTML جدول نتائج كامل في هذه الحزمة. بعضgridOptions منسوخة بين التقارير فتُستبعد كعقد أعمدة. تُستبعد نوافذ الجهات الخارجية/صلاحياتها ونسخ أسماء ملفات Excel كدليل لدلالة الأعمال.

| التقرير | controller المحلي وسطور مهمة | raw/application.js | وكيل الخدمة raw/service-proxies-angular.js |
|---|---|---|---|
| الملخص | C1704؛filters12،read/sum89–98،columns114–158،exports182/194،locations261 |469394–469672 |stockReport/GetItemStockReport:14213 |
| التفصيلي | C1697؛read62،unitCost/totals79–90،export120،locations181 |467764–467968 |stockReport/GetDetailedStockReport:14325 |
| أوامر الشراء | C1702؛disableRange35،supplier46،read/sum103–120،export218 |468952–469230 |stockReport/GetStockReportPurchaseOrdersReport:14229 |
| المشتريات | C1705؛supplier51،read/sum89–101،export105 |469675–469835 |bill/GetPurchaseDetailBillReport:6688 |
| الصرف | C1699؛disableRange35،read/sum88–105،job110،export214 |468252–468526 |stockReport/GetItemsIssueReport:14277 |
| المرتجع | C1700؛disableRange35،read/sum88–105،job110،export214 |468529–468803 |stockReport/GetItemsReturnReport:14269 |
| المعلق | C1698؛disableRange34،read87،POsearch112–118،export218 |467971–468249 |stockReport/GetGRNPendingReport:14293 |
| الحركة | C1701؛asOfDate57–64،item70–81،export83 |468806–468949 |stockReport/GetPartsMovingLessMovingAndNotMovingReport:14309 |

جذر جميع المسارات المرجعية F:/My Work/Shaban Documents/Shaban/sigma-erp/references/speed-analysis/2026-10-28. ملفات controllers اسمها يبدأبالمعرف أعلاه تحت readable/controllers؛ screen08–15 تحت sidebar/15-stock/screens. البصمات المسجلة بالقوالب حسب template-bindings، لا بصمات HTML مقروء مستقل:

| التقرير | سطر السجل | SHA256 المسجل |
|---|---:|---|
| الملخص |26556 |b6f0dcbe6fe3c21419cf050a162e3bb4800c61a7b10264fc5af1823e430d579e |
| التفصيلي |26860 |b74530f0064f4c0f5a8970ebb93172aa7e1878c3f0e88da15856ee2b6479ddce |
| أوامر الشراء |27092 |4ece7462d0dbd7fe3200f23743669911064b9e0c3b99ff3326348e335dfb8be4 |
| المشتريات |27183 |ccf57118a28fc84ef2898a16ed292568261a319d5b32a650d284052439a9db33 |
| الصرف |26735 |40ebe7d0212ff532ecf999998d135f22ea11d8dd2136d5e89f0b7c0b88d58677 |
| المرتجع |26620 |b9cd555d2a03306d3b925b4df8b25b214ece9c89840e79e92f383c4f15793085 |
| المعلق |26665 |5f5879b7d1e4515ff63bdc5d2cb90e4d04ef4a914b89e993c89dbb73c266fbd0 |
| الحركة |26710 |5dc3d8cdeeb611d791e676ac6e90c5d548bbf9f56973a5d153981166e4bcca2a |

بصمة application.js:39fd999323fa97551442c5a71dc7e83c975436cace0fb4ee8c0cdeea0e1033c4، بتاريخ التقاط2026-10-28T15:02:02.3008732Z. بصمة service-proxies-angular.js:b320304e43bcead8f1103c701763c997f5e1f12f3bde020d2c878ab17d3f28a9، بتاريخ2026-10-28T15:02:06.6188468Z. لم تُستدعَ مصادر Speed الخارجية أو أدواتجمعها.

نسخة Sigma المدققة من المصدر مع حفظ التغييرات الموجودة: frontend HEAD=36be0bed4c68d9b1cdd0246892adf4db956f747d؛ backend HEAD=b2f260ee49733c574131cad7776f58bb2d07094f. بصمة stock-report-page.ts=B554D47D22A471E20D16796D536F1C3BA51611A17842D0B66E2627B6F790F9C4؛ قالبها=F7554F14A44BAB56B5AE2E7823E84BB3482894EF56AD21709D4E8C6D935CAA66؛ StockReportsService.cs=7D4033616C8CF57DF07CB74FC768310AEF7FF168216320B026635C3C804132FB. أعاد الجذر قراءة المواضع الحرجة للطباعة والفلاتر والتجميع وتاريخ المشتريات، وطابقت البصمات البداية والنهاية.

المطابقة المصدرية الصحيحة التي لا تُلغى بالملاحظات: ثمانية GETs مصادقعليها ومطابقة بينcontroller/interface/service/DTO؛ tenant/live fail-closed ومرجع/طفل حي؛ احتساب approved/nonvoid وأثر فرع/نقل/مرتجع مورد؛ complete/paged metadata مع totals قبلpaging؛ source-price caveat ومؤشرات backend؛ EN/AR الحالية؛ مصدر واحد للبحثوالطباعةبالعائلة. لا ثغرة خادم مثبتة أو خرقpermission جديد من هذهالمراجعة، ولا اختراعآليةصلاحيات فيSigma.

### تسليم المراجعة وحدود التحقق

المخرجات المكتوبة فقط هي هذا القسم في STOCK_REPORTS_FEATURE_REVIEW.md ومدخل INDEX. لم يتغير مصدر التطبيق أو الدليل أو التعليمات؛ لم تُصلح الملاحظات لأن الطلب مراجعة. المصدر/المرجع/العقد قورنت بما في ذلك الواجهة والخلفية والدليل، ولا تعني حالةImplemented التاريخية في أعلى السجل أن هذه المراجعة مرت بلا ملاحظات. لم يُولد ملف عقد موازٍ أو ينسخ قالب L كامل؛ هذا تدقيق عائلة موجودة بعقودها المحددة، لا مشروع استبدال عام.

نجح Check للحزم الثماني الحالية؛ لم تُعدل الكتب أو المهارة أو template/manifest فتوليدها غير مطلوب. أثبتت القراءة خلو فروق نطاقStockReports في مستودعي التطبيق، ولا مصدر جديد مطلوب compilation له. لا builds/tests/lint/browser/network/DB/migrations/commits/deploy. المصدر لا يثبت EF SQL translation أو قياس زمن أو مظهر/طباعةExcel فعلية. لا Add-Migration مطلوب من تقرير مراجعة؛ مقترحات الفهارس لا تمنح إذنًا بالتنفيذ.

استُخدم ثلاثة وكلاء بالوراثة دونmodel override بعد تثبيت حدود التدقيق: speed_evidence للمراجع، backend_audit للخلفية والاستعلامات، frontend_scalar_audit للواجهة/المخرجات/اللودر/الكاش/الدليل. لا ملف كتبه أي وكيل، والجذر ملك العقد ومقارنة التعارضات والتوثيق والدمج النهائي والتحقق من النتائج الحرجة. التوازي مناسب لثماني شاشات وثلاثة مصادر مستقلة؛ لا تداخل ملكية أو تصريح إكمال عام من وكيل.

الترتيب المقترح لخطة التنفيذ اللاحقة: أولًا مخرجات الطباعة وحماية السياق(F01/F02)، ثم إصلاح حدود التجميع(F03) وتجميد تواريخ التقرير(F04)، ثم تبني الكاش والتحميل والدليل(F05–07)، وأخيرًا شرائح التفاصيل المرجعية بعد قراراتD01–08 وقياس الاستعلامات قبل فهارسها. لا تُنفذ بنود قرارات الأعمال على أنها تحسين تنسيق.

## مصالحة تنفيذ ملاحظات تقارير المخزون — ١ نوفمبر ٢٠٢٦

نُفذت الإصلاحات المؤكدة F01–F07 بعد طلب المالك «عدل الملاحظات»، مع تغطية اختيار الفترة المرجعي D03. الحالة: مصدر منفذ ومراجع، والتحقق التشغيلي وSQL والتوقيت عند المالك. هذه ليست شهادة تطابق كامل مع كل تفاصيل Speed؛ بقيت فجوات المجال المحددة أدناه خارج الشريحة المجمدة.

### نتيجة كل ملاحظة

| الملاحظة | الحالة النهائية | الدليل العملي من المصدر |
|---|---|---|
| الطباعة F01 | منفذة | جدولا التقرير المسطح والمجمع يربطان printAllRows بحالة ReportPrintSession. المالك المشترك يتجاهل مرشحات الأعمدة أثناء الطباعة ويحتفظ بقيود الشاشة بعد انتهائها. Excel يبقى من المصفوفة المقبولة الكاملة، والإجماليات والمؤشرات لنفس نطاق الطلب. |
| تغير السياق F02 | منفذة | contextChanges يثبت contextInvalidated قبل الإلغاء؛ ينهي cancelReads القراءات والمراقبة، ثم requests(null) ويلغي تحضير الطباعة ويمسح rows/totals/metrics/options/selected IDs ويعطل النموذج والمخرجات. لا تقبل callbacks بعد السياق، ولا يعيد finalize تمكينه. تظهر رسالة إعادة فتح التقرير بدل طلب تلقائي بهوية قديمة. حوار طباعة بدأه المتصفح بالفعل يظل ملك المتصفح ولا يمكن استرجاع الورق المطبوع. |
| حد تجميع الكميات F03 | منفذة في التقارير | StockReportsService يحول العامل إلى decimal داخل SUM وقبل عمليات الجمع والطرح ومقام تكلفة الوحدة، ويجمع QuantityOrdered بالعشري. StockSummaryResultDto وPurchaseOrdersDetailResultDto وPurchasesDetailReportResultDto تحمل Quantity:decimal؛ الواجهة number وJSON رقم كما كانا. لم تتغير IDs أو counts/metrics إلى كميات. |
| تاريخ المشتريات F04 | منفذة | EffectiveDate في تقرير المشتريات هو SupplierBillDate للمرشح والتاريخ المعروض معًا، سواء كان الاستلام تاريخيًا أو معتمدًا. تاريخ أثر الاعتماد للتفصيلي/الصرف/الإرجاع محفوظ وموضح في العقد والدليل؛ لم يرجع أثر مخزون معتمد إلى فترة سابقة تلقائيًا. |
| مراقبة المصادر F05 | منفذة | مصدر metadata صريح للمنضمين فقط، وقراءة bootstrap منتهية مع defaultIfEmpty وفحص isSuccess/array، ثم bind watch مرة واحدة لكل مفتاح. الفشل لا يمسح الخيارات الموجودة، وselected/current getters تحفظ تسمية الاختيار، دون كتابة form أو إعادة حساب مخرجات التقرير. |
| مؤشر تجهيز المرشحات F06 | منفذة | ReferenceLookupStatus بملكية الصفحة يملك lookupLoading المجمعة. أزيلت loading من Select؛ البحث والتحديث محميان حتى نجاح كل bootstrap، والخطأ/Retry وaria-busy باقية. كاش بقيمة محتفظ بها يُحدّث صامتًا. |
| دليل الاستخدام F07 | منفذة | أضيفت ثمانية موضوعات عربية/إنجليزية في stock-guide.ts وربطت بالدليل القائم /UserGuide/stock، مع الفترات والتواريخ والتقييم والمخرجات والحدود وإعادة المحاولة والسياق. |
| الفترة الاختيارية D03 | منفذة | PO/Issue/Return/Pending فقط تملك optionalDateRange=true. خيار useDateRange يبدأ true مع الشهر الحالي. تعطيله يعطل حقل الفترة ويزيل طرفي التاريخ من الطلب، لا يرسل تاريخًا متروكًا أو مفتاح واجهة. التفعيل يعيد Validators.required/dateRangeValidator؛ Reset يعيد true والشهر الحالي. Detailed/Purchases يحتفظان بالفترة المطلوبة. |
| كسور المنتجين F08 | لم تُنفذ كتغيير مجال | توسيع التقرير يمنع overflow ولا يجعل مخزون المستندات أو الحفظ أو الرصيد يدعم الكسور. الكيانات وDTOs الكتابة والتصنيف حسب الوحدة/المجال وقارئ الرصيد وإعدادات التخزين تحتاج شريحة مستقلة متكاملة؛ لم تُعدل entities أو migrations/snapshot أو تعليمات دقة بالتخمين. |

### توافق القراءة والكتابة والمخرجات

حافظت الخدمات على الثماني GET وAuthorize وCancellationToken وStockReportResults/IsComplete/Totals/Metrics والوضع الكامل/المقسم وعقود counts/order. لا row action جديد أو DTO طلب أو ListVM أو AutoMapper أو علاقة أو صلاحيات أو حساب تكلفة جديد. الجزء الذي تغير في عقد النقل هو نوع Quantity العشري في نتائج التقارير الثلاثة المذكورة، وهو رقم متوافق مع مستهلك number الحالي. كميات Detailed/Pending المتاحة أصلًا بالعشري تستقبل مجاميع واسعة قبل الإسقاط؛ لا cast بعد overflow.

المرشحات المصورة لا تتغير بسبب إشعار lookup. التحديث يُبقي النتائج المعروضة لنفس الطلب، ولا يشغّل تقريرًا جديدًا ولا يغير معرف الاختيار. تغيير مرشح المستخدم يبطل النتائج ويلغي الطلب السابق كما كان. فشل envelope/HTTP والإكمال الفارغ يتركان خطأ قابلًا للإعادة، وأضيف زر Retry صريح لفشل قراءة التقرير يعيد search من الحالة الحالية. الرد الناقص في IsComplete/count/totals/metrics ما زال مرفوضًا قبل إتاحة المخرجات.

عقد أعمدة التقارير وDTOs مطابق للمصفوفة في مراجعة1 نوفمبر أعلاه، دون أعمدة إضافية أو حذف أو تقريب غير معلن. type:number للكمية يظل يعرض الرقم، وtype:money للمال يظل تحت المالك المالي. minimumStockValue يبقى null لعدم مصدره، وmaximumQuantity لا يعاد تسميته حد إعادة طلب. سعر Job الأخير وأقدم صرف مستدل قرينتان معلنتان مع تحذير، وليستا تكلفة تاريخية أو علاقة مثبتة جديدة.

### المطابقة النهائية للكاش والتحميل

| التقارير | مصادر مشتركة رُبطت بعد نجاح القراءة المحدودة | المصدر المباشر المحفوظ |
|---|---|---|
| Summary / Detailed | ItemService وBranchService لكل تقرير | لا مصدر مباشر آخر |
| PO detail | SupplierService | لا مصدر مباشر آخر |
| Purchases | ItemService وSupplierService | لا مصدر مباشر آخر |
| Issue / Return | JobService لكل تقرير | لا مصدر مباشر آخر |
| Pending | SupplierService | PurchaseOrder/GetSelect بلا source أو watch |
| Moving | ItemService | لا مصدر مباشر آخر |

المجموع11 تبني مصدر ضمن الإعدادات الثمانية؛ metadata source?:BaseService لا تمنح opt-in لخدمة غير منضمة. BaseService.watchSelectList/refreshSelectList وReferenceLookupCacheService وReferenceLookupBindings هي المالكون الحقيقيون، ومعهم قنوات lookup-items/branches/suppliers/jobs والكُتّاب والاستيراد والإبطال الموثقة في جرد المراجعة السابق. لا كاش جديد لنتائج StockReports أو سياسة/سعر/توفر أو PurchaseOrder المباشر. bind لا يكرر الاشتراك عند Retry، وDestroyRef/cancelReads ينهيانه.

كل تقرير ما زال Search-first. المالك العام لتهيئة المرشحات هو ReferenceLookupStatus، والبحث يملك startLoading/finalize/endLoading مع switchMap وDestroyRef؛ كلاهما يصبان في مضيف الصفحة نفسه دون spinner داخل حقول البحث. contextInvalidated يجعل lookupLoading=false حتى لا يبقى lease أو aria-busy معلقًا بعد إلغاء المراقبة. background refresh بقيمة متاحة صامت ويحافظ على الخيارات؛ فشله يظهر Retry دون مسح المسودة أو المخرجات. الحراس فورية حتى لو تأخر نشر الرسم المرئي المشترك إلى microtask.

### المصادر والقرارات المتبقية

استُخدمت أدلة Speed المحلية المقروءة في المراجعة نفسها: R0571/R0586/R0573/R0582/R0579/R0574/R0580/R0581 ومتحكماتها وbinding الفترة الاختيارية للأربعة. لا external login أو جمع مرجع أو تنفيذ خدمات Speed. تعارض تواريخ الأثر حُسم في هذه الشريحة لصالح دلالة الأثر التشغيلية، والمشتريات لصالح تاريخ فاتورة المورد حسب عقدها الحالي، مع شرح الفرق في الدليل.

لا تُحسم من هذه الشريحة D02 (Bill مقابل GRN)، أو D04 (هوية موقع Speed مقابل Branch)، أو D05 (حدود المخزون/إعادة الطلب ووصف الماركة/الطراز المفقود)، أو D06 (منهج تقييم مالي جديد)، أو D07 (تعريف حركة سريع/بطيء أو معنى معلق مختلف)، أو F08 (كسور المنتجين). المرجع الأمامي لا يثبت API/المحاسبة/الصلاحيات أو روابط الكيانات المطلوبة، والعقود الحالية لا تمنحها. الإبقاء عليها معلنة لا يعني تحويلها إلى owner exclusions أو ادعاء اكتمال مرجعي؛ شرائحها تحتاج العقد المحدد وإعدادات المخطط عند اللزوم.

### الأداء والفهارس والتحقق

لا زيادة في طلبات التقرير أو طلب لكل صف. المصادر الدافئة تستخدم المالك الحالي؛ المراقبة تضيف تسوية TTL/إشعار المصدر المسموح بها، وليس تكرارًا فوريًا لكل فتح. بقية عدد عمليات LINQ الإحصائية كما في المراجعة؛ لم تُنفذ إعادة كتابة غير متحققة لترجمة SQL أو تغيير عزل لقطة أو فهرس. cast قبل SUM يصحح حد الحساب، لكنه ليس قياس سرعة أو إثبات خطة تنفيذ. تقرير المعلق ما زال كامل الأقسام، وprint/export كاملين؛ لا تحميل جزئي مخترع.

القياس المطلوب عند المالك يبقى cold/warm بنفس البيانات/الفرع/الجهاز/الشبكة مع SQL plan/IO/CPU والزمن، كما في بروتوكول المراجعة. توصيات الفهارس الأربعة لم تُطبق لعدم قياس الحاجة والتداخل فعليًا؛ لا Add-Migration مطلوب للتغييرات المنفذة لأنها DTO/قراءة/واجهة فقط. تغييرات F08 المستقبلية إن جُمدت ستحدد هجرتها الخاصة؛ ليست هجرتها مبررًا لتغيير المخطط الآن.

نطاق ملفات التنفيذ:14 ملف واجهة (ثمانية إعدادات، ثلاثة shared-family، قاموسان بمفتاح الفترة، ودليل المخزون)، وأربعة ملفات خلفية (الخدمة وثلاثةResultDto). بقيت بقية تغييرات المستخدم السابقة والمتزامنة محفوظة؛ إضافات مفاتيح فرع ItemIssue/ItemReturn في القاموس أو تعديلات شاشات Stock الأخرى ليست من هذه الشريحة ولا تُضم إلى رسالة حفظها.

راجع الجذر كامل الفرق المحدد في كل مستودع، ونطاقات المصدر/الـtenant وحالات الأثر لم تتغير في الخلفية. راجع namespace ومراجع مشروع Helpers ونوع Quantity المستهلك على الواجهة. نجح تحليل صياغة37 ملف TypeScript تابعًا للعائلة والدليل والقاموسين، وقالب Angular المشترك، وجرد مسارات الدليل الثمانية وتطابق مفاتيح الترجمة وعدم تكرارها، وgit diff --check للنطاقين. هذه فحوص مصدر وليست build أو typecheck أو تشغيل SQL. راجع وكيل مستقل الشريحة المشتركة بعد الدمج دون عيب مؤكد إضافي.

نجح Check للحزم الثماني في البداية والنهاية. لم تنشأ قدرة عامة جديدة أو قاعدة كتاب/مهارة؛ metadata العائلة وتفاصيل الفترة قرارات ميزة، والمكونات والخدمات المشتركة الحالية أعيد استخدامها. لا تعديل كتاب أو template/manifest يستلزم التوليد في هذه الشريحة.

لم تُشغل builds/tests/lint/browser/network/DB/migrations/commits/deploy. القبول التشغيلي عند المالك: طباعة كل الصفوف بعد مرشح عمود مع عودة المرشح بعد الطباعة؛ فشل/EMPTY/Retry للمصدرين والتقرير؛ تغير سياق أثناء GET أو تحضير طباعة؛ حفظ الاختيار والتسمية عند إشعار المصدر؛ إيقاف الفترة بطرف قديم غير صالح ثم تفعيلها وReset؛ فاتورة31 أكتوبر واعتماد1 نوفمبر؛ مجموع كميات أكبر منint؛ صفر/سالب/فرع/تاريخ قديم؛ العربية/RTL والمظهرين والنافذة الضيقة.

الوكلاء: backend_audit للخدمة وDTOs فقط؛ frontend_scalar_audit للإعدادات الثمانية ثم تدقيق القراءة للشريحة المشتركة؛ speed_evidence للدليل فقط. ورثوا النموذج الحالي دون override، بعد تجميد العقد، ودون تداخل ملفات. الجذر ملك المصدر المشترك والترجمات والعقد والدمج والفروق والمصالحة. خفض التوازي وقت التنفيذ لثلاثة مسارات مستقلة، ولا وكيل أعلن إكمال المهمة العامة.

رسالة حفظ مقترحة للواجهة: fix(stock-reports): align complete output and reference lifecycle

رسالة حفظ مقترحة للخلفية: fix(stock-reports): widen quantity aggregates and restore bill dates

## فتح النتائج تلقائيًا وتصغير الإجماليات — ١ نوفمبر ٢٠٢٦

| البند | النتيجة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| النطاق | شريحة Tier S في تقارير المخزون الثمانية، بعد موافقة المالك على الفتح التلقائي ثم تعميم المنطق على بقية تقارير المخزون. |
| السبب | StockReportPage.ngOnInit كان يجهز القوائم ويربط requests دون استدعاء search؛ العقد السابق كان Search-first صراحةً. حد maxHeight=80 مع التفاف تسع بطاقات التفصيلي أنشأ منطقة تمرير داخلية. |
| العقد | ملحق «فتح التقارير وكروت الإجماليات» في STOCK_REPORTS_DOMAIN_API_CONTRACT_FREEZE.md مجمد قبل التنفيذ، ويستبدل فقط قرار الفتح وتحديد ارتفاع الإجماليات السابقين. |

### مطابقة المصدر والمرجع

| الاهتمام | المالك والدليل المقروء | النتيجة |
|---|---|---|
| الشكل | Master1/5/7، UI20 وكتالوج07؛ ReportPage/ReportActions مع SummaryCards؛ الخلفية BE17 تقرير وليست CRUD | الاحتفاظ بالمكونات الحالية؛ لا تغيير للخادم أو بنية التقرير. |
| الفتح | StockReportPage.ngOnInit → loadLookup.finalize → searchOnOpen → search → bindRequests؛ initialSearchPending يستهلك قبل الطلب | محاولة واحدة بعد نجاح جميع الخيارات وانتهاء flags؛ Retry للخيارات يسمح بها، وفشل التقرير لا يعيد المحاولة ذاتيًا. تعديل المرشح وReset يلغيان نية الفتح المتبقية. |
| المرجع المؤرخ | نقطة الدخول references/speed-analysis/README.md، وفصل16 من دليل27 أكتوبر، وشرح S113 في library/manifest.json؛ خريطة28 أكتوبر ودورة workshop-stock-finance وشاشة Stock09 ومتحكم C1697/R0586 | يثبت C1697 في init استدعاء getDetailedStockReport؛ S113 شرح مخزون وتقارير عام. لا قاعدة خادم أو حساب/صلاحية مستنتجة. طلب المالك هو سلطة التوقيت والتعميم؛ بقية حقول وحسابات المرجع والفجوات السابقة خارج هذه الشريحة. |
| الإجماليات | UI24؛ SummaryCardsComponent.cardMaxHeight والأنماط slim/row | كثافة slim تقلل padding/icon/value من المالك نفسه؛ حذف maxHeight يعيد الارتفاع الطبيعي، والتفاف العرض يبقي جميع البطاقات متاحة دون قائمة محددة الارتفاع. لا CSS خاص أو إخفاء محتوى أو تعديل قيمة. |
| الإغلاق والسياق | UI28؛ DestroyRef.destroyed وcontextInvalidated وcancelReads وswitchMap | يمنع تشغيل متأخر بعد التدمير/السياق، وتظل قراءة التقرير قابلة للإلغاء والتحقق من الاستجابة الكاملة كما كانت. |
| دليل الشاشة | UserGuide/content/stock-guide.ts؛ STOCK_REPORT_USAGE_NOTES المشترك للموضوعات الثمانية، عبر القارئ القائم ومسار /UserGuide/stock | تحديث عربي/إنجليزي للفتح والمرشحات وRetry وReset والبطاقات؛ لا قارئ أو رابط جديد. |

### الكاش والتحميل والأداء

تبقى مصفوفة المصادر النهائية السابقة مالكة لتصنيف كل URL/consumer: Item/GetSelect للتفصيلي والملخص والمشتريات والحركة؛ Branch/GetSelect للتفصيلي والملخص؛ Supplier/GetSelect لأوامر الشراء والمشتريات والمعلق؛ Job/GetSelect للصرف والمرتجع، وكلها عبر opt-in المثبت في خدماتها وBaseService/ReferenceLookupCacheService. يظل PurchaseOrder/GetSelect بالمعلق مباشرًا دون opt-in. قراءات StockReports الثماني تشغيلية مباشرة وليست كاشًا. لا تغيير للكتّاب/الاستيراد أو lookup-items/branches/suppliers/jobs أو نطاق tenant أو إبطالها. يستمر finite successful bootstrap ثم bindReference مرة واحدة، وحفظ اختيار المستخدم/التسمية وRetry والإكمال الفارغ وteardown ومسح السياق. إشعار المصدر لا يستدعي searchOnOpen أو طلب تقرير آخر.

المسارات الفعلية مثبتة في pages/routing.ts وملفات routes الثمانية ثم المكونات التي ترث StockReportPage وتستخدم القالب نفسه. ReferenceLookupStatus ما زال مالك page bootstrap، والتقرير يستخدم loading.startLoading داخل defer وfinalize/endLoading عند النجاح والفشل والإلغاء. لا spinner إضافي للمرشح أو مالك تقدم جديد؛ نفس مضيف الصفحة العام. تحديث الكاش مع قيمة محتفظ بها صامت. لا استثناء showPageLoading جديد؛ تفاصيل المضيف وسياسة المسار موثقة بالمراجعة السابقة ولم تتغير هنا. قبول الظهور والتوقيت يحتاج تشغيلًا عند المالك.

قبل التعديل: صفر طلبات تقرير عند الفتح حتى ضغط البحث. بعده: طلب تقرير واحد بعد قائمة/قائمتَي خيارات البداية وفق التقرير، مع مسار فشل/Retry منفصل؛ hit الدافئ يتبع الكاش القائم. هذا تقديم لطلب البحث إلى الفتح وليس قياس تسريع SQL. تبقى completeReport=true والصفوف الكاملة والإجماليات العامة والتقسيم المحلي والطباعة والتصدير؛ لا طلب لكل صف أو حلقة تقرير جديدة. قُرئ حد GetDetailedStockReportAsync ومرشحاته وتجميعه؛ لا predicate/join/order أو schema تغير، ولذلك لا فهرس جديد لهذه الشريحة، وتوصيات الفهارس السابقة وفحص تغطيتها وخطة SQL/IO/CPU ما زالت عند المالك. يقاس الفتح البارد والدافئ بالبيانات والفرع والفترة والجهاز والشبكة نفسها، ويفصل زمن الخيارات عن طلب التقرير والعرض. لا قياس قبل/بعد متاح في نطاق المصدر فقط.

### المصالحة والتحقق

الملفات المعدلة بهذه الشريحة فقط: stock-report-page.ts وstock-report-page.html وUserGuide/content/stock-guide.ts، بالإضافة إلى ملحق العقد وسجل المراجعة. حُفظت نسخة قبل التعديل للملفات الثلاثة، وروجعت الفروق الإضافية مقابلها والفروق المحددة في مستودع الواجهة، مع الحفاظ على تعديلات المستخدم السابقة. لم يتغير أي ملف خلفية أو API أو حساب أو ترجمة UI جديدة. لا هجرة مطلوبة.

نجح تحليل صياغة ملفَي TypeScript دون diagnostics وتحليل قالب Angular دون errors؛ ليست هذه عملية بناء أو فحص أنواع كامل. نجح git diff --check للملفات الثلاثة. ثَبَت من المصدر اشتراك المكونات الثمانية في الأساس والقالب. شملت مراجعة المسارات المنطقية: خيارات دافئة متزامنة، باردة بترتيب اكتمال مختلف، خيار فاشل ثم Retry، فشل التقرير بلا loop، تعديل/Reset قبل اكتمال الخيارات، تدمير/تغيير سياق، وإشعار كاش بعد النتيجة؛ هذا تتبع مصدر وليس اختبارًا منفذًا.

الحزم: نجح Generate-SigmaRecipes.ps1 -Check للثماني؛ استُخدم PHASE-02 بمقدار القراءة المشتركة ومرجع UI20، مع تسليم Master7. لا تغيير قاعدة عامة جديدة أو كتاب أو قالب/manifest أو اعتماد يتطلب توليدًا. الشريحة صغيرة ومترابطة في ملفات مشتركة، لذلك لا حاجة لتفويض وكلاء. مراحل الكتابة والإجراءات غير منطبقة.

يبقى عند المالك قبول التشغيل لأول فتح للتقارير الثمانية، والفشل/Retry وإغلاق/سياق أثناء الخيارات، والعربية/الإنجليزية والمظهرين والعرض الضيق وعدم سكرول البطاقات وإبقاء الجدول صالحًا، وتوقيت SQL/الشبكة. لم تُشغل builds/tests/lint/browser/database/migrations/commit/push. رسالة حفظ مقترحة: fix(stock-reports): load on open and compact summary cards.

## محاذاة أزرار تقرير حركة القطع مع المرشح — ١ نوفمبر ٢٠٢٦

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| النطاق | تعديل صغير في ترتيب مرشح تقرير حركة القطع وأزراره فقط؛ لا تعديل بيانات أو واجهة خلفية |

طلب المالك جعل الزر في صف مربع البحث. المسار الفعلي PartsMovingReport من pages/routing.ts إلى GetPartsMovingReport_Routes ثم GetPartsMovingReportComponent يستهلك قالب StockReportPage المشترك، لا القالب المحلي القديم. سبب الصفين في القالب الحالي هو فرض عرض كامل على حاوية الحقول وحاوية الأزرار كلتيهما.

القرار المجمد قبل التعديل: إضافة اختيار ترتيب داخلي inlineFilterActions لإعداد التقرير الحالي، واستهلاك التنسيق المرن الموجود في sigma-report-filter-panel وReportActions وفق UI4/20. يحذف القالب فرض العرض الكامل للحاويتين عند تفعيل الاختيار؛ تقرير حركة القطع وحده يفعله. لا أنماط جديدة أو تغيير مكون المكتبة. تبقى بقية تقارير المخزون على ترتيبها، وتظل قواعد الالتفاف والعرض الضيق المشتركة مالكة الاستجابة، مع الحقول والأزرار والترتيب ونفس form/ngSubmit والحالات والصلاحيات والروابط.

المراجع: Master1 مستوى S وMaster5/7؛ شكل07 تقرير، UI4/20 والمالكان report-page/report-actions وأنماط report strip العامة، وStatementOfAccount بوصفه مرجع التقرير المعتمد. حزمة PHASE02 قُرئت بعد نجاح فحص الحزم الثماني. مصدر Speed المحلي المؤرخ ٢٨ أكتوبر: Stock15/R0581 وشرح الشاشة المقروء يثبت مرشح الصنف والتقرير؛ لا يحكم موقع زر سيجما، لذا لا تغيير أو اعتماد عقد أعمال جديد. المقارنة الوظيفية السابقة للتقرير تبقى حاكمة خارج عنصر الترتيب هذا.

### التنفيذ والمطابقة النهائية للشريحة

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

توجيه المالك الإضافي: توسيع قائمة الأصناف لاستغلال المساحة المتاحة. نُفذ عبر sigma-u-flex-grow-1 الموجودة على حاوية الحقول عند تفعيل inlineFilterActions؛ حقل الأصناف يظل sigma-report-filter-field مع sigma-u-mw-100، فيتمدد داخل الحاوية بدل حد العرض الافتراضي. شريط التقرير نفسه flex مع محاذاة أسفل الحقول، ويملك ReportActions مجموعة الأزرار. قاعدتا العرض الكامل أصبحتا شرطيتين؛ لا CSS محلي جديد، ولا ضبط عرض ثابت أو تعديل مكتبة. يبقى ترتيب الهاتف من المالك العام عند640 بكسل. التفعيل محصور في إعداد تقرير حركة القطع، والاختيار الافتراضي لبقية التقارير غير مفعل.

الملفات الأمامية المعدلة: stock-report-contract.ts وstock-report-page.html وGetPartsMovingReportComponent ودليل stock-guide.ts. لا طلب أو API أو DTO أو أعمدة أو حسابات أو خلفية أو خرائط أو مخطط تغيرت. Item/GetSelect يبقى مصدر ItemService المعتمد مع cacheSelect=true، وStockReports/GetPartsMovingReport يبقى قراءة تشغيلية مباشرة completeReport=true؛ مصفوفة الكاش والإبطال والكتّاب والتحديث والسياق السابقة لم تتغير. يحتفظ ReferenceLookupStatus بتحميل خيارات البداية العام، ويظل bindRequests داخل defer مع startLoading/finalize/endLoading ومالك الصفحة نفسه؛ لا تحميل إضافي أو إلغاء/Retry جديد. لا تغير في عدد الطلبات أو الاستعلامات أو حجم البيانات أو بيانات الطباعة والتصدير، ولا سبب لفهرس جديد في تعديل ترتيب؛ لا ادعاء زمن أسرع أو قياس تشغيل.

المطابقة: UI4/20 مقابل قواعد sigma-report-filter-panel وsigma-report-filter-field وReportActions وsigma-u-flex-grow-1 الفعلية؛ نفس form/ngSubmit والأزرار وحالات التعطيل والتحميل وRTL/theme والتمرير الداخلي. دليل المخزون يشرح موضع البحث وتمدد قائمة الأصناف بالعربية والإنجليزية ضمن موضوع /PartsMovingReport من دليل /UserGuide/stock الحالي. قرئ شرح المرجع Stock15/R0581 والمتحكم C1701 من application.js:468806-468949 كتصريحات واجهة مرجعية، دون استنتاج قاعدة خادم؛ موضع الأزرار قرار سيجما الصريح. لا حاجة لمراحل الكتابة أو إجراءات الأعمال أو ترحيل. لم تستخدم وكلاء لأن هذا عنصر واحد مترابط.

حدّثت كتلة الواجهة20 والمهارة وسطر مراجعتها لنفس اختيار التركيب، وأعيدت الحزم الثماني بالمولد فقط. الفحص النهائي ناجح؛ الفروق المولدة تغيّر provenance للكتلة20 في الحزم المستهلكة، مع حفظ تغييرات الوثائق السابقة. نجح git diff --check للأربعة؛ روجعت تغييرات الترتيب والأنواع والقالب والدليل مع حفظ التعديلات السابقة الموجودة في الملفات نفسها. تبقى معاينة العرض الواسع والضيق وRTL والمظهرين، وطول أسماء الأصناف، والبحث/Reset والطباعة عند المالك. لا بناء أو اختبارات أو lint أو متصفح أو قاعدة بيانات أو ترحيل أو commit/push/deploy. رسالة واجهة مقترحة: fix(stock-reports): widen parts filter beside inline actions.
