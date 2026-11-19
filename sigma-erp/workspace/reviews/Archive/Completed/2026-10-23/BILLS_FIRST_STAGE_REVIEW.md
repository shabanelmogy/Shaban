| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Bills first-stage implementation review — list/read outputs

## Scope and evidence

Owner requested Bills in stages, supplied only C:/Users/user/Desktop/1.PNG, then confirmed details will arrive one by one. First-stage delivery is list/search/read outputs only. Initial discovery interpretation was narrowed to delivering this supplied list screen; editor and domain-action design are not inferred from the one list image. Frozen plan and exact contract: BILLS_MAINTENANCE_EVOLUTION_PLAN.md and BILLS_LIST_CONTRACT_FREEZE.md.

Repositories: F:/My Work/Sigma/SiGmaAngularFrontEnd and F:/My Work/Sigma/SigmaBackend. Existing dirty PO/GRN implementation and owner-generated migration/snapshot were present; Bill frontend detail had its earlier GrnService import correction and backend BillService had the earlier GRN source lock/validation. These changes are preserved. This stage has no schema delta and must not change earlier financial writes.

Screen shape: canonical shared list from Workshop/Job; future Bill editor belongs to screen08 financial document with backend Pattern3/InvoiceService reference. Master2/4/5/7, UI1/2/3/4/6/7/19/20/21/24/29 and BE3..9/15/18/19 apply. Required Sigma screen-refactor skill and generated packets used; initial eight-packet -Check passed. Existing known debt remains identified under BE19 (#24 per-line VAT, #25 posted history deletion) and aggregate child reconciliation/over-scoped VM guidance; no unrelated canonical/shared changes are part of this list stage.

### Functional evidence table

| Screenshot item | Classification | Source resolution / phase |
|---|---|---|
| Bill No, Supplier Bill No, Vehicle, Branch and Contact | Explicit | Real Bill/Supplier/Branch/live line vehicle sources. Contact selects actual SupplierId; legacy ContactGroupId TODO not reused. |
| Date Range; Creation Date/Supplier Bill Date | Explicit | Preserve existing Bill.SearchAsync semantics: true means Bill.Date; false SupplierBillDate; inclusive calendar bounds. |
| Status Open/Closed; Due Amount | Explicit labels/values, derivation inferred | Source-backed read-only settlement projection from effective allocations on either side of the unique saved supplier A/P credit line. No cash-paid status or allocation write. |
| Approval badge/filter | Explicit; Bill source Missing | Nullable unknown displayed, no fake Approved/Pending from JV. Filter/action deferred to supplied approval workflow; configuration belongs in Settings. |
| Due Date, Deal No | Explicit; source Missing | No universal Bill fields. Deferred, no guessed date from loan plan or unrelated vehicle/job reference. |
| Loan Bills | Explicit | IsLoan stored. Checked=true filter; unchecked=all. API explicitfalse remains distinct. |
| Grid number/references/date/supplier/code/amount/creator | Explicit | Lean scalar projection with real GRN purchase references and saved total/audit creator. |
| Create | Explicit and existing | Preserve navigation to current editor; no editor changes. |
| View | Explicit and existing | Navigate to existing details, retain list state. |
| Report, Tax Report, Excel | Explicit | Complete applied read output; dedicated paged tax scalar projection; no historical tax recalculation. |
| Row Print | Explicit but saved-document content not supplied | Deferred until saved detail screen; report printing is delivered in current list stage. |
| UnApprove, Allocation, Void, Journal | Explicit labels only; transition/UI contract not supplied | No new mutations/actions. Existing accounting paths remain unchanged. |
| Generate Fines Bills, Import Bills | Explicit labels; Bill producer/import source Missing | Deferred. ImportFines does not establish a Bill importer. |

Metadata: English, LTR, wide desktop visible. Role, capture date, app version Unknown. Screenshot is content/workflow evidence, not layout/style authority.

## Decisions and implementation gates

- Read stage keeps all five BillType values and persisted totals. Bills are not POs and no PO approval lifecycle is copied into them.
- JV allocation ledger is the due source; include primary and allocated detail IDs and count an allocation row once. A valid posted/nonvoid root and unique supplier credit line matching the saved total are prerequisites. Missing/ambiguous history displays unknown.
- Open/Closed means remaining/fully allocated balance, not proof of payment. Bill approval is separate from journal approval.
- Existing multi-save posting transaction and every write method are retained. No new actions, accounts, allocations, loan behavior, price/tax calculation, approval state or reversal.
- Existing list columns are retained as meaningful scalar equivalents, in addition to screenshot fields; remove array/dynamic-name probes and client-only page filters.
- Shared filter/query/table/report owners handle bounds, values, formatting and outputs. No bespoke viewport geometry or report accounting logic.
- In-app guide documents only the delivered list and current source meanings. Future forms/action guides wait for their supplied details.

## Final contract and producer/consumer reconciliation

Ordinary grid fields, in order after Actions:
`id,no,approvalStatus,supplierBillNo,purchaseOrderNos,date,supplierBillDate,supplierName,supplierCode,totalAmount,dueAmount,status,createdBy,billType,branchName,vehicles,discount`.

BillListVM properties, in the same order:
`Id,No,ApprovalStatus,SupplierBillNo,PurchaseOrderNos,Date,SupplierBillDate,SupplierName,SupplierCode,TotalAmount,DueAmount,Status,CreatedBy,BillType,BranchName,Vehicles,Discount`.

Both sides contain exactly17 properties/columns. No inherited tenant, flags, source children, documents, loan plan or hidden FK payload remains. ApprovalStatus is nullable and is deliberately null in every new list projection. Actions contains only existing View navigation. UI BillListType uses API numeric0..4 while the old editor's string enum is preserved.

Tax DTO and columns contain exactly14 matching fields in this order:
`Id,No,Date,SupplierBillNo,SupplierBillDate,SupplierName,SupplierCode,BranchName,BillType,SubTotal,Discount,TaxAdjustment,TotalTax,TotalAmount`.

| Contract | Final source / result |
|---|---|
| Filters | Typed BillFilters → shared toListParams → ListSmBase → ApplyBillReadFilters. All15 business filter keys and2 sort keys are consumed; supplierId is a real supplier identity. Status filters only known outstanding sources. |
| Dates / zero / false | Calendar day inclusive bounds; true selects Bill.Date, false SupplierBillDate. Numeric type0/status0 and explicit backend isLoan=false remain valid. UI unchecked Loan Bills omits its filter. |
| Paging | Count precedes Skip/Take; supplied shared paging is positive and capped100; both absent default1/15. Stable scalar sort and Id descending tie-break. Unpaged GetAllWithNavigations remains explicit compatibility. |
| Sort | UI sortable fields are a subset of backend's persisted scalar allowlist. DueAmount,Status,ApprovalStatus,PurchaseOrderNos,Vehicles are not sortable. Unsupported query sorts fall back to Id descending. |
| References / vehicles | Bounded batched read of linked live/nonvoid GRNs and live vehicles; tenant-aligned source references; stable distinct strings. No source means null. |
| Due / settlement | Live posted nonvoid same-tenant bill JV; positive supplier identity; exactly one live same-tenant supplier credit/no-debit line, with that line matching saved total. Count uniqueness before testing total equality. Effective allocations include either detail orientation once. Due=max(0,total−allocated); Open if positive, Closed if zero; absent/ambiguous ledger stays null. Filter and returned classification use the same prerequisites. |
| Complete output | Shared fetchAllPages requests100 rows/page with the applied filter/sort snapshot. Any declared or HTTP failure aborts output. Ordinary Excel/report and separate tax-report read use the same predicate. Print disables local pagination/scroll so all fetched rows render through shared report owners. |
| Navigation | Existing /Bill/create and /Bill/details/:id preserved. URL receives applied state. Old editor returns bare /Bill; one cloned in-memory service snapshot, scoped by user/subscription, restores only when no explicit list query exists. No persistent cache or editor change. |
| Feedback | switchMap cancels stale list reads; HTTP and isSuccess:false paths surface inline feedback. Failed options can retry while preserving entered filters. Output errors produce no partial file. |
| Transport / registration | Existing root BillService provider and inherited Add/Update transport retained. GET Bill uses lean projection; additive GET Bill/tax-report matches typed consumer. Existing POST search and loan-payment-plan endpoints untouched. AuthGuard remains inherited from existing application routing; no permission mechanism invented. |

## Canonical conformance, reconciled to final source

Reference selection was recorded in the frozen handoff before implementation. The following final comparison identifies actual owners and values; source conformance is not a visual/runtime acceptance claim.

| Concern / book | Approved reference | Shared owner and compared target |
|---|---|---|
| Fill/scroll chain — UI1/29 | Workshop/Job/components/list/list.component | BillsComponent host sigma-route-host → sigma-list-page → sigma-list-panel → sigma-list-table → DataTable fill. Global styles retain height100%, min-height0, overflow hidden; title/filter/pager fixed and only table rows scroll. No feature viewport calculation or CSS overrides. |
| Title/action — UI3/24 | Job list FeatureTitle/Create | Same app-feature-title inside primary panel header, primary Create action, shared8px title separation and responsive wrapping. Feature SCSS remains empty. |
| Filters — UI4/17/22 | Job list form appFilterPanel | Same shared stable filter form, six main fields, advanced template, Reset/Search ownership and toolbar-start choices. Default six main/five advanced tracks,34px controls, shared7px/16px row/column gaps and disclosure apply. Loan checkbox uses shared check wrapper with direct input/label. Shared date directive/validator owns parsing. |
| Grid — UI6/7/16 | Job list DataTable | Same Actions-first shared grid, typed columns, status/money/date formatters and enum translation helpers. Default15; options10/15/20/50/100. Server paging/filter/order replaces page-local probes/filtering. |
| Read outputs — UI8/20/24 | Job list and existing shared reports | EditorDialog(width1400px,height80vh,contentPadded) + section appReportPage + FeatureTitle + DataTable. Existing footerActions owns Export/Print, ReportPrintService owns print lifecycle. Applied context and full result count retained. No feature report CSS or accounting calculations. |
| State/errors — UI10/22 | Job list query/switchMap | Shared route-state helpers and list-query helpers; errors handled in both channels. Narrow memory fallback is a documented compatibility adaptation for the preserved editor's bare return route. |
| Backend read — BE9 | Generic service list helpers and feature scalar reads | BillService owns explicit list/status projection; Count before paging, NormalizePaging and allowlisted SortBy, tenant-scoped repository query. Batched enrichment instead of full navigation graphs. |
| Financial ownership — BE15/19 | InvoiceService financial pattern; existing JV allocation read | This stage only reads saved Bill amounts/tax and ledger-effective allocations. Bill saving/recalculation/posting/reversal not changed. Future editor remains screen08/Pattern3. |
| Help — Master7 | Existing UserGuide reader/module | BILLS_TOPIC replaces only generic /Bill topic in RECORD_LIST_TOPICS.invoices; INVOICE_GUIDE consumes it. Existing /UserGuide/invoice route and menu retained. Bilingual purpose, steps, source meanings, outputs, error/missing-value implications and deferred workflows documented. |

Responsive source matrix: above1250 the default six main/five advanced filter tracks apply; at/below1250 both use three tracks; at/below720 both use one track and toolbar actions stack. Shared filter disclosure remains shared-owned. FeatureTitle wraps at650; EditorDialog retains shared1099/767 breakpoints; horizontal grid scroll retains all17 fields. RTL logical edges, theme tokens, long values, feedback expansion and short-height behavior use existing shared owners. No feature style override was introduced. Owner must visually verify both sides of the actual shared boundaries, intermediate widths, short heights, Arabic/RTL and both themes.

## Changed-file inventory for this stage

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

- `src/app/modules/Vouchers/Bills/Bill/components/list/list.component.ts` — typed state, filters/server paging, read outputs, existing navigation.
- `src/app/modules/Vouchers/Bills/Bill/components/list/list.component.html` — shared list/filter/grid/report shell.
- `src/app/modules/Vouchers/Bills/Bill/models/list.ts` — lean17-field list,14-field tax report, typed query and numeric list enums.
- `src/app/modules/Vouchers/Bills/Bill/models/grid-row.ts` — removed obsolete dynamic nested-value adapter.
- `src/app/modules/Vouchers/Bills/Bill/services/bill.service.ts` — typed reads, complete outputs and bounded return-state memory; inherited writes unchanged.
- `src/app/modules/Vouchers/Bills/Bill/bill.routes.ts` — pending output/print deactivation guard only.
- `src/app/modules/i18n/vocabs/en.ts` and `ar.ts` —38 new Bill-scoped entries per language, including nested enum/status/error labels; existing editor keys and prior PO/GRN changes preserved.
- `src/app/modules/UserGuide/content/bills-topic.ts` — new bilingual list topic.
- `src/app/modules/UserGuide/content/record-list-topics.ts` — wires that topic into existing invoice guide; prior PO/GRN changes retained.

Backend repository: `F:/My Work/Sigma/SigmaBackend`.

- `SiGma.Business/Services/VouchersServices/BillService.cs` — read projection/filter/order/enrichment/tax report; every prior method retained exactly.
- `SiGma.Business/IServices/IBillService.cs` — additive tax-report read signature.
- `SiGma.Business/MapperConfig/BillProfiler.cs` — list mapping only, including SupplierCode; explicit Ignore only for fields supplied by batched read or deliberately unknown approval. Existing write/detail maps unchanged.
- `SiGma.ServerAPI/Controller/BillController.cs` — additive GET tax-report.
- `SiGma.ViewModels/ViewModels/Bill/BillListVm.cs` — lean17-field read contract.
- `SiGma.ViewModels/ViewModels/Bill/BillTaxReportVM.cs` — new14-field saved-tax projection.
- `SiGma.ViewModels/ViewModels/Bill/BillSettlementStatus.cs` — new read-only enum, separate file, no persisted status.

Existing list read overrides are justified by feature-specific filtering/projection and derived source/ledger values: GetManyAsync and GetManyWithNavigationsAsync delegate to the private ReadBillListAsync owner; GetAllWithNavigationsAsync projects/enriches the same lean shape. No override simply calls its base. Controller's pre-existing list override remains; generic Select and mutations remain inherited. No new shared infrastructure/DTO-carrier classes or entity/configuration changes were needed.

## Source-only verification evidence

- Root reviewed the complete scoped source/diffs separately in the two actual Git repositories, including untracked DTO/guide files and prior-dirty overlaps. Direct Bill consumers were checked for removed adapter/oversized ListVM usage.
- TypeScript source parser:8 files, zero parse diagnostics; Angular template parser:1 template, zero diagnostics. No compiler/type checker/build invoked.
- Source field comparison:17 BillDTO properties equal17 ordinary grid fields, and14 tax properties equal14 report fields, in order. Producer PascalCase counterparts reviewed. Literal translation lookup:62 referenced keys found in both dictionaries; nested dynamic BillType/settlement labels included.
- C# Roslyn syntax parser:7 changed/new backend files, zero final diagnostics. Root corrected four invalid positive-ID patterns discovered during syntax review. Root also corrected nullable default paging, added the Business.Extensions namespace for WhereLedgerEffective, tightened valid journal/source tenant checks and aligned unique supplier-line checks before integration.
- Baseline preservation: all14 pre-existing BillService method full-source strings compare exactly equal to the stage-start snapshot, including SearchAsync, loan-plan read, financial writes, source validation and Fail/helper methods.
- Baseline SHA256 preservation: all12 snapshotted files unchanged — Bill/BillDetail entities; BillConfig; BillAddVm/BillUpdateVm; four frontend editor/create/detail sources; owner migration, designer and model snapshot. No editor/calculation/migration edits occurred in this stage.
- Scoped git diff --check clean in each repository. Named shared imports, bindings, Result envelopes, route links, repository methods, DTO namespaces/global enum imports, AutoMapper ownership and dead adapter references checked in source. New ViewModels files follow the SDK default compile glob.
- Recipe drift check passed all eight generated packets before use and was rerun during this stage. No canonical book/skill/template change or new reusable rule, so regeneration was unnecessary.
- No builds, tests, lint, application/browser verification, database commands, migrations, Git writes, commits/pushes or deployment steps were run. A failed assembly-load attempt during parser setup was replaced by the already available Roslyn syntax parser; no source compilation occurred.

## Delivery limits and owner verification

The first list stage is implemented at source level. The full Bill feature remains incremental. No schema delta or Add-Migration is required for this stage; the owner-generated earlier PO/GRN migration remains a separate preserved responsibility.

Owner checks after their build/start:

1. Open /Bill and verify current month/current branch defaults; all17 columns and5 types; retry options/list failure without losing values; type0/Open0/discount0 and Supplier Bill Date(false) correctly reach the server.
2. Exercise page/size/sort changes, cleared range/all branches, last-page reduction, Create/View and return from the current editor. Confirm query state restoration and account/tenant changes clear the fallback.
3. Compare due/status to effective allocations for no/partial/full allocation, both detail orientations, voided/unposted sources, deleted/ambiguous supplier lines and malformed historical journal links. Unknown source must not become a full due or Closed. Replay the server status filter to verify EF translation of its correlated query and parity with displayed values.
4. Compare saved amount/discount/tax values, multiple GRN PO references and multiple vehicle labels. Verify complete Excel, ordinary report and saved-tax report across more than100 rows; inject a later-page failure and confirm no partial output. Check print includes all rows.
5. Check supported widths/boundaries/intermediate sizes, short viewport, long labels, Arabic/RTL, light/dark and report dialog keyboard/print. Open the existing UserGuide invoice section and verify the supplier-bill list topic.

Potential runtime risks remain explicitly pending: EF translation/performance of the correlated settlement filter and nested supplier-line projection; actual historical posting/allocation quality; API serializers/model binding; Angular type compilation and shared overlay/print behavior. Syntax parsing cannot certify these.

Deferred contracts: Bill approval source/cycle/actions; due date/deal relationship; saved document print; editor/header/type-specific lines/documents; allocation/void/journal; fines generation/import. Known existing posted-history deletion, detached child reconciliation and per-line VAT debt remains for the later frozen financial/editor stage; no attempt was made to alter historical financial behavior from a list screenshot.

## Phases, agents and suggested commits

Applied discovery/freeze and maintenance impact classification, backend read/grid work, frontend list/read-output integration, translations/guide and final source reconciliation. Editor/write implementation and financial action/producer phases skipped because the owner will send their details separately. Runtime/build verification stays owner-pending under AGENTS.md.

Existing bounded workers were reused after root froze the handoff: po_backend owned the six backend read/API/mapper/VM files; po_list owned list TS/HTML/model/service/routes and adapter deletion, producing only a translation fragment. They used their inherited model without new overrides. Root owned decisions, final backend corrections/separate enum file, translation merge, user guide, all integration and verification. No overlapping edits occurred; backend and frontend independent workstreams reduced elapsed implementation time and avoided repeating discovery. grn_backend was not assigned this stage.

Suggested commits only (do not commit):

- Frontend: `feat(bills): add server-filtered list and complete read reports`
- Backend: `feat(bills): project lean list balances and saved tax report`

Review artifacts are local/unversioned under F:/My Work/Sigma/reviews. This report does not claim the later Bill editor or accounting cycle is complete.
