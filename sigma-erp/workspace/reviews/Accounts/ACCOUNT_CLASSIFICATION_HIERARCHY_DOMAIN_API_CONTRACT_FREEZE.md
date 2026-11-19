# Account classification hierarchy — domain/API amendment

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Date2026-10-23. This is a new owner-approved handoff superseding only the independent Group/SubGroup placement in ACCOUNT_TYPES_DOMAIN_API_CONTRACT_FREEZE.md. Prior handoff remains historical. Owner explicitly approved new design: configurable Group -> SubGroup -> AccountType -> Account; subsequently requires retaining all current main/subgroups and a newly created chart ready with all details. This authorizes implementation, not database/build/test/migration execution.

## Business meaning and preserved contracts

- Existing five AccountCategory numeric values and every StatementSubGroup numeric value remain unchanged as the stable reporting keys. All current report computations/contracts remain compatible.
- Names/configuration become tenant-owned master records in Account Setting. Group selects the existing basic Category. SubGroup selects its Group and existing StatementSubGroup reporting key valid for that Category. This preserves the real financial meaning while permitting named groups/subgroups and types.
- Each usable AccountType belongs to one SubGroup and retains one stable AccountTypeKind role for filtered linking. Multiple named types can share a Kind and use different report subgroups (e.g Administrative/Selling expenses). Do not force all Expenses accounts into one reporting subgroup.
- Account selects type only. Server derives Category/SubGroup from its type placement; derived Category must agree with its immutable hierarchy-root Category. The reporting subgroup need not be inherited from the structural parent when an explicit type supplies it. Legacy null-type payloads retain existing compatibility until initialization; typed payloads ignore client SubGroup and use the type's configured reporting key. Category/Group/SubGroup display is read-only in the account editor.
- Existing balances, journal lines, account IDs, Category/SubGroup keys, tree/code identities and links are never rewritten during default initialization. Existing untyped accounts are assigned a type that preserves their current report subgroup. Conflicting evidence remains visible/skipped.
- Existing transaction guards survive: changing an account's reporting subgroup through a different Type is blocked when the account has transactions. There is no implicit descendant reclassification when changing a typed account. Legacy null-type level2 subgroup compatibility stays only for old callers; frontend uses type selection.
- Configured Group.Category, SubGroup.GroupId/ReportSubGroup and Type.SubGroupId cannot change when any assigned Account (including softdeleted) would have its report meaning reinterpreted. Names remain editable. Type.Kind remains locked for system or referenced types. No delete UI or new authorization mechanism.
- OffBalanceSheet stays among19 available definition roles. Current chart has no separate off-balance reporting bucket. Seed that role as an unplaced definition (SubGroupId null) rather than invent a financial placement. It can be assigned a valid existing subgroup from Settings while unused; only placed types appear in operational account-type options. Its existing classification-only/no-report-removal limitation remains explicit. Do not add a new Category or move existing accounts into an invented group.

## Exact new entity/API contracts

Helpers.Models.Accounts:
- AccountGroupDefinition : EntityBaseWithNameWithNameLocalize; Category:AccountCategory.
- AccountSubGroupDefinition : same base; AccountGroupId:int; Group:AccountGroupDefinition; ReportSubGroup:StatementSubGroup.
- AccountTypeDefinition adds AccountSubGroupId:int?; SubGroup:AccountSubGroupDefinition?. Optional only for safe schema/bootstrap and unplaced OffBalance system definition. New/custom type Add/Update require valid subgroup; Category compatibility derives from subgroup.Group and Kind. For an unplaced system OffBalance row, names may be maintained without forcing a guessed subgroup.
- FK Restrict. Retain optional Account.AccountTypeId from earlier handoff. No new per-account Group/SubGroup FK is needed because the type owns placement and Account.Category/SubGroup retain authoritative reporting snapshots.

Pattern1 APIs AccountGroupDefinition / AccountSubGroupDefinition: inherited GET root list, GET GetByWithNavigationsId/{id}, POST, PUT; no Delete UI and server Remove rejected. Add/Update editable fields Name,NameLocalized plus Category for Group or AccountGroupId,ReportSubGroup for SubGroup; server computes IsInUse. List/detail fields Id,Name,NameLocalized,Category,IsInUse for Groups; Id,Name,NameLocalized,AccountGroupId,GroupName,GroupNameLocalized,Category,ReportSubGroup,IsInUse for SubGroups. API options:
- GET AccountGroupDefinition/Options -> Results<AccountGroupOptionVM>: Id,Value,NameLocalized,Category.
- GET AccountSubGroupDefinition/Options?groupId optional -> Results<AccountSubGroupOptionVM>: Id,Value,NameLocalized,AccountGroupId,GroupName,GroupNameLocalized,Category,ReportSubGroup.
- GET AccountSubGroupDefinition/ReportKeys?category -> Results<DropdownDto> Id=existing StatementSubGroup number; Value=enum key. Same Category validity as existing AccountValidator.
- Type List/Detail adds AccountSubGroupId,SubGroupName,SubGroupNameLocalized,GroupName,GroupNameLocalized,Category(nullable),ReportSubGroup(nullable). Its Add/Update adds AccountSubGroupId:int?; names/Kind semantics from previous handoff.
- Type Options adds AccountSubGroupId,SubGroupName,SubGroupNameLocalized,GroupName,GroupNameLocalized,ReportSubGroup (nullable in DTO for schema safety). Include only placed active group/subgroup/type with compatible Kind/category. Existing category query filters by Group.Category. No client policy by labels.
- AccountTypeInitializationVM extends counts CreatedGroups,CreatedSubGroups while keeping CreatedTypes,ClassifiedAccounts,SkippedAccounts,Conflicts. Existing Initialize endpoint performs complete hierarchy initialization in one guarded owner-triggered transaction. SeedDataService invokes it for new-chart creation. Initialization is idempotent, including no-change success.

## Default/migration logic

Keep current group names from canonical seeded root Accounts where available; fall back to their existing category labels. Seed exactly5 canonical Groups matched by stable Category, and all existing valid StatementSubGroup keys under those groups, names from matching current level2/seed labels or corresponding existing enum labels. Preserve edited existing definition names and placements; don't recreate on repeated init. Expose labels EN/AR.

Default19 type roles use source-compatible report placements: Receivable/BankAndCash/CurrentAssets/Prepayments -> CurrentAssets; FixedAssets/NonCurrentAssets -> NonCurrentAssets; Payable/CreditCard/CurrentLiabilities -> CurrentLiabilities; NonCurrentLiabilities -> LongTermLiabilities; Equity/CurrentYearEarnings -> Equity; Income -> OperatingRevenue; OtherIncome -> OtherRevenue; Expenses -> AdministrativeExpense; OtherExpenses -> OtherExpense; Depreciation -> DepreciationExpense; CostOfRevenue -> CostOfSales. OffBalanceSheet unplaced until explicitly configured.

When classifying an existing account, keep its existing ReportSubGroup if valid for Category. Reuse a compatible system type for (Kind,SubGroupId), or create a named variant using both role and subgroup; never change the account reporting key to fit the default type. Group-only roots may remain without Type because they are fixed structural roots. Type definition unique system index changes from (tenant,Kind) to (tenant,Kind,AccountSubGroupId) to permit report-preserving variants. Name collision handling must loop until an unused <=50-character name, and handle restoring deleted system names safely. Newly seeded chart completes this whole setup automatically, without manual settings initialization.

## Ownership for amendment (previous ownership transferred explicitly)

- backend_taxonomy worker owns all new Group/SubGroup entity/config/DTO/service/controller/profile/interface files, AccountTypeDefinition entity/config/DTO/service/profile/classifier changes, initialization/default variant logic. Does NOT edit AccountService, AccountValidator, IAccountValidator or Account core VMs now (transferred to link_policy).
- frontend_taxonomy worker owns existing AccountSetting folder, Account details TS/HTML, Account models/details/list/account-type.ts/service. Add3 tabs (Groups/SubGroups/Types) using shared tabs/list/modal owners and exact new API contracts; account type is the only editable classification field, display reporting placement read-only. Root owns global routing/compile roots/translations/guide.
- link_policy worker now owns AccountService, AccountValidator/IAccountValidator and necessary Account core VMs/interface/controller; implement deriving classification from selected placed type and transaction/report-preservation guards. Also owns AccountSelectionPolicy/LinkAccountsService/AutoLink updates needed for active placed type chain. Avoid duplicate placement inference. Coordinate exact helper/contract with backend_taxonomy. Existing link choices/save roles and full replacement contract remain unchanged.
- Root owns integration, seed/subledger calls, root settings registrations/translations, remaining consumers/guide, complete scoped diff and final report.

Read applicable current canonical blocks and actual references. Preserve user/peer changes. No overlapping owned files, migrations/snapshots/build/tests/lint/browser/database/commits/push/deployment/Graphify/SigmaMCP. Source-only checks, migration and runtime acceptance remain owner tasks.

### System identity clarification

Group/SubGroup definitions use a server-owned IsSystem marker (same principle as Type definitions) to preserve original default identities independently of editable names and custom rows with the same Category/report key. System Group.Category and system SubGroup parent/report key remain fixed; their names can change. This is the technical mechanism required by the approved preserve-current-groups rule, not an additional business restriction inferred from UI visibility.

### New-chart readiness reconciliation — 2026-10-23

Source audit of the existing seed discovered25 ChargesType default links pointing to seven structural container accounts (revenue4-01-002/003/004 and expense5-01-002/003/004/005). Such parents are deliberately excluded from posting lookup/type assignment. The owner's explicit new-chart-ready instruction authorizes the smallest source-supported setup repair: retain those containers and their identities, add dedicated posting children under them for a newly seeded chart, and resolve new seeded mappings to those children. Their Category/SubGroup are inherited unchanged and classification runs afterward. This does not rewrite any existing chart mapping or journal; existing references to structural accounts are reported as initialization conflicts for explicit correction. Seed accounts/links/settings/classification share one transaction so failure cannot leave a partially completed new chart. No new ledger calculation or journal effect is introduced.

### Unified seeding clarification — 2026-10-23

Owner clarified that this is seeding implementation, not a request to operate a browser. The same account setup service must support both existing and empty tenant charts. Preserve the existing CreateDefaultAccountTree route and compatibility service method, but delegate them to a named, cancellation-aware SeedAccountSetupAsync entry. Inside its existing tenant Account write transaction, any existing account (including softdeleted history) selects report-preserving classification initialization only; never seed another chart/branch/link/settings graph. A tenant without account history follows the existing complete default-chart seed and then the same classification initializer. Repeated calls do not duplicate accounts or definitions. This is the existing authenticated new-chart preparation path; no tenantless startup seeding, schema creation, migration editing/execution or database command is added.

The owner reiterated retaining the former main/subgroups and confirming reports. Final source reconciliation must trace current financial statement producers/consumers of Account.Category/SubGroup, verify preserved enum values and selection/grouping, and correct only classification-related mismatches. Runtime numbers are not verified without authorized execution.
