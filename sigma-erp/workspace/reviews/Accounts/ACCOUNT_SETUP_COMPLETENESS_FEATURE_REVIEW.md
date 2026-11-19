# Complete account setup

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-23 |

Owner requests complete seeding of Chart of Accounts, Link Accounts and Financial
Statements, then explicitly approves dedicated financial-purpose accounts,
expanded cash-flow coverage and known prepaid pairs, preserving customer settings
on repeat. Frozen handoffs: ACCOUNT_SETUP_COMPLETENESS_LINKS_CONTRACT_FREEZE and
ACCOUNT_SETUP_COMPLETENESS_FINANCIAL_DEFAULTS_CONTRACT_FREEZE. No cleanup, database
execution, fiscal-date invention or unrelated report design is authorized here.

## Impact and chosen owners

| Concern | Classification | Owner / decision |
|---|---|---|
| Existing action and chart | Extend | SeedDataService.SeedAccountSetupAsync, existing authenticated SeedData/CreateDefaultAccountTree endpoint. No duplicate seed endpoint/service/tree. |
| Core transaction | Keep/extend | ExecuteUniqueWriteAsync<Account> remains outer tenant lock and multistage transaction. Every nested writer joins it; no child commits outer transaction. |
| Supported links | Extend | Existing LinkAccountsAutoLinkService planners/AccountService/shared link writer, new EnsureSetupLinksAsync interface method. |
| Actual default identities | Create small helper | AccountSetupRequiredLinkSlots enumerates required slots independently of optional stored dimensions. |
| Selected-account protection | Create small helper | AccountSetupLinkSelectionGuard reads stored selections, canonicalizes read identities and emits manual diagnostics; no replacement of nonnull choices. |
| Chart completeness | Extend | New SeedDataService.DefaultChart/Readiness partials; explicit posting leaves and purpose types, existing HRM rules. |
| Financial defaults | Extend | Existing FinancialReportSettings aggregate, new explicit EnsureDefaultChartAsync. Preserve existing header entirely; no read-time seed. |
| Prepaid defaults | Extend | Four approved source→expense pairs, same tenant and existing eligibility policy, null/absent only. |
| Fiscal years / masters | Keep boundary | No arbitrary fiscal period, Bank/person/payment master, account number or currency. Existing masters receive their supported links. |
| Reports / presentation | Keep | Financial math and ambiguity/reconciliation diagnostics unchanged; Basic Income standard layout and other report designs follow previous feature review. |

Backend BE1–6/8/10/16/17 and existing seed/domain-action exception apply; explicit
new data defaults use current roles and saved taxonomy IDs. UI screen ownership
and guide remain in the Financial Report Settings feature review. No new grid,
editor, screenshot extraction or frontend payload is needed for this backend
service request. Existing shared Result conveys info/warnings and the unchanged
authenticated controller remains the only action endpoint.

## Final contract/source reconciliation

| Path | Final behavior / evidence |
|---|---|
| New versus existing | All account history, including deleted rows, prevents recreating the whole chart. Both paths still ensure missing branch/numbering/classification/links/settings stages. No existing accounts, counters, parents, posting flags or report snapshots are replaced. |
| New supplemental accounts |27 exact posting/container defaults: petty cash, AR, physical inventories, staff advances, tax receivable, remaining asset costs, intangibles/investments, AP/staff/loan leaves, general provisions, dividends, amortization and loan interest. Grouping accounts stay expandable. |
| New purpose types | Six named definitions use existing kinds/valid saved subgroups: Amortization, Intangible Assets, Long-term Investments, Provisions, Dividends Received/Paid. Reuse matching definitions; incompatible same-name/type/parent/code fails explicitly. No enum or reporting group/subgroup expansion. |
| Tax split | Old AdvanceTax/TDS-in-payments default reused Prepaid Taxes despite requiring CurrentAssets, conflicting with the new Prepayment source role. Two default catalog entries now use new1-01-004-006; prepaid taxes retains001/Prepayments. Nonnull existing selections remain unchanged. |
| HRM parents | Missing Staff Provisions containers under current and long-term liabilities use exact source-supported rules. Existing equivalent groups reused; conflicting code/parent/type yields review. Generated children are created through AccountService with appropriate type IDs. |
| Required links | General except Test; all eight distinct charge enum domains including Miscellaneous; actual ContactGroups, PaymentMethods, Banks; nine Workshop Default ItemTypes; twenty editable HRM roles. Blank revenue charges use existing source-proven named revenue fallback, not guessed GL/shared numeric enum casts. |
| Default contact groups | Reuse existing provider for Customer/Supplier and validate exactly one persisted default after ensure. No fabricated customer/supplier/person. Failed or ambiguous default persistence fails the action. |
| Retained selections | Guard reads raw storage rather than stale-null UI projection. Invalid account/master/type/dimension/duplicate identity becomes a manual item with exact logical key. Legacy bank Value and nondefault stored section cannot bypass preservation. Contacts/HRM follow canonical Default identity; valid optional Workshop dimensions remain distinct. |
| Null links | Fill only missing/null. Recheck stored selection before writer mutations. Normalize null contact/payment master dimensions only as part of filling that row. Public standalone Apply/Hrm rules remain, with conditional transaction ownership and HRM Serializable when owning. |
| General versus HRM | Separate planners feed same existing account/link writer for setup; combined plan reports actual changed slots and manual items. Existing nonnull selections are never forcibly corrected. |
| Prepaid pairs | New-chart defaults: taxes→TaxPaid, interest→InterestExpense, Darb→DarbExpense, tolls→TollsExpense. Source Prepayment/target Expense eligibility checked. Existing nonnull mapping preserved; no invented Coupon target or arbitrary amortization workflow. |
| New financial header | After chart/types/links exist, exact current9 Income +5 Balance templates, five known cash leaves plus eligible actual operational cash links, seventeen standard cash-purpose rows (optional eighteenth remaining debt row). Existing header returns unchanged. |
| Cash scope | Explicit cash/petty/bank GL leaves; Bank/PaymentMethod links only beneath cash/bank hierarchy and eligible. Stock Transfer Bank Clearing excluded from cash equivalents and retained in balance-change coverage. GL example bank names do not create actual Bank masters. |
| Cash allocations | Original13 purposes + capital contributions/withdrawals, employee benefits, other current assets/liabilities. Actual posting IDs and exact type IDs, disjoint across all rows. Separate asset cost/intangible/investment/accumulated depreciation purposes; loan and employee provision allocations remain distinct. |
| Employee benefit method | Existing CashMovement method supplies current profit adjustment for mapped Expense targets and attributable payment legs. Exact HRM provision/expense pairs are mapped; no new formula, proportional allocation or journal rewrite. Noncash/mixed-purpose cases retain existing diagnostics. |
| Catchall coverage | Remaining current posting leaves assigned once after explicit targets/cash scope; optional remaining noncurrent liabilities use Financing/CashMovement. Future manual changes still belong to the settings UI; repeat setup does not overwrite saved account allocations. |
| Existing financial settings | Preserve cash rows/scope/allowed types; initialize only an unconfigured statement kind via existing typed Get/Save. Intentionally empty configured kinds stay empty. A company without a header receives the ordinary unsaved-policy template; no guessed cash equivalents for an arbitrary existing chart. |
| Readiness | Aggregate taxonomy conflicts, provision-group warnings, exact manual-link reasons, settings/row warnings and missing cash scope. A success with IsInfo/review count does not claim complete readiness. Hard stage/type/code/save failures propagate failure and roll back outer transaction. |
| Save results | New named-type/prepaid/provision/link writers check SaveChanges false, guarding no-change cases with ChangeTracker.HasChanges where appropriate. No failed stage silently continues as a successful new-chart initialization. |
| Namespaces/inclusion | Every new named helper owns its file; new partials explicitly import AccountServices/Accounts enums/VMs. Existing Business SDK glob, project references/global imports and assembly service registration cover all new source and dependencies; no constructor cycle. |
| Guide | Existing bilingual accounts-guide.ts /UserGuide/accounts describes supported link domains, dedicated types/accounts, new financial defaults, four prepaid pairs, preservation/readiness and fiscal/master boundaries. No new reader/menu. |

## Reconciliation and verification limits

Phases0/1/4/5/6 applied proportionally: root discovery/impact/current writers,
exact handoff freeze before implementation, seeded domain action, existing
controller/service integration, final source review. No new list/form phase
contract or source screenshot design required. Earlier financial statement phases
remain in their own owning review. No unresolved material owner decision remains.

Root reviewed scoped tracked diffs separately in SigmaBackend and Angular and
read added files directly. Two backend workers reused after bounded read-only
audits owned link completion and new financial-default seed; root owned shared
orchestration/supplement/prepaid/resource/guide/docs. A third inherited worker
performed bounded read-only final audit and found bank identity and save-failure
propagation issues; root corrected both, then reconciled canonical Contacts/HRM
identity as well. No overlapping writes or shared-reference rewrites.

Resource XML parses with no duplicate keys and bilingual key parity. Scoped
whitespace/merge-marker checks and eight-packet recipe Check pass. No canonical
book/skill rule was introduced, so no packet regeneration was needed. Source
inspection does not prove a successful compile or numeric/runtime correctness.

The seeding additions themselves add data and no schema. The preceding statement
components still require owner migration `AddFinancialStatementComponents` (and
pending global-settings schema changes if unapplied). No migration/snapshot edit,
build/test/lint/browser/database/commit/push/deployment/cleanup was performed.

Owner verification: compile; run new-chart setup in a fresh tenant and verify
zero unresolved required slots,20 HRM/9 Workshop defaults/all eight charge domains,
four prepaid pairs, valid detailed types on every posting leaf,9+5 financial
definitions and disjoint cash coverage; run again and compare IDs/mappings/row
counts/counters/branches; change customer settings then rerun and prove they stay;
exercise retained invalid/legacy bank/contact/HRM mappings and duplicate defaults;
simulate stage save failure and prove transaction rollback; verify two-tenant
isolation/concurrent setup versus link edits; reconcile normal accrual/cash,
payroll provision, capital, asset disposal and mixed-source diagnostics using
posted fixtures. Fiscal-year creation is a separate company date decision.

Suggested commits only: backend `feat(accounts): complete default account setup
and preserve customer mappings`; frontend `docs(accounts): explain complete setup
and financial defaults`. No commit was created.

## Owner navigation consolidation — 2026-10-23

The owner subsequently requests all account settings in one group under Accounts,
including Financial Setup currently under Administration. This is a bounded
tier S catalog relocation, following UI1/23/26/29 and Phase5/6; no new screen,
API, data or accounting contract is introduced. No additional agent was needed.

| Concern | Canonical / actual owner | Final source match |
|---|---|---|
| Menu hierarchy | UI1; SidebarMenuComponent recursive PanelMenu + sidebar-menu-data.ts | Accounts → Account Settings contains classification, Link Accounts, Financial Report Settings, Fiscal Years, Currencies, Payment Methods, Cost Centers and the existing finance guide. The old Administration finance group is removed. |
| Navigation identities | UI1; MenuCatalogService.routeKey/index | All seven route URLs and both guide URLs retained; classification receives its existing descriptive translation key to distinguish the child from its parent. Account tree, postings and report menu positions stay unchanged. |
| Active/search/shortcuts | UI1; SidebarMenuComponent.toPanelItems/filterMenu, SidebarShortcutsService.loadUser | Existing recursive search and active-descendant expansion cover the new level. Leaf pin IDs stay route-based. The old finance group pin maps to the new settings group before catalog validation. |
| Access and integration | UI26; app.routes.ts AuthGuard + pages/routing.ts | Existing lazy routes/providers/guards unchanged. No permission mechanism or visibility claim introduced. |
| Translation / guide | UI23; EN/AR sideMenu.accountss, existing UserGuide reader | Two new bilingual menu keys. accounts-guide.ts, administration-guide.ts, cost-centers-topic.ts and payment-methods-topic.ts now describe the actual menu. /UserGuide/accounts and /UserGuide/admin-finance remain reachable. |

Scoped source diff reviewed separately in Angular, including the existing shared
catalog/shortcut consumers. No private menu renderer, CSS, additional route or
compile entry is needed. No new backend/schema change arises from this move.
Owner checks remain pending: open all seven settings in both languages, verify
active parent/search/mobile disclosure and old pinned finance-group restoration.
No build, test, lint, browser, database or prohibited command was run.

Updated suggested frontend commit: `feat(accounts): unify account settings
navigation and financial statement configuration`.

### Owner menu ordering refinement — 2026-10-23

The owner requests Fiscal Years first inside settings and Account Settings first
inside Accounts. Final order: Account Settings, Chart of Accounts, then the
existing guide/operational/report entries. Within settings: Fiscal Years,
Currencies, Account Classification, Link Accounts, Payment Methods, Cost Centers,
Financial Report Settings, Financial Setup Guide. This supersedes only the
previous navigation order; all routes, icons, translation keys and shortcut IDs
remain unchanged. The bilingual accounts guide reflects the final sequence.
Tier S source-only UI1/Phase5/6 change; no backend/schema or new agent required.
Scoped menu/guide diff and whitespace reviewed; eight recipe checks pass.
Owner visual verification of ordering in both languages remains pending.

### Account Classification actions beside search — 2026-10-23

Owner requests the buttons in the search row in every classification tab. Tier S,
existing three tabbed modal-list sections; UI3/4 and proportional Phase2/6.
Workshop/Job list was inspected for shared FilterPanel/FilterActions composition;
FilterPanelComponent public inlineActions/mainColumns/responsiveColumns and its
canonical UI4 compact/intermediate layout own the final responsive behavior.
The owner's explicit placement supersedes the ordinary title-action position
for this screen only.

List title now has no actions. One parent-owned typed template retains the
existing Initialize/Create handlers, labels and busy gates. Both Groups and
Subgroups pass it through the required TemplateRef input to their existing
filter-actions slot; Types renders the same template in its own slot. Search,
Reset and Export remain in the same forms. All three tabs use inlineActions,
one flexible search column and the existing intermediate one-column fallback.
No feature CSS, domain/API/payload, save/confirmation, table or translation
changes. NgTemplateOutlet is imported and registered in both standalone
consumers; both child call sites supply the required input.

Changed application files: AccountSetting/components/list/list.component.html
and .ts, classification-definitions/classification-definitions.component.html
and .ts, plus UserGuide/content/accounts-guide.ts. Existing /UserGuide/accounts
now describes action placement and narrow-screen wrapping in EN/AR. Scoped diff,
public control inputs and whitespace reviewed; recipe Check passes all eight
packets. No backend/migration or agent needed. Owner verification pending for
all three tabs at wide/intermediate/mobile widths, RTL/themes, keyboard Search
and Add/Initialize busy/confirmation flows. No build/test/lint/browser/database
or other prohibited command run. Suggested frontend commit:
`fix(accounts): align classification actions with search across tabs`.

### Retained link diagnostics and chart tree controls — 2026-10-23

Owner supplies five automatic-link failures identifying existing selected
accounts with missing/unsuitable types, including 3-03 in both earnings slots.
Source review confirms a data-classification issue: the current initializer
already refines missing/generic types from linked-use evidence, but rejects the
contradictory CurrentYearEarnings/Equity constraints of a shared earnings account.
It intentionally preserves specialized/custom choices. No safe authority exists
to silently rewrite the retained-earnings selection or change posted balances.
The ordinary planner additionally omitted nonnull incompatible selections from
its terminal review set, while the setup path already had a raw-storage guard.
The supplied exact legacy message is absent from the current scoped source;
the owner's running build/data therefore remains separate evidence.

| Concern | Owner / evidence | Final source |
|---|---|---|
| Invalid retained links | BE3/8/10; AccountSelectionPolicy, existing setup-selection guard | Ordinary preview and Apply use the same guard as setup, recount terminal actions, and show account identity/required role plus the shared earnings conflict. No read-time writes. |
| Selected-account preservation | Frozen supported-links contract; existing writer | Ordinary Apply uses preserveSelections and Serializable when owning its transaction; no child commits an outer transaction. Existing invalid selections remain manual and cannot be silently replaced. |
| Actual type repair | Existing AccountTypeDefinitionService.InitializeAsync/Classify | No new classifier or account mutation. Missing/generic Prepayment types can be corrected by the existing explicit action. Shared earnings mappings require explicit types and separate retained account; custom/conflicting uses stay reviewable. |
| Messages/contracts | Existing Result/LinkAccountsAutoLinkPlanVM and localization | No new DTO/API/schema. Five new EN/AR resource keys; XML parsed and duplicate keys absent. Guard signature/callers, namespace/global localizer imports and Business SDK source inclusion inspected. |
| Tree actions | UI1 hierarchy exception; existing Chart of Accounts reference explicitly placed in scope by owner | Expand/Collapse create new arrays and node objects at every depth; selection rebound by stable key without reopening ancestors. |
| Search versus expansion | Existing local search/filteredData | New search opens matching branches; explicit bulk actions retain their state during the current search rather than being overwritten by expanded=true. Clearing search keeps bulk expansion state. |
| Widget contract | Installed PrimeNG tree onChanges(value)/OnPush node inputs | Fresh references reach both root and nested inputs. No private widget methods, remount, DOM force-refresh or hierarchy data change. Buttons disabled during tree load/classification lock. |
| User guide | Existing accounts-guide.ts and /UserGuide/accounts | Bilingual tree search/bulk action behavior and exact earnings/prepayments roles, existing type initialization action and conflict repair sequence documented. |

Bounded tier S fixes in the existing Accounts feature: source discovery,
existing frozen contract addendum, proportional backend action/read and frontend
tree repair, then reconciliation. No new list/editor/API contract, mapping,
financial calculation, reference module outside explicit scope, or migration.
No agents used: small sequential diagnostics and UI work did not meet the gate.

Changed files in this slice: backend LinkAccountsAutoLinkService.cs,
AccountSetupLinkSelectionGuard.cs, both GeneralMessage resources; frontend
Account/components/list/list.component.ts and .html, accounts-guide.ts. Scoped
source diff reviewed per repository, including the added guard file directly;
signature/import/resource/merge-marker/whitespace checks are source-only.
Eight generated packets remain current. No build/test/lint/browser/database/
migration/commit/push/deployment command was run.

Owner verification pending: rebuild current source; run type initialization and
inspect each of the five outcomes; if earnings share3-03, explicitly set3-03 to
CurrentYearEarnings and a separate retained account (default3-02) to Equity,
refresh the linking screen and correct the retained selection before retrying.
Custom/conflicting types require explicit review. Confirm retained selections,
manual counts and repeated/concurrent Apply. For the tree, expand/collapse three
levels repeatedly, repeat during a search, clear/change search, retain a selected
deep account while collapsing, then save/refresh selection; verify keyboard,
narrow widths, both languages/themes. Actual customer data was not updated.

Suggested commits only: backend `fix(accounts): report incompatible retained
links and preserve selections in automatic linking`; frontend
`fix(accounts): refresh chart tree expansion at every depth`.

Final workspace observation: a statement-component migration and modified model
snapshot appeared during this slice's final status check. They were not created,
opened, edited or executed by this work and are preserved as owner/peer changes.
The linking/tree corrections themselves require no additional schema change.

### Account create failure: sibling uniqueness — 2026-10-23 (frozen fix scope)

Owner submits POST Account with name Retained Earnings, parentId3 and typeId12;
server reports failure to generate a unique code after retries. Source proves
the catch treats every SQL2601/2627 as a code failure, although AccountConfig
also has an unfiltered unique (tenant,parent,name) index. Validator lacks the
matching sibling-name check, and each failed retry leaves an Added entity tracked.
The seeded chart already contains Retained Earnings; actual customer contents
are not queried, so a duplicate name is a supported likely cause, not DB proof.

Freeze the bounded repair: normalize the saved name and validate its existing
tenant/parent business key before Add/Update, excluding self on Update. Include
deleted history because the current index is unfiltered; report a reserved
deleted name separately. Keep same-name accounts under different parents valid.
Serialize participating Add/Update through existing ExecuteUniqueWriteAsync<Account>,
generate one code and save once; remove misleading indiscriminate retries.
Respect all historical codes with the same parent-code prefix, including a code
stored under a legacy different ParentId. Propagate a false save result. No
index/schema/API/payload/accounting change, DB operation or existing-account
replacement. Existing frontend already displays both Result and transport errors.
UI shape stays hierarchy workspace; BE5/8/18, Phase3/6 apply proportionally.

Owner refinement before handoff: explicitly allow reusing a deleted sibling's
name. This supersedes the historical reserved-name decision immediately above.
Validate only live names (including legacy IsDeleted null through the repository
predicate), and filter the existing sibling-name unique index by IsDeleted=0,
matching current lookup-definition index conventions. Keep AccountCode uniqueness
unfiltered and include history when generating codes. The owner must generate
and apply `AllowDeletedAccountNameReuse`; migrations/snapshots stay untouched.

Final source reconciliation for account creation: AccountService Add wraps its
custom create core and Update wraps its protected base-compatible UpdateCoreAsync
in the same tenant Account write lock. Validator normalizes the saved name and
checks live siblings on both paths, excluding self on Update. One new bilingual
duplicate key reports the existing code with409. Deleted-name reserved messages
were removed before handoff after the owner's refinement. AccountConfig retains
unfiltered code uniqueness and filters only the existing name index. Generation
keeps deleted code history and checks code-prefix reservations even for legacy
different parent identities; nullable parent level derives from code depth.
Add/Update propagate false saves, and the broad SQL unique retry/obsolete import
are removed. No existing IDs, parent/type/reporting rules or payloads change.

Conformance: BE5/8 shared ExecuteUniqueWriteAsync and live duplicate rules;
AccountConfig indexes own the persistence invariant; existing Account/details
editor owns feedback for declared and transport failure and retains the form.
The filtered-index convention excludes IsDeleted=true rows; legacy null values
remain live in repository validation and participating serialized writes, while
the SQL index predicate follows existing definition-index convention IsDeleted=0.
No global EntityBase nullability or historical data normalization is introduced.

The existing bilingual accounts-guide.ts /UserGuide/accounts describes live
sibling uniqueness, name reuse after deletion and reserved historical codes.
Backend files: AccountService.cs, AccountValidator.cs, AccountConfig.cs, both
GeneralMessage resources. Frontend file: accounts-guide.ts only. No new frontend
component/route, DTO, AutoMapper or calculation changes. No agent was needed for
this tightly sequenced repair. No prohibited execution or migration/snapshot
editing was performed; existing owner migration files were preserved.

Owner verification pending after generating/applying AllowDeletedAccountNameReuse:
create the same live sibling name (clear409/code); change case/surrounding spaces;
same name under a different parent; reuse a deleted name with a fresh code;
update unchanged name; reject renaming to another live sibling; simultaneous
same/different-name creations; legacy reserved prefix/different ParentId; verify
failure rollback and both-tenant isolation. Run compile and screen save/retry.
Source-only scoped diff/import/override/whitespace/resource checks do not establish
database or runtime success. Suggested backend commit:
`fix(accounts): validate live sibling names and serialize account creation`;
frontend: `docs(accounts): explain deleted account name reuse`.

### Owner refinement: reuse deleted account codes — 2026-10-23 (Frozen)

Owner explicitly requests code reuse as well as name reuse after deletion. This
supersedes every reserved-code statement in the preceding historical repair.
Current delete validator blocks roots, live children and live journal details;
reuse does not relax those guards. New accounts retain new IDs; no restoration
of deleted rows or transfer of references/amounts is authorized.

Use live-only tenant code uniqueness and candidate reads, matching BE2's filtered
index convention. Under the existing Account write lock, allocate the smallest
free segment (01–99 for level2,001–999 for deeper levels) from live prefix codes,
including live descendants/legacy different ParentId entries that reserve the
same branch segment. Fill gaps so a deleted middle code is actually reusable;
never duplicate a live code. Keep code width, hierarchy limit, automatic-code
payload, account IDs and existing links unchanged. The explicit provision-parent
setup check follows the same live-code policy, but the whole-chart history guard
still prevents recreation of a second chart. No new deletion permission/action.

Change AccountConfig's existing code index to IsDeleted=0 alongside the already
filtered name index. Suggested new owner migration: AllowDeletedAccountCodeReuse;
it also captures the name-index delta if the earlier name migration was not yet
generated. Do not edit or run migrations or snapshots. Bilingual guide and final
source reconciliation must state both name/code reuse rather than reservation.

Implemented — source-only reconciliation for the code-reuse refinement: both
AccountConfig unique indexes are filtered to IsDeleted=0; allocator uses the
repository's live tenant scope, collects occupied branch segments into a set
and selects the first free bounded segment. It no longer uses historical max+1.
Prefix matching also reserves live descendant/legacy-prefix segments; unrelated
legacy sibling prefixes cannot consume this branch's numbers. Existing Add's
Account write lock serializes participating allocations and the database index
remains the final live-code invariant. SeedDataService.Readiness checks live code
occupancy when explicitly ensuring a provision parent. New-chart history checks,
delete guards, existing rows, FK IDs, links, journals and report math remain as
before. The bilingual accounts guide describes reusable names/codes, gap filling
and independent new IDs. No new route/form/API/type/namespace or mapping change.

Scoped changes in this refinement: AccountService.cs, AccountConfig.cs,
SeedDataService.Readiness.cs, one AccountValidator comment and accounts-guide.ts.
The existing backend configuration/unique-write references were inspected, source
diffs reviewed separately in both repositories, whitespace and merge-marker
checks passed. No agent was needed for this small dependent change. No build,
test, lint, DB, migration, snapshot, commit or deployment operation was performed.
Owner verification remains pending after AllowDeletedAccountCodeReuse: delete a
middle and last eligible child and add new accounts; verify the first free code
is reused, live codes never repeat, both names and codes can match deleted rows,
new IDs do not inherit links, another tenant is isolated, simultaneous additions
choose distinct live codes, full99/999 slots reject allocation and normal subtree
report/lookup selection excludes deleted rows. Existing owner migration files
are preserved. Suggested backend commit: `fix(accounts): reuse deleted account
codes and allocate live hierarchy gaps`; frontend: `docs(accounts): explain
deleted account code reuse`.

### Owner refinement: chart ordering by code — 2026-10-23

Owner requests code order even when an account is inserted later. Tier S read
repair, existing hierarchy workspace (UI1 screen04) and custom tree API, scoped
Phase2/6. The canonical tree/embedded-details owner remains Account/components/list;
no generic grid or new shape is introduced. GetAccountNestedListAsync previously
sorted by database Id; it now sorts persisted AccountCode ascending, then Id as
stable tie-breaker, before projection/materialization/tree assembly. Canonical
generated code segments retain fixed padding. The lookup is built from all nodes
before assembly, so a late-added parent does not affect placement. Each parent's
Children list and the roots retain code order independently of identity/time.

Consumer reconciliation: existing AccountService.getTreeList maps children in
response order; refreshTree reloads this endpoint after Save/Delete/Convert and
preserves expansion/selection; local search reduces in source order and bulk
expansion maps without sorting. No label parsing, frontend duplicate sort, DTO,
API, ID, layout, mapping, calculation or schema changes. Bilingual accounts guide
/UserGuide/accounts documents code order including reused gaps. Changed files:
backend AccountService.cs; frontend accounts-guide.ts; this review record.

Scoped diff/whitespace/merge-marker checks reviewed per repository; recipe Check
passes all eight packets. No agent required for one bounded ordering fix. No
build/test/lint/browser/DB/migration/commit/deployment executed. No additional
migration required by this change. Owner checks pending: create a late account
with a reused earlier code, verify sibling/root code order after refresh/search,
keep the selected account expanded, and check both languages. Suggested backend
commit: `fix(accounts): order chart tree by account code`; frontend:
`docs(accounts): explain chart code ordering`.
