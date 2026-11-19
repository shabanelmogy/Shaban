# Financial Report Settings — implementation and reconciliation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Date2026-10-23. Authorized implementation of the owner's CF-01 proposal,
professional Financial Report Settings, dynamic defaults, type-filtered actual
accounts and per-year independent configuration with automatic detached next-year
inheritance. Exact handoff: FINANCIAL_REPORT_SETTINGS_DOMAIN_API_CONTRACT_FREEZE.md;
owning plan: FINANCIAL_REPORT_SETTINGS_MAINTENANCE_EVOLUTION_PLAN.md.

## Manifest / evidence

TierL, Phases0–6 as applicable. CF-01 functional evidence/column table and prior
owner decisions are in the plan. Current approval explicitly freezes indirect
net-profit start, opening baseline, exclusion of cash-internal transfers,
unresolved-allocation disclosure and cash reconciliation. No compliance claim or
journal-writer repair is implied. Existing user/peer changes, including generated
classification migration/snapshot, remain outside edit ownership.

Selected UI screen06 routed settings workspace (UI1/13/14/16) plus screen07
complete report (UI20/21); backend BE16 keyed settings through IServiceHelper and
BE17 read-only calculation. New row modal uses scalar fields/multiselects, not
two independently edited child collections. Existing AccountSetting continues to
own Group/SubGroup/Type; detailed type creation is reused by navigation.

## Conformance before implementation

| Concern | Book | Actual reference / shared owner | Target |
|---|---|---|---|
| Bounded settings shell | UI1 settings exception | Accounts/Link Accounts/LinkAccounts/components/details; FeatureTitle/EditorTabs | Fixed header/actions/year/cash scope, one internal content viewport |
| Row editor | UI13/19 | EditorDialogComponent public title/subtitle/mode/actions; FieldError | Typed scalar and multiselect controls, translated header/subtitle, dirty recovery |
| Choices | BE8/10/16; UI16 | AccountSelectionPolicy/AccountTypeClassifier; typed PrimeNG multiselect | Same eligible tenant/posting/type placement predicate in lookup and Save |
| Persistence | BE16/14 | IServiceHelper.UpsertByKeyAsync; NotificationsSettingsModelService and EmailTemplateService | Header keyed by year; no omitted definition deletion; owned children reconciled before one Save |
| Fiscal-year creation | BE5/18 | FiscalYearService.AddAsync serializable existing transaction | Save year and independent report snapshot atomically; settings initializer reuses caller transaction |
| Setup | BE5/18 | SeedDataService outer Account unique-write transaction | Initialize all existing years chronologically after type setup; preserve configured years |
| Statement | BE17; UI20 | Existing CashFlowStatement and Accounts shared report family/DataTable | One backend result, complete statement, cash proof, diagnostics, same print/export scope |
| Namespaces / DI | Master5; BE5/6 | Business GlobalUsing, API DependencyResolver, profiles/config assembly scans | Every new public type own file; internal helper records avoid service scan; exact imports and project inclusion |
| Guide | Master7 | Existing Accounts UserGuide reader/content | Explain final route/actions and actual financial limits in both languages |

## Root integration decisions

FiscalYearService keeps its existing date-overlap serializable transaction;
EnsureForFiscalYearAsync runs after the year identity save and before commit. A
failed snapshot result rolls back year creation. Unified SeedDataService invokes
the same idempotent owner for all live tenant years ordered by start/date identity,
inside its existing outer Account transaction, after account-type initialization.
No startup/database seeding or read mutation is introduced. New-chart setup with
no fiscal year creates none; later fiscal-year creation supplies its template.

## Work ownership

- Root: scope/freeze, FiscalYearService/SeedDataService integrations, shared backend
  resource additions, Accounts guide and final full scoped reconciliation.
- cashflow_settings, gpt-5.6-sol: five normalized entities/configs/DbSets, separate
  settings VMs/maps/interface/service/controller and constrained enums/catalog.
- report_rollup, reused gpt-5.6-sol: dedicated read-only engine, cash-flow-only
  existing-service delegation, report VMs/diagnostics and literal-ID retirement.
- cashflow_ui, inherited model: FinancialReportSettings workspace/row editor,
  typed client/route/sidebar/explicit app compile roots, new bilingual vocabulary,
  CashFlowStatement complete consumer/print/export adaptation.

Root froze every consumed cross-layer contract before implementation delegation.
Three bounded non-overlapping streams reduce wall time; root retains integration
and final decision accountability. No worker may modify migrations/snapshots or
other workers' files. Existing dependency/reference modules are inspected only.

## Final reconciliation

| Comparison | Final source outcome |
|---|---|
| Evidence / owner requirements | Thirteen editable bilingual default rows in Operating/Investing/Financing; explicit actual accounts filtered by allowed definition IDs; cash scope separate. Screenshot example accounts were not copied. |
| Per-year settings | Five normalized tenant tables, unique live year/header and row/mapping keys, Restrict FKs. New year clones the latest earlier live tenant year's persisted graph with new identities. Subsequent edits stay in the chosen year. Existing-year Initialize captures a copy once; GET never seeds. |
| Template/bootstrap | No old literal database identities. Default account selections and cash scope start empty for deliberate configuration. The existing19 semantic roles cover allowed-type filtering; no extra enum was necessary. Empty template type sets can be repaired only by explicit setup/Initialize when no types or accounts were selected, filtered by the row's current method/activity. |
| Exact lookup / Save | Actual live eligible tenant posting account and valid active type/group placement; explicit type membership and snapshot agreement. Only the explicitly selected cash set is excluded from row targets: a BankAndCash account outside that set is not silently declared cash. Every supplied ID is validated, duplicate roles rejected including disabled/retained rows. |
| Retained definitions | Save validates the effective merged incoming+omitted row set against the new cash scope. Omitted rows are retained; explicit Delete removes the selected row and mapping children only. Owned mapping children use set difference, retaining unchanged identities and avoiding unnecessary delete/reinsert churn. |
| Stale references | Raw persisted IDs remain visible with typed warnings, excluded from valid options and rejected by Save until explicitly corrected. This feature-specific disclosure preserves inheritance/history and allows the engine to flag invalid setup; it is not a selectable-invalid-account exception or weakened validator. Read also warns on live types incompatible with current method/activity. |
| Namespace / registration | New named .NET types are in individual files; internal helper records/classes are excluded from public service scan. Explicit API/Business/Helpers imports and SDK project references/default inclusion checked. Existing DI/profile/sealed EF config assembly scans own registration; no duplicate root provider. Compiler success remains unverified. |
| Transactions | Ordinary settings Save/Delete: one Save under existing tenant unique-write guard. Year creation: existing serializable outer transaction covers the initial year save and settings save. Unified account setup calls Ensure for tenant years chronologically inside its existing outer transaction. Failed stage results prevent outer commit. |
| Report delegation | Existing AccountReports/CashFlow route delegates only its cash-flow operation to ICashFlowReportService; prior income/hierarchy fixes retained. Unused CashFlowAccountCodes retired after scoped consumer search. |
| Calculation | Net-profit start; NonCashAdjustment reverses selected P&L raw net-debit contribution, WorkingCapitalChange uses negative period raw net-debit change excluding opening/closing, CashMovement uses deterministic actual selected-cash counterpart amounts. P&L CashMovement targets get a named operating profit adjustment before their actual cash movement, avoiding double expense/income. |
| Cash proof | Backend returns beginning/ending cash, net change, difference, unresolved absolute diagnostic amounts and status. Cash balances aggregate in SQL; attribution uses one bounded raw period projection to preserve journal-leg signs. Posted/nonvoided tenant detail/JV scope, accounting date half-open cutoff, selected fiscal/as-of validation; no active-account filter erases historical amounts. |
| Opening / noncash | First-day current-year OpeningBalanceJV is baseline; period opening/closing entries do not enter movements. Unexpected opening or cash-bearing closing entries are flagged. Pure internal cash transfer creates no external flow. No arbitrary proportional split or balancing row. |
| Ambiguity | All CashMovement rows, including Operating, participate in mixed working-capital source checks. Source scan includes prior ledger history for settlement warnings and keeps newest qualifying source. A balanced noncash source whose legs all map to one CashMovement row with its dedicated settlement account is not falsely blocked; later settlement supplies its actual cash amount. Unsupported/mixed legs and mappings remain diagnostics. |
| Zero-difference safety | IsReconciled requires ledger-rounded zero difference AND no diagnostics; offsetting unresolved entries cannot create false acceptance. Unbalanced period journals receive one structural diagnostic and are skipped by later semantic classification passes. A diagnostic amount0 can still require review. |
| UI / failure handling | Shared fixed shell/tabs/DataTable/EditorDialog, typed forms and PrimeNG choices, one internal row scroll owner. Dirty workspace, row, year-switch and route-exit guards; pristine/view dialog may leave silently. Loading/failure/retry release state, both failure channels retain draft; required option failures block Save. Global existing success interceptor is sole mutation success-feedback owner. |
| Report/print/Excel | Existing complete activity statement/ledger links retained. Cash proof, provisional/reconciled status and diagnostic journal/date/amount/reason included in same response and print/Excel. Typed shared export helper formats diagnostic dates and money consistently; no frontend financial re-sum. Synthetic net-profit row has stable key so it is not duplicated. |
| Integration | FinancialReportSettings route and Accounts sidebar entry present. Workspace/dialog and changed CashFlow component have explicit runtime compile roots; no broad application include/test roots. EN/AR vocabulary imported into current dictionaries. |

### Grid / DTO / form comparison

| Surface | Visible columns / controls | Exact read / write members |
|---|---|---|
| Settings grid | Actions; localized name; method; allowed type names; account names; order; enabled; warnings | RowDetail key,name,nameLocalized,activity,method,sortOrder,isEnabled,allowedTypeIds,accountIds,warnings. Activity selects its tab; key is stable action identity. No generic ListVM/paging. |
| Row editor | Names, activity, method, allowed types, actual accounts, order, enabled | RowInput key,name,nameLocalized,activity,method,sortOrder,isEnabled,allowedTypeIds,accountIds only. No tenant/audit/calculated writable fields. |
| Workspace | Fiscal year, cash account set, inherited source-year label, warnings | Route fiscalYearId; Save cashAccountIds,rows; Detail isConfigured,inheritedFromFiscalYearId,warnings are server-owned display. |
| Cash report | Existing statement name/amount, backend cash proof/status, diagnostic journal/date/amount/reason | CashFlowVm existing fields plus fiscalYearId,beginningCash,endingCash,reconciliationDifference,isReconciled,unresolvedAmount,diagnostics. Line rowKey/nameLocalized added; diagnostics journalVoucherId,date,amount,reason. |

### Actions / mapping / domain decisions

GET/Options are authenticated read-only, no mutation. Save owns submitted scalar
fields and child mappings, retaining omitted definitions. Initialize is explicit
and idempotent, with no existing-choice overwrite. Delete is row-specific and
confirmed; deleting an unsaved row changes only the draft. Editing historical
year settings is allowed by the owner and restates that year's reports only;
no new close/reopen/permission restriction was invented. API Permission Catalog
currently describes candidates; this feature does not add authorization grants
or claim hidden controls secure the API.

AutoMapper maps header upsert and row editable scalars explicitly, ignores tenant,
identity/audit/navigation and stable row key, and maps only displayed settings
read data. Owned collections are reconciled by their owning service before the
save; no request-created detached graph is trusted for ownership.

### Audits integrated

Implementation workers' source was reviewed by root. Bounded final independent
read audits used settings_audit/ui_audit (gpt-5.6-luna) and engine_audit
(gpt-5.6-sol). Corrected: merged retained-row conflicts, method/activity checks
even for empty disabled rows, type-method read warnings, server name/key trim,
deleted fiscal-year inheritance, stable net-profit key, special-voucher exclusion
from association scan, raw zero-net counterpart detection, all-activity mixed
source detection, same-row noncash settlement handling, unbalanced diagnostic
deduplication, localized dialog subtitle, route-exit dialog discard, explicit
report runtime root and typed date/money export.

Auditor suggestions were reconciled against current source and the frozen
contract rather than accepted blindly: null rows were already guarded before
key extraction; optional account NameLocalized exists (null because Account has
no separate localized-name storage); invalid saved IDs intentionally remain
warning metadata but never options; noncash scope is the explicit chosen set.
The recursive extended report-row type was made explicit for clarity; source
inspection does not establish a compiler error or successful compilation.

### Files and reusable documentation

Backend: five CashFlowReport* model/config files plus DbSets; two constrained
enums; FinancialReportSettings VM folder, interface/service, internal catalog/
eligibility/header-upsert helpers, profile/controller; CashFlowReportService and
five internal own-file report projections, ICashFlowReportService, report VMs;
FiscalYearService/SeedDataService integration and51 initial + one period-guard
EN/AR resource entries. CashFlowAccountCodes has no remaining live caller and
is removed. All unrelated prior modifications and owner migrations/snapshot kept.

Frontend: new FinancialReportSettings route/models/service/workspace/row-dialog;
CashFlowStatement typed model/component; routing/sidebar/explicit roots; new
financial-report-settings vocabulary imported in en.ts/ar.ts; Accounts guide.

Reusable lessons promoted to BE16/17, screen skill with dated revision and
documentation CHANGELOG: detached partition snapshots/effective-set validation,
raw-leg cash attribution with authoritative unresolved diagnostics. Regenerated
PLAN00 and PHASE00–06 using generator, reviewed updated BE16/17 provenance and
unchanged approved-reference roles, then all recipe Check results OK. Generated
files were never directly edited.

### In-app guide completion

Updated bilingual content in
SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/accounts-guide.ts, existing
reader /UserGuide/accounts and existing Accounts guide sidebar entry. New topic
links /FinancialReportSettings and /CashFlowStatement explain year inheritance,
independent edits, explicit cash scope, type-filtered actual account selection,
three methods, template/Initialize/Save/Delete/discard, stale references,
posted-ledger limits, beginning/ending cash and unresolved diagnostics. Source
conformance reviewed; runtime/visual/keyboard/mobile/theme/RTL acceptance pending.

### Verification and owner handoff

Source-only review includes complete scoped changes in both repositories,
new files, namespace/import/project resolution, API/forms/DTOs, route/sidebar/
compile roots, consumer retirement, translations, guide and whitespace checks.
EN/AR resource XML parsed with no missing used new key or duplicate names.
No build/test/lint/runtime/browser/database/migration/commit/push/deploy command
was run. No actual stored fiscal-year/account setting or ledger record changed
through tools.

Owner must generate/review/apply migration AddFinancialReportCashFlowSettings:
five tenant tables, filtered unique indexes and Restrict relations including
nullable inherited source-year reference; existing classification migration is
separate and untouched. Then build backend/Angular and verify:

1. Fresh year defaults; explicit existing-year Initialize; FY-before-chart empty
   type repair; repeated/concurrent setup; failed settings stage rolls back year.
2. Configure yearA, create yearB, compare copied values but distinct setting/row/
   child IDs, edit each independently. Deleted source years are not copied.
3. Save stale/duplicate/cross-tenant/type-incompatible IDs; omitted definition
   conflicts; no-change Save keeps mapping IDs; failed Save retains draft.
4. Source-known cash examples: net cash sale/expense, credit sale/collection,
   purchase/payable/payment, noncash adjustment, asset with dedicated settlement,
   loan principal/interest, cash transfer and compound/mixed-sign journal.
5. Opening-only first day, last-day timestamps/as-of cutoff, cash-bearing closing,
   unbalanced journal, offsetting ambiguous rows and latest mixed-purpose source.
   Reconciled status must require both zero difference and zero diagnostics.
6. View/Edit/Add/Delete/Initialize, dirty dialog/year/route exits, retries, both
   languages/themes/mobile, ledger links and complete formatted print/Excel.

Known limits: this is the explicitly approved net-profit-based indirect policy,
not a universal IAS7/IFRS18 compliance claim. Complex mixed-purpose settlements
may require a dedicated account mapping or accounting review; no journal-level
manual allocation/override or invented proportional split is supplied. The
existing general Payment writer's incomplete journal coverage is documented
backlog BE19 item20 and remains outside this feature: only posted ledger effects
enter the report. Performance/SQL translation/concurrency require owner runtime
acceptance; source arithmetic is not an executed accounting test.

Suggested commits only: backend `feat(accounts): configure fiscal-year cash flow and reconciliation`;
frontend `feat(accounts): add financial report settings and cash-flow diagnostics`;
documentation `docs(accounts): document yearly report settings and attribution guards`.

Final check evidence: backend and frontend `git diff --check` exit0; scoped
documentation diff check exit0 (line-ending advisories only). Both resource XML
files parsed; every used new feature message key exists, with no duplicate names.
PLAN00 and PHASE00–06 all Check OK after regeneration; PHASE03 includes updated
BE16 provenance and PHASE02 updated BE17 provenance. Root reviewed the final
audit corrections; no unapproved shared component/reference modification or
remaining frozen source-contract gap was identified. Owner verification remains
pending as stated above.

## Follow-up — owner-reported export TS2345, 2026-10-23

TierS correction in CashFlowStatement list.component.ts only. The owner supplied
Angular compiler evidence: synthetic total-row literals inferred a narrower key
set than CashFlowLine, while the export columns carry keyof CashFlowLine,
including its optional localized-name/key fields. Set the existing shared
dataTableExportRows generic argument explicitly to CashFlowLine at the totals
call; the literal rows satisfy that model and columns now consume the same type.
No casts, any, shared-helper change, payload/schema/financial/formatting change.
UI2/8 and Master5 type-safety gate apply; actual generic helper signature and
model optional members inspected. Other two export calls already receive typed
CashFlowLine/CashFlowReportRow arrays. In-app guide remains accurate because user
workflow is unchanged; no guide source edit needed. No delegation for this small
sequential fix. Recipe Check all eight OK; scoped diff/whitespace source review
only, no build/test/lint/browser/database/migration commands. Owner compiler
rerun remains pending. Suggested frontend commit: fix(accounts): align cash-flow
total export generic with its columns.

## Follow-up — compact presentation and documentation, 2026-10-23

TierS owner amendment: the Financial Report Settings page gives unnecessary
space to explanations and too little to important controls/data; the owner also
requested this presentation preference in the documentation. Frozen domain/API,
financial calculations, fiscal-year inheritance and payloads remain unchanged.
One coherent UI composition change; no delegation or additional freeze artifact.

| Concern | Book / actual reference and shared owner | Final target reconciliation |
|---|---|---|
| Workspace bounds | UI1/3; LinkAccounts details sigma-list-panel--workspace, FeatureTitle and EditorTabs | Same header/actions/tabs and one filled DataTable viewport; omit only the optional explanatory page subtitle, retain record-identifying modal subtitle |
| Year and cash selection | UI4; FilterPanelComponent mainColumns/inlineActions/resetRequested | Independent typed forms and both Reset handlers retained; structural grid 1:2 with 16rem year minimum, stacks at viewport900px; no private card/control styling |
| Useful table width | UI6; DataTableColumn width/value/cellClass inputs | Accounts42%, or30% plus12% real warnings; name16%, method14%, types16%, order/enabled6% each. Show first two types plus translated count; full lists remain in View/Edit. Empty warning column removed only when active rows have no warnings |
| Selection summaries | UI13/16; installed PrimeNG21 MultiSelect maxSelectedLabels/selectedItemsLabel | Editable selectors show up to two labels then localized {0} count; no repeated full selected list. Disabled View retains full names in wrapped text because its selector cannot be opened |
| Corrective content | UI19; existing warnings/FieldError/StateMessage | Existing server warnings and validation retained; unavailable selected IDs/names explicitly visible, including cash scope. Brief account uniqueness rule retained; long usage guidance remains in Accounts UserGuide |
| Languages and guide | Master7; financial-report-settings vocab and accounts-guide | Both languages updated; guide explains layout, counts/full choices and conditional warnings |

Responsive/source reconciliation: the controls wrapper uses min-width0 tracks
and8px shared-aligned gap; at900px and below it is one column. The shared filter
owner still controls its own720px action stacking, sizes, palettes, labels and
RTL. The existing modal grid keeps four/two/one columns at its original1024/700
breakpoints; account/type selectors remain full-width. No new overflow owner,
fixed content height, widget skin, color, font or control-size override was added.
Both directions and themes continue through the same shared components. Actual
fit at breakpoint neighbours and long EN/AR labels remains owner-pending.

General lesson promoted in Master5 "Space for task content", UI3 optional
subtitle, screen skill essential checks/revision and documentation CHANGELOG.
No general widget behavior needed changing: existing shared public layout and
selection-summary inputs provide the capability. The owner scoped source edits
to this screen; the documentation gate applies to subsequent new/scoped reviews.
All eight derivative packets regenerated through Generate-SigmaRecipes and
Check OK. Semantically reviewed Master5 provenance in PHASE03/06 and UI3 in
PHASE02; current shape-specific contracts/templates remain intact. Existing
unrelated book/template changes were preserved, not reauthored by this amendment.

Source-only handoff: scoped source and documentation reviewed; git diff --check
passed for tracked guide/documentation, direct whitespace check for untracked
feature files. No build, test, lint, runtime, browser, database or migration run.
Owner verification pending: compilation and visual/keyboard acceptance for wide,
intermediate and narrow sizes in both languages/themes, counts/opening selectors,
read-only full lists and stale-selection warnings.

## Follow-up — restore full-width strips, 2026-10-23

TierS owner correction supersedes the preceding 1:2 controls arrangement:
the year/search strip and cash selector strip each retain the full available
workspace width at every breakpoint. The controls wrapper now has one minmax0
grid track; the900px two-to-one breakpoint is removed. Shared FilterPanel still
owns inline actions, Reset, control heights, theme/RTL and narrow action wrapping.
UI screen06 settings workspace and UI3/4 apply; actual LinkAccounts details shell
and shared FilterPanel layout inspected. No backend/API/financial changes.

The bilingual Accounts guide is updated. Master5 and the skill clarify that
shortening explanations does not authorize narrowing a full-width filter strip;
CHANGELOG records the owner correction. Existing earlier decisions remain as
history. No delegation for this bounded layout fix. Source-only reconciliation:
one full-width track, no fixed/max width or private shared-component style,
existing forms and reset/selection handlers unchanged. Regenerated derivative
packets and Check verified below; build/runtime/visual acceptance remains pending.

Final evidence: all eight packet checks OK; PHASE02/06 Master5 provenance matches
the clarified block. Scoped tracked guide/documentation diff --check exit0;
final SCSS inspected with one track and no breakpoint width reduction. No build,
test, browser or database command was run.

## General company settings — owner scope amendment, 2026-10-23

Status: Implemented — source-only. Owner verification pending: yes.

Owner replaces the prior annual settings/copy-forward design with one general
company definition, including cash flow. Initial development and planned old-data
cleanup remove the need for an annual conversion wizard. New frozen handoff:
FINANCIAL_REPORT_SETTINGS_GLOBAL_SCOPE_CONTRACT_FREEZE.md. This supersedes only
the earlier fiscal-year scope/lifecycle; prior decisions remain historical. The
larger Income/Balance editable-row expansion and company cleanup screen remain
separate Draft plans, not implemented by this bounded slice.

### Final contract/source reconciliation

| Concern | Canonical owner / actual source | Final implementation |
|---|---|---|
| Scope/persistence | BE1/2/16; CashFlowReportSetting + config | One live tenant header, unique filtered SubscriptionId index; no fiscal-year/inheritance properties, navigations or FKs. Owned cash/row/type/account references unchanged. |
| Singleton save | BE16; IServiceHelper.UpsertSingleAsync, FinancialReportSettingsService.UpsertHeaderAsync | Header created/retrieved through the existing shared helper; owned children reconciled in the existing guarded action/save. No direct settings save loop or new persistence owner. |
| Ambiguous old rows | BE8 + frozen explicit duplicate policy; ValidateSingleConfigurationAsync | Multiple live headers return localized409 before Get/Save/Ensure/Delete. No arbitrary chosen year, silent merge or deletion. Owner says old development data will be deleted; agents did not execute cleanup. |
| API | BE3/6; IFinancialReportSettingsService + controller | GET/PUT FinancialReportSettings root, GET Options, POST Initialize, DELETE Rows/{key}; no year argument/compatibility alias. Detail fields IsConfigured,CashAccountIds,Rows,Warnings match Angular. |
| Explicit initialization | BE16; EnsureAsync/InitializeAsync | GET is unsaved template/read only. Explicit initialization completes defaults idempotently without overwriting configured choices; existing row/mapping validators remain. |
| New/existing chart | SeedDataService.EnsureFinancialReportSettingsAsync | Ensure general settings once after classification, even with no fiscal year; reuse owning account transaction, preserve current definitions. |
| Fiscal-year creation | FiscalYearService.AddAsync | Remove settings dependency and annual creation/copy. Preserve its existing fiscal overlap/period behavior and transaction; unrelated concurrent grid-filter source kept. |
| Cash-flow report | BE17; CashFlowReportService.GetCashFlowIndirectAsync | Loads settings without a year. Fiscal-year/as-of filters and response metadata still choose accounting period/opening entries. No net-income/cash-leg/allocation/reconciliation arithmetic changed. |
| Frontend | screen06; actual FinancialReportSettings workspace, shared FilterPanel/DataTable/EditorDialog | Remove year form/select/lookup/state and inherited messages; load singleton on entry and Retry. Keep full-width cash selector, compact shared table/dialog, one scroll owner and current activity tabs. No unused annual-view placeholder. |
| Columns and VMs | Existing settings table + CashFlowReportRowDetailVM/Angular CashFlowReportRow | Display name/method/allowedTypeIds/accountIds/sortOrder/isEnabled and conditional warnings, with stable key identity. Fields remain compatible; no new read-grid contract. |
| State/feedback | UI22/28; component + existing interceptor | Retain cancellation/request-version gates, draft/active-dialog preservation, both failure channels, disabled competing actions/route guards and one mutation success-feedback owner. |
| User guide | Master7; accounts-guide.ts /UserGuide/accounts | Bilingual general-company scope, explicit initialization, settings changes applying to historical reports, retained report-period controls; no annual-copy claim. |

### Verification and delivery limits

Backend worker owns only settings entity/config/VM/header/map/service/interface/
controller and duplicate-config messages. Frontend worker owns only existing
settings folder/vocabulary. Both inherited the current model because mapped
explorer models were not available and were reused after bounded discovery;
independent frozen contracts permit parallel work without shared-file edits.
Root owns caller integration, guide, docs, scoped review and final decisions.

Namespaces/imports, actual Business global imports, existing SDK source inclusion
and project references inspected; no new named type/file added. AutoMapper drops
removed year/navigation members, preserves existing owned-child mapping guards.
Scoped search finds no EnsureForFiscalYear, inherited/year DTO or settings-year
frontend reference in the changed application owners. Cash-flow period fields
remain deliberately present. Existing route/sidebar/explicit tsconfig runtime
entries continue to use the same screen. Resource XML parses with no duplicate
keys; company wording replaces the stale report configuration error in EN/AR.

Changed settings sources are mostly pre-existing untracked files, so their
complete final source was read directly; an empty tracked diff is not evidence.
Tracked backend/frontend diffs inspected independently, preserving concurrent
user/peer changes. Scoped whitespace/merge-marker checks pass. No migration or
model snapshot was changed. Existing annual migration files remain historical
and owner-controlled.

BE16 and the screen skill now explicitly distinguish report period filters from
configuration scope. All eight packets regenerated only through the generator;
semantic review confirms the updated BE16 provenance in PHASE01/03 and unchanged
settings/report/shared-owner responsibilities. Final eight-packet -Check passes.
Phases0/1/3/4/5/6 apply proportionally; no new list/filter/screenshot extraction.

The schema must be updated before using this source against a database created
with the old annual header. Owner migration suggestion:
`Add-Migration MakeFinancialReportSettingsGlobal`. It removes year foreign keys/
columns and replaces the tenant/year unique index with the tenant singleton
index. Deleting application data alone does not update that schema. Owner will
apply the migration/recreate development database as appropriate; no commands
were run here, and no historical rows were migrated/deleted.

Pending owner acceptance: compile both projects; open settings before any fiscal
year exists; initialize/save/reopen/delete a definition; rerun seed unchanged;
create another fiscal year and prove no second settings header; confirm two
tenants are isolated and duplicate headers fail clearly; compare cash-flow for
different periods with the same cash/row settings; verify screen/print/export
amounts/diagnostics, dirty/route/cancellation and RTL/themes/responsive behavior.

Suggested commits only: backend `refactor(accounts): make financial report
settings company-wide`; frontend `refactor(accounts): remove settings fiscal-year
selection`; docs `docs(accounts): distinguish report period and settings scope`.
No build/test/lint/browser/database/migration/commit/deployment or cleanup action
was executed. Source-only delivery does not establish runtime/numeric acceptance.

### Reported dependent compile diagnostics — 2026-10-23

Owner reports six CS1503 controller errors expecting former int year arguments,
alongside a real CS1503 producer error in Business InvoiceService. Current source
was inspected: settings interface, implementation and controller all use the same
yearless Get(ct), Save(vm,ct), DeleteRow(key,ct), Initialize(ct) contract. ServerAPI
imports Business.IServices through its actual GlobalUsing, references the Business
project, and SDK compile inclusion does not exclude the settings source. No source
signature mismatch or duplicate service declaration was found in the scoped owners.
Do not restore an int year argument to quiet stale dependent diagnostics.

The Invoice producer error is corrected in its owning review. A stale Business
assembly/reference after the failed producer compilation is a supported inference,
not a proven compiler result. Owner must rebuild Business successfully then
ServerAPI to verify these six diagnostics clear. No redundant controller/interface
edit, binary cleanup or build command was performed for the already-matching
settings sources. No behavior/guide/schema change in this diagnostic follow-up.

Repeated owner diagnostics now identify another Business producer failure:
AccidentService used searchModel inside typed SearchAsync. Corrected in the
shared-table remote-filter contract's bounded follow-up; list filters now pass
through a private search core, no settings signature was reverted. Current
settings interface/implementation/controller still agree on the yearless
contract. The six dependent int-argument diagnostics remain unverified until
Business builds successfully; source checks alone cannot claim they cleared.

## Statement components and control screen — 2026-10-23

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Frozen handoff | FINANCIAL_STATEMENT_COMPONENTS_DOMAIN_API_CONTRACT_FREEZE.md, including owner presentation refinement |

Owner approves fixed formulas/editable components, component-based sums, shared
control screen and monthly/as-of BS unification. Later instruction restricts the
new standard report presentation to BASIC IncomeStatement and preserves the other
reports' existing design. Earlier all-ten primary-view proposal is superseded
explicitly in the freeze; this review does not silently rewrite that history.
Company cleanup is not part of this implementation; no cleanup was executed.

### Shapes and reference conformance

| Concern | Book block | Actual reference / shared owner | Final source match |
|---|---|---|---|
| Settings shell | UI1/3/16, screen06 | Link Accounts/LinkAccounts/components/details; FeatureTitle, EditorTabs | Same bounded workspace/title action slot; three mounted report panels preserve drafts; cash activity panels retained. |
| Settings rows | UI6/16/22 | shared DataTable + FilterPanel | Complete local table, full-width search/category strips, named state feedback, one grid scroll owner. No custom grid/palette. |
| Row editor | UI13/19/27 | shared EditorDialog/FieldError/focusField | Typed form, separate screen title/record subtitle, shared close/discard path and body scroll. |
| Report | UI6/20/21, screen07 | TrailBalance/components/list + AccountReportPage/ReportActions/ReportPrintService | Basic income uses same shared table/print session; item/amount columns, section/subtotal/net row tones, retained details view. |
| Output view | Frozen owner refinement + UI21 | AccountReportPage export/print | Alternative statement/detail representation; output follows active view with print heading. This differs from section tabs that print all sections, as recorded in freeze. |
| Persistence | BE1–6/8/16 | FinancialReportSettingsService + IServiceHelper | Same tenant header, explicit save/ensure, owned selector reconciliation, one guarded save boundary, server flags protected from other-section writes. |
| Accounting | BE17 | AccountReportHelper + new projection/cutoff helpers | Immutable own vectors before rollup, authoritative formulas and signs, no synthetic ledger IDs, no journal rewrite. |

### Contract and final-source reconciliation

| Concern | Decision/evidence | Final producer and consumer |
|---|---|---|
| Scope | Owner general company definition | No fiscal-year setting field. Existing singleton carries statement flags and owned rows. Period/year filters remain report inputs only. |
| Definition grid ↔ DTO | Editable names/category/selectors/order/enabled, server count | Grid: name,category,groupIds summary,accountCount,sortOrder,isEnabled + View/Edit/Delete. Row Detail: key,name,nameLocalized,category,sortOrder,isEnabled,groupIds,subGroupIds,typeIds,accountCount. Save omits count and all tenant/audit/server state. |
| Options | Actual saved reporting definitions | Groups/SubGroups/Types include ID,bilingual label,category and applicable parent IDs. Detailed type options filter operational availability; membership preserves all live historical metadata independent of active state. |
| Membership | Union, distinct account IDs | Shared FinancialStatementMembership used by Save/count/layout; valid exact type placement or stable system-category/subgroup fallback. Legitimate own postings on parent accounts remain included. |
| Validation | Fixed statement categories, effective retained set | Annotation/category/order/key/selector checks, live tenant references, duplicate key/selector rejection. Omitted persisted rows retained; explicit Delete removes rows. Unconfigured virtual defaults are not silently retained on Save. |
| Overlap | No account in two same-statement rows, including disabled | Effective submitted + retained membership rejects overlap; resolver repeats guard for future accounts. Income/Balance/cash definitions remain independent. |
| Defaults | Existing system reporting structure | Explicit Ensure adds9 Income and5 Balance defaults once using saved subgroup names/IDs. Configured flags preserve intentionally empty sets. GET returns unsaved defaults and never saves. Existing chart seed calls Ensure after classification for new/existing chart, including no fiscal year. |
| First header | Ready-default owner intent | First statement Save or template Delete also creates cash default rows in the same save when header is new. It leaves cash selection unchosen; existing cash choices/empty definitions never reseed. |
| API | Same existing controller/auth/client | GET Statements/Options, GET/PUT Statements/{kind}, DELETE Statements/{kind}/Rows/{key}. Frontend exact endpoints and enum kinds match interface/controller; no client tenant or invented permission API. |
| Save/Delete/recovery | Retained drafts, explicit destructive action | Typed request/result and both failure channels. Delete uses reusable confirmation; persisted/default template deletion is explicit server action, client-new rows local. Unsaved peer rows retained after Delete. |
| Cross-section lifetime | Mounted drafts and one aggregate header | Route/unload/discard consider every workspace and child dialog. Mutations/tab changes gated during requests/dialogs; initialization never discards peer drafts. First-header cash/statement interaction is guarded/refreshed explicitly. |
| All report producers | Eight Income + two Balance additive contracts | Each resolves configuration with failure propagation, captures immutable own vectors and returns Statement{columns,rows,warnings}. Corresponding Angular DTOs retain compatible additive model; no response normalization drops it. |
| Fixed formulas | Owner approved, backend owned | Category sums include all own amounts once; net all revenue−expenses. Detailed variants retain gross/asset sale/before-sale formulas using immutable own amounts. Headers use same category raw vectors, including accounts outside the first tree root. |
| Basic conventional presentation | Latest owner instruction | Basic service alone uses StandardIncomeStatementReportBuilder. Existing persisted subgroup defines six stages; gross and operating profit are inline subtotals, net final. Components spanning stages split by account identity; unknown classification routed to respective other stage. No invented tax category or expression engine. |
| Other report design | Latest owner explicit preservation | Other nine list configurations/templates keep existing display/print/export. Their additive Statement projections are available in response; new component-view UI opt-in is intentionally limited to Basic. Settings storage/control exists for both definitions; no claim that retained legacy layouts render configurable row names. |
| Missing/disabled amounts | No hidden financial balances | Generic statement projections retain per-category unmapped rows and warnings. Basic shows nonzero unmapped values within their accounting stage. Hide-zero never hides fixed totals or unresolved coverage warnings. |
| Monthly BS | Owner explicitly approved unification | Shared BalanceSheetCutoffCalculator used by scalar and monthwise paths: cumulative exclusive cutoff, natural A D−C / L,E C−D, residual prior/current PL overlay using configured links and covering fiscal year. Branch/cost-centre monthly filters preserved. |
| Monthly SQL | Avoid ledger-history materialization | Bounded aggregate queries per cutoff, maximum24 months. No entire-history ledger dump. Query performance and numerical acceptance remain owner pending. |
| Frontend output | Preserve selected representation | Basic initial statement view hides duplicate KPI/category column and budget placeholders; existing budget filter can show columns. Details retain original hierarchy/ledger navigation. Print/export use same complete active rows/columns and warnings. Other screens unchanged. |
| Mapping | Server fields protected | Input→entity ignores key/kind/header/tenant/audit and owned children, assigned by owning service. Input→detail fills count explicitly. Header mapper ignores statement flags/children. No ReverseMap. |
| Wiring | Reuse current owners | Existing authenticated route/sidebar/settings service + route dirty guard. New standalone runtime files explicitly listed in tsconfig.app.json; no broad include/spec leakage or new client provider. |
| Guide | Master7 gate | Bilingual accounts-guide.ts updated: three settings tabs, union/overlap, drafts/defaults, standard Basic presentation, unchanged other designs, output, unmatched balances and BS basis. Existing /UserGuide/accounts reader/menu retained. |

### Source evidence and owner acceptance

Phases0/1/2/3/4/5/6 applied proportionally: discovery and shared freeze; complete
local read grids; typed editors/settings writes; explicit Delete; existing route/
runtime integration; final scoped diff/source reconciliation. No new screenshot
design authority: earlier cashflow screenshot establishes functional editable
rows/account mappings only; shared canonical components own presentation.
No unresolved material contract decision remains in this implementation slice.

New .NET named types each have their own file. Actual declared namespaces,
Business/DataAccess global imports, SDK implicit source inclusion and project
references were inspected. Report service's settings dependency is covered by
existing assembly registration and creates no cycle. Resource XML/key parity
and scoped whitespace/merge markers checked. Tracked diffs were reviewed in
both separate repositories; untracked source was read directly as well.
Eight generated packet checks pass after source changes; canonical books and
skill rules were not changed by this feature-specific implementation.

Three bounded inherited-model workers owned backend settings, backend reports,
and frontend settings. Frozen exact contracts and disjoint file ownership
enabled parallel implementation. Root owned shared report frontend, consumers,
integration decisions, guide, docs and complete reconciliation; peer changes
were preserved. No worker declared overall task closure.

Owner must create/apply schema migration `AddFinancialStatementComponents` for
the four new selector/row tables, references/indexes/check and two header flags.
The earlier general-scope schema change must also be included/applied if still
pending; deleting data alone does not change schema. No migration or snapshot
was edited, and no database, build, test, lint, browser, commit, push or deployment
command ran. This is source-only delivery, not proven compile/runtime correctness.

Owner verification: compile backend/frontend; seed a fresh company and repeat
unchanged; open before any fiscal year; save first statement then cash and reverse;
keep drafts across tabs/failed save/delete/route discard; confirm intentionally
empty definitions stay empty; test selector union/custom groups/inactive history/
future overlap/two tenant isolation; compare Basic gross/operating/net with own
ledger amounts and all category totals, including direct-parent postings and
unmapped values; verify same-view print/Excel and budget toggle; confirm other
report layouts remain unchanged; compare each monthly BS cutoff with scalar BS,
including prior/current P&L/closing entries/branch/costcentre and missing-year/link
errors; accept RTL/themes/narrow layout/focus/dialog/scroll and query performance.

Suggested commits only: backend `feat(accounts): configure financial statement
components and unify balance cutoffs`; frontend `feat(accounts): add financial
statement settings and standard basic income view`. Documentation remains the
local owning review/freeze record; no commits were made.
