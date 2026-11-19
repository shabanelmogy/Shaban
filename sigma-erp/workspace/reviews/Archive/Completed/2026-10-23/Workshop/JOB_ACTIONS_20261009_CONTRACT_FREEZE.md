# Workshop Job actions — corrected contract handoff, 2026-10-09

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Scope | Cancel Job, Add Vehicle Quality Check Report, Job Log, Job Estimation |
| Decision authority | Direct user requests and quality/log screenshots; AGENTS standing screenshot decision, Master 2 rule 6 |
| Supersedes | Initial implementation assumptions in JOB_ACTIONS_20261009.md: estimation-owned logs/quality and shared Status extension |

## Evidence and shapes

Quality screenshot proves checked-by, optional attachments, add attachment, Save and Cancel. Log screenshot proves date/time, user, detail, attachments, Add New Entry and close. Cancel and Estimation are explicit action requests. Layout belongs to shared EditorDialog, DataTable, EditableCollectionTable, FileField, confirmation and upload tracker (UI 7/9/10/13/14/18/19/22/28). Job is an existing stateful aggregate; logs are an append-only operational exception (BE 1–6/8/14/18). Existing estimate logs supply attachment validation/lifecycle reference only, not ownership.

## Frozen backend and wire contract

- Job uses its own JobStatus enum: Open=0, Closed=1, Cancelled=2. Existing integer values remain compatible; shared Status remains Open/Closed.
- GET Job/{jobId}/logs returns Results<JobLogDto>. Fields: id, createdAt (nullable original metadata), createdBy, eventKind, detail, qualityCheckedBy, attachments[{filePath, originalFileName}]. Sorted descending timestamp then ID. Historical Jobs may show a read-only Added fallback from their original creation metadata, ID=0.
- JobLogEventKind: Added=0, Updated=1, Invoiced=2, Closed=3, Cancelled=4, QualityCheck=5, Manual=6, TimeAdded=7, TimeRemoved=8. Server owns kind/user/time/tenant/parent.
- POST Job/{jobId}/logs takes {detail, attachments}; detail required, trimmed, max2000. Manual append is allowed for every live Job status. No edit/delete log API.
- POST Job/{jobId}/quality-check takes {qualityCheckedBy, attachments}; checked-by required trimmed max200; Open Job only. Creates structured QualityCheck log, no free-text surrogate. Attachments optional; each path max400, name max255, valid tenant Media GUID path, pdf/jpg/jpeg/png matching extension; reject duplicate paths.
- JobLog and JobLogAttachment are EntityBase children with JobId/logId FKs, tenant stamping, restrict Job deletion and cascade attachment FK. Existing repository soft-delete is retained. Migration is owner-run only.
- POST Job/{jobId}/cancel: Open only; reject any purchase/stock/voucher/invoice dependency using existing Job delete-reference owner, do not reverse documents. Status and Cancelled log saved atomically.
- Existing Add/Update/Invoice/Close and labour-time writes append corresponding Job event atomically. Job aggregate writes, cancel, quality and manual entry share ExecuteUniqueWriteAsync<Job>. Added event also saved on estimate conversion.
- Closing rejects Cancelled. Existing Closed summary GET remains supported. If existing JobSettings requires vehicle quality, Close requires a QualityCheck after latest Updated event; edits invalidate earlier quality for closing, but history stays visible.

## Frozen frontend/action contract

- Cancel warning confirmation; only Job/Open/no invoice. Report quality Job/Open. Job Log every Job status, independent of estimation. Job Estimation only linked JobEstimationId, opens existing view and returns to Job with applied list state. Lubrication rows expose none of these four.
- Grid adds only jobEstimationId to existing displayed-column contract, including null on lubrication union projection. No column change required.
- Shared busy/confirmation guards, inline failure channels, typed payloads, Save validates on click, upload cleanup retry cannot resubmit a committed entry. Log Add New Entry opens typed nested dialog with required Detail + optional attachments.
- UserGuide/Workshop updated with action availability, historical log, quality prerequisite and cancellation dependency rules.

## Verification boundary

Recipe drift check passed all eight packets before use. Source parser/diff/import/translation/contract reconciliation only. Builds/tests/browser/database/migrations/commits/push/deploy prohibited for this task by AGENTS; owner verifies those. Suggested migration: AddWorkshopJobLogsAndQualityChecks.
