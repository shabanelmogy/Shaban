| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | LocalizationService.cs runtime reads for TopBar switch latency |

The frozen repair is `TOPBAR_LANGUAGE_SWITCH_PERFORMANCE.md`. BE5/18, the required skill's backend/runtime sections, PHASE05 and existing `ILocalizationService`, `DatabaseLocalizationMiddleware`, `RequestLocalizationSnapshot`, `LanguageService.GetOptionsAsync` and DI scan were inspected. Recipe `-Check` reports all eight packets current. The service is registered by the existing Business assembly scan with scoped lifetime; no registration was changed.

## Changes and conformance

Only `SiGma.Business/Services/Localization/LocalizationService.cs` changed in application source. A successful runtime-only `LanguageOptionsVM` snapshot supplies both selectable cultures and the tenant default for the rest of this scoped service's request. Failed options are not memoized. `ValidIdentityAsync` remains unchanged, so list/detail validation and especially Save/Reset obtain fresh language options even when middleware has already loaded runtime translations.

`ResolveSourceAsync` retains its public signature. For either API source, one anonymous EF projection includes both GeneralMessages and MockDataMessages and all five existing fallback candidates. A per-culture, instance-owned dictionary is populated only when both sources have nonretired rows and the complete pair resolved successfully. The middleware's existing sequential calls and final `snapshot.Apply(general, mock)` remain unchanged; a missing API source still prevents any partial pair from publication. An incomplete source pair throws the same `LocalizationCatalogUnavailable` sentinel. No global/static/distributed/TTL cache exists.

Every Sigma.UI resolution still executes a fresh catalog projection, even when the same service instance is used twice. UI text edits therefore are not hidden by the API pair cache. Its response language/direction/revision/value contract is unchanged.

| Concern | Source comparison | Result |
|---|---|---|
| Tenant scope | `Repository.Query<LanguageTextOverride>(x => !x.NeedsReview)` in both projections | Preserved; no direct unfiltered override access |
| Fallback order | selected override, selected baseline, tenant default override, tenant default baseline, English baseline, then key | Identical; blank values skipped and NeedsReview overrides excluded |
| Retired/missing keys | `!key.IsRetired`, every requested source must have a row | Preserved; pair remains unavailable if either API source is missing |
| SQL boundary | One `ToListAsync(cancellationToken)` over anonymous projection | Preserved; now one request for both API source names |
| Cancellation | Token checked before/after legacy options call and before dictionary return/publication; EF receives the token | No canceled snapshot cached; legacy `GetOptionsAsync` still has no token parameter |
| Context lifecycle | All awaits sequential, no Task.WhenAll/extra scope/context/transaction | Preserved |
| HTTP/DI/schema | Interface/controller/middleware/registration/entities/configuration untouched | No contract, migration or mapping change |

## Source-derived read counts

These are query/materialization counts from current source, not measured SQL traces or timing claims. `GetOptionsAsync` performs three reads: `RowsAsync` language rows plus its settings read, then its own settings read. `GetSettingsAsync` uses the existing helper to execute one `FindSingleAsync` read.

| Successful operation | Before | After |
|---|---:|---:|
| One service instance resolving General + Mock for one culture | 10 reads: two × (3 options + 1 separate settings + 1 projection) | 4: 3 options + 1 combined projection |
| Same pair, including middleware's own initial options load | 13 | 7 |
| Runtime UI endpoint after that middleware pair in the same scoped service | 21 total: 13 middleware + 3 initial UI validation + 5 UI resolve | 8 total: 7 middleware + 1 fresh UI projection |
| Options endpoint including middleware | 16: 13 middleware + 3 endpoint options | 10: 7 middleware + 3 endpoint options |

The scoped service cannot consume the middleware's separate `ILanguageService.GetOptionsAsync` result without changing additional source/interface ownership; one duplicate three-read options load therefore remains explicitly bounded. The root-owned frontend repair removes the ordinary switch's extra Options HTTP request. Actual speedup depends on database latency, query plan, dictionary payload/serialization, browser rendering and request cancellation.

## Verification and remaining acceptance

The file is currently untracked in its real backend repository. Its complete initial content and entire final runtime section were read; the full task delta was reviewed using `git diff --no-index` against a temporary pre-edit snapshot, and `--check` produced no whitespace errors. All untouched management/write code was preserved. Targeted consumer/source inspection confirms unchanged public method signature and scoped DI lifetime, fresh write validation, serial operations, source/culture cache identity and unchanged fallback candidates.

No build, tests, lint, browser/application run, database commands, migrations, commits or pushes were performed. Owner acceptance remains: compile the backend; compare TopBar switch timings and successful query counts; verify EN/AR/custom culture and selected/default/English fallback; Save/Reset then refresh; missing one API source (resource fallback for both), empty UI catalog (existing 503), cancellation, repeated language resolution and cross-tenant/session isolation. EF translation of the source-name array predicate and real SQL plans remain runtime checks. Suggested backend commit: `perf(localization): reuse request options and batch API dictionary reads`.
