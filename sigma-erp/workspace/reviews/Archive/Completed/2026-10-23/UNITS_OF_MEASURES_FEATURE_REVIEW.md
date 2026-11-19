| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-04 |

# Units of Measures feature review and final reconciliation

The authorized request covers the existing `Stock/UnitsOfMeasures` screen and directly related API. All confirmed scoped fixes have been implemented and their scoped source diffs reviewed separately in the frontend and backend repositories. Runtime acceptance is pending; this record does not declare the feature Closed. Unrelated working-tree changes were preserved.

Frozen handoff and pre-edit evidence: [UNITS_OF_MEASURES_CONTRACT_FREEZE.md](<../../../UNITS_OF_MEASURES_CONTRACT_FREEZE.md>), including its append-only source correction and integration decisions. Those corrections control the final guard symbol, row interaction and migration suggestion.

## Manifest, evidence and phases

UI shape: canonical type 01, list with Create/View/Edit modal, one Name field. Backend shape: Pattern1, ordinary tenant-owned `UnitsOfMeasures : EntityBaseWithName`. Approved references: Workshop/Job list, shared EditorDialog as used by Fleet/VehicleService, BranchService/BranchProfiler plus the later shared generic hooks. No new parallel feature, shared helper, permission system or domain workflow was introduced.

| Evidence | Classification | Applied content |
|---|---|---|
| `C:/Users/user/Desktop/Stock/UnitOfMeasurement/1.PNG` | Explicit historical/current-date-unknown English LTR screenshot | Name, Create, Edit/Delete and paged scrollable list; sample values are not seed data. |
| `C:/Users/user/Desktop/Stock/UnitOfMeasurement/2.PNG` | Explicit historical/current-date-unknown English LTR screenshot | Name-only create modal, Cancel and Save. |
| Name entry to details | Strong inference confirmed by existing source | Shared accessible row View and explicit View action preserve the existing details workflow. |
| Screenshot appearance | Guidance only | Canonical shared components own layout, RTL, responsive behavior and themes. |
| Tenant/validation/duplicates/deletion | Confirmed source/book contracts | Applied through existing generic backend owners and feature configuration. |

No unresolved Missing, Conflicting or Uncertain business/API requirement remains in the implemented scope. Live database characteristics, runtime and visual behavior are unverified. Recipe drift check found Phase1/3/4 stale; their canonical owning books controlled implementation. Documentation owner must regenerate and semantically review those packets. Generated packets were not edited.

| Phase | Outcome / reason |
|---|---|
| PLAN-00 | Not needed: bounded repair of an established CRUD owner with source-supported contracts. |
| Phase0 discovery/evidence | Applied: scope, screenshots, owners, references, consumers and current defects identified. |
| Phase1 domain/API | Applied and Frozen before implementation: lean read/write models, validation, uniqueness and delete rules. |
| Phase2 read/grid | Applied: shared list, Name filter, paging, allowlisted sorting and complete filtered export. |
| Phase3 detail/write | Applied: one typed Create/View/Edit modal, validation, recovery, focus and dirty close. |
| Phase4 domain actions | Delete/discard applied. Activation UI, posting, approvals, reasons and other transitions are not applicable; no source/screenshot workflow requires them. Existing generic compatibility endpoints remain. |
| Phase5 integration/runtime | Source integration applied: route adapters, local CanDeactivateFn, root service/provider and interceptor ownership. Runtime verification pending by execution boundary. |
| Phase6 reconciliation | Complete scoped diff and source-contract comparison performed; owner execution remains pending. |

## Decisions and implemented behavior

| Concern | Decision and evidence |
|---|---|
| Grid vs ListVM | Grid data columns: **Name**; shared Actions first. ListVM properties: **Id:int, Name:string?**. Id serves identity/actions; there are no unused status, tenant or audit columns. Frontend uses `id:number, name:string\|null`. |
| Detail contract | **Id, Name** only, matching the read-only modal; no tenant/audit/unused flags. |
| Add/Update contract | POST `{name}`; PUT `{id,name}`. Identity is never editable and tenant identity comes from the backend context. |
| Name limit | Required, whitespace-only rejected, maximum250 in both feature write VMs and the Angular form. Existing Add allowed250 while Update allowed50; matching them fixes create-then-uneditable values without changing shared bases. EF maximum250 matches the write boundary. |
| Business key | Live tenant Name, existing DB collation. `UniqueColumns` uses existing localized `RecordAlreadyExists` and the base serialized write guard. Filtered unique index `(SubscriptionId,Name)` provides persistence protection after owner migration. |
| Query/paging | Trimmed applied Name via generic `Filters[name]` Contains, actual TotalCount, default15, choices10/15/20/50/100, server clamp100. Draft text only becomes active on Search. |
| Sort/export | Only Name is allowlisted; shared backend stable Id tie-breaker. Excel uses `fetchAllPages` and the same translated Name column against a captured applied-filter/sort query. |
| Request ordering | `switchMap` cancels superseded list requests; `defer` and finalizers balance loading on all exits. Read errors clear misleading rows and expose Retry. |
| Editor | Shared content-sized560px dialog with Name input/read value; title identifies mode/screen, muted subtitle identifies the unit. Read failure has Retry; save failure retains input. |
| Dirty close/focus | Shared discard confirmation handles Cancel/X/Escape and route leave through the actual Job-style local `CanDeactivateFn`. Busy actions block duplicate interactions. Field/Retry focus and caller focus restoration reuse shared/public hooks. |
| Delete | Previously empty menu action now confirms the named unit, calls DELETE and refreshes the applied list; deleting its last row falls back a page. Failures retain the row. |
| Delete safety | `RemoveAsync` delegates to `RemoveWithChildrenAsync(id,CancellationToken.None)`; no owned children. EF metadata covers Item, PurchaseRequestDetail, PurchaseOrderDetail, GoodsReceivedNoteDetail and BillDetail references. |
| AutoMapper | Exactly four one-way maps: Add→entity, Update→entity, entity→Detail, entity→List. Added missing Detail map; removed reverse/delete maps. Unused FullListVm retired after symbol/consumer search; DeleteVm retained for compatibility. |
| Calculations/transactions | No derived amounts, totals, numbering change, accounting or aggregate children. Existing generic write transaction and shared uniqueness owner remain responsible. |
| Routes | `/UnitsOfMeasures` owns all modal modes. Legacy `/create` and `/details/:id` return UrlTrees with one-time editor intent; no second editor owner. |
| Provider/errors | Feature service uses providedIn root and AppModule's existing token/error interceptor HttpClient. Only its redundant Layout import/provider removed. List/detail inline read errors opt out of global presentation; save/delete retain global success/error presentation and local recovery flags. |
| Permissions | Existing authentication/authorized API preserved. No authorization mechanism exists to consume; hidden/disabled controls are not treated as security. |
| Reference-specific extras | Job labour/invoice/close/gate/lubrication and VehicleService nested actions are not applicable. No extra fields, Print, lookup or new state action inferred. |

## Changed files

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

| Paths relative to repository | Change |
|---|---|
| `src/app/modules/Stock/UnitsOfMeasures/components/list/list.component.ts` and `.html` | Shared typed list, query/state/export/actions and modal owner. |
| `src/app/modules/Stock/UnitsOfMeasures/components/details/details.component.ts` and `.html` | Controlled typed editor with validation, recovery, discard and focus. |
| Both component `.scss` files | Deleted empty files and removed their style references. Shared styles own all geometry. |
| `src/app/modules/Stock/UnitsOfMeasures/models/create.ts`, `details.ts`, `list.ts` | Exact typed request/read/query models. |
| `src/app/modules/Stock/UnitsOfMeasures/services/units-of-measures.service.ts` | Typed API methods and shared list/export helpers. |
| `src/app/modules/Stock/UnitsOfMeasures/units-of-measures.routes.ts` | Compatibility adapters and dirty-exit guard. |
| `src/app/modules/i18n/vocabs/en.ts`, `ar.ts` | 22 additional matching keys in unitsOfMeasures only; existing unrelated changes preserved. |
| `src/app/_metronic/layout/layout.module.ts` | Only UnitsOfMeasuresService import/provider removed; other pending edits belong to existing work. |

Backend repository: `F:/My Work/Sigma/SigmaBackend`.

| Paths relative to repository | Change |
|---|---|
| `SiGma.Business/Services/StocksServices/UnitsOfMeasuresService.cs` | Shared uniqueness hook and usage-aware deletion override. |
| `SiGma.Business/MapperConfig/UnitsOfMeasuresProfile.cs` | Four directional maps. |
| `SiGma.DataAccess/Configuration/UnitsOfMeasuresConfig.cs` | Name maximum250 and live tenant/name unique index. |
| `SiGma.ViewModels/ViewModels/UnitsOfMeasures/UnitsOfMeasuresAddVm.cs`, `UnitsOfMeasuresUpdateVm.cs` | Explicit feature Name validation. |
| `SiGma.ViewModels/ViewModels/UnitsOfMeasures/UnitsOfMeasuresDetailVm.cs`, `UnitsOfMeasuresListVm.cs` | Explicit Id/Name read models. |
| `SiGma.ViewModels/ViewModels/UnitsOfMeasures/UnitsOfMeasuresFullListVm.cs` | Deleted unused type. |

Controller, service interface, entity, shared base services/components, parent lazy route and tsconfig were not changed. Review artifacts are local records outside both application repositories.

## Final conformance reconciliation

| Concern / owning blocks | Actual shared/reference symbols and compared values | Final result |
|---|---|---|
| Shell/title UI1/3 | Job host `sigma-route-host` → `sigma-list-page/panel/header`; `FeatureTitleComponent`; global shared container-fill and title inset/tokens | Same chain and title owner, no local height/spacing overrides; runtime viewport acceptance pending. |
| Filter UI4 | `FilterPanelComponent`: appFilterPanel, busy, resetRequested, projected FilterActions; shared34px geometry | One labelled reactive Name field, mainColumns1 and public `sigma-filter-field--full` span prevent unused responsive columns; no feature CSS. |
| Grid UI5/6 | `DataTableComponent`: fill, lazyLoad, rowInteractive/rowActivated, generated actions; Job list-query flow | One shared scrolling/paging owner, typed columns/actions and server TotalCount; no internal table mutation. |
| Editor UI10/13 | `EditorDialogComponent` contentPadded, auto-height/90dvh cap, width input, mode/actions; VehicleService public dialog integration |560px Name-only content-sized modal; `sigma-editor-scroll flex-fill` and one-column shared editor grid, fixed shared footer; no tabs or oversized empty workspace. |
| State/validation/focus UI19/22/27 | `FieldErrorComponent`, `StateMessageComponent`, `focusField`, shared dialog shown/close/escape hooks | Required/pattern/maxlength, inline read Retry, read focus and returned caller focus; blocked close while saving/confirming. |
| API/maps BE3/4/5/8/13 | Generic service class detail constraint, Branch directional maps, `UniqueColumns`, `RemoveWithChildrenAsync` | Lean explicit VMs fit generic constraints; four maps; no duplicated generic CRUD or manual reference chain. |
| Routes/providers UI23/25 | Job-style `CanDeactivateFn`; parent UnitsOfMeasures lazy route; AppModule `provideHttpClient(withInterceptors([tokenInterceptor,errorInterceptor]))` | Local adapter delegates dirty state to modal, compatibility redirects preserve old links, no local HttpClient/duplicate feature provider. |
| Errors/translation UI22/28/29 | Existing skip-error header and apiErrorMessage, global interceptor, EN/AR feature blocks | Both business/HTTP failure channels handled. Translation block check:23 EN/23 AR keys,0 missing/0 case mismatch. |

Complete scoped frontend and backend diffs were inspected independently, including the feature-owned hunks in pre-existing dirty Layout/translations. Both scoped `git diff --check` runs passed; Git emitted line-ending notices only. Directly related symbols/types/routes, shared input/output signatures, mapping constraints, stale legacy imports, payload/response correspondence and merge markers were checked. A bounded independent source audit found no additional actionable integration defect. No compiler or runtime success is claimed.

## Migration, risks and owner verification

The owner must generate and review the schema migration because EF now limits Name to250 and adds the unique live tenant/name index:

```powershell
Add-Migration ChangeUnitsOfMeasuresNameAndUniqueness
```

No matching migration filename was found in the scoped migration-name check. No migration or model snapshot was created/edited/run by this task.

Before migration, inspect existing names longer than250, live duplicates under the actual database collation, nullable names and legacy `IsDeleted = NULL`. Do not automatically truncate, delete or normalize existing data. The index uses the project's standard `[IsDeleted] = 0` filter; it excludes NULL flags, whereas some shared business checks also treat NULL as live. The base serialized uniqueness guard protects ordinary writes; owner must reconcile legacy data/index coverage. Index creation can fail on existing duplicates or length conflicts. Validate DB collation behavior and any external consumers of the leaner API responses; no stale in-scope consumer was found. Runtime FK-usage/concurrent-write behavior and visual sizing remain unverified.

Owner acceptance after normal build/database preparation:

1. Compile both affected repositories and verify the migration model/SQL against representative existing data before applying it.
2. Check Name search, Reset, paging, Name sorting, draft-vs-applied filter state, rapid query changes, URL refresh and complete filtered Excel export.
3. Exercise Create/View/Edit: blank/whitespace/250/251-length names, duplicate names including edit-to-existing, and a previously valid51–250-character name.
4. Check Cancel/X/Escape/route leave with pristine, dirty and busy forms; verify field/Retry focus and restored caller focus with keyboard and mouse.
5. Delete an unused unit, cancel deletion, delete the last row of a page, and confirm an in-use unit is blocked for each inbound reference without losing the row.
6. Exercise failed business responses, HTTP/network read/save/delete/export failures and retries; confirm one error owner, retained input/rows and balanced loading.
7. Open old create/details links, invalid IDs, both languages, RTL/LTR, light/dark themes and narrow/wide viewports. Confirm one internal scroll owner and visible paginator/footer.
8. Verify concurrent same-tenant duplicate create/update, tenant isolation and index behavior using the owner's normal controlled acceptance setup.

Suggested commits (suggestions only):

- Frontend: `refactor(units-of-measures): use shared list and modal editor`
- Backend: `fix(units-of-measures): validate names and guard deletion`

## Agent utilization and execution boundary

Root owned discovery, documentation selection, freeze, frontend files, integration decisions and complete final reconciliation. One bounded `backend_units` routine worker owned only the eight backend feature files listed above after the handoff was Frozen; it then performed a read-only frontend integration audit. It inherited the parent model because the AGENTS.md routine-worker mapping gpt-5.6-terra was not selectable; no model override was invented. Separate frontend/backend ownership allowed useful parallel work with no overlapping edits, reducing expected wall-clock time; the existing agent was reused for audit rather than spawning another. Root reviewed and integrated its result.

No build, test, lint, browser/application verification, database command, migration, snapshot edit, commit, push, deployment, Graphify or Sigma MCP operation was run. Verification was restricted to source, scoped Git diffs/whitespace, documentation drift and translation checks. No new reusable guidance was established beyond existing documented rules, so no book/skill modification or extraction was necessary. Documentation drift and owner execution remain pending.
