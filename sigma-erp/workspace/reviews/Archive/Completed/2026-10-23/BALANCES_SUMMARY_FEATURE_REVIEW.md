# Customer Balances Summary — Feature Review

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-02 |
| Scope | `src\app\modules\Customers\BalancesSummary`, full screen canonical refactor |
| Repository / branch | `SiGmaAngularFrontEnd` |
| Guides | `SIGMA_FEATURE_REVIEW_MASTER.md`; UI blocks 1, 3, 4, 5, 6, 8, 13, 16, 17, 22, 23, 24, 25, 27, 28; Backend pattern 5; `sigma-screen-refactor` skill |

## Owner follow-up: balance Range From/To — 2026-10-03

Later owner compact Range correction (2026-10-03), Status: Implemented — source-only; owner verification pending yes. Frozen in BALANCES_SUMMARY_READ_CONTRACT_FREEZE.md, compact presentation amendment. Pre-edit conformance: UI4 actual FilterPanel advancedColumns/breakpoints and Workshop Job projection; UI19 FieldError invalid/touched/dirty visibility and optional reservation; requested Supplier template uses three single-column fields with no hidden error/hint space. Final Customer template passes advancedColumns=3, removes Balance Type's wide span and conditionally mounts the existing FieldError hosts for invalid touched/dirty child controls or the order-error group, without reserveMessage. Removed the full-width hint row, both obsolete aria-describedby references and the unused balancesSummary.balanceRangeHint key in en/ar. StableLayout, three fields on shared wide/medium columns, natural mobile stacking and actual readable feedback remain. Earlier original implementation's hint/reservation evidence below is historical.

Focused source reconciliation: Customers/BalancesSummary/components/list/list.component.html and src/app/modules/i18n/vocabs/en.ts/ar.ts are the only application files changed in this follow-up. Angular template and both dictionaries parse with zero syntax errors; the actual balancesSummary object block retains all four bound/error keys and has no hint key. Template has three advanced columns, no reserved error host or stale hint reference. TypeScript source confirms existing required/finite/order controls, markAllAsTouched on invalid Search, mode-dependent request bounds and Reset defaults are unchanged. Frontend Git root verified, complete scoped three-file diff reviewed, diff --check passed; unrelated working-tree edits preserved. Initial translation inspection selected a same-named scalar navigation caption; corrected source inspection selects ObjectLiteralExpression blocks and reports one complete block per language. No application code was changed for that inspection correction. All eight recipe checks passed before use.

Owner verifies More Filters and All -> Range -> All at wide/medium widths in Arabic/English, valid/required/reversed/corrected bounds and narrow stacking. Actual errors may expand naturally; pristine/valid fields reserve no empty height. No visual/runtime/build acceptance claimed. Phase2 presentation and focused final source reconciliation only; backend/transport/ListVM/DTO/AutoMapper/domain calculation/routes/schema/migration unchanged. No Add-Migration or reusable guide/skill update needed. Root handled the small sequential change without subagents; no build/test/lint/browser/runtime/database/migration/commit/push/deployment/Graphify/Sigma MCP run. Suggested frontend commit only: `style(customer-balances): keep range filters compact`.

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Owner requests Range From/To in Customers Balance Summary search, then asks to continue |
| Contract | BALANCES_SUMMARY_READ_CONTRACT_FREEZE.md, owner amount-range extension |

The existing shared More Filters panel now reveals Balance From/Balance To when Range is selected. Both fields are required for UI Search, accept finite signed numbers and allow equal endpoints and zero. Shared FieldErrorComponent supplies required/number/order feedback; an invalid Search opens More Filters and marks the controls touched. The translated hint explains positive debit, negative credit and inclusive limits. Switching modes keeps draft values but sends no effective bounds outside Range; Reset clears them and reloads defaults/page1. The fields remain in the original filterForm when the advanced template is closed.

The existing Customer/BalancesSummary endpoint accepts optional Filters[balanceFrom]/Filters[balanceTo]. Its invariant-decimal parser rejects missing, blank, malformed, overflow and reversed supplied pairs in Range mode, using a localized business failure before any data query. Bounded Range applies `balanceFrom <= Balance <= balanceTo` at the existing balance-filter stage before totals/count/order/paging. Both keys absent retain historical nonzero Range for older callers. Other balance modes ignore the bounds. The controller already returns BadRequest on declared failure and the frontend's existing inline read-error owner consumes it. No new endpoint, service, permission, posting rule or monetary calculation.

| Concern | Final source / shared reference reconciliation |
|---|---|
| UI shape / ownership | Frozen paged-summary/list exception retained. UI4 Workshop/Job appFilterPanel and actual shared FilterAdvancedDirective projected template compared; no feature filter CSS. Two labelled native number inputs reuse the shared field geometry/34px height, with FieldErrorComponent per UI19. |
| Form / validation | Typed number-or-null controls and conditional ValidatorFn validate presence/finite values only in Range. BalanceType subscription updates both validators; FormGroup validator enforces order. The template's @if, control bindings, IDs/labels/aria-invalid/hint and shared errors match those symbols. |
| Query / output scope | UI2/8/20/28 and BE9/17: BalancesSummaryFilter optional numeric members feed existing toFilterParams (null omitted, zero retained). getListItems snapshots valid bounds; pagination and getAllBalancesSummary/fetchAllPages export reuse appliedFilters. CustomerService parses the same names and filters the authoritative signed balance before TotalBalance/TotalCount and Name/CustomerId paging. |
| Grid / response | Grid action/code/name/contactPerson/mobile/contactNo/email/salesPerson/balance retains existing PartnerBalanceSummaryDto plus customerId identity and compatibility formattedBalance/balanceType. No CRUD ListVM or response change. |
| Mapping / calculations / schema | No AutoMapper, entity, EF, transaction, write DTO, route/provider or migration change. Existing posted/nonvoid AR calculation and inclusive date cutoff retained. Range filters the calculated result rather than changing ledger math. |
| Verification | Full owned FE feature diffs, balancesSummary translation hunks and four BE diffs reviewed separately in their actual Git roots. Scoped diff --check passed; no merge markers. Parser inspected4 feature TS files and1 HTML template plus both vocabulary files: no syntax errors,73 balancesSummary leaves per language, no missing/duplicate/parity differences. Both resource XML files parse, with exactly one nonempty CustomerBalancesSummaryInvalidRange key per language. No compilation/runtime/visual or database acceptance claimed. |

Owned source files: frontend BalancesSummary components/list/list.component.html, components/list/list.component.ts, models/list.ts and the balancesSummary blocks in i18n/vocabs/en.ts/ar.ts; backend CustomerService.cs summary method, CustomerBalancesSummaryDto.cs request documentation and GeneralMessage.resx/GeneralMessage.ar-SA.resx. The service serializer/export implementation already supports the additive keys and requires no edit. Earlier Staff/sidebar/Statement/shared-style work and owner-created migration/snapshot edits were preserved.

Phase01 additive filter contract, Phase02 producer/consumer implementation and focused source reconciliation applied. Detail/write/domain-action implementation phases skipped because this is a read-only filter. No screenshot supplied or unresolved new business decision. Eight packet drift checks passed before implementation; no reusable rule/helper was introduced, so no book/skill change was needed. Root handled this small tightly coupled extension without subagents. No build/test/lint/browser/application/database/migration/snapshot/commit/push/deployment/Graphify/Sigma MCP action was run. Add-Migration is not required for this extension.

Owner acceptance pending:

1. More Filters → Range: search positive, negative, mixed-sign and decimal bounds. Confirm both boundary amounts included, zero included for0→0, and equal nonzero endpoints accepted.
2. Search empty/one-empty/reversed bounds and invalid numeric input: inline errors, no report request. Close More Filters with invalid bounds and search: it must reopen. Verify the API rejects a single supplied, malformed, blank or reversed pair.
3. Search from a later page: reload page1 with authoritative filtered totals/count. Export more than200 filtered customers and compare every row and total scope with the report. Change a bound while results exist: old rows/totals/export must invalidate.
4. Switch to All/Debit/Credit: retained draft bounds must be omitted/ignored. Reset clears both, restores all/current month and reloads page1. Older direct Range calls with neither key retain nonzero filtering.
5. Confirm signed-balance hint, errors and layout in English/Arabic, RTL, both themes and narrow widths; compile the frontend/backend and verify both request failure channels. Unusually large finite JavaScript amounts outside decimal capacity are rejected by the backend rather than clamped.

Suggested commits: frontend `feat(balances-summary): add balance range search controls`; backend `feat(balances-summary): filter signed balance ranges before totals`. Suggestions only; no commit made. Historical review below describes the earlier contract and is superseded only by the explicit amount-range amendment above.

## 1. Feature Review Manifest

- **Screen Name:** Customer Balances Summary (`Customers/BalancesSummary`)
- **Route:** `/BalancesSummary` (lazy-loaded in `src/app/pages/routing.ts`)
- **Screen Type:** 01 List with modal editor / read-only summary list (UI screen catalog `00-catalog.md`)
- **Backend API:** `GET Customer/BalancesSummary` (`CustomerBalancesSummaryRequestDto` -> `CustomerBalancesSummaryResponseDto`)
- **Statement Service:** `CustomerStatementOfAccountService.getStatement(CustomerStatementFilter)`

## 2. Conformance Table

| Concern | Book block | Reference file / symbol | Shared owner | Target match |
|---|---|---|---|---|
| Page shell & host | UI 1 | `Workshop/Job/components/list` | `.sigma-route-host`, `.sigma-list-page`, `.sigma-list-panel` | Matched; host class set, no page scroll, container-fill |
| Header & title | UI 3 | `Workshop/Job/components/list` | `app-feature-title` | Matched; inside primary panel, 8px alignment |
| Filter panel | UI 4 | `Workshop/Job/components/list` | `form[appFilterPanel]` (`FilterPanelComponent`, directives) | Matched; 6 main controls, choice radio under More filters, mandatory Reset, 34px controls |
| Date range filter | UI 17 | `Workshop/Job/components/list` | `p-calendar` (range, 2 months, no icon, typeable) | Matched; `currentMonthRange()`, `parseDateRange()`, `[keepInvalid]="true"` |
| Grid & pagination | UI 6 | `Workshop/Job/components/list` | `app-data-table [fill]="true"` | Matched; server paging, typed lazy load, `DEFAULT_PAGE_SIZE = 20`, sort whitelist |
| Paginator report | UI 6 | UI block 6, backlog 37 | `currentPageReport` format | Matched; `showingEntries` updated to `{first}`, `{last}`, `{totalRecords}` in en/ar |
| Summary totals | UI 20, styles.scss | `Accounts/openingBalances` | `.sigma-report-summary-bar` | Matched; themed, responsive summary bar with `.sigma-report-total` |
| Statement dialog | UI 13 | `shared/components/agreement-history-dialog` | `app-editor-dialog`, `app-data-table` | Matched; `mode="view"`, `[primaryActionVisible]="false"`, bounded inner table |
| Failure handling | UI 22 | `Workshop/Job` | `apiErrorMessage()`, `LoadingService` | Matched; both failure channels (`isSuccess: false` and `error`), loader finalize |
| SCSS & tokens | UI 24, 25 | `styles.scss` | Canonical `--sigma-*` tokens | Matched; 886 lines of bespoke CSS eliminated; 0 rogue colors |

## 3. Transformations

1. **Page Architecture:**
   - Removed legacy `app-balances-summary { height: calc(100dvh - ...); }` and custom outer container padding.
   - Adopted canonical `.sigma-route-host`, `<section class="sigma-list-page">`, and `<div class="sigma-list-panel">`.
2. **Filter Panel (`form[appFilterPanel]`):**
   - Replaced bespoke 65-line `.balances-filter-grid` with `form[appFilterPanel]`.
   - Set 6 main row filters: Date Range, Branch, Customer Type, Customer, Sales Person, Customer Status.
   - Placed Balance Type radio choices in `ng-template[appFilterAdvanced]`.
   - Added Export to Excel and Search button inside `ng-container[appFilterActions]`.
   - Standardized date range with PrimeNG dual month calendar (`selectionMode="range" [numberOfMonths]="2" [readonlyInput]="false" [keepInvalid]="true"`), defaulting to `currentMonthRange()`.
   - Added mandatory Reset handling via `(resetRequested)="resetFilters()"`.
3. **Data Table (`app-data-table`):**
   - Replaced hand-built HTML `<table>` and hand-built pager (`.balances-pager`) with `<app-data-table [fill]="true">`.
   - Integrated typed columns (`DataTableColumn<BalancesSummaryItem>`) with formatted balance.
   - Added row action and row interaction (`(rowActivated)`) to open customer statement of account.
   - Grounded paginator with `DEFAULT_PAGE_SIZE = 20` and fixed PrimeNG report placeholders.
4. **Totals Summary Bar:**
   - Displayed `totalBalance` using shared `.sigma-report-summary-bar` with 8px margin alignment.
5. **Statement of Account Modal:**
   - Replaced `<p-dialog styleClass="balances-statement-dialog">` with canonical `<app-editor-dialog>` (`mode="view"`, `[primaryActionVisible]="false"`).
   - Replaced inner statement table with `<app-data-table>` (`[lazy]="false"`, `[paginator]="true"`, `[rows]="10"`).
   - Formatted beginning, ending, and current balances inside `.sigma-report-summary-bar`.
   - Error messages presented via `<app-state-message kind="error">`.
6. **Styles (`list.component.scss`):**
   - Eliminated 886 lines of bespoke SCSS, removing hardcoded hex colors (`#25aaa8`, `#2587c5`), manual table/pager rules, and duplicate theme blocks.
   - Retained only 62 lines of scoped layout rules for the modal filters and summary alignment.

## 4. Column & Filter Contracts

### Main Grid Columns
| Field | Header Key | Type / Value | Sortable |
|---|---|---|---|
| `code` | `balancesSummary.code` | text / `—` fallback | Yes |
| `name` | `balancesSummary.name` | text / `—` fallback | Yes |
| `contactPerson` | `balancesSummary.contactPerson` | text / `—` fallback | Yes |
| `mobile` | `balancesSummary.mobile` | text / `—` fallback | Yes |
| `contactNo` | `balancesSummary.contactNo` | text / `—` fallback | Yes |
| `email` | `balancesSummary.email` | text / `—` fallback | Yes |
| `salesPerson` | `balancesSummary.salesPerson` | text / `—` fallback | Yes |
| `balance` | `balancesSummary.balanceAmount` | formatted currency (Dr / Cr) | Yes |

### Statement Modal Columns
| Field | Header Key | Type / Value |
|---|---|---|
| `date` | `balancesSummary.date` | formatted date (`formatDisplayDate`) |
| `voucherType` | `balancesSummary.voucherType` | text / `—` fallback |
| `voucherNo` | `balancesSummary.voucherNo` | text / `—` fallback |
| `debit` | `balancesSummary.debit` | `money` |
| `credit` | `balancesSummary.credit` | `money` |
| `runningBalance` | `balancesSummary.runningBalance` | formatted currency (Dr / Cr) |

## 5. Verification & Safety

- **Source-Only Verification:**
  - `git status` and `git diff` reviewed.
  - No merge markers, syntax errors, or unused imports.
  - Net diff: -960 lines across 7 files.
  - Added runtime files to `tsconfig.app.json` explicit `files` array.
- **Prohibited Commands:**
  - No build, test, lint, migrations, or database commands were run.
- **Pending Verification for Owner:**
  - Visual check in browser (light and dark theme).
  - Runtime verification of pagination, filters, and Statement dialog.

## 6. Follow-up audit and paging contract — 2026-10-02

The owner asked to review their edits, then authorized a suitable shared prevention for the page-size defect and an update of documentation and generated packets. The earlier conformance claims above are historical; this audit supersedes the affected claims below, without treating shared class names as proof of query behavior.

| Field | Value |
|---|---|
| Paging handoff | Frozen |
| Authorized implementation | Shared paging calculation, BalancesSummary adoption, cancellation of superseded page requests, owning UI block and skill, generated packets |
| Other audit findings | Review only; no implementation authorized in this follow-up |
| Verification | Source only; owner build/runtime/visual verification pending |

### Evidence and conformance before implementation

| Concern | Owning block | Actual reference / shared owner | Initial finding / agreed target |
|---|---|---|---|
| Paging calculation | UI 6 | Workshop/Job list `onLazyLoad`; shared `utils/list-query.ts` | BalancesSummary updates pageSize before comparing it. Extract pure `resolveListPaging(event, previous)`; compare previous state before any signal writes, including a size-only change on page 1. Adopt here; other screens adopt when reviewed, no bulk scan. |
| Requests | UI 28, 22 | Workshop/Job `bindListQueries`, Subject/switchMap/defer | Current loading guard discards a new paging request after pager state is mutated. Use the existing trigger-stream pattern; latest valid page request cancels earlier HTTP and releases its loading count. |
| API | BE 17, UI 2 | CustomerService `GetCustomerBalancesSummaryAsync`, CustomerBalancesSummary DTOs | Keep Filters dictionary and PageNumber/PageSize transport, Result.entity wrapper, backend totals covering all filtered customers, backend page clamping. No backend change or invented sort support. |
| Screen shape | UI catalog, 1, 4, 6, 13 | Job list; VehicleService dialog; TrailBalance only for report chrome | Type 01 read-only paged summary list plus view-only statement dialog; backend pattern 5 report. It has server paging and a row workflow, so do not force the unpaged Type 07 layout. |

### Remaining confirmed observations (review only)

1. Export contains only `data()` for the current server page (`list.component.ts:195,499`); totals describe the full filtered population. This predates the user's rewrite. UI 8 requires all pages and failure handling.
2. Sort is local to one returned page (`list.component.ts:168,254`); the API always orders by Name before paging (`CustomerService.cs:1471`) and accepts no implemented sort parameter. This predates the rewrite. Enable global sorting only after matching backend support, or remove unsupported sort affordances.
3. The statement subtitle is set only from the originally clicked row (`list.component.ts:398`; HTML:219). Selecting another customer in the dialog and refreshing loads that customer under the old customer's name. New subtitle regression.
4. The date directive is imported but absent from all three calendars (HTML:24,240,255); the modal also uses separate From/To controls. UI 17 requires shared date behavior and a single two-month range picker. No form validators protect incomplete masked dates. Existing convention debt remains.
5. Main report failures are presented inline and by the global interceptor: the summary service supplies no X-Skip-Error-Interceptor header; component sets its own message. UI 22 requires one error owner. Statement service already suppresses the interceptor correctly. Existing debt.
6. Statement and main totals render zero while no successful result exists (HTML:178,306; TS:505), including failed requests. Gate financial values on a successful snapshot rather than converting unavailable amounts to zero. Existing behavior.
7. Customer-type/status labels and the action title are translated once; export object keys are memoized without a language dependency. Switching language can leave these captions in the previous language. Existing labels/export debt; new action adds another cached caption.
8. The SCSS `app-balances-summary .sigma-report-summary-bar` selector cannot match the host under default encapsulation after ViewEncapsulation.None was removed; use the proper host selector or the shared owner. New alignment regression.
9. Close is silently ignored during statement loading, while the shared dialog's close buttons remain enabled (TS:430; HTML:216). Bind its supported busy/close state or support cancel-on-close. New behavior.
10. Lookup forkJoin has no HTTP error handler; one failing endpoint prevents committing the other successful option lists. The global interceptor presents the failure, but the subscription still has an unhandled error. Existing debt; use explicit failure handling and recovery per UI 22.

Paginator text was inspected in both vocabularies: current placeholders are {first}, {last}, {totalRecords}, and are compatible. The range balance filter is already defined by the backend as nonzero balances; it is not a missing numeric min/max API. The balance is cumulative through toDate, not period-only activity; preserve this accounting rule.

### Authorized repair and final reconciliation

| Field | Value |
|---|---|
| Repair status | Implemented — source-only |
| Remaining review status | Draft; recommendations above remain unimplemented except observation 8 |
| Owner verification pending | yes |

The owner additionally requested the total card above the grid have the same width as the filter card. The ineffective host-name selector was replaced by `.sigma-list-panel > .sigma-report-summary-bar`, with 8px logical inline margins matching the actual shared filter panel. This fixes observation 8 for the main card and does not inset the separate dialog summary.

| Comparison | Final source evidence |
|---|---|
| Page/size calculation and previous-state comparison | Shared `utils/list-query.ts:resolveListPaging`; BalancesSummary `onLazyLoad` captures state before writes and requests whenever `paging.changed`. |
| Size-only change on page 1 | Manual source trace: previous page 1 / size 20 plus first 0 / rows 50 returns page 1 / size 50 / changed true; request uses 50. This is a reasoning trace, not an executed test. |
| Identical state | Manual source trace: previous page 1 / size 20 plus first 0 / rows 20 returns changed false; handler skips an identical sort too. |
| Page conversion | Manual source trace: first 40 / rows 20 returns page 3. |
| Latest valid request | `listQuery$` + switchMap/defer; cancellation finalizes the previous loader before starting the next. HTTP errors are handled inside the inner stream, so another request remains possible. takeUntilDestroyed tears down the complete chain. |
| Response metadata | Existing backend totals preserved; response pageNumber and pageSize reconcile the grid with server clamping. No backend calculation or endpoint changed. |
| Card width | Main summary 8px inline margin equals FilterPanelComponent's 8px inline margin; encapsulation now matches its own descendant elements. Actual visual acceptance remains pending. |
| Documentation ownership | UI 6 and skill §4.1/revision history updated; UI version 1.34 and changelog. No new competing shared component or change to existing DataTable event contracts. |
| Packet semantics | Phase-02 template had legacy filter/Transitional-fill guidance despite the newer books. Reconciled all its related occurrences with shared shell/filter/table ownership, all-pages export, Job reference and required paging helper. Manifest references updated and missing UI 17/20 fingerprint dependencies added. |

Generated all eight packets with Generate-SigmaRecipes.ps1, then its -Check returned OK for all eight. Scoped approved-reference paths exist. Scoped whitespace checks passed; no merge markers found in the feature/shared utility. Preserve all other user changes. No build, tests, lint, browser/app execution, database commands, migrations, commits, or pushes were run. Runtime acceptance scenarios: change 20 to 50 on page 1, advance pages, switch pages rapidly, retry after a failed page request, and inspect total/filter card edges in light/dark and RTL.

Other follow-up findings remain review observations, not silently included fixes. This artifact supersedes the earlier unconditional Grid/error/date conformance claims with the evidence above. Full export, backend sorting, customer subtitle synchronization and shared date adoption remain material recommendations.

## 7. Confirmed repairs and final reconciliation — 2026-10-02

The owner now requested review of `src/app/modules/Customers/BalancesSummary` and repair of errors found, then asked to continue. This authorization supersedes section 6's review-only limit for the confirmed findings. The before-edit contract is `reviews/Archive/Completed/2026-10-23/BALANCES_SUMMARY_READ_CONTRACT_FREEZE.md` (Frozen). Historical decisions above remain intact; the following evidence describes the current implementation.

| Field | Final status |
|---|---|
| Implementation | Complete for confirmed scoped repairs; source-only verification |
| Owner verification pending | yes — build, runtime and visual acceptance |
| Screen classification | Existing Type 01 paged read summary plus view-only statement dialog; backend pattern 5 report |
| Screenshot evidence | None supplied; no screenshot-derived requirements or unresolved Missing/Conflicting/Uncertain business decisions |
| Phase 0 / 1 | Discovery, owning books/reference comparison, recipe drift check, contract freeze |
| Phase 2 | Summary grid, paging, filters, report service and complete export |
| Phase 3 | Read-dialog lifecycle and presentation only; no create/update/delete workflow |
| Phase 4 | Skipped: no additional business workflow or new entity |
| Phase 5 / 6 | Route/provider/shared-component wiring, lifecycle integration, scoped source reconciliation |
| PLAN-00 | Not applicable to these bounded confirmed repairs; existing owners are reused |

### Repairs and source conformance

| Finding / owning block | Current source evidence and result |
|---|---|
| Current-page export — UI 8/20 | `BalancesSummaryService.getAllBalancesSummary` adapts the existing `Result.entity` payload to shared `fetchAllPages`; requests 100 rows/page within the backend clamp. `exportToExcel` writes only after all pages succeed. Failure has inline feedback and retry remains possible; no partial workbook is written. Export consumes the applied filter snapshot and current-language `dataTableExportRows`. |
| Unsupported local sort — UI 2/6, BE 17 | Removed sort signals, local row sorting, obsolete sort type and all sortable column flags. Existing backend order remains Name; CustomerId now breaks equal-name ties before Skip/Take. No invented sort request parameter. |
| Statement customer identity — UI 13/20/28 | Customer form changes clear old output and update selected identity/name; a successful statement response supplies `contact.name`. A different customer cannot retain the previous customer's subtitle when its lookup name is unavailable. |
| Dates — UI 17/20 | Both calendars use `appDatePicker`, one two-month range each. Shared `parseDateRange`, form-invalid checks, complete dates and ordering guard HTTP reads. Opening a statement converts API date strings to local midnight; no UTC shift from parsing a bare date string. |
| Result lifetime — UI 20/28 | Form edits cancel the corresponding stream and clear rows/totals/result state. Paging and export use the last valid applied filters. Busy form disable/enable uses `emitEvent: false`; cancellation/finalize releases local and global loading. |
| Financial states — UI 20 | Summary totals require `hasResult`; statement totals require a successful statement object. Failed, initial and edited states do not display fabricated financial zero. A successful empty response retains its backend zero. |
| Error ownership — UI 22 | Summary/export service sends `X-Skip-Error-Interceptor`; statement service already does so. Components own inline business/HTTP errors via response.message / apiErrorMessage. Query errors stay inside switchMap so a later request works. |
| Lookup failures — UI 16/22 | Each lookup catches its own HTTP error; forkJoin commits other successful results. Aggregate failure is visible with Retry in the page and dialog; no unhandled subscription error. Previous successful options are retained on a failed retry. |
| Language and formatting — UI 5/16/23 | Numeric enum options keep Individual=0/Company=1; `translateOptions` resolves labels after language changes. Action title stays a translation key. Export headers resolve at completion. Shared `formatMoney` uses two decimals/Latin digits; debit/credit direction is translated. Statement dates use the shared date column type. |
| Summary width — UI 3/4 | Prior owner-approved `.sigma-list-panel > .sigma-report-summary-bar` with logical 8px alignment remains. Removed feature-local modal layout/table/spinner CSS after adopting shared owners. |
| Close during read — UI 13/28 | Close/escape cancels statementQuery, clears output and hides the dialog. A canceled/superseded HTTP request cannot replace the next customer's data. |
| Statement paging — UI 6/20 | Local pager starts at shared size 20, retains size, resets offset on a new read/filter, and adapts `DataTablePaginationEvent.pageSize` into `resolveListPaging`. This fixes the public event mismatch. |
| Dialog scroll/layout — UI 13 | Shared padded editor form/body/scroll chain owns the bounded dialog's only scroll region. Its table has `scrollable=false`; no nested fixed-height table viewport or route-height calculation. Actual RTL/narrow/dark acceptance remains pending. |
| Duplicate title — UI 3 | `ToolbarComponent.showPageTitle` excludes `/BalancesSummary`, whose primary panel already has `app-feature-title`. No other toolbar route or style is changed. |
| Empty metadata — UI 2/6 | Backend's empty-population shortcut returns zero paging metadata. FE normalizes pageNumber to 1 and retains the requested positive pageSize. |
| Misleading test source | Deleted the copied spec that imports/tests `widgets-examples/ListsComponent`; it never verified this screen. No replacement test or test execution is claimed. |

### Column, filter and calculation decisions

There is no CRUD ListVM in this report. The row contract is `PartnerBalanceSummaryDto`, projected in `GetCustomerBalancesSummaryAsync`.

| Main grid / export field | Backend row property | Final presentation |
|---|---|---|
| code | Code | text, em dash fallback |
| name | Name | text, em dash fallback |
| contactPerson | ContactPerson | text, em dash fallback |
| mobile | Mobile | text, em dash fallback |
| contactNo | ContactNo | text, em dash fallback |
| email | Email | text, em dash fallback |
| salesPerson | SalesPerson | text, em dash fallback |
| balance | Balance | shared money formatting with translated debit/credit direction |
| Row identity/action | CustomerId | existing statement-of-account drill-down; excluded from data export |
| No grid column | FormattedBalance, BalanceType | Backend wire members retained; unused FE declarations removed |

Statement columns remain Date, VoucherType, VoucherNo, Debit, Credit and RunningBalance against the corresponding `StatementLedgerLine` properties. Debit/Credit use shared money columns; RunningBalance uses the same direction formatter.

- Filters remain date range, branch, customer type, customer, sales person, status and balance type. `range` is nonzero balances, so its Arabic/English caption now says that; no numeric min/max API is added.
- Backend owns tenant/live-customer/AR-account scope, posted nonvoid ledger selection, debit-minus-credit balance, inclusive toDate cutoff, totalBalance and totalCount before pagination. Balance remains cumulative through toDate; fromDate validates the interval and seeds the drill-down. No accounting formula is changed.
- Existing GET routes, dictionary filter keys, PageNumber/PageSize, DTO wrappers, authentication, HttpClient/interceptors and provider boundaries are preserved. No new endpoint or authorization policy.
- AutoMapper: no mapping change; these report DTOs are projected by the service. Domain persistence/schema: no change. **Add-Migration is not required.**
- Architecture/shared extraction: reuse `fetchAllPages`, `toFilterParams`, `resolveListPaging`, shared grid formatter, enum/translation helpers, date directive, filter/report actions and editor dialog. No new local paging/export utility. No new reusable guidance was established, so no book/skill/packet modification in this repair pass.

### Files owned by this repair pass

Paths below are relative to `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- `src/app/modules/Customers/BalancesSummary/components/list/list.component.ts`
- `src/app/modules/Customers/BalancesSummary/components/list/list.component.html`
- `src/app/modules/Customers/BalancesSummary/components/list/list.component.scss`
- `src/app/modules/Customers/BalancesSummary/components/list/list.component.spec.ts` (deleted copied unrelated test)
- `src/app/modules/Customers/BalancesSummary/models/list.ts`
- `src/app/modules/Customers/BalancesSummary/services/balances-summary.service.ts`
- `src/app/_metronic/layout/components/toolbar/toolbar.component.ts` (only BalancesSummary title exclusion)
- `src/app/modules/i18n/vocabs/en.ts` and `ar.ts` (only balancesSummary keys/caption in this pass; other existing translation edits preserved)

Backend: `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Customers/CustomerService.cs`, only the Name/CustomerId summary ordering. Other pre-existing and concurrent changes in this file and unrelated screens remain outside this repair's ownership.

Artifacts: this append-only reconciliation and `F:/My Work/Sigma/reviews/Archive/Completed/2026-10-23/BALANCES_SUMMARY_READ_CONTRACT_FREEZE.md`.

### Verification, limits and handoff

- Confirmed actual FE/BE Git roots; reviewed the complete scoped FE diffs, scoped translation hunks and the complete summary-method BE hunk separately. Other existing/concurrent diffs are preserved and are not reported as this task's work.
- Scoped `git diff --check` passed in both repositories. No feature merge markers, obsolete local-sort symbols or console calls found. Direct consumers, shared input/event types, standalone imports, route/provider wiring and unchanged response properties were traced in source.
- `Check-Translations.ps1 -Block balancesSummary`: en=65, ar=65, missing in either vocabulary=0, case-only differences=0. Generated recipe drift check was OK for all eight packets; no generated packet was edited in this pass.
- Source reconciliation does not establish compiler/runtime/visual acceptance. No build, tests, lint, browser/app execution, database commands, migrations, commits, pushes, deployment, Graphify or Sigma MCP was run.
- No agents were used: the fixes share one component's state/lifecycle and a small service adapter; they do not meet the independent-workstream delegation gate.

Owner manual verification:

1. Load an empty result and a populated result. Totals should appear only for success, remain authoritative across pages, and disappear on filter edits/failure. Empty result page metadata should stay valid.
2. Change main page size 20→50 on page 1, advance pages, switch pages quickly, and retry after a failed page. Equal-name customers should stay in stable order.
3. Export a filter with more than 200 customers from a later grid page. Check all filtered rows and current-language headings; fail a later export request and confirm no partial file, then retry.
4. Enter complete, incomplete and reversed date ranges by typing and picker selection. Check Individual=0, company/status/balance filters, and the nonzero balance caption against the existing backend behavior.
5. Open customer A's statement, change to B and refresh; check subtitle, lines and backend totals. Close during loading, then open C; old responses must not reappear. Change statement size 20→50, navigate, and refresh/change filters to reset offset.
6. Fail each lookup independently, verify other options survive and Retry recovers. Verify each report failure has one visible feedback owner and loading ends.
7. Switch Arabic/English without reloading; check enum/action captions, money direction and Excel headers. Inspect light/dark, RTL and narrow viewports for one dialog scroll region, aligned cards and one page title.

Suggested commits (suggestions only; do not include unrelated working-tree changes):

- FE: `fix(balances-summary): correct export and statement state`
- BE: `fix(balances-summary): stabilize customer report paging`
