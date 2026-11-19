# Movements frontend contract freeze

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Frozen on | 2026-10-07 |
| Owner | Root; frontend-only handoff |

Read this with MOVEMENTS_FEATURE_REVIEW.md and the two discovery artifacts. Those exact contracts are adopted subject to decisions below. Backend remains read-only. No invented lifecycle/status/permission/accounting.

## Shared decisions

Lists use approved Job shape and actual shared owners. Custom movement lists ignore sort; all corresponding sortable claims and sort query keys removed. Workshop accepts entity-property sorting through Filters. Keep actual server counts/page metadata; export fetchAllPages using applied filters, shared grid values and Excel owner. Movement date filters use inclusive calendar yyyy-MM-dd; reset default currentMonthRange except Logs retains its existing today/today default. Editors preserve local date-time with dateTimeValueValidator/toApiDateTime, never toISOString. Route compatibility entries create/details/:id point at list-owned controlled modal and hydrate identity; preserve deep links and outer routing. Route/beforeunload and dirty-close gates reuse existing confirmation owner, no stale pending decision may close a newer record. Do not remove producer fields required by existing Logs typed adapters.

Fuel owner is existing numeric FuelLevelEnum and existing enumOptions/translateOptions. Root adds neutral fuelLevelNames labels0..8 using server fraction/percent names. Delivery/Collection fix missing5/8 option; WM all9; Custody preserves five choices0/2/4/6/8. NRM retains actual string choices Empty,1/4,1/2,3/4,Full. Number-backed enums have exact source IDs; no array-position renumbering.

Record Print on Custody/WM/NRM means loaded selected detail, with the same existing form/document values rendered read-only, using shared ReportPrintService session. This corrects existing actions that ignored their row; no new document/business/report field. Create/View existing for movements; no new Edit/Delete/activation/return workflow. Workshop retains valid Create/View/Edit, no new Delete control. Workshop columns name,no,createdBy,createdAt (+id), removing fictional sku/categoryName. Name max250 Create/max50 Edit follows actual differing VM annotations, backend mismatch report-only.

Delivery and Collection RentalAgreement context remains the current rental subtype (inherits Agreement). Its customer/branch context is scalar text, branch IDs absent: preserve label and null FK. Never manufacture ID or infer a different lookup scope. Delivery KMs/Collection KMs are nullable strings: preserve text and zero, remove lossy Number conversion. Custody/WM KMs are nullable Int32: finite integer validator, no new nonnegative rule absent API Range. Required UI selections remain as current; no unproven backend requirement added. Existing service add numbering is server-owned.

WorkshopMovement documents reuse exact CustomerDocumentAddVM rules and shared app-documents/tracker; upload stores actual server path. Supplier remains WorkshopMovement.WorkshopId owner; internal Workshop master stays independent. NRM type0..4 required/default0, fuel/KMs strings max50, notes max2000; WM type optional0..4, fuel0..8 required wire default0, purchaseOrderNo max100, notes max2000. WM/NRM fixed status and duplicate date aliases remain server facts; remove ineffective status filters, never invent lifecycle.

## CollectionMovement root evidence

GET CollectionMovement accepts Filters[movementNo/agreementNo/plateNo/type/fromDate/toDate], pagination; fixes DateAndTime desc/Id desc. type0..4 exact NrmMovementType; null is Agreement Collection, cannot filter null with an invented type key. Count/page authoritative. Columns collectionMovementNo,typeName,agreementNo,plateNo,driverName,collectionLocation,dateOut,fuelLevelOutName,kmOut,dateIn,fuelLevelInName,kmIn,status (+id,type for localization). DateIn is actual collection timestamp; out values from related Agreement. Status is hardcoded Delivered; retained translated presentation, no state actions.

POST root client fields: type:number|null, agreementId/vehicleId/customerId/driverId/branchInId:number|null, dateAndTime:string, fuelLevel:number|null0..8, kMs:string|null, notes:string|null. No client id/audit/number/date aliases. UI requires DateAndTime, other existing optional fields preserved. GetByWithNavigationsId{id}: minimal form/nav scalar names and identity; retain exact fields used by Logs normalizeCollection. Create/View/Delete currently rendered actions retained; Delete uses backend inherited id endpoint with shared confirmation/error and latest-state gate. No Edit control solely because API exists. Service adapters type RentalAgreementDetailsDTO context and existing select DTOs, inline skip-error ownership.

## LogsMovement root evidence

GET CollectionMovement/GetMovements TOP-LEVEL params pageNo,pageSize,fromDate,toDate,dateMode(out/in/overlap),movementNo,refNo,plateNo,contactId,movementType,status(Open/Close),kMsGreaterThan nullable Int32,hasNewDamages true/null (false does not narrow). Supported types exactly0,1,2,8,9,10,11,12,13,14,15. Fixed checkout timestamp desc/source/id ordering; real counts/pages. Preserve server-calculated kmDifference, IsClosed and HasNewDamages; no client business calculation. Twenty columns: movementNo,movementType,refNo,plateNo,makeAndModel,contact,contactCode,dateTimeOut,dateTimeIn,kmOut,kmIn,kmDifference,fuelLevelOut,fuelLevelIn,branchOut,branchIn,notes,isClosed,createdAt,createdBy. Identity movementId/movementKey/source; action/view state hasNewDamages. Strings remain strings, timestamps nullable per DTO. No new columns/hidden permissions.

View and CheckCard target only existing Agreement,CollectionMovement,DeliveryMovement,NRM,WorkshopMovement. Frozen historical source adapters and print report remain. Six tabs basicDetails/documents/checklist/exterior/interior/signatures. AgreementCustomer Passport/NationalID/License read-only; Supporting eligibility and atomic multipart upload existing contract preserved. Child pending upload/removal decisions guard parent route, close/replacement/beforeunload; callbacks verify actual record identity. Report export/print fetch complete applied snapshot and preserve all20columns/header/generated time, using shared DataTable rather than local report table styling. Cancellable print session removes pending animation/destroy risk. Unknown/unavailable values remain empty.

## Evidence and boundaries

Exact producers inspected: movement entities/VMs/controllers/services; RentalAgreement inherits Agreement; FilterHelper.GetDate calendar formats; MovementFiltersDto/MovementDto; existing frontend services/forms/view adapters; shared public declarations and approved Job list. Discovery artifacts carry exact source paths and backend gaps. BE fixes (FK ownership, validation overrides, numbering race, deep DTOs, stable ties, constant status, in-memory Logs paging) report-only. No migrations needed for frontend changes. No builds/tests/lint/browser/database/commits/push/deploy/Graphify/SigmaMCP authorized.
