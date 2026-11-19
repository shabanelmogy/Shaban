| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |

# Purchasing and suppliers — cross-screen review

Date: 2026-10-21. Authority: F:/My Work/Sigma/AGENTS.md, Sigma master + UI/BE canonical blocks and generated packets; `Generate-SigmaRecipes.ps1 -Check` passed all eight before use. Frozen presentation handoff and later screenshot amendment: `PURCHASING_SUPPLIERS_CYCLE_CONTRACT_FREEZE.md`. Source-only work; owner runtime/build/DB verification pending.

## Scope and selected shapes
| Screen | UI shape and backend owner | Approval meaning | Current source / impact |
|---|---|---|---|
| Purchase Request | Routed master-detail, BE14 | Manual Pending→Approved/Rejected and audited; no journal | Source-ready PO conversion only after approval |
| Purchase Order | Routed master-detail, BE14 | Manual Pending→Approved/Rejected and audited; no journal | Approved Stock/Asset may become GRN; Workshop Job type is Job-origin only |
| Goods Received Note | Routed master-detail, BE14 with stock Issue-to-Job | No independent approval in current source | Receipt quantities, terminal Void, issued stock linked to Job |
| Bill | Routed financial document, BE15 | Save draft, Approve builds/posts journal; guarded UnApprove; flag-only Void | Linked GRN full-document Bill or direct General/Stock/Asset bill |
| Purchase Return | Legacy routed generic aggregate; target financial-document shape needs explicit BE15 handoff | User requests same manual approval display, then financial posting/allocation on Approve | Current backend has no source ledger relationship, journal, approval, eligibility or owned allocation |

Approved reference by shape: Workshop/Job routed editor and list shell; shared EditorTabs/FormSection/EditableCollectionTable/DataTable; InvoiceService for financial aggregate architecture; actual PR/PO approval-cycle and Bill approval flags for document-specific decisions. Return screenshot modal layout is evidence of content and workflow only; canonical routed financial document shell governs new structure. Return screenshot Journal window has debit 240/credit 0, which cannot be accepted as a valid balanced journal.

## Screenshot evidence classification — latest Purchase Return 1–4
| Evidence | Explicit | Missing/inferred |
|---|---|---|
| 1 list | Purchase Return No, date range, Contact, grid number/date/contact/code/detail/amount; View/Print/Journal actions; Report/Excel/Search | Exact backend list projection, paging, Journal eligibility and approval actions unavailable from image |
| 2 Journal | Read-only journal action with a supplier-payables debit 240 and no credit | Balanced accounting source and whether this was a software error; screenshot does not authorize one-sided posting |
| 3–4 Create | Header no/date/branch/supplier/currency/detail; movements include Receipt, Bill, Credit Note, JV; columns Amount, Already Allocated, Allocated Now, Due; Save | Stable source IDs, debit/credit direction, funding/source account, period, tax, capacity, saved amount, whether rows are both source/target roles |

Historical PO/GRN/Bill screenshots and earlier user directions have already been classified in the respective frozen feature artifacts. New images correct the initial reviewer assumption that this PurchaseReturn screen performs an inventory return: it presents supplier financial movements. The owner clarified that the supplier movement picker may draw from different voucher types, but must show only currently eligible opposite-side open movements. Official [Odoo vendor credit-note documentation](https://www.odoo.com/documentation/17.0/applications/finance/accounting/customer_invoices/credit_notes.html) supports separating the economic credit/return from reconciliation; it does not define this Sigma screen's missing account/source fields.

## Current business audit
`PURCHASING_UPSTREAM_CYCLE_AUDIT.md` confirms PR→PO→GRN tenant/quantity/approval locks and two PO issues: ordinary Add can create JobPO if given a live JobId, and a legacy public BillStatus toggle changes Billed/NotBilled without a Bill. Job route currently creates a valid JobPO through the ordinary PO Add, so removing this path before introducing a dedicated server-owned Job command would break Workshop. The historical endpoint may be uncoupled from the current UI; status ownership needs its own frozen decision.

`PURCHASING_DOWNSTREAM_CYCLE_AUDIT.md` confirms full-GRN Bill consumption, posted Bill allocation guards, conditional UnApprove, terminal Void; its physical-return recommendation is superseded for this PurchaseReturn screen by the later owner screenshots. The underlying confirmed defect remains: current `PurchaseReturn` generic CRUD accepts caller-supplied amounts and due figures, with no source identity, balance validation, journal or saved allocation. There is no independent PurchaseReturn approval in the source yet. PurchaseReturn currently has a duplicate nested `<tr>` in Details, list duplicate date columns, the supplier filter sends an ID as `supplier.name`, and detail View can invoke Save/Update. These are confirmed UI/source defects, in-scope for correction without selecting accounting semantics.

## Cross-layer decision register
| Decision | Status | Evidence and rule |
|---|---|---|
| Approval presentation | Frozen | PR/PO existing history and actions, Bill saved state/actions, new Return manual state requested 2026-10-21; settings future |
| Repeated tab headings | Frozen | User explicit; FormSection showHeading and EditableCollection headingVisible public inputs; print keeps headings |
| Return posting on Approve | Confirmed need, accounting basis partly Missing | User says Approve must post balanced journal and allocations. The selected original-Bill-versus-standalone account basis is pending owner answer; no counter-account/source key in current entity/DTO |
| Return movement picker | Frozen | Show only posted, non-voided, same-partner/account/branch/currency movements with positive open opposite signed balance. Eligibility is based on journal lines and effective allocations, not voucher type labels. Recheck under the allocation lock on approval |
| Return transaction scope | Derived when financial basis freezes | BE15 requires one transaction with source, balanced journal, allocation, precise capacity and fiscal/tenant checks under shared lock |
| Return legacy histories | Missing | Existing rows lack source links; do not backfill approval, posting, or allocation proof by guessing from No/date/amount |
| Return stock effect | Not Applicable for displayed current screen | No item/quantity/source-GRN evidence in screenshots or source; user supplied supplier movement workflow |
| PO Job-only source boundary | Confirmed issue, migration-free remedy to freeze | Workshop currently navigates to ordinary PO create with sourceJobId; dedicated command must replace it before Add rejection |
| PO BillStatus ownership | Missing | Public toggle has no Bill evidence; source-supported conversion cannot be inferred |

## Pending reconciliation
After editor and safe Return corrections, compare exact list columns/VMs, filters/keys, status/action flags/endpoints, Add/Update/detail DTOs, transactions/calculations, routes, guides and translations; review complete scoped diffs in each repo. Verify no additional undocumented Journal or approval state is shown in Return before its backend vertical slice exists. Owner build, tests, browser, DB and migrations remain pending under the project boundary.
