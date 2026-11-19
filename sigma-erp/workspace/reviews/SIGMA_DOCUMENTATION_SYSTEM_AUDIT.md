# Sigma Documentation System Audit

Volatile audit record. The rules themselves live in `AGENTS.md` and in the
canonical guides; this file records only what was checked and when, so the
instruction files stay free of data that goes stale.

| | |
|---|---|
| Audit date | 2026-09-21 |
| Scope | `AGENTS.md`, `PROJECT_MAP.md`, the two folder-level `AGENTS.md` files, the three canonical guides, the generated packets |
| Method | file inspection and path resolution only — no build, test, migration, database, or browser run |

## 1. Retired guide copies

`AGENTS.md` bans the two retired basenames in every location. This is the check
result behind that ban.

| Basename | Location checked | Result |
|---|---|---|
| `SIGMA_FRONTEND_REVIEW_GUIDE.md` | `F:\My Work\Sigma\reviews\` | NOT PRESENT |
| `SIGMA_BACKEND_REVIEW_GUIDE.md` | `F:\My Work\Sigma\reviews\` | NOT PRESENT |
| `SIGMA_FRONTEND_REVIEW_GUIDE.md` | `F:\My Work\Shaban Documents\Shaban\sigma-erp\` | NOT PRESENT |
| `SIGMA_BACKEND_REVIEW_GUIDE.md` | `F:\My Work\Shaban Documents\Shaban\sigma-erp\` | NOT PRESENT |

A search across `F:\My Work` to depth 6 returned no copy at any other location.

## 2. Canonical guide versions at audit time

| Guide | Version | Last verified |
|---|---|---|
| `SIGMA_FEATURE_REVIEW_MASTER.md` | 1.6 | 2026-09-20 |
| `SIGMA_UI_PATTERNS.md` | 0.60 | 2026-09-20 |
| `SIGMA_BACKEND_PATTERNS.md` | 0.16 — Draft canonical | 2026-09-17 |

## 3. Generated packet inventory

Present at audit time:

```text
PLAN-00-maintenance-evolution.md
PHASE-00-discovery-evidence.md
PHASE-01-domain-api.md
PHASE-02-read-grid.md
PHASE-03-detail-write.md
PHASE-04-domain-actions.md
PHASE-05-integration-runtime.md
PHASE-06-final-reconciliation.md
```

`Generate-SigmaRecipes.ps1` is present at
`F:\My Work\Shaban Documents\Shaban\sigma-erp\recipe-system\`.

## 4. Path resolution findings

| Finding | Detail | Status |
|---|---|---|
| Workspace root is not a Git repository | `F:\My Work\Sigma\.git` exists but is an empty directory | Confirmed |
| Application repositories | `F:\My Work\Sigma\SiGmaAngularFrontEnd` and `F:\My Work\Sigma\SigmaBackend` are separate repositories | Confirmed |
| Historical stale path | `F:\Sigma\...` does not exist. 17 occurrences remain in `reviews\*.md` and are left unchanged as historical records | Recorded |
| Root cause of the stale path | The Codex environment was configured for `F:\Sigma` while the project actually lives at `F:\My Work\Sigma`. The instruction files inherited the tooling path. See section 9 | Confirmed |
| Artifacts are unversioned | `F:\My Work\Sigma\reviews\` sits outside both repositories | Open decision |

## 5. Instruction-file findings closed on 2026-09-21

| # | Finding | Resolution |
|---|---|---|
| 1 | `F:\Sigma\...` paths in `AGENTS.md`, `PROJECT_MAP.md`, and both folder-level files | Corrected to `F:\My Work\Sigma\...` |
| 2 | Retired-copy list pointed at four nonexistent paths | Replaced by a basename ban plus this audit record |
| 3 | `PLAN-00` absent from the packet table | Row added; planning-only scope stated |
| 4 | `SIGMA_COMMAND_REFERENCE_AR.md` unreferenced | Classified as non-canonical quick reference with no authority of its own |
| 5 | No Arabic trigger aliases | Command vocabulary table added, English and Arabic |
| 6 | No artifact location or naming convention | Output artifacts section added |
| 7 | Page-title rule duplicated in the frontend folder file | Moved to `SIGMA_UI_PATTERNS.md` block 3 (v0.60); both `AGENTS.md` files now point to it |
| 8 | `Feature Review end-to-end` did not state whether it authorises edits | Stated as read-only; implementation requires the implement phrasing and a Frozen contract |
| 9 | Unmatched-command rule over-broad | Narrowed to unqualified Sigma feature review requests; ordinary questions excluded |
| 10 | `Verify` conflicted with the build and test prohibition | Stated as source-only unless the user authorises build, test, runtime, database, or browser verification |
| 11 | `read-only` did not say whether artifacts may be written | Defined as **source-read-only**: no application source, configuration, or instruction file changes; review artifacts under `reviews\` are permitted and expected. A no-write request is a separate explicit instruction, satisfied in the reply instead |
| 12 | The Arabic command reference did not state the read-only and source-only boundaries | Mandatory notes added to the command table, to section 2, and to the execution rule. The file stays a non-canonical quick reference |
| 13 | The UI book header could not distinguish a content change from a full re-verification | `Last content change` row added. `Last verified against source` stays 2026-09-20 because no full re-verification of the book was performed |

## 6. Packet regeneration — 2026-09-21

The 2026-09-21 edits to `SIGMA_UI_PATTERNS.md` made the generated packets stale.
Two changes caused it: the version and header row edit in the preamble, which is
block `0`, and the block 3 title-inset rule.

| Recipe | UI sources | Effect |
|---|---|---|
| `phase-01-domain-api` | none | never stale |
| `phase-02-read-grid` | includes `ui:0` and `ui:3` | only recipe carrying the block 3 change |
| `plan-00`, `phase-00`, `phase-03` … `phase-06` | include `ui:0` | stale from the preamble edit |

Commands run, in this order:

```powershell
& 'F:\My Work\Shaban Documents\Shaban\sigma-erp\recipe-system\Generate-SigmaRecipes.ps1'
& 'F:\My Work\Shaban Documents\Shaban\sigma-erp\recipe-system\Generate-SigmaRecipes.ps1' -Check
```

`-Check` result after regeneration: all eight recipes report `OK`.

Semantic diff against the pre-regeneration copies:

| File | Changed lines | What changed |
|---|---|---|
| `PHASE-01-domain-api.md` | 0 | unchanged |
| `PHASE-02-read-grid.md` | 2 | the `ui.0` and `ui.3` fingerprints |
| `plan-00` and every other phase packet | 1 each | the `ui.0` fingerprint |

No instruction text, phase ownership, gate, or artifact requirement changed in
any packet. The packets record provenance fingerprints only and do not inline
guide prose, so the block 3 rule reaches `PHASE-02-read-grid.md` as a fingerprint
and a reader must open block 3 of the UI book to read it.

Ordering rule recorded in `recipe-system/README.md`: because block `0` is the
preamble, any header edit re-stales every recipe consuming `ui:0`. Finish all
guide edits, regenerate once, then check.

## 7. Working-tree state in the documentation repository

The documentation repository root is `F:\My Work\Shaban Documents\Shaban`. It
holds a large uncommitted change set that predates this audit and is not part of
it.

| Measure | Value |
|---|---|
| Files changed against `HEAD` | 20 |
| Lines changed | 721 insertions, 251 deletions |
| Last commit | `97c7a61 update` |

The change set covers `SIGMA_FEATURE_REVIEW_MASTER.md`,
`SIGMA_UI_PATTERNS.md`, `Generate-SigmaRecipes.ps1`, `recipe-manifest.json`,
every template, and every generated packet. `SIGMA_COMMAND_REFERENCE_AR.md` and
`sigma-erp/README.md` are untracked.

Of the 38 diff hunks in `SIGMA_UI_PATTERNS.md`, three are from the 2026-09-21
edit: the header rows, the block 3 title-inset rule, and the block 3 check line.
The other 35 predate it.

Two consequences:

- **Isolating a new change.** `git diff` in this repository mixes pre-existing
  work with any new edit. Copy the affected files before editing and diff against
  that copy, which is how the packet regeneration below was isolated.
- **Why the packets were only partly stale.** The working-tree packets had
  already been regenerated against the current working-tree books and manifest.
  That is why `phase-01` passed check mode before the UI book edit while every
  packet still differed from `HEAD`.

Open risk: the pre-existing template and packet content changes were not
semantically reviewed in this audit. Check mode proves they match the manifest;
it cannot prove the templates still describe the referenced blocks correctly.

## 8. Codex environment workspace root — 2026-09-21

The dead path in the instruction files did not originate in the documentation.
It came from the tooling: the Codex environment was configured for `F:\Sigma`
while the project lives at `F:\My Work\Sigma`, and the instruction files were
written against the tooling path. That is the root cause of every `F:\Sigma`
finding in this audit, including the 17 historical occurrences in `reviews\*.md`.

Where the path was pinned:

| Location | Entry | Action |
|---|---|---|
| `C:\Users\user\.codex\config.toml` | `[projects.'f:\sigma']` | Removed. The correct entry `[projects.'f:\my work\sigma']` already existed, so repointing would have produced a duplicate TOML key |
| `C:\Users\user\.codex\config.toml` | `[projects.'f:\sigma\sigmaangularfrontend']` | Repointed to `[projects.'f:\my work\sigma\sigmaangularfrontend']` |
| `C:\Users\user\.codex\.codex-global-state.json` | `thread-workspace-state-v1:01a08c1a-…` carries `applied.cwd = F:\Sigma`, `projectSources = [F:\Sigma]`, and `runtimeWorkspaceRoots = [F:\Sigma, …]` | Not changed. See below |

Verified after the edit: `config.toml` parses as valid TOML, holds 11 project
entries, has no duplicate keys, and contains no `f:\sigma` entry. The pre-edit
content is preserved in the application's own `config.toml.bak`.

The global-state entry was left alone deliberately. Codex was running while this
audit ran and rewrites `.codex-global-state.json` continuously, so a direct edit
would be overwritten and would report a fix that had not taken effect. The
project registry itself is already correct: `local-projects` holds `Sigma` with
`rootPaths = ["F:\\My Work\\Sigma"]` and `selected-project` points at it. Only
that one old thread carries the stale applied working directory.

Reliable fixes, in order of preference:

1. Re-select the workspace folder for the affected thread in the Codex interface,
   or open a new thread in the `Sigma` project. The application then rewrites the
   thread state itself.
2. Close Codex, patch `applied.cwd`, `projectSources`, and `runtimeWorkspaceRoots`
   in that thread entry, then reopen.

`config.toml` may also be rewritten by the running application. Re-check it after
the next Codex restart.

## 9. Open decisions

| Decision | Needed from |
|---|---|
| Whether `reviews\` artifacts must be versioned, and if so in which repository | Owner |
| Whether the `reviews\*.md` files that still contain `F:\Sigma\...` should be corrected or left as historical records | Owner |
| Whether the nine review domains in `SIGMA_COMMAND_REFERENCE_AR.md` (report review, token path, success-toast ownership, scroll ownership, guide pinning, documentation-system review, and related) belong in the pattern books as review domains | Owner |
| Whether the old thread state in `.codex-global-state.json` should be patched while Codex is closed, or left to the interface to rewrite | Owner |

---

# Audit 2 — full documentation-system review — 2026-09-28

Sections 1–9 above are the 2026-09-21 record and are left unchanged. This
section records a second, wider pass.

| | |
|---|---|
| Audit date | 2026-09-28 |
| Requested as | "Analyse the project and review the documentation, skills, and every project file" — read-only on source; this artifact is the only file written |
| Scope | Root `AGENTS.md`, `GEMINI.md`, `PROJECT_MAP.md`; both folder-level `AGENTS.md`; `.agents/skills/sigma-screen-refactor/SKILL.md`; the three canonical guides; `SIGMA_COMMAND_REFERENCE_AR.md`; `sigma-erp/README.md`; the whole `recipe-system/` (manifest, generator, README, eight generated packets, templates); all 47 files under `reviews/`; tool folders (`.kiro`, `.codex`, `.qodo`, `.freebuff`, `.workbuddy-ai`, `.codex-temp`, `graphify-out`); both `.gitignore` files; the frontend deploy workflow |
| Not in scope | Application source. No full-solution scan was performed; claims about source are quoted from the guides, not re-verified |
| Method | File inspection only. No build, test, lint, migration, database, browser, Graphify, or Sigma MCP use |
| Tooling note | The device shell was unavailable, so `Generate-SigmaRecipes.ps1 -Check` could not be run. Its fingerprint step was re-implemented read-only (same block splitting, normalisation, and SHA-256) and run against the current guides — see A2-01 |

## A2.1 Guide versions at this audit

| Guide | Header version | Header date | File last modified | Change since audit 1 |
|---|---|---|---|---|
| `SIGMA_FEATURE_REVIEW_MASTER.md` | 1.6 | verified 2026-09-20 | 2026-09-20 | none |
| `SIGMA_UI_PATTERNS.md` | 0.68 — Draft canonical | verified 2026-09-21, content change 2026-09-21 | 2026-09-22 16:25 | 0.60 → 0.68 |
| `SIGMA_BACKEND_PATTERNS.md` | 0.16 — Draft canonical | verified 2026-09-17 | 2026-09-21 23:58 | file changed; header not |
| `AGENTS.md` (root) | — | reviewed 2026-09-24 | 2026-09-24 | updated |
| `SKILL.md` (sigma-screen-refactor) | — | last history row 2026-09-25 | 2026-09-25 18:35 | new entries 09-23 → 09-25 |
| `GEMINI.md` | — | — | 2026-09-23 | new |

## A2.2 Findings

Severity: **High** means an agent that follows the documentation as written
will produce code that the canonical book classifies as a defect or as debt.
**Medium** means an inconsistency or governance gap that causes wrong or
unpredictable behaviour. **Low** means hygiene.

### High

| ID | Finding | Evidence | Recommendation |
|---|---|---|---|
| A2-02 | **The skill contradicts the canonical UI book, and every screen task must read the skill.** Root `AGENTS.md` line 9 requires `SKILL.md` for *every* screen refactor. Several of its rules were written 2026-09-23 → 09-25, after UI book 0.68 (2026-09-22), and prescribe patterns that the book lists as debt. See A2-03 to A2-08 | `AGENTS.md:9`; `SKILL.md` history rows 09-23 → 09-25 | Put the skill in the authority order below the books (A2-09), then correct A2-03 to A2-08 in the skill. Until then, tell agents that the UI book wins on any conflict |
| A2-03 | **Page-height calc versus container-fill.** The skill mandates `:host { height: calc(100dvh - header - toolbar - footer - 12px) }` and repeats it in its checklist. The UI book forbids exactly this "second page-height calculation" and requires `height: 100%` | `SKILL.md:79-88`, `:548`; `SIGMA_UI_PATTERNS.md:387-413` | Replace skill §2.2 `:host` with the book's container-fill host; cite `Rental/RentalPlanner` and `Staff/designations` |
| A2-04 | **Feature paginator overrides.** Skill §4.1 tells features to write `::ng-deep` rules on `.p-datatable-wrapper` and `.p-paginator { padding: 6px 0 4px !important }`. The book forbids feature paginator and `.p-datatable-*` rules, and backlog 33 lists that exact value (Movements ×5) as debt to delete | `SKILL.md:273-302`, `:551`; `SIGMA_UI_PATTERNS.md:1474`, `:1628-1631`, backlog 33 | Remove the deep-override recipe. If `scrollHeight="flex"` grounding needs a capability, add it to `app-data-table` |
| A2-05 | **Calendar rules reversed.** (a) The skill's filter range picker sets `[showIcon]="true"` with no `iconDisplay`. The book says a filter calendar has no trigger icon, and `showIcon` alone renders nothing (backlog 32: 155 of 176 calendars). (b) The skill's editor calendar uses `[readonlyInput]="false"`; the book says `"true"` on detail and editor forms. (c) The skill mandates `[showOnFocus]="false"` plus `(click)="dateCal.showOverlay()"`; the book says keep `[showOnFocus]="true"` and use `[focusOnShow]="false"` on the dialog | `SKILL.md:221-223`, `:436-450`; `SIGMA_UI_PATTERNS.md:3277-3291`, `:3305-3315`, `:3346-3365`, `:3398-3410` | Align skill §3.3 and §7.6 with block 17. Keep `keepInvalid` only if the owner confirms it; the book does not cover it |
| A2-06 | **Backend transaction rule overstated.** Skill §8.1 says Pattern 3 "MUST" always run inside an explicit transaction. The book and `AGENTS.md` say to use an explicit transaction only for multi-save paths; a one-save branch uses EF Core's implicit transaction (`MiscellaneousInvoiceService.AddAsync` is the book's example) | `SKILL.md:484`; `SIGMA_BACKEND_PATTERNS.md:1380-1396`, `:1420`; `AGENTS.md` "Backend, mapping, and calculation rules" | Replace with a pointer to the "Explicit transaction boundary — Canonical" section (backend book, inside block 14, line 1380), which blocks 15 and 18 also apply |
| A2-07 | **Backend pattern count and status.** The skill says "4 Mandatory … Strictly Binding" patterns and calls Pattern 2 canonical. The book has five patterns, and Pattern 2 is **Transitional** because its reference has an FK-validation defect (backlog 3) | `SKILL.md:459-498`; `SIGMA_BACKEND_PATTERNS.md:52-62`, `:1182-1184` | Mirror the book's table and statuses. Do not restate the patterns in the skill |
| A2-08 | **Default page size.** The skill says `PageSize` defaults to 10; backend block 9 uses `?? 20`. The Work Order review followed the skill and shipped 10 | `SKILL.md:501`; `SIGMA_BACKEND_PATTERNS.md:814`, `:849`, `:1086`; `WORK_ORDER_FULL_STACK_REVIEW.md:75` | Use the book's value, or record 10 as a decision in the book |
| A2-09 | **The skill has no place in the authority order.** `AGENTS.md` lists five authority levels and never mentions the skill, yet it says the skill "owns screen-specific implementation conventions". The UI book calls itself "the single authority for Angular work"; the skill calls itself "the single operational playbook". Nothing defines which wins, which is how A2-03 to A2-08 arose | `AGENTS.md:9-11`, `:247-253`; `SIGMA_UI_PATTERNS.md` preamble; `SKILL.md:8` | Add the skill explicitly *below* the canonical books and packets, as a digest that may not introduce a rule absent from the books. Require any new rule to land in the book first |
| A2-10 | **The whole instruction layer is unversioned.** The workspace root is not a repository, so `AGENTS.md`, `GEMINI.md`, `PROJECT_MAP.md`, `.agents/` (the skill), and `reviews/` have no history. The backend `.gitignore` also ignores `.agents`, `.codex`, and `.kiro`. The documentation repository had 20 uncommitted files at audit 1 | root `.git` is an empty directory; `SigmaBackend/.gitignore:17-20`; audit 1 §7 | Make one repository own the instruction layer, either the documentation repository or a new `sigma-workspace` repository, and commit the pending documentation change set. Decide this before further skill or guide edits |

### Medium

| ID | Finding | Evidence | Recommendation |
|---|---|---|---|
| A2-11 | **GEMINI.md is a third, conflicting rulebook.** (a) It says to update `SKILL.md` "automatically" after every task; `AGENTS.md` allows only verified, reusable guidance. (b) Filter strip margin `0 8px 16px 8px` differs from both the book (6px bottom) and the skill (`0 0 6px 0`). (c) "Always extend `BaseComponentService`" does not appear in the UI book. (d) It cites "Section 8 Changelog"; the skill's history is §11 | `GEMINI.md:10`, `:12`, `:15-18`; `SKILL.md:569` | Reduce `GEMINI.md` to a pointer to `AGENTS.md`, as the folder-level files already do |
| A2-12 | **The UI book contradicts itself on filter-strip inline margin.** The text says the strip takes the title host's 8px inline margin; the canonical snippet writes `margin: 0 0 6px`. The skill copied both (§2.3 and §2.5) | `SIGMA_UI_PATTERNS.md:846-850`, `:911`, `:1366`; `SKILL.md:137`, `:165` | Fix the snippet to `margin: 0 8px 6px`, or change the text. Then regenerate packets once |
| A2-13 | **Feature-specific rules promoted into the general skill.** §2.5 (Job Estimation square corners, Lubrication Job fields), §4.5 (Job approval lifecycle), and the Workshop Job reference are feature decisions. `AGENTS.md:10` says these belong in the feature contract | `SKILL.md:163-166`, `:339-346` | Move them to `JOB_*` and `JOB_ESTIMATION_*` artifacts and keep only generic lessons |
| A2-14 | **Absolute prohibitions that exceed the contracts.** The skill says "NEVER create bespoke `Search…Async` or `[HttpPost("search")]`", but the Job Estimation review deliberately keeps its POST search "additive for external compatibility". "Never use `<input type="date">` anywhere" and "never track `$index`" are also not in the books. The `$index` reason looks inaccurate: Angular 17 control flow accepts `track $index`, so the TS2339 error probably had another cause | `SKILL.md:353`, `:518`; `JOB_ESTIMATION_FEATURE_REVIEW.md:13` | Label such rules "default; deviations recorded in the contract". Verify the `$index` claim with an owner build before keeping it |
| A2-15 | **Graphify runs automatically despite the ban.** Both `.codex/hooks.json` run `graphify.exe hook-check` before every Bash call. The folder-level `AGENTS.md` tell agents to use `graphify query` first for any codebase question and `graphify update .` after edits; the root bans automatic Graphify. The backend graph was last built 2026-09-20, so it is stale | `SigmaBackend/.codex/hooks.json`, `SiGmaAngularFrontEnd/.codex/hooks.json`; folder `AGENTS.md`; `graphify-out/` modification time | Decide once. Either remove the hook and the "query first" text, or allow Graphify for questions only and state that in the root file |
| A2-16 | **Per-tool memories diverge.** `.workbuddy-ai/memory/MEMORY.md` carries project rules that contradict themselves ("`box-sizing: border-box` is global" and "is not global"). Its paginator value (`10px 0 4px`) differs from the book (header: `12px`; backlog 33: "now `4px`"). The workspace has seven agent-tool footprints (`.agents`, `.codex`, `.kiro`, `.qodo`, `.freebuff`, `.workbuddy-ai`, `GEMINI.md`), each able to hold its own truth | `MEMORY.md` "Layout" and "Lessons learned" sections; `SIGMA_UI_PATTERNS.md:8`, backlog 33 | Treat tool memories as caches: a rule that matters goes to the book. Delete or refresh the contradictory lines |
| A2-17 | **Demo credentials in a canonical guide.** Master guide §2 contains a username and password for the external Speed Auto Systems tenant. It is labelled demo, but it is a third party's system in a document that will be versioned and shared | `SIGMA_FEATURE_REVIEW_MASTER.md:230-236` | Move the credentials to a local, uncommitted secrets note and reference them by name |
| A2-18 | **Review artifacts do not follow the naming and status rules.** (a) Names outside the defined set: `RENTAL_BOOKING_CREATE_REFACTOR_CONTRACT.md`, `RENTAL_NOTIFICATION_EVENTS_CASCADE_FIX.md`, `JOB_ESTIMATION_PHASE_01_DOMAIN_API.md`, `ACCOUNTING_SYSTEM_PORTABILITY_AND_IMPLEMENTATION_PLAN_AR.md`. (b) Lease Agreement is multi-part, but 12 of its 13 `LEASE_AGREEMENT_*` files sit at the root of `reviews/` and only one is under `reviews/LeaseAgreement/`. (c) Status wording is free text across all 47 files: `Completed & Source Verified` (Work Order) is not a Master status, and that report has no owner-pending verification list. (d) `STAFF_BACKEND_REVIEW.md` lives in the backend repository instead of `reviews/` | directory listing; status grep across `reviews/` | Add a fixed first-table `Status` row using the Master vocabulary (Frozen / Blocked / Implemented-source-only / Closed), plus `Owner verification pending: yes/no`. Move Lease files into their folder |
| A2-19 | **Parallel planning system.** The `.kiro/specs/sales-quotation-refactor` spec (about 225 KB of requirements, design, and tasks) and two backend Kiro specs predate the recipe system and sit outside it, next to `SALES_QUOTATION_FULL_STACK_REVIEW.md`. Neither references the other | `.kiro/specs/*`; `SigmaBackend/.kiro/specs/*` | Mark Kiro specs as historical, or link them from the matching review artifact |
| A2-20 | **Command reference is narrower than AGENTS.md.** The Arabic reference says implementation starts only with "implement the confirmed fixes" or "run review and refactor direct". `AGENTS.md` also authorises `Implement <feature>` / `نفذ <الميزة>` and any direct refactor, fix, or implement request | `SIGMA_COMMAND_REFERENCE_AR.md:29-30`; `AGENTS.md` command table | Add `Implement` to the note |

### Low

| ID | Finding | Evidence | Recommendation |
|---|---|---|---|
| A2-21 | Backlog ID **31** is used twice in the UI book (open P3 item and a resolved item), against its own "stable identifiers" rule | `SIGMA_UI_PATTERNS.md:5158`, `:5184` | Renumber the resolved one, for example `31r` or `34` |
| A2-22 | The UI book's `Last content change` cell is a single paragraph of about 3,000 characters. It works as a changelog but hides the version history, and it changes the `ui.0` fingerprint, so every packet goes stale on each edit | `SIGMA_UI_PATTERNS.md:8` | Keep the header to date and version; move narrative to a `CHANGELOG` section outside block 0 |
| A2-23 | Backend book file changed on 2026-09-21 but its header still says verified 2026-09-17, and it has no `Last content change` row | file time versus header | Add the row, as the UI book does |
| A2-24 | Status naming differs: the Master calls the books "canonical pattern books", the books call themselves "Draft canonical", and `.codex-temp/update_sigma_ui_guide.py` once tried to flip the UI book to "Canonical" at 0.58. The script is obsolete and would fail against 0.68 | `SIGMA_UI_PATTERNS.md:1-5`; `update_sigma_ui_guide.py` | Decide the label. Delete or archive the script |
| A2-25 | Packet templates restate book values (34px controls, 900/700px breakpoints, 16px/8px toolbar band). The fingerprint check cannot detect when these copies drift from the book | `PHASE-02-read-grid.md` Included concerns and Continuous gates | Keep numbers only in the books; templates should name the block |
| A2-26 | The Master guide defines a `RECIPE-*` packet family, but no `RECIPE-*` template or packet exists | Master §8; `recipe-manifest.json` | State "reserved, none yet" |
| A2-27 | `PROJECT_MAP.md` details only the Staff feature, and its endpoint table is not linked to a verification date | `PROJECT_MAP.md` §4 | Add a "verified on" line, or trim it to the generic map |
| A2-28 | The frontend deploy workflow publishes `master` to IIS over FTP on every push, while active work lives on `review-*` branches and `master` is noted as behind. This is not a documentation defect, but it is a release risk worth recording | `.github/workflows/deploy.yml`; `MEMORY.md` branch model | Owner decision |

## A2.3 Checks that passed

| Check | Result |
|---|---|
| A2-01 Packet fingerprints | 198 fingerprints across the 8 generated packets were recomputed from the current three guides: **0 stale**. This agrees with `.workbuddy-ai/recipe-check.log` (2026-09-22 16:26, all OK). `sigma-erp/recipe-system/check.log` is older and should not be cited |
| Block counts | UI book has blocks 1–30 and backend book 1–19, matching `AGENTS.md` |
| Manifest | `schemaVersion` 3 matches the generator; no duplicate IDs, outputs, or sources were found by inspection |
| Retired guides | `SIGMA_FRONTEND_REVIEW_GUIDE.md` and `SIGMA_BACKEND_REVIEW_GUIDE.md` are absent from `sigma-erp/` and `reviews/` (directory listings). A drive-wide search was not possible without the shell. Historical mentions remain in `FLEET_`, `SALES_QUOTATION_`, and `STAFF_FULL_STACK_REVIEW.md` |
| Stale `F:\Sigma\` paths | 17 occurrences in `reviews/` (14 in the accounting plan, 2 in the rental notification fix, 1 in the Staff review), unchanged since audit 1 |
| Folder-level `AGENTS.md` | Both correctly defer to the root for feature work |
| Master ↔ `AGENTS.md` | Phase model, artifacts, statuses, migration boundary, and prohibited commands agree |

## A2.4 Recommended order of work

1. **Decide the owning repository** for the instruction layer (A2-10) and commit the current state, so the changes below are diffable.
2. **Fix authority** (A2-09): add the skill to the authority order as a subordinate digest, and state "books win".
3. **Correct the skill** against the books (A2-03 to A2-08, A2-13, A2-14). Remove restated values and link to blocks instead.
4. **Collapse `GEMINI.md`** to a pointer (A2-11), and settle Graphify (A2-15).
5. **Fix the UI book snippet** (A2-12), the duplicate backlog ID (A2-21), and the headers (A2-22, A2-23). Then regenerate packets once and run `-Check`.
6. **Hygiene**: credentials (A2-17), artifact names and statuses (A2-18), Kiro specs (A2-19), and the command reference (A2-20).

## A2.5 Open decisions for the owner

| Decision | Blocks |
|---|---|
| Which repository owns `AGENTS.md`, the skill, and `reviews/` | A2-10 |
| Whether the skill may hold rules absent from the books | A2-09, A2-14 |
| Default page size: 10 or 20 | A2-08 |
| Graphify: remove, or allow for questions only | A2-15 |
| Whether to keep `keepInvalid` and the ban on native date inputs as canonical rules (then add them to block 17) | A2-05, A2-14 |
| The final label for the books: Draft canonical or Canonical | A2-24 |

---

# Audit 3 — system fitness review and target shape — 2026-09-28

| | |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Audit date | 2026-09-28 (after the same-day plan implementation record) |
| Requested as | "Review the `sigma-erp` system and reach the best shape for developing the project" — read-only on documentation and source; this section is the only file change |
| Scope | `sigma-erp/` (three guides, command reference, README, `recipe-system/` generator, manifest, templates, packets, `check.log`, `sigma-erp.rar`), the documentation repository's Git state, root `AGENTS.md`, `GEMINI.md`, both folder `AGENTS.md`, the skill, `reviews/` listing |
| Builds on | Audit 2 and `SIGMA_DOCUMENTATION_SYSTEM_MAINTENANCE_EVOLUTION_PLAN.md` (Frozen). Their findings are not repeated; this section verifies what was recorded as done and adds structural findings |
| Method | File inspection, one read-only `Generate-SigmaRecipes.ps1 -Check` run, and grep. No build, test, lint, migration, database, browser, Graphify, commit, or push. Retired guide basenames were not opened |

## A3.1 Verification of the 2026-09-28 implementation record

| Check | Result | Evidence |
|---|---|---|
| Packets (S6, owner action) | **All 8 stale** — expected until the owner regenerates. Until then every agent must use the canonical sources directly, as `AGENTS.md` requires | `-Check` run 2026-09-28: 8 × "Generated recipe is stale", exit 1 |
| `recipe-system/check.log` | Still reports 8 × `OK`. **Misleading**: it predates the book edits and has no timestamp | File content versus the live `-Check` result |
| Cross-file value consistency (S2–S4) | **Pass.** No `calc(100dvh` host rule, `[showIcon]="true"`, `[readonlyInput]="true"`, `[showOnFocus]="true"`, `margin: 0 0 6px`, `PageSize ?? 20`, or `graphify query` instruction remains in `AGENTS.md`, `GEMINI.md`, `PROJECT_MAP.md`, the skill, the three guides, the command reference, or the templates, except where named as forbidden | grep over those files |
| Authority order | **Pass.** `AGENTS.md`, Master "Authority order", `sigma-erp/README.md`, and the skill header agree: Master + books > packets > skill (digest) > reference > screenshots > inference | the four files |
| Guide headers | Master 1.7, UI 0.69, Backend 0.17, each with a 2026-09-28 content-change row | file headers |
| Version control (S1, owner action) | **Not done.** 21 tracked files modified and 6 untracked (`README.md`, `SIGMA_COMMAND_REFERENCE_AR.md`, `check.log`, the PLAN-00 packet and both PLAN-00/maintenance templates) since `97c7a61 update` (2026-09-20); 1,583 insertions and 390 deletions. The planning entry point PLAN-00 is not versioned at all | `git status`, `git diff --stat` in `F:\My Work\Shaban Documents\Shaban` |

## A3.2 Findings

### High

| ID | Finding | Evidence | Recommendation |
|---|---|---|---|
| A3-01 | **The drift check cannot see the most consequential sections.** The generator hashes block 0 as "everything before the first `##`" and block N as "`## N.` up to the next `##`". Unnumbered `##` sections therefore belong to no block: Master "Authority order", "Document roles", "Contents"; UI "Reference per shape", "Pattern status", "Contents"; Backend "The six steps", "The five patterns", "Contents". The authority order and the Canonical / Transitional / Legacy status tables can change while `-Check` stays green | `Generate-SigmaRecipes.ps1` `Get-SourceBlock`; `##` outline of the three guides | Change block 0 to "everything before `## 1.`" (one regex), or number those sections. Do this **before** the S6 regeneration so packets are regenerated once |
| A3-02 | **`sigma-erp.rar` is tracked in a repository with a GitHub remote.** The plan record says the rar and Git history still hold the removed third-party demo credentials. If `github.com/shabanelmogy/Shaban` is public or shared, they are exposed | `git ls-files sigma-erp` lists `sigma-erp/sigma-erp.rar`; merge commits name the remote; plan Implementation record S5 | Owner: confirm repository visibility; rotate the credentials with the third party; move the rar out of the canonical folder (and out of the repository if it holds nothing else of value). History rewriting is an owner decision |
| A3-03 | **The instruction load is too large for reliable agent use.** Instruction material totals about 551 KB (roughly 140k tokens). A screen task must read `AGENTS.md` (33 KB, loaded into every session, including plain questions), the skill (53 KB), the Master (47 KB), one packet (6–17 KB), and the cited book blocks from a 233 KB UI book. The "digest" skill is larger than the Master and about a quarter of the UI book, so it duplicates rather than digests. Long mandatory reads are where agents skim and miss rules | `wc -c` over the files | Set size budgets: `AGENTS.md` as a router of about 10–12 KB (move the document-content table, packet table, and model-routing section to `sigma-erp/README.md` or the Master); skill about 20 KB of one-line checklist rules with block citations, snippets only in the books |

### Medium

| ID | Finding | Evidence | Recommendation |
|---|---|---|---|
| A3-04 | **The `-Check` gate proves regeneration, not correctness.** Packets contain template prose plus hashes; they inline no book text. Every recipe consumes `master.0` and/or `ui.0`, so any header edit stales all eight, and regenerating turns them green with no semantic review recorded. The gate has become ceremony | Packet body (PHASE-02); manifest sources; Audit 1 §6 | Either (a) normalise volatile header rows (version, dates) out of the block-0 hash, and have the generator write a `Semantic review: <date/owner>` line that `-Check` requires; or (b) make packets content-carrying by inlining their block closure, so an agent reads one packet instead of three books and regeneration has real meaning. Recommend (a) now, (b) with A3-05 |
| A3-05 | **Monolithic books with oversized, mixed-concern blocks.** UI block 4 is 595 lines, 20 is 515, 1 is 503, 13 is 489, 14 is 364. Block 1 "Feature folders and wiring" also owns scroll ownership, base component, shell insets, and the hierarchy tree, so a layout edit re-stales every consumer of wiring. The block is already the unit of ownership, citation, and hashing, but not of files | `##`/`###` outline of `SIGMA_UI_PATTERNS.md` | Decision E2 below |
| A3-06 | **The change log lives inside UI block 30.** Every content change appends a change-log row to block 30, re-staling PLAN-00 (which consumes `ui.30`) and mixing history with the backlog | `### Change log` at the end of block 30; manifest PLAN-00 sources | Move version history to a `sigma-erp/CHANGELOG.md` that no recipe fingerprints |
| A3-07 | **Rules are prose only; conformance is counted by hand.** The backlog relies on manual counts ("155 of 176 calendars", "34 feature stylesheets", "16 files") dated 2026-09-21. Many canonical rules are mechanically detectable: page-height calc, feature `.p-paginator` / `.p-datatable-*` overrides, `[showIcon]`, the colour forks, `track $index`, `ms-lib`, `PageSize ?? 20`, `[HttpPost("search")]`, `error: () => undefined` | UI backlog 32–35; skill §1 | Decision E3 below: an owner-run, read-only conformance script beside the generator that prints per-feature counts. It keeps backlog numbers current and gives Phase 6 an objective check |
| A3-08 | **Commit hygiene.** The last 15 commits are almost all titled "update"; no tag ties a commit to a guide version; there is no `.gitattributes`, so Git warns that LF becomes CRLF on every guide, adding diff noise | `git log`; `git diff` warnings | After S1: one descriptive commit per slice, tags such as `master-1.7_ui-0.69_be-0.17`, and `.gitattributes` with `*.md text eol=lf` and `*.ps1 text eol=crlf` |

### Low

| ID | Finding | Evidence | Recommendation |
|---|---|---|---|
| A3-09 | `check.log` is a stale, untimestamped result (see A3.1) | file | Delete it, or have the generator write it with date and exit status |
| A3-10 | `reviews/` has 48 entries and no index; `_backup_2026-09-28/` now lives inside it. Once S1 versions the folder, backups are redundant | directory listing | Add `reviews/INDEX.md`: feature → artifacts → `Status` → `Owner verification pending`. Remove the backup after the S1 baseline commit |
| A3-11 | `AGENTS.md` is described as tool-neutral but carries model-specific routing (`gpt-5.6-luna/terra/sol`) that only one tool can act on | `AGENTS.md` "Agent and model routing" | Keep the role names; move model mapping to the tool's own configuration |
| A3-12 | The PHASE-02 template says Phase 2 "does not create a second editor component or editor route" without the exception UI block 13 grants to the approved routed full-page variant (used by Job Estimation) | `PHASE-02-read-grid.template.md:40-41`; UI block 13 "Routed full-page detail form" | Add "unless the frozen contract approves the routed variant (UI 13)" |

## A3.3 Target shape

The layering is sound and should be kept: one workflow entry point, canonical books, derived packets and skill, feature records, tool caches. The problems are size, check coverage, versioning, and enforcement. Proposed target:

```text
F:\My Work\Shaban Documents\Shaban            (one repository — D7)
├── sigma-erp/
│   ├── README.md              human index and router
│   ├── CHANGELOG.md           all version history; not fingerprinted (A3-06)
│   ├── SIGMA_FEATURE_REVIEW_MASTER.md
│   ├── ui/                    one file per block, stable IDs (E2, option B)
│   ├── backend/               one file per block (E2, option B)
│   ├── SIGMA_COMMAND_REFERENCE_AR.md
│   ├── recipe-system/         manifest by file; -Check covers every section (A3-01)
│   └── conformance/           read-only rule scanner + rules list (E3)
└── sigma-workspace/           AGENTS.md (router), GEMINI.md, PROJECT_MAP.md,
                               .agents/skills/, reviews/ + INDEX.md (D7 move)
```

| Layer | Owns | Size budget | Checked by |
|---|---|---|---|
| Entry (`AGENTS.md`) | Commands, scope, prohibitions, authority order, artifact rules | about 10–12 KB | Review |
| Canonical (Master, books) | Every rule, rationale, snippet, reference | Per block, prefer ≤ 250 lines | Owner review; conformance scanner |
| Derived (packets, skill) | Phase checklists; screen checklist | Packet ≤ 20 KB; skill about 20 KB | `-Check` (skill added per plan D0 option C) |
| Records (`reviews/`) | Feature decisions and evidence | — | `INDEX.md` statuses |
| Tool caches | Pointers only | minimal | none |

## A3.4 Recommended order

1. **S1 now:** commit the pending change set as a baseline with a descriptive message, add `.gitattributes`, tag the guide versions (A3-08). Settle A3-02 in the same step.
2. **Generator fixes before regeneration:** A3-01 (block-0 boundary), A3-06 (move the change log out), A3-04 (a): normalise header rows and add the semantic-review line. Then run **S6 once**: regenerate, `-Check`, semantic read.
3. **Trim** `AGENTS.md` and the skill to the budgets in A3-03; fix A3-11 and A3-12.
4. **Conformance scanner** (E3), then refresh backlog counts from it.
5. **Split the books** (E2), only after steps 1–4 are committed so the split is a pure move with its own diff.
6. `reviews/INDEX.md` and backup removal (A3-10).

## A3.5 Open decisions for the owner

| ID | Decision | Options | Recommendation |
|---|---|---|---|
| E1 | Repository visibility and the tracked rar (A3-02) | Keep / remove from the tree / also rewrite history | Remove from the tree and rotate the credentials; rewrite history only if the repository is public |
| E2 | Book file structure (A3-05) | A: keep single files and add a line index; B: one file per block for all three guides, generator reads files; C: split only the UI book | **B**: the block is already the unit of ownership, citation, and hashing, and a shared convention keeps the generator simple. Do it as a pure move with no wording change |
| E3 | Executable conformance (A3-07) | None / owner-run read-only scanner / scanner plus a CI gate in the application repositories | Owner-run read-only scanner first. `AGENTS.md` must then list it beside `-Check` as a permitted read-only command, or it stays owner-only |
| E4 | Packet model (A3-04) | (a) hash-and-template with a semantic-review line / (b) content-carrying packets | (a) now; revisit (b) after E2 |
| E5 | Size budgets (A3-03) | Adopt the budgets / no budget | Adopt, and record them in the Master "Packet generation and governance" section |

---

# Audit 4 — pattern fitness and consistency review — 2026-09-30

| | |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Audit date | 2026-09-30 |
| Requested as | "عايز اراجع documentation بشكل كامل … الانماط نفسها … محتاجة تعديل او فيها ثغرات … بحيث لو راجعت التطبيق كله من الاول للاخر يكون نفس النمط والفكر والشكل"; follow-ups: "ممكن Pattern نفسه يكون فيه مشكلة او محتاج تحسين", "مثلا تسجيل master detail يكون محتاج تحسين" |
| Scope | Pattern content (not structure): UI blocks 1–30 + `ui/screens`, backend blocks 0–19, Master blocks 0–8, the skill, and their approved references, checked against current source where a finding depends on it |
| Builds on | Audits 1–3 (structure, packets, paths). Their findings are not repeated |
| Method | Read-only file inspection and grep. No build, test, migration, database, browser or commit. Retired guide basenames not opened |
| Finding kinds | **P** = the pattern itself is weak or wrong · **C** = contradiction/stale text/reference · **G** = gap (no pattern where screens need one) |

## A4.1 Headline

The books are strong on **process** (phases, contracts, evidence) and on **individual
rules**, but three structural weaknesses mean that reviewing the application screen by screen
would keep re-solving the same problems:

1. **The shared foundation still has known defects** (backend base service/repository, two
   `HttpClient` instances, untyped shared contracts). Every screen works around them, and the
   books document the work-arounds instead of fixing the owner.
2. **The books are written "feature-owned first".** Most blocks still teach each screen to
   write its own page/panel/filter/table/editor styling and plumbing; the 2026-09-30 shared
   components (filter panel, list shell, grid types, date/error/money helpers) were appended
   as extra sections instead of replacing the old guidance. Old and new rules now coexist.
3. **The most important ERP screen family has no screen type**: the financial document
   (header + lines + totals + approval/posting + journal), and there is no shared editor shell
   or child-row toolkit for master-detail editors.

## A4.2 Findings

### Foundation (fix once, every screen benefits)

| # | Kind | Where | Finding | Proposed direction |
|---|---|---|---|---|
| A4-01 | P | BE `Service.GetManyAsync`, BE backlog 1 | Base list paging has **no stable order** and returns **no `TotalCount`**; any list inheriting it pages non-deterministically and cannot show a total | Base orders by a stable key (Id desc by default, overridable) and returns `TotalCount`/`TotalPages`; then delete per-service copies of paging code |
| A4-02 | P | BE backlog 10 (`QueryReport`) | Fails **open**: returns every tenant's rows when the claim is missing — a security defect in the foundation | Fail closed (empty/throw) like every other repository method; block 17 then drops its warning |
| A4-03 | P | BE backlog 2, UI backlog 8/19 | Server-owned fields (`SubscriptionId`, `No`, `IsDeleted`) still in client write models; each map must remember to ignore them | Remove them from Add/Update base VMs and Angular `AddBase`; tenant comes only from the server |
| A4-04 | P | BE block 5 `IService` | `AddAsync` takes a `CancellationToken`; `UpdateAsync`, `RemoveAsync`, `DetailAsync`, `GetManyAsync` do not → services pass `CancellationToken.None`, cancellation never reaches the database | Add the token to the whole interface in one coordinated change |
| A4-05 | P | BE block 5 check "a `Fail` helper" | Every service defines its own `Fail`; FK existence checks (`Any` bug, backlog 3) and child-ownership checks are hand-written per service (≈60 repeated lines in PO/Bill) | Base: `Fail(message, status?)`, `AllExistAsync<T>(ids)` (distinct-count), `OwnedIdsMatch(...)` — JobService already has correct versions to promote |
| A4-06 | P | BE block 11, backlog 14/15 | Document numbers use a row-count generator (collides after delete, crosses tenants) | Already planned in `reviews/Deferred/DOCUMENT_NUMBERING_...`; the book should point there and stop teaching the generator |
| A4-07 | P | UI block 1, UI backlog 17 | Two `HttpClient` instances; every service (even borrowed lookups) must be listed in `LayoutModule.providers` or requests go out without a token — caused real defects (Labour Tariff) | Provide the interceptor chain once at the application root; delete the provider list and the rule |
| A4-08 | P | UI blocks 2, 7, backlog 22 | `Result.id`, `Results<T> extends Result<any>`, `ActionList` are `any` → row actions and responses are untyped in every screen | Type them (`ActionList<T>`, `Results<T>` without `any`) in one coordinated change |
| A4-09 | P | UI backlog 27 | Global `LoadingService` is one boolean shared by overlapping requests (lookups must not touch it — a trap every screen must remember) | Counter-based loader, then relax the block 22 rule |
| A4-10 | G | UI block 26, backlog 20 | No authorization at all (every signed-in user can do everything) — the biggest functional gap of an ERP; every screen is reviewed without a permission model | Decide the model (roles/claims + route guard + action `visible`) before the screen-by-screen review, so screens are reviewed once |

### Master-detail (frontend and backend)

| # | Kind | Where | Finding | Proposed direction |
|---|---|---|---|---|
| A4-11 | P | UI blocks 13, 14 | Every master-detail editor hand-writes row `FormGroup` factories, add/remove, recalculation, display-name setters (`setItemName`, `setStaffName`…) and the `...(row.id > 0 ? { id } : {})` payload mapping — the same code in each editor (Job, quotations, bills) | Shared child-row toolkit: typed row factory, `toChildPayload(rows, map)`, lookup-name resolution from options at render time (no hidden name controls) |
| A4-12 | P | UI block 14 | "Confirm before every child-row removal" — annoying for a blank new row, and Job does not follow it | Confirm only when the row has data or is persisted; blank new rows remove directly |
| A4-13 | G | UI block 14 | No rule for: focusing the first control of an added row, per-row error display, duplicate-row detection, maximum rows | Add them to block 14 (a11y + validation) |
| A4-14 | P/C | UI block 13 "Mandatory CRUD modal rule" vs Job | Rule says every Create/View/Edit is one modal unless a routed page is approved; Job (the new reference) is routed without a recorded approval. Multi-collection documents do not fit a modal | Replace with a decision rule: modal for simple/single-small-collection records; routed editor for documents with several child collections or totals (Job, invoices, quotations, bills) — then record Job under it |
| A4-15 | P | UI block 13 routed variant | Child table height uses magic viewport math (`clamp(120px, calc(100dvh - 540px), 240px)`) — breaks when the page layout changes | Fill chain like the list (`fillHeight` in a bounded flex section), no viewport numbers |
| A4-16 | G | UI 12/13 | No shared **editor page shell** (page, sections, sticky footer, totals strip) — Job editor SCSS 349 lines, Close Job 199, other editors similar | Stage 3 of the shared-components plan: `sigma-editor-page`, `sigma-editor-footer`, `sigma-totals` + shared section spacing |
| A4-17 | C | UI 13 child-draft snippet | Uses mutable fields (`this.visible = true`, `driverDraft`) while the rest of the book requires signals | Rewrite with signals |
| A4-18 | C | BE block 14 | Reference `PurchaseOrderService` is Transitional with a known FK defect still present in source; snippet uses `Mapper.Map(vm, entity)` on the graph + `Update(entity)`, contradicting AGENTS "reconcile aggregate children explicitly" | Promote a clean reference (JobService: explicit `ReconcileDetails`, ownership checks, count-based FK); snippet shows explicit reconciliation |
| A4-19 | P | BE block 14 | "Omitted vs empty child collection: decide per feature" — no default, so every feature decides differently | Default: the client always sends the full child snapshot; omitted = invalid request; empty = clear (only when the minimum count allows) |
| A4-20 | C | BE block 14 transaction table | Says Miscellaneous Invoice has an invoice-only one-save branch; after 2026-09-29 it always posts a journal | Update the row |

### List screens (shared-first rewrite)

| # | Kind | Where | Finding | Proposed direction |
|---|---|---|---|---|
| A4-21 | C | UI block 4 | The old "Compact filter strip — default presentation" (≈230 lines of feature-owned SCSS, "Copy this", "use this for a new screen") still sits before the new *Shared filter panel*; values differ (label 11px/700 vs 0.72rem/500; gap 5px 8px vs 7px 16px; breakpoints 900/700 vs 1250/720); references still Opening Balances / Individual Partner | Keep one rule: the shared panel. Move the old strip + flat grid to a short "Legacy presentations (existing screens only)" note; one set of values |
| A4-22 | G | UI block 4 / filter panel | The panel has no pattern for a checkbox filter or a radio group spanning columns (Lease has both) | Add `sigma-filter-field--check` and a spanning group to the panel and the block |
| A4-23 | P/C | UI block 6 vs `sigma-list-table` | Block 6 says the table wrapper takes the same 8px inline margin as the title and filter strip "so all three share both edges"; the shared `sigma-list-table` has **no** margin → in Job the grid is 8px wider on each side than the filter strip | Give `sigma-list-table` `margin-inline: 8px` (or remove the strip margin) — one owner, one value |
| A4-24 | C | UI block 6 layers table, block 1 panel spec, block 3 snippet | Still say the feature owns page/panel layout; block 1 panel spec (radius 4px, light shadow) differs from `sigma-list-panel` (radius 0, 16% shadow); block 3 snippet uses `feature-page/feature-panel` | Rewrite to the shared shell classes and one panel spec |
| A4-25 | C | UI block 1 | Container-fill references `Rental/RentalPlanner` (special `p-table` planner) and `Staff/designations`; the list shell reference is now Job | Reference Job |
| A4-26 | C | UI block 6 | Fleet Alerts feature-specific rules (buttons, dialog, variants) inside the canonical grid block | Move to the Fleet Alerts review; keep only the general "report variants" rule |
| A4-27 | C | UI block 7 | `mutationError` snippet duplicates `apiErrorMessage` (block 22) | Point to the shared helper |
| A4-28 | P | UI block 8 | Every service copies the all-pages export loop (`getAllList` with `expand`) — Company, Job, Supplier… | Shared `fetchAllPages(getPage)` in `BaseService` |
| A4-29 | P | UI block 2 | Every service hand-builds `HttpParams` for `Filters[...]`/paging | Shared `toListParams(query)` in `BaseService` |
| A4-30 | C | UI backlog 33, 35 | 33 (16 paginator overrides) is mostly resolved by the `[fill]` migration; 35 (34 page-height calcs) is the blocker to deleting the toolbar shim | Update 33; plan 35 together with A4-24 (list shell adoption) |

### Money, dates and rules across the app

| # | Kind | Where | Finding | Proposed direction |
|---|---|---|---|---|
| A4-31 | P (owner decision) | BE block 5 "rounded per line" vs `Job.RecalculateTotals` (rounds the subtotal) | Two VAT rounding policies coexist (per line for invoices/bills, per document for Job) | Decide one app-wide policy (or a documented per-document-type rule) and align the domain |
| A4-32 | C | BE block 15 rule 8 wording | Refers to line rounding only; Job/Close-Job path differs | Align after A4-31 |
| A4-33 | P | UI block 14 financial editor | Allows a route-level `calc(100dvh - …)` cap and depends on the toolbar-height shim that block 1 wants deleted | Same fill chain as lists/editors; remove the exception once A4-16 exists |

### Screen catalog (reviewing the whole application)

| # | Kind | Where | Finding | Proposed direction |
|---|---|---|---|---|
| A4-34 | G | `ui/screens/00-catalog` | No **Financial document** type (invoice, receipt, credit/debit note, bill, voucher: header + lines + totals + approval/posting + journal + print) — the largest screen family of the ERP | Add type 08 with UI + BE pattern 3 composition and a reference to build (Invoice or Job-close invoice) |
| A4-35 | G | catalog | No type for **operational action dialogs** (Close Job, Labour Time, extend/void/deliver dialogs) | Add a short type: typed form dialog + domain action (UI 13, BE 12/pattern 3) |
| A4-36 | C | catalog | Type 01 list reference `Fleet/VehicleService`; type 02 routed editor `RentalQuotation` — neither uses the shared list shell/filter panel/grid types | Reference Job for lists; decide the routed-editor reference after A4-16 |
| A4-37 | G | Master / catalog | No "whole-application review order" — the owner reviews by sidebar order; nothing tells a reviewer which cross-cutting fixes to do first | Add a playbook: foundation first (A4-01…10), then shared-first book rewrite, then screens by sidebar with the catalog |

### Master (process)

| # | Kind | Where | Finding | Proposed direction |
|---|---|---|---|---|
| A4-38 | P | Master blocks 3/4 | The full artifact set (manifest, contracts, reconciliation…) is the same for a one-field fix and a new module; small changes spend more effort on paperwork than code | Explicit proportionality tiers (S/M/L) with the minimum artifact set per tier |
| A4-39 | C | Master block 2 | Contains a feature/vendor-specific reference ("External rental simulation reference — Speed Auto Systems") inside the governance book | Move to a reference note outside the canonical rules |
| A4-40 | C | Master block 4 | "Quotation/action failure-prevention register" is feature-family specific inside the generic contract block | Move to BE 14 / UI 7 quotation sections |

## A4.3 Recommended order

1. **Foundation** — A4-01, 02, 03, 04, 05, 07, 08, 09 (+ decision A4-10). One Maintenance/Evolution
   plan per side; each fix removes a rule from the books.
2. **Shared-first rewrite of the books** — A4-21…30 and A4-24/25: the old feature-owned
   guidance becomes a short legacy note; each block states the shared owner first.
3. **Master-detail toolkit + editor shell** — A4-11…19, 16: shared child-row helpers, editor page
   shell, decision rule modal vs routed; then make Job the editor reference too.
4. **Catalog** — A4-34…37: financial document and action-dialog types, references, review
   playbook.
5. **Owner decisions** — A4-10, 14, 19, 31 (below). Then the screen-by-screen review follows
   the catalog, and each screen is reviewed once.

## A4.4 Open decisions for the owner

| # | Decision | Options | Recommendation |
|---|---|---|---|
| D4-1 | Authorization (A4-10) | Now, before screen reviews / later | Now: roles or permission claims, route guard, action visibility — otherwise every screen is reviewed twice |
| D4-2 | Modal vs routed editor (A4-14) | Keep "modal unless approved" / decision rule by document size | Decision rule; routed for multi-collection documents |
| D4-3 | Child collection semantics (A4-19) | Per feature / one default | One default: full snapshot always |
| D4-4 | VAT rounding (A4-31) | Per line / per document / per document type | Per line everywhere (matches invoices, bills, notes and the journal lines) unless a document type needs otherwise |
| D4-5 | Proportional process (A4-38) | Same artifacts always / S-M-L tiers | Tiers |

## A4.5 Step-by-step review of every block — 2026-09-30

Owner request: "انا عايز اراجع كل الخطوات اللى موجودة فى guide سواء فرونت او باك". Every backend
block (0–19), every UI block (1–30) and the Master blocks were read in full. Their step
guidance was compared with the rest of the books and, where a finding depends on it, with
current source. The findings below are **new** and do not repeat A4-01…A4-40.

### Backend steps and patterns

| # | Kind | Where | Finding | Proposed direction |
|---|---|---|---|---|
| A4-41 | P | BE 1, 2, 8 | Soft delete plus an unfiltered unique index `(SubscriptionId, Name)`: a deleted name passes the service duplicate check, but the database rejects re-adding it. Block 8 states the `[IsDeleted] = 0` filter only for temporal periods | Add a step 2 rule for **every** unique index on a soft-deletable entity: `HasFilter("[IsDeleted] = 0")`. The owner runs the migration per entity when it is touched |
| A4-42 | P/C | BE 2, 8 | Step 2 configures cascade delete, and block 8 says owned children "cascade or are soft-deleted with the parent". A soft delete is an update, so the cascade never fires and the children stay active | Choose one and write it in step 2: base `RemoveAsync` soft-deletes the owned children it knows, or children are always read through their parent |
| A4-43 | C | BE 1, BE preamble | A stale Agreement tax paragraph in step 1, and a stale "last verified" date in the preamble | Remove the paragraph (tax lives in block 5 *Tax in any service*) and refresh the date |
| A4-44 | G | BE 3, 7 | `<Entity>FullListVm` has no contract. Nothing says who consumes it, which endpoint returns it, or how it differs from the ListVM, and in practice it duplicates the ListVM | Create it only for a named second consumer (export or picker) and record that consumer in the contract. Otherwise do not create it |
| A4-45 | C | BE 4 | The rule says "no `ReverseMap`", but real profiles such as `BillProfiler` use `ReverseMap`, and the block names no clean reference profile | Name a clean reference profile. Add the existing `ReverseMap` profiles to the backlog |
| A4-46 | P | BE 13 (pattern 1) | Every entity re-writes `GetManyAsync` only to add its filters and order. Delete reference checks are hand-written per service | Base hooks `ApplyFilters(query, filters)` and `DefaultOrder(query)` (with A4-01). A declarative reference list for delete, such as `References.Add<Partner>(x => x.BranchId, key)` |
| A4-47 | P | BE 8, 13, 18 + UI 22 | `Fail("…")` messages are literal English while success messages are localized. The UI shows `response.message` as-is, so an Arabic user sees English errors | `Fail` takes a resource key, the same as success. The book examples use keys |
| A4-48 | P/C | BE 16 (pattern 4) | The main snippet contradicts the block's own rules. `SyncByKeyAsync` deletes by omission, so a partial payload wipes settings. Singleton settings (`OrderBy(Id).First()`: tax, numbering, limousine) have no variant | Fix the snippet. Delete by omission only when the payload is declared to be the full set. Add a *singleton settings* variant: get-or-create, update in place, no list |
| A4-49 | C | BE 17 (pattern 5) | Uses the removed Job `ApprovalStatus` as a proxy; Job now has `Status`/`ClosedAt`. Feature-specific report baselines sit inside the canonical block | Update the proxy. Move the feature baselines to their review artifacts |
| A4-50 | C | BE 7 | The procedure reads Angular `initColumns()`/`colName`, but the reference grid (Job) declares `columns: DataTableColumn[]` with `field`/`type` | Rewrite the procedure against `DataTableColumn.field` |
| A4-51 | P | BE 9 | The case-sensitive filter key is documented as a "trap" instead of being fixed at its owner. `ListSmBase.Filters` uses the default comparer, while `SpecificationRequestDto` is already case-insensitive | Bind `Filters` with `StringComparer.OrdinalIgnoreCase` once. The trap and its edge-case row then disappear |
| A4-52 | P | BE 10 | The base `SelectAsync` treats an empty list as a failure, so every new lookup must override it. The base also does not exclude inactive rows by default | Fix the base: an empty list is a success, and inactive rows are excluded by default with an opt-out. Block 10 then becomes Canonical |
| A4-53 | P | BE 12 | The defects of the base `HandleActiveAsync` (partial success, no null guard) are left to per-entity overrides | Fix the base once: every id is found or the call fails, and null or empty input is rejected. Default rule: deactivation is allowed while the row is referenced, unless the entity declares otherwise |
| A4-54 | C | BE 18, UI 16, 17, 19, 22, 29 | Incident narratives ("Found 2026-09-2x in …") are embedded in canonical blocks, so the books grow with history | Keep the rule and a one-line reason in the block. Move the incident to `CHANGELOG.md` |

### Frontend steps

| # | Kind | Where | Finding | Proposed direction |
|---|---|---|---|---|
| A4-55 | C | UI 12 | The step snippet uses `*ngSwitchCase`, while every other block uses `@switch`/`@if` | Rewrite it with the control-flow syntax |
| A4-56 | P | UI 13 | `[contentPadded]` defaults to `false`. Every new editor must remember to opt in, and forgetting it reproduces the defect | After backlog 36, flip the default to `true`. Full-bleed bodies (a tabs strip or an edge table) opt out |
| A4-57 | C | UI 24 button roles, UI 13 routed footer | The approved Secondary button is still the feature classes `individuals-secondary-button`/`individual-secondary-action`, and the routed footer uses a raw `<button>`, although the global `sigma-secondary-button` exists. There is no shared danger button | Use `sigma-secondary-button` everywhere. Add a shared danger variant |
| A4-58 | P | UI 14 financial variant | Feature SCSS styles the shared component's internals (`.app-editable-collection-table__frame`, `thead th`). This is the same anti-pattern that was closed for `app-data-table` | Use only inputs (`fillHeight`, `maxHeight`, a new `stickyHeader`) and documented `--app-editable-collection-*` variables |
| A4-59 | P | UI 14, 20 | The financial summary strip is specified in the book with hex colours and px values, and it is rebuilt per feature (Opening Balances, reports, PO/Bill totals) | A shared `app-financial-summary` (Debit/Credit/optional Balance, tabular numbers, light and dark tokens). The book keeps only its contract |
| A4-60 | G | UI 14 | No rule for **derived row cells** such as line total, line tax and net. They must be read-only, previewed with `roundMoney`, never sent in the payload, and replaced by the backend value after save | Add the rule to block 14. Today it is scattered between UI 19 (tax) and AGENTS |
| A4-61 | G | UI 15 | View mode disables the whole form, but the book does not say that a disabled control is missing from `form.value`, so the payload must use `getRawValue()`. It also does not say when a field is `readonly` (server-derived, such as tax) rather than disabled | Add both rules |
| A4-62 | C/P | UI 16 | Two enum-option recipes coexist: `EnumToArrayPipe` (`key`/`value`, with the `value: string` typing bug) and "build from the enum" (`id`/`key`). There is no shared helper. The lookup snippet handles only `isSuccess: true`, which breaks the two-channel rule of block 22 | One shared `enumOptions(Enum, prefix)` utility and one binding. Fix the snippet |
| A4-63 | C | UI 17, 20 | Block 17 says "no feature copies" but shows a private `toDateInput`. It names `parseDateValue()`/`parseRangeString()`, but they exist only as feature copies (Work Order ×2, Labour Activities Report). The table snippet uses the `date` pipe instead of the column `type`. The **default range differs**: full current month in block 17, month-to-date in block 20 | Move the parse helpers into `date-utils.ts`. Snippets use `toApiDate` and `type: 'dateTime'`. One default range (D4-7) |
| A4-64 | P | UI 18 | Documents have three presentations: `app-documents`, the global `sigma-documents__*` classes, and `app-editable-collection-table` in Company. About 100 lines of upload and orphan-cleanup logic are copied into each feature | One component plus a shared `DocumentUploadTracker` (pending/removed paths, `finishSave`, `discard`) |
| A4-65 | C/P | UI 19 | The tax and money rules live in the *Validation messages* block. Every feature re-writes `validationMessageKey` and the error markup with feature classes (`company-field-error`) | A new block, "Money and tax in forms", which also takes A4-60. A shared `app-field-error [control] [messages]` |
| A4-66 | P | UI 20 | Report filters follow the Opening-Balances strip (block 14) instead of the shared `form[appFilterPanel]` (block 4), so there are three filter visual systems. Amounts use `number:'1.2-2'`, while the grid uses `formatMoney` (Latin digits). The block has private `formatApiDate`/`formatDisplayDate` copies and binds `[disabled]` on reactive controls | Reports use the filter panel. One money format (`formatMoney`). The shared date helpers. Disable through `form.disable()` |
| A4-67 | P | UI 21 | Every report writes its own `@media print` release for its scroll containers | A shared `sigma-print-flow` class (or `appReportPage`) releases the bounds |
| A4-68 | P | UI 22 | Each feature writes `showError` with a prefix hack (`message?.startsWith('companyPartners.')`) and its own loading and empty dialog markup (`individual-dialog-state`) | A shared `NotificationService.error(keyOrMessage)` and `app-state-message` (loading, empty and error) |
| A4-69 | G | UI 23 | en/ar key parity is checked by eye. The misspelled `mangeDetails` namespace is taught as canonical | A read-only `Check-Translations.ps1` beside the recipe generator. Document `mangeDetails` as legacy |
| A4-70 | P | UI 24, 25 | Every feature declares its own palette (`--feature-text/-muted/-border/-surface/-canvas`), for both light and dark. This is the main reason screens do not look the same | Global semantic tokens `--sigma-text/-muted/-border/-surface/-canvas`, defined once in `styles.scss` for both themes. A feature token only for a real domain colour (D4-6) |
| A4-71 | C | UI 26, 27 | Verification dates are from 2026-08-06, and the block refers to the Staff salary-revision modal without recording its current state | Re-verify the blocks and date them |

### Master

| # | Kind | Where | Finding | Proposed direction |
|---|---|---|---|---|
| A4-72 | C | Master 4 register vs UI 22 | The register says "recover safe `error.message` from the HTTP error payload". UI 22 says "do not read `error.message`; use `apiErrorMessage`" | Make the register point to `apiErrorMessage` |
| A4-73 | G | UI 30, BE 19 | The backlogs contain none of A4-41…71 | Add them once the owner accepts the direction |

### Added decisions

| # | Decision | Options | Recommendation |
|---|---|---|---|
| D4-6 | Global semantic colour tokens (A4-70) | Feature palettes / global tokens | Global tokens: one look everywhere, and dark mode correct by default |
| D4-7 | Default date range (A4-63) | Full month / month-to-date | Month-to-date for lists and reports |
| D4-8 | Filtered unique indexes (A4-41) | Per feature when touched / one sweep | Per feature when touched; each index needs a migration the owner runs |

### Addendum to A4.3

- **Step 1 (foundation):** also A4-47, 51, 52 and 53, because they are fixes to the base classes.
- **Step 2 (shared-first rewrite):**
  - also A4-57, 58, 62, 63, 66 and 70;
  - the new shared pieces `app-financial-summary`, `app-field-error`, `app-state-message`, `DocumentUploadTracker` and `enumOptions`.
- **Step 3 (master-detail):** also A4-41, 42, 60, 61 and 64.
- **Cleanup alongside step 2:** A4-43, 45, 49, 50, 54, 55, 71 and 72.

## A4.6 Foundation step status — 2026-09-30

Source discovery for `Archive/SIGMA_FOUNDATION_MAINTENANCE_EVOLUTION_PLAN.md` corrected parts of A4.2,
and slices F1–F4 were then implemented (source-only).

| # | State after the foundation step |
|---|---|
| A4-01 | **Partly stale.** Paging order was already stable (`Id desc` tie-break). The missing totals are fixed in the base (`TotalCount`/`TotalPages`, clamped supplied paging). Overrides with their own query still set both when touched |
| A4-02 | **Stale.** `QueryReport` already failed closed; the books are corrected |
| A4-03 | Open. Slice F5 (`UpdateBaseVm.SubscriptionId`/`No` removal) is Frozen but not started |
| A4-04 | Deferred (high churn, low value now) |
| A4-05 / A4-47 | **Infrastructure done:** `BusinessFailure(key)`/`LocalizeMessage`, and `Accept-Language` from the UI. The ≈1,234 literals and ≈90 private `Fail` helpers migrate per screen |
| A4-06 | Deferred plan unchanged |
| A4-07 | **Resolved:** one root `HttpClient`, with the interceptors scoped to `environment.baseUrl` |
| A4-08 | Partly: `ActionList<TRow>`. `Results`/`Result.id` wait for an owner compile pass |
| A4-09 | **Resolved:** counting `LoadingService` with a navigation reset |
| A4-10 | Open — D4-1 |
| A4-51 | **Resolved:** `ListSmBase.Filters` is case-insensitive |
| A4-52 | **Partly stale:** an empty dropdown was already a success. Inactive rows stay included by default (decision in the plan §3) |
| A4-53 | **Resolved:** `HandleActiveAsync` is virtual and validated |
| A4-72 | **Resolved:** the Master 4 register points to `apiErrorMessage` |
| new | Error presentation already had one owner (`errorInterceptor`). UI 22 and Master 5 now say so; the 60 duplicate feature error toasts go screen by screen |

**2026-09-30 — F5 implemented:** A4-03 is **resolved in the backend**: `UpdateBaseVm` carries `Id` only. The Angular payload cleanup (UI backlog 8, 19) is safe and happens per screen.

**2026-10-01 — D4-1 deferred by the owner:** A4-10 moved to `reviews/Deferred/AUTHORIZATION_MAINTENANCE_EVOLUTION_PLAN.md`. Screen reviews continue without a permission model and record "Authorization candidates".

## A4.7 Shared-first step status — 2026-10-01

Implemented source-only (`Archive/SIGMA_SHARED_FIRST_MAINTENANCE_EVOLUTION_PLAN.md` §7).

| State | Findings |
|---|---|
| **Resolved** (book + shared piece) | A4-21, A4-22, A4-23, A4-24, A4-25, A4-26, A4-27, A4-28, A4-29, A4-30, A4-44, A4-45, A4-48, A4-49, A4-50, A4-55, A4-57, A4-58, A4-59, A4-62, A4-63, A4-65, A4-66, A4-67, A4-68, A4-69, A4-70, A4-71 |
| **Decided** | D4-6 global tokens; D4-7 current month (existing owner rule) |
| **Partly** | A4-43: the stale tax paragraph was removed and the preamble dates refreshed |
| **Open** | A4-54 (narratives → CHANGELOG) |
| **Step 3** | A4-11…20, 41, 42, 60 (the rule is in UI 14), 61, 64 |
| **Deferred** | A4-46, A4-56 |
| **Step 4** | A4-34…37 |

## A4.8 Master-detail step status — 2026-10-01

Implemented source-only (`Archive/SIGMA_MASTER_DETAIL_MAINTENANCE_EVOLUTION_PLAN.md` §7).

| State | Findings |
|---|---|
| **Resolved** | A4-11, A4-12, A4-13, A4-14, A4-15, A4-16, A4-17, A4-18, A4-19, A4-20, A4-41 (rule; indexes per entity), A4-42 (helper; per aggregate), A4-61, A4-64 |
| **Decided** | D4-2 (modal vs routed rule), D4-3 (full snapshot), D4-8 (filtered unique index per entity when reviewed) |
| **New** | The UI 18 `sigma-documents__*` classes never existed (drift, removed). `FileUploadService.uploadFile` returns messages as paths (backlog 29) |
| **Remaining open** | A4-54 (narratives → CHANGELOG); step 4 (catalog A4-34…37); A4-46, A4-56 (deferred) |

**2026-10-01 — D4-4 decided by the owner:** document VAT is rounded once per tax rate. A4-31/A4-32 are resolved in the books (BE 15 rule 8, BE 5, UI 19, Master 5); the shared helpers exist, and the documents move per review (backlog 24). New owner rule: *Business correctness first* (Master 1).

## A4.9 Completion plan status and closure of Audit 4 — 2026-10-01

Implemented source-only (`Archive/SIGMA_BOOKS_COMPLETION_MAINTENANCE_EVOLUTION_PLAN.md` §7, R1–R8).

| State | Findings |
|---|---|
| **Resolved** | A4-01, A4-02 (stale), A4-03 (backend; the Angular payloads are cleaned per screen), A4-05/A4-47 (infrastructure; literals migrate per screen), A4-07, A4-08 (D5-4), A4-09, A4-31, A4-32 (D4-4), A4-33 (UI 14 legacy note), A4-34, A4-35, A4-36 (R4 catalog), A4-37, A4-38 (Master 1, D4-5), A4-39 (`REFERENCE_SPEED_AUTO_SYSTEMS.md`), A4-40 (register in UI 7), A4-43, A4-46 (base hooks, D5-1), A4-54 (R6) |
| **Deferred, tracked** | A4-04 → BE backlog 27 (D5-2); A4-06 → `Deferred/DOCUMENT_NUMBERING_…`; A4-10 → `Deferred/AUTHORIZATION_…`; A4-56 → after UI backlog 36 (D5-3) |
| **Checks** | `Generate-SigmaRecipes.ps1 -Check` 8×OK; new `Check-BookReferences.ps1` clean (paths, types, `sigma-*` classes, block numbers, links in the three books and the skill) |

**Audit 4 is closed.** Every finding is resolved or deferred with an owner and a tracked location.

---

# Audit 5 — screen-by-screen review phase

| | |
|---|---|
| Status | Draft — open |
| Owner verification pending | yes |
| Opened | 2026-10-01 |
| Baseline | Master 1.19, backend book 0.46, UI book 0.97; packets regenerated 2026-10-01 |
| Scope | Drift between the books and the code as each screen is reviewed, in the order of Master block 1 *Whole-application review order* |
| Method | Per screen: the screen type (`ui/screens/00-catalog.md`), the tier (S/M/L, D4-5), the per-screen checklist; after any book or skill change, `Generate-SigmaRecipes.ps1 -Check` and `Check-BookReferences.ps1` |

## A5.1 Carried into Audit 5

**Owner checks still pending:**
- `dotnet build` and `ng build` of the R1–R3 code (D5-4 typing may surface `.entity` reads on list responses, or `Result.id` used as a number).
- Migrations not yet run (`AddBillTaxAdjustment`, `AddContactGroupIsDefault` and the earlier ones).
- Deleting the duplicate rows of the six single-row settings screens.

**Owner decisions:**
- The journal decision sheet: J-1, F2, F4, F8, I1, I2.
- Whether the current data is live or test data. This changes how F1 is prioritised.

**Code debt, tracked per screen:**
- Backend backlog 21–27.
- UI backlog 5, 8, 19, 29, 31, 35, 36, 39 and 40.

## A5.2 Findings

| # | Severity | Screen / block | Finding | Resolution |
|---|---|---|---|---|
| A5-01 | C | Documentation clean-up (owner approval 2026-10-01) | Deleted: `reviews/_backup_2026-09-28/` (superseded instruction copies) and the empty `.qodo/`. Moved: 55 reference screenshots and the Sales Quotation README out of the Angular source to `reviews/evidence/`; four implemented plans to `reviews/Archive/` (references repointed). Merged: the UI preamble reference table (had drifted from the catalog). Fixed: command reference §30 contradicted Master 2 rule 6. Retired guide basenames: no copy found on disk | Closed |

# Audit 6 — مراجعة الوثائق وتنظيف الإرشادات المتقادمة — 2026-10-23

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التفويض | طلب المالك مراجعة الوثائق بعد آخر التعديلات وحذف غير المستخدم |
| النطاق | منظومة الوثائق المعتمدة، خريطة المشروع، خلاصة مهارة الشاشات، وثائق المستودعين، وجرد سجلات المراجعة |
| حدود العمل | تغييرات توثيقية فقط؛ لا تغيير لسلوك التطبيق أو العقود المجمدة |
| المنهج | جرد ومسارات وروابط وبصمات ملفات، قراءة موضعية للمصدر، ومراجعة الفروق؛ لم تُراجع كل سجلات الميزات كسلوك وظيفي |

## القرارات والأدلة

| القرار | الدليل والتنفيذ |
|---|---|
| حذف التعليمات التشغيلية للغلاف المتقاعد | إزالة وصف أبعاد شريط الأدوات، إعدادات الغلاف المخزنة، وتزامن متغيرات الارتفاع القديمة من UI1. المصدر الحالي يستخدم الغلاف الأصلي للتطبيق، مع أنماط Sigma؛ أُبقيت قاعدة امتلاء الحاوية وعدم تمرير الصفحة وقاعدة الفصل بين الحافة الخارجية والحشو الداخلي |
| تحديث مالك الاتصال | المصدر الفعلي في `app.config.ts` يسجل معترضات الرمز والأخطاء ونشاط التنقل. وحدة المصادقة لا تسجل عميلًا مستقلًا. صُحح مثال UI1، والبند المحلول رقم 17 في UI30، وخلاصة المهارة وسجلها في المهمة نفسها |
| تحديث دليل الواجهة | إعادة كتابة README وفق Angular21/PrimeNG21 والجذر المستقل والغلاف الحالي وباني التطبيق ومخرجات النشر المسطحة. حُذفت شروحات المسارات والمكتبات التي أُزيلت وبيانات الحساب التجريبي؛ القواعد التفصيلية تحيل إلى مصدرها المعتمد |
| تحديث خريطة الموظفين | ملفات المسارات والنموذج والخدمة وعقود الإضافة والتعديل والمتحكم تثبت أربعة مسارات بحالة الأحرف الحالية، حسابات بنكية في حمولة الحفظ، حزمة راتب اختيارية عند الإنشاء، وعقدًا منفصلًا لمراجعات الراتب. حُذف المسار التوافقي غير الموجود ووصف غياب الحسابات البنكية |
| تصحيح عدد أنواع الشاشات | الكتالوج يحتوي تسعة أنواع؛ صُحح README المعتمد وفهرس كتاب الواجهة اللذان كانا يذكران سبعة |
| الحفاظ على العقد التاريخي | إضافة تصحيح مؤرخ لموقع الأدلة وحالة الحزم في وثيقة عقد اتفاقية التأجير؛ بقيت القرارات والأدلة القديمة دون إعادة كتابة |
| عدم حذف ملف كامل دون دليل | لم يثبت وجود ملف وثائق كامل غير مستخدم. لا توجد قوالب أو حزم يتيمة؛ الأدلة المحلية مرتبطة بمصدر موجود. لم تظهر نسخ Markdown متطابقة بالبصمة ضمن سجلات المراجعة. السجلات المجمدة والأرشيف والتراخيص والأدلة المصورة وبصمات المقارنة ليست مهملة لمجرد قِدمها أو غياب استدعاء برمجي لها |
| إبقاء كتالوج المسارات الداخلي | المصدر يثبت أن LayoutModule يستخدم `pages/routing.ts`؛ وجود الجذر المستقل لا يجعل الكتالوج غير مستخدم |

## الملفات المعدلة وملكيتها

المسارات التالية نسبية إلى الجذر المذكور لكل مجموعة:

| المالك | الملفات |
|---|---|
| مساحة العمل المحلية غير الخاضعة لمستودع | `PROJECT_MAP.md`، `.agents/skills/sigma-screen-refactor/SKILL.md`، وهذا السجل بإضافة المراجعة السادسة فقط |
| مستودع الواجهة | `SiGmaAngularFrontEnd/README.md` |
| مستودع الخلفية | `SigmaBackend/SiGma.ServerAPI/Documentation/RentalAgreementFeatureContract.md` |
| مستودع الوثائق، داخل `sigma-erp/` | `README.md`، `SIGMA_UI_PATTERNS.md`، `ui/01-feature-folders-and-wiring.md`، `ui/30-backlog-by-priority.md`، `CHANGELOG.md`، والحزم الثماني تحت `recipe-system/generated/` |

## التحقق والمطابقة النهائية

| الفحص | النتيجة |
|---|---|
| فحص الحزم عند البداية والنهاية | نجاح الحزم الثماني في المرتين؛ إعادة التوليد بعد تغييرات الكتاب تمت عبر المولد فقط |
| الحزم التي جُددت | `PLAN-00-maintenance-evolution` و`PHASE-00-discovery-evidence` و`PHASE-01-domain-api` و`PHASE-02-read-grid` و`PHASE-03-detail-write` و`PHASE-04-domain-actions` و`PHASE-05-integration-runtime` و`PHASE-06-final-reconciliation` |
| المراجعة الدلالية للحزم | مطابقة بصمات UI1/UI30 للنص النهائي؛ القوالب والمراجع المعتمدة بقيت على أدوارها. تغييرات الجذر المستقل السابقة في حزمة الدمج محفوظة. إرشادات استبدال الجدول القديم مصنفة Legacy وليست توجيهًا لإنشاء اعتماد جديد |
| روابط الوثائق | فحص أهداف 290 رابط Markdown محليًا في 96 ملفًا بمنظومة الوثائق: صفر أهداف مفقودة. شمل التعامل الصحيح مع المسارات المطلقة؛ لم يُفحص وجود عناوين الأقسام الداخلية أو الروابط الخارجية |
| الأدلة المتقاعدة | صفر نسخ ضمن مجلد الأدلة المعتمد وسجلات المراجعة وتعليمات المهارة؛ لم تُفتح محتويات أي اسم متقاعد |
| مراجعة الفروق | مراجعة الفروق المحددة في مستودعات الواجهة والخلفية والوثائق. استُخدمت نسخ قبل التعديل للمستندات المحلية ولتمييز التغييرات السابقة في الكتب والخلاصة؛ لم تُرجع تعديلات أخرى |
| تنسيق الفروق | نجاح فحص المسافات في الملفات المحددة؛ لا علامات دمج في الإضافات |
| المراحل | اكتشاف توثيقي ومطابقة نهائية؛ مراحل واجهات البيانات والكتابة وإجراءات النطاق غير منطبقة لعدم تعديل التطبيق |
| العقود والحسابات والمخطط ودليل المستخدم | لا تغييرات؛ لا حاجة إلى ترحيل أو إنشاء دليل شاشة جديد |
| تحقق المالك المتبقي | قراءة تحريرية للوثائق؛ لا ادعاء تحقق تشغيلي للتطبيق ضمن هذه المهمة |

استُخدم مساران مستقلان للقراءة فقط بدور الاستكشاف ونموذج منخفض التكلفة:
مسار للأدلة والقوالب والحزم، ومسار لوثائق المستودعين. أُعيد استخدام المسار الأول
لمراجعة الفروق النهائية. بقي القرار والتعديل والدمج والمطابقة النهائية لدى الوكيل الرئيسي.

لم تُشغّل أوامر بناء أو اختبارات أو تدقيق برمجي أو قاعدة بيانات أو ترحيل أو متصفح
أو أدوات الرسم المحظورة، ولم تُنفذ عمليات حفظ إصدار أو دفع أو نشر.

رسائل حفظ إصدار مقترحة فقط:

```text
Frontend: docs: refresh Angular frontend architecture and onboarding
Backend: docs: annotate current Rental Agreement documentation authority
Documentation: docs: reconcile standalone shell guidance and refresh packets
```

# Audit 7 — الوثائق الحالية للمراجعة والإنشاء والمهارات — 2026-10-23

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| طلب المالك | مراجعة شاملة بلا تعقيد؛ أحدث وضع للإنشاء أو مراجعة الموجود، مع مهارات التنفيذ؛ عزل القديم والإبقاء على إنشاء جديد، مراجعة قائمة، قرارات مؤجلة، ومهارات مستخدمة |
| العقد | SIGMA_DOCUMENTATION_CURRENT_STATE_MAINTENANCE_EVOLUTION_PLAN.md؛ جُمّد النطاق قبل التعديل وأُضيف توجيه الأرشفة مع الحفاظ على القرار الأصلي |
| الحدود | توثيق ومهارة وأداة فحص وثائق فقط؛ لا تعديل لسلوك التطبيق أو قواعده التجارية |

## النتيجة العملية

المدخل الحالي يعرض أربعة مسارات فقط. اختيار نوع الشاشة والعقد الحالي يقودان
إلى الكتل والمرجع المشترك المناسبين؛ لا يحتاج القارئ إلى تحميل سجل التغييرات
أو الملخص التاريخي أو كل سجلات المراجعة. تبقى قواعد العمل الكاملة في كتبها.

| المخرج | المسار الحالي |
|---|---|
| مدخل الوثائق | `F:\My Work\Shaban Documents\Shaban\sigma-erp\README.md` |
| مهارة المراجعة والتنفيذ | `F:\My Work\Sigma\.agents\skills\sigma-screen-refactor\SKILL.md` |
| الوصول للعقود والسجلات الجارية | `F:\My Work\Sigma\reviews\INDEX.md` |
| القرارات المؤجلة | `F:\My Work\Sigma\reviews\Deferred\README.md` |
| أرشيف المراجعات وخريطة النقل | `F:\My Work\Sigma\reviews\Archive\Completed\2026-10-23\INDEX.md` و`MOVE_MAP.json` |
| نسخ المهارة وسجل التغيير السابقين | `F:\My Work\Shaban Documents\Shaban\sigma-erp\archive\2026-10-23\` |
| مدخل وثائق الخلفية | `F:\My Work\Sigma\SigmaBackend\SiGma.ServerAPI\Documentation\README.md` |
| أرشيف الخلفية | `F:\My Work\Sigma\SigmaBackend\SiGma.ServerAPI\Documentation\Archive\2026-10-23\` |

## ما تغير ولماذا

| القرار | الدليل والتطبيق |
|---|---|
| اختصار المهارة مع إبقاء القواعد | كانت 351542 بايت عند بدء المراجعة. أصبحت مدخلًا موجّهًا حسب المهمة بدل تكرار أمثلة الكتب وتاريخها؛ النسخة السابقة وسجلها محفوظان كاملين. تحديثات زملاء متوافقة ظهرت أثناء العمل حُفظت؛ الحجم النهائي ليس ميزانية ملزمة |
| مساران عمليان | توثيق الفرق بين إنشاء جديد ومراجعة قراءة فقط ومراجعة مع تنفيذ. قاعدة التناسب تسبق نسخ القوالب؛ لا يُفرض مسار ميزة كاملة على تصحيح صغير |
| أحدث وضع في الواجهة | تصحيح مسار الحارس إلى الجذر المستقل، ومرجع الطباعة إلى أنماط المصدر الحالية، وقاعدة عمر المكوّن إلى التصريح المثبت من Angular21. تواريخ التحقق تميز الفحص المحدد عن التحقق الكامل |
| أحدث وضع في الخلفية | مطابقة حالات الفهرس للكتل 10 و11 و12 و14 و17؛ تصحيح جذور مسارات الخدمات؛ عدم فرض نموذج قائمة إضافية بلا مستهلك؛ تمييز سياسة الحفظ/الاعتماد المستهدفة من مرجع لم يُرحّل بعد |
| اتساق القوالب | بداية واضحة لحالة المستند والتحقق المعلق؛ إزالة حالة Reviewable غير المعتمدة من قالب الخطة؛ تعبئة الأجزاء المنطبقة فقط |
| فحص لا يوسّع النطاق | أداة مراجع الكتب تفحص الوثائق افتراضيًا دون مسح التطبيق؛ المصدر يحتاج مسارات ميزة صريحة. فحص السكربت مصدره وتحليله، وفُحص تشغيل الوضع التوثيقي فقط |
| فصل التاريخ | نقل 432 سجل مراجعة وعقدًا تاريخيًا مستهلكًا مع خرائط المسارات والبصمات، وتصحيح الإحالات. أُبقيت الخطط والقرارات المفتوحة أو التي لا يوجد دليل كافٍ لاكتمالها، خصوصًا الملفات المؤجلة |
| عزل التاريخ المحلي بالخلفية | نقل مراجعة الموظفين القديمة، وملاحظات المستودع القديمة، وعقد اتفاقية التأجير التاريخي إلى أرشيف موثق. النقل لا يحل الملاحظات المفتوحة داخل سجل قديم ولا يثبت بقاءها كعيوب حالية |
| حفظ القرارات | الأرشفة لا تمحو عقدًا ولا تعيد كتابة قراره. ميزانية الأحجام الرقمية ونقل ملكية التعليمات وتطبيع البصمات قرارات مستقلة باقية في فهرس المؤجل؛ تبسيط الاستخدام الحالي لا ينتظرها |

## التحقق والمطابقة

| الفحص | النتيجة |
|---|---|
| التغطية التوثيقية | فحص بنية الدليل الرئيسي، و31 كتلة واجهة وكتالوج أنواعها التسعة، و20 كتلة خلفية، والمهارة، وحزم المراحل وقوالبها، ومداخل المستودعين؛ لا ادعاء تحقق كل أمثلة المصدر أو كل ميزات التطبيق |
| أدلة المصدر المحددة | مصدر الجذر والحارس وأنماط الطباعة، ونسخة Angular وتصريح DestroyRef المثبت، ومتحكم الحذف العام ومسارات مراجع الخلفية |
| صلاحية المهارة | نجاح فاحص بنية المهارة؛ تبعية الفاحص ثُبتت في مجلد مؤقت فقط، دون تغيير تبعيات التطبيق |
| تجربة مسار إنشاء | قارئ مستقل اختار قائمة ومحرر نافذة ونمط كيان عادي لطلب اسم/كود/نشط، وفصل الحقول التجارية والاختيارية عن الأرقام والحالة المملوكة للخادم دون إنشاء التطبيق |
| تجربة مسار مراجعة | قارئ مستقل تتبع مراجعة تقرير قراءة فقط؛ وصل إلى المراجع الحالية وحافظ على منع تعديل المصدر والتشغيل غير المفوض |
| الروابط والحزم | فحص روابط الملفات المحلية وأرقام الكتل وتوليد الحزم الثماني عبر المولد ثم إعادة الفحص؛ أدلة التحقق النهائية مسجلة أدناه |
| الأرشيف | التحقق من وجود جميع وجهات النقل وعدم تكرارها. ظهر استكمال متزامن جديد بمحتوى مختلف في مسار مراجعة ترجمة القائمة الجانبية بعد نقل النسخة التاريخية؛ حُفظت النسخة الجديدة في الجاري وسُجلت في خريطة النقل. حفظ التحقق التشغيلي المعلق داخل السجلات؛ الأرشفة لا تعتبره ناجحًا |
| مراجعة الفروق | مقارنة نسخ قبل التعديل للتعليمات والمهارة والكتب والقوالب والأداة، ومراجعة فروق مستودع الوثائق والخلفية. نقل الموظفين والمستودع المحلي مطابق للنص الأصلي بعد توحيد نهايات الأسطر؛ عقد التأجير يحتفظ بملاحظة الموقع المؤرخة من المهمة السابقة |
| المراحل | اكتشاف وتجميد توثيقي ثم تحديث ومطابقة نهائية؛ مراحل قراءة/حفظ بيانات التطبيق وإجراءاته غير منطبقة |
| العقود والمخطط ودليل المستخدم | لا تغيير لواجهات التطبيق أو حساباته أو مخططه؛ لا ترحيل ولا تعديل دليل شاشة داخل التطبيق |
| أوامر لم تُشغّل | بناء، اختبارات تطبيق، تدقيق برمجي، قاعدة بيانات، ترحيل، متصفح، أدوات الرسم المحظورة، حفظ إصدارات، دفع أو نشر |

التحقق الختامي: 374 مستندًا جاريًا ضمن نطاق فحص الروابط، و619 رابط ملف
محليًا، وصفر أهداف مفقودة. نجح فحص الحزم الثماني وبنية المهارة والتحليل
النحوي لأداة الفحص وفحص المسافات في الفروق المحددة. يوجد 432 هدف مراجعة
مؤرشفًا بلا فقد أو تكرار، وثلاثة أهداف خلفية تاريخية. المسار الجاري الذي
أُعيد إنشاؤه بعد الأرشفة محفوظ كاستكمال متزامن مختلف، ولا يُحسب نسخة قديمة
لم تُنقل. هذه أدلة توثيقية ومصدرية ولا تثبت تشغيل التطبيق.

استُخدمت مهارة إنشاء المهارات لتنظيم المهارة القائمة، ومهارة Sigma كملخص
الكتب الجاري. وُزعت مراجعة الواجهة والخلفية وتصنيف الأرشيف على ثلاثة مسارات
محددة بنموذج الاستكشاف منخفض التكلفة، دون تداخل تحرير. بقيت قرارات النطاق
والتجميد والمهارة والأرشفة والتوليد والمطابقة النهائية لدى الوكيل الرئيسي.

رسائل حفظ إصدار مقترحة فقط:

```text
Documentation: docs(current-state): simplify screen workflows and archive history
Backend: docs(archive): isolate historical reviews from current endpoint guidance
```

## تحديث مراجعة دليل التحليل عند الإنشاء والصيانة بتاريخ ٢٧ أكتوبر ٢٠٢٦

الحالة: اكتملت صيانة الوثائق المطلوبة. طلب المالك إدراج مراجعة دليل التحليل
في نظام وثائق سيجما عند إنشاء شاشة جديدة أو صيانة الموجودة، ونقل الدليل
الذي أُعد في هذه المحادثة إلى مجلد الوثائق. هذه إضافة محددة إلى نظام الوثائق
القائم؛ لا تغير عقد أعمال أو سياسة مالية أو شكل تنفيذ شاشة.

جرى نقل دليل تحليل سبيد ومكتبته وملف الحزمة المضغوطة وبصمتها إلى
[مجلد المرجع الحالي](<F:/My Work/Shaban Documents/Shaban/sigma-erp/references/speed-analysis/README.md>).
حُفظ اسم المنتج الذي يشرحه المرجع، مع توضيح أنه دليل مساعد لتحليل سيجما
وليس وصفًا مثبتًا لمصدر سيجما أو اعتمادًا تلقائيًا لمقترحات التحليل.

| الموضع | التغيير وسبب اختياره |
|---|---|
| الكتاب الرئيسي والكتل الأولى والثانية والرابعة والسابعة | تملك الكتلة الثانية القاعدة؛ تدخل قبل تجميد العقود، وتوثق مصادرها في تقرير الميزة، وتطابق عند التسليم |
| ملف بداية الوثائق وتعليمات مساحة العمل | مسار واضح للإنشاء والصيانة والمراجعة والإصلاح، مع قراءة الجزء المتعلق بالمهمة فقط |
| مهارة مراجعة الشاشات | ملخص للقاعدة مع الكتل المالكة وسطر تاريخ، باستخدام مهارة صيانة المهارات |
| قوالب التخطيط والاكتشاف والمطابقة وقوالب تقارير الميزة والصيانة | تسجيل الفصل ومعرف المصدر المقروء فعلًا والمقارنة مع عقود سيجما والفجوات، أو عدم الانطباق المبرر |
| مرجع سبيد الخارجي | تحديث الوصول إلى المكتبة المحلية دون تغيير قواعد حساب العرض التجريبي |
| ملفات المرجع المنقولة | محتوى الدليل والحزمة محفوظ؛ مساعد التصدير يعتمد مجلده الحالي بدل المسار السابق |

التحقق الذي أُنجز:

- نجح فحص الحزم الثماني قبل التحرير. جرى توليدها جميعًا بالأداة، ثم نجح
  الفحص الختامي. تغيرت أجسام حزم التخطيط والاكتشاف والمطابقة؛ تغيرت بصمات
  المصادر فقط في حزم المراحل من الأولى إلى الخامسة. تمت مراجعة المعنى:
  المصدر الخارجي دليل وظيفي، والقرارات غير المحسومة ليست عقود تنفيذ.
- نجحت أداة فحص مراجع الكتب دون مسح مصدر التطبيق. نجح الفحص الإضافي لسبعة
  وثلاثين رابطًا محليًا في الملفات ذات الصلة دون أهداف مفقودة، وفحص روابط
  ثلاثمائة وثلاثة عشر ملفًا في مكتبة المرجع والدليل دون روابط محلية مكسورة.
- طابقت بصمة دليل وورد قبل النقل وبعده. نقل الملف لا يغير محتواه أو نتيجة
  مراجعته البصرية السابقة، ولا توجد دعوى باختبار شاشة فعلية في هذه المهمة.
- تمت مراجعة الفروق المحددة مقابل لقطات الملفات السابقة للمهمة، وفحص
  المسافات في الفروق داخل مستودع الوثائق. حُفظت التغييرات الموجودة مسبقًا.
- تعذر تشغيل مدقق المهارة الجاهز لفقد مكتبة تحليل البيانات الوصفية في
  بيئة بايثون. تمت مراجعة البيانات الوصفية غير المتغيرة وبنية المهارة
  والروابط وملكية القاعدة بصورة مستقلة؛ لا يُسجل المدقق الجاهز كفحص ناجح.

لا ينطبق اختيار شكل واجهة أو خلفية أو فحص أداء تطبيق أو فهرس بيانات هنا؛
المهمة تخص مسار الوثائق فقط. لم يُشغل بناء أو اختبار تطبيق أو تدقيق برمجي
أو متصفح أو قاعدة بيانات أو ترحيل أو حفظ إصدار أو نشر. لم تتغير مصادر
واجهة سيجما أو خلفيتها. تبقى مراجعة شرح سيجما داخل التطبيق بعد تنفيذ الشاشة
متطلبًا مستقلًا عن قراءة دليل التحليل قبل تثبيت عقودها.

الأدلة ولقطات ما قبل التعديل والفروق محفوظة في
[سجل مطابقة المهمة](evidence/analysis-guide-governance-2026-10-27/reconciliation.json).
رسالة حفظ إصدار مقترحة فقط:

```text
docs: require analysis guide review for new and maintained Sigma screens
```

# Audit 8 — مراجعة الوثائق باستخدام سوبر باورز — ٢٠٢٦-١١-٠١

| البند | القيمة |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| طلب المالك | استخدام الحزمة المثبتة لمراجعة وثائق المشروع |
| التفويض | مراجعة قراءة فقط؛ سجل النتائج وفهرسته فقط، دون تعديل الكتب أو التعليمات أو المهارات أو مصدر التطبيق |
| النتيجة | أربع ملاحظات في قابلية تحميل التعليمات، وحجم المهارة، وتوجيه التقارير، وإدراج مهارات المنهج في المدخل |
| حدود الحالة | اكتمل التدقيق المحدد أدناه؛ لم تُنفذ الإصلاحات، ولم تُعتمد مطابقة كل فقرة في الكتب أو كل شاشة في التطبيق |

## النطاق والطريقة

المراجعة تخص نظام الوثائق الحالي، بالاعتماد على الدليل الرئيسي وكتل الحوكمة والتناسب والأدلة والمطابقة، وخاصة Master8. أُعيد استخدام خطة توحيد الوثائق القائمة كسجل قرار سابق، دون تحويل أوضاعها التاريخية إلى حقائق حالية أو إعادة كتابة قراراتها المجمدة.

استُخدمت مهارات سوبر باورز للمراجعة المستقلة، وتقسيم التدقيق المتوازي، والتحقق قبل إعلان النتيجة. لم تستخدم دورة تطوير باختبارات أو إنهاء فرع أو إنشاء مساحة عمل معزولة؛ لا تنفيذ برمجي في هذه المهمة. ظلت تعليمات سيجما مالكة التفويض والقيود، ولم تمنح المهارات تفويضًا لتجاوزها.

حدد الجذر النطاق ومصادر السلطة وأتم فحص الحزم قبل التفويض. راجع مساعد مستقل التنقل والروابط وتصنيف الشاشات، وراجع آخر وثيقة الأرقام مقابل المالكين المشتركين المحددين فيها. راجع الجذر أدلة النتائج وأعاد فحوص الروابط والأعداد بنفسه. الموديلات موروثة؛ لا أعمال تحرير متداخلة ولا تفويض لمراجعة كامل مصدر التطبيق.

تضمن فحص التنقل ١٧ ملفًا: صفحة البداية وفهارس الكتب الثلاثة وفهرس الأرشيف وفهرسي المراجعات والمؤجل وملفات كتالوج الشاشات العشرة. شمل التدقيق الدلالي الانتقائي تعليمات المشروع والتوجيه العام ومهارة الشاشة وMaster8 ومسار التقرير ومرجع الأرقام ومصادره الرقمية المحددة. فحص مراجع الكتب شمل مجلدات الكتل والمهارة بحدوده الافتراضية، دون تمرير نطاق مصدر تطبيق.

## النتائج المرتبة بالأولوية

### ملاحظة أولى — أولوية أولى: حجم تعليمات المشروع يتجاوز ميزانية التحميل الافتراضية

المواضع: [بداية تعليمات المشروع](<F:/My Work/Sigma/AGENTS.md:1>)، و[حدود الترحيل](<F:/My Work/Sigma/AGENTS.md:632>)، و[الأوامر المحظورة](<F:/My Work/Sigma/AGENTS.md:638>)، و[التحقق المصدري](<F:/My Work/Sigma/AGENTS.md:669>).

الدليل المؤكد: حجم ملف المشروع ٤٩٬٨٣٤ بايت، وحجم التوجيه العام ٣٬٢١٦ بايت؛ المجموع ٥٣٬٠٥٠ بايت قبل مؤشرات المستودعات الفرعية. تنص [وثائق كودكس الرسمية](https://learn.chatgpt.com/docs/agent-configuration/agents-md#how-codex-discovers-guidance) على حد افتراضي مجمع قدره ٣٢٬٧٦٨ بايت. لم يظهر إعداد صريح لزيادة `project_doc_max_bytes` في ملف إعداد المستخدم المقروء، ولم توجد ملفات إعداد بالمواقع الثلاثة المحددة للمشروع ومستودعي التطبيق. اقتصرت قراءة الإعدادات على هذا المفتاح دون عرض بقية الإعدادات.

الأثر: عند استخدام الحد الافتراضي يمكن اقتطاع تعليمات تقع بعد حدود السلطة والحزم، ومنها حدود الترحيل والأوامر المحظورة والتحقق. حساب تقديري بالبايتات، بعد حجز حجم الملف العام، يصل إلى السطر ٤١٧ تقريبًا من ملف المشروع؛ يتغير الموضع مع تفاصيل إدراج الفواصل والملفات الإضافية. هذا إثبات لتجاوز الحد الافتراضي وخطره، وليس إثباتًا بأن جلسة التطبيق الحالية حُمّلت بهذا الحد أو أن مخالفة تنفيذ وقعت؛ القيمة الفعالة من معاملات التشغيل أو إدارة الجهاز لم تُفحص.

الإصلاح المقترح: جعل نقطة الدخول مختصرة وقابلة للتحميل، ووضع حدود التفويض والمحظورات الحرجة مبكرًا، ثم الإحالة إلى التفاصيل الحالية دون حذف قواعد. إن اختير رفع الحد مؤقتًا، يحسم المالك نطاق الإعداد ثم يُتحقق من سلسلة التعليمات الفعالة في جلسة جديدة؛ لا يكتفى بزيادة رقم دون مراجعة الحمل. لم يتغير أي إعداد أو ملف تعليمات في هذا التدقيق.

### ملاحظة ثانية — أولوية ثانية: المهارة عادت إلى تجميع التعليمات والتاريخ بدل التوجيه المختصر

المواضع: [جسم مهارة الشاشة](<F:/My Work/Sigma/.agents/skills/sigma-screen-refactor/SKILL.md:306>)، و[تعليمات صيانتها](<F:/My Work/Sigma/.agents/skills/sigma-screen-refactor/SKILL.md:839>)، و[جدول تاريخها](<F:/My Work/Sigma/.agents/skills/sigma-screen-refactor/SKILL.md:855>)؛ تقارن بقاعدة [الموجّه المختصر والأرشفة في Master8](<F:/My Work/Shaban Documents/Shaban/sigma-erp/master/08-packet-generation-and-governance.md:59>).

الدليل: المهارة ٩٧٬٤٧٤ بايت و٩٨٥ سطرًا بالعد المستخدم، وجسمها قبل جدول التاريخ يقارب ٦٠٬٤٥٨ بايت. يبدأ الجدول عند السطر ٨٥٥ ويحمل ١٢٢ صف مراجعة مؤرخًا، منها قرار رفع صفحة القائمة السابق الذي يذكر هو نفسه أن قرارًا لاحقًا حل محله. هذه مشكلة في الدور والمحتوى، لا مجرد تجاوز حد حجم غير منصوص عليه للمهارة.

الأثر: تحميل المهارة يسحب تفاصيل تنفيذ متخصصة وسجلًا واسعًا حتى للمهمة الصغيرة، ويعيد تكوين نسخة أخرى من القواعد خارج كتلها المالكة. لم تُقَس تكلفة الرموز أو مدة التنفيذ؛ لا تدّعي المراجعة قياس أثر أداء من حجم الملف وحده.

الإصلاح المقترح: اختصارها إلى اختيار المهمة وروابط الكتل والفحوص الأساسية، ونقل تفاصيل التنفيذ إلى أصحابها الحاليين والسجل المتجاوز إلى أرشيف موسوم، مع إبقاء المراجعات الضرورية الحالية وروابطها. تُراجع التغطية قاعدةً بقاعدة قبل الاختصار؛ لا يُحذف دليل أو قرار لمجرد قدمه. يتطلب التنفيذ صيانة المهارة وفق مهاراتها وقواعد الكتب، ولم يُنفذ هنا.

### ملاحظة ثالثة — أولوية ثانية: كتالوج الاختيار يستبعد التقرير المصفّح خلافًا للقاعدة المالكة

الموضع: [سؤال اختيار التقرير في الكتالوج](<F:/My Work/Shaban Documents/Shaban/sigma-erp/ui/screens/00-catalog.md:16>).

الدليل: يشترط الصف غياب ترقيم صفحات الخادم لاختيار نوع التقرير. في المقابل يصرح [نوع التقرير](<F:/My Work/Shaban Documents/Shaban/sigma-erp/ui/screens/07-report.md:9>) بأن النقل المصفّح وحده لا يغير نوعه، وتسمح [كتلة التقارير](<F:/My Work/Shaban Documents/Shaban/sigma-erp/ui/20-report-page.md:14>) بالحفاظ على عقده القائم، بما في ذلك العدد والمخرجات؛ وتؤكد [قراءة الجدول المصفحة](<F:/My Work/Shaban Documents/Shaban/sigma-erp/ui/20-report-page.md:47>) ذلك.

الأثر: من يبدأ بالكتالوج قد يمر بتقرير قائم ذي استجابة مصفحة إلى مسار قائمة إدارة السجلات الافتراضي، فيختار عقدًا ومكونات ومراجع غير مناسبة قبل قراءة استثناء التقرير.

الإصلاح المقترح: حذف شرط غياب ترقيم الخادم من سؤال الاختيار، وإحالة القارئ إلى عقد النقل والعدد والمخرجات في الكتلة ٢٠. القاعدة المالكة الحالية كافية؛ لا يتطلب تصحيح طبقة التنقل إنشاء قرار أعمال جديد. لم يُعدل الكتالوج لأن الطلب مراجعة فقط.

### ملاحظة رابعة — أولوية ثانية: مدخل المهارات لا يوضح دور مهارات المنهج المثبتة

الموضع: [فقرة المهارات الأخرى في صفحة البداية](<F:/My Work/Shaban Documents/Shaban/sigma-erp/README.md:112>)، مقابل [التوجيه العام لسوبر باورز](<C:/Users/user/.codex/AGENTS.md:3>).

الدليل: يقصر المدخل اختيار المهارات الأخرى على حاجة لمخرج مختلف، مثل مستند أو جدول، بينما أذن المالك باستخدام مهارات التخطيط والتشخيص والتنفيذ والمراجعة لكل المشاريع. هذه المهارات يمكن أن تخدم مهمة سيجما نفسها دون تغيير نوع مخرجها. التوجيه العام يؤكد بقاء أولوية قواعد المشروع، ولذلك لا تكفي إضافته وحدها لتوضيح المسار داخل مدخل الوثائق.

الأثر: قارئ مدخل سيجما قد يستبعد مهارة تشخيص أو مراجعة مناسبة للمهمة العادية، أو يفسر التكامل على أنه استبدال لمهارة الشاشة. لا يوجد دليل أن الصلاحيات الحالية قد اتسعت أو أن حدود سيجما أُلغيت؛ المشكلة في وضوح التوجيه وتوافقه مع قرار الاستخدام الجديد.

الإصلاح المقترح: فقرة قصيرة تميز مهارات المنهج عن مهارة المجال وعن مهارات المخرجات؛ تذكر أن مهارة سيجما والكتب والعقود تبقى مالكة متطلبات المشروع، وأن مهارات المنهج لا تمنح تنفيذ اختبار أو ترحيل أو التزام. لا حاجة لنسخ تعليمات الحزمة أو إضافة كل تفاصيلها إلى كتب سيجما. لم تُعدل صفحة البداية.

## ما اجتاز الفحص

| الفحص | النتيجة وحدودها |
|---|---|
| اتساق الحزم | نجاح الحزم الثماني في البداية؛ لا انجراف يستوجب توليدًا أو تعديل قوالب. نجاح البصمات يثبت التزامن ولا ينفي التعارض الدلالي في الكتالوج |
| مراجع الكتب والمهارة | نجاح `Check-BookReferences.ps1` دون `SourceScope`؛ لا مسح لمصدر التطبيق ولا ادعاء تحقق كل نوع أو رمز أو مثال برمجي |
| التنقل المستقل | إعادة فحص ٧٢٤ موضع رابط ملف محلي و٤٠ رابط عنوان في ١٧ ملفًا: صفر أهداف ملف مفقودة وصفر عناوين غير مطابقة بحسب محاكاة العناوين المصدرية. الأعداد للمواضع وليست للوجهات الفريدة؛ ليست معاينة لعارض أو متصفح |
| بوابات الطلب | صفحة البداية تميز التخطيط والمراجعة والتنفيذ والمؤجل؛ الأرشيف موسوم بلا سلطة مستقلة |
| المرجعان المضافان | الوصول إلى مرجعي الأرقام وفوترة العملاء من صفحة البداية وفهرس المراجعات صحيح؛ لم تُجر مراجعة مالية شاملة لمحتوى مرجع العملاء في هذه المهمة |
| وثيقة الأرقام | لم يثبت خلل توثيقي في النطاق المقارن: الكميات والتحقق وتقريب الناتج، وسياسة العملة وقيد الدفتر والعرض، والصرف، والضريبة والتوزيع. طوبقت مع المالكين المشتركين المحددين فيها، لا كل مستهلكي التطبيق |
| فصل السلطات | التوجيه العام يمنح قواعد المشروع الأولوية؛ لم تعدل الحزمة حدود التنفيذ الخاصة بسيجما |

## الأدلة وإعادة الفحص

استُخدم الحال الحالي للملفات، بما فيه التغييرات غير الملتزمة التي كانت موجودة قبل هذه المهمة. كانت هناك تغييرات قائمة في صفحة البداية وكتل واجهة وخلفية وحزم مولدة، والمرجعان الجديدان غير متتبعين؛ لم تُنسب إلى هذا التدقيق ولم تُرجع أو تُنظف.

| المصدر المقاس | البصمة عند التدقيق |
|---|---|
| تعليمات سيجما | `f41238a3bea80f1c7a6216d1806f8c3fed6d65c0dde6bc5acc71adc93a8edafb` |
| مهارة الشاشة | `9450d053539e72f9cf82f8e7d844e73bba1c3f29ffd24bc5832fce66b9c49f95` |
| صفحة بداية الوثائق | `1b82636cc34c49f729599da5ad9e002afc882e6ebaae75941b3946e8710efcc3` |
| الكتلة الرئيسية الثامنة | `a775b2d3f2ca0289c0de2f614e25703ed0f000bf7040f88c9ca6b4449f5e0491` |
| كتالوج الشاشات | `a2dde4998a46fbe11548d7f6ecf1e61ab444b815382ea53e26617b07e4076944` |

الأوامر المخصصة للوثائق التي نُفذت:

```powershell
& 'F:\My Work\Shaban Documents\Shaban\sigma-erp\recipe-system\Generate-SigmaRecipes.ps1' -Check
& 'F:\My Work\Shaban Documents\Shaban\sigma-erp\recipe-system\Check-BookReferences.ps1' -Show 40
```

فحص الروابط الإضافي يقرأ الملفات السبعة عشر المحددة فقط، ويعد كل موضع رابط محلي قبل اختبار وجود هدفه، ثم يفحص عناوين ملفات ماركداون بمحاكاة مشتقة من العناوين مع معالجة التكرار. يستبعد الروابط الخارجية ومحتوى الكتب المتقاعدة؛ لم تُقرأ الكتب المتقاعدة، ولم يُشغّل متصفح. تقدير سعة التعليمات يعتمد حد كودكس الافتراضي لا قراءة قيمة فعالة من جلسة تشغيل أخرى.

## ترتيب المعالجة المقترح وحدود التسليم

الأولوية الأولى معالجة قابلية تحميل التعليمات والتحقق من السلسلة الفعلية، ثم تصحيح سؤال التقرير وفق القاعدة القائمة، وتوضيح تكامل مهارات المنهج، ثم اختصار المهارة مع مراجعة عدم فقد القواعد. هذه توصيات مراجعة وليست خطة تنفيذ مجمدة أو تفويضًا لتعديل التعليمات والكتب.

المخرج هو هذا القسم ورابطه في فهرس المراجعات فقط. طُبقت اكتشافات ومطابقة مصدرية متناسبة مع تدقيق الوثائق؛ لا شكل واجهة أو نمط خلفية جديد، ولا تغيير API أو حساب أو AutoMapper أو دليل مستخدم داخل التطبيق. بوابات تحميل الشاشة والكاش والأداء والفهارس غير منطبقة كتنفيذ في هذه المهمة؛ لا ادعاء قياس أو امتثال عام للتطبيق.

لم تُشغل بناءات أو اختبارات تطبيق أو تدقيق برمجي أو قاعدة بيانات أو ترحيلات أو متصفح أو التزام أو دفع أو نشر. لم تتغير التعليمات أو المهارات أو الكتب أو الإعدادات أو الكود نتيجة المراجعة، ولم تُغلق الملاحظات بالتوثيق. تبقى معالجة النتائج والتحقق من التحميل الفعلي عند تنفيذ مهمة مصرح بها.

## عقد معالجة التدقيق الثامن — ٢٠٢٦-١١-٠١

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التفويض | طلب المالك: «نفذ التعديلات المطلوبة» بعد عرض الملاحظات الأربع |
| النطاق | إصلاح طبقة التعليمات والمهارة والتنقل فقط، مع حفظ قواعد سيجما وحساباتها وحدود تنفيذها |

القرارات المجمدة قبل التحرير:

١. تُختصر نقطة الدخول `AGENTS.md` وتعرض التفويض والمحظورات ومصادر السلطة مبكرًا. ينقل نص تعليماتها الحالي كاملًا دون تغيير إلى ملف حي ملزم `.agents/SIGMA_WORKFLOW_RULES.md` يُقرأ كاملًا قبل أي عمل في سيجما؛ يبقى دخول الجميع من `AGENTS.md`، ويُحدّث مرجع النسخة الحية عند تغيير قاعدة. لا تُرفع إعدادات كودكس، ولا تصبح النسخة المؤرخة مصدر قواعد.

٢. تُختصر مهارة الشاشة إلى توجيه المهمة والكتل وفحوص التسليم الأساسية. تحفظ نسختها السابقة كاملة في أرشيف موسوم خارج مسار اكتشاف المهارات، وتُراجع تغطية تفاصيلها من الكتب الحالية. لا يُسقط عقد شاشة أو قاعدة غير مملوكة بصمت؛ تُرقّى أي فجوة مثبتة في الكتلة المالكة قبل إغلاقها.

٣. يصحح سؤال التقرير المصفّح ليتبع UI20 القائم، وتوضح صفحة البداية أن مهارات المنهج تكمل مهارة سيجما دون تفويض إضافي. تتغير `README.md` والكتالوج فقط في هذه الشريحة المستقلة.

٤. توثق البنية الجديدة في Master8 والمهارة مع سطر مراجعة مؤرخ؛ تُولد الحزم المشتقة بأداتها وتُراجع دلاليًا ثم يعاد فحصها. تُحفظ لقطات ما قبل التحرير في `reviews/evidence/documentation-remediation-2026-11-01/`، ويُراجع فرق المهمة منفصلًا عن تغييرات الآخرين.

البدائل: زيادة حد التحميل فقط تبقي الحمل وتضخم المهارة؛ رفضت لهذا الإصلاح. حذف أو إعادة صياغة كل قواعد المشروع دفعة واحدة يحمل خطر فقد التفويض؛ اختير النقل الحرفي للنسخة الحية مع موجّه مختصر. لا UI أو Backend shape جديد؛ التنفيذ مستندات فقط. لا بناء أو اختبار تطبيق أو متصفح أو قاعدة بيانات أو ترحيل أو التزام أو نشر. فحوص الوثائق ومدقق بنية المهارة فقط ضمن التفويض.

## تنفيذ معالجة التدقيق الثامن ومطابقته — ٢٠٢٦-١١-٠١

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| النطاق المنفذ | الملاحظات الأربع في عقد المعالجة أعلاه؛ لا تعديل كود التطبيق أو سياسة أعمال أو إعداد كودكس |
| المتبقي | التحقق من تحميل سلسلة التعليمات فعليًا في جلسة كودكس جديدة؛ ليس دليل نجاح تشغيل مستمدًا من حجم الملفات |

### التغييرات وقرارات المطابقة

| الملاحظة | التغيير | دليل المطابقة وحدوده |
|---|---|---|
| حجم التعليمات | نقطة دخول مختصرة، والمحظورات والتفويض في البداية، ورابط قراءة إلزامية للملف الحي `.agents/SIGMA_WORKFLOW_RULES.md` | انخفض ملف الدخول من ٤٩٬٨٣٤ إلى ٦٬٧٤٠ بايت. محتوى الملف السابق كاملًا موجود حرفيًا في نهاية الملف الحي بعد مقدمة الانتقال، دون إسقاط أو إعادة صياغة قواعده. مجموع ملفات الدخول العامة والمشروع والمجلد الفرعي ١٠٬٩١٥ بايت للواجهة و١٠٬٦٦٠ للخلفية، أقل من الحد الافتراضي. لا تعديل للإعدادات ولا ادعاء بأن الملف الحي يُحمّل تلقائيًا؛ يجب قراءته بأداة الملفات |
| تضخم المهارة | استبدال الجسم والتاريخ الطويلين بموجّه المهمة وبوابات الأدلة وجدول concerns→blocks وملخص التسليم | انخفضت من ٩٧٬٤٧٤ إلى ٨٬٩٥٣ بايت، مع بقاء الاسم والوصف والبيانات الوصفية دون تغيير. تفاصيل المكونات والحالات توجَّه إلى كتلها المالكة كاملة بدل نسخها؛ النسخة السابقة محفوظة ببصمتها خارج اكتشاف المهارات |
| التقرير المصفّح | إزالة منع ترقيم الخادم من سؤال الكتالوج، والاحتفاظ بتمييزه عن إجراءات إنشاء وتعديل وحذف السجلات | إحالة مباشرة إلى UI20 وعقد الاستجابة والعدد والمخرجات؛ لا تغيير مسار تطبيق أو عقد استجابة |
| مهارات المنهج | تمييز التخطيط والتشخيص والتنفيذ والمراجعة عن مهارة سيجما ومعاييرها وعن مهارات المخرجات | قواعد المشروع والكتب والعقود وحدود التفويض تظل حاكمة؛ لا إذن تنفيذ مستقل من المهارة |
| الحوكمة والاشتقاق | تحديث Master8 وبيانات Master0 إلى الإصدار ١٫٣٢ وتاريخ التغيير المحدد، وسطر مراجعة المهارة وسجل التغيير | تاريخ التحقق العام القديم لم يتقدم. الحزم الثماني ولدت بأداتها؛ مقارنة baseline تثبت أن الفروق الجديدة فيها اقتصرت على بصمتي Master0 وMaster8، دون تغيير أجسام الحزم أو مراجعها المعتمدة |
| حفظ التاريخ | نسختا ما قبل الاختصار كاملتان مع فهرس أرشيف موسوم | [أرشيف الانتقال](<F:/My Work/Shaban Documents/Shaban/sigma-erp/archive/2026-11-01-documentation-routing/README.md>)؛ التطابق بالبايتات والبصمات مثبت، ولا يستدعي الموجّه تحميل الأرشيف لمهمة جديدة |

الأسطر والبصمات المذكورة في نتائج التدقيق الأصلية أعلاه تخص النسخ قبل المعالجة. بعد النقل، يُرجع في استرجاع دليلها إلى نسخ الأرشيف ولقطات البداية؛ القواعد السارية تؤخذ من نقطة الدخول والملف الحي والكتب، ولا يُعاد تطبيق توجيه تاريخي تجاوزه قرار لاحق.

### الفحوص والأدلة

- نجح فحص الحزم الثماني قبل التحرير وبعد التوليد، ونجح فحص مراجع الكتب والمهارة دون مسح مصدر التطبيق. اجتاز فرق مستودع الوثائق المحدد فحص المسافات؛ روجعت فروق المهمة مقابل لقطات البداية للحفاظ على تعديلات المستخدم القائمة.
- تحقق مستقل من وجود ٦٣ رابطًا محليًا في ملفات الدخول والحوكمة والمهارة والمدخل والكتالوج وفهرسي الأرشيف المختارين؛ لا وجهة مفقودة في هذا النطاق. ملف المصالحة يحمل القيم والبراهين، ولا يصف ذلك كمعاينة متصفح.
- تعذر تشغيل `quick_validate.py` لغياب مكتبة `yaml` في بيئة بايثون. لم يثبت كفحص ناجح ولم تُثبت حزمة جديدة لتجاوزه؛ طوبقت البيانات الوصفية غير المتغيرة حرفيًا مع النسخة السابقة، وفحص الاسم والوصف والبنية والروابط والمواضع غير المكتملة مستقلًا. يظل هذا القيد مسجلًا منفصلًا عن نجاح فحوص الوثائق.
- راجع مساعد مستقل تغطية تفاصيل المهارة القديمة في المالكين الحاليين، وراجع مساعد آخر توجيه ثلاثة سيناريوهات من الملفات الحية. الجذر يملك الحكم النهائي وراجع النتائج والبراهين؛ لا تعديل متداخل ولا مصدر تطبيقي تغيّر.

الأدلة المحفوظة:

- [لقطات البداية وفهرسها](evidence/documentation-remediation-2026-11-01/baseline.json).
- [فرق المهمة مقابل البداية](evidence/documentation-remediation-2026-11-01/scoped-changes.diff).
- [مقارنة الحزم دلاليًا ضمن الفروق](evidence/documentation-remediation-2026-11-01/packet-semantic-comparison.json).
- [حفظ القواعد والأحجام والروابط وحدود المدقق](evidence/documentation-remediation-2026-11-01/reconciliation.json).
- [مراجعة تغطية تفاصيل المهارة في أصحابها الحاليين](evidence/documentation-remediation-2026-11-01/coverage-review.md): لا فجوة تنفيذية مثبتة أو مسار مفقود ضمن المقارنة الانتقائية المسجلة.

### مراجعة سيناريوهات الاستخدام

| السيناريو | النتيجة المصدرية المستقلة |
|---|---|
| مراجعة فاتورة عميل | تُقرأ نقطة الدخول والملف الحي والمهارة ثم العقد ونوع المستند المالي ومراجعه؛ تبقى مراجعة مصدرية بلا تعديل، مع بوابات الأدلة والفجوات. لا يستدعي مسارها الأرشيف |
| تنفيذ إصلاحات مؤكدة بخطة مجمدة لقائمة صغيرة | تُستهلك العقود الحالية ويُنفذ الإصلاح المؤكد دون إعادة موافقة محسومة؛ يتحدد التناسب من نطاق الإصلاح، وتُطابق الواجهة والدليل والفرق مع بقاء التشغيل المحظور مؤجلًا |
| مراجعة تقرير مصفّح وطباعة نتائجه كلها | يظل تقريرًا مع عقد paging/count/output وإثبات اكتمال المخرجات؛ طلب الطباعة يخص مساره الصريح ولا يجيز إصلاح المصدر أو اختبارات عامة. السيناريو فحص توجيه فقط، لا طباعة فعلية أو تشغيل متصفح |

### الملفات والحدود والتسليم

ملفات مساحة العمل: `AGENTS.md` والملف الحي الجديد ومهارة الشاشة، وقسم العقد والتنفيذ في هذا السجل ورابط الفهرس وأدلة المهمة. ملفات مستودع الوثائق: صفحة البداية وMaster0/8 وكتالوج الشاشات وسجل التغيير وفهرس الأرشيف ونسختا الأرشيف وفهرسهما، والحزم الثماني عبر المولد فقط. لا تغيير في قوالب أو بيان الحزم ولا في الكتب الخلفية أو القواعد التنفيذية للواجهات نتيجة هذه المهمة.

المراحل المنطبقة: اكتشاف ومقارنة وخطة انتقال محددة وعقد مجمد وتنفيذ الوثائق ومطابقة مصدرية. مراحل كود الواجهة والخلفية والإجراءات ودليل التطبيق غير منطبقة، ولا إعدادات أو حسابات أو AutoMapper أو مخطط بيانات أو فهارس أو ترحيل جديد. لم تُشغل اختبارات تطبيق أو بناء أو تدقيق برمجي أو متصفح أو قاعدة بيانات أو ترحيل أو التزام أو دفع أو نشر.

تحقق المالك المتبقي: بدء جلسة جديدة من كل مستودع والتأكد من ظهور نقطة الدخول، وقراءة الملحق الحي كاملًا، ثم اختيار المهارة والكتل المناسبة بدل نسخ الأرشيف. لا تعني هذه الخطوة إعادة الموافقة على القرارات المجمدة أو تفويض تشغيل محظور.

رسالة التزام مقترحة لمستودع الوثائق فقط، دون تنفيذ التزام:

```text
docs: compact Sigma instruction routing and reconcile workflow guidance
```

## مراجعة السرعة وتفادي الأخطاء وتنفيذها — ٢٠٢٦-١١-١٩

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| الطلب | مراجعة نظام التخطيط والمراجعة والبناء، ثم تنفيذ كل التحسينات بالترتيب المقترح |

### النتائج

| # | الملاحظة | الأثر |
|---|---|---|
| ١ | القراءة الإلزامية قبل أي مهمة حوالي ٣٨٠ كيلوبايت، منها فهرس المراجعات ٢٤١ كيلوبايت سردًا | بطء واستهلاك سياق |
| ٢ | الاختبارات والفحص الآلي ممنوعان حتى أثناء التنفيذ؛ أغلب التسليمات "تنفيذ معلّق" | تسرّب أخطاء للمالك |
| ٣ | سجل مراجعات المهارة ٧٨ صفًا داخل المهارة، وصفوف التوجيه تحولت إلى قواعد كاملة | تضخم مستمر |
| ٤ | قواعد مكررة في أربعة إلى خمسة ملفات وتاريخ مختلط بالقواعد | تناقض وانجراف |
| ٥ | ترتيب الأولوية بثلاث صيغ، وجملة "نقطة الدخول الوحيدة" قديمة | غموض |
| ٦ | جدول المهارة مكسور، وقاعدة ترحيل خارج أي عنوان، وسكربت الفحص يفشل مع `-File` | أخطاء صامتة |

### التنفيذ

| التحسين | التغيير |
|---|---|
| ١ الفهرس | `INDEX.md` جدول مختصر وبحث بالاسم؛ السرد محفوظ حرفيًا في `INDEX_HISTORY.md` |
| ٢ الاختبارات | Master5 يمنح تشغيل اختبارات الكود المعدل وفحص الملفات المعدلة أثناء التنفيذ المصرح؛ مطابقة UI29 وMaster1/7 والقوالب |
| ٣ المهارة | قائمة بوابات وجدول إشارات وخمسة صفوف؛ السجل في `archive/SKILL_REVISION_HISTORY.md`؛ تحقق أن كل معرّفات التوجيه موجودة في كتلها |
| ٤ الملف المرافق | نواة إلزامية وأقسام عند الحاجة تحت `.agents/workflow/`؛ النص السابق محفوظ |
| ٥ الأولوية والتكرار | قائمة أولوية واحدة في القسم الأول من النواة؛ مالك واحد لكل قاعدة (Master8) |
| ٦ الإصلاحات والأتمتة | ميزانيات حجم وفحص الجداول والتكرار في `Check-BookReferences.ps1`؛ إصلاح مسار التشغيل؛ عنوان مستقل لقاعدة الترحيل؛ افتتاحية متدرجة حسب المستوى؛ توجيه نماذج Codex موسوم بأداته |

### تغطية القواعد المنقولة

| القسم السابق في الملف المرافق | مكانه الحالي |
|---|---|
| السلوك الافتراضي والأوامر والمراحل والقراءة فقط | النواة §٢ |
| البيانات التجريبية وصلاحيات القواعد والممنوعات | النواة §٤ وMaster1 |
| بوابات المرجع والتحميل والكاش والسرعة والمكونات والأرقام | النواة §٥ والمهارة §٢ والكتل المالكة |
| التواصل العربي | النواة §٨ |
| توزيع الوكلاء | `workflow/delegation.md` |
| الأدلة والحزم والأدلة المتقاعدة | `workflow/guides-and-packets.md` |
| قواعد الواجهة والخلفية والترحيل ومراجعة الفرق | `workflow/implementation-rules.md` |
| القرارات والمخرجات والتقرير النهائي | `workflow/artifacts-and-report.md` |

### التحقق

- الحزم الثماني أعيد توليدها، وفحص الاتساق `OK`.
- فحص المراجع نجح بالطريقتين، وبلا تجاوز ميزانية أو جدول مكسور أو تكرار.
- اختُبر الفحص الجديد على النسخة القديمة من المهارة فكشف تجاوز الحجم والجدول المكسور، وعلى نسخة مكررة من النواة فكشف التكرار.
- معلّق على المالك: تجربة مهمة حقيقية من المستوى الصغير والمتوسط بالتعليمات الجديدة، وقرار نقل طبقة التعليمات والمراجعات إلى نظام الإصدارات (القرار D7)، وحذف مجلد `.git` الفارغ في جذر المساحة إن رغب.

## تخفيف استهلاك التوكنز في الوثائق — ٢٠٢٦-١١-١٩

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| الطلب | تنفيذ مقترحات تقليل التوكنز بالترتيب: ملفات الوضع الحالي، التوجيه للأقسام، تنظيف الكتل، ميزانيات الحجم؛ قرار اللغة للمالك |

| البند | النتيجة المقاسة |
|---|---|
| ملفات الوضع الحالي | خمسة ملفات من ٢٫٢ إلى ٣٫٤ كيلوبايت بدل قراءة مراجعات من ١٣٠ إلى ٣٠٦ كيلوبايت |
| التوجيه للأقسام | ثمانية صفوف في المهارة تشير إلى أقسام مسماة في UI1 وUI13 وUI20 وUI22، مع قاعدة قراءة الأقسام في النواة وMaster8 |
| UI22 | من ٥٠٫٤ إلى ٣٨٫٩ كيلوبايت (−٢٣٪) بدمج التكرار دون تغيير قاعدة |
| UI1 وUI13 وUI20 | −١ إلى −٢٪ فقط بحذف ٢٣ عبارة حالة و٣٤ قوسًا مؤرخًا و١١ تاريخ عنوان؛ محتواها قواعد فعلية |
| ميزانيات الحجم | ملف الوضع الحالي ٤ كيلوبايت (فشل)؛ تنبيه للكتل فوق ٣٠ وللمراجعات فوق ٤٠ بلا ملف وضع حالي: ١١ كتلة و٥٥ مراجعة حاليًا |

النصوص قبل التنظيف في `archive/2026-11-19-block-history/` بالوثائق. الخطوة
التالية الأعلى أثرًا لـUI1 وUI13 وUI20: تقسيم كل منها إلى كتل أصغر بتحديث
بيان الحزم، وهو تغيير حوكمة يحتاج موافقة المالك. قرار لغة ملفات الوكيل معلّق.

## Block split, English files and generated current-state indexes — 2026-11-19

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Request | Execute all remaining proposals; agent-facing language English |

| Change | Measured result |
|---|---|
| UI1 topic folder (5 files) | main file 66.1 → 7.7 KB |
| UI13 topic folder (8 files) | main file 69.8 → 13.4 KB |
| UI20 topic folder (5 files) | main file 65.6 → 21.5 KB |
| Generator | fingerprints main file + topic folder; a one-line topic edit made 3 dependent packets stale, reverting restored 8/8 OK |
| Language | Master8 and companion section 8: agent-facing files English; INDEX and five written current-state files translated |
| Current-state coverage | 52 generated indexes; reviews over 40 KB without a current-state file: 55 → 0 |
| Checks | packets 8/8 OK; reference check exit 0 with 8 block size warnings (UI2, UI6, UI7, UI14, UI22, UI24, BE15, BE18) |

Reading all 55 large reviews to write summaries would have cost several MB of
reading, more than the summaries save; generated indexes give section-level
access now and are replaced by written summaries on the next round of each feature.

## Topic folders for the remaining eight blocks — 2026-11-19

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Request | Split the eight remaining blocks the same way |

| Block | Main file before → after | Topic files |
|---|---|---|
| UI2 | 44.4 → 2.6 KB | 4 |
| UI6 | 45.8 → 15.3 KB | 5 |
| UI7 | 31.4 → 2.0 KB | 4 |
| UI14 | 47.8 → 12.7 KB | 4 |
| UI22 | 38.9 → 9.1 KB | 4 |
| UI24 | 41.1 → 12.9 KB | 3 |
| BE15 | 43.9 → 5.0 KB | 4 |
| BE18 | 33.6 → 11.4 KB | 3 |

Moves are verbatim (line ranges aligned to headings; UI6 boundaries checked at
paragraph level). Packets 8/8 OK after regeneration; reference check has no
findings and no size warnings.

## Documentation usability and command consistency audit — 2026-11-19

| Item | Value |
|---|---|
| Status | Closed |
| Owner verification pending | no |
| Scope | Tier L, documentation system only. This round records findings. The proposed maintenance and real-task pilot are open. |

### Findings in implementation order

1. **Correct the Arabic Verify guidance.** The [Arabic command reference](<F:/My Work/Shaban Documents/Shaban/sigma-erp/SIGMA_COMMAND_REFERENCE_AR.md>) describes Verify as source-only in its command table and requires fresh authorization for builds and database access in the following note (lines 18 and 27–28). The [live command table](../.agents/SIGMA_WORKFLOW_RULES.md) explicitly allows scoped builds and experimental database reads for Verify (line 81). A reviewer following the Arabic entry could leave authorized checks pending. Use a short Arabic description and link to the owning row for permissions. Acceptance: both entry points give the same answer for a scoped build, experimental database read and browser run. The current authority already resolves the conflict.
2. **Cover public entry files in reference checks.** The [Master index](<F:/My Work/Shaban Documents/Shaban/sigma-erp/SIGMA_FEATURE_REVIEW_MASTER.md>) presents “Master block 17” as its citation example (line 4). The same index lists blocks 0–8. The [checker](<F:/My Work/Shaban Documents/Shaban/sigma-erp/recipe-system/Check-BookReferences.ps1>) selects the three book directories and specific instruction files, omits the root indexes and skips the review index for link/block checks (lines 145–155). Use an existing block in the example. Include the public indexes and entry pages in the same check and validate local heading fragments. Acceptance: the current invalid example is reported before correction and the corrected entries pass. A manual navigation sample currently resolves, as recorded below.
3. **Make a returning reviewer’s first read actionable.** Of 57 active current-state files, 52 explicitly identify themselves as generated indexes (Archive, Deferred and evidence excluded). The [currency example](CURRENCY_CURRENT_STATE.md) reports the first recorded Draft status and links to multiple later contract and reconciliation records. It does not identify the governing decisions or the next open check. It is a locator. Keep the existing next-touch conversion rule: when work resumes, record the governing contract, latest verified outcome and remaining action with links. Demonstrate this on the next active feature; no bulk rewrite is needed.
4. **Complete the existing version-control handoff (D7).** Git identifies the Shaban repository as the owner of the books and tracks the Master index and reference checker in the documentation tree (the README and checker were directly checked with Git). Git finds no worktree from the active reviews directory. The [artifact ownership rule](../.agents/workflow/artifacts-and-report.md) assigns the outstanding move and commits to the owner. Until then a checkout of the books alone cannot reproduce the active workspace review records. Verify the entry rules, companion and a recent frozen contract are all retrievable at a named revision and that existing entry paths still work.

### Executed evidence and limits

- The packet generator in check mode returned eight OK results and exit 0. The reference checker without SourceScope returned exit 0 and no findings. No regeneration was required.
- An independent source navigation check followed 297 local link occurrences in 17 files: documentation README, Arabic command reference, three book indexes, recipe README, ten screen catalog/shape files and active review index. All targets existed; all ten linked heading fragments matched source headings under the check's normalization. This establishes file and heading resolution in the sample. It does not verify policy meaning or browser rendering.
- A report route traced from the catalog through screen 07 to UI20 and UI21. Preserve shape-first routing, topic files and packet fingerprints. A filename-only search in the documentation root, workspace instructions and reviews found no retired-guide filenames in that search scope.
- To evaluate actual reading cost, retain the pending small-task and single-screen pilot. On each task record files opened before the first governing decision, time to locate that decision, and any historical files reopened. No timing improvement was measured in this audit.
- The audit touched review records only. Application code, databases, runtime, build, tests and lint were outside scope.

## Documentation audit fixes and D7 preparation — 2026-11-19

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Boundary | Owner approved local transfer preparation. Installation and Git recording follow the owner's baseline commit. |

- Updated the Arabic Verify entry to route to the live command table. Fixed the Master index's citation to refer to block 4.
- Extended the reference checker to the public entry files and active review index, including same-page and cross-file heading fragments. An isolated negative fixture previously yielded no diagnostics. It now reports exactly the invalid block, missing review file, broken local heading and broken cross-file heading. The same run accepts an Arabic heading, a duplicate heading suffix and a valid same-page link. The updated checker caught block 17 in the real Master index before its correction. The final documentation check had zero findings.
- Regenerated all eight packets. Output hashes matched those before regeneration and all eight passed the synchronization check.
- Replaced the generated [currency entry](CURRENCY_CURRENT_STATE.md) with a written summary of sections 13 and 14, the governing ledger and revaluation contracts, source verification and pending acceptance. Other features retain next-touch conversion (51 generated indexes remain).
- Prepared the [D7 transfer handoff](SIGMA_DOCUMENTATION_SYSTEM_VERSION_CONTROL_HANDOFF.md). The local staging set is separate from both live paths and the Shaban worktree. Its adjacent manifest is the file-level content baseline. Repeat the comparison at cutover to pick up intervening work.
- The real-task timing pilot remains open for the next small change and single-screen review. No application build, runtime, browser or database work was needed in this round.
