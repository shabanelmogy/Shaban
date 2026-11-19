| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Purchase Orders and GRN full-stack review — 2026-10-20

## Delivered scope and authority

The owner requested implementation of Purchase Orders against the Sigma documentation, explicitly identified the fourth type as Job-created, requested manual approval like PR with configurable approval regulations deferred, then added creation/review of GRN and its Stock/Create and Asset/View screenshots. These are one continued task. Both existing aggregates were extended in place; no parallel purchase or receiving subsystem was created.

Authority: `F:/My Work/Sigma/AGENTS.md`, `F:/My Work/Sigma/.agents/skills/sigma-screen-refactor/SKILL.md`, canonical Master/UI/Backend books under `F:/My Work/Shaban Documents/Shaban/sigma-erp/`, and generated PLAN-00/PHASE-00..06 packets. The recipe drift check passed all eight packets at discovery and final handoff. No canonical rule/template/manifest was changed, so regeneration was unnecessary. Frozen handoffs and the initial PO evolution plan are separate historical artifacts in this folder.

Selected shapes: canonical list/filter/DataTable composition and routed editor type02 with peer tabs; backend Pattern2 tracked aggregate plus explicit lifecycle commands. Workshop Job supplies the shell/reference. PR supplies the specifically requested terminal manual decision behavior, not an unrelated screen-wide business template. GRN is a receipt with saved tax estimates, without an owning journal/posting contract.

## Phases and evidence

| Phase | Result |
|---|---|
| PLAN-00, discovery and freeze | Existing writers/readers and consumers traced; PO plan and PO/GRN contracts frozen before isolated implementation. |
| Phase00 | Screenshots classified as content/workflow evidence; screenshot geometry was not copied. |
| Phase01 | Lean read/write DTOs, type matrix, source ownership, quantity and transition contracts reconciled. |
| Phase02 | Both server-paged lists, applied filters/order, complete export/report and dedicated GRN tax projection implemented. |
| Phase03 | Both typed editors, full snapshots, source locks, documents, cancellation, saved print and Equipment consumer integrated. |
| Phase04 | Manual PO approval/rejection/history, guarded deletion, GRN void/reason, real Issue to Job, concurrent source guards implemented. |
| Phase05 | Routes, standalone registration, restricted application TS roots, Job entry, Bill selector consumer, EN/AR and user guides reconciled. |
| Phase06 | Root reviewed scoped diffs separately in both repositories, integrated focused audits and corrected their findings. Source-only checks passed as recorded below. |
| Skipped verification | Builds, tests, lint, browser/runtime, database, migrations, Git writes and deployment were prohibited. They were not run. |

| Evidence | Explicit content preserved | Resolution / limits |
|---|---|---|
| PO1–3 | Number/date/supplier/code/agreement/notes/money grid; quotation, branch, vehicle, chassis, approval and bill filters; View/Print/Report/Excel and vehicle-service entry | Server list; fourth-type filter; master-agreement field empty because Job.PONo is not a confirmed agreement source. |
| PO1–3 actions | Create Bill, Generate Bills, Create GRN, UnApprove labels | GRN creation implemented after the owner added GRN scope. No missing financial conversion was fabricated. UnApprove superseded by the owner's PR-style terminal approval instruction. |
| PO4–6 | General/Stock/Asset choice, header supplier/date/quotation/currency/branch/job, conditional line fields, documents, discount and save-print | Typed persistent tabbed editor, current supplier tax policy, backend totals; Equipment remains Asset source. |
| Owner clarification | Fourth type is created from Job | Enum3, Job action, same editor with immutable source Job/type; list and details show it. |
| GRN1 | List/filter/actual bill reference, View/Edit/Print/Delete/Void/Tax Report/Excel | Existing aggregate extended; real reference locks and reason-bearing void; separate paged tax report. |
| GRN1 Journal | Journal label | No actual GRN journal owner/source was found; unavailable. No accounting effect or reversal invented. |
| GRN2 and Desktop/3.PNG | Stock/Asset receipt; number/date; supplier/currency/branch/LPO/supplier bill/date/notes; ordered/already/received quantities; AssetType/chassis; amount/tax/gross; documents; Issue to Job | Saved details retain missing historical values as empty; actual linked BillNo only. Issue to Job creates an existing ItemIssue aggregate atomically. |
| Asset view amount words | Written amount under totals | No proven shared currency wording contract; not fabricated. Asset receipt quantities do not generate Vehicle records. |

Screenshot provenance/version/capture date/role remain Unknown. Desktop, English and LTR are directly visible. Missing accounting conversion, journal and agreement sources are explicitly unavailable; there is no unresolved implementation blocker in the frozen nonfinancial scope.

## Decisions and resulting contracts

| Concern | Final decision and evidence |
|---|---|
| Evolution | Reuse PO/GRN entities, routes and writers. Extend source FKs rather than create a second receiving aggregate. |
| Types | Preserve PO0/1/2 and GRN0/1 values; append JobPO3. Manual PO creation offers0/1/2; saved Job entry supplies3 and requires JobId. |
| PO line matrix | General/Job require description; Stock requires Item/UOM; Asset requires AssetType. Positive int quantities, nonnegative scale2 prices, live references. Source PR identities/prices and allocated discount remain protected. |
| PR/EQ source | Ordinary writes cannot invent PR source IDs. Existing PR-linked rows remain owned and capacity-checked; no unrelated appended rows. Equipment quotation source remains Asset. |
| Approval | Pending1 → Approved0 or Rejected2, once; append real audit/account/date. Approved/rejected cannot edit/delete. Legacy statuses/history remain; no fictitious backfill. Historical numeric readiness is checked on a detached calculation before approval, without rewriting stored totals. |
| Future regulations | No configured levels, approver roles or approval limits were invented; manual lifecycle is the present contract. Existing endpoint catalogue annotations remain catalogue metadata. |
| Receipts | Approved matching supplier/type Stock/Asset source only; server derives line references/price/ordered and rechecks remaining inside the same source write lock. General/Job do not use Stock/Asset GRN. |
| Historical receipts | Nullable new source/date links; effective date is Date ?? SupplierBillDate ?? CreatedAt. Same-supplier/LPO legacy rows reserve quantities conservatively. Ambiguous duplicate source matches are excluded/rejected, never guessed or backfilled. Manual unlinked receipt remains supported with its own ordered/received bounds. |
| Issue to Job | Create-only, Stock-only, requires Job. Creates grouped real ItemIssue lines and provenance FK in the same save. Source-created issue cannot edit/activate through bypasses; existing allowed whole-issue deletion releases GRN restrictions but does not cancel the receipt. |
| Receipt locks | Live BillDetail+Bill or ItemIssue blocks GRN edit/delete/void. Bill existence is independent of whether Bill.No is populated. Bill Add/Update freshly validate nonvoid same-supplier receipts under the shared lock, preserving existing financial formulas/atomicity. |
| Void | Required trimmed reason≤500; active→voided final; keep receipt/lines and release capacity. Repeated/stale void or new dependency is409; four direct stock receipt readers exclude voided receipts. No reverse journal added. |
| DTO ownership | Writes omit statuses, totals, AlreadyReceived and audit values. Full snapshot children0=new; tracked ownership/drop checks before save. Read DTOs contain displayed values/identity/action flags only. |
| Mapping | One-way add/update maps; ignore only tracked child collection and immutable source ownership where reconciliation owns them. Explicit scalar list projection replaces bloated recursive ListVM. Detail maps filter deleted children; BillNo/ItemIssueId/action locks completed by real service reads. |
| Calculation | Backend owns saved money and supplier policy. PO uses once-rounded allocated VAT, price rounded to stored2 before quantity multiplication; net=pre-tax minus discount, gross displayed separately. GRN Tax is monetary saved line tax. Frontend is preview only, uses same rounding/allocation and scale2 input validation. |
| Numbering | Existing UnitOfWork/Code owner; no client-generated numbers or historical renumbering. |
| Transactions | Existing PurchaseRequest per-tenant write boundary serializes PO/GRN/Bill source-sensitive mutations; GRN graph saves once. Bill retains atomic multi-save work through that wrapper. No shared transaction owner was changed. |
| Routes | list/create/view/:id/edit/:id and details compatibility; guard owns dirty exit. Job query source and existing Equipment embedded inputs/output retained. |
| Cleanup | DocumentUploadTracker owns draft cleanup and saved-path deletion after successful save; failed cleanup retries cleanup only and does not repeat a committed save. |
| Dead roots | Independent PO-detail and GRN-detail UI/routes/providers/specs removed after moving the Bill selector to the canonical GRN root service. Backend aggregate child entities/contracts remain. No database deletion or historical data rewrite occurred. |

### Visible grid and lean VM parity

The following are displayed columns, in addition to Actions. Backend PascalCase properties correspond exactly to the frontend camelCase field list; action flags are separate minimum state fields.

| Feature | Grid fields | ListVM properties | Action state only |
|---|---|---|---|
| PO | id, no, poType, date, approvedStatus, billStatus, supplierQuotationNo, supplierName, supplierCode, branchName, jobName, vehicles, masterAgreementNo, notes, totalAmount, amountPlusTax, discount, netAmount | Id, No, POType, Date, ApprovedStatus, BillStatus, SupplierQuotationNo, SupplierName, SupplierCode, BranchName, JobName, Vehicles, MasterAgreementNo, Notes, TotalAmount, AmountPlusTax, Discount, NetAmount | CanEdit, CanDelete, CanCreateGrn |
| GRN | id, no, date, grnType, lpoNo, billNo, supplierBillNo, supplierName, supplierCode, branchName, jobName, isVoided, netAmount | Id, No, Date, GRNType, LPONo, BillNo, SupplierBillNo, SupplierName, SupplierCode, BranchName, JobName, IsVoided, NetAmount | CanEdit, CanDelete, CanVoid |

Filters, types and request names are enumerated in the frozen contracts. Enum0 and booleanfalse survive serialization; date endpoints are inclusive calendar days. Backend normalizes paging≤100 and counts before slicing, with allowlisted sorting and stable identity. Main filter groups use the current month/working branch; draft filters apply on Search. Paging, sorting, return navigation and complete report/Excel use the applied snapshot. MasterAgreementNo/vehicles and derived BillNo do not claim unsupported sorting. The separate GRN tax report adds saved TotalAmount/TaxAmount/NetAmount scalar fields to report rows, avoiding per-row detail requests.

## Final source conformance

| Concern / blocks | Compared reference/shared owner | Final target evidence and values |
|---|---|---|
| List bounds UI1/3/4/6 | Workshop/Job/components/list/list.component.html; shared FilterPanel/DataTable/FeatureTitle | Both use sigma-route-host → sigma-list-page/panel, stableLayout filters, lazy fill table, fixed header/pager; no feature viewport-height calculation or second page-scroll owner. |
| Editor UI1/13/14/15 | Workshop/Job/components/editor/editor.component.html; shared routed editor SCSS and EditorTabs | PO Basic/Details/Documents/Approval and GRN Basic/Details/Documents are peer workspace tabs over one persistent form, one internal pane scroll, fixed footer; print mounts all saved sections. No copied shell CSS. |
| Lines UI14/16/17/19/27 | EditableRows, EditableCollectionTable, QuantityInputDirective, FieldError and date-utils | Owned full snapshots, confirmationPending/canMutate gates, fillHeight+stickyHeader, positive whole p-inputNumber quantities, translated validation, numeric read badges, scale2 prices. |
| Money UI19/24, BE15 | financial-number.util; VatPolicy/FinancialNumberPolicy; SummaryCards | slim/row/min140/max80 totals, rounded unit price before multiplication and allocated tax; saved detail values authoritative. |
| Documents UI18 | DocumentUploadTracker, FileField/FileLink | Saved documents initialized, one cleanup path after save/discard, post-save cleanup retry cannot resave. |
| State actions UI7/13/22, BE14/18 | ConfirmationDialogService, EditorDialog; explicit PR manual pattern requested by owner | One PO approval component in list and View; real history. GRN void is typed reason form, preserved on failure with409 refresh. |
| Reports UI20/21 | ReportPage, ReportPrintService, DataTable complete output | All matching pages fetched, partial failures stop output, persisted saved print, explicit receipt-estimate notice. |
| Backend BE1..11/14/18 | Pattern2 aggregate reconciliation; UnitOfWork transaction/tenant owner | Lean scalar lists, fresh source/state checks, no client totals, ownership checked before tracked mutation, bulk/activation bypass guards, one shared source lock. |
| Runtime UI1/28/29 | Exact imported owner exports and component public types; routes/tsconfig | Named exports/standalone imports/input contracts traced; new approval runtime root explicitly added. Deleted detail-service consumer in Bill migrated to surviving GrnService.GetSelect root IDs. |
| Help Master7/UI19 | Existing UserGuide reader/INVOICE_GUIDE/sidebar entry | New bilingual purchase-documents-topics.ts supplies PO/GRN; invoice-guide reads RECORD_LIST_TOPICS.invoices; existing /UserGuide/invoice menu retained. Job and stock guides explain the new entry and linked issue behavior. |

Source conformance does not certify visual acceptance, compilation or actual EF query translation.

## Final audit corrections

Focused audits and root integration corrected: stale supplier-tax hydration on PO Edit; PR hidden source references in payload; rounding/scale mismatch; fake Job.PONo agreement mapping; detail-root stale Bill import; repeated/dependency void409; localized GRN success; end-day historical date filtering; incorrect void filter on a PO report moved to the real GRN report; draft ambiguity counting against a stable source snapshot; Arabic missing detail keys; historical approval readiness; and statement layout/whitespace. No known actionable in-scope source finding remains from these audits.

## Schema and existing-data boundary

Owner migration required. Suggested single coherent name for the current combined delta (no existing matching migration file found):

```powershell
Add-Migration AddPurchaseOrderApprovalAndGrnLifecycle
```

| Delta | Owner review before applying |
|---|---|
| PurchaseOrderApprovalLog entity/table/FK/index and DbSet | Restrict relationship; tenant/root/date/id index; actual audit owner stamps new decisions. No historical approval log fabrication. |
| PO ApprovedStatus metadata | Default pending1, sentinel1, concurrency token; preserve all saved enum values. |
| GRN Date, PurchaseOrderId, IsVoided, VoidReason | Date/source nullable, reason≤500; historical IsVoided=false; FK restrict and indexes; inspect generated defaults without rewriting historic dates/sources. |
| GRN detail PurchaseOrderDetailId and Description length | Nullable FK/index restrict; Description expands500→1000 to retain source descriptions. |
| ItemIssue.GoodsReceivedNoteId | Nullable FK/index restrict; old issues remain unlinked. |

No migration or ModelSnapshot file was created, changed or run. Owner should inspect generated SQL/defaults/FKs and actual historical duplicate LPO/source matches before applying in their normal migration workflow.

## Verification evidence and owner acceptance

Source-only results after integration:

- Recipe check: all eight generated packets current.
- TypeScript source parser:29 changed/new production files; Angular template parser:5 templates; commented tsconfig source parse:1; zero syntax diagnostics.
- Literal PO/GRN translation-key scan: no missing EN/AR keys; resource XML parsed and no duplicate resource names found.
- C# parser:48 changed/new C# files, zero syntax diagnostics. This is parsing, not compilation or EF/AutoMapper validation.
- Both repository diff whitespace checks passed. Scoped route/import/standalone/public-input references reviewed, removed roots checked for stale consumers, final scoped source/diffs reconciled separately.

Owner acceptance remains required:

1. Generate/review the migration, compile both applications and validate AutoMapper and EF query translation in the normal development process.
2. Exercise General/Stock/Asset/Job PO creation, Equipment embedded source, PR-linked editing, zero/optional VAT and failed VAT read/retry, documents and save-print.
3. Approve/reject a pending PO; verify real account/date history and stale concurrent decision/edit responses. Inspect pending historical malformed rows and empty historical decision history.
4. Receive a partial Stock/Asset PO; test repeat receipts, concurrent remaining quantities, edit excluding itself, duplicate historical source ambiguity, exhausted source and source refresh.
5. Create Stock Issue to Job; verify one issue with grouped items, read-only receipt/issue locks, allowed issue deletion, Bill supplier/void validation, repeat/dependency void409 and released receiving capacity.
6. Compare all receipt-derived stock reports after void; verify actual BillNo, nullable historic dates/labels and paged report/Excel beyond100 results.
7. Verify keyboard/dirty exits, cleanup-only retry, print all rows/sections, Arabic/RTL, light/dark, desktop/intermediate/mobile and short-height layouts. No page scroll, clipped action footer or hidden validation should occur.

Suggested commits only, not executed:

- Frontend: `feat(purchasing): align PO and GRN workflows with shared editors and manual approvals`
- Backend: `feat(purchasing): add PO approval history and guarded GRN lifecycle`

## Delegation and integration

Root retained discovery, freeze, PO editor, business decisions, direct consumers, translations/help and final reconciliation. Three bounded streams reduced independent backend/list implementation time: po_backend (gpt-5.6-sol) owned PO backend and subsequently the isolated Bill guard/read-only audits; po_list (inherited parent model) owned PO list/approval and then GRN frontend; grn_backend (gpt-5.6-sol) owned GRN/ItemIssue/stock readers. No simultaneous shared-file ownership was assigned; translations and help remained root-owned. Final read-only audits were integrated by root, including the corrections above. No subagent declared overall completion. All work remained source-only.

## Changed-file inventory

The inventory below includes existing source edits, new files and removed dead UI roots in each actual repository. Initial repository state was clean. Review artifacts are local outside those repositories.

### Repository: F:/My Work/Sigma/SiGmaAngularFrontEnd

- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/_metronic/layout/components/toolbar/toolbar.component.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/_metronic/layout/layout.module.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Equipment Rental/EquipmentQuotation/components/list/list.component.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/record-list-topics.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/stock-guide.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/workshop-guide.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/Bills/Bill/components/details/details.component.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNote/components/details/details.component.html`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNote/components/details/details.component.scss`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNote/components/details/details.component.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNote/components/list/list.component.html`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNote/components/list/list.component.scss`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNote/components/list/list.component.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNote/goodsreceivednote.routes.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNote/models/create.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNote/models/details.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNote/models/grid-row.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNote/models/list.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNote/services/goodsreceivednote.service.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNoteDetail/components/details/details.component.html`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNoteDetail/components/details/details.component.scss`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNoteDetail/components/details/details.component.spec.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNoteDetail/components/details/details.component.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNoteDetail/components/list/list.component.html`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNoteDetail/components/list/list.component.scss`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNoteDetail/components/list/list.component.spec.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNoteDetail/components/list/list.component.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNoteDetail/goodsreceivednotedetail.routes.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNoteDetail/models/create.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNoteDetail/models/details.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNoteDetail/models/grid-row.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNoteDetail/models/list.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/GRNs/GoodsReceivedNoteDetail/services/goodsreceivednotedetail.service.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/components/details/details.component.html`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/components/details/details.component.scss`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/components/details/details.component.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/components/list/list.component.html`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/components/list/list.component.scss`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/components/list/list.component.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/models/create.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/models/details.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/models/grid-row.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/models/list.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/purchaseorder.routes.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/services/purchaseorder.service.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrderDetail/components/details/details.component.html`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrderDetail/components/details/details.component.scss`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrderDetail/components/details/details.component.spec.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrderDetail/components/details/details.component.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrderDetail/components/list/list.component.html`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrderDetail/components/list/list.component.scss`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrderDetail/components/list/list.component.spec.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrderDetail/components/list/list.component.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrderDetail/models/create.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrderDetail/models/details.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrderDetail/models/grid-row.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrderDetail/models/list.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrderDetail/purchaseorderdetail.routes.ts`
- `D` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrderDetail/services/purchaseorderdetail.service.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Workshop/Job/components/list/list.component.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/ar.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/en.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/pages/routing.ts`
- `M` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/tsconfig.app.json`
- `A` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/purchase-documents-topics.ts`
- `A` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/components/approval-cycle/approval-cycle.component.html`
- `A` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/components/approval-cycle/approval-cycle.component.ts`
- `A` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/models/approval.ts`
- `A` — `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/utils/approval-presentation.ts`

### Repository: F:/My Work/Sigma/SigmaBackend

- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Business/IServices/IGoodsReceivedNoteService.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Business/IServices/IPurchaseOrderService.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Business/MapperConfig/GoodsReceivedNoteDetailProfiler.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Business/MapperConfig/GoodsReceivedNoteProfiler.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Business/MapperConfig/ItemIssueProfiler.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Business/MapperConfig/PurchaseOrderDetailProfiler.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Business/MapperConfig/PurchaseOrderProfiler.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemIssueService.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/StockReportsService.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/VouchersServices/BillService.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/VouchersServices/GoodsReceivedNoteService.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/VouchersServices/PurchaseOrderService.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/GoodsReceivedNoteConfig.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/GoodsReceivedNoteDetailConfig.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/ItemIssueConfig.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/PurchaseOrderConfig.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/SiGmaDbContext.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Enum/POType.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Localization/Shared/GeneralMessage.ar-SA.resx`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Localization/Shared/GeneralMessage.resx`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/Purchases/GoodsReceivedNote.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/Purchases/GoodsReceivedNoteDetail.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/Purchases/PurchaseOrder.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/Purchases/PurchaseOrderDetail.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/Stocks/ItemIssue.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Controller/GoodsReceivedNoteController.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Controller/PurchaseOrderController.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/GoodsReceivedNote/GoodsReceivedNoteAddVm.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/GoodsReceivedNote/GoodsReceivedNoteDetailVm.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/GoodsReceivedNote/GoodsReceivedNoteListVm.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/GoodsReceivedNote/GoodsReceivedNoteUpdateVm.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/GoodsReceivedNoteDetail/GoodsReceivedNoteDetailAddVm.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/GoodsReceivedNoteDetail/GoodsReceivedNoteDetailDetailVm.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/GoodsReceivedNoteDetail/GoodsReceivedNoteDetailUpdateVm.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/PurchaseOrder/PurchaseOrderAddVm.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/PurchaseOrder/PurchaseOrderDetailVm.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/PurchaseOrder/PurchaseOrderListVm.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/PurchaseOrder/PurchaseOrderUpdateVm.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/PurchaseOrderDetail/PurchaseOrderDetailAddVm.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/PurchaseOrderDetail/PurchaseOrderDetailDetailVm.cs`
- `M` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/PurchaseOrderDetail/PurchaseOrderDetailUpdateVm.cs`
- `A` — `F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/PurchaseOrderApprovalLogConfig.cs`
- `A` — `F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/Purchases/PurchaseOrderApprovalLog.cs`
- `A` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/GoodsReceivedNote/GoodsReceivedNotePurchaseOrderDraftLineVM.cs`
- `A` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/GoodsReceivedNote/GoodsReceivedNotePurchaseOrderDraftVM.cs`
- `A` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/GoodsReceivedNote/GoodsReceivedNoteTaxReportVM.cs`
- `A` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/GoodsReceivedNote/GoodsReceivedNoteVoidVM.cs`
- `A` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/PurchaseOrder/PurchaseOrderApprovalDecisionVM.cs`
- `A` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/PurchaseOrder/PurchaseOrderApprovalHistoryVM.cs`
- `A` — `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/PurchaseOrder/PurchaseOrderApprovalVM.cs`

## Compiler feedback repair — 2026-10-20

Owner-provided compiler diagnostics identified eight missing-name/type errors that the earlier syntax-only pass could not detect. Corrected explicit imports in four existing files:

| File (relative to SigmaBackend) | Source-backed namespace correction |
|---|---|
| SiGma.DataAccess/Configuration/PurchaseOrderConfig.cs | SiGma.Helpers.Enum for ApprovalStatus. |
| SiGma.Business/Services/StocksServices/ItemIssueService.cs | SiGma.Helpers.ViewModelsBases.Active for ActiveVm. |
| SiGma.Business/Services/VouchersServices/GoodsReceivedNoteService.cs | System.Linq.Expressions for Expression; SiGma.Business.Resolver for ITaxPolicyService; SiGma.Helpers.ViewModelsBases.Active for ActiveVm. Also added SiGma.Helpers.Helpers for the existing VatPolicy/FinancialNumberPolicy calls, preventing the same missing-namespace failure after the reported type errors are resolved. |
| SiGma.ServerAPI/Controller/GoodsReceivedNoteController.cs | SiGma.Helpers.Enum for GRNType. |

Each namespace was checked against its defining source and the relevant project GlobalUsing.cs; project references already exist. No global imports, contracts, calculations, mapping, schema or user workflow were changed. Existing user-guide coverage remains applicable with no new guide topic required. Phase05 namespace repair and Phase06 scoped-source reconciliation only; other implementation phases remain as previously recorded. No subagents were needed for this small sequential correction.

Recipe -Check passed all eight packets; all four files parsed with zero syntax diagnostics and scoped git diff --check passed. These results do not prove a successful application build. Build/tests/lint/database/migration/browser/Git writes/deployment were not run. Owner rebuild remains pending. No additional migration is required for this import-only correction; the original feature schema migration remains required. Suggested backend commit: fix(purchasing): restore missing backend namespace imports.

## Owner clarification repair — Workshop type presentation (2026-10-20)

Owner clarified that Workshop creates the fourth PO type from Job only, and Purchase Orders displays it and continues its lifecycle. Removed the disabled Job option from manual Create PO by filtering the editor choices to General/Stock/Asset. Saved and source-bound PO types now use the shared read-value presentation instead of a disabled radio group. The Job-origin flow, list/details type and manual approval cycle remain. No backend, enum, DTO, source ownership, migration or lifecycle change was required.

Changed files: PurchaseOrder/components/details/details.component.ts and .html, and UserGuide/content/purchase-documents-topics.ts under the frontend module root. Shared enumKey supplies the exact translated saved type; standalone imports and field registration remain existing. The in-app bilingual guide now explicitly states three manual types and the fixed Job type; existing /UserGuide/invoice reader/menu remains the owner. UI13 heading action slot/read-only presentation and UI14 shared form owners retained. Applied Phase03 presentation and Phase06 source reconciliation only; no new independent stream warranted an agent.

Recipe check passed eight packets; both TypeScript files and the Angular template parsed with zero syntax errors; scoped diff whitespace passed. Build/runtime/visual/RTL/theme acceptance remains owner-pending; no prohibited commands were run. No extra migration required. Suggested frontend commit: fix(purchase-orders): limit manual creation to supported PO types.

Owner-generated migration and snapshot files were observed in the backend working tree at this follow-up and were preserved without edits.
