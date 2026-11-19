# Cash Deposits — scoped maintenance plan

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-05 |
| Authorization | User requests review and application of approved-document fixes |

This plan covers completing the existing CashDeposit owner and correcting its confirmed API/aggregate defects. The frozen target is CASH_DEPOSITS_CONTRACT_FREEZE.md. It does not duplicate the coordinated voucher/journal plan or freeze new accounting effects.

## Existing state and impact map

| Area | Current state/evidence | Classification | Target / affected consumers |
|---|---|---|---|
| CashDeposit entity/EF | Header, owned voucher snapshots, approval flags, JV link and 18,2 amounts already exist | Keep | No schema/backfill or historical rewrite |
| List endpoint | Navigation override bypasses date-range hooks; inherited paging exists | Refactor | Standard list hook + lean projection, Angular list/Excel/report |
| Add | Trusts source amounts/already-deposited values | Refactor | Source-owned snapshots and persisted due-bound validation; sole header aggregate endpoint |
| Update | Root mapping replaces collection before reconciliation; dropped rows remain in calculations | Refactor | Tracked retained children, saved-ID ownership, full snapshot; omitted lines removed before totals |
| Source balance | Child rows are counted without live parent state; current document not excluded | Extend | Consistent live/nonvoided parent balance and edit-exclusion read |
| Delete | Soft delete assumes database cascade | Refactor | Explicit owned children/JV cleanup in same write boundary |
| Concurrent deposits | Competing checks/saves race | Extend | Existing CashDeposit tenant write lock, shared by its participating writers; source writers remain external residual race |
| Bulk paths | Generic mapping bypasses financial aggregate rules | Refactor | Localized refusal until atomic validated bulk workflow is specified |
| Angular list/details | Legacy ms-lib list, empty action bodies, metadata-only editor | Replace | Approved shared list and routed financial editor, using existing aggregate |
| CashDepositDetail UI | No menu; obsolete independent child form | Remove | Parent editor consumes owned lines; remove lazy route/providers/scaffold after adoption |
| Routes/providers | Root HttpClient/guard already exist, legacy duplicate providers | Refactor | Explicit mode routes/dirty guard, root services, single title |
| Translations | No full feature vocabulary | Extend | Scoped EN/AR keys |
| Accounting F5/J-1 | Broader voucher plan records clearing/reversal changes across writers | Keep in separate unresolved accounting slice | Current scoped task reports the gap and does not imply accounting acceptance |
| Round off | Screenshot only, no source account or formula | Missing | User question pending; no editable write/persistence until decided |

## Options and selected design

1. Patch legacy table/buttons while leaving the metadata-only form: rejected because it cannot submit the existing owned vouchers and repeats obsolete design.
2. Create a parallel deposit/child API and new data model: rejected because the current aggregate already owns the source FKs, snapshot and journal.
3. Complete the current aggregate through shared UI and authoritative source validation: selected. This fixes trust, ownership, soft-delete and request-flow defects without adding a schema or inventing an account/rounding policy.

Source signs, document numbering, existing draft journal and resolver posting rules are kept pending separately enumerated accounting evidence/decisions. Access remains authenticated; no permission system is introduced. Current/historical persisted records are not rewritten.

## Implementation slices and boundaries

Contracts freeze first. Backend owns list/write invariants; list and editor workers consume the same frozen DTOs with nonoverlapping files. Root owns models/service/routes/translations and merges integration. Final scoped diff inspection and screenshot/reference/API reconciliation are root-owned. Source-only verification follows AGENTS.md; owner builds and exercises failures, money boundaries, concurrent saves, CRUD, posting/period/allocation locks, export/print, RTL/themes and narrow layouts.

## Logic ambiguity register

| Item | Status | Evidence / required decision |
|---|---|---|
| Editor routed shape | Confirmed | UI13 totals/approval criterion |
| Source snapshots, due balance, saved child ownership | Confirmed | Existing entity/DTO links; BE8/14/15 server ownership |
| Positive Payment source vs negative screenshot | Conflicting | Preserve factual current source for safe contract; sign/ledger change requires accounting direction |
| F5 clearing-account correction | Confirmed finding; separate slice | Existing voucher plan V3, source payment-method debit mismatch; feasibility audited, no arbitrary general fallback |
| J-1 reversing void vs existing boolean void | Confirmed finding; separate slice | Owner journal decisions; coordinated document-journal lifecycle plan needed |
| Round off | Missing | Exact formula/account requested from user; safe UI work proceeds |
| Cross-service source-change races | Uncertain runtime | CashDeposit lock does not bind Receipt/Payment writers; owner concurrency verification and later coordinated writer plan |

No Missing accounting decision is silently treated as approved by elapsed time. This plan freezes only the confirmed safe implementation slice; final review must state the unresolved slices and cannot claim full accounting conformance.
