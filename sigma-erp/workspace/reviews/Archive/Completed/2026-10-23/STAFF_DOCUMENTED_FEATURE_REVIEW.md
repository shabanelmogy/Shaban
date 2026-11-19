| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Staff documented review — 2026-10-08

The owner requested review and confirmed repairs of `src/app/modules/Staff`, inline search actions where appropriate, and subsequently both StaffStatement Report Type choices on one row. Implementation covers the existing eight screen families, salary revision and allocation, their directly related backend and bilingual guide. Initial scoped working trees were clean. No screenshot was supplied for Staff; historical Rental screenshots are outside this review.

Authoritative sources: `F:/My Work/Sigma/AGENTS.md`, required `.agents/skills/sigma-screen-refactor/SKILL.md`, `SIGMA_FEATURE_REVIEW_MASTER.md` and applicable blocks of `SIGMA_UI_PATTERNS.md`/`SIGMA_BACKEND_PATTERNS.md` under `F:/My Work/Shaban Documents/Shaban/sigma-erp`. Recipe `Generate-SigmaRecipes.ps1 -Check` reported PLAN00 and Phase00–06 drift. Canonical books governed implementation; packet regeneration and semantic review remain with the owner. Generated files were not edited. No new reusable book/skill rule was established; changes consume existing owners and feature-specific contracts.

## Decisions and manifest

This is an amendment to the historical STAFF_RECORD, STAFF_BANK_ACCOUNTS, STAFF_OPERATIONS, STAFF_REPORTS_LISTS and STAFF_BACKEND_CONTRACT_FREEZE handoffs, frozen before implementation in `STAFF_DOCUMENTED_REVIEW_CONTRACT_FREEZE.md`. Its explicit lean-detail and Report Type amendments record the later decisions without rewriting historical contracts.

| Family / route | Shape and decision | Filter / output contract |
|---|---|---|
| Staff `/Staff`; create/edit/view children | UI03 five-step aggregate; BE14. Details/Documents/Salary/Bank Accounts/Eligibility remain. Full owned snapshots and saved child ids retained. | Search spans two slots + inactive slot: three-column stable inline FilterPanel. Applied-query all-page Excel retained. |
| Designations `/Designations` | UI01 list with controlled create/edit/view dialog; BE13. Name required max50, nullable enum0/1/2, optional nonnegative finite hourly rate. | Name/category: two-column stable inline FilterPanel. Complete collection then local filter/page/export. |
| Timesheet `/StaffTimesheet` | UI01 list and controlled dialog; BE13. Month and work date independent; code/designation max100; required staff/shift; nonnegative finite hours. Existing `/StaffTimesheets` compatibility route untouched. | Three-column stable inline FilterPanel. No print/Excel action introduced. Sidebar stays under HRM Attendance. |
| Overtime `/StaffOverTime` | Operational collection exception, sparse changed-day writes. Nonnegative Int32 minutes; server payroll/calendar owns rates and amounts. | Two validated inline fields, reserved feedback/caption. No payroll-posting/print/export action introduced. |
| Duty `/StaffDutySchedule` | Operational collection exception, sparse day clearing retained. Shared clock parser plus compatibility adapter for one-digit hours/zero seconds. | Two validated inline fields, reserved feedback/caption. Prejoining toggle is presentation only. |
| Alerts `/staffAlerts` | Read-only paged list; document status summary. No separate StaffProfile screen invented. | Two-column stable inline strip. Full applied-query Excel; summary selection retains expiry filter semantics. |
| Statement `/StaffStatement` | UI07 / BE17 complete report; existing allocation action. Ledger/outstanding remain mutually exclusive radios. | Stable inline report strip: date/staff/type/subledger/inactive plus existing six actions. Report Type choices flex-nowrap on one row with text-wrap labels. Complete-section Excel/charges export; full print; local paging15. |
| Balances `/StaffBalancesSummary` | UI07 / BE17 complete report; fixed-employee statement dialog. | Five main filters and Balance Type in More Filters retain separate toolbar. Statement dialog uses adjacent date/Search only. Full result and authoritative totals retained. |

Grid/VM parity was compared against the historical frozen tables and current producers/consumers:

| Grid columns | Corresponding response fields / identity |
|---|---|
| Staff: Actions, Code, composed Name, Mobile, Email, Designation | Id, No, FirstName, MiddleName, LastName, MobileNo, Email, StaffDesignation. No audit/tenant field added. |
| Designations: Name, Category, Hourly Rate + actions | Id, Name, StaffCategory, HourlyRate. |
| Timesheet: Staff, Code, Designation, Shift, Date, Working Hours, Overtime Hours, Month + actions | Id, StaffId, ShiftId, StaffName, Code, Designation, ShiftName, Date, WorkingHours, OvertimeHours, Month. Lookup identities retained. |
| Overtime daily rows: day/date/name, minutes, rate, amount, weekend/prejoining presentation | DailyOvertimeDetailDto: DayNumber, Date, DayName, OvertimeMinutes, OvertimeRate, OvertimeAmount, IsWeekend, IsBeforeJoining. |
| Duty day/date/week, shift and In/Out pairs, availability | StaffDutyScheduleRowDto: Day, Date, WeekDay, IsWeekend, IsBeforeJoining, AttendanceId, ShiftId, ShiftName, In, Out, In2, Out2. Saved identity retained. |
| Statement ledger/advance sections and allocation action; balances contact/balance columns | Existing shared ledger-line/contact contracts, authoritative totals and StaffBalanceSummaryDto remain unchanged; complete report metadata checked before output. See frozen report tables and bounded reports for full field lists. |

No new API route, permission, enum, transaction boundary, financial linkage or workflow was inferred. AuthGuard is authentication only. Existing generic and stateful route guards remain. The lightweight numbered detail base retains Id/No inheritance.

## Final source conformance

| Concern | Owning book / actual reference and shared owner | Final comparison |
|---|---|---|
| List/filter geometry | UI1/3/4/6; Workshop/Job list; FilterPanelComponent/directives | Consumers bind actual 3/2/3/2/2 column counts, stableLayout and inlineActions; validated monthly strips reserve string messages and action caption. No feature filter CSS. |
| Report geometry / choices | UI20/21; TrailBalance wrapper, CustomerStatement Report Type; shared report/DataTable/ReportPrint owners | StaffStatement consumes stable/inline grid and shared radio choice palette. User amendment changes existing utilities to flex-nowrap/align-items-center; six handlers and query values retained. Balances advanced toolbar stays separate. Visual acceptance pending. |
| Record/editor | UI12/17/18/19; IndividualPartner details, StepForm/FormSection/FieldError/DocumentUploadTracker | Five steps, readiness, saved identities and attachment cleanup retained. EditableRows confirmationPending gates aggregate Save, inputs and navigation; canMutate rechecked after helper releases pending decision. |
| Discard lifecycle | UI10/13/28; Movements collectionMovement details; ConfirmationDialogService | Staff record/revision, Timesheet, Designations, monthly collections and allocation defer opening, reject repeated subscriptions, capture identity, freeze forms and restore only the same active context. Inner shared decision retains pending state until answered if Router unsubscribes; intended close/search/cleanup remains outside that retained stream. Cancel preserves edits and draft filters. |
| Scalars / numeric presentation | UI14/17/27; scalar-validators, date-utils, NumericFocusDirective, EditableCollectionTable | Shared finite validators cover salary/hours/rates/allocation; Int32 covers eligibility years, existing minutes boundary retained. Native inputs use shared numeric appearance; authoritative derived cells use shared highlight. No focus calculation/write introduced. |
| API validation / import | BE3/5/8/14; JSON TrimIncomingStrings, ApiController, existing VM attributes | Remove duplicate trim/annotation checks. DOB gets NotFutureDate in both write VMs. Retain default-date/null-child/FK/ownership/hierarchy guards. Joining comparison stays in Staff service: context-dependent DateAfter would break the direct import validator, so no import contract change. |
| Status / messages | BE5/6; generic Service/SiGmaControllerBase.ToActionResult | Custom Staff endpoints preserve producer404/409 through inherited Service/ToActionResult. Staff failures use existing neutral keys or 21 paired new EN/AR resource keys. Tracked update null check replaces redundant Exists query. |
| Mapping / generic overrides | BE3/4/9/13/14; BranchProfiler/Service, IndividualPartner tracked references; PurchaseOrder aggregate mechanics | Plain one-way bank maps after shared trim; aggregate-navigation ignores remain necessary. Staff paging override retains frozen default15/min10/max100 versus shared10/min1; aggregate, salary, projection and usage-aware deletion overrides retained only for their real feature obligations. |
| DTO ownership / detail payload | BE3; one named class per file; exact producer/consumer search | 19 new files hold existing contracts extracted from four combined files and allocation-context file; class bodies match HEAD ignoring whitespace. Retained allocation-context class makes 20 reorganized classes. Unused SalaryPackageVm and detail GrossSalary/Overtime removed with their maps/helper and frontend types. Separate salary endpoint and gross calculation remain. External Invoice/lease/rental consumers use identity/name only. |
| Guide / translations | Master7/UI23; existing UserGuide reader/model and Suppliers content | One STAFF_GUIDE registered in reader, one `/UserGuide/staff` Staff menu entry. Eight actual destinations, five journey steps, four questions, 71 nonempty EN/AR pairs. Arabic Timesheet menu key filled; eleven English balance keys aligned with Arabic. Staff EN indentation and three multiline strings normalized for canonical checker; existing AST values unchanged. |

## Domain and persistence boundaries

Payroll rates, effective salaries, holiday/calendar rules, rounding, ledger cutoffs/totals and both-sided allocation capacities remain backend-owned. Client gross is a preview and omitted from writes. Same-effective-date salary replacement is unchanged. No shared accounting writer was changed.

Bank rows remain optional; added rows require name and each text field has max100. Leading zeros remain text. Omitted/null update bank list preserves old-client compatibility; empty list clears the owned snapshot; supplied saved ids require ownership. Staff documents keep strict expiry-after-issue and optional supported uploads up to5MB. No migration, entity or EF configuration was edited. No new Add-Migration is required for this pass. Historical `AddStaffBankAccounts` schema application remains owner-pending; verify it separately rather than creating another migration here.

Known deferred boundaries: StaffDesignationConfig lacks explicit Name50/hourly decimal precision/live unique-index metadata; StaffTimesheetConfig lacks explicit hour precision/relationship-delete metadata. These pre-existing schema concerns are outside this frozen no-new-schema handoff and are not claimed conformant. A later schema amendment needs existing-data/precision/delete-policy review. Original AdvanceTaxInvoice consumption lacks a stable original-invoice association and remains the historical unresolved cross-feature accounting decision. The guide describes the limitation; this task does not repair or promise that linkage.

## Phases and source verification

Phase00 discovery/evidence, 01 frozen contracts, 02 list/filter/read review, 03 record/dialog/write repairs, 04 existing delete/discard/allocation audit, 05 route/guide/consumer integration and 06 scoped reconciliation applied. No new domain transition or maintenance replacement plan was needed. Phase04 adds no approval/posting/permission flow. Runtime portions of Phase05/06 remain pending under AGENTS.

- Parser-only checks: 49 non-test Staff/wiring/vocabulary TypeScript files and 11 Staff templates: zero syntax/template-parser errors. No TypeScript compilation or typecheck was executed.
- 333 local import declarations resolve; 482 named import exports compared to actual source owners, zero missing. New numeric directive imports/standalone registration reviewed.
- AST translation comparison: 656 scoped EN keys and656 AR keys, no missing; 282 Staff literal occurrences resolve or intentionally name existing enum subtrees. Canonical Check-Translations reports649/649, zero missing/case-only differences (its line parser omits seven matching multiline keys). All pre-existing vocabulary values match HEAD; only declared additions occurred.
- Guide topic route/title keys, bilingual pairs, reader registration and sidebar destination checked. New runtime file is imported normally; no missing-compilation diagnostic occurred, so no speculative tsconfig files/include change.
- 19 new backend class files match prior class bodies; localization XML parsed, 33 Staff-prefixed neutral resource keys all have Arabic counterparts. Bounded worker also checked duplicate keys and formatting placeholders.
- Complete scoped diffs were reviewed separately in both actual Git repositories, including new guide and new DTO files. `git diff --check` passed; no scoped merge markers. LF/CRLF notices are Git conversion warnings, not whitespace failures.

Build/tests/lint/typechecks/runtime/browser/database/migrations/model snapshots/commits/push/deployment/Graphify/Sigma MCP were not run. Parser evidence does not certify Angular strict-template/.NET compilation, DI/runtime behavior, schema state or visual acceptance.

## Owner verification and handoff

1. Compile both affected repositories. If Angular reports the new runtime guide missing from compilation, follow UI29/AGENTS and add that exact runtime file to existing explicit `tsconfig.app.json.files`; do not include specs broadly.
2. Check all filter strips at desktop/narrow widths, RTL and both themes; verify StaffStatement Report Type stays side by side without obscuring controls, and advanced Balances retains its separate toolbar.
3. Create/Edit/View Staff with and without initial salary, documents/bank/eligibility rows and boundary dates. Check same-date salary revision, readonly salary, owned ids, duplicate contacts and finite/Int32 rejection. Confirm import date behavior and404/409/localized errors.
4. While a child-remove or dirty-discard dialog is pending, verify Save/navigation/other edits are gated. Cancel preserves values; confirm affects only the original record. Include X/Escape, canceled Router navigation, retry and attachment cleanup after successful Save without saving again.
5. Verify sparse monthly saves/day clearing, filter-draft Cancel retention, prejoining restrictions, one-digit hour compatibility and rejected nonzero seconds. Verify payroll figures against existing saved server data.
6. Verify complete outputs with more than100 matching rows, applied filter snapshots, report totals/full print/active section export and partial/full allocation capacities/employee/account/tenant constraints.
7. Open Staff → دليل الموظفين (`/UserGuide/staff`), check all eight screen links, bilingual search/navigation and full-guide printing.

Suggested commit messages, without creating commits: frontend `fix(staff): align filters and editor guards with guides`; backend `fix(staff): preserve failure status and align validation contracts`; eventual documentation owner `docs(staff): record documented review and verification handoff`.

## Agent utilization and integration

Root completed discovery/freeze and owned Staff record/list/models, guide/reader/sidebar/vocabularies and final reconciliation. Controlled independent streams then ran under AGENTS: `staff_ui_worker` (routine isolated frontend role, inherited model; other seven Staff families and shared report view) and reused `suppliers_backend_recheck` (complex backend role, inherited model; directly related Staff backend/resources). The reused agent's old Supplier assignment was canceled before this delegation; no Supplier source changed. Inherited identifiers were retained because the existing full-context forks inherit their model. Nonoverlapping FE/BE ownership reduced expected wall time without duplicating discovery or merging shared edits. Both returned bounded artifacts, source diffs were integrated and independently reviewed by root; root applied final allocation numeric reuse, compatible salary identity comparison, translations and Report Type instruction. No further workers remain necessary.

Bounded evidence: `STAFF_UI_RECHECK_20261008.md`, `STAFF_BACKEND_RECHECK_20261008.md`. This source-only status closes the confirmed implementation work, with owner verification and explicitly deferred schema/accounting boundaries above.

## Changed-file manifest

Follow-up StaffOverTime display removal — 2026-10-08: owner deletes loaded Name/Code/Designation/month/day-count strip and Daily overtime title/hint. Owning HTML removes strip; TS removes its three unused signals/set/reset statements and monthCaption method. Existing collection title remains solely its accessible name with headingVisible=false (UI14 actual component uses title for aria-label). Table headingIcon/description bindings removed; summary cards, filters, loadedFilter/dirty/month/prejoining guards, financial calculations and Save untouched. Endpoint/model response fields retained under frozen API. Staff guide stops instructing readers to inspect the deleted strip. Template/TS/guide source parsers, removed-member checks and scoped whitespace review passed; owner visual/input acceptance pending. No new schema/API/shared code, workers or prohibited commands. Suggested frontend commit: `style(staff): simplify overtime table chrome`.

Follow-up StaffBalancesSummary host width/gap — 2026-10-08: main SummaryCards host gets a staff-balances-summary class and host-only inline-size100%, max-inline-size320px, margin-block-end12px in its owning SCSS. UI24 allows feature host bounds and requires12px before the grid; source SupplierBalancesSummary matches all three mechanical values. Shared card internals/slim/row/min190/max80, statement-dialog cards, authoritative amounts and suffixes unchanged. Guide clarifies Dr/Cr. Template/guide syntax and scoped whitespace/source checks passed; owner narrow/RTL/theme/print acceptance pending. No new shared abstraction or card-internal override, no backend/schema change or prohibited commands. Suggested frontend commit: `style(staff): bound balance total and separate it from grid`.

Follow-up StaffBalancesSummary slim total — 2026-10-08: main summaryCards() density dense→slim and max160→80, row/min190 retained. UI24 public density plus actual SummaryCardsComponent supports these values; WorkOrder reference slim/max80 matches sizing mechanics. No local/shared CSS change or values/formulas/suffix changes. Existing statement-dialog cards untouched. Staff guide clarifies full-result compact total. Template/guide syntax and scoped whitespace/source review passed; owner visual/RTL/narrow/print acceptance pending, no builds or runtime commands. No workers (one bounded input change); no migration/API/backend change. Suggested frontend commit: `style(staff): use slim balance summary total`.

Follow-up separate action row — 2026-10-08: latest owner instruction supersedes inline StaffStatement actions. Existing six actions now span all five filter tracks via shared `sigma-field--full`; remove the action track and inline-only invisible caption. Date2.5/Staff1.5/SubLedger1.5 and max-content type/inactive stay. Existing shared grid-column1/-1 matches both1250px three-column and640px single-column fallbacks; existing action wrapping/no-print/busy/submit handlers unchanged. No CSS/backend/schema change. Guide, UI20 and skill current-consumer evidence updated; historical prior decisions retained above. Scoped template/guide syntax and whitespace/source comparison passed; owner visual/RTL/narrow acceptance pending, no prohibited commands or workers. Suggested frontend commit: `style(staff): place statement actions below filters`.

Follow-up Outstanding clipping — 2026-10-08: source cause is equal fraction allocation for Report Type and inactive combined with nowrap choices. Owner explicitly authorizes reusing blank space after inactive. StaffStatement now supplies an opt-in complete `--sigma-report-filter-template`: Date2.5fr/Staff1.5fr/ReportType max-content/SubLedger1.5fr/inactive max-content/actions2fr, all fractional tracks minmax(0,...). Remove Date span2 and choice text-wrap; retain date's wider intent, existing Sub Ledger separation, shared action wrap and1250/640 fallbacks. Shared styles default is byte-equivalent original repeat-count+auto template for non-adopters. Source comparisons/parser/whitespace checks pass; no browser acceptance claimed. UI20 and skill/changelog updated; Staff guide clarifies selecting one of the adjacent choices and retains narrow action wrapping instructions. No API/financial/schema changes, workers or prohibited commands. Suggested frontend commit: `style(staff): fit statement choices and reuse filter space`.

Follow-up Date Range width — 2026-10-08: owner's request adopted through shared `sigma-report-filter-field--wide`, span2 with auto reset at640px, and StaffStatement six filter tracks for five fields. Mechanical comparison to existing FilterPanel span2/reset confirms shared geometry; report1250/640 breakpoints retained. Public opt-in leaves non-adopters unchanged. Shared src/styles.scss is now directly in scope; UI20 and skill/changelog updated together. Staff guide clarifies entry of both dates. Scoped complete diff/template/guide syntax/whitespace and shared breakpoint source inspection passed; visual/RTL/calendar-input acceptance remains pending. No API/financial/schema change, no build/runtime/browser; no workers for this small sequential follow-up. Suggested frontend commit: `style(staff): widen statement date range with shared report span`; documentation commit: `docs(ui): document wide inline report fields`.

Follow-up table titles — 2026-10-08: owner's request implemented by displaying only shared tab titles on screen, with Ledger/Outstanding reflected in the first tab label. Both h2 section headings use existing d-none/d-print-block utilities, preserving full-print identification because tabs are no-print. The Staff guide now explains tab identification. Template/TypeScript parsers and scoped whitespace checks passed; no build/runtime/browser was run. No subagents for this bounded presentation update; no API, totals or schema changes. Suggested frontend commit: `style(staff): remove duplicate statement table titles`.

Follow-up spacing — 2026-10-08: owner's request for space after Outstanding implemented through existing `ps-lg-3` on the adjacent Sub Ledger field. Keeps the two choices side by side and adds inline-start separation on wider layouts. Scoped template parser/diff checks passed; guide workflow is unchanged, visual/RTL acceptance remains pending.

The following inventory is generated from the two actual repositories after reconciliation. It includes deletions and new contract files; paths are relative to their stated repository roots.

Frontend: `F:/My Work/Sigma/SiGmaAngularFrontEnd` (27 paths)

- `src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts`
- `src/app/modules/Staff/Staff/components/details/details.component.html`
- `src/app/modules/Staff/Staff/components/details/details.component.ts`
- `src/app/modules/Staff/Staff/components/list/list.component.html`
- `src/app/modules/Staff/Staff/components/list/list.component.ts`
- `src/app/modules/Staff/Staff/models/create.ts`
- `src/app/modules/Staff/Staff/models/details.ts`
- `src/app/modules/Staff/StaffBalancesSummary/components/list/list.component.html`
- `src/app/modules/Staff/StaffBalancesSummary/components/list/list.component.ts`
- `src/app/modules/Staff/StaffDutySchedule/components/list/list.component.html`
- `src/app/modules/Staff/StaffDutySchedule/components/list/list.component.ts`
- `src/app/modules/Staff/StaffOverTime/components/list/list.component.html`
- `src/app/modules/Staff/StaffOverTime/components/list/list.component.ts`
- `src/app/modules/Staff/StaffStatementOfAccount/components/allocation/staff-allocation-dialog.component.html`
- `src/app/modules/Staff/StaffStatementOfAccount/components/allocation/staff-allocation-dialog.component.ts`
- `src/app/modules/Staff/StaffStatementOfAccount/components/list/list.component.html`
- `src/app/modules/Staff/StaffStatementOfAccount/components/list/list.component.ts`
- `src/app/modules/Staff/StaffTimesheet/components/details/details.component.ts`
- `src/app/modules/Staff/StaffTimesheet/components/list/list.component.html`
- `src/app/modules/Staff/alerts/components/alerts/list.component.html`
- `src/app/modules/Staff/alerts/components/alerts/list.component.ts`
- `src/app/modules/Staff/designations/list/list.component.html`
- `src/app/modules/Staff/designations/list/list.component.ts`
- `src/app/modules/UserGuide/components/reader/guide-reader.component.ts`
- `src/app/modules/i18n/vocabs/ar.ts`
- `src/app/modules/i18n/vocabs/en.ts`
- `src/app/modules/UserGuide/content/staff-guide.ts`

Backend: `F:/My Work/Sigma/SigmaBackend` (33 paths)

- `SiGma.Business/MapperConfig/StaffProfiler.cs`
- `SiGma.Business/Services/StaffServices/StaffService.cs`
- `SiGma.Helpers/Dtos/StaffOverTime.cs`
- `SiGma.Helpers/Localization/Shared/GeneralMessage.ar-SA.resx`
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx`
- `SiGma.Helpers/Reports/CustomerReports/StaffBalancesSummaryDto.cs`
- `SiGma.Helpers/Reports/CustomerReports/StaffStatementDto.cs`
- `SiGma.ServerAPI/Controller/StaffController.cs`
- `SiGma.ViewModels/ViewModels/Staff/SalaryPackageVm.cs`
- `SiGma.ViewModels/ViewModels/Staff/StaffAddVm.cs`
- `SiGma.ViewModels/ViewModels/Staff/StaffDetailVm.cs`
- `SiGma.ViewModels/ViewModels/Staff/StaffDutyScheduleDto.cs`
- `SiGma.ViewModels/ViewModels/Staff/StaffStatementAllocationContextVm.cs`
- `SiGma.ViewModels/ViewModels/Staff/StaffUpdateVm.cs`
- `SiGma.Helpers/Dtos/DailyOvertimeDetailDto.cs`
- `SiGma.Helpers/Dtos/StaffDropdownDto.cs`
- `SiGma.Helpers/Dtos/StaffOvertimeRequestDto.cs`
- `SiGma.Helpers/Dtos/StaffOvertimeResponseDto.cs`
- `SiGma.Helpers/Dtos/StaffOvertimeSaveRequestDto.cs`
- `SiGma.Helpers/Dtos/StaffOvertimeSaveResponseDto.cs`
- `SiGma.Helpers/Dtos/StaffOvertimeSaveRowDto.cs`
- `SiGma.Helpers/Reports/CustomerReports/StaffBalanceSummaryDto.cs`
- `SiGma.Helpers/Reports/CustomerReports/StaffBalancesSummaryRequestDto.cs`
- `SiGma.Helpers/Reports/CustomerReports/StaffBalancesSummaryResponseDto.cs`
- `SiGma.Helpers/Reports/CustomerReports/StaffStatementRequestDto.cs`
- `SiGma.Helpers/Reports/CustomerReports/StaffStatementResponseDto.cs`
- `SiGma.ViewModels/ViewModels/Staff/StaffDutyScheduleRequestDto.cs`
- `SiGma.ViewModels/ViewModels/Staff/StaffDutyScheduleResponseDto.cs`
- `SiGma.ViewModels/ViewModels/Staff/StaffDutyScheduleRowDto.cs`
- `SiGma.ViewModels/ViewModels/Staff/StaffDutyScheduleSaveRequestDto.cs`
- `SiGma.ViewModels/ViewModels/Staff/StaffDutyScheduleSaveResponseDto.cs`
- `SiGma.ViewModels/ViewModels/Staff/StaffDutyScheduleSaveRowDto.cs`
- `SiGma.ViewModels/ViewModels/Staff/StaffStatementSubLedgerVM.cs`

Follow-up overtime table width — 2026-10-08: owner requests the daily table to match the summary-card region above it. Frozen presentation decision: retain the shared workspace shell and remove only the editor body's extra 8px inline padding through the existing Bootstrap px-0 utility. Conformance: UI3 equal region edges/UI1 bounded editor; actual Workshop Job editor and src/styles.scss sigma-editor-body supply the 0 8px 8px default, while SummaryCards host/list supply zero margin/padding and shared EditableCollectionTable has no inline inset. Scoped px-0 supplies zero left/right padding at all widths; bottom 8px, flex bounds, fillHeight/stickyHeader and single row-scroll owner remain. No feature CSS or card/table internals changed. Staff guide overtime topic updated bilingually; existing /UserGuide/staff route and menu retained. Source template/guide parsing and complete touched-file diff/whitespace inspection passed; owner build/visual/RTL/narrow acceptance pending. Recipe -Check still reports PLAN-00/PHASE-00–06 stale; canonical blocks used, owner regeneration and semantic review pending. No API/backend/schema/calculation change, migration, workers, build/test/runtime/browser or other prohibited commands. Suggested frontend commit: style(staff): align overtime table with summary cards.

Follow-up daily identity vertical alignment — 2026-10-08: owner's corrected instruction requests vertical (not horizontal) centering of day number/date/weekday in StaffOverTime and StaffDutySchedule. Frozen scoped presentation exception to UI14's default top-aligned cells: apply existing Bootstrap align-middle to those three projected read-only cells in each table, preserving text alignment and leaving editable cells top-aligned for validation stability. Evidence: shared EditableCollectionTable SCSS th/td vertical-align:top; Bootstrap utilities alignment values include middle and generate important utility declarations. No feature/shared CSS change, APIs, formulas, payloads or widths. The existing Staff guide topics now describe these daily identity columns in EN/AR, retaining /UserGuide/staff and its menu. Complete touched-template source diffs reviewed; Angular template and guide TypeScript parser checks plus scoped whitespace checks passed. Owner visual/RTL/input acceptance remains pending; source-only execution, no builds/tests/browser/database/commits/migrations or workers. Prior packet drift remains pending owner regeneration/semantic review; canonical UI14/skill and Master7 govern. Suggested frontend commit: style(staff): vertically center daily row identifiers.
