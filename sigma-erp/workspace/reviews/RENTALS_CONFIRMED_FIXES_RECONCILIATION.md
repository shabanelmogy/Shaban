# Rentals corrective implementation — 2026-10-26

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | «عدل الملاحظات» and «كمل»; source implementation of confirmed R01–R12 |
| Contract | RENTALS_CONFIRMED_FIXES_CONTRACT_FREEZE.md — Frozen |

## Scope and preserved baseline

The eight active Rental roots, their directly owning five backend services, shared BranchTariffSettings consumer and existing bilingual Rental guide are in scope. The earlier read-only snapshot `RENTALS_FULL_STACK_REVIEW.md` and its three audit contributions remain historical evidence. Existing maintenance/shape exceptions and current endpoint/filter/page/write/approval/financial contracts are retained. No screenshots supplied. Tier L work reuses the Frozen Rental maintenance impact map. Unrelated customer/receipt/dashboard/shared-shell changes present at entry are not this task's changes.

All eight generated packets passed before implementation and again on continuation. Applicable PHASE00/01 contract discovery reused from the review, PHASE02–05 corrective implementation and PHASE06 reconciliation apply. No permission mechanism, new pricing formula, accounting state, unsupported tariff policy, master fields or voided-time-sheet eligibility has been invented. No index/config/entity/migration/snapshot source is authorized for modification.

## Finding disposition

| Finding | Final implementation evidence | Source verification / owner pending |
|---|---|---|
| R01 deleted tariff calculation children | Four filtered Includes match live/tenant scope and use AsSplitQuery; root default/daily/card rules and all formulas unchanged | Root reviewed full backend diff; fresh-context removed/replaced-child generated and stored charge reproduction pending |
| R02 main tariff/card draft route exits | Parent delegates actual mounted editor; deferred child decision/freeze and original disabled-state restoration | Full scoped diff reviewed; Back/menu/cancel/accepted navigation and pending decision acceptance pending |
| R03 voided planner occupancy | Planner agreement predicate adds !IsVoided, retaining other history/clipping scope | Root reviewed writer semantics; void then reload/overlap acceptance pending |
| R04 quotation URL grid state | Quotation activeFilters seeds initialGridFilters before ngOnInit applies route form values; existing return query serializer/filter count/page/export unchanged | Root reviewed full diff against current producer. URL/editor return and server filtering acceptance pending |
| R05 planner applied snapshot | Captured successful range/rows drive caption/slots; draft edits and failed requests do not relabel prior results; zoom reprojects displayed range | Root reviewed full diff; delayed request/filter changes and displayed range acceptance pending |
| R06 historical selection labels | Agreement/Booking initial detail labels merge for driver/customer/type/vehicle/staff and related saved selections; absent current choices are disabled. Quotation initial saved labels similarly preserved. Booking View reads detail only; Agreement View omits edit-only sources where detail labels suffice, retaining countries/master choices with no saved labels | Full diff reviewed against declared DTO labels, not invented fallbacks. Saved/View totals remain backend results; no new-choice eligibility or value rewriting. Owner inactive-selection/View acceptance pending |
| R07 lookup failure recovery | Quotation/Master lookup error/loading separate from grid; aggregate Retry reloads failed bootstrap and/or failed watches without resetting filters/form drafts. Contact retry uses its direct dependent request stream | Source false-envelope/HTTP/error/Retry flows reviewed. Delayed failures/recovery acceptance pending |
| R08 one progress owner | All four core lists and routed editor/detail/tax/tariff/contact bootstrap flags feed mounted aggregate ReferenceLookupStatus; auxiliary page bootstrap same owner. History/Journal/Logs/other body-dialog reads have local StateMessage with no hidden page count, masks suppressed. Tariff/card local read states; root branch settings local. Deposit source-customer failures now show local error/Retry; currency mounts after parent bootstrap and its signal query yields foreground while currency loads | Final source pairs/flags/finalize/DestroyRef and effective route metadata/actual shell/Dialog hosts reviewed. Query-only shared lifetime unchanged. Existing global-save counter and EditorDialog foreground retained. Runtime overlap/visibility/DI/timing acceptance pending |
| R09 actual cache adoption | Quotation/Master delegate approved exact URLs to Customer/Branch owners; Agreement list/editor/deposit adopts Customer/Branch/Country/PaymentMethod as consumed. Finite successful source read precedes separate once-bound watch with selected/current getters, error/Retry, null-context clearing and teardown; no financial-policy watch. Shared branch settings follows same lifecycle; retained refresh does not reload settings or reset draft | Root/source audit confirms source writers/imports/topics unchanged, all new watches use matching inline identity. Independent audit identified removed-on-refresh choices still enabled; resolved through existing binding optional disabled metadata and editable Select inputs. Runtime coalescing/expiry/context/rejoin/selection acceptance pending |
| R10 fresh driver edit eligibility | Both editing and Save consume row CanEdit; empty/invalid/pristine Save policy preserved | Root reviewed backend generated per-row flags and UI guards; invoice elsewhere then reload acceptance pending |
| R11 performance | Planner latest nullable status server scalar ordered CreatedAt/Id; client parsed intervals and stored cell statuses; Master DTO projection; Driver scalar option projection; tariff split query | Root reviewed unchanged mappings/DTO/type and filter/count/order contracts; SQL translation/plans/IO/cold-warm render/memory timing pending |
| R12 master existence flags | Both quotation actions use repository tenant/live scope matching writers | Root reviewed flags/callers and soft-delete behavior; delete draft then actions acceptance pending |

## Source/request/cache and loading reconciliation

The existing core/aux audits inventory every consumed URL, envelope and source classification. Approved ordinary Customer/Branch/Country/PaymentMethod references must use existing source services/cache/watch; Common GetMySetting remains a finite explicit singleton with no document-policy watch. Booking/options, tariffs/rates, operational choices and non-opted direct reference selectors retain their existing contracts. No general GET cache or source eligibility expansion is introduced.

Shared ReferenceLookupBindings uses successful finite bootstrap before separate watch, one binding key per mounted DestroyRef, selected-ID/current-option getters, fresh-only option assignment, explicit null-context clearing and teardown. No later watch merges old detail labels or writes defaults/form values. Retained-data refresh stays silent. Shared ReferenceLookupStatus uses page default and projected EditorDialog dialog scope. Independent write safety stays in the existing navigation activity owner; page counts are not write locks. Query/fragment-only route changes keep shared request/lookup lifetime unchanged.

Root BranchTariffSettings adoption reuses that exact owner without a new wrapper: initial local status aggregates settings+reference flags; successful initial row/label hydrate stays separate from branch-only watch; refresh Retry invalidates only Branch source and never reloads settings/replaces a draft. Both finite failure channels keep load Retry, saved labels and no editable partial snapshot. Busy/save/discard rules, full replacement PUT and branch adjustments are unchanged. Existing two routed Rental consumers and Lease inherit this existing shared owner behavior generally.

## Performance and index disposition

No elapsed-time success is claimed. Before: calculator joined four sibling collections and included deleted children; now live tenant-scoped split reads eliminate multiplicative sibling rows. Planner before materialized full status history in a separate read, now fleet projection returns one nullable latest status per vehicle, followed by booking and agreement reads (three source materializations instead of four for nonempty fleet). Preserve descending CreatedAt then Id. SQL translation/commands remain owner evidence, not inferred from source count.

Client before called reservationStatus five times per cell with repeated date parsing/scanning every template evaluation; now intervals parse on a successful snapshot and cell statuses compute once per result/zoom. Full fleet, HIR preference and half-open overlap rule remain. Master list still Count then stable page but projects existing map instead of materializing Customer/Quotation graphs. Driver options still settings then options but projects exact names/flags; display-name fallback logic remains. Booking/options richer metadata and financial settings stay direct, without parallel EF on one DbContext.

Reviewed index proposals in the original report remain hypotheses. Existing VehicleStatuses `(SubscriptionId,VehicleId,CreatedAt DESC,Id DESC) INCLUDE(Status,IsDeleted)` supports latest-state query; Tariff tenant/selection unique live key and child FKs remain. No new index is needed for these source corrections. Driver AgreementId FK coverage means no unsupported wide INCLUDE is adopted. Conditional Quotation tenant/date and **Agreement base table** tenant/date or tenant/vehicle/date candidates remain plan/cardinality-dependent, with write/storage/overlap costs recorded in the original review. TPT subtype fields are not falsely placed in a base-field index. No uniqueness/filter semantics changed and no migration command is required by this diff.

Owner measurement conditions remain same deployment, user/tenant/branch/language, device/network, source volumes, applied filters/order/page and cold/warm cache state; compare 3–5 samples per scenario. Capture route/grid/filter/editor ready times, requests/bytes, SQL commands/rows/IO/actual plans and browser CPU/memory. Include long history/fleet/monthly1h vs6h planner, four tariff child cardinalities with removed rows, long all-days timesheets, >200-row complete export and delayed failed/canceled reads. Preserve full output/count/page/state/tax/tenant/history contracts. No benchmark/test/database execution was authorized.

## Guide and final checks

Existing `UserGuide/content/rental-guide.ts`, GuideReader registration and `/UserGuide/rental` menu retained. Root updates EN/AR explanations for dirty exit, deleted tariff configuration, quotation return filters/recovery, applied planner periods/voided occupancy and fresh driver edit eligibility. Corrected source-unsupported Excel promises for tariff/card lists; no export action was added. Final guide coverage is reconciled after all consumers finish. No new vocabulary is expected; existing translated errors/Retry/shared progress are reused.

Three independent implementation workstreams use inherited model (core UI, auxiliary UI, backend) with nonoverlapping file ownership after Frozen root handoff. Root owns shared settings/guide/docs, full diff integration and final report. Earlier worker interruption left partial tariff/card changes that were preserved and completed; no application source was reset. Bounded read-only cross-audit of auxiliary/shared work follows implementation.

Final source checks: root syntax-parsed 32 changed TypeScript files and 18 changed Angular templates across 50 scoped frontend source files; resolved 530 local imports and inspected public inputs on 13 lookup-status hosts, with no issues. No application compiler/type checker was run. Root reviewed scoped backend service diffs, current namespaces/project references and existing GridFilterProjection/mapper contracts. No new .NET type or project inclusion is required. Scoped whitespace checks passed; merge-marker scan found none. PrimeNG installed Select declaration confirms optionDisabled; existing Angular21 signal viewChild is supported. Source checks do not prove runtime/SQL translation or successful compilation.

The independent final audit found a real refreshed-choice eligibility gap and a wrong status input; both were corrected before handoff. General retained-editor capability belongs to existing ReferenceLookupBindings, with final optional `disableRetainedOptions=false`. Editors opt true; filter compatibility is explicit because historical filter choices have different eligibility. Only absent selected source rows gain disabled metadata, incoming rows win, and reset/failure/teardown remain. `ui/02-service-and-response-wrappers.md`, execution skill and its dated revision row plus documentation changelog were updated together. All packets regenerated through the generator; refreshed UI2 dependency fingerprints in PHASE00/02/03/04/05/06 reviewed against unchanged template procedures and approved roles, PLAN00/PHASE01 content unchanged. All-eight final drift check passed.

No builds/tests/lint/browser/database/migration/commit/push/deployment was run. No index/schema/entity/migration/snapshot file was changed by this implementation. Owner-created migration is not required. Existing unrelated migration/snapshot changes remain untouched. Compilation, SQL plans/actual deployed indexes, concurrency, keyboard/RTL/theme/responsive/scroll/print and all reproduction/timing cases above remain owner verification, not closure claims.

Suggested commits (only scoped files; never executed): frontend `fix(rentals): preserve drafts, reference choices and planner state`; backend `fix(rentals): exclude deleted pricing and voided occupancy`; documentation `docs(rentals): reconcile confirmed fixes and reference eligibility`.

## Changed source manifest

Frontend — 50 files; root `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

```text
src/app/modules/Rental/Agreement/components/billing-history/billing-history.component.ts
src/app/modules/Rental/Agreement/components/delivery-date/delivery-date.component.ts
src/app/modules/Rental/Agreement/components/deposit/deposit.component.html
src/app/modules/Rental/Agreement/components/deposit/deposit.component.ts
src/app/modules/Rental/Agreement/components/details/details.component.html
src/app/modules/Rental/Agreement/components/details/details.component.ts
src/app/modules/Rental/Agreement/components/discounts/discounts.component.ts
src/app/modules/Rental/Agreement/components/documents/documents.component.ts
src/app/modules/Rental/Agreement/components/list/list.component.html
src/app/modules/Rental/Agreement/components/list/list.component.ts
src/app/modules/Rental/Agreement/components/logs-dialog/logs-dialog.component.html
src/app/modules/Rental/Agreement/components/logs-dialog/logs-dialog.component.ts
src/app/modules/Rental/Agreement/components/print/print.component.ts
src/app/modules/Rental/Booking/components/deposit/deposit.component.html
src/app/modules/Rental/Booking/components/deposit/deposit.component.ts
src/app/modules/Rental/Booking/components/details/details.component.html
src/app/modules/Rental/Booking/components/details/details.component.ts
src/app/modules/Rental/Booking/components/history/history.component.html
src/app/modules/Rental/Booking/components/history/history.component.ts
src/app/modules/Rental/Booking/components/journal/journal.component.html
src/app/modules/Rental/Booking/components/journal/journal.component.ts
src/app/modules/Rental/Booking/components/list/list.component.html
src/app/modules/Rental/Booking/components/list/list.component.ts
src/app/modules/Rental/Booking/models/options.ts
src/app/modules/Rental/DriverTimeSheet/components/list/list.component.html
src/app/modules/Rental/DriverTimeSheet/components/list/list.component.ts
src/app/modules/Rental/MasterAgreement/components/create/create.component.html
src/app/modules/Rental/MasterAgreement/components/create/create.component.ts
src/app/modules/Rental/MasterAgreement/components/list/list.component.html
src/app/modules/Rental/MasterAgreement/components/list/list.component.ts
src/app/modules/Rental/MasterAgreement/services/masteragreement.service.ts
src/app/modules/Rental/RentalPlanner/components/list/list.component.html
src/app/modules/Rental/RentalPlanner/components/list/list.component.ts
src/app/modules/Rental/RentalQuotation/components/details/details.component.html
src/app/modules/Rental/RentalQuotation/components/details/details.component.ts
src/app/modules/Rental/RentalQuotation/components/list/list.component.html
src/app/modules/Rental/RentalQuotation/components/list/list.component.ts
src/app/modules/Rental/RentalQuotation/components/master-agreement-dialog/master-agreement-dialog.component.ts
src/app/modules/Rental/RentalQuotation/services/rentalquotation.service.ts
src/app/modules/Rental/RentalTariff/components/details/details.component.html
src/app/modules/Rental/RentalTariff/components/details/details.component.ts
src/app/modules/Rental/RentalTariff/components/list/list.component.ts
src/app/modules/Rental/TariffCard/components/details/details.component.html
src/app/modules/Rental/TariffCard/components/details/details.component.ts
src/app/modules/Rental/TariffCard/components/list/list.component.ts
src/app/modules/UserGuide/content/rental-guide.ts
src/app/modules/shared/components/branch-tariff-settings/branch-tariff-settings.component.html
src/app/modules/shared/components/branch-tariff-settings/branch-tariff-settings.component.ts
src/app/modules/shared/models/dropdown-select.ts
src/app/modules/shared/service/reference-lookup-bindings.ts
```

Backend — 5 files; root `F:/My Work/Sigma/SigmaBackend`:

```text
SiGma.Business/Services/DriverTimeSheetService.cs
SiGma.Business/Services/RentalMasterAgreementService.cs
SiGma.Business/Services/RentalPlannerService.cs
SiGma.Business/Services/RentalQuotationService.cs
SiGma.Business/Services/TariffCalculateService.cs
```

Documentation: Frozen corrective handoff, this reconciliation, reviews/INDEX.md, execution SKILL.md, canonical UI2, documentation CHANGELOG.md and generator-owned affected packet fingerprints. Earlier Frozen review/audit snapshots are preserved.

## Permanent Vehicle alignment — owner amendment, 2026-10-27

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Scope | Tier S: align RentalAgreement Permanent Vehicle with search control boxes |

Active route: pages/routing.ts RentalAgreement → Agreement_Routes empty path → AgreementsComponent. UI shape: routed-document list; approved filter reference Workshop/Job/components/list. Backend shape and write contracts are not changed by this presentation-only request.

| Concern | Authority / actual source | Frozen change |
|---|---|---|
| Filter alignment | UI4; FilterPanelComponent stable grid; Rental Agreement main field #5 is sigma-filter-field--check, six total fields | Existing align-self:end places the checkbox against the bottom of the row, including DateRange reserved feedback. Reuse the shared heading/control-track implementation for direct checkbox fields in mixed stable grids, independently of inline action captions. Keep grouped checks, mobile standalone rows, 15px size, labels and 34px controls. No feature offset or new opt-in. |
| Reference match | Workshop Job list stableLayout; FieldError reserveMessage | Preserve stable top-alignment and feedback reserves; shared check track matches label/control tracks. |
| Business/API | permanentVehicle form/query → RentalAgreementService predicate RentalMasterAgreementId.HasValue | Preserve nullable boolean, reset, route serialization, search/paging/export and backend predicate. |

Implementation and final source reconciliation follow below. No separate freeze artifact or agent delegation for this small sequential correction.

### Final reconciliation of the alignment amendment

| Item | Result |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Implementation | FilterPanel SCSS reuses the existing two-track checkbox layout for direct check fields in a stable grid containing labelled fields. RentalAgreement already consumes stableLayout=true and the check modifier; no feature markup or form changes are needed. Direct-child matching excludes nested groups; checkbox-only grids retain their existing rules. The <=720px rules remove the extra heading and put input/label into row1. |
| Source checks | Reviewed complete scoped frontend diff, including pre-existing guide changes, and canonical UI4 diff separately in documentation repository. Scoped git diff --check passed. No TypeScript/import/DTO/translation-key change; existing label association and native keyboard operation preserved. |
| Loading and cache | Existing source/request/cache reconciliation above remains applicable. Agreement list switchMap/defer counted read and finalize release; finite six-source lookup forkJoin then separate Customer/Branch watch bindings; mounted ReferenceLookupStatus page owner/error/Retry are unchanged. Customer/GetSelect and Branch/GetSelect use approved cached sources; Staff/GetSelect, SourceCode/GetSelect, CustomerProject/GetSelect and User/GetSelect remain direct sources without opt-in. Writers/import/topic invalidation, selected IDs, context clearing and DestroyRef lifetime unchanged by SCSS. |
| Performance/index | No HTTP/SQL/query/filter/page/projection change; no source round-trip improvement or measured speed claim. The existing index assessment above applies; no new index justified by control alignment. Timing/SQL-plan checks remain owner-pending with the same deployment/data/filters/page/cold-warm conditions and 3–5 samples. |
| Guide | UserGuide/content/rental-guide.ts RentalAgreement topic updated bilingually; existing /UserGuide/rental menu/reader retained. |
| Documentation | UI4 and skill checklist plus revision row updated together. Regenerated all eight recipes through the generator; reviewed phase02 UI4 centering instruction and canonical dependency hash, unchanged business/phase authority, and final -Check passed all eight. Existing unrelated documentation changes preserved. |
| Phases | Proportional discovery, phase02 presentation correction and scoped final reconciliation. No detail/write/domain/backend implementation because none is changed. |
| Migration / mapping / calculations | None required or changed. |
| Agents | None: a small sequential correction does not meet the delegation gate. |

Owner check: open RentalAgreement on desktop and at <=1250px, confirm Permanent Vehicle centres with the search input boxes both with and without date validation feedback. At <=720px confirm a compact standalone checkbox row. Check Arabic/English, light/dark, keyboard label toggle, Search/Reset and advanced-filter expansion. Check a shared stable mixed-grid consumer and the existing inline-caption/grouped-checkbox consumer for regression. Runtime/visual verification was not executed.

Changed application files: shared/components/filter-panel/filter-panel.component.scss and UserGuide/content/rental-guide.ts. Documentation: UI4, execution skill, generated recipe fingerprints and this amendment. Frontend repository: F:/My Work/Sigma/SiGmaAngularFrontEnd; documentation repository: F:/My Work/Shaban Documents/Shaban. Workspace instruction/review files remain local as described in AGENTS.md.

Suggested frontend commit: `fix(filters): align checkbox filters with search controls`.
Suggested documentation commit: `docs(filters): document mixed stable checkbox alignment`.
No builds, tests, lint, browser/application/database verification, migrations, commits, pushes, deployment, Graphify or Sigma MCP commands were run.

### توضيح المالك — عدد أيام الإيجار من تاريخ البداية والإرجاع، ٢ نوفمبر ٢٠٢٦

وضح المالك بعد صورة 123.png: «انا عايز ان عدد الايام يتحدث من خلال تاريخ من والى». هذا يحسم المطلوب في عرض العدد وتحديث معامل الإيجار، ولا يطلب اختراع سعر تعريفة أو تغيير سياسة أسبوع/شهر. الصورة تثبت عرض تاريخي ٢ و٣٠ نوفمبر وسعرًا صفريًا؛ العدد المتوقع وفق فرق أيام التقويم القائم هو ٢٨. لا يثبت محتوى التعريفة ولا يلزم حسم سعرها لتنفيذ عرض الأيام. تعذر اتصال المتصفح موثق في تقرير السنة الحالية؛ لا ادعاء معاينة تشغيل.

الإصلاح S: كانت `durationDays()` موجودة وتطابق مالك الخادم (فرق تاريخي التقويم، ويوم واحد لفترة صحيحة في اليوم نفسه)، لكنها لم تعرض في بند الإيجار. أضيف عدد أيام للقراءة فقط داخل تفاصيل صف Rent باستخدام المالك المشترك للجدول ومفتاح `rentalAgreement.rentalDays` الموجود باللغتين؛ لم يستبدل حقل السعر. يعرض العدد مباشرة من حقلي التاريخ، مستقلًا عن نوع المركبة واستجابة التعريفة؛ نقص/عكس الفترة يعرض شرطة. أضيف العدد إلى الطباعة بنفس تفاصيل الصف القائمة. تصنيف العدد أيام صحيحة، فلا إدخال كميات كسرية أو سياسة مالية جديدة.

عند تغير النوع/التواريخ في محرر مؤهل، يجدد معامل الإيجار وإجماليه محليًا قبل طلب التعريفة. تعديل سعر Rent يستخدم عدد الأيام الحالي بدل معامل الفترة القديمة. بقية الحسابات والقراءة والإصدار والإلغاء والكاش والتحميل والحفظ تظل بعقدها الحالي، والمبالغ المرسلة مشتقة من الخادم عند الحفظ؛ لا ترسل الواجهة عدد أيام أو إجماليًا موثوقًا. View يحتفظ بالمبالغ المحفوظة ولا يعيد تسعيرها. لا API/DTO/AutoMapper/EF/هجرة/فهرس أو طلب إضافي لهذه الشريحة؛ مرجع دورة التأجير الحالي لا يقرر قاعدة مالية بديلة. لا وكلاء لصغر الشريحة.

الملفات: محرر RentalAgreement TS/HTML ودليل `/UserGuide/rental` الحالي. فحوص الصياغة TypeScript والقالب Angular وفحص الفروق المحددة والفراغات ومفاتيح اللغتين مصدرية فقط. قبول المالك: من ٢ إلى ٣٠ يعرض ٢٨ فورًا؛ تعديل الإرجاع إلى ٥ يعرض ٣؛ الفترة داخل يوم صحيح تعرض ١؛ المقلوبة/الناقصة تعرض شرطة؛ سعر يومي ١٠٠ لمدة ٣ أيام يعاين ٣٠٠ بعد اكتمال الحساب؛ عرض/طباعة عقد محفوظ لا يغيران مبالغه. لا tests/build/lint/DB/migration/commit/push/deploy. اقتراح commit فقط: `fix(rental): show and refresh rental day count from agreement dates`.

### متابعة تحديث إيجار العقد عند تغيير الفترة — ٢ نوفمبر ٢٠٢٦

التفويض: طلب المالك «تمام ظبطها»، ثم أوضح أن تغيير التاريخ لا ينتج عنه أي استجابة ظاهرة. شريحة S في محرر RentalAgreement الفعلي، بما فيه استخدامه المضمّن من الاتفاقية الرئيسية. استخدمت مهارتي Sigma والتشخيص المنهجي والتحقق قبل الإكمال من Superpowers؛ لا وكلاء لصغر الشريحة وتسلسلها. لا إعادة اعتماد لتصميم جديد أو تغيير قاعدة تسعير مالية.

الأدلة والحدود: المسار `Agreement_Routes` يستورد `DetailsComponent`. المصدر كان يراقب نوع المركبة والبداية والإرجاع، ويرسل بعد ٢٥٠ مللي ثانية إلى `Tariff/GetBookingCharges` بقيم محلية دون منطقة زمنية، ثم يستبدل صفوف الرسوم. الخادم يحسب الإيجار اليومي من نوع المركبة والفترة، ويعيد الحساب عند حفظ العقد، مع قبول سعر الإدخال كالسعر المتفق عليه. لا يوجد إثبات تشغيل لسبب عدم انطلاق الطلب في جلسة المالك؛ قد يتوقف الفرع قبل HTTP عند غياب نوع المركبة أو فترة صحيحة. لا ادعاء إعادة إنتاج الحالة أو قراءتها من قاعدة البيانات. المرجع المؤرخ لدورة التأجير وUI17/19/22 والعقود القائمة للأجر والحفظ والقراءات المباشرة تبقى المرجعية؛ لا تبنٍ لتسعير أسبوعي/شهري جديد.

العيوب المؤكدة مصدرّيًا: فشل تحديث التعريفة يبقي إجماليات الفترة السابقة ظاهرة، ولا يمنع Save في المحرر العادي؛ استبدال الصفوف يفقد سعر Rent المعدّل عند تغيير الفترة؛ وفرع نقص نوع المركبة/الفترة يعود بلا توضيح مخصص في قسم الرسوم. عولجت هذه الحالات فقط. صار `tariffReady` يبطل فور طلب إعادة الحساب/تغير السياق/إعادة التهيئة، ولا يعود إلا من استجابة حالية ناجحة أو تحميل عقد محفوظ. تُحجب إجماليات المحرر والملخص عند عدم الجاهزية، ويمنع الحفظ وإدخال سعر جديد بالاعتماد على حساب غير محسوم، مع الاحتفاظ بالمسودة وخطأ الخادم وRetry. تبقى حقول تصحيح النوع والتواريخ متاحة بعد فشل القراءة. أضيفت إرشادات ثنائية اللغة للنوع والتواريخ وتوضيح انتظار الحساب، باستخدام StateMessage العام بعقده الحقيقي دون spinner ثانٍ.

الإيجار لنفس نوع المركبة يحتفظ بالسعر الحالي المتفق عليه؛ معامل المدة يؤخذ من صف الخادم الجديد قبل تطبيق هذا السعر، بذات المالك المالي والتقريب الموجودين. تغيير النوع يحمّل سعر التعريفة الجديدة؛ لا يحمل السعر من نوع سابق. الإضافة والتعديل وإعادة المحاولة وتبديل السياق لا تقبل استجابة إصدار قديم. ظل اختيار الرسوم ومستلمها محفوظين بالمالك القائم، ولم تتغير قواعد بقية الرسوم أو طلبات الحفظ/DTO/AutoMapper/الخادم/EF. لا هجرة أو فهرس جديد لهذه الشريحة.

التحميل والأداء والكاش: يبقى طلب التعريفة قراءة تشغيلية مالية مباشرة غير مخزنة في cache، بنفس ٢٥٠ مللي ثانية وتأخير الدمج وإلغاء الطلب السابق وحدود الخادم؛ لا طلب لكل صف ولا طلب إضافي. ReferenceLookupStatus يبقى مالك التحميل العام في الصفحة والمحلي في النافذة حسب token، مع تحرير finalize وبوابات الإصدار والسياق. لا قياس شبكة/SQL/زمن أو ظهور تشغيلي، ولا ادعاء تحسن سرعة. دليل `/UserGuide/rental` محدث في مالكه الحالي.

قبول المالك المتبقي: نوع له سعر يومي ١٠٠ وفترة يومين يعرض ٢٠٠؛ تغييرها لخمسة أيام يعرض ٥٠٠ بعد الاستجابة؛ سعر يدوي ١٢٥ ثم ثلاثة أيام يعرض ٣٧٥؛ تغيير النوع يجلب تعريفته؛ التغييرات السريعة تعرض آخر فترة فقط. تحقق من التواريخ الناقصة والمعكوسة، غياب النوع، فشل HTTP وRetry ومنع الحفظ قبل نجاحه، فتح عقد محفوظ وعرضه دون إعادة تسعيره، واستخدام النافذة من العقد الرئيسي. هذه خطوات تشغيل مقترحة ولم تُنفّذ.

التحقق المنفذ مصدرّي فقط: مراجعة الفروق المحددة في مستودع الواجهة، فحص الصياغة TypeScript والقالب Angular، ومطابقة مفاتيح اللغتين تحت `rentalAgreement` مع العقود العامة للرسائل والتاريخ. لا builds/tests/lint/browser/DB/migrations/commit/push/deploy. رسالة commit مقترحة فقط: `fix(rental): reconcile rent totals with the current agreement period`.

### تصحيح المالك — استخدام بند الإيجار القائم، ٢ نوفمبر ٢٠٢٦

اعترض المالك على إضافة بند ظاهر للأيام لأن البند المناسب موجود. لذلك أُلغي عرض عدد الأيام الإضافي أسفل Rent وصفه الإضافي في الطباعة، وعاد تصنيف تفاصيل صف الإيجار السابق. بقي تحديث معامل الأيام والإجمالي في صف Rent الموجود عند تغيير البداية أو الإرجاع، وبقي حساب السعر اليومي مستخدمًا المدة الحالية. هذه المتابعة تسود وصف العرض المنفصل السابق في هذا التقرير؛ لم يُستبدل السعر بعدد أيام ولم يُنشأ بند رسوم أو حقل API أو مخطط جديد. حُدث دليل المستخدم والفهرس وتقرير الصورة ليصفوا النتيجة الحالية. فحص الصياغة والفروق مصدرّي؛ المعاينة التشغيلية متبقية لتعذر الاتصال، ولا اختبار أو بناء أو DB أو هجرة أو commit/push/deploy. الشريحة تصحيح عرض صغير لا يحتاج وكلاء أو تجديد عقد مالي. اقتراح commit فقط: fix(rental): reuse existing rent row for duration updates.
