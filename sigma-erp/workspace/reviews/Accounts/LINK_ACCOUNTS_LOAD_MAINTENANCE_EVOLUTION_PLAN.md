# Link Accounts demand loading

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |
| Tier | M end-to-end settings performance; plan included for contract evolution |

Owner authorizes implementing the preceding [source diagnosis](LINK_ACCOUNTS_LOAD_PERFORMANCE_FEATURE_REVIEW.md): active/first-visit loading, retained drafts, safe Save All and eliminate repeated account-choice work. No accounting policy/schema change.

## Impact and selection

| Area | Choice | Target |
|---|---|---|
| Parent workspace | Extend | Instantiate active tab on first visit and retain visited components; no preloading other tabs |
| Save All | Extend existing scoped replacement | Submit only dirty, loaded, ready/valid tabs, including their complete unfiltered rows; never send unvisited types in replaceTypes |
| Shared choices | Extend existing owner | One new selection-options endpoint supplies per-usage account lists once; component-scoped LinkAccountsService retains the screen snapshot only |
| By-type read | Extend compatibly | Optional includeAccountOptions=false; skip full choice graph, validate only selected references and return server-owned accountUsage per row; default full response retained for old consumers |
| Child tabs | Extend | Consume shared choices, local loading, original drafts/retry/error logic; no global loader for hidden tab requests |
| Auto-link | Keep/Extend refresh | Existing preview/apply; successful apply invalidates choices/visited drafts and reloads current tab only; refresh completes on active ready, not dirty-save readiness |
| Backend Save | Keep | Already accepts declared replaceTypes; same validation, tenant and transaction/reconciliation contract |
| Guide | Extend | Explain first-visit loading, retained drafts and Save All changed-tabs scope |

Alternatives: CSS hiding alone leaves eager network work; destroying components on every switch loses drafts. Keeping only frontend lazy-loading would retain repeated full account graphs and per-row JSON arrays. Selected first-visit retention plus compact backend reads and request-lifetime screen catalog. No unbounded/global tenant cache, no background tab prefetch, no new independent state store.

## Confirmed rules and verification

Tab changes may happen while another tab's read runs; each instance retains/cancels its own request on destruction. Changes to rows survive switching. Save All freezes controls using existing busy input, validates all dirty tabs, sends their complete snapshots and marks only submitted tabs saved after success. Failed/unloaded unedited tabs do not delete mappings or block saving a valid dirty tab. Invalid dirty tabs block the complete save.

Bootstrap catalog failure blocks child editing and offers Retry; success with empty choices remains valid. No read-time seed. Explicit selected-reference mismatch and retained-label diagnostics remain backend-owned, including inactive/deleted/parent behavior. Backend validates role membership again on Save; screen snapshot is no authority for writes.

Source-only workflow, no builds/tests/lint/browser/database/migrations/commits. All8 recipe checks OK. Applicable Phases0/1/2(read contract)/3/5/6; Phase4 existing auto-link unchanged in accounting effect. No schema migration. Owner verifies Network first-open count, per-tab loads/revisit no reload, dirty switch/Save All scopes, failed-tab retry, invalid dirty rows, auto-link refresh success/failure and tenant re-entry freshness. Source call counts do not prove latency improvement.
