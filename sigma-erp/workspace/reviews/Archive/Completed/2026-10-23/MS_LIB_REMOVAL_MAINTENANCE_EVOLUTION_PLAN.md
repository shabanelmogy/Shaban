# Remove legacy ms-lib dependency

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-15 |

Owner asks to remove ms-lib initially before considering Angular21. Scope is the frontend's existing consumers, their templates/models and obsolete library integration. No Angular/PrimeNG version upgrade, backend/DTO API change, accounting formula, migration, permission or new workflow. Implementation is authorized by the removal request; freeze below selects the source-supported shared replacement.

## Discovery and impact

Scoped dependency search identifies 40 feature TypeScript consumers plus GridTableSearchClearDirective. Consumers: legacy ordinary lists across Vouchers/Billing/Administration/Customers/Fleet/Agreements Dashboard2, five legacy Invoice candidate/detail screens, Holidays settings, VehicleRentalDetails status summary. Some generated list columns refer to product-like fields absent from declared DTOs; those pre-existing business/model inconsistencies are recorded, not resolved by guessing new columns. Existing response populations, service method signatures, create routes, defined row actions, search keys and financial save payloads remain owned by the features.

ms-lib exports TableListComponent/ListCol/ColType/SelectionMode plus service classes. One equipment-rental consumer extends its BaseComponentService; replace with the existing application BaseComponentService (same loading/router/activatedRoute/subscription surface). Package.json currently does not declare ms-lib; no fabricated npm dependency addition or lockfile refresh. Shared DataTable already supplies typed columns, custom templates, row links/actions, complete-array local paging, loading/empty states and multi-selection; FilterPanel and FeatureTitle/PrimaryActionButton own list presentation.

## Classification / alternatives

| Owner | Decision |
|---|---|
| Existing consumer components/routes/services | Keep in place; preserve externally visible contracts |
| Library wrapper/table metadata | Replace directly with DataTableColumn<Row>/DataTableComponent; no copied library or compatibility wrapper |
| List title/search/Create shell | Refactor to existing shared FeatureTitle/FilterPanel/PrimaryActionButton/list shell; preserve existing field-level search request semantics and local keyboard/filter affordances where present |
| Invoice candidate tables | Replace display/selection only; no generation/settlement/payload redesign; retain source-supported mode gating |
| Holidays | Shared table/actions; retain existing editor/write boundary |
| VehicleRentalDetails | Replace actual status summary table, keep DynamicReports producer intact |
| Unused GridTableSearchClear directive and integration/styles | Remove when no consumers remain; existing global clear/filter owners replace the old DOM-mutating directive |
| Installed node_modules copy | Treat as package-manager artifact; source/config elimination proves no runtime dependency, no recursive manual node_modules deletion required |

Alternative of vendoring ms-lib or keeping its API behind a local adapter rejected: duplicates the existing canonical grid and retains legacy column contract. Whole-screen business rewrite rejected because removal does not authorize missing financial semantics.

## Frozen preservation contract

1. Replace imports and actual `<table-list>` elements in place with one shared `<app-data-table>` per existing table. Remove old metadata enum/types rather than renaming/re-exporting them. Typed feature rows use actual response DTOs or explicit feature-owned presentation shapes for existing loose/projection rows; do not weaken the shared column API.
2. Keep existing service calls, endpoints, query keys, create/detail destinations, counts/population and writes. Existing arrays remain local-paged, lazy=false unless an already explicit server-page contract exists; do not claim a default server page is a complete dataset. Retain existing local keyboard/status filtering and custom search inputs where active; no invented backend search contract.
3. Preserve working action handlers and templates; shared actions render actual row operations. Placeholder console-only actions are not implemented as real operations or expanded into accounting logic. Preserve column order/labels/date rendering and existing row navigation. Nested display properties use typed value projections.
4. Use shared list/filter/title/button owners, bounded fill chain where the consuming layout supports it, one row scroll owner. Embedded settings/editor tables use existing container boundaries and shared public table inputs. No feature table/paginator/theme CSS or new wrapper component.
5. Read failures handle both declared failure and HTTP failure; pair the global loader with finalize, teardown on destroy and avoid stale overlapping list responses. Preserve central interceptor error owner. No silent empty error handlers.
6. Guide update uses the existing in-app common/owning module guides; explain search, local paging, actions and internal scroll without claiming unimplemented generation or full-dataset transport. Root owns guide translations/registration to avoid agent overlaps.

## Pre-edit conformance evidence

| Concern | Book / reference read | Shared owner / target |
|---|---|---|
| Discovery/freeze/layer boundaries | Master4/5/7; PLAN00 + Phase02/06 packets after all8 drift check passed | This freeze + final report, no business contract changes |
| List shape01/02 | UI1/3/4/5/6; Workshop Job list template, FilterPanel and DataTable actual declarations | In-place lists with shared shell/filter/title/table, existing editor handoffs retained |
| Columns/actions/selection | UI5/6/7; DataTableColumnFormat/DataTableColumn and ActionList public declarations | Typed field/value/link/template/actions, public select/selectionChange, no direct PrimeNG table mutation |
| Read-only status summary | UI6/20; existing DynamicReports + DataTable | Complete provided status array; main report unchanged |
| Financial candidate screens | UI6/13/14, actual Invoice subcomponents | Replace transport-independent table and base class only, existing payloads retained |
| Loading/lifetime | UI22/28; existing global interceptor + RxJS teardown/finalize | Central error presentation, no duplicate toast or leaked busy state |

## Work ownership and verification

After this shared freeze, independent workers may edit (A) Vouchers ordinary list components except Invoice subcomponents; (B) non-Vouchers ordinary lists except Holidays/VehicleRentalDetails; (C) the five Invoice subcomponents. Root owns shared source/config/styles, Holidays/VehicleRentalDetails, guides/translations and final integration/diff review. Workers do not edit shared components, guides, generated packets, backend or package config. Preserve user/peer changes; initial scoped git status was clean for the targeted consumers.

Source-only verification: full diffs in actual frontend repo, old import/selector/type search, TS/template parsers, column/template/direct-import checks, declared package/lock/config checks and recipe drift check. No builds/tests/lint/browser/DB/migrations/commits/push/deploy. Owner validates compilation and representative list/search/action/selection/modal/report behavior in Arabic/English, RTL/themes and narrow/short sizes. No screenshot evidence used for this dependency removal.

Pre-handoff clarification: UI5 owns date formatting. Preserve source date values and date-only granularity, but render through shared type='date' (dd/MM/yyyy), superseding the former wrapper's textual-month dd/MMMM/yyyy presentation. No query Date serialization, accounting value, date-range or timezone rule changes. This is a routine presentation choice within the authorized canonical grid replacement; all workers notified. Existing date filters retain their actual query keys and request behavior.
