# Payment Methods — confirmed screen fixes

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |
| Scope | Administration/PaymentMethods, directly related backend contracts and one Common Settings consumer |

Contract: [PAYMENT_METHODS_SCREEN_CONTRACT_FREEZE.md](<PAYMENT_METHODS_SCREEN_CONTRACT_FREEZE.md>), including its explicit direct-consumer amendment. The original proposed composite uniqueness rule was withdrawn on source evidence before backend implementation; it is not implemented or retroactively justified.

## Outcome and findings

Replaced the existing ms-lib list and routed legacy form with the canonical shared list and one controlled Create/View/Edit modal. The old delete menu only logged to the console; the new action uses shared record confirmation, backend usage checks and soft deletion. The previous editor had no validators, sent tenant/audit/base fields through an oversized write interface, omitted commission metadata, fetched full paged Branch/User lists for options, and ended loading only on success. Those confirmed defects are repaired. The Update named base previously capped Name at50 while Add permitted250; the feature now declares the same required250-character Name over UpdateBaseVm, without changing the shared base or database.

Source authority: F:/My Work/Sigma/AGENTS.md; sigma-screen-refactor skill; Master2/4/5/7; UI screen01 and applicable1–10,13,15,16,19,22–30; backend Pattern1 and blocks3–10/13/19. Known generic debts (tenant payloads, old enum/table components, ReverseMap, over-wide DTOs and missing reference-aware delete) were identified against the backlogs rather than presented as newly discovered global issues. Recipe -Check passed all eight packets; phases00–06 were read and used for their applicable scope. No packet/template/book changed and no regeneration was necessary.

## Evidence and scope decisions

E1 is `C:/Users/user/Desktop/55555555555.PNG`, English/LTR desktop1720×754, a list with Create modal. Capture date/version/role Unknown. Its visible fields/actions are Explicit functional/content evidence; layout, colors and control choice come from the approved books. Active means the existing PaymentMethod.Active, preserving the separate legacy EntityBase.IsActive compatibility contract. Branch/User null represents no configured restriction; no new access rule is imposed.

| Item | Final decision and evidence |
|---|---|
| Currency in E1 | Explicit visible content but Missing current entity/DTO/API contract. The request authorizes document-supported fixes, not explicitly adding missing screenshot business. No CurrencyId, currency restriction, financial rule or backfill was invented. Separate follow-up |
| Duplicate business key | Missing exact invariant. E1 repeats codes across categories; Common Settings copies PaymentMethod graphs. A global/composite unique index may break that writer. Deferred together with settings relationship ownership; no data cleanup/index change |
| CommissionPercentage | Existing entity/write/detail field consumed by Receipt and Rental/Lease deposit reads. Exposed as optional editable percentage0..100; all voucher calculations and financial eligibility remain backend-owned and unchanged |
| Name length | Add's existing250 limit retained; Update now agrees. Required at both boundaries. No entity/EF length change |
| BranchId | Already nullable in entity; corrected Add/Update/Detail types from int to int?; existing no-restriction option is now usable |
| Lookup identity | Branch/GetSelect and User/GetSelect use owning entity IDs via DropDownSelect. Form ids normalize to positive numeric IDs; base EF FK validation remains authoritative |
| Transaction | Generic Add/Update reach one scoped SaveChangesAsync; EF implicit transaction. No new transaction or financial side effect |
| Auth | Existing authenticated base controller/root AuthGuard. POST/PUT/DELETE master maintenance are authorization candidates; there is no invented permission API |

## Read contract and implementation

Grid order: **Actions, id, name, category, type, code, branchName, userName, active, createdBy, createdAt**.
ListVM beside it: **Id, Name, Category, Type, Code, BranchName, UserName, Active, CreatedBy, CreatedAt**. Every non-action property is rendered; id also identifies actions. Removed unused tenant/GUID/No/base flags, editor-only CommissionPercentage, foreign IDs and nested Branch/User graphs from the screen list. Historical nullable Name is represented in read types; required write names remain nonnullable.

| Filter | Angular/query/backend key | Parsing/default |
|---|---|---|
| Name or code | search / Filters[search] / SearchColumns | Trimmed text; absent matches all; Name OR Code |
| Category | category / Filters[category] / Category | Numeric enum; null omitted;0 retained |
| Type | type / Filters[type] / Type | Numeric enum; null omitted;0 retained |
| Active | active / Filters[active] / Active | bool; null omitted;false retained |

Root GET retains base paging/count/filter/sort machinery. Service SearchColumns names Name/Code. MaterializeListAsync projects the flat names with ProjectTo; no GetManyAsync override. Stored fields id/name/category/type/code/active/createdBy/createdAt are sortable; branchName/userName are deliberately non-sortable because those flattened names are not stored entity properties. The frontend derives its whitelist from these columns.

UI starts at15 rows with10/15/20/50/100 choices; API clamp1–100/count/total-pages comes from the base. resolveListPaging compares prior state before writes, including page-size-only changes. Subject→switchMap→defer cancels older reads and pairs loading/finalize. Identical paging/sort events do not re-fetch. Explicit Search applies a snapshot; page/sort/refresh/editor success/delete/export use it. URL restoration validates enum choices; the inactive false selection is serialized as text because the existing shared route helper drops boolean false. No helper or unrelated consumer was changed.

Excel calls fetchAllPages with100 rows per request and current applied filters/sort, then dataTableExportRows with current-language translated headers/enum/status/date values. A failed page produces feedback and no partial file. No print workflow was invented.

## Editor/write/actions

| Field | Form | Add/Update | Detail | Ownership/validation |
|---|---|---|---|---|
| Name | string | Name | Name? | Client input; required/max250; trimmed before submit |
| Category | enum or null | Required PaymentCategory? with EnumDataType | PaymentCategory | Numeric enum IDs;0 valid; omitted/undefined value rejected by API |
| Type | enum or null | Required PaymentType? with EnumDataType | PaymentType | Numeric enum IDs;0 valid; omitted/undefined value rejected by API |
| Code | string | Code | Code | Optional; trimmed; no guessed uniqueness/length |
| Branch | number or null | BranchId? | BranchId?, BranchName? | Optional live/tenant FK |
| User | number or null | UserId? | UserId?, UserName? | Optional live/tenant FK |
| Active | bool | Active | Active | Existing business flag, no base-flag conversion |
| Commission | number or null | CommissionPercentage? | CommissionPercentage? | Optional0..100, no calculation added |
| Identity | No editable control | Update.Id only | Id | Server-generated root identity |

Writes omit SubscriptionId, No, GUID, IsDeleted, IsActive/IsValid/IsChanged, audit fields and totals. Typed payload is built explicitly from getRawValue. No ReverseMap remains. Four directional screen maps plus a justified fifth read map for the named Common Settings options consumer; no defensive Ignore chains. Flat names map through actual Branch/User navigation Name.

Create loads only live branch/user selects; Edit first requires a successful matching detail snapshot, and both editable modes wait for lookups. Failed detail/lookup requests show inline StateMessage with Retry and retained values. View consumes the same lean detail, skips edit-only lookups, renders saved names as text, disables the form, hides Save and offers Close. Missing historical labels remain empty; no deleted option is reintroduced.

Save marks fields touched, focuses the first invalid field, freezes the submitted form and releases loading on success/failure/cancellation. Successful standard mutations use the existing interceptor's one success toast, close and refresh. Declared/HTTP failures keep draft/row; no duplicate feature error toast. Read requests with inline feedback carry X-Skip-Error-Interceptor.

Cancel/X/Escape/navigation share the deferred canDeactivate decision. View/pristine closes directly; dirty edit freezes controls during shared confirmDiscard and restores the same form on cancel. Accepted close does not incorrectly reject the decision while its finalize is pending. Shared mock generation is excluded from View and blocks exits while it freezes the editable form.

| Action | Endpoint/path | Backend behavior | UI/recovery |
|---|---|---|---|
| Create/Edit | POST/PUT PaymentMethod | Inherited InvalidInputAsync validates live/tenant FKs; API write annotations; one save | Typed editor; busy guard; failed draft retained; successful close/reload |
| View | GET PaymentMethod/GetByWithNavigationsId/{id} | Existing navigation-aware detail path, lean shape | Read-only modal; identity check; inline Retry |
| Delete | DELETE PaymentMethod?id={id} | RemoveWithChildrenAsync inventories inbound EF references, rejects in-use/missing rows and soft-deletes | Shared named confirmation; double-action gate; retained row on failure; previous page when last later-page row is deleted |
| Active | PUT editable Active | Existing ordinary save | No guessed handleActivate transition using the wrong IsActive flag |

Job-reference action inventory: create/view/edit/delete supported in the normal-entity slice; labour/logs/close/quality/gatepass/lubrication/document/posting transitions Not Applicable because PaymentMethod owns no Job/document states or aggregate. Search/export/discard are owned by phases2/3, not new phase4 transitions. Phase4 is applied only to Delete.

Override audit: SearchColumns (Name/Code), MaterializeListAsync (flat navigation names), RemoveAsync (reference-aware delete). Removed redundant custom AddAsync so validation/audit/storage use their existing owners. Ordinary CRUD/select/count/sort/controller methods stay inherited.

## Direct-consumer compatibility

Common Settings previously fetched only the first root PaymentMethod page, typed it as DropDownSelect, stored an incomplete metadata object and compared numeric IDs to String(id). It consumes more than screen columns when creating its legacy nested payment-method write values. The new authenticated **GET PaymentMethod/settings-options** returns complete tenant/live options using existing PaymentMethodFullListVM with only Id/Name/Category/Type/Code/BranchId?/UserId?/Active/CommissionPercentage?. It has explicit complete-array count/page metadata and no mutation.

The directly affected Common component now uses that typed options endpoint, builds `value` from Name, matches numeric identity, preserves nullable references/commission and omits nested SubscriptionId. Its options request releases the loader in finalize and handles both failure channels with the global error owner. Existing top-level settings writer, navigation replacement semantics and unrelated settings code/owner changes are retained. The legacy settings graph-copy design and reload/selection hydration require their own scoped review; this task does not rewrite historical data or claim that design repaired.

Receipt, Rental deposit and Lease deposit consumers read Id/Type/CommissionPercentage from GetById; those fields retain their names/types. Banking and Payment Gateway use GetSelect; its inherited contract is unchanged. Settings read DTOs still embed PaymentMethod read DTOs; no consumer inspected relies on the removed audit/nested graph members.

## Final conformance and reconciliation

| Concern | Actual target/source comparison | Result |
|---|---|---|
| Shell/title | PaymentMethodsComponent host sigma-route-host; list template sigma-list-page/panel/header and FeatureTitle vs Job list/shared styles | Matched shared bounded host/card chain; no feature SCSS |
| Filters | Target4 controls; FilterPanel stableLayout=true/mainColumns4/resetRequested; actual directive export/import registration | Matched existing public layout/state contract; default34px/16px columns/7px rows/default action gap retained |
| Grid layers | Actual DataTable owns p-table/action/pager/status/empty; target one fill+lazy grid, typed columns/event/API totals/switchMap; no local styles | Matched four-layer source contract |
| Editor | Actual EditorDialog public inputs/padded content/default1040px width/max viewport bounds; target auto-height flex-fill form/body/scroll | Matched content-size alternative; fixed shared header/footer and one inner scroll owner |
| Fields | sigma-editor-grid default4 with shared34px controls; required FieldError below inputs; dropdown body overlays; NumericFocus directive export/import | Matched source owners;8 fields; no bespoke wrappers/palette |
| Read producer | ProjectTo<PaymentMethodListVM> flat Name navigation maps vs grid models | Reconciled exact displayed set |
| Write producer | Typed input snapshots vs annotated Add/Update and inherited base | Reconciled client ownership/nullability/name length/enums/percentage |
| Actions | New list Delete→typed service→generic controller→usage-aware backend | Reconciled confirmation, state cleanup and applied-filter/page refresh |
| Routing/providers | Existing pages/routing lazy /PaymentMethod; list-only child route+guard; PaymentMethodService providedIn root; removed LayoutModule duplicate import/provider | Reconciled existing AppModule client; no new client/header/permission |
| Translations | paymentMethod block and category/type keys in en.ts/ar.ts; shared existing general keys | Focused parity check returned no findings |
| Guide | PAYMENT_METHODS_TOPIC registered in existing ADMINISTRATION_GUIDE reader | Reconciled purpose, prerequisites, actions, limits, nullable references, commission, absence of currency, failures and dirty exit in EN/AR |
| Schema | Entity and EF configuration unchanged; no added property/index/length/nullability | No Add-Migration required |

Responsive source matrix (visual acceptance pending throughout): above1250 filters4 columns;1250/1251 checks filters3/4;1199/1200 checks shared disclosure;1024/1025 editor2/4 columns;1099/1100 dialog94vw/default width;767/768 dialog viewport gutter;720/721 filters1/3 and actions wrapping;700/701 editor1/2;650/651 shared title action reduction/wrap; representative1720 screenshot width,1366,1100,900,800,600,360 and short heights. Shared CSS cascade was inspected; no feature override competes. In every interval owner checks long EN/AR labels, LTR/RTL, light/dark, feedback, header/footer/pager visibility and internal scroll/focus. Source inspection does not prove all-size fit.

## Files and verification

Frontend feature changed: `components/list/list.component.ts/html`, `components/details/details.component.ts/html`, `models/create.ts/details.ts/list.ts`, `paymentmethod.routes.ts`, `services/paymentmethod.service.ts`; new `models/settings-option.ts`. Removed unused empty SCSS, two obsolete spec files (wrong component/reference), and unused `models/branch.ts/user.ts`. No test suite was run or new mirrored tests written.

Direct integration changes: `src/app/_metronic/layout/layout.module.ts` (PaymentMethod provider/import only), `src/app/modules/Administration/Settings/components/common/common.component.ts` (payment-method consumer only), `src/app/modules/i18n/vocabs/en.ts/ar.ts` (paymentMethod block only), `src/app/modules/UserGuide/content/payment-methods-topic.ts` (new), and `administration-guide.ts` (import/topic registration only). Extensive pre-existing unrelated differences in shared files were preserved; they are excluded from the suggested commit scope.

Backend changed: `SiGma.Business/Services/PaymentMethodService.cs`, `IServices/IPaymentMethodService.cs`, `MapperConfig/PaymentMethodProfiler.cs`, `SiGma.ServerAPI/Controller/PaymentMethodController.cs`, and PaymentMethod Add/Update/Detail/List/FullList VMs. Entity/config/resources/migrations/snapshots were not changed by this task.

Source verification: separate scoped Git diffs inspected in both real repositories; diff --check clean; imports/exports/standalone registrations/public inputs/base members inspected; existing ES2018 compatibility retained; nine feature/topic TypeScript files parsed with TypeScript createSourceFile and both templates with Angular parseTemplate, zero syntax/import-path findings. These are source parser checks, not compilation. Focused translation parity clean. Stale ms-lib/enum pipe/old routes/models/server-owned feature payloads and merge-marker searches clean. New untracked models/topic were reviewed separately because ordinary git diff omits them. Recipe fingerprints remain current.

Shared extraction: reused existing DataTable/FeatureTitle/FilterPanel/EditorDialog/FormSection/FieldError/StateMessage/PrimaryActionButton, enumOptions/translateOptions, fetchAllPages/dataTableExportRows, list-route helpers, ConfirmationDialog presets, focusField and freezeFormState. Nothing new qualified as a reusable abstraction/rule; feature-specific settings compatibility and unresolved duplicate policy stay in this report, so no book/skill rule was invented.

Agent utilization: one inherited-model backend worker was dispatched after freeze for non-overlapping files, but remained pending initialization and was interrupted before edits. Root performed backend work locally; no agent changes required integration. The initial delegation aimed to reduce wall-clock time; pending initialization removed that benefit. No uncontrolled/overlapping worker edits occurred.

## Owner handoff

No migration is needed for these final changes. Deploy/compile frontend and backend together because root List/Detail shapes and the named settings-options endpoint changed. Old /PaymentMethod/create and /details/:id child URLs were retired in favor of list-owned modes; no in-source link consumers remained.

Owner verification pending: compile both repositories; exercise Create/View/Edit/Delete and in-use blockers; check empty optional branch/user and invalid FK/undefined enum/commission/name failures; delayed list/lookup/detail and both failure channels; dirty Cancel/X/Escape/back and mock Apply/Cancel; paging15/size-only/sorting and Active=false restore; all-pages EN/AR Excel; the responsive/theme/keyboard matrix above; existing Common Settings payment-method option loading and preservation of metadata; Receipt/Rental/Lease type/rate compatibility. Verify one success/error notification and bearer headers without exposing tokens. Inspect database legacy data separately before any future duplicate/index policy.

No builds, tests, lint, browser automation/runtime verification, database commands, migrations, commits, pushes or deployment were run. No Sigma MCP/Graphify or retired guides were used. Full runtime/visual/database acceptance is not claimed.

Suggested commits (stage only this task's hunks/files):

- SiGmaAngularFrontEnd: `refactor(payment-methods): adopt shared list and controlled editor`
- SigmaBackend: `fix(payment-methods): align contracts and protect referenced methods`

Remaining follow-ups are explicit: per-method Currency is Missing; duplicate business key and Common Settings reference-versus-copy design need a separately scoped contract. The confirmed repairs are source-implemented; these exclusions are not represented as completed business functionality.
