# Languages database localization contract — 2026-10-17

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

## Authorization and manifest

The owner explicitly approved the complete existing maintenance plan and D1–D8 on 2026-10-17: «نعم، اعتمد الخطة كاملة ونفذها». This supersedes the historical plan-and-wait gate, without rewriting that history. Scope includes Languages, database text management, UI/API runtime consumers, safe catalog extraction/import, and bilingual Administration guide. No migration, database command, build, test, lint, browser, commit or deployment is authorized.

UI shape 01: Job list shell/FilterPanel/DataTable, controlled shared EditorDialog. Language definitions use normal entity pattern BE13; default settings use BE16/IServiceHelper; text catalog uses a dedicated composite read and versioned keyed writes. No financial calculations. Existing unrelated Roles/Users/authorization, shared presentation, dictionaries, DbContext and registration edits must be preserved. All phases00–06 apply; source-only acceptance remains pending. Recipe check passed all eight packets 2026-10-17.

## Evidence correction

The older plan's screenshot filenames were mismatched. Current attachments supersede that metadata:1.PNG list,2.PNG list action menu,3.PNG text grid/search,4.PNG base dropdown,5.PNG target dropdown,6.PNG source dropdown,7.PNG all/empty dropdown. English/LTR desktop; role/version/capture date Unknown. Each is Explicit for its visible content only. Editor Previous/Save-and-Next, reset override, DB runtime and API message scope come from the now-approved plan, not current screenshots. No screenshot-specific ABP source names or Albanian translations will be fabricated.

## Frozen transport (JSON camelCase; existing Result/Results wrappers)

- `GET Language` retains list query `pageNo/pageSize/Filters[languageName|sortField|sortOrder]`. Composite built-in+tenant rows: `id:number, languageName:string|null, flag:string|null, cultureCode:string|null, isBuiltIn:boolean, isDefault:boolean, isActive:boolean|null, createdBy:string|null, createdAt:string|null`. Built-in catalog IDs -1..-7 in order en/ar/zh/es/ja/de/fr are stable virtual identities; no persisted fake dates/creators. Existing exact known legacy names may resolve read-only to a catalog code; ambiguous/unknown rows remain visible, no automatic rewrite/merge. Built-in definition locks are now owner approved. No unique constraint on unresolved old name/flag fields.
- `GET Language/GetById/{id}`: `id,languageName,flag,cultureCode,isBuiltIn`. POST `{languageName,flag,cultureCode}`, PUT same plus `id`; fields-only input. A valid culture required for new rows; language code immutable after texts/default usage. Existing inactive state retained. DELETE existing route; reject built-ins, default, used translation identity and references. Batch/alternate inherited mutations must not bypass validation.
- `GET Language/Options`: `Result<{languages: LanguageOption[], sources:string[], defaultLanguageCode:string, settingsVersion:string|null}>`; option `{id,cultureCode,languageName,flag,isBuiltIn,isDefault,isRightToLeft,isActive}`. Only resolved active unique identities selectable. Sources exactly `Sigma.UI`, `Sigma.API.GeneralMessages`, `Sigma.API.MockDataMessages`. Defaults en and Sigma.UI. `PUT Language/Default` `{cultureCode,expectedVersion:string|null}` returns Result; unique tenant setting and optimistic concurrency.
- `GET LanguageText`: top-level `baseLanguageCode,targetLanguageCode,source,search?,targetState=all|empty,pageNo,pageSize,sortField=key|baseValue|targetValue,sortOrder=1|-1`. Returns Results of `{key,baseValue:string|null,targetValue:string|null,version:string|null,hasOverride:boolean,needsReview:boolean}`. Direct values only (explicit empty override suppresses baseline for management); runtime empty falls through. Count before slicing, page size1–100, key tie break. Source/target identity carried by applied query, never inferred from displayed labels.
- `GET LanguageText/Keys`: same applied filters/order; Result<string[]> of identities only, max50000; reject overflow rather than truncate. Editor freezes these keys once per open session; no full-text download. This bounded identity snapshot keeps navigation stable after saved empty rows leave the filter.
- `GET LanguageText/Detail`: baseLanguageCode,targetLanguageCode,source,key. Result of list row plus `{source,placeholders:string[]}`. PUT `LanguageText`: `{targetLanguageCode,source,key,value,expectedVersion:string|null}`; Result of saved detail (base defaults en; editor reloads its own base). DELETE `LanguageText/Override`: same identity query plus expectedVersion; resets one override only. Conflict409; no blind overwrite. Limits source64/key256/code32/value4000. Reject unsafe dictionary paths/markup/malformed or changed placeholder sets except wholly empty value. Empty saves are explicit missing direct values. Version is opaque token, null means no override.
- `GET Localization/Runtime?languageCode=...`: `Result<{languageCode,isRightToLeft:boolean,revision:string,values:Record<string,string>}>`, resolved flat Sigma.UI key map. Resolution nonblank selected override→selected baseline→default override/baseline→English baseline→key. Needs-review override skipped. DB not initialized is an actionable failure, never an empty successful dictionary.

## Persistence and import

New global `LocalizationKey` (id/source/key/catalogVersion/placeholderContract/isRetired) and `LocalizationBaseline` (keyId/languageCode/value/sourceRevision), tenant `LanguageTextOverride` (languageCode/keyId/value/version/needsReview), tenant `LanguageSettings` (defaultLanguageCode/version) plus nullable Language.CultureCode. Enforce unique composite keys and row-version concurrency; keep tenant context server owned. Direct source import is owner-only CLI mode, never GET or public import API. Root produces JSON `{version,entries:[{source,key,languageCode,value}]}` by AST/XML; importer atomically upserts keys/baselines, retires missing keys, flags incompatible overrides, never deletes or rewrites overrides/legacy languages. Reject invalid/partial catalogs. Root owns extraction script/registration/CLI entry; backend worker owns importer class. Migration suggested `AddDatabaseLocalizationCatalogAndOverrides`, after duplicate/legacy review; no migration generated.

## Runtime and feedback

TranslationService retains original dictionaries; authenticated Layout starts/stops a tenant/user session, scoped preference wins over tenant default. Runtime switching cancels stale responses, replaces snapshots, supports direction metadata and dynamic Navbar options. Logout restores source dictionaries and clears session state. Runtime reload API is `refreshRuntime(): Observable<boolean>`; false retains same-session last good/file fallback with visible Retry. LanguageService/options types shared with UI. Mutations refresh runtime without repeating a committed Save; explicitly distinguish stored-but-refresh-failed. Frontend composite mutation suppresses success toast; use one inline outcome. API request snapshot supplies General/Mock localizers after authentication with resource fallback, no synchronous DB reads or singleton tenant dictionary. Stable resource keys replace direct translated-value lookup calls in scoped consumers.

## Conformance and action coverage

| Concern | Book/reference/shared owner | Frozen target |
|---|---|---|
| List | UI1/3/5/6, Job list FeatureTitle/DataTable | sigma-route-host/list-page/panel/header/table, fill true, Actions first |
| Filter/read | UI4/22/28, Job bindListQueries/FilterPanel | typed applied snapshot, stableLayout, Reset, switchMap/defer, latest page replaces loading read |
| Export | UI8, fetchAllPages/dataTableExportRows | complete rows, click-time headings and status translations, dateTime |
| Editor | UI10/13/19, EditorDialog/FieldError | padded controlled shell, fixed footer, key subtitle, dirty guards; optional shared secondary footer actions |
| New shared footer | UI13/24 | optional typed actions preserving existing consumers; root promotes reusable rule to book/skill |
| Grid/VM | Master4/BE7 | Languages Actions,flag,name,cultureCode,built-in,default,creator,active,creation time; VM fields exactly above. Text Actions,key,baseValue,targetValue; version/hasOverride/needsReview action state only |
| Actions | UI7/9 | Create/View/Edit/Delete retained; Change texts/Set default/builtin locks added. Job-specific financial/actions N/A because no Job aggregate |
| Guide | Master7 existing Administration topic | update languages-topic.ts; same /UserGuide/administration entry; /Language and /Language/texts routes |

Root owns integration, initial/final artifact reconciliation, shared registrations, extraction, and full scoped-diff review. Workers receive exclusive files after this freeze. Historical frontend-only freeze is superseded only for the explicitly expanded contracts above.

## Source-supported refinements — 2026-10-17
Initial source extraction found95 existing UI identities without an English baseline, zero malformed placeholder values and zero cross-language token-set mismatches. Import accepts the actual source corpus: English owns token contract when present, otherwise the first real baseline in ordinal language order; it never fabricates English. Runtime still ends at key when English is unavailable. Catalog integrity framing supersedes the initial generic version wording: SHA256 of ordinal source/key/languageCode ordered entries; each source/key/languageCode/value field is UTF8 preceded by its4-byte big-endian byte length. Placeholder contracts retain normalized full token syntax so {{name}} and {name} are distinct. These refine validation without changing transport shapes or owner D1–D8.


Reviewer decision under owner standing rule: the existing shared name dropdown accepts a typed label as well as known catalog choices, because valid new cultures (e.g. screenshot Albanian/sq) need a name absent from the historic49-item catalog. Installed PrimeNG editable input/CVA emits the same string. Required/max250 and backend culture/uniqueness rules remain. The backend read-only legacy name mapper now covers all49 exact historic catalog names, plus existing Chinese/Arabic aliases; unknown labels stay unresolved and no stored language is rewritten by a read.

