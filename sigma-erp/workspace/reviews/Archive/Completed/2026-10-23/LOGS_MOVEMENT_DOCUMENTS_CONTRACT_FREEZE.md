# Logs Movement Documents handoff

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-03 |
| Basis | User-authorized findings F1–F4; frozen maintenance plan |

## API

GET RentalAgreement/{id}/documents retains RentalAgreementId, AgreementNo, CanUpload, Documents. Each supporting document retains AgreementDocumentId, Name, HasDocument and adds DocumentPath nullable string and CanUpload boolean. IdentityDocuments adds customer-only rows: Id integer, DocumentType enum numeric (existing domain values), DocumentNumber nullable string, DocumentPath nullable string. New named VM belongs in its own file. Active/open/live configured types remain listed without files. Saved live file relations remain listed when their configured type becomes inactive, closed or soft-deleted, with CanUpload=false. Normal tenant scoping applies everywhere; only config lookup includes deleted.

POST retains multipart file and existing limits/state rules/cleanup. Return Result<RentalAgreementDocumentListVm> with saved row Entity including path and CanUpload. Controller checks matching row CanUpload before storage; SetDocumentAsync continues authoritative state/type validation and returns previousPath internally for cleanup. Remove redundant subscription filtering/assignment where repository already owns it. No persistence/model/mapping changes.

## Angular

Mirror API additively in Rental models and service. GET/POST inline-owned errors use X-Skip-Error-Interceptor and apiErrorMessage. Movement View always renders identity groups separately for Agreement, with actual saved files and shared open links; supporting list shows stored path links and per-row replacement/upload controls. Workshop keeps documentPath. Do not represent availability text as an actionable file link when path is absent.

Root provides FileField selection mode: @Input selectionOnly=false; typed FormControl<string|null>|FormControl<File|null>; folder defaults empty; optional DocumentUploadTracker only needed in existing stored-path mode. Selection mode uses FileUploadService.validationError and emits control dirty/touched changes without uploads/deletes/tracker mutation. Root provides FileLink(path,label) using same API origin HTTP(S) path resolution, target blank with noopener/noreferrer, shared button semantics. Frontend worker consumes those shared APIs, typed file/target controls, shared state/error/confirmation mechanisms, preserving atomic POST.

Rental Agreement Documents is a direct consumer: respect row CanUpload, preserve/set returned entity path and use FileLink for existing files. Adopt the shared file selection owner there where replacing local validation/input. Root owns vocabulary keys and shared components; worker reports any new translation keys before handoff.

## Ownership

Backend worker: RentalAgreementDocumentsVm, RentalAgreementDocumentListVm, new RentalAgreementIdentityDocumentVm, GetDocumentsAsync/SetDocumentAsync in RentalAgreementService, upload endpoint in RentalAgreementController. Frontend worker: LogsMovement View TS/HTML/SCSS; Rental documents model/service and direct Rental Documents TS/HTML/SCSS. Root: shared components; translations; list Actions/print integration after frontend worker handoff; canonical learning and artifacts.

No builds, tests, lint, browser/runtime/database, migrations/snapshots, commits/pushes/deployment. Preserve all user/peer changes. Report conflicts to root and stop the affected slice. Source-only acceptance: complete scoped diff, typed API parity and direct consumers, both error channels, saved-file replacement/state logic, tenant boundaries, translations, imports, whitespace and merge markers.

## Owner-directed presentation refinement — 2026-10-03

Status: Frozen. Evidence S3: `C:/Users/user/Desktop/q.PNG`, Agreement View → Documents, English/LTR; capture date/version/role Unknown. User correction: "الصورة اللى بعتها بتعرض الاقسام فاضية وفى مكان فى زر رفع ليه متبعتش الصورة". This refines the feature's presentation only; the original API and upload contracts above remain authoritative.

- Keep Passport, National ID and Driving License as three stacked identity groups at logical start, with Supporting Documents alongside at logical end. Preserve the existing shared EditorDialog/EditorTabs shell and theme tokens. Feature content uses its existing grid owner; RTL mirrors logical order and narrow widths stack the groups.
- Each Agreement group with no stored file remains visually empty below its label. Identity rows without a nonblank DocumentPath and supporting configured types without a nonblank DocumentPath are not file-display rows. Keep all saved files, their existing open links and eligible replacement actions.
- Keep the Supporting Documents + action beside its heading, controlled by the existing Agreement state. The full configuration collection still feeds the typed upload-target picker, including types without a saved file; do not filter or mutate the source collection or backend response.
- Loading and failure states remain explicit. Other movement sources keep their current document-row and empty-state behavior. No API, persistence, eligibility, printing, translation or schema change.
- Reviewer decision (owner standing rule): reuse the existing 180px/0.8fr identity and 2fr supporting grid proportions; retain two columns above 640px and stack at/below 640px, with flexible minimum-height groups that expand for saved files. The screenshot supports grouping/empty presentation and action position, not copied colors or the modal shell dimensions. Runtime/visual acceptance remains pending for the owner.
