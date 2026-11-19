# Equipment Rental — domain and API contract

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-27 |
| Authority | Owner decisions recorded in EQUIPMENT_RENTAL_MAINTENANCE_EVOLUTION_PLAN.md, Slices A and B; canonical Master4/5/7, UI2/7/13/14/22/29, BE2/7/8/9/15 |
| Boundary | Actual unit rental operations through a priced invoice draft. Accounting approval/posting/void/settlement and final agreement closure are not frozen |

This is the consolidated handoff of the previously frozen slices, including the owner's final pricing answer. It supersedes the historical read-only manifest and the plan's earlier Missing pricing rows only for the decisions explicitly resolved below. It does not authorize database execution.

## Decisions and evidence

| Concern | Frozen choice | Evidence / reason |
|---|---|---|
| Screenshot | Approved master list and same-customer sale-order linking; issue/expiry/amount remain source-owned | Capture.PNG. No dispatch or billing rule is proved by that dialog |
| UI / backend shapes | Quotation and MasterAgreement routed type02, operational aggregate pattern2. Delivery and TimeSheet controlled type01 dialogs. Billing is a bounded preview/action dialog; generated invoice is read-only in existing invoice dialog | UI13; actual active routes. Reuse Workshop/Job list/editor and shared EditorDialog, EditableCollectionTable, EditableRows, DocumentApprovalCycle. Branch and PurchaseOrder backend patterns are references only |
| Equipment | One actual serialized unit per DeliveryNote; multiple notes per agreement. Rates identify actual units | Existing DeliveryNote.EquipmentId and EquipmentMasterAgreement owner; minimal extension avoids a second register or unsupported multi-unit document |
| Rate | One live rate per agreement/equipment; Day=0, Week=1, Month=2, Hour=3. Positive decimal(18,2), max 200 rates, unique equipment. Empty draft allowed, approval requires rates | Owner accepts stored agreement rates and both pricing modes; minimal source-supported tariff |
| Child write | Full snapshot; saved rate Id retained and checked against live tenant agreement; omitted saved rows removed; new rows omit Id | Master4 child contract, explicit reconciliation; IDs are child identity rather than arbitrary client-owned keys |
| Customer | Partner Individual/Company, consistently across agreement/delivery/sheet/invoice | Existing customer option producer and owner disposable-data clarification; legacy TimeSheet.Customer navigation was a different principal |
| Dispatch | Approved open agreement, same Partner and a rate for the selected equipment; real branch and available equipment rechecked at write | Existing relational sources and SalesAgreement availability contract |
| Dates | Document dates are administrative. Actual delivery/return cannot be future; return >= actual delivery. Explicit invoicing start requires delivery and lies between delivery/return. Work interval lies within custody; paperwork may be later | Actual facts versus document dates; owner physical-return cutoff |
| Reservation | Preserve dated prepared-note reservation and prevent two current unreturned dated notes for a unit under shared tenant SalesAgreement lock | Existing SalesAgreement writer contract; status strings are not transition authority |
| Timesheet | Pending/Approved only. Approval rechecks live relationship, completed work and nonnegative net HoursToInvoice. Unapprove requires reason <=500; approved or billed sheets cannot edit/delete; billed cannot unapprove | Owner approved-hours model; append-only model decision log. No inferred clock/meter conversion |
| Hour billing | Sum whole approved unbilled sheets fully contained in selected dates; crossing sheet fails. Net hours are used once, without adding overtime or subtracting breaks again | Explicit owner answer. Distinct sheets may share dates; approver owns net work validation. The server prevents reusing the same sheet, not guessing shift identity |
| Duration billing | Inclusive calendar dates; actual days; weeks=days/7; anniversary months anchored to original invoicing start, with actual cycle-day proration | Explicit owner answer. Half-open calculation end is ToDate+1 day; original anchor.AddMonths(n) avoids month-end drift |
| Cutoff | From >= explicit start and actual dispatch; To <= today and physical return if returned, inclusive | Owner chooses physical return; billing before return is allowed through today |
| Currency/tax | Agreement approval snapshots customer billing currency or base currency and tax-inclusive interpretation. Billing re-reads current authoritative tax policy and customer exemption, snapshots applied percent and derived amounts. Currency precision must be integer 0..2 within existing monetary storage | Reuse existing policy owners; no new financial-policy cache or universal currency change |
| Preview/generate | Server preparation shared. Generate recomputes and compares preview token under writer lock; no submitted quantity/rate/tax/amount is trusted | Stale preview and duplicate prevention. Token is an equality fingerprint, not authorization |
| Duplicate coverage | Any live duration draft reserves overlapping delivery dates. Hour drafts reserve sheet IDs. Soft deletion of an unlocked unposted invoice releases coverage | Explicit minimal correction path; drafts already reserve so repeated Generate cannot double bill |
| Generated draft | One delivery, currency, quantity, contract-rate and tax snapshots. Source links and amounts read-only. No ledger writer, automatic invoice approval or payment | Financial lifecycle remains a material separate decision; inheritance alone does not define a posting contract |
| Downstream edits | Billed delivery cannot change source/unit/customer/actual-delivery/billing-start; return cannot precede billed work. Existing sheets protect their work bounds. Linked SO cannot change customer or be deleted while linked | Historical integrity, fresh backend guard |
| Permissions | Existing AuthGuard/API authentication only. No invented role API | Current application contract; hidden actions are not authorization |

## API and write ownership

All paths are relative to the existing configured API base and keep Result / Results wrappers. Existing CRUD paths, response Id and paging metadata remain compatible.

| Owner | Reads | Writes / fields |
|---|---|---|
| Quotation | GET list; GET GetByWithNavigationsId/{id}; existing GetSelect | Existing POST/PUT/DELETE and six approval actions. No new pricing/approval axis. Live PO/MA references guard edit/delete/revise/unapprove |
| EquipmentMasterAgreement | GET list; GET {id}; GET {id}/sale-orders | Existing POST/PUT plus Rates[{id?,equipmentId,unit,rate}], existing dates/customer/quote/PO/notes; POST {id}/approve; PUT {id}/sale-orders with full selection. Currency, approval and totals never accepted from edit payload |
| DeliveryNote | GET list; GET {id}; GET OperationalSources (available units + approved open agreements + priced EquipmentIds) | Existing POST/PUT, source IDs, branch, document and actual dates, existing type/status/ownership/operator/PO/optional note number. Customer is derived in UI and checked server-side; agreement/plate/chassis labels derive server-side. Compatibility strings remain accepted but are overwritten |
| TimeSheet | GET list/detail; GET {id}/approval | Existing POST/PUT time inputs and exact delivery/customer/agreement triple. POST {id}/decision {approvalStatus,reason?}. Approval and billed link excluded from write DTOs |
| EquipmentRentalInvoice | GET list/detail | POST preview {deliveryId,fromDate,toDate}; POST generate same + previewToken. No supplied financial result. Existing legacy metadata CRUD compatibility retained; generated Update refused, Delete has settlement/posted guards |

Quotation -> SalesAgreement -> EquipmentMasterAgreement is the consistent agreement lock order. Delivery, TimeSheet approval/write and invoice generation use SalesAgreement. Invoice Update/Delete also take JournalVoucherAllocation after SalesAgreement. SO Update/Delete take EquipmentMasterAgreement. Shared ExecuteUniqueWriteAsync owns tenant application locks and the outer transaction; nested calls share that transaction. Generating an hourly invoice saves its identity then source-sheet associations inside that transaction. No EF parallel calls on one context.

The PurchaseOrder writer is a separately approved reference and still does not participate in the Quotation lock. Sequential live dependency guards are implemented; the concurrent PO creation versus quotation reversal race is not claimed solved.

## Grid / ListVM comparison

Actions precede the data columns. Property names below correspond camelCase frontend to PascalCase backend. Inherited ListBaseVm metadata remains a shared compatibility surface; no feature-only editor fields are added for convenience.

| Screen | Exact grid data field order (type if non-text) | Backend fields / action needs |
|---|---|---|
| Quotation | no, quotationType, date(date), contactName, customerCode, internalApproval(status), customerApproval(status) | No, QuotationType, Date, ContactName, CustomerCode, InternalApproval, CustomerApproval; Id; CanEdit/Delete/ApproveInternally/RejectInternally/ApproveByCustomer/RejectByCustomer/Revise/Unapprove/CreatePurchaseOrder, HasPurchaseOrders |
| MasterAgreement | approvalStatus(status), masterAgreementNo, date(date), customerName, customerCode, quotationNo, po, createdBy, createdAt(dateTime) | ApprovalStatus, No (UI fallback Id), Date, CustomerName/Code, QuotationNo, PO, CreatedBy/At; Id. Existing QuotationRefNo remains the source-compatible alias. Removed unused StartDate, EndDate, CustomerId, QuotationId |
| DeliveryNote | deliveryNoteNo, masterAgreementNo, plateNo, customerName, customerCode, deliveryNoteDate(date), deliveryDate(date), returnDate(date), invoicingStartDate(date), status(status), branchName | Same scalar fields, Id. Billing visibility uses actual delivery/start. Removed Type/PONo/Ownership/OperatorProvidedBy from ListVM; these remain filters/detail |
| TimeSheet | approvalStatus(status), isBilled(status), id(number), date(date), dateRangeStart(date), dateRangeEnd(date), deliveryId(number), customerId(number), masterAgreementId(number), hoursToInvoice(number), breakHours(number), startHM(number), endingHM(number), operatorOvertimeHours(number) | Same fields. ApprovalStatus/IsBilled are displayed/action state, derived only on server |
| Invoice | id(number), masterAgreementNo, deliveryNoteNo, equipmentDetail, startDate(date), invoicingRule, totalAmount(money), currencyCode, period | Same scalar fields plus DeliveryNoteId to hide generated edit. Currency shown with totals; legacy null currency is resolved in detail through existing base-currency fallback |

## Filters and paging

| Screen | UI -> serialized Filters[key] -> backend | Parsing / defaults |
|---|---|---|
| Quotation | quotationNo, partnerId, branchId, dateFrom, dateTo, internalApproval, customerApproval; grid, sortField, sortOrder | Trimmed Contains; positive reference integers; DateOnly inclusive range; defined enum values including numeric zero; current month default |
| MasterAgreement | masterAgreementNo, approvalStatus, quotationRefNo, po, fromDate, toDate, customerId; datesCleared, grid, sortField, sortOrder | Existing aliases preserved; date range/current month vs explicit cleared range retained |
| DeliveryNote | deliveryNoteNo, masterAgreementNo, branchId, plateNo (also chassis), fromDate, toDate, type, status, customerId, poNo, ownership, operatorProvidedBy; grid/sort | Existing text/exact/reference/date semantics; current month reset; operational date fallback retained |
| TimeSheet | date, dateRangeStart, dateRangeEnd, deliveryId, customerId, masterAgreementId, hoursToInvoice, breakHours, startHM, endingHM, operatorOvertimeHours; grid/sort | Exact dates and integer quantities, empty omitted. Existing signed integer contract retained |
| Invoice | masterAgreementNo, deliveryNoteNo, equipmentDetail, startDate, invoicingRule, period; grid/sort | Existing generic text Contains/date equality; empty omitted |

Lists apply filters/grid before count, clamp page size, use deterministic ordering and response page metadata. All-page exports retain applied filters and complete page iteration. No client-side filtering of one page is substituted for server filtering. Shared grid membership accepts int or nullable int ListVM identity; the owning BE9 rule and skill have been updated.

## Reference actions / state and recovery

| Reference action category | Supported slice | Unsupported / reason |
|---|---|---|
| List Search/Reset/Refresh/page/sort/filter/Excel | All five existing owners | No invented import |
| Create/View/Edit/Delete | Q/MA as actual states allow; Delivery Create/View/Edit; TimeSheet pending-unbilled write/delete; generated invoice View/Delete only | Delivery Delete not newly exposed; no generic action copied just because reference has it |
| Approval cycle | Existing two Q axes, existing MA approve, new model TimeSheet approve/unapprove with history/reason | No Reject for TimeSheet; no invoice approval/post/void until its financial contract freezes |
| Child rows | Q existing rows, MA prices and SO full snapshot | No duplicate rate/transport/dispatch editor framework |
| Log/upload/report | TimeSheet existing print report; decision history for TimeSheet | No generic document log/file-upload action is inferred; signatures/inspection/transport charges remain later contracts |

Dirty edits use the shared discard confirmation and freeze while saving/deciding. Modal reads have local loading/error/Retry. Writes hold the existing navigation write safety. Failures preserve inputs. Standard mutation toast owns ordinary Save/Approve/Delete success; billing generation suppresses that toast because its result panel owns success/navigation. Preview is marked a navigation read, is not a write, and suppresses success toast. In-band and HTTP failures are both handled by the component.

## Target C implementation freeze — owner instruction 2026-10-27

Owner requested implementation of the recommended agreement -> rental order -> delivery cycle. This amendment freezes the minimal source-supported operational slice below; A/B billing and financial exclusions remain. No database reset, migration execution, posting or permission change is authorized.

### Domain and persistence

- Extend existing SaleOrder owner; generic legacy sales orders are preserved. Add IsEquipmentRentalOrder=false discriminator, RentalStatus (Draft=0, Confirmed=1, Cancelled=2), nullable RentalStartDate/RentalEndDate and DeliverySite<=500. Existing IssueDate is the administrative date; RefNo<=100 is the optional customer PO/reference. For new equipment orders set compatibility ExpiryDate to planned EndDate, CurrencyId to the approved agreement currency, customer/agreement to its actual sources. No estimated amount is invented for unknown hourly work.
- Extend SaleOrderItem with nullable EquipmentAgreementRateId/restrictive navigation and IsRentalCancelled=false. One line is one actual priced unit, quantity one. Rental line description derives from the equipment (truncated to existing 100 limit); generic financial Amount/TaxRate remain null, not fake earned revenue. Approved agreement prices remain the source; no per-order price edit.
- Rental order action history uses its own EntityBase child with SaleOrderId, Action<=30, Reason<=500 and standard audit. Confirm and CancelRemainder append history. No general permission/approval system is inferred.
- DeliveryNote adds nullable SaleOrderItemId/restrictive navigation. New notes require a confirmed noncancelled rental line matching live tenant/agreement/customer/unit/rate. Exactly one live note per order line, including returned notes. Soft-deleted prepared notes can be replaced. Existing unlinked notes remain legacy-readable/editable for dates, but their source tuple cannot be changed or silently assigned to an arbitrary order.
- Add declarative live unique indexes: SaleOrderItem(SubscriptionId,SaleOrderId,EquipmentAgreementRateId) filter IsDeleted=0 AND EquipmentAgreementRateId IS NOT NULL; DeliveryNote(SubscriptionId,SaleOrderItemId) filter IsDeleted=0 AND SaleOrderItemId IS NOT NULL. No migrations/snapshot changes by agents.

### Actions and lifecycle

- Draft can edit full snapshot (1..200 unique rate lines, saved child IDs owned by this order); cancellation requires nonblank reason<=500. Confirm rechecks approved open agreement, valid currency, live customer/branch/rates, ordered nondefault planned dates within agreement dates. Future planned dates are allowed; they are not actual custody.
- Confirmed order is immutable; correction cancels unexecuted remainder and creates a new order, preserving dispatch/work history. No reopen/amendment/financial approval is invented.
- CancelRemainder cancels lines without actual dispatch. Any prepared undelivered note on those lines is soft-deleted only after batched checks prove no live work sheets/invoices; actual delivered lines and notes stay. If all lines are cancelled, header becomes Cancelled; otherwise remains Confirmed. Cancellation after dispatch never shortens actual rental or stops charges.
- Generic SO Update/UpdateList/Delete reject typed rental orders, requiring the scoped actions. Legacy association GET/options exclude typed rental orders; its PUT cannot link/unlink them. Their agreement origin is immutable.
- Rental actions lock SalesAgreement then EquipmentMasterAgreement, compatible with MasterAgreement's Quotation -> SalesAgreement -> EquipmentMasterAgreement order. Delivery writes and cancellation share SalesAgreement, so duplicate preparation/dispatch cannot race with cancellation. No order confirmation alone reserves future interval capacity; existing dated-note reservation starts on preparation. Existing current-availability recheck remains authoritative.
- Fulfillment counts are independent: requested, prepared, actually delivered, physically returned, cancelled. Prepared count includes every live note; delivered requires DeliveryDate; returned requires delivery and ReturnDate. Never infer paid/posted status or divide monetary amounts for fulfillment.

### Exact scoped API contract

All paths below are relative to API base; retain Result/Results and paging metadata. New service methods belong to SaleOrderService partial, not a parallel aggregate service.

| Method/path | Payload/result |
|---|---|
| GET SaleOrder/equipment-rental | ListSmBase; filters agreementId/status/no plus grid/sortField/sortOrder. Result rows: id,no,agreementId,agreementNo,customerName,site,startDate,endDate,status,requestedCount,preparedCount,deliveredCount,returnedCount,cancelledCount. Filter/count/page server-side, default/max 10/200, stable Id tie break |
| GET SaleOrder/equipment-rental/sources?agreementId=N | Result {agreementId,agreementNo,customerName,customerCode,currencyCode,startDate,endDate,rates:[{id,equipmentId,equipmentLabel,unit,rate}]} from approved open agreement, finite direct operational read |
| GET SaleOrder/equipment-rental/{id} | Detail: list fields plus branchId,branchName,issueDate,refNo,currencyCode, lines:[{id,equipmentAgreementRateId,equipmentId,equipmentLabel,unit,rate,isCancelled,deliveryId,deliveryNo,deliveryDate,returnDate}], history:[{id,action,reason,createdAt,createdBy}] |
| POST SaleOrder/equipment-rental | {masterAgreementId,issueDate,startDate,endDate,branchId,refNo?,site,lines:[{id?,equipmentAgreementRateId}]}; source-derived fields excluded. New lines omit Id |
| PUT SaleOrder/equipment-rental/{id} | Same full snapshot; draft only, fixed agreement/customer; missing saved lines removed, foreign/duplicate IDs rejected |
| POST SaleOrder/equipment-rental/{id}/confirm | No body; fresh validations and append-only history |
| POST SaleOrder/equipment-rental/{id}/cancel-remainder | {reason}; cancels only not-actually-dispatched lines and safe prepared notes; history mandatory |
| GET DeliveryNote/OperationalSources?orderLineId=N | Extend existing result with saleOrderItemId,saleOrderId,saleOrderNo,branchId,site; restrict choices to that confirmed line. Saved note detail adds saleOrderItemId,saleOrderId,saleOrderNo,site. Existing no-line sources remain only for legacy detail/edit, never new creation |
| Existing DeliveryNote POST/PUT | Adds saleOrderItemId to input; backend derives/checks agreement/customer/equipment/branch/site context, guards duplicate and immutable provenance; existing date, work and billing protections stay |

### UI and ownership handoff

- New EquipmentRentalOrder list and routed create/view/edit type02 because the aggregate has lines, action history and stateful fulfillment; backend pattern2. Reuse Workshop/Job canonical list/editor and shared shell/DataTable/EditableCollectionTable/EditableRows/confirmation/reason EditorDialog; no new wrappers or styles. No delete action: reasoned cancellation preserves history.
- Routes /EquipmentRentalOrder, /create?agreementId=N, /view/:id, /edit/:id. New creation starts from approved agreement. Global list has a clear link back to agreements if no agreement context. MasterAgreement approved row gains Rental Orders and Create Rental Order; keep legacy SO association separately labelled as legacy commercial links.
- List data columns match API row fields above except id/agreementId remain action/context identities. Filter no, numeric agreementId and status; applied route/page/sort and complete export. Detail renders terms, one unit per line, source rates readonly, action history; confirm uses shared confirmation, cancel uses typed reason<=500 form and dirty protection.
- Per confirmed order line: no delivery -> Prepare Delivery opens /DeliveryNote?orderLineId=ID; existing delivery -> View Delivery opens /DeliveryNote?deliveryId=ID. Delivery list removes standalone Create. Its existing controlled editor receives sourceOrderLineId, locks agreement/equipment/branch provenance and keeps actual dates explicit. Order navigation is not an automatic physical dispatch.
- Required routed detail/sources/branch bootstrap use the page loader; dialog source/details use one local host; writes/export global; retain cancellation/finalize/dirty/error/Retry. Branch is existing approved cache with finite successful bootstrap then separate once-watch/selected-label/context clearing. New order/source/availability/history reads stay direct. Preserve drafts on refresh and clear old-context options.
- Root owns delivery source/backend/FE, resources integration, legacy MA association guard, guide and final reconciliation. Backend worker owns SaleOrder domain/config/DTO/partial/interface/controller only. Frontend worker owns new order folder, its vocabulary file, MasterAgreement list and route/sidebar integration only. No overlapping writes.

Source-only gates and owner-run schema/build/runtime/performance acceptance remain. Feature-specific rules stay here; no shared instruction/packet change is required by this amendment.

Target C source reconciliation 2026-10-27: implemented the above API/UI/domain amendment. Saved draft line sources render readonly; replace a different unit by remove/add before confirmation. Linked preparation date is required, saved actual dispatch cannot be cleared, and availability is checked on initial preparation/first dispatch even when return is included in the same payload. Generic typed-order mutation/relinking is blocked. Context changes hide saved operational labels and block further writes until reopen. Final grid/DTO/route/cache/loading/query/index/schema/guide evidence is recorded in the full-stack review. Source-only status does not confirm build, deployed schema or runtime acceptance.

Subsequent owner presentation clarification: invoices are accessed through actions in the rental cycle, not a separate module screen. Existing sidebar/list/result navigation is a confirmed open deviation. Existing generation DTO/math/coverage remain frozen; exact source-scoped invoice-history read/filter and legacy-link behavior still require an implementation amendment. This review does not change application source. The current PurchaseOrder owner is supplier procurement (SupplierId and supplier currency/tax), so it cannot replace the rental execution order or external customer PO reference. Direct quotation -> agreement association is supported, but the direct quotation action itself is not implemented. See the latest cycle re-review in the full-stack report.

## Action-only correction freeze — owner implementation instruction

Owner explicitly requests implementation of the confirmed review fixes. No accounting, price, source-unit or migration policy changes follow. Two independent streams start only after this amendment:

- Quotation stream: extend existing QuotationListVM/TypeScript row with nullable masterAgreementId and bool canCreateMasterAgreement. Existing bounded scalar quotation projection supplies the first live same-tenant MA ID and flag only when both approvals are Approved and no agreement exists. Add Create Agreement action when flagged, or View Agreement when a saved link exists. Route creation with quotationId context; existing MA editor initializes it, fetches its existing authoritative quotation reference, validates approvals and fixes customer. No automatic copy of model-level offer prices into actual-unit rates, no automatic approval/save. Existing duplicate/source server checks remain final authority. Supplier PO stays optional and is separately labelled as supplier procurement. Worker owns only Quotation service/ListVM, quotation frontend row/list, MA detail TS/template, and equipment-rental-orders.ts vocabulary; no shared en/ar/guide/route edits.
- Invoice stream (root): remove rental invoice sidebar entry. Existing invoice route root/create redirects to DeliveryNote; prior details/view/edit links open the existing controlled invoice editor through a minimal route host, without invoice-list reads. Preserve legacy metadata edit compatibility and generated-draft readonly guards. New delivered-row View Invoices action opens a controlled source-owned history dialog. GET EquipmentRentalInvoice uses existing typed ListQuery with Filters[deliveryNoteId]=saved positive ID, page10/20/50, startDate descending and inherited Id tie-break; generic Service.BuildFilterPredicate explicitly supports nullable-int equality before tenant/live Count/page projection, so no new API or backend schema is invented. Existing Results/ListVM remains the response: display id/startDate/period/totalAmount/currencyCode; deliveryNoteId supplies source verification/action identity. No text matching for ownership. History checks returned source IDs, finite direct reads, cancellation/context/destroy, local StateMessage, empty/error/Retry/pager, and existing guarded delete with shared confirmation/global write owner.
- Generated-result View emits its saved invoice ID and delivery source to the parent; parent opens the existing readonly DetailsComponent inside the operational action flow. Initial direct detail skips history read; closing detail can expose the related history. No nested simultaneously visible editor overlays. Detail optionally checks expected delivery ID. Keep current net-hour/duration coverage and guarded deletion correction; no manual financial total input, no consolidated multi-unit invoice or posting.
- Both streams preserve dirty/read/write lifetime, source validation, failure feedback and context clearing. Existing branch/customer/equipment/reference caches and their writers remain owners; quote reference and invoice/history reads are direct operational sources. Invoice-service filters add optional numeric deliveryNoteId matching existing backend behavior. No new cache or index; history predicate evaluates existing DeliveryNoteId FK index at owner SQL-plan acceptance. Update guide and records at root integration.

UI shape: existing routed MA type02 and quotation list; invoice generation screen09 action dialog, history bounded dialog and existing details type01 controlled editor. Approved shared EditorDialog/DataTable/StateMessage/confirmation and existing dialog composition are reused. Phase00/01 discovery/freeze complete; implement applicable02–05, then root06 reconciliation. Source-only build/test/browser/database/migration prohibition stays in force.

Final source reconciliation: correction implemented. Quotation reference DTO optionally consumes existing authoritative No for the fixed source label. Related invoice history intentionally has five fixed columns without column filters/export; exact deliveryNoteId is the sole immutable filter, with page10/20/50 and descending date/Id order. View/Delete retain positive/same-source checks, local read progress/Retry/context clearing and authoritative guarded writes; empty/out-of-range page repair is source-inspected. New direct legacy entry uses route-param signals and editor recreation per ID, with invalid-link error/Close and legacy edit compatibility. No new backend endpoint/schema/cache/financial policy was needed. Guide, translations, routes and actual consumer public contracts reconcile; source-only evidence and owner acceptance matrix are in the full-stack report.

Visibility compatibility clarification: frontend masterAgreementId/canCreateMasterAgreement are optional on older list responses. Create requires positive source ID and both saved approvals, refuses an existing reported link or explicit canCreateMasterAgreement=false, and otherwise opens the same source-fixed draft. Server freshly owns uniqueness and approval validation; missing metadata is not write authorization. Supplier PO action naming is owner-selected Create Po / View Po, using the existing Purchase and Suppliers purchase-order editor, without a new screen or changed procurement contract.

MasterAgreement tab presentation amendment: owner requests tabs. Keep the existing routed type02 editor in all three modes and its unchanged backend operational aggregate. Use shared EditorTabs workspace with typed basic/rates keys and matching tab/panel ARIA IDs. Basic contains customer, validity, quote/customer-PO reference, notes and saved approval status; rates contains the unchanged actual-unit collection/billing basis/rate and currency. One active bounded panel, one parent form retains values and validators across switching, footer Save/Cancel fixed. Invalid Save opens Basic for scalar/date-order errors or Rates for invalid/duplicate/precision rows before shared focusField; no requests on tab activation, no new schema/API/financial/approval behavior. Implement locally as one sequential UI stream, then guide/source reconciliation.
