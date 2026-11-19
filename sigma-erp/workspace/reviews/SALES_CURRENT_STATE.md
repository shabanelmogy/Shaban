# Sales — current state

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Last recorded round | 2026-10-27 |
| Full review | [SALES_FEATURE_REVIEW.md](SALES_FEATURE_REVIEW.md) (134 KB, newest at the top) |

Read this first, then open only the needed section of the full review by heading.

## Summary

- Current financial completion is in the [financial completion review](SALES_EQUIPMENT_FINANCIAL_COMPLETION_FEATURE_REVIEW.md) and its [contract](SALES_EQUIPMENT_FINANCIAL_COMPLETION_CONTRACT_FREEZE.md): used-fleet carrying value, staged tax reconciliation and actual approved collection. Older financial deferrals are superseded.
- Cycle reformulation (2026-10-27): cost guard in agreement invoicing, server-owned full/partial delivery capabilities, and the delivery dialog consuming them. Deploy the backend before the frontend because missing fields fail closed.
- Owner-approved scenario: end-of-use sale of the used fleet.
- Sales menu (2026-10-26): inline filter actions in quotations and agreements; Fleet filter alignment.

## Contracts and plans in force

- [Redesign plan](SALES_EQUIPMENT_RENTAL_REDESIGN_MAINTENANCE_EVOLUTION_PLAN.md).
- [Current review contract](SALES_CURRENT_REVIEW_CONTRACT_FREEZE.md) and [cycle contract](SALES_CYCLE_CONTRACT_FREEZE.md).
- [Fleet contract](SALES_FLEET_CURRENT_REVIEW_CONTRACT_FREEZE.md).

## Pending and open decisions

- Cross-invoice VAT rounding policy is not approved; a 0.01 difference can remain.
- No unit-to-asset identity, depreciation or disposal exists; the return → valuation → held-for-sale → sale flow is proposed in the plan.
- Schema, build and runtime with the owner.

## Useful sections in the full review

- Complete cycle reformulation — researched scope and implemented slice, 2026-10-27
- Current Sales menu review and implementation — 2026-10-26
- Sales cycle comparison with Odoo and SAP — 2026-10-08
