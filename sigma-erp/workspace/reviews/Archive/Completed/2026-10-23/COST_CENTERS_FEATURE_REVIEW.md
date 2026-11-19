# Cost Centers — review and implementation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |
| Frozen handoff | COST_CENTERS_FRONTEND_BACKEND_CONTRACT_FREEZE.md, including its superseding source corrections |

## Outcome and manifest

Implemented the user-authorized review and documentation-based fixes for `SiGmaAngularFrontEnd/src/app/modules/Administration/CostCenters`, including its directly related CostCenter API. Replaced ms-lib/routed legacy forms with the canonical bounded list and one Create/View/Edit modal. Fixed list-model identity/state/name mismatches, error recovery, dirty exit, server-owned write inputs, navigation-label projection, unsafe deletion and inconsistent update-name validation. Added the required bilingual in-app guide.

UI shape 01, backend pattern 1. Approved references: `Workshop/Job/components/list` for list shell/filters/table/export; shared `EditorDialogComponent` declarations and UI13 controlled composition for the modal; `BranchService` for the generic normal-entity hooks and metadata-aware delete. Applicable books: Master2–8, UI1–10/13/15/16/19/22–30, BE1–10/12/13/18/19. Recipes PHASE00–06 passed initial and final `Generate-SigmaRecipes.ps1 -Check`; no packet refresh was needed. PLAN00 was not required for this bounded existing CRUD correction. Child/upload, totals, posting, report and printing phases are Not Applicable.

Actual repositories: `F:/My Work/Sigma/SiGmaAngularFrontEnd` and `F:/My Work/Sigma/SigmaBackend`. CostCenter source was unchanged at entry. Many unrelated owner edits were already present, including migrations/snapshots, other Administration screens, layout, vocabularies and Administration guide; they were preserved. Further additive PaymentMethods vocabulary/guide edits appeared during work and were retained. Shared-file ownership for this task is limited to CostCenter keys, its topic import/registration/overview addition and two toolbar suppression lines. No commits or pushes.

## Evidence and decisions

E1 is `C:/Users/user/Desktop/666666666.PNG`, English/LTR historical functional evidence. Explicit items: list, Actions, name, code, active badges, Create, editor name/code/group and Save/Cancel. Current source separately confirms a group column. The screenshot does not prove menu actions, validation, uniqueness, state restrictions or persistence semantics. The implementation uses canonical presentation rather than reproducing screenshot geometry. No screenshot-backed required field/action is missing.

| Decision | Final result and evidence |
|---|---|
| Editor/route | Fields only, no children/totals/posting → one shared modal; `/CostCenter` is the only route. Parent passes mode/id and remounts per session; old create/details URLs are removed, with no remaining in-repository navigation to them. |
| Grid/ListVM | Actions first, then Name/Code/Group/Active. Frontend `id,name,code,costCenterGroupName,isActive` matches backend `Id,Name,Code,CostCenterGroupName,IsActive`. Id is numeric; nullable strings/active state are explicit. |
| Removed list members | Tenant, GUID, No, IsValid, IsChanged, CreatedAt/By and nested CostCenterGroup/editor-only group ID do not belong to this list. Removed unused CostCenterFullListVM after exact-symbol audit found no consumer. |
| Detail | Id/Name/Code/CostCenterGroupId/CostCenterGroupName only, using LeanDetailBaseVm. Embedded Asset, CostCenterGroup, ContactGroup full-list and opening-account detail consumers were audited; observed consumers use identity/name/code, not the removed audit/state/nested-group fields. External clients remain an owner compatibility check. |
| Writes | Name required/max250, Code optional nullable, group optional nullable; Update adds numeric Id only. No subscription, audit, GUID, active/delete flags or calculated fields are sent. Max250 derives from existing AddBaseVmWithName; Update stops inheriting the inconsistent max50. Entity/EF limits are unchanged. |
| Group label | Full base-chain audit proves CostCenterGroup inherits Name through EntityBaseWithDescription → EntityBaseWithName. Existing group Name remains the label used by select, list projection and sort. The preliminary Description-only inference in the freeze was withdrawn; CostCenterGroupService is unchanged. |
| Business key/schema | No CostCenter uniqueness rule exists in the service/config or supplied evidence; no new uniqueness/index/code-length rule is invented. No entity, EF, schema or domain-calculation change. |
| FK/deletion | Generic base validation checks supplied positive/live/tenant group IDs. Delete uses RemoveWithChildrenAsync with no owned children, checking metadata-driven inbound references before soft deletion. |
| Mapping | Four one-way maps only: Add→entity, Update→entity, entity→Detail and entity→List. Both read maps flatten Group.Name with null handling. No ReverseMap or defensive Ignore. |
| Transactions | Inherited one tracked save for Add/Update/Delete/activation; EF implicit transaction is sufficient. No explicit transaction or accounting effect added. |
| Appearance | Shared route/list/title/filter/table/dialog/form-section/error/button owners; no feature palette or stylesheet. Empty styles and the broken generated smoke spec referring to a nonexistent DetailsComponent were removed. |
| Error/feedback | Inline reads send X-Skip-Error-Interceptor and handle declared/HTTP errors with visible retry/state. Standard writes use the root global interceptor for the one failure/success notification and restore draft/row locally. All primary loaders finalize; auxiliary group choices use local loading. |
| Authentication | Existing AuthGuard and root AppModule HttpClient token/error interceptors. Existing LayoutModule service providers resolve that same client; no new client/provider/manual token/permission API. |

## Filter, paging and export contract

| Control | Serialized/backend key | Semantics |
|---|---|---|
| Name | Filters[name] | trimmed nonempty Contains on Name |
| Code | Filters[code] | trimmed nonempty Contains on Code |
| Group | Filters[costCenterGroupId] | nullable positive numeric FK equality |
| Active | Filters[isActive] | null means all; true/false equality, false retained |
| Sort | Filters[sortField], Filters[sortOrder] | UI group field costCenterGroupName maps to navigation key costCenterGroup; other fields name stored columns |

`toListParams` omits empty/null values and preserves false. URL serialization explicitly converts the active boolean to text because the current shared route writer drops boolean false. Paging/sort/export/row-action refresh use applied filters, never unsent edits. Default15 rows, 10/15/20/50/100 choices, `resolveListPaging` before state update, inherited count/page metadata and Id tiebreaker. List trigger uses switchMap so newer page requests cancel older reads. Export uses fetchAllPages and dataTableExportRows with click-time translated headers/status; any failed page prevents a partial file. Last-row deletion steps back; an out-of-range response requests the last available page.

## Actions, modes and integration

| Action | Source → target | Exact API / Angular method | Confirmation, failure and refresh |
|---|---|---|---|
| Create/Save | new draft → saved record | POST CostCenter; createCenter | No ordinary confirmation; typed input validation, freeze controls, retain draft on failure; closed(true) refreshes applied list |
| View | existing row → read-only modal | GET CostCenter/GetByWithNavigationsId/{id}; getDetails | No confirmation, no Save, no edit-only lookup; displays saved group label |
| Edit/Save | existing row → updated record | PUT CostCenter `{id,name,code,costCenterGroupId}`; updateCenter | Detail must hydrate; group lookup must succeed; save freezes draft and rejects repeats; failure restores it; success closes/refreshes |
| Delete | existing live row → soft deleted | DELETE CostCenter?id={id}; deleteCenter | Shared destructive confirmation names record and supplies subtitle/warning; backend blocks inbound references; keep row on either failure; refresh current/previous page on success |
| Activate | IsActive false/null → true | POST CostCenter/handleActivate `{ids:[id],isActive:true}`; setActive | Shared warning confirmation, guarded execution, generic tenant/live validation, retain row on failure and refresh applied page on success |
| Deactivate | IsActive true → false | same route with isActive:false | Same lifecycle; active-only GetSelectByGroup omits inactive centers |
| Export | applied list → complete Excel | GET pages through getAllList | No confirmation; all-pages read/error recovery; no mutation |

Reference action coverage: View/Edit/Delete and list Create/Export are Supported. Job-specific labour time, invoice, close/cancel, quality check, logs, estimation and gate pass printing are Not Applicable: CostCenter has no corresponding domain state/aggregate/endpoint. Generic activation/deactivation is Supported by the actual inherited API. There are no hidden/no-op placeholder actions.

CanDeactivate delegates to the mounted editor. View/pristine close silently when idle; dirty Cancel/X/Escape/navigation use the same deferred shared discard decision. Pending decisions freeze controls, cancellation retains values/dirty state, accepted close does not wait for the pending flag's later finalize. Busy writes/reads/mock assistance block exits. Every subscription tears down on DestroyRef; visible/session checks prevent stale detail/lookup hydration. A saved group absent from live choices is historical text, never reintroduced as selectable; Save waits for a current group or explicit optional clearing. Mock generation fills drafts only; manual Save remains the business writer.

Override audit: CostCenterService.MaterializeListAsync is necessary for SQL navigation-name projection; RemoveAsync is necessary for inbound-reference-aware deletion. No Add/Update/detail/list/order/action/controller/CostCenterGroup overrides were introduced. Deep-detail navigation loading is inherited and supplies Group.Name. GetSelect/GetSelectByGroup retain existing consumers/envelopes.

Authorization candidates: DELETE CostCenter?id and POST CostCenter/handleActivate (plus administration maintenance writes for future policy design). Authentication is not role authorization; no invented permission mechanism or security claim from action visibility. Activation is an idempotent state assignment; backend does not require a previous-value concurrency token. Delete reference precheck and save retain the shared helper's concurrent-new-reference race; no new isolation guarantee is claimed.

## Final reference conformance and responsive matrix

| Concern | Actual compared target/reference/shared owner | Source result |
|---|---|---|
| Shell/title | CostCentersComponent.host = JobsComponent.host sigma-route-host; list page→panel→header/table hierarchy; FeatureTitle inside panel; ToolbarComponent suppresses CostCenter title | Matched; no page-height calculation, no duplicate toolbar title |
| Filters/actions | CostCenter form[appFilterPanel], mainColumns4/stableLayout/resetRequested, FilterActionsDirective and shared PrimaryActionButton | Matched; shared control34px/default gaps/disclosure own layout; four domain fields only |
| Table | app-data-table fill=true/lazy=true, numeric identity, typed columns/actions, totalRecords, shared page resolver/export | Matched; rows scroll internally, fixed pager and translated costCenter.showingEntries |
| Modal | CostCenterDetailsComponent consumes EditorDialog public640px width, viewport max bounds, padded body, flex-fill form/body/scroll, explicit mode | Matched UI13; one internal scroll owner, fixed shell/footer, no tabs or feature shell CSS |
| Validation/exit | Required/max250 Name plus app-field-error; freezeFormState, focusField stable close/invalid IDs; deferred canDeactivate | Matched UI10/19/27/28; View has read spans and Close only |
| Backend | CostCenterProfiler read Name flatten; ProjectTo list; BranchService metadata-delete helper; inherited paging/write boundaries | Matched final frozen contracts; see above superseding group/base-chain evidence |

| Size/range | Expected arrangement from final shared cascade | Acceptance |
|---|---|---|
| >1250px, including E1 width1730 | Four main filter columns; title/actions in ordinary row; editor has two field columns | source conforms, visual pending |
| 1200–1250px | Shared filter rule uses three columns; fourth field wraps; controls retain shared line height | source conforms, visual pending |
| 721–1199.98px, including1024/768 intermediates | Three filter columns with shared collapse disclosure; dialog bounded to viewport, width640px | source conforms, visual pending |
| <=720px; both sides700px | Filters one column/actions stack; editor two columns until700px, then one | source conforms, visual pending |
| <=650px; 520/390/360px | Title/action group wraps; shared small action sizing; dialog viewport width below767px, internal scroll retained | source conforms, visual pending |
| Short heights; EN/AR long text; RTL/light/dark | Shared min-height0/overflow boundaries, viewport max-height, body overlay/focus/theme tokens; no feature overrides | owner visual/keyboard/height acceptance pending |

The cascade inspected includes later filter inline/responsive opt-ins; they do not apply to this consumer. No local breakpoint can override shared rules. Print is Not Applicable to this master screen; guide printing stays owned by the existing reader.

## Guide and changed files

New `src/app/modules/UserGuide/content/cost-centers-topic.ts`, registered in existing `administration-guide.ts`. Existing reader `/UserGuide/administration`, Administration menu guide entry, and operational menu `/CostCenter` remain. Topic `costCenter.title` covers purpose/prerequisites, Search/Reset/paging/sort, Create/View/Edit, active state, dependency-blocked deletion, full export, dirty exit, validation/unavailable group, errors/retry and draft-only mock assistance. Authored EN/AR content is separate from presentation and matches final source; reader/RTL/theme/print acceptance is pending.

Frontend changes under CostCenters: routes; list/details TS+HTML; create/list/details models; service; removed both empty SCSS files and broken details smoke spec. Shared edits: CostCenter-only blocks in en.ts/ar.ts, two CostCenter toolbar lines, guide registration/overview and new topic. Backend: CostCenterService, CostCenterProfiler, CostCenterListVm/DetailVm/UpdateVm and removal of unused CostCenterFullListVm. No entity/config/migration/snapshot, other feature source or approved reference was changed by this task.

## Reconciliation, verification and handoff

| Comparison | Final evidence | Result |
|---|---|---|
| Screenshot/fields/actions | list four data columns; modal name/code/group and Save/Cancel | confirmed scope covered |
| Grid/DTO/projection | five UI/backend row properties; null-safe Group.Name SQL projection | source matched |
| Filters/pager/export | exact keys, true/false/null handling, CountAsync metadata, all-pages helper | source matched |
| Form/write/backend | three editable fields + update Id, max250 parity, generic FK validation | source matched |
| Save/action/feedback | finalize, shared confirmation, global mutation feedback, closed/same-page refresh | source matched |
| Modes/routes/providers | list-only modal mounting/guard; root interceptor-enabled HttpClient | source matched |
| Guide/translations | topic registration, operational/menu routes; costCenter EN/AR39 keys, zero missing/case differences | source matched |
| Source hygiene/diffs | scoped diffs inspected independently in both repositories, whitespace/markers/imports/models/overrides checked | source matched; owner changes preserved |

Read-only source syntax parsing covered12 TypeScript files and2 Angular templates; it is not compilation/type checking. Named shared exports, standalone registrations and used input types were inspected directly. Final checks show no ms-lib/any/server-owned payload/local CSS/merge marker remnants in the feature. The only confirmation is the shared service. Recipe hashes remain current. No new shared capability qualified: repeated presentation/query/paging/export/error/discard/focus/state mechanisms reuse their existing owners; record-specific state stays local. No new reusable rule was introduced, so books/skill/changelog/packets need no rule promotion/regeneration.

No unresolved Missing/Conflicting/Uncertain requirement blocks the confirmed refactor. Screenshot-unproven uniqueness/code-limit policies are intentionally not changed. External clients may observe narrowed read JSON; runtime AutoMapper/EF translation, compiled Angular registration, keyboard focus return and responsive visuals remain owner checks. Legacy direct create/details bookmarks now need the list route.

Owner verification: build both applications; create/edit a51–250-character name, reject empty/space-only and251 characters; save code/group as null; verify group names/select/View/sorting and optional unavailable-group clearing; exercise declared/HTTP failures and Retry without losing drafts or leaving busy state; test dirty Cancel/X/Escape/navigation; verify active/inactive filter survives refresh, state actions and active-only lookup; delete a referenced center (blocked), then an unreferenced last page row; verify export count/translated columns across pages; check responsive matrix, RTL/themes and guide reading/printing. No build/test/lint/browser/runtime/database/migration/commit/push/deployment/Graphify/Sigma MCP command was run.

No Add-Migration is required: all entity/EF/storage configuration is unchanged. Suggested commits, covering only this task's listed files/hunks:

- SiGmaAngularFrontEnd: `refactor(cost-centers): adopt shared list and modal editor`
- SigmaBackend: `fix(cost-centers): align read contracts and guard deletion`

Agent utilization: one bounded `sol_worker` role using gpt-5.6-sol handled the five exclusive CostCenter backend implementation files and its implementation notes after freeze. Delegation reduced overlap while root implemented frontend/guide. The worker left source/notes but ended with a usage-limit status; root independently reviewed/integrated its output, audited the complete base chain, removed FullListVM and owns this final report. No overlapping implementation ownership or additional agents.
