| Status | Implemented — source-only |
|---|---|
| Owner verification pending | yes |
| Date | 2026-10-07 |
| Scope | Customer expected advance/deposit, actual receipt sources, tax advances, deposit use/refund, directly participating writers |

# Contract settlement reconciliation

Authorization: owner requested applying the selected approach to every existing advance/deposit screen and continued implementation. The later question about unpaid advances confirms the distinction: a contract's advance is an expected term; actual collection is established by its receipt, with ledger effect after posting/approval. Frozen handoff: `CONTRACT_SETTLEMENT_MAINTENANCE_EVOLUTION_PLAN.md`, including its dated integration clarification. Earlier Limousine partial invoice work and unrelated working-tree changes were preserved.

## Result and decisions

| Concern | Decision and source evidence | Final source |
|---|---|---|
| Expected versus collected money | Preserve editable contract terms; never treat Advance/Deposit inputs as a payment. Booking already returns receivedDeposit separately | Booking/Rental/Lease captions, extension summaries, Rental list/export/print use expected amount keys |
| Plain advance | Approved posted receipt credits customer AR; explicit allocation later, bounded by source remaining and target saved AR due | ReceiptService and JournalVoucherService |
| Refundable deposit | Deposit receipt credits the linked deposit liability account; raw deposit receipts excluded from ordinary allocation sources | ReceiptService.BuildAndSaveJvAsync, JournalVoucherService.GetOpenReceiptsAsync |
| Tax advance recognition | Source is a posted live AdvanceTaxReceipt. Backend derives gross/net/VAT, writes one full source reservation, preserves saved tax amounts | InvoiceService.GenerateTaxAdvanceCoreAsync; existing tax policy/resolver |
| Tax advance use | Reverse original net and VAT credit lines proportionally; preserve their account/partner/cost center/job/branch metadata. Bridge credit settles the actual saved invoice AR debit. Source and target pair links persist together using tracked line identities rather than save order | InvoiceService.AllocateTaxAdvanceCoreAsync; FinancialNumberPolicy.AllocateProportionally |
| Historical ambiguity | Missing/incomplete receipt reservation or missing credit-line origin fails closed. Detail returns nullable balances with reconciliation indicator | HasCompleteTaxAdvanceReceiptReservationAsync and typed tax detail |
| Deposit use | Posted live source required; original liability is released to a source-owned posted customer receipt. Existing usage.ReceiptId stores lineage. Optional explicit invoice allocations reuse shared service atomically | CustomerDepositService.UseDepositCoreAsync |
| Deposit refund | Positive currency-valid amount bounded by remaining source; requested date/payment method/bank respected; legacy omitted values retain established fallback; partial refund preserves remaining usability | CustomerDepositService.RefundDepositCoreAsync |
| Concurrency | Tenant allocation lock precedes balance reads and spans all dependent saves. Sales lock precedes allocation; mixed Limousine writes acquire Limousine then allocation. Existing serializable collect transactions retain the lock internally | Receipt, Invoice, JV, Deposit, contract collectors, opening replacement/configuration/reset |
| Mutation bypasses | Used source receipts and generated journals remain source-owned; posted deletion blocked. Batches use guarded owners; receipt child routes refuse independent mutation; ordinary reserved credit notes protected | Receipt/child/CreditNote services; target invoice adapters; opening reset |
| Draft credit-note approval | Re-read current target due before posting, under the shared lock. Validate explicit saved source credit and target debit identities, customer/account/effective branch and money scale. Reject stale draft reservations when later effective payments consumed their target | CreditNoteService.ValidateReservedTargetsForApprovalAsync |
| Existing pricing | Limousine partial invoice total cap remains. Rental/Lease/Equipment/Transportation retain their pricing and interval owners; no new invoice frequency rule or FIFO allocation | Existing invoice generators preserved |
| Namesakes and missing surfaces | Supplier/staff advances and cash-bank deposits remain separate. No existing Angular CustomerDeposit Use/Refund consumer was discovered; no new module/menu invented | Bounded discovery artifact and frozen scope |

## Producer/consumer contracts

| API / request | Response / consumer |
|---|---|
| GET Invoice/TaxAdvanceCandidates with existing filter transport | Complete Results.entities; id/no/date/customerId/customerName/branchId/branchName/amount/tax/totalAmount/moneyDecimalPlaces. Typed TaxAdvanceService and dropdown |
| POST Invoice/GenerateTaxAdvance `{receiptId,invoiceDate}` | Existing Result.id array. Source owns customer, branch, amount and VAT. Legacy GenerateInvoices tax adapter resolves explicit ReceiptNo and uses the same owner |
| GET Invoice/TaxAdvance/{id} | Result.entity with saved identity/date/source caption/amount/tax/total and nullable allocated/remaining/requiresReconciliation; View/Print only |
| CustomerDeposit/Use/{id} | Existing request plus allocations `{invoiceId,allocatedNow,notes}`; original deposit ID response retained |
| CustomerDeposit/Refund/{id} | Existing amount/notes/paymentMethodId plus optional date/bankId; original deposit ID response retained |
| Receipt Add/Update | Existing editable header/document/card inputs; allocation children contain CreditNoteAllocationDetailId and AllocatedNow. Backend owns AllocationStatus and child metadata. No client tenant/calculated status payload |
| Receipt details | Additive CanEdit; UI hides/guards edit, delete and save for locked saved sources. Server remains authoritative |

No new grid or general ListVM expansion. Rental list monetary columns are `advance` → expected advance and `deposit` → expected refundable deposit; the existing ListVM properties remain `Advance` and `Deposit`, and export uses the same labels. Existing actual receivedDeposit stays a separate fact. The tax candidate dropdown is a complete lookup, not a paged grid.

## Source conformance evidence

| Concern | Book | Actual reference / shared owner | Compared target result |
|---|---|---|---|
| Tax routed editor bounds/title | UI1/3/13, screen08 | Workshop/Job/components/editor/editor.component.html; styles.scss sigma-editor-page/panel/form/body/scroll/footer; FeatureTitle | Same route host and shell chain; title inside panel, subtitle saved number, one inner scroll, fixed footer, empty feature SCSS |
| Calendar and transport | UI17 | DatePickerDirective; date-utils.dateValueValidator/parseDateValue | Date or typed string form; structured mask and matching placeholder; invalid text rejected; local date-only transport |
| Dropdown public type | UI16 and UI1 declarations | Installed PrimeNG Dropdown.options setter requires mutable any[] | Typed TaxAdvanceCandidate[] signal; complete typed source endpoint; optionLabel/optionValue/filter/body overlay |
| Errors/retry | UI22/28 | StateMessage public loading/empty/error; Job editor retry pattern; apiErrorMessage | Shared states, both failure channels, destroyed subscription cleanup, retry; currency retry forces reload of cached policy failure |
| Dirty exit | UI10/13/28 | ConfirmationDialogService.confirmDiscard; route CanDeactivateFn | Cold discard confirmation, pending/inflight guards, form frozen during confirmation, success pristine before navigation |
| Money precision | BE15, UI19 | FinancialNumberPolicyService.currencyDecimalPlaces; financial-number.util.decimalDigitsInfo | Backend preview's actual precision and loaded policy for saved values; explicit en-US Latin digits. Fixed-two-decimal MoneyPipe would lose supported currency precision, so this scalar display uses the existing dynamic precision utility. No frontend financial formula |
| Existing Receipt UI | UI2/14/15; frozen bounded adapter | Current Receipt typed forms, EditorTabs and EditableCollectionTable | Updated payload ownership, type-dependent allocation tabs and read locks. Existing routed shell/layout remains a compatibility adapter; this task does not claim a complete Receipt visual redesign |
| Financial persistence | BE5/8/14/15/18 | InvoiceService; JournalVoucherResolver; UnitOfWork.ExecuteUniqueWriteAsync | Existing posting/tax/account/period engine; source-owned journals; one transaction for source, receipt, usage/counter and allocations; shared tenant lock; no nested independent transactions |
| Allocation balances | BE15 | JournalVoucherAllocationQueryExtensions.WhereLedgerEffective | Both headers live/posted/nonvoided, same-tenant live details and correct ownership. Document source ID may coexist with its matching explicit JV/detail IDs. Reads and writes share predicate |
| Mapping | BE4/14 | ReceiptProfiler; ReceiptAllocationDetailProfiler; existing CustomerDepositUsage profile | Receipt child/status maps ignored because service owns reconciliation. Child direct write maps removed with blocked direct writer. CanEdit calculated after read. Usage receipt ID assigned by owner; no ReverseMap or entity calculation changes |

## Changed file groups

Backend repository: `F:/My Work/Sigma/SigmaBackend`.

- Accounting: `SiGma.Business/Services/VouchersServices/{InvoiceService,JournalVoucherService,CreditNoteService,ReceiptService,MiscellaneousInvoiceService,TransportationInvoiceService}.cs`; `Services/EquipmentRentalInvoiceService.cs`; `Extensions/{JournalVoucherAllocationQueryExtensions,InvoiceSettlementWriteGuard}.cs`.
- Deposit/source guards: `Services/BanksServices/{CustomerDepositService,PDCReceivableService}.cs`; `Services/ReceiptAllocationDetailService.cs`; `Services/BookingService.cs`; `Services/AgreementServices/{RentalAgreementService,LeaseAgreementService}.cs`; `Services/AccountServices/OpeneingBalances/{OpeningBalanceDepositService,OpeningBalanceBatchService,OpeningBalanceResetService}.cs`.
- Contracts/maps/resources: `IServices/IInvoiceService.cs`; `SiGma.ServerAPI/Controller/InvoiceController.cs`; `MapperConfig/{ReceiptProfiler,ReceiptAllocationDetailProfiler}.cs`; `SiGma.ViewModels/ViewModels/Receipt/{ReceiptAddVM,ReceiptUpdateVM,ReceiptDetailVM}.cs`; ReceiptAllocationDetail Add/Update VMs; CustomerDeposit Add/Update/Refund VMs; CustomerDepositUsage Add/allocation VMs; new TaxAdvanceInvoice candidate/generate/detail VMs; both GeneralMessage resource XML files.

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

- Tax editor TS/HTML/empty SCSS, new `Invoice/models/tax-advance.ts`, new `services/tax-advance.service.ts`, `invoice.routes.ts`.
- Receipt details TS/HTML, `Receipt/models/{create,details}.ts`.
- Expected labels: Rental Booking details; Rental Agreement details/list/export/print; Lease Agreement details, Extend Period, Extend Rate/Period including summary cards; EN/AR locale keys.

Earlier reported Limousine compilation fixes remain preserved. Other pre-existing source changes in the shared repositories are not attributed to this settlement pass.

## Verification and remaining acceptance

Source-only syntax/local-import/export/literal-translation scan passed for 17 TypeScript files and 10 HTML templates, with 29 relevant literal translation paths/prefixes plus both tax locale families. This includes the three files involved in the earlier four Limousine template/type errors. Parser checks do not establish TypeScript or C# compilation. Scoped Git diffs were reviewed independently in both actual repositories; no whitespace errors in the scoped diff. Both resource XML files parse and contain no duplicate names; 64 settlement-related backend message keys exist in both languages. Runtime SQL query translation, posting, concurrency and visuals remain owner-pending.

Recipe drift check: phase01 current; PLAN00 and phases00/02–06 stale. Canonical books governed the work; the owner must regenerate and semantically review those packets. Generated packets were not edited.

Known compatibility limits: historical deposits credited to AR cannot be silently reclassified and fail original-liability validation. Historical tax origins require owner reconciliation. Deposit journal view includes source, linked use journals and the existing latest refund pointer; a complete historical per-refund lineage UI/schema was not added. Existing unused receipt/credit-note void toggle semantics were preserved; a general cancellation/reversal workflow is a separate voucher evolution owner. No claim of repairing old posted data or completing that separate workflow.

Owner checks:

1. Compile Angular and .NET, including controller wrappers, renamed minimal receipt child inputs, public standalone imports, and EF projections/navigation predicates.
2. Save a contract advance without receipt; verify no collection or available settlement credit. Collect/approve plain advance and refundable deposit separately; inspect journal accounts.
3. Generate a tax advance once; reject duplicate/unposted/voided/inactive/wrong-customer source. Settle partially then finally; ensure saved net/VAT reversal totals and final invoice due reconcile exactly, including changed current account links.
4. Use/refund deposit partially and concurrently; source-used plus refunded must never exceed source amount. Invalid target among multiple targets rolls back the complete use. Check customer/branch/money precision, closed period and missing accounts.
5. Attempt edit/delete/unapprove/void used receipts, reserved credit notes, generated journals, allocated target invoices, batch writes and direct receipt-child writes; confirm backend blocks bypasses. Save a draft credit-note allocation, consume its target with a posted advance/payment, then approve the credit note: reject amounts exceeding the updated due and preserve draft state. Development reset must reject posted/used opening sources without deleting anything.
6. Check candidate/detail/policy failures and retry; dirty close, double Save, local date typing, route query return, print, EN/AR, RTL, theme and responsive scroll; ordinary Receipt/Sales/card/credit-note workflows remain correct.

No entity/EF/schema change: no Add-Migration required. No migrations/snapshots edited. Suggested commits only: frontend `fix: distinguish expected contract amounts and source-backed advance receipts`; backend `fix: guard customer advance and deposit settlement by posted source balances`.

Applied phases0/1 discovery/freeze; 2 source lookup/read integration; 3 typed write/receipt child reconciliation; 4 source/target financial actions; 5 route/API integration; 6 source reconciliation. No screenshots supplied. Build/test/lint/browser/runtime/database/deployment verification deliberately skipped under AGENTS.md. No migrations, model snapshots, Graphify, Sigma MCP, commits or pushes executed.

Agent integration: bounded prior accounting, deposit and frontend/receipt workers produced isolated source changes under the frozen contract; root integrated resources, wrappers, lifecycle locks, bypass guards, DTOs and complete reconciliation. Prior workers used gpt-5.6-sol for financial/aggregate work; inherited workers were retained for bounded frontend source work. Follow-up workers hit usage limits, so root completed repairs locally without further delegation. Exact billed time/cost is unavailable; the reason for delegation was independent file ownership and reduced waiting, with root retaining financial decisions and verification.
# Compiler feedback follow-up — 2026-10-07

| Status | Implemented — source-only |
|---|---|
| Owner verification pending | yes |

Owner supplies CS0103 FinancialNumberPolicy/BookingStatus, five CS1061 controller calls, CS8605 UOW original-value unboxing, and CS0114 CustomerDeposit.UpdateCoreAsync. Source repair authorized in those declarations/helpers only; retain all prior settlement/accounting changes. Backend shape remains pattern3 financial aggregates and shared tenant-persistence guard, not a new workflow.

| Concern | Book | Actual reference/owner | Frozen repair |
|---|---|---|---|
| Missing types | BE5/15 | Actual `SiGma.Helpers.Helpers.FinancialNumberPolicy` and `SiGma.Helpers.Enum.Booking.BookingStatus` definitions | Add their exact using directives to JournalVoucherService and ReceiptService |
| API interface members | BE5/6/18 | Existing IInvoiceService/InvoiceService three tax-advance signatures; ILimousineInvoiceService/LimousineInvoiceService CandidatesAsync/GenerateAsync; actual controller calls/project references | All five declarations already exist and match current source. Do not duplicate APIs or cast Service to concrete class; downstream stale-reference hypothesis awaits owner compilation after Business repair |
| Deposit private helper | BE5 | Actual generic Service.UpdateCoreAsync and CustomerDepositService explicit settlement-locked UpdateAsync/UpdateListAsync | Rename private helper to UpdateDepositCoreAsync and both local calls; preserve explicit lock/dispatch instead of hiding the base or introducing a new override |
| Tenant original value | BE18 | Current UOW sync/async ownership conflict helpers | Pattern-match both original/database subscription values as int before comparing; missing/wrong-type values classify as an ownership conflict, with no tenant fallback or null-forgiving unboxing |

Master5 source conformance and phase01/05 integration repair apply; no UI/grid/domain-action/schema/AutoMapper/formula/route changes. Recipe check: phase01 current; PLAN00 and phases00/02–06 stale, canonical books used; owner regeneration/semantic review pending. No delegation because the repair is small and closely coupled; no build/tests or other prohibited commands authorized. Final status/check evidence to follow.

Final compiler-feedback checks: added exact local imports in `JournalVoucherService.cs` and `ReceiptService.cs`; renamed the private CustomerDeposit helper and both callers (no base-dispatch or settlement-lock change); removed nullable unboxing in both UOW conflict helpers with int pattern guards. Non-null integer comparison and database-row-missing behavior remain unchanged; incomplete original/database tenant identity now fails closed as an ownership conflict. Reviewed the complete scoped Backend diffs separately from the coordination workspace, preserving the earlier financial edits. `git diff --check` passed. Inspected actual shared type declarations, generic update dispatch, global usings and project references; matched all five interface/service/controller signatures and confirmed these methods already exist in the working tree. No duplicate API operation or controller workaround introduced. CS1061 errors are a source-supported downstream-reference hypothesis, not verified resolved diagnostics; owner must compile SiGma.Business then SiGma.ServerAPI and inspect fresh errors. No build/test/lint/browser/DB/migration/snapshot/Graphify/Sigma MCP/commit/push/deploy run. No new schema/mapping/domain-calculation changes; no migration for this repair. Suggested backend commit only: `fix(finance): resolve settlement compiler feedback and nullable guards`.

