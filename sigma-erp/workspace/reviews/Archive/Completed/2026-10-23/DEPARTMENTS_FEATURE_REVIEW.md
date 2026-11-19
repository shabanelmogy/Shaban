# Departments feature review

| Status | Owner verification pending |
|---|---|
| Implemented — source-only | yes |

## Scope and evidence

- Scope: `SiGmaAngularFrontEnd/src/app/modules/HRM/Administration/Departments/Department` and its HRM user-guide/translation consumers.
- User request authorizes review and implementation of the confirmed changes shown by `3.PNG` and `4.PNG`.
- Screenshot 3 explicit evidence: a Departments list titled `Department` with subtitle `Manage Departments`, Name filter, Search action, a table with Actions/Name/Description, row Edit/Delete actions, and paging.
- Screenshot 4 explicit evidence: a Create Department editor with Name and Description fields plus Cancel/Save actions.
- Inferred/unknown: field lengths, exact server paging shape, duplicate-name and referenced-row behavior are resolved from the existing backend source; no new persisted fields or accounting/access rules are introduced.

## Feature review manifest

| Item | Frozen value |
|---|---|
| Requested outcome | Review and implement the Departments screen from `src/app/modules/HRM/Administration/Departments` against the supplied list and create screenshots. |
| Frontend source | `SiGmaAngularFrontEnd/src/app/modules/HRM/Administration/Departments/Department` |
| Related backend contract | `SigmaBackend/SiGma.Business/Services/DepartmentService.cs`, `SiGma.ServerAPI/Controller/DepartmentController.cs`, Department ViewModels and mapping. |
| Existing working-tree changes | Staff Roles, Account Linking, shared toolbar, pages routing, HRM guide, and EN/AR vocabulary edits were preserved. Only the Departments-owned portions of shared files belong to this task. |
| UI shape/reference | UI screen 01; list reference `Workshop/Job/components/list`; modal owner `shared/components/editor-dialog`. |
| Backend pattern | Pattern 1 normal entity; existing service overrides are retained. |
| Routes | `/Department` list; Create/Edit/View are controlled dialog modes; the list delegates its CanDeactivate guard to the visible editor. |
| Explicit exclusions | No migration, backend/schema change, authorization API, browser/runtime verification, build, test, lint, database command, commit, or push. |

## Functional evidence tables

| Evidence | Classification | Required feature behavior | Owning phase | Guide-compliant implementation |
|---|---|---|---|---|
| `3.PNG` | Explicit | Departments list title/subtitle, Name search, Search action, Actions/Name/Description grid, Edit/Delete row actions, paging | 00 / 02 / 04 | Shared title/filter/DataTable shell; typed Search filter; ActionList Edit/Delete; server page-count footer |
| `4.PNG` | Explicit | Create Department dialog with Name, Description, Cancel and Save | 00 / 03 | Controlled `app-editor-dialog`, typed form, shared FieldError, mode-aware Cancel/Save |

## Grid column contract

| Visible label | Proposed field | Source DTO field | Display transformation | Filterable | Sortable | Exported | Confidence |
|---|---|---|---|---|---|---|---|
| Actions | `id` (identity/action target) | `DepartmentListVM.Id` | Shared ActionList menu | n/a | n/a | no | Confirmed |
| Name | `name` | `DepartmentListVM.Name` | none | Name search | no | no | Confirmed |
| Description | `description` | `DepartmentListVM.Description` | null-safe text | no | no | no | Confirmed |

## Screen and phase selection

- Screen type: UI screen 01, list with modal editor. The record has two editable scalar fields and no child collection/totals.
- Applicable phases: 00 discovery, 01 domain/API contract, 02 read/grid, 03 detail/write, 04 existing Delete action, 05 integration source review, 06 reconciliation.
- Reconciliation correction: Phase 04 reviews the existing destructive Delete slice; no new domain transition is implemented. Activation, approval, posting, reports, exports, child collections and financial calculations are not applicable to this two-field screen.
- Packet drift check: `Generate-SigmaRecipes.ps1 -Check` passed for PLAN-00 and PHASE-00 through PHASE-06 before packet use.

## Conformance decisions

| Concern | Canonical source | Approved reference/symbol | Target decision |
|---|---|---|---|
| List shell, no page scroll | UI 1 | `Workshop/Job/components/list`, `sigma-route-host` | Adopt shared `sigma-list-page`/`sigma-list-panel`; remove legacy card/table wrapper and local stylesheet. |
| Filter | UI 4 | `FilterPanelComponent`, `FilterActionsDirective` | One typed `search` control, mandatory Reset, Search in shared action slot. |
| Grid/paging | UI 5/6 | `DataTableComponent`, `DataTableColumn`, `resolveListPaging` | Columns are `name`, `description`; row identity `id`; backend total-pages mode is used because the API does not return totalCount. |
| Row actions | UI 7/9 | `ActionList`, `ConfirmationDialogService.confirmDelete` | View/Edit open the controlled editor; Delete confirms and refreshes the current applied page. |
| Editor | UI 13/15 | `EditorDialogComponent` controlled composition | One Create/Edit/View dialog with Name and Description; dirty exits share the deferred guard. |
| State and error handling | UI 22 | `StateMessageComponent`, `apiErrorMessage` | Declared failure and transport failure are both surfaced; failed reads offer Retry and failed writes preserve values. |
| Translations/theme/RTL | UI 23/24/25 | shared Sigma tokens/components | Add department keys in EN/AR; no feature color or layout CSS. |
| Backend contract | BE 2/3/5/6/8/13 | `DepartmentService`, `DepartmentController`, `Department*VM` | Reuse existing generic normal-entity API; no backend or schema change. |

## Frozen grid contract

- Filter: `search: string`; empty string is omitted from `Filters[search]`; Search resets to page 1; Reset clears the filter and reloads page 1.
- List request: `pageNo`, `pageSize`, optional `Filters[search]` through `toListParams`.
- ListVM/display columns: `id` (identity only), `name`, `description`. The `ListVM` consumer contains only these displayed/action identity properties.
- Actions: View Details, Edit and Delete. View preserves the pre-existing read-only details behavior. Delete is confirmed and refreshes the same applied search/page, stepping back one page when the deleted page becomes empty.
- Paging: `totalPages` from the server; `totalRecordsKnown=false`; page-size options `[10, 15, 20, 50, 100]` with shared minimum 10.

## Frozen detail/write contract

| UI field | Form control | Detail DTO | Add DTO | Update DTO | Server-owned | Validation |
|---|---|---|---|---|---|---|
| Name | non-nullable text, required, nonblank; max 250 on Create and max 50 on Update | name | name | name + id | audit/tenant/id | shared FieldError + backend duplicate check |
| Description | non-nullable text, optional, max 250 | description | description | description + id | audit/tenant | max length |

- Modal modes implemented in one component: Create opens empty/editable; Edit loads details then enables fields; View loads disabled fields and exposes the shared Edit action. Reconciliation correction: source evidence, not screenshot absence, owns preservation of the existing View workflow.
- Save sends only `name` and `description` for create, and those plus `id` for update. `SubscriptionId`, audit fields and base flags are not client inputs.
- Duplicate names and delete-reference protection remain backend-owned (`DepartmentService`); the UI displays API messages.
- Dirty exit: Cancel, Close, Escape and route navigation ask through the shared discard confirmation when the form is dirty. The decision is deferred, rechecks record/mode identity, freezes controls, and restores values/dirty/control state when cancelled. Save and detail reads block exit; accepted Save bypasses discard.

## Route/integration contract

- The feature remains lazy-loaded at `/Department`; the feature route exposes only `''` because Create/Edit/View are dialog states, not URLs. No remaining HRM/pages/Metronic source references to the old Department create/details routes or removed component/model symbols were found. Saved external bookmarks to those old routes must now use the list.
- `DepartmentService` is root-provided and uses the existing `Department` endpoint with the standard error-interceptor skip header for local error presentation.
- `ToolbarComponent.showPageTitle()` excludes `/Department`, so the feature title is rendered once inside the shared list panel rather than duplicated in the Metronic toolbar.
- No new provider, interceptor, permission API, migration, or backend route is introduced.

## Authorization candidates

- Delete (`DELETE /Department?id={id}`) is the only destructive action. `SiGmaControllerBase` has `[Authorize]`; repository reads/exists checks supply tenant and live-row scope. The application has authentication only; no client permission API is invented and disabled controls are not security.

## Backend override audit

- `DepartmentService.GetManyAsync`, `AddAsync`, `UpdateAsync`, and `RemoveAsync` override the generic normal-entity service for the existing Department search, duplicate-name checks, and Staff-reference delete guard. No new override is introduced by this frontend implementation.

## Open/owner verification

- Source-only implementation is complete after the scoped diff review; Angular compilation, runtime API replay, visual RTL/theme, and browser interaction remain owner verification steps.

## Final source conformance (2026-10-11)

| Concern | Actual target consumer / compared shared owner | Evidence and outcome |
|---|---|---|
| Fill chain | `DepartmentsComponent.host` → list HTML → `src/styles.scss` | `sigma-route-host` → `sigma-list-page` → `sigma-list-panel` → `sigma-list-table`; shared host/page height100%, min-height0, overflow hidden; table fill=true. Shared page gap20px/12px, panel6px12px and title/filter/table insets are consumed without copied CSS. |
| Filter/actions | list `filterForm`, `search`, `resetFilters`, `FilterPanelComponent` | Non-nullable search; mainColumns1, inlineActions=true, stableLayout=true; built-in Reset handled. Search captures trimmed applied state; lazy paging/Save/Delete do not use an unapplied draft value. |
| Paging contract | `DepartmentService.getList`, backend `GetManyAsync`, `DataTableComponent.usesPageCount` | Requests pageNo/pageSize/Filters[search], defaults frontend15, options10/15/20/50/100. Backend returns pages, not count; lazy=true + totalRecordsKnown=false + actual totalPages selects the existing page-count footer. No fabricated total or local all-pages list. |
| Columns / ListVM | `DepartmentsComponent.columns`, `DepartmentListRow` | Grid: Name, Description, shared Actions. Consumer: id:number, name:string, description:string|null. Removed bogus No column. Server DTO still inherits unused base plumbing: recorded as an existing backend follow-up, not claimed lean. |
| Editor geometry | editor HTML, `EditorDialogComponent`, `.sigma-editor-scroll` | Public width440px, shared default maxHeight/breakpoints, contentPadded=true; one column; root shared scroll region + flex-fill preserves intrinsic auto height and shrink/scroll without zero-basis collapse. No local CSS, extra body padding, page height calculation or dialog-content override. |
| Modes / validation | `DepartmentEditorComponent`, inherited Department write VMs | Create empty/editable; View disabled; Edit enables saved fields. Name required/nonblank with mode-aware250/50 limits, Description optional250; FieldError + associated IDs + focusField. Persisted names over50 remain readable; update requires satisfying the existing server limit. |
| Failure / request lifetime | list switchMap and editor/delete takeUntilDestroyed, shared api-error | Both declared and HTTP failures inline; failed reads Retry; failed Save values retained. finalize balances loading; no feature success toast, so the global mutation interceptor owns success once. |
| Dirty decision | editor `canDeactivate`, feature route guard, `freezeFormState` | Deferred captured id/mode gate, duplicate decision prevention, controls frozen without emissions, same-visible-editor restoration; X/Cancel/Escape/route use the same method. Accepted close does not block itself on its pending flag. |
| Wiring / translations | feature imports, `Department_Routes`, pages lazy route, toolbar, vocab blocks | Standalone controls/directive/pipe registered; exact public input/output names compared with shared owners. Existing pages lazy entry remains. Toolbar Department exclusion prevents duplicate title. Department parity check:20 EN/20 AR, zero missing/case-only keys. |
| User guide | `src/app/modules/UserGuide/content/hrm-guide.ts` Departments topic | Existing `/UserGuide/hrm` reader/menu (`sidebar-menu-data.ts`) reused; list/search/reset/paging, create, View/Edit, limits, failed reads/writes, dirty exits and referenced deletion covered in EN/AR. Compilation and rendered guide acceptance remain pending. |

## Existing Delete action contract

| Action | State / endpoint / producer | Interaction, guards, refresh and recovery |
|---|---|---|
| Delete | Existing live Department → existing soft-delete path; `IDepartmentService`/`DepartmentService.RemoveAsync` → inherited `DELETE /Department?id={id}` → `DepartmentService.deleteDepartment`; Result.isSuccess/message | Visible on rows; disabled during list read, confirmation, mutation or editor. Shared confirmation identifies Name. `confirmingDelete` prevents duplicate decisions, `deleting` prevents duplicate requests, route exit blocked while pending. Staff references reject deletion. Success refreshes applied search/current page, steps back when last row removed and clamps a stale page from server pages; declared/HTTP failure retains rows and shows inline error. No new idempotency/concurrency guarantee is asserted. |

Approved shared action/confirmation references are reused. Quotation approval and Close Job workflows are Not Applicable: Department has no approval/job state, reason/date input, children, posting or financial transition. Generic backend activation APIs are not adopted: no active-status display/edit workflow existed in this screen; no server field is removed or altered.

## Backend, mapping and schema boundary

- No backend source was edited. `DepartmentProfiler` already has four explicit one-way maps; no ReverseMap, new Ignore chain or mapping alteration was needed. No derived domain values, client calculations or accounting effects exist here.
- Existing backend differences from the canonical normal-entity implementation remain explicitly outside this frontend change: handwritten GetManyAsync rather than list hooks, no TotalCount/NormalizePaging in that override, heavy inherited read fields and unused LocalizedDescription write member, literal English business failures, no Department-specific Name length/tenant-name unique index in DepartmentConfig. Name250 Add versus50 Update is already BE backlog4; inherited list plumbing is backlog6. The frontend consumes the actual API and does not claim these server issues were corrected.
- No entity/EF/schema change: no `Add-Migration` is required for this frontend delivery. Harmonizing server lengths/indexes is a separate backend/schema decision; no migration was created or run.

## Verification and handoff

- Complete scoped frontend diff reviewed: list/editor TS and HTML; three models; typed service; feature route; two existing smoke-spec symbol corrections; Department additions in toolbar/EN/AR/HRM guide. The pre-existing Staff Roles and concurrent Account Linking hunks are preserved, not attributed to this task. Scoped backend diff for Department contract files is empty.
- Source checks: no scoped stale legacy types/imports, any payloads or merge markers; route/import/public owner contracts inspected; `git diff --check` passes (Git reports only normal LF/CRLF conversion notices). Check-Translations -Block department passes. Initial recipe drift check passed all packets; no book/template changes or regeneration were needed.
- Agent utilization: a bounded read-only backend audit was dispatched to luna_explorer / gpt-5.6-luna after freeze to reduce independent contract lookup time. No agent result was available at this continuation handoff; root independently reviewed all used backend evidence. No delegated source edits were integrated.
- Build, tests, lint, browser/app execution, database commands, migrations, commits, pushes, deployment, Graphify and Sigma MCP were not run. The translation script is the canonical read-only source parity check, not runtime verification.
- Suggested frontend commit: `refactor(hrm): align departments list and editor with shared patterns`. No backend commit suggested because this task edits no backend file.
- Owner checks: compile the application; open `/Department` in EN/AR and light/dark/mobile/short-height layouts; verify search/reset/real server paging; Create250/Edit50/Description250 and blank/duplicate rejection; View→Edit; both read failure Retry channels; failed Save retains values; Cancel/X/Escape/route confirmation accepts/cancels once and restores dirty values; staff-referenced Delete fails, permitted Delete refreshes the applied page; HRM guide topic renders. Existing generated smoke specs still need their normal provider/mocking setup if the owner chooses to run them; no passing test claim is made.
- No Missing/Conflicting business decision remains for the implemented frontend slice. Runtime/visual correctness and the listed existing backend issues remain explicit owner/follow-up work.
