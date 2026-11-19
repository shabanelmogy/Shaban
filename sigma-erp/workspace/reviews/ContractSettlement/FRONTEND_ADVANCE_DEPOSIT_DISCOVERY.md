# Advance/deposit frontend discovery

| Status | Draft |
|---|---|
| Owner verification pending | yes |

2026-10-07. Discovery only for the owner-authorized unification (“تمام ظبط فى اى شاشة بستخدم advance - deposit”). No application edits in this pass. Root owns business/accounting decisions and cross-layer freeze before any worker implementation. Source root: `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules`. No screenshots supplied.

Canonical authority: F:/My Work/Sigma/AGENTS.md and sigma-screen-refactor skill; existing applicable UI1/2/10/13/14/15/19/22/28 guidance. Shared routed/controlled dialog shapes, actual monetary precision and source-only boundaries apply. A monetary balance must come from server-owned settlement data, not a copied document input or a frontend formula.

## Actual producer/consumer inventory

| Surface and source evidence | Current producer/consumer | Meaning proven from frontend | Proposed smallest direction, pending backend freeze |
|---|---|---|---|
| Rental/Booking/components/details/details.component.ts229–230,694–695,879–880; HTML280–283; models/create.ts40–41; models/details.ts176–178 | Create/Update write advance+deposit; View separately receives receivedDeposit; displayed deposit caption explicitly expectedDeposit | deposit input is expected amount; receivedDeposit is separate collected information. advance caption alone does not establish actual collection | Preserve expected requirement inputs. Add authoritative collected/allocated/available/refundable summary separately; receipt/deposit collection actions must not overwrite expected inputs |
| Rental/Booking/components/deposit/deposit.component.ts; models/deposit.ts24+; services/booking.service.ts98–99 | Typed deposit form sends date/branch/amount/paymentMethod/card/bank-ish details/documents to POST Booking/{id}/deposit | Actual money collection action tied to booking; no purpose/source-type/allocation target in request | Adapt to shared collection context and separate advance-vs-refundable-deposit purpose only after backend defines contract; preserve payment details and document lifecycle |
| Rental/Booking/components/journal + models/deposit.ts; services/booking.service.ts106+ | GET Booking/{id}/journal displays actual accounting lines | Read-only accounting evidence; not an advance/deposit balance formula | Keep read-only journal, add settlement lineage/balances from source API if frozen |
| Rental/Agreement/components/details/details.component.ts260–261,717; HTML259–260; models/create.ts39–40 | Editable advance/deposit fields go into generic agreement Add/Update, and View prints them | Ambiguous expected-vs-actual contract | Do not label/write these as actual collected money until root separates contract terms from ledger-derived balances |
| Rental/Agreement/components/list/list.component.ts557–558; models/list.ts77–78 | row.advance exported as receivedAmount; row.deposit exported as agreementDepositBalance | Display currently claims actual collection/balance using same fields that master editor writes | Replace actual displayed columns/exports with authoritative settlement values; keep grid/ListVM minimal matched |
| Rental/Agreement/components/deposit + models/deposits.ts + services/agreement.service.ts108+ | POST RentalAgreement/{id}/deposit, typed cash/card/bank form, documents, composite cleanup/success owner | Deposit collection independent from master editor; no reusable balance/history/allocate/refund action | Reuse payment capture workflow, wrap source identity/purpose in shared collection contract; preserve existing cleanup and single toast owner |
| Rental/Agreement/components/list/list.component.html215+ | Shared Receipt editor opened with rentalAgreementId, alongside separate deposit dialog | General receipt/advance is already distinct UI from deposit collection | Preserve distinction; shared receipt target must carry explicit RentalAgreement kind, not ambiguous agreementId alone |
| Lease/LeaseAgreement/components/details/details.component.ts329–330,686–687,835–836; HTML481–488; models/create.ts78–79/details.ts90–91 | Nullable advance/deposit copied into saved detail and generic write | Current editable contract field; not proven ledger balance | Keep expected terms only after explicit backend rename/freeze; show actual balances readonly |
| Lease/LeaseAgreement/components/extend-period/extend-period.component.ts148–149,310–311,339–340 and HTML146–151; models/extend.ts | Extension rewrites advance/deposit | Editable values carried into extension action; no receipt/settlement reference | Preserve/adjust expected future requirement, omit collected/allocated/refundable fields from writes |
| Lease/LeaseAgreement/components/extend-period/extend-rate-period.component.ts306–307,648–649,697–698,797–798 and HTML264–265; models/extend-rate-period.ts | New rate-period detail includes advance/deposit inputs and summary | Another independent writer/reader of the same ambiguous contract values | Same shared settlement summary and expected-term contract, no independent local actual-money update |
| Lease/LeaseAgreement/components/deposit + models/deposits.ts + services/leaseagreement.service.ts174+ | POST LeaseAgreement/{id}/deposit, same payment/document shape as Rental | Collection action; no purpose/settlement source/target/refund UI | Adopt shared source-specific collection contract after freeze; preserve selected payment method restrictions and uploads |
| Lease/LeaseAgreement/components/list/list.component.ts305–316 + HTML242–258 | Existing shared Receipt and separate Deposit actions; shown for non-voided agreement | UI distinct collection modes. Lease list DTO has no advance/deposit columns | Keep distinct actions with server eligibility; no new master list monetary columns unless needed |
| Vouchers/Invoices/Invoice/components/tax-advance-details + invoice.routes.ts | Actual routable tax-advance/create and tax-advance/details/:id; Invoice list action advanceTax routes there | Tax advance invoice workflow exists but source balance and accounting meaning unresolved | Refactor once root freezes tax-advance producer API and tax/accounting treatment; must not be used as generic cash collection |
| Accounts/openingBalances/components/deposit/deposit.component.ts206+; services/opening-balances-deposit.service.ts; models/create.ts64+ | Full snapshot POST OpeningBalanceDeposit/AddList {expectedVersion,items}, agreementNo/contactCode/customerId/depositType0cash/1cheque/positive amount/notes | Actual imported opening customer deposit liability, not a new payment receipt or planned deposit requirement | Keep aggregate expected-version lock and opening import/posting lifecycle; include its frozen posted source in shared available/refundable deposit inventory through backend |
| Vouchers/JVs/components/details/details.component.ts65+; models/details.ts8+ | isGenerated and opening-balance subtype6 treated source-owned readonly | Source document owns journal mutation/posting; direct JV editor must not be settlement writer | Existing frontend guard retained. Shared settlement must generate/read its own source-owned journal through backend owner |

Opening Deposit already uses typed financial scale validator, positive amount, shared editable table/cards and expectedVersion refresh reconciliation. Other deposit dialogs and advance/deposit master inputs mostly use literal0.01/min or min0 with no FinancialNumberPolicy scale validator, so precision must be unified through existing owner when that surface is implemented.

## Shared Receipt seam and confirmed risks

Direct sources:
- `Vouchers/Receipts/Receipt/components/details/details.component.ts`: rental context835+ and lease context778+ both write agreementId, customerId/contactId, receiptType0 and allocationStatus1. Generic payload1142+ carries only agreementId, with no Rental-vs-Lease discriminator. It also sends subscriptionId and allocationStatus.
- `Vouchers/Receipts/Receipt/models/details.ts` and `services/receipt.service.ts26+`: GET Receipt/GetAllocations/{customerId} returns CreditNoteAllocationDetailId, creditNoteId, invoiceId and amount/alreadyAllocated/due. It is **credit-note allocation source**, not an inventory of unspent receipt advances or refundable deposits.
- Allocation controls1190+ hold source voucher/date/detail/amount/alreadyAllocated/due and allocatedNow; allocatedNow only required/min0.01. Source metadata appears readonly in HTML376–382, so ordinary UI does not freely edit those cells. Nevertheless the full raw object/tenant/source amounts is sent by buildPayload; requested allocations have no local max-due, currency-scale or aggregate source-balance validation in this inspected seam. Backend enforcement remains root-owned and cannot be inferred from readonly inputs.
- Allocation requests need explicit source kind/id and target kind/id with requested amount only. Source customer, source balance, target due, tax, tenant, posting and totals must be reread/returned by backend. Legacy credit-note allocation is a distinct existing business path; do not silently repurpose it as advance/deposit allocation.

Receipt already supports Sales Quotation down-payment and Sales Agreement contexts in the same editor. Those contexts are a directly affected shared consumer: any shared-editor change must preserve them, but the separate Sales module discovery/ownership belongs to root's complete inventory. Existing rental/lease receipt loaders must lock customer to their source context as well as agreement and must guard every returned balance/identity.

## Tax-advance defects requiring a frozen replacement contract

`Vouchers/Invoices/Invoice/components/tax-advance-details/tax-advance-details.component.ts`:
- Uses untyped FormGroup, customers any[], raw payload any; it posts/puts generic Invoice BaseService without typed tax-advance VM or invoice-type discriminator. Generic InvoiceCreateDTO has unrelated rate/startDate/agreement fields and is not used by this component.
- Loads Customer.get() and Receipt.get() lists as dropdowns; receipt lookup is not keyed/canceled by customer, not purpose/state scoped, and does not obtain unallocated receipt balance. Ordinary generic list is paged: this is neither a complete option endpoint nor a server-search picker.
- Account display is populated from customer.email. This is not source-supported account text.
- Amount/tax/amountAfterTax are all free numeric inputs without required/finite/positive/currency-scale/cap validation, and are sent together. It does not use source tax snapshot or a backend-owned preview contract.
- Adds subscriptionId on Update; unguarded Delete/Edit; no dirty guard and weak business/transport/loading handling; manual file upload has no saved/draft reconciliation.
- Existing routes genuinely expose this screen; this is not dead code. Exact tax/accounting producer shape is Missing to this frontend discovery until root freezes the backend action, receipt eligibility, tax allocation and saved view contract.

## Missing shared surfaces and recommended minimal composition

No actual shared/service contract-settlement owner was found in the bounded service inventory. No allocate advance to invoice, consume refundable deposit, refund remaining deposit, customer available-credit/deposit source ledger or settlement history/reversal component appears in the inspected Booking/Rental/Lease surfaces. Current Deposit actions collect only; current Receipt credit-note allocations cannot fill that gap.

Recommended composition, subject to root freeze:
1. Keep expectedAdvance/expectedDeposit as document terms where the actual backend supports that meaning; display separate collectedAdvance, allocatedAdvance, availableAdvance, collectedDeposit, consumedDeposit, refundedDeposit and refundableDeposit from authoritative source summary. Never trust/reconstruct balances from inputs.
2. One shared source-aware settlement viewer/typed action dialog for Rental Booking, Rental Agreement and Lease Agreement adapters, using EditorDialog, SummaryCards, EditableCollectionTable, FieldError, actual currency policy and cold identity-safe discard.
3. Distinct collect advance and collect refundable deposit; explicit allocation to a selected eligible invoice; consume deposit only by explicit approved action and source/target; refund only from remaining refundable balance. Backend cap/state/customer/currency/transaction/concurrency governs all writers.
4. Keep opening deposit as imported opening source and generated JV as immutable evidence. Legacy posted history must never be silently reclassified. Tax-advance invoice is a tax document linked to eligible receipt source, not another collection that creates money twice.

These are proposed API/UI boundaries, **not Frozen accounting decisions**. Root must resolve remaining backend/source kinds, receipt-purpose classification, legacy-row handling, posting/refund/reversal and candidate API shape before application edits.

## Candidate exact file ownership after freeze

| Bounded workstream | Candidate files |
|---|---|
| Shared owner (root) | New scoped shared settlement service/models/component(s) only after explicit name/API freeze; Receipt services/models/editor shared integration; locales; routing/menu/provider integration |
| Booking adapter | Rental/Booking/models/create.ts/details.ts/list.ts/deposit.ts; services/booking.service.ts; components/details/*.ts/html; components/list/*.ts/html; components/deposit/*.ts/html; journal DTO/view only if changed contract |
| Rental Agreement adapter | Rental/Agreement/models/create.ts/details.ts/list.ts/deposits.ts; services/agreement.service.ts; components/details/list/deposit/print affected .ts/.html; no unrelated rental actions |
| Lease Agreement adapter | Lease/LeaseAgreement/models/create.ts/details.ts/deposits.ts/extend.ts/extend-rate-period.ts; services/leaseagreement.service.ts; components/details/list/deposit/extend-period affected .ts/.html |
| Tax-advance replacement | Invoice/components/tax-advance-details entire component; new feature-specific typed models; Invoice/services/invoice.service.ts typed action wrappers; Invoice invoice.routes.ts only if route modes/guard required; root coordinates shared Invoice consumers |
| Opening-deposit adapter | openingBalances/components/deposit/*.ts/.html; openingBalances/services/opening-balances-deposit.service.ts; shared opening models create.ts/list.ts only with root-coordinated ownership; preserve fiscal aggregate lifecycle |
| JV | No frontend edit required by current evidence; retain source-owned read guard and verify backend generation marks source ownership |

Names containing “deposit” or “advance” do not imply this customer settlement concept. Banking/Cash Deposits/CashDeposit is bank remittance of selected receipt/payment sources (models/create.ts sourceReceiptId/sourcePaymentId/depositedNow), not refundable customer deposit. Staff enum advanceSalary105 is employee payroll advance; supplier advances and accounting-link settings are separate monetary/configuration concepts and must not be converted to customer settlement based on matching text. Root's inventory owns any further explicit business decision on those surfaces.

## Verification and limitations

Only bounded source searches/reads and this review artifact were performed. No application/config/instruction source changed. No full-solution scan, builds, tests, lint, browser/runtime verification, database commands, migrations/model snapshots, commits/pushes or deployment. This discovery establishes source contracts/call paths, not ledger balances or runtime behavior. No new migration/commit suggestion before root freezes the actual change. Worker used inherited model for one coherent Angular discovery pass and reported the cross-layer conflicts to root.
