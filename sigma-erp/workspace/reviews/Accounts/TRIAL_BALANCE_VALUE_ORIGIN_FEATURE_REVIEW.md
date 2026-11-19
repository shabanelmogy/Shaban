# Trial Balance — parent amount origin

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-23 |

Scope: source-read-only explanation of the owner's screenshot123.PNG. No
application source or instruction edits. TierS bounded investigation; no new
API, calculation, write/action or UI contract. Report shape UI07/UI20/BE17;
existing Accounts report family/DataTable is the actual shared owner. Recipe
Check all eight packets OK. No subagents: one short sequential source trace.

Screenshot functional evidence: date01/10/2025–31/10/2026, branchBr2, account
level empty, all zero/leaf switches off. Control debit and credit each3403.06.
Assets1 and Current Assets1-01 each show debit1420, credit1005, opening0,
net/ending415. The visible Cash & Bank subtree shows0. The scrollbar and view
show only part of the complete asset tree. The image does not establish that
every descendant of1-01 is zero. No visual/layout implementation requested.

Source trace (paths relative to SigmaBackend):

- AccountReportsController GET AccountReports/TrialBalance delegates to
  AccountReportsService.GetTrialBalanceAsync.
- AccountReportsService.cs:403 obtains posted opening balances before fromDate;
  :407–419 groups period journal details by AccountId, sums Debit/Credit in SQL,
  and uses inclusive first day/exclusive day after final date.
- AccountReportHelper.cs:348–371 restricts to live detail/live posted nonvoided
  journals. Branch uses detail.BranchId falling back to header.BranchId;
  cost-center group resolves to detail cost-center membership.
- AccountReportsService.cs:421–475 initializes each account's own ledger values,
  freezes raw values, then adds each account's raw amount to each ancestor once.
  Own postings on a parent are preserved; child values are not removed/zeroed.
- Display filters follow accumulation. Global cards at:509–510 sum raw period
  totals, not visible parent+child rows, so hierarchy display does not duplicate
  the control totals.
- TrialBalanceLineVm.NetActivity is Debit−Credit; EndingBalance is Beginning+
  NetActivity. Hence screenshot1420−1005=415 is internally consistent.
- Trial Balance does not use editable Income/Balance component layouts. Its
  sources are posted journal details and the current chart hierarchy.
- Angular TrailBalance list config displays returned amounts without resumming;
  clicking a name navigates to Ledger with accountId only. Date/branch must be
  aligned manually there for comparison. Hide Zero Activity can isolate nonzero
  rolled branches without changing ledger totals.

Conclusion: a parent sum with a zero Cash/Bank child is possible and expected
when another descendant holds activity. The current source does not implement
parent-only display or zero child amounts after rollup. If every descendant in
the complete response is zero, investigate own historical parent journal lines
or the actual response/tree identities; screenshot/source alone cannot identify
the exact voucher(s) producing these1420/1005. Actual ledger data not accessed.

Verification: focused source trace only. No build/test/lint/browser/runtime/DB,
migration, commit or deployment. No schema change or migration required. No new
confirmed application defect; no user-guide edit because no screen implemented.

## Owner-authorized leaf navigation correction — 2026-10-23

Frozen bounded decision before editing: the owner requests Ledger links only
on analytical accounts in Trial Balance. Analytical identity is the existing
positive AccountId and explicit AllowChildren=false, not the currently visible
children array (display filters can hide descendants). Keep grouping labels
plain while preserving their expand/collapse actions. UI6 owns the existing
DataTableHierarchy.activateEnabled predicate; the shared template checks it
before rendering a navigation button and hierarchyActivate rechecks it before
invoking the callback. No new shared behavior, backend or permission change.
TierS correction; no delegation because one isolated UI predicate. Preserve
all prior changes, especially the ongoing report and guide edits. EN/AR guide
topic will be added to existing accounts module. Source-only checks only.

Implemented and reconciled: TrialBalanceListComponent's existing hierarchy now
uses activateEnabled with positive AccountId and explicit allowChildren=false.
Shared DataTable rendering and click/keyboard callback guard already enforce
that predicate; grouping toggles remain independent. No amounts, exports,
filters, route/query keys or backend changed. Existing EN/AR ACCOUNTS_GUIDE has a
Trial Balance topic with the real route, analytical-only link rule and the
existing account-only Ledger navigation limitation. GuideReader registration
and Accounts guide menu entry retained; earlier guide edits preserved.

Scoped frontend diff reviewed and git diff --check passed (line-ending warnings
only). Existing typed boolean/identity fields and shared public input reused;
no imports/types/runtime files or migration needed. UI6 conformance is source-
verified, not visual/runtime proof. Owner checks: grouping names plain, toggles
working, analytical names keyboard/mouse navigate, filtered grouping rows still
have no link. No builds/tests/lint/browser/DB/migrations/commits. Recipe Check
all8 OK; no canonical or generated changes. Suggested frontend scoped commit:
`fix(trial-balance): restrict ledger links to analytical accounts`.

### Owner-reported guide compilation correction — 2026-10-23

Owner reported TS2741 on the new Trial Balance guide topic. Source inspection
confirms GuideTopic.notes is required even for a topic without additional notes.
Added notes: [] to that topic, preserving the shared required contract and all
EN/AR content. No model weakening, shared reader or runtime behavior change.
TierS source correction; scoped diff reviewed and whitespace check passed.
No build/test/lint/runtime/DB/migration/commit. Owner compilation still pending.
