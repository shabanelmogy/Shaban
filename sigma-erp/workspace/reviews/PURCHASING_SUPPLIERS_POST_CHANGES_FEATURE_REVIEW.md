# Purchasing and suppliers — post-change source review

| Item | Value |
|---|---|
| Status | Closed |
| Owner verification pending | yes |
| Date | 2026-10-25 |
| Mode | Source-read-only review; application source unchanged |

## Manifest and review boundary

Owner requests another review after the purchasing-cycle changes. Tier L review
of the existing module, not authorization for implementation or new accounting
effects. Scope: PR->PO->GRN->Bill and direct General/Job PO->Bill; supplier return,
settlement/payment/debit-note integration, approvals/logs, line provenance,
partial capacities, currency/branch rules and direct stock/report readers.
Supplier master is inspected only where its identity/accounts affect these paths.
Exclude unrelated accounting/shell refactors, data reset, migration creation,
build/tests/lint/browser/runtime/database/commits.

Existing source is extensively dirty from prior owner-authorized work. Preserve
all changes. Inspect current files and scoped diffs in the frontend/backend Git
repositories; reviews are local workspace records. No screenshots supplied for
this review. Earlier screenshots are historical context, not a new design brief.

Authority: Master1/4/7, screen02 routed aggregate and screen08 financial document,
BE8/10/14/15/18, UI7/13/14/19/22/28/29; approved source owners are the existing
document services, shared SourceDocumentPicker, EditorDialog/EditorTabs,
DocumentApprovalCycle, EditableCollectionTable and central document Log viewer.
Initial recipe -Check passed all eight packets. Use PHASE00/01/02/03/04/05/06
as read-only comparison boundaries, never as implementation authorization.

Consumed decisions: unified purchasing approval, partial GRN billing, GRN
detail-only provenance, request-to-order multi-source discount shares and
multi-order direct Bill frozen contracts. Current read/write/action contracts
remain unchanged. PR/PO are nonfinancial aggregates (BE14), GRN is a stock-effect
aggregate with no fabricated journal, Bill/financial Return are BE15 documents;
payment/debit note retain their actual lifecycle rather than fabricated approval.
Known return scope gap: current PurchaseReturn is financial only; an item return
to supplier is not implemented by an unused transaction enum value.

Read-only workstreams: root owns discovery, financial return/settlement, shared
effects and final integration; bounded reviewers inspect PR/PO, GRN/Bill and UI
contract wiring independently. All findings require an exact source trigger,
impact and file/line evidence; proposed behavior is distinguished from a defect
against an existing frozen contract. No new feature contract is frozen here.

## Reviewed source snapshot

Backend HEAD: `0bac8268dfd41cdc0373f31d55525d2e6a7f29cc`.
Frontend HEAD: `2a9d69afeb52cb1d4b43fb47677726097f400cd3`.
The initially dirty scope advanced to these committed snapshots during the
review, externally to this task. Final scoped diffs are empty; current source was
read directly, including the files introduced by the previous changes. This task
made no commits or application edits. Closed means this review is finished,
not that the cycle is defect-free or runtime-verified.

## Confirmed findings

### R01 — P1: Debit-note capacity misses a bill already settled by a purchase return

Normal-flow reproduction: approve a base-currency Bill for100, approve a financial
PurchaseReturn for100 allocated against that Bill, then open CounterPayable debit
note for the same supplier. The return saves its own journal as allocation target
and the Bill journal/line as the opposite source. DebitNote's chooser and write
validation only sum allocations with the Bill as the target. The chooser still
offers100 and validation permits a second100 allocation. Posting the note does
not recheck remaining capacity; it only checks that the Bill remains posted and
nonvoid and that its own journal is valid. Thus an already settled bill can be
settled again, even though every journal is balanced.

Evidence:

- `SigmaBackend/SiGma.Business/Services/VouchersServices/PurchaseReturnService.cs:535-541`
  writes JournalVoucherId=return journal, AllocatedJournalVoucherId=source Bill.
- `SigmaBackend/SiGma.Business/Services/VouchersServices/DebitNoteService.cs:514-520`
  chooser counts only billJvIds.Contains(allocation.JournalVoucherId).
- Same service`:695-702` validates only allocation.JournalVoucherId==Bill JV.
- Same service`:326-386` approval rechecks source availability/state but not
  remaining capacity; `JournalVoucherResolver.cs:362-388` validates journal
  accounts/period/balance, not allocation amounts.
- `BillService.Allocation.cs:147-155` already recognizes both detail directions.

Recommendation: use one authoritative two-sided payable-line capacity reader in
the chooser, Add/Update and approval; distinguish effective settlements from
explicit pending reservations and exclude the current note without losing other
reservations. Recheck under the existing shared allocation lock. Do not assume
an allocation's orientation from its document type. This is a new confirmed
integration defect, distinct from the older journal-balance findings.

### R02 — P1, conditional retained-data case: GRN guards miss its actual detail reference

A live nonvoid BillDetail with a correct GoodsReceivedNoteDetailId but a null or
wrong redundant GoodsReceivedNoteId is recognized by Bill's usage reader as a
reference/review case. GRN unapproval/void and deletion guards only match the
redundant parent ID. They can therefore miss the provable actual source and allow
stock-effect removal or a source mutation despite a retained downstream link.
New valid Bill writes derive both IDs correctly; this finding concerns retained
malformed/detail-only references, not ordinary fresh writes.

Evidence: `GoodsReceivedNoteService.cs:1071-1076` HasEffectiveReferencesAsync and
`:1098-1100` HasReferencesAsync, versus `BillService.cs:1310-1336` usage proof.
All paths are under `SigmaBackend/SiGma.Business/Services/VouchersServices/`.

Recommendation: match stored parent OR actual source-detail parent, retaining
each guard's existing deleted/void/reference policy. Apply the same principle
already used by IssueReferencesReceipt at`:1102-1105`. Do not repair data or infer
unprovable quantities during reads. Owner should exercise this deliberate
malformed-reference case separately from normal-flow acceptance.

### R03 — P2: A saved return draft has no ordinary Edit entry point

Save a return without allocations, then try to add them before approval. The
list offers Approval Status, Log and Journal; saved View offers approval,
journal, void and close. Neither exposes Edit, although an edit route and
canEdit response exist. The user cannot continue correcting a saved Pending
return through the application's normal navigation.

Evidence: frontend `Vouchers/PurchaseReturns/PurchaseReturn/components/list/list.component.ts:95-103`,
`components/details/details.component.html:87-94`, and `purchasereturn.routes.ts:13`.
These paths are under `SiGmaAngularFrontEnd/src/app/modules/`.
Recommendation: expose a shared Edit action using the actual server canEdit flag,
consistent with the document editor/action contracts; keep rejection terminal.

### R04 — P2: Return editor ignores server editability and successful detail loading

Directly open edit/:id for an Approved/Rejected/Voided return, or let detail
loading fail while lookups succeed. editable() only checks !view, !busy and no
lookup error; applyState() enables fields and Save accordingly. A missing detail
or canEdit=false does not lock it. The backend correctly rejects forbidden
states, but users are allowed to edit an unusable draft; on failed loading of a
real editable record they can compose an update without having read its previous
values. No detail Retry action is exposed in that error state.

Evidence: frontend return `components/details/details.component.ts:98-109`,
`:145-151`, `:179-190`; backend `PurchaseReturnService.cs:275-286` is the stricter
state guard. Recommendation: require a successfully loaded matching saved record
with canEdit and nonvoid state for Edit; distinguish Create, retained read failure
and lookup failure; provide detail Retry while preserving entered draft recovery.

### R05 — P2: Saved return View cannot resolve supplier/branch/account names

Open a saved return in View. The component calls loadDetails but loads lookup
options only in Edit. Its three option arrays remain empty, yet the template
renders disabled selects relying on those arrays. The saved IDs cannot produce
visible names. This makes review before approval unclear.

Evidence: frontend return `components/details/details.component.ts:98-101` and
`:145-151`; template`:24`, `:29`, `:38`. Detail DTO exposes IDs but no corresponding
supplier/branch/counter-account labels.
Recommendation: add the actual read labels to the detail read contract and render
shared read-only fields, or deliberately supply retained display options. View
must show inactive retained values without widening operational eligibility.

### R06 — P2: PR-sourced PO displays the current supplier currency instead of its source

Approve a request under currency A, change the supplier's preferred currency to B,
then create a PO from that request. Source staging stores the correct currency
code, and the backend persists A. The header passes only details()?.currencyCode
(null in Create) to DocumentCurrency, which falls back to supplier B. Users assess
the proposed amounts under a currency label different from the saved document.

Evidence: frontend `Vouchers/PurchaseOrders/PurchaseOrder/components/details/details.component.ts:1196`
and template`:134`; shared `components/document-currency/document-currency.component.ts:34-40`.
Backend `PurchaseOrderService.cs:929-930`, `:1021-1029`, `:1042-1043` preserves the
source/effective-currency set. Recommendation: pass staged source currency in
Create and saved detail currency in Edit/View. This is a display defect; the
stored PO currency was not shown to be corrupted.

### R07 — P3: PO guide still describes a single direct order and zero to omit a row

The PO guide says direct Bills keep one source order and quantity zero skips a
line. The newer Bill flow permits multiple compatible orders and keeps included
rows positive; remove a row by reopening its picker. The Bill guide describes the
new flow, leaving contradictory user instructions within the same cycle.

Evidence: frontend `UserGuide/content/purchase-documents-topics.ts:16` versus
`UserGuide/content/bills-topic.ts:14-15` and Bill editor quantity/picker contract.
Recommendation: update the PO topic to the final multi-order behavior when source
changes are authorized. This review does not edit in-app guide source.

## Known scope gaps, not new regressions

| Gap | Current evidence and consequence | Required next decision |
|---|---|---|
| G01 Physical supplier goods return is absent | PurchaseReturn/PurchaseReturnDetail have financial amount/allocation lines, no item/quantity/GRN source. TransactionType.Return_To_Supplier exists only as enum declarations. ItemReturn adds stock back from a Job; ItemIssue is Job-owned. Financial return deliberately does not reverse stock or infer tax. Existing guide states this limitation. | A frozen extension plan must choose physical return ownership, precise receipt/bill line source, quantity/serial/cost and tax treatment, unbilled versus billed behavior and financial linkage. Keep existing financial return capabilities instead of duplicating them blindly. |
| G02 Ordinary Payment still creates no journal | PaymentService.cs:38-47 and :51-68 save Payment rows only. It does not establish supplier ledger settlement merely by saving. Previously recorded as deferred journal review F1 and BE19 backlog20; no new finding claim. Dedicated loan installment/down-payment writers have their own real posted payment flow. | Complete the already known general supplier-payment accounting lifecycle in its own frozen authorized scope; do not infer it from approval patterns on other documents. |
| G03 Nonbase currency posting is deliberately blocked | JournalVoucherResolver.PostAsync calls EnsurePostingCurrencyIsBaseAsync. Selecting one compatible currency for source drafts does not implement exchange-rate posting. Already disclosed in prior cycle review. | Resolve exchange rates/accounting policy separately before claiming full foreign-currency purchasing support. |

## Positive source reconciliation and impact map

| Path | Current producer/consumer evidence | Result |
|---|---|---|
| PR->PO | PurchaseRequestService, PurchaseOrderService, PurchaseRequestOrderSourcePolicy and maps; matching selected detail IDs and per-source discount shares | No additional proven capacity/discount/lifecycle bypass found; R06 display issue remains |
| PO->GRN | GoodsReceivedNoteService source preparation derives each detail's PO IDs and immutable item/price/UOM metadata; shared picker stages compatible sources | Current structured source writes consistent; R02 retained-reference guard gap |
| GRN->Bill | BillService.cs:1209-1301 server-resolved source pairs, supplier/branch/currency/quantity/serial/capacity; :1304-1353 usage detects malformed refs | Approved invoiced and Pending reservations separate; edit excludes own amounts |
| Direct General/Job PO->Bill | BillService.PurchaseOrderSource.cs:178-370; existing compact picker, main editor Save, saved source set and quantities/accounts retained | Multiple same-type compatible orders accepted; no additional proven multi-order UI/backend defect found |
| Progress/status | PurchasingBillingProgressQuery quantity projection used by list/filter/count/export | Source-level approved coverage and draft reservations remain separate; actual SQL execution/performance pending |
| Stock effects and reversal | GRN stock branch reader and shared ItemRequisition source lock; approved GRN adds stock; generated IssueToJob remains a separate draft | No unguarded concurrent stock write established by source; R02 still affects source dependency proof |
| Pending receiving report | StockReportsService.cs:457-477 derives structured source order/item; :509-516 uses precise PO source proof | New linked receipts with LPONo=null are counted. Text/supplier/item matching is disjoint legacy fallback only; previous report caveat is not a new defect |
| Supplier settlement | BillService.Allocation.cs reads both detail directions and matching supplier/account/branch/effective currency; Return uses same allocation lock | R01 breaks this parity in DebitNote's one-direction reader/writer |
| Approval and Log | PR/PO/GRN/Bill/Return consume real approval contexts/history and shared panel; each exposes tenant-owned document/child GUID log reads | Model effects stay separate. Return editing/display issues R03-R05 do not grant backend transition permission |
| Guide/navigation | Purchasing menu contains PR/PO/GRN/Bill/Return plus /UserGuide/vouchers-purchasing | Topics exist in English/Arabic; R07 is stale; G01 is correctly disclosed |

No new business rule, DTO, state transition, permission, map, calculation or API
was introduced by this review. List/grid contracts were compared for directly
affected progress/actions, not redesigned into new screens. Existing approval
decision endpoints use their typed status/reason payloads; operational draft and
capacity selectors remain finite fresh reads outside reference cache. Correct
new source storage does not imply complete stock-return or payment capability.

## Recommended implementation order

1. Correct R01 first: authoritative two-sided financial capacities, including
   chooser, write and approval recheck under the existing lock.
2. Correct R02 dependency proof without weakening existing reference policies.
3. Complete R03-R05 together as the existing Return UI owner, then R06 and R07.
4. Freeze G01's physical-return plan and the known payment/exchange-rate gaps
   separately; these require business/financial decisions, not speculative fixes.

## Verification, migrations and delegation

This is a source review, not runtime acceptance. Root integrated three disjoint
bounded read-only reviewers: prior backend reviewer for PR/PO; prior frontend
reviewer for all five UI paths; prior API reviewer for GRN/Bill and a focused
stock-report follow-up. Existing agents/models were reused; no new competing
implementation or files. Parallel source tracing reduced repeat scans and kept
financial integration/root review independent. Root verified all reported issues,
discarded the unproved Return self-exclusion concern, and checked the financial
normal-flow R01 independently.

Initial/final recipe checks pass PLAN00 and PHASE00..06. Canonical sources and
packets were not changed. Frontend/backend scoped diff and whitespace checks
are clean at the recorded snapshots; no merge-marker, runtime type inclusion or
namespace failure was established by source inspection. Compilation is pending.

Owner-created migration files already exist for Bill received-line source,
approval history, direct Bill PO source, request discount shares, GRN detail-only
source and the later 20261024205422_modify-database change. The latter removes
old master source columns and adds detail source keys. This review neither
generates a replacement nor asserts database application. Confirm migration
application/state with the owner before runtime validation; no new migration is
required just to deliver this read-only report.

Owner checks after future authorized fixes: the100+100 duplicate-settlement
scenario; malformed retained GRN source pair; saved Pending return edit/reload,
read-only labels and denied Approved/Rejected/Voided edit; source currency A
versus supplier B; multiple partial PR/PO/GRN/Bill allocations and concurrent
capacity changes; release/retention on Reject/UnApprove/Void; totals and payable
statement agreement; SQL status filters/page/export; logs and bilingual guide;
browser narrow/RTL/theme/print recovery. Tests/build/database/browser were not
run. No application source/configuration/instructions/migrations/snapshots were
edited, and no commit/push/deployment was performed. Only this review and its
review-index entry changed; no commit message is proposed for unchanged source.
