# Languages frontend contract freeze — 2026-10-14

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

**Later instruction, 2026-10-14:** The owner added screenshots1–7 and explicitly requested the complete new language-text feature, followed by "اكتب الخطة وانتظر من الموافقة". This historical freeze covered only the earlier frontend fixes and must not authorize the expanded work. `LANGUAGES_MAINTENANCE_EVOLUTION_PLAN.md` is the new approval handoff; no expanded implementation proceeds before approval. The earlier source changes remain draft and require the reconciliation findings recorded in `LANGUAGES_FEATURE_REVIEW.md`.

## Scope and evidence

User requests review and implementation of confirmed guide fixes in `src/app/modules/Administration/Languages`. Application changes are frontend-only; related Language backend is inspected to freeze the existing API. No schema, server validation, authorization, default-language or translation-catalog changes are authorized by this contract.

Canonical sources: Sigma AGENTS; sigma-screen-refactor; Master1–8; UI screen01 and UI1–10,13,15–16,19,22–29; BE9/13 for the existing inherited API. Recipe check on 2026-10-14 passed all eight packets. Phases00–06 apply to the existing frontend workflow; Phase04 owns confirmed Delete only. No PLAN-00: bounded replacement of a known record screen, without new domain behavior.

UI: type01 list with one controlled modal, fields only/no children/totals/transitions. Shared EditorDialog/UI13 is the modal authority (Vehicle/VehicleService are routed and not modal references). Job list is the approved list integration reference. Backend: existing normal entity generic LanguageService/LanguageController, no feature overrides. BranchService is the normal-entity reference; no backend implementation work.

Existing user changes: details.ts has Save/Cancel/Delete/Edit Bootstrap icons. Preserve these action meanings through the shared dialog/actions. Layout, toolbar, dictionaries, guide and many unrelated modules already have changes; modify only scoped lines and preserve the rest.

| Evidence | Classification | Decision |
|---|---|---|
| Languages2: Create, Language and Flag selects, Cancel/Save | Explicit | Same two fields, controlled EditorDialog, required frontend validation and manual Save |
| Languages1: Actions, name/flag, code, creation date | Explicit | Shared grid/actions; code derived from existing LANGUAGES by name, empty for unknown name; never use flag as language code |
| Languages1: Default*, English(Default), Set as default language | Explicit screenshot content; Missing persistence/API | Excluded from confirmed frontend fixes. IsActive is not IsDefault; do not relabel it. Requires a separate domain/default-locale contract |
| Languages1: Change texts | Explicit screenshot action; Missing source/API | Excluded; no text-catalog endpoint or editor exists |
| Languages1: built-in language edit/delete locks | Explicit note; Missing identity/state contract | Excluded; do not infer locks from names or IsActive. Access restriction requires owner decision |
| Dropdown requiredness, five flags, 49 language names | Confirmed existing frontend source | Preserve existing catalog and flag values; typed local options, no fabricated HTTP envelope or remote lookup |
| Creator and active state | Confirmed current grid/backend | Retain despite absence in screenshot; boolean/null preserved, translated display only |

## Frozen read/grid contract

Order: Actions → Flag → Name → Code → Created by → Active → Creation time.

| Grid/action need | Frontend model | Backend LanguageListVM | Decision |
|---|---|---|---|
| Identity | id:number | Id:int? | required for normal persisted rows/actions |
| Flag | flag:string\|null | Flag:string | raw value; render valid ISO/emoji only, no Egypt fallback |
| Name | languageName:string\|null | LanguageName:string? | link opens View; sortable |
| Code | LanguageGridRow.code:string | absent | catalog-derived, not sortable, display/export only |
| Creator | createdBy:string\|null | CreatedBy:string? inherited | sortable |
| Active | isActive:boolean\|null | IsActive:bool? inherited | status text, null empty, sortable |
| Creation time | createdAt:string | CreatedAt:DateTime inherited | shared dateTime, sortable |

Frontend drops unused flagPath and corrects id/isActive types. Backend inherits SubscriptionId/GUID/IsValid/IsChanged/No: known BE19 backlog6, outside frontend-only source edits; frontend neither declares nor sends them. No backend ListVM change.

| Control | Angular property | Query key | Backend owner/parser | Empty/default |
|---|---|---|---|---|
| Name contains | languageName:string | Filters[languageName] | Service.BuildFilterPredicate string Contains | trimmed empty omitted |

GET `/Language`: `pageNo`, `pageSize`, `Filters[languageName]`, `Filters[sortField]`, `Filters[sortOrder]` via toListParams. Base counts filtered rows before slicing; page1+, size1–100; frontend default15/choices10,15,20,50,100. Stored-field sorting via ApplyListOrder, Id descending tie-breaker. Default newest first. Name/createdBy/isActive/createdAt sortable; flag/code not sortable. List Subject→switchMap→defer; release loaders using finalize; declared/HTTP failure inline with skip-error header. Pagination can replace a pending read. Search resets page1; paging/refresh/export/mutations use last applied filters. Export fetchAllPages uses pages of100 and same columns/formatting; no partial file on any failure.

## Frozen editor/write contract

| UI | Typed control | Detail | Add | Update | Ownership |
|---|---|---|---|---|---|
| Language | string\|null required | LanguageName | LanguageName | LanguageName | client input, selected existing catalog/saved label |
| Flag | string\|null required | Flag | Flag | Flag | client input, retain exact emoji/code value |
| Identifier | no control | Id:number | absent | Id:number | server assigns; update target only |

GET `/Language/GetById/{id}`: Result<LanguageDetailsDTO>. POST `/Language`: {languageName,flag}. PUT `/Language`: {id,languageName,flag}. DELETE `/Language?id={id}`: Result<unknown>. Exclude subscriptionId/audit/derived code. Current backend has no catalog/required/duplicate-specific validators; frontend required choices do not claim server enforcement. No new uniqueness rule, length, default flag or access restriction.

Create/View/Edit use the same list-owned component/input mode and session id. View reads detail labels, no edit-only options needed, form disabled; shared footer Edit supported after successful read. Saved choices absent from the local catalog remain selectable with their actual source text, not overwritten to empty. Failure blocks Save and offers detail Retry; failed writes preserve the draft. Busy and pending discard freeze reactive controls through freezeFormState. Close/X/Escape/route use one deferred discard decision; pristine/View exits silent. Block departure while Save/detail/discard/mock pending. Parent closes/destroys modal after accepted exit; successful Save refreshes exactly once. No ordinary Save confirmation. Shared 640px content-sized padded shell, intrinsic flex-fill body, one internal scroll owner, no feature SCSS. Record id belongs in subtitle.

Routes: `/Language` list only, canDeactivate delegates to open editor. Retire internal `create` and `details/:id` routed forms; direct consumer search found no caller outside this module. Operational sidebar `/Language` unchanged. URL list state retained. No extra route or parallel editor.

## Action coverage and feedback

| Reference action | Classification | Target |
|---|---|---|
| Create/View/Edit/Delete | Supported | generic existing API, shared modal/actions and record-aware delete confirmation |
| Search/Reset/paging/Refresh/Excel | Supported | inherited filtered/paged API; no new endpoint |
| Job labour time/close/cancel/quality/log/gate pass/invoice/estimation | Not Applicable | Language has no Job/financial/state aggregate |
| Set default/Change texts/built-in locks from screenshot | Missing, excluded | requires separate domain contract; no implemented substitute |

Delete source live row→existing backend soft-delete path; success refreshes applied page, recovers last empty page; failure retains row. No feature authorization mechanism; AuthGuard and backend Authorize are authentication only. Authorization candidates: POST/PUT/DELETE Language, no invented permission service. Standard writes retain interceptor success/error feedback exactly once; reads and export own inline failures and skip error interceptor. Backend overrides/maps/calculations unchanged. Schema impact none; Add-Migration not required.

## Conformance evidence before implementation

| Concern | Owning block | Actual reference/shared owner | Target commitment |
|---|---|---|---|
| Bound host/title/list | UI1/3 | Job list host sigma-route-host and sigma-list-page/panel/header/table; FeatureTitle | identical shell classes; toolbar suppresses Language duplicate title |
| Filters | UI4 | Job form appFilterPanel; shared FilterPanel/FilterActions | name control, stableLayout=true; shared Reset/busy/34px/RTL, no local styling |
| Grid/paging | UI5/6/28 | Job bindListQueries/onLazyLoad; DataTable columns/inputs | one grid, default15, resolveListPaging before writes, switchMap/defer, authoritative totalCount |
| Export | UI8 | fetchAllPages/dataTableExportRows | complete filtered pages and shared date/status transforms |
| Modal | UI13 | EditorDialog public declarations and UI13 controlled composition | contentPadded, supported modes/inputs, intrinsic flex-fill chain; no tabs for two fields |
| Form/errors/choices | UI16/19/22 | shared FieldError, StateMessage, focusField | nullable select controls, body overlays, mark/focus invalid, Retry |
| Dirty exit | UI10/28 | ConfirmationDialog.confirmDiscard; freezeFormState | deferred/session-aware decision, accepted close before finalize, draft restored only if same session |
| Guide | Master7 | UserGuide existing Administration reader | pending languages-topic.ts, registered existing module guide, bilingual actual workflows |

Final source comparisons and owner acceptance live in LANGUAGES_FEATURE_REVIEW.md (pending creation).

## Superseding implementation — 2026-10-17
The owner explicitly approved the complete D1–D8 maintenance plan. The frozen full-stack contract is LANGUAGES_DATABASE_CONTRACT_FREEZE.md; implemented source and final reconciliation are recorded in LANGUAGES_FULL_STACK_REVIEW.md. Earlier Missing/excluded/default/text entries above remain historical and do not describe the new implementation. Owner migration/import/build/runtime acceptance remains pending.

