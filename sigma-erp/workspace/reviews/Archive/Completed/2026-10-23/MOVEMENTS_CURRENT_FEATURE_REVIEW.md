# Movements current documentation conformance review — 2026-10-09

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Contract | MOVEMENTS_CURRENT_FRONTEND_CONTRACT_FREEZE.md — Frozen |
| Outcome | Review Angular Movements and implement confirmed documentation fixes |

## Manifest

Seven screens: Collection, Delivery, Custody, Workshop, WorkshopMovement, NRM and Logs. Source evidence only; no supplied screenshots. Six UI01 controlled modal/list screens and one Logs operational read/report exception. References are Workshop/Job list, shared EditorDialog/UI13, existing ReportPrint/DataTable owners and frozen Logs adapters. Backend BE13/14/17 is inspected only. Existing contract matrices are retained in MOVEMENTS_FRONTEND_CONTRACT_FREEZE.md and MOVEMENTS_FEATURE_REVIEW.md; current corrections are additive and do not rewrite history.

Routes remain /collectionMovement, /DeliveryMovement, /CustodyMovement, /Workshop, /WorkshopMovement, /NRM, /logsMovement plus existing compatibility create/details paths. The case is verified in src/app/pages/routing.ts. Root providers/environment.baseUrl/interceptor-enabled HttpClient remain. Authentication is AuthGuard; no permission API exists. All applicable phases 0–6 are source-only; no ambiguous new business work/parallel owner requires PLAN-00.

Initial generator -Check: all eight packets current. Applicable packets PHASE-00 through PHASE-06; no regeneration necessary at discovery. Review sources are canonical Master4/5/7 and shape-specific UI blocks/skill. Backend-only defects from prior review remain outside application-edit scope.

Baseline: no source changes in Movements. Unrelated existing frontend files include sidebar, routing, vocabularies, reader and other module guides plus Limousine/Workshop/HRM; backend includes Job/Payroll/Limousine, owner migrations/snapshot. Preserve them. Workers own nonoverlapping feature folders; root owns Logs/shared/guide/reconciliation.

## Conformance and findings

| Concern | Owning block | Actual reference/shared owner | Current target and frozen correction |
|---|---|---|---|
| Logs list bounds/filter/grid | UI1/3/4/6 | Workshop/Job list metadata/template; FilterPanel mainColumns/stableLayout; DataTable fill/lazy/count inputs | Existing sigma-route-host/list-page/panel/table, stable five-column filter and real paging retained; operational row actions justify list shell exception to pure UI20 document. |
| Controlled viewer/print | UI13/21 | EditorDialog actual public inputs/outputs; ReportPrintService.createSession | Existing controlled View/preview, smaller subtitle, body scroll, six tabs and isolated print retained. |
| Pending export/print | UI10/21 | shared/utils/form-state.ts freezeFormState; ReportPrintSession caller afterPrint | Logs blindly enables all filter controls after export/print. Reuse snapshot restoration to retain intentionally disabled controls through failures and print cancellation. |
| Deferred upload discard | UI10/28 | shared ConfirmationDialogService.confirmDiscard; freezeFormStates and local generation gates | Viewer captures identity inside defer and does not reject a later subscription after upload surface replacement. Capture identity before defer and recheck actual visible upload/record at subscription. |
| Upload reopening/state | UI10/22/28 | Shared snapshot owner + EditorDialog controlled shown/close | Confirmed discard resets/hides disabled upload controls without restoration; later open resets values but does not enable them. Establish editable controls on a fresh open; restore failed requests only on the same active context. |
| Source readability | Master5 G10 | Actual Job list expanded method/control-flow layout | Logs contains multi-statement lines and inline if blocks. Expand in scoped touched TypeScript while preserving behavior. |

Workers recorded their nonoverlapping initial comparisons separately. Root completed the remaining implementation and owns the final source/diff reconciliation below.

## Final conformance

| Concern | Book / actual owner | Final source comparison |
|---|---|---|
| Six UI01 lists | UI1/3/4/6; Workshop/Job list, FeatureTitle, FilterPanel, DataTable | Existing container-fill and single grid scroll chain retained. Create/Search/Reset and lazy queries respect export/editor state. Five-field filters remain five columns where already declared; Workshop has two. No private shell styling added. |
| Controlled editors | UI10/13/15; EditorDialog, FormSection, ConfirmationDialogService | Existing Create/View and Workshop Edit preserved. All six Save paths now use shared freezeFormState and same-visible-identity restoration. Cancel/failure preserves values, dirty state and intentional disabled subtrees. Calendar-dialog focusOnShow=false remains the UI17 rule; no blanket autofocus change. |
| Lookup lifecycle | UI10/22/28; shared form-state and RxJS cancellation | Collection/Delivery/Custody Retry now respects all editor busy states. NRM/WorkshopMovement freeze lookup batches, cancel them before identity replacement and restore only the matching editable session. |
| Document decisions | UI10/14/18/28; approved CompanyPartner Documents, EditableRows, DocumentUploadTracker | Parent observes the actual Documents confirmation signal and freezes fields/Add/Remove while pending. Approved child reference remains untouched. Invalid document focus now targets its actual workshop-movement-document-{index}-{field} id; row-level date error targets expiryDate. |
| Cleanup and success | UI18/22/28; DocumentUploadTracker, root MessageService, errorInterceptor | Pristine and dirty discard cleanup is frozen and identity-gated. Successful Save waits for finishSave cleanup, then emits one success message and closed(true). Failed cleanup retains a locked draft with Retry; Retry never repeats POST. Existing skip-success header suppresses premature interceptor success only for this composite write. |
| Exports/print | UI8/10/21; fetchAllPages, dataTableExportRows, ReportPrintService | Existing complete applied-filter exports/print retained. Delivery/Custody/Logs export and Logs print now restore snapshots rather than enabling every control. Print freeze lasts through afterPrint; failed reads restore in finalize. |
| Logs upload | UI10/18/22/28; frozen source adapters, atomic Agreement upload, freezeFormStates | Discard captures record and upload identity before defer, then rechecks at subscription/result. Fresh upload reopens editable controls after confirmed discard; failed upload restores only its same active context. Six tabs, five source adapters and blank unsupported report values retained. |
| Readability and stale imports | Master5 G10; actual Job source layout | Expanded blocks/statements across 22 runtime component/service files. AST comparisons isolate intended semantic changes from formatting. Nine existing spec scaffolds now import their actual standalone movement component instead of stale DetailsComponent or widgets ListsComponent; assertions unchanged, no tests added/run. |
| Guide and vocabulary | Master7; existing UserGuide reader/guide model/sidebar data | Seven EN/AR topics, actual actions/validation/recovery, corrected route case, existing reader registration, new Movements menu entry. Seven missing Arabic sideMenu keys added; unrelated vocabulary/sidebar changes preserved. |

## Decisions and contracts

Historical Frozen matrices remain authoritative; no new API field, filter, workflow, permission or business rule. The columns below sit beside consumed frontend ListVM properties; existing oversized backend ListVM/navigation projections remain report-only.

| Screen | Grid columns = consumed ListVM fields, in grid/Excel order | Minimum additional ListVM properties | Filters |
|---|---|---|---|
| Collection | collectionMovementNo, typeName, agreementNo, plateNo, driverName, collectionLocation, dateOut, fuelLevelOutName, kmOut, dateIn, fuelLevelInName, kmIn, status | id, type | movementNo, agreementNo, plateNo, type, fromDate, toDate |
| Delivery | no, typeName, agreementNo, plateNo, location, dateOut, fuelLevelOutName, kmOut, dateIn, fuelLevelInName, kmIn, status | id, type, fuelLevel | movementNo, agreementNo, plateNo, type, fromDate, toDate |
| Custody | custodyMovementNo, movementDate, branchName, plateNo, makeAndModel, agreementNo, fuelLevelName, kMs, notes | id, fuelLevel | movementNo, plateNo, branchId, fromDate, toDate |
| Workshop | name, no, createdBy, createdAt | id | name, no; existing supported entity-property sort |
| Workshop Movement | no, plateNo, makeAndModel, workshopName, workshopCode, dateOut, dateIn | id | movementNo, type, plateNo, workshopId, fromDate, toDate |
| NRM | no, type (translated), plateNo, makeAndModel, staffName, staffCode, dateOut, dateIn | id | movementNo, type, plateNo, staffId, fromDate, toDate |
| Logs | movementNo, movementType, refNo, plateNo, makeAndModel, contact, contactCode, dateTimeOut, dateTimeIn, kmOut, kmIn, kmDifference, fuelLevelOut, fuelLevelIn, branchOut, branchIn, notes, isClosed, createdAt, createdBy | movementId, movementKey, source, hasNewDamages | dateMode, fromDate, toDate, movementNo, refNo, plateNo, movementType, contactId, status, kMsGreaterThan, hasNewDamages |

Detail/Add/Update: retained client-editable payloads, current optional/required fields and exact server producers. Collection/Delivery/NRM mileage remains nullable text; Custody/WorkshopMovement remains signed nullable Int32. No UTC conversion, new nonnegative bound, number generation or fabricated branch FK. Workshop Create250/Edit50 follows existing producer annotations. WorkshopMovement.Supplier selection remains independent of Workshop master; documents use the actual shared child payload. Detail contracts retain fields required by Logs adapters.

Action state: existing movement Create/View, Collection Delete, Workshop Edit, Custody/WM/NRM selected-detail Print and Logs View/CheckCard/Report/Excel/upload retained. Confirmation-only decisions use the existing service; parent pending work blocks Close/Escape/route replacement. No permission API or new state transition. Date filters preserve calendar bounds and applied query snapshots. Backend owns kmDifference, closure/damage flags and numbering.

Integration: outer lazy routes and compatibility child routes unchanged. Existing standalone component imports and guard/public dialog bindings retained. New MessageService injection resolves through GLOBAL_MESSAGE_SERVICE_PROVIDER in AppModule; no local provider shadows it. Success suppression is the existing interceptor contract, not a new endpoint contract. tsconfig.app.json uses explicit runtime entries; no broad include/spec inclusion added.

Evidence classification: no screenshots/videos supplied. No Missing, Conflicting or Uncertain material frontend decision remains. No verified new reusable rule was established: UI10/14/18/22/28 and existing shared owners already govern these corrections, so canonical books/skill were not changed.

## Reconciliation and verification

| Phase | Final outcome |
|---|---|
| 0–1 | Actual producer/consumer/reference inspection; additive current Frozen frontend handoff. Backend/API review establishes compatibility only. |
| 2 | Read/grid/filter/export corrections complete; server counts/order and full applied result retained. |
| 3 | Save/lookup/confirmation/upload/cleanup corrections complete; typed forms/payloads and validation retained. |
| 4 | Existing Delete/Print/action gates reviewed. No new backend domain transition implemented. |
| 5 | Routes, guards, shared public owners, toast provider/interceptor, translations and guide reconciled. |
| 6 | Complete scoped frontend diff reviewed: normalized AST/member comparison for formatting, direct semantic diffs, template/spec/guide/shared hunks and file inventory. Owner runtime verification remains pending. |

Source checks: TypeScript parse and Angular template parse found zero syntax diagnostics; runtime import-path/unused-import scans found zero errors; local spec imports match exported component names. Scoped literal EN/AR key scan found zero missing keys. Check-Translations.ps1 for nine owning blocks passed (451 keys each, zero missing/case differences). Scoped git diff --check passed. Merge markers, empty failure handlers and prohibited date/page-shell patterns were absent. These are source inspections, not TypeScript/Angular application or test compilation.

Recipe maintenance: initial and final -Check passed all eight packets; none regenerated because no drift or canonical/template/manifest change occurred. The stale-packet statements in the 2026-10-07 historical artifact are superseded by this current observation, not silently rewritten.

Changed application source: 40 files under Movements plus its guide (22 runtime TS, eight HTML, nine existing spec scaffolds, one guide). Two shared files have task-owned additions: sidebar-menu-data.ts Movements guide link and ar.ts sideMenu.movements/movementss. [CURRENT_CHANGED_FILES.txt](<../../../Movements/CURRENT_CHANGED_FILES.txt>) is the exact inventory; [CURRENT_SOURCE_VERIFICATION.json](<../../../Movements/CURRENT_SOURCE_VERIFICATION.json>) records the source scan and semantic-member inventory. No feature route/model/SCSS/shared utility changed.

Frontend Git root: F:/My Work/Sigma/SiGmaAngularFrontEnd. Backend Git root: F:/My Work/Sigma/SigmaBackend; this task writes no backend source. Unrelated concurrent changes in both repositories, including migrations/snapshot, remain preserved. Reviews are local workspace artifacts outside both repositories.

Backend/AutoMapper/domain: no edits. Existing FK/ownership validation, numbering concurrency, deep/redundant DTO mapping, sparse paging metadata/stable ties, differing Workshop name limits and in-memory Logs aggregation remain producer findings outside this frontend implementation. No Add-Migration required and no backend/documentation commit suggested.

## Guide handoff and owner acceptance

Content: src/app/modules/UserGuide/content/movements-guide.ts; existing MOVEMENTS_GUIDE reader registration. Route: /UserGuide/movements. Entry: Movements children in sidebar-menu-data.ts using existing userGuide.title and book icon. Covers all seven screens: purpose, filters/reset/full export, prerequisites, required/optional fields, validation, actions, failure/discard/cleanup recovery and Logs tabs/eligible upload/blank unavailable content. Source comparison complete; owner EN/AR visual/navigation acceptance pending.

1. Compile the frontend and existing spec harness separately. The corrected generated spec imports are source-valid; their service/router/translation providers still require owner harness verification. No test execution or provider sufficiency is claimed.
2. Open all seven screens in EN/AR, light/dark, RTL and narrow layouts; verify one internal scroll owner, fixed title/filter/paginator/footer, overlay placement and keyboard focus.
3. Fail Save/lookups/export through business and HTTP failure channels. Confirm entered values/dirty state and intentionally disabled fields survive, and pending Retry/Close/Search/Reset/Create cannot bypass guards.
4. Navigate between detail identities and repeat Close/Escape/navigation/discard decisions. Verify obsolete reads/guard observables cannot patch or close a replacement editor; re-open Logs upload after accepted discard and after failed upload.
5. Add/remove/upload Workshop Movement documents; verify parent controls freeze during edited-row removal and pristine cleanup, first-invalid-row focus, cleanup failure/Retry, one delayed success and no repeated POST.
6. Compare exports exceeding 100 rows with all applied results, then print selected Custody/WM/NRM details, Logs Report and Check Card. Check print Cancel/restoration and deliberately blank unavailable fields. Open each guide link from the module menu and reader.

Suggested frontend commit: `fix(movements): preserve pending form state and complete user guide`.

Agent utilization: three inherited-model worker roles after root freeze owned Collection; Delivery/Custody; Workshop/WorkshopMovement/NRM. Independent folders reduced overlap and serial discovery. Collection delivered bounded source edits; worker audit notes supplied reference comparisons. Agents stopped at the usage limit; root completed remaining source work, guide/shared integration and all final reconciliation. No further delegation for this tightly related final pass.

No builds, tests, lint, browser/application verification, database commands, migrations/snapshot edits, commits/pushes/deployment, Graphify or Sigma MCP were run. Status remains Implemented — source-only, not Closed.
