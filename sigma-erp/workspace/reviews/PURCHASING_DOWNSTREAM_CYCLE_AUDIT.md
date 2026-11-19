# Purchasing downstream cycle audit

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Scope | Source-read-only backend audit: Bill, Purchase Return, and linked GRN/PO consumption, allocation, posting, correction, and void behavior |
| Repository | `F:\My Work\Sigma\SigmaBackend` |
| Evidence date | 2026-10-21 |

## Governing evidence

- Followed `F:\My Work\Sigma\AGENTS.md`, `SIGMA_FEATURE_REVIEW_MASTER.md`, the applicable stateful aggregate/detail-write/action/transaction guidance in `SIGMA_BACKEND_PATTERNS.md`, and the Sigma screen-refactor operational digest.
- Recipe drift check passed all eight generated packets: PLAN-00 and PHASE-00 through PHASE-06.
- Frozen Bill decisions were treated as constraints: Save remains draft-only; Approve owns posting; UnApprove is available only without dependencies; Void is terminal flag cancellation without a reversing JV; cash and paired allocations remain source-owned; supplier-debit allocations consume capacity in either allocation direction; approval configuration is not added to document models.
- No application source, configuration, migration, or snapshot was changed. No build, test, lint, runtime, browser, database, migration, commit, push, or deployment command was run.

## Confirmed findings

### P0 — Purchase Return does not implement a purchase-return business transaction

**Evidence.** `PurchaseReturnService` contains only the generic service constructor (`SiGma.Business/Services/VouchersServices/PurchaseReturnService.cs:5-12`), and `PurchaseReturnController` exposes only the generic controller surface plus list (`SiGma.ServerAPI/Controller/PurchaseReturnController.cs:8-17`). The aggregate stores a header and a list of generic voucher-allocation-looking rows (`SiGma.Helpers/Models/Purchases/PurchaseReturn.cs:3-12`), while each row stores only voucher type/reference/date and caller-controlled `Amount`, `AlreadyAllocated`, `AllocatedNow`, and `Due` (`SiGma.Helpers/Models/Purchases/PurchaseReturnDetail.cs:3-12`). Add and Update accept those same financial outputs from the client (`SiGma.ViewModels/ViewModels/PurchaseReturnDetail/PurchaseReturnDetailAddVm.cs:8-16`; `PurchaseReturnDetailUpdateVm.cs:7-17`). There is no Bill, BillDetail, GRN, GRN line, PO line, item, asset, quantity, account, journal, tax, or stock-movement identity in the aggregate.

**Failure scenario.** A supplier return can be saved with any positive, negative, inconsistent, or over-allocated figures and any free-text reference. Saving it does not prove that the original purchase exists, that the supplier/branch matches, that the quantity was received and not already returned, or that the monetary amount matches the original persisted purchase snapshot. It neither returns stock/assets nor reduces the supplier payable/input VAT. The original Bill therefore remains financially and quantitatively untouched while the UI can display an apparently completed return.

**Invariant violated.** A return must consume a verifiable remainder of the original posted/received source and its posting must be derived from that source. Client input cannot own historical allocation totals, due values, or journal effects.

**Minimal safe fix.** Do not extend the generic rows as though they were an accounting engine. First freeze the return source and granularity contract (Bill/BillDetail and, where stock/asset provenance requires it, GRN/GRNDetail or PO detail), supported return types, quantity/amount/tax derivation, inventory effect, and debit-note/JV ownership. Then replace generic Add/Update/Delete behavior with an aggregate service that validates source ownership and supplier/branch/type, recomputes every amount from persisted source snapshots, checks cumulative non-voided returned quantity/amount under the same purchasing write lock, and saves the return plus its owned inventory/accounting artifacts atomically. Remove `AlreadyAllocated`, `AllocatedNow`, and `Due` from client-editable DTOs; expose computed read values only if the approved UI needs them. This likely requires a migration after the owner freezes the missing source-link and lifecycle schema; no migration was created in this audit.

### P0 — Purchase Return has no posting, correction, or terminal cancellation lifecycle

**Evidence.** `IPurchaseReturnService` declares no domain actions (`SiGma.Business/IServices/IPurchaseReturnService.cs:6-11`); `PurchaseReturn` has no approval, posted, void, journal, audit-log, or correction state (`SiGma.Helpers/Models/Purchases/PurchaseReturn.cs:3-13`); and the controller defines no approval, unapproval, posting, or void endpoints (`SiGma.ServerAPI/Controller/PurchaseReturnController.cs:8-18`). Its mapper uses unrestricted `ReverseMap` for detail/list/add/update (`SiGma.Business/MapperConfig/PurchaseReturnProfiler.cs:10-13`), so generic Save is the only transition.

**Failure scenario.** A user can edit or delete a saved return indefinitely, but there is no point at which inventory and accounting become effective, no immutable approved source snapshot, no dependency check for correction, and no terminal void record. Conversely, treating current Save as financially effective would post nothing.

**Minimal safe fix.** Preserve Save as draft. The existing code does **not** establish that Purchase Return should receive a new approval state, so do not copy Bill/PO approval fields or settings by inference. Freeze one explicit lifecycle decision: either (a) Purchase Return has explicit Approve/conditional UnApprove/terminal flag-only Void and Approve creates the source-derived inventory/accounting effects, or (b) another existing approved document (for example the supplier debit-note owner) is the posting owner and Purchase Return remains a draft/source-capture document linked to it. In either design, prevent generic mutation after posting/effect creation and retain audit history. Follow the approved application-wide void policy only after ownership is frozen; do not create a reversing JV by default.

### P1 — Purchase Return cannot enforce return capacity or serialize competing returns

**Evidence.** The model and DTO evidence above contains no stable source-line key or quantity. `PurchaseReturnService` has no `ExecuteUniqueWriteAsync` boundary and no read/recheck of existing non-voided returns (`PurchaseReturnService.cs:5-12`). The empty EF configurations only select table names and add no source uniqueness/concurrency constraint (`SiGma.DataAccess/Configuration/PurchaseReturnConfig.cs:3-8`; `PurchaseReturnDetailConfig.cs:3-8`).

**Failure scenario.** Two users can concurrently save returns against the same typed reference, each for the full apparent amount. Neither request observes or reserves source capacity because the typed reference is not a relational source identity and no server calculation exists. Even a sequential second return cannot be rejected reliably.

**Minimal safe fix.** Once the source contract is frozen, calculate capacity as `original eligible quantity/amount - sum(effective non-voided returns excluding the edited draft)` by stable source-line id. Execute the read, validation, return persistence, and owned posting/inventory persistence inside the same established purchasing unique-write boundary. Add a database concurrency/uniqueness safeguard appropriate to the frozen cardinality; keep the service-side cumulative check because partial returns require a sum rather than a simple unique key.

## Confirmed downstream behavior that should be preserved

- **PO to GRN quantity consumption:** GRN drafting sums linked live, non-voided GRN details by `PurchaseOrderDetailId`, includes the explicitly handled legacy receipt shape, rejects negative/overflow/over-received totals, and excludes the current editable GRN (`GoodsReceivedNoteService.cs:544-631`). GRN Add/Update/Void use the purchasing unique-write boundary; Void is blocked when Bill or ItemIssue references exist (`GoodsReceivedNoteService.cs:644-671`).
- **GRN to Bill consumption:** Bill treats a GRN as a whole-document source. Selection excludes any GRN consumed by another live, non-voided Bill (`BillService.cs:501-519`); write/approval preparation rechecks the same condition and reconstructs all live GRN lines from persisted receipt data (`BillService.cs:1001-1040`). Add, Update, Approve, Remove, allocation, and supplier-debit allocation share the purchasing lock (`BillService.cs:660`, `719`, `1308-1311`, `1594-1595`; allocation partials). This is a coherent full-GRN billing contract; a partial-GRN billing requirement would be a new contract, not a confirmed defect.
- **Bill posting/correction:** approval rehydrates and validates the saved source snapshot, verifies recalculated totals, creates/posts the owned JV, then records approval (`BillService.cs:1313-1369`, `1397-1452`). UnApprove blocks live allocations, paid loan/deposit/installment/revision history, and retained supplier-debit dependencies before unposting (`BillService.Unapproval.cs:12-47`, `50-149`).
- **Bill Void:** validates owned posted history and absence of allocations/payment dependencies, retains the original JV, and marks Bill/JV void without an opposing entry (`BillService.Void.cs:14-100`). This matches the frozen terminal flag-only policy.
- **Allocation capacity:** standard Bill allocation and supplier-debit allocation both run under the `JournalVoucherAllocation` plus purchasing unique-write boundaries and sum reservations in both source/target directions. No separate confirmed capacity/concurrency defect was found in the inspected paths.

## Existing approval capability; no inferred state

| Document | Current source-backed lifecycle |
|---|---|
| Purchase Order | Explicit manual approval state and approval history; approved orders feed GRN selection. |
| Goods Received Note | No approval state. It is an active operational receipt with guarded edit/delete and terminal void; downstream Bill/ItemIssue references lock it. |
| Bill | Draft Save, explicit Approve/post, conditional UnApprove/unpost, terminal flag-only Void. |
| Purchase Return | No approval capability and no posting/void lifecycle. This is a confirmed missing business-cycle decision, not evidence authorizing a newly invented approval state. |

## Reconciliation and boundaries

- The earlier Bill review fixes for retained one-to-one draft identity and live deleted-navigation filtering were not reported again.
- No defect was assigned to full-GRN Bill consumption: current selectors and writers consistently enforce that contract and serialize competing writes.
- The Purchase Return findings are schema- and workflow-significant. Implementation remains blocked on the exact source document/line, inventory effect, accounting owner, lifecycle, and correction/void decisions. Approval settings must remain outside the document model.
- Source-only verification included the complete scoped working-tree diff check. The repository is heavily dirty from ongoing Bill/PO/GRN work; those changes were preserved. `git diff --check` reported no scoped whitespace errors, only existing line-ending notices.
- Owner validation pending: compile, automated tests, migration generation/application, runtime/API concurrency tests, database posting reconciliation, and end-to-end inventory/AP/tax verification.

