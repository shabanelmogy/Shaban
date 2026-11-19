# Ledger — wider account selector and checkbox with actions

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-23 |

Frozen target: LEDGER_FILTER_LAYOUT_MAINTENANCE_EVOLUTION_PLAN.md including the
owner's later same-action-row clarification. Existing state/impact, alternatives,
shared references and unchanged contracts are recorded there. No screenshot,
backend change, permission, new request property or material open decision.

## Final source reconciliation

| Concern / contract | Actual producer/consumer | Result |
|---|---|---|
| Wider account field | LedgerComponent.config accountId wide=true; shared field class/global report CSS | Normal strips above640px use basis340/grow2/max600 versus ordinary170/1/300; below640px existing full-width stacking. No private Ledger styles. |
| Checkbox beside buttons | AccountReportFilterDefinition.withActions; AccountReportPageComponent.actionFilters; main loop excludes selected checkbox, action template renders it once | showOriginalCurrency remains the same FormControl/key/default, in the full-row action toolbar below the main fields. Logical-start checkbox, existing buttons towards logical end, responsive wrapping. |
| Shared optional defaults | withActions absent for other current consumers; source search found only Ledger opting in. Existing wide class previously had no Accounts opt-in | Existing consumers retain placements; shared mechanics reusable. |
| Inline wide fields | AccountReportPageComponent.filterColumns | Wide counts two grid tracks, matching existing UI20 contract. Non-wide counts unchanged. |
| Typed/read contract | Existing LedgerFilter/buildFilter, reactive form and load method | accountId/dateRange/branchId/costCenterGroupId/chassisOrPlateNo/showOriginalCurrency unchanged, as are lookups, required validation, error/busy/reset/search, query-selected account and autoSearch. |
| Grid/totals/output | Existing nine Ledger columns, authoritative summary cards and ReportPrintSession | No amount, response, calculation, output or page-scroll change. Entire form stays no-print. |
| UI styling | UI4/20 global sigma-report-filter owners; ReportActionsComponent content projection | Shared theme/control-height tokens, logical margins and wrapping; no new skin or control instance. Mobile stack retained. |
| Guide | ACCOUNTS_GUIDE new Ledger topic | EN/AR, real /Ledger route, wider selector/action-row checkbox and search steps. Required GuideTopic fields including notes supplied. Existing GuideReader registration and /UserGuide/accounts retained. |

Frontend source files under SiGmaAngularFrontEnd: Ledger/components/ledger/
ledger.component.ts; Accounts/shared/report-family/account-report.models.ts,
account-report-page.component.ts/html; src/styles.scss; UserGuide/content/
accounts-guide.ts. Prior user/peer changes preserved, including earlier guide
and financial-report work. No API, EF, .NET namespace, mapping, new source entry,
service/provider/interceptor or migration required.

## Documentation and verification

UI20 owning block documents shared wide flex proportions/withActions; the
sigma-screen-refactor skill essential rule and revision row updated in the same
task. Previous unshipped separateRow descriptor/class removed after owner
steering; no stale application/book/skill references remain. The plan preserves
the historical instruction and its superseding decision explicitly.

Regenerated all eight packets using Generate-SigmaRecipes.ps1: plan00 and
phases00/01/02/03/04/05/06. Semantic review: UI20 provenance matches new source,
phase02 retains approved report-family/TrialBalance references and UI20 routing;
no request or accounting rule introduced by template text. Final Check all8 OK.
Unrelated pre-existing canonical edits were preserved. No generated file edited
by hand.

Root reviewed the complete scoped frontend diff, shared class/template/descriptor
matching, report action content projection and mobile/inline cascade. git diff
--check passed (line-ending warnings only). No duplicate checkbox IDs/controls:
main-loop and toolbar conditions are mutually exclusive. No missing imports or
new Angular declarations; both PrimeNG control and reactive forms already used.
No subagents: the small coupled shared-template/style/config slice would gain no
useful independent workstream.

Applied phases0/1 evidence+plan,2 layout,5 wiring and6 reconciliation; skipped
editor/action/backend phases because no relevant contract changed. No build,
test, lint, browser/runtime, DB, migration, commit/push or deployment executed.
Owner checks pending: desktop/intermediate/mobile layout, EN/AR/RTL/themes,
single checkbox focus/toggle and enabled/disabled state, account label space,
Search/Reset and output. Source checks do not prove compilation/visual behavior.

Suggested owner commits (stage only this scope): frontend
`fix(ledger): widen account filter and align currency checkbox with actions`;
documentation `docs(reports): document wide fields and action-row checkboxes`.
