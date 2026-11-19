# HRM Account Linking — implementation and reconciliation

| Gate | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-11 |
| Contract | [Frozen screen contract](<F:/My Work/Sigma/reviews/Archive/Completed/2026-10-23/HRM_ACCOUNT_LINKING_SCREEN_CONTRACT_FREEZE.md>) |

## Outcome and manifest

The generated HRM CRUD placeholder is replaced in place by the salary-item account-linking configuration shown in 6.PNG. The authenticated `/AccountLinking` route displays 18 named salary items in four columns. The server supplies which ledger cells are editable; the screen saves only those 20 editable links. Configuration is stored in the existing tenant-owned LinkAccounts table through the canonical keyed-settings helper. It does not create accounts, post journals, calculate salaries or change HRM Common/Pay Structure settings.

Scope: `SiGmaAngularFrontEnd/src/app/modules/HRM/Administration/Account Linking/LinkAccounts` and its direct route/title/translations/guide consumers; `SigmaBackend` LinkAccounts API, service, enum and direct automatic-link consumer. These are two actual repositories; the review directory is a local unversioned artifact owner. Existing StaffRole changes in both repositories, Department changes in the frontend, and their shared translation/guide/title hunks were preserved. Their authors are outside this chat and their content is not part of this deliverable.

Authority: `F:/My Work/Sigma/AGENTS.md`, `.agents/skills/sigma-screen-refactor/SKILL.md`, Master 2/4/5/7, backend 3/4/5/6/8/10/16 and UI screen 06 with blocks 1/2/3/10/14/16/19/22–29. Settings are the explicit exception to CRUD and child deletion-by-omission. UI reference: Accounts LinkAccounts details and shared table/title/actions. Persistence reference: ServiceHelper keyed settings (backend16), not the general Accounts service's custom reconciliation.

Initial and final recipe checks reported all eight packets OK. Used packets: PHASE-00, PHASE-01, PHASE-02, PHASE-03, PHASE-05, PHASE-06. Phases 00/01 established evidence/contracts; 02 addressed read/column compatibility without list paging; 03 addressed settings write/discard; 05 addressed route, DI and interceptors; 06 performed source reconciliation. Phase04 is not applicable to ordinary Save. No canonical books, templates or generated packets changed, so regeneration was unnecessary. No separate Maintenance/Evolution Plan was needed for this bounded, evidence-backed screen: existing shared LinkAccounts storage was inspected and extended rather than duplicated.

The earlier provisional implementation preceded the artifact gate. The freeze explicitly records this process defect; it was not retrospectively treated as conformance. Continuation source was checked and repaired against the recorded contract before this handoff.

## Evidence disposition

| ID | Evidence and classification | Implementation / limit |
|---|---|---|
| E6 | 6.PNG named rows, ledger columns and Save All: Confirmed | All 18 names and columns implemented |
| E6a | Grey/white cells: Confirmed interaction clue | Server eligibility and disabled controls match the frozen matrix |
| E6b | Two blank leading rows: Uncertain content | Omitted because no salary item can be identified; no business key invented |
| E7/E8 | Pay Structure groups: Confirmed separate screen | Outside the explicitly requested Account Linking directory |
| E9 | Common settings: Confirmed separate screen | No new mode, employer/WPS fields, attendance or gratuity calculation rules inferred |
| E-layout | Screenshot presentation | Functional evidence only; shared canonical shell/table owns appearance |
| E-posting | Payroll accounting use | No source consumer of the new HRM keys; no accounting effects introduced or promised |

No unresolved evidence blocks the named Account Linking screen. The unlabelled screenshot rows remain non-blocking Uncertain content. Broader Settings implementation would require its own screen contract.

## Decisions and reasons

| Master4 decision | Result and evidence |
|---|---|
| 1 Reference | UI screen06 Accounts details; shared EditableCollectionTable and FeatureTitle. BE16 ServiceHelper owns settings persistence |
| 2 Editor | Routed settings workspace, one subject; no record editor or artificial tabs |
| 3 Routes | One lazy `/AccountLinking` route with CanDeactivate; obsolete child paths redirect to the workspace |
| 4 Columns | Salary Item Type, Staff Ledger Account, Expense Ledger Account, Provision Ledger Account; no row actions |
| 5 Read VM | Only Value, SettingKey, EditableRoles and three AccountId outputs; no audit/tenant/record-action fields |
| 6 Writes | Existing mapping DTO holds Type, Value, SubType, AccountId, JobType, LinkSection; only eligible account IDs are editable; other dimensions are validated fixed keys |
| 7 Details | Same compact read supplies the inline editor; no separate record Detail contract |
| 8 Styles | Shared route/page/panel/title/table/controls; empty and copied feature SCSS removed; no cross-feature stylesheet |
| 9 Confirmation | Save is ordinary settings persistence and has no confirmation; no destructive action |
| 10 Discard | Shared deferred confirmation plus freezeFormState; cancel retains values and original disabled roles |
| 11 Backend | Several rows keyed settings, IServiceHelper plus one SaveChangesAsync, no omission deletes |
| 12 Entity | Existing LinkAccounts : EntityBase; repository owns tenant and audit state |
| 13 Key | Type=8/Value salary item/SubType ledger role/JobType=null/Default section; existing normalized unique index covers it; latest physical row and request last-wins rules |
| 14 FK/delete | Current tenant, active, live posting account required on read/select/write; nullable AccountId explicitly clears; no Delete endpoint/action introduced |
| 15 Filters | Not applicable: complete fixed configuration, no remote search/page/sort/export contract; dropdown search is local lookup search |
| 16 Translations | Root hrmAccountLinking block and 18 salary labels in EN/AR; five HRM server resources in neutral and ar-SA files |
| 17 Registration | Root feature/account services reuse BaseService HttpClient; AppModule token/error interceptors and backend scanned service/IServiceHelper registration already exist |
| 18 Migration | None: no entity, property/nullability, EF length/index/FK or model snapshot change |
| 19 Action coverage | Reference actions classified below; no unsupported financial/automatic actions copied |
| 20 Overrides | No override in target service/controller; explicit existing API shape extended instead of forcing generic CRUD |
| 21 Evolution | Bounded screen correction with inspected current storage and frozen contract; no ambiguous cross-module replacement |
| 22 Collection | Settings exception BE16; all editable displayed links sent by UI, but omission on server preserves rows |
| 23 Money/VAT | Not applicable: no amount/formula/totals; existing salary-calculation enums and payroll writers untouched |
| 24 Authorization | Candidates: read HRM configuration and save HRM configuration; current boundary is AuthGuard/Authorize plus tenant query, no permission API invented |
| 25 Correctness | Preserve configuration, isolate accounting surfaces, reject invalid keys/targets, expose stale selections as null, and avoid inventing payroll effects |

## Producer/consumer contracts

| Column or state | Angular row / controls | Backend HrmAccountLinkRowVM | Source result |
|---|---|---|---|
| Salary Item Type | value, settingKey translated from hrmAccountLinking.salaryItems | Value, SettingKey | Exact named key/order |
| Staff Ledger | FormControl<number/null> staffAccountId | StaffAccountId | Nullable posting ID |
| Expense Ledger | FormControl<number/null> expenseAccountId | ExpenseAccountId | Nullable posting ID |
| Provision Ledger | FormControl<number/null> provisionAccountId | ProvisionAccountId | Nullable posting ID |
| Editable cells | editableRoles determines disabled controls and payload inclusion | EditableRoles | Backend-owned eligibility |

API: `GET LinkAccounts/hrm` → Results of compact rows. `POST LinkAccounts/upsert` → Result, requiring ReplaceTypes exactly `[8]` for HRM. Original seven account types keep their existing API behavior. Generic options and auto-link discovery exclude HRM. Accounts Angular reference was inspected but not edited. The direct backend automatic-link consumer was changed only to retain the previous seven-type scope after enum extension.

Salary keys are explicit 1–18 in screenshot order, ending Gratuity=17, HalfpaidLeaveDeduction=18. Staff=1/Expense=2/Provision=3. Client sends no database row ID, tenant, audit, name, status or formula. The existing one-way LinkAccountMappingVM → LinkAccounts map is reused by ServiceHelper; there is no new ReverseMap or Ignore list. Read projection is explicit and does not need an AutoMapper registration.

Read resolves the latest canonical stored row per tuple, including null, and replaces stale target IDs with null without changing the database. Query and helper both use tenant/live repository filters. Write checks shape/eligibility before account validation, collapses request duplicates last-wins, then calls the scoped helper and one save. The existing UnitOfWork treats an unchanged snapshot as success. One implicit EF save transaction applies; no multi-save boundary or explicit transaction was introduced.

## Actions and recovery

| Reference action | Target classification | Reason / complete path |
|---|---|---|
| Save All | Supported | canSave → buildRequest → service POST → SaveHrmAsync validation/helper/one save → Result; success snapshot/pristine + global toast; failure keeps draft + inline error |
| Retry account/settings read | Supported | load guard → forkJoin GET hrm/GetSelect → setRows; failure hides edit controls and exposes Retry |
| Leave with unsaved changes | Supported | child CanDeactivate → deferred confirmDiscard → freezeFormState; cancel restores same controls, values and eligibility |
| Select/search/clear ledger account | Supported | typed reactive controls, ordinary account dropdown filter, nullable clear; server authoritative FK checks |
| Complete Missing Links / preview / apply | Not Applicable | HRM has no approved account defaults/category/create-account contract; general automatic account creation remains isolated |
| Switch account-type tabs | Not Applicable | Only the HRM salary subject is in scope; no multi-type tab state exists |
| Charge-module / payment-branch filters | Not Applicable | HRM keys contain salary item and role, no module/branch dimension |
| General settings search / Reset | Not Applicable | Fixed 18-row configuration has no applied search contract; lookup search remains supported |
| Child Add / Remove | Not Applicable | Fixed server catalog; no user-owned row lifecycle or deletion action |

Save blocks until both reads succeed and while loading/saving/confirmation, on empty data or an unchanged snapshot. Stable form/row objects retain focus; value changes compare the complete editable snapshot so reverting a selection disables Save again. Saving and pending discard freeze controls while preserving intentionally disabled cells. takeUntilDestroyed owns all subscriptions; concurrent reads are gated. No service-level cache or localStorage enum state was added.

## Final reference conformance

| Concern / owning block | Actual target versus shared/reference source | Final source evidence |
|---|---|---|
| UI1/3 workspace | sigma-route-host → list-page → workspace panel → feature-title, matching Accounts reference composition | Component metadata/template; toolbar excludes AccountLinking only; shared styles own height100%, min-height0 and hidden outer overflow |
| UI14/16 table | Shared table fillHeight/stickyHeader, columns all 25% with minWidth13/15rem and tableMinWidth68rem | Template projects cells only; public shared frame owns both scrolling and sticky header; no feature SCSS |
| UI16 lookup | BaseService getSelectList typed Results<DropDownSelect> | AccountService.SelectAsync and HRM read/write all require active/live/AllowChildren=false; appendTo body, optionLabel value/optionValue id |
| UI10 discard | ConfirmationDialogService.confirmDiscard and freezeFormState | Deferred subscription/duplicate/busy/disposed checks; finalize restores same surface preserving disabled roles |
| UI22 feedback | StateMessage/API error utility + existing interceptor | Both declared and transport failures handled; local skip-error headers; no skip-success and no manual success toast |
| UI23/25/27 | Shared theme/RTL/row chrome, TranslateModule, stable inputId/ariaLabel | Matching EN/AR salary keys, per-row and role names in accessible labels; no numeric styling forced onto salary text |
| BE16 | Shared keyed helper, latest-ID lookup, tuple scope, one save | GetHrmAsync/SaveHrmAsync; no generic destructive reconciliation in HRM branch |
| BE4 | Existing one-way write map | No change to LinkAccountsProfiler; compact read manual projection |
| UI1/26 integration | AuthGuard shell, Authorize controller, root HttpClient | pages lazy route and guarded child route; DependencyResolver already registers service/helper |

Source comparison establishes composition/contracts only. Responsive, focus, scrolling, appearance, API execution and persistence remain owner-pending.

## Files changed

Paths below are relative to each stated repository, whose absolute root is authoritative.

`F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- Account Linking/LinkAccounts: components/list/list.component.ts and .html; models/list.ts; services/linkaccounts.service.ts; linkaccounts.routes.ts.
- Retired unused generated components/details files (.ts/.html/.scss/.spec.ts), empty list.scss, unrelated-widget list.spec.ts, models/create.ts and details.ts. No meaningful feature test was removed; the list spec referenced Widgets Examples rather than this screen.
- Direct consumers: src/app/pages/routing.ts; toolbar.component.ts AccountLinking hunks; src/app/modules/i18n/vocabs/en.ts and ar.ts HRM keys; src/app/modules/UserGuide/content/hrm-guide.ts AccountLinking topic only. Preserve shared-file StaffRole and Department changes when staging.

`F:/My Work/Sigma/SigmaBackend`:

- SiGma.Business/IServices/ILinkAccountsService.cs.
- SiGma.Business/Services/AccountServices/LinkAccountsService.cs and LinkAccountsAutoLinkService.cs.
- New SiGma.Business/Services/AccountServices/HrmAccountLinkCatalog.cs.
- SiGma.ServerAPI/Controller/LinkAccountsController.cs.
- SiGma.Helpers/Enum/LinkAccountsType.cs; new HrmSalaryItemType.cs and HrmAccountLedgerRole.cs.
- New SiGma.ViewModels/ViewModels/LinkAccounts/HrmAccountLinkRowVM.cs.
- SiGma.Helpers/Localization/Shared/GeneralMessage.resx and GeneralMessage.ar-SA.resx, five HRM resource entries only. Preserve the pre-existing StaffRole resource hunk.

Provisional HRM additions to LinkAccountsEnumCatalog and LinkAccountsOptionsVM were removed and those files have no final diff. Shared UI components and approved Accounts reference frontend were not modified. No new reusable presentation owner was needed: dropdown role descriptors avoid three repeated cell templates while existing shared components cover all chrome. New eligibility catalog is feature business ownership, not a replacement shared UI pattern. No new reusable lesson requires canonical-book/skill promotion.

## User guide

Content: `SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/hrm-guide.ts`, existing HRM_GUIDE topic route `/AccountLinking`, titleKey `sideMenu.hrmadministrations.accountLinking`. Existing reader registers HRM_GUIDE; module guide route/menu is `/UserGuide/hrm` in sidebar-menu-data.ts. Topic covers purpose, active posting choices, enabled ledger cells, Gross, lookup search/clear, Save eligibility, load retry, failed-save draft retention, unsaved exit and stale selections. English and Arabic text matches source. It explicitly avoids promising payroll posting or formula behavior. Guide navigation/RTL/theme/print remain owner-pending.

## Source verification and owner acceptance

Performed: separate complete scoped diffs in both repositories (including new-file source reads); stale import/type and obsolete route checks; exact standalone exports/public inputs and installed PrimeNG declarations inspected; es2018 lib compatibility reviewed; interceptor/DI/AuthGuard/Authorize and posting predicate traced; scoped merge-marker/override searches; git diff --check without whitespace errors (Git line-ending warnings only); resource XML read and each new key found exactly once per culture; final recipes all OK. No compile, runtime, browser or persistence claim is made.

Owner acceptance:

1. Build frontend/backend and run the owner's appropriate checks; confirm the new lazy component/DTO compiles under the existing explicit TS roots. No compiler-root expansion was made without feedback.
2. Open `/AccountLinking`; verify 18 ordered rows, all disabled/eligible cells and the three provision slots; both backend and frontend deployments are required together.
3. Save choices, reload and clear one; ensure one notification, persisted clear, HRM isolation and tenant separation. Verify omitted mapping and legacy duplicate/null behavior in owner-controlled fixtures.
4. Exercise failed GET/GetSelect, failed Save and account deactivation between load/save; Retry/read normalization and draft retention must behave as documented. Check invalid/foreign/parent account rejection and mixed-type request rejection.
5. Cancel and accept dirty navigation, rapid repeated navigation/Save, and return a selection to its saved value; original disabled roles must remain disabled after cancellation/failure.
6. Verify narrow/desktop, keyboard, LTR/RTL and light/dark with dropdown overlays, sticky header, fixed Save, one internal scroll and no page scroll. Confirm guide links/Arabic/print.
7. Check authenticated GET/mutation headers without recording token values; verify general LinkAccounts options/Save/auto-link remain the original seven-type surface.

Risks: owner compilation/runtime acceptance is pending; concurrent first writes rely on the existing unique index and standard API error handling; the new enum partition has no payroll posting consumer. No migration or Add-Migration command is needed. Existing `/Setting` HRM Settings menu mismatch and separate Pay Structure/Common gaps are outside this screen and were not changed.

Suggested commits, limited to the file groups above:

- Frontend: `feat(hrm-account-linking): implement salary ledger settings workspace`
- Backend: `feat(hrm-account-linking): persist isolated salary ledger links`

Agent use: after root contract freeze, one bounded sol_worker (`gpt-5.6-sol`) owned backend only while root implemented frontend/guide. This reduced wall-clock time for independent files. Root integrated the worker, corrected the last-two-key ordering and feedback localization, and reviewed final full-stack source. No overlapping implementation or worker declaration of overall completion.

Not run: builds, tests, lint, migrations, database commands, browser/app verification, Graphify, Sigma MCP, commits, pushes or deployment. Unrelated edits remain in the working tree.

## Follow-up — shared loader and Complete Missing Links (2026-10-11)

| Item | State |
|---|---|
| Follow-up contract | Frozen amendment in HRM_ACCOUNT_LINKING_SCREEN_CONTRACT_FREEZE.md |
| Implementation | Frontend source implemented; final backend reconciliation follows below |
| Owner verification pending | yes |

The user's follow-up authorizes the app-wide loader and Complete Missing Links. This adds a preview/apply action to the earlier settings-only screen; original decisions above remain historical. Images 7–9 remain separate HRM Settings evidence, with no new scope. Selected shape remains BE16 keyed settings + UI shared matrix, with UI11/22 confirmation, loading and composite feedback. Recipe check: all eight packets OK; PHASE01,03,04,05,06 apply to the follow-up. No new list/filter/report/editor shape requires Phase02 redesign.

### Frontend source conformance

| Concern / owner | Actual source evidence | Result |
|---|---|---|
| App loader, UI22 | HrmAccountLinkingComponent.load/saveAll startLoading/endLoading in finalize; takeUntilDestroyed | Initial read, Retry, Save and post-Apply refresh use shared LoadingService. Feature loading StateMessage removed; local busy guards retained. |
| Reuse reference modal, UI11/13/24 | imports LinkAccountsAutoLinkComponent; same 980px EditorDialog, table and slim/row/min140/max80 SummaryCards, confirmation and preview/apply cycle | Reference component TS/HTML/SCSS unchanged. No parallel dialog or local presentation CSS. |
| Typed service / root client, UI1/2 | HrmAccountLinkingService implements Pick<LinkAccountsService, getAutoLinkPlan/applyAutoLink>; component useExisting alias | Only descendant preview resolves HRM endpoints. Hrm root service inherits root HttpClient; no new provider/client/interceptor chain. |
| Draft and action guards, UI10/28 | canOpenAutoLink, freezeFormState, confirmationPending, autoLinkVisible; canSave and canDeactivate gate modal | Cancellation preserves selections and disabled roles. Each modal session is conditionally mounted; request cleanup stays with reference DestroyRef. |
| Refresh and single feedback, UI22 | appliedCompleted -> onAutoLinkApplied -> load(message); Skip-Success-Toast on Apply; refreshed flag in finalize | Reload both rows and options, then one global success. Either declared or HTTP reload failure gives inline Retry and suppresses final success. Save retains standard interceptor success owner. |
| EN/AR text, UI23 | linkAccounts.hrm + existing autoLink keys; shared rule generalized to match both consumers | HRM type label resolved; existing preview shows correct generic rules and its actual proposed account/parent. No changes to general Accounts action behavior. |
| Screen guide, Master7 | HRM_GUIDE existing /AccountLinking topic | EN/AR steps now cover preview, Apply confirmation, preserved existing links, manual cells, unsaved drafts, global loading and reload. /UserGuide/hrm route/menu unchanged. |

Frontend follow-up files: HRM Account Linking list TS/HTML and service; i18n/vocabs/en.ts and ar.ts (HRM type label and preview rule wording only); UserGuide/content/hrm-guide.ts AccountLinking additions. All other preceding feature work remains as recorded above; unrelated shared-file hunks are preserved.

Frontend source verification: reviewed scoped list/service diff and exact modal inputs/outputs/injections, PrimaryActionButton inputs, BaseComponentService.loading and freezeFormState cleanup; traced root AppModule interceptor and GLOBAL_MESSAGE_SERVICE_PROVIDER. Paired every new loading start with finalize/end. git diff --check has no whitespace errors (line-ending warnings only). No build/runtime claim.

### Final follow-up reconciliation

| Contract / path | Final source evidence | Status |
|---|---|---|
| GET hrm/auto-link/plan | Controller.GetHrmAutoLinkPlan -> ILinkAccountsAutoLinkService.GetHrmPlanAsync -> BuildHrmPlanAsync -> GetHrmAsync/catalog | Source matched; read-only preview, eligible keys only, no contact defaults. |
| POST hrm/auto-link/apply | Controller.ApplyHrmAutoLink -> ApplyHrmAsync -> AccountService.AddAsync -> LinkAccountsService.SaveAsync/SaveHrmAsync/IServiceHelper | Source matched; server rebuild, one explicit Serializable transaction around multiple account saves and the scoped settings save. |
| Account selection | HrmAccountAutoLinkCatalog + FindHrmParent + IsActivePostingAccount | Exact named eligible parent, category/subgroup, active=true, live tenant scope, levels2–4, no parent journals; one suitable child reused; duplicate/unsuitable matches Manual. |
| Existing links / replay | GetHrmAsync omits valid linked cells from work; Serializable range reads in Apply | Source matched; valid links preserved, repeated Apply sees remaining missing cells. Concurrent transaction contention/retry requires owner acceptance. |
| General Accounts isolation | BuildPlan excludes Hrm; ApplySlotAsync(Hrm) returns null; existing general ApplyAsync behavior retained | Source matched. Only new HRM methods create/save HRM settings. |
| DTO / preview grid | Type/Value/SubType/JobType/LinkSection identify slot; grid displays type, SlotLabel, Action and account/parent/reason; summary counts use existing PlanVM | Existing shared preview VM reused. No new client-owned calculated values or mapping changes. |
| Feedback / culture | 35 new resources in each neutral/ar-SA file:14 workflow keys,18 salary labels,3 roles | XML parsed; each follow-up key appears once. Display labels localized; persisted account names stable across language. |
| Atomic result | Created account-code hydration occurs before HRM transaction Commit | Source matched; an error before Commit rolls back creations and mapping writes. |

Additional backend follow-up files: SiGma.Business/IServices/ILinkAccountsAutoLinkService.cs, Services/AccountServices/LinkAccountsAutoLinkService.cs, new Services/AccountServices/HrmAccountAutoLinkCatalog.cs, SiGma.ServerAPI/Controller/LinkAccountsController.cs, and neutral/ar-SA GeneralMessage resource entries. No entity/EF/migration changes. AccountValidator and AccountService were inspected, not edited: the validator inherits parent subgroup and the service owns account category, level/code generation and creation.

Root source review caught and reconciled parent-level eligibility, reused-account category/subgroup matching, and HRM response hydration before Commit. General ApplyAsync retains its original order and behavior. The entire follow-up backend diff and new catalog were read; frontend scoped diff and EN/AR/guide hunks were reconciled. Scoped diff --check has no whitespace errors; scoped merge-marker searches found none. Recipe Check remains all eight OK. No new unresolved contract blocks the requested behavior. Build, SQL execution, navigation/overlay/RTL/theme and runtime acceptance remain pending; source inspection does not certify them.

Owner follow-up acceptance:

1. Build both applications, then open /AccountLinking and verify the application loader appears for load/Retry/Save. It must settle on success, business failure, transport failure and destruction.
2. Preview Complete Missing; it must show only missing eligible HRM cells, three counts and actual parent/account choices. Gross and other disabled cells never participate. Close without Apply and cancel dirty confirmation: selections/disabled roles stay intact.
3. Apply confirmed missing links; after closing the result, mappings and account options refresh and one success toast follows loading completion. Repeat Apply: no duplicate accounts or existing-link overwrite. Unmatched provisions remain Manual until the correctly classified named group exists or an account is selected manually.
4. Verify failures/rollback, deactivated or foreign accounts, duplicate named groups/accounts, wrong-classification children, omitted settings and concurrent Apply/manual Save. Serializable locking may require retry under concurrent contention; confirm no partial account/link writes.
5. Check general Link Accounts preview/apply and document auto-link callers retain their existing behavior, plus EN/AR modal labels, keyboard/overlays and module guide /UserGuide/hrm.

Suggested follow-up commits (suggestions only):

- Frontend: feat(hrm-account-linking): reuse global loader and missing-links preview
- Backend: feat(hrm-account-linking): add scoped missing-links completion

Agent utilization: reused existing bounded sol_worker gpt-5.6-sol for backend only after freezing the follow-up; root owned frontend, guide, contracts and final integration. Independent files reduced wall-clock time without overlapping edits. Unrelated working-tree changes preserved. No migration is needed; AutoMapper and payroll calculations unchanged. No builds, tests, lint, migrations, database commands, browser/application verification, Graphify, Sigma MCP, commits, pushes or deployments were run.

Final follow-up status: Implemented — source-only. Owner verification pending: yes.
