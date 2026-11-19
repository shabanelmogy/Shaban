# Data Entry Corrections — maintenance and evolution

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

Request: «راجع : src\app\modules\Data Entry Corrections وطبق التعديلات وفقا للوثائق وعايز اعرف الهدف من الشاشة». Implementation is authorized. Missing low-risk details use Master2 rule6, recorded here; no data rewriting, access policy or accounting effect is authorized.

## Existing state and impact map

| Owner | Existing behavior / consumers | Decision | Impact |
|---|---|---|---|
| DataEntryCorrection entity/API | EntryNo, DateTime, By, Detail, Open/Closed, SLA string, string attachments; inherited CRUD | Extend/refactor | Request identity/date/actor/status become server-owned; add structured SLA IDs; preserve historical text |
| DataEntryCorrectionModel entity/API | Detail, required selected SLA IDs, attachments; separate persisted record | Keep/refactor | Keep separate endpoint/route; do not silently convert models into requests |
| Both Angular features | Copied modifier columns/actions, audit/tenant controls, broken navigation and create dereference | Replace | Typed shared list and controlled modal composition; existing actual fields only |
| SupportSlaAgreement | Existing tenant-scoped Available endpoint, active/non-expired agreements | Keep/reuse | Read-only dependency; no duplicate catalogue or reference edits |
| Media + FileField + DocumentUploadTracker | Stored paths; type/size validation; save/discard cleanup | Keep/reuse | Use existing upload owner and typed scalar attachment collection |
| Guide reader/menu | No corrections guide | Extend | Register bilingual module guide, keep current reader |

## Ambiguities, alternatives and reviewer decisions

| Question | Evidence | Frozen decision / alternatives |
|---|---|---|
| Purpose | Screenshot description, SLA, attachment, Open/Closed; backend has no correction executor | Request registration/tracking only. No automatic accounting/data changes or SLA timer promised |
| SLA identity | Model has integer IDs; existing SupportSlaAgreement catalogue | Reuse that catalogue; store IDs on request and preserve SLA text snapshot. Reject parsing display strings as IDs and duplicate catalogue |
| Existing requests | Existing SLA string without IDs | New IDs default empty; preserve old string and existing stored values; no inferred backfill. New Create requires a selected eligible agreement; unchanged historical selections can remain on Edit |
| Metadata | Existing entity No and repository numbering; tenant/audit stamping | Server stamps date/actor/open status and uses existing No as EntryNo; historical empty EntryNo displays No fallback only, no rewrite |
| Closed section | Enum already has Open/Closed; screenshot closed region | Backend-owned idempotent Open→Closed action after confirmation, no reopen. Preserve existing Edit/Delete behavior; do not infer closed edit/delete locks |
| Last update text | Screenshot shows creation event; source has no update-event timeline | Show actual creation metadata, no invented latest-update history or timestamps |
| Forms | Main fields + one small scalar attachment collection; Model equivalent | Screen type01 controlled modal, single list route; preserve the model route as independent model records |
| Attachments | Existing lists of stored paths and shared tracker | Full snapshot path array, shared FileField/table, cleanup only after successful save or unsaved-upload discard; no new nested upload shell |

## Target and compatibility

Exact API/UI contracts are in `DATA_ENTRY_CORRECTIONS_FULL_STACK_CONTRACT_FREEZE.md`. Pattern1 generic service/controller remains; feature overrides only for actual metadata, SLA validation/snapshot, search/sort, attachment validation and close. Ordinary pager/count stays inherited. Models have no request lifecycle. No new permission system or financial effect.

Schema change: request SelectedSlaAgreementIds collection, empty default for historical rows. Owner must create a migration; no historical string parsing/backfill. Existing strings and model records retained. Review migration against pending Support SLA changes before applying. Frontend and backend deploy together after schema update; rollback preserves historical columns and does not erase IDs.

## Implementation and verification

1. Phase0/1 discovery and frozen contract (root).
2. Backend implementation, owned by bounded agent; Angular list/editor implementation in parallel after freeze (root).
3. Phase4 Close/Delete/child removal, Phase5 routes/translations/guide.
4. Phase6 complete diffs in both repositories, contract and source conformance checks (root).

Source checks: exact column/ListVM fields, API requests, validation, numbering, tenant scope, upload cleanup, enum zero filters, all-page export, applied query, cancellation, imports, bilingual keys, guide/menu. Owner checks: build, requests, migration, Create/Edit/View/Close/Delete and attachment failures, SLA expiry/history, paging/export, Arabic/English, themes, narrow/intermediate/short-height layouts, keyboard and dirty navigation. No build/test/lint/browser/database/migration/commit/push/deployment commands are authorized.

Open decisions: actual automatic correction workflow and SLA response-time policy remain out of scope; screenshots/source do not define them. Non-blocking for request registration.
