# Current reviews and contracts

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | no |
| Compacted | 2026-11-19 |

A short routing index. Do not read history for every task; read only the
requested feature's files. One feature's record does not define a general rule
for other screens, and a frozen contract proves a decision, not its completion.

## Finding a feature's files

Search by name instead of reading this index. File names are upper snake case,
with the artifact type after the feature name:

```text
reviews/**/<FEATURE>_*.md
```

| Artifact | Name ending |
|---|---|
| Current state (read first) | `_CURRENT_STATE.md` |
| Review and reconciliation | `_FEATURE_REVIEW.md` or `_FULL_STACK_REVIEW.md` |
| Frozen contract | `_CONTRACT_FREEZE.md` |
| Plan | `_MAINTENANCE_EVOLUTION_PLAN.md` |
| Separate reconciliation | `_FINAL_RECONCILIATION.md` or `_RECONCILIATION.md` |

When a current-state file exists, read it first, then open only the needed
section of the full review by searching for its heading.

Multi-part features live in subfolders:

```text
Accounts/ Authorization/ Customers/ Fleet/ Lease/ Rental/ Workshop/ Transportation/
```

- Pending decisions: [Deferred](Deferred/README.md); a listed item grants no implementation authority.
- Finished evidence: [Archive](Archive/README.md).
- Full narrative index up to 2026-11-19: [INDEX_HISTORY.md](INDEX_HISTORY.md), history only.
- Documentation entry: [README](<F:/My Work/Shaban Documents/Shaban/sigma-erp/README.md>).

## Recent work

Newest first. Details and exact status live in the linked file.

| Work | Main file |
|---|---|
| Rental Vehicles on Service Replacements | [Implementation and verification](RENTAL_SERVICE_REPLACEMENT_REPORT_FEATURE_REVIEW.md) |
| Idle Vehicle Report by branch | [Implementation and verification](IDLE_VEHICLE_REPORT_FEATURE_REVIEW.md) |
| Vehicle Ageing Report by category | [Implementation and verification](VEHICLE_AGEING_REPORT_FEATURE_REVIEW.md) |
| Documentation audit fixes and completed version-control cutover | [Current state and handoff](SIGMA_DOCUMENTATION_SYSTEM_CURRENT_STATE.md) |
| Trips With Overtime Report (with Driver↔Staff link & shift-based overtime) | [Review & implementation](TRIPS_WITH_OVERTIME_REPORT_FEATURE_REVIEW.md) |
| Instruction slimming and token reduction | [Current state](SIGMA_DOCUMENTATION_SYSTEM_CURRENT_STATE.md) |
| Surcharge Variance Report deferred (inactive / `Soon`) | [Deferred](Deferred/SURCHARGE_VARIANCE_REPORT_DEFERRED_REVIEW.md) |
| Fines & Tolls reports deferred (inactive / `Soon`) | [Deferred](Deferred/TOLLS_REPORT_DEFERRED_REVIEW.md) |
| Detailed Vehicle Utilization Report | [Review](DETAILED_VEHICLE_UTILIZATION_REPORT_FEATURE_REVIEW.md) |
| Agreements Report | [Review](AGREEMENTS_REPORT_FEATURE_REVIEW.md) |
| Vehicle Expense Type Report | [Review](VEHICLE_EXPENSE_TYPE_REPORT_FEATURE_REVIEW.md) |
| Vehicle Expense Report | [Review](VEHICLE_EXPENSE_REPORT_FEATURE_REVIEW.md) |
| Tax Return view | [Review](TAX_RETURN_REPORT_FEATURE_REVIEW.md) |
| Tax Return open points | [Deferred](Deferred/TAX_RETURN_CLASSIFICATION_AND_RECOVERY_REVIEW.md) |
| Tax Collection Report | [Review](TAX_COLLECTION_REPORT_FEATURE_REVIEW.md) |
| Salesperson Discount Report | [Review](SALESPERSON_DISCOUNT_REPORT_FEATURE_REVIEW.md) |
| Vehicles Purchase Report | [Review](VEHICLES_PURCHASE_REPORT_FEATURE_REVIEW.md) |
| Salesperson Invoices Report | [Review](SALESPERSON_INVOICES_FEATURE_REVIEW.md) |
| Sale Report based on invoice | [Review](SALE_REPORT_BASE_ON_INVOICE_FEATURE_REVIEW.md) |
| Sale Report | [Review](SALE_REPORT_FEATURE_REVIEW.md) |
| Daily Business Report | [Review](DAILY_BUSINESS_REPORT_FEATURE_REVIEW.md) |
| Customer Wise Collection Report | [Review](CUSTOMER_WISE_COLLECTION_REPORT_FEATURE_REVIEW.md) |
| Immediate sidebar close | [Review](SIDEBAR_OPEN_LIFETIME_FEATURE_REVIEW.md) |
| Collection & Refunds Report 2 | [Review](COLLECTION_REFUNDS_2_REPORT_FEATURE_REVIEW.md) |
| Collection & Refunds Report | [Review](COLLECTION_REFUNDS_REPORT_FEATURE_REVIEW.md) |
| Collection Report | [Review](COLLECTION_REPORT_FEATURE_REVIEW.md) |
| Vehicle profit/loss by chassis | [Review](VEHICLE_CHASSIS_PROFIT_LOSS_FEATURE_REVIEW.md) |
| Rental Sales for Sixt Bahrain report removed | [Review](RENTAL_SALES_FOR_SIXT_BAHRAIN_FEATURE_REVIEW.md) |
| Approval stage reversal | [Contract](ERP_APPROVAL_UNAPPROVE_CONTRACT_FREEZE.md) |
| Approval screen-by-screen tracker | [Tracker](ERP_APPROVAL_SCREEN_REVIEW_TRACKER.md) |

## Maintaining this index

- When work finishes, add one row at the top of Recent work: the work name and its main file link only, in English.
- Details, status and pending verification belong in the review file, not here.
- Keep at most thirty rows; drop the oldest — their files stay findable by name.
- `Check-BookReferences.ps1` enforces this file's size budget.
