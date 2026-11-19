| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Purchase Orders domain/API/UI handoff — 2026-10-20

## Manifest
Scope: PurchaseOrders/PurchaseOrder list/editor/services/models; directly related backend PO service/entity/config/VM/profile/controller, PO child read contracts, Job entry action, existing equipment embedded consumer, UserGuide invoice topic, EN/AR. Repositories clean at discovery. Root owns freeze/integration/editor/help; bounded non-overlapping workers may own backend and list/approval after this freeze. Source-only. UI type02; backend pattern2 (no financial posting). Canonical references: Workshop/Job list/editor shells, shared FilterPanel/DataTable/EditorTabs/FormSection/EditableRows/DocumentUploadTracker/SummaryCards; existing PO aggregate pattern; PR manual lifecycle only per owner instruction. Packets PLAN00 + PHASE00..06 passed -Check2026-10-20.

## Frozen contracts
Enums: POType GeneralPO0 StockPO1 AssetPO2 JobPO3. ApprovalStatus Approved0 NotApproved1 Rejected2; BillStatus existing values. Ordinary Create0/1/2; Job create3 with sourceJobId, typed header JobId; source Job exists, server rejects missing Job for3. Header Job optional for0/1/2 as current source. Header Date/Supplier/Branch required; supplierQuotationNo optional max100, Notes max1000. Line qty positive int32; unitPrice>=0 decimal storage18,2; supplier policy resolves tax; General/Job description required, optional vehicle/UOM/lineJob, Stock Item/UOM required, Asset AssetType required. Irrelevant draft controls retained but omitted from writes; no clearing on type switch. All supplied relevant references live/tenant-scoped. Full snapshot with owned child ids on update.

GET PurchaseOrder uses ListSmBase filters. Grid fields and exact lean ListVM properties side-by-side: Actions(identity/canEdit/canDelete); id/Id(number), no/No(text), poType/POType(enum), date/Date(date), approvedStatus/ApprovedStatus(status), billStatus/BillStatus(status), supplierQuotationNo/SupplierQuotationNo(text), supplierName/SupplierName(text), supplierCode/SupplierCode(text), branchName/BranchName(text), jobName/JobName(text), vehicles/Vehicles(text), masterAgreementNo/MasterAgreementNo(text existing Job.PONo compatibility), notes/Notes(text), totalAmount/TotalAmount(number), amountPlusTax/AmountPlusTax(number), discount/Discount(number), netAmount/NetAmount(number). Action-only canEdit/CanEdit and canDelete/CanDelete. No details/documents/tenant/audit payloads in ListVM.
Filters: no(text contains), supplierQuotationNo(text contains), branchId/supplierId/vehicleId/jobId(int), dateFrom/dateTo(calendar date inclusive), chassisNo(text contains header or live line vehicle), poType/approvedStatus/billStatus(enum including0), notes(text contains), discount(decimal), supplierName(text contains legacy field), search(text no/quotation/supplier name/code). Main6: no/date range/supplier/branch/type/approval; rest advanced. Current month default, shared current branch default, reset restores defaults. Count before page, allowlisted stable sorting, backend clamp1..100/page>=1; output fetchAllPages100 only for export/report. Keep search endpoint response for Equipment consumers.

Detail: numbered identity + poType/date/quotation/supplierId/name/branchId/name/jobId/name/notes/discount/approvedStatus/billStatus/documents/live details; add supplierCode, totalAmount, amountPlusTax, netAmount, canEdit/canDelete, equipmentQuotationId, purchaseRequestId and source no labels. Child id plus rendered existing labels, reference ids including unitsOfMeasuresId, qty/price/amount/tax/gross/job. Remove unused inherited audit/tenant/flags. Derived totals returned from persisted live lines. Writes omit status/bill/identity audit/totals. Keep equipmentQuotationId create-only. Update preserves source identities and existing PR source rules. No arbitrary source PR id accepted from ordinary Create.

GET{id}/approval -> Result<PurchaseOrderApprovalVM> {purchaseOrderId,no,supplierName,amount,approvalStatus,canApprove,canReject,history[{id,approvalStatus,statusDate,user}]}.
POST{id}/approval {approvalStatus} -> Result, pending->Approved/Rejected; real audit log atomic with status. Approve revalidates order readiness/references; reject blocked if billed/downstream use. Pending-only edits/deletes, fresh check under same existing ExecuteUniqueWriteAsync<PurchaseRequest> boundary as PO writers; concurrency token forced for child-only updates. Historical statuses retained, history empty unless a new real decision exists. No permission enforcement invented; endpoint catalogue View/ManageApproval. Failure preserves message +409 conflict, UI refresh/retry. One confirmation/mutation owner shared between PO list dialog and View approval tab; allowActions=false for Edit/unsaved context.

Actions: Create/View/Edit/Delete/Approval/Print/Export/Report Supported. Job source Create via same PO editor Supported; Vehicle Service POs selects JobPO filter. Save-and-print saves then opens persisted View all-section print. Cancel/dirty discard/upload cleanup use shared owners. CreateBill/CreateGRN/GenerateBills Missing accounting contract: outside implementation, no fake buttons; document explicitly. UnApprove Conflicting superseded by owner PR lifecycle. Workshop Job operational close/invoice actions Not Applicable to PO.

Routes: '' list, create data.mode=create, view/:id mode=view, edit/:id mode=edit; details/:id retained as view compatibility. Preserve query state on open/return. Existing embedded selector/inputs/closed boolean retained for equipment, forced Asset, parent owns dialog close guard integration. Root interceptor HttpClient only; no feature providers. One global loader for list/detail/save/action; auxiliary lookups local; explicit inline skip-error requests with apiErrorMessage; one mutation toast owner.

Schema: extend PO enum no column. ApprovedStatus private setter, existing historical values retained; DB default pending1/sentinel/concurrency. New PurchaseOrderApprovalLog EntityBase with FK/status/audit, restrict delete/index; no historical fabricated records. Suggested owner migration AddPurchaseOrderManualApproval. No migrations/snapshots modified.

## Pre-edit conformance
| Concern | Owning blocks | Actual reference/shared owner | Target |
|---|---|---|---|
| List shell/filter | UI1/3/4/6 | Job list template; FilterPanel stableLayout/reserved dates; DataTable fill/lazy | Replace disconnected local paging; no local shell CSS |
| Routed editor | UI1/13/14/15 | Job editor sigma-editor-form/pane; shared EditorTabs workspace; PR observed baseline only | Persistent typed form, full-height peer tabs, bounded fillHeight/sticky frame, fixed footer |
| Rows/validation | UI14/16/17/19/27 | EditableRows canMutate/freezeParent; shared QuantityInput/FieldError/date-utils | Type matrix enforced frontend/server; no any/private date parser |
| Documents | UI18 | DocumentUploadTracker/FileField/FileLink | Saved-file deletion after save, abandoned cleanup, retry-only after committed save |
| Totals/print | UI21/24 | SummaryCards slim/row/max80; ReportPrintService session | Authoritative View, preview edits; all saved sections mounted for print |
| Approval | Master4/BE12/14/UI7 | PR explicit manual decision; ConfirmationDialogService | terminal pending decision/history; source guards and no unapprove |

No shared reference modules modified except directly authorized Job entry action; shared library owners reused. Final reconciliation must compare actual producers/consumers, DTO properties, filters, route/mode/embedded contracts, all writes and schema impacts.

## Source reconciliation amendment — master agreement reference

Root source audit rejected legacy mapping `MasterAgreementNo = Job.PONo`: Job.PONo is a PO reference, not a proven master agreement. Existing named field/column and equipment search compatibility key remain, but return empty and are not sortable until a true source relationship exists. Job number remains independently displayed. Owner standing rule: values with no valid source stay empty; rejected alternative was presenting a different reference under the screenshot label. This supersedes the earlier compatibility mapping row without rewriting its historical freeze.

## Owner continuation and final reconciliation amendment

The later explicit owner request added GRN implementation and screenshots. It supersedes the earlier CreateGRN-out-of-scope row: eligible Approved Stock/Asset POs now expose CanCreateGrn and navigate into the frozen GRN source draft; General/Job do not. See GRN_CONTRACT_FREEZE.md and PURCHASE_ORDERS_FULL_STACK_REVIEW.md. CreateBill/GenerateBills and GRN Journal still lack an owning accounting conversion/posting source and were not fabricated. Root also verified historical numeric/type/date readiness on a detached calculation before approval; the decision does not recalculate persisted PO totals. Manual approval regulations remain deferred as requested.

## Owner clarification — Workshop type in Create PO (2026-10-20)

Owner confirms that Workshop creates this PO type from Job only; Purchase Orders displays the resulting record and continues its lifecycle. Ordinary Create PO therefore presents General/Stock/Asset only, with no disabled fourth radio. Saved/source-bound records display their actual type as a fixed translated value, including JobPO, without changing its enum/source link. Existing Job-origin entry, list filter/details and manual approvals remain. This is a UI presentation clarification; no new producer/API or backend contract change in this follow-up.
