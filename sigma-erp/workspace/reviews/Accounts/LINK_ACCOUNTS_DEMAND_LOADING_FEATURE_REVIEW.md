# Link Accounts demand loading implementation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-24 |

## Manifest / authority

### Rental insurance defaults amendment — 2026-10-24

Result: Implemented — source-only; owner verification pending: yes. SeedDataService now includes the two level3 analytical leaves beneath4-01; Rental catalog maps each slot to its matching code. Existing classification derives Income for both Revenue/OperatingRevenue accounts, and new-account budget defaults apply through the unchanged common seed pass. Reseed and Complete Missing Links consume the same catalog and retain existing selections through the unchanged guard/writer. Bilingual Link Accounts guide documents new-chart codes and existing-chart completion behavior. Scoped backend/frontend diffs and whitespace checks passed; existing unrelated account/reconciliation/loading changes preserved. No entity/namespace/DTO/EF/API changes, new registration or migration. No build/test/runtime/database commands run. Owner: rebuild/restart backend; preview/apply Complete Missing Links for current company, review eligibility/retained-selection warnings, verify distinct links and rerun preservation. New charts receive both accounts and links during normal setup. Canonical/skill unchanged; all8 packet drift checks passed.

Owner authorizes dedicated accounts for Roof Insurance Charges and Tyre Insurance Charges after the source diagnosis. Tier S: two defaults in the existing chart/catalog, no API/domain transition change. Before-edit conformance: BE10 owns Revenue selectability; existing AccountSelectionPolicy.GetChargeUsage already requires Income/OtherIncome; SeedDataService's Operating Revenues leaves own new-chart creation, LinkAccountsDefaultCatalog.Rental owns both seed and automatic completion; LinkAccountsAutoLinkService.BuildPlanAsync/AccountSetupLinkSelectionGuard preserve existing customer selections and report conflicts. UI06 settings layout remains unchanged; UI23 and Master7 require the bilingual Link Accounts user-guide handoff. Reuse these actual owners, no new writer or reference-module changes. Chosen new-chart codes4-01-007/4-01-008 are unused in current default/supplement sources, reporting subgroup OperatingRevenue, category Revenue, analytical leaves. Missing defaults on existing charts use the existing AccountService creation/code generator; fixed new-chart codes are not forced onto customer accounts. No database execution, migration or subagent required.

User approved implementing the source diagnosis. [Frozen plan](LINK_ACCOUNTS_LOAD_MAINTENANCE_EVOLUTION_PLAN.md) and [shared API/form/lifecycle contract](LINK_ACCOUNTS_LOAD_DOMAIN_API_CONTRACT_FREEZE.md) govern this end-to-end feature. No screenshot. UI06 existing Link Accounts settings workspace + shared EditorTabs/EditableCollectionTable/TabState retained; specialized backend Settings4 retains authoritative scoped Save. Applied PLAN-00, Phases0/1/2(read boundary)/3/5/6. Phase4 introduces no new financial action; auto-link accounting behavior unchanged. Existing account/reconciliation/sidebar changes and owner-created migrations/snapshot preserved.

## Changes

Frontend repository: parent LinkAccounts details TS/HTML; feature models/list.ts and services/linkaccounts.service.ts; TS files of all7 tab components; EN/AR saveBlocked wording; Accounts UserGuide topic.

Backend repository: ILinkAccountsService, LinkAccountsService, LinkAccountsController, LinkAccountsListVm (server accountUsage), new own-file LinkAccountsSelectionOptionsVM and LinkAccountsUsageOptionsVM. No entity/EF/schema change or migration. Existing AutoMapper untouched; response metadata is assembled by its owning service. No new DI registration needed on backend; existing service/controller auth retained.

## Final decisions and reconciliation

| Concern | Owning rule / final evidence | Result |
|---|---|---|
| Tab creation | UI1/13 settings reference; accountsReady + visitedTabKeys guard encloses retained section components | Current only first mount; visited drafts retained |
| Choices | BE10; new selection-options computes usages0–15 from one active posting graph using existing policy; no global account cache | Shared choices once per screen |
| Cache lifetime | UI28; feature parent provides LinkAccountsService while root HttpClient remains untouched | Screen-local enum/catalog snapshots, retry clears failure, auto-link invalidates choices |
| Compact API | BE3/10; includeAccountOptions=false opts into empty row arrays + server accountUsage; default remains full for existing two-arg callers | Compatible opt-in; no role reconstruction in client |
| Retained references | Existing active/posting/type checks and labels in AttachAccountOptionsAsync retained; compact graph queried only for selected IDs | Same mismatch/inactive-parent behavior; Save revalidates server-side |
| Prepaid references | Existing eligibility predicate restricted to stored source IDs; no full chart ID materialization | Membership preserved |
| Child lookups | Prepaid/Workshop replace4 HTTP account lookups with catalog references; branches and job categories remain first-visit queries | Redundant reads removed |
| Loading/errors | UI22/28; local tabLoading, cancellation/finalize; success loaded plus settled output releases refresh on failure; catalog failure releases refresh too | No unrelated tab global loading; Retry remains available |
| Safe lookup errors | Selection access inside observable map in Prepaid/Workshop | Cache invalidation errors enter local error channel |
| Save All scope | BE16; dirty instantiated components only, ready/valid check, complete unfiltered getPayload rows, submitted replaceTypes only | Unvisited/clean types never replaced; invalid dirty tabs block batch |
| Save result | Existing Result/transport handlers, global write loading, only submitted tabs markSaved on success | Draft retained on failed save; no extra success owner |
| Auto-link refresh | Choices invalidated, visited set becomes current only, component generation bumped, active reload determines success feedback | Other tabs fetch fresh on next visit; failed refresh permits retry/navigation |
| Form/fields | Existing dropdowns, validators, actions, search/module/branch filters preserved; server-owned accountUsage never sent in save | Payload unchanged except narrower declared type scope |
| UI conformance | Actual existing hierarchy workspace unchanged; shared tabs/collection/states retained, no CSS/layout fork | Source conformance; visual pending |
| Guide | Bilingual Accounts guide Link Accounts topic; existing reader/menu `/UserGuide/accounts` | Matches first-visit/changed-only save/refresh behavior |

## Read/write contracts beside displayed fields

General/Charges/Workshop use existing setting label and account choice; Contacts adds contact type/group/default badge; PaymentMethods adds category/method/branch context; BankAccounts shows bank; Prepaid shows source/expense accounts. Existing LinkAccountsListVM displayed fields/identity/mismatch labels stay intact. New accountUsage is minimal selection metadata consumed by hydration, not a new visible column. AccountOptions/SourceAccountOptions persist in UI row model but compact response arrays are empty; client attaches shared catalog references. New selection VM owns only accounts and per-usage lists of DropdownDto, not audit/tenant/type entities.

Existing save payload remains replaceTypes + mappings(type,value,accountId,subType,jobType,linkSection). A changed tab supplies all its rows, including search/module/branch-hidden rows. Clear/remove intent remains in its existing complete type scope. Clean/unvisited tabs are omitted from both collections. Backend Save scope and transactions unchanged, no monetary formula/permissions introduced.

## Verification evidence / limitations

All8 recipe checks OK, no canonical/skill rule change required for this feature-specific contract. Complete scoped frontend/backend diffs reviewed separately, whitespace passed. New .NET types each have their own file, correct namespace/imports and SDK inclusion; ViewModels→Helpers reference and existing service/controller references verified. Runtime TS entries unchanged (only existing files); ES2022 tsconfig supports flatMap. New settled outputs and all7 parent bindings match. No merge markers/stale AccountService imports in scoped children. Guide and EN/AR wording reconciled. No build/test/lint/browser/database/migration/commit/deploy, Graphify or Sigma MCP commands run.

Static normal first-open request count is **3**: enum options + selection catalog, then General by-type; previously15. Visiting every tab adds six by-type reads plus branch/job-category lookups, without the four redundant typed-account requests. Per-row account arrays are no longer serialized in compact responses. These are source-derived call/shape changes, not measured timings or successful runtime verification.

One reused inherited-model backend worker and one inherited-model frontend child/service worker had disjoint ownership after freeze; root owned parent/docs/contracts, final integration and error-channel/settled refinements. No overlapping writes or new subagents by workers. Parallel bounded changes reduced elapsed time.

## Owner checks

1. Rebuild/restart backend and frontend together; new selection-options endpoint and compact metadata must be available. No migration for this feature.
2. Inspect Network on first open: three feature requests; only General by-type. Open another tab once, revisit and verify no new tab request and retained draft.
3. Change two tabs, save: only their IDs in replaceTypes, complete rows in mappings even when filtered. Confirm unopened/clean sections unchanged. Failed save keeps dirty state; intentionally removed rows in dirty scope still reconcile correctly.
4. Try duplicate/incomplete Prepaid or Workshop rows: invalid dirty tab blocks save; an unvisited or failed unedited tab does not block another valid dirty tab.
5. Fail one tab read, switch and edit another; retry the failed tab. Verify local progress, no unrelated global blocking, navigation cancellation.
6. Apply Complete Missing Links after saving/discarding drafts: current section and choices refresh, other sections reload on next visit. Fail catalog/active refresh, retry and verify no permanent navigation lock or premature success toast.
7. Verify role-filtered choices, retained type mismatch warnings, cleared inactive/parent references, empty catalog, re-entered company freshness, Arabic/English and themes/narrow widths.

Suggested backend commit: `perf(link-accounts): share selection options and compact tab reads`.

Suggested frontend commit: `perf(link-accounts): load tabs on demand and save changed scopes`.

## Owner-reported retained earnings save error — 2026-10-24

Tier S diagnosis and error-context correction. Owner reports choosing3-02/Equity for Retained Earnings, but error names account99. Source verifies RetainedEarningsEquityAccount value2 uses Equity, while owner-provided failing request row is `{type:1,value:29,accountId:99,subType:null,jobType:null,linkSection:0}`. Enum value29 is **TollsPrepaidAccount**, using Prepayment → Prepayments. This proves the supplied account99 row targets a different link; live account99 type/code and complete remaining mappings are not inspected. If its type is Equity as described, this prepaid link is correctly rejected. Do not relax validation or change account type automatically to bypass it.

Before-edit conformance: BE8/10 own authoritative type validation; existing LinkAccountsService full changed-section save and LinkAccountsEnumCatalog.GetSetting own field identity; current localized error omitted that identity. Extend failure presentation only, retaining same predicate/query/scoped atomic save. New message includes account code/name, actual failing link, required semantic kinds and current stored type/kind, with EN/AR resources. Existing generic key retained for its other consumers; new key used at this specific typed-link boundary. No API shape, DTO, financial rule, mapping, schema or migration change.

Changed service method, shared GeneralMessage resources and bilingual Link Accounts guide under existing `/UserGuide/accounts`. No subagents: one bounded diagnostic improvement. Source-only scoped diffs, whitespace and resource XML/key uniqueness checked; all8 recipe checks OK, canonical/packets unchanged. Owner must rebuild backend, correct the **Tolls Prepaid** row to a Prepayments account (or clear it deliberately), keep Retained Earnings on its distinct Equity account, and retry. No database changes/build/tests/browser/commits run. Actual successful save remains owner verification pending. Suggested backend commit: `fix(link-accounts): identify the failing account link in errors`.
## Roof / Tyre Insurance Charges diagnosis — 2026-10-24

Source-read-only Tier S follow-up; no application edits or runtime/database access. Selected shape remains UI06 tabbed settings and backend Settings4; authoritative lookup rules BE10. Recipe check: all8 current; PHASE-01 consulted proportionally. Both Rental entries in LinkAccountsDefaultCatalog explicitly have empty default codes (lines88–89); SeedDataService therefore creates these slots with AccountId=null. This gap was already recorded in ACCOUNT_TYPES_FEATURE_REVIEW.md, not a newly discovered defect.

Distinguish seeding from Complete Missing Links: LinkAccountsAutoLinkService.BuildPlanAsync can still create/reuse accounts for these slots via SlotNature's OperatingRevenue fallback. A missing default alone does not explain an unsuccessful automatic-link run. That run also depends on eligible parent, matching active type, unique suitable existing name and retained-selection guard. AccountSelectionPolicy currently assigns Revenue usage (Income/OtherIncome) to these unseeded charge slots. No live parent/type/retained selection or preview reason inspected, so exact tenant-specific automatic-link failure remains uncertain. Explain the verified seed gap, existing revenue-role requirement and request preview reason if automatic completion also leaves them unresolved. No guessed mapping, accounting change, guide edit, build/test/browser/database command or new agent.

