# Sigma workflow — artifacts and final report

On-demand section of the live companion (`../SIGMA_WORKFLOW_RULES.md`). Read when
writing a review/contract/plan artifact or a tier M/L final report. Tier S uses
the short report in companion section 7.

## Required decisions and artifacts

Use Master Guide block 4 and the applicable packet. Make every applicable
decision before writing code and report its evidence. A broad feature requires:

- Feature Review Manifest;
- Functional Evidence Tables for supplied screenshots;
- Grid Column and Filter contracts when a list exists;
- Detail/Add/Update contract when an editor exists;
- Action-state contract for risky or stateful actions;
- Route/provider/interceptor contract;
- final reconciliation table.

If a decision cannot be made from available source, mark it Missing,
Conflicting, or Uncertain, name the exact source or business decision required,
and do not invent an API, field, permission, or workflow. The
`approve reviewer assumptions` command applies only within the low-risk limits
defined above and does not convert a genuinely Missing material decision into a
reviewer assumption.

## Output artifacts

Review, contract, planning, and reconciliation artifacts are written under:

```text
F:\My Work\Sigma\reviews\
```

File names below are relative to that folder.

| Artifact | File name |
|---|---|
| Feature review | `<FEATURE_NAME>_FEATURE_REVIEW.md` |
| Full-stack review | `<FEATURE_NAME>_FULL_STACK_REVIEW.md` |
| Contract freeze | `<FEATURE_NAME>_<SCOPE>_CONTRACT_FREEZE.md` |
| Maintenance / Evolution Plan | `<FEATURE_NAME>_MAINTENANCE_EVOLUTION_PLAN.md` |
| Impact Analysis | `<FEATURE_NAME>_IMPACT_ANALYSIS.md` |
| Final reconciliation | `<FEATURE_NAME>_FINAL_RECONCILIATION.md` |
| Current state (read first) | `<FEATURE_NAME>_CURRENT_STATE.md` — at most 4 KB; when to write and rewrite it: Master8 §Section-level reading and current-state files |
| Documentation-system audit | `SIGMA_DOCUMENTATION_SYSTEM_AUDIT.md` |
| Multi-part feature | `<FeatureFolder>/<FILE>.md` |

- Use uppercase snake case for the feature name and place the scope qualifier
  after it. One contract-freeze file records one frozen handoff; do not append
  an unrelated handoff to it.
- When a reconciliation belongs to a feature review rather than to a separate
  handoff, record it as a section of that review artifact instead of a separate
  file.
- A frozen artifact is a historical record of the decision and its evidence. If
  a later instruction changes the contract, record the change and the reason
  rather than silently rewriting the earlier decision.
- The Shaban documentation repository owns `sigma-erp/workspace/`, including
  `AGENTS.md`, `GEMINI.md`, `PROJECT_MAP.md`, `.agents/` and `reviews/`.
  Use the usual Sigma workspace paths for editing. They link to the same files.
  Review instruction and artifact changes in the Shaban repository under that
  path; review application changes in their respective repositories.
- Create only the artifacts the requested scope requires.
- Every new artifact starts with a status table containing at least
  `Status` — one of `Draft`, `Frozen`, `Blocked`, `Implemented — source-only`,
  or `Closed` — and `Owner verification pending` — `yes` or `no`. Free-text
  statuses such as "Completed" are not used. Existing artifacts are historical
  and are not renamed or rewritten.

## Final report

Report:

- Files changed.
- Phases applied and skipped, with reasons.
- Screenshot evidence classifications and unresolved Missing, Conflicting, or Uncertain requirements.
- **Decisions taken**, using Master Guide block 4: for each applicable row, the decision and the evidence behind it. State the grid column list beside the ListVM property list so the match is visible.
- Frontend changes.
- Backend changes.
- Contract changes.
- AutoMapper decisions.
- Domain-calculation decisions.
- Migration ID, target and verification for any applied migration, or the
  proposed name and pending schema action.
- A suggested commit message for each affected repository (Master Guide block 7, "Suggested migration name and commit messages"). Suggest only; never commit.
- Build, scoped test and lint commands with counts and outcomes (Master5).
- Possible compile or runtime risks.
- Shared extraction: what was extracted or adopted, copies left in UI30 item 39,
  or why nothing qualified (Master5 topic `05/03` §Shared-extraction gate).
- Load-speed/query findings and scoped improvements, reproducible measured
  before/after results or pending owner measurement, and evidence-backed index
  proposals (or justified none), costs and migration/application boundaries.
- Manual owner-verification steps.
- Screen user-guide content file, module guide route/menu entry, covered screen
  topics, and source conformance/pending owner verification (Master block 7).
- Agent utilization: roles/models used, assigned workstreams and owned files,
  integration outcome, and the time/cost reason for delegation; or state that
  subagents were not used because the task did not meet the delegation gate.
- Confirmation that prohibited commands were not run.

Keep the report proportional to the change. A one-element fix records only the decisions it touched; a new feature records the full table.
