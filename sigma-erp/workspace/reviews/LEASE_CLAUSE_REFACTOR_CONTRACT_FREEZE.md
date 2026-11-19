# Lease Clause — Feature Review and Contract Freeze

Date: 2026-08-25  
Status: Frozen — canonical pattern corrected after owner review  
Scope: Lease Clause Type list, Clause Type create/edit dialog, Clause set
dialog, default-clause persistence, CRUD actions, translations, and direct
API consumers.

## Authority and packet status

- Canonical authority: `SIGMA_FEATURE_REVIEW_MASTER.md`; UI list/action,
  editor/dialog, typed forms, validation, loading/error, confirmation,
  translation, appearance, accessibility, RTL/theme, cancellation, and
  verification blocks; backend entity/EF, DTO, validation, action, mapping,
  transaction, and edge-case blocks.
- Selected UI shape: canonical shared `app-feature-title`, `app-data-table`,
  `app-primary-action-button`, `app-action-button`, `app-editor-dialog`, and
  `app-editable-collection-table` components. The Clause Type list remains a
  single page; create/edit and child Clause management are modal workflows.
- The child Clause dialog follows the canonical editable child-collection
  pattern used by Fleet/VehicleService and Company child sections. A custom
  hand-built child table and a custom child batch endpoint are not part of the
  frozen design.
- Generated packets 00–06 are stale according to
  `Generate-SigmaRecipes.ps1 -Check`; canonical sources own this review and
  generated packets must be regenerated and semantically reviewed by the
  owner.
- Screenshots `1.PNG`, `2.PNG`, and `3.PNG` are functional/content evidence;
  approved Sigma shared components own layout, appearance, accessibility,
  responsive behavior, RTL, and theme details.

## Functional evidence and decisions

| Evidence | Decision | Status |
|---|---|---|
| `1.PNG` title and Name grid | The page lists `ClauseType` records, not individual `Clause` rows. Grid columns remain `Name`; row actions are Edit and Clauses. | Frozen |
| `1.PNG` Create New Clause Type | Create a Clause Type in a shared editor dialog with required bounded Name and Save/Cancel lifecycle. | Frozen |
| `2.PNG` Clauses dialog | Load all child `Clause` rows for the selected Clause Type. Add/remove rows, edit detail text, select exactly one default, and save as one server operation. | Frozen |
| `3.PNG` create dialog | The screenshot is the create mode of the Clause Type editor; edit reuses the same dialog with the existing name loaded. | Frozen |
| Default radio | Persist `Clause.IsDefault`. A non-empty Clause Type must have exactly one default. A newly created first row is default; deleting the default promotes the first remaining row. | Frozen by owner approval |
| Delete behavior | Clause Type deletion uses the existing confirmation service. Clause rows omitted from the saved set are soft-deleted by the backend to preserve agreement history. | Frozen |

## API and persistence contract

### ClauseType aggregate CRUD

- `GET ClauseType` — paged list with optional existing generic filters.
- `GET ClauseType/GetByWithNavigationsId/{id}` — Clause Type with reusable
  template Clause rows.
- `POST ClauseType` — `{ name, clauses?: [{ clauseDetail, isDefault }] }`.
- `PUT ClauseType` — `{ id, name, clauses?: [{ id, clauseDetail, isDefault }] }`.
- `DELETE ClauseType?id={id}` — removes the Clause Type and its reusable
  template children through the aggregate service.
- A missing `clauses` property on update preserves the current child set; an
  empty array explicitly clears it.

### Child reconciliation and persistence

- `ClauseTypeService` is the aggregate boundary. It loads the tracked parent
  and only reusable template children (`LeaseAgreementId == null`), validates
  ownership and the exactly-one-default invariant, reconciles additions,
  updates, and removals, and saves the graph once through the existing unit of
  work.
- The generic `Clause` CRUD remains available for existing consumers but is not
  used by LeaseClause UI child management. The invented
  `Clause/ByClauseType/{id}` batch API is removed.
- Removed reusable template clauses are deleted through the existing entity
  deletion behavior; agreement clause snapshots remain outside the template
  collection and are not touched.

### DTO/entity change

- Add `IsDefault` to `Clause`, Clause add/update/detail/list VMs, Angular
  models, and the Clause mapping.
- Add the `ClauseType.Clauses` aggregate navigation and directional child DTO
  maps. No unnecessary `ReverseMap()` or mapping ignores are introduced.
- No migration is created or edited. The owner must generate/apply a
  migration for the `Clause.IsDefault` model change if it is not already
  present. The owner must also review the ClauseType aggregate navigation
  against the current schema before applying the migration.

## Required UI states

- List loading, empty, API failure, action-disabled and delete-in-progress.
- Editor loading, validation, save failure, dirty-close confirmation and
  duplicate-submit protection.
- Clause dialog loading, empty child set, row validation, save failure,
  dirty-close confirmation, and first-invalid focus.
- English and Arabic translations, RTL-safe layout, dark theme variables, and
  responsive dialogs.

## Final reconciliation boundary

- Do not modify generated packets, migrations, snapshots, or unrelated modules.
- Do not run builds, tests, lint, browser automation, database commands,
  commits, pushes, or deployment. Verification is source-only until the owner
  runs the required migration and runtime checks.
