# Follow Up Report — feature review

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-02 |

Scope and frozen decisions: [read handoff](<FOLLOW_UP_REPORT_READ_CONTRACT_FREEZE.md>). Source owner: frontend `src/app/modules/Customers/followUpReport`; directly related CustomerService report method and report DTOs; canonical report docs/skill. Working trees already contain unrelated customer/shared/doc modifications; the feature had no existing modifications. No screenshots supplied; user notes and actual source are Explicit evidence. No Missing business rule or new permission mechanism is inferred.

## Findings and pre-implementation conformance

| Concern | Book | Reference/shared owner | Target evidence and initial result |
|---|---|---|---|
| Shell and title | UI 1/3/20 | StatementOfAccount; styles.scss sigma-report-panel; app-feature-title | Legacy follow-up host viewport subtraction, copied palette/panel/title values — finding |
| Filters/actions | UI 16/17/20/24 | TrialBalance; global sigma-report-filter-*; appDatePicker/primary-action | Feature-local strip/buttons, today-only default, showIcon and private date helper — finding |
| Tables/status | UI 5/6/20 | shared DataTableComponent; BalancesSummary column types | Two native tables plus split detail head/body and bespoke promise badge — finding |
| Dataset/totals | UI 20; BE 17 | CustomerService.GetFollowUpReportAsync | Full query ToListAsync, SQL GroupBy.Count, no paging — confirmed |
| Applied filters | UI 20/28 | StatementOfAccount request stream | Template-only disabled controls; retained old results after filter changes — finding |
| Error and recovery | UI 22 | BaseService skipErrorInterceptor; apiErrorMessage | Lookups ignore isSuccess and HTTP error; report duplicates interceptor feedback — finding |
| Output/language | UI 8/21/23 | dataTableExportRows; ReportPrintService | Computed translated export keys become stale; copied print release rules — finding |
| Backend boundary/order | UI 17; BE 17 | Existing CustomerService report boundary | No supplied-filter validity/order guard; equal-date order has no tie-breaker — finding |

Actions: Search and Excel are supported existing actions; Reset and standard Print are canonical low-risk read/output recovery. Create/Edit/Delete/approve/post/selection and state transitions are Not Applicable. Route remains `followUpReport` -> FollowUpReport_Routes -> same standalone component. AuthGuard and inherited controller authorization remain; no mutation authorization candidate exists.

## Final reconciliation

All confirmed in-scope findings and subsequent owner refinements are implemented in source. Two shared Details/Summary tabs replace the provisional collapse layout. Summary now spans the full available width and uses Dashboard-shaped `app-summary-cards`, six metric columns, comparison bars and user drill-down; Details has the shared local paginator and translated page report, and title/filter cards align. The later application-wide shared extraction is frozen in [shared summary card handoff](<REPORT_SUMMARY_CARDS_UI_CONTRACT_FREEZE.md>) and reconciled in [shared feature review](<SHARED_SUMMARY_CARDS_FEATURE_REVIEW.md>). Application/runtime/visual acceptance remains pending; this is not a runtime-verified closure.

| Concern | Final producer/consumer evidence | Result |
|---|---|---|
| Report shape and references | UI Screen 07 / BE Pattern 5; StatementOfAccount bounded shell, TrialBalance filter/action strip, BalancesSummary typed grid, shared DataTableComponent | Matched; all reference source stays outside this task's edits |
| Route, shell and title | Same lazy route/component; sigma-route-host → appReportPage fill → sigma-report-panel; existing sigma-report-panel--aligned-title modifier; toolbar.showPageTitle excludes this route | One title; title/filter card edges aligned; container fill, no viewport subtraction |
| Filter form and transport | All three formControlName bindings belong to the one typed FormGroup; currentMonthRange, appDatePicker range, parseDateRange and focusField; service.getReport uses toFilterParams and the same GET URL | Complete/ordered dates required in UI; local yyyy-MM-dd serialization; optional user/customer; no local parser |
| Form lifetime and reads | form.valueChanges → null report trigger, clearResults and not-run state; Subject/switchMap/defer/finalize plus takeUntilDestroyed; form.disable/enable emitEvent=false | Filters cannot change while a report/print is pending; user edits invalidate output; cancellation/destroy pairs global loading and stops stale output |
| Lookup recovery | Separate caught user/customer requests in forkJoin; declared isSuccess checked; successful sibling options retained; inline warning and Retry; inherited getSelectList skipErrorInterceptor | Both failure channels handled; user filter retains existing exact value string; customer IDs normalized to positive integers |
| Grid producer/consumer | Two mounted typed app-data-table instances, lazy=false, fill=true, scrollable=!printing; Summary paginator=false; Details paginator=!printing, controlled first/rows, full data.length; typed paginationChange → resolveListPaging | Details local paging initially 20 with shared 10/20/50/100 options; tabs retain page/size; Search/filter changes reset offset while preserving size; active grid owns row scrolling; no feature pager |
| Tab/summary presentation | Existing EditorTabs workspace; typed keys, matching IDs, full-array row badges, busy guard; Details initially selected; screen-only inactive-panel hiding; Summary width100%, public full-width route modifier, shared SummaryCardsComponent comfortable/min220/max180 and public grid minimum width860px | Latest full-width and Dashboard shared-card choice supersedes narrow Summary; shared keyboard/theme/focus retained; tab selection performs no request |
| Operational metrics | Named backend Totals DTO; per-user/global SQL counts, distinct CustomerId, promised/upcoming rows over the same query; backend percentage; one server DateTime.Today returned as referenceDate | Four shared KPI cards and presentation-only count comparison bars. Global distinct customers never sum per-user counts; empty query returns zero totals/date; formulas frozen in the read contract |
| User drill-down | Named user secondary button → retainUserOption → exact raw createdBy form value → Search/Details; lookup refresh retains historical selection; blank/null groups plain dash | Existing filter read reused; offset reset; Details panel focus after rendering; busy/printing guards; print uses plain usernames |
| Backend dataset and counts | Tenant/live QueryReport joins; filters before SQL aggregates and complete detail ToListAsync; no Skip/Take or page-size clamp | All metric inputs backend-owned over the complete filtered population, independent of local pagination |
| Validation and ordering | API rejects supplied invalid dates, reversed dates and invalid/nonpositive supplied customer ID; maximum-date inclusive upper bound is guarded; summary User ascending and detail DateTime/Id descending | Existing optional absent API dates retained; stable equal-date detail order; localized business failure |
| Optional report values | IndividualPartner → MemberPartner.MobileNo projection; Contact.MobileNo and Company.Phone1 remain; persisted FollowUp.DateTime? → DTO DateTime? → Angular string|null | Individual mobile fixed; no fabricated DateTime.MinValue; nullable text members match optional persisted values |
| Error/loading/empty state | Inline request headers/errors retained; failures/filter changes clear arrays/totals; success requires additive totals contract; not-run/empty/error distinct | One feedback owner; older API responses cannot produce misleading metric cards; recovery/auth behavior retained |
| Excel and print | Click-time dataTableExportRows for selected complete array/columns; section filename; ReportPrintService/RAF/shared flow; printing passes Details first=0/paginator=false and both scrollable=false | All detail rows exported despite local pager; Summary has six authoritative fields. Print includes KPIs, scope/reference date and every Summary then Details row; selected tab, controlled page/size and form state restored |
| Styling and theme | Shared panel/filter/actions/totals/table defaults; existing aligned-title modifier; structural sizing, public min-width variables and token-colored semantic comparison cells | No copied card/table palette, table internals, ::ng-deep or viewport calc; visual acceptance pending |

### Contract and decision comparison

The response remains `Result<FollowUpReportResponseDto>` and adds `totals` beside `summary` and `details`; the Angular consumer remains `Result<FollowUpReportResult>`. These are report rows, not a CRUD ListVM. Columns and property lists match exactly:

| Grid columns in display order | Angular row properties | Backend DTO properties |
|---|---|---|
| User; Follow-ups; Unique customers; Payment promises; Promise rate; Upcoming follow-ups | user, count, customerCount, paymentPromisedCount, paymentPromisedPercentage, upcomingFollowupCount | User, Count, CustomerCount, PaymentPromisedCount, PaymentPromisedPercentage, UpcomingFollowupCount |
| Customer Code; Customer Name; Mobile; User; Comments; Follow-Up Date; Payment Promised; Next Follow-Up Date | customerCode, customerName, mobNo, user, comments, followupDate, isPaymentPromised, nextFollowupDate | CustomerCode, CustomerName, MobNo, User, Comments, FollowupDate, IsPaymentPromised, NextFollowupDate |
| Global KPI payload | count, customerCount, paymentPromisedCount, paymentPromisedPercentage, upcomingFollowupCount, referenceDate | Count, CustomerCount, PaymentPromisedCount, PaymentPromisedPercentage, UpcomingFollowupCount, ReferenceDate |

- Request keys remain `Filters[fromDate]`, `Filters[toDate]`, `Filters[createdBy]`, `Filters[customerId]`. toFilterParams omits empty string/null/undefined and preserves false/zero if present; the customer boundary independently rejects zero/nonpositive IDs. No paging or sorting request was added.
- Changed response compatibility: FollowupDate admits null rather than a fabricated minimum date; five detail text members and summary User are nullable. Four per-user metrics and a named totals payload are added. Frontend/backend must roll out together because this consumer requires totals; all in-scope producers/consumers were updated.
- Existing createdBy lookup identity is preserved as its exact `value`, rather than inventing an ID-to-audit-name contract. Verify representative user filtering against actual CreatedBy values during owner acceptance.
- Metrics: SQL counts filtered follow-up records and distinct CustomerId globally/per user separately; promises count IsPromised=true records; backend percentage is 100m * promises / records, two-place rounding away from zero, zero for no records. Upcoming is NextFollowup >= one server DateTime.Today, inclusive today, whose yyyy-MM-dd reference date is returned. Repeated follow-ups count separately; no collected/completed/overdue/latest-customer state is inferred. Frontend bar widths compare counts against the maximum for presentation only.
- AutoMapper is Not Applicable to direct projection. Backend owns additive operational aggregates/rates. Entity/EF configuration/transactions/writes stay unchanged. Add-Migration is **not required**; no schema change or migration name.
- Authentication and tenant/live scope retained. User button reuses the existing filter read; no permission API, selection or persisted state transition introduced.
- No screenshots were supplied. Explicit evidence is the owner's written requests and source contracts; the summary layout is a conservative presentation choice recorded in the handoff. No unresolved Missing/Conflicting business requirement blocks the scoped source work. Visual/runtime behavior is Unverified pending owner acceptance.

### Changed files and ownership

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

- `src/app/modules/Customers/followUpReport/components/list/list.component.ts` — typed read/form/columns/output, totals, local Details paging and user drill-down.
- `src/app/modules/Customers/followUpReport/components/list/list.component.html` — shared aligned title/filters, tabs, KPI cards, six-column Summary and paginated Details.
- `src/app/modules/Customers/followUpReport/components/list/list.component.scss` — responsive bounded Summary, structural KPI sizing and semantic comparison cells.
- `src/app/modules/Customers/followUpReport/models/list.ts` — nullable date and additive metric/totals interfaces.
- `src/app/modules/Customers/followUpReport/services/followUpReport.service.ts` — shared filter serialization and inline-error header.
- `src/app/modules/i18n/vocabs/{en,ar}.ts` — lookup/search/summary hints, metric labels, reference-date scope and accessible user action (11 task keys).
- `src/app/_metronic/layout/components/toolbar/toolbar.component.ts` — scoped duplicate-title exclusion.

Backend repository: `F:/My Work/Sigma/SigmaBackend`.

- `SiGma.Business/Services/Customers/CustomerService.cs` — GetFollowUpReportAsync validation/order/optional values and SQL metrics/backend percentages only.
- `SiGma.Helpers/Reports/CustomerReports/FollowUpReportResultDto.cs`, `FollowUpReportSummaryDto.cs`, `FollowUpReportResponseDto.cs` and new `FollowUpReportTotalsDto.cs` — nullable values and additive metric/totals contract.
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx` and `GeneralMessage.ar-SA.resx` — FollowUpReportInvalidFilters.

Documentation repository: `F:/My Work/Shaban Documents/Shaban`.

- `sigma-erp/ui/06-grid-and-footer.md` and `20-report-page.md` — mandatory shared report tables, full vs paged transport, independent bounded panes, shared palette, hierarchy/completeness and totals ownership.
- `sigma-erp/ui/screens/07-report.md` and `00-catalog.md` — report/reference navigation.
- `sigma-erp/ui/00-preamble.md` and `CHANGELOG.md` — rule/history through version 1.51.
- `sigma-erp/recipe-system/generated/PLAN-00-maintenance-evolution.md` and `PHASE-00` through `PHASE-06` — generator-produced derivatives, never hand-edited.

Workspace instruction/review artifacts outside the application Git repositories:

- `F:/My Work/Sigma/.agents/skills/sigma-screen-refactor/SKILL.md` — §6.1 digest and revision rows synchronized with owning UI blocks.
- This review and `FOLLOW_UP_REPORT_READ_CONTRACT_FREEZE.md`.

Only the follow-up report service method and this task's translation/resource/doc deltas are attributed here. Other existing customer reports, shared controls, titles, documentation policies and backend methods already have independent changes in the working trees. They were preserved. CustomerService's task delta was also compared against a pre-edit temporary snapshot to distinguish those edits from this report's changes.

### Phases and source-only verification

Phases applied: 0 discovery/evidence; 1 read/API freeze; 2 read/grid implementation; 5 route/provider/interceptor integration comparison; 6 final reconciliation. Phases 3 and 4 were skipped because this screen has no record editor, persistence command or domain transition. No maintenance plan or bulk report conversion was added.

Git roots were verified separately for frontend, backend and canonical documentation. Scoped source differences were reviewed separately; no unrelated cleanup was made. Final source checks:

- Frontend/backend/documentation scoped `git diff --check`: passed; Git's LF-to-CRLF notices are repository normalization notices.
- `Check-Translations.ps1 -Block reports`: 208 keys in each language, zero missing keys or case-only differences.
- Both changed report resource files parse as XML and contain exactly one FollowUpReportInvalidFilters key each.
- Scoped conflict-marker scans: no matches. No stale feature DatePipe/TableModule/private date parser/native table/any/table-internal styling remains. New imported shared symbols and typed column/template/input contracts were compared against their actual source.
- `Generate-SigmaRecipes.ps1 -Check`: all eight PLAN/PHASE packets OK after generator regeneration. `Check-BookReferences.ps1`: all checked references resolve.
- Existing route/root client/service/controller/QueryReport scope remain wired. No runtime Angular file added, so explicit tsconfig.app.json needs no change. The named backend DTO uses the existing SDK project's default compile items; no project/config change needed.

Documentation discrepancy recorded during review: PHASE-05 still contains an older LayoutModule/feature-client provider instruction despite its current fingerprint. Canonical UI 1 and actual AppModule own the one root interceptor client; this task follows those sources and adds no feature HttpClient fork. A separate packet-governance correction remains outside this feature's source work. Existing native reference report tables remain compatibility consumers until those reports' own scoped reviews.

Potential compile/runtime risks remain unverified: Angular templates/types, EF translation of Individual projection and distinct/conditional aggregates, metric scope/empty/reference-day behavior, coordinated frontend/backend rollout, actual audit usernames, narrow-window pane height, pager restore, themes, full Excel and print/cancel restoration. No further contract/schema change is established by source.

### Owner acceptance

1. Open `/followUpReport` in both languages/themes and a narrow window. Verify aligned title/filter card edges, exactly Details/Summary tabs with full row-count badges, Details initially selected, Summary at logical start with responsive 960px maximum, four KPI cards and six columns. Check mouse/Arrow/Home/End, focus and panel semantics. Only active grid scrolls; tabs make no requests. Reset/filter edits select Details; same-filter Search retains selection.
2. Verify initial/reset current-month dates, valid manual/picker ranges, partial/invalid/reversed dates, customer/user filters and end-day inclusion. During a delayed report, controls/output stay guarded; after editing filters, old output is cleared until successful Search.
3. Exercise HTTP and declared report/lookup failures, sibling lookup success and Retry. Confirm one inline message, usable Search after recovery and distinct not-run/empty/error states. Empty results must disable Print and Excel.
4. Compare every per-user metric/global total against complete filtered records. Include one customer followed by multiple users (global distinct count must not sum per-user counts), repeated promises, zero promises/records, null/before/today/future NextFollowup and rounded percentages. Check server reference date and no collected/completed inference. Include all three partner phone types, nullable fields, equal-date stable ordering and tenant/auth scope.
5. Use more than 20 Details rows. Verify bottom pager and 10/20/50/100 sizes, no HTTP on paging, retained page/size across tabs, zero offset after Search/filter/Reset/drill-down with size retained. Click known/historical Summary user, check exact filter value and Details panel focus; lookup Retry retains historical selection. Blank/null groups have no action.
6. Change language, export each tab and compare complete arrays/headers/formatting/order (six Summary/eight Details) irrespective of Details page. Empty selected sections disable Excel. Print long reports from both tabs and a later detail page: KPI/reference text, every Summary then Details row, plain usernames, hidden tabs/pager, no clipping and restored selection/page/size/form after print/cancel/failure. Confirm updated backend deployed with frontend.

### Agent utilization and delivery

Root owns discovery/freeze, every application-source edit, integration decisions, scoped diff review and this final reconciliation. One bounded `luna_explorer` subagent, `report_docs` using `gpt-5.6-luna` with high reasoning, owned only the canonical UI report blocks/navigation/history, skill §6.1 and generator-produced packets after the shared handoff was Frozen. Parallel documentation work reduced source-work wait time at lower model cost without overlapping application files. Root reviewed and requested bounded corrections for native-table exceptions, independent viewports, fictional summary inputs, shared palette and complete/paged transport; all were reconciled. No other agent was spawned for application work.

Root implemented all source refinements. The existing bounded documentation agent was reused after the professional contract froze, then reconciled the owner's paging/alignment steering in the same 1.51 draft. UI 6/20 and skill §6.1 record shared adoption; exact formulas remain feature-owned. Packets regenerated. Root reviewed component/model/vocab/DTO and isolated CustomerService metric deltas against pre-metric snapshots, plus final guide adoption. The additive read DTO/aggregate changes require no entity/schema/shared-control extension. Provisional collapse edits were restored earlier; unrelated user changes preserved. Runtime acceptance pending.

Suggested commits only, one per affected Git repository:

- Frontend: `feat(follow-up-report): add summary metrics and paginated details`
- Backend: `feat(follow-up-report): return authoritative operational metrics`
- Documentation: `docs(ui-book): require shared data tables in reports`

No builds, tests, lint, browser/application verification, database commands, migrations, model-snapshot changes, commits, pushes, deployment, Graphify or Sigma MCP actions were run. Build/runtime/database/browser verification remains pending for the owner under the project's execution boundary.
