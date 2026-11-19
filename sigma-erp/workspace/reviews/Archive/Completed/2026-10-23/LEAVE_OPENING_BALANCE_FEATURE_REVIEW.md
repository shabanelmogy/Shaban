# Leave Opening Balance — implementation and reconciliation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

2026-10-11. Outcome: HRM > Administration > Leave Opening Balance, route `/LeaveOpeningBalance`, implements independent imported starting balances with a type/staff filter, server-paged list, one Create/View/Edit dialog, confirmed soft deletion and full applied-result Excel export. English/Arabic UI and the existing HRM user guide were updated.

Plan: `LEAVE_OPENING_BALANCE_MAINTENANCE_EVOLUTION_PLAN.md` (Frozen). Handoff: `LEAVE_OPENING_BALANCE_FULL_STACK_CONTRACT_FREEZE.md` (Frozen, with explicit source-backed paging correction). Screenshot E1 is content evidence only. There was no existing baseline entity/API; new fields and ordinary record management are reviewer decisions under the owner's standing rule and the user's explicit request to infer missing business from comparable applications.

## Business decisions and evidence

### Sidebar-order follow-up — 2026-10-11

Owner requested LeaveOpeningBalance as the third item. Moved the existing sidebar entry immediately after Departments: Staff Roles, Departments, Leave Opening Balance, Account Linking, Settings. Only `sidebar-menu-data.ts` changed for this follow-up; existing route/icon/translation and unrelated Settings link change were preserved. Source order and scoped diff/whitespace verified. UI wiring/reconciliation only; no API/schema or guide content changes, subagents, builds or runtime checks. Suggested frontend commit: `fix(hrm): place leave opening balance third in administration menu`.

### Compiler-feedback follow-up — 2026-10-11

The owner reported CS0246 for `Expression<>` in `LeaveOpeningBalanceService` and `ILeaveOpeningBalanceService` in the API controller. Added the missing local `using System.Linq.Expressions;` to `SiGma.Business/Services/LeaveOpeningBalanceService.cs`. The public interface already exists in `SiGma.Business.IServices`; the controller already imports that namespace and the API project already references Business. The controller diagnostics are likely downstream of the failed Business compilation; owner rebuild is required to confirm their disappearance. No interface/controller/project-file edits were needed from source evidence.

Normal-entity shape (BE13) and service/controller ownership (BE5/6) remain unchanged, matching the inspected Branch reference. Only the namespace import changed; no API, persistence, business, migration, mapping or guide contract changed. Applied scoped integration/reconciliation; other feature phases and guide edits are not applicable to this import correction. Recipe check: all eight packets current. Scoped source and whitespace review passed; no builds, tests, database/migration commands, commits or pushes were run. No subagents used for this small sequential fix. Suggested backend commit: `fix(leave-opening-balance): import expression tree namespace`. Owner verification: rebuild Business and ServerAPI and recheck the three reported diagnostics.

| Concern | Final decision | Evidence/reason |
|---|---|---|
| What the screen manages | Remaining leave imported on a stated date | Screenshot title; comparable employee/type/date/days allocation structure in https://docs.frappe.io/hr/leave-allocation |
| Record key | One live baseline per tenant, employee and type | Avoids repeatedly adding the same initial balance; EF filtered unique index and scoped duplicate validation |
| Date | Explicit calendar date on each record; form defaults today | A migration baseline needs an as-at date; shared date-only hydration/transport |
| Days | Nonnegative decimal(9,2), up to 9999999.99; zero and half-day values allowed | Fractional imported entitlements supported; upper bound is storage capacity, not annual policy |
| Other data | Optional notes up to 1000 characters | Provenance/correction context, matching existing Leave reason scale |
| Current available balance | Not calculated by this feature | Existing Leave request snapshots have no authoritative accrual/allocation ledger; they remain unchanged |
| Annual grants/rollover/expiry | Separate future policy workflow | LeaveType flags alone do not define allocation periods or accounting/expiry transitions |
| Payroll/encashment/accounting | No effects | No monetary values or journal contract in this page |
| Historical data | New empty table, no inferred backfill | Missing opening records are not invented zero entitlements |
| Concurrent correction | Required detail RowVersion on PUT; stale versions return 409 | Immediate comparison plus EF OriginalValue check catches both already-stale and racing writes |
| CRUD deletion | Shared confirmation; generic soft delete | Removes the baseline only; no SQL/data cleanup executed |
| FK lifetime | Live tenant-scoped references; employee/type deletion blocked when referenced | StaffService/LeaveTypeService dependency checks and restrictive FKs |

Existing Leave durations remain whole numbers. Fractional opening balances do not change those durations or feed a newly invented balance/pay calculation.

## Changed files

Angular repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

New feature folder `src/app/modules/HRM/Administration/Leave Opening Balance/LeaveOpeningBalance/` contains all nine files:

- `leave-opening-balance.routes.ts`
- `components/list/list.component.ts` and `list.component.html`
- `components/details/details.component.ts` and `details.component.html`
- `models/list.ts`, `models/create.ts`, `models/details.ts`
- `services/leave-opening-balance.service.ts`

Direct integration edits: `src/app/pages/routing.ts`; `src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts`; `src/app/_metronic/layout/components/toolbar/toolbar.component.ts`; `src/app/modules/i18n/vocabs/en.ts` and `ar.ts`; `src/app/modules/UserGuide/content/hrm-guide.ts`.

Backend repository: `F:/My Work/Sigma/SigmaBackend`.

- New `SiGma.Helpers/Models/Staffs/LeaveOpeningBalance.cs`
- New `SiGma.DataAccess/Configuration/LeaveOpeningBalanceConfig.cs`
- New `SiGma.ViewModels/ViewModels/LeaveOpeningBalance/LeaveOpeningBalanceAddVM.cs`, `LeaveOpeningBalanceUpdateVM.cs`, `LeaveOpeningBalanceDetailVM.cs`, `LeaveOpeningBalanceListVM.cs`
- New `SiGma.Business/MapperConfig/LeaveOpeningBalanceProfiler.cs`
- New `SiGma.Business/IServices/ILeaveOpeningBalanceService.cs`
- New `SiGma.Business/Services/LeaveOpeningBalanceService.cs`
- New `SiGma.ServerAPI/Controller/LeaveOpeningBalanceController.cs`
- Modified `SiGma.DataAccess/SiGmaDbContext.cs`, `SiGma.Business/Services/LeaveTypeService.cs`, `SiGma.Business/Services/StaffServices/StaffService.cs`
- Added ten feature message keys to both `SiGma.Helpers/Localization/Shared/GeneralMessage.resx` and `GeneralMessage.ar-SA.resx`

All earlier HRM administration/account-linking/settings/staff-role/departments/payroll edits, existing migrations and the existing modified model snapshot were preserved. They are not part of the suggested commits below. No approved reference file was modified.

## Contract and conformance reconciliation

Grid: Actions first (shared DataTable owner), then `staffName`, `leaveTypeName`, `effectiveDate`, `openingDays`, `notes`. Backend ListVM beside it: `Id`, `StaffName`, `LeaveTypeName`, `EffectiveDate`, `OpeningDays`, `Notes`. Id is the sole additional row action identity. No tenant/audit/status/editor-only properties in the list. Date uses shared `type:'date'`; days uses `type:'number'`; notes uses the public shared wrap class. Excel uses those same columns and all matching pages.

Add: `staffId`, `leaveTypeId`, `effectiveDate`, `openingDays`, `notes`. Update adds `id` and base64 `rowVersion` only. Detail adds `id`, names and version to those displayed/editable values. No calculated fields, tenant, audit, number or approval inputs.

| Path/concern | Actual final producer/consumer comparison | Source result |
|---|---|---|
| Shape | UI catalog01/13: fields-only baseline; one list route and one controlled EditorDialog in all modes | Conforms |
| Shell/title | `LeaveOpeningBalancesComponent.host`=`sigma-route-host`; list-page/panel/header/table chain exactly reuses Job/shared owners; FeatureTitle inside card; Toolbar `isLeaves` includes route | Conforms; no feature SCSS |
| Filters | List `filterForm` number/null `leaveTypeId`/`staffId` → service `toListParams` → generic entity filter keys; null omitted | Conforms |
| Applied context | `search` snapshots form; paging/editor success/delete/export use `appliedFilters`, not current unapplied controls | Conforms |
| Control layout | FilterPanel mainColumns2/inlineActions/stableLayout; shared Reset; EditorDialog width640/contentPadded with grid2; no local spacing/color wrappers | Conforms to public shape inputs |
| Paging | Shared DEFAULT_PAGE_SIZE15 and resolveListPaging; `switchMap` cancels stale requests; API `CountAsync`/TotalCount supplies totalRecords | Conforms; backend omitted paging remains inherited compatibility behavior |
| Lookup producer | Existing Staff/LeaveType GetSelect → generic DropdownDto int Id; options retained directly, no private conversion; edit uses shared saved-label merge | Conforms |
| Detail read | `DetailWithNavigationsAsync` ProjectTo exact detail → editor `getDetails` identity check; failed read leaves disabled form/Retry | Conforms |
| Create/edit/view | Fields match DTOs; View names/read text skip dropdown reads, disabled notes; Edit loads options; save gated on ready snapshot/options | Conforms |
| Date/days validation | DatePicker/dateValueValidator/toPickerDate/toApiDate; required finite nonnegative days/range/two-decimal check; backend values/FKs/VM length validated | Conforms; runtime boundary acceptance pending |
| Errors/loading | Inline header on every owned API read/write; result-false and HTTP error handled; global loader + finalize; no duplicate success toast | Conforms |
| Dirty exits | X/Cancel/Escape/route guard delegate deferred canDeactivate; freezeFormState disables draft during confirmation/save and restores cancellation/failure | Conforms |
| Keyboard startup | Shared closeButtonId + focusField; destroyed-aware timer waits until rendered close control is enabled; date overlay remains closed | Source conforms; interaction pending |
| Uniqueness/concurrency | Filtered unique index; shared ExecuteUniqueWriteAsync; duplicate check; RowVersion current comparison and OriginalValue with 409 catches | Source conforms; SQL/two-session verification pending |
| Mapping | Add/update maps; only RowVersion ignored on update for EF ownership; list/detail map referenced names; no ReverseMap | Conforms |
| DI/EF | DependencyResolver scans AccountService assembly for interfaces; BranchProfiler assembly for maps; DbContext scans sealed configs and declares DbSet | Source wiring confirmed |
| Authentication | Root-registered existing HttpClient; environment API URL; token/error interceptors; inherited controller Authorize and tenant-scoped repository | Source wiring confirmed; no invented permissions |
| Reference actions | CRUD/search/export applicable; Job cancel/close/approve/invoice/labour/log/gate-pass N/A to non-workshop baseline | Explicitly classified |
| Guide | New bilingual HRM topic route; existing GuideReader HRM_GUIDE registration and sidebar /UserGuide/hrm reused | Conforms to final screen |

Override audit: SearchColumns (confirmed optional search projection); MaterializeListAsync (navigation-name list projection); DetailWithNavigationsAsync (lean projection avoids deep Staff graph); AddAsync (values/FKs/key + shared unique guard, then base Add mapping/save); UpdateAsync (shared unique guard); UpdateCoreAsync (tracked concurrency/FKs/key and one save). Generic GetManyAsync, RemoveAsync and all controller methods inherited. Direct Staff/LeaveType removal checks are justified by the new inbound live FK. No bulk AddList/UpdateList consumer or controller endpoint exists for this feature. Inherited generic extra routes are not feature UI actions.

Shared extraction result: reused FilterPanel/FeatureTitle/DataTable/EditorDialog/FieldError/StateMessage, existing selects, date helpers/directive, numeric focus, confirmation presets, freezeFormState, mergeSelectOptions, paging/all-pages/export and error helpers. No new shared extraction qualified: precision/date/key rules are baseline domain behavior; no copied layout or new generic framework was introduced. No reusable rule/book/skill change or derivative refresh required.

Authorization candidates for future project mechanism: entering/correcting starting balances (`POST`/`PUT /LeaveOpeningBalance`) and deleting them (`DELETE /LeaveOpeningBalance?id=...`). Current routes are authenticated only; no stronger restriction is claimed or added.

## Phases and verification

Applied PLAN00 and Phases0/1/2/3/5/6. Phase4 not applicable: no approval/post/void/finalize or independent domain transition. Normal Save/Search/Reset/export/confirmed CRUD deletion remain their owning phases.

Recipe check passed before use and at reconciliation for all eight packets; no drift. Frontend feature TS/template syntax parsing: nine files, zero syntax diagnostics (explicitly not application compilation/type checking). New translation block and sidebar sub-block parity: 33 keys each, zero missing/case differences. Both RESX files parsed: ten feature keys each, zero feature duplicate names. Scoped tracked diffs in both actual repositories plus new file sources reviewed, shared exports/input names/standalone registration inspected, stale imports/merge markers/inappropriate new API scans clear; whitespace diff check passed. LF/CRLF normalization warnings are existing repository behavior. Final semantic changes were re-inspected and final parsing/whitespace checks recorded at handoff.

Final handoff recheck: feature source parsing returned nine files and zero syntax diagnostics; both repository `git diff --check` commands exited successfully after the final focus/concurrency changes.

No build, test, lint, browser/app verification, database command, migration/snapshot modification, commit, push, deployment, Sigma MCP or Graphify action was run.

No required Missing/Conflicting/Uncertain contract remains within the baseline-management slice. Current available balance/accrual/carry-forward/expiry/payroll integration is explicitly outside the frozen slice; it is not silently represented as implemented.

## Schema and owner handoff

Required command: `Add-Migration AddLeaveOpeningBalances`. Suggested name checked against existing migration names; no collision found. New schema: baseline table with required StaffId/LeaveTypeId/date/days; nullable Notes1000; SQL RowVersion; decimal9,2; nonnegative/range check; restrictive FKs; unique live tenant/staff/type index and date index. Existing entity properties/columns were not changed. There is no automatic baseline backfill and no column removal or existing balance rewrite. The owner generates/reviews/applies the migration in the backend before exercising the page.

Owner verification pending:

1. Backend/frontend compilation after migration. If Angular reports a missing feature component in its explicit files boundary, add only the exact runtime component to tsconfig.app.json per UI1; no broad include or speculative roots were added here.
2. Add zero/0.5/two-decimal balances; reject negative/too-precise/range-invalid days, missing or invalid dates, notes over1000, duplicate pairs and invalid/other-tenant FKs.
3. Open the same record in two sessions; save one, then verify the other gets conflict without replacing the new balance. Reload and intentionally correct the current record.
4. Search/reset/type/staff filtering, size-only page changes, applied-context refresh, delete-last-row behavior and full-result Excel in English/Arabic.
5. Failed reads/lookups/saves and Retry; draft retention; dirty X/Cancel/Escape/navigation, cancelled discard and View close; single success notification.
6. Light/dark/RTL/narrow layout, one row/dialog scroll owner, fixed title/filter/footer, body overlays, initial focus/trap/return and first-invalid focus.
7. Staff/LeaveType delete blockers for live balances; deleting a balance does not delete requests or change payroll/history.

In-app guide: `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/hrm-guide.ts`, existing route/menu `/UserGuide/hrm`. Covers purpose, type/staff filters, paging/export, record fields/precision/key/date, create/view/edit/delete, stale-version recovery, Retry/discard and absence of automatic accrual/financial effects. Content reconciled against final source; owner visual and interaction acceptance pending.

Suggested commits, limited to the files listed above:

- SiGmaAngularFrontEnd: `feat(leave-opening-balance): add administration page and guide`
- SigmaBackend: `feat(leave-opening-balance): persist staff leave starting balances`

Agent utilization: root owned discovery/plan/freeze/frontend/integration/reconciliation. One `backend_balance` worker (gpt-5.6-sol, role sol_worker) owned backend files after freeze, then corrected generic persistence/paging ownership during root audit. Independent files reduced elapsed implementation time; backend concurrency/FK persistence justified the model routing. No overlapping edits while the worker was active; root added an explicit already-stale version comparison after handoff.
