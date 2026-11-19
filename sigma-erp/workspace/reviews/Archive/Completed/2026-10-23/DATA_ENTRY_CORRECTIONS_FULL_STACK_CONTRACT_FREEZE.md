# Data Entry Corrections — frozen API/UI handoff

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

Plan: `DATA_ENTRY_CORRECTIONS_MAINTENANCE_EVOLUTION_PLAN.md`. Canonical Master2/4/5/7, UI type01, BE pattern1 (BranchService). Recipe Check passed for all eight packets. Phases0–6 apply.

## API contracts

| Operation | Contract |
|---|---|
| GET DataEntryCorrection | Results<Row>, PageNo/PageSize/TotalCount/TotalPages; page clamp inherited; Filters[search/status/sortField/sortOrder] |
| GET DataEntryCorrectionModel | Same paging, search filter; no lifecycle/status filter |
| GET {controller}/GetByWithNavigationsId/{id} | Result<Detail>, integer ID; existing inherited route |
| POST DataEntryCorrection | detail:string required nonblank ≤10000; selectedSlaAgreementIds:int[] unique positive eligible IDs, at least one on Create; attachments:string[] (full snapshot) |
| PUT DataEntryCorrection | Same editable inputs + id:int; unchanged legacy empty IDs preserve historical SLA text; unchanged historical/expired selections retained, added IDs must be active/unexpired |
| POST/PUT DataEntryCorrectionModel | Same editable inputs, +id on PUT; required agreement selection on Create, unchanged legacy/historical selections preserved on Edit |
| DELETE {controller}?id={id} | Existing inherited tenant-scoped deletion; shared confirmation, no new closed-state lock |
| POST DataEntryCorrection/{id}/Close | Empty body, Result; Open0→Closed1; already Closed succeeds; concurrency-safe tracked state-only write, no reopen |
| GET SupportSlaAgreement/Available | Existing tenant-scoped complete active/unexpired catalogue; reuse root Angular service |
| POST/DELETE Media | Existing FileField/tracker owner; stored paths, PDF/JPEG/PNG ≤5MB; scope folder DataEntryCorrections; no new upload API |

Unknown write members never acquire authority: subscription/audit/number/date/actor/status omitted from Add/Update. Keep one interceptor-enabled HttpClient. Inline reads suppress global error dialog; mutations keep one interceptor success/failure owner. All failures retain draft/state and finalize loading.

## Grid/ListVM and details

| Need | Request row/ListVM | Model row/ListVM |
|---|---|---|
| Action target | id:int | id:int |
| Entry number | entryNo:string (source EntryNo, fallback No) | — |
| Date and time | dateTime:DateTime | — |
| By | by:string (source By, fallback CreatedBy) | — |
| Detail | detail:string | detail:string |
| Status | status:0/1 | — |

Actions first through shared actions column. Request displayed order: entryNo(text link), dateTime(dateTime), by(text), detail(text), status(translated). Model: detail(text link). Remove editor-only SLA/attachments and inherited audit/tenant/flags/GUID/No from ListVM; no unrelated FullList consumers changed. Detail main: id,entryNo,dateTime,by,detail,status,serviceLevelAgreement,selectedSlaAgreementIds,attachments. Detail model: id,detail,selectedSlaAgreementIds,attachments. Add/Update: detail,selectedSlaAgreementIds,attachments; Update identity only extra. No totals, calculations or journal mappings.

Filters: search trimmed; absence/empty ignored. Main status0 remains serialized, status1 selects closed; main starts Open, optional All, Closed retrieves recent closed ordered newest first. Sort allowlist actual grid fields; id tie-breaker inherited. PageSize default15, choices10/15/20/50/100; server count only. Export fetchAllPages with frozen applied filters/current translated grid columns.

## Action/reference inventory and integration

View/Edit/Create/Save/Refresh/Export supported. Delete supported by existing generic service and current public action; real inbound dependencies remain base-owned. Job Approve/Reject/Deliver/Invoice/Payment/Lubrication actions Not Applicable: correction has no workshop/financial aggregate. Main Close is reviewer decision under Master2 rule6 from existing Open/Closed domain. Model has no Close. Child Add/Remove supported on attachments, confirmation for saved/dirty rows; removal retains old file until save. No invented security mechanism: AuthGuard only; mutations are authorization candidates, existing authenticated controller retained.

Both editors use explicit create/view/edit input, EditorDialog controlled visibility/contentPadded, shared subtitle for entry number. View skips eligible-choice lookup and shows actual historical SLA snapshot/IDs. Dirty Cancel/X/Escape/navigation use one deferred shared discard flow with form freezing. Tracker busy/cleanup/row-confirmation gates Save/Close; failed cleanup stays open with retry, never repeats successful Save. Lists use single switchMap trigger, applied-query snapshot and route-state persistence; successful mutation refreshes once.

Routes: /DataEntryCorrection and /DataEntryCorrectionModel each own list only, legacy create/details paths redirect to list. Guard delegates dirty editor decisions. Root frontend owns guide reader/menu and translation edits; backend agent owns scoped .NET correction files and messages only.

## Pre-edit conformance evidence

| Concern | Book | Read reference/shared symbol | Target contract |
|---|---|---|---|
| Fill shell/header | UI1/3 | Workshop/Job list HTML; FeatureTitle | sigma-route-host/page/panel/header/table, title inside panel, no feature shell CSS |
| Filters/grid | UI4/5/6 | Job list; FilterPanel public mainColumns/busy; DataTable fill/actions | Shared projection/mandatory Reset, fill grid, 15-row default and typed counts |
| Dialog | UI13/15 | EditorDialog public mode/contentPadded/subtitle/outputs | Explicit mode/controlled exits, shared header/footer; no bespoke shell |
| Files/rows | UI14/18 | FileField control:string-null; EditableRows; tracker finishSave/discard | Same control type and owners, stable row tracking, full path snapshot |
| Async/errors | UI22/28 | Shared apiErrorMessage, freezeFormState, actual service/loader | Same interceptor policy, finalize/cancel and retry |
| Backend | BE3–9/13 | BranchService, generic Service/Repository, LeanDetailBaseVm | Lean contracts, inherited query/count, one save per tracked record, one-way maps |

Implementation artifact pending: `DATA_ENTRY_CORRECTIONS_FULL_STACK_REVIEW.md`; root reconciles actual target symbols and source before handoff.

## Recorded clarifications before reconciliation (2026-10-14)

- The backend validates changed SLA selections as a complete eligible set. An unchanged historical set (including empty legacy sets) is retained; replacing it requires clearing old choices and selecting eligible agreements. It does not grant new selection of expired IDs.
- The 10,000-character limit applies to incoming writes only. Existing unconstrained storage is retained to avoid a new column shrink or historical-data rewrite; this is a compatibility deviation from equal request/storage maxima, not a storage limit claim. Existing longer descriptions can be viewed and must be shortened to save an edit.
- Delete uses the canonical RemoveWithChildrenAsync usage guard, with no new Open/Closed lock. Existing records remain readable; no data is deleted by this implementation task.
- Screenshot Open/Recent closed logical groups use one shared paged grid and the status selector, rather than two independently paged tables. Closed ordering follows the existing newest-ID order; there is no source-backed closure timestamp or invented cutoff.
- Source establishes generic No numbering for corrections (current fallback is type name plus ticks), not the screenshot's DEC prefix. Reuse it; no numbering policy change is authorized.
