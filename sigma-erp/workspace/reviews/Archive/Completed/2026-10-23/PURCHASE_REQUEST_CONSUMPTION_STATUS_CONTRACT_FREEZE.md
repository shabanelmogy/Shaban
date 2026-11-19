| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Purchase Request consumption — first reusable document example, 2026-10-22

## Scope and evidence

The owner requests source-document consumption state, percentage and filters, starting with Purchase Request. Existing Purchase Request → Purchase Order source links and `RequestsWithRemainingCapacity` prove line-level quantity reservation. Current non-deleted POs reserve quantities even before PO approval; deleting one releases them. This example changes the Purchase Request list and saved details, its read DTOs, bilingual guide, and canonical reusable documentation. It does not implement PO billing status; a request converted to an order is not billed.

## Frozen read contract

| Field | Decision |
|---|---|
| Source | Live request lines with positive quantity. Zero-quantity lines cannot contribute capacity. |
| Used | Live PO detail quantity linked to the source line under a live PO belonging to this request, irrespective of PO approval. |
| Status | NoQuantity if no positive source line; Open if none used; PartiallyUsed if some used and any capacity remains; Closed only when every positive line is exhausted. |
| Percentage | Arithmetic mean of each positive line's `min(used, requested)/requested × 100`, rounded to two decimals. This does not sum incompatible units of measure. Open is 0, Closed is 100, PartiallyUsed is clamped to 0.01–99.99 so a nonzero use does not display zero. NoQuantity has no percentage. |
| Mutability | Derived on read; no persisted status, migration or client-calculated write. Changing/deleting linked live orders updates the next read. |
| Filters | All four statuses are filterable server-side before count/page and apply to Excel. Absent filter returns all. Unsupported enum numbers behave as absent under current list-filter convention. |
| Presentation | List status badge and percentage; saved View shows the same status/percentage. Approval remains a separate axis. |

## Conformance and verification

| Concern | Canonical owner and reference | Target |
|---|---|---|
| List/filter | UI4/5/6, BE9; Workshop Job list and shared panel/table | One advanced filter, typed API key, status and percent columns. |
| Derived read | Master4, BE14; current PR/PO source capacity queries | Batch source/usage read per page, no cross-UOM sum or client authority. |
| Editor | UI13, screen02; current Purchase Request editor | Read-only saved consumption indicator; draft has no derived status. |
| Export/help | UI21/23, Master7 | Filtered pages and bilingual guide mirror the list. |

Owner runtime/database/browser and compiler verification remain pending under the workspace execution boundary. No migration is needed for this computed read contract.

## Source reconciliation, 2026-10-22

- Backend enum, list/detail read DTOs, explicit AutoMapper ignores, PurchaseRequestService SQL filter and batched page/detail projection implement the frozen contract. The repository Query root filters tenant and soft-deleted rows; the downstream PO navigation also explicitly excludes deleted parents.
- Angular list uses a typed status filter with route restoration/reset, translated badge and percentage, and all-pages export reuses the applied filters. Saved details show the same server values. English/Arabic vocabulary and Purchase Request guide cover the state meanings.
- Canonical Master4, BE14/9 and UI4/5 plus the screen-refactor digest were updated. Generated PLAN-00 and PHASE-00…06 packets were refreshed and recipe `-Check` passed. The generated Phase-02 provenance lists Master4, UI4/5 and BE9 and retains the approved shared table/filter and Workshop Job list references; its read-path instructions do not conflict with the new canonical rule.
- Scope boundary: this slice does not calculate PO billing status. That requires a separate authoritative posted-invoice linkage and denominator. It does not persist a new column or require a migration.

## Final source-only review

| Check | Evidence and result |
|---|---|
| Action-state reconciliation | Existing Purchase Request Approve/Reject/Create PO actions retain their own service guards. Derived source-use has no write action and does not replace approval. |
| Shared extraction | Existing `app-data-table`, advanced filter panel, enum option builder, status badge and list-route state handle the new fields. No new shared component is warranted. |
| API/UI contract | Numeric enum values 0–3 match in C# and TypeScript; list/detail fields and `consumptionStatus` query key match; EN/AR keys cover all values. |
| Scope and whitespace | Backend and frontend scoped `git diff --check` passed. Existing unrelated worktree changes were preserved. |
| Runtime acceptance | Owner compiler, SQL translation/performance, browser display, export and mixed-UOM sample verification pending under `AGENTS.md`. |
