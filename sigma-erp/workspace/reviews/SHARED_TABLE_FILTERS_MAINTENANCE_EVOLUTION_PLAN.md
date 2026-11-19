# Shared table advanced filters and first-column freeze

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-23 |
| Tier | L — shared presentation |

## Authority and scope

Owner requests: add PrimeNG advanced column filtering and freeze the first column in all shared tables. Owner asked which filtering scope serves Sigma best; the selected design is full-result filtering, never filtering only a server page. This plan authorizes only source-supported slices under the existing implementation request. No builds, tests, lint, browser, database, migrations, commits or pushes.

Sources: Master1/4/5/7; UI4/5/6/14/23/25/27/29; BE9. Recipe `-Check` passed for all eight packets before using PLAN-00 and PHASE-02. Approved owners: shared `data-table`, `editable-collection-table`; Job list is the read-only integration reference, not a universal endpoint contract.

## Existing state and impact map

| Area | Owner and evidence | Current state | Decision |
|---|---|---|---|
| Shared read table | `shared/components/data-table/*` | 300 instances in 249 HTML files; 169 explicitly local, 90 explicitly lazy, 41 default lazy | Extend existing owner |
| Local data | PrimeNG local paging/sort | Complete supplied arrays; feature-owned original row identities, actions and exports | Keep source rows and local paging; extend typed column-filter presentation |
| Remote data | 128 lazy-load consumers, 113 services using `toListParams` | No common advanced-filter API; per-feature keys/projections/endpoints, some custom paging | Keep server count/page authoritative; no page-only fallback |
| Editable collections | Projected row templates and form arrays | Columns have no field/value contract; projected indexes drive deletion and controls | Keep form rendering; freeze first rendered cell; no filtering that hides validation or remaps indexes |
| Reports | Shared grid/hierarchy/print owners | Expansion, accounting tones, full-data export/print | Keep hierarchy and output contracts; do not silently remove subtotal/parent rows |
| Guides | `UserGuide/content/shared-screen-guidance.ts` | Shared advice appears in each module overview | Extend existing bilingual guidance |
| Domain/API/persistence | Existing services/DTOs/EF | No universal advanced-filter schema | Keep; no entity/DTO/schema changes in frontend slice |

Discovery was scoped to shared owners and their direct consumers. Existing frontend changes, including EN/AR vocabularies and Accounts guides, belong to other work and must be preserved.

## Options and decisions

| Option | Assessment | Decision |
|---|---|---|
| Filter the loaded server page | Incomplete results and misleading counts | Reject |
| Fetch all server pages in the browser | Unbounded reads and changed export/read ownership | Reject |
| Implicit interceptor/global filter state | Hides endpoint ownership; risks unrelated requests and multiple grids | Reject |
| Native PrimeNG local menu for complete flat datasets; explicit remote contract for server reads | Correct result scope; keeps existing owners | Select |

## Frozen presentation contract and first implementation slice

- Freeze the first **rendered** column at logical start: selection when present, otherwise Actions when present, otherwise the first data column. Do not reorder columns or freeze an extra business column. Disable sticky positioning for print/flow tables. The existing row scroll owner, opaque theme/row-tone surfaces and header stacking remain.
- PrimeNG menu filtering supports text, numeric and date constraints with match modes, AND/OR, Apply/Clear, and multiple rules. Filtering applies to the complete supplied local flat array before local paging; row/action/selection references remain the original objects. Custom column display transformations must not be searched using an unrelated raw value. Dates normalize to calendar dates and money remains numeric.
- Local display filtering does not redefine a report's server totals, full export, or full-print scope. Hierarchical report filtering requires a separately defined ancestor/subtotal retention contract and is excluded from flat filtering.
- Server-paged tables must never present a working filter menu unless their owning endpoint and consumer process the complete constraints before count/page/export. Existing lazy consumers ignore column-filter metadata; forwarding an event alone does not implement filtering.
- Editable collections preserve every form row and its original indexes. Their first column is frozen in the existing native shared owner; no new PrimeNG form-table replacement.
- Translation and accessibility use shared owners and both languages. No feature-specific CSS or duplicate toolbar.

## Contract / ambiguity register

| Concern | Status | Evidence or exact remaining contract |
|---|---|---|
| Global shared presentation and first rendered column | Confirmed/Derived | Owner scope + existing selection/Actions/data column order |
| Complete flat local filtering | Derived | Explicit `lazy=false` plus complete-array contract UI6 |
| Remote filters across 131 server/default-lazy instances | Missing | Each endpoint needs its field -> SQL expression whitelist, supported operators/types, UI query persistence and matching export integration. No common contract exists in `ListSmBase` or consumers. Cannot infer these from translated display columns. This is an implementation dependency, not permission to silently fall back to page-only filtering. |
| Hierarchy retention | Missing | Matching descendants/ancestors, section/subtotal visibility and interaction with collapse require a defined report contract |
| Editable form filtering | Not applicable to frozen slice | Projected columns have no data accessor; hiding invalid controls is unsafe |

The frozen slice implements shared first-column freeze and complete flat local filtering. Overall requested remote rollout remains outstanding and must not be reported complete. No new business fields, permissions, accounting calculations, transitions, mapper rules or migrations are authorized/invented by the shared UI.

## Conformance and verification before coding

| Concern | Book | Actual owner/reference | Target comparison |
|---|---|---|---|
| Menu/filter semantics | UI4/5/6; BE9 | Installed PrimeNG21 `ColumnFilter`, `Table` public declarations; `list-query.ts`, Job `onLazyLoad` | Whole dataset before page; existing feature filters remain |
| Table frame / first column | UI6/25 | Shared table header/body, selection/Actions order, existing opaque row surfaces | Logical sticky start, header above body, print reset |
| Editable first cell | UI14/25 | Shared collection frame and projected row templates | Native cells, stable indexes and validation layout |
| Guides | Master7 | Shared guide content and current module reader | Bilingual explanation accurately distinguishes local and server capability |

Phases: PLAN-00 then 0/1 (shared contract discovery/freeze), 2 (local grid/filter/freeze), conditional shared integration, 6 (source reconciliation). Phase3 touches collection presentation only, not writes. Phase4 is N/A. Backend implementation/remote rollout is not complete.

Owner verification: compile; check text/number/date rules, AND/OR, clear/reset, paging after filtering, row actions/selection identity, both directions/themes, narrow overflow, first-column overlap and header stacking, validation rows and print. No migration or backfill. Rollback removes the shared presentation changes; persisted data is unaffected.

## Approved evolution after the initial slice

The owner explicitly approved the unified server contract and instructed completing
the server integration, then requested unifying inconsistent methods and fixing
wrong paths. This supersedes the remote Missing handoff above for the current
implementation; the original frozen decision is retained as history. The dedicated
SHARED_TABLE_REMOTE_FILTER_CONTRACT_FREEZE.md owns the approved JSON transport,
scalar whitelist, before-count/page/export execution and source-supported aliases.
SHARED_TABLE_FILTERS_FEATURE_REVIEW.md owns combined final reconciliation.

The shared legacy dynamic report flat branch now uses DataTable for its complete
array, inheriting the same local menus, default15-row paging and freeze; no
authoritative report totals, tree retention or print/export calculation changes.
