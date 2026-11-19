# Common settings cache extension

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Owner explicitly opts `SettingsCommonModel/GetMySetting` into the existing cache.
Bounded source-adapter extension of the frozen reactive cache, tier S. Shared
service/settings shape (UI2; backend BE16 read reference), no new screen or
domain action. Initial recipe Check all8 passed. No agents: one small coupled
source path. Existing unrelated dirty work preserved.

## Frozen decisions and source conformance

| Concern | Rule/reference/shared owner | Decision |
|---|---|---|
| Transport | UI2, CommonSettingsService | Keep Result<T>, exact endpoint, finite Observable and default/inline failure channels; add optional forceRefresh |
| Cache | UI2, ReferenceLookupCacheService | Reuse5min scoped/cloned/deduplicated cache. Only this explicitly approved singleton URL accepts success with a nonnull object entity; list validation stays strict |
| Writers | UI2, BaseService post/put/delete + actual Common editor | Source-owned success hook invalidates exact settings URL in all feedback modes before caller callbacks; failed saves keep prior snapshot |
| Realtime | UI2, existing RealtimeTopics/commit tracker | Register settings-common for SettingsCommonModel only; tenant post-commit notification invalidates snapshot, no config payload broadcast |
| Direct reader | JobService.getInvoiceCustomerSettings | Delegate to CommonSettingsService with same inline feedback, no second direct HTTP bypass |
| Derived tax reader | TaxSettingsService | Remove outer permanent shareReplay so next explicit load reacquires the shared scoped cache; retain required failure/default preview semantics and no automatic draft recalculation |
| User guide | Master7, Administration guide | Note brief settings reuse and subsequent-read update after successful save; no new route/control |

No arbitrary entity endpoints, other settings, operational quantities, rates or
financial-number-policy endpoint are opted in. Cached settings remain in memory,
never browser storage/logs; existing API shape and financial rules stay unchanged.
Singleton absence/failure/malformed data is not retained as success. Context,
pending invalidation restart, cancellation and TTL behavior inherit the cache.
No persistent settings watch or automatic editor reload, avoiding draft overwrite.

## Reconciliation

Implemented source adapters, exact-URL singleton success validation and topic
mapping in ReferenceLookupCacheService; source-owned successful-write hook in
CommonSettingsService; delegation from JobService; derived TaxSettingsService
reacquisition without permanent shareReplay; and the SettingsCommonModel topic
registration in existing AddSigmaRealtime. The protected success operator override
is justified because ordinary select-family invalidation does not cover this
explicit singleton URL. Other source select invalidation remains unchanged.

Reconciled transport → shared cache → source write → invalidation → next read;
required-tax errors/default-preview behavior preserved. Added integration spec
source for shared singleton request/clones, failed versus successful saves,
force refresh, null entity retry, Job delegation and remote invalidation reaching
derived tax reads. Binding specs distinguish initial loading from retained-data
background refresh, including an empty successful list. Specs not executed.

Reviewed scoped diffs independently in frontend/backend/documentation repositories;
checked new .NET namespace/import/source ownership, response guards, exact topic,
typed service signatures, field lifetimes, feedback, whitespace and absence of raw
GetMySetting bypass in Job. No schema/migration, DTO/mapper/controller or
financial-calculation change. No package or Topbar source changes in this slice.

Updated shared-screen-guidance.ts (EN/AR), consumed by the existing guide reader
including `/UserGuide/administration` and `/UserGuide/vouchers-purchasing` menu
entries; no new guide viewer. Promoted UI2/UI22 and skill rule/revision together.
Generated all eight packets through the generator; semantic review preserves
phase05/06 source/feedback/lifetime gates and updates UI2/UI22 provenance; final
drift Check all8 passed.

Owner checks pending: build frontend/backend; reopen forms and verify reduced
GetMySetting requests; save common settings and verify next read; failure and
retry, force refresh, separate feedback modes, tenant/session switch, TTL and
remote source notification; retained-data updates must not show lookup loading
or replace a draft. No builds/tests/lint/browser/runtime/database/migrations/
commits/pushes/deployment run. No migration needed. Realtime delivery retains
existing bounded/process-local/bypass limitations with TTL fallback.

Suggested commits only: frontend `feat: cache common settings and refresh retained lookups silently`;
backend `feat: invalidate common settings cache after committed changes`;
documentation `docs: document common settings cache and silent refresh`.

### Owner clarification during implementation

Owner requests updates without page loading. Shared ReferenceLookupBindings now
shows loading only when no retained value exists; reference HTTP state stays
accurate. Cached successful empty lists refresh silently too, errors remain
visible/retryable. Cache/notification refresh itself never starts LoadingService;
ordinary first-page bootstraps keep their own progress owner. No interceptor or
global loading-counter rewrite. Added to UI2/UI22, skill and bilingual guide.
Owner subsequently asks for an opinion on a small Topbar badge; proposed delayed
nonblocking badge in commentary. That question alone does not authorize a new
badge implementation; no Topbar source changed in this slice.
