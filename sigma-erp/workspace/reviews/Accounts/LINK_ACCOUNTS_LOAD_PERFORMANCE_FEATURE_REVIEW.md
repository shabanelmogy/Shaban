# Link Accounts opening performance — source review

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |
| Scope | Source-read-only diagnosis; no application edits authorized |

## Manifest / pattern

User asks whether all tabs load together because opening is slow. UI shape06 tabbed settings workspace, approved reference is this Link Accounts details + shared EditorTabs; backend existing specialized Settings pattern4. Read current skill, UI screen06/UI29, BE16 and applicable service performance guidance; all8 recipe checks OK. Source and network timing are distinct. No screenshot, no missing business decision needed to answer the current question. No new engine/API/schema or source changes.

## Confirmed execution path

1. `LinkAccounts/components/details/details.component.ts` `ngOnInit` calls `getAccounts`. It forks Account/GetSelect and LinkAccounts/options; options cached by existing `shareReplay` after success, while account choices reload. Options are enum-only on backend, not a database-heavy lookup.
2. `details.component.html` loops over every tab and instantiates its component. Active class only changes CSS; `details.component.scss` hides inactive panes with `display:none`, which does not prevent component initialization or HTTP requests.
3. Seven tabs load their own `LinkAccounts/by-type/{id}` from `ngOnInit`: General, ChargesType, Contacts, PaymentMethods, BankAccounts, PrepaidExpense, Workshop. ChargesType loads the full module set, then filters selected module locally.
4. Extra tab lookups: PaymentMethods branches (1); PrepaidExpense source/expense typed accounts (2); Workshop job categories/revenue/expense accounts (3). Nominal cold opening therefore has **15 HTTP requests** (2 shared +7 by-type +6 ancillary), excluding shell, translation, interceptors and retries. Successful cached options can remove one on subsequent visits. This is static call-count evidence, not an observed network trace.
5. Every tab uses shared `LoadingService.startLoading/endLoading`; its pending counter keeps the global loader active until the last tab finishes. `canSaveAll` also waits on all seven ready states. Post-auto-link refresh recreates/reloads every tab and refetches accounts.

## Confirmed repeated backend/payload work

`LinkAccountsService.GetByTypeAsync` loads mappings, builds source-specific rows, adds required definitions, then unconditionally calls `AttachAccountOptionsAsync`. That method loads all active posting Accounts with AccountType → SubGroup → Group for each by-type request, filters options per usage in memory, and attaches option lists to each row. Seven initial tab requests therefore repeat this account/type graph work. The same in-memory list instance can be reused per usage, but normal JSON response repeats its content in each row's AccountOptions; expense/prepayment typed lookups repeat additional choice work. There is no runtime evidence quantifying query time/serialization/transport/render shares.

## Recommendation (not implemented)

Load the active tab first; instantiate others only on first visit, retain visited instances/drafts when switching. Avoid simply replacing all panes with a switch that destroys unsaved state. Make local tab loading independent of unrelated tabs. Fetch account choice sets once per screen/request scope and expose lists per usage rather than repeating arrays per row. Do not introduce unbounded tenant-crossing global caches.

Save All currently sends all tabs and `replaceTypes` for the complete tab set. Lazy-loading must explicitly change this contract to save loaded/changed scopes only and never include unvisited replace types, or retrieve a complete authoritative snapshot safely. Do not assume an unvisited tab means no mappings. Auto-link refresh, dirty/discard checks, retries and source-backed type filtering must be reconciled together in an authorized implementation.

## Source-only reconciliation / owner verification

No source/config/guide edits, schema or migration. No subagents: one coherent bounded trace. No builds/tests/lint/browser/database/migrations/commits or Sigma MCP/Graphify. User guide update gate does not apply to this source-read-only review. Owner runtime verification pending: preserve browser Network log on first open, inspect initial request waterfall/sizes, time all7 by-type calls and inspect repeated account options; compare cold vs cached-options revisit. No elapsed-time improvement or single measured bottleneck claimed.

## Authorized implementation follow-up — 2026-10-24

Owner subsequently requested implementation. The read-only findings above remain the historical diagnosis; [frozen plan](LINK_ACCOUNTS_LOAD_MAINTENANCE_EVOLUTION_PLAN.md), [contract](LINK_ACCOUNTS_LOAD_DOMAIN_API_CONTRACT_FREEZE.md) and [implementation review](LINK_ACCOUNTS_DEMAND_LOADING_FEATURE_REVIEW.md) record the resulting source changes and pending owner runtime verification.
