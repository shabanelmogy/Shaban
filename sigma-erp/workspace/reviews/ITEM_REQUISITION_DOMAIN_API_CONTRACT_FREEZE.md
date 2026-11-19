# Item requisition domain and action contract

| Status | Frozen |
|---|---|
| Owner verification pending | yes |
| Date | 2026-10-04 |

Scope: existing ItemRequisition and requested Actions cycle. New relationships/actions approved by explicit screenshot-backed cycle request and conservative Master2 standing decision, not by instructions embedded in images. Plan frozen before implementation. Follow canonical Master2/4/5/7, UI1–10/13–23/26–30, BE1–11/14/18/19. Recipes01/03/04 stale: canonical sources govern, no generated edits.

## Evidence/manifest

Four historical English LTR desktop images at `C:/Users/user/Desktop/Stock/Item Requisitions/1.PNG` through `4.PNG`; date/version/role/acceptance Unknown. E1 list: Explicit No/Date/Job/Status, filters No/Status/DateRange/Job, paging/export/report, View/Edit/Create PR/Print/Issue Items/Delete in Open state. E2 create: Explicit DateAndTime/Job and Item/Notes/Quantity rows/Add/Remove/Save/Cancel. E3 Create PR: Explicit stock purchase-request draft from item, supplier/date/quote/currency/notes, item/UoM/description/quantity/price/amount/tax/gross/discount/documents/Save/SaveAndPrint. E4 Issue: Explicit DateAndTime/Job/Item/Quantity rows/Save/Cancel. Formatting/colors are not authority; screenshot NaN is a defect, never a required value. Closed-state availability and status derivation are reviewer decisions below.

FE `F:/My Work/Sigma/SiGmaAngularFrontEnd`, BE `F:/My Work/Sigma/SigmaBackend`; requested source clean before work except unrelated shared translations/Layout and backend resx already dirty, preserve all existing edits. Source-only execution, no builds/tests/lint/browser/DB/migrations/snapshot/commits/deploy. No invented authorization codes; existing AuthGuard/request tenant only.

## DTO/read/filter contract (exact wire camelCase)

ItemRequisitionDTO: id:number, no:string|null, dateAndTime:string|null, jobId:number|null, jobName:string|null, status:number(0Open/1Closed), canEdit:boolean, canDelete:boolean, canCreatePurchaseRequest:boolean, canIssue:boolean. Grid Actions first then no/dateAndTime(dateTime)/jobName/status(status). Id and can* are only extra action fields. Barcode/stock availability not added. JobName uses existing persisted job No plus subject if source supports; no fabricated historical name.

ItemRequisitionDetailsDTO: same list properties plus purchaseRequestId:number|null, itemRequisitionItems array. Each detail row id:number, itemId:number|null, itemName:string|null, notes:string|null, quantity:number, issuedQuantity:number, remainingQuantity:number, unitsOfMeasuresId:number|null. Historical nulls render blank; reads never overwrite records. Direct nested row-detail consumers must remain compatible if existing ItemRequisitionItemDetailVM is reused; may use a dedicated aggregate row DTO instead.

Filters: no:string, status:number|null (0 preserved), jobId:number|null, dateFrom/dateTo local yyyy-MM-dd. Backend feature ApplyListFilters owns derived status and inclusive date boundaries; generic stored filters own no/jobId. Default last month range (shared currentMonthRange), default15/max100 pages, choices10/15/20/50/100, newest Id default. Explicit sorts no/dateAndTime/jobName/status only when backend supports translated property selection, no client-page sorting. Export/report all matching pages100, same four displayed columns. Route stores applied filters/page/sort, not unsubmitted changes.

## Writes/ownership

Create DTO dateAndTime local dateTime string required, jobId:number positive required, itemRequisitionItems full nonempty array. Row itemId:number positive required, notes:string|null optional max500, quantity:number integer1..2147483647. Duplicate itemIds rejected. Update same plus header id:number positive and each row id:number (0 new/positive owned). No client tenant/audit/No/status/can* or quantities-derived fields. Backend annotations and service invariants validate all distinct live tenant FKs, date nondefault, quantity positivity, notes length, no duplicate rows. New editor starts one row quantity1/date now; unchanged update succeeds; missing saved row removed only after reference safety checks. Track load, OwnsAll/ReconcileOwned; profile ignores manually reconciled collection on Update, one-way maps.

Do not renumber historical rows. Existing No owner/fallback unchanged. Existing shadow nullable ItemRequisitionId on detail may become an explicit nullable same-column property for query/relation ownership; no backfill/required conversion. Notes max500 matching existing write annotation may need owner migration.

## Actions and state

Status derived from live source lines and live linked ItemIssue headers/rows grouped by ItemId. Open0 while any positive requested quantity remains, Closed1 only after all are issued. Empty historical requests remain Open. Creating a PR does not change issued quantities/status. Availability is not claimed; existing Issue source has no stock ledger/balance posting, keep that behavior and report it.

canEdit/canDelete: no live linked PR or Issue. Dependency guards protect provenance, not authorization. canCreatePurchaseRequest: positive remaining lines and no live linked PR. canIssue: positive remaining lines, independent of PR existence. View/Print available for existing record. Revalidate on backend writes/actions, stale UI flags never authorize mutation.

Persist nullable ItemRequisitionId+navigation on ItemIssue and PurchaseRequest headers, old rows null. One active tenant PR per nonnull source via filtered unique index; preserve unrelated PR create/edit flows. Requisition update/delete and source-linked issue/create/update/delete use the same existing tenant/entity serialization owner `ExecuteUniqueWriteAsync<ItemRequisition>` around re-read + validation + save. Do not duplicate/nest application locks; inspect owner implementation. A linked Issue edit/delete must keep fulfilment invariants or be rejected through a clear existing-state guard; raw direct writer must not bypass requested quantity limits. PR linked edit must retain provenance, no duplicate source PRs. No access restriction or accounting transition added.

GET /ItemRequisition existing paged read. GET /ItemRequisition/GetByWithNavigationsId/{id} typed detail (same normal/detail paths reconcile). POST/PUT ItemRequisition normal aggregate; DELETE ?id safe owned-delete after downstream checks.

POST /ItemRequisition/{id}/Issue: body `{dateAndTime:string, lines:[{requisitionItemId:number,quantity:number}]}`. Source Job/Item loaded server-side; positive owned line ids/unique lines/quantities≤current remaining. Create ItemIssue with nullable source link, same job, mapped source ItemIds; one aggregate save, return Result with Id. Opening dialog reads detail only, offers remaining default quantities and zero optional omitted lines; submit at least one positive line.

POST /ItemRequisition/{id}/PurchaseRequest: body `{date:string,supplierId:number,supplierQuotationNo:string|null,branchId:number|null,notes:string|null,discount:number,documents:string[],lines:[{requisitionItemId:number,quantity:number,unitsOfMeasuresId:number,unitPrice:number,description:string|null}]}`. Supplier required, quote≤100, notes≤1000, date required, discount nonnegative, unitprice nonnegative decimal18,2 bounded, line quantities positive int≤remaining; no duplicated/foreign line, at least one line. Server forces existing StockPR enum value, item/job source-derived, creates linked existing PurchaseRequest; validate every reference. Use existing ITaxPolicyService/domain rounding/VAT owners, no new posting/valuation formula. Client sends editable inputs only, never Amount/Tax/Gross. Documents reuse existing paths/tracker; enforce same current file ownership contract. Return Result with PR id. Single PR per request is minimal reviewer choice, no automatic save on action click.

PurchaseRequest routed action at /ItemRequisition/purchase-request/:id, shared Job editor shell/form/collection/files/fixed footer; close returns applied list route. `Save and Print` saves once then prints authoritative saved PR response/document through existing detail API/shared print service (cleanup retries never repeat save). Source request document identifies No in subtitle, item/job carried to PR. Issue action shared dialog; input quantity changes + Save no extra confirmation, dirty exits shared. Report/Print use shared UI21 sessions and complete backend read content; route/close guarded while printing.

## Preimplementation conformance

| Concern | Book | Actual reference/owner | Selected values |
|---|---|---|---|
| List | UI1/3/4/6 | Job list + FeatureTitle/FilterPanel/DataTable/styles | route-host/list-page/panel, filter mainColumns2, filltrue, actionsfirst, no feature SCSS |
| Requisition editor | UI13/14 | VehicleService details + EditorDialog/EditableCollectionTable/EditableRows | width1040 default bounded shell, contentPaddedtrue, two header columns, one small collection, no tabs |
| Owned write | BE14/8 | PurchaseOrderService + Service.OwnsAll/ReconcileOwned | all distinct FKs, full snapshot tracked update, delete ownedlines |
| Date/quantity | UI17/19/27 | date-utils/DatePickerDirective/FieldError/NumericFocusDirective | local time, integer1..intmax, selected IDs null initially, no native datetime-local |
| Action page | UI02/13/14/18 | Job editor shell, shared collection/upload tracker | source-based PR document, shared totals/file owner, no local card/table CSS |
| Cycles | UI7/BE8 | typed ActionList and shared serialized writes | backend can* flags, downstream inputs typed, same-page refresh, global mutation feedback |
| Print | UI20/21 | ReportActions/ReportPrintService/shared print classes | complete source reads, shared release, no feature styles |

Owner migration proposed `Add-Migration LinkItemRequisitionFulfilment`, optional header relations/index and notes storage bound; historical source links null, inspect duplicates/overlength values, no auto backfill. FE/API deploy together. Runtime/SQL/concurrency/stock behavior/print/RTL remain pending owner. No new reusable rule established; feature choices here, shared owners reused.

## Integration addendum, 2026-10-04

Default date range is the current month, first through last day, as actual currentMonthRange and UI17 specify; the earlier prose “last month range” was imprecise. Optional PR tax remains0 by default, mandatory tax uses current standard settings through existing policy; supplier-specific rate was rejected because current PR is not PurchaseOrder. New endpoint uses document VAT allocation owner and saved print reads persisted amounts/tax/gross. Issue/PR action reads and writes own inline error feedback with skip-error header; success remains global interceptor. Ordinary Req mutations retain global error/success. Zero quantity is allowed only as an unsubmitted draft line selection in downstream forms; submitted lines remain positive, at least one. One live PR per Req remains the minimal choice, so selected subsets do not authorize repeated PRs.

Direct ItemRequisitionItem, ItemIssueItem and PurchaseRequestDetail endpoints must also guard linked rows to avoid bypassing aggregate provenance/quantity rules; this is necessary directly related scope, not a general row-service refactor.

## Owner layout steering, 2026-10-04

Owner requested "خلى 4 فلاتر فى صف واحد" during implementation. List FilterPanel now selects public mainColumns=4, replacing the earlier mainColumns=2 choice. Shared responsive wrapping and sizing remain owned by FilterPanel/styles; no local CSS override.

## Final read-contract reconciliation, 2026-10-04

Master4/ListVM minimal-property audit found list jobId unused by any row/action, and detail purchaseRequestId unused by all in-scope views. Remove list jobId and detail purchaseRequestId from both wire DTOs; retain jobId on detail only for the editor. Backend still reads linked PR identity internally to derive flags. This corrects the initial overinclusive freeze against the governing book; actions/routes/write payloads do not change. Remaining ListVM: Id, No, DateAndTime, JobName, Status, CanEdit, CanDelete, CanCreatePurchaseRequest, CanIssue.

Linked Issue/PR edits use the permitted immutable-guard alternative; safe dependency-checked whole-document deletion allows reissue/recreation. No standalone PurchaseRequestDetail service/controller exists. AddList preflights all requisitions; unused internal UpdateList rejects detached aggregate replacement. Historical duplicate/null source ItemIds reject actions clearly. Cleanup failure freezes the downstream draft until retry finishes.

## Owner layout amendment, 2026-10-04 — Purchase Request

Frozen before this amendment's source edits. Owner first requested Documents in its own tab, Details full width, Items underneath, then clarified: "انا قصدى التفاصيل فى عمود رأسى والتفصيل فى عمود رأسى اخر". The final clarification supersedes the stacked layout and the intermediate interpretation of two columns of header fields. Replace only the requisition-owned Create Purchase Request three-column layout with shared workspace EditorTabs: typed details/documents tabs. Details tab contains two side-by-side bounded vertical panes: request fields in one single-column pane (240–280px), Items in the remaining width. Below the shared 620px workspace breakpoint they stack in bounded 0.8fr/1fr rows, retaining independent scroll. Documents uses the same parent-owned FormArray/upload tracker in an independent full-width tab. Totals/footer stay fixed. Switching tabs retains form/upload state, disabled during save/confirmation/upload/cleanup/print; invalid Save selects the owning tab before shared field focus. Saved authoritative print remains unchanged. Public payload/API/routes/domain/tax/cleanup contracts unchanged. Canonical UI1/13/14/18/21/27 govern; actual EditorTabs/VehicleService and shared form-section/grid source compared. The two-pane feature workspace is a narrow owner-directed layout choice using shared pane/field/table owners, without component styling overrides. No shared extraction or backend/schema changes required. Scope is the requisition Create PR page, not unrelated PurchaseRequest editors. Source-only visual acceptance pending owner.

### Owner numeric read appearance amendment

Frozen before the numeric appearance edits: owner requests the previous blue badge treatment for non-editable numbers such as Remaining Quantity and explicitly promotes it to the guide. Apply existing shared `__value` + `__value--highlight` and public column `align:'center'` to Remaining Quantity, Amount, Tax and Gross in this draft editor. Editable Quantity/Unit Price remain numeric controls; values/formulas/payloads unchanged. Promote the reusable rule to canonical UI14, skill and documentation history without inventing feature CSS or silently migrating unrelated consumers. Source confirms the shared 34px, 12% primary tint, centered/700-weight/6px treatment used by Workshop Job/Estimate; runtime acceptance remains pending.

### Owner Quantity width amendment

Frozen before this width edit: owner requests a smaller Quantity input. Select the existing public `EditableCollectionTableColumn.width:'100px'` only for Quantity instead of the shared numeric fallback180px; the shared fixed colgroup and 100%-width input own geometry. Other columns/validation/precision remain unchanged. The later question about a general global badge is answered as capability, with no new component or automatic numeric inference authorized/claimed.

Subsequent owner instruction before its edit: reduce Unit Price slightly as well. Select public `width:'120px'`, retaining more entry room than Quantity and preserving the existing decimal controls/validation.

Follow-up frozen before edits: owner requests smaller Amount/Tax/Amount With Tax columns. Select public width120px for each, preserving numeric/center and shared blue highlight. Reduce tableMinWidth from1500px to1360px, the sum of the current declared/minimum/fallback column widths, so the old minimum does not unnecessarily widen the compact columns. No values, formatting or calculations change; source-only visual acceptance pending.

## Purchase Request creation badge/filter amendment, 2026-10-04

Frozen before implementation. Explicit owner request adds a badge showing whether PR was created and a matching filter to the ItemRequisition list. Source evidence: existing PurchaseRequest.ItemRequisitionId and tenant/live `LivePurchaseRequests` already own creation eligibility; absence of CanCreatePurchaseRequest alone cannot prove PR exists (fully issued requests also cannot create one). No new persisted flag is needed. HasPurchaseRequest means at least one currently live same-tenant source-linked PR, not historical ever-created state. Linked soft deletion returns it to false. Fulfilment Open/Closed remains independent.

Wire read: add `hasPurchaseRequest:boolean` / `HasPurchaseRequest:bool` to ListVM and inherited detail projection, with matching FE detail DTO because single-document report consumes it as a list row. List display adds a non-sortable status column after fulfilment Status: translated PR Created(success) / PR Not Created(neutral), shared DataTable status badge. Same columns/labels flow to all-page export/report and request print. No linked PR identity/number, action, route or write field is added.

Filter: FE `hasPurchaseRequest:0|1|null`, exact query `Filters[hasPurchaseRequest]`, backend `FilterHelper.GetInt` valid0/1 only; 1 means exists, 0 means not exists, null/empty/malformed/unsupported means no restriction. Filter before total/paging using existing live scoped query. Default/reset null; route restore explicitly preserves0. Applied query, paging, PR-editor return, all-page report/export carry the same integer filter. Shared route helper drops boolean false, so integer0 is chosen instead of changing a cross-feature utility.

UI: existing four main filters remain `mainColumns=4`; add PR dropdown inside shared More Filters with advancedControls containing only hasPurchaseRequest. Reviewer placement decision preserves the earlier owner's four-main-field instruction; selected0 counts active in the shared panel. English/Arabic keys purchaseRequestStatus, purchaseRequestCreated, purchaseRequestNotCreated, allPurchaseRequestStatuses. Sort whitelist accepts only sortable columns; no backend PR-sort hook is needed. No custom badge/filter CSS or permission changes. Canonical Master4/5, UI4/5/6/8/10/16/23 and BE9/13/14 govern. Actual Job list type/status and FilterAdvanced usage, DataTable status/export owner, toFilterParams and list-route-state, ItemRequisition hooks/read projection compared. No schema/migration/backend writes or shared extraction needed. Source-only acceptance; all recipe packets stale, canonical sources govern.

Bounded ownership after freeze: root FE/list/models/translations/artifacts; backend worker only ItemRequisitionService.cs and ItemRequisitionListVm.cs. Preserve all existing dirty source. Phases0/1, 2 read/filter, 5 integration and 6 source reconciliation apply; editor/write/action phases otherwise unchanged.

## Five-filter alignment and reported PR state follow-up, 2026-10-04

Frozen before edits. Owner now explicitly requests all filters smaller and on one level/row, superseding earlier four-main-fields/More Filters placement. Move PR dropdown into main grid, choose shared mainColumns5 and stableLayouttrue; fields get narrower at desktop, shared34px height and responsive wrap remain. Remove unused advanced template/state/directive. API/applied0/1/null filter semantics unchanged.

Confirmed presentation defect in source: the badge used truthiness, so an omitted/undefined field was falsely labelled Not Created. Select Created only for strict booleantrue, Not Created only for strict booleanfalse, otherwise translated unavailable(warning) through shared status owner. Public backend bool contract is unchanged, no speculative local PR state or CanCreatePurchaseRequest inversion. Owner says both frontend and API updated; this is not evidence that the actual linked read response is correct. Source audit/creation-path clarification pending for reported explicit state mismatch; no historical link backfill or guessed associations authorized. Root handles FE alignment/renderer, existing backend worker performs bounded read-only chain audit under the prior frozen live-link contract.

## Issue Items blank-body correction — 2026-10-04

Frozen before edit. Owner reports ItemIssue opened through ItemRequisition appears blank. Selected shape remains UI13 single-collection action modal; source-only inspection (Master5) finds the projected sigma-editor-scroll has flex:1 1 0 inside the shared auto-height dialog. UI13 explicitly identifies collapse for this combination and requires the existing flex-fill (1 1 auto) alternative on projected links. Actual ItemRequisition details and Item details use sigma-editor-scroll flex-fill; this action has one projected scroll link only. Add flex-fill to that div; no shared CSS, new height, API, data, quantity/cycle, form, save, disabled, error/empty/retry, route, or earlier filter change. Current backend detail source returns ItemRequisitionItems/RemainingQuantity/CanIssue matching the frontend consumer; this is a presentation defect, not source evidence of missing data. Runtime root-cause reproduction and visual acceptance remain pending. Recipe Check reports drift; canonical UI13 governs, regeneration/semantic review pending.
## ترجمة الفرع المصدر والنص الإرشادي — ١ نوفمبر ٢٠٢٦

نُفذ طلب المالك تصحيح itemIssue.branch ثم نصه الإرشادي داخل ItemRequisition. تعديل S في نصين، لا تغيير عقد أعمال. المسار الفعلي pages/routing→ItemRequisition_Routes→نافذة IssueItemsDialog وقالب components/issue/issue.component.html:23–26 يستهلك itemIssue.branch للعنوان وariaLabel، وitemIssue.selectBranch للنص الإرشادي. ثبت غياب المفتاحين داخل كتلة itemIssue في قاموسَي en/ar، وليس خطأ ترجمة قيمة موجودة. أضيفت Source Branch / Select a source branch، و«الفرع المصدر» / «اختر الفرع المصدر». يشترك مستهلكو ItemIssue الحاليون في المفتاحين نفسيهما، ولا مبرر لنسخة ترجمة موازية.

المرجع المعني: شاشة Stock/04-item-requisitions من لقطة ٢٠٢٦-١٠-٢٨، R0567 وC1707/C1706، والعقد الحالي ودليل المخزون الذي يصف فرع الصرف المصدر. لا استنتاج قواعد مالية أو صلاحيات من المرجع. UI23 يملك قاموسي en/ar؛ لم تُعدل stubs للغات الأخرى أو البيانات/قاموس السيرفر. Check للحزم الثماني ناجح، وPHASE03/06 بتناسب للنصين؛ الشكل نافذة إجراء موجودة، ولا backend/API/DTO/Mapper أو حسابات أو طلب أو query أو index أو cache أو loading جديد. جرد تحميل/كاش نافذة الصرف السابق لم يتغير؛ لا مبرر لقياس أداء أو migration من إضافة نصين.

حُدث شرح قائمة الفرع المصدر في UserGuide/content/stock-guide.ts، موضوع ItemRequisition في /UserGuide/stock. فُحص AST لكل قاموس وثبت وجود كل مفتاح مرة واحدة بقيمة صحيحة، ونجحت صياغة الدليل وgit diff --check. روجع كامل فرق القاموسين وتعديل جملة الدليل مع حفظ تغييرات المستخدم الأخرى. لا قاعدة مشتركة جديدة تحتاج ترقية كتاب/مهارة أو توليد حزم، ولا وكلاء لشريحة نصين متسلسلة. لم تُشغل build/tests/lint/browser/DB أو نشر أو commit. القبول المرئي وترجمة runtime بعد البناء/تحميل اللغة عند المالك؛ لا ادعاء تحديث قاعدة ترجمة منشورة تلقائيًا.

رسالة حفظ مقترحة للواجهة: fix(item-issue): translate source branch label and placeholder
