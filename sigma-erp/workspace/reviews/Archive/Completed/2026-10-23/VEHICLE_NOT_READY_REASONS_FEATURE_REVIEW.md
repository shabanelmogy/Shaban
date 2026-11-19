# Vehicle Not Ready Reasons — feature review

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |

Frozen frontend handoff: VEHICLE_NOT_READY_REASONS_FRONTEND_CONTRACT_FREEZE.md. Frontend scope only; backend read-only evidence. No screenshots/video; no new business rules. Confirmed findings: console-only Create/Update, no-op list Delete, untyped form/filter/action/payload, tenant/audit/flags sent, legacy table/routed simple editor, missing error/finalize/dirty/delete handling, no screen guide and missing AR feature translations. Existing icon and unrelated shared/source changes preserved.

## Pre-edit conformance evidence

| Concern | Book | Approved source | Shared owner | Target decision |
|---|---|---|---|---|
| List fill/title | UI1/3 | Job list metadata/template | styles.scss sigma-route-host/list shell, FeatureTitle | Same primary card/container-fill chain, no local CSS |
| Filter | UI4/17/19 | Job list, DatePicker/FieldError actual public exports | FilterPanel stableLayout, date-utils/scalar validators | Id/Reason/CreatedBy/CreatedAt, Reset/Search/Export, validation reserves, ordinary toolbar |
| Table/paging/export | UI5/6/8/28 | Job list bindListQueries/onLazyLoad/export | DataTable, toListParams/resolveListPaging/fetchAllPages/dataTableExportRows | Actions +4 retained columns; API total15 default; cancellable reads/all matching export |
| Modal | UI13/15 | EditorDialog TS/HTML/SCSS and controlled composition | EditorDialog/FormSection/shared editor fields | Padded content-sized form/body/scroll flex-fill, one optional Reason field; View Close only |
| Async and exits | UI10/22/28 | ConfirmationDialogService/form-state/StateMessage | Same owners | Inline retry for reads, global mutations, deferred frozen same-session discard |
| Theme/RTL/responsive | UI24/25/27/29 | Shared styles/filter/table/dialog | Existing owner tokens/focus/scroll | No local palette/breakpoint/viewport subtraction; owner visual acceptance pending |

## Final reconciliation and decisions

| Concern | Actual source producer/consumer comparison | Status |
|---|---|---|
| Shape/routes | UI13 fields-only type01; VehicleNotReadyReason_Routes list only; editorSession mode/id mounts one controlled editor | Source matched; old create/details URLs retired |
| Grid/ListVM | Actions then id:number/link, reason:string|null, createdBy:string|null, createdAt:string/date; VehicleNotReadyReasonListVM Id/Reason/CreatedBy/CreatedAt | Required fields matched; audit columns preserved; unused inherited server fields deferred |
| Id filter | optional typed Int32 → Filters[id] → generic BuildFilterPredicate numeric equality | Empty omitted, zero/sign retained, fraction/out-of-range rejected |
| Reason/creator filters | trimmed optional text → Filters[reason]/Filters[createdBy] → generic Contains | Keys matched, empty omitted |
| Creation date filter | optional Date|string|null with dateValueValidator/DatePicker mask → parseDateValue yyyy-MM-dd → Filters[createdAt] → generic DateTime.Date equality | Exact day, no month/range default invented; saved route day hydrates via toPickerDate |
| Paging/sort |15 default and10/15/20/50/100; resolveListPaging against prior state; base NormalizePaging max100/CountAsync/Skip/Take; sortable set from4 stored columns | API totalCount, stable inherited tie-breaker, initial newest first, unchanged event skipped, size-only event fetches, last page recovery |
| Applied queries | Search commits activeFilters; list/export/mutations use same snapshot and URL helpers | Draft edits do not alter current results; invalid initial restored filter cannot trigger unfiltered lazy refresh/export before a valid query is applied |
| Read lifecycle | bindListQueries switchMap/defer/catchError/finalize; getList/getDetails skip error header; detail id/session guard and takeUntilDestroyed | Inline StateMessage/Retry owns both failure channels; loader paired; newer paging cancels older request |
| Export | getAllList fetchAllPages captures query; exportExcel dataTableExportRows includes all4 columns translated at click time, date formatted | All matching pages, no partial file on failure, exportBlocked while busy/no applied query; separate inline error/retry |
| Details/payload | loaded id/reason only; typed nonnullable reason control; null displayed empty; Save trims and sends blank as null | Add reason, Update id/reason only; no tenant/audit/GUID/flags; API optional semantics retained |
| Validation | Reason no Required/MaxLength/uniqueness because entity/Add/Update declare none; filter validators shared with FieldError/focusField | No unsupported invariant invented; filter errors revealed/focused |
| Save | actual createReason POST/updateReason PUT now replace console.log; Result checked; freezeFormState, restoreDraft on both failure channels | Standard interceptor feedback once; failed Save retains values; success emits closed(true), applied list refresh |
| View/close | disabled loaded form; primaryActionVisible false in View, Close only; list Edit action separate | Source matched, no mutation from View |
| Dirty exits | route deferred guard delegates to mounted editor; X/Cancel/Escape requestClose; defer identity/busy checks, freezeFormState/confirmDiscard/finalize | Same-session/cancellation restoration; accepted decision not blocked by its own pending flag; mock generation frozen form blocks exits |
| Delete | typed row id integer-positive, shared named destructive confirmation with optional reason plus translated numeric identifier; deleteReason DELETE → inherited RemoveAsync | Former no-op replaced; guarded single execution; failure retains row; last-row later-page decrement and applied refresh |
| Providers/title | providedIn root service, both redundant LayoutModule providers/import removed; AppModule one token/error client; toolbar excludes /VehicleNotReadyReason | Existing route/menu retained; no manual auth header or client fork; duplicate title suppressed |
| Translation/guide |20 matching vehicleNotReadyReason EN/AR keys; bilingual topic registered in ADMINISTRATION_GUIDE | Existing GuideReader and /UserGuide/administration menu reused; source-conformant content |

## Final reference conformance and responsive evidence

Pre-edit table reconciled with final consumers: list host sigma-route-host and template sigma-list-page/panel/header/table give the same Job reference fill chain; DataTable lazy/paginator/fill=true keeps row scrolling internal and pager fixed. FeatureTitle inside the primary card and ordinary FilterPanel stableLayout=true/mainColumns4 retain shared title/filter/grid margins and action toolbar. DatePickerDirective and NumericFocusDirective exports checked at their exact owning files and registered in the standalone list; CalendarModule and FieldError registered. No feature stylesheet exists.

EditorDialog uses contentPadded=true/default public width/maxHeight, controlled visibility, focusOnShow=false with unique closeButtonId and focusField after shown/read. Its form/body/scroll all use shared content-sized flex-fill; one sigma-editor-scroll owns overflow, fixed dialog header/footer. Reason is full-span within shared field grid; FormSection owns the group presentation, MockDataFormsModule retains draft assistance. Shared primary/destructive/Edit/Cancel icons preserve existing icon changes. No private dialog shell, local table/paginator/filter theme override or viewport subtraction.

| Responsive interval/boundary | Expected shared cascade | Acceptance |
|---|---|---|
| >1250px /1250±1 |4 main filter tracks become3, wrapping Creation Day; shared top alignment/error reserve; fixed toolbar/table pager | Source checked; visual pending |
|1200/1199px |Shared Filters disclosure appears, fields/actions remain mounted when collapsed | Interaction/visual pending |
|1024/1023,992/991px |Editor grid shared2 tracks but full-span Reason fills row; outer shell gap20→12 below992 | Source checked; visual pending |
|720/719px |Single filter track, toolbar stacks/wraps; validated feedback retained, calendar bounded to field | Source checked; visual pending |
|700/699,650/649,620/619px |Editor fields one track, FeatureTitle actions wrap/use shared small sizing, modal header/footer wrap | Source checked; EN/AR/RTL/theme visual pending |
|Narrow/intermediate/short heights |Rows/form retain one internal scroll owner, fixed title/filter/pager/footer, no page scroll | Source owner traced; keyboard/visual/runtime pending |

Shared owners and later breakpoint selectors inspected; no new known scoped presentation mismatch. Source inspection does not certify visual fit across the matrix.

## Backend boundaries and deferred findings

API evidence: VehicleNotReadyReason EntityBase has nullable Reason; AddBaseVm/UpdateBaseVm plus nullable Reason, Id on Update; generic controller GET/list, GetById, POST,PUT,DELETE authenticated. Existing target service/controller have no overrides; generic tenant/saved identity/read/persistence behavior retained. All4 AutoMapper maps are already one-directional Entity→Detail/List and Add/Update→Entity; no mapping change required. No domain calculations, child aggregates, uploads or financial effects. Ordinary entity Save retains existing implicit EF transaction; no schema/entity/EF/migration change.

Backend-only follow-ups, not implemented in this frontend request: inherited ListVM/DetailVM include unused tenant/state/GUID/No members; no target UniqueColumns/index enforces reason uniqueness; generic RemoveAsync lacks feature-specific inbound-reference protection. Nullable/no-required Reason is actual current contract, not an assumption that empty reasons are business-ideal. UI/guide do not promise duplicate/reference blocking or vehicle status changes. Any future required/unique reason rule requires a separate server/data decision. No missing material contract blocks these confirmed frontend workflows.

Reference Job actions Create/View/Edit/Delete/Export Supported; labour time, customer invoice, close/cancel, quality check, logs, estimation, gate-pass print and lubrication Not Applicable because target has no Job/invoice/document/state/collection contract. Inherited activate route not introduced without owning state workflow. Authorization remains authentication-only; candidate DELETE VehicleNotReadyReason?id={id} listed for future permission design, no hidden control described as secured.

## Changed files, phases and guide handoff

Frontend repository: VehicleNotReadyReasons route, list TS/HTML, details TS/HTML, create/details/list models and service; removed2 empty SCSS and2 broken scaffold specs (unrelated widgets ListsComponent and nonexistent DetailsComponent imports; no meaningful feature assertions removed). Direct shared edits: VehicleNotReadyReason provider import/two registrations in LayoutModule, toolbar title exclusion, feature EN/AR blocks, new vehicle-not-ready-reasons-topic.ts plus administration-guide import/topic/overview. Other pending edits preserved; no broad compilation include/preemptive tsconfig root.

Phases00 discovery/01 freeze,02 list/read/export,03 modal/write,04 frontend Delete,05 wiring,06 source reconciliation applied. Backend implementation/schema, domain approval/activation/posting, documents/children/uploads/printing skipped because outside frontend scope or no target workflow. Screenshot/video tables N/A. PLAN-00 N/A: bounded source-supported adoption, no new business concept. Generated packets00–06 used after passing Check; final Check all8 passed; no regeneration needed because canonical/template/manifest files unchanged.

User guide: src/app/modules/UserGuide/content/vehicle-not-ready-reasons-topic.ts; registered in existing administration guide, /UserGuide/administration, existing Administration userGuide.title sidebar entry. Covers purpose/sign-in, four filters/date grammar, sorting/paging/full export, Create/View/Edit/Delete, dirty exits/retries, optional reason/system audit ownership/manual mock Save. Bilingual content compared to final UI/API; reading/navigation/RTL/theme/print acceptance remains pending. No new reader/per-screen menu.

Shared extraction: none needed, every recurring concern reuses existing owners. Learning protocol: no new reusable rule established; no book/skill-only amendment or pending promotion. Root correction added appliedQueryReady/exportBlocked after worker handoff so invalid restored filters cannot accidentally export or refresh an unfiltered initial query.

## Verification and owner steps

Repository root confirmed F:/My Work/Sigma/SiGmaAngularFrontEnd; backend scoped source diff unchanged. Complete scoped source/diff reviewed in sections, direct shared hunks and new guide reviewed separately from unrelated pending changes. Source searches show no ms-lib/table-list/ListCol/ColType/any, tenant/audit payload, console.log, stale style refs, unrelated CostCenter imports, merge markers or silent undefined errors. External model/old-editor-route consumer scan found none; redundant providers removed. Exact shared exports, standalone registrations, inputs and parent boolean output/guard checked; prior mixed-old-editor compiler-feedback risk addressed by writing TS contract before templates and verifying public members.

Installed TypeScript/Angular source parsers inspected11 TS files including touched guide/wiring,2 feature templates and31 referenced EN/AR feature/shared validation keys:0 source findings. Check-Translations -Block vehicleNotReadyReason:20 EN/20 AR,0 missing/case differences. git diff --check passed scoped feature/shared files after trailing blank cleanup. This is source inspection, not compilation/tests/runtime verification. ES2018 API compatibility retained.

Owner should compile Angular and exercise: Create/Update save actual persistence; optional/empty/whitespace/null reason, View disabled/Close only, failed detail retry, business/HTTP Save failure retained draft, exactly one success/error feedback, double-click gates; dirty Cancel/X/Escape/navigation confirm/cancel and mock generation/preview exits; Id zero/fraction/out-of-range, partial/invalid creation date and route restore, unapplied filter edits during export/refresh, page-size-only/delayed paging/stale reads, all4 sorts, full multi-page Excel/date/translated headers and failed page; Delete record identity/cancel/failure/last-page fallback. Check authenticated GET/mutation headers without recording tokens, keyboard trap/focus/return, responsive matrix both languages/directions/themes/short height. External bookmarks to retired create/details paths must use /VehicleNotReadyReason plus row actions.

Migration: no Add-Migration required. Suggested frontend commit: `fix(vehicle-not-ready-reasons): wire CRUD and adopt shared UI` (stage only feature/direct shared hunks; unrelated pending work excluded). Backend unchanged; review records remain local/unversioned under current workspace instruction ownership. Compilation/runtime/persistence/visual risks remain owner-pending, especially API optional-field behavior and retired editor bookmarks.

Agent utilization: reused list_worker with inherited model (routine terra mapping unavailable), owned only list TS/HTML after Frozen contract. Root owned discovery/contracts/model/service/editor/routes/shared wiring/translation/guide/integration/final diff/report. Parallel bounded list/editor work reduced elapsed implementation time without overlapping writes; root audited and integrated output plus initial-query readiness fix. No subagent claimed overall completion.

Prohibited commands not run: build/test/lint/browser/application/database/migration/Graphify/Sigma MCP/commit/push/deploy.

## Compiler-feedback follow-up — 2026-10-14

Owner supplied TS2367 at details.component.ts:107 (string Id compared with numeric requested Id). Current source already has numeric Id in models/details.ts, model/list.ts, editor input and typed getDetails response. The active comparison now uses Number(response.entity.id) !== id; the requested Id is already a validated positive integer, so the record-identity guard remains and invalid/coerced mismatches cannot hydrate another record. This is a bounded consumer correction, not an API/schema or business-rule change. Other existing files were preserved.

Source validation: inspected exact model/service/component chain; TypeScript AST parsing of both reported feature folders (13 files) yielded zero syntax errors; actual Detail DTO Id is number; scoped git diff --check passed. No compilation/build/test/lint/runtime/browser/database commands were run. Owner must replay the build and View/Edit detail load. Guide task steps remain accurate; no route/action/workflow change, migration or new shared extraction. No subagent needed for this small correction. Suggested scoped frontend commit: fix(vehicle-not-ready-reasons): normalize detail identity comparison.
