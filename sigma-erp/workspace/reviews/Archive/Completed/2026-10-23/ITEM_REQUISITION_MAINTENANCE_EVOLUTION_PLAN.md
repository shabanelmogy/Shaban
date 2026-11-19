# Item requisition cycle plan

| Status | Frozen |
|---|---|
| Owner verification pending | yes |
| Date | 2026-10-04 |

User authorizes review/fixes and explicitly asks to understand the Actions cycle, with list/editor/PR/Issue screenshots. Existing source saves requisition header/lines only. No status, requisition→PR/Issue relation, action endpoints or action UI exists. Preserve historical rows, existing numbering, tenant/authentication and current PR/Issue accounting behavior; no new journal/stock valuation or available-stock formula.

| Existing concern | Decision | Target |
|---|---|---|
| Header + one quantity-only collection | Refactor | UI01 shared list/modal; typed full snapshot |
| Detached generic update/no owned IDs | Replace scoped override | tracked owned reconciliation, validate all FKs/quantity/notes |
| Status shown by UI without source | Create minimal derived state | Open until each positive requested item quantity is fully issued by live linked Issue documents; Closed then. No historical state assignment. |
| Actions Create PR/Issue missing | Create source-linked workflows | routed stock PR action with current fields/documents/totals; shared Issue modal with remaining quantities; no mutation on opening |
| PR/Issue exist | Extend minimal source relationship | nullable ItemRequisitionId navigation on both headers; existing rows null; one live PR per source, partial issues allowed |
| Report/Print missing | Create minimal read consumers | complete applied-query catalogue report and single-document print using shared print owners |
| Legacy grid/styles/DTO audit payload/provider duplication | Replace/remove | shared owners, explicit VM fields, root service only |

Alternative rejected: cloning into unlinked ordinary editors loses provenance and cannot derive fulfilled state; marking Closed merely after PR creation confuses purchasing with issuing; adding stock balance/accounting rules lacks a confirmed source. Partial fulfilment completion is a reviewer decision under Master2 standing rule, surfaced in an optional question; no answer inferred from suggestions. If owner steers that decision, record an addendum before changing it.

Backend pattern2; UI01 requisition/issue action, UI02 routed PR action (document lines/totals/files), UI20/21 report/print. Canonical references Job list/editor, VehicleService details/EditableRows, PurchaseOrderService and shared owned reconciliation. Contract: ITEM_REQUISITION_DOMAIN_API_CONTRACT_FREEZE.md. Owner migration required for optional source links/indexes/row constraints. No migration generation/runtime verification authorized. Root owns integration/artifacts; bounded workers may own disjoint backend/editor/action surfaces after freeze.
