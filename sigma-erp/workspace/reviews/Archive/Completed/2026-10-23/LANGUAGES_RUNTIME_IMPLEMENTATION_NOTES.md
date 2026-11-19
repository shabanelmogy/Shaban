# Languages runtime implementation notes — 2026-10-17

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

The runtime work follows the approved D1–D8 maintenance plan and LANGUAGES_DATABASE_CONTRACT_FREEZE.md. This is the Phase 5 worker handoff; root owns complete Phase 6 reconciliation. No build, test, lint, browser, database, migration, snapshot, commit, push or deployment was run.

## Source changes and behavior

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

- `src/app/modules/i18n/translation.service.ts`: retains cloned original dictionaries; authenticated tenant/user scoped preference; options/default resolution; cancellable switchMap reads; typed runtime Result; revision required before apply; replacement from originals instead of incremental merge; one active DB snapshot only; same-session failure retains last good text with observable false outcome; logout clears tenant content and restores originals. `refreshRuntime(): Observable<boolean>` starts immediately and replays its result, including false on cancellation. No failed-response cache or token storage key is introduced.
- `src/app/_metronic/layout/layout.component.ts`: starts runtime from authenticated user subscription/id, reacts to session changes, stops on shell destruction; existing router subscription now joins shell teardown.
- `src/app/modules/auth/services/auth.service.ts`: logout clears the current-user subject immediately so the shell cancels dictionary reads and restores source text before navigation.
- `src/app/_metronic/layout/components/header/navbar/navbar.component.ts/.html`: consumes dynamic options and active language, supports retry/loading feedback and language metadata, uses the existing flagCountryCode helper with text fallback rather than treating stored flag values as URLs.
- `src/app/modules/shared/interceptores/api-request.ts`: preserves selected syntactically valid catalog culture in Accept-Language; server remains the authority for tenant language eligibility. The interceptor performs no localization HTTP requests.
- `src/app/modules/i18n/vocabs/localization-runtime.ts`: paired EN/AR runtime labels; root integrates them in the existing dictionaries.

Backend repository: `F:/My Work/Sigma/SigmaBackend`.

- `SiGma.ServerAPI/Localization/RequestLocalizationSnapshot.cs`: scoped per-request General/Mock dictionaries, published only after both async source reads succeed.
- `SiGma.ServerAPI/Localization/RequestDictionaryLocalizer.cs`: closed typed registrations for GeneralMessage and MockDataMessage only; synchronous dictionary lookup, resource factory fallback, formatting fallback, and neutral ar to ar-SA resource compatibility. There is no synchronous DB lookup or tenant singleton.
- `SiGma.ServerAPI/Middleware/DatabaseLocalizationMiddleware.cs`: prepares snapshots after authentication, validates Accept-Language against active tenant options, normalizes existing en-US/ar-SA aliases through LocalizationRules, sets request-only culture and performs sequential async reads on the scoped context. Missing schema/catalog or options failures fall back to resources. Request cancellation propagates.
- 63 direct GeneralMessage consumers now pass resource key identities through nameof instead of translated Designer values. The exact file inventory is `LANGUAGES_RUNTIME_RESOURCE_CONSUMERS.txt`. Active direct resource property accesses in the scoped services/API were checked; no remaining non-nameof lookup arguments were found. MockDataService/ApiKeySetting already consume stable literal keys and needed no edits. Generated Designer and resx files were not edited by this worker.

Root integrated explicit scoped localizer registrations after AddLocalization and ordered request localization → authentication → DB snapshot middleware → authorization. The factory remains the resource localizer factory, avoiding recursive database localization during snapshot preparation.

## Conformance evidence

| Concern | Owning reference | Final source evidence |
|---|---|---|
| Root client and lifecycle | UI1/22/28, Phase05; AppModule provideHttpClient, existing Layout/Auth | Runtime uses injected root HttpClient and LanguageService, existing token/error chain; inline requests suppress duplicate error display; shell teardown and switchMap cancel reads. |
| Original/fallback dictionary | UI23; original TranslationService and AppComponent vocabulary registration | Original snapshots never receive DB writes; English remains fallback; every successful dictionary replaces its language; logout restores originals. |
| Literal keys and group reads | Installed ngx-translate/core/lib/translate.parser.ts getValue | Source property paths preserve keys with literal dots/ellipsis, including Search menu..., while retaining nested object groups. Unknown new catalog keys use safe nested paths with terminal literal ellipsis handling. Unsafe prototype path segments rejected. |
| Direction | UI25 plus approved runtime contract | Shared TranslationService applies language metadata to html/body and existing RTL stylesheet; no feature direction owner. |
| API resource keys | BE5/18; Service.LocalizeMessage, resource consumers | nameof identities now reach scoped adapters; no reverse display-text lookup. |
| Tenant and request boundary | BE18; existing scoped Language/Localization services and authenticated pipeline | Middleware resolves server tenant services after authentication; snapshot is scoped; no tenant claim or payload rewriting. |

## Source-only audit

Frontend scoped diff reviewed separately from backend. Backend consumer audit normalized only the new nameof wrappers: 61 files otherwise exactly match their Git base; RoleService.cs and UserService.cs retain existing user authorization changes. There are 258 changed source lines containing GeneralMessage key identities across the 63 files (some lines contain two arguments). The complete direct consumer list is recorded separately.

Scoped whitespace checks passed for frontend. Backend consumer check passes with per-command `core.whitespace=cr-at-eol` for the existing CRLF source convention. DeliveryMovementService.cs is already tracked with literal CRLF; ordinary diff --check treats the CR of its two changed lines as trailing whitespace, so its original file convention was preserved instead of rewriting all 284 lines. No persistent Git setting changed.

No runtime/visual acceptance is claimed. No AutoMapper, domain calculation, API transport shape, permission or schema change was introduced by this runtime slice. Migration and catalog import requirements belong to the backend storage/root handoff.

## Owner verification pending

- Apply the approved migration/catalog import, compile both repositories, and verify startup DI.
- Change an existing UI translation, save, and verify current text refresh; force runtime read failure after successful Save, then Retry without resaving.
- Switch languages rapidly and sign out/in to a different tenant/user while a read is pending; confirm no stale dictionary applies and personal preferences remain correctly scoped.
- Check tenant default with no personal preference; custom RTL culture; literal ellipsis keys and nested group reads; built-in/emoji/ISO flags; narrow, RTL and dark header presentation.
- Override a GeneralMessage actually used by generic Service and a MockDataMessage, then verify request culture and resource fallback with unavailable catalog/schema. Verify ar and ar-SA requests both retain Arabic resource fallback.
- Assess request-time snapshot cost under representative traffic; this implementation intentionally uses request-scoped reads rather than an unbounded tenant cache.
