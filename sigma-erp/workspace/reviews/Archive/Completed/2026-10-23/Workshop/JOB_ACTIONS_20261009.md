# Workshop Job action extensions — 2026-10-09

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | Workshop Job row actions: Cancel Job, Add Vehicle Quality Check Report, Job Log and Job Estimation |
| Evidence | User-provided screenshots `1.png` (quality report) and `3.PNG` (Job Log), plus the direct request for Cancel Job and Job Estimation |
| Existing owners | `JobService`/`JobController` status workflow; `JobEstimationService` append-only logs; shared `EditorDialog`, `FileField`, `DocumentUploadTracker`, `ConfirmationDialogService` |

## Initial assumptions — historical, superseded before completion

The following initial implementation was corrected after tracing direct Job ownership. It is retained as history, not the final contract. The authoritative handoff is `JOB_ACTIONS_20261009_CONTRACT_FREEZE.md`.

- `Status.Cancelled` is a terminal server-owned state. Cancel is allowed only for an open Job with no linked invoice. It does not create an accounting reversal, delete the aggregate, or add a reason field because none is present in the request or existing Job contract.
- Cancel uses a warning confirmation, an atomic `Job/{id}/cancel` write, and a list refresh. Terminal Jobs cannot be edited, closed, deleted, or changed through time-log mutations.
- The grid now returns `JobEstimationId` for Job rows. The Job Estimation action opens the linked estimation in its existing read-only route; the Job Log action opens the existing append-only estimation log dialog.
- The quality report uses the existing estimation-log attachment contract. The dialog captures `Quality Checked By`, uploads the selected files through the existing tracker, then writes one manual log entry with the checked-by detail and attachment metadata. These actions are shown only when a Job has a linked estimation, which is the source-supported persistence owner; direct Jobs without an estimation keep no unsupported orphan action.
- Lubrication rows do not expose these Job-only actions.

## Initial source reconciliation — superseded

Frontend changes are limited to the Job list action wiring, typed row identity, the quality-check dialog, translations, guide text and Job service call. Backend changes are limited to the existing Job status enum, grid DTO/projection, service contract, controller route and terminal-state guards. No new table, EF property, migration, accounting entry or permission layer was introduced.

Source-only checks are required before handoff. Builds, tests, browser/runtime checks and database execution remain owner-pending under `F:/My Work/Sigma/AGENTS.md`.

## Corrected implementation and decisions

| Concern | Decision and source evidence | Final producer/consumer |
|---|---|---|
| Domain ownership | Job exists independently of estimation. Create JobLog/JobLogAttachment children; estimation logs remain separate. | Job.Logs; JobService.GetLogsAsync/AppendEntryCoreAsync; JobLogsComponent |
| State | Dedicated JobStatus preserves Open=0/Closed=1 and adds Cancelled=2; shared Status is unchanged. | Job/JobDetailVM/JobGridRowDto + Angular JobStatus |
| Cancel | Only Open, no existing purchase/stock/invoice/voucher references. Use existing IsReferencedAsync owner; status and event share a save and tenant Job lock. No document reversal. | JobService.CancelCoreAsync; warning ConfirmationDialogService action |
| Quality | Required checker name max200, optional validated attachments; stored typed QualityCheck event with structured QualityCheckedBy. Open only. | POST Job/{id}/quality-check; JobLogEntryComponent kind=qualityCheck |
| Closing prerequisite | Existing JobSettings.VehicleQualityCheckReportMandatoryForJobClosing now checks report ID after latest Updated event. History retained. | JobService.CloseCoreAsync |
| Log | Date/time/user/kind/detail/checker/attachments. Manual append available for every live Job state, no update/delete endpoint. Historical creation fallback uses actual original metadata. | GET/POST Job/{id}/logs; JobLogsComponent + JobLogEntryComponent |
| Automatic events | Add, edit, invoice, close, cancel and labour time add/remove record server actor/time; estimate conversion also adds Job creation event. | JobService and one scoped JobEstimationService addition |
| Concurrency | Participating Job update/remove/time/quality/manual/cancel/close/invoice writes use existing ExecuteUniqueWriteAsync<Job>. | Existing tenant transaction/application lock owner |
| Estimation | Open linked ID in existing read-only route. Fixed returnToJobs marker preserves filters and returns to /Job. Unlinked/direct Jobs do not display this action. | JobGridRowDto.JobEstimationId, list openEstimation, estimation editor.close |
| Mapping | No new AutoMapper mapping: logs use explicit DTO projections and editable input assignment. Existing Job mapping maps matching JobStatus types; no new ReverseMap/Ignore. | JobService + existing JobProfiler |
| Calculations/accounting | Existing Job totals, tax, actual-time sums, invoice/journal calculation owners retained. Audit records create no accounting entry. | Existing domain + JobService + MiscellaneousInvoiceService |
| Permissions | Existing AuthGuard/authenticated tenant remain. No permission layer invented. | Existing routing/controller/repository |

### Grid/filters and API alignment

Displayed grid columns remain: No, Invoice Status, Record Type, Status, Estimation No, Vehicle, Customer, Customer Code, Created By, Total Charges, Date/Time, Estimated Completion Time, Branch, Insurance Company. Corresponding DTO properties: No, HasInvoice, RecordType, Status, EstimationNo, Vehicle, CustomerName, CustomerCode, CreatedBy, TotalCharges, DateAndTime, EstimatedCompletionTime, Branch, InsuranceCompany. Minimal action/identity fields: Id, RecordKey, JobEstimationId. Job and lubrication UNION projections include every member; lubrication JobEstimationId/Status remain null. Existing filters/paging/sort/export contracts retained; Cancelled added to existing Status filter.

Four new API endpoints and their typed inputs/results are frozen in the linked handoff. Server owns tenant, user, timestamps, event kind, parent/status and persistence. Inputs contain only detail or checker plus attachment metadata. Paths are normalized to company Media/GUID and validated against PDF/JPG/JPEG/PNG; normalized duplicate paths rejected. Add-Migration is required because two new persisted entity tables/FKs/indexes were introduced.

### Reference conformance

| Concern | Owning block | Actual reference/shared owner | Target comparison |
|---|---|---|---|
| Action menu/confirmation | UI7/9 | ActionList<DataRow>, ConfirmationDialogService.confirm | Typed row callbacks and translated warning confirm; pending/busy guarded |
| Modal header/body/footer | UI13 | EditorDialogComponent title/subtitle/contentPadded/width/height/mode inputs | Titles remain screen names; translated Job number subtitle; padded shell. Entry width560 content-sized flex-fill scroll; viewer width900 height640 with sigma-editor-form and sigma-list-table min-height0 chain |
| Log grid | UI5/6; operational log exception | JobEstimation logs projection and shared DataTable | Actual 4 date/user/detail/attachments columns, dateTime formatter, complete returned history, no paginator, wrapped cell templates, own Job IDs |
| Collection/validation | UI14/19 | EditableCollectionTable, EditableRows, FieldError, typed FormArray | One attachment collection, required row path/name; max400/255; primary Save validates on click, no invalid-form disable |
| Upload/dirty close | UI10/18 | FileField, DocumentUploadTracker, freezeFormState; estimation log attachment lifecycle | Scoped tracker; failed draft retained; discard confirmation; successful persistence marked committed; cleanup Retry cannot POST again |
| Focus/errors/lifecycle | UI22/27/28 | focusField, StateMessage, takeUntilDestroyed/apiErrorMessage | Entry shown focuses correct required field; both failure channels inline with skip-interceptor header; destroy/stale ID checks and loading finalize |
| Shared family | UI preamble/24 | Shared entry shell composed as feature JobLogEntryComponent | Manual and quality forms reuse one lifecycle owner; no feature stylesheet/color forks |

### Files and phase reconciliation

Frontend: Job list/editor/models/service; new logs viewer/entry, quality wrapper; directly related estimation editor return navigation; EN/AR keys; explicit runtime tsconfig files; `UserGuide/content/workshop-guide.ts`. Backend: Job entity/status/event enums/log children/EF configs/DbSets; Job DTOs/interface/controller/service; estimate-conversion creation event; EN/AR GeneralMessage resources. Shared files contain pre-existing payroll/other changes, which were preserved.

Phases 0/1/2/3/4/5/6 apply to evidence, contract, minimal grid field, typed entry dialogs, cancel state, route/service integration, and scoped reconciliation. Financial redesign, approval redesign, new permissions and unrelated feature review are skipped as outside scope. No screenshot functional fields are unresolved. Browser/visual, compile and database acceptance remain pending.

Agent use: one inherited-model `job_dialogs` worker owned only Job dialogs/models/service after freeze. Root owned backend, list/navigation, translations, guide and complete integration/reconciliation. The independent frontend dialog work reduced elapsed time without overlapping ownership. Root corrected the viewer bounded chain and shown focus during integration.

### Owner handoff

- Run `Add-Migration AddWorkshopJobLogsAndQualityChecks`, inspect that it creates JobLog/JobLogAttachment only for these changes, then apply the reviewed migration through the normal owner process. Unrelated pending entity changes may appear and must be reviewed separately. No migration or snapshot was created here.
- Build frontend/backend, then verify an unused Open Job cancels and appears under Cancelled; a referenced/invoiced Job cannot cancel; a cancelled Job rejects edit/close/delete/time changes.
- Verify direct and estimate-created Jobs have their own history; add a manual note with/without attachment; save quality with/without attachment; failed save keeps the draft; discard removes unsaved uploads; cleanup retry never creates a duplicate event.
- With quality mandatory, close fails until a report exists; edit then requires a new report and keeps the earlier report in history. Verify Closed summary remains readable.
- Open linked Job Estimation and close back to the Job list with original filters/paging; verify narrow viewport, RTL, dark theme, scroll and keyboard focus.
- User guide: content above, existing `/UserGuide/workshop` menu/reader registration; Job actions, limits, quality prerequisite/history and return navigation covered. Source conformance checked; owner UX acceptance pending.
- Suggested frontend commit: `feat(workshop): add Job cancel, quality check, log and estimation actions`.
- Suggested backend commit: `feat(workshop): persist Job audit and quality checks with cancellation guards`.
- No builds, tests, lint, browser automation, database commands, migrations, snapshots, commits, pushes or deployment were run.

### Final source verification evidence

- Both actual Git repository roots resolved and scoped tracked diffs plus new source files reviewed. Pre-existing HRM changes in DbContext/resources/translations were preserved.
- Thirty Job runtime TypeScript/template files parsed without source syntax/template parser errors; exact new runtime entries exist in tsconfig.app.json. Parser acceptance is not type-check/build acceptance.
- All 361 Job translation leaf keys match between EN/AR. Fifteen added backend action resource keys are present exactly once and nonempty in both valid XML resources.
- Scoped git diff --check passed. No merge markers or estimation-owned ID/service references remain in the new Job dialogs.
- Final read-only recipe check: all eight plan/phase packets OK. No canonical book change or packet regeneration was required.
- Frontend/backend frozen routes, input/result fields, numeric status/event values, FK ownership and lifecycle consumers reconciled. Compile/EF schema/runtime/visual/RTL/dark-theme checks remain explicitly owner-pending.
