# Limousine — current state

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Last recorded round | 2026-10-31 |
| Full reconciliation | [LIMOUSINE_FIXES_FINAL_RECONCILIATION.md](LIMOUSINE_FIXES_FINAL_RECONCILIATION.md) (130 KB) |

Read this first, then open only the needed section of the full reconciliation by heading.

## Summary

- Confirmed fixes implemented: tariff matrix (trip type × tariff group × rate type), mandatory assignment as an explicit event with a saved reason, booking branch independent of the vehicle, precision and cache corrections.
- The rate editor is back to the original tariff sections as collapsible sections (owner's choice after a layout diagnosis).
- Utilization report: first page of 120 rows, then batches on scroll; totals cover the whole period; print and Excel fetch a separate complete response.
- Trip list: termination tax loads only when the termination dialog opens (9 → 7 source reads).
- Trip booking: two horizontal tabs; general data split into six vertical tabs.
- Tariff report: one tab per section of the report response.
- Migration `20261031081301_PreserveTransportationTripDatesAndQuantityPrecision` was edited at the owner's request to drop and re-add the rate check constraint around the type change.

## Contracts and plans in force

- [Fixes plan](LIMOUSINE_FIXES_MAINTENANCE_EVOLUTION_PLAN.md) and [base review](LIMOUSINE_FULL_STACK_REVIEW.md).
- Contracts: [trips](LIMOUSINE_TRIPS_CONTRACT_FREEZE.md), [trip billing](LIMOUSINE_TRIP_BILLING_CONTRACT_FREEZE.md), [quotation](LIMOUSINE_QUOTATION_CONTRACT_FREEZE.md), [masters](LIMOUSINE_MASTERS_CONTRACT_FREEZE.md), [continuation](LIMOUSINE_CONTINUATION_CONTRACT_FREEZE.md).
- Detailed work files in `Limousine/`.

## Pending

- Full automatic time/distance/waiting charges, tax categories and quotation conversion with trip capacity: partial reference parity.
- Applying the migration, build, tests and running trips with the owner (section "التسليم").

## Useful sections in the full reconciliation

- مطابقة الملاحظات بالنتيجة
- أثر المخطط والترحيل
- حدود التكافؤ الباقية
- مراجعة تكوين شاشة التعريفة — ٢٠٢٦-١٠-٣١
