# Trip grid customization implementation

| Status | Implemented — source-only |
|---|---|
| Owner verification pending | yes |
| Integration owner | Root; translations/config/provider reconciliation and whole-feature closure |

2026-10-07. Frozen handoff: `LIMOUSINE_GRID_CUSTOMIZATION_CONTRACT_FREEZE.md`. No screenshot evidence. This slice repairs the existing preference-record CRUD; it does not apply preferences to TripBooking. No live consuming grid/user-preference contract was found, and that uncertainty remains explicitly excluded.

## Applied source

Frontend repository `F:/My Work/Sigma/SiGmaAngularFrontEnd`, all under `src/app/modules/Limousine/TripGridCustomization`: list TS/HTML/SCSS/spec, details TS/HTML/SCSS, models create/details/list, feature service, routes (12 changed files). Existing detail component and class remain imported consistently; the list spec's unrelated widget import is corrected only, with no test added or run.

Backend repository `F:/My Work/Sigma/SigmaBackend`: TripGridCustomization Add/Update/List/Detail VMs and Profiler (5 changed files). Generic service/controller, entity/EF, shared contracts and resource files are unchanged.

Phases2/3, confirmed generic Delete4 and scoped wiring5 follow the root's frozen0/1 handoff. Source reconciliation6 performed for these owned files; root owns whole-feature final reconciliation. No schema/accounting/domain-calculation change; Add-Migration is not required.

## Final decisions and contracts

| Concern | Final source and evidence |
|---|---|
| Shape | UI01 normal list with controlled modal editor. The source has two simple inputs and no total/collection/approval workflow. Shared EditorDialog uses the same Create/View/Edit controls, title screen name and translated record subtitle. UI13's current correction makes Fleet's routed editors unsuitable as a modal integration reference; this implementation uses the book's controlled composition and exact shared declarations. |
| Grid / ListVM match | Displayed: shared row actions, Column, Hide. ListVM: Id (row-action identity), Column, Hide. No tenant/GUID/audit/flags/product/loyalty fields. Generic Service/IService permit exact ListVM with no ListBaseVm inheritance requirement. |
| Read contract | GET `TripGridCustomization?pageNo=&pageSize=` through typed frontend wrapper and shared toListParams. Generic exact totals and clamp1–100 remain; initial UI15. switchMap cancels stale list reads; controlled page/rows/totalRecords and shared resolver avoid duplicate lazy requests. Detail GET `GetById/{id}` returns id/column/hide only. |
| Filters / routes | No source-supported filter exists, so there is no fabricated search or filter strip. Applied route state is pageNo/pageSize only. One list route, with CanDeactivate delegation to the mounted modal; obsolete product/loyalty actions and routed scaffold details/create paths removed under the frozen contract. No permission API invented. |
| Fields | Real enum preserved exactly: Actions0, TripNo1, TripType2, Customer3, Guest4, Pickup5, DropOff6, From7. Hide bool default false and Actions0 default preserved. Enum labels use enumOptions/enumKey/TranslateOptions owners. |
| Writes / validation | POST column/hide; PUT adds id. Typed reactive form requires column and validates integer0–7 via shared Int32 plus min/max; backend Add/Update use EnumDataType for actual enumeration membership. The scalar default remains Actions0 when omitted, matching existing C# contract; no new unique key or user-level setting rule is imposed. Tenant/audit/identity-on-Add data never submitted. |
| Modal state | Parent owns visibility, record identity and mode; child emits close/save/edit intents. View reads without edit-only lookup requests and disables the form. Required detail failure keeps the form disabled with retry. Save captures only editable inputs, freezes controls during mutation, keeps values and modal open on either failure channel and closes/refetches after success. |
| Dirty exit | X/Cancel/Escape and router exit use the same child canDeactivate. Cold defer rechecks captured id/mode/visibility/disposed and busy state before opening the shared discard dialog; repeat subscription is rejected. Form controls freeze only during subscription and same live editor restores previous disabled controls in finalize. Dirty values persist on cancellation; stale decisions cannot close/reset/enable a replacement record. Beforeunload guards dirty edits and inflight writes. |
| Delete | Existing generic DELETE `?id=` retained. Shared confirmation identifies the translated column and id; pending/inflight checks prevent duplicate submission. Final visible row deletion moves back one page; successful refresh retains paging. No new backend deletion behavior added. |
| Feedback | Inline list/detail/export reads skip the global error interceptor and use shared apiErrorMessage/composedReadErrorMessage. Both failed Result and HTTP error channels are handled. Standard Save/Delete notification belongs to the existing global interceptor only. Global loader pairs list/detail/save/delete starts with finalize ends. |
| Mapping | Four conventional one-way maps only. ReverseMap removed because read-to-entity and entity-to-write directions have no supported consumer. No unnecessary Ignore calls, helpers or service overrides. |
| Output | Excel pages through all preference rows with fetchAllPages and uses the actual shared two-column contract and click-time translations. Unexpected empty output while visible rows exist is reported. No print workflow invented. |

## Reconciled conformance evidence

| Concern | Book / actual reference | Final target comparison |
|---|---|---|
| List page | UI1/3/6; Workshop/Job list | sigma-route-host -> sigma-list-page/panel/header/table; shared FeatureTitle and DataTable fill=true. No local page-height, panel, title or table styling. |
| Modal | UI13 controlled composition; shared editor-dialog TS/HTML/SCSS | Exact visible/mode/contentPadded/closeDisabled/primaryActionDisabled/saving and mode action outputs; header default1040px and breakpoints retained. Content-sized alternative uses flex-fill on all form/body/inner-scroll links, avoiding zero-basis auto-height collapse while keeping one inner scroll owner. No raw p-dialog/two-way hide or feature z-index. |
| Controls | UI16/19/27; enum-options, translate-options, FieldError, focus-field | Integer IDs come from actual enum values. Direct standalone imports registered; failed Save focuses Column. Each checkbox has its own label/field. View uses shared readonly presentation. |
| Actions / dirty decision | UI7/9/10; ConfirmationDialogService / EditorDialog | Shared delete/discard presentation, identity and inflight guards. Deferred exit uses current UI10 pending-decision requirements; parent mode changes arrive through editRequested output. |
| Reads / errors | UI2/22/28; base-service, list-query, api-error | environment.baseUrl, typed Results/Result wrappers, top-level paging serialization and explicit skip-error ownership; switchMap list subscription, finalize loader balance and inline retries. |
| Backend | BE3/4/7/9; generic Service/IService and TripGridColumn producer | Exact three-property List/Detail contracts; existing Add/Update scalar contracts; enum attributes; inherited list/details/write/delete API behavior and four one-way maps. |

## Source checks and owner acceptance

Scoped frontend/backend diffs reviewed separately. Every TypeScript file in this folder (including existing specs) and both templates parse without syntax diagnostics; parser use does not run a test, build, lint or Angular/type compilation. Scoped git diff --check is clean. Direct source scan found no merge markers, ms-lib/ListCol, raw scaffold arrays/actions, console logging, tenant/audit payload fields or unrelated product/manage paths. Exact public imports, input names/types, directive registration, framework viewChild declaration, service endpoints and VM consumer constraints were inspected.

Root translation additions requested: `tripGridCustomization.create`, `record` ({{id}}), and `columns.Actions`, `TripNo`, `TripType`, `Customer`, `Guest`, `Pickup`, `DropOff`, `From`. Existing title/column/hide/loadError/deleteTitle/deleteMessage/discard* and shared general keys are reused. Root owns EN/AR integration and its checks.

`TripGridCustomizationFullListVm.cs` is declaration-only in focused Business/ServerAPI/feature VM searches. Its cleanup is outside this agent's five-file backend ownership and is reported to root; no mapped/public API here consumes it.

Owner must verify compilation, generic API enum rejection for -1/8/fractional values, Create/View/Edit/Delete and duplicate click gates, lookup/detail transport failures and retries, discard cancellation/repeated guard subscriptions/browser exit, exact paging/last-row fallback/stale reads, complete localized Excel, modal focus/keyboard/Escape, desktop/narrow/Arabic RTL/light/dark and absence of page scroll. Preference application to a live trip grid requires a separately frozen consumer contract.

No build/test/lint/runtime/browser/database/migration/snapshot/commit/push/deployment/Graphify/Sigma MCP action was performed. Reused existing owners; no new reusable book/skill rule was established.

Suggested frontend commit: `refactor(limousine): replace grid preference scaffold with typed modal CRUD`.
Suggested backend commit: `refactor(limousine): narrow grid preference contracts and validate columns`.

## Final paging correction — 2026-10-07

Restored URL page size is normalized to integer and capped at100 before the first request; lazy-event rows are capped before resolveListPaging computes the offset/page number. This preserves contiguous100-row pages even for hostile/old oversized URL or event values. Successful responses consume positive integer pageNo/pageSize from the actual Results metadata, cap size to the generic backend100 maximum and synchronize a changed controlled page state to the URL. Missing/zero/noninteger runtime metadata retains the valid requested state; totalCount remains the optional exact-count field in Results. No shared helper/API contract changed. The amended list parses without TypeScript syntax diagnostics and scoped diff --check is clean; owner pagination/compile/runtime verification remains pending.
