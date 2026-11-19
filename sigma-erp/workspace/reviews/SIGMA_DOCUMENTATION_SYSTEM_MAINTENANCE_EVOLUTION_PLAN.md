# Sigma Maintenance / Evolution Plan: Documentation System Unification

This is the reviewable pre-implementation plan for aligning the whole Sigma
documentation and agent-instruction system with the `sigma-screen-refactor`
skill. It records evidence and proposed decisions. It does not authorise any
edit until the owner decisions in the Decision Review are answered and the plan
is marked Frozen.

## Plan metadata

| Item | Value |
|---|---|
| Change/capability | Sigma documentation and agent-instruction system |
| Requested outcome | Owner statement, 2026-09-28: "The skill is the last correct thing I reached. Review the whole system professionally." Every other instruction source must agree with the skill, or be proven by source code to be the one that is right |
| Plan date | 2026-09-28 |
| Plan owner | Sigma owner. Prepared by Claude (Cowork) |
| Status | **Frozen** 2026-09-28 — D0 to D8 decided. S2 to S5 and S7 executed by Claude on 2026-09-28 (see Implementation record); S1 and S6 are owner actions; S8 is separate feature work |
| Master version | 1.6 (verified 2026-09-20) |
| UI book version | 0.68 Draft canonical (file 2026-09-22) |
| Backend book version | 0.16 Draft canonical (file 2026-09-21) |
| Skill revision | last history row 2026-09-25 (file 2026-09-25 18:35) |
| PLAN packet check result | 198 of 198 packet fingerprints match the current guides. This was recomputed read-only because the device shell is unavailable; `.workbuddy-ai/recipe-check.log` (2026-09-22) also reports OK |
| Existing working-tree changes | The documentation repository had 20 uncommitted files at the 2026-09-21 audit. The workspace root, the skill, and `reviews/` are not under version control |
| Companion record | `SIGMA_DOCUMENTATION_SYSTEM_AUDIT.md`, "Audit 2" |

## Scope and boundaries

| Item | Decision/evidence |
|---|---|
| Business outcome | One consistent rule set. Every agent (Codex, Gemini/Antigravity, Kiro, WorkBuddy, Claude) that follows any entry point produces the same code the skill describes |
| In scope | Root `AGENTS.md`, `GEMINI.md`, `PROJECT_MAP.md`; both folder-level `AGENTS.md`; `.agents/skills/sigma-screen-refactor/SKILL.md`; `SIGMA_FEATURE_REVIEW_MASTER.md`; `SIGMA_UI_PATTERNS.md`; `SIGMA_BACKEND_PATTERNS.md`; `SIGMA_COMMAND_REFERENCE_AR.md`; `sigma-erp/README.md`; `recipe-system/` (manifest, templates, generated packets); tool memories and hooks; the conventions for `reviews/` artifacts |
| Explicit non-goals | Changing application source. Source defects found here are listed as follow-up feature work (Slice S8) and are not fixed by this plan. Rewriting historical review artifacts. Running build, test, lint, migration, database, browser, or Graphify |
| Affected workflows/roles | Every screen review, refactor, and implementation, and every agent tool that reads these files |
| Known operational constraints | The device shell is unavailable, so edits go through stage and commit. Feature files eight folders below `F:\My Work\Sigma` cannot be staged, so feature-level evidence came from the review artifacts, not from the feature source. `Generate-SigmaRecipes.ps1` must be run by the owner in PowerShell |

## Existing-State Inventory

| Concern | Current owner/source | Current behavior | Consumers | Known debt/constraint | Evidence |
|---|---|---|---|---|---|
| Authority order | `AGENTS.md:247-253`, Master "Authority order" | Master and books, then packets, then reference, then screenshots, then inference. **The skill is not listed**, yet `AGENTS.md:9-11` says it "owns screen-specific implementation conventions" | Every agent | The UI book and the skill each call themselves the single authority | `AGENTS.md`, `SIGMA_UI_PATTERNS.md` preamble, `SKILL.md:8` |
| Screen conventions | Skill (2026-09-25) **and** UI book 0.68 (2026-09-22) | The skill was written after the book and diverges in the 21 rows of the Logic Ambiguity Register | Screen agents | The book is not updated when the skill learns | Register below |
| Generated packets | `recipe-manifest.json` over the three books | Fingerprint only the books; the skill is invisible to the recipe system | Phase agents | Packets can pass `-Check` while contradicting the skill | Manifest `books` has `master`, `ui`, `backend` only |
| Gemini/Antigravity entry | `GEMINI.md` | Restates five invariants, one with its own margin value; mandates automatic skill updates after every task; cites the wrong section (§8, not §11) | Gemini agents | Third rule source | `GEMINI.md:9-18` |
| Codex/Graphify entry | Folder `AGENTS.md`, `.codex/hooks.json` | "Graphify query first", "graphify update after edits"; a hook runs `graphify hook-check` on every Bash call. The root bans automatic Graphify. Graph last built 2026-09-20 | Codex agents | Conflict with the root file; stale graph | Hook files; `graphify-out/` modification time |
| Tool memories | `.workbuddy-ai/memory/MEMORY.md` | Holds its own rule copy. Contradicts itself on `box-sizing`, and its paginator value is `10px 0 4px` while the source is `10px 0 12px` | WorkBuddy | Unowned copy that drifts | `MEMORY.md`; `data-table.component.scss:248-255` |
| Versioning | none for the workspace root | `AGENTS.md`, `GEMINI.md`, `PROJECT_MAP.md`, `.agents/`, `reviews/` have no history; `SigmaBackend/.gitignore` ignores `.agents`, `.codex`, `.kiro` | Owner | No diff or rollback for rule changes | Empty root `.git`; `.gitignore:17-20` |
| Review artifacts | `AGENTS.md` "Output artifacts" | 47 files. Four use names outside the defined set; status wording is free text; 12 Lease Agreement files sit outside their folder | Future agents | Hard to see what is open | Audit 2, A2-18 |

## Logic Ambiguity Register

Each row compares the skill with the other sources and with application source.
**Verdict** uses the Master statuses. "Source" means the file was opened and
read in this review.

### UI rules

| # | Rule | Skill says | Book / other says | Source evidence | Verdict | Proposed resolution |
|---|---|---|---|---|---|---|
| C1 | Route host height | `height: calc(100dvh - header - toolbar - footer - 12px)` (§2.2, checklist) | Container-fill `height: 100%`; the calc is forbidden (block 1) | `styles.scss:120-167`: the shell sets `--bs-app-toolbar-height: 31px` on desktop **only so that 34 legacy calc screens keep working**, and states the override can be deleted as they migrate | **Conflicting.** Both render today, but the skill's calc depends on a compatibility shim the shell intends to remove | **D1.** Recommend adopting container-fill in the skill; the skill's panel/card styling stays as is |
| C2 | Table fill and paginator grounding | `scrollHeight="flex"` plus `::ng-deep` overrides on `.p-datatable-wrapper` and `.p-paginator { padding: 6px 0 4px !important }` (§4.1) | Feature paginator and `.p-datatable-*` rules are forbidden. Backlog 33 says the shared bottom padding "is now 4px" | `data-table.component.scss:58-69` forces `max-height: var(--sigma-data-table-scroll-height, 288px) !important`; `scrollHeight="flex"` makes that variable invalid, so without an override the grid does not fill. The shared paginator is `padding: 10px 0 12px` (`:254`), **not 4px** | **Skill correct in effect; book stale.** The shared component lacks a fill mode, so the skill's workaround is currently required | Keep the skill rule, labelled Transitional. Correct backlog 33. Create a shared `fill` mode in `app-data-table` (S8), then replace the workaround with one input |
| C3 | Calendar icon | Filter range and editor calendars use `[showIcon]="true"` with no `iconDisplay` (§3.3, §7.6) | `showIcon` alone renders nothing; use `iconDisplay="input"` or omit it (block 17, backlog 32) | `styles.scss:2291-2293` `.p-datepicker-trigger { display: none !important; }` | **Skill snippet ineffective (Confirmed by source)** | **D2**: whether an icon is wanted. Either add `iconDisplay="input"` or remove `[showIcon]` in the skill |
| C4 | Editor calendar typing | `[readonlyInput]="false"` + `[keepInvalid]="true"` in editors (§7.6) | `[readonlyInput]="true"` on detail and editor forms (block 17) | Behaviour choice; the source does not decide it | **Conflicting (policy)** | Adopt the skill, as directed. Update block 17 and state that `parseDateValue` owns the typed-input parsing |
| C5 | Calendar auto-open in dialogs | `[focusOnShow]="false"` on the dialog, plus `[showOnFocus]="false"` and `(click)="dateCal.showOverlay()"` | Keep `[showOnFocus]="true"`; use `[focusOnShow]="false"` (block 17) | `editor-dialog.component.ts` exposes `focusOnShow` (default `true`) | **Conflicting (policy).** Both avoid auto-open. The skill's version stops keyboard focus from opening the panel, which is acceptable because the input is typeable (C4) | Adopt the skill. Add a keyboard check to the owner verification list |
| C6 | Filter strip surface | `flex-direction: column; gap: 8px; padding: 8px 12px` (§3.1) | `flex-wrap: wrap; gap: 5px 8px; padding: 5px 8px 6px` (block 4) | `styles.scss:2842-2890` enforces the 34px control height for any class ending in `-filters`. The rest is visual | **Conflicting (visual)** | Adopt the skill values into block 4 |
| C7 | Filter strip inline margin | §2.3 `margin: 0 0 6px 0`, but §2.5 says to apply the title's 8px inline inset | Book text 8px, book snippet `0 0 6px`; `GEMINI.md` `0 8px 16px 8px` | `feature-title.component.scss:11` `margin: 8px 8px 16px` | **Conflicting in four places, including inside the skill** | **D3.** Recommend `margin: 0 8px 6px`, which matches skill §2.5 and the title edge, in every file |
| C8 | Base component | All list and details components extend `BaseComponentService`; do not re-inject `Router` (§6) | Book silent; `GEMINI.md` agrees | `base-component.service.ts` provides `loading`, `router`, `activatedRoute`, and also reads `subscriptionId` from `localStorage` | **Confirmed** | Adopt into books. Add: never send `this.subscriptionId` in a payload (UI backlog 19) |
| C9 | Two-tier loading and lookup race | Global loader for primary loads and actions via `finalize`; lookups do not toggle it (§6) | Block 22 has global-loader and `finalize`; backlog 27 names the boolean race | `loading.service.ts` is a single `BehaviorSubject<boolean>` | **Confirmed.** The skill's lookup rule is the correct mitigation | Adopt into block 22 |
| C10 | View-only dialog footer | `[primaryActionVisible]="false"` in View (§7.2) | Not stated | `editor-dialog.component.ts` `primaryActionVisible = true`; in View mode the primary action emits `editRequested` | **Confirmed** | Adopt into blocks 13 and 15 |
| C11 | Empty state key | `general.noDataFound` default | Not stated | `data-table.component.ts:104` `emptyMessage = 'general.noDataFound'` | **Confirmed** | Adopt into block 6 |
| C12 | `@for` tracking | Never `track $index`; the reason given is TS2339 (§5.1) | Not stated | `@angular/core ^17.0.8`. `track $index` is valid Angular 17 syntax, so the stated cause is doubtful | **Uncertain (rationale).** The rule itself (`track row` / `track item.id`) is safe | Keep the rule. Replace the rationale with "stable identity; `$index` re-creates rows on insert or remove", and mark the TS2339 note as owner-to-verify |
| C13 | Colour forks | Bans teal `#20b2aa`, `#1a7f82`, `#146264`, `#17a8aa` | Backlog 1 lists blue forks `#2497d4`, `#1478b5` | `--sigma-primary: #3498db` (`styles.scss:20`) | **Both incomplete** | Merge the two lists in both files |
| C14 | Typed date snippet | `const range: any` (§3.3) | Master: no `any` in forms or payloads | — | **Skill violates Master** | Type it as `Date[] \| Date \| string \| null` |
| C15 | Workspace tab colours | Hard-coded `#edf2f6` / `#5c7487` (§7.3) | Shared `app-editor-tabs appearance="workspace"` owns appearance | — | **Conflicting (ownership)** | The skill states `appearance="workspace"` only; values live in the component |
| C16 | Current-month default range, single range picker, no native date input, dual-layer status text, `@ViewChild({static:true})` + `initColumns()` | Skill §3.3, §4.3 | Book has the range picker; the rest is absent | — | **Skill adds rules** | Adopt into blocks 5 and 17 |

### Backend rules

| # | Rule | Skill says | Book / other says | Source evidence | Verdict | Proposed resolution |
|---|---|---|---|---|---|---|
| C17 | Pattern set | "4 Mandatory … Strictly Binding"; Pattern 5 reserved (§8.1) | Five patterns; Pattern 2 **Transitional** | `PurchaseOrderService.cs:63`, `:69` still use `ExistsAsync(x => ids.Contains(x.Id))`, the "any" defect. The skill's step 3 (count comparison) is the right rule, but the reference does not follow it | **Skill rule correct; reference defective** | Adopt the skill's wording and keep Pattern 2's reference labelled Transitional with backlog 3 |
| C18 | Pattern 3 transaction | The whole flow MUST run in an explicit transaction | Explicit transaction only on multi-save paths; one save uses the implicit transaction | `MiscellaneousInvoiceService.cs:24-28` opens the transaction **conditionally** (`customerAccountId > 0 ? Begin… : null`); `InvoiceService.cs` opens it where several saves occur | **Skill contradicted by source** | Correct the skill to the multi-save rule, which `AGENTS.md` also states |
| C19 | Default page size | `PageSize` default 10 | Book examples use `?? 20` | `PurchaseOrderService.cs:216` `?? 20`; `WorkOrderService.cs:33` `Math.Clamp(?? 10, 1, 100)` (built from the skill) | **Conflicting; both live** | **D4.** Recommend 10 with the clamp, since that is the newer, skill-built code; the book is then updated |
| C20 | Custom search endpoints | NEVER `Search…Async` or `[HttpPost("search")]`; always override `GetManyAsync` | Book silent | `JobEstimationController` keeps `[HttpPost("search")]` (its review records external compatibility); `JobController` adds `GET workshop-grid` for the mixed-source grid that skill §4.4 itself prescribes | **Skill rule too absolute; conflicts with skill §4.4** | Reword: the standard list overrides `GetManyAsync`; an extra read endpoint is allowed only with a recorded reason (compatibility or mixed-source) and uses `GET` + `ListSmBase` |
| C21 | Repository, tenant, detail-route conventions | `FindByIdAsync`, no `GetByIdAsync`; `SubscriptionId` stamped by the DbContext and immutable; details via `GetByWithNavigationsId/{id}` | Book silent or partial | `IRepository.cs:34`, `:61`, `:66`; `SiGmaDbContext.cs:419-470` throws if `SubscriptionId` changes; `SiGmaControllerBase.cs` exposes `GetById/{id}` and `GetByWithNavigationsId/{id}`, with no root `/{id}` | **Confirmed** | Adopt into backend blocks 5, 6, and 18 |

### Governance

| # | Rule | Current state | Verdict | Proposed resolution |
|---|---|---|---|---|
| G1 | Where the skill sits | Not in the authority order | **Missing** | **D0** (Option matrix below) |
| G2 | Learning protocol | `GEMINI.md`: update the skill automatically after every task. `AGENTS.md`: only verified, reusable guidance | **Conflicting** | Keep one protocol in `AGENTS.md`: a lesson lands in the skill **and** the owning book block in the same task, or is marked "pending promotion" in the skill's history |
| G3 | Feature-specific content in the skill | §2.5 (Job Estimation corners, Lubrication fields), §4.5 (Job approval lifecycle) | **Conflicting** with `AGENTS.md:10` | **D5.** Recommend moving it to the Job artifacts and keeping the generic lesson |
| G4 | Graphify | Hook plus "query first" versus root ban | **Conflicting** | **D6** |
| G5 | Versioning | None for the instruction layer | **Missing** | **D7** |
| G6 | Credentials in the Master guide | Third-party demo login in §2 | Hygiene | Move to an uncommitted local note |
| G7 | Command reference | Omits `Implement` as an authorising command | Drift | One-line fix |
| G8 | UI book governance | Duplicate backlog ID 31; about 3,000-character header changelog that re-stales every packet; backend header has no content-change row | Hygiene | Fix during S4 |

## Impact Map

| Area/contract | Producer/owner | Direct consumers | Persisted/calculation impact | Compatibility risk | Required phase |
|---|---|---|---|---|---|
| Authority model (D0) | `AGENTS.md` | Every agent and packet | None | High: decides which file wins in every later dispute | Plan only |
| UI rules C1 to C16 | Skill → UI book blocks 1, 4, 5, 6, 13, 15, 17, 22, 24, 30 | New and refactored screens; PHASE-02/03/04 packets | None | Medium: existing screens stay as they are until touched | Docs now; source in S8 |
| Backend rules C17 to C21 | Skill → backend book blocks 5, 6, 9, 13, 14, 15, 18, 19 | Backend agents; PHASE-01 packet | None (no schema change) | Low | Docs now |
| Packets | Manifest + templates | Phase agents | None | Every book edit re-stales packets; regenerate once | Owner runs generator |
| Tool entry points | `GEMINI.md`, folder `AGENTS.md`, hooks, memories | Gemini, Codex, WorkBuddy | None | Low | Docs now |
| Shared `app-data-table` fill mode | Frontend shared component | Every list using the C2 workaround | None | Medium: visual change across lists | S8 feature work (Phases 2 and 6) |

## Gap Decision Table

| Area | Current state | Decision | Target responsibility | Reason/evidence |
|---|---|---|---|---|
| Skill | Latest truth, but has 6 source-disproved or inaccurate items (C3, C12, C14, C15, C18, C20) plus feature-specific rows | **Refactor** | Operational digest; see D0 | Owner direction plus the source evidence above |
| UI book | Stale against the skill on 11 rows; wrong on backlog 33 | **Extend** | Canonical detail and rationale | Keeps packets meaningful |
| Backend book | Missing skill conventions C17, C19 to C21 | **Extend** | Same | Same |
| Master | Consistent; holds credentials | **Keep** + hygiene | Process authority | — |
| `AGENTS.md` | Authority order lacks the skill | **Refactor** (one section) | Workflow authority | G1 |
| `GEMINI.md` | Third rule set | **Replace** with a pointer | Entry point only | G2 |
| Folder `AGENTS.md` | Graphify instructions | **Refactor** after D6 | Entry point only | G4 |
| `.workbuddy-ai` memory | Contradictory copy | **Refactor** into a pointer plus tool-only lessons | Tool cache | Drift risk |
| Recipe manifest | Books only | **Extend** (optional, D0 option C) | Packet provenance | Lets `-Check` see skill drift |
| `app-data-table` | No fill mode | **Create** capability (S8) | Shared component | C2 |
| Historical `reviews/` | Mixed names and statuses | **Keep**; new convention going forward | Records | Frozen artifacts are historical |

## Option / Decision Matrix — D0, the authority model

| Option | Correctness | Ownership/maintainability | Compatibility/migration | Future extension | Complexity/risk | Decision/reason |
|---|---|---|---|---|---|---|
| **A. Skill on top**: the skill is canonical for screens; the books become background reference | Skill errors (C3, C18) become law until noticed | Two long documents still drift; packets fingerprint the wrong source | Packets and Master need rewording | Weak: the skill grows unbounded | Low effort now, high drift later | Not recommended |
| **B. Promote, then digest**: every skill rule is written into the owning book block in this change; the skill becomes a checklist-style digest that cites block numbers and may not hold a rule missing from a book | The skill's content survives intact, now inside the canonical store | One source per rule; the skill stays short and current | Packets pick up the skill's rules automatically on regeneration | Strong: the learning protocol writes both in one task | Medium: one large, careful edit | **Recommended** |
| **C. B plus the skill in the manifest**: as B, and add the skill as a fourth "book" so `-Check` detects when it changes without its book | As B | Adds a mechanical guard | Needs a manifest and template change | Strongest | Medium-plus | Recommended as a follow-up once B is done |
| **D. Merge and delete the skill**: fold everything into the books | Correct | One file type | Tools that load skills lose their entry point | — | Loses a useful per-screen checklist | Not recommended |

## Decision Review

| Decision requiring owner input | Options presented | Trade-offs explained | Owner decision | Evidence/date | Remaining condition |
|---|---|---|---|---|---|
| D0 Authority model | A / B / C / D | Matrix above | **B — promote, then digest** | Owner, 2026-09-28 | Option C may follow later |
| D1 Route host height (C1) | Keep the skill's calc / adopt container-fill | Calc depends on the shim in `styles.scss:153-167`; container-fill removes it | **Container-fill `height: 100%`** | Owner, 2026-09-28 | Legacy calc screens migrate when touched (S8) |
| D8 Page scroll (new owner requirement) | Page may scroll / page never scrolls; scrolling only inside components | The UI book allows relaxing bounded editors on mobile (block 14 and block 29 step 8); skill §2.4 forbids it | **The page never scrolls at any width. Exactly one scroll owner per region (grid rows, form pane, dialog body). Fixed parts (title, filters, footer actions, paginator) use `flex-shrink: 0`** | Owner, 2026-09-28 | UI book block 14 mobile-relaxation text and block 29 step 8 must be rewritten in S4 |
| D2 Calendar icon (C3) | Icon inside the input (`iconDisplay="input"`) / no icon | Source proves `showIcon` alone shows nothing | **No icon; remove `[showIcon]`** | Owner, 2026-09-28 | Backlog 32 sweep in S8 |
| D3 Filter strip margin (C7) | `0 8px 6px` / `0 0 6px` / `0 8px 16px` | Only `0 8px 6px` aligns with the title edge and skill §2.5 | **`margin: 0 8px 6px`** — delegated to Claude: aligns with the title edge and keeps the largest area for the single scroll owner (D8) | Owner delegated, 2026-09-28 | — |
| D4 Default page size (C19) | 10 with clamp 1–100 / 20 | Both exist in source | **10, clamped 1–100** | Owner, 2026-09-28 | — |
| D5 Feature-specific skill content (G3) | Move to Job artifacts / keep in the skill | `AGENTS.md:10` asks to move it | **Move to Job artifacts; keep generic lessons** | Owner, 2026-09-28 | — |
| D6 Graphify (G4) | Remove hook and text / allow for questions only / allow fully | Root ban versus folder instructions | **Remove hook and "query first" text; explicit request only** | Owner, 2026-09-28 | — |
| D7 Version control (G5) | Documentation repository `F:\My Work\Shaban Documents\Shaban` owns the whole instruction layer / new workspace repository / leave unversioned | Needed so every later slice has a reviewable diff | **Documentation repository `Shaban`** | Owner, 2026-09-28 | Owner performs the move and commits |

## Frozen Target Contract

| Contract | Target owner | Exact rule/shape | Consumers affected | Status/evidence |
|---|---|---|---|---|
| Authority | `AGENTS.md` | Master + books > packets > **skill (digest of books)** > approved reference > screenshots > inference. A skill rule without a book block is a defect | All agents | Frozen (D0 = B) |
| Learning | `AGENTS.md` | A verified lesson goes to the owning book block and the skill in the same task. If that is impossible, the skill history row says "pending promotion" | All agents | Frozen |
| Entry points | `GEMINI.md`, folder `AGENTS.md` | Pointer to the root file only, with no restated values | Gemini, Codex | Frozen |
| Scroll ownership | UI book block 1 (+ skill checklist) | `.app-content` never scrolls. Chain: `:host { height: 100%; overflow: hidden }` → page/panel `display: flex; flex-direction: column; min-height: 0; overflow: hidden` → fixed children `flex-shrink: 0` → one child `flex: 1 1 auto; min-height: 0; overflow: auto`. Holds at every breakpoint; narrow layouts rearrange panes but never hand scrolling to the page | All screens | Decided (D1 + D8) |
| UI rules | UI book blocks | C1 to C16 as resolved in the register | Screen work | Frozen |
| Backend rules | Backend book blocks | C17 to C21 as resolved | Backend work | Frozen |
| Artifacts | `AGENTS.md` | New artifacts start with a status table: `Status` (Frozen / Blocked / Implemented — source-only / Closed) and `Owner verification pending` (yes/no) | Future reviews | Frozen |
| Persistence, calculation, authorization, reports | — | No change; documentation only | — | Not applicable |

## Migration and Compatibility Plan

| Change | Existing data/consumers | Migration/backfill/default | Rollout order | Recovery/rollback | Owner action |
|---|---|---|---|---|---|
| Book and skill edits | Existing screens unaffected; the rules apply when a screen is next touched | None | After S1, so a diff exists | Revert the commit | Commit (agents may not) |
| Packet regeneration | Phase agents | Regenerate once after all S4 edits | After S4 | Revert the commit | Run `Generate-SigmaRecipes.ps1`, then `-Check` |
| `GEMINI.md` reduction | Gemini sessions | — | S2 | Revert | — |
| Removing the Graphify hook (if D6) | Codex sessions | — | S2 | Restore the file | Confirm in Codex |
| No schema or data change | — | — | — | — | No `Add-Migration` needed |

## Dependency-Ordered Implementation Plan

| Slice | Outcome | Depends on | PHASE packets | Main source areas | Completion evidence |
|---|---|---|---|---|---|
| S0 | Owner answers D0 to D7 | — | PLAN-00 | This file | Decision Review filled; status Frozen |
| S1 | Instruction layer under version control; baseline commit | D7 | — | Repository layout (owner-run) | A clean `git status` in the owning repository |
| S2 | Authority and entry points unified: `AGENTS.md` authority and learning sections, `GEMINI.md` pointer, folder `AGENTS.md` Graphify text, command reference note, hook per D6 | D0, D6 | — | Instruction files | Cross-file consistency grep (Verification Matrix) |
| S3 | Skill corrected: C3, C12, C14, C15, C18, C20, and C1/C7/C19 per D1/D3/D4; feature content per D5; each rule gains a status label and a book-block citation | D0 to D5 | — | `SKILL.md` | Every skill rule cites a block; no source-disproved item remains |
| S4 | Skill rules promoted into the UI and backend books; backlog 31 duplicate and backlog 33 value fixed; headers bumped once | S3 | — | Two books | Each register row marked Resolved with its block |
| S5 | Master hygiene (credentials), `README`, `PROJECT_MAP` date line | S2 | — | Master, README, map | Grep shows no password |
| S6 | Packets regenerated; templates stop restating numbers; optional manifest entry for the skill (D0 = C) | S4 | All PHASE packets | `recipe-system/` | Owner's `-Check` all OK, plus a semantic review note |
| S7 | Tool memories and artifact conventions: WorkBuddy memory reduced to a pointer; new artifact status table | S2 | — | `.workbuddy-ai`, `AGENTS.md` | Contradictory lines removed |
| S8 | Source follow-ups, planned as separate feature work: `app-data-table` fill mode (C2); calendar `showIcon` sweep (backlog 32); container-fill migration of the 34 calc screens if D1 = container-fill; authorization review of `DatabaseResetController` | S4 | PHASE-02, 05, 06 | Angular shared and features; .NET controller | Separate feature reviews |

S2 and S3 can run in parallel after S0, because they touch different files. S4
waits for S3. S8 is outside this plan's implementation authority.

## Verification Matrix

| Behavior/risk | Source verification | Automated verification | Runtime/browser/data verification | Owner | Gate |
|---|---|---|---|---|---|
| No two files state different values for one rule | Grep each key value (`100dvh`, `showIcon`, `readonlyInput`, `margin: 0 8px`, `PageSize ?? `, `BeginTransaction`) across all instruction files | — | — | Claude | Close S2 to S4 |
| Every skill rule has a book block | Rule-by-rule table in the S4 report | — | — | Claude | Close S4 |
| Packets current | Read-only recompute | `Generate-SigmaRecipes.ps1 -Check` | — | Owner | Close S6 |
| Rules produce correct screens | — | — | Master evolution procedure step 5: pilot one list/modal feature, one routed aggregate editor, and one state-transition feature against the updated skill | Owner | Before promoting further changes |
| Keyboard access with C5 | — | — | Tab into a dialog date field and confirm it can be typed; the panel opens on click | Owner | Pilot |
| No prohibited command run | Session record | — | — | Claude | Every slice |

## Open Decisions

| Decision | Status | Blocks slice | Required evidence/owner | Next action |
|---|---|---|---|---|
| — | — | — | — | All decisions recorded |
| C12 TS2339 cause | Uncertain | None (rationale only) | Owner build | Verify at the next build |
| Feature-level conformance of recent screens (Job, Job Estimation, Work Order) | Uncertain | None | Files not stageable at depth 8 | Check during the S8 pilots |

## Incidental source observations (outside this plan's scope)

- `DatabaseResetController` exposes reset endpoints (including `All` and `GoLive`) guarded only by `[Authorize]` and a configuration switch. Because Sigma has no role-based authorization (UI book block 26), any signed-in user can call them whenever the switch is on. Recommend an explicit owner review.
- `BaseComponentService` reads `subscriptionId` from `localStorage`; this relates to UI backlog items 8 and 19.

## Freeze decision

| Gate | Result/evidence |
|---|---|
| Existing state audited end to end | Yes, for documentation, shared frontend source, and backend bases. Feature-level files were not reachable |
| Required ambiguities resolved | Yes: D0 to D8 decided 2026-09-28 |
| Impact/direct consumers understood | Yes |
| Gap decisions explicit | Yes |
| Viable options compared | Yes (D0) |
| Target contracts frozen | Yes |
| Migration/compatibility defined | Yes (no data impact) |
| Implementation dependency order defined | Yes |
| Verification defined before coding | Yes |
| Final plan status | **Frozen** 2026-09-28 |

## Implementation record — 2026-09-28

Executed by Claude (Cowork) from the Frozen plan. Documentation only: no
application source changed, and no build, test, lint, migration, database,
browser, Graphify, commit, or push was run. Each file was staged, edited, and
written back with a modification-time guard, and the original of every file was
copied first to `reviews\_backup_2026-09-28\`. In the Master backup the two
credential rows are redacted.

| Slice | Status | Files | Notes |
|---|---|---|---|
| S1 Version control | **Owner action** | — | Move the instruction layer under the `Shaban` repository (D7) and commit. Commit the pending documentation change set first so this change is a separate diff |
| S2 Authority and entry points | Done | `AGENTS.md`; `GEMINI.md`; `SigmaBackend\AGENTS.md`; `SiGmaAngularFrontEnd\AGENTS.md`; both `.codex\hooks.json`; `SIGMA_COMMAND_REFERENCE_AR.md` | Skill in the authority order at level 3; learning protocol writes book and skill together; no-page-scroll rule; artifact status table; Graphify explicit-only; hooks emptied (`{"hooks": {}}`); `GEMINI.md` reduced to a pointer; command reference lists `Implement` |
| S3 Skill | Done | `.agents\skills\sigma-screen-refactor\SKILL.md`; `JOB_FEATURE_REVIEW.md`; `JOB_ESTIMATION_FEATURE_REVIEW.md` | Every section cites its book block; C1–C21 applied; new §2.3 no page scroll; §4.1 labelled Transitional; Job content relocated to the Job artifacts (appended, history kept) |
| S4 Books | Done | `SIGMA_UI_PATTERNS.md` 0.69; `SIGMA_BACKEND_PATTERNS.md` 0.17 | UI blocks 1, 4, 5, 6, 14, 15, 17, 22, 29, 30 plus change log; header shortened. Backend blocks 5, 6, 9, 18 plus header row |
| S5 Master and indexes | Done | `SIGMA_FEATURE_REVIEW_MASTER.md` 1.7; `sigma-erp\README.md`; `PROJECT_MAP.md` | Skill in the authority order and roles table; demo credentials removed. **They remain in Git history and in `sigma-erp.rar`**; rotate them if the repository is ever shared |
| S6 Packets | **Owner action** | Templates PHASE-02, PHASE-03, PHASE-05 updated | Recomputed fingerprints: all 8 packets are now stale (77 of 198 fingerprints changed), as expected. Run `Generate-SigmaRecipes.ps1`, then `-Check`, then a semantic read of PHASE-02 and PHASE-03 |
| S7 Tool memory | Done | `.workbuddy-ai\memory\MEMORY.md` | Marked as a cache; stale toolbar and paginator lines corrected; the contradictory `box-sizing` line removed |
| S8 Source follow-ups | Not started (separate feature work) | — | UI backlog 34 (`app-data-table` fill mode), 35 (34 legacy calc screens), 32 (`showIcon` sweep); `DatabaseResetController` authorization review |

Consistency check after the edits (grep across the instruction files): no
`calc(100dvh…)` host, `[showIcon]="true"`, `[readonlyInput]="true"`,
`[showOnFocus]="true"`, `margin: 0 0 6px`, `PageSize ?? 20`, or automatic
Graphify instruction remains, except where a file names it as forbidden or as
history.
