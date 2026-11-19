# Individual Is International — checkbox style

| Field | Value |
|---|---|
| Date | 2026-10-01 |
| Contract | Frozen: match the canonical editor checkbox style |
| Implementation | Complete; source-only |
| Owner verification pending | yes |

The shared editable-table checkbox selector previously set only vertical margin;
the editor checkbox field uses a 15px box and sigma-primary accent. The table now
reuses those values in its own shared stylesheet, preserving row alignment.
Individual Is International and other direct checkbox cells inherit the rule;
no local feature CSS or new checkbox component. Native checked/disabled semantics
and existing accessible labels/form binding remain.

Application file changed: shared editable-collection-table component SCSS.
Canonical UI 1.17/block 14, changelog and skill updated together. Existing UI type
03/Backend Pattern 2 remain; no API, payload, validation, calculation, translation
or schema change, no migration. Prior user edits preserved. No subagents needed.

Applied source discovery/frozen presentation, shared detail styling and source
reconciliation; backend/grid/domain-action phases inapplicable. Generated packets
remain stale: canonical books used; regeneration/semantic review pending.
No build, test, lint, browser/runtime, database, migration, commit or deployment
run. Owner checks checked/unchecked and disabled View states in light/dark.

Suggested frontend commit: `style(forms): align editable checkbox accent`.
Suggested documentation commit: `docs(ui): record editable checkbox styling`.
