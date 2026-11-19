# Industries feature review

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |

## Manifest

Authorized review and implementation for `src/app/modules/Administration/Industries` and directly related backend files. Tier M screen01, Pattern1. References, scope, decisions, action/read/write contracts and initial conformance evidence are frozen in INDUSTRIES_FRONTEND_BACKEND_CONTRACT_FREEZE.md; bounded persistence plan is INDUSTRIES_MAINTENANCE_EVOLUTION_PLAN.md. No screenshots/video; source evidence only. Recipe -Check passed for PLAN00 and PHASE00–06 on2026-10-14; no packet refresh required. Unrelated pre-existing work is preserved, including owner migration deletions/new migration/snapshot changes.

## Confirmed findings

| Finding | Owner | Resolution |
|---|---|---|
| Legacy table-list, untyped data, no server pager/sort contract | Phase2 | Shared typed DataTable, applied name filter, authoritative totals, paging/sort/Excel |
| Single-name editor routed, phantom controls and server-owned payload | Phase3/5 | Controlled Create/View/Edit dialog, typed name payload and numeric identity |
| Missing error/finalize, stale-read and duplicate execution protection | Phase2/3/4 | Existing shared query/state/feedback owners and bounded guards |
| Delete without confirmation and generic delete lacks usage check | Phase4 | Shared record confirmation and scoped usage-safe helper |
| Missing required/max consistent name validation and unique protection | Phase1 | max250 from existing Add contract, exact UniqueColumns rule, EF length/index |
| Oversized read VMs and reverse mappings | Phase1 | Id+Name, one-way mappings, remove unused FullListVM |
| Missing dirty-exit and bilingual screen guide | Phase3/5/6 | Deferred discard shared form freeze/route guard, Administration topic |

## Changes and phases

Phases0/1: source discovery, frozen shape/API/action/route contracts and the bounded persistence plan. Phase2: typed shared list, Name filter, sort/paging/route state and all-pages Excel. Phase3: controlled name-only Create/View/Edit dialog, validation, retry and draft retention. Phase4: confirmed Delete and usage-aware backend helper. Phase5: parent refresh, deferred exit guard and redundant IndustryService registrations removed. Phase6: separate repository diff review, contract/source conformance and bilingual user-guide handoff. Child collections, dates, files, finance, approval/activation and print workflows are Not Applicable; Industry has none in the frozen screen contract. No screenshot evidence or required Missing/Conflicting/Uncertain decision remains.

Frontend changed files, under `F:/My Work/Sigma/SiGmaAngularFrontEnd/`:

- `src/app/modules/Administration/Industries/components/list/list.component.ts` and `.html`.
- `src/app/modules/Administration/Industries/components/details/details.component.ts` and `.html`.
- `src/app/modules/Administration/Industries/models/create.ts`, `details.ts`, `list.ts`.
- `src/app/modules/Administration/Industries/services/industry.service.ts` and `industry.routes.ts`.
- Removed both empty feature component `.scss` files and both copied `.spec.ts` scaffolds, which tested unrelated RentalQuotation/widgets components rather than Industries. No replacement ceremonial tests were created.
- Shared wiring/content deltas only: `src/app/_metronic/layout/layout.module.ts` removes IndustryService import and two legacy registrations; `src/app/modules/i18n/vocabs/en.ts` and `ar.ts` change only industry keys; `src/app/modules/UserGuide/content/administration-guide.ts` adds the Industries topic. Baseline snapshots prove other pending shared-file changes were preserved, ignoring line-ending representation.

Backend changed files, under `F:/My Work/Sigma/SigmaBackend/`:

- `SiGma.Business/Services/IndustryService.cs`: UniqueColumns(Name,IndustryNameExists) and usage-safe RemoveAsync.
- `SiGma.Business/MapperConfig/IndustryProfiler.cs`: four directional maps.
- `SiGma.DataAccess/Configuration/IndustryConfig.cs`: Name length250 and tenant/live-row unique index.
- `SiGma.ViewModels/ViewModels/Industry/IndustryUpdateVM.cs`, `IndustryDetailVM.cs`, `IndustryListVM.cs`; removed unused `IndustryFullListVm.cs`.
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx` and `.ar-SA.resx`: IndustryNameExists only. Existing Country/CustomerRequest/Currency/SponserShip changes are preserved and excluded from this deliverable.

Entity, controller, interface, shared engine, select API and authentication contracts remain unchanged. No entity/nullability property, accounting calculation or navigation was added/removed. Add/Update retain the existing one-save backend owner; no feature transaction or formula was introduced. Read shape intentionally narrows to identity and displayed Name. Update max50 changes to250 to match the existing Add contract.

## Final reconciliation

| Comparison | Final evidence / result |
|---|---|
| Grid ↔ ListVM | `IndustriesComponent.columns=[name]` (text, sortable, View link); shared Actions first. IndustryDTO / IndustryListVM exactly `[id/Id,name/Name]`; no audit/plumbing fields |
| Filters ↔ query ↔ backend | form.name trimmed into appliedFilters; IndustryService.getList → toListParams → Filters[name]; base BuildFilterPredicate uses case-insensitive property lookup and text Contains. Empty value omitted; no boolean/date/enum/multiselect filter applies |
| Paging ↔ count ↔ grid | resolveListPaging compares previous page/size; current shared DEFAULT_PAGE_SIZE15; server base clamps supplied size1–100 and CountAsync supplies TotalCount/TotalPages; grid uses API total, not array length |
| Sorting | Only columns with sortable=true are accepted; Name stored-column sort supported by ApplyListOrder; stable Id tie-breaker inherited |
| Export | Applied filters/current sort, fetchAllPages size100, dataTableExportRows translated at click time, Name only; failed page/empty result gives inline feedback and no partial file |
| Detail/form ↔ writes | Detail numericId+nullableName; name-only typed form; POST name / PUT id,name; Required+max250 on form and backend; tenant/audit excluded |
| Validation/uniqueness | Inherited Add/Update call InvalidInputAsync with UniqueColumns and exclude current id; current trim/collation owners retained; filtered unique index supports final concurrency protection after owner migration |
| Mapping | AddVM→Industry, UpdateVM→Industry, Industry→DetailVM, Industry→ListVM; no ReverseMap or Ignore |
| Delete | Shared record confirmation identifies name/id, guarded request, scoped RemoveAsync calls RemoveWithChildrenAsync. No inbound Industry navigation found in model inventory; EF metadata validates real usages. Success refreshes applied query; last row on later page steps back |
| Exits | X/Cancel/Escape and list CanDeactivate reach deferred editor decision; dirty draft frozen through freezeFormState. Accepted close checks independent load/save gates because pending releases after emission. View/pristine close directly; frozen mock draft blocks route/Escape until Apply/Cancel; failed detail may close |
| Failure ownership | List/detail/export suppress global failure dialog and use shared inline message helpers/Retry. Mutations use global interceptor for both channels, preserve draft/row and no duplicate toast. finalize releases load/busy on every outcome |
| Stale/lifetime | list Subject/switchMap/defer cancels replaced read before starting the next counter; subscriptions tear down with DestroyRef. Dialog remount and id/visibility checks prevent stale patching |
| Routes/providers | Existing /Industry lazy route and menu; one child list route with CanDeactivate. Root service/environment URL resolves app.module.ts’s only token/error HttpClient chain; no bearer/manual client fork |
| Translations | industry block23 keys in EN and AR; parity0 missing/0 case differences; currentPageReport uses {first}/{last}/{totalRecords}; Arabic retains sidebar term الصناعات |
| User guide | ADMINISTRATION_GUIDE topic industry.title → /Industry; existing reader imports it; existing Administration sidebar guide link /UserGuide/administration. Purpose, sign-in/menu, search/paging/Excel, modes, required/name limit, duplicates, delete/discard/retry/mock/manual Save are bilingual and match final source |

## Reference conformance after implementation

| Concern / book | Actual target and producer evidence | Source result |
|---|---|---|
| Host/shell UI1 | IndustriesComponent host sigma-route-host → styles.scss height100%, min-height0 and overflowhidden; shared list-page/panel/header/table flex chain | Matched Job shell; no feature CSS |
| Title UI3/24 | list FeatureTitle title/manage/icon/Create; shared FeatureTitle default8px host margin/paint and narrow action wrapping | Matched; no feature offsets/paint |
| Filters UI4 | FilterPanel imports from actual component/directive owners, stableLayout=true/mainColumns1, Reset→resetFilters; single labelled native name control; Search submit/Excel through appFilterActions | Matched shared34px controls and default gaps; simplified fields are domain-specific |
| Grid UI5/6/7 | fill=true/lazy=true, rows/page/API total and currentPageReport; DataTable owns row viewport/pager/action-first/link formatting | Matched public inputs; no paginator/deep overrides |
| Editor UI13/15 | IndustryDetailsComponent supplies visible/mode/contentPadded and default shared width/max bounds; form/body/scroll all flex-fill (content-sized alternative), FormSection compact, no tabs for one group | Matched controlled composition; header/footer fixed and one inner scroll owner |
| Validation/focus/states UI19/22/27/28 | FieldError below name with label/id/aria association; touched validation and focusField; StateMessage loading/error, retry and public API types | Matched imports, exports, registration and supported inputs |
| Backend BE3/4/8/13 | UniqueColumns and RemoveAsync mirror current approved BranchService hooks; directional profile mirrors BranchProfiler; lean detail identity shared owner | Matched; remaining generic methods inherited |
| Responsive/theme/print UI1/24/25/29 | Global/list/component owners supply logical layout, tokens, bounded scroll and print release; no local stylesheet remains | Source conformance; visual/keyboard/runtime acceptance pending |

Reference action inventory: Create, View, Edit, Delete and Excel Supported. Job Labour Time, Invoice Customer, Close, Cancel Job, Quality Check, Logs, Estimation, Print Gate Pass and Lubrication Job Not Applicable: Industry has no job/document/vehicle/estimate/invoice/state/child aggregates. No unsupported target action or placeholder is added. Service override audit finds only UniqueColumns (business key) and RemoveAsync (usage-safe soft deletion); controller has none. SearchColumns, filters, ordering, read, Add and Update remain inherited because no distinct feature implementation is required.

Authorization candidates: POST Industry (create), PUT Industry (edit), DELETE Industry?id (delete). Current authentication and tenant boundary apply; no per-action authorization was invented or claimed.

## Responsive source matrix and owner acceptance

| Width / condition | Expected arrangement from inspected shared CSS |
|---|---|
| >1250px | Configured one-track Name filter; fixed title/filter/toolbar; filling grid rows scroll |
| 1200–1250px | Shared filter3-track grid with one occupied Name field; toolbar retained; controls remain bounded |
| >720 and <1200px | Shared initially-expanded Filters disclosure; same controls/actions remain mounted when collapsed |
| <=720px | Single filter track; toolbar stacks/wraps; shared page/panel narrow padding, table remains sole row scroll |
| <=650px | Shared title/action row wraps and uses shared compact Create sizing |
| Dialog1099/767/620 boundaries | EditorDialog public94vw/narrow width bounds and shared narrow footer behavior; content-sized form shrinks/scrolls within maxHeight |
| Short height, longName, EN/AR, RTL, light/dark, print | Existing component/global logical tokens, wrap/scroll/print owners; owner visual acceptance pending at each boundary and nearby sizes |

No known target-specific responsive CSS mismatch remains; inspection does not prove actual viewport fit, focus return or runtime behavior.

## Verification and limits

- Separate scoped frontend/backend Git diffs reviewed; exact task deltas in pre-modified frontend shared files were additionally reviewed against temporary pre-task snapshots. Unrelated changes retained. git diff --check reported no whitespace errors; line-ending conversion notices are Git configuration notices.
- Source-only syntax parsing of11 TypeScript files and2 Angular templates reported0 diagnostics. This uses createSourceFile/parseTemplate only, not type checking, compilation, build, lint, tests or application execution. Exact shared exports, standalone registrations and input names were separately inspected.
- Both resource XML files parsed; IndustryNameExists appears once in each. Removed FullListVM and old create/details URL symbol scans found no remaining direct source consumer. No any/ms-lib/table-list/stale styleUrl/ReverseMap/Ignore/server-owned payload/merge-marker copy remains in Industries.
- Recipe check remains green for PLAN00 and PHASE00–06. No canonical/template/manifest change, so no generation refresh needed.
- Current book snippets in BE5/6/13 contain historical examples suggesting list overrides/manual checks or a different detail route. Current BE8/9/13 guidance and actual BranchService/base controller establish the inherited hooks/plain GetById route used here; those historical snippets were not copied. No unrelated book rewrite performed.

## Migration and manual verification

Owner must run `Add-Migration ConfigureIndustryNameConstraints` (no existing migration of that name found). Reason: EF changes Name storage to max250 and adds unique `(SubscriptionId,Name)` filtered by `[IsDeleted] = 0`. Nullability remains nullable; no columns removed. Before applying, inspect live duplicates under the current collation, null/legacy flags and overlength names. No automatic deletion/cleanup/backfill was performed. Existing owner migration/snapshot modifications are untouched.

Owner checks: compile frontend/backend; review/apply the migration after validating data; Create/Edit empty/whitespace/250/251-character and duplicate/self-update/cross-tenant cases; deleted-name reuse; linked-record delete rejection; last-row paging; size-only page change, rapid sort/search, empty state and all-pages translated export; declared/HTTP failure and Retry; draft retention, double submission and close/discard/navigation; mock Apply/Cancel; dialog focus/trap/return; responsive matrix in EN/AR, RTL and both themes. External bookmarks to removed /Industry/create or /Industry/details routes should use /Industry. Backend read consumers outside this source workspace were not verified.

Suggested frontend commit: `refactor(industries): adopt shared list and modal editor` (stage only Industries and its described wiring/translation/guide deltas).

Suggested backend commit: `fix(industries): align name validation and protect unique names` (stage only the nine described backend file changes/deltas; migrations remain owner work).

## Shared extraction, learning and agent use

Repeated presentation/query/export/confirmation/form-freeze/error/focus patterns reuse existing shared owners. No new shared capability or reusable rule was established; no book/skill/changelog promotion is needed. Feature-specific decisions stay in this review/freeze/plan.

One inherited-model backend_worker was delegated the non-overlapping backend work after Phase1 freeze to reduce wall-clock time; it failed at the usage limit before producing edits. The root completed all backend work locally and owns integration/final review. No overlapping agent write occurred.

Builds, tests, lint, migrations, database commands, browser/application verification, Graphify, Sigma MCP, commits, pushes and deployment were not run. Runtime, schema/data and visual acceptance remain pending for the owner; this is source-only implementation, not Closed runtime acceptance.
