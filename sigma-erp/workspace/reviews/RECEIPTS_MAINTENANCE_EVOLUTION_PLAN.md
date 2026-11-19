| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-26 |

# Receipts maintenance and completion

Owner requests Partner/Contact explanation and review plus completion from
Receipt1/2/3.png. ContactId and CustomerId both reference Partner; Contact here
is the receipt party, not a second company contact-person aggregate. Preserve
stored names/relationships and use the party consistently in validation.

Shape: UI08 financial document, Job list/editor shared shells and controls,
BE15 source-owned draft journal/approval. TierL for allocation/lifecycle repair.
Initial recipe Check: all eight OK. Apply PLAN00 and Phases00–06; no application,
browser, database/build/test execution or migration/snapshot edits authorized.

| Owner | Classification | Target |
|---|---|---|
| Receipt aggregate/service/DTO/maps | Extend/refactor | Preserve payment/card/bank/sales/deposit contracts; correct read/write/lifecycle guards |
| ReceiptAllocationDetail | Extend | Nullable exact target JV line on draft; retain legacy credit-note FK/history; no backfill |
| JournalVoucherAllocation/resolver/effective readers | Keep/reuse | Authoritative posted settlement; apply selected draft targets on Approve, never on Save |
| Receipt approval | Extend | Pending/Approved/Rejected graph with saved reason/history, shared tab/modal; old toggle retained only as constrained compatibility path |
| Receipt list/editor | Refactor in place | Typed server paging/filter/grid/export/report; canonical routes; shared financial editor, allocation/documents/actions/print |
| GeneralReceipt | Extend | Existing owner decision BE15: chosen posting credit account, optional party; no new accounting policy |
| Booking/rental/lease/PDC/deposit direct writers | Keep | No unrelated workflow migration; preserve direct legacy receipts and current source ownership; general action flags must not mutate unproven special sources |
| DDAS import | Deferred unsupported capability | Screenshot proves action name but no source endpoint, file format, validation or duplicate policy; no guessed financial importer |

Impact: Receipt, ReceiptAllocationDetail, new ReceiptApprovalLog, EF configuration,
DbContext, API/DTO/maps/service, direct UI service/embedded editor consumers,
existing JV allocations/readers/source locks, guide/vocabulary. No new partner
entity or cache policy. No legacy enum reordering; allocation status stays the
existing Allocated/Unallocated contract, with numeric allocated/unallocated totals
shown separately. No invented Partial enum.

Alternatives rejected: keeping credit-note children as invoice debts (wrong source),
settling during draft Save (wrong financial timing), duplicating JV allocation
engine or importing arbitrary DDAS columns (unsafe invented contracts).

Frozen handoff: RECEIPTS_DOMAIN_API_CONTRACT_FREEZE.md. Implement all confirmed
paths; unsupported historical allocation/FX/special-source data must be shown and
blocked rather than silently rewritten. No new UnVoid action in the UI. Existing
compatibility endpoints remain guarded; canonical Void never generates reversal.
Owner will generate/apply a migration for fields/history after source handoff.
