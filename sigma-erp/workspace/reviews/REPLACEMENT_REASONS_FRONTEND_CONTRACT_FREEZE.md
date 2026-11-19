| Status | Owner verification pending |
|---|---|
| Frozen | yes |

# Replacement Reasons — screen/API handoff, 2026-10-14

User authorizes review and confirmed implementation of Administration/ReplacementReasons. Direct backend read DTO/mapping/delete fixes are required by the consumer and the canonical rules; no domain/schema redesign.

## Manifest and evidence

- Frontend: `SiGmaAngularFrontEnd/src/app/modules/Administration/ReplacementReasons`; directly related translations, LayoutModule service registration and Administration user guide.
- Backend: ReplacementReason VMs/profile/service only. Entity, EF, migrations and unrelated writers remain unchanged.
- Existing frontend edits: details/list button glyph changes and existing appMockData integration are preserved through shared glyphs/module adoption. Dictionaries, LayoutModule and Administration guide have unrelated pending edits; preserve them.
- No screenshots/video supplied. Current source is explicit field/API evidence; no new business rule inferred.
- UI01 fields-only modal editor (UI13 D4-2). Approved references: Workshop/Job list shell/query flow, shared EditorDialog declarations and UI13 controlled composition. Backend Pattern1: BranchService/BranchProfiler; inherited standard operations.
- Packets PHASE00–06: generator -Check passed on 2026-10-14. References agree with canonical ownership; no refresh required. PLAN00 not required: bounded existing screen conformance with known contracts.
- Root owns freeze/integration/final diff; backend and frontend can now proceed independently with disjoint files.

## Frozen contracts

| Concern | Decision and source evidence |
|---|---|
| Route | Keep `/ReplacementReason` lazy entry/menu; single child list route with CanDeactivate; remove legacy create/details routes (no external consumers found) |
| Columns / ListVM | Actions first, then `id:number`, `reason:string|null`, `createdBy:string|null`, `createdAt:string` (date display). Backend `Id:int`, `Reason:string?`, `CreatedBy:string?`, `CreatedAt:DateTime`. Id/reason link to View. No active flag consumed |
| List scope | Remove inherited SubscriptionId/IsActive/IsValid/IsChanged/No/GUID from actual ListVM. Export uses these same four columns, every applied page, click-time translations |
| Filters | `id` nullable signed Int32 equality (zero retained), `reason` and `createdBy` trimmed optional Contains, `createdAt` optional valid calendar day serialized yyyy-MM-dd. Generic BuildFilterPredicate owns exact keys; stored-column sort in Filters[sortField]/Filters[sortOrder]. Defaults empty |
| Paging | GET root, explicit pageNo/pageSize15, choices10/15/20/50/100, size<=100. Base CountAsync gives totalCount/totalPages, Id descending tie-breaker. One switchMap stream; resolve paging before state writes |
| Detail | GET ReplacementReason/GetById/{id}, Result<Detail>. No navigations needed. Detail `Id:int, Reason:string?` only. View disables controls and hides Save, Close only |
| Writes | POST `{reason:string|null}`, PUT `{id:number,reason:string|null}`. Typed textarea retained. Empty/whitespace=>null follows nullable VM/TrimIncomingStrings; no required/max length/uniqueness invented |
| Save | No confirmation. Freeze form during request; success closes/remount teardown then applied-list refresh; failure retains draft. Interceptor owns mutation feedback |
| Dirty exit | X/Cancel/Escape/route use same deferred confirmation; freezeFormState preserves values and disabled controls, refuse duplicate/stale/pending decisions; pristine/View leaves silently |
| Delete | DELETE root?id=N, inherited interface/controller. ReplacementReasonService.RemoveAsync uses shared RemoveWithChildrenAsync with no owned children; blocks actual EF usages incl LeaseAgreementVehicleReplacement.ReplacementReasonId, tenant scope and not-found. Shared confirmDelete shows reason/identifier. Success refresh applied page, back one when sole later-page row removed; failure keeps row |
| Actions | Create/View/Edit/Delete supported. Legacy toggleActive callback is empty and no visible state contract; do not invent activation. Workshop-specific lubrication/close/log/invoice/approval/export-cards/print actions N/A: no corresponding aggregate/business state. Generic backend handleActivate/select endpoints retained for compatibility |
| Compatibility | Lease vehicle-replacement lookup uses inherited getSelectList and independent DropDownSelect; preserve it. Narrow only screen list/detail contracts after direct consumers checked |
| Mapping | Four explicit one-way maps, no ReverseMap/Ignore. No calculations or aggregate rows |
| Schema | No entity/EF change; no Add-Migration required. Existing duplicates/null/long reasons preserved |
| Feedback | List/detail/export own inline failure with skip-error header and shared apiErrorMessage/composedReadErrorMessage; mutations use interceptor exactly once; all operations finalize loader and retain recovery |
| Guide | Add one bilingual Replacement Reasons topic to existing Administration guide at `/UserGuide/administration` with `/ReplacementReason` screen link |

## Reference conformance before editing

| Concern | Owning block | Actual reference/symbol | Shared owner / target decision |
|---|---|---|---|
| Bounded list/title | UI1/3/6 | Workshop/Job/list.component.html section/header/table | sigma-route-host/page/panel/header/table, FeatureTitle; replace legacy card/table-list |
| Filters | UI4/19 | Job filterForm, stableLayout/resetRequested | FilterPanel + FieldError; four confirmed fields, retain34px/default spacing, no feature CSS |
| Paging/async/export | UI2/6/8/28 | Job bindListQueries/currentQuery; list-query helpers | typed DataTable/resolveListPaging/switchMap/fetchAllPages/dataTableExportRows |
| Modal/dirty | UI10/13/15/27 | EditorDialog inputs/outputs/template, UI13 composition | padded auto-height flex-fill form/body/scroll, explicit mode/session and common close guard |
| API/delete | BE3/4/7/8/13 | BranchService.RemoveAsync; BranchProfiler maps | lean list/detail, shared EF usage checks; inherit other operations |

Authorization candidates: Create POST, Edit PUT and Delete DELETE `/ReplacementReason`; authentication exists but fine-grained authorization is deferred (UI26). No permission API introduced.

## Reconciliation addendum, 2026-10-14

The frozen fields/endpoints/domain contract is unchanged. Final audit identified missing `EntityLeaseAgreementVehicleReplacement` category translation in the two GeneralMessage resources; those directly related bilingual resource additions are now included in the implementation scope so an Arabic delete blocker does not embed an English CLR type name. The shared EditorDialog current responsive style hides its subtitle/hint at <=620px; the target follows that approved shared source, and guide text names the wider-screen subtitle presentation accurately. Actual mobile acceptance remains owner-pending. Export captures translated column headers before the first page request so a language change during a slow export cannot change its headings.
