# Purchase order downstream creation — implementation and reconciliation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-24 |

## Scope and confirmed decisions

Owner approved Stock/Asset PO → GRN → supplier Bill, and General/Job PO →
direct supplier Bill, with partial quantities in both paths. Implements
PURCHASE_ORDER_DOWNSTREAM_CREATION_MAINTENANCE_EVOLUTION_PLAN.md and
PURCHASE_ORDER_DOWNSTREAM_CREATION_DOMAIN_API_CONTRACT_FREEZE.md. Existing
approval, terminal rejection, period, journal, allocation, stock and source
capacity contracts remain authoritative. No supplied screenshot defines this
change. Evidence is owner confirmation plus current producers/readers.

Phases 0/1 discovery and freeze, 2 list flags/progress, 3 existing routed Bill
editor and persisted source, 4 downstream guards, 5 route/API integration and
6 scoped source reconciliation applied. No new generic CRUD or permission
mechanism. Existing extensive unrelated changes were preserved.

## Shapes, shared owners and conformance

| Concern | Book | Reference / existing owner | Final match |
|---|---|---|---|
| Routed document editor | UI catalog 02/08; UI1/13/14 | Workshop/Job editor shell; existing Bill details editor | Existing Bill route, modes, shell and exit flow extended; no second editor |
| Conversion action | UI7 | ActionList / PrimaryActionButton; existing PO Create GRN entry | Server canCreateBill on row and saved View; opens existing Bill/create with typed source ID |
| Partial source selection | UI14/17/19 | EditableCollectionTable, QuantityInput, PrimeNG Select, FieldError; existing Bill GRN selector | Same shared owners; source metadata read-only, requested quantity/account typed; source errors block save |
| Aggregate persistence | BE14/15/18 | PurchaseOrderService aggregate; existing BillService financial lifecycle | Source FK on child; tenant checks, one parent, subset reconciliation and writer lock retained |
| Financial effects | BE18; frozen purchasing approval contract | BillService approval and current journal writer | Saving reserves only; approval posts through current owner; no direct-path stock movement |
| List/read progress | UI6; BE9 | PurchasingBillingProgressQuery and PO projection/materialization | Same computed progress used for list/detail/filter/count/export; old manual completion rejected |
| User guide | Master7 | UserGuide reader and purchasing module topics | Existing bilingual topics updated, no new viewer or menu |

No shared presentation extraction was needed: table, action, select, numeric,
state and error owners already provide the required behavior. Direct source
validation belongs to the Bill aggregate and feature contract. BE18/UI7 now
record the reusable type-directed conversion rule; the skill digest and its
revision history were updated in the same task.

## Final behavior and boundary comparison

| Path / contract | Final source evidence |
|---|---|
| Stock/Asset conversion | Existing canCreateGrn and GRN source writer kept; receipt-based partial billing kept |
| General/Job conversion | PO list/detail canCreateBill → /Bill/create?sourcePurchaseOrderId=id → GET /Bill/purchase-order-draft/{id} |
| Source read | Exact DTO header and line fields agree with Angular interfaces; optional excludeBillId validated against same saved parent |
| Input ownership | Direct line sends source key, positive whole quantity and posting account; server derives price/description/job and rejects mixed/manual/GRN sources |
| Persistence | Nullable BillDetail.PurchaseOrderDetailId, restrictive FK and index; Add/Update/detail mapper/approval/copy paths carry the key |
| Edit | Same parent retained; selected subset may change; existing child IDs cannot be rebound; zero quantity omits a source row |
| Currency/header | Source currency, or active base currency when PO has none; source supplier/type and prescribed branch locked; unprescribed branch requires explicit selection |
| Discount/calculation | Existing server preview/calculation reused; new create may prefill proportional PO discount for selected base amount until user edits it; normal bill tax/loan rules retained |
| Capacity | Add/Update/Approve recheck under existing PurchaseRequest lock; positive source quantity less other pending/approved direct quantities; own Bill excluded during edit/approval |
| Read preview | Advisory read only, does not reserve or guarantee capacity; concurrent changes may invalidate it before Save, which rechecks under lock |
| Lifecycle | Pending reserves; Approved invoices; guarded UnApprove returns to Pending reservation; eligible Reject/Delete/Void releases; original financial dependencies remain |
| PO dependencies | Retained direct bills block edit/delete/deactivate/reject/unapprove; unknown/null states remain retained and require review |
| Diagnostics | Invalid source/snapshot/header/type, duplicate/mixed source, unknown status and overcapacity fail closed; no legacy free-text backfill |
| Client recovery | Loading/retry/error states, cancellation, source reload retaining dirty inputs, validators recalculated after hydration; duplicate source IDs rejected; no dead Add Detail action |
| Refresh | Existing Bill save exit/return flow retained; PO source progress is read from actual saved linkage on reload |

The preview wording above clarifies the existing read/write boundary; the
frozen contract requires authoritative capacity checks at Add/Update/Approve.
It does not introduce a preview reservation or a new financial transition.

## Override and action reconciliation

No new generic override was introduced. Touched Bill Add/Update own aggregate
reconciliation, capacity locking and calculations; bulk overrides reject
precise-source inputs rather than bypassing the single-document workflow.
Existing Bill detail/list overrides continue their projection/read duties.
PO filter/projection/materialization/order overrides serve computed progress
and action flags. PO Add/Update/Delete/Active retain aggregate/source guards;
detail overrides share ReadDetailAsync. Controller list override unchanged.

Supported conversion actions are Create GRN (Stock/Asset) and Create Bill
(General/Job). Each has a destination, source flag, guarded backend writer,
shared UI action and translated labels. Manual billing toggle is deliberately
unsupported because coverage is derived. No new destructive action or access
restriction. Existing authorization/catalog attributes were preserved; no
new permission API or security claim is made.

Root froze contracts and integrated progress/PO/UI/docs. Backend worker owned
Bill source persistence/API/writer and resources; frontend worker owned Bill
editor/model/client/translations. Disjoint ownership was preserved. Both
performed bounded read-only final audits; root fixed UI validation/duplicate/
dead-action findings and made malformed-status retention explicit.

## User guide and documentation gate

Updated `SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/purchase-documents-topics.ts`
and `bills-topic.ts`: topics /PurchaseOrder, /GoodsReceivedNote and /Bill.
Existing registration through record-list-topics and invoice-guide purchasing
group remains; reader route /UserGuide/vouchers-purchasing and current module
guide menu retained. English/Arabic steps cover approved prerequisites,
type-directed path, partial quantities, account choice, immutable source,
draft reservation and approval effects. Source conformance reviewed; visual,
RTL/theme, print and navigation acceptance remain owner verification.

Recipe generator initial Check passed. After BE18/UI7 promotion all eight
packets regenerated: PLAN-00 and PHASE-00 through PHASE-06. Immediate before/
after semantic comparison found only BE18 provenance hashes in all packets
and UI7 provenance hashes in PHASE-02/03/04. No instruction body, template,
dependency or approved reference changed in generated outputs. Final Check
passed all eight. Generated files were never edited directly.

## Verification and owner handoff

Source-reviewed exact DTO/API/client route parity, namespaces/imports, FK
mapper/write/approval continuity, source ownership, selected-subset edits,
capacity and downstream guards, calculated progress consumers, bilingual
keys and guide registration. Scoped git diff --check passed. Both resource
XML files parse, nine source-related keys exist in each, and no duplicate
resource names exist. Scoped merge-marker searches clean. New untracked
implementation files were read directly, not omitted from the diff review.

No builds, tests, lint, runtime, browser, database, migration, snapshot,
commit or push were run. Existing migrations/snapshot changes from other
work were preserved. Compiler, SQL translation/performance and concurrent
capacity execution remain unverified.

Required owner migration:

```powershell
Add-Migration AddBillPurchaseOrderLineSource
```

This adds a nullable source FK/index and Restrict relationship. Suggested
name checked absent in migrations. Existing records stay null; no destructive
copy/backfill/drop/nullability tightening. Review generated schema diff so it
contains this coherent change and intentional pending model changes only;
deploy schema before the new source queries run.

Owner acceptance: compile both applications after migration; try each PO type
from row and saved View; partial and exhausted quantities; saved edit subset;
two concurrent drafts; approve/unapprove/reject/delete/void; invalid/mixed/
duplicate source; branch/currency/job consistency; list/filter/export progress;
and verify no stock effect from direct General/Job bills.

Suggested separate commits (stage scoped hunks only; repositories already
contain unrelated pending work):

- Backend: `feat(purchasing): link direct bills to purchase order lines`
- Frontend: `feat(purchasing): create bills from general and job orders`
- Documentation: `docs(purchasing): define type-directed conversion rules`

Backend scope: Bill source partial/helper/VMs/entity/config/map/API/client
contract, BillService integrations, PO progress/service/map/VMs and matching
resources. Frontend scope: Bill editor/models/service, PO create-bill action
and detail/list models, corresponding EN/AR keys and guide topic changes.
Documentation scope: BE18/UI7, skill digest and generator-produced provenance;
local reviews/instruction-layer ownership remains as documented in AGENTS.
