# Individual Documents — error focus scroll boundary

| Field | Value |
|---|---|
| Date | 2026-10-01 |
| Contract | Frozen: error navigation reveals/focuses the field without moving the outer editor |
| Implementation | Complete; source-only |
| Owner verification pending | yes |
| Shape | Existing UI type 03 and shared focusField; Backend Pattern 2 unchanged |

The owner reports document-step components lifting on error-badge clicks. Source
shows the badge activates its step without resetting scroll, then `focusField`
calls unrestricted `scrollIntoView`. This can scroll clipped (`overflow: hidden`)
ancestors as well as the content/table region. That source-backed path explains
the reported motion; owner runtime reproduction is still required after the fix.

Changed application file: `shared/utils/focus-field.ts`. The shared helper now
reveals a field through actual auto/scroll regions with overflow, keeps already
visible fields stationary, stops at the editor/dialog shell, skips body/document
roots and hidden layout containers,
accounts for pending nested scroll deltas, and supports negative RTL horizontal
scroll offsets. Existing preventScroll focus and dropdown/calendar opening remain.
No feature workaround, table layout change or new helper framework.

Direct consumers reviewed: Individual details, Company details and nested Driver
fields. Their call contracts remain unchanged. No new translation, API, backend,
payload, calculation or schema; no migration required. Prior user edits preserved.

Phases: discovery/frozen UI behavior, shared detail-focus correction, consumer
integration and source reconciliation. No grid/backend/domain-action phase needed.
No screenshots or open business decisions. Canonical UI 1.15 blocks 12/27,
changelog and skill updated together. Eight generated packets remain stale;
canonical sources used, generated files untouched; regeneration/semantic review
pending. No subagents: this is a small shared utility fix.

Owner checks: click visible document errors, offscreen rows and clipped horizontal
columns, repeating in RTL and narrow layouts; header/steps/footer must stay fixed.
Check dropdown/calendar opening and Company/nested Driver consumers. No build,
test, lint, browser/runtime, SQL, migration, commit or deployment run by the agent.

Suggested frontend commit: `fix(forms): contain invalid-field focus scrolling`.
Suggested documentation commit: `docs(ui): define error focus scroll boundaries`.

Source checks: scoped frontend/documentation diff whitespace checks passed (only
LF/CRLF notices in the frontend); the book/skill reference check passed. No runtime
success is claimed before the owner's reproduction.
