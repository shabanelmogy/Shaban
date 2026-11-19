| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Salary vouchers domain/API handoff — 2026-10-25

Authority: AGENTS; Master1–7, BE3/4/7/8/9/13, UI1–10/13–17/19/22–29; all eight recipe drift checks passed before use. Plan: SALARY_VOUCHERS_MAINTENANCE_EVOLUTION_PLAN.md. Current HRM disbursement contract supersedes earlier journal-deferral history. Current source inspected: PayrollRunService, PayrollDisbursementService/controller/VMs, PayrollsComponent and SalaryVoucher CRUD.

## Frozen contracts

* Primary /SalaryVoucher consumes existing PayrollRuns/current revision list through PayrollsComponent. No client amount calculation or generic SalaryVoucher write creates payroll. Types Payroll/LeaveSalary/FinalSettlement follow existing HRM string contracts.
* Extend PayrollRunListVm/frontend list row with nullable No (display/filter by no) and HasAccounting (current revision AccountingJournalVoucherId != null, minimum action state). Edit requires !IsPaid && !HasAccounting; backend remains authoritative. Existing approve/version policy unchanged. Existing list columns plus No; No filter before count/page/export. Pay/history uses existing PayrollDisbursementComponent for selected run and existing dedicated API; no new payment endpoint or lifecycle. Payment availability is checked by server context, including partial/outstanding/void rules.
* Legacy grid columns SalaryVoucherNo, Date, VoucherType, TotalAmount; Id:int identity only. Drop plumbing from standalone SalaryVoucherListVM (no base required). Detail Id:int plus the same four fields via LeanDetailBaseVm. No inherited No/tenant/audit in legacy responses. Optional SalaryVoucherNo:string? max100; VoucherType numeric enum 0/1/2 with EnumDataType; Date required real nondefault date; TotalAmount editable manual reference amount, decimal nonnegative (no new formula). Add contains four fields; Update adds Id only. Do not make number unique without business evidence. No entity/EF/schema edits.
* Legacy filters salaryVoucherNo (contains), dateFrom/dateTo inclusive calendar days, voucherType numeric; optional grid through existing scalar projection; paging/sort through ListSmBase generic engine. Default month; clear range means all; applied snapshot retained for page/action/export. Invalid nonempty dates/range/type fail, not ignored. Service overrides only justified filter hook, optional read projection, reference-aware RemoveAsync. Preserve tenant/live generic owners. Remove redundant ReverseMap; remove unused FullList/Delete VM only after scoped consumer search.
* Legacy list actions View/Edit/Delete; Create plus all-matching Excel, shared delete/discard confirmation, failure Retry, typed forms/model/service, cancellation/finalize. Retain routed shared editor because voucher total and existing addressable document routes (UI13), explicit create/view/edit route mode, old details/:id view compatibility. Back returns /SalaryVoucher/legacy with applied state; link primary HRM route. No activate/deactivate, approve/reject/unapprove/pay/void/print on legacy rows: no domain lifecycle or journal/document-print contract. Reference Job actions classified in final review, not blindly copied.

## Pre-edit conformance

| Concern | Book | Reference / shared owner | Target |
|---|---|---|---|
| List/filter/grid | UI1/3–8 | Workshop/Job/components/list; FeatureTitle, FilterPanel, DataTable | Same fill shell; server paging and all-page export |
| Routed legacy editor | UI1/13/15 | Workshop/Job/components/editor; FormSection/PrimaryActionButton | One source for create/view/edit; fixed footer and internal scroll |
| Controls/errors/close | UI9/10/16/17/19/22/28 | ConfirmationDialogService, freezeFormState, date-utils, FieldError, StateMessage | Reuse public owners; no local widgets/styles |
| Generic backend | BE3/4/8/9/13 | BranchService/base Service; FilterHelper/GridFilter | Lean DTOs, one-way maps, minimal overrides |
| HRM integration | Master4,BE15/UI7 | Existing frozen PayrollRun/PayrollDisbursement services and components | Keep transaction, account, revision, idempotency and payout ownership |

No permissions invented. Operational reads stay direct; type options are static enums so lookup cache/watch adoption is N/A. No migration, financial formula change or shared extraction required: existing owners already cover target behavior.

## Implementation refinements — 2026-10-25

Required legacy enum/date/amount inputs use nullable write-VM properties plus Required, so omitted JSON cannot silently become Payroll/default date/zero. The local SalaryVoucherDateAttribute rejects default DateTime; date-only UI rejects 0001-01-01 and reuses date-utils otherwise. Amount reuses NonnegativeStoredDecimal (existing decimal(18,2) boundary) and frontend scale validation. These are request validation changes, not entity/schema changes.

Payout Retry retains entered headers and amounts by immutable payrollLineId. A retained amount above the refreshed outstanding stays visible and invalid for correction; it is never silently reduced. New line identities receive zero during retained-draft refresh. Unknown write outcomes and failed context refresh prevent writes until a successful read; exact repeated payloads keep request identity. Existing backend idempotency/transaction remains the authority. The saved Pay and VoidPayment operation values are included in the existing log renderer. The existing process screens also respect HasAccounting and refresh their snapshot after closing payout; no new approval vocabulary or posting policy is added.
