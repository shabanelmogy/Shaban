# GRN multi-source picking

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Owner authorizes a Load modal: no PO chosen opens all eligible source orders;
chosen PO opens its details; select lines/partial quantities across several POs.
Also fix the rejected toolbar: source group at logical start, Add at opposite
logical end, one compact row. Reusable picker/behavior documented for similar
future document cycles, retaining model-specific guards.

Impact/decisions: extend existing GRN workflow, do not create parallel reads or
save API. Keep existing source dropdown/draft endpoints and entity line FK;
replace automatic whole-order loading with explicit selected-line acceptance.
Create shared source-document picker using EditorDialog, DataTable and quantity
controls; extend shared collection toolbar for opposite source/Add alignment.
Read details only for the chosen order, retain selections when switching orders;
no one-request-per-candidate prefetch. Source loading is operational, uncached.

Backend master-detail shape BE14/18; UI routed document editor + shared typed
selection dialog UI13/14/16/27. No accounting timing changes. Save remains Pending,
approval alone consumes receipt capacity; draft GRNs do not reserve. Same supplier,
GRN type and effective currency across all source orders; reject mixed manual/
source rows, duplicate source-line IDs and stale/overdrawn quantities. Derive
order membership from live line FKs. Keep legacy unlinked manual receipts.

Keep: receipt approval/stock/billing/void policies, tax, source lock, dirty guards.
Extend: preparation across source orders; source draft exclusion for owned lines;
source-line display DTO provenance; PO usage/billing/references derive actual
source order from line navigation. Refactor: toolbar placement and source loading.
Create: shared selection dialog + GRN adapter. Remove: whole-order auto-accept.
No migrations/model snapshots/database commands. No external communication.
Current one-order header is not source authority: derived single order ID/number
for one source, null for multiple; expose line source IDs/numbers in detail.
List/header presentation must not imply unlinked when line FKs exist.

Root owns contracts/shared UI/GRN UI/docs/integration. Backend aggregate worker
owns GRN service/line DTO/map. Reader worker owns PO/progress readers only.
No overlapping writes. Source-only verification; runtime/build/tests pending.
