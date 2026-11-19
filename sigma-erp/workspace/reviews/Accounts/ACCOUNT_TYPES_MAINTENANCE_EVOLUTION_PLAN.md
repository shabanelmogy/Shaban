# Account types and linked-account selection — maintenance/evolution plan

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Date: 2026-10-23. Owner requests editable Odoo20 account types, automatic best-fit classification of existing accounts, filtering all linked-account choices (including banks, contacts and assets), and a sidebar Account Setting page. Owner confirms the system is experimental. This is implementation authorization; no database/build/test/migration/commit execution authorization. Source-only boundary remains.

## Scope and current inventory

Tier L. UI screen04 Account tree/embedded editor (UI1 reference itself); new Account Setting uses screen01 list + controlled modal, Workshop/Job list and shared EditorDialog references; existing LinkAccounts screen06 retains full-save/replacement contract. Backend extends existing Account pattern1 with its hierarchy exceptions; type definitions are tenant master data (pattern1), not a replacement of existing AccountSettings singleton. Canonical BE1–6/8/10/13 and UI1/2/4/6/13/16/19/22–29 own implementation. PLAN00/PHASE00–06 fingerprints current on initial Check. No supplied screenshot.

Current Account stores Category (five roots), StatementSubGroup and hierarchy; no fine account type. Account.SelectAsync returns active nondeleted posting accounts. LinkAccounts.GetByType and Save validate existence/posting state but no role. Its general, charge, contacts, payment, bank, prepaid and workshop tabs share the same choices. Dedicated HRM links, AssetType's three GL links, loan bank/interest fields, Bills/CreditNotes/PurchaseReturns/JVs and bank maturity have direct AccountService consumers. Report and opening-balance selectors are distinct workflows; generic journal/account selectors must retain all posting account types rather than imposing an arbitrary role. Direct-consumer inventory is targeted to AccountService imports, not a full-solution audit.

Existing writers include Account.Add/Update/Convert, LinkAccountsAutoLink and SubLedgerAccountService; SeedDataService seeds the five-category tree. Existing AccountSettings stores ExternalAccountCode and must remain intact. Existing financial reports own Category/SubGroup interpretation; this request changes classification/lookup suitability, not accounting totals, journal timing or reporting.

## Decisions and alternatives

| Concern | Decision | Evidence/reason |
|---|---|---|
| Editable definitions versus enum-only | Extend with tenant AccountTypeDefinition records; fixed AccountTypeKind semantic enum | Owner explicitly requests Add/Edit types; fixed roles keep validation stable when names change |
| Legacy data | Add nullable AccountTypeId; explicit Initialize action seeds system types and classifies null rows; preserve existing assigned types and account links | Owner says choose best-fit and update; null permits schema-first rollout without guessed default IDs |
| General category | Preserve existing five Category values and reports | User asks linked-list filtering; no financial-statement redesign |
| OffBalanceSheet | Seed and expose as a semantic type with no forced Category; generic posting selections can use it; role-specific financial links exclude it | Owner says keep available; metadata does not move a record out of its existing financial statement or create an off-balance posting workflow |
| Existing conflicts | Classify only compatible evidence; report ambiguous/incompatible existing roles, never move balances/change roots/rewrite links | Data/business safety; experimental status does not prove a financial role |
| Enforcement | One shared backend policy for typed lookups, LinkAccounts rows and scoped save validators | BE10 requires selectable/write predicate parity; frontend filtering alone can be bypassed |
| Name edits | Names editable; Kind of a system type or a referenced custom type stays fixed | Prevent reinterpretation of existing linked accounts |
| Initialization | Owner invokes after migration; no write-on-GET | BE8/16 and source-only boundary |

No additional approval is needed for frozen technical choices. Material conflicts found during classification remain visible; do not invent a different accounting rule to hide them.

## Frozen cross-worker contract

### Shared taxonomy

Namespace SiGma.Helpers.Enum.Accounts. AccountTypeKind values: Receivable=1, BankAndCash=2, CurrentAssets=3, NonCurrentAssets=4, Prepayments=5, FixedAssets=6, Payable=7, CreditCard=8, CurrentLiabilities=9, NonCurrentLiabilities=10, Equity=11, CurrentYearEarnings=12, Income=13, OtherIncome=14, Expenses=15, OtherExpenses=16, Depreciation=17, CostOfRevenue=18, OffBalanceSheet=19. Odoo20 source confirmed in this chat: addons/account/models/account_account.py selection account_type (official20.0 branch).

Entity AccountTypeDefinition in Helpers.Models.Accounts: EntityBaseWithNameWithNameLocalize; Kind AccountTypeKind; IsSystem bool. Account adds nullable int AccountTypeId and AccountTypeDefinition? AccountType. EF optional FK Restrict; no migrations/snapshot editing. Type names50 chars (existing base), trimmed nonblank Name, optional NameLocalized50. Tenant unique Name and unique system Kind (filtered IsSystem); safe current query/write tenant owners. Custom definitions select one of19 semantic kinds. Add/Update inputs Name/NameLocalized/Kind; server owns IsSystem. Update Kind is prohibited for system or referenced definitions.

Account Add/Update/Detail carry nullable AccountTypeId; existing payloads remain readable. Selected nonnull type must exist/be active and match Category for18 kinds; OffBalanceSheet is category-neutral metadata. Fixed roots stay fixed. ConvertToGroup copies type to new posting child. Existing Category/SubGroup/account code generation remains authoritative. New type options are explicit typed lookup; never overload DropdownDto.No with metadata.

API AccountTypeDefinition: inherited GetMany/GetById/POST/PUT; no Delete UI. GET Options?category returns Results<AccountTypeOptionVM>: standard Id/Value/No plus NameLocalized,Kind,Category(nullable). GET Kinds returns Results<AccountTypeKindOptionVM>: Id,Value,Category(nullable). POST Initialize returns Result<AccountTypeInitializationVM>: CreatedTypes,ClassifiedAccounts,SkippedAccounts,Conflicts(string[]). Interface IAccountTypeDefinitionService exposes GetOptionsAsync(AccountCategory? category, CancellationToken), GetKindsAsync(), InitializeAsync(CancellationToken). Use explicit result/error recovery. AccountSetting route /AccountSetting, sidebar English label Account Setting/Arabic إعدادات الحسابات.

### Shared selection policy

AccountLookupUsage in Helpers.Enum.Accounts: AnyPosting=0, Receivable=1, Payable=2, BankAndCash=3, FixedAsset=4, AccumulatedDepreciation=5, DepreciationExpense=6, Expense=7, Revenue=8, Prepayment=9, CurrentAsset=10, CurrentLiability=11, NonCurrentLiability=12, Equity=13, CurrentYearEarnings=14, Inventory=15.

Shared Business.Services.AccountServices.AccountSelectionPolicy static public:
- GetAllowedKinds(AccountLookupUsage): AccountTypeKind[] (AnyPosting has no kind restriction).
- Apply(IQueryable<Account>, AccountLookupUsage): IQueryable<Account>, active/nondeleted posting predicate plus active AccountType and allowed Kind for specific usages.
- IsAllowed(Account,AccountLookupUsage): bool, same predicate for materialized entities with AccountType loaded.
- GetUsage(LinkAccountMappingVM): AccountLookupUsage, mapping dimensions and actual slot evidence, not label heuristics.

Account API GET PostingSelect?usage=<numeric>: Results<DropdownDto>, delegates to policy Apply; invalid usage fails Result. IAccountService.GetPostingSelectAsync(AccountLookupUsage usage, CancellationToken cancellationToken=default). Existing GetSelect retains all-posting meaning for journal/report/general selectors. Angular AccountService.getPostingSelect(usage: AccountLookupUsage, options?: {skipErrorInterceptor?: boolean}): Observable<Results<DropDownSelect>>; typed enums under Account/models/account-type.ts (frontend worker owns).

Account type kinds by usage: Receivable->[Receivable]; Payable->[Payable]; BankAndCash->[BankAndCash]; FixedAsset->[FixedAssets]; AccumulatedDepreciation->[NonCurrentAssets]; DepreciationExpense->[Depreciation]; Expense->[Expenses,OtherExpenses,Depreciation,CostOfRevenue]; Revenue->[Income,OtherIncome]; Prepayment->[Prepayments]; CurrentAsset/Inventory->[CurrentAssets]; CurrentLiability->[CurrentLiabilities,Payable,CreditCard]; NonCurrentLiability->[NonCurrentLiabilities]; Equity->[Equity]; CurrentYearEarnings->[CurrentYearEarnings]. Mapping policy must preserve explicit source-supported contra-revenue/general slot exceptions rather than silently convert ledger behavior.

LinkAccountsListVM read adds AccountOptions:List<DropdownDto>, AccountTypeMismatch:bool, LinkedAccountLabel:string? and (for prepaid source) SourceAccountOptions:List<DropdownDto>. GetByType materializes choices once then attaches per row using policy; do not issue a request per dropdown row. Save checks the same usage, including prepaid source Value. Existing invalid links remain identifiable and are never silently removed for a type mismatch. Full replacement scope remains intact; save rejects unsuitable mappings with actionable error. AutoLink must assign a compatible type to created accounts and reject unsuitable candidates. HRM uses role-specific lookups/validation. Other direct linking consumers use PostingSelect for known role; ordinary journal/report/opening-balance account controls stay AnyPosting.

### Classification and seed compatibility

Initialize system19 per tenant idempotently, preserve edited names/assigned type IDs. For untyped existing accounts combine source references (contact roles, bank links, asset roles), name/ancestor evidence and Category/SubGroup. Narrow compatible reference role wins. Conflicting incompatible evidence is reported/skipped; never infer from the first matching link or account ID. If no narrow evidence, use existing subgroup/category: current/noncurrent assets, current/noncurrent liabilities, Equity, Income/OtherIncome, CostOfRevenue/Depreciation/OtherExpenses/Expenses. OffBalanceSheet is never guessed. No changes to Category/SubGroup or transactions. Type creation/classification is explicit owner-triggered, not database commands by the agent. Source seed/new-account writers must propagate/choose compatible types when definitions exist; initialization remains available for old tenants.

## Impact and gap classification

| Area | Classification | Change/risk | Phase |
|---|---|---|---|
| Account entity/EF/type definitions | Extend/Create | New nullable FK and tenant master table; owner migration | 1 |
| Account detail/editor | Extend | Typed select; legacy-null display; optional existing compatibility | 3 |
| Account Setting | Create | Existing shared list/modal; no new viewer/framework | 2/3/5 |
| LinkAccounts/HRM roles | Extend | Per-role choices and matching save guard; existing incompatible rows need correction | 2/3 |
| Asset/bank/loan links | Extend | Same shared policy at selector and write boundaries | 2/3 |
| AutoLink/seed/subledger | Extend | Preserve type semantics on automatic creation/conversion | 1/5 |
| Reports/JVs/opening balances | Keep | No arbitrary restriction or change of financial meaning | 6 |
| User guide/translations | Extend | Settings setup, classification, type suitability, errors | 5/6 |
| Financial calculations/permissions/transactions unrelated | Keep | No new auth API/posting/tax rules | n/a |

## Implementation ownership

Root freezes contracts, owns all translations, sidebar/routing/compile roots/DI integration, classification reconciliation, remaining direct consumers, guide and full diff review. Worker backend-taxonomy owns new taxonomy entity/config/API/services/VM/maps plus Account core model/service/validator changes. Worker frontend-taxonomy owns AccountSetting, Account details/models/service only. Worker link-policy owns new shared policy plus LinkAccounts service/VM/auto-link and existing LinkAccounts UI; may extend specifically assigned backend linking validators after notifying root. No overlapping files; all preserve user/peer edits. Max3 workers; use inherited model where routing needs it.

## Verification and migration

Source checks only: contracts producer/consumer, optional FK/nulls, fixed semantic roles, lookup/save parity, full replacement behavior, type-option localization, sidebar/route/compile entries, no merge/whitespace defects, complete scoped diffs per repository. Builds/tests/lint/browser/database pending owner. Owner runs Add-Migration AddAccountTypeDefinitions after source delivery; agent never generates/runs migration or changes snapshots. Apply schema before using new UI/API, initialize in Account Setting, inspect conflicts, then verify Accounts/contacts/banks/assets/HRM and generic journal/report controls in both languages/themes. No transaction amount/history rewrite. Suggested commits supplied at reconciliation.

## Owner clarification — reporting versus classification (2026-10-23)

Owner explicitly chooses Group/SubGroup for final reports and AccountType for classification and filtered linking. Preserve this separation. A later discussion of a single AccountType input was discussion only, not authorization to replace Category/SubGroup or derive their values from the type. The original frozen implementation remains applicable. Generic journal/report/opening-balance selectors retain their existing scope. Type/category compatibility prevents clear contradictions; the type does not rewrite the financial reporting hierarchy.

Contract clarifications from worker integration: AccountTypeDefinition List/Detail expose server-derived IsInUse to enforce Kind lock including softdeleted referenced accounts. HRM read rows expose per-role option arrays/mismatch flags/linked labels; policy.GetHrmUsage follows actual salary-item rules (employee advances/loans receivable; provision liabilities). ViewModels import DropdownDto from SiGma.Helpers.Dtos. These amendments elaborate the original frozen invariant and do not change accounting roles.

## Owner-approved hierarchy evolution — 2026-10-23

Owner now explicitly approves configurable Group -> SubGroup -> AccountType -> Account, retaining every existing main/subgroup and making new-chart creation complete automatically. Exact superseding contracts, preserved reporting keys, classification placement, source/runtime boundaries and new ownership are Frozen in ACCOUNT_CLASSIFICATION_HIERARCHY_DOMAIN_API_CONTRACT_FREEZE.md. This is an approved scope expansion; the earlier design discussion is no longer only a proposal. Existing source changes are extended in place. OffBalance remains an available definition with no invented financial reporting placement.
