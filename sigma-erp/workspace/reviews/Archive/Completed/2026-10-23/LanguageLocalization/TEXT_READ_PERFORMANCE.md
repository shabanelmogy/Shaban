| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | Owner clarified: text list and opening text editor, 2026-10-17 |

Source evidence: openEditor waits for Keys then mounts TextEditor, which starts Detail. Each HTTP request gets its own backend scope; their independent reads can overlap through frontend forkJoin without parallel queries on one DbContext. Management reads repeat two option queries after middleware already obtained a successful request-only runtime snapshot. Save/Reset must keep fresh validation, untouched. Runtime/SQL/network timings unknown; no claim of a measured bottleneck. Definition language screens explicitly excluded by latest owner clarification.

Frozen changes: launch the existing Keys and Detail HTTP requests together. Validate both envelopes and identity, max50000 and initial-key membership before opening; freeze exactly the existing key snapshot and optionally carry its freshly loaded initial detail in the internal LanguageTextSession. TextEditor hydrates that snapshot once, with identity checks and no duplicate initial Detail; navigation, Retry and Reset still read fresh Detail. Pair the existing one global load owner and retain complete busy/route guards and both failure channels. Do not reuse stale list values as detail or alter navigation snapshot. Internal frontend handoff only, existing HTTP requests unchanged.

Read-only backend identity validation reuses GetRuntimeOptionsAsync successful request-only options; list/Keys/Detail consume it through a separate read validator. Save/Reset continue original fresh ValidIdentityAsync. No cache beyond request, tenant/header bypass, SQL schema/EF/migration or HTTP change. UI2/22/28 existing root-client/forkJoin/teardown; BE5 request-only runtime read owner; frozen Languages contract navigation snapshot retained. Phase03/05/06 applies, backend validation-only change; no domain/list UI redesign. Packet check8 green. Single tightly coupled repair, no subagents.

| Concern | Reference owner | Target |
|---|---|---|
| Independent reads | Texts component getTextKeys/getTextDetail; root LanguageService | forkJoin two separate HTTP scopes, no manual headers/client |
| Initial form | TextEditor current(), loadDetail validation | Fresh validated initialDetail, shared hydration; later reads fresh |
| Read vs write options | LocalizationService GetRuntimeOptionsAsync / ValidIdentityAsync | Request-only read snapshot; fresh writes |
| Progress/errors | LoadingService, inline error envelope checks | One global counter, finalize teardown and no partial-open |

## Final reconciliation

All four rows match final source. Frontend forkJoin starts the two existing independent requests together; both declared failures and HTTP failures prevent session creation, key limit/membership and detail source/key are verified. New optional initialDetail is an internal session property only. Editor ngOnInit checks it against frozen session identity, hydrates through acceptDetail, and falls back to its existing fresh read when absent/invalid. loadDetail/Retry/navigation/Reset use the same acceptDetail behavior, preserving dirty/version/conflict/committed and accumulated-row semantics. No duplicate initial read. Global loading spans bootstrap with finalize on success/failure/teardown. Existing complete frozen key navigation remains; no stale list-based form or navigation cache.

Backend ValidReadIdentityAsync uses successful request-local GetRuntimeOptionsAsync for list/Keys/Detail; middleware and read endpoint share the service scope. Failed options are not cached. ValidIdentityAsync still freshly calls language options for Save and Reset; no changes to key locks, version check, writes, API messages, SQL projection/filter/order/count or fallback. No parallel backend DbContext query or global cache.

Successful source-derived backend materialization counts: list7→5, Keys6→4, Detail6→4 (middleware options2 + paired API1, endpoint options no repeat, then count/page2 or Keys/Detail1). Each actual HTTP request remains separate; these are source counts, not measured SQL traces or time estimates. Opening changes serial Keys→Detail latency toward their overlap; total request count stays two. Query size/plan, snapshot keys, network and frontend rendering can still cause delay, especially filtered/value-sorted large catalogs.

Source files changed: frontend Languages/models/text.ts, texts/texts.component.ts, texts/text-editor.component.ts and UserGuide/content/languages-topic.ts; backend Business/Services/Localization/LocalizationService.cs. Repository roots separately inspected: F:/My Work/Sigma/SiGmaAngularFrontEnd and F:/My Work/Sigma/SigmaBackend. Existing untracked feature files read in full relevant flows and no-index whitespace checks passed (LF/CRLF notices only). Old unrelated changes preserved. Source syntax parsed28 TypeScript files and8 templates without errors; no type-check/build/EF/runtime claim. Existing typed session and closed-event consumers reviewed; HTTP API contract unchanged.

UI28 and BE5 plus skill digest/history synchronized, all8 packets regenerated/check current. PHASE03/05/06 semantically retain same typed form, cancellation and separate HTTP/backend-scope ownership. Existing bilingual guide at /UserGuide/administration describes concurrent initial reads. No route/menu/reader or visual styling change. Definition languages intentionally not edited after clarification. No backend entity/DTO/AutoMapper/calculation/migration change. No subagents: coupled small handoff.

Owner validation: rebuild/restart backend and allow frontend rebuild; compare list load and edit-open timings. Network should show Keys and Detail starting together, exactly one initial Detail. Verify source/key mismatch, Keys overflow/membership failure, either HTTP failure and Retry, filter/search/value sort, previous/next across pages, Reset fresh detail and optimistic conflict. Save/Reset should continue server validation; logout/tenant isolation and global loader required. Actual SQL/timing/runtime remains pending; no build/tests/lint/browser/database/migrations/commits/pushes/deployments executed. Suggested commits: frontend perf(languages): overlap text editor bootstrap reads; backend perf(localization): reuse request options for text reads. No migration required.
