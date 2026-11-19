| Item | Value |
|---|---|
| Status | Implemented — source-only; schema and owner acceptance pending |
| Owner verification pending | yes |
| Date | 2026-10-26 |

# Receipts completion review

## Unused standalone import warnings — 2026-10-26

Final status: Implemented — source-only. Both template selector searches confirm the reported imports are unused; removed their TypeScript and standalone entries only, retaining details QuantityInput and actual StateMessage uses. Three component TypeScript/templates syntax parsing passed with zero errors; incremental import diff and scoped whitespace checks passed, prior extensive Receipt changes preserved. Angular compiler was not rerun; the user verifies warning disappearance on the next build.

Tier S compiler-only correction under UI1/Phase05: current Receipt details has no input[appNumericFocus], so remove NumericFocusDirective from its TypeScript import and standalone imports. Current Receipt list has no p-inputnumber[appQuantityInput], so remove QuantityInputDirective from that file's TypeScript import and standalone imports only. Receipt details still actually uses QuantityInputDirective and keeps it; current StateMessage components elsewhere remain. Existing receipt/scalar/financial/loading/cache/API/query/UI behavior and unrelated changes preserved. No screen workflow/user-guide change, no backend/index/schema/migration or shared directive change. All8 recipe checks passed before use; no agents for three bounded import removals. Source syntax/diff reconciliation pending, owner compiler rerun pending; no build/test/typecheck/browser/DB/commit/prohibited command run.

Plan and contract: RECEIPTS_MAINTENANCE_EVOLUTION_PLAN.md and
RECEIPTS_DOMAIN_API_CONTRACT_FREEZE.md. User screenshot content/workflows are
evidence; screenshot styling/modal size is not design authority. Contact on
Receipt points to Partner, distinct from company contact-person editor.

| Evidence | Classification | Implementation target |
|---|---|---|
| Receipt1 filters/actions/columns | Explicit content | Typed paged list, complete filtered Excel/report; saved actions from backend eligibility |
| Receipt2 header/currency/payment/details | Explicit fields | Existing financial header and card/bank/source contracts on routed shared editor |
| Receipt2/3 Invoice/JV allocation and totals | Explicit workflow | Real receivable ledger debit targets with approved posted settlement; no credit-note-child substitution |
| Receipt3 documents/Cancel/Save/Save&Print | Explicit actions | Shared tracked files, dirty exit, draft save and saved-snapshot print |
| Negative Due sample | Historical sample only | Never copy over-allocation; current ledger capacity is authoritative |
| DDAS Import | Action name only; format/API missing | Unsupported no invented financial import; owner file/API contract required |

Initial findings: wrong allocation source; generic navigation list misses custom
filters/labels; no action menu/read statuses; legacy display adapter expects
nested properties where API returns flat names; no saved approval decision log;
enum frontend misses DepositReceipt; card/bank/embedded source contexts exist and
must be preserved. Existing working trees heavily modified by prior tasks;
scoped files read in place and unrelated changes retained.

## Authority, phases and ownership

Tier L; UI screen08 financial document, UI02/Job routed list/editor shell and
BE15 master-detail with financial effect. Canonical Master1–5/7–8, relevant
UI1–2/5–9/13–14/18–19/21–29 and BE2–5/7–12/15/18 own the decisions. The
approved Job shell and Invoice financial owner were inspected as references;
their implementation was not modified. PLAN00 froze the impact map, then
Phases00–06 covered evidence, domain/API, list, editor, decisions, integration
and source reconciliation. No applicable implementation phase was skipped.
Recipe drift check passed all eight packets before use and at handoff; no
canonical-rule or generated-packet change was needed for this feature.

Root owned freeze/integration/read projection/API/resources/reports. Bounded
backend and frontend workers owned disjoint aggregate and UI files after the
shared freeze. Existing-state discovery used the explorer role; implementation
workers inherited the root model where required by orchestration. Parallel work
separated API persistence from UI composition to reduce elapsed time without
concurrent ownership. Two workers hit model capacity; their edits were retained,
resumed by bounded replacement workers and reviewed by root, not reset. Root
owns the complete result; agent parse results alone did not close the feature.

## Decisions and source conformance

| Decision | Evidence and final implementation |
|---|---|
| Party meaning and eligibility | Existing Receipt.Contact/Customer FKs both target Partner. Receipt parties endpoint restricts customer types to Individual/Company and StaffReceipt to Staff. General uses selected posting account. UI labels and backend writes agree; no global Partner picker or enum renumbering. |
| Save and approval | Existing SaveJVAsync creates unposted JV; preserved. Save stores pending draft and allocation intent. New reasoned decision endpoint posts and settles atomically on Approve; Pending→Rejected terminal; Approved→Pending guarded. Saved approval history is new, never fabricated for old receipts. |
| Money and card/bank | Server owns money precision, currency and gross two-line JV; transfer requires BankId. Existing card calculation stores fee/VAT snapshots and retains its 5% fee-tax rule. Preview now matches that existing rule; no change to general tax policy. Settlement still owns actual card-fee posting. |
| General receipt | BE15 existing owner decision uses selected eligible non-group posting credit account; optional party, no receivable allocations. Added nullable account FK; no arbitrary fallback account. |
| Allocation target | Exact owned posted debit ledger line, customer/staff control account, branch/base currency and proven invoice/manual-JV provenance. Both allocation sides and legacy header usage count. No credit-note detail used as an invoice. |
| Draft/posted capacity | Full positive selected snapshot ≤500 rows; bounded complete source fails on501, allocation read fails on10001. Draft does not reserve. Approve rechecks under SalesAgreement→JournalVoucherAllocation locks and creates paired debit/receipt-credit allocations; cash debit is not settled. |
| History and child ownership | Tracked reconciliation preserves child IDs/No/audit; rejects foreign IDs, duplicate targets and legacy positive allocations. PDC, consumed deposits, settled cards, inconsistent journals and incompatible historical parties remain readable with mutations blocked. No backfill/destruction. |
| Void | Reason≤500 and saved actor/time; retained receipt+JV void together in open original period, no reversal. Allocations/downstream links block. No new Unvoid UI; retained legacy route has ownership/provenance/period guards. |
| Files and printing | Shared upload tracker cleans discarded/unreferenced files with Retry. Create/update use returned id; Save&Print reads saved detail. Saved remaining Due is not subtracted twice; view/print retain the saved snapshot. |
| Import | DDAS format, endpoint, duplicate policy and validation remain Missing; explicit unavailable text replaces a fake working importer. This is the only screenshot-backed capability left unsupported. |

Grid columns, in order after Actions:
`no,date,contact,contactCode,createdBy,agreementNo,quotationNo,amount,receiptType,allocationStatus,approvalStatus,isVoided`.

ListVM properties:
`id,no,date,contact,contactCode,createdBy,agreementNo,quotationNo,amount,currencyCode,receiptType,allocationStatus,approvalStatus,isVoided,journalVoucherId,canEdit,canDelete,canApprove,canUnapprove,canReject,canVoid,canJournal`.

The extra properties are row identity, currency or server action eligibility,
not editor child collections. List projection, column filtering and displayed
labels match; count/filter precede server sort/page. Contact fallback is handled
before generic FK filtering. Booking search uses persisted deposit→booking links,
agreement/quotation use their actual sources. Void-only false does not hide voids.
Binary allocation status retains its existing meaning: draft selections can be
fully selected before ledger settlement; the guide explains approval timing.
Report/Excel fetch every page with the same applied filter/grid/sort and export
numeric money. Legacy unpaged endpoints remain compatible, with action queries
batched at100 identities; they are not used by the new report/export flow.

API and route reconciliation: existing GET/Add/Update/Delete/detail remain;
new parties, receivables, approval GET/POST, reasoned void, journal and log are
typed on both sides. Shared Result.id is read after writes. Interface namespaces,
DTO imports, SDK source inclusion, existing DI assembly scan/HttpContextAccessor,
DbSet and sealed EF configuration discovery were checked. Receipt/child maps
ignore server-owned allocation status/collection on write and explicitly ignore
all seven computed action flags on read before the service supplies them. Read projection uses
owned live labels. No invented permission enforcement: existing authentication
is retained; server flags and mutation validation are business guards.

Active route: pages/routing.ts → Receipt_Routes → ReceiptsComponent or
DetailsComponent. `/details/:id` redirects to `/view/:id`; create/view/edit and
query return filters use current route. SalesQuotation, SalesAgreement,
RentalAgreement and LeaseAgreement embedded inputs/outputs/selector remain.
Same-route ID reads cancel previous detail, fence late responses and reset
approval state. Authentication/token replacement cancels reads and clears rows,
options and draft context; it does not cancel an in-flight write or reopen an old
document after that write completes. No feature HttpClient/provider was added.

## Cache source matrix

| Actual read / consumer | Classification, producer and adoption evidence |
|---|---|
| Branch/GetSelect — BranchService.getSelectList, list/editor | Approved reference cacheSelect=true through BaseService/ReferenceLookupCacheService. Finite successful bootstrap, separate ReferenceLookupBindings watch, selected ID/current options getters, retained draft labels and error Retry. Successful typed/inherited Branch writes invalidate source; lookup-branches tenant topic/TTL coverage; DestroyRef ends bindings. |
| PaymentMethod/GetSelect — PaymentMethodService.getSelectList, list/editor | Same source opt-in, finite bootstrap and watch. Successful create/update/delete/inherited writes invalidate; lookup-payment-methods topic. Policy detail is separate direct read below. |
| SettingsCommonModel/GetMySetting — CommonSettingsService.getMySetting, editor amount words | Explicit singleton exception through shared settings cache, exact URL invalidation after successful settings save, settings-common topic. Finite settings snapshot for draft currency words; no feature replay or new watch API. No hot overwrite of draft money from settings notification. |
| Receipt/parties?receiptType — ReceiptService.getParties, list/editor | Direct operational eligibility, not reference cache opt-in. Switch/type Retry owns latest response; clears old type's party, preserves saved label where appropriate. Individual/Company/Staff writers need no invented reference invalidation for this direct source. |
| RentalAgreement/GetSelect — RentalAgreementService, editor | Direct source with no cache opt-in; operational agreement choices, retained selected label. Existing source contract unchanged. |
| Bank/GetSelect — BankService, editor | Direct reference with no source opt-in; existing BaseService direct contract retained. Selected saved labels merge; failed bootstrap exposes Retry. |
| Account/PostingSelect?usage=AnyPosting — AccountService.getPostingSelect | Direct posting eligibility policy; excluded from reference caching. Server independently revalidates on save/approve. |
| Currency/GetFinancialNumberPolicy — FinancialNumberPolicyService.load(true, inline options) | Existing direct policy service contract, fresh bootstrap/Retry, ledger compatibility blocks save; no reference watch or screen cache. Shared DocumentCurrency also consumes this existing policy service. |
| PaymentMethod/GetById/{id} — PaymentMethodService.getById | Direct current payment rules/fee preview. Latest selection cancels earlier request, blocks invalid save and exposes Retry. Saved snapshots are preserved until editing. |
| Partner/GetByWithNavigationsId/{id} — shared DocumentCurrency/PartnerCurrencyLookupService | Existing direct currency-label reader with version fence; informational display only. Saved code wins; backend remains currency authority. Its existing blank/fallback behavior on lookup failure is not a new financial cache or a receipt posting fallback. |
| SalesQuotation/SalesAgreement/LeaseAgreement/RentalAgreement detail — respective services | Direct operational context for embedded/routed source receipts; no cached capacity/balance. Current source context disables conflicting fields, error Retry and cancellation remain. |
| Receipt list/detail/receivables/approval/journal/log and writes | Direct operational/financial reads and mutations; no reference replay/cache. Failure envelopes and HTTP errors handled; no automatic write retry. |
| File upload/delete — FileUploadService through DocumentUploadTracker | Direct tracked attachment operations; finishSave/discard and cleanup Retry retain draft and source ownership. |

Tenant notifications are shared cache owner behavior, not a new websocket.
Source conformance is checked; actual network coalescing/invalidation and
cross-session behavior remain owner-runtime acceptance.

## Loading and full-width evidence

| Operation | Visible owner and lifecycle |
|---|---|
| List/detail, routed source detail, save/update/delete/void, export/report data | Existing global LoadingService; subscribed start paired with finalize/end, read switchMap/unsubscribe/context/destroy cancellation. Receipt route has no showPageLoading=false override. Layout renders shared progress host under effective inherited true policy; UI retains busy/disabled/aria-busy/errors/Retry. Table showLoadingIndicator=false avoids a second visible spinner. |
| Branch/payment/party/bank/account/settings/policy lookups and payment rule detail | Local auxiliary state/disabled control/error+Retry; no global page loading for reference choices. Retained cache watch stays silent. |
| Receivable capacity | Global on routed editor; local shared StateMessage in body-appended embedded dialog. Not requested for readonly view; historical snapshot preserved. |
| Approval/journal/log reads | Shared local StateMessage when displayed in body-appended dialogs; routed approval uses shared global owner. Approval writes use shared decision owner and global progress. |
| Embedded source-context reads | One local shared StateMessage over dialog content; routed equivalent uses global progress. |
| Files/print | Shared file field/tracker and ReportPrintService own operation state; saving/closing frozen while uploads or print active. |

LoadingService is the existing shell authority: same parsed path-tree query or
fragment updates preserve pending progress; actual path departure resets the
counter. No local timer/force detection or second progress host was introduced.
Runtime overlay visibility, request overlap and timing remain pending.

Full-width chain: real route host `.sigma-route-host` (shared block) →
`.sigma-list-page/.sigma-list-panel` or `.sigma-editor-page` → shared workspace
panel/form/body → bounded inner section/table scroll. Feature styles contain no
local routed flex-row, max-width or shrink-to-content geometry; only the explicit
embedded host declares block/min-size. The dialog uses its existing shared width
contract. Shared fields/tokens/table/editor controls retain RTL/theme ownership.
Owner visual matrix: empty/loading/error/populated × sidebar open/closed ×
desktop/tablet/phone × Arabic/English × light/dark, with saved print unclipped.
Source chain passes; pixel/overflow evidence is pending, not inferred from parsing.

## Load-speed, queries and index disposition

Before: generic navigation list with editor-oriented model/labels and incomplete
custom search/count; wrong credit-note allocation reads; decision load could
join allocations × approval histories × journal lines. After: scalar page
projection and batched eligibility/provenance/period queries, no per-row detail
reads; LoadForDecision uses AsSplitQuery to avoid collection multiplication.
Rows/page capped1–100 through existing base when paging supplied. One count and
one page query plus up to five batched action-state queries per page (state,
source union, fiscal years, closed months, base currency). Empty identity sets
skip state queries. All source union branches retain tenant/history conditions.
Receivables bounded500 and allocation usage10000; approval save uses tracked
snapshot and bounded target batch. Internal child/JV-line/approval No values
avoid per-row document-number queries; Receipt keeps actual document sequence.
No parallel EF on one context. Export is intentionally serial finite pages under
shared fetchAllPages validation; list paging is independent of lookup bootstrap.

Residual limits: legacy load-all retains complete response memory; party and
operational selectors retain existing complete-select contracts; single receipt
approval history and shared audit reader retain complete historical response.
These are named compatibility scopes, not a claim of measured speed.

| Index | Evidence, benefit, overlap and cost |
|---|---|
| Existing Receipt unique SalesQuotationId filtered live/nonvoid plus FK indexes | Retained uniqueness and join coverage. No replacement or new broad uniqueness rule. Actual deployed index/plan coverage awaits owner SQL inspection. |
| New ReceiptApprovalLog(SubscriptionId,ReceiptId,CreatedAt,Id) in model config | Supports owned receipt history ordered by time/ID; small insert/write/storage cost per decision. Overlaps receipt FK prefix only partially. Must arrive through owner migration, not applied here. |
| Proposed Receipt(SubscriptionId,Date DESC,Id DESC) INCLUDE(BranchId,ContactId,CustomerId,PaymentMethodId,ReceiptType,IsVoided,AllocationStatus) | Candidate for common tenant/date page and narrow filter coverage. INCLUDE only if reads/plan justify width; existing standalone FK/quotation uniqueness does not cover this order. Adds write/storage cost. Alternative BranchId between tenant/date only when branch selectivity dominates. Do not create both automatically. |
| Proposed JournalVoucherDetail(SubscriptionId,PartnerId,AccountId,JournalVoucherId,Id) INCLUDE(Debit,Credit,BranchId,IsDeleted) | Candidate for receivable line predicates and parent join, subject to actual EF SQL and existing indexes. Existing single FK indexes may suffice for small tenants; wider key increases insert/update/storage cost. No source/model index change made for this proposal. |
| JournalVoucherAllocation endpoint FK indexes | Keep convention FK coverage first. Consider tenant+JournalVoucherDetailId and tenant+AllocatedJournalVoucherDetailId INCLUDE(AllocatedAmount) only if effective-ledger plan shows repeated large scans; overlap existing FK indexes and extra paired-write cost must be measured before addition. No new index applied. |

Reproducible measurement pending owner: same database snapshot/tenant/branch,
same date/filter/grid/sort and page size50, same machine/browser/network; record
five cold and five warm runs before/after, median/p95 endpoint/SQL/render duration,
query count/rows/logical reads, response bytes and execution plans. Include empty
and dense periods,500 receivables, a receipt with many history rows, complete
export, session replacement and overlapping navigation. No measured latency or
speedup claimed from source-query shape alone.

## Verification, schema and handoff

Source checks: Roslyn syntax parsed32 directly related C# files with zero syntax
diagnostics;52 used localization keys found in both resource XML files, no
duplicate English keys; scoped Git diff whitespace check passed. Frontend
TypeScript/Angular template syntax/local-import and bilingual vocabulary checks
are recorded at final reconciliation; these are parsing/source checks, not a
compiler build or a runtime financial test. Namespaces/project references and
producer/consumer symbols were independently inspected. Unrelated deposit,
sidebar, invoice and routing work in both working trees was preserved.

Owner must generate and review `Add-Migration CompleteReceiptReceivablesAndApproval`
and apply it using the normal deployment process before using the updated API.
Reason: Receipt.CreditAccountId and void audit metadata; nullable exact ledger
target FK and VoucherType on allocation detail; new ReceiptApprovalLog table and
history index. Keep legacy target FK/data; no guessed backfill or dropping old
history. No migration/model snapshot was created or changed by this task.

In-app guide: frontend `src/app/modules/UserGuide/content/receipts-topic.ts`,
registered through `record-list-topics.ts` in the existing vouchers-cash module
guide. It covers party types, search/page/grid, bank/card, allocations, draft vs
approval, terminal rejection, void, journal/log, files, Retry, report/Excel,
saved print and missing DDAS. Guide reader/menu owner is reused.

Owner verification: migrate first; build backend/frontend; check list count and
filters versus Excel/report; create customer/staff/general and source-context
receipts; verify expected two-line gross JV; save draft then approve partial/full
allocations and competing settlement conflict; check terminal rejection,
reasoned unapproval, allocated receipt blocks, original closed period, void,
legacy PDC/deposit/card/credit-note history, file cleanup and Save&Print. Editing
to a new party/branch queries that proposed context without the old receipt ID;
unchanged context includes the saved ID to retain unavailable selections. Perform
the width/loading/cache/performance matrices above and tenant-boundary checks.

Suggested commits (suggestions only):
- Backend: `feat(receipts): complete receivable allocation and approval lifecycle`
- Frontend: `feat(receipts): complete receipt workspace actions and user guide`

No builds, tests, lint, browser/app/database execution, migrations, model snapshot
edits, commit, push or deployment commands were run. Schema application, compiler
and runtime acceptance remain explicitly pending for the owner. DDAS stays
unsupported until a concrete import contract is supplied.

Final frontend source evidence:12 feature/template/vocabulary/guide files parsed,
83 bilingual keys matched, all local imports resolved, scoped whitespace check
passed. Final recipe drift check: PLAN00 and PHASE00–06 all OK. Root corrected
the last producer/consumer issues (proposed context ID, computed AutoMapper flags)
and reviewed the final scoped sources. See RECEIPTS_FINAL_RECONCILIATION.md for
the acceptance gate and schema handoff; neither syntax parsing nor this review
asserts a successful compile, SQL translation, browser rendering or posting run.

## Bounded CS1061 correction — 2026-10-26

| Item | Result |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope/tier | S: reported Receipt/CustomerDeposit compiler diagnostics only; preserve pre-existing changes |
| Source changed | `SigmaBackend/SiGma.Business/Services/VouchersServices/ReceiptService.Read.cs:175` |
| Confirmed defect | Card settlement action-state predicate referenced nonexistent `ReceiptId`; corrected to persisted `SourceReceiptId` |
| Contract evidence | `CardTransactionBankTransferDetail.SourceReceiptId`, its EF relationship, and `ReceiptService.IsCardSettlementRecordedAsync` already use this FK; no new entity field or API |
| Dependent diagnostics | All seven Receipt and three CustomerDeposit methods already exist on the current interfaces and implementations. Controllers import the same interface namespace. Business global imports cover enum/result types, explicit imports cover DTOs, SDK source inclusion is enabled, and ServerAPI references the Business project. No duplicate declarations or consumer workaround added |
| Interpretation | Dependent diagnostics may reflect the failed Business compilation or stale IDE metadata; source inspection cannot prove they disappear after rebuilding |
| Shape/authority | Existing financial master-detail Receipt; BE5/6 and Master5 producer-first diagnosis. UI shape selection and phases2–5 not reopened for this backend-only identifier correction |
| Packets | Initial `Generate-SigmaRecipes.ps1 -Check`: PLAN00 and PHASE00–06 all OK; PHASE01 contract compatibility applies; no canonical/template/manifest change or regeneration required |
| Performance/index | Existing bounded100-ID action-state query keeps its correlated `Any`, tenant scope and includeDeleted history policy; no added request/materialization/per-row call. Existing filtered nonunique `(SubscriptionId, SourceReceiptId)` index covers this relationship lookup. No extra index justified by this identifier fix; actual SQL plan/latency remain pending |
| Cache/loading | No frontend request, cache owner, loader lifetime or progress host changed; prior screen acceptance gates remain pending, not re-certified by this patch |
| Schema/mapping/calculations | No entity, EF configuration, AutoMapper, financial calculation or schema changes in this correction; no additional migration |
| User guide | No user-visible workflow change; existing Receipt/CustomerDeposit guide content unaffected; no frontend expansion |
| Reconciliation | Reviewed current controller/interface diffs and untracked Receipt read source against the existing FK; final scoped whitespace and stale-reference checks performed. Existing worktree edits preserved |
| Agent use | No subagents: single identifier repair and dependent signature verification do not justify independent workstreams |

Owner check: rebuild Business first, then ServerAPI (or rebuild the solution),
and refresh the IDE error list. Confirm the reported CS1061 diagnostics clear;
then verify a card-linked receipt remains blocked by its saved source link.
No build/test/lint/browser/database/migration/commit/push/deployment command was
run. This correction does not resolve or change the earlier feature's schema
handoff or claim full compiler/runtime acceptance.

Suggested backend commit: `fix(receipts): use source receipt FK in card settlement guard`.

## إصلاح مدخل وصف بطاقات الإجماليات — 2026-10-26

| البند | النتيجة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| النطاق | إصلاح صغير لعقد مدخل مطلوب في قالب تفاصيل سند القبض؛ لا إعادة فتح للعقود المالية |
| السبب | يعلن المكون المشترك `SummaryCardsComponent` المدخل `ariaLabel` بواسطة `input.required<string>()`، بينما أغفله موضعا بطاقات الإجماليات في المحرر والطباعة |
| التنفيذ | أضيف الربط المترجم `receipts.summary` إلى الموضعين في قالب التفاصيل، وأضيف الوصف «إجماليات سند القبض» ومقابله الإنجليزي إلى قاموس سندات القبض |
| المرجع | كتاب الواجهة، الكتلة ٢٤، مالك بطاقات الملخص المشترك وعقده الفعلي؛ الشكل القائم مستند مالي، النوع الثامن؛ لا عمل خلفية |
| الملفات | `SiGmaAngularFrontEnd/src/app/modules/Vouchers/Receipts/Receipt/components/details/details.component.html` و`SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/receipts.ts` |
| المطابقة | روجع الموضعان ووجود المفتاح في اللغتين وتسجيل قاموسهما في القاموس الجذري؛ لم يخفف المدخل المطلوب أو يغير المكون المشترك |
| الحدود | لا تغيير بيانات أو حمولة أو استعلام أو كاش أو تحميل أو فهرس أو مخطط؛ لا ترحيل جديد. دليل سندات القبض الحالي لا يحتاج تغيير خطوات لأن الإصلاح وصف إتاحة للمحتوى القائم فقط |
| التحقق | فحص مصدر وفروق ومسافات؛ فحص اتساق الحزم الثماني ناجح قبل العمل، ولم تتغير كتب أو حزم. إعادة بناء الواجهة وقبول قارئ الشاشة عند المالك |
| الوكلاء | لا تفويض: إصلاح مدخل واحد وموضعي استهلاكه لا يبرر مسارات عمل مستقلة |

احتُفظ بالتعديلات السابقة في الملفين. لم ينفذ بناء أو اختبارات أو تدقيق نمطي أو متصفح أو قاعدة بيانات أو مهاجرات أو إيداع أو رفع. رسالة إيداع واجهة مقترحة: `fix(receipts): label editor and print summary cards for accessibility`.
