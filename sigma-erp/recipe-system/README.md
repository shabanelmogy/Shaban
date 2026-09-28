# Sigma Recipe System

This directory provides generated phase-review and task-implementation packets
for coding models. It does not replace `SIGMA_FEATURE_REVIEW_MASTER.md`,
`SIGMA_UI_PATTERNS.md`, or `SIGMA_BACKEND_PATTERNS.md` (stored as one file per
block in `master/`, `ui/`, and `backend/`); those remain the canonical sources of review, contract, and implementation rules.

## Why this exists

The books contain rationale, alternatives, known defects, governance notes, and
examples intended for human review. A coding model usually needs a smaller,
ordered packet containing only the rules that apply to the requested task.

The recipe system therefore separates three concerns:

1. The Master Guide and pattern books own the rules and explanations.
2. `recipe-manifest.json` declares which canonical blocks govern a task shape.
   Each book is a directory; block N is the file `NN-*.md` in it.
3. `Generate-SigmaRecipes.ps1` combines the task template with fingerprints of
   those source blocks and writes the generated packet.

Generated files are derivative artifacts. Never edit them directly.

## Packet families

`PLAN-*` packets are pre-implementation planning entry points for maintenance,
extension, or cross-cutting evolution. Use them when the current business logic
must be audited and a target design must be discussed/frozen before the normal
feature phases begin.

`PHASE-*` packets are bounded review entry points:

1. Discovery and Evidence.
2. Domain, Persistence, and API.
3. Read Path and Grid.
4. Detail and Write Path.
5. Domain Actions and State Transitions.
6. Integration and Runtime Wiring.
7. Final Reconciliation.

Phase packets establish, verify, and implement the scoped contracts. Angular
list replacement, reusable `app-data-table` integration, and the feature's
list/filter/ListVM contract are owned by `PHASE-02-read-grid`; there is no
separate list-page task recipe.

`templates/FEATURE-REVIEW-ARTIFACTS.template.md` is the reusable human and AI
handoff document for one feature. Copy it outside `generated/`, fill only the
applicable sections, and keep unresolved contract statuses visible through final
reconciliation.

`templates/MAINTENANCE-EVOLUTION-ARTIFACT.template.md` is the reusable planning
document for an existing capability that is being extended or corrected. It
captures the current-state audit, ambiguity register, impact map, option decision,
target contracts, migration/compatibility strategy, implementation slices, and
verification plan before code is changed.

## Generate

From this directory:

```powershell
.\Generate-SigmaRecipes.ps1
```

Generate one packet by manifest ID:

```powershell
.\Generate-SigmaRecipes.ps1 -Recipe phase-02-read-grid
```

## Check synchronization

The check is read-only. It recomputes the source fingerprints and generated
content, then fails when the committed packet is stale:

```powershell
.\Generate-SigmaRecipes.ps1 -Check
```

Changing any source block used by a recipe changes its fingerprint. Regenerate
the packet and review whether the procedural template also needs a semantic
update. The fingerprint catches source drift; human review decides whether the
meaning changed.

Block `0` is the document preamble, so a version, status, or verification-date
edit in a book header changes the `master.0`, `ui.0`, or `backend.0` fingerprint
and re-stales every recipe that consumes it. Finish every guide edit first, then
regenerate once, then run check mode. Regenerating between guide edits only
repeats the drift.

## Adding a packet or recipe

1. Add a template under `templates/` using the `PLAN-*`, `PHASE-*`, or `RECIPE-*` prefix.
2. Add one manifest entry with the exact source-block dependency closure.
3. Use one approved reference per UI shape. Add a second reference only when the
   task genuinely contains a second shape.
4. Write the template as a linear implementation sequence.
5. Use visible placeholders such as `{{Feature}}` and `{{feature}}`.
6. Do not include deprecated examples or abbreviated code.
7. Add a complete validation and handoff checklist.
8. Generate the packet and run check mode.

## Governance

- The Master Guide and books are authoritative when a packet and source block
  disagree.
- A packet must include every cross-cutting dependency needed to finish its
  bounded review or implementation task.
- Deprecated examples remain in the books for human understanding but are not
  copied into generation templates.
- Recipes carry source fingerprints and a generated-file warning.
- Source block `0` is the file `00-preamble.md`: the whole document preamble
  before `## 1.`, including the unnumbered authority, status, and reference
  tables. Use it when a packet depends on those tables.
- Reconcile manifest `approvedReferences` against the canonical per-shape
  reference tables whenever those tables change. Fingerprints prove that a
  packet saw a changed source block; they cannot prove that a separately stored
  manifest reference still has the correct semantic role.
- Packet templates are reviewed whenever a referenced block changes.
- The pilot should be evaluated against full-book and dependency-retrieval
  baselines before more recipe families are added.
