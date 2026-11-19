# MOVEMENTS discard-freeze final reconciliation

| Status | Owner verification pending |
|---|---|
| Implemented — source-only | yes |

## Reconciled scope

The six movement editors now use the shared `freezeFormState` restoration owner
inside deferred discard confirmations with captured identity, visibility and
busy checks. Collection, Delivery and Custody close subscriptions are tied to
the editor lifetime. Workshop Movement keeps upload and cleanup gates intact;
Check Card file and target controls preserve their prior disabled state during
the document discard decision. Existing lists, routes, DTOs, services,
translations and backend contracts were preserved.

The Movements UserGuide section was added to the existing reader with bilingual
topics for Collection, Delivery, Custody, Workshop, Workshop Movement, NRM and
Movement Log workflows.

## Verification

| Check | Result |
|---|---|
| Recipe drift check | Passed for PLAN-00 and phases 00–06 on 2026-10-09. |
| Scoped source diff | Reviewed across the eight changed tracked files and new guide content. |
| Whitespace | `git diff --check` passed; line-ending notices are repository normalization warnings. |
| Static contract search | No new `toISOString`, `p-table`, `ms-lib`, `subscriptionId` or `window.print` under Movements. |
| Build, runtime, browser, database and owner visual acceptance | Pending by instruction. |

## Decisions and boundaries

No screenshot evidence or new business decision was supplied. No backend change,
migration, permission rule, accounting effect, lifecycle action or API shape was
invented. No prohibited command was run.

Suggested frontend commit: `fix(movements): preserve editor state during discard decisions`.

## Owner compiler-feedback repair — 2026-10-09

Owner-provided build output reports six TS2367 comparisons and five TS2741 missing
GuideTopic.notes properties. Applied the frozen repair in exactly four source files:
NRM, Workshop and WorkshopMovement details.component.ts, and movements-guide.ts.
Removed six comparisons of captured mode with view: the early View return already
narrows it to create/edit, while the live this.mode/identity checks remain intact.
Added notes: [] to Delivery, Custody, WorkshopMovement, NRM and MovementLog topics;
kept notes required in the shared model and retained authored bilingual content.
No business action, persistence, route, payload, upload or cleanup change.

Reference reconciliation: UI10 same-editor freeze/cancel semantics remain matched
to collectionMovement.canDeactivate and freezeFormState. Master7/UI1 guide content
now supplies every required GuideTopic property, without casts or weakening the
public type. The preceding topic inventory is corrected by actual source: the
guide currently contains six topics (Collection, Delivery, Custody,
WorkshopMovement, NRM, MovementLog), not a separate Workshop master topic.
Existing reader/menu route /UserGuide/movements is retained.

Source checks: all four changed TS files parse without syntax errors; AST scan
finds no captured-mode/view comparison in the three guards, and verifies the early
View exit, live-mode identity checks and shared freeze helper. All six guide topics
supply the required fields. Complete scoped tracked diff/new guide source reviewed;
git diff --check passes. Initial/final recipe -Check passes all eight packets;
no book/template/manifest change required regeneration. These are source facts,
not proof of a successful application compilation; owner rerun remains pending.

Discovery/frozen repair, focused frontend correction and final source reconciliation
applied. Backend/migration/other feature phases skipped because diagnostics do not
touch their contracts. No subagent needed for this small four-file repair.
Unrelated pending changes preserved; no build/test/lint/runtime/browser/database/
migration/snapshot/commit/push/deploy or other prohibited action was performed.
No migration is required. Suggested frontend commit for this repair only:
`fix(movements): resolve discard guard and guide type errors`.

Owner acceptance: rerun the application build; check dirty/pristine/View close
and canceled discard in NRM/Workshop/WorkshopMovement, including upload cleanup;
read the Movements guide in EN/AR. Status remains Implemented — source-only and
Owner verification pending remains yes.

