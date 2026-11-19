# Customer Statement frontend review contract — 2026-10-02

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Authorization | Review `src\app\modules\Customers\StatementOfAccount` and fix issues if found |
| Scope | Existing frontend report and its English/Arabic labels; directly related API and shared pieces inspected as contract evidence |

## Manifest and authority

Tier M, UI type 07 Report; Backend Pattern 5 semantics remain on the existing Customer service/controller (compatibility exception, no new CRUD/report service). Follow Master 1–7, UI 1–3/5–6/8/13/16–17/20–30, BE 17 and checked PHASE-00/01/02/05/06 packets. Recipe -Check: all eight OK. Phase-05's old Layout-owned HttpClient wording conflicts with current UI 1: current canonical AppModule root client wins; no provider fork or manual bearer header is added.

Existing `CUSTOMER_STATEMENT_MAINTENANCE_EVOLUTION_PLAN.md` and historical sections of `CUSTOMER_STATEMENT_FEATURE_REVIEW.md` record owner decisions for null initial/reset filters, section tabs, filling shared grids, independent local paging, selected-section Excel, full-report print and neutral export buttons. Those decisions are preserved. This task does not change business capabilities and needs no new maintenance plan. No screenshots, videos or new business requirements supplied. Existing TS/HTML/SCSS, shared components/styles, translations and unrelated frontend/backend changes are uncommitted; preserve them. Root owns this correction; no parallel writes.

## Read and filter contract

| Control | Typed value | Query key | Actual backend producer/parser | Rule |
|---|---|---|---|---|
| Date range | Date[] / string / null | Filters[fromDate], Filters[toDate] | CustomerService.GetCustomerStatementAsync / FilterHelper.GetDate | Null initial/reset; shared parseDateRange, complete ordered dates required before request; backend inclusive end day |
| Customer | number / string / null | Filters[customerId] | same method / GetInt; Customer.SelectAsync | Null initial/reset; positive safe integer; lookup returns all live Individual/Company customers, including inactive |
| Mode | ledger / outstanding | Filters[reportType] | same method / GetString | Ledger initially; preserve existing mode-dependent sections/columns |
| Include inactive | boolean | Filters[includeInactive] | same method / GetBool | False initially; includes inactive customers alongside active ones, not inactive-only |

GET Customer/GetSelect returns Results<DropDownSelect>. GET Customer/Statement returns Result<CustomerStatementResponseDto>. Services use environment.baseUrl, the application interceptor client, and X-Skip-Error-Interceptor for one inline error owner. No write payloads, mutations or confirmation dialogs. AuthGuard protects the layout; backend controller inherits authorization. No fabricated permission mechanism; restricted mutation inventory is not applicable.

The endpoint ignores inherited PageNumber/PageSize: statement lines, deposits, pending PDCs and advance-tax lines materialize all matching rows without Skip/Take or a clamp. Independent local first/rows use their full array lengths, DEFAULT_PAGE_SIZE and resolveListPaging. Print disables every local paginator/scroll boundary and prints every mode-applicable section after a render frame; afterPrint/false-return restores state. Excel uses selected full arrays/current columns via dataTableExportRows, current-language labels, and no request. Grouped export keeps the existing debit/credit/due formula and raw voucher-type grouping identity.

## Response and columns (report DTOs, no ListVM)

| Section | Grid field order / frontend model | Corresponding backend DTO members |
|---|---|---|
| Ledger | date, voucherType, voucherNo, description, age, poNo, allocations, debit, credit, dueAmount (outstanding only), runningBalance | Date, VoucherType, VoucherNo, Description, Age, PONo, Allocations, Debit, Credit, DueAmount, RunningBalance |
| Advance tax | Ledger fields except poNo | CustomerStatementLedgerLineDto, same conditional dueAmount |
| Deposits | depositNo, type, date, agreementNo, amount, used, refunded, refundDate, status | DepositNo, Type, Date, AgreementNo, Amount, Used, Refunded, RefundDate, Status |
| Pending PDC | chequeNo, chequeDate, bank, amount | ChequeNo, ChequeDate, Bank, Amount |
| Ageing | p1_0_30, p2_31_60, p3_61_90, p4_91_120, p5_121_150, p6_151_180, p7_181_Plus, balance | P1_0_30 … P7_181_Plus, Balance; nullable AgeingSummary |

Numbers and totals remain backend-owned: beginning balance before fromDate; ledger totals within the range; outstanding balances/allocations through toDate; current balance across posted non-void AR lines; ageing based on backend Today and the existing buckets. Deposits and pending PDCs retain their current whole-customer scope, independent of the date range. No DTO fields removed, AutoMapper changes, calculation changes, schema changes or migration.

## Pre-edit evidence and frozen corrections

| Concern | Book block | Actual reference / shared owner | Target source evidence and correction |
|---|---|---|---|
| Bounded layout and actions | UI 1/3/20/24–25 | Accounts/TrailBalance list HTML/SCSS; report-page/report-actions; styles.scss | Existing sigma-route-host/report-page--fill/report-panel/frame; shared title/strip/totals, neutral action variants; keep feature SCSS structural only |
| Grid/paging | UI 5/6/20 | DataTableComponent and BalancesSummary list currentPageReport | Five lazy=false/fill grids use complete arrays/independent offsets; add customerStatement.showingEntries to all pagers with valid placeholders |
| Nullable response | UI 20/22 | CustomerStatementResponseDto.AgeingSummary, backend creates summary only for outstanding | ageingRows currently fabricates zeros when null; return no rows instead, success gates export |
| Failure vs empty | UI 6/20/22 | DataTableComponent.showEmpty; BalancesSummary binds !errorMessage | Current failed report presents no-data alongside inline error; suppress table empty text on failure, distinguish not-run from successful empty supporting sections |
| Language | UI 16/20/23 | Backend VoucherTypeName/DepositStatus enum strings; dataTableExportRows | Known voucher/status labels currently raw English in Arabic. Translate known identities at display/export time with feature keys, keep unknown values and customer-configured payment names verbatim; clarify includeInactive label |
| Read lifetime | UI 22/28 | filterForm.valueChanges, search/takeUntil/finalize | Existing invalidation/cancellation, disabled reactive form, inline lookup recovery and two-tier loading retained |
| Print and tabs | UI 13/20/21/27 | ReportPrintService; EditorTabsComponent; DataTableComponent.scrollToStart | Existing headings print-only, all applicable panels retained, render-frame preparation/cleanup; preserve state and add consistent print busy guards on screen actions |

Confirmed corrections only; no Missing/Conflicting business requirement blocks them. Backend algorithm changes are outside this frontend correction handoff. Record any separately discovered backend risk without silently rewriting accounting behavior.

## Recorded amendments — 2026-10-02

The separate [backend correction handoff](CUSTOMER_STATEMENT_BACKEND_CONTRACT_FREEZE.md) freezes source-supported report calculation/boundary fixes under the original review-and-fix authorization. Refunded widens from decimal/number to nullable decimal/number; the only consumer renders null as a dash in the grid, print and Excel. Existing routes, filters, section arrays and field names remain compatible. See that handoff for paired allocation reconciliation and refund provenance rather than treating the original no-calculation-change statement above as the final scope.

Print busy guards also disable the reactive filter form without emitting changes during preparation/printing. The shared service's afterPrint callback and false-return path restore controls and the lookup-dependent customer disabled state, preventing a filter edit from clearing the document being printed. No new print infrastructure or page slicing.

Final source reconciliation is in CUSTOMER_STATEMENT_FEATURE_REVIEW.md. Initial/pre-implementation packet checks passed all eight; later documentation changes made seven packets stale at final check (Phase 01 still passes). Current canonical blocks govern final verification; generated files are untouched and require documentation-owner regeneration/semantic review. No contract correction is left unimplemented; build/runtime/accounting and visual acceptance remain pending.

## Owner filter-row amendment — 2026-10-03

Owner requests the first two filters (Date Range and Customer) together with Report Type in one row. Freeze this presentation-only change: a full-width wrapping flex row inside the existing report filter form holds exactly those three fields, in the existing order. The existing Include Inactive checkbox and report-action toolbar follow on the next row. Narrow widths retain shared stacking/wrapping; this instruction does not require overflowing controls on a small screen.

| Concern | Book / actual reference | Shared owner / target match |
|---|---|---|
| Report strip and field geometry | UI4 semantics/UI20 report strip; Accounts/TrailBalance list HTML; styles.scss sigma-report-filter-panel/field/check | Keep the same report strip, surfaces, labels and34px control sizing. Existing Bootstrap d-flex/flex-wrap/align-items-end/gap-2/w-100 utilities group the three fields; mw-100 on each lets their existing equal flex sizing occupy the row rather than stop at300px. No feature filter CSS. |
| Report Type options | Existing Statement template reportType radiogroup and ledger/outstanding controls | Keep the same labelled radiogroup/PrimeNG controls and values; existing flex/wrap/gap utilities put its options alongside one another when width permits. |
| Form and workflow | UI20 conditional-control/form and applied-filter invariants; actual filterForm/search and appReportActions | All four controls remain under the same formGroup and submit contract. Include Inactive/actions remain after the full-width row; busy/error/print/export behavior and API filters remain unchanged. |

PHASE-02 recipe drift check passed all eight before this amendment. Only frontend filter presentation and scoped source reconciliation apply. No backend, schema/migration, DTO, mapping, calculation, translation or permission change. No new screenshot or unresolved business requirement. Final source conformance and owner visual acceptance are recorded in the feature review.

### Owner blue-accent and row-spacing follow-up — 2026-10-03

Owner requests the normal Sigma blue for Report Type and a small gap between the filter rows. Keep the existing PrimeNG radio controls, form values and first-row arrangement. Add the opt-in shared `sigma-report-filter-choice` class to this radiogroup; styles.scss owns its selected/hover/focus states using `--sigma-primary`, `--sigma-primary-hover` and `--sigma-control-focus-ring`. Current Lara theme source hard-codes a different blue, so changing a native accent property or parent text colour alone cannot meet this request. Only this opted-in group adopts the rule; other report radios remain unchanged. Shared UI20 and the skill digest document the capability, without creating feature-local filter CSS.

Use existing Bootstrap `row-gap-3` on this form for0.75rem between its two rows (the actual Metronic spacer map), retaining the first row's own gap-2 and shared narrow-width wrapping. Reference evidence: UI20 report strip/styles.scss, UI24 token definitions (`--sigma-primary` resolves#3498db), installed primeng theme radiobutton rules and Bootstrap row-gap utility definition. No hard-coded feature palette or API/business change. Source-only reconciliation remains in the feature review.
