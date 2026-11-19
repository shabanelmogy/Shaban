# Complete account setup — financial defaults

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-23 |

Owner approves full new-chart coverage: dedicated amortization/investment/dividend/
provision accounts, capital contributions/withdrawals and other current balance
rows, known prepaid-expense pairs. Preserve customer settings on rerun. This is
the exact financial-default handoff paired with the supported-links freeze.

## New-chart supplement owned by root

Create only on a genuinely new chart, after taxonomy exists; add posting children
without changing existing grouping flags. Exact codes:
petty cash1-01-001-002-001; default AR1-01-002-001-001; physical inventory children
1-01-003-001-001/-002-001/-003-001; staff advances1-01-004-002-001;
fixed asset children1-02-002-001 through1-02-006-001; intangible1-02-008;
investments1-02-010; AP children2-01-001-001/-002-001/-003-001;
salary/deduction leaves2-02-001-001/-002-001; loan leaves2-05-001-001/-002-001;
general current provisions group2-06 +leaf2-06-001;
dividends paid3-04; dividends received4-02-003; amortization5-02-007;
loan interest5-03-002-001. Existing approved Hrm provision groups2-02-003/
2-05-003 are ensured separately, with their generated exact linked children.
All use actual tenant type/group IDs, fixed matching category/subgroup and valid
active detailed role. Dedicated named types for Amortization(Expenses/Admin),
Intangible Assets(NonCurrentAssets/NonCurrentAssets), Investments(same role),
Provisions(CurrentLiabilities/CurrentLiabilities), Dividends Received(OtherIncome/
OtherRevenue), Dividends Paid(Equity/Equity) reuse existing compatible exact named
definitions, otherwise create them. No new enum or financial group/subgroup.

## Explicit financial default seed owned by settings worker

Add IFinancialReportSettingsService.EnsureDefaultChartAsync(ct) -> Result. It is
an explicit seed action after new chart/links exist. Under the existing unique
header guard and caller transaction, require no existing settings header;
existing header means preserve it and return success unchanged. A new header
receives current9+5 Income/Balance defaults and full cash defaults in the same
aggregate save. GET never seeds. Normal Ensure retains previous behavior for
ordinary explicit initialization; root uses this new method for new chart only.

Cash scope is exactly Cash on Hand, new Petty Cash posting leaf and three actual
seed bank GL leaves. EXCLUDE Stock Transfer Bank Clearing. Existing bank GL names
are chart examples; no Bank master/number/currency is invented. Include new actual
Bank/PaymentMethod posting links created for existing master records only when
they are within the cash/bank subtree and are not the known clearing account.

Default cash mappings are actual active posting account IDs, disjoint across
every row; AllowedTypeIds must include exact selected type IDs and pass existing
validator. Keep original13 purpose keys with these assignments:
depreciation5-01-001; amortization5-02-007; receivables(all Receivable posting
leaves); payables(all Payable posting leaves); inventories(all inventory subtree
posting leaves including known Stock/GRN/StockTransfer clearing);
provisions2-06-001; interest-paid5-01-014 +5-03-002-001 +prepaid-interest;
tax-paid5-01-011 +prepaid-taxes; assets(all fixed-asset cost leaves +intangible,
excluding accumulated depreciation/investments) plus linked asset-sale revenue/
expense and sale-vehicle-cost; investments1-02-010; dividends-received4-02-003;
long-term-debt(the two loan posting leaves); dividends-paid3-04.

Add explicit closed-method rows: capital-movements(Financing/CashMovement,
OwnerCapital3-01); employee-benefits(Operating/CashMovement, exact three HRM
Provision roles and their matching Expense roles). The existing profit adjustment
for CashMovement expense targets handles accrual versus cash settlement; no new
formula is introduced. Add other-current-assets/other-current-liabilities rows
(Operating/WorkingCapitalChange) for remaining current-category posting leaves
after all explicit targets and cash scope, avoiding duplicate IDs. Add remaining
noncurrent liabilities as Financing/CashMovement when present, excluding already
mapped benefit/loan targets. Noncash/mixed-source cases keep existing diagnostics
and reconciliation difference; seed configuration does not promise every complex
disposal/benefit journal is unambiguous or change cash attribution calculations.

Known PrepaidExpense pairs are explicit approved defaults: prepaid taxes→TaxPaid,
prepaid interest→InterestExpense, Darb Prepaid→DarbExpense, Tolls Prepaid→TollsExpense.
Use current General link/account IDs, validate source Prepayment/target Expense,
insert absent/null only and preserve any nonnull mapping. Coupon/prepaid balances
without a known expense purpose remain user-configurable, not guessed pairs.

Every required exact target/type/cash account must validate; fail seed action
with actionable errors on missing new-chart defaults rather than silently skip.
Income/Balance use persisted subgroup definitions as already implemented.
No schema change beyond pending statement-component migration. No build/tests/
DB/migrations/browser/commits. Preserve existing statements and all peer changes.

## Ownership

Settings worker owns new financial seed partial and IFinancialReportSettingsService
signature only, plus named helpers in FinancialReportSettings folder as needed.
Do not edit SeedDataService, links service, resources, report math or frontend.
Root owns supplementary chart/types, prepaid pairs, orchestration, resources,
guide/docs/source reconciliation. Link worker owns its supported-links handoff.

## Source-proven tax-role correction

Existing default AdvanceTaxAccount and TdsDeductedInPayments require CurrentAssets
by AccountSelectionPolicy, but both reused the Prepaid Taxes code whose expense
pair source requires Prepayments. One account cannot satisfy both roles. Add
new current-asset1-01-004-006 (Advance and Withholding Tax Receivable); point only
these two default catalog entries there. New-chart initial links remain null
until supplement creates the target, then supported-link ensure fills them.
Prepaid Taxes retains001 and Prepayments classification. Existing selected links
are never rewritten; they remain reviewable through the setup readiness result.
