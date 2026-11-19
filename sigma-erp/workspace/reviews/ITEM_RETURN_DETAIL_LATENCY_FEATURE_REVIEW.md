| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |

# ItemReturn repeated detail latency — source-only investigation 2026-10-04

User reports https://localhost:7178/ItemReturn/GetByWithNavigationsId/3 slow approximately every time. Duration/SQL timings not supplied. Diagnostic question, source-read-only; no application edits. Canonical Master/BE5/14; recipe drift check stale, canonical sources govern pending regeneration/semantic review. Skill previously applied; scoped read only, no agents for sequential trace.

Controller SiGmaControllerBase.GetByIdWithNavigationsAsync invokes virtual ItemReturnService.DetailWithNavigationsAsync override. Current source uses repository tenant/live root filter by Id, AsNoTracking, ProjectTo lean ItemReturnDetailVM, FirstOrDefaultAsync. Projection returns header, Job.No and child Item.Name/quantity/IDs; no recursive GetByIdDeep or eager full Job/Item graphs. Repository.Query adds tenant/deletion/predicate only; constructors inspected have no reachable database call. No explicit sleep/retry loop in this request path. No timing data proves a query or index problem. Actual deployed binary version not independently verified.

Confirmed configuration fact: API Program adds SQL Server from ConnStr, appsettings ConnStr points to SQL5106.site4now.net; SiGmaDbContext.OnConfiguring unconditionally supplies a connection string to the same external server, overriding caller configuration choice. Secrets omitted. localhost is API host only, database is configured externally. This is a source-supported latency suspect (network/server/query execution); not a measured root cause. Changing appsettings alone cannot reliably switch database because of unconditional context configuration. No database target/configuration changed by this investigation.

Required evidence to isolate: repeated request duration, existing EF Database.Command Executed DbCommand timing, request total timing and running API build identity. Fast SQL + slow request points outside SQL execution; slow SQL calls need query/plan/blocking/network investigation; no fabricated index or AsSplitQuery remedy. No database/runtime commands, requests, builds/tests/lint/browser/migrations/commits were run. No source diff introduced; no migration/commit applicable.

## HAR evidence addendum — 2026-10-04

Attachment F:/localhost.har parsed offline, 6 entries. User subsequently permits ordinary handling of attachment data; tokens/headers unnecessary and not included in evidence.

| GET request | Status | Total ms | Wait ms | Receive ms |
|---|---|---:|---:|---:|
| ItemReturn/GetByWithNavigationsId/3 | 200 | 21242.89 | 21193.58 | 21.50 |
| Job/GetSelect | 200 | 990.52 | 935.67 | 1.23 |
| Item/GetSelect | 200 | 399.92 | 352.25 | 0.96 |

ItemReturn body1783bytes, one detail line; preflight19.62ms. 99.77% total is wait before response, not downloading/UI painting. Lookups start after detail completes and add approximately0.99s in parallel; they do not explain21s detail wait. HAR wait includes server processing and path latency and does not itself measure SQL duration.

Decisive response/source mismatch: HAR entity returns job graph, audit/tenant/flags; child returns item graph plus audit/tenant. Current ItemReturnDetailVM exposes JobName, and ItemReturnLineDetailVM exposes ItemName, without job/item graphs or audit/tenant flags. The captured response therefore does not conform to current source contract. Running process/assembly is older or from another checkout/build; exact identity not measured. This supersedes the prior external-database-only suspicion as the first actionable check.

Previous generic detail path uses Service.DetailWithNavigationsAsync → Repository.GetByIdDeepAsync → LoadNavigationsRecursiveAsync, which awaits each navigation/child load sequentially across multiple navigation levels. That behavior is a source-supported explanation for high latency amplified by an external DB, but the HAR cannot prove the exact SQL count/time of the running binary. Current override already avoids this path with lean ProjectTo. No speculative further source change justified before running current API build.

Owner next step: stop existing API instance, rebuild/restart SigmaBackend from F:/My Work/Sigma/SigmaBackend and repeat request. Verify returned entity contains jobName and rows itemName; no job/item graph. Compare repeated timing. If still slow after response contract matches, collect EF Executed DbCommand timings to distinguish SQL/network/blocking/other request processing. No build/runtime/API request/database or application change performed by this read-only analysis. Source report remains Draft, runtime owner verification pending. No migration required; agents not used for small sequential diagnostic.

## Bounded View presentation fix — 2026-11-01

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope / tier | S: presentation of View Item Return, existing shared owners; earlier latency investigation above remains historical |
| Authorization | Owner requested fixing the View Item Return formatting; no business/API/schema change |

Initial recipe check: all eight packets passed. Used PHASE-03-detail-write for the scoped View composition; no packet/book change or regeneration needed. Master1 proportional process, Master2 reference gate, Master5 shared-owner/loading/cache/performance gates and Master7 reconciliation apply. UI13/15 own shell/mode, UI6/14 own read/edit tables; inspected actual EditorDialog, EditorTabs, FormSection, DataTable and Job editor reference. No direct PrimeNG API change. Phases0/3 and proportional final reconciliation applied; new domain/API, list, action and integration implementation phases skipped because their contracts are unchanged.

### Evidence and frozen presentation decision

Active source chain: pages/routing.ts:641 → ItemReturn/itemreturn.routes.ts → ItemReturnsComponent → projected ItemReturnDetailsComponent. Legacy details links redirect into the same list-owned dialog. Backend shape is master-detail with an operational approval effect (ItemReturnService); UI currently uses EditorDialog. UI13 normally selects a routed editor for approval-bearing records; the pre-existing modal is retained for this bounded styling request, not asserted as full-screen architectural conformance. Existing approval contract remains in ITEM_RETURN_STOCK_TRANSFER_APPROVAL_PLAN_2026-10-21.md.

The working tree changed concurrently during discovery: an Items peer tab, larger dialog height, panel identities and validation focus switching appeared before this task's successful patch. Those changes were reread, preserved and integrated. This task adds typed read columns and shared sections, conditional required marks, empty-value fallbacks, a read-only multiline reason and form aria-busy. It does not claim authorship of concurrent tab/lifecycle changes. Other pre-existing changes, including stock-guide.ts content, were preserved.

| Reference-cycle / functional detail | Evidence actually read | Sigma comparison and disposition |
|---|---|---|
| Reference entry and original explanation | references/speed-analysis/README.md; 2026-10-27/Speed_Analysis_Guide.md introduction; library/catalog.csv targeted Item Return/stock search | No original Item Return explanation found in the catalog; no unseen original page claimed. Targeted dated frontend evidence used below. |
| Stock → Item Returns; Workshop/stock cycle | 2026-10-28/sidebar/15-stock/screens/06-item-returns.md; workflows/02-workshop-stock-and-finance.md; controller C1681, source raw/application.js:465090–465274, read through sumAmount | Reference declares returned item rows, job selection, quantity, optional/configurable reason and source-job row retrieval. Sigma exposes date/job/branch/reason and item-name/quantity detail rows. Display coverage matched for consumed Sigma fields; no reference visual design copied. |
| Reference model-specific detail | C1681 returnItemObject, jobSelected, productSelected, sumAmount | Unit, debit/credit/amount and source-job automatic rows are partial/missing target features in Sigma detail, outside this View-formatting slice. Follow-up needs exact unit/valuation/source-link API and financial authority plus owner decision on configurable mandatory reason; do not infer server rules or implement financial effects. |
| Existing Sigma guide | UserGuide/content/stock-guide.ts, Item returns topic | Added bilingual View navigation and read-table explanation using final source. Prior lifecycle text preserved. |

### Final shared-owner conformance

| Concern / book | Actual owner and final result |
|---|---|
| Header/tabs / UI13/15 | EditorDialog still owns translated title, record subtitle and fixed footer; EditorTabs owns navigation and matches panel IDs. Existing basic/items panels remain mounted with hidden state. |
| Basic fields / UI13/15 | FormSection compact spacing; repeated tab heading hidden via showTitle=false. Date/job/branch use shared grid with 3 columns for View, 2 for editing; shared 1024px/700px breakpoints reduce to 2/1. Required marks apply only to inputs. Empty job/branch/reason display a dash. Reason uses existing styled readonly textarea to preserve full multiline content. |
| Items / UI6/14 | View uses DataTable, ItemReturnItemDetailsDTO, columns itemName/quantity; no sort/filter/paging, no duplicate loader, scrollable=false. Create/Edit retain EditableCollectionTable, typed rows, original validators and commands. No fields removed. |
| Geometry/theme / UI1/25/29 | Padded EditorDialog flex content → form/body flex-fill → sigma-editor-scroll → visible section/FormSection. One outer content scroll; DataTable has no independent row viewport. Shared styles own tokens, RTL and responsive geometry; no feature CSS added. Visual bounds and long-text/narrow cases remain pending. |
| Extraction / Master5 | Reused existing shared capabilities; no new reusable behavior or wrapper needed, hence no new book/skill rule. |

### View request/loading/cache and performance evidence

| Actual read | Classification and lifecycle | Final disposition |
|---|---|---|
| ItemReturn/GetByWithNavigationsId/{id}, ItemReturnService.getDetails → loadDetails | Direct operational detail, not an opted-in reference cache. Global loading start/finalize remains paired; takeUntilDestroyed cancels, response checks visible/id, false-envelope/HTTP errors render Retry. Body-appended EditorDialog exposes local StateMessage above the form because its overlay hides the shell host. Effective route has no showPageLoading=false override; layout/layout.component.html owns the shell host. | View starts no edit-only Job/Branch/Item lookup requests. Local aria-busy now reflects pending reads/save. No cache owner/writer invalidation/watch applies to this direct operational read. Runtime single-visible-owner acceptance pending. |
| ItemReturn/{id}/approval, ItemReturnService.getApproval → approval adapter | Direct fresh operational state/history. Adapter owns loading/data/error/Retry, read replacement subscription and destruction; paired global count. Source inspection found no visible read loader inside its body-appended dialog. | Added the shared local loading StateMessage and aria-busy; suppressed the history table's global loading mask so the dialog has one visible read indicator. No cache introduced or changed; request/action contracts untouched. Existing remount refresh when leaving/reopening Approval is unchanged. |
| Job/GetSelect, Branch/GetSelect, Item/GetSelect | Not consumed in View; loadDetails calls loadLookups only outside View. | Edit-only cache/watch adoption is outside this presentation slice; no claim of full editor-cache modernization. |

Backend detail already uses tenant/live root query, AsNoTracking, ProjectTo<ItemReturnDetailVM>, FirstOrDefaultAsync and filtered live tenant child mapping. No recursive per-row navigation read was introduced; read table consumes the same single detail response and renders its complete item array. Large document rows remain unpaged inside the existing content scroll. No new requests, fetch-all loop or query optimization. Existing Id primary-key access and child foreign-key join are the relevant detail predicates. ItemReturnConfig's tenant/branch and tenant/approval/void/time indexes target other reads; no evidence supports an additional detail index for this formatting change. No schema/index suggestion or migration is needed. SQL plans/actual command counts are unmeasured.

Comparable owner check: same current frontend/backend build, tenant, record and network/database location; compare before/after 5 repeated View opens with representative 1-row and larger documents. Record network request count, detail response bytes/time, SQL duration if available and render/usable-content time separately. Repeat cold/warm conditions; View should make no dropdown reads. Historical October HAR above is not a comparable before sample for this change. No measured speed claim.

### Reconciliation and handoff

Changed files: ItemReturn/components/details/details.component.html and .ts; ItemReturn/components/approval-cycle/approval-cycle.component.html (read progress only); UserGuide/content/stock-guide.ts (one bilingual View step); this existing review addendum. Application repository verified as F:/My Work/Sigma/SiGmaAngularFrontEnd. Full scoped HTML/TS diff reviewed, including concurrent edits; guide addition reviewed against current source. git diff --check passed for scoped application files. Existing translation keys checked in both vocabularies; no new key. Detail fields and child columns match existing typed DTO and ItemReturnProfiler; backend, payloads, AutoMapper, quantities, calculations and approval effects unchanged. No Add-Migration required.

Guide route /UserGuide/stock, existing sidebar sideMenu.stockGuide and reader STOCK_GUIDE registration retained; topic route /ItemReturn covers View, Basic information, Items, Approvals and eligible Edit. Owner checks: open View with populated/empty optional values, long multiline reason and multiple/no items; switch tabs; verify readonly behavior, Edit eligibility and Close; inspect loading/error/Retry, keyboard navigation, RTL/LTR, light/dark and widths around 1024/700px. Also smoke-check Create/Edit after shared-section wrapping. Runtime/build/visual acceptance remains pending, including existing modal-versus-routed architecture and broader reference feature gaps; this is not a complete feature conformance claim.

Suggested frontend commit: `fix(stock): improve item return view presentation`. No backend commit. No subagents: one bounded presentation workstream, coordination would duplicate context. No builds, tests, lint, browser/app verification, database commands, migrations, commits or pushes were run.

## Add Item Return opening latency — 2026-11-01

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scoped contract | Diagnose/fix opening of existing Add dialog; preserve header, child inputs, eligibility, save/approval and API/tenant contracts |

Initial source discovery: Create opens via ItemReturnsComponent.openEditor into ItemReturnDetailsComponent.ngOnInit, then forkJoin Job/GetSelect, Branch/GetSelect, Item/GetSelect. Form and dialog close are disabled until the whole batch settles. All three source services already opt into the shared reference cache; no new cache eligibility or endpoint is needed. No detail GET occurs in Create. Existing typed Results<DropDownSelect> and operational writes are frozen unchanged. Two bounded read-only investigations now run independently: root traces frontend/bootstrap/cache behavior; an agent audits the three selector backend query paths and indexes. No delegated source edits; root owns fixes and final reconciliation.

### Owner clarification and frozen maintenance slice

Owner clarified that the delay is when opening the Item or Job dropdown, rather than waiting for the dialog's initial reads. The confirmed render boundary is p-select's nonvirtual options path: both controls receive the complete source array and no virtualScroll setting. Opening paints every option; backend/network timings and actual item counts remain unmeasured. Do not change bootstrap/cache/close behavior just to mask a dropdown-render issue.

Impact map and classification (PLAN-00, frozen before source edit): **Keep** existing Job/Item/Branch source endpoints, scoped cache, forms, validators, server write guards, dropdown filtering/clearing and labels. **Extend** the current shared 38px virtual-row styling owner in src/styles.scss with a generic sigma-select-panel--virtual alias; keep the report alias compatible. **Refactor** only Item Return editor's Job/Item dropdown rendering through PrimeNG public virtualScroll/virtualScrollItemSize and the shared alias. **Keep** Branch nonvirtual. No new wrapper/cache/state owner, truncation, lazy server contract, backend/schema change or broad rollout.

Alternatives: making only the dialog appear sooner does not address the clarified stage; cutting option arrays loses valid choices; remote search changes contracts; copying feature CSS duplicates the existing shared virtual-row owner. Select virtual rendering with exact shared row geometry, preserving complete data and existing search. No open business decision. This small shared-owner extension is documented in UI16 plus the execution skill, with generated packet refresh in the same task. Actual source-backed PrimeNG Select metadata/example and installed declarations support the public inputs; current docs example uses its own 32px row, Sigma uses its existing 38px row contract.

Reference gate: reuse the sources actually read in the View addendum above, including C1681 searchItems/searchJobs declarations. They support selectable Item/Job workflows, not a required remote-search API or server validation rule. The accepted delta changes rendering only; broader unit/amount/source-row gaps remain recorded above, not implemented by this latency fix. Existing approval and DTO contracts remain frozen.

### Further owner instructions and final source decisions

Owner also requested Link Accounts-style tabs, a card around Items, removal of unused blank space, and documentation completion. These are explicit presentation requirements; no new data or business behavior is inferred.

| Concern | Owning source/reference | Final decision and source conformance |
|---|---|---|
| Slow option opening / UI16 | Installed PrimeNG21.1.10 Select declaration and runtime nonvirtual/Scroller template; current PrimeNG MCP Select virtualscroll example | Both editor Job/Item selectors now use virtualScroll=true, virtualScrollItemSize=38 and shared sigma-select-panel--virtual. The complete options, filtering, clearing, values and existing disabled/form validators are retained. Branch remains nonvirtual. No lazy server reads or artificial result cap. |
| Shared option geometry / UI16 | src/styles.scss existing sigma-report-select-panel--virtual | Added generic alias to the same 38px border-box/zero block-padding row rule; compatible report alias retained. No duplicate skin, theme tokens or feature panel CSS. Fixed rows apply only to these single-line options; custom multi-line/grouped options require separate height evidence. |
| Tabs / UI13 | Accounts/Link Accounts/LinkAccounts/components/details/details.component.html uses EditorTabs appearance=workspace; actual shared EditorTabs public input and styles | Item Return uses the exact same public workspace appearance. Basic/Items/Approvals identities, navigation, current selection, busy gates, validation-tab activation and drafts preserved. No edits to Link Accounts or shared tab styling. |
| Items card / UI13/14 | Shared FormSection and EditableCollectionTable actual declarations/templates | One compact FormSection wraps Items in every mode. showTitle=false removes the repeated tab label; the editable collection uses headingVisible=false, retains its Add/Remove/validation toolbar, and the card owns the one mock-data heading action. View retains DataTable inside the same card. |
| Blank space / UI13 content-sized alternative | EditorDialog height/maxHeight contract; styles.scss editor chain; assets/sass/_sigma-utilities.scss sigma-u-flex-fill | Basic/Items omit definite shell height; form, body and inner scroll all already use flex:1 1 auto!important, so short content determines height while maxHeight bounds long content. Approval alone retains min(720px, calc(100dvh - 24px)) because its independent adapter uses zero-basis flex. No publisher override, page-height calculation or extra scroll owner. Runtime geometry remains pending. |

No new lookup or cache consumer was added. Job/GetSelect, Item/GetSelect and Branch/GetSelect remain approved reference sources through their existing cacheSelect=true owners and finite getSelectList reads. Shared ReferenceLookupCacheService owns scope/TTL/coalescing; Item/Job/Branch typed and inherited successful writers invalidate their source families through invalidateSelectOnSuccess. Existing tenant notifications remain source-owned. Existing editor bootstrap has no separate active watch; that broader consumer-conformance gap remains explicit and unchanged by this render-only slice (not a claim of full editor cache modernization). Operational detail/approval/save and financial reads keep their contracts. Existing bootstrap load/error/Retry, teardown and global/detail versus dialog lookup progress are unchanged. No cache was added to conceal repeated work.

### Backend/query/index audit and measurement boundary

The read-only luna_explorer agent used the inherited model (the instruction's mapped model is unavailable). Owned only the three selector/backend query traces; no files edited and no overlap with root frontend work. Findings: SiGmaControllerBase.GetSelectAsync:64 → generic Service.SelectAsync:1324 → Repository.GetDropdownAsync:568. Job/Item materialize full tracked entities at Repository.cs:588 then derive labels via reflection; no Includes, recursive loads, N+1 calls or explicit sort. This is a possible cold-read optimization, not proof of dropdown-open latency. BranchService.SelectAsync:26 already projects Id/Name/No without tracking. User clarified the stage is opening populated selectors, so no generic repository or canonical Job service was changed. A future lean projection must retain full membership and Name whitespace→No fallback semantics.

No new index justified: these selectors have tenant/nondeleted predicates, no search/sort/join. Existing Job tenant/status and tenant/estimation indexes, Item/Branch filtered tenant/name indexes and Item barcode coverage were reviewed. Filtered IsDeleted=0 indexes do not establish coverage of historical null deletion flags. Actual deployed indexes/plans are unknown; indexing does not solve painting every loaded option. No EF/model/schema/migration change.

Owner timing plan: same built version/environment, tenant, language/theme, data size and machine; open Job and Item panels five times before/after after options are loaded, record click-to-visible time and total option count. Separately record a cold bootstrap and a warm cache bootstrap with request/payload/SQL timing when available. Inspect rendered option row count, filter first/last matching choices, Clear, reopening a selection and keyboard arrows/Enter/Escape. Confirm no extra requests on panel open and no lost options. Virtual rows bound render work; filtering still scans the complete local source, and source arrays/network volume remain unchanged. No timing/SQL/browser measurements performed or invented.

### Documentation and final reconciliation

Root implemented only ItemReturn/components/details/details.component.html, the shared src/styles.scss alias, and the Item Return bilingual step in UserGuide/content/stock-guide.ts for this follow-up. Prior HTML/TS/approval and guide changes were preserved. The guide uses existing /UserGuide/stock, STOCK_GUIDE reader registration and sideMenu.stockGuide; it covers search/scroll, header/item tabs, the card/Add/Remove, content sizing, draft preservation and saved Approvals. No translations, DTOs, payloads, calculations, AutoMapper or backend source changed in this follow-up. No migration required.

Canonical UI13 documents content-sized panels versus the approval adapter, workspace tabs and Items card composition. UI16 documents generic shared virtual-row usage/limits. The execution skill includes matching rules and two dated revision rows. Generator ran after both book changes; all eight packets regenerated through the tool, with semantic review of changed UI13/UI16 provenance and unchanged approved-reference roles in PHASE-03, and UI16 in PHASE-02. Final -Check passes all eight; no generated packet edited directly. Existing unrelated documentation differences preserved.

PrimeNG source: primeui://primeng/components/select.md, section virtualscroll, public https://primeng.dev/select. MCP validation initially flagged the existing styleClass spelling in the submitted controls; the two touched selects now use native class as the official example does, and final validation reports valid=true, no issues. Installed declarations support the new virtual/panel inputs. This checks API metadata only, not compilation/rendering. Full scoped application diff and canonical additions reviewed; git diff --check passes for application and documentation. Changes to the skill/review remain in the existing workspace instruction-layer location.

Applied scoped discovery, frozen maintenance/contract choices, Phase3 presentation and final reconciliation. No list/API/domain-action implementation or business expansion. Owner visual checks still required: card boundaries and full content, empty/populated/error/loading, short/tall windows, long item collections, 1024/700px boundaries/intermediate widths, RTL/LTR, light/dark, tab switching without reset, Create/Edit/View and approval height. Existing modal-versus-routed architectural and broader reference gaps remain outside this slice. No full-screen conformance or measured-speed claim.

Suggested frontend commit: `fix(stock): virtualize return selectors and align editor layout`. Suggested documentation commit: `docs(sigma): document shared virtual selects and return editor layout`. No backend commit. Agent utilization reduced independent backend trace time; root froze scope, implemented and integrated, and reviewed final diff. No builds, tests, lint, browser/app verification, database commands, migrations, commits, pushes or external business calls ran.

Owner's final compact-loading request is implemented generally in the existing shared critical CSS, not as an Item Return spinner. Ordinary local dialog StateMessages use a horizontal28px ring/text row with8px12px padding; loading-card hosts keep their existing region-sized overlay policy. Shared loading plan/review record the frozen presentation choice and final conformance. UI22, the execution skill and shared-screen-guidance.ts bilingual loading paragraph were updated in addition to the files above. No loading request/counter/visible-owner contract changed. Packets regenerated and all eight checks passed after the final book update; runtime visibility, layout and latency remain pending.
