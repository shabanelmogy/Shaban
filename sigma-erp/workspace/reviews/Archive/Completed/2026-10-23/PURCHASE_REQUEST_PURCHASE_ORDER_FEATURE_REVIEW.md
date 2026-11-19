| Field | Value |
|---|---|
| Status | Closed |
| Owner verification pending | yes |

# Purchase Request → Purchase Order source-only review

Date: 2026-10-22. Scope: Purchase Request approval, source selection, partial conversion, Purchase Order update/approval, and the two document lists. No application source was changed. Runtime, SQL, browser and build verification remain with the owner under `AGENTS.md`.

## Authority and shape

The review follows `SIGMA_FEATURE_REVIEW_MASTER.md`, canonical UI screen shape 02 and its UI blocks 4–6, 13–17, canonical backend pattern 2 and blocks 9/14, and generated Phase 00–06 packets. `Generate-SigmaRecipes.ps1 -Check` passed before packet use. The approved shape is a paged document list plus routed document editor, with a source-aware modal for PR → PO conversion. Existing frozen handoffs: `PURCHASE_REQUEST_CONSUMPTION_STATUS_CONTRACT_FREEZE.md` and `PURCHASE_REQUEST_PO_SOURCE_PICKER_CONTRACT_FREEZE.md`.

| Concern | Canonical owner | Reference / shared owner | Current match |
|---|---|---|---|
| Paged source selection | UI4–6, BE9 | Shared `DataTableComponent`, `PurchaseRequestService.GetManyAsync` | Supplier and eligibility filters run before count/page; selector shows only eligible rows. |
| Document details | UI13–17, BE14 | Screen 02, shared editor/collection components | PR/PO are routed editors; conversion is a typed modal. |
| Source capacity and write | Master4, BE14 | `PurchaseOrderService.CreateFromPurchaseRequestAsync`, SQL application lock | Source lines, price, discount and remaining quantity are rechecked in a transaction. |
| Approval state | Master4, Phase04 | PR/PO approval services and dialogs | Approval is independent of derived consumption and receipt progress. |

## Confirmed behaviour

- An approved request with at least one line of remaining quantity appears in the supplier-scoped picker. The PO-side action is in the detail toolbar beside Add Detail; PR list and details also offer Create PO. The selected request returns requested, previously ordered and remaining quantity per line. The write retains source header/line IDs, source supplier/type/price/currency, and rejects over-ordering on a fresh server read (`PurchaseRequestService.cs:184–198`; `PurchaseOrderService.cs:640–788`; `create-purchase-order.component.ts:149–297`).
- PR consumption status and percentage are calculated from live linked PO lines, with server-side status filtering before paging. The percentage is the arithmetic mean of line-wise percentages, as frozen; no cross-unit quantity total is used (`PurchaseRequestService.cs:34–63,200–235`). A non-deleted pending or rejected PO also consumes source capacity by the current frozen rule.
- A source PO cannot add a new line or change source item/asset/vehicle/UOM/job/unit price while pending. After approval, a change to pending or rejected requires a reason and is blocked by registered receipt or the current billed flag (`PurchaseOrderService.cs:226–340,475–554`). The source request remains approved and locked for editing.

## Findings

| Priority | Finding and evidence | Consequence / recommendation |
|---|---|---|
| High | PO billing is a manually toggled two-state field (`BillStatus.cs`; `PurchaseOrderService.cs:557–568`), displayed and filtered as Billed/NotBilled (`PurchaseOrderService.cs:39–58,88–137`; PO list component). | It cannot express Partially Billed, and NotBilled after approving an order only means the stored flag has not been toggled. Derive all three states from authoritative live bill/GRN links and amounts or quantities before using billing as an approval-correction guard. This is a later chain contract, not a PR→PO conversion defect. |
| Medium, contract decision | Live rejected POs retain PR reservations, because capacity and percentage queries exclude deleted orders but do not exclude rejected approval (`PurchaseOrderService.cs:853–868`; `PurchaseRequestService.cs:189–235`). This matches the frozen PR consumption contract. | A fully converted request remains Closed with no available quantity after its PO is rejected. Decide whether Rejected means terminal cancellation and releases the reservation, or whether a separate delete/cancel action is required; then update both capacity and status in one contract change. |
| Low | The source picker lists request number/date/type/supplier/total but no aggregate availability indicator (`create-purchase-order.component.ts:77–87`). Line-wise remaining quantities appear only after selecting a request. | Add a concise availability badge/count in the picker if users must compare several requests before opening one. Keep per-line quantities authoritative. |
| Low, legacy/data guard | PR list disables Delete when any linked PO exists (`PurchaseRequestService.cs:108–123`), but the direct removal method checks only approval status (`PurchaseRequestService.cs:585–594`). | Normal flow cannot produce a linked PO under a pending PR, yet imported/corrupt legacy records could bypass the list guard via the API. Apply the same downstream-link check in Remove/active transitions when those records are in scope. |

## Reconciliation

| Check | Result |
|---|---|
| PR→PO API and UI | Route, typed request, supplier filter, source IDs and server recheck match. |
| Status dimensions | PR consumption and PO receipt progress are derived; PO billing remains an independent manual flag. |
| Source diff | Read-only review; existing frontend/backend worktree changes preserved. |
| Owner acceptance | Compile, SQL translation/performance, browser behaviour and sample data remain pending; no build, test, migration or browser command was run. |

## Owner decision after this review, 2026-10-22

The owner accepted that a rejected PO returns its quantities to the source PR. The new frozen handoff `PURCHASE_REQUEST_REJECTED_ORDER_CAPACITY_CONTRACT_FREEZE.md` supersedes the earlier all-live-PO reservation policy. Backend source, in-app guides and canonical documentation now implement the new rule source-only. The earlier Medium contract-decision finding above is historical and resolved in source; owner runtime acceptance remains pending. The separate billing-state finding remains open for later chain work.
