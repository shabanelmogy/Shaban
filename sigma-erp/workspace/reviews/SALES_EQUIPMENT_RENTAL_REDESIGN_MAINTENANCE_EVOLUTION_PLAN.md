# Sales and Equipment Rental — complete workflow reformulation

> Current amendment 2026-10-27: the owner subsequently authorized completing the financial remainder. The financial completion frozen contract and feature review supersede the accounting deferrals below for used-fleet preparation, staged tax, actual collection and equipment posting/closure. Historical sections retain their original slice boundary. Schema/build/runtime verification remains owner-pending.

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-27 |
| Authorization | Owner asks to replace the guessed business formulation with the correct complete cycle and implement confirmed work; later explicitly asks for complete reformulation rather than isolated accounting fixes |
| Freeze boundary | Document ownership, source-supported current-cycle corrections and in-app explanations below. New accounting timing, cross-invoice tax allocation and dated hard reservation remain unresolved and outside this frozen implementation slice |

## Outcome and governing evidence

Three responsibilities must be understandable independently: sale of the actual unit; customer's commercial purchase order; rental execution/custody/usage. Reuse their current Sigma owners, preserve pending work and historical financial records, and do not turn an ambiguous reference label into a mandatory new transaction.

Mandatory entry: workspace AGENTS, sigma-screen-refactor, Master1/4/5/7, UI2/7/13/19/22/23/28/29, BE2/3/7/8/15. PLAN-00 and applicable phases00/01/03/04/06 follow all-eight successful recipe Check. Shapes: existing type02 routed agreement and type09 action dialog; posted Sales action follows backend pattern3. Approved references: Workshop Job editor/list and close-job, shared EditorDialog/ReferenceLookupStatus/DataTable; financial source InvoiceService is a shape reference only, not authority for copying a different posting/void policy. Existing Sales partial invoice/delivery contracts remain applicable where not amended below.

## Public primary evidence and limits

| Evidence | Verified meaning | Limit |
|---|---|---|
| https://speedautosystems.com/car-rental-software/features/ | Vouchers lists Sales Order (Purchase Orders of Customers) separately from supplier Purchase Orders | This is CRS, not an equipment-rental implementation specification |
| https://speedautosystems.com/vehicle-leasing-software/benefit/reduce-your-leasing-operation-cost-with-paperless-leasing-operation/ | Customer purchase orders are stored as supporting documents for lease invoices | Does not establish a spending ceiling, mandatory PO or allocation algorithm |
| https://speedautosystems.com/vehicle-leasing-software/features/ | Approved quotation/customer order can lead to a master lease agreement; procurement, per-unit agreements, delivery and billing are distinct stages | Vehicle leasing analog, not proof that equipment requires an additional internal rental order |
| https://speedautosystems.com/car-rental-software/user-guide/ | Public guide separates opening agreements, advances/deposits, invoicing and final receipts | Car-rental policy must not override the owner's agreed equipment billing/return rules |
| Owner screenshot 111.PNG | Speed Sales menu contains Fleet, Sales Quotation, Sales Agreement, Due Installments, Settings | Supports a distinct sales journey, but menu titles do not prove invoice posting, transfer-of-title or installment accounting rules |
| Sigma current Sales source and existing frozen contracts | Sale of actual serialized units, linked SalesQuotation/SalesAgreement, invoice action, independent SalesDeliveryNote and receipts/installments | Current source is factual behavior, not proof that all old accounting assumptions are correct |

The earlier explanation that Speed's Sale Order is necessarily an internal rental execution order is superseded by the public terminology above. Sigma's typed EquipmentRentalOrder remains a deliberate internal execution design, not a reverse-engineered Speed requirement. No public detailed Speed manual for the asset-sale or equipment-rental cycle was found in this bounded research; no private application, signup, contact or external mutation was used.

## Existing-state inventory and impact / gap decisions

| Responsibility | Current owner and consumers | Decision | Target |
|---|---|---|---|
| Sell a physical unit | SalesQuotation, SalesAgreement, SalesAgreementInvoice -> MiscellaneousInvoice/JV, SalesDeliveryNote, receipt/installment reader; current Sales routes | Keep / correct | Accepted offer -> binding sale agreement with actual reserved units -> appropriate sale invoices and deliveries -> actual receipts/installments -> closure. No duplicate SaleOrder for the same asset-sale commitment |
| Customer purchase-order document | Non-rental SaleOrder + Items + Documents and EquipmentMasterAgreement sale-orders relationship dialog | Clarify / retain | Customer PO is the customer's instruction/reference, with existing dates/amount/documents. Distinguish it from a supplier PO and an internal execution order. Existing association does not create a new order or impose a financial ceiling |
| Supplier procurement | Existing PurchaseOrder under Purchase and Suppliers, quotation link | Keep | Optional supply branch: supplier PO -> actual receipt -> supplier bill/payment using its existing owners. A quotation does not imply buying a unit that is already available |
| Accepted hire terms | Equipment quotation -> EquipmentMasterAgreement/rates/customer/currency | Keep | Framework for accepted terms; agreement validity is not itself a billable duration. Existing quote can create an agreement without supplier procurement |
| Internal hire execution | Typed rental SaleOrder and source lines | Keep with explicit purpose | Site/date/unit execution request; preparation from confirmed line. No claim that confirmation is a dated hard reservation. This document is not the customer's PO |
| Rental custody | DeliveryNote, actual dispatch and return | Keep | Physical facts and explicit billing start, one current unit per note; return stops billing under the owner's rule, subject to later readiness inspection |
| Usage and billing | TimeSheet approval and EquipmentRentalInvoice preview/generate/history actions | Keep | Duration prices from agreement, or approved net hours; no second break/overtime deduction; draft invoicing is separate from collection and posting |
| Unit delivery action | SalesAgreement detail -> action-dialog -> guarded DeliverCore | Extend read contract / correct | Server-owned eligible unit choices, posted billing and no repeated delivery; all-remaining shortcut only when current backend permits it |
| Unit cost validation | SalesAgreement InvoiceCore cost guard and posted cost lines | Correct | Validate exactly the same unit set whose cost will be posted, including an amount invoice that completes the contract, before any save |
| User understanding | Existing /UserGuide/sales and /UserGuide/equipment-rental | Extend | Complete purpose/scenario/entry/action/state explanation with customer PO vs supplier PO vs execution distinction |

## Complete target scenarios

Physical sale: prepare available actual stock -> quotation/model quantities and pricing -> internal/customer approval -> SalesAgreement chooses and reserves the actual units -> collection may occur under current receipt rules -> invoice whole amount, a stage amount or selected units -> deliver only permitted invoiced units, with one sale handover per unit -> finish collections/installments -> close only after all delivery and settlement requirements. Invoices, delivery and receipts are separate facts. Payment schedule rows are expected payments, not proof of receipts. The existing invoice-before-sale-delivery rule is retained, not claimed universal or established by Speed. New transfer-of-title/accounting timing is not selected in this task.

Rental: quote accepted model/quantity/rates -> optional record/link of customer's PO -> master agreement with accepted terms -> optional supplier procurement through existing supplier owner -> internal rental execution request and confirmation -> preparation/allocation -> actual rental delivery and billing start -> duration billing or approved usage sheets -> periodic draft invoices from actions -> physical return and remaining billing -> separately defined financial settlement/closure. One framework may support multiple execution orders/sites/dispatches and periods. Cancellation of unexecuted demand does not erase delivery history or end charges on a unit still with the customer.

Insufficient owned stock does not mean an automatic purchase: a supplier supply decision can be a purchase or third-party hire. Third-party hire cost/ownership/availability is a separate unfrozen extension; no fake owned asset is created to bypass it. Selling an on-hire unit without physical return similarly requires its own conversion contract, not a reused rental Close action.

## Ambiguity register / option decisions

| Question | Status and disposition |
|---|---|
| Does the app need actual asset sales as well as rental? | Existing source/contracts and owner-supplied Speed Sales menu support retaining asset sales. Owner was asked to clarify business activity; changing/removing that established module is not inferred from a shared Sales Order label |
| General SalesOrder meaning in reference | Confirmed in public CRS/VLS as customer PO; exact equipment screen inference labelled as such |
| Add a second asset-sale order before SalesAgreement? | Rejected for this slice: duplicates the existing binding sale commitment without a demonstrated separate framework/call-off requirement |
| Mandatory internal rental execution order in Speed? | Uncertain. Keep current Sigma design for its saved site/line/fulfillment contracts, not as a Speed compatibility claim |
| Customer PO mandatory or spending cap? | Neither inferred. Current optional reference/relationship remains; amount is not automatically consumed as credit limit |
| Hard reserve specific unit/date on confirmation? | Missing policy. Existing confirmation remains non-reserving; do not add a permanent flag that blocks nonoverlapping rentals |
| Cross-invoice rounding | Existing calculation can leave or overrun one smallest currency unit. Owner's reply asks for complete reformulation, not acceptance of final-invoice tax balancing. Remains unresolved; do not alter previous invoices or select a new tax distribution rule |
| Asset-sale recognition/ownership vs invoice/delivery; rental posting/collection | Existing sale policy preserved. Any new timing, revenue/cost account treatment, rental financial approval/void/settlement require exact contract decisions. No legal/accounting conclusion inferred from menus or marketing |
| Stock for sale vs previously rented depreciating assets | Material unresolved distinction. Equipment.PurchaseCost is described in source as carrying cost, but the Sales path reads only that scalar and credits StockAccount; it has no AssetId/depreciation roll-forward link. Assets/Asset.cs is a separate owner with cost/depreciation fields. Do not assume original purchase price, current carrying value and stock cost are interchangeable, or silently create an asset-disposal journal |

Additional accounting evidence: [IFRS Foundation IAS16 publication](https://www.ifrs.org/content/dam/ifrs/publications/pdf-standards/english/2022/issued/part-a/ias-16-property-plant-and-equipment.pdf?bypass=on). It distinguishes ordinary disposal from assets routinely rented and then held for sale, for which transfer to inventory uses carrying amount. This establishes why classification and carrying-value provenance need a confirmed accounting contract; it does not establish the owner's reporting framework, jurisdiction, sale timing or account mapping. The reviewed existing stock-sale policy remains unchanged, and a complete financial redesign is not claimed implemented.

Owner follow-up asks which is closest to the business rather than choosing a classification. Reviewer recommendation: for a rental operator make end-of-hire-life fleet sale the primary business scenario; retain a distinct trade-stock route if the company also buys units to resell. This recommendation is not acceptance of a new journal policy. Further bounded source inspection found AssetsServices/AssetService and Assets/Asset plus posted DepreciationEntry history, but no verified asset-disposal/sale transition or Equipment-to-Asset FK. ASSET_FEATURE_REVIEW already records missing Asset Sale Price/Dispose contracts; this is known cross-feature work. DepreciationEntry.IsDisposalRun does not establish a disposal lifecycle. Reuse the asset/depreciation owners for valuation only after their identity, effective date, carrying-value and cancellation contract is frozen; do not automatically assign Equipment.PurchaseCost to an arbitrary asset.

Owner subsequently says "تمام" after the recommendation to make used rental fleet sale primary and trace its financial source. This accepts the primary business scenario and continuation of the investigation; it does not answer the earlier VAT question or establish a new depreciation/transfer journal contract.

### Financial bridge discovery and proposed next contract

Bounded current-source audit: DepreciationService.BuildReport reads snapshots for the requested period only; previous depreciation is scheduled from opening depreciation and full months, including the start month. A saved period replaces report numbers without checking its journal IsPosted/IsVoided. No date-of-sale proration or disposal state is present. The current period journal is posted at month end; AssetType supplies its depreciation accounts, while per-Asset account properties are NotMapped. AssetService's older GenerateDepreciationReport/CalculateDepreciation helper is not a replacement valuation authority. Existing Asset/Depreciation review already records the missing disposal contract. These observations are source facts, not a whole Assets review or authorization to change its accounting.

Proposed complete financial continuation, not implemented: physically return/release a rental unit -> explicitly link its financial Asset identity -> prepare a dated held-for-sale transfer with verified cost, opening balances and posted nonvoided depreciation coverage -> approve the valuation and transfer -> stop future depreciation/rental availability according to the saved effective date -> transfer at the approved carrying value -> sell through the stock-sale commitment/invoice/handover/receipt cycle using that transferred cost. Trade stock follows its separate documented cost source. Preserve original purchase cost/history rather than overwriting it to masquerade as carrying value.

This bridge remains Blocked at its Phase1 contract, while the operational correction slice above is implemented. Required exact decisions: depreciation through the transfer date including treatment of a partial month; authoritative ledger/coverage and historical account identity when snapshots or mappings changed; holding-for-sale destination account, effective date and correction/cancellation; invoice recognition/control/tax timing and VAT rounding of staged billing. The same-tenant unique Equipment-to-Asset identity and concurrent sales/depreciation write order must be designed together. Choosing a source ID or manually keying a cost must not itself post a transfer or terminate a rental. A primary-scenario approval is not permission to invent these missing financial invariants. No fake ready/complete state or new unfinished financial action was added to the app.

## Frozen source correction contracts

Backend detail extends SalesAgreementDetailVM with bool CanDeliverAll and SalesAgreementItemDetailVM with bool CanDeliver. These are read-only action capabilities, never Add/Update inputs or security claims. Producer uses fresh same-tenant/live unit identity, current sale state, exact prior delivery item/equipment IDs, linked/legacy invoices and posted nonvoided journals. Fully invoiced agreements can deliver any undelivered sold unit when all relevant invoices are posted; partly invoiced agreements allow only units allocated to posted invoices. The writer remains authoritative and rechecks its existing rules. Detail must use bounded/set-based reads, no per-unit queries, no new availability cache.

Frontend action uses these exact capabilities rather than inferring identity from chassis text or only unit invoice links. All-remaining is optional only if CanDeliverAll=true. Otherwise require an explicit nonempty subset of current CanDeliver options. Empty eligibility blocks submit with a clear localized message. Preserve cancellation/target fences, dirty protection, local dialog progress/Retry and global guarded write ownership. This additive contract deploys backend before frontend; absence of capability metadata fails closed rather than guessing eligibility.

Invoice cost guard is moved after the invoice's full/partial outcome is known. Compute costUnits once from selected reserved units, or all remaining reserved units on completion. Validate positive rounded purchase cost for this same set before any document/JV save and use the same collection when creating cost entries. No new posting timing, account, tax calculation, schema or invoice state is introduced.

Presentation correction relabels the existing master-agreement generic association as customer's purchase orders (Sales Orders), explains that Add Row links an existing recorded document, and preserves IDs, endpoints and saved links. The internal rental order remains separately named. The actual reference ownership and unsupported details are recorded in both relevant in-app guide topics.

## Compatibility, implementation order and verification

No entity/configuration/migration/data rewrite is authorized or needed for the frozen correction slice; DTO fields are additive. Existing identifiers, quotations, invoices/JVs, receipts, fulfillment and routes are preserved. New unrelated pending changes and all old contracts remain untouched outside these amendments. Do not create migrations or modify snapshots.

Root owns plan/freeze, backend service/read DTOs, semantic vocabulary/guide and complete integration/diff. After this freeze a bounded worker may own only FE SalesAgreement models and action dialog. Root retains all financial and cross-layer decisions. Phases00/01 then03/04/05 as applicable and06; no generic new list/schema phases. No build/test/lint/browser/database/commit execution. Syntax parsing and scoped source/diff checks only, with owner runtime/EF/SQL/accounting acceptance pending.

Verification cases: full/legacy/amount-final invoicing permits selected undelivered units; unit invoice permits its own posted units only; amount-partial with no unit coverage cannot deliver; repeated or foreign IDs remain rejected; zero/null/rounds-to-zero unit costs fail before writes on every invoice basis including completion; already-posted costs are not duplicated. Invalid backend/business/HTTP read paths retain error/Retry, context cancellation and draft state. Compare public guide to real actions/limitations. Final-rounding examples remain open findings until policy is settled.

Performance/cache/index gates: detail keeps its bounded header/child/history reads; posted invoice eligibility may add one batched scalar read and note projections carry only the exact identities needed internally, not a graph per row. Existing source direct operational reads, reference-cache writers/watch/context lifetime and visible-loading owners are retained. No new performance index without plan evidence: existing agreement and delivery/invoice FK indexes and declared tenant+agreement invoice-link coverage are first candidates to verify. Actual deployed coverage, null/live semantics, SQL translation/cardinality and cold/warm response/query/render timing remain owner checks; do not claim measured speed. Record final source counts and index disposition in the review.
