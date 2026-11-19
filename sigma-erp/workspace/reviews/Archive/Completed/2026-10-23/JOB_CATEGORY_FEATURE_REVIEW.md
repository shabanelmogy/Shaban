# Job Category Feature Review

| | |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-09-28 |
| Request | "refactor : src\app\modules\Workshop\JobCategory" with three screenshots |
| Screen type | UI `ui/screens/01-list-with-modal-editor.md` (List + Modal) |
| Backend pattern | 1 Normal entity (`BranchService` canonical reference) |
| Packets | All 8 checked (0 drift confirmed via `Generate-SigmaRecipes.ps1 -Check`) |

## Evidence

| ID | File | State | Metadata |
|---|---|---|---|
| E1 | `media_1790618238846.png` | List | Locale en, LTR, desktop; title "Job Category / Manage Job Category", "+ CREATE NEW JOB CATEGORY", Actions dropdown (View, Edit, Delete), Job Category Name column, pagination 10 items per page ("1 - 4 of 4 items") |
| E2 | `tempmediaStorage/media_1790618238846.png` | List | Identical duplicate of E1 |
| E3 | `media_1790618238847.png` | Create dialog | Modal title "Create New Job Category", single input "Job Category Name", footer buttons CANCEL and SAVE |

### Functional Evidence Table

| Evidence | Classification | Required behaviour | Owning phase | Guide-compliant implementation |
|---|---|---|---|---|
| E1 title "Job Category / Manage Job Category" | Explicit | Page title and subtitle | 2 | `app-feature-title` inside panel (UI 3) |
| E1 "+ CREATE NEW JOB CATEGORY" | Explicit | Create action | 2, 3 | `app-primary-action-button` in title slot opens editor dialog (UI 3, 13) |
| E1 column "Job Category Name" | Explicit | Display column | 1, 2 | `app-data-table`; ListVM = `Id`, `Name` |
| E1 pager, 10 per page, "1 - 4 of 4 items" | Explicit | Server paging, 10 default | 1, 2 | `GetManyAsync` override, size 10 clamped 1–100, `TotalCount` returned |
| E1 row order ("Damage", "Oil Change", "Periodic Service", "Polish") | Strong inference | Alphabetical order | 1 | `OrderBy(x => x.Name).ThenBy(x => x.Id)` |
| E1 row actions (View, Edit, Delete) | Explicit | Three row actions | 2, 4 | Shared action list; Delete through `ConfirmationDialogService` (UI 7, 9) |
| E3 dialog "Create New Job Category", "Job Category Name", Cancel, Save | Explicit | Create editor modal | 3 | `app-editor-dialog` with typed form (UI 13) |

### Column Contract Table

| Visible label | Proposed field | Source DTO field | Display transformation | Filterable | Sortable | Exported | Confidence |
|---|---|---|---|---|---|---|---|
| Job Category Name | `name` | `JobCategoryListVM.Name` | none | Yes — name search filter | No | No | Confirmed |

Grid column `name` ↔ ListVM `Id, Name` (plus base audit properties).

## Decisions

| # | Decision | Evidence |
|---|---|---|
| D1 | **Canonical Pattern 1 (Normal Entity).** Implemented `GetManyAsync`, `AddAsync`, `UpdateAsync` on `JobCategoryService` following `BranchService` reference. Base `RemoveAsync` retained as no foreign key references `JobCategory` | Backend Pattern 1 (block 13); repository model search |
| D2 | **Update Map Tenant Guard.** In `JobCategoryProfiler`, removed `ReverseMap()` and added `.ForMember(d => d.SubscriptionId, o => o.Ignore()).ForMember(d => d.No, o => o.Ignore())` to prevent EF Core tenant mutation runtime exceptions on update | Backend block 4, backlog 2; Skill §8.2 item 5 |
| D3 | **Duplicate Name Guard.** Duplicate `Name` rejected on Add and Update (Update excludes self), with name trimmed | Backend block 13, Pattern 1 |
| D4 | **Name Input Length Limit.** Form control name validated with `Validators.maxLength(50)`, `Validators.required`, and `notBlank` to align with `UpdateBaseVmWithName` (MaxLength 50) | Backend `UpdateBaseVmWithName` definition |
| D5 | **Modal CRUD Architecture.** Replaced legacy `ms-lib` table and routed details/create pages with single responsive `app-editor-dialog` modal; removed `details/:id` and `create` child routes | Screenshot E3; UI block 13 mandatory CRUD modal rule |
| D6 | **View-Only Mode Behavior.** Set `[primaryActionVisible]="false"` when in view mode so no extraneous edit/save button is shown | Skill §7.2 / UI 15 |
| D7 | **Dialog Body Inset Padding.** Set `[contentPadded]="true"` on `app-editor-dialog` and avoided wrapper padding | Skill §7 (4a), backlog 36 |
| D8 | **Compact Filter Strip.** Implemented search filter strip for name search with 8px alignment margin matching the feature title | Skill §2.4, §3.1 |
| D9 | **Transitional Table Scroll & Paginator Grounding.** Applied the standard `scrollHeight="flex"` and deep CSS overrides for single scroll ownership and pinned paginator | Skill §4.1 (Transitional) |
| D10 | **Dictionary Parity.** Added complete `jobCategory` translations to both `en.ts` and `ar.ts` with 1:1 key parity | Skill §9 (UI 23) |
| D11 | **Paginator Showing Entries Format.** Added `currentPageReport="jobCategory.showingEntries"` matching `workshopVehicles` format (`Showing {first} to {last} of {totalRecords} entries` / `عرض {first} إلى {last} من {totalRecords} إدخال`) | Owner feedback 2026-09-28 |

## Files changed

### Frontend (`SiGmaAngularFrontEnd`):
- `src/app/modules/Workshop/JobCategory/models/list.ts`: Updated to typed `JobCategoryListRow` and `JobCategoryListQuery`.
- `src/app/modules/Workshop/JobCategory/models/details.ts`: Updated to typed `JobCategoryDetails` (id, name).
- `src/app/modules/Workshop/JobCategory/models/create.ts`: Updated to `JobCategoryAddInput` and `JobCategoryUpdateInput` (omitting client-irrelevant server-owned properties).
- `src/app/modules/Workshop/JobCategory/services/jobcategory.service.ts`: Implemented typed HTTP service methods (`getList`, `getDetails` via `GetByWithNavigationsId`, `add`, `update`, `deleteCategory`).
- `src/app/modules/Workshop/JobCategory/components/details/details.component.ts`: Refactored to `JobCategoryEditorComponent` with `app-editor-dialog`, typed form, two-tier loading, and dirty close confirmation.
- `src/app/modules/Workshop/JobCategory/components/details/details.component.html`: Replaced legacy card markup with `app-editor-dialog` and responsive single-column form.
- `src/app/modules/Workshop/JobCategory/components/details/details.component.scss`: Implemented editor state, alert, and dark-theme tokens.
- `src/app/modules/Workshop/JobCategory/components/details/details.component.spec.ts`: Updated spec for `JobCategoryEditorComponent`.
- `src/app/modules/Workshop/JobCategory/components/list/list.component.ts`: Refactored `JobCategoriesComponent` to use `app-data-table`, `FeatureTitleComponent`, server-side lazy paging, actions menu, and delete confirmation.
- `src/app/modules/Workshop/JobCategory/components/list/list.component.html`: Replaced legacy `ms-lib` table with container-fill hierarchy, compact filter strip, and modal editor binding.
- `src/app/modules/Workshop/JobCategory/components/list/list.component.scss`: Implemented container-fill host, 8px margins, Transitional table/paginator flex overrides, and dark-theme support.
- `src/app/modules/Workshop/JobCategory/components/list/list.component.spec.ts`: Updated spec for `JobCategoriesComponent`.
- `src/app/modules/Workshop/JobCategory/jobcategory.routes.ts`: Removed deprecated routed details and create paths; retained single list route.
- `src/app/modules/i18n/vocabs/en.ts`: Added canonical `jobCategory` translations.
- `src/app/modules/i18n/vocabs/ar.ts`: Added matching Arabic translations.

### Backend (`SigmaBackend`):
- `SiGma.Business/MapperConfig/JobCategoryProfiler.cs`: Removed `ReverseMap()` from all profiles; ignored `SubscriptionId` and `No` on `JobCategoryUpdateVM` mapping.
- `SiGma.Business/Services/JobCategoryService.cs`: Implemented Pattern 1 overrides for `GetManyAsync` (server paging, search filtering, alphabetical sorting), `AddAsync` (trim + duplicate name check), and `UpdateAsync` (trim + duplicate check excluding self).

## Migration

**No database migration required.** `JobCategory` entity inherits `EntityBaseWithName` and uses the existing `Name` property; no new columns, relationships, or tables were introduced.

## Suggested names (Master block 7)

```text
Backend migration: None required.

SigmaBackend:
refactor(job-category): implement pattern 1 service overrides and auto-mapper tenant guards

- Implement GetManyAsync with server paging, search filter, and alphabetical ordering
- Implement AddAsync and UpdateAsync with duplicate name validation
- Remove ReverseMap and ignore server-owned SubscriptionId and No on JobCategoryUpdateVM

SiGmaAngularFrontEnd:
refactor(job-category): migrate to canonical shared data table and editor modal dialog

- Replace legacy ms-lib table-list with app-data-table and server-side pagination
- Replace routed details/create with app-editor-dialog modal and dirty close confirmation
- Implement compact filter strip with name search and 8px alignment rule
- Add full Arabic and English translation parity for jobCategory
```

## Risks and owner verification

- Source-only verification performed; no builds, tests, or migrations executed per rules.
- Manual verification steps for owner:
  1. Navigate to `/JobCategory`. Verify title "Job Category", subtitle "Manage Job Category", and "+ CREATE NEW JOB CATEGORY" button.
  2. Verify table loads with columns "Actions" and "Job Category Name", correctly displaying existing rows in alphabetical order with server-side pagination.
  3. Search for an existing category name using the filter strip and verify the grid filters accurately.
  4. Click "+ CREATE NEW JOB CATEGORY", verify modal opens with "Job Category Name" input and proper inset padding. Save a new category and verify it appears in the grid.
  5. Attempt to create a duplicate name and verify backend rejection message.
  6. Click "Edit" on a category row, modify the name, and verify successful update without tenant/subscription exceptions.
  7. Click "View" on a category row and verify read-only presentation without a save button.
  8. Click "Delete", verify the confirmation modal displays the item name, confirm deletion, and verify list refreshes.
  9. Test RTL Arabic language switch and dark theme toggle. Verify no page-level scrolling occurs (grid rows scroll internally).
