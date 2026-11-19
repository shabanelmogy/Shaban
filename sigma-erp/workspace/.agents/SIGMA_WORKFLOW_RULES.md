# Sigma workflow rules — live companion (core)

This is the mandatory live continuation of the workspace `AGENTS.md`. Read this
core completely before Sigma work. It owns scope, authority, modes, permissions
and the minimum handoff. Detailed sections live in `.agents/workflow/` and are
read **only when the task reaches them** (table below). Edit the owning rule
where it lives; update the `AGENTS.md` summary in the same task if its meaning
changes. Relative workspace paths resolve from `F:\My Work\Sigma`.

Restructured 2026-11-19 (owner-requested speed/error remediation). The previous
full text is preserved verbatim in the documentation archive
`archive/2026-11-19-instruction-slimming/`; dated rule history lives in the
documentation `CHANGELOG.md`, not here. Archives are not rule sources.

| Read this section file | When |
|---|---|
| [workflow/guides-and-packets.md](workflow/guides-and-packets.md) | Using generated packets, selecting shapes, or maintaining books/packets |
| [workflow/implementation-rules.md](workflow/implementation-rules.md) | Any authorized source edit (frontend/backend rules, migrations, database evidence, diff and build verification) |
| [workflow/artifacts-and-report.md](workflow/artifacts-and-report.md) | Writing a review/contract/plan artifact or a tier M/L final report |
| [workflow/delegation.md](workflow/delegation.md) | Only when considering subagents |

## 1. Authority order

This is the single precedence list; other files point here.

1. The user's explicit instruction for the current task, within section 4.
2. Frozen feature contracts for that feature.
3. Workspace rules: `AGENTS.md` and this companion (scope, workflow, permissions,
   evidence, reporting).
4. Master Guide plus the applicable canonical UI/backend blocks.
5. The applicable generated packet, after the drift check.
6. The `sigma-screen-refactor` skill — a routing digest of level 4; it may not
   introduce a rule that level 4 lacks (report such a rule as a defect).
7. The approved project reference for the specific shape.
8. Screenshots — functional requirements and visible content only.
9. Labelled reviewer inference supported by evidence.

For **facts** about current behavior, actual source wins over any document;
report the documentation drift. Caches, tool memories, archives and historical
records are not rule sources. Record any conflict you resolve.

## 2. Task modes and commands

- **Read-only means source-read-only.** An unqualified review/assess/audit, a
  `Verify`, `Existing-State Audit`, `Impact Analysis` or `Feature Review
  end-to-end` request edits no application source, configuration or instruction
  file. It may create/update the prescribed review artifacts. "Report only,
  write no files" is a separate explicit instruction.
- **Plan** stops at the plan. **A named phase** executes only that phase and
  stops at its handoff. A Blocked handoff stops that phase with the exact decision;
  a later phase starts only when it is Frozen or reviewer assumptions are approved.
- **Implement / fix / refactor** (named or direct) authorizes the confirmed
  in-scope implementation in one pass: freeze consumed contracts, implement,
  review the scoped diff, reconcile, and deliver the in-app user guide for an
  authorized screen. Do not stop at a plan when authorization and decisions are
  resolved. Pause only the slice that depends on an exact Missing/Conflicting/
  Uncertain material business, API, financial, permission or state decision.
- **"run review and refactor direct"** / **"run make all review and refactor"**:
  Phase 0 discovery and Phase 1 freeze, then every applicable implementation and
  reconciliation phase in the same task.
- **"approve reviewer assumptions"**: conservative, enumerated, source-supported,
  low-risk implementation choices only, each recorded with evidence in the
  contract. It never resolves a genuinely Missing API shape, field, permission,
  business invariant, state transition or destructive-action rule.
- **Screenshots** are functional/content evidence only; never copy their design
  over an approved pattern. When the request asks to complete the business a
  screenshot shows, follow Master2 "Screenshot-backed scope from the user
  request": the request approves what the screenshot proves; the reviewer
  resolves unprovable details with the closest correct source-supported option
  (recorded and reported); data destruction, access restrictions and accounting
  effects still wait for the user. Videos and written notes are workflow and
  business-rule references.
- Ordinary questions and questions about these instructions are not commands.

| Command (English · Arabic) | Behaviour |
|---|---|
| `Plan <feature>` · `خطط لـ <الميزة>` | Plan, then stop |
| `Review <feature>` · `راجع <الميزة>` | Read-only findings and drift |
| `Review … and implement the confirmed fixes` · `راجع … ونفذ الإصلاحات المؤكدة` | Implement findings supported by guides and frozen contracts |
| `Implement <feature>` · `نفذ <الميزة>` | Implement the frozen plan/contracts in one pass |
| `Verify <feature>` · `تحقق من <الميزة>` | Report-only Phase 6 comparison; scoped builds and experimental-database reads allowed |
| `Close <feature>` · `اقفل <الميزة>` | Phase 6 reconciliation and closure |
| `Maintenance / Evolution Plan <topic>` | PLAN-00: end-to-end current state, Impact Map, Keep/Extend/Refactor/Replace/Create/Remove, open decisions; stop at the plan |
| `Feature Review end-to-end` | Read-only Phases 0–6 report; no source edits |
| `Contract-First Split Review` | Freeze shared domain/API contract, then review both layers against it |
| `Existing-State Audit` / `Impact Analysis` | Read-only inventory / impact map |
| Phase names: `Shared discovery and contract freeze review`, `Backend review`, `Frontend review`, `Final reconciliation` | That phase only |

The Arabic quick reference `SIGMA_COMMAND_REFERENCE_AR.md` carries no authority
of its own and grants nothing this file does not.

## 3. Proportional tier and opening

Choose Master1's tier before anything else: **S** (one element/rule), **M** (one
screen/feature), **L** (new feature, module or cross-cutting change). When in
doubt take the larger tier; move up if the work grows.

Before application-source investigation give Master1's opening disclosure,
scaled to the tier: tier S is one line (scope/mode, owning block, verification
boundary); tiers M/L also name the Speed guide/explanations, Speed code as a
separate step, relevant Odoo documents after Speed, the Sigma and process skills
(verified availability) and planned versus actually read sources. It adds no
approval gate. Name the selected UI/backend shapes after discovery.

**Read sections, not whole files.** For a block, packet or review over 20 KB,
list its headings first and read only the needed sections by line range. Read a
feature's `<FEATURE>_CURRENT_STATE.md` before its full review (Master8).

## 4. Permissions

| Allowed without asking (within the requested task) | Requires the user's explicit request | Never without separate explicit authorization |
|---|---|---|
| Scoped local builds of affected projects, including a changed test project (Master5) | Browser automation / application verification (limited to the requested screen and workflow) | Production or out-of-project databases |
| Scoped tests for changed code and lint of changed files during authorized implementation (Master5) | Full test suites, end-to-end runs | Full data reset, database drop |
| Reads, writes, scoped repairs and experimental-duplicate deletion in verified Sigma local/hosted development/test databases (Master1) | Commits, pushes, deployments | Mutating other external systems |
| Creating and applying the scoped EF migration an authorized implementation needs, on the verified experimental database (Master1/7) | Graphify (current task only; state `graphify-out/` build date) | Editing generated packets directly |
| Regenerating packets through the generator after canonical changes (documentation maintenance) | Migrations outside an authorized implementation's scope | Reading retired `SIGMA_FRONTEND_REVIEW_GUIDE.md` / `SIGMA_BACKEND_REVIEW_GUIDE.md` (any copy) |

Also prohibited: the Sigma MCP server, full-solution scanning, unrelated
refactoring, uncontrolled or overlapping subagents, delegation before shared
contracts are frozen, and modifying approved reference modules outside explicit
scope. Skills and documents grant no extra permission. Verify the actual
database target and bounded scope before any database write and record what ran.

**Experimental data (Master1 owns).** Current Sigma data is experimental: build
the correct clean-start model; never add compatibility paths, fallbacks or
weakened validation to keep old experimental rows working.

## 5. Evidence gates for screen/API work

Apply the gate checklist in the `sigma-screen-refactor` skill; the blocks below
own the full rules. Keep tier S limited to the affected element.

| Gate | Owner |
|---|---|
| Speed guide + dated code first, pinned Odoo only for remaining gaps; reference functional detail is the target; map to real Sigma source/contract/guide | Master2/4/7 |
| Loading: one visible owner per request; routed initial/filter lookups use the page loader, dialogs local, cache refresh silent | UI22, Master5 |
| Cache: classify every consumed read and trace its lifecycle | UI2, Master5 |
| Load speed, queries and index evidence; no speed claim from source alone | Master5, UI29, BE2/7 |
| Shared PrimeNG-based owners first; extend or extract shared, apply general presentation requests generally | Master5 |
| Numeric domains: quantities/fractional hours/meters → shared quantity policy; counts/identities integers; money → financial policy; no accidental precision | BE18, UI14/19 |
| Authorization: route/action owners and real endpoint enforcement | UI26, BE9, Master4/7 |

## 6. Scope

Review/change only the requested feature and its directly related Angular
and/or .NET files (backend-only and frontend-only scopes are valid). Preserve
architecture, API conventions, confirmed permissions and invariants, RTL,
responsive, light and dark themes unless the instruction or a frozen contract
changes them; then update every in-scope producer and consumer together.
Within scope, inspect and update the directly related routing, list, details,
forms/modals, templates, styles, typed models, payloads, services, translations,
permissions, loading/empty/validation/error states, confirmations, endpoints,
entities, EF configuration, DTOs, mappings, transactions and domain calculations.
Preserve unrelated user and peer changes in the working tree.

## 7. Minimum handoff (every implementation)

- Review the complete scoped diff in each actual repository
  (`SiGmaAngularFrontEnd`, `SigmaBackend`); the workspace root is not a Git
  repository. Use a per-command `git -c safe.directory=<repo> -C <repo>` if
  ownership protection blocks a read; never change global Git config.
- Report separately: source conformance, build (target + outcome), tests and
  lint (command + count + outcome), and anything pending (runtime, browser,
  visual, SQL timing). Never describe an unexecuted step as done.
- Tier S report: files changed, the decision and its owning block, verification
  results, owner check. Tier M/L: the full report in
  `workflow/artifacts-and-report.md`.
- Suggest (never run) a commit message per affected repository.

## 8. Communication

When responding in Arabic, start every paragraph and list item with Arabic text;
write complete Arabic questions with short, unambiguous Arabic choices; keep
paths, identifiers and code on their own lines or in fenced blocks rather than
inside right-to-left sentences; use Arabic action names in progress and final
reports. This governs communication only, not application language. Keep
progress and reports proportional to the work.

**Files are English (owner decision, 2026-11-19).** Write every agent-facing file
— review, contract, plan and current-state artifacts, `reviews/INDEX.md`
rows, canonical blocks and instructions — in English. Only replies to the owner
are Arabic. The in-app user guide stays bilingual (Master7). Existing Arabic
artifacts are not translated retroactively (Master8).

## 9. Maintaining these instructions

- One rule, one owner. Other files carry a one-line pointer, never a restated
  copy. Dated "owner instruction" history goes to `CHANGELOG.md`.
- **Learning protocol.** Verified reusable guidance goes into its owning
  canonical block. The skill receives only a routing pointer (a table row or
  keyword) when a new concern appears, plus one dated revision row; it keeps the
  five newest rows and moves older ones to
  `archive/SKILL_REVISION_HISTORY.md`. If the book cannot be updated in the task,
  add the skill row marked `pending promotion` and report it. Feature decisions
  stay in feature contracts.
- After changing books, templates or the manifest: regenerate packets, review
  their meaning, and rerun both checks (the reference check also enforces the
  size budgets):

```powershell
& 'F:\My Work\Shaban Documents\Shaban\sigma-erp\recipe-system\Generate-SigmaRecipes.ps1' -Check
& 'F:\My Work\Shaban Documents\Shaban\sigma-erp\recipe-system\Check-BookReferences.ps1'
```
