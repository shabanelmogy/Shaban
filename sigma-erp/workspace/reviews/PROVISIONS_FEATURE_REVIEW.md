# Provisions — implementation and reconciliation

| Item | Value |
|---|---|
| Status | Implemented — source conformance reconciled; owner execution pending |
| Owner verification pending | yes |
| Date | 2026-10-25 |
| Final reconciliation | 2026-10-26 |
| Scope | First Provisions item `/Provision` |

## Decisions and evidence

Plan: `PROVISIONS_MAINTENANCE_EVOLUTION_PLAN.md`; handoff: `PROVISIONS_DOMAIN_API_CONTRACT_FREEZE.md`. User supplied three first-screen images and a second Monthly Posting image, selected monthly amounts/first due date from entry date, then explicitly requested implementation. The separate second screen demonstrates preparation followed by posting; this slice saves definitions and schedules without posting. Monthly Posting implementation and financial lifecycle remain a follow-up.

Use UI screen02 (routed editor due to debit/credit totals), Job list/editor reference and BE14 (master/details without save-time financial effect). First-screen screenshot modal appearance does not override the canonical routed-editor rule. Extend existing Provision owner, not a duplicate feature. No approval/void/stock/conversion workflow is introduced. No permissions are invented. Authorization candidates for future policy: POST/PUT/DELETE `/Provision`; posting belongs future Monthly Posting.

## Screenshot evidence and column contract

All supplied screenshots are English/LTR desktop captures; role, source version and capture date are Unknown. They demonstrate functional content, not current Sigma presentation. Visible business data is example data, never a default record or hard-coded amount.

| Provisions1.PNG evidence | Classification | Owner / implementation |
|---|---|---|
| Number/date range/title/completion/contact filters | Explicit | Phase2 typed applied filters and server query |
| Actions View/Transactions/Delete, Create | Explicit | Phase3 routed View/Create; Phase4 guarded Delete; shared read Transactions |
| Number, date, title, day, month count, completion columns | Explicit | Phase2 lean typed server grid; no invented contact column |

| Provisions2.PNG evidence | Classification | Owner / implementation |
|---|---|---|
| Voucher type, entry date/title, day/months, first/last date | Explicit | Phase3 inputs, backend-derived first/last; canonical routed editor |
| Account/sub lookup/job/description/debit/credit, add/remove, totals | Explicit | Owned full snapshot, real posting-account lookup, typed contact as separate optional relationship to support demonstrated contact reads |
| Save, Save and Print, Cancel | Explicit | Save definition without journal; saved-record print; dirty discard |

| Provisions3.PNG evidence | Classification | Owner / implementation |
|---|---|---|
| Number/title identify Transactions dialog | Explicit | Shared DocumentJournal title/subtitle |
| Date/voucher/account/contact/description/debit/credit and totals | Explicit | Actual linked posted journal lines, no synthesized template movements |

| Capture.PNG evidence | Classification | Owner / implementation |
|---|---|---|
| Month/Prepare/Export/Post, due date/amount/posted state | Explicit | Second screen evidence only; future Monthly Posting writer |
| Definition Save and period Post are separate operations | Strong inference, accepted in implementation scope | First screen has no save-time accounting effect; repeat each month's input amount |

| Grid label | Angular field / ListVM property | Display | Filter / sort / Excel |
|---|---|---|---|
| Actions | id / Id; canEdit,canDelete / CanEdit,CanDelete | Shared ActionList menu | Actions not filterable or exported |
| Provision No | no / No | Stored number | Text / stored sort / yes |
| Entry Date | entryDate / EntryDate | Shared calendar-date formatter | Date / stored sort / yes |
| Title | title / Title | Link to View | Text / stored sort / yes |
| Day Of Month | dayOfMonth / DayOfMonth | 0 translated end-of-month; other integer | Numeric raw value / stored sort / yes |
| No Of Months | numberOfMonths / NumberOfMonths | Integer | Numeric / stored sort / yes |
| Is Completed | isCompleted / IsCompleted | Yes, No or legacy Unknown | Stable boolean and explicit No value grid choices / no sort / yes |

Stored field bindings are Confirmed; completion is Derived from occurrence/journal evidence, with Unknown retained when evidence is absent. Removed list-only excess: voucherSubType,firstDate,lastDate,createdBy,createdAt,provisionDetails and loose displayActive/displayDeleted aliases. Detail keeps the header dates/type and owned lines because its editor consumes them. No client-owned document number/tenant/audit/derived state was introduced.

## Source-conformance reconciliation

| Concern | Producer → consumer evidence | Status |
|---|---|---|
| Route | pages/routing.ts existing `/Provision` imports Provision_Routes; list/create/view/edit and legacy details redirect; explicit showPageLoading=true | Source wired |
| Grid | Angular `ProvisionDTO`: id,no,entryDate,title,dayOfMonth,numberOfMonths,isCompleted,canEdit,canDelete. Rendered Actions then no/date/title/day/month-count/completion; matching `ProvisionListVM` SQL projection, no child DTOs or synthetic display aliases | Source reconciled |
| Filters/page | list `readFilters` → typed service `getList` → `toListParams`; applied snapshot separate from draft; `withGridFilters` → backend projected grid filters and completion/contact/date predicates before count/page; same applied query for full Excel | Source reconciled |
| Return state | readListRoute/writeListRoute with applied no/title/dateFrom/dateTo/contactId/grid/sort/page; completion false serialized as string so shared URL helper does not drop it; allDates distinguishes clear from current-month default | Source wired |
| Look and scroll | FeatureTitle inside sigma-list-panel; shared FilterPanel/DataTable fill; sigma-list-table; routed editor shared shell/FormSection/EditableCollectionTable/EditableRows; header and lines each have one bounded scroll owner, fixed footer; print releases geometry; no local palette | Source reconciled; visual acceptance pending |
| Transactions | ProvisionService.getTransactions → GET /Provision/{id}/Transactions → scoped live posted/non-void JV lines from distinct retained legacy/occurrence links → shared DocumentJournal; per-record subtitle number/title; local error/Retry/cancel and shared totals | Source reconciled |
| Guide | PROVISIONS_TOPIC replaces existing generic /Provision topic in RECORD_LIST_TOPICS; INVOICE_GUIDE and filtered VOUCHER_GROUP_GUIDES inherit topic; existing sidebar `/UserGuide/vouchers-journals` | Source wired |

## Cache source inventory and final adoption evidence

| Actual URL / service | Classification / source owner | Writers and tenant notification evidence | Consumer lifetime |
|---|---|---|---|
| Customer/GetSelect / CustomerService | Approved cached reference; BaseService.cacheSelect=true | CompanyPartnerService and IndividualPartnerService `selectCacheDependencies=['Customer']`, typed writes invalidateSelectOnSuccess; import services invalidate Customer after positive savedRows; backend lookup-customers topic tracks Company/IndividualPartner | List loadLookups finite successful forkJoin then bindContacts once; selected contact getter and current options; ReferenceLookupBindings clears context; error/Retry, teardown |
| Supplier/GetSelect / SupplierService | Approved cached reference; cacheSelect=true | typed/inherited supplier writes invalidateSelectOnSuccess, dependencies ContactGroup; backend lookup-suppliers tracks Supplier | List and editable editor finite bootstrap then once-bound ReferenceLookupBindings; selected contact IDs/current options, context clear, failure/Retry, DestroyRef teardown |
| Job/GetSelect / JobService | Approved cached reference; cacheSelect=true | own typed/inherited mutations use existing success invalidation; lookup-jobs topic tracks Job | Editor finite bootstrap, separate shared binding, selected line job IDs/current options, context clear, failure/Retry and teardown |
| Account/PostingSelect?usage=0 / AccountService.getPostingSelect | Direct operational posting eligibility; source has no reference opt-in for this endpoint | Account source owns current posting predicate; no new cache | Editor local bootstrap/Retry; retain saved account labels; writer rechecks account eligibility |
| Currency/GetFinancialNumberPolicy / FinancialNumberPolicyService.load | Direct financial policy exception; no reference watch | Source invalidation by existing currency mutations; direct forced Retry with inline feedback | Editor readiness and monetary scale; no new policy cache or draft recalculation from lookup updates |
| Provision list/detail/Transactions | Direct operational | feature mutations refresh current applied list; no cacheSelect opt-in | switchMap/defer/takeUntilDestroyed or shared per-record dialog read |

Source owners inspected: BaseService finite read/watch/success-only invalidation; ReferenceLookupCacheService.topicFor, session scope clearing, root RealtimeService watch; RealtimeServiceCollectionExtensions topics. No source owners were changed for this feature. Network, tenant-switch, TTL/visibility and failure behavior still require owner runtime acceptance.

## Loading request/visibility evidence

| Request / trigger | Visible owner | Start/release/cancellation | Busy/error/Retry |
|---|---|---|---|
| List search/paging/Retry | Global shell | ProvisionsComponent.requests switchMap → subscribed defer startLoading → inner finalize endLoading, takeUntilDestroyed; replacement cancels prior | loadingList aria-busy; DataTable showLoadingIndicator=false; inline error and Retry |
| Full Excel read | Global shell | defer start, fetchAllPages all-or-fail, finalize release/destroy | exporting prevents duplicate actions; composedReadErrorMessage; no partial export |
| Delete | Global shell after confirmation | shared confirmDelete → switchMap subscribed write defer → finalize release; outer busy/form freeze finalized | server action flag + recheck; one global success toast; HTTP/false-envelope inline feedback, retained row |
| Detail/save | Global shell | Editor subscribed defer startLoading/finalize endLoading; routeVersion identity fence, prior read unsubscribe and DestroyRef teardown | draft retained on failure, detail Retry, save freeze and busy navigation guard; button spinner suppressed by shared owner |
| Lookup bootstrap | Local shared ReferenceLookupStatus | finite forkJoin; independent of page list; teardown; retained refresh stays silent | failure/Retry and existing source watch state |
| Transactions dialog | Local shared StateMessage | DocumentJournal owns version/request cancellation and reading finalize; body overlay would hide shell | sole indicator, table spinner suppressed; Retry and close |

Rendered global host: LayoutComponent.showPageLoading checks leaf page metadata, layout.component.html renders sigma-shell__loading / StateMessage from LoadingService.isLoading$. LoadingService compares parsed UrlTree root identity: same-path query/fragment changes preserve pending work; actual departure resets. No global owner or route loading implementation was changed. Runtime visibility/overlap and pending write navigation remain owner verification.

## Load-speed, query and index evidence

Before: old list requested generic unpaged rows and changed a local pager without new server reads; legacy ListVM included editor dates and child details. Editor used Customer IDs as account choices, serialized tenant/audit inputs and had manual loading release without error/finalize. New source uses actual server paging/count, lean grid, shared full-result export and cancelled replacement reads. This is correctness/query-shape evidence, not measured acceleration.

Owner measurement protocol: same tenant and unchanged dataset, record total/live definitions, occurrence count per definition, line count and index state; compare cold first navigation and five warm searches with identical date/title/contact/completion filters and page sizes15/100. Separate route chunks, HTTP duration/payload, SQL command count/elapsed/IO/plan and response-to-render. Repeat with empty result, final page, completed/unknown history, 1000+ definitions and full Excel. Record medians and slow sample; no timing claims from source-call counts. No benchmark, browser, build or DB execution authorized here.

Backend source inventory:

| Operation | Query / response boundary | Disposition |
|---|---|---|
| List | Service.ListQuery tenant/live scope; generic no/title contains, direct date range, contact exists and projected completion; shared grid projection before CountAsync; ordered Skip/Take then lean MaterializeListAsync | Two explicit SQL reads (count + page), no per-row HTTP or materialized navigation graphs. Correlated occurrence/history predicates remain SQL work, not free operations. Date comparisons use inclusive start/exclusive following day, preserving end-of-day values without casting the indexed column; year9999 handled without overflow. |
| Excel | fetchAllPages sequential complete pages of100, same query/grid/sort; each page currently repeats count | Bounded responses, all-or-fail export. Repeated counts and total export memory remain a documented tradeoff of the approved shared helper, not a measured speed improvement. |
| Detail | One AsNoTracking projected aggregate, live tenant-owned child lines, authoritative sums/state/labels | EF may split collection materialization depending on configured execution; exact generated SQL/plan remains pending. No service per-line reference query. |
| Transactions | One header + retained occurrence-ID projection, optional second scoped JV-detail/JV join for distinct linked IDs | Empty link set returns empty success. Posted/non-void/live journal reads only; no synthesized template entries. |
| Create/update | Shared tenant/entity application lock; financial policy resolver; batched distinct posting-account count, allowed contact count, job existence; update additionally one tracked aggregate and shared save | Sequential on one DbContext. References checked in sets, no parallel EF. Numbering/audit pipeline traced through Repository.AddAsync, UnitOfWork.PrepareAddedNumbersAsync and DbContext.SaveChanges: root keeps CodeCreateService authority; new internal child rows get GUID-based internal numbers to avoid hidden per-child sequence reads. No new document numbering policy. |
| Delete | Tracked aggregate + shared dependency check (excluding owned children), then one soft-delete save | Lease/history/ownership guards rechecked under same application lock. Actual dependency-query count depends on shared EF metadata; no invented fixed count. |

Existing source index coverage: current snapshot has Provision PK(Id), FK indexes JournalVoucherId/LeaseAgreementId; ProvisionDetail PK(Id), AccountId/JobId/ProvisionId FK indexes, no tenant/date list composite or contact composite. Title remains nvarchar(200), amounts decimal(18,2), legacy nullable ProvisionId/AccountId remain nullable. Snapshot inspected only; it was already modified by unrelated work and is not changed in this task.

| Index | Exact proposal / coverage | Benefit, cost, overlap and verification |
|---|---|---|
| Occurrence identity | New EF unique `(SubscriptionId, ProvisionId, DueDate)`, unfiltered; FK indexes by EF conventions | Required invariant, reserves a date even after soft deletion and supports tenant/parent schedule probes. Edit revives an unlinked retained date rather than inserting a duplicate. Write/storage cost one composite unique B-tree; does not replace the parent-only FK index for all parent access. Owner-generated migration and actual duplicate/plan validation pending. |
| List dates | Optional future `(SubscriptionId, EntryDate, Id)` filtered `[IsDeleted] = 0`, INCLUDE `(Title, DayOfMonth, NumberOfMonths, JournalVoucherId, LeaseAgreementId)` | Candidate for the default tenant/date-range query; not a universal title/number contains or arbitrary-sort index. No current composite overlap in inspected snapshot; PK/FKs still serve other paths. Added storage/write overhead; No is unbounded and deliberately excluded from INCLUDE. Compare actual logical reads/estimated+actual rows/plan and common date-selectivity first. Proposal only, not added to EF. |
| Contact lines | Optional future `(SubscriptionId, PartnerId, ProvisionId)` INCLUDE `(IsDeleted)` | Candidate for contact-selective definition-line existence. Compare against existing ProvisionId FK index and new conventional PartnerId FK coverage; add only if plans show benefit. Extra write/storage cost and overlap may outweigh benefit on small tables. Unfiltered includes legacy null deletion state. Historical JV contact branch needs its own measured plan, not another speculative index. Proposal only. |

No other performance indexes added. Completion is deliberately derived from retained occurrence/JV facts; no state cache or stale persisted completion flag. Large month counts are bounded by the supported calendar before allocating occurrences; no arbitrary new business maximum. Root list completion and grid completion share the same expression so Unknown does not accidentally match No. Tenant predicates cover consumed child/navigation labels, totals and history; inconsistent cross-tenant children disable mutation and fail backend writes.

## Verification and handoff

Final source parsing: 13 feature/vocabulary/guide files checked with TypeScript createSourceFile and Angular parseTemplate; no syntax diagnostics or unresolved local/src imports. Both provision vocabularies contain71 leaves; all literal feature translation uses resolve. Installed PrimeNG Select/InputNumber declarations support used ariaLabel inputs; shared SummaryCard accepts the used accents. Both backend resource XML files parse and have11 unique Provision keys. Scoped git diff --check passes; only repository CRLF normalization warnings. These are syntax/source checks, not a typecheck, build or test.

Scoped source/diffs reviewed separately in SiGmaAngularFrontEnd and SigmaBackend, including new untracked feature files. Shared vocab/guide/resource files contain unrelated preexisting edits; only provision additions belong to this task and no cleanup/revert was performed. New/moved .NET types have matching namespace/global imports and SDK source inclusion; Business references Helpers/DataAccess/ViewModels, and FinancialNumberPolicyResolver registration already exists. Exposed controller read paths all use feature projections; redundant reverse/duplicate maps were removed. Aggregate Add uses one-way mapping; Update ignores only the manually reconciled child collections. Inherited list/detail projection bypass methods are not called by this feature. Build/SQL translation remain pending.

Recipe drift checks before use and final handoff: all8 packets OK; no canonical/template changes, so no generation required. No reusable shared owner changed in this task; no new skill-only rule or pending promotion.

| Phase / decision | Final disposition |
|---|---|
| Plan, Phase0/1 | Frozen plan/API and screenshot evidence retained; existing Provision extended. No first-screen material decision remains unresolved. |
| Phase2 | List/filter/grid/count/page/applied return state, all-page Excel implemented; exact columns and ListVM paired above. |
| Phase3 | Typed create/edit/view and complete saved print; monthly amounts, backend first/last dates and owned snapshot reconciliation. Shared scalar/date/financial controls and validation; zero end-of-month semantics and shorter-month clamp. |
| Phase4 | Only confirmed first-screen delete: shared confirmation, lease/journal history/tenant/dependency guards and soft-delete children+parent. No posting/approval/void action implemented. |
| Phase5/6 | Existing route imports and root auth/interceptors reused, guide registered, cache/loading/source contracts reconciled. Query-only accepted discard restores current form and clears navigation approval on navigation completion/cancellation; write guards remain independent. |
| Financial effect | Saving never creates/updates/posts a JV. Completion derives from every live scheduled occurrence having a live posted non-void same-tenant JV and matching month count; no schedule evidence stays Unknown. Stored first/last dates authoritative; client preview omitted from writes. |
| Shared extraction | Existing owners cover required behavior: FilterPanel, DataTable, FeatureTitle, EditableRows/CollectionTable, FormSection, ReferenceLookupBindings/Status, DocumentJournal, ConfirmationDialog, ReportPrintSession. No competing wrapper/palette introduced. |
| Authorization | Existing authentication retained. No permission API invented; hidden actions are convenience, backend state/ownership guards are authority. |

Changed frontend files: existing Provision components/details and list, models/create/details/list, removed unused models/grid-row, provision.routes and service; new vocabs/provisions and UserGuide/content/provisions-topic; minimal registration in existing en/ar and record-list-topics. No route/provider/shared-owner or explicit tsconfig-root changes needed: current lazy routes reach the standalone components transitively.

Changed backend files: IProvisionService, ProvisionService, new ProvisionLineInput; Provision/ProvisionDetail profilers; Provision/ProvisionDetail entities plus new ProvisionOccurrence; Provision/ProvisionDetail configurations plus new ProvisionOccurrenceConfig; Provision controller, Add/Update/Detail/List VMs and line Add/Update/Detail VMs; eleven messages in each GeneralMessage resource. No migration, snapshot or DbContext edit by this task. Sealed configuration is discovered by existing ApplyConfigurationsFromAssembly.

Schema migration REQUIRED. Suggested owner Package Manager Console command (not executed):

```powershell
Add-Migration AddProvisionScheduleAndContacts
```

The proposed name has no existing match in the inspected migration folder. Review generated changes for the new occurrence table, unique tenant/provision/due-date index, JV/parent foreign keys, optional ProvisionDetail.PartnerId/contact FK and explicit relationship delete behavior. Existing shadow nullable ProvisionId becomes explicit without narrowing the column; AccountId and historical text remain nullable/unrestricted as before, title200 and amount18,2 preserved. Review existing null/orphan data and unrelated pending schema changes when generating. No automatic history backfill or journal linking is attempted. Apply only after the owner's normal migration review. Until this schema exists, the new read/write projections cannot run successfully against the old database.

Owner execution checks:

1. Build frontend/backend after reviewing the migration; confirm endpoint binding, AutoMapper/DI and EF projection translation against the actual SQL Server provider.
2. Create balanced two-line definitions with optional contact/job; verify tenant/audit/number authority, per-month amounts and no JV creation. Reject both-sided/zero/negative/nonfinite/out-of-scale money, wrong tenant/inactive posting account, bad references, duplicate/foreign child IDs and invalid schedule.
3. Check day0, 29/30/31, leap February, chosen day before/at/after entry date, multi-year/calendar overflow; compare persisted first/last to preview. Edit months/day repeatedly and return to an earlier removed due date; verify one retained occurrence per date.
4. Search Yes/No/Unknown, contact across definition/history, all dates and combined column filters; verify count/page/sort/last-page delete, query return state (including false), and all-pages Excel. Confirm edited filter drafts do not silently affect paging/export.
5. Inspect legacy lease-owned and JV-linked records: read/print/Transactions work, editing/deleting denied; empty new definitions have no movements. Cross-tenant child corruption must not expose names or allow mutation. Future posting must use the same lock and history invariants.
6. Exercise HTTP/envelope failures, lookup refresh/context clearing/Retry, selected labels, dirty discard (including accepted query-only or cancelled navigation), double save/delete, active-read replacement and teardown. Verify one visible loader per operation, both themes, Arabic/English, narrow viewport and long-print overflow.
7. Run the comparable timing/query/plan protocol above and record actual results before claiming speed. No timings, SQL IO/plans, browser rendering or compilation were measured here.

Guide handoff: `src/app/modules/UserGuide/content/provisions-topic.ts` is registered through RECORD_LIST_TOPICS → INVOICE_GUIDE/VOUCHER_GROUP_GUIDES; existing module guide/menu `/UserGuide/vouchers-journals`. Covers search/reset/Excel, schedule, monthly amounts/balance, save/view/edit/delete, Transactions, saved print, errors/Retry, legacy restrictions and separate posting. Source registration verified; rendered guide acceptance pending.

Suggested commits (suggestions only):

- Frontend: `feat(provisions): implement typed provision workspace and user guide`
- Backend: `feat(provisions): validate monthly definitions and persist due schedules`

Possible compile/runtime risks are limited by source-only verification: Angular template types, actual EF translation and generated schema/legacy data need owner execution. Future Monthly Posting is deliberately not declared complete: journal writer/idempotency, periods/approval/void policy and journal-source integration must be frozen and implemented there. No build/test/lint/browser/database/migration/commit/push/deployment command run.

Agents: sol_worker_backend and sol_worker_editor initially received non-overlapping bounded ownership after freeze; resumed as backend_finish and editor_finish after conversation continuation, using gpt-5.6-sol. Root owns list/models/services/routes/vocab/guide/integration and overall final review. Independent backend/editor work reduces wall time without overlapping files. Historical lease writer remains outside first-screen ownership; no new occurrence/JV writer is exposed there by this slice. Future Monthly Posting must integrate lease compatibility, journal source guards, locks and period/approval/undo policy explicitly.

## متابعة خطأ الاستيراد — ٢٠٢٦/١٠/٢٦

أُضيف الاستيراد المحلي لقاعدة الكيان في خدمة المخصصات لإصلاح رسالة النوع غير المعروف في ترقيم الحركة الداخلي. تعريف القاعدة موجود في مشروع المساعدات، لكن استيراده العام لا يمتد إلى مشروع الأعمال. التغيير سطر استيراد فقط؛ لا تعديل للترقيم أو الحساب أو التخزين. نجح فحص الفروق المصدرية والمسافات، والتحقق بالبناء باقٍ عند المالك. تفاصيل قائمة الأخطاء المشتركة وأدلة المراجع القديمة في متابعة [مراجعة الاستحقاقات](ACCRUALS_FULL_STACK_REVIEW.md).

## متابعة تجميع القائمة — ٢٠٢٦/١٠/٢٦

طلب المالك جمع تعريفات المخصصات والترحيل الشهري في قائمة واحدة باسم مفرد للمخصص. أُنشئت مجموعة فرعية داخل القيود والتسويات، باسم «Provision» بالإنجليزية و«المخصصات» بالعربية من المفتاح الموجود؛ وتحتها الرابطان الحاليان بتسميتيهما ومساريهما دون إنشاء مسار أو أثر مالي. حدّث مالك الاختصارات تحويل هوية المجموعة القديمة إلى موقعها الجديد؛ تظل هويات اختصارات الرابطين مستقلة وثابتة. أُحدّث موضوع المخصصات في دليل السندات والقيود باللغتين لتوضيح مكانهما.

إصلاح صغير للبيانات المعلنة للقائمة وفق الواجهة١ و٢٣ والهيكل المشترك الحالي، دون مكونات أو تنسيق خاص أو تغيير واجهات الخادم. فُحص عقد عنصر القائمة وفهرسة المجموعات والمسارات والترجمة ومخطط الشجرة مصدريًا، مع المحافظة على التغييرات السابقة. لا طلبات أو كاش أو تحميل أو استعلامات أو فهارس جديدة؛ بوابات الأداء والتحميل والكاش السابقة لا تتغير. رابط الترحيل الشهري يظل الرابط السابق لمسار لاحق؛ تنظيم القائمة لا يعلن اكتمال تنفيذه. جرى فحص الصياغة والفروق والمسافات وتطابق المجموعة والترجمات؛ البناء والتشغيل والتحقق من الفتح والتحديد والاختصارات عند المالك. حزم التنفيذ الثماني متسقة، ولم تُشغّل أوامر محظورة أو وكلاء فرعيون لصغر المهمة. اقتراح رسالة حفظ دون تنفيذ: `fix(navigation): group provision and monthly posting entries`.

## متابعة مؤشر الخيارات — ٢٠٢٦/١٠/٢٦

طلب المالك صراحة إزالة تحميل الخيارات الزائد من شاشة المخصصات. أُزيل ربط الحالة المرئية من مكوّن حالة الخيارات المشترك في قالب القائمة وقالب المحرر؛ قيمته الافتراضية خطأ، فيظل عرض الخطأ وإعادة المحاولة كما هو. هذه سياسة عرض صامتة للخيارات في هذه الشاشة بتفويض المالك، وليست قاعدة عامة أو تغييرًا للمكوّن المشترك. لم تُحذف حالة تحميل الخيارات الداخلية أو قراءة المصادر أو اشتراكات الكاش، ولا تعطيل المحرر وحاجز الحفظ حتى اكتمال الخيارات.

المسار الفعلي من قائمة المخصصات إلى مساراتها ثم مكوّني القائمة والتفاصيل؛ القراءات الأساسية والحفظ والتصدير تستمر بمالك التحميل العام وإعداد المسار الصريح. خيارات العملاء والموردين وأوامر العمل تظل بمصدرها المرجعي ومراقبتها وتهيئتها وحفظ الاختيارات؛ الحسابات والسياسة المالية تظلان مباشرتين للأهلية والدقة. لا طلب أو استعلام أو فهرس أو مخطط جديد، ولا قياس سرعة مستنتج من إخفاء المؤشر. التغيير الصغير يستهلك مدخلي الخطأ وإعادة المحاولة الحقيقيين للمكوّن المشترك وفق الواجهة٢ و٢٢، وقرار المالك هو الاستثناء المرئي المحدد.

حُدّث موضوع دليل المخصصات باللغتين في دليل السندات والقيود لشرح تجهيز الخيارات دون رسالة تحميل إضافية وإعادة المحاولة عند الفشل. فُحصت صياغة القالبين وموضوع الدليل والفروق والمسافات؛ حُفظت التعديلات السابقة، والحزم الثماني متسقة. التحقق البصري عند الفتح والإنشاء والتعديل وفشل الخيارات وإعادة المحاولة معلق عند المالك. لا بناء أو اختبارات أو متصفح أو قاعدة بيانات أو ترحيل أو التزام؛ لا وكلاء فرعيون لصغر التعديل وترابطه. اقتراح حفظ دون تنفيذ: `fix(provisions): suppress additional option loading messages`.

## تشخيص رابط الترحيل الشهري — ٢٠٢٦/١٠/٢٦

أبلغ المالك عن خطأ عند فتح صفحة الترحيل الشهري. السبب المؤكد مصدريًا: عنصر القائمة يشير إلى مسار الترحيل الشهري، ولا يوجد له تعريف في شجرة المسارات الفعلية أو مكوّن أو خدمة للصفحة. يلتقطه المسار العام الأخير ويوجهه إلى صفحة عدم العثور. هذا نقص تنفيذ، وليس فشل طلب بيانات من صفحة منفذة. مكوّن تفاصيل بنود المخصصات القديم ليس صفحة تجهيز وترحيل، فلا يصح ربطه بدل الصفحة الناقصة.

عقد المخصصات المجمد وخطته يؤجلان صراحة تجهيز الشهر وكاتبه المالي؛ واجهة المخصصات الحالية توفر التعريف والجدول وقراءة الحركات فقط. جدول المواعيد يملك تاريخ الاستحقاق ورابط قيد اختياريًا مع فهرس فريد للمخصص والتاريخ، لكن لا قارئ شهري أو كاتب ترحيل أو دورة دفعة منفذة. الحالات والأثر المالي والاعتماد والحماية من التكرار وحدود الفترات والتوافق التاريخي تستهلك عقدًا جديدًا، ولا تُنشأ بملء رابط القائمة. لا يُستبدل الخطأ بتحويل إلى شاشة مختلفة أو صفحة توحي بأن الترحيل متاح.

حالة الجزء المتأثر: محجوب لحين قرار المالك حول النطاق المالي. طُرح اختيار تجهيز الشهر وإنشاء مسودات قيود ثم اعتمادها للترحيل، مقابل كشف شهري للعرض فقط. حدود المصدر الحالية والعقد المؤجل يفسران الحاجة للقرار وفق كتلة الدليل الرئيسي٢ الخاصة بالأثر المحاسبي وكتلة٤ الخاصة بالقرارات المفقودة؛ لا موافقة إضافية مطلوبة لإصلاح تقني قائم، لكن الوظيفة هنا غير موجودة أصلًا. بعد القرار تُجمّد خطة وعقود هذا المسار قبل التنفيذ. لا تعديل مصدر في جولة التشخيص، ولا بناء أو اختبارات أو قاعدة بيانات أو متصفح أو ترحيل، والحزم الثماني متسقة. لا وكلاء فرعيون لعدم وجود عقد مشترك محسوم أو مسارات تنفيذ مستقلة بعد.

## استكمال قرار الترحيل الشهري — ٢٠٢٦/١٠/٢٦

أجاب المالك عن سؤال النطاق المالي بصورة صفحة الترحيل الشهري التي تتضمن التجهيز والتصدير وزر الترحيل وحالة الترحيل. جُمّد هذا المسار في الخطة والعقد المستقلين، ثم نُفذ في المصدر؛ وبذلك انتهى تأجيل الصفحة المذكور أعلاه لهذا النطاق فقط. يبقى حفظ تعريف المخصص دون أثر محاسبي، وتُمنع الجداول المملوكة لعقود الإيجار أو المرتبطة بقيد قديم على رأس التعريف من الترحيل بهذه الصفحة. راجع [عقد الترحيل الشهري](MONTHLY_POSTING_DOMAIN_API_CONTRACT_FREEZE.md) و[مطابقة التنفيذ](MONTHLY_POSTING_FULL_STACK_REVIEW.md) للحالة الحالية؛ تظل الفقرات السابقة سجلًا لحدود التنفيذ وقت كتابتها. البناء والتشغيل وقاعدة البيانات والقياس عند المالك.
