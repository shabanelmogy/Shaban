| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-26 |
| Scope | Missing /MonthlyPosting workspace, bounded read and explicit occurrence Post |
| Contracts | MONTHLY_POSTING_MAINTENANCE_EVOLUTION_PLAN.md; MONTHLY_POSTING_DOMAIN_API_CONTRACT_FREEZE.md |

# Monthly Posting — implementation and reconciliation

## Manifest, evidence and decisions

Owner first reported the page error; discovery traced the existing sidebar
link to no active route and the wildcard404. The earlier Provisions handoff
explicitly deferred this page. After the posting-versus-report clarification,
the owner supplied MonthlyPosting.png with Prepare/Excel/Post and posted-state
columns. This resolves that affected decision in favor of explicit financial
Post, superseding the deferral without changing definition Save.

| Evidence | Classification | Contract consequence |
|---|---|---|
| Month, Prepare and Excel | Explicit content/workflow | Current-month input, explicit prepare, complete snapshot export |
| ProvisionNo,Title,FirstDate,LastDate,DueDate,Amount,Posted? | Explicit columns | Same seven columns in typed row/grid/export, plus identity and issue data |
| Post after preparation | Explicit action in the answer to the financial decision | Final shared confirmation; revalidate and post due saved occurrences atomically |
| One sample amount60000 | Sample only | Never seed sample data; server sums actual monthly template debit |
| Whitespace/colors/table appearance | Not design authority | Canonical shared shell/filter/table/button/status owners |
| Hidden legacy/currency/branch/idempotence rules | Derived from source/owning financial guard | Saved occurrences only; base currency; no guessed branch; period/reference validation and source links |

UI: bounded operational financial workspace with one domain action; shared
Job filter/table contracts and OpeningBalances workspace shell. Backend: BE17
read model plus BE15/18 action on existing scheduled aggregate, not generic CRUD
or a new financial batch entity. Reference roles were read before editing;
no reference module is modified. The ordinary document Save rule is not bypassed:
this screen does not save an editable document. Post is the explicit approval
of existing prepared occurrences and generated source-owned journals.

## Grid, filters and write/action handoff

Grid/row match: provisionNo,title,firstDate,lastDate,dueDate,amount,posted;
minimum occurrenceId/provisionId identity and journalNo/issue state. Dates are
saved calendar dates; amount is server-owned nullable money. Extra issue column
explains blockers without guessing a value. Display/export keep the shared
money/date/status contracts. Local paging applies to the complete bounded array,
not a second backend page; Post consumes the full prepared month's snapshot.

Month control parses to strict yyyy-MM. Reset returns current month and clears
the snapshot. Prepare is a direct authenticated read; no automatic initial fetch.
No detail editor/upload/delete/void/unpost/approval-settings endpoint is created.
POST accepts only month and opaque preview key, with server ownership of every
amount, account, date, state, tenant and journal number. Write-time re-preparation
and the frozen locks/outer transaction prevent duplicate and partial posting.

## Final conformance (completed by root before handoff)

| Concern | Owner / consumer | Reconciliation |
|---|---|---|
| Actual route | sidebar → pages/routing → MONTHLY_POSTING_ROUTES → workspace | Matched; lazy route precedes wildcard, authenticated parent retained, route host fills shared shell |
| Typed response/write | DTO/interface/controller ↔ Angular models/service | Matched properties and URLs; authenticated dedicated controller, SDK source inclusion and existing scoped interface scan |
| Shared presentation | FeatureTitle/FilterPanel/DataTable/PrimaryActionButton/StateMessage | Matched actual public contracts; stable labelled inline actions, month/date validator, complete-array grid, shared summaries and confirmation |
| Post/confirmation/recovery | prepared source → shared confirmation → locked writer → reload | Matched; month/count confirmation, full-source fingerprint, all-posted no-op, atomic writer; success re-prepares, uncertain delivery clears snapshot and Retry only reads |
| Journal ownership/navigation | occurrence FK → general JV reference guard and report source code18 | Implemented retained-reference guard including deleted history and tenant-checked provision navigation; duplicate provenance remains ambiguous and blocks posting |
| Guide/vocabulary | new bilingual topic/vocabulary → existing registration/readers | Registered both locales and topic, updated provision/module wording and narrow compilation entry |
| Financial source integrity | saved occurrence/template → source validation → resolver | Batched references, foreign live child counts, balanced one-sided positive lines, real month/schedule/money bounds; root-JV and lease-owned schedules explicitly blocked |
| Retained history | occurrence link → retained journal/header/lines/approval | Effective posted state established before current template/reference policy checks; invalid current source still blocks writes, proven retained amount is not recalculated from a changed template |
| Writer coordination | Existing Provision Add/Update/Delete and unsupported activation | Existing writers acquire the Provision lock; existing activation returns unsupported operation. Final scoped review removed a redundant proposed override and preserved that contract |

## Loading, cache, performance and indices

| Consumer URL / symbol | Cache disposition | Lifecycle and visible owner |
|---|---|---|
| GET /MonthlyPosting/prepare; MonthlyPostingService.prepare | Direct operational financial snapshot, no source cache opt-in | Workspace.prepare: defer subscribed startLoading, inner finalize release, cancelRead/version/context fence and takeUntilDestroyed; global shell only |
| POST /MonthlyPosting/post; MonthlyPostingService.post | Direct financial mutation; never cached or automatically retried | Workspace.postPreview: defer/finalize, busy/form freeze, root transport write policy; global shell only; authoritative re-read after success |
| Excel / exportExcel | Retained complete prepared snapshot, no HTTP or cache owner | Shared export helper; raw numeric amount, translated columns/dates/status; no loader needed for another read |

No reference lookups, cache writers, imports, watches or invalidation topics are
consumed by this workspace; these cache adoption subchecks are inapplicable.
Month/reset/auth user/tenant/token/branch changes clear the snapshot; stale reads
cancel and cannot restore prior context. Both false envelopes and HTTP errors
retain translated inline errors and read Retry. No global provider/client fork.
The actual route sets showPageLoading:true, LayoutComponent's effective route
policy renders its sole sigma-shell__loading StateMessage host. Table keeps
loading/busy but showLoadingIndicator=false, actions disable without local
spinners, root section retains aria-busy. Export has no data request. Mutation
success belongs the global interceptor; the service's X-Skip-Error-Interceptor
header prevents duplicate error presentation. Source conformance is complete;
runtime loader visibility/overlap/query-only navigation remains owner acceptance.

Before: broken route, no monthly API; no valid runtime baseline. Source limits:
200occurrences/10000template lines with explicit failure, no partial/truncated
result. Prepare uses ordered scalar projections; template, journal lines/history,
ownership and account/partner/job references are batched. Grouped dictionaries
replace repeated source-to-lines/owners scans. Foreign-child counts remain SQL
correlated aggregates within the source query, not per-row round trips. The
shared journal source resolver performs one scalar candidate-union query for
retained journal IDs; no per-row source queries or parallel EF on one context.
No template-line loop performs a query. Post intentionally creates one JV per occurrence through
the existing resolver, so header numbering/period/reference checks grow per JV;
actual command counts/locks/latency need measurement. Internal child identifiers
avoid per-child numbering queries; genuine journal numbering remains unchanged.
The source-derived Prepare path contains four awaited database reads for an
empty month and up to fourteen for populated retained-journal/reference data,
including the existing precision resolver and source union. Post repeats Prepare
under locks, reads tracked occurrences once, then invokes the resolver per pending
occurrence and saves links once. These counts describe source branches, not
measured SQL commands, latency or the internal round trips of each resolver.

Existing ProvisionOccurrence unique(SubscriptionId,ProvisionId,DueDate) protects
source/date identity and parent-scoped checks, but cannot directly seek a date
range across all provisions after its second key. Proposal only:
ProvisionOccurrence(SubscriptionId,DueDate,ProvisionId)
INCLUDE(JournalVoucherId,IsDeleted), unfiltered to retain NULL-live semantics.
Benefit: possible tenant/month range seek and source-state coverage; cost:
additional storage/write maintenance and overlap with existing tenant/parent key
and FK indices. Verify actual SQL/plan/cardinality and deployed coverage before
adding; no source/config/migration index change is authorized or made. No other
index is justified without a measured bottleneck. No measured speed claim.

Owner performance check: fixed dataset/tenant/month and same environment,
cold/warm preparations with0/1/50/200rows, fail201, maximum template lines,
Post with fixed counts, SQL reads/plans/lock time and HTTP payload/latency samples
p50/p95; compare like-for-like after any later optimization. No database,
benchmark or browser execution in this task.

## Source-only verification and owner acceptance

Root reviewed all new feature files and scoped integrations in each owning Git
repository, preserving unrelated user changes. Source parser checks covered
14 frontend feature/integration files (TypeScript and Angular template syntax),
29 matching EN/AR vocabulary keys and local import/explicit entry existence;
20 backend C# files parsed without syntax errors. Resource XML and all 18
backend bilingual keys were reconciled. These are syntax/source checks, not
type checking, compilation, EF translation or executed behavioral tests.
New helper carriers are internal, top-level and one per file; namespace imports,
project references, implicit source inclusion and scoped DI scan were inspected.
Scoped whitespace/merge-marker checks passed. Recipe drift check: all eight OK,
with no canonical/template/manifest edit requiring regeneration in this slice.
No build/test/lint/database/browser/migration/
commit/push/deployment authorized. Existing occurrence schema must be deployed;
the source migration from the earlier Provisions task already contains it.
Do not create a duplicate migration solely because this screen is new.
Owner verifies compilation/DI/EF translation/schema, successful and stale Post,
two concurrent users, retry after lost response, rollback if a later row fails,
closed months, wrong/inactive references, legacy or canceled history, tenant
isolation, exact journal/transaction amounts and source links, calendar bounds,
both languages/themes and narrow viewport. Root owns final completion.

## Deliverable inventory and workflow

Backend additions: three MonthlyPosting ViewModels, IMonthlyPostingService,
MonthlyPostingController, three partial service files and nine internal carrier
files in VouchersServices. Existing integrations: JournalVoucherService retained
source guard, JournalReportSourceResolver
source navigation, and both GeneralMessage resources. No AutoMapper mapping is
needed: this is an explicitly projected read model and server-derived action.
No entity, EF configuration, enum or schema change was made for this slice;
no new Add-Migration is required. Earlier occurrence/approval schema deployment
must be verified by the owner.

Frontend additions: MonthlyPosting route/models/service/workspace, bilingual
monthly-posting vocabulary and user-guide topic. Existing integrations: main
router, locale registration, explicit tsconfig application entry, guide topic
registry and provision/module guide wording. The topic is consumed by the
existing UserGuide reader/menu at /UserGuide/vouchers-journals; it covers opening,
month/Reset/Prepare, all columns/status/issues, complete export, confirmation,
atomic Post, error/read Retry, context clearing, limits and legacy restrictions.
Source registration is confirmed; rendered guide acceptance remains pending.

Applied PLAN-00 and Phases00/01/02/04/05/06. Phase03 editor/upload CRUD does not
apply; there is no new editable document. Screenshot layout is not copied.
No unresolved material business decision remains within this frozen slice;
legacy lease/root-journal posting and correction/undo remain unsupported,
explicit blockers rather than guessed workflows. Financial effects are backend
owned: monthly debit sum, exact balanced source lines, due-date JV and current
resolver validation. The client submits no accounting values.

Delegation followed contract freeze: sol_monthly_backend used gpt-5.6-sol for
the isolated new backend files; terra_monthly_frontend used the inherited model
because the mapped terra model was unavailable, owning only new frontend files,
vocabulary and topic. Two independent layers reduced elapsed implementation
time without overlapping writes. Root handled integration, localized resources,
contracts, existing source owners, all review corrections and final reconciliation.

Suggested commits only (not executed):
- Backend: feat(monthly-posting): prepare and atomically post provision occurrences
- Frontend: feat(monthly-posting): add monthly provision posting workspace

## إصلاح جذر فحص القالب — ٢٠٢٦/١٠/٢٦

أبلغ المالك عن خطأ فقد ملف فحص القالب الافتراضي بوصفه جذر تجميع. تصحيح صغير وفق الواجهة١ و٢٩ والدليل الرئيسي١ و٥ وحزمة المرحلة٥؛ لا يحتاج عقد أعمال جديدًا أو وكلاء فرعيين. الشكل يظل مساحة عمل تشغيلية مالية؛ الخلفية خارج نطاق هذا الإصلاح.

كشف المصدر أن ملف المكوّن الحقيقي موجود، وأن المسار الكسول يستورده، وأن إعداد التطبيق لا يحتوي أي ملف افتراضي. مصدر المترجم المثبت يولّد جذور فحص افتراضية لكل جذر صريح؛ ويحتاج ملف المكوّن الأصلي من مضيف التجميع لتوليدها. لا يُنشأ ملف فحص على القرص. كانت إضافة مكوّن الشاشة إلى قائمة الملفات استباقية دون تشخيص سابق يفيد غيابه من التجميع، خلاف قاعدة الواجهة٢٩؛ أُزيل هذا السطر فقط، مع بقاء الاستيراد الكسول الصحيح وحدود التجميع الأخرى. أُبقيت جميع تغييرات المستخدم الأخرى. قد تحتفظ جلسة التطوير بالبرنامج القديم؛ إعادة تشغيلها عند المالك مطلوبة قبل الحكم على النتيجة، ولا تثبت القراءة وحدها أن الكاش هو سبب الخطأ.

التحقق: تحليل إعداد التطبيق بواسطة قارئ إعدادات تايب سكريبت، وفحص وجود ملف المكوّن ومسار استيراده، وفحص الفروق والمسافات. حزم التنفيذ الثماني متسقة. لا بناء أو اختبارات أو متصفح أو حذف للكاش أو إعادة تشغيل خدمات. لم تتغير طلبات تجهيز الشهر والترحيل أو بيانات الكاش أو مالك التحميل أو الاستعلامات والفهارس أو دليل الاستخدام؛ أدلتها السابقة تظل منطبقة، ولا توجد دعوى تحسن سرعة مقاس. لا تغيير خلفية أو قاعدة بيانات أو ترحيل أو التزام أو دفع. رسالة حفظ مقترحة فقط: fix(monthly-posting): remove premature component compilation root.

## إصلاح عرض الصفحة وتوضيح عقد التنفيذ — ٢٠٢٦/١٠/٢٦

طلب المالك إصلاح تكرار نقص عرض الصفحة وجعل الوثائق واضحة للتنفيذ المستمر. الشكل يظل مساحة العمل المالية القائمة؛ إصلاح صغير في حاوية واحدة مع توضيح عام للوثائق، دون عقد أعمال أو خلفية جديدين. لا وكلاء فرعيين لأن تصحيح الحاوية وتوثيق سببه عمل مترابط وقصير. اعتُبرت مطابقة الهيكل السابقة غير كافية: وجود اسم الحاوية لم يثبت فوز تنسيقها في الكاسكيد.

| الحلقة / الحالة | المصدر الفعلي | قبل الإصلاح | بعد الإصلاح المصدري |
|---|---|---|---|
| المسار الحي | pages/routing.ts → MONTHLY_POSTING_ROUTES → MonthlyPostingWorkspaceComponent | المسار صحيح | دون تغيير |
| المساحة المتاحة | LayoutComponent SCSS: sigma-shell__main/content/route | الحاوية تعطي عرضًا كاملًا دون حد أقصى | دون تغيير؛ المقارنة بمساحة العمل بعد القائمة لا بعرض نافذة المتصفح |
| المضيف | metadata sigma-route-host، المالك src/styles.scss | ملف الشاشة يكرر :host ويغلب display:block المشترك إلى display:flex؛ اتجاه افتراضي أفقي | حذف كتلة المضيف المحلية كاملة؛ يفوز المالك المشترك display:block مع ارتفاع الحاوية والحدود الدنيا والقص |
| الصفحة والبطاقة | section.sigma-editor-page → div.sigma-editor-panel--workspace | الصفحة ابن مرن بقيمة flex الافتراضية 0 1 auto؛ العرض يمكن أن يعتمد على المحتوى | الصفحة كتلة داخل المضيف وتتمدد للعرض المتاح؛ البطاقة والأقسام تتبع المحور العمودي المشترك، دون عرض تعويضي |
| المحتوى | sigma-editor-body → DataTable fill | هيكل الجدول صحيح | دون تغيير؛ الجدول يملك التمرير والمقسم ثابت |
| قبل التحضير / التحميل / الخطأ وإعادة المحاولة / النتائج | القسم والبطاقة خارج شروط القالب | الأحجام المختلفة للمحتوى قد تكشف الانكماش | نفس المالك الخارجي في جميع الحالات؛ اختفاء/ظهور البيانات لا يختار عرض البطاقة |

مراجع الشكل المقروءة: الواجهة١ وحاوية قائمة الورشة المشتركة، والأرصدة الافتتاحية بوصفها مستهلكًا لحاوية مساحة العمل. المصدر المشترك صحيح؛ لم تُضف قاعدة عالمية أو width:100% محلية لإخفاء التعارض. أُبقي تنسيق بطاقات الملخص الداخلي فقط. لم تُعدّل المراجع. أُضيف تنبيه استخدام عربي وإنجليزي في موضوع الشاشة الموجود ضمن دليل القيود والتسويات يشرح ملء مساحة العمل وتمرير الجدول.

| مصفوفة القبول | دليل المصدر الحالي | التحقق البصري |
|---|---|---|
| قائمة مفتوحة أو مطوية، شاشة واسعة | المساحة الخارجية من مالك التطبيق؛ المضيف كتلة مشتركة بلا تجاوز محلي | معلق عند المالك |
| جانبا نقطة المسافة الخارجية المشتركة ٩٩١٫٩٨ بكسل وأحجام وسطية وضيقة | الإزاحة من sigma-page-gap المشتركة فقط؛ لا قواعد مضيف أو عرض محلية عند نقاط التوقف | معلق عند المالك |
| قبل القراءة، تحميل، خطأ، نتيجة فارغة أو ممتلئة | نفس القسم والبطاقة ثابتان خارج شروط القالب | معلق عند المالك |
| اتجاهان ومظهران | نفس المالك المشترك والحواف المنطقية؛ لا قيم عرض حسب الاتجاه أو اللون | معلق عند المالك |

تحديث الوثائق: الواجهة١ تملك الآن خطوات تنفيذ سلسلة العرض، وتحظر هندسة المضيف المحلية للشكل القياسي وتشرح تعارض الصف المرن؛ الواجهة٢٩ تملك مصفوفة الحالات والأحجام ودليل القياس البصري؛ الدليل الرئيسي٥ يشترط دليل السلسلة الفعلي قبل وصف المطابقة. أُحدثت المهارة مع صف مراجعة بنفس المراجع، وقالبا المرحلتين٥ و٦؛ تُحدّث المخرجات المشتقة من المولّد فقط ثم يُفحص اتساقها. لا قاعدة جديدة في المهارة دون مالك مرجعي.

التحميل والكاش والأداء: بقيت طلبات تجهيز الشهر والترحيل وخياراتها وإلغاء القراءة والمالك المرئي وسياسة القراءة التشغيلية والتصدير كما هي؛ أدلة المصدر السابقة منطبقة. لا استعلامات أو فهارس أو قياسات سرعة جديدة، ولا تغيير محاسبي أو ترحيل قاعدة أو خرائط. التحقق المصدري يشمل إزالة تجاوز المضيف، ومقارنة المالك المشترك والاستيرادات والقالب وقراءة الفروق في مستودعي الواجهة والوثائق، واتساق الحزم. البناء والاختبارات والمتصفح وقاعدة البيانات لم تُشغّل؛ يلزم عند المالك فحص حواف البطاقة داخل مساحة المسار بالحالات والأحجام المذكورة. لا ادعاء معاينة بصرية ناجحة من قراءة المصدر.

رسائل حفظ مقترحة دون تنفيذ: الواجهة fix(monthly-posting): inherit shared full-width route host؛ الوثائق docs(ui): require explicit route width ownership and acceptance evidence.

نتيجة المطابقة النهائية لتحديث العرض: جُمعت فقرة العرض القديمة في الواجهة١ داخل خطوات العقد الجديدة، وحُذف تكرار القاعدة في المهارة مع الاحتفاظ باستثناء الحاوية المرنة المعتمد وشروط تمدد الابن والطباعة. حُدثت قوالب المراحل٣ و٥ و٦، وأُعيد توليد الحزم الثماني لأن بصمات المصادر المرجعية تغيّرت؛ تمت مقارنة المخرجات مع مسؤولياتها: المرحلة٣ تستهلك عقد المحرر والاستثناء، والمرحلة٥ تتبع المسار والهيكل، والمرحلة٦ تمنع وصف المطابقة بلا دليل. بقية الحزم تحمل تحديث بصمات المصادر دون توسيع التنفيذ. جميع الحزم متسقة. لم تتغير تعليمات الإذن أو حدود التشغيل؛ القياس البصري ما زال معلقًا ولا توجد دعوى ضمان بصري من الوثائق وحدها.
