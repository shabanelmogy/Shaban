# Logs Movement documents and Check Card

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Authority | User: fix the documented findings; then add Check Card in Actions (2026-10-03) |

## Inventory and impact

The existing MovementCheckCardComponent owns movement normalization, six view tabs and Agreement attachment upload. RentalAgreement documents GET/POST own supporting files; CustomerDocument owns identity files; Workshop details already return documentPath. FileStore returns server-root-relative paths. Shared EditorDialog, FileField, FileUploadService, StateMessage and ReportPrintService own presentation and validation primitives. Existing Rental Agreement Documents is a direct consumer of the changed DTO. No schema change is required.

| Surface | Classification | Decision |
|---|---|---|
| Movement View and its normalization | Extend/refactor | Preserve source dispatch and details; repair Documents without duplicating the viewer |
| Agreement documents projection/DTO | Extend | Return persisted paths, customer identity files and per-type upload eligibility; retain stored files of closed/inactive/soft-deleted types |
| Atomic Agreement upload endpoint | Keep/extend | Preserve validation, one service save and file cleanup; return saved attachment metadata |
| Shared file field | Extend | Add opt-in File control selection for atomic multipart uploads; retain stored-path mode |
| Stored-file opening | Create shared owner | Same API-origin HTTP(S) URL link, adopted by affected readers |
| Rental Documents consumer | Extend | Respect per-row eligibility and consume returned path |
| Actions and print preview | Extend | Separate Check Card action; reuse normalized movement data and shared print lifecycle |
| Domain, EF, permissions, routes and grid contract | Keep | No entity/configuration/permission/route changes |

## Alternatives

| Option | Assessment |
|---|---|
| Independently upload through Media then attach | Reject: breaks existing atomic upload/cleanup ownership |
| Hand-built feature file input | Reject: repeats shared UI and validation owners |
| Separate print API and duplicated source adapters | Reject: existing source details already supply supported values |
| Extend existing contracts and owners | Selected: additive API, source-supported reads, minimal bounded changes |

## Frozen decisions and compatibility

Customer identity means the Agreement CustomerId's National ID, Driving License and Passport; it does not merge drivers' files. Identity files remain read-only in this screen. Supporting uploads retain the existing open/noninvoiced/nonvoid Agreement gate and active/nonclosed/nondeleted type gate. Historical supporting files remain readable. Workshop paths become readable, without introducing workshop uploads.

Check Card is a read-only report for the five sources already supported by View. The screenshot proves two checkpoint groups, movement/vehicle/contact fields, diagrams, checklist, driver/branch and signature spaces. Current source has no saved checklist answers, damage marks, contact number or signature contract: values absent from the source remain blank, checklist marks remain blank, and signature spaces stay empty. Existing checklist catalog/fallback labels and existing fleet diagrams are reused. No copied CFAO branding or new persisted fields. Fuel display consumes existing mapped level labels, without new domain calculations.

API changes are additive (existing IDs, names, availability and aggregate canUpload retained). Both direct Angular consumers adopt per-row eligibility and saved metadata. New DTO classes are separate files. Repository tenant scoping remains authoritative; includeDeleted is limited to configured type history, never customer/file relations. No migration or AutoMapper changes.

## Dependencies and verification

1. Freeze documents API/UI contract, then independent backend and frontend implementation with separate file ownership.
2. Root implements shared FileField selection mode/FileLink and translations; integrates frontend consumer.
3. After Documents fixes, root adds Actions → Check Card and report rendering/print isolation.
4. Root reviews complete scoped diffs in both repositories, direct producer/consumer types, translations, imports, whitespace, source wiring and packet drift. Builds/tests/lint/runtime/database/browser verification remain owner-pending under AGENTS.

## Conformance

| Concern | Owning blocks | Actual reference / shared owner | Target |
|---|---|---|---|
| Dialog and tabs | UI13/15/18 | EditorDialog/EditorTabs; Fleet VehicleService Details | Shared shell/title/subtitle/footer; internal scroll |
| Upload/file validation | UI18/22/28 | Individual file fields; FileField/FileUploadService/apiErrorMessage | Typed controls, one inline API error owner; no duplicate validator |
| Read states | UI22 | StateMessage | Shared loading/empty/error |
| Printing | UI21 | ReportPrintService; Rental Agreement print isolation | Shared body-class lifecycle; bounded preview and full print flow |
| Tenant/history projection | BE3/6/8 | Repository.Query; RentalAgreement document service | Tenant/live ownership and explicit config history exception |
| Contract/integration | Master2/4/5/7; UI2/23/26/29 | Existing service/results and vocabulary | Additive DTOs, direct consumers, source-only reconciliation |

Guide and generated packet drift check passed before delegation. Applicable phases: 0, 1, 3, 5, 6 plus bounded list action wiring. Phase 4 domain transitions and phase 2 grid/read redesign are not applicable.
