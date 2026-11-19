# Accruals domain/API handoff

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-25 |
| Decision | Owner «كمل» following the explicit draft/approval/month-end accrual/next-month reversal proposal approves that financial workflow. This amendment supersedes the plan's initial blocked decision, retaining its discovery history. |

## Scope and conservative source decisions

Monthly rental revenue workspace: Prepare, save Pending snapshot, inspect charge calculation, export, saved runs, approval/history, paired journal read, Log, guarded UnApprove/Reject/Void/Delete. No lease/equipment estimates, tax postings, currency conversion, guessed legacy allocation, invoice writer changes or source data repair. Existing LinkAccounts.General.AccruedRevenue is the asset account. Revenue uses the same Rental RentPerDay mapping as current InvoiceAccountingService (all rental invoices currently use this mapping); per-charge rows are presentation/provenance, not a claim of per-charge revenue GL segregation.

Earned basis is cumulative from saved agreement start through the earlier of cutoff (first instant of next month) and saved ReturnDateAndTime; no extension beyond saved priced interval. Start inclusive/end exclusive. Recurring /DAY,/WEEK,/MONTH selected nonincluded charges use elapsed ticks / total priced ticks times saved TotalCharge, rounded by real base money policy. Eligible one-off charges earned at start; deferred fines/tolls and tax/discount pseudocharges excluded and disclosed in guide. Agreement.Discount allocated over all nonincluded selected gross by exact conserving money allocator; eligible share reduces earned amounts. No tax/receipt/deposit subtraction. Closed EndDate rendered from validated close source if available; otherwise saved priced end labelled through help and end left blank rather than asserted actual end. Capture immutable saved priced interval in detail.

Invoiced means ledger-effective Rental invoice net amount with invoice date before cutoff, not drafts/voids/deleted rows. Read RentalInvoiceItem linkage, legacy agreement-no-only invoices and ambiguity explicitly. Where all effective invoice net can be proven to concern one eligible charge, assign it there; multiple eligible charges without immutable historical attribution produce null AlreadyInvoiced/Accrual and a visible localized Issue (not fabricated proportions/zero). No invoice writer/schema change or historical backfill in this slice. Included/unsupported currency/history/negative source/pricing issues are visible; malformed identities/tenancy fail closed. Save and Approve reject a snapshot containing any unresolved issue; user corrects source then prepares again. This is deliberate source-supported coverage, not silent partial posting. Negative final accrual is retained, using opposite debit/credit directions on the same frozen account pair (corrects previously recognized excess; no customer balance/VAT changes).

Prior monthly accruals are always paired with their full first-next-month reversal; at each later month-end their net opening balance is zero. AccrualReversal operand is therefore explicitly zero under this chosen method and explained in the guide/dialog; never subtract previous accrual again. Estimate - invoiced - unreversed balance is the formula. Earlier months cannot be approved/changed behind a later effective approved run. One reserved live run per tenant/month; Rejected terminal and releases slot; Void retains history and releases slot. Approve reruns Prepare, compares preview/source fingerprint, validates mappings, references/currency, accounts and both open fiscal dates before posting. Atomic accrual plus reversal plus root/history in one existing explicit transaction. Serialize Agreement → InvoiceBase → JournalVoucherAllocation → AccrualRun consistently; preserve owner locks and no parallel scoped EF. Snapshot includes currency ID in fingerprint; currencies must match base (legacy null invoice currency denotes base). No client totals/state/account IDs.

## Typed HTTP contract (camelCase JSON, Result<T>/Result standard envelope)

**Source correction before implementation:** actual existing ApprovalStatus is Approved=0, NotApproved/Pending=1, Rejected=2. All API/root/history/default values below use that existing representation; the initial draft's swapped0/1 was corrected before producer/consumer integration. No new enum or adapter.

Base /Accruals; [Authorize]; dedicated service/interface, no generic CRUD overreach, no AutoMapper needed (explicit source projection/snapshot mapping).

| Verb/path | Request | Result entity |
|---|---|---|
| GET prepare | month yyyy-MM | AccrualPreview |
| POST runs | {month,previewKey} | Result.Id created snapshot |
| GET runs | month yyyy-MM required | AccrualRun[] complete bounded monthly history |
| GET runs/{id} | positive id | AccrualDetail |
| DELETE runs/{id} | none | Result; pristine Pending only (no history) |
| GET {id}/approval | none | Existing shared DocumentApprovalContext shape |
| POST {id}/approval | {approvalStatus:0|1|2,reason?:string} | Result;0 Approved,1 Pending,2 Rejected |
| POST {id}/void | {reason:string} | Result |
| GET {id}/journal | reversal:boolean default false | VoucherJournalLineDto[] |
| GET {id}/log | none | AuditTrailRowDto[] |

AccrualPreview: month:string, cutoff:string, currencyCode:string|null, moneyDecimalPlaces:number, previewKey:string, rows:AccrualRow[], totalAmount:number, hasIssues:boolean.

AccrualRow: key:string, agreementId:number, agreementNo:string|null, startDate:string, endDate:string|null, pricedEndDate:string, status:string (Open/Closed), chargeType:number, estimated:number|null, alreadyInvoiced:number|null, accrualReversal:number, accrual:number|null, issue:string|null. Key=agreement+charge identity, stable; rendered grid+calculation consumes all fields. Account/branch provenance is internal snapshot, not extra list fields. No TotalCount/paging: max1000 agreements,10000charges/history rows with explicit overflow failure, never truncate. Row TotalAmount only valid if !hasIssues; nullable cells display unknown. Count is rows.length.

AccrualRun: id:number,no:string|null,month:string,approvalStatus:0|1|2,isVoided:boolean,totalAmount:number,canDelete:boolean,canVoid:boolean.

AccrualDetail: AccrualPreview plus id:number,no:string|null,approvalStatus:0|1|2,isVoided:boolean. Stored snapshot rows returned even when sources changed. Approval revalidates against stored fingerprint; changed source requires deleting pristine draft/reprepare; no destructive update of approved history.

Shared approval context includes canApprove,canUnapprove,canReject,recordId,no,amount,approvalStatus,isVoided,history with previousStatus,approvalStatus,reason,statusDate,user,isVoid. Approved=0, Pending=1, Rejected=2. Reject and UnApprove nonblank trimmed reason<=500; Reject only Pending and terminal. UnApprove both linked journals together, both original periods open, no allocations, no later effective approved month. Reapprove can repost the same journals after identical source/account revalidation; do not create duplicate journals. Void both retained journals flag-only (no new reversal), validates both periods/allocations and later-month guard; actor derived server-side; reason/history atomic. Delete no posted/rejected/history/void rows. Journal endpoints validate owned root, both exact subtype ownership and return original or scheduled reversal only. Failed writes roll back all saves.

## UI ownership / conformance before implementation

UI05 monthly financial workspace exception (one root route, preparation and saved-run tabs), shared shell/title/filter/tabs/DataTable/summary/dialog/approval/journal/log. Catalog08 accounting concerns and BE15 govern actual financial effect. Canonical references: openingBalances financial workspace + Workshop/Job shell/list; inspect actual shared declarations. No create/edit/view routes for a conventional CRUD editor are invented: month preparation and immutable saved runs are the domain interaction demonstrated by screenshots. Row grid: Actions,agreementNo text,startDate datetime,endDate datetime,status text,chargeType text,accrual money,issue text (shown when actual issues exist). Calculation detail consumes estimated/alreadyInvoiced/accrualReversal/accrual and pricedEndDate. Run grid: Actions,no,month,approvalStatus,isVoided,totalAmount. Export all prepared rows with operands/issues and applied month; never only a visible page. Bilingual keys under accruals. Preserve signed values and unknown cells.

All operational data reads direct; no lookup endpoint/cache needed in this scope. No client account selector; mappings are existing Link Accounts. Global page progress uses subscribed start/finalize for Prepare/runs/detail/save/mutations; hidden-overlay approval/journal/log reads use existing shared local owners. One indicator, busy guards retained; inline errors use X-Skip-Error-Interceptor, mutation success only global interceptor. Context/month changes cancel reads, invalidate prepared state and use dirty discard for unsaved preview; no stale month result. Shared guide in vouchers-journals required. Runtime/component roots explicitly added only as current tsconfig contract requires.

## Persistence and index boundary

### Source reconciliation amendment — 2026-10-26

The approved policy is unchanged. Actual closure provenance is absent, so EndDate is always null and PricedEndDate remains explicit. Included package charges are excluded, not blockers by themselves. Source projection excludes complimentary agreements and Tax/Discount pseudocharges from discount weights. Discounts conserve the exact rounded amount through safe ratio-first, toward-zero shares and a capacity-capped residual; invalid monetary scale is a visible source issue. Valid signed rows can net to zero and still post; only a run with no nonzero lines has no journal to approve.

All legacy invoices without RentalInvoiceItem period provenance remain unresolved, even if one current eligible charge exists: the initial possible single-charge legacy fallback cannot prove old charge content. A current Invoiced flag requires linked period provenance; invoices dated after cutoff establish provenance without being deducted from that earlier month's earned amount. Effective linked credit notes are explicitly unresolved rather than ignored or split without evidence. These are conservative source-coverage decisions under the standing screenshot rule, not added posting effects. Unknown rows block the entire Save/Approve, with their localized reason visible and exportable.

Run No is an immutable AC-month-GUID snapshot identifier; actual journal numbers are allocated by the existing journal number service only at first approval. All internal source/decision/journal child identifiers are preassigned from the owning run, not passed through per-child document sequences. The approval comparison uses exact numeric/date/source equality, independent of decimal serialization scale. Reapproval posts the existing paired journals; scheduled reversal is distinct from flag-only Void. Log includes tenant-checked root, snapshot children, decision history, paired journals and their details (including captured deleted child history).

No invoice writer/history source was modified. No unresolved source field is fabricated. The implemented result intentionally exposes missing historical attribution as recoverable source issues. Exact routes, query/index/loading/cache evidence and owner acceptance are reconciled in ACCRUALS_FULL_STACK_REVIEW.md.

AccrualRun/AccrualRunLine/AccrualApprovalLog inherit EntityBase with tenant/audit; calculated snapshot decimals persisted. Run stores currency,month,fingerprint,total,approval,slot flag,both journal FKs and void audit; line stores source ids and immutable displayed/calculation/account/branch values. Explicit FKs/delete behavior, decimal precision18,2 compatible with current stored monetary schema, string bounds. Source-wide immutable history; no backfill of old invoices. Unique filtered tenant/month reservation index and per-run line key establish actual business uniqueness; range tenant/month supports monthly history. Rowversion/concurrency token if needed. New subtype names appended to preserve persisted enum numbers. Owner migration suggestion AddRentalRevenueAccruals; never create or edit migrations/snapshots.

No source speed measurement yet. Query budgets/index disposition, actual route/loading/cache evidence and guide reconciliation will be recorded in ACCRUALS_FULL_STACK_REVIEW.md at handoff. Root owns integration/final source diff; backend and UI file ownership can now be split without shared modifications.
