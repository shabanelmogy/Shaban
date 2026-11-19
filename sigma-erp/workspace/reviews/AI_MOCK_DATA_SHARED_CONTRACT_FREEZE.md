# AI mock data shared handoff

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-13 |

## Owner amendment — current-year generated dates, 2026-11-02

Owner: «وعايز توليد البيانات التجريية تكون تواريخ للعام الحالى». Frozen bounded change:
shared field metadata for date/dateTime/month intersects existing min/max with
the device's current local calendar year at generation, using the existing
MinDate/MaxDate request contract and strict backend candidate validation. Fields
with an empty intersection are excluded without changing their existing values.
Time-only fields, real control bounds/validators, manual dates, identity checks,
preview/confirmation/cancellation and manual Save remain unchanged. Backend
examples use effective bounds first and a dynamic year instead of year2000 for
unbounded callers. No new API/schema/setting, persistence or provider request is
introduced. This generic Sigma assistance has no Speed reference counterpart;
UI13 owns the reusable rule and the Sigma router points to it. Runtime/provider
acceptance remains pending under source-only execution.

Scope: shared candidate generation and Settings key configuration. Owner confirmed form filling followed by manual review/Save. Plan: AI_MOCK_DATA_MAINTENANCE_EVOLUTION_PLAN.md.

## Latest owner amendment — plaintext during development (2026-10-13)

Owner: “خلى حاليا المفتاح غير مشفر انا فى development ركز على بناء الخاصية”,
followed by explicit acceptance of theft/loss concerns. This supersedes every
protected-column/Data Protection/key-ring statement below, retained as historical
freeze evidence. Final persistence is nullable plaintext `DeepSeekApiKey`
(max2048), with no protection dependency. Public Settings responses still return
configured status/model only; blank preserves, nonblank replaces, Google writes
preserve the key, and only the backend sends it to the fixed provider. The API
JSON request/response shapes remain identical. Owner migration adds the nullable
plaintext column plus the filtered unique tenant index after legacy duplicate
reconciliation. No old encrypted data exists from this task because no migration,
database command or runtime write has occurred.

## API

### Amendment — card column widths (2026-10-13)

Owner requests a smaller CVV box, wider Name on Card/Bank Name, and less space
after Is Default. Reuse existing EditableCollectionTable column width contract:
CVV76px, Name on Card240px, Bank Name220px, Is Default80px in Individual/Company.
Retain Card Type180px and flexible remaining input tracks; Company minimum frame
width becomes1280px to match Individual and retain usable dates/card number after
allocating wider name fields. Existing shared row padding/34px inputs/frame
horizontal scrolling/767px toolbar wrapping/themes/RTL/validation remain. No
feature CSS, font change, column order/control/model/payload/calculation changes.
This is a frontend layout amendment coupled to the requested card mock fix.

### Amendment — synthetic Card Number and CVV (2026-10-13)

Owner reports these inputs are not generated and authorizes filling them. Shared
MockDataFieldDirective gains typed mockDataPaymentField="cardNumber"|"cvv" for
explicit native card inputs only. Individual/Company mark their existing two
inputs; only matching named controls (or explicitly marked direct FormControls)
can bypass the payment exclusion, and only cvv permits a masked password input.
Ordinary passwords/secrets/API keys/tokens retain exclusions. Metadata contains
canonical field names and mock-only fixed lengths16/3 with kind text; values stay
strings, retaining leading zeros. Existing manual input validators/types/payloads
are unchanged. Provider schema/example/prompt and strict value validation require
ASCII digits for these exact text names; invalid output follows the existing one
bounded repair and all-or-nothing rejection. No new DTO/property/endpoint/schema.
Existing entered card values never go to the provider or logs. Add row first,
scoped generation, preview/confirmation options/cancel/stale/manual Save remain.
This supersedes historical cardNumber/CVV exclusion decisions for marked inputs
only. Generated lengths are conservative test-data choices, not new domain rules
or verification of payment-card usability/type/issuer.

### Amendment — manual Add before row generation (2026-10-13)

Owner supersedes the previous empty Credit Cards preparation decision: show the
mock action only after the user adds a row, using the same Add Document logic.
Both Individual/Company Credit Cards and Documents retain their existing Add
handlers. Remove mockDataPrepare/canPrepare/preparing callbacks and the empty-row
availability bypass from the shared table/action/context and partner consumers.
Generate operates on supported rendered controls already in the scoped section;
it never creates rows. Empty tables offer their normal Add action only; removing
the last row hides mock generation again. Existing Settings visibility, View/
disabled/pending/cancel/preview/confirmation/stale/manual Save behavior remains.
No backend/API/schema change. This amendment supersedes automatic blank-row
creation and its cancellation/failure exception in earlier historical entries.

### Amendment — no loading modal and Credit Cards heading action (2026-10-13)

Owner clarification: disabled preview mounts neither a loading nor preview
modal. Existing ShowConfirmation is independent; turn both options off for no
mock-data modal at all. Loading/Cancel live beside the heading action. Validated
candidate readiness is independent of dialog visibility, and captured form/
control/value/option validation, cancellation, dirty marking and manual Save
remain. Scoped click/submit capture gates preserve pending editor actions when
there is no modal, exempting only mock Cancel and ignoring unrelated dialogs.

Owner reports missing Credit Cards action while creating a customer. Extend the
existing EditableCollectionTable heading using the same context/section action.
For Individual/Company Credit Cards only, optional mockDataPrepare uses existing
EditableRows.add when empty, renders its row controls then generates. It does
not infer child-row workflows for other empty tables. Preparatory Add leaves a
blank dirty draft row if generation is cancelled/fails; existing Remove owns
removal. Previously entered field values are retained on cancellation/failure.
Card number/CVV/password exclusions are retained. No business/API payload,
provider validation or automatic Save change. No schema change for this UI slice.

### Amendment — optional overwrite confirmation (2026-10-13)

Owner requests a third Settings option for showing the confirmation screen.
Extend GET with `showConfirmation:boolean` (default true), and PUT with optional
nullable `showConfirmation`, preserving omitted/null values. Persist tenant
ShowMockDataConfirmation with CLR/database true default and EF true sentinel.
This preference controls only the mock generator's existing-value confirmation,
independently of ShowButton and ShowPreview. Capture at Generate start; false
bypasses that confirmation but retains pending generation/cancel, validation,
stale checks, selected preview flow and manual business Save. Discard/settings/
other domain confirmations remain with their current owners. Conditional mapping,
owned modified flags, old-client compatibility, failed-read key recovery and
session/revision cache guards extend to this member. Owner migration only:
AddMockDataConfirmationPreference. No migration/snapshot execution.

### Amendment — global presentation preferences and section actions (2026-10-13)

Owner requests Settings options for showing the mock-data button and preview,
and the action in section headings. GET MockData/Settings now returns
`{hasApiKey,model,showButton:boolean,showPreview:boolean}`. PUT accepts
`{apiKey:string|null,showButton?:boolean|null,showPreview?:boolean|null}`;
omitted/null flags preserve existing preferences and blank key preserves it.
Saving preferences without a configured key is allowed. Default preferences are
both true (existing workflow preserved), persisted on ApiKeySetting as
ShowMockDataButton/ShowMockDataPreview. Google/legacy saves ignore these members.
One helper upsert/Save owns the three mock-data members; no schema/migration
execution. New settings read uses existing ApiKeySetting owner, never direct
queries from provider service. Model stays configured by MockDataService.

Shared FormSection headings inherit one context-bound action; it generates only
currently rendered supported fields contained in that section. Editable fields
outside visible headed sections retain one fallback heading action, scoped only
to those remaining fields; without shared sections it covers the form. No repeated
form toolbar for fields already served by section actions. Turning off preview skips the values table
and applies valid generated values to the draft, retaining overwrite confirmation,
pending modal/cancellation, stale identity checks, normal validation and manual
Save. The preference snapshot is captured at Generate start. Public context/action
component uses existing shared button/header owners, no screen-specific copies.
Preferences are loaded through root interceptor-enabled HttpClient; hide actions
until loaded, show inline Retry after load failure, and reset cached preferences
when the authenticated session changes. No permission claim is inferred.

### Amendment — reported provider mismatch recovery (2026-10-13)

Owner reports InvalidProviderResponse for IndividualPartner and Companies and
supplies the CompanyPartner/create metadata request and HTTP400 Result. The
response proves server-side candidate rejection; exact rejected provider output
was not supplied. Source reveals a generic unrelated output example and one
undifferentiated failure for every shape/type/bounds problem. Extend only the
shared provider operation: supply a schema and output example built from actual
requested keys/kinds/string choice tokens; one bounded repair attempt after an
invalid JSON/envelope/candidate result, using reason codes and requested field
keys only. Keep both attempts within the existing total45-second deadline and
512KiB response cap. Never retry auth/HTTP errors, weaken field validators, apply
partial output or use generated values as a deterministic fallback. Safe logs
and a localized failure suffix may name requested field identifiers/reason only;
never include key/response body/generated values. Public API shape, manual Save,
plaintext development key storage and entity/EF contracts remain unchanged.

All routes authenticated, root `[controller]` route convention, standard Result<T>/Result responses and cancellation tokens. Tenant comes from the existing server subscription context, never client input.

| Method | Route | Request | Response entity |
|---|---|---|---|
| GET | /MockData/Settings | none | `{hasApiKey:boolean, model:string}`; no key/cipher/masked key fragments |
| PUT | /MockData/Settings | `{apiKey:string|null}`; blank preserves; maximum2048 chars | standard Result, no secret echo |
| POST | /MockData/Generate | `{screen:string, language:string, fields:MockDataField[]}` | `{values:Record<string,MockDataValue>}` |

`MockDataValue = string | number | boolean | null | string[]`.

`MockDataField = {key:string, name:string, label:string, kind:'text'|'number'|'boolean'|'date'|'dateTime'|'time'|'month'|'choice'|'multiChoice', required:boolean, min?:number|null, max?:number|null, minLength?:number|null, maxLength?:number|null, decimalPlaces?:number|null, choices?:string[]|null, minDate?:string|null, maxDate?:string|null}`.

Limits:80 fields per request; unique nonempty keys <=100 chars; names/labels <=150; screen<=200; language en/ar; choices<=100 opaque token strings; text<=2000 chars; lengths ordered and bounded; numeric bounds finite and ordered; decimalPlaces0..20. Frontend chunks larger forms into bounded requests. No current form values, record/tenant ids, secrets or real lookup labels in generation requests. The model receives metadata as untrusted data with explicit synthetic-data instructions and a JSON example. Endpoint fixed to `https://api.deepseek.com/chat/completions`; model configuration `DeepSeek:Model` default `deepseek-flash`. Use `response_format:{type:'json_object'}`, request bounded output and timeout; no arbitrary user URLs/SQL/API execution. Validate the returned `values` object against the complete requested allowlist, primitive types/bounds/date shapes/opaque choices. Treat malformed, missing, empty/truncated or invalid provider results as failure without applying values. Safe localized business messages only; no raw provider body/token/exception in logs or responses.

## Settings ownership

Extend ApiKeySetting with a nullable protected-secret property (max8192 chars). Add no public secret read field. The existing ApiKeySetting owner reads/writes the current tenant's latest single row through IServiceHelper. New Settings PUT preserves GoogleMapApiKey and the secret on blank input; creates the missing row without requiring an unrelated Google key. ASP.NET Core Data Protection protects/unprotects only on the server; inability to unprotect returns a safe settings error. Existing Add/Update mappings cannot overwrite the protected-secret member. New DTO/helper classes each occupy a separate appropriate file. No AutoMapper mapping for generated candidates and no business persistence/calculation.

## Frontend ownership and reference conformance

| Concern | Book | Reference/symbol | Shared owner | Target |
|---|---|---|---|---|
| Form layout/scroll | UI1/13 | Job/editor sigma-editor-form; EditorDialogComponent | Existing shell | Preserve existing form regions; new shared toolbar consumes one fixed row |
| Buttons/preview | UI13/24 | PrimaryActionButtonComponent; EditorDialogComponent | Existing shared controls | Reuse public inputs; generic candidate table inside bounded dialog |
| Confirm overwrite | UI10 | ConfirmationDialogService.confirm; freezeFormState | Existing confirmation/form snapshot | One pending decision; restore original disabled state |
| Fields/options | UI16/17/19 | Job editor native/PrimeNG controls and handlers | Owning editor/CVA | Extract only rendered editable inputs; recheck live options/validators; never invent FK values |
| Failure/cancellation | UI2/22/28 | root HttpClient; apiErrorMessage; takeUntilDestroyed | Shared generator | Inline error + Retry; suppress global error/success feedback for auxiliary generation |
| Settings | BE16; UI1/13/19 | Existing ApiKeyComponent tab; settings single-row helper | ApiKeySetting owner | Add independent DeepSeek typed form; no secret readback |
| Guide | Master7 | SHARED_SCREEN_GUIDANCE | Existing module overview | Explain configuration, create/edit, preview/apply/cancel/manual Save, skipped fields and rows |

Rendered controls are registered with the nearest shared mock form root. Existing controls and business fields remain. Filter/search/report/authentication forms are excluded; view/disabled forms offer no mutation. Add/Edit use the same adapter, so no new business route. Preview application never submits a form. Mark changed controls dirty/touched, retain existing Save and discard behavior; teardown and identity/value checks discard stale output. Existing-field overwrite confirmation and preview cancellation preserve entered values. Async validators and authoritative backend validation remain at their existing owners. New candidate fields cannot create child rows without the existing editor Add action.

## Verification boundary

### Amendment — Settings first-save compatibility

During integration, the existing Google key form's nullable/last-row snapshot was found incompatible with a DeepSeek section that can create the latest row. The ApiKeySetting owner now uses the canonical single-row service/controller/interface bases. The existing Google section uses `GET /ApiKeySetting/Mine` → Result<ApiKeySettingDetailVM> and `PUT /ApiKeySetting/Mine` with `{googleMapApiKey:string}` → Result. Preserve protected DeepSeek secret through the Google map; keep `GetMapApiKey` and inherited legacy base routes for compatibility. This amendment resolves the concrete first-save/null-id/old-row issue; no additional business behavior is introduced. Existing duplicate cleanup/unique-index work remains owner-controlled rather than destructive side effects of Save.

Source-only conformance and complete scoped Git diffs are mandatory; build/runtime/browser/database/migration checks remain owner-pending. Owner migration suggestion: AddDeepSeekMockDataKey. No migration or snapshot edits. Agent delegation is permitted only after this frozen handoff, with backend/frontend files non-overlapping and root-owned integration/final review.

### Amendment — final source reconciliation (2026-10-13)

BE16 requires live-tenant uniqueness when ApiKeySetting is reviewed. The final
EF configuration therefore includes the nullable protected-key column and a
filtered unique SubscriptionId index (`[IsDeleted] = 0`). Owner reconciles legacy
duplicates before creating/applying AddDeepSeekMockDataKey; no data deletion or
migration/snapshot change occurs here. Since Repository.Update marks whole rows
modified, independently saved Google/DeepSeek sections restrict EF modifications
to their own scalar before Save. The legacy id-based Google update has a tracked
override preserving tenant/id validation and avoiding stale secret writes.

Privacy reconciliation: screen means route-config patterns with placeholders;
provider labels are field names, while UI preview labels remain local. Native
legacy temporal controls keep ISO strings and PrimeNG calendars keep local Date
values. Only standard binary Boolean PrimeNG checkboxes are adapted. Existing
0/false values trigger overwrite confirmation. Form and AbstractControl
identities, raw-value snapshot and current lookup values are rechecked; Cancel,
late form replacement and teardown restore prior disabled state without applying
partial batches. Preview opens during generation to own the pending decision.

Settings retains its existing routed-tab location (explicit integration
exception to the simple-settings modal default). Its new bounded API Key shell
has one internal content scroll and fixed separate Save actions. Parent Settings
legacy tabs are bounded only for apiKeySetting because unreviewed pages would be
clipped by general bounds. No private PrimeNG markup or new theme palette is
introduced. Administration guide registration/menu and shared guide coverage are
part of handoff. DeepSeek request adds `thinking: {type:'disabled'}` per official
provider documentation; the frozen provider URL/model/JSON response contract
otherwise stays unchanged.
