# Bills — conditional UnApprove implementation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-20 |
| Contract | BILLS_CONDITIONAL_UNAPPROVAL_CONTRACT_FREEZE.md |

## Scope and decisions

Owner explicitly requests the conditional UnApprove concept after discussion: state/dependencies/open period determine availability. Old screenshots prove variable UnApprove visibility but not the exact reference-system rule; the current owner decision, source resolver/dependency models and new Frozen contract own implementation. This supersedes the old Bills-only terminal-Void-only restriction. Application-wide Void remains flag-only, with no reversal journal. No approval Settings UI or permission system is introduced.

UI stays financial document screen08; backend BE15. Applicable phases0/1 discovery and freeze,2 minimal read flag,3 existing View action wiring only,4 transition,5 transport/refresh,6 source reconciliation. No new editor/grid/filter/export layout; no new fiscal-period public API. Approve/Edit are traced because UnApprove makes them reachable again. Initial all8 recipe drift checks pass.

| Decision | Evidence/result |
|---|---|
| API | Reuse POST Bill/{id}/unapprove, bodyless Result and existing interface/controller |
| State | Approved/nonvoided -> NotApproved + source JV unposted; preserve original number/FK/lines, amounts, documents, schedule and append-only decision history |
| Availability | Server canUnapprove field only; no new display column or client-derived financial eligibility |
| Dependencies | Both allocation directions/header/detail ownership, retained paid EMI/payment-link history, retained positive debit-note target history |
| Period | Original posted date/year identity and MonthClose; batch list reads; POST rechecks under existing lifecycle/allocation locks |
| Special cases | Explicit approval only; legacy unknown remains unknown. Approved zero/noJV uses Bill date; linked-zero journals require review, no stale zero reapproval |
| Reapproval | Existing source-owned unposted journal rebuild through resolver after draft validation, no direct approved edit |
| Audit/schema | Existing BillApprovalLog records NotApproved through persistence actor/time stamps. No schema addition/migration for this slice |
| Confirmation | Shared warning describes unposting/return to draft; loader/busy/finalize and both failure channels; global success toast only |

Reference conformance: actual JournalVoucherResolver.UnpostAsync/AccountingPeriodService behavior inspected, InvoiceService financial source boundary selected by BE15, shared ConfirmationDialogService and existing Bill Approve action cycle match UI7. Target producer/consumer values and final checks recorded below after integration. Canonical BE15/skill must reflect latest owner decision; affected packets regenerated with semantic reference/hash reconciliation. Old contracts retain superseding pointer rather than rewritten history.

## Final source reconciliation

| Concern / owning rule | Actual producer and consumer | Result |
|---|---|---|
| Source action / BE15 | BillService.Unapproval.cs, RecordUnapprovalDecision, existing JournalVoucherResolver.UnpostAsync | Existing bodyless POST reused; explicit Approved state, same source identity and audited NotApproved decision. Existing allocation then PurchaseRequest tenant locks surround authoritative eligibility, resolver recheck and one save. Failure rolls back the transaction. |
| Financial dependencies / BE15 | BillsWithoutCorrectionDependencies + ReadBillCorrectionEligibilityAsync; CanEditBillAsync; ApproveCoreAsync | Header and actual detail allocation directions, retained paid EMIs/payment links and retained positive DN history (even voided/deleted) block correction. Shared/foreign/deleted/malformed source journals fail closed. Retained history is not deleted to unlock a bill. |
| Period / existing resolver | ReadOpenBillPostingPeriodsAsync and resolver EnsurePeriodOpenAsync | Batched fiscal-year/month reads; exactly one matching open year, stored fiscal identity parity and no closed month. POST checks again under lifecycle locks. |
| Flags / BE7, UI7 | BillListVM/BillDetailVM → camelCase Angular DTO → ActionList/View header | canUnapprove comes from the same authoritative eligibility as POST. Not submitted in Add/Update. CanEdit remains local for list calculation and is returned only in details. A linked-zero draft can be edited to correct it, but cannot be approved with an obsolete retained JV. |
| Source ownership / BE15 | Existing edit and approval paths | UnApprove retains original header/number/lines/FK; subsequent validated reapproval rebuilds and posts the same owned unposted header. No new reversal or deletion workflow. |
| Action cycle / UI7, UI22, UI28 | Existing Bill approve cycle, shared ConfirmationDialogService; new list/details unapprove handlers | Warning confirmation, record identifier, busy/duplicate guards, paired global loader/finalize, declared and HTTP failures, stale identity protection and existing refresh. Single global success-feedback owner. |
| Mapper / BE4 | BillProfiler read mappings | Ignore only new computed CanUnapprove on two read maps; service populates it. Existing aggregate input mapping remains; no new ReverseMap or gratuitous generic CRUD override. |
| Layout / UI screen08 | Existing typed ActionList and saved View header | No new form, tab, filter, grid column, permission API or local styling. Existing financial document layout and child actions preserved. |
| Cancellation / owner | Existing Void action/service | Terminal flag-only cancellation remains independent; no reversing journal and no automatic return to draft. |

The related DebitNote edge is included in the contract addendum. Final source evidence showed its CounterPayable journal keeps proportional expense/tax credits from the original Bill. Checking supplier/available amount alone cannot prove those old lines still match after editing the source. Therefore any retained positive DN target history blocks correction, including voided/deleted note/detail history. This supersedes the earlier live-only assumption and introduces no fingerprint, automatic rebuilding or historical deletion. Existing DN picker and Add/Update require posted targets; restore/approval now rejects draft/unknown Bills or unavailable source journals as well.

### Grid and read contract

Unchanged display columns, in order: id, no, billType, approvalStatus, isVoided, supplierBillNo, purchaseOrderNos, date, supplierBillDate, supplierName, supplierCode, totalAmount, dueAmount, status, createdBy, branchName, vehicles, discount.

BillListVM has those display properties plus the existing minimal action-state properties canApprove, canVoid, canViewJournal, canViewInstallments, canAllocate, canAllocateSupplierDebit and the new canUnapprove. No editor, journal-child, loan-plan, tenant, or unnecessary CanEdit payload was added. Tax-report fields/filters/export and Bill type badge placement are unchanged.

### Changed files for this slice

Backend root `F:/My Work/Sigma/SigmaBackend`:

- `SiGma.Business/Services/VouchersServices/BillService.Unapproval.cs` (new partial source), `BillService.cs`, and the direct dependency guard in `DebitNoteService.cs`.
- `SiGma.Helpers/Models/Vouchers/Bill.cs`.
- `SiGma.ViewModels/ViewModels/Bill/BillListVm.cs` and `BillDetailVm.cs`.
- `SiGma.Business/MapperConfig/BillProfiler.cs`.
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx` and `GeneralMessage.ar-SA.resx`.

Frontend root `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- `src/app/modules/Vouchers/Bills/Bill/models/list.ts`, `models/details.ts`, `services/bill.service.ts`.
- `src/app/modules/Vouchers/Bills/Bill/components/list/list.component.ts`, `components/details/details.component.ts`, `components/details/details.component.html`.
- `src/app/modules/i18n/vocabs/en.ts`, `ar.ts`, and `src/app/modules/UserGuide/content/bills-topic.ts`.

Documentation: canonical BE15, `.agents/skills/sigma-screen-refactor/SKILL.md` rule and revision history, the superseding pointer in `BILLS_ACTIONS_CONTRACT_FREEZE.md`, current contract and this review. Three derivative packets refreshed through the generator: phase01-domain-api, phase03-detail-write, phase04-domain-actions. Existing unrelated working-tree changes are preserved.

### Guide and documentation conformance

Existing Bills guide `src/app/modules/UserGuide/content/bills-topic.ts`, module `/UserGuide/invoice` (Vouchers), feature `/Bill`, now covers EN/AR eligibility, confirmation, return to draft, Edit/reapprove, retained journal/audit, zero/legacy cases, stale failures and independent Void. No new guide reader/menu route. Source content is reconciled; owner runtime/readability/theme/RTL verification pending.

BE15 and the skill explicitly supersede only the earlier Bills-only ban. Application-wide flag-only Void remains. Historical contracts/revision rows are retained as history. Generated diff was reviewed: BE15 dependency hashes reflect the current canonical block; approved InvoiceService/Job reference roles were not replaced, and prior unrelated canonical/template hash changes remain preserved. All eight recipe Check entries pass after regeneration. No generated file was edited manually.

### Source verification and limits

- Complete scoped source diff reviewed separately in each owning application repository; scoped `git diff --check` passes (line-ending informational warnings only). The new untracked C# file was separately checked for trailing whitespace and merge markers.
- Syntax-only parse: eight TypeScript sources and two Angular templates, zero parse errors. This is not compilation/type checking.
- Both backend RESX files parse as valid XML with no duplicate keys; new UI translation keys are present in EN/AR. Existing API/controller/interface route, read DTO casing, mapper and consumer flags were reconciled.
- Independent bounded financial source audit reports no actionable issue in the main accounting, period, dependency, concurrency, lifecycle or flag-parity implementation. Its focused follow-up identified the missing explicit Approved predicate on DN restore; the backend owner fixed it and implemented the final retained-DN refinement. The final narrow audit is CLEAR: retained positive same-tenant DN target history blocks independently of deletion/void state; restore requires explicit Approved and a valid posted source JV. Root inspected these final predicates/resources and repeated their whitespace/XML checks successfully.
- No schema change/migration for this slice. Previously required Bill/loan-payment migrations remain independent owner work.
- No builds, tests, lint, migrations, snapshots, database commands, browser/runtime verification, commits, pushes or deployment actions performed. EF query translation, compilation, runtime and race behavior remain owner-verification items.

### Manual owner verification

1. Approve an eligible positive Bill; confirm UnApprove appears in list and saved View. Confirm it returns to NotApproved, removes effective posting, retains JV number/lines and appends the actor/time decision. Edit/save/reapprove and confirm the same journal identity posts once.
2. Check dependencies in either allocation direction, paid/retained EMI/payment links, retained positive DN history (including voided/deleted), closed year/month, fiscal identity mismatch, shared or malformed JV and null legacy state. Hidden action and direct/stale POST must reject consistently without partial mutation.
3. Check zero/noJV Bill correction; editing an unapproved retained-JV Bill to zero must block reapproval and remain editable for correction.
4. Check positive retained DN history blocks Bill correction even when the note/detail is voided/deleted. Direct DN approval/restore must reject draft/unknown Bills or unavailable source journals. Check concurrent payment/allocation/correction serialization.
5. Check cancel/failure/repeated click/loading cleanup, same-page list/detail refresh, EN/AR/RTL/themes and retained Journal/Installments/Allocation navigation. Check independent Void still creates no reverse journal and remains terminal.

### Agent utilization and suggested commits

Root owns freeze/integration, translations, guide, books/skill/packets and report. Existing bounded backend and frontend workers were reused on disjoint file ownership to reduce wall-clock time; inherited models used for those workers. A focused financial auditor used selectable gpt-5.6-sol for read-only financial/concurrency review. Root inspected their outputs; no agent declares overall runtime acceptance.

Suggested only (no commits made):

- Backend: `feat(bills): allow guarded return of approved bills to draft`
- Frontend: `feat(bills): expose conditional unapprove actions`
- Documentation repository: `docs(bills): document conditional unapproval and retained void policy`
