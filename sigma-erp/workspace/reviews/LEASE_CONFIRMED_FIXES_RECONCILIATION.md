# Lease corrections — implementation reconciliation, 2026-10-27

## Lease Master Agreement approval badge column — 2026-10-28

Owner reports Approved badge appearing in Master Agreement No. Confirmed cause: custom numberTemplate rendered both number and status in the same cell; there was no separate approval column. Tier S, UI5/6 shared typed status column. Removed numberTemplate/ViewChild/TemplateRef/custom statusClass and defined approvalStatus as its own shared status column immediately after no. Status labels retain current enum Approved0/NotApproved1/Rejected2 and success/warning/danger colors. No feature CSS. Final grid maps No/Approval/Date/Customer/CustomerCode/QuotationRef to ListVM No/ApprovalStatus/Date/CustomerName/CustomerCode/QuotationNo. All fields already exist in the source response; backend unchanged. ApprovalStatus sorting stays off because current server sort switch has no such branch; existing numeric grid projection supports status filter choices. Excel now reuses the same column descriptors and no longer appends a duplicate status descriptor, retaining translated statuses and complete applied results.

Analysis gate reuses current source-route/guide evidence from the preceding second-row correction: original S269 and dated sidebar06/R0381 confirm list/status context, not visual layout; no further controller/business cycle applies to moving the already-returned scalar. UI6 and shared DataTableColumn/type-status/status renderer/export helper inspected. Updated /LeaseMasterAgreement topic in existing /UserGuide/lease reader. Existing loading/cache/performance source rows below remain applicable: no extra request, new cache, changed SQL predicate/projection, index or schema. No performance claim. Recipe all8 Check passed; complete scoped frontend diff and stale template/import reads reviewed, whitespace check reconciled. No subagent for this bounded fix. Owner build/visual/export acceptance pending; prohibited commands not run. Suggested frontend commit: `fix(lease): separate master agreement approval status column`.

## Lease Master Agreement filter actions second row — 2026-10-28

Owner requests the buttons on a separate second row. Tier S, UI4 shared FilterPanel owner, existing paged list/routed view shape (catalog02, approval-bearing record). Actual pages/routing.ts LeaseMasterAgreement import -> leasemasteragreement.routes.ts empty route -> LeaseMasterAgreementComponent traced. Removed only inlineActions=true and its unused inlineActionCaption from components/list/list.component.html; shared default false now places Reset/Search/Excel/Refresh in the toolbar below the unchanged five fields. No local CSS, new wrapper, action/validation/permission/query/backend change. Existing shared responsive wrapping/RTL/theme retained. Updated /LeaseMasterAgreement topic in UserGuide/content/lease-guide.ts, existing /UserGuide/lease reader. Scoped diff reviewed and diff --check clean; owner visual acceptance pending. No migration needed; suggested frontend commit: `fix(lease): place master agreement filter actions below fields`.

Analysis gate: read speed-analysis README, 2026-10-27 guide section16 master list row and original S269 library/pages/41eb2f187c26cb7b.html (Manage Master Agreements); dated2026-10-28 sidebar10-lease/screens/06-master-agreements.md R0381/C0886 and C0886 lines1–54. These establish functional search/export context, not button styling or server rules; layout evidence not applicable beyond unchanged actions. Owner request and UI4 public contract own the placement. Existing guide compared/updated. PHASE02 used only affected filter presentation after all8 recipe Check passed; no shared canonical change/regeneration or business-contract freeze needed.

Loading/cache/performance proportional reconciliation: existing list/export/approve reads/writes keep subscribed global start/finalize and DestroyRef, table indicator suppressed; routed customer bootstrap uses shared ReferenceLookupStatus page owner with loadingCustomers/referenceLookups flags and errors/Retry. LeaseMasterAgreementService.getList -> GET LeaseMasterAgreement is fresh operational, export pages same endpoint; CustomerService GetSelect is approved reference cache through finite getCustomers then separate watchCustomers/ReferenceLookupBindings, selected label preservation, source refresh/lookup-customers notifications, context clear/cancel and DestroyRef. No new request or source/cache policy introduced. Existing source conformance L12–L19 remains relevant; display-only placement does not alter query count, response volume or predicates, so no new index proposed and no speed claim. Runtime/network/timing/SQL verification remains owner-only. Source-only task; no subagent because one tiny tightly bounded edit; no builds/tests/lint/browser/database/migrations/commits executed.

## Lease Inquiry filter actions second row — 2026-10-28

Owner explicitly requests LeaseInquiry buttons in second row. Tier S bounded presentation correction: /LeaseInquiry -> LeaseInquiry_Routes -> LeaseInquiriesComponent current list uses shared FilterPanel with four fields and inlineActions/caption. Remove the two inline-only inputs, restoring existing shared default toolbar below the field grid. Search/Refresh/Excel and mandatory Reset stay in their existing projection with all handlers/types/busy/validation unchanged. Create stays in the existing title action slot; scope is filter actions. UI4 owns default second-row toolbar, spacing, RTL/theme/wrapping; no local style/new markup/shared rule. Existing modal-list screen01 and backend stateful aggregate exception unchanged. Current skill, Master1/5/7, UI4/22 and checked Phase02 apply; all8 recipe checks pass. Dated analysis sidebar10-lease screen04/R0374/C0868 binding read and existing Lease current-state review/guide compared: entry/actions are functional reference, foreign server rules/layout excluded. Pure placement needs no new business/API assumption.

Final source result: one template-line correction and bilingual UserGuide/content/lease-guide.ts /LeaseInquiry topic under /UserGuide/lease updated. Existing reference Customer finite bootstrap/watch/invalidation and global ReferenceLookupStatus source, direct operational LeaseInquiry list/read/export, switchMap/start/finalize/errors/Retry/DestroyRef stay unchanged. No new cache eligibility, per-row/serial/request/query/page/count/financial/state/DTO/AutoMapper/backend/schema/index/migration change; no index justified for this layout-only fix, no measured speed claim. Complete scoped frontend template diff and guide delta reviewed in frontend repository; whitespace checks pass. Existing shared default filter toolbar verified; no skill/book/generated edit required. Owner visual wide/narrow/RTL/theme/validation second-row placement and Search/Refresh/Reset/Excel acceptance pending; runtime/network/SQL timing unmeasured. No agent for small sequential input removal; no builds/tests/lint/typecheck/browser/DB/migrations/snapshots/Graphify/Sigma MCP/commit/push/deploy run. Suggested frontend commit: fix(lease): place inquiry filter actions below fields.

## Lease Tariff actions beside Search — 2026-10-28

Owner requests buttons in the same search row. Tier S Frozen presentation: active /LeaseTariff -> LeaseTariff_Routes -> TariffsComponent list; existing FilterPanel stable single unvalidated search has separate actions and branch-settings action in title. Adopt existing UI4 inlineActions=true, move the existing branch-settings button into appFilterActions with Search and mandatory shared Reset. Preserve button ID/handler/type/disabled/focus-return; no duplicate Reset, new CSS or header. Shared FilterPanel owns input-line alignment, action wrapping, RTL/theme/narrow layout. Shape screen02 list+routed editor; backend no change, Phase02 scoped presentation/source reconciliation. Initial all8 recipe checks pass. Read current skill/UI4 compact inline actions rule and actual component/template/styles; existing functionality matches approved shared single-search strip, no new shared rule/skill/generator change needed.

Analysis gate: reference entry/current tariff context and dated sidebar10-lease screen01/R0271/C1132 route binding read; existing functional tariff/branch settings context is retained, foreign layout/server/accounting rules excluded. Current in-app /UserGuide/lease topic /LeaseTariff updated bilingually for action placement. Page data still uses direct operational VehicleTypeService.getList -> Vehicle list, not cached GetSelect; no new cache/watch/invalidation/source eligibility. Existing list request switchMap/start global/finalize/DestroyRef/error/Retry remains; settings modal retains existing scope/guards, no new initial/filter requests, serial/per-row work or query/index/schema change. No measured speed claim; actual cold/warm network/SQL/render timing remains pending. All filter/search/reset/query URL/page/count, row actions, domain/DTO/AutoMapper/financial contracts untouched. Scoped frontend template diff and guide delta reviewed in its own repo; whitespace/conflict checks pass. Owner verification pending: wide/narrow/RTL/themes button wrapping/input-line alignment, Enter Search, Reset, branch-settings open/close and focus return. No agent for this small sequential slot/input adoption; no build/tests/lint/typecheck/browser/DB/migration/snapshot/Graphify/Sigma MCP/commit/push/deployment run. Suggested frontend commit: fix(lease): align tariff actions with search.

## Cost Setting duplicate message diagnosis — 2026-10-28

Owner reports Create Lease Cost Setting: “A lease cost setting already exists for this make and model.” Source-read-only bounded diagnosis: LeaseCostSettingService.AddSettingAsync performs tenant/live ExistsAsync by MakeAndModelId and intentionally rejects a second live setting. UpdateSettingAsync excludes current vm.Id from the same check. Repository.ExistsAsync scopes SubscriptionId and excludes IsDeleted==true, so other tenants/deleted rows do not cause this check. Current frontend editorMode create sends POST with selected numeric makeAndModelId; Edit sends PUT with existing setting Id. List openCreate uses create/null; no create/edit source mix-up found. Existing frozen contract and bilingual /UserGuide/lease topic explicitly allow one setting per make/model. Therefore preserve uniqueness rather than suppressing validation or automatically overwriting existing financial settings. Guidance: locate the selected model's setting and Edit it, or choose a different model. Actual conflicting row identity/state was not read from database; no claim of runtime/DB verification. No application/guide/schema/index/cache/loading source change justified by this message alone. All8 packets passed before investigation; no tests/build/lint/browser/DB/migration/commit/deployment executed. Existing source references S242/datetime code evidence remain applicable to context but grant no second-setting financial rule.

## Cost Parameter name width — 2026-10-28

Owner requests a wider Name box in Create Cost Parameter. Tier S bounded presentation fix: active /LeaseCostParameter -> LeaseCostParameter_Routes -> list modal app-lease-cost-parameter-details -> DetailsComponent's shared520px EditorDialog. Frozen choice is existing sigma-field--full on Name only, so it occupies available form width and Order follows below; Create/Edit use the same form. No new width/padding/style, field, validation, API/state/calculation/schema or unrelated change. UI screen01 simple modal/shared EditorDialog, Master1/5/7 and UI1/13/19, current skill and Phase03 apply; all8 recipe checks pass. Actual existing shared .sigma-field--full grid-column:1/-1 and .sigma-field input width100% own the change.

Analysis gate read reference entry/current chapter pricing context, S259 original local8e609c31e6a648ee and dated sidebar10-lease screen02/R0376/C0861 source: Name/Order and Save/Cancel are functional evidence only; no foreign modal style/financial/API rule imported. Existing guide /UserGuide/lease topic /LeaseCostParameter compared/updated bilingually. Editor consumes @Input saved parameter only, no initial HTTP lookup/read or cache/watch source; POST/PUT LeaseCostParameter still uses existing busy/error/dialog-saving/finalize/dirty close, all untouched. One class causes no new requests/SQL/per-row work, cache changes or index need; no measured speed claim. No new canonical rule/skill/generator maintenance needed. Complete scoped frontend template diff/guide delta and whitespace checked; no backend/DTO/AutoMapper/migration changes. Owner visual narrow/wide/RTL/theme/Create/Edit/focus/validation checks pending under source-only limits. No agents for one small sequential class change, no build/tests/lint/typecheck/browser/DB/migrations/snapshots/Graphify/Sigma MCP/commits/push/deployment run. Suggested frontend commit: fix(lease): expand cost parameter name field.

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | «نفذ الملاحظات», then «كمل» |
| Frozen handoff | [Confirmed corrections contract](LEASE_CONFIRMED_FIXES_CONTRACT_FREEZE.md) |
| Review baseline | [Current source review](LEASE_FULL_STACK_REVIEW.md), including the nine actual screens, active closed compatibility route and exact source/cache/loading/query inventories |

## Scope and implementation decisions

Implemented the source-supported corrections without changing Lease's existing two-axis approval cycle, editable manual rates, tax/number/currency authority, closed/void/invoiced guards, external financial/history blockers, SMS simulation or current route shapes. No new screenshots or workflows. Existing unrelated repository changes were preserved. This record supersedes the baseline's unimplemented dispositions only for the frozen corrections; historical findings remain recorded as review evidence.

Phase0 reused/verified actual route import and current source baseline; Phase1 froze contracts before delegation. Phases2/3/4 applied the relevant read, form and state/financial-action corrections; Phase5 reconciles shared owners/route/client/print/cache; Phase6 reviews the complete scoped source changes and handoff. No new planning/schema/approval-model phase was needed. Original fixed-five paging and rejected-navigation loading design remain excluded decisions, rather than invented amendments.

The owning shapes/references remain Job list/editor and shared EditorDialog/EditableRows for routed Agreement/Quotation/Tariff and one-child modal Inquiry/CostSetting; normal Parameter/Clause Type; read-only Master; operational derived SMS. The baseline grid column ↔ ListVM and filter/write/action tables remain applicable. Add/Update payloads gain no derived totals or label inputs. Read-only additions are six Agreement labels and ordinary Extend AdditionalChargesTotal; its preview consumes that field and defaults old responses to0.

### Correction ledger

| ID | Final source disposition / preserved contract |
|---|---|
| L01 | Ordinary Extend reads tenant/live/active additional amounts and includes them before the existing discount/tax calculation; readonly context + client preview agree. Booking charges alone no longer overwrite a total that included extras. |
| L02 | Both tariff failure channels preserve entered rates/selections, synchronous readiness fencing and switchMap replacement reject stale contexts; Save/button wait for successful current tariff and explicit Retry. Manual legitimate zero overrides remain permitted after a successful context. |
| L03 | Quotation edit reads/checks/reconciles/saves under Serializable and retains narrow tracked field updates. Removed full-root Modified overwrite; existing transition predicates remain. Actual concurrent SQL execution remains owner verification. |
| L04 | Active QuotationItem Add/Update/Delete/activation return localized parent-maintenance failure. Parent snapshots remain the writer. Four Tariff child controllers were already NonController: initial secondary finding is withdrawn, no redundant child-service edit. External standalone quotation-item writers must adopt the parent API. |
| L05 | Routed Agreement keeps application root visible; all four saved panels remain in DOM with inactive panels hidden in screen media only; shared print session/flow and no-print actions prepare complete output independently of the active tab/current or closed route. |
| L06 | Payment-instruction writer reuses retained tenant-owned one-to-one slot, soft-clears instructions/owned live cheques and never revives deleted cheque history. Serializable read/reconcile/save preserves read-only guards and existing unique schema. |
| L07 | Both quotation Can flags use repository-scoped live Master existence, matching writer availability after eligible draft deletion. |
| L08 | Agreement marks actual owned live rows deleted while retaining every external blocker and existing provision financial-history protection; Tariff's four collections and Inquiry items/stage histories use aggregate removal. No historical backfill/hard delete. |
| L09 | CostParameter PageNo lower-bound, valid default20/max200, last-page correction and long offset arithmetic preserve real total/order; complete GetSelect unchanged. |
| L10 | CostSetting tenant/model and Parameter/ClauseType trimmed-name invariants use existing ExecuteUniqueWriteAsync before duplicate reads/mutations. No schema key, null-live normalization or historic duplicate cleanup; database constraint proposals remain owner-reviewed options. |
| L11 | CostSetting list-map scalar label guards/fallback now match materialized model/make label, so column-filter/count/row/export membership use the same policy. |
| L12 | Quote/Master actual applied grid is seeded before first request/URL write; Tariff navigation forwards grid with applied paging/search and returns it. Clear/Reset semantics retained. |
| L13 | Eligible Branch/Customer/Vehicle/Country/PaymentMethod consumers use real finite source bootstrap plus separate once-bound watch, current selection/label getters, context cancellation/clearing, errors/Retry and DestroyRef. Customer adapters delegate to its real source; nonopted/operational/policy sources remain direct. |
| L14 | Required routed bootstrap uses ReferenceLookupStatus page lease; tariff read pairs global start/finalize; body-dialog joins/context tails use one local status. Shared error feedback no longer hides the remaining pending dialog tail; Retry waits for batch settlement. |
| L15 | Deposit customer/currency prerequisite and selected payment method detail expose local pending/error/Retry. Same-method Retry retains card/bank values; context/replacement reads are canceled/fenced; no client currency authority introduced. |
| L16 | Quote/Master outer bounded layers use shared print flow, navigation/footer/errors no-print. Quote's collection host also opts in to internal frame/column flow. |
| L17 | All nine global list grids explicitly suppress their local progress indicator; loading/busy/table inputs/errors/Retry remain. |
| L18 | Body-dialog reads release only local pending state; hidden global read counts removed. Save/domain writes retain global count and local foreground saving with all finalizers/guards. |
| L19 | Direct selector/edit detail labels merge only selected saved identities as disabled absent options; fresh source rows win. Context changes prohibit remerging old-context detail; forms/IDs/dirty state are preserved. |

Implementation evidence: [Backend corrections](Lease/LEASE_BACKEND_FIXES_20261027.md), [Agreement UI reconciliation](Lease/LEASE_AGREEMENT_FIXES_20261027.md), [Auxiliary UI reconciliation](Lease/LEASE_AUX_FIXES_20261027.md). Root integration additions are documented below. Source conformance and runtime acceptance are separate.

## Shared owners, documentation and guide

Existing ReferenceLookupBindings/mergeSelectOptions/ReferenceLookupStatus, LoadingService, EditorDialog, ReportPrintService and aggregate/unique writer helpers were reused. No competing feature wrapper/cache/loader/confirmation/print lifecycle was added. Shared extraction gate produced two bounded extensions:

- EditableCollectionTable's existing sigma-print-flow host releases internal fill/frame/max-height/table/column bounds and sticky cells, uses paper colors/wrapping and hides action/validation chrome. Actual ViewEncapsulation.None requires the real host selector. Agreement's four collections and Quote's printed collection adopt it. Shared marked routed editor layers become normal paper block flow; unmarked screen layout remains unchanged.
- ReferenceLookupStatus renders its sole local progress independently of an error from another batch member, with Retry disabled while pending. Page mode keeps its existing shell lease; retained-data revalidation remains silent. Inquiry/CostSetting/Agreement dialog tails inherit the correction.

Owning canonical UI14/21/22 and the screen skill's checklist/revision rows were updated in this task. Generated packets were refreshed **through the generator only**, semantically compared to current book ownership and Job/shared references, then all eight checked current. Effective changed dependencies cover phase02/03/05/06; full regeneration preserves all other packets. No direct generated edit.

In-app bilingual content updated at `SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/lease-guide.ts`; existing shared reader route `/UserGuide/lease`, reader registration and Lease sidebar entry remain. Nine topics + closed compatibility explain restored filters, tariff Retry/rate retention, all-section Print, extended totals, guarded approval/parent editing, payment-instruction reconfiguration and Deposit recovery. The guide retains money-received versus expected-deposit distinction, no-invoice/refund-on-Close, unavailable real SMS/email and all original prerequisites/limits. No new frontend vocabulary key; added backend parent-maintenance key exists once in neutral and Arabic resources.

## Performance and index disposition

Preserved baseline actual route/request/query inventory and output scope. Customer adapters now use existing finite shared acquisition/coalescing/watch instead of duplicate direct source reads. Context cancellation prevents stale pending options from repopulating. CostParameter materialization is source-bounded; no per-page-row query loop introduced. Added readonly labels extend the existing bounded Agreement projection; no recursive lookup HTTP round trip. Ordinary Extend adds its necessary active extra collection; owned delete loads required owned rows. State/slot guards and unique-writer locking intentionally add bounded isolation/lock work; no assertion these correctness changes reduce latency.

All review index alternatives remain proposals with exact keys/INCLUDE/null-live/TPT ownership/coverage/write costs in the backend audit. Existing selective master/tariff/FK/history indexes do not justify duplicate indexes. No entity/EF/schema/index/migration/snapshot changes were made for these corrections; **no new migration is required**. Deployed-index parity and historic duplicates were not inspected/altered.

Comparable timing/SQL-plan acceptance is pending: same code/schema/statistics, tenant/cardinality, locale/auth/filter/page/order/child count and device/network; separate cold/warm reference cache and initial usable/settled data. Capture repeated request/response bytes, command/row counts, actual plans/logical reads/server/network/render durations and median/spread. Cover first/deep/empty pages, 1/10/100 children, short/multi-year tariff, long logs and owned-delete volume, including lock contention. No measured speed claim or fabricated before/after result.

## Verification and owner acceptance

Root final source checks passed after integration:

| Check | Actual result / limits |
|---|---|
| TypeScript source syntax | 34 changed runtime/guide files parsed with the installed TypeScript parser; zero syntax diagnostics. No typecheck/compiler execution. |
| Angular template source syntax | 19 changed feature/shared templates parsed with installed Angular compiler's parseTemplate; zero parse errors. This is template parsing, not application compilation or runtime rendering. |
| Local imports | 577 source import paths inspected and resolved for parsed files; no unresolved relative/src imports. Shared inputs/Select disabled metadata traced to actual declarations. |
| Global grid loading | Nine actual list templates explicitly showLoadingIndicator=false, preserving loading/busy/aria-busy and sole rendered shell ownership. |
| Shared print style | New collection print block parsed as CSS source; real None-encapsulation host scope, internal frame/column constraints and existing shared values reviewed. Generic routed editor flow/paper selectors reviewed against the pre-task stylesheet copy. Actual pages/geometry remain pending. |
| Resources and vocabulary | Neutral/Arabic RESX parsed; new parent-maintenance key occurs once in each. Existing en.ts/ar.ts hashes exactly match implementation-entry copies: no unrelated vocabulary rewrite. |
| Backend imports/project wiring | Actual Agreement read VM namespaces match service imports; ActiveVm import matches its Helpers declaration; Business references ViewModels/Helpers/Repos/DataAccess; SDK default source inclusion retained. No entity/EF/snapshot/schema change. Compilation remains pending. |
| Scoped diff / whitespace | Complete scoped changes reviewed in their two actual Git repositories. Final diff --check clean for all scoped app/shared/style/resource files. Frontend prior shared-style/resource changes compared against entry copies; unrelated user/peer changes preserved. |
| Independent final audits | Agreement reviewer inspected complete24-file slice, auxiliary reviewer complete28-file slice; both final reports record no remaining confirmed scoped mismatch. Independent backend final reviewer traced actual unique-write/tenant/includeDeleted/delete/audit/cheque helpers and found no confirmed introduced defect. Their pending SQL/runtime caveats remain. |
| Documentation/packets | UI14/21/22 match real shared implementation; skill rule+revision rows promoted in same task. Generator refreshed derivative packets and all8 checks pass at final handoff; semantic review confirms current provenance/reference roles and print/loading requirements. |
| Artifacts | Frozen contract and final ledger linked to all3 correction contributions; status tables, links and merge-marker inspection checked. Old source-review snapshot preserved with explicit later implementation link/corrected Tariff assertion. |

No builds, tests, lint, browser/app runtime, database commands, migrations, commits/pushes or deployment ran. Source parsing does not establish compilation, SQL translation, actual printed pages, loader geometry, cache notification timing or concurrency interleavings. All frozen confirmed correction groups are reconciled in source; the explicit excluded decisions and owner acceptance above remain open.

Changed application inventory: **56 frontend files** (52 Lease, existing Lease guide, global print styles, shared collection SCSS and shared lookup-status template) and **13 backend files** (8 services, 1 mapper, 2 read VMs, 2 localized resources). No new runtime file or tsconfig change. The full per-file inventory follows for reproducible scoped review.

Owner acceptance: transient tariff failure/retry/current-context save; all Agreement tabs/current+closed print and long Quote output in RTL/light/dark; slow failed-member/pending-member dialog joins; cold/warm reference bootstrap, remote source invalidation and context reset before/after first success without draft loss; filters across editor/back/reload/export; concurrent quote edit/approve, duplicate model/name saves, instruction clear/reselect under declared unique schema, and owned deletion with every financial/history blocker. Retain original tax/discount/amount/remaining-deposit semantics and complete filtered exports.

Suggested repository commits (not executed): frontend `fix: reconcile lease editors, lookups and complete printing`; backend `fix: protect lease totals, state and owned persistence`. Instruction/documentation owner may separately commit updated canonical guidance/skill/packets/reviews. Delegation used three inherited-model bounded workstreams after freeze to avoid frontend/backend overlap; root owned contracts, shared integration, guide, vocabularies/docs, complete final reconciliation and targeted read-only follow-up audits after interruption. No worker declares overall completion.

## Exact scoped application inventory

Frontend repository: F:/My Work/Sigma/SiGmaAngularFrontEnd

```text
src/app/modules/Lease/LeaseAgreement/components/additional-charges/additional-charges.component.ts
src/app/modules/Lease/LeaseAgreement/components/billing-history/billing-history.component.ts
src/app/modules/Lease/LeaseAgreement/components/closing/closing.component.html
src/app/modules/Lease/LeaseAgreement/components/closing/closing.component.ts
src/app/modules/Lease/LeaseAgreement/components/delivery-date/delivery-date.component.ts
src/app/modules/Lease/LeaseAgreement/components/deposit/deposit.component.html
src/app/modules/Lease/LeaseAgreement/components/deposit/deposit.component.ts
src/app/modules/Lease/LeaseAgreement/components/details/details.component.html
src/app/modules/Lease/LeaseAgreement/components/details/details.component.scss
src/app/modules/Lease/LeaseAgreement/components/details/details.component.ts
src/app/modules/Lease/LeaseAgreement/components/discounts/discounts.component.ts
src/app/modules/Lease/LeaseAgreement/components/documents/documents.component.ts
src/app/modules/Lease/LeaseAgreement/components/driver-replacement/driver-replacement.component.ts
src/app/modules/Lease/LeaseAgreement/components/extend-period/extend-period.component.ts
src/app/modules/Lease/LeaseAgreement/components/extend-period/extend-rate-period.component.html
src/app/modules/Lease/LeaseAgreement/components/extend-period/extend-rate-period.component.ts
src/app/modules/Lease/LeaseAgreement/components/list/list.component.html
src/app/modules/Lease/LeaseAgreement/components/list/list.component.ts
src/app/modules/Lease/LeaseAgreement/components/logs-dialog/logs-dialog.component.ts
src/app/modules/Lease/LeaseAgreement/components/payment-instructions/payment-instructions.component.ts
src/app/modules/Lease/LeaseAgreement/components/vehicle-replacement/vehicle-replacement.component.html
src/app/modules/Lease/LeaseAgreement/components/vehicle-replacement/vehicle-replacement.component.ts
src/app/modules/Lease/LeaseAgreement/models/details.ts
src/app/modules/Lease/LeaseAgreement/models/extend.ts
src/app/modules/Lease/LeaseClause/components/clauses/clauses.component.ts
src/app/modules/Lease/LeaseClause/components/details/details.component.ts
src/app/modules/Lease/LeaseClause/components/list/list.component.html
src/app/modules/Lease/LeaseCostParameter/components/list/list.component.html
src/app/modules/Lease/LeaseCostSetting/components/details/details.component.html
src/app/modules/Lease/LeaseCostSetting/components/details/details.component.ts
src/app/modules/Lease/LeaseCostSetting/components/list/list.component.html
src/app/modules/Lease/LeaseCustomerSms/components/list/list.component.html
src/app/modules/Lease/LeaseInquiry/components/details/details.component.html
src/app/modules/Lease/LeaseInquiry/components/details/details.component.ts
src/app/modules/Lease/LeaseInquiry/components/list/list.component.html
src/app/modules/Lease/LeaseInquiry/components/list/list.component.ts
src/app/modules/Lease/LeaseInquiry/components/logs-dialog/logs-dialog.component.ts
src/app/modules/Lease/LeaseInquiry/models/details.ts
src/app/modules/Lease/LeaseInquiry/services/leaseinquiry.service.ts
src/app/modules/Lease/LeaseMasterAgreement/components/details/details.component.html
src/app/modules/Lease/LeaseMasterAgreement/components/details/details.component.ts
src/app/modules/Lease/LeaseMasterAgreement/components/list/list.component.html
src/app/modules/Lease/LeaseMasterAgreement/components/list/list.component.ts
src/app/modules/Lease/LeaseMasterAgreement/services/leasemasteragreement.service.ts
src/app/modules/Lease/LeaseQuotation/components/details/details.component.html
src/app/modules/Lease/LeaseQuotation/components/details/details.component.ts
src/app/modules/Lease/LeaseQuotation/components/list/list.component.html
src/app/modules/Lease/LeaseQuotation/components/list/list.component.ts
src/app/modules/Lease/LeaseQuotation/components/master-agreement-dialog/master-agreement-dialog.component.ts
src/app/modules/Lease/LeaseQuotation/services/leasequotation.service.ts
src/app/modules/Lease/LeaseTariff/components/list/list.component.html
src/app/modules/Lease/LeaseTariff/components/list/list.component.ts
src/app/modules/UserGuide/content/lease-guide.ts
src/app/modules/shared/components/editable-collection-table/editable-collection-table.component.scss
src/app/modules/shared/components/reference-lookup-status/reference-lookup-status.component.html
src/styles.scss
```

Backend repository: F:/My Work/Sigma/SigmaBackend

```text
SiGma.Business/MapperConfig/LeaseCostSettingProfiler.cs
SiGma.Business/Services/AgreementServices/LeaseAgreementService.cs
SiGma.Business/Services/ClauseTypeService.cs
SiGma.Business/Services/LeaseCostParameterService.cs
SiGma.Business/Services/LeaseCostSettingService.cs
SiGma.Business/Services/LeaseInquiryService.cs
SiGma.Business/Services/LeaseQuotationItemService.cs
SiGma.Business/Services/LeaseQuotationService.cs
SiGma.Business/Services/LeaseTariffService.cs
SiGma.ViewModels/ViewModels/LeaseAgreement/LeaseAgreementDetailVm.cs
SiGma.ViewModels/ViewModels/LeaseAgreement/LeaseAgreementExtendContextVm.cs
SiGma.Helpers/Localization/Shared/GeneralMessage.resx
SiGma.Helpers/Localization/Shared/GeneralMessage.ar-SA.resx
```
