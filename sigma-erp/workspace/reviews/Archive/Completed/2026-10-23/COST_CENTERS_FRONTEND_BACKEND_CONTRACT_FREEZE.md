# Cost Centers — frontend/backend contract freeze

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

## Scope and evidence

User authorized review and implementation of `Administration/CostCenters` according to the canonical books. Direct CostCenter API corrections are included to return the fields the screen consumes; no accounting, other master screens, database or schema changes are authorized by this freeze. Existing unrelated changes in both repositories, shared vocabulary, layout and Administration guide are preserved.

UI type 01 (list with modal editor), backend pattern 1 normal entity. References: Workshop/Job/components/list for shell/filter/grid/export, shared EditorDialog declarations and UI13 controlled composition for the editor; BranchService for generic service hooks. Phase packets 00–06 passed generator `-Check` on 2026-10-14. PLAN-00 is unnecessary: bounded migration to an established shape with existing domain/API; no ambiguous aggregate replacement.

Screenshot E1: `C:/Users/user/Desktop/666666666.PNG`, historical appearance, English/LTR. Explicit: Cost Centers list, row Actions, name, code, active badges, Create Cost Center dialog, name/code/group controls, Save/Cancel. Group column also confirmed by current list source. Menu contents, requiredness, length, uniqueness and transition constraints are not proven by the screenshot; use current source. No screenshot-derived design rules.

## Frozen contracts

| Grid order | Frontend | Backend ListVM | Type |
|---|---|---|---|
| Actions | id/action isActive | Id/IsActive | shared action column first |
| Cost center name | name | Name | nullable text, View link |
| Code | code | Code | nullable text |
| Group | costCenterGroupName | CostCenterGroupName | nullable navigation label |
| Active | isActive | IsActive | nullable boolean translated status |

ListVM is lean: Id, Name, Code, CostCenterGroupName, IsActive only. Generic list/count/paging/order remain inherited; navigation labels require ProjectTo materialization. Group sort uses `costCenterGroup` navigation key; other sortable keys name stored columns.

Filters: `name`, `code` (Contains), `costCenterGroupId` (positive integer equality), `isActive` (nullable boolean equality); serialize `Filters[key]` through toListParams. Empty/null omitted, false retained. UI page size 15 with 10/15/20/50/100 choices; backend normalization/count/Id tiebreaker retained. Explicit Search applies a snapshot; paging/export/mutation refresh use that snapshot, URL preserves it.

| Editor control | Detail | Add | Update | Validation |
|---|---|---|---|---|
| Name | Name string? | Name string | Name string | required, max250 from existing Add and entity Name contract; fix legacy Update max50 to match250 |
| Code | Code string? | Code string? | Code string? | optional; no invented cap |
| Group | CostCenterGroupId int?, CostCenterGroupName string? | CostCenterGroupId int? | CostCenterGroupId int? | optional, supplied id positive/live/tenant via existing base FK checks |
| Identity | Id int | omitted | Id int | server identity/update target |

Detail response shall be lean Id/Name/Code/CostCenterGroupId/CostCenterGroupName, subject to symbol/embedded-consumer compatibility audit before narrowing. If an existing consumer needs old members, stop that narrowing and report exact evidence; do not invent or remove consumer business. Add/Update contain no tenant, audit, active/delete flags or derived values. No duplicate business key is established in current CostCenter service/config; do not invent uniqueness or an index. Existing Name max250 needs no entity/EF change. No migration.

Endpoint envelopes retained: GET CostCenter → Results<List>; GET CostCenter/GetByWithNavigationsId/{id} → Result<Detail>; POST CostCenter → Result; PUT CostCenter with id → Result; DELETE CostCenter/{id}; POST CostCenter/handleActivate `{ids:[id],isActive:boolean}`. GetSelect and GetSelectByGroup retain their existing contracts and consumers.

Actions: View/Edit/Delete Supported; Activate/Deactivate Supported by inherited controller/service. Job-specific labour time, invoice, close/cancel job, quality check, logs, estimation and gate-pass printing Not Applicable: CostCenter has no corresponding aggregate/state/endpoints. Export Supported through shared all-pages/column formatting. Delete uses generic metadata-driven reference checks via RemoveWithChildrenAsync, no owned children. Nullable active state displays Unknown; activate allowed unless true, deactivate only true. Mutations revalidate through inherited server boundary, confirm risky actions, block repeats, preserve row/draft on failure, refresh same page; last-row deletion steps back.

Only list route remains; parent controls remounted create/view/edit dialogs. CanDeactivate delegates dirty/busy editor handling. AuthGuard only, no permission API. Delete and activation endpoints are authorization candidates, never described as secured by visibility. Root interceptor-enabled HttpClient remains the sole client; no local providers. Inline reads suppress error interceptor; writes use global feedback. finalize balances every primary loader; auxiliary lookups local. Edit must hydrate successfully before Save. Lookup failure blocks editable Save and supports Retry; View uses saved group label. Saved group absent from live choices is retained as a saved option, with server FK validation authoritative.

## Before-edit conformance evidence

### Source clarification amendment — 2026-10-14

Read-back of UI16 and Repository.GetDropdownAsync proves ordinary group choices include every live tenant group (including inactive) but exclude soft-deleted groups. Therefore an absent saved group is shown as historical read text, never appended into current choices; editable Save waits for a current group selection or explicit clearing of the optional relationship. This replaces the saved-option fallback decision above. Name max250 is proven by AddBaseVmWithName, not an entity annotation: EntityBaseWithName.Name has no declared maximum, and this task changes no EF/string storage limits. Delete's actual inherited route is `DELETE CostCenter?id={id}`, not a path segment. Group UI column sort key is costCenterGroupName; the typed request maps it to the existing `costCenterGroup` navigation sort. URL writes encode isActive false as the string 'false' because the shared route writer drops boolean false; API filter serialization continues to preserve the boolean value.

The final symbol audit finds no consumer of CostCenterFullListVM (exact-symbol search, excluding migrations); remove its unused file under BE3/19 instead of maintaining a second unconsumed read contract. DeleteVM stays Id-only. Direct toolbar integration adds only CostCenter to the existing title-suppression list, preserving its pre-existing owner changes and all other routes.

Final producer audit correction: CostCenterGroup inherits EntityBaseWithDescription and has **no Name property**. Read projections consume Description. ApplyListOrder must override only the group key because the base's navigation-name sort cannot order a described entity; other keys remain inherited. The existing CostCenterGroup/GetSelect also uses the base Name/No fallback, so a directly related SelectAsync override uses the repository's existing nameSelector to return Description, preserving IDs, No, tenant/live scope and the Results/metadata envelope. This scope amendment fixes the actual lookup producer; it adds no endpoint or persistence/business rule. Root identified and corrected the delegated Name mapping before handoff.

**Superseding correction after complete base-chain inspection:** the preceding producer-audit paragraph was an incorrect inference from the immediate base name and is withdrawn. EntityBaseWithDescription **inherits EntityBaseWithName**, and Add/UpdateBaseVmWithDescription also inherit the required Name contract. CostCenterGroup therefore has a real Name property used by the existing select API; Description is separate optional content. Keep the original Name projections and inherited navigation-name sort/select. The temporary Description projection, sort and select overrides were removed before handoff. CostCenterGroupService has no behavioral change. No learning rule is promoted from the withdrawn inference.

| Concern | Owner | Actual reference symbol | Target plan |
|---|---|---|---|
| Fill/no page scroll/title | UI1/3; global styles/FeatureTitle | JobsComponent.host, sigma-list-page/panel/header/table | CostCentersComponent adopts same host and hierarchy; no local CSS |
| Filters/actions | UI4/7; FilterPanel/PrimaryActionButton | Job list form[appFilterPanel], FilterActionsDirective | stableLayout, four domain fields, mandatory Reset, shared buttons |
| Grid/paging/export | UI5/6/8; DataTable/list-query | JobsComponent columns, resolveListPaging, dataTableExportRows | typed columns/actions, fill=true, count metadata, all-pages export |
| Dialog/form | UI10/13/15/19/27/28; EditorDialog/FormSection/FieldError/freezeFormState/focusField | EditorDialogComponent inputs/events, UI13 controlled composition | explicit mode, padded bounded body, one section/two columns, no tabs, dirty confirmation and stale teardown |
| Read names/delete | BE3/4/7/8/13 | BranchService.RemoveAsync, Service.MaterializeListAsync hooks | lean projection and four one-way maps; generic FK/delete checks |
| Translation/guide | UI23, Master7 | existing administration-guide/UserGuide reader | extend existing EN/AR topic, module route/menu retained |

Override reasons: MaterializeListAsync only for navigation-name projection; RemoveAsync only for dependency-aware deletion helper. Detail read override only if base navigation loading cannot supply the label; inspect before implementation. Add/Update/controller/paging/action overrides unnecessary. Transactions remain inherited one entity save; no new transaction or calculations. Shared extraction reuses existing owners; business configuration stays local.
