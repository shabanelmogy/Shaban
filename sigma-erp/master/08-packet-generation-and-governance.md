## 8. Packet generation and governance

Generated packets live under `recipe-system/generated/`. Their templates and
source dependencies live in `recipe-system/templates/` and
`recipe-manifest.json`.

### Packet rules

- Generated packets are never edited directly.
- Each packet declares exact canonical source-block dependencies.
- Each packet carries source fingerprints.
- Run `Generate-SigmaRecipes.ps1 -Check` before using a packet.
- Read-only companions in `recipe-system/`: `Check-Translations.ps1` (en/ar key parity, UI
  block 23) and `Check-BookReferences.ps1` (documentation links and block references by
  default; application paths/types/styles only inside explicitly supplied feature scopes).
  A documentation check must not trigger a full application-source scan.
- Keep packets current throughout each task (standing owner instruction,
  2026-10-09). After changing a canonical block, template or manifest dependency/
  reference, regenerate the affected packets in the same task, semantically
  review them and rerun `-Check` before use or handoff. Do not defer routine
  regeneration to the owner.
- When the initial check reports existing drift, reconcile stale template and
  manifest claims against canonical evidence, then regenerate and semantically
  review the affected packets before using them. Standing authorization covers
  derivative documentation maintenance during source-read-only reviews as well;
  it does not authorize application-source edits or new canonical decisions.
- Preserve unrelated changes and record refreshed packet IDs, check results and
  semantic-review evidence in the task review. When a required source is missing
  or a semantic conflict cannot be resolved from canonical evidence, do not use
  the affected packet; use canonical sources and report the precise blocker.
- Regeneration is followed by semantic review; a matching hash proves
  synchronization, not correctness.
- Manifest `approvedReferences` are reconciled against the canonical per-shape
  reference tables during semantic review. A green fingerprint check does not
  prove that a separately stored reference still has the correct role.
- Packet templates contain process and required outputs, not competing
  architectural authority.

### Packet families

- `PLAN-*` packets guide pre-implementation maintenance/evolution planning when
  current behavior must be understood and target contracts decided before phases.
- `PHASE-*` packets guide bounded review phases.
- `RECIPE-*` packets guide implementation for a known task shape.

A feature may require several phase packets and one implementation recipe. Phase
packets establish and reconcile contracts; task recipes implement an approved
shape.

### Current-state entry and execution skill (owner clarification, 2026-10-23)

The documentation README routes four current needs: create a new screen, review
an existing screen, inspect deferred decisions, and select the execution skill.
Both screen paths select the current catalog shape and read only their applicable
canonical blocks and packet. Apply Master1's proportional tiers before choosing
artifacts; a small correction does not acquire a full-feature workflow merely
because that template exists.

The screen skill is a short operational router into those same sources. It must
not become a second copy of all code examples, feature-specific decisions or
revision history. Keep its routing cited to the owning block, and retain a
dated revision row within the limit below. Superseded skill text, completed review records and old
changelog entries belong in clearly labelled archive folders. Active plans and
unresolved decisions remain discoverable; archive by lifecycle and supersession,
not age alone. Preserve frozen decisions and update callers when a file moves.

**Loadable instruction entry (owner-authorized Audit8 remediation, 2026-11-01).**
The workspace `AGENTS.md` keeps the critical authorization/prohibited-command
summary and the mandatory read link near its beginning. Its live continuation
is `F:\My Work\Sigma\.agents\SIGMA_WORKFLOW_RULES.md`: agents read it completely
before Sigma work through a file tool, rather than assuming automatic project
instruction discovery includes the companion. Both files form one instruction
set; this is relocation, not a second authority or an optional historical guide.
Maintain full workflow rules in the live companion and reconcile the entry's
summary in the same task when their meaning changes. Keep the automatically
loaded entry small enough for the host's combined global/project instruction
budget; do not solve growth only by raising that budget or discarding rules.
If the live continuation cannot be read, report the missing source and stop
dependent work instead of inferring authorization.

**Core and on-demand sections; one owner per rule (owner-requested speed
remediation, 2026-11-19).** The live companion is a short core that is always
read (authority order, modes, permissions, gates table, minimum handoff); its
section files under `.agents/workflow/` are read only when the task reaches
them. Each rule has exactly one owner; other files carry a one-line pointer,
not a restated copy. Dated owner-instruction history belongs in `CHANGELOG.md`,
not in live rule text. Packet templates, screen routing files (`ui/screens/`) and the
companion's section files are checklists: each item names its owning block or
topic file and restates no rule text or value; artifact tables they carry are
document structure, not rules. The screen catalog's "Topic files: when to open"
table is the single owner of topic-level routing. The skill holds a gate checklist and a pointer table
(concern → blocks and key shared owners) only; a new lesson goes into its
owning block and adds at most a routing keyword plus one dated revision row.
The skill keeps its five newest revision rows; older rows move to
`archive/SKILL_REVISION_HISTORY.md`. The review index `reviews/INDEX.md` is a
short table of recent work; feature artifacts are found by name
(`reviews/**/<FEATURE>_*.md`) and its earlier narrative is `reviews/INDEX_HISTORY.md`.

**Section-level reading and current-state files (2026-11-19).** Agents read a
large block, packet or review by section: list its headings, then read only the
needed line ranges. The skill routes to named sections (`UI20 §Filter bar`)
where a block holds several topics. A review that grows past 40 KB gets a
`<FEATURE>_CURRENT_STATE.md` of at most 4 KB beside it (status, latest round,
contracts in force, pending items, useful section headings); every later round
rewrites that file in the same task. The full review stays at its path so
existing links and anchors keep working.
Generated navigation indexes come from `recipe-system/New-CurrentStateIndexes.ps1`
(`Status` `Draft`, owner verification `no`, the full file's recorded status in a
separate row). `-Refresh -Apply` rewrites generated indexes only, never a written
summary, and removes a generated index once a written summary covers its files.

**Block topic folders (2026-11-19).** A block that covers several independent
topics keeps its number and main file (`ui/13-modal-with-tabs.md`) and moves each
topic into `<book>/<NN>/<nn>-<topic>.md`. The main file lists its topic files near
the top; a topic file is part of the same block, with the same status and
authority, so references such as "UI13" stay valid. `Generate-SigmaRecipes.ps1`
fingerprints the main file followed by its topic files, so a topic change makes
dependent packets stale. Agents read the main file's list and then only the
needed topic file. Blocks with topic folders: Master5, UI1, UI2, UI6, UI7, UI13, UI14, UI20,
UI22, UI24, BE14, BE15 and BE18.

**Language of agent-facing files (owner decision, 2026-11-19).** Files written
for agents — instructions, canonical blocks, packets, review/contract/plan
artifacts, `*_CURRENT_STATE.md` and `reviews/INDEX.md` — are written in English.
Replies to the owner follow the companion's Arabic communication rule, and the
in-app user guide remains bilingual application content. Existing Arabic
artifacts are not translated retroactively; a feature's next round writes its
current-state file in English.

**Rule text without history (2026-11-19).** A canonical block states the current
rule. When a correction or owner clarification changes a rule, rewrite the rule
in place and record the date, source and superseded wording in `CHANGELOG.md`;
do not append a dated note beside the old text. Heading dates are kept only
where links depend on the anchor.

`Check-BookReferences.ps1` enforces these size budgets and fails when one is
exceeded: `AGENTS.md` 8 KB, the companion core 14 KB, each companion section
file 12 KB, the skill 15 KB, `reviews/INDEX.md` 12 KB, each
`*_CURRENT_STATE.md` 4 KB, and fails a current-state file without an allowed
`Status` and `Owner verification pending` row. It warns (without failing) for a canonical block over
30 KB and a review artifact over 40 KB that has no current-state file. It also
reports paragraphs repeated verbatim across the instruction files. Raise a budget only
by an explicit owner decision recorded here, never to absorb restated rules.

The screen skill routes tasks and conditional concerns to their complete current
book blocks. Do not reload archived skill snapshots to execute a new task: the
books retain the implementation rules. Keep traceable coverage evidence when
compacting the router and promote any verified missing owner before removing
its sole live instruction. Process skills such as Superpowers may assist
planning, diagnosis, execution and review; they complement Sigma's domain skill
and do not replace project authority, frozen contracts or execution permissions.

State the current approved target separately from source that has not migrated
to it. A source verification date names the checked scope; a targeted check does
not certify every example or an application's runtime. Archive content has no
independent authority and is read only for a named historical decision.

### Applying a documentation change

1. Change the applicable canonical source.
2. Update dependencies or templates when semantics change.
3. Regenerate affected packets.
4. Run check mode.
5. Pilot material boundary changes on a simple list/modal feature, a routed
   aggregate editor, and a state-transition feature.
6. Compare missed, duplicate, and cross-phase findings.
7. Promote the change only after the master, canonical books, templates,
   generated packets, and workspace instructions agree.
