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
  block 23) and `Check-BookReferences.ps1` (every path and cross-reference the books name exists).
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

### Documentation-system evolution procedure

1. Change the applicable canonical source.
2. Update dependencies or templates when semantics change.
3. Regenerate affected packets.
4. Run check mode.
5. Pilot material boundary changes on a simple list/modal feature, a routed
   aggregate editor, and a state-transition feature.
6. Compare missed, duplicate, and cross-phase findings.
7. Promote the change only after the master, canonical books, templates,
   generated packets, and workspace instructions agree.
