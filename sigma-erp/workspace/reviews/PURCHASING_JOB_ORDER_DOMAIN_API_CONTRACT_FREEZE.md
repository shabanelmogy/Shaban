# Job-origin purchase order source boundary

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

The authorized end-to-end correction includes the confirmed Job-origin writer gap recorded in PURCHASING_UPSTREAM_CYCLE_AUDIT.md and the current side-effect audit. Preserve existing PO type, quantities, financial effects, optional header branch and general-line inputs; no new accounting transition or schema. Add POST PurchaseOrder/from-job/{jobId:int} with the existing typed PurchaseOrderAddVM. Resolve a live active Job in the authenticated tenant under the existing PR write lock; require submitted Job type/header to agree with source, derive JobPO/header JobId and each absent line JobId, reject a different line JobId. Reuse the ordinary shared validation/tax/price/number/save preparation. Reject JobPO through ordinary Add; route the existing sourceJobId editor caller through the dedicated endpoint. Existing JobPO edit keeps immutable header source and disallows unrelated line jobs. Bulk Add must pass each row through the ordinary validated writer in one existing transaction; it cannot bypass the source boundary. No new granular permission enforcement: catalog attributes classify actions only. Existing records remain readable, no backfill/deletion. No build/test/runtime/database/migration commands.

Conformance: BE8/14/18 live source and aggregate write; UI2/12 typed routed editor and actual existing PO editor/service; Master4 compatible producer/consumer handoff. Root owns these disjoint files after partial billing contracts have frozen. Source-only reconciliation in PURCHASING_CYCLE_LOG_STATUS_FEATURE_REVIEW.md.
