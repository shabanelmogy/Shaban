| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |

# HRM Payroll frontend audit — 2026-10-09

## Scope and evidence boundary

This is a source-only audit of the HRM Payroll navigation and the related salary
voucher/attendance source. No application source was edited. No screenshot was
attached in the audit request context, so screenshot-backed visible requirements
are **Uncertain**; the findings below use the actual menu, route, Angular source,
and named backend contracts. Runtime, visual, API and owner acceptance remain
pending. The canonical list/grid comparison uses screen 01 and UI blocks 1, 2,
4, 5, 6, 7, 9, 10, 13, 15, 17, 19, 22, 23, 24, 25, 27 and 28.

## Executive finding

There is no implemented HRM Payroll processing screen or pay-slip screen. The
HRM sidebar advertises four payroll entries, but three are literal `#` links and
the fourth points to `/ProcessLeaveSalary`, for which no Angular route or module
source exists. A separate legacy `/SalaryVoucher` route exists under Vouchers;
it is a generic salary-voucher CRUD scaffold and is not wired to the HRM Payroll
menu or to a payroll-process/pay-slip workflow. No non-migration backend payroll
process or pay-slip endpoint was found. The requested Payroll screen therefore
cannot be safely implemented from current source without a frozen domain/API
contract (period, staff selection, attendance/overtime/leave inputs, posting,
reversal/approval, totals, and pay-slip output are all Missing).

## Navigation and route inventory

| Evidence | Actual symbol/value | Result |
|---|---|---|
| `src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts:734-751` | `sideMenu.hrms.payroll` children: `processPayroll -> '#'`, `processLeaveSalary -> '/ProcessLeaveSalary'`, `processedPayrolls -> '#'`, `paySlips -> '#'` | Three dead placeholder links; one target has no route |
| `src/app/pages/routing.ts:1449-1453` | `path: 'SalaryVoucher'` lazy-loads `SalaryVoucher_Routes` | Generic voucher route exists outside HRM Payroll |
| `src/app/pages/routing.ts:548-558` | `path: 'StaffTimesheet'` loads `Staff/StaffTimesheet` | HRM Attendance menu's `/StaffTimesheet` target resolves to Staff module |
| `src/app/pages/routing.ts:1253-1267` | `path: 'Overtime'` loads `HRM/Overtimes/Overtime` | Overtime source exists as an input/source area, not payroll processing |
| `src/app/pages/routing.ts` full source search | No `path: 'ProcessLeaveSalary'`, payroll process, processed payroll, or pay-slip route | Payroll workflow screens are absent |
| Angular file inventory | No `process-payroll`, `processed-payroll`, `pay-slip`, `payslip`, or `ProcessLeaveSalary` component/service/model files | No hidden implementation found |

The HRM attendance menu also contains a separate `StaffTimesheets` route at
`routing.ts:1268-1274` loading `HRM/StaffTimesheets/StaffTimesheet`. Its list
component is legacy `ms-lib`/`table-list` and is not the route used by the menu's
`/StaffTimesheet` entry. This duplicate source should be treated as a separate
maintenance decision, not as evidence of payroll processing.

## Existing SalaryVoucher screen (not Payroll processing)

Actual files:

- `src/app/modules/Vouchers/SalaryVouchers/SalaryVoucher/salaryvoucher.routes.ts`
- `.../components/list/list.component.ts` and `.html/.scss`
- `.../components/details/details.component.ts` and `.html/.scss`
- `.../services/salaryvoucher.service.ts`
- `.../models/{list,details,create}.ts`

The route declares only `''`, `details/:id`, and `create`; it has no edit/view
mode contract, list state return, or payroll period/process route. The list uses
`TableListComponent` from `node_modules/ms-lib`, `ListCol`, `EnumToArrayPipe`, an
untyped `getListItems(fillter?: any)`, and a plain `.card`/`<table-list>` wrapper.
It does not use the canonical `sigma-route-host`/`sigma-list-page` shell,
`app-feature-title`, `form[appFilterPanel]`, `app-data-table [fill]`, typed
`ListQuery`/`resolveListPaging`, server count/paging, current-page report, or
shared action/delete confirmation. `getListItems` starts/ends the global loader
only in `next`, has no `error` callback or `finalize`, and silently leaves stale
rows/error state on transport failure. The `no` column is configured in
`initCols()`, but `SalaryVoucherDTO` has no `no` property.

The details component is an additional legacy mismatch:

- raw `.card` and `ButtonsComponent` instead of the routed financial-document
  editor shell (`app-feature-title`, bounded body/footer, typed state/actions);
- native `<input type="datetime-local">` in `details.component.html`, prohibited
  by UI17; no shared `appDatePicker`, hydration, or date validation;
- hand-written `<p class="errors">` blocks instead of `app-field-error`, no
  `markAllAsTouched()`/first-invalid focus, and no explicit `novalidate` form;
- `salaryVoucherForm` is untyped `FormGroup`; `SalaryVoucherCreateDTO.voucherType`
  is `string` while the form and backend VMs use enum `SalaryVoucherType`;
- `subscriptionId` is placed in the form and create payload even though tenant
  identity is server-owned and must not be sent;
- `totalAmount` is client-editable without source evidence that it is an input;
- detail load/save/update/delete subscriptions handle only `next`, with no
  `error`/`finalize` state restoration; save does not visibly retain failed input;
- no dirty close/CanDeactivate confirmation or identity/pending gate;
- `delete()` navigates to `/SalaryVouchers` (plural), while the declared route is
  `/SalaryVoucher`; `update()` enables the complete form, including fields that
  were disabled for read mode;
- `save()` computes `salaryVoucherData` but does not use it, then dispatches by
  ternary; no guarded duplicate-action state.

## Backend contract evidence

The only non-migration salary-voucher symbols found are:

- `SiGma.ServerAPI/Controller/SalaryVoucherController.cs` — an empty subclass
  of the generic `SiGmaControllerBase`;
- `SiGma.Business/Services/SalaryVoucherService.cs` — an unoverridden generic
  `Service<...>`;
- `SiGma.ViewModels/ViewModels/SalaryVoucher/{SalaryVoucherAddVm,
  SalaryVoucherUpdateVm,SalaryVoucherListVm,SalaryVoucherDetailVm}.cs` — number,
  voucher type, date and total amount only;
- `SiGma.Helpers/Enum/SalaryVoucherType.cs` — includes `Payroll`, but this enum
  member alone does not define payroll calculation, period, state, posting,
  employee, deduction, leave, overtime, or pay-slip behavior.

No `ProcessPayroll`, `ProcessedPayroll`, `ProcessLeaveSalary`, `PaySlip`, or
equivalent controller/service/VM was found outside generated migrations. Payroll
settings in `Administration/Settings` (`HrmSetting` and `hrm.component`) only
contain previous-month overtime/commission and business-unit processing flags;
they do not provide a payroll API or screen contract.

## Canonical comparison and decision table

| Concern | Canonical evidence | Current state | Classification |
|---|---|---|---|
| Screen type | Catalog screen 08 for an accounting document; screen 01 only for ordinary fields | Payroll process/pay-slip shape is absent; SalaryVoucher is a generic legacy CRUD | **Missing contract** |
| Navigation | UI1 route/menu points to a real feature route | Three `#` links and one nonexistent `/ProcessLeaveSalary` | **Confirmed defect** |
| List/grid | UI1/4/5/6/28 shared shell, typed server paging, cancellation, empty/error states | `ms-lib` `table-list`, untyped filter, no paging/count/cancellation/error path | **Confirmed defect** for SalaryVoucher review; do not repair without payroll scope decision |
| Editor | UI13/15/17/19; financial documents use routed page and shared date/error owners | Raw card/buttons, native datetime, custom errors, no dirty gate | **Confirmed defect** for SalaryVoucher review |
| Payroll business behavior | Master block 4 requires frozen API/action-state contract before implementation | No process/pay-slip producer or route | **Blocked / Missing** |
| Translations | UI23 requires EN/AR keys for implemented controls | Payroll labels exist for menu; no implemented screen content contract | **Uncertain** for requested screenshot |
| Screenshot requirements | Master block 2: screenshot proves visible content only; missing details need source/owner decision | No screenshot present in this audit context | **Uncertain** |

## Required owner decisions before implementation

1. Is the requested screen a payroll-period calculation/process workspace, a
   leave-salary action, a processed-payroll list, a pay-slip report, or a
   generic salary voucher? The existing `SalaryVoucher` name/enum is not enough.
2. Freeze the backend producers and transitions: period/calendar, employee
   eligibility, salary package/attendance/overtime/leave/deduction inputs,
   calculated fields, persistence, posting/accounting effect, approval/void or
   reversal, concurrency, and exact read/write/export/print endpoints.
3. Replace placeholder menu links only after each target route/API exists. Do not
   point all entries to `/SalaryVoucher` or invent pay-slip data from the generic
   voucher DTO.
4. Decide whether the two StaffTimesheet modules are consolidated, and which
   attendance/overtime sources payroll consumes. This is separate from a screen
   refactor and may require a maintenance/evolution plan.

## Verification boundary

Source-only searches and exact file reads were performed. No build, test, lint,
browser/app, database, migration, Graphify, SigmaMCP, commit, or push command was
run. No source/config/menu/translation file was edited; this artifact is the only
file created by this audit.
