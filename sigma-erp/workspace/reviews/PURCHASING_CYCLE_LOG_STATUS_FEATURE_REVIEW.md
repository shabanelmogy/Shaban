# Purchasing and suppliers cycle — implementation and final reconciliation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-24 |
| Scope | PR → PO → GRN → partial supplier Bill → financial return/payment/debit note; immediate source, stock, Job, AP, tax and report dependencies |

## Authority, shapes and frozen decisions

Followed workspace AGENTS.md, sigma-screen-refactor, Master1/4/5/7, applicable BE3/8/9/14/15/18/19 and UI2/6/7/12/13/14/22/23/28/29. Canonical shapes: nonfinancial master-detail PR/PO; operational stock approval GRN; financial aggregate Bill/PurchaseReturn; existing Payment/DebitNote exceptions retained. UI uses existing routed financial editor and shared read-only document-log dialog; no generic CRUD replacement. Existing source is fact, approved canonical references own presentation. No screenshots supplied for this cycle scope.

Frozen handoffs: PURCHASING_CYCLE_LOG_STATUS_MAINTENANCE_EVOLUTION_PLAN.md; PURCHASING_CYCLE_LOGS_DOMAIN_API_CONTRACT_FREEZE.md; PURCHASING_BILLING_PROGRESS_DOMAIN_API_CONTRACT_FREEZE.md amended by PURCHASING_PARTIAL_GRN_BILLING_DOMAIN_API_CONTRACT_FREEZE.md; PURCHASING_JOB_ORDER_DOMAIN_API_CONTRACT_FREEZE.md. Owner confirmed approved Bills count as invoiced, drafts reserve, partial invoicing within one receipt is required and current data is experimental. Correct new source identity takes priority; no automatic historical reconstruction or database deletion was performed.

## Delivered behavior

- Existing PO Audit Trail is now also exposed for PurchaseRequest, GoodsReceivedNote, Bill, PurchaseReturn, Payment and DebitNote. Each reader validates a live tenant-owned root and uses only its owned line/approval/allocation GUIDs, including deleted child identities. PO reader now includes its own approval children. Shared dialog/viewer supplies actual captured fields, actors, timestamps, retry/errors and request cancellation. History before capture is not reconstructed.
- PR use and PO receiving progress keep their established line-capacity owners. PO/GRN invoice coverage is derived from approved actual BillDetail quantities, through precise received-line IDs. Draft reservation is an independent badge. Display, named PO billing filter, grid filtering/count/page and complete output use the server projection. General/Job POs show Not applicable for receipt-based invoice coverage. Unknown approval, missing/conflicting identity, duplicate source within a Bill and overcapacity show Needs review. Unlike units are never added to prove completion.
- BillDetails explicitly select a received-line identity and positive integer quantity. Zero in the editor omits that line. Server derives source metadata, accounts, price and currency; validates tenant, supplier, branch, source type and live approved/effective receipt; forbids duplicate/foreign/overcapacity sources. Approved plus pending reservations are checked under the existing PR write lock, excluding the current Bill. Multiple Bills may share the same receipt's remaining quantities. Serial/chassis assets remain one unit and cannot be selected twice across live invoices.
- Update retains owned BillDetail identities and saved tax rates for the same source. Approval revalidates exactly the saved subset and snapshot, then uses existing posting/period/allocation rules. It never expands the selection back to a full receipt. UnApprove retains pending reservation; eligible Void/delete releases it. No stock movement is added by invoicing. Bulk source Bill writes are rejected.
- Bill editor keeps source quantities inside its typed form, so dirty/discard/freeze applies. It shows received, approved invoiced, other draft reserved and available quantities. Lookup retry preserves edited quantities. Source totals come from cancellable server preview with debounce, response version and payload checks. Save and Save/Print reject pending, stale or failed preview. The preview POST is classified read-only for navigation tracking. Saved View/Print retain persisted lines.
- Confirmed side-effect corrections: pending receiving report includes only approved POs; voided Bills no longer count as effective receipt-void blockers, while historical edit/delete locks remain; deleting a pending financial return removes its owned details under the allocation lock. Job POs now use a dedicated server-owned source command and the actual Workshop-origin editor caller. Ordinary Add/bulk cannot bypass this boundary; edit/approval reject unrelated line Jobs.

## Conformance table reconciled with final source

| Concern | Book | Actual reference / shared owner | Final target |
|---|---|---|---|
| Log dialog and record subtitle | UI7/13/22/28 | Existing PO list; EditorDialogComponent; DocumentActionLogComponent | Six additional lists use recordId/loadEntries inside translated dialog; busy guards and typed services; no copied feature viewer |
| Quantity editor and inline feedback | UI12/14/19 | Existing Bill editor; EditableCollectionTable, QuantityInputDirective, FieldError | FormRecord keyed by receipt-detail ID, integer0..available, source metadata readonly, no new local SCSS |
| Source write | BE8/14/15/18 | Existing BillService PrepareLinesAsync/PrepareApprovalAsync and UnitOfWork transaction | Exact source identity and cumulative reservation checked on Add/Update/Approve; IDs preserved |
| Financial transition | BE15/18 | Existing Bill approval/unapproval/void partial services and JournalVoucherResolver | Existing balanced posting, allocations, loan and period guards retained; no inferred payment |
| SQL read contract | BE7/9, UI6 | PurchasingBillingProgressQuery; PO GridFilterProjection and MaterializeListAsync; GRN ProjectList | Same enum/bool meanings before count/page/export; no page-local coverage calculation |
| Job source | BE8/14/18, UI2/12 | Existing Workshop Job → PO editor and typed PO client | New matching endpoint/interface/service/client; common tax/price/numbering writer reused |
| Authentication/catalog | Master4, UI26 | Authenticated base controller; PermissionCatalogAction metadata | Preserved; metadata is not claimed as runtime granular permission enforcement |
| Guide handoff | Master7 | Existing UserGuide reader and purchasing/payment topic registration | EN/AR updates in purchase-requests-topic, purchase-documents-topics, bills-topic, purchase-returns-topic and record-list-topics |

## Contract and state reconciliation

| Producer/path | Consumer | Final source evidence | Result / owner acceptance |
|---|---|---|---|
| BillDetail.GoodsReceivedNoteDetailId nullable FK/index | Add/Update/Detail VMs and Angular source payload/detail | Entity, BillDetailConfig, existing by-name BillDetailProfiler, server source lookup | Matched source; owner schema migration required |
| Lookup quantities | Bill source table and max validators | BillGoodsReceivedNoteLineVM → BillGoodsReceivedNoteLine; quantities exclude current Bill | Matched; concurrent draft/manual acceptance pending |
| Explicit chosen quantities/header set | PrepareLinesAsync and approval snapshot | Positive rows only; header IDs derived from those rows; duplicate and ownership checks | Matched source; approval/retry/rollback runtime pending |
| Derived coverage enum and draft bool | PO/GRN columns, filters and reports | Numeric enum0..4, typed DTOs, bilingual labels, explicit runtime tsconfig entry | Matched source; EF SQL translation/performance and grid output pending |
| Root/owned GUIDs | Shared action log | Seven document services and controller routes, six new typed clients/list dialogs | Matched source; capture/tenant separation/close-during-read runtime pending |
| Source Job ID | PO CreateFromJobAsync plus immutable update source | New from-job route, typed client/editor; generic/bulk guard | Matched source; independent read-only audit found no confirmed bypass |
| Cancel/delete and report predicates | Detail/list action availability, inventory readers | GRN effective-ref check, Return RemoveWithChildrenAsync, approved PO report filter | Matched source; actual transactions/stock/period rollback pending |
| EN/AR guide and messages | Existing readers | New coverage/editor keys, seven resource keys, scoped guide content | XML parsed and keys once per language; visual/bidi pending |

Action effects remain independent: PR saves no stock/JV; live nonrejected POs reserve PR quantity. Effective approved/legacy GRNs consume receiving capacity and add stock. IssueToJob creates a draft ItemIssue; stock deduction requires its separate approval. Bill draft reserves only, Bill approval posts its existing owned financial effect. UnApprove unposts and returns to reservation subject to current guards. Financial return posts supplier debit/counter-credit and allocations; it does not perform physical supplier stock return or inferred VAT reversal. Payment and allocation are the settlement evidence; quantity completion never proves payment.

## Verification evidence and limits

Root reviewed scoped frontend/backend diffs and direct shared contracts; bounded independent audits reviewed immediate side effects, new coverage diagnostics and Job source boundary. Corrected both diagnostic findings before handoff. Checked new .NET namespaces/global imports/project references and SDK source inclusion; new Angular enum is in the explicit application files list. Checked typed payloads, same response fields and existing mapper conventions. Both repository diff whitespace checks passed. Both resource XML files parsed, with each of the seven scoped keys present exactly once per language. This is source evidence, not a successful compilation or SQL execution claim. No builds, tests, lint, browser, database commands, migrations/snapshots or commits were run/changed for this scope; unrelated working-tree changes preserved.

Canonical BE18 now records the reusable document-cycle review steps; UI7 records independent progress presentation; skill rule and dated revision updated in the same task. Initial eight packets were current. After book changes all eight were regenerated only through Generate-SigmaRecipes.ps1. Semantic review confirmed source hashes/dependencies and shared confirmation/action/dialog reference roles remained consistent, with no replacement of model-specific state rules. Final check passed PLAN00 and PHASE00..06. Generated files were not edited directly.

Required owner migration suggestion: **AddBillReceivedLineSource**, adding nullable received-detail FK with restrictive delete and index. Do not deploy the new backend before its schema; release frontend/backend together. Existing unkeyed experimental source Bills need review/reset through separately authorized owner actions; no automatic reclassification/backfill is supplied.

Owner acceptance before declaring runtime closure: build both projects after schema update; create two partial drafts against the same source and check competing capacities; edit excluding own quantities; approve first/second and verify Partial/Full; unapprove/void/delete and confirm reservation release rules; verify quantity0/duplicate/foreign/serial rejections; compare filtered counts/page/export; inspect all seven logs; test receipt stock/IssueToJob separation, supplier AP/allocations/loan blockers, closed-period rollback and source Job path. Include RTL/theme/narrow layout and stale preview/navigation recovery.

Remaining established boundaries: foreign-currency drafts cannot post until exchange-rate support; PurchaseReturn is financial-only; pending receiving report retains its established legacy PO-number/supplier/item matching; log before-values for detached updates retain central capture limits. Existing singular GRN BillNo is only a reference to one matching live Bill, not a complete invoice list; authoritative coverage now comes from quantities, not this field. These were not silently redesigned or presented as supported capabilities.

## Later owner approval-pattern amendment — 2026-10-24

The owner subsequently approved a unified lifecycle with terminal rejection, required correction/rejection reasons, saved Approvals tab and Approval Status row action, and one Log label. Current implementation and exact newly authorized unapproval effects supersede the earlier baseline here through PURCHASING_UNIFIED_APPROVAL_DOMAIN_API_CONTRACT_FREEZE.md and PURCHASING_UNIFIED_APPROVAL_FEATURE_REVIEW.md. Refer to those for PR/GRN/Return unapproval and Bill rejection. This historical review does not prove the later transition work compiled or ran.
