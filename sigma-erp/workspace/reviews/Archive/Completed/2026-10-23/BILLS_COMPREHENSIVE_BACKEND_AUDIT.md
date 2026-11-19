# Bills comprehensive backend audit

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-21 |
| Mode | Independent application-source-read-only audit; findings sent to implementation owner |
| Governing contract | BILLS_DOWN_PAYMENT_AND_FULL_REVIEW_CONTRACT_FREEZE.md (Frozen) |

## Authority and scope

Read Sigma AGENTS, mandatory sigma-screen-refactor digest, Master4 artifact/contract gate, BE15 financial-effect pattern and BE19 backlog. Recipe check: all eight packets pass. Existing Bill editor/action/conditional-UnApprove/installment-payment/loan-lifecycle contracts govern; historical superseded posting/reversal clauses do not. The selected backend shape is BE15 financial aggregate using InvoiceService as approved reference, with Bill's explicit manual approval and source-owned loan payment exceptions.

Application sources were not edited by this auditor. Root/backend worker concurrently implement downpayment and confirmed fixes; findings below describe discovered source and require final reread before changing status. Reviews are local/unversioned until the owner performs the documented move.

Scope: BillService and partials; Bill/BillDetail/LoanPaymentPlan/LoanEMI; Bill DTO/profile/controller/interface/configuration; directly used repository/UnitOfWork/DbContext soft-delete behavior; payment/JV mutation guards; directly dependent loan report reader. No full-solution scan.

## Prioritized findings

### F1 — P1: replacing the draft loan plan conflicts with the one-to-one retained FK

Discovered BillService.UpdateCoreAsync deletes existing plan/EMIs, saves, then assigns a new prepared plan and saves. BillConfig defines a one-to-one LoanPaymentPlan.BillId relationship. A one-to-one FK has a unique BillId slot. SiGmaDbContext soft deletion restores original scalar values and only writes IsDeleted/audit; it does not release the old BillId. Consequently an ordinary edit of an unpaid draft loan can retain the old plan's unique BillId while inserting another plan for that Bill (unique-key conflict); toggling loan off/on can hit the same retained slot.

Source at discovery: BillService.cs approximately 813–828; BillConfig.cs HasOne/WithOne/HasForeignKey; Repository.Delete/DeleteRange; SiGmaDbContext soft-delete handler approximately494. Read-only schema snapshot inspection corroborated the pre-existing unique index; no snapshot was changed or generated.

Repair recommendation sent to owner: retain/reconcile the single draft plan rather than delete+insert its header; reconcile unpaid EMI rows, preserve identity, and handle loan off/on without reusing a retained unique slot unsafely. Existing correction guards continue to reject paid/revision/downpayment history. Do not remove a unique constraint or physically delete history to hide this problem.

### F2 — P1: reapproval's soft-deleted journal rows poison live eligibility

ApproveCoreAsync rebuilds the retained unposted source JV by DeleteRange(old details), clearing the navigation and adding replacement details. Old details remain soft-deleted. Repository.Query filters only the root; no global filter removes navigation children.

At discovery ReadInstallmentPaymentStateAsync passed the entire included source.JournalVoucherDetails to ValidSavedJournalLine, which rejects deleted rows. After Approve -> UnApprove -> Edit -> Approve, the old details were therefore loaded with the new details and blocked ordinary Pay, downpayment/revision eligibility and valid historical cash proof. ReadBillCorrectionEligibilityAsync likewise projected all original details and rejected any IsDeleted row, preventing a second valid UnApprove.

Source at discovery: BillService.cs retained-JV rebuild around1303; BillService.InstallmentPayments.cs sourceLines around203; BillService.Unapproval.cs Lines projection around108; Repository.Query root filter and DbContext soft-delete behavior.

Repair recommendation: explicitly select live children for active source financial state while retaining separate deliberate retained-history proof for payments/revisions. No physical history deletion or general global-filter change. Backend worker has begun this correction; final reread pending.

### F3 — P2: draft deletion does not reconcile owned rows

RemoveCoreAsync ends in base.RemoveAsync(id). Generic Service.RemoveAsync only soft-deletes Bill, and performs no InUseAsync nor owned-row reconciliation. BillDetails, LoanPaymentPlan and LoanEMIs can stay live after deleting a permitted unapproved Bill. Database Cascade/Restrict controls physical deletes and does not implement soft-delete aggregate ownership.

Source at discovery: BillService.cs end of RemoveCoreAsync approximately1591; Service.cs908–925 versus RemoveWithChildrenAsync/MarkRemovedAsync1084 onward; BillConfig owned relationships.

Repair recommendation: use guarded owned removal for live EMI descendants, plan, BillDetails and permitted source JV, retaining the existing posting/approval/payment/revision/downpayment/debit-note history restrictions and transaction. Do not broaden the generic service engine.

The directly inspected LoanReport reader joins a live Bill and therefore did not prove a deleted-Bill report leak. This is an actual owned-row contract defect, not an invented report symptom.

### F4 — P2: known configuration exceptions escape ordinary Bill actions

AccountingPeriodService throws FiscalYearConfigurationException when more than one open year covers the action date. It is a sibling of JournalPostingException. ApproveCoreAsync and VoidBillCoreAsync only caught JournalPostingException; PayInstallmentAsync caught posting/link exceptions but not the fiscal configuration exception. An overlap therefore surfaced as an unhandled server failure instead of the existing safe localized business Result. Approve also lacked a sibling LinkAccountConfigurationException handler for its account resolver.

Source at discovery: BillService.cs Approve catches; BillService.Void.cs terminal catches; BillService.InstallmentPayments.cs public Pay catches; Resolver/AccountingPeriodService.cs GetFiscalForDateAsync and sibling exception declarations. Existing UnApprove/lifecycle already handle these exceptions.

Repair recommendation: reuse the relevant existing safe failure Result keys. This affects error transport, not accounting/period policy. Existing outer transaction still rolls back.

### F5 — P2: separate Loan reports do not expose Bill cancellation context

LoanReportService.GetSummaryAsync/GetEMIsAsync selects any live IsLoan Bill. Bill.IsVoided and Bill approval are absent from report row DTOs/UI. A terminal flag-only canceled loan can remain an ordinary outstanding loan/interest row in those separate reports and totals with no cancellation indication. That drifts from BE15's cancellation-display requirement after the later Bill Void introduction.

Evidence: LoanReportService.cs58,208 where IsLoan; all summary/EMI DTO projection fields. The 2026-10-06 LOAN_READ_CONTRACT_FREEZE predates the 2026-10-20 Bill cancellation contract and intentionally included all live IsLoan Bills, including drafts.

Root decision: separate Loan-report contract/UI integration is outside this Bill-screen implementation; retain as explicit follow-up. Required affected consumers: LoanSummaryReportRowDto, LoanEMIReportRowDto, LoanReportService summary/EMI/bank reader, three route-mode frontend columns/badges/totals/export/print and report guide. A future contract should visibly retain canceled history and deliberately decide active totals. Do not silently exclude drafts or modify the report contract here. Main Bill list/tax report already carries IsVoided, saved installment viewer marks canceled status.

## Reviewed areas and source observations

| Area | Reviewed evidence | Result / limit |
|---|---|---|
| List/paging/filter/sort | ReadBillListAsync, ApplyBillReadFilters/Order, PopulateBillRead/Lifecycle | Count + normalized paging; displayed fields projection; batching for correction periods; no measured performance claim |
| Due/Open/Closed | Matching supplier credit, effective paired allocations, zero approved totals, Voided branch | Source state separate from loan schedule; no client paid-flag shortcut |
| Create/manual types | AddCoreAsync, PrepareLinesAsync, ValidatePreparedLineReferencesAsync | General qty1; Stock item/UOM/positive int; Asset qty1/account from type; type-specific incompatible fields rejected |
| GRN selection/reservation | GetGoodsReceivedNotesAsync, PrepareLines source-type branch | Whole eligible supplier/branch/type receipt; claim exclusion and same PR lock; GRN currently creates no accounting JV |
| Tax/discount | Bill.Recalculate, BillDetail.CalculateTotals, ApplySavedTaxRates, AddBillJournalLines | Server once-per-rate VAT, saved rate snapshots, bounded tax adjustment, proportional discount with safe remaining capacity |
| Draft update/bulk | UpdateCoreAsync, AddList/UpdateList and UnitOfWork.ExecuteUniqueWriteAsync | Multi-save work is inside transaction; false Result leaves outer transaction uncommitted/disposed; F1 identified |
| Approval | PrepareApprovalAsync, ApproveCoreAsync, detached preparation/resolver ordering | Save is draft; explicit Approve revalidates saved totals/loan and posts source JV with audited status; F2/F4 identified |
| UnApprove | ReadBillCorrectionEligibility, BillsWithoutCorrectionDependencies, ReadOpenBillPostingPeriods, UnapproveCore | Retained paid/revision/payment/debit-note dependencies; batched original year/month; source-owned unposting; F2 |
| Void | VoidBillCoreAsync, Bill.MarkVoided | Original source/journal flags only, period/dependency checks, retained amount/number/audit; no reversing JV; F4 |
| Journal | GetJournalAsync, source FK/type/subtype guard | Original readable source-owned journal after cancellation; arbitrary client journal id not accepted |
| Allocation payable | LoadBillAllocationAsync/AllocateBillCoreAsync | Re-reads amounts under allocation then PR lock, positive unique scale-valid values/capacity, paired rows, no cash entry |
| Supplier-debit allocation | LoadSupplierDebitSources/GetSupplierDebitTargets/AllocateSupplierDebitCore | Real supplier partner/account branch/currency source, same net capacity, legacy header reservations distributed once, paired allocations |
| Initial loan arithmetic | CalculateLoan/ApplySchedule/ValidateTerms | Positive principal/EMI, zero-or-positive interest, complete amount matching, count1..600, floors and exact last remainder; saved statuses server-owned |
| Saved plan read | LoadSavedInstallments, SavedInstallmentSummary, history proof | Stored historical terms; invalid arithmetic fails eligibility instead of reparation |
| Pay | PayInstallmentCore/SaveInstallmentPayment/ReadInstallmentPaymentState | Durable request link, fixed full saved amount, next eligible EMI only, paired principal allocation, interest-expense cash entry, transaction; F2/F4 |
| Revisions | PrepareLoanChange/CommitLoanChange/PopulateRevisionHistory | Exact capacity equality, before/after preview+version, immutable Paid rows, FK archival, same cash writer, replay proof; pending final downpayment integration reread |
| Payment/JV guards | PaymentService direct/bulk mutation checks; JournalVoucherService source-owned controls | Retained source links block generic update/delete/activation; new downpayment integration in progress |
| Generic activation | Service.HandleActiveAsync | Changes only Bill.IsActive; reviewed Bill readers/ledger do not use it as a cancellation switch. No financial bypass claimed |
| Deleted children | Repository.Query/QueryReport + DbContext soft delete | Root-only filtering must not be presumed to filter includes; F2/F3 |
| Separate loan reports | LoanReportService + older frozen report contract | F5 explicitly out-of-Bill-screen follow-up |

## Downpayment audit boundary

The dedicated downpayment source is concurrently being implemented. This initial comprehensive audit does not certify unfinished code. Early integration notes sent to root: include DownPaymentHistory in all chronological action checks and LoanVersion; reject request-id collisions across EMI/revision/downpayment; preserve source histories during positive-interest settlement state reconstruction. Root will request final independent downpayment reread when backend owner declares source ready.

## Verification and limitations

- All eight recipe drift checks pass.
- Read actual source and targeted tracked Git scoped diff statistics/whitespace check; auditor did not claim the root's complete scoped-diff reconciliation. Untracked partial sources were read directly.
- No application source/configuration/instruction changes by auditor.
- No builds, tests, lint, runtime, browser, database commands, migrations, snapshot edits/generation, commits, pushes or deployment.
- No runtime correctness, compile acceptance, latency improvement or UI/RTL/theme acceptance claimed.
- Owner verification remains pending for all mutations, failure rollback, reapproval cycles, draft plan edits/off-on, paired allocation concurrency, downpayment existing/absent/external/partial settlement, new schema migration and separate report policy.
- Existing approval/void/loan schema migrations remain owner-run; new downpayment additive schema migration belongs to root's implementation report.



## Final independent source reconciliation — 2026-10-21

| Finding | Final source disposition | Evidence / remaining owner verification |
|---|---|---|
| F1 draft plan unique slot | Corrected in source | Retain/reconcile one plan header and unpaid rows; reuse retained deleted draft plan on reenable; nonloan ApprovalInput ignores deleted plan, nonloan approval only rejects a live plan; Bill detail mapping hides deleted plan. Owner exercises save/update/off/on/reapprove and unique FK behavior. |
| F2 reapproval live journal rows | Corrected in source | Installment financial state and correction eligibility explicitly select live JV children, preserving retained history separately. Owner runs two complete Approve/UnApprove cycles then Pay/downpayment. |
| F3 owned delete | Corrected in source | Inbound usage prevalidation, descendant EMI/plan removal through MarkRemovedAsync, BillDetails/plan through RemoveWithChildrenAsync under existing transaction. Owner verifies child soft-delete/audit and no deletion of dependent histories. |
| F4 configuration failures | Corrected in source | Approve catches fiscal/link; Void catches fiscal; public installment Pay catches fiscal; existing safe localized Result channels reused. Owner verifies configuration failures roll back and show declared errors. |
| F5 separate loan report cancellation | Deferred explicitly outside Bill screen | Root records separate report DTO/UI/active-total contract follow-up. No silently changed draft inclusion or report semantics. |
| F6 stale deleted manual-line ID | Corrected in source | Audit found Preview/Update loaded deleted BillDetails and accepted their IDs, allowing header calculations containing hidden deleted rows from stale payloads. Both now Include only live BillDetails, so existing ownership validation rejects the stale ID before mutation. Owner verifies rejection and normal saved-line editing. |

New dedicated downpayment source was independently reread after backend readiness:
- Dedicated entity/config has restrictive source FKs, decimal18,2 and tenant unique Bill/Payment/Request identities; only required requestId/date inputs, returned actual PaymentId.
- Public action takes allocation then PR tenant locks before all validation and resolver saves. Transaction owner rolls back false Results/exceptions, including intermediate posted JV save; final Payment/link/principal allocation save is in the same boundary.
- Exact full saved DownPayment is paid with zero interest; original supplier payable account is debited, saved RecoveryBank credited; no synthetic EMI or implied payment from saved financing terms.
- Gap/capacity proves actual effective Bill principal minus remaining effective schedule. Gap0 with external settlement has no fabricated PaymentId; partial/negative/ambiguous mismatch never creates a new downpayment.
- Retained source link + saved Payment/one detail/generated posted JV/two lines + exact supplier account/base-normalized currency/paired allocation/tenant/bill/plan identity are proven before historical display/replay.
- EMI/revision/downpayment request collisions are rejected under shared lock. Same valid bill/date/key replays existing actual PV; deleted/mismatched key conflicts.
- Current cash eligibility is now separate from immutable history: requireCurrentCashRoles=false returns proven history/capacity without requiring today's active recovery bank/interest role. PopulateDownPaymentValuesAsync independently validates current source/bank/branch/supplier roles before new cash. Both named callers match the renamed flag; ordinary EMI cash retains its role validations.
- Downpayment history joins LoanVersion and all chronological Pay/revision checks, including positive-interest settlement state reconstruction. It blocks unsafe Bill correction/Void and generic Payment/JV direct/bulk mutations.
- Account ConvertToGroup now shares allocation then PR locks/outer transaction and moves retained EMI bank/interest and downpayment bank snapshots with actual journal references. No cash writer can interleave the reference move under those owners.
- Existing source-owned downpayment proof/capacity survives bank role deactivation, while new Pay remains unavailable until valid current roles exist. No historical link is invented for external allocation.

Final review found no remaining confirmed blocking defect in the implemented Bill/downpayment scope after these corrections. F5 remains a concrete explicitly scoped report follow-up. This conclusion is source-only and is not build/runtime/database acceptance.

Final targeted whitespace check for changed BillService/InstallmentPayments/AccountService/BillProfiler passed (only Git LF/CRLF informational warnings). Root owns full all-file diff reconciliation, UI/user-guide and schema handoff. No forbidden commands were run by this auditor.


Final draft-history nuance: independently verified final reconciliation restores previously soft-deleted EMI members and newly retired draft members to the retained plan navigation after active row reconciliation. Because LoanPaymentPlanId is optional, this prevents DetectChanges from nulling retained history FKs. Repeated plan marking during owned Bill deletion was checked against actual InUse/MarkRemoved helpers: root excludes the owned plan FK, the descendant plan usage check excludes owned EMIs, and the later repeated Repository.Delete only retains the same Deleted state. No new failure was identified. This source check does not certify EF runtime fixup; owner exercises count reduction followed by a second edit and loan off/on.

Final retained-row strictness verification: LoanHistory now excludes only untagged soft-deleted draft rows from initial generation reconstruction, while explicitly invalidating any IsDeleted=true Paid row (line27), even when no payment link exists. Any deleted revision-tagged row remains invalid. LoadSavedInstallments clears FooterSummary on failed revision/history proof; installment cash state then fails its FooterSummary guard and downpayment/revision eligibility cannot become true. Legitimate retired draft Unpaid rows remain owned history and do not poison a valid current schedule. Independently verified in source; no runtime/DB execution.
