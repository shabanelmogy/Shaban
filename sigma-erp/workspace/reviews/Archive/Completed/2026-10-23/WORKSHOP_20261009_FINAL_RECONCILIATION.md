# Workshop final reconciliation — 2026-10-09

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | `SiGmaAngularFrontEnd/src/app/modules/Workshop` and directly related UserGuide/sidebar/i18n wiring |
| Request | Review Workshop and apply the confirmed documentation changes |
| Authority | `AGENTS.md`; frozen Workshop maintenance/contract artifacts; Master Guide blocks 4, 5 and 7; UI blocks 1, 4, 10, 14, 17, 22, 23 and 28; generated PLAN-00 and PHASE-00 through PHASE-06 |
| Screenshots | None supplied |
| Verification boundary | Source-only; build, tests, lint, browser, database, migrations, snapshots, commits and push were not run |

## Implemented changes

| Concern | Implementation | Evidence / conformance |
|---|---|---|
| Routed editor discard | Job, JobEstimation, LubricationJob and WorkOrder defer confirmation until subscription, freeze the active form without emitting events, recheck identity/loading/saving/row-removal state, and restore only a cancelled still-current editor. Successful Save bypasses the guard. | UI10; `canDeactivate` in the four routed editor components and their existing route guards |
| Child removal | Parent mutations, Save, Add and group selection are gated while `EditableRows.confirmationPending` is true; `freezeParentOnConfirmation` is enabled for Job, JobEstimation, LubricationJob, WorkOrder, LabourTariff and estimation log attachments. | UI14; shared `EditableRows` owner and feature consumers |
| Modal discard | JobCategory and LabourActivities preserve the captured dialog identity/mode and restore the form only while the same dialog remains active. Estimation log discard restores only on cancellation; committed upload cleanup remains frozen. | UI10/13/18; dialog and upload consumers |
| Date hydration | Date-only list/editor values use shared `toPickerDate`; datetime transport retains datetime precision and `toApiDateTime`. | UI17; Job, JobEstimation, LubricationJob and WorkOrder consumers |
| List/filter shell | Existing canonical list headers, filter wrappers, paging snapshots, cancellation and stable layout are retained; Category and Labour Activities opt into the approved stable list layout. | UI1/4/5/6/7; no new list VM or API shape |
| Labour tariff | Tab/vehicle changes reject busy or pending-removal state, defer discard confirmation, and preserve the whole-set replacement contract. | UI10/14; `LabourTariffComponent` |
| User guide | Added bilingual Workshop guide with eight routed topics, workflow steps, server-owned totals/state notes, and discard/action guidance. Registered it in the existing reader, Workshop sidebar and English/Arabic vocabularies. | Master block 7; `workshop-guide.ts`, reader, sidebar and `workshopMenuEntry` translations |

## Backend and contract reconciliation

- No Backend source was changed in this continuation. The WorkOrder soft-delete concern was audited against `Repository.Query`, whose default live query already excludes deleted rows; adding a redundant service predicate was rejected and reverted.
- No entity, DTO, mapper, endpoint, permission, state transition, tax rule, persistence rule, schema or migration was changed.
- Existing WorkOrder, Job, estimation, LubricationJob and tariff contracts remain frozen. Derived totals and tax remain backend-owned; Add/Update payloads remain editable-input-only.
- Empty legacy Workshop folders have no tracked source, route or consumer and were left untouched.
- Existing unrelated working-tree changes in both repositories were preserved.

## Verification performed

- `Generate-SigmaRecipes.ps1 -Check`: all eight generated packets passed after the final edits.
- TypeScript source parser: zero parse diagnostics for the changed Workshop, UserGuide, sidebar and guide files.
- Scoped static checks: no Workshop `toISOString`, `flatMap`, empty error callback, local `EnumOption`, bad enum `option.value`, or manual date-only `new Date(...T00:00:00)` pattern remains.
- English/Arabic Workshop menu key parity passed.
- Scoped `git diff --check` passed in the Angular and Backend repositories; only normal LF/CRLF conversion warnings were reported.

## Owner verification handoff

Please verify in the application: Cancel/Back and browser navigation on each routed editor; cancelled and confirmed child removal; Save while a removal or discard confirmation is open; date-only values across local time zones; RTL/light/dark/responsive layout; upload cleanup retry after success/failure; tariff tab and vehicle switching; WorkOrder pending-only actions; and the new Workshop guide links/content. Runtime, build and API behavior remain owner-pending by the source-only boundary.

Suggested frontend commit: `fix(workshop): align discard lifecycle and add user guide`.
