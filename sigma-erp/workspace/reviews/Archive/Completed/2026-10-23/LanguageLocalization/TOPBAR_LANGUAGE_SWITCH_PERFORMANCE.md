| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | TopBar language-switch latency, owner report 2026-10-17 |

The owner identifies slow switching specifically from TopBar. Source evidence: TranslationService.setLanguage always calls refreshRuntime, which serially requests Language/Options then Localization/Runtime. Each authenticated request eagerly resolves both API resource dictionaries; ResolveSourceAsync repeats option/settings queries for each source and RuntimeCore validates again. buildDictionary re-traverses all shipped dictionaries on every switch. Exact wall-clock/server/SQL timings are unknown; no application, database, browser or builds executed.

Frozen repair preserves every HTTP route/envelope, fallback order, dictionary freshness and tenant/user boundary. Keep a fresh UI runtime read for each actual switch, and only the active DB UI dictionary. A switch can consume its already loaded active language option directly; explicit refresh and session bootstrap continue to reload options/defaults. Same active successfully loaded language is a no-op. Capture request choice; switchMap cancels obsolete results. Precompute immutable source-key paths while originals are registered, preserving literal dots and validation.

Integration refinement before edits: expose the runtime-only successful option snapshot as ILocalizationService.GetRuntimeOptionsAsync(CancellationToken): Task<LanguageOptionsVM?>. Middleware consumes this same scoped owner instead of separately loading ILanguageService options; UI resolver shares it. This is an internal service handoff only, with no HTTP/persistence change. It removes the remaining duplicated middleware validation read; management/mutation validation still calls the fresh language owner. Root owns the interface and middleware integration after the bounded backend worker completes.

Backend repair is limited to eliminating repeated reads inside one scoped localization service/request and reading both API sources in one projection. Do not add global/static/distributed dictionaries, time-based staleness, change schemas, parallelize queries on DbContext, or memoize language mutation validation. Preserve all-or-nothing request message publication and fallback/error behavior. No new HTTP contract. Runtime-only option/default reads may reuse one successful request snapshot; ordinary mutation checks remain fresh.

| Concern | Book | Actual reference/owner | Match target |
|---|---|---|---|
| Selection/cancellation | UI2/23/28; PHASE05 | TranslationService.requests switchMap and refreshRuntime; LanguageService.getOptions | Existing root HTTP owner, latest intent wins, no obsolete snapshot |
| Dictionary identity | UI23/25; frozen Languages contract | originals/runtimeLanguages/buildDictionary | One active DB language; original reset and session cleanup retained |
| Runtime query | BE5/18 | LocalizationService.ResolveSourceAsync, DatabaseLocalizationMiddleware, RequestLocalizationSnapshot.Apply | Request-scoped reads, serial DbContext use and exact fallback |
| Updates | UI22/28 | Languages editors refreshRuntime after successful changes | Explicit refresh still authoritative; no stale cross-language cache |

Packets checked current (eight green). Phases00/01 scoped to latency and unchanged contracts,05/06 apply; list/editor/domain/schema phases skipped. Separate backend and frontend ownership allows bounded independent implementation; root owns integration/artifact/guide reconciliation. Performance gains remain an expectation until owner timing/build/runtime checks.

## Final source reconciliation

All four conformance rows match final source. TranslationService captures the preferred language/selected option in each request, preserves switchMap cancellation, reuses its displayed option for TopBar selection and reads the fresh dictionary. The idle/no-error/already-applied guard does not swallow a user's switch back while another language is loading. Explicit refresh still reloads options and default, and saving text/definitions/default or Retry uses that existing path. Original path indexing now happens at registration, preserving full-key/literal-dot paths; every runtime value still passes unsafe-key validation. Only the active DB dictionary is retained and logout restores originals. RTL metadata, stylesheet and document direction owners are unchanged. No template/layout changes.

LocalizationService exposes the successful runtime-only options snapshot to middleware, resolves both API sources together and retains the complete pair only inside the scoped request, keyed by culture. Source/tenant filters, exact nonblank fallback, cancellation, failure sentinel and all-or-nothing RequestLocalizationSnapshot.Apply remain. UI values always execute a fresh projection; ordinary validation (including Save/Reset) remains on languages.GetOptionsAsync. No new HTTP endpoint/envelope, schema, migration, AutoMapper or domain calculation.

| Successful path (source-derived materializations, not measured SQL trace) | Before | Final |
|---|---:|---:|
| TopBar actual language switch HTTP requests | 2 serial | 1 |
| Runtime endpoint incl. localization middleware | 21 | 5 (options3 + paired API projection1 + UI projection1) |
| Options endpoint incl. middleware | 16 | 7 |
| Whole TopBar switch DB reads from both former requests | 37 | 5 |

The previous backend worker notes describe the bounded pre-integration step (21→8), before root shared its runtime options with middleware (8→5). Their interface-unchanged statement belongs to that step; the final internal handoff is recorded above. Counts assume initialized catalogs, successful options and ordinary scoped DI; failure/retry paths differ. Response size, SQL plan, network and browser rendering can still dominate latency. No timing claim or guaranteed duration is made.

Changed application files:
- Frontend src/app/modules/i18n/translation.service.ts
- Frontend src/app/modules/UserGuide/content/languages-topic.ts — bilingual TopBar/load/retry guidance; existing /UserGuide/administration route/menu retained
- Backend SiGma.Business/Services/Localization/LocalizationService.cs
- Backend SiGma.Business/IServices/ILocalizationService.cs
- Backend SiGma.ServerAPI/Middleware/DatabaseLocalizationMiddleware.cs

Repositories inspected separately: F:/My Work/Sigma/SiGmaAngularFrontEnd and F:/My Work/Sigma/SigmaBackend. Frontend complete scoped Git diff reviewed. Backend files are existing untracked feature files; complete contents reviewed directly, worker runtime delta reviewed against its pre-edit snapshot and root interface/middleware integration reviewed in full. Preserve all earlier Languages/Users/Roles and shared changes. Source parser parsed24 TypeScript files and6 Angular templates without syntax errors; scoped whitespace review passed. This is not type checking, EF SQL translation validation or runtime/browser acceptance.

UI23 and BE5 guidance plus skill digest/revision row updated. All eight packets regenerated; PHASE05/06 provenance, unchanged reference roles and request/tenant/freshness/failure gates semantically reconciled against the updated books. Subsequent generator -Check green.

Owner verification: rebuild/restart backend and allow frontend rebuild; switch EN→AR→EN from TopBar and compare Network timings, expecting only Localization/Runtime per ordinary switch. Re-select stable active language (no request), switch back during an in-flight read (latest selection wins), simulate failed load then Retry (catalog + runtime reread), save/reset text and verify refreshed values, switch tenant/logout and verify no retained custom texts. Verify default/custom RTL options and missing-catalog failure. Exact live SQL/timing and visual acceptance pending. No migration required.

Agent utilization: one inherited-model backend worker owned only LocalizationService.cs and notes, reducing wall-clock time while root owned frontend/docs and later interface/middleware integration. No overlapping implementation ownership. No builds/tests/lint/browser/DB/migrations/commits/pushes/deployments run. Suggested commits: frontend `perf(i18n): remove redundant TopBar language reads`; backend `perf(localization): share request options and batch API dictionaries`.
