# Cash Deposits list workstream

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-05 |
| Handoff | `CASH_DEPOSITS_CONTRACT_FREEZE.md` |
| Scope | Existing CashDeposit list TS/HTML/SCSS/spec only; root owns API/models/routes/translations/editor and integration |

## Authority and packet state

Read the Sigma AGENTS entry point, required sigma-screen-refactor skill, frozen feature handoff and maintenance plan. Canonical UI1/3/4/5/6/7/8/9/21/22/28 own this slice; the approved list reference is `Workshop/Job/components/list`, with actual FilterPanel, DataTable, EditorDialog, ConfirmationDialog, ReportActions and ReportPrint owners inspected. The root's initial recipe check is historical: this workstream's repeat `Generate-SigmaRecipes.ps1 -Check` on 2026-10-05 reported PHASE02/03/04/05 stale; plan/00/01/06 passed. Canonical books governed affected work. Generated files were not edited; regeneration plus semantic review remain pending.

## Files and result

- `SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDeposit/components/list/list.component.ts`: completes typed list queries, applied state, route restore/return, lookups/retries, actions, complete export and report lifecycle.
- `.../list.component.html`: replaces the legacy ms-lib wrapper with approved shared shell, four visible filters and one server-paged shared grid. The report is a read-only shared EditorDialog with a separate complete shared grid and fixed shared print toolbar.
- `.../list.component.spec.ts`: removes the obsolete scaffold that instantiated the unrelated `widgets-examples/lists/ListsComponent`; no replacement mirror test was written or executed.
- `.../list.component.scss`: remains empty; component metadata uses no feature stylesheet. Shared owners supply all list, filter, grid, state and dialog appearance.

Parent-owned model/service/route/translation changes are consumed rather than duplicated. No reference module, shared component, backend or unrelated source was changed by this workstream.

## Final contracts and conformance

| Concern | Book / reference owner | Final target comparison |
|---|---|---|
| Page/header | UI1/3; Job list, global shell, FeatureTitle | `sigma-route-host` → `sigma-list-page` → `sigma-list-panel` → header/title/table, fill grid; no page height arithmetic, local card chrome or duplicate toolbar title |
| Filter shape | UI4; Job, FilterPanel | `form[appFilterPanel]`, stableLayout true, mainColumns 4; No, dual-month Date Range, Account(bankId), Branch all visible; shared Reset and projected actions; Date reserves validation feedback |
| Table/paging | UI5/6; Job, DataTable, resolveListPaging | typed `CashDepositListRow`/`DataTableColumn`; dataKey id; API count, page15 default, 10/15/20/50/100 choices; restored/page-event size capped100; resolution precedes signal writes; same query skips, forced retry refreshes |
| Sorting | UI5/6 | whitelist derives from sortable columns both for lazy events and URL restoration; `bankName` remains visible but unsortable because navigation-sort support is not proven; scalar fields No/Date/RefNo/Description/Amount/CreatedBy/CreatedAt/ApprovalStatus use confirmed generic sorting |
| Request lifetime | UI28; Job list | switchMap/defer list stream cancels superseded page/search/refresh; report has its own switchMap/defer stream, close emits null and cancels all-pages fetch before clearing data; all subscriptions tear down on destroy |
| Read feedback | UI22; StateMessage, apiErrorMessage, service skip-header reads | declared and transport failures stay inline; failed list clears rows/count, required lookup failure remains visible with retry; auxiliary lookup busy is local; screen-level start/end paired via finalize |
| Actions | UI7/9; ConfirmationDialog and frozen state matrix | View/Edit/Print/Approve/Unapprove/Void/Unvoid/Delete use real row id and explicit literal translation configurations; confirmations name record and interpolate no; pending confirmation/busy/loading gate mutation controls; confirmed callback re-resolves identical current row and repeats availability check |
| Mutation feedback | UI22; global interceptor | declared false and transport callback retain rows/applied query and restore busy; no duplicate feature error/success toast; successful action refreshes applied filters/sort, deleting the sole last-page row steps back one page |
| Export | UI8; Job, fetchAllPages, dataTableExportRows | all pages of copied applied filter/sort query through parent service; no file after any page failure; export count expectation captured at click; translated grid headers/formatted money/date/status values resolved on export completion in current language |
| Report/print | UI6/21; EditorDialog, ReportActions, ReportPrint session | copied applied query used for initial load and retry; header/body show applied filters and returned count; report columns suppress links/local sorting and retain same data formatting; unpaged complete grid, outer shared scroll owner; print isolation uses sigma-report-print-dialog + sigma-dialog-print, bounded layers sigma-print-flow; close/print guarded during preparation |

Business columns: `no`, `date`, `refNo`, `description`, `amount`, `bankName`, `createdBy`, `createdAt`, `approvalStatus` (rendered state prefers void). Actions add the first automatic Actions column. ListVM match: those columns plus `id`, `isPosted`, `isVoided` needed by actual state guards. No tenant/base/editor lookup IDs are needed in the row.

Filters: trimmed No → no; one validated local day range → dateFrom/dateTo; positive nullable selected/restored IDs → bankId/branchId. Blank date range means no date filter, URL dateRange=all preserves that choice; default/Reset restores current month. Search resets page1; lazy paging/sort/forced retry retain the applied snapshot even when the user has unsubmitted field edits. Editor and row-print navigation carry the same state back to the list. No authorization API is invented.

## Source audit and pending acceptance

Reviewed the complete scoped TS/HTML/spec diff against the existing repository and reread the final source after integration fixes. `git diff --check -- <CashDeposit/components/list>` passed; only Git's configured LF→CRLF normalization warning was emitted, with no whitespace error. A scoped search found no `table-list`, `ms-lib`, `ListCol`, `ColType`, explicit any, interpolated action/mode translation paths, merge markers, direct window.print or feature DOCUMENT/body lifecycle. Shared public input/output and service method signatures were compared to actual source. Source formatting expanded multi-statement blocks through the already installed TypeScript printer; this was an edit operation, not compilation or runtime verification.

EN/AR feature vocabulary is root-owned. Count and record-number interpolations were reconciled against the root's final vocabulary: report subtitle receives count; delete and transition messages/subtitle receive no. The report stream passes the root-owned getAllList optional errorKey as `cashDeposits.errors.report`, while ordinary Excel uses its export default.

Owner must verify compilation; initial/page-size/page/sort/search/Reset and return-state behavior; fast paging and error retries; failed bank/branch lookups; stale/pending confirmation cancellation; draft/approved/voided availability and server failure retention; all-pages Excel and interrupted report fetch; full print/cancel; LTR/RTL, dark/light and narrow layouts. Source conformance does not establish visual/runtime acceptance. Existing cross-service accounting/concurrency and Round off decisions remain with the root/frozen feature artifact, outside this bounded list implementation.

No build, test, lint, browser/application verification, migration, database command, commit, push or deployment was run. No schema change is introduced by this workstream. Suggested frontend commit subject, for root integration only: `Refactor cash deposit list and complete applied-filter outputs`.
