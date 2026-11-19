# Fleet frontend contract handoff — 2026-10-04

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Authorization | User: review `src/app/modules/Fleet` and apply documented fixes |
| Boundary | Frontend Fleet and direct shared dependencies; backend read for contract evidence |
| Recipe check | All eight recipes passed `Generate-SigmaRecipes.ps1 -Check` |

## Frozen implementation boundary

Preserve existing endpoint names, verbs, request/response DTO fields, filters, enum values, calculations and domain state transitions. Correct source-confirmed UI/async/upload/translation defects using canonical shared owners. No new business fields, permissions, accounting effects or schema changes. A conflict with the actual API pauses only its dependent slice and is returned to the root reviewer. Record detailed per-feature evidence before changing its consumers.

The baseline Fleet tree is clean in Git; other modules, shared files and translations contain pre-existing owner changes and must be preserved.

## API decisions

| Family | Confirmed source contract | Decision |
|---|---|---|
| Vehicle | `GET Vehicle/Search` uses top-level `VehicleSearchVM`; null pageSize is the existing unpaged contract. `GET Vehicle/GetByWithNavigationsId/{id}`, POST/PUT Vehicle; tariff and status-detail reads remain separate | Preserve custom search and authoritative returned state; do not convert to Filters blindly |
| Accidents | Generic paged list uses `PageNo/PageSize/Filters`; `GET Accident/Report` accepts top-level `AccidentSearchVM`; Options, AgreementVehicleOptions and ResolveMovement reads; POST/PUT/DELETE existing CRUD | Shared serializer for generic list only; preserve report filter binding and movement resolution |
| ServiceBookings | Generic paged list uses `Filters`; Export uses top-level `VehicleServiceBookingSearchVM`; AgreementOptions, `{id}/History`, PATCH `{id}/Confirm` and `{id}/Close` | Keep exact status transitions and append-only history |
| ServiceLog | `GET ServiceLog` binds `ServiceLogSearchVM` with top-level keys; POST appends a log | Operational-log exception: no edit/delete introduced |
| Alerts | GET FleetAlerts/{insurance,registration,mileage,warranty,services} binds top-level FleetAlertSearchVM; PUT insurance/renew; POST services/complete and services/reminders | Preserve variant columns, selection and exact payloads. Registration/Mileage/Warranty remain read-only; prior decisions in FLEET_ALERTS_FEATURE_REVIEW apply |
| Catalogs | ServiceItem, SourceCode, VehicleType, VehicleService existing CRUD, Results list, Result detail/write | Preserve declared contracts; standard base endpoints use shared ListQuery serializer |
| Reports and import workspaces | DailyServiceLogs, QR label, damage repair/history and toll/fine workspaces retain their declared service contracts | Verify producer completeness before local paging/print/export; never infer completeness from wrapper name |
| Tracker/checklist | Existing source and routing determine live ownership | Do not invent tracking provider or an endpoint for ServiceChecklistItem1 absent from backend |

All existing writes remain client-input-only; backend owns subscription/audit/numbering/derived state. Child snapshots retain saved row IDs. Upload lifecycle adopts DocumentUploadTracker where stored-path uploads exist. Global mutation interceptor owns standard success feedback; inline errors require X-Skip-Error-Interceptor and shared apiErrorMessage.

## Shape and reference decisions

| Shape | Scope | Book and approved source |
|---|---|---|
| Modal list | Simple catalogs, fields/one small collection without totals | UI 1–10,13–19; Workshop/Job list; Fleet/VehicleService details |
| Routed aggregate | Vehicle (Documents + Warranties), Accident (images + charges), VehicleService when its collections trigger D4-2 | UI 1,13,14; Workshop/Job editor; backend pattern 2 |
| Action dialog | Renewal, completion, operational actions | UI 7,13,19,22; Workshop/Job close-job |
| Report | DailyServiceLogs, QR and history outputs | UI 20/21; Accounts/TrailBalance and Customers/StatementOfAccount; backend report pattern 5 |
| Specialized workspace | Fine/toll processing, vehicle tracking | Preserve workflows; shared shell/filter/control/state pieces, no invented generic CRUD |

Backend shape evidence: normal catalogs use pattern 1; owned collections use pattern 2; operational logs and reports are explicit exceptions. Accounting calculations remain unchanged. Backend implementation is outside this frontend request unless a confirmed direct contract correction is required and recorded.

## Integration and execution decisions

Root owns shared files, en/ar dictionaries, routing/configuration and final integration. Workers own disjoint feature directories and per-workstream review artifacts. Reference directories are read-only unless included in the worker's explicit Fleet scope. Every worker reads canonical owning blocks and actual references before edits, records conformance and reconciles its complete scoped diff. No builds, tests, lint, browser/database commands, migrations, commits, pushes or deployment.

No screenshots were supplied. No material business assumptions are approved by this handoff. Schema migration is not expected for frontend-only fixes. Owner compilation/runtime/visual/RTL/theme/print acceptance remains pending.

Documentation conformance follow-up — 2026-10-08: refreshed recipe packets were checked before this pass and all PLAN-00/PHASE-00..06 checks returned OK. Fleet list filters now opt into the shared stable layout; simple catalog/tracker filters use the shared inline action placement; report filters use the stable report strip; all Fleet PrimeNG calendars explicitly preserve invalid typed input with `keepInvalid=true` and editable input with `readonlyInput=false`; VehicleQRLabel list transport now uses `DEFAULT_PAGE_SIZE`. The Sales guide Fleet topic was updated to describe the stable filter/More filters/Search/Reset workflow. No endpoint, DTO, persistence, calculation, permission or blocked-workflow assumption was introduced. Source-only validation and owner visual/build/runtime acceptance remain pending.
