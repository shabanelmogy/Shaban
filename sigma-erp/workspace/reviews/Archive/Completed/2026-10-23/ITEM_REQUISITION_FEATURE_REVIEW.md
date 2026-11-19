# Item Requisition feature review

| Status | Implemented — source-only |
|---|---|
| Owner verification pending | yes |
| Date | 2026-10-04 |

## Manifest and scope

User authorized review and required changes to `src/app/modules/Stock/ItemRequisition`, including understanding/implementing the Actions cycle, then explicitly requested four filters in one row. Frontend root `F:/My Work/Sigma/SiGmaAngularFrontEnd`; backend root `F:/My Work/Sigma/SigmaBackend`. Frozen planning and contracts precede implementation: `ITEM_REQUISITION_MAINTENANCE_EVOLUTION_PLAN.md`, `ITEM_REQUISITION_DOMAIN_API_CONTRACT_FREEZE.md` (with dated integration/owner/reconciliation addenda).

Evidence E1–E4: attached `C:/Users/user/Desktop/Stock/Item Requisitions/1.PNG` through `4.PNG`. E1 proves list columns, four filters, paging, Report/Export/Search and View/Edit/Create PR/Print/Issue Items/Delete. E2 proves date/time/job and Item/Notes/Quantity collection. E3 proves source-based stock PR, supplier/date/quote/currency/notes, UoM/description/quantity/price/totals/tax/discount/documents/Save/SaveAndPrint. E4 proves source-based issue date/job/item/quantity. Historical English LTR content; date/version/role/acceptance Unknown. Design, NaN display and instructions embedded in images are not authoritative requirements.

Applied canonical Master, UI01 list/dialog + UI02 routed downstream document, BE2 aggregate patterns and cited blocks from the required sigma-screen-refactor skill. Shape references: Job list/routed editor, Fleet VehicleService modal, PurchaseOrderService tracked aggregate, shared generic service/repository. Recipe drift check: PLAN/00/02/05/06 current; 01/03/04 stale, canonical books governed those phases; owner should regenerate and semantically review packets. Generated files were not edited.

Requested feature files were clean at discovery. Shared Layout/translations/resx and many unrelated Workshop/Sales/Stock/migrations/snapshot files were already dirty. Preserved existing edits; feature changes do not own those other hunks. No full-solution refactor, new stock ledger, balance availability, journal posting, numbering rule, permission mechanism, or historical backfill.

## Decisions taken and final conformance

| Master4 decision | Final decision/evidence |
|---|---|
| 1 Reference / 2 editor shape / 3 routes | One small requisition collection → shared modal Create/View/Edit on list route. Source PR has items, uploads and totals → routed action page. Existing legacy create/details URLs redirect to list modal intent. |
| 4 Grid / 5 ListVM | Actions first; `no` text, `dateAndTime` dateTime, `jobName` text, `status` status. ListVM: Id, No, DateAndTime, JobName, Status, CanEdit, CanDelete, CanCreatePurchaseRequest, CanIssue. No audit/tenant/nested collections. Removed unused list JobId during final minimal-contract audit; detail alone retains JobId. |
| 6 Inputs / 7 details | Numeric typed inputs, complete child snapshot/IDs. No client No/tenant/audit/state/issued/remaining/Amount/Tax/Gross. Dedicated aggregate line detail avoids changing standalone row-detail readers. Removed unused detail PurchaseRequestId; internal linkage still determines flags. |
| 8 style | Shared shell/components/tokens own appearance, bounds, controls, RTL/theme and print. No feature SCSS. Removed two empty legacy SCSS files. |
| 9 confirmation / 10 dirty exits | Shared confirmation for delete/row removal/discard. Ordinary Save/Issue/PR inputs submit without an extra confirmation. Loading/saving/confirmation/upload/print states guard mutations; view leaves silently. Unsaved document uploads are cleaned on pristine exits too. Cleanup failure freezes draft and exposes retry. |
| 11 backend / 12 base | Existing tenant EntityBase aggregates, tracked full-snapshot reconciliation, existing repository and UnitOfWork. One tenant ItemRequisition serialization lock covers participating source/downstream writers. |
| 13 duplicates | Requisition ItemIds unique within request; action source line IDs unique; one live source PR through tenant/source filtered unique index. No invented unique editable requisition number. |
| 14 references/delete | Every distinct Job/Item/Supplier/Branch/UoM checked against live tenant rows. Saved children must belong to request. Shared EF usage checks protect dropped/deleted children and downstream documents; source-linked PR/Issue block requisition edits/deletes. |
| 15 filters | No/status/job/date range; status zero retained; local dates inclusive; current month default. Server page15/max100; choices10/15/20/50/100. All four displayed fields sort server-side; Id descending fallback. Export/report fetch all matching pages, applied search snapshot. |
| 16 translations / 17 registration | One feature namespace en/ar, 92 matching keys with no missing/case-only keys. Feature service remains root; removed only its redundant Layout import/two providers. Existing interceptor HttpClient/base URL, local read/action errors plus global success. |
| 18 migration | Owner migration required; nullable Issue/PR source links, filtered unique index, explicit existing shadow child FK, restrictive relationships and Notes500. No generated migration/snapshot edits. |
| 19 reference actions | Complete coverage table below; unrelated Job transitions excluded for explicit domain reasons. |
| 20 overrides | Feature reasons enumerated below; generic inherited operations retained where valid. |
| 21 plan / 22 children | Frozen plan before changes. Entire request collection sent; ID0 new, saved positive ID retained, missing rows removed only after usage checks. |
| 23 money/VAT | Existing tax/rounding owners; optional tax0, mandatory standard settings. Round unit price/amount; document VAT allocated on backend and saved result printed. Discount remains existing stored header input and separate display; no invented allocation/posting. |
| 24 authorization | Existing AuthGuard/tenant context only. Delete/edit/Issue/PR are future authorization candidates at their named endpoints; can* flags are business eligibility, not security. |
| 25 business correctness | Fulfilment changes only through linked Issue quantities. PR creation alone cannot mean fulfilment. Re-read under shared lock prevents stale remaining quantities/duplicate PR; safe downstream deletion restores derived eligibility. |

| Concern/book | Actual shared/reference owner | Final values and reconciliation |
|---|---|---|
| UI1/3/4/6 list | Job list, FeatureTitle, FilterPanel, DataTable | route-host/list-page/panel; title inside panel; mainColumns4 per owner steering; shared responsive breakpoints; fill grid, fixed filters/footer; no local height/CSS. |
| UI13/14 requisition | Fleet/VehicleService modal, EditorDialog, EditableRows/Table | default1040 bounded dialog, contentPadded, two header columns, full flex chain/one body scroll; Item360px/Quantity150px/table780px minimum. Add/remove/view/save remain shared. |
| UI13/14 Issue | Same shared dialog/table | default1040, padded body, two header fields, source labels read-only, no arbitrary new source Item/Job IDs; remaining rows and numeric quantities. |
| UI02/14/18/20 PR | Job three-pane editor; FormSection, collection/files/SummaryCards | Shared master/document/detail panes, fixed footer, per-pane scroll; item table1500px min; UoM180px; density slim/row summaries min140/max80, own display preview only; upload tracker/folder purchaseRequest. |
| UI17/19/27 validation | date-utils/DatePicker/NumericFocus/FieldError/focusField | local date/time transport; finite integer quantities; required/live selections, length/money bounds; shared invalid focus and actual overflow scrolling; no native datetime-local. |
| UI21 reports | ReportPrintService/ReportActions/DataTable | complete results and all detail rows; report dialog shared sigma-dialog-print; routed saved PR shared print-flow, authoritative supplier/branch/item/UoM labels. Print blocks close/navigation until release. |
| BE8/14 ownership | PurchaseOrderService, OwnsAll/ReconcileOwned/RemoveDropped/RemoveWithChildren | tracked owner load; FK preflight; update ignores manually reconciled collection map; deletion safety; no detached graph replacement. |

No unapproved source-layout difference remains in scope. Visual/runtime conformance is pending; class names alone are not claimed as runtime proof.

## Cycle and action reconciliation

Reviewer choice under Master2 standing decision (owner acceptance pending): Open until every positive requested quantity has been issued; partial issue allowed; creation of PR does not close requisition. Historical empty requests remain Open. Historical source-null downstream documents are not silently linked. Ambiguous duplicate/null ItemId source rows reject actions clearly instead of guessing quantities.

| Approved Job reference action | Classification/reason |
|---|---|
| View | Supported: requisition modal. |
| Edit | Supported: source document guard. |
| Labour Time | Not Applicable: requisition has no labour/time-log aggregate. |
| Invoice on Customer | Not Applicable: requisition is stock demand, no customer invoice/financial collection transition. |
| Close Job | Not Applicable: request closes through derived Issue fulfilment, no job-closing invoice state. |
| Print Gate Pass | Not Applicable: no vehicle handover/gate-pass contract; requested requisition Print is implemented separately. |
| Delete | Supported: dependency-aware soft deletion. |

Source PR Save/SaveAndPrint/documents and Issue Save/Cancel are supported. VehicleService collection add/remove/edit/view/save/cancel/discard are supported for request lines; its fleet-specific details are Not Applicable because the request owns Item/Notes/Quantity, not a vehicle-service contract.

| Action | State and eligibility → result | Backend/interface/route | Frontend interaction, failures/refresh |
|---|---|---|---|
| View | Existing → unchanged | DetailAsync/DetailWithNavigationsAsync; GET GetByWithNavigationsId/{id} | Typed getDetails; read-only shared modal, retry both failure channels, no mutation. |
| Edit | No live linked PR/Issue, CanEdit → saved full snapshot | UpdateAsync/UpdateCore; PUT ItemRequisition | Typed update, live FK/child ownership/duplicate validation, shared dirty exit, preserve failed input; successful parent list re-read. Backend guard independent of stale UI. |
| Create PR | Positive remaining + no live PR, CanCreatePurchaseRequest → same fulfilment state + linked stock PR | CreatePurchaseRequestAsync; POST ItemRequisition/{id}/PurchaseRequest; frozen editable header/line/document payload | Routed source draft; save once; cleanup then return or saved-data print; one source PR index + same Req lock/re-read. Inline error, retries do not POST saved document again, return rereads list. |
| Print | Existing → unchanged | Same authoritative detail GET | Complete request/all lines read in shared report dialog; issued/remaining quantities included; read failure/retry, print lock, return focus. |
| Issue Items | Positive remaining, CanIssue → Open if partial / Closed if fully issued | IssueAsync; POST ItemRequisition/{id}/Issue; {dateAndTime,lines[{requisitionItemId,quantity}]} | Source-based shared dialog; zero draft lines omitted, ≥1 positive; server derives Job/Item, validates ownership and remaining inside same lock. Failed input retained, success rereads list. |
| Delete | No linked live PR/Issue, CanDelete → soft-deleted request/owned lines | RemoveAsync; DELETE ItemRequisition?id={id} | Shared confirmation; lock + generic dependency checks; global error/success owner, keep failed row; last-page adjustment/list re-read on success. |
| Report/Export | Applied no/status/job/date snapshot → unchanged | Paged GET ItemRequisition, complete fetch pages100 | Same four columns/formatters; all matches not current grid page; empty/failure feedback. |
| Delete linked Issue/PR (existing screens) | Dependency checks pass → source remaining/eligibility recomputed | Existing DELETE endpoints now share Req lock + owned-child usage checks | Existing consumers preserved. Linked whole-document edits reject clearly; delete/recreate only when allowed. Direct child/bulk writers cannot bypass provenance. |

## Contract, overrides and calculations

GET list/navigation list return one lean state projection; both detail routes return the same explicit aggregate read. Job label comes from persisted Job.No (no subject exists). Same-tenant historical labels remain readable; cross-tenant labels suppressed. Dedicated new line/action VMs keep standalone row contracts intact. Add/Update maps are one-way; only update-owned collection ignored. Removed unused FullList VM and oversized inherited audit/graph responses; scoped source has no remaining consumer of the removed type.

ItemRequisition overrides: ApplyListFilters (inclusive dates/derived status), ApplyListOrder (Job.No/status), MaterializeListAsync (state/flags), GetAllWithNavigationsAsync/GetManyWithNavigationsAsync (legacy read parity), both detail methods (derived quantities), AddAsync/AddListAsync (aggregate validation/serialization), UpdateAsync/UpdateCoreAsync (same lock/tracked reconciliation), UpdateListAsync (unused internal detached replacement rejected), RemoveAsync (source-link guard/owned delete). Generic GetMany/Select/activation inherit; activation does not alter fulfilment and is not added to UI. Controller keeps CRUD inherited, adds two action endpoints. Related ItemIssue/ItemIssueItem/ItemRequisitionItem/PR update/bulk/delete overrides exist only to prevent provenance/quantity bypass and serialize linked deletion. No PurchaseRequestDetail service/controller exists.

Source Issue has no inventory ledger/balance posting. This implementation records fulfilment against requisitions; it does not assert physical stock availability or create valuation/accounting entries. Persisted PR amount/tax/gross use existing Recalculate/FinancialNumberPolicy/VatPolicy/ITaxPolicyService, bounded to existing money storage; client preview is never an authoritative write. Tenant upload paths are checked for current supported path/extension shape; physical file existence is not asserted.

## Files changed (relative to verified roots)

Frontend:

- `src/app/modules/Stock/ItemRequisition/components/list/list.component.ts`, `.html`; empty `.scss` removed.
- `components/details/details.component.ts`, `.html`; empty `.scss` removed.
- New `components/issue/issue.component.ts`, `.html`.
- New `components/purchase-request/purchase-request.component.ts`, `.html`.
- New `components/report/report.component.ts`, `.html`.
- `models/create.ts`, `details.ts`, `list.ts`; new `models/actions.ts`.
- `services/itemrequisition.service.ts`, `itemrequisition.routes.ts`.
- Shared files: `src/app/modules/i18n/vocabs/en.ts`, `ar.ts` (only itemRequisition block); `src/app/_metronic/layout/layout.module.ts` (only redundant ItemRequisitionService registration). Existing specs preserved.

Backend:

- `SiGma.Business/IServices/IItemRequisitionService.cs`, `MapperConfig/ItemRequisitionProfiler.cs`.
- `SiGma.Business/Services/StocksServices/ItemRequisitionService.cs`, `ItemIssueService.cs`, `ItemIssueItemService.cs`.
- `SiGma.Business/Services/ItemRequisitionItemService.cs`, `Services/VouchersServices/PurchaseRequestService.cs`.
- `SiGma.DataAccess/Configuration/ItemRequisitionConfig.cs`, `ItemRequisitionItemConfig.cs`, `ItemIssueConfig.cs`, `PurchaseRequestConfig.cs`.
- `SiGma.Helpers/Models/Stocks/ItemRequisitionItem.cs`, `ItemIssue.cs`; `Models/Purchases/PurchaseRequest.cs`.
- `SiGma.ServerAPI/Controller/ItemRequisitionController.cs`.
- `SiGma.ViewModels/ViewModels/ItemRequisition/ItemRequisitionAddVm.cs`, `ItemRequisitionUpdateVm.cs`, `ItemRequisitionListVm.cs`, `ItemRequisitionDetailVm.cs`; unused `ItemRequisitionFullListVm.cs` removed.
- Seven new VMs in same folder: `ItemRequisitionLineAddVM.cs`, `ItemRequisitionLineUpdateVM.cs`, `ItemRequisitionLineDetailVM.cs`, `ItemRequisitionIssueVM.cs`, `ItemRequisitionIssueLineVM.cs`, `ItemRequisitionPurchaseRequestVM.cs`, `ItemRequisitionPurchaseRequestLineVM.cs`.
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx`, `GeneralMessage.ar-SA.resx`: fifteen feature keys, unrelated changes preserved.

## Phases, verification and learning

PLAN, Phases0–6 applied: evidence/current writers → frozen contract → list/read → detail/write → downstream actions → route/interceptor/provider integration → full scoped source reconciliation. No applicable source phase skipped. Runtime portion of Phase5 and owner acceptance in Phase6 pending under execution boundary.

Root reviewed scoped tracked diffs and all new runtime sources, including shared feature hunks. Source checks: existing references/imports/DTO payloads/routes/shared inputs checked, unused consumers/stale ms-lib/any/styles/merge markers checked, scoped git diff --check clean apart from expected line-ending notices. Official Check-Translations for itemRequisition: en92/ar92, missing0/case0; feature usage literal-key audit no missing keys. Resource XML feature parity15/15 without duplicates. Suggested migration basename is not already present. These checks do not confirm compilation, SQL translation or rendered layout.

Shared extraction: none warranted; existing reusable owners meet this scope, no new generic component/service or cross-feature CSS. Learning protocol: no new verified reusable rule; choices/limitations remain in feature artifacts, no skill-only guidance or canonical book change.

Agents after freeze: requisition_editor (inherited parent model, owned details/model create+detail), requisition_actions (inherited parent model, five new Issue/PR/actions files), requisition_backend (inherited parent model, bounded aggregate/related writer scope). Independent ownership reduced wait while root implemented list/service/routes/report/translations and integrated/audited all outputs. No overlapping concurrent ownership; root made final integration refinements after handoff. Retained existing workers rather than spawning overlapping work. Prohibited builds/tests/lint/browser/DB/migrations/snapshot edits/Graphify/Sigma MCP/commits/push/deploy were not run.

## Owner handoff

Required: generate and inspect `Add-Migration LinkItemRequisitionFulfilment`; check Notes over500 before narrowing, nullable source columns/no backfill, restrictive FKs and filtered tenant/source unique PR index. Preserve unrelated pending Sales migrations/snapshot changes. Build/deploy frontend and API together after schema change; rebuild/restart backend so new endpoints/projections are active.

Manual verification: create/edit/view/unchanged save; duplicate/minimum/invalid decimal rows; required/stale FKs and foreign saved child IDs; four filters/zero Open/cleared dates/inclusive bounds/sorting/paging/route restore; all-page report/Excel and multipage request print; partial/full Issue/overissue/parallel issue; PR one-per-source/parallel creation/source remaining race; safe linked delete/reopen and rejected linked edits/direct row writes; optional/mandatory VAT rounding; upload replace/remove/cancel/cleanup failure; SaveAndPrint retry never duplicate POST; English/Arabic keyboard/modal focus, RTL, dark theme, narrow viewport/internal scrolling. Verify EF translation and lock serialization against real SQL Server. Historical unlinked documents remain unlinked; ambiguous legacy source lines need owner correction rather than automatic data rewrite.

Suggested commits (suggestions only): frontend `refactor(stock): align item requisitions and downstream action workflows`; backend `feat(stock): link requisition purchasing and issue fulfilment`. Overall owner acceptance remains pending, not Closed.

## Purchase Request layout amendment, 2026-10-04

Implemented in source; visual/owner acceptance pending. The owner's final clarification selects request fields in one vertical pane and Items in another beside it, superseding the initial stacked layout and intermediate two-column field-grid interpretation. Documents now has its own tab. Scope is the requisition-owned Create Purchase Request page.

Changed `components/purchase-request/purchase-request.component.html`, `.ts`, new `.scss`, and one `purchaseRequestSections` translation per language. The layout contract amendment was recorded before edits. Public payloads, calculations, upload cleanup, save/print and saved-document rendering are unchanged.

Conformance evidence: UI13 `EditorTabsComponent` public typed tabs/activeTab/activeTabChange/disabled/ariaLabel/idPrefix/appearance compared with target `tabs`, `currentTab`, `setCurrentTab` and workspace markup; panel IDs exactly match the shared `${prefix}-panel-${key}` and labelled-by tab IDs. UI1/13 shared `sigma-editor-pane`, `sigma-editor-pane-fields`, FormSection fill and bounded scroll compared with the target workspace: fields use the shared single-column rule, master width 240–280px comes from the existing three-pane source, Items occupies the remainder, 620px container breakpoint stacks bounded 0.8fr/1fr rows. The feature owns only the two-pane arrangement; shared owners retain field, section, table, tab and summary styling. UI14 Items/Documents use existing EditableCollectionTable fillHeight/stickyHeader; UI24 slim/row/min140/max80 totals and footer remain outside the clipped body. UI18 parent FormArray and DocumentUploadTracker retain attachment state; tabs are disabled while save/confirmation/upload/cleanup/print is busy. Invalid Save selects the tab owning the first invalid field before shared focus. Existing authoritative saved-print branch remains complete and independent of draft tabs.

Applicable discovery/freeze, frontend editor, integration and source reconciliation completed; no new backend/schema or read-grid work is applicable. No shared extraction warranted and no verified reusable guidance added. This small sequential layout amendment was handled by root without delegation. Recipe check: PLAN00/PHASE00/02/05/06 current, PHASE01/03/04 stale; canonical books govern and owner regeneration/semantic review remains pending. Translation check now en93/ar93, missing0/case0. Scoped source and whitespace checks performed; compilation, rendered geometry and runtime focus/upload verification remain unconfirmed. Prohibited builds/tests/lint/browser/DB/migrations/snapshots/Graphify/Sigma MCP/commits/push/deploy were not run.

Owner manual checks: desktop two vertical panes, Documents tab, narrow stacked/internal scroll, retained values/files across tabs, invalid Save tab/focus, upload-in-progress tab lock, fixed totals/footer, English/Arabic/RTL/dark theme and saved print including all lines/documents.

### Numeric badge follow-up

Implemented in source after the owner explicitly requested the previous blue badge for non-editable numbers and promotion to the guide. Target PR `columns` now selects `numeric:true, align:'center'` for Remaining Quantity/Amount/Tax/Gross; the matching four projected spans use shared `__value` + `__value--highlight`. Quantity/Unit Price keep editable inputs. Compared producer `EditableCollectionTableColumn.align`, shared header binding and highlight SCSS with actual Workshop Job/Estimate Price/Charges consumers: centered text/header, themed title color, 12% primary/surface tint, 700 weight, 6px radius, 34px line. No shared/style implementation or formula/format/payload changes required. Zero remains visible.

Learning promotion now applicable: updated owning `ui/14-editable-collection-table.md`, UI preamble version1.69 and CHANGELOG, plus required skill §1 and revision history, to generalize this appearance for non-editable numeric cells in new/reviewed collection editors. DataTable/report and SummaryCards retain their presentation owners; unrelated legacy adoption stays review-scoped. Generated files were not edited; derivative regeneration and semantic review are pending. Source reconciliation completed; no build/runtime/visual acceptance claimed. Manual check adds blue badges, matching centered headings, editable inputs, zero/formatting, Arabic/RTL/theme/print.

Post-promotion read-only recipe check confirms PLAN00 and all PHASE00–06 packets stale after the canonical version/block change; the earlier pre-change check remains historical evidence. Canonical sources govern this completed source amendment, with regeneration/semantic review pending. No automatic numeric-cell inference or application-wide consumer migration is claimed: the existing shared highlight is explicitly selected by the reviewed editor.

Quantity width follow-up: owner requests a smaller Quantity input. Target `columns` selects public `width:'100px'` for that column only; compared shared `hasFixedColumnWidths`/colgroup `column.width` before numeric fallback180px and shared input width100%. No feature cell/input CSS or numeric validation/precision changes. Visual sizing remains pending. The global badge capability question was answered; no new standalone badge component or application-wide migration was performed.

Unit Price follow-up: owner's subsequent request selects the same public width contract at120px, slightly wider than Quantity100px; decimal entry/validation unchanged. Final source column mapping and whitespace reviewed; visual acceptance pending.

Amount/Tax/Amount With Tax width follow-up: all three target draft `columns` select public width120px, retaining numeric/center and shared blue highlight. Table minimum reduced1500→1360px, matching the sum220+180+200+180+100+120+120+120+120 of declared/minimum/shared-fallback column widths; shared frame still owns horizontal overflow. Values, money formatting, tax/gross calculations and saved-document grid unchanged. Owning UI14 public column.width/tableMinWidth and shared colgroup precedence remain the same. Scoped source/whitespace reviewed; build/runtime/visual acceptance remains pending. No delegation, new reusable guidance or prohibited command required.

## PR creation badge/filter, 2026-10-04

Implemented — source-only; owner verification pending. Explicit owner request adds PR creation state to ItemRequisition list, with a filter. Frozen dated amendment before source edits. Existing `PurchaseRequest.ItemRequisitionId` is authoritative; badge means a currently live same-tenant linked PR, so deletion resets it. No stored flag, schema/migration or writer change. Creation state remains independent of fulfilment Open/Closed. Owner's questions answered from current `Remaining`/list/detail code: full Issue of every requested item closes the request; partial Issue remains Open even when PR purchases the full request, and deleting an Issue can reopen it. No state-transition change requested or implemented.

Changed FE `components/list/list.component.ts`/`.html`, `models/list.ts`, `models/details.ts`, four keys each in en/ar; BE `ItemRequisitionService.cs`, `ItemRequisitionListVm.cs`. Existing dirty work preserved. PR-created/not-created is the fifth displayed business column after Status, non-sortable, shared status(success/neutral). Main four filters remain in one row; PR filter is in More Filters, default/reset All. Restored selected filter automatically opens its panel. Its integer0/1/null contract preserves Not Created0 in route/API, paging, editor return, report and Excel; closing More Filters preserves values. Single-document print obtains the new bool from detail projection because it renders the same columns.

| Concern | Governing blocks and actual reference/owner | Target source comparison/result |
|---|---|---|
| Badge and text export | UI5/8; Job list `hasInvoice`/`invoiceStatus`; DataTable `statusOf`/`statusClass`, `dataTableCellText`/`dataTableExportRows` | `columns.hasPurchaseRequest` uses type status, created success/not-created neutral and translated keys. Same columns feed report/Excel, with text labels instead of raw bool. No feature CSS/template. Matched in source. |
| Four main fields and advanced PR control | UI4/16; Job list FilterAdvanced/advancedFilterNames; shared FilterPanel/FilterAdvancedDirective/TranslateOptionsPipe | Standalone FilterAdvanced imported; mainColumns4 retained; advancedControls=['hasPurchaseRequest']; translated dropdown IDs1/0, clear→null. Shared countActive treats0 as active; parent typed FormGroup persists hidden value. Matched in source. |
| Applied state/zero preservation | UI2/6/10; `toFilterParams`, `readListRoute`/`writeListRoute`; target query/routeParams/getAllList/report | Form/search/restore accept only0/1, resetnull; query/routeParams spread applied state. Shared URL helper drops booleanfalse but preserves integer0; HTTP helper serializes0, omitsnull. All-page retrieval keeps filter. Matched in source. |
| Server state/filter/count | BE9/13/14; FilterHelper.GetInt, BranchService.ApplyListFilters, shared base ListQuery; Repository.Query | LivePurchaseRequests uses authenticated subscription/nondeleted query. Target ApplyListFilters applies correlated Any/!Any for0/1 before count/paging; missing/malformed/unsupported omitted. List HasPurchaseRequest=purchaseIds.Contains(row.Id), detail=prId.HasValue. No page-only inference or CanCreatePurchaseRequest inversion. Matched in source. |
| Read-contract/minimal fields and sorting | Master4/5, UI5; backend ListVM/inherited DetailVM and FE DTO/report consumers | Added only displayed bool; detail adds it because report uses it. No PR identity/audit/write field. New column non-sortable; target isSortField now checks sortable===true. Existing stored/derived sortable fields unchanged. Matched in source. |

Phases0/1 freeze, 2 read/filter, 5 integration and 6 source reconciliation applied; write/editor/risky-action implementation not applicable. Worker `pr_creation_backend` (inherited parent model) owned only two backend files after freeze; root owned FE/artifacts and integration, avoiding overlap. No existing agent remained available, so one bounded worker created. No shared extraction or verified new reusable guide rule needed. All generated recipes remain stale; canonical books govern, regeneration/semantic review pending.

Verification: scoped Git diffs/source reviewed separately in both repositories, DTO bool/filter integer casing and source consumers checked; git diff --check clean apart from CRLF notices. Official translation parity en97/ar97, missing0/case0. No builds/tests/lint/browser/DB/migrations/snapshots/Graphify/Sigma MCP/commits/push/deploy run. Compilation, EF translation, rendered badge/filter and runtime acceptance remain owner-pending.

Owner handoff: frontend and API must be rebuilt/restarted together to activate the new field/filter; this slice requires no migration. Manual checks: Created/Not Created/All and clear/reset,0 restored across paging/editor return, active filter visible in More Filters, full report/Excel labels and all matches, PR creation changes badge after return, soft-delete resets badge, unrelated tenant/deleted PRs excluded, fully issued without PR shows Closed + Not Created, PR with partial Issue shows Open + Created, English/Arabic/RTL/theme/keyboard. Existing prior feature migration handoff remains separate and unchanged.

## Five inline filters and reported false PR badge, 2026-10-04

Layout/presentation correction implemented in source; the reported live-state mismatch remains Uncertain pending runtime evidence. Owner explicitly supersedes earlier four-main-field/More Filters placement: all five filters narrower in one desktop row/on one level. Target list selects public mainColumns5/stableLayouttrue and moves the existing PR dropdown into the main grid. Shared filter grid changes four→five equal-width columns, retains34px controls, top-aligned stable fields/bounded dropdown/calendar hosts and shared narrow wrapping. Removed FilterAdvancedDirective import, advancedControls/template, advancedFilterNames/advancedFiltersVisible and restore-only panel state. Filter values/search/route/report/export unchanged. No local CSS or shared style changes.

Confirmed source presentation defect: previous badge truthiness mapped missing/undefined/null to Not Created. Target shared status column now labels strict booleantrue as Created(success), strict booleanfalse as Not Created(neutral), otherwise a translated unavailable(warning). Added purchaseRequestStatusUnknown in both vocabularies. The bool wire contract remains required; unavailable is defensive presentation for a malformed/older response, not guessed domain state. Same callback drives table/export/report. This prevents false absence claims but does not prove that the owner's live linked PR now returns true.

Owner confirms both frontend and API rebuilt/restarted, and creation from requisition Actions. Do not assert stale API or standalone/legacy unlinked creation as the cause. Read-only worker pr_creation_backend traced ordinary base controller GET→virtual GetManyAsync→target MaterializeListAsync bool projection, Actions POST source FK assignment→same-instance numbering/Add→SaveChanges→transaction commit, sealed EF FK configuration registration, DI and JSON exclusions. No demonstrated backend source defect found. Current source sets HasPurchaseRequest=purchaseIds.Contains(row.Id), detail=prId.HasValue and filters correlated live Any/!Any; all tenant/nondeleted scoped. Root compared current writer/controller/config/entity/source queries; production environment selects a remote API while development selects localhost, but the owner's actual running URL/response is Unknown, so no environment change or deployment inference made.

Runtime evidence requested: exact GET list row id/hasPurchaseRequest/canCreatePurchaseRequest/canEdit plus API URL and created PR id. Absent, explicitfalse, and true-but-wrongly-rendered require different fixes. No row associations, historical flags, fallback inference from action availability or local optimistic badge written. No schema/database or backend source changes in this follow-up. Request remains open for the actual reported state mismatch.

Conformance: UI4/5/16 actual FilterPanel.mainColumns/stableLayout and its grid/34px rules, Job list stable filters, DataTable status callbacks compared; target public choices5/true and true/false/unavailable branches match. Existing frozen contract amended before source edits; phases0/1, frontend list presentation, read-chain integration audit and scoped source reconciliation applied. Write/action changes not applicable absent evidence. Existing worker reused for bounded read-only backend audit while root implemented disjoint FE work. Learning remains feature-specific; no new reusable owner extraction or guide rule. All recipes stale; canonical sources govern, regeneration/semantic review pending.

Scoped source/whitespace checked; translations en98/ar98, missing0/case0. No builds/tests/lint/browser/DB/migrations/snapshots/Graphify/Sigma MCP/commits/push/deploy run. Compilation/rendered alignment and live row state not verified. Owner checks five desktop filters/top alignment, validation message under Date without moving others, narrow/RTL/theme,0/1/clear/reset/paging/return, missing field→unavailable and true/false badge/report/Excel labels. Do not mark the reported runtime mismatch resolved from this source-only correction.

## Issue Items blank body fix — 2026-10-04

Implemented — source-only; owner verification pending yes. Only application edit: ItemRequisition/components/issue/issue.component.html projected div now uses sigma-editor-scroll flex-fill. Owner reports a blank ItemIssue action dialog. Source confirms the inner scroll region had flex:1 1 0 under EditorDialog auto-height/overflow-hidden content. UI13 explicitly warns that maxHeight supplies no definite height to zero-basis descendants and permits content-sized flex-fill (1 1 auto). Actual ItemRequisition details and Item details already use this recipe; the action has only one projected scroll link, now corrected. This restores intrinsic body sizing while preserving shrinking/inner scrolling and fixed header/footer. Loading/error/retry/DateAndTime/Job/items/quantity controls all remain within the same corrected body.

Conformance: UI13 content-sized modal → EditorDialogComponent.dialogStyle/.app-editor-dialog-content and ItemRequisition details sigma-editor-scroll flex-fill → action identical shared classes, no fixed-height blank space, feature CSS or shared-default change. Read-only backend ReadDetailAsync/ItemRequisitionDetailVM/ItemRequisitionLineDetailVM and frontend getDetails/source/lines use matching ItemRequisitionItems/RemainingQuantity/CanIssue members; no source-supported need for API/data edits. Earlier filters, shared Quantity widget, formulas, remaining cap, Save, source lock, dirty-close and all business cycle contracts are unchanged. No migration, AutoMapper or backend modification. Frozen amendment recorded before source edit. Existing earlier dirty/untracked changes retained.

Phases applied: bounded Phase0 source trace, Phase1 presentation amendment, Phase3 one-class correction, Phase5 existing import/route verification, Phase6 full affected template/source review and whitespace check (file remains untracked from prior implementation, so no-index check used). Backend/grid/action implementation skipped because the defect is body layout. No subagents: one small sequential fix fails the delegation gate. No new reusable rule: UI13 and required skill already own the exact recipe; no duplicate guidance added. Generated packets drift; regeneration/semantic review remains pending.

Source fix is complete; actual browser reproduction/acceptance is not claimed. Owner: rebuild/reload frontend, open a requisition with remaining quantities → Actions/Issue Items, confirm DateAndTime/Job and every remaining row are visible; long rows scroll inside body with reachable Cancel/Save; failed read shows error+Retry; narrow/RTL/dark display and quantity stepping retain behavior. If the body still appears blank after this rebuild, actual screenshot/console/GET response evidence is required to identify another runtime cause. Suggested FE commit: fix(stock): preserve requisition issue dialog body height. No build/test/lint/browser/DB/migration/Graphify/Sigma MCP/commit/push/deployment performed.