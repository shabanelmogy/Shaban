# Item Issue maintenance/evolution plan

| Status | Frozen |
|---|---|
| Owner verification pending | yes |
| Date | 2026-10-04 |

Scope: user requested ItemIssue review and implementation against canonical documentation; later supplied Item Issue/1.PNG and 2.PNG. Source-only. Master, UI01 (list plus modal editor) and BE2 (owned rows, no financial effect) govern. Recipe check performed: PLAN00/PHASE00/02/05/06 current, 01/03/04 drift; canonical blocks govern these, regeneration/semantic review pending owner.

## Existing state and impact
Existing owners: ItemIssueService/header with DateAndTime, optional persisted JobId, ItemIssueItems(ItemId, integer Quantity), generic controller/mapper and legacy Angular table/routed form. Prior ItemRequisition implementation added nullable source provenance and linked issue immutability/serialized delete; preserve these dirty changes. Standalone child service linked-row guard remains intact. No inventory ledger, balance reservation, warehouse, valuation or accounting posting exists in this owner; this task does not introduce a financial/stock posting contract.

| Slice | Classification | Decision |
|---|---|---|
| Header and rows/entities | Keep | Existing columns and provenance; no schema change in this task |
| List/filter/export/report | Replace/Extend | Canonical shared grid, typed lean reads, No/date range/Job, all matching pages |
| Create/Edit/View | Replace | One shared modal, typed header and full-snapshot owned rows |
| Writes/mapping | Refactor | Validate positive live tenant FKs, minimum one, positive integer qty, duplicates, owned row ids, tracked reconciliation |
| Linked-source rule | Keep | Existing linked issues immutable, source lock preserved |
| Delete | Keep/extend safety | Shared confirmation; existing serialized whole-document dependency-checked deletion |
| Routes/provider | Refactor | Legacy URLs redirect to list intent, dirty guard, root service provider |
| New status/UoM/stock effect | Not applicable | Neither screenshots nor existing ItemIssue define these |

Rejected alternatives: bespoke screenshot CSS (UI01/shared owners govern), copying unrelated reference business actions, new stock deduction or historical balance backfill (no confirmed contract), detaching/recreating persisted children (ownership/history unsafe), permitting source-linked edits (prior frozen cycle uses immutable option). No open material decision remains.

## Preimplementation conformance
| Concern | Book | Actual reference/symbol | Shared owner/target |
|---|---|---|---|
| List shell/filter/table | UI1/3/4/6 | Workshop/Job/components/list/list.component.html | route-host, list-page/panel, FeatureTitle, FilterPanel mainColumns3, fill table, fixed footer, no local CSS |
| Modal | UI13/15 | Fleet/VehicleService/components/details + EditorDialog | width1040/contentPaddedtrue, explicit mode, two header columns, shared read-only body/footer |
| One small collection | UI14 | EditableCollectionTable/EditableRows | typed FormArray, Item360/Quantity150, confirmation-backed remove |
| Aggregate writes | BE14/8 | PurchaseOrderService + Service.OwnsAll/ReconcileOwned/RemoveWithChildrenAsync | all FKs, tracked rows, full snapshot, one save; existing source lock |
| Dates/validation | UI17/19/27 | date-utils, DatePicker, FieldError, NumericFocus | local dateTime, required Job/Item, integer1..intMax |
| Report/export | UI8/20/21 | dataTableExportRows/ReportActions/ReportPrintService | same applied filters/sort and displayed columns, translated headers, complete pages |
| Integration | UI1/2/10/22 | Router guard/BaseService/interceptors | list intents, root service, dirty-close, global ordinary mutation feedback |
