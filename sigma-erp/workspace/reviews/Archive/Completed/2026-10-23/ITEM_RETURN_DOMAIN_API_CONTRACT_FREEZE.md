| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Item Return domain/API/UI handoff — 2026-10-04

Authority: Sigma AGENTS; sigma-screen-refactor; Master2–5,7; UI screen01 and UI1–10,13–17,19–29; BE3–11,14. Recipe Check reports all packets stale; canonical books govern; owner regeneration and semantic review pending.

Manifest: FE Stock/ItemReturn list, details, models, service, routes, report; directly related layout provider/toolbar translations. BE ItemReturn service/controller/profile/write/read VMs and minimal owned-line read VM. Existing Quantity directive changes retained. No entity/config/schema changes, migrations, journal or inventory balancing introduced.

Evidence: screenshot1 explicitly proves No/Date/Job filters, list No/Date/Job, Add/View/Edit/Delete, Report/Export/Search. Screenshot2 explicitly proves DateTime/Job/NotesReturnReason and Item/Quantity rows plus add/remove/cancel/save. Styling is non-authoritative. Existing Entity has nullable JobId and integer Quantity; there is no ItemIssue relation or workflow state. No invented issue matching, stock-limit calculation or closing state.

Reviewer decisions under Master2 owner standing rule: Job required on writes (current AddVM int); DateTime required valid; at least one row; quantities integer1..2147483647; positive live tenant Job/Item references; no repeated ItemId. Notes optional, trimmed, no new length limit. Existing invalid historical values stay visible; editing requires correcting them. Detail nullable FKs/quantity retained. Action Edit available for all ordinary returns; Delete usage-aware soft-delete owned lines through canonical helper. No CanEdit pseudo-state added.

Grid/ListVM exact: id:number, no:string|null, dateAndTime:string, jobName:string|null. Columns no/dateAndTime/jobName; identity id. Filters no:string, jobId:number|null, dateFrom/dateTo ISO date|null; current-month default; page15 shared default, choices10/15/20/50/100, server clamp1..100; sorting whitelist no/dateAndTime/jobName and stable Id tie-break. Inclusive date filters before count. GET ItemReturn uses lean projection through generic hooks; existing navigation detail route supplies consumed detail projection.

DetailVM: id,no,dateAndTime,jobId:number|null,jobName:string|null,notesReturnReason:string|null,itemReturnItems:[{id:number,itemId:number|null,itemName:string|null,quantity:number|null}]. Dedicated slim line detail VM if legacy standalone child API needs broad Item navigation; do not break unrelated child API.
Add: dateAndTime,jobId,notesReturnReason,itemReturnItems:[{itemId,quantity}]. Update: same plus id and each line id (0 for new). Whole snapshot mandatory, at least one row; validate saved-line ownership before mapping; drop missing lines via usage check; map onto tracked retained rows; save once implicit EF transaction. Client never sends No/audit/tenant/parent IDs. Reject invalid bulk writes or validate per aggregate; no unguarded alternate writer.

Actions: Add/Create; View; Edit; Delete with shared confirm and business/transport failure handling. Unsaved removal/discard confirmation uses existing helpers. UI explicit create/view/edit mode controlled by list; canDeactivate delegates editor; legacy create/details URLs redirect to modal owner. No per-row print action inferred. Report and Excel fetch all pages of applied filters/sort; report uses shared print session.

Conformance before edit:
| Concern | Book | Reference symbol | Shared owner | Target |
|---|---|---|---|---|
| List shell/grid | UI1,3,4,6 | Workshop/Job list HTML sigma-list-page/appDataTable | global shell, FilterPanel, DataTable | fill host, title inside panel, stableLayout=true, mainColumns=3, reserved date error, no local SCSS |
| Modal | UI13,10,15 | Fleet/VehicleService details EditorDialog integration | EditorDialog | contentPadded, mode, controlled close, typed form, content-sized flex-fill scroll |
| Rows | UI14,27 | VehicleService parts/FormArray/EditableRows | EditableCollectionTable, QuantityInputDirective | Item dropdown fixed width360px, Quantity150px, blue centered View badge, confirmation |
| Persistence | BE8,14 | PurchaseOrderService FK/deletion; Individual tracked UpdateCore pattern | Service OwnsAll/ReconcileOwned/RemoveDroppedAsync/SaveUpdateAsync | live ownership, scalar mapping, one save |

Phases0–6 applicable; domain transitions not applicable. Root owns list/report/models/service/routes/translations and reconciliation; bounded editor and backend work may run after this freeze with disjoint ownership. No builds/tests/lint/browser/DB/commits/push/deploy. Source-only review; owner manual build/create/view/edit/delete/date filter/report/export/RTL/theme tests pending.

## Final reconciliation clarification
Historical navigation labels use tenant identity checks while retaining soft-deleted same-tenant labels in View (UI16); selectable/writable references still require live rows. Notes are trimmed by both FE and backend. Standalone ItemReturnItem service is outside the assigned scope and unchanged; legacy standalone bulk validation is recorded as a residual boundary, not silently restricted. Parent UpdateList uses the frozen aggregate-editor failure. Implementation/source-only status is in ITEM_RETURN_FEATURE_REVIEW.md.
