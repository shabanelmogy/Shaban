# Sigma — mandatory agent entry point

Last routing update: 2026-11-19. This is the entry for Codex, Claude,
Gemini/Antigravity, Kiro and WorkBuddy; project and folder pointers point here.

## Read before Sigma work

**Read the core of [.agents/SIGMA_WORKFLOW_RULES.md](.agents/SIGMA_WORKFLOW_RULES.md)
completely before reviewing, planning, creating, fixing or implementing Sigma
work.** It owns the single authority order, task modes and commands,
permissions, evidence gates and the minimum handoff. Its section files under
`.agents/workflow/` are read only when the task reaches them, as its table says.
Read it with a file tool; do not assume automatic discovery loaded it. If it is
unavailable, report the exact missing file and stop dependent work instead of
guessing permissions.

## Critical execution boundaries (summary; companion §4 owns them)

- Current Sigma data is experimental: build the correct clean-start model, with
  no compatibility paths for old experimental rows (Master1). Scoped reads,
  writes, repairs and experimental-duplicate deletion in verified Sigma
  development/test databases need no repeated permission; production,
  out-of-project databases, full reset and database drop do.
- An unqualified review/audit is source-read-only (review artifacts allowed). A
  plan stops at the plan; a named phase executes only that phase.
- Implement/fix/refactor authorizes the confirmed in-scope work through contract
  freeze, implementation, scoped build, affected tests and changed-file lint,
  reconciliation and the in-app screen guide, including the scoped EF migration
  on the verified experimental database. Pause only the slice that depends on an
  exact missing material decision.
- Full test suites, browser/application verification, commits, pushes and
  deployments need an explicit request. Skills grant no extra permission.
- Never: the Sigma MCP server, full-solution scans, unrelated refactors,
  overwriting user/peer work, editing generated packets, automatic Graphify, or
  reading any copy of the retired `SIGMA_FRONTEND_REVIEW_GUIDE.md` /
  `SIGMA_BACKEND_REVIEW_GUIDE.md`.

## Task routing

Documentation root: `F:\My Work\Shaban Documents\Shaban\sigma-erp`.

1. Choose Master1's tier (S/M/L) and the actual shape from `ui/screens/`; give
   the tier-scaled opening disclosure (companion §3).
2. Find the feature's existing artifacts by name — `reviews/**/<FEATURE>_*.md` —
   instead of reading the whole review index; read `<FEATURE>_CURRENT_STATE.md`
   first when it exists, then only the needed sections of the full review.
3. For screen/API work apply
   [.agents/skills/sigma-screen-refactor/SKILL.md](.agents/skills/sigma-screen-refactor/SKILL.md):
   its gate checklist and only the canonical blocks its table routes to.
4. Run the packet drift check before using a generated packet:

```powershell
& 'F:\My Work\Shaban Documents\Shaban\sigma-erp\recipe-system\Generate-SigmaRecipes.ps1' -Check
```

5. Hand off per companion §7: scoped diff per repository, and source, build,
   tests/lint and pending runtime results reported separately.

## Skills, delegation and maintenance

Process skills such as Superpowers may assist within project authority. Delegate
only under `.agents/workflow/delegation.md`. One rule has one owner; other files
point to it. Maintenance rules and the learning protocol are in companion §9.

In Arabic, start paragraphs/list items with Arabic text and keep paths and
identifiers on separate lines (companion §8).
