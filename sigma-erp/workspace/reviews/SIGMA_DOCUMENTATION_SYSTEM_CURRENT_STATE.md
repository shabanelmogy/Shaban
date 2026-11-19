# Documentation and instruction system — current state

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Last recorded round | 2026-11-19, documentation audit fixes and D7 preparation |
| Full record | [SIGMA_DOCUMENTATION_SYSTEM_AUDIT.md](SIGMA_DOCUMENTATION_SYSTEM_AUDIT.md) (audits 1–8 then later rounds, newest at the bottom) |

Read this first. Older audits are history; do not read them to execute a new task.

## Current structure

- Entry `AGENTS.md`, then the companion core; `.agents/workflow/` sections are read only when needed.
- One authority order (companion section 1); one owner per rule (Master8).
- The skill is a gate checklist and pointer table with section references and five revision rows; its full history is in the documentation archive.
- `reviews/INDEX.md` is a short English table; feature files are found by name; large reviews have a `_CURRENT_STATE.md` (hand-written or generated index).
- Large blocks keep their numbers with `NN/` topic folders (UI1, UI2, UI6, UI7, UI13, UI14, UI20, UI22, UI24, BE15, BE18), fingerprinted with their block.
- Agent-facing files are English; replies to the owner are Arabic.
- Scoped tests and changed-file lint are allowed during authorized implementation (Master5).
- `Check-BookReferences.ps1` enforces size budgets and table structure, reports duplicates, and warns for large blocks and reviews.

## Latest implementation

- The Arabic Verify command points to the live command and permission owner. The Master index uses an existing block.
- The reference checker includes public entry pages, book indexes and the active review index. It checks local heading fragments. A scoped fixture verifies diagnostics for a bad block, a missing file and two missing headings.
- The [currency entry](CURRENCY_CURRENT_STATE.md) now records governing contracts, source-only evidence and outstanding acceptance.

## Pending

- Try a real tier S and tier M task with the new instructions.
- Complete [D7 cutover](SIGMA_DOCUMENTATION_SYSTEM_VERSION_CONTROL_HANDOFF.md) after the owner records the existing documentation baseline.
- Continue replacing generated indexes when their feature is next touched. The currency example has been converted.

## Useful sections in the full record

- Documentation audit fixes and D7 preparation — 2026-11-19

- Documentation usability and command consistency audit — 2026-11-19

- مراجعة السرعة وتفادي الأخطاء وتنفيذها — ٢٠٢٦-١١-١٩
- تخفيف استهلاك التوكنز في الوثائق — ٢٠٢٦-١١-١٩
- Block split, English files and generated current-state indexes — 2026-11-19
- Topic folders for the remaining eight blocks — 2026-11-19
