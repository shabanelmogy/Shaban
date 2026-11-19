# Shared advanced table filtering and first-column freeze

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-23 |

## Manifest and confirmed scope

Owner requested PrimeNG advanced filters and first-column freeze in every shared table, approved full-result server filtering and the unified contract, then explicitly requested unifying inconsistent paths and correcting errors. The initial local-only compatibility slice was superseded by that approval; it is retained as decision history in the plan. This review owns the final combined delivery. No screenshots/video supplied.

Repositories: `F:/My Work/Sigma/SiGmaAngularFrontEnd` and `F:/My Work/Sigma/SigmaBackend`; canonical books under `F:/My Work/Shaban Documents/Shaban/sigma-erp`. Workspace/reviews/skill are local instruction records. Existing unrelated Accounts, Banking, schema/snapshot, translations and documentation changes predate or coexist with this task and are not reverted. This task never edits migrations/model snapshots/entities.

## Shapes and references

- UI: shared read grid UI5/6; editable native collection UI14; existing shared dynamic report compatibility body. Reference owners are `shared/components/data-table`, `editable-collection-table`; Job is the read-query integration reference. Flat reports retain UI20/21 complete-output contracts. No feature editor redesign.
- Backend: existing normal-entity/master-detail/report read shapes remain; the cross-cutting concern is BE9 typed query constraints. Existing entity DTOs and calculation owners remain. A custom read projection must supply its actual scalar formulas instead of assuming its AutoMapper map includes post-page calculations.
- Applicable workflow: PLAN-00; Phase0 discovery; Phase1 shared API freeze; Phase2 grid/filter/query/export integration; shared presentation part of Phase3; Phase5 existing event/transport/localization wiring; Phase6 source reconciliation. Phase4 domain transitions, writes, persistence and migrations are not applicable.
- No routes/providers/auth boundaries are added. Existing list endpoints remain; query-only search DTOs gain initialized `Filters` where needed. POST search uses `filters.grid`, GET uses `Filters[grid]`. No top-level `Grid` parallel transport and no ambient interceptor state.

## Frozen contracts

Read the detailed [plan](SHARED_TABLE_FILTERS_MAINTENANCE_EVOLUTION_PLAN.md) and [approved API handoff](SHARED_TABLE_REMOTE_FILTER_CONTRACT_FREEZE.md). Multiple rules use a typed JSON column list; fields combine with AND, each column supports AND/OR up to five constraints. Server filtering precedes count/order/page and the existing export reads the same applied snapshot. Invalid requests/fields/operators/types fail safely with localized400; they never become an unfiltered success.

The grid column order and ListVM properties remain with every screen. Freeze applies to the first rendered column: Selection, otherwise Actions, otherwise first data column. No extra business column is frozen and no fields are reordered. A type hint, source-supported filter alias or enum option list is shared metadata, not a business rule. Action-only/positional columns have no data-filter meaning. Editable form rows retain original indexes; report hierarchies retain ancestor/subtotal/expansion contracts.

## Conformance evidence

| Concern | Book | Source producer and consumer | Final evidence/status |
|---|---|---|---|
| Shared table and frozen column | UI6/25 | shared table template/SCSS; collection SCSS; dynamic reports SCSS | Logical inset, opaque row surfaces, header z-index, print reset; source review complete |
| Typed menu values | UI5/6/23 | `DataTableColumn`, view wrappers, PrimeNG21 installed declarations | Original row callbacks/selection preserved; calendar dates, numeric money, enum choices and language labels; source review complete |
| Query ownership | UI2/4/6; BE9 | `withGridFilters`, `toListParams`/`toQueryParams`, each list applied snapshot | Existing screen filters retained, filter-only events reload page1, Reset clears, no global transport; consumer source review complete |
| Generic server filter | BE7/9 | `GridFilter`, Service `GridFilterProjection`/`ApplyGridFilters` | Bounded scalar whitelist and parameterized expressions before count/page; source review complete |
| Custom reads | BE9/17 | Existing manual SQL projections, typed filter-only projections or existing complete aggregate sequences | Formula/alias and endpoint inventory source reconciliation complete |
| Error presentation | UI22/BE9 | `GridFilterException`, existing ErrorLogsMiddleware, GeneralMessage resources | Localized400 in existing Result envelope; no request values exposed |
| Guides | Master7 | `UserGuide/content/shared-screen-guidance.ts`, existing module guide overview reader | EN/AR usage explains Apply/Clear, full-result scope, first rendered column and exceptions; source conformance reconciled; owner runtime pending |

## Verification boundary and interim findings

All work is source-only under AGENTS.md. No build, test, lint, browser/application verification, database command, migration, commit, push or deployment was run. Compilation, SQL provider translation/performance, keyboard/visual behavior, both directions/themes, print and real exports remain owner verification. Suggested commits after owner acceptance: frontend `feat(tables): add unified advanced filters and freeze first column`; backend `feat(reads): apply typed grid filters before paging`.

Source review already corrected the original shared-checkbox wrapper identity, missing Angular inject import, UTC parsing for date-only local filters, local/remote filter-state leakage, filter-only paging short-circuits, custom transport duplication and discovered custom endpoints that bypassed the generic list path. These are source findings; no runtime pass is claimed.

Initial recipe `-Check` passed. After canonical UI6/UI14/BE9 changes, regenerated through the generator and all eight `-Check` results passed. Semantic review keeps shared table vs Job integration vs report references distinct, and the generated phase tasks remain derivative. No generated packet was edited directly.

## Team use

Root owns scope/contracts/shared components, parser/base integration, Fleet direct endpoints, documentation/guide reconciliation and final integration. `luna_explorer` (gpt-5.6-luna) performed scoped discovery/docs and independent source audits. `terra_worker` inherited the root model because its preferred mapping is unavailable in the collaboration tool; it owns frontend consumers/services/models only. `sol_worker` (gpt-5.6-sol) owns custom backend read services/projections. Parallel work started only after the shared contract froze; no overlapping file ownership was authorized. This split reduces the wall-clock cost of tracing 131 remote/default-lazy instances and custom endpoints while keeping shared decisions with the root.

## Final reconciliation

Source implementation is reconciled within the frozen scalar-read contract. Owner build/runtime acceptance remains pending; this is not a Closed/runtime-verified record.

### Coverage, files and decisions

The final inventory contains129 remote component/template consumers,131 remote instances and1008 declared column definitions. There are301 shared table instances in HTML including the newly unified legacy flat report branch; complete local arrays inherit filtering through the shared owner. See `SharedTableFilters/FRONTEND_COVERAGE.json` for each consumer, service method, URL, field, filter alias/type and source line. See `FRONTEND_FINAL_SOURCE_AUDIT.md`, `BACKEND_PROJECTION_COVERAGE.json` and `BACKEND_SPECIAL_COVERAGE.json` in that same folder for consumer, endpoint and displayed-value comparisons.

| Decision | Applied source evidence |
|---|---|
| Shared presentation | DataTable TS/HTML/SCSS owns read menus and logical first-cell freeze. EditableCollectionTable SCSS owns form-cell freeze. Reports flat branch reuses DataTable; Reports SCSS owns only its existing tree branch. No field/action reordering. |
| Grid columns vs ListVM | All declared screen field lists and request aliases are recorded per consumer in the frontend inventory. Ordinary scalar properties match the compiled ListVM; custom displayed fields and exact response/filter projections are compared side by side in backend projection coverage. Extra internal identity/action properties do not become invented business fields. |
| Full-result read | Generic Service GridFilterProjection/ApplyGridFilters plus custom endpoint hooks constrain the existing scoped query before count/page. Existing complete aggregations filter final calculated rows before their existing count/page; no new fetch-all fallback. |
| Applied state and output | Shared withGridFilters/toListParams/toQueryParams and all129 consumers own applied state. Paging without metadata preserves it, changed rules return to page1, Reset clears it, routes/cache restore it and exports reuse it. Bill/GRN tax outputs use the same owning list record snapshot before their distinct tax projection. |
| Nulls and types | Explicit No value choice round-trips JSON null separately from Clear; zero/false remain values. Dates use calendar values, native enum IDs use translated choices, derived lifecycle badges use explicit scalar aliases. Shared local reports resolve the displayed option before the raw field. |
| AutoMapper | Existing write/read maps remain; filtering defaults to the existing compiled scalar ListVM projection. Actual custom read formulas use explicit server projections/maps, including live balances/progress and action-state inputs. No Add/Update DTO change. |
| Domain calculations | Existing calculation owners remain authoritative. Filter expressions match current receipt allocations, payable-line validity, quantity caps, percentage rounding, invoice totals and overdue calculations. PO receipt-status source now excludes allocations against nonpositive source lines, matching its existing rendered progress. Scheduled trips exclude extras before count/page, correcting short pages. |
| Integration and errors | Existing endpoints/controllers/providers/auth remain; query-only Filters dictionaries and optional trip read arguments extend the existing read boundary. Unknown fields/operators/types return localized400 via the existing middleware; empty aggregate results validate constraints too. No permission API. |
| Transport limits | Parser remains16KiB/64columns/5rules/4096value characters. Program/web.config have finite encoded-GET ceilings. HTTP.sys/proxy host limits are independent owner deployment checks; no registry/host change was run. |
| Persistence | No task entity/EF/schema change, migration, snapshot, backfill or data mutation. Owner does not need Add-Migration for this feature. Unrelated existing migration changes remain untouched. |

Principal frontend files: shared `components/data-table`, `components/editable-collection-table`, `components/reports`, `utils/list-query.ts`; i18n `translation.service.ts`, `vocabs/table-filters.ts`, en/ar vocab imports;129 consumer templates/components and their existing model/service serializers listed in the inventory. Principal backend files: Helpers/Filters/GridFilter* and Exceptions/GridFilterException; generic Services/Bases/Service; existing custom read services named in coverage, query-only request DTOs, TransportationAgreement interface/controller, ErrorLogsMiddleware, GeneralMessage EN/AR resources, Program/web.config. New native filter-only rows are VehicleGridFilterRow and WorkshopVehicleGridFilterRow. No parallel grid, report framework or global filter interceptor was added.

### Explicit compatibility boundaries

- Editable form rows receive freeze, retaining original indexes and validation visibility. Hierarchical reports receive freeze while retaining ancestor/subtotal/expansion semantics; generic advanced filtering is not applied to a flattened visible tree.
- Unsupported remote summary/clock fields have no menu and are rejected by the server: PR/PO vehicles; Bill purchaseOrderNos/vehicles; ServiceLog serviceItems/performedItems; Shift combined startTime/endTime; Overtime process-run approvedBy. Positional/action-only cells are likewise excluded. ServiceLog workTypes uses the native enum and is supported.
- Existing complete local report filtering changes visible rows only; authoritative totals and complete print/export remain their existing report contract. Runtime collation follows the existing database, not JavaScript string matching.

### Final source reconciliation and owner compiler feedback

Root reviewed shared/frontend and backend scoped diffs separately in their Git repositories, including parser/base/middleware/transport and generic one-line hooks, custom projections, aliases, DTO binding, namespace/import/project references, selection identity and print/theme/RTL rules. Bounded agents supplied independently owned source audits. Existing unrelated changes were preserved. Source whitespace checks pass in both repositories. New backend types use SDK implicit inclusion and existing project references; new frontend imports remain reachable through the existing explicit app entry graph, without broad spec inclusion.

Owner supplied six Angular compiler errors during reconciliation. Their source causes were corrected: common ListQuery.filters now owns optional grid (covering inline typed consumers including ClassificationListQuery); DeliveryNote detail-field descriptors contain no table metadata; Holidays/LeaveType initialize route state through their actual ActivatedRoute injection; PrimeNG value/selection use one array of the rendered row union rather than a union of two arrays; serializer narrowing uses an explicit GridFilterValue type predicate under this project's non-strict TypeScript setting. No any cast, compiler-setting suppression or business contract change was used. A follow-up source audit found no additional misplaced metadata or nonexistent activatedRoute usage in129 consumers; four inline query shapes inherit the common type fix. These are source repairs, not a successful rebuild claim.

Before that feedback, source syntax parsing covered652 frontend files and five shared sources with no parse diagnostics. Parsing alone does not detect the reported type errors. After the targeted repairs, source/diff review is the verification evidence; owner rebuild remains pending. No build, type checker, test, lint, browser/application verification, database, migration, commit, push or deployment command was run.

Guide handoff: `src/app/modules/UserGuide/content/shared-screen-guidance.ts` is shown by the existing `guide-reader.component.ts` in module overview guides under `/UserGuide/<module>`. Both languages cover rules/Apply/Clear/No value, full-result scope, paging/export, first rendered column and exceptions. Existing module routes/menu entries and guide reader are reused. UI6/UI14/BE9 and the skill digest/revision history were updated together; all eight packets were regenerated through the generator and checked, with source-reference roles semantically preserved.

Final acceptance remains with the owner: rebuild frontend/backend; exercise text/number/date/enum/null AND/OR constraints, no-results and malformed requests, clear/reset/page2/back-navigation/cache, post-save membership changes and full exports; verify custom SQL projections/performance; inspect first-cell stacking/actions/selection in English/Arabic and both themes, editable validation, narrow viewports and complete print; replay long Arabic filters against the actual IIS/HTTP.sys/proxy configuration. No migration is needed. Suggested frontend commit: `feat(tables): unify advanced filters and freeze the first column`; backend: `feat(reads): apply typed grid constraints before paging`.

The resumed bounded team used inherited models for backend_special (special endpoints and read-only final root audit), backend_projections (custom formulas/aliases) and frontend_finalize (consumer integration and source audit). Root integrated the outputs and owns this handoff. This reused the approved frozen contract and avoided overlapping file edits; parallel endpoint/consumer tracing reduced wall-clock work without delegating final decisions.

### Follow-up compiler correction — shared serializer inference

Owner's next frontend build reported six TS2353 errors in Accidents, ServiceBookings,
Department, StaffRole, JobCategory and LabourActivities. The previous shared grid
type correction exposed the serializer's preexisting fixed `ListQuery<object>`
parameter: inline literals were contextually checked against `object & {grid?:string}`,
which erased dateFrom/plateNo/search and the other screen keys.

TierS, same frozen contract/UI6 shared owner: changed only the serializer signature
to `toListParams<TFilters extends object>(query: ListQuery<TFilters>)`. Each caller
now supplies its inferred complete filter shape. The implementation/HTTP keys,
null/false/zero handling, paging, sorting and all screen/API contracts are unchanged.
No any/index-signature workaround, caller casts, per-screen duplication or relaxed
compiler option. Checked all six caller object shapes and found no other fixed
ListQuery<object> signature in the affected shared/caller scope. No backend/schema
change or migration. User-guide content is already accurate: this is a type-only
repair with no behavior change, so the existing guide/reader is retained.

UI6 and the skill checklist/revision record were updated together. Packets refreshed
by the generator and checked. Complete scoped frontend diff reviewed preserving
existing shared-filter work; whitespace check passes. No agents: one tightly coupled
signature fix. Source-only evidence, no build/test/lint/runtime/database/commit run;
owner rebuild remains pending. Suggested frontend commit:
`fix(tables): preserve filter inference in the shared query serializer`.
