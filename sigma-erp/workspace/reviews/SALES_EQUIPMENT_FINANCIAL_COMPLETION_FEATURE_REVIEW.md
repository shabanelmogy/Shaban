# Sales and Equipment Rental — financial completion reconciliation

> Current workflow clarification, 2026-10-27: EQUIPMENT_RENTAL_SIMPLIFICATION_CONTRACT_FREEZE.md and EQUIPMENT_RENTAL_SIMPLIFICATION_FEATURE_REVIEW.md supersede execution-order demand requirements below. Equipment delivery now starts directly from an approved open master agreement, preparation cancellation uses the guarded undelivered-note action, and financial closure / sale preparation use actual custody rather than unfulfilled order lines. All invoice accounting, effective collection, fiscal and physical-return rules remain. Financial actions stay inside delivery invoices; no standalone invoice menu was added.

> Follow-up 2026-10-27, tier S: fixed TS2741 in equipment-rental-guide.ts by adding the required empty notes array to the new financial topic. Kept GuideTopic.notes required and preserved authored content. Bounded no-emit TypeScript source/type analysis of the guide and its actual model: two files, zero syntactic/semantic diagnostics, no emitted output or application build. Scoped whitespace review passed; no request/cache/loading/query/schema change.

> Follow-up 2026-10-27, tier S — C# namespace correction: owner supplied CS0246/CS0234 diagnostics for Helpers and dependent DataAccess/Business/ServerAPI projects. Currency is declared in SiGma.Helpers.Models.Administrations; Equipment.cs and Models/Assets/EquipmentSalePreparation.cs had neither a local import nor a Helpers global import for it. Added that local using to both files only. EquipmentAgreementFinancialLog, EquipmentInvoiceTimeSheetSnapshot, EquipmentSalePreparation and IEquipmentSalePreparationService declarations already exist, and their reported consumers have the correct local/global imports or fully qualified names. SDK-default compile inclusion and Helpers→DataAccess→Business→ServerAPI project references were inspected; do not alter those correct consumers to mask producer errors. Existing Equipment changes and untracked feature types preserved. Source-only reconciliation under Master5 and BE1/5: complete touched source read/diff and scoped whitespace/conflict checks; owner rebuild remains pending, including whether dependent active diagnostics clear. No build/test/lint/DB/browser/migration/snapshot/commit/push executed, no new type/reference/schema/API or business change, no migration needed. Analysis-guide contract gate, cache/loading/query/index and user-guide content changes are not applicable to this import-only correction; existing workflows/guides and financial contracts remain unchanged. Initial recipe drift check passed; no canonical/skill/packet change needed because Master5 already owns this namespace/producer-first rule. No agents: tightly bounded correction. Suggested backend commit: fix(equipment): import currency namespace in equipment entities.

| Item | Value |
|---|---|
| Status | Implemented in source; owner schema/build/runtime acceptance pending |
| Date | 2026-10-27 |
| Scope | Remaining used-fleet sale accounting, staged VAT, actual sale collection, equipment invoice accounting/collection and agreement closure |
| Authority | Owner: complete the remaining work; original used-fleet primary path and frozen pricing/physical-return rules retained |
| Contract | SALES_EQUIPMENT_FINANCIAL_COMPLETION_CONTRACT_FREEZE.md, including source-discovered receipt correction |
| Verification boundary | No build, test, browser, database, migration generation/application or model snapshot edit by this task |

## Manifest and evidence

Tier L continuation of the Frozen redesign plan. Applied SIGMA_FEATURE_REVIEW_MASTER.md Master1/4/5/7, SIGMA_UI_PATTERNS.md UI2/7/13/19/22/23/28/29 and selected existing shapes: Fleet type01 list with type09 controlled action dialog; existing type02 Sales agreement and receipt editor; equipment finance type09 dialogs. Backend financial pattern3 owns atomic source/journal/allocation changes. Approved shared owners were inspected: EditorDialog, DataTable, StateMessage, SummaryCards, FormSection, ConfirmationDialogService, DocumentApprovalCycle and ReferenceLookupStatus. Recipe Check: all eight packets passed before use and again at handoff; no canonical-book/template change, no regeneration required.

Screenshot functional evidence and the Speed primary-source distinction are retained in the redesign plan and Equipment Rental review: Speed Sale Orders can represent customer POs; supplier Po, actual sale of a used unit, and Sigma's internal rental execution order remain separate. These financial actions do not claim to reproduce undocumented Speed accounting. Source ownership and explicit owner decisions govern the implementation.

Root froze domain/API contracts, integrated workers and reviewed the scoped source. Bounded worker ownership: asset/preparation backend; rental/accounting backend; rental/Fleet frontend. Root owns staged sale tax/cost integration, registration, receipt editor, shared translations/guides and final reconciliation. A focused independent source audit found wrong inventory-account reuse and missing all-unit preparation validation on amount stages; both were corrected and reread.

## Implemented business paths

| Path | Result and source evidence |
|---|---|
| Used rental unit -> sale stock | Fleet action explicitly selects financial Asset and transfer date; preview shows original cost, opening/prior/final depreciation and carrying value. Confirmation recomputes/token-checks inside sale -> depreciation guarded transaction, posts final depreciation and sale-stock transfer, saves immutable preparation and server-owned Equipment cost/currency provenance |
| Historical depreciation | EquipmentSalePreparationService requires effective posted generated coverage and account/effective-date snapshots. Missing, later, duplicate or inconsistent historical entries fail reconciliation. No speculative backfill. DepreciationService stops after HeldForSaleDate and preserves final partial entry. AssetService/FY projection overrides only held-for-sale assets with saved source history |
| Selling prepared equipment | SaleCostsAsync validates every agreement unit before any invoice; used units require preparation. Prepared zero carrying cost is valid. COGS is posted once for costUnits and credits the preparation's saved StockAccountId, even if current account settings changed. PurchaseCost is preserved. Creation/read selection and invoice writer enforce eligibility |
| Prevent rental reuse | Master-agreement rates, rental-order source rates and DeliveryNote validation/options exclude SalePreparationId. Sales/Equipment locks and concurrency tokens protect competing writes |
| Staged sale invoice | Net/tax/total balances derive from accepted contract and saved prior invoice snapshots. Final stage takes saved remaining tax. InvoiceBase explicit tax, charge totals, SalesAgreementInvoice and journal agree; no zero revenue/cost lines or historical repricing |
| Actual Sales collection | ReceiptSettlementQueryExtensions.WhereEffectivePosted is reused in Paid/Outstanding, schedule/due, grid and Close. Draft/rejected receipts do not count as collected. Existing reservation/dependency rules continue counting nonvoid drafts. History adds IsEffective. Receipt unapproval/void correction recomputes actual collection and reopens closed Sales when necessary |
| Equipment invoice approval | Delivery invoice-history Financial status posts saved draft values once through InvoiceAccountingService and JournalVoucherResolver. Saved unit chooses Day/Week/Month/Hour revenue mapping; Hour appends enum value5. Default catalog includes hour mapping, settings enum catalog already derives backend enum |
| Equipment collection | Financial status returns exact customer debit JV detail, effective allocated/outstanding amounts and receipts. Existing receipt editor fixes customer/branch/type, reloads the exact receivable and seeds one allocation. It remains open after draft save to use existing approval tab. Receipt approval revalidates capacity; saving alone does not settle the invoice |
| Invoice cancellation | Existing InvoiceActionService supports equipment flag-only void, reason/date/actor and fiscal/source/allocation guards. Old invoice and immutable sheet snapshot remain; current sheet billing link is released. Linked closed agreement reopens atomically. Only unposted/unlocked drafts may be deleted |
| Financial closure | Master agreement action reads actual custody, execution lines, sheet approval, contiguous duration coverage or approved consumed hours, draft/posting state and exact settlement. Close/reopen require reason and append audit history. Closed source writes are blocked. External/legacy correction discrepancies remain visible and allow explicit audited reopen |

## API, route and component reconciliation

Exact fields/body/endpoint contracts are in the frozen contract. Confirmed controller -> interface -> service -> frontend symbols:

- EquipmentSalePreparation assets, preview, confirm and saved GET. Existing equipment without preparation returns successful null; missing equipment returns not found. Authenticated controller, no generic preparation CRUD.
- EquipmentRentalInvoice getFinance/approveInvoice/voidInvoice correspond to GET id/finance and POST id/approve, id/void. Writer uses route ID, server-derived prices/status and journal ownership.
- EquipmentMasterAgreement getFinancialStatus/closeFinancially/reopenFinancially correspond to financial-status/close/reopen, body reason. TotalInvoices is a count; history action is Close/Reopen.
- Fleet list/dialog stays under /Fleet, with guarded prepareEquipmentId query for journal-source navigation. Existing /JournalVoucher/view/:id verified in JVs route registry. Preparation source resolver maps journal to equipment identity.
- Delivery invoice history mounts one child at a time: invoice detail, financial dialog or existing embedded receipt. Dirty reasons/preparation use shared discard confirmation; writes, dialogs and receipt editor block unsafe route departure.
- New services are included by existing assembly service scan. New DbSets and assembly-discovered EF configurations cover preparation, immutable billed-sheet snapshots and agreement financial log. Seven new frontend entry files are registered.
- Equipment/Asset maps ignore server-owned financial provenance/cutoff. New DTOs accept identities/date/token or reason, never caller money/account/status.
- No permission system was invented: current authenticated API and server state/ownership rules remain authority. Candidate restricted actions are prepare, post, void, collect, close/reopen; UI visibility alone does not secure them.

## Request, loading and cache evidence

| Actual consumer/source | Request and lifetime | Cache disposition / visible owner |
|---|---|---|
| EquipmentSalePreparationService.getSaved/getAssets | GET EquipmentSalePreparation/{equipmentId}, then assets?equipmentId only for successful missing preparation | Direct operational provenance/eligibility; no source cache opt-in. One local StateMessage, reading true on subscribe and finalize release, context/destroy cancellation, inline error/Retry |
| Preparation preview/confirm | POST preview marked NAVIGATION_READ_ONLY; confirm is independent protected write, token checked again | Direct valuation/policy. Local preview progress, global paired write LoadingService; disabled form, inline failure, reread saved immutable snapshot on success |
| EquipmentRentalInvoiceService.getFinance | GET EquipmentRentalInvoice/{id}/finance; verify invoice/delivery identities | Direct financial balance/capabilities; local StateMessage, no table mask; finalize/cancel/error/Retry and context clearing |
| EquipmentMasterAgreementService.getFinancialStatus | GET EquipmentMasterAgreement/{id}/financial-status | Direct financial state; same local dialog owner and cancellation. Successful decision rereads source |
| Finance writes | POST approve/void/close/reopen; existing DELETE draft | Global start/finalize owner, disabled/busy/aria-busy, one shared error owner via skip-error header; source failure retains reason, no silent state prediction |
| ReceiptService.getParties/getReceivables | GET Receipt/parties?receiptType=0 and receivables?partnerId=&branchId=&receiptId= | Direct operational/capacity sources, not cached. Exact source ID and latest due seed allocation once; mismatch/issue blocks save with Retry |
| Receipt saved detail/approval | GET Receipt/GetByWithNavigationsId/{id}, GET/POST id/approval | Local detail loading behind embedded modal, shared approval-cycle local reads; writes retain global owner. Post-save context changes to saved View, approval tab available |
| Existing reference choices | Fleet branch/model/type and receipt branch/payment method retain existing shared reference owners; receipt financial policy/settings/account reads keep documented direct contracts | Existing reference cache finite bootstrap/watch/draft preservation/invalidation remains in prior Fleet/Receipt reviews. No source cache eligibility changed; dialogs use data-free contextChanges to invalidate old identities and cancel pending reads |

Required routed list bootstrap/page loads stay with existing page loader; dialog reads render local shared status. Same-path query navigation uses existing loading service lifetime; no timer/new loader host. Source conformance inspected through actual components, service requests, signal/finalize paths and rendered templates. Runtime overlay visibility, simultaneous bootstrap and timing remain owner acceptance. Retained cache refresh stays silent under existing owners.

## Query/performance and indexes

No measured load-speed claim. Financial status bounds queries to one agreement and its related delivery/invoice/sheet IDs; finance reader uses batched invoice/debit/effective-allocation projections, not per-invoice SQL. Duration coverage and snapshot matching run in memory after finite reads. Sale unit eligibility uses server subqueries and batched preparation/JV reads; no per-unit DB loop. Preparation reads entries for one explicit asset and journals plus their complete batch snapshots to validate provenance; it must not page away financial history. Held-for-sale report override adds two bounded reads for the report's asset IDs and preserves ordinary report scope. Existing receipt editor bootstrap remains several independent reference/policy reads; source count alone is not a speed benchmark. Asset bulk update keeps serial per-row validation/save under one lock; no measured bottleneck is claimed and no parallel EF is introduced.

| Index / coverage | Disposition and costs |
|---|---|
| Preparation unique (SubscriptionId, EquipmentId), (SubscriptionId, AssetId), live filter IsDeleted=0 | Configured new invariants and exact source lookup. Equipment unique live (SubscriptionId, AssetId) with nonnull AssetId prevents duplicate linkage. Extra insert/storage cost; owner verifies actual schema/plan before deployment |
| Preparation unique (SubscriptionId, TransferJournalId), nonnull journal filter | Source journal linkage uniqueness and bounded resolver lookup; independent FK/convention journal index may overlap and must be checked in generated migration/SQL plan |
| Depreciation existing live unique (SubscriptionId, AssetId, Period) | Reuse for coverage/cutoff; no additional index justified from source. New account FKs use conventional indexes |
| Invoice snapshot unique (SubscriptionId, EquipmentRentalInvoiceId, TimeSheetId) | Required identity invariant and invoice snapshot lookup. TimeSheetId FK index serves reverse reference. Writes add one immutable child per billed sheet; financial log (SubscriptionId, EquipmentMasterAgreementId, Id) supports ordered history |
| Delivery, TimeSheet and allocations existing FK coverage | DeliveryNote already has EquipmentId/MasterAgreementId FKs plus unique live order line; TimeSheet has DeliveryId and invoice FKs; allocation owner has both detail/header FKs. No duplicate schema index added |
| Optional measured follow-up: DeliveryNote (SubscriptionId, MasterAgreementId, Id) INCLUDE (SaleOrderItemId, EquipmentId, DeliveryDate, ReturnDate, InvoicingStartDate), filtered IsDeleted=0 | Exact financial-status predicate/projection candidate; may overlap current FK and consume write/storage for every custody edit. Propose only if large-agreement SQL plan shows repeated scans/lookups; not configured/applied |
| Optional measured follow-up: TimeSheet (SubscriptionId, DeliveryId, ApprovalStatus, Id) INCLUDE (DateRangeStart, DateRangeEnd, HoursToInvoice, EquipmentRentalInvoiceId), filtered IsDeleted=0 | Candidate for hourly source/closure reads; compare existing DeliveryId FK coverage and selectivity, read benefit vs sheet-edit/index maintenance. No schema change without measured plan review |

InvoiceBase/EquipmentRentalInvoice use separate mapped tables; no index proposal combines inherited invoice-period columns with delivery FK in a nonexistent single table. Owner measurement: representative same tenant with 10/100/1000 source records per long agreement; cold and warm route/dialog runs, five samples, same SQL/data/network/build, report request count/payload, SQL logical reads/plan and p50/p95 before/after. Include empty, duration and hourly histories, void/rebill, allocations on both endpoints, and 0-cost prepared asset. Source-only execution cannot supply this timing/plan evidence.

## Schema and deployment handoff

Suggested owner migration name: CompleteSalesAndEquipmentRentalFinance (not generated).

- New EquipmentSalePreparation table with immutable cost/account/JV snapshot and restrictive relationships/indexes.
- Equipment AssetId, SalePreparationId, SaleStockCost decimal18,2 and SaleStockCurrencyId; restrictive relationships, explicit concurrency tokens.
- Asset HeldForSaleDate concurrency token.
- DepreciationEntry EffectiveThroughDate and nullable expense/accumulated account snapshot FKs.
- New EquipmentInvoiceTimeSheetSnapshot table with invoice/sheet IDs, hours decimal18,6 and source dates.
- New EquipmentAgreementFinancialLog table with agreement/action/reason and existing audit metadata.
- Appended persisted enum values EquipmentSalePreparation and equipment RentPerHour=5; no renumbering of existing values.
- Earlier pending operational rental/order/receipt migrations in the working tree are prerequisites, preserved without task edits. Review the complete owner-generated migration together with existing pending migrations.
- No automatic backfill, deletion or journal correction. Historic depreciation without provenance and old hourly invoices without source snapshots fail explicit reconciliation. Foreign-currency conversion is outside current base-currency accounting engine.

## Verification and owner acceptance

Source syntax: 82 TypeScript files, 24 external templates plus2 inline templates; no syntax diagnostics, duplicate imports or missing relative/source imports. New vocabulary: 43 finance keys and22 preparation keys, matching English/Arabic, dynamic Draft/Posted/Voided status keys checked. Seven new app entries exist without duplicates. Both backend resources parse as XML with zero duplicate keys. Roslyn parses 54 scoped backend sources without syntax errors; this is not semantic compilation. Scoped diff/whitespace and merge-marker review passed. All eight recipe packets Check passed; no generated packet edits.

Owner acceptance remains required: schema update and build, end-to-end API/UI authentication/cancellation/loading/RTL/theme, then financial examples:
1. Explicit asset link, missing historical evidence rejected, valid prior monthly postings, actual-day final depreciation, changing mapping after transfer, zero carrying value and duplicate confirmation.
2. Prevent new rental and competing sale/preparation/dep writers; prove rollback on a late posting failure.
3. Several sale stages including tax rounding residual; net/tax/total/journal reconcile exactly to contract, cost once, source account retained.
4. Draft/rejected Sales receipt does not settle; approval does; unapproval/void reopens an affected closed agreement, reservation capacity remains intact.
5. Duration proration and approved hours through actual return; duplicate draft reservation blocked; post, collect partial/final through receipt approval, no invoice/customer-total shortcut.
6. Void without allocations only, immutable old sheet snapshot retained, rebill released source, no posted deletion/reversal.
7. Financial close rejects custody/open demand/sheet/duration gaps/drafts/unsettled balances; close/reopen logs reason and actor, correction reopens or exposes discrepancy.

## Final conformance

| Requirement | Result |
|---|---|
| Frozen target API/domain and original screenshot responsibilities | Implemented source paths; commercial customer PO remains separate |
| Existing shared presentation/feedback and extraction gate | Adopted actual shared owners; no competing wrapper/palette/cache. Valuation and finance dialogs share presentation owners but retain source-specific decisions; no additional generic business component justified |
| Overrides | Equipment guards preserve root child/map/save ownership; Asset overrides serialize valuation/history transitions; Equipment invoice update/delete and sheet/delivery overrides enforce source/closed/settlement rules; existing list/detail projection overrides retained. No new generic posted delete |
| Registration/authentication/route/provider wiring | Assembly scan, DbSets/configs, controller route/interface, frontend models/services/imports/entry files and verified journal/Fleet routes reconciled |
| In-app guide | Sales and Equipment Rental guides updated at existing /UserGuide/sales and /UserGuide/equipment-rental routes/sidebar entries, including preparation, rounding, actual collection and close/correction |
| Financial completeness claim | Requested remaining paths implemented in source. Deployment/runtime/accounting examples and SQL measurement not yet verified; no blanket production-ready claim |
