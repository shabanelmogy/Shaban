# Languages and database localization — implementation review

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Decision date | 2026-10-17 |
| Frozen contract | LANGUAGES_DATABASE_CONTRACT_FREEZE.md |

## Manifest and decisions

The user requested review and implementation of Administration/Languages from
canonical documents and screenshots, then explicitly approved the prior complete
maintenance plan D1–D8. The historical 2026-10-14 plan-and-wait gate is superseded
by that approval. This review owns phases00–06, source implementation and its
in-app guide. Runtime/database/visual acceptance remains owner work.

UI type01 lists with controlled modal editors; no totals, accounting posting or
child aggregate. Approved list reference Workshop/Job/components/list, shared
FeatureTitle/FilterPanel/DataTable; editor shared EditorDialog. Backend normal
Language entity plus BE16 default setting through IServiceHelper; catalog texts
are keyed settings with composite reads and optimistic concurrency. Baseline
data is global source-owned; customization is tenant-owned. No new permissions
system is introduced. Existing user changes in Roles/Users/authorization, shared
presentation, dictionaries, DbContext and registrations are preserved.

## Current screenshot evidence

All seven attachments are English/LTR desktop. Role, capture date and source
version are Unknown. They provide functional/content evidence, never Sigma
presentation authority. Screenshot filenames in the older plan were mismatched;
the current evidence below corrects them explicitly.

| E1 — 1.PNG evidence | Classification | Phase | Representation |
|---|---|---|---|
| Languages Name/Code/Default*/Creation Time, flag, Create, Actions; note protects built-ins | Explicit | 01–04 | Separate culture code, built-in/default flags, shared list/editor and server guards |

| E2 — 2.PNG evidence | Classification | Phase | Representation |
|---|---|---|---|
| Change texts and Set as default language in row menu | Explicit | 03–05 | Text route with selected target, versioned tenant default action |

| E3 — 3.PNG evidence | Classification | Phase | Representation |
|---|---|---|---|
| Key/Base Value/Target Value/Edit, search, Refresh, paging | Explicit | 02–03 | Shared DataTable, applied search snapshot, server count and controlled editor |

| E4 — 4.PNG evidence | Classification | Phase | Representation |
|---|---|---|---|
| Searchable Base language selector | Explicit | 02 | Shared options source; en default |

| E5 — 5.PNG evidence | Classification | Phase | Representation |
|---|---|---|---|
| Searchable Target language selector | Explicit | 02 | Same resolved active language identities, target from selected row |

| E6 — 6.PNG evidence | Classification | Phase | Representation |
|---|---|---|---|
| Source selector with searchable options | Explicit | 01–02 | Real Sigma.UI/GeneralMessages/MockDataMessages sources; external ABP names are not invented |

| E7 — 7.PNG evidence | Classification | Phase | Representation |
|---|---|---|---|
| Target value All / Empty ones | Explicit | 01–02 | Direct target values before fallback; whitespace/absent values are empty |

Previous/Save-and-Next, override reset, runtime UI and API-message integration are
authorized by the approved written plan. Current screenshots do not prove those
controls. Built-in protection is explicitly approved in D4. No Albanian or other
missing translations are fabricated.

## Initial findings and conformance targets

The previous Language list kept dense multi-statement methods, blocked accepted
Delete with its own pending-confirmation flag, dropped page requests while
loading, used date instead of the frozen dateTime, and captured export headings
without capturing translated status values. The existing frontend API exposed
none of the approved database-localization functionality.

| Concern | Canonical owner / source | Required final evidence |
|---|---|---|
| Host/title/grid | UI1/3/5/6; Job list, shared DataTable | Container-fill chain, title inside card, Actions first, rows scroll/pager fixed |
| Filter/read cancellation | UI4/22/28; Job bindListQueries | Typed applied filters; switchMap/defer; latest page replaces pending read |
| Export | UI8; fetchAllPages/dataTableExportRows | Complete filtered rows and click-time heading/status translations |
| Modal/dirty close | UI10/13/19; EditorDialog/Confirmation/FieldError | Save validation, failure retains draft, Cancel/X/Escape/route unified |
| Extra workflow actions | UI13/24; EditorDialog | Optional typed footer actions, shared secondary styling, empty compatibility default |
| Dictionary | UI23; TranslationService | Original snapshots and DB resolved maps, safe keys, scope and stale-response isolation |
| Backend writes | BE8/13/16 | Tenant ownership, uniqueness, default/built-in guards, versioned scalar writes |
| Runtime resources | approved plan S6 | Async request snapshot, stable keys, resource fallback |
| Guide | Master7; existing Administration reader | Updated bilingual Languages topic and operational routes |

## Documentation synchronization

The optional shared EditorDialog workflow-footer contract was recorded in
UI13/UI24 and the skill section7 with a revision-history row. The generator
refreshed all eight phase/plan packet outputs; `-Check` passed all eight.
Semantic review of Phase03 confirms the same controlled modal owner and public
footer extension; no reference role or phase dependency was replaced. Other
packets only acquired refreshed canonical fingerprints/dependent excerpts.

## Import evidence

Source-only AST/XML extraction initially produced37,431 values, version
435983215615b6a85b4eaffd9eca7a62abd71d52cf63b29faed34e97e42b34fa,
before newly authored UI/runtime translations. This is draft extraction evidence;
the final release catalog must be regenerated after dictionaries settle. Source
extraction preserves existing literal sentence/dotted keys, rejects prototype
paths, duplicate flattened identities, unsupported expressions/markup/lengths,
and does not execute application code. No database import was run.

## Integration and final reconciliation

All source slices S1–S7 are implemented. S8 activation remains owner migration,
catalog import, build and acceptance. No unresolved business/API contract blocks
the source handoff. Known existing translation debt and deployment prerequisites
are distinct from runtime acceptance, which is pending.

| Path / contract | Final source comparison | Result |
|---|---|---|
| Languages grid ↔ ListVM | Actions → flag,languageName,cultureCode,isBuiltIn,isDefault,createdBy,isActive,createdAt(dateTime); backend adds only id action target to those fields | Matched; null virtual audit values stay empty |
| Text grid ↔ ListVM | Actions → key,baseValue,targetValue; version/hasOverride/needsReview are action state only | Matched; direct values never masked by fallback |
| Language filter | Angular languageName → Filters[languageName], sortField/order via toListParams; backend composite read counts/sorts before paging and preserves unpaged compatibility | Matched; size choices10/15/20/50/100 |
| Text filters | baseLanguageCode,targetLanguageCode,source,search,targetState,pageNo,pageSize,sortField,sortOrder → same top-level query members | Matched; required base/target/source, search≤256, all/empty, key tie break, count before slicing |
| Text navigation | Keys endpoint projects≤50000 identities; fixed session array; detail reads one key | Matched across paging and rows leaving Empty after Save |
| Definition editor ↔ writes | languageName≤250,flag≤100,cultureCode≤32; Update adds id, no tenant/audit | Matched; editable shared name dropdown supports cultures outside historic catalog |
| Text editor ↔ writes | targetLanguageCode/source/key/value≤4000/expectedVersion; key and base read-only | Matched; exact value whitespace preserved, plain text/full normalized placeholders validated |
| Save/detail consistency | Save builds response from saved tracked row/version within its transaction, then returns after commit; detail contract/text use one projection | Repaired during final audit; no post-commit detail read masquerades as failed Save |
| Runtime consistency | ResolveSourceAsync uses one catalog/override/baseline projection instead of combining separate text reads; settings/default chosen once | Repaired during final audit; SQL behavior still owner acceptance |
| Concurrency | rowversion compare, unique indexes, shared tenant Language unique-write boundary; held key row prevents contract change between validation/insertion | Matched source;409 retains draft and requires reload |
| Reset | confirmed DELETE one identity/version; soft-delete override only, baseline/key retained | Matched; committed state retries refresh only |
| Default | typed versioned save through IServiceHelper, one tenant row; personal preference takes precedence | Matched; no read creates settings |
| Built-ins / old data | virtual stable ids-1..-7 protected, seven shipped cultures; all49 exact historic names can resolve on read; duplicate/unknown old rows remain visible | Matched; no automatic persisted backfill/merge/delete |
| Mutation feedback | LanguageService suppresses interceptor success/error where feature owns inline outcome; declared/HTTP failure handled; successful persistence distinguished from refresh failure | Matched; one feedback owner |
| UI runtime | source snapshots + authenticated tenant/user preference/options/default → resolved dictionary; switchMap cancels older requests; logout restores originals | Matched source; no token in preference key, only one active DB snapshot |
| API messages | scoped RequestLocalizationSnapshot, closed General/Mock adapters, resource factory fallback; request localization → auth → async snapshot → authorization | Matched; no sync DB lookup per message or singleton tenant dictionary |
| Resource consumers |63 files pass nameof identities instead of translated generated-resource values;258 changed source lines | Worker normalization audit:61 otherwise exactly base, Role/User retain existing authorization edits |
| Routes / title / guide | /Language and /Language/texts have canDeactivate; toolbar suppresses duplicate title for both; existing Administration guide/menu topic updated in EN/AR | Matched source; no extra guide reader/menu |
| Shared footer | optional typed actions/default[], wrapping min-width0/end +8px gap; global body-overlay RTL chevrons | Matched source; existing consumers preserve default actions |

### Action-state contract and reference coverage

| Action | State / endpoint / payload | UI/failure/refresh |
|---|---|---|
| Create | POST Language {languageName,flag,cultureCode}; code valid/unique | shared modal; failure retains draft; success commits then refreshes runtime/list |
| View/Edit | GET Language/GetById/{id}; PUT Language adds id; built-in only View; used identity cannot change | same controlled modal; dirty-discard; backend rechecks state |
| Delete | live persisted custom row; DELETE Language?id; reject built-in/default/used/referenced | record confirmation; accepted own flag released; applied page recovers if last row disappears |
| Set default | active resolved culture; PUT Language/Default {cultureCode,expectedVersion} | named confirmation; source version conflict shown; runtime/list refresh without repeating write |
| Change texts | active resolved culture; /Language/texts?targetLanguageCode | applies target identity from source; no fabricated translation |
| Save text | PUT LanguageText; validated known key/source/target/version | Save&Close or Save&Next only after success; refresh failure retains committed marker and Retry |
| Previous | stable session index>0 | no implicit save; shared discard when dirty |
| Reset customization | DELETE LanguageText/Override identity+expectedVersion | explicit confirmation and independent mutation freeze; restore baseline after runtime/detail refresh |

Approved Job reference Create/View/Edit/Delete/search/reset/paging/refresh/export
are Supported through the existing shared owners. Job financial, labour,
close/cancel/quality/gate-pass/invoice/estimation actions are Not Applicable:
Language owns no such aggregate. Old inherited batch/active entry points reject
because they cannot express the versioned identity contracts. No permission API
is invented; authenticated endpoints retain the existing access pipeline and
unrelated authorization work remains untouched.

### Backend override, mapping and calculation decisions

LanguageService composite GetMany/GetManyWithNavigations/GetAllWithNavigations,
Detail/DetailWithNavigations/Select override because virtual built-ins cannot be
mapped from one entity query. Add overrides culture uniqueness then delegates
base; Update validates and edits the tracked scalars to preserve legacy and
inactive state; Remove protects identity use then reuses reference-aware delete.
AddList/UpdateList/HandleActive reject bypasses. New catalog services are explicit
composite services rather than unnecessary generic CRUD overrides.

Four one-way Language maps replace ReverseMap; LanguageSettings read and
LanguageDefaultVM→DefaultLanguageCode maps support IServiceHelper. No unrelated
map changes, calculated financial values, domain totals or accounting effects.
Settings and ordinary writes save once; owner import's multi-boundary global
publish is explicitly transactional. New global catalog types intentionally
avoid the existing global base's unexpected tenant/audit fields.

### Schema and migration handoff

Owner command: `Add-Migration AddDatabaseLocalizationCatalogAndOverrides`.
No migration with that name was found in the scoped migration filename check.
The agent created/ran no migration and edited no snapshot.

Schema changes: nullable Language.CultureCode(max32), filtered unique
SubscriptionId+CultureCode; new global LocalizationKey(source64,key256 binary
collation,catalogVersion64,placeholderContract4000,retired) and
LocalizationBaseline(keyId,languageCode32,value4000,sourceRevision64); tenant
LanguageTextOverride(keyId,languageCode32,value4000,rowversion,needsReview) and
LanguageSettings(defaultLanguageCode32,rowversion), with unique keys and explicit
restrict relationships. Inherited tenant/audit/soft-delete fields retain their
existing owner. Existing LanguageName/Flag storage is not narrowed; new write
limits250/100 are a documented legacy compatibility exception. No removed column,
required old-column backfill or old-data deletion.

Before applying the migration, owner checks legacy culture duplicates/nulls and
known-name mappings, existing values and actual destination configuration. Apply
reviewed migration, import the exact release catalog via the explicit CLI, then
accept the APIs/UI. The current DbContext has its own OnConfiguring SQL setting;
the operator must verify the actual destination rather than assuming only
appsettings selects it. No connection string or secret is copied into artifacts.

### Final source catalog

Generated `LanguageLocalization/catalog.json`:37,563 values, version
`2727cfd7ffc78665186aaf0b086cda824ff45d06ce619bd4b82b108f184c834f`.
Exporter and independent Node source audit agree on the framed hash. Source
parser validated dictionary extraction and touched EN/AR parity; imported new
vocabulary objects are resolved through AST. The canonical line-based translation
checker reports29 language keys per locale with zero missing/case differences;
the AST/catalog audit additionally covers imported languageManagement/runtime
keys and every used feature key. Existing95 identities without English are
preserved; runtime ends at key when no fallback source exists. Import was not run.

### User guide and responsive handoff

Content: `src/app/modules/UserGuide/content/languages-topic.ts`; existing
`administration-guide.ts` imports LANGUAGES_TOPIC; reader route/menu remains
`/UserGuide/administration` under Administration. Topic route `/Language`, with
actual text workflow `/Language/texts`. EN/AR covers prerequisites, definitions,
flags/codes, built-in/default distinction, filter/reset/paging/Excel, direct-empty
vs fallback, text editor navigation, placeholder/length/plain-text limits,
conflict/reload/reset, dirty exits and saved-but-refresh-failed recovery.

| Width/height interval | Source arrangement | Owner visual acceptance |
|---|---|---|
| >1250px | Text filters5tracks; list search1track; fixed title/filter/pager, table rows own scroll | Pending |
| 1250..1200px | Shared filter3tracks; actions wrap; same logical edges | Pending at1251/1250/1201/1200 |
| <1200px through721px | Shared filter disclosure initially expanded; retained controls and3tracks; FeatureTitle wraps actions≤650px | Pending at1199/1000/768/721 |
| ≤720px | Shared filters1track, action toolbar stacks/wraps; grid internal horizontal/vertical bounds | Pending at720/650/480/320 |
| Dialog1099/767/620 boundaries | Existing shared shell responsive width; padded body scroll, fixed wrapping footer; global RTL chevrons | Pending on both sides of each breakpoint |
| Short heights, long EN/AR values, RTL/dark | Container-fill shell, one form/table body scroll owner, body-appended overlays | Pending; source review is not a visual pass |

### Files, verification and agent utilization

Exact bounded source inventory: `LanguageLocalization/source-scope.json` (33
frontend paths,113 backend paths; includes directly inspected unchanged helpers
and pre-existing shared-file content). Scoped tracked patches captured separately
in `frontend-scoped.diff` and `backend-scoped.diff`; new source files were read
directly. Existing unrelated changes were preserved; stage only task-owned hunks
in mixed files such as dictionaries, styles, registration and Role/User consumers.
No application reference module was modified.

Source verification: TypeScript syntax parsed24 files and Angular template syntax
parsed6 templates; no compilation/type-check claim. Scoped path/import/public
input/route/translation/error/mapper comparisons, merge-marker scan and Git
whitespace checks passed in each actual repository. Existing backend CRLF uses
per-command core.whitespace=cr-at-eol; no persistent Git configuration changed.
Packet regeneration/check passed all eight; Phase03/05 dependencies retain their
approved modal/runtime roles after UI13/24/25 and BE3 updates.

Three inherited-model sol_worker workstreams owned disjoint backend, Angular UI,
and runtime files after root contract freeze. Root owned extraction, registration,
shared documentation, integration and final audit; final independent backend
read audit exposed post-commit/detail/runtime consistency repairs now applied.
Parallelism reduced sequential storage/UI/runtime time; temporary interrupted
worker turns resumed against saved source. No model override or uncontrolled
agent edits were used.

No build, test, lint, database command, migration, browser automation, application
runtime, Graphify, Sigma MCP, commit, push or deployment was run. Compilation,
SQL translation/locking, DI, tenant isolation, imported catalog behavior,
request-time snapshot cost, responsive/RTL/theme/keyboard and actual runtime
messages remain owner verification. Owner should exercise the worker acceptance
matrices after migration/import, including two-user409 and saved-but-refresh
failure recovery. No source-only claim establishes deployed readiness.

Suggested commits (suggest only, never executed):

```text
SiGmaAngularFrontEnd:
feat(languages): add text management and database translation runtime

SigmaBackend:
feat(localization): add tenant overrides and source catalog runtime

Documentation layer:
docs(languages): reconcile localization contracts and shared guidance
```

## Owner compiler feedback follow-up — 2026-10-17

Owner supplied CS1929 at OpeningBalanceResetService.cs:61 and dependent ServerAPI
CS0234/CS0246 diagnostics. The previous resource-consumer audit missed an invalid
conversion: `nameof(GeneralMessage.ResourceManager).GetString(...)` treats a
ResourceManager receiver as a string. Restored the original
`GeneralMessage.ResourceManager.GetString(...)` expression and the file's original
encoding; this service now has no task diff against Git base. Its accounting and
reset behavior is unchanged. This corrects the earlier claim that every one of
the63 inspected files contained a valid key-only conversion.

Re-audited all63 recorded consumer paths: no nameof(ResourceManager/Culture) or
nameof(...).member receiver remains, and every converted GeneralMessage symbol
matches an actual generated string property. Authorization interfaces,
ILocalizationService and Services.Localization declarations exist in the source;
Business uses SDK implicit compilation and ServerAPI retains its ProjectReference
to Business. No source exclusion or missing contract was found. Downstream
diagnostics are consistent with Business failing to update its reference assembly;
this is a source-supported diagnosis, not a confirmed successful rebuild.

Applied a bounded Phase05/06 compiler repair only. No frontend/API/payload/map/
schema/domain-calculation/user-guide behavior changed and no migration is needed
for this follow-up (the original localization migration remains pending). No
subagent was used because the fix is small and sequential. Complete repair diff
review and whitespace checks passed; no build, test, lint, database or other
prohibited command was run. Owner should rebuild Business, then ServerAPI and
review remaining diagnostics. Suggested follow-up commit:
`fix(localization): preserve resource manager lookup receivers`.

The reusable receiver/member-type rule was promoted to BE5 and the skill with a
revision row. All eight packets were regenerated and `-Check` passed. Semantic
review retains BE5's existing localizer/key contract and per-layer ownership;
the added rule prevents a text-only conversion from changing receiver types.
