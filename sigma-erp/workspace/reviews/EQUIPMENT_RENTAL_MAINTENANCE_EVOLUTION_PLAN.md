# Equipment Rental — Maintenance / Evolution Plan

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-27 |
| Authorization | Owner: complete researched business cycle then implement what can safely be settled; existing data explicitly test/disposable; no data deletion or database execution requested |
| Freeze boundary | Slices A and B; later owner pricing answers resolve the historical Missing rows as detailed below. Financial posting/settlement remain unfrozen |

## Purpose and evidence

The missing capability is an operational continuation of equipment agreements. Existing code is fragmented: DeliveryNote has actual agreement/equipment/Partner/branch/date FKs but list/view only; TimeSheet selects Partner IDs against an unrelated legacy Customer FK; invoice screen is only a six-field legacy exposed slice. This plan extends those owners, rather than copying the reference application's unknown behavior.

Screenshot Capture.PNG shows an approved master-agreement list and a Sales Orders association dialog with order selection, issue/expiry dates, amount, Add Row, Save and Close. These are Confirmed functional evidence only. The screenshot does not prove delivery creation, billing rules, order budget consumption, ownership transfer or return workflow. Existing same-customer SaleOrder association remains its frozen contract; do not reinterpret it as equipment sale or an enforced spending ceiling.

External primary-source research:

- Texada: delivery/pickup tickets are children of a contract, can cover multiple assets, allow multiple tickets per contract, and record transport/acceptance: https://help.texadasoftware.com/en/knowledge/218/about-tickets
- Odoo: confirmed rental pickup/return tracks actual quantities and serial identities separately: https://www.odoo.com/documentation/19.0/applications/sales/rental/rental_orders/pickup_return.html
- Point of Rental: call-off can stop rental time before physical return; custody and billable time are different events: https://api.pointofrental.com/docs and https://help.point-of-rental.com/2017/Documents/calledoffrent.htm (older version corroborates concept, not current UI).
- Latner: operated-hire dockets tie equipment line/operator/day and approved hours to billing; this is one supported business model, not a universal rule for operator-inclusive rental: https://documentation.latnersoftware.com/help/how-to-create-an-operator-docket
- Texada: cycle billing evaluates open contracts for periodic invoicing, so return is not a prerequisite to all invoices: https://help.texadasoftware.com/en/knowledge/1062/how-to-complete-a-cycle-billing
- STAEDEAN: serialized rental objects are assigned before delivery; rental/service/sale line types differ: https://docs.staedean.com/equipment-rental/docs/create-and-confirm-rental-order

## Target business cycle (proposed complete model)

1. Quote defines required type/model, units, rental period basis and with/without-operator rates. Approval fixes the offer used for execution.
2. Master agreement establishes customer, dates and accepted quotation context; linked sales orders remain commercial references, not proof of dispatch.
3. Actual delivery identifies a specific equipment unit and approved agreement/customer/branch. Planned note date, actual delivery and invoicing start are separate. One current DeliveryNote represents one serial unit; several deliveries can serve one agreement. Grouped multi-unit delivery headers are a later extension, not an invented collection in this slice.
4. Availability must be rechecked at write time under the same lock as SalesAgreement; an active dated unreturned delivery cannot allocate the unit a second time. Saving a returned note must not make the unit available if another conflicting active note exists.
5. TimeSheet references the real DeliveryNote, its EquipmentMasterAgreement and the same Partner customer; backend rechecks relationship, date order and live tenant ownership. It records entered operational quantities without inventing how meter readings, breaks, hours to invoice and operator overtime are calculated.
6. ReturnDate records physical return; it cannot predate actual delivery. The current source does not have an independent call-off event. Do not silently treat ReturnDate as both call-off and pickup when policy later supports the distinction. Returned equipment's service/inspection availability is a separate future readiness contract.
7. Complete financial cycle needs an explicit frozen billable basis and source-line/date linkage: periodic or approved-hours invoice preview; already-billed coverage; rate/tax/currency snapshots; partial periods, stop/correction behavior; existing invoice approval/posting and settlement locks. Invoice Save, Approve, Void and settlement are distinct. No blind automatic journal at delivery or time entry.
8. Closure requires all unit custody returned/resolved, billable coverage reconciled, final charges reviewed and settlement policy satisfied. Operational return, invoice completion and accounting settlement are separate states.

## Existing-state / impact / gap decisions

| Owner | Decision | Impact and reason |
|---|---|---|
| Quotation | Refactor | Guard downstream dependencies and repair actual scalar grid projection; preserve two current approval axes/API shapes |
| EquipmentMasterAgreement | Refactor | Serialize existing write/approve/SO association invariants; live-dependent delete protection; current API contracts unchanged |
| DeliveryNote | Extend | Add controlled create/edit of actual existing fields; use existing POST/PUT contract and real finite source choices. No invented status graph, approval action, document number policy or accounting effect |
| TimeSheet | Refactor | Correct FK to Partner, add explicit delivery/agreement relationships and validate exact triple. Owner test-data instruction resolves historic FK remapping concern; owner recreates/migrates schema |
| Reference loading/cache | Extend existing owners | Finite bootstrap plus separate watch/context clearing; page/dialog scope through ReferenceLookupStatus, no new cache eligibility |
| EquipmentRentalInvoice | Keep current slice | Fix only scoped loading/source conformance; no invented billing generator or ledger writer |
| Guide | Extend | Update actual user steps and clearly describe current operational limits |
| Schema/data | Refactor declarations only | TimeSheet FK correction/additions require owner-run migration; do not create/edit/run migrations/snapshot or delete any data |

## Slice A — Frozen implementation contract

- Preserve all unrelated user changes. Review each affected repository separately; no build/test/lint/browser/database/commits/deploy.
- Quotation: reuse an explicit typed grid projection matching seven displayed columns and current flags; guard unapprove/revise/edit/delete against existing live PurchaseOrder/EquipmentMasterAgreement dependencies using authoritative checks and existing state/API response conventions. Preserve status semantics and pricing precision until separately decided.
- MasterAgreement: preserve manual or approved-quotation creation, dates, customer and same-customer SO full-snapshot association. All participating writes share one entity/tenant write boundary; preserve current referenced quote eligibility. Reject edit/delete of approved records and deletion with live DeliveryNote/TimeSheet/SO references. Do not add new permission or approval lifecycle.
- DeliveryNote UI: type01 controlled modal (existing field-only single-unit owner), list Create/View/Edit; no Delete, Deliver/Approve/OffRent/Return endpoint is invented. Existing actual DeliveryDate/ReturnDate fields are edited as operational facts with dirty protection and backend validation; UI uses actual source IDs and derived labels, typed payload, global Save, local read/lookup states. Existing strings Type/Status/Ownership/OperatorProvidedBy remain their supported values, not accounting transitions. Number, agreement/customer/equipment labels supplied from actual records; API retains compatibility while backend protects authoritative linkage.
- DeliveryNote backend: check live tenant FK/principal ownership; supplied agreement must be approved and customer-consistent; populate agreement/equipment historical identifiers from saved sources when IDs supplied; required source identity for new routed saves is positive. Validate date ordering; prevent two active dated unreturned notes for the same equipment under existing SalesAgreement lock. Keep return/edit safe and source-owned; don't add pricing or use cached availability.
- TimeSheet: Customer navigation points to Partner (Individual/Company); DeliveryId points to DeliveryNote; MasterAgreementId points to EquipmentMasterAgreement; restrictive relationships. Required exact selected references, matching customer/agreement, dates within actual delivered/returned scope when present and correctly ordered. Existing integer fields retain meaning; no derived billable total or rounding policy is guessed. Validate nonnegative quantities where existing UI contract already enforces them; meter/time fields do not acquire invented conversions. Use one-way maps and preserve stored server-owned fields.
- Lookup/cache: only Customer/Branch existing opt-ins get watches; Staff/Equipment/CarModel and document selectors remain direct. Initial routed bootstrap uses page scope, dialog reads use local owner, retained refresh silent; preserve IDs/drafts and clear options on context reset with teardown/Retry.
- Source performance: retain count/page/export/grid semantics and tenant/live/history; narrow proven overfetch only, preserve DTO consumers. Indexes remain evidence-backed proposals, not schema execution.

## Unfrozen downstream decisions and alternatives

| Decision | Options and consequence | Status |
|---|---|---|
| Billing basis | Calendar day/week/month rental; metered overage; approved operator hours; mixed base + overage. Quote currently provides Daily/Weekly/Monthly but no complete overtime tariff or proration contract | Missing; owner commercial choice before automatic priced invoice |
| Partial month/day | Calendar anniversary/actual calendar days vs fixed 30 days vs completed units/minimum; impacts money | Missing; no assumed divisor or rounding |
| Call-off | Stop on accepted customer request vs physical return; separate timestamp and approval/audit needed if distinct | Missing; current slice uses physical ReturnDate only |
| Operator | Included periodic rate vs approved hourly service vs base plus overtime; timesheet field names do not resolve rule | Missing |
| Outage/standby/holiday | Charge/no charge/partial rate, approval/reason/history | Missing |
| Replacement | Linked returned unit and replacement delivery, preserve continuity/avoid double charge; exact finance effect | Proposed, not implemented in Slice A |
| Source quantity/PO budget | Quotation line proof and remaining unit capacity vs informal reference; SO amount is not automatically a ceiling | Missing |
| Invoice approval and ledger | Reuse actual financial document owners only after model-specific draft/approve/unapprove/void/period/settlement graph is frozen | Missing |

## Verification and rollout

Root performs scoped source/diff/contract/namespace/route/translation/cache/loading/guide reconciliation. Owner runs compilation, route/dialog/RTL/theme/keyboard acceptance, database schema migration/recreation and concurrency tests. Reproduce two parallel deliveries for one unit, changed agreement/customer, invalid FK, return before dispatch, time entry outside rental, linked quotation reversal, simultaneous SO association, failed lookups/context changes, all-page filtered export and no lost draft. Measure cold/warm open and detail/search/save/export separately with same tenant/volume/filter/page/network, repeated samples; no elapsed-time claim from source call reduction.

No migration or data correction is executed. Source indexes/actual plan and timing acceptance remain owner checks. First implementation slice is Frozen; later business policy remains explicitly unresolved rather than silently defaulted.
## Owner decisions and Slice B freeze — 2026-10-27

The owner explicitly approved both period and approved-hours charging, physical-return cutoff, rates stored in the agreement, calendar-anniversary months and actual-day proration, with no second deduction of breaks or addition of overtime to already-approved billable hours. Test data may be discarded by the owner; no data deletion is authorized/executed by the agent.

Slice B uses one agreed rate per specific equipment unit in an agreement; each rate selects Day, Week, Month or Hour. This is the smallest actual-unit pricing contract supported by the current DeliveryNote owner and avoids assuming all equipment has one price. Agreement Save remains a draft; Approve requires at least one valid rate and locks them. Delivery always consumes the same approved agreement/equipment rate; its price is not edited on delivery or invoice.

Billing date ranges are inclusive calendar dates; the calculation uses a half-open end at the following day. Start cannot precede explicit InvoicingStartDate, and end cannot exceed physical ReturnDate or today. Day=actual days; Week=actual days/7; Month=overlap/actual days in the anniversary cycle anchored to the original invoicing start (original anchor AddMonths prevents month-end drift). Hour invoices consume whole approved TimeSheets whose work intervals fall completely within the selected range; crossing sheets require a corrected/split draft before approval and are never partially guessed. HoursToInvoice is the approved net billable quantity; breaks/overtime are not applied a second time. Approval rejects negative billable hours; clock/meter fields remain informational until separately modeled.

TimeSheet gets Pending/Approved operational approval with append-only decision history. Approved or already invoiced sheets cannot be edited/deleted. UnApprove requires a nonblank reason <=500 and is refused when billed. A dedicated model approval does not invent a general permission API. The current slice does not expose Reject or add a third correction policy.

Invoice preview and generation use the same server preparation under the shared SalesAgreement write lock; generation re-reads terms, delivery, approved sheets and prior coverage. Any live generated invoice reserves its period or source-sheet ids, even before posting; soft deletion of an unposted unlocked generated invoice releases that reservation. Overlapping duration invoices are refused; hourly sheets can be consumed once. One invoice represents one delivery unit and its currency. Currency/tax use existing authoritative customer/base and tax policy services; totals are derived and rounded on the backend. Saving a generated document creates a priced draft only, never a journal or settlement. Generated drafts are read-only in the legacy metadata editor; its Delete retains existing settlement/posted guards. The model-specific invoice Approve/Post/Void graph is not frozen and is deliberately not exposed by this slice. This is a precise financial boundary, not a claim that the full accounting lifecycle is complete.

Operational Date is a document date and may be entered after return; only actual work interval must lie within custody. DeliveryNoteDate likewise records paperwork; actual dispatch is DeliveryDate. Existing SalesAgreement reservation safety still treats a dated prepared note as reserved until return. It is not proof of completed delivery.

## Current implementation disposition

Slices A and B are implemented at source level and reconciled in EQUIPMENT_RENTAL_FULL_STACK_REVIEW.md; the consolidated current API/field/action contract is EQUIPMENT_RENTAL_DOMAIN_API_CONTRACT_FREEZE.md. Earlier Keep-invoice/Missing-pricing rows document the earlier freeze, not the final approved boundary.

The rates collection uses saved owned child IDs and full-snapshot reconciliation, with a unique equipment key. Physical delivery and return are actual facts and reject future dates; administrative dates remain separate. Distinct hourly sheets may legitimately share dates (for example different shifts); no unapproved daily-overlap prohibition was introduced. Approval owns acceptance of the entered net work, and billing prevents reuse of the same source sheet. Currency validation accepts existing monetary storage precision 0..2; approval rechecks live customer/equipment/rates before fixing terms.

The in-app bilingual guide is updated through priced draft generation and correction. Migration/schema update, compilation, runtime/visual/concurrency/network and SQL-plan/timing acceptance remain owner work. No data was deleted and no database/migration/build/test/browser command was run. Invoice accounting state/ledger/settlement/closure and the remaining commercial alternatives above remain separate decisions; this is not whole-module financial closure.

## Target C — recommended business cycle, planning only

The owner next asked to determine the purpose of SaleOrder and the correct upstream creation of DeliveryNote. This section is a **proposed target**, not a change to the implemented A/B freeze. No application source changes accompany this proposal.

### Objective and evidence

The cycle must answer five questions: what terms were accepted, what rental the customer requested, what equipment actually left custody and when, what remains to be delivered/returned, and what performed duration/hours have already been invoiced. Each document owns a different fact.

Confirmed source: SaleOrder already links to EquipmentMasterAgreement and has description/amount/tax items, but no equipment/delivery-line ownership and no frontend creator. DeliveryNote owns one actual unit and an agreement, without an order FK. The screenshot proves linking existing orders only. The owner reports no standalone delivery Add in the reference; that supports upstream creation without proving its exact parent.

External corroboration: STAEDEAN distinguishes rental agreements, rental orders and fulfillment, and requires serialized-unit assignment before delivery. Texada creates delivery tickets for a parent contract's assets. These are examples, not evidence that the unnamed reference program has the same internal contract.

- STAEDEAN: https://docs.staedean.com/equipment-rental/docs/create-and-confirm-rental-order
- Texada: https://help.texadasoftware.com/en/knowledge/181/the-contract-list-page
- Texada ticket sources: https://help.texadasoftware.com/en/knowledge/187/create-a-ticket-in-rental-management-next

### Recommended document responsibilities

| Document | Purpose | Creation / next step |
|---|---|---|
| Quotation | Proposed equipment, quantity, period basis and prices | Existing offer/approval -> accepted agreement |
| Master agreement | Accepted customer, validity, prices, basis and currency | Approved agreement -> Create Rental Order; approval itself does not dispatch equipment |
| Rental execution order | A concrete request under the agreement: selected priced units, planned dates, branch/site and optional customer PO reference | Create from agreement, inherit/lock customer and source prices; draft then confirmed request -> Prepare Delivery |
| Delivery note | Actual handover of a specific unit against an order line, actual date and explicit billing start | Prepare from confirmed rental order, then record actual dispatch; list tracks/view/dispatch/return/billing without unrestricted standalone Add |
| Work sheet | Actual work and approved net hours when the agreed basis is hourly | Actual delivery -> entered work -> existing approval -> billing |
| Invoice draft | Actual delivered duration or approved unbilled hours, using source terms and stored financial snapshots | Existing preview/generate; no copied order amount or automatic accounting posting |
| Physical return | Received-back custody fact and owner-approved charging cutoff | Existing return fact per unit; maintenance readiness remains separate |
| Completion / closure | Requested fulfillment, physical returns, remaining billable coverage and financial settlement are separate facts | Do not label a delivered order paid/closed; accounting closure remains unfrozen |

The equipment-module label should be **Rental Order / أمر تأجير** even if the implementation extends the existing SaleOrder owner. It is our execution request. The customer's purchase order is a separate external reference; an equipment rental line does not transfer equipment ownership.

### Core rules and worked example

1. One agreement can have several rental orders for different requests/sites/periods; each order has one owning agreement/customer. A confirmed equipment order cannot be freely relinked to another agreement.
2. Retain the existing actual-unit rate catalog in this extension. An initial order line selects one priced unit (quantity one), agreed basis/rate and planned dates. Do not silently redesign model-level tariffs, infer quotation capacity or treat the screenshot amount as a spending ceiling.
3. One order can have multiple delivery notes for partial fulfillment. Preparing several units can create one existing single-unit note per selected line; no second multi-unit delivery aggregate is required just to imitate another screen.
4. Delivery needs the exact confirmed order/line and matching live tenant/customer/agreement/unit. Server checks outstanding eligibility and current unit custody. Order confirmation is not actual delivery and does not start billing.
5. Reconcile existing dated-note reservation with any future order reservation before coding. A request alone does not promise future capacity; preparation/dispatch rechecks availability. A full interval planner remains a separate explicit contract.
6. Derive requested/delivered/outstanding fulfillment from source lines and effective linked notes, separately from returned/billed/paid. Cancel undelivered remainder explicitly; return an already delivered unit instead of deleting its custody evidence.
7. Preserve the owner's A/B price rules, approved net hours and physical-return cutoff. Requested-but-undelivered units are not invoiced. Order value is an estimate only where supported planned quantities exist; it is not actual invoice value or a journal entry.
8. Dependent dispatch/work/invoices protect accepted source terms. Exact amendment/cancellation history and states must be frozen before implementation, not guessed from labels.

Example: an agreement has three specifically priced units. The customer requests two for a site, creating one confirmed rental order with two lines. Unit A leaves on day 1 and B on day 3, producing separate actual delivery notes. The order is partial after A and fully delivered after B, but both units may still be out and unpaid. A returns on day 17 and B on day 25; each stops charging on its own return. Hourly lines use only their own approved net work.

### Alternatives and impact map

| Option | Benefit / cost | Decision |
|---|---|---|
| Agreement -> delivery; SO as optional commercial reference | Lowest change and valid for simple direct hire; does not make the visible order an execution owner | Simpler alternative; earlier A/B proposal |
| Agreement -> rental execution order -> delivery | Clear requests/partial fulfillment and one source chain; requires real order-line/state/UI/source-FK extension | Recommended target for the clarified business goal |
| Generic SO amount as dispatch authorization/budget | Cannot identify unit/quantity or remaining delivery; financial ceiling not approved | Reject |
| Automatic dispatch at agreement approval | Confuses accepted terms with physical custody and loses staggered deliveries | Reject |

| Owner | Classification | Impact / dependency |
|---|---|---|
| Quotation | Keep | Existing offer/approval; no unrelated precision or PO-writer change |
| MasterAgreement | Extend | Related orders and Create Rental Order; retain accepted terms/rates; replace arbitrary relinking coherently |
| SaleOrder/model/items/API | Extend existing owner for equipment context | Add actual source-line identity, priced-unit request, planned dates/site and model-specific confirmation/cancellation/amendment; preserve generic old order behavior |
| Order frontend | Create missing consumer | Shared list/aggregate editor or related creator; select final UI13 shape after fields/collections/actions freeze |
| DeliveryNote | Refactor entry; extend provenance | Confirmed-order action and order/line FK; retain existing single-unit actual dispatch/return/work/billing |
| TimeSheet / invoice | Keep math; extend provenance | Follow delivery -> order -> agreement for display/guards without accepting financial totals from client |
| Reports / guide / sidebar | Extend | Meaningful requested/delivered/outstanding/returned facts, source links and bilingual user journey after implementation |
| Cache/loading/performance | Keep owners; extend consumers | Order eligibility stays direct operational read; existing opted-in reference watches/invalidations stay. Apply UI2/22/29 and BE7/2 to actual requests/queries; no new cache/index now |
| Schema/data | Extend after domain freeze | New order-line/provenance/state needs owner-run migration. Old description/amount orders and notes stay legacy-readable until explicitly mapped/recreated; disposable data does not authorize agent deletion |

### Freeze, implementation and verification handoff

This target supersedes the earlier *recommendation* to create directly from the agreement, not the actual A/B source. Before implementation, freeze exact order states/actions, line/request fields, preparation versus dispatch writes, cancellation/amendment evidence, generic-order compatibility, reservation transaction/index rules and matching API/UI payloads. Naming the desired workflow does not itself establish those contracts. Posting/settlement remains a separate financial boundary.

Implementation sequence: domain/source freeze -> equipment-order read/write and creator -> confirmed-order delivery action/guards -> work/billing provenance -> routes/reports/cache/loading/guide -> source reconciliation and owner migration/runtime acceptance. Validate partial delivery/cancelled remainder, duplicate clicks/concurrent dispatch, tampered cross-customer/order/line, changed source terms, staggered starts/returns and all existing billing bases. Measure comparable cold/warm HTTP/SQL/page volumes before adding indexes.

This is a source-read-only PLAN-00 follow-up; all eight recipe packets passed Check. No application/instruction source, build/test/lint/browser/database/migration or data deletion was performed. No agents were used because the shared business decision is root-owned sequential work.

## Target C execution disposition — current 2026-10-27

The owner's later instruction to continue authorized implementation after the exact Target C amendment was frozen in EQUIPMENT_RENTAL_DOMAIN_API_CONTRACT_FREEZE.md. Target C is now implemented at source level. Its earlier planning-only labels above describe the preceding turn; the current implementation and final evidence are in EQUIPMENT_RENTAL_FULL_STACK_REVIEW.md, "Target C implemented".

The accepted option extends existing SaleOrder/SaleOrderItem for equipment execution requests. Approved agreement actions create/review rental orders. Draft -> confirmed request fixes source terms; each outstanding confirmed unit line prepares its own existing single-unit DeliveryNote. Delivery tracking has no unrestricted standalone Create. Physical dispatch, billing start and return stay explicit; fulfillment/return/cancellation counts are independent. Reasoned cancellation removes only safe undelivered remainder/preparation, preserves dispatched custody and logs the decision. Existing generic commercial orders/old note provenance remain distinct; no source assignments or data cleanup were guessed.

Keep: quotation and A/B pricing/work/billing math. Extend: MA actions, typed SaleOrder model/API/config and legacy guards, delivery provenance and uniqueness. Create: missing order list/aggregate editor/history. Refactor: delivery entry and source immutability. Update: routes/sidebar/vocabularies/guide/contracts. No competing subsystem or financial posting effect was introduced. Frozen exact DTOs/states/limits and legacy compatibility are reconciled; posting/settlement/closure, interval capacity planner, replacements and maintenance readiness still need their own contracts.

Source conformance includes guide, finite cache bootstrap/watch/context clearing, page/dialog loading owners and bounded query/index evidence. Eight recipe checks passed; frontend/template/C#/resource parsing and scoped diff checks passed. Runtime/compilation/SQL translation, visual/RTL/theme/keyboard, concurrency and measured load-speed evidence remain owner verification. Suggested owner migration: AddEquipmentRentalOrderFulfillment, checked absent; inspect both C schema and any still-pending A/B schema together. No migration/snapshot/build/test/browser/database or data-deletion command was executed.

## Subsequent owner clarification — action-only invoices, review disposition

Owner now states that invoicing is an action, not a standalone Equipment Rental screen, and requests another cycle review. The existing generation action is already on DeliveryNote, but the sidebar and saved-result navigation still enter the standalone invoice list. Those entry points and the guide require correction; they are open findings in the full-stack review, not completed source changes. Keep invoice persistence/math/coverage guards; refactor its normal presentation into source-owned generation/view/history actions. Define exact identity filtering and history API/legacy-link compatibility before implementation rather than removing the menu and losing access to previous invoices.

Source also resolves the PO ambiguity: PurchaseOrderService requires a Supplier and uses supplier currency/tax, with an optional equipment quotation reference. It is supplier procurement, an optional side branch. Customer PO remains an external reference; EquipmentRentalOrder remains our execution request. The quotation-to-agreement association exists inside the agreement editor/backend, but a direct quotation action is not yet wired. These facts supersede the earlier conditional description of PO or a claimed direct Create Agreement button.

This follow-up is source-read-only. Current accepted cycle is quotation -> approved agreement -> execution order -> actual unit delivery -> invoice actions, with hourly approved work only when required and physical return independent of billing/settlement. One-unit invoice draft is the existing financial aggregate; action-only UI does not imply consolidated invoices or accounting posting. The current implementation is not yet presentation-conformant with the new owner clarification.

## Action-only correction implemented — current disposition

Owner subsequently authorized execution. The latest frozen amendment and full-stack implementation section now close the presentation/entry findings at source level: direct Create/View Agreement from quotation; fixed authoritative quote/customer in the agreement draft; clearly named supplier PO branch; DeliveryNote generation/View invoices/history/detail/delete actions; invoice menu removed; old root/create redirect to deliveries and saved detail/edit links retained as direct editor hosts without list reads. History uses existing exact numeric DeliveryNoteId filtering/count/page, not a new API or text association. Generated initial View performs no history/list read until needed.

Existing financial/domain rules and earlier schema requirements remain; this correction adds no model/EF migration, accounting action or invoice consolidation. Guide and bilingual labels are reconciled. Root/worker source audit, 50 TypeScript/16 HTML plus one inline template, two C# parses and scoped diff/recipe checks passed; compilation/runtime/SQL plans/timing/visual/concurrency acceptance remains owner work. No prohibited execution was performed. Earlier review-only/open statements above describe their historical turn and are superseded by this section.
