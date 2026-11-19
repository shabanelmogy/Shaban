# Bills — comprehensive source review and down-payment settlement

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-21 |
| Frozen handoff | BILLS_DOWN_PAYMENT_AND_FULL_REVIEW_CONTRACT_FREEZE.md |

## Manifest and evidence

Owner authorizes completing the proposed down-payment settlement and comprehensive Bill review. Scope is Bill Angular feature and directly related backend DTO/domain/config/service/controller/financial writers. Existing dirty source from earlier work is preserved; no automatic replacement, cleanup or migration. Screenshot evidence12345 shows saved loan terms/paid PVs/remaining schedule and RequiresReview, not proof that downpayment was actually paid. Earlier screenshots prove five Bill types, loan plan, installments/Pay and historical actions only; actual schema/state comes from source. Owner decisions supersede reference behavior: Save draft, Approve posts, conditional UnApprove, terminal flag-only Void, future Settings approval configuration, source-owned payments and conserved loan revisions.

Selected shapes: UI08 routed financial document with lines/totals/documents, UI09 nested typed action dialogs, UI02 list/read grid; BE15 financial master-detail. Approved references Workshop/Job editor and close-job, InvoiceService accounting owner plus JournalVoucherResolver; shared EditorDialog/FormSection/DataTable/FieldError/EditableCollectionTable/SummaryCards. Existing feature /Bill, routes create/details/:id/edit/:id and UserGuide /UserGuide/invoice. AuthGuard only, no permission API. Initial all8 recipe drift checks pass; PLAN00 and PHASE00..06 applicable. No external policy lookup required: this implements owner's explicit frozen accounting rules against local source.

## Grid, read contract and filters

Grid after the shared Actions column: id(number),no(text),billType(status),approvalStatus(status),isVoided(status),supplierBillNo(text),purchaseOrderNos(text),date(date),supplierBillDate(date),supplierName(text),supplierCode(text),totalAmount(money),dueAmount(money),status(status),createdBy(text),branchName(text),vehicles(text),discount(money).

BillListVM beside it: Id,No,BillType,ApprovalStatus,IsVoided,SupplierBillNo,PurchaseOrderNos,Date,SupplierBillDate,SupplierName,SupplierCode,TotalAmount,DueAmount,Status,CreatedBy,BranchName,Vehicles,Discount; plus actual action flags CanApprove,CanUnapprove,CanVoid,CanAllocate,CanAllocateSupplierDebit,CanViewJournal,CanViewInstallments. No loan child graph or tenant data in ListVM. Main grid columns unchanged by downpayment.

Filter properties/query dictionary keys: no,supplierBillNo,vehicleId,branchId,supplierId,dateFrom,dateTo,useCreationDate,isLoan,status,approvalStatus,billType,id,supplierCode,discount,search; sorting serializes existing sortField/sortOrder. Backend parses case-insensitive keys, true/false, enums including0, positive ids and date values; applies same filters to paginated saved tax report. CountAsync precedes paging with deterministic id tie-break. Generated reports/Excel fetch all matching pages; no tax recomputation on read. DueDate/deal filters and GenerateFines/ImportBills remain previously documented deferred workflows.

## Existing action contract

| Action | Source-owned backend/API | Owning UI and result |
|---|---|---|
| View/Print | inherited GetById -> BillService.DetailAsync | Routed view/print saved data |
| Create/Update | POST/PUT Bill; explicit aggregate validation/reconciliation | Full snapshot lines, immutable saved type, documents tracker; authoritative Save |
| Approve | POST Bill/{id}/approve | Shared confirmation; revalidate draft, atomic source posting+audit |
| UnApprove | POST Bill/{id}/unapprove | Guarded eligible state only, shared confirmation; source unpost+audit, no dependent allocations/paid/history |
| Void | POST Bill/{id}/void date/reason | Typed action; terminal original-JV flag cancellation, no inverse journal |
| Journal | GET Bill/{id}/journal | Source-FK saved read, no arbitrary journal input |
| Allocation | GET/POST Bill/{id}/allocation | Existing supplier opposite posted balances, no cash |
| Supplier debit allocation | GET supplier-debits and targets, POST paired allocation | General source actual supplier debit; existing capacity only |
| Installments | GET Bill/{id}/loan-payment-plan | Historical saved plan + server payment/action flags |
| Pay | POST Bill/{id}/installments/{emiId}/pay | Fixed saved full EMI, source-owned real PV and principal allocation |
| Reschedule | POST loan/reschedule/preview and commit | Server preview/version and immutable revisions; no cash |
| Early settlement | POST loan/settlement/preview and commit | Full remaining principal+explicit bounded interest, real PV |
| History | revisionHistory in saved plan | Actual old/new generation read, immutable paid history |
| Down payment | POST Bill/{id}/loan/down-payment requestId/date | New exact saved amount, supplier debit/bank credit, real PV+allocation, no EMI |

All transitions revalidate backend; hiding flags is not security. Reference close-job customer invoice/stock/job actions are Not Applicable to supplier Bills; its typed input/busy/failure/dirty/controlled close lifecycle is applicable. No new generic Save confirmation or permission endpoint. No reversal/asset split/new rate/partial settlement policy introduced.

## Implementation and audit workstreams

Backend implementation: bill_downpayment_backend, inherited model, new source-owned downpayment workflow and direct mutation guards. Frontend implementation plus existing UI audit: bill_downpayment_frontend, inherited model, disjoint frontend files/vocabularies. Independent backend read-only financial audit: bill_comprehensive_audit, inherited model. Root owns freezes, docs/user-guide/books/skill/packets, cross-layer integration, final scoped reconciliation. Four bounded active slots reduce elapsed time while preserving file ownership. No agent owns migrations/snapshots/approved refs. Independent backend audit findings are in BILLS_COMPREHENSIVE_BACKEND_AUDIT.md; root resolves confirmed scope under frozen rules.

## Conformance evidence

| Concern | Book / actual owner | Target decision |
|---|---|---|
| Dialog input / busy / dirty | UI13/19/22; Workshop/Job close-job, shared EditorDialog/FieldError | Date-only action; amount/account read-only; no second empty confirmation |
| Header action projection | UI24; actual FormSection [form-section-actions] | Compact action in existing narrow terms header/region, server can flag |
| Parent refresh | UI28; current installment changed event | Viewer reload then parent once outer closes; no fake payment identity |
| Posting / transaction | BE15; source-owned EMI writer, Resolver.SaveAndPostJVAsync | Allocation->PR lock and entire PV/JV/link/allocation commit |
| Calculated values | BE15/VM3; domain and capacity readers | No client amount/account/tenant/paid state; view flags service-computed |
| History / correction | BE15 source ownership and revisions | Existing paid/history preserved, no unrelated mutable writer bypass |

## Final reconciliation / owner checks

Integration and independent source audit completed; source review cannot certify compilation,
EF translation, migration execution, live response, visual layout or performance.
No builds/tests/lint/browser/runtime/DB/migrations/snapshots/commit/push/deploy run.
Owner migration suggestion AddBillLoanDownPayment after prior lifecycle schema.
Final file inventory, exact findings/fixes, syntax checks, packet evidence and
owner cases to be recorded after implementation.

## Implemented changes and comprehensive review findings

| Finding | Source correction | Final verification |
|---|---|---|
| Financing downpayment not represented by cash/settlement | Dedicated immutable BillLoanDownPayment + fixed full-amount source-owned PV/JV/paired allocation; exact capacity-gap eligibility | Root wire/cash review and independent final audit CLEAR, source-only |
| Draft loan edit replaces retained unique one-to-one FK slot | Reconcile same draft plan and active rows; supported loan off/on reuses slot without paid/revised/DP history restoration | Source reread: no second Plan insert; nonloan approval/profile ignores deleted inactive plan |
| Retained old JV lines poison Pay/second UnApprove after reapproval | Active source readers omit deleted old source lines, still validate live tenant/shape; historical payment proof remains strict | Source reread and independent confirmation |
| Draft root removal leaves owned rows active | Canonical MarkRemoved/RemoveWithChildren validates usage and soft-deletes plan/EMIs/details with root under existing transaction | Independent audit; no posted/audited financial deletion |
| Stale request can reuse deleted Bill detail id | Preview/Update load live owned lines, old deleted ids fail ownership | Source reread includes both writer/preview paths |
| Ordinary configuration exception becomes500 | Approve/Void/Pay catch known fiscal/link resolver exceptions to existing safe Result | Source exception-channel review; no period bypass |
| Account conversion leaves role snapshots/races source cash | Move existing EMI and new DP bank/interest references with actual posted lines; allocation->PR transaction shared | Scoped full diff reviewed; conversion effect unchanged |
| Invalid draft loan values wait until backend | Inline DownPayment<Total, Interest<EMI/positive principal, Add ceiling600, invalid principal shown unknown | Syntax and shared FieldError/source contract checks |
| Changed payment date reuses old request identity | Same date retry retains key, changed attempted date gets new key in ordinary Pay/new DP | Source request flow review |
| Loan table pagers use Bill noun | Installment/revision-specific translated pager text | EN/AR source keys and templates |

Separate finding outside this Bill screen: LoanReportService's three existing loan-report modes predate flag-only Bill cancellation and do not carry Bill.IsVoided, so canceled loans can appear in their outstanding totals without cancellation context. Recorded F5 in independent audit as a dedicated report contract/UI follow-up. Do not silently change existing draft inclusion or claim whole-application report conformance. Main Bills list/tax report and saved installment viewer retain cancellation context. Previous deferred workflows (fine/import bills, due-date/deal filters, financing type/payment-plan type without persisted source) remain explicitly deferred, not invented.

## Scoped file ownership / deliverables

Backend new: Helpers/Models/Vouchers/BillLoanDownPayment.cs; DataAccess/Configuration/BillLoanDownPaymentConfig.cs; ViewModels/ViewModels/Bill/BillDownPaymentPayVM.cs; Business/Services/VouchersServices/BillService.DownPayments.cs. Existing: BillService.cs, BillService.InstallmentPayments/Installments/LoanLifecycle/Unapproval/Void partials, BillInstallmentPaymentState; PaymentService/JournalVoucherService; AccountServices/AccountService; BillProfiler/LoanPaymentPlanProfiler; IBillService; BillController; LoanPaymentPlanDetailVM; GeneralMessage EN/AR resources. Existing earlier feature files/migrations/snapshots preserved.

Frontend new: Bill/models/down-payment.ts and components/down-payment/down-payment.component.ts/html. Existing: models/installments.ts,services/bill.service.ts,installments.ts/html,installment-payment.ts,loan-plan.ts/html,loan-change.html,loan-history.html, EN/AR vocabularies,tsconfig.app.json; root UserGuide/content/bills-topic.ts. No new shared CSS/components/feature route/menu/provider, no permission API. User guide remains Vouchers reader /UserGuide/invoice; describes fixed downpayment action, existing-source allocation alternative, amount/date/bank constraints, no synthetic EMI/interest, history/retry/refresh.

Mapping: new write VM has only Guid/date; plan read fields are service-computed and ignored in projection map, then populated by proof/capacity owner. No ReverseMap/new generic mutable source-link endpoint. Domain keeps initial/revised loan totals; source service owns full saved downpayment and effective ledger gap. Shared cash construction/paired allocation helpers eliminate divergent cash writers for EMI/settlement/downpayment; no global generic-service rewrite.

Override decisions retained: GetMany/GetManyWithNavigations/GetAllWithNavigations supply narrow custom financial projection, paging/read enrichments; Detail/DetailWithNavigations supply saved financial action/read shape; Add/Update validate and reconcile aggregate rather than generic detached mapping; AddList/UpdateList run same invariant cores with atomic existing boundaries; Remove performs guarded aggregate dependency-aware soft deletion. No redundant new generic override in Bill; explicit new domain action is not CRUD. Payment and JV guards extend their existing source-owned writer boundaries. Account conversion's explicit transaction is now supplied by allocation->PR lock owner rather than nesting a second BeginTransaction.

## Source-only verification and owner execution

Root syntax-only parsing:28 TypeScript sources including owning guide/vocabularies,12 Angular templates; zero syntax errors. Relative feature imports exist; JSONC parsed and both new runtime entries occur once. Worker resolved345 complete literal Bill translation keys in EN/AR, no duplicate Bill properties. Resource XML parsed: duplicate0 and7 downpayment keys in each EN/AR. Scoped Git whitespace checks pass with only informational preexisting LF/CRLF warnings; new/untracked source checked separately because git diff omits it. This is not template typechecking or successful .NET/Angular compilation.

BE14 retained one-to-one/live-navigation and BE15 source-owned downpayment rules plus skill/revision row updated together from verified source and owner contract. Regenerated through generator only, all8 packet checks pass; no new reference role or engine change. PLAN00/PHASE00..06 applied as source discovery/freeze/implementation/integration/reconciliation; runtime/build/DB acceptance skipped under explicit AGENTS boundary.

Owner schema handoff (suggestion only; agent did not execute): existing owner-created AddBillLoanScheduleRevisions migration is now present. AddBillLoanDownPayment adds durable source-link table, amount/date/request/bank/payment/plan references, tenant-scoped unique Bill/payment/request indexes and Restrict FKs. No invented backfill and no modification to existing tables needed for this new link.

```powershell
Add-Migration AddBillLoanDownPayment -Project SiGma.DataAccess -StartupProject SiGma.ServerAPI -Context SiGmaDbContext
Update-Database -Project SiGma.DataAccess -StartupProject SiGma.ServerAPI -Context SiGmaDbContext
```

Review target database and generated migration, apply before starting new readers/writers (including main Bill correction/list flags). Then owner compile both projects and run: positive/zero/already externally settled/partial unknown downpayment; actual2500.50 example with paid principal972.18 => Bill remaining16527.32; same request replay/changed date/conflicting key; duplicate concurrent DP/Pay/allocation/Void; closed/overlapping fiscal year/missing bank/interest; sourceowned immutable PV after current bank deactivation; draft loan edits/off/on/reapproval/second UnApprove/deleted stale line; draft owned delete without affecting audited histories; normal EMI and early settlement cash totals/balance; EN/AR/narrow/short-height/RTL/theme/keyboard/dirty cancel/failed retry and one outer refresh. Timing/performance requires owner measurement; no runtime speed claim.

Suggested commits only: backend `feat(bills): settle loan down payments and repair draft lifecycle`; frontend `feat(bills): add down-payment action and loan validation`; docs `docs(bills): document down-payment settlement and review findings`. No build/test/lint/browser/runtime/DB/migration/snapshot/commit/push/deploy command was run.

## Final independent reconciliation

Independent backend source audit is CLEAR for the implemented Bill/downpayment
scope after all requested rereads. F1-F4 and F6 are corrected; F5 separate loan
report integration remains explicitly outside scope, not a passed report check.
Root additionally identified current cash-role coupling of historical downpayment
PV: final proof-only read preserves actual historical identity/replay despite
bank deactivation while new cash still validates today's roles. Root/auditor
also verified retired draft EMI rows retain their optional plan FK and are not
counted as approved revision generations. A retained deleted Paid row explicitly
invalidates history even without a link; only untagged deleted Unpaid draft rows
are omitted from the generation. Thus the draft repair cannot bypass paid
history safeguards.

No in-scope confirmed source blocker remains in this review. Owner compilation,
EF translation/fixup, actual response/schema, payment/accounting/concurrency and
visual acceptance are still pending. Final implementation is source-only, not a
claim of deployed or runtime-tested completion.
