# Financial statements settings re-audit and Accounts report navigation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-23 |

## Scope and authority

Owner asks whether all financial statements consume the configured components
and aggregate correctly, then separately authorizes regrouping reports within
the Accounts sidebar. Report implementation is SOURCE-READ-ONLY in this task.
Only sidebar catalog/translations and the owning bilingual user guide may change.
No build/test/lint/browser/DB/migration/commit/deployment or report-source edits.

Existing contracts: FINANCIAL_STATEMENT_COMPONENTS_DOMAIN_API_CONTRACT_FREEZE,
FINANCIAL_REPORT_SETTINGS_GLOBAL_SCOPE_CONTRACT_FREEZE (general-scope owning
record), and the existing Financial Report Settings feature review. Fixed
formulas, company-global configuration, immutable own-account amounts, explicit
unmapped diagnostics, per-statement union selectors and no duplicate membership
remain the approved intent. Later owner request preserves the layouts of reports
other than Basic Income; presentation preservation is recorded separately from
whether those consumers actually display configured components.

Manifest: eight Income reports, scalar and monthly Balance Sheet, indirect Cash
Flow, their configured membership/aggregation owners and actual frontend/print/
Excel consumers. Trial Balance/Ledger/Journal/Budget Variance are included only
as sidebar destinations, not a new audit of their domain calculations. Report
shape is BE17/UI20/21; settings resolver is BE16; menu is UI1/23/26. Existing
controller/service/DTO/filter contracts stay unchanged. No screenshot supplied.
Recipe Check passes all eight current packets; Phase1 contracts already exist,
proportional Phase2/5/6 source reconciliation applies. No new editor/action API.

## Authorized navigation contract (Frozen before edits)

Keep Account Settings first, then Chart of Accounts, Opening Balances, Budget,
Month Close, Reports and the accounts User Guide. Reports contains:

- General Reports: Trial Balance, Ledger, Journal, Budget Variance.
- Income Statements: Basic, version2, YTD, YTD2, FY, FY2, Comparison, Vehicle.
- Balance Sheets: scalar and monthwise.
- Cash Flow Statement.

Preserve every existing route/title key and leaf shortcut identity. Keep Journal
within General Reports because its source is a read-only filtered report. Reuse
the recursive SidebarMenuComponent/PanelMenu and MenuCatalogService; no new menu
renderer, CSS, permissions, routes or providers. Add four translated group keys
and update /UserGuide/accounts. Existing top-level Reports duplicates elsewhere
are outside the owner's Accounts-only request.

## Source-confirmed findings

Paths below are relative to SigmaBackend or SiGmaAngularFrontEnd as indicated.
Findings are recorded for implementation follow-up; report source was not edited.

### F1 — P1: Nine screens do not consume the configured statement projection

All ten Income/Balance backend methods resolve settings and return `Statement`.
Only Basic Income opts into that projection in its frontend config:
`src/app/modules/Accounts/IncomeStatement/components/list/list.component.ts:39`.
The seven other income screens and both balance screens continue to render the
legacy account vectors. Examples are IncomeStatement2 list component lines59–62,
BalanceSheet list component lines52–55/87–89, and BalanceSheetMonthWise list
component lines42–43. Each feature's path has the same
`src/app/modules/Accounts/<feature>/components/list/list.component.ts` shape.

The shared page only reads the projection when `config.statement` exists:
`Accounts/shared/report-family/account-report-page.component.ts:141–145`.
Its Excel branch at lines285–297 also uses legacy sections/export callbacks
otherwise; the template gates statement warnings at lines232–237. Printing
follows the rendered view. Consequently renaming, splitting or reordering a
configured Balance component does not update those screens' displayed/printed/
exported components, and their unmapped warnings are hidden. This does not prove
that account totals are wrong; it proves the configured component presentation
is not connected. The earlier instruction to preserve nine layouts remains
valid: a follow-up should feed their existing designs with configured rows,
without silently replacing them with Basic Income's staged design.

### F2 — P1: Unbalanced cash-flow journals still affect activity totals

`SiGma.Business/Services/AccountServices/CashFlowReportService.cs:96–105`
detects unbalanced journals. It removes them from association history at
lines116–119, and cash attribution skips them at lines580–583. Net income and
noncash/working-capital rows at lines148–167 still sum the original movement
lines. This contradicts the existing feature review's stated exclusion from
later semantic classification (FINANCIAL_REPORT_SETTINGS_FEATURE_REVIEW,
zero-difference safety row).

Source-derived example, not an executed test: a posted journal debits cash100
and credits revenue80. Cash changes100, but net income/operating activity
includes80 and difference is20, with a diagnostic. A noncash journal debiting
receivables100 and crediting revenue80 can produce operating−20 despite zero
cash. The report correctly remains unreconciled, but activity amounts contain
the malformed journal. Follow-up: one balanced movement set for all semantic
calculations, retaining ledger cash balances and the structural diagnostic.

### F3 — P2: Unmapped cash-flow counterpart loses its code/name

CashFlowReportService lines48–54 load account identities only for selected cash
and enabled mapped accounts. The unmapped-counterpart path at lines660–664 asks
that dictionary for the very account absent from mapping. AccountLabel at
lines732–737 therefore normally returns Unknown Account plus its database ID.
For a cash payment against an unconfigured fixed asset, the user receives a
diagnostic without the actual ledger code/name needed to configure it. Follow-up:
load period counterpart identities in one bounded projection/query, not per row.

### F4 — P2, conditional: Existing duplicate mappings double-count balance rows

CashFlowReportService lines57–72 diagnose enabled cross-row duplicate accounts
and remove them from cash attribution's unambiguous dictionary. Balance-based
row calculations at lines155–167 independently sum every row's account IDs.
If legacy/corrupt data maps the same receivable to two working-capital rows,
a credit sale100 produces net income100 and working-capital−100 twice. A
diagnostic and reconciliation difference prevent acceptance, but provisional
activity totals double-count. Current Save validation prevents creating such
duplicates; actual existing data was not inspected. Follow-up should exclude
ambiguous memberships from every calculation role, with an explicit diagnostic.

### F5 — P2: Fiscal-year income reports aggregate full ledger detail in memory

AccountReportsService.cs lines1758–1792 and1966–1985 materialize all posted,
nonvoided details in the chosen range, filter income accounts in memory, then
rescan per month. Up to36 months and a large ledger can cause avoidable memory
use, latency or timeouts. This is a pre-existing BE17 database-aggregation
violation, not a demonstrated arithmetic error. Follow-up should group account/
month in SQL while retaining the same filter and sign contracts.

Backend backlog19 and UI backlog30 were checked; these findings do not match a
listed item. No unrelated backlog implementation was performed.

## Coverage and arithmetic reconciliation

Backend evidence in AccountReportsService.cs, with line numbers for layout
resolution / immutable own-value snapshot / statement projection:

| Report | Backend evidence | Actual frontend/print/Excel |
|---|---|---|
| Basic Income | 48 / 123 / 174 | Configured staged Statement; legacy account-detail view also available |
| Vehicle Income | 676 / 787 / 833 | Legacy lines; F1 |
| Income Comparison | 849 / 942 / 988 | Legacy lines; F1 |
| Income version2 | 1006 / 1087 / 1173 | Legacy lines/subtotals; F1 |
| Income YTD | 1212 / 1317 / 1371 | Legacy lines; F1 |
| Income YTD2 | 1388 / 1484 / 1592 | Legacy lines/subtotals; F1 |
| Income FY | 1634 / 1828 / 1872 | Legacy lines; F1, F5 |
| Income FY2 | 1890 / 2013 / 2042 | Legacy lines; F1, F5 |
| Balance Sheet | 186 / 231 / 248 | Legacy assets/liabilities/equity sections; F1 |
| Monthly Balance Sheet | 531 / 621 / 661 | Legacy lines; F1 |
| Cash Flow | CashFlowReportService:31–47 reads global saved settings | Backend activity values, diagnostics and reconciliation in screen/print/Excel; F2–F4 |

Verified from source, without numeric execution:

- Income/Balance builders use own-account vectors captured before hierarchy
  roll-up. Direct parent postings and child postings enter component aggregation
  once; parent rolled totals are not summed again.
- Membership combines selected Groups/Subgroups/Types as account-set unions.
  Validation prevents overlap; enabled coverage has a distinct unmapped
  complement. Disabled/unassigned accounts remain explicit rather than silently
  disappearing from category totals. Resolver: FinancialReportSettingsService.
  Statements.cs:80–108; membership query includes historical inactive accounts.
- Revenue/expense and asset/liability/equity natural signs are consistent.
  Fixed arithmetic remains server-owned. Basic Income alone uses the approved
  staged builder; the other nine use FinancialStatementReportBuilder.
- Ordinary and monthly Balance Sheet share BalanceSheetCutoffCalculator.cs:9,
  with posted/nonvoided filtering, exclusive cutoff, fiscal-year selection and
  retained/current earnings overlay. Monthwise evaluates the same cutoff logic
  at month ends. Report-specific branch/cost-center/vehicle filters feed their
  corresponding raw vectors.
- Cash flow reads company-global saved cash scope and enabled rows. Period end
  is exclusive after the as-of day (CashFlowReportService:293–304). Expected
  first-day opening entries enter beginning cash and are excluded from movement
  lines (:93–95,331–347). Transfers wholly within selected cash accounts have
  zero cash net and no external counterpart (:576–611).
- Cash-flow reconciliation requires both rounded zero difference and no
  diagnostics (:227–253), so offsetting unresolved cases cannot appear accepted.
  Its frontend takes backend totals and exports totals/status/diagnostics:
  CashFlowStatement list component:65–98,137–178. It does not re-sum activities.

Dataset-level opening-balance duplication, earnings link correctness, invalid
legacy mappings and actual malformed journals remain owner verification items.
Source inspection does not establish that all financial statements are ready
or numerically validated against the company's ledger.

## Navigation conformance and implemented result

| Concern | Canonical owner / actual reference | Final source match |
|---|---|---|
| Route tree and recursive rendering | UI1; SidebarMenuComponent.toPanelItems/filterMenu | Existing recursive renderer consumes new group nodes; no renderer change |
| Search, active ancestors, translation | UI1/23; same component's recursive search and active-descendant logic | Same shared owner, group titles translated in both vocabularies |
| Leaf shortcuts | MenuCatalogService.prepare/index | IDs remain based on normalized route, all fifteen report routes unchanged |
| Theme/RTL/scroll behavior | UI26; existing sidebar owner | Data-only regrouping; no CSS or container change |
| User-guide handoff | Master7; UserGuide reader, ACCOUNTS_GUIDE | Bilingual navigation step added to existing accounts guide |

Implemented source-only: Reports under Accounts now contains General Reports,
Income Statements, Balance Sheets and Cash Flow. Account Settings stays first;
operational actions stay outside Reports. Four group keys were added to
`src/app/modules/i18n/vocabs/en.ts` and `ar.ts`. Existing settings relocation and
other earlier uncommitted source changes were preserved. No report route, API,
permissions, provider or calculation source changed in this slice.

Static reconciliation found15 report destinations and zero duplicate routes
within the Accounts Reports subtree. All four new translation keys exist in
both languages. Scoped git diff review and `git diff --check` passed; line-ending
warnings only. Existing leaf pins retain route-derived identity. Final recipe
drift check passed all eight packets on 2026-10-23; no refresh was required.

## Delegation, verification and handoff

Root froze scope/contracts, traced actual frontend consumers, owned menu edits
and reviewed the complete scoped diff. Two bounded read-only sol workers audited
Income/Balance arithmetic and Cash Flow respectively; neither changed files.
Root independently inspected the reported source triggers before freezing
these findings. No generated packet, canonical book or skill changed; no new
reusable convention was established.

Owner verification pending: compile and open the application; verify translated
menu search, active ancestry and existing pins on desktop/narrow screens;
compare the11 reports against controlled journals including direct-parent
postings, component changes, month ends, earnings, opening entries, internal
cash transfers, unmapped counterparts, unbalanced journals and duplicate legacy
mappings. These checks were not executed. No build/test/lint/browser/runtime,
database access, migration editing/generation, commit or deployment occurred.
All report findings remain unimplemented because that scope was read-only.

## Owner-authorized correction plan and contract — 2026-10-23

Status: Frozen before correction edits. Owner now asks to fix all findings and
explicitly connect all financial reports to Financial Report Settings. This
supersedes the previous source-read-only boundary for F1–F5. It also supersedes
the earlier nine-consumer opt-out, while keeping each existing filter, summary,
numeric-column contract and account-detail layout. Basic Income alone retains
the staged standard-income presentation. No evidence of actual unbalanced
company data exists; the owner states that strict journal creation rules should
prevent it. The malformed-data case is a defensive report invariant, not a
finding that such company journals exist.

This is completion of the existing frozen report contract, not a new settings
model. Target report shape remains UI screen07/BE17 with current ReportPage,
ReportActions, typed DataTable and Accounts family owner. Root inspected the
canonical StatementOfAccount and TrialBalance references, existing Basic Income
opt-in, shared projection/view/export owner and the nine legacy configs.

| Slice / impact | Classification | Frozen correction and evidence |
|---|---|---|
| Nine report configs | Extend | Opt into existing typed Statement accessor. Configured view becomes primary, legacy account details remain selectable. Existing nonbasic component table is reused; no staged-basic redesign. API/wrappers/routes/filter/amount columns unchanged. |
| Cash-flow valid movement set | Refactor | Retain one structural diagnostic per unbalanced journal; exclude its lines from all semantic movement passes/NI/balance rows/cash attribution. Ledger opening/ending remain factual and difference stays visible. No posting writer/data mutation. |
| Cash-flow duplicate membership | Refactor | Diagnose duplicate enabled mappings and exclude those IDs from every row calculation role; do not count them in multiple balance rows. Current Save prevention stays unchanged. |
| Cash-flow account labels | Extend | Load missing period counterpart code/name identities once in a tenant-scoped bounded query/projection. No N+1 or new response shape. |
| FY/FY2 monthly ledger | Refactor | Aggregate account/year/month in SQL before materialization, same date/posted/nonvoided/branch/cost-center/sign contracts, no account-count-by-month queries. Preserve month columns and raw snapshots. |
| Journal creation/posting guards | Keep / read-only trace | Inspect direct shared validators/resolver/write boundaries to answer owner's question; no broadened journal rewrite. |
| Guide | Extend | Existing bilingual accounts guide documents configured view/details, screen/print/export consistency and defensive diagnostics. |

Alternative rejected: replacing the other nine with Basic Income's staged
layout would violate the preserved design instruction; keeping their sole
legacy account view would fail the newly explicit settings-consumption request.
Chosen existing component/detail views preserve access to both representations.
No new API, editable field, lifecycle, permission, schema, seeding policy or
AutoMapper mapping. No migration required. No Missing business decisions.

Execution: phases0/1 existing evidence+this frozen addendum, phase2 report reads
and consuming grids/export, phase5 integration, phase6 root reconciliation.
No editor phase3 or mutation/action phase4. Recipe Check all eight packets OK.
Backend workstreams own separate files: cash flow service vs AccountReportsService
FY methods. Root owns frontend/guide/artifacts and read-only posting-guard trace.
Preserve all prior changes and owner-created migrations/snapshot. Source-only
verification remains mandatory: no builds/tests/lint/browser/DB/migrations/
commits/deployment. Source arithmetic scenarios are reasoning, not executed tests.

## Correction implementation and final reconciliation — 2026-10-23

The earlier findings/coverage table preserves original audit evidence. This
section supersedes its outstanding implementation status: all F1–F5 source
corrections are implemented; owner compile/runtime acceptance remains pending.

| Finding / contract | Final source evidence | Result |
|---|---|---|
| F1 — all financial statement consumers | All ten Income/Balance list configs now have `statement: response => response.statement`; all ten DTOs already declare `statement: FinancialStatementReport`. Basic Income retains `standard-income` only. Cash flow continues through its own global settings service. | Eight Income variants, two Balance Sheets and Cash Flow consume the appropriate company configuration. |
| Screen/print/Excel | AccountReportPageComponent.statement/showingStatement/statementRows/statementColumns, export branch and template's statement table/warnings; existing ReportPrintService session. | Configured rows/totals/warnings are primary. Account Details retains old sections/export callbacks. No frontend resumming, fake ledger IDs or duplicate IS2/YTD2 totals in configured view. |
| F2 — malformed movement exclusion | CashFlowReportService.cs:118 creates semanticMovementLines. NI (:178), balance rows (:194–196), purpose diagnostics (:157), attribution (:203) and profit adjustment (:238) all consume it. Association history excludes the same period journal IDs. | One structural diagnostic; malformed journal cannot enter activity calculations. Ledger opening/ending cash remains factual and difference disclosed. |
| F3 — counterpart labels | CashFlowReportService.cs:122–134 collects missing distinct noncash counterpart IDs from balanced cash journals, then calls existing tenant-scoped LoadAccountsAsync (:340) once. | Existing account code/name available; truly missing accounts retain explicit unknown-ID fallback. No N+1. |
| F4 — duplicate mapping | CashFlowReportService.cs:61 identifies ambiguous IDs. Four role sets, balance row IDs and profit-adjustment IDs exclude them; attribution dictionary only admits one row. | No multiple-row allocation even for legacy duplicate mappings. NI remains independent. Diagnostic prevents reconciled status. |
| F5 — monthly aggregation | AccountReportsService.cs:1757 and1965 filter income IDs and SQL-group AccountId/Year/Month with debit/credit sums before ToListAsync. | Bounded aggregate results; unchanged signs/filters/snapshots/hierarchy. Empty months remain0. Exclusive next-month cutoff includes last-day fractions and stops at up to36 displayed months. |
| Journal balance guards | JournalVoucherService.cs:195/280 call ValidateDebitCreditBalance (:1106–1127); JournalVoucherResolver.cs:332/384 call EnsureBalancedOneSidedLines (:451–470). | Inspected manual add/update and shared save/post reject unequal totals, negative sides and invalid two-sided/zero lines. No journal writer changed; no actual malformed company data found. |
| Guide | Existing ACCOUNTS_GUIDE Financial Report Settings/Income/Cash Flow topics, GuideReader registration and `/UserGuide/accounts` menu entry. | EN/AR cover all variants, configured/details views, active-view output and defensive diagnostics. |

### Exact source slice and contract conformance

Backend: CashFlowReportService.cs and FY/FY2 portions of AccountReportsService.cs,
both under SiGma.Business/Services/AccountServices. The larger working-tree diff
of AccountReportsService includes earlier statement work; it was preserved and
reviewed for integration, and is not all new in this correction slice.

Frontend: one accessor line each in
`src/app/modules/Accounts/{IncomeStatement2,IncomeStatementYtd,IncomeStatementYtd2,
IncomeStatementFy,IncomeStatementFy2,IncomeComparison,VehicleIncomeStatement,
BalanceSheet,BalanceSheetMonthWise}/components/list/list.component.ts`, plus
`src/app/modules/UserGuide/content/accounts-guide.ts`. Existing UI20/21 shared
rendering, typed columns, translation keys, CSS, routes, root HttpClient and
interceptors are reused. No new runtime source entry, imports, payload fields,
DTO/API/route/provider/permission/AutoMapper change. No schema change or migration
required in this slice. Owner migrations/snapshot and prior changes untouched.

Root reviewed scoped diffs separately in the actual repositories, checked all10
typed accessors and active-view print/export branches. Scoped git diff --check
passed with line-ending warnings only; no merge markers. No new or moved .NET
types/namespaces/references; existing CashFlow aliases and tenant-scoped identity
loader retained. Cancellation tokens propagate through added query/aggregates.

### Source-derived scenarios — not executed tests

- Balanced cash sale100: NI/operating100; selected-cash transfer remains net0.
  Direct parent25 plus leaf100 still totals125 because snapshots precede rollup.
- Malformed cash100/revenue80: semantic NI/activity0, ledger change/difference100
  and structural diagnostic. Malformed noncash AR100/revenue80: activity0 and
  difference0, diagnostic still prevents acceptance.
- Duplicate AR working-capital rows plus credit sale100: both row adjustments0,
  NI100, difference−100 and duplicate diagnostic. No double-counted allocation
  or silent reconciliation; totals remain explicitly provisional.
- Unmapped asset paid in cash: one identity query supplies code/name; no guessed
  attribution. Revenue credit100 yields+100, expense debit40 yields+40 expense;
  zero months stay0; grouping by year/month keeps different years separate.

The cash-flow worker made bounded edits but its final turn hit a tool usage
limit; root took over and completed source/diff reconciliation and comments.
FY worker completed its bounded implementation/report. Both reused sol workers
with disjoint file ownership to reduce wall time. Root owned contracts,
frontend, guard trace, guide and final integration. No unresolved contract.

Owner checks pending: build both projects; run all11 reports against renamed,
reordered and disabled settings plus controlled balances; compare both views,
print/Excel, bilingual labels/warnings/month columns. Verify SQL translation and
large-ledger performance. Abnormal-data scenarios require controlled fixtures,
not changes to real journals. This is not proof of every external/direct writer.
No build/test/lint/browser/runtime/DB/migration/commit/push/deployment was run.
No canonical/skill/packet changes; final recipe Check all8 OK.

Suggested owner commit messages, staging only the correction slice:

- Backend: `fix(financial-reports): guard cash-flow allocations and aggregate fiscal periods in SQL`
- Frontend: `fix(financial-reports): show configured components in all statement variants`
