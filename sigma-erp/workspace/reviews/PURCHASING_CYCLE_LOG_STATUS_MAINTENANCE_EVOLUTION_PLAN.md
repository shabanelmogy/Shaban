# Purchasing cycle logs and progress

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

## Manifest / existing state / scope

Owner authorizes adding the Purchase Order action log to the purchase documents, open/closed/partially-used and invoiced/not/partial logic, documenting the steps and end-to-end side-effect review. Initial recipe check all8 current. Current core menu/previous contract defines PurchaseRequest → PurchaseOrder → GoodsReceivedNote → Bill and independent financial PurchaseReturn. Supplier payments, JournalVoucher allocations, Stock/ItemIssue, Workshop Job, ItemRequisition and reports are dependency readers/writers to audit, not automatic authorization to rewrite their financial effects. Existing root/account UI/permission/currency changes and owner migrations preserved. Source already includes PermissionCatalogAction and controller policy; factual implementation supersedes older guide wording claiming authentication only. Reuse current View contract, do not invent permission mechanisms.

Current PR consumption and PO receipt status are computed; PO BillStatus is manually toggled and cannot prove invoice coverage. Bill PrepareLinesAsync copies every line of a selected GRN and excludes a receipt referenced by any other live nonvoid Bill, including draft; this is whole-receipt reservation. Owner confirmed invoices counted from approved Bills, drafts reserve. Whether partial billing within a GRN is required is pending owner response; do not invent a per-line source identity or fraction from amounts. PO log exists through AuditTrail central service/shared viewer and tenant-owned root/detail GUIDs; PR/GRN/Bill/Return need endpoints/viewer adoption. Central tracked-save capture already supplies generic create/edit/delete, approval change and void; explicit action context supplies semantic actions/reasons. Before-value accuracy for detached writes is a known BE18 limit, not proof of historic truth.

## Impact / alternatives / classification

| Area | Decision | Reason |
|---|---|---|
| Central AuditTrail/interceptor/viewer | Keep | Already owns atomic tracked write logs and redaction |
| Four missing document log readers + menus | Extend | Same PO reference, validate root and owned deleted child GUIDs; no browser GUIDs |
| PR consumption / PO receipts | Keep, audit | Existing quantity-owner policies; zero quantity separate, no manual status edits |
| PO invoicing | Replace display derivation, retain legacy flag only for compatibility guards | Actual effective receipts and approved Bills determine coverage; no manual flip as fact |
| GRN invoice/reservation display | Extend | Whole selected receipt is approved-invoiced versus draft-reserved; unsupported legacy mappings diagnostic |
| Financial effects / settlement / returns | Keep, audit | Approval, void, tax, allocation, loan/asset effects have frozen owners |
| Documentation and guides | Extend | Reusable cycle audit/log checklist in BE18/skill; feature-specific state matrix in contract and user guides |

Alternatives: reuse manually toggled BillStatus rejected as non-authoritative; proportional amount matching rejected because no source-line proof; derive existing whole-receipt billing coverage selected for that compatible slice, pending intra-GRN split decision. No history backfill or migration for log adoption. Any new line-source schema requires owner migration, never generated/run here.

## Implementation / verification

Owner answered that partial billing is allowed inside a GRN and explicitly confirmed all current data experimental; correctness is the priority. Frozen line-source amendment: PURCHASING_PARTIAL_GRN_BILLING_DOMAIN_API_CONTRACT_FREEZE.md. Extend BillDetail with nullable precise GRN detail FK, server per-line capacities, editor requested quantities and derived SQL coverage. Owner-run migration AddBillReceivedLineSource is required. Previous whole-receipt-only proposal is superseded, not silently retained. Logs extend through Payment and supplier DebitNote as actual end-of-cycle source documents. No historical-row reconstruction; unkeyed experimental rows require review/reset. Logs and derived display stay independent from financial/stock effect lifecycle.

Freeze logs independently in PURCHASING_CYCLE_LOGS_DOMAIN_API_CONTRACT_FREEZE.md so confirmed adoption can proceed while billing granularity settles. Root owns shared decisions/integration/status core/docs; disjoint backend log worker and frontend log worker after freeze. Independent source-only audit covers reservations, approval/unapproval/void/delete, finance/stock/branch/currency and direct SQL gaps. Phases0/1/2/3/4/5/6 apply proportionally; no cosmetic full-screen rewrite. No builds/tests/lint/browser/database/commit/migration commands. Source checks and owner acceptance recorded in feature review. Current owner check pending: compile, tenant separation, logs capture after create/update/approval/delete/void, partial quantities and reservation lifecycle, rollback and reports.

## Final source amendment — 2026-10-24

Partial source-line implementation supersedes whole-GRN reservation above. The current source also confirms PermissionCatalogAction is catalog metadata only; the earlier phrase implying a runtime View policy is superseded. Authentication is inherited, and no new grant enforcement is claimed. Additional confirmed corrections are the approved-PO pending-receipt report, exclusion of voided Bills from effective receipt-void blockers, and owned-child cleanup when deleting a draft financial return. Job-origin PO source boundary is frozen separately in PURCHASING_JOB_ORDER_DOMAIN_API_CONTRACT_FREEZE.md and implemented with the real editor caller, ordinary/bulk writer guard and immutable edit source. No financial side-effect policy is expanded. Final reconciliation is PURCHASING_CYCLE_LOG_STATUS_FEATURE_REVIEW.md.
