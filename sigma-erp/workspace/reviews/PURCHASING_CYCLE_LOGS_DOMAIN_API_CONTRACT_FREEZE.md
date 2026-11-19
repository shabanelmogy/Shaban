# Purchasing core document logs

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

## Confirmed slice

Owner requests PO Log in all core Purchasing/Suppliers documents. Extend PR, GRN, Bill, PurchaseReturn using existing PO's `GET /{Controller}/{id:int}/log` → `Result<List<AuditTrailRowDto>>`. Add GetLogAsync to each actual interface/service. Inject existing IAuditTrailService (or reuse existing injection), resolve tenant-owned live root GUID or typed404, then tenant-owned detail GUIDs including soft-deleted ones belonging to that root, pass stable CLR root name and owned detail GUIDs to central reader. Approval history child GUIDs may be included where proven FK ownership, but no unrelated supplier/JV/stock history. No client GUID list. Preserve exact current controller authentication/View policy (PermissionCatalogAction View where available). No new entities/schema/registration or AutoMapper.

Read-only endpoint/viewer do not introduce state transitions; generic tracked saves captured by existing interceptor. Inventory explicit action/reason coverage and gaps rather than duplicate events or invent historic before values. No direct SQL/bulk logs claimed. PR/PO nonfinancial, GRN stock timing, Bill/PurchaseReturn financial approval/void guards unchanged. No mutation audit added on GET.

## Frontend

End-of-cycle scope clarification from actual writers: supplier settlements also use Payment and supplier DebitNote. Extend the same read-only log contract to those two document roots and their proven owned detail/allocation GUIDs. Receipt/CreditNote are customer-oriented and not automatically added to this supplier slice. No Payment approval state is invented; its legacy financial writer remains an explicit audit concern. This is the same action/endpoint/shared-viewer contract, not a new transition.

Each four owning list imports existing DocumentActionLogComponent; typed logRecord signal with real document row, loadLog callback from typed service.getLog(id); toolbar row Log action icon/label reuses documentLog translations or existing PO key where generic appropriate, busy guards and component dialog gating include logRecord. Existing shared component input contracts inspected: visible, recordId, recordNo, load; closed event closes record. Use actual PO bindings as reference. Extend services with typed central AuditTrailRow model/Result observable matching endpoint. No new runtime .ts entry needed if only existing files changed. Preserve existing list actions, filters, print and editor behavior. Add bilingual owning guide steps after full root integration; translations root-owned unless delegated explicitly.

## Conformance / verification

UI7/13/22/28 shared read-only viewer and existing PO list; BE8/18 tenant/source identity and capture/read boundaries; Master4/7 action inventory and guide. Before editing record actual files/symbols and preserve user changes. Source-only diff/import/namespace/routes and busy/error/cancel matching; no build/test/lint/browser/database/migration/commit. Final root reconciliation in PURCHASING_CYCLE_LOG_STATUS_FEATURE_REVIEW.md. Billing/status work is a separate handoff and must not silently alter this frozen slice.

## Source reconciliation amendment — 2026-10-24

The public shared viewer actually accepts recordId and loadEntries only; visibility, translated title, smaller record-number subtitle and close/escape belong to EditorDialogComponent. Implemented all six additional roots through these real inputs; the earlier visible/recordNo/load wording is superseded. Existing PO log now includes its own approval-log GUIDs too. PermissionCatalogAction("View") is action catalog metadata, not runtime granular grant enforcement; inherited controller authentication remains the real access boundary. No new permission mechanism was introduced. Central viewer owns loading/empty/retry/errors and cancellation on destroy. Each service resolves the current tenant's live root, then only its owned children including deleted identities; no external journal/stock or caller-supplied GUID lists.
