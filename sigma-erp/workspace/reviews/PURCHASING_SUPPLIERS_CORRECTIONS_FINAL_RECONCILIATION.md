# Purchasing and suppliers corrections — final source reconciliation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-25 |
| Backend baseline | 0bac8268dfd41cdc0373f31d55525d2e6a7f29cc |
| Frontend baseline | 2a9d69afeb52cb1d4b43fb47677726097f400cd3 |

Scope follows the post-changes feature review, corrections plan and three frozen
handoffs: confirmed corrections, goods return and ordinary Payment lifecycle.
Owner explicitly approved physical return plus linked independent financial
credit, same-order replacement receipt capacity, exact original bill net/discount/
tax and Pending Save -> explicit Payment approval -> independent settlement.
R06/currency development remains deferred. Existing data was preserved; no DB
cleanup, data repair or automatic historical approval/posting was performed.

## Findings and implementation

| Finding / capability | Final source result |
|---|---|
| R01 duplicate payable capacity | BillPayableCapacityReader recognizes both allocation sides, exact payable detail and tenant, effective posted settlements and Pending debit-note reservations. Add/Update/Approve recheck under the existing allocation lock; owned exclude-current choice is optional. Shared/unproven journal history fails with an actionable message. |
| R02 GRN dependencies | Read flags and mutation guards recognize the redundant stored receipt parent OR the actual receipt-detail parent. New return references also protect their source. Existing live/void/legacy policies remain distinct. |
| R03/R04 Return Edit | Existing financial list/View expose Edit using current server state. Matching successful detail + ready lookups + nonvoid/canEdit gate editing. Failed detail reads remain locked with Retry; saved fields freeze during Save and success can leave through the route guard. Wrong-kind legacy URLs route to the correct goods editor. |
| R05 saved labels | View renders saved branch/supplier/counter-account names independently of mutable option lists; Edit retains missing selected labels without granting source eligibility. |
| R07 guide | PO guide now describes compatible multiple direct orders, selection before editor Save and excluding lines through the picker rather than zero quantity. |
| Physical return | Existing Return aggregate gains Goods kind and exact GRN/Bill detail segments. Pending returns reserve source capacity. Approval checks current branch stock and source availability, then deducts quantity once without a journal. Approved quantities reopen the same PO line. |
| Financial credit | Explicit creation from approved billed returned lines; derived amounts and original accounts are read-only. Quantity/value reservations and final rounding remainder preserve exact original net/tax. Approval creates the supplier debit and original cost/tax credits; no second stock movement and no fabricated allocation. Paid bills leave a supplier debit balance. |
| Source posting proof | Bill approval stores builder-produced PostedNetAmount/PostedTaxAccountId on tracked lines within its transaction. Original source correction is blocked while active returns depend on it. Old unproven source lines are not guessed or backfilled. |
| Receiving/billing/reports | Shared approved Goods query feeds branch stock, current/detailed stock, GRN preparation/choices, PO receipt filters/progress and Pending Receiving. Unbilled ReturnedQuantity is distinct from bill draft reservations and excluded from billable capacity. Approved GoodsCredit reduces net invoice coverage once. General/Job direct billing remains separate. |
| Reversal | Physical undo/void checks active credits and replacement receiving capacity. Credit unapproval/void checks owned/unshared/unallocated journal and period. Rejection is terminal; final credits release reservations. Previously approved records retain history. |
| Payment | Save is a Pending header + owned positive dated amount rows. Approval resolves method type/category/branch and posting accounts and creates Dr partner / Cr method journal. Settlement is independent. PDC uses /PDCPayable; loan/payroll/down-payment payments cannot use ordinary mutations. Detail/list action flags share actual guards. |
| Shared UI/cache | Goods uses SourceDocumentPicker, typed action dialogs, FormSection, EditableCollectionTable, shared approval tab/status and Log. Composite receipt+bill keys retain numeric picker identity; unavailable retained rows stay unavailable. Payment uses the same shared owners and attachment cleanup. Source GetSelect readers use root cache/watch; capacity queries are operational. |

Final audit also aligned GoodsCredit Void visibility with journal ownership,
allocation and original-period checks, and physical undo visibility with its
no-journal rule. Credit and Void dialog forms freeze through the existing helper
during their writes; credit amount cells use the shared MoneyPipe.

## Contracts and conformance

| Concern | Canonical owner / reference | Target source |
|---|---|---|
| Aggregate with financial effect | BE15/18; JournalVoucherResolver and frozen model lifecycle | PaymentService.Approval, PurchaseReturnService.GoodsCredit; source-owned journals and atomic allocation lock |
| Source conversion without immediate financial effect | BE14/15; GRN source proof and stock balance reader | PurchaseReturnService.Goods/GoodsActions; line-level FKs, no master source summary |
| Routed financial editor | UI13/14/15/19/22/28; Workshop Job editor shell and actual Bill read/edit gates | Existing financial Return corrected, Goods editor and Payment editor |
| Collections/picker | UI13/14; SourceDocumentPicker and EditableCollectionTable public declarations | Stable composite adapter IDs, inline integer quantities, Apply stages only; parent mutation frozen during picker/dialog |
| Approval/status/Log | UI7/13; PurchaseOrder pattern and shared DocumentApprovalCycle | Same persisted history in tab/status dialog; typed reasons; server decides eligibility |
| Lookups | UI2/16/22; BaseService, ReferenceLookupBindings, cache and realtime owner | Finite bootstrap, active watch, retained IDs, Retry; new Customer/PaymentMethod source topics reflect actual producers |
| Read contract | BE3/7/9; lean scalar projections and list materialization | Payment grid: Id, type, date, branch, partner, method, approval/void. ListVM: those scalar fields plus CanEdit and existing base. Return grid adds Kind to existing no/date/branch/supplier/code/detail/amount/status; existing compatibility fields retained. |
| Persistence | BE1/2/15; sealed EF configurations | New GoodsLine, PaymentApprovalLog, restrictive source/account FKs, nullable legacy Payment approval and original Bill posting proof |

New endpoints reuse Result wrappers: goods-sources GET, goods POST/PUT, goods-credit
POST; existing Return approval/void/log remain owners. Payment approval GET/POST
and void POST are typed. Existing generic financial Return writes cannot mutate
Goods/GoodsCredit; derived credits cannot be manually edited. Payment type,
approval, journal, tenant and computed totals are not client-editable inputs.

Detail inputs, shared required inputs/events, C# namespaces/global imports,
SDK source inclusion, Angular explicit runtime files and affected symbol consumers
were inspected. No new generic permission system, dependency library, duplicate
modal/picker, palette, custom financial posting engine or private cache was added.

## Verification and owner acceptance

Source diff was reviewed separately in both application repositories, including
new untracked files. `git diff --check` found no whitespace errors. C# SDK project
references cover Helpers -> DataAccess/ViewModels/Repos -> Business -> API.
Angular runtime additions are explicit in tsconfig.app.json; specs remain outside
the app entry list. Static resource and route names were reconciled; this does
not prove compilation, query translation, visual layout or runtime behavior.

Owner must generate/review/apply migration **PurchasingReturnsAndPaymentLifecycle**
for Return Kind/ApprovedAt/GoodsLines, original BillDetail posting proof and
Payment approval/void fields/logs/FKs. No migration or snapshot was created or
edited by the agents. Existing payments remain nullable legacy/read-only and
old billed lines without posting proof cannot be automatically credited.

Required owner checks after migration and rebuild:

- Receive ten, bill eight and return two unbilled: no supplier debt; two excluded
  from original receipt billing, two reopened on the same PO; reports agree.
- Return two billed, create one-unit credit drafts twice, approve in either order:
  exact source capacity/value, independent approval, no duplicate stock effect.
- Include a fully discounted zero-value bill line with a positive-value source:
  quantity proof retained, only positive components produce journal lines.
- Split tiny net/tax values across quantities, reject/void a credit and recreate:
  no negative component, no overcredit; final active quantity uses exact remainder.
- Pay the bill first, then approve its returned-line credit: outstanding supplier
  debit remains available for a later valid settlement/refund workflow.
- Receive replacement quantities, then attempt physical unapproval/void: blocked
  until the downstream receiving dependency is resolved. Race competing stock
  issue/return/receipt/bill/credit approvals and check one committed capacity.
- Attempt cross-tenant/wrong-source/duplicate/foreign-owned IDs, changed branch,
  missing posting proof and shared journal: visible failure, no partial mutation.
- Save/approve/reject/unapprove/void Payment, original period closed, active
  allocations, source-generated payments and cheque: correct guarded effect.
- Fail initial detail/lookup, refresh active choices, cancel source selection,
  retry Save/attachment cleanup, change same-route credit ID, keyboard/RTL/themes/
  narrow layouts: draft and focus preserved; no duplicate save or stale record.

No build, test, lint, browser/application execution, DB, migration, snapshot edit,
commit, push, deployment, Sigma MCP or Graphify operation was performed. Those
verification categories remain explicitly pending for the owner.

## Documentation and delegation

Applied phases 0–6 proportionally: discovery/frozen contracts, list/detail/action
implementation, route/cache integration and source reconciliation. No new
screenshot was provided for this slice; historical screenshots were functional
background, not a new visual design mandate. The only deferred business slice is
currency work R06; build/runtime/migration are owner verification boundaries.

Updated in-app Return, Bill, PO and Payment guides through the existing reader.
Content owners are frontend `UserGuide/content/purchase-returns-topic.ts`,
`bills-topic.ts`, `purchase-documents-topics.ts` and new `payments-topic.ts`,
registered through `record-list-topics.ts` / the existing voucher-group guides.
Existing sidebar links `/UserGuide/vouchers-purchasing` and
`/UserGuide/vouchers-cash` remain the owning entry points; no duplicate guide
screen/menu was introduced. Source conformance is reviewed; visual/runtime guide
verification remains pending. `reviews/INDEX.md` now routes to these handoffs.
Promoted reusable findings into BE15/UI13 and the execution skill with a dated
revision; regenerated all eight recipe packets through their generator, reviewed
dependency/provenance and approved reference roles, then -Check passed all eight.
Pre-existing documentation-repository changes were preserved.

Three bounded agents were used after freeze to reduce wall-clock time: a Payment
audit/action-flag worker, a Goods UI worker and a stock/receiving reader worker
(gpt-5.6-sol). Their owned files did not overlap. Follow-up quota failures left
partial integrations; root completed them, reviewed contracts/diffs and owns the
final result. Earlier service-limit attempts produced no changes.

Suggested commits only:

- Backend: `Complete supplier goods returns and ordinary payment approval lifecycle`
- Frontend: `Add linked goods-return credits and unify payment approval workspace`
- Documentation: `Document supplier-return effects and shared source-picker safeguards`

See per-slice artifacts for the detailed reader path map and Payment action-flag
decision. This is implemented source, not a claim of operational release readiness.

## Compiler feedback correction — 2026-10-25

Owner reported CS0246 in PaymentService.Read and dependent API CS1061/CS1501.
Tier S correction: replaced the unused Helpers.Exceptions import with the actual
SiGma.Business.Resolver namespace, where both JournalPostingException and
FiscalYearConfigurationException are declared. A using in another partial-class
file does not import a namespace into this compilation unit (Master5).
Compared IPaymentService, IPurchaseReturnService and IDebitNoteService against
their implementations and controller calls: all reported methods and the
three-argument debit-note signature already exist and match. ServerAPI has the
correct Business project reference; no duplicate declarations or artificial
overloads were added. Remaining dependent diagnostics are consistent with an
older Business output after the producer compilation failure; owner rebuild
must confirm this inference.

Applied Phase1 contract/import inspection and Phase6 source reconciliation only;
no UI, business, DTO, mapping or schema change, so current guides remain valid.
No subagent was used for this single-file sequential fix. Recipe check passed
all eight packets. Source diff/whitespace inspection only; no build/test/lint,
runtime/DB/migration or commit was run. No additional migration is required.
Suggested backend commit: `Fix payment read exception namespace import`.

## Angular compiler feedback correction — 2026-10-25

Tier S: owner supplied repeated TS2416 and TS2322 diagnostics for the goods
return editor and PurchaseReturn list. Scope is the two incompatible member/type
declarations and the existing bilingual screen guide. Existing user changes
remain intact. No separate freeze is required (Master1 proportional process).
Existing PURCHASE_RETURN_GOODS_CONTRACT_FREEZE.md remains authoritative:
Goods uses screen02/master-detail without a financial effect; derived GoodsCredit
uses screen08/financial effect. Backend contracts are unchanged by this repair.

Pre-edit conformance decisions:

| Concern | Book | Reference / producer | Shared owner | Target decision |
|---|---|---|---|---|
| Local detail busy state | UI1 base component; UI22 local busy flags | Workshop/Job/components/editor/editor.component.ts: loadingData and loadDetails; shared/service/base-component.service.ts: protected loading is LoadingService | BaseComponentService / LoadingService | Rename GoodsReturnEditorComponent.loading to loadingData; preserve guard, start and finalize reset; no base-class change |
| Numeric enum filter | UI6 public column filters; Master5 type safety | Workshop/Job/components/list/list.component.ts: status filterType numeric; shared/components/data-table/data-table.component.ts: DataTableFilterType | DataTableComponent | Change kind filterType number to numeric; preserve field kind and numeric choices 0/1/2 |
| User instructions | Master7 guide completion | UserGuide/content/purchase-returns-topic.ts and existing reader | Existing purchasing guide | Explain Kind column filtering in both languages |

Recipe drift check passed all eight packets before use. Applied only the relevant
Phase2 filter and Phase3 detail-state checks, followed by scoped source
reconciliation; other implementation phases are unnecessary for this repair.

Final result: Implemented — source-only; owner verification pending: yes.
The three conformance rows above now match source. Files changed in this slice:
`components/goods-editor/goods-return-editor.component.ts` (five local-name
references), `components/list/list.component.ts` (one filter-type literal), and
`UserGuide/content/purchase-returns-topic.ts` (one bilingual instruction), all
under the existing frontend module paths. This reconciliation record was appended.
The complete scoped tracked diffs and the pre-existing untracked goods-editor
TypeScript file were inspected separately in the actual frontend repository.
Whitespace inspection passed, including the untracked file via no-index check;
no stale local loading references or merge markers remain in the touched source.
Template loading inputs still refer to their own lookup/save state. Kind choices
remain numeric 0/1/2, matching PurchaseReturnKind. Existing route imports resolve
to the same editor. No new translations or imports were required.

Guide handoff: `src/app/modules/UserGuide/content/purchase-returns-topic.ts`,
topic PURCHASE_RETURNS_TOPIC, existing purchasing guide/menu
`/UserGuide/vouchers-purchasing`; source evidence is the list's kind column,
DataTable's translated option menu with Apply/Clear, and existing topic/sidebar
registration. Existing lifecycle instructions were preserved. Guide runtime,
RTL/theme and visual acceptance remain pending.

No screenshot evidence or unresolved business decision applies to this bounded
compiler repair. No backend, DTO/ListVM/grid-column membership, API, AutoMapper,
domain calculation or schema change was made; no additional Add-Migration is
needed for this repair. This does not remove the earlier feature's migration
requirements. No new reusable rule was established beyond existing UI1/6/22.
Subagents were not used: two tiny dependent source-contract corrections do not
meet the independent-workstream/cost gate.

Owner checks: rebuild the Angular application to confirm both supplied
diagnostics disappear; open goods-return View/Edit and check loading/Retry and
busy protection, then Apply/Clear each Kind filter and verify its result list.
Source inspection cannot prove compiler or runtime success. No build, tests,
lint, database commands, migrations, browser/application verification, commits,
pushes, deployment, Graphify or Sigma MCP commands were run.
Suggested frontend commit: `Fix purchase return loading member and numeric kind filter`.
