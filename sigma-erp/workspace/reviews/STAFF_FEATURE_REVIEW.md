| Field | Value |
|---|---|
| Status | Confirmed fixes implemented — source reconciliation complete |
| Owner verification pending | yes |

# Staff module review and implementation — current 2026-10-26

## Authorized corrective implementation — 2026-10-26

The owner's later **«عدل الملاحظات»** authorizes the eight confirmed findings
from the read-only baseline below. The Frozen handoff is
`STAFF_CONFIRMED_FIXES_CONTRACT_FREEZE.md`. All eight are implemented in the
existing eight screen families and their directly related backend owners.
Historical accounting/schema decisions remain outside this corrective scope;
their former Blocked disposition does not describe these completed fixes.

Master1 proportional tier L; Master4/5/7 and the current UI2/22/29, BE2/7/14/17
gates apply. UI03 routed step editor, UI01 controlled modal lists, UI07 reports
and the frozen monthly operation exception remain unchanged. Active Timesheet
aliases resolve to HRM/Attendances/StaffTimesheet. No screenshot/new domain
decision, route, public HTTP DTO, permission, payroll/cutoff or index/schema
change. Initial scoped files were clean; unrelated working changes were kept.

### Finding-to-source reconciliation

| Finding | Implemented owner / source evidence | Final source disposition |
|---|---|---|
| F1 required bootstrap | Always-mounted ReferenceLookupStatus in Staff editor, Statement (Staff + SubLedger), Balances, Alerts, Overtime, Duty and active Timesheet; local finite flags/finalize/cancel feed identity-based shared page leases | Required routed reads use the existing page host; publisher select indicators and local page-loading StateMessages removed. Busy/disabled/aria-busy and error/Retry retained. Page tables explicitly set showLoadingIndicator=false; shared primary action suppresses its ring while page progress owns visibility |
| F2 balance drill-down | StaffBalancesSummary statementRequests remains switchMap/defer/finalize/destroy/close-cancel; no page start/end for dialog read; one local StateMessage, Search disabled, table mask=false, existing loadStatement Retry | One foreground dialog read owner; failed response/transport retain actionable error/Retry. Form disable/enable and date validation unchanged |
| F3 cache consumers | Staff editor ReferenceLookupBindings for Branch/Country; Balances for Branch, bound once only after successful finite bootstrap; bootstrap markers prevent re-reading approved sources during unrelated batch Retry | Selected branch/nationality/address-country getters + current-option getters retain selected labels/drafts. Shared null-context clearing, tenant invalidation, retained silent refresh, error/Retry and DestroyRef teardown connected to real sources |
| F4 modal read ownership | Staff salary-revision, Designation detail, allocation-context and Timesheet detail read start/end pairs removed; existing local loading/error/Retry retained | Dialog reads local only. Save/global counters, EditorDialog foreground save host and independent navigation/write safety unchanged |
| F5 reconciliation CPU | StaffService statement explicit source uses existing byId; journal fallback arrays keep sorted detail order. JournalVoucherService receipt/note by-journal maps use GroupBy + First | Explicit match O(1) instead of O(L) per allocation, with same authoritative source/account/sign/journal/sequence/capacity. First-match semantics preserved without a uniqueness assumption; no SQL-count/latency claim |
| F6 duplicate allocation reads | Staff resolves fresh allowed account policy and delegates to IJournalVoucherService.AllocateForPartnerAccountsAsync; existing ExecuteUniqueWriteAsync transaction invokes shared AllocateCoreAsync with expected partner/account constraints before fresh sources | Valid Staff POST has one open-source acquisition inside the writer, rather than a duplicate Staff preflight. Existing AllocateAsync callers remain compatible. Request/duplicates/tenant/live/target lifecycle/detail ownership, monetary precision, partner/account, branch/currency, opposite sign, effective source/target reservations/capacities and persistence rechecks retained |
| F7 filter identifiers | Shared int32ValueValidator added to Overtime/Duty staffId controls alongside existing required/min | Invalid fractional/out-of-range model values are rejected before transport; server authority/API unchanged |
| F8 recursive detail | StaffService.DetailWithNavigationsAsync overrides the existing deep endpoint with explicit Repository.Query + AsNoTracking header/address projection plus finite owned child projections | Same StaffDetailVM/base Id/No and all declared fields; historical reference labels, address identity/flags/country and live tenant-owned document/eligibility/bank IDs retained. Generic recursive repository and separate salary read untouched |

Root final review also removed the remaining routed salary-step loading
StateMessage while keeping its global read count, prevented premature monthly
empty states during pending reads, and reconciled Balances Retry/selection and
imperative search guards against the watched-reference state. These are
confirmed one-owner/cache conformance corrections within F1/F3/F4.

### Final request visibility and cache evidence

Page-owned detail/salary/list/report/month/save/delete/export paths retain their
existing subscribed count and finalize/teardown. Required lookup bootstrap uses
ReferenceLookupStatus's page-default token and LoadingService lookup lease, not
an unrelated anonymous count. Same parsed-path query/fragment navigation keeps
pending progress through the shared route lifetime; path departure/reset and
lookup component destruction release their existing owners. Staff routes do
not override showPageLoading=false. Shell Layout renders the shared host; common
StateMessage/table/button/modal precedence uses the already established owners.
Dialog reads listed above have local StateMessage only, and dialog writes keep
the shared foreground save host. Timesheet's reused parent lookup state has
local dialog feedback when its editor is open. No feature loader/timer/style or
cache was introduced. Runtime overlap/stacking/timing remains owner-pending.

| Consumed URL / service | Shared producer, invalidation and final consumer evidence |
|---|---|
| Branch/GetSelect — BranchService | Existing cacheSelect opt-in; typed successful create/update and inherited delete invalidation, lookup-branches tenant committed notifications. Staff editor and Balances now finite bootstrap → separate watchSelectList → ReferenceLookupBindings, selected/current options, null-context clearing, Retry and DestroyRef teardown |
| Country/GetSelect — CountryService | Existing cacheSelect opt-in; typed successful create/update and inherited delete invalidation, lookup-countries tenant committed notifications. Staff editor same chain with BOTH nationalityId and address countryId; watches do not write the form/draft |
| Role/GetSelect, SponserShip/GetSelect, Department/GetSelect, LeaveType/GetSelect, Shift/GetSelect, StaffDesignation/GetSelect | Direct references with no source cache opt-in. Existing finite reads, failed-load Retry/teardown and saved labels retained; no new cache or fabricated invalidation duty |
| Staff/GetSelect — StaffService / AlertsStaffService adapter; Staff paged choices; Staff/Overtime composite options | Existing direct reference/operational contracts, no source cache opt-in. Staff/reporting-to/salesperson/operation choices remain direct; reporting-to still excludes self. Statement still fetches all Staff option pages |
| Staff/Statement/SubLedgers, Statement, Statement/Allocation context + POST, BalancesSummary, DutySchedule, Overtime, StaffTimesheet list/detail/write, Staff detail/salary/write | Direct operational/financial/policy reads and writes. No cache adoption: freshness/capacity/payroll/accounting authority retained. Loading changes do not change their URL/request/output contracts |

Source cache conformance is complete for the opted-in consumers; shared source
TTL/coalescing, imports/partial-success notifications, tenant rejoin/isolation,
network behavior and selected-label visual acceptance still need owner runtime
verification. The fuller direct-source inventory in the historical audit below
remains applicable, superseded only for F3's now-connected consumers.

### Performance / index and verification handoff

| Boundary | Before / after reproducible source budget | Owner measurement still pending |
|---|---|---|
| Existing Staff deep detail GET | Recursive root/navigation graph with data-dependent sequential reads → four explicit materializations for an existing record (header + address/reference scalars, documents, eligibilities, banks); not-found stops after one | Actual translated SQL/command count, historical-label parity and payload/latency against small/large child sets; salary HTTP remains separate |
| Staff Statement | Same complete source/history/cutoff materializations and output; explicit source matching O(A×L) → dictionary O(A) after O(L) index construction | Same balances/rows/order/capacity across ledger/outstanding/subledger/date ranges and large allocation histories; CPU/elapsed timing unmeasured |
| Staff allocation POST | Removes one preflight target projection, one target reservation SUM and one complete open-source acquisition. Current Staff acquisition has six source materializations: Staff existence, account IDs, ledger lines, receipts, notes, allocations. One fresh acquisition stays inside shared writer transaction | Actual SQL/IO/transaction concurrency, rollback and stale context/source/target capacity cases. Writer per-source rechecks intentionally remain; no claim of constant overall query count |
| Receipt/note source matching | Repeated FirstOrDefault by journal → one first-preserving dictionary construction and keyed lookups; query boundaries unchanged | Same first-match/output under duplicate journal references; actual CPU/latency |
| UI lookup/list/report/month/export | Existing endpoint/data/page/count/filter contracts unchanged. Active reference watches follow existing shared invalidation/TTL policy, retained refresh silent | Cold/warm request counts/bytes/TTFB, complete-data and rendering completion; no speed claim from loader adoption |

Use the same five-cold/five-warm owner protocol, data counts, device/network/API/
DB/tenant/branch/language/filter snapshot and rows/totals/action comparisons from
the baseline below. No measured speed result is claimed. Existing exact index
proposals, optional INCLUDEs, costs/overlap and no-new-index justifications below
remain proposals only; no index/entity/configuration/migration/snapshot edit and
no database execution. No new migration is required by these F1–F8 changes.

Verification completed: root reviewed the complete scoped frontend/backend
diffs and shared source contracts; TypeScript/Angular syntax-only parsing of 21
changed frontend/guide files has zero diagnostics; Roslyn syntax-only parsing of
all three backend files has zero errors; scoped git diff --check passes. These
are not compilation/type-checking/tests or runtime verification.

The in-app `UserGuide/content/staff-guide.ts` now explains page-owned required
options, local dialog reads, silent retained refresh, selection preservation and
Retry in Arabic/English. Reusable BE7 detail/matching/constrained-writer guidance
and the screen skill + revision row were updated together. Generated PLAN-00 and
PHASE-00 through PHASE-06 were refreshed through the generator; semantic review
confirmed BE7 provenance, correct shared/list/report/editor reference ownership
and unchanged execution boundaries. Final -Check passes all eight packets.

Final gates: F1–F8 **implemented/source-conformant**; APIs/financial/child/action
contracts preserved; source cache/loading/performance/index evidence reconciled;
guide/docs/skill/packets complete. Builds/tests/lint/typecheck/browser/runtime/DB
were not run under workspace instructions. Runtime loading visibility, DI/cache,
SQL/EF translation, concurrency/accounting, RTL/theme/keyboard/print acceptance
remain owner-pending. Historic AdvanceTaxInvoice and bank/schema decisions are
not closed by this bounded corrective handoff.

## Historical read-only baseline — before corrective authorization, 2026-10-26

Current review2026-10-26: the owner now requests **source-read-only review** of
Staff screens. The final dated section records fresh source findings against
current books, including page-owned required lookup bootstrap. Historical
implementation authorizations below do not authorize new source edits. Earlier
financial limitations remain separate; this review does not close them.

Current audit outcome: **review complete — findings open; source-read-only**.
The historical Blocked status above belongs to unresolved feature/accounting
decisions, not an unfinished source audit. No implementation is claimed.

## Current source review manifest — 2026-10-26

Scope: eight current families Staff record/list/salary revision, Designations,
staffAlerts, StaffStatement/allocation, StaffBalancesSummary/drill-down,
StaffOverTime, StaffDutySchedule and active HRM/Attendances/StaffTimesheet
(`/StaffTimesheet` and `/StaffTimesheets` aliases). StaffProfile is a consumed
service, not a screen. StaffRole resolves to a separate HRM module and is not
silently included. No screenshots or new business requirements supplied.

Tier L source review, existing Frozen STAFF_RECORD/BANK_ACCOUNTS/OPERATIONS/
REPORTS_LISTS/BACKEND/DOCUMENTED_REVIEW handoffs retain financial/API contracts;
latest owner loading rule is authoritative. UI03 step record + paged list,
UI01 simple modal lists, UI07 reports and operational monthly collection
exception; BE13 normal/BE14 aggregate/BE17 report shapes. References: catalog's
Job list, IndividualPartner step form, shared EditorDialog/EditableCollectionTable,
TrialBalance and CustomerStatement report semantics. Current shared owners,
not historical copied code, decide presentation conformance.

Root initial generator -Check passed all8. Applicable discovery/API/read/detail/
domain-action/integration/final packets are audit-only; no implementation phase
is authorized. Initial Git status for scoped Staff frontend/active timesheet and
backend Staff service/controller paths is clean. Extensive unrelated shared and
Customers/Suppliers work is retained. Repositories: SiGmaAngularFrontEnd and
SigmaBackend; workspace reviews are local artifacts. Review reads current source,
never reverts user changes or executes build/test/lint/browser/DB/migrations.

Root owns record/shared/guide/conformance; bounded read-only backend, report UI
and operations UI audits run after upstream contract discovery, without source
or artifact write ownership. Root integrates findings and verifies exact lines.
Authentication-only routes and existing dirty/write/delete protections remain
contracts; no invented permissions/accounting/index migration. Source-only
runtime/cache/SQL/visual acceptance remains owner-pending.

## Current audit findings and reconciliation — 2026-10-26

Result: eight screen families reviewed from active routes, read-only. Confirmed
findings below remain **unimplemented**. No screenshot evidence or new business
contract; current source and owning books are Confirmed evidence. Root checked
worker findings against shared LoadingService/Layout/StateMessage/DataTable/
EditorDialog/cache owners, retaining the latest owner page-bootstrap rule.

### Findings

**STAFF-20261026-F1 — P2: required initial/filter loading is not page-owned.**

In Staff Create, `Staff/Staff/components/details/details.component.ts:306–331`
starts nine lookup reads with only lookupLoading. The template has lookup error/
Retry but no ReferenceLookupStatus or page lease; Create's ready=true means no
detail read supplies a global count either. A slow required branch/country read
therefore has no page indicator. In Edit the page indicator can finish with
detail/salary before required lookups settle. Confirmed similar mismatches:

| Screen | Producer | Current local presentation |
|---|---|---|
| Staff Statement | StaffStatementOfAccount/components/list/list.component.ts:114–136 | html:73 loadingStaffs StateMessage and html:32–35 SubLedger p-select loading |
| Staff Balances | StaffBalancesSummary/components/list/list.component.ts:233–258 | html:60–68 local loading and per-select loading |
| Staff Alerts | alerts/components/alerts/list.component.ts:271–295 | html:9–10 select spinner, no page lease |
| Overtime | StaffOverTime/components/list/list.component.ts:141–153 | html:23 filter select loading |
| Duty Schedule | StaffDutySchedule/components/list/list.component.ts:149–171 | html:23 filter select loading |
| Timesheet (both aliases) | HRM/Attendances/StaffTimesheet/components/list/list.component.ts:152–181 | html:22 filter select loading |

All paths have effective showPageLoading=true; the shared page loader cannot
observe these local-only reads. Shared CSS hides local messages only while an
actual shell host exists; it does not register the missing page work. UI22's
latest owner rule requires mounted ReferenceLookupStatus with page scope,
aggregated required lookup flags, error/Retry, no publisher filter spinner,
and preserved finalize/cancel. This is a new conformance gap versus the latest
rule, not proof that the older implementation violated its then-current policy.

**STAFF-20261026-F2 — P2: balances drill-down has no visible read progress.**

`StaffBalancesSummary/components/list/list.component.ts:168–193` starts a global
count and disables the local form for `Staff/Statement`. Its body-appended
EditorDialog template `:88–119` has no loading StateMessage; only Search/table
loading inputs. Shared PrimaryActionButton/DataTable suppress their indicators
when global loading is true, while the shell content indicator is behind the
modal. Opening a staff row or searching dates leaves disabled foreground content
without local progress. Use one local StateMessage and explicit table/button
suppression, no global start/end for this read; retain switchMap/finalize,
identity/close/destroy, errors and actionable Retry. Source-confirmed ownership
mismatch; actual stacking/timing remains runtime-pending.

**STAFF-20261026-F3 — P2: approved Branch/Country cache consumers lack watches.**

`Staff/Staff/components/details/details.component.ts:306–331` reads Branch and
Country through opted-in services, but never constructs ReferenceLookupBindings,
binds a separate watch or clears options on source context changes. The initial
cache read works; open editor options do not follow committed changes/TTL/rejoin
notifications. `:323` merges every previous option, not selected-only retention.
`StaffBalancesSummary/components/list/list.component.ts:233–258` similarly reads
cached Branch once and never watches it. UI2 requires finite successful bootstrap
then once-bound source watches, current selected-ID/option getters, explicit
context clearing, failure/Retry and destroy teardown. Do not opt Staff, Shift,
Designation or other direct sources into caching just to address this finding.

**STAFF-20261026-F4 — P3: other dialog reads still acquire hidden page counts.**

Salary revision `Staff/Staff/components/list/list.component.ts:321–334`,
Designation detail `designations/list/list.component.ts:92–106`, allocation
context `StaffStatementOfAccount/components/allocation/staff-allocation-dialog.component.ts:78–85`
and Timesheet detail `HRM/Attendances/StaffTimesheet/components/details/details.component.ts:152–155`
start/end global loading while rendering local loading StateMessage in their
EditorDialog bodies. Current common modal precedence already hides background
progress, so **two visible indicators are not asserted** for these dialogs.
The count ownership still contradicts the dialog-local read rule and can suppress
other controls' progress. Keep only local read ownership; global writes/saves and
independent NavigationActivityService safety must stay unchanged. This is lower
priority than F2, which lacks a foreground host entirely.

**STAFF-20261026-F5 — P2: statement allocation reconciliation scans history per allocation.**

`SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs:852–855`
uses `allLines.Where(...).ToList()` for each explicit source detail even though
`:824` already builds byId. For A allocations and L ledger lines this branch
scans O(A×L) in memory, extending complete Statement processing for large
histories. Use an indexed lookup while retaining explicit source authority,
account/partner/sign/journal checks, allocation order and capacity semantics.
This is CPU work, not an EF N+1 query. No elapsed-time improvement is measured.

**STAFF-20261026-F6 — P2: allocation Save rereads all open sources serially.**

`StaffService.cs:1120–1123` calls GetOpenReceiptsAsync; `:1158` then delegates
to the journal writer, whose `JournalVoucherService.cs:1108` calls it again.
The Staff open-source branch executes account/ledger/receipt/credit-note/
allocation materializations; thus a valid POST repeats this work within one
save, in addition to the earlier context GET. Writer-side fresh availability
and transactional/concurrency checks are required; never cache or remove those
checks. Review a shared validated write path that avoids redundant preflight
materialization, preserving Staff target restrictions and all source/capacity
authority. Related CPU scans at JournalVoucherService.cs:1050–1051 find each
receipt/note by journal with FirstOrDefault per group; dictionary indexing is a
separate safe optimization candidate. SQL/timing verification remains pending.

**STAFF-20261026-F7 — P3: two Int32 filters lack the shared validator.**

`StaffOverTime/components/list/list.component.ts:69–72` and
`StaffDutySchedule/components/list/list.component.ts:79–82` validate staffId
only with required/min(1), so fractional/out-of-Int32-range values can reach
transport from an invalid model instead of receiving field validation. Normal
dropdown options supply integers, so this is an edge-path gap, not an assertion
that ordinary selection fails. UI19 requires int32ValueValidator for C# Int32
fields; active Timesheet already uses it at list.component.ts:94. Backend
authority is retained; do not change endpoint shape.

**STAFF-20261026-F8 — P2: active Staff detail uses recursive graph loading.**

`Staff/Staff/services/staff.service.ts:52–55` calls the active
Staff/GetByWithNavigationsId endpoint. Generic Service.cs:1307–1321 dispatches
to Repository.GetByIdDeepAsync (`SiGma.Repos/Repository/Repository.cs:457–470`),
which explicitly loads references/collections and recurses into child
navigations (`:475–565`). StaffService does not override this detail reader with
a bounded screen projection. Visited-node fencing prevents loops, but does not
bound the number of loaded relationships or queries; a single detail HTTP call
can grow with Staff's related graph before mapping the much smaller DetailVM.
Use an explicit screen-scoped projection/read preserving document/address/bank/
eligibility IDs, labels and tenant/live/history contracts. Do not replace with
the plain detail endpoint until every consumed collection is proven present.
This is confirmed source query-shape risk; exact command count and latency
depend on the actual related records and remain unmeasured.

### Current loading ownership matrix

| Operation | Subscribed lifetime and visible owner | Verdict |
|---|---|---|
| Staff list/search/page, all-page Excel, delete | defer/switchMap or explicit start/finalize + destroy; existing shell; table/button global suppression inherited | Operational path source-conformant; explicit table indicator=false can prevent transition flashes under current UI22 |
| Staff routed detail/salary and create/update | detail/salary direct reads, identity checks, paired count/finalize; Save count + disabled form + standard feedback; upload/cleanup shared ownership | No new hidden data/write regression confirmed; required bootstrap F1 and cache F3 separate |
| Salary revision read/write | Read has local StateMessage plus global count; write global and EditorDialog foreground save | Read F4; write source-conformant |
| Designations list/export/delete/save | Complete paged source fetch for local grid, global request/finalize; dialog write foreground shared host | Detail read F4; direct reference source unchanged |
| Alerts list/search/server page/export | Global switchMap/finalize; Staff lookup independently local | F1 for lookup; operational read source-conformant |
| Statement report | Global count/finalize, complete report locally paged; full print/active-section export via shared owners | F1 for staff/subledger options; F5/F6 backend work; allocation read F4 |
| Balances report | Global report/finalize; complete IncludeAllRows response, local paging/total; aggregate Branch/Staff bootstrap local | F1/F3; drill-down F2 |
| Overtime/Duty lookup/month/save | Local finite bootstrap; global month switchMap/finalize; sparse POST followed by authoritative GET | F1/F7; calendar28–31/sparse changes/committed-save refresh preserved |
| Timesheet list/export/write/detail | Global list/page/export/write finalization; finite local staff/shift lookup; modal detail global+local | F1/F4; existing close/dirty/identity/teardown retained |

Global LoadingService is render-safe and preserves query/fragment-only progress;
actual parsed path departure resets request counts, live lookup leases track
consumer lifetime. Error interceptor no longer decrements another owner's count.
Staff screens have no ReferenceLookupStatus consumers, so recent shared lookup
lease adoption cannot by itself repair their unconnected bootstrap. Reuse the
existing owners instead of inventing timers/hosts/feature skins.

### Per-source cache evidence

Configured environment.baseUrl prefixes all URLs below. Result/Results envelopes
stay typed, source feedback mode uses inline skip-error reads where applicable.

| Consumed source / actual service | Classification and producer evidence | Consumer conformance |
|---|---|---|
| Branch/GetSelect — BranchService | Approved cached reference, cacheSelect=true. Typed create/update pipe invalidateSelectOnSuccess; delete inherited success hook. ReferenceLookupCacheService maps lookup-branches; server AddSigmaRealtime owns committed tenant notifications | Staff editor + Balances only finite read; F3, no active source watch/context clearing |
| Country/GetSelect — CountryService | Approved cached reference, cacheSelect=true. Typed create/update + inherited delete success invalidation; lookup-countries committed tenant topic | Staff editor finite read and initial saved-label merge; F3 |
| Role/GetSelect — RoleService | Direct reference, no source opt-in, BaseService.cacheSelect=false | Staff editor finite read/error/Retry/destroy; no invented watch/invalidation obligation |
| SponserShip/GetSelect — SponserShipService | Direct reference, no source opt-in | Same finite editor batch; unchanged direct exception |
| Department/GetSelect — DepartmentService | Direct reference, no source opt-in | Same finite editor batch |
| LeaveType/GetSelect — LeaveTypeService | Direct reference, no source opt-in | Editor eligibility labels/selection use direct read and saved detail labels |
| Shift/GetSelect — ShiftService | Direct reference, no source opt-in | Editor, Duty and Timesheet finite reads; selected saved shift merge in operations; failure/Retry/destroy retained |
| StaffDesignation/GetSelect — DesignationService | Direct reference, no source opt-in | Editor finite read; designation typed writes have no approved source cache to invalidate |
| Staff/GetSelect — StaffService / AlertsStaffService adapter | Direct reference, no source opt-in | Editor reporting-to, balances/salesperson, Duty/Timesheet and Alerts finite reads, no cache/watch requirement; reporting-to removes self |
| Staff paged list — StaffService.getAllList | Direct operational read (Statement staff selector fetches all pages) | Finite sequential source reads; filter changes deliberately reload; no cache inferred from use as options |
| Staff/Overtime without Month/StaffId — StaffOverTimeService.getStaffOptions | Direct operational composite options | Finite operation, not a new reference cache source |
| Staff/Statement/SubLedgers, Statement, Statement/Allocation, BalancesSummary, Staff/DutySchedule, Staff/Overtime month, StaffTimesheet list/detail, Staff salary and record writes | Direct operational/financial/policy paths; never eligible merely because GET | Keep fresh capacity/payroll/accounting authority and cancellation/error/Retry; F1/F2/F4 presentation does not authorize caching them |
| StaffProfileService | Service exists at StaffProfile, no screen route/consumer within these eight families | Not counted as another screen or a consumed lookup here |

For approved sources the shared producer chain is BaseService →
ReferenceLookupCacheService → tenant topic/commit invalidation and shared
ReferenceLookupBindings; source opt-in is established but Staff consumer watches
are not. Do not claim selected-label/context/tenant/watch conformance for those
missing paths. Direct-read exceptions correctly retain their existing semantics.
No cache eligibility decision is Missing for this review; runtime TTL/coalescing/
rejoin/isolation/partial-import notification acceptance remains pending.

### Grid/editor/action contract reconciliation

Existing Frozen handoffs remain unchanged; this review freezes no new field or
business rule. Actual selected UI shape/reference is retained, with these
current column/transport boundaries checked:

| Family | Grid/editor contract and actions |
|---|---|
| Staff | Actions View/Edit/Revise/Delete; no, derived displayName, mobileNo, email, derived designationLabel. StaffListVM stays minimal identity/name/contact/designation; unsupported sorting is not enabled by these column descriptors. Full export uses applied query,100/page |
| Staff editor | Five steps Details/Documents/Salary/Bank Accounts/Eligibility; full owned snapshots and saved child IDs; server-owned fields omitted, gross omitted from salary writes. Same-day confirmation is allowed under latest Frozen amendment. Address identity and saved display labels retained; initial salary optional/create-only |
| Designations | name, staffCategory (translated), hourlyRate money; controlled modal required-name/category/optional nonnegative rate; references checked on delete; complete-data local filter/page is Frozen behavior |
| Alerts | srNo positional/nonfilterable, staffName, documentType, documentNo, issuedBy, issueDate, expiryDate, status, daysUntilExpiry display. Server sorting/filter/count/page, applied all-pages export preserved |
| Statement/drill-down | date date-type, voucherType, voucherNo, description, age number; optional poNo; allocations/debit/credit money; outstanding dueAmount money; runningBalance derived Dr/Cr. Shared staff-statement-view keeps screen/export columns aligned; required date/staff, optional subledger/inactive/ledger-outstanding; authoritative balances retained |
| Balances | code/name/contactPerson/mobile/contactNo/email/balance money, complete response/total; existing5-main fields + advanced Balance Type; row opens statement. No report read mutates balances |
| Overtime/Duty | Monthly28–31 rows, server salary/rates/amounts/calendar, sparse changed-row writes; dirty context/discard checks, zero/null clearing and failed post-save refresh fencing retained; no invented payroll approval or output action |
| Timesheet | staffName/code/designation/shiftName/date/workingHours/overtimeHours/month with exact scalar/date types; bounded server paging, saved selected labels, date/month/hours ownership and modal Create/View/Edit/Delete |

Action-state source checks retain dependent-delete validation, deferred dirty
confirmations, identity/busy guards, full save validation, failed-save drafts,
attachment cleanup retry and independent write-navigation safety. UI20/21 shared
ReportPrintService/dataTableExportRows preserve loaded complete print and active
section export. Staff Statement's separate full-width action row is intentional
under STAFF_STATEMENT_FILTER_ROWS_FEATURE_REVIEW, not a layout defect. The current
in-app Staff guide exists for all eight families; source-read-only review makes
no guide edits. Any later implementation must update its affected guide content.

### Performance and query gate

| Route/operation | HTTP/data and query boundary evidence | Risk / owner check |
|---|---|---|
| Staff list/search/page | One HTTP page, generic bounded count+projected page; optional grid expression map in StaffService, minimal ListVM | No per-row UI read; cold/warm list/count SQL/response timing pending |
| Staff Create/Edit/View | Create9 finite option-source reads, potentially Branch/Country cache hits; Edit adds detail+salary reads; View skips editable lookups and reads detail+salary. Checks may add unique-field requests; saved-label merge is local | F8 recursive detail query/materialization growth; no source timing claim; measure large owned-document/bank/eligibility aggregate and actual graph |
| Staff Save/Delete/revise | One mutation + list refresh; salary read when action opens, server-derived gross/atomic persisted revision preserved; shared unique/FK/numbering/save pipeline still applies | Explicit HTTP count is not DB query count; capture validation/children/audit/numbering traffic |
| Statement staff choices | ceil(staffCount/100) sequential list requests, plus dependent SubLedgers request on selection | Confirmed source waterfall/volume; full rows include contact/designation unused by selector. Improve only under a frozen compatible dropdown contract, not by caching financial data |
| Statement/report/allocation | One complete Statement HTTP, local paging; context GET on explicit action; POST has duplicate open-source scans F6; allocation reconciliation F5 | Large history materialization and CPU; preserve balances/history/capacity, writer recheck and totals |
| Balances | Branch+Staff lookups in parallel, then preserved initial report; one IncludeAllRows=true response and local paging; dialog one Statement GET | StaffService:1226–1258 materializes matching Staff,1289–1310 grouped ledger balances,1330–1392 builds/filters/sorts/pages. Intentional complete-total contract, volume risk not proof of broken paging |
| Alerts/Designations | Alerts bounded page plus direct Staff options, all-page Excel; Designation all-source pages for Frozen local filtering/paging | Capture HTTP/payload for large designation/staff sets; no grid per-row calls found |
| Overtime/Duty | Lookup1 composite or2 reference reads; month1 complete28–31-row response; changed-row POST + authoritative refresh | No per-day HTTP loop; repeated template day-formatting is only a measurement candidate, not a measured bottleneck |
| Timesheet | List1/server page, Staff/Shift finite lookup batch, detail1; export successive100-row pages | Verify month/StaffId filter selectivity and actual order SQL; aliases share same component |

No performance fix or measured before/after result exists in this read-only
review. Owner comparison protocol: same build/mode/device/network/API/DB/tenant/
branch/language and data snapshot; record Staff count, ledger/allocation count,
child counts, selected month/date range/filter/page. Take five cold-cache opens
and five warm opens, retain each sample and median (no unsupported p95 claim).
Measure startup/usable UI separately from required-data completion, HTTP counts/
bytes/TTFB, SQL commands/rows/logical reads/duration/plan and rendering/CPU. Compare
exact rows/totals/order/filter/count/export/action results and error/Retry/
cancellation/overlap. No numeric target is Frozen; agree it after baseline.

### Index evaluation — proposals only, no schema authorization

Source configurations and the existing model snapshot were inspected read-only.
They do not inventory deployed manual indexes/statistics; no absence in a live
database is asserted. StaffTimesheet/StaffDesignation configs are ToTable-only;
Timesheet snapshot has StaffId/ShiftId singles. JV detail snapshot has AccountId,
PartnerId and JournalVoucherId singles; allocations have source-reference
singles; StaffConfig has Department/Role/Shift/Designation FK singles. Existing
deferred designation length/live-name uniqueness schema work remains recorded
separately and is not a new source implementation here.

| Workload | Exact candidate to compare in owner plans | Benefit, cost and overlap |
|---|---|---|
| Timesheet tenant/month range, generic count/page | StaffTimesheet `(SubscriptionId, Month, Id)`; optional INCLUDE `(StaffId, ShiftId, Date, Code, Designation, WorkingHours, OvertimeHours)`. Compare alternative `(SubscriptionId, StaffId, Month, Id)` for dominant staff-selected workloads; do not create both by default | Supports tenant/month range; actual sort may still need a sort after a range. Wide INCLUDE adds storage/write cost, so add only proven lookup-removal columns. StaffId/ShiftId singles do not cover month; inspect actual live predicate before any filter |
| Staff statement/balances/subledger detail | JournalVoucherDetail `(SubscriptionId, PartnerId, AccountId, JournalVoucherId)`; optional INCLUDE `(Debit, Credit, SubLookUp)`. Compare AccountId before PartnerId if actual selectivity favors it; do not include wide Description without plan evidence | Supports staff/account predicates and header join; existing singles overlap subsets. Date/status are on header and cannot be solved solely by this key. Write/storage and nullable live semantics preserved |
| Header-led date/status plan only | JournalVoucher `(SubscriptionId, IsPosted, IsVoided, Date, Id)` | Conditional candidate if date/status-selective header join drives the query. Detail-led plans may make it redundant. Compare existing coverage/reads and write cost before proposing implementation |
| Allocation source OR predicates | **No new index justified yet**: existing Receipt/CreditNote/AllocatedJV/AllocatedDetail reference singles may support seeks/unions | Source scans may be dominated by repeated queries/CPU rather than missing indexes. F5/F6 code-path optimization should preserve writer checks before adding speculative indexes |
| Generic Staff text search, designation complete local list | **No new text/list index proposed from source alone** | Contains across multiple fields is not made seekable merely by adding an ordinary text index. Existing full-result semantics/real cardinality must decide; no hidden schema change |

Candidates are nonunique and no filtered index is prescribed: nullable
IsDeleted/live-history semantics need actual generated SQL/plan verification.
Owner should inventory exact deployed keys/includes/filters, compare plans/IO/
CPU and write/storage under the same tenant/date/month datasets above, and
reject overlapping candidates. No entity/configuration/index/migration/snapshot
was edited and no database command executed. **No Add-Migration is required for
this review**; a future approved schema implementation must name its migration.

Additional source query budgets: generic Staff list Count+page are two
materializations; Statement is typically7–9 boundaries including Staff/account
mapping, optional opening SUM, cutoff lines and receipt/credit/debit/allocation
reads. Balances has2 account mapping queries, up to3 filter existence checks,
matching Staff materialization, grouped ledger aggregate and optional salesperson
names. Duty read has Staff projection+holiday read+month attendance materialization;
Overtime selected read has staff context/salary, holidays and month overtime.
Saves include their fresh validation/query/save pipeline and authoritative
readback. These are source boundaries, not measured SQL/elapsed times or promises
of constant command counts for recursive details/aggregate save helpers.

### Integration, known debt and verification limits

Active root app.routes loads LayoutModule under AuthGuard; page routing imports
the actual eight families and HRM Timesheet aliases. No Staff route sets
showPageLoading=false. Root-provided screen services are redundantly in
LayoutModule's provider array; this is scoped provider cleanup debt under UI1,
not proof of duplicate HTTP/incorrect state (services are largely stateless and
shared reference cache remains root-owned). It is not elevated above F1–F7.

Existing unresolved original AdvanceTaxInvoice consumption/allocation semantics
and earlier Staff bank/schema migration handoff remain separate. A Supplier
current-balance decision does not authorize changing Staff accounting cutoff.
Backlog UI30's palette/shared-helper/month-validator debt is known and is not
reported as newly discovered. Backend19's cancellation/interface/numbering and
general field-base issues are also not reclassified as new Staff regressions.
Latent Timesheet internal bulk validation noted by the backend audit is not a
screen finding unless an exposed writer is confirmed; do not invent an endpoint.

| Phase/gate | Final disposition |
|---|---|
| Discovery/contract audit | Existing Frozen fields/workflows retained; no new permission/API/accounting rule. No screenshots; source-confirmed findings versus runtime hypotheses separated |
| Read/editor/actions | Current scoped code reviewed, all fixes remain recommendations because request is read-only |
| Cache/loading/performance | Matrices above completed, source gaps F1–F8 explicit, index proposals/costs/overlap recorded; no conformance/latency closure claimed |
| Source diff/repositories | Initial/final scoped frontend Staff+active Timesheet and backend Staff source diffs clean; unrelated dirty work preserved. Only this review artifact and INDEX updated |
| Packets/docs | Initial generator -Check all8 passed; no canonical/skill/template edits warranted by read-only review, no generation needed |
| Guide | Existing guide read, no app-source guide changes authorized |
| Verification | Source-only; no build/test/lint/typecheck/browser/runtime/DB/migration/snapshot/Graphify/Sigma MCP/commit/push/deploy command. Owner visual/runtime/network/SQL acceptance pending |

Visual acceptance pending: actual sole visible progress in lookup-only/page/
dialog/save states; empty/error/Retry/populated widths, route/card edges and
internal scroll; sidebar open/collapsed, desktop/intermediate/narrow, RTL/LTR,
light/dark, keyboard/focus/screen reader/motion and full print. Source parsing,
class names or shared imports are not substitutes for those observations.

Three bounded read-only luna_explorer audits returned backend, reports and
operations evidence; root inspected primary source/shared owners, rejected
unproven double-visible/sort/provider claims and retained final severity and scope.
No delegate wrote source or artifacts, and no migration/index was implemented.

## Manifest

Owner instruction: review `src/app/modules/Staff` and every list below it, and fix all findings. Authorized scope includes directly consumed .NET APIs, mappings, validations and persistence writers; no unrelated HRM rewrite. Frontend repository: F:/My Work/Sigma/SiGmaAngularFrontEnd. Backend: F:/My Work/Sigma/SigmaBackend. Coordination artifacts: F:/My Work/Sigma/reviews. Existing Staff and Overtime July review artifacts are historical; current canonical books/source decide conformance, and retired guide basenames are never opened.

| Area | Selected shape / initial evidence | Scope |
|---|---|---|
| Staff/Staff | Type03 step record, routed editor; documents, salary, bank accounts, eligibility and revision action | List, Create/Edit/View, salary revision, all owned forms/children/services/routes |
| StaffPartner | Legacy scaffold, existing routes; actual API and use under discovery | All files and route ownership |
| StaffTimesheet | Legacy list/detail scaffold | All files and actual timesheet contracts |
| StaffOverTime | Monthly per-day financial collection editor | Filters, authoritative payroll response, save/dirty; no existing print/export action |
| StaffDutySchedule | Monthly editable schedule workspace | Filters, shift/day rows, save/dirty; no existing print/export action |
| StaffStatementOfAccount | Type07 complete sectioned report plus allocation action form | Filters, contacts, ledger/advance-tax rows/totals/export/print/allocation |
| StaffBalancesSummary | Type07 report with existing paged transport and statement drill-down | Filters, counts, complete output, sorting/paging, selected staff and dialog |
| alerts | Paged read-only alert register | All filter/variant/grid/output states |
| designations | Type01 list with small modal editor | Grid/filter/Create/Edit/View/delete/export, normal entity API |
| StaffProfile | Consumed service only, no screen files | Current use and service identity |

Approved references selected from UI catalog: Job for list shell/filter/grid/request integration; shared EditorDialog + VehicleService for modal; IndividualPartner for step-form; openingBalances/shared editable table for financial collections; Trial Balance for report strip/values, Customer Statement for section semantics; shared components remain each presentation owner. Backend normal entity/master-detail/report patterns selected per actual contract. Payroll revisions and allocation are real domain actions, not generic CRUD. No screenshot at initial discovery; later bank-account screenshot and explicit addition are recorded below. Existing authentication retained; no invented authorization system.

Working tree at discovery: Staff source clean; en/ar and tsconfig.app.json already modified by earlier authorized work and must be preserved. Backend status scoped during contract discovery. Mandatory recipe check: all eight pass. Canonical books/skill govern; no obsolete reference pattern is copied.

## Execution and ownership

Root owns Phase0/1 contracts, all cross-layer decisions, reports/alerts/designations UI, shared/translations/config/docs/artifacts and integration/final diff review. Bounded agents: staff_backend (gpt-5.6-sol, BE-only), staff_record_ui (gpt-5.6-sol, Staff/StaffPartner UI), staff_operations_ui (gpt-5.6-sol, Timesheet/OverTime/DutySchedule UI). Initial audits read-only; implementation waits for Frozen handoffs. Independent owners meet AGENTS.md delegation gate, keeping four active agents total. No overlapping source edits or additional agents.

Applicable packets: PLAN00 and Phases00–06, selected per screen. No build/test/lint/browser/database/migration/snapshot/commit/push/deploy/Graphify/Sigma MCP. Source-only acceptance; owner runtime/visual/accounting checks remain pending. Material business-policy/schema decisions cannot be invented; conservative source-backed implementation choices follow the owner's standing rule and are recorded. Findings/decisions and exact contracts follow as discovery completes.

## Reconciliation outcome

### Owner clarification — same-day Confirmation, 2026-10-03

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Owner explicitly permits Confirmation on the Joining day. The latest record-contract amendment replaces the earlier strict-after rule; its earlier report below is historical. Selected shapes remain UI03 Staff step record and BE2 aggregate write. Applicable packets Phases01/03/06 after all eight drift checks passed; other phases require no new grid/actions/wiring. Small sequential correction, no subagents.

| Concern | Book/reference/shared owner | Pre-edit conformance decision |
|---|---|---|
| Date control and group validation | UI17/12/19; IndividualPartner minExpiryDate/cache and documentDatesValidator; appDatePicker/partnerApiDate/FieldError/step specs | Keep the same shared recipe/cache; owner-authorized difference is min=Joining and reject Confirmation<Joining. Update inline/spec messages together. |
| API rule | BE3/8; CustomerDocumentAddVM.DateAfter and actual DateAfterAttribute | Extend existing attribute with opt-in AllowEqual=false default. Staff VMs opt in, nullable/Date-only/localization behavior retained; other consumers retain strict >. |
| Reusable guidance | BE3 plus sigma-screen-refactor section8.4 | Document explicit equality option and its strict default in the owning book and digest/history; regenerate derivative packets, never edit them manually. |

Final reconciliation: employmentDatesValidator now rejects only Confirmation<Joining; confirmationBeforeJoining is used consistently in its declared step spec and inline error. minConfirmationDate caches the normalized Joining day itself, preserving manual input, typed dates, optionality and existing Next/Save gates. Both write VMs set DateAfter.AllowEqual=true. The shared attribute's bool default remains false; source usage inventory finds only the two Staff opt-ins and the two unchanged strict CustomerDocument Add/Update consumers. Null handling and calendar-day comparison remain in the shared owner. En/ar messages explicitly permit the same day.

Changed sources: Staff details TS/HTML, en/ar vocabularies, StaffAddVm/StaffUpdateVm, both GeneralMessage resources (same paths linked in the earlier follow-up below), plus [DateAfterAttribute](<F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Filters/DateAfterAttribute.cs>). No further StaffService edit in this correction. Authoritative documentation updated: BE3 rule, BE preamble version0.74, CHANGELOG, skill section8.4/history. Eight phase packets regenerated by the generator and drift check passed; no generated file edited manually.

Verification: complete scoped diffs reviewed independently in frontend, backend and documentation Git roots; earlier bank/shared/resource/doc changes preserved. All three scoped diff --check commands passed. Component plus en/ar TypeScript syntax and Angular template parse pass. AST Staff vocabulary comparison finds255/255 leaf keys with no duplicates or parity differences, the inclusive message key present and the retired strict message key absent. Both resource XML files parse with exactly one Staff date key. This remains source-only verification. No migration, AutoMapper, schema, API shape or domain calculation change; no subagents for the bounded sequential task. No prohibited build/test/lint/browser/app/DB/migration/snapshot/commit/push/deploy/Graphify/Sigma MCP commands run.

Owner checks pending: Create/Edit with Joining03/10/2026 must accept Confirmation03/10 or04/10 and reject02/10; blank remains allowed. Verify typed input, shifting Joining past existing Confirmation, Next/Save focus and translated errors, calendar minimum across month/year changes, and direct POST/PUT inclusive validation in both languages. Verify document expiry still rejects its issue day. Compilation and runtime acceptance remain pending. Suggested commits only: frontend `fix(staff): allow confirmation on joining day`; backend `fix(staff): support inclusive confirmation date validation`; docs `docs(sigma): document explicit inclusive date ordering`.

### Confirmation date ordering follow-up — 2026-10-03

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Bounded owner request: Confirmation must be after Joining. Frozen amendment: STAFF_RECORD_CONTRACT_FREEZE.md, Confirmation strictly after Joining. Existing equality permission is intentionally replaced by a strict later-day rule; optionality and date-only transport remain unchanged. Applicable phases: 0 discovery, 1 contract, 3 detail/write, 6 scoped reconciliation. Phases2/4/5 have no new grid/action/wiring work. Eight recipe drift checks passed. No new screenshot evidence; the earlier bank screenshot is unrelated. This small sequential correction does not meet the delegation gate.

Pre-edit conformance evidence (reconcile after implementation):

| Concern | Book | Actual reference / symbol | Shared owner | Target match / authorized deviation |
|---|---|---|---|---|
| Date bound and manual entry | UI17 | IndividualPartner details minExpiryDate + document expiry calendar: local Date(year, month-1, day+1), cache, minDate, structured mask | appDatePicker + partnerApiDate | Staff minConfirmationDate will use the same local next-day/cache recipe; owner sets this business bound |
| Inline and step validation | UI12/19 | IndividualPartner validateStep, invalidStepFields and shared documentDatesValidator strict comparison | FieldError, step-form-fields, focusField | Staff parent employmentDatesValidator and declared group spec will reject equality and focus Confirmation; no custom error markup |
| API ordering and optionality | BE3/8 | CustomerDocumentAddVM.DateAfter; DateAfterAttribute compares Date portions with > and allows null | SiGma.Helpers.Filters.DateAfterAttribute | StaffAddVM/StaffUpdateVM nullable Confirmation use same attribute with Staff resource; duplicate service rule removed |
| Translations | UI23, BE3 | Existing Staff date-order vocabulary and DateAfter.FormatErrorMessage ResourceManager | en/ar vocabularies + GeneralMessage resources | Explicit after message in both languages, unique keys |

Final source reconciliation:

| Concern | Final evidence |
|---|---|
| Angular rule/bound | employmentDatesValidator rejects normalized Confirmation <= Joining with confirmationNotAfterJoining. minConfirmationDate uses the reference's cached local Date(year, month-1, day+1), and the Confirmation calendar binds minDate. Shared mask, optional control, partnerApiDate payload/hydration and existing Next/Save invalid gates are retained. The explicit step0 spec and inline FieldError use staff.dateOfConfirmationAfterJoining and focus staff-confirmation-date. |
| Backend rule | Both Staff write VMs have DateAfter(nameof(DateOfJoining), ErrorMessage="StaffConfirmationNotAfterJoining"). The existing attribute compares Date portions strictly and permits null. The two weaker service comparisons are removed. StaffController/base are ApiController; Program registers controllers and no model-validation suppression is present in ServerAPI source. |
| Translation verification | TypeScript AST inspection finds exactly one Staff object per language, 255 leaf keys in each, zero missing or duplicate Staff keys, and the new after message in both. GeneralMessage XML parses with one new key per language. The mandatory line-based Check-Translations -Block staff reports en0/ar255 because Staff indentation differs between dictionaries; AST inspection resolves this parser false positive without changing unrelated translations or the checker. |
| Scoped review | Both actual Git roots verified. Complete scoped Git diffs reviewed separately, including preserved bank-account and other earlier edits in shared dictionaries/resources. diff --check passes in both repositories; stale before/equality messages and merge markers absent. TypeScript syntax parses for the component and both vocabularies; Angular template parse has zero errors. These are source checks, not a compile/runtime pass. |

Files changed in this follow-up (nine application sources plus the record freeze and this report):

- Frontend: [Staff details TS](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/Staff/components/details/details.component.ts>), [Staff details HTML](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/Staff/components/details/details.component.html>), [en vocabulary](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/en.ts>), [ar vocabulary](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/ar.ts>).
- Backend: [Staff Add VM](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Staff/StaffAddVm.cs>), [Staff Update VM](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Staff/StaffUpdateVm.cs>), [StaffService](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs>), [en resource](<F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Localization/Shared/GeneralMessage.resx>), [ar resource](<F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Localization/Shared/GeneralMessage.ar-SA.resx>).

No entity/config/migration or AutoMapper change is required; no accounting formula changes. No new reusable guidance or guide/skill/packet edits are needed for this feature-specific date rule. Earlier module-wide accounting and bank-schema owner tasks remain independent. No build/test/lint/browser/app/DB/migration/snapshot/commit/push/deployment/Graphify/Sigma MCP action was run. Suggested commits only: frontend `fix(staff): require confirmation after joining date`; backend `fix(staff): validate confirmation date on write contracts`.

Owner verification pending: in Create and Edit, use Joining 03/10/2026 and verify Confirmation 02/10 and 03/10 fail while 04/10 succeeds; verify blank Confirmation remains allowed. Change Joining after entering Confirmation and verify Next/Save blocks with focus and translated message, including manual typing and partial dates. Verify calendar updates its minimum across month/year boundaries, View retains disabled historical values, and older same-day records require correction or clearing to save. Send invalid POST/PUT dates directly and confirm localized model-validation rejection in both languages. Compilation and picker/runtime behavior remain owner-pending.

### Earlier module reconciliation

All eight active Staff screen families and their direct API consumers have been reconciled in source. Bank Accounts was added after the owner's later screenshot and `ضيفه`; duplicate Add Document/Add Eligibility actions were corrected after owner feedback. Source-only implementation is complete for the frozen independent slices. Overall status is **Blocked** because original AdvanceTax-invoice consumption still needs the owner's accounting/linkage decision. No runtime, build, database or visual acceptance is claimed. Bank-account schema application is additionally owner-pending.

Frozen handoffs: [record](<F:/My Work/Sigma/reviews/STAFF_RECORD_CONTRACT_FREEZE.md>), [operations](<F:/My Work/Sigma/reviews/STAFF_OPERATIONS_CONTRACT_FREEZE.md>), [reports/lists](<F:/My Work/Sigma/reviews/STAFF_REPORTS_LISTS_CONTRACT_FREEZE.md>), [backend](<F:/My Work/Sigma/reviews/STAFF_BACKEND_CONTRACT_FREEZE.md>), [bank accounts](<F:/My Work/Sigma/reviews/STAFF_BANK_ACCOUNTS_CONTRACT_FREEZE.md>). [Maintenance plan](<F:/My Work/Sigma/reviews/STAFF_MAINTENANCE_EVOLUTION_PLAN.md>) retains original decisions and their explicit amendments.

### Later Balance Type / More Filters adjustment — 2026-10-03

Implemented — source-only. The owner replaced the proposed second-row position with More Filters like Customers Balance Summary. The frozen presentation amendment is in the reports/lists contract above. Changed only StaffBalancesSummary `components/list/list.component.html` and `.ts`: five main fields use shared FilterPanel (mainColumns=5), while Balance Type is its collapsed advanced choice field. FilterAdvancedDirective keeps the control in the existing filterForm; opening/closing only updates advancedFiltersVisible. Native radios share the existing all/debit/credit/range values and all default. The public shared toggle/count, 34px controls, RTL/theme/responsive layout and single Reset are reused; no local filter CSS or shared-component edit. Reset now restores defaults and runs Search on page1, matching UI4 and the owner's Customers example. Search/Refresh/Print/Excel and their existing guards remain; the report shell, grid and statement-dialog strip remain in place. mx-0 preserves the report title/filter inline edges.

| Final concern | Source reconciliation |
|---|---|
| Canonical ownership | UI4 Workshop/Job shared panel and its actual grid/toggle/choice/toolbar rules compared; owner-selected Customers BalancesSummary appFilterAdvanced/advanced state/reset behavior matched. Scoped UI20 filter-strip exception is explicitly authorized and frozen; appReportPage/appReportActions retained. |
| Form / busy / default | Advanced template is declared inside the main filterForm; one balanceType control, all four labels retained, signal(false) starts collapsed, no toggle/reset coupling. Existing form disable/enable effects still gate loading/printing; shared Reset and toggle use the matching busy state. |
| Contracts | Same filters, grid code/name/contactPerson/mobile/contactNo/email/balance and existing report item shape; no DTO/API/backend/AutoMapper/calculation or migration change in this adjustment. |
| Verification | Entire two-file scoped Git diff reviewed; scoped diff --check passed. Source parser checked63 TS files/11 HTML templates with no syntax errors;412 translation candidates and48 Staff enum leaves had no missing/duplicate keys. Shared general.moreFilters/activeFiltersCount en/ar keys confirmed. This is source inspection, not application compilation or runtime verification. |

Phase02 presentation and source reconciliation applied; write, domain-action and backend phases skipped because they have no changed contract. No subagents used for this small sequential fix. No prohibited build/test/lint/browser/DB/migration/snapshot/commit/push/deployment/Graphify/Sigma MCP action was run. Suggested frontend commit: `refactor(staff): move balance type into shared more filters`.

Owner acceptance remains pending: open Staff Balances Summary in LTR/RTL and both themes, expand More Filters, select each balance type and search, collapse/reopen and verify selection persists, then Reset and verify defaults/page1 reload. Check narrow-layout wrapping, report print/Excel and the statement drill-down.

### Applied phases

| Phase | Result / reason |
|---|---|
| PLAN00 | Frozen in-place refactor; exact dead StaffPartner scaffold classified Remove; later Bank Accounts classified Extend/Create |
| 00 discovery | All Staff children/routes/providers/direct APIs inventoried; before-review bank absence verified from Git and actual Staff inheritance |
| 01 contract | Read/write/child/calculation/error/action contracts frozen before edits; additive bank snapshot compatibility frozen separately |
| 02 read/grid | Staff/Timesheet/Designation/Alerts paging/columns/export; complete Balances and Statement outputs reconciled |
| 03 detail/write | Shared gated record/editor/table controls, explicit DTOs, salary action, child ownership and recovery; five-step Staff includes banks |
| 04 domain actions | Existing deletion, salary revision and journal allocation examined; no invented approval/payment/authorization transition |
| 05 integration | Routes, providers, sidebar, typed services, import producer, guards, translations and middleware ownership reconciled |
| 06 reconciliation | Separate FE/BE scoped diffs and source checks reviewed; original advance-source accounting remains Blocked; execution verification pending owner |

### Decisions and observable changes

| Concern | Decision / evidence |
|---|---|
| List shape | Existing normal entity list for Staff/Timesheet, complete small master for Designations, paged read-only alert register; shared list/filter/table owners |
| Defaults | Paged lists/report display use15, options10/15/20/50/100. Monthly operations retain complete28–31-day baselines and remain unpaged |
| Filters | Applied immutable snapshots/cancel stale GETs. Staff unchecked inactive means no filter. Balances range means nonzero balance, not invented numeric bounds |
| Output completeness | Staff/Alerts/Designation fetchAllPages; Balances explicit IncludeAllRows and response metadata gate; report print releases paging and both statement sections; Excel uses full relevant arrays |
| Record | Retain Details/Documents/Salary/Eligibility; later authorized Bank Accounts inserted between salary/eligibility. One form and existing routes/modes retained |
| Saved children | Tracked Address/Documents/Eligibility reconciliation and saved IDs; foreign/duplicate/negative IDs fail; new IDs0; bank null/omitted on older Update preserves rows, [] explicitly clears |
| Salary | Client edits applicable date and five amounts only; Gross omitted from writes and returned server-derived. Create optional salary checkbox defaults checked, preserving previous six-zero package/default date |
| Documents | Shared document factory/FileField/UploadTracker; saved identities, Staff upload folder, required type/number/issue/expiry, optional issuer/path; failed cleanup blocks exit/repeated successful save |
| Operational money | Date-effective rates, holidays, rounding and totals remain server-owned; monthly writes only changed days including0/null clears. Failed read after committed save cannot cause accidental resave |
| Duty times | Preserve HH:mm transport and existing validation; no invented pair/order/overnight rule; missing shift IDs include0/negative |
| Reports | Reconcile matching same-account/partner opposite ledger sides through cutoff and capacities before display filters; preserve ledger net/DrCr; AdvanceTax section copies reconciled ledger allocations/due |
| Allocation writers | Shared existing tenant/type lock for JV and direct Invoice/CreditNote writers; explicit invalid-target failures; CreditNote retains Serializable owned boundary; failed results/throws roll back owned multi-save work |
| Reservation semantics | Financial reads count effective posted/nonvoided allocations; write guards reserve all live operational dependencies including draft-source reservations |
| Failure ownership | Inline read error and declared-failure states/retry; ordinary mutation interceptor owns feedback. Bounded allocation exceptions reach existing configuration/posting/concurrency middleware |
| Authentication | Existing AuthGuard/base API authentication retained; Staff import action now uses existing Authorize; no permission endpoint or security claim based on hidden controls |
| Import | Address actually mapped only if meaningful; required Gender/DOB/joining validation; direct ImportStaff CSV/model/date adapter adds dateOfJoining; download new template |
| DTO/mapping | Explicit lean Staff/Designation/Timesheet detail/list contracts; only three shared detail constraints widen to class. One-way maps; ignore only manually reconciled owned navigations; inherited operations retained where no feature behavior needed |
| Retirement | Remove exact dead StaffPartner product scaffold/route/providers and unused duplicate Designation detail wrappers; keep live Staff entity/profile lookup and HRM plural Timesheets route |
| Bank accounts | Five exact screenshot text fields, row add/remove, parent save and View; new owned entity/config/DTOs, server-owned StaffId/tenant, full snapshot and soft-delete. General Bank master unchanged |

### Grid columns beside transport properties

| Screen | Displayed columns | Read properties / justified compatibility |
|---|---|---|
| Staff | Code, derived Name, Mobile, Email, Designation | Id,No,FirstName,MiddleName,LastName,MobileNo,Email,StaffDesignation; Id is action identity |
| Timesheet | Staff, Code, Designation, Shift, Date, Working Hours, Overtime Hours, Month | Id,StaffId,StaffName,Code,Designation,ShiftId,ShiftName,Date,WorkingHours,OvertimeHours,Month; saved FK identities support editor/action |
| Designation | Name, translated Category, Hourly Rate | Id,Name,StaffCategory,HourlyRate; enum0/1/2 retained |
| Alerts | Sr No, Name, Document Type, Document No, Issued By, Issue Date, Expiry Date, Status, Status Detail | SrNo,StaffName,DocumentType,DocumentNo,IssuedBy,IssueDate,ExpiryDate,Status,DaysUntilExpiry; direct alert identity/status metadata retained |
| Balances | Code, Name, Contact Person, Mobile, Contact No, Email, Balance | StaffId,Code,Name,ContactPerson,Mobile,ContactNo,Email,Balance/BalanceType/FormattedBalance; legacy SalesPerson remains compatibility/filter field |
| Statement/drill-down | Date, Voucher Type/No, Description, Age, optional PO No, Allocations, Debit, Credit, outstanding Due, Running Balance | Same ledger properties plus JV/detail IDs and CanAllocate for action; Contact/totals/ledger/advance arrays retained |
| Bank Accounts | Name, Routing Code, Branch, Account No, IBAN | Detail Id plus Name,RoutingCode,Branch,AccountNo,IBAN; Add only five fields; Update row Id0 or saved. No StaffId/tenant/audit input |

### Reference conformance reconciled with final source

Paths below are relative to the frontend repository; exact owning contract artifacts retain detailed exceptions.

| Concern | Book block / inspected reference | Shared owner / final match |
|---|---|---|
| Bounded list/title/filter/grid | UI1/3/4/5/6; Workshop/Job/components/list | sigma-route-host/list panel, FeatureTitle within panel, FilterPanel and DataTable own values/scroll/paging |
| Routed step editor | UI12/15/19/27; Customers/Individual/IndividualPartner/components/details | StepForm, FormSection, validation summary/focus, fixed footer; same shared graph, bank step extends content |
| Modal editor | UI13; Fleet/VehicleService/components/details and shared/editor-dialog | Shared shell, translated title and record subtitle, explicit mode, detail readiness/busy/dirty close |
| Editable rows / single Add | UI14; shared editable-collection-table TS/HTML, IndividualPartner document table, Accounts/openingBalances workspace | Typed projected td cells, shared toolbar/removal, fixed table frame; external duplicate Add actions removed and addRequested bound |
| Report panels/cards/print | UI20/21/24; Accounts/TrailBalance/components/list and Customers/StatementOfAccount/components/list | ReportPage/ReportActions/SummaryCards/DataTable/ReportPrintService; feature CSS only column width/container/section print behavior |
| Structured dates/months | UI17; shared DatePicker and date-utils | Shared strict parseMonthValue, local current-month defaults, complete date masks; Timesheet yyyy-MM-01, operations yyyy-MM |
| Feedback/requests | UI22/28; shared apiErrorMessage/interceptors | Both failure channels handled, cancel old reads, finalize loading, one mutation feedback owner |
| Owned persistence | BE3/4/8/14; IndividualPartnerService/base OwnsAll/ReconcileOwned/RemoveWithChildrenAsync | Existing Staff guard/tracked save extended; bank parent/tenant ownership and owned deletion; no second persistence engine |

### Later screenshot evidence

`C:/Users/user/Desktop/1.png`: explicit Create New Staff, five tabs, Bank Accounts columns Name/Routing Code/Branch/Account No/IBAN, Add Row, per-row remove and Save/Cancel. Screenshot is functional/content evidence, not layout authority. Before-review code had four tabs and no bank fields in Add/Update/domain inheritance; no bank functionality was removed by this review. Owner's `ضيفه` authorizes the new owned collection. Routing/IBAN country formats, uniqueness, default account, account holder semantics, payroll transfers and posting are not proved and were not invented. Name-required/max100 selection follows existing Bank name/write and configuration pattern and is recorded in the bank contract; remaining fields optional and zero rows allowed.

### Source verification and limits

Latest source inspection: **63 TypeScript files**, **11 Angular templates**, **412 literal translation candidates** and **48 Staff enum leaves**. No TS parse diagnostics, Angular parse errors, duplicate translation keys or missing en/ar keys. This is parser/source inspection, not an application compile or executed test. Direct runtime named imports resolved in the initial44-file inspection; bank additions reuse those files and explicitly exported model types. Source checks found no retired StaffPartner consumers or merge markers; plural HRM Timesheets references are intentional compatibility. EN/AR general resources were checked for duplicate/missing reviewed keys. ES2018-incompatible Array.flatMap removed; remaining .at calls belong to FormArray.

Scoped FE/BE whitespace checks pass after cleaning Staff translation block whitespace and stale lean-ListVM imports. Entire scoped source diffs were reviewed separately, with fully deleted legacy CSS/scaffolds classified explicitly and all new bank source read. Snapshot comparisons include the external commits described below plus subsequent working edits/new files. Backend ownership, nullable document dates, shared transaction/error propagation and bank DTO/config/mapper/owned-update paths were inspected; .NET compilation is pending.

Documentation updates promoted strict month transport to UI17/book version1.56 and skill history, and lean generic detail compatibility to BE3/5/book version0.73 and skill history/CHANGELOG. Generated packets regenerated only through Generate-SigmaRecipes, semantic contents unchanged apart from provenance hashes; final -Check returns all8 OK. Check-BookReferences currently reports one unrelated documentation-link issue at ui/16-dropdowns-lookups-enums.md:60, ClauseType/GetSelect. It was recorded instead of changing unrelated Lease guidance.

No build, test, lint, browser automation, application execution, database command, migration, snapshot edit, commit, push, deployment, Graphify or Sigma MCP was run. Existing specs were aligned with changed public source APIs; none were executed. No new permission system, money formula, journal policy or historical-data rewrite was introduced.

### Owner migration and acceptance

**Migration required only for the later Bank Accounts addition:** run `Add-Migration AddStaffBankAccounts` in the existing backend migration workflow, review the generated table/FK/string bounds/tenant column changes, and apply it to the intended database before using the updated Staff API. Agent did not create/run a migration or edit ModelSnapshot. Earlier Staff refactor slices did not change EF schema. Bank rows start empty for existing Staff; no historical backfill is invented. Updating the API before schema application can fail Staff detail/update because the new collection is queried.

Owner verification pending:

1. Compile frontend/backend and run appropriate existing tests in the owner's environment.
2. Create a Staff with multiple bank rows; preserve leading zeroes and IBAN text; reopen View then Edit. Update one saved row, add one, confirm/remove one and save; verify IDs, soft deletion, empty-array clearing and omission compatibility. Reject foreign/duplicate/negative child IDs and blank names/overlength fields. Confirm View disables bank edits and row actions.
3. Confirm exactly one Add action each for Documents/Bank Accounts/Eligibility, validation summary navigates to correct steps, and the Salary/Bank/Eligibility order matches screenshot content.
4. Verify salary revisions, same-date replacement, server Gross, document upload/save/discard cleanup failure/retry, failed-save retention, in-use deletion and foreign child/address rejection.
5. Verify Overtime/Duty28–31 days, weekends/pre-joining toggle, sparse0/null clears, typed months, dirty filter Search/Reset/navigation cancel, and committed-save/refetch failure without duplicate save.
6. Verify report filters/cutoff/DrCr and server totals on accounting-approved examples; multi-page/full Excel and both statement sections in print; complete Balances metadata, local paging and selected-staff drill-down; alerts status/search/count scope and full export; designation complete list and modal detail failure.
7. Verify concurrent allocations across JV/Invoice/CreditNote, partner/account/state/remaining-capacity checks and owned rollback. Original advance-invoice consumption cannot pass accounting acceptance until the owner resolves the blocked policy below.
8. Verify Arabic/English, RTL/LTR bank codes, dark/light themes, keyboard/focus and narrow screens: page remains bounded, one internal scroll owner and fixed actions. Import using the updated CSV including Date of Joining and authenticated access.

### Remaining material decision

**Original AdvanceTax invoice consumption — Blocked.** Allocation rows store the generated source JV, while original advance identity exists only in optional replaceable Notes. The old per-invoice consumption queries cannot reliably find previous generated-source allocations. Shared locks/target caps and report reconciliation do not fix this missing association. Owner must choose persisted original-invoice linkage plus treatment of old allocations, or explicitly approve aggregate partner-advance capacity. No Notes parsing, schema/backfill or accounting-policy substitution was applied. The root's asynchronous question remains unanswered; independent work and bank addition proceeded within their frozen contracts.

### Agent integration / repository history

Initial gpt-5.6-sol bounded owners were staff_record_ui (Staff/StaffPartner), staff_operations_ui (Timesheet/Overtime/Duty), staff_backend (direct BE). Existing completion follow-ups were used for the same owners; some backend/operations runs ended with usage limits after partial source edits. Root took over and reconciled those edits locally, including lost operational context, strict months, report/allocation defects, error ownership, translations and all final diffs. No agent declared the whole feature closed. Root also implemented the tightly coupled bank addition locally. Non-overlapping ownership reduced repeated source loading and wall-clock time for the initial large scope; costly new handoffs/retries were avoided during final integration. Supplier/aging agents from earlier requests are outside this Staff result.

While root was reconciling, another process committed existing work: FE `2afc9a2` (parent `1e70a98`), BE `29440fb0` (parent `de7ca513`). These commits were **not made by this agent** and include unrelated earlier work. Staff review compares its scoped paths from those parents through current files, including post-commit bank/feedback/error fixes. Shared en/ar/sidebar hunks belonging to other work are preserved and not claimed as Staff changes; pre-existing tsconfig additions are preserved. No unrelated Lease/source change is included in this review.

Suggested commits only: frontend `refactor(staff): unify screens and add bank account editor`; backend `fix(staff): reconcile aggregates and allocations; add owned bank accounts`. Owner should separate unrelated work and generated migration as appropriate. No agent commit/push.

## Exact source file inventory

The inventory below is generated from the scoped parent-to-current differences plus new bank source. M/A/D indicate modification/addition/deletion; shared files contain preserved unrelated hunks as noted above. Deleted files are listed for traceability; links to deleted paths are not live artifacts.

### Frontend source inventory

- M [src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu.component.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu.component.ts>)
- M [src/app/_metronic/layout/layout.module.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/_metronic/layout/layout.module.ts>)
- M [src/app/modules/Administration/DataImport/ImportStaff/components/list/list.component.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/DataImport/ImportStaff/components/list/list.component.ts>)
- M [src/app/modules/Administration/DataImport/ImportStaff/models/list.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/DataImport/ImportStaff/models/list.ts>)
- M [src/app/modules/i18n/vocabs/ar.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/ar.ts>)
- M [src/app/modules/i18n/vocabs/en.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/en.ts>)
- M [src/app/modules/shared/utils/date-utils.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/utils/date-utils.ts>)
- M [src/app/modules/Staff/alerts/components/alerts/list.component.html](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/alerts/components/alerts/list.component.html>)
- M [src/app/modules/Staff/alerts/components/alerts/list.component.scss](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/alerts/components/alerts/list.component.scss>)
- M [src/app/modules/Staff/alerts/components/alerts/list.component.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/alerts/components/alerts/list.component.ts>)
- M [src/app/modules/Staff/alerts/service/alerts.service.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/alerts/service/alerts.service.ts>)
- M [src/app/modules/Staff/designations/designation.routes.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/designations/designation.routes.ts>)
- D src/app/modules/Staff/designations/details/details.component.html (removed)
- D src/app/modules/Staff/designations/details/details.component.scss (removed)
- D src/app/modules/Staff/designations/details/details.component.spec.ts (removed)
- D src/app/modules/Staff/designations/details/details.component.ts (removed)
- M [src/app/modules/Staff/designations/list/list.component.html](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/designations/list/list.component.html>)
- M [src/app/modules/Staff/designations/list/list.component.scss](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/designations/list/list.component.scss>)
- M [src/app/modules/Staff/designations/list/list.component.spec.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/designations/list/list.component.spec.ts>)
- M [src/app/modules/Staff/designations/list/list.component.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/designations/list/list.component.ts>)
- M [src/app/modules/Staff/designations/models/list.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/designations/models/list.ts>)
- M [src/app/modules/Staff/designations/service/designation.service.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/designations/service/designation.service.ts>)
- A [src/app/modules/Staff/shared/staff-statement-view.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/shared/staff-statement-view.ts>)
- M [src/app/modules/Staff/Staff/components/details/details.component.html](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/Staff/components/details/details.component.html>)
- M [src/app/modules/Staff/Staff/components/details/details.component.scss](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/Staff/components/details/details.component.scss>)
- M [src/app/modules/Staff/Staff/components/details/details.component.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/Staff/components/details/details.component.ts>)
- M [src/app/modules/Staff/Staff/components/list/list.component.html](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/Staff/components/list/list.component.html>)
- M [src/app/modules/Staff/Staff/components/list/list.component.scss](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/Staff/components/list/list.component.scss>)
- M [src/app/modules/Staff/Staff/components/list/list.component.spec.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/Staff/components/list/list.component.spec.ts>)
- M [src/app/modules/Staff/Staff/components/list/list.component.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/Staff/components/list/list.component.ts>)
- M [src/app/modules/Staff/Staff/models/create.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/Staff/models/create.ts>)
- M [src/app/modules/Staff/Staff/models/details.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/Staff/models/details.ts>)
- A [src/app/modules/Staff/Staff/models/enums.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/Staff/models/enums.ts>)
- M [src/app/modules/Staff/Staff/models/form.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/Staff/models/form.ts>)
- M [src/app/modules/Staff/Staff/models/list.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/Staff/models/list.ts>)
- M [src/app/modules/Staff/Staff/services/staff.service.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/Staff/services/staff.service.ts>)
- M [src/app/modules/Staff/Staff/staff.routes.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/Staff/staff.routes.ts>)
- M [src/app/modules/Staff/StaffBalancesSummary/components/list/list.component.html](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffBalancesSummary/components/list/list.component.html>)
- M [src/app/modules/Staff/StaffBalancesSummary/components/list/list.component.scss](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffBalancesSummary/components/list/list.component.scss>)
- M [src/app/modules/Staff/StaffBalancesSummary/components/list/list.component.spec.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffBalancesSummary/components/list/list.component.spec.ts>)
- M [src/app/modules/Staff/StaffBalancesSummary/components/list/list.component.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffBalancesSummary/components/list/list.component.ts>)
- M [src/app/modules/Staff/StaffBalancesSummary/services/staff-balances-summary.service.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffBalancesSummary/services/staff-balances-summary.service.ts>)
- M [src/app/modules/Staff/StaffDutySchedule/components/list/list.component.html](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffDutySchedule/components/list/list.component.html>)
- M [src/app/modules/Staff/StaffDutySchedule/components/list/list.component.scss](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffDutySchedule/components/list/list.component.scss>)
- M [src/app/modules/Staff/StaffDutySchedule/components/list/list.component.spec.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffDutySchedule/components/list/list.component.spec.ts>)
- M [src/app/modules/Staff/StaffDutySchedule/components/list/list.component.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffDutySchedule/components/list/list.component.ts>)
- M [src/app/modules/Staff/StaffDutySchedule/services/staffdutyschedule.service.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffDutySchedule/services/staffdutyschedule.service.ts>)
- M [src/app/modules/Staff/StaffDutySchedule/staffdutyschedule.routes.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffDutySchedule/staffdutyschedule.routes.ts>)
- M [src/app/modules/Staff/StaffOverTime/components/list/list.component.html](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffOverTime/components/list/list.component.html>)
- M [src/app/modules/Staff/StaffOverTime/components/list/list.component.scss](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffOverTime/components/list/list.component.scss>)
- M [src/app/modules/Staff/StaffOverTime/components/list/list.component.spec.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffOverTime/components/list/list.component.spec.ts>)
- M [src/app/modules/Staff/StaffOverTime/components/list/list.component.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffOverTime/components/list/list.component.ts>)
- M [src/app/modules/Staff/StaffOverTime/services/staffovertime.service.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffOverTime/services/staffovertime.service.ts>)
- M [src/app/modules/Staff/StaffOverTime/staffovertime.routes.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffOverTime/staffovertime.routes.ts>)
- D src/app/modules/Staff/StaffPartner/components/details/details.component.html (removed)
- D src/app/modules/Staff/StaffPartner/components/details/details.component.scss (removed)
- D src/app/modules/Staff/StaffPartner/components/details/details.component.spec.ts (removed)
- D src/app/modules/Staff/StaffPartner/components/details/details.component.ts (removed)
- D src/app/modules/Staff/StaffPartner/components/list/list.component.html (removed)
- D src/app/modules/Staff/StaffPartner/components/list/list.component.scss (removed)
- D src/app/modules/Staff/StaffPartner/components/list/list.component.spec.ts (removed)
- D src/app/modules/Staff/StaffPartner/components/list/list.component.ts (removed)
- D src/app/modules/Staff/StaffPartner/models/create.ts (removed)
- D src/app/modules/Staff/StaffPartner/models/details.ts (removed)
- D src/app/modules/Staff/StaffPartner/models/list.ts (removed)
- D src/app/modules/Staff/StaffPartner/services/staffpartner.service.ts (removed)
- D src/app/modules/Staff/StaffPartner/staffpartner.routes.ts (removed)
- A [src/app/modules/Staff/StaffStatementOfAccount/components/allocation/staff-allocation-dialog.component.html](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffStatementOfAccount/components/allocation/staff-allocation-dialog.component.html>)
- A [src/app/modules/Staff/StaffStatementOfAccount/components/allocation/staff-allocation-dialog.component.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffStatementOfAccount/components/allocation/staff-allocation-dialog.component.ts>)
- M [src/app/modules/Staff/StaffStatementOfAccount/components/list/list.component.html](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffStatementOfAccount/components/list/list.component.html>)
- M [src/app/modules/Staff/StaffStatementOfAccount/components/list/list.component.scss](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffStatementOfAccount/components/list/list.component.scss>)
- M [src/app/modules/Staff/StaffStatementOfAccount/components/list/list.component.spec.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffStatementOfAccount/components/list/list.component.spec.ts>)
- M [src/app/modules/Staff/StaffStatementOfAccount/components/list/list.component.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffStatementOfAccount/components/list/list.component.ts>)
- M [src/app/modules/Staff/StaffStatementOfAccount/services/staffstatementofaccount.service.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffStatementOfAccount/services/staffstatementofaccount.service.ts>)
- M [src/app/modules/Staff/StaffStatementOfAccount/staffstatementofaccount.routes.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffStatementOfAccount/staffstatementofaccount.routes.ts>)
- M [src/app/modules/Staff/StaffTimesheet/components/details/details.component.html](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffTimesheet/components/details/details.component.html>)
- M [src/app/modules/Staff/StaffTimesheet/components/details/details.component.scss](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffTimesheet/components/details/details.component.scss>)
- D src/app/modules/Staff/StaffTimesheet/components/details/details.component.spec.ts (removed)
- M [src/app/modules/Staff/StaffTimesheet/components/details/details.component.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffTimesheet/components/details/details.component.ts>)
- M [src/app/modules/Staff/StaffTimesheet/components/list/list.component.html](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffTimesheet/components/list/list.component.html>)
- M [src/app/modules/Staff/StaffTimesheet/components/list/list.component.scss](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffTimesheet/components/list/list.component.scss>)
- D src/app/modules/Staff/StaffTimesheet/components/list/list.component.spec.ts (removed)
- M [src/app/modules/Staff/StaffTimesheet/components/list/list.component.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffTimesheet/components/list/list.component.ts>)
- M [src/app/modules/Staff/StaffTimesheet/models/create.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffTimesheet/models/create.ts>)
- M [src/app/modules/Staff/StaffTimesheet/models/details.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffTimesheet/models/details.ts>)
- M [src/app/modules/Staff/StaffTimesheet/models/list.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffTimesheet/models/list.ts>)
- M [src/app/modules/Staff/StaffTimesheet/services/stafftimesheet.service.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffTimesheet/services/stafftimesheet.service.ts>)
- M [src/app/modules/Staff/StaffTimesheet/stafftimesheet.routes.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Staff/StaffTimesheet/stafftimesheet.routes.ts>)
- M [src/app/pages/routing.ts](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/pages/routing.ts>)

### Backend source inventory

- M [SiGma.Business/IServices/Bases/IService.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/IServices/Bases/IService.cs>)
- M [SiGma.Business/MapperConfig/StaffDesignationProfiler.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/MapperConfig/StaffDesignationProfiler.cs>)
- M [SiGma.Business/MapperConfig/StaffProfiler.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/MapperConfig/StaffProfiler.cs>)
- M [SiGma.Business/MapperConfig/StaffTimesheetProfiler.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/MapperConfig/StaffTimesheetProfiler.cs>)
- M [SiGma.Business/Services/AdministrationsServices/ImportDataService.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/AdministrationsServices/ImportDataService.cs>)
- M [SiGma.Business/Services/Bases/Service.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Bases/Service.cs>)
- A [SiGma.Business/Services/StaffServices/StaffAccountLookup.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffAccountLookup.cs>)
- M [SiGma.Business/Services/StaffServices/StaffDesignationService.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffDesignationService.cs>)
- M [SiGma.Business/Services/StaffServices/StaffService.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffService.cs>)
- M [SiGma.Business/Services/StaffServices/StaffTimesheetService.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StaffServices/StaffTimesheetService.cs>)
- M [SiGma.Business/Services/VouchersServices/CreditNoteService.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/VouchersServices/CreditNoteService.cs>)
- M [SiGma.Business/Services/VouchersServices/InvoiceService.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/VouchersServices/InvoiceService.cs>)
- M [SiGma.Business/Services/VouchersServices/JournalVoucherService.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/VouchersServices/JournalVoucherService.cs>)
- A [SiGma.DataAccess/Configuration/StaffBankAccountConfig.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/StaffBankAccountConfig.cs>)
- M [SiGma.DataAccess/SiGmaDbContext.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/SiGmaDbContext.cs>)
- M [SiGma.Helpers/Localization/Shared/GeneralMessage.ar-SA.resx](<F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Localization/Shared/GeneralMessage.ar-SA.resx>)
- M [SiGma.Helpers/Localization/Shared/GeneralMessage.resx](<F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Localization/Shared/GeneralMessage.resx>)
- M [SiGma.Helpers/Models/Staffs/Staff.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/Staffs/Staff.cs>)
- A [SiGma.Helpers/Models/Staffs/StaffBankAccount.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/Staffs/StaffBankAccount.cs>)
- M [SiGma.ServerAPI/Controller/ImportDataController.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Controller/ImportDataController.cs>)
- M [SiGma.ServerAPI/Controller/SiGmaControllerBase.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Controller/SiGmaControllerBase.cs>)
- M [SiGma.ViewModels/ViewModels/Staff/StaffAddVm.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Staff/StaffAddVm.cs>)
- M [SiGma.ViewModels/ViewModels/Staff/StaffDetailVm.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Staff/StaffDetailVm.cs>)
- M [SiGma.ViewModels/ViewModels/Staff/StaffImportVM.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Staff/StaffImportVM.cs>)
- M [SiGma.ViewModels/ViewModels/Staff/StaffListVm.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Staff/StaffListVm.cs>)
- M [SiGma.ViewModels/ViewModels/Staff/StaffSalaryPackageVm.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Staff/StaffSalaryPackageVm.cs>)
- A [SiGma.ViewModels/ViewModels/Staff/StaffSalaryRevisionResponseVm.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Staff/StaffSalaryRevisionResponseVm.cs>)
- M [SiGma.ViewModels/ViewModels/Staff/StaffUpdateVm.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Staff/StaffUpdateVm.cs>)
- A [SiGma.ViewModels/ViewModels/StaffBankAccount/StaffBankAccountAddVm.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/StaffBankAccount/StaffBankAccountAddVm.cs>)
- A [SiGma.ViewModels/ViewModels/StaffBankAccount/StaffBankAccountDetailVm.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/StaffBankAccount/StaffBankAccountDetailVm.cs>)
- A [SiGma.ViewModels/ViewModels/StaffBankAccount/StaffBankAccountUpdateVm.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/StaffBankAccount/StaffBankAccountUpdateVm.cs>)
- M [SiGma.ViewModels/ViewModels/StaffDesignation/StaffDesignationAddVM.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/StaffDesignation/StaffDesignationAddVM.cs>)
- M [SiGma.ViewModels/ViewModels/StaffDesignation/StaffDesignationDetailVM.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/StaffDesignation/StaffDesignationDetailVM.cs>)
- D SiGma.ViewModels/ViewModels/StaffDesignation/StaffDesignationFullListVM.cs (removed)
- M [SiGma.ViewModels/ViewModels/StaffDesignation/StaffDesignationListVM.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/StaffDesignation/StaffDesignationListVM.cs>)
- M [SiGma.ViewModels/ViewModels/StaffDesignation/StaffDesignationUpdateVM.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/StaffDesignation/StaffDesignationUpdateVM.cs>)
- M [SiGma.ViewModels/ViewModels/StaffTimesheet/StaffTimesheetAddVm.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/StaffTimesheet/StaffTimesheetAddVm.cs>)
- M [SiGma.ViewModels/ViewModels/StaffTimesheet/StaffTimesheetDetailVm.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/StaffTimesheet/StaffTimesheetDetailVm.cs>)
- D SiGma.ViewModels/ViewModels/StaffTimesheet/StaffTimesheetFullListVm.cs (removed)
- M [SiGma.ViewModels/ViewModels/StaffTimesheet/StaffTimesheetListVm.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/StaffTimesheet/StaffTimesheetListVm.cs>)
- M [SiGma.ViewModels/ViewModels/StaffTimesheet/StaffTimesheetUpdateVm.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/StaffTimesheet/StaffTimesheetUpdateVm.cs>)
