| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |

# Customer Projects review

Frozen handoff: CUSTOMER_PROJECTS_FULL_STACK_CONTRACT_FREEZE.md. Scope, decisions, conformance references and original modifications are recorded there.

## Result and files

Confirmed findings repaired: legacy ms-lib grid; list model missing displayed name and carrying unused fields; untyped forms/payloads carrying client tenant; routed simple editor; missing loading/error finalization; Update forcing active=true; missing delete/discard confirmations; oversized nested backend read contracts and ReverseMap; Add250/Update50 name mismatch; missing screen guide.

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

- `src/app/modules/Administration/CustomerProjects/CustomerProject/components/list/list.component.{ts,html}` and `components/details/details.component.{ts,html}`: TS/HTML replacement; the two empty SCSS files and two creation-only placeholder specs removed. List spec previously tested unrelated Widgets ListsComponent, so no meaningful feature regression coverage was removed.
- Same feature `customerproject.routes.ts`, `models/{list,details,create}.ts`, `services/customerproject.service.ts`.
- `src/app/_metronic/layout/layout.module.ts`: only CustomerProject service import and duplicate providers removed.
- `src/app/_metronic/layout/components/toolbar/toolbar.component.ts`: only CustomerProject title exclusion added.
- `src/app/modules/i18n/vocabs/{en,ar}.ts`: only new customerProjects block, 35 matching keys.
- `src/app/modules/UserGuide/content/customer-projects-topic.ts` added; existing `administration-guide.ts` imports/registers that topic. Other pending module topics preserved.

Backend repository: `F:/My Work/Sigma/SigmaBackend`.

- `SiGma.ViewModels/ViewModels/CustomerProject/CustomerProject{Add,Update,List,Detail}Vm.cs`: lean reads; explicit write inputs and validation.
- `CustomerProjectFullListVm.cs` removed after symbol lookup found only its declaration; no named export/picker consumer.
- `SiGma.Business/MapperConfig/CustomerProjectProfiler.cs`: four directional maps with Customer.Name flattening.
- `SiGma.Business/Services/CustomerProjectService.cs`: list projection and dependency-aware delete hooks only.

No entity, EF configuration, migrations or model snapshots changed. Existing detail-file icon additions survive as shared Save/Cancel/Edit controls and row Delete with the same Bootstrap icons. Other user/peer working-tree changes were preserved; shared files already contain unrelated hunks and must be staged selectively.

## Decisions and evidence

| Decision | Final contract and evidence |
|---|---|
| Pattern/reference | UI01: fields only → list-owned modal by UI13. Job list is the list shell reference; actual EditorDialog/FormSection declarations own modal composition. BE1 uses BranchService/BranchProfiler and generic Service hooks. |
| Grid and ListVM | Grid: Actions, name:text/link, customerId:number, customerName:text, isActive:status. ListVM: Id, Name?, CustomerId?, CustomerName?, IsActive?; frontend mirrors these five fields with number identity. Actions need Id/IsActive only. |
| Removed read fields | List: inherited SubscriptionId, IsValid, IsChanged, No, GUID, CreatedAt, CreatedBy and nested Customer. Detail: those fields plus IsDeleted. Frontend also removes invalid projectId and unused deletedAt/deletedBy fields. Direct symbol consumers are scoped feature/controller/interface/profile only. |
| Detail | Same five displayed/identity fields; LeanDetailBaseVm supplies Id. Customer ID remains visible alongside its label. Inherited GetByWithNavigationsId loads the relation; no duplicated Detail override. |
| Write | Create: name, customerId, isActive. Update adds numeric id. Name required/max250 on both boundaries; nullable positive supplied FK. IsActive is an actual original screen-editable input, so it remains explicitly declared, including false/null. Tenant, number and audit stay server-owned. |
| FK/lookup | Actual Customer/GetSelect producer returns Individual/Company Partner IDs; entity FK principal is Partner, so identities match. Base InvalidInputAsync checks live tenant FK. Historical missing choice displays detail label and requires replacement/optional clear in editor; no forbidden choice is recreated. No subtype restriction was invented. |
| Unique name | No CustomerProject unique index, UniqueColumns or source-supported business-key contract exists. Preserve identity-only uniqueness; do not infer a new duplicate-name ban. |
| Filters | name → Filters[name] generic Contains. Inactive checkbox false → no flag; true → Filters[isActive]=false, preserving serialized false. All states default. |
| Paging/sort/export | UI default15, choices10/15/20/50/100, resolveListPaging before state writes, server base count/clamp/stable Id tie. Sort whitelist name/customerId/isActive; customerName not sortable. Applied filters persist separately from draft and in list URL. fetchAllPages collects every page100; dataTableExportRows supplies grid columns and click-time translations; failed page creates no file. |
| Modes/routes | /CustomerProject lazy list only; mounted dialog receives create/view/edit and numeric id. View displays text and skips edit-only lookup; Edit action reuses that dialog. Removed old /create and /details routes have no remaining in-app consumers. Historical bookmarks to those editor routes must use the list. |
| Confirmation/recovery | Delete and activation confirm identified record; dirty X/Cancel/Escape/navigation share deferred freezeFormState confirmation. Cancel restores disabled-state snapshot, values and dirty state. Save failure restores draft; success closes/refreshes applied list. Last-row delete moves to previous page. |
| Feedback/cancellation | Inline list/detail/lookup suppress error interceptor and handle both failure channels; API mutations retain one global feedback owner. Every screen load/action/save pairs loader cleanup in finalize. List Subject/switchMap rejects superseded responses; dialog is mounted per session and all requests use takeUntilDestroyed. |
| Provider/auth | CustomerProject service providedIn root; duplicate LayoutModule provider removed. AppModule supplies withInterceptors(tokenInterceptor,errorInterceptor); tokenInterceptor adds Bearer and UI culture for environment.baseUrl requests. No feature client/manual header or permission API. |
| Transactions/calculation | Generic Add/Update/Delete/Activate each reach one SaveChanges in the scoped context: implicit EF transaction; no explicit transaction or derived calculation. No invoice/posting/financial effect. |
| Schema | No entity/EF property/nullability/length/index/relationship change. Add-Migration is not required. DTO validation aligns with existing Add250 without narrowing persisted values. |

## Actions and override reconciliation

| Action | Source/target and API | Final behavior |
|---|---|---|
| Create / Edit | POST / PUT CustomerProject; client fields above (+id on Update) | Explicit dialog mode, validation, frozen draft during save, one success owner; refresh after success. |
| View | GET CustomerProject/GetByWithNavigationsId/{id} | Existing inherited endpoint, lean typed result, no customer lookup, read text, Close/Edit. |
| Delete | Any live record → deleted; DELETE CustomerProject?id={id} | Confirmation identifies name/id; RemoveWithChildrenAsync rechecks live row and EF inbound usages. Existing backend soft-delete boundary retained. Failures keep row; successful last-row delete backs up a page. |
| Activate | IsActive false/null → true; POST CustomerProject/handleActivate {ids:[id],isActive:true} | State-aware row action, confirmation, generic live/tenant all-ID validation then tracked save; refresh applied page. |
| Deactivate | IsActive true → false; same endpoint with false | Confirmation and generic tracked state update; no new edit/delete lock or permission. |

Job reference View/Edit/Delete Supported. Labour Time, Invoice Customer, Close, Cancel Job, Quality Check, Log, Estimation and Print Gate Pass Not Applicable: CustomerProject has none of those aggregates, child lines, job states or accounting dependencies. Create/Search/Reset/Export supported by read/write contracts. Activation uses the existing inherited CustomerProject controller action, rather than importing a Job transition.

Authorization candidates: POST/PUT CustomerProject, DELETE CustomerProject, POST CustomerProject/handleActivate. Current mechanism is authentication and tenant boundaries only; UI disabled/visibility gates are state handling and do not secure permissions.

| Override | Reason | Reconciled |
|---|---|---|
| MaterializeListAsync | ProjectTo supplies displayed CustomerName through relation without oversized navigation response | yes |
| RemoveAsync | Generic dependency-aware RemoveWithChildrenAsync before soft-delete | yes |
| Add/Update/GetMany/Detail/HandleActive/controller | Inherit generic validation, mapping, count, paging, result and one-save behavior | no override needed |

## Final conformance and reconciliation

| Concern / producer → consumer | Owning guide and actual final source | Result |
|---|---|---|
| Container/title/filter/grid | UI1/3/4/6; list host sigma-route-host → sigma-list-page/panel/header/table; FeatureTitle inside panel, toolbar exclusion; stableLayout true; DataTable fill true | Source matched Job shell; runtime pending |
| Column/DTO contract | UI5, BE3/7; CustomerProjectListVM → CustomerProjectDTO → columns/actions | Five fields matched; no unused read fields |
| Query/count/pager | BE9/13, UI2/6; toListParams → base ListQuery/CountAsync/ApplyListOrder/NormalizePaging → Results.totalCount → DataTable.first/rows | Matched; no client slicing or rows.length total |
| Export | UI8; getAllList/fetchAllPages → dataTableExportRows/current translator | All matching pages, grid fields/status text and safe failure |
| Editor/form/detail/save | UI13/15/19; EditorDialog contentPadded true, max/width public inputs, form/body/scroll flex-fill autoheight chain, one FormSection, typed controls/FieldError; lean detail and write VMs/profile | Mode/read/validation/payload aligned |
| Dirty decisions | UI10/27/28; list CanDeactivate → Details.canDeactivate; frozen confirmation, scoped Escape, initial closeButtonId/focusField | Accepted decision avoids its own still-pending flag; owner keyboard/navigation acceptance pending |
| Mapping | BE4; exactly four one-way maps, null-safe Customer.Name flatten; no ReverseMap/Ignore | Matched |
| Translations | UI23; new customerProjects namespace plus used neutral general keys | 35 EN/AR parity keys; missing general.activate/deactivate references corrected to feature captions |
| Providers/events | UI1/22; root service/AppModule client; child closed(saved) → parent refresh; same query snapshot | Matched; no duplicate toast |
| Screen guide | Master7; customer-projects-topic → ADMINISTRATION_GUIDE reader, existing /UserGuide/administration sidebar entry | EN/AR purpose, prerequisites, search/reset/paging/export, create/view/edit, status/delete, draft protection, name250, optional/historical customer, manual mock Save and no financial effect aligned |

Responsive source matrix: wide1600/1366; filter grid sides1250/1251, narrow disclosure1199/1200; shell inset991/992; editor grid1024/1025 and700/701; list/filter720/721; dialog767/768, FeatureTitle650/651 and footer620/621; representative intermediate900 and narrow375 at short/tall heights. Shared owners retain 34px controls, logical insets, bounded labels/dropdown overlay, card tokens, row scroll/fixed paginator and editor inner scroll/fixed footer in LTR/RTL and light/dark. The feature adds no presentation CSS. These are source cascade checks; resizing/visual/focus/print acceptance remains pending.

Shared-extraction gate: reuse existing DataTable, EditorDialog, FormSection, FilterPanel, FieldError, StateMessage, ConfirmationDialogService presets, freezeFormState, focusField, toListParams/fetchAllPages/dataTableExportRows and list-route-state. Remaining code is feature orchestration/typed contracts, not a new reusable presentation or domain capability. No new book/skill rule was established; no canonical or generated-packet edit required.

## Verification, risks and handoff

- Phases00–06 applied: discovery, frozen domain/API, list/grid, detail/write, delete/activation, wiring/guide, final reconciliation. PLAN00 skipped: bounded conformance task with no new shared business capability. Child/document/upload/report/financial workflows Not Applicable.
- Recipe -Check passed all8 packets before use and again at handoff; phase00–06 semantics reconciled with canonical owners. No regeneration needed.
- Syntax-only parser checked 10 feature/guide TS/HTML files, zero diagnostics after fixing one editing syntax error. This is parsing only, not type checking, Angular application compilation or a test run.
- Local import-path/used-translation-key source scan found no missing imports; its four missing neutral activation captions were corrected to new matching feature keys. Check-Translations reports35 EN/AR, zero missing or case differences.
- Complete feature/backend scoped diffs reviewed separately in the two actual Git repositories; own CustomerProject hunks in already modified shared files reviewed without adopting/reverting unrelated changes. New guide content reviewed from source. Scoped git diff --check passed. No stale ms-lib/ListCol/ColType/any/client tenant/ReverseMap/silent undefined callbacks/merge markers remain in scoped runtime files.
- Exact shared exports, template registrations and public input names checked against current component declarations. ES2018 library retained. Existing runtime components remain reached by lazy-route imports and list imports; no broad tsconfig include or test-root widening.
- Owner verification pending: application compilation/types, database-backed paging/projection/customer relation, validation replay, all action/failure/cancellation paths, old bookmarks, keyboard/focus return, responsive/RTL/theme and guide reading/print. No claim of runtime success or deployment readiness.
- Backend list/detail contracts are deliberately narrowed; deploy frontend/backend together. External API consumers outside this repository should be checked by owner. Nullable activity is retained; no concurrency-version policy was introduced, so concurrent ordinary edit semantics remain the generic service's existing behavior.
- Run no migration: entity/EF unchanged. No builds, tests, lint, migrations, database commands, browser automation/application verification, commits, pushes or deployments were run; no Sigma MCP or Graphify.

Agent utilization: one inherited-model backend_worker owned six non-overlapping backend files after root contract freeze, reducing backend/frontend wall-clock time. It wrote the six-file changes and stopped before its final audit due to a usage limit. Root reviewed/integrated all backend diffs, removed the unused FullList VM, owned frontend/guide and final reconciliation. No overlapping file writes.

Manual owner checks:

1. Compile both repositories; open /CustomerProject and confirm one title, columns, 15-row default, size-only paging, sort, total count, inactive-only false serialization, Reset and URL state.
2. Change draft filters without Search, then export/page/save/activate: all use the applied query. Export more than100 records and simulate one failed export page; no partial file should download.
3. Create/edit with name blank/spaces,250/251 characters, optional customer null, valid choice and missing customer lookup. Verify failed save preserves draft; false/null activity is not forced to true. Verify historical missing choice view/edit/clear behavior.
4. Verify read-only View skips lookup, Edit switches mode, Save refreshes; loading/details/customer failures show Retry and clear loaders.
5. Test X/Cancel/Escape/navigation with dirty draft: Cancel preserves values, Confirm exits immediately, pending decision blocks Save; reopened editor receives no old result. Test delete confirmation, backend reference blocker and deleting last row on a later page; activate/deactivate and failure retain expected row/state.
6. Check the responsive boundary matrix, Arabic/English, RTL/LTR, themes, short-height scrolling/fixed actions, keyboard focus return and /UserGuide/administration topic/print.

Suggested commits (only files listed above, selectively stage own shared hunks):

SiGmaAngularFrontEnd: `refactor(customer-projects): adopt shared list and modal editor`

SigmaBackend: `fix(customer-projects): align lean contracts and preserve active state`
