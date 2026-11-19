# Item — CRUD maintenance and list report

| Status | Frozen |
|---|---|
| Owner verification pending | yes |
| Date | 2026-10-04 |

Scope: existing Item CRUD refactor plus minimal catalogue report represented by the screenshot Report action, under Master2 owner standing rule. Core freeze is ITEM_DOMAIN_API_CONTRACT_FREEZE.md. No valuation, stock-balance, accounting, access, number-format or historical-data policy changes. Make/Model persisted relationship remains excluded pending clarification (picture proves label only; source has no relationship and request did not explicitly authorize missing persisted business).

| Existing state / impact | Owner / consumers | Decision | Result |
|---|---|---|---|
| Item scalar data and inherited No | Entity, CRUD, import, nested details | Keep | Truthful source values, shared numbering unchanged |
| Wrong enum ordinal UI, untyped forms/tenant payload, legacy grid | Item feature only | Replace | Numeric enum, typed list/editor and payload |
| Name/barcode guards exist only in import | Item service/EF/Item import | Extend | Same key rules and shared serialized writes/indexes |
| Barcode length, name update mismatch | Item VMs/config/import | Refactor | 250 maximum matching write contract and bounded index |
| No report owner for catalogue | Same GetMany/read columns | Create minimal UI consumer | Read-only shared dialog fetches all filtered/sorted pages, same five columns, print; no new API or calculated fields |
| Make/Model no source field | Would require Item–CarModel relationship and migration | Keep pending | Do not invent a persisted relationship as a refactor |
| Dead FullList and empty feature SCSS | No active consumer | Remove | Keep required DeleteVM/inherited select consumers |

Report alternatives: dedicated valuation/inventory report rejected because its formulas/data are unproven; bare browser print of current page rejected because incomplete pages/shell; choose same filtered catalogue in an isolated shared EditorDialog with DataTable, UI21 print session, all data fetched from current typed list API before print. Reviewer decision (owner standing rule), source fields and screenshot action evidence; optional clarification unanswered while independent work continued. No destructive/access/accounting effect. Snapshot query captured on opening, dialog cannot open over editor/delete/confirmation, print disabled until full read succeeds; HTTP/business errors retry; view close restores originating focus. Print hides pagination/actions and releases bounds through shared sigma-print-flow and sigma-report-print-dialog, no private print styles.

Implementation Phases0–6 follow core freeze; report adds UI20/21 and corresponding selected shared print owners. Report output columns Id/No/Name/Type/SupplierItemCode, numeric enum translated on display/export, no derived quantities/prices. Existing server-filter contract unchanged. Migration remains owner-only ChangeItemValidationAndUniqueness for core Name/barcode constraints/indexes and explicit existing default Price18,2. Deployment FE/API together; owner inspects existing data before applying. Source verification includes complete scoped diffs, exact consumers/routes/translation parity; compilation/runtime/SQL/print acceptance pending. No prohibited commands or shared-source changes planned.
## Notes width follow-up — 2026-11-01

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Tier S, explicit owner request: Add Item notes should span the screen/form width. Actual route pages/routing.ts:596 → Item/item.routes.ts → ItemsComponent → ItemDetailsComponent modal. Existing UI type01 / backend normal entity shape retained. Changed only the notes field wrapper in details.component.html to the existing sigma-field--full utility (UI1: grid-column:1/-1). The shared 760px editor and its viewport bounds remain; this means full available form width, not a viewport-wide dialog. The same form serves Create/Edit/View, so the notes region remains consistent across modes. Existing textarea, rows, typed form binding, note validation, read value and payload are unchanged. Preserved existing user changes in Item source and guide.

Shared-owner comparison: UI1 editor grid/full-span field contract and the approved Job editor's full-width field wrapper; actual shared styles.scss sigma-field--full owns all-column span, with no feature CSS. UI13 shared EditorDialog keeps header/footer and the same internal scroll. Analysis gate: reference entry already read in this chat; dated Stock/Items screen03, route tenant.CRS_Items, read for applicability. This width-only request introduces no reference field/business/API gap; original explanation and controller-cycle investigation are not needed to decide a shared field span. Existing domain freeze and its recorded broader gaps remain unchanged.

Added one bilingual Item guide step in UserGuide/content/stock-guide.ts, retaining /UserGuide/stock reader/sidebar and /Item operational topic. Source read/cache/loading/query boundaries are unchanged by this class-only edit: no new request/source/watch, serial work or data volume. No performance claim or new index/schema/migration is justified; existing timing and runtime acceptance remain pending. Initial generator -Check passed all eight; no book/skill/packet change needed for adoption of an existing rule. Scoped discovery/detail presentation and proportional reconciliation only; no backend/action/list implementation. No subagents for this one-element fix.

Scoped diff/whitespace review completed; owner checks full span on two-column and single-column layouts, RTL/LTR, light/dark, note editing and View. No build, tests, lint, browser, database, migrations, commits or pushes. No backend, DTO, AutoMapper or calculation change; no migration required. Suggested frontend commit: `style(stock): expand item notes across the form`.

## Editor opening cache follow-up — 2026-11-01

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Owner requests fixing cache when opening Add Item. Scoped discovery confirms the source already uses opted-in Branch/GetSelect and UnitsOfMeasures/GetSelect through the shared BaseService/ReferenceLookupCacheService, finite forkJoin before separate ReferenceLookupBindings watches, selected/current option retention with unavailable labels disabled, context cancellation/clearing, teardown and local ReferenceLookupStatus. Valid unexpired snapshots are reused without HTTP; no forceRefresh or local replay cache is present. Preserve this architecture and don't claim it was newly added. Item detail/list and uniqueness checks remain operational direct reads.

Confirmed bootstrap gaps to fix under existing UI2 success/failure contracts: when one envelope succeeds and the other fails, the current message expression can choose the successful envelope's message; malformed isSuccess=true responses without an entities array are normalized to empty success and can mount a watch which starts another request because the shared cache correctly rejected that response. Freeze the bounded fix: select the failed envelope's message only and reject malformed arrays through existing lookupError/Retry before mounting watches. Keep actual empty arrays successful, warm snapshot reuse, form values, endpoints, validators, writer invalidation and source eligibility unchanged. Source-only cache conformance; repeated-request/timing behavior still needs owner network evidence.

Final reconciliation: implemented both guards in DetailsComponent.loadLookups; normalized option arrays are applied only after both successful envelopes contain arrays. Genuine [] remains successful. No new cache or force refresh. Source conformance was already present for finite bootstrap, separate once-bound watch, selected/current labels, disabled unavailable retained rows, silent retained refresh, context clearing/cancellation and DestroyRef teardown; preserved all pre-existing user changes. UI shape remains shared modal/normal entity; the reference Items screen03 and earlier source/guide comparison remain applicable. No new domain/reference-feature contract from this narrow cache failure correction.

| Actual source / consumer | Classification, producer and invalidation evidence | Final lifecycle |
|---|---|---|
| Branch/GetSelect → branchService.getSelectList → branches | Approved cache opt-in in BranchService; shared BaseService.readReferenceSelect/read; createBranch/updateBranch and inherited delete/mutations invalidate successful source writes. RealtimeServiceCollectionExtensions registers lookup-branches for Branch, matching cache.topicFor. No dedicated branch import writer in the scoped import-service inventory. | Finite bootstrap then bindReference('branches'); selected stockBranchId/current options retained without form writes, unavailable label disabled. Both false envelope and transport/empty-completion errors use Retry. |
| UnitsOfMeasures/GetSelect → unitService.getSelectList → units | Approved cache opt-in in UnitsOfMeasuresService; typed create/update/remove and inherited writes invalidate success. Tenant topic lookup-units-of-measures maps UnitsOfMeasures. No dedicated unit import writer in the scoped inventory. | Same shared finite/bootstrap/watch/context contract, preserving unitsOfMeasuresId and draft; malformed array no longer mounts watcher. |
| Item/GetByWithNavigationsId/{id}, Item list, Item/CheckUnique | Direct operational reads; ItemService/BaseService checkUnique retain fresh contracts. Not used to bootstrap Add choices; no detail GET in Create. Type options are local enum data. | No expanded cache eligibility. Existing error/teardown and independent save path unchanged. |

Cache owns five-minute expiry,64 idle-entry LRU, scope/credential isolation, pending-read coalescing, copies and tenant topic membership. Successful source writes invalidate before downstream callbacks; failed writes keep snapshots. Editor ReferenceLookupStatus remains the local visible owner; retained-data watch refresh stays silent, busy/error/Retry remain. Actual empty arrays and context-cancel defaultIfEmpty failures were source-traced. Current backend BranchService.SelectAsync and UnitsOfMeasuresService.SelectAsync already use tenant/live repository queries, AsNoTracking and Id/Name/No projection followed by exact whitespace fallback; no recursive/per-row load in these sources. No query or schema change and no new index justified by a bootstrap-envelope guard. SQL plans and timings remain unmeasured.

Updated the existing Item guide topic bilingually in stock-guide.ts: reopening with valid choices, refresh on changes/expiry, preservation and Retry. Existing /UserGuide/stock, sideMenu.stockGuide, STOCK_GUIDE reader and /Item topic retained. Changes this follow-up: details.component.ts, one guide step and this addendum. Reviewed the complete scoped component diff against the pre-existing cache adoption, preserved notes full-span and other pending edits, and git diff --check passed. Initial recipe -Check passed all eight; PHASE-03 and canonical UI2/22/28 govern. No new reusable rule beyond existing success-envelope requirements, hence no book/skill/packet change required.

Owner checks: close/reopen Add within TTL in the same auth/branch/language context and verify no Branch/UOM HTTP on valid warm hits; change a branch/unit or await expiry and verify refreshed choices with preserved draft; simulate failed unit read with a nonempty successful Branch message and confirm the unit failure/Retry; missing entities must fail with no automatic watcher request, while entities=[] succeeds; HTTP/empty completion, context switch and teardown must not revive old choices. Compare5 cold/warm opens with the same build, dataset and network; record request counts and usable-content timing separately. No measured latency claim. No backend/API/DTO/calculation/AutoMapper or migration change. Suggested frontend commit: `fix(stock): validate item lookup cache bootstrap responses`. No subagents for this bounded sequential consumer correction. No builds, tests, lint, browser/runtime, database, migrations, commits or pushes were run.

