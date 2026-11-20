## 7. End-to-end reconciliation and final report

Phase 6 compares every applicable path.

Performance handoff applies Master5/UI29/BE7/BE2: include the actual route/request
inventory, confirmed query/read-volume findings and authorized fixes, comparable
before/after measurements or explicit pending owner measurement, and index
proposals with existing coverage, key/filter/include rationale, costs and schema
boundaries. Record a justified no-new-index outcome where appropriate. Source
query-count reductions do not establish measured load-speed success. Reuse the
feature's existing report and keep execution authorization unchanged.

### Mandatory comparisons

- Screenshot evidence ↔ implemented functional behavior.
- Master2 analysis-guide review ↔ original screen-explanation evidence ↔
  applicable dated sidebar/code cycle and document-link evidence ↔ actual Sigma
  owners, accepted contracts and scoped result; reconcile exclusions, conflicts,
  Missing/Uncertain decisions and supported Not applicable outcomes. An unread
  source or generic claim that the guide was checked is not review evidence.
  Reconcile Master4's reference-cycle rows, including out-of-scope links and
  unsupported server/financial claims; declared frontend methods are not runtime proof.
- Master2's reference-product functional detail target ↔ Master4's scoped
  coverage rows ↔ final source and user-guide content. State matched, partial,
  missing, decision-blocked and owner-excluded details and their remaining
  slices. An older minimal Sigma contract or implementation does not erase a
  target gap. Report bounded fixes separately from reference equivalence;
  never claim the latter while required details remain unaccounted for.
- Grid columns and action needs ↔ frontend list model ↔ backend ListVM.
- Filter controls ↔ serialized keys ↔ server allow-lists for direct filters,
  grid fields and sort ↔ tenant/branch scope, count, aggregates and export (BE9).
- Page request ↔ `CountAsync` total ↔ response metadata ↔ Grid pager state.
- View fields ↔ Detail DTO.
- Form controls ↔ Add/Update DTOs ↔ server ownership rules.
- Save flow ↔ validation ↔ transaction ↔ response ↔ close/refresh.
- Actions ↔ effective operation grants, prerequisites and persisted record/branch
  capability ↔ backend enforcement and state ↔ recheck after confirmation ↔ recovery.
- Approved-reference action inventory ↔ target classification ↔ complete
  backend-to-UI vertical slice for every Supported action.
- Override-justification table ↔ every scoped service/controller `override`.
- UI visibility ↔ actual authorization mechanism.
- Service error behavior ↔ component failure behavior.
- Routes/modes ↔ editor shape and exit behavior.
- Upload UI ↔ Media/API/storage/cleanup contract.
- Translation keys ↔ English and Arabic.
- Screen user-guide topics and steps ↔ final screen routes, actions, states,
  validations and financial/business constraints.
- Feature styles ↔ local ownership, RTL, theme, overlay, and responsive rules.
- Providers ↔ interceptor-enabled client and authentication header path.
- Successful mutations ↔ exactly one success-feedback owner; failures ↔ exactly one error owner.
- Changed feature code ↔ the shared pieces of its blocks (block 5 *Shared pieces, not feature
  copies*), with feature copies removed.
- Authorization contract ↔ active route/request and server owner ↔ least-privileged
  access, including view-only branches where applicable (UI26, Master4).
- Sent mutation ↔ settlement of the original write/draft ↔ result visibility ↔
  refresh for the same session that still has read access. Cover write revocation
  during the request and session replacement as distinct cases (UI26/28).
- Authorization regression evidence for applicable paths ↔ actual HTTP action
  and denial layer (BE6) ↔ complete branch effects and shared-source quantities
  under the write boundary, activity and retained-row identity (BE8) ↔ bounded
  authorized queries and pagination (BE9) ↔ nested local exit, open-report
  grant changes and print row identity (UI21/28). Use fixtures that reach the
  guard being checked (Master5).
- Authorization handoff ↔ operation mapping, latest source-review findings and
  their disposition, schema readiness and runtime acceptance. Record pending
  evidence explicitly and link it from the existing coverage record (UI26).
- Every decision taken ↔ its business reasoning (block 1).
- The change ↔ the shared-extraction gate (block 5): what was extracted, or why nothing qualified.
- When a Maintenance / Evolution Plan was required, Frozen target contracts ↔
  final source behavior, migration/compatibility decisions, implementation
  slices, and verification evidence.

### Scenario reconciliation and completion wording

Reuse the feature's existing reconciliation rows for the applicable scenarios
chosen under Master5. Each row names the actor and branch capabilities, actual
entry path and affected producer/consumer symbols, expected state, source
evidence or finding, and executed check or pending acceptance. A defect
corrected in a producer requires a fresh comparison of its affected consumers.
Retain a reference to the latest finding and its disposition.

Distinguish operation mapping, source conformance, build, executed behavioral
checks and runtime acceptance in the report. A row is source-conformant when
the compared final symbols implement its contract and no known contradiction
remains in that path. Missing evidence is recorded as uncertain. A successful
build establishes compilation for its target. Test execution requires its own
result and runtime acceptance requires its own evidence.

When an in-scope source defect remains, report the affected path as incomplete
with its next action. When source work is reconciled and behavioral or runtime
checks remain pending, say so in the completion sentence. A coverage count
records operation mappings and carries the linked review status separately.
Preserve the existing task and execution boundaries.

### Screen user guide completion gate
After completing an authorized implementation or refactor of a user-facing
screen, create its in-app user guide, or update the existing guide, **before
the final handoff**. A screen implementation is not source-complete while this
required deliverable is absent or describes outdated behavior. This applies
to newly implemented and subsequently reviewed screens; it does not authorize
a bulk retrofit of screens outside the current task.

1. Finish and reconcile the screen's actual implementation first, then write
   the explanation from that final source. Cover the screen's purpose,
   prerequisites, task steps, available actions and relevant state transitions,
   validation/financial limits, and useful questions where applicable. Explain
   what a user does and what happens; do not publish implementation internals
   or invent actions, permissions, payment, posting or refund behavior.
2. Add or update the screen's topic in its owning module's guide, with the
   appropriate lifecycle/context. Child dialogs and Create/Edit/View modes
   belong in the parent screen's explanation when they share its workflow;
   they do not require duplicate guide pages or sidebar entries. Keep existing
   topics and stable links, and update relevant explanations when behavior
   changes. When no module guide exists, create its content and register it in
   the existing reader, with one guide entry under that module's sidebar menu.
3. Reuse `SiGmaAngularFrontEnd/src/app/modules/UserGuide/` models, reader,
   journey/topic components and existing shared UI owners. Keep typed authored
   content separate from presentation, with English and Arabic text, while UI
   controls follow UI23. Use the actual operational routes for screen links;
   source-unsupported workflows are stated as unavailable, never promised.
   Do not create another viewer, external site or per-screen card palette.
4. Reconcile the explanation against the final routes, visible actions and
   owning backend rules where needed, especially financial constraints. In
   the existing feature review record the content file, module guide route
   and sidebar entry, covered topic identities and source evidence. Check
   topic/route coverage, bilingual text and directly touched UI translations.
   Reading/navigation/RTL/theme/print checks remain owner acceptance under the
   existing execution boundary; documentation is not proof of runtime success.
5. This step belongs to authorized frontend/full-stack screen work. A
   source-read-only review reports a missing or stale guide without changing
   application source. A backend-only task records user-guide impacts for its
   scoped frontend follow-up instead of silently expanding its source scope.
   Step-by-step phase commands retain their boundary: intermediate phases
   record the guide handoff requirement; screen implementation completion
   includes the guide before final reconciliation.

### Scoped diff and build review

Before completion:

- review the complete scoped diff;
- check stale imports, types, routes, providers, and translations;
- check frontend/backend contract mismatches;
- check inappropriate mappings and server-owned payload fields;
- search scoped service/controller source for `override` and reconcile every
  match with the override-justification table;
- prove that every approved-reference action is classified and every Supported
  action has its route, payload, flag/status, UI interaction, translation,
  failure handling, and refresh path;
- check merge markers and whitespace errors;
- check that the required in-app guide exists and matches the final screen,
  including its module menu link and English/Arabic content;
- preserve unrelated changes;
- record source verification, scoped local build, scoped test and lint results
  separately (Master5). A test project build checks compilation only. Keep
  unexecuted tests, runtime, browser and database checks explicitly pending.

### Final report

Report proportionally:

- files changed;
- phases applied and skipped, with reasons;
- evidence classifications and unresolved requirements;
- decisions taken and their evidence;
- contract tables or their final comparisons;
- frontend, backend, mapping, and calculation decisions;
- action and refresh behavior;
- user-guide content file, module guide route/menu entry, covered screen topics,
  evidence of content conformance and pending owner acceptance;
- Maintenance / Evolution Plan status and any approved deviation from its Frozen
  target contracts;
- migration requirement;
- suggested migration name and commit messages (see below);
- possible compile/runtime risks;
- verification performed and verification pending;
- prohibited or owner-only commands not run.

Do not claim full feature completion while a Missing, Conflicting, or Uncertain
contract blocks required behavior.

### Schema impact check
Before the report, list every change in the diff to an entity property or its nullability, a
`[MaxLength]`, an EF `HasMaxLength`/`IsRequired`/index/relationship configuration, and every
removed column. Report the applied migration ID or the proposed `Add-Migration <Name>` command,
along with the reason and the relevant data checks. Examples include values longer than a new
limit, nulls in a required column, and a data copy before dropping a column.

### Migration handoff and suggested commit messages

An authorized implementation includes its required EF migration on the verified
experimental Sigma database under Master1. A direct
migration request authorizes the named scope. Review the generated designer,
model snapshot and SQL. Verify the target, applied baseline and dependencies,
then apply only the scoped migration ID. Do not apply unrelated pending migrations. Verify the new
history entry, constraints and affected rows. Record the target, migration ID,
data handling and remaining runtime checks. For an authorized experimental
data backfill, use a valid same-tenant reference and document how it was chosen.

**Experimental-data operation evidence.** Master1 grants
standing permission for task-scoped reads, writes, data repairs and deletion of
experimental duplicates in confirmed Sigma local/hosted development/test
databases. Do not request that permission again. Record the actual server/
database/environment, tenant and record-selection rule, executed operation and
affected row counts, resulting reference/financial/permission checks and
remaining uncertainty. Keep proposed commands and pending schema work separate
from executed data changes. This data permission does not authorize production/
out-of-project targets, a full data reset or database drop. Scoped schema changes
use the separate experimental migration rule above.

For a pending schema change, record the reason and proposed migration name.
Commit messages remain suggestions.

**Migration name** — use these conventions for proposed and created migrations:

- PascalCase, starting with a verb that names the schema change: `Add`,
  `Remove`, `Rename`, `Change`, `Link`, `Create`, `Drop`. Describe the schema
  change, not the task: `AddJobTypeToLabourActivities`, not `RefactorLabour`.
- No spaces, hyphens, dates, or ticket numbers; EF Core adds the timestamp.
- Unique: check `SiGma.DataAccess/Migrations` for an existing class of the same
  name before suggesting it.
- One migration per coherent schema change. When one feature change touches
  several entities, name the feature change, for example
  `AddApprovalStatusToWorkshopDocuments`.
- For a pending migration, give the ready command `Add-Migration <Name>`.

**Commit messages** — one per affected repository, because the frontend, the
backend, and the documentation layer are separate repositories:

- Format `<type>(<scope>): <summary>`, in English.
- `type`: `feat` (new behaviour or field), `fix` (defect), `refactor` (same
  behaviour, new structure or pattern), `docs` (guides, reviews, instruction
  files), `chore` (tooling, generated packets, configuration).
- `scope`: the feature in kebab-case (`labour-activities`, `job-estimation`) or
  the documentation area (`master`, `ui-book`, `recipe-system`).
- `summary`: imperative, lower-case start, no final period, at most 72
  characters including the prefix.
- Optional body after a blank line: short bullet lines for the contract change,
  the migration name, and anything the reviewer must know.
- Do not fold unrelated pending changes into the suggested message. If the
  repository already held unrelated changes, list the files the message covers
  so the owner can stage only those.

Example:

```text
Backend migration:  Add-Migration AddJobTypeToLabourActivities

SigmaBackend:
feat(labour-activities): add optional job type and paged name search

- JobType? on entity and VMs; legacy Type kept but no longer exposed
- duplicate name rejected on add and update
- requires migration AddJobTypeToLabourActivities

SiGmaAngularFrontEnd:
refactor(labour-activities): move to shared list and editor dialog
```

---
