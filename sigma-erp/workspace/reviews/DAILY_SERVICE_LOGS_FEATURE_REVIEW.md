# Daily Service Logs — feature review notes

| | |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Date | 2026-10-01 |
| Origin | Moved verbatim from backend block 17 during the shared-first rewrite (`reviews/Archive/SIGMA_SHARED_FIRST_MAINTENANCE_EVOLUTION_PLAN.md`); feature derivations do not belong in a canonical block |
| Screen | `Fleet/DailyServiceLogs`, backend `DailyServiceLogReportService` |

## Recorded derivation baseline (before 2026-10-01)

Current Daily Service Logs baseline (`DailyServiceLogReportService`):

| Section | Backend derivation |
|---|---|
| Date boundary | The selected local calendar date uses a half-open interval `[date, date + 1 day)`. Month/year/PY comparisons end at the equivalent exclusive boundary |
| RAC / Outside | Named compatibility proxy: a Job without `CustomerId` is RAC/internal; a Job with `CustomerId` is Outside. This is inferred from current persisted relationships and must be replaced if the domain adds an explicit ownership classification |
| Vehicle service counts | Distinct `Job.VehicleId` values in each documented period, split by the RAC/Outside proxy |
| Invoicing | `Invoice.JobNo == Job.No`; sum invoice `TotalAmount` for the period and split by the owning Job proxy |
| Collection outstanding | Invoice total minus all authoritative journal-voucher allocations as of the selected day; never below zero. Age from `DueDate`, falling back to `InvoiceDate`, in disjoint 0–30, 31–90, 91–180, 181–270, 271–365, and >365 day buckets |
| Receipts | Approved, non-voided receipts linked through invoice journal-voucher allocations. Group only the amount allocated to service invoices by payment type; day and month sections use the same as-of boundary |
| Opening / closing | `ApprovalStatus.NotApproved` is the current open-job proxy; any other approval status is the current closed-job proxy because the aggregate has no separate close timestamp |
| Pending closing | Open Jobs grouped by age: 0, 1–2, 3–7, 8–90, and >90 days. The last two labels are “More than 7 Days” and “More than 3 Months” |
| Purchases | Approved `PurchaseOrderDetail.AmountPlusTax` rows linked to a Job; compare current-year-to-date with the equivalent previous-year period |
| Payment outstanding | Job-linked Bill total minus authoritative allocations, never below zero, grouped into 0–90, 91–270, and >270 day buckets |
| Detail rows | Jobs within the selected day, ordered by `DateAndTime` then `Id`. Invoice amount is preferred; receipt-only allocations supply Amount Collected; Amount Pending is the non-negative difference |

These are named source-backed proxies, not new stored facts. Changing one is a
business-contract change and requires updating the backend calculation, typed
response expectations, UI labels where applicable, and this baseline together.

## Drift found on 2026-10-01 (re-verify in the screen review)

- The *Opening / closing* row names `ApprovalStatus.NotApproved` as the open-job proxy. `Job.ApprovalStatus` was removed on 2026-09-28. The service now builds the opening section from *vehicle in* (jobs of the day) and *invoiced* (distinct `JobNo` invoiced that day). `Job.Status`/`ClosedAt` now exist and are the natural open/closed source.
- No *Pending closing* aging was found in the current service. Confirm whether the section was dropped or moved.
