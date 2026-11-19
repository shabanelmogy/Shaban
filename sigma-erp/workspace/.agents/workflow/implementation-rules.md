# Sigma workflow — implementation rules

On-demand section of the live companion (`../SIGMA_WORKFLOW_RULES.md`). Read
before any authorized source edit. Permissions are in companion section 4.

## Frontend and contract rules

- Select the canonical reference for the specific UI shape from `SIGMA_UI_PATTERNS.md`; do not treat one feature as the reference for every screen type.
- Before source edits, read the owning book blocks and actual shape-specific reference files. In the existing plan/review, record a short conformance table: concern, book block, reference file/symbol, shared owner, and target match or justified deviation (Master 5). Shared class names alone do not prove conformance.
- Before handoff, reconcile that table with final source. Correct known unapproved differences in scope; never claim completion while they remain. A documentation update cannot retroactively justify a different implementation: record the user instruction or governing decision first, and review shared extractions against the reference values before documenting them. Keep runtime/visual verification explicitly pending when only source was inspected.
- For Angular application compilation, follow the existing `tsconfig.app.json` pattern. If a runtime feature `.ts` file is reported as missing, add that runtime entry to the explicit `files` list and keep test files under `tsconfig.spec.json`; do not add a broad feature `include` that pulls `.spec.ts` files into the application compile.
- Keep frontend and backend contracts compatible.
- A list VM must contain only properties displayed in the frontend list plus the minimum identity and action-state properties required by that list.
- Add and update DTOs must contain client-editable inputs only.
- Detail DTOs must contain only data required by the details UI.
- Use typed forms, models, service calls, and payloads.
- Use the project's reusable confirmation dialog for every confirmation-only scenario. A workflow that collects a reason, note or date is a typed form dialog, not a confirmation.
- Include applicable translations, loading, empty, validation, and error states. Handle both failure channels: `isSuccess: false` and the `error` callback. `error: () => undefined` is never acceptable.
- `AuthGuard` establishes authentication. Use the current-session access and
  route/action owners in UI26 and verify actual ERP endpoint enforcement.
  Record the permission or policy, prerequisites and saved record/branch scope
  in the Master4 authorization contract. Record missing adoption as a gap and
  reconcile it under Master7. Apply BE9 to protected list inputs. The endpoint
  enforces access and the UI presents available operations.
- Preserve screenshot-demonstrated fields, labels, logical groups, actions, statuses, and workflows through the approved project pattern. The guides and approved reference own layout, component choice, controls, icons, spacing, validation presentation, accessibility, RTL, theme, and responsive behavior.
- For action/detail dialogs that identify a record, keep the screen name in the translated `title` and render the record number or identifier in the translated `subtitle` on the next line. The subtitle must use the shared smaller muted dialog-header style; do not concatenate a long identifier into the title or create feature-specific header markup when `EditorDialogComponent` already supports this structure.
- **The page never scrolls.** At every breakpoint the route fills the box the shell sizes (`height: 100%`, container-fill) and each region has exactly one internal scroll owner (grid rows, form pane, or dialog body); title, filters, paginator, and action footer stay fixed. `SIGMA_UI_PATTERNS.md` block 1 owns the chain and its values. Do not write a page-height `calc(100dvh - …)`.
- Keep each feature's page title inside its primary card or panel and use `app-feature-title`. `SIGMA_UI_PATTERNS.md` block 3 owns the title placement, the inset and separation values, the icon treatment, and the dark-theme tokens. Do not render a duplicate title in the shared authenticated-shell toolbar above the card, and do not restate the block 3 values in feature code or in this file.

## Backend, mapping, and calculation rules

- Keep every named class or record in its own file in the existing appropriate
  layer and folder. Do not declare helper DTO, projection, or query-shape
  classes inside a service class; use an anonymous type or tuple only when the
  shape is strictly local and does not need a named contract.
- When a feature uses the canonical generic service and controller bases,
  override only methods that require feature-specific business validation,
  projection, aggregate-child reconciliation, deletion behavior, or a domain
  transition. Use the inherited implementation for the remaining generic
  operations.
- Do not add unnecessary AutoMapper `Ignore()` calls or `ReverseMap()` mappings.
- Do not automatically mark calculated domain properties as `[NotMapped]`.
- Persist calculated values when they are required for lists, reports, filtering, performance, or historical stability.
- Keep calculation ownership in the domain or backend and do not trust client-calculated totals.
- When a field is derived from persisted inputs or business rules (for example,
  charge totals, discount/tax amounts, duration, balances, or status), define
  the calculation in the domain/service that owns the rule and return/persist
  the authoritative result there. The frontend may calculate a display preview
  for usability, but must omit derived fields from Add/Update requests and must
  never replace the backend result with its preview.
- Reconcile aggregate children explicitly before persistence.
- Use EF Core's implicit transaction when one scoped `DbContext` saves the
  complete tracked aggregate in one `SaveChangesAsync()` call. Use an explicit
  transaction only for the multi-save or multi-boundary cases defined by the
  canonical backend transaction guidance.
- Validate ownership, existence, state transitions, duplicates, and business invariants at the backend boundary.

## Migration boundary

- Owner instruction (2026-11-17): authorized implementation includes creating
  and applying the EF migration required by that task on a verified Sigma
  experimental database. A direct migration request authorizes its named scope.
  Review-only, plan-only and named phase boundaries still apply. Include the
  generated designer and model snapshot in the scope.
- Before applying, verify the configured experimental target, applied baseline,
  dependencies, generated SQL and affected data. Apply the reviewed migration by
  ID and keep unrelated pending migrations outside the operation. If dependencies
  cannot be satisfied within scope, record the blocker under Master7. Verify the
  resulting EF history, schema, constraints and affected rows.
- For authorized experimental-data backfill, use existing valid references
  within the same tenant and document the selection rule. Scoped data repair
  and experimental-duplicate deletion use the standing permission; record the
  actual row-count changes and reference/financial checks. This does not
  authorize a full data reset, schema change, migration or database drop.

## Source review and build verification

Before reporting the result:

- Identify the Git repository root for every scoped file and review the complete
  scoped diff separately in each affected repository. Do not assume that the
  workspace root is a Git repository. In the current workspace the root
  `F:\My Work\Sigma` is not a repository even though an empty `.git` directory is
  present there, and the relevant repositories are
  `F:\My Work\Sigma\SiGmaAngularFrontEnd` and
  `F:\My Work\Sigma\SigmaBackend`, as applicable.
- If repository ownership protection blocks a read-only Git command, use a
  non-persistent per-command `git -c safe.directory=<repo> -C <repo> ...`
  override. Do not change global Git configuration solely to perform the
  review. If a required scoped diff still cannot be inspected, mark final
  reconciliation Blocked and report the exact reason instead of claiming
  completion.
- Check directly related source for stale imports and types, frontend/backend contract mismatches, route wiring, missing translations, inappropriate AutoMapper mappings, merge markers, and whitespace errors.
- Check .NET namespace resolution explicitly: compare each new or moved type's
  declared namespace with its consumer imports or actual global imports, then
  verify the owning project reference and source inclusion. Diagnose the
  producer's first error before changing correct dependent consumers. Follow
  Master block 5; source inspection does not prove a successful build.
- Do not change unrelated files to make the diff cleaner.
- Review new or changed specifications against actual signatures and accessibility,
  project references/source inclusion, and the test provider. Seed fixtures separately
  from the actor restricted by the scenario. Use the scoped build to check compilation.
- Report the exact build target and outcome, and the scoped test/lint commands, counts and
  outcomes (Master5). Keep unexecuted tests, runtime, database
  and browser verification explicitly pending.
- For executed experimental-database work, record the actual target, tenant/row
  selection, operation and affected counts, plus resulting integrity checks.
  Distinguish executed changes from proposed commands and pending schema work.
