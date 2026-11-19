# Accruals — full-stack implementation review

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-26 (discovery and initial approval2026-10-25) |
| Requested outcome | «انشئ الشاشة واتبع الوثائق»; «كمل» approves the researched draft/approval/paired monthly reversal workflow |
| Scope/tier | L; rental revenue accrual monthly workspace and owned API/accounting, dedicated navigation and guide |
| Contracts | ACCRUALS_MAINTENANCE_EVOLUTION_PLAN.md (initial blocker retained with approved amendment); ACCRUALS_DOMAIN_API_CONTRACT_FREEZE.md |
| Verification boundary | Source-only; no build/test/lint/runtime/browser/database/migrations/commits |

## Manifest and evidence

Screenshot E1 Accurals.PNG: month/Prepare/Excel, agreement number, start/end, Open status, charge type, signed accrual and row calculation action. E2 Accurals2.PNG: Save, repeated contract across charge types and negative amount. E3 Accurals1.PNG: Estimated - Already Invoiced - Accrual Reversal, operands and result; read-only OK. All are Explicit functional evidence; Save posting behavior, amount period/sign semantics and hidden states are Uncertain from pictures alone. Owner approved the researched draft→approval→next-period-reversal proposal on2026-10-25. Full evidence/metadata/classification tables remain in the plan; no screenshot styling is copied.

Existing modifications were inventoried in the two Git repositories; root workspace is not a repository. Many unrelated changes exist including routing/vocabularies/JVs/Amortization/Provisions/shared owners/backend entities/migrations. All are preserved. The work adds a distinct Accruals feature; reference modules and existing invoice writers are read-only. Root owns integration, docs and final reconciliation. One backend sol_worker and one frontend sol_worker inherit parent model; independent module ownership after contract freeze avoids overlapping implementation files. Backend owns new backend feature + enum append/DbContext/resources; frontend owns new Accruals folder and accruals vocabulary only. Root owns existing frontend integration files and guide.

### Patterns and pre-edit conformance

| Concern | Canonical owner | Reference / actual shared owner | Target |
|---|---|---|---|
| Monthly workspace | UI1/14, catalog05; accounting concerns catalog08 / BE15 | Accounts/openingBalances/components/details; Workshop/Job editor shell | Shared bounded workspace; one root route; Prepare and saved runs are domain modes, no invented conventional CRUD editor |
| Title/cards/alignment | UI3/24/25 | FeatureTitle, SummaryCards; sigma-editor-panel--workspace | Shared appearance/tokens; no local palette; fixed header/footer and single internal scroll owner |
| Filters/month | UI4/17/19 | Job list FilterPanel; monthValueValidator/date directive/FieldError | Shared month control, typed form, yyyy-MM read key, Reset and validation |
| Grid/export | UI5/6/8; BE7 | Shared DataTable and Excel helper | Complete bounded dataset, Actions first, no hidden partial page export; unknown operands remain unknown |
| Calculation | UI13 | EditorDialog read-only | Display immutable row operands; no new per-row request |
| Approval/journals/log | UI7/13/22; BE15/18 | DocumentApprovalCycle/DocumentJournal/DocumentActionLog | Same context/history contract; separate original/reversal journal reads and local overlay progress |
| Ordinary writes | BE1–6/8/14/15 | InvoiceService shape and JournalVoucherResolver (existing historical Save-posting is not copied) | Dedicated operation service; client sends month/key only; backend owns amounts/accounts/tenant |
| Route/feedback/lifetime | UI1/2/22/26/28 | root app.config HttpClient, AuthGuard, LoadingService and layout host | Root injection; no feature HTTP client; global page operations/local hidden-overlay reads; one feedback owner |

## Decisions and contracts

| Master4 concern | Decision / evidence |
|---|---|
| Editor/route | Monthly financial collection workspace, not a standalone CRUD editor; one lazy /Accruals route with preparation/saved-run tabs. Canonical workspace shell and shared controls own layout |
| Source/pricing | Saved rental agreement/selected nonincluded charges and priced interval; no current tariff, invented late extension, receipts, deposits or VAT |
| Calculation | Backend cumulative earned through cutoff minus ledger-effective invoice net minus unreversed balance; paired monthly reversal makes prior unreversed opening balance zero |
| Historical attribution | Multi-charge invoice amount without immutable charge allocation is unresolved: null operands + visible reason; Save and approval blocked, never proportioned from mutable source |
| Revenue/asset accounts | Existing General.AccruedRevenue and existing Rental.RentPerDay mapping (same revenue mapping as current invoice accounting); no user-supplied account IDs |
| Negative values | Preserve signed accrual with debit/credit directions reversed; never clamp to zero |
| State | Existing enum Approved0/Pending1/Rejected2. Save Pending only; Approve paired journals; reasoned guarded UnApprove/Reject; Reject terminal; Void flags both retained journals |
| Identity/duplicate | Tenant-scoped live month reservation; stable charge row key; immutable stored snapshot and source fingerprint; original/reversal journal numbers remain resolver-owned |
| DTO scope | Preview/detail contains only rendered header/grid/calculation; run list only displayed/state/action fields; writes month+key, decisions status+reason, Void reason; no client totals/audit/tenant |
| Child/model | EntityBase snapshots and explicit child ownership; no generic CRUD, redundant overrides or AutoMapper; explicit mapping is needed for authoritative calculated snapshots |
| Permission candidates | Save, DELETE runs/{id}, POST {id}/approval, POST {id}/void; [Authorize] authenticates. Application has no per-feature permissions; none invented |
| Migration | New run/line/history and indexes/relationships; owner-only Add-Migration AddRentalRevenueAccruals; uniqueness and schema checked before suggesting at handoff |
| Shared extraction | Reuse existing controls and lifecycle owners; new feature accounting is model-specific. No demonstrated missing reusable presentation capability warrants a new wrapper |

### Grid-to-DTO comparison

| Grid / calculation / action need | Frontend / backend property | Scope |
|---|---|---|
| Calculation target | key / Key, agreementId / AgreementId | Stable row identity and source provenance |
| Agreement No | agreementNo / AgreementNo | Render/export |
| Start Date | startDate / StartDate | Render/export |
| End Date | endDate / EndDate | Actual close is unavailable in scoped source; null, no scheduled return masquerading as close |
| Status | status / Status | Open/Closed translated |
| Charges Type | chargeType / ChargeType | Existing enum translated |
| Accrual | accrual / Accrual | Signed nullable policy-formatted money |
| Actual issue | issue / Issue | Visible when present; unknown amount not hidden |
| Calculation detail/export | estimated,alreadyInvoiced,accrualReversal,pricedEndDate | All consumed by dialog/export; backend owns operands |
| Saved-run grid/action | id,no,month,approvalStatus,isVoided,totalAmount,canDelete,canVoid | Exact lean monthly history, no tenant/audit/editor spill |

Only filter is required month: typed Date → calendar yyyy-MM → query key month → strict invariant parser. Complete bounded response, no paging/count API or remote grid-filter contract invented. Full arrays allow canonical local table controls, with export scope explicitly all prepared/saved rows. Domain DTO/nullability producer-consumer reconciliation remains part of final source review.

### Reference action classification

| Action | Classification and model reason |
|---|---|
| Prepare/Search/Reset/Export | Supported; monthly read path, phase2 |
| Save | Supported; immutable Pending snapshot, phase3 |
| Calculation detail | Supported; row evidence dialog, no read mutation |
| View saved run | Supported; stored immutable snapshot |
| Approval Status / Approve / UnApprove / Reject | Supported; same shared context/history and backend-authoritative eligibility |
| Void / Delete | Supported; paired retained cancellation or pristine draft delete under exact state guards |
| Journal / Log | Supported; root-owned original/reversal and recorded-write history |
| Generic CRUD Edit | Not Applicable; source-derived immutable snapshot, stale pristine draft deleted/reprepared |
| Invoice/receipt allocation, credit note, deposits, attachments | Not Applicable; this monthly accrual is not a customer invoice/payment/settlement/upload aggregate |

Full endpoint/request/result table is frozen in the domain/API handoff; all Supported paths require final producer/consumer checks before this review can claim source completion.

## Final reconciliation

| Gate | Evidence/status |
|---|---|
| Recipe drift | Initial all8 packets OK; final all8 check rerun at handoff. No canonical/template/manifest change; no regeneration or manual generated edit required |
| Screenshot/business/grid/calculation | Source matched: all pictured fields/actions represented using shared owners; actual EndDate remains null; signed values preserved; unsupported source amounts explicitly unknown/blocked, not silently posted |
| Request/persistence/action/paired journal | Controller/interface/service/VM/entity/config and Angular service matched. Save recalculates and compares key; first approval atomically posts both journals; UnApprove/Reject/Void/Delete guards and decision/EF logs traced |
| Route/provider/interceptors/translation | /Accruals lazy root imports ACCRUALS_ROUTES → AccrualsWorkspaceComponent; menu corrected from /Bill; exact component root added to tsconfig. Root BaseService HttpClient; no feature client/provider or manual token. Bilingual feature vocab registered |
| Loading | readPage uses defer start/finalize/end and versioned cancellation; mutations pair global start/end with busy/disabled; shared approval decisions retain their global owner. Route showPageLoading=true reaches sole layout shell host; duplicate table masks suppressed. Body dialog approval/log localReadProgress=true and DocumentJournal local StateMessage; calculation uses loaded row, no HTTP. Runtime visibility pending |
| Cache | No reference lookup consumed; actual GET inventory below is direct operational financial state. No cache owner/watch/invalidation/selected-option lifecycle is applicable, and no blanket GET caching was introduced |
| Performance | Source projection, bounded batched reads, prebuilt invoice links, split aggregate loads and branch/account grouped journal lines implemented. No measured timing claim; exact source/query/index disposition below; owner SQL/runtime acceptance pending |
| Guide | New UserGuide/content/accruals-topic.ts, registered in record-list-topics.ts and existing vouchers-journals group route filter. Existing sidebar groupGuide /UserGuide/vouchers-journals; bilingual steps/source exclusions/paired accounting/recovery reconciled with final source |
| Scoped diff / namespace/type/markers/whitespace | New source and Accruals-specific tracked hunks reviewed separately in each repository. Local imports, actual shared inputs/exports, Helpers/Business/VM/DataAccess namespaces/SDK references/DI scan/config sealing inspected. No markers/feature any/stale overrides; syntax/XML/JSON and scoped whitespace checks passed; compiler acceptance pending |

## Owner acceptance after source completion

Use a known base-currency tenant with active posting mappings and open month-end/next-month periods. Verify cold/warm Prepare, exact cumulative/discount rounding, no overrun beyond priced end, single-charge already-invoiced and multi-charge unknown attribution, negative values, both journal directions, duplicate Save/Approve retries, changed-source approval conflict, Reject/UnApprove/Void/history/period/allocation guards and both journals' atomic rollback. Compare saved snapshot and full Excel to server amounts. Inspect loading/cancellation under slow/error/stale responses, dialog progress, navigation/discard, Arabic/English/RTL/dark/narrow layout, and guide reachability. Measure fixed comparable tenant/month/row count/payload with repeated cold/warm samples (request/SQL command counts, actual plan/logical reads and p50/p95 load times); no source-only claim of speed.

## Final source/request evidence

Paths are relative to the applicable Git repository under F:/My Work/Sigma.

| Actual consumer / URL | Source owner and classification | Lifecycle/recovery |
|---|---|---|
| AccrualsService.prepare → GET Accruals/prepare?month | AccrualsService.PrepareCoreAsync; direct operational calculation | Workspace.prepare → readPage global defer/finalize, cancellation/version fence; inline Result/HTTP error and Retry; null operands/issues retained |
| AccrualsService.runs → GET Accruals/runs?month | GetRunsAsync; direct monthly state/eligibility | Saved-tab activation/request only; complete monthly result with local15-row paging; applied month guard |
| AccrualsService.detail → GET Accruals/runs/{id} | GetDetailAsync; direct immutable snapshot | Page-global read; returned id/month checked; detail Retry keeps context |
| AccrualsService.approval → GET Accruals/{id}/approval | GetApprovalAsync; direct live action/history | Shared tab global read; body dialog localReadProgress. Shared decision POST/failure/history refresh, no custom approval logic |
| AccrualsService.journal → GET Accruals/{id}/journal?reversal | GetJournalAsync; direct owned paired accounting | Existing DocumentJournal local read/StateMessage, errors/Retry and close cancellation. Distinct translated original/reversal headings and record subtitle |
| AccrualsService.log → GET Accruals/{id}/log | GetLogAsync → AuditTrailService.GetRecordAsync; direct captured history | Existing shared local dialog read, errors/Retry; root and related GUID identities tenant-checked before audit read |
| save/deleteRun/voidRun/decide → POST/DELETE frozen endpoints | SaveCoreAsync/DecideCoreAsync/VoidCoreAsync/DeleteRunAsync | Root shared navigation-write tracking; busy/disabled/forms and one mutation success owner. Inline request headers suppress duplicate global error dialog. Lost-response Retry reloads saved state, never automatically repeats the write |

No cache source or lookup API was added: account/currency policies are backend operational validation, not frontend reference options. Separate reference bootstrap/watch/tenant-topic/selected-label rules are Not Applicable because no such consumer exists. Auth currentUser context change clears prepared/saved/dialog state and fences pending reads; no stale financial snapshot crosses user/tenant/branch context. CanDeactivate and beforeunload cover unsaved preview/dirty Void; shared frozen-form confirmation preserves canceled drafts. Incomplete month typing remains invalid input, not a new context; Save/Search block until valid.

### Query and load-speed reconciliation

Before state: no Accruals API/screen; menu redirected to Bill. There is no valid measured before/after baseline. Existing rental invoice candidate reader is not an accrual endpoint and is not reused per agreement.

- Prepare has at most19 declared read/lookup boundaries on its normal full branch (some short-circuit); actual SQL commands include the existing resolver's own validation. They cover base currency/precision, two mappings and posting eligibility, bounded source IDs/charge count, consumed scalar agreement+charge projection, source reference metadata, period provenance/legacy numbers, effective invoice/line bounds and snapshot, linked agreement validity, and two bounded credit-note source sets. No awaited database operation occurs inside the agreement/charge loops. Invoice roots have one item collection; agreement roots use only consumed scalars instead of full notes/contact graphs. Invoice links are grouped once in memory, not rescanned as database/per-row requests. Actual EF projection/Concat SQL and plans remain owner verification.
- Prepared limits:1000agreements and10000charges/history populations; explicit conflict messages, no silent truncation or hidden all-pages HTTP loop. Full valid/issue rows are sent once; table paging is local and Excel uses that same complete array. Legacy header-only/multi-charge/credit-adjusted provenance issues block financial writes rather than altering volume/tenant/history semantics.
- LoadAsync uses bounded line/history Includes and AsSplitQuery for root/lines/history/paired journal details. This avoids a multiplication of snapshot rows × decision history × original details × reversal details. These are a fixed aggregate set of query boundaries, not one query per row. Stored detail reads have one owned child collection. Eligibility uses known header/month facts before additional source revalidation, and writers remain authoritative.
- Save recalculates under Agreement→InvoiceBase→JournalVoucherAllocation→AccrualRun application locks and one outer transaction, checks later month/reservation and persists root+rows once. Root snapshot GUID and child No values are set, so UnitOfWork.PrepareAddedNumbersAsync does not query document-number settings per snapshot child. No genuine journal number authority was bypassed.
- Approval revalidates the complete source/fingerprint and exact saved numeric/date/account/branch values. Journal creation groups equal account/branch/sign rows before passing to the existing resolver; original and reversal each preserve exact net/branch effect. Resolver validates header and distinct reference sets, account eligibility/no children, precision, periods and batched cost-center rules; its foreach loops do not perform per-detail EF reads. Journal header numbers still use the real journal number service twice. Several saves are atomic in the outer transaction. UnApprove/Void check both original dates and allocations; no change behind a later approved month.
- Calculation dialog has no extra request. Export does not fetch data and therefore has no report-read loading counter. Log includes one bounded union of snapshot/decision/journal-child GUIDs, then the existing audit reader; large captured audit payload/timing remains an owner measurement concern.

### Index evidence and disposition

| Query / physical mapping | Existing coverage and overlap evidence | Exact index / disposition | Benefit and cost / verification |
|---|---|---|---|
| AccrualRun live tenant/month reservation and monthly history | New table, no preexisting feature schema | Source-declared unique (SubscriptionId,Month,IsReserved), filter IsDeleted=0 AND IsReserved=1; separate unfiltered (SubscriptionId,Month) | Enforces one live month and supports retained rejected/void history; filtered index cannot cover all history. Extra write/storage cost intentional for invariant/history; owner migration/plan pending |
| AccrualRunLine detail/snapshot key | New table and FK to root | Source-declared unique (SubscriptionId,AccrualRunId,Key), filter IsDeleted=0; explicit Restrict relationships | Prevents duplicate source identity within live snapshot; width includes bounded100char key. Owner review schema/write/seek cost |
| Agreement base + RentalAgreement derived | AgreementConfig/RentalAgreementConfig map separate tables; inspected context and targeted migration-index names do not establish a tenant/date covering index. PK/FK coverage exists; deployed indexes unknown | Proposal only: Agreement (SubscriptionId,DateAndTime,Id) INCLUDE(IsDeleted), no filter. No source/index migration applied for this proposal | May bound tenant/cutoff base population; RentalAgreement still joins PK and filters void/complimentary. Date range cannot also guarantee final Id ordering. Additional insert/update/storage cost; reject if plans prefer existing tenant/PK path or cutoff covers most rows |
| InvoiceBase + Invoice + RentalInvoiceItem | Base/derived tables; RentalInvoiceItemConfig active unique (SubscriptionId,RentalAgreementId,FromDate,ToDate) and relationship FKs. Existing period index overlaps source probes but not full history/null-live coverage; deployed state unknown | Proposal only: InvoiceBase (SubscriptionId,InvoiceType,InvoiceDate,Id) INCLUDE(JournalVoucherId,AgreementNo,CurrencyId,Amount,IsDeleted), no filter | May reduce tenant/type/cutoff invoice reads; requires actual plan to choose this vs source-item FK probe. Wider index and amount/header updates increase storage/write maintenance; compare to existing production coverage before creating |
| CreditNote detail/allocation and small account/currency reads | Existing FKs/root identity and bounded roots; no actual bottleneck/cardinality evidence | No extra index justified now | Additional charge/journal/credit indexes without plan evidence would duplicate uncertain coverage. Evaluate only if fixed-month profiling identifies that query |

No proposed performance index was applied to existing tables. IsDeleted!=true includes live NULL; proposals deliberately have no IsDeleted=0 filter that would drop them. Unique new snapshot rows use explicit IsDeleted=false under the current audited creation contract. No SQL plan, elapsed timing or measured load-speed improvement is claimed.

## Files, schema and handoff

Backend new files: Helpers/Models/Vouchers/{AccrualRun,AccrualRunLine,AccrualApprovalLog}.cs; DataAccess/Configuration matching3configs; ViewModels/ViewModels/Accruals9DTOs; Business/IServices/IAccrualsService.cs; Business/Services/VouchersServices/AccrualsService.cs + .Prepare.cs + .Lifecycle.cs, internal AccrualPreparedSnapshot/AccrualAgreementSource/AccrualChargeSource carriers; ServerAPI/Controller/AccrualsController.cs. Existing files add3DbSets, append source/subtype enum values (no renumbering) and25matching bilingual GeneralMessage keys. No AutoMapper/overrides are needed. All9DTOs use own ViewModels files; classes' actual namespaces, Helpers own globals, Business own globals, SDK source inclusion and project references were checked. Sealed configs are discovered by DbContext's actual assembly filter; service IAccrualsService registers through existing Business interface scan. Carriers are internal classes without interfaces, not DI-scanned public records.

Frontend new files: Vouchers/Accruals/{accruals.routes.ts,models/accruals.ts,services/accruals.service.ts,components/workspace/accruals-workspace.component.ts/.html/.scss}; i18n/vocabs/accruals.ts; UserGuide/content/accruals-topic.ts. Existing integration files: pages/routing.ts, sidebar-menu-data.ts, en.ts/ar.ts, tsconfig.app.json, record-list-topics.ts and invoice-guide.ts. Feature SCSS only bounds its content/calculation layout; shared owners supply shell/control/table/tab/dialog/summary/error/RTL/theme. Prepared and saved rows are read-only, so DataTable applies; an EditableRows form collection would invent user-editable monetary inputs.

Schema changes: three new tenant/audited tables; root currency/month/fingerprint/precision/derived signed total/status/reservation/paired journal links/void reason/date/actor/rowversion; owned immutable line source IDs/dates/status/type/operands/account/branch snapshots; decision history. All strings bounded, all stored money18,2, explicit restrictive FKs and unique/index contracts. No column/data removal, legacy rewrite or guessed historical backfill. Existing rows are untouched. No matching AddRentalRevenueAccruals migration class existed at handoff lookup. Owner command:

```powershell
Add-Migration AddRentalRevenueAccruals
```

Review the generated migration against the current pending working-tree changes before application; unrelated pending schema work already existed. This task did not create/edit/run any migration or snapshot. Source parser/import-path/template checks passed on8feature/guide/vocab files;62English/62Arabic feature keys match;25English/25Arabic backend resource keys match, XML parses and compilation-root JSON parses. Syntax/source checks are not an Angular/.NET build or SQL translation proof. Scoped tracked diffs and full new files reviewed; no conflict/trailing-whitespace issue found. Final recipe drift check all8OK.

Suggested owner commits (not executed):

- Frontend: `feat(accruals): add monthly rental revenue workspace`
- Backend: `feat(accruals): add draft approval and paired revenue journals`
- Documentation: `docs(accruals): record contracts and source reconciliation`

Phases0–6 applied; phase2 is a bounded monthly read/workspace, phase3 an immutable derived draft, phase4 the approved financial lifecycle. Generic CRUD editing, uploads, settlement allocations, tax posting, lease/equipment scope and new permission mechanisms are Not Applicable/excluded with their domain reasons. Shared-extraction/learning gate: all needed common owners existed; the new calculations, lineage constraints and paired lifecycle are feature-specific. No new general rule/book/skill change was required.

Agent outcome: the bounded frontend/backend workers produced initial implementation, then both stopped on service usage limits before handoff. Root took over remaining controller/resources, source projection/discount and history checks, source guards/action/audit reconciliation, integration, guide and final review. No worker declared overall completion; no overlapping edits occurred after takeover. Initial delegation reduced independent layer implementation work; no further worker was started.

Known acceptance limits: source implementation is complete for the explicitly supported provenance. Legacy header-only invoices, multi-charge billed amounts without immutable split and effective linked credits remain visible blockers; exact historical allocation was not available and is never fabricated. Actual closure date remains unknown; earning stops at saved priced end. An all-zero draft cannot produce an empty posting. Owner still verifies compiler/startup/schema/EF translation/runtime accounting/visual behavior and reproducible timing. No build/test/lint/database/browser/migration/commit/push/deployment or prohibited MCP/Graphify tool ran.

## متابعة أخطاء المحرر — ٢٠٢٦/١٠/٢٦

نطاق صغير لإصلاح قائمة المالك المرفقة: ٦٤ رسالة، منها ٩ رسائل مساحة أسماء و٥٥ رسالة نوع غير معروف. جميع الأنواع المختلفة البالغ عددها ٢١ موجودة بتعريفاتها في المصدر. لا تغيير في العقود أو الحسابات أو الواجهة؛ شكل الشاشة والخلفية المجمدان باقيان كما هما.

الإصلاح المؤكد الوحيد في المصدر: إضافة الاستيراد المحلي لقاعدة الكيان إلى خدمة المخصصات؛ الاستيرادات العامة الخاصة بمشروع المساعدات لا تنتقل إلى مشروع الأعمال.

```text
SigmaBackend/SiGma.Business/Services/VouchersServices/ProvisionService.cs
using SiGma.Helpers.EntityBases;
```

أُعيد فحص تعريفات نماذج الاستحقاقات وتوزيع المصروفات واستيرادات المستهلكين، ومراجع المشاريع ومساراتها، والإدراج الضمني لملفات المصدر، وإعدادات بناء المشروعين في الحل وعضويتهما في ملف الحل المصفّى. لم يظهر نقص يبرر تعديل الاستيرادات الصحيحة أو إضافة نماذج بديلة. نسختا نماذج العرض في مجلدي المخرجات والمراجع لا تحتويان أسماء النماذج الجديدة؛ نسخة مرجع الأعمال لا تحتوي واجهتي الخدمتين الجديدتين. تواريخ هذه النسخ في ٢٥ أكتوبر تسبق ملفات المصدر المعنية. هذا يدعم احتمال استخدام مراجع تجميع قديمة؛ لا يثبت سبب تعطل آخر بناء أو ما يحمله المحرر فعليًا، وقائمة المالك لا تتضمن خطأ أوليًا من مشروع نماذج العرض.

التحقق المنفذ: مطابقة التعريفات والاستيرادات والمراجع، قراءة أسماء الأنواع في الملفات المجمعة الموجودة دون تحميل التطبيق، وفحص الفروق والمسافات للملف المعدل؛ محفوظة التغييرات السابقة. لم تُشغّل أوامر بناء أو اختبارات أو قاعدة بيانات، ولم تُعدّل ملفات التجميع أو إعدادات المشاريع. تحديث دليل المستخدم والكاش والتحميل والاستعلامات والفهارس غير منطبق على إصلاح استيراد فقط؛ الأدلة السابقة لا تتغير، ولا يوجد ترحيل جديد لهذا الإصلاح. لم تُستخدم وكلاء فرعيون لصغر المهمة وتسلسل تشخيصها.

التحقق المطلوب من المالك: إعادة بناء الحل بدءًا بمشروع نماذج العرض ثم الأعمال ثم واجهة الخادم. إذا فشل مشروع منتج، تُراجع أول رسالة في مخرجات البناء لذلك المشروع قبل رسائل الأنواع التابعة. إذا نجح البناء وبقيت رسائل المحرر النشطة، يُعاد تحميل الحل لتحديث التحليل. لا يُدّعى زوال الرسائل قبل هذا التحقق. اقتراح رسالة حفظ الإصلاح، دون تنفيذ حفظ:

```text
fix(provisions): import EntityBase for internal occurrence numbering
```

### متابعة أخطاء الاستثناءات — ٢٠٢٦/١٠/٢٦

قدّم المالك لاحقًا خمس رسائل محددة. تأكد نقص الاستيراد المحلي لمساحة استثناءات الترحيل في ملفي التحضير ودورة الحفظ؛ أُضيف الاستيراد الصحيح وأُزيل استيراد استثناءات المساعدات غير المستخدم. ملفات الفئة الجزئية لا تتشارك الاستيرادات، لذا لا يكفي الاستيراد الموجود في ملف الخدمة الرئيسي. هذا تصحيح لتقييم المتابعة السابقة: كانت مطابقة الاستيرادات غير مكتملة، وتفسّر هذه الأخطاء فشل إنتاج تجميع الأعمال الجديد؛ لا يكفي وصف الرسائل كلها بأنها مراجع قديمة.

```text
SiGma.Business/Services/VouchersServices/AccrualsService.Prepare.cs
SiGma.Business/Services/VouchersServices/AccrualsService.Lifecycle.cs
using SiGma.Business.Resolver;
```

طوبقت تعريفات استثناء الترحيل واستثناء ربط الحسابات واستثناء السنة المالية مع مساحة الاستيراد في الملفين. واجهتا خدمتي الاستحقاقات وتوزيع المصروفات وتعريفاتهما واستيراداتهما في المتحكمين ومرجع الأعمال موجودة وصحيحة مصدريًا؛ لم تُعدّل المتحكمات لتغطية خطأ المشروع المنتج. يُعاد بناء الأعمال ثم واجهة الخادم للتحقق من زوال الرسالتين التابعتين. لم يُشغّل البناء؛ لا ادعاء بنجاحه. التغيير استيرادات فقط دون أثر على العقود أو الحسابات أو دليل المستخدم أو التحميل والكاش والاستعلامات والفهارس أو الترحيل. فحص الحزم الثماني ناجح، والتحقق مصدري مع حفظ باقي التغييرات، ولا وكلاء فرعيين لصغر الإصلاح. اقتراح رسالة حفظ دون تنفيذ: `fix(accruals): import posting exceptions in partial service files`.
