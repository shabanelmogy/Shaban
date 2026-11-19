# Loan maintenance / evolution plan

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-06 |

Requested outcome: «راجع : src\app\modules\Loan وطبق التعديلات وفقا للوثائق». Three attached screenshots are functional evidence, not implementation instructions. Tier L; read-only report slices are frozen. Payment is a separate blocked slice, pending an explicit accounting decision.

## Existing state and impact map

| Owner / consumer | Existing state | Decision |
|---|---|---|
| LoanPaymentPlan / LoanEMI entities, EF configuration | Bill owns plan and generated schedule; flat-rate calculations persisted | Keep; no schema or formula changes |
| BillService Add/Update, CalculateLoan | Existing schedule writer; rebuilding schedule on bill edits is outside this review | Keep; flag paid-schedule editing for owner acceptance |
| BillService.LoanPaymentPlanDetailAsync | Footer explicitly hardcodes paid zero; no settlement writer found | Keep compatibility; new report reads persisted status, not this footer |
| LoanEMIsComponent / LoanEMIService | Legacy ms-lib, incorrect fields/route, untyped forms, no errors/export/print; Pay only closes dialog | Replace presentation and missing reads in place |
| Sidebar / page routes / toolbar | All three menu items point to /LoanEMI | Extend three independent read routes; preserve /LoanEMI |
| Loan report API | No LoanEMI controller/service or loan report reader exists | Create dedicated report service/controller over existing owner |
| EN/AR vocabularies | Partial EMI labels | Extend scoped keys |
| Accounting payment / allocations | No persisted relation from a payment to an EMI; no paid-status writer found | Block actual payment; do not manufacture a journal or mark Paid |

## Ambiguities and alternatives

| Question | Decision / evidence | Rejected alternative |
|---|---|---|
| Screen shape | Summary and details: UI07 / BE5. EMI: same report read lifecycle with a blocked Pay workflow; no CRUD | Generic editable EMI CRUD would bypass bill ownership |
| Summary date meaning | Reviewer decision (owner standing rule): Bill.Date selects loan origin documents; schedule start/end stay separate columns | FirstEMIDate would conflate origin and repayment dates; no overlap policy proven |
| Details meaning | Same loan balances and filters as screenshot 3, separate route without finance filter | Inventing another entity / editor |
| Paid / due | Read persisted Paid installment principal/interest; due = stored plan header less Paid schedule amounts; status is paid/live schedule count | Hardcoding paid zero or claiming these are reconciled ledger settlements |
| EMI number | Ordinal within full live schedule, Date then Id, before filtering; not EntityBase.No | Using generic document No or filtered row index |
| EMI amount / summary EMI | LoanEMI.EMI; summary takes first live scheduled amount (final remainder may differ) | Client division / recalculation of historic plan |
| Bank / vehicles | Account.Name via FinanceBankAccountId; BillDetail.Vehicle.PlateNo, tenant/live queries, distinct plates | Showing FK numbers or inventing missing names |
| Pay | Missing accounting document, account mapping, allocation link, reversal/idempotency/concurrency rules. Asked owner on 2026-10-06 | Turning a UI-only stub into an unreviewed financial mutation |

Read formulas summarize existing scheduled status only; they never post, backfill, alter historic amounts or assert bank/ledger settlement. Unknown vehicle/bank/bill labels remain empty. No data destruction/access restriction is introduced.

## Target / compatibility / implementation

Frozen API handoff: LOAN_READ_CONTRACT_FREEZE.md. Keep existing Bill DTOs/maps/writers. New readers use QueryReport with tenant/live joins. No entity/configuration/migration changes. Rollout backend reader and frontend together; /LoanEMI remains. No former working LoanEMI API is replaced (none exists).

Phases: 0 discovery/evidence; 1 reader contracts; 2 frontend/backend readers and output; 5 routing/translations; 6 scoped diff reconciliation. Phase 3/4 payment slice remains blocked, with explanatory visible feedback; no financial Save is exposed as successful.

## Verification / decision review

Source: compare every column/filter/response, complete dataset/count/totals, enum identities, tenant and live parent joins, translated output, failure recovery, no mutable client totals, full scoped diffs. Owner: builds, runtime requests, print/Excel row counts over 100, numeric deal 0/status 0, invalid/reversed dates, bank lookup failure/retry, light/dark/RTL/narrow screen, read totals versus schedule. Payment requires owner's decision before implementation.

No build/test/lint/browser/database/migration/commit/push/deploy commands authorized. Generated packets checked and drift found in PLAN00/PHASE00/02/03/04/05/06; canonical books govern. PHASE01 passed. Packets require regeneration plus semantic review by documentation owner.

## Implementation outcome — 2026-10-06

Frozen read slices implemented and integrated in both repositories, with source-only reconciliation in LOAN_FEATURE_REVIEW.md. No plan/entity/writer/formula changes were required. Pay is preserved as an unavailable shared row action for unpaid installments; the actual settlement slice remains Blocked pending the accounting decision requested from the owner. The follow-up «كمل» continues the review work and supplies no settlement document/account rule.
