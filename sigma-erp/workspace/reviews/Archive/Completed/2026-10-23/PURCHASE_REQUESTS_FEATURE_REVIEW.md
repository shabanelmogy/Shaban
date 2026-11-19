| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Purchase Requests review and implementation — 2026-10-15

## Manifest and outcome

Request: review `src/app/modules/Vouchers/PurchaseRequests`, implement according to the project documents, and defer Create PO. The existing parent screen is now a typed paged list plus one routed Create/Edit/View editor. Backend remains pattern 2: header, child lines and document paths; no journal or financial posting. Phase 00 discovery, 01 frozen handoff, 02 read/grid, 03 editor/write, 04 delete/removal, 05 wiring and 06 source reconciliation applied. Approval transitions, PO conversion, database/runtime acceptance and accounting work were not implemented. No separate maintenance plan was necessary for these bounded confirmed repairs.

Decision history and pre-edit reference evidence: `PURCHASE_REQUESTS_CONTRACT_FREEZE.md`, including dated reconciliation amendments. References are Workshop Job list/editor, RentalQuotation's single-collection routed editor variant, PurchaseOrder FK/delete and IndividualPartner tracked reconciliation. Reference modules remain unchanged.

Initial frontend working tree contained unrelated angular/package changes, AppModule, toolbar saas, Settings/fines, Provision editor, user/role pages, SASS vendors and typings. Backend was clean. Those edits were preserved. The `.agents` instruction layer and reviews remain outside the application repositories.

## Screenshot evidence

All five supplied Desktop/PurchaseRequst images are English/LTR desktop captures. Role, capture date/version and current acceptance status are Unknown. Dates visible inside controls are business values, not capture metadata. Their appearance is not copied; canonical shared components own design.

### E1 — 1.PNG, list, 1700×593

| Evidence | Class | Implemented behavior | Phase / source |
|---|---|---|---|
| Request No, Supplier Quotation No, Date Range, Vehicle, Supplier, Chassis No | Explicit | Typed server filters; current-month default, dual-month range; source extras under More Filters | 02, list/filter hooks |
| No, Date, Supplier, Supplier Code, Total Amount, Discount, Net Amount | Explicit | Real No/code, live aggregate totals, before-tax net | 01/02, lean ListVM |
| View/Edit/Print/Delete/Create | Explicit | Routes, persisted print, shared delete confirmation | 03/04/05 |
| Excel and paginator | Explicit | Applied-filter full export; server counts/page requests | 02 |
| Open status | Explicit label, Missing state source | No fake IsActive/deleted interpretation; clear unavailable explanation | 01 reviewer decision |
| Create PO | Explicit | Deferred by owner's current instruction | Excluded |
| Eye beside document number opens approval history | Strong inference from E1/E5 | Clearly labelled read-only Approval Details action; no inferred approval mutation | 02 |

### E2 — 2.PNG, General Create, 829×642

| Evidence | Class | Implemented behavior | Phase |
|---|---|---|---|
| Three request types; date/quotation/supplier/currency/branch/notes | Explicit | Numeric enum and typed date; settings currency; optional branch retained across types | 01/03 |
| Description/optional vehicle/UOM/quantity/price/amount/tax/gross/job | Explicit | Typed lines, existing optional selectors, required persisted UOM, server calculations | 01/03 |
| Add/Remove/Import Rows/Documents/Discount | Explicit | EditableRows, confirmed removal, local CSV full-row preview/append/manual Save; tracked documents | 03/04 |
| Cancel/Save/Save and Print | Explicit | Guarded discard; one save; cleanup then saved View reload/print | 03/05 |
| NaN on an empty row | Explicit defect evidence | Numeric preview starts at zero, no client-calculated write properties | 03 |

### E3 — 3.PNG, Stock Create, 829×542

| Evidence | Class | Implemented behavior | Phase |
|---|---|---|---|
| Stock type, item/UOM/description/quantity/price/amount/tax/gross | Explicit | Stock selector uses existing Item select; same typed child shape and calculations | 01/03 |
| Branch absent | Uncertain removal intent | Retain source branch and job controls; screenshot absence never authorizes removal | 03 |
| Import/Documents/Discount/Save and Print | Explicit | Same aggregate workflow as General, no parallel editor | 03 |

### E4 — 4.PNG, Asset Create, 827×519

| Evidence | Class | Implemented behavior | Phase |
|---|---|---|---|
| Asset type, description, quantity, price and derived amounts | Explicit | AssetType select and existing child fields | 01/03 |
| No visible UOM/discount/branch/job | Uncertain removal intent | Retain source controls; UOM is required by existing nonnullable entity FK | 01/03 |
| Switching type clears unrelated fields | Uncertain | Not implemented; entered hidden selectors remain preserved, guide explains this | 03 |

### E5 — 5.PNG, Approval Details, 826×278

| Evidence | Class | Implemented behavior | Phase |
|---|---|---|---|
| Request number/amount/supplier and history headings | Explicit | Shared read-only dialog; record context and exact history columns | 02 |
| Empty history | Explicit captured state | Empty shared table, with explanation that no PR approval-history API/entity exists | 01/02 |
| Approval levels, users, reasons or transitions | Missing source | No fabricated history or approval workflow; actual approvals remain unavailable | Excluded unsupported behavior |

## Final contract comparison

| Grid (Actions first) | Frontend field | Backend ListVM | Filter/sort/export |
|---|---|---|---|
| ID | id | Id | integer / yes / yes |
| Purchase Request No | no | No | contains / yes / yes |
| Type | purchaseRequestType | PurchaseRequestType | numeric 0/1/2 / yes / translated |
| Date | date | Date | inclusive dateFrom/dateTo / yes / shared date |
| Vehicles | vehicles | Vehicles | vehicleId/chassisNo on live details / no / yes |
| Supplier Quotation No | supplierQuotationNo | SupplierQuotationNo | contains / yes / yes |
| Supplier | supplierName | SupplierName | supplierId / yes / yes |
| Supplier Code | supplierCode | SupplierCode | Supplier.No contains / yes / yes |
| Total Amount | totalAmount | TotalAmount | live amount sum exact / yes / money |
| Discount | discount | Discount | exact decimal / yes / money |
| Net Amount Before Tax | netAmount | NetAmount | no separate input / yes / money |
| Amount Plus Tax | amountPlusTax | AmountPlusTax | lineAmountPlusTax matches a live line / yes / money |
| Action-only state | canEdit | CanEdit | existing ItemRequisition link lock |

ListVM has exactly those twelve displayed properties plus CanEdit. Removed unused tenant/audit/delete/active inherited values, supplier/branch IDs used only for lookup/editor, branch name, notes, document paths and child collections from list transport. Detail keeps editor-required names/IDs/document paths and authoritative derived line amounts; lean identity bases replace inherited audit payload. The requisition-owned saved reader still consumes compatible fields from GetByWithNavigationsId.

All feature filter properties serialize as `Filters[key]`: search, id, no, purchaseRequestType, dateFrom/dateTo, vehicleId, chassisNo, supplierQuotationNo, supplierId, supplierCode, branchId, totalAmount, discount, lineAmountPlusTax. Shared serializer omits null/empty but preserves zero (General enum and zero money). Sort uses Filters[sortField]/Filters[sortOrder]; vehicles is explicitly unsortable. Generic ListQuery handles real entity-property keys; feature hooks handle ranges, live child predicates, supplier code and calculated sum.

GET PurchaseRequest returns Results with entities/totalCount/totalPages/pageNo/pageSize using the inherited count/page pipeline and stable Id tie. List queries switchMap; export fetches every applied page and aborts on failure. Raw draft filter edits do not affect paging/export/editor return until Search. Date clear means all dates; Reset restores current month/page 1.

Add/Update send only client inputs and the complete document/line snapshot. Add has no identity; Update carries root/retained-child Id, zero for new lines. No subscription, No, audit, deletion, approval or derived total fields are sent. Quantity is required integer >=0, price required decimal >=0, supplier positive required, branch optional positive, UOM positive required for every type, quotation max100, notes max1000, discount absolute nonnegative. IDs are checked with AllExistAsync, owned children with OwnsAll before tracked reconciliation, dropped children with InUseAsync. No duplicate business key is invented; document numbering remains server-owned.

Backend rounds price/discount to configured compatible currency precision, recalculates line amounts and allocates settings VAT once per rate across the document. PR follows its existing requisition writer: optional tax zero, otherwise settings rate. TotalAmount=sum live amounts, NetAmount=TotalAmount−Discount, list AmountPlusTax=sum live gross before discount; editor also shows net+tax after discount. No new discount allocation, accounting effect or stored status. Existing historical values are not rewritten.

## Action/override audit

| Action | Vertical slice/state and refresh |
|---|---|
| Create/Edit/Save | POST/PUT PurchaseRequest → typed service → editor; require ready inputs; freeze submitted form; business/HTTP errors retain draft; exactly one interceptor success owner; success cleanup then list return |
| View | GET GetByWithNavigationsId; form disabled, saved labels/amounts, no edit-only lookup requests |
| Print / Save and Print | Complete persisted details; currency read settles first; shared print session, flow DataTable, no pager; save prints only after committed cleanup and reload |
| Delete | Live existing row → soft-deleted header/children; DELETE PurchaseRequest?id; confirmDelete; existing dependency checks and ItemRequisition writer lock; success refreshes applied page and falls back one page when its last row was removed |
| Remove child/document | EditableRows same-identity confirmation, busy recheck and form freeze; missing saved rows reconciled on Save; file cleanup deferred until persistence |
| Dirty exit | All editor routes call same deferred CanDeactivate; confirmDiscard + freezeFormState; Cancel restores state; pending uploads/decisions/cleanup block exit; failed cleanup retries cleanup only |
| Approval details | Read-only local context plus empty history; no action API or transition |
| PO toggle approval / toggle bill (reference actions) | Not Applicable: PurchaseRequest lacks PO approval/billing state; no inferred API |
| Create PO | Deferred explicitly |
| Legacy Search | Existing POST search compatibility retained; screen uses ordinary GET list |

Overrides: SearchColumns for multi-field keyboard search; ApplyListFilters for date/child/code/aggregate keys; ApplyListOrder for supplier/calculated fields; MaterializeListAsync for lean projected labels/totals; DetailAsync preserves existing complete plain endpoint; AddAsync/AddListAsync validate and price all inputs; UpdateAsync retains ItemRequisition shared lock; UpdateCoreAsync owns tracked reconciliation; UpdateListAsync validates every snapshot before one save; RemoveAsync owns dependent-child deletion under existing lock. Controller's redundant GET override was removed. Inherited deep detail/select/all-other ordinary operations remain. Scoped maps are one-way; Update ignores only the manually reconciled child collection. No ReverseMap remains.

Each ordinary aggregate path reaches one SaveChanges; use EF implicit atomic save. Existing shared ItemRequisition concurrency guard remains because independent writers must serialize their check/save operations; no new explicit transaction was introduced just for graph persistence. UI visibility is not authorization: app AuthGuard remains, no permission API. Authorization candidate is destructive DELETE PurchaseRequest?id; existing server tenant/ownership/dependency boundaries remain.

## Final conformance and shared extraction

| Concern | Actual consumer/producer comparison | Source result |
|---|---|---|
| Layout | PurchaseRequestsComponent and PurchaseRequestDetailsComponent use canonical route/list/editor chains; RentalQuotation header40% bounds retained through local workspace-only CSS | Source conformant; visual pending |
| Filters/table | stableLayout, main5/advanced fields, shared reset, 34px owner; lazy=true and authoritative count; current month/range validation | Source conformant |
| Editor rows | FormSection heading Add; typed parent arrays; shared table sticky/fill; fixed slim/row/min140/max80 SummaryCards and fixed footer | Source conformant |
| Output | Editor printing branch supplies persisted array to DataTable lazy=false/paginator=false/scrollable=false; shell/regions sigma-print-flow, ReportPrintService owns lifecycle | Source conformant; paper fit pending |
| Uploads | Component-scoped tracker; FileField and FileLink; original path comparison, finishSave/discard with failed-path Retry; accepted close bypasses pending finalize flags | Source conformant; storage/orphan expiry pending |
| Feedback | FieldError/StateMessage and skip-error requests for inline ownership; existing financial-policy read retains global failure owner; one mutation success interceptor | Source conformant |
| Shared arithmetic | Existing allocateDocumentTax had missing backend positive-remainder safeguard; fixed in shared owner, memoized editor preview uses it | UI19 and skill synchronized; no feature formula fork |

Reused existing controls, date/enum/route-state/scalar/financial helpers, EditableRows, tracker, confirmation and print. No repeated presentation qualified for a new parallel component. The shared numerical parity defect was repaired in its existing helper; ordinary/signed/zero-net behavior and document totals remain. Backend fixture arithmetic: many equal tiny positive lines no longer produce a negative preview remainder. This was inspected mathematically/source-only, not executed as a test.

Packet maintenance: initial -Check passed; after UI19 update, regenerated plan-00 and phase-00–06 through the generator and -Check passed again. Semantic review: UI19 dependency/provenance updated, phase roles/references, derived-only payload and once-rounded VAT rules unchanged. No generated file edited directly.

## Guide and responsive handoff

Guide content: `SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/purchase-requests-topic.ts`; registered by `record-list-topics.ts` into existing INVOICE_GUIDE. Route `/UserGuide/invoice`, existing sidebar `invoice.guideTitle`. Stable parent titleKey retained; duplicate child topic replaced by parent alias guidance. EN/AR purpose/steps/actions/validation/calculation/cleanup/PO limitations match source.

| Sizes to verify | Expected source arrangement | Owner visual status |
|---|---|---|
| Desktop including supplied 1700px | Title/filter/grid align via shared shell; bounded header/details; internal row scroll, fixed pager/totals/footer | pending |
| 1200 boundary / 1199, 1024/1023 and intermediate widths | Shared filter disclosure; editor 4→2 field grid; dropdowns fill allocated fields | pending |
| Supplied 829/827/826px and 768/767, 760/759 | Shared dialog width bounds, wrapping section actions; long tables scroll horizontally internally | pending |
| 700/699 and 650/649 down to narrow mobile | Single editor field column; title actions wrap; no page scroll, header pane and row pane retain own scroll | pending |
| Short heights / EN+AR / RTL+LTR / light+dark / print | All controls/errors/long labels remain usable through existing shared owners; full persisted print data | pending |

## Files changed and verification

Frontend feature files: parent list TS/HTML/SCSS, editor TS/HTML/SCSS, create/details/list/grid-row models, feature routes, typed service; child routes now alias parent. Child scaffold files remain untouched and unreachable through that route; no independent child API is invented. Related files: EN/AR vocabularies, financial-number.util.ts, new guide topic and registration.

Backend: PurchaseRequestService, PurchaseRequestController, PurchaseRequestProfiler/PurchaseRequestDetailProfiler; PurchaseRequest Add/Update/Detail/List VMs; child Add/Update/List VMs; GeneralMessage.resx and GeneralMessage.ar-SA.resx (eight matching localized keys). No entity/EF/migration/snapshot changes. Documentation: UI19, skill digest/history, generator-managed affected packets and these two review records.

Source checks: scoped frontend/backend diffs reviewed separately; public component/helper exports and standalone registration inspected; direct consumers traced (LayoutModule provider and ItemRequisition saved reader compatible); no stale tenant/derived writes, ReverseMap, merge markers or whitespace errors in changed source. Final translation check reports zero missing/case-only differences. An additional vocabulary AST walk verifies all **100** purchaseRequest leaf keys in each language, zero duplicates, and all used leaf keys present (purchaseRequest.types is the expected enum namespace, not a missing leaf). TS/Angular source syntax parsing reported zero diagnostics across 15 files; this is not compilation or template type-checking.

Final integration checks also confirm the preserved amountPlusTax column and lineAmountPlusTax filter across DTO/query/route/guide, negative/duplicate child IDs rejected by OwnsAll, and no changes to the initially dirty unrelated application files. Generated-packet Git diffs include UI0/UI1/UI5 provenance differences that already existed in the initial successful recipe check; this task preserves them and authors only UI19's new rule/provenance. In the documentation repository, the inspected scoped packet diffs are provenance hashes only, with references and workflow text unchanged; UI19's semantic addition is the exceptional allocation parity rule.

Builds, tests, lint, browser/application, database, migrations, commits, pushes and deployments were not run. No Graphify, Sigma MCP, full-solution scan or reference edits. Actual compilation, EF translation, mapping, persisted save/reconcile/delete, concurrency and visual/print behavior remain owner verification. Browser/tab termination still needs server-side abandoned-file expiration; this task adds no background sweeper.

Migration: **not required**; VM validation/nullability changes are transport-only, and entity/configuration storage remains unchanged. No Add-Migration command is necessary.

Owner acceptance: create General/Stock/Asset with valid UOM/supplier and mixed optional references; change types and confirm values retained; edit with added/retained/removed lines/documents; reject foreign/duplicate child IDs and missing FKs; test optional branch; ensure linked requisition requests stay read-only; test zero/large values and tiny VAT allocations; exercise both failure channels and cleanup Retry; dirty/pristine/View exits; filtered server paging, enum zero, Excel over >100 rows, last-row delete; complete saved Print/Save-and-Print with delayed currency; CSV invalid replacement and full preview; EN/AR, RTL/theme and all matrix boundaries. Confirm one success toast and auth header presence without recording secrets.

Suggested commits (suggestions only; stage scoped files, preserve unrelated work):

- Frontend: `refactor(purchase-requests): align list and editor with shared patterns`
- Backend: `fix(purchase-requests): reconcile lines and validate server calculations`
- Documentation: `docs(purchase-requests): record contracts and VAT preview parity`

Agents: root owned discovery/freeze/editor/translations/integration/review. Two inherited-model workers owned backend and list/routes/guide in nonoverlapping files after contract freeze, reducing wall-clock time; list worker then audited editor TS, backend worker audited editor contracts/cleanup/output and found two issues corrected by root. Root reviewed the integration. No model override was requested or used.

## Owner follow-up — approval workflow deferred (2026-10-15)

The owner explicitly deferred purchase-request approval implementation until the legacy Settings work is complete and its actual workflow is clearer. This supersedes the follow-up request to complete the approval chain; it does not change the previously implemented purchase-request contracts.

Source discovery found `/Settings/approvalLevel` as an approval-definition screen, with free-text users and no explicit sequence or PurchaseRequest voucher type. No executing purchase-request approval chain or approval inbox was established. Performing decisions from the purchase-request list/view was a proposal only; the final approval screen, approver identity/rights, ordering, state transitions and history contract remain undecided until Settings is reviewed. The approver question is deferred, not an accepted choice.

No approval workflow, permission, schema, Settings or application-source changes were made for this follow-up. Existing Approval Details remains contextual read-only information with no real decision history. Create PO remains deferred under the original owner instruction. Resume approval discovery and contract freeze after the owner supplies the completed Settings context; do not infer the legacy workflow or automatically resume implementation.

## Basic Information visibility repair — 2026-10-15

Owner reports Basic Information is empty. Its fields exist unconditionally in the template; source inspection finds an incomplete bounded-flex chain: the header's ordinary block wrapper does not size its fill FormSection, whose zero-basis scroll region can collapse. The sibling lines FormSection also lacks an explicit remaining-height allocation. Repair only the presentation chain; preserve the frozen 40% header allocation and all controls, data and actions.

| Concern | Owning block | Actual reference/shared owner | Repair contract before edits |
|---|---|---|---|
| Header pane sizing | UI1/13 | Workshop/Job editor; styles.scss `.sigma-editor-pane > app-form-section`, FormSection fill/content, `.sigma-editor-scroll` | Add shared pane class to existing header wrapper: bounded column, child flex1, existing inner scroll retained |
| Remaining lines space | UI1/13/14 | FormSection fill/content; existing `.purchase-request-lines` workspace allocation | Apply existing remaining-space class to lines FormSection host as well as its inner table area |
| Responsive/print/help | UI1/13, Master5/7 | Shared editor grid breakpoints, sigma-print-flow, existing Purchase Requests guide | Preserve four/two/one field columns, fixed totals/footer and released print bounds; explain Basic Information internal scrolling in EN/AR |

Recipe -Check passed for all eight packets before PHASE-03 use. No new business/API contract, backend or schema changes; approval and Create PO deferrals remain. No subagents: this is a small sequential presentation repair.

Final source reconciliation: header wrapper now uses `sigma-editor-pane`, making its child FormSection `flex: 1 1 0` through the existing global owner; the lines FormSection host now uses existing `purchase-request-lines` (`flex: 1 1 auto`, min-height0, hidden outer overflow). Both section content regions therefore receive allocated height instead of depending on the intrinsic height of a zero-basis scroll child. Existing 40% header basis, four/two/one-column responsive fields, internal scroll owners, print release, controls and fixed totals/footer remain. No shared styles or canonical rules changed: this repairs missing consumer adoption of existing rules.

Reviewed the complete scoped HTML diff and complete bilingual guide source; Angular template and guide TypeScript syntax parsing each returned zero diagnostics, and scoped git diff --check found no whitespace errors. These are source checks only, not compilation or runtime evidence. Owner verification pending: Create/Edit/View at desktop, intermediate widths, below1024/below700 and short heights; header fields and Documents reachable by internal scrolling; lines, fixed totals/footer, RTL/themes and complete print flow. No build/test/lint/browser/database/migration/commit/push/deployment executed. PHASE-03 presentation and guide repair plus scoped reconciliation only; backend/domain-action work skipped because unchanged. No migration needed. Suggested frontend commit: `fix(purchase-requests): preserve basic information pane height`.

## Details vertical scroll and general implementation rule — 2026-10-15

Owner explicitly reports no vertical scrollbar when rows increase and requests the general rule in documentation for similar screens. Source evidence: the inner `purchase-request-lines` wrapper has flex sizing but is an ordinary block, so the fillHeight table host is not a flex item. Its frame grows with rows and the outer hidden overflow clips them. Frozen repair: add existing `sigma-editor-pane` to that wrapper; reuse its bounded column rather than inventing height arithmetic or another scroll owner. Shared table frame already supplies overflow-y:auto and stickyHeader; keep both fillHeight/stickyHeader enabled. No shared behavior or business contract change is needed.

Conformance: UI1 `.sigma-editor-pane` and UI13/14 FormSection fill → content flex → bounded pane → EditableCollectionTable fill host/root → frame are the actual owners. Header/Add remain above the frame; totals/Save remain outside it. UI14 will own an explicit complete-chain implementation/verification rule, UI13 will cross-reference it and show the shared pane in its example; the skill digest/history and bilingual in-app help will match. Similar screens must adopt this chain during implementation/review; this task does not claim a bulk migration of existing screens. PHASE-03 and scoped reconciliation apply. Subagents are unnecessary for this single presentation dependency.

Owner then reports Basic Information disappears as well. This supersedes the previous claim that wrapper adoption alone completes allocation. Source-supported amendment: preserve the header's existing40% allocation with `flex:0 0 40%`; remaining details host and inner wrapper use `flex:1 1 0` rather than an auto row-content basis that can compete for the header's height. Keep min-height0 and the shared pane column. This changes only workspace allocation, not field visibility/data, ratios, domain actions or shared defaults. UI14/digest record the general non-shrinking-header/zero-basis-details rule; each screen still chooses its own header allocation.

Final source reconciliation: the details wrapper now has `sigma-editor-pane`; header and details sizing matches the amendment above, with shared frame overflow-x/y:auto and stickyHeader retained. Both field and row regions remain separately bounded, and print releases their bounds through the existing print-flow lifecycle and saved DataTable branch. Complete scoped HTML/SCSS, bilingual purchase-request/shared guidance and UI13/UI14 diffs were reviewed; application template and both guide TS syntax parses returned zero diagnostics, and scoped whitespace checks passed. No shared component source was modified and no blanket consumer migration is claimed.

Canonical UI13's example and allocation text, UI14's full chain/acceptance rule, and the skill digest plus revision row are synchronized. Regenerated all eight packets only through the generator; final -Check passed all eight. Semantic generated diff review confirms provenance-only changes, unchanged recipe ownership/references, with new UI13/UI14 provenance on consuming packets. Existing UI0/UI1/UI5 and previous UI19 provenance changes predate this follow-up and were preserved.

Owner runtime/visual verification remains pending: add enough unsaved rows to exceed height, reach the last row vertically and last column horizontally, keep Basic Information visible with its own field/document scroll, preserve sticky headings/Add/totals/footer, and verify short heights/intermediate widths/RTL/themes/Create/Edit/View/print. The source-only boundary forbids builds/tests/lint/browser/database/migrations/commits/pushes/deployment; none ran. No migration is required. Suggested commits: frontend `fix(purchase-requests): bound details scrolling and preserve header space`; documentation `docs(ui): require complete bounded details scroll chains`. Guide route remains `/UserGuide/invoice` and existing module overviews consume shared guidance. Deferred approvals and Create PO remain unchanged.

## Owner amendment — three editor tabs (2026-10-15)

Owner supersedes the stacked40% header/details layout with tabs and explicitly requests Documents separately. Frozen presentation contract: Basic Information / Purchase Request Details / Documents, initially Basic Information, using existing EditorTabsComponent workspace appearance with typed keys and matching tab/panel IDs. One parent form, payload, dirty gate and all values remain across switching. Each active panel fills the available body; remove the40% allocation. Keep inner field/documents scroll or shared fill/sticky details frame and fixed totals/footer. Disable switching during busy/import/cleanup gates. Invalid Save selects the first owning invalid section before focus; empty lines selects Details. Print mounts all sections independent of the active tab, hides the tab strip, and retains complete saved rows. No backend/schema/action changes.

Conformance before edits: UI13 Shared accessible tabs → actual EditorTabs declarations (typed EditorTab, activeTabChange, workspace, disabled, idPrefix/ARIA); UI1/14 → existing bounded pane and table owners; RentalBooking demonstrates guarded tab changes/invalid section selection but is not copied for business rules. Update owning UI13 and skill digest/history with the reusable full-height-tab variant, retaining the UI14 scroll-chain rule for both stacked and tabbed layouts. No bulk migration of unrelated screens.

Implemented — source-only: details TS imports/registers actual shared EditorTabs, typed tabs/activeTab and guarded setActiveTab; HTML supplies workspace strip and three matching ARIA panels. Basic and Documents each use shared bounded pane/FormSection/inner scroll; Details retains bounded fill/sticky row frame. Documents moved wholly out of Basic, with one section-header Add action. Conditional views reuse the same parent FormArray/FormControl objects; tracker remains component-scoped and busy upload/cleanup guards prevent active FileField destruction. No file cleanup is triggered by switching. CSS removes40% sizing and fills the active panel, retaining print release. Invalid Save selects Basic before Details before Documents, then renders/focuses within that panel; stale/disconnected/busy callbacks return. PrintSession's printing signal mounts all three sections before its existing animation-frame print callback, Details renders the complete saved DataTable, and tab strip is no-print. After print, the prior tab remains selected.

Verification: reviewed changed source and actual shared tab inputs/outputs, FileField teardown/tracker and ReportPrintSession lifecycle; template parser and TS syntax parsers for editor plus both guide files returned zero diagnostics. Scoped diff whitespace checks passed. UI13/UI14, skill digest/history, Purchase Requests bilingual guide and existing shared guidance agree with the final variant. All packets regenerated through generator; final drift check passed all eight. Regenerated diffs remain source-provenance changes with recipe roles/references unchanged. Prior unrelated source/document changes remain preserved. No new translation keys, DTO/API/backend/calculation/migration changes. No subagents (small sequential UI change).

Owner verification pending: Basic/Details/Documents in Create/Edit/View; draft retention; keyboard arrows/Home/End and RTL; missing supplier/date or invalid row in an inactive tab; many rows with vertical/horizontal scroll; upload/cleanup/confirmation switch guards; Print/Save-and-Print from each tab includes all sections and restores active tab; narrow/intermediate/short-height/light/dark layouts. Guide remains `/UserGuide/invoice` with module overview shared guidance. Builds/tests/lint/browser/database/migration/commit/push/deployment were not run. Suggested frontend commit `refactor(purchase-requests): separate basic details and documents tabs`; docs `docs(ui): document full-height record tabs and complete print`. Approval workflow and Create PO stay deferred.

## Screenshot-backed request type choices — 2026-10-15

Owner requests check choices and clarifies using the supplied screenshots. They visibly show one selected circular choice, not multiple types. Frozen presentation amendment: use installed PrimeNG RadioButtonModule/reactive numeric enum values (General0/Stock1/Asset2), with existing enumOptions/translation keys and associated labels. Move this single group above the tab strip so type can change while reviewing Details. Retain busy/import/cleanup/read-only gates. General shows optional Vehicle and Branch; Stock shows Item; Asset shows Asset Type. Existing dynamic detail columns already implement these line choices; make Branch General-only. Hidden reference values remain retained. Required persisted UOM and existing Job remain for compatibility under the earlier frozen contract, despite omitted screenshot controls; no schema/validation/payload change.

Conformance before edits: UI16 enumOptions keeps real numeric identity; installed radiobutton declarations expose value/inputId/name and reactive CVA; UI1 field geometry plus existing flex/wrap utilities supply group layout. Use a labelled radiogroup and clickable associated labels, not independent booleans or invented multiple-type business semantics. UI13 tab composition and UI14 dynamic columns remain. Scope is presentation only; source parsing and diff checks apply, no runtime/build/test execution.

Owner then explicitly requests required fields to change with each choice. Frozen validation amendment is recorded in PURCHASE_REQUESTS_CONTRACT_FREEZE.md: General requires non-whitespace Description, Stock requires Item, Asset requires Asset Type on every line. This supersedes the preceding presentation-only/optional-field wording. Date/Supplier/UOM/Quantity/Price retain existing required contracts; Vehicle and General Branch stay optional, Job remains optional. Conditional requiredness is a reviewer decision under the standing missing-detail rule, using the minimal type-defining screenshot input, not a claim that screenshots prove mandatory markers. No accounting, permissions, historical rewrite or entity/schema change.

Implementation: shared PrimeNG RadioButtonModule registered in standalone editor, reactive numeric radios above tabs, associated labels and radiogroup; General-only Branch and pre-existing General Vehicle/Stock Item/Asset Type columns. Per-line type-aware validators read the parent enum and revalidate retained rows on type valueChanges without clearing data; new/hydrated/imported rows use the same factory. Column required markers and description FieldError match current type. CSV preview rejects missing General Description, Stock Item or Asset Type as applicable before appending. Backend InvalidTypeFields validates typed tuples before mapping/mutation in both shared Add/Update preparation paths, covering ordinary/batch saves; existing annotation/FK/owned-row/linked locks/calculations remain unchanged. Three matching EN/AR backend resources describe type-specific missing inputs; guide explains all type rules.

Owner also requests better type-group formatting. Presentation refinement reuses existing compact FormSection heading/icon/surface and shared sigma-editor-grid with three columns (two below1024, one below700), plus existing spacing/font utilities. Equal-width choices have clickable labels and one labelled radiogroup, fixed above tabs with busy/read-only gates. No bespoke CSS/component or shared-default change is needed. Guide updated to match the section and responsive choice layout. UI1/13/16 and actual FormSection/RadioButton inputs are the conformance owners; no new reusable rule requires book/skill changes.

Final source reconciliation: reviewed changed editor/guide source and both backend preparation branches plus tuple validator/resource keys against the frozen amendment. Template and editor/guide TS parsing returned zero diagnostics; scoped frontend/backend whitespace checks passed. Both resx files parsed as XML and each has the three matching new resource keys. Existing service FK validation still checks every supplied hidden reference; requiredness does not clear or bypass those references. Type changes revalidate existing rows, and line factory/CSV checks use current type. UOM remains required for Asset because the persisted FK is nonnullable. No AutoMapper, calculated-value, DTO, entity/EF or migration change. No migration required. The original display/ListVM/API contracts remain unchanged.

Applied PHASE-03 presentation/validation and narrow PHASE-01 backend input amendment plus source reconciliation; no new domain action. In-app guide is the existing Purchase Requests topic at `/UserGuide/invoice`. Initial recipe drift check passed all eight; no canonical book/packet changes were needed in this follow-up. No subagents: small sequential scoped changes with low coordination benefit. Prohibited build/test/lint/browser/database/migration/commit/push/deployment commands were not run. Owner acceptance pending: switch all three radios with labels/keyboard on desktop/below1024/below700, EN/AR/RTL/themes, keep values across types/tabs, require General description (including whitespace rejection), Stock item and Asset type immediately, verify CSV and manual/batch server saves reject the same omissions, retain optional Vehicle/Branch and linked edit locks, View/Print and fixed totals/footer. Historical incomplete manual edits may need the newly required type-specific fields before Save; no historical rows were rewritten. Suggested commits: frontend `feat(purchase-requests): add type choices and conditional required fields`; backend `fix(purchase-requests): validate required fields by request type`. Approval/PO deferrals remain.

## Equal card edges — owner reiteration, 2026-10-15

Owner explicitly reiterates UI3's existing equal-card-width rule. Source finding: title has its default8px inset, type FormSection has mx-2 despite its host width100%, tabs/summary span the form, and editor body adds another8px inline padding. Frozen correction: select existing sigma-editor-panel--workspace; remove type-group local margin; extend that shared workspace owner to remove editor-body inline padding as it already removes title/filter margins. This aligns title/type/tabs/active Basic-Details-Documents/summary/footer frame edges at the same available width. Summary tiles already use shared equal row tracks; no change to their individual sizing or any values. Nested intentional table frames retain section padding.

Conformance before edits: UI3 equal-width rule and actual src/styles.scss workspace title/filter selectors; OpeningBalances actual shared workspace consumer; UI1 body8px default is retained for ordinary editors. New shared workspace body rule applies to current workspace consumers as the owner's general presentation instruction requires, preserving vertical padding/flex/scroll/print. Source inventory finds matching body users in LimousineInvoice, StaffDutySchedule and StaffOverTime (the latter already px-0); no unreviewed feature files are edited. Update UI3 and skill digest/history together, regenerate packets and update in-app guidance. No backend/business/API change or migration. Root handles this small sequential shared rule; no subagents.

Final source reconciliation: editor selects workspace modifier, type section has no inline margin, direct title uses existing workspace margin0, and shared editor body now has inline padding0. Tabs, outer FormSections, complete summary region and footer border stretch to the same parent content width; section-internal padding remains intentional. Shared SummaryCards row sizing already supplies equal tiles and stays unchanged. Reviewed the complete scoped styles diff (one shared selector), changed template and guide source against UI3; Angular template and shared-guide TS syntax parsing returned zero diagnostics; scoped whitespace checks passed. No runtime visual claim is made.

UI3, skill §2.4/revision row and existing shared bilingual guidance are synchronized. Regenerated all eight packets using generator, final -Check passed all eight. Generated semantic diff inspection found only source-provenance lines, with recipe roles/references unchanged; preserved preceding UI0/UI1/UI5/UI13/UI14/UI19 changes. Applied narrow PHASE-03/shared presentation repair and source reconciliation; no backend or domain-action work. Guide remains the existing invoice module overview/reader (`/UserGuide/invoice`). No migration needed. Owner acceptance pending: both logical card edges in all three tabs/Create/Edit/View at desktop,1024/700 boundaries and intermediate/short sizes, EN/AR/RTL/themes; retained row scroll, summary and footer/print, plus inherited workspace-body alignment in existing consumers. No builds/tests/lint/browser/database/migrations/commits/pushes/deployment ran. Suggested frontend commit `fix(ui): align workspace editor card edges`; documentation `docs(ui): clarify shared tabbed editor card alignment`. Existing unrelated changes and deferred approvals/PO preserved.

## Discount first-row placement — 2026-10-15

Owner requests Discount in the first row with the other inputs. Move the existing unchanged Discount field immediately after Supplier, before conditional Branch/Currency. UI1's actual sigma-editor-grid supplies four equal columns on wide screens, two at1024 and one at700; no local layout/style or control/payload/calculation change. This is PHASE-03 placement only. Existing field validation, read-only money display, IDs, print and number-focus behavior remain. Bilingual Purchase Requests guide notes the wide first-row order Date/Quotation/Supplier/Discount and responsive wrapping. Recipe -Check passed all eight before use. No backend/schema/migration/shared rule changes; no subagents for this small sequential reorder.

Reconciled field source order/unchanged block; Angular template and guide TS syntax parsing returned zero diagnostics, scoped whitespace check passed. Owner wide/narrow/Create/Edit/View/RTL/print visual acceptance remains pending. No builds/tests/lint/browser/database/migrations/commits/pushes/deployment ran. Suggested frontend commit: `fix(purchase-requests): place discount in first header row`. Guide remains `/UserGuide/invoice`; approval/PO deferrals preserved.

## One header row except Notes — 2026-10-15

Owner supersedes the four-column first-row placement with all Basic Information boxes in one row except Notes. UI1 actual sigma-editor-grid/public --sigma-editor-columns supplies6 equal tracks for General (Date, Quotation, Supplier, Discount, Branch, Currency) and5 for Stock/Asset (Branch absent). Existing Notes sigma-field--full spans a separate full-width row. Preserve shared two-column layout at1024 and one at700, field heights, whole-card alignment, scroll, all validators/control identities, print and payloads; no local CSS or shared rule changes. Bilingual guide notes the new ordering/wrapping. PHASE-03 placement only; initial packet check passed all eight. No backend/schema/migration changes; no subagents for this one-line adjustment.

Source reconciliation confirms the6/5 binding is on Basic Information only (type radio group remains3), all field order/visibility and Notes full span are preserved. Template/guide syntax parsers reported zero diagnostics; scoped whitespace check passed. Owner desktop/narrow/RTL/themes/Create/Edit/View/print visual verification remains pending. No prohibited commands ran. Guide remains `/UserGuide/invoice`. Suggested frontend commit `fix(purchase-requests): align basic fields in one header row`; approval/PO deferrals preserved.

## Type choices beside section title — 2026-10-15

Owner requests type choices on the title row to save height. Frozen presentation: project the existing labelled radiogroup through FormSection's existing form-section-actions slot, using existing wrapping/spacing utilities. No second content row. Shared FormSection naturally removes heading bottom spacing/divider when its content region is empty via a shared :empty/:has rule, preserving normal content sections. This reusable header-only presentation applies to current matching consumers rather than a feature deep override or new input. UI13 owns projection/empty-content styling; actual FormSection template/SCSS supplies heading/actions owners, UI1/16 retain control/value behavior. Screen type/validation/actions, full-width cards, busy/read-only and print remain. Update owning UI13 and skill/revision together, guide and generated packets. No backend/API/schema change; no subagents for this small dependent presentation change.

Final source reconciliation: existing type radiogroup is in the actual form-section-actions projection; shared heading wraps and actions stay max-width100% at every width, superseding the old760px-only rules. Empty content hides through :empty and heading bottom spacing/divider resets through :has; populated sections keep their content/padding. Reviewed complete shared SCSS diff and changed template/guide against UI13; template/guide syntax parsing returned zero diagnostics, whitespace checks passed. All numeric reactive values, associated labels, requiredness, busy/View gates and print flow are retained. UI13 and skill digest/history plus bilingual guide synchronized; regenerated all eight packets through generator, final check passed all eight. Generated diffs are provenance-only, with prior changes preserved.

PHASE-03 shared presentation/source reconciliation only. No schema/migration required, no backend or domain changes. Owner visual/runtime acceptance pending: same row while space permits, long EN/AR labels and intermediate/narrow widths wrap without horizontal overflow, light/dark/RTL, controls/type validation and all-section print. Guide remains `/UserGuide/invoice`. No builds/tests/lint/browser/database/migrations/commits/pushes/deployment ran. Suggested frontend commit `fix(ui): compact heading-only form sections`; documentation `docs(ui): define compact heading choice projection`. Approval/PO deferrals preserved.

## Space below totals — 2026-10-15

Owner requests a small gap below the totals cards. Apply existing mb-2 spacing utility on the SummaryCards host before the fixed footer, consistent with UI24's host-placement boundary; no internal summary selectors/defaults or calculations changed. Existing guide's fixed totals/footer description still matches, with no workflow/help change needed for this spacing-only adjustment. PHASE-03 placement; packet check passed all eight, no business/API/schema/shared rule change or migration; no subagents for one attribute. Suggested frontend commit `style(purchase-requests): separate totals from footer`.

Reconciled host placement before footer; template parser returned zero diagnostics and scoped whitespace check passed. Owner visual acceptance remains pending for small/short layouts and print. No prohibited build/test/lint/browser/database/migration/commit/push/deployment commands ran; deferrals preserved.

## Approval preparation and partial purchase orders — 2026-10-18

Implemented the owner's continuation: Approval Cycle is now a tab and shared read-only context; real Create PO is available from the list and saved View while quantities remain. Multiple partial orders consume source line quantities and allocate the source discount automatically with a final rounding balance. Server validates tenant/source ownership and fresh capacity inside the existing source write lock, including update/bulk/delete paths. PR monetary basis is protected while live linked orders exist; allowed header/description/document changes remain. Deleted orders release quantities.

The current decision supersedes the historical PO deferral above. Full contract, impact, producer/consumer conformance, verification limits and owner acceptance matrix are in [PURCHASE_REQUEST_PO_EVOLUTION_2026-10-18.md](<PURCHASE_REQUEST_PO_EVOLUTION_2026-10-18.md>). Existing in-app guide and EN/AR content updated. Source-only checks pass; owner migration `AddPurchaseRequestPurchaseOrderLinks`, compilation and runtime/concurrency/visual acceptance remain pending. Approval settings/actors/enforcement remain deferred. No prohibited execution or Git write ran.

## Live manual approval continuation — 2026-10-18

Owner chose terminal Approve/Reject now, with request edit/delete lock and PO creation after approval only. Implemented state-backed list column/filter, real Approval Cycle buttons/history in list and saved View, backend enum-only command and atomic status/log save, pending-only direct/batch/compatibility activation writes, and PO draft/create approval gates. Approval preflight shares conversion boundaries so uncorrectable source errors are caught before the final decision. Partial orders and discount allocation remain intact. Roles/approval permissions/configurable cycle levels remain deferred; audit names the current sign-in account.

Current contract, exact conformance and owner verification matrix: [PURCHASE_REQUEST_MANUAL_APPROVAL_2026-10-18.md](<PURCHASE_REQUEST_MANUAL_APPROVAL_2026-10-18.md>). In-app EN/AR guide updated; source syntax/import/key/whitespace checks pass. Owner migration `AddPurchaseRequestManualApproval`, compilation and runtime/EF/concurrency/visual acceptance remain pending. Earlier sections record historical states and are superseded only by these explicit decisions. No prohibited command or Git write ran.
