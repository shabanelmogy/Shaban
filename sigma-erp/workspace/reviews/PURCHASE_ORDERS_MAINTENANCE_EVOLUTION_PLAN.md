| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Purchase Orders maintenance/evolution — 2026-10-20

Owner request: review PurchaseOrders and implement documentation conformance; handle the additional Job-created Workshop type in list/details; activate approval like PR now and defer configurable approval regulations. Clarification: fourth type originates from Job.

## Inventory / impact / classification

Current PO has three enum values (General0/Stock1/Asset2), no fourth producer in inspected Job/WorkOrder services/UI. Existing JobId and line VehicleId/JobId provide the minimal relationship. Current manual Create forces Asset; forms are untyped, updates bypass approval, list filters/paging are disconnected, ListVM contains children/documents, toggle approval permits reversal and resets BillStatus. PR has terminal manual approval and real decision history. No live PO-to-Bill/GRN creation relationship/API exists in inspected purchase models. Equipment quotation creates Asset PO through embedded editor; PR creates partial POs with protected source capacity/discount.

| Area | Decision |
|---|---|
| List | Refactor in place to shared server-paged/sorted list, source/type/status and screenshot filters, complete export/report using applied query |
| Editor | Replace legacy form with type02 routed peer tabs (Basic/Details/Documents/Approval), typed persistent form, shared rows/uploads/totals, saved print; preserve embedded Equipment quotation consumer |
| Types | Keep numeric0/1/2; extend with JobPO=3 (owner clarification). Source JobId required for3. Manual Create offers0/1/2; Job entry navigates to the same create editor with sourceJobId, locked type3. Display Job/vehicle references on all applicable records, never invent a workshop from supplier |
| Approval | Pending1 -> Approved0 or Rejected2 only. Server-owned, terminal edit/delete locks across individual/batch/activation paths; append-only current-account audit history like PR. Keep existing saved status; no inferred historical history or approval backfill |
| Legacy endpoints | Preserve routes; toggle-approval becomes a pending->Approved compatibility action, never reverses. Toggle-bill remains legacy bookkeeping only, requires approval, does not create financial records |
| Source contracts | Keep PR capacity/identity/discount and equipment Asset restrictions. New source ids not writable through ordinary update. Job source/type immutable on update |
| Money | Server-authoritative two-decimal PO storage; once-rounded VAT allocation per rate on new/edited documents for all types; saved values unchanged on read. Discount0..pre-tax amount, net=pre-tax-discount (existing search semantics); expose gross separately |
| Missing workflow | No new accounting/posting/Bill/GRN conversion invented from screenshot. Report is read-only applied PO result; Vehicle Service POs filters JobPO. Screenshot UnApprove superseded by explicit PR lifecycle instruction |
| Safety | No migration, historical data rewrite, build/test/lint/browser/database/Git writes. Owner generates migration for approval log/default/concurrency metadata |

Chosen options: extend existing PO aggregate and source links instead of parallel service-order table; explicit target approval command instead of reversible toggle; same editor for Job and equipment sources. No configurable approval roles/levels/reasons are fabricated. Source-only verification only.
