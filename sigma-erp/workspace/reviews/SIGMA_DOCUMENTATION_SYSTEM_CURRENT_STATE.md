# Documentation and instruction system — current state

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Last recorded round | 2026-11-19, D7 version-control cutover and restoration check |
| Full record | [SIGMA_DOCUMENTATION_SYSTEM_AUDIT.md](SIGMA_DOCUMENTATION_SYSTEM_AUDIT.md) (audits 1–8 then later rounds, newest at the bottom) |

Read this first. Older audits are history; do not read them to execute a new task.

## Current structure

- Entry `AGENTS.md`, then the companion core; `.agents/workflow/` sections are read only when needed.
- One authority order (companion section 1); one owner per rule (Master8).
- The skill is a gate checklist and pointer table with section references and five revision rows; its full history is in the documentation archive.
- `reviews/INDEX.md` is a short English table; feature files are found by name; large reviews have a `_CURRENT_STATE.md` (hand-written or generated index).
- Large blocks keep their numbers with `NN/` topic folders (Master5, UI1, UI2, UI4, UI6, UI7, UI13, UI14, UI16, UI17, UI18, UI19, UI20, UI22, UI24, BE14, BE15, BE18), fingerprinted with their block; the screen catalog routes to topic files.
- Agent-facing files are English; replies to the owner are Arabic.
- Scoped tests and changed-file lint are allowed during authorized implementation (Master5).
- `Check-BookReferences.ps1` enforces size budgets and table structure, reports duplicates, and warns for large blocks and reviews.

## Latest implementation

- The Shaban documentation repository owns the five workspace entries under `sigma-erp/workspace/`. The original live paths link there. All 2,203 files retrieved from transfer commit `c008a2a8` matched the original SHA-256 manifest. See the [cutover record](SIGMA_DOCUMENTATION_SYSTEM_VERSION_CONTROL_HANDOFF.md).

- The Arabic Verify command points to the live command and permission owner. The Master index uses an existing block.
- The reference checker includes public entry pages, book indexes and the active review index. It checks local heading fragments. A scoped fixture verifies diagnostics for a bad block, a missing file and two missing headings.
- The [currency entry](CURRENCY_CURRENT_STATE.md) now records governing contracts, source-only evidence and outstanding acceptance.

- Comprehensive review fixes (2026-11-20): `.gitignore` for build output, `New-CurrentStateIndexes.ps1` with a standard status table, current-state status check in `Check-BookReferences.ps1`, UI20 permission wording, Arabic README reading model.

- Topic-level routing and checklist templates (2026-11-20): screen files and the catalog route to topic files; packet templates name owners instead of restating rules; Master5 and BE14 topic folders.

## Pending


- Try a real tier S and tier M task with the new instructions.
- Continue replacing generated indexes when their feature is next touched. The currency example has been converted.

## Useful sections in the full record

- D7 local cutover and Git recovery — 2026-11-19

- Documentation audit fixes and D7 preparation — 2026-11-19

- Documentation usability and command consistency audit — 2026-11-19

- مراجعة السرعة وتفادي الأخطاء وتنفيذها — ٢٠٢٦-١١-١٩
- تخفيف استهلاك التوكنز في الوثائق — ٢٠٢٦-١١-١٩
- Block split, English files and generated current-state indexes — 2026-11-19
- Topic folders for the remaining eight blocks — 2026-11-19
