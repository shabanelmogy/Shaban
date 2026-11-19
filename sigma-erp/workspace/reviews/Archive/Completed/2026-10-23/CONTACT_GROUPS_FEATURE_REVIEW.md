# Contact Groups feature review

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |

Manifest, E1 classifications, selected shapes/references, contracts and pre-edit conformance are in `CONTACT_GROUPS_FRONTEND_CONTRACT_FREEZE.md`. Implement only that frozen handoff. Confirmed findings: legacy table, no-op row actions, identity/enum mismatch, missing paging, untyped/server-owned writes, validation/lookup/error/discard gaps, routed simple editor, backend custom-Add FK bypass, default reorder after paging, oversized root DTOs and mismatched name limits. Guide and final reconciliation follow implementation.

## Delivered changes and decisions

UI type01 and backend Pattern1 are applied to the existing components/API; no parallel screen or speculative business capability. Screenshot E1's Type, Name, Cost Center, Add/Save/Cancel, Actions and default marker are retained through shared owners. Existing source columns absent from the screenshot remain; active Status is shown because activation actions depend on it (UI5).

The list uses the Job reference's bounded route/list shell, FeatureTitle, stable FilterPanel, shared DataTable fill, API totals, typed queries, switchMap/defer cancellation and finalize. Type defaults to Customer from E1 and supports actual Staff0/Driver1/Customer2/Supplier3. Name is a trimmed generic Contains filter. Applied filter snapshots control URL/paging/refresh/actions/export; draft edits apply only with Search. Default natural ordering is evaluated before paging; explicit requested sorts use base ordering. Name's default badge is also represented in export text. Export collects every matching page through fetchAllPages and formats the same columns with click-time translations.

Create/View/Edit use one controlled padded720px EditorDialog with a content-sized shared flex-fill chain and public two-column field token; below700px shared fields stack, and below767px the public dialog breakpoint applies. View has Close only, reads saved costCenterName and performs no edit-only lookup. Name/type required, Name250 on both write boundaries; nullable cost-center numeric IDs come from the complete live/tenant GetSelect endpoint. Detail/lookup reads own inline errors and Retry with skip headers. Failed writes preserve values, form disabled-state and dirty state; interceptor alone owns mutation feedback. Discard is deferred, same-session and frozen with one guard for X/Cancel/Escape/navigation; accepted navigation subsequently canceled restores controls. Read completion applies the one initial close-button focus after controls unlock; keyboard/visual acceptance remains pending.

Stale cost center: a complete select cannot render/clear a saved id it does not contain (inspected PrimeNG clear-icon predicate). Show the actual historical label and an unavailable message, require current selection/null, and offer a conditional draft-only Clear. No deleted option is put back into current choices; ordinary dropdown Clear remains unchanged. Final detail contract flattens only the saved name and removes the unconsumed default flag and nested graph.

Backend Add retains two saves inside the existing transaction for group+LinkAccounts; it now validates FKs before mutation, checks both save results, uses cancellation on all direct async calls and commits only success. The repository stamps tenant identity. Delete retains default protection and adopts shared EF-model inbound usage checks before soft delete. The existing SetDefault account/transaction owner is unchanged, as are generic Update and activation rules. Name uniqueness is not invented: existing persistence defines default-per-tenant/type, without a name business key. No financial formula, historical reassignment or posting operation was added.

## Files changed (stage only this task's hunks in previously dirty files)

Frontend repository `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- `src/app/modules/Administration/ContactGroups/components/list/list.component.ts` and `.html`.
- `src/app/modules/Administration/ContactGroups/components/details/details.component.ts` and `.html`.
- `src/app/modules/Administration/ContactGroups/{contactgroup.routes.ts,models/list.ts,models/details.ts,models/create.ts,services/contactgroup.service.ts}`.
- Removed both obsolete feature SCSS files (details was empty) and both broken creates-only scaffold specs (list targeted an unrelated widget; detail imported a nonexistent class). No replacement tests or test execution.
- `src/app/_metronic/layout/layout.module.ts`: only this task's ContactGroupService import and two duplicate providers removed; other pending provider cleanup preserved.
- `src/app/_metronic/layout/components/toolbar/toolbar.component.ts`: omit only ContactGroup's duplicate title.
- `src/app/modules/i18n/vocabs/en.ts` and `ar.ts`: ContactGroup block only; other pending changes preserved.
- `src/app/modules/UserGuide/content/contact-groups-topic.ts` (new), `administration-guide.ts` (topic import/inclusion and overview extension; all pending topics retained).

Backend repository `F:/My Work/Sigma/SigmaBackend`:

- `SiGma.Business/Services/ContactGroupService.cs`.
- `SiGma.ViewModels/ViewModels/ContactGroup/{ContactGroupAddVm.cs,ContactGroupUpdateVm.cs,ContactGroupListVm.cs,ContactGroupDetailVm.cs}`.
- `SiGma.Business/MapperConfig/ContactGroupProfiler.cs`: one CostCenterName navigation flattening; retain four explicit one-way maps, no ReverseMap/Ignore.
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx` and `.ar-SA.resx`: only ContactGroupDefaultCannotBeDeleted entry; existing resource additions preserved.

Local unversioned reviews: this report and `CONTACT_GROUPS_FRONTEND_CONTRACT_FREEZE.md`. No canonical book, skill or generated packet changed: all adopted rules already exist, so no new learning rule or packet refresh was necessary.

## Grid and DTO reconciliation

| Grid column/action need | Frontend row | Backend ListVM | Final source result |
|---|---|---|---|
| Actions first / identity / ID link | id:number | Id:int | Matched; real persisted identity |
| Name and default badge | name, isDefault | Name, IsDefault | Matched; translated export badge suffix |
| Type | type | Type | Matched; numeric enum0–3, translated text |
| Cost Center ID | costCenterId | CostCenterId | Matched; nullable number |
| Status and activate/deactivate | isActive | IsActive | Matched; null shown as Not specified |
| Creator | createdBy | CreatedBy | Matched; no invented sort |
| Created time | createdAt | CreatedAt | Matched; shared dateTime display/export |

Final ListVM: Id,Name,Type,IsDefault,CostCenterId,IsActive,CreatedBy,CreatedAt. Removed SubscriptionId,No,GUID,IsValid,IsChanged,nested CostCenter. Final DetailVM: Id,Name,Type,CostCenterId,CostCenterName. Add: Name,Type,CostCenterId; Update adds Id. Form/payload omit all tenant/audit/delete/default/active flags. No hidden client-calculated values. Nested detail compatibility decision in the original freeze was superseded explicitly in its appended source reconciliation amendment after direct-consumer verification.

## Final reference conformance and path reconciliation

| Path | Producer → actual consumer | Source result |
|---|---|---|
| Shell/title/scroll | styles.scss sigma-route-host/list classes and FeatureTitle → ContactGroupsComponent host/template | Same approved shared fill chain; one grid row owner, title/pager fixed; no feature CSS/page-height subtraction |
| Filters | FilterPanelComponent/FilterActionsDirective → Type/Name form with stableLayout=true,mainColumns2 | Shared controls/Reset/actions; enum0 retained; null/empty dropped by toListParams |
| Grid/read | base ListQuery/CountAsync/NormalizePaging/ApplyListOrder → service.getList/bindListQueries/onLazyLoad | API total; authoritative paging; old request canceled; size-only change fetches; whitelist comes from sortable columns |
| Export | service.getAllList/fetchAllPages → exportExcel/dataTableExportRows | All applied pages; failed page aborts; empty export surfaced; formatted values/current language |
| Detail | DetailWithNavigationsAsync + profile CostCenterName → getDetails/editor View | Saved name available without option request; only consumed root fields |
| Save | VM metadata + InvalidInputAsync and transaction → typed form/createGroup/updateGroup | Required/max250 and defined enums; live/tenant FK checks; no ordinary confirmation; failed Save retains draft |
| Exit | confirmDiscard/freezeFormState → editor.canDeactivate/requestClose and list route guard | Deferred identity checks, duplicate protection, frozen controls, accepted-close ordering and cancel restoration |
| Mutations | default account service / base HandleActive / usage helper → confirmAction/executeAction | Typed exact existing routes, one confirmation and request; one global feedback owner; refresh applied page, last-row delete backs up |
| Wiring | pages/routing.ts / root AppModule HttpClient → list-only ContactGroup routes/root feature service | Existing menu and lazy entry retained; no extra HttpClient/token header; child emits closed(true) once |
| Guide | CONTACT_GROUPS_TOPIC → existing ADMINISTRATION_GUIDE/GuideReader | Bilingual source-conformant purpose, prerequisites, steps, actions, validation and default/account limits |

Reference Job actions are classified: View/Edit/Delete supported. Labour time view/add/remove logs, invoice customer, close, cancel, quality check, job logs/add log, estimate and gate pass are Not Applicable because ContactGroup has no Job/labour/vehicle/document lifecycle. Reviewed IJobService/JobController/Angular JobService plus list action menu; no reference action silently converted to a ContactGroup endpoint. SetDefault and Activate/Deactivate are confirmed target-specific actions.

Override audit: AddAsync (multi-save LinkAccounts creation), ApplyListOrder (natural default priority before paging), RemoveAsync (default restriction plus inbound usages). No GetManyAsync or redundant controller override remains. Update/Detail/Select/HandleActive inherited. Implicit transaction for ordinary Update/Delete/activation; retained explicit multi-save transactions for Add and existing account default-setting.

Authorization candidates: POST ContactGroup, PUT ContactGroup, DELETE ContactGroup, POST ContactGroup/{id}/SetDefault, POST ContactGroup/handleActivate. AuthGuard and API Authorize authenticate; row visibility is presentation, not a permission boundary.

## Phases and evidence

Phases0–6 applied: discovery/E1, API freeze, list/read/export, detail/write, delete/default/activation, wiring/guard/translations/guide, root final reconciliation. Conditional stepper/children/uploads/date filters/financial document/print phases skipped: no such domain content or confirmed workflow. No uncertainty from the screenshot was converted into a new business rule. No required Missing/Conflicting/Uncertain contract remains for the implemented scope.

Source verification: scoped Git diffs reviewed separately per repository; no obsolete source types/imports/table-list/EnumToArrayPipe/server-owned writes, merge markers or whitespace errors. TypeScript/Angular template parser and direct src import-path inspection reported0 findings (syntax/path only, not type checking/compilation). English/Arabic ContactGroup parity:43 keys each, zero missing or case-only mismatches. Backend resource XML parsed and new key appears once per culture. Final generator -Check passed all eight packets, including PHASE00–06; no stale derivative packet used. Standalone components/directives/pipes and public input literals compared against actual declarations; no preemptive tsconfig root change.

Shared extraction gate: reuse existing shell, filter, grid, dialog, sections, state/error, confirmation presets, form-state, enum, paging/route-state and all-page/export helpers. No missing shared capability or new reusable policy qualified; ContactGroup-specific action dispatch and absent-center recovery remain screen-owned. No reference module modified.

## Responsive/owner acceptance matrix

| Range | Expected shared behavior | Source evidence / acceptance |
|---|---|---|
| >=1250px | Configured Type/Name two-column main grid; title actions on shared row; editor two fields plus full-width cost center | FilterPanel public columns, FeatureTitle, sigma-editor-grid; visual pending |
| 1200–1249px | Shared intermediate filter grid; same controls/action toolbar | UI4 shared <=1250 rules; visual pending |
| 720–1199px | Shared Filters collapse, bounded grid/pager; dialog720px with viewport max-width | FilterPanel collapse and EditorDialog bounds; visual pending |
| <=767px and neighbours | Dialog width calc(100vw -16px), shared maxHeight; header/footer fixed | Public dialog breakpoint; visual pending |
| <=720px | Filter fields/actions stack through shared owner; grid scroll remains internal | UI4 shared rules; visual pending |
| <=700px | Editor fields stack, inner form scroll, fixed shell actions | styles.scss field grid breakpoint; visual pending |
| <=650px and neighbours | FeatureTitle/Create wrap with shared compact title button sizing | UI3/24 owners; visual pending |
| Short-height/long EN and AR, both directions/themes | Controls/messages remain readable; only rows/form region scroll | Shared tokens/logical layout; runtime/visual pending |

Owner checks (not executed): build frontend/backend and run appropriate tests; open ContactGroup from menu; filter each type including Staff0 and All, clear/reset/name search; page/size/sort and rapid overlapping reads; export >100 rows and compare scope/labels/counts; create/edit 1–250-character names and reject blank/251, invalid enum/FK, preserve draft after failures; verify cost-center Retry and absent saved-center replacement/Clear; inspect View without lookup; test dirty Cancel/X/Escape/navigation, cancel discard and navigation canceled after acceptance; confirm Delete refuses default/used groups and handles last-page row; confirm SetDefault preserves one per type/account setup and reports one success; activate/deactivate and verify current state; exercise keyboard focus/trap/return and responsive matrix, RTL/themes; read/print Administration guide. Verify authenticated GET/mutation headers without recording token values.

## Risks, migration, guide and handoff

No entity/property/EF/index/relationship/schema change; VM MaxLength correction is request validation only. **Add-Migration not required.** Migrations and snapshots were untouched. No accounting calculation/map policy changed. Existing group-type edits, generic update mapping, concurrent default-setting/deletion and underlying account service behavior remain owner runtime/accounting acceptance; no new type lock or history transfer policy was invented. Shared base FK checks currently do not forward cancellation internally, although custom Add passes its token to that helper and every direct call. Existing SetDefault account-service messages and type-specific select eligibility remain their current source contracts.

Old /ContactGroup/create and /ContactGroup/details/:id routes were removed under modal/list-only UI1; use the preserved /ContactGroup menu entry. Inspected direct consumers use unchanged getSelectByType/GetSelect dropdown routes; no named second consumer of removed root read fields was found. FullListVM was left untouched, not newly introduced.

Guide file: `SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/contact-groups-topic.ts`; included in `administration-guide.ts`. Existing reader registration and Administration sidebar `/UserGuide/administration` retained. Topic identity `contactGroup.list`, operational route `/ContactGroup`. Covers purpose/prerequisites, filters/pager/sort/export, Create/View/Edit, validation/recovery, draft discard, default/activation/delete and default account constraints. Source conformance confirmed; reading/navigation/RTL/theme/print acceptance pending.

Agents: editor_worker and backend_worker used inherited parent model (mapped routine-worker model unavailable in the tool's routing). Root froze shared contracts first; editor owned only details files, backend owned only named service/VM/resource hunks. Root concurrently owned list/models/service/routes/translations/guide and integration, then reviewed and corrected final DTO flattening, initial-focus release and unavailable-center recovery. Independent file ownership reduced waiting and avoided merge risk; no duplicated broad scan, overlapping agent edit or uncontrolled delegation.

Suggested commits (never executed):

- Frontend: `refactor(contact-groups): adopt shared list and modal editor`
- Backend: `fix(contact-groups): validate writes and protect referenced groups`

Only this task's listed files/hunks belong to these commits; existing unrelated changes are excluded. Reviews remain local/unversioned under the standing documentation-owner boundary.

No builds, tests, lint, migrations, database commands, browser/application verification, commits, pushes, deployment, Sigma MCP or Graphify were run. Delivery is **Implemented — source-only**, with owner compilation/runtime/visual verification pending.
