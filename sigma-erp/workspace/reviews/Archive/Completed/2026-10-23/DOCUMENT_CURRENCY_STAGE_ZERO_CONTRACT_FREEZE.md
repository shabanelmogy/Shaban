| | |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-21 |

# Document currency — pre-exchange-rate contract

## Owner decisions and boundary

- Monetary ERP documents carry a transaction currency. The supplier/customer currency is the initial linked currency; a document generated from another document inherits the source currency. The Angular editor displays the linked currency read-only. Editing/selecting another currency is deferred until exchange rates are implemented.
- Journal creation/conversion has one future owner: the service creating journal entries. This stage does not perform conversion, infer a rate from the static CurrencyToBaseRate, or reinterpret foreign amounts as base amounts.
- Until conversion exists, a journal with a non-base CurrencyId cannot be posted. Drafts may retain their currency, but actions that post must fail safely. Existing null CurrencyId represents the historical base currency; no history is rewritten.
- The owner runs Add-Migration. Agents must not edit migrations or the model snapshot.

## Existing-state evidence and impact

| Area | Current owner/source | Gap and target |
|---|---|---|
| Currency preference | Supplier.CurrencyId; PartnerBillingInfo.CurrencyId; Currency.IsBase | Keep preferences; use as initial document currency, fall back to base. |
| Purchasing | PurchaseRequest, PurchaseOrder, GoodsReceivedNote, Bill | Extend roots and detail contracts with currency; inherit PR→PO→GRN→Bill and Job→PO. |
| Purchase return | PurchaseReturn.CurrencyId already persisted | Keep; make editor read-only and block foreign posting. |
| Sales | SalesQuotation, SalesAgreement, InvoiceBase-derived invoices | Extend roots/contracts; inherit source when generated. |
| Settlement | Payment, Receipt, CreditNote, DebitNote | Extend roots/contracts; inherit linked source where present. |
| Journal | JournalVoucher.CurrencyId, JournalVoucherResolver | Keep header field; block non-base posting in both direct save/post and draft→post. |
| Frontend | Some editors show company currency from CommonService; most show none | Display saved linked currency, fall back to base only for legacy null. No editable selector. |
| Reports | Journal lines carry base Debit/Credit only | Do not claim foreign-currency accounting until rate, conversion, foreign amounts and revaluation are implemented. |

## Decision matrix

| Option | Decision | Reason |
|---|---|---|
| Persist partner/source currency and display read-only; gate foreign posting | Selected | Honors owner's document-currency request while preserving ledger correctness. |
| Make a cosmetic currency dropdown without persistence | Rejected | Would not bind amounts to a stable transaction currency. |
| Post foreign raw amounts as base | Rejected | Misstates balances and tax. |

## Contract and rollout

1. Add nullable CurrencyId to the monetary roots missing it. Legacy null means base. DTO detail/list expose it only where displayed or needed; add/update clients do not own currency. Server resolves and validates linked currency, and source-derived documents inherit it. Once saved, the linked currency is immutable in this stage.
2. When the parent currency is foreign, do not post a journal or apply base-currency allocations. Allow only safe draft persistence in workflows where Save has no posting effect.
3. Angular displays the resolved/saved code read-only, including source-generated documents. A linked foreign currency is visible but cannot be altered. The server remains the authority.
4. Owner runs a migration named `AddTransactionCurrencyToMonetaryDocuments` and reviews nullable columns/defaults/backfill before executing. Do not deploy entity changes before the migration.
5. FX service, rate snapshot, conversion, settlement differences, foreign journal-line amounts and currency editing remain in the deferred currency plan.

## Evidence and verification

Master 4/5/7; backend 1/2/4/15; UI 1/13/19; PLAN-00 and PHASE-01/03/04/06. Backend financial-document reference: InvoiceService; editor-shell reference: Workshop/Job editor. Source review checks entity/DTO/service/Angular pairings and every posting entry point. Owner build, migration, database, runtime and browser checks pending under AGENTS.md.
