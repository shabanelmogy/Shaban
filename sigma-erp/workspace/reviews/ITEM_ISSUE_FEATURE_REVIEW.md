# Item Issue feature review

| Status | Implemented — source-only |
|---|---|
| Owner verification pending | yes |
| Date | 2026-10-04 |

## Result and manifest
Requested ItemIssue review and implementation against documentation. UI01 list with modal editor; BE2 header with owned rows and no financial effect. Frozen plan and API contract are ITEM_ISSUE_MAINTENANCE_EVOLUTION_PLAN.md and ITEM_ISSUE_DOMAIN_API_CONTRACT_FREEZE.md, including the necessary direct-row guard addendum. Canonical Master/UI/BE books and sigma-screen-refactor skill govern; screenshots supply content evidence, not instructions. Phase0–6 applied; Phase4 contains dependency-safe delete/row removal and preservation of the source-linked immutable cycle, not an invented approval/stock workflow.

FE owner F:/My Work/Sigma/SiGmaAngularFrontEnd; BE owner F:/My Work/Sigma/SigmaBackend. Existing ItemRequisition provenance/guard changes and unrelated Layout/i18n/resx edits were preserved. ItemIssue frontend was clean before this task. No permission mechanism exists beyond existing AuthGuard/backend authentication and authenticated tenant; visibility is not authorization.

Recipe drift check: PLAN00/PHASE00/02/05/06 current; PHASE01/03/04 stale, canonical sources used. Owner regeneration and semantic review pending; no generated files edited. Approved references inspected: Workshop/Job list, Fleet/VehicleService editor and shared EditorDialog, EditableCollectionTable/EditableRows, backend PurchaseOrder interface/service/controller and owning DTO/action menu; shared base helpers. PurchaseOrder's older list snippet omits TotalCount: target uses current shared GetManyAsync pipeline instead, consistent with BE7. Reference business actions were classified rather than copied.

## Functional evidence
Screenshots: C:/Users/user/Desktop/Stock/Item Issue/1.PNG and 2.PNG, historical English LTR desktop; application version, capture date, role, responsive/theme acceptance unknown.

| Evidence | Explicit visible content | Classification/target |
|---|---|---|
| E1 list | Add Item Issue; No/date/Job columns; No/date range/Job filters; View/Edit/Delete; Report/Excel/Search; paging | Confirmed content, shared UI01 presentation |
| E2 editor | DateAndTime/Job; Item/Quantity rows; Add/Remove row; Save/Cancel | Confirmed content, typed shared modal |
| Screenshot colors/control geometry | Legacy table, underline fields and footer | Guidance only; shared canonical controls and styles govern |
| Job subject text in historical image | RoutineService etc. beside Job number | Current Job has No but no corresponding subject/type field; display existing No, never invent values |
| Required/minimum/duplicate/source lock | Cannot be proven from images | Reviewer decision from source/BE14 and prior frozen requisition cycle |
| Stock availability, ledger deduction, valuation | Not shown and no existing owner in ItemIssue service | Not applicable to confirmed implementation; no effect claimed |

No material Missing/Conflicting requirement remains for the selected scope. Runtime/visual conformance stays pending.

## Decisions (Master4)
| # | Decision | Evidence/result |
|---|---|---|
| 1 | Shape-specific references | UI01 catalog: Job list + VehicleService/shared dialog; BE2: PurchaseOrder/shared ownership helpers |
| 2 | Modal editor | One small Item/Quantity child collection, no totals/posting; one controlled Create/View/Edit component |
| 3 | One owning list route | /ItemIssue; legacy create/details redirect to list intents; canDeactivate on owning list |
| 4 | Columns | Actions first, no(text), dateAndTime(dateTime), jobName(text), sortable on server |
| 5 | ListVM | id/no/dateAndTime/jobName/canEdit only; nested Job/items/jobId/audit fields removed |
| 6 | Writes | dateAndTime/jobId/itemIssueItems; Update adds header/line IDs; no subscription/No/audit/source |
| 7 | Detail | List values + jobId/itemRequisitionNo + line id/itemId/itemName/quantity; no nested entity DTOs |
| 8 | Styles | Shared route/list shell, title/filter/grid/dialog/collection; empty details SCSS removed, empty unused list SCSS remains |
| 9 | Confirm | Shared delete confirmation and EditableRows remove confirmation; ordinary Save unchanged |
| 10 | Discard | Shared confirmDiscard on dirty close/Escape/navigation; pristine/view silent; save/confirm busy guarded |
| 11 | Backend | BE2 owned full-snapshot aggregate; no financial posting/calculation |
| 12 | Entity base | Existing tenant EntityBase and integer IDs retained; historical nullable FKs read as nullable |
| 13 | Duplicates | Reject duplicate ItemId within one full issue snapshot; no new global uniqueness or numbering index |
| 14 | FK/delete | All distinct live tenant Job/Item IDs validated; OwnsAll; RemoveDropped/InUse and RemoveWithChildren model dependency owner |
| 15 | Filters/paging | no/jobId generic keys, inclusive dateFrom/dateTo feature filter; default15/max100; authoritative counts/default newest ID |
| 16 | Translations | Matching 49-key ItemIssue namespaces EN/AR; six backend message keys; Arabic Job wording corrected |
| 17 | Registration | root ItemIssueService/environment.baseUrl/interceptor-enabled HTTP; only duplicate ItemIssue Layout registrations removed |
| 18 | Migration | No new entity/EF change here. Prior LinkItemRequisitionFulfilment owner migration prerequisite remains if unapplied |
| 19 | Reference actions | Every reference action inventoried below; no unrelated job/PO workflows transplanted |
| 20 | Overrides | Necessary filter/projection/aggregate validation/reconciliation/delete only; redundant controller list override removed |
| 21 | Evolution | Plan Frozen before implementation/delegation; keep source cycle instead of duplicate owner |
| 22 | Children | Full nonempty snapshot, saved IDs retained/new IDs0, missing safe rows soft-deleted; foreign/negative/duplicate saved IDs rejected |
| 23 | Money/VAT | Not applicable: Quantity is integer, no price/tax/total/journal fields in issue |
| 24 | Authorization candidates | Create POST/Edit PUT/Delete DELETE ItemIssue, direct child PUT/DELETE; existing authentication only |
| 25 | Business correctness | Prevent empty/invalid/repeated item issue, lost line identity and source fulfilment bypass; preserve prior linked immutability |

## Grid/read/filter contracts
| Grid/action need | Frontend | Backend |
|---|---|---|
| Identity | id:number | Id:int |
| Issue number | no:string|null | No:string? |
| Date/time | dateAndTime:string | DateAndTime:DateTime |
| Job label | jobName:string|null | JobName:string?; live tenant Job.No |
| Edit eligibility | canEdit:boolean | CanEdit:bool; !ItemRequisitionId.HasValue |

Removed ListVM child graph, Job graph and JobId, inherited audit/tenant/delete fields. Removed unused ItemIssueFullListVM after scoped consumer check; dedicated line VMs prevent changing standalone ItemIssueItem read DTOs.

| UI control | Form/filter | Serialized key | Backend/parser | Default |
|---|---|---|---|---|
| No | no:string | Filters[no] | generic case-insensitive property/string | empty omitted |
| Job | jobId:number|null | Filters[jobId] | generic positive int selection | null omitted |
| Date range | Date[]/string/null | Filters[dateFrom], Filters[dateTo] | FilterHelper.GetDate; inclusive Date comparisons | current month |
| Sort | explicit column field/order | Filters[sortField], Filters[sortOrder] | no/dateAndTime generic, jobName Job.No projection | newest Id; tie-breaker Id |
| Paging | pageNo/pageSize | pageNo/pageSize | NormalizePaging, clamp100, total CountAsync | 1/15; 10/15/20/50/100 choices |

No status/false/zero enum filter exists. Empty/null omitted; invalid lookup IDs normalized to null. Shared range validator handles invalid/incomplete ranges. Applied filters/page/sort are snapshotted for export/report and saved in route; unsent edits do not affect output.

| Field | Form/detail | Add/Update | Owner/validation |
|---|---|---|---|
| DateAndTime | Date|string|null / string | local dateTime string | required/date validator; server nondefault |
| Job | number|null / nullable saved id + label | positive number | selected live lookup; server all-exist |
| Item rows | typed FormArray / ids and labels | whole nonempty array | minimum1/duplicate check on both boundaries |
| Quantity | number|null / number | integer1..intMax | frontend integer/min/max, backend int/range/positive |
| Row IDs | number / saved positive id | Update only;0 new | server OwnsAll before mapping |
| No/provenance | read-only labels | absent | server-owned; source link cannot be set/cleared by client |

## Action inventory and cycle
| Reference public action | Target classification/evidence |
|---|---|
| Job Create/View/Edit/Delete | Supported for issue with its own contract and linked-source edit guard |
| Job labour time | Not applicable: issue has no labour/time ownership |
| Job invoice customer | Not applicable: issue has no customer charge/invoice generation state |
| Job close | Not applicable: issue has no Job lifecycle status/ClosedAt |
| Job gate pass print | Not applicable: issue has no closed/invoiced vehicle release workflow |
| Job lubrication create | Not applicable: issue has no workshop service record kind |
| Job export/search/reset/paging | Supported through canonical grid/filter/export owners |
| VehicleService Create/View/Edit/Save/Close/discard/remove-row | Supported shared interaction; issue owns its own Date/Job/Item/Quantity inputs |
| PurchaseOrder Add/Update/Detail/list/delete | Supported aggregate validation/read/owned-delete shape |
| PurchaseOrder SearchPurchaseOrders | Not applicable: PO lookup transport has no consumer in issue; issue uses its own list filters |
| PurchaseOrder ToggleApprovalStatus | Not applicable: issue has no approval field |
| PurchaseOrder ToggleBillStatus | Not applicable: issue has no bill state/financial document |
| PurchaseOrder optional equipment quotation/tax recalculation | Not applicable: issue has neither equipment quotation relation nor monetary lines |

| Action | Source -> target | Endpoint/payload/UI | Dependency/concurrency/failure |
|---|---|---|---|
| Create | new -> live standalone issue | POST ItemIssue, typed editable inputs, shared modal Save | validate all FKs/nonempty/unique qty rows, one implicit aggregate save; global feedback |
| View | live -> unchanged | GET GetByWithNavigationsId/id, modal View | live tenant projection; errors/retry inline |
| Edit | live standalone -> live updated | PUT ItemIssue, full snapshot/owned IDs, canEdittrue | server reload inside existing ItemRequisition lock; reject linked/foreign lines and invalid FKs; one save, same-page refresh |
| Linked edit | live source-linked -> unchanged | no Edit control, backend PUT still checked | prior ItemRequisitionLinkedIssueEdit guard preserved; no UI authorization claim |
| Remove row | live standalone draft -> edited snapshot | confirmation, then PUT on Save | minimum1/ownership/dependency checks authoritative; missing row removed only when safe |
| Delete | live standalone or linked -> soft-deleted header/lines | DELETE ItemIssue?id=n after shared confirmation | existing source lock + dependency-aware owned-delete; source remaining quantities recompute from surviving live issues; refresh/page clamp |
| Direct row mutation | live owned row -> unchanged | legacy ItemIssueItem PUT/DELETE receive use-aggregate-editor error | linked guard first, aggregate guard closes minimum/duplicate/quantity bypass; orphan behavior retained |
| Report/Excel | applied list -> unchanged document/file | all matching pages100; same three displayed columns | fail whole output on any page error; shared report print isolation/cleanup, print guard |

Separate legacy ItemIssueItem screen remains outside UI-refactor scope; owned-row edits/removes now direct users to the issue editor. No stock ledger or physical available-quantity claim is introduced.

## Override audit
| Method | Target decision/reason |
|---|---|
| ApplyListFilters | Override for inclusive DateAndTime boundaries |
| ApplyListOrder | Override only JobName -> guarded Job.No sort; ordinary columns inherit |
| MaterializeListAsync | Override ProjectTo to select lean flattened label/action fields |
| GetManyAsync | Inherit shared filter/count/order/page pipeline |
| GetManyWithNavigationsAsync | Override needed legacy compatibility: base skips feature date/order pipeline; same lean projection/count |
| GetAllWithNavigationsAsync | Override needed projection avoids deep unrelated Job/source graphs |
| DetailAsync / DetailWithNavigationsAsync | Both need live owned rows/navigation labels; private ReadDetailAsync projection, neither forwards to another override/base |
| AddAsync | Override minimum/date/quantity/duplicates/all distinct FKs, then generic save |
| AddListAsync | Preflight every snapshot because generic bulk bypasses normal validation |
| UpdateAsync / UpdateCoreAsync | Preserve source lock; tracked load/linked guard/OwnsAll/dropped dependency checks/reconcile/save |
| UpdateListAsync | Reject unused detached graph replacement to prevent invariant bypass; no bulk route or issue consumer |
| RemoveAsync | Existing serialized source-aware RemoveWithChildrenAsync |
| SelectAsync / HandleActiveAsync | Inherited compatibility; no controls/workflow invented |
| ItemIssueItem Update/UpdateList/Remove | Existing linked lock/guard plus live aggregate-owned-row guard |
| Controller GetListAsync | Removed old unnecessary override; inherited normal list |

Mapping: one-way Add/Update/read maps, dedicated row maps; only Ignore is manually reconciled Update collection. Job/Item/source labels are tenant/live guarded, absent values null. Derived canEdit and requisition remaining/status remain backend-owned. No new stored calculation, schema or index.

## Source conformance and reconciliation
| Concern | Target symbols/compared values | Result |
|---|---|---|
| List shell | ItemIssuesComponent host sigma-route-host; HTML list-page/panel/header/title/filter/table; app-data-table filltrue | Matches Job/shared canonical scroll chain; source-only |
| Filter layout | FilterPanel public mainColumns3, No/DateRange/Job, required reset event, filter class | Three equal fields on large screens; shared responsive wrapping |
| Grid | typed columns no/dateAndTime/jobName, id key, choices10/15/20/50/100, default15, controlledfirst/sort/count | Matches shared inputs; server fields reconciled |
| Editor | ItemIssueDetailsComponent default shared width1040/maxHeight/breakpoints; contentPaddedtrue, gridcolumns2 | Matches shared/VehicleService values; no custom wrappers/styles |
| Collection | columns Item360/Qty150, tableMinWidth560, typed EditableRows, view quantity shared value span | Same owners, exactly one small collection |
| Validation | required positive IDs/live membership, date-utils, int qty1..2147483647, focusField and NumericFocus | Same shared owners; backend checks match |
| Mutation/read errors | root HTTP/baseUrl; reads skip error only + inline both failure channels; ordinary writes shared interceptor feedback | Reconciled with current interceptors |
| Cancellation | takeUntilDestroyed/finalize all reads; editor visible false on destroy; pending parent focus frame cancelled on destroy/new dialog | Prevents stale callbacks restoring modal focus after teardown |
| Report | EditorDialog print isolation, ReportActions footer, PrintSession, all pages then no paginator/scrollablefalse, print-flow | Canonical dialog output; no DOCUMENT/direct print lifecycle |
| Provider/routes | Layout removed only ItemIssue duplicate providers; root service, legacy redirects, dirty guard | Existing app lazy route retained; no broad tsconfig include |
| Backend/DTOs | service/profiler/controller/header + dedicated row DTOs compared to exact TS types | Compatible frozen shapes; source-linked guard retained |
| Source checks | Separate FE/BE scoped diffs read; whitespace/merge-marker/stale type/import/translation scans | Passed for task-owned source; shared files reviewed for own hunks, pre-existing edits retained |
| Runtime/SQL | compilation, EF ProjectTo translation, lock/rollback, modal/print/RTL/theme/responsive operation | Pending owner; no runtime claim |

No shared extraction is needed: existing shared owners already cover the list/editor/collection/validation/print behavior. No new reusable guidance established; feature choices stay in these artifacts, no skill/book rule added.

## Changed files
Frontend module: components/list/list.component.ts/.html; components/details/details.component.ts/.html; deleted empty details SCSS; models/create.ts/details.ts/list.ts; services/itemissue.service.ts; itemissue.routes.ts; new components/report/report.component.ts/.html.
Direct integration: src/app/_metronic/layout/layout.module.ts (ItemIssue only), src/app/modules/i18n/vocabs/en.ts/ar.ts (ItemIssue only).
Backend: SiGma.ViewModels/ViewModels/ItemIssue header Add/Update/List/Detail VMs; new ItemIssueLineAddVM/UpdateVM/DetailVM; removed unused ItemIssueFullListVm; SiGma.Business/MapperConfig/ItemIssueProfiler.cs; Services/StocksServices/ItemIssueService.cs and directly related ItemIssueItemService.cs guard; SiGma.ServerAPI/Controller/ItemIssueController.cs; SiGma.Helpers/Localization/Shared/GeneralMessage.resx/ar-SA.resx (six ItemIssue keys only).
Existing schema/provenance files untouched during this task.

## Owner verification and delivery
Build/test/runtime/database/browser verification pending by project boundary. Deploy FE and BE contracts together. No new migration for this task; if prior nullable provenance columns/index have not been applied, owner runs Add-Migration LinkItemRequisitionFulfilment and reviews that prior migration/data compatibility before deployment.

Manual checks: all three filters/reset/date endpoints and sort/page15/pager/export/report across multiple pages; standalone create/edit/add/remove/no-op update; invalid duplicate/zero/fractional/foreign saved line IDs; historical missing labels; linked View only and stale PUT rejection; delete dependency and requisition remaining restoration; legacy URLs/dirty close/Escape/navigation/retry and loader teardown; Arabic/English/dark/RTL/narrow widths; print/cancel returns to same list.

Suggested FE commit: refactor(stock): align item issue list and editor with shared patterns
Suggested BE commit: fix(stock): validate and reconcile item issue aggregates
Suggestions only, no commits made.

Two reused bounded inherited-model agents: editor owned details/models; backend owned header API/profile/service/direct-row guard/resx. Root froze contracts, owned list/report/service/routes/translations, and performed integration/full scoped review. Independent frontend-editor/backend work reduced wall-clock time and file overlap. Backend agent reported implementation then encountered capacity while finalizing; root completed its diff/contract audit. No agent was delegated unresolved business decisions.

Prohibited commands were not run: no build/test/lint/browser/app/DB/migration/snapshot/Graphify/Sigma MCP/commit/push/deploy. Owner verification remains yes.
# Filter alignment addendum — 2026-10-04

Status: Implemented — source-only; owner verification pending: yes.

Owner clarified that earlier screens are already adjusted; filter changes begin at Item Issue. Root source inspection found FilterPanel default bottom-aligns fields while the date field has an inline error host. Item Issue now opts into existing stableLayout top alignment and reserves translated date feedback, matching actual Workshop Job list. No shared defaults, earlier filter templates, three-column widths, responsive breakpoints, translations, form/queries/actions or backend changes. UI4/required skill/history now require same-row alignment for new/subsequently reviewed screens. Source diff checked; no build/test/lint/browser/DB/migration/commit/deploy run. Owner should check three controls before/during invalid date entry, RTL/narrow/theme and Search/Reset after frontend build. Suggested frontend commit: `fix(stock): align item issue filter controls`. Generated packets require regeneration and semantic review.

## Edit action visibility diagnostic — 2026-10-04

Source-read-only question: user asks why ItemIssue has no Edit in Actions. ItemIssue list actions declares visible(row) => row?.canEdit === true; missing/false flag hides Edit. ItemIssueProfiler sets CanEdit = !ItemRequisitionId.HasValue for list and detail. Standalone issues editable; source-linked issues intentionally View-only under prior frozen source-fulfilment contract, with matching UpdateCore LinkedAsync/ItemRequisitionLinkedIssueEdit guard. Editor also hides Edit when details.canEdit is not true. No change implemented or current business restriction relaxed. Exact user's row/link and live response not supplied/verified; if all standalone rows lack Edit, inspect response canEdit for older API shape, given earlier HAR showed stale running API. No builds/tests/runtime/API/DB/migrations/commits or browser actions. No agents needed for bounded sequential trace.

## عقد إصلاح تصميم عرض صرف الأصناف — ١ نوفمبر ٢٠٢٦

الحالة Frozen ضمن تفويض المالك الجاري بإصلاح الملاحظات المؤكدة دون اختراع أعمال؛ الطلب الحالي مراجعة تصميم View Item Issue. النطاق presentation للشاشة المشتركة الحالية، لا تغيير لحفظ/صرف/اعتماد أو إتاحة Edit. الشكل نافذة حقول وبنود مع تبويب موافقات، UI01/UI13؛ مصدر المقارنة 15-stock/05-item-issues وR0564/C1678/C1679 (اللقطة المحلية ٢٠٢٦-١٠-٢٨؛ يراجع رقم R من صفحة المصدر عند المصالحة)، مع شرح المحرر المحلي والعقد الحالي والدليل. المرجع يثبت حقول التاريخ/أمر العمل/الأصناف/الكميات، ولا يفرض مظهر Sigma أو خادم/قواعد مخزون جديدة.

النتائج المؤكدة: app-editor-dialog بلا height لكن form/body/scroll تستخدم zero-basis flex، فتحتاج UI13 definite-height أو سلسلة auto-basis كاملة. وضع View يستخدم نفس EditableCollectionTable المرتبط بالنموذج بدل عرض saved DTO مباشر، وعلامات required باقية على حقول غير قابلة للتعديل، وعمودان للبيانات الثلاثة يتركان فراغًا. القرار: View basic محتوى بحجم بياناته عبر سلسلة auto-basis كاملة وعرض840px، ومحرر/موافقات بارتفاع640px محدود بالنافذة للـzero-basis الحالي. تجميع البيانات في FormSection مشتركة وثلاثة أعمدة في العرض؛ الأصناف DataTable مقروءة من details.itemIssueItems دون صفوف إضافة/حذف أو pagination/طلب جديد. تبقى tab/basic/approval والموافقات وحراس canEdit/linkedReadOnly كما هي. لا تعديل للمكوّنات المشتركة أو palette/CSS محلي، ولا تبديل DTO أو حسابات أو مجال الأسعار/الكمية.

تصحيح دليل الهندسة قبل التنفيذ: تبين من المصدر الفعلي _sigma-utilities.scss:111 أن sigma-u-flex-fill تفرض flex:1 1 auto!important، وهي موجودة بالفعل على form/body/scroll في Basic؛ لذلك لا يثبت انكماش هذا التبويب من zero-basis ولا يحتاج ارتفاعًا إضافيًا. الخطر المؤكد يخص مضيف تبويب الموافقات sigma-editor-form الذي لا يملك هذا override. القرار المصحح: Basic يظل auto-height بالكامل في العرض والتحرير، ويتغير فقط عرض View إلى840px وتجميع الحقول وجدول القراءة. height640 المحدود يُطبق عند تبويب approval فقط. تُلغى فرضية هندسة Basic في الفقرة السابقة، ولا توثيق لانكماشه كعيب مثبت. استُخدم دليل المصدر الجديد قبل تنفيذ أي تعديل.

### المصالحة النهائية لتصميم View Item Issue — ١ نوفمبر ٢٠٢٦

نُفذ نطاق العرض المؤكد وفق التفويض السابق، وروجع المصدر. المرجع المؤرخ الصحيح R0568 (وليس R0564 المسجل كاحتمال أولي أعلاه)، C1678/C1679؛ مرجع الإجراءات لا يقرر شكل العرض أو قواعد مخزون إضافية. لا screenshot جديد. الحزم الثماني نجحت في Check، وPHASE03/05/06 بتناسب؛ UI6/13/15/22/27 ومالكو EditorDialog/FormSection/DataTable/EditorTabs الحاليون هم مرجع التطبيق. لا وكلاء لصغر تغيير عرض واحد وترابط ملفاته.

النتيجة: عرض View بعرض840px بدل الافتراضي1040، مع حدود EditorDialog واستجابته الحالية. Basic يحتفظ بقياس المحتوى وسلسلة sigma-u-flex-fill الفعلية flex:1 1 auto!important على form/body/scroll؛ لم يضف ارتفاعًا ثابتًا للعرض. تبويب Approval وحده يحصل على640px محدود بارتفاع الشاشة، لأن مضيفه sigma-editor-form دون override يملك flex:1 1 0؛ رأس النافذة/تذييلها يبقيان خارج تمرير المحتوى. لا CSS محلي أو تغيير global/مشترك أو حشو مكرر، ولا ادعاء هندسة مرئية مقاسة.

FormSection يجمع بيانات التاريخ/الوقت وأمر العمل والفرع المصدر، وثلاثة أعمدة في View بدل صفين وفراغ، مع الأسماء التاريخية والقيمة البديلة عند غيابها. مرجع طلب الأصناف القائم باقٍ. علامات required تظهر فقط في التحرير؛ label لا يستهدف span غير labelable في العرض. أضيفت هوية panel وrole/aria-labelledby المطابقة للـEditorTabs الفعلي في التبويبين.

جدول العرض DataTable يستهلك details.itemIssueItems مباشرة؛ العمودان itemName/quantity يطابقان DTO {id,itemId,itemName,quantity}، والهوية dataKey=id. النوع number لا يغير أو يقرب الكمية الصحيحة الحالية. الجدول local كامل بلا lazy أو pagination أو scroll مستقل، وتمرير Basic يملكه sigma-editor-scroll وحده؛ لا تشغّل صفوف EditableCollectionRow في View ولا Add/Remove. Create/Edit يبقيان الجدول التفاعلي وFormArray وEditableRows والأحداث والتحقق وpayload كما هي، مع نفس الحقول والضوابط. FormSection يستهلك المساعدة التجريبية من مالكها الحالي، وتبقى مقفلة في View.

الموافقات والإلغاء وcanEdit/linkedReadOnly وcloseBlocked وEdit visibility وقواعد الأثر المخزني لم تتغير، ولا زر أو علاقة/مستند جديد. لا DTO/API/Mapper أو backend أو حسابات أو صلاحيات أو حصر مصدر جديد، ولا Add-Migration. مصدر القراءة الخلفي الفعلي ItemIssueService.ReadDetailAsync يستعمل Query<ItemIssue>(Id) ونطاق tenant/live ثم AsNoTracking/ProjectTo إلى DetailVM محدود؛ لا generic graph جديد أو N+1 أو call لكل بند. يبقى فحص الاستعلام وخطته وزمنه عند المالك؛ لا predicate/join/order جديد يبرر فهرسًا من تعديل العرض.

جرد التحميل والكاش المتناسب مع View: getDetails→GET ItemIssue/GetByWithNavigationsId/{id} قراءة تشغيلية مباشرة وليست source opt-in، مع startLoading/finalize/endLoading وDestroyRef والتحقق من هوية السجل. StateMessage المحلي في الحوار body-appended يظل مالك التقدم الظاهر، وتخفي قواعد التحميل المشتركة مضيف shell الخلفي؛ الخطأ وRetry كما هما، والجدول لا يضيف مؤشرًا ثانيًا. Approval يُقرأ عند تركيب تبويبه فقط عبر getApproval→GET ItemIssue/{id}/approval؛ readSubscription تلغى عند الاستبدال/التدمير وfinalize يحرر العداد، ورسالة الخطأ/Retry وpending محفوظة. لا lookup أو cache/writer/import/topic جديد في View. خيارات Job/Branch/Item لا تُطلب لوضع View؛ عقود استهلاكها في التحرير خارج إصلاح العرض الحالي ولا ندعي إعادة تدقيق تبنيها كاملًا في هذه الشريحة. عداد الحفظ وأثره مستقلان ولم يتغيرا.

حُدث موضوع صرف الأصناف في UserGuide/content/stock-guide.ts ضمن /UserGuide/stock لشرح بيانات العرض والجدول وتبويب الموافقات. روجع فرق TS/HTML وتعديل جملة الدليل كاملًا مع حفظ تغييرات المستخدم السابقة. نجحت صياغة TS للمحرر والدليل وقالب Angular وgit diff --check. لا قاعدة مشتركة جديدة تحتاج كتابًا/مهارة/توليدًا؛ القدرة المستعملة قائمة أصلًا. لم تُشغّل builds/tests/lint/browser/database/migration/commit. التحقق المطلوب من المالك: عرض مستند قصير وآخر كثير البنود، مصدر مرتبط أو اسم مصدر مفقود، تبويب الموافقات وClose وEdit المؤهل، ثم RTL/الشاشة الضيقة/المظهر الداكن. قارن خمس عينات فتح باردة/دافئة لنفس المستند والبيئة إذا أريد تقييم زمن العرض؛ لا ادعاء تحسين سرعة من تبديل الجدول وحده.

رسالة حفظ مقترحة للواجهة: fix(item-issue): clarify view layout and read-only item table
## Item Issue tabbed editor — 2026-11-01

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Explicit owner request: organize Add Item Issue into tabs. Frozen scoped presentation: Basic information (date/job/source branch and existing source summary), Items (existing row editor/read table), and existing Approvals only for a saved issue. Create/Edit/View share the current editor; fields, DTOs, integer quantity/validation, source-linked read-only guards and approval behavior stay unchanged. Existing modal remains a scoped compatibility exception to UI13's normal approval-bearing routed-editor choice; no route migration in this presentation request.

Use the actual shared EditorTabs workspace appearance and matching panel IDs, one typed parent FormGroup and mounted basic/items panels using hidden. Retain FormSection card ownership for both panels, suppress repeated headings via public inputs, preserve collection Add/Remove/validation and mock assistance. Save remains available in either content tab; invalid header or row/empty/duplicate collection activates its owning panel before focus. Keep existing auto-basis form/body/scroll and content-sized height for Basic/Items; the independent zero-basis Approvals panel retains its existing bounded640px height. No new private tabs/styles or loader/cache.

Evidence before edit: active pages/routing.ts:606 → ItemIssue/itemissue.routes.ts → ItemIssuesComponent → ItemIssueDetailsComponent; existing review and domain/API freeze read alongside current source, whose newer approval decisions supersede historical no-approval prose. Canonical UI13/14/27 public owners and PHASE-03 apply; recipe -Check passed all eight. Reference entry previously read in this chat; dated Stock/Item Issues screen05 (tenant.CRS_Issues, R0568) and controller mappings C1679/C1678 read for field/workflow applicability. This change reorganizes existing fields, not reference appearance or unknown backend rules; broader reference feature gaps are outside the tab slice. No subagents: tightly coupled template/state/focus edits share the same two files.

### Final reconciliation of the tab slice

Implemented contentTabs/basic+items and savedTabs/+approval, with saved-ID gating and the shared workspace appearance. Basic/Items sections stay mounted under one form and use matching tab/panel IDs plus hidden. Both sections use compact FormSection cards with showTitle=false; the Items collection keeps Add/Remove and validation under headingVisible=false, while the outer card owns mock assistance. View retains the typed read-only DataTable. Existing header width, compact content-sized auto-basis form/body/scroll and approval-only definite640px height are preserved. No new CSS or library API.

Save and canMutate now admit either content tab; primary Save/Edit and footer hint follow that rule. Header validation activates Basic before focus; line validation, empty collection and duplicate rows activate Items. Shared focusField waits for rendering before focusing. The typed parent form, line IDs, payload construction, source summary, dirty/discard, source-linked guards, close blocking, approval event and stock effects are unchanged. Current pre-existing View/source changes were preserved.

Request/cache/load gate: same create bootstrap via Job/GetSelect, Branch/GetSelect and Item/GetSelect, all already source-opted into BaseService's shared reference cache; no new endpoint, request, forceRefresh or local cache. Opening Basic/Items does not invoke a read or remount the form; existing lookup state/error/Retry remains above the panels. View skips edit-only lookups, detail and save keep paired global start/finalize; body-appended dialog keeps existing local StateMessage. Form now exposes aria-busy for detail/lookups/save. Existing consumer cache-watch/context modernization is outside this presentation slice, not claimed complete. Existing Approvals remount behavior is unchanged; no new approval request introduced by Basic/Items switching.

Performance/query/index disposition: no backend/query/materialization or source data volume change, hence no new index justified. Existing lean detail and select contracts remain; actual SQL/timing unmeasured. Owner can compare five same-record/same-build cold/warm opens and verify no network requests from Basic↔Items switching, separately from approval reads. No measured speed claim or migration.

Updated UserGuide/content/stock-guide.ts purpose and Create steps in both languages to match Basic/Items, retained values, Save/error navigation and saved Approvals. Existing /UserGuide/stock, sideMenu.stockGuide, STOCK_GUIDE reader and /ItemIssue topic retained. Final files for this slice: details.component.ts/.html, Item Issue guide text and this existing review. Existing translation keys basicInfo/items/approval.tab reused. No new book/skill rule or packet regeneration needed; all eight packets passed initial drift check. Applied scoped discovery/freeze, Phase3 presentation and final reconciliation; skipped backend/list/domain-action implementation because contracts are unchanged.

Source verification: complete scoped component diff reviewed, Angular template plus component/guide TypeScript syntax parsed without errors, and git diff --check passed. Syntax parsing is not typechecking, a build, runtime or visual acceptance. Owner checks Add/Edit/View tabs, header/line validation from the other tab, empty/duplicate lines, Add/Remove, draft preservation, saved-only approvals, locked records, Close/discard, RTL/LTR, light/dark, narrow/short viewports and long item lists. No builds, tests, lint, browser, database, migrations, commits or pushes. Suggested frontend commit: `refactor(stock): split item issue editor into shared tabs`. No backend commit. No delegated work for this tightly coupled change.

## Item Issue editor reference-cache adoption — 2026-11-01

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Owner added explicit cache correction to the active Add Item Issue tabs task. The prior tab-slice cache modernization exclusion is superseded for this editor. Existing Job/GetSelect, Branch/GetSelect and Item/GetSelect are source-approved cached identity/label reads; keep their URLs, typed Results<DropDownSelect>, source eligibility/invalidation and backend validation. Freeze finite successful three-source bootstrap with array/empty-completion guards, then separate once-bound ReferenceLookupBindings watches; selected header/line labels and draft are preserved, absent live options disabled. Context reset cancels reads/watches, clears prior options/detail, rejects pending confirmations and freezes the editor until reopen. Already sent writes keep independent safety and cannot apply old-context local results. Detail/approval/stock capacity/uniqueness/financial reads remain fresh and outside this reference cache.

Root owns editor/source and user-guide integration. A reused read-only backend explorer audits source selectors, writers/tenant topics and query/index evidence independently; no delegated edits or shared-contract changes. No schema/migration/runtime execution. This is a bounded extension of existing UI2/22/28 shared owners, not a new shared cache or API.

### Cache source and consumer reconciliation

| Consumed URL / actual source | Cache classification and successful writer/import invalidation | Active consumer result |
|---|---|---|
| Job/GetSelect / JobService | Existing cacheSelect=true; typed add/update/close/cancel and inherited writes use success-only invalidateSelectOnSuccess. No dedicated Job import found in the scoped DataImport inventory. Tenant topic lookup-jobs matches backend registration. | Finite successful bootstrap then bindReference('jobs'), selected jobId/current options getter, retained missing labels disabled, validators reevaluated silently. |
| Branch/GetSelect / BranchService | Existing cacheSelect=true; createBranch/updateBranch plus inherited delete invalidate on success. No dedicated Branch import found in the scoped inventory. Tenant topic lookup-branches matches backend registration. | Same binding for branchId; current working branch default now applied only after successful bootstrap finalization enables the pristine Create control, never from a watch refresh. Prior code called applyDefault while the control was still disabled. |
| Item/GetSelect / ItemService | Existing cacheSelect=true; typed create/update/remove and inherited writes invalidate on success. ImportItemService invalidates Item when savedRows>0, including partial saves; zero saved rows/failure do not evict. Tenant topic lookup-items matches backend registration. | Item binding retains labels only for currently selected line itemIds/current option rows, disables unavailable choices and revalidates each row without changing quantities, IDs or dirty state. |
| ItemIssue detail, approval, save, capacity/state validation | Direct operational reads/writes, excluded from reference cache. Type/financial/stock policy is unchanged. | No cached stock balance, eligibility or authority introduced. View uses returned historical names and skips edit-only lookups. |

All three bootstraps retain the exact typed envelope and source membership. Each finite read uses defaultIfEmpty(null); unsuccessful/empty-completion/malformed-array responses go to the same inline failure/Retry path before watches mount. Genuine empty arrays remain successful. Shared ReferenceLookupBindings binds each key once, merges selected labels with fresh source rows winning, and owns retained-value refresh errors/Retry. A cache hit and immediately mounted watch reuse the same exact URL/inline-feedback identity; no forced refresh, local replay, timers or copied arrays in browser storage.

Context reset sets contextInvalidated before cancelling detail/lookup/watch streams, clears all three option arrays plus details, disables the draft, hides old content and exposes the existing translated reopen message. Deferred discard/removal callbacks cannot mutate the invalidated form. Detail responses check context/visible/record identity. A pending write is not part of cancelReads and its old-context local success/error/restore is ignored; busy/finalize remains paired. The approval adapter receives null identity on reset to cancel its separate read and prevent post-write reload of the previous record; it remains mounted while its own pending write settles. Existing approval endpoints/effects are unchanged.

Loading: initial dialog bootstrap uses one ReferenceLookupStatus explicitly in dialog scope, mounted above both content panels. Retained-data watch refresh is silent; failures show its one Retry. Existing detail/save global counts remain paired with finalize/destruction, and the local detail indicator remains visible through the body-appended overlay. aria-busy includes bootstrap/watch-without-data, detail and save. Page route showPageLoading and shell host unchanged. Both translation vocabularies now name Job/Branch/Item load failures instead of omitting Branch. No new key.

### Source/query/index audit and verification

The reused luna_explorer (inherited model because mapped model is unavailable) was read-only and owned selector/writer/topic/query/index evidence; root owned all application edits. Sources confirmed: JobService.cacheSelect/add/update/close/cancel; BranchService typed/inherited writes; ItemService typed writes and ImportItemService savedRows invalidation; BaseService.invalidateSelectOnSuccess; ReferenceLookupCacheService.read/watch/topicFor; backend RealtimeServiceCollectionExtensions registrations and Program save/transaction interceptors. RealtimeCommitTracker publishes changed tenant-owned entities after successful implicit save or explicit commit, dropping rollback/failure. Reconnect/TTL and five-minute/64-entry/source isolation remain shared-owned; delivery/network behavior is unmeasured.

Backend selectors still use base controller GetSelectAsync → SelectAsync. Branch has a no-tracking Id/Name/No projection. Job/Item still inherit generic Repository.GetDropdownAsync, materializing all tenant/nondeleted entities before in-memory label derivation; no Includes, N+1 or recursive graph here. This cold-read efficiency opportunity is not a proven latency cause and is not changed by adopting consumer watches. No new index justified: predicates are tenant/nondeleted without search/order/join; existing Job tenant/status and tenant/estimation, Branch tenant/name, Item tenant/name/barcode were reviewed. Filtered IsDeleted=0 indexes do not establish coverage for historical null-delete flags. Deployed plans/SQL/timing remain pending; no schema change or migration.

The explorer also identified an existing parent list Job-filter gap: finite cached read only, without live watch/context clearing/page ReferenceLookupStatus. The current request follows Add Item Issue and this correction is confined to its editor; the list gap remains a separately scoped follow-up and no full-feature cache completion is claimed.

Final editor/guide TS and Angular template syntax parse passes; PrimeNG Select metadata documents optionDisabled, and final validation for all three controls returns valid=true with no issues (source https://primeng.dev/select; primeui://primeng/components/select.md). Existing styleClass on these three controls was replaced with the official example's native class binding; shared width remains unchanged. Complete scoped HTML/TS diff and exact guide/translation additions reviewed; git diff --check passed. These checks do not establish typecheck/build/runtime/visual success.

Guide updated bilingually in UserGuide/content/stock-guide.ts under existing /UserGuide/stock, sideMenu.stockGuide, STOCK_GUIDE reader and /ItemIssue topic, covering warm reopen, silent option changes, unavailable selections, Retry and reopen after context change. Tab steps and previous user content preserved. Changed files this combined task: ItemIssue details.ts/html, Item Issue guide purpose/steps, Item Issue lookup-error strings in both vocabularies, this review. No shared owner source, backend, DTO, AutoMapper, quantity/calculation or permission change. Existing canonical UI2/22/28 and skill rules already cover this adoption; no new reusable contract or packet edit is required. Generator -Check remains part of final handoff.

Owner checks: repeat Add open/close with valid warm cache and verify zero selector HTTP; initial cold load/failure/Retry/empty/malformed envelopes; remote/local source edit or TTL refresh while a draft is dirty; unavailable selected IDs retain labels but cannot save; context reset during pending detail/bootstrap/confirmation/save/approval; corrected default source branch; Basic/Items preserve inputs and validation targets; saved Approvals and Close safety; EN/AR, RTL/LTR, light/dark and short/narrow windows. Compare5 cold/warm opens with identical build/network/tenant/data and separate request, SQL, payload and render timings. No speed, realtime delivery or runtime acceptance claim.

Suggested frontend commit: `refactor(stock): add issue tabs and active reference-cache bindings`. No backend commit or migration. No builds, tests, lint, browser/app/network/database execution, migrations, commits, pushes or deployments. Root froze/integrated/reconciled; the read-only agent reduced independent producer-audit time without file overlap.

Final context-lifetime audit additionally corrected the approval adapter's null-identity cleanup: changing issueId closes its pending cancellation-reason presentation and reports current busy state, while any already sent write remains subscribed and owns saving/finalize. Without this, clearing approval data could hide the reason dialog while cancelOpen kept the parent permanently blocked after a failed write. This adds approval-cycle.component.ts to the scoped files; its complete two-line diff was reviewed. The deferred discard factory also rechecks contextInvalidated immediately before opening a confirmation, covering a reset between creation and subscription. Existing UI28 independent-write/deferred-action rules own both corrections; no new shared API or business decision.

