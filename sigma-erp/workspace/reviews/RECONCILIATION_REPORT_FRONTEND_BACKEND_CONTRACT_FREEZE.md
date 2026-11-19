# Reconciliation Report — read/UI handoff

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-06 |
| Authorization | “راجع : src\app\modules\Banking\ReconciliationReport وطبق التعديلات طبقا للوثائق” |

## Manifest and boundaries

Scope: existing Banking/ReconciliationReport component, model, service, route; its EN/AR block and toolbar title suppression; only GetReconciliationReportAsync in backend AccountReportsService. Existing service/vocabularies/toolbar changes belong to earlier work and must be preserved. Target feature files have no pre-existing changes. Evidence E1: C:/Users/user/Desktop/Banking/Reconciliation/1.PNG, English LTR desktop historical-list state; role, capture date/version and acceptance status Unknown.

UI20/21 report with a justified read-only row Print action, no CRUD/editor; UI6 controlled local presentation paging of a proven complete array. Approved references: Accounts/TrailBalance configuration and actual Accounts/shared/report-family shell; Customers/StatementOfAccount list for complete-array pagination/output; Workshop/Job list for typed columns/actions/cancellation. Backend pattern5, existing AccountReports service/controller, not generic CRUD. No PLAN-00 required for the confirmed read/UI repairs; changed ledger derivation or destructive workflow is excluded pending its separate contract. Phases0/1/2/5/6 apply; Phase3 N/A; Phase4 delete slice blocked.

## Endpoint and response

GET AccountReports/ReconciliationReport, SpecificationRequestDto.Filters: fromDate/toDate local yyyy-MM-dd and optional bankId. Results<ReconciliationReportLineVm>.entities is complete: current method has no Skip/Take/page clamp. No server paging/sorting request. Backend read changes permitted: QueryReport, direct SQL projection, deterministic StatementDate descending/Id descending, inclusive calendar-day upper bound. Preserve current response fields and arithmetic; no write/schema/AutoMapper change. No changes to BankReconciliation completion.

Columns beside response properties: Actions(Print only), date:date ↔ Date, bankName:text ↔ BankName nullable, reconciledBalance:money ↔ ReconciledBalance, pendingEntriesBalance:money ↔ PendingEntriesBalance, ledgerBalance:money ↔ LedgerBalance. Id is stable row identity; existing IsReconciled backend wire property retained for compatibility but not consumed by the grid. No column filter or sortable flag. Excel includes the five data columns, no action/identity/state/audit properties; translated headers and shared date/money formatting resolved at click time. Preserve signed values rather than introducing Dr/Cr notation absent from this contract.

## Filter and state contract

| Control | Type | Query/backend key | Default/validation |
|---|---|---|---|
| dateRange | Date[] \| string \| null | Filters[fromDate]/Filters[toDate]; FilterHelper.GetDate | currentMonthRange(); required + dateRangeValidator; parseDateRange before Search |
| bankId | number \| null | Filters[bankId]; FilterHelper.GetInt | null means all banks; positive selected id from Bank/GetSelect |

Bank optional is a reviewer decision (owner standing rule): backend already supports absence and E1 shows all-bank results with an empty selector; reject keeping ineffective legacy required bank validation. Lookup uses Results<DropDownSelect>, optionLabel=value/optionValue=id; failure has one inline owner, retry, Search blocked until successful lookup. No full bank graphs.

One switchMap/defer read stream; disable reactive form without emit during reads/print, finalize restores form and loaders on success/failure/cancel. User filter edits clear output/applied snapshot and reset offset; Reset restores current month/all banks and not-run state without an unfiltered request. Paging is local only, DEFAULT_PAGE_SIZE15 and 10/15/20/50/100; resolveListPaging before writes. Complete report Print/Excel use loaded applied snapshot independently of local page. Row Print uses exactly the selected loaded row and the same five columns, with no invented detail endpoint; shared print session restores page/size/form/row target on cancel/completion. Failed reads clear output; entered filters retained, repeat Search recovers. No confirmation for read-only output.

## Integration

Verified parent URL /reconciliationReport (pages/routing.ts), child empty route export BankReconciliation_Routes. ReconciliationReportService stays root-provided through the existing interceptor-equipped HttpClient and environment.baseUrl. Read and lookup requests carry X-Skip-Error-Interceptor for inline failure ownership. No new providers/client/authorization mechanism. Single title inside primary report panel; exact parent path excluded from toolbar.

## Unresolved business evidence

Delete Reconciliation is Explicit in E1 but Missing in API/action contract: no DELETE route exists in AccountReports and no generic BankReconciliation controller/service was found in the scoped inventory. It changes which journal lines are eligible for future reconciliations. Do not invent soft-delete/cascade/reversal/locks or a nonfunctional button. Owner must approve the deletion/reopening semantics in a separate frozen action contract. This does not block confirmed read/UI work; report it as unimplemented.

Existing balances are an approximation: PendingEntriesBalance=StatementBalance-ReconciledBalance and LedgerBalance=StatementBalance, not a ledger query. Completed sessions require difference zero. E1's nonzero pending figures therefore cannot be reproduced by that current contract. Preserve source formulas in this refactor; expose this finding in the review and final report, do not claim accounting correctness. Historical versus current-as-of ledger/pending population needs a frozen accounting read contract before changing that slice.

## Execution and ownership

Recipe drift Check passed all eight packets. Builds/tests/lint/browser/database/migrations/commits/pushes/deploy prohibited. Root owns frontend, integration and review; bounded backend worker may own only historical read method after this handoff. Review full scoped diffs separately in both actual repositories. No reference-module edits.

## Final-review amendment — 2026-10-06

Frozen before this amendment's implementation: preserve optional API dates/bank and existing accepted FilterHelper formats, but reject supplied nonblank malformed dates, malformed/nonpositive bank IDs, and reversed dates before querying. FilterHelper currently converts invalid values to null, silently widening the report; Master5/backend boundary validation requires a failure instead. Reuse AccountReportsService.HasInvalidFilter and the existing GeneralMessage localizer; add only ReconciliationReportInvalidFilters in GeneralMessage.resx and GeneralMessage.ar-SA.resx, and reuse InvalidDateRange for an ordered-range failure. Existing controller already maps failure to BadRequest; UI's inline HTTP owner handles it. No new response properties or endpoint. Guard inclusive toDate=9999-12-31 against AddDays overflow. Root owns this final bounded validation after backend worker completion.

## Owner-approved domain expansion — 2026-10-06

Owner clarified Void without reversing journal, accepted latest-active-account cancellation and saved as-of-date balances, then instructed “تمام طبق”. This supersedes the earlier exclusion of the deletion/accounting slices. The exact Frozen handoff is BANK_RECONCILIATION_VOID_SNAPSHOTS_MAINTENANCE_EVOLUTION_PLAN.md: irreversible audited Void + released reservations, cumulative matched balances and real nullable ledger/pending snapshots, legacy unknowns displayed explicitly, typed reason endpoint/dialog, status/action flags and synchronized working-screen preview. No old decisions are silently rewritten; schema change requires owner-run migration. Expanded files/ownership/compatibility/verification are named in that plan before implementation.
