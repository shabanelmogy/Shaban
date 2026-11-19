# Proposed remote advanced-filter handoff

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-23 |

## Exact missing contract

`ListSmBase.Filters` currently accepts feature-specific string keys. There is no structured multi-rule column-filter request, no mapping from each displayed/derived column to its query expression, and no common frontend consumer that preserves these constraints for paging, refresh and export. 131 shared-table instances are explicitly/default lazy. The server slice cannot be completed by adding `p-columnFilter` to the shared header.

The workspace instruction “do not invent an API, field, permission, or workflow” and the Missing API boundary require a frozen shared handoff before implementing this new request shape. This is a proposed exact contract for owner direction, not an implemented endpoint.

## Recommended contract to approve

Use the existing endpoint and existing `Filters[key]` transport. Reserve `Filters[grid]` for JSON constraints, keeping existing screen filter keys unchanged. No extra entity fields or persistence changes.

```json
{
  "columns": [
    {
      "field": "name",
      "operator": "and",
      "rules": [
        { "matchMode": "contains", "value": "example" },
        { "matchMode": "notEquals", "value": "excluded" }
      ]
    }
  ]
}
```

- The endpoint owns an explicit whitelist mapping the public column field to a tenant-scoped, SQL-translatable expression. A translated header, entity reflection or arbitrary client member path is not a whitelist.
- Different columns combine with AND; each column combines up to five rules using `and` or `or`. Limit columns/request length and reject invalid/unsupported rules explicitly instead of silently dropping them.
- Text: `contains`, `notContains`, `startsWith`, `endsWith`, `equals`, `notEquals`; numeric: `equals`, `notEquals`, `lt`, `lte`, `gt`, `gte`; calendar dates: `dateIs`, `dateIsNot`, `dateBefore`, `dateAfter`. Null/empty string, zero and false remain distinct. Date values serialize as `yyyy-MM-dd` without UTC conversion. Enum/status columns need their own stable value/label contract rather than comparing translated text in SQL.
- Apply screen predicates AND column predicates before count, order and page. Paging/refresh/export reuse the same applied immutable query snapshot. Clearing the column menu removes only that column's constraints. Screen Reset clears both feature and column filters and returns to page one.
- Existing authentication, tenant/soft-delete boundaries and action eligibility remain authoritative. No permission API, dynamic SQL, unrestricted reflection, global filter state or automatic fetch-all fallback.
- Flat complete datasets use PrimeNG local filtering; editable FormArray rows remain unfiltered. A hierarchy requires an additional ancestor/subtotal rule before enabling column menus.

## Dependent implementation

1. Add bounded typed request parsing and whitelist expression helpers to existing shared backend read owners.
2. Add typed constraints and serialization to the shared frontend query owner; keep event handling with each owning list.
3. Inventory and map the 131 remote/default-lazy table instances to their exact endpoint, displayed column whitelist, type and export. Freeze source-supported per-endpoint handoffs before enabling their menus; calculated/status/report columns need explicit rules.
4. Integrate per-feature handlers, query persistence/reset, cancellation, counts and export against that contract, without conflicting with current user edits.
5. Reconcile all consumers; owner compiles and verifies runtime/SQL behavior under AGENTS.md's execution boundary.

## Owner approval and implementation handoff

Owner approved the proposed unified server contract in this chat on 2026-10-23 and explicitly requested continuing server integration. The shared API shape is now Frozen. Historical proposal/blocker wording above records the pre-approval state; it is not an outstanding approval request.

For ordinary typed list projections, the server-owned flat scalar properties of the compiled response DTO form the field whitelist (public property names, case-insensitive, no nested/member paths, no client entity names). Apply constraints to the existing SQL projection before count/page, or use a filtered identity subquery to retain existing entity materialization/order. This is bounded reflection over the declared response whitelist, never arbitrary entity traversal. Existing custom projections retain their owning fields and predicates. Unsupported derived fields are explicit compatibility findings until their owning SQL expression is established; no silent dropping.

Frontend handoff: `withGridFilters(existingFilters, event)` immutably preserves screen filters and stores serialized constraints in the approved `grid` key. Each existing event consumer persists that snapshot for paging/refresh/export; screen Reset clears it. Shared table metadata is translated back to original public fields and never leaks local `cells.cN` aliases. No global state/interceptor transport.

Backend handoff: shared typed parser/expression helper in `SiGma.Helpers/Filters`, with `Apply<TDto>(IQueryable<TDto>, filters)`; generic entity lists use the existing DTO projection and stable identity membership to retain current materializer. Custom list owners apply the same helper to their existing response projection/query before `CountAsync`/`Skip`/`Take`. Parse failures return a localized safe domain validation error, not an unfiltered success. Feature field maps and special report semantics must remain source-supported.

Overall implementation and source reconciliation are still outstanding. Approval does not settle a material per-report business decision automatically.

### Unified implementation handoff

The approved handoff is now implemented at source level and reconciled in
SHARED_TABLE_FILTERS_FEATURE_REVIEW.md with129 consumer records and explicit
compatibility boundaries. The statement above records the handoff state when
approval first arrived. Owner compilation/runtime/SQL/host acceptance is still
pending. Subsequent owner Angular errors were repaired at their common type or
actual consumer source; no verification suppression was introduced.

## Accident compile correction — 2026-10-23

TierS owner-reported CS0103 repair, frozen before source edit. AccidentService
GetManyAsync receives ListSmBase, then converts it to AccidentSearchVM and calls
SearchAsync. The inserted shared-filter line references searchModel inside
SearchAsync, where that identifier is not in scope. Preserve the approved
server-filter behavior instead of deleting the predicate or inventing a public
request field: route both public read methods through a private SearchCoreAsync.
Generic GetManyAsync passes its original Filters dictionary; typed SearchAsync
passes null because its existing AccidentSearchVM/Report contract has no grid
dictionary. ApplyGridFilters uses that explicit private argument before count,
ordering and paging; existing typed search/report filters, signatures, sorting,
source projection and unpaged report behavior remain unchanged. BE9, Master5
type safety and the current shared helper are the owners. No new API/schema or
permission contract. One tightly coupled fix; root works locally without agents.

Implemented — source-only; owner verification pending: yes. Both caller paths
and the single core query were reconciled. There is no searchModel use outside
GetManyAsync or ToSearchRequest. The list's original grid dictionary reaches the
shared helper before Count/Skip/Take; Report's typed request/unpaged behavior and
cancellation remain intact. Existing AccidentProfiler supplies the same list
property expressions; no map, request DTO, public interface, route, namespace,
financial calculation or schema change. General imports/SDK source inclusion
remain unchanged. UI shape remains the established fleet list with a separate
report; no screen redesign or new frontend filter serialization introduced.

Complete scoped service diff inspected, preserving preexisting shared-filter
work; whitespace check passes. Fleet guide Accident topic documents list count/
page scope and separate report criteria in both languages, using /FleetAccidents
and the existing /UserGuide/fleet reader. Initial/final eight recipe checks pass;
PHASE01/02/06 apply proportionally, no writer/action/routing phase. No agents for
this tightly sequential compile fix. Suggested backend commit:
`fix(accidents): carry list filters into the search core`; frontend guide update
can accompany the docs commit. Owner must rebuild Business, then ServerAPI and
verify filtered counts/page changes and typed Report behavior. No build/test/lint/
browser/database/migration/commit or cleanup command was run.
