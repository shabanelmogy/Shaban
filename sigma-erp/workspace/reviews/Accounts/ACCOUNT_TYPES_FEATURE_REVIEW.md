# Account types, reporting groups and linked-account suitability

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Owner label correction2026-10-24 (tier S): title-case the existing English `accountTypes.classificationSections` value as `Account Classification Settings`, retaining its plural meaning and key. UI23 shared dictionary owns both the sidebar entry in sidebar-menu-data and AccountSetting tabs' accessible label; owning Accounts guide navigation text updated to match (Master7). Arabic translation, routes, contracts and behavior unchanged. Initial eight-packet check current; reviewed scoped dictionary/guide diff and whitespace, no new canonical rule or packet regeneration required. No backend/schema change or migration; no agents for this single-label correction. Build/runtime/database/browser/tests/lint/commits not run; deployed DB translation overrides and visual acceptance remain owner checks. Suggested frontend commit: `fix(accounts): capitalize classification settings label`.

Date2026-10-23. Implementation authorization: add Odoo20 classification types to current Chart of Accounts; classify existing accounts using best source-supported evidence; filter all directly related linking selections; add Account Setting Add/Edit configuration. Owner-approved amendment: configurable Group -> SubGroup -> Type -> Account, preserving all current main/subgroups and making new-chart creation fully initialized. No screenshot/video evidence; no new permissions. Existing auth/rootHttpClient and report keys retained.

## Manifest and authority

Canonical Master1/3/4/5/7/8; UI screen04 Account tree, screen01 list/modal master definitions, shared tabs from UI13 for AccountSetting composite; BE13 normal master definitions and existing hierarchy/service exceptions; BE8/10 lookup-save predicate parity. PLAN00 and applicable PHASE00–06 initial Check all current. Existing Accounts workspace full-replacement/financial-report contracts remain except explicit hierarchy handoff amendment. Exact changed contracts in ACCOUNT_CLASSIFICATION_HIERARCHY_DOMAIN_API_CONTRACT_FREEZE.md; prior ACCOUNT_TYPES_DOMAIN_API_CONTRACT_FREEZE.md retained historical.

User's intervening discussion of single-field classification was not implementation authorization by itself. The later explicit approval and keep-current-groups/new-chart instructions freeze the final hierarchy. Configurable names remain mapped to original five Category keys and fourteen existing StatementSubGroup keys; no new financial-report semantics are invented. OffBalanceSheet remains available as a definition role; no financial statement removal or new off-balance journal workflow is claimed.

Initial unrelated working-tree changes: frontend auth/login/dashboard/sidebar/theme/shared-loading/scrollbars/vocab and earlier Account tree indentation/guide edits; backend document archives/solution-filter/assets. Preserve them. Relevant repositories are SiGmaAngularFrontEnd, SigmaBackend; review artifacts local/unversioned. No commits/push requested.

## Pre-edit and final conformance evidence

| Concern | Owning block | Actual reference/shared producer | Final target contract |
|---|---|---|---|
| Account tree/editor | UI1 hierarchy; actual Account list/details, FeatureTitle, shared native fields | Existing structural tree/root Category and code generation | Existing tree retained; type chooses configured reporting placement; no duplicate title/page scroll |
| Settings list/modal/tabs | UI1/3/4/6/13/16/19/22; Workshop/Job list + shared DataTable/FilterPanel/EditorTabs/EditorDialog | Shared bounded shell/control/validation/feedback owners | Three setting tabs, typed Add/View/Edit, fixed title/actions and one inner scroll; no local skin |
| Master persistence | BE1–6/8/13; BranchService unique/search hooks | Tenant repository, generic service/controller, EF Restrict FKs | Minimal editable definitions; server-owned IsSystem/IsInUse; names50; stable reporting keys |
| Selectability | BE10/UI16; original Account.SelectAsync; AccountSelectionPolicy | Same shared server role predicate on lookup and Save | Active posting accounts with a suitable placed type for specific roles; AnyPosting preserves generic queries |
| Linking collections | UI14/16; existing LinkAccounts/HRM contracts | Existing typed collection/ReplaceTypes/confirmation owners | Row-specific allowed options; preserve incompatible saved IDs/labels; strict Save and unchanged full-replacement scope |
| Setup/classification | Master4/7; SeedDataService and new Initialize endpoint | System template + centralized type classifier | Existing report subgroup preserved through per-subgroup type variants; conflicts visible; no transaction/balance rewrite |
| Language/guide | UI23/25/29, existing UserGuide reader/models | EN/AR dictionaries and module guides | Hierarchy setup and effects explained; runtime/visual acceptance pending |

## Selected/retained contracts

| Consumer | Columns/fields used | DTO match |
|---|---|---|
| Type settings grid | Actions identity; Name,NameLocalized,Kind,SubGroup/Group placement,IsSystem,IsInUse | ListVM only identity, those display fields and derived state |
| Group/SubGroup grids | Actions identity; names, financial category/report placement, system/in-use states | Separate minimal per-owner VMs |
| Account editor | Name,Notes,Type,AllowChildren,cost-center fields; read-only reporting placement | Client edits Type ID only for classification; server keeps Category/SubGroup authoritative |
| Linked-account picker | Id,Value,No | Existing DropdownDto shape; explicit TypeOptions has named metadata extension |
| Link/HRM row | Original saved dimensions/AccountId, allowed choices, mismatch/label | Read-only option/state additions excluded from writes |

Applicable phases: discovery/evidence0, domain/API1, read/grid2, editor/write3, Initialize confirmation/action4, integration5, final source reconciliation6. Ordinary Save/Search/Export stay with their own phases. No new financial transition/calculation/reporting/permission policy. Missing runtime/database facts are owner verification, not invented source facts.

## Implementation and integration record

Three non-overlapping workers after shared contract freeze: backend taxonomy sol_worker/gpt-5.6-sol for entity/EF/API/init; frontend taxonomy terra_worker/inherited available model for settings and Account editor; link-policy sol_worker/gpt-5.6-sol for shared selection and LinkAccounts. Root owns scope/contracts, direct Assets/HRM/loan/PDC consumers, seed/subledger, routes/sidebar/translations/compile roots/UserGuide and final integration. Roles reused for bounded independent read-only audits. Delegation reduces wall time across coherent backend/frontend/policy workstreams; max4 concurrent including root. File ownership was explicitly transferred for hierarchy amendment (Account core from taxonomy to policy) to avoid overlapping edits.

Source audit corrections already applied: DropdownDto namespace corrected in LinkAccounts/HRM VMs; category-safe text classification; source reference intersections instead of first-match guessing; saved asset/loan incompatible selections retain identity with warnings; seed result exposes classification conflicts; historical softdeleted references lock used-type semantics. No changed source was deployed or executed against a database.

## Final decisions and reconciliation

| Decision / Phase6 comparison | Evidence and final source outcome |
|---|---|
| Existing groups and report keys | Five original Category values and14 StatementSubGroup keys are unchanged. Tenant definitions copy existing root/level2 names where available; protected system markers survive renaming. Financial reports still consume the original account snapshots. |
| Definition hierarchy | Group → SubGroup → Type → Account is configured in3 shared tabs. Names50; Group.Category/SubGroup.ReportSubGroup retain existing report meaning. System group/subgroup placement is fixed; referenced placements include softdeleted accounts. Unused custom moves cannot invalidate child definitions. |
| Type classification vs reporting | Nineteen stable Kind roles; multiple named variants per `(Kind, SubGroupId)` preserve current report placement. Account editor selects only Type and displays placement read-only. The server ignores typed client subgroup input and derives the snapshot. |
| Legacy compatibility | Null/omitted type in old update clients preserves a previously assigned type. Genuinely untyped legacy callers retain former subgroup behavior, whose propagation stops at typed branches. Initialize also repairs old flat/unplaced assigned types by preserving compatible Kind and the existing report subgroup. |
| Reporting-change guard | Backend prevents changing the report key for a transaction account. UI limits its available types to the same report key. No automatic typed descendant reclassification. |
| Off-balance role | Available among definitions, seeded without a financial placement; absent from operational Type options until configured. No new off-balance category, report exclusion or accounting workflow. |
| Lookup vs Save | Shared Apply/IsAllowed enforce active placed chain, Kind/category compatibility and snapshot agreement. CurrentAsset/Inventory, CurrentLiability and NonCurrentLiability enforce their specific report key. AnyPosting remains broad for generic journals/reports/opening balances. |
| Existing invalid links | Active posting accounts with missing/unsuitable types remain identifiable with warnings in LinkAccounts/HRM, AssetType, loan and PDC selections. Existing inactive/parent/deleted handling in LinkAccounts remains as before. Save validates exact role. |
| AutoLink | Resolves a placed type matching usage/category/target report key, creates typed accounts, reuses compatible leaves; same-name unsuitable accounts require manual selection. Full ReplaceTypes/Save All scope remains unchanged. |
| Asset descendants | Asset creation loads/validates the exact3 role chains before any descendants; subledger creation revalidates role and copies category/subgroup/type. Current tenant repository owns AssetType selection. Existing per-descendant save lifecycle otherwise remains. |
| New chart | Seed accounts, links, branch/settings and hierarchy/classification run in one outer Account write transaction; nested Type initializer reuses that transaction. Every failure Result prevents commit. |
| Seed readiness correction | Source audit found25 charge defaults targeting7 structural containers. New charts retain those containers and add7 dedicated same-named posting leaves, resolving new seed mappings to them. Existing charts/links/journals are not rewritten. Initialize reports references to structural/root accounts as conflicts instead of hiding them. Contract addendum records exact scope. |
| Initialization safety | Five default groups,14 report subgroups,19 default roles plus report-preserving variants; one guarded transaction, no-change success, bounded names with collision loop and safe restore. Conflicts visible in Settings and new-chart response. Structural skipped count is not presented as conflict count. |
| Mapping | Explicit definition profiles map editable DTO fields; IsSystem is server-owned and IsInUse computed. Loaded navigations populate displayed labels. AccountTypeId follows existing Account convention mapping. No client totals/status/tenant ownership added. |
| Calculations / permissions | No new financial calculations, journal timing or permissions. Current authentication and tenant repository remain authoritative. No hidden control claimed as secured. |
| Presentation | Shared FeatureTitle/DataTable/FilterPanel/EditorTabs/EditorDialog/FieldError/StateMessage reused. Container-fill and logical-direction tree indentation retained; no new page scrolling. Final RTL/theme/mobile appearance still requires owner runtime inspection. |

### Grid / DTO exact comparison

| Grid | Visible columns beside action identity | ListVM properties |
|---|---|---|
| Main groups | Name, NameLocalized, Category, system/custom, in-use | Id, Name, NameLocalized, Category, IsSystem, IsInUse |
| Subgroups | Name, NameLocalized, GroupName(localized), Category, ReportSubGroup, system/custom, in-use | Id, Name, NameLocalized, AccountGroupId, GroupName, GroupNameLocalized, Category, ReportSubGroup, IsSystem, IsInUse; AccountGroupId is the editor identity |
| Types | Name, NameLocalized, Kind, GroupName(localized), SubGroupName(localized), Category, ReportSubGroup, system/custom, in-use | Id, Name, NameLocalized, Kind, AccountSubGroupId, SubGroupName, SubGroupNameLocalized, GroupName, GroupNameLocalized, Category, ReportSubGroup, IsSystem, IsInUse; AccountSubGroupId is the placement identity |

Search matches definition names and relevant placement names in backend hooks. Type grid supports name/Kind sorting; group/subgroup grids use stable name ordering. Applied search and paging feed the same paged/all-page export services. Modal Add/Update payloads carry names and only the editable category/placement/Kind fields; computed state is not writable.

### Scoped source manifest

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

- Account: `models/account-type.ts`, `models/details.ts`, `models/list.ts`, `services/account.service.ts`, `components/details/details.component.ts/html`; earlier tree padding remains in `components/list/list.component.scss`.
- AccountSetting: `account-setting.routes.ts`; `models/account-type-definition.ts`, `models/account-classification.ts`; `services/account-type-definition.service.ts`, `services/account-classification.service.ts`; `components/list/list.component.ts/html/scss`, `components/details/details.component.ts/html/scss`, `components/classification-definitions/classification-definitions.component.ts/html/scss`.
- Link Accounts/LinkAccounts: typed row model plus TS/HTML for General, Charges, Contacts, Bank Accounts, Payment Methods, Prepaid Expenses, Workshop tabs; existing workspace replacement/refresh contract retained.
- Assets/assetType: details TS/HTML role lookups and preserved mismatch warnings. HRM/Administration/Account Linking/LinkAccounts: model/list TS/HTML per-role choices and warnings.
- Vouchers/Bills/Bill: loan-plan TS/HTML bank role/mismatch. Banking/ChequesPayables: mature TS/HTML and optional inline-error handling in pdc-payable.service.ts. Bank business/transport failures now render their reason.
- Integration: `pages/routing.ts`, sidebar-menu-data.ts, explicit3 AccountSetting component roots in `tsconfig.app.json`; EN/AR dictionaries and `account-types.ts`.
- Guides: `UserGuide/content/accounts-guide.ts`, `linked-account-guides.ts`, `hrm-guide.ts`, `bills-topic.ts`, and existing reader registration.

Backend repository: `F:/My Work/Sigma/SigmaBackend`.

- Helpers: Account type FK/navigation,3 definition entities, AccountTypeKind and AccountLookupUsage enums, EN/AR GeneralMessage resources.
- DataAccess:3 definition EF configs, AccountConfig Restrict FK,3 DbSets in SiGmaDbContext. No generated migration or snapshot changes.
- Business:3 definition service interfaces/services/profiles; AccountTypeClassifier, AccountSelectionPolicy; AccountService/validator/interface; LinkAccountsService/AutoLinkService; SeedDataService; AssetTypeService/AssetService; SubLedgerAccountService/interface; PDCPayableService; BillService with DownPayments/InstallmentPayments/LoanLifecycle partials.
- API:3 definition controllers and AccountController PostingSelect. Existing assembly scanning registers services/mapping/configuration; no duplicate provider/client.
- ViewModels: separate Group/SubGroup/Type add/update/list/detail/options/count VMs; Account Add/Update/Detail type identity; LinkAccounts/HRM/AutoLink read metadata. Named classes remain in individual files.

### Phases / evidence / verification

Phases0–6 applied as scoped above; Initialize uses the action phase, while ordinary Save belongs to editor/write. Reports/calculation/new permission/new state-transition feature work skipped because unchanged. No screenshots/videos supplied, so functional evidence classification is written user requirements plus existing source; no screenshot table is applicable. No unresolved material API/business decision remains; off-balance reporting expansion is explicitly outside the frozen contract.

Final packet read-only Check on2026-10-23: PLAN00 and PHASE00–06 all OK. No canonical book/template/manifest changes were needed, so no generated refresh. Exact reference conformance used Workshop/Job `components/list/list.component.ts/html` and shared DataTable/FilterPanel for list presentation; BranchService uniqueness hooks for master writes; actual Account tree/editor and shared UI owners for the hierarchy exception. No reference module was edited.

Root reviewed the scoped tracked diffs separately in both repositories and read new definition/settings files. Bounded independent audits were integrated: flat-type upgrade, category-policy parity, transaction Type options, truthful missing Group display, PDC mismatch/error feedback, new asset descendant type checks, atomic seed,7 posting-leaf defaults, deleted parent-group checks and bilingual classification-conflict messages all corrected. Final `git diff --check` passed in both scoped repositories; only line-ending advisories. EN/AR resource XML parsed;50 new classification keys each, no key-set difference or duplicates. Frontend/backend enums/routes/DTOs/lookup usages, exact compile roots, guide registration and sidebar links reconciled from source. No compilation/runtime/visual/database success is claimed.

### In-app user guide completion

Existing UserGuide reader is reused. Accounts guide route `/UserGuide/accounts` and sidebar entry cover tree navigation, Account Type-only editor,3 Settings tabs, initialization/counts/conflicts, safe existing-chart classification, OffBalance limitation and role-filtered Link Accounts. Assets and Banking guides at `/UserGuide/assets` and `/UserGuide/banking` cover3 asset roles and payable-cheque bank choice, preserved legacy IDs and visible errors. Existing HRM and Bills topics cover affected account choices. Both languages match final source; visual/manual acceptance remains owner-pending.

### Owner handoff and practical limits

1. Generate and inspect a backend migration named `AddAccountClassificationHierarchy` (no existing migration filename match). It must create3 tenant definition tables, optional Account.AccountTypeId and Type.AccountSubGroupId, protected system flags, Restrict relations,50-character names/enum keys and filtered tenant uniqueness including `(SubscriptionId, Kind, AccountSubGroupId)`. Apply it under the owner's database workflow; no database was accessed in this task.
2. Build backend and Angular, then test one fresh tenant: default5/14/19 hierarchy plus report-preserving variants,7 charge posting leaves and mapped defaults; confirm rollback on a failed seed stage.
3. On an existing chart, run Settings initialization and inspect conflicts. Compare account IDs, codes, Category/SubGroup, balances and links before/after; they must remain unchanged. Repeat to confirm no duplicate defaults. Structural-reference conflicts require explicit link correction.
4. Exercise Group/SubGroup/Type Add/View/Edit and system/in-use locks; different report subgroup must be unavailable/rejected for transaction accounts. Verify off-balance starts unplaced and becomes usable only with valid placement.
5. Exercise customer/supplier/bank/asset/HRM/loan/cheque choices, incompatible saved IDs, direct unsuitable Save payloads, both failure channels, AutoLink manual conflicts and full Save All replacement scope. Inspect desktop/mobile/Arabic/English/light/dark and dirty exits.

Migration/build/runtime/database/browser verification remains pending for the owner under AGENTS.md. Actual current account records were not updated by tools. Existing Asset descendant per-account SaveChanges behavior remains: this task rejects invalid classifications before any write but does not refactor the pre-existing entire Asset persistence transaction. That broader persistence risk is outside classification scope.

Suggested commit messages (suggestions only):

- Backend: `feat(accounts): add configurable classification hierarchy and role-safe links`
- Frontend: `feat(accounts): configure classification hierarchy and filter linked accounts`

Agent utilization: backend_taxonomy and link_policy used gpt-5.6-sol for persistence/classification/transaction complexity and independent source audits; frontend_taxonomy inherited the available parent model for its isolated screen work. Root froze contracts, integrated shared/root consumers and reviewed the final source. Three non-overlapping streams shortened implementation without concurrent file ownership; targeted ownership transfers and reused workers handled final findings. No prohibited build/test/lint/runtime/browser/database/migration/snapshot/Graphify/SigmaMCP/commit/push/deploy command was run.

## Follow-up — namespace resolution correction, 2026-10-23

Owner supplied seven CS0246 diagnostics: three DropdownDto references in LinkAccountsService and four service-interface references in the Group/SubGroup controllers. This bounded tier-S correction preserves the frozen business/API contracts; no new screen behavior, schema, calculations or user-guide workflow changes.

| Concern | Owning block | Source declaration / reference | Correction / evidence |
|---|---|---|---|
| Dropdown type resolution | Master5 Type and contract safety; BE5/10 | `SiGma.Helpers/Dtos/DropdownDto.cs` declares `SiGma.Helpers.Dtos.DropdownDto`; actual Business `GlobalUsing.cs` does not import Dtos; AccountService already imports it locally | Added `using SiGma.Helpers.Dtos;` in LinkAccountsService, covering all three reported references without a broad global import |
| Group/SubGroup interfaces | BE5/6 | Both interface files declare `SiGma.Business.IServices`; both controllers already import this namespace. ServerAPI references Business; SDK default source inclusion has no Business exclusion | No confirmed namespace defect in these controllers; their errors may be downstream of the failed Business project. Compiler/editor reconciliation remains owner-pending; do not claim those diagnostics cleared from source inspection |
| Permanent review rule | Master5; workspace source-only checklist; screen skill | User explicitly requested namespace consideration | Added declaration/import/global-import/project-reference/source-inclusion gate and producer-first diagnosis; no runtime/build authorization added |

Updated Master5, AGENTS.md, screen skill (including dated revision row), documentation CHANGELOG and Phase6 template. Regenerated PLAN00 and PHASE00–06 only through the generator; fingerprints follow the changed Master5 dependency. Semantic review: Phase6 now explicitly checks namespace/import/project evidence; approved references and workflow/business boundaries remain unchanged. Initial and final packet Check passed. No new migration required; existing classification migration remains pending as recorded above. No subagents used for this small sequential correction. Existing in-app guide remains accurate because visible behavior did not change.

Verification: scoped backend source/import review and documentation/packet diff checks only. No build/test/browser/database/migration/commit/push was run. Suggested backend commit: `fix(accounts): import dropdown DTO namespace in link service`. Suggested documentation commit: `docs(review): require namespace and project resolution checks` (workspace instruction files remain under the owner's documented version-control boundary).

## Follow-up — unified setup and persisted report labels, 2026-10-23

This section supersedes the earlier source-state statements about no calculation
changes, enum-backed report names, first-level2 subgroup names and the then-absent
migration. Historical sections remain unchanged. Contracts:
`ACCOUNT_CLASSIFICATION_HIERARCHY_DOMAIN_API_CONTRACT_FREEZE.md` (unified-seed
addendum) and `ACCOUNT_REPORT_CLASSIFICATION_DOMAIN_API_CONTRACT_FREEZE.md`.

| Concern | Canonical owner / reference | Final source reconciliation |
|---|---|---|
| Unified setup | BE5/8/18; existing SeedDataService and ExecuteUniqueWriteAsync | New cancellation-aware SeedAccountSetupAsync backs the existing authenticated CreateDefaultAccountTree route and service alias. Existing account history, including deleted rows, selects classification-only initialization. Empty charts get accounts, links, branch/settings and the same classification in one transaction. Failed results retain errors and prevent commit. No tenantless startup or database execution. |
| Preserved reporting meanings | BE13; protected system definitions and AccountTypeClassifier | Same five main categories and fourteen original reporting subgroups. New subgroup labels come from the original fourteen reporting meanings; distinct real account containers that share one report key are not renamed. Previously configured definition names and account snapshots are preserved. Nineteen default roles plus placement variants. |
| Report names | BE17 / UI20; AccountReportHelper and current shared report family | Canonical persisted system group names label category roots; non-root ledger names remain unchanged. IncomeStatement2 displays exact matching typed subgroup names, with canonical fallback for genuinely untyped accounts. Names never decide amount inclusion. Screen/print/export consume the same names. |
| Typed response | Master4 / BE3/17; IncomeStatement2 line producer and consumer | ReportSubGroup:int?, SubGroupName:string?, SubGroupNameLocalized:string? added end-to-end. Current UI reads persisted name fields; old string SubGroup retained by this handoff. Numeric keys own subtotal comparisons. New internal report records each have their own file; public report-option VM has its own file and imports DropdownDto's declared namespace. |
| Report choices | BE10 / UI20; shared dropdown and report-option owners | GroupDefinition/ReportOptions returns Results<AccountReportGroupOptionVM>, with numeric Category Id, persisted Value and optional NameLocalized. Budget and BudgetVariance use it with required-lookup failure gates. Account/SubGroups compatibility route reads persisted definitions with the original numeric report-key IDs. Converted keys are materialized before numeric mapping. |
| Shared bilingual options | Master5 / BE10 / UI20; AccountReportPageComponent.optionsFor/loadLookups | Optional localized names propagate through shared DropDownSelect and AccountReportFilterOption; language-keyed cache preserves translation-key priority, base fallback, selected values and drafts without a second request. Budget uses the same saved bilingual values. |
| Net profit reconciliation | BE17; IncomeStatement2 and Ytd2 | Complete Revenue minus Expenses drives both header and detailed NetProfitLoss, including other income/expenses. Before-sale amount equals complete net less the configured sale component; sale is included once. Existing gross-profit contract remains. |
| Tree arithmetic | BE17; shared RollUpToParents and TopologicalSort | Nine report variants now use one bottom-up direct-parent accumulation: eight income variants and BalanceSheetMonthwise. Each node keeps its raw own amount. Source arithmetic: leaf100 in a three-node chain gives root100; a parent own25 gives root125. This is reasoning from code, not an executed test. TrialBalance's immutable raw-snapshot logic and BalanceSheet recursion remain unchanged. |
| Guide | Master7; existing bilingual Accounts UserGuide reader | Updated setup safety, report classification, Budget/BudgetVariance lookups, net-profit relationship and single-count parent totals. Same reader/route; no duplicate guide system. |

New/amended source scope: ISeedDataService, SeedDataService, SeedDataController;
AccountTypeDefinitionService seed labels; AccountService/SubGroups;
AccountReportHelper, three internal report records and AccountReportsService;
IncomeStatement2LineVm; GroupDefinition interface/service/controller and
AccountReportGroupOptionVM. Frontend: IncomeStatement2 model/component,
AccountClassificationService, Budget model/component/template, BudgetVariance
component, shared dropdown/report-option models and report-page owner, affected
EN/AR labels, Accounts guide. All earlier unrelated changes preserved.

Phases0/1/2/5/6 apply to the report amendment; existing settings/seed write and
action contracts remain owners for phases3/4. No screenshot justified these
report calculations; evidence is owner requirements plus deterministic source
defects. The later cash-flow screenshot is recorded separately below.

Updated BE10, BE17, UI20, screen skill plus revision rows, and documentation
CHANGELOG for reusable bilingual lookup and hierarchical arithmetic guidance.
Regenerated PLAN00 and PHASE00–06 through the generator. Semantic review:
backend.10/17 and ui.20 fingerprints update in their dependent packets; report
totals stay backend-owned, approved reference roles and execution boundaries
remain intact. Final packet Check is required at handoff.

The owner/external process has since created
`20261023075821_modify-account.cs`, its Designer and a changed model snapshot.
They were preserved, not generated, edited or applied by this work. The report
label/arithmetic amendment adds no further schema. Build, numeric comparison,
database/migration, rollback/concurrency and visual acceptance remain pending.
Actual database accounts were not modified by these tools.

Owner checks: repeat setup on an existing and an empty tenant; verify unchanged
existing IDs/codes/snapshots/links and idempotent definitions; rename a main/subgroup
and compare report/print/export/Budget labels in both languages; exercise failed
lookups and saved drafts; compare each income column and each month with raw
ledger totals, including a direct parent posting and other income/expenses.

### New cash-flow/settings evolution scope

Owner now supplies cashflow.PNG, requests professional dynamic cash-flow settings
and a Financial Report Settings menu, approves editable default rows and
type-filtered actual account selection, and permits extra detailed account types
where needed. This is a new financial calculation/settings handoff, not a claim
that dynamic cash-flow code is already implemented. Its evidence, target design,
accounting choices and implementation dependencies are in
`FINANCIAL_REPORT_SETTINGS_MAINTENANCE_EVOLUTION_PLAN.md`.
Existing CashFlowAccountCodes literal IDs, opening-balance inclusion, missing
cash reconciliation and payment writer coverage are concrete findings, not
certified report behavior. No arbitrary cash allocation policy is implemented.

Suggested commits (no commits made): backend `feat(accounts): seed classification and source report labels from settings`;
frontend `feat(accounts): display persisted financial group names in reports`;
documentation `docs(accounts): reconcile setup and financial report contracts`.

Final source checks after this addendum: backend, frontend and scoped documentation
`git diff --check` all exit0 (line-ending advisories only). PLAN00 and every
PHASE00–06 packet Check all OK. PHASE02 provenance includes the updated BE10,
BE17 and UI20 sources; semantic reference roles and source-only gates reviewed.
No application/compiler/runtime/database verification was executed.

## Owner amendment — automatic type linking from Chart of Accounts, 2026-10-23

Frozen bounded action contract: owner requests a button to assign account types
automatically in Chart of Accounts. Reuse the existing authenticated tenant-wide
POST AccountTypeDefinition/Initialize, empty body, Result<AccountTypeInitialization>.
It ensures missing system definitions, preserves valid assignments and reporting
snapshots, repairs legacy unplaced compatible types and reports unresolved cases.
It does not overwrite every account with a new guess or create a duplicate chart.
Root/group accounts are intentionally skipped by the existing posting classifier.
No backend, schema, financial-calculation or migration amendment is needed.

| Concern | Canonical owner / actual source | Frozen target |
|---|---|---|
| Tree shape | UI1 screen04; Account list/details reference | Keep existing hierarchy/search and full-width shell; add header action through PrimaryActionButton |
| Action | UI7/10/22; ConfirmationDialogService; AccountTypeDefinitionService.initialize and InitializeCoreAsync | Shared confirmation, one request, no open account editor/create or conversion; freeze workspace and navigation while confirming/running; preserve drafts |
| Feedback | UI22; existing mutation interceptor and account tree/detail reads | One existing interceptor success toast; feature owns skipped/conflict result and inline failure; refresh selected read-only details/tree after success |
| Result | UI13; existing AccountSetting result dialog and EditorDialog | Extract the unchanged typed count/conflict dialog into one reusable feature component consumed by settings and chart; one internal result scroll owner |
| Guide | Master7; Accounts UserGuide | Bilingual button location/scope, editing prerequisite, safe reruns and unresolved-result explanation |

TierS extension of the already frozen classification action, not a new business
algorithm. Root performs the coherent UI integration; no independent backend
implementation stream or delegation. Existing user/peer changes are preserved.

### Source reconciliation of the chart action

Implemented in Account list TS/HTML: translated shared header button, explicit
whole-chart confirmation, method-level double-execution/state guards, inline
Result/transport failures and component-lifetime teardown/finalize. An account
being created/edited must be saved or closed first; an inline explanation and
button title name that prerequisite. Pending confirmation/write/result makes
the workspace inert and blocks feature navigation/competing tree actions.
Cancel leaves the selected account, draft and tree unchanged; failures retain
the current read-only context and expose the same button for deliberate retry.

Success retains search and tree expansion/selection through refreshTree and
reloads the selected read-only editor through its existing retryDetails path.
The existing initialize client retains the global interceptor's single success
toast and skips only global errors. No additional local success toast or second
POST is added. A refresh failure remains a separate existing read error.

AccountClassificationResultComponent is extracted from AccountSetting's actual
dialog. Both consumers preserve the same view-only780px padded EditorDialog,
five count fields, full server conflict list, empty-conflict text, translated
Close/Escape and the identical one-scroll-region structural styles. Settings
keeps its initialization and refresh handlers; only presentation ownership moved.
The new runtime entry follows the explicit tsconfig.app files convention.

Guide: accounts-guide.ts, /UserGuide/accounts, Chart of Accounts topic now covers
the button, whole-chart scope, editing prerequisite, skipped root/group accounts,
safe reruns, conflict review and refreshed selection in English and Arabic.
Four new accountTypes keys exist in both vocabularies. No list DTO/column/API,
namespace/AutoMapper, persisted amount or schema change; no migration needed.
Phases0/1/4/5/6 apply proportionally; phases2/3 have no new read/write contract.
No screenshot evidence supplied. No unresolved material contract decision remains.
Compilation, runtime writes and responsive/RTL/theme/keyboard behavior are pending
owner verification; source inspection does not prove those outcomes.

Suggested frontend commit only: feat(accounts): link account types from the chart.

Final checks: complete scoped frontend diff and new result component sources
reviewed, preserving earlier unrelated settings/classification changes. Scoped
git diff --check exit0; new component direct whitespace check clean. Initial
and final PLAN00/PHASE00–06 recipe checks all OK; existing PHASE04 shared
confirmation/result/refresh roles remain unchanged. No build/test/lint/browser,
database, migration, commit or actual automatic-linking execution was performed.

## Owner follow-up — missing parent and child types, 2026-10-23

Owner reports missing types on both parent and child accounts and asks which
behavior is correct compared with Odoo. Source-confirmed defect: InitializeCoreAsync
skips every AllowChildren account, although the approved hierarchy contract only
exempts fixed structural roots and the account editor accepts types on nonroot
parents. Freeze this bounded correction: classify eligible nonroot grouping and
posting accounts through the same existing placement-preserving algorithm.
Keep fixed roots exempt; their Category can span multiple report subgroups and
must not be forced into an arbitrary detailed type. Existing real reference,
missing-type and invalid-report-placement conflicts remain visible/skipped.

| Concern | Canonical/source owner | Correction |
|---|---|---|
| Classification write | BE8/13; AccountTypeDefinitionService.InitializeCoreAsync and AccountTypeClassifier | Remove only AllowChildren from the unconditional skip; keep root skip and all existing guards/retained valid assignments |
| Reference diagnostics | Existing Initialize contract/FormatConflict | Nonposting account references still raise the existing warning; assigning metadata does not make a group selectable for posting |
| Lookup eligibility | AccountSelectionPolicy.Apply/IsAllowed | Unchanged: AllowChildren=false remains required; type on a parent never authorizes posting or linked-account selection |
| Financial meaning | Frozen hierarchy contract; BE17 | Do not change Category/SubGroup/parent/code/balances/journal history or silently repair invalid reporting placement |
| Guide | Master7; Accounts UserGuide | Correct previous blanket group-skip explanation; describe fixed-root exception and unresolved parent/child diagnostics |

Odoo20 official account_account.py was read: account_type is required and
account.account has parent_id; _compute_account_type supplies existing-code-based
suggestions. This is product evidence, not authorization to copy a fallback into
Sigma's financial classification. No current database rows were inspected;
the user's specific remaining child-account causes remain unverified until
their reported classification conflicts or account examples are available.

Correction implemented in the existing initializer only: nonposting-reference
diagnostics are independent of the fixed-root skip, so nonroot groups now reach
the same retained-type, reporting-placement and source-conflict checks as other
accounts. Operational selection still requires AllowChildren=false. No entity,
schema, DTO, namespace or financial writer changed. Bilingual Accounts guide
updated. Backend service is an existing untracked file: inspected the amended
source directly as well as repository status, without treating an empty tracked
diff as evidence. Direct whitespace scan clean; scoped tracked guide diff check
passed; initial/final eight recipe checks OK. No build/test/lint, browser, data
or migration command run. Suggested backend commit only:
fix(accounts): classify nonroot grouping accounts during setup.

Owner's subsequent request for a strong extensible foundation is architectural
discussion. It does not by itself freeze a new reporting-mapping model, mandatory
root types or a relaxation of historical financial-change guards. Recommendations
must distinguish those future decisions from this implemented bounded correction.

## All-account coverage and explainable results — implemented amendment, 2026-10-23

Status: Implemented — source-only. Owner verification pending: yes.

Owner subsequently says “ابدأ”, approves classification on grouping accounts even
after their children are removed, and explicitly requests types for every account.
The frozen handoffs are ACCOUNT_TYPES_INITIALIZATION_RESULT_CONTRACT_FREEZE.md and
ACCOUNT_TYPES_ALL_ACCOUNTS_CONTRACT_FREEZE.md. The latter supersedes the historical
fixed-root exemption above; it does not change account financial placement or
authorize fabricated assignments where real classification evidence conflicts.

### Final source conformance

| Concern | Canonical / shared owner and source | Reconciled implementation |
|---|---|---|
| Coverage and response | BE3; AccountTypeDefinitionService.InitializeCoreAsync, AccountTypeInitializationVM and AccountTypeInitializationAccountVM | One terminal row per live tenant account, identified by account ID/code/name with bilingual type names, status and localized reason. Updated, AlreadyClassified and NeedsReview account for the total; ExcludedRoot=4/count remains a legacy compatibility field and is not emitted by normal root processing. Old counts/conflicts keep their compatibility meaning. Independent setup/reference warnings do not duplicate per-account reasons in the new warnings tab. |
| Root definitions | BE8/13; AccountTypeClassifier.SystemDefinitions/GetCategory/GetGroupKind and AccountTypeKind | Append five broad grouping roles20–24 without renumbering1–19; seed/reuse their named definitions with null subgroup. Retain valid existing root types; otherwise assign the matching category's broad role. Unknown categories, missing references and genuine incompatible classifications remain NeedsReview. |
| Reporting placement | BE17; AccountReportHelper.LoadIncomeStatementClassificationsAsync | Preserve Category/SubGroup/tree/journal/balance values. Root label fallback still uses a valid persisted report subgroup when its new broad type has no subgroup; exact detailed placement wins. No new report key or invented subgroup. |
| Posting eligibility | BE10; AccountSelectionPolicy.Apply/IsAllowed and AccountService.SelectAsync/GetPostingSelectAsync | Grouping metadata does not enable posting. Generic posting selectors now exclude grouping-only types, matching the in-memory predicate; specific role sets remain unchanged. Fixed-root display opts into broad type options; default lookups and child creation do not. |
| Creation and compatibility | BE8; AccountValidator.ValidateForAddAsync and current Account AddVM producers | Reject a new account with no AccountTypeId using a bilingual resource message. Both existing internal AddVM producers already supply the type. Update retains its documented omitted-ID compatibility and existing financial/history guards. |
| Delete, conversion and totals | Existing AccountService.RemoveAsync/ConvertToGroupAsync; AccountReportHelper.RollUpToParents | Source audit confirms last-child deletion preserves the parent's type and keeps AllowChildren=true; posting conversion remains explicit when eligible. Conversion copies the old posting type to its child. Reports use raw own amounts plus bottom-up direct-parent accumulation once. No arithmetic or delete-transition change in this amendment. |
| Definition editor | UI13/16; AccountSetting details shared EditorDialog and typed form | Broad grouping roles keep a null disabled subgroup with translated explanation; their names remain editable without depending on unrelated subgroup lookup success. System/in-use role locks stay intact. |
| Result presentation | UI6/8/13; AccountClassificationResultComponent, EditorDialog, SummaryCards, FilterPanel, EditorTabs and DataTable | Shared result for chart/settings: five visible columns plus minimum identity, compact selectable summary, full-width search, local paging, reset and export of all filtered rows. Warnings tab appears only when needed; legacy root card appears only for a positive count. One current-language type name with fallback. Bounded dialog/table flex chain retains the shared scroll owner. |
| Action and wiring | UI7/22/28; existing chart/settings initialization handlers, AccountTypeDefinitionService and explicit tsconfig.app files | Reuse one Initialize request and existing success-feedback owner. Confirmation, competing-action/navigation guards, refresh, inline business/transport failure handling and result close lifecycle remain intact. No new route or permission contract. |
| User guide | Master7; accounts-guide.ts and existing /UserGuide/accounts reader | Bilingual instructions cover broad root roles, whole-chart scope, result cards/search/export/warnings, retained classification after deleting the last child and explicit posting eligibility. |

### Integration and source verification

New enum/VM files use their owning namespaces and existing SDK compile inclusion.
Business/ViewModels/Helpers/ServerAPI project references and controller/interface/
service imports were inspected. AccountTypeDefinitionProfiler imports the actual
classifier namespace and maps category for an unplaced grouping role after
materialization. During root integration, the generic IsAllowed pattern variable
was renamed to unrestrictedType to avoid a C# local-scope name collision.

Source checks reconcile the C# and TypeScript roles1–24 and result statuses1–4,
lookup flag defaults and caller mapping, response counters and terminal branches,
result table/export generics, bilingual vocabulary and guide consumers. Both
resource XML files parse with zero duplicate keys and contain the new messages.
Tracked repository diff whitespace checks pass; new untracked source was read
directly rather than relying on an empty tracked diff. Unrelated existing changes
are preserved, including externally present migrations/model snapshot.

The existing Kind column uses string conversion with length50 and subgroup FK is
nullable. The appended enum names fit that schema; this amendment needs no new
migration. Existing seed orchestration calls the same initializer both for an
existing chart and after creating the default chart, so both paths receive the
new coverage when executed by the application.

Reusable lessons were promoted to BE3 (explainable bulk-action coverage) and BE10
(classification versus posting eligibility), with matching skill checks/revision
rows and documentation changelog. Regenerated packet IDs: PLAN-00 and PHASE-00
through PHASE-06. Semantic review confirms BE3/BE10 source fingerprints in the
domain/detail packets and unchanged phase/shared-owner boundaries; final -Check
reports all eight packets current.

No build, test, lint, runtime, browser, database, migration, commit or actual
classification action was executed. Existing stored accounts are not claimed as
updated by this source-only delivery. Owner verification remains: compile both
projects, run the chart's automatic-linking action and inspect all root/group/
posting outcomes; rerun for AlreadyClassified/idempotence; review conflicting
accounts; verify child creation omits broad roles, deletion/type retention,
posting conversion guards, financial totals and responsive/RTL/theme/keyboard
behavior. Review/export should include all filtered rows across pages.

Suggested commits (not executed): backend `feat(accounts): classify all account
levels with explainable outcomes`; frontend `feat(accounts): show complete type
classification results and root types`; documentation `docs(accounts): record
classification coverage and posting eligibility`.

## Current Year Profit/Loss lookup diagnosis — 2026-10-23

Source-read-only follow-up to the owner's question why this account cannot be
linked. TierS, existing settings/typed-lookup shape: BE10, AccountSelectionPolicy
and LinkAccountsService are the shared backend owners; the existing General
editable-collection consumer displays the server's per-row AccountOptions. No
new UI/API shape, implementation authorization or runtime/data evidence in this
follow-up. Initial recipe drift check: all eight packets current.

Confirmed source defect: SeedDataService seeds 3-03 with the name Current Year
Profit/Loss, Equity category/subgroup and AllowChildren=false. The default-link
catalog explicitly identifies 3-03 as CurrentEarningsEquityAccount. The classifier's
name inference recognizes current year earnings/current earnings/current-year
earnings but not this seeded profit/loss name. If no existing link supplies the
singleton reference evidence, it falls back to ordinary Equity. The initializer
subsequently retains that financially matching Equity placement without checking
for this more specific semantic role, so rerunning initialization alone need not
repair an already classified account.

The target CurrentEarningsEquityAccount slot correctly requires the dedicated
CurrentYearEarnings type, and LinkAccountsService derives both AccountOptions and
write validation from that policy. An ordinary Equity type is therefore excluded.
Current stored type/state has not been inspected, so this is a source-confirmed
failure path explaining the reported symptom, not a claim about the live row.

Recommended correction: recognize the seeded account meaning, distinguish valid
financial placement from correct specialized role, and provide a conservative
repair for the known default account while retaining conflicts/history guards.
Immediate supported configuration is the dedicated Current Year Earnings type
within the same Equity report subgroup. No application/guide/schema/data changes,
builds/tests or browser execution were performed in this diagnostic follow-up.

## Authorized semantic repair — frozen bounded amendment, 2026-10-23

Owner requests the diagnosed fix and reports other remaining accounts. TierS
correction of the existing initialization rule; no new endpoint/schema/UI shape.
Backend shape remains the feature's explicit classification action, not settings
row CRUD. UI shape remains the existing tree/settings shared result dialog.
No delegation: classifier and initializer form one tightly coupled workstream.

| Concern | Owner/reference | Frozen correction |
|---|---|---|
| Specific role versus reporting placement | BE8/10; AccountTypeClassifier.Classify and existing AccountSelectionPolicy.GetAllowedKinds | Evaluate live usage constraints even for accounts with a valid report placement. Preserve specialized/custom roles when compatible; report incompatible references instead of silently accepting them. |
| Old broad system fallback | Existing source inference and system definitions | Permit refinement only for system types whose broad role equals the stored category/subgroup fallback, based on unambiguous usage or the account's own recognized name. Never infer a repair from a parent's name, replace a custom/specialized role, or move the stored reporting key. |
| Current year | SeedDataService 3-03; LinkAccountsDefaultCatalog.General; existing earnings role | Recognize seeded Current Year Profit/Loss and equivalent explicit Arabic/English current-year profit/loss wording. Existing broad system Equity can refine to CurrentYearEarnings in the same Equity subgroup; rerun then becomes AlreadyClassified. |
| Other unknown accounts | Existing initialization result contract | Unfamiliar names with valid placement may still use the existing broad fallback. Missing/incompatible reporting evidence remains NeedsReview with an explicit reason; no fabricated types or inherited report placement. |
| Save/result | Existing unique-write action and AccountResult | Preserve transaction, status/count, warning and localization contracts. A retained same-role matching placement is AlreadyClassified; semantic repairs are Updated. |
| Guide | Master7; Accounts UserGuide reader | Describe broad system-role repair, custom/specialized preservation and unresolved accounts. |

Source-only verification remains mandatory. No database cleanup or runtime action
is included in this authorization. Owner's later cleanup-screen question asks for
a concept, not deletion execution or implementation.

### New-chart readiness follow-up — frozen confirmed corrections

Owner explicitly requests thorough review of new-chart creation and all related
settings for immediate customer use. Root traces the existing seed contract and
delegates two nonoverlapping read-only audits: seed orchestration/financial setup
and default-link role compatibility. Both inherit the current model because the
AGENTS mapped explorer model is unavailable; neither edits source. Root alone
owns integration. Independent audits reduce wall time without shared-file edits.

Confirmed corrections in SeedDataService (BE8/13; current seed action exception):
SeedSetting must query the authenticated tenant through Repository, preserve an
existing numbering graph, and insert/stamp the JSON default only when absent.
Never query/update the JSON's default SubscriptionId=0. Ensure a default branch
only when the tenant has no live branch; preserve its existing branches. Existing
Account unique-write transaction and nested initializer save boundaries remain.
No financial dates, reporting mappings, customer choices or schema are invented.

Readiness findings to report separately: no fiscal year is created (a company
date-range decision), first cash-flow settings contain no cash scope/account
allocations, and ten historical blank charge links remain. Those are explicit
configuration prerequisites, not permission to guess cash equivalents or change
tax/interest/financial mappings. Nonempty new seed links pass source role/category
reconciliation, including the seven containers redirected to posting children.

### Semantic repair and readiness — final source reconciliation

Implemented — source-only; owner verification pending: yes. Changed application
sources: AccountTypeClassifier, AccountTypeDefinitionService, SeedDataService,
both GeneralMessage resources and accounts-guide.ts. Classifier now recognizes
the seeded current-year profit/loss name and explicit Arabic/English variants.
Its only caller supplies the retained type. Live reference constraints are
checked before accepting an existing classification. A broad system fallback
may refine from an unambiguous use or its own name; custom/specialized roles are
preserved or reported conflicting. Ancestor names never refine an existing role.
Financial placement stays fixed; only identical-kind + matching-placement rows
return AlreadyClassified. A repaired role returns Updated; a second run retains
the new specialized role. The unresolved result retains its current type label.

SeedSetting now uses the existing authenticated per-type unique-write guard,
tenant Repository lookup and ensure-if-missing behavior. It preserves an existing
numbering graph rather than reapplying JSON data; new graph ownership is stamped,
cancellation propagates and the outer account transaction remains authoritative.
Default Branch is added only when no live tenant branch exists. No stored
duplicate numbering rows are deleted or merged by this change.

Source scenario reconciliation (reasoned, not executed):

| Case | Expected source path |
|---|---|
| Untyped Current Year Profit/Loss in Equity | Own name -> CurrentYearEarnings, same report subgroup, Updated |
| Existing system Equity on that account | Broad system fallback eligible -> CurrentYearEarnings, Updated; rerun AlreadyClassified |
| Unfamiliar account name, one compatible live role constraint | Role constraint resolves before name; eligible broad fallback or untyped account gets matching type |
| Custom/specialized type with incompatible linked use | NeedsReview with bilingual existing-role/source explanation; no automatic replacement |
| Conflicting source roles | NeedsReview before retaining a type; no guessed assignment |
| Existing generic parent with a recognizable ancestor only | Preserve own compatible role; ancestor does not trigger refinement |
| Invalid/missing report subgroup | Keep prior NeedsReview guard; do not move the account to make assignment possible |
| New chart with existing numbering/branch | Reuse existing rows; do not overwrite/reinsert |
| New chart without numbering/branch | Add defaults inside current setup transaction |

Audits found ten explicit/unmapped charge defaults still requiring review:
Rental PreTerminationPenalty/RoofInsuranceCharges/TyreInsuranceCharges/VMDCharges/
Extra2Charges/AttachmentCharges; Lease ExcessInsuranceCharges; Limousine Discount;
Sales SuperCDW/PAI. No guessed seed mappings were added. A usable open fiscal
year and explicitly selected cash-equivalent/row mappings remain prerequisites;
setting initialization alone does not establish posting or cash-flow readiness.
Stock Transfer Bank Clearing demonstrates why every BankAndCash role must not
automatically become a selected cash equivalent.

Verification: source/import/namespace and single Classify caller reconciled;
SettingsDocumentNumberModel resolves through Business GlobalUsing line25 and
existing SDK/project references. Both resx files parse with no duplicate keys;
new reason exists in both languages. New untracked classifier/service source
inspected directly, no merge markers/trailing whitespace. Scoped tracked diffs
reviewed separately in backend/frontend and whitespace checks pass. Guide route
/UserGuide/accounts documents refinement, type retention and startup prerequisites.
No entity/EF/schema/AutoMapper/API/route/grid contract changed for these fixes;
no migration required. Phases0/1/4/6 applied proportionally; no new read-grid/form
or routing phase work. Suggested commits only: backend `fix(accounts): refine
legacy roles and preserve tenant setup defaults`; frontend `docs(accounts):
explain classification repair and setup prerequisites`. Build, runtime, two-tenant
repeated seed/rollback and financial acceptance remain pending. No prohibited
commands or database actions ran.

Final packet maintenance: a concurrent shared-table documentation update changed
UI6/UI14 fingerprints during this task. Refreshed only PHASE-02 and PHASE-03 using
the generator; before/after comparison contains those provenance hashes only.
Read the updated first-rendered-column/complete-flat-filter rules and editable
table shared-owner guidance; no feature-specific filter contract changes apply
to this backend correction. Final eight-packet -Check passes. Concurrent resource
GridFilter additions are preserved and remain outside this task's ownership.
