| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |

# Sponsorships review and implementation

User requested review and documentation fixes for `src/app/modules/Administration/SponserShips`. Frozen decisions: `SPONSER_SHIPS_SCREEN_CONTRACT_FREEZE.md`; bounded impact/rollout: `SPONSER_SHIPS_MAINTENANCE_EVOLUTION_PLAN.md`. No screenshots/videos supplied, no screenshot assumptions. No blocking Missing/Conflicting/Uncertain implementation contract remains. Actual legacy-data compatibility and runtime acceptance remain owner-pending.

## Manifest and phase result

| Item | Final evidence |
|---|---|
| Scope | existing SponserShips UI; its service/routes/models; exact i18n block; related provider removal; Administration guide topic; SponserShip backend service/config/read and update DTOs/resources |
| Shape | UI01 list + controlled modal, one Name field, no collections/totals/posting; backend pattern1 normal entity |
| Canonical reference | Workshop/Job list shell/filter/grid and export; actual shared EditorDialog composition; BranchService hooks; all reference files left unchanged |
| Initial tree | feature files clean; unrelated frontend/backend work already existed; vocabularies/guide/LayoutModule/resources had pre-existing changes and were preserved |
| 0/1 | source/evidence discovery and read/write/delete/route freeze |
| 2 | replaced ms-lib in existing list, applied-query paging/sort/export |
| 3 | one typed Create/View/Edit dialog with load/Save/retry/discard protection |
| 4 | only Delete applies: named confirmation, shared backend usages, soft delete and page refresh |
| 5 | root service/provider, existing lazy route/menu, list CanDeactivate and dialog event wiring |
| 6 | integrated scoped diff/contracts/translations/guide/source conformance reconciled |
| Skipped concerns | no reports/print, dates/lookup editor fields, child uploads/reconciliation, approval/posting/calculations or accounting effects: scalar Name entity |
| Packets | initial and final generator -Check: PLAN-00 and PHASE-00..06 all OK; no packet/book/template/manifest changes or regeneration required |
| Process correction | PLAN-00 schema/compatibility trigger recognized late; explicit addendum and bounded plan preserve this history, without falsely claiming planning preceded edits |

## Findings resolved and decisions

| Finding/decision | Final behavior and evidence |
|---|---|
| Legacy table and routed scalar editor | SponserShipsComponent now uses shared list host/shell/filter/title/DataTable; SponserShipDetailsComponent is mounted once per explicit dialog mode; obsolete create/details routes removed after no external caller found |
| Grid/read over-scope | Actions first, then id(number), name(text), createdBy(text), createdAt(dateTime). Frontend DTO and backend explicit ListVM properties are exactly Id/Name/CreatedBy/CreatedAt; CreatedBy nullable. Detail is LeanDetailBaseVm.Id + Name; record ID appears in subtitle |
| Filter contract | nullable positive Int32 id and name; toListParams serializes Filters[id]/Filters[name], pageNo/pageSize and stored-column sort. Generic backend predicate/order/count/clamp remain inherited |
| Applied filter lifetime | explicit Search snapshots id/name, resets page1; paging/editor/delete/export reuse snapshot. URL state restored through shared list-route-state. Invalid ID shows shared FieldError |
| Paging/async | shared default15 and 10/15/20/50/100 options; resolveListPaging before writes; unchanged event skipped, page-size-only change fetches; switchMap/defer replaces earlier reads and finalize pairs loader. API PageNo/PageSize/TotalCount/TotalPages are authoritative; out-of-range empty pages reload last available page |
| Full export | typed service fetchAllPages(100/page), applied filters/sort, current-language dataTableExportRows with exact grid columns; failed page prevents partial file; empty-after-change export shows error |
| Name rules | trimmed required nonnullable name/max250 in typed form. Existing AddBaseVmWithName max250 retained; feature UpdateVM now explicit Required/MaxLength250 instead of inherited50 (known BE backlog4). EF config max250 |
| Duplicate rule | Name is sole business label under BE2/8/13 normal-entity rules. Service UniqueColumns uses localized SponserShipNameExists, excludes self during update through base; live tenant/name unique index supplies DB concurrency support after owner migration |
| Write ownership | POST only name; PUT id/name. Removed subscriptionId/no from frontend Update model and requests. Tenant/number/audit stay backend-owned; no frontend calculations |
| Detail readiness and View | only matching successful detail enables Edit form. Failed/missing detail blocks Save with inline Retry. View disables form and hides primary Save; row Edit is the change path |
| Save/close | submitted form frozen through freezeFormState, repeat actions blocked, failure keeps draft; successful Save emits closed(true), parent reloads current applied query. View/pristine close silently; deferred dirty decision handles X/Cancel/Escape/navigation and restores canceled draft |
| Delete | existing Staff.SponserShipId dependency protected through RemoveWithChildrenAsync/EF metadata, includes other real inbound references. Named shared confirmation supplies warning. Success steps back if deleting only row on later page; failure retains row |
| Feedback | inline list/detail/export reads carry X-Skip-Error-Interceptor; apiErrorMessage/composedReadErrorMessage preserve safe messages. Mutations retain global success/error interceptor as sole feedback owner, with explicit failure callbacks/state recovery and no feature duplicate toast |
| DI/access | SponserShipService remains providedIn root/environment.baseUrl; removed only its duplicate LayoutModule provider/import. AppModule provides tokenInterceptor/errorInterceptor HttpClient; AuthGuard protects shell. No invented permission API |
| Shared extraction | reused DataTable, FeatureTitle, FilterPanel/Actions, EditorDialog, FormSection, FieldError, StateMessage, numeric directive, query/export/route/form-state/error helpers and confirmation presets. No new presentation/helper copy or reusable rule was introduced; no new book/skill rule needed |

## Action and override reconciliation

| Action | Source → target | API/service/UI | Dependency and recovery |
|---|---|---|---|
| Create | no record → live record | POST /SponserShip {name}; inherited AddAsync; createSponserShip; modal Save | validated required/max250/unique, busy guard, draft retained on failure, close+refresh success |
| View | live → unchanged | GET /SponserShip/GetById/{id}; inherited DetailAsync; getDetails; ID link/View action | matching snapshot; inline Retry; no mutation |
| Edit | live → changed Name | PUT /SponserShip {id,name}; inherited UpdateAsync; updateSponserShip; modal Save | tenant/existence/unique validation; loaded snapshot required; frozen save/draft recovery |
| Delete | live → soft-deleted | DELETE /SponserShip?id=; ISponserShipService/SponserShipService.RemoveAsync; removeSponserShip; list confirmation | EF usages/Staff blocker, one pending confirmation+mutation, global error, row retained, applied-query page recovery |

Only overrides: UniqueColumns (name-key rule) and RemoveAsync (dependency-aware deletion). Controller/interface remain generic. GetMany/Add/Update/Detail and ordinary generic operations need no duplicate overrides. Four existing explicit one-way AutoMapper maps remain unchanged: no ReverseMap/Ignore. Generic single-save EF/UOW transaction remains sufficient; duplicate serialization belongs to current shared ExecuteUniqueWriteAsync, no private transaction/calculation.

Approved-reference coverage: Job Create/View/Edit/Delete/Excel supported in corresponding CRUD slices. Lubrication Job, Labour Time, Close Job, Gate Pass, Quality Check, Logs and invoice/approval operations excluded because this entity has no Job, vehicle, time, approval or financial state. Generic activation compatibility endpoint retained without inventing a screen workflow. Authorization candidate: DELETE /SponserShip?id=; authentication/tenant enforcement is present, a granular permission mechanism remains the known owner-deferred backlog20.

## Final source conformance

| Concern | Target producer/consumer and comparison | Result |
|---|---|---|
| Shell/title | SponserShipsComponent host sigma-route-host; HTML list-page/panel/header; same Job chain; shared styles height100%/min-height0/overflowhidden, title margin8px | matched source; visual pending |
| Filters | list HTML appFilterPanel mainColumns2/stableLayout/resetRequested, FieldError reserve; actual FilterActions export registered | matched public contract |
| Grid | one DataTable, fill/lazy/page/rows/API total, typed actions/columns/sort whitelist, no table internals or feature SCSS | matched source |
| Dialog | actual EditorDialog inputs visible/mode/contentPadded/closeDisabled/saving; View primary hidden; flex-fill form/body/scroll under auto-height shared shell | matched source; runtime bounds/focus pending |
| Validation/state | FormSection compact and FieldError/StateMessage public exports/imports; actual IDs/aria-description; Required/250 consistent frontend+backend | matched source |
| Async/error | switchMap/defer/finalize/list-read skip header; detail identity/visibility; mutation callbacks retain state; deferred frozen discard | matched source |
| Read/write | grid property list equals ListVM; subtitle/name equals Detail; Add/Update contain name/id only; four convention maps inspected | matched source |
| Direct consumers | Staff details uses inherited getSelectList<Results<DropDownSelect>>, not narrowed List/Detail; symbol search found only generic backend consumers of VMs | GetSelect unaffected |
| Routes/providers | only empty child list route+guard; lazy /SponserShip and sidebar entry unchanged; root service uses AppModule client; obsolete route callers absent | matched source |
| Guide | Administration topic titleKey sponserShip.title, route /SponserShip, six EN/AR steps + two notes | matched final screen/backend constraints |

## Responsive/source matrix

Inspect shared stylesheet cascade, with no feature overrides. Every row still needs owner visual acceptance in EN/AR, LTR/RTL, light/dark, long names/errors, and desktop/narrow heights.

| Width boundary/range | Expected shared arrangement | Source evidence | Acceptance |
|---|---|---|---|
| >1250 | configured two filter tracks; wrapping toolbar; bounded fill rows/paginator | FilterPanel grid/mainColumns, DataTable fill, styles shell | pending |
| 1251/1250/1249, intermediate1000 | shared main grid becomes3 tracks; two controls occupy two tracks, labels/errors top aligned | FilterPanel <=1250 rule/stableLayout | pending |
| 1200/1199/1198 | translated disclosure appears below1200, initially expanded; values stay mounted on collapse | shared FilterPanel <=1199.98 | pending |
| 993/992/991 | outer gap changes20→12 around991.98; same card/scroll boundaries | styles --sigma-page-gap | pending |
| 721/720/719 | one filter track, toolbar stacks and actions stretch/wrap | FilterPanel <=720 final cascade; no inlineActions modifier | pending |
| 651/650/649 | title/actions share wrapping row, shared primary compact context | FeatureTitle/PrimaryActionButton <=650 | pending |
| 768/767/766;1100/1099/1098 | dialog width follows shared breakpoints; content remains bounded | EditorDialog public width/breakpoints/maxHeight | pending |
| 621/620/619; narrow360 | shared dialog hides subtitle/hint and moves footer inline-end; scroll region stays internal | EditorDialog <=620 rule; flex-fill chain | pending |

## Files changed

Paths below relative to their actual Git repository. No commits made. Stage only these task changes; shared files include pre-existing work.

Frontend: under `src/app/modules/Administration/SponserShips/`, `components/list/list.component.{ts,html}`, `components/details/details.component.{ts,html}` (replaced), `components/list/list.component.scss` and `components/details/details.component.scss` (empty files removed), `models/{list,details,create}.ts`, `services/sponsership.service.ts`, `sponsership.routes.ts`; `src/app/_metronic/layout/layout.module.ts` (only SponserShip import/provider); `src/app/modules/i18n/vocabs/{en,ar}.ts` (only sponserShip block); `src/app/modules/UserGuide/content/administration-guide.ts` (Sponsorship topic only).

Backend: `SiGma.Business/Services/SponserShipService.cs`; `SiGma.DataAccess/Configuration/SponserShipConfig.cs`; `SiGma.ViewModels/ViewModels/SponserShip/SponserShip{List,Detail,Update}VM.cs`; `SiGma.Helpers/Localization/Shared/GeneralMessage{,.ar-SA}.resx` (only SponserShipNameExists).

## Verification and owner handoff

Root reviewed complete feature diffs separately in frontend/backend repositories and task-owned hunks in shared files. Git diff --check passed for scope; no stale ms-lib, any, subscription/no payload, removed stylesheet reference, obsolete caller, merge marker or feature CSS copies found. Checked actual component/directive exports, imports and public inputs; tsconfig lib remains es2018/dom, no unsupported API/new compiler root. Translation script: 23 keys EN/AR, zero missing or case-only differences. Resource XML/key checked; root reconciled Arabic wording to existing الرعاية terminology. These checks establish source facts only, not compilation or runtime.

Required owner migration: `Add-Migration AddSponserShipUniqueNameAndNameLength250`, unique basename checked. Reason: EF Name max250 and live per-subscription Name unique index. Inspect duplicate live names (including legacy null/blank values) and names above250 before migration; resolve any actual data conflicts explicitly, never automatically merge/truncate. Migrations/model snapshots were not created, edited or run by this task.

Owner checks: compile both scoped applications; apply reviewed migration after preflight; create/edit names at250 and reject blank/>250/duplicate names; unchanged same-name update succeeds; concurrent duplicate saves fail safely; tenant isolation and Staff-used deletion retain protection; delete last row on later page; page-size-only/rapid paging and failed read Retry; failed Save preserves draft; dirty X/Cancel/Escape/navigation confirmation including Cancel/Accept; all-page filtered Excel/current-language headers; mock generation stays draft/manual Save. Check protected GET/mutation token headers without recording token and one success/error notification. Run responsive matrix and dialog focus entry/trap/return. Guide reader already imports ADMINISTRATION_GUIDE; `/UserGuide/:sectionId` + existing `/UserGuide/administration` menu entry serve the new bilingual topic, with navigation/theme/RTL/print acceptance pending.

Suggested frontend commit: `refactor(sponsorships): adopt shared list and editor dialog`.
Suggested backend commit: `fix(sponsorships): align name validation and dependency checks`.

Agent utilization: one bounded backend worker with inherited model (model override not requested), owned only seven isolated backend files after frozen contracts. Root owned UI/integration/artifacts and reviewed every output; parallel independent files reduced elapsed time without merge risk. Worker delivered edits and verification notes before its final-status capacity error; root verified the actual files/diffs, so completion is based on source rather than that failed terminal notification.

No builds, tests, lint, browser/app verification, database commands, migration execution, commits, pushes or deployments were run. No Graphify or Sigma MCP used. Unrelated changes and approved references preserved. Owner verification pending: yes.
