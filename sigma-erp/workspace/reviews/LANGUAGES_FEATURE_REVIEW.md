# Languages feature review and source-only reconciliation

| Status | Draft |
|---|---|
| Owner verification pending | yes |

## Scope and phases

**2026-10-14 handoff correction:** The owner expanded the request to complete database-backed Language texts, then explicitly requested a plan and no further implementation before approval. Earlier edits remain in the working tree and are not a completed deliverable. The tables below record intended conformance from the earlier limited refactor; they are superseded by this explicit pending register where source does not yet match. The new feature is not activated and no localization storage/API/runtime code has been added. Governing approval artifact: `LANGUAGES_MAINTENANCE_EVOLUTION_PLAN.md`.

| Existing draft finding | Final source evidence | Required reconciliation after approval |
|---|---|---|
| Confirmed Delete is currently blocked by its own pending state | `confirmDelete` emits into `deleteLanguage` before `finalize` clears `confirming`, while `deleteLanguage` gates on `actionBusy` | Release only the accepted confirmation's own flag before starting Delete, retaining independent mutation gates |
| Latest paging request is dropped while list loads | `onLazyLoad` checks `actionBusy`, which includes `loadingList` | Allow a new valid page/sort request to replace a pending read through existing `switchMap` |
| Date output differs from the frozen presentation | `createdAt` column currently uses `date`, freeze specified `dateTime` | Reconcile date contract with screenshot/source and implement consistently in grid/export |
| Export captures headings but not all status labels | `dataTableExportRows` callback has heading map only | Snapshot all translated heading/status keys at export start |
| Code remains a presentation derivation rather than persisted locale identity | `languageCode(name)` local lookup | New plan will introduce stable validated culture-code identity with a non-destructive legacy mapping |
| Implementation still needs complete diff/standalone review | Dense draft source and incomplete final comparison | Format/review target code and shared input/exports, route/guide/payload matches before marking source-complete |

No source edits were made after the user's explicit plan-and-wait instruction. Backend Language source remains unchanged. The historical frontend contract remains a record of its earlier restricted scope; the approved new plan will supersede it explicitly.

Applied Phase 00 discovery/evidence, Phase 01 API contract freeze, Phase 02 read/grid, Phase 03 detail/write, Phase 05 integration/runtime, and Phase 06 final reconciliation. Phase 04 was applied only to the existing Delete workflow. PLAN-00 was not required: this was a bounded replacement of a normal-entity list with a two-field modal, without a new business contract. Recipe `Generate-SigmaRecipes.ps1 -Check` passed before work and again before handoff. No build, test, lint, browser, database, migration, commit, push, deployment, Graphify, or Sigma MCP command was run.

## Evidence and unresolved requirements

Languages2 explicitly shows Create with required Language and Flag selects plus Cancel/Save. Languages1 explicitly shows Actions, Flag, Name, Code, Default*, Creation Time, a Set as default language menu item, and Change texts. The first four grid fields/actions and the two-field editor are implemented using the existing API. `Default*`, Set as default language, Change texts, and built-in-language edit/delete locks remain **Missing** because no matching backend entity state, endpoint, or permission contract exists. `IsActive` is retained as the existing backend field and is not relabelled as Default. These items require a separate owner contract and were not invented.

## Final conformance

| Concern | Canonical owner/reference | Final source evidence | Status |
|---|---|---|---|
| List shell/title | UI1/UI3, Workshop/Job list, shared FeatureTitle | `LanguagesComponent` uses `sigma-route-host`, `sigma-list-page/panel/header/table`, `app-feature-title`; Language is excluded from the duplicate Metronic toolbar title | Matched |
| Filter | UI4, shared FilterPanel/Job list | One typed `languageName` filter, `appFilterPanel`, `stableLayout`, shared Reset/Search/Export and no feature SCSS | Matched |
| Grid | UI5/UI6, shared DataTable/Job list | One typed `app-data-table`, Actions first through shared actions, typed columns, total count, shared date/status formatting | Matched |
| Paging/cancellation | UI6/UI28, Job list | `resolveListPaging` before state writes; `Subject` → `switchMap` → `defer`; `finalize` on all list paths | Matched |
| Export | UI8, shared `fetchAllPages`/`dataTableExportRows` | All matching pages, translated headers captured at click, shared formatting, whole export failure retained | Matched |
| Modal | UI13, shared `app-editor-dialog` | Controlled list-owned Create/View/Edit modal, padded body, record subtitle, one dialog body scroll owner, no local shell CSS | Matched |
| Form/validation | UI15/UI16/UI19/UI22 | Typed nullable dropdown controls, body-appended options, shared FieldError/StateMessage, mark-all-touched and first-invalid focus | Matched |
| Dirty close | UI10/UI27/UI28 | Shared confirmation, `freezeFormState`, controlled close/X/Escape/route and session checks | Matched |
| Translations/guide | UI23, Master7 | Language keys are present in EN/AR; Administration guide has `LANGUAGES_TOPIC` at `/Language` | Matched; owner runtime/navigation pending |

## Contracts and backend decisions

Grid order is Actions → Flag → Name → Code → Created By → Active → Creation Time. `LanguageGridRow` contains `id`, `languageName`, `flag`, `code`, `createdBy`, `isActive`, and `createdAt`; `code` is derived from the existing local language catalog, and invalid/unknown values remain empty rather than falling back to Egypt. The backend `LanguageListVM` already supplies the persisted fields; no backend file was changed. The inherited generic service supplies paging, count, filtering and soft delete. No AutoMapper change, calculated domain value, transaction change, entity/EF change, migration, or suggested migration command is required.

Add/Update payloads are `{ languageName, flag }` and `{ id, languageName, flag }`; tenant, audit, status, and derived code are excluded. GET `/Language`, GET `/Language/GetById/{id}`, POST `/Language`, PUT `/Language`, and DELETE `/Language?id={id}` remain the current endpoints. Standard mutation success/error feedback remains owned by the global interceptor. Read/export errors are inline and retryable.

## User guide handoff

Content file: `SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/languages-topic.ts`. Module guide route/menu: existing `/UserGuide/administration` and Administration sidebar User Guide entry. Topic identity: `language.title`, route `/Language`. It covers list columns, filter/reset/paging/export, Create, View/Edit/Delete, validation, dirty discard, retry behavior, server-owned values, mock-data draft behavior, and the unavailable default-language/text-catalog/lock workflows in English and Arabic. Reading, navigation, RTL, theme, overlay, and runtime acceptance remain owner-pending.

## Scoped files

Frontend: `Administration/Languages/components/list/{list.component.ts,list.component.html}`; `components/details/{details.component.ts,details.component.html}`; `language.routes.ts`; `models/{list,details,create}.ts`; `services/language.service.ts`; `constants/language-options.ts`; `modules/UserGuide/content/languages-topic.ts`; Administration guide and EN/AR language/general keys; toolbar title exclusion. Legacy Language SCSS/spec files were removed because the canonical shared components own presentation and runtime roots are no longer routed detail pages. The LayoutModule `LanguageService` removal is safe because the service is root-provided; unrelated existing LayoutModule changes were preserved.

## Owner verification

Exercise Create/View/Edit/Delete, dirty Cancel/X/Escape/route, required-field focus, Search/Reset, name sorting, paging and page-size changes, empty-last-page recovery, export after Arabic switch, failed list/detail/save/delete/export retry, body-appended dropdown overlays, Arabic RTL, dark theme, narrow viewport, keyboard focus, and duplicate-success ownership. Verify one protected GET and mutation carry the normal bearer path. Build/runtime/API/browser/database verification was not performed here.

Suggested commit messages (do not commit):

```text
SiGmaAngularFrontEnd:
refactor(languages): align list and editor with shared Sigma patterns

- replace legacy table-list with typed shared grid and cancellable paging
- use controlled Language Create/View/Edit modal with retry and dirty-close handling
- add bilingual language guide content and translations
```

Agent utilization: subagent delegation was attempted for a bounded list workstream but did not initialize; the root agent completed and reconciled the list and editor sequentially to avoid overlapping file ownership. Prohibited commands were not run.

## Superseding implementation — 2026-10-17
The owner explicitly approved the complete D1–D8 maintenance plan. The frozen full-stack contract is LANGUAGES_DATABASE_CONTRACT_FREEZE.md; implemented source and final reconciliation are recorded in LANGUAGES_FULL_STACK_REVIEW.md. Earlier Missing/excluded/default/text entries above remain historical and do not describe the new implementation. Owner migration/import/build/runtime acceptance remains pending.

