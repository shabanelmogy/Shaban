# Payroll Final Settlement and Pay Slips — frozen implementation contract

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Scope: add the two screenshot-backed Payroll screens requested by the owner; preserve monthly/LeaveSalary behavior, tenant isolation, existing immutable revisions and approval. No disbursement, journal, staff-status change, migrations, builds, tests or runtime work. Prior permission for experimental-data changes does not justify unrelated schema changes. Recipe drift check passed all eight packets before use.

Owner continuation: “حاول كمل البيزنس الناقص وفى الاخر نراجعه كله تانى” explicitly requests completion of missing business with a full review at the end. This confirms proceeding with the disclosed source-supported arithmetic and minimal employer-policy inputs below, not stopping at page shells or inventing a jurisdiction's statutory policy. The root will reconcile every completed behavior at final handoff.

## Evidence and reviewer decisions

| Evidence | Classification | Required behavior | Representation |
|---|---|---|---|
| FinalSettlementProcess.PNG, English desktop, other metadata unknown | Explicit | Staff, designation, last working day, Process | Routed shared editor with staff lookup, read-only staff designation and validated last working calendar day |
| Same screenshot | Explicit | Normal Salary: Basic/Allowances/Gross/Overtime/Sales Commission/Deductions/Net; date range | Server calculates selected employee's salary from month start or joining to inclusive exit day, with an explicit CalendarDays or Fixed30 divisor choice |
| Same screenshot | Explicit | Leave Salary: Joining/Last Rejoining, remaining days, amount | Confirmed joining/rejoining date input, reviewed remaining days and explicit Basic/Gross basis; server daily-rate product |
| Same screenshot | Explicit | Air Ticket: quota, period years, joining, price, eligibility%, payable | Explicit employer-reviewed quota/period/price/eligibility inputs; payable=quota*price*eligibility/100; quota period is recorded context, not a fabricated accrual rule |
| Same screenshot | Explicit | Gratuity: first/last working days, tenure, amount | Source joining and exit days yield tenure; reviewed earned gratuity days and explicit Basic/Gross basis yield backend amount. No assumed statutory years/rates |
| Same screenshot | Explicit | Summary normal/leave/ticket/gratuity/total | Shared SummaryCards with authoritative server values |
| PaySlip.png, English desktop, other metadata unknown | Explicit | Date range, Pay Slip No, Type, Staff; Search/Report/Excel | Paged snapshot-backed list; Report and Excel load all matching pages atomically; shared report preview/print |
| Same screenshot | Explicit | Actions/No/Name/Code/Date/Type/Total Amount | Read-only view/print action; deterministic slip number and employee identity/amount from saved current payroll revision lines |
| Frozen existing payroll source and user's earlier instruction | Strong inference, accepted | Same save/revision/history/approval cycle for settlement | Extend PayrollRun type to FinalSettlement; retain existing guarded save/approval/history/log engine, paid lock and no-op/stale handling |
| Source SalaryVoucher header has no staff or employee lines | Confirmed | Reuse correct owner | Pay slips are reads over PayrollRun/PayrollRunRevision/PayrollLine, not a duplicate writable legacy SalaryVoucher |
| Source Leave counters have no reliable dated ledger; Eligibility has no monetary entitlement; no ticket/gratuity policy owner | Confirmed gap, minimal new inputs accepted by Master2 rule6 | Avoid unsupported automatic entitlements | All policy quantities/bases are explicit required reviewed inputs with no silent default-zero outcomes; user can deliberately enter zero. Inputs and calculated breakdown are stored in the immutable settlement revision |

The reviewer-selected arithmetic is a configurable first-review employer calculation, not legal advice or an asserted statutory entitlement. No country-dependent policy is introduced. Normal salary uses backend currency precision and inclusive covered days; Fixed30 caps paid salary days at30 and CalendarDays uses that month's actual length. Monthly package earnings/deductions prorate, dated overtime/installment deductions retain authoritative recorded amounts. A mid-period salary revision or absence remains an issue until separately agreed. Dedicated settlement payouts must not double-count package LeaveEncashment/EndOfServiceBenefits; record an actionable blocking issue when those components exist. No automatic quota accrual, leave-balance consumption, payment, accounting, or Staff.IsInactive mutation.

## API contract

Existing PayrollCalculateVm/PayrollSaveVm gain optional `finalSettlement: FinalSettlementInputsVm`; required only for type FinalSettlement, rejected for other types. Fields:

- `lastWorkingDay: yyyy-MM-dd` matches request period; saved root date immutable.
- `joiningOrRejoiningDate: yyyy-MM-dd` valid, between actual source joining and last working day.
- `salaryProrationBasis: 'CalendarDays' | 'Fixed30'`.
- `leaveDaysRemaining: decimal >=0`, `leaveSalaryBasis: 'Basic' | 'Gross'`.
- `ticketQuota: decimal >=0`, `ticketQuotaPeriodYears: decimal >0`, `ticketPrice: decimal >=0`, `ticketEligibilityPercent: decimal 0..100`.
- `gratuityDays: decimal >=0`, `gratuitySalaryBasis: 'Basic' | 'Gross'`.

Numeric upper bounds are transport/storage protection, not entitlement; reject null/missing/invalid values. Input DTO properties nullable with validation so omission cannot become a fabricated zero. Backend snapshot/hash includes all inputs, source salary/identity/settings and blockers. PayrollRun adds nullable LastWorkingDay; revision adds nullable SettlementSnapshot JSON storing typed inputs and authoritative breakdown; only FinalSettlement populates them. No schema artifact is generated in this task.

Implementation refinement frozen by root after DTO review: quantity/day/quota/period upper bound1,000,000; quota-period minimum0.000001; editable ticketPrice maximum1,000,000,000 to retain useful frontend cent precision; eligibility0..100. Computed monetary values additionally respect decimal(18,2) storage with localized rejection on overflow/out-of-storage. These are numeric transport guards and are not employment entitlement limits.

PayrollRunVm gains `finalSettlement: FinalSettlementSnapshotVm | null`. Snapshot fields: `inputs` above, `designation: string | null`, `firstWorkingDay`, `normalSalaryFrom`, `lastWorkingDay` calendar dates, `serviceDays: int`, `salaryDays: int`, `salaryDivisor: int`, `basic/allowances/gross/overtime/salesCommission/additional/deductions/normalSalary/leaveSalary/ticketPayable/gratuity/totalPayable: decimal`. Additional retains other earning components; SalesCommission is separately disclosed (Commission+SalesIncentive), counted exactly once. Payroll line NetPay and run TotalNet include all four settlement portions. The snapshot normalSalary is the normal component only.

Root reproducibility refinement: snapshot also returns `monthlyBasic/monthlyGross/leaveDailyRate/gratuityDailyRate`. The monthly source amounts remain separate from prorated normal salary. Leave/gratuity daily rates are currency-rounded selected monthly Basic/Gross divided by the chosen salary divisor; each payout is currency-rounded earnedDays*storedDailyRate. The screen discloses daily rates beside these payouts. This makes displayed-rate arithmetic reproducible without a hidden higher-precision rate.

Monetary reconciliation refinement: prorated normal Gross equals currency-rounded Basic+Allowances. Snapshot Additional is the normal non-commission addition only; stored PayrollLine Additional includes that addition, SalesCommission, LeaveSalary, TicketPayable and Gratuity exactly once. Consequently the unchanged shared salary-line invariant NetPay=Gross+Overtime+Additional−Deductions still matches the final total and PaySlip disclosure. Snapshot NormalSalary and its separated payout amounts never add a subtotal twice.

- `GET /PayrollRuns/settlement-staff`: `Results<FinalSettlementStaffOptionVm>`; id/no/value/designation/dateOfJoining; available live staff, continuing or inactive, ordered no/id. Business rechecks this exact staff availability and ownership on calculate/save.
- Existing calculate/save/get/revisions/logs/approve accept/return the new type with identical lifecycle. A final root keeps immutable staff/month/lastWorkingDay identity. Changed policy inputs create a new revision and clear current approval. Paid amounts stay locked. Any opposing current Payroll/LeaveSalary/FinalSettlement line for the same employee/month blocks another salary save in both directions.

Root business-completion amendment: one live FinalSettlement root per employee across periods. A different-month attempt must return an actionable existing-settlement conflict, rather than paying leave/ticket/gratuity twice. Source validation inside the existing guarded write and an additional unique filtered `(SubscriptionId, Type, StaffId)` index for Type='FinalSettlement'/StaffId nonnull enforce this. Corrections continue through the existing settlement's revisions; moving its immutable termination date or cancelling/reopening requires a later explicit lifecycle decision. No current staff-state mutation or new access restriction is implied.
- `GET /PaySlips`: `ListSmBase`; Filters `dateFrom/dateTo/no/type/staffId/sortField/sortOrder`; type optional Payroll/LeaveSalary/FinalSettlement. Rows use current saved revision only, including pending approval; display actual approval/payment state without equating slip with payment. Count/page stable, tenant/live checks on root/revision/line.
- `GET /PaySlips/{id:int}`: id is PayrollLine.Id; immutable historical saved line remains viewable even after superseded or staff renamed/inactive/deleted. Detail reports status of its actual revision, current/superseded separately.
- `GET /PaySlips/staff`: snapshot-based staff options from all saved live payroll lines (including staff no longer currently selectable); required filtering read. No current staff lookup can hide historical documents.

PaySlipListVm fields exactly: `id/runId/revisionNumber/staffId/no/name/code/date/type/totalAmount/isApproved/isPaid/isCurrentRevision`. no=`runId-revisionNumber-staffId` stable and filterable, independent of mutable staff or root naming. date=FinalSettlement last day or monthly PeriodEnd. PaySlipDetailVm contains same identity/status plus `period/overtimePeriod/policyVersion/decimalPlaces/basic/allowances/gross/overtime/additional/deductions/netPay/finalSettlement`. It never returns unrelated employees' lines. No payslip entity or write endpoint.

## Shapes and source conformance gate

Root reconciliation clarification (2026-10-10): monthly slip dates use `PeriodEnd.AddDays(-1)` because root PeriodEnd is exclusive. No filtering means no No filter; when supplied, No is the complete stable `runId-revisionNumber-staffId` identifier. A paid FinalSettlement idempotent replay also requires policy inputs identical to the saved snapshot; reusing a prior token with changed policy inputs remains locked. These preserve the original exact-replay and calendar-date intent without introducing a write/payment policy.

| Concern | Owning block | Approved reference / shared owner | Target |
|---|---|---|---|
| List shell/filter/paging | UI1/4/6, BE9 | Workshop/Job/components/list; FilterPanel/DataTable/resolveListPaging/toListParams | PaySlips paged list with applied filters, cancellation and real counts |
| Routed calculation/editor | UI1/13/14/24 | Workshop/Job/components/editor; FormSection/EditorTabs/FeatureTitle/SummaryCards | FinalSettlement distinct policy context over existing immutable aggregate; one scroll owner, no feature CSS |
| Domain persistence | BE14/18; stateful aggregate exception recorded | PurchaseOrderService tracked graph mechanics; existing PayrollRunService frozen immutable lifecycle | Extend correct owner, no generic client-total CRUD or new journal workflow |
| Reads/lookup | BE10/17/18 | typed scoped repository projections, FilterHelper | Minimal typed producer/consumer fields, snapshot identity and tenant checks |
| Read-only report/print | UI20/21 | Customers/StatementOfAccount/components/list; ReportPrintService/EditorDialog print isolation/DataTable | One-slip and complete matching report, Excel all pages or fail |
| Failure/controls | UI2/16/17/19/22/28 | apiErrorMessage/composedReadErrorMessage, DatePicker, FieldError, freezeFormState, takeUntilDestroyed | Both failure channels, local Retry, no silent empty success, stable control locks |
| Navigation/guide | UI1/3/23/26; Master7 | existing sidebar payroll and UserGuide HRM reader | /FinalSettlementProcess, /PaySlips, translated menu, single titles, bilingual guide |

Frontend ownership: new FinalSettlementProcess and PaySlips folders; payroll models/list integration. Backend ownership: PayrollRun sources/DTOs/configs/controller/interface plus new read-only PaySlips service/DTO/controller. Root owns shared route/menu/toolbar/vocab/compiler entrypoints, guide, docs and final reconciliation. Root reads scoped diffs against a new baseline because existing payroll source is untracked. Controlled workers may proceed only against this frozen contract; source-only final verification, owner migration/build/runtime pending.
