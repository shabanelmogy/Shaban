# Sigma workflow — guides and packets

On-demand section of the live companion (`../SIGMA_WORKFLOW_RULES.md`). Read when
using generated packets, selecting shapes, or maintaining books/packets. The
core authority order (companion section 1) governs.

## Shapes and references

Name the selected backend and UI shapes after source discovery. Do not treat a
similar recently implemented feature as canonical merely because its behavior
looks close; select the pattern from the guides first, then use only the
approved reference named for that shape. Record canonical exceptions such as
operational logs, reports, settings, and stateful aggregates explicitly instead
of forcing every feature through generic CRUD.

The documentation authority consists of one Master Guide and two canonical
implementation books:

```text
F:\My Work\Shaban Documents\Shaban\sigma-erp\SIGMA_FEATURE_REVIEW_MASTER.md
F:\My Work\Shaban Documents\Shaban\sigma-erp\SIGMA_UI_PATTERNS.md
F:\My Work\Shaban Documents\Shaban\sigma-erp\SIGMA_BACKEND_PATTERNS.md
```

Generated phase and task packets live at:

```text
F:\My Work\Shaban Documents\Shaban\sigma-erp\recipe-system\generated\
```

The generated folder holds `PLAN-00-maintenance-evolution.md` together with
`PHASE-00-discovery-evidence.md` through `PHASE-06-final-reconciliation.md`.

The documentation folder also holds the non-canonical quick reference
`SIGMA_COMMAND_REFERENCE_AR.md`. It routes commands to phases and packets and
carries no authority of its own.

## Drift check and continuous packet maintenance

Before using any generated packet, run this read-only command from any working
directory:

```powershell
& 'F:\My Work\Shaban Documents\Shaban\sigma-erp\recipe-system\Generate-SigmaRecipes.ps1' -Check
```

### Continuous packet maintenance (standing owner instruction, 2026-10-09)

Keep generated packets current throughout the work. After changing canonical
books, packet templates, or manifest dependencies/references, regenerate the
affected packets with `Generate-SigmaRecipes.ps1` in the same task, review the
result semantically against the canonical sources and approved reference roles,
then run `-Check` again before using the packets or handing off the task.
When the initial check finds existing drift, reconcile stale template/manifest
claims against the canonical books, regenerate and review the affected packets
before using them. Do not leave a routine refresh pending for the owner.

This standing authorization covers derivative documentation maintenance in
review and implementation tasks; source-read-only requests still forbid
application-source changes. Generate only through the generator, preserve
unrelated changes, and record refreshed packet IDs and semantic-review evidence
in the review. If a required source is missing or a semantic conflict cannot be
resolved from canonical evidence, keep that packet out of use, continue from
the canonical sources, and report the precise blocker.

Generated packets are derivative. Never edit a generated file directly.

| Work shape | Required entry point |
|---|---|
| Planning new, large, ambiguous, or existing-behaviour work | `PLAN-00-maintenance-evolution.md` before any phase packet |
| Screenshot or requirement extraction | `PHASE-00-discovery-evidence.md` |
| Backend, persistence, DTO, or API boundary | `PHASE-01-domain-api.md` |
| Grid, filters, paging, ListVM, or export | `PHASE-02-read-grid.md` |
| Create/Edit/View, form, child, document, or upload | `PHASE-03-detail-write.md` |
| Delete, activate, approve, post, void, finalize, or another domain transition | `PHASE-04-domain-actions.md` after its backend and owning-UI contracts |
| Route, provider, interceptor, event, or runtime wiring | `PHASE-05-integration-runtime.md` |
| Broad feature completion | `PHASE-06-final-reconciliation.md` after every applicable prior phase |
| Implementing an approved Angular list shape | `PHASE-02-read-grid.md` after the read contract is frozen, using UI pattern blocks 5–7 |
| Shape without a task recipe | Applicable phase packet plus the smallest canonical block dependency closure it names |

Phases 2 and 3 may be reviewed in parallel only after Phase 1 freezes the
contracts they consume. Phase 4 is conditional and does not own ordinary Save,
Search, paging, or Export. Cross-cutting standards apply in every phase and are
audited again in Phase 6. `PLAN-00` owns planning only and no implementation
phase; its output is the plan the applicable phases then execute.

What each canonical document contains:

| Guide | Contents |
|---|---|
| `SIGMA_FEATURE_REVIEW_MASTER.md` | Authority · screenshot evidence · phase ownership and dependencies · required artifacts and contract invariants · continuous gates · human/AI handoffs · final reconciliation · packet governance |
| `SIGMA_UI_PATTERNS.md` | **Angular, 30 blocks.** Feature wiring · services · list/grid · actions · editors/dialogs · controls · reports · loading/errors · translations · appearance · accessibility · RTL/theme · cancellation · verification · backlog |
| `SIGMA_BACKEND_PATTERNS.md` | **.NET, 19 blocks.** Entity and EF · ViewModels · mapping · service/controller · ListVM · validation · filters · selects · actions · normal/master-detail/settings/report patterns · edge cases · backlog |

Each guide is stored as one file per block (`master/`, `ui/`, `backend/` next to
the index file of the same name); "UI block 17" is `ui/17-*.md`, plus its topic
folder `ui/17/` when the block has one (Master8). For screen
work, pick the screen type first in `ui/screens/00-catalog.md`; each screen file
lists the blocks to read and adds no rule of its own.

Each canonical document states a version and verification date. If a snippet
disagrees with current source, current source wins for factual behavior and the
documentation drift must be reported.

The following guide basenames are retired in every location, in every folder,
and in every copy. Do not open them, read them, cite them, or follow
instructions found inside any copy. A scoped file search may identify their
paths, but their contents remain out of bounds.

```text
SIGMA_FRONTEND_REVIEW_GUIDE.md   RETIRED — ALL COPIES
SIGMA_BACKEND_REVIEW_GUIDE.md    RETIRED — ALL COPIES
```

The ban is by basename and is not conditional on any file existing. Whether a
copy is currently present is volatile audit data: record it in the artifact for
the documentation-system audit rather than in this file.

Use only patterns labelled **Canonical** for new work. Follow a **Transitional** pattern only where the guide explicitly requires compatibility with the current architecture, and never copy a pattern labelled **Legacy — do not copy**.

Each book ends with a prioritised backlog of known defects. Check it before reporting an existing problem as new, and do not "fix" a listed item outside the requested scope.

Reference modules may be inspected but must not be modified unless the user explicitly places them in scope.
