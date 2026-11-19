# LEAVE SALARY PAYROLL PROCESS FEATURE REVIEW

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Date: 2026-10-09. Scope: `SiGmaAngularFrontEnd/src/app/modules/HRM/Payroll` and the directly required Backend/API contract. The discovery below is historical; the superseding continuation and final reconciliation at the end record the implemented first-review scope selected under the owner's subsequent instructions.

## Authority and packets

- Master Guide: `F:/My Work/Shaban Documents/Shaban/sigma-erp/SIGMA_FEATURE_REVIEW_MASTER.md` and canonical blocks cited below.
- UI screen choice: Screen 09 Action dialog (`ui/screens/09-action-dialog.md`) only if the action runs against an existing selected staff record; the screenshot alone does not decide the screen type.
- UI blocks selected: UI 1 feature wiring/container-fill, UI 2 service/Result wrappers, UI 7 action cycle, UI 16 lookups, UI 22 loading/error ownership, UI 23 translations, UI 25 RTL/dark, UI 28 cancellation/stale responses, UI 29 verification.
- Backend blocks selected: BE 5 service boundary, BE 6 controller/API, BE 10 selects, BE 12 activate/deactivate, BE 15 financial-effect aggregate if processing creates a voucher or payment effect.
- Recipe drift check: `Generate-SigmaRecipes.ps1 -Check` passed all eight packets on 2026-10-09. No generated packet was edited.

## Screenshot functional evidence

| Evidence | Classification | Consequence |
|---|---|---|
| Page title `Leave Salary Payroll Process` | Explicit visible content | Add the translated feature title inside the Sigma primary panel. |
| Staff field with a selected employee | Explicit visible content; workflow inference is selection of one or more staff records | Use a typed staff lookup after the eligible-staff/API contract is frozen. |
| Red trash action beside the staff field | Explicit visible action; destructive/selection semantics are unknown | Do not implement until removal scope and confirmation behavior are frozen. |
| `PROCESS` button | Explicit visible action | Use the shared primary action cycle; the action request/response is missing. |
| Spinner below the form | Explicit loading indicator | Implement shared loading/inline error state after the request contract is known. |
| Salary amount, leave dates, leave balance, voucher/posting result | Not visible | No values, calculations, or accounting effects may be invented from the screenshot. |

## Source findings

1. The sidebar already links `sideMenu.payrolls.processLeaveSalary` to `/ProcessLeaveSalary` (`src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts`). The English translation already contains `processLeaveSalary`.
2. `src/app/modules/HRM/Payroll` currently contains `PayrollProcess` and `Payrolls`; no `LeaveSalaryPayrollProcess` route, component, model, or service exists.
3. Backend search finds `SalaryVoucherType.LeaveSalary`, but `SalaryVoucher` stores only number, type, date and total amount. It has no staff identity, leave period, line items, source snapshot, or server calculation contract. It must not be used as the process API.
4. `Staff.IsInactive` is the existing business flag for inactive/out-of-work state. `EntityBase.IsActive` is a separate flag; current payroll eligibility uses `IsInactive != true`, `IsActive != false`, and `DateOfJoining < periodEnd`.
5. `Staff` has no `DateOfLeaving`/termination date. `Leave` has counters and status but no start/end date. `IsInactive` can distinguish current vs out-of-work at a coarse level, but cannot alone calculate a final salary for a historical exit date.

## Proposed reuse decision

- **Frontend:** reuse the existing Sigma shared shell and controls used by `PayrollProcess` (`sigma-route-host`, `sigma-list-page/panel`, `app-feature-title`, shared lookup/filter controls, `app-primary-action-button`, loading/error ownership). Create a separate feature folder/component and typed model/service; do not copy the full monthly Payroll Process workspace because leave salary has a different identity, eligibility and calculation lifecycle.
- **Backend:** create a dedicated leave-salary application service/controller contract. Reuse shared Result, tenant, validation, concurrency and financial-policy infrastructure; do not overload `PayrollRunService` or the legacy generic `SalaryVoucher` CRUD. A leave-salary result should be server-calculated and should link any created voucher/result to staff and source data.
- **Eligibility reviewer decision (owner standing rule):** for a coarse current state, treat `IsInactive == true` as out-of-work and `IsInactive != true` as continuing, while retaining `IsActive != false` as the soft-delete/availability guard. This does not define an exit date or settlement amount.

## Blocking contract decisions

Implementation remains blocked until the owner supplies or approves:

1. The process API request/response (endpoint, selected staff identity shape, date/leave inputs, result lines, idempotency/version token, and whether Process persists anything).
2. Eligibility: inactive staff only, or a selected staff list; whether a staff member may be processed once; whether `IsActive` must also be true; and whether an exit/effective date is required.
3. Calculation policy: salary basis and proration; paid/half-paid/unpaid leave handling; deductions/advances; balance treatment; rounding/currency; and server-owned totals.
4. Financial effect: preview only, save a leave-salary result, create a `SalaryVoucher` with `LeaveSalary`, or post a journal/payment. The accounting effect cannot be inferred from the screenshot.
5. The red trash action semantics: remove a selected staff from a draft selection, cancel a persisted result, or another transition; confirmation and stale-state rules depend on this answer.

## Handoff

No application source was changed by this review. The existing uncommitted Payroll implementation changes in the two repositories were preserved. User Guide changes are intentionally pending the contract and implementation gate.

## Superseding continuation and final reconciliation — 2026-10-09

The owner requested the same PayrollProcess calculation, states and revisions, explicitly deferred payroll journal entries, and delegated the ambiguous business choice for a later review. The Frozen continuation in `LEAVE_SALARY_PAYROLL_PROCESS_FRONTEND_BACKEND_CONTRACT_FREEZE.md` and `LEAVE_SALARY_PAYROLL_PROCESS_MAINTENANCE_EVOLUTION_PLAN.md` supersedes the earlier separate-service recommendation and Blocked handoff.

Implemented scope: complete monthly salary for one currently inactive, available employee, using the existing calculation and revision lifecycle. This is explicitly provisional in the screen and bilingual guide. `IsInactive` is a current-status flag; it supplies no historical exit date. `IsActive` is a separate availability flag, not the soft-delete flag (`IsDeleted` owns that). No new staff property, leave-day payout, termination benefit or exit-date proration is inferred.

### Final decisions and evidence

| Concern | Decision taken / source evidence |
|---|---|
| Reuse | Extend `PayrollRunService`, `PayrollRun`, `PayrollProcessService` and `PayrollProcessComponent`; create a small route module only. Owner requested reuse and the same lifecycle; the existing snapshot owner already provides versioning, approval, logs and historical money. Copying it into a parallel service/component would duplicate those invariants. |
| UI shape | Stateful routed document/calculation workspace under screen02 and BE14, with an explicit existing calculation-route specialization: query `runId`/`mode`, shared list-style filter/table shell, read-only generated rows and inline actions. This is retained under the owner's same-component instruction. Workshop Job editor/list were inspected for canonical owners; screen05 is configuration row editing and is not the target. No financial-document/posting shape is introduced. |
| Screenshot | Title, one Staff selector, red clear selection, Process and loading are implemented through shared controls. Trash clears a draft selection; it never deletes or cancels a saved run. Month/save/history/log/approval are source- and owner-requested additions. Screenshot layout is not copied. |
| Employee scope | `LeaveSalary` requests require positive `staffId`; calculate/save revalidate tenant/live `IsInactive`, availability and joining before month end. General `Payroll` requires null scope and retains continuing-staff selection. Historical reads remain independent of current eligibility. |
| Immutable identity | Root `(SubscriptionId,PeriodStart,Type,StaffId)`; Type defaults to Payroll; root Type/StaffId assigned only at creation. Shared tenant query/lock and unique database key prevent duplicate roots. Saved Staff is fixed in UI, including after temporary form freezes are restored. |
| Calculation | Same `MonthlySalarySnapshot-v1`, effective salary, stored overtime, scheduled deductions and base-currency policy. Server calculates all values and totals; no money inputs. Existing blockers for incomplete/ambiguous data, absences and proration remain. |
| Overlap | Current saved opposing-type snapshot containing the employee adds `payrollProcess.issues.duplicatePayrollScope`; both directions are protected. Save recalculates inside existing serializable/tenant-lock boundary. No automatic offset or settlement is created. |
| Revision/action cycle | Process is read-only. First Save creates revision1; changed unpaid Save appends and resets current approval. Old revisions retain historical approval. Approve is the existing current-version transition. Paid changes return 409; exact original paid request replay remains a successful immutable no-op. Unpaid replays recheck scope/source/overlap. |
| Source versions | LeaveSalary hash binds type/staff/current eligibility; no-conflict normal Payroll hash shape stays unchanged. Version continues binding root, revision, paid and approval state. No cross-scope preview token is accepted. |
| DTO and mapping | Additive input type/staff only; `PayrollStaffOptionVm` owns id/no/value. No new AutoMapper profile; existing explicit server projections and aggregate construction remain. No generic amount/status CRUD introduced. |
| Grid / ListVM | Columns: Date, Type, Staff (code+name), Amount, Status. `PayrollRunListVm`: Date,Type,StaffCode,StaffName,Amount,IsApproved plus minimum Id,IsPaid,RevisionNumber,Version for actions. Staff labels come from saved lines, with explicit child tenant/live predicates. |
| Filters/paging/export | Exact keys dateFrom,dateTo,type,pendingApproval,sortField,sortOrder retained. Type supports Payroll/LeaveSalary; UI defaults Payroll. Count/paging contract retained. Applied filter type controls the new-process action; row type controls View/Edit. Return query preserves filters/page. LeaveSalary line export filenames include type and staff identity; normal filenames stay unchanged. |
| Loading/errors/confirmation | Staff loading/error/retry, both API failure channels, teardown, saved fallback option, required feedback, discard Cancel and clear/change context checks implemented. Existing revision/list cancellation and dialog identity gates reused. Root review corrected a computed FormControl readiness dependency and reasserted persistent locks after freeze restoration. |
| Financial effects | Save/Approve create no payment, voucher, installment-paid update, ledger or journal. Journal integration is deferred explicitly by owner; payment/settlement writer remains outside this feature. |
| Auth | Existing Authorize/AuthGuard boundary only. No invented permissions. Approval (`POST PayrollRuns/{id}/approve`) remains an authorization candidate for the deferred permission design, not a new restriction. |
| Shared extraction | No new generic owner qualified. The existing payroll business owner is extended and shared controls are composed; no duplicated lifecycle, row calculator, CSS or provider/interceptor is added. |

### Source conformance reconciliation

| Producer/consumer concern | Compared final source values | Outcome |
|---|---|---|
| Shared page/title | Process and Payrolls use sigma-route-host/sigma-list-page/panel and FeatureTitle; toolbar `showPageTitle` excludes the 3 payroll routes | Matched existing calculation specialization; no duplicate toolbar title |
| Filter/lookup | Month uses DatePicker/mm-yyyy typed normalization; Staff uses public DropdownModule inputs id/value/filterBy/body overlay/loading; FieldError/required label; clear icon is non-destructive | Matched shared owners; runtime geometry/keyboard pending |
| Grid/totals | DataTable fill/read-only/paginator=false for calculation; shared paged management table; SummaryCards slim/row/min140/max80 | Existing source values preserved; no custom CSS or page-height calc |
| Action ownership | PrimaryActionButton Process/Save, ConfirmationDialogService discard/approve; temporary freeze plus final saved/view locks | Source matched; interaction acceptance pending |
| Request/response | FE type/staffId/period/expectedVersion ↔ DTO fields/`TryScope`/complete-key query; Results staff lookup ↔ id/no/value typed options | Matched |
| History | Load/get/revisions preserve scope; historical UI verifies id/period/revision/type/staff; backend Get ignores current employee eligibility | Matched |
| List columns/filters | Column/ListVM mapping above; type labels dynamic; staff snapshot projection; Filters bracket serialization and server FilterHelper names | Matched |
| Routes | Sidebar existing /ProcessLeaveSalary ↔ routing lazy import ↔ LeaveSalaryPayrollProcess_Routes ↔ same component/exit guard | Matched; mode query compatibility preserved |
| Guide | HRM_GUIDE contains /ProcessPayroll,/ProcessLeaveSalary,/ProcessedPayrolls topics; /UserGuide/hrm already reader-registered/sidebar-linked | Matched final screen/backend; bilingual purpose, prerequisites, actions, states and limits |

### Files changed by this continuation

Frontend root `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- `src/app/modules/HRM/Payroll/PayrollProcess/components/process/payroll-process.component.ts` and `.html`.
- `src/app/modules/HRM/Payroll/PayrollProcess/models/payroll-run.ts`, `services/payroll-process.service.ts`, `payroll-process.routes.ts`.
- `src/app/modules/HRM/Payroll/Payrolls/components/list/list.component.ts` and `.html`, `models/list.ts`.
- New `src/app/modules/HRM/Payroll/leaveSalaryPayrollProcess/leave-salary-payroll-process.routes.ts`.
- `src/app/pages/routing.ts`, `src/app/_metronic/layout/components/toolbar/toolbar.component.ts` (payroll route/title hunks only).
- `src/app/modules/i18n/vocabs/en.ts` and `ar.ts` (feature and required payroll navigation keys only).
- `src/app/modules/UserGuide/content/hrm-guide.ts` (owning in-app guide; no new viewer/menu duplication).

Backend root `F:/My Work/Sigma/SigmaBackend`:

- `SiGma.Business/IServices/IPayrollRunService.cs`, `SiGma.Business/Services/Payrolls/PayrollRunService.cs`.
- `SiGma.Helpers/Models/Staffs/PayrollRun.cs`, `StaffPayroll.md`, `SiGma.DataAccess/Configuration/PayrollRunConfig.cs`.
- `SiGma.ServerAPI/Controller/PayrollRunsController.cs`.
- `SiGma.ViewModels/ViewModels/PayrollRun/PayrollCalculateVm.cs`, `PayrollSaveVm.cs`, `PayrollRunVm.cs`, `PayrollRunListVm.cs`, new `PayrollStaffOptionVm.cs`.
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx` and `GeneralMessage.ar-SA.resx` (two Payroll validation keys only).
- Removed exactly the five abandoned task-created DTO/interface drafts listed in the Frozen contract, after checking they were unconsumed. No owner source removed.

### Verification evidence and boundaries

- Recipe drift `-Check` passed all eight packets again after implementation; no canonical book/packet edits were needed. PLAN00 and phases00–06 guided source work. Phase04 reuses existing approval, no new financial transitions; Phase05 runtime execution was skipped under the explicit project boundary.
- Confirmed actual repository roots separately with read-only Git. Complete affected-source baseline diffs and new-file diffs captured and reviewed as `LEAVE_SALARY_PAYROLL_PROCESS_FRONTEND_SCOPED.diff` and `LEAVE_SALARY_PAYROLL_PROCESS_BACKEND_SCOPED.diff`. Current Payroll source was already untracked, so pre-edit copies were essential to isolate this continuation.
- Concurrent unrelated Workshop Job edits appeared in shared vocabularies/resources and `tsconfig.app.json` after baseline capture. They were preserved, not attributed to Payroll and not refactored. The scoped diff captures shared-file concurrent hunks for audit; only the feature hunks above belong to this change. No application compiler configuration was changed by this task.
- `LEAVE_SALARY_PAYROLL_PROCESS_SOURCE_CHECK.cjs`/`.json`: 15 TypeScript files parsed, 3 Angular templates parsed, 68 exact local import paths/named exports inspected, 118 feature and backend-emitted translation keys present in both languages; zero reported errors. Feature translation objects also checked for duplicate property names. These checks do not establish semantic type checking or compilation.
- Backend resource XML parsed; no duplicate resource keys. New public-control inputs/standalone registration inspected. Scoped merge-marker/orphan-reference scans returned no matches. Tracked and baseline/new-file whitespace checks clean with CRLF-aware settings (initial CR-at-EOL reports were line-ending artifacts, not source spaces).
- Root reviewed scope/concurrency/hash/list/history changes; a bounded independent final cross-layer source audit found no actionable contract mismatch. No build, tests, lint, application/browser, database, migration/snapshot edits, commits, pushes or deployment commands were run.

### Schema migration required before runtime acceptance

Owner command: `Add-Migration AddPayrollRunTypeAndStaffScope` (no existing migration of this name found).

Schema changes: required Type max32/default Payroll, nullable StaffId/restrict Staff FK, replacement of the monthly-only unique index with unfiltered `(SubscriptionId,PeriodStart,Type,StaffId)`. Inspect the generated incremental migration against the owner's existing payroll migration/snapshot; verify legacy roots become Type=Payroll/StaffId=null, monthly null scopes remain unique, and new selected-staff roots do not retain the old month-only constraint. Check duplicates and existing staff references before applying. No column is dropped and no historical amounts are rewritten by this source change.

### Owner acceptance still pending

1. Compile both repositories, inspect/create the incremental migration and apply it through the owner's usual workflow.
2. Confirm normal Payroll still selects continuing staff and LeaveSalary selects one available inactive staff; try missing/foreign/active staff and wrong-type deep links.
3. Calculate a valid complete month, Save, repeat unchanged Save, change source inputs, Save a new revision, verify old history and logs, approve the exact current revision, verify stale-token recovery and approval reset. Check existing paid no-op replay and paid-change rejection when a payment writer supplies that state.
4. Verify cross-type current-snapshot overlap blocks both directions, including a status change between calculation and Save. Historical-only rows must not falsely block.
5. Check lookup failure/retry and historical viewing after eligibility/name changes; Staff stays locked after save/load/history/notes/log closure, View keeps Month locked, and discard Cancel retains selection/calculation.
6. Check list applied-type versus draft-type navigation, saved row View/Edit, return filters/page, list/export completeness and distinct employee export filenames.
7. Accept responsive/no-page-scroll, EN/AR/RTL, dark theme, body overlays, keyboard/focus and guide navigation. These remain runtime/visual checks, not source defects or frozen-contract blockers.

Business follow-up: the next review must confirm whether the operational meaning remains a complete inactive-employee monthly salary or becomes leave encashment/final settlement. That later policy requires explicit date/entitlement/proration rules before changing this calculation. The current reviewable scope is labelled and implemented; journals remain deferred as requested.

### Agents and suggested commits

Two bounded `sol_worker` streams used selectable `gpt-5.6-sol`, as AGENTS requires after contract freeze: backend owned the 13 backend files and draft cleanup; frontend owned HRM/Payroll only. Root owned business decisions, integration, translations, guide, export-name refinement and final diffs. Frontend worker then performed a read-only cross-layer audit. Parallel work reduced elapsed implementation time without overlapping writes; compatible shared-file concurrent owner changes were preserved.

Suggested only, stage the feature hunks above rather than unrelated owner changes:

- SiGmaAngularFrontEnd: `feat(leave-salary): reuse payroll workspace for inactive staff`.
- SigmaBackend: `feat(leave-salary): scope payroll snapshots by type and staff`.
- Review documentation: `docs(leave-salary): record contract and source reconciliation`.

## Lookup failure diagnosis — 2026-10-09

The owner reported `Eligible employees could not be loaded. Retry before calculating.` on `/ProcessLeaveSalary` and explicitly authorized modifying or adding experimental data. This changes the database-command boundary for scoped diagnostic/data work; it does not authorize migrations or builds. After a specific build/restart question, the owner chose to restart the API themselves.

### Verified cause and independent schema prerequisite

- The frontend requests `GET /PayrollRuns/leave-salary-staff`. The current source controller declares that exact authorized route and the service declares the matching tenant-scoped inactive-staff query.
- A narrow read-only HTTP diagnostic against the already-running local API returned **404**. Its Swagger document lists the other PayrollRuns actions but does **not** list `/PayrollRuns/leave-salary-staff`. Thus the running API has not loaded the newly implemented controller version. This is not evidence of an empty employee lookup, an authentication failure, or a broken SQL projection; no speculative source/authentication workaround was added.
- Read-only database inspection, authorized by the owner's experimental-data instruction, found `PayrollRun.Type` and `PayrollRun.StaffId` absent, with the old unique index `(SubscriptionId, PeriodStart)` still present. Restarting an updated binary addresses the missing route, but calculation/save also require the already-described owner migration `AddPayrollRunTypeAndStaffScope`. No migration, snapshot change, schema command, or data mutation was executed in this diagnosis.

### Existing experimental data

The inspected configured database has staff in subscription1007, including **18 available inactive employees**. There is no need to add another employee merely to populate this picker. Existing experimental code **Test2**, staff269, has six active, nondeleted salary components effective **2026-10-01**: Basic2000, Housing350, Transport250, Gross2600 and the normal/holiday overtime rates. Its joining date precedes October; no October absence, deduction, September/October overtime, or current October payroll line for this employee was found. HRM settings use previous-month overtime and do not enable the two unsupported payroll modes. These are input prechecks, not a verified calculation response or a completed Save/Approve cycle; currency-resolution/runtime acceptance remains pending.

### Reconciliation and handoff

No application source changed in this diagnostic continuation; the existing guide and frozen id/no/value contract remain applicable. The only artifact changed is this review appendix. The owning source paths and route were read directly; unrelated source, pre-existing migrations and owner snapshot modifications were preserved. Small sequential diagnosis did not meet the subagent delegation gate. No build, tests, lint, migration, browser automation, commit, push or deployment was performed. The narrow HTTP read and database SELECTs above are explicitly recorded runtime/database evidence; the prior source-only implementation report is historical and unchanged. Owner next steps: restart/rebuild their local API to load the route, create/review/apply the incremental schema migration through their usual workflow, then try Test2 for October2026 and report any remaining error.
