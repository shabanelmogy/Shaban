<!-- Part of UI block 17: see ../17-dates.md. Same status and authority as the block. -->

**Month transport.** A reviewed month picker uses `Date | string | null`,
`view="month"`, `dateFormat="mm/yy"`, the shared structured mask and
`placeholder="mm/yyyy"`. Normalize with `parseMonthValue` from
`shared/utils/date-utils.ts`: a valid local picker Date, complete `MM/YYYY`, or
complete API `yyyy-MM` becomes `yyyy-MM`. Empty, partial, malformed and out-of-range
values return null; month is 1–12 and year is 1–9999. Never coerce a short year or
copy a month parser into a feature. Use `currentMonthRange()[0]` for a current-month
picker default. Staff Overtime, Duty Schedule and Timesheet are source-inspected
consumers; their payroll and sparse-write contracts remain feature-owned.
The inverse for a month picker value is `toMonthPickerDate(yyyy-MM)` (first local
calendar day, via `localCalendarDate`); use it for server-supplied default months
instead of a feature `parseMonthKey`. Example: Trips With Overtime.

**Shared month validation (2026-10-06, Master5 extraction gate).** Reviewed month
controls use `monthValueValidator` from `date-utils.ts`, with `Validators.required`
only when mandatory. It delegates to `parseMonthValue`, accepts an empty optional
control and returns the existing `date` validation error for invalid or partial
months and non-date/non-string values. Depreciation adopts it. Accounts report
family and Staff Timesheet retain two source-inspected local validator copies
until their own review (UI30/39); this addition does not authorize a bulk change.
The shared picker mask, current-month default, business bounds and transport
remain separate owners. Source-only; owner input/runtime acceptance pending.
