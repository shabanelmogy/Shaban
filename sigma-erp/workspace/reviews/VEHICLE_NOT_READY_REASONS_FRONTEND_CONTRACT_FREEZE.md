# Vehicle Not Ready Reasons — frontend contract freeze

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |
| Scope | Administration/VehicleNotReadyReasons Angular source and direct wiring/guide/translations; backend inspected read-only |

## Manifest and authority

User requests review plus implementation according to documentation. Sigma AGENTS, sigma-screen-refactor, Master4/5/7 and UI screen01 own the workflow. Applicable UI1–10/13/15/17/19/22–29; BE9/13 and actual generic API inspected for contract facts. Recipes00–06 remain current: initial Check passed all8; books/packets/references already read in this conversation and date block additionally read for this screen. TierM; PLAN-00 not required for bounded canonical UI adoption with unchanged domain contract. No screenshots/video supplied; source is Confirmed evidence.

Existing changes: Save/Cancel/Delete/Edit icons in details, trash3 in list. Preserve through shared owners; other features/shared pending changes outside scope. Current Create/Update only console.log payload, list Delete empty action. Confirmed endpoints already exist; complete these actual workflows, do not invent APIs.

Selected UI type01: fields-only modal Create/View/Edit plus list route. Approved reference Job list (shell/filters/data table/query lifecycle), shared EditorDialog declarations + UI13 controlled composition (modal); BE pattern1 normal entity, BranchService reference comparison, existing target inherits Service with no overrides. No children, totals, posting, approval or uploads.

## Grid and filter contract

Grid order: shared Actions; Id(number/link View), Reason(text nullable), CreatedBy(text nullable), CreatedAt(date). Client ListVM id:number/reason:string|null/createdBy:string|null/createdAt:string. Backend Checklist-independent VehicleNotReadyReasonListVM: Id inherited int?, Reason string?, CreatedBy string?, CreatedAt DateTime. Persisted records have positive numeric Id; actions require integer-positive identity. Backend inherited SubscriptionId/IsActive/IsValid/IsChanged/No/GUID remain unused response debt out-of-scope; preserve audit fields because displayed.

All existing column searches supported by generic base: id(number optional signed Int32) → Filters[id] numeric equality; reason(text) → Filters[reason] Contains; createdBy(text) → Filters[createdBy] Contains; createdAt(optional Date|string|null) → Filters[createdAt] yyyy-MM-dd via shared parseDateValue, generic DateTime.Date equality. All default empty, no new date range/current-month restriction. Text trimmed, empty omitted, zero preserved. Shared validators int32ValueValidator/dateValueValidator; FieldError reserves feedback for validated filters. Date picker appDatePicker+dateInputMask=true, placeholder dd/mm/yyyy, body overlay, no icon. Search marks/focuses invalid field; Reset clears all/page1. Applied filter snapshot governs paging/refresh/export.

Server list GET VehicleNotReadyReason uses ListSmBase; top-level pageNo/pageSize; generic NormalizePaging max100/CountAsync/Skip/Take; initial15, options10/15/20/50/100, totalCount authoritative. Sort whitelist from displayed sortable stored columns id/reason/createdBy/createdAt; initial no sortField keeps inherited Id descending. Shared toListParams, resolveListPaging, switchMap/defer/finalize and route state helpers. Export fetchAllPages all matching applied rows + dataTableExportRows translated/date-formatted visible columns. No print workflow introduced.

## Detail and write contract

Detail UI consumes id:number (subtitle), reason:string|null only. Typed form reason:FormControl<string>, empty display for null; no required/maxLength validator because AddVM/UpdateVM/entity declare none. Save normalizes trimmed empty to null, retains optional semantics; no uniqueness requirement inferred. Add payload {reason:string|null}; Update {id:number,reason:string|null}. No tenant/audit/GUID/active/delete flags, no source console logging. GET VehicleNotReadyReason/GetById/{id} Result<Detail>; POST and PUT VehicleNotReadyReason Result; DELETE VehicleNotReadyReason?id={id} Result. Typed Angular facade uses existing routes/root HttpClient.

Inline list/detail/export failures own skip-header+apiErrorMessage/composedReadErrorMessage and Retry; standard mutations use global interceptor success/failure once and restore draft/row on both channels. Global loader plus local signals balanced by finalize. View disabled whole form, Save absent, Close only; Edit row action opens separate same-editor mode. MockDataFormsModule/appMockData retained editable only.

## Actions, route and compatibility

Supported Create/View/Edit/Delete/Export. Delete must show translated record identifier and Reason (empty allowed), title/subtitle/warning shared confirmDelete; repeat guard; refresh applied current page, step back when deleting last row on later page; generic RemoveAsync existing soft-delete behavior, no dependency protection invented. Single list route '', parent remounts editorSession with explicit mode/id; boolean closed success refresh, cancel no refresh. All X/Cancel/Escape/navigation through deferred same-session dirty decision, shared freezeFormState, pending/busy/stale guards and destruction teardown. Public mode/id Inputs, closed EventEmitter<boolean>, canDeactivate Observable<boolean> must exist before templates depend on them (prior compiler-feedback lesson).

Job actions View/Edit/Delete/Create/Export Supported. Labour time/invoice/close/cancel/quality check/log/estimation/gate-pass/lubrication Not Applicable: target lacks owning Job aggregate, invoice, states, detail collections and printable document. Inherited activate API not adopted: current screen has no state column/workflow. No UniqueColumns declaration/index; no preflight or uniqueness claims. AuthGuard/Authorize authenticate, no permission API; authorization candidate DELETE VehicleNotReadyReason. No scoped service/controller overrides; inherited read/write retained, existing mapper directions already correct. Single entity save existing implicit EF transaction, no calculation.

Direct consumers: no outside feature imports of models found; LayoutModule has redundant service registrations, remove both/import and keep root providedIn. Routing/menu retained /VehicleNotReadyReason; no external source link to obsolete create/details URLs found. Suppress duplicate toolbar title. Add bilingual topic to existing administration guide /UserGuide/administration and existing sidebar guide entry; no new reader/menu. Existing backend nullable Reason and heavy read DTOs unchanged. No entity/EF/schema/mapping changes, no migration required; existing external editor bookmarks should use list actions after route consolidation.
