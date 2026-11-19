| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Staff Roles feature review

## Scope and evidence

The request covered the existing `HRM/Administration/Staff Roles/StaffRole` screen and its directly connected API. The supplied screenshots are functional/content evidence: the list needs Name search, Create, Name/Description columns, row actions and paging; the editor needs Name, Description, Cancel and Save. Legacy colors, spacing and table implementation were not copied when they conflicted with Sigma’s canonical shared components.

The selected shape is UI Screen 01 (paged list with modal editor) and backend Pattern 1 (normal entity). The role has fields only, no child collections, totals, posting or approval workflow. The recipe drift check passed for plan-00 and phase-00 through phase-06 before implementation.

## Decisions and implementation

| Contract | Final source evidence | Status |
|---|---|---|
| List and filters | `app-data-table` with Name and Description; shared `appFilterPanel`; Name maps to `Filters[search]`; Reset returns to page one. | Implemented |
| Actions | Create, View, Edit and Delete. Delete uses shared confirmation; editor preserves dirty data and confirms discard. | Implemented |
| Editor | One `app-editor-dialog` with create/view/edit modes, typed Name/Description controls, field errors, Retry and transport/declared failure handling. | Implemented |
| API ownership | Add/Update payloads contain only Name and Description; tenant, audit and soft-delete fields remain server-owned. | Implemented |
| Backend list | Generic tenant/soft-delete paging plus `SearchColumns => Name`; no custom `GetManyAsync` rewrite. | Implemented |
| Duplicate and delete | Trimmed name, localized duplicate key, unique live tenant index; `InUseAsync` before soft-delete. | Implemented |
| Mapping | One-way Add/Update-to-entity and Entity-to-Detail/List maps; no unnecessary `ReverseMap`. | Implemented |
| Guide | HRM guide now contains a bilingual Staff Roles topic linked to `/StaffRole`; sidebar already exposed the HRM guide entry. | Implemented |

Grid contract is explicit: frontend columns `name`, `description`; backend `StaffRoleListVM` supplies inherited `Id`, `Name`, `Description`. The legacy frontend `no`, audit fields and `EntityBaseDTO` payload were removed from the feature contract.

## Changed files

Frontend: the Staff Role list/editor, typed models, service, routes, scoped specs, English and Arabic translations, and `UserGuide/content/hrm-guide.ts`.

Backend: `StaffRoleAddVM`, `StaffRoleUpdateVM`, `StaffRoleService`, `StaffRoleConfig`, `StaffRoleProfiler`, and English/Arabic `GeneralMessage` resources.

Review artifact: `F:/My Work/Sigma/reviews/Archive/Completed/2026-10-23/STAFF_ROLE_SCREEN_API_CONTRACT_FREEZE.md` records the frozen contract and migration boundary.

## Migration, verification and handoff

The EF configuration adds Name (50), Description (250) and the filtered unique index `(SubscriptionId, Name)` where `IsDeleted = 0`. The owner must review existing duplicates/overlength data and generate/run a migration named, for example, `AddStaffRoleValidationAndUniqueName`. No migration or database command was run.

Export is not part of this change because neither screenshot proves it and the existing screen has no export action. A follow-up syntax correction kept the Staff Roles guide topic inside the `topics` array and restored the `questions` property; Babel TypeScript parsing now succeeds. Source-only checks performed: recipe `-Check`, scoped `git diff --check`, stale legacy import/type search, route/menu/guide tracing, translation key comparison, mapping and server-owned payload review, and merge-marker scan. Builds, tests, lint, browser/runtime, visual/RTL/theme and database acceptance remain pending for the owner as required by project instructions.

Manual owner check: open `/StaffRole` in EN and AR; load, search, Reset, page, create, view, edit, dirty-close, duplicate-name failure and delete/reference-block failure. Confirm modal keyboard focus, RTL/dark theme and that a failed save retains input. Confirm the migration applies cleanly after data preflight.

Suggested commits:

- Frontend: `refactor(hrm): modernize staff roles list and modal editor`
- Backend: `refactor(hrm): align staff role contracts and validation`

No unrelated source or reference module was intentionally changed. No subagents were used because the screen, API contract, guide and translations are tightly coupled and the delegation gate would add merge risk. Prohibited builds, tests, lint, browser automation, database commands, migrations, commits, pushes and deployment were not run.


