# Tax advance and ordinary allocation discovery

| Status | Draft |
|---|---|
| Owner verification pending | yes |

2026-10-07. Discovery only for the owner's authorized request to correct every screen using advance/deposit after the unified-model recommendation. This artifact proposes a source-supported handoff; root must freeze it before implementation. No application edits made in this discovery. Root owns Receipt/Deposit/contract discovery and the unified decision.

## Authority and prior decisions

Read canonical Sigma AGENTS, required sigma-screen-refactor skill/owning BE15, `JOURNAL_ENTRIES_DECISION_SHEET.md` and `VOUCHERS_JOURNALS_MAINTENANCE_EVOLUTION_PLAN.md`. F2 owner decision 2026-10-01 supersedes the earlier CustomerAdvances recommendation for an ordinary advance receipt: **Dr cash/bank, Cr customer AR**. A refundable deposit stays **CustomerDepositsPayable**, never ordinary invoice consideration. J-1 preserves posted history; correction/void reversals replace posted deletion. Existing BE15 Journal posting policy rule2 still describes reopen/rebuild/delete for no-approval documents, conflicting with the explicit J-1 owner decision; follow J-1 and record guide drift rather than copy the older line.

## Actual flow and defects

| Actual source owner | Observed behavior | Consequence |
|---|---|---|
| ReceiptService.BuildAndSaveJvAsync (~499) | Every type currently Dr receipt gross to payment account / Cr AR gross; primary partner is CustomerId ?? ContactId; saves draft JV until receipt approval | Correct ordinary advance AR entry, but type distinctions/deposit routing belong to root correction. |
| InvoiceService.BuildInvoicesFromRequestsAsync TaxAdvance branch (~1247) | ReceiptNo finds arbitrary receipt, stores receipt type string and receipt.No in AgreementNo, trusts request customer/Amount, then RecalculateTotals with current tax settings | No posted/source-type/customer reservation validation; tax-advance gross may differ from receipt cash. No stable ReceiptId FK on TaxAdvanceInvoice, but server-generated tenant receipt number supplies a source-supported current join. |
| InvoiceService.BuildAndPostInvoiceJVAsync / ResolveRevenueAccountAsync | TaxAdvance posts Dr customer AR gross / Cr CustomerAdvances net / Cr TaxCollected tax | Combined with the receipt, moves a taxable prepayment from AR credit to a net advance liability plus saved VAT. This is a separate taxable recognition stage, not changing F2 plain advance posting. |
| InvoiceService.AllocateTaxAdvanceCoreAsync (~701) | Under JournalVoucherAllocation lock, checks used WHERE AllocatedJournalVoucherId == original advance JV; posts NEW bridge Dr CustomerAdvances GROSS / Cr AR GROSS; persists target invoice debit -> NEW bridge credit allocation | Original advance never appears on stored source rows; repeated allocations do not reduce original availability. Liability is debited gross although originally credited net, and advance VAT is not reversed when final invoice VAT is posted. |
| GetTaxAdvanceAllocationDetailsAsync (~818) | Same original advance query for already used; target due counts only JournalVoucherId, uses direct Context and incomplete posted/effective filters | Read preview disagrees with actual bridge rows and can offer already consumed balances. |
| JournalVoucherService.GetOpenReceiptsAsync (~595) | Exposes posted nonvoid receipts by ContactId, totals receipt usage by ReceiptId; exposes JournalVoucher-type credits including generated bridges | No receipt reservation for tax advance; original cash receipt and tax advance can be used independently. ContactId selection disagrees with posting's primary CustomerId. |
| JournalVoucherService.AllocateCoreAsync (~836) | Shared allocation lock; validates posted target/partner/account/opposite source lines, source/target amounts against both detail-side allocations; writes target+ReceiptId/CreditNoteId/JV source | Useful reusable owner, but source/target capacity sums omit ledger-effective filtering; voided reservations may remain counted. |
| GetAllocationLinesAsync (~545) | Amount = Debit ?? Credit, counts target-side only | Resolver credit rows have Debit=0, so credit capacity reads0; write path uses Abs(Debit-Credit) and both sides. |
| Vouchers/Invoices/Invoice/components/tax-advance-details save (~232) | POST generic Invoice with raw invoiceDate/receiptId/amount/tax/amountAfterTax; no InvoiceType.AdvanceTax or ReceiptNo | Creates concrete rental Invoice through InvoiceAddVM, not TaxAdvanceInvoice. Typed actual producer repair required. |

## Minimal correct origin model — existing entity fields suffice for new rows

Do not infer source identity from Notes, and do not set an allocation header to one JV while its explicit detail belongs to another. `JournalVoucherAllocation` already has both ledger header/detail identities, ReceiptId, amount, date and audit ownership. Use these truthfully in two stages:

1. **Recognize/reserve a taxable advance.** A posted eligible receipt AR credit line is matched against the tax-advance AR debit line for the recognized gross. Store target tax-advance JV/detail + source ReceiptId and explicit receipt JV detail. One source discriminator stays truthful. This reservation prevents the cash receipt being offered again as an ordinary settlement source. Source remaining, correct customer, type, currency-scale, branch and current state are re-read under the shared allocation lock. Preserve the current one-tax-advance-per-receipt number rule unless root explicitly changes it. Source eligibility proposal: explicit AdvanceTaxReceipt, plain AdvanceReceipt remains ordinary AR credit without invented VAT; root must freeze the intended type matrix.

2. **Consume the recognized taxable advance.** For requested gross g, allocate its saved VAT proportionally; the final portion consumes exact remaining saved VAT to avoid residue. n = g − allocated VAT. Build one source-owned settlement JV with **Dr original advance liability n + Dr original advance VAT t / Cr each final invoice's actual AR account g**. Persist disjoint pairs:

| Pair | JournalVoucherId/detail (target/debit) | AllocatedJournalVoucherId/detail (source/credit) | Amount |
|---|---|---|---|
| Original net origin | settlement liability debit | original advance liability credit | n |
| Original VAT origin (when t > 0) | settlement VAT debit | original advance VAT credit | t |
| Final target settlement | final invoice AR debit | settlement AR credit | g |

The sum of original-advance **net+VAT** origin rows is gross consumed. The final-target row does not double-count that source because its AllocatedJournalVoucherId is the settlement JV. The reserved receipt AR line is a different ledger pair from net/VAT source credits, so its recognition reservation is not counted again as advance consumption. Use original posted source accounts/line amounts and actual target AR accounts; current LinkAccounts may have changed. Multiple target AR accounts may require separate bridge AR credit lines. No journal notes/name parsing and no new schema column needed for this design.

Advance source gross capacity and component capacities are each checked: requested gross <= effective remaining gross; allocated saved tax <= remaining VAT credit; net <= remaining liability credit; final target gross <= remaining effective invoice AR debit. All allocations and all journal/document saves are inside one transaction. Never silently skip invalid targets. Base-currency money scale comes from FinancialNumberPolicyResolver. Current GetMoneyDecimalPlaces is not permission to accept unvalidated client financial inputs.

**Effective balance predicate:** both original advance and settlement bridge must be live, posted, nonvoid, same tenant, with truthful matching header/detail ownership. Existing `WhereLedgerEffective` checks only its allocated/source side with OR and ignores the parent JV. Applied unchanged to new origin rows, it would count a voided bridge as consumed because original advance remains posted. A typed shared balance owner can impose both-side effect locally; broad helper changes require checking its other callers. Ordinary balances, tax-advance balance, target due and UI projections must use that same defined effective policy.

## Historical compatibility

Old settlement bridge rows contain neither original advance id nor a truthful original detail link. Their Notes text is not identity evidence. Do not rewrite posted invoices/JVs or auto-backfill inferred origins. Historical tax advances with unverifiable source reservation/consumption fail closed for new consumption and show a specific review-required explanation. New rows provide the explicit origin above. The prior owner's test-data/no-backfill decision does not authorize deleting accounting history or fabricating links; root may report the legacy limitation without migration. If an alternate design persists a dedicated AdvanceInvoiceId/origin FK, propose a schema migration to the owner; none is required by this existing-fields design and no migration/snapshot is edited here.

## Decisions required before freeze

| Decision | Source-supported proposal | Owner/root status |
|---|---|---|
| Plain advance vs taxable advance vs refundable security deposit | AdvanceReceipt -> AR allocation; AdvanceTaxReceipt -> tax recognition/reserved source; DepositReceipt -> refundable liability, conversion to consideration only through separately authorized source action | Root combines receipt/deposit/contract discovery and freezes type/workflow/accounting matrix. |
| Authoritative tax-advance gross | Existing receipt's posted gross/unused source capacity, tax-inclusive split through ITaxPolicyService/VatPolicy and saved TaxPercent; no client net/tax/customer overrides | Material accounting handoff, root freeze under current user authorization. |
| Origin and consumption | Three truthful ledger pairs; original saved VAT reversal on final settlement; no new table/field | Root freeze; alternative schema proposal only if another invariant cannot be represented. |
| Recognition workflow | Retain explicit tax-advance generation via actual typed producer; fix broken current screen, no inferred automatic document creation | Root frontend ownership/freeze. |
| Partial recognition per receipt | Preserve existing single ReceiptNo/AgreementNo rule until specifically changed | Multiple contract receipts remain possible; no independent worker invention. |
| Source/target context | Same live tenant, exact partner, posted/nonvoid, base-currency scale; branch/date policy from root's unified contract | Preserve prior owner F2/J-1 and confirmed contract context. |
| Legacy origins | Fail closed and report; no Notes parsing/backfill/history rewrite | Root historical compatibility handoff. |

## Proposed implementation ownership

- Accounting worker: InvoiceService + GenerateInvoiceRequest + TaxAdvance allocation DTOs/controller contracts only after root freeze.
- Root/shared balance owner: typed settlement/balance interface/service, registration, shared effective filtering choice, validation/resource keys, lock order and integration.
- Journal allocation worker: JournalVoucherService ordinary source/read/write consistency, existing allocation VMs only after root freezes reader producer fields.
- Receipt/Deposit/contract worker/root: source-type routing, reservation guards against posted edits/unapprove/void, conversion/use/refund and owning screen consumers.
- Frontend worker: typed tax-advance generation/allocation screen and declared shared consumers, preserving UI owning shapes; new source snapshots from frozen endpoints.

Concurrent work must have exclusive files; InvoiceService is one accounting owner, not separate generate/allocation workers. For mixed limo/tax-advance Generate requests, freeze a consistent lock acquisition order (JournalVoucherAllocation and LimousineInvoice) before delegating. Holding locks inside an outer multi-save transaction keeps reservation/consumption atomic; nested writers honor the current transaction. Do not add a second journal engine.

This bounded audit did not cover unrelated vouchers, all deposit writers or all Advance/Deposit screens: root has separate discovery ownership. It reviewed actual owner symbols and related DTO/entity/EF/profile/API references only. No build/test/lint/browser/database/migration/commit/push/deploy/Sigma MCP/Graphify actions. No compile/runtime/SQL concurrency or visual acceptance claimed.

## Original credit-line identity refinement

The net/VAT table above illustrates the normal two-credit tax-advance JV. For implementation, use the canonical proportional reversal across **all original CREDIT lines**, preserving their exact account and detail IDs (`JournalVoucherResolver.AddProportionalReversal` / `FinancialNumberPolicy.AllocateProportionally`). One origin allocation links each original credited detail to its bridge debit. No current LinkAccounts lookup, amount-equality heuristic, account-name parsing, notes parsing or assumed identity order decides an old credit line's role. This works when liability and tax amounts are equal or the account links have changed. Validate that the original source credit sum equals its saved document total and that every source/target line has unused capacity; final consumption uses exact remaining line amounts. Source line capacities, saved proportions and the existing money policy own rounding. Root must freeze any necessary shared helper extension rather than copy another allocation engine.

Example for the complete flow (illustrative arithmetic only, not a new tax rate/default): receipt gross105; saved advance net100/tax5; final invoice net200/tax10/gross210. Receipt Dr cash105/Cr AR105. Advance Dr AR105/Cr advances100/Cr tax5, with receipt->advance reservation105. Final invoice Dr AR210/Cr revenue200/Cr tax10. Full consumption bridge Dr advances100/Dr tax5/Cr AR105, with original advance credit origins100+5 and final AR settlement105. Combined result: cash105, customer due105, revenue200 and final saved tax10; the prepaid VAT was not charged twice. Partial consumption leaves corresponding unused original credit-line balances and exact target due.
