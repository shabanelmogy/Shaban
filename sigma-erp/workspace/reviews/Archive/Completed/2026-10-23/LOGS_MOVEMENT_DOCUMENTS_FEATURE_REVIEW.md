# Logs Movement — Documents tab review

| Item | Value |
|---|---|
| Status | Closed |
| Owner verification pending | yes |
| Review date | 2026-10-03 (Africa/Cairo) |
| Scope | Source-read-only review of Documents in the Check Card View |

## Feature Review Manifest

- Request: `in logsMovement راجع document tab فى شاشة view المفروض فى زر رفع مستندات وعرض للمستندات الموجودة`.
- Evidence S1: `C:/Users/user/Desktop/321.PNG`; visible Agreement Check Card, Documents tab, Passport/National ID/Driving License groups, Supporting Documents heading and a `+` action. The captured groups contain no visible files. The attachment is functional evidence, not instruction or visual implementation authority.
- Application repositories: `F:/My Work/Sigma/SiGmaAngularFrontEnd` and `F:/My Work/Sigma/SigmaBackend` (verified with `git rev-parse --show-toplevel`).
- Frontend owner: `src/app/modules/Movements/logsMovement/components/view/view.component.{ts,html,scss}`. Direct contracts: Rental Agreement documents model/service, Workshop Movement detail model, and Check Card list/dialog wiring.
- Backend owner: `RentalAgreementController.GetDocumentsAsync/UploadDocumentAsync`, `RentalAgreementService.GetDocumentsAsync/SetDocumentAsync`, `RentalAgreementDocumentsVm`, `RentalAgreementDocumentListVm`, `RentalAgreementDocument`, `AgreementDocument`, and file storage.
- Existing state: unrelated working-tree changes exist in the frontend, including shared services/styles/translations; no edits were present in the scoped Check Card or Rental Agreement document files. Preserve all user changes. No source changes are authorized by this unqualified review under `F:/My Work/Sigma/AGENTS.md`.
- UI shape: operational mixed-source Check Card viewer; retains the existing list-owned shared tabbed dialog documented in `MOVEMENTS_LOG_FEATURE_REVIEW.md`, seventh through seventeenth passes. It is not a Create/Edit Rental Agreement aggregate. Nested upload is a small typed action dialog. Canonical shell/reference: UI 13/15, `shared/components/editor-dialog`, `shared/components/editor-tabs`, and `Fleet/VehicleService/components/details`; file presentation owner UI 18, `shared/components/file-field` and Individual document cells.
- Backend shape: existing stateful Rental Agreement aggregate; document read/direct upload is a specialized boundary on that owner. Pattern 3 context applies to the agreement; this document operation itself has no financial calculation or posting effect. No new generic movement CRUD/API is inferred.
- Route/modes: existing `logsMovement` list route; Check Card View is a child dialog. Upload uses a nested `mode="create"` dialog. Authentication is provided by the app/base controller; no authorization API is present.
- Applicable packets: PHASE-00, PHASE-01 (document contract only), PHASE-03, PHASE-05 (source wiring), PHASE-06. `Generate-SigmaRecipes.ps1 -Check` passed all packets. Phase 2 grid/filter/export and Phase 4 domain transitions are outside this tab review.
- Action inventory: View Documents, Supporting Documents `+`, per-target Upload, select target/file, Save upload, Cancel/Close. File preview/open is the requested behavior to trace.
- Exclusions: other Check Card tabs; list/grid refactor; agreement lifecycle changes; arbitrary new attachment persistence; data/schema changes; permissions changes; migrations/builds/tests/lint/database/browser/commit/push/deploy.

## Review result

The source review is complete; the requested functionality is incomplete. Upload already exists for eligible Agreement rows. Existing attachments are represented by names and availability flags, without opening or previewing their content. Identity categories are placeholders rather than reads of customer documents. No implementation or runtime acceptance is claimed by the Closed review status.

## Functional evidence

S1 metadata: English/LTR; View of an Agreement Check Card; image 721 × 613 pixels. Role, capture date, product version and current/historical provenance are Unknown. The image contains no additional governing instructions.

| Evidence | Classification | Behavior being reviewed | Source result |
|---|---|---|---|
| S1 Documents tab | Explicit | Documents are reachable inside Check Card View | Confirmed: shared tabs and matching Documents panel |
| S1 Supporting Documents `+` | Explicit | Upload action in the documents region | Confirmed for Agreement only when server `canUpload` is true |
| User request, 2026-10-03: `زر رفع مستندات` | Explicit written requirement | Actual upload flow | Existing configured-target upload, not arbitrary unnamed attachments |
| User request, 2026-10-03: `عرض للمستندات الموجودة` | Explicit written requirement | Existing attachments must be accessible | Missing in this View: no file open/preview action or usable file metadata |
| S1 Passport/National ID/Driving License | Explicit categories | Preserve three logical identity groups | Current source renders them only in the empty-list branch, with a hard-coded no-file state |
| File previews/content in S1 | Uncertain | Particular thumbnail or PDF preview design | No file content is visible in S1; do not infer a specific viewer design |
| Upload on closed/invoiced/voided records or every movement source | Uncertain from S1 | State/source coverage | Source and earlier contract restrict it; screenshot does not authorize changing these rules |

## Findings

### F1 — P1: Existing files cannot be opened or previewed

The Documents panel renders `document.name` and `document.hasDocument`, plus Upload. It has no file link, View action, image preview or PDF viewer (`view.component.html:157–197`). `CheckCardDocument` carries only `id`, `name`, `hasDocument` (`view.component.ts:50–54`). Agreement loading copies those three members (`view.component.ts:389–404`).

The API agrees with that incomplete read shape: `RentalAgreementDocumentListVm:3–8` and frontend `models/documents.ts:1–5` expose only the configured type ID, name and availability. `GetDocumentsAsync` projects `HasDocument` from the saved path without returning it (`RentalAgreementService.cs:1262–1268`), even though `RentalAgreementDocument.DocumentPath` is persisted. Workshop normalization also uses its existing path as a display name and drops the usable path (`view.component.ts:532–540`).

Impact: a successful upload changes the row to Available, but the user still cannot inspect the stored file from this tab.

Recommendation: extend the existing read contract with the minimal stored-file metadata needed to open a file, retain it in `CheckCardDocument`, and add a translated View action when a real file exists. Use the existing file-serving owner; freeze the exact retrieval contract before implementation. `FileStore` saves under the tenant's web root and `Program.cs:100` enables static-file serving; `MediaController` has upload/delete only. This is a missing consumer/read contract, not evidence that storage itself is absent. A file-opening transport should not be invented from `hasDocument`.

### F2 — P2: Identity cards are not connected to actual documents

`documentTypes` is a fixed label list (`view.component.ts:149–153`). The template shows all three groups only when `documents().length === 0`, and prints `notRecorded` for every group without consulting a document type, path or customer (`view.component.html:107–117`). Once any configured Agreement document target is returned, that branch disappears, including when its target has no uploaded file.

`onShown` loads Agreement details and Agreement document configuration; it does not read the linked customer's identity documents. The existing `CustomerDocument` source has `PartnerId`, `DocumentType`, `DocumentNumber` and `DocumentPath`; backend `DocumentType` explicitly includes NationalID, DrivingLicense and Passport. The current tab consumes none of those fields. Rental Agreement detail exposes `CustomerId` and driver IDs but not those identity attachments.

Impact: empty supporting-document configuration can display “No file recorded” without checking customer files, and nonempty configuration removes the three identity groups entirely.

Recommendation: keep identity documents and Agreement supporting documents as distinct logical regions, sourced from their actual owners. The nearest source-supported candidate for identity groups is `CustomerDocument` belonging to the Agreement's `CustomerId`; whether driver/additional-driver identities also belong here requires a documented source/owner decision before adding them. Do not equate a configured `AgreementDocument` target with a customer identity type by name.

### F3 — P2: Saved attachments disappear when their configured type becomes unavailable

`GetDocumentsAsync` starts from configured types satisfying `!IsClosed && IsActive != false` and left-joins saved files (`RentalAgreementService.cs:1249–1268`). A saved Rental Agreement document whose type is later closed/inactive is therefore omitted, even though its file relation still exists. The repository's normal live-row filter also excludes soft-deleted configuration rows.

Impact: the user cannot see all existing attachments; changing current configuration changes visibility of historical files.

Recommendation: distinguish eligible upload targets from stored-file history. Preserve reads of existing live attachment relations even if their type is no longer selectable, while retaining current upload validation. Do not reactivate a type or make it writable merely to show a historical attachment. The current active-only query is explicitly recorded in `RentalAgreementFeatureContract.md:118`; this is a requested-coverage gap requiring a recorded read-contract revision, not a silently changed historical contract.

### F4 — P3: Current upload/states still use legacy presentation and duplicate error ownership

The tab and nested upload dialog hand-build file picker, validation, state/error markup and related styles. The upload dialog has no typed reactive form and uses a native target select (`view.component.html:327–391`); it pads its wrapper instead of using the shared dialog padding input. Those are existing deviations from UI 13/18/22 and backlog 39. `FileFieldComponent` currently uploads immediately through `DocumentUploadTracker`; it cannot be substituted blindly for this atomic, server-owned Rental Agreement upload.

Both `getDocuments` and `uploadDocument` use the regular interceptor-enabled client with no `X-Skip-Error-Interceptor` (`agreement.service.ts:79–83,98–109`), while this component also displays inline API errors (`view.component.ts:269–281,405–411`; template lines 101–104,387–390). That gives an API failure two presentation owners under UI 22. Failures do release local busy state and retain the upload selection.

Recommendation in a future authorized fix: reuse shared controls and state/error presentation without changing the owning upload endpoint. Either retain the global error owner and restore local state only, or explicitly suppress it for a single inline owner and reuse `apiErrorMessage`. A shared file control needs an appropriate select-then-submit contract before it can serve this direct upload workflow. Keep draft/tracker upload semantics distinct from an upload which the controller immediately persists and cleans up.

## Confirmed current upload contract

| Concern | Decision and evidence |
|---|---|
| Upload visibility | `canUploadDocuments()` requires `source === 'Agreement' && agreementCanUpload()`; `view.component.ts:204–206` |
| Server state | `CanUpload = !IsClosed && !Invoiced && !IsVoided`; service line 1279. `SetDocumentAsync` rechecks the same states at lines 1340–1343 |
| Targets | Existing active/unclosed `AgreementDocument` configuration, positive configured ID; the `+` opens a selector rather than creating a new target |
| Empty targets | Button may open, but target/Save are disabled and `noUploadTargets` explains why; this behavior was explicitly recorded in the seventeenth historical review pass |
| Read endpoint | `GET RentalAgreement/{id}/documents` → `Result<RentalAgreementDocumentsVm>`; controller lines 41–45 |
| Upload endpoint | `POST RentalAgreement/{id}/documents/{agreementDocumentId}` with multipart `file`; controller lines 105–108 |
| File rules | Nonempty file, maximum 5 MB, valid JPG/JPEG/PNG/PDF MIME/extension/signature; controller plus `FileStore.Upload` |
| Persistence | One file per configured type for the agreement; existing relation path is replaced or a relation is added; unique index on subscription/agreement/type |
| Cleanup | New file removed on save failure; previous file removed only after successful save; `RentalAgreementController.cs:144–168` |
| Save/transaction | `SetDocumentAsync` adds its log and calls one scoped `SaveChangesAsync` at line 1380; no new explicit transaction recommended for this one-save path |
| Refresh | Client changes only `hasDocument` to true and closes the nested dialog; `view.component.ts:274–278`. This is sufficient for availability, insufficient for new file metadata |
| View shell | `mode="view"`, `primaryActionVisible=false`; ordinary View Close stays available except while uploading. The nested upload is an independently permitted action; parent View is not the upload business-state rule |
| Other sources | Existing shared viewer also accepts Delivery/Collection/NRM/Workshop. This pass does not authorize creating a common upload contract for them |

## Decisions and conformance

| Concern | Book block | Reference/shared owner | Actual target evidence | Result |
|---|---|---|---|---|
| Viewer shell/tabs | UI 13/15 | `EditorDialogComponent`, `EditorTabsComponent`; VehicleService details integration | Target uses the shared shell; width 1040px matches shared default; View primary action explicitly false; tab IDs/panels match `movement-check-card` prefix | Confirmed source conformance for these contracts; no runtime claim |
| Operational viewer exception | Master 4; UI 13 | Seventh historical Movement Log review pass | This is a source-specific Check Card projection in a list-owned modal, not an aggregate Create/Edit screen | Keep the frozen viewer boundary; no conversion of Rental Agreement editor in this review |
| File presentation | UI 18 | `shared/components/file-field/file-field.component.ts`, Individual documents | Shared file field binds a path control/tracker; target has only File/ID signals and a specialized server-owned upload | Existing presentation drift; preserve direct upload ownership when adapting shared presentation |
| Error states | UI 22 | `StateMessageComponent`, global error interceptor, `apiErrorMessage` | Target hand-builds status/error regions and writes inline failures for unsuppressed requests | F4; existing backlog class, not a new framework-wide defect |
| Historical labels versus selectable targets | UI 15/16; BE 3 | Existing detail/read DTO ownership and current `GetDocumentsAsync` producer | Current query filters configuration before joining uploaded files | F3, read-history contract revision recommended |
| Translation | UI 23 | `movementLog`, `rentalAgreement` in both vocabs | Read-only parity check: 200 English keys, 200 Arabic keys, zero missing/case-only differences | Confirmed source parity in these blocks |
| API wiring | UI 1/2; BE 6 | Root client and `RentalAgreementController` | Service is root-provided, uses `environment.baseUrl`; frontend GET/multipart POST routes match controller | Confirmed in source; network/runtime pending |
| Tenant ownership | BE 8; skill 8.2 | Repository/authenticated server ownership | Client upload sends IDs/file only; `SetDocumentAsync:1367` redundantly assigns tenant from the loaded agreement | No client-selected tenant. Existing server-owned tenant assignment is guide drift; not established as the cause of missing UI |

Grid columns/ListVM, list filters, financial calculations, generic-service overrides outside document reads/writes, Add/Update aggregate snapshot reconciliation and domain transitions are Not Applicable to this narrow review. The document read uses explicit LINQ projection and upload updates the tracked relation directly; AutoMapper does not own this response or file write.

## Open requirements and recommended scope

| Requirement | Status | Needed before implementation |
|---|---|---|
| Display/open saved supporting files | Missing | Extend the existing read model and freeze exact serving/opening transport; storage path already exists |
| Identity attachments in the three categories | Missing | Freeze relation/type selection from existing CustomerDocument data; customer is the closest existing owner, driver inclusion is not proved by S1 |
| Historical attachments after configuration changes | Conflicting with current active-only read contract | Record revised read coverage while keeping current upload target rules |
| Arbitrary extra supporting files with no configured type | Uncertain | Not requested explicitly or demonstrated by S1. Current `+` selects a configured target |
| Change upload eligibility after closure/invoicing/void | Not Applicable | Preserve current confirmed business rule; no request authorizes changing it |
| Hide/open behavior in the deployed record shown in S1 | Uncertain | Owner checks actual `source`, `canUpload`, returned targets and stored files; source-only review does not establish runtime/API data |

No Maintenance / Evolution Plan is needed to complete this read-only gap report. A subsequent extension involving identity owners or shared file-control capability should start with the proportionate existing-state/PLAN-00 decision review before freezing its changed contracts.

## Authorization candidates

The existing upload replaces a stored document through `POST RentalAgreement/{id}/documents/{agreementDocumentId}`. File viewing concerns identity/supporting documents. These are candidates for the deferred document-access policy inventory; this review introduces no role or permission checks and does not claim hidden actions are secured. Existing authentication and server state/tenant validation remain authoritative.

## Final reconciliation and owner verification

| Comparison | Result |
|---|---|
| User/S1 upload action ↔ source visibility/server write | Implemented in existing source for eligible Agreement rows; actual network/data verification pending |
| User existing-file display ↔ API metadata/template | Missing, F1 |
| S1 identity groups ↔ real document owner | Placeholder-only, F2 |
| Saved-file history ↔ configured-target query | Coverage gap, F3 |
| Multipart request ↔ controller/file rules/save/cleanup | Compatible in source; owner persistence/replacement verification pending |
| Declared and HTTP failures ↔ UI recovery | Both handled and finalized; duplicate feedback ownership recorded in F4 |
| English ↔ Arabic blocks | Passed read-only parity check |
| Scoped Git differences, staged and unstaged | No changes in reviewed Check Card/Rental Agreement document files in either repository; scoped `git diff --check` passed; no merge markers in the scoped frontend source |

Files changed: only this local unversioned review artifact. Frontend/backend source, contracts, AutoMapper, calculations, entities and EF configuration were not modified. No `Add-Migration` is required by this review. No application repository commit is applicable. Optional future review-artifact message, after the owner versions the documentation layer: `docs(logs-movement): review document upload and viewing gaps`.

Owner checks: open an eligible Agreement's View → Documents and confirm `+`/row Upload, configured types and maximum/type validation; upload a JPG and PDF and verify persistence after reopening, replacement cleanup and failure recovery; inspect closed/invoiced/voided eligibility; compare already-uploaded files against inactive/closed type configuration; compare the customer's saved Passport/National ID/Driving License with this tab; exercise Arabic, dark theme, narrow viewport and keyboard exits. Current absence of file-opening actions is a finding to fix, not a successful acceptance test.

No source refactor or shared extraction was performed because the request is source-read-only. This review records feature-specific gaps; it does not add universal instructions or rewrite the canonical books/skill. Subagents were not used: this small document slice shares one tightly coupled read/upload contract and did not meet the independent-workstream delegation gate.

Builds, tests, lint, migrations, database commands, browser automation/application verification, commits, pushes, deployment, Graphify and Sigma MCP were not run. Build/runtime/database/visual acceptance remain pending for the owner.

## Implementation and final reconciliation — 2026-10-03

This section records later authorization and implementation; the earlier Closed/source-read-only review above remains historical.

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | User: `عدل الملاحظات`; then `بعد اما تخلص زود action فى action button check card`; then `كمل` |
| Contracts | LOGS_MOVEMENT_MAINTENANCE_EVOLUTION_PLAN.md; LOGS_MOVEMENT_DOCUMENTS_CONTRACT_FREEZE.md; LOGS_MOVEMENT_CHECK_CARD_CONTRACT_FREEZE.md — Frozen |

### Evidence and decisions

| Concern | Decision / evidence |
|---|---|
| S1 Documents | Functional requirement: upload action and existing-file viewing; F1–F4 fixed against canonical UI/API owners |
| S2 `111.PNG` | Functional report evidence only: Print, type/movement/reference/vehicle/contact, Check Out/In readings, diagrams, checklist, driver/branch and signature spaces; CFAO branding/layout is not design authority |
| Identity owner | Existing Agreement.CustomerId → live CustomerDocument, NationalID=33 / DrivingLicense=34 / Passport=35. All saved rows of each type are displayed; no driver merge or invented current/expiry selection |
| Missing customer | CustomerId.HasValue guards the query, preventing NULL PartnerId rows from being exposed as the agreement customer's files |
| File opening | Add persisted paths to the read DTO; shared FileLink resolves HTTP(S) paths to the existing API/static-file origin and opens in a new tab. No permission or storage transport redesign |
| History | Only configured-type lookup uses includeDeleted; active configuration requires live/open/active. A nonempty saved live relation keeps an inactive/closed/deleted type readable with row CanUpload=false |
| Upload | Existing multipart/5 MB/type/signature/path/state validation, one service save and cleanup retained. Controller checks aggregate and row eligibility before storage, service rechecks state/type; success returns the saved row/path |
| Shared UI | FileField opt-in selectionOnly uses typed File controls and FileUploadService validation without Media/tracker mutation. Target uses typed required FormControl + p-dropdown; shared states/errors/confirmation/padding own presentation. Selected File survives target changes |
| Upload visibility | Eligible Agreement keeps the existing Supporting Documents + even with no current target; the nested dialog then shows a localized no-target state with Save disabled. Historical rows do not become uploadable |
| Report mode | Separate Actions → Check Card for the same five View sources, reusing existing detail normalization. Print-only mode does not fetch Agreement attachments |
| Unavailable report data | Phone, saved checklist answers, damage coordinates and signatures have no consumed source contract. Phone/marks/signatures stay blank; existing diagrams and configured checklist labels/fallback are used. No new data persistence or fabricated values |
| Catalog completeness | ChecklistItem GET uses inherited GetManyAsync; no PageNo/PageSize makes NormalizePaging return null/null, so no Skip/Take applies. Entire returned live catalog is ordered locally and included; empty/failure falls back to screenshot-backed labels. No page-size inflation |
| Print ownership | ReportPrintService session handles one-frame preparation/options/cleanup. Fixed shared footer Print; sigma-print-flow; opt-in sigma-dialog-print hides the root, non-target portal masks, report header/footer and no-print states. White paper/dark text; both checkpoints print |
| API feedback | Agreement documents GET/POST suppress the global interceptor because the readers own one inline channel. Agreement detail opt-in preserves other callers' default; four other movement detail readers already suppress. Typed catalog reader suppresses its inline error channel |
| Owner compile report | User supplied TS4104 at p-dropdown.options. Corrected uploadTargets return annotation to mutable CheckCardDocument[]; filter already returns a fresh mutable array. No cast and no agent build run |
| Mapping/calculations/schema | Explicit LINQ read DTO projection and tracked file relation persist. No AutoMapper changes, domain calculations, entity/EF edits or migration; frontend computes display formatting only |

### Unchanged list and wiring

Route, AuthGuard, root service providers, list filtering/paging/export and grid contract remain unchanged. Columns: movementNo, movementType, refNo, plateNo, makeAndModel, contact, contactCode, dateTimeOut/In, kmOut/In/Difference, fuelLevelOut/In, branchOut/In, notes, isClosed, createdAt/By. ListVM contains those same displayed fields plus movementId, movementKey, source and hasNewDamages as existing identity/action/detail state. New action consumes source/movementId only; it introduces no list property or permission API. Supported sources: Agreement, CollectionMovement, DeliveryMovement, NRM, WorkshopMovement.

Phases applied: 0 discovery/evidence, PLAN-00 maintenance decisions, 1 API/UI freeze, 3 documents/detail implementation, 5 source integration, 6 final reconciliation. Phase 2 list redesign and Phase 4 domain transitions skipped because no grid/filter contract or domain transition changed; the bounded Actions wiring is covered in integration.

### Files changed

Frontend repository `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- `src/app/modules/Movements/logsMovement/components/list/list.component.{ts,html}`
- `src/app/modules/Movements/logsMovement/components/view/view.component.{ts,html,scss}`
- New `src/app/modules/Movements/logsMovement/models/check-card-report.ts` and `components/check-card-report/check-card-report.component.{ts,html,scss}`
- `src/app/modules/Rental/Agreement/models/documents.ts`, `services/agreement.service.ts`, `components/documents/documents.component.{ts,html,scss}`
- `src/app/modules/Administration/ChecklistItem/services/checklistitem.service.ts`
- Shared `components/file-field/file-field.component.ts`, new `components/file-link/file-link.component.ts`, `service/report-print.service.ts`, `src/styles.scss`
- `src/app/modules/i18n/vocabs/en.ts` and `ar.ts`: scoped Movement/Agreement keys; unrelated existing changes retained

Backend repository `F:/My Work/Sigma/SigmaBackend`:

- `SiGma.Business/Services/AgreementServices/RentalAgreementService.cs`
- `SiGma.ServerAPI/Controller/RentalAgreementController.cs`
- `SiGma.ViewModels/ViewModels/RentalAgreement/RentalAgreementDocumentsVm.cs`, `RentalAgreementDocumentListVm.cs`, new `RentalAgreementIdentityDocumentVm.cs`

Learning was promoted to canonical UI16/18/21, UI preamble/change log (1.63), and `.agents/skills/sigma-screen-refactor/SKILL.md` with a revision row. Packets were regenerated only with Generate-SigmaRecipes.ps1 and their owning-block provenance/phase closure semantically reviewed. Reviews/contracts remain local unversioned artifacts; no instruction-layer move or commit was performed.

### Final source comparisons

| Producer ↔ consumer / concern | Result |
|---|---|
| GET supporting/identity VM ↔ Rental DTO ↔ both document readers | Matched IDs, enum, paths, aggregate/row eligibility and arrays |
| POST saved row ↔ both upload success handlers | Typed Result entity replaces local metadata/path immediately; missing entity handled inline; reopen persistence contract unchanged |
| History eligibility ↔ controller/service ↔ picker/actions | Readable history remains read-only; positive eligible IDs only; no arbitrary type creation |
| Local File selection ↔ atomic POST | Shared validation, required controls, busy locking/finalize recovery, confirmation on discard, success reset without confirmation |
| Actions ↔ preview input ↔ normalized model ↔ pure report | Standalone imports/selector/inputs and five-source dispatch matched; View remains tabbed; report has both checkpoints and Print |
| Print isolation and compatibility | Target mask only; other portal masks hidden; session no-argument callers retain behavior; lifecycle remains shared |
| Reference conformance | Shared EditorDialog/EditorTabs/FileField/StateMessage/FieldError/Confirmation/PrimaryAction/ReportPrint owners consumed. Operational viewer's existing full-bleed summary/tab body retained; print/upload/direct document reader use shared content padding |
| Translations | Scoped read-only parity check: 227 en / 227 ar, zero missing and case-only differences; relevant inline-object keys inspected directly |
| Scoped Git/source checks | Complete scoped diffs reviewed separately in both actual repositories, including new files and scoped shared style/vocab hunks; no merge markers; diff --check clean; unrelated edits preserved |
| Guide/packet drift | Regeneration and final -Check passed; generated files not edited manually |

Root integrated two bounded sol_worker agents (`gpt-5.6-sol`): backend DTO/query/upload files, and frontend document consumers, after contract freeze with disjoint ownership. Root owned shared controls/links, translations, Actions/report integration, canonical learning and complete reconciliation. The same agents then performed bounded read-only shared/print and final UI audits. Root corrected config/customer predicates, all-row identity rendering, target-change file retention, print mask isolation, whitespace and the owner-reported readonly array error. Delegation was chosen for independent cross-layer implementation against one frozen additive contract; no overlapping edits or new user chats.

Suggested commits only:

- Frontend: `fix(logs-movement): restore document viewing and add printable check card`
- Backend: `fix(rental-agreement): expose document paths and preserve attachment history`
- Future instruction/documentation owner: `docs(sigma): document atomic file controls and dialog printing`

No Add-Migration is required. Source-only review does not establish successful compilation/runtime, storage reachability, actual database data or print pagination. The owner-reported TS4104 has a source fix; a subsequent successful compilation was not supplied. Verify eligible/closed/invoiced/voided uploads, JPG/PNG/PDF limits, immediate links and reopen persistence, replacement and failed-write cleanup, inactive/closed/deleted type history, customerless/multiple-identity cases and Workshop links. Then check Actions → Check Card for supported sources, both sides, empty values, print/cancel, long catalogs, Arabic/RTL, dark theme, narrow viewport and isolation from other dialogs.

Builds, tests, lint, runtime/browser/database commands, migrations/snapshots, commits/pushes, deployment, Graphify and Sigma MCP were not run by agents. Owner compilation, runtime, database and visual/print acceptance remain pending.

## Owner-directed Documents presentation refinement — 2026-10-03

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | LogsMovement Agreement View → Documents presentation |
| Contract | Frozen presentation addendum in `LOGS_MOVEMENT_DOCUMENTS_CONTRACT_FREEZE.md` |

The owner corrected the presentation using S3 `C:/Users/user/Desktop/q.PNG`: "الصورة اللى بعتها بتعرض الاقسام فاضية وفى مكان فى زر رفع ليه متبعتش الصورة". The previous implementation placed the identity and supporting regions sequentially and displayed missing-file/configuration rows. This pass restores the requested adjacent groups and empty spaces while keeping actual stored-file links and the existing upload contract.

| S3 evidence | Classification | Decision and source |
|---|---|---|
| Passport, National ID, Driving License | Explicit logical groups | Always retain the three Agreement groups, stacked at logical start; saved identity paths appear inside their matching group |
| Empty group bodies | Explicit captured state; user-directed presentation preference | Empty means no nonblank stored path in that group; omit missing-file messages and metadata-only identity rows from this file display |
| Supporting Documents with adjacent + | Explicit action and workflow position | Supporting region sits alongside the identity groups, and + remains beside its heading under the existing aggregate CanUpload state |
| Colors, modal dimensions, backend eligibility, responsive behavior | Not established by S3 | Keep shared dialog/tabs, theme tokens and existing state rules; use the feature's existing content grid, with logical RTL order and narrow stacking |

S3 metadata: Agreement View, Documents selected, English/LTR, approximately 721 × 614 image; capture date/version/role Unknown. The viewport dimensions are metadata, not a new shared modal-width contract. The owner's correction is a feature-specific presentation refinement; no general guide rule changed.

| Concern | Book block and actual reference | Final target evidence | Result |
|---|---|---|---|
| Shell, tabs and scroll ownership | UI13/15; `shared/components/editor-dialog/editor-dialog.component.html`, `shared/components/editor-tabs/editor-tabs.component.html`, VehicleService details | Existing `mode=view`, `primaryActionVisible=false`, width1040, full-bleed View body, unique Documents panel/tab IDs and shared shell are preserved; nested upload remains padded with width480 | Source match; runtime pending |
| Group placement | Master2 and owner correction; existing viewer content grid | `movement-check-card-document-layout` reuses minmax(180px,0.8fr)/minmax(0,2fr), 1.25rem gap and start alignment; single modifier for other sources, stacked at640px. Groups use existing theme tokens and expandable minimum96px height | Scoped preference implemented through existing content owner |
| Saved-file display | UI18; `shared/components/file-link/file-link.component.ts` | `supportingDocuments()` filters nonblank paths for Agreement only; `identityDocumentsOfType()` filters matching type and nonblank path, retains every matching saved row; both templates consume FileLink | Source match; stored-file reachability pending |
| Upload choices and immediate refresh | UI18 atomic action; existing `uploadTargets()`, `openUpload()`, `saveUpload()` | Display filtering never mutates `documents()`; picker still receives mutable `CheckCardDocument[]` with eligible positive IDs, including unfilled types; successful upload replaces the returned saved metadata/path in the source signal | Existing contract preserved; TS4104 source fix retained |
| Empty versus failure | UI22; StateMessage shared owner, frozen addendum | Agreement group bodies are blank when no files exist; loading/failure messages remain. Other sources keep their original row collection and shared empty state | Scoped empty presentation implemented |
| RTL/theme/overflow | UI25/27; shared shell and inherited direction/tokens | Grid first child is logical start; no left/right positioning, new palette, nested scroll or fixed file-content height; identity links wrap | Source inspected; visual acceptance pending |

Changed application files: LogsMovement `components/view/view.component.html`, `.ts`, `.scss` in `F:/My Work/Sigma/SiGmaAngularFrontEnd`. Review artifacts: this report and the existing Documents contract addendum. Phases0/1 apply to the screenshot correction and presentation freeze; Phase3 implements it; Phase6 reconciles the scoped source. Backend, read-grid, transitions, routing, printing, payloads, DTOs, mappings, calculations and migrations are unchanged in this pass. No new translation keys or imports were needed. No Add-Migration is required.

Source reconciliation: reviewed all three scoped Git diffs in the actual frontend repository, template nesting, class/method bindings, preserved mutable picker input, saved-path refresh, existing state locks and non-Agreement path. Scoped merge-marker and whitespace checks passed. Recipe -Check passed before packet use. Unrelated user changes were preserved. No subagents were used because this is one small, sequential viewer refinement.

Owner checks pending: Agreement with configured targets and no files should show three blank identity groups plus the blank supporting region and eligible +; opening + should still list eligible unfilled types. With saved files, verify every matching identity and supporting file opens, historical files remain readable, and successful uploads appear immediately. Check Arabic/RTL, dark theme, wide/narrow layout, and Workshop's existing document display. Successful compilation and runtime/visual acceptance remain unverified under the workspace source-only boundary.

Suggested frontend commit only: `fix(logs-movement): align document groups with requested empty view`. No builds, tests, lint, browser/runtime/database verification, migrations/snapshots, commits/pushes, deployment, Graphify or Sigma MCP were run for this refinement. No unresolved API or business decision blocks the requested source change.
