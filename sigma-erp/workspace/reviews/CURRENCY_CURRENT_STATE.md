# Currency — current state

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Latest implementation recorded | 2026-11-05, saved combined revaluation |
| Full review | [Currency full-stack review](CURRENCY_FULL_STACK_REVIEW.md), sections 13 and 14 |

## Governing decisions

- The [ledger and settlement contract](CURRENCY_LEDGER_SETTLEMENT_CONTRACT_FREEZE.md) keeps foreign posting closed. Ledger opening balances and movements use stored original amounts per currency. The [ledger reconciliation](CURRENCY_LEDGER_SETTLEMENT_FINAL_RECONCILIATION.md) records the correction to the earlier foreign-posting round.
- The [revaluation persistence contract](CURRENCY_REVALUATION_PERSISTENCE_CONTRACT_FREEZE.md) governs the valuation date, dated rate, saved contributions, combined journal and guarded void. Realized settlement, two-sided allocation amounts and bank revaluation remain separate work.

## Latest evidence and next check

The [revaluation reconciliation](CURRENCY_REVALUATION_FINAL_RECONCILIATION.md) traced preview, save, detail and void through the service and screen, including source cutoffs, duplicate prevention and allocation guards. This was a source review on 2026-11-05. It recorded the proposed migration `AddCurrencyRevaluationSessionsAndContributions` and left schema application and runtime acceptance pending.

Before accepting this slice, establish the actual migration and schema on the verified experimental database, then exercise duplicate posting, concurrent source changes and guarded void using the [manual acceptance scenarios](CURRENCY_MANUAL_ACCEPTANCE_SCENARIO_AR.md). The [dated-rate record](CURRENCY_DATED_RATES_FINAL_RECONCILIATION.md) covers its own earlier slice.
