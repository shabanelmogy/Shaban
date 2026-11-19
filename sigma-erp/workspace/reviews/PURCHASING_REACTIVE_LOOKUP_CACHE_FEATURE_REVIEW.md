# Purchasing reactive reference cache — implementation and reconciliation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-24 |

## Approved scope and evidence

Owner approved TTL refresh plus source-change notifications, then explicitly
excluded complexity for developer cache inspection. No NgRx/TanStack package,
custom inspector, storage cache, extra socket or global GET interceptor added.
The Frozen maintenance plan and domain/API contract in this folder own the
decision. No new screenshot contract applies to this slice.

Shapes: shared reference-read infrastructure plus existing routed lists/editors
and supplier reports; not a new CRUD screen. Applied discovery, contract freeze,
frontend consumer/detail integration, backend topic registration and final source
reconciliation. No domain-action/write/schema phase: business effects, DTOs,
approval, quantities, accounting and mappings do not change.

## Conformance and source owners

| Concern | Book | Reference/shared owner | Final match |
|---|---|---|---|
| Root HTTP/finite lookup | UI2/28 | BaseService, Country/UOM services, existing navigation interceptor | getSelectList remains finite; separate watch API, no cancellation exemption |
| Shared cache lifetime | UI2 | ReferenceLookupCacheService | One key per full URL/context/feedback; cloned snapshots, revision/session fences, active watches |
| Select presentation | UI16/22/24/25 | Existing selects, StateMessage, sigma-secondary-button | Options-only replacement, translated status/retry; no new select wrapper/palette |
| Realtime | UI2; BE18 | Existing RealtimeService and server RealtimeTopics/CommitTracker/Publisher | Existing socket/auth/tenant groups; only source registrations added |
| Guide | Master7/UI23 | Existing UserGuide reader and shared-screen-guidance | Bilingual shared behavior, existing module routes/menu links |

## Implementation inventory

Frontend shared owners: reference-lookup-cache.service.ts, new
reference-lookup-state.ts, BaseService watch/refresh APIs, ContactGroup typed
watch/refresh APIs, new ReferenceLookupBindings and ReferenceLookupStatusComponent,
three EN/AR feedback keys, exact runtime component entry in tsconfig.app.json.
No spec included in application runtime entries.

Consumer integrations: request/order/GRN/bill/return lists and editors, request
conversion dialog, supplier editor, supplier statement, payable-age analysis and
supplier balances summary. Initial bootstraps remain finite. Operational document
candidates/remaining quantities/rates/accounts retain their existing direct reads.
Other source consumers retain source-level caching/invalidation without adding a
new persistent screen subscription outside this slice.

Backend: only RealtimeServiceCollectionExtensions.cs. Registered Country, UOM,
Supplier, Branch, Item, AssetType, Currency, ContactGroup, Job and Vehicle source
topics. Verified declared entity namespaces/imports and existing project source
ownership. Hub derives tenant from authenticated claims, validates registered
topics and pushes no option rows. Existing tracker separates successful saves/
explicit commit from rollback/failure. No new controller, VM, mapper, entity,
EF configuration, dependency package or migration.

## Final behavior

| Frozen contract | Source reconciliation |
|---|---|
| Finite bootstrap plus persistent state | read uses finite outcome; watch uses state stream; shared binding once per source/DestroyRef |
| Invalidation during pending read | Revision fences/cancels obsolete HTTP; 150ms coalescing reloads waiting readers instead of empty completion |
| TTL/notification active refresh | Five-minute expiry, local source writes, source topic join/rejoin/change invalidate; visible mounted consumers reload |
| Idle/hidden behavior | No automatic HTTP while idle/hidden; explicit read or visible return obtains current data |
| Failure behavior | Old successful snapshot retained, stale/error status and Retry; no retry timer loop |
| Scope isolation | Session/user/tenant/branch/language key reset, cancellation, topic release and watcher reacquisition; credentials remain memory-only |
| Shared request/teardown | One request per key, subscriber count, final teardown cancels, idle LRU eviction; active entries pinned |
| Forms/accounting | Update option arrays only; preserve form IDs/dirty state, no defaults/cascades/financial recalculation |
| State/error language | lookupCache.refreshing/refreshFailed/retry present EN/AR; StateMessage owns rendering |

No list columns, filters, paging metadata, Add/Update payloads, action-state
contracts, permissions or AutoMapper mappings changed by this slice. Existing
source eligibility rules remain authoritative. A retained selected label does
not authorize saving an unavailable option; backend validation remains final.

## Guide and documentation

Updated `src/app/modules/UserGuide/content/shared-screen-guidance.ts`, consumed by
the existing guide reader. Existing `/UserGuide/vouchers-purchasing` and
`/UserGuide/suppliers` links remain in sidebar-menu-data.ts. Covers reviewed
document lists/editors/conversion and supplier screens: automatic option refresh,
draft preservation, hidden/idle behavior, missed events, context clear and Retry.
EN/AR source checked; visual/reading/print acceptance remains pending.

Promoted shared behavior to canonical UI2 and skill digest/revision together.
Regenerated all eight packets through Generate-SigmaRecipes.ps1; semantic review
retains modern root-provider/reference roles and phase boundaries, with updated
UI2 provenance. Initial and final recipe checks pass.

## Verification and limits

Source-reviewed scoped diffs independently in frontend, backend and documentation
repositories, plus new untracked shared files directly. Checked key/type/import
compatibility, registrations, feedback, lifetime, translations, guide links and
whitespace/merge markers. Added regression spec source for finite invalidation
restart, active/idle TTL, realtime isolation/coalescing, failure/retry, teardown
and context rebound. Integration specs mock realtime; no sockets created by tests.
Added shared binding regression source for a fresh empty result retaining a draft
label, context reset clearing it without changing the ID, and per-source Retry.
Root reconciliation replaced remaining local selected-option merge copies in
GRN/bill/return/conversion consumers with the same selected-ID/current-row shared
binding, and applied label retention to list/report filters as well. The focused
independent audit found no actionable defect in the final engine/API/server slice.

Builds, tests, lint, browser/runtime verification, database commands, migrations,
commits, pushes and deployment were not run. No migration needed for this slice.
Existing unrelated dirty files and prior schema work are preserved.

Owner acceptance: compile frontend/backend; open order twice and verify eligible
GetSelect cache hits; leave editor open through expiry and a second-session source
change; verify retained selections/dirty draft and unchanged amounts; hide/return
tab; simulate failed refresh then Retry; change tenant/session and verify no old
options; check rollback/reconnect/notification isolation and navigation teardown.
SignalR delivery remains process-local, bounded/nondurable. Missing notifications,
raw SQL or ambient-transaction bypass rely on TTL/return-to-tab reconciliation;
multi-node deployments need their existing operational backplane decision.

## Delegation and suggested commits

Root owns contracts, engine/API, backend registration, integration and final review.
Reused bounded gpt-5.6-sol consumer worker for shared binding/status and disjoint
TS/HTML consumers; separate gpt-5.6-sol worker owned only regression spec source;
focused gpt-5.6-sol audit stayed read-only. Independent file ownership reduced
wall time after freeze; no overlapping source edits or agent final authority.

Suggested commits only:

- Frontend: `feat: refresh active reference lookups with shared cache state`
- Backend: `feat: publish reference lookup invalidations after commit`
- Documentation: `docs: define active reference cache revalidation contracts`
