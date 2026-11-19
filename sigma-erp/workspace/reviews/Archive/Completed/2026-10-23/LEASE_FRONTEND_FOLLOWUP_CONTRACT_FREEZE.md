# Lease follow-up frontend contract — 2026-10-08

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

## Manifest and handoff
User authorizes review and confirmed fixes for src/app/modules/Lease. This follow-up retains LEASE_FRONTEND_CONTRACT_FREEZE.md (2026-10-06) and its grid/filter/detail/action contracts as historical records. Initial scoped Git status: Lease clean; UserGuide reader has existing Fleet registration and sales-guide changes, which must be preserved. Backend has unrelated Sales changes and owner migrations; inspect Lease producers read-only and do not edit backend or migrations.

Shapes: Clause/CostParameter/CostSetting/Inquiry modal; Agreement/Quotation/Tariff routed aggregate; Master routed View; closedAgreement server-filtered Agreement View; SMS operational simulation. Backend: ordinary records Pattern1, existing aggregates Pattern2 and existing accounting transition owners; operational/filtered-read exceptions retained. Approved references: Job list/editor, shared EditorDialog controlled composition, Job close-job. Existing fields, endpoints, formulas, DateTime-valued Quotation rate fields, can* flags, complete child snapshots and AuthGuard remain frozen. No invented workflow or permission API.

Phase0 discovery and Phase1 freeze permit independent source audits of Agreement, Documents and Settings/Tariff/SMS. Root integrates confirmed frontend defects and writes the final review. Guide content must cover all live module routes in EN/AR using the existing UserGuide models/reader and one Lease sidebar link. Child dialogs belong to parent topics. Each audit must read applicable canonical blocks and actual approved reference before proposing fixes, and identify exact source evidence and expected result. Report material conflicts; do not alter shared contracts.

Recipe -Check: phases0/1/2/4/5/6 current; Phase3 stale. Use canonical books for Phase3; generated files remain untouched. No screenshots supplied. Phases2/3 and existing action-presentation Phase4 apply as findings require; Phase5 guide/wiring and Phase6 root reconciliation mandatory. Builds/tests/lint/runtime/browser/database/migrations/commits/push/deploy prohibited.

## Dated reconciliation note — 2026-10-09

The above Frozen handoff remains historical and unchanged. Confirmed presentation/lifecycle repairs are implemented and reconciled in LEASE_FRONTEND_FOLLOWUP_FEATURE_REVIEW.md. Numeric provision subtype typing now reflects the existing backend IDs0..3 without changing JSON or available choices. Shared form-state restoration, GUID saved-row classification and full-year local hydration preserve existing inputs/workflows; owning UI10/14/17 and skill learning rows were updated together. The owning bilingual Lease guide is registered at /UserGuide/lease. No backend/schema/business/permission change; owner compilation/runtime/visual acceptance remains pending. Final packet drift differs from the initial observation and is explicitly recorded in the review.
