| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Payroll disbursement and accounting — 2026-10-12

Owner instructions: fix payroll calculation and disbursement now; choose the suitable payout scope; payout must create payment vouchers and accounting entries now. This supersedes historical journal deferral only for this slice. Canonical ownership: Backend blocks 8, 10, 15; UI stateful workspace/action dialogs; Master blocks 4–7. References: PayrollRunService state/version/tenant lock; InvoiceService transaction; JournalVoucherResolver generated posted vouchers, period, precision, accounts; CodeCreateService Payment numbering; HrmAccountLinkCatalog exact editable slots.

## State and API

Dedicated PayrollDisbursement API/service extends PayrollRun; generic SalaryVoucher is not an authoritative payroll writer. GET by run returns the CURRENT saved revision, approval state, each immutable line identity, net/paid/outstanding, accounting and payment voucher identifiers, current payment version, and immutable history. POST pay receives run, expected revision/payment version, request GUID, date, branch, payment method, optional reference/note, and distinct employee line IDs with positive amounts. Server recomputes outstanding and rejects excessive, malformed, cross-tenant, stale, unapproved or unsupported amounts. One Payment per employee allocation; one atomic batch. Partial payments supported. Exact request replay returns existing results; changed replay is a conflict.

First payout posts one accrual SalaryJV for the whole approved revision, followed by each Payment JV. Existing approval remains metadata-only; historical snapshots without accounting components must be recalculated and saved before payout. Once accrual or any payment exists, save/approval changes cannot replace that revision even after void. IsPaid means every line fully settled; it does not serve as the partial-payment lock. Serializable transaction begins before the same PayrollRun unique-write lock and contains all saves/counters/vouchers/history/state. Outstanding/version derive persisted allocations and voided-payment state, not client totals.

GET/POST/void must remain within authenticated tenant-scoped repositories. No new permission API. Current settings are snapshotted for department grouping/contact description choices; unsupported calculation settings remain explicit blockers.

## Accounting

SourceSnapshot stores final rounded AccountingComponents {Item,Role,Debit,Credit} plus AccountingUnsupportedComponents. Components sum debit minus credit to exact line NetPay; no Gross duplicate. Positive one-sided component amounts only. Salary accrual debits earning expense, credits deduction recovery/expense reduction and staff payable for net. Payment debits the employee's payable account and credits the active cash/bank payment-method account. Resolve active leaf accounts, cost centers, fiscal period and base-currency precision through existing owners before writes. No provision release without a source-matched prior accrual.

Exact supported package mapping: BasicSalary→Basic Expense; HousingAllowance→HouseAllowance Expense; TransportAllowance→TransportationAllowance Expense; LeaveEncashment→LeaveEncashment Expense; EndOfServiceBenefits→Gratuity Expense; LoanRepayment→LoanDeduction Staff; AdvanceSalary→AdvanceDeduction Staff; Absence→AbsentDeduction Expense; OtherDeduction→ExtraDeduction Expense. Other nonzero package components are explicitly unsupported until an exact accounting slot is supplied; medical/vacation/fine mappings are not inferred. Operational Loan/Advance deductions use their corresponding Staff slots. Normal/holiday OT use exact corresponding Expense slots, rounded proportional allocation of authoritative stored OT amount. Final-settlement leave salary, ticket and gratuity use corresponding Expense slots. No blanket net-salary expense or guessed statutory account.

## Correction and mutation protection

Dedicated void of a single payment requires expected version, GUID, reason and an open source period. It follows the existing source-owned void policy: the generated payment JV is marked void in place with `VoidedDate`, `VoidedBy` and `VoidReason`; no opposite or reversing JV is created. The original Payment/JV/allocation and void audit relation remain retained. Outstanding reopens by the voided payment amount; accrual remains and revision stays locked. No partial void, silent delete or generic CRUD mutation. Generic Payment update, bulk update, remove and activation must refuse every payroll-linked payment under the same PayrollRun write serialization, irrespective of journal allocations.

## Persistence and handoff

Add PayrollPayment and its immutable void-audit relation, revision accrual-JV link, FK restrictions, unique payment/request identities, tenant-scoped lookup and registration. No migration/snapshot files are created or changed. Owner must generate/apply a migration after source review; deployment before that is blocked. Frontend consumes one typed dedicated payout dialog/history within existing payroll workspace; amounts default to current outstanding, void reason is required, validation/error/loading and bilingual guide included. Financial values remain server-owned. No builds/tests/database/browser runs are authorized. Source-only checks and separate complete repository diffs required.
