# Debt collection corrections — final source review, 2026-10-02

| Field | Value |
|---|---|
| Status | Confirmed corrections implemented; source reconciliation passed |
| Owner verification pending | yes |
| Contract | [Correction freeze](<F:/My Work/Sigma/reviews/DEBT_COLLECTION_CORRECTIONS_CONTRACT_FREEZE.md>) |
| Historical contract | DEBT_COLLECTION_DISCOVERY_CONTRACT_FREEZE.md, unchanged |

The user authorized review and fixes in `Customers/debtCollection`, then reported disappearing results after adding a Promised follow-up. The source defect is corrected: this screen's unchecked Promised checkbox omits the filter rather than sending explicit false. Checked still sends true. After a successful follow-up, the report reloads its applied filters and retains a valid presentation page. The user subsequently requested removing the 100-customer message; that message and its unused translation keys have been removed from both screen and print.

## Findings and resolution

| Finding | Source evidence | Result |
|---|---|---|
| Unchecked Promised hides promised/no-history customers | `debtCollection.service.ts:getReport` used the shared serializer, which retains false; `CustomerService.GetDebtCollectionAsync` filters whenever the key is present | Normalize unchecked to null before serialization. Backend explicit-false semantics remain compatible with other callers. |
| Latest-follow-up projection cannot supply its ordering member | `CustomerService.cs` grouped projection ordered by DateTime but selected Id/CustomerId without DateTime | Added `f.DateTime` to that anonymous projection. Retained existing DateTime/Id ordering. This is source evidence of a compile defect, not a claim that a build was run. |
| Save refresh can be dropped or leave an invalid grid offset | Existing report busy guard and uncontrolled presentation offset | switchMap/defer read stream; save refreshes applied filters; Search resets page; result refresh clamps the page to returned rows. |
| History requests can finish after close/customer change | Independent subscriptions in `loadHistory` | Cancel on identity/visibility change and close; accept only the current customer. Failed reads remain retryable. |
| Blacklist dialog does not close on successful save | Success called the public close method while saving was still true | Success calls the internal hide/reset method directly, then refreshes the report. |
| Repeated saves and dirty dialog exits | Missing duplicate-submit guards and dirty-close confirmation | Disable forms during writes, guard submissions/close, preserve failed drafts, confirm dirty X/Cancel/Escape through the shared confirmation service. |
| Partial dates and early DateTime capture | Validity was not consistently checked; follow-up DateTime was captured on opening the form | Shared masked date controls, FieldError, invalid-field focus, date strings for AsOfDate/NextFollowup and submission-time wall-clock DateTime. |
| Duplicate API error feedback | History reads had both interceptor and inline feedback; mutations reused inline read messages | Inline report/history reads opt out of interceptor errors. Mutations use the global interceptor and locally retain drafts. |
| Print covers only the grid page; export differs from displayed columns | Print had no preparation; handwritten export omitted latest note | Temporarily disable paginator/scrolling and row actions before print; restore controlled state afterward. Excel uses shared grid column formatting at click time, including latest note/date. |
| Language labels and shared layout drift | Initialization-only translated options; missing route host; duplicated KPI styling; toolbar lacks DebtCollection exclusion | Translation-key options, shared host/grid/dialog/date/error/confirmation helpers and shared KPI variants. Keep the existing count layout; exclude only `/DebtCollection` from the outer title. |

History displays its existing IsPromised property with a translated Yes/No badge so the saved state can be inspected. It does not add an API property or change a persistence rule.

## Files changed by this correction task

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

| File | Task change |
|---|---|
| `src/app/modules/Customers/debtCollection/components/report/report.component.ts` | Report read lifecycle, applied-filter refresh, paging, print/export, translated options and blacklist action lifecycle |
| `src/app/modules/Customers/debtCollection/components/report/report.component.html` | Controlled grid/print state, shared date/error controls, dialog actions; requested ceiling message removed |
| `src/app/modules/Customers/debtCollection/components/report/report.component.scss` | Remove duplicate shared KPI styling, use danger token, whitespace cleanup |
| `src/app/modules/Customers/debtCollection/components/followup-report/followup-report.component.ts` | Cancellable reads, controlled paging, Promised badge, typed save lifecycle and dirty-close handling |
| `src/app/modules/Customers/debtCollection/components/followup-report/followup-report.component.html` | Field errors, dates, controlled paging, translated dialog buttons and retry action |
| `src/app/modules/Customers/debtCollection/components/followup-report/followup-report.component.scss` | Correct the column-count comment only |
| `src/app/modules/Customers/debtCollection/services/debtCollection.service.ts` | Omit unchecked Promised; name retained page-size constant |
| `src/app/modules/Customers/debtCollection/services/followUp-report.service.ts` | Inline-read error ownership header |
| `src/app/_metronic/layout/components/toolbar/toolbar.component.ts` | DebtCollection title exclusion only |
| `src/app/modules/i18n/vocabs/en.ts`, `ar.ts` | Three matching reports.discard keys; ceiling key removed at owner's request |

Backend repository: `F:/My Work/Sigma/SigmaBackend`.

| File | Task change |
|---|---|
| `SiGma.Business/Services/Customers/CustomerService.cs` | Select f.DateTime in the debt report's latest-follow-up projection only |

Review artifacts: this file and `DEBT_COLLECTION_CORRECTIONS_CONTRACT_FREEZE.md`. Existing feature refactors, model/service cleanup, spec edits, dead-file deletions and unrelated report changes were already pending before this task and were preserved. Baseline snapshots/hashes distinguish this correction from those changes. A concurrent update to CustomerService outside the correction was detected during reconciliation; the debt method was reread, the DateTime fix remains present, and no subsequent backend write was made.

## Applied phases and decisions

| Phase | Application |
|---|---|
| 0 | Source discovery, user defect classification, guide/reference selection and recipe drift check |
| 1 | Freeze compatible filter, report response, history and write contracts |
| 2 | Report/history reads, local presentation paging, filter validation, print/export |
| 3 | Existing typed follow-up and blacklist form dialogs |
| 4 | Existing blacklist action save/close lifecycle only; no new transition |
| 5 | Routes, root/legacy Layout providers, interceptors, events and single title |
| 6 | Scoped diffs, contracts, translation parity and whitespace reconciliation |

PLAN-00, generic CRUD expansion, uploads, new permissions, accounting transitions and migrations were not applicable: this task corrects an existing frozen feature. No screenshots were supplied. The written defect and the requested message removal are Explicit user evidence. Runtime reproduction is pending. There is no new Missing API shape, field or workflow rule needed for these corrections.

Selected UI shape: operational debt report with existing row actions, shared local grid paging and small typed dialogs. Backend read shape: Pattern 5 report; writes retain their existing generic controllers/services. References/shared owners: Statement print/paging; Job read stream/dialog close; DataTable, EditorDialog, FieldError, DatePickerDirective, ConfirmationDialogService, TranslateOptionsPipe, list-query/date-utils and shared report styles. These are existing owners; no shared helper fork was introduced.

| Decision | Evidence and final contract |
|---|---|
| Search filters | Numeric enum IDs remain unchanged. AsOfDate required; null enum filters omitted. Promised checked=true, unchecked omitted. Other checkbox semantics remain as consumed by the backend. |
| Grid/DTO fit | Main displayed columns: Customer(Name/Code), ContactNo, CreditPeriod, CreditLimit, P1_0_30, P2_31_60, P3_61_90, P4_91_120, P5_121_150, P6_151_180, P7_181_Plus, SubTotal, UnAllocated, Balance, NextFollowup/LatestNote, DebtCollector/Name; existing actions use CustomerId/status and KPI counts use Promised. Existing DTO properties: customerId, customerName, customerCode, contactNo, creditPeriod, creditLimit, p1_0_30, p2_31_60, p3_61_90, p4_91_120, p5_121_150, p6_151_180, p7_181_Plus, subTotal, unAllocated, balance, status, debtCollector, debtCollectorName, latestNote, nextFollowup, promised. No generic ListVM added. |
| History/DTO fit | Columns DateTime, Notes, NextFollowup, IsPromised. Existing Id supports identity; CustomerId/CustomerName identify the owner. Preserve the server's DateTime-descending list order. |
| Write inputs | FollowUp: customerId/dateTime/notes/nextFollowup/isPromised. BlackList: customerId/reason/isBlackList. No calculated money or new state is submitted. |
| Paging/output | Retain GET PageNumber=1, PageSize=100 and Result<List<DebtCollectionResultDto>> without total metadata. Local pages cover returned rows. Print/Excel cover all returned rows only. Explicit user instruction removes the ceiling message. |
| Mapping | No AutoMapper changes required by the selected member/consumer corrections. Existing direct report projection and FollowUp/BlackList profiles are retained; no new Ignore/ReverseMap introduced. |
| Finance | Backend remains calculation owner; no aging, allocation, ledger or balance formula changed. Frontend KPI counts are display counts only. |
| Permissions | Existing AuthGuard retained. No authorization API exists; no invented restriction or security claim. Historical O2 remains pending. |
| Schema | No entity/EF/schema change. Owner does not need Add-Migration; no migration name applies. |

## Final conformance reconciliation

| Concern / owning blocks | Final source match |
|---|---|
| Host/title — UI 1/3/20 | sigma-route-host/sigma-print-flow; one report app-feature-title and route-specific outer-title exclusion |
| Grid/paging — UI 5/6/7 | Shared DataTable, customerId identity, controlled first/rows/total and resolveListPaging against the previous state |
| Read concurrency — UI 28 | switchMap/defer with inner failure recovery; cancelled history requests cannot populate another customer's dialog |
| Dates/validation — UI 17/19/27 | Date|string|null controls, mask/placeholder, validity/touched checks and focusField; existing helpers own transport |
| Write/exit — UI 13/22 | Saving guards, form disable/restore, global feedback, shared dirty discard and direct success close |
| Translation/export — UI 8/10/16 | Current-language options/headers and shared dataTableExportRows |
| Print — UI 21 | Preparation frame, paginator/scroll release, actions hidden, controlled page retained, scheduled frame cancelled on destroy |
| API projection — BE 9/17 | Follow-up timestamp projected; response and financial values remain compatible |

Recipe fingerprint checks passed for PLAN-00 and phases 00–06. A semantic documentation discrepancy remains: Phase 05 still describes LayoutModule as the interceptor-owning injector (lines 86/127), while current UI block 1 and actual AppModule provide the single interceptor-equipped HttpClient. Source follows the canonical book/current provider ownership; no generated file was edited. Existing Layout service registrations remain compatible. No new reusable convention was established requiring book/skill promotion; feature-specific decisions stay here.

## Remaining limits and owner verification

Historical O1 remains: the response cannot establish completeness beyond 100 matching customers. The message is intentionally absent per the user's instruction. Resolving full-report delivery needs a separately frozen response/paging decision.

Financial contract review remains separate: `GetDebtCollectionAsync` uses signed raw ledger amounts bucketed by journal date, rather than an inspected allocation/due-date contract; UnAllocated sums all credits without allocation matching; the `arAccountIds.Count == 0` predicate includes all partner accounts when mappings are absent. These source observations warrant accounting review before financial acceptance. They were not silently redefined in this UI defect correction. Historical blacklist authorization remains unresolved; no new permission framework was introduced.

Source-only checks passed: scoped repository diffs and baseline comparison, direct DTO/payload/endpoint/helper/template wiring, no stale removed banner/import/flag or merge markers, translation parity (reports EN/AR: no missing or case-only keys), and git diff --check in each repository. These do not prove compilation or runtime behavior. Existing shared changes and the minimal preexisting component spec also need the owner's normal build/test acceptance.

Manual owner checks:

1. Load with Promised unchecked; save a note with IsPromised checked. The customer remains in the unfiltered report and the history badge shows Yes. Confirm the request omits Filters[promised].
2. Search with Promised checked; only customers whose latest follow-up is promised appear. Save a newer non-promised follow-up and verify that row leaves this explicitly filtered result.
3. Repeat save while a request is slow; verify one write, disabled fields, failed draft retention and one error message. Cancel a dirty form using X/Cancel/Escape and confirm discard.
4. Save blacklist reason and verify successful dialog close and refreshed row/filter state. Reopen history or change customer during a delayed read and confirm old results do not appear.
5. From a later local page, save a follow-up, refresh and print. Verify a valid restored page, all returned rows in print/Excel, latest note/date in Excel, and no removed ceiling message.
6. Check typed/partial/cleared dates, current-language dropdowns and dialog buttons, RTL, narrow viewport, light/dark themes and one page title. Run the usual frontend/backend builds and relevant tests under owner authorization.

No builds, tests, lint, migrations, browser/application automation, database commands, commits, pushes, deployment, Graphify or Sigma MCP were run.

Agent utilization: read-only backend discovery was delegated to luna_explorer/gpt-5.6-luna; the follow-up luna_audit attempt ended at the model usage limit without a usable audit. No agent edited source. Root completed direct backend inspection, all implementation and final reconciliation locally. Delegation was bounded to backend tracing independent of frontend edits, intended to reduce time and context cost; no separate handoff was required to finish.

Suggested commits, without committing:

- Frontend: `fix(debt-collection): preserve customers after promised follow-ups`
- Backend: `fix(debt-collection): project latest follow-up timestamp`

## Title/filter width follow-up — 2026-10-02

Owner explicitly requested matching the title card width to the filter card. Updated only `src/app/modules/Customers/debtCollection/components/report/report.component.html` to opt into the existing shared `sigma-report-panel--aligned-title` modifier. UI blocks 3/20 and Customer Statement's panel are the conformance reference. The shared rule sets the direct title's inline margins to zero, matching the filter strip at every shared responsive panel width, including RTL. No local CSS or fixed width was added.

Minimal discovery/freeze, frontend presentation and source reconciliation applied; backend/write/action/runtime wiring phases are unchanged and not needed. No new API, mapping, financial, permission, translation or schema decision; no migration. No subagents for this one-element change. Source diff/whitespace verification passed; actual visual acceptance remains pending. No prohibited commands were run. Suggested frontend commit: `fix(debt-collection): align title and filter card widths`.

## Presentation refinement — 2026-10-03

Explicit owner request: improve the visual design and use the screen width. Implemented a full-width report workspace using the existing bounded shell and a new opt-in `sigma-route-host--full-width` class. Its shared `.app-container:has(...)` rule removes the configured container maximum only for opted-in routes; Debt Collection is the only consumer. The sidebar, header and height/scroll chain retain their owners. This shell capability is recorded as a feature presentation choice with source verification; actual responsive/visual acceptance is pending.

Changed six frontend files: `components/report/report.component.html`, `.scss`, `.ts` inside debtCollection; `src/styles.scss`; `src/app/modules/i18n/vocabs/en.ts` and `ar.ts`. No backend files changed in this follow-up. Baseline copies and full task diffs distinguish this layout change from earlier pending edits.

| Concern | Decision / conformance evidence |
|---|---|
| Width | Existing aligned-title modifier retained. Full-width host opt-in expands the actual enclosing content container instead of setting a viewport width inside it. Shared UI 1 shell bounds remain. |
| Header | Existing FeatureTitle, translated purpose subtitle, and existing Print/Excel actions in its projected action slot. Shared secondary buttons/ReportActions own interactive/print styles (UI 3/20/24). |
| Filters | Same five fields and three checkboxes in the same reactive form; equal-width fields and a separate full-width criteria/action row. Search remains the only submit; Refresh/Reset retain their handlers and busy gates. Field/control palette and dimensions remain shared (UI 17/19/20). |
| Operational KPIs | Same six counts and source calculations. Larger numbers, semantic Bootstrap Icons and balanced card spacing are an owner-approved non-accounting presentation exception under UI 20. Shared tile borders/surfaces/semantic tokens remain; no money total introduced. |
| Responsive / RTL | Five field columns on desktop, three under 1024px, two under 640px. Six KPI columns on wide screens, three under 1200px; compact icons/counts on narrow screens. Logical spacing/shared theme tokens and grid-only scrolling retained. |
| Contracts | No filters, DTOs, APIs, saves, permissions, mapping, formulas or schema changes. The removed 100-customer message remains absent. |

Applied minimal discovery/freeze, frontend layout and final source reconciliation. Backend/write/action/migration phases skipped because this follow-up is presentation-only. No screenshots or runtime inspection were supplied/performed. Source task diffs reviewed for all six files; translation parity and `git diff --check` passed. No subagents for this bounded layout change. No builds/tests/lint/browser/database/migrations/commits/pushes/deployment/Graphify/Sigma MCP were run.

Owner visual acceptance: check the title/filter/summary edges on a wide desktop, the header actions, Arabic/English, dark theme and narrow/short viewports; verify the rows remain the scroll owner and Print/Excel still work with their existing busy and restoration behavior. No migration needed. Suggested frontend commit: `style(debt-collection): improve full-width report workspace`.
