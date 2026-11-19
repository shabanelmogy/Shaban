| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Purchase Request approval preparation and partial purchase orders

Date: 2026-10-18. Owner requests preliminary Approval Cycle presentation, real Create PO action, multiple partial POs up to each remaining line quantity, and automatic proportional allocation of the PR discount. This dated decision supersedes the earlier Create PO deferral in PURCHASE_REQUESTS_CONTRACT_FREEZE.md; the earlier freeze remains historical.

## Inventory, impact and decisions

| Concern | Existing owner | Decision / target |
|---|---|---|
| PR list/editor | PurchaseRequest list and routed details | Extend existing actions; add Approval Cycle tab. Preserve filters, tabs, documents, print and shared geometry. |
| Approval | List-only empty history; no persisted approval cycle | Reuse one feature approval presentation in list dialog and editor tab. Explicit configuration-pending state; no synthetic approvals, new access restriction or approval gate. |
| PO creation | PurchaseOrderService; legacy editor only supports new Asset PO | Extend existing service with a focused PR conversion command; create PO through a typed action dialog, not a second general PO editor. General/Stock/Asset map to corresponding PO types. |
| Source relationship | No PR/PO relationship | Create nullable PO.PurchaseRequestId and PODetail.PurchaseRequestDetailId with Restrict FKs and tenant/source indexes. Existing rows stay null; no inferred backfill. |
| Quantity | No consumed quantity record | Live linked PO lines with live parents consume PR quantities, including unapproved POs. Soft deletion releases quantities. Multiple POs allowed. All checks and saves share existing tenant-scoped PurchaseRequest ExecuteUniqueWriteAsync boundary. |
| Discount | PR absolute discount; PO absolute discount | Owner explicitly chose automatic proportional distribution. Command does not accept discount. Existing PO rounding is 2 decimals. |
| Generic writers | PO generic Update maps child graph; bulk paths can bypass feature validation | Reconcile owned linked lines, preserve source links, validate ownership/capacity and recalculate discount for the edited order; cover direct child writers and batch paths. Do not silently change other POs. |
| PR edits/deletion | Existing ItemRequisition edit lock; dependency-aware removal | While live linked POs exist, preserve the monetary basis and source identities (supplier, type, discount, line membership, quantity, price and line reference IDs). Header notes/date/quotation/branch remain editable for otherwise editable PRs. Reject protected changes with a translated explanation. Block PR deletion while linked orders exist. |
| Reports/accounting | Existing PO readers consume PO saved values | Preserve existing PO reporting/numbering/tax owners. Conversion creates no journal or inventory movement. |
| Security | Existing authenticated tenant Repository and permission catalogue; enforcement deferred by owner | Resolve source and FKs through tenant-scoped Repository. Catalogue custom CreatePurchaseOrder operation; do not claim enforcement or resume deferred tenant login work. |

Alternatives: navigating to the legacy PO draft would require unrelated General/Stock editor reconstruction and would not protect source quantities; rejected. One-PO-per-PR is rejected by explicit owner direction. Manual discount is rejected by owner choice. Existing shared locking is extended rather than adding a new lock service.

## Frozen API and money contract

- `GET PurchaseRequest/{id}/purchase-order-draft` -> `Result<PurchaseRequestPurchaseOrderDraftVM>`.
- Draft properties: `purchaseRequestId`, `no`, `purchaseRequestType`, `supplierId`, `supplierName`, `branchId`, `branchName`, `totalAmount`, `discount`, `orderedAmount`, `allocatedDiscount`, `moneyDecimalPlaces` (= existing PO scale 2), `taxRatePercent`, `lines`.
- Each line: `purchaseRequestDetailId`, `description`, `itemName`, `assetTypeName`, `vehicleName`, `unitName`, `jobNo`, `requestedQuantity`, `orderedQuantity`, `remainingQuantity`, `unitPrice`.
- `POST PurchaseRequest/{id}/purchase-orders` body `{date, branchId, lines:[{purchaseRequestDetailId, quantity}]}` -> standard `Result` with created PO id. Date required, live branch required; at least one distinct source line, integer quantity >=1 and <= fresh remaining. Supplier, type, quotations/notes, prices, identities, source links, status and discount are server owned. Do not copy file ownership.
- PR list and detail gain only the genuinely consumed `canCreatePurchaseOrder` action flag. Existing `canEdit` retains its requisition rule.
- PR detail additionally exposes `hasPurchaseOrders`, consumed to disable protected pricing/source controls before Save and explain their state. Descriptions remain editable (including correcting old descriptions exceeding PO's 1,000-character boundary). The lean list does not carry this unused detail flag.
- Source line amounts use requested quantity times saved unit price at PO 2-decimal precision. Remaining is per source detail, not a document count or matching text. Null/zero PR quantities have no remaining capacity.
- Let D be source discount rounded to PO scale, T the complete source pre-tax amount, E the amount consumed by other live linked POs, A their saved discount sum, and N the new/edited order's source amount. Allocation = clamp(round(D * (E + N) / T) - A, 0, D - A). When every positive source quantity is consumed, use exactly D - A. T=0 allows only D=0; negative discount or D>T is rejected. This cumulative method carries rounding and never allocates more than D, even after deletion/recreation. Preview uses the same formula; only server result is authoritative.
- Source-linked PO updates preserve source supplier/type/unit prices/line references; reconcile quantities with capacity excluding this PO and recalculate this PO's allocation. Missing source-linked rows release their quantities. Standalone manual rows cannot manufacture source links. Reject malformed/foreign IDs before mutation. No changes to another saved order's discount.
- Source-linked child mutation endpoints must use the same guarded aggregate owner or reject with a translated parent-edit message, including list variants; no generic bypass.
- Source and linked PO writes/deletes use PurchaseRequest lock; PR's existing outer ItemRequisition lock ordering is retained. Fresh query and one graph save occur inside the lock transaction. Existing numbering/audit stamping stays the Repository's responsibility.

## UI and conformance

| Concern | Owning books / approved reference | Target / shared owner |
|---|---|---|
| Routed editor | UI screen02; existing frozen PR / Job editor | Existing EditorTabs and FormSection; Approval tab owns no form fields; print remains saved request sections. |
| Typed conversion | UI screen09, UI7/13/14/16/17/19/22/28; Workshop/Job/components/close-job | Existing EditorDialog, FieldError, StateMessage, EditableCollectionTable, date helpers, form-state freeze and ConfirmationDialogService. Date/branch editable, requested/ordered/remaining read-only, create quantity editable, automatic discount read-only. |
| List action | UI7; existing PR list | Create PO visible from backend canCreatePurchaseOrder; opening performs only reads; successful create refreshes same applied query/page. |
| Backend | BE1/2/3/5/6/8/14; existing PR aggregate, PO service, IndividualPartner reconciliation and ItemRequisition conversion | Pattern2 master-detail with no journal. Owned-child checks, tenant-scoped references, existing exclusive write helper. |

Action coverage: View/Edit/Print/Delete retained; Approval Details becomes Approval Cycle context; Create PO now supported. Approve/Reject/settings are deliberately deferred by owner; no stock issue, receipt, payment or posting action belongs to this command. Failure has one inline owner via skip-error header; success uses global mutation feedback. Dirty close confirms, in-flight save prevents close/double submit, destroy cancels reads.

## Implementation and verification boundary

Apply PHASE00/01 then bounded backend and frontend PHASE03/04 streams, root integration05/reconciliation06. Recipe drift check passed all 8 packets 2026-10-18. No build, test, lint, database, browser or migration command is authorized. Source diff, syntax-only parsing and contract comparison only. Owner must create/run a migration for nullable links/indexes, deploy backend before frontend, then verify full/partial/exhausted/concurrent creates, discount cents/deletion/edit cases, all three types, tenant boundaries, approval pending state, responsive/RTL/theme and existing PO consumers. The new migration is not created here.

No reusable cross-feature policy is introduced; approval context and conversion composition are feature-specific and reuse existing shared controls. Final source conformance and review will be appended here.

## Source reconciliation — 2026-10-18

Implemented frozen contract in both repositories. Backend adds 2 nullable source FKs and 2 tenant/source indexes; no unique PR constraint (multiple partial POs are required). No migration, snapshot or data backfill was created. Owner migration name: `AddPurchaseRequestPurchaseOrderLinks`. Existing records have null source links and retain their workflows.

### Final producer/consumer evidence

| Concern | Producer | Consumer / compared behavior | Source result |
|---|---|---|---|
| Typed action | PurchaseRequestController.PurchaseOrderDraftAsync/CreatePurchaseOrderAsync; IPurchaseOrderService draft/create methods | PurchaseRequestService.getPurchaseOrderDraft/createPurchaseOrder; models/purchase-order.ts | Matching routes, line ids, positive integer POST quantities, date/branch only, Result envelope and created id. |
| Partial capacity | PurchaseOrderService.ReservationsAsync/WithinCapacity/SourceLines | Draft requested/ordered/remaining columns; PR RequestsWithRemainingCapacity -> row/view action | Live linked parent+lines counted; completed requests hide Create PO. Zero quantities are skipped in the command. |
| Discount | PurchaseOrder.AllocatePurchaseRequestDiscount | CreatePurchaseOrderComponent.totals -> read-only summary | Same cumulative proportional formula at PO scale2, capped remaining discount and exact final balance; UI preview only. |
| VAT | ITaxPolicyService.GetSupplierRatePercentAsync and PurchaseOrder.RecalculatePurchaseRequestLines | Draft taxRatePercent -> shared documentTax preview | Supplier policy and once-rounded document VAT; original PR stored tax amount never used as a PO rate. |
| Source protection | PrepareUpdateAsync live-order check and saved price/tax retention | Detail HasPurchaseOrders -> enableEditableFields | Type/supplier/discount/row identities/quantity/price protected. Description/header/documents remain editable. |
| PO writes | UpdateOrdersAsync, OwnsAll and ReconcileOwned | Existing PO update and bulk consumers | Every snapshot validates before tracked mutation; retained source links survive; foreign/sibling child ids rejected; combined batch capacity checked. |
| Read compatibility | PR detail projections; PO ReadDetailAsync for both endpoints; PO profile live-child filtering | Existing deep-endpoint editors and PO list/search consumers | New source navigations do not trigger recursive source graph reads in those editors; deleted lines omitted from returned collections/totals. |
| Concurrency/deletion | Existing ExecuteUniqueWriteAsync<PurchaseRequest> transaction/app lock, PR outer ItemRequisition ordering, RemoveWithChildrenAsync + EF dependency metadata | Create, PR update/delete, PO update/bulk/delete/status operations | Same source lock surrounds check/save; soft-deleted orders release reservations; live linked orders block PR removal. Generic activation changes only IsActive and never releases reservations. |
| Approval preparation | PurchaseRequestApprovalCycleComponent | Existing list dialog and editor Approval tab | One feature presentation, real request context, pending explanation, empty history. No invented approvers or approve/reject mutation. |
| Shared shell/scroll | EditorDialog 1120x670 with viewport bounds; sigma-editor-form/pane; EditableCollectionTable.fillHeight/stickyHeader | Conversion form and line table | Context capped45%; table owns vertical/horizontal row scroll; totals/footer outside row scroll. No feature palette or deep shared selectors. |
| Failure/recovery | Inline skip-error HTTP options, Result/HTTP error branches, freezeFormState, confirmDiscard | Conversion load/save/refresh/close plus route canDeactivate in list/editor | One error owner and global mutation success owner; no double submit or close during save; failed Save retains date/branch/quantities; capacity refresh retains draft and updates validators. |
| Help/translations | Existing UserGuide purchase-requests-topic.ts; matching EN/AR vocab and backend resource keys | Existing `/UserGuide/invoice` reader | Guide now explains partial example10/4/6, automatic discount, source protection, approval deferral and conflict recovery. |

Selected description >1,000 characters is rejected with bilingual guidance because target PO lines have that existing limit. No truncation occurs. PR descriptions remain editable to repair historical long values. Legacy standalone PO create UI remains Asset-only; this feature's focused conversion supports all three types without changing that separate create workflow. Existing PO saved read supports all three types.

### Override audit

PR retains aggregate Add/AddList, validation/reconciliation UpdateCore and list/search ownership. Update/UpdateList/Remove extend their existing source writer boundary with the PR lock. DetailWithNavigations now projects consumed labels/action flags without source graph recursion. PO Update/UpdateList reconcile source links and check combined capacity; Remove and approval/bill mutations take the same source lock to prevent stale scalar writes. PO DetailWithNavigations projects live children without recursive PR graphs; its existing Detail path shares that projection. No independent PR-detail/PO-detail service or controller exists; generic Add/AddList DTOs have neither child Id nor source link fields. No source relationship can be fabricated through those write DTOs.

### Responsive/source matrix

| Interval / context | Expected source behavior | Acceptance |
|---|---|---|
| >1099px | Dialog1120px bounded by viewport; 4 context tracks, equal summary cards,1010px table minimum with internal scroll | Owner visual pending |
| 1024–1099px | Shared94vw dialog; context tracks remain4, table scrolls inside frame | Owner visual pending |
| 700–1023px | Shared field grid2 columns; bounded context scroll and table retain separate regions | Owner visual pending |
| <700px | Single context column, viewport-bounded dialog; context capped45%, row horizontal/vertical scroll | Owner visual pending |
| Short height / long EN-AR / RTL / themes | Shared viewport max-height, logical block cap, shared controls/labels/table alignment and title wrapping | Owner visual pending |

Verification: root reviewed scoped frontend and backend diffs separately, including new files. Source-only parsing found zero syntax diagnostics across20 TypeScript/templates; backend worker parsed16 changed/new C# files with Roslyn5.0 and reparsed the2 final PO read changes; both backend resource XML files parse without duplicate keys. Frontend/backend whitespace checks passed (Git line-ending notices only). Matching EN/AR keys and DTO fields were compared in source. No builds/tests/lint/browser/database/migration/Git writes/deployment ran; no runtime or EF-translation success is claimed.

Shared-extraction result: extracted PR approval context and one PR conversion component used by both list and View. Existing global shell/table/date/money/error/dirty-state owners were reused. These are feature-specific business compositions; no new cross-feature pattern or canonical book/skill rule was established. Generated books/skill/packets were not edited. Applicable packets: PLAN00, PHASE00/01/03/04/05/06; recipe check passed all8 before packet use.

Owner verification pending: migration and deployment; compile; GET/POST replay for General/Stock/Asset; full/partial/multiple/exhausted sources; same-tenant and foreign-tenant ids; simultaneous create and PR/PO edit/delete; supplier optional/registered tax; rounding and deleted/recreated/edited order allocations; target description limit; retained drafts/close/back; linked-delete dependencies; PO list/read/search after removing a row; all responsive intervals/RTL/themes. No permission enforcement or tenant login work was resumed.

Suggested independent commits (not created): backend `feat(purchasing): create partial purchase orders from requests`; frontend `feat(purchase-requests): add approval tab and partial PO action`.

Final frontend source recheck after integration:20 TS/templates, zero syntax diagnostics;122 purchaseRequest vocabulary leaves in each EN/AR file with zero key differences. Final whitespace checks succeeded separately in both repositories. No further source edits after these checks.

## Subsequent owner decision — manual approval activation

Later2026-10-18 the owner requested live manual approval now and explicitly chose terminal Approve/Reject, request edit lock after a decision and Create PO only after approval. This supersedes this artifact's earlier approval-only placeholder/ungated conversion contract. Current frozen contract and source reconciliation: [PURCHASE_REQUEST_MANUAL_APPROVAL_2026-10-18.md](<PURCHASE_REQUEST_MANUAL_APPROVAL_2026-10-18.md>). Partial capacity and automatic discount allocation remain; approval roles/permissions/configured levels remain deferred. Owner approval-state/log migration is now required as well. Historical sections above describe the earlier implementation point.
