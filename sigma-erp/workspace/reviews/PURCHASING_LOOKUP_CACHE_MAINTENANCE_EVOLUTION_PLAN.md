# Purchasing and suppliers lookup caching

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Owner requests caching purchasing/supplier dropdowns. Implement the existing
reference-cache capability with safe source eligibility; no new storage or
HTTP interceptor. Authority: Master1/4/5/7, UI2/16/22/28/29, BE10 (source read
semantics only), sigma-screen-refactor. Initial generator Check passed all8.
No builds/tests/lint/runtime/browser/DB/migrations/commits authorized.

## Existing owners and impact classification

| Area | Current evidence | Classification / target |
|---|---|---|
| Shared cache | ReferenceLookupCacheService: deferred, session/language scoped, cloned successful entities, TTL5min/LRU64, coalesced feedback modes | Keep full policy |
| Reference select transport | BaseService.cacheSelect; Country and UnitsOfMeasures already enabled | Extend six source opt-ins: Supplier, Branch, Item, AssetType, Currency, ContactGroup |
| Supplier alternate adapter | SupplierSharedService used by supplier statements/aging/balances and opening balance | Extend same opt-in, same URL/cache; preserve APIs |
| Typed writes | Inspected source create/update/delete and ContactGroup activation/default | Extend success-only invalidation before subscriber callbacks; inherited writes already have operator |
| ContactGroup selector | GetSelectByType/{type}, unchanged Results<DropdownDto> with source IDs/names | Extend shared cache by exact encoded URL/type; invalidate all type variants on source write |
| Imports | ImportData/Supplier and ImportData/Items through typed import services; savedRows permits partial persistence | Extend source invalidation for savedRows>0, even when batch isSuccess=false |
| Job/Vehicle/Account selectors | Workflow/availability or posting eligibility; dependencies across lifecycle/source writers | Keep fresh in this slice; do not imply these are stable reference data |
| Document sources | PR→PO, PO→GRN/Bill, GRN→Bill and returnable sources contain status/remaining capacities | Keep fresh, including preview/detail/settings/tax/currency/rate readers |
| UI forms | Existing forkJoin/inline errors, mergeSelectOptions, PrimeNG owners | Keep geometry/CVA, values and errors; source layer supplies clones |

Alternatives: blanket caching of every dropdown was rejected because capacities
and operational eligibility change on unrelated transitions. Feature-local
shareReplay was rejected because it duplicates context/invalidation ownership.
Chosen existing source opt-ins apply to all consumers of reviewed reference
endpoints; no per-screen opt-in. Supplier reports also share supplier cache.
Staff filter remains fresh; no extra reference sources inferred from nearby
modules. No permissions, accounting, DB or backend contract changes.

Technical defaults derive from frozen LOOKUP_CACHING_REFERENCE_DATA_CONTRACT_FREEZE:
five-minute absolute expiry,64 entries, source writes invalidate; focus/language/
authenticated context resets apply. Remote user edits while tab remains focused
are visible after expiry/refresh/next invalidated load; no real-time work is
authorized by its separate Draft plan. Existing open forms are not silently
rebound/reset. Complete exact handoff below before delegating source edits.

## Conformance before implementation

| Concern | Book | Actual reference/shared owner | Target |
|---|---|---|---|
| Cache eligibility | UI2/16 | CountryService/UnitsOfMeasuresService.cacheSelect | Same source flag in reviewed services |
| Typed invalidation | UI2 | UOM create/update/remove + BaseService inherited writes | Same success-only operator with explicit source-family extension |
| Parameter identity | UI2/16 | ContactGroup GetSelectByType and cache.read full URL | Exact encoded type URL key; type-family invalidation |
| Session/error/lifetime | UI2/22/28 | ReferenceLookupCacheService | Retain all existing fences/cancellation/clones |
| Import outcome | UI2 shared CsvImport transport, CsvImportResult.savedRows | Typed import owns affected source, invalidates only persisted rows |
| Guide | Master7 | Existing UserGuide shared guidance and purchasing topics | Explain references vs fresh quantities and update behavior |

Root owns shared helper/imports/docs/integration; bounded worker may own reviewed
source services only after frozen contract. Preserve unrelated dirty work. No
reference module such as Job editor is modified. Runtime request counts and
performance benefit remain owner verification, not a measured claim.

Later owner correction,2026-10-24: all ordinary PO GetSelect calls are intended
to be reused on reopening. The frozen UI contract amendment supersedes the
initial Job/Vehicle blanket exclusion after tracing their generic identity-only
producer; their live searches/details stay fresh. It also replaces unconditional
window-focus eviction with observed hidden→visible invalidation. See the final
review correction section; original planning evidence above stays historical.
