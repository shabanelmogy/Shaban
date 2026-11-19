# Link Accounts load contract

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Governed by [plan](LINK_ACCOUNTS_LOAD_MAINTENANCE_EVOLUTION_PLAN.md). Root owns integration; implementation streams below consume this frozen shape.

## API and models

- New authenticated GET `LinkAccounts/selection-options` → `Result<LinkAccountsSelectionOptionsVM>` with `accounts: DropdownDto[]` (AnyPosting), `usages: LinkAccountsUsageOptionsVM[]` containing `usage: AccountLookupUsage` numeric and `accounts: DropdownDto[]`. Include usages0–15 used by links; Budget usage16 is not a link role. Build choices from one tenant active posting account/type/subgroup/group graph using existing AccountSelectionPolicy. Each named .NET DTO in its own file.
- Existing GET `LinkAccounts/by-type/{type}?includeAccountOptions=false` retains Results<sections>. Existing method adds optional third argument bool includeAccountOptions=true after CancellationToken; existing callers compile unchanged. False returns row AccountOptions/SourceAccountOptions empty, new `accountUsage` numeric (server derives from mapping). True remains legacy full choice response.
- Compact reads query only retained accountId and Prepaid source Value references for mismatch/label handling, using exact existing active/posting predicate and loaded type placement. Do not omit current invalid-reference diagnostics or infer eligibility on frontend. Prepaid source eligibility/filtering remains unchanged.
- New TS interfaces mirror response; service hydrates row choice-array references from screen catalog by server accountUsage and Prepayment source role, without duplicating role rules client-side.
- Existing enum-only options GET remains unchanged, but service cache moves to component provider scope. Child tabs consume same service instance; auto-link component also shares it.
- Existing POST upsert unchanged: replaceTypes contains only dirty, ready/valid instantiated tab types; mappings contains complete unfiltered rows from those tabs. No unvisited/clean type sent. Empty mappings for a dirty prepaid/workshop tab still sends its type for intentional removals.

## Frontend service API / lifecycle

`loadSelectionOptions(): Observable<Result<LinkAccountsSelectionOptionsVM>>` shared/replayed only within current screen, failed envelopes/errors clear cache. `getAccountOptions(usage: AccountLookupUsage): DropDownSelect[]` returns catalog's list after bootstrap. `clearSelectionOptions(): void` invalidates selection snapshot on auto-link refresh. `getLinkAccountsByType` opts into compact response and hydrates rows; missing usage/catalog is an actionable error (do not widen silently). Parent provider `providers: [LinkAccountsService]`; no feature HttpClient provider or interceptor changes.

Bootstrap parent forks enum options+selection options; accounts input uses catalog accounts. Only after success mount visited current tab. Child Prepaid and Workshop remove redundant account HTTP lookups and read getAccountOptions; other ancillary branch/job-category requests remain demand-loaded. All7 use local tabLoading and keep finalizers/cancellation, no global loader calls for tab reads. Save and auto-link retain existing global write loading owner. Parent initial catalog loader remains existing screen bootstrap owner.

Root owns parent details TS/HTML, guides/translations and reviews. Child frontend worker owns service/models and seven child tab TS only (no parent/docs). Backend worker owns LinkAccounts service/interface/controller/new VMs only. Preserve existing user changes and current migrations/snapshots. No overlapping writes or generated edits.

## Canonical conformance before edit

| Concern | Book | Actual owner/reference | Decision |
|---|---|---|---|
| Settings workspace | UI1/13/16 | existing Link Accounts + shared EditorTabs | Keep chrome and retained components, add first-visit guard |
| Read/write scopes | BE3/8/10/16 | LinkAccountsService scoped save / AccountSelectionPolicy | Compatible compact opt-in, same authoritative validators |
| Local loading/lifetime | UI22/28 | tab StateMessage / takeUntilDestroyed | Local flags and request cleanup, preserve drafts |
| User guide | Master7/UI23 | existing bilingual Accounts guide + reader/menu | Update actual Save All scope; no new route |

No required unresolved business decision, new authorization mechanism, monetary formula or schema change.

## Integration clarification — refresh failure recovery

Each child retains its success-only `loaded` output and adds a `settled` void output emitted from read finalization. Parent releases its post-auto-link refresh gate when the current child settles, even on failure/cancellation; catalog failure also releases it. Retry remains available and no read failure traps navigation. Deferred auto-link success feedback is emitted only after a ready current child, including a later successful retry. Selection-option access for Prepaid/Workshop runs in RxJS `map` so invalidation errors reach the same local error channel rather than escaping a subscriber callback.
