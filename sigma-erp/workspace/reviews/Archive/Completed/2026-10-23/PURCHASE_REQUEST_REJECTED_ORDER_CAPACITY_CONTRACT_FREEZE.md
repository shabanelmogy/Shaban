| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Rejected purchase orders release purchase-request capacity

Date: 2026-10-22. The owner accepted the recommendation that rejecting a purchase order returns its quantity to the source purchase request. This supersedes only the earlier rule in `PURCHASE_REQUEST_CONSUMPTION_STATUS_CONTRACT_FREEZE.md` that every live PO reserves capacity regardless of approval. All other source-line, rounding, discount, approval, log and downstream guards remain.

## Frozen contract and evidence

| Decision | Frozen behaviour | Evidence |
|---|---|---|
| Effective source use | A non-deleted PO line with a non-deleted parent, correct PR header/line links, positive quantity and PO approval other than Rejected consumes PR capacity. Pending and Approved continue consuming; Rejected does not. | Owner's explicit answer after comparable-system discussion; existing `PurchaseOrderService.ReservationsAsync` and `PurchaseRequestService` source-use queries. |
| Read consistency | PR consumption status, percentage, available-for-PO filter, picker remaining quantity and can-create action use the same effective condition. | Master4, BE14/9, UI4/5; existing paged PR read and conversion draft. |
| Write consistency | PR→PO create and source PO update exclude rejected orders' quantity, amount and allocated discount, then recheck available quantity in the transaction. | Existing `ExecuteUniqueWriteAsync<PurchaseRequest>` and source discount policy. |
| Transition | Pending→Rejected and eligible Approved→Rejected release capacity immediately on the next read. Approved correction still requires a reason and no downstream receipt or billing effect; rejected PO remains read-only and retained for audit. No schema change. | Existing PO approval action/guard and the owner's instruction. |
| No automatic source cancellation | The PR stays Approved. A rejected PO is retained as historical linkage; PR delete and legacy dependency guards remain conservative. | Existing PR approval and delete contracts; no owner instruction to change these. |

## Shape/conformance before edit

| Concern | Book block | Reference file/symbol | Shared owner | Target |
|---|---|---|---|---|
| Server source-use filter | BE9/14 | `PurchaseRequestService.ApplyListFilters`, `RequestsWithRemainingQuantity` | Repository list query | Same effective condition before count/page/export. |
| Conversion read/write | BE14 | `PurchaseOrderService.GetPurchaseRequestDraftAsync`, `ReservationsAsync`, `CreateFromPurchaseRequestAsync` | PO service + SQL application lock | Rejected quantity and discount do not reserve; server remains authoritative. |
| List/details/actions | UI4/5/7 | PR list/details, shared data table/status badge; PO approval modal | Existing components | No new UI field or action; server refresh reflects released capacity. |
| User guide | Master7 | `purchase-requests-topic.ts`, `purchase-documents-topics.ts` | Existing module UserGuide reader | State rejection effect in both guides. |

Phase 0/1 decisions are frozen for the read path and approval action. Phase 2 and Phase 4 are in scope; Phase 3 has no new editor field and Phase 5 no new route/API. Owner build/SQL/browser acceptance remains pending under `AGENTS.md`.

## Source-only reconciliation

| Check | Evidence and result |
|---|---|
| Server status and picker | `PurchaseRequestService.ApplyListFilters`, `RequestsWithRemainingQuantity` and `GetConsumptionAsync` all exclude Rejected PO parents. The existing list/details action flags and paged supplier picker inherit the corrected remaining-capacity query. |
| Conversion read and write | `PurchaseOrderService.ReservationsAsync` excludes Rejected PO lines **and** their discount. Existing draft, create and update consumers share this method and retain their SQL application lock. No DTO, route or mapping change. |
| Approval transition | Existing PO approval method records Pending→Rejected and eligible Approved→Rejected without deleting the PO; Approved correction still needs a reason and blocks known receipt/billing dependencies. The next PR read releases quantity. |
| Example | PR 10 units; Pending PO 4 and Rejected PO 6 → used 4, remaining 6, PartiallyUsed 40%. If both are rejected, Open 0%. Rejected allocated discount is omitted before the next PO's discount allocation. |
| Guides and general rule | Existing PR and PO in-app UserGuide topics updated. Master4, BE14/9 and the screen-refactor digest updated together; generated PLAN-00 and PHASE-00…06 refreshed through the generator and `-Check` passed. Packet provenance and approved reference roles remain consistent. |
| Scope and limitations | Backend/frontend scoped diffs and whitespace checks passed; no merge markers. No migration, build, test, lint, database or browser command ran. Existing manual PO billing flag remains a known later-chain limitation and is not strengthened by this change. |

Suggested commits: backend `Release purchase request capacity when purchase order is rejected`; frontend `Explain rejected order capacity in purchase guides`; documentation `Clarify effective PO source-use states`.

## Owner verification checklist

1. Approve a request for 10 units, create a pending PO for 4 and another for 6. The request should show Closed and 100%.
2. Reject the 6-unit PO. It remains visible with its approval history, while the request becomes PartiallyUsed 40%, and the source picker shows 6 remaining.
3. Create a replacement PO for 6; its discount should use only active orders' allocated shares, with no source over-discount. The request returns to Closed.
4. Reject all effective POs before any receipt or billing. The request should show Open 0% with all 10 units available. An approved PO with a downstream receipt must continue to reject an approval correction.
