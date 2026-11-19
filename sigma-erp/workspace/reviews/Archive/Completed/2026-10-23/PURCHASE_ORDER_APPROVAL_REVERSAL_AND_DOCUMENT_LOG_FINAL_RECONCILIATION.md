| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Purchase Order approval correction and reusable document log — 2026-10-22

## Contract and evidence

The owner's decisions allow an Approved PO to become Pending or Rejected directly with a reason, only when no downstream action is affected. The owner then requested a Log action and a shared log for comparable documents covering creation, edits, approvals and other tracked actions. The frozen handoff is `PURCHASE_ORDER_APPROVAL_REVERSAL_AND_DOCUMENT_LOG_CONTRACT_FREEZE.md`. Existing Audit Trail metadata capture is extended, not duplicated. No screenshot adds a backend rule in this handoff.

| Concern | Canonical block and reference | Target conformance |
|---|---|---|
| PO approval action | UI7/13, shared action menu and EditorDialog; BE14 nonfinancial transition | Same server decision/history in modal and saved tab; correction uses typed reason form and server recheck. |
| Document Log action | UI7, shared DataTable and EditorDialog | PO action opens shared read-only document-action-log with typed loader, empty/error/retry and translated action. |
| Tracked capture | BE18, existing AuditTrailSaveChangesInterceptor | Same-save central event; scalar JSON detail, optional reason, semantic approval/void label, redaction; no additional commit. |
| Read boundary | BE18, QueryReport tenant filter | PO view endpoint resolves root and retained line GUIDs; central reader returns their events in event order. |

## Source reconciliation

- Backend: `PurchaseOrder.DecideApprovalAsync` and the domain transition require Approved state, target Pending/Rejected, a nonblank reason of at most 500 characters, no non-void linked GRN (draft included), and NotBilled state. Existing purchase-request lock also covers GRN/Bill writers. Decision history retains old/new state and reason. The PO Log endpoint checks record existence and view permission.
- Shared backend: Audit Trail captures successful tracked creates, updates and deletes, including child rows. Actual changed approval and void fields gain labels; PO explicitly labels decisions. Scalar before/after values are captured only when EF has a distinct original, with sensitive and oversized data masked/omitted. Direct SQL, bulk updates, historical metadata-only rows and separate auth remain outside detail capture.
- Frontend: shared document-action-log component and formatter; PO list Log modal; reason dialog in the shared PO approval surface; central Audit Trail columns; bilingual labels and screen guides. No new permission API or AutoMapper mapping was introduced.
- Documentation: BE18 and UI7 books plus sigma-screen-refactor skill revised. Generator refreshed PLAN-00 and PHASE-00 through PHASE-06; semantic checks matched the changed BE18/UI7 rules and `-Check` passed every packet.
- Separate scoped Git diffs and `git diff --check` were reviewed in backend, frontend and documentation repositories; no whitespace errors were reported. Existing unrelated Purchase Request/PO source-picker changes were preserved.

## Owner verification

Run `Add-Migration AddDetailedDocumentAuditAndPurchaseOrderApprovalCorrection` and apply it before enabling the changed API. The migration needs AuditTrailEntry Reason/ChangesJson/RecordAction length and PurchaseOrderApprovalLog PreviousStatus/Reason. Then compile and verify create/edit/approval/correction, blocked correction after a draft/approved GRN or billing, PO parent/line logs, central Audit Trail paging/export, both languages, nested reason dialog, save rollback and concurrent GRN creation. No build, test, lint, migration, browser, database, commit, push or deploy command was run by the agent.

Suggested backend commit: `Add guarded PO approval correction and detailed audit capture`.
Suggested frontend commit: `Show shared document action log and PO correction reason`.

No subagents were used because the state transition, capture contract and UI integration were tightly coupled. Runtime and visual acceptance remain with the owner.
