<!-- Part of UI block 2: see ../02-service-and-response-wrappers.md. Same status and authority as the block. -->

### Shared batch-import transport (2026-10-14)

The root `CsvImportService.post<T>(route, request)` owns repeated CSV batch POST transport: `environment.baseUrl`, the root interceptor-enabled `HttpClient`, typed `CsvImportResult<T>` and `X-Skip-Error-Interceptor` / `X-Skip-Success-Toast`. Use this owner only for a confirmed batch contract whose shared import workspace owns persistent error/partial/success feedback. Screen services remain typed and supply the existing exact route and body key; they do not invent endpoints or alter the import envelope. Ordinary mutation and unrelated CSV consumers retain their existing feedback owner. Evidence: the eleven supported Administration/DataImport services. Source-only; owner compile/authentication/API acceptance pending.


### Shared real-time read invalidation (2026-10-19)

Use root `RealtimeService.watch(topic)` for a confirmed server read-model topic.
One ref-counted SignalR connection owns token/session changes, topic membership,
initial-start retry, automatic reconnect, rejoining and final-consumer teardown.
The shared `readAuthToken` owner supplies the same stored credential used by
the HTTP token interceptor; socket authentication uses `accessTokenFactory`.
Shared `observeAuthToken` owns distinct current/auth/storage observation,
including a guarded microtask after login's user-before-token-storage emission.
Use it for the socket and session-bound HTTP consumers; teardown removes the
storage listener and ignores deferred emissions after unsubscription.
Never put a tenant or bearer token in a feature payload or log. The service emits
`connected` after joining/rejoining and `changed` for invalidation messages.

The feature keeps a typed HTTP snapshot service on the single root HttpClient.
Coalesce notification bursts, cancel stale/filter/session reads through UI28,
and refresh after rejoin to recover missed events. Show connection state and
retained-data failure clearly; offer manual Retry and a bounded periodic
reconciliation for missed events and date-based values. A socket notification
does not contain authoritative counts, replace the response wrapper, establish
permissions or certify delivery. Missing derived values stay unavailable rather
than becoming zero. Dashboard is the first consumer; source-only evidence,
owner compilation, reconnect, isolation and runtime acceptance remain pending.
