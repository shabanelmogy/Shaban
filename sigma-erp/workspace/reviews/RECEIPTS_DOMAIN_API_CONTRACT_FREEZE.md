| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-26 |

# Receipts frozen source and API handoff

User authorizes completing screenshot-backed Receipt. Existing canonical owner
decisions settle Save=draft, Approve=posting, reasoned UnApprove/Reject with
terminal Rejected, retained source/JV Void without reversal, GeneralReceipt
credit=chosen posting account, AdvanceReceipt credit=party, Deposit credit=
CustomerDepositsPayable. Old card contract remains: gross receipt, BankId for
transfer, card fee/VAT snapshot; settlement owns fee posting, no duplicate fee.

## List, routes and contracts

Authenticated GET /Receipt uses standard ListSmBase/Results<ReceiptListVM>, real
server Count/page/sort/filter; GET all uses same projection. No ListVM child
collections/card editor/audit flags. Grid fields in order (Actions first):
no,date,contact,contactCode,createdBy,agreementNo,quotationNo,amount,
receiptType,allocationStatus,approvalStatus,isVoided. Amount numeric money.
Minimum action fields: id,currencyCode,journalVoucherId,canEdit,canDelete,
canApprove,canUnapprove,canReject,canVoid,canJournal. No client ledger calculation.

Filters: no,agreementNo,receiptType,branchId,fromDate,toDate,paymentMethodId,
contactId,allocationStatus,voidedOnly,grid. False/absent voidedOnly means no
void restriction; true means only canceled. No hides-canceled default invented.
Agreement search includes actual Receipt.Agreement.No, SalesAgreement.No and
CustomerDeposit.Booking.No when the persisted link proves it; no BookingId field
invented on Receipt. quotationNo from SalesQuotation.No. Party display/code
prefers Contact then Customer, only owned live labels. createdBy is saved actor.
Numeric enum values unchanged. Dates calendar strings. Complete export/report
fetch all pages under same applied query, never export only visible rows.

Routes: /Receipt list, /Receipt/create, /Receipt/view/:id, /Receipt/edit/:id;
/Receipt/details/:id compatibility -> view. Actual editor still supports existing
embedded/modal inputs/outputs (sales/rental/lease/invoice callers); inspect and
preserve them. Shared block sigma-route-host ONLY for direct route, no local row
host geometry. Inner workspace owns one scroll region; source plus UI29 width
matrix required for empty/loading/error/populated states.

Add/Update retain current client inputs: salesQuotationId,salesAgreementId,
customerId,receiptType,date,branchId,contactId,amount,amountInWords,paymentMethodId,
bankId,detail,additionalDetail,documents,agreementId,transactionNo,batchNo,
lastFourDigits,expiry,allocationDetails. Add optional creditAccountId only for
GeneralReceipt; clear on other types. No currency write (current server source/
base authority), tenant/no/status/audit/calculated fees. Update adds id. Equal
contact/customer when both given, selected party preserved for historical source
contexts. General allows no party with valid chosen posting account. Other types
require existing party and appropriate existing source context. Reject malformed
IDs/enums/required dates/nonpositive or unrepresentable money, invalid references.

Detail retains existing fields plus no,contact/customer labels+contactCode,
branch/paymentMethod/bank labels,creditAccountId/creditAccountName,
approvalStatus,isVoided,journalVoucherId,canEdit,canDelete,canApprove,
canUnapprove,canReject,canVoid,canJournal. Allocation detail adds id and
targetJournalVoucherDetailId,voucherType to existing saved snapshot; no need
to return tenant/audit fields. Approval context and action flags backend-owned.

Party eligibility clarification (owner question2026-10-26): Partner is storage,
not unrestricted picker eligibility. Contact/Advance/AdvanceTax/AssetSale/Deposit
require Individual or Company customer; StaffReceipt requires PartnerType.Staff.
GeneralReceipt uses the chosen credit account, no customer requirement and no
receivable allocation. Both IDs when supplied must equal; retain historical
incompatible special receipts read-only, do not relabel/backfill them. UI labels
Customer for customer types and Staff for staff type. New GET /Receipt/parties
?receiptType= numeric -> Results<DropdownDto> uses this authoritative eligibility,
owned live active choices, no cache opt-in. Direct read keeps current policy;
no broad Partner/GetSelect picker. General returns no party choices.

## Receivable allocation: exact ledger targets, one source authority

New GET /Receipt/receivables?partnerId=&branchId=&receiptId= (optional) returns
Result<List<ReceiptReceivableVM>>; bounded complete max500 candidates (fail on501,
not truncate), no financial cache. partnerId+branchId required positive; resolve
owned partner/control account and base currency. receiptId must be current owned
record/context when supplied. Response rows:
targetJournalVoucherDetailId:int,voucherType:string (Invoice or JV),voucherNo:string?,
date:DateTime,detail:string?,amount:decimal,alreadyAllocated:decimal,
allocatedNow:decimal,due:decimal. For existing record, retain selected targets
and saved amounts even when no longer eligible, with issue:string? blocking Save/
Approve. No posted/edit mutation via this read.

Candidate = owned/live positive one-sided DEBIT ledger line with matching
PartnerId, partner account, effective branch and base currency; owned/live parent
JV posted+approved+nonvoid, foreign ambiguity excluded. Invoice label only when
actual owned effective invoice links prove provenance (InvoiceBase includes all
concrete types); otherwise eligible manual JournalVoucher JV, not arbitrary other
source-owned vouchers. Branch/currency/account/sides must match; exclude own JV.
Amount from debit line, never screenshot negative Due. AlreadyAllocated sums all
effective JournalVoucherAllocation rows on BOTH line sides and conservative
legacy unpaired header links. Batched/projection queries, no per-row database.

Draft allocation input: {id?:int,creditNoteAllocationDetailId?:int|null,
targetJournalVoucherDetailId?:int|null,allocatedNow:decimal}. Only new target ID
plus amount is authoritative; no client snapshots. Reject duplicate targets,
nonpositive sent amounts, over-row-capacity or total>receipt amount, invalid
owner row IDs, wrong context and scale. UI sends selected positive rows only,
all saved selections in full snapshot. Legacy CreditNoteAllocationDetailId rows
remain readable and are not converted to invoices; positive legacy write/approval
blocked with localized migration-required explanation. No legacy backfill.
Advance/AdvanceTax/Deposit/General do not accept allocation rows; preserve their
separate workflows. Contact/Staff/AssetSale use eligible matching ledger targets.

Persist nullable TargetJournalVoucherDetailId FK on ReceiptAllocationDetail
(restrict delete), server-owned snapshots. Retained row IDs/No/audit survive
tracked reconciliation; removed rows deleted through existing owner semantics.
Save records intent only. Approve revalidates all targets under existing lock,
posts receipt JV then creates JournalVoucherAllocation with target JV/id as
JournalVoucherId/DetailId and ReceiptId + own JV/credit line as other side.
Use existing allocation engine if its direction/contracts match; otherwise a
receipt-owned adapter preserving that engine's exact invariants, not duplicate
state/reader semantics. Full operation atomic across intermediate saves.
Do not settle cash debit line: source credit partner/control line only.
Save/Approve total allocation can be less than receipt amount (on-account rest).
Do not reserve ledger capacity for pending drafts; Approve can conflict and must
fail safely. No automatic allocation retries. UnApprove/Void blocked by active
allocations; no invented automatic removal/cancellation allocation.

## Lifecycle, history and compatibility

Keep lock order existing SalesAgreement -> JournalVoucherAllocation; all writes,
including activation/batch/legacy toggles, use or reject through same owner.
Save unposted JV only and NotApproved default; edit/delete only eligible pending
draft, no active settlement/downstream/source lock or inconsistent linked JV.
Rejected terminal cannot edit/delete/reapprove. Posted no delete. New records
manual single-step approval; existing enum0 Approved,1 NotApproved,2 Rejected.

GET /Receipt/{id}/approval -> Result<ReceiptApprovalVM> compatible shared
DocumentApprovalContext: recordId,no,approvalStatus,isLegacyUnproven,isVoided,
canApprove,canReject,canUnapprove,history[]. History id,approvalStatus,
previousStatus,reason,statusDate,user. POST same /approval body
{approvalStatus:0|1|2,reason?:string}; UnApprove/Reject require nonblank trimmed
reason<=500. Persist ReceiptApprovalLog in own file+configuration+DbContext;
do not fabricate legacy history/actors. Journal approval follows source action.

POST /Receipt/{id}/void {reason:string} requires Approved nonvoid valid effective
owned journal, original open period, no settlement/allocation/source blockers;
marks retained source+JV voided together. Add Receipt VoidReason(max500),
VoidedAt,VoidedBy(max50); derive actor server-side via existing HttpContext and
retain audit. No new UI UnVoid. Preserve historical compatibility ToggleVoid
only existing verified transition and route through same guards; canonical
reasoned void is used by new UI. Old ToggleApproval may approve only Pending,
never silently reasonless UnApprove/Reject; return explicit business error for
missing required reason rather than bypass history.

GET /Receipt/{id}/journal -> Result<List<VoucherJournalLineDto>> shared read
dialog (local progress); retained source-owned JV readable inclvoid history,
tenant-check children/labels. GET /Receipt/{id}/log -> standard action log
existing auditcapture, root+owned allocation/decision children only, bounded.
Captured legacy missing changes aren't reconstructed. Shared approval tab and
status modal consume same endpoint; Log remains independent.

Special direct PDC/deposit-used receipts or ambiguous/unproven source journals
remain read-only from generic editor/actions; do not require PaymentMethod on
PDC-generated historical read, do not migrate their producer effects. Existing
sales/rental/lease/deposit, card/bank rules and source guards preserved. Existing
payment-method contract superseded only for incorrect list/receivable source;
not its payment/card/BankId accounting. No broad FX or tax-policy changes.

## UI/shared/cache/performance/ownership

List/editor all typed, shared filter/date/money/status/table/actions/confirm/
reason/approval/journal/log/print/export/DocumentUploadTracker. Never blank error
callbacks, double success, hardcoded business labels or local palette. Global
progress for page reads/writes/export; local auxiliary lookups and body-appended
read dialogs, silent retained reference refresh. Cache only actual opted sources
(Branch/Customer/PaymentMethod etc); operational agreements/banks unless opted
remain direct with explicit reasons. Bootstrap finite then watch once; preserve
selected labels/draft, clear context and teardown. No new global caching.

Import DDAS has no source contract: report explicit unsupported status and do
not offer fake functional importer. Do not guess CSV columns/duplicate behavior.
Report/Excel use complete filtered data; Print and Save&Print use saved server
snapshot shared report/print lifecycle. Guide created bilingually and registered.

Root owns list read partial/ReceiptListVM/controller/interface, read DTOs,
resources, locale/topic registration, audit integration/reviews. Backend worker
owns ReceiptService core+new lifecycle/allocation partials, Receipt/entity
allocation+approval models/configs/DbContext, write/detail/allocation/approval DTOs
and ReceiptProfiler. Frontend worker owns Receipt feature files+new vocab/topic.
No overlapping edits; coordinate exact method/interface names with root.
No migration/snapshot/build/test/browser/database/commit/push commands.
