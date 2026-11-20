<!-- Part of UI block 19: see ../19-validation-messages.md. Same status and authority as the block. -->

### Money and tax in forms

> Money, tax and derived-value rules for every form. Derived row cells: block 14 *Derived cells*.

**Exact monetary text (2026-11-04).** When a frozen currency contract transports
money as decimal strings, retain the string through form, payload, display and
export. Use `financialTextValidator` / `isCurrencyAmountText` and
`isExchangeRateText` from the existing `financial-number.util` owner. Money has
at most16 whole digits and currency scale0–6; dated rates are positive with at
most12 fractional places. Reject excess entered scale, exponents, grouping,
whitespace and plus signs before conversion; never pass exact text through
Number or a numeric input merely to validate it. Requiredness/sign/domain bounds
stay with the consuming form. Numeric consumers retain their existing validators
until their complete producer/consumer matrix adopts the text contract.

`sumCurrencyAmountTexts` uses BigInt with an explicit scale and checks the final
range. `formatMoney` chooses exact BigInt formatting for string input;
`MoneyPipe` accepts optional currency decimal places (default2), and shared
`DataTableColumnFormat.moneyDecimalPlaces` accepts that precision or a row
function for both `dataTableCellText` and export. Display rounds away from zero
without changing saved input. Invalid/out-of-range text renders blank, never a
fabricated zero. These helpers cannot recover digits already lost by a numeric
DTO. Local grid numeric sorting/filtering remains a separate adoption boundary;
the exact display/export path alone does not establish its conformance. The
dated-rate dialog is the first shared text-validator consumer; full monetary
documents remain gated by their frozen contracts and owner runtime acceptance.

`currencyRatioText` previews amount × numerator ÷ denominator with BigInt
coefficient/scale arithmetic and a single half-away-from-zero rounding at the
chosen result precision. It accepts exact text and returns null for invalid,
zero-divisor or out-of-range results. `allocateDocumentTaxTexts` groups rounded
amounts by the bounded percentage rate, taxes each group once, and allocates its
rounded tax using the first largest absolute line as remainder owner. If positive
rounded shares exceed a positive total, it truncates non-remainder shares toward
zero before assigning the remainder. These owners match BE15's exact allocator;
screens retain their calculation preview role and do not submit derived values.
Percentage/quantity conversion to text is domain-bounded; never reconstruct money
from Number. These helpers apply only to fully adopted exact document contracts.

**Document currency selection owner (2026-11-04).** Extend the existing
`DocumentCurrencyComponent` for connected document editors instead of adding
another currency field. It remains read-only until the document's DTO, service,
snapshot persistence and consumers adopt the frozen selection contract. Its
editable mode owns lookup bootstrap/watch, explicit preview/confirmation,
stale-request cancellation and `selectionChange`; the consuming editor supplies
current exact amount texts and applies accepted results. Saved snapshots take
precedence over partner defaults. `currencyLocked` fixes a source document's
currency while allowing date/rate preview; `editable=false` fixes the complete
selection. The editor protects Save through `selectionValid()` and composes
`canDeactivate()`. Do not bind the component's own disabled state to its
`pendingChange` output: the preview/reset actions must remain available. A failed
initial quote must leave header inputs available for correction. Exact amounts
and currency precision also flow through the existing source-document picker.
This UI contract does not authorize accounting transitions or changing linked
document currency; their financial owners remain authoritative (BE15).

For a source-owned base-currency amount, pass no partner identity and set
`requiredBasePolicy=true` on this same read-only owner. Its policy read and
error/Retry state must resolve before both Save UI and handler accept the
draft. Keep confirmed same-context readiness when a temporary tab unmounts the
display; invalidate it when the session context changes and require reopening
the editor. This is an explicit source contract, not a fallback that relabels
foreign amounts as base. Booking/Rental/Lease deposit dialogs adopt it
(2026-11-05); runtime acceptance remains pending.

**Read totals and comparison adoption (2026-11-04).** The optional `aggregate`
argument of `sumCurrencyAmountTexts` permits a read total beyond a single
amount's16-whole-digit limit; every input is still strictly bounded/validated.
Display that computed total with `formatExactMoney(total,places,true)` and
SummaryCards `format:'text'`. Ordinary calls retain the existing amount limit.
Do not use aggregate display as a write validator. UI5/6 own `exactMoney` grid
adoption and `moneyAggregate` read columns. Monetary comparison units and raw
filter strings remain separate from formatted grouping and currency labels.

**Shared approval amount (2026-11-04).** An adopted exact-money producer passes
`DocumentApprovalContext.amount` as decimal text together with
`moneyDecimalPlaces` and `currencyCode`. The shared approval reader uses these
through MoneyPipe; do not convert the amount to Number or force the base
currency precision. Legacy numeric producers retain their current path until
their connected contract adopts exact transport. This presentation metadata
does not change approval eligibility or accounting effects.


A form that shows a tax rate, a tax amount or a total with tax takes the rate from
`TaxSettingsService` (`src/app/modules/shared/service/tax-settings.service.ts`):
`load()` once in `ngOnInit` (with `takeUntilDestroyed`), `ratePercent()` for the
default of a new document (only while the control is not dirty), `previewTax()` for
display. The preview never replaces the server result, and the payload sends the rate
only where the contract has one — the backend accepts only the settings rate, or 0
when tax is optional (backend block 5, *Tax in any service*). No literal `5`, `0.05`
or `15` for tax in feature code.

`TaxSettingsService.previewTax(amount, ratePercent?, decimalPlaces?)` delegates
to the shared `roundMoney` owner. Its optional precision defaults to two for
existing callers; a screen with a resolved currency policy passes that policy's
precision for its preview. This never changes the backend's tax authority or
rounds an entered monetary amount in place of rejecting excess input scale.

**Preview rounding matches the backend.** A money preview rounds with `roundMoney`
(`shared/utils/financial-number.util.ts`, half away from zero) exactly where the backend rounds.
Its shared `roundDecimal` owner interprets the represented decimal coefficient
and exponent and uses integer quotient/remainder midpoint rounding. Do not add
an absolute `Number.EPSILON` before binary multiplication: values such as10.075
can still round toward10.07 instead of10.08 at two places. The correction applies
to current previews/display, not persisted amounts; floating-point arithmetic
before rounding remains approximate and never replaces the backend result.
General helper precision is an integer0..100; policy consumers still own their
approved narrower scale (money/quantities0..6). Equipment Rental's shared-policy
review established this source correction on2026-10-30; numeric/runtime acceptance
remains owner verification, not a test/build claim.
The document tax is **per tax rate, rounded once** (owner decision D4-4): use
`documentTax(lines)` from the same file, the preview twin of `VatPolicy.CalculateDocumentTax`.
When rows display their own tax or gross, use `allocateDocumentTax(lines, decimalPlaces)`
from that shared file, matching `VatPolicy.AllocateDocumentTax`: allocate each rate's rounded
tax in proportion to its line amounts; the largest absolute amount takes the remainder and
the first line wins a tie. A zero-net rate group has zero allocated tax. The row shares must
reconcile to the document tax. Never sum independently rounded per-line taxes. Screens that
still preview per line move with their backend in their review. Job Invoice on Customer is
the current routed consumer, and Close Job's affected invoice row preview also reuses it;
the backend Workshop-linked MiscellaneousInvoice uses the same
allocation and persists matching rows/header totals. Source conformance is not runtime
acceptance.

**Positive allocation remainder (2026-10-15).** The shared Angular
`allocateDocumentTax` also mirrors `VatPolicy`'s exceptional all-positive branch:
when rounded non-remainder shares exceed a nonnegative rate total, floor those
shares to currency precision and give the largest source the exact remainder.
Keep ordinary rounded allocations and signed/zero-net behavior unchanged.
Purchase Requests exposed the preview mismatch with many tiny positive lines;
all current helper consumers inherit the correction. This changes no tax rate,
document tax, payload or backend owner. Source-only; owner numeric/runtime
acceptance remains pending.

Use the backend's base-currency ledger precision for these monetary previews, not a
literal two or Common settings' display precision. Job's context returns `moneyDecimalPlaces`
from `FinancialNumberPolicyResolver` (base `Currency.DecimalPrecision`); its input scale and
step use that value. Display precision remains the money/word formatting owner's setting.

**Amount in words is presentation.** Reuse `amountInWords` from
`shared/utils/amount-in-words.ts` when the scoped document needs the existing English
voucher wording. Pass `SettingsCommonModel` / `CommonDTO` currency name, decimal-currency
name and display precision; never copy a feature converter or assume Dirham/Fils from a
screenshot. This helper does not write a total or replace backend pricing. Job Invoice on
Customer adopts it; legacy voucher converters migrate only when those screens are scoped.
Arabic number-word conversion is not supplied by this English presentation helper.

For adopted decimal-text contracts, use the companion `amountTextInWords` from
the same owner with the document's currency labels and precision. It keeps the
whole and fractional amounts in BigInt; only each bounded three-digit English
word group becomes Number. Invalid/negative money or missing labels renders
blank. A foreign document uses its actual currency label/code and fractional
unit, never the base currency's name. Receipt is a connected consumer; no
persisted amount is calculated by this presentation helper. Runtime wording
and numeric acceptance remain owner verification.

**The rate is not an input.** A tax-rate control is `readonly` (the rate it shows is the
settings rate or the document snapshot). Only when `taxSettings.isTaxOptional()` it becomes
a `<select>` with two options — the settings rate and `0` — the only values the backend
accepts; never a free number field. The feature stylesheet styles `select` like its inputs.
Purchase forms take the rate from the supplier (`SupplierService.getTaxRate`, settings rate
when tax-registered, otherwise 0); a GRN has no tax input; a bill shows line tax read-only and
accepts only a `taxAdjustment` of ±0.05 (supplier rounding); a trip tax amount is a read-only
`previewTax` unless Limousine settings allow tax editing.

**Check:** `app-field-error` under every validated control, no feature error markup or
helper · error appears only after touch or submit · every `<form>` has
`[formGroup]` · shared keys, not literal
English · one required marker per label, not duplicated by a global rule ·
every possible validator maps to the right key · `markAllAsTouched()` before the
first invalid return · focus moves to the first invalid field · tax defaults and
previews from `TaxSettingsService`, no literal rate · tax rate `readonly`, or a
settings-rate/0 select when optional.

---
