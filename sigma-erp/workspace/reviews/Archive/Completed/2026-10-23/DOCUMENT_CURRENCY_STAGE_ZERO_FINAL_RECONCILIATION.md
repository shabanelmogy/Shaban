| | |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-21 |
| Contract | `DOCUMENT_CURRENCY_STAGE_ZERO_CONTRACT_FREEZE.md` |

# Document currency — final source reconciliation

The owner decision is a read-only linked transaction currency until dated exchange rates exist. A new monetary document takes its currency from its source, then from its supplier/customer, with company base as the fallback. Existing null currency remains a legacy base amount. The server owns the value; Angular does not send an editable currency selector. Ledger posting and base-currency allocation refuse foreign amounts until the conversion service exists.

| Contract/path | Producer | Consumer | Final source evidence | Status / action |
|---|---|---|---|---|
| Purchasing | Supplier/source → PR, PO, GRN, Bill and Purchase Return services and root `CurrencyId` | Detail DTOs and read-only editor display | Source inheritance, saved code and legacy base fallback are represented in the services, maps and Angular editors; Bill GRN source rows carry currency | Source reconciled; migration/runtime pending |
| Sales | Customer/source → SalesQuotation, SalesAgreement, SaleOrder and InvoiceBase services | Quotation, agreement and invoice views/editors | Root currency and detail projections use the customer or source; generic invoice and specific invoice viewers show saved code | Source reconciled; migration/runtime pending |
| Settlement | Customer/supplier/source → Receipt, Payment, CreditNote, DebitNote services | Settlement detail screens | Create resolves currency on server, update preserves it, and screens display linked code without an input; foreign allocations are gated | Source reconciled; migration/runtime pending |
| Generated deposits/payments | Rental, lease, booking, customer-deposit and payroll generation | Receipt/Payment and deposit dialogs | Generated vouchers and receipts/payments are stamped with customer/source/base currency; deposit dialogs no longer print a fixed `AED` | Source reconciled; runtime pending |
| Manual journals | Company base and saved journal currency | Journal editor and posting engine | `JournalVoucherService` stamps base on create and preserves saved currency on update, rejecting a different client value; editor displays code read-only | Source reconciled; runtime pending |
| Posting | Journal voucher header currency | Base-currency debit/credit lines | `JournalVoucherResolver` checks both immediate post and draft-to-post; foreign currency cannot post before exchange conversion | Source reconciled; runtime pending |
| In-app help | Updated purchasing, sales, settlement, invoice, rental and lease topics | Existing UserGuide reader/menu entries | Bilingual topics explain linked read-only currency and the temporary posting restriction; existing module routes are reused | Source reconciled; visual acceptance pending |

## Source checks and limits

- The applicable recipe drift check returned OK for all generated packets, including Phase 6. The scoped backend and frontend `git diff --check` each returned zero; scoped merge-marker searches found none. The source diff for currency fields, maps, services, editor bindings, translations and guides was reviewed separately in both repositories. Existing unrelated working-tree changes, including prior owner migrations and model snapshot edits, were preserved.
- No build, test, lint, migration, database command, browser verification, commit or push was run under `AGENTS.md`. Compile, runtime, financial totals, print/RTL and actual database behavior remain owner verification.
- A migration is required for the nullable currency columns added to purchasing, sales, invoice and settlement roots. Suggested owner migration name: `AddTransactionCurrencyToMonetaryDocuments`. Review generated columns and foreign keys before applying; do not treat historical null as an unknown foreign currency.
- The preliminary stage does not convert amounts, capture rates, calculate exchange differences or enable foreign-currency posting. The deferred FX plan owns those changes. Existing rental/lease deposit amount-in-words uses the configured company currency name and is not a foreign-currency wording contract; review it with the FX work before posting foreign deposits.

## Owner verification

1. Generate and inspect the migration, then apply it in a development database. Confirm legacy rows remain readable as base currency.
2. Build both projects and open representative new/saved PR → PO → GRN → Bill and quotation → agreement → invoice paths, plus Receipt, Payment, Credit/Debit Note, manual JV and generated rental/lease/booking deposits.
3. Check that changing a supplier/customer after saving cannot silently change a document currency. Check that changing a source document preserves its currency on generated documents.
4. Try a foreign-currency draft and verify that approve/post and base-currency allocation fail with a clear message, while base-currency documents continue their normal cycle.

Suggested commit messages: backend `Bind monetary documents to linked currency and block foreign posting until FX`; frontend `Display linked document currency read-only across ERP editors`.

The earlier frozen-contract workstreams in this chat used bounded backend and frontend inventory/implementation agents for separate files; their shared output was integrated and reconciled by the root. No further agent was spawned for this final source pass because the remaining journal/deposit checks were sequential. Agent model identifiers are not available in this handoff record and are not inferred.

## Owner compiler feedback — 2026-10-21

The owner supplied 143 active C# diagnostics: four `CS0246` errors on `Currency` navigations declared in Helpers (`SalesAgreement`, `SalesQuotation`, `InvoiceBase`, `SaleOrder`), followed by 129 `CS1061` and ten `CS0117` member errors in dependent projects. On the owner's follow-up, the four declarations now use `Currency` with a `using SiGma.Helpers.Models.Administrations;` at the top of each file, instead of repeating the fully qualified type beside each property. The existing `EquipmentMasterAgreement` navigation in `SaleOrder` follows the same file-level import style. A scoped scan of all 17 currency navigation declarations in `SiGma.Helpers/Models` found no other unqualified `Currency` without a local namespace import. This fixes the source-level namespace omission; only a fresh owner rebuild can establish whether every dependent diagnostic clears.

The reusable rule was added to canonical backend blocks 1 and 18 and synchronized into `sigma-screen-refactor/SKILL.md` with a revision-history row. The owner refined the style to prefer file-level `using`; backend block 1 and the skill now say so explicitly. The generator refreshed all eight dependent plan/phase packets; `Generate-SigmaRecipes.ps1 -Check` returned OK for each. Generated packet bodies and reference roles were not manually edited. No build, tests, migration or database command was run.
