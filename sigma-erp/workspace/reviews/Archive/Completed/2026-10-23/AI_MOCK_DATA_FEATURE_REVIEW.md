# Shared DeepSeek mock data — final source reconciliation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-13 |
| Scope tier | L — shared frontend/backend feature |
| Plan | AI_MOCK_DATA_MAINTENANCE_EVOLUTION_PLAN.md — Frozen with integration/owner amendments |
| API handoff | AI_MOCK_DATA_SHARED_CONTRACT_FREEZE.md — Frozen with integration/owner amendments |

The requested feature is implemented in source: a common generator fills
supported editable form inputs after preview, and the user reviews and saves
through the screen's existing Save action. Settings → API Key contains the
DeepSeek entry. The latest explicit owner instruction selects **unencrypted
storage for current development**. Data Protection and its dependency were
removed; the public screen still receives configured status/model only.

## Manifest, scope and evidence

### Latest card layout adjustment

Owner requests compact CVV, wider Name on Card/Bank Name and less empty space
after Is Default while the synthetic card fix is active. UI14's existing typed
columns/colgroup owner supplies76/240/220/80px respectively in Individual and
Company card arrays. Card Type180px and other tracks remain flexible. Company
frame minimum1100→1280 matches Individual; on a1280px table, declared tracks plus
the74px action leave410px for the three flexible card/date tracks. Shared7px/9px
cell padding/34px inputs/frame scroll/767px toolbar wrapping/RTL/theme remain.
No feature CSS, font/control/order/domain/payload/validator changes. Common and
Customer-profile guides describe compact CVV/default and wider name inputs.

Source conformance: actual EditableCollectionTable template passes column.width
to colgroup and uses shared fixed layout; source width declarations match the
frozen amendment/UI14. Visual/long value/validation/directions/themes acceptance
remains pending. The two nonmechanical column TS diffs are reviewed separately
and explicitly excluded from the adoption-only reversal. No migration required.
Suggested frontend commit for the combined slice:
`fix(mock-data): fill card fields and adjust customer card column widths`.

### Latest owner fix — generate synthetic Card Number and CVV

Owner reports missing values, explicitly confirms they are test data. Source
cause: shared adapter excludes both names and excludes password input types;
Company direct FormControls also have no NgControl.name. Frozen amendment adds
typed mockDataPaymentField for the four native Individual/Company card inputs.
It matches named controls or explicit direct FormControls, canonicalizes metadata
names, and permits masked password input only for cvv. Ordinary passwords/API
keys/secrets/tokens and unmarked card inputs remain excluded. Adapter uses text
with mock-only lengths16/3 and ASCII digits, preserving leading zeros. Existing
manual validators/native types/form graph/Add handlers/payloads stay unchanged.

MockDataService adds exact-text-name IsPaymentText guidance/validation: output
schema digit pattern, numeric-string example, prompt instruction and strict
ASCII-digit/nonempty check within existing bounds. Optional null retains its
existing meaning; zero-length optional metadata gets null example. Non-string/
wrong length/letters follow the existing one bounded repair/all-or-nothing reject.
No current card values are transmitted/logged, and no local fallback is added.
No DTO/endpoint/entity/map/schema/migration changes. Synthetic lengths are
generation choices, not issuer/type/payment eligibility or new input validation.

Conformance: UI13 MockDataFieldDirective metadata/available/convert owns marked
inputs; UI14 existing shared card rows and Add-first generation retained; BE18
MockDataService OutputSchema/ExampleValue/ValidValue agree on text/digits/bounds.
Four markers are direct HTML attributes of the already imported shared directive;
no private shell or password visibility change. Common/Customer-profile EN/AR
guides now say the fields generate. UI13/UI14/BE18/skill/CHANGELOG and generated
packets are synchronized. Existing Settings three options/manual Save retained.

Phases1/3/5/6 apply; lists/domain calculations/settings persistence unaffected.
Root handles the tightly coupled metadata fix without subagents. No build/test/
lint/browser/database/migration/commit/push/deploy commands. Owner verification
pending: Add first, both fields in Individual/Company; leading-zero string input/
payload; CVV stays masked; Preview Apply/off, confirmation options, cancellation/
failure/stale controls, View/disabled and normal secret exclusions. Guide routes/
menu/reader unchanged. Suggested frontend commit: `fix(mock-data): enable synthetic card number and cvv inputs`;
backend: `fix(mock-data): validate synthetic payment text candidates`.

Combined final source evidence:254 roots/456 imports,34 matching EN/AR keys,
628 mechanically reconciled adoption diffs and zero diagnostics. Two card column
TS files are explicitly manually reviewed; marker-only HTML differences are
reconciled separately by the verifier and all four input attributes inspected.
Current shared directive and bilingual guide source parses without diagnostics;
scoped frontend/backend diff/whitespace review passes and backend manifest hashes
are refreshed. New untracked MockDataService/adapter source was inspected directly
because tracked Git diff does not include new files. UI13/UI14/BE18 semantics and
all eight regenerated packet drift checks pass. Backend ASCII digit schema/
example/validation agrees with frontend fixed mock bounds/leading-zero strings.
Compile/provider/browser/layout/direction/theme acceptance remains owner-pending;
no execution beyond source/recipe checks is claimed.

### Latest owner correction — show mock generation after manual Add

Owner says show it after adding a row, using Add Document's same logic. The
new frozen amendment supersedes automatic Credit Cards preparation below.
Shared context/action/table use available supported rendered controls only;
removed canPrepare/mockDataPrepare/preparing state, synchronous detectChanges
and microtask creation flow. Individual/Company remove callback/binding additions
and retain existing Add Credit Card/Add Document handlers. No automatic row
creation or cancellation/failure row-count exception remains. Empty table: Add
only; after Add: Generate; final Remove: Add only. Settings button visibility,
View/disabled/pending/Cancel/confirmation/preview/stale checks/manual Save retain
their existing owners. No backend/API/map/schema/domain-calculation change.

UI14 owns table/action chrome, UI13 owns the shared generation state, and actual
EditableCollectionTable/MockDataAction/availableFor symbols match their contracts;
in-app common and Customer profile EN/AR guidance now says manual Add first.
Existing guide route/menu/reader stays unchanged. Phases1/3/5/6 apply to this UI
correction; backend/list phases are N/A. Root performs this small sequential
change without subagents. No build/test/lint/browser/database/migration/commit/
push/deploy commands. Owner acceptance pending: empty/Add/last-Remove for Credit
Cards and Documents in Individual/Company, button off/View/pending/cancel and
Arabic/English themes/767px wrapping. No new migration is required for this slice;
prior Settings confirmation migration remains owner-owned. Suggested frontend
commit: `fix(mock-data): require manual row addition before generation`.

Correction verification:254 roots/456 imports,34 matching EN/AR keys,630
mechanically reconciled adoption diffs, zero source diagnostics. Current guide
files parse without diagnostics; scoped diff/whitespace review passes, refreshed
frontend diff contains current guide text, and no preparation references remain
in scoped application source. UI14 and shared availability/action contracts
were semantically reconciled; all eight regenerated packet drift checks pass.
Compilation and browser/interaction acceptance remain pending for the owner.

### Latest amendments — confirmation option, generation without a modal, Credit Cards

Owner adds an independent Settings confirmation flag, clarifies preview-off
must open no loading/preview dialog, and reports the missing Credit Cards action
in customer creation. Frozen amendments are recorded in the existing plan/API
freeze. No screenshot evidence or new business/API payload was supplied.

Backend adds ShowMockDataConfirmation with CLR/database defaults true and EF
HasSentinel(true); public GET ShowConfirmation and nullable PUT ShowConfirmation
match the frontend. Conditional helper map preserves omitted/null members;
legacy/Google writes ignore it. Submitted scalar ownership, one helper upsert/
Save, write-only plaintext development key and cancellation remain. Frontend
settings form/cache/recovery and EN/AR caption expose all three independent
options. False bypasses only existing-value mock confirmation. Owner migration:
Add-Migration AddMockDataConfirmationPreference; if earlier display/key changes
are not migrated yet, inspect all generated pending columns/indexes together.
Migration/snapshot files were not changed.

MockDataForm captures both preview/confirmation preferences. With preview false,
previewOpen stays false and template also requires showPreview; no loading dialog
is mounted. Candidate readiness is separate, permitting validated auto-application
after busy clears without opening a modal. Heading action displays loading/Cancel.
Captured identity/raw values/live options/validators/manual Save remain. Scoped
document click capture blocks editor actions within the nearest existing dialog,
routed editor or legacy card; form submit capture blocks ngSubmit. Mock Cancel is
exempt, unrelated body-appended dialogs are outside that boundary, and destruction
removes listeners. FreezeFormState owns prior disabled state. Both options false
opens no mock modal; enabled confirmation retains its separate decision.

Credit Cards used EditableCollectionTable rather than FormSection and begins with
no registered row controls. Shared table now registers heading scope and composes
the same action; existing rendered collections inherit it without screen markup
copies. Individual/Company Credit Cards explicitly supply mockDataPrepare, using
their existing EditableRows.add only when empty. Synchronous table rendering and
a microtask permit field registration before generation. Other empty collections
retain their own Add workflows. View/disabled/prerequisite/global-button/pending
gates remain; Add/Remove/cells/columns/validators/IDs/payload mappings stay owners.
A prepared blank dirty row remains if generation fails/is cancelled; existing
Remove may remove it. Existing cardNumber/CVV/password exclusions remain.

| Concern | Book / actual reference | Final source conformance |
|---|---|---|
| Optional modal | UI13; EditorDialog public template/inputs | Enabled uses same780×540 padded shell; disabled does not mount it |
| Loading/cancel | UI24/13; PrimaryActionButton loading/disabled and sigma-secondary-button | Shared heading loading, Cancel, duplicate gate; no private button CSS |
| Collection action | UI14; EditableCollectionTable toolbar/row template and EditableRows.add | Scoped same context; explicit owner preparation; unchanged payload/row factory |
| Responsive | UI14/29; existing767px toolbar stack | Actions/toolbar wrap; max-width100%; existing wide frame scroll/theme/logical margins retained; visuals pending |
| Confirmation persistence | BE16; ApiKeySetting scalar helper/map | Defaulttrue/null-preserve member; independent GET/PUT/control/cache; old-read fallbacktrue |
| Guide | Master7; Administration/common/Customer profile topics | EN/AR Settings3 flags, no-modal flow, first-card draft/Cancel/sensitive fields/manual Save |

Phases1/3/5/6 extend the existing frozen feature; list/backend generator/domain
calculations are unchanged. Small interdependent shared-context changes are
root-owned; no new subagent was used. No build/test/lint/database/browser/commit/
push/deploy command was run. Source parsing/translation/scoped diff checks apply,
and runtime/visual/interaction verification remains owner-pending.

Owner matrix: preview×confirmation on/off with existing/empty values; first-card
draft and existing-card scoped generation in Individual/Company; button hidden;
View/disabled/Add prerequisites; cancel/failure/navigation/destruction; stale
form/options; Save/row controls while pending; preview Apply/manual Save; settings
reload/omittedfalse/firstfalseinsert/Google preservation;767px boundaries, narrow/
wide widths, Arabic/English and light/dark. Guides use existing UserGuide routes
and menu entries; no new reader or route was added. Suggested commits: frontend
`feat(mock-data): configure confirmation and fill card sections without preview modal`;
backend `feat(mock-data): persist overwrite confirmation preference`.

Final source evidence for these amendments:254 form roots/456 import owners,
34 matching EN/AR mockData keys,627 mechanically reconciled adoption diffs and
zero parser/adoption diagnostics. The three tracked nonmechanical Credit Cards
adoption files were manually reviewed, with explicit normalized-path exclusions
in the verifier; Company card HTML and shared collection/form/action source were
also reviewed directly. Final bilingual guide files parse without diagnostics.
Scoped frontend/backend diff whitespace checks pass, backend source hashes are
refreshed, and no merge markers were found in the changed shared/card source.
All eight generated packet drift checks pass after UI13/UI14/BE16 semantic
reconciliation against the actual shared owners/defaults. This evidence does not
certify Angular/.NET compilation, provider replay or browser interaction.

### Latest follow-up — Settings display options and section heading actions

Owner requests options for preview/button visibility, selects Settings for all
screens, and asks for the action in section titles. The frozen amendment now
extends GET with `showButton/showPreview` and PUT with nullable optional flags.
Both default true. Source persistence: ApiKeySetting ShowMockDataButton and
ShowMockDataPreview, CLR/database defaults true and EF HasSentinel(true) so false
is retained on first insert. Nullable internal mappings preserve omitted/null
flags and blank keys. Preferences-only Save needs no key; Google/legacy writes
ignore both flags. Existing owner reads return status/preferences; one helper
upsert and one Save write submitted mock-data members only. Provider generation
code is unchanged by this slice.

Frontend root MockDataService caches preferences for the current auth-token
session, hides buttons until loaded and offers inline Retry on failure. Success
updates all current consumers; it cancels cache-owned pending reads and advances
a monotonic revision so independent older GET responses cannot overwrite a later
Save. Session change resets cache and stale read/error guards. This is a
client-session cache; other browser sessions observe updated tenant settings on
their next read/reload, not through a new realtime mechanism.

DeepSeek Settings now has typed showButton/showPreview checkboxes and saves them
with the optional key under Save DeepSeek settings. A successful read allows
preferences-only Save. After failed read, a replacement key omits unknown flags,
preserves stored preferences and reloads status. Dirty discard includes both
flags via the existing two-form guard. The key remains plaintext by earlier
explicit owner instruction; no permission behavior was added.

New `MockDataActionComponent` uses the nearest optional MOCK_DATA_CONTEXT and
existing PrimaryActionButton. Shared FormSection imports it, registers its host
and current heading visibility, and renders it in the existing heading action
area alongside projected actions. Scope filters registered bindings by host
containment. Shared sections behind hidden tabs/headings do not suppress the
fallback. Fields outside visible headed sections keep one Test data heading
action limited to those fields; no duplicate button for section-owned fields.
Nested forms use their nearest context. Individual and Companies' projected
form sections inherit this without business-screen markup/payload changes.
Section headings/actions wrap at760px and the action group stays bounded;
existing theme/logical spacing, Add handlers and section geometry remain owners.

Generate captures the current preview flag. True retains the values table and
explicit Apply. False shows only a cancellable pending generation dialog and
applies validated candidates when generation completes, after busy clears.
Cancel clears auto-apply before unsubscribe; destruction/identity/raw-value/live
option checks still guard the same draft. No automatic business Save is added.
Feedback/error messages remain visible with no standalone duplicate toolbar.
No API response or provider validation is weakened.

Touched source in this slice: nine backend settings/entity/config/map/service/
DTO/interface files; frontend shared form-section TS/HTML/SCSS, mock-data models/
field/form/action components, MockDataService, DeepSeekSettings TS/HTML, EN/AR
vocabularies (33 matching mockData keys), Administration and shared guide content.
The adoption inventory still has254 form roots/456 import owners; broad consumer
source is unchanged. One new component is transitively imported, no tsconfig root
or broad include added. Existing tracked diff plus new source files were reviewed
separately in both repositories. Backend conditional map/source defaults and
frontend metadata/context/type declarations match the frozen API. No new service
override or generic helper modification. Source-only parsing/translation/whitespace
checks pass; build/browser/runtime checks are not claimed.

Backend worker implemented only its frozen backend ownership then audited the
frontend read-only while root updated source/docs. Its concrete GET-after-PUT
cache-race finding was fixed with revision/session guards and cancellation for
both full preference and key-only recovery saves. Root reviewed the integration.
UI13/BE16/skill/CHANGELOG and existing bilingual guide were updated, and generated
packets refreshed/semantically checked for shared header/partial settings ownership.
Phases1/3/5/6 apply; business list/actions/calculations/uploads remain N/A.

Owner must run `Add-Migration AddMockDataDisplayPreferences`, review both default-
true Boolean columns and apply normally. No migration/snapshot edit occurred.
If earlier mock-key schema changes are still un-migrated, generated migration
will include those too; review against the actual migration history.
Suggested frontend commit: `feat(mock-data): configure visibility and section actions`;
backend: `feat(mock-data): persist display preferences in tenant settings`.

Owner acceptance: both flags true/false independently, prefs-only and blank key
Save, first-row false flags, omitted/null flags through old clients, same-value
Save, independent Google updates, failed-read key replacement, session switch,
old GET completing after PUT, hidden/nested/mixed sections, step changes,
Individual/Companies header buttons and retained Add, preview enabled/disabled,
Cancel/stale/timeout/manual Save, EN/AR/light/dark and760/761/650/320/short-height
header wrapping. Source conformance is complete; actual visual/runtime remains
pending. No additional builds/tests/lint/database/browser/commits/deployment ran.

### Follow-up — reported mismatch in IndividualPartner/Companies

Owner reported InvalidProviderResponse in both screens and supplied metadata
`screen: CompanyPartner/create, language: en`, with branchId/f0 string-choice
metadata, plus the server Result HTTP400. This identifies the backend rejection
path. The exact raw provider output was not supplied; no assertion is made about
which field/type/finish reason caused that particular failure.

Source revealed one generic prompt example with unrelated sample keys and
`option_1` choices and no corrective request or field diagnostics. Final repair
replaces it with requested-key JSON schema and example, explicit key-vs-name and
string-choice instructions, all mandatory output keys and lower temperature0.2.
The schema is prompt guidance only; existing strict server validation remains.
One correction runs only after JSON/envelope/candidate mismatch inside the same
45-second total cancellation deadline. It regenerates the entire object, using
only fixed failure codes/requested keys, with no rejected provider body in the
prompt/log and no partial Apply/fallback. HTTP/auth/network failures and oversized
payloads remain immediate safe failures. Final invalid values/missing fields add
a localized suffix with at most8 sanitized requested field names. Server logs
fixed reason codes and sanitized requested keys; no credentials/body/values.

Files in this follow-up: `MockDataService.cs`, both `MockDataMessage` resources
(eight matching resource keys), and shared bilingual guide guidance. No frontend
API DTO, screen-specific field/control, key storage, entity/EF or migration change.
Public request/response envelopes remain unchanged. Safe identifier sanitation
uses installed net10 APIs; ILogger registration follows existing Business sources.
No new overrides or helper classes. Output sample values are prompt examples,
never applied as local fallback. Impossible required text maxLength0 is rejected
at the existing request boundary instead of constructing an invalid example.

The frozen handoff and plan carry the follow-up amendment. Owning BE18/skill/
CHANGELOG explain the reusable output boundary; generated packets regenerated
and checked. Shared guide now describes one correction, cancel and final failure.
Source diff/whitespace/resource XML/template syntax review remains source-only.
Owner must rebuild/restart the backend and replay both screen requests; confirm
string choices, exact fN keys, complete optional fields, missing/invalid values,
first-failure/second-success, second-failure suffix, provider cancellation and
timeout, and no values applied after a rejected final response. If failure
continues, fixed reason/requested-key logs now identify its category without
requiring raw response/key logging. This follow-up does not prove runtime success.

Phase1 amendment, Phase3 guide and Phase5 provider integration/Phase6 source
review applied; phases2/4 remain N/A. Backend worker provided a bounded read-only
audit while root maintained documentation; root owns integration. No prohibited
commands or paid provider requests ran. No additional migration is needed for
this repair. Suggested backend follow-up commit:
`fix(mock-data): align provider output with requested form fields`.

Repositories reviewed separately: `F:/My Work/Sigma/SiGmaAngularFrontEnd` and
`F:/My Work/Sigma/SigmaBackend`. The coordination root is not their Git root.
The adoption inventory names every form/import consumer and excluded form:
`AI_MOCK_DATA_ADOPTION.json`. Final source inventory has 254 editor roots,
456 module import owners, 150 excluded entries and no unsupported-template
parse entries. Imports also reach projected reactive sections; an import alone
does not enable a generator on a search/report form. No complete business-source
audit of those consumers was performed or authorized.

No screenshots/videos were supplied. Functional evidence is the owner's written
request and explicit choices: shared all-screen assistance, Create/Edit, form
fill → review → manual Save, Settings key, and plaintext development storage.
Missing/Conflicting/Uncertain business or API decisions: none remaining.
Runtime acceptance is pending and is not represented as verified behavior.

Existing Invoice, payroll, VAT, translation, guide, shared presentation,
migration/snapshot and configuration changes were preserved. In dirty files,
this task adds only its shared adoption, translations or guide registration.
Pre-existing Invoice guide imports/menu entries and tsconfig roots remain.
This task retains no tsconfig change: new sources are transitively imported;
no compiler diagnostic authorized additional explicit roots or broad includes.

Applied: PLAN-00 and phases 0/1/3/5/6. Phase2 was limited to the local candidate
preview's column/model comparison; no business list/filter/pager/export contract
was changed. Phase4 is skipped: no domain transition is added. No financial
calculation, child persistence, file lifecycle or permission API is introduced.

## Files changed

Frontend new shared files under `src/app/modules/shared/components/mock-data/`:
`mock-data.models.ts`, `mock-data-field.directive.ts`,
`mock-data-form.component.ts/html/scss`, `mock-data-forms.module.ts`, and
`deepseek-settings.component.ts/html`. Root service:
`src/app/modules/shared/service/mock-data.service.ts`.

Frontend existing behavior owners: Administration/Settings `ApiKeyComponent`
TS/HTML, `ApiKeyService`, `settings.routes.ts`, and SettingsLayout TS/HTML/SCSS.
EN/AR `mockData` vocabularies have 29 keys. The inventory records the mechanical
root attributes/imports, including two inline Sales reason/action dialogs.
In-app documentation: new `UserGuide/content/administration-guide.ts`, updated
`shared-screen-guidance.ts`, reader registration and Administration sidebar link.

Backend existing: `IApiKeySettingService`, `ApiKeySettingService`,
`ApiKeySettingProfiler`, `ApiKeySetting` entity/config,
`ApiKeySettingController`, and `DependencyResolver`.
Backend new: `IMockDataService`, `MockDataService`, internal
`SettingsModels/ApiKeySettingSecretVM`, `MockDataController`, five separate
`ViewModels/MockData` classes (Field, Generate, Candidates, Settings,
SettingsSave), and `MockDataMessage.cs/resx/ar-SA.resx`.
The Business csproj protection reference addition was reverted completely.

Full tracked scoped diffs are saved as `AI_MOCK_DATA_FRONTEND_SCOPED.diff` and
`AI_MOCK_DATA_BACKEND_SCOPED.diff`; untracked source additions were read directly.
Existing unrelated diff hunks in dirty touched files are not this task's changes.

## Decisions and final contracts

| Concern | Decision and source evidence |
|---|---|
| Existing owner | Extend rendered Angular reactive forms and existing ApiKeySetting; seed-data initialization remains outside scope |
| Editor shape | Preserve every owning screen shell; common attribute component projects existing native form contents and registers fields through the nearest context |
| API Key shape | Preserve its existing routed Settings tab; source-supported exception to simple settings modal default |
| Candidate persistence | None; Apply edits the current form only, using public CVA/widget events and existing form validators |
| Existing values | Confirm replacement through ConfirmationDialogService; 0 and false count as entered values |
| Rows/steps | Fill currently rendered supported fields; use existing child Add action first, retain existing forward/Save validation |
| Lookups | Only current loaded options, capped at100; local opaque-token mapping and live value recheck; no invented FK ids |
| Exclusions | Disabled/readonly/hidden fields, scalar identities, audit/state/derived fields, files/passwords/keys, search/report/auth forms; grouped/range/custom widgets remain with their owner |
| Temporal values | Local date/time formats with no UTC offset; PrimeNG receives Date, legacy native temporal controls retain strings; fractional seconds truncated to JS millisecond precision |
| Preview grid ↔ model | Columns `label`, `value`; rows additionally carry local `key` identity. No ListVM, paging query, count or export endpoint |
| Settings ↔ DTO | GET configured status/model only; PUT editable `apiKey` only, no tenant/id/audit/state input. Google PUT Mine carries `googleMapApiKey` only |
| Tenant/state | Existing repository/helper tenant scope, latest live settings row. No client ownership claim, no hidden-control security claim |
| Provider | Fixed HTTPS DeepSeek URL, backend bearer, JSON output, thinking disabled, configured model default deepseek-flash, 45-second bounded request |
| Data passed to AI | Field names/types/constraints, route patterns with placeholders, opaque options; no form values, real lookup labels or record identifiers |
| Storage | Nullable plaintext DeepSeekApiKey max2048 by latest explicit owner instruction; write-only HTTP response and blank-preserve semantics remain |
| Save ownership | Independent Google/DeepSeek scalar sections use IServiceHelper upsert and one save; restrict whole-row modified flags to their owned scalar |
| Concurrency | Filtered unique live tenant index; concurrent first Save can fail and be retried. No automatic legacy duplicate deletion |
| Calculations | Candidates have no financial authority. Existing domain/backend calculations and normal Save validation remain owners |
| Success/errors | Generator and DeepSeek settings suppress both global feedback headers and own inline status. Google suppresses global error only; interceptor owns its success. Both declared failure and transport error handled |
| Cancellation | Sequential batches80, reduce only after all succeed; form/raw-value/control identity guards, request teardown and disabled-state restoration; no partial batch Apply |
| Authorization candidates | GET/PUT MockData/Settings, POST MockData/Generate and PUT ApiKeySetting/Mine use existing authentication. Settings/key changes and provider usage are future authorization candidates; no new permission mechanism added |

API comparisons are exact: `GET /MockData/Settings` →
`Result<{hasApiKey,model}>`; `PUT /MockData/Settings {apiKey}` → Result;
`POST /MockData/Generate {screen,language,fields}` →
`Result<{values}>`. Frontend MockDataField and backend MockDataFieldVM match
key/name/label/kind/required, numeric/length/decimal/date bounds and choice tokens.
Kinds and primitive value union match the frozen handoff. Provider JSON is checked
for exact keys, primitive types, bounds, unique allowed choices and local temporal
shapes. Missing/truncated/malformed output fails the whole operation.

Canonical settings compatibility amendment adds GET/PUT ApiKeySetting/Mine.
Legacy GetMapApiKey and inherited base routes remain. It resolves the prior null
first-row id and stale Google snapshot after DeepSeek creates the settings row.

## Reference conformance and overrides

| Concern | Owning block/reference | Final source evidence/status |
|---|---|---|
| Shell/title | UI1/3/13; Job editor and shared FeatureTitle/EditorDialog declarations | API Key uses editor page/panel/body/scroll/footer, title inside; mock toolbar preserves host form layout |
| Preview | UI13/24; EditorDialog/PrimaryActionButton/DataTable public inputs | Padded bounded780px/540px dialog, fill=true local unpaged table, existing palette/focus/header/footer owners |
| Pending/discard | UI10/28; ConfirmationDialogService and freezeFormState(s) | Common Generate confirmation/freeze and cancellation; API Key deferred CanDeactivate confirmation freezes both sections |
| Fields | UI16/17/19; current PrimeNG declarations, existing editor handlers | Public widget events/current choices/validators; native temporal compatibility only; no private component internals |
| Feedback | UI2/22/28; root interceptor-enabled HttpClient and error helpers | One error/success owner, Retry or repeat Generate, takeUntilDestroyed/finalize |
| Settings | BE16; IServiceHelper/SingleRowSettingsService/controller | Latest tenant row, create-if-missing, independent scalar updates, unique live index configuration |
| Guide | Master7; existing typed guide reader | Administration registration/menu/topic and shared bilingual guidance present |

The SettingsLayout parent uses container-fill only for apiKeySetting; applying
bounds generally would clip unreviewed legacy settings. This compatibility
exception was recorded before documentation promotion. Other consumer field,
action and persistence contracts were preserved; no documentation change is
used to excuse a new business mismatch.

| Backend override | Why inherited behavior is insufficient | Retained boundary |
|---|---|---|
| ApiKeySettingService.SaveMineAsync | Helper Repository.Update marks full row; independent section saves must not overwrite an unrelated stale key | Helper upsert, tenant latest row, own scalar modification, one Save, canonical Result messages |
| ApiKeySettingService.UpdateCoreAsync | Legacy generic full-row copy/update could overwrite a concurrently changed DeepSeek key | Tracked tenant/id load, InvalidInputAsync, Google-only edit, SaveUpdateAsync; remaining generic operations inherited |

AutoMapper preserves existing legacy ReverseMap declarations for compatibility,
adding necessary DeepSeek-member ignores on existing write directions. Internal
secret carrier maps only its key; new entity construction initializes required
GoogleMapApiKey to empty. No public secret map or candidate/entity mapping is
added. No record data carrier implementing implicit IEquatable is introduced
into the broad Business service scan. No named backend helper class shares a file.

## Reconciliation and source verification

| Contract/path | Producer ↔ consumer | Final evidence | Result |
|---|---|---|---|
| Generation | Frozen field/API handoff ↔ VM/service/controller ↔ Angular service/adapters | Exact kinds/fields/routes, bounded requests and strict candidate keys | Source-conformant |
| Settings | Latest owner plaintext amendment ↔ entity/helper/map ↔ typed password entry | No Data Protection dependency/old protected-member reference; no key response | Source-conformant |
| Google compatibility | Single-row API ↔ ApiKeyService/component | Mine read/save, empty first-load defaults, preserved independent scalar | Source-conformant |
| Apply/Cancel | Shared control context ↔ original editor | Identity/value/options/validator checks, dirty/touched/event owners, manual Save | Source-conformant; runtime pending |
| UI/accessibility | Shared dialog/table/buttons/state ↔ API Key shell/toolbar | Public inputs, labelled keys, live status, one content scroll/fixed actions | Source-conformant; visual/keyboard pending |
| Guide | Final routes/actions ↔ Administration/shared guide | Configuration, both Save buttons, preview/apply/cancel/manual Save, skipped fields/child rows | Source-conformant; navigation/print pending |
| Frozen plan | Initial plan ↔ recorded integration/owner amendments ↔ final code | First-save compatibility, index, parent shell exception and plaintext storage explicitly amended | Reconciled |

`AI_MOCK_DATA_VERIFY.cjs` performs source parsing and exact mechanical adoption
reconciliation only, not compilation or application execution. Angular HTML
parsing and TypeScript source syntax parsing reported zero diagnostics; EN/AR29
keys match. 630 routine consumer diffs reverse to HEAD after removing only shared
imports/root attributes and normalizing line endings/trailing whitespace. Other
behavior/new/dirty files were read separately. Full scoped tracked diff whitespace
checks passed. No merge markers or stale removed encryption symbols were found
in scoped sources. MockData resource XML parses and both resources have seven
matching keys. Source inspection verified DI scan/HttpClient wiring, existing
bearer interceptor path, public widget members and actual base signatures.

Backend worker's final read-only audit found the plaintext names/length/mappings,
DI removal and scalar preservation source-consistent. UnitOfWork returns success
after a completed Save even with zero affected rows, so saving the same key is
successful. This is source evidence, not a concurrent-save runtime test.

Owning UI13/BE16 blocks, skill rules/revision row and CHANGELOG were synchronized.
Generate-SigmaRecipes.ps1 regenerated PLAN00 and PHASE00–06, and final -Check
passed all8. Semantic review checked updated UI13/BE16 provenance, shared-owner
reference roles, D4-2 exception handling, one-save settings ownership, plaintext
owner amendment and source-only final gate; no generated packet was hand-edited.

### Responsive acceptance matrix

| Range/boundary | Source behavior | Owner acceptance |
|---|---|---|
| Desktop, including1365 and1200 | Existing host shells; wrapping toolbar; bounded shared dialog and API Key content | Pending |
| Shared dialog1099/1100 | Existing EditorDialog breakpoint/max-width owner, no local override | Pending both sides |
| 900/768/767/720/620 | Dialog's shared narrow viewport bounds, wrapped toolbar/footer; API Key parent tabs horizontally scroll | Pending both sides/intermediate widths |
| Small/short320–480 and portrait/landscape | Dialog max-height owner, internal content/table scroll, fixed actions; existing consumer screen geometry retained | Pending |
| Every range EN/AR, light/dark | Shared button/dialog/table/state and logical toolbar styles; no new palette | Pending visual/keyboard/focus-return |

## Owner verification and migration

Before applying the migration, reconcile any existing duplicate live
ApiKeySetting rows for each SubscriptionId. Source only configures the index;
this task does not inspect or alter database data. Suggested unique migration
name (no same-name source file found):

```powershell
Add-Migration AddDeepSeekMockDataKey
```

Review the generated migration for nullable DeepSeekApiKey nvarchar(2048) and
unique SubscriptionId filtered by IsDeleted=0, then apply it through the owner's
normal workflow. No migration or snapshot file was created or edited here.

Owner checks:

1. Build/start both repositories using their normal workflow; verify module
   scope on routed editors, nested/projected sections and inline dialogs.
2. Configure key from Settings/API Key. Check first Save without any row,
   configured status, blank preserve, same-key success, replacement, Google
   independence, failed load/Save Retry and dirty-route cancellation.
3. Check two tenants and simultaneous initial/settings-section saves; verify the
   index prevents duplicate rows and failed concurrent first Save can be retried.
4. Generate in Create/Edit, confirm entered values including0/false, preview,
   Apply/manual Save, Cancel during provider request and after preview, form
   replacement/navigation while pending, malformed provider output and failure
   in a later80-field batch. Confirm no business record changes before Save.
5. Check text/email/numeric validators, binary checks, dates/times/month,
   required/nonnullable values, current/dropdown-dependent options and existing
   event handlers. Add child rows normally; generate each rendered step.
   Confirm View/disabled/readonly/secrets/files/calculated fields stay excluded.
6. Check missing/invalid provider key, provider timeout and Retry; verify the
   actual configured provider model/account supports the frozen JSON operation.
7. Complete the responsive matrix, keyboard/focus-return, both languages/themes,
   `/UserGuide/administration` sidebar/topic navigation and print behavior.

Build/runtime/browser/database verification remains pending. No tests are
claimed. Unsupported widgets and unavailable/invalid dependent candidates are
skipped; normal screen and authoritative Save validation remain necessary.

## Agents and suggested commits

Canonical AGENTS controlled-delegation gate authorized one independent backend
workstream after the frozen API. Root implemented frontend/adoption/docs and
owned integration/full reconciliation. `backend_worker` used the routine
terra_worker role with inherited model because gpt-5.6-terra was unavailable to
the tool; it later performed bounded read-only sol_worker audits of integration
and the owner's plaintext amendment, retaining its inherited model. Non-overlapping
ownership reduced elapsed time without duplicating frontend discovery. Root
integrated/reviewed every result; the worker did not declare the whole task done.

Suggested commits only:

- Frontend: `feat(mock-data): add shared DeepSeek form filling and key settings`
- Backend: `feat(mock-data): generate form candidates with tenant key settings`
- Instruction/documentation owner: `docs(sigma): document shared mock data and settings contracts`

No builds, tests, lint, migrations, database commands, browser/application
automation, commits, pushes or deployment ran. No Sigma MCP or Graphify was used.
Official DeepSeek documentation was read to verify model/JSON/thinking API
parameters; no paid provider request was made by the agent.
