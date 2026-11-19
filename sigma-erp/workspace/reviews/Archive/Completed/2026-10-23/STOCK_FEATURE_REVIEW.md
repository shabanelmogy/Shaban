| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Stock module review and implementation — 2026-10-09

## Manifest

Owner requests review and application of documented fixes to `src/app/modules/Stock`.
Frontend owner: `F:/My Work/Sigma/SiGmaAngularFrontEnd`; backend owner: `F:/My Work/Sigma/SigmaBackend`.
Eleven roots: Item, ItemType, UnitsOfMeasures, ItemRequisition, ItemIssue, ItemReturn,
StockTransfer and four standalone child roots ItemRequisitionItem/ItemIssueItem/
ItemReturnItem/StockTransferItem. All four child roots still have lazy routes in
`pages/routing.ts`, so they are not dead scaffolds and cannot be silently retired.
No new screenshot applies to Stock; the preceding TariffCard screenshot is outside this request.

Stock source starts clean. Frontend reader/sidebar/layout/vocab files already carry
unrelated changes; other modules have many owner/peer changes. Backend SalesAgreement,
Receipt/MiscellaneousInvoice, resources, DbContext and migrations/snapshot already
carry unrelated changes. Preserve them; migrations/snapshots are out of bounds.

Selected shapes: Item/ItemType/UnitsOfMeasures normal entities (BE13), list with
controlled modal (UI13). Ordinary issue/return/transfer aggregate rows follow BE14;
requisition also has existing Issue/PurchaseRequest actions whose authoritative
state/quantities/money remain backend-owned. UI13 one-small-collection modal rule
applies to ordinary headers; PurchaseRequest action uses its existing routed
document editor with rows/documents/totals (UI1/13/14). Existing print/report
dialogs use UI20/21/22 without redefining the separate stockReports module.
Standalone child contracts require further source classification before changes.

Applicable packets: PHASE00/01 discovery/freeze, PHASE02/03 read/editor fixes,
PHASE04 existing actions, PHASE05 source integration, PHASE06 reconciliation.
Initial recipe `-Check` passes all eight packets; continuous refresh applies to
any canonical/template/manifest changes. No builds/tests/lint/browser/app/database/
migrations/snapshots/commits/push/deployment/Graphify/Sigma MCP commands authorized.

Confirmed cross-screen findings: eager `canDeactivate` confirmations and pending
flags violate UI10's subscription-time decision; editable collection removals
do not opt into the existing pending form freeze. Requisition Issue action has
the same eager guard. Other findings must retain source evidence and freeze
their affected contract before implementation.

Root owns artifact/contracts, shared vocab/guide/menu/wiring, integration and
final reconciliation. Bounded feature streams may inspect/implement disjoint
files after frozen handoff; no worker may edit the shared files or invent new
business/persistence/access rules.

## Standalone child workflow decision — pending owner

Source audit confirms live legacy routes, placeholder list columns unrelated to
actual VMs, and editor payloads exposing tenant/audit/status/IDs. Existing child
Add contracts omit parent IDs; Issue requires an ItemIssueId on its entity, so
its independent Create cannot establish a valid parent. Other independent
creates can produce unowned lines ignored by header-joining stock reports.
Return/Transfer generic standalone mutation can bypass parent minimum,
duplicate and source/destination invariants. A full child redesign therefore
changes existing workflow and may affect stock/valuation or restrict existing
actions. This portion is not frozen by the lifecycle contract.

Asked the owner to choose managing rows through principal documents (redirect
legacy routes) versus retaining standalone screens with explicit parent binding.
AGENTS scope/frozen-contract and Master4 material missing-contract boundaries
require that choice; no elapsed-time default authorizes dependent edits.
Independent main-screen fixes and guide completion continue. No child route,
writer or source is silently deleted or restricted while the decision is pending.

Owner subsequently asked for clarification, then explicitly chose management
from within the document. Approved amendment and source ownership:
`STOCK_CHILD_WORKFLOW_CONTRACT_FREEZE.md`. Old child links will redirect to the
appropriate principal document list; obsolete frontend source/provider references
can be retired. Backend compatibility endpoints and stored data remain untouched.

## Final implementation and reconciliation

Source implementation completed on 2026-10-09. The historical pending-choice
section above is superseded by the owner's explicit document-owned workflow.
Runtime/compiler acceptance remains pending; this report is not a runtime sign-off.

### Grid, filter and read-contract decisions

The following final frontend properties match the existing backend ListVMs;
capitalization differs through existing JSON naming. No list/detail DTO was changed.

| Screen | Ordered visible grid fields | ListVM properties | Applied filters |
|---|---|---|---|
| Item | id, no, name, type, supplierItemCode | id, no, name, type, supplierItemCode | no, name, type, supplierItemCode, barCode |
| ItemTypes | name, type | id, name, type | name, type |
| UnitsOfMeasures | name | id, name | name |
| ItemIssue | no, dateAndTime, jobName | id plus visible fields, canEdit | no, jobId, dateFrom, dateTo |
| ItemReturn | no, dateAndTime, jobName | id plus visible fields | no, jobId, dateFrom, dateTo |
| StockTransfer | no, dateAndTime | id plus visible fields | no, dateFrom, dateTo |
| ItemRequisition | no, dateAndTime, jobName, status, hasPurchaseRequest | id plus visible fields, canEdit, canDelete, canIssue, canCreatePurchaseRequest | no, jobId, dateFrom, dateTo, status, hasPurchaseRequest |
| Four legacy child screens | Retired, no grid | Compatibility API contracts retained | Old queries dropped when redirecting |

Lists retain `DEFAULT_PAGE_SIZE`, `resolveListPaging`, applied-filter snapshots,
route paging/sort state and switchMap request cancellation. Base ListQuery owns
stored-property filters and tenant/live scope; document services own inclusive
date filters and navigation/derived sorting. Requisition status/PR flags and
action predicates are projected server-side. CountAsync precedes paging; existing
total/page metadata is retained. Complete matching export/report reads retain
their existing scope. StockTransfer has no Excel/report action to invent.
All seven filter panels opt into stableLayout. Four document lists hydrate saved
date ranges with shared toPickerDate instead of private date-format copies.

### Write, action and ownership decisions

The lifecycle freeze records exact existing editable inputs. Reviewed forms still
send only those inputs; IDs are added for Update and retained saved child rows.
No tenant/audit/status/remaining quantity/calculated total is added to writes.
Main documents still send complete row snapshots; minimum one, positive Int32
quantities, duplicate-item rules and Transfer item/source uniqueness remain.
Transfer header branch is the destination; row branch is its source; Current
Branch remains context. No stock availability, valuation or journal rule is added.

| Action family | Final classification and behavior |
|---|---|
| Create / View / Edit / Delete | Supported existing list/modal workflow; confirmed Delete, existing backend usage/state checks, one mutation feedback owner and applied-query refresh |
| Item/Type/Unit uniqueness | Existing server rule; Item Name/BarCode retained, Type/Unit Name preflight added through CheckUnique; blur commit and settleStepValidation before Save; failures retain draft |
| Requisition Issue | Supported existing typed dialog; only selected positive rows, authoritative remaining upper bounds; no new DTO/endpoint; deferred discard and preserved controls |
| Requisition Create PR | Supported existing routed editor; supplier/UOM/money/remaining checks retained, typed uploads/documents and preview totals; savedId prevents repeated POST after persistence, cleanup/read/print retries use existing flow |
| Report / Print / Excel | Existing supported actions retained by each screen; all matching applied results or saved record as appropriate; composed-read error helper reused |
| Approve / Reopen / Activate / ledger posting | Not supported by these contracts; no reference-domain transition copied into Stock |
| Standalone child mutations | Frontend retired by owner decision; old root/create/details/other paths redirect to corresponding document list without reinterpreting child IDs |

Nine editable exits (three masters, four document editors, Issue and PR) decide
inside defer, reject repeated subscriptions and recheck identity/lifetime/busy
state. X/Cancel/Escape/route use the same decision. Shared freezeFormState preserves
disabled controls; canceled decisions retain values and dirty state. Master exits
commit pending blur text before deciding pristine/dirty. Four document collections
and PR documents opt into EditableRows.freezeParentOnConfirmation; Save, Add,
mode switch and navigation respect confirmationPending. Save failure restores
controls; successful Save closes/refreshes without discard. Existing request and
focus teardown is retained; master deferred focus uses destroyed-scoped timer.
Issue dialog uses the existing translated record subtitle.

### Backend override, mapper and calculation reconciliation

No backend source change was needed or made by this task. Scoped backend diff is
empty; pre-existing unrelated changes are preserved. Existing overrides were
classified against BE13/14 rather than replaced with generic CRUD.

| Existing overrides | Source-supported reason |
|---|---|
| ItemService / ItemTypeService / UnitsOfMeasuresService: UniqueColumns, RemoveAsync | Declared business keys and reference-aware deletion; remaining operations use the base |
| All four document services: ApplyListFilters, ApplyListOrder, MaterializeListAsync, GetAllWithNavigationsAsync | Date/derived filters, job-name/derived ordering and lean navigation/state projections; compatibility navigation reads preserve same shape |
| Issue and Requisition: GetManyWithNavigationsAsync, DetailAsync, DetailWithNavigationsAsync | Same lean list with count/paging and tenant/live detail; Requisition fulfilment projection requires its service-owned reads |
| All four: AddAsync, AddListAsync, UpdateCoreAsync, UpdateListAsync, RemoveAsync | Validate complete owned rows/FKs/minimums; retain tracked IDs, reconcile omissions, save complete aggregate; reject unsupported batch Update; delete children with header |
| Issue and Requisition: UpdateAsync; Requisition Add/Remove/action locking | Linked-state rules and shared requisition write lock serialize mutation against Issue/Create PR; no new lock boundary added |

Scoped controllers add no generic overrides. Existing typed Requisition action
methods remain the service/domain owner. AutoMapper's Ignore on manually
reconciled Update collections is necessary; no ReverseMap or extra Ignore is
introduced. Requisition reads use explicit derived projections. Item import's
existing FK Ignore belongs to its manual resolver and is preserved.
Remaining quantities and Open/Closed flags remain derived from live documents;
PR persisted totals/tax remain backend-owned, with the existing UI preview only.
Existing one-save aggregates use their established transaction boundary.

### Final reference conformance

| Concern | Final target symbols/values | Owning evidence | Result |
|---|---|---|---|
| Lists/filters | Seven list templates: sigma-list-page/panel, FeatureTitle, DataTable fill/currentPageReport, FilterPanel stableLayout | UI1/3/4/6; approved Job list and public shared inputs | Source match; visual acceptance pending |
| Ordinary editors | Existing EditorDialog contentPadded/focusOnShow and typed small collections retained | UI13/14; EditorDialog and EditableCollectionTable declarations | Source match; no bespoke replacement shell |
| Discard | Nine canDeactivate methods: one deferred decision, active identity/busy guards, freeze/restore | UI10; Movements collectionMovement details and shared form-state | Source match; navigation acceptance pending |
| Remove | Four rows helpers plus PR documentRows: freezeParentOnConfirmation true, canMutate/pending checks | UI14; actual EditableRows requestRemove identity re-resolution | Source match; interaction acceptance pending |
| Validation | ItemType/Unit uniqueFieldValidator(Name), settleStepValidation, validating/inert gates | UI12/19; existing helper exports and generic CheckUnique | Source match; HTTP/compiler acceptance pending |
| Route aliases | Four wildcard CanMatchFn guards return fresh list UrlTrees with no queries | UI1; installed Angular17.3.12 CanMatchFn/route validation declarations | Source match; direct-link acceptance pending |
| Feedback | Composed exports/reports use composedReadErrorMessage; ordinary reads use apiErrorMessage; existing interceptor suppression retained | UI2/22; public shared helper/BaseService contracts | Source match; failed-request acceptance pending |
| Guide | stock-guide topics/steps/questions, reader STOCK_GUIDE, sidebar /UserGuide/stock | Master7; existing typed reader/journey owner | Source match; bilingual reading/RTL/theme acceptance pending |

### Files changed and user guide

- Stock: 35 modified files (seven details/list/report sets, Issue/PR action TS/HTML,
  four retained route modules) and 48 obsolete frontend component/model/service
  files removed under the four child roots. Principal models/services stay intact.
- LayoutModule: remove only the four retired Stock service imports and their two
  provider-array registrations; preserve earlier Lease and other pending edits.
- `UserGuide/content/stock-guide.ts`: new bilingual module guide with seven topics,
  three journey steps and four FAQs; covered routes are UnitsOfMeasures, ItemTypes,
  Item, ItemRequisition (including Issue/PR), ItemIssue, ItemReturn, StockTransfer.
- Reader registers STOCK_GUIDE; stock sidebar exposes `/UserGuide/stock` through
  existing userGuide.menu. Arabic vocab adds missing sideMenu.stock and its seven
  screen names; existing English keys and unrelated vocab changes are preserved.
- Review and two frozen-contract artifacts under the Sigma reviews folder.

### Verification, packet maintenance and execution boundaries

- Reviewed complete scoped changed source and retirement/wiring diff separately
  from unrelated frontend changes. Related backend source/VMs/mappers/controllers
  inspected; no scoped backend edits. No entity/nullability/length/index/relation/
  column or EF change: **Add-Migration is not required**.
- Parsed 81 scoped/related TypeScript files and 20 Stock Angular templates with
  installed parsers: no syntax errors. 595 local named import symbols resolve to
  actual exports; runtime local paths resolve. New shared bindings match current
  public inputs; no schema/cast/compiler-root workaround. These checks do not
  constitute type-checking, Angular compilation or application verification.
- 325 static feature/common/guide translation references have English and Arabic
  keys; guide topic routes match principal lazy routes. No retired component/
  model/service references remain. No scoped merge markers or whitespace errors.
- Seven untouched list .spec.ts scaffolds still import the removed widgets-example
  ListsComponent. They do not test Stock and are not runtime roots. Recorded as
  existing owner test-suite follow-up; this source task did not run/rewrite tests.
- Initial and final recipe `-Check`: all eight packet IDs pass (PLAN00 and
  PHASE00–06). No canonical book/template/manifest was changed, so regeneration
  was unnecessary. Continuous maintenance rule is honored; no packet is stale.
- Phase00/01 discovery/freeze, Phase02/03 applicable source fixes, Phase04 existing
  action lifecycle, Phase05 source integration/guide and Phase06 reconciliation
  applied. Runtime portions of Phase05/06 remain owner-pending. No new business
  feature, unrelated stockReports rewrite or schema phase was introduced.
- No build, test, lint, browser/app verification, database command, migration,
  snapshot edit, commit/push, deployment, Graphify or Sigma MCP operation was run.

### Compatibility risk and owner acceptance

Old backend child endpoints remain reachable for compatibility. Their Add shapes
still lack parent binding; Return/Transfer standalone writes can bypass aggregate
rules, and Issue child detail has an existing collection/navigation mismatch.
Frontend retirement is not API hardening or authorization. No existing data,
accounting effect, endpoint access or parent assignment was changed. A separate
backend contract decision is needed before restricting or redesigning those APIs.
The app's existing AuthGuard is authentication, not a new permission mechanism.

Owner verification: compile application separately; open each old child root,
create and details/ID link (also with stale editor query) and verify correct list
destination; check master blur/Enter uniqueness and duplicate/failure retry;
check modal/routed X/Cancel/Escape and navigation with dirty/pristine forms;
cancel and confirm saved-row removal and verify busy buttons/disabled fields;
exercise Save failure/success and full-row snapshot, linked requisition Issue/PR
locks/remaining quantities, PR upload cleanup and Save-and-Print retry without
duplicate POST; restore date filters/paging and complete export/report; read the
seven guide topics in EN/AR at narrow widths/light/dark themes.

Suggested frontend commit (Stock changes and only their related shared-file hunks):
`fix(stock): preserve editor state and manage rows through documents`
No backend commit or migration suggestion is applicable. Review records are local
unversioned files under the current instruction-layer ownership boundary.

### Agent utilization and integration

Three bounded inherited-model streams were used after frozen handoffs:
stock_master owned Item/ItemType/UnitsOfMeasures; stock_documents owned the four
principal documents and Requisition actions; stock_children audited four legacy
roots. This reduced independent source/contract tracing without overlapping files.
Workers stopped at their tool usage limit before final closure. Root inspected
their actual edits, completed child routing/retirement, tightened all repeated
guard decisions, integrated guide/wiring/translations and owns final reconciliation.
No additional agent was needed for this continuation; no worker sign-off substitutes
for root review. Exact elapsed/cost savings are not measurable here.
