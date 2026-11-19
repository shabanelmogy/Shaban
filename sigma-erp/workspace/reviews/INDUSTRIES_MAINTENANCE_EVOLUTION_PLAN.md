# Industries maintenance and evolution plan

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |
| Authority | Sigma AGENTS.md; Master 1, 4–8; UI screen 01; BE 2, 3, 8, 13 |

User authorizes review and implementation of Administration/Industries according to the documentation. This bounded plan covers the persistence effects of adopting the documented normal-entity business key; it creates no new business capability.

## Existing state, ambiguity and impact

| Concern | Existing owner and evidence | Classification / target | Impact |
|---|---|---|---|
| Entity | Helpers/Models/Industry.cs inherits EntityBaseWithName; no feature fields or children | Keep | Tenant/audit/soft deletion remain server owned |
| Name validation | AddBaseVmWithName requires max250; UpdateBaseVmWithName max50; IndustryConfig has no length | Conflicting, resolved to existing Add limit250 | Explicit Update VM and EF length250; no entity property removal |
| Name key | BE8/13 canonical named-master key; BranchService UniqueColumns | Extend with tenant/live-row uniqueness | Duplicate Add and Update excluding self; filtered unique index |
| Read | Industry list displays name only; API inherits oversized read bases | Refactor to Id+nullable Name | Only Industries component/model consumes these DTOs; GetSelect unchanged |
| Write | Old frontend sends tenant/audit/editor-unrelated fields | Refactor | POST name; PUT id,name; same endpoints/envelope |
| UI | table-list/ms-lib, routed single-field editor | Replace with screen01 | One /Industry list route, controlled Create/View/Edit dialog |
| Delete | Generic RemoveAsync has no usage check (BE backlog31) | Extend scoped override using RemoveWithChildrenAsync | No IndustryId/Industry navigation found in Helpers/Models; EF metadata helper protects real usages; no global base change |
| Guide | Administration guide exists, no Industries topic | Extend bilingual topic | Existing reader /UserGuide/Administration and module guide menu |

No accounting, approval, numbering, access restriction, integration, data destruction or new relationship is introduced. IndustryFullListVM has no consumer; remove it. IndustryDeleteVM remains the existing id-only contract. No screenshots were supplied. Current row values are unknown; do not rewrite them.

## Alternatives and frozen decision

Keeping max50 on Update prevents editing a name valid on Create. Expanding both to an invented length has no evidence. Select250 from the existing Add contract; retain nullable persisted names and nullable read Name for historical compatibility, while writes remain required. A service-only duplicate check races; select the canonical UniqueColumns hook plus filtered database index. A global validation/base-delete rewrite would affect other screens; use the existing owners locally. Current database collation continues to determine name equality.

## Migration and compatibility

Owner runs `Add-Migration ConfigureIndustryNameConstraints` after inspecting live duplicate names by tenant, values longer than250, and null/legacy soft-delete flags. Preserve historical data; no automatic cleanup/backfill. Name becomes bounded250 and `(SubscriptionId,Name)` unique where `[IsDeleted] = 0`. Existing nullability stays unchanged. Invalid legacy data must be resolved by the owner before applying constraints. Do not create/edit/run migrations or snapshots in this task.

Old create/details URLs have no direct source consumers outside the old feature; replace them with list-driven modes per UI1/13. An external bookmark to those retired child routes is a compatibility risk; use /Industry. Read responses intentionally drop unused plumbing/audit fields. GetSelect and generic backend endpoint names stay unchanged.

## Implementation and verification

Freeze API/UI contract first; backend and frontend are independent afterwards. Apply phases0–6, with Phase4 owning delete only. Root owns integration and reconciliation. Use existing shared shells, forms/state/focus helpers, query serializer, route-state helpers, confirmations and export collection. No new shared mechanism is required.

Source verification: exact grid/ListVM and form/write pairs, references to removed DTO, route/provider chain, both failure channels, cancellation, user-guide parity, complete separate repository diffs and whitespace. Owner verification: compile frontend/backend, apply reviewed migration, name250 Create/Edit, duplicate/tenant/case behavior, deletion/recreation, paging/sorting/all-pages export, retry and failed Save retention, pending discard/navigation, EN/AR, RTL/themes, short-height and breakpoint fit. No runtime/data acceptance is implied by Frozen.

## Open decisions

No required source contract remains unresolved. Actual existing-row validity and runtime acceptance are owner verification, not invented defaults. The canonical book's historical manual duplicate/delete snippets are superseded by BE8 and current approved BranchService hooks; use those current owners.
