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
- Feature styles ↔ local ownership, RTL, theme, overlay, and responsive rules.
- Providers ↔ interceptor-enabled client and authentication header path.
- Successful mutations ↔ exactly one success-feedback owner.
- When a Maintenance / Evolution Plan was required, Frozen target contracts ↔
  final source behavior, migration/compatibility decisions, implementation
  slices, and verification evidence.

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
- Maintenance / Evolution Plan status and any approved deviation from its Frozen
  target contracts;
- migration requirement;
- suggested migration name and commit messages (see below);
- possible compile/runtime risks;
- verification performed and verification pending;
- prohibited or owner-only commands not run.

Do not claim full feature completion while a Missing, Conflicting, or Uncertain
contract blocks required behavior.

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

