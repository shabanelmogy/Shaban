# Workshop approved-pattern maintenance

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-03 |

Request: review `src/app/modules/Workshop` and implement confirmed findings under the approved documentation. Tier L. Authority: Sigma AGENTS.md, Master 1–7, UI screen catalog and owning blocks; recipe drift check passed all eight packets before use. No supplied screenshots; existing source and historical frozen feature decisions are evidence.

## Existing state, impact and gap decisions

| Area / owner | Current state / consumers | Decision | Target / impact |
|---|---|---|---|
| Job / JobEstimation | Existing routed aggregates, shared lists, action dialogs; related APIs and historical feature reviews | Refactor | Adopt current shared date, error, validation, lifecycle, paging and editor rules; preserve business states, numbers and accounting behavior |
| LubricationJob | Routed collection editor reached from Job grid | Refactor | Preserve typed item snapshot, customer and dates; prevent failed load or in-flight edits from saving |
| WorkOrder | List and modal editor with totals, legacy filters and mutable total inputs | Refactor | UI13 D4-2 requires routed create/edit/view; preserve list state and historical Create Job deferral; remove derived write fields, retain absolute tax input semantics |
| JobCategory / LabourActivities | Ordinary entities, modal editors and paged lists | Refactor | Normal entity shape, current shared list/modal/date/error helpers |
| LabourTariff | Two settings sets keyed by profile/activity, explicit historical replacement contract | Keep business contract; Refactor UI | No change to omission/deletion semantics without owner decision; reuse existing editable rows/settings shell |
| LabourActivitiesReport / estimate report | Existing complete read-only data / detail report | Refactor | Shared report tables, complete export/print, current month dates, shared money/state/print owners |
| workshopVehicles | Confirmed POST Workshop/vehicles compatibility read; Vehicle detail viewer | Refactor | Typed result, bounded list, stale-request prevention; preserve POST endpoint, filter keys and result metadata |
| JobItem / JobMisc / JobExternalWork / WorkOrderItem | Standalone child CRUD scaffolds alongside aggregate owners | Investigate then Remove only with source proof | Master5 G12 applies only after no menu/live consumers are proven; move live dependencies first; backend APIs remain |
| Shared / i18n / routing | Pre-existing unrelated changes | Keep; minimal necessary integration | Preserve all existing changes; one interceptor-equipped client, AuthGuard only |

## Options and decisions

| Option | Correctness / compatibility | Decision |
|---|---|---|
| Keep local copies and modal WorkOrder | Contradicts current UI 1/4/13/14/17/22 | Rejected |
| Reuse approved shared owners and current API | Correct guide conformance with bounded frontend changes and no schema effects | Selected |
| Invent new tax, approval, tariff deletion or authorization policy | Changes business/accounting/data semantics beyond evidence | Rejected; report any discovered material conflict separately |

## Logic ambiguity / open decisions

Confirmed: server owns tenant, numbers, audit, states and totals; dates use local parts; aggregate updates are full snapshots. Sources: current controllers/VMs/services and existing Job, JobEstimation, LabourTariff and WorkOrder review records. Historical WorkOrder modal choice is superseded by current UI13 D4-2; historical business decisions remain. LabourTariff replacement is an explicit feature exception and must not silently change to generic keyed upsert. Standalone child roots require additional reachability proof before removal. No new domain concept is approved by this plan.

## Target, compatibility and verification

Keep existing URLs where practical through compatibility redirects when moving editors. Requests carry editable fields and identity only. Backend remains authoritative for totals and state validation. No entity/EF/migration or historical-data changes are planned. Preserve pre-existing Job invoice-customer work and all unrelated dirty files.

Order: root discovery / unchanged-API freeze → non-overlapping frontend workstreams → root wiring / source reconciliation. Every worker reads its owning canonical blocks, actual reference source and relevant phase packets before editing, records exact conformance and source evidence, and stops any contract conflict for root resolution.

Source checks: read producer/consumer contracts, complete scoped diffs, whitespace/merge markers, translated keys, modes/routes, loader finalization, cancellation, payload ownership, action/refresh coverage and complete report outputs. Builds/tests/lint/browser/database/migrations/commits/push/deployment are prohibited for this task. Owner acceptance: compile frontend, exercise all modes/failing requests and rapid paging, print/export above 100 rows, RTL/dark/narrow layouts and existing backend action rules. Recovery is source rollback of task-owned changes only; no data rollout.
