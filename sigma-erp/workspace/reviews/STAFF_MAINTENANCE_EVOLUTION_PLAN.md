| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Staff module maintenance/evolution — 2026-10-03

## Authorized corrective continuation — 2026-10-26

Owner authorizes fixing F1–F8 from the fresh source review. The Frozen
STAFF_CONFIRMED_FIXES_CONTRACT_FREEZE.md owns this bounded execution, retaining
existing screen/domain contracts and excluding unresolved historic accounting
and schema work. Classification: Extend existing reference-status/watch
consumers, Refactor dialog read ownership and Staff detail projection/allocation
query work, Keep shared owners/API/financial policy, Remove duplicate filter
spinners/preflight scans; no competing loader/cache/service or new schema.

Corrective continuation complete in source: all F1–F8 implemented and reviewed;
see the latest reconciliation in STAFF_FEATURE_REVIEW.md. Staff user guide and
BE7/skill/packets updated; syntax-only frontend21/backend3 and packet all8 checks
passed. Runtime/SQL/visual acceptance remains pending; historic accounting and
bank/schema decisions are not closed by this corrective slice.

User authorizes comprehensive review and all confirmed fixes, not a plan-only handoff. Manifest and source inventory are in STAFF_FEATURE_REVIEW.md. Audit existing owners end-to-end before replacing any source. Preserve staff/person identities, salary effective dates, overtime snapshot rates/amounts, saved duty plans, allocation accounting and existing API consumers.

| Area | Classification | Target |
|---|---|---|
| Staff record/list | Refactor | Canonical list + gated step editor and revision action; retain domain sections |
| Legacy StaffPartner/Timesheet | Refactor | Retain reachable routes; replace placeholder UI with the actual existing API contract and one editor per entity |
| Overtime/duty editor | Refactor | Shared bounded shell/table/date/summary/input/dirty/error owners; backend totals authoritative |
| Statement/Balances | Refactor/Extend | Shared report grids/print/filter/summary; prove complete output; optional complete Balances response preserves existing paging |
| Alerts/Designations | Refactor | Shared list/grid/modal/state owners, complete export and current-language labels |
| Backend base/helper | Keep | Use existing base validations, query, snapshot/write/delete conventions; only needed feature overrides |
| DTO/AutoMapper | Refactor | Client-editable writes and only displayed/read/action fields; aggregate identities guarded |
| Instruction layer | Extend only for reusable evidence | Owning book + skill/history together, derivative packets via generator |

Alternatives: patching legacy grids would retain duplicate controls/scroll/paging code; creating parallel screens would split routes and business ownership. Refactor the existing source in place using the canonical shared owners. Existing financial calculations/rate policy remain until an actual confirmed defect is evidenced; business-policy changes require the owning source/decision. No blind schema changes, data cleanup, migrations or historical rewriting. Contract, impact/ambiguity, migration and dependency verification tables are completed before each implementation slice is frozen.

## Frozen implementation sequence and impact

This plan authorizes only source-supported contracts, frozen in separate bounded handoffs before their implementation. Operations handoff: STAFF_OPERATIONS_CONTRACT_FREEZE.md. Record/backend/report handoffs are sequenced separately; an unresolved material finding blocks only its affected slice.

Existing API routes and saved identities remain compatible. Shared controls/base persistence are kept; screen-local replicas are replaced. Complete Staff Balances is an explicit opt-in preserving paged consumers. Monthly operational writes submit changed days only; backend salary/rate/holiday/rounding policy remains authoritative. Sidebar Timesheet points to the in-scope /StaffTimesheet; the existing HRM /StaffTimesheets route remains compatible and outside this screen refactor.

No new permissions, automatic data cleanup or schema migration is authorized. Any discovered schema requirement is reported for owner migration. Source inspection, contract parity, targeted diff/whitespace and translation checks precede reconciliation; builds/tests/browser/database remain pending under AGENTS.md. All supplied screenshot evidence: none in this task. Agents own non-overlapping feature folders and backend files; root owns integrations, shared translations/configuration and review artifacts.

## Amendment — StaffPartner discovery disposition

Complete record audit establishes StaffPartner as the exact UI1 dead-product scaffold (product columns, no-op actions, invented payload, no domain/menu consumer). Its classification is Remove, preserving the real Staff API/entity and StaffProfile lookup. STAFF_RECORD_CONTRACT_FREEZE.md freezes that bounded retirement; root removes route/provider/config and record agent removes feature source. Timesheet has a real API/entity and remains Refactor.

## Owner extension — bank accounts

Owner's later screenshot exposes a missing Bank Accounts step, then `ضيفه` authorizes adding it. Classification: Extend Staff editor/aggregate; Create the missing owned StaffBankAccount model/config/DTOs, retaining the existing general Bank master. Frozen handoff: STAFF_BANK_ACCOUNTS_CONTRACT_FREEZE.md. This supersedes the initial four-step/no-schema expectation for this bounded addition only. Owner migration AddStaffBankAccounts is required; no agent migration, snapshot or database command is authorized. Existing Staff screens and original AdvanceTax accounting blocker remain in the original scope.
