# تحديث صلاحية القوائم المشتركة عند تعديل مستخدم آخر

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Date | 2026-10-23 |
| Requested deliverable | Implementation plan only; no application-source changes |
| Initial scope | Country and UnitsOfMeasures cache invalidation across users of the same tenant |

## الهدف وحدود النطاق

Extend the existing reference lookup cache and existing real-time infrastructure. A committed Country/UOM change makes other users' reusable source snapshots stale promptly. Their next lookup reads the authoritative HTTP source. Do not send actual rows over the socket, auto-save/reset a form, change selections, add a second connection, cache more domains or change selectable-record predicates.

Important distinction: immediate **cache invalidation** is not automatic replacement of option arrays already held by an open component. The recommended first slice delivers invalidation plus fresh next reads, including safe recovery of pending reads. Live rebinding of every already-open dropdown would require a separate shared observable/options contract and consumer migration; it is not silently included.

Authority: Master1/4/5/7/8, UI2/16/22/28, BE10 and PLAN-00. Recipe Check all8 current before planning. The existing Frozen `LOOKUP_CACHING_REFERENCE_DATA_CONTRACT_FREEZE.md` remains authoritative for current behavior; this Draft records proposed later changes. No screen/DB/permission/calculation/API-select shape changes. No tests, builds, database actions or application edits were performed for this planning request.

## الحالة الحالية والأدلة

Paths are relative to the frontend/backend repositories under `F:/My Work/Sigma`.

| Concern | Existing owner / evidence | Finding |
|---|---|---|
| One client socket | Frontend `shared/service/realtime.service.ts`: watch, start, synchronize, session observation | Ref-counted topics on one connection; already used by Dashboard; connected/changed notifications; reconnect/rejoin and auth-token replacement already handled |
| Topic allowlist / tenant group | Backend `SiGma.ServerAPI/Realtime/RealtimeTopics.cs`, `RealtimeHub.cs` | Server validates known topic and derives tenant from authenticated claims; tenant is not accepted as a client hub argument |
| Existing topic definitions | `RealtimeServiceCollectionExtensions.AddSigmaRealtime` | Only dashboard topic currently registered; Country/UOM are not registered lookup sources |
| Commit ownership | `RealtimeCommitTracker`, SaveChanges/Transaction interceptors | Captures tracked EntityBase changes; implicit save completion or explicit transaction commit releases notifications; failed save/rollback does not publish; ambient transactions intentionally await fallback reconciliation |
| Delivery | `RealtimePublisher` | Coalesced bounded process-local channel; failures do not fail an already-committed save; best-effort delivery, not a durable log |
| Real runtime wiring | `Program.cs:20,38-39,146`, DependencyResolver hub token handling | Service/interceptors/hub already registered; no new server pipeline/connection needed |
| Source writers | Business CountryService and UnitsOfMeasuresService; inherited base writers | Tracked normal entity writes; use entity-topic mapping, not per-controller Publish copies. Existing soft-delete/activation remain normal tracked changes |
| Reference cache | Frontend `ReferenceLookupCacheService` | Source snapshots and in-flight reads, five-minute TTL, scope resets, source invalidate, focus return; no real-time subscription yet |
| Current cancellation | `invalidate(url)`, `clear()`, navigation interceptor | Invalidation cancels pending reads with completion-without-value. Reusing this blindly on late initial socket join/remote event can finish consumer forkJoin without data |
| Consumer contract | Existing BaseService.getSelectList + forkJoin bootstrap consumers | Finite HTTP-style observable. Do not turn it into an endless stream that prevents forkJoin completion |

## خريطة التأثير والتصنيف

| Area | Decision | Planned responsibility |
|---|---|---|
| Server topic definitions | Extend | Add server-owned `lookup-countries` mapped to Country and `lookup-units-of-measures` mapped to UnitsOfMeasures |
| Hub/auth/group/publisher | Keep | Reuse claim-derived tenant isolation, one connection, existing event envelope and delivery safeguards |
| Existing commit tracker | Keep / verify | Trace all scoped writer paths and commit timing; no publishing from browser or before commit |
| Shared reference cache | Extend | Map known source URLs to topics, drop settled snapshots on change/rejoin, fence/restart affected pending requests without exposing empty completion to waiting consumers |
| BaseService / Country / UOM / CompanyDriver | Keep | Current opt-in and finite read contract; all current consumers inherit invalidation at the data owner |
| Other lookup/settings/balance sources | Keep | Excluded from this slice |
| TTL/focus/reload | Keep | Recovery when events are missed, connection is unavailable or changes bypass tracked writes |
| Common user guide | Extend during implementation | Explain remote invalidation versus already-open choices and retry/offline behavior accurately |

## البدائل

| Option | Trade-off | Recommendation |
|---|---|---|
| Periodic refetch of every lookup in every screen | Repeated network requests even when data unchanged; screen copies and hidden-load risks | Reject |
| Push full option arrays from server | Duplicates HTTP contracts/labels and complicates language/tenant/client state | Reject |
| Existing socket sends invalidation only; HTTP supplies current options | Small events, one source of truth, compatible service ownership | Select for proposed first slice |
| Add response ETags/source versions/outbox immediately | Useful if durable/conditional revalidation is required; broader storage, deployment and writer contract | Defer until reliability/performance requirements establish need |

## تسلسل التنفيذ المقترح

1. **Freeze the bounded change.** Two topic names/source mappings, unchanged select responses, tenant audience, post-commit-only timing, finite read lifetime, pending-read restart/failure behavior, and absence of automatic open-form changes.
2. **Extend server source registration.** Register the two entity topics in the current real-time owner. Existing tracker then covers tracked creates/renames/deletes/activation automatically after successful commit. Review any scoped bypass writer before claiming complete coverage.
3. **Connect the shared cache to the existing client owner.** Observe only the two used sources through RealtimeService.watch; no per-screen socket/subscription copies. Clean up/reset on session replacement/logout and service destruction. `changed` and `connected`/rejoin both trigger reconciliation so events missed during disconnection cannot leave a settled snapshot valid.
4. **Handle races before wiring events.** Introduce per-source generation/revalidation ownership. A source event drops both feedback variants and rejects an older response. An affected subscribed in-flight read transparently reacquires the latest source with existing HTTP feedback/navigation guards, coalescing event bursts. Do not call the old cancel-only invalidation path and leave forkJoin completed without a value. No endless polling, mutation retry or KEEP_READ_ON_NAVIGATION exemption.
5. **Keep UI behavior predictable.** Next source load obtains the fresh options; loaded/dirty form values remain unchanged. No eager HTTP refresh for screens with no consumer. Backend reference validation continues to reject unavailable submitted ids. An already-open choices list is not promised to update without another read.
6. **Verify and reconcile.** Server commit/rollback/audience tests; client race/rejoin/coalescing/lifetime tests; two real user sessions with same tenant and a third with another tenant; existing cache/navigation regression tests; common EN/AR guide, canonical policy/skill and packets updated with final source.

## التحقق المطلوب

| Scenario | Required evidence |
|---|---|
| User A commits Country/UOM edit, User B has warm cache | Correct source event; B's next read bypasses old snapshot; unrelated source cache preserved |
| Failed save / rolled-back transaction | No false change notification/invalidation |
| Different tenant | No cross-tenant notification/cache clearing; claims own group membership |
| Same user receives own event after local invalidation | No duplicate transport storm; latest result wins |
| Late initial join / remote event during forkJoin | Pending consumer receives a valid fresh result or its existing failure channel; no stuck bootstrap/empty completion caused by remote invalidation |
| Reconnect with events missed | Rejoin invalidates/reconciles settled data; old-session callbacks cannot affect new context |
| Multiple events / language and branch changes | Burst coalescing and context fences preserve correct response/feedback owner |
| Socket unavailable | Ordinary HTTP still works; TTL/focus/reload remain; no false real-time guarantee |
| Open dirty editor | Draft, selected ids, validation and dirty-state behavior preserved |

## القرارات والقيود التي يجب إظهارها

- **Confirmed:** existing group audience is authenticated tenant/subscription. Country/UOM source data is tenant-owned; no branch group or invented permission API is needed.
- **Recommended first-slice semantics:** invalidate immediately, re-read on next demand; transparent restart only for reads already subscribed. Already-held arrays are not automatically patched. This is the scope proposed to the owner by this plan, not an implemented change.
- **Reliability limit:** publisher queue is bounded and non-durable; ambient transactions and non-EF/raw-SQL writers do not establish immediate event coverage. Keep fallback and report those limits rather than promise guaranteed delivery.
- **Production topology not established:** if APIs run on multiple instances, a shared SignalR backplane/managed hub and correct cross-node publication are a deployment gate for prompt cross-user delivery. Do not introduce Redis without deployment evidence. TTL remains fallback, not a substitute for a required real-time guarantee.
- **Compatibility:** no database migration is expected for topic mapping/cache integration. A durable outbox/version table would be a different, separately approved scope.

This planning request ends here. Application source/configuration and the previous frozen implementation remain unchanged. The implementation phase must turn the pending-read recovery proposal into an exact, tested shared contract before enabling the new events.
