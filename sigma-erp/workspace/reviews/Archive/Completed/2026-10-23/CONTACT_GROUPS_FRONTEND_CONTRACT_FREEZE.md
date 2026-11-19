# Contact Groups — frozen screen/API handoff

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |
| Authorization | Review `src/app/modules/Administration/ContactGroups` and implement according to documentation |

## Manifest and evidence

Tier M, existing screen plus directly related API conformance corrections. No new business concept/schema/shared owner: PLAN-00 not required. Preserve unrelated dirty files (including LayoutModule, vocabularies and Administration guide). No ContactGroups changes predated this task. UI type01: fields-only record; Job list reference and shared EditorDialog/UI13 controlled single-section composition. Backend Pattern1: BranchService; retain existing atomic multi-save LinkAccounts Add exception. Read authority AGENTS.md, sigma-screen-refactor skill and cited Master/UI/backend blocks. Generator -Check passed all eight packets; PHASE00–06 selected.

E1: `C:/Users/user/Desktop/123.png`,1667×391, English/LTR list and simple form; date/version/role unknown. Explicit Type filter=Customer, Name/Actions/default badge/Add, form Type/Name/Cost Center and Cancel/Save. No inferred validation, full menu or accounting rules. Screenshot design is not authority; preserve other source columns/actions absent from the crop.

## Frozen API/read/write contracts

Authenticated ContactGroup API retains routes/envelopes and server tenant/soft-delete owners. Type numeric enum Staff0/Driver1/Customer2/Supplier3; feature-local enum avoids changing unrelated shared string enum.

| Operation | Route/body | Producer/contract |
|---|---|---|
| List | GET ContactGroup, pageNo/pageSize, Filters | Results; CountAsync; clamp1–100 |
| Detail | GET ContactGroup/GetByWithNavigationsId/{id} | Result; navigation loader supplies saved costCenter.name |
| Add | POST ContactGroup, name/type/costCenterId | Result; existing group+LinkAccounts transaction |
| Update | PUT ContactGroup, id/name/type/costCenterId | Result; inherited generic update |
| Delete | DELETE ContactGroup?id | default block then shared inbound-reference soft-delete helper |
| Set default | POST ContactGroup/{id}/SetDefault, {} | existing account-service transaction unchanged |
| Activation | POST ContactGroup/handleActivate, ids:[id],isActive | inherited tracked target validation |
| Lookup | GET CostCenter/GetSelect | Results<DropDownSelect>; numeric id/value; editable modes only |

Grid (Actions first) beside ListVM: id/Id, name/Name (badge uses isDefault/IsDefault), type/Type translated enum, costCenterId/CostCenterId, isActive/IsActive translated status, createdBy/CreatedBy, createdAt/CreatedAt dateTime. Lean ListVM removes SubscriptionId/GUID/No/IsValid/IsChanged/nested CostCenter; identity+displayed/action fields only. Symbol consumer search found root list DTO only in its interface/service/controller/profile. Existing inherited generic select consumers keep get/getSelectByType methods; unused FullListVM retained as compatibility.

Detail root: Id/Name/Type/CostCenterId/IsDefault plus existing nested CostCenterDetailVM for saved Name; retain nested compatibility, remove unused root tenant/audit/delete/flags via LeanDetailBaseVm. Writes: Name required/max250 on both Add and Update (source-supported existing Add limit fixes backend backlog4 Update50 mismatch); Type EnumDataType; optional CostCenterId checked by InvalidInputAsync before custom Add mutation. No client tenant/default/active/audit/calculated fields. No new uniqueness rule/index: existing configuration proves only default-per-tenant/type, no name business key. Entity/EF unchanged, no migration.

## Filter/paging/export

Type / Filters[type]: generic enum equality; initial/reset Customer from E1, clear=null means all; Staff0 must serialize. Name / Filters[name]: generic Contains; trim/omit empty. Initial15 rows,10/15/20/50/100 choices. Search/Reset page1; refresh/action/editor success keeps applied page/size/filters/sort, draft changes never alter paging/export. resolveListPaging before signals; Subject/switchMap/defer/finalize cancels old reads. readListRoute/writeListRoute for applied URL state. Sort whitelist from columns: id/name/type/costCenterId/isActive/createdAt; no createdBy sorting. Backend natural order IsDefault descending before paging then Id tie-breaker; explicit sort inherits base ordering and tie-breaker without a post-page reorder. Export fetchAllPages(size100) + dataTableExportRows; same displayed columns/applied scope/current language; failure aborts entire file.

## Editor/actions/routes

List-only route; one ContactGroupDetailsComponent explicit create/view/edit and numeric id. Controlled padded content-sized720px EditorDialog, flex-fill form/body/scroll, FormSection, no local styles/tabs. Initial create type follows applied filter when present. View readonly with Close only; saved cost-center name, no lookup. Name/type required FieldError; trim, mark touched, focus invalid. Optional cost center real select; failed detail/lookup blocks Save with Retry and draft retention. Save freezes form, global interceptor feedback once, hide then closed(true), one applied-page refresh. MockDataFormsModule remains editable/manual-save only.

Cancel/X/Escape/navigation share deferred canDeactivate; capture same session, freezeFormState during discard, cancellation restores original disabled state/dirty values; accepted close ignores its own pending confirmation flag. List CanDeactivate delegates to mounted editor.

| Action | State/interaction | Failure/refresh |
|---|---|---|
| View/Edit/Create | existing/new; same modal explicit mode | failed reads retry; save refresh applied page |
| Delete | existing nondefault; confirmDelete names record; default/used protected server-side | keep row, interceptor failure; back one page for deleted last row |
| Default | nondefault→default; prior same-type default false; warning confirmation names existing fallback/account effect | existing backend owner; same-page refresh |
| Activate/Deactivate | false/true→true/false; shared confirmation, typed existing endpoint | inherited validated targets; same-page refresh |

Job reference View/Edit/Delete supported. Labour time/invoice/close/cancel/quality check/log/estimate/gate pass N/A: ContactGroup has no Job lifecycle/documents. Target Default/activation routes confirmed. AuthGuard/Authorize authenticate only; candidates POST/PUT/Delete/Default/Activation do not imply permissions. No new accounting or default edit/deactivation restriction.

## Backend overrides/transactions

AddAsync retained for two dependent saves: InvalidInputAsync before tracking; check both saves; cancellation throughout; commit only success. Replace GetManyAsync post-page reorder with ApplyListOrder (default first only natural order; explicit sorts inherited). RemoveAsync retained for default block plus RemoveWithChildrenAsync(no owned children). Inherit Update/Detail/Select/HandleActive; no redundant controller overrides. Existing four directional maps retained, no ReverseMap/Ignore. No domain totals; account/default service unchanged. Default/delete failure text localized with existing resource convention.

## Pre-edit reference conformance

| Concern | Block | Actual reference/shared owner | Target |
|---|---|---|---|
| List bounds/title | UI1/3 | JobsComponent host and sigma-list shell; FeatureTitle | replace card/table-list with same bounded host/shell |
| Filters | UI4 | Job appFilterPanel/FilterActionsDirective stableLayout | Type/Name,Reset/Search/Export; shared geometry |
| Grid | UI5/6/28 | Job bindListQueries/onLazyLoad; DataTable fill and resolveListPaging | API count,cancellation,column sort whitelist |
| Export | UI8 | Job exportExcel; fetchAllPages/dataTableExportRows | all applied pages/current labels |
| Modal | UI13/15 | EditorDialog public visible/mode/contentPadded/width and controlled composition | single section720px; no feature shell CSS |
| Fields/exit | UI16/19/10 | enumOptions/enumKey/TranslateOptionsPipe,FieldError,confirmDiscard,freezeFormState | real enum/FK; typed controls; deferred discard |
| Feedback | UI22 | StateMessage loading/error/empty; root errorInterceptor | inline reads skip header; standard mutation global owner |
| Backend | BE3/7/8/9/13 | BranchService and base InvalidInputAsync/RemoveWithChildrenAsync/ApplyListOrder | lean root DTOs,FK validation,pre-page order |

Root owns discovery/freeze, list/models/service/routes/guide/translations and final reconciliation. Isolated editor and backend may be delegated after this freeze; no overlapping ownership. New shared extraction unnecessary because existing owners cover the repeated patterns.

## Verification/handoff

Source-only scoped diffs per actual Git repository; imports/types/keys/contracts/whitespace/merge markers and override audit. No build/test/lint/database/migration/browser/commit/push/deployment. Existing generic update/default-concurrency behavior remains owner-runtime acceptance. Guide topic must be added to existing Administration `/UserGuide/administration` reader/menu before completion.

## Source reconciliation amendments — 2026-10-14

- Lean ListVM uses nonnullable int Id matching persisted identity; nullable Name matches existing EntityBaseWithName and historical read nulls. No write/nullability or schema change follows.
- Remove only ContactGroupService duplicate LayoutModule providers/import so its existing root provider owns it. Toolbar omits only ContactGroup's duplicate page title.
- UI16 historical-selection rule: Repository.GetDropdownAsync returns every live tenant CostCenter (no active filter); a saved id absent from this complete lookup is not a current choice. Keep its actual detail name as read text, offer a conditional Clear unavailable cost center draft action, and require an available choice or null before Save. PrimeNG17 `isClearIconVisible` requires a matched option, so native dropdown clear cannot resolve this specific absent option. The extra Clear is shown only for that unmatched case, never duplicates ordinary dropdown clear, never saves automatically, and marks dirty. Do not merge possibly deleted options back into selectable choices. This corrects a source-proven unusable stale FK without inventing a label or deleting data; backend FK validation remains authoritative.
- Final root Detail conformance removes unconsumed IsDefault and the nested CostCenterDetailVM graph. The final frozen producer/consumer detail shape is Id/Name/Type/CostCenterId/CostCenterName only. One real navigation-name ForMember in ContactGroupProfiler flattens the already-loaded Name; the same GetByWithNavigationsId endpoint supplies it. Direct symbol/source consumers are the ContactGroups editor only. Earlier nested-compatibility decision is superseded because no second consumer requires that graph. Frontend view/stale-selection labels updated together; no entity, write, account or schema change.
