# Estimation and lubrication source conformance

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-03 |

Bounded worker ownership: frontend `Workshop/JobEstimation`, `Workshop/LubricationJob`, this evidence file only. Frozen contracts: `WORKSHOP_FRONTEND_CONTRACT_FREEZE.md`, `WORKSHOP_MAINTENANCE_EVOLUTION_PLAN.md`. No screenshots supplied. Baseline scoped Git status was clean. Root reports recipe drift check passed before delegation. Required skill and owning canonical blocks/packets read. UI type02 aggregate plus type07 complete estimate report and append-only log dialog. Backend pattern2 remains read evidence only.

## Before-edit reference comparison

| Concern | Book | Reference symbol / shared owner | Initial target finding / decision |
|---|---|---|---|
| Container fill, fixed footer, fields | UI1/3/13 | Job editor template and `sigma-editor-*`, FormSection | Estimate viewport calc and both local shells/fields/footer migrate to shared; retain bounded group workspace only |
| Search/applied paging | UI4/6/10/28 | Job list `bindListQueries`, FilterPanel, `resolveListPaging`, list-route-state | Estimate already switchMap; migrate filter chrome/reset and shared paging; retain applied filters and existing return keys |
| Columns/export | UI2/5/8 | Job list typed columns, `dataTableExportRows`, `fetchAllPages` | Estimate money/date/status and export mapper/loop copies migrate to shared |
| Rows/save/leave | UI14/19/10/22 | Job editor `EditableRows`, invoice-customer `canDeactivate`, field-error | Confirm saved/edited removal; failed detail blocks Save/Retry; disable snapshot on save; route-local guard |
| Dates | UI17 | `DatePickerDirective`, `date-utils` | Estimate UTC datetime converter removed; lubrication local parser replaced; structured single dates |
| Report | UI20/21/24 | TrailBalance presentation, StatementOfAccount shared bounded grid, ReportPrintService, SummaryCards | Estimate native report table/summary migrate to typed shared components; API remains paged, gather every page before display/export/print |
| Logs/files | UI13/18/22 | EditorDialog, FileLink, FileField, DocumentUploadTracker | Remove legacy upload/delete, retain failed cleanup paths/retry; pending uploads survive failed save; one error owner |
| View lookups | UI15/16/22 | Detail DTO display names and select endpoint | Estimate skip edit-only options. Lubrication detail lacks customer/vehicle labels: preserve display-required select requests as source-supported compatibility exception accepted by root |

Backend evidence: `JobEstimationController`, `JobEstimationService.GetManyAsync`, `AddLogAsync` (JSON attachments paths), approval/conversion methods; `LubricationJobService.DetailWithNavigationsAsync` and Add/Update full snapshot reconciliation; their Detail/Add/Update VMs. No backend contract changes authorized.

## Root integration acceptance — 2026-10-04

Status: Implemented — source-only; owner verification pending: yes. Root completed integration after worker final turns were interrupted by account usage limits. Source parsing, scoped diff review and owner acceptance steps are recorded in ../WORKSHOP_FEATURE_REVIEW.md; no runtime acceptance is claimed.

Estimate: root fixed duplicate returns after conditional-positive validators; preserved backend-derived View prices/charges and converted remaining View inputs to read text; merged saved selected labels; cancelled vehicle lookup uses a typed suppressed-error feature request. UnitPrice/Cost reject referenced zero as HTTP RequiredIf requires. Tax preview now uses source-confirmed default precision2 and shared documentTax on rounded taxable subtotal; backend is authoritative. Header TotalCharges preview preserves the backend unrounded subtotal-plus-rounded-tax rule. Full output remains fetchAllPages. Logs retain uploads on failed save and have cleanup Retry; shared wrapped cells preserve long notes/links. Lubrication lookup failure now has per-vehicle feedback/Retry and a suppressed-error feature request; saved makeAndModel remains fallback.

Backend WorkOrder tax changes are separate root ownership under owner-approved frozen amendment5, not this worker's backend write. Static source checks pass; compilation, filters/paging, date input, typed row validations, converted states, upload cleanup, RTL/theme/narrow rendering and print/export remain owner checks.