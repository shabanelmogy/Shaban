# Sigma Maintenance / Evolution Plan: Documentation Structure (Audit 3 follow-up)

| | |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Plan date | 2026-09-28 |
| Source audit | `SIGMA_DOCUMENTATION_SYSTEM_AUDIT.md`, "Audit 3" (findings A3-01 to A3-12, decisions E1 to E5) |
| Predecessor | `SIGMA_DOCUMENTATION_SYSTEM_MAINTENANCE_EVOLUTION_PLAN.md` (Frozen, historical; its S1 and S6 owner actions carry over here) |
| Scope | `F:\My Work\Shaban Documents\Shaban\sigma-erp\` (three guides, README, command reference, `recipe-system/`), root `AGENTS.md`, the skill, `reviews/` index. Documentation and tooling only; no application source |
| Boundaries | No build, test, lint, migration, database, browser, Graphify, commit, or push by the agent. Retired guide basenames are not opened or created |

## Owner decisions

| ID | Decision | Owner answer | Date |
|---|---|---|---|
| Baseline | Who commits the pending documentation change set before edits | **Owner commits first**; implementation starts after the owner confirms | 2026-09-28 |
| E1 | `sigma-erp.rar` | **Move to an archive folder outside `sigma-erp/`.** Untracking, credential rotation, and any history rewrite are owner actions | 2026-09-28 |
| E2 | Book file structure | **One file per block for all three guides** | 2026-09-28 |
| E3 | Conformance scanner | **Owner-run only**; not listed in `AGENTS.md` as an agent-permitted command | 2026-09-28 |
| E4 | Packet model | Not answered. Reviewer recommendation (a): normalise volatile header rows out of the block-0 hash and require a semantic-review line | **Pending owner confirmation**; slice S5 blocked |
| E5 | Size budgets (`AGENTS.md` about 10–12 KB, skill about 20 KB) | Not answered | **Pending owner confirmation**; slice S6 blocked |

## Frozen target structure (E2)

```text
sigma-erp/
├── README.md                      index; updated paths
├── CHANGELOG.md                   version history moved out of UI block 30 (A3-06)
├── SIGMA_FEATURE_REVIEW_MASTER.md  short index: status line + links to master/
├── SIGMA_UI_PATTERNS.md            short index: links to ui/
├── SIGMA_BACKEND_PATTERNS.md       short index: links to backend/
├── master/  00-preamble.md, 01-….md … 08-….md
├── ui/      00-preamble.md, 01-….md … 30-….md
├── backend/ 00-preamble.md, 01-….md … 19-….md
└── recipe-system/                  manifest books point to directories
```

Rules of the move:

1. **Pure move.** Block text is copied byte-for-byte, apart from line endings. The only content edit in the split slice is moving the UI change log (A3-06).
2. `NN-preamble.md` holds everything before `## 1.`: title, header table, and the unnumbered sections (authority order, document roles, reference per shape, pattern status, the six steps, the five patterns, contents). This closes A3-01, because those sections are now fingerprinted as block 0.
3. File name: two-digit block number plus a kebab-case slug of the heading. The block number stays the citation key ("UI block 17"), so existing citations in `AGENTS.md`, the skill, packets, and reviews remain valid.
4. The three original file names remain as short index files, so every existing path reference still resolves.

## Slices

| Slice | Outcome | Depends on | Status |
|---|---|---|---|
| S0 | Owner baseline commit of the 27 pending files | — | Owner action — waiting |
| S1 | Split the three guides per E2; move the UI change log to `CHANGELOG.md`; index files | S0 | Ready after S0 |
| S2 | Generator and manifest read block files; `-Check` covers block 0 fully (A3-01); ellipsis and duplicate checks kept | S1 | Ready after S0 |
| S3 | Move `sigma-erp.rar` to `Shaban/archive/` (E1); remove the stale `check.log` (A3-09); `.gitattributes` (A3-08); PHASE-02 routed-variant exception (A3-12); README and `recipe-system/README.md` paths | S0 | Ready after S0 |
| S4 | Owner-run read-only conformance scanner under `sigma-erp/conformance/` (E3) | S0 | Ready after S0 |
| S5 | Header normalisation and semantic-review line in the generator (E4) | S2, E4 | Blocked on E4 |
| S6 | Trim `AGENTS.md` and the skill to budget (A3-03, A3-11) | E5 | Blocked on E5 |
| S7 | Owner regenerates packets once, runs `-Check`, reads PHASE-02 and PHASE-03 | S1, S2, (S5) | Owner action |
| S8 | `reviews/INDEX.md`; remove `reviews/_backup_2026-09-28/` once `reviews/` is versioned (A3-10) | D7 move | Index ready; backup removal waits for D7 |

## Owner decision added during implementation

| ID | Decision | Owner answer | Date |
|---|---|---|---|
| E6 | UI patterns by screen type | Owner: "I want UI patterns for the screen types", plus an illustrated guide. Implemented as a navigation layer `ui/screens/` (catalog + seven screen files) that adds no rule and cites the owning blocks; the illustrated guide is a private artifact, not a canonical file | 2026-09-28 |

## Implementation record — 2026-09-28

Baseline: owner commit `8cae5e6`; owner moved `sigma-erp.rar` out of the folder.

| Slice | Status | Files | Evidence |
|---|---|---|---|
| S1 Split | Implemented — source-only | `master/` (9 files), `ui/` (31), `backend/` (20); the three `SIGMA_*.md` are now index files; `CHANGELOG.md` | Concatenating each directory in order was byte-identical to the pre-split file (`cmp`). Only edits: Contents anchor links repointed to block files; UI change log moved from block 30 to `CHANGELOG.md` |
| S2 Generator | Implemented — source-only | `Generate-SigmaRecipes.ps1` (schema 4, reads `NN-*.md`, rejects duplicate block files), `recipe-manifest.json` (`dir` per book) | Read-only `-Check` resolves every block; all 8 packets stale as expected. Of 58 referenced blocks, 39 hash identically to the current packets; the 19 that differ are block 0 ×3 (now includes the unnumbered sections, A3-01), UI 30 (change log removed), and the blocks edited earlier the same day by the predecessor plan |
| S3 Hygiene | Implemented — source-only | `.gitattributes` (in `sigma-erp/` only), `check.log` deleted, PHASE-02 template routed-editor exception, `README.md`, `recipe-system/README.md` | — |
| E6 Screens | Implemented — source-only | `ui/screens/00-catalog.md` … `07-report.md`; one pointer paragraph in root `AGENTS.md` | Every screen file cites existing blocks and approved references only |
| S4 Scanner | Not started | — | Next |
| S5, S6 | Blocked on E4, E5 | — | — |
| S7 Regenerate | Implemented — source-only (owner request 2026-09-28) | All 8 generated packets; `PHASE-03-detail-write.template.md` (one gate line for `[contentPadded]`, UI block 13) | Generator run, then `-Check`: 8 × OK. Semantic read of the packet diff: apart from fingerprints, only the template lines already aligned with the current books (container-fill, no page scroll, calendar rules, routed-editor exception) and the new `[contentPadded]` gate changed |
| S8 Index | Not started | — | Next |

| E7 Screenshot-backed scope | Implemented — source-only | `master/02-screenshot-and-visual-evidence-policy.md` (new section; Master 1.8), `CHANGELOG.md`, skill §1.1 rule 6 + history row, `ui/screens/00-catalog.md`, `SIGMA_COMMAND_REFERENCE_AR.md` §30, root `AGENTS.md` (one clause) | Owner request 2026-09-28 after the gap review: a request that places a screenshot's missing business in scope approves existence, label, and workflow position of Explicit items; details stay Missing |

Git will show the split as deletions from the three index files plus new
directories rather than as renames; review it with `git diff --stat` and the
lossless check above.

## Verification

| Check | Method | Owner |
|---|---|---|
| Split is lossless | Concatenate block files in order and compare with the pre-split file (line-ending normalised) | Agent |
| Every block reachable | Generator resolves every manifest source | Agent (read-only `-Check`, which reports stale until S7) |
| No rule text changed | `git diff --stat` after S0 shows moves plus the change-log move only | Owner |
| Packets current | `Generate-SigmaRecipes.ps1`, then `-Check` | Owner |
