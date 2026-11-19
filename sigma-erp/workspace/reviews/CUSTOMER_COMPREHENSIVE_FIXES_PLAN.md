# Individual / Company — comprehensive fixes contract

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-01 |
| Authorization | Owner: implement every finding in the comprehensive review |
| Authority | Sigma AGENTS; Master; Backend Pattern 2; UI type 03 and nested type 01; canonical books override stale generated packets |

## Scope and decisions

All BE-01–BE-09 and F01–F18 from the two comprehensive review reports are in
scope. Existing five shared-write fixes and unrelated working-tree changes are
preserved. No build, test, lint, runtime/browser, database command, migration,
snapshot, commit or deployment is authorized by this contract.

| Slice | Frozen contract / disposition |
|---|---|
| Individual update (BE-01/02) | Load tracked aggregate first; verify ownership of collections and address/billing references; reconcile directly VM-to-tracked-child with existing Base helpers. Ignore manually reconciled navigations in the Update profile. Do not rewrite the legacy generic Base update for other features. Preserve saved child No. |
| Customer imports (BE-03–09, F10–12/17) | Authenticate Company/Individual import endpoints; no new role restrictions. Keep partial chunk results. Persist supplied Company address and resolve live tenant country. Enforce existing billing validation, defined enum values, required/nonfuture birth date, persisted string limits. Return safe localized persistence errors, log internal exceptions server-side. CSV uses the existing Papa/shared import owner; explicit boolean/number parsing rejects malformed nonempty cells. Canonical isInactive key; accept legacy inActive header alias. DMY/ISO dates use shared parser. Inline feedback/finalize/inflight guard; shared fill table/title shell. |
| Documents (F03/07) | Shared row/factory/payload; explicit PartnerDocumentType wire enum. Type, number, issue date and expiry date required; expiry strictly after issue. Issuer/path/international optional. Limits 100/100/400. CustomerDocuments folder. Existing incomplete rows require completion, never invented values. Match backend shared VMs. |
| Individual editor (F01–04/06/08/09/18) | Successful detail snapshot required before Edit save; retry/error state. Enforce form.invalid with explicit complete summary specs. Gate saving/navigation during load/upload/cleanup. Track original saved paths and clean only after successful persistence; visible cleanup failure and retry. Email/gender/nationality optional to match API; no invented two-character minimum. Match DB maximum lengths. Clamp page size 1–100. View uses saved labels, no edit lookup requests; Edit retains selected saved options. |
| Shared upload owner (F05) | Accurate active upload tracking until every subscribed upload ends; retain public uploading() compatibility. Cleanup/discard cannot race unfinished uploads. |
| Company UI (F13–15) | Forward header navigation uses the same current-step validation as Next. Explicit StepFormFieldSpec declarations and translation keys/IDs; consistent row form binding; otherDetail FieldError. Root owns shared translations. Neutral partnerForm enum keys replace cross-feature individualForm ownership in scoped partner forms. |
| Legacy roots (F16) | Retire Company alias, standalone CompanyDriver/CompanyContactPerson screen roots/routes/providers. Preserve live Driver API service/models and agreement picker consumers. Move reusable driver fields/draft dependencies to current CompanyPartner owner; no backend API removal. Whole-row standalone Driver finding closes through retired UI. |
| Card-sensitive contract (R3/backlog28) | Pending explicit owner answer required by Master data-destruction boundary. Proposed minimal contract: last4 exactly four digits; keep brand/name/bank/expiry/default/active. Remove PAN/CVV from source only after answer. No token/gateway invented. No database changes here. Owner migration must backfill Last4 before dropping PAN/CVV; existing card rows must be preserved. Other slices remain Frozen and continue. |

## Impact map and classification

- Extend: existing Individual aggregate service/profile; customer import mapping,
  validation and feedback; shared partner forms and upload tracker; canonical
  enum translation owner.
- Refactor: Individual state/validation/View, Company step/spec/row binding,
  customer CSV pages to current shared shell/table/CSV component.
- Remove: obsolete standalone frontend roots after live-consumer search.
- Keep: Company tracked reconciliation, generic Base for unrelated consumers,
  participating application lock writers, partial import chunks, early root
  numbering and current count numbering boundary, existing accounting behavior.
- Create: this scoped contract and final reconciliation artifact only; no parallel
  form/grid/upload/import framework.

## Ownership and dependency gates

1. Backend worker: backend application files for BE findings and shared document
   DTO validation; card backend only after root sends the owner decision.
2. Individual/shared worker: IndividualPartner editor/models/list, shared
   partner-editor models/forms, DocumentUploadTracker; no vocab/Company/import files.
3. Company worker: CompanyPartner editor/fragments, driver field relocation and
   retired standalone UI files; no shared partner owner, routing/Layout/vocabs/imports.
4. Root: imports/shared CSV owner, vocabulary, routing/Layout/global consumer audit,
   contract decisions, integration, docs/skill and full scoped source diff review.

Workers preserve peer/user edits. Cross-owner dependencies are reported, not
independently redesigned. Canonical books and skill are promoted together after
integration; generated packet regeneration and semantic review remain pending.

## Integration amendments — 2026-10-01

- Page-size contract clarified to 10–100 for the Individual UI (shared table minimum
  and menu start at 10); the backend supports 1–100. This supersedes the initial
  UI clamp of 1–100 above without changing backend pagination.
- Retired roots also leave `tsconfig.app.json.files`; owner-reported TS6053 exposed
  eight obsolete explicit entries. Remaining explicit roots exist by source check.
- The shared nullable document type requires compatibility changes in Booking,
  Equipment and Staff validation/mapping; only their direct document consumers change.
  Other users of CustomerDocumentAdd/UpdateVM inherit the shared required contract.
- Company contacts expose their existing `mobileNo` input so its declared validation
  spec targets an actual editable field. No persisted field was added.
- Owner-reported Individual `Updated Failed` exposes the tracked no-op path: the
  shared update-result helper treats a validated unchanged snapshot as success. It
  still fails when a real save fails; UnitOfWork's global bool contract stays unchanged.
  The reported runtime request requires owner retest; payload alone is not proof of
  which tracked values changed.

### Global no-op save amendment — owner runtime steering

The owner subsequently reported the same symptom in Supplier, requested the full
frontend/backend Update trace, and confirmed the failure occurs only when saving
unchanged data. Supplier's tracked override bypasses the Base update-result helper
and independently interprets SaveChanges > 0 as success. The earlier helper-only
decision is superseded: shared UnitOfWork sync/async save means successful completion,
including zero changes. Exceptions still propagate and tenant-ownership conflicts
still return false. Keep the boolean signature; do not force graph writes or change
SubscriptionId/No transport. SaveUpdateAsync returns the shared save result without
an additional local no-op rule. This narrowly changes shared save-result semantics;
Add/Delete/action business validation remains owned by each existing service.

Owner runtime feedback: after confirming the Individual unchanged-save failure,
the owner reported "جربت اشتغل تمام" following this shared fix. Record this as
acceptance of the reported unchanged-save scenario only. Supplier, concurrency,
imports, attachments and the broader customer acceptance checklist remain pending.

## Completion evidence and manual handoff

Record each BE/F finding with implementation paths and source-only reconciliation.
Review every scoped diff, remaining references, validation/mapping symmetry,
subscriptions/finalize, imports/exports and route consumers. Run only permitted
read-only diff and book-reference checks. Owner verifies compilation, runtime,
concurrent writes/uploads, import edge cases and any schema migration/backfill.
