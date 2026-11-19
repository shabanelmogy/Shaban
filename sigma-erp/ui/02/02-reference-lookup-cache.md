<!-- Part of UI block 2: see ../02-service-and-response-wrappers.md. Same status and authority as the block. -->

### Selective reference lookup cache (owner2026-10-23)

**Explicit customer-currency display opt-in (owner2026-10-28).** Reuse
`ReferenceLookupCacheService` for the exact positive-ID URL family
`Partner/GetCurrency/{id}` through `PartnerCurrencyLookupService`. This narrow
tenant/live DTO contains only `currencyCode: string|null` from the partner's
current billing currency. Cache only a successful nonnull entity with that
explicit string/null member; null is a known absence and preserves the base
fallback. Missing/deleted partners and malformed/failing responses are retryable,
never cached. Full Partner details, financial values, rates/availability and
write validation remain on their direct contracts. This source-level opt-in is
inherited by every shared DocumentCurrency customer consumer, not a per-screen
cache or a browser-storage copy.

Keep the existing scoped five-minute TTL/64-entry owner, finite read before
separate watch, ID/version cancellation, successful-value preservation and silent
retained refresh with errors/Retry. Context resets cancel the old customer read
and watch and clear displayed codes without automatically reacquiring an old ID
in a new tenant/session; ask through shared field feedback to reselect/reopen.
No form amount or saved supplied currency is rewritten by refresh. Supplier
details retain their existing direct source. Cache hits need no HTTP or visible
loading; an actual first/expired/invalidated read may need progress.

The source's `lookup-partner-currencies` tenant topic covers Partner and derived
Company/Individual entities, PartnerBillingInfo and Currency through the existing
postcommit owner. Successful Company/Individual writes already invalidate the
Customer source dependency; that explicit dependency and Currency source
invalidation now also evict only this customer-currency URL family. Successful
customer imports use CustomerService.refreshSelectList, which invalidates the
same family. Failed writes retain valid snapshots. This is a declared source
dependency, not arbitrary prefix matching or a global GET cache. Preserve
existing tenant/auth/branch/language scope resets and independent writers.

`FinancialNumberPolicyService` retains its own coalesced policy read, not this
reference cache. Shared context changes invalidate that memo and cancel its old
scope request; an interrupted finite read returns a failure envelope rather than
completing empty. Existing currency-write invalidation, precision ownership and
feedback modes stay. Source-only evidence: shared-customer-currency cache review;
owner network/SQL/realtime/runtime verification remains separate.

Ordinary dropdown reads remain fresh unless their data service explicitly opts
in through `BaseService.cacheSelect`. Country and UnitsOfMeasures are the first
reviewed sources. `ReferenceLookupCacheService` is the single in-memory owner;
CompanyDriver delegates country choices to CountryService. Never enable a
blanket GET/GetSelect interceptor or reuse the legacy browser-storage CacheService.
Eligibility belongs to the data source, not a visual Select/CVA or an individual
screen. Preserve endpoint, typed envelope, ids, ordering, labels, empty-success,
server validation and each consumer's failure/loading owner.

Cache acquisition is deferred until subscription. Bound retained successful
`entities` snapshots by absolute expiry and entry count (initial pilot5minutes,
64 LRU entries); deep-copy responses per consumer before saved-option merges or
translation. Failure envelopes, HTTP errors, malformed/empty-completion and
cancelled reads are not retained. Coalesce identical pending reads, separating
default and inline-error feedback modes; partial consumer teardown must not abort
another subscriber, while final teardown and existing UI28 navigation cancellation
release unfinished entries. Force-refresh is an optional getSelectList flag.

Scope to API URL, subscription/user, session generation, language and conservative
branch context. Compare credentials only in memory through existing auth-token
observation; never put them in keys/logs/storage. Reset/cancel on context changes,
and guard old responses/old observable references against repopulation. A successful
source mutation invalidates before downstream callbacks; failed writes retain
valid snapshots. Include typed and inherited writers and indirect transports.
An observed hidden→visible tab return drops settled snapshots once for the next
lookup while keeping pending page bootstrap alive. Plain window focus while the
document stays visible (including DevTools focus changes), duplicate visible
events and route changes alone do not evict unexpired snapshots. Synchronize
session context on these events regardless. Do not rewrite open form values or add hidden branch
filters. Remote edits are not immediately broadcast: TTL/next load/reload determine
visibility unless a separate source-owned notification contract exists. Broader
sources, settings and availability-sensitive document choices need their own review.

Evidence: `reviews/LOOKUP_CACHING_REFERENCE_DATA_CONTRACT_FREEZE.md`; implementation
and automated/runtime verification are reconciled in the owning feature review.

**Purchasing reference expansion (owner2026-10-24).** Supplier (including the
existing SupplierShared adapter), Branch, Item, AssetType, Currency and
ContactGroup now opt in through their source services. Country/UOM retain the
same policy. Eligibility applies to every consumer of the reviewed source URL,
not just the motivating purchasing screen. Account operational
selectors, document candidates and remaining/returnable quantities, financial
rates/details/settings stay fresh; caching a reference label never proves
availability, approval, stock or posting eligibility.

The owner's repeated-GetSelect correction includes ordinary Job and Vehicle
GetSelect too: source tracing confirms neither overrides base SelectAsync, whose
GetDropdownAsync returns tenant-owned nondeleted identities/labels/No only
(Vehicle uses PlateNo). Do not equate this ordinary label source with a vehicle
availability/status search or Job options/closing/details, which remain fresh.
Typed Job Add/Update/Close/Cancel and Vehicle Create/Update/Delete invalidate;
Vehicle import invalidates on positive savedRows. This supersedes their earlier
blanket exclusion in the initial purchasing slice without caching live operations.

`BaseService.readReferenceSelect<T>(url, load, options)` is the protected shared
seam for custom eligible selectors. It uses the existing cache only when the
source opts in; preserve the original loader and feedback headers. ContactGroup
uses its exact encoded `/GetSelectByType/{type}` path, so types never share
snapshots. `invalidateSelectSource(sourceUrl)` removes that source's exact
`/GetSelect` and `/GetSelectByType/` family in every feedback mode, including
unfinished reads; exact `invalidate(url)` retains force-refresh semantics.
Do not evict other controller families by prefix coincidence. Source success
invalidates before caller callbacks, through the same typed/inherited operator.
Explicit `selectCacheDependencies` controller names default empty and cover
verified indirect producers only: Supplier may provision its default ContactGroup,
so both Supplier adapters invalidate ContactGroup too. No global mutation watcher.

**Dependent sources are independent of the writer's own opt-in (2026-10-25).**
`invalidateSelectOnSuccess` invalidates explicitly declared dependencies even
when the writer's `cacheSelect` is false; its own GetSelect is invalidated only
when it opts in. This does not enable the writer's cache. Keep dependency names
empty unless the actual producer proves that its writes affect that source.
For the existing aggregate `Customer/GetSelect`, CustomerService.SelectAsync
projects tenant-owned nondeleted Company/IndividualPartner identities and labels.
CompanyPartnerService and IndividualPartnerService declare `Customer` and pipe
their typed writers through the shared operator; inherited writes use it too.
Their supported Companies/IndividualPartner imports refresh Customer through
the source service when `savedRows > 0`, including partial failure. Zero saved
rows, failed writes and HTTP errors do not invalidate. The existing
`lookup-customers` tenant topic tracks those two entity families; no new socket
or source opt-in is introduced. Evidence: JVS_DOMAIN_API_CONTRACT_FREEZE cache
amendment and JVS_IMPLEMENTATION_FINAL_RECONCILIATION source matrix.

**Customer default-group dependency (2026-10-26).** Company/IndividualPartner
Add/Update/contact-group writes call `CustomerGroupIdAsync`, which can provision
the Customer default ContactGroup. Their declared dependencies therefore include
both `Customer` and `ContactGroup`. Companies/IndividualPartner import producers
also call that default-group owner: positive persisted `savedRows` refresh Customer
and invalidate the entire ContactGroup select family, including typed Customer
selectors, even after partial batch failure. Zero-row/HTTP-failed imports keep
the existing sources. This is an evidenced dependency under the same success hook,
not cache opt-in for the writer or a new invalidation framework. Evidence:
`ContactGroupAccountService` and `ImportDataService` customer import branches;
`CUSTOMERS_MODULE_DOMAIN_API_CONTRACT_FREEZE` and its source reconciliation.

Typed imports must invalidate when their committed-row count is positive, even
if the batch-level success flag is false after partial persistence. Supplier
import invalidates Supplier plus its default ContactGroup dependency; Item
import invalidates Item. Preserve transport and persistent partial/error result
ownership; HTTP errors or zero saved rows do not invalidate. This is source-owned
coherence, not another import/cache wrapper. Remote edits retain the existing
expiry/focus/next-read limitation, and open form values/options are not silently
rebound. No real-time adoption implied by this expansion.
Evidence: `reviews/PURCHASING_LOOKUP_CACHE_UI_CONTRACT_FREEZE.md` and its owning
review; source-only checks, compiler/network/concurrency acceptance pending.


### Active reference revalidation (owner2026-10-24)

This approved extension supersedes the preceding next-read-only limitation for
the reviewed reference sources. Keep `getSelectList`/`read` finite for initial
HTTP/forkJoin bootstraps. Mount a separate `watchSelectList`/`watch` stream only
for consumers that need live options. Custom eligible selectors use
`watchReferenceSelect` with the identical full URL/feedback identity; typed
ContactGroup watches preserve their type path. Excluded operational sources
return an inert watch and keep their normal direct reads.

The shared cache owns `ReferenceLookupState<T>`: retained value, loading, stale,
error key, updatedAt and expiresAt. Coalesce source invalidations for150ms,
cancel/fence obsolete responses and transparently restart pending finite readers;
never complete a waiting bootstrap empty on ordinary invalidation. Absolute
five-minute expiry refreshes active visible watches. Idle or hidden entries send
no automatic HTTP; explicit finite demand still loads. Keep at most64 idle/LRU
entries, pinning mounted consumers instead of breaking their streams. Release
timers/unfinished reads when the final consumer leaves. Reset old-context arrays
and topic memberships on session/context changes; safely reacquire persistent
watches without publishing old data.

Reuse the root `RealtimeService` connection. Known source URLs map to registered
tenant-scoped topics; notifications invalidate and reload through authoritative
HTTP rather than pushing option arrays. Rejoin revalidates to cover missed
changes. Subscribe once per cached topic, releasing on eviction/reset. Existing
server commit tracking publishes only after successful save/explicit commit;
rollback/failure cannot invalidate other clients. Delivery is bounded and
nondurable; raw SQL/ambient-transaction bypass and missing multi-node backplane
require TTL fallback. No extra socket, global GET interceptor, state library or
custom developer inspector is needed for this behavior.

`ReferenceLookupBindings` binds each source key once per DestroyRef and aggregates
initial loading/error/Retry. Under UI22's latest owner rule, required routed bootstrap presents through the
page host via ReferenceLookupStatus, not inside filter controls; dialog bootstrap
uses inherited dialog scope. This changes no cache source eligibility or watch.
Revalidation with a retained snapshot remains silent
under UI22; the underlying state still reports actual HTTP loading. Apply only fresh successful snapshots, preserving
selected IDs, draft/dirty state and saved labels absent from current choices.
Optional selected-ID/current-option getters let the shared binding retain only
the selected labels, even on an empty success. Distinguish that from an explicit
null context reset: clear old rows and never remerge prior-context detail labels
from a watch callback. Initial detail/bootstrap merges keep their existing role.
Do not set defaults, emit control changes, cascade supplier changes or recalculate
source quantities/tax/finance from a cache emission. Retain options after refresh
failure and offer per-failed-source retry without an automatic retry loop.

For an owner that remains mounted across tenant/session changes,
`ReferenceLookupBindings.clear()` releases its current source subscriptions and
resets their aggregate loading/error/Retry state before a fresh-context bind.
The owner first cancels old finite reads and clears old option/selection arrays;
clear is not permission to retain an ID from a previous context. Destruction
uses the same cleanup. The Accounts report owner adopts this reset while
keeping non-opted-in sources on direct reads (UI20,2026-11-05). Runtime/network
acceptance remains separate from source evidence.

**Retained editor choices (source correction2026-10-26).** The final optional
`ReferenceLookupBindings.bind` argument `disableRetainedOptions` defaults false,
preserving existing historical list-filter behavior. An editor whose source
choices exclude unavailable identities passes true and binds its existing Select
`optionDisabled="disabled"`. On each fresh successful response, only selected
rows absent from the incoming source acquire `DropDownSelect.disabled=true`;
fresh source rows win unchanged. This preserves the saved label and selected
value without offering a removed choice for a new selection. Returning source
rows regain their source eligibility. Failed refreshes retain the previous
snapshot, and explicit null-context reset still clears every row without
remerging historical detail labels. Do not disable retained filter choices by
default or infer availability from a label; write-time validation remains with
the server. Reuse this existing binding metadata seam instead of duplicating
source-membership tracking per editor. Evidence: Rentals R06/R09 corrective
reconciliation, Agreement/Quotation editors, Agreement Deposit and shared branch
settings. Source-only; owner selection/refresh/context acceptance pending.
`ReferenceLookupStatusComponent` reuses StateMessage and the shared secondary
button for translated loading/error/retry, inherits theme/RTL, and owns no
business calculation or form value. Initial bootstrap keeps its existing error
owner; watch requests use inline feedback mode where the component owns it.
Source-only evidence: `reviews/PURCHASING_REACTIVE_LOOKUP_CACHE_DOMAIN_API_CONTRACT_FREEZE.md`;
compiler/network/tenant/reconnect acceptance remains pending.
