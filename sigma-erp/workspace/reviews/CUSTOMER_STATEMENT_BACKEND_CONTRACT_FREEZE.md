# Customer Statement backend report corrections — 2026-10-02

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Authorization | Original review-and-fix request covers directly related API; owner says continue after stopping the competing session |
| Owned source | GetCustomerStatementAsync only in CustomerService.cs; GeneralMessage English/Arabic resource entries; nullable deposit refund response and its frontend consumer |

Separate backend handoff discovered during the frontend report review. Preserve unrelated ReceivableAgeAnalysis/GetCustomerBalancesSummary edits in the same service. Master 4/5/7, BE 3/5/9/17/18 and checked Phase-01/02/06 apply. Actual producers: CustomerDeposit.UsedAmount is cumulative use plus refund; RefundDepositAsync adds vm.Amount and stores the refund JournalVoucherId; the refund JV debits deposit payable with customer identity and credits cash, and stores DateTime.Today. UseDepositAsync writes CustomerDepositUsage.UsedAmount and also increments the cumulative field. These writer facts establish report-only corrections, with no posting, entity, EF, schema or mutation change.

| Finding / frozen correction | Evidence and consumer |
|---|---|
| Refund amount/date | Report currently uses cumulative UsedAmount and CreatedAt. Use the linked live refund JV's customer debit sum for Refunded and its Date for RefundDate; Used is cumulative consumption minus that refund. Missing historical refund JV produces null refund amount/date, never an invented zero or creation date; retain cumulative Used for the legacy unknown split and disclose this limitation. Deposit DTO Refunded becomes decimal? and frontend number/null; only this report consumes it. |
| Ledger allocations | Maps load only in outstanding mode and header links pick the first credit. Reconcile both actual eligible AR sides through toDate in allocation-date/Id order. Explicit source detail wins; otherwise consume opposite-sign source lines in detail-Id order, bounded by both remaining capacities. Ignore unmatched/future/deleted/foreign/unposted/voided sides. Record each matched magnitude on both rows; preserve ledger net. Ledger displays its requested date range after reconciliation and keeps Debit-Credit running/totals; due reduction stays outstanding-only. Advance rows use matching detail maps when applicable. |
| Advance age/order | Match regular Math.Max(0, (Today - Date.Date).Days); add Id tie-breaker for deterministic same-date running balances. |
| Beginning balance / reads | Replace materialize-then-sum with database SumAsync; use QueryReport roots (tenant/soft-delete, no tracking, fail-closed). Require live posted/nonvoid parent journals. Complete arrays remain unpaged. |
| Invalid filters / localization | Align positive customer, two modes and complete ordered dates with frontend before querying. Localized BusinessFailure on invalid filters/customer; safely handle maximum end day. Missing receivable links fails instead of displaying invented zero balances. GET route/wrapper and keys unchanged. |

Refund derivation uses persisted customer debit rather than today's configured deposit-payable account, since historical links can change. Require live, posted, nonvoid journal and live detail in the same subscription. The one consumer renders absent refunded amount as a dash; no frontend calculation. Nullable refund widening is recorded here as an amendment to the frontend handoff's original numeric response, and its affected response comparison is rerun.

PONo has no identified source in JournalVoucherDetail, InvoiceBase, Invoice or MiscellaneousInvoice: retain nullable column without inventing a relationship. Deposits/PDCs retain whole-customer scope; outstanding keeps Today-based age and toDate allocation cutoff. Voided deposit history inclusion remains unchanged without confirmed policy.

Compatibility exceptions: keep the existing Customer service/controller and DTO file organization; no new service or CRUD contract. Running/ageing totals continue deriving from complete returned arrays; beginning/current aggregate reads use SQL. No AutoMapper/ListVM changes or overridden method added. No migration.

Reconciliation amendment before implementation: the current BE 17 allocation subsection explicitly requires source/target cutoff parity, deterministic header distribution and paired capacity guards. Writer-linked source details/journals and the already inspected allocation consumer establish these corrections without changing any postings. A debit 100 / credit 40 with a matched 40 becomes remaining debit 60 / credit 0 (net 60); a future or ineligible credit cannot reduce the debit. Unapplied credits remain signed report rows. This replaces the earlier plan to retain the arbitrary-first-credit fallback.

Boundary amendment: CustomerService.SelectAsync explicitly selects PartnerType.Individual/Company, while the statement read accepted any Partner identity. Match the existing customer lookup's two types at this report boundary, using the same not-found failure for unsupported partner kinds. This is customer identity validation, with no new role/permission contract.
