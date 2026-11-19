# HRM payroll backend/API audit

Status: **Draft** — owner verification pending: **yes**.  Read-only source audit; no application source, database, migration, build, test, lint, or runtime changes were made.

## Scope and evidence

The audit covers the payroll owning paths in `SigmaBackend` and the existing Angular payroll consumers: `SalaryVoucher`, `Staff` salary revisions, and `Staff/Overtime`.  The current payroll notes were read from `SiGma.Helpers/Models/Staffs/StaffPayroll.md`; no payroll contract-freeze file was present in the canonical documents search.  The salary-voucher UI evidence is the supplied screenshot `reviews/evidence/Vouchers/SalaryVouchers/581.png` (classification: reference evidence, not a contract).  The screenshot shows a report with date range, voucher number, date, type, amount, count and sum.

| Area | Source status | Contract result |
|---|---|---|
| Salary voucher | Generic CRUD header only | Does not implement payroll generation or employee salary lines |
| Staff salary revision | Custom revision API exists | Server stores effective dated component rows and returns a revision response |
| Staff overtime editor | Custom GET/POST exists | Client submits minutes; server resolves rate/amount and persists rows |
| Net payroll | No calculation/service found | Gap; salary voucher total is client writable |

## Backend inventory and findings

`SalaryVoucher` contains only `SalaryVoucherNo`, `VoucherType`, `Date`, and `TotalAmount` (`SiGma.Helpers/Models/SalaryVoucher.cs:3-9`).  Add and update VMs accept all four values, including the total (`SiGma.ViewModels/ViewModels/SalaryVoucher/SalaryVoucherAddVM.cs:7-13`, `SalaryVoucherUpdateVM.cs:7-13`).  There is no period, staff, salary line, attendance, leave, deduction, source revision, posting state, or calculation request.  `SalaryVoucherService` is an unmodified generic service and `SalaryVoucherController` is an unmodified generic controller (`SiGma.Business/Services/SalaryVoucherService.cs:5-12`, `SiGma.ServerAPI/Controller/SalaryVoucherController.cs:5-13`).  Therefore the screenshot's report columns are supported as a header list, but there is no API path that can produce a payroll result behind the report.

**Confirmed defect HRM-PAY-01 (high):** salary voucher write APIs accept `TotalAmount` and voucher number from the caller, with no server calculation or period/line provenance.  Repair recommendation: define the payroll period and line/source contract first, then make calculated totals and numbering server-owned in a dedicated payroll-generation/posting operation.  Do not infer settlement or accounting semantics from the screenshot.

`SalaryVoucherProfiler` uses `ReverseMap()` for all four maps (`SiGma.Business/MapperConfig/SalaryVoucherProfiler.cs:10-13`).  This permits the read model to become a write shape and conflicts with the canonical one-way map rule.  The Add/Update VMs also lack an enum validation attribute for `VoucherType`.

**Confirmed defect HRM-PAY-02 (medium):** replace the salary-voucher reverse maps with explicit one-way read/write maps and validate the enum at the write boundary.  The repair must preserve the repository's chosen numbering and voucher-type semantics pending owner decision.

The legacy `Overtime` entity stores `NormalOTHours`, `HolidayOTHours`, `TotalOTHours`, nullable `OvertimeRate`, nullable `OvertimeAmount`, and `Month` (`SiGma.Helpers/Models/Staffs/Overtime.cs:3-15`).  Its Add/Update VMs expose hours and month but omit rate and amount; its list/detail models expose rate and amount.  `OvertimeService` remains generic CRUD (`SiGma.Business/Services/OvertimeService.cs:5-12`), while `OvertimeController` overrides GET to return navigation data (`SiGma.ServerAPI/Controller/OvertimeController.cs:8-18`).  This legacy route is separate from the reviewed payroll editor and has no demonstrated server pricing rule.

The current owning path is `StaffController` `GET/POST Overtime` (`SiGma.ServerAPI/Controller/StaffController.cs:111-140`) and `GET/PUT {staffId}/SalaryPackage` (`:142-162`).  `StaffService` validates the revision, soft-deletes same-date packages, inserts the six component rows, and wraps writes with `ExecuteUniqueWriteAsync` (`StaffService.cs:136-217`).  The overtime save path likewise validates month/staff/day/minutes, resolves effective normal/holiday rates from salary packages, calculates rounded amount, saves and rereads within the guarded operation (`StaffService.cs:1851-2012`, `2043-2093`).  This is the strongest producer/consumer match in the payroll area: the Angular editor submits only day/minute rows and displays server-returned rates and amounts.

`StaffAddVM` includes an optional `SalaryPackage` revision (`StaffAddVM.cs:79-83`), and `StaffService` consumes it during add (`StaffService.cs:68-96`).  `StaffUpdateVM` has no salary-package field, so revision changes correctly use the dedicated PUT endpoint.  The current `StaffPayroll.md` note that add/update do not expose a salary revision is stale for Add; it remains accurate that there is no general net-pay calculation or salary-voucher line model.

## Frontend producer/consumer consistency

The SalaryVoucher Angular service is a plain `BaseService('SalaryVoucher')`; the list calls generic GET and displays `no`, `salaryVoucherNo`, `date`, `voucherType`, and `totalAmount` (`modules/Vouchers/SalaryVouchers/SalaryVoucher/services/salaryvoucher.service.ts`, `components/list/list.component.ts`).  Its create model sends `voucherType`, optional number, date, and total only (`models/create.ts`).  This exactly mirrors the header-only backend and the screenshot's report surface, while also confirming the unsafe client-owned total.

The StaffOverTime service calls `GET/POST Staff/Overtime` with month/staff and `{ month, staffId, rows: [{ day, overtimeMinutes }] }` (`modules/Staff/StaffOverTime/services/staffovertime.service.ts`, `models/list.ts`).  The component edits minutes only, displays server rate/amount, and refreshes after save.  This matches the backend's server-owned pricing and guarded write behavior.  UI validation rejects negative/non-integral minutes; backend validation remains authoritative.

## Gaps and risks for owner decision

- No source-backed payroll calculation combines salary packages, attendance/timesheets, overtime, leave, deductions, eligibility, or a payroll period into net/gross pay.  `SalaryVoucher.TotalAmount` is therefore a free header amount, not an auditable payroll result.
- No salary-voucher detail/line endpoint links employees or component amounts to a voucher.  The screenshot's count and sum are report presentation only.
- The legacy generic `Overtime` surface remains available beside the stronger Staff overtime path.  Its stored rate/amount fields and generic navigation GET should not be treated as the payroll editor's authority until ownership and migration semantics are decided.
- HrmSetting contains payroll-process flags in the current source notes, but this audit found no payroll generation consumer; this is recorded as an unconnected setting, not a proposed behavior.
- No new settlement, live-tracking, journal-posting, or screenshot-derived behavior is inferred.

## Recommended repair order

1. Owner freezes payroll period, line, calculation, approval/posting, and numbering semantics.
2. Define a dedicated read/calculation contract and server-owned totals; keep SalaryVoucher as a persisted result/header only if that is the intended model.
3. Remove SalaryVoucher reverse maps and add write-boundary enum validation.
4. Decide whether legacy `Overtime` CRUD is retired, constrained, or explicitly made a separate administrative import path.
5. Update the stale payroll notes and frontend models only after the owner-approved contract exists.
