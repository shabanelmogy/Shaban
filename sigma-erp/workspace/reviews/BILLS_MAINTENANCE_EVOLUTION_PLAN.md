| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Bills maintenance/evolution — incremental list stage, 2026-10-20

Owner will supply details one by one. First-stage evidence is the Bills list screenshot only (C:/Users/user/Desktop/1.PNG). Root initially began discovery; the owner's continuation makes each supplied screen the delivery boundary. This first stage includes discovery/freeze and implementation of the list/read outputs, not the editor or accounting actions. Exact handoff: BILLS_LIST_CONTRACT_FREEZE.md.

## Inventory, impact and classification

| Current owner | Finding | Decision | Consumers / risk |
|---|---|---|---|
| Bill/BillDetail entities + five BillType values | Existing persisted purchase document, totals/JV/loan/documents, no Bill approval/due-date/void/deal fields | Keep | Existing editor, GRN locks, DebitNote allocations, journal, vehicle expense readers |
| BillService Add/Update/Delete | Immediate posted JV; allocations lock edits; current posted-delete behavior conflicts with canonical J-1; detached graph update; line-rounded VAT is known backlog24 | Keep untouched in list stage; Refactor only in later financial/editor stage | Accounting semantics require separate frozen handoff; no broad source change from screenshot |
| BillService list + BillListVM | Oversized navigation graph, scalar-name mismatch with frontend | Refactor | Lean scalar read; no schema/backfill |
| Bill list component/adapter | Local paging, wrong supplier-name ID filter, array.vehicle scalar, Deleted typo, no complete output | Replace in place | Same /Bill route; shared canonical list; remove obsolete grid adapter |
| Effective JV allocations | Bill A/P line can be on either allocation side | Extend read projection | Derive due/Open/Closed only with valid posted source; no writes, paid flag or invented full balance |
| GRN source links | Multiple line GRNs; real PO/LPONo source available | Extend read projection | Stable distinct source references; no new PO/GRN identity or price conversion |
| Search and loan-plan APIs | Existing compatibility consumers | Keep | POST search date meaning preserved; inaccurate/ignored DueDate/Status/ApprovalStatus legacy inputs not promoted blindly |
| Read reports | Screenshot Report/Tax Report/Excel | Create minimal read-only outputs | Shared report owners; complete applied result; saved tax figures, no tax recalculation |
| Due date, approval/deal filters and mutation menu | Missing source or later workflow | Defer | No fake state, guessed date or enabled placeholder action |
| Fine generation/import | Settings names but no confirmed Bill producer/import | Defer | Need next evidence/source identity/idempotency; ImportFines is not ImportBills |
| BillDetail dead/duplicate route roots | Two /BillDetail definitions, first points Billing/BillDetail; unrelated placeholders | Keep for later explicit cleanup | Avoid broad routing/root deletion during list delivery |
| Help/translations | Generic bill guide only | Extend list topic and EN/AR | Existing /UserGuide/invoice reader/menu; future editor topics wait for next screenshots |

## Decision register and alternatives

Selected existing Bill aggregate, explicit scalar read projection and canonical list. Rejected a parallel bill system, reuse of nonfinancial PO lifecycle, local page filtering, JV-approved→Bill-approved mapping, LoanPaymentPlan.DueDate as universal due date, supplier contact-group TODO as supplier ID, and a one-sided allocation sum. No changed accounting behavior is authorized by the first list stage.

Confirmed: five types, fields, saved totals, immediate posting, source GRN/JV links, real allocations and creator audit. Derived: distinct PO/vehicle labels, due from both-sided effective supplier-line allocations, Open/Closed from known outstanding. Missing/deferred: Bill approval and configurable cycle (Settings future), universal due date, deal relationship, fine bill producer/import, new void/reversal/action APIs. Conflicting known debt: per-line VAT, detached child writes, posted-document delete. These do not block a read-only list but must be frozen/corrected before later write refactoring.

Date label decision: existing search calls Bill.Date the creation/document date, so the list retains that behavior; it does not silently switch date filters to audit CreatedAt. Current month and current branch are reversible list defaults. Unsupported approval values remain empty, not Pending or Approved. Historical missing accounting sources stay unknown; list does not rewrite them.

## Ordered delivery slices

| Slice | Outcome | Gate / scope |
|---|---|---|
| First/current | Shared Bills list/filter/ledger-derived due, report/Excel/tax read; guide + EN/AR | Frozen read contract, source-only. Existing writes/editor preserved. |
| Next supplied details | Bill editor/header/type-specific rows, saved view/print and documents | Owner supplies screen details; freeze full-snapshot typed inputs and GRN/loan ownership before editor changes. |
| Financial hardening with editor | Validation, decimal bounds, once-rounded VAT, explicit child reconciliation and existing posting transaction/account ownership | Preserve existing postings until a source-supported explicit new policy; no source-generated migrations. |
| Next supplied actions | Allocation/journal/void/approval interactions | Freeze action states, reversal/date/fiscal locks and settings-owned future approval configuration. Existing J-1 governs posted history. |
| Separate supplied producer screens | Fine bills/import and final complete-feature reconciliation | Identify real source/idempotency/import schema; no inference from button labels alone. |

## Compatibility and verification

No entity/EF schema or existing-data changes in the list stage; no migration needed for it. Preserve earlier PO/GRN work and owner migration/snapshot files. Existing BillService and Bill editor mutation routes/contracts stay intact. No full-solution scan, build, tests, lint, browser/database/migration/Git write/deployment. Root owns final scoped source/diff review and reports pending owner runtime checks, including null historical ledgers, both allocation orientations, saved totals, enum0/false, paging/report completeness and responsive/RTL/theme/print. Agents may implement only their non-overlapping frozen list/read files after root freeze.

No reusable canonical rule is introduced: feature-specific decisions stay in these artifacts; existing books/skill/packets are unchanged and the eight-packet drift check passed.

## Stage 2 owner evidence and freeze — 2026-10-20

The owner subsequently supplied Bills/2.png..9.png and the IsLoan dialog workflow, authorizing the editor stage. The first-stage boundary above is historical. The new frozen handoff is BILLS_EDITOR_CONTRACT_FREEZE.md: replace the existing untyped editor in place; integrate the existing loan aggregate and whole-GRN selection; retain immediate journal posting and configured cost-account ownership; correct false-loan dereference, FK/child validation, tracked snapshot reconciliation and canonical document VAT in the owning methods. Loan metadata creates no payments/disbursement or extra financial posting. Existing posted deletion is blocked under J-1; no void/action subsystem is added. No entity field/schema change or migration is planned. Root owns reconciliation, translations and guide, with three non-overlapping implementation workers after the freeze.

Stage2 delivered at source-only boundary: see BILLS_EDITOR_FEATURE_REVIEW.md for final implementation inventory, conformance, source checks and pending owner acceptance. The five-type editor and loan draft reuse the existing Bill aggregate; no schema/migration or historical-data rewrite. The first-stage list and owner PO/GRN migration/snapshot hashes remain unchanged. Approval/action/fine/import producer stages remain deferred to their own supplied evidence.
