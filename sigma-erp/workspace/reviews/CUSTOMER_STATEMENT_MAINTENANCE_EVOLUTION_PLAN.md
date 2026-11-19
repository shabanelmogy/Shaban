# Customer Statement of Account refactor

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-02 |

## Scope and evidence

User authorizes refactoring `src/app/modules/Customers/StatementOfAccount`. Frontend repo `F:/My Work/Sigma/SiGmaAngularFrontEnd`; related backend contract traced read-only in `F:/My Work/Sigma/SigmaBackend`. No screenshot supplied. UI type 07 Report, backend type 5 Report; no paging or CRUD. Master 1/3/4/5/7; UI 1/2/3/16/17/20–29 and backend 17 govern this scoped frontend implementation. Recipe drift check reports all generated packets stale; canonical sources used. Prior shell/appbar changes remain intact.

## Impact map

| Area | Classification | Frozen decision / evidence |
|---|---|---|
| Report contract/calculations | Keep | Existing GET Customer/Statement with five Filters keys; CustomerStatementDto.cs and CustomerService.GetCustomerStatementAsync own all totals and sections |
| Lookup | Extend | Reuse CustomerService.getSelectList with optional inline-error suppression; loading/error/empty/retry state, no global loader for lookup |
| Filters | Refactor | Shared report strip, accessible labels, one two-month calendar, currentMonthRange/parseDateRange, reactive form disable/enable while loading |
| Output | Refactor | Single response rendered with semantic tables, shared MoneyPipe, same conditional DueAmount columns and Dr/Cr presentation |
| Layout | Refactor | Container-fill route; shared bounded report page/panel and report table styles; title/filters/error/contact/totals fixed, exactly one document table-frame scroll owner; all report sections remain together, no nested row scroll |
| Actions | Keep/Extend | Search, Refresh, Print, both Excel exports retained; add Reset current-month defaults and lookup retry; no new financial actions |
| Export | Refactor | Build translated headers at click time; charges-type export remains a presentation grouping of the same authoritative lines, no new request or balance source |
| Wiring | Keep | Existing single report route, menu, root HttpClient/interceptors; no new provider or permission API |
| Shared pieces | Extend | toFilterParams reused by toListParams; optional getSelectList skipErrorInterceptor; shared opt-in fill report layout/table print styles; existing primary button/state message/date picker/money/date helpers adopted |
| Backend/schema | Keep | Read-only contract trace, no backend writes, DTO changes, formulas or migrations |

Rejected: CRUD grid/paging, feature-local palette or filter/total styling, viewport-height subtraction, copying shared date parsing, new backend report API, changing accounting derivations. No unresolved business decision prevents this implementation.

## Frozen contracts and file ownership

### Owner follow-up: section spacing (2026-10-02)

Frozen, source-only, root-owned small change. Explicit owner requests section headings inset from the frame edge and even distribution of tables across unused height. UI 20/21 allow feature-owned section structure while shared frame/table/print styles remain authoritative. Current reference: Accounts/TrailBalance table frame and existing shared report table. Target: one content wrapper, 8px inner padding, 12px minimum section gap and space-evenly distribution with min-height 100%; natural-height sections do not shrink. Long data retains the single outer frame scroll. Wrapper carries sigma-print-flow so print removes its minimum-height bound. No fixed viewport calculation, nested scrolling, row stretching, palette, filter, API or amount changes.

### Owner follow-up: empty preview and reference relocation (2026-10-02)

Status remains Frozen. Explicit instruction supersedes the current-month default for Customer Statement only: initial and Reset dateRange/customerId are null. Required ordered dates and positive customer identity still gate Search. Before search, show existing semantic table headers and empty messages for the selected ledger/outstanding mode; no fabricated response/KPIs/contact/ageing values and no statement API call. Print/export remain successful-report-only. User also authorizes moving the entire unchanged `Reports/TrailBalance` folder into `Accounts/TrailBalance`; preserve the working `/Reports/TrialBalance` URL/menu link and update actual route/provider imports. No unrelated Trial Balance behavior refactor or API/backend changes.

| Concern | Governing evidence | Actual reference/owner | Target conformance |
|---|---|---|---|
| Empty initial document | Explicit owner request; UI 20/22 | Customer Statement existing tables + shared state message | Headers/empty rows always available; successful response alone supplies values/contact/KPIs; mode visibility retained |
| Empty filters | Explicit owner override of UI 17/20 default | Existing date picker/form/search validation | Null date/customer on init/Reset; no auto report request; valid filters still required for Search |
| Feature relocation | Explicit owner request; UI 1 | Reports/reports.routes.ts + LayoutModule import; TrialBalance relative imports | Move five files byte-for-byte to Accounts/TrailBalance; route/provider point to new source; existing URL remains compatible; canonical reference paths follow move |

Small bounded follow-up handled by root; no further delegation. Source-only verification/execution boundary unchanged. Canonical documents used because the new drift check still reports generated recipes stale; generated files remain untouched. Historical references in prior reviews/CHANGELOG preserve their dates; current guide paths are updated.

- Filter: customerId number|string; fromDate/toDate local yyyy-MM-dd; reportType ledger|outstanding; includeInactive boolean. All existing query keys retained, dates inclusive as implemented by backend. Outstanding covers open allocations through toDate; age is backend today-based; do not redefine as-of logic in frontend.
- Response: contact; beginningBalance/totalDebit/totalCredit/endingBalanceTill/currentBalance/outstandingTotal; optional ageingSummary; ledgerLines/deposits/pendingPDCs/advanceTaxInvoiceLines. No fake zero report before search; only successful response supplies output.
- TS worker owns ONLY feature list.component.ts, feature service and stale feature spec. Imports PrimaryActionButtonComponent, StateMessageComponent, DatePickerDirective, MoneyPipe. Public signals: customers, customerOptions, report, loadingReport, errorMessage, hasSearched, selectedReportType, isOutstanding, ledgerLines, deposits, pendingPDCs, advanceTaxInvoices, loadingCustomers, customerLoadError; methods search/refresh/reset/print/exportToExcel/exportChargesTypewise/loadCustomers/formatDisplayDate/balanceDirection/absoluteAmount. Translate error keys at display. All form changes invalidate prior output; inflight guard + disabled form prevents overlap. Current-month defaults, real-date validation and positive integer customer identity. Print/export guard successful loaded data. Build headers on click.
- UI worker owns ONLY feature list.component.html/scss. Use shared report strip; primary Search submit, secondary Refresh/Reset/Print/exports, shared states and MoneyPipe. Keep every existing section/column; no app-data-table. One results `.sigma-report-table-frame.sigma-print-flow` containing ledger+supporting tables. Fixed shared summary bar outside it using existing KPIs only. Tables `.sigma-report-table`; ledger colgroup retained; scope th, titles for truncated text, logical numeric alignment. No feature filter/total/color/print-release CSS; only column sizing/contact/section structure.
- Root owns shared helpers/styles, en/ar additions, plans/review, integration and source-only reconciliation. Shared APIs: `toFilterParams(filters: object): HttpParams`; BaseService `getSelectList<T>(options?: { skipErrorInterceptor?: boolean })`; shared styles `.sigma-report-page--fill`, `.sigma-report-panel`, `.sigma-report-table-frame`, `.sigma-report-table`. The report page class is opt-in; other report consumers remain unchanged.
- All agents preserve peer/user changes, do not edit overlapping files or approved references, and do not run builds/tests/lint/browser/database/migrations/commits/push/deploy. No preemptive tsconfig entries.

## Phases and acceptance

### Owner correction and reference conformance (2026-10-02)

Owner explicitly reinforced `Reports/TrailBalance` for filters, table colours and styling. Initial extraction reused shared classes but changed buttons, introduced zebra/hover rows and reused list panel spacing. These unapproved differences are corrected. No business/API change. Root also owns `shared/components/primary-action-button/primary-action-button.component.scss` for the compact report-strip context; defaults outside report actions remain unchanged. Shared extraction preserves actual Trial Balance values rather than defining a new visual design. Evidence table:

| Concern | Owning block | Actual reference | Shared owner / target match |
|---|---|---|---|
| Panel/title | UI 1/3/20 | TrailBalance list SCSS: page/panel and title rules | Global report shell: 7px page, 16px 14px 14px panel, 6px radius, reference shadow/title margin; container fill replaces legacy viewport subtraction |
| Filters/actions | UI 4/20/24 | TrailBalance list HTML + TS buttons and global report styles | Same report strip, 34px inputs, Refresh/Reset/Excel role colours; shared primary real submit with matching compact dimensions; same two-column narrow action group |
| Dense tables | UI 20 | TrailBalance list SCSS: treetable header/body rules | Shared native report table: identical themed text/surface/rules, 34px header, 30px plain body, 11px type, reference line heights and padding; no added zebra/hover palette |
| Totals | UI 20 | TrailBalance list HTML summary bar | Shared fixed summary above frame, successful response supplies this report's existing KPIs |
| Print/states | UI 21/22 | Shared ReportPrintService / state message / report flow | One results frame; release every bounded layer and white print; one inline failure owner; no feature print/palette rules |

Source-only conformance can be reconciled; visual/runtime acceptance remains pending. The user's maintenance concern adds the same mandatory evidence gate to AGENTS.md, Master 5 and the skill. No extra checklist artifact or execution authority introduced.

Apply maintenance planning, discovery/freeze, report read UI, integration and source reconciliation. Skip entity/write/domain-action phases: frontend-only read document, no state mutation. Root and two bounded workers parallelize logic and presentation after freeze; inherited models due unavailable Terra routing. Owner must build and check ledger/outstanding, inclusive dates and partial ranges, lookup failure/retry, report failure/retry, clearing/changing filters, both exports after language switch, complete multi-page printing, many/empty rows, short/narrow screens, LTR/RTL and light/dark. No migration required.
