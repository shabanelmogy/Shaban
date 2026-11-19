# Industries frontend/backend contract freeze

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |
| Scope | Industries feature and directly related API, provider, translations, guide |

This records the pre-implementation handoff. Plan: INDUSTRIES_MAINTENANCE_EVOLUTION_PLAN.md. Request: review and apply documentation-conforming changes, followed by “continue”. No screenshot evidence. UI screen01: fields-only modal editor; backend Pattern1 normal entity. Approved list reference: Workshop/Job/components/list; modal reference: shared EditorDialog declarations and UI13 composition; backend: BranchService/BranchProfiler. Current Industries files were clean at discovery; other Administration, shared, guide, translations and backend migration changes pre-exist and must be preserved.

## Read, filter and write contracts

| Grid / need | Frontend | Backend | Status |
|---|---|---|---|
| Actions first, shared generated column | ActionList<IndustryDTO> | No extra state needed | Confirmed |
| Name, text, sortable, exported, opens View | name: string|null | Name: string? | Confirmed |
| Identity for actions | id: number | Id: int | Confirmed |

Exact data columns `[name]`; ListVM `[Id,Name]`. Remove unused inherited SubscriptionId, IsActive, IsValid, IsChanged, No, GUID, CreatedAt, CreatedBy; frontend unused audit fields removed. No fabricated status/activation action.

| UI filter | Query key | Backend owner | Type/default |
|---|---|---|---|
| Name | Filters[name] | base BuildFilterPredicate, Contains | trimmed string; empty omitted |
| Page/size | pageNo/pageSize | NormalizePaging/GetManyAsync | 1/10; supplied server size1–100; UI10/15/20/50/100 |
| Sort | Filters[sortField], Filters[sortOrder] | ApplyListOrder plus Id tie-breaker | name, default ascending; order1/-1 |

Use server TotalCount and TotalPages, never rows.length. Persist applied name/page/size/sort in query parameters; draft edits change nothing until Search. Reset blank name/page1. Export uses applied query and fetchAllPages pageSize100, click-time translated grid headers, all-or-error.

| UI / need | Form | Detail | Add | Update | Validation |
|---|---|---|---|---|---|
| Name | nonnullable string | nullable Name | required Name | required Name | Required,max250; trim before frontend validation; server TrimIncomingStrings |
| Identity | parent input number|null | Id | absent | Id | existing tenant-owned record |

Detail is `[Id,Name]` only, with LeanDetailBaseVm. POST/PUT exclude tenant/audit/flags/calculations. Add inherits max250 base; Update inherits Id-only UpdateBaseVm and explicitly declares required,max250 Name. EF HasMaxLength250 with existing nullability. UniqueColumns `(Name,IndustryNameExists)` delegates both write checks including exclude-self and existing shared unique-write serialization. Filtered unique index `(SubscriptionId,Name)` protects concurrency. Equality follows current DB collation. Four one-way AutoMapper maps, no ReverseMap/Ignore. No calculations/children/explicit feature transaction.

## Endpoint, action and integration contracts

GET Industry → Results<IndustryDTO>; GET Industry/GetById/{id} → Result<IndustryDetailsDTO>; POST Industry `{name}`; PUT Industry `{id,name}`; DELETE Industry?id={id}, standard Result. Controller/interface generic implementations remain. GetSelect unaffected.

| Action | Source/target | Backend and UI owner | Recovery |
|---|---|---|---|
| Create | new → live saved record | inherited AddAsync; typed modal create | retain draft on failure; success close/current applied list refresh |
| View/Edit | live → read-only/editable modal | inherited DetailAsync/UpdateAsync; explicit mode | inline load error+Retry; View no Save; edit save as above |
| Delete | live → soft deleted | scoped RemoveAsync → RemoveWithChildrenAsync; shared confirmDelete identifies name/id | guard confirmation/request; failure retains row; success same-page refresh, previous page for last row |
| Discard | dirty draft → closed only after acceptance | deferred confirmDiscard+freezeFormState | Cancel preserves values/dirty/disabled state; X/Cancel/Escape/route use same gate |

Reference Job actions: View/Edit/Delete/Excel/Create are Supported; Labour Time, Close, Cancel Job, Gate Pass, Quality Check, Logs and Lubrication Job are Not Applicable because Industry has no job/document/vehicle/status/child dependencies. No Print contract exists; Excel mirrors the name column only. Exact reference action inventory is reconciled again before final handoff.

Overrides: UniqueColumns required for Name key; RemoveAsync required for usage-safe deletion; search/name filter and sort need no overrides; Add/Update/Detail/GetMany/controller stay inherited. No SearchColumns hook needed for the exact name filter.

One feature route `''` under existing lazy /Industry; CanDeactivate delegates to mounted modal. No feature HttpClient fork; root IndustryService uses environment.baseUrl and app.module root interceptors. Remove only redundant IndustryService entries/import in LayoutModule after consumer inspection. List/detail/export own inline feedback via X-Skip-Error-Interceptor; ordinary mutations retain one interceptor feedback owner. All requests release busy/loading with finalize; list switchMap cancels stale reads. Modal instance remount+id/visibility guard protects detail responses.

Authorization candidates: administration master Create POST Industry, Edit PUT Industry, Delete DELETE Industry. Authentication/tenant boundary exists; no per-action permission mechanism introduced.

## Pre-edit conformance evidence

| Concern | Owning block | Actual reference symbol/file | Shared owner / target decision |
|---|---|---|---|
| Host/panel/title | UI1/3 | JobsComponent host; list.html sigma-list-page/panel/header | IndustriesComponent sigma-route-host/shared classes; FeatureTitle default inset/paint/actions |
| Filters | UI4 | Job list form appFilterPanel, stableLayout=true, appFilterActions | same controls34px, mandatory Reset,1 name column, no feature CSS |
| Table/actions | UI5–7 | Job list DataTable fill/lazy, actions | fill=true, lazy=true, exact server total, shared actions first, name only |
| Export | UI8 | JobsComponent dataTableExportRows + fetchAllPages | existing shared utilities; no local loop |
| Editor | UI13/15 | EditorDialogComponent public inputs; UI13 controlled composition | contentPadded=true, shared default width/max bounds; content-sized flex-fill chain; no tabs for one group |
| Close/focus/error | UI9/10/19/22/27/28 | shared confirmation, freezeFormState, focusField, StateMessage | same deferred close controls, inline FieldError, Retry, cancellation/identity guards |
| Backend | BE3/4/8/13 | BranchService.UniqueColumns/RemoveAsync; BranchProfiler | inherited generic implementation plus recorded hooks; lean identity+Name |
| Responsive/print | UI1/4/6/13/24/25/29 | shared global shell and component styles | retain logical shared geometry, table sole row scroll; no local styles; visual acceptance pending |

Migration required: owner `Add-Migration ConfigureIndustryNameConstraints`; no migrations/snapshot edits. User guide must add bilingual Industries topic in existing Administration guide before completion. No new reusable rule established; existing shared pieces suffice.

## Pre-implementation source correction

2026-10-14: reading the actual shared `list-query.ts` established `DEFAULT_PAGE_SIZE=15` (owner2026-10-03), rather than the historical backend default10. UI adopts the current shared15, while backend requests with omitted paging retain their existing10 normalization. This corrects the earlier table's frontend initial-size description only; no shared owner is changed. Page-size options remain10/15/20/50/100.

2026-10-14 integration correction: the existing module guide link uses lowercase `/UserGuide/administration`, with `sectionId='administration'`. Keep that actual route rather than the historical capitalized spelling above. Existing sidebar wording is الصناعات, so all new Arabic screen/guide/backend messages preserve that terminology. The inspected complete Job action inventory additionally includes Invoice Customer and Estimation: both are Not Applicable (Industry has no invoice/estimate/job contract). Gate Pass is the reference's Print Gate Pass action, also Not Applicable. These corrections add no target business action.

2026-10-14 final-source guard refinement: MockDataFormComponent keeps the editable form disabled during generation/preview and captures clicks within the outer dialog, but route/Escape exits must also respect that frozen draft. The editor's deferred exit now rejects a disabled editable form without a detail-load error; View and failed-detail Close remain available. This consumes the existing shared form freeze rather than adding a generator/navigation mechanism.
