## 11. Document numbers (No)

> **Status: Canonical reservation; Transitional formatting.** Owner approved the L4 counter
> correction on 2026-10-02 (`reviews/REPOS_NUMBERING_L4_CONTRACT_FREEZE.md`). The existing
> CodeCreateService now reserves configured automatic numbers on DocumentNumberCounter.
> Broader format/branch/date and generator unification remains in the deferred plan
> `reviews/Deferred/DOCUMENT_NUMBERING_MAINTENANCE_EVOLUTION_PLAN.md`.

`EntityBase.No` is the human-readable document number and it is **server-owned**.
The client never sends it and never sees it echoed back from its own request.
`UnitOfWork` detects Added `EntityBase` rows with an empty `No` before both sync and async
saves, then calls `ICodeCreateService.SetDocumentNumbersAsync` for each row. The service
numbers that row only, using its concrete EF type; it never traverses navigations or replaces
a nonempty number. This generation step never renumbers saved rows. Feature services own no
numbering loops.

Compatibility: `Repository.AddAsync`/`AddRangeAsync` still number new roots immediately,
because Custody Movement, NRM and Workshop Movement read the root `No` before saving. Save
preparation skips those numbered roots. Preserve this ordering until those consumers are
deliberately changed; it is not permission to number an existing graph. JournalVoucher is
excluded from generic numbering: JournalVoucherResolver and OpeningBalanceJournalVoucherHelper
assign IJournalNumberGenerator's number before the owning save, so it is not reserved twice.

Numbering is driven by the `SettingsDocumentNumberModel` row: prefix, whether the
branch code is included, whether a year/month segment is included, and the
numeric part length. Per-entity rules live in a `switch` in
`Services/HelperServices/CodeCreateService.cs`. When an entity is not in that
switch it falls back to `{ENTITYNAME}-{Ticks}`.

**What you do for a new entity:** nothing, unless it needs a business-visible number. If it
does, use the existing service, configure its DocumentType counter mapping and matching settings,
and append a missing enum member without changing persisted numeric values. Do not copy a
Count + 1 generator or add a feature-owned numbering loop.

**Shared counter reservation (2026-10-02, source-only).** CodeCreateService reuses a tracked
counter by `(SubscriptionId, DocumentType)`, checking Local before the database so earlier
reservations in a batch are visible. A missing counter is seeded from the largest parseable
trailing number already issued for that tenant/type, including deleted records and pending
Added rows with numbers. A soft-deleted counter is reused; deletion never resets the sequence.
CurrentValue increments are saved with the graph in the caller's existing transaction or EF's
implicit one-save transaction. Never save a counter separately or flush the graph just to
obtain each number. Existing numbers remain unchanged; no monthly/yearly reset is introduced.

**Concurrency.** CurrentValue is an EF concurrency token: stale writes fail their entire save
rather than accepting a duplicate reservation. First counter creation is protected by the
existing unique `(SubscriptionId, DocumentType)` index. The existing API middleware maps
these conflicts to 409; no blind retry. Verify the database index is applied. Database No
constraints remain a separate defense for writers outside this generator; adding a Partner/TPT
index across all derived types is not an automatic per-type uniqueness rule.

**Remaining formatting gaps.** BR1 and TYP are still legacy literals; date segments retain
their existing source; unknown types and absent-settings fallback retain ticks. Historical
ticks suffixes can seed a large CurrentValue when automatic settings are enabled later.
Manual settings still leave generic No empty. These are recorded in backlog 14 and the
broader deferred plan; the counter fix does not silently rewrite format or manual behavior.

**Tracked snapshot updates.** New children added through either the base update or
`ReconcileOwned` receive numbers from the same save preparation as Add. No explicit Company
Drivers call is needed. This reuses the same shared counter reservation. It does not repair
the generic update's detached graph mapping: that
separate source-review finding can clear a kept child's stored `No` before the save and is
recorded in `reviews/CUSTOMER_COMPREHENSIVE_BACKEND_REVIEW.md`.

The former traversal overwrite is resolved (backlog 15). Existing nonempty user-entered
reference values stored in `No` are preserved. That legacy contract still belongs in the
feature's write VM explicitly (block 3); moving it to a dedicated `ReferenceNo` is a separate
screen decision with a migration. Keep write graphs limited to owned rows.

**Check:** `No` absent from Add and Update VMs · never trusted from the client ·
new numbering rule added to the switch **and** the settings model · unique index
on `(SubscriptionId, No)` where the number is business-visible · write graph
contains owned children only.

---
