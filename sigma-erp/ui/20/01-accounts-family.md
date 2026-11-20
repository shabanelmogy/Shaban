<!-- Part of UI block 20: see ../20-report-page.md. Same status and authority as the block. -->

### Accounts family composition — reviewed source

The collection-family reports share request lifetime through
`Reports/shared/report-read-state.ts` and `createReportReadState`. The report
supplies its typed filter/options contracts, form, validation/reset callbacks,
access requirements, output predicate and download callback. The owner retains
session/revision cancellation, one page-loading lease, applied-filter identity
and complete Print/Export reads through the existing ReportPrintService session.
`createCollectionReportState` remains the collection-specific filter facade.
A report whose filters need no server options sets `readonly options =
noReportOptions;` from the same file instead of a local `of(...)` result.
Customer Wise Collection supplies its own period, branch and customer-type form.
Keep financial fields and calculations in their report owners. Source and build
checks do not establish browser output or SQL acceptance. (Source 2026-11-18.)

**All tree reports: Expand All / Collapse All.** Every
report that displays a real tree uses UI6's shared ReportTreeActions controls.
Both actions apply to every supplied level, including descendants currently
hidden by collapsed parents. DataTable hierarchy consumers receive them
automatically; the existing shared dynamic Reports TreeNode adapter uses the
same toolbar for its legacy consumers without changing their request/paging
contract. This additive compatibility support does not make that legacy tree
body a canonical reference or authorize new private report tables. Flat and
indent-only reports retain no tree toolbar. Keep translated native buttons and
toolbar name, loading/empty gating, wrapping/RTL/themes and print hiding. These
are view actions: no confirmation, API call, recalculation or source-row writes.
Canonical print includes all descendants and preserves screen expansion; Excel reads the
complete original source regardless of collapse. UI6 owns recursive expansion
state and shared toolbar details; features must not copy controls or reach into
PrimeNG expansion internals.

Stable report editing uses the optional global
`sigma-report-filter-panel--stable` modifier: field wrappers align at the top,
dropdown/calendar hosts and roots stay within the field width, and selected
dropdown labels shrink. Keep the existing report field flex basis/bounds,
wrapping, narrow breakpoint, checkbox/action alignment and body overlay owner.
Accounts configurations opt in through `stableFilterLayout`; Ledger adopts it
after the owner's account-field movement report (2026-10-05). The family binds
FieldError's existing string reserveMessage for date and required feedback in
this mode (UI19), retaining validators and message visibility. Other reports
keep their defaults until reviewed. No feature alignment CSS or business change;
source-only, owner visual/runtime acceptance pending.

The fourteen complete Accounts reports use an Accounts-local typed
`AccountReportConfig`/`AccountReportPageComponent` over the existing shared hosts,
controls, grid and cards. Configurations retain feature-owned filter names,
request/response types, sections, backend totals and existing navigation.
`FormRecord` owns controls; lookup failures block Search and have local retry.
Explicitly adopted Accounts configurations may provide `accessRequirement` on
the existing `AccountReportConfig` and on individual filter definitions
. The shared page consumes the current-session
evaluator; absence of the optional inputs retains prior caller behavior. Keep
the real report key and indispensable lookup dependencies in its route and
configuration. Optional denied sources hide/disable their controls and remove
their form/raw/applied/recovery values before request construction, Reset and
output; a hidden field is not made eligible by `getRawValue`. Its lookup is not
requested and cannot create a required-lookup error. An allowed failed source
retains the existing Retry contract.

Cancel individual report/lookup/watch and deferred auto-search/print work on
its captured grant/context, retaining the outer search trigger. A queued action
must stay cancelled after revoke/regrant; comparing only the final signature
inside a microtask is insufficient. Check the mounted identity/context at the
event before an effect can flush. Relevant grant transitions restore missing
bootstrap and the sanitized searched snapshot; unrelated revisions do not repeat
operational report reads. Reference/working-context reset clears prior choices,
outputs and route-derived IDs, while a changed sign-in expires an adopted mounted
session. Existing data-free cache-context reset remains the owner for legacy
callers. For links from account-detail sections, the existing page exposes
`canActivateRow(row)`: it checks current output access,
mounted context, no report/lookup/print work, the active details view and membership
of the exact row object in current hierarchical sections. Its computed set is
rebuilt when sections change, including transformed display rows; a matching
account ID in an old/copied row does not qualify. Consumers keep their real
source/destination grants, route policy and business row rules, and recheck in
both activation visibility and the handler. This adds no link to reports without
one and does not authorize a write. Source specs exist; build/runtime/visual acceptance is
separate and pending under the current source-only boundary (UI26/28).
The existing ReportPage host owns `:host([hidden][inert]) { display:none
!important; }` so a protected mounted report stays visually hidden despite
the shell's flex/block display declarations, including print. Both attributes
identify access-hidden content; ordinary screen-only inactive-tab print
visibility keeps its existing contract. Reuse this owner, not a per-report
CSS copy. The actual-template computed-style specification remains unexecuted
under the source-only boundary.
For persisted bilingual lookup names, the shared dropdown's optional
`nameLocalized` becomes `AccountReportFilterOption.labelLocalized`. The existing
language-keyed `optionsFor` selects that nonblank label for Arabic, falling back
to the base label; a supplied `labelKey` keeps its prior translation behavior.
This capability applies to every consumer supplying bilingual metadata and
requires no per-screen opt-in, new request, selection reset or draft mutation.
Budget uses its own existing editor with the same stored bilingual values.
Evidence: GroupDefinition ReportOptions and Budget/BudgetVariance2026-10-23;
source conformance verified, owner language/print/export acceptance pending.
Changing filters invalidates output; requests capture the applied snapshot and
disable the form until completion. Export reads complete source rows and builds
translated headers at click time. Hierarchies use UI6's optional shared adapter;
FY2 remains flat. Server-owned context such as Ledger account identity/currency
is retained outside the grid through `responseContext`, not invented as a new
transport column. Sections default to independent bounded shared row viewports.
Accounts reports may supply `hasOutput(response)` when a valid report has
meaningful opening balances, authoritative totals or a warning without movement
rows. The shared page uses that same eligibility for both the visible Print /
Export controls and their handlers; omitted predicates keep the existing
row-count behavior. Do not invent a transaction row to enable output. Ledger
opts in and exports each currency's opening/totals even with no activity. Keep
the base summary separate from original-currency sections and preserve the
complete response in print/Excel.
`AccountReportSection.summaryCards` optionally places server-owned totals beside
their own section using the existing SummaryCards owner. Ledger uses it for each
original currency, while the base summary stays at the report head. Preserve
the section's unit, exact amount text, precision and complete output; do not
combine separate sections' financial totals or recreate summary markup.

The shared Accounts report owner cancels report and lookup reads on tenant /
session context expiry, clears the prior result and reference selections, and
restarts finite option bootstrap without replaying IDs from an old route
snapshot. Required bootstrap uses UI22's page progress owner. Optional
`watchOptions` on a filter adopts only a source already opted into UI2's shared
reference cache; Ledger's Branch is the current adoption. Direct operational
and non-opted-in lookup sources keep their direct reads. Retained reference
refresh preserves selected labels and uses failure/Retry; it does not rerun or
reprice the report. Clear its bindings between contexts and on destruction.
Optional `sectionLayout: 'document'` selects the existing complete-document
alternative: full-width sections in source order, one keyboard-accessible outer
`sigma-report-table-frame`, and grids with `fill=false`/`scrollable=false`.
The owner's later explicit accounting-format decision supersedes CashFlow's
document and tab experiments (2026-10-05). It uses one full-width filling shared
table, one Account/Amount header and two common78%/22% columns. Section rows
identify operating/investing/financing activities; each complete array precedes
its authoritative server net subtotal, followed by server NetChangeInCash with
a shared double rule. NetIncome uses its existing producer-defined operating
line (translated label), or the response field when that line is absent.
The five figures remain within the statement instead of KPI tiles. There are
no activity tabs or independently scrolling activity panes. The owner's later
explicit Tree View request groups those same three activities through shared
DataTableHierarchy: each default-expanded root shows its authoritative net and
contains the complete account lines plus closing subtotal. Final net change
stays at root level. Local children represent the response's existing section
groups, not account-parent relationships. UI6's optional activateEnabled exposes
ledger links only on actual accounts; expansion keeps the shared keyboard/RTL
owner. All descendants remain in print/Excel regardless of collapse.
UI6's optional shared rowTone/column width/link.enabled own the presentation;
synthetic headings/totals have stable local identities and no ledger link.
No frontend financial calculation is introduced. CashFlow's explicit exportRows
retains the previous complete three-section Excel shape from original arrays,
without injecting structural display rows; print includes the whole statement.
The full-width route modifier and public32rem minimum/wrapping remain. The
unconsumed Accounts-specific tab adapter is retired; other report layouts are
unchanged. Optional summaryDensity/summaryMaxHeight still pass through public
SummaryCards inputs for card consumers. Document mode remains an optional
complete-response presentation with shared empty states. Print releases bounds.
This composition does not convert
Journal's existing paged API or introduce new financial calculations. The shared
page shell/appearance is unchanged; source-only, owner acceptance pending.
