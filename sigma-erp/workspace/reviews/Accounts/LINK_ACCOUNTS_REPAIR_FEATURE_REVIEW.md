# Link Accounts corrective action implementation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-24 |

## Manifest / decisions

Owner requested corrective action for the nine invalid retained links in12345.PNG and the same reference for subsequent creation; clarified that this is development and closest suitable account roles are the priority. [Frozen plan](LINK_ACCOUNTS_REPAIR_MAINTENANCE_EVOLUTION_PLAN.md) and [API/action contract](LINK_ACCOUNTS_REPAIR_DOMAIN_API_CONTRACT_FREEZE.md) apply. Shape: UI06 existing tabbed Link Accounts settings + existing auto-link preview action dialog; backend specialized Settings4/authoritative domain action. References inspected: LinkAccountsService typed read/save, LinkAccountsAutoLinkService planner/writer, selection policy, guard, catalog, seed prepaid pairs; shared EditorDialog/DataTable/SummaryCards/ConfirmationDialog and root HTTP client. Source-only snapshots, not a running tenant inspection. Existing account/reconciliation/performance changes and owner-created migrations/snapshot preserved.

Screenshot facts: Roof/Tyre selected prepaid-interest/buildings accounts, four banks selected CustomerDefault, customer-group dimensions conflict, invalid prepaid source, workshop Mechanical account unsuitable. Full unseen reasons and actual row/type IDs remain unverified. Image supplies functional cases, not copied layout. Scope excludes HRM's dedicated workflow, account reclassification/moves, journal/balance/history rewrites, deletion/duplicate merges, financial report settings, broad default remapping and schema changes.

## Source changes / ownership

Backend: ILinkAccountsAutoLinkService, LinkAccountsAutoLinkService.cs and new partial LinkAccountsAutoLinkService.Repair.cs; LinkAccountsDefaultCatalog; SeedDataService.DefaultChart; LinkAccountsController; existing plan/item VMs plus new own-file LinkAccountsRepairRequestVM; EN/AR shared GeneralMessage resources. Frontend: Link Accounts models/list.ts, service, details TS/HTML, auto-link TS/HTML; i18n EN/AR; Accounts UserGuide content. No SCSS, runtime entry, new DI registration or navigation route. Same service interface registration reaches the added methods. DTO request namespace is imported by interface/service/controller; AccountLookupUsage explicitly imported in the partial; SDK projects include new .cs files and Business references ViewModels/Helpers. No AutoMapper changes: minimal diagnostic DTOs are server-constructed.

Final determinism refinement: AccountSetupLinkSelectionGuard orders its diagnostic rows by Id; common planner orders its account graph by Id; repair sorts equal slot labels by all logical key dimensions before hashing. This removes incidental SQL ordering from preview validation without changing selection-preservation or role rules. Peer audit's prepaid/workshop findings and tie-breaker recommendation were resolved in source.

## Before/after conformance and final reconciliation

| Concern / rule | Final owner and match | Limit / owner check |
|---|---|---|
| Explicit correction boundary, Master4/BE16 | Separate repair GET/POST; normal completion/seed keep selection preservation | Cannot treat running seed as replacing existing links |
| Source identity, BE8/10 | Guard diagnostics + current typed read; IsCanonicalRepairSlot rejects unsupported/orphan source; exact one logical/physical row | Duplicate rows remain Manual |
| Suitable targets, BE10 | Shared BuildPlanAsync explicit server slot set uses catalog, allowed kinds, parent, type and AccountService writer | No arbitrary reuse based only on numeric IDs or account names |
| Coverage | Invalid account replaced; valid account retained for canonical metadata repair | Valid unrelated/customer-selected links omitted |
| Future creation reference | Same catalog/policy/planner; four unchanged prepaid pairs extracted to catalog for both new seed and repair | No new alternative provisioning service |
| Workshop sections | Existing GetUsage semantics now matched by planner placement: Inventory / OperatingRevenue / CostOfSales | Not every Workshop link is an inventory role |
| Prepaid source | Valid known source can repair its expense target using existing four pairs | Invalid/unknown source stays Manual; never substitutes source or retypes an unrelated GL |
| Preview / concurrency, Master4/BE8 | Read-only plan; opaque SHA256 token over sorted plan + retained mapping snapshot; apply rebuilds before writes | Missing/changed preview rejected with localized reload instruction |
| Persistence, BE5/16 | Serializable transaction across AccountService leaf creation and final tracked link save; target revalidated; exact row only and canonical fields normalized | Error/disposal rolls back earlier account/mapping saves |
| UI action, UI9/13 | Separate header button, shared preview/confirmation, busy/close/double-click guards and dirty discard | Layout/RTL/theme remain shared; visual acceptance pending |
| Errors/lifetime, UI22/28 | Result and transport channels, Retry/reload stale plan, finalize/teardown; existing deferred success/active-tab refresh | Compile, interrupted connection and runtime checks pending |
| Minimal response, BE3 | Old account identity/label + planned account/parent/type/action + reason and snapshot token only | No journal, entity audit or client-selected target DTO |
| Guide, Master7/UI23 | EN/AR Link Accounts steps at `/UserGuide/accounts`, existing reader/menu | Covers preview/apply, preserved valid links, manual cases and unchanged journals |

Grid ↔ DTO/TS model (same ordered fields): Section=`Type/type`; Setting=`SlotLabel/slotLabel`; Action=`Action/action`; Existing account=`PreviousAccountCode/Name/Id` rendered via `previousAccountName`; Proposed account=`AccountCode/Name` plus create parent; Reason=`Reason/reason` wrapping through DataTable public cellClass. Manual proposed account shows a dash, avoiding duplicated explanation. Existing ordinary-completion columns stay unchanged. Row identity and planned AccountTypeId/ParentId support the server operation; IsCorrection selects its correction badge; PlanToken only enters the typed apply body. No frontend target/account/type input accepted by repair API.

## Action-state / API / scenarios

Authenticated tenant repository scopes both GET `/LinkAccounts/repair/plan` and POST `/LinkAccounts/repair/apply`. Request `{planToken:string}`; response `Result<LinkAccountsAutoLinkPlanVM>`. No new authorization mechanism invented; future permission candidate is this corrective POST. Action available after screen bootstrap, disabled while writes/refresh/confirmation/dialog active. Apply requires loaded actionable plan + token, shared confirmation, no duplicate request. Cancel/preview makes no changes. Closing a successful result refreshes catalog and current section; other tabs first-visit reload. Failures retain preview or provide explicit reload. Existing HTTP error/success interceptor suppression and single deferred toast retained.

Reasoned source scenarios, not executed: wrong prepaid-interest→Roof charge uses Income seed/default/new leaf; buildings→Tyre charge uses independent Income target; bank/customer-account mismatch gets BankAndCash target; stale contact type takes live group's dimensions and retains target only if allowed for that current role; workshop revenue/expense gets its own placement; valid known prepaid source with bad target takes shared pair; invalid source and duplicates remain Manual; changed stored selection yields different token before write; successful repeat omits corrected items; failed new account or final save rolls the transaction back; valid custom selections stay untouched. Required accounting review of unknown sources remains explicit, with no claim that every screenshot item can be resolved from truncated evidence.

## Verification / handoff

PLAN-00, Phases0/1/3/4/5/6 applied proportionally. Phase2 adds columns to an existing complete local table only; no server paging/filter contract. Phase4 action owns repair, ordinary Save unchanged. Initial eight-packet drift check passed; no canonical/skill changes and no packet regeneration needed. Scoped backend/frontend diffs reviewed separately; whitespace passes, resources parse with exactly four new keys each. New class declarations/namespace/import/project inclusion checked; no migrations/snapshot modifications in this task. One inherited-model frontend worker owned disjoint nine files after freeze and gave a bounded backend read-only audit; root fixed its two findings, integrated UI old-account fallback/manual display and owns final reconciliation. Parallel UI work reduced wall time without overlapping edits.

No build, tests, lint, browser, database, migration, commit, push, deployment, Graphify or Sigma MCP commands run. No migration needed. Owner must rebuild/restart backend and frontend together, preview correction, inspect old/new account and full reason, apply and verify reload/repeat behavior; verify changing data after preview rejects before any write and failure rolls back; inspect unresolved source items explicitly. Source review is not compilation/runtime evidence. Suggested backend commit: `feat(link-accounts): preview and repair invalid saved mappings`. Suggested frontend commit: `feat(link-accounts): expose corrective link preview and apply`.
