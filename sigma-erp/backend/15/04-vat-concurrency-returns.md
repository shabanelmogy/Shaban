<!-- Part of backend block 15: see ../15-pattern-3-master-detail-with-financial-effect.md. Same status and authority as the block. -->

### Nonnegative allocation of positive VAT sources
`VatPolicy.AllocateDocumentTax` retains its existing rounded proportional shares
when their remainder is nonnegative. Many tiny positive lines can round those
shares above the entire rate tax: 100 lines of0.10 at5% give document tax0.50,
while99 individual0.005 shares round to0.99. The exceptional positive-source
case floors non-remainder shares with `FinancialNumberPolicy.FloorMoney` and
gives the exact remainder to the largest line. Every source tax stays
nonnegative and their sum remains the document's once-rounded tax. Negative or
mixed-sign inputs keep their existing behavior; document tax and normal
allocations are unchanged. Rental generation identified the defect; source
arithmetic review only, owner compilation/runtime verification pending.

Valid stored amounts may overflow the intermediate `rateTax * lineAmount`
even when the final proportional tax fits. The shared allocator preserves its
ordinary multiplication-first path and, only on decimal overflow, multiplies
the tax by `lineAmount / rateAmount` instead. The largest-line balance still
owns the exact document total. Consumers validate aggregate storage bounds
before allocating tax; they do not turn an oversized group into an exception.

Engine structure (`SiGma.Business/Resolver`): `JournalVoucherResolver` is the posting
engine (build, save, post, unpost, allocations) and keeps delegating members for
existing callers; lookups are `ILinkAccountLookup` (per-request partner cache, one
projection per partner), periods `IAccountingPeriodService`, numbers
`IJournalNumberGenerator` — all scoped and registered by the assembly scan. New code
injects the narrow interface it needs.


### Collection and lifecycle concurrency across services
A document whose eligibility depends on rows written by other services (a sales agreement:
its units' sale state, its quotation's state, and the receipts collected against it) is
protected by **one** tenant lock, `UnitOfWork.ExecuteUniqueWriteAsync<TOwner>`, taken by
every participating writer: the owner's add/update/remove and lifecycle actions, and the
other service's writes whose rows (before or after the change) link to the owner. Every
eligibility check (state, outstanding balance, duplicate) is re-read inside the lock; a
writer that already owns a transaction opens it first and takes the lock inside it (the lock
then lives until that transaction ends, and never commits it). A multi-save action inside the
lock relies on the lock's transaction instead of opening its own. The state columns are also
EF concurrency tokens (no schema change), and a child-only edit marks the root modified so
its token is checked. A cancellation that reopens a balance (void or delete of a receipt of a
closed document) moves the document back to its previous open state in the same transaction;
un-voiding re-runs the add eligibility. Equal installments are rounded down to the money
decimals and the last takes the remainder, so no row is negative. Reference:
`SalesAgreementService`, `ReceiptService` (`LockSalesCollectionAsync`,
`ReopenClosedAgreementAsync`).


### Quantity returns and independent financial credit
Keep physical source quantities and financial settlement as separate effects
when the frozen model requires both. Preserve exact receipt/bill/source-return
line FKs; a master source summary or label cannot prove capacity. Pending
documents reserve the capacity named by their contract; only approved nonvoid
documents contribute stock or posted financial effect. Use one proven query for
available stock, summary/detail reports, receiving gates and progress readers.
When approved returns reopen the same order, receiving and reversal guards must
agree: a replacement receipt can prevent undoing its enabling return.
Unbilled returned quantities reduce billable receipt capacity without creating a
supplier debt. Crediting billed quantities must not make their original receipt
billable again or deduct stock twice.

For exact original-line credits, snapshot the net amount actually posted after
document-discount allocation and the actual tax posting account in the original
posting builder. A detached validation model is not persisted: copy its resulting
snapshots onto the tracked owned lines in the same approval transaction. Do not
rederive an old discount allocation from another line order or current settings.
Old lines without posting proof stay unavailable for automatic credit; do not
invent a backfill. Partial credit slices reserve quantity and value together,
never exceed either original component, and the final quantity takes the rounded
net/tax remainder. Zero-value sources retain quantity proof without a fake journal.

Ordinary Payment follows its explicit source lifecycle: Save is Pending without
a journal; approval posts Dr the resolved partner control and Cr the configured
payment-method account for validated owned amount rows. Bill allocation remains
independent. Dedicated loan/payroll/down-payment writers remain source-owned;
their legacy nullable lifecycle is not inferred from generic status. Deferred
cheques keep their PDC maturity owner. Reject is terminal; reasoned UnApprove and
Void require valid owned unshared journals, no live allocation and the original
period open. Shared approval context and detail/list action flags use these
actual guards, with batched list eligibility instead of per-row queries. Block
unsupported bulk/activation paths from bypassing aggregate invariants; retain
approval history instead of deleting previously approved rows.

Evidence: `PURCHASE_RETURN_GOODS_CONTRACT_FREEZE.md`,
`PURCHASING_PAYMENT_LIFECYCLE_CONTRACT_FREEZE.md`, `PurchaseReturnService.Goods*`,
`BillService.ApproveCoreAsync`, `PaymentService.Approval/Read` and
`SupplierGoodsReturnQueryExtensions`. These model-specific effects are not a
universal financial writer. Source-only; owner migration/build/runtime and
race/rounding/period acceptance remain required.

**Check:** transaction opened before the first mutation and covers every
dependent save · rollback restores document, voucher, allocations and flags ·
debit equals credit · one-sided lines · allocation limits and ownership checked ·
state locks enforced · line references via `AllExistAsync` · VAT per rate rounded once ·
posted documents voided through retained source/JV flags without a reversing entry, never deleted · related flags recomputed from persisted facts · list,
detail, report and export use the same voided/posted/allocation rules · no
per-row query loop.

---
