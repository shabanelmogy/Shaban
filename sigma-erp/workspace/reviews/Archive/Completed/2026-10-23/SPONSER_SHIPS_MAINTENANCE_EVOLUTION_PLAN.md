| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

# Sponsorships bounded maintenance plan

Outcome: conform existing Sponsorship CRUD to the canonical books, preserve staff lookup and dependency protection, and avoid parallel implementations. User authorized review plus implementation. No financial, permission, numbering, migration execution or data-cleanup work is in scope.

Process correction: initial contract classified this as tier M and omitted PLAN-00. Final governance review identified Master1's schema/compatibility trigger: Name EF length/index and lean response changes require this plan. This document records that late gate correction honestly; it does not claim planning preceded the initial source edits. Phase1 decisions had been frozen before edits/delegation. Existing source is now reconciled against this bounded plan before handoff. No new scope or business policy is introduced by this plan.

## Existing state and ambiguity register

| Concern | Original owner/behavior | Consumers/evidence | Status |
|---|---|---|---|
| Record | SponserShip : EntityBaseWithName; Name only | Staff FK, generic API | Confirmed |
| UI | ms-lib list; routed one-field create/detail | SponserShips list/details | Confirmed; canonical UI13 selects modal |
| Name validation | Add required/250; Update required/50 | named write VM bases; BE backlog4 | Conflicting original limits; corrected to existing Add250 |
| Name identity | sole editable/business label | BE2/8/13 normal-entity duplicate policy | Confirmed governing rule; use live tenant/name uniqueness |
| Delete | explicit Staff dependency, literal English error | SponserShipService; Staff.SponserShipId | Confirmed; retain through canonical EF usage discovery |
| Readers | oversized inherited List/Detail | generic controller/profile; Staff uses separate GetSelect | Confirmed; screen read shapes may be lean |
| Legacy data | actual lengths/duplicates not inspected | database commands prohibited | Uncertain rollout data; owner preflight before migration, no automatic merging/truncation |
| Finance/state | no lines, totals or posting | scalar entity and editor | Not Applicable |

## Impact map and gap decisions

| Area | Classification | Owner/target | Impact and reason |
|---|---|---|---|
| Entity/base/relationships | Keep | existing SponserShip/Staff | no property/FK/accounting change |
| EF config | Extend | SponserShipConfig | max250 and filtered tenant/name unique index support confirmed write validation |
| UpdateVM | Refactor | feature-local UpdateBaseVm + Name | removes inherited50 mismatch; no shared base change |
| AddVM/maps/controller/interface | Keep | existing generic owners | current client-only fields/four one-way maps/endpoints sufficient |
| List/DetailVM | Refactor | exact screen shapes | reduce response fields; Staff GetSelect unaffected |
| Service | Refactor | UniqueColumns/RemoveWithChildrenAsync | shared guarded duplicate writes and localized dependency-aware soft delete |
| List/editor | Replace in place | existing components + shared owners | one grid/one controlled Create/View/Edit dialog; no competing routes |
| Obsolete routes/styles/provider | Remove | SponserShip route/empty SCSS/provider | no external create/details caller found; root service identity retained |
| User help/translations | Extend | Administration guide/sponserShip blocks | bilingual workflow matches final source |
| Reports/integrations | Keep | Staff lookup consumer | no named report or integration consumes removed DTO fields in symbol scan |

## Options and decisions

| Option | Correctness/ownership | Compatibility/migration | Decision |
|---|---|---|---|
| Keep legacy routed form and heavy DTOs | contradicts UI13/BE3/7; missing confirmation/errors | low initial effort but debt retained | Reject under requested documentation conformance |
| Adopt shared UI only, leave backend mismatches | Add250 cannot reliably edit above50; duplicates/dependencies inconsistent | avoids schema work but leaves known findings | Reject |
| Adopt current shared CRUD owners and bounded feature EF/DTO fixes | one existing owner, no unrelated architecture | lean API responses + owner migration/preflight | Selected under user's implementation request and governing normal-entity rules |
| Change all named VM bases/generic service | expands unrelated screens/contracts | broad rollout risk | Excluded |

Exact target/API/UI/action contracts are in `SPONSER_SHIPS_SCREEN_CONTRACT_FREEZE.md`. No business decision requiring additional owner input remains for source implementation. Actual legacy data correction, if needed, remains owner-controlled; it is not authorized by this task.

## Migration, compatibility and rollout

Owner command: `Add-Migration AddSponserShipUniqueNameAndNameLength250` (no matching migration basename found). Owner inspects generated migration and preflights live duplicate names per SubscriptionId and names above250 before applying. Do not merge/delete/truncate automatically. Required DataAnnotations reject blank names; entity nullability is retained. Index filters `[IsDeleted] = 0`, matching live duplicate checks. Existing server-owned/audit/number fields remain persisted, although unused read plumbing is no longer returned. No backfill/new default is introduced.

Deploy compatible frontend/backend together after owner build verification and schema preparation. Existing Staff picker continues GetSelect; external clients relying on unused List/Detail response fields or old create/details URLs need release communication. No source caller of those editor routes was found. Rollback requires reverting the scoped code and owner-reviewed schema rollback; do not apply data-destructive rollback blindly. Runtime schema/data compatibility remains owner-pending.

## Slices and verification

| Slice | Dependency | Phases | Evidence |
|---|---|---|---|
| Discovery/freeze | source/books/drift check | 0/1 | manifest and frozen screen contract |
| Backend DTO/service/config | frozen read/write/delete | 1 | exact VM/EF/service diff, resource XML and consumers |
| List + editor | frozen API | 2/3 | typed queries/forms, shared owners, stale/busy/failure paths |
| Delete/integration | backend plus owning UI | 4/5 | named confirmation, Staff blocker, root HttpClient, route/refresh/dirty guard |
| Guide/reconcile | integrated source | 6 | feature review with file inventory and manual matrix |

Source checks: complete scoped diffs in both repositories, import/export/input declarations, translation parity, route and model symbol scans, whitespace/merge markers, exact DTO/grid/write match. Owner-only checks: frontend/backend compilation, CRUD and duplicate/concurrent writes, staff-used deletion, migration preflight/schema application, all-page export, delayed/failing requests, dirty exits, guide navigation and RTL/theme/responsive visual acceptance. No automated tests, build, lint, database, browser or migration execution by agents.

Open decisions: no blocking implementation contract; legacy data and runtime acceptance are pending verification rather than invented source facts.
