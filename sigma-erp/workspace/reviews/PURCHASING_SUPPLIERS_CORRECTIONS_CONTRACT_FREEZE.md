# Confirmed purchasing corrections — frozen implementation handoff

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-25 |

Implements review R01,R02,R03,R04,R05,R07. R06 and new currency work are deferred
by the owner. Later physical-return/Payment capabilities need separately frozen
effect contracts; this handoff does not authorize guessed accounting treatment.

R01: authoritative Bill payable capacity recognizes allocations on either ledger
detail side, precise journal/line/tenant identity, posted nonvoid effective
settlements, and existing live pending debit-note reservations. Exclude current
note from competing reservations on update/approval. Invalid/unprovable capacity
fails visibly rather than appearing available. The same reader powers debit-note
Bill choices, Add/Update and approval; recheck under existing allocation lock.
Preserve base-currency-only posting and existing proportional reversal policy.

R02: both GRN dependency guards match the stored receipt parent OR actual source
detail parent. Preserve each guard's deleted/void/reference policy and existing
tenant filters, stock guards and locks. No backfill/data repair.

R03-R05: expose Edit from list/View only for current server canEdit; enforce loaded
matching record, canEdit, nonvoid and no failed detail read before enabling Edit.
Create retains normal lookup readiness; errors preserve draft and expose typed
detail Retry. View uses saved read labels for branch/supplier/counter account,
not unpopulated live selects. Add optional BranchName/SupplierName strings to
PurchaseReturnDetailVM and its mapper, consume existing CounterAccountName;
add same optional read fields to Angular details model. No Add/Update fields or
schema change. Merge retained display-only options for Edit without widening
operational source eligibility. Reuse existing shared action menu, FormSection,
StateMessage, FieldError and Sigma read fields, not a parallel presentation.

R07: owning PO guide describes multiple compatible direct source orders, picker
insertion before main Save and removal via picker; keep Bill guide in agreement.
Update existing bilingual Return guide for actual Edit/read/retry behavior after
source conformance. Root owns docs/books/skill/packets, translations and backend
Return read contract; frontend worker owns Return list/details/models/test-source.
Root currently owns financial capacity and GRN fixes. No overlapping file edits.

Conformance: BE8/14/15/18 financial capacity/reference proof; UI7 shared ActionList
with canEdit and transient busy; UI13/14/15/19/22/28 shared editor read/form and
recovery. Existing BillDetailsComponent.openEdit/editable/loadDetails is the
financial source reference; actual shared declarations remain presentation
authority. POST/PUT and approval response wrappers unchanged. Both failure
channels handled; success feedback stays with the existing global interceptor.

No build/test/lint/browser/runtime/DB/migrations/snapshot/commit commands.

## Implementation amendment — 2026-10-25

Root completed/integrated all confirmed R01/R02/R03/R04/R05/R07 corrections.
Controlled agents later handled isolated goods UI/readers and Payment flags,
then root integrated and reviewed their source. Worker follow-ups hit quota;
root completed partial outputs, API wiring, source guards, translations/guides,
posting snapshots and final review. No overlapping concurrent file ownership.
The debit-note chooser adds an optional owned Pending excludeDebitNoteId query
parameter; old callers remain valid. The same reader rechecks capacity at Save
and approval and rejects shared Bill journals. No new currency behavior.
