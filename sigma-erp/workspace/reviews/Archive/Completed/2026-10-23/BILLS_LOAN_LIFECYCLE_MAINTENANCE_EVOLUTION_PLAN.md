# Bills — loan rescheduling and early settlement

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-21 |

## Authority and outcome

Owner asks to implement the best proposed loan lifecycle and emphasizes that reference data may be wrong; validation and logical amounts take priority. Prior conversation approves source-owned full installment payment accounting. Latest instruction authorizes separate Reschedule and Early Settlement, immutable paid history, preview before commit and saved previous schedules. Reference screenshots prove a loan balance/settlement interaction, not authoritative calculations or a true reschedule implementation. Do not copy negative example rows or infer asset attribution.

Applicable authority: Sigma AGENTS, screen-refactor skill, Master4/5/7, BE15 source-owned payment rule, UI screen08 with nested screen09 action forms, UI5/7/13/19/22/28. Initial all-eight packet drift check passed. Actual approved action-dialog reference Workshop/Job/close-job and shared EditorDialog/DataTable/FieldError sources inspected. Existing Bill loan/payment source is the integration owner, not a new generic Payments workflow.

## Existing state, impact and evolution

| Area/source | Existing behavior | Choice and reason |
|---|---|---|
| LoanPaymentPlan/LoanEMI | Original saved schedule, Paid/Unpaid only; domain floor rounding with final remainder | Extend with explicit archival ownership and domain replacement; never edit Paid or erase old rows |
| BillService.Installments / LoanPaymentPlanProfiler | Tenant-owned historical plan read, saved consistency summary | Extend active schedule and revision history read; keep unknown history readable without fabricated payments |
| BillService.InstallmentPayments | Next eligible row, immutable PV/link, principal-only allocation, original liability/bank/interest snapshots, tenant locks/idempotency | Reuse for settlement's one replacement installment, atomic with revision; no second cash engine |
| Installments viewer | Narrow terms/wide schedule, direct next Pay, parent refresh | Extend with separate Reschedule and Early Settlement actions, preview and history; preserve direct Pay |
| Original Bill/JV | Approval posts original liability; conditional correction excludes payment/dependency history | Keep original values/posting; revision cannot alter principal or reopen paid accounting |
| Generic plan/EMI/Payment writers | Source ownership guards | Extend revision protection, prevent archive/header bypass |
| Migration/runtime | Owner-run only | New revision/archival schema requires owner migration, no migration/snapshot commands by agent |

## Decisions and alternatives

| Topic | Decision/evidence |
|---|---|
| In-place overwrite vs retained revision | Retained append-only revision; paid rows/PVs immutable and replaced unpaid rows archived, because original evidence must remain reviewable |
| Reschedule financial effect | Redistribute only remaining principal and existing remaining interest; no rate/amendment/capitalization/fees/writeoff in this slice. Preview then explicit commit, no cash posting |
| Settlement financial effect | Full remaining principal plus explicit agreed interest between zero and remaining scheduled interest, no new fees or principal discount. Reuse approved original-liability/InterestExpense/recovery-bank payment rule |
| Capacity mismatch | Fail closed if remaining schedule principal differs from actual effective Bill payable capacity; never use min or silently discard down-payment/external allocation discrepancies |
| Stale/duplicate | Versioned preview, authoritative locked revalidation; unique request per revision, durable settlement PV link and idempotent same-request replay |
| Status | Loan status derived separately from Bill payment Open/Closed; settled only from valid paid source history and reconciled zero remaining principal/interest |
| Asset-wise splitting | Not introduced without existing saved allocation per asset; no invented vehicle principal |
| Legacy history | Unknown/malformed/overpaid/negative/inconsistent source rejects fresh actions; preserve historical read and explain availability |

Precise DTO/routes, persistence and ownership are frozen in the companion contract before implementation. Financial choices above are conservative applications of the owner's accepted concept; external similar-product documentation was consulted in the preceding explanation, not used as authority for Sigma postings.

## Validation and verification plan

Server owns totals, money precision/storage bounds and floor/final-remainder arithmetic. Require positive remaining principal, nonnegative interest, exact principal conservation and gross=principal+interest, valid bounded integer installment count, increasing full dates, no backdating before original/payment/revision boundaries, authenticated same-tenant source, explicit Approved/nonvoided original Bill/JV, unambiguous real paid links and actual payable capacity. Protect all transitions under existing allocation-then-PurchaseRequest locks. No mutation by Preview; no partial revision/payment/status on failure.

Owner acceptance must cover no-paid/some-paid/full-paid, early payment dates, smallest precision/count boundaries, interest zero/max/out-of-range, mismatched due, legacy history, stale preview, duplicate same/different request, concurrent Pay/allocation/Void/revision, period/role-account failure rollback and history/EN/AR/RTL/theme/narrow UI. Source-only checks and scoped diffs are agent deliverables; no build/test/lint/browser/runtime/DB/migration/snapshot/commit/push/deploy execution.
