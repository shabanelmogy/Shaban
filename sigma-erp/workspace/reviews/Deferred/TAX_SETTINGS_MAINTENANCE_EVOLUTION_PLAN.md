# Tax Rate from Program Settings — Maintenance / Evolution Plan (deferred)

سُجلت نقاط تقرير الإقرار الضريبي بتاريخ 2026-11-18 في [معلّقات التصنيف والاسترداد](TAX_RETURN_CLASSIFICATION_AND_RECOVERY_REVIEW.md)، وتشمل إمارة التوريد وأهلية استرداد ضريبة المدخلات والتسويات وعملة الإقرار وبيانات المنشأة. هذا سجل مستقل لاستئناف التقرير.

| | |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-09-29 |
| Decision | Owner: from now on the tax is read from the program settings ("بعد كده هنقرا الضريبة من اعدادات البرنامج"); implement with the invoices / vouchers screen reviews |
| Related | `JOURNAL_ENTRY_CREATION_AND_ROUNDING_FEATURE_REVIEW.md`, backend block 15 rule 8, `CURRENCY_EXCHANGE_RATE_MAINTENANCE_EVOLUTION_PLAN.md` (currency decimals) |

## Current state (2026-09-29)

| Where | Rate used today |
|---|---|
| `SiGma.Helpers/Helpers/VatPolicy.StandardRatePercent` | **5** (constant) — invoices, bills (default), credit/debit notes, card settlement |
| `SettingsCommonModel.TaxPercentage` | Setting exists, default **15** (Saudi) — **not read** by any posting document |
| `SettingsCommonModel.TaxInclusion`, `IsTaxOptional`, `AllPricesWithoutTax` | Settings exist, not applied to invoices/vouchers |
| `ChargeSettings.Taxable` | Per-charge taxable flag, not applied to invoices/misc invoices |
| `ApplyTaxOnTollFineParkingSurchargeForTaxExemptedCustomers` | Exempt-customer rule, not applied to postings |
| `Job.DefaultTaxRate`, `JobEstimation.DefaultTaxRate` | **0.05** as a *fraction* (workshop) |
| `RentalAgreementService.TemporaryAgreementTaxPercent`, `LeaseAgreementService` | Own constants |
| `SettingsCommonModel.CurrencyDecimals`, `CurrencyCode` | Duplicate of the `Currency` table (base currency precision) |

Two conventions coexist (percentage 5 vs fraction 0.05); the invoice and bill bugs of 2026-09-29 came from mixing them.

## Target design

1. **One tax service** (`ITaxPolicyService`, scoped) reading `SettingsCommonModel` for the tenant: `GetStandardRatePercentAsync()`, `IsTaxInclusiveAsync()`, `IsTaxOptionalAsync()`; later rate per tax code if needed.
2. **One convention: percentage** (5 = 5 %). Workshop fraction constants become percentages through the same service.
3. `VatPolicy.CalculateTax(amount, ratePercent, decimals)` stays the only calculation (rounded per line, total = amount + tax); `StandardRatePercent` is removed or kept only as the settings default.
4. **Inclusive prices** (`TaxInclusion`): amount = round(gross ÷ (1 + rate)), tax = gross − amount, so the line total equals the entered gross.
5. **Taxable flags**: a charge with `Taxable = false`, or an exempt customer, gets rate 0 (with the toll/fine/parking exception setting).
6. **Snapshot the rate on the document** (`TaxPercent` on invoice / line) at creation, so a later settings change never re-prices saved documents or their journals.
7. Fix the settings default to the business rate (5 for UAE) and validate 0–100.

## Impact map

`SettingsCommonModel` + its settings screen, new `ITaxPolicyService`, `VatPolicy`, `InvoiceBase`/`InvoiceService`, `Bill`/`BillDetail`/`BillService`, `CreditNoteDetail`/`CreditNoteAccountDetail`/`CreditNoteService`, `DebitNoteDetail`/`DebitNoteService`, `MiscInvoiceItem`/`MiscellaneousInvoiceService` (+ Close Job lines), `CardTransactionBankTransferDetail`/service, `Job`/`JobEstimation` + services, Rental/Lease agreement tax constants, Angular previews that hard-code 5 (Receipt, Purchase Order, notes). Migrations: a `TaxPercent` snapshot column per taxed document/line.

## Open decisions for the owner

1. Default rate for new tenants (5 UAE / 15 KSA / per country)?
2. Snapshot the rate per document (recommended) or always read the current setting?
3. Is inclusive pricing (`TaxInclusion`) used by any business line now?
4. One standard rate only, or tax codes (standard, zero-rated, exempt)?

## Implementation (2026-09-29)

Owner decisions: default 5 % (UAE); the settings rate only, 0 when tax is optional; inclusive prices supported in the foundation only.

| Area | Change |
|---|---|
| Foundation | `ITaxPolicyService` / `TaxPolicyService` / `TaxSettingsSnapshot` (`SiGma.Business/Resolver`, scoped, cached per request): `GetAsync`, `GetStandardRatePercentAsync`, `ResolveRateAsync`, `ResolveTaxAmountAsync`. `VatPolicy.DefaultRatePercent = 5`, `CalculateTax`, `SplitInclusive`. `JournalVoucherResolver.GetTaxRatePercentAsync` / `ResolveTaxRateAsync` delegate. Settings default 15 → 5 (entity + VMs), update validates 0–100 |
| Vouchers | Invoice (rate snapshot `TaxPercent`), credit/debit note lines (`TaxPercent`), Bill lines (`TaxRate` snapshot), Miscellaneous Invoice lines (`TaxPercent`, tax derived; requested rate via `MiscInvoiceItemAdd/UpdateVM.TaxPercent`), Close Job lines (requested rate passed through), card settlement VAT |
| Purchases | Purchase order line rate resolved; purchase request tax derived; goods received note fraction 0.05 → settings percentage, rounded |
| Agreements | Rental (`TemporaryAgreementTaxPercent` removed), Lease (add, update, extend, extend-rate-period), Booking, tariff calculation (`Agreement.DefaultTaxPercent` now only a fallback alias) |
| Workshop | `Job` / `JobEstimation` fraction 0.05 → percentage from settings, rounded; options/closing DTOs show the settings rate |
| Sales | Sales quotation item rate resolved; Sales Agreement manual tax (was a fixed **15 %**) uses settings; rental quotation item rate (`TaxPercent`, was hard-coded 5 in a computed property) |
| Limousine | Quotation and trip finish: settings rate on charges, or the entered amount when `AllowTaxEditingInLimoTrip` |
| Frontend | `shared/service/tax-settings.service.ts` (`ratePercent`, `isTaxOptional`, `previewTax`); defaults/previews in Rental Agreement, Lease Agreement, Closed Lease (was 15), Rental Quotation, Sales Quotation, Limo Quotation, Receipt card preview |

Not changed: data import keeps the file rate (historical data); tax-inclusive pricing and `ChargeSettings.Taxable` / exempt-customer rules are applied screen by screen.

Migration (owner): `Add-Migration AddTaxPercentSnapshots` — nullable `TaxPercent` on invoice tables (`InvoiceBase`), `CreditNoteDetail`, `CreditNoteAccountDetail`, `DebitNoteDetail`, `MiscInvoiceItem`, `RentalQuotationItem`. (`AddIsGeneratedToJournalVouchers` is still pending too.)

## Read-only tax rate in forms (2026-09-29)

Owner: "طالما الضريبة غير قابلة للتعديل يبقى خليها readonly". The rate control is `readonly`; when tax is optional it is a select of the settings rate / 0 (UI block 19). Applied to Rental Agreement, Booking, Lease (details, extend, extend-rate), Closed Lease, Close Job lines, Sales Quotation lines and the legacy Sales Quotation Item form.

## Purchase and limousine tax entry (implemented 2026-09-29)

Owner decision 2026-09-29 ("اعمل المناسب" on the reviewer recommendation). Rule: **sales tax is ours to calculate; purchase tax follows the supplier's tax invoice; a document that is not a tax invoice only estimates.**

| Screen | Document | Target behaviour |
|---|---|---|
| Trip Booking (Limousine) | Sales | Tax calculated, not editable: settings rate (or 0 when optional). Entered amount only when `AllowTaxEditingInLimoTrip` (already enforced by `ResolveTaxAmountAsync`); the input is `readonly` otherwise |
| Purchase Order | Commitment, not a tax invoice | Rate `readonly`, decided by the **supplier**: supplier with a TRN (`Supplier.Vat`) → settings rate; without a TRN → 0. Tax amount derived |
| Goods Received Note | Receipt of quantities, not a tax document | No tax input; rate/amount copied from the purchase order for display and valuation only |
| Bill (supplier invoice) | The purchase tax invoice | Rate from the supplier as above; tax amount calculated per line but **adjustable** so recoverable VAT equals the supplier's invoice; the backend rejects a total adjustment above **0.05** (supplier rounding on the invoice total vs our per-line rounding). The adjusted amount is what posts to input VAT |

Decisions taken (reviewer recommendation accepted by the owner): (1) a supplier without a TRN gets rate 0 on purchase orders and bills; (2) bill tax adjustment tolerance = 0.05 per bill, validated on the server. Impact when implemented: `PurchaseOrderService.ApplyTaxRatesAsync`, `GoodsReceivedNoteService`, `BillDetail.CalculateTotals` / `Bill.Recalculate` + `BillService` (tolerance and adjusted tax into the journal), `TripBooking` finish, `ITaxPolicyService` (a supplier-aware rate method), the four Angular forms, and a check that `Supplier.Vat` is the TRN field. Migration only if the bill keeps both calculated and adjusted tax.

**Implemented 2026-09-29** (owner: "عدلهم الوقتى بالمرة"):

| Layer | Change |
|---|---|
| Tax service | `GetSupplierRatePercentAsync` (TRN or VAT and not `TaxExempted` → settings rate, else 0; cached per request), `ResolveSupplierRateAsync`; `ResolveTaxAmountAsync`: an entered 0 means no tax only when the calculated tax is not 0 (optional tax), otherwise the calculated tax is used |
| Purchase order | Line rate resolved with the supplier rate; frontend loads it from `GET Supplier/TaxRate/{id}`, the rate is read-only (select rate/0 when optional) |
| GRN | Tax derived from the supplier rate; the frontend tax and amount-with-tax are read-only (default no longer 1 with `min(1)`) |
| Bill | `BillDetail.CalculateTotals(ratePercent)` uses the supplier rate on every save; `Bill.TaxAdjustment` (±0.05, domain-validated) goes to the last taxed line so the journal input VAT equals the supplier invoice; `BillAdd/UpdateVM.TaxAdjustment`, `BillDetailVM.TaxAdjustment`; frontend line tax read-only + header *Tax adjustment* field (en/ar) |
| Trip booking | Tax resolved on add and update too (was taken from the client); frontend tax is a read-only preview of charges × settings rate unless *Allow tax editing in Limo trip* |
| Legacy child forms | PO / GRN / Bill detail forms: tax input read-only |

Migration (owner): `Add-Migration AddBillTaxAdjustment` — nullable `TaxAdjustment` on `Bills`.
Known limitation: the Bill screen is a legacy form (its *Add detail* button is never enabled — `detailsToggle` stays false); it needs its own screen review.
Owner verification (purchases): supplier with TRN → PO/GRN/bill at 5 %; supplier without TRN → 0; bill adjustment 0.03 → accepted and the journal Tax Paid = line taxes + 0.03; 0.08 → refused; trip booking with charges 100 → tax 5 (read-only), with tax editing allowed → the typed amount.

Owner verification: set Settings › Common tax to 5; create a rental agreement, lease, booking, sales quotation, purchase order, invoice, bill, miscellaneous invoice → 5 % everywhere; send another rate (e.g. 10) → refused; enable *tax optional* and send 0 → accepted; change the setting to 15 and edit an old invoice → keeps 5.
