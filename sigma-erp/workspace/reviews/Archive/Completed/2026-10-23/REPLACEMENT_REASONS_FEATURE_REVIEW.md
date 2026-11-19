| Status | Owner verification pending |
|---|---|
| Implemented — source-only | yes |

# Replacement Reasons feature review

Contract: `REPLACEMENT_REASONS_FRONTEND_CONTRACT_FREEZE.md` (Frozen, 2026-10-14).

Confirmed findings: legacy ms-lib table and separate routed editor; string identity mismatch against int API; empty row-action callbacks; server-owned write fields; incomplete error/finalize/dirty lifecycle; missing Arabic screen keys; oversized backend list/detail DTOs and ReverseMap; inherited delete has no usage check (known BE backlog31, addressed only for this feature). No uniqueness/requiredness/schema changes supported by source.

## Implemented result and decisions

Replaced the existing list/editor in place with UI01 shared shell and a list-owned controlled Create/View/Edit modal. Retained the multiline nullable reason, existing mock-data assistance and current API routes; View is read-only/Close only. Removed server-owned write fields and corrected int identity. Added source-supported filters, server paging/sort, complete Excel export and dirty-route/close guards. Backend read contracts now contain consumed fields only; four one-way maps replace ReverseMap. ReplacementReason delete now checks real EF usages through the shared helper, without a feature-local reference list. No entity/EF/write-validation/uniqueness/calculation change; Add-Migration is not required.

### Files changed (repository-relative)

**SiGmaAngularFrontEnd:**

- `src/app/modules/Administration/ReplacementReasons/components/list/list.component.ts` and `.html`: shared shell/title/filter/table; typed actions; paging/sort, applied URL state, inline errors/retry, all-page export and list-level CanDeactivate.
- `.../components/details/details.component.ts` and `.html`: padded controlled modal; typed form and payload; detail readiness/session checks; loading/save finalization; failed-save draft restoration; common deferred discard guard; textarea preserved; existing OnPush preserved.
- `.../models/create.ts`, `details.ts`, `list.ts`: separate Add/Update and lean read/filter contracts, numeric identity/nullability.
- `.../services/replacementreason.service.ts`: typed list/detail/write wrappers over existing routes, root client, shared serializer/all-pages helper; inherited getSelectList retained.
- `.../replacementreason.routes.ts`: single list route with CanDeactivate. Legacy create/details URLs removed; no external source consumers found.
- Deleted two empty component SCSS files and two incorrect scaffold spec files (one imported a nonexistent DetailsComponent; the other tested an unrelated widget). No meaningful feature test was removed and no tests were run.
- `src/app/_metronic/layout/layout.module.ts`: removed only ReplacementReasonService import and its two redundant provider registrations; root providedIn registration remains, including Lease lookup consumer.
- `src/app/modules/i18n/vocabs/en.ts`, `ar.ts`: only replacementReason block changes for this task; existing unrelated hunks retained.
- `src/app/modules/UserGuide/content/replacement-reasons-topic.ts` (new), `administration-guide.ts`: bilingual topic and existing guide registration/overview. Other topics retained.

**SigmaBackend:**

- `SiGma.ViewModels/ViewModels/ReplacementReason/ReplacementReasonListVM.cs`, `ReplacementReasonDetailVM.cs`: lean read contracts.
- `SiGma.Business/MapperConfig/ReplacementReasonProfiler.cs`: Add→entity, Update→entity, entity→Detail, entity→List; no ReverseMap/Ignore or new mapping registration.
- `SiGma.Business/Services/ReplacementReasonService.cs`: single justified RemoveAsync override; other generic operations inherited.
- Deleted unused `ReplacementReasonFullListVm.cs` and `ReplacementReasonDeleteVm.cs`: symbol/project-reference searches found declarations only; no endpoint consumed either.
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx`, `GeneralMessage.ar-SA.resx`: EntityLeaseAgreementVehicleReplacement category key only. Existing unrelated resource changes retained.

## Final contract comparisons

| Path | Final producer ↔ consumer evidence | Source status |
|---|---|---|
| Columns/ListVM | Grid Actions, id(number), reason(text/link/wrap), createdBy(text), createdAt(date) ↔ frontend id/reason/createdBy/createdAt ↔ backend Id/Reason/CreatedBy/CreatedAt only | Matched |
| Removed read plumbing | List no longer inherits SubscriptionId, IsActive, IsValid, IsChanged, No, GUID; Detail no longer inherits tenant/audit/flags/No/GUID. Detail is LeanDetailBaseVm.Id + Reason; the modal reads only those | Matched |
| Filters | form id nullable Int32 → Filters[id] equality; reason/createdBy optional trimmed text → matching entity Contains; createdAt valid local day → Filters[createdAt] yyyy-MM-dd → BuildFilterPredicate Date comparison. Empty values omitted, id0 preserved; flags/enums/multiselect N/A | Matched |
| Paging/sort | currentQuery explicit pageNo/pageSize; defaults15/options10,15,20,50,100; resolveListPaging before writes; stored-column whitelist from columns; Service.NormalizePaging cap100 + CountAsync + Id tie-breaker; switchMap cancels superseded read | Matched |
| Invalid initial URL | appliedQueryReady prevents lazy paging/Excel before a valid filter snapshot. Invalid ID/date displays FieldError, Search/Reset can recover | Matched |
| Applied vs draft | applyDraftFilters occurs only on valid Search/initial restore; lazy paging/export/delete/editor refresh retain that snapshot via readListRoute/writeListRoute | Matched |
| Export | getAllList→fetchAllPages(pageSize100); fail-all on declared/HTTP page failure; dataTableExportRows uses four displayed columns; translated headers captured before request, dates use shared formatting; no partial file | Matched |
| Detail/write | GetById detail Id/Reason; typed textarea string converts trimmed empty to null; POST reason, PUT id+reason only; nullable VMs and TrimIncomingStrings support optional input/no imposed max/duplicate rule | Matched |
| Save/read errors | successful detail required before Edit Save; failure keeps modal open with Retry; read failures inline under X-Skip-Error-Interceptor; saving freezes exact draft, failed saves restore it, success emits closed(true)→parent remount teardown and applied refresh | Matched |
| Discard/navigation | CanDeactivate returns defer; stale/duplicate/pending work rejected; freezeFormState preserves prior disabled controls, values and dirty state; X/Cancel/Escape share requestClose; accepted decision does not reject its own pending flag; View/pristine leave silently | Matched |
| Delete | confirmDelete identified row+subtitle+warning → DELETE?id → IService/SiGmaControllerBase → ReplacementReasonService.RemoveAsync → RemoveWithChildrenAsync/InUseAsync; real LeaseAgreementVehicleReplacement FK blocks deletion. Missing/foreign tenant follows shared lookup. Success reloads applied page/back-one; failure retains row | Matched |
| Feedback | Reads inline with suppressed interceptor; mutations interceptor-only success/error. finalize pairs every loading start/end on success/failure/destruction; no error callback that returns undefined | Matched |
| Integration | pages/routing.ts lazy `/ReplacementReason` entry and existing menu; root providedIn service through AppModule interceptor-equipped HttpClient; no feature client/manual bearer; Lease vehicle-replacement getSelectList preserved | Matched |
| Guide | new typed bilingual topic imported in ADMINISTRATION_GUIDE, already registered in GuideReader; existing `/UserGuide/administration` menu; link `/ReplacementReason`, no per-screen duplicate guide route | Matched |

## Final reference conformance

| Concern | Book/reference | Actual target/shared values compared | Result |
|---|---|---|---|
| Container/card/title | UI1/3/6; Job list HTML | ReplacementReasonsComponent sigma-route-host; section/page/panel/header/table match Job. Global host height100%, min-height0, clipped outer overflow; title/filter/table8px logical edges; shared title bottom8px | Source matched, visual pending |
| Filters | UI4/19; Job filterForm; FilterPanel declarations/SCSS | mainColumns4 for four confirmed fields; stableLayout true; defaults34px/column gap16px/row gap7px/action gap8px; Reset handled; FieldError reserves Int32/date feedback; component and directives registered from exact exports | Source matched, visual pending |
| Table | UI5/6/8/28; DataTable declarations; Job bindListQueries | exactly one shared fill/lazy table; rows scrollbar/paginator ownership retained, no feature SCSS/deep override; Actions first, all sortable fields stored; total from response; complete export through shared owners | Source matched, runtime pending |
| Editor | UI10/13/15/27; shared EditorDialog TS/HTML/SCSS and controlled composition | contentPadded true; auto-height form/body/scroll all flex-fill; no local padding/viewport calc; same component explicit create/view/edit, View primary hidden; shared closeButtonId/focusField and confirmation presets | Source matched, runtime/visual pending |
| Backend | BE3/4/7/8/13; BranchService/BranchProfiler | lean actual flattened DTOs, four one-way maps; only RemoveAsync override for concrete usage safety; generic APIs/paging/map/save inherited; no additional transactions | Source matched, API pending |

Reference action coverage: Create/View/Edit/Delete and complete Excel are supported. Workshop lubrication, document editor, log/close/invoice/approval/print/card actions are N/A because ReplacementReason has no corresponding aggregate/state/workflow. The old toggleActive callback did nothing; no activation UI/status contract is invented. Existing generic backend select/activation endpoints remain. No uploads, collections, money/VAT, totals, approval or posting apply. Authorization candidates are POST/PUT/DELETE ReplacementReason; no fine-grained authorization mechanism is invented (UI26).

Override audit: only ReplacementReasonService.RemoveAsync exists, justified by inbound-reference checking. No controller overrides; no redundant Add/Update/list/detail override. Shared entity EF transaction/audit/tenant machinery remains authoritative. No new migration, uniqueness index, length or required constraint.

## Responsive source matrix (all visual acceptance pending)

| Widths / sample | Expected source arrangement and inspected owners |
|---|---|
| 1440,1251,1250 | FilterPanel four fields then three tracks at1250; fixed toolbar/title and DataTable fill; internal row scroll; shared dialog max width and1099 breakpoint |
| 1200,1199,1100,1099 | Filters shared native disclosure below1200 retains mounted fields/values; dialog94vw at1099; no outer page scroll |
| 992,991,900,768,767 | Shared page gap20→12 below992; dialog narrow width at767; filter three tracks; theme/logical owners retain alignment |
| 721,720,700 | Shared one-column filters at720 and toolbar wraps; shared page/panel padding4px/4px6px; table horizontal overflow internal |
| 651,650,621,620,520,519,375,320 | FeatureTitle wrapping/shared smaller Add at650; EditorDialog shared subtitle/hint hidden at620 (guide explicitly names wider-screen subtitle); confirmation width changes at520; narrow forms/actions retained via shared owners |
| Short/tall height; EN/AR, LTR/RTL, both themes | maxHeight shared shell; editor scroll retains intrinsic textarea sizing; fixed modal footer; long reason uses wrapped shared grid link; reserved filter feedback. Owner must verify tall expanded filter content and usable grid height, keyboard focus trap/return, long messages/labels and intermediate sizes |

No feature-specific responsive/palette/table style was introduced. These are inspected CSS arrangements, not claims of visual success. The target retains the actual approved shared responsive subtitle behavior.

## Guide completion

Content: `src/app/modules/UserGuide/content/replacement-reasons-topic.ts`, imported once in existing Administration guide. Route/menu: `/UserGuide/administration` under Administration; screen link `/ReplacementReason`. Covers purpose/login, filters/reset/paging/sort/all-page export, Create/View/Edit/Delete, optional text/no max/uniqueness, dirty close/route and pending-work gates, failure Retry, shared mock assistance/manual Save and deletion usage constraint. EN/AR content checked against final source, including narrower shared header behavior. Guide navigation/reading/RTL/theme/print remain owner-pending.

## Verification, phase coverage and residual risk

- Phases0/1: discovery/freeze; phases2/3: list/read/export and modal/write; phase4: confirmed Delete only; phase5: route/provider/events; phase6: scoped source reconciliation and guide handoff.
- Skipped PLAN00 (bounded confirmed conformance), financial/aggregate/upload/report/posting/activation implementation (domain N/A). No screenshot evidence supplied; no unresolved Missing/Conflicting/Uncertain business/API choice blocks this scope.
- Recipe initial/final -Check passes PHASE00–06 and PLAN00; packets semantically match selected source roles. No canonical/template/manifest changes or generated-file edits/regeneration needed.
- English/Arabic replacementReason parity:20 keys each,0 missing/0 casing differences. GeneralMessage files XML parsed and category key checked in both resources.
- Complete scoped diff reviewed separately in actual frontend/backend repositories; shared files reviewed for this task's specific hunks alongside pre-existing changes. Import/export/standalone/public-input paths, consumer symbols, obsolete routes/DTOs, merge markers and whitespace checked. Source-only reviewer audit caught and corrected header language timing and missing category translation.
- No new shared extraction required: repeated presentation, filters, table, states, confirmation, form-freeze, dates, paging/URL serialization and export all adopt existing shared owners. Feature-specific applied filter/session/action orchestration remains in feature; no new reusable rule introduced, so no book/skill learning row required.
- Agent utilization: one backend_worker using the inherited root model (no override; mapped terra unavailable), eight owned backend files incl two resource additions; then read-only frontend audit. Root owned freeze/frontend/guide/integration/final diff. Disjoint files after freeze reduced independent backend/frontend wall time without merge overlap.
- No build, tests, lint, browser automation/application verification, database commands, migrations, snapshot edits, commits, pushes or deployments run. Existing unrelated migrations/snapshot/source changes were preserved.

Owner acceptance: compile frontend/backend; verify CRUD and map/list/detail/API shapes; optional empty/multiline reason Save; delayed/failed detail/save/delete/list and loader recovery; dirty X/Cancel/Escape/route confirmation including Cancel and mock pending; ID/date invalid URL and corrected Search/Reset; size15→50 on first page and stale paging cancellation; filter/sort persistence; export >100 rows with EN/AR language switched mid-request and failure on a later page; delete unused/referenced/missing/foreign-tenant records and last-row page; Lease vehicle-replacement select; guide navigation; complete responsive matrix/RTL/themes/keyboard/focus return. Read-shape narrowing and removal of obsolete editor URLs may affect unknown external consumers/bookmarks; no direct in-repository consumers remain. Runtime races and API serialization are not certified by source review.

Suggested commits (suggest only, stage this scope separately from pre-existing edits):

- Frontend: `refactor(replacement-reasons): adopt shared list and modal editor`
- Backend: `fix(replacement-reasons): slim reads and guard referenced deletes`

Final status is Implemented — source-only, not runtime Closed.
