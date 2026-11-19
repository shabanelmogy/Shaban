# Card Transactions Bank Transfers — frozen implementation contract

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-06 |
| Authorization | User: «راجع … وطبق كل التعديلات طبقا للوثائق» |
| Packet drift | Generate-SigmaRecipes.ps1 -Check: every packet OK |

## Scope and decisions

Frontend owner: `SiGmaAngularFrontEnd/src/app/modules/Banking/Card Transactions Bank Transfers` and direct translations/routing/provider consumers. Backend owner: CardTransactionBankTransfer aggregate, DTOs, mappings, service/controller and EF configuration. Existing unrelated work is preserved. Initial scoped frontend files are clean. Existing backend scoped changes must be preserved if found.

UI screen 08 Financial document (routed Create/View/Edit, because totals + approval + journal), based on UI 1/13/14/19. Canonical list reference is Workshop/Job/components/list; editor shell reference Workshop/Job/components/editor; backend Pattern 3 reference InvoiceService. EntityBase and server numbering remain. Screenshots determine content only. No attachments, new permission mechanism, receipt-source rewrites, builds/tests/lint/database/migrations/commits/pushes/browser operations.

## Frozen API and consumers

- Root GET: ListSmBase + Results with CountAsync, page metadata and stable server sorting. Filters: `no`, `dateFrom`, `dateTo`, `bankId`, `branchId`; source Account label means destination BankId, as the existing ListVM comment establishes. Current month default; null means all. Sort stored `no`, `date`, `totalAmount`, `createdBy`, `approvalStatus`; Id tie-breaker inherited.
- Grid fields: Actions first, `no`, `date` (date), `totalAmount` (money), `createdBy`, `approvalStatus` (status including void indication). ListVM members beside them: `Id`, `No`, `Date`, `TotalAmount`, `CreatedBy`, `ApprovalStatus`, `IsPosted`, `IsVoided`. Remove unused navigation IDs/names, TotalNetAmount and JournalVoucherId from list; full Detail retains rendered fields.
- GET `GetByWithNavigationsId/{id}` returns id/no/date/bankId+name/paymentMethodId+name/branchId+name/description, totals, state and child source snapshots/financials; journal link only if UI renders it.
- POST/PUT root payload: date, bankId, paymentMethodId (required because BuildAndSaveJv requires its linked account), optional branchId, optional description(max500), details. PUT adds parent id. Child write: sourceReceiptId, commissionPercentage; PUT adds child id (0 for new). Date/voucher/no/description/amount are copied from source by backend, never client authority; commission/tax/net/totals excluded. Saved child IDs must belong to parent, duplicates rejected, full-snapshot omissions remove owned children explicitly.
- Existing GET `GetPendingCardTransactions`: receipt identity, date/voucher/no/description/amount and persisted default percentage/financials. Unsettled means no live detail under a live nonvoid transfer. A voided transfer releases receipts; unvoid validates they have not been settled elsewhere.
- Add GET `EditorOptions` with `moneyDecimalPlaces` and current `taxRatePercent`, both obtained from existing resolver/settings owners. Ordinary selects Bank/GetSelect, Branch/GetSelect, PaymentMethod/GetSelect retain their existing contracts. Angular service methods are typed.

## Calculations and business preservation

Commission per transaction visible in screenshot becomes an editor-only default percentage for selecting pending receipts; per-row override stays editable. It is not a new stored header amount. Default starts at 0 and does not overwrite persisted source percentage until explicitly changed. Rejected alternative: resurrecting a nonexistent header CommissionPerTransaction database field.

Backend owns source Amount, rounded Commission, document VAT allocated across rounded commissions with VatPolicy.AllocateDocumentTax (D4-4), Net=Amount-Commission-Tax, and header sums. Preview uses roundMoney/allocateDocumentTax with server base-currency precision; View uses saved authoritative amounts. Preserve existing accounts: Dr payment-method bank, Dr commission expense, Dr TaxPaid, Cr card clearing. Draft journal on Save; approval posts/unapproval unposts via existing resolver. No reclassification of accounting accounts.

Snapshot current settings VAT for new documents in nullable header `TaxRatePercent`; edit retains it. Legacy null uses existing current-settings behavior and captures it on the next edit, with no data rewrite/backfill. This minimal new schema element follows existing tax policy; owner runs suggested migration only. Existing tax calculation policy D4-4 and J-1 already approved in canonical BE15/decision sheet, not new accountant assumptions.

## Actions and states

View/Print: existing record, read-only. Edit/Delete: unapproved, unposted, nonvoid draft; backend allocation/dependency checks retained. ToggleApproval POST existing route: nonvoid unapproved/unposted -> approved/posted; reverse approved/posted -> unapproved/unposted after allocation checks. ToggleVoid POST existing route: void/unvoid through source-owned resolver policy, with period/allocation checks; unvoid rechecks receipt settlement availability. No new rejection/credit-note/downpayment/close-job/gate-pass/labour-time workflows: target lacks those aggregates. All Job reference actions classified: View/Edit/Delete supported; labour time, invoice customer, close, gate pass not applicable (no Job graph). Financial approve/unapprove/void/unvoid are supported existing target endpoints. Confirmation for delete and transitions; none for Save/Search/Excel/Print. Busy and pending-confirmation gates, same-row re-resolution, current applied list snapshot retained on refresh.

## Routes and outputs

List `''`; create with data.mode=create; view/:id and edit/:id with explicit mode. Existing details/:id is a compatibility redirect to view/:id. Query parameters preserve applied filters/page/size/sort; editor print request uses print=true, stripped when returning. Dirty exits use shared confirmation and route guard if already available. Save and Print loads saved authoritative detail before printing and never retries the mutation when only reload fails.

List Report and Excel collect all pages via fetchAllPages with frozen applied filters/sort. Report is a read-only EditorDialog + DataTable, no paginator; print session releases bounds. Row Print opens View. No invented report KPI or accounting total beyond existing server fields.

## Pre-edit conformance evidence

| Concern | Block | Actual reference | Shared owner | Target action |
|---|---|---|---|---|
| List fill/edges | UI1/3/6 | JobsComponent host + list HTML fill=true | styles.scss, FeatureTitle, DataTable | replace ms-lib shell, no feature shell SCSS |
| Filters/paging | UI4/17/28 | JobsComponent filterForm/search/bindListQueries/onLazyLoad | FilterPanel, date-utils, list-query | stableLayout, current month, applied snapshot, switchMap/defer |
| Export | UI8 | JobsComponent.exportExcel | fetchAllPages, dataTableExportRows | all applied rows, click-time translation |
| Editor/rows | UI1/13/14/15 | Job editor shell/FormArray | FormSection, EditableCollectionTable, EditableRows | typed aggregate, fixed footer, read-only derived cells |
| Validation/errors | UI19/22/27 | Job editor app-field-error | FieldError, StateMessage, focusField, interceptor | one feedback owner, recover failed reads/save |
| Print | UI21 | ReportPrintService.createSession/print | shared sigma-print-flow/isolation | all saved rows, no private print lifecycle |
| Financial save | BE15 | InvoiceService transaction/resolver path | UnitOfWork, VatPolicy, JournalVoucherResolver | source snapshot + ownership + existing posting policy |

## Verification boundary and residual risks

Source-only integration and complete scoped diff review remain root-owned. Owner checks delayed/failing Save, source receipts concurrently changed by ReceiptService, repeated actions, settlement races, VAT totals/journal balance, schema migration, Arabic/dark/narrow print/layout and authenticated headers. No source-only claim of runtime correctness. Existing unrelated shared backlog remains excluded. Reference and generated packet files remain unchanged.

## Integration correction — 2026-10-06

The earlier J-1 implementation assumption is corrected after inspecting
JournalVoucherResolver and the referenced frozen VOUCHERS_JOURNALS_MAINTENANCE_EVOLUTION_PLAN.md:
the resolver has no full-source void/reversal lifecycle, and V5 owns its coordinated implementation.
The per-document rule is decided, but its shared integration contract is not available in this screen.
No reversal identifier, void date payload, journal type, ledger/report inclusion policy or unvoid reversal
is invented in this task. The existing source-owned journal IsVoided compatibility path remains,
with open-period/allocation checks and receipt eligibility revalidation. J-1 conformance is explicitly
Pending / Conflicting, not claimed implemented; expanding the coordinated accounting slice requires
its frozen shared contract and owner phase handoff. This is a factual correction to the earlier
assumption, not approval of the compatibility behavior as the final accounting policy.

The obsolete standalone child route is retired to the aggregate list for every old URL. Child ids
cannot be mapped to aggregate ids; no redirect carries an old child id into a parent View route.
A shared composedReadErrorMessage capability was extracted under Master5, documented in UI22,
skill and changelog; its canonical-source promotion makes derivative packets stale, with
regeneration/semantic review pending. Initial pre-implementation drift check was fully OK.

## F5 reconciliation correction — 2026-10-06

The original account-preservation choice is compatibility only, not F5 conformance.
The frozen voucher evolution plan assigns F5 to V3: settlement credits the account
debited by the source receipt. Current ReceiptService.ApplyPaymentMethodRulesAsync
resolves a card receipt's debit through its payment-method link, whereas this transfer
still credits the general CustomerCreditCardDepositsAccount link. Those links may differ.
As in the existing CashDepositService compatibility path, the wider source-account
contract and prior-slice owner build handoff must be completed before replacing it.
No historical account inference, source-journal fallback, or account snapshot schema
is invented here. F5 remains Conflicting / pending coordinated V3 implementation.

Final source integration also uses a bounded DetailWithNavigationsAsync projection,
removes unused JournalVoucherId from Detail, preserves source No through EntityBase.No,
and rejects inconsistent approval/posting tuples at the backend transition boundary.

## Continuation source corrections — 2026-10-06

User requested continuation after the accounting handoff explanation. No build
verification or explicit phase-order override has yet been supplied. F5/J-1 remain
pending their affected handoff; independent confirmed defects were corrected:

- Capture each source No before the first master save and restore it after generic
  EntityBase numbering, before the next owning journal save. This preserves a null/empty
  source voucher number without re-reading or changing its amount snapshot.
- Update/delete reject a missing linked journal or a journal already posted/approved/voided.
  Check the old journal's open period before mutation; changing the document date must
  not bypass a closed original period. This follows BE15 and the source-supported
  CashDeposit consistency checks, with no new accounting transition.
- Reject null child elements and respect failed SaveChanges results throughout the
  multi-save operation; the outer aggregate transaction rolls back a failed Result.
- Rename the private update core to avoid hiding the generic protected virtual hook.

No schema/API payload or account/reversal policy changed in these continuation fixes.
