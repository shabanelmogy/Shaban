# تخزين بيانات القوائم المرجعية — حصر الحالة الحالية وخطة البداية

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Date | 2026-10-23 |
| Authorized deliverable | First step only: inventory sources, existing caches, scope, writers, freshness and proposed implementation sequence |
| Application source changes | None |
| Frontend baseline | `upgrade/angular-21-validation`, HEAD `e0313b3e`, tracked worktree clean at discovery |
| Backend baseline | Two pre-existing tracked changes; preserved, no backend edits |

## النطاق والمرجعية

The owner asked to begin the first step described in the conversation: inventory dropdown data sources and existing storage before adding caching. This is a source-read-only planning task, not authorization to install Redis, add an HTTP cache interceptor, change lookup eligibility, implement caching, or refactor screens. Runtime latency and payload sizes were not measured.

Authority: Master1/4/5/7/8, UI2/16/22/28/29/30, BE10/16/19 and the screen-refactor skill. Packet `plan-00-maintenance-evolution` is the applicable planning entry point; recipe `-Check` passed all eight generated packets. No generated or canonical document changed. No screenshot evidence applies.

Selected shapes: ordinary typed server lookups (`Results<DropDownSelect>`), typed composite/domain options, tenant settings, session-owned current-branch/language choices, and local enum/presentation arrays. This is a cross-cutting data-read inventory; it is not a new list/editor screen. Canonical backend shapes: normal entity/select and settings; specialized document availability remains with its domain owner. Approved references are the simple select contract in UI16/BE10, `BranchService`/base service for ordinary entities, `LinkAccountsService.getOptions` for composite options, and settings helper references in BE16. Reference source is inspected only, not edited.

## ملخص الحصر وحدوده

The TypeScript AST scan read 2,230 non-test `.ts` files under frontend `src/app`, excluding tests/declarations. It found **437 call expressions** of `getSelectList` in **194 files**, with **433** resolved to **55 distinct controller/GetSelect groups**. These are source call sites, not unique screens, executed network requests or measured duplicate requests. This syntax inventory does not establish route/bootstrap reachability for every source file. Wrapping service call sites are included; a wrapper and its callers must not be counted twice as runtime traffic.

Four generic call expressions are explicitly parameterized/dynamic and manually traced below. Additional raw HTTP/typed methods bypass `getSelectList`; these are supplemental routes, not included in the 437. The 46 raw HTTP URL candidates include non-lookup false positives such as ordinary CustomLookup CRUD and are deliberately not reported as 46 distinct dropdown APIs. The broad 1,168 method-name candidate expressions also include local selection helpers/writers; only classified evidence is actionable. There are 152 `enumOptions` call sites, which build local data and require no HTTP cache. Five duplicated service class names were detected by the scanner; none is a resolved ordinary-select receiver, so those duplicates do not affect the 55-group inventory.

Supporting inventory, under `reviews/LOOKUP_CACHING/`:

- `ORDINARY_SELECT_INVENTORY.md`: all 55 ordinary groups, counts, conservative classification and sources.
- `FRONTEND_SELECT_CALLS.csv`: every ordinary call with source file, line, receiver, service and resolved endpoint.
- `FRONTEND_SELECT_GROUPS.json`, `FRONTEND_INVENTORY_SUMMARY.json`: grouped/raw summary evidence.
- `FRONTEND_HTTP_LOOKUP_ROUTES.csv`, `FRONTEND_LOOKUP_CANDIDATES.csv`: discovery candidates, not an allowlist.
- `FRONTEND_ENUM_OPTIONS.csv`: local enum construction evidence.
- `BACKEND_INVENTORY.md`: bounded backend evidence, predicates, writers and limitations.

### أكثر المصادر استخدامًا في الاستدعاءات العامة

| المصدر | مواضع الاستدعاء الثابتة | ملفات الاستهلاك | التصنيف المبدئي |
|---|---:|---:|---|
| Branch | 88 | 86 | Tenant lookup; distinct from CurrentBranch preferences; later slice |
| Customer | 54 | 54 | Live partner data; excluded from first retained-result cache |
| Staff | 34 | 34 | Live staff data; excluded from first slice |
| Vehicle | 28 | 28 | Live operational data; excluded from first slice |
| Supplier | 22 | 22 | Live business data; excluded from first slice |
| Country | 6 | 6 | Recommended initial pilot; plus the direct CompanyDriver path below |
| Currency | 5 | 5 | Reference data with existing financial-policy dependency; later slice |
| UnitsOfMeasures | 5 | 5 | Recommended second source; also used through a generic helper below |

### الاستدعاءات المتغيرة والمسارات الإضافية

| مصدر الاستهلاك | ما ثبت من الكود | أثره على أي تنفيذ لاحق |
|---|---|---|
| `Stock/ItemRequisition/.../purchase-request.component.ts:267` | Helper receives Branch/Supplier/UnitsOfMeasures services, then joins all three | Do not lose UOM or supplier/branch error/loading semantics; one static call can execute for three services |
| `Transportation/TransportationAgreement/.../details.component.ts:173` | Helper receives Customer/Vehicle/Driver/Branch | Distinct live entity results; outside initial cache |
| `Transportation/TransportationAgreement/.../list.component.ts:169` | Helper receives Customer/Driver | Same exclusion; preserve per-screen Retry |
| `Vouchers/Invoices/Invoice/.../list.component.ts:230` | `lookupFields` binds Customer, Branch, Vehicle, Staff, Project services | Five descriptor-driven reads; do not invent a single combined source |
| `Customers/Companies/CompanyDriver/services/companydriver.service.ts:32` | Direct `Country/GetSelect` in `getCountries()` | Route through the same Country data owner during the pilot; its actual consumer is `CompanyPartner/components/detalisForm/drivers/driver-fields.component.ts:134` |
| `ContactGroupService.getSelectByType`, `CostCenterService.getSelectByGroup` | Type/group parameter changes the result | Parameter belongs in key; no cross-type/group reuse |
| Equipment/Lease/Rental contact-person methods | `Contact/GetSelectByCompany/{customerId}` | Customer identity belongs in key and existing switchMap lifetime; not initial pilot |
| ChequesReceivables, LeaseQuotation, RentalQuotation | Private controller-based raw `GetSelect` helpers | Endpoint text alone is not a reviewed caching policy; stay fresh until independently classified |
| Job/JobEstimation/WorkOrder, Fleet, booking, payment settings and language options | Confirmed typed composite/domain endpoints | Preserve typed envelopes and availability rules; do not flatten into `DropDownSelect` |

## التخزين الموجود بالفعل

| المالك الحالي | السلوك المثبت | الفجوة أو القرار |
|---|---|---|
| `shared/service/base-service.service.ts:97` | Every `getSelectList` creates an ordinary cold HTTP GET; no shared retained-result policy | Extend this data path by explicit source eligibility later, without caching every controller |
| `CurrentBranchService` | Typed option/current signals, in-flight sharing, session version, resets on identity changes; branch mutation commits confirmed response | Keep its session/preference owner; `Branch/GetSelect` and `CurrentBranch/Options` are not interchangeable |
| `TranslationService`, `LanguageService` | Session-aware runtime dictionary, language options and explicit reads/revisions | Keep existing owner; do not place a second cache around runtime localization |
| `TaxSettingsService` | Root replayed strict/optional reads; optional fallback can become a retained value; no TTL/session reset/invalidate method in owner | Existing lifecycle gap to review separately, not new tax logic or an approved settings-cache implementation |
| `FinancialNumberPolicyService`, `CurrencyService` | Replay cache; explicit invalidation after successful typed currency create/update/delete | Keep existing success-only invalidation. No TTL/session reset in cache owner; application failure envelope can remain replayed. Verify all writes before expanding |
| `LinkAccountsService.getOptions()` | Composite option snapshot; clears cache on failure envelopes/HTTP errors; no explicit TTL/session boundary | Keep typed composite owner; independent settings follow-up |
| `OpeningBalanceStateService` | Keyed requests, explicit invalidation, version/identity protection and state signals | Keep domain-state owner; not a generic dropdown cache |
| `enumOptions`, `TranslateOptionsPipe`, report option projection | Local enum arrays and option/language-identity presentation memoization | Keep; do not persist enum choices or treat memoization as API data caching |
| Company `components/cashe/CacheService` | Local/session-storage wrapper exposes global clear methods; no runtime consumers found, only its own spec | Legacy unused owner; do not reuse or invoke global clear. UI30 backlog28 describes historical enum storage, but current Company editor no longer imports this owner; do not report the historical behavior as current |
| `ngsw-config.json`, root `app.config.ts` | Production service-worker assets; `dataGroups: []`; registration disabled in dev mode | Keep application-file cache. No API response caching through service-worker in first slice |

Backend bounded source trace confirms tenant (`SubscriptionId`) and soft-delete filtering in ordinary repository dropdown reads. The inherited lookup does not automatically exclude inactive rows. Preserve the existing source predicate; changing selectable rows is a separate domain decision. Backend settings rule BE16 says not to add caching merely as part of a settings review. This inventory does not change that rule or create settings caching.

## خريطة التأثير وملكية الإبطال

| المنطقة | المنتج أو الكاتب | المستهلكون | التصنيف والحدود |
|---|---|---|---|
| Country | `CountryService` typed create/update/remove; inherited backend generic writers/activation | Six ordinary call sites + CompanyDriver direct transport | Extend shared read path; invalidate only after confirmed successful writes, including any inherited legacy writer retained in scope |
| UnitsOfMeasures | Typed create/update/remove; inherited backend actions | Five ordinary sites + ItemRequisition helper | Extend after Country pilot; preserve ids, order, labels and validators |
| Currency | Typed writes plus backend base-currency behavior | Five ordinary sites, document currency, financial policy | Later source; invalidate lookup and existing policy only after complete successful mutation |
| Branch | CRUD/activation and separate per-user current-branch writer | 86 ordinary consumer files plus session shell | Later source; branch-option changes and user preference are different invalidation events |
| Session/tenant/language | Existing auth/token observation and translation owners | Every eligible cached source | Extend lifecycle wiring; never store a bearer token in cache keys/logs/artifacts |
| UI controls | Shared Select adapters, saved-option merge and form owners | Existing screens | Keep public component/CVA/form contracts; cache source results before screen-specific merge/translation |
| API/data/reporting | Current controllers, repository and writer validation | All dropdown consumers, exports and writes | Keep contracts/persistence; no migrations, calculated-value or report changes |
| Server caching | No cache registration found in bounded lookup paths | Optional future infrastructure | Keep unchanged in pilot; requires separate server writer/transaction/deployment design |

No Country/UnitsOfMeasures/Currency-named writer was found in the frontend DataImport subtree. That bounded negative search is not proof there are no imports, external clients, scripts or other-user writes to the underlying data. TTL/revalidation limits, rather than same-tab invalidation alone, must cover ordinary remote edits.

## البدائل والقرار المقترح

| البديل | النتيجة والمخاطر | التوصية |
|---|---|---|
| Blanket GET/GetSelect interceptor or service-worker data cache | Caches availability-sensitive/personalized reads and bypasses source review; error/context/request-lifetime risks | Reject for initial scope |
| Explicit frontend in-memory policy through the existing service path | Reduces browser requests for reviewed small sources; preserves APIs and existing controls; requires lifecycle/invalidation ownership | Recommended: Country first, UnitsOfMeasures second |
| Repository-wide/server cache | Can reduce SQL work but still sends browser requests; predicate/selector keys, commit timing and multi-instance coherence require broader contracts | Defer; backend agent suggestion is an alternative, not the selected initial implementation seam |
| Redis/shared infrastructure immediately | Extra deployment and invalidation ownership without measured need in this task | Defer pending actual hosting/performance evidence |

## العقد المقترح قبل التنفيذ

The following is a proposed target, not a Frozen implementation handoff:

- Keep current endpoint, response metadata, ids (`number|string`), labels/order, empty-success behavior and server write validation. Do not add hidden branch filters, permission APIs or new API fields.
- Only explicitly eligible sources participate. Unlisted sources behave exactly as today. Country/UOM are tenant-scoped server data, even if their names look globally reusable.
- One shared in-memory data-cache owner; source services declare eligibility. No per-component cache copies, persistent business data storage, new state library or API service-worker data group.
- Key separates API origin, session generation, tenant, user and language plus endpoint and canonical parameters. Use an authenticated identity/session observer already present (`observeAuthToken` plus current-user lifecycle); no raw credentials in persisted keys or logs. CurrentBranch is a default, not a hidden query scope; include an actual branch parameter only where the producer uses it. A broad reset on context replacement may be conservative, but must not rewrite existing form selections.
- Successful empty arrays are cacheable. Failure envelopes, HTTP failures, cancellation or completion-without-value are not retained. Retry must issue a fresh request. Optional settings fallback is not a model for caching successful source data.
- Coalesce identical concurrent requests without giving one consumer teardown ownership over another. Preserve existing routed-read cancellation; cross-page cancellation must evict/complete the in-flight entry cleanly so a new page can reload. Do not automatically apply `KEEP_READ_ON_NAVIGATION` to new page lookups.
- Successful mutation invalidates the source and fences earlier in-flight results. Failed mutation does not invalidate valid data. Session reset/invalidation must prevent a delayed old request or old observable reference from publishing previous-context data.
- Cached snapshots must not be mutated by consumer pushes, sorting, saved-option merges or translated-label projections. Return safe copies/read-only internal snapshots compatible with PrimeNG's mutable options input; preserve id types.
- Use bounded expiry/entry limits and explicit force-refresh. Initial TTL and maximum entries are not established by source alone. A five-minute absolute TTL is a candidate to assess, not an approved freshness guarantee; do not silently implement it from this Draft.
- Same-tab invalidation cannot guarantee immediate reflection of other-tab/user/server writes. If immediate synchronization is required, define cross-tab and server notification/revalidation separately. Availability-sensitive writes remain authoritative on the server.

## سجل القرارات المفتوحة

| السؤال | الحالة | أثره على التنفيذ |
|---|---|---|
| Existing lookup payload/predicate and tenant identity | Confirmed from source | Preserve; no business eligibility change |
| First pilot: frontend Country, then UOM | Derived recommendation | Fits first-step outcome; not implemented or Frozen |
| Acceptable age, memory limits and freshness on tab return | Uncertain | Must be fixed with pilot contract before result retention; measure request frequency/payload first |
| Immediate cross-user/tab change propagation | Uncertain | No such guarantee may be claimed; decide only if workflow requires it |
| Broader inactive-row eligibility | Not changed | Not a blocker to inventory or preserving current read semantics; separate domain decision if requested |
| Redis/server topology | Not needed for frontend pilot | No infrastructure proposal required before simple frontend measurement |
| Existing root settings cache lifecycle | Confirmed source risk | Separate scoped follow-up; do not silently include tax/numbering/settings behavior in initial pilot |

## تسلسل التنفيذ والتحقق

| المرحلة | المخرج | دليل النجاح |
|---|---|---|
| First step — this task | Source inventory, impact, existing owners, risks and proposal | All ordinary static calls indexed; four dynamic expressions traced; direct Country transport identified; no source edits |
| Contract freeze | Exact Country eligibility/key/TTL/force-refresh/session/invalidation/lifetime and all current writers | Frozen bounded handoff; UI2/16/22/28, BE10 and Phase1/5 used after recipe check |
| Country pilot | Shared owner + explicit eligibility + Country writer invalidation + CompanyDriver reuse | Same endpoint/options; sequential reads within policy reuse; concurrent identical reads deduplicate |
| Pilot verification | Focused cache/HTTP tests and actual network comparison | Success/empty/error/retry/expiry, same/different contexts, force refresh, old response after mutation/session reset, consumer mutation, navigation cancellation, partial consumer teardown and both feedback channels |
| UnitsOfMeasures adoption | Reuse same owner, preserve ItemRequisition generic helper | No duplicate implementation; same lifecycle tests and write invalidation |
| Later review | Currency, Branch and specialized sources individually; existing settings caches separately | Measured need and source-specific contracts; never blanket-enable 55 endpoints |

Expected measurement: count actual eligible requests while navigating Company → Individual → Company, opening nested driver, then save Country and reopen; compare before/after and verify a fresh network read after write/context reset. Compare labels, selection, clear/disabled/loading/error/Retry and saved-record option merges. No performance gain is claimed until measured. Source-only inventory needs no build or test run and does not authorize UI source/user-guide edits. Implementation later updates the existing common guide if user-visible refresh/offline behavior changes.

## المطابقة والإقفال الخاص بهذه الخطوة

| Concern | Owning book/reference | Current shared owner | Finding/target |
|---|---|---|---|
| Ordinary option contract | UI16/BE10, base service and `Service.SelectAsync` | Existing data services and repository | Preserve `Results<DropDownSelect>`/empty success; caching remains proposed |
| Typed composite options | UI16, LinkAccounts `getOptions()` | Existing typed feature service | Keep; not converted to generic dropdown/cache |
| Session/lifetime | UI2/28, auth-token/current-branch/navigation owners | Root providers/interceptors | Reuse/fence; no runtime wiring changed |
| Currency policy invalidation | UI2, CurrencyService and FinancialNumberPolicyService | Existing policy owner | Existing success-only invalidation confirmed; lifecycle gaps recorded |
| Settings | BE16 settings helper, current Common/Tax services | Existing settings/policy owners | No new caching during this planning task |
| Historical options/translation | UI16, mergeSelectOptions/TranslateOptionsPipe | Existing pure/presentation owners | Cache source before consumer transforms; no historical label invention |

The first inventory step is complete. Application source/configuration, canonical books, generated packets, data, branches and commits were not changed. Supporting files are local unversioned review artifacts. Runtime request counts, cache hit ratio, latency, cross-session behavior and production deployment checks remain unverified. The plan remains Draft intentionally; a later implementation needs the bounded policy contract above to be frozen first.

## Subsequent authorization — 2026-10-23

After reviewing this inventory the owner instructed «تمام ابدأ». The Country/UOM frontend pilot and routine technical limits are now frozen in `LOOKUP_CACHING_REFERENCE_DATA_CONTRACT_FREEZE.md`. That later handoff supersedes the Draft policy uncertainties for those two sources only. The original inventory and broader exclusions above remain a historical record.
