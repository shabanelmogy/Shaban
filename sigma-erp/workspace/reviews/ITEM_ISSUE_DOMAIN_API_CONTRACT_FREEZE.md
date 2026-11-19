# Item Issue domain/API contract

| Status | Frozen |
|---|---|
| Owner verification pending | yes |
| Date | 2026-10-04 |

Frozen before implementation/delegation. Plan: ITEM_ISSUE_MAINTENANCE_EVOLUTION_PLAN.md. UI01 and BE2; canonical Master2/4/5/7 and owning UI/BE blocks. No authorization API invented.

## Evidence
Two historical English LTR desktop screenshots C:/Users/user/Desktop/Stock/Item Issue/1.PNG and 2.PNG; version/date/role/acceptance unknown. Image1 Explicit: No/date/Job columns; No/date-range/Job filters; Report/Excel/Search/Add; View/Edit/Delete, paging. Image2 Explicit: DateAndTime/Job; Item/Quantity child rows/Add/Remove; Save/Cancel. Screenshot appearance is guidance, not implementation authority. Required/date/quantity/ownership and source-linked locking derive from existing source and prior requisition frozen contract, not image instructions.

## Read contract (wire camelCase)
Grid columns: no, dateAndTime (dateTime), jobName; shared Actions first.
ListDTO: id:number, no:string|null, dateAndTime:string, jobName:string|null, canEdit:boolean. Only identity/action flag beyond displayed values.
DetailDTO: list fields plus jobId:number|null, itemRequisitionNo:string|null, itemIssueItems:[{id:number,itemId:number|null,itemName:string|null,quantity:number}].
JobName uses existing live tenant Job No and subject/type label when current source supports it; missing source labels stay null. Provenance No is read-only explanatory content. No full nested Job/Item DTO/audit/tenant/count/status.
Filters: no:string, jobId:number|null, dateFrom/dateTo local yyyy-MM-dd inclusive. Current-month default; default15/max100; choices10/15/20/50/100. Backend accepts explicit sorts no/dateAndTime/jobName; default newest Id. Full export/report uses matching applied filters/sort and pages100; no invented field/status.
GET ItemIssue paged; GET ItemIssue/GetByWithNavigationsId/{id} detail; compatible normal/navigation reads must honor same lean contracts.

## Write contract
POST ItemIssue: {dateAndTime:string(local time),jobId:number,itemIssueItems:[{itemId:number,quantity:number}]}.
PUT same plus positive header id and line id (0 new/positive saved).
Required nondefault date, positive Job and Item ids, at least one row, quantity integer1..2147483647, reject duplicate item ids. Validate all distinct live tenant references. Full snapshot mandatory, null/empty rejected. Saved row ids must belong to this live tenant parent; missing rows removed after dependency safety checks. Map onto tracked retained entities and reconcile owned rows; keep generated No/audit/tenant/provenance server-owned. Ignore only manually reconciled Update navigation; one-way aggregate maps. No tenant/subscription/audit/status/source inputs.

## Actions and persistence
View every existing row; Edit only standalone headers (canEdit = no source ItemRequisitionId). Preserve prior linked issue guard and raw child guard; backend revalidates. No issue status or approval workflow exists.
DELETE ItemIssue?id=n: shared confirmation, existing RemoveWithChildrenAsync under same ExecuteUniqueWriteAsync<ItemRequisition> lock; downstream dependencies reject, live linked deletion restores derived requisition remaining quantities under prior cycle.
Tracked Update runs within prior source lock and base feature guard, one aggregate SaveChanges. Standalone Add one implicit transaction/save. Public bulk methods cannot bypass aggregate invariants; prevalidate AddList or reject unused UpdateList explicitly after scoped consumer evidence. No nested lock. No physical stock or accounting effect is claimed.
No entity/EF changes required here; prior owner migration LinkItemRequisitionFulfilment remains needed if not applied.

## Boundary reconciliation addendum, 2026-10-04
Source audit found direct ItemIssueItem Update/UpdateList/Remove can mutate standalone header-owned rows and bypass duplicate/minimum/quantity aggregate invariants. Existing linked-source guard stays first; extend the directly related standalone writer to reject mutation of any live header-owned issue row with an actionable use-aggregate-editor message. Orphan behavior remains compatible. No owning Angular caller uses this bypass. This closes a necessary aggregate boundary and does not add a permission restriction. Backend agent ownership extended to ItemIssueItemService for this guard only.

## UI/integration
List plus controlled ItemIssueDetailsComponent modal, width1040/contentPaddedtrue; two header columns; Item/Quantity table, no tabs or local CSS. Starts date now and one row qty1. Read-only linked warning/provenance; historical unavailable labels render blank. Numeric required/positive integer and selected live lookup membership; backend authoritative. Lookup/read failure both channels, retry; cancelled reads/finalizers release loader.
Ordinary mutation feedback via shared interceptors; locally handled reads use skip-error header. Dirty close/escape/navigation uses shared discard confirmation; remove uses shared rows confirmation; return focus, refresh/page clamp. Legacy create/details URLs redirect to list editor query; id:number throughout. Root service, remove only ItemIssue duplicate Layout providers. Bilingual keys owned by root.
Report button shared dialog complete list print; per-row Print not added (not shown/requested in ItemIssue evidence). Report shared print guard/cleanup and no direct window.print.
# Filter alignment amendment — owner instruction 2026-10-04

Frozen before implementation: owner requests filter controls on the same row alignment and an explicit Guide rule, then limits adoption to Item Issue onward because earlier screens were already adjusted. Only ItemIssue list HTML adopts existing shared `[stableLayout]="true"` and date feedback reservation; no earlier feature filter edits, no shared default/breakpoint/column/token changes. Keep three main filters, existing labels/34px controls, responsive 3/1 placement, separate existing action toolbar, query/Reset/Search/export behavior and date validator. UI4/19 + Workshop Job list are the actual reference; shared FilterPanel stable grid uses align-items:start and FieldError reserves translated date feedback. Runtime/visual acceptance remains pending.

