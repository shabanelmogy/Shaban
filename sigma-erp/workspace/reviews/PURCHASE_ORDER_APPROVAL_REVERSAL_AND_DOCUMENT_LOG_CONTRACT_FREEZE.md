| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Purchase Order approval correction and document action log — 2026-10-22

The owner requests changing an approved PO to Pending or Rejected directly, with a required reason and a full action log, only when the change cannot affect another action. The prior terminal approval decision in `PURCHASE_ORDERS_CONTRACT_FREEZE.md` is superseded for this guarded correction. The existing Rejected enum value is reused.

## Decisions and evidence

| Decision | Evidence |
|---|---|
| Approved → Pending or Rejected requires a trimmed 1–500-character reason. Pending → Approved/Rejected retains its existing approval path. A corrected Pending order may be approved again. | Owner's direct answers; current `ApprovalStatus` already has all three states. |
| A reversal is blocked when a live, non-void GRN links the PO (including a draft), or its bill state is not NotBilled. The server checks in the write boundary and returns a conflict; UI eligibility is advisory. | Owner's “no effect on another action” rule; `PurchaseOrderService` source/receipt guards and `GoodsReceivedNote.PurchaseOrderId`/legacy `LPONo` links. |
| The correction preserves and appends decision history. The log records document identity, action, actor/time, old/new state and reason. No source line, discount or PR reservation is changed. | Existing `PurchaseOrderApprovalLog` and central `AuditTrailEntry` owners. |
| Reuse and extend the existing `AuditTrail` capture/read owner for a central document log. Tracked create/edit/delete writes retain atomic capture; tracked approval and void state changes get semantic action labels, and callers may add a reason. Rich details avoid secret values; raw SQL/bulk `ExecuteUpdate` remains outside automatic capture unless its writer explicitly emits an event. | Existing `AuditTrailSaveChangesInterceptor` and prior frozen audit contract; owner's new broader instruction supersedes metadata-only scope. |
| PO list offers a Log action opening the shared read-only document-log component. The PO read includes its current and soft-deleted line identities so child changes appear beside the parent. Other similar documents can use the same component and central service with their own identity/permission checks. Approval tab and modal use the same server action/history. | Owner's request to reuse this for similar documents; UI7 action cycle and UI13 dialog shape. |

Applicable packets: PLAN-00, PHASE-01, PHASE-03, PHASE-04, PHASE-05, PHASE-06. The recipe drift check passed all packets. UI shape: routed editor with action modal; backend shape: nonfinancial master-detail transition. Migration is owner-run; no migration or build/test/browser/database command is authorized here. Other document-specific reversal rules remain per-model; the central log service is reusable without enabling unsafe generic state transitions.
