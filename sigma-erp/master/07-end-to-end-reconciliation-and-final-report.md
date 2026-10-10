## 7. End-to-end reconciliation and final report

Phase 6 compares every applicable path.

### Mandatory comparisons

- Screenshot evidence ↔ implemented functional behavior.
- Grid columns and action needs ↔ frontend list model ↔ backend ListVM.
- Filter controls ↔ serialized keys ↔ backend exact lookup keys.
- Page request ↔ `CountAsync` total ↔ response metadata ↔ Grid pager state.
- View fields ↔ Detail DTO.
- Form controls ↔ Add/Update DTOs ↔ server ownership rules.
- Save flow ↔ validation ↔ transaction ↔ response ↔ close/refresh.
- Actions ↔ backend authorization/state rules ↔ confirmation/input ↔ recovery.
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
- Restricted actions ↔ the *Authorization candidates* list in the review (UI block 26).
- Every decision taken ↔ its business reasoning (block 1).
- The change ↔ the shared-extraction gate (block 5): what was extracted, or why nothing qualified.
- When a Maintenance / Evolution Plan was required, Frozen target contracts ↔
  final source behavior, migration/compatibility decisions, implementation
  slices, and verification evidence.

### Screen user guide completion gate (owner instruction, 2026-10-08)

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

### Source-only diff review

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
- distinguish source verification from build, runtime, browser, and database
  verification.

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

### Schema impact check (G2, 2026-10-01)

Before the report, list every change in the diff to an entity property or its nullability, a
`[MaxLength]`, an EF `HasMaxLength`/`IsRequired`/index/relationship configuration, and every
removed column. Any one of them makes `Add-Migration <Name>` a required report line, with the
reason and the data to check before applying it: values longer than a new limit, nulls in a
column that becomes required, a data copy before a column is dropped. A task with such a change
cannot close without that line.

### Suggested migration name and commit messages

The agent never creates a migration or a commit; it suggests the names the owner
uses, so every change arrives with a ready, consistent name.

**Migration name** — only when the report says `Add-Migration` is required:

- PascalCase, starting with a verb that names the schema change: `Add`,
  `Remove`, `Rename`, `Change`, `Link`, `Create`, `Drop`. Describe the schema
  change, not the task: `AddJobTypeToLabourActivities`, not `RefactorLabour`.
- No spaces, hyphens, dates, or ticket numbers; EF Core adds the timestamp.
- Unique: check `SiGma.DataAccess/Migrations` for an existing class of the same
  name before suggesting it.
- One migration per coherent schema change. When one feature change touches
  several entities, name the feature change, for example
  `AddApprovalStatusToWorkshopDocuments`.
- Give the ready command: `Add-Migration <Name>`.

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
