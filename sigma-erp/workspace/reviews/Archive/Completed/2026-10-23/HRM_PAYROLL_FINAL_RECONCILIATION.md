# HRM Payroll — final source reconciliation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-09 |
| Contract | HRM_PAYROLL_CONTRACT_FREEZE.md, including the recorded owner continuation decisions |
| Frontend repository | F:/My Work/Sigma/SiGmaAngularFrontEnd |
| Backend repository | F:/My Work/Sigma/SigmaBackend |

## Delivered scope and lifecycle

The source implements monthly Payroll Process, saved Payrolls management/approval, immutable financial revision history, complete Excel exports and a viewable operation log under the existing HRM Payroll group. Server-owned salary/OT/installment calculations produce Net Pay; client requests contain period/version only. Earlier foundation-only proposals in the backend implementation artifact are historical and have been explicitly superseded by its appended continuation.

The implemented lifecycle is Process preview → Save revision → review saved snapshot → Approve that current revision. Process is read-only. Changed inputs before payment create another revision, clear active approval and retain the old financial figures/approval audit as Superseded. Identical inputs/retries do not create duplicate revisions or logs. Save/Approve are distinct from actual disbursement.

The paid boundary refuses regular financial Save and exposes per-employee recalculation differences, including removed employees and offsetting changes. Actual payment, settlement documents/payment, cancellation/reversal, payslips and ledger posting are not implemented in this change. Their future writer must consume the current approved revision, preserve paid snapshots, update deduction payment state and append events atomically. This is a foundation with a clear boundary, not a claim that disbursement is complete.

## Workflow phases and authority

| Phase | Applied result |
|---|---|
| 0 Discovery/evidence | Existing HRM Payroll group, Staff salary/OT producers and legacy SalaryVoucher investigated; two screenshots classified as functional/content evidence. |
| 1 Domain/API | Frozen backend/API contract with explicit later owner decisions for revisions, independent disbursement, approval replacement and logs. |
| 2 Read/grid | Saved-run counted list, applied date/type/pending filters, stable paging/sort, full-list and saved-row export. |
| 3 Detail/write | Monthly financial workspace, backend preview/revalidated Save, immutable historical reads, typed forms and validation. |
| 4 Domain action | Current saved unpaid revision approval, shared confirmation, concurrency/state recheck and atomic operation event. |
| 5 Integration | Lazy routes, existing Payroll navigation, DI/configuration discovery, bilingual vocabulary and module user guide. |
| 6 Reconciliation | Separate repository ownership/diffs; source contracts, imports, syntax/parity/whitespace, guide and focused backend invariant audit. |

Build/test/lint/runtime/browser/database/migration/commit/push/deploy verification was skipped because F:/My Work/Sigma/AGENTS.md explicitly prohibits it for this task. The required sigma-screen-refactor skill and owning Master/UI/BE blocks were applied. Selected shapes: UI screen05 financial collection workspace; UI screen02 routed list; BE14 stateful aggregate snapshot with BE15 backend monetary ownership. The aggregate has no generic writable financial/status CRUD or ledger effect.

Recipe drift check passes all eight plan/phase packets. No canonical book/template/manifest changed, so no derivative regeneration was needed. Feature-specific business decisions stay in the frozen contract/report rather than being promoted as generic rules.

## Screenshot functional evidence

| Evidence | Classification | Implementation |
|---|---|---|
| 1.PNG title/month/Process/Save | Directly demonstrated function/content | Payroll Process title, validated month, read-only Process and version-bound Save. |
| 1.PNG Code/Name/Basic/Allowances/Gross/Overtime/Additional/Deductions/Net Pay | Directly demonstrated columns | Same logical column order; read-only server-owned financial values and shared totals. |
| 1.PNG colors/compact legacy table/spacing | Appearance reference only | Shared Sigma route/title/filter/DataTable/summary/footer owners replace the screenshot geometry. |
| 2.PNG Date Range/Type/Pending Approval/Search | Directly demonstrated filters/actions | Explicit Search applies validated date range, sole supported type Payroll and pending approval filter. |
| 2.PNG Date/Type/Amount/Status plus paging | Directly demonstrated read contract | Current stored revision Date/Type/Net total/status; counted server paging and stable Date/Amount sort. |
| 2.PNG View/Edit/Approve/Export to Excel | Directly demonstrated workflow | Read-only View; unpaid recalculation Edit; confirmed current revision Approve; full stored employee-line Excel. |
| Revision/log/payment semantics | Screenshot cannot prove; owner continuation | Superseded history, fresh approval, immutable paid snapshot and visible successful-operation log, per explicit owner decisions. |

No unresolved Missing/Conflicting requirement remains inside the implemented scope. Absence/leave/proration and actual payment/settlement contracts are explicitly unsupported boundaries, visibly reported rather than inferred from screenshots.

## Decisions and contracts

| Concern | Decision and source evidence |
|---|---|
| Period/staff eligibility | Calendar month yyyy-MM, years1-9998, exclusive next-month end; active staff joined before end. Effective salary uses latest applicable revision before period end, not future salary. StaffService and SalaryPackage are the producers. |
| Gross/net | StaffService writes Gross including Basic/Transport/Housing. Require Gross = Basic + Allowances; Net = Gross + OT + Additional − Deductions. Never add Basic/Allowances a second time. |
| Overtime | Consume persisted OverTimeAmount from guarded Staff OT writer. Respect previous-month HRM setting; all nonzero hour counters need an amount. Negative/date/duplicate inputs block Save. |
| Deductions | Active, noncompleted valid schedules; required paid count; exclude pass-over/already-paid/out-of-range installments; floor installment and final remainder. Save does not advance PaidInstallments. |
| Policy gaps | Mid-month joining/salary changes and dated absences block affected Save until policy exists. Unperiodized Leave counters are not deducted. Unsupported commissions/business-unit settings fail explicitly. |
| Persistence | Four new root/revision/line/log entities. Persist financial results and source JSON for stable historical reads. Unique tenant/month, run/revision, run/request-token and revision/staff indexes; restricted FKs. |
| Financial ownership | Backend monetary policy/rounding and authoritative totals. No amounts/status/audit/tenant sent in Save or Approve. Shared resolver rejects precision incompatible with existing decimal18,2 storage. |
| Idempotency/concurrency | SHA256 binds source/policy/precision/issues to root id/current revision/paid/approval pointer. Serializable source revalidation plus existing tenant PayrollRun application lock, concurrency tokens and unique indexes. Replays/no-ops are harmless; stale requests conflict. |
| Approval | Current saved unpaid revision only. New changed Save clears active approval; old ApprovedAt/By retained. Approval audit-pointer/by consistency is checked. Approve neither recalculates nor pays/posts. |
| Superseded vs Cancelled | Older financial revisions are Superseded. Cancelled belongs to whole-run cancellation, which has no endpoint in this scope. |
| Operation log | Created/Recalculated/Approved saved atomically with successful changes; actor/UTC time/revision references/before-and-after amounts. Read-only previews/failed operations/no-op retries do not add saved-change events. |
| Mapping | Explicit controlled projections, no AutoMapper/ReverseMap: calculated amounts and immutable snapshots have no generic update contract. |
| Auth/tenancy | Existing AuthGuard route surface and [Authorize] API; tenant Repository queries and root ownership on historical/log reads. No invented permission API; UI hiding is not described as authorization. |
| Empty/error/validation | Before Process, empty, pending, policy issues and both API failure channels have visible messages/retries. Save remains actionable for missing/invalid inputs to show validation; busy/history/view/saved/paid states guard mutation. |
| Navigation | Preserve applied list filters/page/sort in Process View/Edit and return. Process guard protects unsaved preview/pending work. Freeze existing controls during request/confirmation/log without enabling intentionally disabled month in View. |
| Export | All matching management rows fetched page-by-page; per-run employee lines from saved revision, guarded against a changed selected version. Process exports complete displayed saved snapshot. |
| Compile roots | Retain existing tsconfig.app.json. No feature roots/glob added pre-emptively, per UI1/UI29; owner adds an exact component root only if a compiler diagnostic requires it. |

Management grid columns are **Date, Type, Amount, Status**. PayrollRunListVm properties are **Id, Date, Type, Amount, IsApproved, IsPaid, RevisionNumber, Version**. Date/Type/Amount/IsApproved supply visible values; Id/IsPaid/RevisionNumber/Version are the minimum identity/action concurrency properties. No undisplayed staff/financial detail is loaded into the list VM.

Process grid columns are **Code, Name, Basic, Allowances, Gross, Overtime, Additional, Deductions, NetPay**; candidate comparison adds NetPayDifference. PayrollLineVm includes those figures plus StaffId identity and Issues validation. Aggregate detail supplies period/revision/status/approval metadata, server totals, precision and settlement comparison needed by the workspace.

Log columns are **OccurredAt, Operation, RevisionNumber, PreviousRevisionNumber, PerformedBy, PreviousAmount, Amount**; PayrollRunLogVm adds only Id row identity.

API endpoints: POST /PayrollRuns/calculate {period}; POST /PayrollRuns {period,expectedVersion}; GET /PayrollRuns with ListSmBase; GET /PayrollRuns/{id}; GET /PayrollRuns/{id}/revisions; GET /PayrollRuns/{id}/revisions/{revisionNumber}; POST /PayrollRuns/{id}/approve {expectedVersion}; GET /PayrollRuns/{id}/logs. Frontend response models and backend producers match these Result/Results envelopes.

## Reference conformance reconciled to final source

| Concern | Book/reference/shared owner | Final target match or justified exception |
|---|---|---|
| Fill/scroll/title | UI1/3; Workshop Job list; sigma-route-host/list-page/list-panel/list-table/FeatureTitle | Payrolls and Process use the same bounded host/panel/header/table contract; no viewport calc or local layout SCSS. |
| Financial workspace | UI screen05/UI14; Accounts OpeningBalances | Process uses fixed filters, read-only shared DataTable, slim/row/min140/max80 SummaryCards and fixed action footer. Editable collection rows are unnecessary because server owns every amount. |
| Read/grid/query/export | UI6/8; Workshop Job list; DataTable/list-query/fetchAllPages | Typed columns/action states, counted lazy list; one applied filter snapshot; complete exports, stable cancellation. |
| Filter/feedback | UI4/17/19/22; shared FilterPanel/DatePicker/FieldError/StateMessage | Validated shared month/date-range controls, first invalid field focus, pending messages and both failure channels. |
| Pending confirmation/dirty exit | UI10; Workshop Job editor guard; freezeFormState/ConfirmationDialogService | Deferred Process discard and one guard; snapshots restored only for active surface. Approval confirmation re-resolves selected version; background controls locked through confirmation/mutation/export/log. |
| Operation log dialog | UI13; EditorDialog/DataTable | Shared View dialog; title is screen name, subtitle identifies payroll/period, no financial input, cancellable read and retry. |
| Aggregate/transaction | BE14; PurchaseOrder aggregate mechanics; UnitOfWork ExecuteUniqueWriteAsync | One complete graph SaveChanges. Explicit serializable transaction is justified by consistent mutable cross-source reads/revalidation beyond the aggregate. Approve uses existing guarded single-save transaction. |
| Calculation/domain | BE15; FinancialNumberPolicyResolver | Backend computed/persisted figures, precision/source snapshots; historical values stable. |
| Projection/resource response | BE5/7/9; ListSmBase/Results/GeneralMessage | Minimal list/detail VMs, localized domain messages, canonical default paging10 with max100, stable tie-breaker and tenant query. |

All values/imported controls/public inputs were checked against current source; syntax parsing is not compilation or visual acceptance. Historical monetary display follows the existing shared money formatter; owner acceptance should include currency-precision changes and UTC/date serialization.

## Files changed

Frontend new files (relative to frontend repository):

- src/app/modules/HRM/Payroll/PayrollProcess/payroll-process.routes.ts
- src/app/modules/HRM/Payroll/PayrollProcess/models/payroll-run.ts
- src/app/modules/HRM/Payroll/PayrollProcess/services/payroll-process.service.ts
- src/app/modules/HRM/Payroll/PayrollProcess/components/process/payroll-process.component.ts
- src/app/modules/HRM/Payroll/PayrollProcess/components/process/payroll-process.component.html
- src/app/modules/HRM/Payroll/PayrollProcess/components/logs/payroll-run-logs.component.ts
- src/app/modules/HRM/Payroll/PayrollProcess/components/logs/payroll-run-logs.component.html
- src/app/modules/HRM/Payroll/Payrolls/payrolls.routes.ts
- src/app/modules/HRM/Payroll/Payrolls/models/list.ts
- src/app/modules/HRM/Payroll/Payrolls/services/payrolls.service.ts
- src/app/modules/HRM/Payroll/Payrolls/components/list/list.component.ts
- src/app/modules/HRM/Payroll/Payrolls/components/list/list.component.html
- src/app/modules/UserGuide/content/hrm-guide.ts

Frontend integration: src/app/pages/routing.ts; src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts; src/app/modules/UserGuide/components/reader/guide-reader.component.ts; src/app/modules/i18n/vocabs/en.ts and ar.ts. tsconfig.app.json has no final diff. staff-guide.ts has no semantic diff (Git may retain an EOL/stat-only modified indicator). Prior unrelated HRM/other-module changes were preserved.

Backend new files (relative to backend repository):

- SiGma.Helpers/Models/Staffs/PayrollRun.cs, PayrollRunRevision.cs, PayrollLine.cs, PayrollRunLog.cs
- SiGma.DataAccess/Configuration/PayrollRunConfig.cs, PayrollRunRevisionConfig.cs, PayrollLineConfig.cs, PayrollRunLogConfig.cs
- SiGma.ViewModels/ViewModels/PayrollRun/PayrollCalculateVm.cs, PayrollSaveVm.cs, PayrollApproveVm.cs, PayrollLineVm.cs, PayrollRunVm.cs, PayrollRunListVm.cs, PayrollRevisionSummaryVm.cs, PayrollRunLogVm.cs
- SiGma.Business/IServices/IPayrollRunService.cs
- SiGma.Business/Services/Payrolls/PayrollRunService.cs
- SiGma.ServerAPI/Controller/PayrollRunsController.cs

Backend integration: SiGma.DataAccess/SiGmaDbContext.cs; SiGma.Helpers/Localization/Shared/GeneralMessage.resx and GeneralMessage.ar-SA.resx; SiGma.Helpers/Models/Staffs/StaffPayroll.md. Each class/record owns its own file. Service DI and sealed EF configurations use existing discovery; no additional provider/interceptor or mapper configuration.

Review artifacts: contract freeze; process/frontend implementation; approval/frontend implementation; appended backend implementation continuation; this reconciliation. The historical discovery audits remain preserved.

## User-guide completion gate

Content: src/app/modules/UserGuide/content/hrm-guide.ts, registered in the existing GuideReader. Route /UserGuide/hrm; HRM menu label userGuide.hrmMenuEntry in EN/AR. Covers input preparation, month Process/Save, validation/calculation boundaries, history/Superseded/approval reset, management filters/View/Edit/Approve, complete Excel and operation logs, independent disbursement and settlement boundary. Topics link to /ProcessPayroll and /ProcessedPayrolls. Shared reader/model/theme/RTL reused; source syntax, registration, routes and translations conform. Opening/reading/navigation/RTL/theme acceptance is owner-pending.

## Source verification and remaining owner work

Completed source checks:

- Repository roots resolved separately. Complete scoped tracked diffs plus new-file source/diff reviews reconciled; no migration/snapshot/reference-module changes.
- Final 18 changed/new frontend TS/HTML files parsed with zero syntax diagnostics and no missing relative imports. All102 payroll translation keys exist in EN and AR; zero parity/case/used-key/duplicate reviewed-key findings.
- Localized backend resource XML and service references checked. API payload/response property and route/service producer/consumer contracts reviewed.
- Focused backend audit corrected deduction activation/count, undated salary validation/hash, all-hour missing OT amount, full name fallback, paging default and approval audit consistency.
- Scoped git diff --check passed in both repositories; new-file whitespace/merge markers/imports reviewed. Informational LF/CRLF warnings are not compilation evidence.
- Recipe -Check passes plan00 and phases00-06. No generic reusable book rule needed promotion from these feature decisions.

Owner must create/review/apply **Add-Migration AddPayrollRunsAndLines** for the four new tables, indexes, concurrency fields and restricted relationships. No migration/snapshot was created or edited. Compile both applications before acceptance. New routed/component imports must be accepted by the current compiler boundary; only add exact component roots if compilation reports them missing.

Manual acceptance:

1. Review/apply schema; confirm sealed configuration discovery and tenant/audit stamping. Verify same tenant/month uniqueness and tenant isolation for list/current/history/log routes.
2. Calculate eligible staff with complete dated package; confirm Gross does not double-count, stored OT (current/previous month), additions, installments/remainder and summed Net Pay. Future salary must not alter an older period.
3. Exercise invalid salary, undated package, ambiguous component, absent OT amount in each hour counter, duplicate/date/negative OT, incomplete deduction, absence/proration and unsupported settings. These must block Save visibly without hiding the prior result.
4. Save/retry unchanged request: one revision/Created log only. Change inputs during displayed preview: conflict; Process again, Save changed unpaid values: revision advances, old financial/source snapshot unchanged, one Recalculated event.
5. Approve reviewed current revision; repeat/race approval and Save from two sessions. New changed Save clears active approval, old ApprovedAt/By stay historical, newest requires approval. Corrupt audit/pointer states reject.
6. Open saved View/Edit/history/log; verify invalid links, dirty discard Cancel/accept, pending freezes, request failures/retries, UTC/time display, and list return state.
7. Filter/page/sort/resize list, export with more than100 matching records, compare full-list and saved-run Excel counts/column order. Delayed stale reads must not replace newer results.
8. Exercise future paid boundary through the payment owner once implemented: regular Save cannot modify paid figures; per-employee removed/offsetting differences remain visible even with zero total difference. Do not mark payment manually to simulate a completed financial workflow.
9. Arabic/LTR/RTL, dark/light, narrow viewport, keyboard labels/focus/dialog close, one internal row scroll with fixed header/filters/totals/actions, and user-guide opening/topic links remain owner acceptance tasks.

Risks/limits: new schema is mandatory before persistence; no compilation/runtime claim; unsupported absence/leave/proration/business-unit/commission policies must be separately approved; disbursement/settlement/ledger/payslips/cancellation not yet owned by these endpoints. Existing unrelated ProcessLeaveSalary/PaySlips links and legacy SalaryVoucher surface were not replaced by this task.

Suggested commits (suggestions only): frontend `feat(hrm): add payroll processing, approvals, history and operation log`; backend `feat(hrm): add versioned payroll calculations and guarded approval audit`.

## Agent utilization

Controlled delegation followed the already Frozen producer/consumer contract and nonoverlapping ownership: payroll_ui owned only PayrollProcess; payroll_approval_ui owned only Payrolls; payroll_backend_review (sol_worker, selectable gpt-5.6-sol) performed a read-only invariant audit. Implementation agents inherited the parent model as required by full-history orchestration. Root owned contract/domain decisions, backend implementation, shared translations/routes/menu/guide, source notes and final integration/diff reconciliation. Earlier interrupted/usage-limited agents supplied discovery/partial foundation only; they did not establish completed backend or overall closure.

Two isolated UI workstreams and a focused independent financial audit reduced wall-clock time without shared-file edits by agents. Root integrated all outputs and resolved audit findings; no agent declared overall task complete. No uncontrolled delegation or overlapping source ownership was used.

No build, test, lint, browser automation/application verification, database command, migration/snapshot change, commit/push/deploy, Graphify or Sigma MCP action was run.

Final audit clarification: Approval and log UTC DateTime kind is restored after SQL reads; the standard shared formatter displays local time and matching labels. This avoids different displayed times immediately after Approve versus after reload. ApprovalAt and nonblank ApprovedBy must exist together and agree with the current root pointer. Root also removed accidental shared vocabulary/menu edits outside HRM and all speculative tsconfig roots before handoff. Final scoped source diff remains limited to the manifest above.

## ProcessPayroll action alignment follow-up — 2026-10-09

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Owner explicitly requests all ProcessPayroll buttons at the month-filter level. Scope: existing process HTML plus its HRM guide; no API/model/action-state/calculation changes. UI4 validated-inline recipe applies: existing FilterPanel, stableLayout=true, inlineActions=true, inlineActionCaption=general.actions, one main field before a saved run and two with revision history. Budget/components/budget/budget.component.html and shared FilterPanel public inputs/style values are the reference; shared 34px controls/action height, caption alignment and <=720px responsive stacking remain the owner. Move current Process/Save/Excel/log/back buttons into the existing appFilterActions projection; retain every type, condition, loading/disabled binding and click handler. Mandatory shared Reset stays single. Remove former title action controls/footer. No feature CSS, shared change or bespoke toolbar.

Conformance to reconcile: UI4 / Budget validated inline form / FilterPanel → same inlineActions/stableLayout/caption values and reserved month feedback; UI1/3 / existing shared route/title/table → retained title/status/panel/scroll chain; UI19/22 → preserve Save validation/action-state gates. Only Phase3 placement and Phase6 source reconciliation are applicable; backend/domain/migration phases have no changed contract. Existing in-app /UserGuide/hrm must mention the month-row actions. No subagents for this small sequential fix.

### Alignment follow-up reconciliation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Changed only payroll-process.component.html and hrm-guide.ts in the frontend repository. Process/Save/Excel/log/back are each present once in the shared FilterPanel actions; Process remains submit and Save is explicitly button. Existing action conditions/loading/disabled bindings are retained. InlineActions=true/stableLayout=true/inlineActionCaption=general.actions match Budget/UI4; one/two columns reflect the actually visible fields; reserved month validation remains. Removed title action buttons and the former Save footer as explicitly requested. Responsive <=720px stacking,34px action height, RTL/theme and Reset are owned by the unchanged shared component. The /UserGuide/hrm Payroll Process topic now explains action placement. Final HTML and guide TS source parsers show zero syntax diagnostics; scoped new-file diff whitespace checks pass. No backend/API/mapping/calculation/schema change or migration for this follow-up. Suggested frontend commit: fix(hrm): align payroll actions with month filter. No subagents were needed. Build/tests/lint/runtime/browser/DB/migration/commit/push/deploy were not run for this placement change; owner desktop/narrow/validation/RTL/dark/action acceptance remains pending.

## Authorized test-data cleanup continuation

Owner subsequently authorized deleting prior development-blocking test data, confirmed SQL5106.site4now.net/db_a82a9c_sigmaoperations1 and all companies. Scoped cleanup of dbo.HrmSetting backed up8 rows, deleted7 duplicate live settings and reset unsupported flags on retained Id8. Independent database read confirms0 duplicate tenants/0 unsupported flags, with previous-month OT retained=true. Full execution/backup evidence is in HRM_PAYROLL_TEST_DATA_CLEANUP.md. This explicit later authorization permits these database commands for this continuation only; earlier source-only verification statements remain historical and still describe the source-implementation/placement phases. Application retry remains owner-pending; no migration/schema/source/build/commit/deployment change accompanied the cleanup.

## Payroll notes icon follow-up — 2026-10-09

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Owner requests red icons opening note details. Apply to Payroll Process's existing general policy/state notices and employee row issues. Preserve blocking validation and errors/Retry, financial columns, export values, API and salary calculations. Use one read-only shared EditorDialog in the existing component: translated screen title and period/employee subtitle, Close/Escape, shared padded scrolling body. General icon joins the existing month-row action projection; row icon appears only when that employee has issues. Capture the displayed note snapshot, freeze/restore existing filter state while open, and include the modal in the existing busy/navigation guards. No new component/route/tsconfig root or custom CSS.

| Concern | Owning block | Approved source/shared owner | Target decision |
|---|---|---|---|
| Modal shell and context | UI13/27 | shared/editor-dialog component TS/HTML/SCSS; controlled UI13 composition | mode=view, primaryActionVisible=false, contentPadded=true, translated title/subtitle/Close, Escape closes |
| Red semantic icon | UI24/27 | shared file-field icon-only button; styles.scss sigma-icon-button; Bootstrap text-danger | 34px shared secondary icon button, danger foreground inherited by decorative icon, translated aria-label/title; read-only action |
| Pending state | UI10 | existing ProcessPayroll openLogs/closeLogs plus shared freezeFormState | preserve intentionally disabled controls and only restore for same displayed run |
| Labels and guide | UI23; Master7 | existing payrollProcess EN/AR block; /UserGuide/hrm Payroll Process topic | bilingual note labels and instructions replacing beneath-name text |

Phases3/6 only: presentation and source reconciliation. No backend/financial/action-state contract/schema change. Recipe drift check passed all8 packets; phase03 used with the owning blocks. This small UI fix is handled locally; the salary data setup depends on a separate pending amount decision and is not delegated.

### Owner row-placement correction

Owner subsequently requests the missing-data icon at the end of each row, consistently aligned. This supersedes the beside-name placement above. Freeze one final display-only Notes column using the existing PayrollRunRow.issues contract and typed cell template; centered header/cells through public headerClass/cellClass, fixed64px width and existing34px shared icon button. Name retains plain display and its existing Excel issue text. The Notes column is appended after the optional Net Pay Difference column, and is excluded from financial Excel columns. No new API field. UI6/8 and phase02 additionally apply; shared DataTable actual column interface owns supported properties (headerClass/cellClass, no invented align/exportable inputs). Update the HRM guide to describe the last-column placement.

### Notes follow-up final reconciliation

Owner final presentation correction: vertically center every Payroll Process body cell and ensure the note glyph remains red. Shared DataTable already centers ordinary cells but its wrap modifier top-aligns the Name cell. Reuse existing Bootstrap align-middle (vertical-align:middle!important) through each public cellClass, including wrapped Name, conditional difference and final Notes; preserve column widths, wrapping and horizontal number alignment. Existing Bootstrap text-danger sets the semantic button foreground; text-reset on its decorative glyph explicitly inherits that foreground even if a legacy icon rule sets color. No global/shared SCSS or another consumer changes. Record as UI6/24 conformance to actual DataTable CSS and Bootstrap utilities; no new reusable owner was required.

Owner compact-row correction supersedes the34px row-trigger size: use existing theme utilities w-20px/h-15px/min-h-15px/p-0/lh-1 on the employee Notes button and fs-8 on its glyph (about11px at the existing13px base). Actual theme $custom-sizes includes15px/20px; width/height/min-height utilities are generated with important priority, overriding the shared34px button dimensions for this consumer only. Border-box15px height plus existing table3px top/bottom padding fits the shared25px row, while align-middle retains vertical centering. The general month-row notes button stays34px. This uses existing canonical shared geometry plus public utilities, adds no local/shared CSS, and preserves aria-label, keyboard/Close/Escape behavior. Source review cannot establish final rendered height; owner visual acceptance remains pending.

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Changed five frontend source files: ProcessPayroll TS/HTML, EN/AR payrollProcess vocabulary and UserGuide/content/hrm-guide.ts. Complete scoped source review retains all existing financial/server contracts. Final grid sequence: code,name,basic,allowances,gross,overtime,additional,deductions,netPay,[conditional netPayDifference],issues(Notes). PayrollRunRow fields already supply these values; no ListVM/detail/API property was added. The Notes column is always appended last through columns(), separate from baseColumns() used by saved financial Excel. The row icon appears only with issues, uses the existing red semantic foreground and34px icon-only secondary button, and is centered through headerClass/cellClass=text-center in a64px column. Name displays plain text; existing exported name/issue text remains.

Global policy/historical/paid/settlement notices now open from one red icon beside month actions. The existing row/state validation and action errors/Retry still block invalid Save. Both icons open one shared read-only EditorDialog with translated title and employee/period subtitle, width640/height420, shared padded body plus one sigma-editor-scroll owner (definite height prevents collapsed flex content). Close/Escape restore the same displayed run's filter-state snapshot; modal busy guards prevent processing/saving/navigation while viewing details. Actual EditorDialog export/input signatures and direct standalone imports were compared, not inferred.

Final TypeScript source parsers (process, guide, EN, AR) and Angular HTML parser report0 syntax diagnostics; these are not compilation/typechecking/runtime results. payrollProcess translation parity:78 keys each,0 missing/case-only differences. Scoped new/tracked-file whitespace checks and merge-marker scan are clean. Existing route/provider/API/calculation/mapping/schema contracts are retained, so no new migration is needed for this follow-up. /UserGuide/hrm still uses the existing HRM guide menu and now describes the final Notes column and general notes icon in both languages. No reusable shared capability was introduced; existing shared owners suffice.

Applied phases2/3/6 proportionally; backend/domain-actions/integration changes were unnecessary. Recipe initial drift check passed all8; no canonical/template/manifest edits required regeneration. No subagents for the small fix and sequential salary setup. Suggested frontend commit: fix(hrm): show payroll notes in aligned final-row icons. No builds/tests/lint/browser/application checks, migrations/snapshot edits, commits/push/deploy, Graphify or Sigma MCP were run. Separately authorized database setup is recorded in HRM_PAYROLL_TEST_SALARY_SEED.md:162 rows added for27 employees;30 complete salary packages,12 active staff, existing history retained. Owner acceptance: October Process/Save, last-column alignment with/without Net Pay Difference, general/employee notes content, Close/Escape/focus restoration, view-mode state, narrow/RTL/dark appearance and Excel output.

Final compact/vertical presentation source reconciliation: all9 base cells, conditional difference and final Notes select align-middle; wrapped Name retains wrap+middle. Only the row trigger selects20px width/15px height/minimum-height and the existing fs-8 glyph; general notes icon stays on the month action line. Both decorative glyphs inherit the explicit red foreground with text-reset. Final source parsers rerun after this last edit:0 diagnostics across fourTS files and processHTML; scoped whitespace checks clean. The bilingual guide describes the small final-column red icon. No new migration/backend/DTO/mapper/financial change; visual/table-height/keyboard/theme acceptance remains owner-pending. Suggested frontend commit remains fix(hrm): show payroll notes in aligned final-row icons.

## HRM menu icon coverage follow-up — 2026-10-09

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Updated the existing HRM branch in `sidebar-menu-data.ts` only. Every HRM leaf now has a Bootstrap Icon: Payroll (process, leave salary, processed payrolls, pay slips), Leaves (leave, types, holidays), Attendance (shifts, attendance, timesheet), Overtime, Deductions, Reports (including driver timesheet), and Administration (roles, departments, account linking, settings). The existing HRM root/group icons, labels, links, expansion state and guide entry remain unchanged. No new route, translation, permission, API or backend contract was introduced. Icons use the existing menu renderer's `item.icon` input and its decorative `aria-hidden` output; no custom CSS was added.

The source-only scope is the shared navigation data plus the existing HRM review artifact. The menu data parser/brace review and merge-marker scan are pending owner build/runtime/visual acceptance; no build, test, lint, browser, migration, commit, push or deployment was run. Suggested frontend commit: `fix(hrm): add icons to all HRM menu entries`.

## Guide placement follow-up — 2026-10-09

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Per owner instruction, every existing User Guide item is now the last child in its sidebar group. Moved the Guide item to the end of Workshop, Stock, Limousine and HRM; Customers, Suppliers, Staff, Sales, Fleet, Rental, Lease and Equipment Rental were already correctly placed. Nested report/group contents, labels, icons, links, expansion state and routes are unchanged. No guide content or routing was changed; this is navigation order only. Menu data parser review and merge-marker scan are clean; build/runtime/visual ordering acceptance remains owner-pending. Suggested frontend commit: `fix(navigation): keep guides last in sidebar groups`.
