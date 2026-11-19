| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-04 |

# Item Type review and final reconciliation

The request to review `Stock/ItemType` and implement the documented corrections has been handled across its directly related frontend/backend source. Complete scoped diffs were reviewed separately in the two application repositories. This is source-only implementation; runtime acceptance and schema deployment remain pending, so the feature is not Closed.

The pre-edit manifest, evidence, decisions and frozen handoff are recorded in [ITEM_TYPE_DOMAIN_API_CONTRACT_FREEZE.md](<../../../ITEM_TYPE_DOMAIN_API_CONTRACT_FREEZE.md>). Unrelated pending work, including the prior UnitsOfMeasures changes, shared translation/Layout edits and backend migrations/snapshot, was preserved.

## Evidence, pattern and phase coverage

UI type01: list with one controlled Create/View/Edit modal, Name and Category fields, no children/totals/posting. Backend Pattern1: tenant-owned `ItemType : EntityBaseWithName`. Approved references are Workshop/Job list/routes, shared EditorDialog plus Fleet/VehicleService's dirty/dialog integration, and Branch service/profile plus the later shared BE8 hooks. Reference files were read; the newly reviewed UnitsOfMeasures source supplied a compatible scaffold, while the owning books and approved references remained authority.

| Evidence | Classification | Implementation |
|---|---|---|
| `C:/Users/user/Desktop/Stock/ItemType/1.PNG` | Explicit, historical/current-date-unknown, English LTR | Name/Category grid, Create/View/Edit/Delete, paging and internal scrolling. Samples were not seeded. |
| `C:/Users/user/Desktop/Stock/ItemType/2.PNG` | Explicit, historical/current-date-unknown, English LTR | Name and Category create dialog, Cancel/Save. |
| Screenshot `Liquid/SemiLiquid` label | Conflict resolved by authoritative current source | Preserve Part=0, Liquid=1, SemiLiquid=2 in C#/TS; translated distinct choices. No merged enum or data conversion. |
| Screenshot category link/appearance | Destination uncertain; presentation guidance only | Category is a stored enum with no category navigation/route. Render translated text; shared patterns own styling. |

No unresolved material Missing/Conflicting/Uncertain requirement blocks this scope. Database contents, visual and runtime behavior remain unverified. Recipe drift check found Phase1/3/4 stale; canonical books controlled those phases. Phase0/2/5/6 were current. Documentation owner must regenerate and semantically review stale packets; none was edited.

| Phase | Applied / excluded |
|---|---|
| PLAN-00 | Not required: bounded repair of an existing CRUD owner, with no domain redesign or uncertain cross-cutting change. |
| Phase0 | Discovery, screenshot classification, source/reference selection and consumer inventory applied. |
| Phase1 | Read/write, Name/enum validation, uniqueness, deletion and integration contracts Frozen before implementation/delegation. |
| Phase2 | Shared list, Name/Category filters, real paging/count, stored-column sort, query cancellation and complete filtered export applied. |
| Phase3 | Typed Name/Category modal, Create/View/Edit, validation, retry, dirty exit and focus applied. |
| Phase4 | Delete and discard applied. No activation UI, posting, approval, accounting or additional domain transition exists to implement. Generic compatibility operations remain inherited. |
| Phase5 | Source route/provider/interceptor/event wiring applied. Execution-level verification remains owner-pending. |
| Phase6 | Complete scoped diff and final contract/conformance comparison applied; no runtime pass claimed. |

## Decisions and resulting behavior

| Concern | Decision, evidence and result |
|---|---|
| Grid ↔ ListVM | Grid order: shared **Actions**, **Name:text**, **Category:text**. ListVM exactly **Id:int, Name:string?, Type:ItemCategory**. Id targets actions; no status field needed. Frontend: id:number/name:string\|null/type:ItemCategory. |
| Lean read models | Detail exactly Id,Name,Type. Removed unused inherited SubscriptionId, IsActive, IsValid, IsChanged, No, GUID, CreatedAt, CreatedBy and detail IsDeleted. Removed frontend tenant/audit members and string identity/type mismatch. Exact consumer checks found no stale in-scope use. |
| Client ownership | POST `{name,type}`; PUT `{id,name,type}`. Identity is selected, never editable. Tenant/audit values are backend-owned and absent from payloads. |
| Name | Required, whitespace-only rejected, max250. Existing Add250/Update50 mismatch corrected with explicit feature VMs, leaving shared bases unchanged. Existing request converter trims strings before validation/duplicate checks. EF now declares max250. |
| Category contract | One frontend enum file preserves0/1/2. Create starts null, requiring explicit choice. API Type is nullable with Required+EnumDataType; null/omitted/undefined values fail model validation before mapping to the nonnullable stored enum. Valid Part0 is accepted. |
| Unknown legacy category | View/export render no invented label; edit validator requires a defined choice before save. Existing values are not silently converted. Owner must inspect invalid stored categories. |
| Category labels | enumOptions/enumKey plus TranslateOptionsPipe replace two EnumToArrayPipe uses and index-based DTO mutation. Current-language labels/filter text/export change without modifying numeric IDs. Category column caption now matches screenshot terminology: Category / التصنيف. |
| Filters/paging | Name Contains and Category equality via Filters[name]/Filters[type]; null/empty omitted and numeric0 retained. Draft controls only become applied on Search. Default15 and choices10/15/20/50/100; count comes from server, backend clamps100. |
| Sorting/export | Name/Type allowlist; Category orders by stored enum, not translated alphabetical text. Generic Id tie-breaker remains. fetchAllPages exports all matching rows through the same Name/Category column format, not only the visible page. |
| Async reads | switchMap cancels superseded list requests, finalizers balance local/global loading, failures clear misleading grid data and expose Retry. Closed/identity guards and destruction cleanup prevent stale editor updates. |
| Modal | Shared content-sized560px, contentPadded=true, one-column Name/Category form, shared header/footer. View displays text and allows Edit; no Save in View. Titles identify the screen/mode and subtitle names the record. |
| Close/focus | Shared discard confirmation for dirty Create/Edit covers Cancel/X/Escape and route leave through local CanDeactivateFn; pristine/View exit silently. Saving/confirming blocks duplicate actions. Shared focusField and caller restoration handle initial/invalid/Retry focus. |
| Business key | Reviewer decision under owner standing rule: live tenant Name, consistent with ordinary named master selection and no source-backed need for same-name duplicates by category. Reject speculative composite Name+Type. Base UniqueColumns/RecordAlreadyExists excludes self and serializes writes; matching DB unique index pending migration. |
| Delete | Empty menu action repaired. Shared named confirmation → DELETE ItemType?id → metadata RemoveWithChildrenAsync → applied list refresh; last row falls back a page. Both failure channels retain the row and release busy state. |
| Relationships | Entity-model symbol inventory found no inbound ItemType FK or owned child. Item.Type is a different ItemTypeEnum, not a relation to this entity. No relationship invented. Shared metadata helper covers any future configured references. |
| AutoMapper | Four one-way maps: Add→ItemType, Update→ItemType, ItemType→Detail, ItemType→List. All ReverseMaps removed. Nullable request enum maps after API validation. FullListVm declaration was its only consumer and was deleted; DeleteVm retained. |
| Overrides | Only UniqueColumns for Name and RemoveAsync for usage-aware delete. List/detail/Add/Update/select/activation and controller methods inherited; no redundant override/custom endpoint. |
| Calculations/transactions | No money, VAT, totals, numbering, accounting or aggregate children. No new calculation/transaction owner; generic save and shared uniqueness boundary remain authoritative. |
| Routing/provider | `/ItemTypes` owns modal modes. Old create/details links return UrlTrees with one-time intent, preserving compatibility. Service remains providedIn root/environment.baseUrl; only its redundant Layout import/provider removed. |
| Feedback | Inline list/detail requests skip global error presentation and use apiErrorMessage. Save/delete global interceptor owns success/error once; local flags retain state. Export is all-or-nothing with inline failure and no partial file. |
| Security/action inventory | Existing AuthGuard and authorized base controller retained; no authorization API invented. Candidates: POST create, PUT edit, DELETE delete. Job Create/View/Edit/Delete supported; labour/invoice/close/gate/lubrication and VehicleService nested selection/child workflows not applicable to this entity. No Print inferred. |

## Changed files

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

| Relative path(s) | Change |
|---|---|
| `src/app/modules/Stock/ItemType/components/list/list.component.ts`, `.html` | Shared controlled list, applied filters/state, paging/sort/export, actions and modal owner. |
| `src/app/modules/Stock/ItemType/components/details/details.component.ts`, `.html` | Typed Name/Category modal, validation, read recovery, save/discard/focus. |
| Both component `.scss` files | Empty files deleted and style references removed; shared presentation only. |
| `src/app/modules/Stock/ItemType/models/create.ts`, `details.ts`, `list.ts` | Exact request/read/query contracts. |
| `src/app/modules/Stock/ItemType/models/item-category.ts` | New single domain enum source used by all feature models/components. |
| `src/app/modules/Stock/ItemType/services/item-types.service.ts` | Typed ItemType API methods, query and complete export helpers. |
| `src/app/modules/Stock/ItemType/item-types.routes.ts` | Compatibility redirect adapters and dirty-exit adapter. |
| `src/app/modules/i18n/vocabs/en.ts`, `ar.ts` | ItemTypes caption corrected and28 matching leaf keys added (30 total); unrelated blocks preserved. |
| `src/app/_metronic/layout/layout.module.ts` | Only ItemTypesService import/provider removed in this task; prior UnitsOfMeasures and other existing edits preserved. |

Backend repository: `F:/My Work/Sigma/SigmaBackend`.

| Relative path(s) | Change |
|---|---|
| `SiGma.Business/Services/StocksServices/ItemTypeService.cs` | Shared Name uniqueness and metadata delete hooks. |
| `SiGma.Business/MapperConfig/ItemTypeProfile.cs` | Exactly four directional maps. |
| `SiGma.DataAccess/Configuration/ItemTypeConfig.cs` | Name250 and filtered tenant/name unique index. |
| `SiGma.ViewModels/ViewModels/ItemTypes/ItemTypeAddVm.cs`, `ItemTypeUpdateVm.cs` | Explicit Name validation and required defined nullable Type input. |
| `SiGma.ViewModels/ViewModels/ItemTypes/ItemTypeDetailVm.cs`, `ItemTypeListVm.cs` | Explicit Id/Name/Type read models. |
| `SiGma.ViewModels/ViewModels/ItemTypes/ItemTypeFullListVm.cs` | Unused file deleted after consumer search. |

Entity, interface/controller, shared components/base services, parent lazy route, tests and tsconfig were unchanged. The enum is imported through the existing runtime graph; no broad compilation include or test entry was introduced. Review artifacts are local records outside the application repositories.

## Final source conformance reconciliation

| Path / owning blocks | Actual target and shared/reference symbols / compared contract | Outcome |
|---|---|---|
| Shell/title UI1/3 | ItemTypesComponent host sigma-route-host → list-page/panel/header/table; Job same chain; FeatureTitle shared inset/surface/accent | Same shared container-fill/paint owners, no feature page height or palette; runtime viewport/theme acceptance pending. |
| Filters UI4/16 | filterForm name/type; appFilterPanel mainColumns2, busy/resetRequested/projected actions; FilterPanel owns34px field geometry | Name/Category responsive fields, Reset→defaults/page1; PrimeNG fields fill allocated width and append overlays to body. |
| Grid UI5/6/8 | columns Name/Type vs ListVM Id/Name/Type; DataTable fill/lazyLoad/rowActivated; resolveListPaging and generic count/order | One shared row scroll/paginator owner, actual totals, typed View/actions and same formatted export columns. |
| Query BE9/13/UI2/28 | buildQuery applied signals → toListParams → generic enum/string filters → CountAsync/order/page → Results | Name trim and Type0 retained; name/type sort only; switchMap/finalize handles supersession. |
| Enum UI16 | item-category.ts matches C# enum; enumOptions/enumKey/TranslateOptionsPipe; actual installed dropdown inputId/ariaLabel signatures | Stable0/1/2 IDs; null empty form/filter; translated text in dropdown/View/grid/export; no array-index inference. |
| Modal UI10/13/15 | EditorDialog public mode/width/contentPadded/actions/shown hooks, VehicleService requestClose/canDeactivate |560px content-sized field group, one-column sigma-editor-grid, sigma-editor-scroll flex-fill, fixed shared footer; no tabs/children. |
| Validation UI19/22/27/BE3 | required/name pattern/max250 and category option membership; FieldError overrides; Required/EnumDataType before service | Both fields retained on save failure; invalid/Retry focus; inline read errors and busy close guards. |
| Backend BE3/4/5/8 | class-only generic detail constraints, four maps, UniqueColumns and RemoveWithChildrenAsync | Lean read VMs accepted by inherited contracts; only justified overrides; no duplicated generic operations. |
| Integration UI1/26/28 | parent ItemTypes lazy route, Job-style CanDeactivateFn, AppRouting AuthGuard, AppModule interceptor HttpClient | Legacy links redirect to one owner; modal changed closes/refreshes; root provider path and destruction cleanup verified. |
| Translation UI23 | Check-Translations.ps1 -Block itemTypes |30 EN /30 AR,0 missing/0 case mismatch; exact generated categories.Part/Liquid/SemiLiquid keys exist. |

The root reviewed complete scoped backend and frontend diffs, including feature-owned hunks in dirty Layout/translations and the new enum file. Scoped searches found no stale ms-lib/EnumToArrayPipe/any/tenant payload/style reference, inappropriate ReverseMap, merge marker or removed-field consumer. Override matches agree with the freeze table. Shared input/output and installed dropdown signatures were read. Both repositories' scoped git diff --check passed; line-ending notices only. A bounded independent read-only audit found no actionable integration defect and confirmed Part0 through route/query/form/save/export.

## Migration and owner acceptance

Owner must generate and review:

```powershell
Add-Migration ChangeItemTypeNameAndUniqueness
```

Reason: EF Name becomes max250 and receives a filtered unique `(SubscriptionId,Name)` index. Nullable required Type is only a request-validation change; persisted Type and enum values are unchanged. No migration with this suggested name was found. No migration/snapshot was edited/generated/run.

Before migration inspect legacy names longer than250, duplicates under the actual database collation, null names, invalid stored categories and `IsDeleted = NULL`. Do not automatically truncate/delete/normalize them. Standard `[IsDeleted] = 0` excludes null flags while some repository business checks treat them as live; shared serialized writes do not replace deliberate legacy-data/index reconciliation. Existing duplicates/long values may prevent migration. No inbound FK was found, so do not assume Items usage blocking or add a relationship without a domain decision. Compatibility risks include external consumers expecting removed unused response fields or omitting Type; no such in-scope consumer was found. Compilation, DB/concurrency, viewport and visual behavior remain unverified.

Owner verification steps:

1. Build both affected repositories and review migration model/SQL and existing data before applying it.
2. Search Name/each Category including Part0, Reset, paging/size/Name+Category sorting, draft-vs-applied state, rapid searches, refreshed URL and complete filtered Excel.
3. Create/View/Edit each category; switch language and verify labels/IDs. Reject blank/whitespace/251-length name, accept250 and edit an existing51–250-character name. Reject absent/null/undefined enum inputs at the API, preserve Part0.
4. Check same-tenant duplicates on Create and Edit, unchanged-name self-update, concurrent duplicate writers, tenant isolation and deleted-name reuse after index preparation.
5. Check Cancel/X/Escape/route leave, pristine/dirty/busy states, keyboard dropdown operation and initial/invalid/Retry/returned caller focus.
6. Cancel and complete Delete, last-row paging fallback, business/HTTP failures and retained rows. Metadata reference protection is used if actual relations are introduced; no current Item linkage is claimed.
7. Exercise list/detail/save/delete/export failures and retries, late/closed requests, balanced loading, retained entered fields, exactly one toast/error owner and no partial export.
8. Verify old create/details links and invalid IDs; Arabic/English, RTL/LTR, light/dark and narrow/wide viewports with one internal scroll owner and visible paginator/footer.

Suggested commits only:

- Frontend: `refactor(item-type): use shared list and modal editor`
- Backend: `fix(item-type): align contracts and protect writes and deletion`

## Shared pieces, agents and execution boundary

Existing shared shell, title/filter/table/dialog, confirmations, paging/query/route/export, enum translation, field errors, error extraction and focus were adopted. The two duplicated frontend domain enum declarations became one ItemCategory source. Remaining code is feature contract/orchestration, not a new generic mechanism; nothing further qualified for extraction. No new reusable guidance beyond existing books was established, so no book/skill/changelog change was required.

Root owned evidence/reference decisions, freeze, frontend, integration and complete final diff/report. The existing backend_units routine worker was reused after freeze with exclusive ownership of the eight backend ItemType files and then a read-only integration audit. It inherited the parent model because the AGENTS routine gpt-5.6-terra mapping was unavailable; no override was invented. Separate backend/frontend file ownership enabled useful parallel work without merge risk, and reuse reduced context/coordination cost. Root reviewed the agent result and retains final accountability.

No builds, tests, lint, browser/app execution, database commands, migrations/snapshot edits, commits/pushes, deployment, Graphify or Sigma MCP operations ran. Verification used only source/diffs, recipe drift and translation parity. Documentation regeneration and owner execution/acceptance remain pending.
