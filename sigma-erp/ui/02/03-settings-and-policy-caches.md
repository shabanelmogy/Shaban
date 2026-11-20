<!-- Part of UI block 2: see ../02-service-and-response-wrappers.md. Same status and authority as the block. -->

### Common settings used by an inline lookup batch
`CommonSettingsService.getMySetting<T>(options?)` retains the current
`SettingsCommonModel/GetMySetting` endpoint and typed `Result<T>`. A consumer
that owns inline error/Retry feedback may pass `{ skipErrorInterceptor: true }`;
the service sends the existing `X-Skip-Error-Interceptor` header. Omitted options
retain global feedback. Rental Agreement Deposit reads `CommonDTO` alongside its
options and supplies the configured currency labels/decimals to shared
`amountInWords` (block 19), keeping entered amounts on failure. This option
changes feedback ownership only; it adds no settings API, currency default or
financial calculation.

**Explicit common-settings cache opt-in.**
`CommonSettingsService.getMySetting<T>` now uses the existing scoped in-memory
ReferenceLookupCacheService for this exact endpoint, preserving Result<T>,
finite reads, feedback modes and optional forceRefresh. Only success with a
nonnull object entity is retained; missing settings, failure and malformed
responses remain retryable. This explicit singleton exception does not widen
list-envelope validation or enable other settings/operational endpoints.
Inherited successful common-settings mutations invalidate its exact read URL
before callbacks; failed writes retain valid data. Its settings-common tenant
topic reuses existing post-commit realtime publication/invalidation. No config
values are pushed or written to browser storage. Idle reads refresh on next
demand; no persistent settings watch rewrites an open settings form/document.
Direct adapters such as Job invoice-customer settings delegate to this source.
Derived tax reads must not put a permanent replay cache over this scoped cache:
reacquire on explicit load, retaining required-read failure and preview fallback
contracts. No financial-calculation rule or saved draft changes. UI22 owns silent
background refresh presentation. Evidence: COMMON_SETTINGS_CACHE_FEATURE_REVIEW.



### Required settings reads
A settings lookup that gates a dependent workflow may expose an opt-in strict read mode. Strict mode throws or returns the declared failure so the caller can block Save/Finish and offer Retry; the legacy optional fallback remains for non-gating previews. Cache successful strict reads separately and do not cache failures. Source-only evidence: Limousine quotation and TripBooking tax settings.


### Currency policy cache invalidation
Successful typed currency Create/Update/Delete operations invalidate the existing
`FinancialNumberPolicyService` cache through its `invalidate()` member. The next
`load()` obtains the authoritative backend policy; existing `load(force)` callers
retain their semantics. Keep invalidation in the owning typed currency service,
after `isSuccess`, rather than copying it into editors or a global interceptor.
Do not issue an extra policy request or change backend precision/rounding rules
as part of invalidation. Failed writes retain the cached policy and editor draft.

**Feedback ownership for explicit policy reads (2026-10-25).**
`FinancialNumberPolicyService.load(force = false, options?: { skipErrorInterceptor?: boolean })`
keeps the same `Currency/GetFinancialNumberPolicy` endpoint and typed Result.
Omitting options retains the existing global error owner; a caller with inline
failure/Retry passes `{ skipErrorInterceptor: true }`. Changing that feedback
mode reacquires the request so an inline consumer does not inherit a global
error request, or conversely. A workflow that explicitly needs a new authoritative
read on load/Retry uses `load(true, { skipErrorInterceptor: true })`, checks both
failure channels, and fences stale responses through its own read lifetime
(UI28). JVs is that consumer; this is not a requirement to force every existing
policy caller or a background watch that changes an open document's precision.
The policy retains its own direct service/cache contract, `invalidate()` and
server-owned precision/rounding; it is not opted into ReferenceLookupCacheService.
Failed reads preserve draft values and remain actionable through Retry.
**Policy memo recovery (2026-11-05):** coalesce pending requests and retain only
successful nonnull policy objects. Failed Result/malformed bodies, HTTP failures
and navigation's empty completion must release the memo for the next load; keep
the failure envelope/error for current subscribers. Compare request identity so
an older forced/feedback-mode request cannot clear a newer memo. Preserve the
existing context cancellation, explicit force and currency-write invalidation.
Evidence: FinancialNumberPolicyService and its request-recovery spec; execution
and runtime acceptance remain pending.

Source evidence: `Administration/Currency/services/currency.service.ts` and
`shared/service/financial-number-policy.service.ts`; owner compilation and
before/after policy-read acceptance remain pending.


### Dashboard display snapshot cache
The owner explicitly opts `Dashboard/Snapshot` into the existing
ReferenceLookupCacheService as a display-only singleton. DashboardSnapshotService
uses the full encoded ownership/fleetType query URL for both finite `read` and
separate `watch`, with identical inline-error feedback mode. Only a successful
non-null object `Result.entity` is cached; other sources retain their existing
envelope checks. This exception never supplies write-time capacity, availability,
approval eligibility, financial policy or accounting decisions.

Reuse shared scope/session/branch/language reset, clones, pending-read sharing,
revision/cancellation fencing, idle/LRU limits and the header refresh activity.
Dashboard entries have an absolute 60-second TTL matching their pre-existing
reconciliation cadence; reference/settings entries retain five minutes. The
existing tenant `dashboard` topic invalidates every filter variant on commit
notifications/rejoin; only mounted visible watches auto-refresh. Idle/hidden
snapshots remain stale until explicit demand or visible return. Keep existing
best-effort topic/TTL delivery limits; no new socket or mutation interceptor.

The component applies a successful finite bootstrap before mounting its watch,
releases the old watch on filter replacement/destroy and clears displayed values
on a null context reset. The shared cache exposes a data-free `contextChanges`
observable from its existing scope-reset owner. Dashboard cancels and clears the
display immediately, then reacquires on a cancellable deferred RxJS turn, even
when a finite bootstrap/forced read completed empty before its watch mounted.
This prevents same-token branch/language changes from retaining old-context
figures or stranding bootstrap; do not log/publish identity or credentials.
Retain same-filter data after revalidation failure and
offer the existing inline Retry. Manual Refresh/Retry forces authoritative HTTP.
Shared watch expiry owns successful periodic reconciliation, avoiding a second
feature refresh loop; a bounded visible failure retry retains recovery when the
bootstrap failed and no watch exists. Preserve local busy/aria-busy, silent page
loading and filter controls; snapshot emissions never patch the filter form.
Evidence: `reviews/DASHBOARD_CACHE_MAINTENANCE_EVOLUTION_PLAN.md` and
`reviews/DASHBOARD_CACHE_FEATURE_REVIEW.md`. Source-only; owner network, compiler,
scope, reconnect and timing acceptance remain pending.
