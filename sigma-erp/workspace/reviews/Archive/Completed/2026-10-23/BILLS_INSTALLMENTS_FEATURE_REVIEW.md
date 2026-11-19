# Bills — installments and full scheduled payment

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-20 |

## Scope, evidence and phases

Owner supplied screenshots a/b/c for the saved Installments action and d for Pay Installment. Explicit evidence: loan terms, rows, Paid/Unpaid, PV references, Overall/Paid/Due, Pay, asset settlement and restructuring. Layout comes from UI13/shared components, not screenshot styling. Existing saved plan had no operational action and hardcoded Paid=0. Existing LoanEMI had no Payment link/writer. Owner expressly approved full saved principal/interest payment against original supplier liability + linked InterestExpense + RecoveryBank. Editable interest, partial payments, asset attribution, early settlement and restructuring remain unfrozen and are not rendered as inert controls.

Sources and decisions are frozen in BILLS_INSTALLMENTS_CONTRACT_FREEZE.md and BILLS_INSTALLMENT_PAYMENTS_CONTRACT_FREEZE.md. Payment alternatives/impact remain in BILLS_INSTALLMENT_PAYMENTS_MAINTENANCE_EVOLUTION_PLAN.md, updated to Frozen for the approved slice only.

Applied: Phase0 evidence/source discovery; Phase1 contracts; Phase2 minimal list action flag; Phase3 saved terms/read + typed payment form; Phase4 approved payment action; Phase5 service/parent/dialog/runtime-entry integration; Phase6 source reconciliation. No unrelated Bill/PO/GRN or generic Payments redesign.

## Contract and data ownership

| Concern | Decision/evidence |
|---|---|
| Main grid | Existing columns preserved: Id, No, BillType badge immediately after No, approval, document lifecycle, supplier bill/PO refs, dates, supplier/code, amount/due/status, creator, branch, vehicles, discount. BillListVM adds only CanViewInstallments to existing scalar display/action properties; no plan/EMI graph |
| Saved schedule grid | Ordinal, Date, EMI, Interest, Principal, real PV No, persisted Status, Pay action; LoanEMIDetailVM has saved fields/identity + PaymentId/PaymentNo/CanPay. No client-written status/totals |
| Read | Existing GET Bill/{id}/loan-payment-plan; actual owned live rows, dates/identity sorted; historical Void read retained |
| Summary | Server sums actual saved rows into Overall/Paid/Due principal/interest/gross, nullable when inconsistent/unknown; no fake PV or Paid=0 placeholder |
| Payment input | POST Bill/{billId}/installments/{installmentId}/pay with requestId/date only; accounts, amounts, supplier, tenant, statuses derived on server |
| Accounting | Original supplier payable identity, saved principal; configured InterestExpense only for positive interest; RecoveryBank credit for actual gross; principal-only paired allocation |
| Lifecycle | Only earliest eligible saved Unpaid row can Pay; Approved/nonvoided source; source-owned historical links and immutable posted document; no reset/UnApprove/reversal introduced |
| Race/retry | Existing allocation->PurchaseRequest lock order, one transaction, durable unique source link/request key, server revalidation and same-request replay |
| Compatibility | Historical Paid rows without a link remain readable without a fabricated PV; ambiguous history blocks fresh cash. Missing legacy header values stay blank |
| Authorization | Existing authenticated routes; no invented permission API. Hiding actions is not authorization |
| Schema | One source-owned installment-payment link and Restrict FKs/unique indexes; owner migration required, no historical backfill |

## UI conformance and guide

Financial parent remains UI08/BE15. The bounded child uses UI13 controlled EditorDialog mode=view with translated title and separate Bill-number subtitle, padded body and Close; payment child uses typed form and Pay. Actual shared EditorDialog declarations/template, DataTable public fill/status/date/money/action API, FormSection, FieldError, LoadingService and UI22/28 were read. Approved Job close-dialog reference was inspected for controlled source action; no payroll or other approved reference was modified.

Narrow terms pane plus wide schedule; independent internal scroll, fixed local pager/summary/footer; responsive stacking via placement only, shared field/table/theme/RTL owners. No duplicate tab title, loan-plan CSV remains untouched. Source conformance and runtime/visual acceptance are separate. Existing Bills guide content is src/app/modules/UserGuide/content/bills-topic.ts, Vouchers reader /UserGuide/invoice, feature /Bill; updated EN/AR for action visibility, terms, statuses, summary, actual full payment, source locks and unavailable later slices.

## Verification and handoff

Source integration and scoped review complete; owner runtime acceptance remains pending. Owner must generate/apply AddBillInstallmentPaymentLinks (plus prior missing Bill lifecycle/supplier schema changes if not already migrated), inspect new link FKs/indexes, compile frontend/backend and verify real source accounting/transaction/concurrency behavior. No agent migration/snapshot/DB/build/test/lint/browser/commit/push/deploy execution.

Owner cases: no-plan action absent; saved draft read but Pay absent; approved valid plan next unpaid only; full principal/interest/gross journal + real PV + correct allocation and updated summary; zero-interest two-line journal; same-request replay returns same PV; competing Pay/Allocate/Void cannot duplicate/spend capacity; changed/reused request fails safely; closed date, missing accounts, wrong tenant/branch/currency, corrupt/deleted/legacy orphan links fail atomically; partial/overallocated source cannot produce cash; down payment is not implicitly paid; list/detail refresh after outer close preserves current page; HTTP/declared failures/Retry/Escape/keyboard/theme/RTL/narrow/short viewport acceptance.

Controlled delegation: reused inherited backend and frontend workers after shared freezes, disjoint ownership; root owns contracts, financial decisions, translations/guide and integration. A bounded financial read-only audit may be recorded after implementation. Parallel backend/frontend execution reduces wall time without overlapping files.

Suggested commits only: backend `feat(bills): pay saved loan installments with linked payment vouchers`; frontend `feat(bills): add installments viewer and scheduled payment action`. No commits performed.

## Final source reconciliation

| Slice | Final producer/consumer evidence | Result |
|---|---|---|
| Visibility | BillService lifecycle HasSavedInstallments -> BillListVM/BillDetailVM CanViewInstallments -> both parent actions/busy/inert/navigation guards | Matched |
| Read | Existing Bill controller loan-payment-plan now ToActionResult -> source-owned live plan/rows -> typed BillInstallments viewer; persisted unknown values remain blank | Matched |
| Pay | BillInstallmentPayVM requestId/date -> IBillService/typed frontend method/exact POST -> transactional payment owner -> valid Result.Id -> immediate viewer reload | Matched |
| Parent refresh | A successful mutation marks parent refresh pending; outer close clears stale details or refreshes same applied list page; modal remains mounted during payment | Matched |
| Journal/accounting | Original payable principal + InterestExpense + RecoveryBank; actual gross PaymentDetail; principal-only allocation; all inside existing outer transaction | Matched source-only |
| Replay/history | Unique tenant request/EMI/payment links, source-owned payment/JV proof, immutable bank/interest account snapshots, original supplier account and exact principal allocation | Matched source-only |
| Mutation bypass | Payment Update/UpdateList/Remove/HandleActive lock+retained-link guards; generated-JV guards plus source-payment HandleActive protection. No PaymentDetail CRUD/controller or editable child DTO exists; no new generic child API created | Matched |
| Controls/layout | Actual shared declarations compared: EditorDialog title/subtitle/primary/close gates; DataTable fill/status/actions/currentPageReport; FormSection fill/no mock; Calendar DatePicker/FieldError, no custom shell or duplicated tab heading | Matched source-only; visual pending |
| Unknown reference fields | Financing Type and Payment Plan Type labels retained with em dash, no inferred monthly/direct-debit value or invented lookup | Explicit reviewer decision under Master2 |
| Contract payloads | No client monetary/status/account/tenant writes; computed read flags/PV metadata ignored by mapper and populated by service. LoanEMI detail mapping is one-way; legacy generic Add/Update maps retain their own contracts | Matched |
| Guide/translations | Existing Bills topic /UserGuide/invoice in Vouchers reader, operational /Bill, EN/AR opening/reading/paying/summary/history/locks/down-payment distinction and future-slice limits | Matched source-only |

Root parsed 11 TypeScript sources including vocabularies/guide, 4 Angular templates and JSONC runtime registration; 52 directly used dialog keys exist in both languages. Final template reparse after adding the existing translated current-page report also passed. This is syntax/API-source reconciliation, not TypeScript semantic checking or application compilation. Both backend resource XML files parse with no duplicate names; 9 direct engine/read localization keys resolve in both, and mutation-block key is present. New source whitespace/merge-marker checks and tracked scoped git diff checks passed, aside from informational existing CRLF conversion warnings. Repository ownership was checked separately in frontend/backend; unrelated existing owner changes and migrations/snapshots were preserved.

Independent read-only financial audit initially found missing historical bank/interest role proof and shared Payment journal ambiguity. Corrected by server-only BankAccountId and nullable InterestAccountId snapshots/Restrict FKs, exact journal-role matching and one live Payment per linked JV. Root also identified an allocation header/detail mismatch capacity gap; raw touched allocations now include header, detail and actual parent identities, fail closed before effective filtering, then count both payable endpoints. Final audit reports no remaining actionable scoped financial/concurrency/replay/ownership/capacity/guard finding. No runtime transaction execution is claimed.

Final historical-read reconciliation separates real PV/pair identity from effective payment capacity: a retained canceled original Bill journal can still show a valid saved PV via the exact raw live explicit pair, while both fresh Pay and replay reject a canceled Bill/source and capacity uses WhereLedgerEffective only. The shared active OwnsBillJournal helper and own Payment posted/generated/nonvoided checks remain unchanged. Root and the independent read-only auditor reviewed this bounded final delta; audit is clear and no cancellation or new cash transition was introduced.

Verified reusable guidance promoted to canonical BE15 Source-owned installment payments and skill digest/history together: real source PV before Paid, immutable account roles, exclusive journal ownership, actual header/detail reservations and generic source-mutation guards. Affected phase01/03/04 packets regenerated only through the generator; reviewed against BE15 and unchanged approved reference roles. All8 final recipe drift checks pass. Suggested documentation commit: `docs(finance): record source-owned installment payment invariants`.

Backend changed: BillService.cs lifecycle/detail propagation and extracted old read; new BillService.Installments.cs, BillService.InstallmentPayments.cs, BillInstallmentPaymentState.cs; new BillInstallmentPayment entity/config; new BillInstallmentPayVM; Bill/loan read VMs; Bill/LoanPaymentPlan/LoanEMI profiles; IBillService/BillController; PaymentService/JournalVoucherService source guards; GeneralMessage.resx/ar-SA resources. Frontend changed: new models/installments.ts and components/installments/*, components/installment-payment/*; list/details typed flags and child wiring; BillService typed transport; explicit tsconfig.app.json entries; EN/AR vocabularies and existing Bills user guide. No reference-module or unrelated screen redesign.

Agent utilization: reused inherited backend worker for domain/API/read/guard implementation, inherited frontend worker for disjoint dialogs/transport/parents, and existing gpt-5.6-sol audit worker read-only for transaction/accounting/ownership review. Root froze shared contracts before delegation and owned financial decisions, translations/guide/docs, source integration and final review. The smallest useful parallel team reduced cross-layer waiting; no overlapping source ownership.

Owner migration commands (suggestions only, never executed):

```powershell
Add-Migration AddBillInstallmentPaymentLinks -Project SiGma.DataAccess -StartupProject SiGma.ServerAPI -Context SiGmaDbContext
Update-Database -Project SiGma.DataAccess -StartupProject SiGma.ServerAPI -Context SiGmaDbContext
```

Inspect that the new table contains the immutable payment amounts/date/request and bank/interest role snapshots, all five Restrict relations and unique tenant indexes, with no guessed historical backfill. If the earlier Bill lifecycle/line-supplier migration is still missing, inspect those known pending differences before applying the owner's generated migration to the API database. Outstanding owner acceptance remains compilation, database/schema alignment, source payment/retry/rollback/concurrency and UI/RTL/theme/short-height behavior. Early settlement, asset attribution/settlement, partial payment, interest amendment and restructuring remain intentionally unfrozen, with no inert controls or fabricated accounting.
