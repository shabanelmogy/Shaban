# Balances Summary — read contract

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-02 |
| Authorization | Owner: review `Customers/BalancesSummary` and fix errors found |
| Scope | Existing summary list, statement read dialog, report service and deterministic summary ordering only |

This handoff preserves the prior feature review's frozen paged-summary/list presentation exception. Backend pattern 5 (report); UI shared list shell and filter panel with a view-only statement dialog. No new report layout, writes, permissions or accounting rules.

## Confirmed contracts

- `CustomerService.GetCustomerBalancesSummaryAsync`: `GET Customer/BalancesSummary`, `Result<CustomerBalancesSummaryResponseDto>`, dictionary `Filters` and `PageNumber`/`PageSize`. Clamp size 1–200 and page 1–totalPages; totals are for all filtered customers before slicing.
- Summary grid: action → code, name, contactPerson, mobile, contactNo, email, salesPerson, balance. Response row DTO supplies those plus customerId, formattedBalance and balanceType. The latter presentation fields remain wire-compatible; unused Angular fields may be removed. No CRUD ListVM, writes, mapping or persisted derived properties.
- Filters: fromDate/toDate (local yyyy-MM-dd, current-month default, ordered complete range); nullable branchId/customerId/salesPersonId (integer); customerType Individual=0/Company=1; customerStatus active/inactive; balanceType all/debit/credit/range. Range means nonzero balance, not min/max. Balance is cumulative through inclusive toDate; fromDate validates the interval and seeds the statement drill-down.
- Summary order is Name, then CustomerId before Skip/Take; unsupported interactive page-local sorting is removed rather than inventing a new API sort contract.
- Search captures a valid applied-filter snapshot. Paging and full export consume it. User filter edits cancel obsolete reads and invalidate rows/totals/export. Busy state disables reactive forms with emitEvent=false.
- Excel uses shared fetchAllPages through an adapter for entity.items/pageNumber/pageSize/totalCount/totalPages; request size 100 (below clamp). Any failed page fails the action with no partial file. Shared dataTableExportRows uses the same columns and current-language headers.
- Statement: existing GET Customer/Statement, customerId, fromDate/toDate, reportType=ledger, includeInactive=true. Complete ledgerLines and backend beginning/ending/current totals; one range picker replaces split date controls. Customer selection/read response updates subtitle. Closing cancels the active read; a superseded request cannot replace another customer's output. Local pager retains size, resets offset on filter/search, uses shared default 20.
- Financial totals require a successful current response. Absent response displays no invented zero. Valid empty response retains its authoritative zero.
- Inline summary/export/statement/lookup messages own errors and send X-Skip-Error-Interceptor. Lookup requests fail independently, preserve other successful options and have a visible retry.
- Single route /BalancesSummary; existing root services/AppModule HttpClient interceptors retained. AuthGuard is authentication only; no invented authorization mechanism.

## Before-edit evidence and conformance

| Concern | Owning block | Reference symbol | Shared owner | Initial defect / target |
|---|---|---|---|---|
| List shell/filter/grid | UI 1/3/4/6 | Workshop/Job list template and bindListQueries | sigma-list classes, FilterPanelComponent, DataTableComponent | Preserve existing frozen exception, main grid fill and action workflow; no copied filter/table CSS |
| Report dataset/export | UI 2/8/20; BE 17 | CustomerService.GetCustomerBalancesSummaryAsync; Job export | fetchAllPages, dataTableExportRows | Current-page export and local-only sort; full applied result and deterministic server ordering |
| Form validity/lifetime | UI 17/20/28 | Customer Statement filter-form path; Job query stream | DatePickerDirective, parseDateRange, switchMap/defer | Directive absent, split statement dates, output survives edits; use shared guards, one range, cancel/invalidate |
| View dialog | UI 13/22/28 | Fleet/VehicleService details template; EditorDialogComponent | app-editor-dialog, shared editor scroll chain | Subtitle stale and close ignored; response/selection identity, cancel-on-close, shared content padding |
| Formatting/language | UI 5/16/23 | data-table.format; TranslateOptionsPipe | formatMoney, translateOptions, enumOptions | Cached translated captions and browser-locale money; resolve active language/shared formatting |
| Errors/lookups | UI 16/22 | CustomerStatementOfAccountService.getStatement; BaseService.getSelectList | skip header, apiErrorMessage, app-state-message | Duplicate summary feedback and unhandled forkJoin error; independent recoverable inline failures |

## Boundaries and existing changes

Existing translations, shared table/tabs, styles/config and unrelated customer screens are modified by the owner/other work. Preserve them. CustomerService already has changes only in ReceivableAgeAnalysis; preserve those exactly, changing only summary ordering. No screenshot supplied. No missing business decision blocks these repairs. No new reusable rule: all repairs adopt already documented shared capabilities.

Phases 0/1 freeze, 2 read/grid/export, 5 wiring/lifecycle, 6 reconciliation apply. Phase 3: only view-dialog checks, no writes. Phase 4 and PLAN-00 not applicable to bounded confirmed repairs. No build/tests/lint/browser/DB/migrations/commits/pushes/deployment. Root performs tightly connected fixes without subagents; independent implementation slices are too small to justify coordination.

## Frozen integration correction — 2026-10-02

Final source tracing confirms `ToolbarComponent.showPageTitle()` admits /BalancesSummary, while `PageInfoService.calculateTitle()` gets its active sidebar title. The screen already owns app-feature-title inside its panel. UI 3 requires suppressing this duplicate. Add /BalancesSummary only to the toolbar exclusion list; no toolbar spacing or other route changes. `DataTableComponent.paginationChange` emits `DataTablePaginationEvent.pageSize` (not TableLazyLoadEvent.rows); the statement consumer adapts this public event to resolveListPaging. These are confirmed wiring repairs under the existing owner request.

## Owner amount-range extension — 2026-10-03

Status: Frozen; owner verification pending: yes. Owner asks for Range From/To in Customers Balance Summary search. This supersedes the earlier UI-only nonzero Range meaning when bounds are supplied. Existing UI list-shell/paged-report compatibility exception and backend Pattern5 remain. Extend the existing advanced filter and report method in place; create no parallel screen/service/schema. Impact: filter form/model/request serializer, existing CustomerService summary parser/filter, localized validation and applied-query paging/export. Keep ledger calculations, cutoff, tenant/customer selection, row fields, dialog and authorization.

| Decision | Frozen contract / evidence |
|---|---|
| UI | Balance Type remains in shared More Filters. Range selection reveals two native number fields Balance From/Balance To, both required for UI Search, without invented defaults or currency/precision rules. FormArray/editor/write workflows do not apply. Shared app-field-error handles required/number/order feedback; opening/closing More Filters never removes validation or values from the parent typed filterForm. |
| Amount semantics | Inclusive signed balanceFrom <= Balance <= balanceTo, applied to the existing authoritative debit-minus-credit balance. Positive is Dr, negative Cr; show that explanation beside fields. Zero and equal endpoints are allowed; do not take absolute values, swap reversed endpoints or clamp negatives. This reviewer decision uses the existing Balance wire value and debit/credit sign branches, not a new accounting calculation. |
| Query | Add optional decimal Filters[balanceFrom]/Filters[balanceTo]. Only effective with balanceType=range; other modes omit them from UI requests and backend ignores them. Both absent preserves nonzero Range for older callers. If either key is supplied in Range mode, both must parse as invariant decimals and from<=to; reject partial, blank, malformed, overflow or reversed bounds with localized business failure. |
| Output scope | Apply bounded Range at the existing balanceType-filter position before TotalBalance/TotalCount/order/Skip/Take. Paging and complete fetchAllPages Excel use the same immutable applied filters; date/branch/customer/status/salesperson scopes stay unchanged. No page-local range filtering. |
| State | Bound edits/type changes retain existing cancellation/result invalidation. Switching mode retains draft bounds but excludes them from effective queries; Reset clears both and restores all/current month/page1. Existing busy disable/enable API remains. |
| Compatibility | Response DTO and grid action/code/name/contactPerson/mobile/contactNo/email/salesPerson/balance stay unchanged, with customerId identity; no ListVM, Add/Update DTO, AutoMapper, entity, persistence or migration change. Older Range callers retain historical behavior; UI label changes to Range. |

Pre-edit conformance: UI4 shared FilterPanel/Workshop Job projection; UI19 FieldErrorComponent; UI20 actual applied-query lifetime; BE9 actual FilterHelper.GetDecimal; BE17 actual CustomerService.GetCustomerBalancesSummaryAsync before-total balance switch and existing response metadata. Phases01/02 and focused source reconciliation apply; no writes/domain actions. Eight recipe checks passed; no new screenshot or unresolved posting/authorization/data-destruction decision. Root owns the small tightly coupled producer/consumer extension; no subagents. Build/runtime/visual/database acceptance remains owner-pending.

## Owner filter-stability amendment — 2026-10-03

Owner reports positions moving while typing and extends the correction to Supplier/Staff summaries. BALANCE_SUMMARY_FILTER_LAYOUT_CONTRACT_FREEZE.md freezes this later presentation follow-up; its FEATURE_REVIEW records implementation/source checks. Customer bounds/validators/query semantics above stay unchanged; the main form opts into shared stableLayout and FieldError reserves its existing order-message geometry. Visual/runtime acceptance pending.

## Owner compact Range presentation amendment — 2026-10-03

Status: Frozen; owner verification pending yes. Owner asks for the same Range height correction in Customers/BalancesSummary as Suppliers. Supersedes the earlier Customer hint/reserved-error presentation only. UI4 approved shared FilterPanel/Workshop Job advanced projection, actual advancedColumns input and three-column/one-column breakpoints support three one-column fields; set advancedColumns=3 and remove Balance Type's wide span. UI19 shared FieldError supports content-sized feedback: mount the existing child/group error hosts only when invalid and touched/dirty, omit reserveMessage to avoid hidden height and empty-host gap. Remove the extra full-width explanation row, both aria-describedby references and its unused balancesSummary.balanceRangeHint key in en/ar. Supplier's owner-directed compact template was compared as requested scope evidence, not a replacement canonical pattern. Keep shared stableLayout, responsive mobile stacking, bounds/validators/Search touch behavior and all applied-query/paging/export/print/dialog/backend/API/calculation contracts. Actual errors can expand and must stay readable. No shared CSS, new guide rule, backend/schema/migration change; existing dirty files preserved. All eight recipe drift checks passed. Focused Phase2/source reconciliation only, no subagents or prohibited commands; visual/build/runtime pending.
