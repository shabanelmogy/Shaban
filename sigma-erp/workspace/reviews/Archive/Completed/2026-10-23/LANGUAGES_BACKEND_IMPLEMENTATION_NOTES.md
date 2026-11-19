# Languages backend implementation notes

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Scope is the frozen database localization contract; root owns integration and final reconciliation. Backend worker owns Language, localization persistence/DTO/service/controller and importer only. Existing authorization and shared files remain untouched.

| Concern | Owning block / source reference | Target decision before editing |
|---|---|---|
| Language CRUD | BE1–9/13; BranchService, Service | Inherit generic service; override business validation and composite projections; reject unsupported bulk/active mutation bypasses. |
| Tenant/default settings | BE16; ServiceHelper.UpsertSingleAsync/GetSingleAsync | Use helper once and one save; rowversion plus filtered tenant unique index. |
| Global catalog | Frozen persistence contract / BE1–2 | Explicit global types: existing global base contains tenant/audit fields absent from frozen catalog; no fabricated audit. |
| Text management | Frozen composite read and keyed-write contract / BE7/9 | SQL projection/count/order/page; identity-only bounded Keys snapshot; tenant override repository; optimistic concurrency. |
| Delete | BE8; BranchService.RemoveWithChildrenAsync | Built-in/default/used code guards plus model-driven reference checks. |
| Mapping | BE4; BranchProfiler | Four explicit Language maps; explicit setting write/read maps; no reverse maps. |

Root reported recipe check passed before delegation. Applicable packets01–04 and canonical Master4–5, backend entity/EF/VM/mapping/service/controller/list/validation/settings/edge/backlog were inspected. No commands beyond source/file inspection and edits are authorized.

## Implemented backend slice

- Existing Language entity/config/profile/service/interface/controller and four VMs changed. Nullable CultureCode has a filtered tenant unique index and max32. New/edit input requires LanguageName max250 and Flag max100. Existing name/flag nvarchar(max) storage is deliberately not narrowed before an owner legacy-data audit; this is the explicit compatibility exception to matching VM/EF limits. Four explicit one-way Language maps replace ReverseMap. Detail uses LeanDetailBaseVm; List no longer exposes inherited tenant/GUID/No/valid/changed plumbing.
- Added global LocalizationKey/LocalizationBaseline and tenant LanguageTextOverride/LanguageSettings, each in its own file with sealed EF configuration. Global catalog types deliberately have no tenant/audit inheritance. Existing EntityBaseWithoutSubscription actually declares nullable SubscriptionId and required creator/audit data, incompatible with this frozen source-owned catalog. Tenant types retain EntityBase and normal audit/ownership.
- Added LanguageOptionVM, LanguageOptionsVM, LanguageDefaultVM, LanguageSettingsVM, and Localization folder request/response/catalog VMs. Inputs omit tenant/audit/status. Named composite projection is LanguageTextProjection in its own file.
- LanguageService owns resolved built-in/tenant composition, options, settings read/save and identity guards. Stable virtual IDs -1 through -7 have null creator/date and ISO flags us/sa/cn/es/jp/de/fr. Exact known old names resolve on read only; unknown names remain visible. Built-ins win selectable legacy duplicates; ambiguous custom identities are excluded from options. Explicit en-US/ar-SA aliases resolve to en/ar.
- Language Add validates culture/duplicates and delegates base Add. Update uses a tracked row, VM annotation preflight and base InvalidInputAsync, preserves inactive state, prevents used culture changes and duplicate persisted codes. Legacy renames preserve their resolved identity through an explicit stored culture when needed. Delete checks default/override use then RemoveWithChildrenAsync for model-driven references. Shared unique-write transaction on Language serializes definition/default/text mutations. Inherited batch Add/Update and HandleActive reject rather than bypass those rules.
- Language default reads/writes use IServiceHelper.GetSingleAsync/UpsertSingleAsync; one save, unique tenant row and rowversion compare. Default settings are never inserted by reads.
- LocalizationService provides SQL-projected direct base/target text, SQL search/empty filters, stable sorting with key tie break, Count before Skip/Take, size1–100 and overflow rejection. Keys projects strings only and probes50001 to reject over50000. Explicit empty overrides suppress source baseline in management.
- Versioned save/reset validate selectable target/source/key. Saves reject markup, malformed tokens and changed full normalized token sets, including API format specifiers. Detail.placeholders is full token syntax such as {{name}}, {first}, {0:N2}. A whitespace-only value is allowed as direct missing text. ExpectedVersion null means no existing override. Stale version gives409. Reset soft-deletes only one override.
- ResolveSourceAsync applies nonblank selected override/baseline → tenant default override/baseline → English baseline → key, skipping NeedsReview overrides. Runtime returns direction, resolved map and content revision; absent catalog/database failure returns actionable503 through Runtime. It does not insert or import.

## Public integration points

- ILanguageService: GetOptionsAsync(), SetDefaultAsync(LanguageDefaultVM), GetSettingsAsync().
- ILocalizationService in SiGma.Business.IServices: GetTextsAsync, GetKeysAsync, GetDetailAsync, SaveAsync, ResetAsync, GetRuntimeAsync; ResolveSourceAsync(string languageCode, string source, CancellationToken = default) returns Task<Dictionary<string,string>> for API-message snapshots.
- Authenticated Language/Options, Language/Default, LanguageText list/Keys/Detail/PUT/Override DELETE, Localization/Runtime match the frozen transport. Existing Language routes remain.
- Concrete SiGma.Business.Services.Localization.LocalizationCatalogImporter.ImportAsync(Stream, CancellationToken = default) returns Task<Result>. Root owns its explicit scoped registration and owner CLI. LanguageService and LocalizationService implement service interfaces discoverable by the existing scan; pure carrier classes implement none. Sealed EF configs are assembly-discovered; no DbSet addition needed.
- Matching13 GeneralMessage EN/AR entries supplied in LanguageLocalization/backend-resource-keys.json; root owns resource integration, Program/DependencyResolver, TrimIncomingStrings exception for Value, runtime adapters and final full-stack reconciliation.

## Import integrity and transaction boundary

Importer deserializes required version/entries/entry fields, rejects duplicate identities, invalid lengths/cultures/sources/paths/markup/placeholder contracts and missing sources before tracking. Version is SHA256 of ordinal source/key/language-sorted entries; each entry appends source,key,languageCode,value as UTF8 with a four-byte big-endian byte length before each field. Root extractor uses the same framing. No JSON formatting or Unicode escaping dependency.

Root source audit found95 actual source keys lacking English; importer chooses English when present, otherwise the ordinal-first actual language baseline for its token contract. No English text is invented. Runtime retains key fallback. This source debt stays outside the requested feature.

A single serializable transaction upserts the global keys/baselines, retires missing keys and removes absent source-owned baselines, then flags only incompatible live overrides. Tenant override values/identity/audit/deletion and legacy languages are untouched. The owner-only importer uses AsNoTracking reads plus ExecuteUpdateAsync limited to NeedsReview across tenants; this is the documented global maintenance exception, not a spoofed tenant or normal request write path. It is needed because normal EntityBase audit correctly requires an authenticated tenant. Rowversion changes naturally. It is not exposed through HTTP. A translation Save holds an UPDLOCK/HOLDLOCK on its catalog row through the existing write transaction, preventing a concurrent import from changing the validated contract between validation and insertion.

## Source review and pending owner acceptance

Reviewed the complete tracked scoped diff in the actual SigmaBackend repository, all added files by direct source read, the matching repository/UOW/ServiceHelper APIs, inherited alternate mutation paths, API routes, DTO properties, mapping direction, EF config discovery and consumer references. Targeted backend symbol search found the narrowed Language VM consumers confined to this owned service/controller/profile. Diff whitespace check passed; marker/ReverseMap/tenant-assignment search in owned source had no matches. No builds, tests, lint, migrations, database execution, browser, commit or push were run.

Grid properties: Language Actions/Flag/LanguageName/CultureCode/IsBuiltIn/IsDefault/CreatedBy/IsActive/CreatedAt correspond to Id plus precisely those VM fields. Text Actions/Key/BaseValue/TargetValue correspond to Key/BaseValue/TargetValue plus Version/HasOverride/NeedsReview for actions. Language unpaged calls preserve existing inherited compatibility, while normal supplied paging clamps and counts; text endpoints always page. Composite overrides are necessary because virtual built-ins and direct baseline/override values cannot be supplied by a single generic entity projection. Detail/navigation/select overrides keep alternate reads consistent with that composition.

Owner must generate Add-Migration AddDatabaseLocalizationCatalogAndOverrides after reviewing existing language lengths/duplicates and any legacy data; no migration or snapshot was created. Owner acceptance: compile/start/DI/model; apply migration and run catalog extraction/import; repeat import and invalid checksum/partial JSON; tenant isolation; first-save races and stale token409; concurrent import/save; default/use delete guards; empty/reset behavior; count/sort/page and50000-key limit; EN/AR/runtime/message fallback. Global import locking and generated SQL projections remain source-reviewed only.

Suggested backend commit message: feat(localization): add tenant language overrides and source catalog runtime.

No additional reusable cross-feature extraction qualified: LocalizationRules is feature-owned shared validation consumed by management/import; existing settings, tenant, unique-write and delete helpers were reused. Root owns UI/shared-footer documentation and guide handoff. This artifact does not declare the overall Sigma task complete.

Root final audit repairs: Save captures canonical response before commit with no post-commit detail read; detail includes PlaceholderContract in one projection; runtime resolves all fallback candidates in one projection. Legacy read-only name mapping now covers all49 exact existing frontend names. Text default page size15. Full task reconciliation is LANGUAGES_FULL_STACK_REVIEW.md.

