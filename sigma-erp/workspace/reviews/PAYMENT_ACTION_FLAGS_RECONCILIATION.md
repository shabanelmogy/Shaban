| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-25 |

# Payment action flags — bounded reconciliation

## Scope

This reconciliation covers only the Payment list/detail public action flags.
It does not change posting, unposting, voiding, allocation, currency, cheque,
installment, down-payment or payroll financial effects.

## Reconciled contract

| Surface | Flag | Source-owned rule |
|---|---|---|
| List | `CanEdit` | Pending, not voided, not source-generated, and no invalid, shared or actively allocated retained journal. |
| Detail | `CanEdit` | Same guard used by the ordinary update path. |
| Detail | `CanDelete` | Editable and no persisted approval history. |
| Detail | `CanVoid` | Approved, not voided, not source-generated, valid owned/unshared/unallocated posted journal, and original period open. |

The view models now carry server-set values. The Payment profile no longer
derives flags from status alone. Detail reads populate all three flags after
evaluating the existing lifecycle helpers. List materialization projects the
requested rows, evaluates edit eligibility through one correlated SQL-shaped
batch over their IDs, and merges the resulting ID set without a per-row query.
The controller's retained navigation-list endpoint is routed through this same
canonical paged projection so it cannot bypass the server-owned flag calculation.

## Source-only checks

- Frontend and backend flag names remain unchanged.
- Existing source-generated rows remain read-only through ordinary Payment actions.
- The detail delete flag retains approval history by withholding Delete after any decision.
- No financial mutation method or journal effect was changed.
- Build, test, runtime, browser and database verification remain pending for the owner.
