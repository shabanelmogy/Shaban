# Payroll Final Settlement Process and Pay Slips

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Scope and authority

The owner requested both attached Payroll pages and then explicitly requested completion of missing business before another complete review. The screenshot evidence, selected implementation shapes, policy decisions and API/field contracts are frozen in `PAYROLL_FINAL_SETTLEMENT_PAY_SLIPS_CONTRACT_FREEZE.md`. Master2 rule6 authorizes the closest correct source-supported completion/minimal new element; it does not permit accounting effects or statutory assumptions. Journals and payment remain deferred by the owner.

Authority: `F:/My Work/Sigma/AGENTS.md`, `.agents/skills/sigma-screen-refactor/SKILL.md`, `SIGMA_FEATURE_REVIEW_MASTER` blocks2/4/5/7, UI1/2/3/4/5/6/7/8/10/13/14/16/17/19/20/21/22/23/24/25/26/27/28/29, BE2/3/5/6/8/9/10/14/17/18. All eight generated packets passed `Generate-SigmaRecipes.ps1 -Check` before use. Phase0 discovery and phase1 freeze complete; phases2–4 authorized; phase5 runtime excluded; phase6 source reconciliation required before handoff.

## Existing state and impact decisions

| Owner | Decision | Evidence/reason |
|---|---|---|
| PayrollRun/Revision/Line/Log and guarded service | Extend | Already own immutable salary snapshots, effective salary selection, tenant transaction, hash/no-op/revision/approval/paid boundaries |
| Final settlement page | Create | No current route, component, calculation or typed policy contract; screenshot demonstrates employee/date and four payout sections |
| Final settlement policy inputs/snapshot | Create minimal typed contracts | Current Leave/Eligibility cannot prove dated remaining entitlement, airfare policy or legal gratuity; reviewed inputs allow complete transparent arithmetic and reproducible versions |
| Pay slips | Create read-only projection/UI | Current saved PayrollLine has employee identity and amounts; deterministic slip id/number and current list/historical detail avoid duplicating writes |
| SalaryVoucher legacy generic CRUD | Keep outside scope | Header lacks employee/revision and permits client total; cannot be made authoritative merely because SalaryVoucherType contains FinalSettlement |
| Existing monthly and LeaveSalary screens | Keep, extend shared type contracts | No replacement of monthly salary formula or existing staff scope |
| Payrolls list | Extend | Adds FinalSettlement type and directs View/Edit to its owning screen while reusing approve/log/export |
| Shared controls/services | Reuse | Source-backed common owners already provide shell, validation, dates, paging, all-page output, dialog report printing and form freezes; no new widget/CSS needed |
| Schema | Owner incremental migration | Source adds optional root last day and revision snapshot, no migration or snapshot edits by agents |

## Filters, columns and actions

PaySlips grid visible columns: No, Name, Code, Date, Type, Total Amount, Status; shared Actions column provides View/Print. ListVM properties: id/runId/revisionNumber/staffId (identity and detail routing), no/name/code/date/type/totalAmount (visible screenshot values), isApproved/isPaid/isCurrentRevision (status/action identity). Filters: dateFrom/dateTo, no, type, staffId; sort keys frozen to actual producer whitelist with stable id tie-breaker. No Add/Edit/Delete/Pay action because a slip is an immutable saved snapshot read. Report and Excel promise all matching pages and fail atomically; table paging always remains real server paging.

FinalSettlement: Staff/Designation/LastWorkingDay + explicit policy inputs, Process, Save, reset/unsaved discard, historical revision selection, View/Edit and operation log; approval is inherited in Payrolls. Staff/month/lastDay lock after root save; employer policy edits require Process and a new immutable revision. All editable payload fields are policy quantities/bases/dates, never calculated totals/tenant/status/revision flags. Directly dated source facts and backend currency precision produce all authoritative monetary figures. Empty/failed lookups remain distinct; no route/authentication bypass.

## Pre-edit conformance evidence

Actual approved sources read before edits: Workshop/Job list `.ts` shell/filter/action/imports; Job editor `.html` sigma-editor-page/panel/body/scroll/form-section; shared EditorTabs/FormSection/StateMessage declarations; UI13 shared EditorDialog composition; StatementOfAccount list print owner; PurchaseOrderService tracked master/detail and calculation/save boundary. Existing PayrollRunService/DTOs/configs, Leave/LeaveType/Eligibility/SalaryPackage enums, SalaryVoucher service/model and dependency scanner inspected. Frozen concern/reference/shared-owner table names the target match. Final source comparison will record component inputs, scroll owners, paging fields, immutable hashes and print isolation rather than treating an import as proof.

## Execution and ownership

New scoped pre-edit baseline recorded under `PAYROLL_FINAL_SETTLEMENT_PAY_SLIPS_BASELINE/frontend|backend` because much Payroll source is untracked. Existing unrelated owner and peer edits in both repositories, shared vocabularies, migration snapshot and newly owner-created `20261009204746_modifyPayroll` were observed and preserved. Backend worker owns backend feature code, frontend worker owns Payroll feature folders/models/list; root owns navigation/vocabularies/guide/review artifacts/resources and final integration. Existing two workers reused under AGENTS delegation gate after contract freeze to reduce wall time without source overlap. No third agent required.

## Final reconciliation

| Concern | Final source evidence | Outcome |
|---|---|---|
| Scope/screenshot | Staff/designation/last day and all five settlement groups are present; No/Name/Code/Date/Type/Total Amount and actions/filters/report/Excel are present in PaySlips | Functional content preserved through shared Sigma controls; screenshot layout is not a design authority |
| Calculation | PayrollRunService owns inclusive salary coverage, rounded bases/rates, commission separation, reviewed quantities and backend totals | Final policy distinct; monthly/LeaveSalary hash shapes preserved; no client calculated amount writes |
| Persistence/lifecycle | Optional root last day and revision snapshot; tenant serializable Save + unique write; one final root across months; all-type same-month guard; immutable identity/current/history and approval reset | Same aggregate reused; historical snapshot reads; paid replay additionally binds identical saved policy inputs |
| DTO/list alignment | Visible No/Name/Code/Date/Type/Total Amount/Status vs no/name/code/date/type/totalAmount plus identity/action-state fields recorded above | Minimal list projection; detail contains one requested historical employee only |
| Read integration | PayrollRuns settlement-staff and PaySlips list/staff/detail routes; inherited auth boundary; existing assembly scoped scanner | No new permissions or generic CRUD/amount writer; exact No identifier filtering and inclusive month-end date |
| UI state | Reactive staff selection; required bounded/finite quantities; parseDateValue date transport; disabled saved identity, view/paid/history; policy changes require Process; discard and route-exit guard; retry on both failure channels | First employee selection/first Process do not prompt to discard an empty preview; invalid policy selects and focuses its owning tab |
| Requests/output | switchMap counted paging; stale rows/counts cleared on failure; balanced loading/finalize; frozen detail/output filters; fetchAllPages all-page report/Excel | No silent empty failure or partial output; report and slip detail check response identity |
| Shared controls/scroll | FilterPanel, FeatureTitle, FormSection, EditorTabs matching ids/ARIA, FieldError, MoneyPipe, DataTable, SummaryCards with required accents | Route fills shell; settlement form pane and slip detail use their single internal scroll; no feature CSS/viewport calculations |
| Print | EditorDialog portal dialogClass, printSession bodyClasses, print-flow table ancestry, own printable title/identity/context, footer Print action, close lock while printing | Isolated slip/report printing wired from shared owners; owner visual print check pending |
| Wiring | /FinalSettlementProcess and /PaySlips lazy exports, Payroll menu and Payrolls type/View/Edit routing; toolbar suppression; four explicit runtime TS entries | No duplicate shell title; inherited auth retained |
| Bilingual source | New fields/status/errors/actions/sidebar and server resource keys; simpler original LeaveSalary notice | Final syntax/import/template/key inspection passed; six new resource keys exist exactly once in EN/AR |
| Guide | UserGuide/content/hrm-guide.ts: five Payroll topics including FinalSettlement and PaySlips; existing reader imports HRM_GUIDE and /UserGuide/hrm menu remains | Guide explains inputs/formulas/issues/save/revisions/approval/history/output and separate disbursement; visual acceptance pending |
| Scoped diff | Actual Git roots confirmed separately; baseline comparisons include untracked files; FRONTEND_SCOPED.diff and BACKEND_SCOPED.diff captured and root-reviewed | 18 frontend and 22 backend changed/new scoped files; unrelated owner migrations/DbContext/model snapshot preserved |

Applied phases0–4, phase5 source wiring and phase6 source reconciliation. Phase5 runtime and all builds/tests/typechecks/lint/database/browser verification remain excluded by AGENTS; no migrations/snapshots created or modified, no commits/push/deployment. Two existing sol workers handled disjoint frontend/backend code after freeze; root integrated shared resources/navigation/compiler roots/guide, reviewed changes and corrected final state/scroll/replay details. Reuse reduced wall time for independent source work and avoided a third agent.

## Files and source evidence

Frontend: new `FinalSettlementProcess/**` and `PaySlips/**`; modified `PayrollProcess/models/payroll-run.ts`, `Payrolls/components/list/list.component.ts`, `src/app/pages/routing.ts`, sidebar-menu-data.ts, toolbar.component.ts, EN/AR vocabularies, tsconfig.app.json and HRM guide. Backend: new PaySlip interface/service/controller and three DTOs; new three FinalSettlement DTOs; extended payroll calculate/save/run DTOs, interface/controller/service, root/revision entities/configurations, EN/AR GeneralMessage resources and StaffPayroll.md. No AutoMapper profile change: read-only custom projections and explicit aggregate snapshot creation own the mapping; no ReverseMap/Ignore additions.

`PAYROLL_FINAL_SETTLEMENT_PAY_SLIPS_SOURCE_CHECK.json` records 22 TS files, 5 templates, 132 local import/export checks and 216 exact/dynamic-family bilingual keys with zero errors at reconciliation. This is syntax and source inspection only, not Angular/.NET compilation or runtime evidence. XML resource inspection finds each of the six new result keys exactly once per language. Scoped tracked diff whitespace checks and untracked source scans show no merge markers/trailing whitespace. Root additionally compared typed input/snapshot/list/detail producer fields to frontend consumers and inspected every scoped changed/new source against the baseline.

The four compiler errors reported by the owner were repaired: required SummaryCard accents, getRun replacing an invalid BaseService.get override, missing PaySlips HTML, and validated ListRouteReader.number replacing nonexistent positiveInt. Their actual compiled outcome remains owner pending.

## Business decisions for the next review

No unresolved API shape is left. The employer policy requires another business review: CalendarDays vs Fixed30, Basic/Gross bases, remaining leave/earned gratuity days and ticket quantities/eligibility are explicit reviewed inputs. Current Leave/Eligibility source cannot establish a dated entitlement ledger or statutory exit schedule. The calculation is reproducible and versioned; automatic entitlement accrual/consumption, moving/cancelling/reopening final roots, source salary changes within coverage, absences, payment and journals remain separate policy/workflows. This is the conservative screenshot completion authorized by Master2 rule6, not an asserted statutory policy. Save/approval do not pay or post; Staff employment state is unchanged.

## Owner schema and acceptance

Owner-created `SiGma.DataAccess/Migrations/20261010080156_refactor-payroll2.cs` was inspected only for scoped declarations: it already adds LastWorkingDay, SettlementSnapshot and the final unique filtered index. No duplicate Add-Migration is currently required for these additions; if that owner migration is replaced/removed, suggested incremental name is `AddPayrollFinalSettlementSnapshots`. Database application/backfill is unverified. Existing `refactor-payroll`, `modifyPayroll`, migration designers, DbContext/model-snapshot changes are external and preserved.

After applying the owner schema and restarting the API, compile frontend/backend and manually exercise:

1. Open both routes in Arabic/English and view/narrow/dark modes; verify list/details/scroll and printed multi-page outputs.
2. Choose a salaried employee; input explicit quantities/bases/last day. Reconcile CalendarDays/Fixed30, commission, actual overtime, prorated package deductions and full due installment. Check zero/null/negative/out-of-range/date-order validations.
3. Resolve salary/absence/dedicated-component notes. Save revision1, repeat unchanged request, change policy and create revision2; verify old figures, approval reset, history/log and response identity.
4. Confirm same-month salary overlap blocks in both directions and a second final month blocks for the same employee; exercise concurrent Save/Approve and stale tokens.
5. Verify paid identity/figures lock and altered policy with a replay token fails; View and historical selection remain read-only without live staff availability.
6. PaySlips includes current saved pending/approved rows, exact No/date/type/staff filters and server paging; detail of a superseded line remains historical after staff rename/unavailability. Exercise failed initial load/history/lookup and Retry, changed filters while list loading, all-page export/report and print closing cleanup.

Suggested commit messages (suggestions only): frontend `feat(payroll): add final settlement process and snapshot pay slips`; backend `feat(payroll): version final settlement calculations and expose pay slip reads`.
