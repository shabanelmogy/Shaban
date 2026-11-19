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
revision history. Keep its current rules cited to the owning block, and retain a
dated revision row. Superseded skill text, completed review records and old
changelog entries belong in clearly labelled archive folders. Active plans and
unresolved decisions remain discoverable; archive by lifecycle and supersession,
not age alone. Preserve frozen decisions and update callers when a file moves.

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
