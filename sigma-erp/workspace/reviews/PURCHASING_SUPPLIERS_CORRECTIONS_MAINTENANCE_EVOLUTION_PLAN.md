# Purchasing corrections and remaining-cycle adoption

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-25 |

Owner authorizes fixing the post-change review findings and explicitly extends
scope to physical supplier returns and general payment journals with a unified
cycle. Currency work and its dependencies are deferred, including R06's source
currency display correction; preserve current currency guards.

Keep existing document/service/UI owners and source-line provenance. Refactor
R01's allocation capacity reads/rechecks; extend R02's GRN dependency proof;
extend R03-R05 Return edit/retry/read labels; update R07 guide. No new schema is
needed for these confirmed fixes. Existing effects, approvals and rejection
terminality remain. Do not change historical journals or repair test data.

Additional physical-return and Payment slices are authorized outcomes, but their
financial/stock contracts must be resolved from source and owner decisions before
implementation. Discover existing owners and propose exact defaults; do not
silently invent tax, valuation, payment-method effects or historical treatment.
Freeze those handoffs separately before assigning source edits. Continue the
confirmed fixes while those decisions are established. This plan freezes the
execution sequence, not unresolved financial contracts.

| Slice | Classification | Dependency and contract |
|---|---|---|
| Financial capacity + GRN reference guards | Refactor/Extend | R01/R02 frozen correction handoff |
| Existing Return UI and detail labels | Extend | R03-R05 + R07 frozen correction handoff |
| Physical supplier return | Extend existing Return; reuse stock/shared picker | Discovery and exact effect contract pending |
| General Payment journal/lifecycle | Extend existing Payment | Discovery and exact journal/effect contract pending |
| Currency system and R06 | Keep/defer | Explicit latest owner instruction |

Verification remains source-only: no builds/tests/lint/runtime/browser/database,
migrations/snapshots or commits. Root owns final integration and docs/skill/packet
maintenance. Workers have disjoint files and preserve user/peer changes.

## Execution amendment — 2026-10-25

The separately frozen goods-return and Payment contracts now resolve the
previously pending effects. Owner chose same-PO replacement capacity and exact
original bill-line values. Implemented scope and source-only reconciliation are
recorded in PURCHASING_SUPPLIERS_CORRECTIONS_FINAL_RECONCILIATION.md. Historical
pending rows above record the original plan, not current unresolved decisions.
Currency R06 remains explicitly deferred. No destructive repair/backfill ran.
