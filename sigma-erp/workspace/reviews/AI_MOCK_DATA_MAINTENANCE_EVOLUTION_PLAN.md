# Shared AI mock data

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-13 |

## Outcome and owner decisions

Latest layout amendment (2026-10-13): owner requests narrower CVV, wider Name on
Card/Bank Name and less space after Is Default. Existing UI14 column inputs
select76/240/220/80px in both customer card consumers; Company minimum1280px
matches Individual so other date/card inputs remain usable. Shared control/cell
geometry/scroll/theme/RTL/order/validation remain; no feature CSS or domain change.

Latest synthetic-card amendment (2026-10-13): owner reports Card Number/CVV are
not generated, explicitly clarifies these are test data. Extend the shared field
adapter with typed native card-input marker, canonical string names/lengths16/3
and leading-zero/digit validation; mark the four Individual/Company inputs.
Extend existing provider prompt/schema/example/strict validation for those exact
text names; same bounded repair/privacy/Add-first/cancel/manual Save. No new DTO,
endpoint, EF field, domain validator or migration. Supersedes historical payment
exclusions only for marked inputs; ordinary passwords/secrets remain excluded.

Latest owner amendment (2026-10-13): Add Credit Card/Add Document creates rows
manually first; Generate appears only for supported rendered controls and never
adds a row. Removing the last row hides it. Supersedes automatic card preparation
and its cancellation/failure exception below; remove shared/context/consumer
callbacks and the canPrepare bypass, preserving Add handlers/settings/cancel/
preview/manual Save. UI-only source change; no new migration or backend change.

Latest frozen amendments (2026-10-13): independent ShowConfirmation defaults
true, nullable omitted writes preserve the stored preference, and false bypasses
only mock overwrite confirmation. Entity/default/sentinel/DTO/helper/map/cache/
typed Settings control/EN-AR guide extend the existing three-flag contract;
owner migration AddMockDataConfirmationPreference is pending.

Owner clarifies preview off must not open a loading modal. Extend the existing
shared owner with independent candidate readiness, heading loading/Cancel and
scoped pending interaction gates. Preview/confirmation remain independent; both
off means no mock modal. Owner reports missing Credit Cards action: extend the
existing shared collection toolbar/context, retain Add/Remove/validators/cells/
payload, and provide an explicit empty-row preparation callback in Individual/
Company credit cards. Use existing Add; do not infer other empty-table workflows.
Prepared blank drafts remain on failed/cancelled generation and can be removed.
Sensitive payment fields remain excluded. This is tightly coupled shared-owner
work, so root implements it without a new subagent or consumer-wide rewrite.

Latest presentation slice: owner selects Settings-wide ShowButton/ShowPreview
options and mock actions in section titles. Persist default-true tenant flags
in the existing settings row; blank/omitted members preserve existing values.
Shared FormSection composes one scoped action, retaining projected Add. Fields
outside visible shared headings use one fallback Test data action without
duplicating section fields. Preview off applies validated candidates to draft
after generation; overwrite confirmation/cancellation/stale checks/manual Save
remain. Implementation streams were frozen before independent backend/frontend
work. Migration AddMockDataDisplayPreferences adds two default-true bool columns;
no migration/snapshot execution or unrelated screen rewrite.

Follow-up implementation slice (2026-10-13): owner reports provider rejection in
IndividualPartner and Companies. Preserve all original feature/Save/storage
boundaries; extend the shared provider prompt with actual-key schema/example,
string choice guidance, one correction within existing total timeout, and bounded
safe diagnostics. This is the smallest shared-owner repair, not screen-specific
generator duplication or acceptance of malformed values. Exact original provider
cause remains unavailable without the provider response; owner replay pending.

Latest owner amendment (2026-10-13): store the key unencrypted for current
development and focus on completing the feature. The owner explicitly accepts
current theft/loss concerns. This supersedes the protection/key-ring statements
in this Frozen historical plan: final source stores nullable `DeepSeekApiKey`
(max2048) as plaintext, while retaining write-only public DTOs, backend-only
provider calls, tenant settings ownership and blank-preserve semantics.
Data Protection/FrameworkReference additions are removed. The migration still
adds the nullable key column and filtered live-tenant uniqueness index.

The owner requested DeepSeek-generated mock data throughout Sigma, through a shared capability. It supports Create and Edit forms; the owner explicitly selected filling the form, reviewing it, and saving manually. A DeepSeek API key must be configurable under Settings. These decisions authorize implementation, not automatic persistence of generated business records.

## Existing state and evidence

| Concern | Owner/source | Finding | Decision |
|---|---|---|---|
| Editing | Angular reactive forms; shared editor-dialog, routed sigma-editor-form, step-form | Different form layouts; controls/validators and dependent lookups belong to each form | Keep those owners; Create a shared form adapter and generator |
| Actions, errors, preview | shared primary-action-button, editor-dialog, data-table, state-message, confirmation-dialog.service | Existing public controls and feedback conventions | Reuse |
| HTTP | AppModule root interceptor-enabled HttpClient; BaseService | One token/error/language chain | Keep; add a root shared mock-data service |
| API keys | Administration/Settings/components/api-key; ApiKeySettingService/entity/config/profile | Existing Google Maps key screen and tenant-owned settings entity; legacy last-row CRUD | Extend the existing Settings tab with a separate typed DeepSeek section; preserve Google Maps behavior |
| Settings persistence | backend block16; IServiceHelper | Single-row helper selects the latest tenant row | Use this owner for the new secret read/write; no separate table |
| Seed data | SeedDataController/SeedDataService | Account tree and numbering initialization | Keep outside scope; never invoke for mock form filling |
| DeepSeek | Official JSON Output and Chat Completions documentation | Structured JSON generation is supported | Create a backend-only authenticated provider adapter |

Scoped Git status was inspected separately in both repositories. Existing Invoice, payroll, VAT, translations, shared presentation and guide changes belong to the owner/other tasks and must be preserved. No broad business-source review is authorized.

## Alternatives and impact

| Option | Trade-off | Decision |
|---|---|---|
| Per-screen independent generators | Repeated HTTP, validation and UI code | Reject |
| Generic direct entity/database writes | Bypasses screen review and requires each domain persistence/financial contract | Reject: owner selected manual Save |
| Shared reactive-form metadata adapter + provider + preview | Reuses rendered controls, validators and real lookup choices; current child-row creation remains with each editor | Select |

| Area | Impact | Phase |
|---|---|---|
| Shared Angular form/control adapter | Discover rendered editable controls, generate candidates, preview, mark applied inputs dirty/touched, preserve normal Save | 3 |
| Editor consumers | Import the shared module and enable the adapter on editor form roots; exclude search/filter/report and authentication forms | 3/5 |
| ApiKeySetting | Nullable protected DeepSeek secret; no secret in Detail/List DTOs | 1 |
| Settings tab | Write-only password entry, configured status, replace/preserve semantics | 3 |
| Backend provider | Metadata-only request, strict candidate response validation, bounded timeout/payload, safe errors, cancellation | 1/5 |
| Guide | Common guidance inherited by current module guides | 6 |

## Contracts and boundaries

The exact API handoff is `AI_MOCK_DATA_SHARED_CONTRACT_FREEZE.md`. The UI uses existing shared editor/dialog/table/button/error owners, with one new shared form toolbar. In Create and Edit, generated candidates replace only currently rendered editable inputs after preview; existing content replacement uses the reusable confirmation. Disabled, readonly, identities, audit/state/calculated inputs, passwords, files and API keys are excluded. Real lookup choices are mapped locally to opaque tokens; existing business values and lookup labels are not sent to DeepSeek. Candidate application rechecks control identity, current options and validation. Dependent controls keep existing event/lookup owners; changed or unavailable candidates are skipped with visible feedback. Empty child collections are added using the editor's existing Add action, then their rendered fields use the same shared adapter. No child deletion/reconciliation is invented.

The key is tenant-owned, protected at rest with ASP.NET Core Data Protection, write-only in HTTP responses, and kept when the key input is blank. No provider request originates in the browser. No automatic Save, posting, approval, activation, deletion, financial calculation, permission system or schema migration execution is introduced.

## Compatibility and rollout

Add only the nullable protected-secret column to ApiKeySetting. Existing rows retain an unset key and Google Maps behavior. Owner runs Add-Migration `AddDeepSeekMockDataKey`, reviews it and applies it before using the new endpoints. Migration/snapshot files are outside agent editing scope. Preserve Data Protection keys across server restarts/instances; the deployment's existing key-ring behavior must be verified by the owner. Generic existing settings mappings must preserve the protected secret. Existing settings readers must never expose it.

## Verification and execution

### Integration amendments — 2026-10-13

The initial rollout sentence above said nullable column only. Final canonical
settings conformance also configures a filtered unique `SubscriptionId` index
(`IsDeleted = 0`), as BE16 requires when the screen is reviewed. Owner duplicate
reconciliation must precede migration; no automatic cleanup/migration is done.
The Google screen now reads/saves `ApiKeySetting/Mine` so first DeepSeek Save
cannot leave Google writing an old/null row id. Legacy GetMapApiKey and base
routes remain compatible. Both section writes own their scalar only; a narrowly
justified tracked legacy update prevents concurrent secret overwrite.

The in-app guide includes the Administration section and menu route
`/UserGuide/administration`, in addition to shared guidance inherited by other
module guides. New API Key content follows the bounded editor shell and fixed
footer. Parent Settings tab bounds apply only on this route: generic bounds would
clip unreviewed legacy Settings pages. Native legacy temporal strings and binary
PrimeNG checkboxes have supported adapters; grouped/lazy/range/custom widgets
remain with their owning editor. Generation sends route patterns and field names
as provider labels, keeping dynamic business labels local. Official DeepSeek
thinking-mode output is disabled for this bounded JSON candidate operation.

1. Freeze the shared API; implement backend and frontend with non-overlapping ownership.
2. Apply shared imports/attributes only to directly related reactive-form consumers; record adopted/excluded forms and any unsupported shapes.
3. Reconcile request/response and secret exposure, lookup handling, validators, cancellation, dirty/discard, translations, RTL/theme/responsive scroll bounds and full scoped diffs.
4. Update the common in-app guide and owning documentation digest after source evidence establishes the reusable contract; regenerate affected packets and run -Check.

Owner checks: migration, builds, create/edit/preview/cancel, existing-value replacement, readonly/view, failure/retry, dependent lookups, child rows, numeric/date handlers, dirty discard, two tenants, masked key preservation/replacement, encrypted-at-rest persistence and key-ring recovery, RTL/theme/narrow dialogs. All runtime checks remain pending. No build/test/lint/database/browser/commit/push/deployment commands are authorized.

No screenshots supplied. Open runtime acceptance is not an unresolved business contract. Generic generation supplies candidates; existing form and backend business validation remain authoritative.
