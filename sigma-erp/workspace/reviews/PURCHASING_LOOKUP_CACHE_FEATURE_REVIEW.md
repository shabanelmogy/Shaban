# Purchasing reference lookup cache — implementation and reconciliation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Implements the owner request to cache purchasing/supplier dropdowns through
the existing reference cache, per the Frozen maintenance plan and UI contract
in this folder. No new cache stack, persistent storage, visual control,
backend API, selectable predicate, accounting effect or schema change.

## Final scoped behavior

| Source / consumers | Cache coverage | Invalidation |
|---|---|---|
| Supplier and SupplierShared | Same GetSelect URL shared by purchasing lists/editors and supplier reports | Typed Create/Update, inherited Delete/bulk/generic writes; also ContactGroup dependency |
| Branch | Existing GetSelect in document filters/editors | Typed Create/Update and inherited Delete/bulk/generic writes |
| Item | Existing GetSelect in document editors | Typed Create/Update/Delete, inherited writes, imported saved rows |
| AssetType | Existing GetSelect in document editors | Typed Create/Update/Delete and inherited writes |
| Currency | Supplier editor GetSelect | Typed Create/Update and inherited Delete; existing number-policy invalidation preserved |
| ContactGroup | Plain GetSelect and exact encoded GetSelectByType URL | Typed Create/Update/Active/Default and inherited Delete/bulk/generic writes invalidate every type variant |
| Country / UOM | Previously reviewed cache unchanged | Existing typed/generic writes now use equivalent family invalidation |
| Supplier import | Existing typed CSV writer | Positive savedRows invalidates Supplier and ContactGroup even on partial batch failure |
| Item import | Existing typed CSV writer | Positive savedRows invalidates Item even on partial batch failure |

Supplier Add/Update and import may provision a default ContactGroup; verified
in SupplierService and ImportDataService. This dependency is recorded in the
frozen contract amendment and declared explicitly in both Supplier adapters.
No inference from arbitrary write URLs or global mutation interceptor.

Jobs, vehicles, posting accounts, source document candidates, remaining/returnable
quantities, source previews, supplier tax/details, common settings and rates
remain uncached by this task. Staff report choices remain fresh. These readers
have operational eligibility or live data dependencies; this scope does not
promise every dropdown is cacheable. Existing backend Save/Approve validation
remains authoritative. Source eligibility applies to all consumers of reviewed
URLs, not to one motivating screen.

## Shared ownership and final contract comparison

| Concern | Canonical/reference owner | Reconciled result |
|---|---|---|
| Shape | UI2/16 reference data source; backend BE10 existing selector | Existing normal-entity source envelopes/ids/names/order and predicates unchanged |
| Source opt-in | CountryService/UOM cacheSelect pattern | Six additional sources plus SupplierShared adapter enabled |
| Custom select | BaseService.readReferenceSelect + cache.read | Full encoded type URL key; same loader, options and inline/default feedback headers |
| Family invalidation | ReferenceLookupCacheService.invalidateSelectSource | Exact source/GetSelect and source/GetSelectByType/ descendants; no similarly named controller eviction |
| Write ownership | BaseService.invalidateSelectOnSuccess | Only isSuccess===true invalidates; typed and inherited success precede subscriber callbacks |
| Indirect dependencies | Explicit selectCacheDependencies, empty by default | Supplier adapters invalidate ContactGroup at same API base |
| Imports | CsvImportResult.savedRows; existing typed import owners | Partial saved outcomes invalidate; no-save/failure/error retains current snapshots; shared transport untouched |
| Lifetime/errors | Existing cache/UI22/28 | Deferred subscription, feedback-key separation, cloned successful entities including empty, no cached failures, pending sharing/cancellation preserved |
| Session/bounds | Existing cache | Five-minute absolute TTL,64-entry LRU, credentials compared only in memory, context/language fences and focus invalidation preserved |
| UI/guide | Existing PrimeNG owners and UserGuide | No field/form/payload/geometry change; EN/AR shared guidance updated |

No shared extraction qualified beyond extending the actual existing owner:
the small family invalidator/custom-read seam and explicit dependency hook
avoid feature copies and competing caches. Generic read remains fresh unless
its source opts in. No provider/interceptor/route/service-worker changes and
no new runtime declaration or compile-root change. UI controls do not own cache.

## Source reconciliation and limits

Root reviewed complete scoped frontend diffs for seven source service files,
BaseService/cache helper, two typed import services and guide. Verified source
URL/type and helper signature parity, ordinary/custom read behavior, all typed
and inherited writers, Currency number-policy retention, SupplierShared reuse,
source dependencies, unchanged headers/envelopes and no cache on live sources.
Scoped git diff --check passed. Merge-marker scans clean. No backend edits;
read-only backend producer inspection confirmed selector/import dependencies.

One bounded gpt-5.6-sol worker implemented seven source files after freeze;
root owned cache/base/imports/docs. Nonoverlapping ownership reduced routine
implementation time. Worker final read-only integration audit found no remaining
concrete issues in the consumed contract. Root independently reviewed the diff
and added discovered Supplier→ContactGroup dependency. Unrelated dirty changes
were preserved.

No tests, builds, lint, browser/runtime/database commands, migrations, snapshots,
commits or pushes run. Existing cache/integration test sources were inspected
for current contracts only; no test pass or performance gain claimed. Compiler,
HTTP request counts, latency and memory/concurrent runtime behavior remain
owner acceptance. A shared pending read invalidated by mutation retains the
existing cache cancellation behavior; this task does not add live retry/rebinding.
Remote/other-session writes are seen on expiry/focus/reload/next invalidated read,
not via realtime. Other indirect writers outside the purchasing source slice
retain this bounded expiry behavior; no unrelated module retrofit is implied.

Owner checks: navigate PR→PO→GRN→Bill→Return and supplier editor/reports; observe
reused reference requests but fresh operational sources. Create/update/delete
each reference then reload choices; test contact type separation and activation/
default, Supplier default-group creation, partial Supplier/Item import with
savedRows>0, failed/no-save mutations, failed lookup Retry, forceRefresh, expiry,
focus return, language/account changes, overlapping readers/cancellation and
consumer saved-option merges without mutating another dropdown.

## Documentation and handoff

Master7 gate: updated bilingual shared-screen-guidance.ts, consumed by existing
GuideReader overviews, including /UserGuide/vouchers-purchasing and
/UserGuide/suppliers via their current sidebar entries. Explains reference
reuse/refresh and live operational choices; current reader registration retained.
Navigation, print, themes/RTL and actual network behavior remain owner verification.

Promoted reusable source-family/type/dependency/import guidance to UI2 and skill
with revision row. Generated all8 packets. Immediate before/after semantic
comparison found only UI2 provenance hashes in PHASE-02/03/05; packet bodies,
templates and approved references unchanged. Final Check passed all8. Generated
files never edited directly. Phases0/1/5 and scoped6 apply; screen geometry/grid/
domain-transition/persistence phases not needed.

No migration required. Suggested frontend commit (only scoped files/hunks):
`feat(purchasing): cache reviewed reference dropdowns`.
Suggested documentation commit:
`docs(lookups): define source-family cache invalidation`.

## Owner correction — all PO GetSelect calls repeated, 2026-10-24

Owner confirms the repeated requests are GetSelect, across all lists. Two source
facts explain avoidable misses: the cache discarded every settled snapshot on
any window focus (including focus changes to/from DevTools while document stays
visible), and Job/Vehicle plain GetSelect were still opted out. No actual network
trace was supplied or runtime session inspected; these are verified code paths,
not a claim to have reproduced the user's precise request sequence.

Read-only producer trace: neither backend JobService nor VehicleService overrides
SelectAsync; base Service.SelectAsync calls Repository.GetDropdownAsync. That
path supplies tenant/nondeleted ID/label/No, using Vehicle PlateNo as label,
without operational status, remaining quantity or availability predicates.
The owner correction explicitly places their source services in scope (including
the protected Job reference only for select eligibility/writer invalidation).
The later frozen contract/plan amendment supersedes their initial exclusion.

| Concern | Final source result |
|---|---|
| Focus | Track actual document hidden state; visible focus synchronizes auth/context without eviction |
| Real tab return | On hidden→visible, evict settled snapshots once; preserve pending bootstrap and ignore duplicate visible/focus events |
| PO ordinary lookups | Supplier, Branch, Vehicle, Job, UOM, AssetType and Item all use the existing cache via source opt-ins |
| Writer invalidation | Job Add/Update/Close/Cancel and inherited writes; Vehicle Create/Update/Delete and inherited writes; Vehicle CSV savedRows>0 |
| Exclusions | Vehicle Search/status/detail/tariff/history; Job options/closing/detail; document sources, settings/rates and account operational choices remain fresh |
| First load | Always HTTP for a cold/memory-reset source; different feedback modes have separate cache entries; expiry/real return/mutation/context/forceRefresh rereads are intentional |
| UI/drafts | No PO control, route, payload or selection changes; no persistent storage or operational validation change |

Root updated shared focus state and existing regression spec expectations,
plus integration spec asserting seven PO sources have one HTTP load and a cache
hit after route/visible-focus events. Unit spec distinguishes visible focus from
actual hidden return, duplicate visible events, two feedback modes and retaining
pending reads. These specs were written/source-reviewed only, not executed.
The bounded worker implemented only Job/Vehicle/ImportVehicle source services;
root independently reviewed their exact diffs and preserved bodies/headers and
fresh operational readers. Initial session/provider trace found existing root
Auth/cache wiring unchanged; no reason to alter authentication or DI scopes.

Conformance remains UI2/16 with existing source opt-in/cache and UOM typed-write
reference, UI28 lifetime, existing UserGuide reader. Updated shared EN/AR guidance
describes ordinary Job/Vehicle choices and focus/real-tab behavior, retaining
module guide routes and current menu registrations. Updated UI2 and skill/revision
row. Regenerated all8 packets; semantic comparison found UI2 provenance changes
only in PHASE-02/03/05. Final Check all8 and scoped git diff --check passed;
merge-marker scans clean. No backend source/schema changes, migrations, builds,
test execution, lint, browser/runtime, database, commits or pushes.

Owner verification pending: warm all seven sources; navigate away/back in the
same visible tab within5minutes with no source write; no repeated GetSelect
expected. First-time editor-only sources still load once. Focus DevTools and
return without hiding document; reuse expected. Hide browser tab and return;
next lookup should refresh once. Check expiry/context change and Job/Vehicle
typed/import mutations, ordinary clone safety and live operational requests.
Suggested frontend commit:
`fix(lookups): retain visible-tab cache and cover order selectors`.
Documentation: `docs(lookups): clarify focus and ordinary selector policy`.
