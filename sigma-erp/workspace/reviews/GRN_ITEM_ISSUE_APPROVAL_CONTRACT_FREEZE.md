# GRN and Item Issue — operational approval contract

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-21 |
| Scope | Stock effect, approval transitions and directly related readers for GRN and Item Issue only |

## Owner decisions

1. Save creates an editable draft without changing stock quantity. Approve is the first inbound effect for GRN and the first outbound effect for Item Issue.
2. A GRN with Issue to Job creates a linked draft Item Issue only after GRN approval. The issue needs its own later approval before deducting stock; both documents keep distinct decision history.
3. A draft GRN does not reserve Purchase Order capacity. Approval rechecks all source-line capacity atomically and fails with a useful message if another approved receipt consumed it.
4. An approved receipt or issue may be canceled by a separately guarded and audited operational action with a reason. Downstream use blocks cancellation; canceling a receipt must not make stock negative.
5. Item Issue approval rejects an outbound quantity greater than available stock, identifying the affected item and shortage.
6. The absence of a journal is not a reason to omit operational cancellation. No accounting Void or placeholder JV is created for either document.

## Source-supported compatibility and implementation choices

| Concern | Frozen rule | Evidence / owner |
|---|---|---|
| State | New rows start `NotApproved`; approved and rejected decisions are server-owned. Use nullable status for pre-migration rows. | Existing `ApprovalStatus` enum and Purchase Order approval pattern; existing GRN/Issue rows already affect stock. |
| Historical rows | Null status means legacy effect retained and read-only for new approval actions; do not replay quantity or silently treat a historical row as a new draft. Existing Void/deletion guards remain applicable until a separately audited correction policy exists. | Both report queries currently count every live GRN/Issue row. Preserving effective stock is the only non-destructive migration-compatible interpretation. |
| Effective predicate | Stock and PO received-capacity readers count approved or legacy-effective rows, excluding canceled/voided rows. They never count pending or rejected drafts. | Owner stock-effect and no-reservation decisions; `StockReportsService` and GRN source-capacity queries. |
| Approval read | Expose one server context and append-only history to the saved editor tab and the separate list Approval Status modal, including current status and eligible action flags. | Universal presentation rule in Master 4 and UI 7/13. |
| Decision write | Approve/Reject only from an editable pending state. Revalidate source, stock, tenant, duplicate decision and references on the backend; serialize competing approvals. | Purchase Order action pattern and owner capacity/negative-stock decisions. |
| GRN → Issue | GRN approval creates at most one linked draft issue in the same transaction if Issue to Job is selected. Repeated approval cannot duplicate it. A linked draft issue has no stock effect. | Owner paired-action decision; existing GRN Save currently creates the issue and must be moved. |
| Operational cancel | A retained terminal canceled/voided flag excludes the approved movement from the effective stock predicate only after same-lock dependency and resulting-balance checks. Preserve the original movement and append an audit decision; never delete/reverse it silently. If a GRN owns only a linked pending issue, cancel that issue as an uneffected draft in the same operation; block GRN cancellation after the issue becomes effective or a bill depends on the receipt. | Owner operational-cancel and two-step issue decisions; existing GRN source guards. |
| Stock scope | The existing Item Issue has no branch identifier and the authoritative stock summary aggregates by item. Enforce the no-negative rule at that current item scope; do not invent a branch balance or claim branch-level protection. | `ItemIssue` entity and `StockReportsService` source formulas. Branch-level stock ownership remains a separate contract. |
| Corrections | Rejection is terminal for that saved draft. Corrections use a new document; approved records are not unapproved by merely changing status. | Purchase Order decision pattern and operational effect provenance. |
| Date | New stock effect begins at recorded approval time. Historical report date behavior remains as-is. | Owner first-effect-at-approval decision; prevents a later approval from silently changing earlier as-of reports. |

## Conformance and impact

| Concern | Canonical block | Reference/source | Target |
|---|---|---|---|
| Master/detail save | Backend 14 | `PurchaseOrderService` tracked detail reconciliation | Preserve validated aggregate saves; no stock effect until approval. |
| Stateful action | Backend 12/14, UI 7 | `PurchaseOrderService` approval and decision log | Explicit transitions, one read context, append-only history. |
| Approval surfaces | Master 4, UI 7/13 | Purchase Order saved editor tab and list modal | Same GRN/Issue server context on both surfaces. |
| Effective stock | Backend 15 and domain rule | `StockReportsService`, GRN PO capacity queries | One effective predicate in every quantity reader; pending rows excluded. |
| Legacy compatibility | Master 4, Phase 1 | Current report calculations and nullable Bill/PurchaseReturn approval | Legacy status remains unknown but quantities effective. |

## Migration and acceptance boundary

The owner must create and apply a migration after source implementation, suggested name `AddGrnAndItemIssueOperationalApproval`. It should add nullable status, durable decision history and effect/cancel timestamps and metadata without replaying old stock movements. No migration or snapshot may be created here under `AGENTS.md`. Source-only verification cannot prove concurrency, stock balances or legacy database behavior; the owner must compile, apply the migration and exercise the transition scenarios in a controlled environment.
