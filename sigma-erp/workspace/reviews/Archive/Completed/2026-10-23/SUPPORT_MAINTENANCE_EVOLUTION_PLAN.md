| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Support — maintenance and implementation plan (2026-10-14)

User request: «انشئ قائمة جديدة تحت Adminstration فى نفس المستوى بإسم Support طبقا للوثائق وانشئ الباك اند والفرونت اللازمين» with four SupportRequests screenshots. Master 2 standing owner rule resolves unspecified details conservatively.

## Existing state and impact

| Area | Existing owner/evidence | Decision | Target and impact |
|---|---|---|---|
| Requests | Helpers/Models/SupportRequest.cs; generic service/controller/profile; primitive attachment paths; Open/Closed; Normal/High/Urgent | Extend | Keep table and historical fields; replace client-owned audit/number/status writes with backend ownership |
| Legacy draft | SupportRequestModel and SupportPriority | Keep | Separate unused draft model, no confirmed reader or SLA principal; do not build a parallel request store or migrate its rows |
| SLA | Only unvalidated ids in draft and text on request; no actual agreement entity/API | Create | Minimal tenant agreement master: name, inclusive expiry date. Request selects zero or more currently valid agreements; backend validates and snapshots display text |
| Attachments | Media/FileStore; valid PDF/JPG/PNG, 5 MB each, authenticated tenant path | Keep/Extend | Atomic multipart request creation through FileStore, rollback cleanup on failed persistence. No pre-save remote uploads |
| Angular/menu | No Support module/routes/menu | Create/Extend | Root Support group immediately after Administration, requests + SLA management + guide |
| Shared UI | Job list, EditorDialog, FileField selection mode, editable collection, DataTable, filter panel | Keep | Reuse approved owners, no custom palette or grid |
| User guide | Existing UserGuide reader and typed bilingual sections | Extend | New support section in same reader |

## Options and reviewer decisions

| Question | Rejected option | Selected option and evidence |
|---|---|---|
| Persistence | New request entity / SupportRequestModel as second writer | Existing SupportRequest is the captured list contract; extend it |
| SLA | Hard-code CRS/date; misuse rental/customer agreements; free-text client claim | Minimal real SupportSlaAgreement table and maintenance UI; screenshot shows selectable expiring agreement, no source principal exists |
| File transport | Pre-upload and orphan sweeper for an otherwise atomic create | Select files locally, upload during Save using existing RentalAgreementController atomic FileStore orchestration; failed persistence cleans uploaded paths |
| Closed workflow | Invent approval roles/reopen/auto-close | Explicit idempotent Close, same Open→Closed domain as current source; reusable confirmation, existing CustomerRequest Close is factual workflow support, not layout authority |
| Destructive actions | New Delete buttons | No new deletion UI; existing generic backend endpoints retained. No automatic deletion/backfill of historical rows |
| SLA eligibility | Require screenshot's example agreement; require one when none configured | Optional selection; selected ids must be distinct positive tenant-live rows whose expiry is today or later. Snapshot retained for historical view; no fabricated value |

No accounting effects, new access restrictions, email delivery or external support integration. AuthGuard/authenticated controllers remain the known mechanism. No existing data is rewritten. Existing legacy SLA text and file links remain visible. Name expiry edits affect future eligibility, not request snapshots.

## Execution and verification

Phase 0/1 discovery and frozen contracts precede parallel backend and frontend implementation with disjoint ownership. Root owns wiring, translations, guide, integration and reconciliation. Phases 2/3 build lists/forms; Phase 4 Close; Phase 5 routing/providers; Phase 6 source-only review. Source checks compare contracts, public shared inputs/imports, translations, paging/filter/export, rollback and diff. Owner runs migration/build/runtime/RTL/theme/file-failure journeys. Additive SLA table and primitive selected-id column require owner migration before requests use them; historical rows receive an empty selection, preserving snapshot text. Roll back source and additive schema only after preserving newly entered data; no migration is generated here.

Recipe -Check: all PLAN/PHASE packets OK, no refresh required.
