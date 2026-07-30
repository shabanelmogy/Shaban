# Sigma Full-Stack Review Checklist

Use this checklist for every `$sigma-full-review`. Mark each applicable item in
the report as reviewed, finding raised, intentional, or out of scope.

## 1. Scope and discovery

- [ ] Feature routes and entry points are identified.
- [ ] The resolved local or GitHub `Shaban/sigma front` standards directory was
      enumerated, and the source used was recorded.
- [ ] Applicable grid, form, report, location, color and backend guides were read.
- [ ] The reviewed Angular grid guide was used as the only canonical grid
      standard; the compatibility redirect was not treated as a second guide.
- [ ] Frontend list, details, models, services and translations are identified.
- [ ] Backend controller, service, DTOs, mapper, entity and EF configuration are identified.
- [ ] Shared controller/service/repository/UI behavior is traced.
- [ ] Every custom CRUD override is compared with the current base method and
      all replaced security/data invariants are recorded.
- [ ] Direct child entities, lookups, reports, exports and uploads are identified.
- [ ] Existing dirty files and prior review reports are preserved.

## 2. Endpoint parity

For each operation, compare frontend and backend:

- [ ] HTTP verb matches.
- [ ] URL and route casing match.
- [ ] Route parameters match names and types.
- [ ] Query parameters and filter keys match.
- [ ] Request wrapper/body shape matches.
- [ ] Response wrapper and success/error handling match.
- [ ] Add, Update, Delete, Detail, List and Select are traced.
- [ ] Custom actions, status changes, reports, exports and uploads are traced.
- [ ] Permission shown in UI matches backend authorization.
- [ ] Unsupported UI actions or unused backend endpoints are reported.

## 3. Mandatory bidirectional field parity

Create one row per field. Do not sample.

### Frontend to backend

- [ ] Every form control appears in the correct request DTO or is marked UI-only.
- [ ] Every request property is accepted by the backend DTO.
- [ ] Every accepted property is mapped or deliberately handled by the service.
- [ ] Every persisted field reaches the intended entity/child entity.
- [ ] Frontend-only sent fields are reported as possible silent data loss.
- [ ] Disabled controls that disappear from Angular `form.value` are accounted for.
- [ ] Hidden/read-only fields are not accidentally trusted by the backend.
- [ ] Empty string, `null`, omitted and default values have explicit behavior.

### Backend to frontend

- [ ] Every backend required Add field is supplied by create UI.
- [ ] Every backend required Update field is supplied by edit UI.
- [ ] Every detail field needed by the form exists in the response model.
- [ ] Every grid column exists in the list response model.
- [ ] Every filter/sort field is implemented by the backend query.
- [ ] Backend-only required fields are reported.
- [ ] Backend response fields unused by the UI are classified, not automatically removed.
- [ ] Server-owned fields are classified and protected.

### Type and rule equality

- [ ] Property names and JSON casing match.
- [ ] TypeScript and C# scalar types are compatible.
- [ ] Nullable/optional rules match Angular validators and C# DTO nullability.
- [ ] String minimum/maximum lengths match.
- [ ] Decimal precision, scale, ranges and rounding match.
- [ ] Enum values, numeric/string serialization and labels match.
- [ ] Date format, date-only semantics, timezone and boundaries match.
- [ ] Boolean defaults and tri-state nullable booleans match.
- [ ] IDs use compatible numeric/string/Guid types.
- [ ] Nested object and collection names/shapes match.

Use these statuses:

| Status | Meaning |
|---|---|
| `MATCHED` | Both layers agree and the field is used. |
| `FRONTEND_ONLY` | UI/model sends or expects a field absent from the backend contract. |
| `BACKEND_ONLY` | Backend requires/returns a field absent from the frontend contract. |
| `TYPE_MISMATCH` | Types cannot safely serialize or preserve values. |
| `NULLABILITY_MISMATCH` | Required, optional, omitted or default behavior differs. |
| `NAME_OR_CASING_MISMATCH` | Names or JSON paths differ. |
| `ENUM_OR_DATE_MISMATCH` | Enum/date representation or rules differ. |
| `DIRECTION_MISMATCH` | Field exists in the wrong Add/Update/List/Detail direction. |
| `UNUSED` | Contract field exists but is ignored or never consumed. |
| `INTENTIONAL_UI_ONLY` | Presentation/computed state that must not be sent. |
| `SERVER_OWNED` | Tenant, number, audit, totals or status controlled by backend rules. |

## 4. Frontend review

### Routing and permissions

- [ ] List/create/view/edit routes are reachable and unambiguous.
- [ ] IDs are parsed safely and invalid/missing IDs are handled.
- [ ] Route mode cannot accidentally enable editing in view mode.
- [ ] Permission/role/feature-flag rules cover navigation and action execution.
- [ ] Deep links and browser refresh behave intentionally.

### Grid/list

- [ ] Columns use real list response fields.
- [ ] Actions use the correct row ID and refresh after success.
- [ ] Conditional actions are rechecked when executed.
- [ ] Search has one clear implementation and matches backend search fields.
- [ ] A server-paged grid sends search to the backend; local `filterGlobal`
      never pretends to search records outside the loaded page.
- [ ] Filters serialize correct keys and values.
- [ ] Paging is server/client-side intentionally, with stable page restoration.
- [ ] Empty, loading, error and no-permission states exist.
- [ ] Last-page deletion and zero-results behavior are safe.
- [ ] Export/report parameters match visible filters.
- [ ] No unnecessary client-side full-table filtering exists.

### Form and steps

- [ ] Create, view and edit initialize/reset correctly.
- [ ] View mode is fully read-only and hides mutating actions.
- [ ] Edit loads all required fields without overwriting user changes.
- [ ] Angular validators match backend requirements.
- [ ] Validation messages identify the field and rule.
- [ ] Invalid step navigation focuses the first invalid control.
- [ ] Conditional controls update validators and payload consistently.
- [ ] Disabled controls are deliberately included/excluded from payload.
- [ ] Submit is protected against duplicate clicks.
- [ ] Save success closes/navigates/refreshes consistently.
- [ ] API errors remain visible and do not discard form values.
- [ ] Dates, enums, autocomplete objects and IDs are normalized once.
- [ ] Date-only values preserve `yyyy-MM-dd` calendar components without UTC
      day shifts; timestamps follow the explicit UTC contract.

### Nested rows and files

- [ ] Add/update/remove policy for each child collection is explicit.
- [ ] New versus existing child IDs are correct.
- [ ] Removed children are represented as the backend expects.
- [ ] Duplicate child rows/default rows are prevented or reported.
- [ ] Child validation appears before submit.
- [ ] Upload type, size, extension, result path and deletion behavior match backend.
- [ ] Existing files remain stable when no replacement is uploaded.
- [ ] Backend upload validation covers permission, tenant/parent ownership,
      size, extension, MIME/signature, safe naming, replacement, orphan cleanup,
      and deletion lifecycle.
- [ ] CVV is collected only for immediate authorization and is never persisted,
      returned in Detail, logged, routed, or exported.

### UX quality

- [ ] Labels, placeholders, messages and actions are translated.
- [ ] Layout is responsive and RTL/LTR safe.
- [ ] Keyboard navigation, focus, labels and accessible names are usable.
- [ ] A stepper using tab roles implements linked tabpanels, roving focus and
      Arrow/Home/End/Enter/Space behavior; otherwise it uses non-tab semantics.
- [ ] Loading indicators and buttons cannot become permanently stuck.
- [ ] Subscriptions/effects are cleaned up where required.
- [ ] No sensitive tenant/audit data is treated as trusted UI state.

### Theme, color and visual states

- [ ] `color_system.md` was read before judging colors or dark mode.
- [ ] Save/Next-blocking validation uses the red error palette, not the amber warning palette.
- [ ] Amber is limited to non-blocking warnings or temporary invalid-field navigation highlights.
- [ ] Light, dark and `system` modes are reviewed with `data-bs-theme` on `<html>`.
- [ ] Success, information, warning, error, disabled, selected, hover and focus-visible states are reviewed.
- [ ] Validation and state meaning are not communicated by color alone.
- [ ] Global `src/styles.scss` rules and feature-scoped rules are distinguished.
- [ ] Shared `table-list` grids and PrimeNG table/paginator states are reviewed.
- [ ] Body-appended PrimeNG dropdown, select, calendar, datepicker, dialog, menu and toast overlays are reviewed.
- [ ] Light/dark contrast is checked for normal text, large text, focus indicators and non-color state cues.
- [ ] RTL positioning, responsive layout, keyboard focus and `prefers-reduced-motion` are reviewed.

## 5. Backend review

### API and authorization

- [ ] Controller/base route and verb are correct.
- [ ] Authentication and operation permission are enforced server-side.
- [ ] Model-state/validation failures use the established result/status convention.
- [ ] Another tenant's existence is not disclosed.
- [ ] Raw exception/SQL/stack information is never returned.

### Validation

- [ ] Required strings reject `null`, empty and whitespace.
- [ ] Length limits align with entity/database constraints.
- [ ] Regex is used only for documented stable syntax.
- [ ] Numeric ranges and decimal precision are explicit.
- [ ] Undefined enum values are rejected.
- [ ] Date boundaries and ordering are explicit.
- [ ] Every request foreign key exists in the current tenant and is active.
- [ ] Duplicate checks use the real business scope and exclude Update self.
- [ ] Self-reference, hierarchy cycles and overlapping ranges are handled.

### Add and Update

- [ ] Tenant, number, audit, deletion, status and calculated totals are server-owned as appropriate.
- [ ] Update target is tenant- and soft-delete-scoped.
- [ ] Custom Update/UpdateList overrides reproduce base tenant mismatch checks,
      server-owned-field preservation, child ownership and atomicity.
- [ ] Immutable fields cannot be changed by mapping.
- [ ] AutoMapper maps every intended field exactly once.
- [ ] DTO fields that are ignored by mapping/service are reported.
- [ ] Child IDs belong to the current parent and tenant.
- [ ] Child replace/merge/append/remove behavior is explicit.
- [ ] Parent and child validation occurs before the first irreversible save.
- [ ] Multi-save operations are atomic where partial state is unsafe.
- [ ] Bulk update validates every target before mutation.

### Delete

- [ ] Delete target is tenant-scoped.
- [ ] All business references are inventoried from the current EF model.
- [ ] Required blockers are checked with specific messages.
- [ ] Cascade, restrict, set-null and soft-delete behavior are intentional.
- [ ] Reports/history are not orphaned or silently hidden.

### Queries and responses

- [ ] Tenant and soft-delete predicates cannot be bypassed.
- [ ] Filters apply before count and paging.
- [ ] Blank/malformed filters have predictable behavior.
- [ ] Page number/size are bounded.
- [ ] Ordering is deterministic.
- [ ] `TotalCount` and `TotalPages` are accurate.
- [ ] List query projects only grid fields.
- [ ] Detail query loads only required relationships.
- [ ] No N+1 or premature `ToList`/in-memory filtering exists.
- [ ] Search/date predicates remain database-translatable.
- [ ] Reports/exports use the same approved filters and business status rules.
- [ ] Any failed paged export fails the complete export; no successful prefix
      is presented as a complete file.
- [ ] Export rechecks permission, tenant scope, sensitive columns, result limits
      and cancellation behavior.
- [ ] Cancellation/timeout behavior follows existing project conventions.

### Database and persistence

- [ ] Entity nullability, max length and precision match DTO rules.
- [ ] FK relationships and delete behaviors match business rules.
- [ ] Useful indexes support demonstrated filters/order/uniqueness.
- [ ] Unique rules are also protected at database level when races matter.
- [ ] Existing data is considered before proposing a migration.
- [ ] Concurrency/lost-update risk is documented.
- [ ] No migration or architecture change is proposed without need.

## 6. Cross-layer business scenarios

Review at least:

- [ ] Valid create.
- [ ] Valid update without changing server-owned fields.
- [ ] View and edit of optional/null relationships.
- [ ] Delete with and without references.
- [ ] Empty list and exact last page.
- [ ] Search with whitespace, casing and special characters.
- [ ] Missing, soft-deleted and cross-tenant foreign keys.
- [ ] Duplicate values with whitespace/case normalization.
- [ ] Invalid enum and default/invalid date.
- [ ] Boundary lengths, amounts and decimal rounding.
- [ ] Omitted versus empty child collection.
- [ ] Child ID owned by another parent.
- [ ] Duplicate submit and concurrent edit.
- [ ] API failure during parent/child save.
- [ ] Unauthorized action and stale UI permissions.
- [ ] Upload failure, unsupported file and missing stored file.
- [ ] Report/export parity with current filters.
- [ ] Server search finds a record that is not on the initially loaded page.
- [ ] Date-only values remain the same day across supported client timezones.
- [ ] Upload replacement/failure/orphan cleanup and prohibited CVV retention
      scenarios are covered.

## 7. Finding quality

Every finding must include:

- [ ] stable ID and severity;
- [ ] exact file and line evidence from both layers when cross-layer;
- [ ] observed behavior, not speculation;
- [ ] user/data/security impact;
- [ ] smallest fix within current patterns;
- [ ] affected frontend and backend files;
- [ ] owner-run acceptance scenario;
- [ ] dependencies or contract decision, if any.

Do not:

- combine unrelated problems into one finding;
- label style preferences as correctness defects;
- recommend broad frameworks or rewrites for a local problem;
- claim a build, test or runtime result that was not performed;
- omit reviewed areas with no findings.

## 8. Report skeleton

```markdown
# <Feature> Full-Stack Review

## Scope and limitations
## Request-flow map
## Endpoint contract matrix
## Field parity matrix
## Validation and business-rule matrix
## Findings summary
## Critical findings
## High findings
## Medium findings
## Low findings
## Query and database review
## Edge cases
## Owner-run acceptance scenarios
## Contract decisions needed
## Coverage ledger
## Conclusion
```
