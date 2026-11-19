# Contract advance / refundable deposit unification

| Status | Frozen |
|---|---|
| Owner verification pending | yes |

2026-10-07. User first requested a common method for similar contracts, then explicitly authorized implementation: «تمام ظبط فى اى شاشة بستخدم advance - deposit». This plan freezes the source-supported customer settlement workflow below. It extends existing owners rather than creating a second accounting engine. Prior Limousine changes and unrelated working-tree edits are preserved. No screenshots supplied.

Authority: F:/My Work/Sigma/AGENTS.md; required sigma-screen-refactor skill; canonical Master4/5/7, BE5/8/14/15/18 and UI1/2/10/13/14/17/19/22/28. Recipe -Check: phase01 current, PLAN00/phases00/02–06 stale; use canonical books, leave derivative regeneration/semantic review to owner. Existing F2/J-1 owner decisions in JOURNAL_ENTRIES_DECISION_SHEET.md and VOUCHERS_JOURNALS_MAINTENANCE_EVOLUTION_PLAN.md govern accounts and history. The new explicit broad instruction authorizes the coordinated source implementation; prior packet/build handoffs do not turn source-only restrictions into build permission.

## Existing-state inventory and scope

| Area | Source owner / behavior | Consumers / gap |
|---|---|---|
| Customer advances | ReceiptService; F2 Advance Cr customer AR, actual collection represented by receipt/JV | Rental/Lease embed shared Receipt editor; editable master advance is a contract term, not evidence of paid money |
| Refundable deposits | BookingService/RentalAgreementService/LeaseAgreementService AddDeposit create Receipt + CustomerDeposit + draft JV, Cr CustomerDepositsPayable | Three controlled collect dialogs; generic Receipt edit incorrectly rebuilds deposit Cr AR; standalone DepositReceipt not wrapped |
| Deposit available/use/refund | CustomerDepositService source amount minus UsedAmount, multi-save Use/Refund | Use posts AR credit with no linked Receipt/usage journal identity or specific invoice allocation; source/type/post/state/currency/concurrency need consistent guards |
| Tax advance | InvoiceService generic generation / AllocateTaxAdvance | Existing Angular TaxAdvance screen wrongly posts generic Invoice; old settlement debits liability gross, fails to reverse already-invoiced VAT, and cannot trace original used source |
| Ordinary allocation | JournalVoucherService + existing JournalVoucherAllocation | Source/target pair fields already exist; current reads/writes disagree on sign/both-side usage/effective state; refundable receipt can appear as ordinary AR credit source |
| Expected contract money | Booking/Rental/Lease editors and both Lease extension forms | Keep editable expected advance/deposit terms. Rental list currently labels those inputs as paid/balance; correct labels, do not invent collected figures |
| Opening deposits | OpeningBalanceDepositService aggregate version/posting + CustomerDeposit wrapper | Keep historical import and posted-source requirement; no new receipt or silent historical rewrite |
| Other contracts | Equipment/Transportation have their own invoice producers and pricing; Sales has approved collection/state locks | Shared customer receipt/allocation can settle their eligible customer invoices; do not copy Limousine fixed trip price cap onto period/usage pricing or silently redesign invoice frequency |
| Namesakes | Bank cash deposits, staff salary advances, supplier advances, settings/report labels | Distinct accounting purposes. Preserve source writers/formulas; matching text does not authorize treating them as customer refundable deposits |

Bounded discovery evidence: ContractSettlement/FRONTEND_ADVANCE_DEPOSIT_DISCOVERY.md and the accounting worker's source audit. Actual source maps are under F:/My Work/Sigma/SiGmaAngularFrontEnd and SigmaBackend. This inventory identifies affected existing screens/owners, not a completed whole-solution audit.

## Option and gap decisions

| Option / area | Decision | Reason |
|---|---|---|
| Always reduce service invoice by cash advance | Reject | Confuses payment with service price and duplicates/reduces invoicing when a tax advance was already invoiced |
| Always create a tax advance invoice for every receipt | Reject | ReceiptType already distinguishes AdvanceReceipt from AdvanceTaxReceipt; retain explicit taxable workflow |
| Full or partial service invoices + persisted payment allocation | Select | Preserve service pricing and invoice writers; separately track source available / target outstanding, supported by F2 and existing double-sided allocation model |
| One generic amount field for advance and deposit | Replace semantics | Expected terms, actual AR credits, refundable liabilities and their remaining balances are different facts |
| New financial posting service | Reject / Keep | Reuse JournalVoucherResolver, InvoiceService and JournalVoucherService; one accounting owner |
| Original-source lineage | Refactor | Use actual existing header/detail pair links for receipt reservation and tax-source reversal; no Notes-derived identity and no new schema for those links |
| History repair | Deferred | No automatic posted journal reclassification or guessed source assignment; ambiguous old tax settlements fail closed |
| Shared UI | Extend | Existing shared Receipt editor, financial collection/editor/dialog/error/precision owners; correct source identity and expected-money labels. TaxAdvance receives a genuine typed source-backed action |

## Frozen accounting and balance contract

1. Plain AdvanceReceipt: actual collection credits customer AR; later explicit allocation reduces invoice outstanding. No automatic tax invoice. DepositReceipt: credit CustomerDepositsPayable, never customer AR or revenue; only explicit Use converts the liability to an AR credit, Refund pays it back. Existing payment-method/bank rules, source accounts, fiscal/month checks and draft/approval posting remain authoritative.
2. Expected Advance/Deposit in contract Create/Update/Extend remain editable expected terms, not collection or ledger writes. Clarify all touched labels/exports/prints accordingly; keep actual receivedDeposit where already returned. Do not manufacture collected/available balances from those inputs. Expected deposit0 retains its existing unspecified-limit behavior; do not invent a new collection cap. Refundable deposits are independent from service price.
3. Service billing capacity, invoice payable balance and unused payment/deposit balance are separate. Limousine's approved gross cap remains. For period/usage contracts retain their existing billing owner and interval/charge rules; duplicate-period/frequency redesign is not this change. Allocation requires positive currency-scale-valid amount <= source remaining and <= target outstanding, same tenant/customer and compatible saved ledger account/branch. Explicit selected targets; no automatic cross-contract FIFO.
4. A TaxAdvanceInvoice is generated only from a live posted/nonvoided AdvanceTaxReceipt with valid same-tenant customer and actual unused AR credit. Its gross comes from the source receipt, not client amount/tax. New tax split uses existing ITaxPolicyService/VatPolicy/financial precision; persisted tax snapshot is never repriced from current settings. One source receipt is reserved against the tax advance's AR debit with a truthful ReceiptId and source/target detail pair in the same transaction, preventing ordinary reuse of that receipt credit.
5. Tax advance settlement reverses the original posted advance's CREDIT lines proportionally using their actual account/detail identities (normally CustomerAdvances net + TaxCollected tax), and credits each selected final invoice's original AR debit account with gross. Persist each bridge debit -> original advance credit allocation, plus each final invoice AR debit -> bridge AR credit allocation. Original-used gross is sum of effective origin shares; these sum to target gross and exclude no residual tax. This fixes double tax and missing source capacity without inventing current LinkAccounts mappings for old journals.
6. Ledger-effective allocation means BOTH target/bridge journal and actual source document/journal are live, posted and nonvoided, with live same-tenant detail ownership. Reads and writes must share this rule. Generated financial source journals remain source-owned, never edited as manual JVs. Untraceable historical tax advance usage cannot be assumed zero: fail closed and expose an explicit reconciliation error; never parse Notes to assign origin. No data repair in this task.
7. Deposit Use creates its existing intended linked Receipt with posted source-owned JV and stores ReceiptId on CustomerDepositUsage (existing entity fields), so the AR credit has durable ownership and can be allocated by the existing shared JournalVoucherService. Optional explicit invoice allocations run under the same transaction; no allocations means explicit conversion to customer on-account credit. Source wrapper UsedAmount remains the guarded consumption counter. Refund uses requested date/payment method when supplied, remaining gross only; partial refund leaves the still-available deposit usable. Preserve source liability account; never delete posted history.
8. All participating source/usage/refund/receipt/allocation writers reread balances under the tenant JournalVoucherAllocation application lock. Existing sales lock precedes allocation lock; mixed limousine generation takes LimousineInvoice then allocation lock. No inverse acquisition or nested independent transactions. Contracts' existing serializable collect transactions remain; guard receipt-linked used wrappers and tax sources against edit/delete/void/unapprove. Batch overrides must not bypass the same owner.

## API and UI handoff

| Surface | Frozen shape |
|---|---|
| GET Invoice/TaxAdvanceCandidates | Complete eligible posted AdvanceTaxReceipt collection; filters customerId/branchId/fromDate/toDate in existing Filters transport; typed id/no/date/customer/branch/gross and backend-owned tax/net preview; no fake paging |
| POST Invoice/GenerateTaxAdvance | {receiptId,invoiceDate}; required positive ID/calendar date. Source owns customer/branch/gross/tax/receipt number. Result IDs in existing Result.id; atomically create tax invoice, linked posted JV and source reservation |
| Generic legacy AdvanceTax generation | Retained route, same source-derived validation/construction/reservation; client amounts do not create money twice. Posted tax invoice UI is View/Print only, not free Edit/Delete |
| POST Invoice/AllocateTaxAdvance | Existing typed allocation request retained; new source lineage and tax reversal rule. Details/candidates return actual remaining; fail on ambiguous history |
| POST CustomerDeposit/Use/{id} | Existing fields retained; additive optional allocations[{invoiceId,allocatedNow,notes}] request. New linked receipt is backend-owned; specific invoice allocation uses shared JournalVoucherService |
| POST CustomerDeposit/Refund/{id} | Existing amount/notes/paymentMethodId retained; additive optional date/bankId as required by the existing payment method. Legacy missing method/date retains explicit existing fallback; valid selected method never ignored |
| Receipt generic/editor | Advance/AdvanceTax/Deposit collect unallocated. Existing CreditNoteAllocationDetail form is not repurposed as payment settlement; hide/omit/reject those children for these receipt types. Contract customer/source is backend-owned; no client tenant/source-balance metadata used |
| Master/extension/list/print | Clarify expected advance/deposit labels, retain actual received source values. Backend base Agreement identity is authoritative for Rental/Lease receipt FK; do not add a redundant discriminator without EF evidence |
| Missing screens | No CustomerDeposit Use/Refund Angular consumer exists in the bounded source search. Strengthen existing API and collect screens; do not fabricate a new banking module/menu beyond this request. Shared existing JV allocation remains the general eligible payment allocation surface |

Source summary/key/read contracts will be extended only where an existing screen consumes them; no unused broad DTO. Tax candidate/action DTOs each have their own owning file. Root integrates EN/AR keys; workers provide requirements and do not overlap locale edits. No new permission API; existing AuthGuard/interceptors retained.

### Exact tax screen transport handoff

Candidates entity: id,no,date,customerId,customerName,branchId,branchName,amount,tax,totalAmount,moneyDecimalPlaces. amount/tax are backend-owned preview for a NEW tax invoice; totalAmount is actual gross receipt. Complete collection, no paging. POST GenerateTaxAdvance {receiptId,invoiceDate} returns existing Result with created IDs in id:number[]. GET Invoice/TaxAdvance/{id} returns lean saved detail: id,no,invoiceDate,receiptNo,customerName,branchName,amount,tax,totalAmount,allocatedAmount:null|number,remainingAmount:null|number,requiresReconciliation:boolean. Legacy ambiguous usage is displayed explicitly with null balances, never as a made-up available amount; allocation rejects it. Routed list remains existing Invoice list; Create and readonly saved View/Print retain legacy route compatibility and list query state. No independent Edit/Delete against a posted tax source.

## Impact map / implementation ownership

| Stream | Exclusive ownership | Phases |
|---|---|---|
| Accounting worker | InvoiceService.cs, JournalVoucherService.cs, narrowly owned allocation-effect extension, IInvoiceService/controller additive tax commands, new tax DTOs; no Receipt/Deposit/contract/locales edits |1/2/3/4/5; worker source fragment |
| Frontend worker | TaxAdvance component/models/typed service/routes + expected amount labels in Booking/Rental/Lease including extensions/prints; excludes shared Receipt folder/locales/JV |2/3/5; source fragment |
| Receipt frontend worker | Vouchers/Receipts/Receipt component/models/service only; excludes other frontend/shared/locales/backend |2/3/5; source fragment |
| Root | Shared decisions/resources, ReceiptService and CustomerDepositService/DTOs/guards, contract collect/read integration as needed, whole scoped reconciliation |0/1/5/6 |

Preserve parallel peer changes; no overlapping edits. Keep/extend JournalVoucherResolver and existing invoice producer modules; source-ledger adapters unify settlement, not all pricing workflows. Supplier/staff/bank-transfer writers remain separate unless a concrete customer-settlement mismatch is found.

## Verification / rollout / recovery

No entity/EF/schema change is required by the chosen existing paired-link design or linked deposit-use receipt. If a verified later requirement needs schema, root must report owner-run Add-Migration; no agent edits migrations/snapshots. No posted-data backfill. New explicit errors protect uncertain history until owner reconciliation; failure rolls back receipt/invoice/JV/allocations/counters together.

Owner acceptance: Angular/.NET compilation and SQL projections; expected terms vs actual receipts; plain/tax advance/deposit source eligibility; changed account links; partial/final tax residue; same-source concurrent consumption/refund; receipt mutation races; two valid/one-invalid target atomicity; cross-tenant/customer/branch/invalid scale; source/target void effects; deposit source approval, opening posted lifecycle, partial refund; other receipt/credit-note/Sales context regressions; source-owned journals; complete candidate/read/error/dirty/RTL/theme/print behavior.

Source-only checks: complete scoped Git diff in each repository, DTO/API/component public declarations, owned TS/HTML syntax/local import and literal translations, resource XML duplicates and git diff --check. No build/test/lint/browser/runtime/database/migration/snapshot/Graphify/Sigma MCP/commit/push/deploy. Final report must distinguish implemented source from runtime acceptance.

Required order: accounting/source balance foundation and root guards; existing adapters/typed TaxAdvance screen; cross-layer integration/resources; whole source reconciliation. Approval/posting/refund tax semantics above follow existing explicit owner decisions plus current authorization; no new jurisdiction/rate is inferred. Historical accounting reconciliation remains a separate owner action. Suggested commits will be recorded after final source outcome, not executed.

## Integration clarification — 2026-10-07

The frozen complete tax candidate collection uses the project's `Results<T>.Entities` wrapper; saved details use `Result<T>.Entity`, and generation retains `Result.Id` as created IDs. Root corrected the worker's initial candidate wrapper during producer/consumer reconciliation. The candidate shape and accounting contract above are unchanged.

Receipt allocation writes carry source ID and requested amount only. Allocation status, source captions, source date, original amount, used amount and due are derived by ReceiptService. The independent ReceiptAllocationDetail generic write routes now return an aggregate-owner error instead of bypassing receipt/source validation; reads remain available. Bounded frontend discovery found no separate child editor/consumer. This implements the existing frozen aggregate ownership and BE3/14/15 requirements, without adding authorization roles or permissions.

Source reconciliation also applies the existing settlement lock to the ordinary credit-note source lifecycle and to the opening-balance development reset. Credit notes reserved by live receipt children cannot be modified, deleted, voided or unapproved independently. Reset refuses posted opening journals, deposit use/refund or allocation history before deletion. Equipment and Transportation generic invoice CRUD adapters reject posted/allocated targets under the same lock; their pricing and generation remain with their existing owners. These are source/target bypass guards under frozen rules6–8 and J-1, rather than new billing workflows.

The owner's clarification that an expected advance may still be unpaid is retained: contract input alone creates neither collection nor an allocation source. Draft deposit wrappers may be edited as metadata; Use/Refund require an actual posted source. New tax history requires one full explicit receipt reservation and valid saved credit-line origins; uncertain legacy history remains blocked.

Draft credit-note allocations are not ledger-effective until the credit note posts. Its approval therefore revalidates the saved source credit lines and current posted target debit balances under the same tenant allocation lock, including customer, original account and effective branch. A payment/tax advance allocated after the draft was saved may consume that target; approval must then fail rather than activating stale reservations above its current balance. This applies frozen rules3/6/8 at the posting transition and does not treat draft credit as collected money.
