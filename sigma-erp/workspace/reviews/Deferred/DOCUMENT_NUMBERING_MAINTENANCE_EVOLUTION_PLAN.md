# Document Numbering — Maintenance / Evolution Plan (deferred)

| | |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Date | 2026-09-29 |
| Decision | Owner: "اجله شوية خليه فى ملفات للتعديلات المستقبلية" — deferred; implement only after this plan is Frozen |
| Related | Backend backlog 14 and 15; `reviews/Archive/Completed/2026-10-23/JOURNAL_VOUCHER_RESOLVER_FEATURE_REVIEW.md` (R8); `CURRENCY_EXCHANGE_RATE_MAINTENANCE_EVOLUTION_PLAN.md` |

## Current state (2026-09-29)

| Path | How `No` is produced |
|---|---|
| Every entity added through `Repository.AddAsync` | `CodeCreateService.SetDocumentNumbersAsync` → `GenerateAsync(typeName)` → `BuildAsync(prefix, branch, type, yyMM, length)` with sequence = **row count + 1** (`GetNextSequenceAsync`) |
| Journal vouchers (new, generated or manual, and opening balance) | Same as above first, then **overwritten** by `IJournalNumberGenerator` (per-tenant `DocumentNumberCounter`, `DocumentType.JV`) in `JournalVoucherResolver.SaveCoreAsync` / `OpeningBalanceJournalVoucherHelper` |
| Job Estimations | Own counter loop on `DocumentNumberCounter` (`JobEstimationService`, serializable transaction, retry) |

## Problems

1. **Row count + 1** (backlog 14): collides after a delete (soft-deleted rows are counted by the unfiltered set, but hard deletes and concurrent inserts still collide), races under concurrency, and is not scoped per tenant in the query.
2. `BuildAsync` hard-codes `-BR1` and `-TYP` instead of the real branch and type codes.
3. `SetDocumentNumbersAsync` walks every navigation (backlog 15) and can overwrite `No` on referenced existing entities; it also numbers helper rows (e.g. `DocumentNumberCounter` itself gets `DOCUMENTNUMBERCOUNTER-<ticks>`).
4. Unknown types get `NAME-<ticks>`, not a sequence.
5. Three different mechanisms today (row count, JV counter, Job Estimation counter) and two formats (`INV-2401-0001` vs `JV24010001`).

## Proposed design (to confirm)

- One `IDocumentNumberService` in `CodeCreateService`'s place: `NextAsync(DocumentType type, DateTime date, int? branchId)` over `DocumentNumberCounter` (unique `(SubscriptionId, DocumentType)`), incremented in the caller's unit of work/transaction, seeded from the highest issued trailing number, with a uniqueness check (the JV generator's algorithm, generalised).
- Format from `SettingsDocumentNumberModel` per document: prefix, **real** branch code (`Branch.BranchCode`), type code, yyMM of the **document date**, numeric length; one separator convention for all documents (decision below).
- `Repository.AddAsync` numbers only the **root** entity being added (and optionally new child documents that own a number), never existing referenced entities; only when `No` is empty; manual-number settings respected.
- Journal vouchers go back to the common path; `IJournalNumberGenerator` becomes a thin call (or is removed) and the post-`AddAsync` overwrite disappears. Job Estimations move to the common service.
- Optional: unique index `(SubscriptionId, No)` per numbered table (needs migrations per table).

## Open decisions for the owner

1. Separator convention: `INV-2401-0001` (current generator) or `INV24010001` (settings examples / regex `^JV\d{6,8}$`)?
2. Sequence reset: never, yearly, or monthly (with yyMM in the number)?
3. Per branch sequences or one per tenant?
4. Renumber existing test data or keep old numbers?

## Impact map

`SiGma.Business/Services/HelperServices/CodeCreateService.cs`, `ICodeCreateService`, `SiGma.Repos/Repository/Repository.cs` (`AddAsync`), `SiGma.Business/Resolver/JournalNumberGenerator.cs`, `JournalVoucherResolver.SaveCoreAsync`, `OpeningBalanceJournalVoucherHelper`, `JobEstimationService` numbering block, `SettingsDocumentNumberModel` (+ its settings screen), every entity with `No`. Migrations only if unique indexes are added.

## Owner-approved partial execution — 2026-10-02

The original Draft/deferred decision above is historical. Owner subsequently approved the L4
counter correction with «ظبط التعديل»; frozen bounded contract:
`reviews/Archive/Completed/2026-10-23/REPOS_NUMBERING_L4_CONTRACT_FREEZE.md`.

Configured automatic CodeCreateService types now reserve from the existing per-tenant/type
DocumentNumberCounter in the same tracked context as the save. Max-issued seeding includes
deleted rows; CurrentValue concurrency token protects stale updates, and the existing unique
counter key protects first creation. Conflicts return 409 through the existing middleware.
The generator no longer assigns a preliminary JV number before IJournalNumberGenerator.
Source-only; owner verification of index presence, batches, concurrent writes and rollback pending.

Existing format, separators, date source, hardcoded branch/type segments, manual behavior,
ticks fallback and persisted numbers are preserved. JobEstimation service unchanged. Broader
format unification, merging dedicated generators and per-table No constraints remain deferred;
this does not mark the complete plan implemented.
